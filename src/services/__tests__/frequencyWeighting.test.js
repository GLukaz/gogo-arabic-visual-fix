import { describe, it, expect } from 'vitest';
import {
  getFrequencyRank,
  getFrequencyTier,
  getTierWeight,
  getFrequencyWeightedNewCards,
  selectVocabByFrequencyTier,
} from '../frequencyWeighting.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

const makeWord = (id, frequency) => ({ id, frequency });

const makeState = (wordIds = []) => ({
  vocabulary: {
    fsrsCards: Object.fromEntries(wordIds.map((id) => [id, { card: {}, log: null }])),
  },
});

// Mock vocabulary for selectVocabByFrequencyTier injection
const MOCK_VOCAB = [
  makeWord('t1a', 9000),  // rank ~100   → tier 1 (freq >= 4000)
  makeWord('t1b', 5000),  // rank ~500   → tier 1 boundary
  makeWord('t2a', 3500),  // rank ~750   → tier 2 (rank 501-1000)
  makeWord('t2b', 3001),  // rank ~999   → tier 2
  makeWord('t3a', 2500),  // rank ~1250  → tier 3 (rank 1001-2000)
  makeWord('t3b', 2000),  // rank ~1500  → tier 3
  makeWord('t4a', 1000),  // rank ~2833  → tier 4 (rank 2001+)
  makeWord('t4b', 100),   // rank ~4300  → tier 4
];

// ─── getFrequencyRank ─────────────────────────────────────────────────────────

describe('getFrequencyRank', () => {
  it('returns rank 1 for the highest possible frequency (9999)', () => {
    expect(getFrequencyRank(makeWord('w', 9999))).toBe(1);
  });

  it('returns rank 500 for frequency 4000 (A1 lower boundary)', () => {
    expect(getFrequencyRank(makeWord('w', 4000))).toBe(500);
  });

  it('returns rank 501 for frequency 3999 (A2 upper boundary)', () => {
    expect(getFrequencyRank(makeWord('w', 3999))).toBe(501);
  });

  it('returns rank within tier-2 range (501-1000) for mid-A2 frequency', () => {
    const rank = getFrequencyRank(makeWord('w', 3000));
    expect(rank).toBeGreaterThan(500);
    expect(rank).toBeLessThanOrEqual(1000);
  });

  it('returns rank in tier-3 range (1001-2000) for low-A2 frequency', () => {
    const rank = getFrequencyRank(makeWord('w', 2500));
    expect(rank).toBeGreaterThan(1000);
    expect(rank).toBeLessThanOrEqual(2000);
  });

  it('returns rank > 2000 for B1-level word', () => {
    const rank = getFrequencyRank(makeWord('w', 1000));
    expect(rank).toBeGreaterThan(2000);
  });

  it('handles missing frequency field by returning a high rank', () => {
    const rank = getFrequencyRank({ id: 'w' });
    expect(rank).toBeGreaterThan(2000);
  });

  it('returns consistently higher ranks for lower frequency scores', () => {
    const rankHigh = getFrequencyRank(makeWord('w', 9000));
    const rankMid = getFrequencyRank(makeWord('w', 3000));
    const rankLow = getFrequencyRank(makeWord('w', 500));
    expect(rankHigh).toBeLessThan(rankMid);
    expect(rankMid).toBeLessThan(rankLow);
  });
});

// ─── getFrequencyTier ─────────────────────────────────────────────────────────

describe('getFrequencyTier', () => {
  it('returns tier 1 for rank 1', () => {
    expect(getFrequencyTier(1)).toBe(1);
  });

  it('returns tier 1 for rank 500 (boundary)', () => {
    expect(getFrequencyTier(500)).toBe(1);
  });

  it('returns tier 2 for rank 501', () => {
    expect(getFrequencyTier(501)).toBe(2);
  });

  it('returns tier 2 for rank 1000 (boundary)', () => {
    expect(getFrequencyTier(1000)).toBe(2);
  });

  it('returns tier 3 for rank 1001', () => {
    expect(getFrequencyTier(1001)).toBe(3);
  });

  it('returns tier 3 for rank 2000 (boundary)', () => {
    expect(getFrequencyTier(2000)).toBe(3);
  });

  it('returns tier 4 for rank 2001', () => {
    expect(getFrequencyTier(2001)).toBe(4);
  });

  it('returns tier 4 for very high rank', () => {
    expect(getFrequencyTier(9999)).toBe(4);
  });
});

// ─── getTierWeight ────────────────────────────────────────────────────────────

describe('getTierWeight', () => {
  it('returns 3 for tier 1', () => {
    expect(getTierWeight(1)).toBe(3);
  });

  it('returns 2 for tier 2', () => {
    expect(getTierWeight(2)).toBe(2);
  });

  it('returns 1.5 for tier 3', () => {
    expect(getTierWeight(3)).toBe(1.5);
  });

  it('returns 1 for tier 4', () => {
    expect(getTierWeight(4)).toBe(1);
  });

  it('defaults to 1 for unknown tier', () => {
    expect(getTierWeight(99)).toBe(1);
  });
});

// ─── getFrequencyWeightedNewCards ─────────────────────────────────────────────

describe('getFrequencyWeightedNewCards', () => {
  it('returns empty array for empty input', () => {
    expect(getFrequencyWeightedNewCards([], 5)).toHaveLength(0);
  });

  it('returns all cards when count >= pool size', () => {
    const pool = [makeWord('a', 9000), makeWord('b', 5000), makeWord('c', 3000)];
    const result = getFrequencyWeightedNewCards(pool, 10);
    expect(result).toHaveLength(3);
  });

  it('returns exactly count cards when pool is larger', () => {
    const pool = Array.from({ length: 50 }, (_, i) => makeWord(`w${i}`, 5000));
    const result = getFrequencyWeightedNewCards(pool, 10);
    expect(result).toHaveLength(10);
  });

  it('returns no duplicates', () => {
    const pool = Array.from({ length: 50 }, (_, i) => makeWord(`w${i}`, 5000));
    const result = getFrequencyWeightedNewCards(pool, 20);
    const ids = result.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('biases selection toward lower rank numbers (higher frequency words)', () => {
    // 20 high-frequency tier-1 words and 80 low-frequency tier-4 words
    const highFreq = Array.from({ length: 20 }, (_, i) => makeWord(`hi_${i}`, 9000));
    const lowFreq = Array.from({ length: 80 }, (_, i) => makeWord(`lo_${i}`, 500));
    const pool = [...highFreq, ...lowFreq];

    // Run many iterations to assess statistical bias
    let highFreqSelections = 0;
    const iterations = 300;
    for (let i = 0; i < iterations; i++) {
      const result = getFrequencyWeightedNewCards(pool, 10);
      highFreqSelections += result.filter((w) => w.id.startsWith('hi_')).length;
    }

    const highFreqRate = highFreqSelections / (iterations * 10);
    // Without weighting: ~20% expected. With 3x weight: ~43% expected.
    // Assert well above random baseline.
    expect(highFreqRate).toBeGreaterThan(0.28);
  });

  it('handles pool with count === 1', () => {
    const pool = Array.from({ length: 10 }, (_, i) => makeWord(`w${i}`, 5000));
    const result = getFrequencyWeightedNewCards(pool, 1);
    expect(result).toHaveLength(1);
  });
});

// ─── selectVocabByFrequencyTier ──────────────────────────────────────────────

describe('selectVocabByFrequencyTier', () => {
  it('returns an object with all four tier keys', () => {
    const state = makeState([]);
    const result = selectVocabByFrequencyTier(state, MOCK_VOCAB);
    expect(result).toHaveProperty('tier1');
    expect(result).toHaveProperty('tier2');
    expect(result).toHaveProperty('tier3');
    expect(result).toHaveProperty('tier4');
  });

  it('returns all zeros when no FSRS cards exist', () => {
    const state = makeState([]);
    const result = selectVocabByFrequencyTier(state, MOCK_VOCAB);
    expect(result.tier1).toBe(0);
    expect(result.tier2).toBe(0);
    expect(result.tier3).toBe(0);
    expect(result.tier4).toBe(0);
  });

  it('counts learned tier-1 words correctly', () => {
    const state = makeState(['t1a', 't1b']);
    const result = selectVocabByFrequencyTier(state, MOCK_VOCAB);
    expect(result.tier1).toBe(2);
  });

  it('counts learned tier-2 words correctly', () => {
    const state = makeState(['t2a', 't2b']);
    const result = selectVocabByFrequencyTier(state, MOCK_VOCAB);
    expect(result.tier2).toBe(2);
  });

  it('counts learned tier-4 words correctly', () => {
    const state = makeState(['t4a', 't4b']);
    const result = selectVocabByFrequencyTier(state, MOCK_VOCAB);
    expect(result.tier4).toBe(2);
  });

  it('handles word IDs in fsrsCards that are not in the vocabulary', () => {
    const state = makeState(['unknown_word_id']);
    const result = selectVocabByFrequencyTier(state, MOCK_VOCAB);
    // Unknown word silently skipped; all tiers should be zero
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBe(0);
  });

  it('correctly distributes mixed learned words across tiers', () => {
    // Learn one from each tier
    const state = makeState(['t1a', 't2a', 't3a', 't4a']);
    const result = selectVocabByFrequencyTier(state, MOCK_VOCAB);
    expect(result.tier1).toBe(1);
    expect(result.tier2).toBe(1);
    expect(result.tier3).toBe(1);
    expect(result.tier4).toBe(1);
  });
});
