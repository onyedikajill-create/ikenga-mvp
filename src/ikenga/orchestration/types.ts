// ============================================================
// IKENGA v5 — ORCHESTRATION TYPES
// Shared types for Tyler Wise, multi-agent engine, and pipeline.
// ============================================================

export type AgentId =
  | "StrategistAgent"
  | "ResearchAgent"
  | "CriticAgent"
  | "SynthesizerAgent"
  | "ExplainerAgent"
  | "BenchmarkAgent"
  | "GovernanceAgent";

export type TaskType =
  | "content"
  | "diagnostics"
  | "planning"
  | "learning"
  | "benchmark"
  | "governance"
  | "research";

export interface AgentContext {
  sessionId: string;
  userId?:   string;
  task:      TaskType;
  input:     string;
  memory?:   Record<string, unknown>;
  priorOutputs?: AgentOutput[];
}

export interface AgentOutput {
  agentId:    AgentId;
  content:    string;
  confidence: number;          // 0–1
  durationMs: number;
  metadata?:  Record<string, unknown>;
}

export interface OrchestrationResult {
  sessionId:  string;
  taskType:   TaskType;
  input:      string;
  agents:     AgentOutput[];
  synthesis:  string;
  confidence: number;
  durationMs: number;
  completedAt: string;
}

// Tyler Wise specific types
export interface TylerWiseInput {
  question:  string;
  context?:  string;
  userId?:   string;
  sessionId?: string;
}

export interface TylerWiseStep {
  step:       number;
  name:       string;
  model:      string;
  content:    string;
  durationMs: number;
  role:       string;
}

export interface TylerWiseResult {
  sessionId:       string;
  question:        string;
  steps:           TylerWiseStep[];
  primaryAnswer:   string;
  adversarialChallenges: string;
  verificationConsensus: string;
  compressedCore:  string;
  finalAnswer:     string;
  riskRating:      "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  ethicsClearance: "CLEARED" | "NEEDS_REVISION" | "BLOCKED";
  confidence:      number;
  durationMs:      number;
  completedAt:     string;
}
