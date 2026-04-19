import { describe, it, expect } from 'vitest';
import {
  makeSelectQuestVocabMet,
  checkQuestVocabMet,
} from '../selectQuestVocabMet.js';

describe('selectQuestVocabMet', () => {
  describe('checkQuestVocabMet (non-memoized)', () => {
    it('should return met:true when no vocab required', () => {
      const result = checkQuestVocabMet({}, []);
      expect(result.met).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('should return met:true when requiredVocab is null', () => {
      const result = checkQuestVocabMet({}, null);
      expect(result.met).toBe(true);
    });

    it('should return met:true when all required words are learned', () => {
      const fsrsCards = {
        word_1: { card: {}, log: null },
        word_2: { card: {}, log: null },
      };
      const result = checkQuestVocabMet(fsrsCards, ['word_1', 'word_2']);
      expect(result.met).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('should return met:false with missing words list', () => {
      const fsrsCards = {
        word_1: { card: {}, log: null },
      };
      const result = checkQuestVocabMet(fsrsCards, ['word_1', 'word_2', 'word_3']);
      expect(result.met).toBe(false);
      expect(result.missing).toEqual(['word_2', 'word_3']);
    });

    it('should return all words as missing when none are learned', () => {
      const result = checkQuestVocabMet({}, ['word_1', 'word_2']);
      expect(result.met).toBe(false);
      expect(result.missing).toEqual(['word_1', 'word_2']);
    });
  });

  describe('makeSelectQuestVocabMet (memoized)', () => {
    it('should return met:true for empty requirements', () => {
      const selector = makeSelectQuestVocabMet([]);
      const result = selector({ vocabulary: { fsrsCards: {} } });
      expect(result.met).toBe(true);
    });

    it('should check against Redux state', () => {
      const selector = makeSelectQuestVocabMet(['ahlan', 'marhaba']);
      const state = {
        vocabulary: {
          fsrsCards: {
            ahlan: { card: {}, log: null },
          },
        },
      };
      const result = selector(state);
      expect(result.met).toBe(false);
      expect(result.missing).toEqual(['marhaba']);
    });
  });
});
