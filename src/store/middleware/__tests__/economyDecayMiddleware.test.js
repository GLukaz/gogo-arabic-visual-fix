import { describe, it, expect } from 'vitest';
import { updateEconomyState, getDayKey, daysBetween } from '../economyDecayMiddleware.js';

// ─── getDayKey ────────────────────────────────────────────────────────────────

describe('getDayKey', () => {
  it('returns a YYYY-MM-DD string', () => {
    const key = getDayKey(new Date('2026-04-08T12:00:00Z'));
    expect(key).toBe('2026-04-08');
  });
});

// ─── daysBetween ──────────────────────────────────────────────────────────────

describe('daysBetween', () => {
  it('returns 0 for same day', () => {
    expect(daysBetween('2026-04-08', '2026-04-08')).toBe(0);
  });

  it('returns correct count for multiple days', () => {
    expect(daysBetween('2026-04-05', '2026-04-08')).toBe(3);
  });

  it('returns 0 when toKey is before fromKey', () => {
    expect(daysBetween('2026-04-08', '2026-04-05')).toBe(0);
  });
});

// ─── updateEconomyState ───────────────────────────────────────────────────────

function makeState(overrides = {}) {
  return {
    priceMultipliers: {},
    purchaseCounts: {},
    supplyLevels: {},
    ...overrides,
  };
}

describe('updateEconomyState', () => {
  // ── Price decay ─────────────────────────────────────────────────────────────

  it('does not change price at baseline (1.0) after decay', () => {
    const state = makeState({ priceMultipliers: { sword: 1.0 } });
    const result = updateEconomyState(state, 5);
    expect(result.priceMultipliers.sword).toBeCloseTo(1.0, 5);
  });

  it('decays excess above 1.0 by ~2% per day', () => {
    // excess = 0.5, after 1 day = 0.5 * 0.98 = 0.49 → multiplier = 1.49
    const state = makeState({ priceMultipliers: { sword: 1.5 } });
    const result = updateEconomyState(state, 1);
    expect(result.priceMultipliers.sword).toBeCloseTo(1.49, 4);
  });

  it('compounds decay over multiple days', () => {
    // excess = 0.5, after 10 days = 0.5 * 0.98^10 ≈ 0.4073 → multiplier ≈ 1.4073
    const state = makeState({ priceMultipliers: { sword: 1.5 } });
    const result = updateEconomyState(state, 10);
    const expected = 1.0 + 0.5 * Math.pow(0.98, 10);
    expect(result.priceMultipliers.sword).toBeCloseTo(expected, 4);
  });

  it('price never drops below 1.0', () => {
    const state = makeState({ priceMultipliers: { herb: 1.01 } });
    const result = updateEconomyState(state, 100);
    expect(result.priceMultipliers.herb).toBeGreaterThanOrEqual(1.0);
  });

  it('days=0 returns prices unchanged', () => {
    const state = makeState({ priceMultipliers: { gem: 1.8 } });
    const result = updateEconomyState(state, 0);
    expect(result.priceMultipliers.gem).toBeCloseTo(1.8, 5);
  });

  // ── High-demand surge ───────────────────────────────────────────────────────

  it('adds +30% surge for items with 20+ weekly purchases', () => {
    const state = makeState({
      priceMultipliers: { bread: 1.0 },
      purchaseCounts:   { bread: 20 },
    });
    const result = updateEconomyState(state, 1);
    // After 1 day decay (no excess on 1.0) + surge: 1.0 + 0.30 = 1.30
    expect(result.priceMultipliers.bread).toBeCloseTo(1.3, 4);
  });

  it('does NOT surge items below 20 weekly purchases', () => {
    const state = makeState({
      priceMultipliers: { bread: 1.0 },
      purchaseCounts:   { bread: 19 },
    });
    const result = updateEconomyState(state, 1);
    expect(result.priceMultipliers.bread).toBeCloseTo(1.0, 4);
  });

  it('surge is capped at 2.0', () => {
    const state = makeState({
      priceMultipliers: { rare: 1.8 },
      purchaseCounts:   { rare: 50 },
    });
    const result = updateEconomyState(state, 0);
    expect(result.priceMultipliers.rare).toBe(2.0);
  });

  // ── Supply respawn ──────────────────────────────────────────────────────────

  it('restores 30% of deficit per day', () => {
    // deficit = 10, after 1 day: deficit * 0.70 = 7 → current = max - 7 = 13
    const state = makeState({
      supplyLevels: { market: { apple: { current: 10, max: 20 } } },
    });
    const result = updateEconomyState(state, 1);
    expect(result.supplyLevels.market.apple.current).toBe(13); // 20 - round(10 * 0.7)
  });

  it('supply never exceeds max', () => {
    const state = makeState({
      supplyLevels: { market: { bread: { current: 19, max: 20 } } },
    });
    const result = updateEconomyState(state, 10);
    expect(result.supplyLevels.market.bread.current).toBe(20);
  });

  it('compounds supply respawn over multiple days', () => {
    // deficit = 20 (current=0, max=20), after 3 days: deficit * 0.7^3 = 20 * 0.343 = 6.86
    // current = 20 - round(6.86) = 20 - 7 = 13
    const state = makeState({
      supplyLevels: { shop: { gem: { current: 0, max: 20 } } },
    });
    const result = updateEconomyState(state, 3);
    const expectedDeficit = 20 * Math.pow(0.7, 3);
    const expectedCurrent = Math.min(20, Math.round(20 - expectedDeficit));
    expect(result.supplyLevels.shop.gem.current).toBe(expectedCurrent);
  });

  it('preserves max values in supply output', () => {
    const state = makeState({
      supplyLevels: { store: { cloth: { current: 5, max: 15 } } },
    });
    const result = updateEconomyState(state, 2);
    expect(result.supplyLevels.store.cloth.max).toBe(15);
  });
});
