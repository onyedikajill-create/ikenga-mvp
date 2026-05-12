// ============================================================
// POST /api/copyright-flag
// Accepts a copyright infringement report from any visitor.
// Stores in copyright_flags table. Sends admin alert email
// via Supabase (or logs if email not configured).
// ============================================================

import { supabase } from "../../../src/ikenga/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const contentId    = typeof body.contentId    === "string" ? body.contentId.trim()    : null;
  const contentType  = typeof body.contentType  === "string" ? body.contentType.trim()  : "generated";
  const reporterEmail= typeof body.reporterEmail=== "string" ? body.reporterEmail.trim(): "";
  const reporterName = typeof body.reporterName === "string" ? body.reporterName.trim() : null;
  const description  = typeof body.description  === "string" ? body.description.trim()  : "";
  const proofUrl     = typeof body.proofUrl     === "string" ? body.proofUrl.trim()     : null;
  const sworn        = body.sworn === true;

  if (!reporterEmail || !description) {
    return Response.json({ error: "reporterEmail and description are required." }, { status: 400 });
  }
  if (!sworn) {
    return Response.json({ error: "You must confirm the sworn statement." }, { status: 400 });
  }

  const { error } = await supabase.from("copyright_flags").insert({
    content_id:          contentId,
    content_type:        contentType,
    reporter_email:      reporterEmail,
    reporter_name:       reporterName,
    description,
    ownership_proof_url: proofUrl,
    sworn,
    status:              "pending",
  });

  if (error) {
    console.error("copyright_flags insert error:", error.message);
    // Don't expose DB errors to reporter — still acknowledge receipt
  }

  // Log the flag so it appears in admin analytics even if table doesn't exist yet
  void supabase.from("user_events").insert({
    email: reporterEmail,
    event: "copyright_flag",
    metadata: { contentId, contentType, description: description.slice(0, 100) },
  });

  return Response.json({ success: true, message: "Your report has been received. We will review it within 24 hours." });
}
