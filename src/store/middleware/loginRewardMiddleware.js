/**
 * loginRewardMiddleware.js
 * GROW-019: Checks on app start (persist/REHYDRATE) whether a daily login reward
 * should be granted.
 *
 * Logic:
 * - Same day → no reward
 * - Consecutive day → increment streak + grant reward
 * - Gap (missed days) → reset streak to 1 + grant day-1 reward
 */

import { processLoginReward, resetLoginStreak } from '../slices/playerSlice.js';
import { getRewardForDay } from '../../data/loginRewards.js';

function getUTCDateString() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function daysBetween(dateA, dateB) {
  // dateA and dateB are 'YYYY-MM-DD' strings
  const a = new Date(dateA + 'T00:00:00Z');
  const b = new Date(dateB + 'T00:00:00Z');
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export const loginRewardMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only check on rehydration (app start with persisted state)
  if (action.type === 'persist/REHYDRATE') {
    const state = store.getState();
    const today = getUTCDateString();
    const lastLogin = state.player?.lastLoginDate ?? null;
    const currentStreak = state.player?.loginStreak ?? 0;

    // Same day — no reward
    if (lastLogin === today) return result;

    if (lastLogin === null) {
      // First ever login
      const reward = getRewardForDay(1);
      store.dispatch(processLoginReward({ todayUTC: today, reward: { ...reward } }));
    } else {
      const gap = daysBetween(lastLogin, today);
      if (gap === 1) {
        // Consecutive day
        const newStreak = currentStreak + 1;
        const reward = getRewardForDay(newStreak);
        store.dispatch(processLoginReward({ todayUTC: today, reward: { ...reward } }));
      } else {
        // Gap — reset streak
        const reward = getRewardForDay(1);
        store.dispatch(resetLoginStreak({ todayUTC: today, reward: { ...reward } }));
      }
    }
  }

  return result;
};
