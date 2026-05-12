"use client";

import { useState, useEffect } from "react";
import type { BenchmarkReport, CapabilityGap, PriorityFeature } from "@/src/ikenga/benchmark/engine";
import { generateBenchmarkReport } from "@/src/ikenga/benchmark/engine";

const PRIORITY_COLOR: Record<string, string> = {
  critical: "#f87171",
  high:     "#fb923c",
  medium:   "#fbbf24",
  low:      "#4ade80",
};

const EFFORT_COLOR: Record<string, string> = {
  low:    "#4ade80",
  medium: "#fbbf24",
  high:   "#f87171",
};

export default function BenchmarkPage() {
  const [report, setReport] = useState<BenchmarkReport | null>(null);
  const [tab, setTab]       = useState<"overview" | "gaps" | "features" | "apps">("overview");

  useEffect(() => {
    setReport(generateBenchmarkReport());
  }, []);

  if (!report) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#FFD700" }}>Generating benchmark report...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e7eb", fontFamily: "var(--font-sans, sans-serif)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#FFD700", margin: 0 }}>
            📊 Commercial Benchmark Engine
          </h1>
          <p style={{ color: "#6b7280", margin: "6px 0 0", fontSize: 14 }}>
            IKENGA v5 vs. Top 10 Global Apps — {report.totalAppsAnalysed} apps analysed
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
        {/* Score cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          <ScoreCard label="Coverage Score" value={`${report.coverageScore}%`} sub="vs. top app capabilities" color="#FFD700" />
          <ScoreCard label="Capability Gaps" value={String(report.gaps.length)} sub={`${report.gaps.filter(g => g.priority === "critical").length} critical`} color="#f87171" />
          <ScoreCard label="Priority Features" value={String(report.priorityFeatures.length)} sub="ready to build" color="#4ade80" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid #1a1a1a", paddingBottom: 8 }}>
          {(["overview", "gaps", "features", "apps"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background:    tab === t ? "#FFD700" : "transparent",
                color:         tab === t ? "#000" : "#6b7280",
                border:        "none",
                padding:       "8px 16px",
                borderRadius:  6,
                cursor:        "pointer",
                fontWeight:    tab === t ? 700 : 400,
                fontSize:      13,
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "overview" && <OverviewTab report={report} />}
        {tab === "gaps" && <GapsTab gaps={report.gaps} />}
        {tab === "features" && <FeaturesTab features={report.priorityFeatures} />}
        {tab === "apps" && <AppsTab report={report} />}
      </div>
    </div>
  );
}

function ScoreCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20 }}>
      <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 800, color, margin: "0 0 4px" }}>{value}</p>
      <p style={{ fontSize: 12, color: "#4b5563", margin: 0 }}>{sub}</p>
    </div>
  );
}

function OverviewTab({ report }: { report: BenchmarkReport }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Top Priority Opportunities</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {report.opportunities.slice(0, 6).map((opp, i) => (
          <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24 }}>{opp.appIcon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>{opp.opportunity}</p>
                <span style={{ fontSize: 10, background: "#1a1a1a", color: "#6b7280", padding: "2px 8px", borderRadius: 4, flexShrink: 0, marginLeft: 12 }}>{opp.module}</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Learned from <strong style={{ color: "#FFD700" }}>{opp.app}</strong> — {opp.gap}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GapsTab({ gaps }: { gaps: CapabilityGap[] }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Capability Gaps</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {gaps.map((gap, i) => (
          <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p style={{ fontWeight: 600, color: "#e5e7eb", margin: 0, textTransform: "capitalize" }}>
                {gap.capability.replace(/_/g, " ")}
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: PRIORITY_COLOR[gap.priority], background: PRIORITY_COLOR[gap.priority] + "20", padding: "2px 8px", borderRadius: 4 }}>
                  {gap.priority.toUpperCase()}
                </span>
                <span style={{ fontSize: 11, color: "#6b7280" }}>{gap.suggestedModule}</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#4b5563", margin: "0 0 6px" }}>
              Used by: {gap.appsWithIt.join(", ")}
            </p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>{gap.implementation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesTab({ features }: { features: PriorityFeature[] }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Priority Build List</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {features.map((f) => (
          <div key={f.rank} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "18px 20px", display: "flex", gap: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#FFD700", minWidth: 36, opacity: 0.4 }}>#{f.rank}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <p style={{ fontWeight: 700, color: "#fff", margin: 0, fontSize: 16 }}>{f.feature}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 10, color: EFFORT_COLOR[f.effort], background: EFFORT_COLOR[f.effort] + "20", padding: "2px 8px", borderRadius: 4 }}>
                    {f.effort.toUpperCase()} EFFORT
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 6px" }}>{f.impact}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: "#6b7280" }}>Module: </span>
                <span style={{ fontSize: 10, color: "#FFD700" }}>{f.ikengaModule}</span>
                <span style={{ fontSize: 10, color: "#4b5563", marginLeft: 8 }}>From: {f.learnedFrom.join(", ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppsTab({ report }: { report: BenchmarkReport }) {
  const { BENCHMARK_APPS } = require("@/src/ikenga/benchmark/apps");
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 16 }}>Analysed Apps</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {BENCHMARK_APPS.map((app: import("@/src/ikenga/benchmark/apps").BenchmarkApp) => (
          <div key={app.id} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{app.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: "#fff", margin: 0 }}>{app.name}</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{app.monthlyUsers} MAU · {app.category}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {app.capabilities.map((cap: string) => (
                <span key={cap} style={{ fontSize: 9, background: "#1a1a1a", color: "#9ca3af", padding: "2px 6px", borderRadius: 3 }}>
                  {cap.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
