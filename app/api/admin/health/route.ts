// ============================================================
// GET /api/admin/health
// System health metrics for diagnostic dashboard.
// Super admin only (session-based — no token required for dashboard use).
// ============================================================

import { getSessionEmail } from "@/src/ikenga/lib/session";
import { isSuperAdmin }    from "@/src/lib/super-admin";
import { supabase }        from "@/src/ikenga/lib/supabase";
import { getAnthropicApiKey } from "@/src/ikenga/lib/aiConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AlertLevel = "ok" | "warning" | "critical";

interface Metric {
  id:          string;
  label:       string;
  value:       string | number;
  unit?:       string;
  level:       AlertLevel;
  threshold?:  string;
  runbook?:    string;
}

function level(val: number, warn: number, crit: number, dir: "above" | "below" = "above"): AlertLevel {
  if (dir === "above") {
    if (val >= crit) return "critical";
    if (val >= warn) return "warning";
    return "ok";
  } else {
    if (val <= crit) return "critical";
    if (val <= warn) return "warning";
    return "ok";
  }
}

export async function GET(): Promise<Response> {
  const email = await getSessionEmail();
  if (!email) return Response.json({ error: "Not logged in." }, { status: 401 });
  if (!isSuperAdmin(email)) return Response.json({ error: "Super admin only." }, { status: 403 });

  const now = Date.now();

  // ── Supabase queries ──────────────────────────────────────────
  const [
    userCount,
    proCount,
    genCount,
    correctionQueue,
    recentErrors,
    feedbackCount,
    activeUsers7d,
  ] = await Promise.allSettled([
    supabase.from("user_profiles").select("email", { count: "exact", head: true }),
    supabase.from("user_profiles").select("email", { count: "exact", head: true }).eq("tier", "pro"),
    supabase.from("generation_logs").select("id", { count: "exact", head: true }),
    supabase.from("correction_suggestions").select("id", { count: "exact", head: true }).eq("status", "flagged"),
    supabase.from("generation_logs").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 5 * 60_000).toISOString()),
    supabase.from("content_feedback").select("id", { count: "exact", head: true }),
    supabase.from("generation_logs").select("email", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString()),
  ]);

  const totalUsers      = userCount.status      === "fulfilled" ? (userCount.value.count      ?? 0) : -1;
  const proUsers        = proCount.status       === "fulfilled" ? (proCount.value.count       ?? 0) : -1;
  const totalGens       = genCount.status       === "fulfilled" ? (genCount.value.count       ?? 0) : -1;
  const corrQueue       = correctionQueue.status === "fulfilled" ? (correctionQueue.value.count ?? 0) : -1;
  const feedbackTotal   = feedbackCount.status  === "fulfilled" ? (feedbackCount.value.count  ?? 0) : -1;
  const recentErrCount  = recentErrors.status   === "fulfilled" ? (recentErrors.value.count   ?? 0) : -1;
  const active7d        = activeUsers7d.status  === "fulfilled" ? (activeUsers7d.value.count  ?? 0) : -1;

  const conversionPct = totalUsers > 0 && proUsers >= 0
    ? Math.round((proUsers / totalUsers) * 100)
    : -1;

  const hasApiKey = Boolean(getAnthropicApiKey());

  const latencyMs = Date.now() - now;

  const metrics: Metric[] = [
    {
      id:        "api_latency",
      label:     "API Response Time",
      value:     latencyMs,
      unit:      "ms",
      level:     level(latencyMs, 2000, 5000),
      threshold: "> 2,000ms = warning · > 5,000ms = critical",
      runbook:   "https://vercel.com/dashboard",
    },
    {
      id:        "anthropic_key",
      label:     "Anthropic API Key",
      value:     hasApiKey ? "Configured" : "MISSING",
      level:     hasApiKey ? "ok" : "critical",
      runbook:   "https://console.anthropic.com/settings/api-keys",
    },
    {
      id:        "total_users",
      label:     "Total Users",
      value:     totalUsers < 0 ? "DB Error" : totalUsers,
      level:     totalUsers < 0 ? "warning" : "ok",
    },
    {
      id:        "pro_users",
      label:     "Pro Users",
      value:     proUsers < 0 ? "DB Error" : proUsers,
      level:     proUsers < 0 ? "warning" : "ok",
    },
    {
      id:        "conversion_rate",
      label:     "Conversion Rate",
      value:     conversionPct < 0 ? "N/A" : `${conversionPct}%`,
      level:     conversionPct < 0 ? "warning" : conversionPct < 2 ? "warning" : "ok",
      threshold: "< 2% = warning",
    },
    {
      id:        "total_generations",
      label:     "Total Generations",
      value:     totalGens < 0 ? "DB Error" : totalGens,
      level:     totalGens < 0 ? "warning" : "ok",
    },
    {
      id:        "correction_queue",
      label:     "Correction Queue",
      value:     corrQueue < 0 ? "Table missing" : corrQueue,
      level:     corrQueue < 0 ? "warning" : level(corrQueue, 20, 50),
      threshold: "> 20 = warning · > 50 = critical",
      runbook:   "/admin/corrections",
    },
    {
      id:        "feedback_signals",
      label:     "Feedback Signals",
      value:     feedbackTotal < 0 ? "DB Error" : feedbackTotal,
      level:     feedbackTotal < 0 ? "warning" : "ok",
    },
    {
      id:        "error_rate_5m",
      label:     "Errors (5 min)",
      value:     recentErrCount < 0 ? "DB Error" : recentErrCount,
      unit:      recentErrCount >= 0 ? "req" : undefined,
      level:     recentErrCount < 0 ? "warning" : level(recentErrCount, 5, 20),
      threshold: "> 5 = warning · > 20 = critical",
    },
    {
      id:        "active_users_7d",
      label:     "Active Users (7 days)",
      value:     active7d < 0 ? "DB Error" : active7d,
      level:     active7d < 0 ? "warning" : active7d === 0 ? "warning" : "ok",
      threshold: "0 active users = warning",
    },
  ];

  const overallLevel: AlertLevel =
    metrics.some(m => m.level === "critical") ? "critical" :
    metrics.some(m => m.level === "warning")  ? "warning"  : "ok";

  return Response.json({
    overallLevel,
    checkedAt: new Date().toISOString(),
    metrics,
  });
}
