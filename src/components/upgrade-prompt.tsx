"use client";

interface Props {
  gensUsed:    number;
  gensLimit:   number;
  productColor: string;
  onDismiss:   () => void;
}

export function UpgradePrompt({ gensUsed, gensLimit, productColor, onDismiss }: Props) {
  const isAtLimit = gensUsed >= gensLimit;

  return (
    <div
      style={{
        background: "#0a0800",
        border: `1px solid ${productColor}44`,
        borderRadius: 16,
        padding: "24px 26px",
        marginBottom: 20,
        position: "relative",
      }}
    >
      {/* Dismiss */}
      {!isAtLimit && (
        <button
          onClick={onDismiss}
          style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "#444", fontSize: 16, cursor: "pointer", lineHeight: 1 }}
        >
          ✕
        </button>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>🎯</span>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#FFF4C0" }}>
          {isAtLimit
            ? "You've tasted the pudding. Now own the recipe."
            : `${gensLimit - gensUsed} free generation${gensLimit - gensUsed !== 1 ? "s" : ""} remaining.`}
        </p>
      </div>

      {isAtLimit ? (
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "#888", lineHeight: 1.7 }}>
          You&apos;ve used all {gensLimit} free generations and seen exactly what IKENGA can build.
          23 assets, your voice, ready to publish. Pro unlocks everything with no limits.
        </p>
      ) : (
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "#888", lineHeight: 1.7 }}>
          You&apos;ve generated {gensUsed} of {gensLimit} free campaigns.
          Each one produced 23 assets — social posts, video scripts, emails, and ads — in your voice.
          Upgrade before you run out.
        </p>
      )}

      {/* Value list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 22 }}>
        {[
          "Unlimited generations",
          "All 5 content engines",
          "23 assets per campaign",
          "Chi Profile learning",
          "Priority support",
          "Cancel any time",
        ].map(item => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: productColor, fontSize: 12 }}>✦</span>
            <span style={{ fontSize: 13, color: "#aaa" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* ROI callout */}
      <div style={{ background: "#050500", border: "1px solid #2a2000", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 12, color: "#888", lineHeight: 1.7 }}>
          <strong style={{ color: "#FFD700" }}>Market value of 1 campaign:</strong> 23 assets × 30 min manual = 11.5 hrs × £75/hr = <strong style={{ color: "#FFD700" }}>£862 of work</strong>.
          IKENGA Pro costs £49 one-time or £19/month. The first campaign pays for itself.
        </p>
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <a
          href="/pay"
          style={{
            background: productColor,
            color: "#000",
            textDecoration: "none",
            borderRadius: 100,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 700,
            display: "inline-block",
          }}
        >
          Upgrade to Pro →
        </a>
        {!isAtLimit && (
          <button
            onClick={onDismiss}
            style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: 100, padding: "12px 20px", fontSize: 13, color: "#555", cursor: "pointer" }}
          >
            Remind me later
          </button>
        )}
      </div>
    </div>
  );
}
