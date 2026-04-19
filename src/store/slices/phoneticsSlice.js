/**
 * Phonetics Redux Slice — Phase 95 (PHON-02)
 *
 * Tracks pronunciation practice progress including per-letter scores,
 * minimal pair accuracy, completed categories, and total practice time.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  practiceScores: {},      // { [letterId]: { bestScore: number, attempts: number, lastAttempt: number } }
  minimalPairScores: {},   // { [pairId]: { bestScore: number, attempts: number, correct: number } }
  completedCategories: [], // ['emphatic', 'pharyngeal', ...]
  totalPracticeTime: 0,    // seconds
};

const phoneticsSlice = createSlice({
  name: 'phonetics',
  initialState,
  reducers: {
    recordPracticeAttempt(state, action) {
      // payload: { id (letterId), score (0-100), type: 'consonant' | 'vowel' }
      const { id, score } = action.payload;
      const existing = state.practiceScores[id];
      if (!existing) {
        state.practiceScores[id] = { bestScore: score, attempts: 1, lastAttempt: Date.now() };
      } else {
        existing.attempts += 1;
        existing.lastAttempt = Date.now();
        if (score > existing.bestScore) {
          existing.bestScore = score;
        }
      }
    },

    recordMinimalPairAttempt(state, action) {
      // payload: { pairId, correct (boolean) }
      const { pairId, correct } = action.payload;
      const existing = state.minimalPairScores[pairId];
      if (!existing) {
        state.minimalPairScores[pairId] = {
          bestScore: correct ? 100 : 0,
          attempts: 1,
          correct: correct ? 1 : 0,
        };
      } else {
        existing.attempts += 1;
        if (correct) existing.correct += 1;
        existing.bestScore = Math.round((existing.correct / existing.attempts) * 100);
      }
    },

    markCategoryCompleted(state, action) {
      // payload: categoryId
      const categoryId = action.payload;
      if (!state.completedCategories.includes(categoryId)) {
        state.completedCategories.push(categoryId);
      }
    },

    addPracticeTime(state, action) {
      // payload: seconds (number)
      state.totalPracticeTime += action.payload;
    },
  },
});

export const {
  recordPracticeAttempt,
  recordMinimalPairAttempt,
  markCategoryCompleted,
  addPracticeTime,
} = phoneticsSlice.actions;

// ── Selectors ───────────────────────────────────────────────────────────────

export const selectPracticeScores = (state) => state.phonetics.practiceScores;
export const selectMinimalPairScores = (state) => state.phonetics.minimalPairScores;
export const selectCompletedCategories = (state) => state.phonetics.completedCategories;
export const selectTotalPracticeTime = (state) => state.phonetics.totalPracticeTime;

/** Select practice score for a specific letter. */
export const selectLetterPracticeScore = (state, letterId) =>
  state.phonetics.practiceScores[letterId] || null;

/** Select the 5 weakest sounds (lowest bestScore among attempted letters). */
export const selectWeakestSounds = createSelector(
  [selectPracticeScores],
  (scores) => {
    const attempted = Object.entries(scores)
      .filter(([, data]) => data.attempts > 0)
      .sort((a, b) => (a[1].bestScore || 0) - (b[1].bestScore || 0))
      .slice(0, 5);
    return attempted.map(([id, data]) => ({ id, ...data }));
  }
);

/** Select overall pronunciation accuracy (average bestScore across all attempted letters). */
export const selectPronunciationAccuracy = createSelector(
  [selectPracticeScores],
  (scores) => {
    const attempted = Object.values(scores).filter((s) => s.attempts > 0);
    if (attempted.length === 0) return 0;
    const sum = attempted.reduce((acc, s) => acc + (s.bestScore || 0), 0);
    return Math.round(sum / attempted.length);
  }
);

/** Select minimal pair accuracy (average bestScore across all attempted pairs). */
export const selectMinimalPairAccuracy = createSelector(
  [selectMinimalPairScores],
  (scores) => {
    const attempted = Object.values(scores).filter((s) => s.attempts > 0);
    if (attempted.length === 0) return 0;
    const sum = attempted.reduce((acc, s) => acc + (s.bestScore || 0), 0);
    return Math.round(sum / attempted.length);
  }
);

export default phoneticsSlice.reducer;
