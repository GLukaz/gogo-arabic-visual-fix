import { createSlice, createSelector } from '@reduxjs/toolkit';
import { EQUIPMENT_DATA, RARITY_SELL_MULTIPLIERS } from '../../data/equipment.js';
import { calculateTotalEquipmentStats } from '../../utils/itemStats.js';

/** Compute the total sell value for itemId × quantity using rarity multiplier. */
export function computeSellPrice(itemId, quantity = 1) {
  const item = EQUIPMENT_DATA[itemId];
  if (!item) return 0;
  const base = item.sellPrice ?? 0;
  const multiplier = RARITY_SELL_MULTIPLIERS[item.rarity] ?? 1;
  return base * multiplier * quantity;
}

export const MAX_INVENTORY_SIZE = 200;

const initialState = {
  equipped: {
    headCovering: null,
    robe: null,
    cloak: null,
    belt: null,
    boots: null,
    gloves: null,
    accessory1: null,
    accessory2: null,
  },
  items: [],           // [{ itemId: string, quantity: number, locked: boolean }] — max 200
  affixesUnlocked: [], // wordIds the player has discovered via equipment
  enchantments: {},    // { [slot]: { inscription, bonus: { stat, value } } } — Phase 31
  buyBackHistory: [],  // [{ itemId, quantity, sellTotal, buyBackPrice, soldAt }] — last 10
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem(state, action) {
      // payload: { itemId, quantity = 1 }
      const { itemId, quantity = 1 } = action.payload;

      const existingItem = state.items.find(item => item.itemId === itemId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // Cap at MAX_INVENTORY_SIZE slots for new items
        if (state.items.length >= MAX_INVENTORY_SIZE) {
          console.warn(`[inventorySlice] Inventory full (${MAX_INVENTORY_SIZE} items)`);
          return;
        }
        state.items.push({ itemId, quantity, locked: false });
      }
    },

    removeItem(state, action) {
      // payload: { itemId, quantity = 1 }
      const { itemId, quantity = 1 } = action.payload;

      const existingItem = state.items.find(item => item.itemId === itemId);
      if (!existingItem) {
        console.warn(`[inventorySlice] Cannot remove non-existent item '${itemId}'`);
        return;
      }

      existingItem.quantity -= quantity;

      // Remove from array if quantity reaches 0
      if (existingItem.quantity <= 0) {
        state.items = state.items.filter(item => item.itemId !== itemId);
      }
    },

    equipItem(state, action) {
      // payload: { slot, itemId }
      const { slot, itemId } = action.payload;

      // Validate slot exists
      if (!Object.prototype.hasOwnProperty.call(state.equipped, slot)) {
        console.error(`[inventorySlice] Invalid equipment slot '${slot}'`);
        return;
      }

      // Look up item to verify it's valid equipment
      const itemData = EQUIPMENT_DATA[itemId];
      if (!itemData) {
        console.error(`[inventorySlice] Cannot equip non-existent item '${itemId}'`);
        return;
      }

      // Verify item matches slot
      if (itemData.slot !== slot) {
        console.error(`[inventorySlice] Item '${itemId}' cannot be equipped in slot '${slot}' (requires ${itemData.slot})`);
        return;
      }

      // If slot already has an item, unequip it first
      if (state.equipped[slot]) {
        const previousItemId = state.equipped[slot];
        const existingInventoryItem = state.items.find(item => item.itemId === previousItemId);
        if (existingInventoryItem) {
          existingInventoryItem.quantity += 1;
        } else {
          state.items.push({ itemId: previousItemId, quantity: 1, locked: false });
        }
      }

      // Equip new item
      state.equipped[slot] = itemId;

      // Remove from inventory
      const inventoryItem = state.items.find(item => item.itemId === itemId);
      if (inventoryItem) {
        inventoryItem.quantity -= 1;
        if (inventoryItem.quantity <= 0) {
          state.items = state.items.filter(item => item.itemId !== itemId);
        }
      }
    },

    unequipItem(state, action) {
      // payload: { slot }
      const { slot } = action.payload;

      // Validate slot exists
      if (!Object.prototype.hasOwnProperty.call(state.equipped, slot)) {
        console.error(`[inventorySlice] Invalid equipment slot '${slot}'`);
        return;
      }

      const itemId = state.equipped[slot];
      if (!itemId) {
        console.warn(`[inventorySlice] Slot '${slot}' is already empty`);
        return;
      }

      // Return item to inventory
      const existingItem = state.items.find(item => item.itemId === itemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ itemId, quantity: 1, locked: false });
      }

      // Clear slot
      state.equipped[slot] = null;
    },

    unlockAffix(state, action) {
      // payload: wordId
      const wordId = action.payload;

      if (!state.affixesUnlocked.includes(wordId)) {
        state.affixesUnlocked.push(wordId);
      }
    },

    sortInventory(state, action) {
      // payload: { sortBy: 'type' | 'rarity' | 'arabic' }
      const { sortBy } = action.payload;

      if (sortBy === 'type') {
        // Sort by slot type
        state.items.sort((a, b) => {
          const slotA = EQUIPMENT_DATA[a.itemId]?.slot || '';
          const slotB = EQUIPMENT_DATA[b.itemId]?.slot || '';
          return slotA.localeCompare(slotB);
        });
      } else if (sortBy === 'rarity') {
        // Sort by rarity level (common=1, legendary=5)
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
        state.items.sort((a, b) => {
          const rarityA = rarityOrder[EQUIPMENT_DATA[a.itemId]?.rarity] || 0;
          const rarityB = rarityOrder[EQUIPMENT_DATA[b.itemId]?.rarity] || 0;
          return rarityB - rarityA; // Descending
        });
      } else if (sortBy === 'arabic') {
        // Sort by Arabic name (hijā'ī order approximation using localeCompare)
        state.items.sort((a, b) => {
          const nameA = EQUIPMENT_DATA[a.itemId]?.nameArabic || '';
          const nameB = EQUIPMENT_DATA[b.itemId]?.nameArabic || '';
          return nameA.localeCompare(nameB, 'ar');
        });
      }
    },

    lockItem(state, action) {
      // payload: itemId
      const itemId = action.payload;
      const item = state.items.find(i => i.itemId === itemId);
      if (item) {
        item.locked = true;
      }
    },

    unlockItem(state, action) {
      // payload: itemId
      const itemId = action.payload;
      const item = state.items.find(i => i.itemId === itemId);
      if (item) {
        item.locked = false;
      }
    },

    clearInventory(state) {
      // Reset to initial state (for testing/reset)
      Object.assign(state, initialState);
    },

    sellItem: {
      // payload: { itemId, quantity, sellTotal, buyBackPrice }
      // sellTotal and buyBackPrice are precomputed by the prepare callback so
      // playerSlice extraReducers can read them without re-importing equipment data.
      prepare({ itemId, quantity = 1 }) {
        const sellTotal = computeSellPrice(itemId, quantity);
        const buyBackPrice = Math.ceil(sellTotal * 1.2);
        return { payload: { itemId, quantity, sellTotal, buyBackPrice } };
      },
      reducer(state, action) {
        const { itemId, quantity, sellTotal, buyBackPrice } = action.payload;

        const inventoryItem = state.items.find(i => i.itemId === itemId);
        if (!inventoryItem || inventoryItem.locked) return;

        const isEquipped = Object.values(state.equipped).includes(itemId);
        if (isEquipped) return;

        // Record in buyBackHistory (max 10, FIFO)
        state.buyBackHistory.push({
          itemId,
          quantity,
          sellTotal,
          buyBackPrice,
          soldAt: Date.now(),
        });
        if (state.buyBackHistory.length > 10) {
          state.buyBackHistory.shift();
        }

        // Remove from inventory
        inventoryItem.quantity -= quantity;
        if (inventoryItem.quantity <= 0) {
          state.items = state.items.filter(i => i.itemId !== itemId);
        }
      },
    },

    buyBackItem(state, action) {
      // payload: { index, buyBackPrice } — index into buyBackHistory; caller provides price
      const { index } = action.payload;
      const entry = state.buyBackHistory[index];
      if (!entry) return;

      // Return item to inventory
      const existing = state.items.find(i => i.itemId === entry.itemId);
      if (existing) {
        existing.quantity += entry.quantity;
      } else {
        state.items.push({ itemId: entry.itemId, quantity: entry.quantity, locked: false });
      }

      // Remove from buyback history
      state.buyBackHistory.splice(index, 1);
    },

    // ─── Phase 31 crafting consumable and enchantment reducers ───

    consumeItem(state, action) {
      // payload: { itemId }
      // Decrements quantity. Caller must apply buff via battleSlice.applyBuff
      const { itemId } = action.payload;

      const item = state.items.find((i) => i.itemId === itemId);
      if (!item) {
        console.warn(`[inventorySlice] Cannot use non-existent consumable '${itemId}'`);
        return;
      }

      item.quantity -= 1;

      // Remove from inventory if quantity reaches 0
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.itemId !== itemId);
      }
    },

    applyEnchantment(state, action) {
      // payload: { scrollItemId, targetSlot, inscription, bonus: { stat, value } }
      // Consumes scroll, adds enchantment to equipped item in slot
      const { scrollItemId, targetSlot, inscription, bonus } = action.payload;

      // Validate slot exists
      if (!Object.prototype.hasOwnProperty.call(state.equipped, targetSlot)) {
        console.error(`[inventorySlice] Invalid equipment slot '${targetSlot}'`);
        return;
      }

      // Check if slot has equipped item
      const equippedItemId = state.equipped[targetSlot];
      if (!equippedItemId) {
        console.warn(`[inventorySlice] Cannot enchant empty slot '${targetSlot}'`);
        return;
      }

      // Check if scroll exists in inventory
      const scrollItem = state.items.find((i) => i.itemId === scrollItemId);
      if (!scrollItem) {
        console.warn(`[inventorySlice] Enchantment scroll '${scrollItemId}' not found`);
        return;
      }

      // Consume scroll
      scrollItem.quantity -= 1;
      if (scrollItem.quantity <= 0) {
        state.items = state.items.filter((i) => i.itemId !== scrollItemId);
      }

      // Add enchantment to slot (replaces existing if any)
      state.enchantments[targetSlot] = {
        inscription: inscription || 'بسم الله الرحمن الرحيم', // Default Arabic inscription
        bonus: bonus || { stat: 'hp', value: 5 },
      };
    },
  },
});

export const {
  addItem,
  removeItem,
  equipItem,
  unequipItem,
  unlockAffix,
  sortInventory,
  lockItem,
  unlockItem,
  clearInventory,
  consumeItem,
  applyEnchantment,
  sellItem,
  buyBackItem,
} = inventorySlice.actions;

// ────────────────────────────────────────────────
// Selectors
// ────────────────────────────────────────────────

export const selectEquippedItems = (state) => state.inventory.equipped;

export const selectInventoryItems = (state) => state.inventory.items;

export const selectBuyBackHistory = (state) => state.inventory.buyBackHistory;

/**
 * selectSellableItems — inventory items that are not locked and not currently equipped.
 */
export const selectSellableItems = createSelector(
  [selectInventoryItems, selectEquippedItems],
  (items, equipped) => {
    const equippedIds = new Set(Object.values(equipped).filter(Boolean));
    return items.filter(item => !item.locked && !equippedIds.has(item.itemId));
  }
);

export const selectAffixesUnlocked = (state) => state.inventory.affixesUnlocked;

export const selectInventoryCount = (state) => state.inventory.items.length;

export const selectIsInventoryFull = (state) => state.inventory.items.length >= MAX_INVENTORY_SIZE;

/**
 * Compute total equipment stats including affixes, set bonuses, and enchantments
 * Requires access to vocabularySlice for affix multiplier calculation
 */
export const selectEquipmentStats = createSelector(
  [selectEquippedItems, (state) => state.vocabulary, (state) => state.inventory.enchantments],
  (equipped, vocabularyState, enchantments) => {
    return calculateTotalEquipmentStats(equipped, vocabularyState, enchantments);
  }
);

/**
 * Select enchanted equipment (Phase 31)
 * Returns equipped items with their enchantments
 */
export const selectEnchantedEquipment = createSelector(
  [selectEquippedItems, (state) => state.inventory.enchantments],
  (equipped, enchantments) => {
    const enchantedItems = {};
    for (const [slot, itemId] of Object.entries(equipped)) {
      if (itemId && enchantments[slot]) {
        enchantedItems[slot] = {
          itemId,
          enchantment: enchantments[slot],
        };
      }
    }
    return enchantedItems;
  }
);

export default inventorySlice.reducer;
