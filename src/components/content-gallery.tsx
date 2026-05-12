"use client";

import { useState, useCallback, useEffect } from "react";
import { PRODUCTS, type ProductId } from "@/src/ikenga/products/config";
import { ContentLibrary } from "@/src/components/content-library";
import { CopyrightFlagButton } from "@/src/components/copyright-flag";
import { StudioView, type StudioItem } from "@/src/components/studio-view";
import { SuggestCorrection } from "@/src/components/suggest-correction";

export interface ContentItem {
  id:           string;
  product:      string;
  content_type: string;
  title:        string;
  body:         string;
  platform:     string | null;
  day:          number | null;
  quality:      string;
  published:    boolean;
  copied:       boolean;
  metadata:     { hashtags?: string[] };
  created_at:   string;
}

interface Props {
  items:            ContentItem[];
  onRefresh:        () => void;
  onUseAsTemplate?: (prompt: string, engine: string) => void;
  hasGenerated?:    boolean;   // true if user has ever run a generation
  isPro?:           boolean;   // controls gated previews
}

// ── Helpers ──────────────────────────────────────────────────

const TYPE_ICONS: Record<string, string> = {
  social_post:   "✦",
  video_script:  "▶",
  email:         "✉",
  ad:            "◈",
  carousel:      "▣",
};

const TYPE_LABELS: Record<string, string> = {
  social_post:   "Social Post",
  video_script:  "Video Script",
  email:         "Email",
  ad:            "Ad",
  carousel:      "Carousel",
};

const QUALITY_COLORS: Record<string, string> = {
  A: "#4ade80",
  B: "#FFD700",
  C: "#fb923c",
  D: "#f87171",
};

const TABS = ["All", "Social Posts", "Video Scripts", "Emails", "Ads"];
const TAB_TYPES: Record<string, string | null> = {
  "All":          null,
  "Social Posts": "social_post",
  "Video Scripts":"video_script",
  "Emails":       "email",
  "Ads":          "ad",
};

// Build share URLs (deep link pre-fills, not real OAuth)
function buildShareUrls(item: ContentItem): { linkedin: string; x: string } {
  const text = encodeURIComponent(`${item.title}\n\n${item.body.slice(0, 240)}`);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?summary=${text}`,
    x:        `https://twitter.com/intent/tweet?text=${text}`,
  };
}

// ── Card component ────────────────────────────────────────────

function ContentCard({ item, onAction, isPro, onOpenStudio }: { item: ContentItem; onAction: (id: string, field: "copied" | "published") => void; isPro?: boolean; onOpenStudio: (item: StudioItem) => void }) {
  const [expanded,  setExpanded]  = useState(false);
  const [feedback,  setFeedback]  = useState<"up" | "down" | null>(null);
  const [copying,   setCopying]   = useState(false);
  const product = PRODUCTS[(item.product as ProductId)] ?? PRODUCTS.IKENGA;
  const share   = buildShareUrls(item);

  const [feedbackMsg, setFeedbackMsg] = useState<string>("");

  async function handleFeedback(signal: "up" | "down") {
    setFeedback(signal);
    const msg = signal === "up"
      ? "IKENGA noted this — quality signal logged ✓"
      : "IKENGA will adjust — improvement signal logged ✓";
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(""), 3000);
    await fetch("/api/feedback", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ itemId: item.id, signal, product: item.product }),
    });
  }

  async function handleCopy() {
    setCopying(true);
    const text = [item.title, "", item.body, ...(item.metadata?.hashtags ?? [])].join("\n");
    await navigator.clipboard.writeText(text).catch(() => {});
    onAction(item.id, "copied");
    setTimeout(() => setCopying(false), 1500);
  }

  return (
    <div
      style={{
        background: "#0a0a0a",
        border: `1px solid ${expanded ? product.borderColor : "#1e1e1e"}`,
        borderRadius: 14,
        padding: "18px 20px",
        transition: "border-color 0.2s",
        cursor: "default",
      }}
    >
      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 1, minWidth: 0 }}>
          {/* Type icon */}
          <span
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: product.bgColor, border: `1px solid ${product.borderColor}`,
              fontSize: 14, color: product.color,
            }}
          >
            {TYPE_ICONS[item.content_type] ?? "·"}
          </span>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {TYPE_LABELS[item.content_type] ?? item.content_type}
              {item.platform && ` · ${item.platform}`}
              {item.day && ` · Day ${item.day}`}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 14, fontWeight: 600, color: "#FFF4C0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.title}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Quality badge */}
          <span
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              color: QUALITY_COLORS[item.quality] ?? "#888",
              border: `1px solid ${QUALITY_COLORS[item.quality] ?? "#333"}`,
              borderRadius: 6, padding: "2px 7px",
            }}
          >
            {item.quality}
          </span>
          {/* Product badge */}
          <span style={{ fontSize: 10, color: product.color, fontWeight: 700, letterSpacing: "0.1em" }}>
            {item.product}
          </span>
        </div>
      </div>

      {/* Preview */}
      {item.content_type === "video_script" && !isPro ? (
        <div style={{ position: "relative", margin: "12px 0 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#888", lineHeight: 1.6, whiteSpace: "pre-wrap", filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
            {item.body}
          </p>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", borderRadius: 8, gap: 8 }}>
            <span style={{ fontSize: 18 }}>▶</span>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#FFD700", textAlign: "center" }}>Video script preview</p>
            <p style={{ margin: 0, fontSize: 11, color: "#888", textAlign: "center" }}>Full script unlocked with Pro</p>
            <a href="/pay" style={{ marginTop: 4, background: "#FFD700", color: "#000", textDecoration: "none", borderRadius: 100, padding: "6px 16px", fontSize: 11, fontWeight: 700 }}>Upgrade →</a>
          </div>
        </div>
      ) : item.content_type === "carousel" && !isPro ? (
        <div style={{ margin: "12px 0 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#888", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {item.body.split("\n").slice(0, 6).join("\n")}
          </p>
          <div style={{ marginTop: 8, background: "#0a0800", border: "1px solid #2a2000", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#888" }}>Showing first 3 slides · remaining slides unlocked with Pro</p>
            <a href="/pay" style={{ background: "#FFD700", color: "#000", textDecoration: "none", borderRadius: 100, padding: "5px 12px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>Upgrade →</a>
          </div>
        </div>
      ) : (
        <p
          style={{
            margin: "12px 0 0",
            fontSize: 13,
            color: "#888",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: expanded ? undefined : 3,
            WebkitBoxOrient: "vertical" as const,
            overflow: expanded ? "visible" : "hidden",
            whiteSpace: "pre-wrap",
          }}
        >
          {item.body}
        </p>
      )}

      {item.metadata?.hashtags && item.metadata.hashtags.length > 0 && expanded && (
        <p style={{ margin: "8px 0 0", fontSize: 11, color: "#444" }}>
          {item.metadata.hashtags.join(" ")}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: "transparent", border: "1px solid #222", borderRadius: 7, padding: "5px 12px", fontSize: 12, color: "#666", cursor: "pointer" }}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>

        {/* Studio button */}
        <button
          onClick={() => onOpenStudio({ id: item.id, title: item.title, body: item.body, color: product.color, product: item.product, content_type: item.content_type })}
          style={{
            background:   "#1B3A2D",
            border:       "1px solid #C9A84C44",
            borderRadius: 7,
            padding:      "5px 12px",
            fontSize:     12,
            color:        "#C9A84C",
            cursor:       "pointer",
            fontWeight:   700,
          }}
        >
          ✦ Studio
        </button>

        <button
          onClick={handleCopy}
          style={{
            background: copying ? "#1a2a1a" : "transparent",
            border: `1px solid ${copying ? "#2a4a2a" : "#222"}`,
            borderRadius: 7, padding: "5px 12px", fontSize: 12,
            color: copying ? "#4ade80" : "#888", cursor: "pointer",
          }}
        >
          {copying ? "Copied ✓" : "Copy"}
        </button>

        {/* Publish deep links */}
        <a
          href={share.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "transparent", border: "1px solid #222", borderRadius: 7, padding: "5px 12px", fontSize: 12, color: "#60a5fa", cursor: "pointer", textDecoration: "none" }}
          onClick={() => onAction(item.id, "published")}
        >
          LinkedIn →
        </a>
        <a
          href={share.x}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "transparent", border: "1px solid #222", borderRadius: 7, padding: "5px 12px", fontSize: 12, color: "#9ca3af", cursor: "pointer", textDecoration: "none" }}
          onClick={() => onAction(item.id, "published")}
        >
          X →
        </a>

        {/* Copyright flag */}
        <CopyrightFlagButton contentId={item.id} contentType="generated" />

        {/* Suggest correction */}
        <SuggestCorrection
          contentId={item.id}
          contentType="generated"
          originalText={`${item.title}: ${item.body.slice(0, 300)}`}
          color={product.color}
        />

        {/* Feedback */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          {feedbackMsg && (
            <span style={{ fontSize: 11, color: feedback === "up" ? "#4ade80" : "#fb923c" }}>
              {feedbackMsg}
            </span>
          )}
          {(["up", "down"] as const).map(s => (
            <button
              key={s}
              onClick={() => handleFeedback(s)}
              style={{
                background: feedback === s ? (s === "up" ? "#1a2a1a" : "#2a1a1a") : "transparent",
                border: `1px solid ${feedback === s ? (s === "up" ? "#2a4a2a" : "#4a2a2a") : "#1e1e1e"}`,
                borderRadius: 7, padding: "5px 10px",
                fontSize: 13, cursor: "pointer",
                color: feedback === s ? (s === "up" ? "#4ade80" : "#f87171") : "#444",
              }}
              title={s === "up" ? "Good content" : "Needs improvement"}
            >
              {s === "up" ? "👍" : "👎"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────

type GalleryMode = "MY_GENERATIONS" | "LIBRARY";

export function ContentGallery({ items, onRefresh, onUseAsTemplate, hasGenerated, isPro }: Props) {
  const [mode,       setMode]       = useState<GalleryMode>("MY_GENERATIONS");
  const [tab,        setTab]        = useState("All");
  const [local,      setLocal]      = useState<ContentItem[]>(items);
  const [studioItem, setStudioItem] = useState<StudioItem | null>(null);

  // Keep local in sync when parent re-fetches items
  useEffect(() => { setLocal(items); }, [items]);

  const filtered = local.filter(i => {
    const t = TAB_TYPES[tab];
    return t === null || i.content_type === t;
  });

  const handleAction = useCallback(async (id: string, field: "copied" | "published") => {
    setLocal(prev => prev.map(i => i.id === id ? { ...i, [field]: true } : i));
    await fetch("/api/content", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id, field, value: true }),
    });
  }, []);

  return (
    <div>
      {/* Studio modal */}
      {studioItem && (
        <StudioView item={studioItem} onClose={() => setStudioItem(null)} />
      )}

      {/* Mode switcher — MY GENERATIONS | LIBRARY */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#050505", border: "1px solid #111", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {(["MY_GENERATIONS", "LIBRARY"] as GalleryMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              background:   mode === m ? "#FFD700" : "transparent",
              color:        mode === m ? "#000"    : "#555",
              border:       "none",
              borderRadius: 7, padding: "7px 18px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.06em",
            }}
          >
            {m === "MY_GENERATIONS" ? `MY GENERATIONS${local.length > 0 ? ` (${local.length})` : ""}` : "LIBRARY"}
          </button>
        ))}
      </div>

      {/* ── Library tab ── */}
      {mode === "LIBRARY" && (
        <ContentLibrary onUseAsTemplate={onUseAsTemplate} />
      )}

      {/* ── My Generations tab ── */}
      {mode === "MY_GENERATIONS" && (
        <>
          {local.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ fontSize: 32, margin: "0 0 12px" }}>✦</p>
              {hasGenerated ? (
                <>
                  <p style={{ margin: 0, fontSize: 15, color: "#FFF4C0" }}>Generating your content…</p>
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "#444" }}>Your items will appear here as each call completes. Hit Refresh if you don&apos;t see them yet.</p>
                </>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: 15, color: "#FFF4C0" }}>No content yet</p>
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: "#444" }}>Run your first generation above to fill this gallery.</p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Type filter tabs */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20, justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {TABS.map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      style={{
                        background: tab === t ? "#FFD700" : "transparent",
                        color:      tab === t ? "#000"    : "#555",
                        border:     tab === t ? "none"    : "1px solid #1e1e1e",
                        borderRadius: 100, padding: "5px 14px",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {t} {t === "All" ? `(${local.length})` : ""}
                    </button>
                  ))}
                </div>
                <button onClick={onRefresh} style={{ background: "transparent", border: "1px solid #1e1e1e", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: "#444", cursor: "pointer" }}>
                  Refresh ↻
                </button>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(item => (
                  <ContentCard key={item.id} item={item} onAction={handleAction} isPro={isPro} onOpenStudio={setStudioItem} />
                ))}
              </div>

              {filtered.length === 0 && (
                <p style={{ textAlign: "center", color: "#444", fontSize: 13, padding: "20px 0" }}>
                  No {tab.toLowerCase()} content yet.
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
