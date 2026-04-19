import { describe, it, expect, vi, beforeEach } from 'vitest';
import deckReducer, {
  createDeck,
  deleteDeck,
  addWordToDeck,
  removeWordFromDeck,
  generateDeckByZone,
  generateDeckByCefr,
  generateDeckByCategory,
  getSessionCardsFromDeck,
  selectDecks,
  selectDeck,
  selectDeckStats,
  MAX_CUSTOM_DECKS,
  ZONE_VOCAB_CATEGORIES,
} from '../deckSlice.js';

// Mock getRetrievability so we don't pull in ts-fsrs internals
vi.mock('../../../services/fsrs.js', () => ({
  getRetrievability: vi.fn((card) => {
    if (!card || card.reps === 0) return 1.0;
    return 0.8; // fixed value for reviewed cards
  }),
}));

const baseState = deckReducer(undefined, { type: '@@INIT' });

// Sample vocabulary words for filter tests
const allWords = [
  { id: 'w1', arabic: 'مرحبا', english: 'hello', category: 'greetings', cefrLevel: 'A1' },
  { id: 'w2', arabic: 'سوق', english: 'market', category: 'trade', cefrLevel: 'A1' },
  { id: 'w3', arabic: 'واحد', english: 'one', category: 'numbers', cefrLevel: 'A1' },
  { id: 'w4', arabic: 'كتب', english: 'wrote', category: 'verbs_basic', cefrLevel: 'B1' },
  { id: 'w5', arabic: 'شجرة', english: 'tree', category: 'nature', cefrLevel: 'A2' },
  { id: 'w6', arabic: 'قط', english: 'cat', category: 'animals', cefrLevel: 'A2' },
  { id: 'w7', arabic: 'أحمر', english: 'red', category: 'colors', cefrLevel: 'A1' },
  { id: 'w8', arabic: 'طعام', english: 'food', category: 'food', cefrLevel: 'A2' },
];

// Helper to wrap state for selectors
const wrapState = (deckState, fsrsCards = {}) => ({
  decks: deckState,
  vocabulary: { fsrsCards },
});

// ============================================================
// Initial state
// ============================================================

describe('deckSlice — initial state', () => {
  it('starts with no decks', () => {
    expect(baseState.decks).toEqual({});
  });

  it('starts with _nextId of 1', () => {
    expect(baseState._nextId).toBe(1);
  });
});

// ============================================================
// createDeck
// ============================================================

describe('createDeck', () => {
  it('creates a manual deck with provided wordIds', () => {
    const state = deckReducer(
      baseState,
      createDeck({ name: 'My Deck', filterType: 'manual', wordIds: ['w1', 'w2'] })
    );
    const decks = Object.values(state.decks);
    expect(decks).toHaveLength(1);
    expect(decks[0].name).toBe('My Deck');
    expect(decks[0].filterType).toBe('manual');
    expect(decks[0].wordIds).toEqual(['w1', 'w2']);
  });

  it('creates a zone deck with filterValue', () => {
    const state = deckReducer(
      baseState,
      createDeck({ name: 'Oasis Deck', filterType: 'zone', filterValue: 'oasis_village', wordIds: ['w1', 'w2'] })
    );
    const deck = Object.values(state.decks)[0];
    expect(deck.filterType).toBe('zone');
    expect(deck.filterValue).toBe('oasis_village');
  });

  it('creates a CEFR level deck', () => {
    const state = deckReducer(
      baseState,
      createDeck({ name: 'A1 Deck', filterType: 'cefrLevel', filterValue: 'A1', wordIds: ['w1', 'w3'] })
    );
    const deck = Object.values(state.decks)[0];
    expect(deck.filterType).toBe('cefrLevel');
    expect(deck.filterValue).toBe('A1');
  });

  it('creates a category deck', () => {
    const state = deckReducer(
      baseState,
      createDeck({ name: 'Greetings', filterType: 'category', filterValue: 'greetings', wordIds: ['w1'] })
    );
    const deck = Object.values(state.decks)[0];
    expect(deck.filterType).toBe('category');
    expect(deck.filterValue).toBe('greetings');
  });

  it('defaults filterType to manual when not provided', () => {
    const state = deckReducer(baseState, createDeck({ name: 'Quick Deck' }));
    const deck = Object.values(state.decks)[0];
    expect(deck.filterType).toBe('manual');
    expect(deck.wordIds).toEqual([]);
  });

  it('assigns a unique id to each deck', () => {
    let state = deckReducer(baseState, createDeck({ name: 'Deck A' }));
    state = deckReducer(state, createDeck({ name: 'Deck B' }));
    const ids = Object.keys(state.decks);
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it('enforces max 10 decks — 11th create is silently ignored', () => {
    let state = baseState;
    for (let i = 0; i < MAX_CUSTOM_DECKS; i++) {
      state = deckReducer(state, createDeck({ name: `Deck ${i}` }));
    }
    expect(Object.keys(state.decks)).toHaveLength(MAX_CUSTOM_DECKS);
    // 11th attempt
    state = deckReducer(state, createDeck({ name: 'Deck 11' }));
    expect(Object.keys(state.decks)).toHaveLength(MAX_CUSTOM_DECKS);
  });
});

// ============================================================
// deleteDeck
// ============================================================

describe('deleteDeck', () => {
  it('removes the specified deck', () => {
    let state = deckReducer(baseState, createDeck({ name: 'To Delete' }));
    const deckId = Object.keys(state.decks)[0];
    state = deckReducer(state, deleteDeck({ deckId }));
    expect(state.decks[deckId]).toBeUndefined();
  });

  it('does nothing for non-existent deckId', () => {
    const state = deckReducer(baseState, deleteDeck({ deckId: 'deck_999' }));
    expect(state.decks).toEqual({});
  });
});

// ============================================================
// addWordToDeck / removeWordFromDeck
// ============================================================

describe('addWordToDeck', () => {
  it('adds a word to a deck', () => {
    let state = deckReducer(baseState, createDeck({ name: 'Manual' }));
    const deckId = Object.keys(state.decks)[0];
    state = deckReducer(state, addWordToDeck({ deckId, wordId: 'w1' }));
    expect(state.decks[deckId].wordIds).toContain('w1');
  });

  it('does not add duplicate wordIds', () => {
    let state = deckReducer(baseState, createDeck({ name: 'Manual', wordIds: ['w1'] }));
    const deckId = Object.keys(state.decks)[0];
    state = deckReducer(state, addWordToDeck({ deckId, wordId: 'w1' }));
    expect(state.decks[deckId].wordIds.filter((id) => id === 'w1')).toHaveLength(1);
  });
});

describe('removeWordFromDeck', () => {
  it('removes a word from a deck', () => {
    let state = deckReducer(baseState, createDeck({ name: 'Manual', wordIds: ['w1', 'w2'] }));
    const deckId = Object.keys(state.decks)[0];
    state = deckReducer(state, removeWordFromDeck({ deckId, wordId: 'w1' }));
    expect(state.decks[deckId].wordIds).not.toContain('w1');
    expect(state.decks[deckId].wordIds).toContain('w2');
  });
});

// ============================================================
// generateDeckByZone
// ============================================================

describe('generateDeckByZone', () => {
  it('returns wordIds matching the zone categories (oasis_village)', () => {
    const ids = generateDeckByZone('oasis_village', allWords);
    // oasis_village: ['greetings', 'trade']
    expect(ids).toContain('w1'); // greetings
    expect(ids).toContain('w2'); // trade
    expect(ids).not.toContain('w3'); // numbers — not in this zone
  });

  it('returns wordIds for farmland zone (nature, animals, body, verbs_basic)', () => {
    const ids = generateDeckByZone('farmland', allWords);
    expect(ids).toContain('w4'); // verbs_basic
    expect(ids).toContain('w5'); // nature
    expect(ids).toContain('w6'); // animals
  });

  it('returns empty array for unknown zone', () => {
    const ids = generateDeckByZone('unknown_zone', allWords);
    expect(ids).toEqual([]);
  });
});

// ============================================================
// generateDeckByCefr
// ============================================================

describe('generateDeckByCefr', () => {
  it('returns only A1 words', () => {
    const ids = generateDeckByCefr('A1', allWords);
    expect(ids).toContain('w1'); // A1
    expect(ids).toContain('w2'); // A1
    expect(ids).not.toContain('w4'); // B1
  });

  it('returns only B1 words', () => {
    const ids = generateDeckByCefr('B1', allWords);
    expect(ids).toEqual(['w4']);
  });

  it('returns empty array for CEFR level not in vocabulary', () => {
    const ids = generateDeckByCefr('C1', allWords);
    expect(ids).toEqual([]);
  });
});

// ============================================================
// generateDeckByCategory
// ============================================================

describe('generateDeckByCategory', () => {
  it('returns wordIds matching the category', () => {
    const ids = generateDeckByCategory('greetings', allWords);
    expect(ids).toEqual(['w1']);
  });

  it('returns multiple words for a shared category', () => {
    const ids = generateDeckByCategory('animals', allWords);
    expect(ids).toContain('w6');
  });

  it('returns empty array for unknown category', () => {
    const ids = generateDeckByCategory('verbs_advanced', allWords);
    expect(ids).toEqual([]);
  });
});

// ============================================================
// getSessionCardsFromDeck
// ============================================================

describe('getSessionCardsFromDeck', () => {
  // Use absolute dates relative to the fake timer (2026-02-09T00:00:00Z set in beforeEach)
  const pastDate = '2020-01-01T00:00:00.000Z';   // definitely before fake "now"
  const futureDate = '2030-01-01T00:00:00.000Z'; // definitely after fake "now"

  const fsrsCards = {
    w1: { card: { due: pastDate, reps: 1 }, log: null },
    w2: { card: { due: futureDate, reps: 2 }, log: null },
    w3: { card: null, log: null }, // new card — always due
    w4: { card: { due: pastDate, reps: 1 }, log: null },
  };

  it('returns only due cards within the deck', () => {
    const deck = { id: 'deck_1', wordIds: ['w1', 'w2'] };
    const result = getSessionCardsFromDeck(deck, fsrsCards);
    expect(result).toContain('w1'); // past due
    expect(result).not.toContain('w2'); // future — not due
  });

  it('includes new cards (no card data) as due', () => {
    const deck = { id: 'deck_1', wordIds: ['w3'] };
    const result = getSessionCardsFromDeck(deck, fsrsCards);
    expect(result).toContain('w3');
  });

  it('respects maxCards limit', () => {
    const deck = { id: 'deck_1', wordIds: ['w1', 'w3', 'w4'] };
    const result = getSessionCardsFromDeck(deck, fsrsCards, 2);
    expect(result).toHaveLength(2);
  });

  it('excludes cards not in the deck', () => {
    const deck = { id: 'deck_1', wordIds: ['w1'] };
    const result = getSessionCardsFromDeck(deck, fsrsCards);
    expect(result).not.toContain('w4'); // due, but not in deck
  });

  it('returns empty array for null deck', () => {
    expect(getSessionCardsFromDeck(null, fsrsCards)).toEqual([]);
  });

  it('returns empty array for deck with no wordIds', () => {
    const deck = { id: 'deck_1', wordIds: [] };
    expect(getSessionCardsFromDeck(deck, fsrsCards)).toEqual([]);
  });
});

// ============================================================
// selectDeckStats
// ============================================================

describe('selectDeckStats', () => {
  // Use absolute dates relative to the fake timer (2026-02-09T00:00:00Z set in beforeEach)
  const pastDate = '2020-01-01T00:00:00.000Z';   // definitely before fake "now"
  const futureDate = '2030-01-01T00:00:00.000Z'; // definitely after fake "now"

  it('returns zero stats for non-existent deckId', () => {
    const state = wrapState(baseState);
    const stats = selectDeckStats(state, 'deck_999');
    expect(stats).toEqual({ cardCount: 0, dueCount: 0, avgRetrievability: 0 });
  });

  it('returns correct cardCount and dueCount', () => {
    const deckState = deckReducer(
      baseState,
      createDeck({ name: 'Test', wordIds: ['w1', 'w2', 'w3'] })
    );
    const deckId = Object.keys(deckState.decks)[0];
    const fsrsCards = {
      w1: { card: { due: pastDate, reps: 1, stability: 1 }, log: null }, // due
      w2: { card: { due: futureDate, reps: 2, stability: 2 }, log: null }, // not due
      // w3 not in fsrsCards — player hasn't learned it
    };
    const state = wrapState(deckState, fsrsCards);
    const stats = selectDeckStats(state, deckId);
    expect(stats.cardCount).toBe(3); // total wordIds in deck
    expect(stats.dueCount).toBe(1); // only w1 is due
  });

  it('avgRetrievability is 0 when no words are known', () => {
    const deckState = deckReducer(baseState, createDeck({ name: 'Test', wordIds: ['w1'] }));
    const deckId = Object.keys(deckState.decks)[0];
    const state = wrapState(deckState, {}); // empty fsrsCards
    const stats = selectDeckStats(state, deckId);
    expect(stats.avgRetrievability).toBe(0);
  });

  it('avgRetrievability is a number between 0 and 1', () => {
    const deckState = deckReducer(baseState, createDeck({ name: 'Test', wordIds: ['w1'] }));
    const deckId = Object.keys(deckState.decks)[0];
    const fsrsCards = {
      w1: { card: { due: pastDate, reps: 1, stability: 2 }, log: null },
    };
    const state = wrapState(deckState, fsrsCards);
    const stats = selectDeckStats(state, deckId);
    expect(stats.avgRetrievability).toBeGreaterThanOrEqual(0);
    expect(stats.avgRetrievability).toBeLessThanOrEqual(1);
  });
});

// ============================================================
// ZONE_VOCAB_CATEGORIES export
// ============================================================

describe('ZONE_VOCAB_CATEGORIES', () => {
  it('exports categories for all 8 zones', () => {
    const zones = [
      'oasis_village',
      'ancient_library',
      'desert_marketplace',
      'farmland',
      'bedouin_camp',
      'mountain_village',
      'coastal_port',
      'royal_palace',
    ];
    for (const zone of zones) {
      expect(ZONE_VOCAB_CATEGORIES[zone]).toBeDefined();
      expect(ZONE_VOCAB_CATEGORIES[zone].length).toBeGreaterThan(0);
    }
  });
});
