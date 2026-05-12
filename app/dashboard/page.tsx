"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProductSwitcher } from "@/src/components/product-switcher";
import { ContentGallery, type ContentItem } from "@/src/components/content-gallery";
import { OnboardingWidget } from "@/src/components/onboarding-widget";
import { PRODUCTS, type ProductId } from "@/src/ikenga/products/config";
import { ChiRankInlineBadge, ChiProfileCard, useChiPoints } from "@/src/components/chi-rank-badge";
import { ROICalculator } from "@/src/components/roi-calculator";
import { UpgradePrompt } from "@/src/components/upgrade-prompt";
import { IgboKeyboard } from "@/src/components/igbo-keyboard";
import { LearningWidget } from "@/src/components/learning-widget";
import { DataPulse } from "@/src/components/data-pulse";
import { t, type Lang } from "@/src/i18n/translations";

// ── Types ────────────────────────────────────────────────────

interface DashboardData {
  email:           string;
  displayName:     string | null;
  tier:            string;
  proType:         string | null;
  proExpires:      string | null;
  gensUsed:        number;
  gensLimit:       number | null;
  bonus_gens?:     number;
  streak_days?:    number;
  active_product?: string;
  memberSince:     string;
  logs:            { id: string; label: string; created_at: string }[];
  pendingPayments: { unique_ref: string; tier_type: string; amount_gbp: number; status: string; created_at: string }[];
  dbNotReady?:     boolean;
}

interface OnboardingData {
  current_step:   number;
  completed_days: Record<string, string>;
  referral_code:  string | null;
}

interface GenerateResult { success?: boolean; content?: unknown; gensUsed?: number; tier?: string; error?: string; message?: string; chiProfileComplete?: number; learnedTone?: string | null; itemsSaved?: number; }

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Streak badge ──────────────────────────────────────────────

function StreakBadge({ days }: { days: number }) {
  if (!days) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#0a0800", border: "1px solid #3a3000", borderRadius: 100, padding: "4px 12px", fontSize: 12, color: "#FFD700", fontWeight: 700 }}>
      🔥 {days} day{days !== 1 ? "s" : ""} streak
    </span>
  );
}

// ── Tier badge ────────────────────────────────────────────────

function TierBadge({ tier }: { tier: string }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: tier === "pro" ? "#FFD700" : "#1a1a1a", color: tier === "pro" ? "#000" : "#555", border: tier === "pro" ? "none" : "1px solid #2a2a2a" }}>
      {tier === "pro" ? "PRO" : "FREE"}
    </span>
  );
}

// ── Generate form ──────────────────────────────────────────────

function GenerateForm({
  product, onDone, onChunkDone, initialGoals, lang,
}: {
  product:       ProductId;
  onDone:        (content: unknown, gensUsed: number, result?: GenerateResult) => void;
  onChunkDone?:  () => void;
  initialGoals?: string;
  lang:          Lang;
}) {
  const p = PRODUCTS[product];
  const [brand,    setBrand]    = useState("");
  const [goals,    setGoals]    = useState(initialGoals ?? "");
  const [niche,    setNiche]    = useState("");
  const [audience, setAudience] = useState("");
  const [tone,     setTone]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [progress, setProgress] = useState(0);   // 0–100
  const [stepLabel, setStepLabel] = useState("");

  // 3-day campaign: 6 social + 3 video + 3 email + 1 ads = 13 atomic calls
  // Kept compact to stay well within token budgets on every call.
  type AtomicCall = { atomicType: string; day: number; platform: string; label: string };
  const ATOMIC_CALLS: AtomicCall[] = [
    ...([1,2,3].flatMap(d => [
      { atomicType: "social_post", day: d, platform: "LinkedIn",  label: `Day ${d} — LinkedIn post…` },
      { atomicType: "social_post", day: d, platform: "Instagram", label: `Day ${d} — Instagram post…` },
    ])),
    ...[1,2,3].map(d => ({ atomicType: "video_script", day: d, platform: "", label: `Day ${d} — video script…` })),
    ...[1,2,3].map(d => ({ atomicType: "email",        day: d, platform: "", label: `Day ${d} — email…` })),
    { atomicType: "ads", day: 1, platform: "", label: "Ad creatives…" },
  ];
  const TOTAL = ATOMIC_CALLS.length; // 13

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setProgress(0);
    setStepLabel(t(lang, "status_starting"));

    const base = { product, brand, goals, niche, audience, tone };
    let lastResult: GenerateResult | undefined;

    // Retry helper — up to 3 attempts per atomic call with 1s backoff
    async function callWithRetry(payload: Record<string, unknown>, retries = 3): Promise<Response | null> {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const res = await fetch("/api/products/generate", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
          });
          // Don't retry auth/tier errors
          if (res.status === 401 || res.status === 402) return res;
          if (res.ok) return res;
          // Transient server error — wait then retry
          if (attempt < retries - 1) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        } catch {
          if (attempt < retries - 1) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
      return null; // all retries exhausted
    }

    let skipped = 0;
    try {
      for (let i = 0; i < ATOMIC_CALLS.length; i++) {
        const call = ATOMIC_CALLS[i];
        setStepLabel(call.label);
        const payload = { ...base, atomicType: call.atomicType, day: call.day, platform: call.platform, isFirst: i === 0 };
        const res = await callWithRetry(payload);
        if (!res) {
          skipped++;
        } else {
          const d = await res.json() as GenerateResult;
          if (res.status === 401 || res.status === 402) {
            setError(d.message ?? d.error ?? t(lang, "err_failed"));
            setLoading(false);
            return;
          }
          if (!res.ok) {
            skipped++;
          } else {
            lastResult = d;
            onChunkDone?.(); // triggers parent refreshItems → gallery updates in real-time
          }
        }
        setProgress(Math.round(((i + 1) / TOTAL) * 100));
      }
      setStepLabel(skipped > 0 ? `Done (${skipped} skipped)` : t(lang, "status_done"));
      onDone(null, lastResult?.gensUsed ?? 0, lastResult);
    } catch { setError(t(lang, "err_network")); }
    finally { setLoading(false); setProgress(0); setStepLabel(""); }
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ padding: "12px 16px", background: p.bgColor, border: `1px solid ${p.borderColor}`, borderRadius: 10, marginBottom: 4 }}>
        <p style={{ margin: 0, fontSize: 12, color: p.color, fontWeight: 700, letterSpacing: "0.08em" }}>{product} — {p.tagline}</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#666" }}>{p.toneDirective.slice(0, 80)}…</p>
      </div>

      {[
        { label: t(lang, "field_brand"),    val: brand,    set: setBrand,    ph: t(lang, "ph_brand"),    req: true  },
        { label: t(lang, "field_goals"),    val: goals,    set: setGoals,    ph: t(lang, "ph_goals"),    req: true  },
        { label: t(lang, "field_niche"),    val: niche,    set: setNiche,    ph: t(lang, "ph_niche"),    req: false },
        { label: t(lang, "field_audience"), val: audience, set: setAudience, ph: t(lang, "ph_audience"), req: false },
        { label: t(lang, "field_tone"),     val: tone,     set: setTone,     ph: t(lang, "ph_tone"),     req: false },
      ].map(f => (
        <div key={f.label}>
          <label style={{ display: "block", fontSize: 11, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>{f.label}</label>
          <input
            type="text" value={f.val} onChange={e => f.set(e.target.value)}
            required={f.req} placeholder={f.ph}
            style={{ width: "100%", background: "#050505", border: "1px solid #1e1e1e", borderRadius: 8, padding: "10px 13px", fontSize: 14, color: "#fff", boxSizing: "border-box", outline: "none" }}
          />
        </div>
      ))}

      {error && (
        <p style={{ margin: 0, fontSize: 13, color: "#f87171", background: "#1a0000", border: "1px solid #3a0000", borderRadius: 8, padding: "10px 13px" }}>
          {error}
          {error.toLowerCase().includes("upgrade") && <> · <a href="/pay" style={{ color: "#FFD700" }}>{t(lang, "err_upgrade_link")}</a></>}
        </p>
      )}

      {/* Copyright disclaimer */}
      <div style={{ background: "#060608", border: "1px solid #1a1a2a", borderRadius: 10, padding: "10px 14px" }}>
        <p style={{ margin: 0, fontSize: 11, color: "#444", lineHeight: 1.7 }}>
          <strong style={{ color: "#555" }}>{t(lang, "copyright_label")}</strong>{" "}
          {t(lang, "copyright_notice")}{" "}
          <a href="/copyright-policy" style={{ color: "#555", textDecoration: "underline" }}>{t(lang, "copyright_policy")}</a>
        </p>
      </div>

      {/* Progress bar — visible during chunked generation */}
      {loading && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#888" }}>{stepLabel}</span>
            <span style={{ fontSize: 12, color: p.color, fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: 6, background: "#111", borderRadius: 100, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: p.color,
                borderRadius: 100,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "#444" }}>
            {t(lang, "progress_hint")}
          </p>
        </div>
      )}

      <button
        type="submit" disabled={loading}
        style={{ background: loading ? "#111" : p.color, color: loading ? "#444" : "#000", border: `1px solid ${loading ? "#222" : "transparent"}`, borderRadius: 100, padding: "13px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}
      >
        {loading ? t(lang, "btn_generating") : t(lang, "btn_generate", { product })}
      </button>
    </form>
  );
}

// ── Main dashboard ────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  const [data,          setData]          = useState<DashboardData | null>(null);
  const [onboarding,    setOnboarding]    = useState<OnboardingData | null>(null);
  const [items,         setItems]         = useState<ContentItem[]>([]);
  const refreshSeqRef = useRef(0);
  const [product,       setProduct]       = useState<ProductId>("IKENGA");
  const [pageLoad,      setPageLoad]      = useState(true);
  const [showForm,          setShowForm]          = useState(false);
  const [showLog,           setShowLog]           = useState(false);
  const [templateGoals,     setTemplateGoals]     = useState<string | undefined>(undefined);
  const [chiToast,          setChiToast]          = useState<{ pct: number; tone?: string } | null>(null);
  const [showChiCard,       setShowChiCard]       = useState(false);
  const [upgradePromptDismissed, setUpgradePromptDismissed] = useState(false);
  const [lang, setLang] = useState<"en" | "fr" | "ig">("en");
  const { pts: chiPts, rank: chiRank, color: chiColor } = useChiPoints();

  // ── Loaders ──────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    const [dashRes, itemsRes, onbRes] = await Promise.all([
      fetch("/api/dashboard"),
      fetch("/api/content"),
      fetch("/api/onboarding"),
    ]);

    const dash = await dashRes.json() as DashboardData & { error?: string };
    if (dash.error === "Not logged in.") { router.push("/login"); return; }
    setData(dash);
    if (dash.active_product) setProduct(dash.active_product as ProductId);

    const itemsData = await itemsRes.json() as { items?: ContentItem[] };
    setItems(itemsData.items ?? []);

    const onbData = await onbRes.json() as { onboarding?: OnboardingData };
    setOnboarding(onbData.onboarding ?? null);
  }, [router]);

  useEffect(() => {
    loadAll().finally(() => setPageLoad(false));
  }, [loadAll]);

  const refreshItems = useCallback(() => {
    const seq = ++refreshSeqRef.current;
    fetch("/api/content")
      .then(r => r.json())
      .then((d: { items?: ContentItem[] }) => {
        const fresh = d.items ?? [];
        // Only apply if this is the latest request AND it has at least as many
        // items as we already have (prevents a stale concurrent fetch from
        // overwriting a newer one that returned more items).
        setItems(prev => {
          if (seq < refreshSeqRef.current) return prev;
          return fresh.length >= prev.length ? fresh : prev;
        });
      })
      .catch(() => {});
  }, []);

  const refreshDash = useCallback(() => {
    fetch("/api/dashboard").then(r => r.json()).then((d: DashboardData) => setData(d));
  }, []);

  // ── Onboarding step advance ───────────────────────────────────

  async function advanceOnboarding(step: number) {
    await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step }) });
    const fresh = await fetch("/api/onboarding").then(r => r.json()) as { onboarding?: OnboardingData };
    setOnboarding(fresh.onboarding ?? null);
  }

  // ── Product switch ────────────────────────────────────────────

  async function handleProductSwitch(id: ProductId) {
    setProduct(id);
    await fetch("/api/user-product", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: id }) }).catch(() => {});
    // Filter gallery to this product
    fetch(`/api/content?product=${id}`).then(r => r.json()).then((d: { items?: ContentItem[] }) => setItems(d.items ?? []));
    void fetch("/api/dashboard").then(r => r.json()).then((d: DashboardData) => setData(d));
  }

  // ── Generation done ────────────────────────────────────────────

  async function handleGenDone(_content: unknown, gensUsed: number, result?: GenerateResult) {
    setShowForm(false);
    setData(prev => prev ? { ...prev, gensUsed } : prev);
    if (result?.chiProfileComplete !== undefined) {
      setChiToast({ pct: result.chiProfileComplete, tone: result.learnedTone ?? undefined });
      setTimeout(() => setChiToast(null), 6000);
    }
    // Items are already saved per-chunk, just refresh
    refreshItems();
    refreshDash();
    // Advance onboarding to day 2 if on step 1
    if (onboarding && onboarding.current_step === 1) advanceOnboarding(1);
  }

  // ── Use as Template (from Library) ───────────────────────────

  function handleUseAsTemplate(prompt: string, engine: string) {
    // Map library engine IDs to product IDs
    const engineToProduct: Record<string, ProductId> = {
      IKENGA:  "IKENGA",
      JUO:     "JUO",
      OBA:     "OBA",
      OMENALA: "OMENALA",
      ICHEOKU: "ICHEOKU",
    };
    const mapped = engineToProduct[engine];
    if (mapped) setProduct(mapped);
    setTemplateGoals(prompt);
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById("generate-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  // ── Logout ────────────────────────────────────────────────────

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  // ── Loading ───────────────────────────────────────────────────

  if (pageLoad) {
    return (
      <main style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif" }}>
        <p style={{ color: "#333" }}>Loading…</p>
      </main>
    );
  }
  if (!data) return null;

  const p          = PRODUCTS[product];
  const isPro      = data.tier === "pro";
  const totalFree  = 3 + (data.bonus_gens ?? 0);
  const gensLeft   = isPro ? null : Math.max(0, totalFree - data.gensUsed);
  const pct        = isPro ? 100 : Math.min((data.gensUsed / totalFree) * 100, 100);
  const canGen     = isPro || (gensLeft !== null && gensLeft > 0);

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif", overflowX: "hidden" }}>

      {/* ── Top bar ── */}
      <div style={{ borderBottom: "1px solid #111", padding: "10px clamp(12px, 4vw, 20px)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", position: "sticky", top: 0, background: "#000", zIndex: 10, overflowX: "hidden" }}>
        {/* Logo */}
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.15em", color: "#FFD700", flexShrink: 0 }}>IKENGA</span>

        {/* Product switcher */}
        <ProductSwitcher active={product} onChange={handleProductSwitch} />

        {/* Streak */}
        <StreakBadge days={data.streak_days ?? 0} />

        {/* Chi Rank */}
        {chiPts > 0 && (
          <span onClick={() => setShowChiCard(true)} style={{ cursor: "pointer" }}>
            <ChiRankInlineBadge points={chiPts} rank={chiRank} color={chiColor} />
          </span>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Language selector */}
        <div style={{ display: "flex", gap: 2, background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 8, padding: 3 }}>
          {(["en", "fr", "ig"] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              title={l === "en" ? "English" : l === "fr" ? "Français" : "Igbo"}
              style={{
                background: lang === l ? "#1e1e1e" : "transparent",
                border: "none", borderRadius: 6,
                padding: "4px 9px", fontSize: 11, fontWeight: lang === l ? 700 : 400,
                color: lang === l ? "#FFD700" : "#444", cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              {l === "en" ? "EN" : l === "fr" ? "FR" : "IG"}
            </button>
          ))}
        </div>

        {/* User info */}
        <span style={{ fontSize: 12, color: "#444" }}>{data.displayName ?? data.email}</span>
        <TierBadge tier={data.tier} />
        {!isPro && <a href="/pay" style={{ background: p.color, color: "#000", textDecoration: "none", padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{t(lang, "btn_upgrade")}</a>}
        <button onClick={logout} style={{ background: "transparent", border: "1px solid #1e1e1e", borderRadius: 8, padding: "6px 13px", fontSize: 12, color: "#444", cursor: "pointer" }}>
          {t(lang, "btn_logout")}
        </button>
      </div>

      {/* ── Chi Profile full card modal ── */}
      {showChiCard && <ChiProfileCard onClose={() => setShowChiCard(false)} />}

      {/* ── Chi Profile learning toast ── */}
      {chiToast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, background: "#0a0800", border: "1px solid #3a3000", borderRadius: 14, padding: "14px 20px", maxWidth: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
          <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#FFD700" }}>IKENGA learned from your feedback</p>
          {chiToast.tone && (
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#888" }}>Tone adjusted → <strong style={{ color: "#FFF4C0" }}>{chiToast.tone}</strong></p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "#555" }}>Chi Profile</span>
            <span style={{ fontSize: 11, color: "#FFD700", fontWeight: 700 }}>{chiToast.pct}% complete</span>
          </div>
          <div style={{ height: 3, background: "#111", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${chiToast.pct}%`, background: "#FFD700", borderRadius: 100, transition: "width 0.6s" }} />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#444" }}>Keep giving feedback to improve your personalization.</p>
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px clamp(12px, 4vw, 28px) 80px", boxSizing: "border-box", width: "100%" }}>

        {/* Onboarding widget */}
        {onboarding && <OnboardingWidget data={onboarding} onAdvance={advanceOnboarding} />}

        {/* DB not ready notice */}
        {data.dbNotReady && (
          <div style={{ background: "#0a0800", border: "1px solid #3a3000", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#FFD700" }}>
              Run the SQL in <code>src/ikenga/db/payments_schema.sql</code> and <code>src/ikenga/db/platform_schema.sql</code> in Supabase to enable full features.
            </p>
          </div>
        )}

        {/* Usage card */}
        <div style={{ background: "#0a0a0a", border: `1px solid ${isPro ? p.borderColor : "#1e1e1e"}`, borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            {!isPro && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#555" }}>{t(lang, "usage_free_label")}</span>
                  <span style={{ fontSize: 12, color: gensLeft === 0 ? "#f87171" : "#FFF4C0", fontWeight: 700 }}>{data.gensUsed} / {totalFree}</span>
                </div>
                <div style={{ height: 4, background: "#111", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? "#f87171" : p.color, borderRadius: 100 }} />
                </div>
                {(data.bonus_gens ?? 0) > 0 && (
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "#4ade80" }}>{t(lang, "usage_bonus", { n: data.bonus_gens ?? 0 })}</p>
                )}
              </>
            )}
            {isPro && <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{t(lang, "usage_pro_label", { n: data.gensUsed })}</p>}
          </div>

          {/* Generate CTA */}
          <button
            onClick={() => setShowForm(f => !f)}
            disabled={!canGen}
            style={{
              background: canGen ? p.color : "#1a1a1a", color: canGen ? "#000" : "#444",
              border: "none", borderRadius: 100, padding: "10px 22px",
              fontSize: 13, fontWeight: 700, cursor: canGen ? "pointer" : "not-allowed", whiteSpace: "nowrap",
            }}
          >
            {showForm ? t(lang, "btn_cancel") : canGen ? t(lang, "btn_new_gen", { product }) : t(lang, "btn_upgrade_req")}
          </button>
        </div>

        {/* Pending payment notice */}
        {(data.pendingPayments ?? []).filter(pay => pay.status === "pending").length > 0 && (
          <div style={{ background: "#0a0800", border: "1px solid #3a3000", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
            <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#FFD700" }}>{t(lang, "pay_pending_title")}</p>
            {data.pendingPayments.filter(pay => pay.status === "pending").map(pay => (
              <p key={pay.unique_ref} style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>
                Ref <strong style={{ color: "#FFF4C0" }}>{pay.unique_ref}</strong> · £{pay.amount_gbp} {pay.tier_type} · {fmt(pay.created_at)}
              </p>
            ))}
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#555" }}>{t(lang, "pay_pending_note")}</p>
          </div>
        )}

        {/* Upgrade prompt — shown when free user has used ≥1 gen or hit limit */}
        {!isPro && !upgradePromptDismissed && data.gensUsed >= 1 && (
          <UpgradePrompt
            gensUsed={data.gensUsed}
            gensLimit={totalFree}
            productColor={p.color}
            onDismiss={() => setUpgradePromptDismissed(true)}
          />
        )}

        {/* Generate form */}
        {showForm && (
          <div id="generate-form" style={{ background: "#0a0a0a", border: `1px solid ${p.borderColor}`, borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
            {lang === "ig" && <IgboKeyboard />}
            <GenerateForm product={product} onDone={handleGenDone} onChunkDone={refreshItems} initialGoals={templateGoals} lang={lang} />
          </div>
        )}

        {/* Data Pulse */}
        <DataPulse />

        {/* IKENGA Intelligence Report — learning widget */}
        <LearningWidget />

        {/* Content gallery */}
        <div style={{ background: "#0a0a0a", border: "1px solid #111", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#FFF4C0" }}>
              {t(lang, "gallery_title")}
              {items.length > 0 && <span style={{ marginLeft: 8, fontSize: 12, color: "#444", fontWeight: 400 }}>{t(lang, "gallery_pieces", { n: items.length })}</span>}
            </h2>
          </div>
          <ContentGallery items={items} onRefresh={refreshItems} onUseAsTemplate={handleUseAsTemplate} hasGenerated={data.gensUsed > 0} isPro={isPro} />
        </div>

        {/* ROI Calculator */}
        {data.gensUsed > 0 && (
          <div style={{ marginBottom: 20 }}>
            <ROICalculator
              totalGenerations={data.gensUsed}
              isPro={isPro}
              proType={data.proType}
            />
          </div>
        )}

        {/* Activity log (collapsed by default) */}
        <div style={{ background: "#0a0a0a", border: "1px solid #111", borderRadius: 14, overflow: "hidden" }}>
          <button
            onClick={() => setShowLog(l => !l)}
            style={{ width: "100%", background: "transparent", border: "none", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#FFF4C0" }}>Activity Log</span>
            <span style={{ fontSize: 12, color: "#444" }}>{showLog ? "▲" : "▼"}</span>
          </button>
          {showLog && (
            <div style={{ borderTop: "1px solid #111", padding: "0 20px 16px" }}>
              {data.logs.length === 0 ? (
                <p style={{ margin: "12px 0", fontSize: 13, color: "#333" }}>No activity yet.</p>
              ) : data.logs.map((log, i) => (
                <div key={log.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < data.logs.length - 1 ? "1px solid #0a0a0a" : "none" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD700", marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{log.label}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#2a2a2a" }}>{fmt(log.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
