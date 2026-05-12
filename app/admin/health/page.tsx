"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AlertLevel = "ok" | "warning" | "critical";

interface Metric {
  id:         string;
  label:      string;
  value:      string | number;
  unit?:      string;
  level:      AlertLevel;
  threshold?: string;
  runbook?:   string;
}

interface HealthData {
  overallLevel: AlertLevel;
  checkedAt:    string;
  metrics:      Metric[];
}

const LEVEL_COLORS: Record<AlertLevel, string> = {
  ok:       "#4ade80",
  warning:  "#C9A84C",
  critical: "#f87171",
};
const LEVEL_BG: Record<AlertLevel, string> = {
  ok:       "#0a1a0a",
  warning:  "#1a1200",
  critical: "#1a0000",
};
const LEVEL_LABELS: Record<AlertLevel, string> = {
  ok:       "OK",
  warning:  "WARNING",
  critical: "CRITICAL",
};

function MetricCard({ metric }: { metric: Metric }) {
  const color = LEVEL_COLORS[metric.level];
  const bg    = LEVEL_BG[metric.level];
  return (
    <div
      style={{
        background:   bg,
        border:       `1px solid ${color}33`,
        borderRadius: 12,
        padding:      "16px 18px",
        display:      "flex",
        flexDirection:"column",
        gap:          8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {metric.label}
        </p>
        <span
          style={{
            fontSize:      9,
            fontWeight:    700,
            letterSpacing: "0.14em",
            color,
            border:        `1px solid ${color}44`,
            borderRadius:  4,
            padding:       "2px 7px",
          }}
        >
          {LEVEL_LABELS[metric.level]}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
        {metric.value}{metric.unit ? <span style={{ fontSize: 12, fontWeight: 400, color: "#555", marginLeft: 4 }}>{metric.unit}</span> : null}
      </p>

      {metric.threshold && (
        <p style={{ margin: 0, fontSize: 10, color: "#333" }}>{metric.threshold}</p>
      )}

      {metric.runbook && (
        <a
          href={metric.runbook}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 10, color: "#C9A84C", textDecoration: "none" }}
        >
          Runbook ↗
        </a>
      )}
    </div>
  );
}

export default function HealthPage() {
  const router = useRouter();
  const [data,     setData]     = useState<HealthData | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [lastCheck, setLastCheck] = useState("");

  async function fetchHealth() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.status === 401) { router.push("/login"); return; }
      if (res.status === 403) { setError("Super admin access required."); setLoading(false); return; }
      const d = await res.json() as HealthData;
      setData(d);
      setLastCheck(new Date().toLocaleTimeString("en-GB"));
    } catch {
      setError("Failed to fetch health data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 60_000); // auto-refresh every 60s
    return () => clearInterval(id);
  }, []);

  const overall = data?.overallLevel ?? "ok";
  const overallColor = LEVEL_COLORS[overall];

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "system-ui,sans-serif", padding: "clamp(16px, 4vw, 32px)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <a href="/dashboard" style={{ color: "#444", textDecoration: "none", fontSize: 12 }}>← Dashboard</a>
        <div>
          <p style={{ margin: "0 0 3px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#C9A84C" }}>Admin</p>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#FFF4C0", fontFamily: "'Playfair Display', Georgia, serif" }}>
            System Health
          </h1>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {lastCheck && <p style={{ margin: 0, fontSize: 11, color: "#333" }}>Last check: {lastCheck}</p>}
          <button
            onClick={fetchHealth}
            disabled={loading}
            style={{ background: "transparent", border: "1px solid #C9A84C44", borderRadius: 8, padding: "6px 14px", fontSize: 11, color: "#C9A84C", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Checking…" : "Refresh ↻"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#1a0000", border: "1px solid #3a0000", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
          <p style={{ margin: 0, color: "#f87171", fontSize: 13 }}>{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* Overall status */}
          <div
            style={{
              background:   LEVEL_BG[overall],
              border:       `2px solid ${overallColor}44`,
              borderRadius: 14,
              padding:      "18px 22px",
              marginBottom: 24,
              display:      "flex",
              alignItems:   "center",
              gap:          14,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: overallColor, boxShadow: `0 0 10px ${overallColor}88`, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: overallColor }}>
                System {LEVEL_LABELS[overall]}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#555" }}>
                {data.metrics.filter(m => m.level === "ok").length}/{data.metrics.length} metrics healthy
              </p>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 11, color: "#333" }}>
              {new Date(data.checkedAt).toLocaleString("en-GB")}
            </div>
          </div>

          {/* Metrics grid */}
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap:                 12,
              marginBottom:        32,
            }}
          >
            {data.metrics.map(m => <MetricCard key={m.id} metric={m} />)}
          </div>

          {/* Intervention protocols */}
          {data.metrics.some(m => m.level !== "ok") && (
            <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 14, padding: "20px 22px" }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "#FFF4C0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Intervention Required
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.metrics.filter(m => m.level !== "ok").map(m => (
                  <div
                    key={m.id}
                    style={{
                      display:      "flex",
                      alignItems:   "flex-start",
                      gap:          12,
                      padding:      "12px 14px",
                      background:   LEVEL_BG[m.level],
                      border:       `1px solid ${LEVEL_COLORS[m.level]}22`,
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ color: LEVEL_COLORS[m.level], fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      [{LEVEL_LABELS[m.level]}]
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 3px", fontSize: 12, color: "#ccc" }}>{m.label}: {m.value}{m.unit ?? ""}</p>
                      {m.threshold && <p style={{ margin: 0, fontSize: 11, color: "#444" }}>{m.threshold}</p>}
                    </div>
                    {m.runbook && (
                      <a href={m.runbook} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#C9A84C", textDecoration: "none", flexShrink: 0 }}>
                        Runbook ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
