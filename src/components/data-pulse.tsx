"use client";

import { useState, useEffect, useCallback } from "react";

// ── Live pulse dot ────────────────────────────────────────────

function PulseDot({ color = "#C9A84C" }: { color?: string }) {
  return (
    <span
      style={{
        display:      "inline-block",
        width:        7,
        height:       7,
        borderRadius: "50%",
        background:   color,
        boxShadow:    `0 0 10px ${color}aa`,
        flexShrink:   0,
        animation:    "ik-pulse 2s ease-in-out infinite",
      }}
    />
  );
}

// ── Animated count ────────────────────────────────────────────

function AnimatedCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame = 0;
    const total = 50;
    const id = setInterval(() => {
      frame++;
      setVal(Math.round((frame / total) * target));
      if (frame >= total) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{val.toLocaleString()}{suffix}</>;
}

// ── Drill-down modal ──────────────────────────────────────────

interface Module {
  label:        string;
  description:  string;
  detail?:      string;
  statusLabel:  string;
  count:        number;
  countLabel:   string;
  color:        string;
  icon:         string;
}

function DrillDownModal({ module, onClose }: { module: Module; onClose: () => void }) {
  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="ik-fadein"
        style={{
          background:   "#080808",
          border:       `1px solid ${module.color}44`,
          borderRadius: 18,
          padding:      "28px 28px",
          width:        "100%",
          maxWidth:     480,
          boxShadow:    `0 24px 80px rgba(0,0,0,0.8)`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", color: module.color, fontWeight: 700 }}>
              {module.statusLabel}
            </p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#FFF4C0" }}>{module.label}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "1px solid #222", borderRadius: 8, width: 32, height: 32, color: "#444", cursor: "pointer", fontSize: 16 }}
          >×</button>
        </div>

        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#888", lineHeight: 1.7 }}>
          {module.description}
        </p>

        <div style={{ background: "#0a0a0a", border: `1px solid ${module.color}22`, borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.12em" }}>{module.countLabel}</p>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 700, color: module.color, fontVariantNumeric: "tabular-nums" }}>
            {module.count.toLocaleString()}
          </p>
        </div>

        {module.detail && (
          <p style={{ margin: "0 0 20px", fontSize: 12, color: "#555", lineHeight: 1.6 }}>
            {module.detail}
          </p>
        )}

        <button
          onClick={onClose}
          className="btn-outline-gold"
          style={{ marginTop: 4, width: "100%" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Metrics type ──────────────────────────────────────────────

interface PulseMetrics {
  liveQueries:   number;
  learningLoops: number;
  videoScripts:  number;
  activeUsers:   number;
  brandMemories: number;
}

// ── Data Pulse ────────────────────────────────────────────────

export function DataPulse() {
  const [metrics,      setMetrics]      = useState<PulseMetrics | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const handleClose = useCallback(() => setActiveModule(null), []);

  useEffect(() => {
    fetch("/api/pulse-metrics")
      .then(r => r.json())
      .then((d: PulseMetrics) => setMetrics(d))
      .catch(() => {});
  }, []);

  const m = metrics;

  const MODULES: Module[] = [
    {
      label:       "Live Queries",
      description: "UJU Cycle™ queries processed and refined in real time. Each query runs through the proprietary methodology.",
      detail:      "Queries include brand briefs, campaign goals, content hooks, and market positioning requests.",
      statusLabel: "LIVE",
      count:       m?.liveQueries   ?? 0,
      countLabel:  "Total queries",
      color:       "#C9A84C",
      icon:        "⚡",
    },
    {
      label:       "Learning Loops",
      description: "Feedback signals collected to sharpen Chi Profiles and improve content personalisation.",
      detail:      "Every thumbs up/down feeds back into each user's Chi Profile, adjusting tone, style, and targeting.",
      statusLabel: "LEARNING",
      count:       m?.learningLoops ?? 0,
      countLabel:  "Signals captured",
      color:       "#4ade80",
      icon:        "🔄",
    },
    {
      label:       "Video Intelligence",
      description: "AI-powered video scripts generated. Hook strength, scene pacing, and CTA impact tracked per script.",
      detail:      "Video scripts are scored on hook quality, scene progression, and call-to-action clarity.",
      statusLabel: "ACTIVE",
      count:       m?.videoScripts  ?? 0,
      countLabel:  "Scripts generated",
      color:       "#60a5fa",
      icon:        "🎬",
    },
    {
      label:       "Audience Radar",
      description: "Total users building brand presence across Nigerian and African markets with IKENGA.",
      detail:      "Each user represents a unique brand profile mapped to specific audience communities.",
      statusLabel: "TRACKING",
      count:       m?.activeUsers   ?? 0,
      countLabel:  "Brand builders",
      color:       "#c084fc",
      icon:        "📡",
    },
    {
      label:       "Campaign Memory",
      description: "Content assets generated and stored across all campaigns. IKENGA remembers your voice and wins.",
      detail:      "Every piece of content generated is stored with metadata, enabling pattern learning and style continuity.",
      statusLabel: "LIVE",
      count:       m?.brandMemories ?? 0,
      countLabel:  "Assets generated",
      color:       "#f97316",
      icon:        "🧠",
    },
  ];

  return (
    <div
      className="card-dark"
      style={{ padding: "24px 22px", marginBottom: 20, border: "1px solid #1B3A2D" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <PulseDot color="#C9A84C" />
        <p style={{ margin: 0, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A84C", fontWeight: 700 }}>
          IKENGA Data Pulse
        </p>
        <p style={{ margin: "0 0 0 auto", fontSize: 11, color: "#2a2a2a" }}>Click any card to expand</p>
      </div>

      {/* Module grid */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap:                 10,
        }}
      >
        {MODULES.map(mod => (
          <button
            key={mod.label}
            onClick={() => setActiveModule(mod)}
            style={{
              background:   "#0a0a0a",
              border:       `1px solid ${mod.color}33`,
              borderRadius: 12,
              padding:      "16px 16px",
              cursor:       "pointer",
              textAlign:    "left",
              transition:   "border-color 0.2s, box-shadow 0.2s, transform 0.18s",
              width:        "100%",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = mod.color + "66";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${mod.color}15`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = mod.color + "33";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            {/* Status badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{mod.icon}</span>
              <span
                style={{
                  fontSize:      9,
                  fontWeight:    700,
                  letterSpacing: "0.14em",
                  color:         mod.color,
                  border:        `1px solid ${mod.color}44`,
                  borderRadius:  4,
                  padding:       "2px 6px",
                }}
              >
                {mod.statusLabel}
              </span>
            </div>

            <p style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 700, color: "#FFF4C0" }}>
              {mod.label}
            </p>

            <p style={{ margin: "0 0 10px", fontSize: 10, color: "#3a3a3a", lineHeight: 1.5 }}>
              {mod.description.slice(0, 70)}…
            </p>

            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: mod.color, fontVariantNumeric: "tabular-nums" }}>
              {m ? <AnimatedCount target={mod.count} /> : <span style={{ fontSize: 12, color: "#222" }}>—</span>}
            </p>
          </button>
        ))}
      </div>

      {/* Drill-down modal */}
      {activeModule && <DrillDownModal module={activeModule} onClose={handleClose} />}
    </div>
  );
}
