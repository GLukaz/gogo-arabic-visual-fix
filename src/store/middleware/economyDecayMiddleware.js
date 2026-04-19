/**
 * economyDecayMiddleware.js — Daily economy price decay and supply respawn
 *
 * Triggers on dailyGoals/claimReward or dailyGoals/startSession.
 * Computes the number of days since last decay run and applies:
 *   - Price decay: 2% per day of the excess above baseline (1.0) — prevents runaway inflation
 *   - Supply respawn: 30% per day toward max — prevents permanent stockout
 *   - High-demand surge: +30% on items purchased ≥20 times this week
 *
 * The core computation lives in the pure function `updateEconomyState()` so it can
 * be unit-tested without a Redux store.
 */

import { bulkApplyEconomyDecay } from '../slices/economySlice.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const PRICE_DECAY_RATE   = 0.02;   // 2% of excess above 1.0 decays per day
const SUPPLY_RESPAWN_RATE = 0.30;  // 30% of deficit (max - current) respawns per day
const HIGH_DEMAND_THRESHOLD = 20;  // purchases/week to trigger surge
const HIGH_DEMAND_SURGE     = 0.30; // +30% price multiplier for high-demand items
const MAX_MULTIPLIER = 2.0;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Get current UTC day key 'YYYY-MM-DD'. */
export function getDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Compute number of full calendar days between two 'YYYY-MM-DD' strings. */
export function daysBetween(fromKey, toKey) {
  const from = new Date(fromKey + 'T00:00:00Z').getTime();
  const to   = new Date(toKey   + 'T00:00:00Z').getTime();
  return Math.max(0, Math.floor((to - from) / 86400000));
}

// ── Pure computation ──────────────────────────────────────────────────────────

/**
 * Compute updated price multipliers and supply levels after `daysSinceLastUpdate` days.
 *
 * Price decay formula (per day, compounded):
 *   excess = multiplier - 1.0
 *   new_excess = excess × (1 - PRICE_DECAY_RATE)^days
 *   new_multiplier = 1.0 + new_excess  (floored at 1.0)
 *
 * High-demand surge (applied after decay, once per call):
 *   items with purchaseCounts ≥ HIGH_DEMAND_THRESHOLD get +HIGH_DEMAND_SURGE (capped at MAX_MULTIPLIER)
 *
 * Supply respawn formula (per day, compounded approach-to-max):
 *   deficit = max - current
 *   new_deficit = deficit × (1 - SUPPLY_RESPAWN_RATE)^days
 *   new_current = max - new_deficit  (rounded, clamped to [current, max])
 *
 * @param {{
 *   priceMultipliers: Record<string, number>,
 *   purchaseCounts:   Record<string, number>,
 *   supplyLevels:     Record<string, Record<string, { current: number, max: number }>>,
 * }} currentState
 * @param {number} daysSinceLastUpdate - Number of days elapsed (non-negative integer)
 * @returns {{
 *   priceMultipliers: Record<string, number>,
 *   supplyLevels:     Record<string, Record<string, { current: number, max: number }>>,
 * }}
 */
export function updateEconomyState(currentState, daysSinceLastUpdate) {
  const days = Math.max(0, Math.floor(daysSinceLastUpdate));

  // ── Price decay ─────────────────────────────────────────────────────────────
  const priceMultipliers = {};
  const decayFactor = Math.pow(1 - PRICE_DECAY_RATE, days);

  for (const [itemId, multiplier] of Object.entries(currentState.priceMultipliers ?? {})) {
    const excess = multiplier - 1.0;
    const newExcess = excess > 0 ? excess * decayFactor : 0;
    priceMultipliers[itemId] = Math.max(1.0, 1.0 + newExcess);
  }

  // ── High-demand surge (applied once, after decay) ───────────────────────────
  for (const [itemId, count] of Object.entries(currentState.purchaseCounts ?? {})) {
    if (count >= HIGH_DEMAND_THRESHOLD) {
      const current = priceMultipliers[itemId] ?? 1.0;
      priceMultipliers[itemId] = Math.min(MAX_MULTIPLIER, current + HIGH_DEMAND_SURGE);
    }
  }

  // ── Supply respawn ──────────────────────────────────────────────────────────
  const supplyLevels = {};
  const supplyRetentionFactor = Math.pow(1 - SUPPLY_RESPAWN_RATE, days); // fraction of deficit remaining

  for (const [shopId, items] of Object.entries(currentState.supplyLevels ?? {})) {
    supplyLevels[shopId] = {};
    for (const [itemId, { current, max }] of Object.entries(items)) {
      const deficit = max - current;
      const newDeficit = deficit * supplyRetentionFactor;
      const newCurrent = Math.min(max, Math.round(max - newDeficit));
      supplyLevels[shopId][itemId] = { current: newCurrent, max };
    }
  }

  return { priceMultipliers, supplyLevels };
}

// ── Re-entrancy guard ─────────────────────────────────────────────────────────

let _isProcessingDecay = false;

// ── Middleware ────────────────────────────────────────────────────────────────

const TRIGGER_ACTIONS = new Set([
  'dailyGoals/claimReward',
  'dailyGoals/startSession',
]);

/**
 * Redux middleware that applies economy decay/respawn once per day.
 *
 * Fires on: dailyGoals/claimReward, dailyGoals/startSession
 * Guards: skips if already ran today (lastDayKey === today), skips re-entrant calls.
 */
export const economyDecayMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (!TRIGGER_ACTIONS.has(action.type) || _isProcessingDecay) return result;

  const state = store.getState();
  const dp = state.economy?.dynamicPricing;
  if (!dp) return result;

  const todayKey = getDayKey();
  if (dp.lastDayKey === todayKey) return result; // already ran today

  const daysSince = dp.lastDayKey ? daysBetween(dp.lastDayKey, todayKey) : 1;
  if (daysSince <= 0) return result;

  _isProcessingDecay = true;
  try {
    const updated = updateEconomyState(
      {
        priceMultipliers: dp.priceMultipliers,
        purchaseCounts:   dp.purchaseCounts,
        supplyLevels:     state.economy.supplyLevels,
      },
      daysSince,
    );

    store.dispatch(bulkApplyEconomyDecay({
      priceMultipliers: updated.priceMultipliers,
      supplyLevels:     updated.supplyLevels,
      dayKey: todayKey,
    }));
  } finally {
    _isProcessingDecay = false;
  }

  return result;
};
