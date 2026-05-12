"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { speak, ELEVENLABS_VOICES, type ElevenLabsVoice, type TtsHandle } from "@/src/lib/elevenlabs";
import { VoiceSelector } from "@/src/components/voice-selector";

interface Props {
  text:    string;
  color?:  string;
}

// ── Waveform bars ─────────────────────────────────────────────

function Waveform({ playing, color }: { playing: boolean; color: string }) {
  const BARS   = 28;
  const heights = useRef<number[]>(
    Array.from({ length: BARS }, () => 20 + Math.random() * 60)
  );

  return (
    <div
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        2,
        height:     40,
        padding:    "0 4px",
      }}
    >
      {heights.current.map((h, i) => (
        <div
          key={i}
          style={{
            width:        3,
            height:       playing ? `${h}%` : "20%",
            background:   color,
            borderRadius: 3,
            transition:   playing
              ? `height ${0.25 + (i % 5) * 0.07}s ease-in-out ${(i * 0.03).toFixed(2)}s`
              : "height 0.4s ease",
            opacity:      playing ? 0.85 : 0.25,
          }}
        />
      ))}
    </div>
  );
}

// ── Audio player ──────────────────────────────────────────────

export function AudioPlayer({ text, color = "#C9A84C" }: Props) {
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [voice,    setVoice]    = useState<ElevenLabsVoice>(ELEVENLABS_VOICES[0]);
  const [open,     setOpen]     = useState(false);
  const handleRef = useRef<TtsHandle | null>(null);

  // Stop on unmount
  useEffect(() => {
    return () => { handleRef.current?.stop(); };
  }, []);

  const handleDone = useCallback(() => {
    setPlaying(false);
    setTimeout(() => setProgress(0), 700);
  }, []);

  async function toggle() {
    if (playing) {
      handleRef.current?.stop();
      setPlaying(false);
      setProgress(0);
      return;
    }
    setPlaying(true);
    setProgress(1);
    handleRef.current = await speak(
      text,
      voice,
      pct => setProgress(pct),
      handleDone,
    );
  }

  return (
    <div
      style={{
        background:   "#080808",
        border:       `1px solid ${playing ? color + "44" : "#1a1a1a"}`,
        borderRadius: 12,
        padding:      "14px 16px",
        transition:   "border-color 0.2s",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Play / stop */}
        <button
          onClick={toggle}
          style={{
            width:        38,
            height:       38,
            borderRadius: "50%",
            background:   playing ? color + "22" : color,
            border:       `1px solid ${playing ? color : "transparent"}`,
            color:        playing ? color : "#000",
            fontSize:     16,
            cursor:       "pointer",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            flexShrink:   0,
            transition:   "all 0.15s",
          }}
          title={playing ? "Stop" : "Play narration"}
        >
          {playing ? "■" : "▶"}
        </button>

        {/* Waveform */}
        <div style={{ flex: 1 }}>
          <Waveform playing={playing} color={color} />
        </div>

        {/* Voice selector toggle */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background:   open ? "#1B3A2D" : "transparent",
            border:       `1px solid ${open ? "#C9A84C44" : "#222"}`,
            borderRadius: 7,
            padding:      "5px 10px",
            fontSize:     11,
            color:        open ? "#C9A84C" : "#444",
            cursor:       "pointer",
            whiteSpace:   "nowrap",
          }}
        >
          {voice.name} ▾
        </button>
      </div>

      {/* Progress bar */}
      {(playing || progress > 0) && (
        <div style={{ marginTop: 10 }}>
          <div style={{ height: 2, background: "#111", borderRadius: 100, overflow: "hidden" }}>
            <div
              style={{
                height:     "100%",
                width:      `${progress}%`,
                background: color,
                borderRadius: 100,
                transition: "width 0.4s linear",
              }}
            />
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 10, color: "#444" }}>
            {playing ? `Narrating… ${progress}%` : "Done"}
          </p>
        </div>
      )}

      {/* Voice selector panel */}
      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #111" }}>
          <VoiceSelector selected={voice} onChange={v => { setVoice(v); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}
