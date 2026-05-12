"use client";

import { AudioPlayer } from "@/src/components/audio-player";

interface Props {
  title: string;
  body:  string;
  color: string;
}

export function StudioAudio({ title, body, color }: Props) {
  const narration = `${title}. ${body}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <p style={{ margin: "0 0 6px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "#444" }}>
          Narration text
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#888", lineHeight: 1.7 }}>
          {narration.slice(0, 300)}{narration.length > 300 ? "…" : ""}
        </p>
      </div>

      <AudioPlayer text={narration} color={color} />

      <p style={{ margin: 0, fontSize: 11, color: "#333" }}>
        Uses ElevenLabs when available · falls back to browser TTS · 10,000 chars/month free
      </p>
    </div>
  );
}
