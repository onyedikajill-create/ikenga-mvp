"use client";

import { useEffect, useState } from "react";

// ── Stage definitions ─────────────────────────────────────────

export type UJUStage =
  | "analyzing"
  | "extracting"
  | "applying_uju"
  | "generating"
  | "cultural_insights"
  | "finalizing"
  | "done"
  | "error";

export interface StageInfo {
  id:          UJUStage;
  label:       string;
  description: string;
  duration:    number;  // estimated ms
}

export const UJU_STAGES: StageInfo[] = [
  { id: "analyzing",         label: "Analyzing",          description: "Reading your brand brief…",              duration: 800  },
  { id: "extracting",        label: "Extracting",         description: "Identifying key signals and patterns…",  duration: 900  },
  { id: "applying_uju",      label: "Applying UJU",       description: "Running UJU Cycle™ methodology…",       duration: 1200 },
  { id: "generating",        label: "Generating",         description: "Building your strategy response…",      duration: 4000 },
  { id: "cultural_insights", label: "Cultural insights",  description: "Weaving market and cultural context…",  duration: 1000 },
  { id: "finalizing",        label: "Finalizing",         description: "Structuring your action plan…",         duration: 600  },
];

const STAGE_IDS = UJU_STAGES.map(s => s.id);

// ── Speed tier info (for Section 7 integration) ───────────────

export type SpeedTier = "free" | "pro" | "enterprise";

export const TIER_LABELS: Record<SpeedTier, string> = {
  free:       "Free",
  pro:        "Pro",
  enterprise: "Enterprise",
};

export const TIER_SPEEDS: Record<SpeedTier, string> = {
  free:       "10–20s",
  pro:        "5–10s",
  enterprise: "2–5s",
};

export const TIER_COLORS: Record<SpeedTier, string> = {
  free:       "#555",
  pro:        "#C9A84C",
  enterprise: "#4ade80",
};

// ── UJU Progress bar ──────────────────────────────────────────

interface Props {
  stage:        UJUStage;
  tier?:        SpeedTier;
  onUpgrade?:   () => void;
}

export function UJUProgress({ stage, tier = "free", onUpgrade }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (stage === "done" || stage === "error") return;
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 200);
    return () => clearInterval(id);
  }, [stage]);

  if (stage === "done" || stage === "error") return null;

  const currentIdx = STAGE_IDS.indexOf(stage as typeof STAGE_IDS[number]);
  const info       = UJU_STAGES[currentIdx] ?? UJU_STAGES[0];
  const progress   = Math.min(100, Math.round((currentIdx / (UJU_STAGES.length - 1)) * 100));

  return (
    <div
      style={{
        background:   "#050505",
        border:       "1px solid #1B3A2D",
        borderRadius: 12,
        padding:      "18px 20px",
        marginTop:    16,
      }}
    >
      {/* Stage header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span
            style={{
              width:        8,
              height:       8,
              borderRadius: "50%",
              background:   "#C9A84C",
              display:      "inline-block",
              boxShadow:    "0 0 8px rgba(201,168,76,0.7)",
              flexShrink:   0,
            }}
          />
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#FFF4C0" }}>
            {info.label}
          </p>
        </div>
        {/* Speed tier badge */}
        <span
          style={{
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: "0.12em",
            color:         TIER_COLORS[tier],
            border:        `1px solid ${TIER_COLORS[tier]}44`,
            borderRadius:  5,
            padding:       "2px 8px",
          }}
        >
          {TIER_LABELS[tier]} · {TIER_SPEEDS[tier]}
        </span>
      </div>

      <p style={{ margin: "0 0 14px", fontSize: 12, color: "#555" }}>
        {info.description}
      </p>

      {/* Stage dots */}
      <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 12 }}>
        {UJU_STAGES.map((s, i) => (
          <div
            key={s.id}
            style={{
              flex:         1,
              height:       3,
              borderRadius: 100,
              background:   i < currentIdx
                ? "#C9A84C"
                : i === currentIdx
                ? "#C9A84C88"
                : "#1a1a1a",
              transition:   "background 0.4s",
            }}
            title={s.label}
          />
        ))}
      </div>

      {/* Stage labels */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: "#333" }}>{UJU_STAGES[0].label}</span>
        <span style={{ fontSize: 10, color: currentIdx === UJU_STAGES.length - 1 ? "#C9A84C" : "#333" }}>
          {UJU_STAGES[UJU_STAGES.length - 1].label}
        </span>
      </div>

      {/* Elapsed + upgrade CTA for free tier */}
      {tier === "free" && onUpgrade && elapsed > 6000 && (
        <div
          style={{
            marginTop:    14,
            paddingTop:   14,
            borderTop:    "1px solid #111",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "space-between",
            flexWrap:     "wrap",
            gap:          8,
          }}
        >
          <p style={{ margin: 0, fontSize: 11, color: "#555" }}>
            Pro users get this in {TIER_SPEEDS.pro} instead of {TIER_SPEEDS.free}
          </p>
          <button
            onClick={onUpgrade}
            style={{
              background:   "#C9A84C",
              color:        "#000",
              border:       "none",
              borderRadius: 100,
              padding:      "6px 14px",
              fontSize:     11,
              fontWeight:   700,
              cursor:       "pointer",
            }}
          >
            Upgrade to Pro →
          </button>
        </div>
      )}
    </div>
  );
}
