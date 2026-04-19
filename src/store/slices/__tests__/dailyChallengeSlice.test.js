import { describe, it, expect } from 'vitest';
import dailyChallengeReducer, {
  completeChallenge,
  claimStreakReward,
  resetDaily,
  selectCurrentStreak,
  selectLongestStreak,
  selectCompletedToday,
  selectTodaysChallengeType,
  selectTodaysResult,
  selectChallengeHistory,
  selectStreakRewardsClaimed,
  selectUnclaimedStreakRewards,
  selectNextRewardTier,
  selectStreakRewards,
} from '../dailyChallengeSlice.js';

function getInitialState() {
  return JSON.parse(JSON.stringify(dailyChallengeReducer(undefined, { type: '@@INIT' })));
}

/** Helper to build a root state shape for selectors */
function rootState(sliceState) {
  return { dailyChallenge: sliceState };
}

// ============================================================
// INITIAL STATE
// ============================================================

describe('dailyChallengeSlice — initial state', () => {
  it('has correct initial values', () => {
    const state = getInitialState();
    expect(state.currentStreak).toBe(0);
    expect(state.longestStreak).toBe(0);
    expect(state.lastCompletedDate).toBeNull();
    expect(state.completedToday).toBe(false);
    expect(state.todaysChallengeType).toBeNull();
    expect(state.todaysResult).toBeNull();
    expect(state.history).toEqual([]);
    expect(state.streakRewardsClaimed).toEqual([]);
  });
});

// ============================================================
// completeChallenge
// ============================================================

describe('dailyChallengeSlice — completeChallenge', () => {
  it('marks today as completed', () => {
    const state = getInitialState();
    const next = dailyChallengeReducer(
      state,
      completeChallenge({
        date: '2026-03-27',
        type: 'speed_quiz',
        score: 0.8,
        timeMs: 45000,
        xpEarned: 75,
      })
    );

    expect(next.completedToday).toBe(true);
    expect(next.lastCompletedDate).toBe('2026-03-27');
    expect(next.todaysChallengeType).toBe('speed_quiz');
    expect(next.todaysResult.score).toBe(0.8);
    expect(next.todaysResult.timeMs).toBe(45000);
    expect(next.todaysResult.xpEarned).toBe(75);
  });

  it('sets streak to 1 on first ever completion', () => {
    const state = getInitialState();
    const next = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-27', type: 'speed_quiz', score: 1, timeMs: 30000, xpEarned: 60 })
    );
    expect(next.currentStreak).toBe(1);
    expect(next.longestStreak).toBe(1);
  });

  it('increments streak on consecutive day', () => {
    let state = getInitialState();
    state = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-25', type: 'speed_quiz', score: 1, timeMs: 30000, xpEarned: 60 })
    );
    expect(state.currentStreak).toBe(1);

    // Reset for new day
    state = dailyChallengeReducer(state, resetDaily({ date: '2026-03-26', challengeType: 'grammar_challenge' }));

    state = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-26', type: 'grammar_challenge', score: 0.8, timeMs: 50000, xpEarned: 75 })
    );
    expect(state.currentStreak).toBe(2);
    expect(state.longestStreak).toBe(2);
  });

  it('resets streak on non-consecutive day (gap > 1)', () => {
    let state = getInitialState();
    state = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-20', type: 'speed_quiz', score: 1, timeMs: 30000, xpEarned: 60 })
    );
    expect(state.currentStreak).toBe(1);

    // Skip a day — complete on 2026-03-22 (gap of 1 day)
    state = dailyChallengeReducer(state, resetDaily({ date: '2026-03-22', challengeType: 'word_of_the_day' }));

    state = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-22', type: 'word_of_the_day', score: 0.7, timeMs: 40000, xpEarned: 50 })
    );
    expect(state.currentStreak).toBe(1); // Reset, not 2
  });

  it('does not allow completing twice on the same day', () => {
    let state = getInitialState();
    state = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-27', type: 'speed_quiz', score: 0.8, timeMs: 45000, xpEarned: 60 })
    );

    // Try completing again
    const next = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-27', type: 'speed_quiz', score: 1.0, timeMs: 20000, xpEarned: 100 })
    );

    // Should not change — still first completion
    expect(next.todaysResult.score).toBe(0.8);
    expect(next.todaysResult.xpEarned).toBe(60);
  });

  it('adds entry to history', () => {
    const state = getInitialState();
    const next = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-27', type: 'speed_quiz', score: 0.9, timeMs: 40000, xpEarned: 70 })
    );

    expect(next.history).toHaveLength(1);
    expect(next.history[0]).toEqual({
      date: '2026-03-27',
      type: 'speed_quiz',
      score: 0.9,
      xpEarned: 70,
    });
  });

  it('caps history at 30 entries', () => {
    let state = getInitialState();

    // Add 32 entries
    for (let i = 1; i <= 32; i++) {
      const date = `2026-01-${String(i).padStart(2, '0')}`;
      // Reset completedToday for each new day
      state = { ...state, completedToday: false };
      state = dailyChallengeReducer(
        state,
        completeChallenge({ date, type: 'speed_quiz', score: 0.5, timeMs: 30000, xpEarned: 30 })
      );
    }

    expect(state.history).toHaveLength(30);
    // Oldest entry should have been shifted off
    expect(state.history[0].date).toBe('2026-01-03');
    expect(state.history[29].date).toBe('2026-01-32');
  });

  it('updates longestStreak correctly', () => {
    let state = getInitialState();

    // Build a 5-day streak
    for (let i = 1; i <= 5; i++) {
      const date = `2026-03-${String(i).padStart(2, '0')}`;
      state = { ...state, completedToday: false };
      state = dailyChallengeReducer(
        state,
        completeChallenge({ date, type: 'speed_quiz', score: 1, timeMs: 30000, xpEarned: 60 })
      );
    }
    expect(state.currentStreak).toBe(5);
    expect(state.longestStreak).toBe(5);

    // Break the streak (skip 2 days)
    state = dailyChallengeReducer(state, resetDaily({ date: '2026-03-08', challengeType: 'speed_quiz' }));
    state = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-08', type: 'speed_quiz', score: 1, timeMs: 30000, xpEarned: 60 })
    );
    expect(state.currentStreak).toBe(1); // Reset
    expect(state.longestStreak).toBe(5); // Still 5
  });
});

// ============================================================
// claimStreakReward
// ============================================================

describe('dailyChallengeSlice — claimStreakReward', () => {
  it('adds tier days to claimed list', () => {
    let state = getInitialState();
    state.currentStreak = 7;

    state = dailyChallengeReducer(state, claimStreakReward({ days: 3 }));
    expect(state.streakRewardsClaimed).toContain(3);

    state = dailyChallengeReducer(state, claimStreakReward({ days: 7 }));
    expect(state.streakRewardsClaimed).toContain(7);
    expect(state.streakRewardsClaimed).toHaveLength(2);
  });

  it('does not allow double-claiming', () => {
    let state = getInitialState();
    state.currentStreak = 7;

    state = dailyChallengeReducer(state, claimStreakReward({ days: 3 }));
    state = dailyChallengeReducer(state, claimStreakReward({ days: 3 }));
    expect(state.streakRewardsClaimed.filter((d) => d === 3)).toHaveLength(1);
  });

  it('does not claim tier if streak is insufficient', () => {
    let state = getInitialState();
    state.currentStreak = 5;

    state = dailyChallengeReducer(state, claimStreakReward({ days: 7 }));
    expect(state.streakRewardsClaimed).not.toContain(7);
  });

  it('rejects invalid tier', () => {
    let state = getInitialState();
    state.currentStreak = 100;

    state = dailyChallengeReducer(state, claimStreakReward({ days: 999 }));
    expect(state.streakRewardsClaimed).toHaveLength(0);
  });
});

// ============================================================
// resetDaily
// ============================================================

describe('dailyChallengeSlice — resetDaily', () => {
  it('resets completedToday and todaysResult', () => {
    let state = getInitialState();
    state = dailyChallengeReducer(
      state,
      completeChallenge({ date: '2026-03-27', type: 'speed_quiz', score: 1, timeMs: 30000, xpEarned: 60 })
    );
    expect(state.completedToday).toBe(true);

    state = dailyChallengeReducer(state, resetDaily({ date: '2026-03-28', challengeType: 'grammar_challenge' }));
    expect(state.completedToday).toBe(false);
    expect(state.todaysResult).toBeNull();
    expect(state.todaysChallengeType).toBe('grammar_challenge');
  });

  it('breaks streak if gap > 1 day', () => {
    let state = getInitialState();
    state.lastCompletedDate = '2026-03-25';
    state.currentStreak = 5;

    state = dailyChallengeReducer(state, resetDaily({ date: '2026-03-28', challengeType: 'speed_quiz' }));
    expect(state.currentStreak).toBe(0); // Gap of 2 days
  });

  it('preserves streak if gap is exactly 1 day', () => {
    let state = getInitialState();
    state.lastCompletedDate = '2026-03-27';
    state.currentStreak = 5;

    state = dailyChallengeReducer(state, resetDaily({ date: '2026-03-28', challengeType: 'speed_quiz' }));
    expect(state.currentStreak).toBe(5); // Gap of 1 day — ok
  });

  it('preserves streak if same day', () => {
    let state = getInitialState();
    state.lastCompletedDate = '2026-03-27';
    state.currentStreak = 3;

    state = dailyChallengeReducer(state, resetDaily({ date: '2026-03-27', challengeType: 'speed_quiz' }));
    expect(state.currentStreak).toBe(3);
  });
});

// ============================================================
// SELECTORS
// ============================================================

describe('dailyChallengeSlice — selectors', () => {
  it('selectCurrentStreak returns streak count', () => {
    const state = { ...getInitialState(), currentStreak: 7 };
    expect(selectCurrentStreak(rootState(state))).toBe(7);
  });

  it('selectLongestStreak returns longest streak', () => {
    const state = { ...getInitialState(), longestStreak: 14 };
    expect(selectLongestStreak(rootState(state))).toBe(14);
  });

  it('selectCompletedToday returns completion status', () => {
    expect(selectCompletedToday(rootState(getInitialState()))).toBe(false);
    expect(selectCompletedToday(rootState({ ...getInitialState(), completedToday: true }))).toBe(true);
  });

  it('selectTodaysChallengeType returns type', () => {
    const state = { ...getInitialState(), todaysChallengeType: 'speed_quiz' };
    expect(selectTodaysChallengeType(rootState(state))).toBe('speed_quiz');
  });

  it('selectTodaysResult returns result object', () => {
    const result = { score: 0.9, timeMs: 40000, xpEarned: 70, completedAt: '2026-03-27T10:00:00Z' };
    const state = { ...getInitialState(), todaysResult: result };
    expect(selectTodaysResult(rootState(state))).toEqual(result);
  });

  it('selectChallengeHistory returns history array', () => {
    const history = [{ date: '2026-03-27', type: 'speed_quiz', score: 0.9, xpEarned: 70 }];
    const state = { ...getInitialState(), history };
    expect(selectChallengeHistory(rootState(state))).toEqual(history);
  });

  it('selectStreakRewardsClaimed returns claimed array', () => {
    const state = { ...getInitialState(), streakRewardsClaimed: [3, 7] };
    expect(selectStreakRewardsClaimed(rootState(state))).toEqual([3, 7]);
  });

  it('selectors handle missing dailyChallenge slice gracefully', () => {
    expect(selectCurrentStreak({})).toBe(0);
    expect(selectCompletedToday({})).toBe(false);
    expect(selectTodaysChallengeType({})).toBeNull();
    expect(selectChallengeHistory({})).toEqual([]);
  });
});

// ============================================================
// COMPUTED SELECTORS
// ============================================================

describe('dailyChallengeSlice — computed selectors', () => {
  it('selectUnclaimedStreakRewards returns earned but unclaimed rewards', () => {
    const state = { ...getInitialState(), currentStreak: 10, streakRewardsClaimed: [3] };
    const unclaimed = selectUnclaimedStreakRewards(rootState(state));
    expect(unclaimed).toHaveLength(1);
    expect(unclaimed[0].days).toBe(7);
  });

  it('selectUnclaimedStreakRewards returns empty when all claimed', () => {
    const state = { ...getInitialState(), currentStreak: 10, streakRewardsClaimed: [3, 7] };
    const unclaimed = selectUnclaimedStreakRewards(rootState(state));
    expect(unclaimed).toHaveLength(0);
  });

  it('selectNextRewardTier returns next tier above current streak', () => {
    const state = { ...getInitialState(), currentStreak: 5 };
    const next = selectNextRewardTier(rootState(state));
    expect(next.days).toBe(7);
  });

  it('selectNextRewardTier returns null when all tiers reached', () => {
    const state = { ...getInitialState(), currentStreak: 60 };
    expect(selectNextRewardTier(rootState(state))).toBeNull();
  });

  it('selectStreakRewards returns all tiers with earned/claimed status', () => {
    const state = { ...getInitialState(), currentStreak: 10, streakRewardsClaimed: [3] };
    const rewards = selectStreakRewards(rootState(state));
    expect(rewards).toHaveLength(5);

    // 3-day tier: earned + claimed
    expect(rewards[0].earned).toBe(true);
    expect(rewards[0].claimed).toBe(true);

    // 7-day tier: earned + not claimed
    expect(rewards[1].earned).toBe(true);
    expect(rewards[1].claimed).toBe(false);

    // 14-day tier: not earned
    expect(rewards[2].earned).toBe(false);
    expect(rewards[2].claimed).toBe(false);
  });
});
