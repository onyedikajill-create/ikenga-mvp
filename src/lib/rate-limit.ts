// ============================================================
// IKENGA — Per-user rate limiting + circuit breaker
//
// Rate limits (per minute, per day):
//   free:       3/min,   50/day
//   pro:       20/min,  500/day
//   enterprise: 100/min, 5000/day
//
// Circuit breaker:
//   Opens when error count > 50 in a 5-minute window.
//   Auto-resets after 2 minutes.
// ============================================================

// ── Rate limit config ─────────────────────────────────────────

export type RateLimitTier = "free" | "pro" | "enterprise";

const RATE_LIMITS: Record<RateLimitTier, { perMin: number; perDay: number }> = {
  free:       { perMin: 3,   perDay: 50   },
  pro:        { perMin: 20,  perDay: 500  },
  enterprise: { perMin: 100, perDay: 5000 },
};

// In-memory store — resets on cold start (Vercel function restart).
// Sufficient for rate limiting; no persistence required.
const minuteCounters = new Map<string, { count: number; resetAt: number }>();
const dayCounters    = new Map<string, { count: number; resetAt: number }>();

function nowMs() { return Date.now(); }

/**
 * Check and increment rate limit counters for a given user + tier.
 * Returns `{ allowed: true }` or `{ allowed: false, reason, retryAfterMs }`.
 */
export function checkRateLimit(
  userId: string,
  tier:   RateLimitTier,
): { allowed: boolean; reason?: string; retryAfterMs?: number } {
  const limits = RATE_LIMITS[tier] ?? RATE_LIMITS.free;
  const now    = nowMs();

  // ── Per-minute check ──────────────────────────────────────────
  const minKey = `${userId}:min`;
  const minRec = minuteCounters.get(minKey);
  if (!minRec || now > minRec.resetAt) {
    minuteCounters.set(minKey, { count: 1, resetAt: now + 60_000 });
  } else {
    if (minRec.count >= limits.perMin) {
      return { allowed: false, reason: `Rate limit: ${limits.perMin} requests/minute on ${tier} tier.`, retryAfterMs: minRec.resetAt - now };
    }
    minRec.count++;
  }

  // ── Per-day check ─────────────────────────────────────────────
  const dayKey = `${userId}:day`;
  const dayRec = dayCounters.get(dayKey);
  const midnightMs = new Date().setHours(24, 0, 0, 0);
  if (!dayRec || now > dayRec.resetAt) {
    dayCounters.set(dayKey, { count: 1, resetAt: midnightMs });
  } else {
    if (dayRec.count >= limits.perDay) {
      return { allowed: false, reason: `Daily limit: ${limits.perDay} requests/day on ${tier} tier.`, retryAfterMs: dayRec.resetAt - now };
    }
    dayRec.count++;
  }

  return { allowed: true };
}

// ── Circuit breaker ───────────────────────────────────────────

const CB_WINDOW_MS  = 5 * 60_000;   // 5-minute error window
const CB_THRESHOLD  = 50;           // errors before opening
const CB_RESET_MS   = 2 * 60_000;   // auto-reset after 2 minutes

interface CbState {
  errorCount: number;
  windowStart: number;
  openedAt:    number | null;
}

const cbState: CbState = {
  errorCount:  0,
  windowStart: Date.now(),
  openedAt:    null,
};

/**
 * Call when a generation request fails.
 */
export function recordError(): void {
  const now = Date.now();
  if (now - cbState.windowStart > CB_WINDOW_MS) {
    // Reset window
    cbState.errorCount  = 1;
    cbState.windowStart = now;
  } else {
    cbState.errorCount++;
    if (cbState.errorCount > CB_THRESHOLD && !cbState.openedAt) {
      cbState.openedAt = now;
      console.warn(`[IKENGA] Circuit breaker OPEN — ${cbState.errorCount} errors in 5 min`);
    }
  }
}

/**
 * Returns true when the circuit is open (too many recent errors).
 * Auto-resets after CB_RESET_MS.
 */
export function isCircuitOpen(): boolean {
  if (!cbState.openedAt) return false;
  if (Date.now() - cbState.openedAt > CB_RESET_MS) {
    // Auto-reset
    cbState.openedAt    = null;
    cbState.errorCount  = 0;
    cbState.windowStart = Date.now();
    console.info("[IKENGA] Circuit breaker CLOSED — auto-reset");
    return false;
  }
  return true;
}
