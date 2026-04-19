/**
 * writingSlice.test.js
 *
 * Tests for the writing practice Redux slice — reducers, selectors, score tracking.
 *
 * Phase 83 — Arabic Writing Practice
 */

import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  recordAttempt,
  setLevel,
  addPracticeTime,
  selectLetterScore,
  selectLevelProgress,
  selectWritingStats,
  selectAverageScore,
  selectCurrentLevel,
  selectTotalPracticeTime,
  selectLetterScores,
  selectWordScores,
  selectPhraseScores,
} from '../writingSlice.js';

describe('writingSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  // ─── Initial State ──────────────────────────────────────────────────

  describe('initial state', () => {
    it('has correct shape', () => {
      expect(initialState).toEqual({
        letterScores: {},
        wordScores: {},
        phraseScores: {},
        currentLevel: 'isolated',
        totalPracticeTime: 0,
      });
    });
  });

  // ─── recordAttempt ──────────────────────────────────────────────────

  describe('recordAttempt', () => {
    it('creates a new entry for first attempt on a letter', () => {
      const state = reducer(initialState, recordAttempt({ id: 'alif', score: 65, type: 'letter' }));
      expect(state.letterScores.alif).toBeDefined();
      expect(state.letterScores.alif.bestScore).toBe(65);
      expect(state.letterScores.alif.attempts).toBe(1);
      expect(state.letterScores.alif.lastAttempt).toBeGreaterThan(0);
    });

    it('increments attempts on subsequent tries', () => {
      let state = reducer(initialState, recordAttempt({ id: 'ba', score: 40, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'ba', score: 55, type: 'letter' }));
      expect(state.letterScores.ba.attempts).toBe(2);
    });

    it('updates bestScore only when new score is higher', () => {
      let state = reducer(initialState, recordAttempt({ id: 'ta', score: 70, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'ta', score: 50, type: 'letter' }));
      expect(state.letterScores.ta.bestScore).toBe(70);

      state = reducer(state, recordAttempt({ id: 'ta', score: 90, type: 'letter' }));
      expect(state.letterScores.ta.bestScore).toBe(90);
    });

    it('stores word scores in wordScores bucket', () => {
      const state = reducer(initialState, recordAttempt({ id: 'word_kitab', score: 55, type: 'word' }));
      expect(state.wordScores.word_kitab).toBeDefined();
      expect(state.wordScores.word_kitab.bestScore).toBe(55);
      expect(state.letterScores).toEqual({});
    });

    it('stores phrase scores in phraseScores bucket', () => {
      const state = reducer(initialState, recordAttempt({ id: 'phrase_hello', score: 80, type: 'phrase' }));
      expect(state.phraseScores.phrase_hello).toBeDefined();
      expect(state.phraseScores.phrase_hello.bestScore).toBe(80);
      expect(state.letterScores).toEqual({});
      expect(state.wordScores).toEqual({});
    });

    it('tracks multiple items independently', () => {
      let state = reducer(initialState, recordAttempt({ id: 'alif', score: 60, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'ba', score: 75, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'word_kitab', score: 50, type: 'word' }));

      expect(Object.keys(state.letterScores)).toHaveLength(2);
      expect(Object.keys(state.wordScores)).toHaveLength(1);
    });
  });

  // ─── setLevel ───────────────────────────────────────────────────────

  describe('setLevel', () => {
    it('changes currentLevel', () => {
      const state = reducer(initialState, setLevel('connected'));
      expect(state.currentLevel).toBe('connected');
    });

    it('accepts "phrases"', () => {
      const state = reducer(initialState, setLevel('phrases'));
      expect(state.currentLevel).toBe('phrases');
    });
  });

  // ─── addPracticeTime ───────────────────────────────────────────────

  describe('addPracticeTime', () => {
    it('accumulates practice seconds', () => {
      let state = reducer(initialState, addPracticeTime(30));
      expect(state.totalPracticeTime).toBe(30);

      state = reducer(state, addPracticeTime(45));
      expect(state.totalPracticeTime).toBe(75);
    });
  });

  // ─── Selectors ──────────────────────────────────────────────────────

  describe('selectors', () => {
    const mockRoot = (writingState) => ({ writing: writingState });

    it('selectCurrentLevel returns level', () => {
      expect(selectCurrentLevel(mockRoot(initialState))).toBe('isolated');
    });

    it('selectTotalPracticeTime returns time', () => {
      expect(selectTotalPracticeTime(mockRoot(initialState))).toBe(0);
    });

    it('selectLetterScore returns null for unscored letter', () => {
      expect(selectLetterScore(mockRoot(initialState), 'alif')).toBeNull();
    });

    it('selectLetterScore returns score data for scored letter', () => {
      const state = reducer(initialState, recordAttempt({ id: 'alif', score: 70, type: 'letter' }));
      const result = selectLetterScore(mockRoot(state), 'alif');
      expect(result.bestScore).toBe(70);
      expect(result.attempts).toBe(1);
    });

    it('selectLevelProgress counts attempted/passed/excellent', () => {
      let state = reducer(initialState, recordAttempt({ id: 'alif', score: 90, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'ba', score: 60, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'ta', score: 30, type: 'letter' }));

      const progress = selectLevelProgress(mockRoot(state), 'isolated');
      expect(progress.attempted).toBe(3);
      expect(progress.passed).toBe(2);   // 90 and 60 are >= 50
      expect(progress.excellent).toBe(1); // only 90 >= 80
    });

    it('selectWritingStats aggregates across all levels', () => {
      let state = reducer(initialState, recordAttempt({ id: 'alif', score: 80, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'alif', score: 85, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'word_kitab', score: 55, type: 'word' }));
      state = reducer(state, addPracticeTime(120));

      const stats = selectWritingStats(mockRoot(state));
      expect(stats.totalItems).toBe(2);        // alif + word_kitab
      expect(stats.totalAttempts).toBe(3);      // 2 alif attempts + 1 word attempt
      expect(stats.totalPracticeTime).toBe(120);
    });

    it('selectAverageScore computes mean of best scores', () => {
      let state = reducer(initialState, recordAttempt({ id: 'alif', score: 80, type: 'letter' }));
      state = reducer(state, recordAttempt({ id: 'ba', score: 60, type: 'letter' }));

      const avg = selectAverageScore(mockRoot(state));
      expect(avg).toBe(70); // (80 + 60) / 2
    });

    it('selectAverageScore returns 0 when no scores', () => {
      expect(selectAverageScore(mockRoot(initialState))).toBe(0);
    });

    it('selectLetterScores returns the letterScores object', () => {
      const state = reducer(initialState, recordAttempt({ id: 'alif', score: 50, type: 'letter' }));
      const scores = selectLetterScores(mockRoot(state));
      expect(scores).toHaveProperty('alif');
    });

    it('selectWordScores returns the wordScores object', () => {
      const scores = selectWordScores(mockRoot(initialState));
      expect(scores).toEqual({});
    });

    it('selectPhraseScores returns the phraseScores object', () => {
      const scores = selectPhraseScores(mockRoot(initialState));
      expect(scores).toEqual({});
    });
  });
});
