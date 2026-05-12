// ============================================================
// UJU CYCLE™ REFINEMENT ENGINE
// Proprietary post-processing layer for IKENGA AI responses.
// Transforms raw AI output into structured, bankable actions.
//
// Process: U¹ (Extract) → J (Prioritise) → U² (Optimise)
//
// This module is server-side only. Never import in client
// components. The internal logic is not exposed via any API.
// ============================================================

import type {
  UJUDomain,
  UJURefinedOutput,
  UJURefinementInput,
} from "./types";

// ------------------------------------------------------------------
// Domain detection — infers domain from the user query.
// ------------------------------------------------------------------

const DOMAIN_SIGNALS: Record<UJUDomain, string[]> = {
  brand:      ["brand", "identity", "reputation", "positioning", "audience"],
  content:    ["content", "post", "caption", "thread", "publish", "write", "copy"],
  legal:      ["legal", "discrimination", "rights", "contract", "comply", "regulation", "SAR"],
  waste:      ["waste", "circular", "recycle", "sustainability", "material", "reuse"],
  finance:    ["payment", "invoice", "revenue", "budget", "finance", "banking", "ledger"],
  government: ["government", "ministry", "procurement", "public service", "approval", "policy"],
  identity:   ["identity", "verification", "trust", "authentication", "KYC"],
  general:    [],
};

function detectDomain(query: string): UJUDomain {
  const q = query.toLowerCase();
  for (const [domain, signals] of Object.entries(DOMAIN_SIGNALS) as [UJUDomain, string[]][]) {
    if (domain === "general") continue;
    if (signals.some((s) => q.includes(s))) return domain;
  }
  return "general";
}

// ------------------------------------------------------------------
// U¹ — Extract essence: strip filler, keep the signal.
// ------------------------------------------------------------------

const FILLER_PHRASES = [
  "basically", "essentially", "actually", "literally",
  "in order to", "it is important to", "you may want to",
  "consider", "perhaps", "maybe", "potentially", "generally speaking",
  "it is worth noting that", "please note that",
];

function extractEssence(text: string): string {
  let result = text;
  for (const phrase of FILLER_PHRASES) {
    result = result.replace(new RegExp(`\\b${phrase}\\b`, "gi"), "").replace(/\s{2,}/g, " ");
  }
  // Keep the first 3 substantive sentences.
  const sentences = result.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 10);
  return sentences.slice(0, 3).join(" ").trim();
}

// ------------------------------------------------------------------
// J — Prioritise: derive the highest-leverage action from the input.
// ------------------------------------------------------------------

// Igbo cultural term glossary — used to enrich responses for Igbo queries.
const IGBO_CULTURAL_TERMS: Record<string, { meaning: string; contentAngle: string }> = {
  "oji":       { meaning: "Kola nut — the sacred gift of welcome, respect, and covenant", contentAngle: "Show how your brand welcomes its community the way Oji welcomes a guest. The first touch matters most." },
  "gini bu oji": { meaning: "What is Kola nut? — a question about the foundation of welcome and honour", contentAngle: "Tell the story of what your brand stands for at its root. What is the Oji of your offer — the thing that says 'you are welcome here'?" },
  "osu":       { meaning: "An Igbo term historically misused by colonial forces — there is no caste system in authentic Igbo culture. Every person belongs.", contentAngle: "Build content around radical inclusion. Your brand has no Osu — no one is too marginal, too late, or too small to belong." },
  "gini bu osu": { meaning: "A question about belonging and who is excluded — your brand should have no exclusions", contentAngle: "Write a bold inclusion statement: who your brand is for, who it is not for, and the explicit commitment to belonging." },
  "ikuchi nwanyi": { meaning: "The power/authority of a woman — Igbo women historically held commercial, spiritual, and communal authority", contentAngle: "Build content around female authority and economic power. Celebrate the Ikuchi Nwanyi of your audience — their power, not just their identity." },
  "chi":       { meaning: "Personal guardian spirit assigned by Chiukwu at birth — the divine force within each person", contentAngle: "Write content about the irreducible, authentic nature of your brand. Chi does not compromise. What is the thing your brand refuses to dilute?" },
  "ikenga":    { meaning: "The sacred carved symbol and shrine of your Chi — personal achievement, strength, forward motion", contentAngle: "Tell the story of what your brand has built and is still building. Motion is the message. What is in motion right now?" },
  "ndidi":     { meaning: "Patience — the root of 'Di' (husband). A mark of true maturity.", contentAngle: "Write about the long game. What is the thing your brand is building slowly and well — not chasing virality, but compounding?" },
  "omenala":   { meaning: "The way of the land — customs, cultural values, and traditions of a people", contentAngle: "Show how your brand is rooted in a living culture, not just an aesthetic. What tradition does your brand protect and transmit?" },
  "igba boi":  { meaning: "Apprenticeship tradition — 7 years of service, then the master blesses you to exceed him", contentAngle: "Write about the teaching relationship your brand has with its audience. What do you want them to surpass you in?" },
};

// Extract the most specific actionable phrase from freeform brand text.
function extractBrandAction(text: string): string | null {
  // Look for explicit goals
  const goalPatterns = [
    /(?:want to|trying to|goal is to|aim to|need to|plan to)\s+([^.!?,]{10,100})/i,
    /(?:grow|launch|build|increase|drive|expand|reach)\s+([^.!?,]{5,80})/i,
    /(?:for|targeting|aimed at)\s+([^.!?,]{5,80})\s+(?:who|that|aged)/i,
  ];
  for (const p of goalPatterns) {
    const m = text.match(p);
    if (m?.[1]) return m[1].trim().replace(/,\s*$/, "");
  }
  return null;
}

// Detect if the input contains an Igbo cultural term.
function detectIgboTerm(text: string): { term: string; data: { meaning: string; contentAngle: string } } | null {
  const lower = text.toLowerCase();
  for (const [term, data] of Object.entries(IGBO_CULTURAL_TERMS)) {
    if (lower.includes(term)) return { term, data };
  }
  return null;
}

// Extract brand name from input.
function extractBrand(text: string): string {
  const m = text.match(/(?:brand|called|named|my brand is|we are|we sell)[:\s]+([A-Z][^\s,\.]{1,30})/i)
    ?? text.match(/^([A-Z][a-zA-Z\s]{2,25})(?:\s+is|\s+sells|\s+helps)/);
  return m?.[1]?.trim() ?? "";
}

function findPriorityAction(essence: string, domain: UJUDomain, rawInput: string): string {
  // 1. Check for Igbo cultural term — return culturally accurate answer
  const igboMatch = detectIgboTerm(rawInput);
  if (igboMatch) {
    return igboMatch.data.contentAngle;
  }

  // 2. Extract specific brand goal from the input
  const brandGoal = extractBrandAction(rawInput);
  const brand = extractBrand(rawInput);

  if (brandGoal) {
    const brandPrefix = brand ? `For ${brand}: ` : "";
    switch (domain) {
      case "brand":
        return `${brandPrefix}Write and publish your brand's core promise around "${brandGoal.slice(0, 60)}" today — one sentence, unambiguous, public.`;
      case "content":
        return `${brandPrefix}Create one piece of content this week that speaks directly to "${brandGoal.slice(0, 60)}" — lead with the result your audience gets, not the product you sell.`;
      default:
        return `${brandPrefix}Take the single most direct action toward "${brandGoal.slice(0, 60)}" in the next 24 hours — not planning, not research. Movement.`;
    }
  }

  // 3. Brand name found but no explicit goal — build from context
  if (brand) {
    switch (domain) {
      case "brand":
        return `Define what ${brand} stands for in one sentence. Publish it. That one act creates the clarity everything else is built on.`;
      case "content":
        return `Start ${brand}'s content with the story of why it exists — not the product, the reason. That story, told well, is your most powerful asset.`;
      default:
        return `Identify ${brand}'s single most urgent next action and do it today. Momentum is built in 24-hour windows, not quarterly plans.`;
    }
  }

  // 4. Domain-specific non-generic fallbacks (extract from essence)
  const sentences = essence.split(/[.!?]/).filter(s => s.trim().length > 15);
  const core = sentences[0]?.trim();
  if (core && core.length > 20) {
    return `Your priority: ${core.charAt(0).toUpperCase() + core.slice(1).toLowerCase().replace(/\s+/g, " ")}. Do this before anything else.`;
  }

  // 5. Domain fallbacks — still specific, not generic
  const DOMAIN_FALLBACK_ACTIONS: Record<UJUDomain, string> = {
    brand:      "Write your brand's 'one sentence' — what you do, who it is for, and why it matters. Publish it today.",
    content:    "Identify the single best story only you can tell. Write the first draft in the next 60 minutes.",
    legal:      "Document everything with timestamps. Start the paper trail right now — it is your most valuable asset.",
    waste:      "Audit your primary waste stream for seven consecutive days before drawing any conclusions.",
    finance:    "Identify your largest cost centre and challenge every line item as if your runway depends on it.",
    government: "Map the decision-maker chain before submitting any formal request — the meeting is decided before it begins.",
    identity:   "Collect and verify only the minimum identity attributes your process truly requires.",
    general:    "Name the one thing that would make the most difference if you did it today. Then do only that.",
  };
  return DOMAIN_FALLBACK_ACTIONS[domain];
}

// ------------------------------------------------------------------
// Investment estimates by domain.
// ------------------------------------------------------------------

const DOMAIN_INVESTMENTS: Record<UJUDomain, string> = {
  brand:      "1–2 hours (positioning workshop or single focused writing session)",
  content:    "30–60 minutes (drafting, editing, and publishing)",
  legal:      "1–2 hours (research and timestamped documentation)",
  waste:      "$0–$100 depending on audit scope and tools required",
  finance:    "2–3 hours (data pull, line-item review, and prioritisation)",
  government: "1–2 hours (stakeholder mapping and submission preparation)",
  identity:   "1–4 hours (requirements gathering and verification setup)",
  general:    "15–30 minutes",
};

// ------------------------------------------------------------------
// Timeline estimates by domain.
// ------------------------------------------------------------------

const DOMAIN_TIMELINES: Record<UJUDomain, string> = {
  brand:      "3–7 days to measurable audience response",
  content:    "24–48 hours for initial engagement signal",
  legal:      "30 days for a Subject Access Request (SAR) response",
  waste:      "7 days for a complete baseline audit",
  finance:    "48–72 hours for a full cost picture",
  government: "5–15 working days for an initial acknowledgement",
  identity:   "24–48 hours to implement and test a verification flow",
  general:    "3–7 days to see first results",
};

// ------------------------------------------------------------------
// Hidden opportunity — the insight most people miss.
// ------------------------------------------------------------------

const DOMAIN_OPPORTUNITIES: Record<UJUDomain, string> = {
  brand:      "Your audience remembers the one thing you repeat, not the ten things you say. Pick one.",
  content:    "Your failures drive 3× more engagement than polished wins. Use them.",
  legal:      "Most people skip the SAR request. It contains 80% of the evidence you need.",
  waste:      "Your waste is someone else's raw material. Find that buyer before you pay to dispose.",
  finance:    "The cost you have accepted as fixed is usually the one most open to renegotiation.",
  government: "The decision is made before the meeting. Focus on pre-meeting conversations.",
  identity:   "Over-verification destroys conversion. Collect only what you will actually use.",
  general:    "The obvious path is crowded. The adjacent possibility almost always has less competition.",
};

// ------------------------------------------------------------------
// U² — Build the optimised output struct.
// ------------------------------------------------------------------

function buildOutput(
  priorityAction: string,
  essence: string,
  domain: UJUDomain
): Omit<UJURefinedOutput, "refinedAt" | "domain"> {
  return {
    priorityAction,
    context:          essence.slice(0, 220).trimEnd() + (essence.length > 220 ? "…" : ""),
    investment:       DOMAIN_INVESTMENTS[domain],
    timeline:         DOMAIN_TIMELINES[domain],
    hiddenOpportunity: DOMAIN_OPPORTUNITIES[domain],
    loopInstruction:  "Return with your results and IKENGA will generate your next step.",
  };
}

// ------------------------------------------------------------------
// Public entry point.
// ------------------------------------------------------------------

/**
 * Apply the UJU Cycle™ refinement to a raw AI response.
 *
 * This is the only export consumers should use.
 * The internal three-step process (U¹ → J → U²) is not exposed.
 */
export function refineResponse(input: UJURefinementInput): UJURefinedOutput {
  const domain = input.domain ?? detectDomain(input.userQuery);
  const essence = extractEssence(input.rawResponse);
  const priorityAction = findPriorityAction(essence, domain, input.rawResponse);
  const base = buildOutput(priorityAction, essence, domain);

  // Enrich with Igbo cultural context when a known term is detected
  const igboMatch = detectIgboTerm(input.rawResponse);
  if (igboMatch) {
    return {
      ...base,
      context: `${igboMatch.term.toUpperCase()}: ${igboMatch.data.meaning}`,
      hiddenOpportunity: "Igbo cultural concepts carry deep commercial intelligence. The brands that understand their cultural roots produce content that moves people — not just clicks.",
      domain,
      refinedAt: new Date().toISOString(),
    };
  }

  return {
    ...base,
    domain,
    refinedAt: new Date().toISOString(),
  };
}

/**
 * Serialise a refined output into the user-facing string format.
 *
 * The structure is intentional and branded.
 * It does not reveal the refinement process.
 */
export function formatRefinedOutput(output: UJURefinedOutput): string {
  return [
    `YOUR PRIORITY ACTION`,
    output.priorityAction,
    ``,
    `Why this matters:`,
    output.context,
    ``,
    `Investment: ${output.investment}`,
    `Timeline:   ${output.timeline}`,
    ``,
    output.loopInstruction,
    ``,
    `━━━ What most people miss ━━━`,
    output.hiddenOpportunity,
  ].join("\n");
}

/**
 * Standard response when users ask how the system works.
 * Truthful. Protects IP without deception.
 */
export function proprietaryResponse(): string {
  return "The refinement process is proprietary to UJU Cycle™. What would you like to work on?";
}
