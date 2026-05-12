// ============================================================
// IKENGA v5 — MEMORY STRATEGIES
// Derives actionable insights from accumulated memory entries.
// ============================================================

import type { MemoryEntry, MemoryInsight } from "./types";

export function deriveInsights(entries: MemoryEntry[]): MemoryInsight[] {
  const insights: MemoryInsight[] = [];

  insights.push(...deriveModelPreferences(entries));
  insights.push(...deriveDomainPatterns(entries));
  insights.push(...deriveFailureClusters(entries));
  insights.push(...deriveSuccessPatterns(entries));

  return insights.sort((a, b) => b.confidence - a.confidence);
}

// ── Which models correlate with positive outcomes ─────────────
function deriveModelPreferences(entries: MemoryEntry[]): MemoryInsight[] {
  const positive = entries.filter((e) => e.feedback === "positive" || e.score >= 0.8);
  const negative = entries.filter((e) => e.feedback === "negative" || e.score <= 0.3);

  const pos: Record<string, number> = {};
  const neg: Record<string, number> = {};

  for (const e of positive) for (const m of e.modelIds ?? []) pos[m] = (pos[m] ?? 0) + 1;
  for (const e of negative) for (const m of e.modelIds ?? []) neg[m] = (neg[m] ?? 0) + 1;

  const modelScores = Object.keys({ ...pos, ...neg }).map((m) => ({
    model: m,
    score: (pos[m] ?? 0) - (neg[m] ?? 0) * 2,
  }));

  if (modelScores.length === 0) return [];

  const best  = modelScores.sort((a, b) => b.score - a.score)[0];
  const worst = modelScores[modelScores.length - 1];

  const insights: MemoryInsight[] = [];

  if (best && best.score > 0) {
    insights.push({
      id:          crypto.randomUUID(),
      insightType: "model_preference",
      description: `${best.model} consistently appears in high-scoring runs`,
      evidence:    positive.filter((e) => e.modelIds?.includes(best.model)).slice(0, 5),
      confidence:  Math.min(0.95, 0.5 + best.score / 20),
      actionable:  `Prioritise ${best.model} for future runs in similar domains`,
      createdAt:   new Date().toISOString(),
    });
  }

  if (worst && worst.score < -2) {
    insights.push({
      id:          crypto.randomUUID(),
      insightType: "model_preference",
      description: `${worst.model} frequently appears in low-scoring or negative-feedback runs`,
      evidence:    negative.filter((e) => e.modelIds?.includes(worst.model)).slice(0, 5),
      confidence:  Math.min(0.9, 0.4 + Math.abs(worst.score) / 20),
      actionable:  `Reduce weight of ${worst.model} or add a verification step after its output`,
      createdAt:   new Date().toISOString(),
    });
  }

  return insights;
}

// ── Which domains produce the most consistent outcomes ────────
function deriveDomainPatterns(entries: MemoryEntry[]): MemoryInsight[] {
  const domainStats: Record<string, { total: number; positive: number }> = {};

  for (const e of entries) {
    const d = e.domain ?? "general";
    if (!domainStats[d]) domainStats[d] = { total: 0, positive: 0 };
    domainStats[d].total++;
    if (e.feedback === "positive" || e.score >= 0.8) domainStats[d].positive++;
  }

  return Object.entries(domainStats)
    .filter(([, s]) => s.total >= 3)
    .map(([domain, s]) => {
      const rate = s.positive / s.total;
      return {
        id:          crypto.randomUUID(),
        insightType: "domain_pattern" as const,
        description: `${domain} domain: ${Math.round(rate * 100)}% positive outcome rate (${s.total} runs)`,
        evidence:    entries.filter((e) => e.domain === domain).slice(0, 5),
        confidence:  Math.min(0.95, 0.4 + s.total / 50),
        actionable:  rate >= 0.7
          ? `${domain} is a high-performing domain — use as benchmark for prompt tuning`
          : `${domain} needs refinement — review failed runs and apply corrections`,
        createdAt:   new Date().toISOString(),
      };
    });
}

// ── Clusters of repeated failure modes ───────────────────────
function deriveFailureClusters(entries: MemoryEntry[]): MemoryInsight[] {
  const failures = entries.filter(
    (e) => e.type === "failureMemory" || e.feedback === "negative"
  );

  if (failures.length < 3) return [];

  const tagCounts: Record<string, number> = {};
  for (const f of failures) for (const t of f.tags) tagCounts[t] = (tagCounts[t] ?? 0) + 1;

  return Object.entries(tagCounts)
    .filter(([, c]) => c >= 2)
    .map(([tag, count]) => ({
      id:          crypto.randomUUID(),
      insightType: "failure_cluster" as const,
      description: `Recurring failure pattern tagged "${tag}" (${count} occurrences)`,
      evidence:    failures.filter((e) => e.tags.includes(tag)).slice(0, 5),
      confidence:  Math.min(0.9, 0.4 + count / 10),
      actionable:  `Add a specific guard in the prompt for "${tag}" scenarios — inject example of correct handling`,
      createdAt:   new Date().toISOString(),
    }));
}

// ── What makes runs succeed ───────────────────────────────────
function deriveSuccessPatterns(entries: MemoryEntry[]): MemoryInsight[] {
  const successes = entries.filter(
    (e) => e.type === "successMemory" || (e.feedback === "positive" && e.score >= 0.85)
  );

  if (successes.length < 3) return [];

  const sourceCounts: Record<string, number> = {};
  for (const s of successes) sourceCounts[s.source] = (sourceCounts[s.source] ?? 0) + 1;

  return Object.entries(sourceCounts)
    .filter(([, c]) => c >= 2)
    .map(([source, count]) => ({
      id:          crypto.randomUUID(),
      insightType: "success_pattern" as const,
      description: `${source} generates consistently positive outcomes (${count} successes)`,
      evidence:    successes.filter((e) => e.source === source).slice(0, 5),
      confidence:  Math.min(0.92, 0.5 + count / 15),
      actionable:  `Route more complex queries through ${source} pipeline — it shows the highest success rate`,
      createdAt:   new Date().toISOString(),
    }));
}
