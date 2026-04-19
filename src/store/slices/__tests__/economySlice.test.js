import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  setShopInventory,
  recordHaggle,
  recordPurchase,
  setPriceModifier,
  clearShopCache,
  selectShopState,
  selectHagglingHistory,
  selectPriceModifier,
} from '../economySlice.js';

describe('economySlice', () => {
  let initialState;

  beforeEach(() => {
    // Get fresh initial state
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  describe('setShopInventory', () => {
    it('caches inventory for shopId', () => {
      const items = [
        { itemId: 'simple_kufi', quantity: 5 },
        { itemId: 'simple_robe', quantity: 3 },
      ];
      const state = reducer(initialState, setShopInventory({ shopId: 'bazaar_clothing', items }));

      expect(state.shopInventories['bazaar_clothing']).toBeDefined();
      expect(state.shopInventories['bazaar_clothing'].items).toEqual(items);
      expect(state.shopInventories['bazaar_clothing'].lastRestock).toBeGreaterThan(0);
    });

    it('overwrites existing shop inventory', () => {
      const items1 = [{ itemId: 'simple_kufi', quantity: 5 }];
      const items2 = [{ itemId: 'simple_robe', quantity: 10 }];

      let state = reducer(initialState, setShopInventory({ shopId: 'bazaar_clothing', items: items1 }));
      state = reducer(state, setShopInventory({ shopId: 'bazaar_clothing', items: items2 }));

      expect(state.shopInventories['bazaar_clothing'].items).toEqual(items2);
    });

    it('stores multiple shop inventories independently', () => {
      const items1 = [{ itemId: 'simple_kufi', quantity: 5 }];
      const items2 = [{ itemId: 'simple_robe', quantity: 10 }];

      let state = reducer(initialState, setShopInventory({ shopId: 'bazaar_clothing', items: items1 }));
      state = reducer(state, setShopInventory({ shopId: 'market_armor', items: items2 }));

      expect(state.shopInventories['bazaar_clothing'].items).toEqual(items1);
      expect(state.shopInventories['market_armor'].items).toEqual(items2);
    });
  });

  describe('recordHaggle', () => {
    it('adds entry to hagglingHistory', () => {
      const state = reducer(
        initialState,
        recordHaggle({ shopId: 'bazaar_clothing', itemId: 'simple_kufi', offered: 50, accepted: 60, success: false })
      );

      expect(state.hagglingHistory).toHaveLength(1);
      expect(state.hagglingHistory[0]).toEqual({
        shopId: 'bazaar_clothing',
        itemId: 'simple_kufi',
        offered: 50,
        accepted: 60,
        success: false,
        timestamp: expect.any(Number),
      });
    });

    it('caps history at 50 entries', () => {
      let state = initialState;

      // Add 55 entries
      for (let i = 0; i < 55; i++) {
        state = reducer(
          state,
          recordHaggle({ shopId: 'shop', itemId: 'item', offered: i, accepted: i + 10, success: false })
        );
      }

      expect(state.hagglingHistory).toHaveLength(50);
      // First 5 entries should be removed (FIFO)
      expect(state.hagglingHistory[0].offered).toBe(5);
    });

    it('records successful haggle', () => {
      const state = reducer(
        initialState,
        recordHaggle({ shopId: 'bazaar_clothing', itemId: 'simple_kufi', offered: 55, accepted: 60, success: true })
      );

      expect(state.hagglingHistory[0].success).toBe(true);
    });

    it('stores timestamp for each haggle', () => {
      const state = reducer(
        initialState,
        recordHaggle({ shopId: 'bazaar_clothing', itemId: 'simple_kufi', offered: 50, accepted: 60, success: false })
      );

      expect(state.hagglingHistory[0].timestamp).toBeGreaterThan(0);
    });
  });

  describe('recordPurchase', () => {
    it('tracks purchase (currently logs to console)', () => {
      // recordPurchase doesn't modify state, just logs
      // This test ensures the reducer doesn't throw
      const state = reducer(
        initialState,
        recordPurchase({ shopId: 'bazaar_clothing', itemId: 'simple_kufi', price: 50, haggled: true })
      );

      expect(state).toEqual(initialState);
    });
  });

  describe('setPriceModifier', () => {
    it('sets modifier for shopId', () => {
      const state = reducer(initialState, setPriceModifier({ shopId: 'bazaar_clothing', modifier: 0.9 }));

      expect(state.priceModifiers['bazaar_clothing']).toBe(0.9);
    });

    it('overwrites existing modifier', () => {
      let state = reducer(initialState, setPriceModifier({ shopId: 'bazaar_clothing', modifier: 0.9 }));
      state = reducer(state, setPriceModifier({ shopId: 'bazaar_clothing', modifier: 0.8 }));

      expect(state.priceModifiers['bazaar_clothing']).toBe(0.8);
    });

    it('stores modifiers for multiple shops', () => {
      let state = reducer(initialState, setPriceModifier({ shopId: 'bazaar_clothing', modifier: 0.9 }));
      state = reducer(state, setPriceModifier({ shopId: 'market_armor', modifier: 0.85 }));

      expect(state.priceModifiers['bazaar_clothing']).toBe(0.9);
      expect(state.priceModifiers['market_armor']).toBe(0.85);
    });
  });

  describe('clearShopCache', () => {
    it('empties all cached inventories', () => {
      let state = reducer(initialState, setShopInventory({ shopId: 'bazaar_clothing', items: [] }));
      state = reducer(state, setShopInventory({ shopId: 'market_armor', items: [] }));
      state = reducer(state, clearShopCache());

      expect(state.shopInventories).toEqual({});
    });

    it('does not affect hagglingHistory or priceModifiers', () => {
      let state = reducer(initialState, setShopInventory({ shopId: 'bazaar_clothing', items: [] }));
      state = reducer(state, recordHaggle({ shopId: 'bazaar_clothing', itemId: 'item', offered: 50, accepted: 60, success: false }));
      state = reducer(state, setPriceModifier({ shopId: 'bazaar_clothing', modifier: 0.9 }));
      state = reducer(state, clearShopCache());

      expect(state.hagglingHistory).toHaveLength(1);
      expect(state.priceModifiers['bazaar_clothing']).toBe(0.9);
    });
  });

  describe('selectors', () => {
    it('selectShopState returns correct shop', () => {
      const mockState = {
        economy: {
          shopInventories: {
            bazaar_clothing: { items: [], lastRestock: 12345 },
          },
          hagglingHistory: [],
          priceModifiers: {},
        },
      };

      const result = selectShopState('bazaar_clothing')(mockState);
      expect(result).toEqual({ items: [], lastRestock: 12345 });
    });

    it('selectShopState returns null for non-existent shop', () => {
      const mockState = {
        economy: {
          shopInventories: {},
          hagglingHistory: [],
          priceModifiers: {},
        },
      };

      const result = selectShopState('nonexistent')(mockState);
      expect(result).toBeNull();
    });

    it('selectHagglingHistory returns history', () => {
      const mockState = {
        economy: {
          shopInventories: {},
          hagglingHistory: [
            { shopId: 'shop', itemId: 'item', offered: 50, accepted: 60, success: false, timestamp: 12345 },
          ],
          priceModifiers: {},
        },
      };

      const result = selectHagglingHistory(mockState);
      expect(result).toHaveLength(1);
      expect(result[0].offered).toBe(50);
    });

    it('selectPriceModifier returns modifier for shop', () => {
      const mockState = {
        economy: {
          shopInventories: {},
          hagglingHistory: [],
          priceModifiers: { bazaar_clothing: 0.9 },
        },
      };

      const result = selectPriceModifier('bazaar_clothing')(mockState);
      expect(result).toBe(0.9);
    });

    it('selectPriceModifier returns 1.0 for shop without modifier', () => {
      const mockState = {
        economy: {
          shopInventories: {},
          hagglingHistory: [],
          priceModifiers: {},
        },
      };

      const result = selectPriceModifier('bazaar_clothing')(mockState);
      expect(result).toBe(1.0);
    });
  });
});
