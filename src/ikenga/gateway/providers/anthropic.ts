import type { GatewayRequest, GatewayResponse } from "../router";

const BASE_URL = "https://api.anthropic.com/v1";

export async function callAnthropic(req: GatewayRequest): Promise<GatewayResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const model = req.model ?? "claude-sonnet-4-6";

  const body = {
    model,
    max_tokens: req.maxTokens ?? 2048,
    system: req.system,
    messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: req.temperature ?? 0.7,
  };

  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";

  return {
    provider: "anthropic",
    model,
    content: text,
    usage: {
      inputTokens: data.usage?.input_tokens ?? 0,
      outputTokens: data.usage?.output_tokens ?? 0,
    },
    raw: data,
  };
}

export async function* streamAnthropic(req: GatewayRequest): AsyncGenerator<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const model = req.model ?? "claude-sonnet-4-6";

  const body = {
    model,
    max_tokens: req.maxTokens ?? 2048,
    system: req.system,
    messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: req.temperature ?? 0.7,
    stream: true,
  };

  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) throw new Error(`Anthropic stream error ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      const json = line.slice(6).trim();
      if (json === "[DONE]") return;
      try {
        const ev = JSON.parse(json);
        const delta = ev.delta?.text;
        if (delta) yield delta;
      } catch {
        // skip malformed SSE
      }
    }
  }
}
