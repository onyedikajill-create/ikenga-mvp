"use client";

import {
  ELEVENLABS_VOICES,
  ACCENT_LABELS,
  type ElevenLabsVoice,
  type VoiceAccent,
} from "@/src/lib/elevenlabs";

interface Props {
  selected: ElevenLabsVoice;
  onChange: (voice: ElevenLabsVoice) => void;
}

const ACCENT_ORDER: VoiceAccent[] = ["nigerian", "british", "american"];

export function VoiceSelector({ selected, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={{ margin: 0, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>
        Voice
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {ACCENT_ORDER.map(accent => {
          const voices = ELEVENLABS_VOICES.filter(v => v.accent === accent);
          const first  = voices[0];
          if (!first) return null;
          const isActive = selected.accent === accent;
          return (
            <button
              key={accent}
              onClick={() => onChange(first)}
              style={{
                background:    isActive ? "#1B3A2D" : "transparent",
                border:        `1px solid ${isActive ? "#C9A84C" : "#222"}`,
                borderRadius:  8,
                padding:       "6px 14px",
                fontSize:      12,
                color:         isActive ? "#C9A84C" : "#555",
                cursor:        "pointer",
                fontWeight:    isActive ? 700 : 400,
                transition:    "all 0.15s",
              }}
              title={`${voices.length} voice${voices.length !== 1 ? "s" : ""} available`}
            >
              {ACCENT_LABELS[accent]}
            </button>
          );
        })}
      </div>
      {/* Voice name within accent */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {ELEVENLABS_VOICES.filter(v => v.accent === selected.accent).map(v => (
          <button
            key={v.id}
            onClick={() => onChange(v)}
            style={{
              background:   v.id === selected.id ? "#C9A84C22" : "transparent",
              border:       `1px solid ${v.id === selected.id ? "#C9A84C44" : "#1a1a1a"}`,
              borderRadius: 6,
              padding:      "4px 10px",
              fontSize:     11,
              color:        v.id === selected.id ? "#C9A84C" : "#444",
              cursor:       "pointer",
              transition:   "all 0.12s",
            }}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  );
}
