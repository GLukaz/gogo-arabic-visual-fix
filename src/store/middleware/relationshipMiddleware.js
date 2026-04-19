/**
 * relationshipMiddleware.js — Detects friendship tier crossings after gift actions
 *
 * Listens for: npc/giveNpcGift
 *
 * After the reducer processes the gift:
 * 1. Computes old vs new friendship to detect tier boundary crossings
 * 2. If a tier was crossed upward, dispatches a milestone notification
 * 3. At friendly tier (50+): marks gift preferences as revealed for that NPC
 * 4. At close tier (75+): sets a worldState flag to unlock the NPC's special quest
 */

import {
  checkTierCrossing,
  getMilestoneReward,
  getNpcTitle,
} from '../../data/relationshipRewards.js';

// Action type constant from npcSlice
const GIVE_NPC_GIFT = 'npc/giveNpcGift';

/**
 * Simple action creators for milestone side-effects.
 * These are dispatched by the middleware; consumers can listen for them.
 */
export const MILESTONE_ACTION_TYPES = Object.freeze({
  TIER_REACHED: 'relationship/tierReached',
  PREFERENCES_REVEALED: 'relationship/preferencesRevealed',
  SPECIAL_QUEST_UNLOCKED: 'relationship/specialQuestUnlocked',
});

export const tierReached = (payload) => ({
  type: MILESTONE_ACTION_TYPES.TIER_REACHED,
  payload,
});

export const preferencesRevealed = (payload) => ({
  type: MILESTONE_ACTION_TYPES.PREFERENCES_REVEALED,
  payload,
});

export const specialQuestUnlocked = (payload) => ({
  type: MILESTONE_ACTION_TYPES.SPECIAL_QUEST_UNLOCKED,
  payload,
});

/**
 * Redux middleware that detects friendship tier crossings.
 */
export const relationshipMiddleware = (store) => (next) => (action) => {
  if (action.type !== GIVE_NPC_GIFT) {
    return next(action);
  }

  const { npcId, relationshipDelta } = action.payload || {};
  if (!npcId) return next(action);

  // Capture friendship BEFORE the reducer runs
  const stateBefore = store.getState();
  const friendshipBefore = stateBefore.npc?.friendship?.[npcId] ?? 50;

  // Let the reducer process the gift
  const result = next(action);

  // Capture friendship AFTER
  const stateAfter = store.getState();
  const friendshipAfter = stateAfter.npc?.friendship?.[npcId] ?? 50;

  // Check for tier crossing
  const newTier = checkTierCrossing(friendshipBefore, friendshipAfter);

  if (newTier) {
    const milestone = getMilestoneReward(newTier);
    const title = getNpcTitle(npcId);

    // Dispatch tier reached notification
    store.dispatch(tierReached({
      npcId,
      tier: newTier,
      friendshipValue: friendshipAfter,
      milestone,
      title: newTier === 'close' ? title : null,
    }));

    // At friendly (50+): reveal gift preferences
    if (newTier === 'friendly' || newTier === 'close') {
      store.dispatch(preferencesRevealed({ npcId, tier: newTier }));
    }

    // At close (75+): unlock special quest via worldState flag
    if (newTier === 'close') {
      store.dispatch(specialQuestUnlocked({
        npcId,
        questFlag: `quest_${npcId}_special`,
      }));
    }
  }

  return result;
};

export default relationshipMiddleware;
