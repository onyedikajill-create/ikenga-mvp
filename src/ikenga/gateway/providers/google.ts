import type { GatewayRequest, GatewayResponse } from "../router";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export async function callGoogle(req: GatewayRequest): Promise<GatewayResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY not set");

  const model = req.model ?? "gemini-2.0-flash";

  const contents = req.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const systemInstruction = req.system
    ? { parts: [{ text: req.system }] }
    : undefined;

  const body = {
    contents,
    systemInstruction,
    generationConfig: {
      maxOutputTokens: req.maxTokens ?? 2048,
      temperature: req.temperature ?? 0.7,
    },
  };

  const res = await fetch(
    `${BASE_URL}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google AI error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return {
    provider: "google",
    model,
    content: text,
    usage: {
      inputTokens: data.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
    },
    raw: data,
  };
}

export async function* streamGoogle(req: GatewayRequest): AsyncGenerator<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY not set");

  const model = req.model ?? "gemini-2.0-flash";

  const contents = req.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    contents,
    systemInstruction: req.system ? { parts: [{ text: req.system }] } : undefined,
    generationConfig: { maxOutputTokens: req.maxTokens ?? 2048, temperature: req.temperature ?? 0.7 },
  };

  const res = await fetch(
    `${BASE_URL}/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok || !res.body) throw new Error(`Google stream error ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(6));
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) yield text;
      } catch {
        // skip
      }
    }
  }
}
