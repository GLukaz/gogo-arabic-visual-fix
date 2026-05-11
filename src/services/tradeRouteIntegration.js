/**
 * tradeRouteIntegration.js
 *
 * Connects tradeRouteService to the shop/economy system.
 * Maps shopIds to zone IDs and equipment items to trade categories,
 * then provides zone-adjusted pricing functions for the shop UI.
 */

import { getCheapestBuyZone, getBestSellingZone } from './tradeRouteService.js';
import { ZONE_TRADE_PROFILES } from '../data/tradeRoutes.js';

// Map shopId → zoneId
export const SHOP_ZONE_MAP = {
  oasis_village_shop: 'oasis_village',
  desert_marketplace_shop: 'desert_marketplace',
  ancient_library_shop: 'ancient_library',
  bedouin_camp_shop: 'bedouin_camp',
  royal_palace_shop: 'royal_palace',
  farmland_shop: 'farmland',
  mountain_village_shop: 'mountain_village',
  coastal_port_shop: 'coastal_port',
};

// Map equipment slot → trade category
const SLOT_TO_TRADE_CATEGORY = {
  weapon: 'metals',
  offhand: 'metals',
  shield: 'metals',
  armor: 'textiles',
  helmet: 'textiles',
  boots: 'textiles',
  gloves: 'textiles',
  ring: 'gems',
  necklace: 'gems',
  amulet: 'gems',
  consumable: 'medicine',
  potion: 'medicine',
  scroll: 'scrolls',
  food: 'food',
  spice: 'spices',
  ceramic: 'pottery',
  wood: 'wood',
};

// Fallback: map rarity → trade category
const RARITY_TO_TRADE_CATEGORY = {
  common: 'pottery',
  uncommon: 'metals',
  rare: 'textiles',
  epic: 'gems',
  legendary: 'perfume',
};

/**
 * Determine the trade category for an equipment item.
 * @param {Object} itemData - Equipment data object with `slot` and `rarity`
 * @returns {string} Trade category (e.g. 'metals', 'textiles', 'gems')
 */
export function getItemTradeCategory(itemData) {
  if (!itemData) return 'metals';
  return SLOT_TO_TRADE_CATEGORY[itemData.slot] || RARITY_TO_TRADE_CATEGORY[itemData.rarity] || 'metals';
}

/**
 * Get the zone price multiplier for buying an item in a given shop.
 * Uses the trade route profile for this zone and category.
 *
 * @param {Object} itemData - Equipment data object
 * @param {string} shopId - The shop identifier (e.g. 'oasis_village_shop')
 * @returns {number} Price multiplier (1.0 = neutral, >1.0 = expensive, <1.0 = cheap)
 */
export function getZonePriceMultiplier(itemData, shopId) {
  const zone = SHOP_ZONE_MAP[shopId];
  if (!zone || !itemData) return 1.0;
  const category = getItemTradeCategory(itemData);
  const profile = ZONE_TRADE_PROFILES[zone];
  return profile?.buy[category] ?? 1.0;
}

/**
 * Get the zone sell multiplier for selling an item in a given shop.
 *
 * @param {Object} itemData - Equipment data object
 * @param {string} shopId - The shop identifier
 * @returns {number} Sell price multiplier
 */
export function getZoneSellMultiplier(itemData, shopId) {
  const zone = SHOP_ZONE_MAP[shopId];
  if (!zone || !itemData) return 1.0;
  const category = getItemTradeCategory(itemData);
  const profile = ZONE_TRADE_PROFILES[zone];
  return profile?.sell[category] ?? 1.0;
}

/**
 * Compute zone-adjusted buy price for an item.
 *
 * @param {number} basePrice - Base price from shop generator
 * @param {Object} itemData - Equipment data
 * @param {string} shopId - Shop identifier
 * @returns {number} Zone-adjusted price (minimum 1)
 */
export function getZoneAdjustedBuyPrice(basePrice, itemData, shopId) {
  const multiplier = getZonePriceMultiplier(itemData, shopId);
  return Math.max(1, Math.round(basePrice * multiplier));
}

/**
 * Compute zone-adjusted sell price for an item.
 *
 * @param {number} basePrice - Base sell price from item data
 * @param {Object} itemData - Equipment data
 * @param {string} shopId - Shop identifier
 * @returns {number} Zone-adjusted sell price (minimum 1)
 */
export function getZoneAdjustedSellPrice(basePrice, itemData, shopId) {
  const multiplier = getZoneSellMultiplier(itemData, shopId);
  return Math.max(1, Math.round(basePrice * multiplier));
}

/**
 * Get the cheapest zone to buy a category of item.
 * Used for price comparison tooltip.
 *
 * @param {Object} itemData - Equipment data
 * @returns {{ zone: string, zoneName: string, buyPrice: number } | null}
 */
export function getCheapestZoneForItem(itemData) {
  if (!itemData) return null;
  const category = getItemTradeCategory(itemData);
  const result = getCheapestBuyZone(category);
  if (!result.zone) return null;
  return {
    zone: result.zone,
    zoneName: ZONE_TRADE_PROFILES[result.zone]?.zoneName || result.zone,
    buyPrice: result.buyPrice,
  };
}

/**
 * Get the best zone to sell a category of item.
 *
 * @param {Object} itemData - Equipment data
 * @returns {{ zone: string, zoneName: string, sellPrice: number } | null}
 */
export function getBestSellZoneForItem(itemData) {
  if (!itemData) return null;
  const category = getItemTradeCategory(itemData);
  const result = getBestSellingZone(category);
  if (!result.zone) return null;
  return {
    zone: result.zone,
    zoneName: ZONE_TRADE_PROFILES[result.zone]?.zoneName || result.zone,
    sellPrice: result.sellPrice,
  };
}

/**
 * Get price comparison info for the current shop.
 * Returns zone name and specialty info for display in the shop UI.
 *
 * @param {string} shopId - The shop identifier
 * @returns {{ zoneName: string, specialty: string } | null}
 */
export function getShopZoneInfo(shopId) {
  const zone = SHOP_ZONE_MAP[shopId];
  if (!zone) return null;
  const profile = ZONE_TRADE_PROFILES[zone];
  if (!profile) return null;
  return {
    zone,
    zoneName: profile.zoneName,
    specialty: profile.specialty,
  };
}
