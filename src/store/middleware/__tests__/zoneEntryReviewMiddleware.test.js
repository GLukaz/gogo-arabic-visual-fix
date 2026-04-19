import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getZoneDueCards,
  zoneEntryReviewMiddleware,
  MAX_REVIEW_CARDS,
  COOLDOWN_MS,
  _resetZoneState,
  _getZoneCooldowns,
  _setVocabByZone,
} from '../zoneEntryReviewMiddleware.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const NOW    = new Date('2026-02-09T12:00:00Z');
const NOW_MS = NOW.getTime();
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a due FSRS card: due `daysAgo` days ago, stability `stability` days. */
function makeDueCard(daysAgo, stability = 10) {
  const dueDate = new Date(NOW_MS - daysAgo * DAY_MS).toISOString();
  return { reps: 3, stability, due: dueDate, last_review: new Date(NOW_MS - (daysAgo + stability) * DAY_MS).toISOString() };
}

/** Build a future card (not yet due). */
function makeFutureCard(daysAhead = 2, stability = 10) {
  const dueDate = new Date(NOW_MS + daysAhead * DAY_MS).toISOString();
  return { reps: 3, stability, due: dueDate };
}

/** Build a new card (reps=0). */
function makeNewCard() {
  return { reps: 0, stability: 0, due: null };
}

// ── getZoneDueCards ───────────────────────────────────────────────────────────

describe('getZoneDueCards', () => {
  it('returns empty array when vocabCards is null', () => {
    expect(getZoneDueCards('oasis', null, NOW)).toEqual([]);
  });

  it('returns empty array when vocabCards is empty', () => {
    expect(getZoneDueCards('oasis', {}, NOW)).toEqual([]);
  });

  it('excludes new cards (reps=0)', () => {
    const cards = { w1: { card: makeNewCard() } };
    expect(getZoneDueCards('oasis', cards, NOW)).toEqual([]);
  });

  it('excludes cards with no due date', () => {
    const cards = { w1: { card: { reps: 3, stability: 10, due: null } } };
    expect(getZoneDueCards('oasis', cards, NOW)).toEqual([]);
  });

  it('excludes cards whose due date is in the future', () => {
    const cards = { w1: { card: makeFutureCard(2) } };
    expect(getZoneDueCards('oasis', cards, NOW)).toEqual([]);
  });

  it('includes cards that are past their due date', () => {
    const cards = { w1: { card: makeDueCard(1) } };
    const result = getZoneDueCards('oasis', cards, NOW);
    expect(result).toContain('w1');
  });

  it('sorts cards by urgency descending (most overdue first)', () => {
    // w_high is 5 days overdue with stability 5 → urgency = 5/5 = 1.0
    // w_low  is 1 day overdue with stability 10 → urgency = 1/10 = 0.1
    const cards = {
      w_high: { card: makeDueCard(5, 5) },
      w_low:  { card: makeDueCard(1, 10) },
    };
    const result = getZoneDueCards('oasis', cards, NOW);
    expect(result[0]).toBe('w_high');
    expect(result[1]).toBe('w_low');
  });

  it('respects MAX_REVIEW_CARDS limit', () => {
    const cards = {};
    for (let i = 0; i < 10; i++) {
      cards[`w${i}`] = { card: makeDueCard(i + 1) };
    }
    const result = getZoneDueCards('oasis', cards, NOW);
    expect(result.length).toBeLessThanOrEqual(MAX_REVIEW_CARDS);
  });

  it('filters to zoneWordIds when provided', () => {
    const cards = {
      w_zone:    { card: makeDueCard(1) },
      w_outside: { card: makeDueCard(2) },
    };
    const result = getZoneDueCards('oasis', cards, NOW, ['w_zone']);
    expect(result).toContain('w_zone');
    expect(result).not.toContain('w_outside');
  });

  it('excludes zoneWordIds entries that have no FSRS card', () => {
    const cards = { w_has_card: { card: makeDueCard(1) } };
    // w_no_card is in the zone but has no FSRS data yet
    const result = getZoneDueCards('oasis', cards, NOW, ['w_has_card', 'w_no_card']);
    expect(result).toContain('w_has_card');
    expect(result).not.toContain('w_no_card');
  });

  it('considers all cards when zoneWordIds is null (fallback)', () => {
    const cards = {
      wA: { card: makeDueCard(1) },
      wB: { card: makeDueCard(2) },
    };
    const result = getZoneDueCards('oasis', cards, NOW, null);
    expect(result).toContain('wA');
    expect(result).toContain('wB');
  });

  it('accepts now as epoch milliseconds (not just Date)', () => {
    const cards = { w1: { card: makeDueCard(1) } };
    const result = getZoneDueCards('oasis', cards, NOW_MS);
    expect(result).toContain('w1');
  });

  it('higher stability (easier to forget) means lower urgency for same overdue time', () => {
    // w_low_s: stability=2, 2 days overdue → urgency = 2/2 = 1.0
    // w_hi_s:  stability=20, 2 days overdue → urgency = 2/20 = 0.1
    const cards = {
      w_low_s: { card: makeDueCard(2, 2) },
      w_hi_s:  { card: makeDueCard(2, 20) },
    };
    const result = getZoneDueCards('oasis', cards, NOW);
    expect(result[0]).toBe('w_low_s'); // more urgent first
  });
});

// ── middleware ────────────────────────────────────────────────────────────────

function makeMockStore(vocabCards = {}) {
  const dispatched = [];
  const store = {
    getState: () => ({ vocabulary: { fsrsCards: vocabCards } }),
    dispatch:  (action) => dispatched.push(action),
  };
  return { store, dispatched };
}

describe('zoneEntryReviewMiddleware', () => {
  beforeEach(() => {
    _resetZoneState();
    // Inject a synchronous vocab map so loadVocabByZone resolves immediately
    _setVocabByZone({ oasis: ['w1', 'w2'], market: ['w3'] });
  });

  it('ignores actions that are not world/enterZone', async () => {
    const { store, dispatched } = makeMockStore({ w1: { card: makeDueCard(1) } });
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    middleware({ type: 'player/setCurrentZone', payload: 'oasis' });
    // Flush microtasks (no setTimeout — fake timers are active globally)
    await Promise.resolve();
    await Promise.resolve();

    expect(dispatched).toHaveLength(0);
  });

  it('dispatches microReview/suggest when due cards exist in the zone', async () => {
    const { store, dispatched } = makeMockStore({ w1: { card: makeDueCard(1) } });
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    middleware({ type: 'world/enterZone', payload: { zoneId: 'oasis' } });
    await Promise.resolve();
    await Promise.resolve();

    expect(dispatched.some((a) => a.type === 'microReview/suggest')).toBe(true);
  });

  it('does NOT dispatch when there are no due cards for the zone', async () => {
    const { store, dispatched } = makeMockStore({ w1: { card: makeFutureCard() } });
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    middleware({ type: 'world/enterZone', payload: { zoneId: 'oasis' } });
    await Promise.resolve();
    await Promise.resolve();

    expect(dispatched).toHaveLength(0);
  });

  it('includes zoneId and cards in suggest payload', async () => {
    const { store, dispatched } = makeMockStore({ w1: { card: makeDueCard(1) } });
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    middleware({ type: 'world/enterZone', payload: { zoneId: 'oasis' } });
    await Promise.resolve();
    await Promise.resolve();

    const suggestAction = dispatched.find((a) => a.type === 'microReview/suggest');
    expect(suggestAction.payload.zoneId).toBe('oasis');
    expect(Array.isArray(suggestAction.payload.cards)).toBe(true);
  });

  it('skips trigger if zone was reviewed within the cooldown window', async () => {
    // Manually set a recent cooldown for the zone
    const cooldowns = _getZoneCooldowns();
    cooldowns['oasis'] = Date.now() - HOUR_MS / 2; // 30 minutes ago

    const { store, dispatched } = makeMockStore({ w1: { card: makeDueCard(1) } });
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    middleware({ type: 'world/enterZone', payload: { zoneId: 'oasis' } });
    await Promise.resolve();
    await Promise.resolve();

    expect(dispatched).toHaveLength(0);
  });

  it('triggers again after cooldown window has elapsed', async () => {
    const cooldowns = _getZoneCooldowns();
    cooldowns['oasis'] = Date.now() - COOLDOWN_MS - 1000; // just past cooldown

    const { store, dispatched } = makeMockStore({ w1: { card: makeDueCard(1) } });
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    middleware({ type: 'world/enterZone', payload: { zoneId: 'oasis' } });
    await Promise.resolve();
    await Promise.resolve();

    expect(dispatched.some((a) => a.type === 'microReview/suggest')).toBe(true);
  });

  it('enforces independent cooldowns per zone', async () => {
    const cooldowns = _getZoneCooldowns();
    cooldowns['oasis'] = Date.now(); // oasis just triggered

    // market has no cooldown — should trigger
    _setVocabByZone({ oasis: ['w1'], market: ['w3'] });
    const { store, dispatched } = makeMockStore({
      w1: { card: makeDueCard(1) },
      w3: { card: makeDueCard(1) },
    });
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    middleware({ type: 'world/enterZone', payload: { zoneId: 'market' } });
    await Promise.resolve();
    await Promise.resolve();

    expect(dispatched.some((a) => a.type === 'microReview/suggest')).toBe(true);
    const action = dispatched.find((a) => a.type === 'microReview/suggest');
    expect(action.payload.zoneId).toBe('market');
  });

  it('supports string payload form: { type: "world/enterZone", payload: "oasis" }', async () => {
    const { store, dispatched } = makeMockStore({ w1: { card: makeDueCard(1) } });
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    middleware({ type: 'world/enterZone', payload: 'oasis' });
    await Promise.resolve();
    await Promise.resolve();

    expect(dispatched.some((a) => a.type === 'microReview/suggest')).toBe(true);
  });

  it('always calls next(action)', () => {
    const { store } = makeMockStore();
    const next = vi.fn();
    const middleware = zoneEntryReviewMiddleware(store)(next);

    const action = { type: 'world/enterZone', payload: { zoneId: 'oasis' } };
    middleware(action);

    expect(next).toHaveBeenCalledWith(action);
  });
});

// ── microReviewSlice integration ──────────────────────────────────────────────

describe('microReview slice actions', () => {
  it('suggest action has correct type', async () => {
    const { suggest } = await import('../../slices/microReviewSlice.js');
    const action = suggest({ zoneId: 'oasis', cards: ['w1', 'w2'] });
    expect(action.type).toBe('microReview/suggest');
    expect(action.payload).toEqual({ zoneId: 'oasis', cards: ['w1', 'w2'] });
  });
});
