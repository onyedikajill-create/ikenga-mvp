// ============================================================
// IKENGA v5 — BENCHMARKING ENGINE
// Analyses capability gaps vs. top 10 apps.
// Returns actionable feature suggestions for IKENGA modules.
// ============================================================

import { BENCHMARK_APPS, getAllCapabilities } from "./apps";
import type { CapabilityBlock, BenchmarkApp } from "./apps";

export interface CapabilityGap {
  capability:     CapabilityBlock;
  appsWithIt:     string[];
  ikengaHasIt:    boolean;
  priority:       "critical" | "high" | "medium" | "low";
  suggestedModule: string;
  implementation:  string;
}

export interface BenchmarkReport {
  totalAppsAnalysed:   number;
  ikengaCapabilities:  CapabilityBlock[];
  gaps:                CapabilityGap[];
  opportunities:       AppOpportunity[];
  priorityFeatures:    PriorityFeature[];
  coverageScore:       number;  // 0–100
  generatedAt:         string;
}

export interface AppOpportunity {
  app:          string;
  appIcon:      string;
  module:       string;
  gap:          string;
  opportunity:  string;
  priority:     "critical" | "high" | "medium";
}

export interface PriorityFeature {
  rank:         number;
  feature:      string;
  learnedFrom:  string[];
  ikengaModule: string;
  impact:       string;
  effort:       "low" | "medium" | "high";
}

// ── Current IKENGA capabilities ───────────────────────────────
// Update this list as new features ship
const IKENGA_CAPABILITIES: CapabilityBlock[] = [
  "ai_personalization",
  "content_creation_tools",
  "subscription_monetization",
  "freemium_upsell",
  "gamification",
  "streak_mechanics",
  "leaderboards",
  "creator_economy",
  "community_building",
  "analytics_dashboard",
  "referral_program",
];

// Priority weight: how many top apps have this capability
function priorityFromCount(count: number): CapabilityGap["priority"] {
  if (count >= 5) return "critical";
  if (count >= 3) return "high";
  if (count >= 2) return "medium";
  return "low";
}

// Map capability to IKENGA module
const CAPABILITY_MODULE: Partial<Record<CapabilityBlock, string>> = {
  viral_loop:             "Community / Growth",
  ai_personalization:     "UJU Cycle / Memory",
  social_proof:           "Community / Chi Rank",
  gamification:           "Gamification",
  content_creation_tools: "Studio",
  infinite_scroll:        "Knowledge Hub",
  push_notifications:     "Admin / Engagement",
  community_building:     "Community",
  subscription_monetization: "Payments",
  freemium_upsell:        "Payments / Onboarding",
  search_discovery:       "Knowledge Hub",
  streak_mechanics:       "Gamification",
  leaderboards:           "Gamification",
  collaborative_editing:  "Studio / Community",
  template_library:       "Studio / Content",
  audio_experience:       "Studio / Audio",
  trust_verification:     "Community / Admin",
  marketplace:            "Payments / Community",
  creator_economy:        "Community / Studio",
  offline_mode:           "App Architecture",
  mini_programs:          "Admin / Platform",
  cross_platform_sync:    "App Architecture",
  analytics_dashboard:    "Admin",
  referral_program:       "Growth",
  skill_tree:             "Learning",
};

// Map capability to implementation suggestion
const CAPABILITY_IMPL: Partial<Record<CapabilityBlock, string>> = {
  viral_loop:             "Build a 'Share your Chi' mechanic — one-click share of any IKENGA output with a branded card",
  social_proof:           "Show public Chi rank, content count, and top outputs on user profiles",
  infinite_scroll:        "Community content feed ranked by quality score — endless relevant intelligence",
  push_notifications:     "Daily Chi Pulse notification — a signal extracted from the user's active domain",
  search_discovery:       "Semantic search across all generated content using embeddings",
  collaborative_editing:  "Shared workspaces — teams can collaborate on content pipelines",
  template_library:       "Community template marketplace — users publish and monetise prompt frameworks",
  audio_experience:       "Text-to-speech output for all content — listen to your strategy on the go",
  trust_verification:     "Chi Verification badge — verified experts get a trust mark on their profile",
  marketplace:            "IKENGA Marketplace — creators sell content packages; platform takes 15% fee",
  offline_mode:           "Cache last 50 outputs locally for offline access",
  mini_programs:          "Partner embed system — tools integrate inside IKENGA interface",
  cross_platform_sync:    "Native mobile app with seamless web sync",
  skill_tree:             "Structured learning paths from Beginner → Chi Master with unlockable content",
};

// ── Main report generator ─────────────────────────────────────

export function generateBenchmarkReport(): BenchmarkReport {
  const allCaps = getAllCapabilities();
  const ikengaSet = new Set(IKENGA_CAPABILITIES);

  const capCountMap: Record<string, string[]> = {};
  for (const app of BENCHMARK_APPS) {
    for (const cap of app.capabilities) {
      if (!capCountMap[cap]) capCountMap[cap] = [];
      capCountMap[cap].push(app.name);
    }
  }

  const gaps: CapabilityGap[] = allCaps
    .filter((cap) => !ikengaSet.has(cap))
    .map((cap) => ({
      capability:      cap,
      appsWithIt:      capCountMap[cap] ?? [],
      ikengaHasIt:     false,
      priority:        priorityFromCount((capCountMap[cap] ?? []).length),
      suggestedModule: CAPABILITY_MODULE[cap] ?? "Platform",
      implementation:  CAPABILITY_IMPL[cap] ?? `Implement ${cap.replace(/_/g, " ")} capability`,
    }))
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    });

  const opportunities: AppOpportunity[] = BENCHMARK_APPS.flatMap((app) =>
    app.ikengaMapping.map((m) => ({
      app:         app.name,
      appIcon:     app.icon,
      module:      m.module,
      gap:         m.gap,
      opportunity: m.opportunity,
      priority:    (app.monthlyUsers.includes("B") ? "critical" : "high") as "critical" | "high",
    }))
  );

  const priorityFeatures: PriorityFeature[] = [
    {
      rank:         1,
      feature:      "Viral Share Cards",
      learnedFrom:  ["TikTok", "Spotify Wrapped", "Instagram"],
      ikengaModule: "Community / Growth",
      impact:       "Every output becomes a branded acquisition channel",
      effort:       "low",
    },
    {
      rank:         2,
      feature:      "Daily Chi Habit Loop",
      learnedFrom:  ["Duolingo", "Spotify", "TikTok"],
      ikengaModule: "Gamification",
      impact:       "Streaks + daily ritual convert casual users to power users",
      effort:       "medium",
    },
    {
      rank:         3,
      feature:      "Skill Tree & Learning Path",
      learnedFrom:  ["Duolingo", "YouTube"],
      ikengaModule: "Learning",
      impact:       "Structured progression creates long-term retention and upsell moments",
      effort:       "medium",
    },
    {
      rank:         4,
      feature:      "Audio Output (TTS)",
      learnedFrom:  ["Spotify", "YouTube"],
      ikengaModule: "Studio",
      impact:       "Opens commuter use-case — 3x session time potential",
      effort:       "low",
    },
    {
      rank:         5,
      feature:      "Community Content Feed",
      learnedFrom:  ["TikTok", "Instagram", "YouTube"],
      ikengaModule: "Knowledge Hub",
      impact:       "Passive discovery loop — users find value without generating it",
      effort:       "high",
    },
    {
      rank:         6,
      feature:      "Template Marketplace",
      learnedFrom:  ["Notion", "Canva"],
      ikengaModule: "Studio",
      impact:       "Community-driven content supply + creator monetisation",
      effort:       "high",
    },
    {
      rank:         7,
      feature:      "Chi Year in Review",
      learnedFrom:  ["Spotify Wrapped"],
      ikengaModule: "Gamification",
      impact:       "Annual viral campaign driving massive organic acquisition",
      effort:       "medium",
    },
  ];

  const coverageScore = Math.round(
    (IKENGA_CAPABILITIES.length / allCaps.length) * 100
  );

  return {
    totalAppsAnalysed:  BENCHMARK_APPS.length,
    ikengaCapabilities: IKENGA_CAPABILITIES,
    gaps,
    opportunities,
    priorityFeatures,
    coverageScore,
    generatedAt:        new Date().toISOString(),
  };
}

export function getBenchmarkForApp(appId: string): BenchmarkApp | null {
  return BENCHMARK_APPS.find((a) => a.id === appId) ?? null;
}
