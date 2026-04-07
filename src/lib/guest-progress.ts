const STORAGE_KEY = "cognizo-guest-wheel-sessions";

/** Fired when guest session count changes (same window). */
export const GUEST_PROGRESS_EVENT = "cognizo-guest-progress";

export function getGuestWheelSessions(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return 0;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

/** Increment after a completed wheel cycle (guest only). Returns new total. */
export function incrementGuestWheelSessions(): number {
  const next = getGuestWheelSessions() + 1;
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    /* ignore quota */
  }
  try {
    window.dispatchEvent(new CustomEvent(GUEST_PROGRESS_EVENT, { detail: { count: next } }));
  } catch {
    /* ignore */
  }
  return next;
}
