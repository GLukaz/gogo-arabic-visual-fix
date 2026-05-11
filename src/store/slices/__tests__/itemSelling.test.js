/**
 * itemSelling.test.js — Tests for FEAT-028: Item rarity tiers and vendor selling
 *
 * Tests: computeSellPrice, sellItem reducer, buyBackItem reducer,
 * selectSellableItems selector, rarity multipliers, playerSlice currency integration.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import inventoryReducer, {
  addItem,
  lockItem,
  equipItem,
  sellItem,
  buyBackItem,
  computeSellPrice,
  selectSellableItems,
} from '../inventorySlice.js';
import { RARITY_SELL_MULTIPLIERS, RARITY_TIERS } from '../../../data/equipment.js';
import playerReducer from '../playerSlice.js';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function freshInventory() {
  return inventoryReducer(undefined, { type: '@@INIT' });
}

function freshPlayer() {
  return playerReducer(undefined, { type: '@@INIT' });
}

// ──────────────────────────────────────────────
// RARITY_SELL_MULTIPLIERS shape
// ──────────────────────────────────────────────
describe('RARITY_SELL_MULTIPLIERS', () => {
  it('defines all 5 rarity tiers', () => {
    expect(RARITY_SELL_MULTIPLIERS).toHaveProperty('common');
    expect(RARITY_SELL_MULTIPLIERS).toHaveProperty('uncommon');
    expect(RARITY_SELL_MULTIPLIERS).toHaveProperty('rare');
    expect(RARITY_SELL_MULTIPLIERS).toHaveProperty('epic');
    expect(RARITY_SELL_MULTIPLIERS).toHaveProperty('legendary');
  });

  it('has correct multiplier values (1/2/5/15/50)', () => {
    expect(RARITY_SELL_MULTIPLIERS.common).toBe(1);
    expect(RARITY_SELL_MULTIPLIERS.uncommon).toBe(2);
    expect(RARITY_SELL_MULTIPLIERS.rare).toBe(5);
    expect(RARITY_SELL_MULTIPLIERS.epic).toBe(15);
    expect(RARITY_SELL_MULTIPLIERS.legendary).toBe(50);
  });

  it('RARITY_TIERS has color codes for all 5 tiers', () => {
    for (const tier of ['common', 'uncommon', 'rare', 'epic', 'legendary']) {
      expect(RARITY_TIERS[tier]).toBeDefined();
      expect(RARITY_TIERS[tier].color).toMatch(/^#/);
    }
  });
});

// ──────────────────────────────────────────────
// computeSellPrice
// ──────────────────────────────────────────────
describe('computeSellPrice', () => {
  // simple_kufi: common, sellPrice=10 → 10*1=10
  it('returns sellPrice * 1 for common items', () => {
    expect(computeSellPrice('simple_kufi', 1)).toBe(10);
  });

  // scholars_kufi: uncommon, sellPrice=75 → 75*2=150
  it('returns sellPrice * 2 for uncommon items', () => {
    expect(computeSellPrice('scholars_kufi', 1)).toBe(150);
  });

  it('scales by quantity', () => {
    expect(computeSellPrice('simple_kufi', 3)).toBe(30);
  });

  it('returns 0 for unknown itemId', () => {
    expect(computeSellPrice('nonexistent_item', 1)).toBe(0);
  });

  it('defaults quantity to 1', () => {
    expect(computeSellPrice('simple_kufi')).toBe(10);
  });
});

// ──────────────────────────────────────────────
// sellItem reducer
// ──────────────────────────────────────────────
describe('sellItem reducer', () => {
  let state;

  beforeEach(() => {
    state = inventoryReducer(freshInventory(), addItem({ itemId: 'simple_kufi', quantity: 3 }));
  });

  it('removes item from inventory on sell', () => {
    state = inventoryReducer(state, sellItem({ itemId: 'simple_kufi', quantity: 1 }));
    const item = state.items.find(i => i.itemId === 'simple_kufi');
    expect(item.quantity).toBe(2);
  });

  it('removes item entirely when full quantity sold', () => {
    state = inventoryReducer(state, sellItem({ itemId: 'simple_kufi', quantity: 3 }));
    expect(state.items.find(i => i.itemId === 'simple_kufi')).toBeUndefined();
  });

  it('adds entry to buyBackHistory with correct prices', () => {
    state = inventoryReducer(state, sellItem({ itemId: 'simple_kufi', quantity: 1 }));
    expect(state.buyBackHistory).toHaveLength(1);
    expect(state.buyBackHistory[0].itemId).toBe('simple_kufi');
    expect(state.buyBackHistory[0].sellTotal).toBe(10); // common: 10*1
    expect(state.buyBackHistory[0].buyBackPrice).toBe(12); // ceil(10*1.2)
    expect(state.buyBackHistory[0].quantity).toBe(1);
  });

  it('does not sell locked items', () => {
    state = inventoryReducer(state, lockItem('simple_kufi'));
    state = inventoryReducer(state, sellItem({ itemId: 'simple_kufi', quantity: 1 }));
    // item should still be in inventory, no buyBackHistory
    expect(state.items.find(i => i.itemId === 'simple_kufi').quantity).toBe(3);
    expect(state.buyBackHistory).toHaveLength(0);
  });

  it('does not sell equipped items', () => {
    // Add then equip
    let s = inventoryReducer(freshInventory(), addItem({ itemId: 'simple_kufi', quantity: 1 }));
    s = inventoryReducer(s, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));
    // Now try to sell a different copy of same item that isn't in inventory
    s = inventoryReducer(s, sellItem({ itemId: 'simple_kufi', quantity: 1 }));
    // item not in items array (it was equipped) → sell should no-op
    expect(s.buyBackHistory).toHaveLength(0);
  });

  it('caps buyBackHistory at 10 (FIFO eviction)', () => {
    // Sell 11 times
    let s = inventoryReducer(freshInventory(), addItem({ itemId: 'simple_kufi', quantity: 20 }));
    for (let i = 0; i < 11; i++) {
      s = inventoryReducer(s, sellItem({ itemId: 'simple_kufi', quantity: 1 }));
    }
    expect(s.buyBackHistory).toHaveLength(10);
  });

  it('buyBackPrice is 20% markup over sellTotal (rounded up)', () => {
    state = inventoryReducer(state, sellItem({ itemId: 'simple_kufi', quantity: 1 }));
    const entry = state.buyBackHistory[0];
    expect(entry.buyBackPrice).toBe(Math.ceil(entry.sellTotal * 1.2));
  });
});

// ──────────────────────────────────────────────
// buyBackItem reducer
// ──────────────────────────────────────────────
describe('buyBackItem reducer', () => {
  let state;

  beforeEach(() => {
    // Sell an item first to populate buyBackHistory
    state = inventoryReducer(freshInventory(), addItem({ itemId: 'simple_kufi', quantity: 1 }));
    state = inventoryReducer(state, sellItem({ itemId: 'simple_kufi', quantity: 1 }));
  });

  it('returns item to inventory', () => {
    const entry = state.buyBackHistory[0];
    state = inventoryReducer(state, buyBackItem({ index: 0, buyBackPrice: entry.buyBackPrice }));
    expect(state.items.find(i => i.itemId === 'simple_kufi')).toBeDefined();
  });

  it('removes entry from buyBackHistory', () => {
    const entry = state.buyBackHistory[0];
    state = inventoryReducer(state, buyBackItem({ index: 0, buyBackPrice: entry.buyBackPrice }));
    expect(state.buyBackHistory).toHaveLength(0);
  });

  it('stacks with existing inventory item on buyback', () => {
    // Add another kufi to inventory before buying back
    state = inventoryReducer(state, addItem({ itemId: 'simple_kufi', quantity: 2 }));
    const entry = state.buyBackHistory[0];
    state = inventoryReducer(state, buyBackItem({ index: 0, buyBackPrice: entry.buyBackPrice }));
    expect(state.items.find(i => i.itemId === 'simple_kufi').quantity).toBe(3);
  });

  it('does nothing for invalid index', () => {
    state = inventoryReducer(state, buyBackItem({ index: 99, buyBackPrice: 100 }));
    expect(state.buyBackHistory).toHaveLength(1); // unchanged
  });
});

// ──────────────────────────────────────────────
// selectSellableItems
// ──────────────────────────────────────────────
describe('selectSellableItems', () => {
  it('returns non-locked, non-equipped items', () => {
    let inv = freshInventory();
    inv = inventoryReducer(inv, addItem({ itemId: 'simple_kufi', quantity: 2 }));
    inv = inventoryReducer(inv, addItem({ itemId: 'scholars_kufi', quantity: 1 }));
    const mockState = { inventory: inv };
    const sellable = selectSellableItems(mockState);
    expect(sellable).toHaveLength(2);
  });

  it('excludes locked items', () => {
    let inv = freshInventory();
    inv = inventoryReducer(inv, addItem({ itemId: 'simple_kufi', quantity: 1 }));
    inv = inventoryReducer(inv, lockItem('simple_kufi'));
    const mockState = { inventory: inv };
    expect(selectSellableItems(mockState)).toHaveLength(0);
  });

  it('excludes equipped items', () => {
    let inv = freshInventory();
    inv = inventoryReducer(inv, addItem({ itemId: 'simple_kufi', quantity: 1 }));
    inv = inventoryReducer(inv, equipItem({ slot: 'headCovering', itemId: 'simple_kufi' }));
    const mockState = { inventory: inv };
    // simple_kufi is now equipped (removed from items), so selectSellableItems should be empty
    expect(selectSellableItems(mockState)).toHaveLength(0);
  });

  it('returns empty array for empty inventory', () => {
    const mockState = { inventory: freshInventory() };
    expect(selectSellableItems(mockState)).toHaveLength(0);
  });
});

// ──────────────────────────────────────────────
// playerSlice currency integration
// ──────────────────────────────────────────────
describe('playerSlice currency integration', () => {
  it('adds sellTotal as fils to player currency on sellItem', () => {
    const action = sellItem({ itemId: 'simple_kufi', quantity: 1 });
    const player = playerReducer(freshPlayer(), action);
    // simple_kufi: common, sellPrice=10 → sellTotal=10
    const total = player.currency.fils + player.currency.dirhams * 100 + player.currency.dinars * 10000;
    expect(total).toBe(10);
  });

  it('auto-converts 100 fils to 1 dirham', () => {
    // scholars_kufi: uncommon, sellPrice=75 → sellTotal=150 fils → 1 dirham 50 fils
    const action = sellItem({ itemId: 'scholars_kufi', quantity: 1 });
    const player = playerReducer(freshPlayer(), action);
    expect(player.currency.dirhams).toBe(1);
    expect(player.currency.fils).toBe(50);
  });

  it('does not deduct when player cannot afford buyback (10 fils, need 12)', () => {
    const sellAction = sellItem({ itemId: 'simple_kufi', quantity: 1 }); // +10 fils
    let player = playerReducer(freshPlayer(), sellAction);
    // buyBackPrice = ceil(10 * 1.2) = 12 — player only has 10, can't afford
    player = playerReducer(player, buyBackItem({ index: 0, buyBackPrice: 12 }));
    const total = player.currency.fils + player.currency.dirhams * 100 + player.currency.dinars * 10000;
    expect(total).toBe(10); // unchanged — cannot afford
  });

  it('deducts when player has enough currency', () => {
    let player = freshPlayer();
    // Sell scholars_kufi twice: 2 × 150 fils = 300 fils (3 dirhams)
    player = playerReducer(player, sellItem({ itemId: 'scholars_kufi', quantity: 1 }));
    player = playerReducer(player, sellItem({ itemId: 'scholars_kufi', quantity: 1 }));
    // buyBackPrice for scholars_kufi = ceil(150 * 1.2) = 180
    player = playerReducer(player, buyBackItem({ index: 0, buyBackPrice: 180 }));
    const total = player.currency.fils + player.currency.dirhams * 100 + player.currency.dinars * 10000;
    expect(total).toBe(120); // 300 - 180 = 120 fils remaining
  });

  it('does not deduct currency if player cannot afford buyback', () => {
    let player = freshPlayer(); // 0 currency
    player = playerReducer(player, buyBackItem({ index: 0, buyBackPrice: 100 }));
    const total = player.currency.fils + player.currency.dirhams * 100 + player.currency.dinars * 10000;
    expect(total).toBe(0);
  });
});
