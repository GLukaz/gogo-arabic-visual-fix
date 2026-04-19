/**
 * deckSlice.js — Custom FSRS deck management (FEAT-035)
 *
 * Players can create up to 10 custom vocabulary decks for focused review.
 * Decks can be created by zone, CEFR level, category, or manual word selection.
 * Review sessions can target a specific deck instead of the full pool.
 *
 * Deck wordIds are stored at creation time (snapshot). Callers must regenerate
 * auto-decks when they want a fresh snapshot.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getRetrievability } from '../../services/fsrs.js';

// ============================================================
// Zone → category mapping (mirrors vocabularySlice ZONE_VOCAB_CATEGORIES)
// ============================================================
export const ZONE_VOCAB_CATEGORIES = {
  oasis_village: ['greetings', 'trade'],
  ancient_library: ['numbers', 'colors', 'phrases'],
  desert_marketplace: ['trade', 'food', 'numbers'],
  farmland: ['nature', 'animals', 'body', 'verbs_basic'],
  bedouin_camp: ['time', 'phrases', 'adjectives'],
  mountain_village: ['clothing', 'animals', 'adjectives'],
  coastal_port: ['directions', 'trade', 'food'],
  royal_palace: ['adjectives', 'colors', 'phrases'],
};

export const MAX_CUSTOM_DECKS = 10;

// ============================================================
// PURE FUNCTIONS — deck generation helpers
// ============================================================

/**
 * Generate wordIds for a given zone by matching zone categories.
 * @param {string} zoneId
 * @param {Array} allWords - full vocabulary array
 * @returns {string[]} wordIds
 */
export function generateDeckByZone(zoneId, allWords) {
  const categories = ZONE_VOCAB_CATEGORIES[zoneId] || [];
  if (categories.length === 0) return [];
  return allWords.filter((w) => categories.includes(w.category)).map((w) => w.id);
}

/**
 * Generate wordIds for a given CEFR level.
 * @param {string} level - 'A1' | 'A2' | 'B1' | 'B2'
 * @param {Array} allWords - full vocabulary array
 * @returns {string[]} wordIds
 */
export function generateDeckByCefr(level, allWords) {
  return allWords.filter((w) => w.cefrLevel === level).map((w) => w.id);
}

/**
 * Generate wordIds for a given vocabulary category.
 * @param {string} category
 * @param {Array} allWords - full vocabulary array
 * @returns {string[]} wordIds
 */
export function generateDeckByCategory(category, allWords) {
  return allWords.filter((w) => w.category === category).map((w) => w.id);
}

/**
 * Get due session cards filtered to a deck's wordIds.
 * @param {Object} deck - deck object from state (has wordIds)
 * @param {Object} fsrsCards - state.vocabulary.fsrsCards
 * @param {number} maxCards
 * @returns {string[]} wordIds of due cards within the deck
 */
export function getSessionCardsFromDeck(deck, fsrsCards, maxCards = 20) {
  if (!deck || !deck.wordIds || deck.wordIds.length === 0) return [];
  const wordIdSet = new Set(deck.wordIds);
  const now = new Date();
  const due = [];
  for (const [wordId, data] of Object.entries(fsrsCards)) {
    if (!wordIdSet.has(wordId)) continue;
    if (!data.card || !data.card.due) {
      due.push(wordId); // new cards always due
      continue;
    }
    if (new Date(data.card.due) <= now) due.push(wordId);
  }
  // Shuffle (Fisher-Yates)
  for (let i = due.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [due[i], due[j]] = [due[j], due[i]];
  }
  return due.slice(0, maxCards);
}

// ============================================================
// SLICE
// ============================================================

const initialState = {
  decks: {}, // { [deckId]: { id, name, filterType, filterValue, wordIds, createdAt } }
  _nextId: 1,
};

const deckSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    /**
     * Create a new custom deck.
     * payload: { name, filterType?, filterValue?, wordIds? }
     * filterType: 'zone' | 'cefrLevel' | 'category' | 'manual'
     * Enforces max 10 decks per player.
     */
    createDeck(state, action) {
      if (Object.keys(state.decks).length >= MAX_CUSTOM_DECKS) return;
      const id = `deck_${state._nextId}`;
      state._nextId += 1;
      state.decks[id] = {
        id,
        name: action.payload.name,
        filterType: action.payload.filterType || 'manual',
        filterValue: action.payload.filterValue ?? null,
        wordIds: action.payload.wordIds || [],
        createdAt: new Date().toISOString(),
      };
    },

    /**
     * Delete a custom deck.
     * payload: { deckId }
     */
    deleteDeck(state, action) {
      delete state.decks[action.payload.deckId];
    },

    /**
     * Add a word to an existing (manual) deck.
     * payload: { deckId, wordId }
     */
    addWordToDeck(state, action) {
      const deck = state.decks[action.payload.deckId];
      if (!deck) return;
      if (!deck.wordIds.includes(action.payload.wordId)) {
        deck.wordIds.push(action.payload.wordId);
      }
    },

    /**
     * Remove a word from a deck.
     * payload: { deckId, wordId }
     */
    removeWordFromDeck(state, action) {
      const deck = state.decks[action.payload.deckId];
      if (!deck) return;
      deck.wordIds = deck.wordIds.filter((id) => id !== action.payload.wordId);
    },
  },
});

export const { createDeck, deleteDeck, addWordToDeck, removeWordFromDeck } = deckSlice.actions;

// ============================================================
// SELECTORS
// ============================================================

export const selectDecks = (state) => state.decks.decks;
export const selectDeck = (state, deckId) => state.decks.decks[deckId];

/**
 * selectDeckStats(state, deckId)
 * Returns { cardCount, dueCount, avgRetrievability } for a deck.
 * cardCount: total wordIds in deck
 * dueCount: how many are due for review (in player's fsrsCards)
 * avgRetrievability: average FSRS retrievability across known cards in deck (0-1)
 */
export const selectDeckStats = createSelector(
  [
    (state) => state.vocabulary.fsrsCards,
    (_state, deckId) => deckId,
    (state) => state.decks.decks,
  ],
  (fsrsCards, deckId, decks) => {
    const deck = decks[deckId];
    if (!deck) return { cardCount: 0, dueCount: 0, avgRetrievability: 0 };

    const now = new Date();
    let dueCount = 0;
    let totalRetrievability = 0;
    let knownCount = 0;

    for (const wordId of deck.wordIds) {
      const data = fsrsCards[wordId];
      if (!data) continue; // player hasn't learned this word yet
      knownCount++;

      // Due check
      if (!data.card || !data.card.due || new Date(data.card.due) <= now) {
        dueCount++;
      }

      // Retrievability
      const ret = data.card ? getRetrievability(data.card, now) : 1.0;
      totalRetrievability += ret;
    }

    return {
      cardCount: deck.wordIds.length,
      dueCount,
      avgRetrievability: knownCount > 0 ? totalRetrievability / knownCount : 0,
    };
  }
);

export default deckSlice.reducer;
