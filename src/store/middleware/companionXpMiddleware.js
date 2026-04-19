/**
 * companionXpMiddleware.js — Auto-XP Award for Battle Companions
 *
 * Awards XP to the active battle companion when a battle ends.
 * XP scales with the battle's difficulty proxy (reward XP).
 *
 * Listens for: battle/endBattle
 * Reads: companions.activeParty.battle (companion in battle slot)
 * Dispatches: companions/addCompanionXP
 */

import { addCompanionXP } from '../slices/companionSlice.js';

// ─────────────────────────────────────────────────────────────────────────────
// XP Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANION_XP_CONFIG = {
  // XP awarded to companion per battle regardless of outcome
  BASE_XP_PER_BATTLE: 20,

  // Additional XP per point of battle reward XP (scales with difficulty)
  XP_PER_REWARD_XP: 0.15,

  // Maximum XP per battle (prevents runaway values against very rewarding enemies)
  MAX_XP_PER_BATTLE: 75,

  // Bonus multiplier when the battle is won (loss still earns partial XP)
  VICTORY_MULTIPLIER: 1.5,
};

// ─────────────────────────────────────────────────────────────────────────────
// XP calculation helper (exported for testing)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate companion XP for a completed battle.
 *
 * @param {boolean} victory — whether the player won the battle
 * @param {number}  rewardXp — the battle's XP reward (proxy for difficulty)
 * @returns {number} XP to award to the companion
 */
export function calcCompanionBattleXp(victory, rewardXp) {
  const { BASE_XP_PER_BATTLE, XP_PER_REWARD_XP, MAX_XP_PER_BATTLE, VICTORY_MULTIPLIER } =
    COMPANION_XP_CONFIG;

  const scaled = BASE_XP_PER_BATTLE + Math.floor((rewardXp || 0) * XP_PER_REWARD_XP);
  const raw = victory ? Math.floor(scaled * VICTORY_MULTIPLIER) : scaled;
  return Math.min(raw, MAX_XP_PER_BATTLE);
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Redux middleware that awards companion XP when a battle concludes.
 *
 * A companion earns XP only if it was in the active battle slot when the
 * battle ended. XP is awarded regardless of win/loss (victory earns more).
 *
 * Always calls next(action) first, then dispatches the XP side-effect.
 */
export const companionXpMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type !== 'battle/endBattle') return result;

  // Determine which companion was in the battle slot
  const state = store.getState();
  const companionId = state?.companions?.activeParty?.battle;

  if (!companionId) return result; // No companion in battle — nothing to do

  const { victory, rewards } = action.payload ?? {};
  const rewardXp = rewards?.xp ?? 0;
  const xp = calcCompanionBattleXp(Boolean(victory), rewardXp);

  store.dispatch(addCompanionXP({ companionId, xp }));

  return result;
};
