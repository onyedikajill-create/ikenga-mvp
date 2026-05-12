"use client";

// ============================================================
// IKENGA — 5 Professional Slide Templates (Gamma/NotebookLM standard)
// Minimal | Data-Driven | Cultural | Bold | Elegant
// Each includes: gold accent bars, icon slots, progress indicators,
// Playfair Display titles, visual hierarchy.
// ============================================================

export interface SlideData {
  headline: string;
  body:     string;
  index:    number;
  total:    number;
  icon?:    string;
}

type TemplateId = "minimal" | "data-driven" | "cultural" | "bold" | "elegant";

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  "minimal":      "Minimal",
  "data-driven":  "Data-Driven",
  "cultural":     "Cultural",
  "bold":         "Bold",
  "elegant":      "Elegant",
};

export const TEMPLATE_IDS: TemplateId[] = [
  "minimal", "data-driven", "cultural", "bold", "elegant",
];

// ── Slide icon picker ─────────────────────────────────────────
const ICONS = ["📌", "💡", "⚡", "🎯", "🔍", "🌍", "🏆", "🔑", "📊", "✦"];
function pickIcon(index: number): string { return ICONS[index % ICONS.length]; }

// ── Progress dots ─────────────────────────────────────────────
function ProgressDots({ total, current, color }: { total: number; current: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height:       3,
            width:        i === current ? 20 : 8,
            borderRadius: 100,
            background:   i <= current ? color : "rgba(255,255,255,0.15)",
            transition:   "width 0.3s ease, background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// ── Minimal ───────────────────────────────────────────────────

function MinimalSlide({ headline, body, index, total, icon }: SlideData) {
  const isFirst = index === 0;
  return (
    <div
      style={{
        background:    "#FFFFFF",
        borderRadius:  14,
        padding:       "40px 44px",
        minHeight:     260,
        display:       "flex",
        flexDirection: "column",
        justifyContent:"space-between",
        fontFamily:    "'Inter', system-ui, sans-serif",
        position:      "relative",
        overflow:      "hidden",
      }}
    >
      {/* Gold accent bar top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #C9A84C, #FFD700, #C9A84C)" }} />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.22em", color: "#bbb", textTransform: "uppercase" }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <span style={{ fontSize: 22 }}>{icon ?? pickIcon(index)}</span>
        </div>

        {/* Gold accent bar */}
        <div style={{ width: 40, height: 3, background: "linear-gradient(90deg, #C9A84C, #FFD700)", borderRadius: 100, marginBottom: 16 }} />

        <p style={{ margin: "0 0 14px", fontSize: isFirst ? 26 : 22, fontWeight: 700, color: "#111", lineHeight: 1.25, fontFamily: "'Playfair Display', Georgia, serif" }}>
          {headline}
        </p>
        <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.75 }}>
          {body}
        </p>
      </div>

      <div style={{ marginTop: 24 }}>
        <ProgressDots total={total} current={index} color="#C9A84C" />
      </div>
    </div>
  );
}

// ── Data-Driven ───────────────────────────────────────────────

function DataDrivenSlide({ headline, body, index, total, icon }: SlideData) {
  const isFirst = index === 0;
  return (
    <div
      style={{
        background:    "#0A0A0A",
        borderRadius:  14,
        padding:       "36px 40px",
        minHeight:     260,
        display:       "flex",
        flexDirection: "column",
        justifyContent:"space-between",
        fontFamily:    "'Inter', system-ui, sans-serif",
        border:        "1px solid #1e1e1e",
        position:      "relative",
        overflow:      "hidden",
      }}
    >
      {/* Grid background */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px)", backgroundSize: "36px 36px", opacity: 0.6, pointerEvents: "none" }} />

      {/* Gold top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", fontWeight: 700 }}>IKENGA AI</span>
            <p style={{ margin: "3px 0 0", fontSize: 9, color: "#333", letterSpacing: "0.12em", textTransform: "uppercase" }}>Slide {index + 1}/{total}</p>
          </div>
          <span style={{ fontSize: 26 }}>{icon ?? pickIcon(index)}</span>
        </div>

        <div style={{ width: 32, height: 2, background: "#C9A84C", borderRadius: 100, marginBottom: 14 }} />
        <p style={{ margin: "0 0 12px", fontSize: isFirst ? 24 : 20, fontWeight: 700, color: "#FFF4C0", lineHeight: 1.3 }}>
          {headline}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#777", lineHeight: 1.75 }}>
          {body}
        </p>
      </div>

      <div style={{ position: "relative", marginTop: 20 }}>
        <ProgressDots total={total} current={index} color="#C9A84C" />
      </div>
    </div>
  );
}

// ── Cultural — Forest Green + Gold ────────────────────────────

function CulturalSlide({ headline, body, index, total, icon }: SlideData) {
  return (
    <div
      style={{
        background:    "#1B3A2D",
        borderRadius:  14,
        padding:       "36px 40px",
        minHeight:     260,
        display:       "flex",
        flexDirection: "column",
        justifyContent:"space-between",
        fontFamily:    "'Playfair Display', Georgia, serif",
        border:        "1px solid #2a5940",
        position:      "relative",
        overflow:      "hidden",
      }}
    >
      {/* Decorative top-right corner */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, borderBottom: "1px solid #C9A84C22", borderLeft: "1px solid #C9A84C22", borderBottomLeftRadius: 80 }} />

      {/* Gold top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #C9A84C, #FFD700, transparent)" }} />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.22em", color: "#C9A84C77", textTransform: "uppercase", fontFamily: "'Inter', system-ui, sans-serif" }}>
            {index + 1} of {total}
          </p>
          <span style={{ fontSize: 24 }}>{icon ?? pickIcon(index)}</span>
        </div>

        {/* Gold rule */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, #C9A84C55, transparent)", marginBottom: 18 }} />

        <p style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700, color: "#C9A84C", lineHeight: 1.35 }}>
          {headline}
        </p>
        <p style={{ margin: 0, fontSize: 14, color: "#d4e8dc", lineHeight: 1.8, fontFamily: "'Inter', system-ui, sans-serif" }}>
          {body}
        </p>
      </div>

      {/* Bottom divider + brand */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#C9A84C22" }} />
          <span style={{ fontSize: 9, color: "#C9A84C44", letterSpacing: "0.18em", fontFamily: "'Inter', system-ui, sans-serif" }}>IKENGA AI</span>
          <div style={{ flex: 1, height: 1, background: "#C9A84C22" }} />
        </div>
        <ProgressDots total={total} current={index} color="#C9A84C" />
      </div>
    </div>
  );
}

// ── Bold ──────────────────────────────────────────────────────

function BoldSlide({ headline, body, index, total, icon }: SlideData) {
  const isFirst = index === 0;
  return (
    <div
      style={{
        background:    "#FFD700",
        borderRadius:  14,
        padding:       "36px 40px",
        minHeight:     260,
        display:       "flex",
        flexDirection: "column",
        justifyContent:"space-between",
        fontFamily:    "'Inter', system-ui, sans-serif",
        position:      "relative",
        overflow:      "hidden",
      }}
    >
      {/* Accent bars */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "#0A0A0A" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 2, background: "#0A0A0A22" }} />

      <div style={{ paddingLeft: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.18em", color: "#0A0A0A77", textTransform: "uppercase", fontWeight: 700 }}>
            {index + 1} / {total}
          </p>
          <span style={{ fontSize: 26 }}>{icon ?? pickIcon(index)}</span>
        </div>

        <p style={{ margin: "0 0 14px", fontSize: isFirst ? 30 : 24, fontWeight: 900, color: "#0A0A0A", lineHeight: 1.2, letterSpacing: "-0.02em", fontFamily: "'Playfair Display', Georgia, serif" }}>
          {headline}
        </p>
        <p style={{ margin: 0, fontSize: 14, color: "#2a2000", lineHeight: 1.7 }}>
          {body}
        </p>
      </div>

      <div style={{ paddingLeft: 18, marginTop: 20 }}>
        <ProgressDots total={total} current={index} color="#0A0A0A" />
      </div>
    </div>
  );
}

// ── Elegant ───────────────────────────────────────────────────

function ElegantSlide({ headline, body, index, total, icon }: SlideData) {
  return (
    <div
      style={{
        background:    "#0D0D0D",
        borderRadius:  14,
        padding:       "42px 46px",
        minHeight:     260,
        display:       "flex",
        flexDirection: "column",
        justifyContent:"space-between",
        fontFamily:    "'Playfair Display', Georgia, serif",
        border:        "1px solid #C9A84C22",
        position:      "relative",
      }}
    >
      {/* Gold top gradient */}
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.26em", color: "#C9A84C", textTransform: "uppercase", fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600 }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <span style={{ fontSize: 24, opacity: 0.8 }}>{icon ?? pickIcon(index)}</span>
        </div>

        {/* Italic gold rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 28, height: 1, background: "#C9A84C" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />
        </div>

        <p style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700, color: "#FFF4C0", lineHeight: 1.35, fontStyle: "italic" }}>
          {headline}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#999", lineHeight: 1.8, fontFamily: "'Inter', system-ui, sans-serif", fontStyle: "normal" }}>
          {body}
        </p>
      </div>

      <div style={{ marginTop: 24 }}>
        <ProgressDots total={total} current={index} color="#C9A84C" />
      </div>

      {/* Gold bottom gradient */}
      <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
    </div>
  );
}

// ── Dispatcher ────────────────────────────────────────────────

interface TemplateProps extends SlideData {
  template: TemplateId;
}

export function SlideTemplate({ template, ...props }: TemplateProps) {
  switch (template) {
    case "minimal":     return <MinimalSlide     {...props} />;
    case "data-driven": return <DataDrivenSlide  {...props} />;
    case "cultural":    return <CulturalSlide    {...props} />;
    case "bold":        return <BoldSlide        {...props} />;
    case "elegant":     return <ElegantSlide     {...props} />;
  }
}
