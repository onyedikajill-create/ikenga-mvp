// /api/orchestrate — Tyler Wise adversarial protocol endpoint

import { runTylerWise } from "@/src/ikenga/orchestration/tylerWise";
import type { TylerWiseInput } from "@/src/ikenga/orchestration/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { question, context } = body;

  if (typeof question !== "string" || !question.trim()) {
    return Response.json({ error: "question is required" }, { status: 400 });
  }

  const input: TylerWiseInput = {
    question:  question.trim(),
    context:   typeof context === "string" ? context : undefined,
    sessionId: crypto.randomUUID(),
  };

  try {
    const result = await runTylerWise(input);
    return Response.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Orchestration error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
