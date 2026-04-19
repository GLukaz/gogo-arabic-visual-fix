import { describe, it, expect } from 'vitest';
import { getAffixMultiplier, getUnlearnedAffixes } from '../affixMatcher.js';

describe('affixMatcher', () => {
  describe('getAffixMultiplier', () => {
    it('returns 1.0 for learned word (FSRS state = Review)', () => {
      const vocabularyState = {
        fsrsCards: {
          word_sharp: { state: 'Review' },
        },
      };

      const multiplier = getAffixMultiplier('word_sharp', vocabularyState);
      expect(multiplier).toBe(1.0);
    });

    it('returns 0.5 for unlearned word (FSRS state = Learning)', () => {
      const vocabularyState = {
        fsrsCards: {
          word_sharp: { state: 'Learning' },
        },
      };

      const multiplier = getAffixMultiplier('word_sharp', vocabularyState);
      expect(multiplier).toBe(0.5);
    });

    it('returns 0.5 for word in New state', () => {
      const vocabularyState = {
        fsrsCards: {
          word_sharp: { state: 'New' },
        },
      };

      const multiplier = getAffixMultiplier('word_sharp', vocabularyState);
      expect(multiplier).toBe(0.5);
    });

    it('returns 0.5 for word in Relearning state', () => {
      const vocabularyState = {
        fsrsCards: {
          word_sharp: { state: 'Relearning' },
        },
      };

      const multiplier = getAffixMultiplier('word_sharp', vocabularyState);
      expect(multiplier).toBe(0.5);
    });

    it('returns 0.5 for undiscovered word (no FSRS card)', () => {
      const vocabularyState = {
        fsrsCards: {},
      };

      const multiplier = getAffixMultiplier('word_sharp', vocabularyState);
      expect(multiplier).toBe(0.5);
    });

    it('handles missing vocabulary state gracefully', () => {
      const vocabularyState = {};

      const multiplier = getAffixMultiplier('word_sharp', vocabularyState);
      expect(multiplier).toBe(0.5);
    });

    it('handles null fsrsCards gracefully', () => {
      const vocabularyState = {
        fsrsCards: null,
      };

      const multiplier = getAffixMultiplier('word_sharp', vocabularyState);
      expect(multiplier).toBe(0.5);
    });

    it('handles undefined vocabularyState gracefully', () => {
      const multiplier = getAffixMultiplier('word_sharp', { fsrsCards: undefined });
      expect(multiplier).toBe(0.5);
    });
  });

  describe('getUnlearnedAffixes', () => {
    it('returns empty array (placeholder implementation)', () => {
      // Current implementation returns [] to avoid circular dependency
      const vocabularyState = {
        fsrsCards: {},
      };

      const result = getUnlearnedAffixes('simple_kufi', vocabularyState);
      expect(result).toEqual([]);
    });

    it('handles missing vocabularyState', () => {
      const result = getUnlearnedAffixes('simple_kufi', undefined);
      expect(result).toEqual([]);
    });
  });
});
