// ============================================================
// IKENGA — ElevenLabs TTS integration
// Falls back to browser SpeechSynthesis when API key is absent
// or quota is exhausted (429).
// Free tier: 10,000 chars/month
//
// All text passes through fixPronunciation() before sending to
// any TTS engine so brand names and Igbo terms are hailed
// correctly: "Ee-ken-gah", not "I-K-E-N-G-A".
// ============================================================

import { applyIgboVoice } from "@/src/lib/igbo-voice";

export type VoiceAccent = "nigerian" | "british" | "american";

export interface ElevenLabsVoice {
  id:     string;
  name:   string;
  accent: VoiceAccent;
}

// Curated voices per accent — update IDs from ElevenLabs voice library as needed
export const ELEVENLABS_VOICES: ElevenLabsVoice[] = [
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam",    accent: "american" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel",  accent: "american" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi",    accent: "british"  },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella",   accent: "british"  },
  // Nigerian-accented voices — use closest available or custom cloned voice
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold",  accent: "nigerian" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam",     accent: "nigerian" },
];

export const ACCENT_LABELS: Record<VoiceAccent, string> = {
  nigerian:  "Nigerian English",
  british:   "British English",
  american:  "American English",
};

function getApiKey(): string | null {
  // Client-safe: key must be exposed via NEXT_PUBLIC_ prefix for client usage
  return process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ?? null;
}

// ── ElevenLabs fetch ──────────────────────────────────────────

async function fetchElevenLabs(text: string, voiceId: string): Promise<ArrayBuffer | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const corrected = applyIgboVoice(text);

  try {
    const res = await fetch(url, {
      method:  "POST",
      headers: {
        "xi-api-key":   apiKey,
        "Content-Type": "application/json",
        "Accept":       "audio/mpeg",
      },
      body: JSON.stringify({
        text: corrected,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (res.status === 429 || !res.ok) return null;   // quota or error → fallback
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

// ── Browser TTS fallback ──────────────────────────────────────

export interface TtsHandle {
  stop: () => void;
}

function browserTts(
  text:       string,
  accent:     VoiceAccent,
  onProgress: (pct: number) => void,
  onDone:     () => void,
): TtsHandle {
  const synth = window.speechSynthesis;
  synth.cancel();

  const corrected = applyIgboVoice(text);
  const utt  = new SpeechSynthesisUtterance(corrected);
  utt.lang   = accent === "american" ? "en-US" : "en-GB";
  utt.rate   = 0.92;
  utt.pitch  = 1;

  // Try to pick an accent-appropriate voice
  const voices = synth.getVoices();
  const pick = accent === "american"
    ? voices.find(v => v.lang === "en-US" && (v.name.includes("Samantha") || v.name.includes("Alex")))
    : voices.find(v => v.lang === "en-GB" && (v.name.includes("Daniel") || v.name.includes("Kate")));
  if (pick) utt.voice = pick;

  const wordCount    = corrected.split(/\s+/).length;
  const durationMs   = (wordCount / 130) * 60_000 / 0.92;
  let elapsed        = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  utt.onstart = () => {
    onProgress(1);
    timer = setInterval(() => {
      elapsed += 500;
      onProgress(Math.min(99, Math.round((elapsed / durationMs) * 100)));
    }, 500);
  };

  utt.onend = () => {
    if (timer) clearInterval(timer);
    onProgress(100);
    setTimeout(onDone, 600);
  };

  utt.onerror = () => {
    if (timer) clearInterval(timer);
    onDone();
  };

  synth.speak(utt);

  return {
    stop: () => {
      if (timer) clearInterval(timer);
      synth.cancel();
    },
  };
}

// ── AudioContext playback ─────────────────────────────────────

async function playArrayBuffer(
  buffer:     ArrayBuffer,
  onProgress: (pct: number) => void,
  onDone:     () => void,
): Promise<TtsHandle> {
  const ctx     = new AudioContext();
  const decoded = await ctx.decodeAudioData(buffer);
  const source  = ctx.createBufferSource();
  source.buffer = decoded;
  source.connect(ctx.destination);

  const duration = decoded.duration * 1000;
  let   elapsed  = 0;
  const timer    = setInterval(() => {
    elapsed += 200;
    onProgress(Math.min(99, Math.round((elapsed / duration) * 100)));
  }, 200);

  source.onended = () => {
    clearInterval(timer);
    onProgress(100);
    ctx.close();
    setTimeout(onDone, 300);
  };

  source.start();

  return {
    stop: () => {
      clearInterval(timer);
      source.stop();
      ctx.close();
    },
  };
}

// ── Public API ────────────────────────────────────────────────

/**
 * Speak `text` using ElevenLabs if available, otherwise browser TTS.
 * Returns a handle with a `stop()` method.
 */
export async function speak(
  text:       string,
  voice:      ElevenLabsVoice,
  onProgress: (pct: number) => void,
  onDone:     () => void,
): Promise<TtsHandle> {
  const buffer = await fetchElevenLabs(text, voice.id);
  if (buffer) {
    return playArrayBuffer(buffer, onProgress, onDone);
  }
  // Fallback
  return browserTts(text, voice.accent, onProgress, onDone);
}
