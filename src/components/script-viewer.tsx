"use client";

import { useState } from "react";

export interface VideoScript {
  hook:   string;
  scenes: { beat: string; narration: string }[];
  cta:    string;
}

interface Props {
  script: VideoScript;
  color?: string;
}

export function ScriptViewer({ script, color = "#C9A84C" }: Props) {
  const [copied, setCopied] = useState(false);

  function buildPlainText(): string {
    const lines: string[] = [];

    lines.push("HOOK (0–3s)");
    lines.push(`"${script.hook}"`);
    lines.push("");

    script.scenes.forEach((scene, i) => {
      lines.push(`SCENE ${i + 1} — ${scene.beat.toUpperCase()}`);
      lines.push(scene.narration);
      lines.push("");
    });

    lines.push("CALL TO ACTION");
    lines.push(script.cta);
    lines.push("");
    lines.push("---");
    lines.push("Hook straight to camera. No intro. 60–90s short-form video.");

    return lines.join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildPlainText()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      style={{
        background:   "#050505",
        border:       `1px solid ${color}33`,
        borderRadius: 12,
        padding:      "20px 22px",
        fontFamily:   "'Courier New', Courier, monospace",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.16em", color: "#444" }}>
            Screenplay Format
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#333" }}>
            Short-form video script · 60–90s
          </p>
        </div>
        <button
          onClick={handleCopy}
          style={{
            background:   copied ? "#1a2a1a" : "transparent",
            border:       `1px solid ${copied ? "#2a4a2a" : "#333"}`,
            borderRadius: 7,
            padding:      "5px 13px",
            fontSize:     11,
            color:        copied ? "#4ade80" : "#555",
            cursor:       "pointer",
            transition:   "all 0.15s",
          }}
        >
          {copied ? "Copied ✓" : "Copy script"}
        </button>
      </div>

      {/* HOOK */}
      <section style={{ marginBottom: 20 }}>
        <p style={{ margin: "0 0 8px", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: color, fontWeight: 700 }}>
          HOOK — (0–3 SEC)
        </p>
        <div style={{ background: color + "0d", border: `1px solid ${color}22`, borderRadius: 8, padding: "12px 14px" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#FFF4C0", lineHeight: 1.6, fontStyle: "italic" }}>
            &ldquo;{script.hook}&rdquo;
          </p>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 10, color: "#333" }}>
          INT. / EXT. — DIRECT TO CAMERA — HOOK
        </p>
      </section>

      {/* SCENES */}
      {script.scenes.map((scene, i) => (
        <section key={i} style={{ marginBottom: 18 }}>
          <p style={{ margin: "0 0 8px", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "#555", fontWeight: 700 }}>
            SCENE {i + 1} — {scene.beat.toUpperCase()}
          </p>
          <div
            style={{
              paddingLeft:  14,
              borderLeft:   `2px solid ${color}33`,
            }}
          >
            <p style={{ margin: 0, fontSize: 13, color: "#aaa", lineHeight: 1.75, whiteSpace: "pre-line" }}>
              {scene.narration}
            </p>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 10, color: "#2a2a2a" }}>
            INT. / EXT. — B-ROLL or TALKING HEAD — {scene.beat.toUpperCase()}
          </p>
        </section>
      ))}

      {/* CTA */}
      <section>
        <p style={{ margin: "0 0 8px", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: color, fontWeight: 700 }}>
          CTA — CLOSING
        </p>
        <div style={{ background: color + "11", border: `1px solid ${color}33`, borderRadius: 8, padding: "12px 14px" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#ccc", lineHeight: 1.65 }}>
            {script.cta}
          </p>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 10, color: "#2a2a2a" }}>
          INT. / EXT. — DIRECT TO CAMERA — CTA
        </p>
      </section>

      {/* Footer note */}
      <p style={{ margin: "16px 0 0", fontSize: 10, color: "#2a2a2a", borderTop: "1px solid #111", paddingTop: 10 }}>
        FADE OUT. · No intro. No "today we're going to…". Hook straight to camera.
      </p>
    </div>
  );
}
