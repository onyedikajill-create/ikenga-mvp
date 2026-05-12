// ============================================================
// IKENGA v5 — ORCHESTRATION POLICIES
// Defines which agents run for each task type and in what order.
// ============================================================

import type { AgentId, TaskType } from "./types";

export interface TaskPolicy {
  task:          TaskType;
  agentSequence: AgentId[];
  description:   string;
  parallel?:     AgentId[][];  // groups that can run in parallel
}

export const TASK_POLICIES: Record<TaskType, TaskPolicy> = {
  content: {
    task:          "content",
    description:   "Content generation: strategy → research → synthesise → explain → govern",
    agentSequence: [
      "StrategistAgent",
      "ResearchAgent",
      "SynthesizerAgent",
      "ExplainerAgent",
      "GovernanceAgent",
    ],
  },

  planning: {
    task:          "planning",
    description:   "Strategic planning: strategy → research → critic → synthesise → explain",
    agentSequence: [
      "StrategistAgent",
      "ResearchAgent",
      "CriticAgent",
      "SynthesizerAgent",
      "ExplainerAgent",
    ],
  },

  diagnostics: {
    task:          "diagnostics",
    description:   "Problem diagnosis: research → critic → synthesise → govern",
    agentSequence: [
      "ResearchAgent",
      "CriticAgent",
      "SynthesizerAgent",
      "GovernanceAgent",
    ],
  },

  learning: {
    task:          "learning",
    description:   "Learning path: research → synthesise → explain",
    agentSequence: [
      "ResearchAgent",
      "SynthesizerAgent",
      "ExplainerAgent",
    ],
  },

  benchmark: {
    task:          "benchmark",
    description:   "Competitive benchmarking: research → benchmark → critic → synthesise",
    agentSequence: [
      "ResearchAgent",
      "BenchmarkAgent",
      "CriticAgent",
      "SynthesizerAgent",
    ],
  },

  governance: {
    task:          "governance",
    description:   "Governance review: full pipeline assessment",
    agentSequence: [
      "StrategistAgent",
      "ResearchAgent",
      "CriticAgent",
      "GovernanceAgent",
      "SynthesizerAgent",
    ],
  },

  research: {
    task:          "research",
    description:   "Deep research: research → critic → synthesise → explain",
    agentSequence: [
      "ResearchAgent",
      "CriticAgent",
      "SynthesizerAgent",
      "ExplainerAgent",
    ],
  },
};
