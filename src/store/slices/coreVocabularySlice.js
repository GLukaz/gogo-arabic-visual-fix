/**
 * coreVocabularySlice.js — FEAT-042
 *
 * Tracks mastery of the 100 core Arabic vocabulary words.
 * Words are introduced sequentially after alphabet mastery.
 * A word is considered "mastered" when its score reaches CORE_MASTERY_THRESHOLD.
 */
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { CORE_VOCABULARY } from '../../data/coreVocabulary.js';

/** Mastery percentage (0-100) required per word to count as "completed" */
export const CORE_MASTERY_THRESHOLD = 70;

/** Total number of core words */
export const CORE_WORD_COUNT = CORE_VOCABULARY.length;

// ── Pure Helpers ──────────────────────────────────────────────────────────────

/**
 * Returns true when all 100 core words have ≥ CORE_MASTERY_THRESHOLD% mastery.
 *
 * @param {Object} state - Full Redux state (must have coreVocabulary key)
 * @returns {boolean}
 */
export function isCoreVocabComplete(state) {
  const wordMastery = state.coreVocabulary?.wordMastery ?? {};
  return CORE_VOCABULARY.every(
    (word) => (wordMastery[word.id] ?? 0) >= CORE_MASTERY_THRESHOLD,
  );
}

/**
 * Returns completed count, total, and percentage for core vocab progress.
 *
 * @param {Object} state - Full Redux state
 * @returns {{ completed: number, total: number, percentage: number }}
 */
export function getCoreVocabProgress(state) {
  const wordMastery = state.coreVocabulary?.wordMastery ?? {};
  const completed = CORE_VOCABULARY.filter(
    (word) => (wordMastery[word.id] ?? 0) >= CORE_MASTERY_THRESHOLD,
  ).length;
  const total = CORE_WORD_COUNT;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  /**
   * Per-word mastery scores keyed by core word ID.
   * { [wordId: string]: number } — 0-100
   */
  wordMastery: {},
};

const coreVocabularySlice = createSlice({
  name: 'coreVocabulary',
  initialState,
  reducers: {
    /**
     * Record a mastery score for a core word.
     * Payload: { wordId: string, score: number }
     * Score is clamped to 0-100.
     */
    recordWordMastery(state, action) {
      const { wordId, score } = action.payload;
      const clamped = Math.max(0, Math.min(100, Math.round(score)));
      state.wordMastery[wordId] = clamped;
    },

    /**
     * Reset mastery for a single word back to 0.
     * Payload: wordId string
     */
    resetWordMastery(state, action) {
      const wordId = action.payload;
      delete state.wordMastery[wordId];
    },

    /**
     * Reset all core vocabulary mastery (e.g. for a fresh start).
     */
    resetAllCoreVocab(state) {
      state.wordMastery = {};
    },
  },
});

export const { recordWordMastery, resetWordMastery, resetAllCoreVocab } =
  coreVocabularySlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

/**
 * Mastery score (0-100) for a single core word.
 * @param {Object} state - Full Redux state
 * @param {string} wordId - Core word ID (e.g. "core_001")
 * @returns {number}
 */
export const selectWordMastery = (state, wordId) =>
  state.coreVocabulary?.wordMastery?.[wordId] ?? 0;

/** True when all 100 core words are at CORE_MASTERY_THRESHOLD%+ mastery */
export const selectIsCoreVocabComplete = (state) => isCoreVocabComplete(state);

/**
 * Memoized selector: { completed, total, percentage } for core vocab progress.
 */
export const selectCoreVocabProgress = createSelector(
  (state) => state.coreVocabulary?.wordMastery ?? {},
  (wordMastery) => {
    const completed = CORE_VOCABULARY.filter(
      (word) => (wordMastery[word.id] ?? 0) >= CORE_MASTERY_THRESHOLD,
    ).length;
    const total = CORE_WORD_COUNT;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percentage };
  },
);

export default coreVocabularySlice.reducer;
