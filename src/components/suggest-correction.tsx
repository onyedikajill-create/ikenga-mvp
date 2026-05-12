"use client";

import { useState } from "react";

interface Props {
  contentId:    string;
  contentType?: "library" | "generated" | "pronunciation";
  originalText: string;
  color?:       string;
}

type CorrectionType = "typo" | "pronunciation" | "cultural" | "translation" | "new_content";

const TYPE_OPTIONS: { value: CorrectionType; label: string; pts: number }[] = [
  { value: "typo",         label: "Typo / spelling",          pts: 5  },
  { value: "pronunciation",label: "Pronunciation",            pts: 10 },
  { value: "cultural",     label: "Cultural accuracy",        pts: 25 },
  { value: "translation",  label: "Translation improvement",  pts: 15 },
  { value: "new_content",  label: "New content suggestion",   pts: 50 },
];

interface SubmitResult {
  status:       "applied" | "flagged" | "rejected";
  message:      string;
  score:        number;
  pointsAwarded: number;
}

export function SuggestCorrection({ contentId, contentType = "library", originalText, color = "#C9A84C" }: Props) {
  const [open,            setOpen]           = useState(false);
  const [suggestedText,   setSuggestedText]  = useState("");
  const [reason,          setReason]         = useState("");
  const [correctionType,  setCorrectionType] = useState<CorrectionType>("typo");
  const [loading,         setLoading]        = useState(false);
  const [result,          setResult]         = useState<SubmitResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!suggestedText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/suggest-correction", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ contentId, contentType, originalText, suggestedText, reason, correctionType }),
      });
      const data = await res.json() as SubmitResult;
      setResult(data);
    } catch {
      setResult({ status: "rejected", message: "Network error. Please try again.", score: 0, pointsAwarded: 0 });
    } finally {
      setLoading(false);
    }
  }

  const STATUS_COLORS = { applied: "#4ade80", flagged: "#C9A84C", rejected: "#f87171" };
  const STATUS_ICONS  = { applied: "✓", flagged: "⏳", rejected: "✗" };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background:   "transparent",
          border:       "1px solid #1a1a1a",
          borderRadius: 6,
          padding:      "4px 10px",
          fontSize:     10,
          color:        "#333",
          cursor:       "pointer",
          letterSpacing:"0.06em",
          transition:   "all 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = color + "44";
          (e.currentTarget as HTMLButtonElement).style.color = color;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a1a1a";
          (e.currentTarget as HTMLButtonElement).style.color = "#333";
        }}
        title="Suggest a correction to earn Chi points"
      >
        ✎ Suggest correction
      </button>
    );
  }

  return (
    <div
      style={{
        background:   "#060606",
        border:       `1px solid ${color}33`,
        borderRadius: 10,
        padding:      "16px 18px",
        marginTop:    10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Suggest a Correction
        </p>
        <button onClick={() => { setOpen(false); setResult(null); }} style={{ background: "transparent", border: "none", color: "#333", cursor: "pointer", fontSize: 14 }}>×</button>
      </div>

      {result ? (
        <div>
          <div
            style={{
              background:   STATUS_COLORS[result.status] + "11",
              border:       `1px solid ${STATUS_COLORS[result.status]}33`,
              borderRadius: 8,
              padding:      "12px 14px",
              marginBottom: 10,
            }}
          >
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: STATUS_COLORS[result.status] }}>
              {STATUS_ICONS[result.status]} {result.status === "applied" ? "Applied!" : result.status === "flagged" ? "Under review" : "Not accepted"}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{result.message}</p>
            {result.pointsAwarded > 0 && (
              <p style={{ margin: "8px 0 0", fontSize: 11, color: "#C9A84C", fontWeight: 700 }}>
                +{result.pointsAwarded} Chi points earned
              </p>
            )}
          </div>
          <button
            onClick={() => { setResult(null); setSuggestedText(""); setReason(""); }}
            style={{ background: "transparent", border: `1px solid ${color}44`, borderRadius: 7, padding: "5px 14px", fontSize: 11, color, cursor: "pointer" }}
          >
            Submit another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Correction type */}
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Correction type</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCorrectionType(opt.value)}
                  style={{
                    background:   correctionType === opt.value ? "#1B3A2D" : "transparent",
                    border:       `1px solid ${correctionType === opt.value ? color + "55" : "#222"}`,
                    borderRadius: 6,
                    padding:      "4px 10px",
                    fontSize:     10,
                    color:        correctionType === opt.value ? color : "#444",
                    cursor:       "pointer",
                  }}
                >
                  {opt.label} <span style={{ color: "#555" }}>+{opt.pts}pts</span>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested text */}
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#444", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Your suggestion
            </label>
            <textarea
              value={suggestedText}
              onChange={e => setSuggestedText(e.target.value)}
              required
              placeholder="What should it say instead?"
              rows={3}
              style={{ width: "100%", boxSizing: "border-box", background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "#ccc", resize: "vertical", outline: "none", fontFamily: "inherit" }}
            />
          </div>

          {/* Reason */}
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#444", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Why is this more accurate?"
              style={{ width: "100%", boxSizing: "border-box", background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 7, padding: "8px 12px", fontSize: 13, color: "#ccc", outline: "none" }}
            />
          </div>

          <p style={{ margin: 0, fontSize: 10, color: "#2a2a2a" }}>
            Accepted corrections earn you {TYPE_OPTIONS.find(t => t.value === correctionType)?.pts ?? 10} Chi points. AI reviews your suggestion instantly.
          </p>

          <button
            type="submit"
            disabled={loading || !suggestedText.trim()}
            style={{
              background:   loading || !suggestedText.trim() ? "#111" : color,
              color:        loading || !suggestedText.trim() ? "#333" : "#000",
              border:       "none",
              borderRadius: 100,
              padding:      "9px",
              fontSize:     13,
              fontWeight:   700,
              cursor:       loading || !suggestedText.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Submitting…" : "Submit correction →"}
          </button>
        </form>
      )}
    </div>
  );
}
