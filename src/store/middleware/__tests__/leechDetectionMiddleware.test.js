import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isLeech,
  getLeechCards,
  applyLeechIntervalPenalty,
  LEECH_THRESHOLD,
  LEECH_MIN_INTERVAL,
} from '../../../services/leechDetection.js';
import { leechDetectionMiddleware } from '../leechDetectionMiddleware.js';
import vocabularyReducer, {
  suspendCard,
  unsuspendCard,
  selectSuspendedCards,
  selectLeechCount,
} from '../../slices/vocabularySlice.js';

// ─── Pure function tests: isLeech ────────────────────────────────────────────

describe('isLeech', () => {
  it('returns false for a card with lapses below threshold', () => {
    expect(isLeech({ lapses: 4 })).toBe(false);
  });

  it('returns false for a card with lapses = 0', () => {
    expect(isLeech({ lapses: 0 })).toBe(false);
  });

  it('returns true for a card with lapses equal to threshold (5)', () => {
    expect(isLeech({ lapses: LEECH_THRESHOLD })).toBe(true);
  });

  it('returns true for a card with lapses above threshold', () => {
    expect(isLeech({ lapses: 10 })).toBe(true);
  });

  it('returns false for a null card', () => {
    expect(isLeech(null)).toBe(false);
  });

  it('returns false for undefined card', () => {
    expect(isLeech(undefined)).toBe(false);
  });

  it('treats missing lapses field as 0 (not a leech)', () => {
    expect(isLeech({})).toBe(false);
  });
});

// ─── Pure function tests: getLeechCards ──────────────────────────────────────

describe('getLeechCards', () => {
  it('returns empty array for empty cards object', () => {
    expect(getLeechCards({})).toEqual([]);
  });

  it('returns empty array for null/undefined', () => {
    expect(getLeechCards(null)).toEqual([]);
    expect(getLeechCards(undefined)).toEqual([]);
  });

  it('filters out non-leech cards', () => {
    const cards = {
      word1: { card: { lapses: 3 } },
      word2: { card: { lapses: 6 } },
    };
    const result = getLeechCards(cards);
    expect(result).toHaveLength(1);
    expect(result[0].wordId).toBe('word2');
  });

  it('returns all leech cards with lapses >= 5', () => {
    const cards = {
      word1: { card: { lapses: 5 } },
      word2: { card: { lapses: 7 } },
      word3: { card: { lapses: 2 } },
    };
    const result = getLeechCards(cards);
    expect(result).toHaveLength(2);
  });

  it('sorts leech cards by lapses descending (highest first)', () => {
    const cards = {
      wordA: { card: { lapses: 5 } },
      wordB: { card: { lapses: 12 } },
      wordC: { card: { lapses: 8 } },
    };
    const result = getLeechCards(cards);
    expect(result[0].lapses).toBe(12);
    expect(result[1].lapses).toBe(8);
    expect(result[2].lapses).toBe(5);
  });

  it('includes wordId, card, and lapses in each result entry', () => {
    const card = { lapses: 6, stability: 1.2 };
    const result = getLeechCards({ kitab: { card } });
    expect(result[0]).toMatchObject({ wordId: 'kitab', card, lapses: 6 });
  });
});

// ─── Pure function tests: applyLeechIntervalPenalty ──────────────────────────

describe('applyLeechIntervalPenalty', () => {
  it('halves the scheduled_days', () => {
    const card = { lapses: 6, scheduled_days: 10, due: new Date().toISOString() };
    const result = applyLeechIntervalPenalty(card);
    expect(result.scheduled_days).toBe(5);
  });

  it('uses Math.floor for odd intervals', () => {
    const card = { lapses: 5, scheduled_days: 7, due: new Date().toISOString() };
    const result = applyLeechIntervalPenalty(card);
    expect(result.scheduled_days).toBe(3);
  });

  it('enforces minimum interval of LEECH_MIN_INTERVAL (1 day)', () => {
    const card = { lapses: 5, scheduled_days: 1, due: new Date().toISOString() };
    const result = applyLeechIntervalPenalty(card);
    expect(result.scheduled_days).toBe(LEECH_MIN_INTERVAL);
  });

  it('returns null/undefined unchanged', () => {
    expect(applyLeechIntervalPenalty(null)).toBeNull();
    expect(applyLeechIntervalPenalty(undefined)).toBeUndefined();
  });

  it('does not mutate the original card', () => {
    const card = { lapses: 6, scheduled_days: 10, due: new Date().toISOString() };
    applyLeechIntervalPenalty(card);
    expect(card.scheduled_days).toBe(10);
  });

  it('recalculates due date to be in the future', () => {
    const now = Date.now();
    const card = { lapses: 6, scheduled_days: 10, due: new Date(now + 10 * 86400000).toISOString() };
    const result = applyLeechIntervalPenalty(card);
    expect(new Date(result.due).getTime()).toBeGreaterThan(now);
  });
});

// ─── vocabularySlice reducer tests: suspend/unsuspend ────────────────────────

describe('vocabularySlice — suspendCard / unsuspendCard', () => {
  const initialState = {
    fsrsCards: {
      kitab: { card: { lapses: 6, scheduled_days: 10, due: '2026-05-01T00:00:00Z' }, log: null },
    },
    reviewQueue: [],
    stats: { totalReviews: 0, accuracy: 0, streakDays: 0 },
    npcTeacherMap: {},
    suspendedCards: {},
  };

  it('suspendCard adds wordId to suspendedCards', () => {
    const state = vocabularyReducer(initialState, suspendCard({ wordId: 'kitab' }));
    expect(state.suspendedCards.kitab).toBe(true);
  });

  it('unsuspendCard removes wordId from suspendedCards', () => {
    const suspended = { ...initialState, suspendedCards: { kitab: true } };
    const state = vocabularyReducer(suspended, unsuspendCard({ wordId: 'kitab' }));
    expect(state.suspendedCards.kitab).toBeUndefined();
  });

  it('unsuspendCard resets card scheduled_days to 1', () => {
    const suspended = { ...initialState, suspendedCards: { kitab: true } };
    const state = vocabularyReducer(suspended, unsuspendCard({ wordId: 'kitab' }));
    expect(state.fsrsCards.kitab.card.scheduled_days).toBe(1);
  });
});

// ─── Selector tests ──────────────────────────────────────────────────────────

describe('selectSuspendedCards', () => {
  it('returns empty object when no cards suspended', () => {
    const state = { vocabulary: { suspendedCards: {} } };
    expect(selectSuspendedCards(state)).toEqual({});
  });

  it('returns suspended cards map', () => {
    const state = { vocabulary: { suspendedCards: { kitab: true } } };
    expect(selectSuspendedCards(state).kitab).toBe(true);
  });
});

describe('selectLeechCount', () => {
  it('returns 0 when no cards have lapses >= 5', () => {
    const state = {
      vocabulary: {
        fsrsCards: {
          word1: { card: { lapses: 2 } },
          word2: { card: { lapses: 4 } },
        },
      },
    };
    expect(selectLeechCount(state)).toBe(0);
  });

  it('counts cards with lapses >= 5', () => {
    const state = {
      vocabulary: {
        fsrsCards: {
          word1: { card: { lapses: 5 } },
          word2: { card: { lapses: 7 } },
          word3: { card: { lapses: 3 } },
        },
      },
    };
    expect(selectLeechCount(state)).toBe(2);
  });
});

// ─── Middleware tests ─────────────────────────────────────────────────────────

describe('leechDetectionMiddleware', () => {
  let store;
  let next;
  let middleware;

  beforeEach(() => {
    vi.clearAllMocks();
    store = {
      getState: vi.fn(() => ({})),
      dispatch: vi.fn(),
    };
    next = vi.fn((action) => action);
    middleware = leechDetectionMiddleware(store)(next);
  });

  it('passes all actions through to next', () => {
    const action = { type: 'player/addXP', payload: 100 };
    middleware(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('does not dispatch for unrelated action types', () => {
    middleware({ type: 'player/addXP', payload: 100 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('dispatches penalty update when reviewed card is a leech', () => {
    store.getState.mockReturnValue({
      vocabulary: {
        fsrsCards: {
          kitab: { card: { lapses: 5, scheduled_days: 8, due: new Date(Date.now() + 86400000 * 8).toISOString() }, log: null },
        },
      },
    });

    middleware({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', card: { lapses: 5 }, log: null } });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'vocabulary/updateFsrsCard',
        payload: expect.objectContaining({ wordId: 'kitab', _leechPenalty: true }),
      })
    );
  });

  it('does not dispatch when reviewed card has fewer than 5 lapses', () => {
    store.getState.mockReturnValue({
      vocabulary: {
        fsrsCards: {
          kitab: { card: { lapses: 3, scheduled_days: 10, due: new Date().toISOString() }, log: null },
        },
      },
    });

    middleware({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', card: { lapses: 3 }, log: null } });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('skips penalty re-dispatch (prevents infinite loop)', () => {
    // Action flagged as _leechPenalty should pass through without triggering dispatch
    const penaltyAction = {
      type: 'vocabulary/updateFsrsCard',
      payload: { wordId: 'kitab', card: { lapses: 5 }, log: null, _leechPenalty: true },
    };
    middleware(penaltyAction);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(penaltyAction);
  });

  it('halves the scheduled_days in the dispatched penalty action', () => {
    store.getState.mockReturnValue({
      vocabulary: {
        fsrsCards: {
          kitab: { card: { lapses: 6, scheduled_days: 10, due: new Date(Date.now() + 86400000 * 10).toISOString() }, log: null },
        },
      },
    });

    middleware({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', card: { lapses: 6 }, log: null } });

    const dispatched = store.dispatch.mock.calls[0][0];
    expect(dispatched.payload.card.scheduled_days).toBe(5);
  });

  it('handles missing wordId gracefully', () => {
    expect(() => middleware({ type: 'vocabulary/updateFsrsCard', payload: {} })).not.toThrow();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('handles missing vocabulary state gracefully', () => {
    store.getState.mockReturnValue({});
    expect(() =>
      middleware({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', card: {}, log: null } })
    ).not.toThrow();
  });
});
