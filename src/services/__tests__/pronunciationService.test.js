import { describe, it, expect } from 'vitest';
import {
  isSpeechRecognitionSupported,
  calculateSimilarity,
} from '../pronunciationService.js';

describe('pronunciationService', () => {
  describe('isSpeechRecognitionSupported', () => {
    it('should return false in test environment (no window.SpeechRecognition)', () => {
      // JSDOM doesn't have SpeechRecognition
      expect(isSpeechRecognitionSupported()).toBe(false);
    });
  });

  describe('calculateSimilarity', () => {
    it('should return 1 for identical strings', () => {
      expect(calculateSimilarity('كتاب', 'كتاب')).toBe(1);
    });

    it('should return 1 for strings differing only by diacritics', () => {
      expect(calculateSimilarity('كِتَاب', 'كتاب')).toBe(1);
    });

    it('should return 0.9 when recognized contains expected', () => {
      expect(calculateSimilarity('كتاب', 'هذا كتاب')).toBe(0.9);
    });

    it('should return 0 for empty strings', () => {
      expect(calculateSimilarity('', 'كتاب')).toBe(0);
      expect(calculateSimilarity('كتاب', '')).toBe(0);
    });

    it('should handle null inputs', () => {
      expect(calculateSimilarity(null, 'كتاب')).toBe(0);
      expect(calculateSimilarity('كتاب', null)).toBe(0);
    });

    it('should return partial similarity for related words', () => {
      const similarity = calculateSimilarity('كتب', 'كتاب');
      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThan(1);
    });
  });
});
