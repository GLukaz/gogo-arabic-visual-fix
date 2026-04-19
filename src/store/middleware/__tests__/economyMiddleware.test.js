import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { economyMiddleware, getWeekKey, getDayKey } from '../economyMiddleware.js';
import economyReducer, {
  recordPurchase,
  selectPriceMultiplier,
  selectAdjustedPrice,
  selectDealOfTheDay,
} from '../../slices/economySlice.js';

// ── Helper: build a minimal store with economyMiddleware ──────────────────────

function makeStore(preloadedState) {
  return configureStore({
    reducer: { economy: economyReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(economyMiddleware),
    preloadedState,
  });
}

// ── Date helper tests ─────────────────────────────────────────────────────────

describe('getWeekKey', () => {
  it('returns YYYY-WNN format', () => {
    const key = getWeekKey(new Date('2026-04-06T12:00:00Z')); // Monday
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });

  it('same week returns same key for Mon and Sun', () => {
    const mon = getWeekKey(new Date('2026-04-06T00:00:00Z'));
    const sun = getWeekKey(new Date('2026-04-12T23:59:59Z'));
    expect(mon).toBe(sun);
  });

  it('adjacent weeks return different keys', () => {
    const week1 = getWeekKey(new Date('2026-04-05T23:59:59Z')); // Sunday week N
    const week2 = getWeekKey(new Date('2026-04-06T00:00:00Z')); // Monday week N+1
    expect(week1).not.toBe(week2);
  });
});

describe('getDayKey', () => {
  it('returns YYYY-MM-DD format', () => {
    const key = getDayKey(new Date('2026-04-06T15:30:00Z'));
    expect(key).toBe('2026-04-06');
  });

  it('different UTC days return different keys', () => {
    expect(getDayKey(new Date('2026-04-06T23:59:59Z'))).toBe('2026-04-06');
    expect(getDayKey(new Date('2026-04-07T00:00:00Z'))).toBe('2026-04-07');
  });
});

// ── Middleware integration tests ──────────────────────────────────────────────

describe('economyMiddleware', () => {
  let store;

  beforeEach(() => {
    store = makeStore();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-06T10:00:00Z')); // Monday
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('passes through non-purchase actions without changing dynamicPricing', () => {
    const before = store.getState().economy.dynamicPricing;
    store.dispatch({ type: 'player/addXP', payload: 10 });
    expect(store.getState().economy.dynamicPricing).toEqual(before);
  });

  it('ignores recordPurchase with no itemId', () => {
    store.dispatch(recordPurchase({ shopId: 'oasis', price: 50 }));
    expect(store.getState().economy.dynamicPricing.priceMultipliers).toEqual({});
  });

  it('increases multiplier by 0.05 on first purchase', () => {
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    const mult = selectPriceMultiplier('simple_kufi')(store.getState());
    expect(mult).toBeCloseTo(1.05, 5);
  });

  it('accumulates multiplier across multiple purchases', () => {
    for (let i = 0; i < 4; i++) {
      store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    }
    const mult = selectPriceMultiplier('simple_kufi')(store.getState());
    expect(mult).toBeCloseTo(1.2, 5);
  });

  it('caps multiplier at 2.0x regardless of purchase count', () => {
    for (let i = 0; i < 30; i++) {
      store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    }
    const mult = selectPriceMultiplier('simple_kufi')(store.getState());
    expect(mult).toBe(2.0);
  });

  it('tracks purchase counts per item', () => {
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'prayer_beads', price: 20 }));
    const dp = store.getState().economy.dynamicPricing;
    expect(dp.purchaseCounts['simple_kufi']).toBe(2);
    expect(dp.purchaseCounts['prayer_beads']).toBe(1);
  });

  it('applies daily decay when day advances', () => {
    // Purchase on day 1
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    const afterDay1 = selectPriceMultiplier('simple_kufi')(store.getState());
    expect(afterDay1).toBeCloseTo(1.05, 5);

    // Advance to day 2
    vi.setSystemTime(new Date('2026-04-07T10:00:00Z'));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'prayer_beads', price: 20 }));

    // simple_kufi decayed (unsold yesterday) then prayer_beads purchased
    const kufiMult = selectPriceMultiplier('simple_kufi')(store.getState());
    expect(kufiMult).toBeCloseTo(0.95, 5); // 1.05 - 0.1
  });

  it('floors multiplier at 0.5x after repeated daily decay', () => {
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    // After purchase: simple_kufi = 1.05

    // Advance 6 days within the same ISO week (Apr 6 Mon → Apr 12 Sun = week 15)
    // Each day triggers -0.1 decay on simple_kufi (not purchased again)
    // 1.05 → 0.95 → 0.85 → 0.75 → 0.65 → 0.55 → 0.5 (clamped from 0.45)
    const days = [
      '2026-04-07', '2026-04-08', '2026-04-09',
      '2026-04-10', '2026-04-11', '2026-04-12',
    ];
    for (const day of days) {
      vi.setSystemTime(new Date(`${day}T10:00:00Z`));
      store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'prayer_beads', price: 20 }));
    }

    const mult = selectPriceMultiplier('simple_kufi')(store.getState());
    expect(mult).toBeGreaterThanOrEqual(0.5);
    expect(mult).toBe(0.5); // clamped at floor
  });

  it('does not apply decay on same-day repeated purchases', () => {
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    // Same day — no decay
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'prayer_beads', price: 20 }));
    // simple_kufi should NOT have decayed
    const kufiMult = selectPriceMultiplier('simple_kufi')(store.getState());
    expect(kufiMult).toBeCloseTo(1.05, 5);
  });

  it('resets all multipliers to 1.0 on new week', () => {
    // Purchase on week 15
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    expect(selectPriceMultiplier('simple_kufi')(store.getState())).toBeCloseTo(1.05, 5);

    // Advance to next Monday (week 16)
    vi.setSystemTime(new Date('2026-04-13T00:00:00Z'));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'prayer_beads', price: 20 }));

    // simple_kufi should be reset to 1.0 (no longer tracked after reset)
    expect(selectPriceMultiplier('simple_kufi')(store.getState())).toBe(1.0);
  });

  it('initialises week key on very first purchase', () => {
    expect(store.getState().economy.dynamicPricing.lastWeekKey).toBeNull();
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    expect(store.getState().economy.dynamicPricing.lastWeekKey).not.toBeNull();
  });

  // ── Selector tests ──────────────────────────────────────────────────────────

  it('selectPriceMultiplier returns 1.0 for unknown item', () => {
    expect(selectPriceMultiplier('nonexistent_item')(store.getState())).toBe(1.0);
  });

  it('selectAdjustedPrice applies multiplier to base price', () => {
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 100 }));
    // multiplier = 1.05 → price = round(100 * 1.05) = 105
    const adjusted = selectAdjustedPrice('simple_kufi', 100)(store.getState());
    expect(adjusted).toBe(105);
  });

  it('selectAdjustedPrice returns base price for unknown item (multiplier 1.0)', () => {
    const adjusted = selectAdjustedPrice('unknown_item', 200)(store.getState());
    expect(adjusted).toBe(200);
  });

  it('selectDealOfTheDay returns null when no items tracked', () => {
    expect(selectDealOfTheDay()(store.getState())).toBeNull();
  });

  it('selectDealOfTheDay returns the most discounted item', () => {
    // Purchase simple_kufi many times to inflate it
    for (let i = 0; i < 5; i++) {
      store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'simple_kufi', price: 50 }));
    }
    // Advance a day and buy prayer_beads — simple_kufi decays, prayer_beads goes up
    vi.setSystemTime(new Date('2026-04-07T10:00:00Z'));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'prayer_beads', price: 20 }));
    // simple_kufi: 1.25 - 0.1 = 1.15 (still > 1.0 but lower than before)
    // prayer_beads: 1.05

    // Advance another day without buying simple_kufi
    vi.setSystemTime(new Date('2026-04-08T10:00:00Z'));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'prayer_beads', price: 20 }));
    // simple_kufi: 1.15 - 0.1 = 1.05, prayer_beads: 1.05 + 0.05 = 1.1

    // Advance several more days to push simple_kufi below 1.0
    vi.setSystemTime(new Date('2026-04-09T10:00:00Z'));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'prayer_beads', price: 20 }));
    // simple_kufi: 1.05 - 0.1 = 0.95

    const deal = selectDealOfTheDay()(store.getState());
    expect(deal).toBe('simple_kufi'); // most discounted (lowest multiplier)
  });

  it('multiple items track multipliers independently', () => {
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'item_a', price: 100 }));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'item_a', price: 100 }));
    store.dispatch(recordPurchase({ shopId: 'oasis', itemId: 'item_b', price: 50 }));

    expect(selectPriceMultiplier('item_a')(store.getState())).toBeCloseTo(1.1, 5);
    expect(selectPriceMultiplier('item_b')(store.getState())).toBeCloseTo(1.05, 5);
  });
});
