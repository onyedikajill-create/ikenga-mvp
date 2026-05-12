"use client";

import { useState } from "react";
import { TIER_SPEEDS } from "@/src/components/uju-progress";

interface Props {
  onDismiss?: () => void;
}

const PRO_BENEFITS = [
  "claude-3-sonnet — 2× faster responses",
  "Unlimited UJU Cycle™ queries",
  "Full video script access",
  "Priority queue — no waiting",
  "Chi Profile deep learning",
];

export function UJUUpgradePrompt({ onDismiss }: Props) {
  const [dismissed, setDismissed] = useState(false);

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  if (dismissed) return null;

  return (
    <div
      style={{
        background:   "#080808",
        border:       "1px solid #C9A84C44",
        borderRadius: 14,
        padding:      "22px 22px",
        marginTop:    16,
        position:     "relative",
      }}
    >
      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        style={{
          position:   "absolute",
          top:        12,
          right:      14,
          background: "transparent",
          border:     "none",
          color:      "#333",
          fontSize:   16,
          cursor:     "pointer",
          lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>

      {/* Header */}
      <p style={{ margin: "0 0 4px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "#C9A84C", fontWeight: 700 }}>
        You&apos;ve used 3 free queries
      </p>
      <p style={{ margin: "0 0 18px", fontSize: 14, color: "#FFF4C0", fontWeight: 700 }}>
        Upgrade for faster results &amp; unlimited access
      </p>

      {/* Speed comparison */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {/* Free */}
        <div
          style={{
            flex:         1,
            background:   "#050505",
            border:       "1px solid #1e1e1e",
            borderRadius: 10,
            padding:      "14px 16px",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444", fontWeight: 700 }}>Free</p>
          <p style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, color: "#333", fontVariantNumeric: "tabular-nums" }}>
            {TIER_SPEEDS.free}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#2a2a2a" }}>claude-3-haiku · 3 queries/month</p>
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", alignItems: "center", color: "#C9A84C", fontSize: 18 }}>→</div>

        {/* Pro */}
        <div
          style={{
            flex:         1,
            background:   "#1B3A2D",
            border:       "1px solid #C9A84C55",
            borderRadius: 10,
            padding:      "14px 16px",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C9A84C", fontWeight: 700 }}>Pro — £19/mo</p>
          <p style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, color: "#C9A84C", fontVariantNumeric: "tabular-nums" }}>
            {TIER_SPEEDS.pro}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#4a8a6a" }}>claude-3-sonnet · unlimited</p>
        </div>
      </div>

      {/* Benefits list */}
      <ul style={{ margin: "0 0 18px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
        {PRO_BENEFITS.map(b => (
          <li key={b} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12, color: "#888" }}>
            <span style={{ color: "#C9A84C", fontSize: 10 }}>✦</span>
            {b}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="/pay"
        style={{
          display:        "block",
          textAlign:      "center",
          background:     "#C9A84C",
          color:          "#000",
          textDecoration: "none",
          borderRadius:   100,
          padding:        "11px 24px",
          fontSize:       14,
          fontWeight:     700,
          letterSpacing:  "0.04em",
          transition:     "background 0.15s",
        }}
      >
        Upgrade to Pro — £19/mo →
      </a>

      <p style={{ margin: "10px 0 0", fontSize: 11, color: "#333", textAlign: "center" }}>
        Cancel anytime · Instant access
      </p>
    </div>
  );
}
