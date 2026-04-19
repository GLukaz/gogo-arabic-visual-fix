import { describe, it, expect } from 'vitest';
import {
  CEFR_ARABIC_RATIOS,
  getArabicRatio,
  scaleDialogueComplexity,
} from '../dialogueComplexity.js';

describe('dialogueComplexity', () => {
  describe('getArabicRatio', () => {
    it('returns 0.2 for A1', () => {
      expect(getArabicRatio('A1')).toBe(0.2);
    });

    it('returns 0.4 for A2', () => {
      expect(getArabicRatio('A2')).toBe(0.4);
    });

    it('returns 0.6 for B1', () => {
      expect(getArabicRatio('B1')).toBe(0.6);
    });

    it('returns 0.7 for B2', () => {
      expect(getArabicRatio('B2')).toBe(0.7);
    });

    it('returns 0.8 for C1', () => {
      expect(getArabicRatio('C1')).toBe(0.8);
    });

    it('returns 0.95 for C2', () => {
      expect(getArabicRatio('C2')).toBe(0.95);
    });

    it('returns 0.5 (fallback) for undefined', () => {
      expect(getArabicRatio(undefined)).toBe(0.5);
    });

    it('returns 0.5 (fallback) for unknown level', () => {
      expect(getArabicRatio('D1')).toBe(0.5);
    });
  });

  describe('scaleDialogueComplexity', () => {
    const sampleLine = {
      arabic: 'السلام عليكم',
      english: 'Peace be upon you',
      transliteration: 'as-salamu alaykum',
    };

    describe('A1 level (20% Arabic)', () => {
      it('primary is English, showTransliteration = true', () => {
        const result = scaleDialogueComplexity(sampleLine, 'A1');

        expect(result.primary).toBe('Peace be upon you');
        expect(result.secondary).toBe('السلام عليكم');
        expect(result.showTransliteration).toBe(true);
        expect(result.isArabicPrimary).toBe(false);
      });
    });

    describe('A2 level (40% Arabic)', () => {
      it('primary is English (40% < 50% threshold)', () => {
        const result = scaleDialogueComplexity(sampleLine, 'A2');

        expect(result.primary).toBe('Peace be upon you');
        expect(result.secondary).toBe('السلام عليكم');
        expect(result.showTransliteration).toBe(true);
        expect(result.isArabicPrimary).toBe(false);
      });
    });

    describe('B1 level (60% Arabic)', () => {
      it('primary is Arabic, showTransliteration = true', () => {
        const result = scaleDialogueComplexity(sampleLine, 'B1');

        expect(result.primary).toBe('السلام عليكم');
        expect(result.secondary).toBe('Peace be upon you');
        expect(result.showTransliteration).toBe(true);
        expect(result.isArabicPrimary).toBe(true);
      });
    });

    describe('B2 level (70% Arabic)', () => {
      it('primary is Arabic, showTransliteration = false', () => {
        const result = scaleDialogueComplexity(sampleLine, 'B2');

        expect(result.primary).toBe('السلام عليكم');
        expect(result.secondary).toBe('Peace be upon you');
        expect(result.showTransliteration).toBe(false);
        expect(result.isArabicPrimary).toBe(true);
      });
    });

    describe('C1 level (80% Arabic)', () => {
      it('primary is Arabic, secondary is null (immersion mode)', () => {
        const result = scaleDialogueComplexity(sampleLine, 'C1');

        expect(result.primary).toBe('السلام عليكم');
        expect(result.secondary).toBeNull();
        expect(result.showTransliteration).toBe(false);
        expect(result.isArabicPrimary).toBe(true);
      });
    });

    describe('C2 level (95% Arabic)', () => {
      it('primary is Arabic, secondary is null (immersion mode)', () => {
        const result = scaleDialogueComplexity(sampleLine, 'C2');

        expect(result.primary).toBe('السلام عليكم');
        expect(result.secondary).toBeNull();
        expect(result.showTransliteration).toBe(false);
        expect(result.isArabicPrimary).toBe(true);
      });
    });

    it('handles missing arabic field gracefully', () => {
      const lineNoArabic = {
        english: 'Peace be upon you',
        transliteration: 'as-salamu alaykum',
      };

      const result = scaleDialogueComplexity(lineNoArabic, 'B1');

      // B1 ratio > 0.5, so isArabicPrimary = true
      // arabic is undefined, so primary = english || ''
      expect(result.primary).toBe('Peace be upon you'); // Falls back to English
      expect(result.isArabicPrimary).toBe(true);
      // B1 ratio < 0.8, so secondary should be English (but it's already primary)
      // secondary = english || null
      expect(result.secondary).toBe('Peace be upon you');
    });

    it('handles missing english field gracefully', () => {
      const lineNoEnglish = {
        arabic: 'السلام عليكم',
        transliteration: 'as-salamu alaykum',
      };

      const result = scaleDialogueComplexity(lineNoEnglish, 'A1');

      // A1 ratio <= 0.5, so isArabicPrimary = false
      // english is undefined, so primary = arabic || ''
      expect(result.primary).toBe('السلام عليكم'); // Falls back to Arabic
      expect(result.isArabicPrimary).toBe(false);
      // A1 ratio < 0.8, so secondary should be Arabic (but it's already primary)
      expect(result.secondary).toBe('السلام عليكم');
    });

    it('is deterministic (same input = same output)', () => {
      const result1 = scaleDialogueComplexity(sampleLine, 'B2');
      const result2 = scaleDialogueComplexity(sampleLine, 'B2');

      expect(result1).toEqual(result2);
    });
  });

  describe('CEFR_ARABIC_RATIOS', () => {
    it('has all 6 levels', () => {
      expect(Object.keys(CEFR_ARABIC_RATIOS)).toHaveLength(6);
      expect(CEFR_ARABIC_RATIOS).toHaveProperty('A1');
      expect(CEFR_ARABIC_RATIOS).toHaveProperty('A2');
      expect(CEFR_ARABIC_RATIOS).toHaveProperty('B1');
      expect(CEFR_ARABIC_RATIOS).toHaveProperty('B2');
      expect(CEFR_ARABIC_RATIOS).toHaveProperty('C1');
      expect(CEFR_ARABIC_RATIOS).toHaveProperty('C2');
    });

    it('values are in ascending order', () => {
      const values = Object.values(CEFR_ARABIC_RATIOS);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1]);
      }
    });
  });
});
