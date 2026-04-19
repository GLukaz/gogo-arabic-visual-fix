/**
 * writingSlice.js
 *
 * Redux slice for Arabic writing practice — tracks per-letter, per-word,
 * and per-phrase scores, current difficulty level, and total practice time.
 *
 * Phase 83 — Arabic Writing Practice (WRITE-01 + WRITE-02)
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  letterScores: {},   // { [letterId]: { bestScore: number, attempts: number, lastAttempt: number } }
  wordScores: {},     // { [wordId]:   { bestScore: number, attempts: number, lastAttempt: number } }
  phraseScores: {},   // { [phraseId]: { bestScore: number, attempts: number, lastAttempt: number } }
  currentLevel: 'isolated', // 'isolated' | 'connected' | 'phrases'
  totalPracticeTime: 0,     // seconds
};

const writingSlice = createSlice({
  name: 'writing',
  initialState,
  reducers: {
    recordAttempt(state, action) {
      // payload: { id, score, type: 'letter' | 'word' | 'phrase' }
      const { id, score, type } = action.payload;
      const bucket =
        type === 'letter' ? state.letterScores :
        type === 'word' ? state.wordScores :
        state.phraseScores;

      const existing = bucket[id];
      if (!existing) {
        bucket[id] = { bestScore: score, attempts: 1, lastAttempt: Date.now() };
      } else {
        existing.attempts += 1;
        existing.lastAttempt = Date.now();
        if (score > existing.bestScore) {
          existing.bestScore = score;
        }
      }
    },

    setLevel(state, action) {
      // payload: 'isolated' | 'connected' | 'phrases'
      state.currentLevel = action.payload;
    },

    addPracticeTime(state, action) {
      // payload: seconds (number)
      state.totalPracticeTime += action.payload;
    },
  },
});

export const { recordAttempt, setLevel, addPracticeTime } = writingSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectLetterScores = (state) => state.writing.letterScores;
export const selectWordScores = (state) => state.writing.wordScores;
export const selectPhraseScores = (state) => state.writing.phraseScores;
export const selectCurrentLevel = (state) => state.writing.currentLevel;
export const selectTotalPracticeTime = (state) => state.writing.totalPracticeTime;

/**
 * Select score data for a specific letter by ID.
 */
export const selectLetterScore = (state, letterId) =>
  state.writing.letterScores[letterId] || null;

/**
 * Select level progress — how many items attempted vs total in that level.
 * levelItems should be the total count of items in that level.
 */
export const selectLevelProgress = createSelector(
  [
    (state) => state.writing.letterScores,
    (state) => state.writing.wordScores,
    (state) => state.writing.phraseScores,
    (_state, level) => level,
  ],
  (letterScores, wordScores, phraseScores, level) => {
    const bucket =
      level === 'isolated' ? letterScores :
      level === 'connected' ? wordScores :
      phraseScores;
    const attempted = Object.keys(bucket).length;
    const passed = Object.values(bucket).filter((s) => s.bestScore >= 50).length;
    const excellent = Object.values(bucket).filter((s) => s.bestScore >= 80).length;
    return { attempted, passed, excellent };
  }
);

/**
 * Aggregate writing stats across all levels.
 */
export const selectWritingStats = createSelector(
  [
    (state) => state.writing.letterScores,
    (state) => state.writing.wordScores,
    (state) => state.writing.phraseScores,
    (state) => state.writing.totalPracticeTime,
  ],
  (letterScores, wordScores, phraseScores, totalPracticeTime) => {
    const allScores = [
      ...Object.values(letterScores),
      ...Object.values(wordScores),
      ...Object.values(phraseScores),
    ];
    const totalAttempts = allScores.reduce((sum, s) => sum + s.attempts, 0);
    const totalItems = allScores.length;
    return { totalAttempts, totalItems, totalPracticeTime };
  }
);

/**
 * Average best score across all attempted items.
 */
export const selectAverageScore = createSelector(
  [
    (state) => state.writing.letterScores,
    (state) => state.writing.wordScores,
    (state) => state.writing.phraseScores,
  ],
  (letterScores, wordScores, phraseScores) => {
    const allScores = [
      ...Object.values(letterScores),
      ...Object.values(wordScores),
      ...Object.values(phraseScores),
    ];
    if (allScores.length === 0) return 0;
    const sum = allScores.reduce((acc, s) => acc + s.bestScore, 0);
    return Math.round(sum / allScores.length);
  }
);

export default writingSlice.reducer;
