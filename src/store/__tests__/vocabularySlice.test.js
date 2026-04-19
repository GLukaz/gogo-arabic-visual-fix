import { describe, it, expect, beforeEach } from 'vitest';
import vocabularyReducer, {
  addFsrsCard,
  updateFsrsCard,
  setReviewQueue,
  updateStats,
  selectFsrsCards,
  selectReviewQueue,
  selectReviewQueueCount,
  selectLearnedWordCount,
  selectVocabularyStats,
  selectWordsAtRisk,
} from '../slices/vocabularySlice.js';

describe('vocabularySlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      fsrsCards: {},
      npcTeacherMap: {},
      reviewQueue: [],
      stats: { totalReviews: 0, accuracy: 0, streakDays: 0 },
      suspendedCards: {},
    };
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(vocabularyReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('addFsrsCard', () => {
    it('should add new FSRS card for word', () => {
      const card = { due: new Date().toISOString(), reps: 0, lapses: 0 };
      const state = vocabularyReducer(initialState, addFsrsCard({ wordId: 'word1', card }));

      expect(state.fsrsCards).toHaveProperty('word1');
      expect(state.fsrsCards.word1.card).toEqual(card);
      expect(state.fsrsCards.word1.log).toBeNull();
    });

    it('should add multiple cards for different words', () => {
      const card1 = { due: new Date().toISOString(), reps: 0 };
      const card2 = { due: new Date().toISOString(), reps: 0 };

      let state = vocabularyReducer(initialState, addFsrsCard({ wordId: 'word1', card: card1 }));
      state = vocabularyReducer(state, addFsrsCard({ wordId: 'word2', card: card2 }));

      expect(Object.keys(state.fsrsCards)).toHaveLength(2);
      expect(state.fsrsCards.word1).toBeDefined();
      expect(state.fsrsCards.word2).toBeDefined();
    });
  });

  describe('updateFsrsCard', () => {
    it('should update existing FSRS card', () => {
      const initialCard = { due: new Date().toISOString(), reps: 0 };
      const startState = {
        ...initialState,
        fsrsCards: { word1: { card: initialCard, log: null } },
      };

      const updatedCard = { due: new Date().toISOString(), reps: 1 };
      const log = { rating: 3, timestamp: new Date() };

      const state = vocabularyReducer(
        startState,
        updateFsrsCard({ wordId: 'word1', card: updatedCard, log })
      );

      expect(state.fsrsCards.word1.card).toEqual(updatedCard);
      expect(state.fsrsCards.word1.log).toEqual(log);
    });

    it('should create new card entry if word does not exist', () => {
      const card = { due: new Date().toISOString(), reps: 1 };
      const log = { rating: 3 };

      const state = vocabularyReducer(
        initialState,
        updateFsrsCard({ wordId: 'newWord', card, log })
      );

      expect(state.fsrsCards.newWord).toBeDefined();
      expect(state.fsrsCards.newWord.card).toEqual(card);
      expect(state.fsrsCards.newWord.log).toEqual(log);
    });
  });

  describe('setReviewQueue', () => {
    it('should set review queue', () => {
      const queue = ['word1', 'word2', 'word3'];
      const state = vocabularyReducer(initialState, setReviewQueue(queue));

      expect(state.reviewQueue).toEqual(queue);
    });

    it('should replace existing queue', () => {
      const startState = { ...initialState, reviewQueue: ['old1', 'old2'] };
      const newQueue = ['new1', 'new2', 'new3'];

      const state = vocabularyReducer(startState, setReviewQueue(newQueue));

      expect(state.reviewQueue).toEqual(newQueue);
      expect(state.reviewQueue).not.toContain('old1');
    });
  });

  describe('updateStats', () => {
    it('should update vocabulary stats', () => {
      const state = vocabularyReducer(
        initialState,
        updateStats({ totalReviews: 10, accuracy: 0.85 })
      );

      expect(state.stats.totalReviews).toBe(10);
      expect(state.stats.accuracy).toBe(0.85);
    });

    it('should merge with existing stats', () => {
      const startState = {
        ...initialState,
        stats: { totalReviews: 5, accuracy: 0.8, streakDays: 3 },
      };

      const state = vocabularyReducer(startState, updateStats({ totalReviews: 10 }));

      expect(state.stats.totalReviews).toBe(10);
      expect(state.stats.accuracy).toBe(0.8);
      expect(state.stats.streakDays).toBe(3);
    });
  });

  describe('selectors', () => {
    const mockState = {
      vocabulary: {
        fsrsCards: {
          word1: { card: { reps: 5 }, log: null },
          word2: { card: { reps: 3 }, log: null },
          word3: { card: { reps: 1 }, log: null },
        },
        reviewQueue: ['word1', 'word2', 'word4'],
        stats: { totalReviews: 50, accuracy: 0.9, streakDays: 7 },
      },
    };

    it('selectFsrsCards should return FSRS cards object', () => {
      const cards = selectFsrsCards(mockState);
      expect(cards).toEqual(mockState.vocabulary.fsrsCards);
      expect(Object.keys(cards)).toHaveLength(3);
    });

    it('selectReviewQueue should return review queue', () => {
      const queue = selectReviewQueue(mockState);
      expect(queue).toEqual(['word1', 'word2', 'word4']);
    });

    it('selectReviewQueueCount should return queue length', () => {
      const count = selectReviewQueueCount(mockState);
      expect(count).toBe(3);
    });

    it('selectLearnedWordCount should return number of cards', () => {
      const count = selectLearnedWordCount(mockState);
      expect(count).toBe(3); // word1, word2, word3 have cards
    });

    it('selectVocabularyStats should return stats object', () => {
      const stats = selectVocabularyStats(mockState);
      expect(stats).toEqual({
        totalReviews: 50,
        accuracy: 0.9,
        streakDays: 7,
      });
    });
  });

  describe('selectWordsAtRisk', () => {
    it('returns empty array when no cards exist', () => {
      const state = { vocabulary: { ...initialState } };
      expect(selectWordsAtRisk(state)).toEqual([]);
    });

    it('returns words with stability below threshold (< 3)', () => {
      const state = {
        vocabulary: {
          ...initialState,
          fsrsCards: {
            w1: { card: { stability: 1.5, due: null } },
            w2: { card: { stability: 2.9, due: null } },
          },
        },
      };
      const result = selectWordsAtRisk(state);
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.wordId)).toContain('w1');
      expect(result.map((r) => r.wordId)).toContain('w2');
    });

    it('excludes words with stability >= 3', () => {
      const state = {
        vocabulary: {
          ...initialState,
          fsrsCards: {
            safe: { card: { stability: 5, due: null } },
            atrisk: { card: { stability: 1, due: null } },
          },
        },
      };
      const result = selectWordsAtRisk(state);
      expect(result).toHaveLength(1);
      expect(result[0].wordId).toBe('atrisk');
    });

    it('excludes words with zero stability (never reviewed)', () => {
      const state = {
        vocabulary: {
          ...initialState,
          fsrsCards: {
            new_word: { card: { stability: 0, due: null } },
            at_risk: { card: { stability: 1.2, due: null } },
          },
        },
      };
      const result = selectWordsAtRisk(state);
      expect(result).toHaveLength(1);
      expect(result[0].wordId).toBe('at_risk');
    });

    it('sorts by stability ascending (most at risk first)', () => {
      const state = {
        vocabulary: {
          ...initialState,
          fsrsCards: {
            w_mid: { card: { stability: 2.0, due: null } },
            w_low: { card: { stability: 0.5, due: null } },
            w_high: { card: { stability: 2.8, due: null } },
          },
        },
      };
      const result = selectWordsAtRisk(state);
      expect(result[0].wordId).toBe('w_low');
      expect(result[result.length - 1].wordId).toBe('w_high');
    });

    it('includes stability and due fields in each result', () => {
      const dueDate = '2026-04-05T00:00:00.000Z';
      const state = {
        vocabulary: {
          ...initialState,
          fsrsCards: {
            w1: { card: { stability: 1.5, due: dueDate } },
          },
        },
      };
      const result = selectWordsAtRisk(state);
      expect(result[0]).toMatchObject({ wordId: 'w1', stability: 1.5, due: dueDate });
    });
  });
});
