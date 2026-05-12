// ============================================================
// /api/ai — Sovereign AI Gateway endpoint
// Accepts OpenAI-compatible request, routes to best provider.
// ============================================================

import { gatewayCall, gatewayStream } from "@/src/ikenga/gateway/router";
import type { GatewayRequest } from "@/src/ikenga/gateway/router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: Partial<GatewayRequest>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.messages?.length) {
    return Response.json({ error: "messages[] required" }, { status: 400 });
  }

  const req: GatewayRequest = {
    messages:    body.messages,
    system:      body.system,
    task:        body.task,
    provider:    body.provider,
    model:       body.model,
    maxTokens:   body.maxTokens,
    temperature: body.temperature,
    stream:      body.stream ?? false,
    costProfile: body.costProfile,
  };

  if (req.stream) {
    const encoder = new TextEncoder();
    const stream  = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of gatewayStream(req)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type":  "text/event-stream",
        "Cache-Control": "no-cache",
        Connection:      "keep-alive",
      },
    });
  }

  try {
    const result = await gatewayCall(req);
    return Response.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gateway error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
