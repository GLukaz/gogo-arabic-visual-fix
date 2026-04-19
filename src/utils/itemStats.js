/**
 * itemStats.js — Equipment stat aggregation utilities (Phase 29)
 *
 * Functions to calculate item stats with affix bonuses, total equipment stats, and stat comparisons.
 */

import { EQUIPMENT_DATA } from '../data/equipment.js';
import { AFFIXES } from '../data/affixes.js';
import { getSetBonus } from '../data/itemSets.js';
import { getAffixMultiplier } from './affixMatcher.js';

/**
 * Calculate stats for a single item including affix bonuses
 * @param {string} itemId - The equipment item ID
 * @param {Object} vocabularyState - The vocabulary slice state
 * @returns {Object} Stats: { hp, mp, damage, defense }
 */
export function calculateItemStats(itemId, vocabularyState) {
  const itemData = EQUIPMENT_DATA[itemId];

  if (!itemData) {
    console.warn(`[itemStats] Item '${itemId}' not found in EQUIPMENT_DATA`);
    return { hp: 0, mp: 0, damage: 0, defense: 0 };
  }

  // Start with base stats
  const stats = {
    hp: itemData.stats.hp || 0,
    mp: itemData.stats.mp || 0,
    damage: itemData.stats.damage || 0,
    defense: itemData.stats.defense || 0,
  };

  // Apply affix bonuses
  if (itemData.affixes && itemData.affixes.length > 0) {
    for (const affix of itemData.affixes) {
      const affixData = AFFIXES[affix.wordId];
      if (!affixData) {
        console.warn(`[itemStats] Affix '${affix.wordId}' not found in AFFIXES`);
        continue;
      }

      // Get multiplier based on vocabulary learning state
      const multiplier = getAffixMultiplier(affix.wordId, vocabularyState);

      // Apply affix bonus (from affix object, not affixData.bonus)
      if (affix.bonus) {
        if (affix.bonus.hp) stats.hp += affix.bonus.hp * multiplier;
        if (affix.bonus.mp) stats.mp += affix.bonus.mp * multiplier;
        if (affix.bonus.damage) stats.damage += affix.bonus.damage * multiplier;
        if (affix.bonus.defense) stats.defense += affix.bonus.defense * multiplier;
      }
    }
  }

  return stats;
}

/**
 * Calculate total stats from all equipped items including set bonuses
 * @param {Object} equippedItems - Object with slot keys and itemId values
 * @param {Object} vocabularyState - The vocabulary slice state
 * @param {Object} enchantments - Optional enchantments object (Phase 31)
 * @returns {Object} Total stats: { hp, mp, damage, defense, setBonuses: [...] }
 */
export function calculateTotalEquipmentStats(equippedItems, vocabularyState, enchantments = null) {
  const totals = {
    hp: 0,
    mp: 0,
    damage: 1.0, // Multiplicative base
    defense: 1.0, // Multiplicative base
    setBonuses: [],
  };

  // Sum stats from each equipped item
  for (const [slot, itemId] of Object.entries(equippedItems)) {
    if (!itemId) continue; // Skip empty slots

    const itemStats = calculateItemStats(itemId, vocabularyState);

    totals.hp += itemStats.hp;
    totals.mp += itemStats.mp;
    totals.damage += itemStats.damage; // Multiplicative: 1.0 + 0.05 + 0.03 = 1.08
    totals.defense += itemStats.defense;

    // Add enchantment bonus if present (Phase 31)
    if (enchantments && enchantments[slot]) {
      const enchantment = enchantments[slot];
      if (enchantment.bonus) {
        const { stat, value } = enchantment.bonus;
        if (stat === 'hp') totals.hp += value;
        else if (stat === 'mp') totals.mp += value;
        else if (stat === 'damage') totals.damage += value;
        else if (stat === 'defense') totals.defense += value;
      }
    }
  }

  // Calculate and apply set bonuses
  const activeSets = getSetBonus(equippedItems);
  totals.setBonuses = activeSets;

  for (const setBonus of activeSets) {
    if (setBonus.bonus.hp) totals.hp += setBonus.bonus.hp;
    if (setBonus.bonus.mp) totals.mp += setBonus.bonus.mp;
    if (setBonus.bonus.damage) totals.damage += setBonus.bonus.damage;
    if (setBonus.bonus.defense) totals.defense += setBonus.bonus.defense;
  }

  return totals;
}

/**
 * Compare stats between two items (for tooltip comparison)
 * @param {string} newItemId - The new item being considered
 * @param {string} currentItemId - The currently equipped item (null if none)
 * @param {Object} vocabularyState - The vocabulary slice state
 * @returns {Object} Stat differences: { hp: +5, mp: -3, damage: +0.02, defense: 0 }
 */
export function compareItemStats(newItemId, currentItemId, vocabularyState) {
  const newStats = calculateItemStats(newItemId, vocabularyState);
  const currentStats = currentItemId
    ? calculateItemStats(currentItemId, vocabularyState)
    : { hp: 0, mp: 0, damage: 0, defense: 0 };

  return {
    hp: newStats.hp - currentStats.hp,
    mp: newStats.mp - currentStats.mp,
    damage: newStats.damage - currentStats.damage,
    defense: newStats.defense - currentStats.defense,
  };
}

/**
 * Calculate total battle stats including equipment, enchantments, and active buffs (Phase 31)
 * @param {Object} equippedItems - Object with slot keys and itemId values
 * @param {Object} vocabularyState - The vocabulary slice state
 * @param {Object} enchantments - Enchantments object
 * @param {Array} activeBuffs - Active buffs from battleSlice
 * @returns {Object} Total stats: { hp, mp, damage, defense }
 */
export function calculateTotalBattleStats(equippedItems, vocabularyState, enchantments = null, activeBuffs = []) {
  // Get equipment stats (including enchantments)
  const equipStats = calculateTotalEquipmentStats(equippedItems, vocabularyState, enchantments);

  const totals = {
    hp: equipStats.hp,
    mp: equipStats.mp,
    damage: equipStats.damage,
    defense: equipStats.defense,
  };

  // Add buff bonuses
  for (const buff of activeBuffs) {
    // Buff stats: hpRegen, mpRegen, damageBoost, defenseBoost, accuracyBoost, xpBoost
    if (buff.stat === 'damageBoost') {
      totals.damage += buff.value;
    } else if (buff.stat === 'defenseBoost') {
      totals.defense += buff.value;
    }
    // hpRegen and mpRegen are applied per-turn, not to base stats
    // accuracyBoost and xpBoost are meta-stats, not base stats
  }

  return totals;
}
