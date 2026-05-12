// ============================================================
// IKENGA v5 — MEMORY STORE
// Supabase-backed persistent memory. Falls back to in-process
// store for dev / when DB is unavailable.
// ============================================================

import type {
  MemoryEntry,
  MemoryInsight,
  MemoryLogRequest,
  MemoryInsightsQuery,
  MemoryType,
} from "./types";
import { deriveInsights } from "./strategies";

// ── In-process fallback store ─────────────────────────────────
const IN_MEMORY: MemoryEntry[] = [];

function useSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ── Log a memory event ────────────────────────────────────────

export async function logMemory(req: MemoryLogRequest): Promise<MemoryEntry> {
  const entry: MemoryEntry = {
    id:         crypto.randomUUID(),
    type:       req.type,
    source:     req.source,
    sessionId:  req.sessionId,
    userId:     req.userId,
    query:      req.query,
    output:     req.output,
    feedback:   req.feedback,
    correction: req.correction,
    modelIds:   req.modelIds ?? [],
    domain:     req.domain,
    tags:       req.tags ?? [],
    score:      req.score ?? 0.7,
    metadata:   req.metadata ?? {},
    createdAt:  new Date().toISOString(),
  };

  if (useSupabase()) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase.from("memory_entries").insert(entry);
    } catch {
      IN_MEMORY.push(entry);
    }
  } else {
    IN_MEMORY.push(entry);
    if (IN_MEMORY.length > 1000) IN_MEMORY.shift(); // cap in-process store
  }

  return entry;
}

// ── Retrieve memory entries ───────────────────────────────────

export async function getMemoryEntries(
  query: MemoryInsightsQuery
): Promise<MemoryEntry[]> {
  if (useSupabase()) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      let q = supabase
        .from("memory_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(query.limit ?? 100);

      if (query.type)   q = q.eq("type",   query.type);
      if (query.source) q = q.eq("source", query.source);
      if (query.userId) q = q.eq("user_id", query.userId);
      if (query.domain) q = q.eq("domain",  query.domain);
      if (query.since)  q = q.gte("created_at", query.since);

      const { data } = await q;
      return (data ?? []) as MemoryEntry[];
    } catch {
      return filterInMemory(query);
    }
  }

  return filterInMemory(query);
}

function filterInMemory(query: MemoryInsightsQuery): MemoryEntry[] {
  return IN_MEMORY
    .filter((e) => (!query.type   || e.type   === query.type))
    .filter((e) => (!query.source || e.source === query.source))
    .filter((e) => (!query.userId || e.userId === query.userId))
    .filter((e) => (!query.domain || e.domain === query.domain))
    .filter((e) => (!query.since  || e.createdAt >= query.since))
    .slice(-(query.limit ?? 100))
    .reverse();
}

// ── Generate insights from memory ────────────────────────────

export async function getMemoryInsights(
  query: MemoryInsightsQuery
): Promise<MemoryInsight[]> {
  const entries = await getMemoryEntries({ ...query, limit: 500 });
  return deriveInsights(entries);
}

// ── Retrieve preferences for prompt augmentation ─────────────

export interface MemoryPreferences {
  preferredModels:  string[];
  avoidPatterns:    string[];
  successfulTones:  string[];
  topDomains:       string[];
  promptHints:      string[];
}

export async function getPreferences(userId?: string): Promise<MemoryPreferences> {
  const entries = await getMemoryEntries({
    userId,
    limit: 200,
  });

  const successes = entries.filter((e) =>
    e.type === "successMemory" || e.feedback === "positive"
  );
  const failures = entries.filter((e) =>
    e.type === "failureMemory" || e.feedback === "negative"
  );

  const modelCounts: Record<string, number> = {};
  for (const e of successes) {
    for (const m of (e.modelIds ?? [])) {
      modelCounts[m] = (modelCounts[m] ?? 0) + 1;
    }
  }

  const preferredModels = Object.entries(modelCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => id);

  const domainCounts: Record<string, number> = {};
  for (const e of entries) {
    if (e.domain) domainCounts[e.domain] = (domainCounts[e.domain] ?? 0) + 1;
  }

  const topDomains = Object.entries(domainCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([d]) => d);

  const avoidPatterns = failures
    .flatMap((e) => e.tags)
    .filter((t, i, a) => a.indexOf(t) === i)
    .slice(0, 5);

  const memoryTypes: MemoryType[] = ["preferenceMemory", "patternMemory"];
  const preferenceEntries = entries.filter((e) => memoryTypes.includes(e.type));
  const promptHints = preferenceEntries
    .map((e) => e.metadata?.hint as string)
    .filter(Boolean)
    .slice(0, 5);

  return { preferredModels, avoidPatterns, successfulTones: [], topDomains, promptHints };
}
