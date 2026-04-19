/**
 * questTimerMiddleware.test.js
 *
 * Tests for FEAT-039 — Quest branching and failure states.
 * Covers: makeQuestChoice, failQuest, retryQuest, startQuestTimer,
 *         selectActiveTimedQuests, checkExpiredTimers, middleware clock.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import questReducer, {
  makeQuestChoice,
  failQuest,
  retryQuest,
  startQuestTimer,
  selectActiveTimedQuests,
  selectAllQuests,
} from '../../slices/questSlice.js';
import {
  questTimerMiddleware,
  clearQuestTimerClock,
  checkExpiredTimers,
} from '../questTimerMiddleware.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeStore(preloadedQuests = {}) {
  return configureStore({
    reducer: { quests: questReducer },
    middleware: (gDM) => gDM().concat(questTimerMiddleware),
    preloadedState: {
      quests: {
        ...questReducer(undefined, { type: '@@INIT' }),
        quests: preloadedQuests,
      },
    },
  });
}

function activeQuest(overrides = {}) {
  return { status: 'active', progress: 0, rewardClaimed: false, ...overrides };
}

afterEach(() => {
  clearQuestTimerClock();
  vi.useRealTimers();
});

// ─────────────────────────────────────────────────────────────────────────────
// makeQuestChoice
// ─────────────────────────────────────────────────────────────────────────────

describe('makeQuestChoice', () => {
  it('records the chosen branch on an active quest', () => {
    const store = makeStore({ q1: activeQuest({ progress: 3 }) });
    store.dispatch(makeQuestChoice({ questId: 'q1', choiceId: 'path_a' }));
    const quest = selectAllQuests(store.getState())['q1'];
    expect(quest.currentBranch).toBe('path_a');
  });

  it('saves a checkpoint equal to the current progress before branching', () => {
    const store = makeStore({ q1: activeQuest({ progress: 5 }) });
    store.dispatch(makeQuestChoice({ questId: 'q1', choiceId: 'path_b' }));
    const quest = selectAllQuests(store.getState())['q1'];
    expect(quest.checkpoint).toBe(5);
  });

  it('defaults checkpoint to 0 when progress is not set', () => {
    const store = makeStore({ q1: activeQuest() });
    store.dispatch(makeQuestChoice({ questId: 'q1', choiceId: 'path_a' }));
    const quest = selectAllQuests(store.getState())['q1'];
    expect(quest.checkpoint).toBe(0);
  });

  it('does not record choice on a non-active quest', () => {
    const store = makeStore({ q1: { status: 'locked', progress: 0, rewardClaimed: false } });
    store.dispatch(makeQuestChoice({ questId: 'q1', choiceId: 'path_a' }));
    const quest = selectAllQuests(store.getState())['q1'];
    expect(quest.currentBranch).toBeUndefined();
  });

  it('does not error on an unknown questId', () => {
    const store = makeStore({});
    expect(() => store.dispatch(makeQuestChoice({ questId: 'missing', choiceId: 'path_a' }))).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// failQuest
// ─────────────────────────────────────────────────────────────────────────────

describe('failQuest', () => {
  it('sets status to failed', () => {
    const store = makeStore({ q1: activeQuest() });
    store.dispatch(failQuest({ questId: 'q1', reason: 'timeout' }));
    expect(selectAllQuests(store.getState())['q1'].status).toBe('failed');
  });

  it('records the failure reason', () => {
    const store = makeStore({ q1: activeQuest() });
    store.dispatch(failQuest({ questId: 'q1', reason: 'timeout' }));
    expect(selectAllQuests(store.getState())['q1'].failReason).toBe('timeout');
  });

  it('sets retryable to true', () => {
    const store = makeStore({ q1: activeQuest() });
    store.dispatch(failQuest({ questId: 'q1', reason: 'player_died' }));
    expect(selectAllQuests(store.getState())['q1'].retryable).toBe(true);
  });

  it('uses "unknown" as default reason when reason is omitted', () => {
    const store = makeStore({ q1: activeQuest() });
    store.dispatch(failQuest({ questId: 'q1' }));
    expect(selectAllQuests(store.getState())['q1'].failReason).toBe('unknown');
  });

  it('does not fail an already-completed quest', () => {
    const store = makeStore({ q1: { status: 'completed', progress: 5, rewardClaimed: false } });
    store.dispatch(failQuest({ questId: 'q1', reason: 'timeout' }));
    expect(selectAllQuests(store.getState())['q1'].status).toBe('completed');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// retryQuest
// ─────────────────────────────────────────────────────────────────────────────

describe('retryQuest', () => {
  it('resets a failed quest back to active', () => {
    const store = makeStore({ q1: { status: 'failed', progress: 3, rewardClaimed: false, retryable: true } });
    store.dispatch(retryQuest('q1'));
    expect(selectAllQuests(store.getState())['q1'].status).toBe('active');
  });

  it('resets progress to checkpoint', () => {
    const store = makeStore({ q1: { status: 'failed', progress: 7, rewardClaimed: false, retryable: true, checkpoint: 2 } });
    store.dispatch(retryQuest('q1'));
    expect(selectAllQuests(store.getState())['q1'].progress).toBe(2);
  });

  it('resets progress to 0 when there is no checkpoint', () => {
    const store = makeStore({ q1: { status: 'failed', progress: 4, rewardClaimed: false, retryable: true } });
    store.dispatch(retryQuest('q1'));
    expect(selectAllQuests(store.getState())['q1'].progress).toBe(0);
  });

  it('clears failReason on retry', () => {
    const store = makeStore({ q1: { status: 'failed', progress: 0, rewardClaimed: false, retryable: true, failReason: 'timeout' } });
    store.dispatch(retryQuest('q1'));
    expect(selectAllQuests(store.getState())['q1'].failReason).toBeNull();
  });

  it('clears timerStartedAt on retry so timer can be restarted', () => {
    const store = makeStore({ q1: { status: 'failed', progress: 0, rewardClaimed: false, retryable: true, timerStartedAt: 12345 } });
    store.dispatch(retryQuest('q1'));
    expect(selectAllQuests(store.getState())['q1'].timerStartedAt).toBeNull();
  });

  it('does not retry an active quest', () => {
    const store = makeStore({ q1: activeQuest({ progress: 3 }) });
    store.dispatch(retryQuest('q1'));
    expect(selectAllQuests(store.getState())['q1'].status).toBe('active');
    expect(selectAllQuests(store.getState())['q1'].progress).toBe(3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// startQuestTimer
// ─────────────────────────────────────────────────────────────────────────────

describe('startQuestTimer', () => {
  it('sets timeLimitMinutes on the quest entry', () => {
    const store = makeStore({ q1: activeQuest() });
    store.dispatch(startQuestTimer({ questId: 'q1', timeLimitMinutes: 10 }));
    expect(selectAllQuests(store.getState())['q1'].timeLimitMinutes).toBe(10);
  });

  it('sets timerStartedAt close to Date.now()', () => {
    const before = Date.now();
    const store = makeStore({ q1: activeQuest() });
    store.dispatch(startQuestTimer({ questId: 'q1', timeLimitMinutes: 5 }));
    const after = Date.now();
    const ts = selectAllQuests(store.getState())['q1'].timerStartedAt;
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('does not set timer on a locked quest', () => {
    const store = makeStore({ q1: { status: 'locked', progress: 0, rewardClaimed: false } });
    store.dispatch(startQuestTimer({ questId: 'q1', timeLimitMinutes: 5 }));
    expect(selectAllQuests(store.getState())['q1'].timerStartedAt).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectActiveTimedQuests
// ─────────────────────────────────────────────────────────────────────────────

describe('selectActiveTimedQuests', () => {
  it('returns only active quests that have timerStartedAt set', () => {
    const store = makeStore({
      q1: activeQuest({ timerStartedAt: 1000, timeLimitMinutes: 5 }),
      q2: activeQuest(), // no timer
      q3: { status: 'failed', progress: 0, rewardClaimed: false, retryable: true, timerStartedAt: 2000 },
    });
    const timed = selectActiveTimedQuests(store.getState());
    expect(Object.keys(timed)).toEqual(['q1']);
  });

  it('returns empty object when no timed quests are active', () => {
    const store = makeStore({ q1: activeQuest() });
    expect(selectActiveTimedQuests(store.getState())).toEqual({});
  });

  it('returns multiple timed quests when several are active', () => {
    const store = makeStore({
      q1: activeQuest({ timerStartedAt: 1000, timeLimitMinutes: 5 }),
      q2: activeQuest({ timerStartedAt: 2000, timeLimitMinutes: 10 }),
    });
    const timed = selectActiveTimedQuests(store.getState());
    expect(Object.keys(timed).sort()).toEqual(['q1', 'q2']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkExpiredTimers
// ─────────────────────────────────────────────────────────────────────────────

describe('checkExpiredTimers', () => {
  it('dispatches failQuest for a quest whose time has elapsed', () => {
    vi.useFakeTimers();
    const now = Date.now();
    // Quest started 11 minutes ago with a 10-minute limit
    const startedAt = now - 11 * 60_000;
    const store = makeStore({ q1: activeQuest({ timerStartedAt: startedAt, timeLimitMinutes: 10 }) });
    checkExpiredTimers(store);
    expect(selectAllQuests(store.getState())['q1'].status).toBe('failed');
    expect(selectAllQuests(store.getState())['q1'].failReason).toBe('timeout');
  });

  it('does not fail a quest that still has time remaining', () => {
    vi.useFakeTimers();
    const now = Date.now();
    const startedAt = now - 3 * 60_000; // 3 min elapsed, 10 min limit
    const store = makeStore({ q1: activeQuest({ timerStartedAt: startedAt, timeLimitMinutes: 10 }) });
    checkExpiredTimers(store);
    expect(selectAllQuests(store.getState())['q1'].status).toBe('active');
  });

  it('does not re-fail an already-failed quest', () => {
    vi.useFakeTimers();
    // Quest is already failed (no timerStartedAt — cleared by retryQuest or never set)
    const store = makeStore({ q1: { status: 'failed', progress: 0, rewardClaimed: false, retryable: true } });
    checkExpiredTimers(store);
    expect(selectAllQuests(store.getState())['q1'].status).toBe('failed');
  });

  it('handles multiple timed quests independently', () => {
    vi.useFakeTimers();
    const now = Date.now();
    const store = makeStore({
      q1: activeQuest({ timerStartedAt: now - 20 * 60_000, timeLimitMinutes: 10 }), // expired
      q2: activeQuest({ timerStartedAt: now - 2 * 60_000, timeLimitMinutes: 10 }),  // still running
    });
    checkExpiredTimers(store);
    expect(selectAllQuests(store.getState())['q1'].status).toBe('failed');
    expect(selectAllQuests(store.getState())['q2'].status).toBe('active');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware — interval clock
// ─────────────────────────────────────────────────────────────────────────────

describe('questTimerMiddleware — interval clock', () => {
  it('starts interval on persist/REHYDRATE and fails expired quests when interval fires', () => {
    vi.useFakeTimers();
    // Minimal store without getDefaultMiddleware to avoid RTK timer interference.
    // Redux 5.x uses @@redux/INIT<random> — trigger via explicit persist/REHYDRATE instead.
    const store = configureStore({
      reducer: { quests: questReducer },
      middleware: () => [questTimerMiddleware],
      preloadedState: {
        quests: {
          ...questReducer(undefined, { type: '@@INIT' }),
          quests: { q1: activeQuest({ timerStartedAt: 1, timeLimitMinutes: 1 }) },
        },
      },
    });
    // Explicitly start the clock via persist/REHYDRATE
    store.dispatch({ type: 'persist/REHYDRATE', payload: null });
    // Advance past the 1-minute limit (timerStartedAt=1 makes elapsed ≈ 60_000ms)
    vi.advanceTimersByTime(60_001);
    expect(selectAllQuests(store.getState())['q1'].status).toBe('failed');
  });
});
