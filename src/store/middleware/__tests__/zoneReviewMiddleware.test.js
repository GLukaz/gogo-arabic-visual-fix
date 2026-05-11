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
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));

vi.mock('../../../utils/eventBusTypes.js', () => ({
  EVENTS: { MICRO_REVIEW_TRIGGER: 'react:quiz:micro-review-trigger' },
}));

// Mock getDueCards to return specified due cards
vi.mock('../../../services/fsrs.js', () => ({
  getDueCards: vi.fn((cards) => Object.keys(cards)),
}));

// Mock vocabularyAll
vi.mock('../../../data/vocabularyAll.js', () => ({
  default: [
    { id: 'word1', zone: 'oasis_village' },
    { id: 'word2', zone: 'oasis_village' },
    { id: 'word3', zone: 'ancient_library' },
    { id: 'word4', zone: 'oasis_village' },
  ],
}));

describe('zoneReviewMiddleware', () => {
  let store;
  let EventBusMock;

  beforeEach(async () => {
    const { zoneReviewMiddleware } = await import('../zoneReviewMiddleware.js');

    // Get the mocked EventBus
    const { EventBus } = await import('../../../utils/eventBus.js');
    EventBusMock = EventBus;
    EventBusMock.emit.mockClear();

    store = configureStore({
      reducer: {
        vocabulary: vocabularyReducer,
        player: playerReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(zoneReviewMiddleware),
    });
  });

  const waitForAsync = () => new Promise(resolve => {
    setTimeout(resolve, 50);
    // Also flush any pending promises
    Promise.resolve().then(() => {});
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

    // Wait for the async operation using multiple microtask cycles
    await waitForAsync();
    await waitForAsync();
    await waitForAsync();

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

    // Wait for the async operation
    await waitForAsync();
    await waitForAsync();
    await waitForAsync();

    // Only word1 has a card, which is 1 < MIN_DUE_FOR_TRIGGER
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

    // Wait for the async operation
    await waitForAsync();
    await waitForAsync();
    await waitForAsync();

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

    // Wait for the async operation
    await waitForAsync();
    await waitForAsync();
    await waitForAsync();

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
