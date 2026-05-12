// GET /api/leaderboard — top 20 users by points

import { supabase } from "../../../src/ikenga/lib/supabase";
import { getSessionEmail } from "../../../src/ikenga/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const email = await getSessionEmail();
  if (!email) return Response.json({ error: "Not logged in." }, { status: 401 });

  // Top 20 by total points
  const { data: top, error } = await supabase
    .from("user_point_totals")
    .select("email, total_points, chi_rank")
    .order("total_points", { ascending: false })
    .limit(20);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Caller's own rank (to show their position even if not top 20)
  const { data: mine } = await supabase
    .from("user_point_totals")
    .select("total_points, chi_rank")
    .eq("email", email)
    .maybeSingle();

  // Count users above caller for position
  const callerPoints = mine?.total_points ?? 0;
  const { count: aboveCount } = await supabase
    .from("user_point_totals")
    .select("email", { count: "exact", head: true })
    .gt("total_points", callerPoints);

  return Response.json({
    leaderboard: (top ?? []).map((u, i) => ({
      position:    i + 1,
      email:       u.email.replace(/(.{2}).+(@.+)/, "$1***$2"), // partial mask
      isMe:        u.email === email,
      totalPoints: u.total_points,
      chiRank:     u.chi_rank,
    })),
    myPosition:  (aboveCount ?? 0) + 1,
    myPoints:    callerPoints,
    myRank:      mine?.chi_rank ?? "Nwa",
  });
}
