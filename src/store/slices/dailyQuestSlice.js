/**
 * dailyQuestSlice.js — Daily repeatable quest state
 *
 * Tracks 3 daily quests that reset each UTC midnight.
 * Generated deterministically from player level + date.
 * Awards a bonus reward when all 3 are completed.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';

const MAX_HISTORY = 7; // Keep last 7 days of quest results

const initialState = {
  date: null,          // 'YYYY-MM-DD' UTC of current quest day
  quests: [],          // [{ id, type, target, current, completed }]
  bonusAwarded: false, // Whether bonus chest XP was already awarded today
  history: [],         // Last MAX_HISTORY days: [{ date, quests }]
};

const dailyQuestSlice = createSlice({
  name: 'dailyQuest',
  initialState,
  reducers: {
    /**
     * Load (or reload) daily quests for a given date.
     * Automatically archives the previous day's quests into history.
     * payload: { date: string, quests: Array }
     */
    loadDailyQuests(state, action) {
      const { date, quests } = action.payload;

      // Archive current day before replacing
      if (state.date && state.date !== date && state.quests.length > 0) {
        state.history.unshift({ date: state.date, quests: state.quests });
        if (state.history.length > MAX_HISTORY) {
          state.history.length = MAX_HISTORY;
        }
      }

      state.date = date;
      state.quests = quests;
      state.bonusAwarded = false;
    },

    /**
     * Advance a quest's progress by a given amount.
     * Marks the quest completed when current >= target.
     * payload: { type: string, amount?: number }
     */
    progressDailyQuest(state, action) {
      const { type, amount = 1 } = action.payload;
      const quest = state.quests.find((q) => q.type === type && !q.completed);
      if (!quest) return;

      quest.current = Math.min(quest.current + amount, quest.target);
      if (quest.current >= quest.target) {
        quest.completed = true;
      }
    },

    /**
     * Mark the bonus reward as awarded (prevent double-awarding).
     */
    markBonusAwarded(state) {
      state.bonusAwarded = true;
    },

    /**
     * Hard reset — clears all daily quest state (for testing / date rollover edge cases).
     */
    resetDailyQuests(state) {
      state.date = null;
      state.quests = [];
      state.bonusAwarded = false;
    },
  },
});

export const {
  loadDailyQuests,
  progressDailyQuest,
  markBonusAwarded,
  resetDailyQuests,
} = dailyQuestSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectDailyQuests = (state) => state.dailyQuest?.quests ?? [];
export const selectDailyQuestDate = (state) => state.dailyQuest?.date ?? null;
export const selectDailyQuestBonusAwarded = (state) => state.dailyQuest?.bonusAwarded ?? false;
export const selectDailyQuestHistory = (state) => state.dailyQuest?.history ?? [];

/** True when all 3 daily quests are completed. */
export const selectAllDailyQuestsComplete = createSelector(
  [selectDailyQuests],
  (quests) => quests.length === 3 && quests.every((q) => q.completed)
);

/** { completed: number, total: number } */
export const selectDailyQuestProgress = createSelector(
  [selectDailyQuests],
  (quests) => ({
    completed: quests.filter((q) => q.completed).length,
    total: quests.length,
  })
);

export default dailyQuestSlice.reducer;
