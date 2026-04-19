/**
 * Divergent Experience Middleware — Phase 76: NAR-01
 *
 * Cross-slice side effects for the Divergent Experience Engine.
 *
 * Listens for:
 * 1. faction/adjustAlignment — when a faction crosses the friendly (25) threshold,
 *    sets a worldState flag `divergent_path_{factionId}_unlocked`.
 * 2. quests/completeQuest — when a divergent path quest completes, auto-unlocks
 *    the next quest in the chain by dispatching worldState/setFlag.
 *
 * Pattern follows worldStateMiddleware.js:
 *   - next(action) runs first (state has already been reduced)
 *   - side-effect dispatches happen after reduction
 *   - redux-persist actions are ignored
 */

import { setFlag } from '../slices/worldStateSlice.js';
import { QUEST_TO_FACTION_MAP } from '../../data/divergentPaths.js';
import { getNextQuestInChain } from '../../services/divergentExperienceEngine.js';
import { FACTION_TIERS } from '../../data/factions.js';

const FRIENDLY_THRESHOLD = FACTION_TIERS.FRIENDLY.threshold; // 25

/**
 * Build the worldState flag key for a divergent path unlock.
 * @param {string} factionId
 * @returns {string}
 */
export function divergentPathUnlockKey(factionId) {
  return `divergent_path_${factionId}_unlocked`;
}

/**
 * Build the worldState flag key for a divergent quest unlock.
 * @param {string} questId
 * @returns {string}
 */
export function divergentQuestUnlockKey(questId) {
  return `divergent_quest_${questId}_unlocked`;
}

export const divergentExperienceMiddleware = (store) => (next) => (action) => {
  // Guard: never intercept redux-persist internal actions
  if (action.type.startsWith('persist/')) return next(action);

  // ── Capture alignment BEFORE the reducer runs ──────────────────────────
  let alignmentBefore = null;
  if (action.type === 'faction/adjustAlignment') {
    alignmentBefore = { ...store.getState().faction.alignment };
  }

  // Pass action through — state is now updated
  const result = next(action);

  // ── 1. Faction alignment crosses friendly threshold ────────────────────
  if (action.type === 'faction/adjustAlignment' && alignmentBefore) {
    const { factionId } = action.payload;
    const alignmentAfter = store.getState().faction.alignment;

    const wasBelowFriendly = (alignmentBefore[factionId] ?? 0) < FRIENDLY_THRESHOLD;
    const isNowFriendly = (alignmentAfter[factionId] ?? 0) >= FRIENDLY_THRESHOLD;

    if (wasBelowFriendly && isNowFriendly) {
      const flagKey = divergentPathUnlockKey(factionId);
      const alreadyUnlocked = store.getState().worldState?.flags?.[flagKey];

      if (!alreadyUnlocked) {
        store.dispatch(setFlag({ key: flagKey, value: true }));
      }
    }
  }

  // ── 2. Divergent path quest completed → unlock next in chain ───────────
  if (action.type === 'quests/completeQuest') {
    const questId = typeof action.payload === 'string'
      ? action.payload
      : action.payload?.questId;

    if (questId && QUEST_TO_FACTION_MAP[questId]) {
      const nextQuest = getNextQuestInChain(questId);
      if (nextQuest) {
        const flagKey = divergentQuestUnlockKey(nextQuest.id);
        const alreadyUnlocked = store.getState().worldState?.flags?.[flagKey];

        if (!alreadyUnlocked) {
          store.dispatch(setFlag({ key: flagKey, value: true }));
        }
      }
    }
  }

  return result;
};
