/**
 * tradeRoutes.js — Zone-based trade route pricing data
 *
 * Defines buy/sell price multipliers per zone per item category.
 * NPCs in different zones buy/sell at different prices.
 * Player profits by moving items between zones.
 */

/**
 * Base item categories for trade.
 */
export const TRADE_CATEGORIES = [
  'spices', 'textiles', 'gems', 'food', 'scrolls',
  'metals', 'pottery', 'medicine', 'perfume', 'wood',
];

/**
 * Zone trade profiles — each zone has buy/sell multipliers per category.
 * buy = how much the zone charges for items (higher = expensive to buy)
 * sell = how much the zone pays for items (higher = pays well)
 *
 * Profit = sell price in destination - buy price in origin
 */
export const ZONE_TRADE_PROFILES = {
  oasis_village: {
    zoneName: 'Oasis Village',
    specialty: 'food',
    buy: { spices: 1.3, textiles: 1.2, gems: 1.5, food: 0.7, scrolls: 1.3, metals: 1.4, pottery: 1.1, medicine: 1.2, perfume: 1.3, wood: 1.5 },
    sell: { spices: 0.8, textiles: 0.9, gems: 0.7, food: 1.4, scrolls: 0.8, metals: 0.7, pottery: 1.0, medicine: 0.9, perfume: 0.8, wood: 0.6 },
  },
  desert_marketplace: {
    zoneName: 'Desert Marketplace',
    specialty: 'spices',
    buy: { spices: 0.6, textiles: 0.8, gems: 0.9, food: 1.3, scrolls: 1.1, metals: 1.0, pottery: 0.9, medicine: 1.1, perfume: 0.7, wood: 1.6 },
    sell: { spices: 1.5, textiles: 1.2, gems: 1.1, food: 0.8, scrolls: 0.9, metals: 1.0, pottery: 1.1, medicine: 0.9, perfume: 1.3, wood: 0.5 },
  },
  ancient_library: {
    zoneName: 'Ancient Library',
    specialty: 'scrolls',
    buy: { spices: 1.2, textiles: 1.1, gems: 1.2, food: 1.2, scrolls: 0.5, metals: 1.3, pottery: 1.2, medicine: 0.9, perfume: 1.1, wood: 1.3 },
    sell: { spices: 0.9, textiles: 0.8, gems: 0.9, food: 0.9, scrolls: 1.6, metals: 0.8, pottery: 0.9, medicine: 1.2, perfume: 1.0, wood: 0.8 },
  },
  bedouin_camp: {
    zoneName: 'Bedouin Camp',
    specialty: 'textiles',
    buy: { spices: 1.1, textiles: 0.6, gems: 1.4, food: 1.1, scrolls: 1.4, metals: 1.2, pottery: 0.8, medicine: 1.3, perfume: 1.0, wood: 1.2 },
    sell: { spices: 1.0, textiles: 1.5, gems: 0.7, food: 1.0, scrolls: 0.7, metals: 0.9, pottery: 1.2, medicine: 0.8, perfume: 1.1, wood: 0.9 },
  },
  royal_palace: {
    zoneName: 'Royal Palace',
    specialty: 'gems',
    buy: { spices: 0.9, textiles: 0.9, gems: 0.7, food: 1.0, scrolls: 0.9, metals: 0.8, pottery: 1.0, medicine: 0.8, perfume: 0.8, wood: 1.0 },
    sell: { spices: 1.1, textiles: 1.1, gems: 1.6, food: 1.0, scrolls: 1.1, metals: 1.2, pottery: 1.0, medicine: 1.1, perfume: 1.2, wood: 1.0 },
  },
  farmland: {
    zoneName: 'Farmland',
    specialty: 'food',
    buy: { spices: 1.4, textiles: 1.3, gems: 1.6, food: 0.5, scrolls: 1.5, metals: 1.1, pottery: 0.7, medicine: 1.0, perfume: 1.4, wood: 0.8 },
    sell: { spices: 0.7, textiles: 0.8, gems: 0.6, food: 1.5, scrolls: 0.6, metals: 0.9, pottery: 1.3, medicine: 1.0, perfume: 0.7, wood: 1.2 },
  },
  coastal_port: {
    zoneName: 'Coastal Port',
    specialty: 'perfume',
    buy: { spices: 0.8, textiles: 1.0, gems: 1.0, food: 1.1, scrolls: 1.2, metals: 0.9, pottery: 1.1, medicine: 1.0, perfume: 0.6, wood: 0.7 },
    sell: { spices: 1.2, textiles: 1.0, gems: 1.0, food: 0.9, scrolls: 0.9, metals: 1.1, pottery: 0.9, medicine: 1.0, perfume: 1.5, wood: 1.3 },
  },
  mountain_village: {
    zoneName: 'Mountain Village',
    specialty: 'metals',
    buy: { spices: 1.3, textiles: 1.1, gems: 0.8, food: 1.3, scrolls: 1.1, metals: 0.5, pottery: 1.0, medicine: 1.1, perfume: 1.2, wood: 0.6 },
    sell: { spices: 0.8, textiles: 1.0, gems: 1.2, food: 0.8, scrolls: 1.0, metals: 1.6, pottery: 1.0, medicine: 1.0, perfume: 0.9, wood: 1.4 },
  },
};

export const ZONE_IDS = Object.keys(ZONE_TRADE_PROFILES);
