// ============================================================
// IKENGA v5 — TYLER WISE ADVERSARIAL PROTOCOL
//
// A 6-step adversarial + consensus reasoning engine.
// Named after the principle: "Wisdom tested under fire."
//
// Steps:
// 1. Primary Answer      → LLAMA_SYNTH (deep synthesis)
// 2. Adversarial Attack  → DEEPSEEK_CRITIC (stress-test)
// 3. Multi-Model Verify  → GEMMA_SIGNAL, QWEN_STRUCT, MISTRAL_LENS, ZAI_FINAL (parallel)
// 4. Consensus Compress  → PHI_COMPRESS (distil truth)
// 5. Risk-Adjusted Final → ZAI_FINAL + GEMMA_GUARD
// 6. Log to Memory       → self-improvement hook
// ============================================================

import { gatewayCall } from "../gateway/router";
import { UJU_MODELS } from "../ai/models";
import type { TylerWiseInput, TylerWiseResult, TylerWiseStep } from "./types";

async function step(
  stepNum: number,
  stepName: string,
  modelId: keyof typeof UJU_MODELS,
  userMessage: string
): Promise<TylerWiseStep> {
  const model = UJU_MODELS[modelId];
  const t0 = Date.now();

  let content: string;
  try {
    const res = await gatewayCall({
      messages: [{ role: "user", content: userMessage }],
      system:   model.systemDirective,
      task:     model.task,
      provider: model.provider,
      maxTokens: 1800,
    });
    content = res.content;
  } catch (err) {
    content = `[${model.id} error: ${err instanceof Error ? err.message : "unknown"}]`;
  }

  return {
    step:       stepNum,
    name:       stepName,
    model:      model.name,
    content,
    durationMs: Date.now() - t0,
    role:       model.role,
  };
}

function extractRiskRating(text: string): TylerWiseResult["riskRating"] {
  if (/CRITICAL/i.test(text)) return "CRITICAL";
  if (/HIGH/i.test(text))     return "HIGH";
  if (/MEDIUM/i.test(text))   return "MEDIUM";
  return "LOW";
}

function extractEthicsClearance(text: string): TylerWiseResult["ethicsClearance"] {
  if (/BLOCKED/i.test(text))        return "BLOCKED";
  if (/NEEDS_REVISION/i.test(text)) return "NEEDS_REVISION";
  return "CLEARED";
}

function computeConfidence(steps: TylerWiseStep[]): number {
  // Heuristic: longer consensus → higher confidence
  const verifyStep = steps.find((s) => s.name === "Multi-Model Verify");
  if (!verifyStep) return 0.7;
  const len = verifyStep.content.length;
  return Math.min(0.95, 0.6 + len / 10000);
}

export async function runTylerWise(input: TylerWiseInput): Promise<TylerWiseResult> {
  const sessionId = input.sessionId ?? crypto.randomUUID();
  const t0 = Date.now();
  const steps: TylerWiseStep[] = [];

  const baseQuestion = input.context
    ? `QUESTION: ${input.question}\n\nCONTEXT: ${input.context}`
    : `QUESTION: ${input.question}`;

  // ── Step 1: Primary Answer ────────────────────────────────
  const step1 = await step(1, "Primary Answer", "LLAMA_SYNTH", baseQuestion);
  steps.push(step1);

  // ── Step 2: Adversarial Attack ────────────────────────────
  const attackPrompt = `QUESTION: ${input.question}\n\nPRIMARY ANSWER:\n${step1.content}\n\nNow attack this answer. Find every weakness.`;
  const step2 = await step(2, "Adversarial Attack", "DEEPSEEK_CRITIC", attackPrompt);
  steps.push(step2);

  // ── Step 3: Multi-Model Verify (parallel) ─────────────────
  const verifyPrompt = `ORIGINAL QUESTION: ${input.question}\n\nPRIMARY ANSWER:\n${step1.content}\n\nADVERSARIAL CHALLENGES:\n${step2.content}\n\nProvide your independent verification and assessment.`;

  const [signalOut, structOut, lensOut, zaiOut] = await Promise.all([
    step(3, "Multi-Model Verify", "GEMMA_SIGNAL",  verifyPrompt),
    step(3, "Multi-Model Verify", "QWEN_STRUCT",   verifyPrompt),
    step(3, "Multi-Model Verify", "MISTRAL_LENS",  verifyPrompt),
    step(3, "Multi-Model Verify", "ZAI_FINAL",     verifyPrompt),
  ]);

  const verificationConsensus = [
    `SIGNAL: ${signalOut.content}`,
    `STRUCTURE: ${structOut.content}`,
    `LENS: ${lensOut.content}`,
    `ZAI PRE-FINAL: ${zaiOut.content}`,
  ].join("\n\n---\n\n");

  const step3: TylerWiseStep = {
    step:       3,
    name:       "Multi-Model Verify",
    model:      "GEMMA_SIGNAL + QWEN_STRUCT + MISTRAL_LENS + ZAI_FINAL",
    content:    verificationConsensus,
    durationMs: Math.max(signalOut.durationMs, structOut.durationMs, lensOut.durationMs, zaiOut.durationMs),
    role:       "Parallel Verification Panel",
  };
  steps.push(step3);

  // ── Step 4: Consensus Compress ────────────────────────────
  const compressPrompt = `Distil the following full intelligence chain into the highest-density core truth:\n\nQUESTION: ${input.question}\n\nPRIMARY: ${step1.content}\n\nCHALLENGES: ${step2.content}\n\nVERIFICATION: ${verificationConsensus}`;
  const step4 = await step(4, "Consensus Compress", "PHI_COMPRESS", compressPrompt);
  steps.push(step4);

  // ── Step 5: Risk-Adjusted Final (parallel) ────────────────
  const finalPrompt = `QUESTION: ${input.question}\n\nFULL INTELLIGENCE CHAIN:\n\nPrimary: ${step1.content}\n\nChallenges: ${step2.content}\n\nVerification: ${verificationConsensus}\n\nCore: ${step4.content}\n\nProduce the definitive, sovereign final answer.`;
  const guardPrompt = `QUESTION: ${input.question}\n\nFINAL ANSWER CANDIDATE:\n${step4.content}\n\nCheck for cultural integrity and ethical clearance.`;

  const [finalOut, guardOut] = await Promise.all([
    step(5, "Risk-Adjusted Final", "ZAI_FINAL",     finalPrompt),
    step(5, "Ethics Gate",         "GEMMA_GUARD",   guardPrompt),
  ]);

  steps.push(finalOut);
  steps.push(guardOut);

  const riskRating      = extractRiskRating(step2.content + finalOut.content);
  const ethicsClearance = extractEthicsClearance(guardOut.content);

  const finalAnswer = ethicsClearance === "BLOCKED"
    ? `[BLOCKED BY ETHICS GATE]\n\n${guardOut.content}`
    : finalOut.content;

  return {
    sessionId,
    question:              input.question,
    steps,
    primaryAnswer:         step1.content,
    adversarialChallenges: step2.content,
    verificationConsensus,
    compressedCore:        step4.content,
    finalAnswer,
    riskRating,
    ethicsClearance,
    confidence:            computeConfidence(steps),
    durationMs:            Date.now() - t0,
    completedAt:           new Date().toISOString(),
  };
}
