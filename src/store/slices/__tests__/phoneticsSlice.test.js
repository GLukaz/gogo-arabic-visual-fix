import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  recordPracticeAttempt,
  recordMinimalPairAttempt,
  markCategoryCompleted,
  addPracticeTime,
  selectPracticeScores,
  selectMinimalPairScores,
  selectCompletedCategories,
  selectTotalPracticeTime,
  selectLetterPracticeScore,
  selectWeakestSounds,
  selectPronunciationAccuracy,
  selectMinimalPairAccuracy,
} from '../phoneticsSlice.js';

describe('phoneticsSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  // ── Initial state ───────────────────────────────────────────────────

  describe('initial state', () => {
    it('has empty practiceScores', () => {
      expect(initialState.practiceScores).toEqual({});
    });

    it('has empty minimalPairScores', () => {
      expect(initialState.minimalPairScores).toEqual({});
    });

    it('has empty completedCategories', () => {
      expect(initialState.completedCategories).toEqual([]);
    });

    it('has totalPracticeTime of 0', () => {
      expect(initialState.totalPracticeTime).toBe(0);
    });
  });

  // ── recordPracticeAttempt ─────────────────────────────────────────

  describe('recordPracticeAttempt', () => {
    it('creates new entry on first attempt', () => {
      const state = reducer(
        initialState,
        recordPracticeAttempt({ id: 'ba', score: 80, type: 'consonant' })
      );
      expect(state.practiceScores.ba).toBeDefined();
      expect(state.practiceScores.ba.bestScore).toBe(80);
      expect(state.practiceScores.ba.attempts).toBe(1);
      expect(state.practiceScores.ba.lastAttempt).toBeGreaterThan(0);
    });

    it('increments attempts on subsequent attempt', () => {
      let state = reducer(
        initialState,
        recordPracticeAttempt({ id: 'ba', score: 80, type: 'consonant' })
      );
      state = reducer(
        state,
        recordPracticeAttempt({ id: 'ba', score: 60, type: 'consonant' })
      );
      expect(state.practiceScores.ba.attempts).toBe(2);
    });

    it('updates bestScore when new score is higher', () => {
      let state = reducer(
        initialState,
        recordPracticeAttempt({ id: 'ba', score: 60, type: 'consonant' })
      );
      state = reducer(
        state,
        recordPracticeAttempt({ id: 'ba', score: 90, type: 'consonant' })
      );
      expect(state.practiceScores.ba.bestScore).toBe(90);
    });

    it('does not lower bestScore when new score is lower', () => {
      let state = reducer(
        initialState,
        recordPracticeAttempt({ id: 'ba', score: 90, type: 'consonant' })
      );
      state = reducer(
        state,
        recordPracticeAttempt({ id: 'ba', score: 50, type: 'consonant' })
      );
      expect(state.practiceScores.ba.bestScore).toBe(90);
    });

    it('handles multiple different letters independently', () => {
      let state = reducer(
        initialState,
        recordPracticeAttempt({ id: 'ba', score: 80, type: 'consonant' })
      );
      state = reducer(
        state,
        recordPracticeAttempt({ id: 'ta', score: 70, type: 'consonant' })
      );
      expect(state.practiceScores.ba.bestScore).toBe(80);
      expect(state.practiceScores.ta.bestScore).toBe(70);
    });
  });

  // ── recordMinimalPairAttempt ──────────────────────────────────────

  describe('recordMinimalPairAttempt', () => {
    it('creates new entry with correct=true', () => {
      const state = reducer(
        initialState,
        recordMinimalPairAttempt({ pairId: 'ba-fa', correct: true })
      );
      expect(state.minimalPairScores['ba-fa']).toEqual({
        bestScore: 100,
        attempts: 1,
        correct: 1,
      });
    });

    it('creates new entry with correct=false', () => {
      const state = reducer(
        initialState,
        recordMinimalPairAttempt({ pairId: 'ba-fa', correct: false })
      );
      expect(state.minimalPairScores['ba-fa']).toEqual({
        bestScore: 0,
        attempts: 1,
        correct: 0,
      });
    });

    it('tracks correct count and calculates accuracy', () => {
      let state = reducer(
        initialState,
        recordMinimalPairAttempt({ pairId: 'ba-fa', correct: true })
      );
      state = reducer(
        state,
        recordMinimalPairAttempt({ pairId: 'ba-fa', correct: true })
      );
      state = reducer(
        state,
        recordMinimalPairAttempt({ pairId: 'ba-fa', correct: false })
      );
      // 2 correct out of 3 attempts = 67%
      expect(state.minimalPairScores['ba-fa'].correct).toBe(2);
      expect(state.minimalPairScores['ba-fa'].attempts).toBe(3);
      expect(state.minimalPairScores['ba-fa'].bestScore).toBe(67);
    });

    it('handles multiple pairs independently', () => {
      let state = reducer(
        initialState,
        recordMinimalPairAttempt({ pairId: 'ba-fa', correct: true })
      );
      state = reducer(
        state,
        recordMinimalPairAttempt({ pairId: 'dad-dal', correct: false })
      );
      expect(state.minimalPairScores['ba-fa'].bestScore).toBe(100);
      expect(state.minimalPairScores['dad-dal'].bestScore).toBe(0);
    });
  });

  // ── markCategoryCompleted ─────────────────────────────────────────

  describe('markCategoryCompleted', () => {
    it('adds category to completedCategories', () => {
      const state = reducer(initialState, markCategoryCompleted('emphatic'));
      expect(state.completedCategories).toContain('emphatic');
    });

    it('does not add duplicates', () => {
      let state = reducer(initialState, markCategoryCompleted('emphatic'));
      state = reducer(state, markCategoryCompleted('emphatic'));
      expect(state.completedCategories.filter((c) => c === 'emphatic')).toHaveLength(1);
    });

    it('can add multiple different categories', () => {
      let state = reducer(initialState, markCategoryCompleted('emphatic'));
      state = reducer(state, markCategoryCompleted('pharyngeal'));
      expect(state.completedCategories).toContain('emphatic');
      expect(state.completedCategories).toContain('pharyngeal');
      expect(state.completedCategories).toHaveLength(2);
    });
  });

  // ── addPracticeTime ───────────────────────────────────────────────

  describe('addPracticeTime', () => {
    it('adds seconds to totalPracticeTime', () => {
      const state = reducer(initialState, addPracticeTime(30));
      expect(state.totalPracticeTime).toBe(30);
    });

    it('accumulates over multiple calls', () => {
      let state = reducer(initialState, addPracticeTime(30));
      state = reducer(state, addPracticeTime(45));
      expect(state.totalPracticeTime).toBe(75);
    });
  });

  // ── Selectors ─────────────────────────────────────────────────────

  describe('selectors', () => {
    const buildState = (phoneticsState) => ({
      phonetics: { ...initialState, ...phoneticsState },
    });

    describe('selectPracticeScores', () => {
      it('returns practiceScores', () => {
        const state = buildState({ practiceScores: { ba: { bestScore: 80, attempts: 1, lastAttempt: 1 } } });
        expect(selectPracticeScores(state)).toEqual({ ba: { bestScore: 80, attempts: 1, lastAttempt: 1 } });
      });
    });

    describe('selectMinimalPairScores', () => {
      it('returns minimalPairScores', () => {
        const state = buildState({ minimalPairScores: { 'ba-fa': { bestScore: 100, attempts: 1, correct: 1 } } });
        expect(selectMinimalPairScores(state)).toEqual({ 'ba-fa': { bestScore: 100, attempts: 1, correct: 1 } });
      });
    });

    describe('selectCompletedCategories', () => {
      it('returns completedCategories', () => {
        const state = buildState({ completedCategories: ['emphatic'] });
        expect(selectCompletedCategories(state)).toEqual(['emphatic']);
      });
    });

    describe('selectTotalPracticeTime', () => {
      it('returns totalPracticeTime', () => {
        const state = buildState({ totalPracticeTime: 120 });
        expect(selectTotalPracticeTime(state)).toBe(120);
      });
    });

    describe('selectLetterPracticeScore', () => {
      it('returns score for existing letter', () => {
        const state = buildState({
          practiceScores: { ba: { bestScore: 80, attempts: 2, lastAttempt: 1 } },
        });
        expect(selectLetterPracticeScore(state, 'ba')).toEqual({ bestScore: 80, attempts: 2, lastAttempt: 1 });
      });

      it('returns null for non-existent letter', () => {
        const state = buildState({});
        expect(selectLetterPracticeScore(state, 'ba')).toBeNull();
      });
    });

    describe('selectWeakestSounds', () => {
      it('returns up to 5 lowest-scored letters', () => {
        const state = buildState({
          practiceScores: {
            ba: { bestScore: 90, attempts: 1, lastAttempt: 1 },
            ta: { bestScore: 30, attempts: 1, lastAttempt: 1 },
            dal: { bestScore: 50, attempts: 1, lastAttempt: 1 },
            sin: { bestScore: 10, attempts: 1, lastAttempt: 1 },
            sad: { bestScore: 70, attempts: 1, lastAttempt: 1 },
            qaf: { bestScore: 20, attempts: 1, lastAttempt: 1 },
            kaf: { bestScore: 100, attempts: 1, lastAttempt: 1 },
          },
        });
        const weakest = selectWeakestSounds(state);
        expect(weakest).toHaveLength(5);
        expect(weakest[0].id).toBe('sin'); // 10
        expect(weakest[1].id).toBe('qaf'); // 20
        expect(weakest[2].id).toBe('ta'); // 30
        expect(weakest[3].id).toBe('dal'); // 50
        expect(weakest[4].id).toBe('sad'); // 70
      });

      it('returns empty array when no attempts', () => {
        const state = buildState({});
        expect(selectWeakestSounds(state)).toHaveLength(0);
      });

      it('returns fewer than 5 if fewer attempted', () => {
        const state = buildState({
          practiceScores: {
            ba: { bestScore: 80, attempts: 1, lastAttempt: 1 },
            ta: { bestScore: 60, attempts: 1, lastAttempt: 1 },
          },
        });
        expect(selectWeakestSounds(state)).toHaveLength(2);
      });
    });

    describe('selectPronunciationAccuracy', () => {
      it('calculates average bestScore', () => {
        const state = buildState({
          practiceScores: {
            ba: { bestScore: 80, attempts: 1, lastAttempt: 1 },
            ta: { bestScore: 60, attempts: 1, lastAttempt: 1 },
          },
        });
        expect(selectPronunciationAccuracy(state)).toBe(70); // (80+60)/2
      });

      it('returns 0 when no attempts', () => {
        const state = buildState({});
        expect(selectPronunciationAccuracy(state)).toBe(0);
      });

      it('rounds to nearest integer', () => {
        const state = buildState({
          practiceScores: {
            ba: { bestScore: 33, attempts: 1, lastAttempt: 1 },
            ta: { bestScore: 33, attempts: 1, lastAttempt: 1 },
            dal: { bestScore: 34, attempts: 1, lastAttempt: 1 },
          },
        });
        expect(selectPronunciationAccuracy(state)).toBe(33); // (33+33+34)/3 = 33.33
      });
    });

    describe('selectMinimalPairAccuracy', () => {
      it('calculates average bestScore for pairs', () => {
        const state = buildState({
          minimalPairScores: {
            'ba-fa': { bestScore: 100, attempts: 1, correct: 1 },
            'dad-dal': { bestScore: 50, attempts: 2, correct: 1 },
          },
        });
        expect(selectMinimalPairAccuracy(state)).toBe(75); // (100+50)/2
      });

      it('returns 0 when no attempts', () => {
        const state = buildState({});
        expect(selectMinimalPairAccuracy(state)).toBe(0);
      });
    });
  });
});
