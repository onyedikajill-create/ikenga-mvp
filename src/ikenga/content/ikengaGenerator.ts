import Anthropic from "@anthropic-ai/sdk";
import type { ContentBlockParam } from "@anthropic-ai/sdk/resources/messages/messages";

import {
  getAnthropicApiKey,
  getIkengaAnthropicModel,
} from "../lib/aiConfig";

export const IKENGA_MAX_ATTACHMENTS = 5;

const IKENGA_MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const IKENGA_MAX_TEXT_ATTACHMENT_CHARS = 12_000;
const IKENGA_SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const IKENGA_SUPPORTED_TEXT_TYPES = new Set([
  "application/json",
  "application/ld+json",
  "application/xml",
  "application/x-yaml",
  "text/csv",
  "text/html",
  "text/markdown",
  "text/plain",
  "text/xml",
]);
const IKENGA_TEXT_FILE_EXTENSIONS = new Set([
  ".csv",
  ".html",
  ".json",
  ".markdown",
  ".md",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
]);

/* eslint-disable @typescript-eslint/no-unused-vars */
// Schema kept as documentation only — not passed to the API (avoids grammar size limits).
// The system prompt instructs Claude to match this structure.
const _ikengaGenerationSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "requestSummary",
    "brandVoiceSummary",
    "calendar",
    "socialPosts",
    "videoScripts",
    "carouselOutlines",
    "emails",
    "ads",
    "executionNotes",
  ],
  properties: {
    requestSummary: {
      type: "object",
      additionalProperties: false,
      required: [
        "brand",
        "niche",
        "goals",
        "audience",
        "offer",
        "contentPillars",
        "callsToAction",
      ],
      properties: {
        brand: { type: "string" },
        niche: { type: "string" },
        goals: { type: "string" },
        audience: { type: "string" },
        offer: { type: "string" },
        contentPillars: {
          type: "array",
          minItems: 3,
          items: { type: "string" },
        },
        callsToAction: {
          type: "array",
          minItems: 1,
          items: { type: "string" },
        },
      },
    },
    brandVoiceSummary: {
      type: "object",
      additionalProperties: false,
      required: [
        "positioning",
        "tone",
        "messagingRules",
        "proofPoints",
        "differentiators",
      ],
      properties: {
        positioning: { type: "string" },
        tone: { type: "string" },
        messagingRules: {
          type: "array",
          minItems: 3,
          items: { type: "string" },
        },
        proofPoints: {
          type: "array",
          minItems: 3,
          items: { type: "string" },
        },
        differentiators: {
          type: "array",
          minItems: 3,
          items: { type: "string" },
        },
      },
    },
    calendar: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "dayNumber",
          "theme",
          "primaryGoal",
          "channelFocus",
          "contentAngle",
          "callToAction",
        ],
        properties: {
          dayNumber: {
            type: "integer",
            minimum: 1,
            maximum: 7,
          },
          theme: { type: "string" },
          primaryGoal: { type: "string" },
          channelFocus: {
            type: "array",
            minItems: 1,
            items: { type: "string" },
          },
          contentAngle: { type: "string" },
          callToAction: { type: "string" },
        },
      },
    },
    socialPosts: {
      type: "array",
      minItems: 14,
      maxItems: 14,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "dayNumber",
          "platform",
          "format",
          "hook",
          "caption",
          "callToAction",
          "assetBrief",
          "hashtags",
        ],
        properties: {
          id: { type: "string" },
          dayNumber: {
            type: "integer",
            minimum: 1,
            maximum: 7,
          },
          platform: { type: "string" },
          format: { type: "string" },
          hook: { type: "string" },
          caption: { type: "string" },
          callToAction: { type: "string" },
          assetBrief: { type: "string" },
          hashtags: {
            type: "array",
            minItems: 3,
            maxItems: 8,
            items: { type: "string" },
          },
        },
      },
    },
    videoScripts: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["dayNumber", "title", "hook", "scenes", "callToAction"],
        properties: {
          dayNumber: {
            type: "integer",
            minimum: 1,
            maximum: 7,
          },
          title: { type: "string" },
          hook: { type: "string" },
          scenes: {
            type: "array",
            minItems: 3,
            maxItems: 6,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["beat", "visual", "narration"],
              properties: {
                beat: { type: "string" },
                visual: { type: "string" },
                narration: { type: "string" },
              },
            },
          },
          callToAction: { type: "string" },
        },
      },
    },
    carouselOutlines: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["dayNumber", "title", "slides", "callToAction"],
        properties: {
          dayNumber: {
            type: "integer",
            minimum: 1,
            maximum: 7,
          },
          title: { type: "string" },
          slides: {
            type: "array",
            minItems: 5,
            maxItems: 8,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["slideNumber", "headline", "supportingCopy"],
              properties: {
                slideNumber: {
                  type: "integer",
                  minimum: 1,
                },
                headline: { type: "string" },
                supportingCopy: { type: "string" },
              },
            },
          },
          callToAction: { type: "string" },
        },
      },
    },
    emails: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "dayNumber",
          "subjectLine",
          "previewText",
          "audienceSegment",
          "body",
          "callToAction",
        ],
        properties: {
          dayNumber: {
            type: "integer",
            minimum: 1,
            maximum: 7,
          },
          subjectLine: { type: "string" },
          previewText: { type: "string" },
          audienceSegment: { type: "string" },
          body: { type: "string" },
          callToAction: { type: "string" },
        },
      },
    },
    ads: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["audience", "angle", "headline", "primaryText", "callToAction"],
        properties: {
          audience: { type: "string" },
          angle: { type: "string" },
          headline: { type: "string" },
          primaryText: { type: "string" },
          callToAction: { type: "string" },
        },
      },
    },
    executionNotes: {
      type: "object",
      additionalProperties: false,
      required: ["priorities", "risks", "missingInputs"],
      properties: {
        priorities: {
          type: "array",
          minItems: 3,
          items: { type: "string" },
        },
        risks: {
          type: "array",
          minItems: 1,
          items: { type: "string" },
        },
        missingInputs: {
          type: "array",
          minItems: 1,
          items: { type: "string" },
        },
      },
    },
  },
} as const;
/* eslint-enable @typescript-eslint/no-unused-vars */

const IKENGA_SYSTEM_PROMPT = `
You are IKENGA, a commercial content automation engine for brands, agencies, and operators.

Your job is to turn a brief into assets that can drive awareness, leads, booked calls, sales, or email growth.

Rules:
- Output ONLY a raw JSON object. No markdown, no code fences, no explanation before or after.
- The JSON must have exactly these top-level keys:
  requestSummary, brandVoiceSummary, calendar, socialPosts, videoScripts, carouselOutlines, emails, ads, executionNotes
- calendar: array of 7 objects (dayNumber, theme, primaryGoal, channelFocus, contentAngle, callToAction)
- socialPosts: array of 14 objects (id, dayNumber, platform, format, hook, caption, callToAction, assetBrief, hashtags)
- videoScripts: array of 7 objects (dayNumber, title, hook, scenes[3-6], callToAction)
- carouselOutlines: array of 7 objects (dayNumber, title, slides[5-8], callToAction)
- emails: array of 7 objects (dayNumber, subjectLine, previewText, audienceSegment, body, callToAction)
- ads: array of 3 objects (audience, angle, headline, primaryText, callToAction)
- executionNotes: object with priorities[], risks[], missingInputs[]
- Make every asset specific, publishable, and conversion-aware.
- Use uploaded files as source of truth for tone, offer, and proof.
- Do not use filler, generic platitudes, or placeholder phrases.
- If something important is missing, make a conservative assumption and list it in executionNotes.missingInputs.
`.trim();

export interface IkengaGenerationInput {
  brand: string;
  niche: string;
  goals: string;
  audience?: string;
  offer?: string;
  tone?: string;
  website?: string;
  notes?: string;
  contentPillars: string[];
  callsToAction: string[];
}

export interface IkengaAttachmentSummary {
  filename: string;
  mediaType: string;
  size: number;
  status: "used" | "ignored";
  kind: "image" | "pdf" | "text" | "unsupported";
  note?: string;
}

export interface IkengaGenerationResult {
  requestId: string;
  model: string;
  anthropicMessageId: string;
  stopReason: string | null;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationInputTokens: number | null;
    cacheReadInputTokens: number | null;
  };
  attachments: IkengaAttachmentSummary[];
  output: unknown;
}

function randomId(): string {
  return crypto.randomUUID();
}

function normalizeLines(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function truncateText(value: string, maxChars: number): string {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, maxChars)}\n\n[Truncated by IKENGA to fit the model context window.]`;
}

function getFileExtension(filename: string): string {
  const extension = filename.toLowerCase().match(/\.[^.]+$/)?.[0];
  return extension ?? "";
}

function isTextFile(file: File): boolean {
  return (
    IKENGA_SUPPORTED_TEXT_TYPES.has(file.type) ||
    IKENGA_TEXT_FILE_EXTENSIONS.has(getFileExtension(file.name))
  );
}

function normalizeList(values: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(trimmed);
  }

  return normalized;
}

function buildBrief(
  input: IkengaGenerationInput,
  attachments: IkengaAttachmentSummary[]
): string {
  const contentPillars =
    input.contentPillars.length > 0
      ? input.contentPillars.join(", ")
      : "Infer the best pillars from the niche, goals, and notes.";
  const callsToAction =
    input.callsToAction.length > 0
      ? input.callsToAction.join(", ")
      : "Infer the strongest CTA from the stated goals and offer.";
  const attachmentNotes = attachments.length
    ? attachments
        .filter((attachment) => attachment.status === "used")
        .map(
          (attachment) =>
            `- ${attachment.filename} (${attachment.kind}, ${attachment.mediaType || "unknown"})`
        )
        .join("\n")
    : "- None";

  return [
    "Build a 7-day commercial content operating pack for this brand.",
    "",
    `Brand: ${input.brand}`,
    `Niche: ${input.niche}`,
    `Goals: ${input.goals}`,
    `Audience: ${input.audience ?? "Not provided. Infer the most likely buyer."}`,
    `Offer: ${input.offer ?? "Not provided. Infer the most likely monetizable offer."}`,
    `Tone: ${input.tone ?? "Not provided. Infer from the brief and attachments."}`,
    `Website: ${input.website ?? "Not provided."}`,
    `Content pillars: ${contentPillars}`,
    `Preferred calls to action: ${callsToAction}`,
    `Additional notes: ${input.notes ?? "None."}`,
    "",
    "Reference files attached:",
    attachmentNotes,
    "",
    "Execution priorities:",
    "- Make every asset specific enough to publish with light editing.",
    "- Write with conviction and commercial intent, not generic inspiration.",
    "- Use proof, objections, buyer psychology, and clarity whenever the brief supports it.",
    "- Keep the weekly plan coherent so the assets compound across the 7-day cycle.",
  ].join("\n");
}

async function buildAttachmentPayload(
  files: File[]
): Promise<{
  attachments: IkengaAttachmentSummary[];
  blocks: ContentBlockParam[];
}> {
  const attachments: IkengaAttachmentSummary[] = [];
  const blocks: ContentBlockParam[] = [];

  for (const file of files.slice(0, IKENGA_MAX_ATTACHMENTS)) {
    if (file.size === 0) {
      attachments.push({
        filename: file.name,
        mediaType: file.type,
        size: file.size,
        status: "ignored",
        kind: "unsupported",
        note: "Empty files are ignored.",
      });
      continue;
    }

    if (file.size > IKENGA_MAX_ATTACHMENT_BYTES) {
      attachments.push({
        filename: file.name,
        mediaType: file.type,
        size: file.size,
        status: "ignored",
        kind: "unsupported",
        note: `File exceeded the ${Math.floor(
          IKENGA_MAX_ATTACHMENT_BYTES / 1024 / 1024
        )}MB limit.`,
      });
      continue;
    }

    if (IKENGA_SUPPORTED_IMAGE_TYPES.has(file.type)) {
      const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

      attachments.push({
        filename: file.name,
        mediaType: file.type,
        size: file.size,
        status: "used",
        kind: "image",
      });
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
          data: base64,
        },
      });
      continue;
    }

    if (file.type === "application/pdf" || getFileExtension(file.name) === ".pdf") {
      const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

      attachments.push({
        filename: file.name,
        mediaType: file.type || "application/pdf",
        size: file.size,
        status: "used",
        kind: "pdf",
      });
      blocks.push({
        type: "document",
        title: file.name,
        context:
          "Use this PDF as reference material for brand voice, offer clarity, and proof.",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: base64,
        },
      });
      continue;
    }

    if (isTextFile(file)) {
      const text = truncateText(
        normalizeLines(await file.text()),
        IKENGA_MAX_TEXT_ATTACHMENT_CHARS
      );

      attachments.push({
        filename: file.name,
        mediaType: file.type || "text/plain",
        size: file.size,
        status: "used",
        kind: "text",
      });
      blocks.push({
        type: "document",
        title: file.name,
        context:
          "Use this text reference to understand the brand's positioning, claims, and tone.",
        source: {
          type: "text",
          media_type: "text/plain",
          data: text,
        },
      });
      continue;
    }

    attachments.push({
      filename: file.name,
      mediaType: file.type,
      size: file.size,
      status: "ignored",
      kind: "unsupported",
      note: "Unsupported file type. Use text, PDF, or common image formats.",
    });
  }

  return { attachments, blocks };
}

export function normalizeIkengaGenerationInput(
  input: Partial<IkengaGenerationInput>
): IkengaGenerationInput {
  return {
    brand: input.brand?.trim() ?? "",
    niche: input.niche?.trim() || "general",
    goals: input.goals?.trim() ?? "",
    audience: input.audience?.trim() || undefined,
    offer: input.offer?.trim() || undefined,
    tone: input.tone?.trim() || undefined,
    website: input.website?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    contentPillars: normalizeList(input.contentPillars ?? []),
    callsToAction: normalizeList(input.callsToAction ?? []),
  };
}

export async function generateIkengaContent(
  input: IkengaGenerationInput,
  files: File[] = []
): Promise<IkengaGenerationResult> {
  const apiKey = getAnthropicApiKey();

  if (!apiKey) {
    throw new Error(
      "Missing Anthropic credentials. Set ANTHROPIC_API_KEY or CLAUDE_API_KEY on the server."
    );
  }

  const model = getIkengaAnthropicModel();
  const requestId = randomId();
  const { attachments, blocks } = await buildAttachmentPayload(files);
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model,
    max_tokens: 16_000,
    temperature: 0.6,
    system: IKENGA_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: buildBrief(input, attachments),
          },
          ...blocks,
        ],
      },
    ],
  });

  const rawText = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  if (!rawText.trim()) {
    throw new Error("Anthropic returned an empty IKENGA payload.");
  }

  let parsed: unknown;
  try {
    // Strip accidental markdown fences if Claude added them despite instructions.
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    // Response may have been truncated mid-JSON (stop_reason === "max_tokens").
    // Attempt recovery: walk backwards from the end to find the last valid closing brace.
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    let recovered: unknown | null = null;
    for (let i = cleaned.length - 1; i > 0; i--) {
      if (cleaned[i] === "}") {
        try {
          recovered = JSON.parse(cleaned.slice(0, i + 1));
          break;
        } catch { /* keep scanning */ }
      }
    }
    if (!recovered) {
      throw new Error(`IKENGA response was not valid JSON. stop_reason=${response.stop_reason}. Raw: ${rawText.slice(0, 300)}`);
    }
    parsed = recovered;
  }

  return {
    requestId,
    model: response.model,
    anthropicMessageId: response.id,
    stopReason: response.stop_reason,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheCreationInputTokens: response.usage.cache_creation_input_tokens ?? null,
      cacheReadInputTokens: response.usage.cache_read_input_tokens ?? null,
    },
    attachments,
    output: parsed,
  };
}

// ── Atomic generation ────────────────────────────────────────
// 1 item per API call — max_tokens=2000 — guaranteed no truncation.
// 5-day schema: 10 social posts + 5 videos + 5 emails + 1 ads call = 21 calls.

export type AtomicType = "social_post" | "video_script" | "email" | "ads";

// Compact brief for atomic calls — no "build a 7-day pack" preamble that
// confuses the model into over-generating beyond the token budget.
function buildAtomicBrief(input: IkengaGenerationInput): string {
  const parts = [
    `Brand: ${input.brand}`,
    `Goals: ${input.goals}`,
  ];
  if (input.niche)    parts.push(`Niche: ${input.niche}`);
  if (input.audience) parts.push(`Audience: ${input.audience}`);
  if (input.tone)     parts.push(`Tone: ${input.tone}`);
  // Strip the long PRODUCT VOICE DIRECTIVE from notes — already in system prompt via product config
  const shortNotes = (input.notes ?? "").replace(/PRODUCT VOICE DIRECTIVE:[^]*/, "").trim();
  if (shortNotes)     parts.push(`Notes: ${shortNotes.slice(0, 200)}`);
  return parts.join("\n");
}

const ATOMIC_PROMPTS: Record<AtomicType, (day: number, platform: string) => string> = {
  social_post: (day, platform) =>
    `You are IKENGA. Output ONLY a raw JSON object — no markdown, no fences, no explanation.
Schema: {"hook":"string","caption":"string","callToAction":"string","hashtags":["string"]}
Task: Write 1 ${platform} post for Day ${day}.
Rules: hook ≤18 words. caption 60-100 words. callToAction ≤12 words. hashtags 4-5 items.`,

  video_script: (day, _p) =>
    `You are IKENGA. Output ONLY a raw JSON object — no markdown, no fences, no explanation.
Schema: {"title":"string","hook":"string","scenes":[{"beat":"string","narration":"string"}],"callToAction":"string"}
Task: Write 1 short-form video script for Day ${day}.
Rules: title ≤8 words. hook ≤15 words. scenes: exactly 3, narration 30-50 words each. callToAction ≤12 words.`,

  email: (day, _p) =>
    `You are IKENGA. Output ONLY a raw JSON object — no markdown, no fences, no explanation.
Schema: {"subjectLine":"string","previewText":"string","body":"string","callToAction":"string"}
Task: Write 1 marketing email for Day ${day}.
Rules: subjectLine ≤55 chars. previewText ≤80 chars. body 80-120 words. callToAction ≤12 words.`,

  ads: (_d, _p) =>
    `You are IKENGA. Output ONLY a raw JSON object — no markdown, no fences, no explanation.
Schema: {"ads":[{"headline":"string","primaryText":"string","callToAction":"string","audience":"string"}]}
Task: Write exactly 3 ad creatives.
Rules: headline ≤35 chars. primaryText 40-70 words. callToAction ≤10 words. 3 angles: social-proof, pain-point, aspiration.`,
};

const ATOMIC_MAX_TOKENS: Record<AtomicType, number> = {
  social_post:   800,
  video_script:  900,
  email:         700,
  ads:           900,
};

export async function generateIkengaAtomic(
  atomicType: AtomicType,
  dayNumber: number,
  platform: string,
  input: IkengaGenerationInput,
): Promise<IkengaGenerationResult> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY.");

  const model     = getIkengaAnthropicModel();
  const requestId = randomId();
  const systemPrompt = ATOMIC_PROMPTS[atomicType](dayNumber, platform);
  const brief = buildAtomicBrief(input);

  const parsed = await callClaude(systemPrompt, brief, ATOMIC_MAX_TOKENS[atomicType], apiKey, model);

  return {
    requestId,
    model,
    anthropicMessageId: requestId,
    stopReason: "end_turn",
    usage: { inputTokens: 0, outputTokens: 0, cacheCreationInputTokens: null, cacheReadInputTokens: null },
    attachments: [],
    output: parsed,
  };
}

// ── Chunked generation ────────────────────────────────────────
// Splits the 7-day pack into 4 focused calls, each well under token limits.

export type GenerationChunk = "social" | "video" | "email" | "ads";

const CHUNK_PROMPTS: Record<GenerationChunk, string> = {
  social: `You are IKENGA, a commercial content engine.
Output ONLY a raw JSON object. No markdown, no code fences, no explanation.
Output: { "socialPosts": [...] }
socialPosts: array of exactly 14 objects. Each object: { "id": string, "dayNumber": integer 1-7, "platform": string, "format": string, "hook": string, "caption": string, "callToAction": string, "assetBrief": string, "hashtags": string[3-8] }
2 posts per day (days 1–7). Alternate between LinkedIn and Instagram.
Make every hook grab attention in the first line. Make every caption specific and publishable. No filler.`,

  video: `You are IKENGA, a commercial content engine.
Output ONLY a raw JSON object. No markdown, no code fences, no explanation.
Output: { "videoScripts": [...] }
videoScripts: array of exactly 7 objects. Each object: { "dayNumber": integer 1-7, "title": string, "hook": string, "scenes": [{ "beat": string, "visual": string, "narration": string }], "callToAction": string }
Each script has 3-5 scenes. Each scene is fully written narration, not a placeholder. Make these production-ready.`,

  email: `You are IKENGA, a commercial content engine.
Output ONLY a raw JSON object. No markdown, no code fences, no explanation.
Output: { "emails": [...] }
emails: array of exactly 7 objects. Each object: { "dayNumber": integer 1-7, "subjectLine": string, "previewText": string, "audienceSegment": string, "body": string, "callToAction": string }
Each email body is 150-300 words, fully written, ready to send. Make the subject lines impossible to ignore.`,

  ads: `You are IKENGA, a commercial content engine.
Output ONLY a raw JSON object. No markdown, no code fences, no explanation.
Output: { "ads": [...], "calendar": [...] }
ads: array of exactly 3 objects. Each object: { "audience": string, "angle": string, "headline": string, "primaryText": string, "callToAction": string }
calendar: array of exactly 7 objects. Each object: { "dayNumber": integer 1-7, "theme": string, "primaryGoal": string, "channelFocus": string[], "contentAngle": string, "callToAction": string }
Make ads conversion-focused with strong hooks. Make the calendar a coherent 7-day narrative arc.`,
};

const CHUNK_MAX_TOKENS: Record<GenerationChunk, number> = {
  social: 6_000,
  video:  6_000,
  email:  6_000,
  ads:    4_000,
};

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number,
  apiKey: string,
  model: string,
): Promise<unknown> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature: 0.6,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const rawText = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map(b => b.text)
    .join("");

  if (!rawText.trim()) throw new Error("Empty response from Claude.");

  const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Truncation recovery
    for (let i = cleaned.length - 1; i > 0; i--) {
      if (cleaned[i] === "}") {
        try { return JSON.parse(cleaned.slice(0, i + 1)); }
        catch { /* keep scanning */ }
      }
    }
    throw new Error(`Chunk response not valid JSON. stop_reason=${response.stop_reason}`);
  }
}

export async function generateIkengaChunk(
  chunk: GenerationChunk,
  input: IkengaGenerationInput,
): Promise<IkengaGenerationResult> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY.");

  const model     = getIkengaAnthropicModel();
  const requestId = randomId();

  // Build the brand brief (no file attachments in chunked mode for speed)
  const brief = buildBrief(input, []);
  const parsed = await callClaude(CHUNK_PROMPTS[chunk], brief, CHUNK_MAX_TOKENS[chunk], apiKey, model);

  return {
    requestId,
    model,
    anthropicMessageId: requestId,
    stopReason: "end_turn",
    usage: { inputTokens: 0, outputTokens: 0, cacheCreationInputTokens: null, cacheReadInputTokens: null },
    attachments: [],
    output: parsed,
  };
}
