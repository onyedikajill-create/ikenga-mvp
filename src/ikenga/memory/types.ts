// ============================================================
// IKENGA v5 — MEMORY ENGINE TYPES
// ============================================================

export type MemoryType =
  | "successMemory"
  | "failureMemory"
  | "correctionMemory"
  | "preferenceMemory"
  | "patternMemory";

export type MemorySource = "ujuCycle" | "tylerWise" | "agentRun" | "userFeedback" | "benchmark";

export interface MemoryEntry {
  id:         string;
  type:       MemoryType;
  source:     MemorySource;
  sessionId?: string;
  userId?:    string;
  query:      string;
  output:     string;
  feedback?:  "positive" | "negative" | "neutral";
  correction?: string;
  modelIds?:  string[];
  domain?:    string;
  tags:       string[];
  score:      number;          // 0–1 quality score
  metadata:   Record<string, unknown>;
  createdAt:  string;
}

export interface MemoryInsight {
  id:          string;
  insightType: "model_preference" | "domain_pattern" | "failure_cluster" | "success_pattern" | "user_preference";
  description: string;
  evidence:    MemoryEntry[];
  confidence:  number;
  actionable:  string;         // what to change in future runs
  createdAt:   string;
}

export interface MemoryLogRequest {
  type:       MemoryType;
  source:     MemorySource;
  sessionId?: string;
  userId?:    string;
  query:      string;
  output:     string;
  feedback?:  MemoryEntry["feedback"];
  correction?: string;
  modelIds?:  string[];
  domain?:    string;
  tags?:      string[];
  score?:     number;
  metadata?:  Record<string, unknown>;
}

export interface MemoryInsightsQuery {
  type?:    MemoryType;
  source?:  MemorySource;
  userId?:  string;
  domain?:  string;
  limit?:   number;
  since?:   string;
}
