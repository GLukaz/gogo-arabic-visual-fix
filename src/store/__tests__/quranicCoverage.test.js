/**
 * quranicCoverage.test.js
 * WIRE-013 — quranicCoverage selectors wired into vocabulary stats
 */
import { describe, it, expect } from 'vitest';
import { calculateQuranicCoverage, getQuranicCoverageByCategory } from '../../services/quranicCoverage.js';

const mockVocab = [
  { id: 'w1', source: 'quran', category: 'prayers', english: 'mercy' },
  { id: 'w2', quranRef: 'Al-Fatiha:2', category: 'prayers', english: 'lord' },
  { id: 'w3', source: 'quran', category: 'attributes', english: 'compassionate' },
  { id: 'w4', source: 'msa', category: 'greetings', english: 'hello' }, // non-Quranic
];

describe('calculateQuranicCoverage', () => {
  it('returns zero counts when no fsrsCards provided', () => {
    const result = calculateQuranicCoverage({}, mockVocab);
    expect(result.total).toBe(3); // only Quranic words
    expect(result.mastered).toBe(0);
    expect(result.seen).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('counts mastered words with stability >= 7', () => {
    const fsrsCards = {
      w1: { card: { stability: 10 } },
      w2: { card: { stability: 3 } }, // seen but not mastered
      w3: { card: { stability: 7 } }, // exactly at threshold
    };
    const result = calculateQuranicCoverage(fsrsCards, mockVocab);
    expect(result.mastered).toBe(2); // w1 and w3
    expect(result.seen).toBe(3);
    expect(result.percentage).toBe(67); // 2/3 rounded
  });

  it('returns 0 total when no Quranic words in vocab', () => {
    const nonQuranic = [{ id: 'x1', source: 'msa', english: 'hello' }];
    const result = calculateQuranicCoverage({}, nonQuranic);
    expect(result.total).toBe(0);
    expect(result.percentage).toBe(0);
  });
});

describe('getQuranicCoverageByCategory', () => {
  it('groups Quranic words by category', () => {
    const result = getQuranicCoverageByCategory({}, mockVocab);
    const cats = result.map((c) => c.category);
    expect(cats).toContain('prayers');
    expect(cats).toContain('attributes');
    expect(cats).not.toContain('greetings'); // non-Quranic excluded
  });

  it('calculates per-category mastered count', () => {
    const fsrsCards = {
      w1: { card: { stability: 10 } },
      w2: { card: { stability: 2 } },
    };
    const result = getQuranicCoverageByCategory(fsrsCards, mockVocab);
    const prayers = result.find((c) => c.category === 'prayers');
    expect(prayers.total).toBe(2);
    expect(prayers.mastered).toBe(1);
    expect(prayers.percentage).toBe(50);
  });

  it('sorts categories by total descending', () => {
    const result = getQuranicCoverageByCategory({}, mockVocab);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].total).toBeGreaterThanOrEqual(result[i].total);
    }
  });
});
