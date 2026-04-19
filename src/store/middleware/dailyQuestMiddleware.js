/**
 * dailyQuestMiddleware.js — Daily quest progress tracking
 *
 * Intercepts Redux actions that contribute to daily quest completion:
 *   - vocabulary/updateFsrsCard  → vocab_review
 *   - battle/endBattle (victory) → battle_win
 *   - crafting/craftItem         → craft_item
 *   - quests/visitZone           → visit_zone
 *   - npc/giveNpcGift            → gift_npc
 *
 * On each tracked action:
 *   1. Ensures today's quests are loaded (generates if missing or date changed).
 *   2. Advances the matching quest's progress.
 *   3. Dispatches bonus XP when all 3 quests complete (once per day).
 */

import {
  loadDailyQuests,
  progressDailyQuest,
  markBonusAwarded,
  selectAllDailyQuestsComplete,
} from '../slices/dailyQuestSlice.js';
import { generateDailyQuests, DAILY_QUEST_TYPES } from '../../services/dailyQuestGenerator.js';
import { addXP } from '../slices/playerSlice.js';

/** XP awarded when all 3 daily quests are completed. */
export const DAILY_QUEST_BONUS_XP = 150;

// Map Redux action types to daily quest types
const ACTION_TO_QUEST_TYPE = {
  'vocabulary/updateFsrsCard': DAILY_QUEST_TYPES.VOCAB_REVIEW,
  'crafting/craftItem':        DAILY_QUEST_TYPES.CRAFT_ITEM,
  'quests/visitZone':          DAILY_QUEST_TYPES.VISIT_ZONE,
  'npc/giveNpcGift':           DAILY_QUEST_TYPES.GIFT_NPC,
};

// All action types that this middleware cares about
const TRACKED_ACTIONS = new Set([
  ...Object.keys(ACTION_TO_QUEST_TYPE),
  'battle/endBattle',
]);

function getTodayUTC() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Ensure today's daily quests exist in the store.
 * Generates and loads them if the date has changed or quests haven't been set.
 */
function ensureDailyQuests(store) {
  const today = getTodayUTC();
  const state = store.getState();
  const questDate = state.dailyQuest?.date;

  if (questDate !== today) {
    const level = state.player?.level ?? 1;
    const quests = generateDailyQuests({ level }, today);
    store.dispatch(loadDailyQuests({ date: today, quests }));
  }
}

/**
 * Award bonus XP if all 3 quests are now complete and bonus hasn't been given yet.
 */
function maybeAwardBonus(store) {
  const state = store.getState();
  if (state.dailyQuest?.bonusAwarded) return;

  if (selectAllDailyQuestsComplete(state)) {
    store.dispatch(markBonusAwarded());
    store.dispatch(addXP(DAILY_QUEST_BONUS_XP));
  }
}

export const dailyQuestMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (!TRACKED_ACTIONS.has(action.type)) return result;

  // Battle wins: only count victories
  if (action.type === 'battle/endBattle') {
    if (action.payload?.victory) {
      ensureDailyQuests(store);
      store.dispatch(progressDailyQuest({ type: DAILY_QUEST_TYPES.BATTLE_WIN, amount: 1 }));
      maybeAwardBonus(store);
    }
    return result;
  }

  // All other tracked actions
  const questType = ACTION_TO_QUEST_TYPE[action.type];
  ensureDailyQuests(store);
  store.dispatch(progressDailyQuest({ type: questType, amount: 1 }));
  maybeAwardBonus(store);

  return result;
};
