import { describe, it, expect } from 'vitest';
import {
  calculateQuranicCoverage,
  getQuranicCoverageByCategory,
} from '../quranicCoverage.js';

describe('quranicCoverage', () => {
  const mockVocab = [
    { id: 'quran_1', source: 'quran', category: 'verbs' },
    { id: 'quran_2', source: 'quran', category: 'verbs' },
    { id: 'quran_3', source: 'quran', category: 'nouns' },
    { id: 'quran_4', quranRef: 'al-fatiha:1', category: 'nouns' },
    { id: 'secular_1', source: 'msa', category: 'greetings' },
    { id: 'secular_2', category: 'numbers' },
  ];

  describe('calculateQuranicCoverage', () => {
    it('should return 0% when no words mastered', () => {
      const result = calculateQuranicCoverage({}, mockVocab);
      expect(result.mastered).toBe(0);
      expect(result.total).toBe(4); // 3 with source:quran + 1 with quranRef
      expect(result.percentage).toBe(0);
    });

    it('should count mastered words (stability ≥ 7)', () => {
      const fsrsCards = {
        quran_1: { card: { stability: 10 } },
        quran_2: { card: { stability: 3 } }, // Not mastered
        quran_3: { card: { stability: 7 } }, // Exactly threshold
      };
      const result = calculateQuranicCoverage(fsrsCards, mockVocab);
      expect(result.mastered).toBe(2); // quran_1 and quran_3
      expect(result.seen).toBe(3);
      expect(result.percentage).toBe(50); // 2/4
    });

    it('should return 100% when all Quranic words mastered', () => {
      const fsrsCards = {
        quran_1: { card: { stability: 30 } },
        quran_2: { card: { stability: 14 } },
        quran_3: { card: { stability: 7 } },
        quran_4: { card: { stability: 10 } },
      };
      const result = calculateQuranicCoverage(fsrsCards, mockVocab);
      expect(result.mastered).toBe(4);
      expect(result.percentage).toBe(100);
    });

    it('should handle empty vocabulary', () => {
      const result = calculateQuranicCoverage({}, []);
      expect(result.total).toBe(0);
      expect(result.percentage).toBe(0);
    });

    it('should not count secular words', () => {
      const fsrsCards = {
        secular_1: { card: { stability: 30 } },
        secular_2: { card: { stability: 30 } },
      };
      const result = calculateQuranicCoverage(fsrsCards, mockVocab);
      expect(result.mastered).toBe(0);
    });
  });

  describe('getQuranicCoverageByCategory', () => {
    it('should group coverage by category', () => {
      const fsrsCards = {
        quran_1: { card: { stability: 10 } },
      };
      const result = getQuranicCoverageByCategory(fsrsCards, mockVocab);
      expect(result.length).toBeGreaterThan(0);

      const verbs = result.find((c) => c.category === 'verbs');
      expect(verbs).toBeDefined();
      expect(verbs.mastered).toBe(1);
      expect(verbs.total).toBe(2);
    });

    it('should sort by total count descending', () => {
      const result = getQuranicCoverageByCategory({}, mockVocab);
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].total).toBeGreaterThanOrEqual(result[i].total);
      }
    });
  });
});
