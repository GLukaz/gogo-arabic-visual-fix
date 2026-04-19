/**
 * shopGenerator.js — Dynamic shop inventory generator (Phase 29)
 *
 * Generates shop inventory based on:
 * - Player level (filters items by minLevel)
 * - Faction reputation (unlocks reputation items at 50+)
 * - Quest completion (unlocks quest-specific items)
 * - Price modifiers from economySlice
 */

import { SHOP_BASE_ITEMS, SHOP_REPUTATION_ITEMS, SHOP_QUEST_ITEMS } from './shops.js';
import { EQUIPMENT_DATA } from './equipment.js';
import { calculateDynamicPrice, getFactionModifier, SUPPLY_DEFAULTS } from '../game/systems/pricingAgent.js';

/**
 * Generate shop inventory based on game state
 * @param {string} shopId - The shop identifier (e.g., 'oasis_village_shop')
 * @param {Object} gameState - Full Redux state
 * @returns {Array} Array of { itemId, price, available, unlockReason } objects
 */
export function getShopInventory(shopId, gameState) {
  const inventory = [];

  // Extract relevant state
  const playerLevel = gameState.player?.level || 1;
  const completedQuests = gameState.quests?.completed || [];
  const factionReputation = gameState.faction?.alignment || {};

  // Faction for this shop (used for dynamic pricing modifier)
  const shopFaction = getShopFaction(shopId);

  // ECON-03: Compute faction modifier (allied discount / hostile markup) via pricingAgent
  const factionModifier = getFactionModifier(shopFaction, factionReputation);

  // Supply levels from Redux state (used by calculateDynamicPrice)
  const supplyLevels = gameState.economy?.supplyLevels?.[shopId] || {};

  /**
   * Helper: compute dynamic price for one item.
   * Falls back to SUPPLY_DEFAULTS if supply not yet initialized.
   */
  function getPricedItem(shopItem, unlockReason) {
    const itemData = EQUIPMENT_DATA[shopItem.itemId];
    if (!itemData) return null;

    const basePrice = Math.round(itemData.sellPrice * 2); // 2× sell price = base buy price
    const defaultMax = SUPPLY_DEFAULTS[itemData.rarity]?.max || 10;
    const supply = supplyLevels[shopItem.itemId] ?? { current: defaultMax, max: defaultMax };

    const { price, outOfStock } = calculateDynamicPrice(basePrice, supply, factionModifier);

    return {
      itemId: shopItem.itemId,
      basePrice,   // preserved so UI can show price direction arrows
      price,
      outOfStock,
      available: true,
      unlockReason,
    };
  }

  // 1. Add base items filtered by player level
  const baseItems = SHOP_BASE_ITEMS[shopId] || [];
  for (const shopItem of baseItems) {
    if (playerLevel >= shopItem.minLevel) {
      const entry = getPricedItem(shopItem, 'base');
      if (entry) inventory.push(entry);
    }
  }

  // 2. Add reputation items if player has sufficient reputation (Allied tier)
  const reputationItems = SHOP_REPUTATION_ITEMS[shopId] || [];
  const reputation = factionReputation[shopFaction] || 0;

  for (const shopItem of reputationItems) {
    if (reputation >= 75 && playerLevel >= shopItem.minLevel) {
      const entry = getPricedItem(shopItem, 'reputation');
      if (entry) inventory.push(entry);
    }
  }

  // 3. Add quest items if player has completed the required quests
  const questItems = SHOP_QUEST_ITEMS[shopId] || [];
  for (const shopItem of questItems) {
    if (completedQuests.includes(shopItem.questId) && playerLevel >= shopItem.minLevel) {
      const entry = getPricedItem(shopItem, 'quest');
      if (entry) inventory.push(entry);
    }
  }

  return inventory;
}

/**
 * Map shop IDs to faction names for reputation checks
 * @param {string} shopId - Shop identifier
 * @returns {string} Faction name
 */
function getShopFaction(shopId) {
  const factionMap = {
    sacred_library_shop: 'scholars',
    desert_market_shop: 'merchants',
    royal_palace_shop: 'guardians',
    warriors_guild_shop: 'guardians',
    explorers_outpost_shop: 'travelers',
    healers_temple_shop: 'scholars',
    mystic_bazaar_shop: 'artists',
    oasis_village_shop: 'merchants',
    artisan_workshop_shop: 'artisans',
  };
  return factionMap[shopId] || null;
}
