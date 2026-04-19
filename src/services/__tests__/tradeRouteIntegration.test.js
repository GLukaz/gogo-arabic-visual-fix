import { describe, it, expect } from 'vitest';
import {
  getItemTradeCategory,
  getZonePriceMultiplier,
  getZoneSellMultiplier,
  getZoneAdjustedBuyPrice,
  getZoneAdjustedSellPrice,
  getCheapestZoneForItem,
  getBestSellZoneForItem,
  getShopZoneInfo,
  SHOP_ZONE_MAP,
} from '../tradeRouteIntegration.js';

describe('tradeRouteIntegration', () => {
  describe('getItemTradeCategory', () => {
    it('maps weapon slot to metals', () => {
      expect(getItemTradeCategory({ slot: 'weapon', rarity: 'common' })).toBe('metals');
    });

    it('maps armor slot to textiles', () => {
      expect(getItemTradeCategory({ slot: 'armor', rarity: 'common' })).toBe('textiles');
    });

    it('maps ring slot to gems', () => {
      expect(getItemTradeCategory({ slot: 'ring', rarity: 'rare' })).toBe('gems');
    });

    it('falls back to rarity when slot is unknown', () => {
      expect(getItemTradeCategory({ slot: 'unknown_slot', rarity: 'epic' })).toBe('gems');
    });

    it('returns metals for null itemData', () => {
      expect(getItemTradeCategory(null)).toBe('metals');
    });
  });

  describe('SHOP_ZONE_MAP', () => {
    it('maps oasis_village_shop to oasis_village', () => {
      expect(SHOP_ZONE_MAP['oasis_village_shop']).toBe('oasis_village');
    });

    it('maps ancient_library_shop to ancient_library', () => {
      expect(SHOP_ZONE_MAP['ancient_library_shop']).toBe('ancient_library');
    });
  });

  describe('getZonePriceMultiplier', () => {
    const weaponItem = { slot: 'weapon', rarity: 'common' };

    it('returns 1.0 for unknown shopId', () => {
      expect(getZonePriceMultiplier(weaponItem, 'unknown_shop')).toBe(1.0);
    });

    it('returns 1.0 for null itemData', () => {
      expect(getZonePriceMultiplier(null, 'oasis_village_shop')).toBe(1.0);
    });

    it('returns a zone-specific multiplier for known shopId', () => {
      const multiplier = getZonePriceMultiplier(weaponItem, 'oasis_village_shop');
      expect(typeof multiplier).toBe('number');
      expect(multiplier).toBeGreaterThan(0);
    });

    it('returns different multipliers for different zones', () => {
      const oasisMultiplier = getZonePriceMultiplier(weaponItem, 'oasis_village_shop');
      const desertMultiplier = getZonePriceMultiplier(weaponItem, 'desert_marketplace_shop');
      // metals: oasis buys at 1.4, desert at 1.0 — different
      expect(oasisMultiplier).not.toBe(desertMultiplier);
    });
  });

  describe('getZoneAdjustedBuyPrice', () => {
    const scrollItem = { slot: 'scroll', rarity: 'uncommon' };

    it('returns at least 1 for any price', () => {
      expect(getZoneAdjustedBuyPrice(0, scrollItem, 'ancient_library_shop')).toBeGreaterThanOrEqual(1);
    });

    it('applies multiplier to base price', () => {
      const base = 100;
      const adjusted = getZoneAdjustedBuyPrice(base, scrollItem, 'ancient_library_shop');
      // ancient_library buys scrolls at 0.5x (cheap!)
      expect(adjusted).toBeLessThan(base);
    });

    it('returns original price for unknown shopId', () => {
      const base = 50;
      const adjusted = getZoneAdjustedBuyPrice(base, scrollItem, 'unknown_shop');
      expect(adjusted).toBe(50);
    });
  });

  describe('getZoneAdjustedSellPrice', () => {
    const scrollItem = { slot: 'scroll', rarity: 'uncommon' };

    it('applies sell multiplier to base price', () => {
      const base = 100;
      const adjusted = getZoneAdjustedSellPrice(base, scrollItem, 'ancient_library_shop');
      // ancient_library sells scrolls at 1.6x (high sell price)
      expect(adjusted).toBeGreaterThan(base);
    });

    it('returns original price for unknown shopId', () => {
      expect(getZoneAdjustedSellPrice(80, scrollItem, 'unknown_shop')).toBe(80);
    });
  });

  describe('getCheapestZoneForItem', () => {
    it('returns null for null itemData', () => {
      expect(getCheapestZoneForItem(null)).toBeNull();
    });

    it('returns cheapest zone with zone and zoneName', () => {
      const result = getCheapestZoneForItem({ slot: 'scroll', rarity: 'uncommon' });
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('zone');
      expect(result).toHaveProperty('zoneName');
      expect(result).toHaveProperty('buyPrice');
    });
  });

  describe('getBestSellZoneForItem', () => {
    it('returns null for null itemData', () => {
      expect(getBestSellZoneForItem(null)).toBeNull();
    });

    it('returns best sell zone with zone and zoneName', () => {
      const result = getBestSellZoneForItem({ slot: 'weapon', rarity: 'common' });
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('zone');
      expect(result).toHaveProperty('zoneName');
    });
  });

  describe('getShopZoneInfo', () => {
    it('returns null for unknown shopId', () => {
      expect(getShopZoneInfo('unknown_shop')).toBeNull();
    });

    it('returns zoneName and specialty for known shopId', () => {
      const info = getShopZoneInfo('oasis_village_shop');
      expect(info).not.toBeNull();
      expect(info).toHaveProperty('zoneName');
      expect(info).toHaveProperty('specialty');
      expect(info.zoneName).toBe('Oasis Village');
    });

    it('returns specialty matching the zone specialty', () => {
      const info = getShopZoneInfo('ancient_library_shop');
      expect(info.specialty).toBe('scrolls');
    });
  });
});
