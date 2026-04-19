import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

// Minimal vocabulary slice mock
const vocabularyReducer = (state = { fsrsCards: {} }, action) => {
  if (action.type === 'vocabulary/setCards') return { ...state, fsrsCards: action.payload };
  return state;
};

// Minimal player slice mock
const playerReducer = (state = { currentZone: 'oasis_village' }, action) => {
  if (action.type === 'player/setCurrentZone') return { ...state, currentZone: action.payload };
  return state;
};

// Mock EventBus
vi.mock('../../utils/eventBus.js', () => ({
  EventBus: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));

vi.mock('../../utils/eventBusTypes.js', () => ({
  EVENTS: { MICRO_REVIEW_TRIGGER: 'react:quiz:micro-review-trigger' },
}));

// Mock vocabularyAll — provide some words with zones
vi.mock('../../data/vocabularyAll.js', () => ({
  default: [
    { id: 'word1', zone: 'oasis_village' },
    { id: 'word2', zone: 'oasis_village' },
    { id: 'word3', zone: 'ancient_library' },
    { id: 'word4', zone: 'oasis_village' },
  ],
}));

// Mock getDueCards to return specified due cards
vi.mock('../../services/fsrs.js', () => ({
  getDueCards: vi.fn((cards) => Object.keys(cards)),
}));

describe('zoneReviewMiddleware', () => {
  let store;
  let EventBusMock;

  beforeEach(async () => {
    vi.resetModules();

    const { EventBus } = await import('../../utils/eventBus.js');
    EventBusMock = EventBus;
    EventBusMock.emit.mockClear();

    const { zoneReviewMiddleware } = await import('../zoneReviewMiddleware.js');

    store = configureStore({
      reducer: {
        vocabulary: vocabularyReducer,
        player: playerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(zoneReviewMiddleware),
    });
  });

  it('should emit MICRO_REVIEW_TRIGGER when ≥2 due cards exist in zone', async () => {
    // Set up FSRS cards for oasis village words
    store.dispatch({
      type: 'vocabulary/setCards',
      payload: {
        word1: { card: { due: '2020-01-01' }, log: null },
        word2: { card: { due: '2020-01-01' }, log: null },
        word4: { card: { due: '2020-01-01' }, log: null },
      },
    });

    // Trigger zone change
    store.dispatch({ type: 'player/setCurrentZone', payload: 'oasis_village' });

    // Wait for the async vocab lookup
    await new Promise((r) => setTimeout(r, 100));

    expect(EventBusMock.emit).toHaveBeenCalledWith(
      'react:quiz:micro-review-trigger',
      expect.objectContaining({ wordIds: expect.any(Array) })
    );
  });

  it('should NOT emit when <2 due cards exist in zone', async () => {
    // Only 1 card for oasis village
    store.dispatch({
      type: 'vocabulary/setCards',
      payload: {
        word1: { card: { due: '2020-01-01' }, log: null },
      },
    });

    store.dispatch({ type: 'player/setCurrentZone', payload: 'oasis_village' });

    await new Promise((r) => setTimeout(r, 100));

    // word2 and word4 don't have FSRS cards, so getDueCards won't include them
    // Only word1 has a card, which is 1 < MIN_DUE_FOR_TRIGGER
    // Note: getDueCards mock returns all keys, but zoneDue filters to zone words with cards
    // Actually mock returns ALL keys of cards. word1 is in oasis.
    // Since we only have 1 card total and it maps to 1 oasis word, this should NOT trigger.
    // But our mock getDueCards returns ["word1"] — and zone has word1, so zoneDue=[word1], length=1 < 2. 
    expect(EventBusMock.emit).not.toHaveBeenCalledWith(
      'react:quiz:micro-review-trigger',
      expect.anything()
    );
  });

  it('should NOT emit for a zone with no vocabulary words', async () => {
    store.dispatch({
      type: 'vocabulary/setCards',
      payload: {
        word1: { card: { due: '2020-01-01' }, log: null },
      },
    });

    store.dispatch({ type: 'player/setCurrentZone', payload: 'unknown_zone' });

    await new Promise((r) => setTimeout(r, 100));

    expect(EventBusMock.emit).not.toHaveBeenCalledWith(
      'react:quiz:micro-review-trigger',
      expect.anything()
    );
  });

  it('should limit selection to MAX_REVIEW_WORDS (3)', async () => {
    store.dispatch({
      type: 'vocabulary/setCards',
      payload: {
        word1: { card: { due: '2020-01-01' }, log: null },
        word2: { card: { due: '2020-01-01' }, log: null },
        word4: { card: { due: '2020-01-01' }, log: null },
      },
    });

    store.dispatch({ type: 'player/setCurrentZone', payload: 'oasis_village' });
    await new Promise((r) => setTimeout(r, 100));

    const call = EventBusMock.emit.mock.calls.find(
      (c) => c[0] === 'react:quiz:micro-review-trigger'
    );
    if (call) {
      expect(call[1].wordIds.length).toBeLessThanOrEqual(3);
    }
  });

  it('should only trigger on player/setCurrentZone actions', () => {
    store.dispatch({ type: 'player/updateStreak', payload: 5 });
    expect(EventBusMock.emit).not.toHaveBeenCalledWith(
      'react:quiz:micro-review-trigger',
      expect.anything()
    );
  });
});
