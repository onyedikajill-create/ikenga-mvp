// ============================================================
// IKENGA — Client-side usage tracking (localStorage)
// Tracks free query count to trigger upgrade prompts.
// ============================================================

const KEY = "ik_free_queries";
const UPGRADE_THRESHOLD = 3;

export function getFreeQueryCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(KEY) ?? "0", 10);
}

export function incrementFreeQueryCount(): number {
  const next = getFreeQueryCount() + 1;
  localStorage.setItem(KEY, String(next));
  return next;
}

export function shouldShowUpgradePrompt(): boolean {
  return getFreeQueryCount() >= UPGRADE_THRESHOLD;
}

export function resetFreeQueryCount(): void {
  localStorage.removeItem(KEY);
}
