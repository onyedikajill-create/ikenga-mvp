// ============================================================
// /api/uju/run — UJU Cycle v5 API endpoint
// Streams progress events as SSE or returns full JSON result.
// ============================================================

import { runUJUCycle, runUJUCycleStreaming } from "@/src/ikenga/ai/ujuCycle";
import type { UJUInput } from "@/src/ikenga/ai/ujuCycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// 5-minute timeout for full 10-AI pipeline
export const maxDuration = 300;

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { query, context, domain, stream } = body;

  if (typeof query !== "string" || !query.trim()) {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  const input: UJUInput = {
    query:     query.trim(),
    context:   typeof context === "string" ? context : undefined,
    domain:    typeof domain  === "string" ? domain  : undefined,
    sessionId: crypto.randomUUID(),
  };

  if (stream === true) {
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of runUJUCycleStreaming(input)) {
            const data = JSON.stringify(event);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Pipeline error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error: msg })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type":  "text/event-stream",
        "Cache-Control": "no-cache",
        Connection:      "keep-alive",
      },
    });
  }

  try {
    const result = await runUJUCycle(input);
    return Response.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Cycle error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
