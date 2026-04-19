import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  quizDailyGoalsMiddleware,
  _resetDailyState,
  _getDailyState,
} from '../quizDailyGoalsMiddleware.js';
import dailyGoalsReducer, {
  updateDailyGoal,
  claimReward,
} from '../../slices/dailyGoalsSlice.js';
import { DAILY_GOAL_TYPES } from '../../../data/dailyGoals.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeStore() {
  return configureStore({
    reducer: { dailyGoals: dailyGoalsReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(quizDailyGoalsMiddleware),
  });
}

function dispatchQuizComplete(store) {
  store.dispatch(
    updateDailyGoal({ goalType: DAILY_GOAL_TYPES.QUIZZES_PASSED, amount: 1 })
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Setup
// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  _resetDailyState();
  vi.useRealTimers();
});

// ─────────────────────────────────────────────────────────────────────────────
// Basic increment
// ─────────────────────────────────────────────────────────────────────────────

describe('quiz session tracking', () => {
  it('increments reviewsCompleted when a quiz session completes', () => {
    const store = makeStore();
    dispatchQuizComplete(store);
    expect(_getDailyState().reviewsCompleted).toBe(1);
  });

  it('does not increment for unrelated goal types', () => {
    const store = makeStore();
    store.dispatch(
      updateDailyGoal({ goalType: DAILY_GOAL_TYPES.WORDS_LEARNED, amount: 1 })
    );
    expect(_getDailyState().reviewsCompleted).toBe(0);
  });

  it('does not react to unrelated action types', () => {
    const store = makeStore();
    store.dispatch({ type: 'vocabulary/addFsrsCard', payload: {} });
    expect(_getDailyState().reviewsCompleted).toBe(0);
  });

  it('still passes the action through to the reducer', () => {
    const store = makeStore();
    dispatchQuizComplete(store);
    const quizzesPassed =
      store.getState().dailyGoals.goals[DAILY_GOAL_TYPES.QUIZZES_PASSED].current;
    expect(quizzesPassed).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Deduplication — same minute
// ─────────────────────────────────────────────────────────────────────────────

describe('same-minute deduplication', () => {
  it('does not count two quiz completions in the same minute', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T10:30:00.000Z'));

    const store = makeStore();
    dispatchQuizComplete(store);
    dispatchQuizComplete(store); // same minute

    expect(_getDailyState().reviewsCompleted).toBe(1);
    vi.useRealTimers();
  });

  it('counts quizzes in different minutes separately', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T10:30:00.000Z'));

    const store = makeStore();
    dispatchQuizComplete(store);

    vi.setSystemTime(new Date('2026-04-08T10:31:00.000Z'));
    dispatchQuizComplete(store);

    expect(_getDailyState().reviewsCompleted).toBe(2);
    vi.useRealTimers();
  });

  it('counts a third quiz in yet another minute', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T10:30:00.000Z'));

    const store = makeStore();
    dispatchQuizComplete(store);
    vi.setSystemTime(new Date('2026-04-08T10:31:00.000Z'));
    dispatchQuizComplete(store);
    vi.setSystemTime(new Date('2026-04-08T10:32:00.000Z'));
    dispatchQuizComplete(store);

    expect(_getDailyState().reviewsCompleted).toBe(3);
    vi.useRealTimers();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Threshold reward
// ─────────────────────────────────────────────────────────────────────────────

describe('threshold reward (claimReward)', () => {
  it('dispatches claimReward when daily target is met', () => {
    vi.useFakeTimers();

    const store = makeStore();

    // Complete 3 quizzes in 3 different minutes (target = 3)
    vi.setSystemTime(new Date('2026-04-08T10:30:00.000Z'));
    dispatchQuizComplete(store);
    vi.setSystemTime(new Date('2026-04-08T10:31:00.000Z'));
    dispatchQuizComplete(store);
    vi.setSystemTime(new Date('2026-04-08T10:32:00.000Z'));
    dispatchQuizComplete(store);

    expect(store.getState().dailyGoals.quizRewardClaimed).toBe(true);
    vi.useRealTimers();
  });

  it('does not dispatch claimReward before target is met', () => {
    vi.useFakeTimers();

    const store = makeStore();

    vi.setSystemTime(new Date('2026-04-08T10:30:00.000Z'));
    dispatchQuizComplete(store);
    vi.setSystemTime(new Date('2026-04-08T10:31:00.000Z'));
    dispatchQuizComplete(store);
    // Only 2 quizzes — target is 3

    expect(store.getState().dailyGoals.quizRewardClaimed).toBe(false);
    vi.useRealTimers();
  });

  it('dispatches claimReward only once even if more quizzes completed after target', () => {
    vi.useFakeTimers();

    const store = makeStore();

    for (let i = 0; i < 5; i++) {
      vi.setSystemTime(new Date(`2026-04-08T10:3${i}:00.000Z`));
      dispatchQuizComplete(store);
    }

    // rewardDispatched should be true and quizRewardClaimed should be true (not toggled back)
    expect(_getDailyState().rewardDispatched).toBe(true);
    expect(store.getState().dailyGoals.quizRewardClaimed).toBe(true);
    vi.useRealTimers();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Day reset
// ─────────────────────────────────────────────────────────────────────────────

describe('daily reset', () => {
  it('resets reviewsCompleted on a new UTC day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T23:59:00.000Z'));

    const store = makeStore();
    dispatchQuizComplete(store);
    expect(_getDailyState().reviewsCompleted).toBe(1);

    // Advance past midnight
    vi.setSystemTime(new Date('2026-04-09T00:01:00.000Z'));
    dispatchQuizComplete(store);

    expect(_getDailyState().reviewsCompleted).toBe(1); // fresh count for new day
    vi.useRealTimers();
  });

  it('resets rewardDispatched on a new day', () => {
    vi.useFakeTimers();

    const store = makeStore();

    // Complete target on day 1
    for (let i = 0; i < 3; i++) {
      vi.setSystemTime(new Date(`2026-04-08T10:3${i}:00.000Z`));
      dispatchQuizComplete(store);
    }
    expect(_getDailyState().rewardDispatched).toBe(true);

    // New day — first quiz should not trigger reward yet
    vi.setSystemTime(new Date('2026-04-09T08:00:00.000Z'));
    dispatchQuizComplete(store);
    expect(_getDailyState().rewardDispatched).toBe(false);
    expect(_getDailyState().reviewsCompleted).toBe(1);
    vi.useRealTimers();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// _resetDailyState helper
// ─────────────────────────────────────────────────────────────────────────────

describe('_resetDailyState', () => {
  it('resets all fields to defaults', () => {
    _resetDailyState();
    const state = _getDailyState();
    expect(state.date).toBeNull();
    expect(state.reviewsCompleted).toBe(0);
    expect(state.lastQuizMinute).toBeNull();
    expect(state.rewardDispatched).toBe(false);
  });

  it('accepts overrides', () => {
    _resetDailyState({ date: '2026-04-08', reviewsCompleted: 2 });
    const state = _getDailyState();
    expect(state.date).toBe('2026-04-08');
    expect(state.reviewsCompleted).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// dailyGoalsSlice claimReward action
// ─────────────────────────────────────────────────────────────────────────────

describe('claimReward reducer', () => {
  it('sets quizRewardClaimed to true', () => {
    const store = makeStore();
    expect(store.getState().dailyGoals.quizRewardClaimed).toBe(false);
    store.dispatch(claimReward());
    expect(store.getState().dailyGoals.quizRewardClaimed).toBe(true);
  });
});
