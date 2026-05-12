// ============================================================
// POST /api/products/generate
// Product-aware generation — injects product voice into engine.
// Saves all individual content items to content_items table.
// Requires session cookie.
// ============================================================

import { supabase } from "../../../../src/ikenga/lib/supabase";
import { getSessionEmail } from "../../../../src/ikenga/lib/session";
import {
  generateIkengaContent,
  generateIkengaChunk,
  generateIkengaAtomic,
  normalizeIkengaGenerationInput,
  type GenerationChunk,
  type AtomicType,
} from "../../../../src/ikenga/content/ikengaGenerator";
import { awardPoints } from "../../points/route";
import { getProduct, type ProductId } from "../../../../src/ikenga/products/config";
import { checkRateLimit, recordError, isCircuitOpen, type RateLimitTier } from "../../../../src/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Helpers ──────────────────────────────────────────────────

function scoreQuality(text: string): string {
  const len = (text ?? "").trim().length;
  if (len > 300) return "A";
  if (len > 150) return "B";
  if (len > 60)  return "C";
  return "D";
}

// Field names match the generator schema exactly.
interface SocialPost    { dayNumber?: number; platform?: string; hook?: string; caption?: string; callToAction?: string; hashtags?: string[]; }
interface VideoScript   { dayNumber?: number; title?: string; hook?: string; scenes?: { narration?: string }[]; callToAction?: string; }
interface EmailItem     { dayNumber?: number; subjectLine?: string; previewText?: string; body?: string; callToAction?: string; }
interface AdItem        { headline?: string; primaryText?: string; callToAction?: string; audience?: string; }
interface GeneratedPack {
  socialPosts?:      SocialPost[];
  videoScripts?:     VideoScript[];
  carouselOutlines?: { dayNumber?: number; title?: string; slides?: { headline?: string; supportingCopy?: string }[]; callToAction?: string }[];
  emails?:           EmailItem[];
  ads?:              AdItem[];
}

type ContentItemInsert = {
  email: string; product: string; content_type: string;
  title: string; body: string; platform?: string | null;
  day?: number | null; quality: string; metadata: unknown;
};

function packToItems(pack: GeneratedPack, email: string, product: string): ContentItemInsert[] {
  const items: ContentItemInsert[] = [];

  (pack.socialPosts ?? []).forEach(p => {
    const body = [p.hook, p.caption, p.callToAction].filter(Boolean).join("\n\n");
    items.push({ email, product, content_type: "social_post", title: p.hook ?? "Social post", body, platform: p.platform ?? null, day: p.dayNumber ?? null, quality: scoreQuality(body), metadata: { hashtags: p.hashtags ?? [] } });
  });

  (pack.videoScripts ?? []).forEach(v => {
    const narrations = (v.scenes ?? []).map(s => s.narration).filter(Boolean).join("\n\n");
    const body = [v.hook, narrations, v.callToAction].filter(Boolean).join("\n\n");
    items.push({ email, product, content_type: "video_script", title: v.title ?? "Video script", body, platform: null, day: v.dayNumber ?? null, quality: scoreQuality(body), metadata: {} });
  });

  (pack.carouselOutlines ?? []).forEach(c => {
    const slideText = (c.slides ?? []).map(s => [s.headline, s.supportingCopy].filter(Boolean).join(": ")).join("\n");
    const body = [c.title, slideText, c.callToAction].filter(Boolean).join("\n\n");
    items.push({ email, product, content_type: "carousel", title: c.title ?? "Carousel", body, platform: null, day: c.dayNumber ?? null, quality: scoreQuality(body), metadata: {} });
  });

  (pack.emails ?? []).forEach(e => {
    const body = [e.previewText, e.body, e.callToAction].filter(Boolean).join("\n\n");
    items.push({ email, product, content_type: "email", title: e.subjectLine ?? "Email", body, platform: null, day: e.dayNumber ?? null, quality: scoreQuality(body), metadata: {} });
  });

  (pack.ads ?? []).forEach(a => {
    const body = [a.primaryText, a.callToAction].filter(Boolean).join("\n\n");
    items.push({ email, product, content_type: "ad", title: a.headline ?? "Ad", body, platform: null, day: null, quality: scoreQuality(body), metadata: { audience: a.audience } });
  });

  return items;
}

// ── Route ─────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const email = await getSessionEmail();
  if (!email) return Response.json({ error: "Not logged in." }, { status: 401 });

  // Fetch profile — only select columns that exist in the base schema.
  // bonus_gens and active_product are added by platform_schema.sql and
  // may not exist yet; read them separately and fall back to defaults.
  const { data: profile, error: profileErr } = await supabase
    .from("user_profiles")
    .select("tier, pro_type, pro_expires, gens_used")
    .eq("email", email)
    .maybeSingle();

  if (profileErr) {
    console.error("user_profiles select error:", profileErr.message, "| email:", email);
    return Response.json(
      { error: "Database error reading profile.", detail: profileErr.message },
      { status: 500 }
    );
  }

  // Auto-create profile if missing (handles edge case where login happened
  // before the table existed)
  if (!profile) {
    await supabase
      .from("user_profiles")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  }

  const safeProfile = profile ?? { tier: "free", pro_type: null, pro_expires: null, gens_used: 0 };

  // Read new columns separately — fail silently if they don't exist yet
  let bonusGens = 0;
  let activeProduct = "IKENGA";
  try {
    const { data: ext } = await supabase
      .from("user_profiles")
      .select("bonus_gens, active_product")
      .eq("email", email)
      .maybeSingle();
    bonusGens     = (ext as { bonus_gens?: number } | null)?.bonus_gens    ?? 0;
    activeProduct = (ext as { active_product?: string } | null)?.active_product ?? "IKENGA";
  } catch { /* columns may not exist yet */ }

  // Read Chi Profile for learned tone preference (non-blocking fallback)
  let learnedTone = "";
  let chiProfileComplete = 0;
  try {
    const { data: chi } = await supabase
      .from("chi_profiles")
      .select("preferred_tone, thumbs_up_count, thumbs_down_count")
      .eq("email", email)
      .maybeSingle();
    if (chi) {
      learnedTone = (chi as { preferred_tone?: string }).preferred_tone ?? "";
      const total = ((chi as { thumbs_up_count?: number }).thumbs_up_count ?? 0) +
                    ((chi as { thumbs_down_count?: number }).thumbs_down_count ?? 0);
      chiProfileComplete = Math.min(Math.round((total / 20) * 100), 100);
    }
  } catch { /* chi_profiles table may not exist yet */ }

  // ── Circuit breaker ───────────────────────────────────────────
  if (isCircuitOpen()) {
    return Response.json({
      error:   "Service temporarily unavailable — high error rate detected. Please try again in 2 minutes.",
      circuit: "open",
    }, { status: 503 });
  }

  // Super admin — bypass all tier limits
  const SUPER_ADMINS = new Set([
    "onyedikajill@gmail.com",
    "ikengaapp@gmail.com",
    "afrohouseportimao@gmail.com",
  ]);
  const isSuperAdmin = SUPER_ADMINS.has(email);

  // Check tier
  let tier = safeProfile.tier as string;
  if (tier === "pro" && safeProfile.pro_type === "monthly" && safeProfile.pro_expires) {
    if (new Date(safeProfile.pro_expires) < new Date()) tier = "free";
  }

  const totalFreeGens = 3 + bonusGens;
  if (!isSuperAdmin && tier === "free" && safeProfile.gens_used >= totalFreeGens) {
    return Response.json({
      error: "Free tier limit reached.",
      message: `You have used all ${totalFreeGens} free generations. Upgrade to Pro to continue.`,
      upgradeUrl: "/pay",
    }, { status: 402 });
  }

  // ── Per-user rate limit ────────────────────────────────────────
  if (!isSuperAdmin) {
    const rateTier: RateLimitTier = tier === "enterprise" ? "enterprise" : tier === "pro" ? "pro" : "free";
    const rl = checkRateLimit(email, rateTier);
    if (!rl.allowed) {
      return Response.json({
        error:          rl.reason,
        retryAfterMs:   rl.retryAfterMs,
        upgradeUrl:     tier === "free" ? "/pay" : undefined,
      }, {
        status:  429,
        headers: rl.retryAfterMs ? { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } : {},
      });
    }
  }

  // Parse body
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const productId  = (typeof body.product === "string" ? body.product : activeProduct) as ProductId;
  const brand      =  typeof body.brand    === "string" ? body.brand.trim()    : "";
  const goals      =  typeof body.goals    === "string" ? body.goals.trim()    : "";
  const chunk      = (typeof body.chunk === "string" ? body.chunk : null) as GenerationChunk | null;
  const atomicType = (typeof body.atomicType === "string" ? body.atomicType : null) as AtomicType | null;
  const atomicDay  =  typeof body.day      === "number" ? body.day      : 1;
  const atomicPlat =  typeof body.platform === "string" ? body.platform : "LinkedIn";
  const isFirst    =  body.isFirst === true;

  if (!brand || !goals) return Response.json({ error: "brand and goals are required." }, { status: 400 });

  const product = getProduct(productId);

  // Update active product on profile (non-blocking)
  void supabase.from("user_profiles").update({ active_product: productId }).eq("email", email);

  // Build shared input
  const input = normalizeIkengaGenerationInput({
    brand,
    goals,
    niche:    typeof body.niche    === "string" ? body.niche    : undefined,
    audience: typeof body.audience === "string" ? body.audience : undefined,
    offer:    typeof body.offer    === "string" ? body.offer    : undefined,
    website:  typeof body.website  === "string" ? body.website  : undefined,
    tone:     product.tone + (learnedTone ? `, ${learnedTone}` : "") + (typeof body.tone === "string" && body.tone ? `, ${body.tone}` : ""),
    notes:    `PRODUCT VOICE DIRECTIVE: ${product.toneDirective}${typeof body.notes === "string" && body.notes ? `\n\nAdditional notes: ${body.notes}` : ""}`,
    contentPillars: [],
    callsToAction:  [],
  });

  // ── Atomic generation path ───────────────────────────────────
  // 1 item per call, max_tokens=2000 — guaranteed no truncation.
  // Client sends 21 sequential calls for a 5-day campaign.
  if (atomicType) {
    const validAtomicTypes: AtomicType[] = ["social_post", "video_script", "email", "ads"];
    if (!validAtomicTypes.includes(atomicType)) {
      return Response.json({ error: `Invalid atomicType: ${atomicType}` }, { status: 400 });
    }

    if (isFirst) {
      void supabase.from("generation_logs").insert({ email, label: `Atomic generation started — ${productId} · ${brand.slice(0,40)}`, product: productId });
      void supabase.from("user_events").insert({ email, event: "generate", product: productId, metadata: { brand: brand.slice(0,40), atomic: true } });
      await supabase.from("user_profiles").update({ gens_used: safeProfile.gens_used + 1 }).eq("email", email);
    }

    let result;
    try {
      result = await generateIkengaAtomic(atomicType, atomicDay, atomicPlat, input);
    } catch (err) {
      recordError();
      const message = err instanceof Error ? err.message : String(err);
      return Response.json({ error: message }, { status: 500 });
    }

    const raw = result.output as Record<string, unknown>;

    // Build content item(s) from single atomic result
    const atomicItems: ContentItemInsert[] = [];
    if (atomicType === "social_post") {
      const hook = typeof raw.hook === "string" ? raw.hook : "";
      const caption = typeof raw.caption === "string" ? raw.caption : "";
      const cta = typeof raw.callToAction === "string" ? raw.callToAction : "";
      const body = [hook, caption, cta].filter(Boolean).join("\n\n");
      atomicItems.push({ email, product: productId, content_type: "social_post", title: hook || "Social post", body, platform: atomicPlat, day: atomicDay, quality: scoreQuality(body), metadata: { hashtags: Array.isArray(raw.hashtags) ? raw.hashtags : [] } });
    } else if (atomicType === "video_script") {
      const title = typeof raw.title === "string" ? raw.title : "Video script";
      const hook = typeof raw.hook === "string" ? raw.hook : "";
      const scenes = Array.isArray(raw.scenes) ? (raw.scenes as { narration?: string }[]).map(s => s.narration ?? "").filter(Boolean).join("\n\n") : "";
      const cta = typeof raw.callToAction === "string" ? raw.callToAction : "";
      const body = [hook, scenes, cta].filter(Boolean).join("\n\n");
      atomicItems.push({ email, product: productId, content_type: "video_script", title, body, platform: null, day: atomicDay, quality: scoreQuality(body), metadata: {} });
    } else if (atomicType === "email") {
      const subject = typeof raw.subjectLine === "string" ? raw.subjectLine : "Email";
      const preview = typeof raw.previewText === "string" ? raw.previewText : "";
      const bodyText = typeof raw.body === "string" ? raw.body : "";
      const cta = typeof raw.callToAction === "string" ? raw.callToAction : "";
      const body = [preview, bodyText, cta].filter(Boolean).join("\n\n");
      atomicItems.push({ email, product: productId, content_type: "email", title: subject, body, platform: null, day: atomicDay, quality: scoreQuality(body), metadata: {} });
    } else if (atomicType === "ads") {
      const ads = Array.isArray(raw.ads) ? raw.ads as { headline?: string; primaryText?: string; callToAction?: string; audience?: string }[] : [];
      for (const a of ads) {
        const body = [a.primaryText, a.callToAction].filter(Boolean).join("\n\n");
        atomicItems.push({ email, product: productId, content_type: "ad", title: a.headline ?? "Ad", body, platform: null, day: null, quality: scoreQuality(body), metadata: { audience: a.audience } });
      }
    }

    if (atomicItems.length > 0) {
      await supabase.from("content_items").insert(atomicItems);
    }

    // On the final call (ads), log completion + award full generation points
    if (atomicType === "ads") {
      void supabase.from("generation_logs").insert({ email, label: `Atomic generation complete — ${productId}`, product: productId });
      const today = new Date().toISOString().split("T")[0];
      void supabase.from("user_profiles").update({ last_active: today } as Record<string, unknown>).eq("email", email);
      void awardPoints(email, "generation", { product: productId }).catch(() => {});
    } else {
      void awardPoints(email, "chunk", { product: productId, atomicType }).catch(() => {});
    }

    return Response.json({
      success:    true,
      atomicType,
      product:    productId,
      itemsSaved: atomicItems.length,
      gensUsed:   safeProfile.gens_used + (isFirst ? 1 : 0),
      tier,
      chiProfileComplete,
      learnedTone: learnedTone || null,
    });
  }

  // ── Chunked generation path ───────────────────────────────────
  // When chunk is provided, run one focused call and return immediately.
  // The client makes 4 sequential chunk requests, advancing the progress bar after each.
  // Only the first chunk (social) increments gens_used.
  if (chunk) {
    const validChunks: GenerationChunk[] = ["social", "video", "email", "ads"];
    if (!validChunks.includes(chunk)) {
      return Response.json({ error: `Invalid chunk: ${chunk}. Must be one of: ${validChunks.join(", ")}` }, { status: 400 });
    }

    if (chunk === "social") {
      // Log start + increment gens_used only once (on the first chunk)
      void supabase.from("generation_logs").insert({ email, label: `Chunked generation started — ${productId} · ${brand.slice(0,40)}`, product: productId });
      void supabase.from("user_events").insert({ email, event: "generate", product: productId, metadata: { brand: brand.slice(0,40), chunked: true } });
      await supabase.from("user_profiles").update({ gens_used: safeProfile.gens_used + 1 }).eq("email", email);
    }

    let result;
    try {
      result = await generateIkengaChunk(chunk, input);
    } catch (err) {
      recordError();
      const message = err instanceof Error ? err.message : String(err);
      return Response.json({ error: message }, { status: 500 });
    }

    const pack = result.output as GeneratedPack;
    const items = packToItems(pack, email, productId);
    if (items.length > 0) {
      await supabase.from("content_items").insert(items);
    }

    if (chunk === "ads") {
      // Final chunk — log completion, award full generation points
      void supabase.from("generation_logs").insert({ email, label: `Chunked generation complete — ${productId}`, product: productId });
      const today = new Date().toISOString().split("T")[0];
      void supabase.from("user_profiles").update({ last_active: today } as Record<string, unknown>).eq("email", email);
      void awardPoints(email, "generation", { product: productId }).catch(() => {});
    } else {
      // Each intermediate chunk earns chunk points
      void awardPoints(email, "chunk", { product: productId, chunk }).catch(() => {});
    }

    return Response.json({
      success: true,
      chunk,
      product: productId,
      itemsSaved: items.length,
      gensUsed: safeProfile.gens_used + 1,
      tier,
      chiProfileComplete,
      learnedTone: learnedTone || null,
    });
  }

  // ── Full (legacy) generation path ─────────────────────────────
  void supabase.from("generation_logs").insert({ email, label: `Generation started — ${productId} · ${brand.slice(0,40)}`, product: productId });
  void supabase.from("user_events").insert({ email, event: "generate", product: productId, metadata: { brand: brand.slice(0,40) } });

  // Run generation
  let result;
  try {
    result = await generateIkengaContent(input);
  } catch (err) {
    recordError();
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }

  // Increment gens_used
  await supabase.from("user_profiles").update({ gens_used: safeProfile.gens_used + 1 }).eq("email", email);

  // Save individual content items — await so gallery refresh sees the rows
  const pack = result.output as GeneratedPack;
  const items = packToItems(pack, email, productId);

  if (items.length > 0) {
    await supabase.from("content_items").insert(items);
  }

  // Log completion
  void supabase.from("generation_logs").insert({
    email, label: `Generation complete — ${productId} · ${items.length} items · ${tier === "free" ? `${safeProfile.gens_used + 1}/${totalFreeGens} free` : "Pro"}`, product: productId,
  });

  // Award points
  void awardPoints(email, "generation", { product: productId }).catch(() => {});

  // Update streak (non-blocking, silently skips if column missing)
  const today = new Date().toISOString().split("T")[0];
  void supabase.from("user_profiles").update({ last_active: today } as Record<string, unknown>).eq("email", email);

  return Response.json({
    success: true,
    product: productId,
    content: pack,
    itemsSaved: items.length,
    gensUsed: safeProfile.gens_used + 1,
    tier,
    chiProfileComplete,
    learnedTone: learnedTone || null,
  });
}
