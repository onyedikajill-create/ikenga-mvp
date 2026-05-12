// ============================================================
// POST /api/refund/request
// Forensic Value Guarantee — auto-approve only if zero value delivered.
// All activity is documented. Fraudulent claims → permanent ban.
// ============================================================

import { supabase } from "../../../../src/ikenga/lib/supabase";
import { getSessionEmail } from "../../../../src/ikenga/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ForensicSnapshot {
  totalGenerations: number;
  totalContentItems: number;
  totalCopied: number;
  totalPublished: number;
  totalFeedback: number;
  totalPoints: number;
  accountAgeDays: number;
  paymentRef: string | null;
  paymentDate: string | null;
  daysSincePayment: number | null;
}

async function buildForensicSnapshot(email: string, paymentRef: string | null): Promise<ForensicSnapshot> {
  // Count generations
  const { count: genCount } = await supabase
    .from("generation_logs")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .ilike("label", "%complete%");

  // Count content items
  const { count: itemCount } = await supabase
    .from("content_items")
    .select("id", { count: "exact", head: true })
    .eq("email", email);

  // Count copies + publishes
  const { count: copiedCount } = await supabase
    .from("content_items")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .eq("copied", true);

  const { count: publishedCount } = await supabase
    .from("content_items")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .eq("published", true);

  // Count feedback
  const { count: feedbackCount } = await supabase
    .from("content_feedback")
    .select("id", { count: "exact", head: true })
    .eq("email", email);

  // Points
  const { data: ptData } = await supabase
    .from("user_point_totals")
    .select("total_points")
    .eq("email", email)
    .maybeSingle();

  // Account age
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("created_at")
    .eq("email", email)
    .maybeSingle();
  const created = profile?.created_at ? new Date(profile.created_at) : new Date();
  const accountAgeDays = Math.floor((Date.now() - created.getTime()) / 86400000);

  // Payment date
  let paymentDate: string | null = null;
  let daysSincePayment: number | null = null;
  if (paymentRef) {
    const { data: payment } = await supabase
      .from("payment_requests")
      .select("created_at")
      .eq("unique_ref", paymentRef)
      .maybeSingle();
    if (payment?.created_at) {
      paymentDate = payment.created_at;
      daysSincePayment = Math.floor((Date.now() - new Date(paymentDate).getTime()) / 86400000);
    }
  }

  return {
    totalGenerations:  genCount  ?? 0,
    totalContentItems: itemCount ?? 0,
    totalCopied:       copiedCount   ?? 0,
    totalPublished:    publishedCount ?? 0,
    totalFeedback:     feedbackCount ?? 0,
    totalPoints:       ptData?.total_points ?? 0,
    accountAgeDays,
    paymentRef,
    paymentDate,
    daysSincePayment,
  };
}

function autoDecide(snapshot: ForensicSnapshot): { approved: boolean; reason: string } {
  // Reject if ANY value was delivered
  if (snapshot.totalGenerations > 0) {
    return { approved: false, reason: `You completed ${snapshot.totalGenerations} generation(s). Value was delivered.` };
  }
  if (snapshot.totalContentItems > 0) {
    return { approved: false, reason: `${snapshot.totalContentItems} content item(s) were saved to your account. Value was delivered.` };
  }
  if (snapshot.totalCopied > 0) {
    return { approved: false, reason: `You copied ${snapshot.totalCopied} item(s). Value was used.` };
  }
  if (snapshot.totalPublished > 0) {
    return { approved: false, reason: `You published ${snapshot.totalPublished} item(s). Value was used.` };
  }
  if (snapshot.totalPoints > 50) {
    // More than signup points means they did something
    return { approved: false, reason: `You earned ${snapshot.totalPoints} points during your session, indicating platform engagement beyond signup.` };
  }
  if (snapshot.daysSincePayment !== null && snapshot.daysSincePayment > 7) {
    return { approved: false, reason: `Refund requested ${snapshot.daysSincePayment} days after payment. Our refund window is 7 days.` };
  }

  // No value delivered within 7 days → approve
  return { approved: true, reason: "No value was delivered during your session. Refund approved." };
}

export async function POST(request: Request): Promise<Response> {
  const email = await getSessionEmail();
  if (!email) return Response.json({ error: "Not logged in." }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }

  const reason     = typeof body.reason     === "string" ? body.reason.trim()     : "";
  const paymentRef = typeof body.paymentRef === "string" ? body.paymentRef.trim() : null;

  if (!reason) return Response.json({ error: "reason is required." }, { status: 400 });

  // Build forensic snapshot
  const snapshot = await buildForensicSnapshot(email, paymentRef);

  // Auto-decision
  const decision = autoDecide(snapshot);

  // Save request
  const { data: inserted, error } = await supabase
    .from("refund_requests")
    .insert({
      email,
      payment_ref:       paymentRef,
      reason,
      status:            decision.approved ? "approved" : "rejected",
      auto_decision:     true,
      rejection_reason:  decision.approved ? null : decision.reason,
      forensic_snapshot: snapshot as unknown as Record<string, unknown>,
      resolved_at:       new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("refund_requests insert error:", error.message);
  }

  // If approved — downgrade user to free tier and revoke Pro
  if (decision.approved) {
    await supabase
      .from("user_profiles")
      .update({ tier: "free", pro_type: null, pro_expires: null })
      .eq("email", email);
    void supabase.from("user_events").insert({
      email, event: "refund_approved",
      metadata: { refund_id: inserted?.id, snapshot },
    });
  } else {
    void supabase.from("user_events").insert({
      email, event: "refund_rejected",
      metadata: { refund_id: inserted?.id, rejection_reason: decision.reason, snapshot },
    });
  }

  return Response.json({
    decision:       decision.approved ? "approved" : "rejected",
    message:        decision.reason,
    yourActivity:   {
      generations:  snapshot.totalGenerations,
      contentSaved: snapshot.totalContentItems,
      itemsCopied:  snapshot.totalCopied,
      daysSincePay: snapshot.daysSincePayment,
    },
    refundId: inserted?.id ?? null,
  });
}
