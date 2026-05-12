"use client";

import { useState, useEffect } from "react";
import {
  getRank,
  getNextRank,
  getProgressToNextRank,
  BADGES,
  type ChiRank,
} from "@/src/ikenga/lib/points";

interface PointsData {
  points:    number;
  chiRank:   ChiRank;
  rankColor: string;
  meaning:   string;
  badges:    { badge_id: string; badge_name: string; earned_at: string }[];
  recent:    { event: string; points: number; created_at: string }[];
}

// ── Inline badge (for top bar) ───────────────────────────────

export function ChiRankInlineBadge({ points, rank, color }: { points: number; rank: string; color: string }) {
  return (
    <span
      title={`${points} points · ${rank}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: color + "18",
        border: `1px solid ${color}55`,
        borderRadius: 100, padding: "4px 10px",
        fontSize: 11, fontWeight: 700,
        color, letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}
    >
      ✦ {rank} · {points} pts
    </span>
  );
}

// ── Full Chi Profile card ────────────────────────────────────

export function ChiProfileCard({ onClose }: { onClose?: () => void }) {
  const [data,    setData]    = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/points")
      .then(r => r.ok ? r.json() as Promise<PointsData> : null)
      .then(d => { if (d) setData(d); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555" }}>Loading Chi Profile…</p>
      </div>
    );
  }

  if (!data) return null;

  const rank    = getRank(data.points);
  const next    = getNextRank(data.points);
  const pct     = getProgressToNextRank(data.points);
  const earnedIds = new Set(data.badges.map(b => b.badge_id));

  const EVENT_LABELS: Record<string, string> = {
    signup:           "+50 pts — Joined IKENGA",
    generation:       "+100 pts — Full campaign generated",
    chunk:            "+25 pts — Chunk completed",
    streak_7:         "+200 pts — 7-day streak",
    streak_30:        "+500 pts — 30-day streak",
    referral_signup:  "+150 pts — Referral signed up",
    publish:          "+10 pts — Content published",
    feedback:         "+5 pts — Feedback given",
    pro_upgrade:      "+300 pts — Upgraded to Pro",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div style={{ background: "#0a0a0a", border: `1px solid ${rank.color}33`, borderRadius: 16, padding: "28px 28px 24px", maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: rank.color, letterSpacing: "0.04em" }}>{rank.rank}</span>
              <span style={{ fontSize: 12, color: "#555" }}>— {rank.meaning}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#666", lineHeight: 1.6, maxWidth: 340 }}>{rank.description}</p>
          </div>
          <button onClick={() => onClose?.()} style={{ background: "transparent", border: "none", color: "#444", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>

        {/* Points + progress to next rank */}
        <div style={{ background: "#050505", border: "1px solid #111", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#888" }}>Total points</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: rank.color }}>{data.points.toLocaleString()}</span>
          </div>
          {next && (
            <>
              <div style={{ height: 5, background: "#111", borderRadius: 100, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: rank.color, borderRadius: 100, transition: "width 0.6s" }} />
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#444" }}>
                {pct}% to <strong style={{ color: next.color }}>{next.rank}</strong> ({next.meaning}) · {(next.minPoints - data.points).toLocaleString()} pts away
              </p>
            </>
          )}
          {!next && (
            <p style={{ margin: 0, fontSize: 12, color: rank.color, fontWeight: 700 }}>Maximum rank achieved. Your Chi is in full motion.</p>
          )}
        </div>

        {/* Chi Rank ladder */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>Chi Rank Ladder</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["Nwa", "Odibo", "Okenye", "Dibia", "Di nke Content"].map((r, i) => {
              const rc = getRank(i === 0 ? 0 : i === 1 ? 100 : i === 2 ? 500 : i === 3 ? 1500 : 5000);
              const isCurrentRank = r === rank.rank;
              const meanings = ["Child", "Apprentice", "Elder", "Wise One", "Master of Content"];
              return (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: isCurrentRank ? rc.color + "11" : "transparent", border: `1px solid ${isCurrentRank ? rc.color + "44" : "#111"}`, borderRadius: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: isCurrentRank ? rc.color : "#333", minWidth: 120 }}>{r}</span>
                  <span style={{ fontSize: 11, color: "#555" }}>{meanings[i]}</span>
                  {isCurrentRank && <span style={{ marginLeft: "auto", fontSize: 10, color: rc.color, fontWeight: 700 }}>← YOU</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>Badges ({data.badges.length}/{BADGES.length})</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {BADGES.map(b => {
              const earned = earnedIds.has(b.id);
              return (
                <span
                  key={b.id}
                  title={b.description}
                  style={{
                    background: earned ? b.color + "18" : "#0a0a0a",
                    border: `1px solid ${earned ? b.color + "55" : "#111"}`,
                    borderRadius: 8, padding: "6px 10px",
                    fontSize: 11, fontWeight: earned ? 700 : 400,
                    color: earned ? b.color : "#333",
                    cursor: "default",
                    filter: earned ? "none" : "grayscale(1) opacity(0.4)",
                  }}
                >
                  {b.icon} {b.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* Nze na Ozo — Honour Principles */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>Nze na Ozo — Honour Principles</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                label:   "Earned Honour",
                proverb: "Onye obula ga aza aha nna ya",
                meaning: "Every person must answer to their father's name. Your father's honour rests on your shoulders — but it does not automatically become yours. You must earn it.",
                color:   "#FFD700",
              },
              {
                label:   "Transparent Wealth",
                proverb: "Ihe ọ bụ na-apụta n'ụzọ ọ bụ",
                meaning: "How you got your wealth must be verifiable and honourable. To take a title, your wealth must be proven by credible, defensible, transparent means.",
                color:   "#4ade80",
              },
              {
                label:   "Mma Nwanyị bụ Ugwu Di Ya",
                proverb: "A woman's virtue is her husband's honour",
                meaning: "A man cannot claim honour if his wife is not honoured. Her virtue, dignity, health, and peace are the most transparent measure of his worth. The household is the truth.",
                color:   "#c084fc",
              },
            ].map(p => (
              <div key={p.label} style={{ background: p.color + "08", border: `1px solid ${p.color}22`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.label}</span>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: p.color + "aa", fontStyle: "italic" }}>{p.proverb}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#555", lineHeight: 1.6 }}>{p.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        {data.recent.length > 0 && (
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>Recent Points</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {data.recent.slice(0, 8).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#555" }}>{EVENT_LABELS[r.event] ?? r.event}</span>
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>+{r.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hook — load points for top bar inline badge ──────────────

export function useChiPoints() {
  const [pts,   setPts]   = useState(0);
  const [rank,  setRank]  = useState("Nwa");
  const [color, setColor] = useState("#888");

  useEffect(() => {
    fetch("/api/points")
      .then(r => r.ok ? r.json() as Promise<PointsData> : null)
      .then(d => { if (d) { setPts(d.points); setRank(d.chiRank); setColor(d.rankColor); } })
      .catch(() => {});
  }, []);

  return { pts, rank, color };
}
