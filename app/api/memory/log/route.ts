import { logMemory } from "@/src/ikenga/memory/store";
import type { MemoryLogRequest } from "@/src/ikenga/memory/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: Partial<MemoryLogRequest>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.type || !body.source || !body.query || !body.output) {
    return Response.json(
      { error: "type, source, query, output are required" },
      { status: 400 }
    );
  }

  try {
    const entry = await logMemory(body as MemoryLogRequest);
    return Response.json({ success: true, id: entry.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Memory log error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
