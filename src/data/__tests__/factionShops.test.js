import { describe, it, expect } from 'vitest';
import {
  FACTION_SHOP_DATA,
  TIER_ORDER,
  TIER_DISCOUNTS,
  getFactionDiscount,
  getShopInventory,
  applyFactionDiscount,
  selectAvailableFactionShops,
} from '../factionShops.js';
import { FACTION_IDS } from '../factions.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a minimal Redux state with faction alignment scores. */
function makeState(alignmentOverrides = {}) {
  const base = {
    scholars:  0,
    merchants: 0,
    artisans:  0,
    travelers: 0,
    guardians: 0,
    artists:   0,
  };
  return {
    faction: {
      alignment: { ...base, ...alignmentOverrides },
    },
  };
}

// ─── Data integrity ───────────────────────────────────────────────────────────

describe('FACTION_SHOP_DATA — data integrity', () => {
  it('contains all 6 faction shops', () => {
    const ids = Object.keys(FACTION_SHOP_DATA);
    expect(ids).toHaveLength(6);
    expect(ids).toContain(FACTION_IDS.SCHOLARS);
    expect(ids).toContain(FACTION_IDS.MERCHANTS);
    expect(ids).toContain(FACTION_IDS.ARTISANS);
    expect(ids).toContain(FACTION_IDS.TRAVELERS);
    expect(ids).toContain(FACTION_IDS.GUARDIANS);
    expect(ids).toContain(FACTION_IDS.ARTISTS);
  });

  it('each shop has exactly 5 exclusive items', () => {
    for (const [factionId, shop] of Object.entries(FACTION_SHOP_DATA)) {
      expect(shop.items, `${factionId} should have 5 items`).toHaveLength(5);
    }
  });

  it('each shop covers all 5 tiers (one item per tier)', () => {
    for (const [factionId, shop] of Object.entries(FACTION_SHOP_DATA)) {
      const tiers = shop.items.map((item) => item.requiredTier);
      for (const tier of TIER_ORDER) {
        expect(tiers, `${factionId} shop missing tier "${tier}"`).toContain(tier);
      }
    }
  });

  it('each item has required fields (id, nameArabic, name, type, price, requiredTier, description)', () => {
    for (const shop of Object.values(FACTION_SHOP_DATA)) {
      for (const item of shop.items) {
        expect(item.id).toBeTruthy();
        expect(item.nameArabic).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.type).toBeTruthy();
        expect(typeof item.price).toBe('number');
        expect(item.price).toBeGreaterThan(0);
        expect(TIER_ORDER).toContain(item.requiredTier);
        expect(item.description).toBeTruthy();
      }
    }
  });

  it('all item IDs are unique across all shops', () => {
    const allIds = Object.values(FACTION_SHOP_DATA).flatMap((shop) =>
      shop.items.map((item) => item.id)
    );
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});

// ─── getFactionDiscount ───────────────────────────────────────────────────────

describe('getFactionDiscount', () => {
  it('returns 0 for Neutral tier', () => {
    expect(getFactionDiscount(FACTION_IDS.SCHOLARS, 'Neutral')).toBe(0);
  });

  it('returns 5% for Friendly tier', () => {
    expect(getFactionDiscount(FACTION_IDS.MERCHANTS, 'Friendly')).toBe(0.05);
  });

  it('returns 10% for Trusted tier', () => {
    expect(getFactionDiscount(FACTION_IDS.ARTISANS, 'Trusted')).toBe(0.10);
  });

  it('returns 15% for Allied tier', () => {
    expect(getFactionDiscount(FACTION_IDS.GUARDIANS, 'Allied')).toBe(0.15);
  });

  it('returns 25% for Revered tier', () => {
    expect(getFactionDiscount(FACTION_IDS.ARTISTS, 'Revered')).toBe(0.25);
  });

  it('returns 0 for unknown tier', () => {
    expect(getFactionDiscount(FACTION_IDS.SCHOLARS, 'Unknown')).toBe(0);
  });

  it('returns same discounts regardless of factionId', () => {
    for (const tier of TIER_ORDER) {
      const discount = TIER_DISCOUNTS[tier];
      for (const factionId of Object.values(FACTION_IDS)) {
        expect(getFactionDiscount(factionId, tier)).toBe(discount);
      }
    }
  });
});

// ─── getShopInventory ─────────────────────────────────────────────────────────

describe('getShopInventory', () => {
  it('returns only Neutral tier items at Neutral standing', () => {
    const items = getShopInventory(FACTION_IDS.SCHOLARS, 'Neutral');
    expect(items).toHaveLength(1);
    expect(items[0].requiredTier).toBe('Neutral');
  });

  it('returns cumulative items (Neutral + Friendly) at Friendly standing', () => {
    const items = getShopInventory(FACTION_IDS.SCHOLARS, 'Friendly');
    expect(items).toHaveLength(2);
    const tiers = items.map((i) => i.requiredTier);
    expect(tiers).toContain('Neutral');
    expect(tiers).toContain('Friendly');
  });

  it('returns all 5 items at Revered standing', () => {
    const items = getShopInventory(FACTION_IDS.SCHOLARS, 'Revered');
    expect(items).toHaveLength(5);
  });

  it('returns correct cumulative count at Trusted standing (3 items)', () => {
    const items = getShopInventory(FACTION_IDS.MERCHANTS, 'Trusted');
    expect(items).toHaveLength(3);
  });

  it('returns correct cumulative count at Allied standing (4 items)', () => {
    const items = getShopInventory(FACTION_IDS.ARTISANS, 'Allied');
    expect(items).toHaveLength(4);
  });

  it('returns empty array for unknown factionId', () => {
    expect(getShopInventory('unknown_faction', 'Trusted')).toEqual([]);
  });

  it('returns empty array for unknown tier label', () => {
    expect(getShopInventory(FACTION_IDS.SCHOLARS, 'Initiate')).toEqual([]);
  });

  it('works correctly for all 6 factions at Revered standing', () => {
    for (const factionId of Object.values(FACTION_IDS)) {
      const items = getShopInventory(factionId, 'Revered');
      expect(items, `${factionId} Revered should have 5 items`).toHaveLength(5);
    }
  });
});

// ─── applyFactionDiscount ─────────────────────────────────────────────────────

describe('applyFactionDiscount', () => {
  it('returns full price at Neutral alignment (score 0)', () => {
    const state = makeState({ scholars: 0 });
    expect(applyFactionDiscount(100, FACTION_IDS.SCHOLARS, state)).toBe(100);
  });

  it('applies 5% discount at Friendly alignment (score 25)', () => {
    const state = makeState({ merchants: 25 });
    expect(applyFactionDiscount(200, FACTION_IDS.MERCHANTS, state)).toBe(190);
  });

  it('applies 10% discount at Trusted alignment (score 50)', () => {
    const state = makeState({ artisans: 50 });
    expect(applyFactionDiscount(300, FACTION_IDS.ARTISANS, state)).toBe(270);
  });

  it('applies 15% discount at Allied alignment (score 75)', () => {
    const state = makeState({ guardians: 75 });
    expect(applyFactionDiscount(400, FACTION_IDS.GUARDIANS, state)).toBe(340);
  });

  it('applies 25% discount at Revered alignment (score 100)', () => {
    const state = makeState({ artists: 100 });
    expect(applyFactionDiscount(1000, FACTION_IDS.ARTISTS, state)).toBe(750);
  });

  it('floors fractional gold to integer', () => {
    // 5% off 99 = 94.05 → floors to 94
    const state = makeState({ scholars: 25 });
    expect(applyFactionDiscount(99, FACTION_IDS.SCHOLARS, state)).toBe(94);
  });

  it('handles null playerState gracefully (treats as Neutral)', () => {
    expect(applyFactionDiscount(100, FACTION_IDS.SCHOLARS, null)).toBe(100);
  });
});

// ─── selectAvailableFactionShops ─────────────────────────────────────────────

describe('selectAvailableFactionShops', () => {
  it('returns empty array when all alignments are 0 (Neutral)', () => {
    const state = makeState();
    expect(selectAvailableFactionShops(state)).toHaveLength(0);
  });

  it('returns shop once a faction reaches Friendly (score 25)', () => {
    const state = makeState({ scholars: 25 });
    const shops = selectAvailableFactionShops(state);
    expect(shops).toHaveLength(1);
    expect(shops[0].factionId).toBe(FACTION_IDS.SCHOLARS);
  });

  it('returns multiple shops when player has Friendly+ with multiple factions', () => {
    const state = makeState({ scholars: 25, merchants: 50, guardians: 75 });
    const shops = selectAvailableFactionShops(state);
    expect(shops).toHaveLength(3);
    const ids = shops.map((s) => s.factionId);
    expect(ids).toContain(FACTION_IDS.SCHOLARS);
    expect(ids).toContain(FACTION_IDS.MERCHANTS);
    expect(ids).toContain(FACTION_IDS.GUARDIANS);
  });

  it('each returned shop includes shopId, factionId, name, nameArabic, playerTier', () => {
    const state = makeState({ scholars: 50 });
    const shops = selectAvailableFactionShops(state);
    expect(shops).toHaveLength(1);
    const shop = shops[0];
    expect(shop.shopId).toBe('shop_scholars');
    expect(shop.factionId).toBe(FACTION_IDS.SCHOLARS);
    expect(shop.name).toBeTruthy();
    expect(shop.nameArabic).toBeTruthy();
    expect(shop.playerTier).toBe('Trusted');
  });

  it('returns all 6 shops when player has max alignment everywhere', () => {
    const state = makeState({
      scholars: 100,
      merchants: 100,
      artisans: 100,
      travelers: 100,
      guardians: 100,
      artists: 100,
    });
    expect(selectAvailableFactionShops(state)).toHaveLength(6);
  });

  it('does NOT include faction at exactly score 24 (below Friendly threshold)', () => {
    const state = makeState({ merchants: 24 });
    expect(selectAvailableFactionShops(state)).toHaveLength(0);
  });
});
