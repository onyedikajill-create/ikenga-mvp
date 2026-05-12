// Jules provider — Google's AI coding agent (OpenAI-compatible endpoint)
import type { GatewayRequest, GatewayResponse } from "../router";

const BASE_URL = process.env.JULES_BASE_URL ?? "https://api.jules.google.com/v1";

export async function callJules(req: GatewayRequest): Promise<GatewayResponse> {
  const apiKey = process.env.JULES_API_KEY;
  if (!apiKey) throw new Error("JULES_API_KEY not set");

  const model = req.model ?? "jules-v1";

  const messages = [
    ...(req.system ? [{ role: "system", content: req.system }] : []),
    ...req.messages,
  ];

  const body = {
    model,
    messages,
    max_tokens: req.maxTokens ?? 2048,
    temperature: req.temperature ?? 0.7,
  };

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Jules error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  return {
    provider: "jules",
    model,
    content,
    usage: {
      inputTokens: data.usage?.prompt_tokens ?? 0,
      outputTokens: data.usage?.completion_tokens ?? 0,
    },
    raw: data,
  };
}
