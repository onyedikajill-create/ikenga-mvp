// ============================================================
// IKENGA v5 — MULTI-AGENT ORCHESTRATION ENGINE
// Runs an ordered graph of agents with shared context.
// ============================================================

import { runAgent, AGENTS } from "./agents";
import { logMemory } from "../memory/store";
import type { AgentContext, AgentOutput, OrchestrationResult, AgentId, TaskType } from "./types";
import { TASK_POLICIES } from "./policies";

export interface OrchestrationInput {
  task:      TaskType;
  input:     string;
  userId?:   string;
  sessionId?: string;
  agentIds?: AgentId[];  // override default agent graph for this task
}

export async function runOrchestration(
  input: OrchestrationInput
): Promise<OrchestrationResult> {
  const sessionId = input.sessionId ?? crypto.randomUUID();
  const t0        = Date.now();

  const policy   = TASK_POLICIES[input.task] ?? TASK_POLICIES.planning;
  const agentIds = input.agentIds ?? policy.agentSequence;

  const ctx: AgentContext = {
    sessionId,
    userId:       input.userId,
    task:         input.task,
    input:        input.input,
    priorOutputs: [],
  };

  const outputs: AgentOutput[] = [];

  for (const agentId of agentIds) {
    if (!AGENTS[agentId]) continue;

    ctx.priorOutputs = [...outputs];
    const output = await runAgent(agentId, ctx);
    outputs.push(output);
  }

  // Final synthesis is the last SynthesizerAgent or ExplainerAgent output, else last output
  const synthesis =
    outputs.find((o) => o.agentId === "ExplainerAgent")?.content ??
    outputs.find((o) => o.agentId === "SynthesizerAgent")?.content ??
    outputs.at(-1)?.content ??
    "";

  const confidence = outputs.length
    ? outputs.reduce((sum, o) => sum + o.confidence, 0) / outputs.length
    : 0;

  const result: OrchestrationResult = {
    sessionId,
    taskType:   input.task,
    input:      input.input,
    agents:     outputs,
    synthesis,
    confidence,
    durationMs: Date.now() - t0,
    completedAt: new Date().toISOString(),
  };

  // Log to memory asynchronously
  logMemory({
    type:      confidence >= 0.8 ? "successMemory" : "patternMemory",
    source:    "agentRun",
    sessionId,
    userId:    input.userId,
    query:     input.input,
    output:    synthesis,
    modelIds:  agentIds,
    score:     confidence,
    metadata:  { taskType: input.task, agentCount: agentIds.length },
  }).catch(() => {/* fire-and-forget */});

  return result;
}
