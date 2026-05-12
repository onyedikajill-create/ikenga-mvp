"use client";

import { useState } from "react";
import { SlideTemplate, TEMPLATE_IDS, TEMPLATE_LABELS, type SlideData } from "@/src/components/slide-templates";
import { exportToPdf } from "@/src/lib/pdf-export";

export interface Slide {
  headline: string;
  body:     string;
}

interface Props {
  slides: Slide[];
  title?: string;
  color?: string;
}

type TemplateId = typeof TEMPLATE_IDS[number];

export function ProfessionalSlides({ slides, title = "Presentation", color = "#C9A84C" }: Props) {
  const [idx,      setIdx]      = useState(0);
  const [template, setTemplate] = useState<TemplateId>("cultural");

  const slide = slides[idx];
  const total = slides.length;

  if (!slide) return null;

  const slideData: SlideData = { ...slide, index: idx, total };

  function prev() { setIdx(i => Math.max(0, i - 1)); }
  function next() { setIdx(i => Math.min(total - 1, i + 1)); }

  function handleExport() {
    exportToPdf(slides, title);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Template selector */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
        {TEMPLATE_IDS.map(id => (
          <button
            key={id}
            onClick={() => setTemplate(id)}
            style={{
              background:   template === id ? "#1B3A2D" : "transparent",
              border:       `1px solid ${template === id ? "#C9A84C" : "#222"}`,
              borderRadius: 7,
              padding:      "4px 12px",
              fontSize:     11,
              color:        template === id ? "#C9A84C" : "#444",
              cursor:       "pointer",
              fontWeight:   template === id ? 700 : 400,
              transition:   "all 0.15s",
            }}
          >
            {TEMPLATE_LABELS[id]}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={handleExport}
          style={{
            background:   "transparent",
            border:       `1px solid ${color}44`,
            borderRadius: 7,
            padding:      "4px 12px",
            fontSize:     11,
            color:        color,
            cursor:       "pointer",
          }}
        >
          Export PDF ↗
        </button>
      </div>

      {/* Slide */}
      <SlideTemplate template={template} {...slideData} />

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={prev}
          disabled={idx === 0}
          style={{
            background:   "transparent",
            border:       "1px solid #1e1e1e",
            borderRadius: 7,
            padding:      "6px 16px",
            fontSize:     12,
            color:        idx === 0 ? "#222" : "#555",
            cursor:       idx === 0 ? "default" : "pointer",
          }}
        >
          ← Prev
        </button>

        {/* Dot nav */}
        <div style={{ display: "flex", gap: 5 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width:        i === idx ? 18 : 7,
                height:       7,
                borderRadius: 100,
                background:   i === idx ? color : "#222",
                border:       "none",
                cursor:       "pointer",
                padding:      0,
                transition:   "all 0.2s",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={idx === total - 1}
          style={{
            background:   "transparent",
            border:       "1px solid #1e1e1e",
            borderRadius: 7,
            padding:      "6px 16px",
            fontSize:     12,
            color:        idx === total - 1 ? "#222" : "#555",
            cursor:       idx === total - 1 ? "default" : "pointer",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
