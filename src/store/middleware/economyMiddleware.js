/**
 * economyMiddleware.js — Dynamic shop pricing based on purchase history
 *
 * Intercepts economy/recordPurchase actions and adjusts per-item price multipliers:
 *   +0.05 per purchase  (max 2.0x)
 *   -0.1  per day unsold (min 0.5x) — applied lazily on next purchase event
 *   Weekly reset on Monday UTC: all multipliers → 1.0, counts → 0
 */

import {
  recordDynamicPurchase,
  applyDailyDecay,
  resetWeeklyPricing,
  setDynamicPricingDay,
} from '../slices/economySlice.js';

// ── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Get ISO week key: "YYYY-WNN" (Monday-based, UTC).
 * Week 1 is the week containing the first Thursday of the year.
 */
export function getWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // Shift to nearest Thursday to find ISO year/week
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Get day key: "YYYY-MM-DD" (UTC).
 */
export function getDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

// ── Re-entrancy guard ─────────────────────────────────────────────────────────
let _isProcessingEconomy = false;

// ── Middleware ────────────────────────────────────────────────────────────────

export const economyMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type !== 'economy/recordPurchase' || _isProcessingEconomy) {
    return result;
  }

  const { itemId } = action.payload || {};
  if (!itemId) return result;

  _isProcessingEconomy = true;
  try {
    const now = new Date();
    const weekKey = getWeekKey(now);
    const dayKey = getDayKey(now);

    // ── 1. Weekly reset check ────────────────────────────────────────────────
    const state1 = store.getState();
    const dp1 = state1.economy.dynamicPricing;

    if (dp1.lastWeekKey !== weekKey) {
      // New week (or first purchase ever) — reset all multipliers to 1.0
      store.dispatch(resetWeeklyPricing({ weekKey }));
    }

    // ── 2. Daily decay / init check ─────────────────────────────────────────
    const dp2 = store.getState().economy.dynamicPricing;

    if (dp2.lastDayKey === null) {
      // First purchase of this week — initialise day key, no decay yet
      store.dispatch(setDynamicPricingDay({ dayKey }));
    } else if (dp2.lastDayKey !== dayKey) {
      // New calendar day — decay all tracked multipliers
      store.dispatch(applyDailyDecay({ dayKey }));
    }

    // ── 3. Record the purchase ───────────────────────────────────────────────
    store.dispatch(recordDynamicPurchase({ itemId }));
  } finally {
    _isProcessingEconomy = false;
  }

  return result;
};
