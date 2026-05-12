// POST /api/feedback — thumbs up or down on a content item
// Triggers Chi Profile learning: rule-based tone adjustment
// after every 3 consecutive signals in same direction.

import { supabase } from "../../../src/ikenga/lib/supabase";
import { getSessionEmail } from "../../../src/ikenga/lib/session";
import { awardPoints } from "../points/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Tone fallback chain ───────────────────────────────────────
// When current tone underperforms, shift to the next in chain.
const TONE_FALLBACK: Record<string, string> = {
  "bold":        "confident",
  "confident":   "authoritative",
  "authoritative": "warm",
  "warm":        "conversational",
  "conversational": "direct",
  "direct":      "bold",   // cycle
};

async function updateChiProfile(email: string, signal: "up" | "down", product: string) {
  // Read or create Chi Profile
  const { data: existing } = await supabase
    .from("chi_profiles")
    .select("preferred_tone, thumbs_up_count, thumbs_down_count, recent_signals, tone_weights, favorite_engine")
    .eq("email", email)
    .maybeSingle();

  const isUp   = signal === "up";
  const upCount   = (existing?.thumbs_up_count   ?? 0) + (isUp   ? 1 : 0);
  const downCount = (existing?.thumbs_down_count  ?? 0) + (!isUp  ? 1 : 0);

  // Recent signals: keep last 5
  const recentRaw = Array.isArray(existing?.recent_signals) ? existing.recent_signals as string[] : [];
  const recent = [...recentRaw.slice(-4), signal];

  // Rule: if last 3 signals are all 'down' → shift tone
  let preferredTone = existing?.preferred_tone ?? "bold";
  const lastThree = recent.slice(-3);
  if (lastThree.length === 3 && lastThree.every(s => s === "down")) {
    preferredTone = TONE_FALLBACK[preferredTone] ?? "confident";
    // Record a learning insight
    void supabase.from("learning_insights").insert({
      insight_type: "tone_performance",
      engine:       product,
      insight_data: { email, old_tone: existing?.preferred_tone, new_tone: preferredTone, trigger: "3_consecutive_down" },
      confidence_score: 0.7,
    });
  }

  // Tone weights: track signal per engine
  const weights = (existing?.tone_weights as Record<string, number> | null) ?? {};
  weights[product] = (weights[product] ?? 0) + (isUp ? 1 : -1);

  // Update favorite engine to most-used (highest positive weight)
  const favoriteEngine = Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "IKENGA";

  await supabase.from("chi_profiles").upsert({
    email,
    preferred_tone:    preferredTone,
    favorite_engine:   favoriteEngine,
    thumbs_up_count:   upCount,
    thumbs_down_count: downCount,
    recent_signals:    recent,
    tone_weights:      weights,
    last_learning_at:  new Date().toISOString(),
    updated_at:        new Date().toISOString(),
  }, { onConflict: "email" });
}

export async function POST(request: Request): Promise<Response> {
  const email = await getSessionEmail();
  if (!email) return Response.json({ error: "Not logged in." }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const itemId  = typeof body.itemId  === "string" ? body.itemId  : "";
  const signal  = typeof body.signal  === "string" ? body.signal  : "";
  const product = typeof body.product === "string" ? body.product : "IKENGA";

  if (!itemId || !["up", "down"].includes(signal)) {
    return Response.json({ error: "itemId and signal ('up'|'down') are required." }, { status: 400 });
  }

  // Record feedback
  const { error } = await supabase
    .from("content_feedback")
    .upsert({ email, item_id: itemId, product, signal }, { onConflict: "email,item_id" });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  void supabase.from("user_events").insert({ email, event: "feedback", product, metadata: { item_id: itemId, signal } });

  // Award feedback points + update Chi Profile (non-blocking)
  void awardPoints(email, "feedback", { product, signal }).catch(() => {});
  void updateChiProfile(email, signal as "up" | "down", product).catch(() => {});

  return Response.json({ success: true, signal });
}
