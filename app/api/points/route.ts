// ============================================================
// GET  /api/points — get calling user's points, rank, badges
// POST /api/points — internal: award points + check badges
// ============================================================

import { supabase } from "../../../src/ikenga/lib/supabase";
import { getSessionEmail } from "../../../src/ikenga/lib/session";
import {
  POINT_VALUES,
  BADGES,
  getRank,
  type PointEvent,
} from "../../../src/ikenga/lib/points";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── GET — user's own points data ─────────────────────────────

export async function GET(): Promise<Response> {
  const email = await getSessionEmail();
  if (!email) return Response.json({ error: "Not logged in." }, { status: 401 });

  // Totals
  const { data: totals } = await supabase
    .from("user_point_totals")
    .select("total_points, chi_rank")
    .eq("email", email)
    .maybeSingle();

  // Badges
  const { data: badges } = await supabase
    .from("user_badges")
    .select("badge_id, badge_name, earned_at")
    .eq("email", email)
    .order("earned_at", { ascending: false });

  // Recent point events
  const { data: recent } = await supabase
    .from("user_points")
    .select("event, points, metadata, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(20);

  const pts = totals?.total_points ?? 0;
  const rank = getRank(pts);

  return Response.json({
    points:    pts,
    chiRank:   rank.rank,
    rankColor: rank.color,
    meaning:   rank.meaning,
    badges:    badges ?? [],
    recent:    recent ?? [],
  });
}

// ── Award points + check badge unlocks ───────────────────────

export async function awardPoints(
  email:    string,
  event:    PointEvent,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  const pts = POINT_VALUES[event];
  if (!pts) return;

  // Insert ledger entry
  await supabase.from("user_points").insert({ email, event, points: pts, metadata });

  // Update/create totals (upsert with increment)
  const { data: current } = await supabase
    .from("user_point_totals")
    .select("total_points")
    .eq("email", email)
    .maybeSingle();

  const newTotal = (current?.total_points ?? 0) + pts;
  const newRank  = getRank(newTotal).rank;

  await supabase.from("user_point_totals").upsert({
    email,
    total_points: newTotal,
    chi_rank:     newRank,
    updated_at:   new Date().toISOString(),
  }, { onConflict: "email" });

  // Badge checks — non-blocking
  void checkAndAwardBadges(email, event, newTotal, metadata);
}

async function checkAndAwardBadges(
  email:    string,
  event:    PointEvent,
  total:    number,
  metadata: Record<string, unknown>,
): Promise<void> {
  const toAward: { badge_id: string; badge_name: string }[] = [];

  // Event-based badges
  if (event === "generation" || event === "chunk") {
    const { count } = await supabase
      .from("user_points")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .eq("event", "generation");
    const gens = count ?? 0;
    if (gens === 1) toAward.push({ badge_id: "first_generation",  badge_name: "Nwa Chi" });
    if (gens >= 10) toAward.push({ badge_id: "gen_10",            badge_name: "Builder" });
    if (gens >= 50) toAward.push({ badge_id: "gen_50",            badge_name: "Engine Running" });
  }
  if (event === "publish")        toAward.push({ badge_id: "first_publish",   badge_name: "Voice of Ikenga" });
  if (event === "referral_signup") {
    const { count } = await supabase
      .from("user_points")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .eq("event", "referral_signup");
    if ((count ?? 0) === 1) toAward.push({ badge_id: "first_referral", badge_name: "Keeper of Kin" });
    if ((count ?? 0) >= 5)  toAward.push({ badge_id: "referral_5",     badge_name: "Referral Champion" });
  }
  if (event === "streak_7")   toAward.push({ badge_id: "streak_7",   badge_name: "Seven Suns" });
  if (event === "streak_30")  toAward.push({ badge_id: "streak_30",  badge_name: "Full Moon" });
  if (event === "streak_90")  toAward.push({ badge_id: "streak_90",  badge_name: "Season of Power" });
  if (event === "streak_365") toAward.push({ badge_id: "streak_365", badge_name: "Year of the Chi" });
  if (event === "pro_upgrade") toAward.push({ badge_id: "pro_upgrade", badge_name: "Keeper of the Barn" });

  // Rank-based badges
  if (total >= 1500) toAward.push({ badge_id: "dibia_rank",     badge_name: "Dibia" });
  if (total >= 5000) toAward.push({ badge_id: "di_nke_content", badge_name: "Di nke Content" });

  // Insert new badges (ignore duplicates via unique constraint)
  for (const b of toAward) {
    await supabase.from("user_badges").upsert(
      { email, badge_id: b.badge_id, badge_name: b.badge_name, earned_at: new Date().toISOString() },
      { onConflict: "email,badge_id", ignoreDuplicates: true }
    );
  }

  void metadata; // suppress unused warning
}

// ── POST — internal use (called by other routes) ─────────────

export async function POST(request: Request): Promise<Response> {
  // This endpoint is for internal server-to-server use only.
  // Client-facing point awards go through the generation/feedback routes.
  const adminToken = request.headers.get("x-admin-token");
  if (adminToken !== process.env.IKENGA_ADMIN_API_TOKEN) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }

  const email = typeof body.email === "string" ? body.email : "";
  const event = typeof body.event === "string" ? body.event as PointEvent : null;
  if (!email || !event) return Response.json({ error: "email and event required." }, { status: 400 });

  await awardPoints(email, event, (body.metadata as Record<string, unknown>) ?? {});
  return Response.json({ success: true });
}
