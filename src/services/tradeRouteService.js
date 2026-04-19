/**
 * tradeRouteService.js — Trade route logic
 *
 * Calculates prices, profits, and optimal trade routes
 * using zone trade profiles from tradeRoutes.js.
 */

import { ZONE_TRADE_PROFILES, ZONE_IDS, TRADE_CATEGORIES } from '../data/tradeRoutes.js';

// Base prices per category (in dirhams)
const BASE_PRICES = {
  spices: 25,
  textiles: 30,
  gems: 80,
  food: 10,
  scrolls: 40,
  metals: 50,
  pottery: 15,
  medicine: 35,
  perfume: 60,
  wood: 12,
};

/**
 * Get the buy price of an item category in a zone.
 * @param {string} category - Item category
 * @param {string} zone - Zone ID
 * @returns {number} Price in dirhams
 */
export function getBuyPrice(category, zone) {
  const profile = ZONE_TRADE_PROFILES[zone];
  const base = BASE_PRICES[category];
  if (!profile || !base) return 0;
  return Math.round(base * (profile.buy[category] || 1.0));
}

/**
 * Get the sell price of an item category in a zone.
 * @param {string} category - Item category
 * @param {string} zone - Zone ID
 * @returns {number} Price in dirhams
 */
export function getSellPrice(category, zone) {
  const profile = ZONE_TRADE_PROFILES[zone];
  const base = BASE_PRICES[category];
  if (!profile || !base) return 0;
  return Math.round(base * (profile.sell[category] || 1.0));
}

/**
 * Calculate profit for moving an item between zones.
 * @param {string} category - Item category
 * @param {string} fromZone - Zone to buy from
 * @param {string} toZone - Zone to sell to
 * @returns {Object} { buyPrice, sellPrice, profit, profitMargin }
 */
export function getTradeProfit(category, fromZone, toZone) {
  const buyPrice = getBuyPrice(category, fromZone);
  const sellPrice = getSellPrice(category, toZone);
  const profit = sellPrice - buyPrice;
  const profitMargin = buyPrice > 0 ? Math.round((profit / buyPrice) * 100) : 0;

  return { category, fromZone, toZone, buyPrice, sellPrice, profit, profitMargin };
}

/**
 * Find the best zone to sell a specific item category.
 * @param {string} category
 * @returns {{ zone: string, sellPrice: number }}
 */
export function getBestSellingZone(category) {
  let best = { zone: null, sellPrice: 0 };

  for (const zone of ZONE_IDS) {
    const price = getSellPrice(category, zone);
    if (price > best.sellPrice) {
      best = { zone, sellPrice: price };
    }
  }

  return best;
}

/**
 * Find the cheapest zone to buy a specific item category.
 * @param {string} category
 * @returns {{ zone: string, buyPrice: number }}
 */
export function getCheapestBuyZone(category) {
  let best = { zone: null, buyPrice: Infinity };

  for (const zone of ZONE_IDS) {
    const price = getBuyPrice(category, zone);
    if (price > 0 && price < best.buyPrice) {
      best = { zone, buyPrice: price };
    }
  }

  return best.zone ? best : { zone: null, buyPrice: 0 };
}

/**
 * Get the most profitable trade route for any item category.
 * @param {number} [limit=5]
 * @returns {Array} Top trade opportunities sorted by profit
 */
export function getBestTradeRoutes(limit = 5) {
  const routes = [];

  for (const category of TRADE_CATEGORIES) {
    for (const fromZone of ZONE_IDS) {
      for (const toZone of ZONE_IDS) {
        if (fromZone === toZone) continue;
        const trade = getTradeProfit(category, fromZone, toZone);
        if (trade.profit > 0) {
          routes.push(trade);
        }
      }
    }
  }

  return routes
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit);
}

/**
 * Get all prices for a specific zone.
 * @param {string} zone
 * @returns {Object} { category: { buy, sell } }
 */
export function getZonePriceSheet(zone) {
  const sheet = {};
  for (const category of TRADE_CATEGORIES) {
    sheet[category] = {
      buy: getBuyPrice(category, zone),
      sell: getSellPrice(category, zone),
    };
  }
  return sheet;
}
