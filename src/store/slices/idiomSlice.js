/**
 * Idiom Slice — Redux state for Arabic idiom learning, favorites, and quiz history.
 * Phase 94 (IDIOM-01): Tracks learned idioms, favorites, daily rotation, quiz stats.
 *
 * State:
 *   learnedIdioms     — array of idiom IDs marked as learned (serialisable Set)
 *   favorites         — array of favourite idiom IDs
 *   dailyIdiomId      — today's featured idiom ID
 *   lastDailyDate     — 'YYYY-MM-DD' of last daily selection
 *   quizHistory       — last 100 quiz entries
 *   quizStats         — aggregated accuracy/speed stats
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { ARABIC_IDIOMS, IDIOM_CATEGORIES, getIdiomsByCategory } from '../../data/arabicIdioms.js';

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  learnedIdioms: [],        // Array<string> — IDs (serialisable alternative to Set)
  favorites: [],            // Array<string> — IDs
  dailyIdiomId: null,       // string|null
  lastDailyDate: null,      // 'YYYY-MM-DD'|null
  quizHistory: [],          // Array<{ idiomId, type, correct, timeMs, chosenAnswer, timestamp }>
  quizStats: {
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    fastestTime: Infinity,
    averageTime: 0,
  },
};

// ============================================================
// SLICE
// ============================================================

const idiomSlice = createSlice({
  name: 'idiom',
  initialState,
  reducers: {
    /**
     * Mark an idiom as learned. Idempotent — no duplicate IDs.
     * payload: idiomId (string)
     */
    learnIdiom(state, action) {
      const id = action.payload;
      if (!state.learnedIdioms.includes(id)) {
        state.learnedIdioms.push(id);
      }
    },

    /**
     * Remove an idiom from learned list.
     * payload: idiomId (string)
     */
    unlearnIdiom(state, action) {
      const id = action.payload;
      state.learnedIdioms = state.learnedIdioms.filter((x) => x !== id);
    },

    /**
     * Toggle an idiom as favourite (add/remove).
     * payload: idiomId (string)
     */
    toggleFavorite(state, action) {
      const id = action.payload;
      const idx = state.favorites.indexOf(id);
      if (idx === -1) {
        state.favorites.push(id);
      } else {
        state.favorites.splice(idx, 1);
      }
    },

    /**
     * Set today's daily idiom.
     * payload: { idiomId, date }
     */
    setDailyIdiom(state, action) {
      const { idiomId, date } = action.payload;
      state.dailyIdiomId = idiomId;
      state.lastDailyDate = date;
    },

    /**
     * Record a quiz answer. Caps history at 100 entries.
     * payload: { idiomId, type, correct, timeMs, chosenAnswer }
     */
    recordIdiomQuiz(state, action) {
      const { idiomId, type, correct, timeMs, chosenAnswer } = action.payload;

      // Append to history
      state.quizHistory.push({
        idiomId,
        type,
        correct,
        timeMs,
        chosenAnswer,
        timestamp: Date.now(),
      });

      // Cap at 100 entries
      if (state.quizHistory.length > 100) {
        state.quizHistory = state.quizHistory.slice(-100);
      }

      // Recalculate stats
      const history = state.quizHistory;
      const total = history.length;
      const correctCount = history.filter((h) => h.correct).length;
      const times = history.map((h) => h.timeMs);
      const fastest = Math.min(...times);
      const avgTime = times.reduce((a, b) => a + b, 0) / total;

      state.quizStats = {
        totalQuestions: total,
        correctAnswers: correctCount,
        accuracy: total > 0 ? Math.round((correctCount / total) * 100) : 0,
        fastestTime: fastest,
        averageTime: Math.round(avgTime),
      };
    },

    /**
     * Clear all quiz history and stats.
     */
    clearHistory(state) {
      state.quizHistory = [];
      state.quizStats = {
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        fastestTime: Infinity,
        averageTime: 0,
      };
    },

    /**
     * Full state reset (for testing).
     */
    resetAllIdiomState() {
      return { ...initialState, quizStats: { ...initialState.quizStats } };
    },
  },
});

export const {
  learnIdiom,
  unlearnIdiom,
  toggleFavorite,
  setDailyIdiom,
  recordIdiomQuiz,
  clearHistory,
  resetAllIdiomState,
} = idiomSlice.actions;

// ============================================================
// SELECTORS
// ============================================================

// Learned
export const selectLearnedIds = (state) => state.idiom?.learnedIdioms ?? [];
export const selectLearnedCount = (state) => (state.idiom?.learnedIdioms ?? []).length;
export const selectIdiomIsLearned = (idiomId) => (state) =>
  (state.idiom?.learnedIdioms ?? []).includes(idiomId);

// Favorites
export const selectFavoriteIds = (state) => state.idiom?.favorites ?? [];
export const selectIdiomIsFavorite = (idiomId) => (state) =>
  (state.idiom?.favorites ?? []).includes(idiomId);

// Daily
export const selectDailyIdiomId = (state) => state.idiom?.dailyIdiomId ?? null;
export const selectLastDailyDate = (state) => state.idiom?.lastDailyDate ?? null;

// Quiz
export const selectQuizHistory = (state) => state.idiom?.quizHistory ?? [];
export const selectQuizStats = (state) =>
  state.idiom?.quizStats ?? initialState.quizStats;
export const selectQuizAccuracy = (state) =>
  state.idiom?.quizStats?.accuracy ?? 0;
export const selectAverageQuizTime = (state) =>
  state.idiom?.quizStats?.averageTime ?? 0;

// ============================================================
// MEMOISED SELECTORS
// ============================================================

/**
 * Learning progress by category: { wisdom: { learned: 5, total: 12 }, ... }
 */
export const selectLearnProgressByCategory = createSelector(
  [selectLearnedIds],
  (learnedIds) => {
    const learnedSet = new Set(learnedIds);
    const result = {};
    for (const cat of IDIOM_CATEGORIES) {
      const catIdioms = getIdiomsByCategory(cat);
      result[cat] = {
        learned: catIdioms.filter((i) => learnedSet.has(i.id)).length,
        total: catIdioms.length,
      };
    }
    return result;
  }
);

/**
 * Unlearned idioms at a given CEFR level.
 */
export const selectUnlearnedByLevel = (level) =>
  createSelector([selectLearnedIds], (learnedIds) => {
    const learnedSet = new Set(learnedIds);
    return ARABIC_IDIOMS.filter(
      (i) => i.cefrLevel === level && !learnedSet.has(i.id)
    );
  });

/**
 * Learning streak — consecutive days with quiz attempts.
 */
export const selectLearningStreak = createSelector(
  [selectQuizHistory],
  (history) => {
    if (history.length === 0) return 0;

    // Extract unique dates
    const dates = [...new Set(
      history.map((h) => new Date(h.timestamp).toISOString().split('T')[0])
    )].sort().reverse();

    if (dates.length === 0) return 0;

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1] + 'T00:00:00Z');
      const curr = new Date(dates[i] + 'T00:00:00Z');
      const diffMs = prev.getTime() - curr.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
);

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default idiomSlice.reducer;
