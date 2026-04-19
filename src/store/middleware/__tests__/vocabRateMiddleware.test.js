import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getNewWordRate,
  selectRemainingNewWords,
  vocabRateMiddleware,
  _resetDailyState,
} from '../vocabRateMiddleware.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeStore(stateOverrides = {}) {
  const state = {
    difficulty: {
      recentResults: [],
      maxNewWordsToday: 5,
      newWordsToday: 0,
      ...stateOverrides,
    },
  };
  return {
    getState: () => state,
    dispatch: vi.fn(),
  };
}

function makeMiddleware(storeOverrides = {}) {
  const store = makeStore(storeOverrides);
  const next = vi.fn((action) => action);
  const mw = vocabRateMiddleware(store)(next);
  return { store, next, mw };
}

function makeResults(total, correctCount) {
  return Array.from({ length: total }, (_, i) => ({
    correct: i < correctCount,
    timeMs: 500,
    type: 'vocab',
    timestamp: Date.now() - i * 1000,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// getNewWordRate — threshold logic
// ─────────────────────────────────────────────────────────────────────────────

describe('getNewWordRate', () => {
  it('returns 0 for mastery below 60% (0–1 scale)', () => {
    expect(getNewWordRate(0)).toBe(0);
    expect(getNewWordRate(0.5)).toBe(0);
    expect(getNewWordRate(0.59)).toBe(0);
  });

  it('returns 5 for mastery 60–70% (0–1 scale)', () => {
    expect(getNewWordRate(0.60)).toBe(5);
    expect(getNewWordRate(0.65)).toBe(5);
    expect(getNewWordRate(0.699)).toBe(5);
  });

  it('returns 15 for mastery 70–85% (0–1 scale)', () => {
    expect(getNewWordRate(0.70)).toBe(15);
    expect(getNewWordRate(0.77)).toBe(15);
    expect(getNewWordRate(0.849)).toBe(15);
  });

  it('returns 30 for mastery above 85% (0–1 scale)', () => {
    expect(getNewWordRate(0.851)).toBe(30);
    expect(getNewWordRate(0.90)).toBe(30);
    expect(getNewWordRate(1.0)).toBe(30);
  });

  it('accepts 0–100 scale as well', () => {
    expect(getNewWordRate(50)).toBe(0);
    expect(getNewWordRate(65)).toBe(5);
    expect(getNewWordRate(75)).toBe(15);
    expect(getNewWordRate(90)).toBe(30);
  });

  it('returns 0 for invalid inputs', () => {
    expect(getNewWordRate(NaN)).toBe(0);
    expect(getNewWordRate(undefined)).toBe(0);
    expect(getNewWordRate(null)).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectRemainingNewWords — reads from difficultySlice
// ─────────────────────────────────────────────────────────────────────────────

describe('selectRemainingNewWords', () => {
  it('returns remaining words from difficultySlice', () => {
    const state = { difficulty: { maxNewWordsToday: 15, newWordsToday: 5 } };
    expect(selectRemainingNewWords(state)).toBe(10);
  });

  it('returns 0 when limit reached', () => {
    const state = { difficulty: { maxNewWordsToday: 5, newWordsToday: 5 } };
    expect(selectRemainingNewWords(state)).toBe(0);
  });

  it('never returns negative', () => {
    const state = { difficulty: { maxNewWordsToday: 5, newWordsToday: 99 } };
    expect(selectRemainingNewWords(state)).toBe(0);
  });

  it('falls back to module state when difficultySlice absent', () => {
    _resetDailyState({ count: 2, limit: 5 });
    const result = selectRemainingNewWords({});
    expect(result).toBe(3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware — pass-through behaviour
// ─────────────────────────────────────────────────────────────────────────────

describe('vocabRateMiddleware — pass-through', () => {
  beforeEach(() => _resetDailyState());

  it('passes non-vocabulary actions through unchanged', () => {
    const { mw, next, store } = makeMiddleware();
    const action = { type: 'player/addXP', payload: 100 };
    mw(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('passes review-sourced addFsrsCard through without counting', () => {
    const { mw, store } = makeMiddleware();
    const action = { type: 'vocabulary/addFsrsCard', payload: { wordId: 'w1', source: 'review' } };
    mw(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('passes import-sourced addFsrsCard through without counting', () => {
    const { mw, store } = makeMiddleware();
    mw({ type: 'vocabulary/addFsrsCard', payload: { wordId: 'w1', source: 'import' } });
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware — introduction counting
// ─────────────────────────────────────────────────────────────────────────────

describe('vocabRateMiddleware — introduction counting', () => {
  beforeEach(() => _resetDailyState());

  it('counts new introductions (no source) toward daily limit', () => {
    // High mastery → limit 30
    const { mw, store } = makeMiddleware({ recentResults: makeResults(20, 18) });
    for (let i = 0; i < 3; i++) {
      mw({ type: 'vocabulary/addFsrsCard', payload: { wordId: `w${i}` } });
    }
    // No limit reached yet
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'vocabRate/limitReached' })
    );
  });

  it('counts "introduction" source toward daily limit', () => {
    const { mw, store } = makeMiddleware({ recentResults: makeResults(20, 18) });
    mw({ type: 'vocabulary/addFsrsCard', payload: { wordId: 'w1', source: 'introduction' } });
    // Still under limit (30 for high mastery)
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware — limit enforcement
// ─────────────────────────────────────────────────────────────────────────────

describe('vocabRateMiddleware — limit enforcement', () => {
  beforeEach(() => _resetDailyState());

  it('dispatches vocabRate/limitReached when zero-rate mastery hits any introduction', () => {
    // Low mastery → limit 0
    const { mw, store } = makeMiddleware({ recentResults: makeResults(20, 5) });
    mw({ type: 'vocabulary/addFsrsCard', payload: { wordId: 'w1' } });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'vocabRate/limitReached' })
    );
  });

  it('dispatches vocabRate/limitReached exactly once when limit is reached', () => {
    // Mastery 60-70% → limit 5
    const { mw, store } = makeMiddleware({ recentResults: makeResults(20, 13) });
    for (let i = 0; i < 7; i++) {
      mw({ type: 'vocabulary/addFsrsCard', payload: { wordId: `w${i}` } });
    }
    const limitCalls = store.dispatch.mock.calls.filter(
      ([a]) => a.type === 'vocabRate/limitReached'
    );
    expect(limitCalls.length).toBe(1);
  });

  it('limitReached payload contains limit, count, and mastery', () => {
    const { mw, store } = makeMiddleware({ recentResults: makeResults(20, 5) });
    mw({ type: 'vocabulary/addFsrsCard', payload: { wordId: 'w1' } });
    const call = store.dispatch.mock.calls.find(([a]) => a.type === 'vocabRate/limitReached');
    expect(call).toBeDefined();
    const { payload } = call[0];
    expect(typeof payload.limit).toBe('number');
    expect(typeof payload.count).toBe('number');
    expect(typeof payload.mastery).toBe('number');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware — UTC midnight reset
// ─────────────────────────────────────────────────────────────────────────────

describe('vocabRateMiddleware — UTC midnight reset', () => {
  it('resets count when date changes', () => {
    // Simulate "yesterday" by pre-setting a stale date
    _resetDailyState({ date: '2020-01-01', count: 5, limit: 5 });

    const { mw, store } = makeMiddleware({ recentResults: makeResults(20, 18) });
    // Today is not 2020-01-01 so module state should reset
    mw({ type: 'vocabulary/addFsrsCard', payload: { wordId: 'w1' } });

    // Count was reset → first introduction of the day, no limit hit (limit=30)
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'vocabRate/limitReached' })
    );
  });
});
