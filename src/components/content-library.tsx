"use client";

import { useState, useMemo } from "react";
import {
  ALL_CARDS,
  ENGINE_LABELS,
  ENGINE_COLORS,
  ENGINE_BG_COLORS,
  ENGINE_IDS,
  CARD_TYPES,
  type LibraryCard,
  type EngineId,
  type CardType,
} from "@/src/ikenga/library/educational-content";
import { ProfessionalSlides } from "@/src/components/professional-slides";
import { ScriptViewer } from "@/src/components/script-viewer";
import { AudioPlayer } from "@/src/components/audio-player";
import { SuggestCorrection } from "@/src/components/suggest-correction";

// ── Types ─────────────────────────────────────────────────────

interface Props {
  onUseAsTemplate?: (prompt: string, engine: string) => void;
}

type MediaMode = null | "listen" | "slides" | "script";

// ── Slide generator ───────────────────────────────────────────
// Parses card body into 5–7 slides automatically.

interface Slide { headline: string; body: string; }

function generateSlides(card: LibraryCard): Slide[] {
  const slides: Slide[] = [];

  // Slide 0 — always: title card
  slides.push({ headline: card.title, body: card.summary });

  const body = card.body;

  // Try bullet-point parsing (•)
  const bulletBlocks = body.split(/\n/).filter(l => l.trim().startsWith("•"));
  if (bulletBlocks.length >= 3) {
    bulletBlocks.slice(0, 5).forEach(line => {
      const clean = line.replace(/^[•·]\s*/, "").trim();
      const colon = clean.indexOf("—");
      if (colon > 0) {
        slides.push({ headline: clean.slice(0, colon).trim(), body: clean.slice(colon + 1).trim() });
      } else {
        slides.push({ headline: clean.slice(0, 50), body: clean });
      }
    });
  } else {
    // Fall back to paragraph splitting
    const paragraphs = body.split(/\n{2,}/).filter(p => p.trim().length > 20);
    paragraphs.slice(0, 4).forEach((para, i) => {
      const sentences = para.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
      const headline = sentences[0]?.slice(0, 60).trim() ?? `Key Insight ${i + 1}`;
      const rest = sentences.slice(1).join(" ").trim() || para.trim();
      slides.push({ headline, body: rest.slice(0, 200) });
    });
  }

  // Final slide — CTA from templatePrompt or loop-back instruction
  const cta = card.templatePrompt
    ? card.templatePrompt.slice(0, 140).split(".")[0] + "."
    : "Apply this principle to your brand today.";
  slides.push({ headline: "Your Next Action", body: cta });

  return slides.slice(0, 7);
}

// ── Script generator ──────────────────────────────────────────
// Formats card content as a short-form video script.

interface VideoScript { hook: string; scenes: { beat: string; narration: string }[]; cta: string; }

function generateScript(card: LibraryCard): VideoScript {
  const sentences = card.body.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  const paragraphs = card.body.split(/\n{2,}/).filter(p => p.trim().length > 10);

  // Hook = the most attention-grabbing sentence (first sentence of summary)
  const hook = card.summary.split(/(?<=[.!?])/)[0]?.trim() ?? card.summary;

  // Scenes = main paragraphs, max 3
  const sceneSource = paragraphs.length >= 2 ? paragraphs : sentences;
  const scenes = sceneSource.slice(0, 3).map((text, i) => ({
    beat: i === 0 ? "Opening" : i === 1 ? "Core insight" : "Evidence / example",
    narration: text.trim().slice(0, 250),
  }));

  // CTA from templatePrompt
  const cta = card.templatePrompt
    ? card.templatePrompt.split(".")[0].replace(/^Write\s+/i, "").trim() + "."
    : "Apply this to your brand today and share what you learn.";

  return { hook, scenes, cta };
}

// ── TTS helper ────────────────────────────────────────────────

function buildNarration(card: LibraryCard): string {
  return `${card.title}. ${card.summary}. ${card.body}`;
}

// (SlideViewer and ScriptViewer replaced by ProfessionalSlides and ScriptViewer imports above)

// ── Card ──────────────────────────────────────────────────────

function LibraryCardView({
  card,
  onUseAsTemplate,
}: {
  card: LibraryCard;
  onUseAsTemplate?: (prompt: string, engine: string) => void;
}) {
  const [expanded,  setExpanded]  = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [mediaMode, setMediaMode] = useState<MediaMode>(null);

  const color   = ENGINE_COLORS[card.engine];
  const bgColor = ENGINE_BG_COLORS[card.engine];
  const label   = ENGINE_LABELS[card.engine];

  // Lazy-generate heavy content only when requested
  const slides        = useMemo(() => mediaMode === "slides"  ? generateSlides(card) : [], [mediaMode, card]);
  const script        = useMemo(() => mediaMode === "script"  ? generateScript(card) : null, [mediaMode, card]);
  const narrationText = useMemo(() => buildNarration(card), [card]);

  const TYPE_COLORS: Record<CardType, string> = {
    Principle:         "#FFD700",
    Framework:         "#60a5fa",
    Strategy:          "#4ade80",
    "Cultural Wisdom": "#f97316",
    Example:           "#c084fc",
  };

  function toggleMode(mode: MediaMode) {
    setMediaMode(prev => prev === mode ? null : mode);
    if (!expanded) setExpanded(true);
  }

  async function handleCopy() {
    const text = `${card.title}\n\n${card.body}`;
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const isActive = expanded || !!mediaMode;

  return (
    <div
      style={{
        background:   `linear-gradient(135deg, #0A0A0A 0%, ${bgColor} 100%)`,
        border:       `1px solid ${isActive ? color + "66" : color + "1a"}`,
        borderRadius: 18,
        overflow:     "hidden",
        transition:   "border-color 0.25s, box-shadow 0.25s, transform 0.2s",
        boxShadow:    isActive ? `0 8px 40px ${color}12` : "none",
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLDivElement).style.borderColor = color + "44";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 24px ${color}10`;
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLDivElement).style.borderColor = color + "1a";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }
      }}
    >
      {/* Gold accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}33)` }} />

      <div style={{ padding: "20px 22px" }}>

        {/* Header row — engine + type badges */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color, background: bgColor, border: `1px solid ${color}55`, borderRadius: 5, padding: "3px 10px", whiteSpace: "nowrap" }}>
            {label}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: TYPE_COLORS[card.type] ?? "#888", border: `1px solid ${TYPE_COLORS[card.type] ?? "#333"}44`, borderRadius: 5, padding: "3px 9px", whiteSpace: "nowrap" }}>
            {card.type}
          </span>
        </div>

        {/* Title — gradient text */}
        <h3
          style={{
            margin:     "0 0 8px",
            fontSize:   17,
            fontWeight: 700,
            lineHeight: 1.35,
            fontFamily: "'Playfair Display', Georgia, serif",
            background: `linear-gradient(135deg, #FFFFFF 0%, ${color} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {card.title}
        </h3>

        {/* Summary */}
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#777", lineHeight: 1.65, fontStyle: "italic" }}>
          {card.summary}
        </p>

        {/* ── Media bar ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {(["listen", "slides", "script"] as MediaMode[]).map(mode => {
            const icons: Record<string, string> = { listen: "🔊", slides: "📽", script: "🎬" };
            const labels: Record<string, string> = { listen: "Listen", slides: "Slides", script: "Script" };
            const active = mediaMode === mode;
            return (
              <button
                key={mode}
                onClick={() => toggleMode(mode)}
                style={{
                  display:    "flex", alignItems: "center", gap: 5,
                  background: active ? color + "22" : "transparent",
                  border:     `1px solid ${active ? color + "88" : "#1e1e1e"}`,
                  borderRadius: 8, padding: "6px 13px",
                  fontSize: 12, fontWeight: active ? 700 : 400,
                  color:    active ? color : "#444",
                  cursor:   "pointer", transition: "all 0.15s",
                }}
              >
                {icons[mode!]} {labels[mode!]}
              </button>
            );
          })}

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setExpanded(e => !e)}
            style={{ background: "transparent", border: "1px solid #1e1e1e", borderRadius: 8, padding: "6px 13px", fontSize: 12, color: "#444", cursor: "pointer", transition: "all 0.15s" }}
          >
            {expanded ? "Collapse ▲" : "Read more ▼"}
          </button>
        </div>

        {/* Body text (expanded) */}
        {expanded && (
          <div style={{ borderTop: `1px solid ${color}22`, paddingTop: 16, marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#bbb", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {card.body}
            </p>
          </div>
        )}

        {/* ── Media panels ── */}
        {mediaMode === "listen" && (
          <div style={{ marginBottom: 16 }}>
            <AudioPlayer text={narrationText} color={color} />
          </div>
        )}
        {mediaMode === "slides" && slides.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <ProfessionalSlides slides={slides} title={card.title} color={color} />
          </div>
        )}
        {mediaMode === "script" && script && (
          <div style={{ marginBottom: 16 }}>
            <ScriptViewer script={script} color={color} />
          </div>
        )}

        {/* ── Action row ── */}
        <div
          style={{
            display:      "flex",
            gap:          8,
            alignItems:   "center",
            flexWrap:     "wrap",
            paddingTop:   14,
            borderTop:    `1px solid ${color}11`,
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              background:   copied ? "#1a2a1a" : "transparent",
              border:       `1px solid ${copied ? "#2a5a2a" : "#1e1e1e"}`,
              borderRadius: 8, padding: "6px 13px",
              fontSize: 12, color: copied ? "#4ade80" : "#555",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {copied ? "Copied ✓" : "Copy text"}
          </button>

          {card.templatePrompt && onUseAsTemplate && (
            <button
              onClick={() => onUseAsTemplate(card.templatePrompt!, card.engine)}
              style={{
                background:   bgColor,
                border:       `1px solid ${color}55`,
                borderRadius: 8, padding: "6px 15px",
                fontSize: 12, fontWeight: 700, color,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              Use as Template →
            </button>
          )}

          <SuggestCorrection
            contentId={card.id}
            contentType="library"
            originalText={`${card.title}: ${card.body}`}
            color={color}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main Library ──────────────────────────────────────────────

export function ContentLibrary({ onUseAsTemplate }: Props) {
  const [engineFilter, setEngineFilter] = useState<EngineId | "ALL">("ALL");
  const [typeFilter,   setTypeFilter]   = useState<CardType  | "ALL">("ALL");
  const [search,       setSearch]       = useState("");

  const filtered = useMemo(() => {
    const cards = ALL_CARDS ?? [];
    const q = search.trim().toLowerCase();
    return cards.filter(card => {
      if (engineFilter !== "ALL" && card.engine !== engineFilter) return false;
      if (typeFilter   !== "ALL" && card.type   !== typeFilter)   return false;
      if (q) {
        return (
          (card.title   ?? "").toLowerCase().includes(q) ||
          (card.summary ?? "").toLowerCase().includes(q) ||
          (card.body    ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [engineFilter, typeFilter, search]);

  const filterBtn = (active: boolean, color: string, onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      style={{
        background: active ? color + "22" : "transparent",
        border: `1px solid ${active ? color + "66" : "#1e1e1e"}`,
        borderRadius: 100, padding: "5px 14px",
        fontSize: 11, fontWeight: active ? 700 : 400,
        color: active ? color : "#444",
        cursor: "pointer", letterSpacing: "0.04em", whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Media capability hint */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, background: "#050505", border: "1px solid #1e1e1e", borderRadius: 10, padding: "10px 14px", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#444" }}>Each card:</span>
        <span style={{ fontSize: 11, color: "#555" }}>🔊 Listen (audio narration)</span>
        <span style={{ fontSize: 11, color: "#555" }}>📽 Slides (presentation view)</span>
        <span style={{ fontSize: 11, color: "#555" }}>🎬 Script (video script)</span>
        <span style={{ fontSize: 11, color: "#555" }}>Use as Template →</span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search library…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", background: "#050505", border: "1px solid #1e1e1e", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "#ccc", outline: "none" }}
        />
      </div>

      {/* Engine filters */}
      <div style={{ marginBottom: 10 }}>
        <p style={{ margin: "0 0 8px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>Engine</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filterBtn(engineFilter === "ALL", "#FFD700", () => setEngineFilter("ALL"), `All (${ALL_CARDS.length})`)}
          {ENGINE_IDS.map(id => {
            const count = ALL_CARDS.filter(c => c.engine === id).length;
            return filterBtn(engineFilter === id, ENGINE_COLORS[id], () => setEngineFilter(engineFilter === id ? "ALL" : id), `${ENGINE_LABELS[id]} (${count})`);
          })}
        </div>
      </div>

      {/* Type filters */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: "0 0 8px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>Type</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filterBtn(typeFilter === "ALL", "#888", () => setTypeFilter("ALL"), "All types")}
          {CARD_TYPES.map(t => filterBtn(typeFilter === t, "#aaa", () => setTypeFilter(typeFilter === t ? "ALL" : t), t))}
        </div>
      </div>

      {/* Results count */}
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "#444" }}>
        {filtered.length} card{filtered.length !== 1 ? "s" : ""}
        {(engineFilter !== "ALL" || typeFilter !== "ALL" || search.trim()) ? " matching filters" : " in library"}
      </p>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(card => (
          <LibraryCardView key={card.id} card={card} onUseAsTemplate={onUseAsTemplate} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <p style={{ margin: "0 0 6px", fontSize: 14, color: "#555" }}>No cards match your filters.</p>
          <button
            onClick={() => { setEngineFilter("ALL"); setTypeFilter("ALL"); setSearch(""); }}
            style={{ background: "transparent", border: "1px solid #333", borderRadius: 7, padding: "6px 14px", fontSize: 12, color: "#666", cursor: "pointer" }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
