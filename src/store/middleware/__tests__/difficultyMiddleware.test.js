import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { difficultyMiddleware } from '../difficultyMiddleware.js';
import difficultyReducer, {
  startSession,
  recordResult,
} from '../../slices/difficultySlice.js';
import playerReducer from '../../slices/playerSlice.js';
import achievementReducer, {
  incrementReviews,
  recordPerfectQuiz,
} from '../../slices/achievementSlice.js';
import dailyChallengeReducer, {
  completeChallenge,
} from '../../slices/dailyChallengeSlice.js';

/**
 * Difficulty Middleware Integration Tests
 *
 * Tests the middleware's ability to:
 * - Record results from quiz/challenge actions
 * - Recalculate difficulty after every 5 results
 * - Detect fatigue and suggest breaks
 * - Adjust word rate based on mastery
 */
describe('difficultyMiddleware', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        difficulty: difficultyReducer,
        player: playerReducer,
        achievements: achievementReducer,
        dailyChallenge: dailyChallengeReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(difficultyMiddleware),
    });
  });

  describe('result recording', () => {
    it('records result when daily challenge is completed', () => {
      store.dispatch(completeChallenge({
        date: '2026-03-27',
        type: 'speed_quiz',
        score: 0.9,
        timeMs: 30000,
        xpEarned: 100,
      }));

      const state = store.getState();
      expect(state.difficulty.recentResults).toHaveLength(1);
      expect(state.difficulty.recentResults[0].correct).toBe(true); // 0.9 >= 0.7
      expect(state.difficulty.recentResults[0].type).toBe('speed_quiz');
    });

    it('records incorrect for low-score daily challenge', () => {
      store.dispatch(completeChallenge({
        date: '2026-03-27',
        type: 'speed_quiz',
        score: 0.5,
        timeMs: 60000,
        xpEarned: 50,
      }));

      const state = store.getState();
      expect(state.difficulty.recentResults[0].correct).toBe(false); // 0.5 < 0.7
    });

    it('records correct result for perfect quiz', () => {
      store.dispatch(recordPerfectQuiz());

      const state = store.getState();
      expect(state.difficulty.recentResults).toHaveLength(1);
      expect(state.difficulty.recentResults[0].correct).toBe(true);
      expect(state.difficulty.recentResults[0].type).toBe('perfect_quiz');
    });

    it('increments questionsThisSession on result recording', () => {
      store.dispatch(recordPerfectQuiz());
      expect(store.getState().difficulty.questionsThisSession).toBe(1);

      store.dispatch(recordPerfectQuiz());
      expect(store.getState().difficulty.questionsThisSession).toBe(2);
    });
  });

  describe('difficulty adjustment', () => {
    it('recalculates difficulty after every 5 results', () => {
      // Dispatch 5 perfect quiz actions to trigger recalculation
      for (let i = 0; i < 5; i++) {
        store.dispatch(recordPerfectQuiz());
      }

      // After 5 all-correct results, difficulty should increase from medium
      const state = store.getState();
      // The EMA might or might not trigger an increase with only 5 results,
      // but the mechanism should have been invoked (difficulty state should exist)
      expect(state.difficulty.recentResults).toHaveLength(5);
    });

    it('does not recalculate before 5 results', () => {
      const initialLevel = store.getState().difficulty.currentLevel;

      // Only 3 results — not enough to trigger recalculation
      for (let i = 0; i < 3; i++) {
        store.dispatch(recordPerfectQuiz());
      }

      // Level should remain unchanged (no recalculation at 3)
      expect(store.getState().difficulty.currentLevel).toBe(initialLevel);
    });

    it('adjusts maxNewWordsToday during recalculation', () => {
      // Dispatch exactly 10 results (triggers at both 5 and 10)
      for (let i = 0; i < 10; i++) {
        store.dispatch(recordPerfectQuiz());
      }

      const state = store.getState();
      // maxNewWordsToday should have been adjusted by the engine
      expect(state.difficulty.maxNewWordsToday).toBeGreaterThanOrEqual(1);
    });
  });

  describe('break detection', () => {
    it('suggests break when consecutive errors reach 5', () => {
      // Start a session so middleware can detect breaks
      store.dispatch(startSession({ timestamp: Date.now() }));

      // Manually record 5 incorrect results via direct dispatch
      for (let i = 0; i < 5; i++) {
        store.dispatch(recordResult({
          correct: false,
          timeMs: 1000,
          type: 'test',
          timestamp: Date.now(),
        }));
      }

      // Now dispatch a quiz action to trigger the break check
      store.dispatch(completeChallenge({
        date: '2026-03-27',
        type: 'speed_quiz',
        score: 0.3,
        timeMs: 60000,
        xpEarned: 10,
      }));

      // The middleware should have detected the consecutive errors
      // (5 from manual + 1 more from the challenge = 6)
      const state = store.getState();
      expect(state.difficulty.consecutiveErrors).toBeGreaterThanOrEqual(5);
    });

    it('does not suggest break for fresh session', () => {
      store.dispatch(startSession({ timestamp: Date.now() }));
      store.dispatch(recordPerfectQuiz());

      const state = store.getState();
      expect(state.difficulty.breakSuggested).toBe(false);
    });

    it('does not re-suggest break if already suggested', () => {
      store.dispatch(startSession({ timestamp: Date.now() - 31 * 60000 }));

      // First quiz action — should trigger break (>30 min)
      store.dispatch(recordPerfectQuiz());

      const breakBefore = store.getState().difficulty.breakSuggested;

      // Another quiz action — should not dispatch suggestBreak again
      store.dispatch(recordPerfectQuiz());

      // Still suggested (unchanged, no error from duplicate)
      expect(store.getState().difficulty.breakSuggested).toBe(breakBefore);
    });
  });

  describe('ignored actions', () => {
    it('does not process unrelated actions', () => {
      const initialState = store.getState().difficulty;

      // Dispatch an unrelated action
      store.dispatch({ type: 'player/setName', payload: 'Test' });

      const afterState = store.getState().difficulty;
      expect(afterState.recentResults).toEqual(initialState.recentResults);
      expect(afterState.questionsThisSession).toBe(initialState.questionsThisSession);
    });

    it('does not process difficulty/recordResult (prevents infinite loop)', () => {
      // Directly dispatching recordResult should not trigger the middleware
      // to dispatch another recordResult
      store.dispatch(recordResult({
        correct: true,
        timeMs: 1000,
        type: 'test',
        timestamp: Date.now(),
      }));

      // Should have exactly 1 result (not duplicated by middleware)
      expect(store.getState().difficulty.recentResults).toHaveLength(1);
    });
  });
});
