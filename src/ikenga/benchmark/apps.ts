// ============================================================
// IKENGA v5 — COMMERCIAL BENCHMARK MAP
// Static capability profiles of the 10 most studied apps.
// Used to identify gaps and extract reusable capability blocks.
// ============================================================

export type CapabilityBlock =
  | "viral_loop"
  | "ai_personalization"
  | "social_proof"
  | "gamification"
  | "content_creation_tools"
  | "infinite_scroll"
  | "push_notifications"
  | "community_building"
  | "subscription_monetization"
  | "freemium_upsell"
  | "search_discovery"
  | "streak_mechanics"
  | "leaderboards"
  | "collaborative_editing"
  | "template_library"
  | "audio_experience"
  | "trust_verification"
  | "marketplace"
  | "creator_economy"
  | "offline_mode"
  | "mini_programs"
  | "cross_platform_sync"
  | "analytics_dashboard"
  | "referral_program"
  | "skill_tree";

export interface BenchmarkApp {
  id:           string;
  name:         string;
  category:     string;
  tagline:      string;
  monthlyUsers: string;
  revenueModel: string;
  icon:         string;
  capabilities: CapabilityBlock[];
  growthLoops:  string[];
  uxPrimitives: string[];
  keyMetrics:   Record<string, string>;
  ikengaMapping: {
    module:   string;
    gap:      string;
    opportunity: string;
  }[];
}

export const BENCHMARK_APPS: BenchmarkApp[] = [
  {
    id:           "tiktok",
    name:         "TikTok",
    category:     "Short-form video / Social",
    tagline:      "Make every second count",
    monthlyUsers: "1.5B+",
    revenueModel: "Ads + TikTok Shop + Creator Fund",
    icon:         "🎵",
    capabilities: ["viral_loop", "ai_personalization", "infinite_scroll", "creator_economy", "push_notifications"],
    growthLoops: [
      "For You Page algorithm creates instant value for new users (no follow required)",
      "Duet/Stitch features drive content remixing and viral chains",
      "Sound trends create participation hooks across the community",
      "Creator monetization drives high-quality supply",
    ],
    uxPrimitives: ["swipe to next", "sound-on default", "full-screen immersion", "one-tap record", "quick edit templates"],
    keyMetrics: {
      avgSession:      "95 minutes/day",
      videoCompletion: "80%+",
      creatorRetention: "High — monetization lock-in",
      timeToValue:      "< 30 seconds (FYP immediately engaging)",
    },
    ikengaMapping: [
      {
        module:      "Studio",
        gap:         "No short-form video creation or remix capability",
        opportunity: "Add one-tap content remixing — take any IKENGA output and turn it into a 60-second video script",
      },
      {
        module:      "Content Engine",
        gap:         "No algorithmic content discovery feed",
        opportunity: "Build a community content feed ranked by Chi score (quality × relevance × freshness)",
      },
    ],
  },

  {
    id:           "instagram",
    name:         "Instagram",
    category:     "Photo / Video / Social",
    tagline:      "Capture and share the world's moments",
    monthlyUsers: "2B+",
    revenueModel: "Ads + Shopping + Subscriptions",
    icon:         "📷",
    capabilities: ["viral_loop", "social_proof", "creator_economy", "community_building", "ai_personalization", "marketplace"],
    growthLoops: [
      "Follow graph drives content distribution without paid ads",
      "Stories create daily re-engagement habit",
      "Reels algorithm surfaces content to non-followers (discovery engine)",
      "Brand partnerships and affiliate tools monetize creators",
    ],
    uxPrimitives: ["grid aesthetic", "stories at top", "explore page", "DM-first social", "broadcast channels"],
    keyMetrics: {
      avgSession:   "30 minutes/day",
      storyViews:   "500M+ daily",
      reelsGrowth:  "200% YoY",
      adRevenue:    "$17B+ annually",
    },
    ikengaMapping: [
      {
        module:      "Community",
        gap:         "No public profile / portfolio showcase",
        opportunity: "Chi Profile — public reputation page showing rank, content, and verified expertise",
      },
      {
        module:      "Content Engine",
        gap:         "No Stories-equivalent for quick updates",
        opportunity: "Daily Chi Pulse — a daily signal broadcast for pro users",
      },
    ],
  },

  {
    id:           "youtube",
    name:         "YouTube",
    category:     "Long-form video / Education",
    tagline:      "Broadcast yourself",
    monthlyUsers: "2.7B+",
    revenueModel: "Ads + YouTube Premium + Memberships + Super Thanks",
    icon:         "▶️",
    capabilities: ["creator_economy", "search_discovery", "community_building", "subscription_monetization", "analytics_dashboard"],
    growthLoops: [
      "Search + recommendation dual discovery — SEO and algorithmic",
      "Subscriber notifications re-engage existing audience",
      "Watch time optimization drives session length",
      "Channel memberships create recurring revenue for creators",
    ],
    uxPrimitives: ["recommended sidebar", "chapters / timestamps", "pinned comments", "end screens", "playlist sequencing"],
    keyMetrics: {
      avgWatchTime:    "40 minutes/day",
      searchQueries:   "3B+/day",
      creatorRevenue:  "$70B+ paid to creators (2021–2023)",
      premiumUsers:    "80M+",
    },
    ikengaMapping: [
      {
        module:      "Learning",
        gap:         "No structured video learning library",
        opportunity: "IKENGA Learn — AI-generated video scripts + slide decks for knowledge modules",
      },
      {
        module:      "Studio",
        gap:         "No chapter / timestamp generation for long content",
        opportunity: "Auto-generate YouTube descriptions, chapters, and tags from content output",
      },
    ],
  },

  {
    id:           "chatgpt",
    name:         "ChatGPT",
    category:     "AI Assistant / Productivity",
    tagline:      "A new interface for AI",
    monthlyUsers: "180M+",
    revenueModel: "Freemium + ChatGPT Plus/Team/Enterprise",
    icon:         "🤖",
    capabilities: ["ai_personalization", "subscription_monetization", "freemium_upsell", "cross_platform_sync", "content_creation_tools"],
    growthLoops: [
      "Immediate value on first use — no onboarding friction",
      "Custom GPTs marketplace creates network effects",
      "Memory features create switching cost / lock-in",
      "Enterprise tier drives B2B expansion revenue",
    ],
    uxPrimitives: ["blank input box (zero friction)", "streaming response", "conversation history", "code interpreter", "file upload"],
    keyMetrics: {
      payingUsers:  "10M+ Plus subscribers",
      apiRevenue:   "Estimated $1B+ ARR",
      responseTime: "< 3 seconds (GPT-4o)",
      retention:    "High — memory and history lock-in",
    },
    ikengaMapping: [
      {
        module:      "UJU Cycle",
        gap:         "ChatGPT is general — IKENGA lacks cultural depth and adversarial rigour by comparison",
        opportunity: "Tyler Wise Protocol is the differentiator — position it as 'ChatGPT that challenges itself'",
      },
      {
        module:      "Memory Engine",
        gap:         "IKENGA memory is newer and less mature",
        opportunity: "Build user-facing memory dashboard — let users see and curate what IKENGA has learned about them",
      },
    ],
  },

  {
    id:           "duolingo",
    name:         "Duolingo",
    category:     "EdTech / Language Learning",
    tagline:      "The free, fun, and effective way to learn a language",
    monthlyUsers: "83M+",
    revenueModel: "Freemium + Duolingo Plus + Ads",
    icon:         "🦉",
    capabilities: ["gamification", "streak_mechanics", "push_notifications", "leaderboards", "skill_tree", "freemium_upsell"],
    growthLoops: [
      "Streaks create daily re-engagement habit — loss aversion drives return",
      "Leaderboards add social competition within friend groups",
      "XP system rewards any engagement, not just completion",
      "Personalized lesson difficulty keeps users in flow state",
    ],
    uxPrimitives: ["streak flame UI", "hearts / lives system", "owl mascot emotional design", "bite-size lessons (< 5 min)", "celebration animations"],
    keyMetrics: {
      DAU:           "83M+",
      streakRetention: "Streaks > 30 days correlate with 90%+ retention",
      paidConversion:  "8% of MAU → Plus",
      lessonLength:    "Average 3–5 minutes",
    },
    ikengaMapping: [
      {
        module:      "Gamification",
        gap:         "Chi rank system exists but lacks emotional design and daily habit loops",
        opportunity: "Add daily Chi ritual — a 5-minute daily challenge tied to the user's active product",
      },
      {
        module:      "Learning",
        gap:         "No skill tree or structured progression path",
        opportunity: "Build IKENGA Skill Trees — progressions from Beginner Brand Builder to Chi Master",
      },
    ],
  },

  {
    id:           "notion",
    name:         "Notion",
    category:     "Productivity / Knowledge Management",
    tagline:      "One workspace, every team",
    monthlyUsers: "35M+",
    revenueModel: "Freemium + Plus/Team/Enterprise tiers",
    icon:         "📝",
    capabilities: ["collaborative_editing", "template_library", "ai_personalization", "cross_platform_sync", "community_building", "subscription_monetization"],
    growthLoops: [
      "Template gallery drives virality (share templates → attract new users)",
      "Workspace sharing creates team adoption from individual use",
      "API integrations create ecosystem lock-in",
      "Notion AI upsell inside existing workflow (no context switch)",
    ],
    uxPrimitives: ["block-based editing", "nested pages", "drag-and-drop", "inline databases", "public page sharing"],
    keyMetrics: {
      ARR:            "$250M+ (estimated)",
      templateShares: "Millions of community templates",
      teamAdoption:   "70%+ of revenue from teams (started as individual)",
      aiPenetration:  "Rapid — embedded in existing workflow",
    },
    ikengaMapping: [
      {
        module:      "Knowledge Hub",
        gap:         "No persistent knowledge base or nested content organisation",
        opportunity: "Chi Knowledge Base — users can save, tag, and share IKENGA outputs as a living knowledge system",
      },
      {
        module:      "Studio",
        gap:         "No template marketplace",
        opportunity: "IKENGA Template Marketplace — community-created prompt templates and content frameworks",
      },
    ],
  },

  {
    id:           "canva",
    name:         "Canva",
    category:     "Design / Creative Tools",
    tagline:      "What will you design today?",
    monthlyUsers: "190M+",
    revenueModel: "Freemium + Canva Pro + Teams + Enterprise",
    icon:         "🎨",
    capabilities: ["template_library", "ai_personalization", "collaborative_editing", "content_creation_tools", "freemium_upsell", "creator_economy"],
    growthLoops: [
      "Template virality — designs shared publicly include Canva branding",
      "Magic Design AI removes the blank canvas fear (instant first output)",
      "Team sharing drives upgrade from individual to Teams plan",
      "Education program captures students before career = lifetime value",
    ],
    uxPrimitives: ["drag-and-drop canvas", "magic resize", "one-click template customization", "brand kit", "AI image generation"],
    keyMetrics: {
      revenue:      "$2.3B ARR (2024)",
      templates:    "250,000+ templates",
      designsCreated: "15B+ designs",
      paidUsers:    "16M+",
    },
    ikengaMapping: [
      {
        module:      "Studio",
        gap:         "Slides are AI-generated but not visually designed",
        opportunity: "One-click export to Canva — send IKENGA slide content to Canva for design",
      },
      {
        module:      "Content Engine",
        gap:         "No visual asset generation alongside text content",
        opportunity: "Integrate image generation into content output — produce post text + image prompt in one step",
      },
    ],
  },

  {
    id:           "spotify",
    name:         "Spotify",
    category:     "Music / Audio / Podcasts",
    tagline:      "Music for everyone",
    monthlyUsers: "640M+",
    revenueModel: "Freemium + Spotify Premium + Advertising",
    icon:         "🎧",
    capabilities: ["ai_personalization", "audio_experience", "subscription_monetization", "creator_economy", "offline_mode", "social_proof"],
    growthLoops: [
      "Discover Weekly — hyper-personalised playlist drives re-engagement every Monday",
      "Wrapped annual campaign creates massive organic social sharing",
      "Podcast exclusives drive premium conversion",
      "Social features (collaborative playlists, friend activity) create retention",
    ],
    uxPrimitives: ["persistent mini-player", "lyrics sync", "queue management", "cross-device handoff", "Spotify Canvas (looping video)"],
    keyMetrics: {
      MAU:           "640M+",
      premiumUsers:  "240M+",
      podcastShows:  "6M+",
      Wrapped:       "156M+ Wrapped cards shared in 2023",
    },
    ikengaMapping: [
      {
        module:      "Studio",
        gap:         "Audio scripts exist but no audio playback or podcast production",
        opportunity: "IKENGA Audio — AI voice narration of scripts (TTS) + podcast episode generator",
      },
      {
        module:      "Gamification",
        gap:         "No annual recap / Wrapped-equivalent",
        opportunity: "Chi Year in Review — annual AI-generated summary of a user's IKENGA journey, shareable",
      },
    ],
  },

  {
    id:           "uber",
    name:         "Uber",
    category:     "Marketplace / On-demand",
    tagline:      "Get there. Your day belongs to you.",
    monthlyUsers: "137M+",
    revenueModel: "Take rate (15–30%) + Uber One subscription + Ads",
    icon:         "🚗",
    capabilities: ["marketplace", "trust_verification", "referral_program", "subscription_monetization", "push_notifications", "analytics_dashboard"],
    growthLoops: [
      "Supply-demand flywheel: more drivers → lower wait times → more riders → more drivers",
      "Referral credits drive low-CAC acquisition on both sides of marketplace",
      "Uber One bundling creates cross-sell between Rides and Eats",
      "Surge pricing creates urgency and immediate conversion",
    ],
    uxPrimitives: ["real-time map", "upfront pricing", "driver rating", "one-tap re-order", "live tracking"],
    keyMetrics: {
      trips:         "9.4B+ annually",
      takeRate:      "27% average",
      uberOne:       "19M+ subscribers",
      driverNPS:     "Improving — key supply-side metric",
    },
    ikengaMapping: [
      {
        module:      "Payments",
        gap:         "No marketplace or two-sided transaction capability",
        opportunity: "IKENGA Marketplace — creators can sell content packages/templates; IKENGA takes a platform fee",
      },
      {
        module:      "Community",
        gap:         "No verified expertise marketplace",
        opportunity: "Chi Expert Network — users with Chi Master rank can offer paid advisory sessions",
      },
    ],
  },

  {
    id:           "wechat",
    name:         "WeChat",
    category:     "Super App / Messaging / Payments",
    tagline:      "More than a messenger",
    monthlyUsers: "1.3B+",
    revenueModel: "Payments (WeChat Pay) + Mini Programs + Ads + Enterprise",
    icon:         "💬",
    capabilities: ["mini_programs", "marketplace", "community_building", "trust_verification", "offline_mode", "cross_platform_sync", "social_proof"],
    growthLoops: [
      "Mini Programs eliminate app install friction — any business can live inside WeChat",
      "Red Packet viral loop (send money to groups) = social + financial engagement",
      "Official Accounts create media/brand channels inside the super app",
      "Moments (social feed) creates daily habit without leaving app",
    ],
    uxPrimitives: ["mini program shell", "scan to pay", "moments feed", "group chats as collaboration units", "official accounts"],
    keyMetrics: {
      MAU:           "1.33B+",
      miniPrograms:  "4M+ mini programs",
      wechatPay:     "$1.67T annual GMV (WeChat Pay)",
      businessUsers: "100M+ official accounts",
    },
    ikengaMapping: [
      {
        module:      "Admin",
        gap:         "No embedded third-party tools or mini-program ecosystem",
        opportunity: "IKENGA Plugin System — let partners embed their tools inside IKENGA (super app pattern)",
      },
      {
        module:      "Payments",
        gap:         "No in-app social payment or tipping feature",
        opportunity: "Chi Gifting — users can send Chi points or credits as social gifts",
      },
    ],
  },
];

export function getApp(id: string): BenchmarkApp | undefined {
  return BENCHMARK_APPS.find((a) => a.id === id);
}

export function getAllCapabilities(): CapabilityBlock[] {
  const seen = new Set<CapabilityBlock>();
  for (const app of BENCHMARK_APPS) {
    for (const cap of app.capabilities) seen.add(cap);
  }
  return [...seen];
}
