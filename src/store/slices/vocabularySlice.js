import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getDecayingWords } from '../../services/forgettingCurveService.js';
import { calculateQuranicCoverage, getQuranicCoverageByCategory } from '../../services/quranicCoverage.js';
import { DIALECT_COMPARISON } from '../../data/dialectComparison.js';
import vocabularyAll from '../../data/vocabularyAll.js';
import { LEECH_THRESHOLD } from '../../services/leechDetection.js';

// Build a lowercase-English → dialect entry lookup once at import time
const _dialectByEnglish = new Map(
  DIALECT_COMPARISON.map((entry) => [entry.english.toLowerCase(), entry])
);

const initialState = {
  fsrsCards: {}, // { wordId: { card: FSRS card object, log: last review log, source?: string } }
  reviewQueue: [], // word IDs due for review
  stats: { totalReviews: 0, accuracy: 0, streakDays: 0 },
  npcTeacherMap: {}, // { wordId: npcId } — maps word to the NPC who taught it
  suspendedCards: {}, // { wordId: true } — suspended cards excluded from review rotation
};

const vocabularySlice = createSlice({
  name: 'vocabulary',
  initialState,
  reducers: {
    addFsrsCard(state, action) {
      // payload: { wordId, card, source? }
      const { wordId, card, source } = action.payload;
      state.fsrsCards[wordId] = { card, log: null, source: source || null };
    },

    updateFsrsCard(state, action) {
      // payload: { wordId, card, log }
      const { wordId, card, log } = action.payload;
      if (state.fsrsCards[wordId]) {
        state.fsrsCards[wordId].card = card;
        state.fsrsCards[wordId].log = log;
      } else {
        state.fsrsCards[wordId] = { card, log };
      }
    },

    setReviewQueue(state, action) {
      // payload: array of word IDs
      state.reviewQueue = action.payload;
    },

    updateStats(state, action) {
      // payload: { totalReviews?, accuracy?, streakDays? }
      state.stats = { ...state.stats, ...action.payload };
    },

    associateWordWithNpc(state, action) {
      // payload: { wordId, npcId }
      const { wordId, npcId } = action.payload;
      if (!state.npcTeacherMap[wordId]) {
        state.npcTeacherMap[wordId] = npcId;
      }
    },

    suspendCard(state, action) {
      // payload: { wordId }
      const { wordId } = action.payload;
      state.suspendedCards[wordId] = true;
    },

    unsuspendCard(state, action) {
      // payload: { wordId }
      // Returns card to rotation with a reset interval (1 day, due now)
      const { wordId } = action.payload;
      delete state.suspendedCards[wordId];
      if (state.fsrsCards[wordId]?.card) {
        state.fsrsCards[wordId].card = {
          ...state.fsrsCards[wordId].card,
          scheduled_days: 1,
          due: new Date().toISOString(),
        };
      }
    },

  },
});

export const {
  addFsrsCard,
  updateFsrsCard,
  setReviewQueue,
  updateStats,
  associateWordWithNpc,
  suspendCard,
  unsuspendCard,
} = vocabularySlice.actions;

// ========== MEMOIZED SELECTORS ==========

// Select FSRS cards
export const selectFsrsCards = (state) => state.vocabulary.fsrsCards;

// Select review queue
export const selectReviewQueue = (state) => state.vocabulary.reviewQueue;

// Select review queue count (memoized)
export const selectReviewQueueCount = createSelector(
  [selectReviewQueue],
  (queue) => queue.length
);

// Select learned word count (memoized)
export const selectLearnedWordCount = createSelector(
  [selectFsrsCards],
  (cards) => Object.keys(cards).length
);

// Select vocabulary stats
export const selectVocabularyStats = (state) => state.vocabulary.stats;

// Select NPC teacher map
export const selectNpcTeacherMap = (state) => state.vocabulary.npcTeacherMap;

// Select all words taught by a specific NPC (memoized)
export const selectNpcVocabulary = createSelector(
  [selectNpcTeacherMap, (_state, npcId) => npcId],
  (npcTeacherMap, npcId) =>
    Object.entries(npcTeacherMap)
      .filter(([, teacherNpcId]) => teacherNpcId === npcId)
      .map(([wordId]) => wordId)
);

// Select vocab mastery by zone (memoized)
// Requires zoneVocabCategories map: { zoneId: [categories] }
const ZONE_VOCAB_CATEGORIES = {
  oasis_village: ['greetings', 'trade'],
  ancient_library: ['numbers', 'colors', 'phrases'],
  desert_marketplace: ['trade', 'food', 'numbers'],
  farmland: ['nature', 'animals', 'body', 'verbs_basic'],
  bedouin_camp: ['time', 'phrases', 'adjectives'],
  mountain_village: ['clothing', 'animals', 'adjectives'],
  coastal_port: ['directions', 'trade', 'food'],
  royal_palace: ['adjectives', 'colors', 'phrases'],
};

export const selectVocabMasteryByZone = createSelector(
  [selectFsrsCards, (_state, zoneId) => zoneId],
  (cards, zoneId) => {
    const categories = ZONE_VOCAB_CATEGORIES[zoneId] || [];
    if (categories.length === 0) return { known: 0, total: 0, percentage: 0 };
    // We count how many FSRS cards the player has for words in these categories
    // Since we don't have the full vocab list here, we count learned words only
    const learnedWordIds = Object.keys(cards);
    // This selector returns the count of zone-relevant learned words
    // (full total requires vocabulary data — computed in components)
    return { known: learnedWordIds.length, categories };
  }
);

/**
 * Select vocabulary words not yet in FSRS, sorted by CEFR level then frequency descending.
 * Used for new card introduction: players always encounter high-frequency words first.
 *
 * @param {Object} state - Redux state
 * @param {Array} allWords - Full vocabulary array (from vocabularyAll.js)
 * @param {number} limit - Max cards to return (default 20)
 */
export const selectNewCardsByFrequency = createSelector(
  [selectFsrsCards, (_state, allWords) => allWords, (_state, _words, limit) => limit ?? 20],
  (cards, allWords, limit) => {
    const CEFR_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4 };
    const unseenWords = allWords.filter((w) => !cards[w.id]);
    return unseenWords
      .sort((a, b) => {
        // Primary: CEFR level ascending (A1 before A2 before B1 before B2)
        const cefrA = CEFR_ORDER[a.cefrLevel] ?? 5;
        const cefrB = CEFR_ORDER[b.cefrLevel] ?? 5;
        if (cefrA !== cefrB) return cefrA - cefrB;
        // Secondary: frequency descending within same CEFR level (higher freq = show first)
        return (b.frequency ?? 0) - (a.frequency ?? 0);
      })
      .slice(0, limit);
  }
);

/**
 * Select unseen vocabulary words sorted by path domain affinity, then CEFR, then frequency.
 * Words matching the player's learning path appear first within each CEFR level.
 * This ensures Scholar and Traveler see different first-encounter card sequences (PATH-03).
 *
 * Sort order:
 *   1. CEFR level ascending (A1 → A2 → B1 → B2 → untagged)
 *   2. Path domain affinity match descending (path-matched words first)
 *   3. Frequency descending within same CEFR + affinity tier
 *
 * @param {Object} state - Redux state
 * @param {Array} allWords - Full vocabulary array (from vocabularyAll.js)
 * @param {number} limit - Max cards to return (default 20)
 */
export const selectNewCardsByPath = createSelector(
  [
    selectFsrsCards,
    (state) => state.player.learningPath,
    (_state, allWords) => allWords,
    (_state, _words, limit) => limit ?? 20,
  ],
  (cards, learningPath, allWords, limit) => {
    const CEFR_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4 };
    const unseenWords = allWords.filter((w) => !cards[w.id]);

    return unseenWords
      .sort((a, b) => {
        // Tier 1: CEFR level ascending (A1 before A2 before B1 before B2)
        const cefrA = CEFR_ORDER[a.cefrLevel] ?? 5;
        const cefrB = CEFR_ORDER[b.cefrLevel] ?? 5;
        if (cefrA !== cefrB) return cefrA - cefrB;

        // Tier 2: path domain affinity match (boost words matching player path)
        if (learningPath) {
          const aMatch = (a.domainAffinity ?? []).includes(learningPath) ? 1 : 0;
          const bMatch = (b.domainAffinity ?? []).includes(learningPath) ? 1 : 0;
          if (aMatch !== bMatch) return bMatch - aMatch; // matched words first
        }

        // Tier 3: frequency descending within same CEFR level
        return (b.frequency ?? 0) - (a.frequency ?? 0);
      })
      .slice(0, limit);
  }
);

/**
 * Select count of FSRS cards that are currently due for review.
 * Used by HUD to show a pulsing review debt badge.
 */
export const selectDueCardCount = createSelector(
  [selectFsrsCards],
  (cards) => {
    const now = new Date();
    let count = 0;
    for (const data of Object.values(cards)) {
      if (!data.card || !data.card.due) { count++; continue; }
      if (new Date(data.card.due) <= now) count++;
    }
    return count;
  }
);

/**
 * Select words at risk of being forgotten — FSRS stability below threshold.
 * Wraps getDecayingWords() for Redux state. Returns urgency-sorted list.
 */
export const selectWordsAtRisk = createSelector(
  [selectFsrsCards],
  (fsrsCards) => getDecayingWords(fsrsCards, 3)
);

export const selectQuranicCoverage = createSelector(
  [selectFsrsCards],
  (fsrsCards) => calculateQuranicCoverage(fsrsCards, vocabularyAll)
);

export const selectQuranicCoverageByCategory = createSelector(
  [selectFsrsCards],
  (fsrsCards) => getQuranicCoverageByCategory(fsrsCards, vocabularyAll)
);

/**
 * selectDialectVariants(wordId) — returns dialect comparison entry for a word,
 * or null if no dialect data is available for it.
 * Not a Redux selector — takes wordId directly, uses static data.
 */
export function selectDialectVariants(wordId) {
  if (!wordId) return null;
  const word = vocabularyAll.find((w) => w.id === wordId);
  if (!word?.english) return null;
  return _dialectByEnglish.get(word.english.toLowerCase()) || null;
}

// Select suspended cards map
export const selectSuspendedCards = (state) => state.vocabulary.suspendedCards ?? {};

/**
 * Select count of leech cards (lapses >= LEECH_THRESHOLD).
 */
export const selectLeechCount = createSelector(
  [selectFsrsCards],
  (cards) => {
    let count = 0;
    for (const { card } of Object.values(cards)) {
      if (card && (card.lapses ?? 0) >= LEECH_THRESHOLD) count++;
    }
    return count;
  }
);

export default vocabularySlice.reducer;
