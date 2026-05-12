// ============================================================
// IKENGA — Igbo Voice Engine
// Dialect detection + diacritic substitution + core pronunciation.
// All text through applyIgboVoice() before any TTS call.
//
// Pipeline: diacritics → dialect overrides → core pronunciation
// ============================================================

import { fixPronunciation } from "./pronunciation";

// ── Igbo diacritic vowels → phonetic equivalents ─────────────
// Required for TTS engines that cannot handle Unicode diacritics.

const DIACRITIC_MAP: Record<string, string> = {
  "ị": "ee", "Ị": "Ee",
  "ọ": "aw", "Ọ": "Aw",
  "ụ": "oo", "Ụ": "Oo",
  "ń": "n",  "ǹ": "n",
  "ṅ": "ng",
  "ḿ": "m",
};

// ── Dialect types ─────────────────────────────────────────────

export type IgboDialect = "central" | "nnewi" | "enugu";

// ── Dialect-specific overrides (applied on top of core) ───────

const DIALECT_OVERRIDES: Record<IgboDialect, Record<string, string>> = {
  central: {
    "Nnọọ":      "Nn-noh",
    "nnọọ":      "Nn-noh",
    "biko":      "bee-koh",
    "nna m":     "nnah m",
    "nne m":     "nneh m",
    "Chineke":   "Chee-neh-keh",
    "Chiukwu":   "Chee-oo-kwoo",
    "Agwu":      "Ah-gwoo",
  },
  nnewi: {
    "dee":       "deh",
    "Nnewi":     "N-way",
    "Ogidi":     "Oh-gee-dee",
    "Nkwelle":   "N-kwel-eh",
    "Oba":       "Oh-bah",
  },
  enugu: {
    "Enugu":     "Eh-noo-goo",
    "Awgu":      "Ah-woo",
    "Oji River": "Oh-jee River",
    "Nsukka":    "N-soo-kah",
    "Agbani":    "Ah-gbah-nee",
  },
};

// ── Dialect detection ─────────────────────────────────────────

/**
 * Detect the Igbo dialect from text markers.
 * Falls back to Central (most common standard dialect).
 */
export function detectDialect(text: string): IgboDialect {
  const lower = text.toLowerCase();
  if (lower.includes("nnọọ") || lower.includes("nnoo") || lower.includes("chineke") || lower.includes("chiukwu")) {
    return "central";
  }
  if (lower.includes("nnewi") || lower.includes("dee ") || lower.includes("nkwelle")) {
    return "nnewi";
  }
  if (lower.includes("enugu") || lower.includes("awgu") || lower.includes("nsukka")) {
    return "enugu";
  }
  return "central";
}

// ── Diacritic substitution ────────────────────────────────────

function applyDiacritics(text: string): string {
  let result = text;
  for (const [char, replacement] of Object.entries(DIACRITIC_MAP)) {
    result = result.split(char).join(replacement);
  }
  return result;
}

// ── Full Igbo voice pipeline ──────────────────────────────────

/**
 * Full pipeline for any text before TTS:
 * 1. Replace diacritic characters (ị, ọ, ụ → phonetic equivalents)
 * 2. Apply dialect-specific overrides
 * 3. Apply core IKENGA pronunciation overrides (brand names + Igbo terms)
 *
 * Always pass dialect when known. When unknown, dialect is auto-detected.
 */
export function applyIgboVoice(text: string, dialect?: IgboDialect): string {
  const resolvedDialect: IgboDialect = dialect ?? detectDialect(text);

  // Step 1: Diacritics
  let processed = applyDiacritics(text);

  // Step 2: Dialect overrides
  const dialectMap = DIALECT_OVERRIDES[resolvedDialect];
  for (const [wrong, correct] of Object.entries(dialectMap)) {
    const escaped = wrong.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    processed = processed.replace(new RegExp(escaped, "gi"), correct);
  }

  // Step 3: Core pronunciation overrides (brand names, people, cultural terms)
  return fixPronunciation(processed);
}
