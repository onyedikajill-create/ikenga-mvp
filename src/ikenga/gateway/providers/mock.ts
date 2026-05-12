import type { GatewayRequest, GatewayResponse } from "../router";

const MOCK_RESPONSES: Record<string, string> = {
  ingest: "MOCK: Signal extracted. Key themes identified: sovereignty, intelligence, growth.",
  compress: "MOCK: Compressed insight — core principle: build systems that outlast their creators.",
  lensShift: "MOCK: Alternative frame — view this through the lens of cultural capital, not financial capital.",
  weave: "MOCK: Synthesized narrative: the pattern reveals a compounding advantage in trust-based markets.",
  critic: "MOCK: Adversarial challenge — assumption #1 is unvalidated. Consider the counter-case.",
  explain: "MOCK: Plain language summary — this works because of network effects and emotional resonance.",
  default: "MOCK: Intelligence layer active. This is a simulated response for development mode.",
};

export async function callMock(req: GatewayRequest): Promise<GatewayResponse> {
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

  const task = req.task ?? "default";
  const content = MOCK_RESPONSES[task] ?? MOCK_RESPONSES.default;

  return {
    provider: "mock",
    model: "mock-v1",
    content: `${content}\n\nInput received: "${req.messages.at(-1)?.content?.slice(0, 80) ?? ""}..."`,
    usage: { inputTokens: 50, outputTokens: 80 },
    raw: { mock: true },
  };
}

export async function* streamMock(req: GatewayRequest): AsyncGenerator<string> {
  const res = await callMock(req);
  const words = res.content.split(" ");
  for (const word of words) {
    await new Promise((r) => setTimeout(r, 30));
    yield word + " ";
  }
}
