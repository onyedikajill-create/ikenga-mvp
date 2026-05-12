// ============================================================
// IKENGA POINTS & CHI RANK SYSTEM
//
// CHI RANKS — Corrected Igbo titles per Dr. Remy Ilona:
//   Nwa            = Child         (0–99 pts)
//   Odibo          = Apprentice    (100–499 pts)
//   Okenye         = Elder         (500–1,499 pts)
//   Dibia          = Wise One      (1,500–4,999 pts)
//   Di nke Content = Master        (5,000+ pts)
//
// "Eze" is NOT used. Eze = Priest, not King.
// ============================================================

export type ChiRank = "Nwa" | "Odibo" | "Okenye" | "Dibia" | "Di nke Content";

export interface RankConfig {
  rank:        ChiRank;
  meaning:     string;
  minPoints:   number;
  maxPoints:   number | null;
  color:       string;
  description: string;
}

export const CHI_RANKS: RankConfig[] = [
  {
    rank:      "Nwa",
    meaning:   "Child",
    minPoints: 0,
    maxPoints: 99,
    color:     "#888",
    description: "You have taken your first steps. The Chi within you is awakening.",
  },
  {
    rank:      "Odibo",
    meaning:   "Apprentice",
    minPoints: 100,
    maxPoints: 499,
    color:     "#60a5fa",
    description: "You are learning the way of the content builder. Keep moving.",
  },
  {
    rank:      "Okenye",
    meaning:   "Elder",
    minPoints: 500,
    maxPoints: 1499,
    color:     "#4ade80",
    description: "Your Chi has grown strong. Others look to you as a guide.",
  },
  {
    rank:      "Dibia",
    meaning:   "Wise One",
    minPoints: 1500,
    maxPoints: 4999,
    color:     "#c084fc",
    description: "You hold rare knowledge. Your content carries the weight of wisdom.",
  },
  {
    rank:      "Di nke Content",
    meaning:   "Master of Content",
    minPoints: 5000,
    maxPoints: null,
    color:     "#FFD700",
    description: "You have mastered the discipline of content creation. Your Chi is in full motion.",
  },
];

export type PointEvent =
  | "signup"
  | "generation"       // full 4-chunk campaign
  | "chunk"            // single chunk (25 pts each)
  | "streak_7"
  | "streak_14"
  | "streak_30"
  | "streak_90"
  | "streak_365"
  | "referral_signup"  // someone you referred signed up
  | "referral_gen"     // someone you referred generated content
  | "publish"          // published content to LinkedIn/X
  | "feedback"         // gave 👍/👎
  | "pro_upgrade";

export const POINT_VALUES: Record<PointEvent, number> = {
  signup:         50,
  generation:     100,
  chunk:          25,
  streak_7:       200,
  streak_14:      350,
  streak_30:      500,
  streak_90:      1000,
  streak_365:     2500,
  referral_signup: 150,
  referral_gen:    50,
  publish:        10,
  feedback:       5,
  pro_upgrade:    300,
};

export interface BadgeConfig {
  id:          string;
  name:        string;
  description: string;
  icon:        string;
  color:       string;
}

export const BADGES: BadgeConfig[] = [
  { id: "first_generation",   name: "Nwa Chi",               icon: "⚡", color: "#FFD700", description: "Completed your first generation." },
  { id: "first_publish",      name: "Voice of Ikenga",        icon: "📣", color: "#60a5fa", description: "Published your first piece of content." },
  { id: "first_referral",     name: "Keeper of Kin",          icon: "🤝", color: "#4ade80", description: "Referred your first person to IKENGA." },
  { id: "streak_7",           name: "Seven Suns",             icon: "🔥", color: "#fb923c", description: "7-day streak — you showed up every day." },
  { id: "streak_30",          name: "Full Moon",              icon: "🌕", color: "#c084fc", description: "30-day streak — discipline beyond most." },
  { id: "streak_90",          name: "Season of Power",        icon: "⚔️", color: "#f97316", description: "90-day streak — a full season of momentum." },
  { id: "streak_365",         name: "Year of the Chi",        icon: "🏆", color: "#FFD700", description: "365-day streak — you have moved for a full year." },
  { id: "pro_upgrade",        name: "Keeper of the Barn",     icon: "🏛️", color: "#c084fc", description: "Upgraded to Pro — you invested in your momentum." },
  { id: "gen_10",             name: "Builder",                icon: "🧱", color: "#888",    description: "10 complete generations." },
  { id: "gen_50",             name: "Engine Running",         icon: "⚙️", color: "#60a5fa", description: "50 complete generations." },
  { id: "referral_5",         name: "Referral Champion",      icon: "🌟", color: "#FFD700", description: "Referred 5 people to IKENGA." },
  { id: "dibia_rank",         name: "Dibia",                  icon: "🌿", color: "#c084fc", description: "Reached the rank of Dibia — Wise One." },
  { id: "di_nke_content",     name: "Di nke Content",         icon: "👑", color: "#FFD700", description: "Reached the highest rank — Master of Content." },
];

export function getRank(points: number): RankConfig {
  for (let i = CHI_RANKS.length - 1; i >= 0; i--) {
    if (points >= CHI_RANKS[i].minPoints) return CHI_RANKS[i];
  }
  return CHI_RANKS[0];
}

export function getNextRank(points: number): RankConfig | null {
  const current = getRank(points);
  const idx = CHI_RANKS.findIndex(r => r.rank === current.rank);
  return idx < CHI_RANKS.length - 1 ? CHI_RANKS[idx + 1] : null;
}

export function getProgressToNextRank(points: number): number {
  const current = getRank(points);
  const next    = getNextRank(points);
  if (!next) return 100;
  const range = next.minPoints - current.minPoints;
  const progress = points - current.minPoints;
  return Math.min(Math.round((progress / range) * 100), 100);
}

// ROI Calculator — 5-day campaign schema
export function calcROI(totalGenerations: number, isPro: boolean) {
  const postsPerCampaign    = 10;   // 2 per day × 5 days (LinkedIn + Instagram)
  const scriptsPerCampaign  = 5;    // 1 per day × 5 days
  const emailsPerCampaign   = 5;    // 1 per day × 5 days
  const adsPerCampaign      = 3;    // 3 ad creatives
  const totalAssets         = totalGenerations * (postsPerCampaign + scriptsPerCampaign + emailsPerCampaign + adsPerCampaign);
  const hoursPerAsset       = 0.5;  // conservative: 30 min per post to write manually
  const hourlyRateCopywriter = 75;  // £75/hr market rate UK
  const hoursSaved          = totalAssets * hoursPerAsset;
  const marketValue         = hoursSaved * hourlyRateCopywriter;
  const amountPaid          = isPro ? 49 : 0;  // lifetime assumed; monthly would be accruing
  const roi                 = amountPaid > 0 ? Math.round((marketValue / amountPaid) * 100) : 0;
  const costPerPost         = totalAssets > 0 && amountPaid > 0 ? (amountPaid / totalAssets).toFixed(2) : "—";

  return {
    totalAssets,
    hoursSaved: Math.round(hoursSaved),
    marketValue: Math.round(marketValue),
    amountPaid,
    roi,
    costPerPost,
  };
}
