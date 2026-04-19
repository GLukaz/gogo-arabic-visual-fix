/**
 * Daily Challenge Slice — Tracks daily challenge completion, streaks, and history.
 * Phase 81 (DAILY-01 + DAILY-02): Daily challenge system for player retention.
 *
 * State:
 *   currentStreak      — consecutive days completed
 *   longestStreak      — all-time best streak
 *   lastCompletedDate  — 'YYYY-MM-DD' of last completion
 *   completedToday     — whether today's challenge is done
 *   todaysChallengeType — challenge type key for today
 *   todaysResult       — { score, timeMs, xpEarned, completedAt }
 *   history            — last 30 entries: [{ date, type, score, xpEarned }]
 *   streakRewardsClaimed — array of reward tier days already claimed
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { STREAK_REWARDS } from '../../data/dailyChallenges.js';

const initialState = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  completedToday: false,
  todaysChallengeType: null,
  todaysResult: null,
  history: [],
  streakRewardsClaimed: [],
};

/**
 * Check if two date strings are consecutive days.
 * @param {string} dateA — 'YYYY-MM-DD'
 * @param {string} dateB — 'YYYY-MM-DD'
 * @returns {boolean}
 */
function isConsecutiveDay(dateA, dateB) {
  if (!dateA || !dateB) return false;
  const a = new Date(dateA + 'T00:00:00Z');
  const b = new Date(dateB + 'T00:00:00Z');
  const diffMs = Math.abs(b.getTime() - a.getTime());
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

/**
 * Check if two date strings are the same day.
 */
function isSameDay(dateA, dateB) {
  return dateA === dateB;
}

const dailyChallengeSlice = createSlice({
  name: 'dailyChallenge',
  initialState,
  reducers: {
    /**
     * Complete today's challenge.
     * payload: { date, type, score, timeMs, xpEarned }
     */
    completeChallenge(state, action) {
      const { date, type, score, timeMs, xpEarned } = action.payload;

      // Don't allow completing twice on same day
      if (state.completedToday && state.lastCompletedDate === date) return;

      // Update streak
      if (state.lastCompletedDate && isConsecutiveDay(state.lastCompletedDate, date)) {
        state.currentStreak += 1;
      } else if (!isSameDay(state.lastCompletedDate, date)) {
        // Gap > 1 day or first ever completion — reset streak to 1
        state.currentStreak = 1;
      }

      // Update longest streak
      if (state.currentStreak > state.longestStreak) {
        state.longestStreak = state.currentStreak;
      }

      // Mark today as completed
      state.completedToday = true;
      state.lastCompletedDate = date;
      state.todaysChallengeType = type;
      state.todaysResult = {
        score,
        timeMs,
        xpEarned,
        completedAt: new Date().toISOString(),
      };

      // Add to history (cap at 30)
      state.history.push({ date, type, score, xpEarned });
      if (state.history.length > 30) {
        state.history.shift();
      }
    },

    /**
     * Claim a streak reward tier.
     * payload: { days } — the tier's day count
     */
    claimStreakReward(state, action) {
      const { days } = action.payload;

      // Validate the tier exists and streak is sufficient
      const tier = STREAK_REWARDS.find((r) => r.days === days);
      if (!tier) return;
      if (state.currentStreak < days) return;

      // Don't allow double-claiming
      if (state.streakRewardsClaimed.includes(days)) return;

      state.streakRewardsClaimed.push(days);
    },

    /**
     * Reset daily state for a new day. Called when a new day is detected.
     * payload: { date, challengeType }
     */
    resetDaily(state, action) {
      const { date, challengeType } = action.payload;

      // Check if streak should break (gap > 1 day from last completion)
      if (state.lastCompletedDate) {
        const last = new Date(state.lastCompletedDate + 'T00:00:00Z');
        const today = new Date(date + 'T00:00:00Z');
        const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          // Streak broken — gap of more than 1 day
          state.currentStreak = 0;
        }
      }

      state.completedToday = false;
      state.todaysChallengeType = challengeType;
      state.todaysResult = null;
    },
  },
});

export const { completeChallenge, claimStreakReward, resetDaily } = dailyChallengeSlice.actions;

// ========== SELECTORS ==========

export const selectCurrentStreak = (state) => state.dailyChallenge?.currentStreak ?? 0;
export const selectLongestStreak = (state) => state.dailyChallenge?.longestStreak ?? 0;
export const selectCompletedToday = (state) => state.dailyChallenge?.completedToday ?? false;
export const selectTodaysChallengeType = (state) => state.dailyChallenge?.todaysChallengeType ?? null;
export const selectTodaysResult = (state) => state.dailyChallenge?.todaysResult ?? null;
export const selectLastCompletedDate = (state) => state.dailyChallenge?.lastCompletedDate ?? null;
export const selectChallengeHistory = (state) => state.dailyChallenge?.history ?? [];
export const selectStreakRewardsClaimed = (state) => state.dailyChallenge?.streakRewardsClaimed ?? [];

/**
 * Select unclaimed streak rewards the player has earned.
 */
export const selectUnclaimedStreakRewards = createSelector(
  [selectCurrentStreak, selectStreakRewardsClaimed],
  (streak, claimed) => {
    return STREAK_REWARDS.filter(
      (tier) => streak >= tier.days && !claimed.includes(tier.days)
    );
  }
);

/**
 * Select the next reward tier the player is working toward.
 */
export const selectNextRewardTier = createSelector(
  [selectCurrentStreak],
  (streak) => {
    for (const tier of STREAK_REWARDS) {
      if (streak < tier.days) return tier;
    }
    return null;
  }
);

/**
 * Select streak rewards data for display: all tiers with claimed/earned status.
 */
export const selectStreakRewards = createSelector(
  [selectCurrentStreak, selectStreakRewardsClaimed],
  (streak, claimed) => {
    return STREAK_REWARDS.map((tier) => ({
      ...tier,
      earned: streak >= tier.days,
      claimed: claimed.includes(tier.days),
    }));
  }
);

export default dailyChallengeSlice.reducer;
