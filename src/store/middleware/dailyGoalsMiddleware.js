/**
 * Daily Goals Middleware
 *
 * Automatically tracks player actions and updates daily goal progress
 */

import { updateDailyGoal, checkDailyReset } from '../slices/dailyGoalsSlice.js';
import { DAILY_GOAL_TYPES } from '../../data/dailyGoals.js';
import { addXP } from '../slices/playerSlice.js';
import { ALL_GOALS_BONUS_XP, areAllGoalsCompleted } from '../../data/dailyGoals.js';

// Map action types to daily goal types
const ACTION_TO_GOAL_MAPPING = {
  'player/incrementWordsLearned': {
    goalType: DAILY_GOAL_TYPES.WORDS_LEARNED,
    amount: 1,
  },
  'achievements/incrementReviews': {
    goalType: DAILY_GOAL_TYPES.REVIEWS_DONE,
    amount: 1,
  },
  // WIRE-01: Quiz and grammar completions auto-tracked
  'vocabulary/updateFsrsCard': {
    goalType: DAILY_GOAL_TYPES.REVIEWS_DONE,
    amount: 1,
  },
  'grammar/completeLesson': {
    goalType: DAILY_GOAL_TYPES.REVIEWS_DONE,
    amount: 1,
  },
};

// Re-entrancy guard: prevents infinite cascade when addXP from goal completion
// re-enters this middleware
let _isProcessingGoals = false;

export const dailyGoalsMiddleware = (store) => (next) => (action) => {
  // Pass the action through first
  const result = next(action);

  // Prevent re-entrant dispatch cascade
  if (_isProcessingGoals) return result;

  // Only check for date reset on goal-tracking actions (not every player/ or vocabulary/ action)
  const goalMapping = ACTION_TO_GOAL_MAPPING[action.type];

  if (goalMapping) {
    _isProcessingGoals = true;
    try {
      // Check for date reset before tracking
      store.dispatch(checkDailyReset());

      const state = store.getState();
      const goalsBefore = state.dailyGoals.goals;
      const wasCompleted = areAllGoalsCompleted(goalsBefore);

      // Update the goal
      store.dispatch(updateDailyGoal({
        goalType: goalMapping.goalType,
        amount: goalMapping.amount,
      }));

      // Check if all goals are now completed (and weren't before)
      const stateAfter = store.getState();
      const goalsAfter = stateAfter.dailyGoals.goals;
      const isNowCompleted = areAllGoalsCompleted(goalsAfter);

      // Collect XP rewards to batch
      let totalXp = 0;

      if (!wasCompleted && isNowCompleted) {
        totalXp += ALL_GOALS_BONUS_XP;
      }

      // Award XP for completing individual goals
      const goalAfter = goalsAfter[goalMapping.goalType];
      const goalBefore = goalsBefore[goalMapping.goalType];
      if (goalAfter.current >= goalAfter.target && goalBefore.current < goalBefore.target) {
        totalXp += goalAfter.xpReward;
      }

      // Dispatch batched XP once
      if (totalXp > 0) {
        store.dispatch(addXP(totalXp));
      }
    } finally {
      _isProcessingGoals = false;
    }
  }

  return result;
};

/**
 * Helper function to record quiz completion
 * Call this from quiz overlay when quiz is passed
 */
export function recordQuizCompletion(dispatch, passed) {
  if (passed) {
    dispatch(updateDailyGoal({
      goalType: DAILY_GOAL_TYPES.QUIZZES_PASSED,
      amount: 1,
    }));
  }
}
