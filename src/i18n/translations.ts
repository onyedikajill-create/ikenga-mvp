// IKENGA UI translations — EN / FR / IG (Igbo)
// Covers: dashboard form labels, buttons, status messages, gallery headings.
// Usage: import { t } from "@/src/i18n/translations"; then t(lang, "key")

export type Lang = "en" | "fr" | "ig";

const T = {
  // ── Form field labels ──────────────────────────────────────────
  field_brand:      { en: "Brand name *",    fr: "Nom de la marque *",  ig: "Aha ụlọ ọrụ *"   },
  field_goals:      { en: "Goals *",          fr: "Objectifs *",          ig: "Ebumnobi *"       },
  field_niche:      { en: "Niche",            fr: "Niche",                ig: "Ọkwa"             },
  field_audience:   { en: "Target audience",  fr: "Audience cible",       ig: "Ndị ọbịa"        },
  field_tone:       { en: "Brand tone",       fr: "Ton de la marque",     ig: "Ụda ụlọ ọrụ"    },

  // ── Form placeholders ─────────────────────────────────────────
  ph_brand:         { en: "e.g. NovaBrew Coffee",                           fr: "ex. NovaBrew Café",                              ig: "ihe atụ: NovaBrew"               },
  ph_goals:         { en: "e.g. Grow Instagram, drive sales",               fr: "ex. Croître sur Instagram, générer des ventes",   ig: "ihe atụ: Tọọ Instagram, ere ahịa" },
  ph_niche:         { en: "e.g. Speciality coffee, Lagos",                  fr: "ex. Café de spécialité, Lagos",                   ig: "ihe atụ: Kọfị pụrụ iche, Lagos"  },
  ph_audience:      { en: "e.g. Urban professionals 25–40",                 fr: "ex. Professionnels urbains 25–40",                ig: "ihe atụ: Ndị ọrụ obodo 25–40"    },
  ph_tone:          { en: "e.g. Bold and unapologetic, or Warm and cultural", fr: "ex. Audacieux, ou Chaleureux et culturel",       ig: "ihe atụ: Ike ma ọ bụ Ọhụụ"      },

  // ── Buttons ───────────────────────────────────────────────────
  btn_generate:     { en: "Run {product} →",          fr: "Lancer {product} →",      ig: "Malite {product} →"    },
  btn_generating:   { en: "Generating…",              fr: "Génération…",              ig: "Na-emepụta…"           },
  btn_new_gen:      { en: "New {product} Generation →", fr: "Nouvelle génération →",  ig: "Emepụta ọhụụ →"       },
  btn_upgrade_req:  { en: "Upgrade Required",          fr: "Mise à niveau requise",   ig: "Kwado ihe ọhụụ"       },
  btn_cancel:       { en: "Cancel",                    fr: "Annuler",                 ig: "Kagbuo"               },
  btn_logout:       { en: "Log out",                   fr: "Déconnexion",             ig: "Pụọ"                  },
  btn_upgrade:      { en: "Upgrade",                   fr: "Améliorer",               ig: "Kwado"                },

  // ── Progress / status ─────────────────────────────────────────
  progress_hint:    { en: "13 calls · each asset saves as it completes · results appear in gallery below", fr: "13 appels · chaque contenu sauvegardé au fur et à mesure", ig: "Ọrụ 13 · ihe ọ bụla na-echekwa ozugbo" },
  status_starting:  { en: "Starting…",   fr: "Démarrage…",    ig: "Na-amalite…"  },
  status_done:      { en: "Done!",       fr: "Terminé!",       ig: "Emechara!"    },
  err_network:      { en: "Network error. Try again.", fr: "Erreur réseau. Réessayez.", ig: "Njehie netwọk. Nwaa ọzọ." },
  err_failed:       { en: "Failed.",     fr: "Échec.",         ig: "Ọ dara ada."  },
  err_upgrade_link: { en: "Upgrade →",   fr: "Améliorer →",   ig: "Kwado →"      },

  // ── Usage card ────────────────────────────────────────────────
  usage_free_label: { en: "Free generations",  fr: "Générations gratuites",   ig: "Emepụta n'efu"  },
  usage_pro_label:  { en: "{n} total generations · Unlimited Pro access", fr: "{n} générations · Accès Pro illimité", ig: "Emepụta {n} · Ohere Pro" },
  usage_bonus:      { en: "+{n} bonus gens from referrals", fr: "+{n} gens bonus via parrainages", ig: "+{n} ọmụma site n'ntụaka" },

  // ── Gallery ───────────────────────────────────────────────────
  gallery_title:    { en: "Content Gallery", fr: "Galerie de contenus", ig: "Ụlọ ihe ọmụma" },
  gallery_pieces:   { en: "{n} pieces",      fr: "{n} pièces",          ig: "{n} ihe"        },

  // ── Copyright notice ──────────────────────────────────────────
  copyright_notice: {
    en: "⚠️ You are solely responsible for the content you generate. You must own or have permission to use all brand materials you reference. IKENGA does not claim ownership of your output.",
    fr: "⚠️ Vous êtes seul responsable du contenu que vous générez. Vous devez posséder ou avoir la permission d'utiliser tous les matériaux de marque que vous référencez.",
    ig: "⚠️ Ị bụ onye na-azọ maka ihe ị na-emepụta. Ị kwesịrị inwe ikike iji ihe ndị ọ bụla ị na-eji. IKENGA enweghị onwunwe ihe ị mepụtara.",
  },
  copyright_label:  { en: "Copyright notice:", fr: "Avis de droit d'auteur:", ig: "Ọ bụ ihe gị:" },
  copyright_policy: { en: "Copyright Policy",  fr: "Politique de droits",      ig: "Iwu Ndị Ọrụ"  },

  // ── Pending payment notice ────────────────────────────────────
  pay_pending_title: { en: "Payment pending confirmation", fr: "Paiement en attente de confirmation", ig: "Ọnụahịa na-atọ ndụ" },
  pay_pending_note:  { en: "Confirmed within 24h. Pro access activates immediately on confirmation.", fr: "Confirmé dans les 24h. L'accès Pro s'active immédiatement.", ig: "Emesịa n'ime awa 24. Ohere Pro mara ngwa ngwa." },
} as const;

type Key = keyof typeof T;

/** Translate a key to the given language. Supports {product} and {n} placeholders. */
export function t(lang: Lang, key: Key, vars?: Record<string, string | number>): string {
  const entry = T[key] as Record<Lang, string>;
  let str = entry[lang] ?? entry["en"];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}
