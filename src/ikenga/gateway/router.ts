// ============================================================
// IKENGA v5 — SOVEREIGN AI GATEWAY
// Unified router across Anthropic, Google, Jules, Mock.
// OpenAI-compatible request/response interface.
// ============================================================

export type GatewayProvider = "anthropic" | "google" | "jules" | "mock";

export type GatewayTaskType =
  | "reasoning"   // Tyler Wise, deep analysis → Anthropic
  | "coding"      // Technical generation → Jules
  | "content"     // UJU Cycle content → Anthropic / Google
  | "fast"        // Speed validation, compression → Google Flash
  | "critique"    // Adversarial → Anthropic Sonnet
  | "synthesis"   // Multi-model synthesis → Google Pro
  | "ethics"      // Culture & ethics guard → Anthropic
  | "ingest"
  | "compress"
  | "lensShift"
  | "weave"
  | "critic"
  | "explain"
  | "default";

export interface GatewayMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GatewayRequest {
  messages: GatewayMessage[];
  system?: string;
  model?: string;
  task?: GatewayTaskType;
  provider?: GatewayProvider;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  costProfile?: "free" | "balanced" | "premium";
}

export interface GatewayResponse {
  provider: GatewayProvider;
  model: string;
  content: string;
  usage: { inputTokens: number; outputTokens: number };
  raw?: unknown;
}

// Task → preferred provider routing table
const TASK_ROUTING: Record<GatewayTaskType, GatewayProvider> = {
  reasoning:  "anthropic",
  coding:     "jules",
  content:    "anthropic",
  fast:       "google",
  critique:   "anthropic",
  synthesis:  "google",
  ethics:     "anthropic",
  ingest:     "google",
  compress:   "google",
  lensShift:  "anthropic",
  weave:      "anthropic",
  critic:     "anthropic",
  explain:    "anthropic",
  default:    "anthropic",
};

// Task → recommended model mapping
const TASK_MODELS: Partial<Record<GatewayTaskType, Record<GatewayProvider, string>>> = {
  fast:      { google: "gemini-2.0-flash", anthropic: "claude-haiku-4-5-20251001", jules: "jules-v1", mock: "mock-v1" },
  reasoning: { anthropic: "claude-sonnet-4-6", google: "gemini-2.0-pro", jules: "jules-v1", mock: "mock-v1" },
  coding:    { jules: "jules-v1", anthropic: "claude-sonnet-4-6", google: "gemini-2.0-pro", mock: "mock-v1" },
  ethics:    { anthropic: "claude-opus-4-6", google: "gemini-2.0-pro", jules: "jules-v1", mock: "mock-v1" },
};

function resolveProvider(req: GatewayRequest): GatewayProvider {
  if (process.env.GATEWAY_MODE === "mock") return "mock";
  if (req.provider) return req.provider;
  if (req.costProfile === "free") return "google";
  return TASK_ROUTING[req.task ?? "default"] ?? "anthropic";
}

function resolveModel(req: GatewayRequest, provider: GatewayProvider): string {
  if (req.model) return req.model;
  const taskModels = TASK_MODELS[req.task ?? "default"];
  if (taskModels) return taskModels[provider] ?? "claude-sonnet-4-6";
  return "claude-sonnet-4-6";
}

const MAX_RETRIES = 2;

export async function gatewayCall(req: GatewayRequest): Promise<GatewayResponse> {
  const { callAnthropic } = await import("./providers/anthropic");
  const { callGoogle }    = await import("./providers/google");
  const { callJules }     = await import("./providers/jules");
  const { callMock }      = await import("./providers/mock");

  const provider = resolveProvider(req);
  const model    = resolveModel(req, provider);
  const enriched = { ...req, model };

  const caller: Record<GatewayProvider, () => Promise<GatewayResponse>> = {
    anthropic: () => callAnthropic(enriched),
    google:    () => callGoogle(enriched),
    jules:     () => callJules(enriched),
    mock:      () => callMock(enriched),
  };

  let lastError: Error | undefined;
  const providerOrder: GatewayProvider[] = [provider, "anthropic", "google", "mock"];
  const tried = new Set<GatewayProvider>();

  for (const p of providerOrder) {
    if (tried.has(p)) continue;
    tried.add(p);

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await caller[p]();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < MAX_RETRIES) await sleep(500 * (attempt + 1));
      }
    }
  }

  throw lastError ?? new Error("All gateway providers failed");
}

export async function* gatewayStream(req: GatewayRequest): AsyncGenerator<string> {
  const { streamAnthropic } = await import("./providers/anthropic");
  const { streamGoogle }    = await import("./providers/google");
  const { streamMock }      = await import("./providers/mock");

  const provider = resolveProvider(req);

  if (provider === "anthropic") yield* streamAnthropic(req);
  else if (provider === "google") yield* streamGoogle(req);
  else yield* streamMock(req);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
