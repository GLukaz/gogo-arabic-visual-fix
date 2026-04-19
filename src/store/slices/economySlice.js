import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shopInventories: {},     // { shopId: { items: [], lastRestock: timestamp } }
  hagglingHistory: [],     // [{ shopId, itemId, offered, accepted, timestamp }] — last 50
  priceModifiers: {},      // { shopId: multiplier } — reputation-based price adjustments
  supplyLevels: {},        // { [shopId]: { [itemId]: { current: number, max: number } } }
  dynamicPricing: {
    purchaseCounts: {},    // { itemId: count } — since last weekly reset
    priceMultipliers: {},  // { itemId: multiplier } — current price multiplier (1.0 base)
    lastWeekKey: null,     // ISO week string e.g. "2026-W14" — for weekly reset detection
    lastDayKey: null,      // ISO date string e.g. "2026-04-06" — for daily decay detection
  },
};

const economySlice = createSlice({
  name: 'economy',
  initialState,
  reducers: {
    setShopInventory(state, action) {
      // payload: { shopId, items }
      const { shopId, items } = action.payload;

      state.shopInventories[shopId] = {
        items,
        lastRestock: Date.now(),
      };
    },

    recordHaggle(state, action) {
      // payload: { shopId, itemId, offered, accepted, success }
      const { shopId, itemId, offered, accepted, success } = action.payload;

      state.hagglingHistory.push({
        shopId,
        itemId,
        offered,
        accepted,
        success,
        timestamp: Date.now(),
      });

      // Cap at 50 entries
      if (state.hagglingHistory.length > 50) {
        state.hagglingHistory.shift();
      }
    },

    recordPurchase(_state, _action) {
      // payload: { shopId, itemId, price, haggled }
      // Analytics tracking placeholder — expand to analytics slice in v10.0
    },

    setPriceModifier(state, action) {
      // payload: { shopId, modifier }
      const { shopId, modifier } = action.payload;

      state.priceModifiers[shopId] = modifier;
    },

    clearShopCache(state) {
      // Clear all cached inventories (trigger restock)
      state.shopInventories = {};
    },

    // ── ECON-01/02: Supply level management ──────────────────────────────────

    /**
     * initSupply — seed supply levels for a shop on first open (idempotent).
     * payload: { shopId: string, items: [{ itemId: string, max: number }] }
     * Already-initialized items are left untouched so purchases are preserved.
     */
    initSupply(state, action) {
      const { shopId, items } = action.payload;
      if (!state.supplyLevels[shopId]) {
        state.supplyLevels[shopId] = {};
      }
      for (const { itemId, max } of items) {
        if (state.supplyLevels[shopId][itemId] === undefined) {
          state.supplyLevels[shopId][itemId] = { current: max, max };
        }
      }
    },

    /**
     * decreaseSupply — reduce current supply for a single item after purchase.
     * payload: { shopId: string, itemId: string, amount: number }
     * Clamped to 0 — current never goes negative.
     */
    decreaseSupply(state, action) {
      const { shopId, itemId, amount } = action.payload;
      const entry = state.supplyLevels[shopId]?.[itemId];
      if (entry) {
        entry.current = Math.max(0, entry.current - amount);
      }
    },

    /**
     * restoreSupply — partially restore supply across all items in a shop after a rest.
     * payload: { shopId: string, restorePercent?: number }
     * Default restorePercent = 0.25 (25% of max restored per rest).
     */
    restoreSupply(state, action) {
      const { shopId, restorePercent = 0.25 } = action.payload;
      const shopSupply = state.supplyLevels[shopId];
      if (!shopSupply) return;
      for (const itemId of Object.keys(shopSupply)) {
        const entry = shopSupply[itemId];
        const restore = Math.ceil(entry.max * restorePercent);
        entry.current = Math.min(entry.max, entry.current + restore);
      }
    },

    // ── Dynamic pricing ───────────────────────────────────────────────────────

    /**
     * recordDynamicPurchase — increment purchase count + raise multiplier by 0.05 (max 2.0).
     * payload: { itemId: string }
     */
    recordDynamicPurchase(state, action) {
      const { itemId } = action.payload;
      const dp = state.dynamicPricing;
      if (dp.priceMultipliers[itemId] === undefined) {
        dp.priceMultipliers[itemId] = 1.0;
      }
      if (dp.purchaseCounts[itemId] === undefined) {
        dp.purchaseCounts[itemId] = 0;
      }
      dp.purchaseCounts[itemId] += 1;
      dp.priceMultipliers[itemId] = Math.min(2.0, dp.priceMultipliers[itemId] + 0.05);
    },

    /**
     * applyDailyDecay — reduce all tracked multipliers by 0.1 (min 0.5) and advance day key.
     * payload: { dayKey: string }
     */
    applyDailyDecay(state, action) {
      const { dayKey } = action.payload;
      state.dynamicPricing.lastDayKey = dayKey;
      const multipliers = state.dynamicPricing.priceMultipliers;
      for (const itemId of Object.keys(multipliers)) {
        multipliers[itemId] = Math.max(0.5, multipliers[itemId] - 0.1);
      }
    },

    /**
     * resetWeeklyPricing — reset all multipliers to 1.0 and clear purchase counts.
     * Called on Monday UTC (new ISO week). Also used to initialise on first purchase ever.
     * payload: { weekKey: string }
     */
    resetWeeklyPricing(state, action) {
      const { weekKey } = action.payload;
      state.dynamicPricing.lastWeekKey = weekKey;
      state.dynamicPricing.lastDayKey = null;
      state.dynamicPricing.purchaseCounts = {};
      state.dynamicPricing.priceMultipliers = {};
    },

    /**
     * setDynamicPricingDay — record the current day key without applying decay.
     * Used to initialise tracking at the start of a fresh week.
     * payload: { dayKey: string }
     */
    setDynamicPricingDay(state, action) {
      state.dynamicPricing.lastDayKey = action.payload.dayKey;
    },

    /**
     * bulkApplyEconomyDecay — atomically apply computed price decay and supply
     * respawn from the economyDecayMiddleware's updateEconomyState() result.
     *
     * payload: {
     *   priceMultipliers: { [itemId]: number },
     *   supplyLevels: { [shopId]: { [itemId]: { current: number, max: number } } },
     *   dayKey: string,
     * }
     */
    bulkApplyEconomyDecay(state, action) {
      const { priceMultipliers, supplyLevels, dayKey } = action.payload;
      state.dynamicPricing.priceMultipliers = priceMultipliers;
      state.dynamicPricing.lastDayKey = dayKey;
      // Merge supply levels (preserve shops not included in the update)
      for (const [shopId, items] of Object.entries(supplyLevels)) {
        if (!state.supplyLevels[shopId]) {
          state.supplyLevels[shopId] = {};
        }
        for (const [itemId, entry] of Object.entries(items)) {
          state.supplyLevels[shopId][itemId] = entry;
        }
      }
    },
  },
});

export const {
  setShopInventory,
  recordHaggle,
  recordPurchase,
  setPriceModifier,
  clearShopCache,
  initSupply,
  decreaseSupply,
  restoreSupply,
  recordDynamicPurchase,
  applyDailyDecay,
  resetWeeklyPricing,
  setDynamicPricingDay,
  bulkApplyEconomyDecay,
} = economySlice.actions;

// ────────────────────────────────────────────────
// Selectors
// ────────────────────────────────────────────────

export const selectShopState = (shopId) => (state) => state.economy.shopInventories[shopId] || null;

export const selectHagglingHistory = (state) => state.economy.hagglingHistory;

export const selectPriceModifier = (shopId) => (state) => state.economy.priceModifiers[shopId] || 1.0;

/** ECON-01: Select supply levels for a specific shop. */
export const selectSupplyLevels = (shopId) => (state) => state.economy.supplyLevels[shopId] || {};

// ── Dynamic pricing selectors ─────────────────────────────────────────────

/** Returns current price multiplier for an item (defaults to 1.0). */
export const selectPriceMultiplier = (itemId) => (state) =>
  state.economy.dynamicPricing.priceMultipliers[itemId] ?? 1.0;

/**
 * selectAdjustedPrice(itemId, basePrice) — apply dynamic multiplier to a base price.
 * Returns Math.round(basePrice * multiplier).
 */
export const selectAdjustedPrice = (itemId, basePrice) => (state) => {
  const multiplier = state.economy.dynamicPricing.priceMultipliers[itemId] ?? 1.0;
  return Math.round(basePrice * multiplier);
};

/**
 * selectDealOfTheDay() — returns the itemId with the lowest current multiplier,
 * or null if no items are tracked.
 */
export const selectDealOfTheDay = () => (state) => {
  const multipliers = state.economy.dynamicPricing.priceMultipliers;
  const entries = Object.entries(multipliers);
  if (entries.length === 0) return null;
  return entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min))[0];
};

export default economySlice.reducer;
