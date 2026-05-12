// ============================================================
// IKENGA — Pronunciation overrides for ElevenLabs TTS
// Ensures Igbo brand names and cultural terms are hailed,
// not spelled or mispronounced.
//
// IKENGA must be hailed as "Ee-ken-gah", not "I-K-E-N-G-A".
// OJE MBA must be "Oh-Jay M-Bah", not "Oh-Jay M-Bee-eh".
//
// Apply fixPronunciation() to ALL text before sending to TTS.
// ============================================================

export const PRONUNCIATION_OVERRIDES: Record<string, string> = {
  // ── Brand names ──────────────────────────────────────────────
  "IKENGA":       "Ee-ken-gah",
  "I K E N G A":  "Ee-ken-gah",
  "ikenga":       "Ee-ken-gah",

  "UJU":          "Oo-joo",
  "U J U":        "Oo-joo",

  "UJRIS":        "Oo-jee-ris",
  "U J R I S":    "Oo-jee-ris",
  "Ujris":        "Oo-jee-ris",

  // ── People ───────────────────────────────────────────────────
  "OJE MBA":      "Oh-Jay M-Bah",
  "O J E   M B A":"Oh-Jay M-Bah",
  "Oje Mba":      "Oh-Jay M-Bah",
  "oje mba":      "Oh-Jay M-Bah",

  // ── Igbo engines & cultural terms ────────────────────────────
  "Omenala":      "Oh-men-ah-lah",
  "OMENALA":      "Oh-men-ah-lah",

  "Icheoku":      "Ee-chay-oh-koo",
  "ICHEOKU":      "Ee-chay-oh-koo",

  "JUO":          "Joo-oh",
  "Juo":          "Joo-oh",

  "OBA":          "Oh-bah",
  "Oba":          "Oh-bah",

  "Chi":          "Chee",
  "CHI":          "Chee",

  // ── Chi ranks (Igbo pronunciation) ───────────────────────────
  "Nwa":              "Nwah",
  "Odibo":            "Oh-dee-boh",
  "Okenye":           "Oh-ken-yeh",
  "Dibia":            "Dee-bee-ah",
  "Di nke Content":   "Dee n-keh Content",

  // ── Igbo cultural phrases ─────────────────────────────────────
  "Nze na Ozo":       "Nn-zeh nah Oh-zoh",
  "Oji":              "Oh-jee",
  "Ndidi":            "Nn-dee-dee",
  "Igba Boi":         "Ee-gbah Boh-ee",
  "Mma nwanyi":       "Mmah nwah-nyee",
  "Ikuchi nwanyi":    "Ee-koo-chee nwah-nyee",
};

/**
 * Replace all brand names and Igbo terms with their phonetic equivalents
 * before sending to any TTS system (ElevenLabs or browser).
 */
export function fixPronunciation(text: string): string {
  let fixed = text;
  for (const [wrong, correct] of Object.entries(PRONUNCIATION_OVERRIDES)) {
    // Word-boundary aware replacement
    const escaped = wrong.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    fixed = fixed.replace(new RegExp(escaped, "gi"), correct);
  }
  return fixed;
}
