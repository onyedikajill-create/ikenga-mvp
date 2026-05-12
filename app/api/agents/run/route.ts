// /api/agents/run — Multi-agent orchestration endpoint

import { runOrchestration } from "@/src/ikenga/orchestration/engine";
import type { OrchestrationInput } from "@/src/ikenga/orchestration/engine";
import type { TaskType } from "@/src/ikenga/orchestration/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const VALID_TASKS: TaskType[] = [
  "content", "diagnostics", "planning", "learning",
  "benchmark", "governance", "research",
];

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { task, input, agentIds } = body;

  if (!VALID_TASKS.includes(task as TaskType)) {
    return Response.json(
      { error: `task must be one of: ${VALID_TASKS.join(", ")}` },
      { status: 400 }
    );
  }
  if (typeof input !== "string" || !input.trim()) {
    return Response.json({ error: "input is required" }, { status: 400 });
  }

  const orchestrationInput: OrchestrationInput = {
    task:      task as TaskType,
    input:     input.trim(),
    sessionId: crypto.randomUUID(),
    agentIds:  Array.isArray(agentIds) ? agentIds : undefined,
  };

  try {
    const result = await runOrchestration(orchestrationInput);
    return Response.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Orchestration error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
