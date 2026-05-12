import { getMemoryInsights, getMemoryEntries } from "@/src/ikenga/memory/store";
import type { MemoryInsightsQuery } from "@/src/ikenga/memory/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const url    = new URL(request.url);
  const params = url.searchParams;

  const query: MemoryInsightsQuery = {
    type:   (params.get("type")   as MemoryInsightsQuery["type"])   ?? undefined,
    source: (params.get("source") as MemoryInsightsQuery["source"]) ?? undefined,
    userId: params.get("userId") ?? undefined,
    domain: params.get("domain") ?? undefined,
    limit:  params.get("limit")  ? parseInt(params.get("limit")!) : 100,
    since:  params.get("since")  ?? undefined,
  };

  try {
    const [insights, entries] = await Promise.all([
      getMemoryInsights(query),
      getMemoryEntries({ ...query, limit: 20 }),
    ]);

    return Response.json({
      insights,
      recentEntries: entries,
      total:         entries.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Insights error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
