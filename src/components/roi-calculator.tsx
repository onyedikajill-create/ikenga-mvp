"use client";

import { calcROI } from "@/src/ikenga/lib/points";

interface Props {
  totalGenerations: number;
  isPro:            boolean;
  proType?:         string | null;  // 'lifetime' | 'monthly' | null
}

export function ROICalculator({ totalGenerations, isPro, proType }: Props) {
  const roi = calcROI(totalGenerations, isPro);

  if (totalGenerations === 0) {
    return (
      <div style={{ background: "#050505", border: "1px solid #111", borderRadius: 12, padding: "16px 18px" }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#FFF4C0" }}>Value Dashboard</p>
        <p style={{ margin: 0, fontSize: 12, color: "#444" }}>Run your first generation to see your ROI.</p>
      </div>
    );
  }

  const amountPaid = proType === "lifetime" ? 49 : proType === "monthly" ? 19 : 0;

  const stats = [
    {
      label: "Assets generated",
      value: roi.totalAssets.toLocaleString(),
      sub:   `${totalGenerations} campaign${totalGenerations !== 1 ? "s" : ""} × 28 assets`,
      color: "#FFD700",
    },
    {
      label: "Hours saved",
      value: `${roi.hoursSaved}h`,
      sub:   "vs. writing everything manually",
      color: "#4ade80",
    },
    {
      label: "Market value",
      value: `£${roi.marketValue.toLocaleString()}`,
      sub:   "at £75/hr UK copywriter rate",
      color: "#60a5fa",
    },
    {
      label: "Cost per asset",
      value: amountPaid > 0 ? `£${roi.costPerPost}` : "Free",
      sub:   amountPaid > 0 ? `vs. £37.50 manual average` : "you're on the free tier",
      color: "#fb923c",
    },
  ];

  return (
    <div style={{ background: "#050505", border: "1px solid #111", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#FFF4C0" }}>Value Dashboard</p>
          <p style={{ margin: 0, fontSize: 11, color: "#444" }}>What IKENGA has delivered for your investment</p>
        </div>
        {amountPaid > 0 && roi.marketValue > 0 && (
          <div style={{ textAlign: "right", background: "#0a0800", border: "1px solid #3a3000", borderRadius: 8, padding: "6px 12px" }}>
            <p style={{ margin: 0, fontSize: 10, color: "#555", letterSpacing: "0.08em" }}>ROI</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#FFD700" }}>{roi.roi}×</p>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "#0a0a0a", border: "1px solid #111", borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ margin: "0 0 4px", fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
            <p style={{ margin: "0 0 2px", fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#555" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Comparison bar */}
      {amountPaid > 0 && (
        <div style={{ background: "#0a0a0a", border: "1px solid #111", borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, color: "#555" }}>vs. hiring alternatives</p>
          {[
            { label: "Social media manager (freelance UK)", cost: 800, period: "/mo" },
            { label: "Copywriter (10 posts)", cost: 750, period: "/mo" },
            { label: "Content agency (7-day pack)", cost: 1500, period: "/mo" },
            { label: `IKENGA ${proType === "lifetime" ? "Lifetime" : "Pro"}`, cost: amountPaid, period: proType === "lifetime" ? " one-time" : "/mo", highlight: true },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: r.highlight ? "#FFD700" : "#555", fontWeight: r.highlight ? 700 : 400 }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: r.highlight ? "#FFD700" : "#444" }}>£{r.cost}{r.period}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #111" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#555" }}>
              You are paying{" "}
              <strong style={{ color: "#4ade80" }}>
                {amountPaid > 0 ? `£${(amountPaid / 800 * 100).toFixed(0)}% of what a social media manager costs` : "nothing"}
              </strong>
              {" "}for the same output.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
