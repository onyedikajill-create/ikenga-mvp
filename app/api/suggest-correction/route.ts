// ============================================================
// POST /api/suggest-correction
// User submits a correction suggestion.
// Auto-vetting via Claude produces a confidence score:
//   ≥ 0.85 → auto-apply (status: 'applied')
//   0.60–0.84 → flag for admin review (status: 'flagged')
//   < 0.60 → reject with feedback (status: 'rejected')
// Accepted corrections award points automatically.
// ============================================================

import { getSessionEmail } from "@/src/ikenga/lib/session";
import { supabase } from "@/src/ikenga/lib/supabase";
import { getAnthropicApiKey } from "@/src/ikenga/lib/aiConfig";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORRECTION_POINTS: Record<string, number> = {
  typo:         5,
  pronunciation: 10,
  cultural:     25,
  translation:  15,
  new_content:  50,
  batch:        100,
};

// ── AI vetting ────────────────────────────────────────────────

async function vetCorrection(
  original:       string,
  suggested:      string,
  correctionType: string,
  reason:         string,
): Promise<{ score: number; reasoning: string }> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) return { score: 0.5, reasoning: "AI vetting unavailable — flagged for manual review." };

  const client = new Anthropic({ apiKey });

  const prompt = `You are a cultural and linguistic quality reviewer for IKENGA, a platform built around Igbo (Nigerian) cultural content and brand strategy.

A user has submitted a correction suggestion. Evaluate its quality and correctness.

Correction type: ${correctionType}
Original text: "${original}"
Suggested correction: "${suggested}"
User's reason: "${reason || "No reason provided"}"

Your task:
1. Assess whether the suggested text is genuinely more accurate, culturally correct, or linguistically better than the original.
2. Consider: Is this a clear improvement? Is it factually/culturally sound? Does it align with Igbo cultural accuracy?
3. Return a JSON object ONLY with this exact shape (no markdown, no commentary):
{"score": 0.0, "reasoning": "brief explanation"}

Score guide:
- 0.85–1.0: Clearly correct, should be auto-applied
- 0.60–0.84: Probably correct, needs human review
- 0.0–0.59: Incorrect, harmful, or spam — reject

Return ONLY the JSON object.`;

  try {
    const msg = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages:   [{ role: "user", content: prompt }],
    });
    const text = msg.content.find(b => b.type === "text")?.text?.trim() ?? "";
    const parsed = JSON.parse(text) as { score: number; reasoning: string };
    return { score: Math.max(0, Math.min(1, parsed.score)), reasoning: parsed.reasoning };
  } catch {
    return { score: 0.6, reasoning: "AI vetting error — flagged for manual review." };
  }
}

// ── Award points ──────────────────────────────────────────────

async function awardPoints(email: string, correctionType: string, suggestionId: string) {
  const points = CORRECTION_POINTS[correctionType] ?? 10;
  await supabase.from("user_points").insert({
    email,
    event:    `correction_accepted`,
    points,
    metadata: { suggestion_id: suggestionId, correction_type: correctionType },
  });
  // Update total
  const { data: current } = await supabase
    .from("user_point_totals")
    .select("total_points")
    .eq("email", email)
    .maybeSingle();
  const newTotal = (current?.total_points ?? 0) + points;
  await supabase.from("user_point_totals").upsert({ email, total_points: newTotal, updated_at: new Date().toISOString() }, { onConflict: "email" });
}

// ── POST handler ──────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const email = await getSessionEmail();
  if (!email) return Response.json({ error: "Not logged in." }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { contentId, contentType, originalText, suggestedText, reason, correctionType } = body;

  if (!originalText || !suggestedText) {
    return Response.json({ error: "originalText and suggestedText are required." }, { status: 400 });
  }
  if (String(suggestedText).trim() === String(originalText).trim()) {
    return Response.json({ error: "Suggestion is identical to the original." }, { status: 400 });
  }

  const type = String(correctionType ?? "typo");

  // Run AI vetting
  const { score, reasoning } = await vetCorrection(
    String(originalText),
    String(suggestedText),
    type,
    String(reason ?? ""),
  );

  // Determine status
  let status: string;
  if (score >= 0.85)      status = "applied";
  else if (score >= 0.60) status = "flagged";
  else                    status = "rejected";

  const now = new Date().toISOString();

  // Insert suggestion
  const { data: inserted, error: insertErr } = await supabase
    .from("correction_suggestions")
    .insert({
      user_email:         email,
      content_id:         String(contentId ?? ""),
      content_type:       String(contentType ?? "library"),
      original_text:      String(originalText),
      suggested_text:     String(suggestedText),
      reason:             String(reason ?? ""),
      correction_type:    type,
      status,
      verification_score: score,
      rejection_reason:   status === "rejected" ? reasoning : null,
      applied_at:         status === "applied" ? now : null,
      resolved_at:        status !== "pending" ? now : null,
      points_awarded:     status === "applied" ? (CORRECTION_POINTS[type] ?? 10) : 0,
    })
    .select("id")
    .maybeSingle();

  if (insertErr) {
    // Table may not exist yet — return soft response
    return Response.json({
      status:    "flagged",
      message:   "Correction received. Database table not yet provisioned — run corrections_schema.sql.",
      score,
    });
  }

  // Award points if auto-applied
  if (status === "applied" && inserted?.id) {
    await awardPoints(email, type, inserted.id).catch(() => {});
  }

  const messages: Record<string, string> = {
    applied:  `Correction applied automatically! You earned ${CORRECTION_POINTS[type] ?? 10} Chi points.`,
    flagged:  "Thank you — your correction is under review by our team.",
    rejected: `Correction not accepted: ${reasoning}`,
  };

  return Response.json({
    status,
    message:      messages[status],
    score:        Math.round(score * 100),
    pointsAwarded: status === "applied" ? (CORRECTION_POINTS[type] ?? 10) : 0,
  });
}
