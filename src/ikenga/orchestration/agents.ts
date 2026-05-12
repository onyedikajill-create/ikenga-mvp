// ============================================================
// IKENGA v5 — MULTI-AGENT DEFINITIONS
// Each agent has a role, tool set, and system directive.
// Agents communicate through shared AgentContext.
// ============================================================

import { gatewayCall } from "../gateway/router";
import type { AgentContext, AgentOutput, AgentId } from "./types";
import type { GatewayTaskType, GatewayProvider } from "../gateway/router";

export interface AgentDefinition {
  id:          AgentId;
  name:        string;
  description: string;
  icon:        string;
  task:        GatewayTaskType;
  provider:    GatewayProvider;
  maxTokens:   number;
  buildPrompt: (ctx: AgentContext) => string;
  systemDirective: string;
}

// ── Agent registry ────────────────────────────────────────────

export const AGENTS: Record<AgentId, AgentDefinition> = {
  StrategistAgent: {
    id:          "StrategistAgent",
    name:        "Strategist",
    description: "Defines the strategic frame and sets direction for the entire agent graph.",
    icon:        "🎯",
    task:        "reasoning",
    provider:    "anthropic",
    maxTokens:   1500,
    systemDirective: `You are the StrategistAgent. Your role is to define the strategic frame for any task.
Given an input, produce:
1. The strategic goal (what success looks like)
2. The key constraints (what limits the solution space)
3. The recommended agent sequence to solve this
4. The success metrics
Be concise, directive, and decisive.`,
    buildPrompt: (ctx) =>
      `TASK TYPE: ${ctx.task}\nINPUT: ${ctx.input}\n\nDefine the strategic frame for solving this.`,
  },

  ResearchAgent: {
    id:          "ResearchAgent",
    name:        "Researcher",
    description: "Deep-dives into the subject matter and surfaces relevant knowledge.",
    icon:        "🔬",
    task:        "content",
    provider:    "anthropic",
    maxTokens:   2000,
    systemDirective: `You are the ResearchAgent. Your role is to gather and synthesise relevant knowledge.
Given a task, produce:
1. Key facts, patterns, and precedents
2. What is known vs. unknown
3. The most relevant examples or case studies
4. Data points that should inform the decision
Be thorough. Be specific. Cite mechanisms, not just conclusions.`,
    buildPrompt: (ctx) => {
      const prior = ctx.priorOutputs?.map((o) => `${o.agentId}: ${o.content.slice(0, 300)}`).join("\n") ?? "";
      return `TASK: ${ctx.input}\nSTRATEGIC FRAME:\n${prior}\n\nResearch this thoroughly.`;
    },
  },

  CriticAgent: {
    id:          "CriticAgent",
    name:        "Critic",
    description: "Challenges every output — finds holes, assumptions, and blind spots.",
    icon:        "⚔️",
    task:        "critique",
    provider:    "anthropic",
    maxTokens:   1200,
    systemDirective: `You are the CriticAgent. Your role is adversarial quality control.
Given prior agent outputs:
1. Identify the 3 most critical weaknesses
2. Flag unstated assumptions
3. Surface the strongest counter-argument
4. Rate the overall reliability: HIGH / MEDIUM / LOW
Do not be diplomatic. Be accurate.`,
    buildPrompt: (ctx) => {
      const prior = ctx.priorOutputs?.map((o) => `## ${o.agentId}\n${o.content}`).join("\n\n") ?? ctx.input;
      return `TASK: ${ctx.input}\n\nPRIOR AGENT OUTPUTS:\n${prior}\n\nCritically assess the above.`;
    },
  },

  SynthesizerAgent: {
    id:          "SynthesizerAgent",
    name:        "Synthesizer",
    description: "Integrates all agent outputs into a unified, coherent response.",
    icon:        "🧬",
    task:        "synthesis",
    provider:    "anthropic",
    maxTokens:   2000,
    systemDirective: `You are the SynthesizerAgent. Your role is integration and coherence.
Given multiple agent perspectives:
1. Resolve contradictions — make the hard call
2. Identify the emergent insight that none of the agents saw alone
3. Produce a single, unified strategic output
4. Ensure the output is internally consistent and actionable
Think holistically. Synthesise — do not summarise.`,
    buildPrompt: (ctx) => {
      const prior = ctx.priorOutputs?.map((o) => `## ${o.agentId}\n${o.content}`).join("\n\n") ?? ctx.input;
      return `ORIGINAL TASK: ${ctx.input}\n\nALL AGENT OUTPUTS:\n${prior}\n\nSynthesise into a unified response.`;
    },
  },

  ExplainerAgent: {
    id:          "ExplainerAgent",
    name:        "Explainer",
    description: "Makes the synthesised output clear, accessible, and immediately actionable.",
    icon:        "💬",
    task:        "content",
    provider:    "anthropic",
    maxTokens:   1500,
    systemDirective: `You are the ExplainerAgent. Your role is clarity and accessibility.
Given a synthesised output:
1. Rewrite for a non-expert audience without losing accuracy
2. Add concrete examples, analogies, or step-by-step actions
3. Structure it: TL;DR then Full Answer then Next Step
4. Eliminate jargon; replace with plain language
Make it impossible to misunderstand.`,
    buildPrompt: (ctx) => {
      const synthesis = ctx.priorOutputs?.find((o) => o.agentId === "SynthesizerAgent")?.content ?? ctx.input;
      return `TASK: ${ctx.input}\n\nSYNTHESISED INTELLIGENCE:\n${synthesis}\n\nExplain this clearly and make it actionable.`;
    },
  },

  BenchmarkAgent: {
    id:          "BenchmarkAgent",
    name:        "Benchmarker",
    description: "Compares output against best-in-class standards and identifies gaps.",
    icon:        "📊",
    task:        "default",
    provider:    "anthropic",
    maxTokens:   1200,
    systemDirective: `You are the BenchmarkAgent. Your role is competitive intelligence.
Given an output or capability:
1. Compare it against the top 3 global leaders in this area
2. Identify specific gaps — what the leaders do that this doesn't
3. Identify unique advantages — what this does that leaders don't
4. Recommend the single highest-leverage improvement
Be specific. Name the competitors. Give concrete feature comparisons.`,
    buildPrompt: (ctx) => {
      const final = ctx.priorOutputs?.at(-1)?.content ?? ctx.input;
      return `TASK: ${ctx.input}\n\nOUTPUT TO BENCHMARK:\n${final}\n\nBenchmark against world-class standards.`;
    },
  },

  GovernanceAgent: {
    id:          "GovernanceAgent",
    name:        "Governance",
    description: "Ensures all outputs meet ethical, cultural, and legal standards.",
    icon:        "🛡",
    task:        "ethics",
    provider:    "anthropic",
    maxTokens:   1000,
    systemDirective: `You are the GovernanceAgent. Your role is oversight and integrity.
Review the full agent pipeline output for:
1. Ethical integrity — does it respect all stakeholders?
2. Cultural accuracy — does it represent African identity correctly?
3. Legal risk — does it make claims that could create liability?
4. Bias check — does it perpetuate harmful stereotypes?
Output: CLEARED / NEEDS_REVISION / BLOCKED with specific issues and recommended fixes.`,
    buildPrompt: (ctx) => {
      const all = ctx.priorOutputs?.map((o) => `## ${o.agentId}\n${o.content}`).join("\n\n") ?? ctx.input;
      return `TASK: ${ctx.input}\n\nFULL PIPELINE OUTPUT:\n${all}\n\nPerform governance review.`;
    },
  },
};

// ── Run a single agent ────────────────────────────────────────

export async function runAgent(
  agentId: AgentId,
  ctx: AgentContext
): Promise<AgentOutput> {
  const agent = AGENTS[agentId];
  const t0    = Date.now();

  const userMessage = agent.buildPrompt(ctx);

  let content: string;
  let confidence = 0.8;

  try {
    const res = await gatewayCall({
      messages:  [{ role: "user", content: userMessage }],
      system:    agent.systemDirective,
      task:      agent.task,
      provider:  agent.provider,
      maxTokens: agent.maxTokens,
    });
    content    = res.content;
    confidence = content.length > 200 ? 0.85 : 0.6;
  } catch (err) {
    content    = `[${agentId} error: ${err instanceof Error ? err.message : "unknown"}]`;
    confidence = 0;
  }

  return {
    agentId,
    content,
    confidence,
    durationMs: Date.now() - t0,
    metadata: { task: ctx.task, provider: agent.provider },
  };
}
