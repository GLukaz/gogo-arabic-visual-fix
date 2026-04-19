/**
 * Daily goal configurations
 * Defines daily challenges and their XP rewards
 */

export const DAILY_GOAL_TYPES = {
  WORDS_LEARNED: 'wordsLearned',
  REVIEWS_DONE: 'reviewsDone',
  QUIZZES_PASSED: 'quizzesPassed',
  MINUTES_PLAYED: 'minutesPlayed',
};

export const DEFAULT_DAILY_GOALS = {
  [DAILY_GOAL_TYPES.WORDS_LEARNED]: {
    current: 0,
    target: 5,
    xpReward: 50,
    label: 'Learn Words',
    icon: 'Aa',
  },
  [DAILY_GOAL_TYPES.REVIEWS_DONE]: {
    current: 0,
    target: 10,
    xpReward: 30,
    label: 'Complete Reviews',
    icon: '✓',
  },
  [DAILY_GOAL_TYPES.QUIZZES_PASSED]: {
    current: 0,
    target: 3,
    xpReward: 40,
    label: 'Pass Quizzes',
    icon: '?',
  },
  [DAILY_GOAL_TYPES.MINUTES_PLAYED]: {
    current: 0,
    target: 15,
    xpReward: 25,
    label: 'Study Time',
    icon: '⏱',
  },
};

// Bonus XP for completing ALL daily goals
export const ALL_GOALS_BONUS_XP = 100;

/**
 * Check if a specific goal is completed
 * @param {Object} goal - Goal object with current and target
 * @returns {boolean} True if goal is completed
 */
export function isGoalCompleted(goal) {
  return goal.current >= goal.target;
}

/**
 * Check if all daily goals are completed
 * @param {Object} goals - Goals object
 * @returns {boolean} True if all goals completed
 */
export function areAllGoalsCompleted(goals) {
  return Object.values(goals).every(isGoalCompleted);
}

/**
 * Calculate total XP earned from daily goals
 * @param {Object} goals - Goals object
 * @param {boolean} allCompleted - Whether all goals are completed
 * @returns {number} Total XP earned
 */
export function calculateDailyGoalXP(goals, allCompleted) {
  let totalXP = 0;

  Object.values(goals).forEach((goal) => {
    if (isGoalCompleted(goal)) {
      totalXP += goal.xpReward;
    }
  });

  if (allCompleted) {
    totalXP += ALL_GOALS_BONUS_XP;
  }

  return totalXP;
}

/**
 * Get progress percentage for a goal
 * @param {Object} goal - Goal object
 * @returns {number} Progress percentage (0-100)
 */
export function getGoalProgress(goal) {
  if (goal.target === 0) return 100;
  return Math.min((goal.current / goal.target) * 100, 100);
}
