"use client";

import { useState, useRef } from "react";
import type { UJUCycleResult, UJUModelOutput, UJUStageResult, UJUProgressEvent } from "@/src/ikenga/ai/ujuCycle";
import { STAGE_SEQUENCE } from "@/src/ikenga/ai/models";
import type { UJUStage } from "@/src/ikenga/ai/models";

const STAGE_LABELS: Record<UJUStage, string> = {
  ingest:    "01 · Signal Extraction",
  compress:  "02 · Compression",
  lensShift: "03 · Lens Shift",
  weave:     "04 · Deep Weave",
  critic:    "05 · Adversarial Review",
  explain:   "06 · Final Intelligence",
};

const STAGE_ICONS: Record<UJUStage, string> = {
  ingest:    "⚡",
  compress:  "💎",
  lensShift: "🔭",
  weave:     "🧬",
  critic:    "⚔️",
  explain:   "👑",
};

type RunState = "idle" | "running" | "done" | "error";

interface LiveStageState {
  stage:    UJUStage;
  models:   UJUModelOutput[];
  done:     boolean;
}

export default function UJUCyclePage() {
  const [query, setQuery]       = useState("");
  const [runState, setRunState] = useState<RunState>("idle");
  const [error, setError]       = useState<string | null>(null);
  const [result, setResult]     = useState<UJUCycleResult | null>(null);
  const [liveStages, setLiveStages] = useState<Map<UJUStage, LiveStageState>>(new Map());
  const [activeStage, setActiveStage] = useState<UJUStage | null>(null);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function runCycle() {
    if (!query.trim() || runState === "running") return;

    setRunState("running");
    setError(null);
    setResult(null);
    setLiveStages(new Map());
    setActiveStage(null);
    setFeedback(null);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/uju/run", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ query, stream: true }),
        signal:  abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Failed to start UJU Cycle");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const event = JSON.parse(json) as UJUProgressEvent;
            handleEvent(event);
          } catch {
            // skip malformed
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
      }
      setRunState("error");
      return;
    }

    setRunState("done");
  }

  function handleEvent(event: UJUProgressEvent) {
    if (event.type === "stage_start") {
      setActiveStage(event.stage);
      setLiveStages((prev) => {
        const next = new Map(prev);
        next.set(event.stage, { stage: event.stage, models: [], done: false });
        return next;
      });
    } else if (event.type === "model_done") {
      setLiveStages((prev) => {
        const next = new Map(prev);
        const stage = event.result.stage;
        const existing = next.get(stage) ?? { stage, models: [], done: false };
        next.set(stage, { ...existing, models: [...existing.models, event.result] });
        return next;
      });
    } else if (event.type === "stage_done") {
      setLiveStages((prev) => {
        const next = new Map(prev);
        const stage = event.result.stage;
        const existing = next.get(stage);
        if (existing) next.set(stage, { ...existing, done: true });
        return next;
      });
    } else if (event.type === "cycle_done") {
      setResult(event.result);
      setActiveStage(null);
    }
  }

  async function submitFeedback(signal: "positive" | "negative") {
    if (!result) return;
    setFeedback(signal);
    fetch("/api/memory/log", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type:     signal === "positive" ? "successMemory" : "failureMemory",
        source:   "ujuCycle",
        sessionId: result.sessionId,
        query:    result.query,
        output:   result.finalAnswer,
        feedback: signal,
        score:    signal === "positive" ? 0.9 : 0.3,
      }),
    }).catch(() => {/* fire-and-forget */});
  }

  const totalModels = Array.from(liveStages.values()).reduce(
    (n, s) => n + s.models.length, 0
  );

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#e5e7eb", fontFamily: "var(--font-sans, sans-serif)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #111", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#FFD700", margin: 0, letterSpacing: "-0.02em" }}>
            UJU CYCLE v5
          </h1>
          <p style={{ fontSize: 12, color: "#4b5563", margin: "2px 0 0", letterSpacing: "0.08em" }}>
            10-AI SOVEREIGN INTELLIGENCE PANEL
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {STAGE_SEQUENCE.map((stage) => {
            const s = liveStages.get(stage);
            const isDone   = s?.done;
            const isActive = stage === activeStage;
            return (
              <div
                key={stage}
                style={{
                  width:        8,
                  height:       8,
                  borderRadius: "50%",
                  background:   isDone ? "#4ade80" : isActive ? "#FFD700" : "#1a1a1a",
                  transition:   "background 0.3s",
                }}
              />
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        {/* Input panel */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 11, color: "#6b7280", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>
            Your Query — Strategy, Brand, Content, or Business Problem
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={runState === "running"}
            placeholder="e.g. How do I position my African fashion brand in the UK market against global fast-fashion competitors?"
            rows={4}
            style={{
              width:       "100%",
              background:  "#0a0a0a",
              border:      "1px solid #222",
              borderRadius: 12,
              padding:     "16px 18px",
              color:       "#e5e7eb",
              fontSize:    15,
              lineHeight:  1.6,
              resize:      "vertical",
              boxSizing:   "border-box",
              outline:     "none",
              fontFamily:  "var(--font-sans, sans-serif)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>
              {runState === "running" && `${totalModels} / 10 models active · Stage: ${activeStage ?? "..."}`}
              {runState === "done" && result && `✓ Completed in ${(result.totalDurationMs / 1000).toFixed(1)}s · ${result.modelCount} models`}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {runState === "running" && (
                <button
                  onClick={() => { abortRef.current?.abort(); setRunState("idle"); }}
                  style={{ padding: "10px 18px", background: "transparent", border: "1px solid #333", color: "#6b7280", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
                >
                  Stop
                </button>
              )}
              <button
                onClick={runCycle}
                disabled={!query.trim() || runState === "running"}
                style={{
                  padding:      "10px 28px",
                  background:   runState === "running" ? "#1a1200" : "#FFD700",
                  color:        runState === "running" ? "#FFD700" : "#000",
                  border:       runState === "running" ? "1px solid #FFD700" : "none",
                  borderRadius: 8,
                  cursor:       !query.trim() || runState === "running" ? "not-allowed" : "pointer",
                  fontWeight:   700,
                  fontSize:     14,
                  opacity:      !query.trim() ? 0.4 : 1,
                  transition:   "all 0.2s",
                }}
              >
                {runState === "running" ? "Running..." : "Run UJU Cycle v5"}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#1a0505", border: "1px solid #7f1d1d", borderRadius: 10, padding: "14px 18px", marginBottom: 24, color: "#f87171" }}>
            {error}
          </div>
        )}

        {/* Live stage panels */}
        {liveStages.size > 0 && (
          <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
            {STAGE_SEQUENCE.filter((s) => liveStages.has(s)).map((stage) => {
              const stageData = liveStages.get(stage)!;
              return (
                <StageCard
                  key={stage}
                  stage={stage}
                  data={stageData}
                  isActive={stage === activeStage}
                />
              );
            })}
          </div>
        )}

        {/* Final answer */}
        {result && (
          <FinalAnswer
            result={result}
            feedback={feedback}
            onFeedback={submitFeedback}
          />
        )}
      </div>

      {/* Footer legal */}
      <div style={{ borderTop: "1px solid #0e0e0e", padding: "10px 32px", textAlign: "center" }}>
        <p style={{ fontSize: 10, color: "#1a1a1a", margin: 0, letterSpacing: "0.06em" }}>
          UJU CYCLE™ v5 is a proprietary 10-AI methodology of UJU GROUP LIMITED. Protected as trade secrets under UK law.
        </p>
      </div>
    </div>
  );
}

function StageCard({ stage, data, isActive }: {
  stage:    UJUStage;
  data:     LiveStageState;
  isActive: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background:   "#0a0a0a",
        border:       `1px solid ${isActive ? "#FFD700" : data.done ? "#14532d" : "#1a1a1a"}`,
        borderRadius: 12,
        overflow:     "hidden",
        transition:   "border-color 0.3s",
      }}
    >
      <div
        style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        onClick={() => setExpanded((e) => !e)}
      >
        <span style={{ fontSize: 18 }}>{STAGE_ICONS[stage]}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, color: data.done ? "#4ade80" : isActive ? "#FFD700" : "#9ca3af", margin: 0, fontSize: 13 }}>
            {STAGE_LABELS[stage]}
          </p>
          <p style={{ fontSize: 11, color: "#4b5563", margin: "2px 0 0" }}>
            {data.done
              ? `${data.models.length} model${data.models.length !== 1 ? "s" : ""} complete`
              : isActive
              ? `${data.models.length} model${data.models.length !== 1 ? "s" : ""} responding...`
              : "Queued"}
          </p>
        </div>
        {isActive && (
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#FFD700", opacity: 0.6 + i * 0.2 }} />
            ))}
          </div>
        )}
        {data.done && <span style={{ fontSize: 16 }}>✓</span>}
        <span style={{ fontSize: 12, color: "#374151" }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && data.models.length > 0 && (
        <div style={{ borderTop: "1px solid #111", padding: "16px 18px", display: "grid", gap: 12 }}>
          {data.models.map((model) => (
            <ModelOutput key={model.modelId} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModelOutput({ model }: { model: UJUModelOutput }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ background: "#111", borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${model.color}` }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: show ? 10 : 0 }}
        onClick={() => setShow((s) => !s)}
      >
        <span>{model.icon}</span>
        <p style={{ fontWeight: 600, color: model.color, margin: 0, fontSize: 13 }}>{model.modelName}</p>
        <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>· {model.role}</p>
        <p style={{ fontSize: 10, color: "#374151", margin: "0 0 0 auto" }}>{model.durationMs}ms</p>
        <span style={{ fontSize: 11, color: "#374151" }}>{show ? "▲" : "▼"}</span>
      </div>
      {show && (
        <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {model.content}
        </p>
      )}
    </div>
  );
}

function FinalAnswer({ result, feedback, onFeedback }: {
  result:     UJUCycleResult;
  feedback:   "positive" | "negative" | null;
  onFeedback: (s: "positive" | "negative") => void;
}) {
  const [showTrace, setShowTrace] = useState(false);

  return (
    <div style={{ background: "#050500", border: "1px solid #3a3000", borderRadius: 16, padding: "28px 32px" }}>
      {/* Crown header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 22 }}>👑</span>
        <div>
          <p style={{ fontWeight: 800, color: "#FFD700", margin: 0, fontSize: 16, letterSpacing: "-0.01em" }}>
            Sovereign Intelligence — Final Answer
          </p>
          <p style={{ fontSize: 11, color: "#4b5563", margin: "2px 0 0" }}>
            ZAI_FINAL · {result.modelCount} models · {(result.totalDurationMs / 1000).toFixed(1)}s
          </p>
        </div>
      </div>

      {/* Final answer text */}
      <div style={{ fontSize: 15, color: "#e5e7eb", lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: 24 }}>
        {result.finalAnswer}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #1a1400" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onFeedback("positive")}
            style={{
              padding: "8px 14px",
              background:   feedback === "positive" ? "#14532d" : "#0a0a0a",
              border:       `1px solid ${feedback === "positive" ? "#4ade80" : "#1a1a1a"}`,
              color:        feedback === "positive" ? "#4ade80" : "#6b7280",
              borderRadius: 8,
              cursor:       "pointer",
              fontSize:     13,
            }}
          >
            👍 Helpful
          </button>
          <button
            onClick={() => onFeedback("negative")}
            style={{
              padding: "8px 14px",
              background:   feedback === "negative" ? "#450a0a" : "#0a0a0a",
              border:       `1px solid ${feedback === "negative" ? "#f87171" : "#1a1a1a"}`,
              color:        feedback === "negative" ? "#f87171" : "#6b7280",
              borderRadius: 8,
              cursor:       "pointer",
              fontSize:     13,
            }}
          >
            👎 Not Helpful
          </button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.finalAnswer).catch(() => {});
            }}
            style={{ padding: "8px 14px", background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#6b7280", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
          >
            Copy
          </button>
          <button
            onClick={() => setShowTrace((s) => !s)}
            style={{ padding: "8px 14px", background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#6b7280", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
          >
            {showTrace ? "Hide" : "Show"} Intelligence Trace
          </button>
        </div>
      </div>

      {/* Intelligence trace */}
      {showTrace && (
        <div style={{ marginTop: 24, borderTop: "1px solid #1a1a1a", paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            How this was generated — Full 10-AI Trace
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            {result.stages.map((stage) => (
              <TraceStage key={stage.stage} stage={stage} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TraceStage({ stage }: { stage: UJUStageResult }) {
  return (
    <div style={{ background: "#0a0a0a", borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <span>{STAGE_ICONS[stage.stage]}</span>
        <p style={{ fontWeight: 600, color: "#e5e7eb", margin: 0, fontSize: 13 }}>
          {STAGE_LABELS[stage.stage]}
        </p>
        <p style={{ fontSize: 10, color: "#374151", margin: "0 0 0 auto" }}>{stage.durationMs}ms</p>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {stage.models.map((m) => (
          <div key={m.modelId} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, flexShrink: 0 }}>{m.icon}</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: m.color, margin: "0 0 2px" }}>{m.modelName}</p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
                {m.content.slice(0, 200)}{m.content.length > 200 ? "..." : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
