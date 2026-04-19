/**
 * FEAT-046: Zone intro teaching middleware tests
 *
 * Tests cover:
 * - First zone entry triggers intro start
 * - No trigger when zone intro is already complete
 * - No trigger when zone has no intro words (unknown zone)
 * - Word completion marks word as reviewed + creates FSRS card
 * - No duplicate FSRS card when card already exists
 * - Auto-clear of active intro when all words reviewed
 * - Non-zone actions pass through untouched
 * - String and object payload variants for world/enterZone
 * - Re-entry after dismissal triggers intro again (resume)
 * - zoneIntroSlice startIntro, dismissIntro, clearIntro reducers
 * - zoneIntroSlice selectors
 * - presentNextIntroWord helper
 * - completeIntroWord action creator shape
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { zoneIntroMiddleware, _resetIntroMiddlewareState } from '../zoneIntroMiddleware.js';
import {
  startIntro,
  dismissIntro,
  clearIntro,
  resetZoneIntroSession,
  resetAllIntroSessions,
  completeIntroWord,
  presentNextIntroWord,
  selectActiveIntroProgress,
  selectZoneIntroShouldStart,
} from '../../slices/zoneIntroSlice.js';
import zoneIntroReducer from '../../slices/zoneIntroSlice.js';
import { getZoneIntroWords } from '../../../data/zoneVocabIntros.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_ZONE = 'oasis_village'; // Zone with intro words (from FEAT-045 data)
const UNKNOWN_ZONE = 'no_such_zone';

/**
 * Build a mock Redux store with configurable state.
 * Returns { store, dispatched, next } — `dispatched` collects all dispatched actions.
 */
function makeMockStore({
  introState = {},
  vocabIntroState = {},
  vocabFsrsCards = {},
} = {}) {
  const dispatched = [];

  // Build plain (non-frozen) state objects.
  // Avoid spreading from reducer output — Immer freezes the returned state,
  // which would prevent the dispatch mock from mutating reviewedByZone.
  const mergedIntro = {
    activeZone: null,
    status: 'idle',
    startedZones: {},
    ...introState,
  };
  const mergedVocabIntro = {
    // Use a fresh plain {} when not provided so the dispatch mock can mutate it
    reviewedByZone: vocabIntroState.reviewedByZone != null
      ? vocabIntroState.reviewedByZone
      : {},
  };

  const store = {
    getState: vi.fn(() => ({
      zoneIntro: mergedIntro,
      zoneVocabIntro: mergedVocabIntro,
      vocabulary: { fsrsCards: vocabFsrsCards },
    })),
    dispatch: vi.fn((action) => {
      dispatched.push(action);
      // Simulate state updates for zoneVocabIntro.markWordReviewed
      if (action.type === 'zoneVocabIntro/markWordReviewed') {
        const { zoneId, wordId } = action.payload;
        if (!mergedVocabIntro.reviewedByZone[zoneId]) {
          mergedVocabIntro.reviewedByZone[zoneId] = {};
        }
        mergedVocabIntro.reviewedByZone[zoneId][wordId] = true;
      }
      // Simulate addFsrsCard
      if (action.type === 'vocabulary/addFsrsCard') {
        vocabFsrsCards[action.payload.wordId] = { card: action.payload };
      }
    }),
  };

  const next = vi.fn((action) => action);

  return { store, dispatched, next };
}

/** Create middleware chain: middleware(store)(next)(action) */
function runMiddleware(store, next, action) {
  return zoneIntroMiddleware(store)(next)(action);
}

// ── zoneIntroSlice reducer tests ──────────────────────────────────────────────

describe('zoneIntroSlice reducer', () => {
  it('has correct initial state', () => {
    const state = zoneIntroReducer(undefined, { type: '@@INIT' });
    expect(state.activeZone).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.startedZones).toEqual({});
  });

  it('startIntro sets activeZone, status=active, marks zone as started', () => {
    const state = zoneIntroReducer(undefined, startIntro({ zoneId: 'oasis_village' }));
    expect(state.activeZone).toBe('oasis_village');
    expect(state.status).toBe('active');
    expect(state.startedZones['oasis_village']).toBe(true);
  });

  it('dismissIntro sets status=dismissed, keeps activeZone for progress reminder', () => {
    let state = zoneIntroReducer(undefined, startIntro({ zoneId: 'oasis_village' }));
    state = zoneIntroReducer(state, dismissIntro());
    expect(state.status).toBe('dismissed');
    expect(state.activeZone).toBe('oasis_village');
  });

  it('clearIntro resets activeZone and status to idle', () => {
    let state = zoneIntroReducer(undefined, startIntro({ zoneId: 'oasis_village' }));
    state = zoneIntroReducer(state, clearIntro());
    expect(state.activeZone).toBeNull();
    expect(state.status).toBe('idle');
  });

  it('resetZoneIntroSession removes zone from startedZones and clears active if matching', () => {
    let state = zoneIntroReducer(undefined, startIntro({ zoneId: 'oasis_village' }));
    state = zoneIntroReducer(state, resetZoneIntroSession('oasis_village'));
    expect(state.startedZones['oasis_village']).toBeUndefined();
    expect(state.activeZone).toBeNull();
    expect(state.status).toBe('idle');
  });

  it('resetAllIntroSessions clears everything', () => {
    let state = zoneIntroReducer(undefined, startIntro({ zoneId: 'oasis_village' }));
    state = zoneIntroReducer(state, resetAllIntroSessions());
    expect(state.activeZone).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.startedZones).toEqual({});
  });
});

// ── completeIntroWord action creator ─────────────────────────────────────────

describe('completeIntroWord action creator', () => {
  it('produces correct action type and payload', () => {
    const action = completeIntroWord('oasis_village', 'ov_001');
    expect(action.type).toBe('zoneIntro/completeWord');
    expect(action.payload).toEqual({ zoneId: 'oasis_village', wordId: 'ov_001' });
  });
});

// ── presentNextIntroWord helper ───────────────────────────────────────────────

describe('presentNextIntroWord', () => {
  it('returns the first word when none have been reviewed', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    const word = presentNextIntroWord(VALID_ZONE, state);
    const words = getZoneIntroWords(VALID_ZONE);
    expect(word).not.toBeNull();
    expect(word.id).toBe(words[0].id);
  });

  it('skips reviewed words and returns next unreviewed', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const firstId = words[0].id;
    const state = {
      zoneVocabIntro: {
        reviewedByZone: { [VALID_ZONE]: { [firstId]: true } },
      },
    };
    const word = presentNextIntroWord(VALID_ZONE, state);
    expect(word?.id).toBe(words[1].id);
  });

  it('returns null when all words reviewed', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const reviewed = {};
    words.forEach((w) => (reviewed[w.id] = true));
    const state = {
      zoneVocabIntro: { reviewedByZone: { [VALID_ZONE]: reviewed } },
    };
    const word = presentNextIntroWord(VALID_ZONE, state);
    expect(word).toBeNull();
  });
});

// ── zoneIntroMiddleware: world/enterZone ──────────────────────────────────────

describe('zoneIntroMiddleware — world/enterZone', () => {
  beforeEach(() => {
    _resetIntroMiddlewareState();
  });

  it('dispatches zoneIntro/startIntro on first zone entry when intro is incomplete', () => {
    const { store, dispatched, next } = makeMockStore();
    runMiddleware(store, next, { type: 'world/enterZone', payload: { zoneId: VALID_ZONE } });

    const startAction = dispatched.find((a) => a.type === 'zoneIntro/startIntro');
    expect(startAction).toBeDefined();
    expect(startAction.payload.zoneId).toBe(VALID_ZONE);
  });

  it('always calls next(action) for world/enterZone', () => {
    const { store, next } = makeMockStore();
    const action = { type: 'world/enterZone', payload: { zoneId: VALID_ZONE } };
    runMiddleware(store, next, action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('does NOT dispatch startIntro when all zone words are already reviewed', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const reviewed = {};
    words.forEach((w) => (reviewed[w.id] = true));
    const { store, dispatched, next } = makeMockStore({
      vocabIntroState: { reviewedByZone: { [VALID_ZONE]: reviewed } },
    });

    runMiddleware(store, next, { type: 'world/enterZone', payload: { zoneId: VALID_ZONE } });

    const startAction = dispatched.find((a) => a.type === 'zoneIntro/startIntro');
    expect(startAction).toBeUndefined();
  });

  it('does NOT dispatch startIntro for zones with no intro words (unknown zone)', () => {
    const { store, dispatched, next } = makeMockStore();
    runMiddleware(store, next, { type: 'world/enterZone', payload: { zoneId: UNKNOWN_ZONE } });

    const startAction = dispatched.find((a) => a.type === 'zoneIntro/startIntro');
    expect(startAction).toBeUndefined();
  });

  it('supports string payload variant: { payload: "oasis_village" }', () => {
    const { store, dispatched, next } = makeMockStore();
    runMiddleware(store, next, { type: 'world/enterZone', payload: VALID_ZONE });

    const startAction = dispatched.find((a) => a.type === 'zoneIntro/startIntro');
    expect(startAction).toBeDefined();
    expect(startAction.payload.zoneId).toBe(VALID_ZONE);
  });

  it('triggers intro again on re-entry after dismissal (resume)', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    // Mark first word reviewed but not all
    const reviewed = { [words[0].id]: true };
    const { store, dispatched, next } = makeMockStore({
      introState: { activeZone: null, status: 'idle', startedZones: { [VALID_ZONE]: true } },
      vocabIntroState: { reviewedByZone: { [VALID_ZONE]: reviewed } },
    });

    runMiddleware(store, next, { type: 'world/enterZone', payload: { zoneId: VALID_ZONE } });

    const startAction = dispatched.find((a) => a.type === 'zoneIntro/startIntro');
    expect(startAction).toBeDefined();
  });
});

// ── zoneIntroMiddleware: zoneIntro/completeWord ───────────────────────────────

describe('zoneIntroMiddleware — zoneIntro/completeWord', () => {
  beforeEach(() => {
    _resetIntroMiddlewareState();
  });

  it('dispatches markWordReviewed for the completed word', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const wordId = words[0].id;
    const { store, dispatched, next } = makeMockStore({
      introState: { activeZone: VALID_ZONE, status: 'active', startedZones: { [VALID_ZONE]: true } },
    });

    runMiddleware(store, next, completeIntroWord(VALID_ZONE, wordId));

    const markAction = dispatched.find((a) => a.type === 'zoneVocabIntro/markWordReviewed');
    expect(markAction).toBeDefined();
    expect(markAction.payload).toEqual({ zoneId: VALID_ZONE, wordId });
  });

  it('creates an FSRS card for the word when no card exists yet', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const wordId = words[0].id;
    const { store, dispatched, next } = makeMockStore({
      introState: { activeZone: VALID_ZONE, status: 'active', startedZones: { [VALID_ZONE]: true } },
    });

    runMiddleware(store, next, completeIntroWord(VALID_ZONE, wordId));

    const cardAction = dispatched.find((a) => a.type === 'vocabulary/addFsrsCard');
    expect(cardAction).toBeDefined();
    expect(cardAction.payload.wordId).toBe(wordId);
    expect(cardAction.payload.source).toBe('zoneIntro');
  });

  it('does NOT create a duplicate FSRS card when card already exists', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const wordId = words[0].id;
    const existingCards = { [wordId]: { card: { reps: 3, stability: 5 } } };
    const { store, dispatched, next } = makeMockStore({
      introState: { activeZone: VALID_ZONE, status: 'active', startedZones: { [VALID_ZONE]: true } },
      vocabFsrsCards: existingCards,
    });

    runMiddleware(store, next, completeIntroWord(VALID_ZONE, wordId));

    const cardActions = dispatched.filter((a) => a.type === 'vocabulary/addFsrsCard');
    expect(cardActions).toHaveLength(0);
  });

  it('dispatches clearIntro when all words in the zone are now reviewed', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    // Pre-review all but the last word
    const reviewed = {};
    words.slice(0, -1).forEach((w) => (reviewed[w.id] = true));
    const lastWordId = words[words.length - 1].id;

    const { store, dispatched, next } = makeMockStore({
      introState: { activeZone: VALID_ZONE, status: 'active', startedZones: { [VALID_ZONE]: true } },
      vocabIntroState: { reviewedByZone: { [VALID_ZONE]: reviewed } },
    });

    runMiddleware(store, next, completeIntroWord(VALID_ZONE, lastWordId));

    const clearAction = dispatched.find((a) => a.type === 'zoneIntro/clearIntro');
    expect(clearAction).toBeDefined();
  });

  it('does NOT dispatch clearIntro when more words remain', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const firstWordId = words[0].id;
    const { store, dispatched, next } = makeMockStore({
      introState: { activeZone: VALID_ZONE, status: 'active', startedZones: { [VALID_ZONE]: true } },
    });

    runMiddleware(store, next, completeIntroWord(VALID_ZONE, firstWordId));

    const clearAction = dispatched.find((a) => a.type === 'zoneIntro/clearIntro');
    expect(clearAction).toBeUndefined();
  });

  it('always calls next for completeWord action', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const { store, next } = makeMockStore({
      introState: { activeZone: VALID_ZONE, status: 'active', startedZones: { [VALID_ZONE]: true } },
    });
    const action = completeIntroWord(VALID_ZONE, words[0].id);
    runMiddleware(store, next, action);
    expect(next).toHaveBeenCalledWith(action);
  });
});

// ── zoneIntroMiddleware: passthrough ──────────────────────────────────────────

describe('zoneIntroMiddleware — passthrough', () => {
  it('passes through unrelated actions without dispatching anything', () => {
    const { store, dispatched, next } = makeMockStore();
    const action = { type: 'player/addXP', payload: 100 };
    runMiddleware(store, next, action);
    expect(next).toHaveBeenCalledWith(action);
    expect(dispatched).toHaveLength(0);
  });
});

// ── selectZoneIntroShouldStart selector ──────────────────────────────────────

describe('selectZoneIntroShouldStart', () => {
  it('returns true when zone has words and intro is incomplete', () => {
    const state = {
      zoneVocabIntro: { reviewedByZone: {} },
      zoneIntro: zoneIntroReducer(undefined, { type: '@@INIT' }),
    };
    expect(selectZoneIntroShouldStart(state, VALID_ZONE)).toBe(true);
  });

  it('returns false when intro is complete', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const reviewed = {};
    words.forEach((w) => (reviewed[w.id] = true));
    const state = {
      zoneVocabIntro: { reviewedByZone: { [VALID_ZONE]: reviewed } },
      zoneIntro: zoneIntroReducer(undefined, { type: '@@INIT' }),
    };
    expect(selectZoneIntroShouldStart(state, VALID_ZONE)).toBe(false);
  });

  it('returns false for unknown zones with no intro words', () => {
    const state = {
      zoneVocabIntro: { reviewedByZone: {} },
      zoneIntro: zoneIntroReducer(undefined, { type: '@@INIT' }),
    };
    expect(selectZoneIntroShouldStart(state, UNKNOWN_ZONE)).toBe(false);
  });
});

// ── selectActiveIntroProgress selector ───────────────────────────────────────

describe('selectActiveIntroProgress', () => {
  it('returns zeroes when no intro is active', () => {
    const state = {
      zoneIntro: { activeZone: null, status: 'idle', startedZones: {} },
      zoneVocabIntro: { reviewedByZone: {} },
    };
    const progress = selectActiveIntroProgress(state);
    expect(progress).toEqual({ reviewed: 0, total: 0, percentage: 0 });
  });

  it('returns correct counts when intro is active and partially reviewed', () => {
    const words = getZoneIntroWords(VALID_ZONE);
    const reviewed = { [words[0].id]: true };
    const state = {
      zoneIntro: { activeZone: VALID_ZONE, status: 'active', startedZones: { [VALID_ZONE]: true } },
      zoneVocabIntro: { reviewedByZone: { [VALID_ZONE]: reviewed } },
    };
    const progress = selectActiveIntroProgress(state);
    expect(progress.reviewed).toBe(1);
    expect(progress.total).toBe(words.length);
    expect(progress.percentage).toBeGreaterThan(0);
  });
});
