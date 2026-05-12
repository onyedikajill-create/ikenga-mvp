"use client";

import { useEffect, useState } from "react";

interface LearningStats {
  feedbackThisWeek:   number;
  feedbackAllTime:    number;
  toneAdjustments:    number;
  learningEvents:     number;
  myQualityScore:     number | null;
  myFeedbackCount:    number;
  chiProfileComplete: number;
  preferredTone:      string | null;
  favoriteEngine:     string | null;
}

export function LearningWidget() {
  const [stats,   setStats]   = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learning/stats")
      .then(r => r.json())
      .then((d: LearningStats | { error: string }) => {
        if ("error" in d) return;
        setStats(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;    // silent load — no spinner
  if (!stats)  return null;    // error — show nothing

  const hasActivity = stats.feedbackAllTime > 0 || stats.learningEvents > 0;
  if (!hasActivity) return null; // nothing to show yet

  const rows: { label: string; value: string; color?: string }[] = [];

  if (stats.feedbackThisWeek > 0) {
    rows.push({ label: "Feedback signals this week", value: `${stats.feedbackThisWeek}` });
  }
  if (stats.toneAdjustments > 0) {
    rows.push({ label: "Tone adjustments made", value: `${stats.toneAdjustments}`, color: "#4ade80" });
  }
  if (stats.learningEvents > 0) {
    rows.push({ label: "Learning events recorded", value: `${stats.learningEvents}`, color: "#60a5fa" });
  }
  if (stats.myQualityScore !== null) {
    rows.push({ label: "Your content quality score", value: `${stats.myQualityScore}% 👍`, color: stats.myQualityScore >= 70 ? "#4ade80" : "#fb923c" });
  }
  if (stats.chiProfileComplete > 0) {
    rows.push({ label: "Chi Profile complete", value: `${stats.chiProfileComplete}%`, color: "#FFD700" });
  }
  if (stats.preferredTone) {
    rows.push({ label: "Your learned tone", value: stats.preferredTone.charAt(0).toUpperCase() + stats.preferredTone.slice(1) });
  }

  return (
    <div
      style={{
        background: "#050505",
        border: "1px solid #1a1a00",
        borderRadius: 14,
        padding: "18px 20px",
        marginBottom: 24,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 14 }}>🧠</span>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFD700" }}>
          IKENGA Intelligence Report
        </p>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#333" }}>This week</span>
      </div>

      {/* Metrics grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#555" }}>✅ {row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: row.color ?? "#888" }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{ margin: "14px 0 0", fontSize: 11, color: "#2a2a2a", borderTop: "1px solid #111", paddingTop: 10 }}>
        Every 👍 and 👎 trains IKENGA to produce better content for you.
        {stats.feedbackAllTime > 0 && ` ${stats.feedbackAllTime} total signal${stats.feedbackAllTime !== 1 ? "s" : ""} recorded.`}
      </p>
    </div>
  );
}
