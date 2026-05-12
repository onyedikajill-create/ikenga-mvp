"use client";

import { useState, useEffect, useCallback } from "react";
import { StudioAudio }  from "@/src/components/studio-audio";
import { StudioSlides } from "@/src/components/studio-slides";
import { StudioScript } from "@/src/components/studio-script";

export interface StudioItem {
  id:           string;
  title:        string;
  body:         string;
  summary?:     string;
  color?:       string;
  product?:     string;
  content_type?: string;
}

type StudioTab = "audio" | "slides" | "script";

interface Props {
  item:     StudioItem;
  onClose:  () => void;
}

const TABS: { id: StudioTab; label: string; icon: string }[] = [
  { id: "audio",  label: "Audio",  icon: "🔊" },
  { id: "slides", label: "Slides", icon: "📽" },
  { id: "script", label: "Script", icon: "🎬" },
];

export function StudioView({ item, onClose }: Props) {
  const [tab,     setTab]     = useState<StudioTab>("audio");
  const [copied,  setCopied]  = useState(false);
  const color   = item.color ?? "#C9A84C";
  const summary = item.summary ?? item.body.slice(0, 160);

  // Close on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  async function handleShare() {
    const url = `${window.location.origin}/dashboard?item=${item.id}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    /* Backdrop */
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div
        style={{
          background:   "#080808",
          border:       `1px solid ${color}33`,
          borderRadius: 20,
          width:        "100%",
          maxWidth:     720,
          maxHeight:    "90vh",
          display:      "flex",
          flexDirection:"column",
          overflow:     "hidden",
          boxShadow:    `0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px ${color}22`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            12,
            padding:        "18px 22px",
            borderBottom:   "1px solid #111",
            flexShrink:     0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 2px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: color }}>
              Studio {item.product ? `· ${item.product}` : ""}
            </p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#FFF4C0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.title}
            </p>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            style={{
              background:   copied ? "#1a2a1a" : "transparent",
              border:       `1px solid ${copied ? "#2a4a2a" : "#222"}`,
              borderRadius: 8,
              padding:      "6px 13px",
              fontSize:     12,
              color:        copied ? "#4ade80" : "#555",
              cursor:       "pointer",
              whiteSpace:   "nowrap",
            }}
          >
            {copied ? "Link copied ✓" : "Share ↗"}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              background:   "transparent",
              border:       "1px solid #222",
              borderRadius: 8,
              width:        32,
              height:       32,
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              fontSize:     16,
              color:        "#444",
              cursor:       "pointer",
              flexShrink:   0,
            }}
            aria-label="Close studio"
          >
            ×
          </button>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display:      "flex",
            gap:          4,
            padding:      "12px 22px 0",
            borderBottom: "1px solid #111",
            flexShrink:   0,
          }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background:     tab === t.id ? "#1B3A2D" : "transparent",
                border:         `1px solid ${tab === t.id ? color + "55" : "transparent"}`,
                borderBottom:   tab === t.id ? `2px solid ${color}` : "2px solid transparent",
                borderRadius:   "8px 8px 0 0",
                padding:        "8px 18px",
                fontSize:       13,
                fontWeight:     tab === t.id ? 700 : 400,
                color:          tab === t.id ? color : "#444",
                cursor:         "pointer",
                display:        "flex",
                alignItems:     "center",
                gap:            6,
                marginBottom:   -1,
                transition:     "all 0.15s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px" }}>
          {tab === "audio"  && <StudioAudio  title={item.title} body={item.body} color={color} />}
          {tab === "slides" && <StudioSlides title={item.title} body={item.body} summary={summary} color={color} />}
          {tab === "script" && <StudioScript title={item.title} body={item.body} summary={summary} color={color} />}
        </div>
      </div>
    </div>
  );
}
