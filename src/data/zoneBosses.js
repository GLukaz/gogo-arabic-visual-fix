/**
 * zoneBosses.js — Zone boss access layer for FEAT-033.
 *
 * Wraps bossEncounters.js and adds:
 *   - getBossForZone(zoneId)   — canonical alias used by game systems
 *   - isBossDefeated(zoneId, playerState) — reads worldState flags
 *   - calculateBossDamage(answerCorrect, timeBonus, combo) — pure damage calc
 *
 * Boss defeat state is stored in worldStateSlice via:
 *   setFlag({ key: `boss_defeated_${zoneId}`, value: true })
 */
import bossEncounters, { getBossByZone } from './bossEncounters.js';

export { default as zoneBossData } from './bossEncounters.js';

// ─── Public accessors ────────────────────────────────────────────────────────

/**
 * Return the boss definition for a given zone, or undefined if not found.
 * @param {string} zoneId
 * @returns {Object|undefined}
 */
export function getBossForZone(zoneId) {
  return getBossByZone(zoneId);
}

/**
 * Check whether the boss for a given zone has been defeated.
 * Reads `worldState.flags.boss_defeated_<zoneId>` from player state.
 *
 * @param {string} zoneId
 * @param {Object} playerState — full Redux state object containing worldState
 * @returns {boolean}
 */
export function isBossDefeated(zoneId, playerState) {
  return Boolean(playerState?.worldState?.flags?.[`boss_defeated_${zoneId}`]);
}

/**
 * Calculate damage dealt by the player during a boss vocabulary challenge.
 *
 * Formula:
 *   baseDamage = 10
 *   speedBonus = floor(clamp(timeBonus, 0, 1) * 10)  → 0–10 extra
 *   total = round((baseDamage + speedBonus) * max(1, combo))
 *
 * @param {boolean} answerCorrect — true if player answered correctly
 * @param {number}  timeBonus     — fraction of time remaining (0–1); 0 = slow, 1 = instant
 * @param {number}  combo         — combo multiplier (≥1); e.g. 1.5 for a streak bonus
 * @returns {number} damage dealt (0 if incorrect)
 */
export function calculateBossDamage(answerCorrect, timeBonus = 0, combo = 1) {
  if (!answerCorrect) return 0;
  const base = 10;
  const clampedTime = Math.min(1, Math.max(0, timeBonus));
  const speedBonus = Math.floor(clampedTime * 10);
  const multiplier = Math.max(1, combo);
  return Math.round((base + speedBonus) * multiplier);
}

export default bossEncounters;
