# IKENGA v5 — Sovereign Intelligence Platform
## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         IKENGA v5 — FRONTEND (Next.js 16)                      │
│                                                                                  │
│  app/(public)          app/(app)              app/(admin)                        │
│  ┌──────────┐  ┌──────────────────────────┐  ┌────────────────────────────┐     │
│  │ Landing  │  │  /uju/page.tsx            │  │  /admin/benchmark/page.tsx │     │
│  │ /page.tsx│  │  UJU Cycle v5 UI          │  │  Benchmark Dashboard       │     │
│  │          │  │  • 10 model live feed     │  │  • Gap analysis            │     │
│  │ /login   │  │  • Stage progress pills   │  │  • Priority feature list   │     │
│  │ /pay     │  │  • Final answer panel     │  │  • App capability map      │     │
│  └──────────┘  │  • Feedback → memory      │  ├────────────────────────────┤     │
│                ├──────────────────────────┤  │  /admin/analytics          │     │
│                │  /dashboard/page.tsx      │  │  /admin/payments           │     │
│                │  /studio                  │  └────────────────────────────┘     │
│                │  /learning                │                                      │
│                │  /community               │                                      │
│                └──────────────────────────┘                                      │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │ HTTP / SSE
┌──────────────────────────────────▼──────────────────────────────────────────────┐
│                            API ROUTES (Next.js App Router)                       │
│                                                                                  │
│  /api/ai              /api/uju/run        /api/orchestrate    /api/agents/run    │
│  Sovereign Gateway    UJU Cycle v5        Tyler Wise          Multi-Agent        │
│  POST → GatewayCall   POST → Streaming    POST → TylerWise    POST → Engine      │
│                       SSE events          Protocol            Orchestration      │
│                                                                                  │
│  /api/memory/log      /api/memory/insights                                       │
│  POST → logMemory     GET → getInsights + getEntries                             │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────────┐
│                         CORE INTELLIGENCE LAYER (src/ikenga/)                   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      SOVEREIGN AI GATEWAY                                │    │
│  │                    src/ikenga/gateway/router.ts                          │    │
│  │                                                                          │    │
│  │  GatewayRequest → resolveProvider() → resolveModel() → retry loop       │    │
│  │                                                                          │    │
│  │  providers/anthropic.ts   providers/google.ts   providers/jules.ts      │    │
│  │  providers/mock.ts        (streaming + non-streaming for each)           │    │
│  │                                                                          │    │
│  │  Task routing:                                                           │    │
│  │  reasoning/ethics  → Anthropic Claude (Sonnet/Opus)                      │    │
│  │  coding            → Jules                                               │    │
│  │  fast/compress     → Google Gemini Flash                                 │    │
│  │  synthesis         → Google Gemini Pro                                   │    │
│  └──────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────────────┐ │
│  │   10-AI UJU CYCLE v5     │  │      TYLER WISE PROTOCOL                     │ │
│  │   src/ikenga/ai/         │  │      src/ikenga/orchestration/tylerWise.ts   │ │
│  │                          │  │                                              │ │
│  │  models.ts               │  │  Step 1: Primary    → LLAMA_SYNTH            │ │
│  │  ┌─────────────────────┐ │  │  Step 2: Attack     → DEEPSEEK_CRITIC        │ │
│  │  │ GEMMA_SIGNAL ⚡      │ │  │  Step 3: Verify     → 4 models parallel     │ │
│  │  │ LLAMA_SYNTH  🧬      │ │  │  Step 4: Compress   → PHI_COMPRESS          │ │
│  │  │ QWEN_STRUCT  🏗      │ │  │  Step 5: Risk-Final → ZAI_FINAL +           │ │
│  │  │ DEEPSEEK_CRIT⚔️     │ │  │                       GEMMA_GUARD           │ │
│  │  │ MISTRAL_LENS 🔭      │ │  │  Step 6: Memory log → self-improvement      │ │
│  │  │ PHI_COMPRESS 💎      │ │  │                                              │ │
│  │  │ CEREBRAS_VAL ✅      │ │  │  Output: TylerWiseResult {                  │ │
│  │  │ GROQ_EXPAND  🚀      │ │  │    finalAnswer, riskRating,                │ │
│  │  │ GEMMA_GUARD  🛡      │ │  │    ethicsClearance, confidence }            │ │
│  │  │ ZAI_FINAL    👑      │ │  └──────────────────────────────────────────────┘ │
│  │  └─────────────────────┘ │                                                  │
│  │                          │  ┌──────────────────────────────────────────────┐ │
│  │  ujuCycle.ts             │  │      MULTI-AGENT ENGINE                      │ │
│  │  6 stages in sequence:   │  │      src/ikenga/orchestration/               │ │
│  │  ingest → compress →     │  │                                              │ │
│  │  lensShift → weave →     │  │  agents.ts: 7 agents                        │ │
│  │  critic → explain        │  │  ┌──────────────┐  ┌──────────────┐         │ │
│  │                          │  │  │StrategistAgent│  │ResearchAgent │         │ │
│  │  ujuRunner.ts            │  │  ├──────────────┤  ├──────────────┤         │ │
│  │  Streaming SSE events:   │  │  │  CriticAgent  │  │Synthesizer   │         │ │
│  │  stage_start, model_done │  │  ├──────────────┤  ├──────────────┤         │ │
│  │  stage_done, cycle_done  │  │  │ExplainerAgent │  │BenchmarkAgent│         │ │
│  └──────────────────────────┘  │  └──────────────┘  └──────────────┘         │ │
│                                │  GovernanceAgent                             │ │
│                                │                                              │ │
│                                │  policies.ts: TaskPolicy per task type       │ │
│                                │  engine.ts:   sequential agent graph runner  │ │
│                                └──────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────────────┐ │
│  │   MEMORY ENGINE          │  │      BENCHMARK ENGINE                        │ │
│  │   src/ikenga/memory/     │  │      src/ikenga/benchmark/                   │ │
│  │                          │  │                                              │ │
│  │  types.ts                │  │  apps.ts                                    │ │
│  │  • successMemory         │  │  10 apps: TikTok, Instagram, YouTube,        │ │
│  │  • failureMemory         │  │  ChatGPT, Duolingo, Notion, Canva,           │ │
│  │  • correctionMemory      │  │  Spotify, Uber, WeChat                       │ │
│  │  • preferenceMemory      │  │  Each has: capabilities, growthLoops,        │ │
│  │  • patternMemory         │  │  uxPrimitives, ikengaMapping                 │ │
│  │                          │  │                                              │ │
│  │  store.ts                │  │  engine.ts                                  │ │
│  │  • logMemory()           │  │  • generateBenchmarkReport()                 │ │
│  │  • getMemoryEntries()    │  │  • CapabilityGap analysis                   │ │
│  │  • getMemoryInsights()   │  │  • PriorityFeature ranking                  │ │
│  │  • getPreferences()      │  │  • coverageScore (0-100)                    │ │
│  │  Backed: Supabase / RAM  │  │                                              │ │
│  │                          │  │  admin/benchmark/page.tsx                   │ │
│  │  strategies.ts           │  │  • Gap tab, Features tab, Apps tab          │ │
│  │  • deriveModelPrefs()    │  └──────────────────────────────────────────────┘ │
│  │  • deriveDomainPatterns()│                                                  │
│  │  • deriveFailureClusters │                                                  │
│  │  • deriveSuccessPatterns │                                                  │
│  └──────────────────────────┘                                                  │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────────┐
│                         EXTERNAL PROVIDERS                                       │
│                                                                                  │
│  ┌─────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │  Anthropic Claude   │  │  Google AI (Gemini)   │  │  Jules               │   │
│  │  • claude-opus-4-6  │  │  • gemini-2.0-flash   │  │  • jules-v1 (coding) │   │
│  │  • claude-sonnet-4-6│  │  • gemini-2.0-pro     │  │  OpenAI-compat API   │   │
│  │  • claude-haiku-4-5 │  │  Streaming: SSE       │  └──────────────────────┘   │
│  │  Streaming: SSE     │  └──────────────────────┘                              │
│  └─────────────────────┘                            ┌──────────────────────┐    │
│                                                      │  Mock Provider       │    │
│  ┌──────────────────────────────────────────────┐   │  GATEWAY_MODE=mock   │    │
│  │  Supabase (PostgreSQL)                        │   │  Dev / CI safe       │    │
│  │  • memory_entries table                       │   └──────────────────────┘    │
│  │  • All existing platform tables               │                               │
│  └──────────────────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### UJU Cycle v5 — Streaming Flow

```
User → POST /api/uju/run { query, stream: true }
  → runUJUCycleStreaming(input)
    → for each stage in [ingest, compress, lensShift, weave, critic, explain]:
        emit: { type: "stage_start", stage, models }
        → for each model in STAGE_MODELS[stage]:
            → gatewayCall({ messages, system: model.systemDirective, task, provider })
              → resolveProvider() → callAnthropic / callGoogle / callMock
            emit: { type: "model_done", result: UJUModelOutput }
        emit: { type: "stage_done", result: UJUStageResult }
    emit: { type: "cycle_done", result: UJUCycleResult }
  → SSE → Client (app/uju/page.tsx) → live render each stage/model
  → On cycle_done → fire-and-forget → POST /api/memory/log
```

### Tyler Wise Protocol — Adversarial Flow

```
User → POST /api/orchestrate { question, context }
  → runTylerWise(input)
    → Step 1: LLAMA_SYNTH.generate(question) → primaryAnswer
    → Step 2: DEEPSEEK_CRITIC.attack(primaryAnswer) → challenges
    → Step 3: [parallel] GEMMA_SIGNAL + QWEN_STRUCT + MISTRAL_LENS + ZAI_FINAL
              → verificationConsensus
    → Step 4: PHI_COMPRESS.distil(full chain) → compressedCore
    → Step 5: [parallel] ZAI_FINAL.finalAnswer + GEMMA_GUARD.ethicsCheck
    → extract riskRating, ethicsClearance
    → return TylerWiseResult
```

### Memory Self-Improvement Loop

```
Every UJU / Tyler Wise / Agent run:
  → logMemory({ type, source, query, output, score, modelIds })
    → Supabase memory_entries INSERT (fallback: in-process RAM)

GET /api/memory/insights:
  → getMemoryEntries() → deriveInsights()
    → deriveModelPreferences() → which models → positive outcomes
    → deriveDomainPatterns()   → which domains → highest success rate
    → deriveFailureClusters()  → recurring failure tags
    → deriveSuccessPatterns()  → sources with best outcomes
  → return MemoryInsight[] (ranked by confidence)

Future run enhancement:
  → getPreferences(userId)
    → preferredModels, topDomains, avoidPatterns, promptHints
  → inject into gateway request to bias routing decisions
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes (live) | Anthropic Claude API key |
| `GOOGLE_API_KEY` | Recommended | Google AI Studio / Gemini key |
| `JULES_API_KEY` | Optional | Jules coding agent key |
| `JULES_BASE_URL` | Optional | Jules API base URL (default: google.com) |
| `GATEWAY_MODE` | Optional | `mock` for dev/CI, `live` for production |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role (server-side only) |

---

## Deployment Checklist — Vercel

### Pre-deploy
- [ ] Set all environment variables in Vercel project settings
- [ ] Set `GATEWAY_MODE=live` in production
- [ ] Run `npm run build` locally — confirm zero TS errors
- [ ] Set `maxDuration = 300` is supported on your Vercel plan (Pro+)

### Database
- [ ] Run `src/ikenga/db/platform_schema.sql` in Supabase
- [ ] Create `memory_entries` table (see schema below)
- [ ] Enable Row Level Security on all tables
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is server-only (never exposed to client)

### Performance
- [ ] Enable Vercel Edge Cache for `/api/memory/insights` (read-heavy)
- [ ] Set Vercel Function region to `lhr1` (London) for UK users
- [ ] Confirm streaming routes use `runtime = "nodejs"` (Edge does not support streams well)

### Monitoring
- [ ] Connect Vercel Analytics
- [ ] Set up Vercel Speed Insights on key pages
- [ ] Add error alerting for `/api/uju/run` failures (critical path)

### Security
- [ ] Confirm no API keys in client-side code
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` only in server routes
- [ ] Add rate limiting on `/api/uju/run` and `/api/orchestrate` (consider Upstash Redis)

---

## Memory Table Schema (Supabase)

```sql
CREATE TABLE memory_entries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         TEXT NOT NULL,
  source       TEXT NOT NULL,
  session_id   TEXT,
  user_id      TEXT,
  query        TEXT NOT NULL,
  output       TEXT NOT NULL,
  feedback     TEXT,
  correction   TEXT,
  model_ids    TEXT[],
  domain       TEXT,
  tags         TEXT[] DEFAULT '{}',
  score        FLOAT DEFAULT 0.7,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_memory_user    ON memory_entries(user_id);
CREATE INDEX idx_memory_type    ON memory_entries(type);
CREATE INDEX idx_memory_source  ON memory_entries(source);
CREATE INDEX idx_memory_created ON memory_entries(created_at DESC);
```
