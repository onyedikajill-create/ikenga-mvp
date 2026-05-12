// ============================================================
// GET /api/pulse-metrics
// Real counts for the Data Pulse component.
// Replaces static "SOON" labels with live data.
// Public (no auth required — counters only, no PII).
// ============================================================

import { supabase } from "@/src/ikenga/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const [genCount, feedbackCount, videoCount, userCount, libraryCount] =
    await Promise.allSettled([
      supabase.from("generation_logs").select("id", { count: "exact", head: true }),
      supabase.from("content_feedback").select("id", { count: "exact", head: true }),
      supabase.from("content_items").select("id", { count: "exact", head: true }).eq("content_type", "video_script"),
      supabase.from("user_profiles").select("email", { count: "exact", head: true }),
      supabase.from("content_items").select("id", { count: "exact", head: true }),
    ]);

  return Response.json({
    liveQueries:      genCount.status      === "fulfilled" ? (genCount.value.count      ?? 0) : 0,
    learningLoops:    feedbackCount.status === "fulfilled" ? (feedbackCount.value.count ?? 0) : 0,
    videoScripts:     videoCount.status    === "fulfilled" ? (videoCount.value.count    ?? 0) : 0,
    activeUsers:      userCount.status     === "fulfilled" ? (userCount.value.count     ?? 0) : 0,
    brandMemories:    libraryCount.status  === "fulfilled" ? (libraryCount.value.count  ?? 0) : 0,
  });
}
