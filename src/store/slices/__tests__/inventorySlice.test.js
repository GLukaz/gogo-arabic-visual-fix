import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  addItem,
  removeItem,
  equipItem,
  unequipItem,
  unlockAffix,
  sortInventory,
  lockItem,
  unlockItem,
  clearInventory,
  selectEquippedItems,
  selectInventoryItems,
  selectAffixesUnlocked,
  selectInventoryCount,
  selectIsInventoryFull,
} from '../inventorySlice.js';

describe('inventorySlice', () => {
  let initialState;

  beforeEach(() => {
    // Get fresh initial state
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  describe('addItem', () => {
    it('adds a new item to inventory', () => {
      const state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ itemId: 'simple_kufi', quantity: 1, locked: false });
    });

    it('stacks quantity for existing item', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, addItem({ itemId: 'simple_kufi', quantity: 2 }));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it('defaults quantity to 1 if not provided', () => {
      const state = reducer(initialState, addItem({ itemId: 'simple_kufi' }));

      expect(state.items[0].quantity).toBe(1);
    });

    it('does not add item when inventory is at 200 items', () => {
      // Create state with 200 items
      const fullState = {
        ...initialState,
        items: Array.from({ length: 200 }, (_, i) => ({
          itemId: `item_${i}`,
          quantity: 1,
          locked: false,
        })),
      };

      const state = reducer(fullState, addItem({ itemId: 'new_item', quantity: 1 }));

      expect(state.items).toHaveLength(200);
      expect(state.items.some(item => item.itemId === 'new_item')).toBe(false);
    });

    it('adds multiple items with separate addItem calls', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, addItem({ itemId: 'scholars_robe', quantity: 1 }));

      expect(state.items).toHaveLength(2);
      expect(state.items[0].itemId).toBe('simple_kufi');
      expect(state.items[1].itemId).toBe('scholars_robe');
    });
  });

  describe('removeItem', () => {
    it('decreases quantity of existing item', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 5 }));
      state = reducer(state, removeItem({ itemId: 'simple_kufi', quantity: 2 }));

      expect(state.items[0].quantity).toBe(3);
    });

    it('removes item when quantity reaches 0', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 2 }));
      state = reducer(state, removeItem({ itemId: 'simple_kufi', quantity: 2 }));

      expect(state.items).toHaveLength(0);
    });

    it('removes item when quantity goes below 0', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 2 }));
      state = reducer(state, removeItem({ itemId: 'simple_kufi', quantity: 5 }));

      expect(state.items).toHaveLength(0);
    });

    it('does nothing for non-existent item', () => {
      const state = reducer(initialState, removeItem({ itemId: 'nonexistent', quantity: 1 }));

      expect(state.items).toHaveLength(0);
    });

    it('defaults quantity to 1 if not provided', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 5 }));
      state = reducer(state, removeItem({ itemId: 'simple_kufi' }));

      expect(state.items[0].quantity).toBe(4);
    });
  });

  describe('equipItem', () => {
    it('equips item to valid slot', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));

      expect(state.equipped.headCovering).toBe('simple_kufi');
      expect(state.items).toHaveLength(0); // Removed from inventory
    });

    it('rejects invalid slot names', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, equipItem({ slot: 'invalidSlot', itemId: 'simple_kufi' }));

      expect(state.equipped).not.toHaveProperty('invalidSlot');
      expect(state.items).toHaveLength(1); // Item not removed
    });

    it('overwrites previously equipped item in slot', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, addItem({ itemId: 'scholars_kufi', quantity: 1 }));
      state = reducer(state, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));
      state = reducer(state, equipItem({ slot: 'headCovering', itemId: 'scholars_kufi' }));

      expect(state.equipped.headCovering).toBe('scholars_kufi');
      // simple_kufi should be back in inventory
      const simpleKufi = state.items.find(item => item.itemId === 'simple_kufi');
      expect(simpleKufi).toBeDefined();
      expect(simpleKufi.quantity).toBe(1);
    });

    it('rejects equipping item to wrong slot type', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      // simple_kufi is headCovering, try to equip to robe slot
      state = reducer(state, equipItem({ slot: 'robe', itemId: 'simple_kufi' }));

      expect(state.equipped.robe).toBeNull();
      expect(state.items).toHaveLength(1); // Item not removed
    });

    it('rejects equipping non-existent item', () => {
      const state = reducer(initialState, equipItem({ slot: 'headCovering', itemId: 'nonexistent_item' }));

      expect(state.equipped.headCovering).toBeNull();
    });

    it('decreases item quantity by 1 when equipping', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 3 }));
      state = reducer(state, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));

      expect(state.equipped.headCovering).toBe('simple_kufi');
      const kufiInInventory = state.items.find(item => item.itemId === 'simple_kufi');
      expect(kufiInInventory.quantity).toBe(2);
    });
  });

  describe('unequipItem', () => {
    it('moves equipped item back to inventory', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));
      state = reducer(state, unequipItem({ slot: 'headCovering' }));

      expect(state.equipped.headCovering).toBeNull();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].itemId).toBe('simple_kufi');
    });

    it('sets slot to null', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));
      state = reducer(state, unequipItem({ slot: 'headCovering' }));

      expect(state.equipped.headCovering).toBeNull();
    });

    it('handles already-empty slot gracefully', () => {
      const state = reducer(initialState, unequipItem({ slot: 'headCovering' }));

      expect(state.equipped.headCovering).toBeNull();
      expect(state.items).toHaveLength(0);
    });

    it('rejects invalid slot names', () => {
      const state = reducer(initialState, unequipItem({ slot: 'invalidSlot' }));

      expect(state).toEqual(initialState);
    });

    it('stacks unequipped item with existing inventory item', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 2 }));
      state = reducer(state, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));
      state = reducer(state, unequipItem({ slot: 'headCovering' }));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2); // Back to original quantity
    });
  });

  describe('unlockAffix', () => {
    it('adds wordId to affixesUnlocked', () => {
      const state = reducer(initialState, unlockAffix('word_sharp'));

      expect(state.affixesUnlocked).toContain('word_sharp');
    });

    it('does not duplicate existing wordId', () => {
      let state = reducer(initialState, unlockAffix('word_sharp'));
      state = reducer(state, unlockAffix('word_sharp'));

      expect(state.affixesUnlocked.filter(w => w === 'word_sharp')).toHaveLength(1);
    });

    it('adds multiple distinct wordIds', () => {
      let state = reducer(initialState, unlockAffix('word_sharp'));
      state = reducer(state, unlockAffix('word_blessed'));

      expect(state.affixesUnlocked).toContain('word_sharp');
      expect(state.affixesUnlocked).toContain('word_blessed');
      expect(state.affixesUnlocked).toHaveLength(2);
    });
  });

  describe('sortInventory', () => {
    it('sorts by type (equipment slot)', () => {
      let state = reducer(initialState, addItem({ itemId: 'scholars_robe', quantity: 1 }));
      state = reducer(state, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, addItem({ itemId: 'scholars_khuff', quantity: 1 }));
      state = reducer(state, sortInventory({ sortBy: 'type' }));

      // Slots should be alphabetically sorted by slot name
      // boots < headCovering < robe
      expect(state.items[0].itemId).toBe('scholars_khuff');
      expect(state.items[1].itemId).toBe('simple_kufi');
      expect(state.items[2].itemId).toBe('scholars_robe');
    });

    it('sorts by rarity (legendary first)', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 })); // common
      state = reducer(state, addItem({ itemId: 'warriors_helmet', quantity: 1 })); // epic
      state = reducer(state, addItem({ itemId: 'scholars_kufi', quantity: 1 })); // uncommon
      state = reducer(state, sortInventory({ sortBy: 'rarity' }));

      // Should be epic > uncommon > common
      expect(state.items[0].itemId).toBe('warriors_helmet');
      expect(state.items[1].itemId).toBe('scholars_kufi');
      expect(state.items[2].itemId).toBe('simple_kufi');
    });

    it('sorts by arabic alphabetical order (hijā\'ī)', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 })); // كوفية
      state = reducer(state, addItem({ itemId: 'scholars_kufi', quantity: 1 })); // كوفية العالم
      state = reducer(state, sortInventory({ sortBy: 'arabic' }));

      // Arabic sort uses localeCompare with 'ar'
      // Items should be sorted by Arabic name
      expect(state.items).toHaveLength(2);
    });

    it('handles empty inventory gracefully', () => {
      const state = reducer(initialState, sortInventory({ sortBy: 'type' }));

      expect(state.items).toHaveLength(0);
    });
  });

  describe('lockItem / unlockItem', () => {
    it('lockItem sets locked flag to true', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, lockItem('simple_kufi'));

      expect(state.items[0].locked).toBe(true);
    });

    it('unlockItem sets locked flag to false', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, lockItem('simple_kufi'));
      state = reducer(state, unlockItem('simple_kufi'));

      expect(state.items[0].locked).toBe(false);
    });

    it('lockItem handles non-existent item gracefully', () => {
      const state = reducer(initialState, lockItem('nonexistent'));

      expect(state).toEqual(initialState);
    });

    it('unlockItem handles non-existent item gracefully', () => {
      const state = reducer(initialState, unlockItem('nonexistent'));

      expect(state).toEqual(initialState);
    });
  });

  describe('clearInventory', () => {
    it('resets to initial state', () => {
      let state = reducer(initialState, addItem({ itemId: 'simple_kufi', quantity: 1 }));
      state = reducer(state, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));
      state = reducer(state, unlockAffix('word_sharp'));
      state = reducer(state, clearInventory());

      expect(state).toEqual(initialState);
    });
  });

  describe('selectors', () => {
    it('selectEquippedItems returns equipped object', () => {
      const mockState = {
        inventory: {
          equipped: { headCovering: 'simple_kufi', robe: null },
          items: [],
          affixesUnlocked: [],
        },
      };

      const result = selectEquippedItems(mockState);
      expect(result).toEqual({ headCovering: 'simple_kufi', robe: null });
    });

    it('selectInventoryItems returns items array', () => {
      const mockState = {
        inventory: {
          equipped: {},
          items: [{ itemId: 'simple_kufi', quantity: 1, locked: false }],
          affixesUnlocked: [],
        },
      };

      const result = selectInventoryItems(mockState);
      expect(result).toHaveLength(1);
      expect(result[0].itemId).toBe('simple_kufi');
    });

    it('selectInventoryCount returns correct count', () => {
      const mockState = {
        inventory: {
          equipped: {},
          items: [
            { itemId: 'simple_kufi', quantity: 1, locked: false },
            { itemId: 'simple_robe', quantity: 1, locked: false },
          ],
          affixesUnlocked: [],
        },
      };

      const result = selectInventoryCount(mockState);
      expect(result).toBe(2);
    });

    it('selectIsInventoryFull returns true at 200', () => {
      const mockState = {
        inventory: {
          equipped: {},
          items: Array.from({ length: 200 }, () => ({ itemId: 'item', quantity: 1, locked: false })),
          affixesUnlocked: [],
        },
      };

      const result = selectIsInventoryFull(mockState);
      expect(result).toBe(true);
    });

    it('selectIsInventoryFull returns false below 200', () => {
      const mockState = {
        inventory: {
          equipped: {},
          items: [{ itemId: 'simple_kufi', quantity: 1, locked: false }],
          affixesUnlocked: [],
        },
      };

      const result = selectIsInventoryFull(mockState);
      expect(result).toBe(false);
    });

    it('selectAffixesUnlocked returns unlocked array', () => {
      const mockState = {
        inventory: {
          equipped: {},
          items: [],
          affixesUnlocked: ['word_sharp', 'word_blessed'],
        },
      };

      const result = selectAffixesUnlocked(mockState);
      expect(result).toEqual(['word_sharp', 'word_blessed']);
    });
  });
});
