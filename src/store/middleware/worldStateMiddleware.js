/**
 * World State Middleware
 *
 * Listens to Redux actions and auto-sets world state flags/counters.
 * Follows the same pattern as achievementMiddleware.js and friendshipMiddleware.js.
 *
 * Action types handled:
 * - quests/completeQuest → sets quest completion flag
 * - npc/teachWord → sets NPC met flag, increments NPC words taught counter
 * - economy/recordPurchase → increments shop purchase counter
 * - npc/adjustFriendship → sets NPC met flag (proxy for meaningful interaction)
 * - vocabulary/addFsrsCard → PATH-06: grants 10 dirhams + achievement toast when
 *     the 3rd word is learned during onboarding (floating village object reward)
 */

import { setFlag, incrementCounter } from '../slices/worldStateSlice.js';
import { questCompleteKey, npcMetKey, shopPurchasesKey, WORLD_STATE_KEYS } from '../../data/worldStateKeys.js';
import { addDirhams } from '../slices/playerSlice.js';
import { showNotification } from '../slices/uiSlice.js';
import { restoreSupply } from '../slices/economySlice.js';

export const worldStateMiddleware = (store) => (next) => (action) => {
  // Guard: never intercept redux-persist internal actions
  if (action.type.startsWith('persist/')) return next(action);

  // Pass action through first (middleware reads state AFTER reduction)
  const result = next(action);

  // Quest completion → set flag
  if (action.type === 'quests/completeQuest') {
    const questId = typeof action.payload === 'string' ? action.payload : action.payload?.questId;
    if (questId) {
      const flagKey = questCompleteKey(questId);
      store.dispatch(setFlag({ key: flagKey, value: true }));
    }
  }

  // NPC taught a word → set NPC met flag + increment words taught counter
  if (action.type === 'npc/teachWord') {
    const { npcId } = action.payload || {};
    if (npcId) {
      const metKey = npcMetKey(npcId);
      store.dispatch(setFlag({ key: metKey, value: true }));

      // Increment words taught counter for this NPC
      const wordsKey = `npc_${npcId.replace(/-/g, '_')}_words_taught`;
      store.dispatch(incrementCounter({ key: wordsKey, amount: 1 }));
    }
  }

  // Purchase recorded → increment shop purchase counter
  if (action.type === 'economy/recordPurchase') {
    const { shopId } = action.payload || {};
    if (shopId) {
      const purchaseKey = shopPurchasesKey(shopId);
      store.dispatch(incrementCounter({ key: purchaseKey, amount: 1 }));
    }
  }

  // NPC friendship adjustment → set NPC met flag (any friendship change = met)
  if (action.type === 'npc/adjustFriendship') {
    const { npcId } = action.payload || {};
    if (npcId) {
      const metKey = npcMetKey(npcId);
      store.dispatch(setFlag({ key: metKey, value: true }));
    }
  }

  // PATH-07: onboarding completion — dual-write to both playerSlice (localStorage)
  // and worldStateSlice (IndexedDB) so returning players skip onboarding even if
  // localStorage is cleared (IndexedDB persists independently).
  if (
    action.type === 'player/completeOnboarding' ||
    (action.type === 'player/setTutorialPhase' && action.payload === 'complete')
  ) {
    const alreadyFlagged =
      store.getState().worldState?.flags?.[WORLD_STATE_KEYS.ONBOARDING_COMPLETE] ?? false;
    if (!alreadyFlagged) {
      store.dispatch(setFlag({ key: WORLD_STATE_KEYS.ONBOARDING_COMPLETE, value: true }));
    }
  }

  // ECON-02: Time advance → restore 25% of max supply across all initialized shops.
  // This simulates merchants restocking after the player rests or time passes.
  if (action.type === 'time/advanceTime') {
    const shopIds = Object.keys(store.getState().economy?.supplyLevels || {});
    for (const shopId of shopIds) {
      store.dispatch(restoreSupply({ shopId, restorePercent: 0.25 }));
    }
  }

  // PATH-06: 3-word onboarding reward — floating village objects reward
  // When a player learns their 3rd Arabic word during onboarding, grant 10 dirhams
  // and show an achievement toast. Only fires once (guarded by ONBOARDING_FIRST_QUEST_COMPLETE).
  if (action.type === 'vocabulary/addFsrsCard') {
    const state = store.getState();
    if (!state.player.onboardingComplete) {
      const firstQuestAlreadyComplete =
        state.worldState?.flags?.[WORLD_STATE_KEYS.ONBOARDING_FIRST_QUEST_COMPLETE] ?? false;

      if (!firstQuestAlreadyComplete) {
        const learnedCount = Object.keys(state.vocabulary.fsrsCards).length;
        if (learnedCount === 3) {
          store.dispatch(addDirhams(10));
          store.dispatch(showNotification({
            message: 'You know 3 Arabic words! تعلمت ٣ كلمات عربية!',
            type: 'achievement',
          }));
          store.dispatch(setFlag({
            key: WORLD_STATE_KEYS.ONBOARDING_FIRST_QUEST_COMPLETE,
            value: true,
          }));
        }
      }
    }
  }

  return result;
};
