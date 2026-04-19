/**
 * quizDailyGoalsMiddleware.js — Quiz Session → Daily Goals Bridge
 *
 * Listens for quiz session completion events and increments the daily
 * reviewsCompleted counter (mapped to the QUIZZES_PASSED goal type).
 *
 * Trigger: 'dailyGoals/updateDailyGoal' with goalType === 'quizzesPassed'
 * This is dispatched by recordQuizCompletion() in dailyGoalsMiddleware.js
 * when a quiz session ends with score > 0 (completed, not abandoned).
 *
 * Edge-case guard: multiple rapid quiz completions within the same
 * calendar minute are de-duplicated so they count only once.
 */

import { claimReward } from '../slices/dailyGoalsSlice.js';
import { DAILY_GOAL_TYPES, DEFAULT_DAILY_GOALS } from '../../data/dailyGoals.js';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const QUIZ_GOAL_TYPE = DAILY_GOAL_TYPES.QUIZZES_PASSED;
const QUIZ_DAILY_TARGET = DEFAULT_DAILY_GOALS[QUIZ_GOAL_TYPE]?.target ?? 3;

// ─────────────────────────────────────────────────────────────────────────────
// Module-level daily state (resets on UTC date change)
// ─────────────────────────────────────────────────────────────────────────────

let _daily = {
  date: null,          // 'YYYY-MM-DD' UTC
  reviewsCompleted: 0, // quiz sessions counted today
  lastQuizMinute: null, // 'YYYY-MM-DDTHH:MM' — dedup key
  rewardDispatched: false,
};

/** Reset module state — used in tests and when a new day is detected. */
export function _resetDailyState(overrides = {}) {
  _daily = {
    date: null,
    reviewsCompleted: 0,
    lastQuizMinute: null,
    rewardDispatched: false,
    ...overrides,
  };
}

/** Expose internal state for tests. */
export function _getDailyState() {
  return { ..._daily };
}

function _getTodayUTC() {
  return new Date().toISOString().split('T')[0];
}

function _getCurrentMinuteUTC() {
  // Returns 'YYYY-MM-DDTHH:MM' — granularity of 1 minute for dedup
  return new Date().toISOString().slice(0, 16);
}

function _maybeResetForNewDay() {
  const today = _getTodayUTC();
  if (_daily.date !== today) {
    _daily = {
      date: today,
      reviewsCompleted: 0,
      lastQuizMinute: null,
      rewardDispatched: false,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Redux middleware that bridges quiz session completions to daily goals.
 *
 * Only intercepts 'dailyGoals/updateDailyGoal' with goalType 'quizzesPassed'.
 * That action fires exactly once per completed quiz session (score > 0).
 */
export const quizDailyGoalsMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only handle quiz session completion signals
  if (action.type !== 'dailyGoals/updateDailyGoal') return result;
  if (action.payload?.goalType !== QUIZ_GOAL_TYPE) return result;

  // Check for UTC midnight rollover
  _maybeResetForNewDay();

  // De-duplicate: skip if this minute already recorded a quiz completion
  const currentMinute = _getCurrentMinuteUTC();
  if (_daily.lastQuizMinute === currentMinute) return result;

  // Record this completion
  _daily.lastQuizMinute = currentMinute;
  _daily.reviewsCompleted += 1;

  // Dispatch threshold reward once the daily target is met
  if (!_daily.rewardDispatched && _daily.reviewsCompleted >= QUIZ_DAILY_TARGET) {
    _daily.rewardDispatched = true;
    store.dispatch(claimReward());
  }

  return result;
};
