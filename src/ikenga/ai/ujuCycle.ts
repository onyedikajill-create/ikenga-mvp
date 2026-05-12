// ============================================================
// IKENGA v5 — UJU CYCLE v5 ENGINE
// 10-AI panel across 6 stages. Fully pluggable, type-safe.
// ============================================================

import { gatewayCall } from "../gateway/router";
import type { GatewayMessage } from "../gateway/router";
import {
  STAGE_SEQUENCE,
  STAGE_MODELS,
  UJU_MODELS,
  type UJUStage,
  type UJUModelId,
} from "./models";

// ── Types ─────────────────────────────────────────────────────

export interface UJUInput {
  query: string;
  context?: string;
  domain?: string;
  userId?: string;
  sessionId?: string;
}

export interface UJUModelOutput {
  modelId: UJUModelId;
  modelName: string;
  role: string;
  stage: UJUStage;
  content: string;
  durationMs: number;
  provider: string;
  icon: string;
  color: string;
}

export interface UJUStageResult {
  stage: UJUStage;
  models: UJUModelOutput[];
  combinedOutput: string;
  durationMs: number;
}

export interface UJUCycleResult {
  sessionId: string;
  query: string;
  stages: UJUStageResult[];
  finalAnswer: string;
  totalDurationMs: number;
  modelCount: number;
  completedAt: string;
}

// ── Helpers ───────────────────────────────────────────────────

function buildStageContext(
  query: string,
  priorStages: UJUStageResult[]
): string {
  if (priorStages.length === 0) return `USER QUERY:\n${query}`;

  const chain = priorStages
    .map((s) => `## ${s.stage.toUpperCase()} STAGE\n${s.combinedOutput}`)
    .join("\n\n");

  return `USER QUERY:\n${query}\n\n--- INTELLIGENCE CHAIN ---\n${chain}`;
}

async function runModel(
  modelId: UJUModelId,
  userMessage: string
): Promise<UJUModelOutput> {
  const model = UJU_MODELS[modelId];
  const t0 = Date.now();

  const messages: GatewayMessage[] = [{ role: "user", content: userMessage }];

  let content: string;
  try {
    const res = await gatewayCall({
      messages,
      system:   model.systemDirective,
      task:     model.task,
      provider: model.provider,
      maxTokens: 1500,
    });
    content = res.content;
  } catch (err) {
    content = `[${model.id} unavailable: ${err instanceof Error ? err.message : "error"}]`;
  }

  return {
    modelId:   model.id,
    modelName: model.name,
    role:      model.role,
    stage:     model.stage,
    content,
    durationMs: Date.now() - t0,
    provider:  model.provider,
    icon:      model.icon,
    color:     model.color,
  };
}

// ── Main UJU Cycle runner ─────────────────────────────────────

export async function runUJUCycle(input: UJUInput): Promise<UJUCycleResult> {
  const sessionId = input.sessionId ?? crypto.randomUUID();
  const t0 = Date.now();
  const stageResults: UJUStageResult[] = [];

  for (const stage of STAGE_SEQUENCE) {
    const modelIds = STAGE_MODELS[stage];
    const stageContext = buildStageContext(input.query, stageResults);
    const stageT0 = Date.now();

    // Run models within a stage in parallel where safe
    const outputs = await Promise.all(
      modelIds.map((id) => runModel(id, stageContext))
    );

    const combinedOutput = outputs
      .map((o) => `### ${o.icon} ${o.modelName} (${o.role})\n${o.content}`)
      .join("\n\n");

    stageResults.push({
      stage,
      models: outputs,
      combinedOutput,
      durationMs: Date.now() - stageT0,
    });
  }

  // Final answer is the ZAI_FINAL output from the explain stage
  const explainStage = stageResults.find((s) => s.stage === "explain");
  const zaiOutput    = explainStage?.models.find((m) => m.modelId === "ZAI_FINAL");
  const finalAnswer  = zaiOutput?.content ?? explainStage?.combinedOutput ?? "";

  return {
    sessionId,
    query:          input.query,
    stages:         stageResults,
    finalAnswer,
    totalDurationMs: Date.now() - t0,
    modelCount:     stageResults.reduce((n, s) => n + s.models.length, 0),
    completedAt:    new Date().toISOString(),
  };
}

// ── Streaming variant ─────────────────────────────────────────

export type UJUProgressEvent =
  | { type: "stage_start";  stage: UJUStage; models: string[] }
  | { type: "model_done";   result: UJUModelOutput }
  | { type: "stage_done";   result: UJUStageResult }
  | { type: "cycle_done";   result: UJUCycleResult };

export async function* runUJUCycleStreaming(
  input: UJUInput
): AsyncGenerator<UJUProgressEvent> {
  const sessionId = input.sessionId ?? crypto.randomUUID();
  const t0 = Date.now();
  const stageResults: UJUStageResult[] = [];

  for (const stage of STAGE_SEQUENCE) {
    const modelIds = STAGE_MODELS[stage];
    yield { type: "stage_start", stage, models: modelIds };

    const stageContext = buildStageContext(input.query, stageResults);
    const stageT0 = Date.now();
    const outputs: UJUModelOutput[] = [];

    for (const modelId of modelIds) {
      const output = await runModel(modelId, stageContext);
      outputs.push(output);
      yield { type: "model_done", result: output };
    }

    const combinedOutput = outputs
      .map((o) => `### ${o.icon} ${o.modelName} (${o.role})\n${o.content}`)
      .join("\n\n");

    const stageResult: UJUStageResult = {
      stage,
      models:         outputs,
      combinedOutput,
      durationMs:     Date.now() - stageT0,
    };
    stageResults.push(stageResult);
    yield { type: "stage_done", result: stageResult };
  }

  const explainStage = stageResults.find((s) => s.stage === "explain");
  const zaiOutput    = explainStage?.models.find((m) => m.modelId === "ZAI_FINAL");
  const finalAnswer  = zaiOutput?.content ?? explainStage?.combinedOutput ?? "";

  const cycleResult: UJUCycleResult = {
    sessionId,
    query:          input.query,
    stages:         stageResults,
    finalAnswer,
    totalDurationMs: Date.now() - t0,
    modelCount:     stageResults.reduce((n, s) => n + s.models.length, 0),
    completedAt:    new Date().toISOString(),
  };

  yield { type: "cycle_done", result: cycleResult };
}
