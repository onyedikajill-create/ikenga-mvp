// GET /api/learning/stats
// Returns IKENGA Intelligence metrics for the dashboard learning widget.
// Public-ish: requires valid session but no admin key.

import { supabase } from "@/src/ikenga/lib/supabase";
import { getSessionEmail } from "@/src/ikenga/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const email = await getSessionEmail();
  if (!email) return Response.json({ error: "Not logged in." }, { status: 401 });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Run all queries in parallel
  const [
    feedbackWeek,
    feedbackTotal,
    toneChanges,
    learningInsightsWeek,
    userUp,
    userDown,
    chiProfile,
  ] = await Promise.allSettled([
    // Feedback collected this week (platform-wide)
    supabase.from("content_feedback").select("signal", { count: "exact", head: true })
      .gte("created_at", weekAgo),

    // All-time feedback count
    supabase.from("content_feedback").select("signal", { count: "exact", head: true }),

    // Tone adjustments this week (learning_insights)
    supabase.from("learning_insights")
      .select("id", { count: "exact", head: true })
      .eq("insight_type", "tone_performance")
      .gte("created_at", weekAgo),

    // Learning events this week (any insight type)
    supabase.from("learning_insights")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo),

    // This user's thumbs up total
    supabase.from("content_feedback").select("signal", { count: "exact", head: true })
      .eq("email", email).eq("signal", "up"),

    // This user's thumbs down total
    supabase.from("content_feedback").select("signal", { count: "exact", head: true })
      .eq("email", email).eq("signal", "down"),

    // Chi profile — for completion %
    supabase.from("chi_profiles").select("thumbs_up_count, thumbs_down_count, preferred_tone, favorite_engine").eq("email", email).maybeSingle(),
  ]);

  function val<T>(result: PromiseSettledResult<T>): T | null {
    return result.status === "fulfilled" ? result.value : null;
  }

  const feedbackWeekCount = (val(feedbackWeek) as { count: number | null } | null)?.count ?? 0;
  const feedbackTotalCount = (val(feedbackTotal) as { count: number | null } | null)?.count ?? 0;
  const toneChangeCount = (val(toneChanges) as { count: number | null } | null)?.count ?? 0;
  const learningEventCount = (val(learningInsightsWeek) as { count: number | null } | null)?.count ?? 0;
  const myUpCount = (val(userUp) as { count: number | null } | null)?.count ?? 0;
  const myDownCount = (val(userDown) as { count: number | null } | null)?.count ?? 0;
  const chi = (val(chiProfile) as { data: { thumbs_up_count?: number; thumbs_down_count?: number; preferred_tone?: string; favorite_engine?: string } | null } | null)?.data;

  const totalFeedbackSignals = myUpCount + myDownCount;
  const qualityScore = totalFeedbackSignals > 0
    ? Math.round((myUpCount / totalFeedbackSignals) * 100)
    : null;

  // Chi profile completion: up, down, tone, engine = 4 fields max
  const chiFields = [chi?.thumbs_up_count, chi?.thumbs_down_count, chi?.preferred_tone, chi?.favorite_engine];
  const chiComplete = Math.round((chiFields.filter(Boolean).length / chiFields.length) * 100);

  return Response.json({
    feedbackThisWeek:   feedbackWeekCount,
    feedbackAllTime:    feedbackTotalCount,
    toneAdjustments:    toneChangeCount,
    learningEvents:     learningEventCount,
    myQualityScore:     qualityScore,   // % thumbs up from this user
    myFeedbackCount:    totalFeedbackSignals,
    chiProfileComplete: chiComplete,
    preferredTone:      chi?.preferred_tone ?? null,
    favoriteEngine:     chi?.favorite_engine ?? null,
  });
}
