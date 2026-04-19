/**
 * BattleDamageCalculator.js — Pure damage calculation for turn-based combat.
 *
 * Formula: floor(baseDamage × accuracyMult × speedBonus × elementMult × comboBonus)
 *
 * Arabic accuracy is the primary damage multiplier — the better you know Arabic,
 * the harder you hit.
 */

import { getElementMultiplier } from '../../../data/rootMagic.js';

/**
 * Calculate damage for a player action.
 * @param {Object} params
 * @param {number} params.baseDamage - Weapon/spell base damage
 * @param {number} params.accuracy - 0-1 float from Arabic input matching
 * @param {number} params.timeElapsedMs - Time to answer in milliseconds
 * @param {string|null} params.element - Spell element (null for physical attack)
 * @param {string|null} params.targetElement - Enemy's element affinity
 * @param {number} params.streak - Current combo streak count
 * @param {number} params.playerLevel - Player's current level
 * @param {boolean} params.isMagic - Whether this is a magic attack
 * @param {number} params.equipmentDamageMult - Equipment damage multiplier (default 1.0)
 * @returns {{ damage: number, isMiss: boolean, isCritical: boolean, accuracyMult: number, speedMult: number, elementMult: number, comboMult: number }}
 */
export function calculateDamage({
  baseDamage,
  accuracy,
  timeElapsedMs,
  element = null,
  targetElement = null,
  streak = 0,
  playerLevel = 1,
  isMagic = false,
  equipmentDamageMult = 1.0,
}) {
  // Base damage scales with level
  let damage = baseDamage + playerLevel * 2;

  // Accuracy multiplier (Arabic correctness)
  let accuracyMult;
  if (accuracy >= 1.0) {
    accuracyMult = 1.5; // Perfect — diacritics correct
  } else if (accuracy >= 0.8) {
    accuracyMult = 1.0; // Good — root correct
  } else if (accuracy >= 0.5) {
    accuracyMult = 0.5; // Partial — some letters
  } else {
    return { damage: 0, isMiss: true, isCritical: false, accuracyMult: 0, speedMult: 1, elementMult: 1, comboMult: 1 };
  }

  // Speed bonus (reward fast answers)
  let speedMult = 1.0;
  if (timeElapsedMs < 3000) {
    speedMult = 1.2;
  } else if (timeElapsedMs < 5000) {
    speedMult = 1.1;
  } else if (timeElapsedMs > 10000) {
    speedMult = 0.9;
  }

  // Element multiplier (root magic)
  let elementMult = 1.0;
  if (isMagic && element && targetElement) {
    elementMult = getElementMultiplier(element, targetElement);
  }

  // Combo bonus (consecutive correct answers)
  let comboMult = 1.0;
  let isCritical = false;
  if (streak >= 10) {
    comboMult = 2.0;
    isCritical = true;
  } else if (streak >= 5) {
    comboMult = 1.5;
    isCritical = true;
  } else if (streak >= 3) {
    comboMult = 1.25;
    isCritical = true;
  } else if (streak >= 2) {
    comboMult = 1.1;
  }

  // Apply equipment damage multiplier (Phase 29)
  damage = Math.floor(damage * accuracyMult * speedMult * elementMult * comboMult * equipmentDamageMult);

  return {
    damage: Math.max(1, damage), // Minimum 1 damage on hit
    isMiss: false,
    isCritical,
    accuracyMult,
    speedMult,
    elementMult,
    comboMult,
  };
}
