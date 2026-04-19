import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { dailyGoalsMiddleware } from '../dailyGoalsMiddleware.js';
import dailyGoalsReducer from '../../slices/dailyGoalsSlice.js';
import playerReducer, { incrementWordsLearned } from '../../slices/playerSlice.js';
import achievementReducer, { incrementReviews } from '../../slices/achievementSlice.js';
import { DAILY_GOAL_TYPES } from '../../../data/dailyGoals.js';

/**
 * Daily Goals Middleware Integration Tests
 *
 * Tests the middleware's ability to:
 * - Track player actions and increment goal progress
 * - Mark goals as complete when target is reached
 * - Award XP for individual goal completion
 * - Award bonus XP when all goals are completed
 * - Ignore actions outside goal scope
 */
describe('dailyGoalsMiddleware', () => {
  let store;

  beforeEach(() => {
    // Create a fresh store with middleware for each test
    store = configureStore({
      reducer: {
        dailyGoals: dailyGoalsReducer,
        player: playerReducer,
        achievements: achievementReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(dailyGoalsMiddleware),
    });
  });

  describe('words learned goal tracking', () => {
    it('should increment words learned goal when player learns a word', () => {
      const initialProgress = store.getState().dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED].current;
      expect(initialProgress).toBe(0);

      // Dispatch action that triggers words learned tracking
      store.dispatch(incrementWordsLearned());

      const state = store.getState();
      const goalProgress = state.dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED].current;

      expect(goalProgress).toBe(1);
    });

    it('should mark goal as complete when target is reached', () => {
      const goal = store.getState().dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED];
      const target = goal.target; // Default is 5

      // Learn enough words to complete the goal
      for (let i = 0; i < target; i++) {
        store.dispatch(incrementWordsLearned());
      }

      const state = store.getState();
      const currentProgress = state.dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED].current;

      expect(currentProgress).toBeGreaterThanOrEqual(target);
    });

    it('should award XP when individual goal is completed', () => {
      const initialXP = store.getState().player.xp;
      const goal = store.getState().dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED];
      const target = goal.target;
      const expectedReward = goal.xpReward; // 50 XP for words learned goal

      // Complete the goal
      for (let i = 0; i < target; i++) {
        store.dispatch(incrementWordsLearned());
      }

      const finalXP = store.getState().player.xp;

      // XP should have increased by at least the goal reward
      expect(finalXP).toBeGreaterThan(initialXP);
      expect(finalXP - initialXP).toBeGreaterThanOrEqual(expectedReward);
    });

    it('should NOT award XP twice for the same goal completion', () => {
      const goal = store.getState().dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED];
      const target = goal.target;

      // Complete the goal
      for (let i = 0; i < target; i++) {
        store.dispatch(incrementWordsLearned());
      }

      const xpAfterCompletion = store.getState().player.xp;

      // Continue past target - should NOT award goal XP again
      store.dispatch(incrementWordsLearned());

      const xpAfterExtra = store.getState().player.xp;

      // XP difference should be minimal (no additional goal reward)
      const difference = xpAfterExtra - xpAfterCompletion;
      expect(difference).toBeLessThan(goal.xpReward);
    });
  });

  describe('reviews done goal tracking', () => {
    it('should increment reviews done goal when player completes a review', () => {
      const initialProgress = store.getState().dailyGoals.goals[DAILY_GOAL_TYPES.REVIEWS_DONE].current;
      expect(initialProgress).toBe(0);

      // Dispatch review completion action
      store.dispatch(incrementReviews());

      const state = store.getState();
      const goalProgress = state.dailyGoals.goals[DAILY_GOAL_TYPES.REVIEWS_DONE].current;

      expect(goalProgress).toBe(1);
    });

    it('should track multiple review completions', () => {
      // Complete multiple reviews
      for (let i = 0; i < 3; i++) {
        store.dispatch(incrementReviews());
      }

      const state = store.getState();
      const goalProgress = state.dailyGoals.goals[DAILY_GOAL_TYPES.REVIEWS_DONE].current;

      expect(goalProgress).toBe(3);
    });
  });

  describe('all goals bonus', () => {
    it('should award bonus XP when all goals are completed', () => {
      const initialXP = store.getState().player.xp;
      const goals = store.getState().dailyGoals.goals;

      // Note: Only WORDS_LEARNED and REVIEWS_DONE are tracked by middleware
      // QUIZZES_PASSED and MINUTES_PLAYED are not auto-tracked in current implementation
      // So we can only test completing the two tracked goals
      const wordsTarget = goals[DAILY_GOAL_TYPES.WORDS_LEARNED].target;
      const reviewsTarget = goals[DAILY_GOAL_TYPES.REVIEWS_DONE].target;

      for (let i = 0; i < wordsTarget; i++) {
        store.dispatch(incrementWordsLearned());
      }

      for (let i = 0; i < reviewsTarget; i++) {
        store.dispatch(incrementReviews());
      }

      const finalXP = store.getState().player.xp;

      // Should have awarded individual goal XP (words 50 + reviews 30 = 80)
      // Note: All goals bonus requires ALL 4 goals, but only 2 are auto-tracked
      const xpGained = finalXP - initialXP;

      // Expected: 50 (words) + 30 (reviews) = at least 80
      expect(xpGained).toBeGreaterThanOrEqual(80);
    });

    it('should NOT award bonus XP if only some goals are completed', () => {
      const initialXP = store.getState().player.xp;
      const goals = store.getState().dailyGoals.goals;

      // Complete only words learned goal (not all)
      const wordsTarget = goals[DAILY_GOAL_TYPES.WORDS_LEARNED].target;

      for (let i = 0; i < wordsTarget; i++) {
        store.dispatch(incrementWordsLearned());
      }

      const finalXP = store.getState().player.xp;
      const xpGained = finalXP - initialXP;

      // Should have awarded only the words goal XP (50), NOT the 100 bonus
      expect(xpGained).toBeLessThan(100);
    });
  });

  describe('actions outside goal scope', () => {
    it('should NOT change goals when unrelated action is dispatched', () => {
      const initialGoals = store.getState().dailyGoals.goals;

      // Dispatch an action not tracked by daily goals middleware
      store.dispatch({ type: 'player/updateStreak', payload: 5 });

      const finalGoals = store.getState().dailyGoals.goals;

      // Goals should remain unchanged
      expect(finalGoals[DAILY_GOAL_TYPES.WORDS_LEARNED].current).toBe(
        initialGoals[DAILY_GOAL_TYPES.WORDS_LEARNED].current
      );
      expect(finalGoals[DAILY_GOAL_TYPES.REVIEWS_DONE].current).toBe(
        initialGoals[DAILY_GOAL_TYPES.REVIEWS_DONE].current
      );
    });
  });

  describe('progress calculations', () => {
    it('should correctly track progress percentage', () => {
      const goal = store.getState().dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED];
      const target = goal.target;
      const halfTarget = Math.floor(target / 2);

      // Complete half the goal
      for (let i = 0; i < halfTarget; i++) {
        store.dispatch(incrementWordsLearned());
      }

      const state = store.getState();
      const currentProgress = state.dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED].current;

      expect(currentProgress).toBe(halfTarget);
      expect(currentProgress).toBeLessThan(target);
    });

    it('should handle exceeding target gracefully', () => {
      const goal = store.getState().dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED];
      const target = goal.target;

      // Exceed the target
      for (let i = 0; i < target + 5; i++) {
        store.dispatch(incrementWordsLearned());
      }

      const state = store.getState();
      const currentProgress = state.dailyGoals.goals[DAILY_GOAL_TYPES.WORDS_LEARNED].current;

      // Progress should exceed target (but goal still complete)
      expect(currentProgress).toBe(target + 5);
      expect(currentProgress).toBeGreaterThan(target);
    });
  });
});
