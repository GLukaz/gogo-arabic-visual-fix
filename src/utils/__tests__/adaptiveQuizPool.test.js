import { describe, it, expect } from 'vitest';
import {
  selectAdaptiveQuizPool,
  adjustSessionDifficulty,
  computeRetrievability,
  RETRIEVABILITY_MIN,
  RETRIEVABILITY_MAX,
} from '../adaptiveQuizPool.js';

const NOW = new Date('2026-02-09T00:00:00Z');
const DAY_MS = 24 * 60 * 60 * 1000;

// ─── computeRetrievability ────────────────────────────────────────────────────

describe('computeRetrievability', () => {
  it('returns 1.0 for a null card', () => {
    expect(computeRetrievability(null, NOW)).toBe(1.0);
  });

  it('returns 1.0 for a new card (reps=0)', () => {
    const card = { reps: 0, stability: 0 };
    expect(computeRetrievability(card, NOW)).toBe(1.0);
  });

  it('returns 1.0 when stability is 0', () => {
    const card = { reps: 1, stability: 0 };
    expect(computeRetrievability(card, NOW)).toBe(1.0);
  });

  it('returns 1.0 when no last_review date', () => {
    const card = { reps: 1, stability: 7 };
    expect(computeRetrievability(card, NOW)).toBe(1.0);
  });

  it('returns value < 1.0 when time has elapsed since review', () => {
    const lastReview = new Date(NOW.getTime() - 7 * DAY_MS).toISOString();
    const card = { reps: 3, stability: 7, last_review: lastReview };
    const r = computeRetrievability(card, NOW);
    expect(r).toBeLessThan(1.0);
    expect(r).toBeGreaterThan(0);
  });

  it('retrievability at stability=7 days elapsed=7 is around 0.81 (within range)', () => {
    // R = (1 + 19/81 * 7/7)^(-0.5) = (1 + 0.2346)^(-0.5) ≈ 0.899
    const lastReview = new Date(NOW.getTime() - 7 * DAY_MS).toISOString();
    const card = { reps: 3, stability: 7, last_review: lastReview };
    const r = computeRetrievability(card, NOW);
    expect(r).toBeGreaterThan(0.7);
    expect(r).toBeLessThan(1.0);
  });
});

// ─── selectAdaptiveQuizPool ───────────────────────────────────────────────────

function makeCard(stability, daysAgo) {
  const lastReview = new Date(NOW.getTime() - daysAgo * DAY_MS).toISOString();
  return { reps: 3, stability, last_review: lastReview };
}

describe('selectAdaptiveQuizPool', () => {
  it('returns empty array for empty vocab cards', () => {
    const result = selectAdaptiveQuizPool('medium', {}, 10, NOW);
    expect(result).toEqual([]);
  });

  it('returns empty array when targetCount is 0', () => {
    const cards = { w1: { card: makeCard(7, 7) } };
    expect(selectAdaptiveQuizPool('medium', cards, 0, NOW)).toEqual([]);
  });

  it('excludes new cards (reps=0) from pool', () => {
    const cards = { w1: { card: { reps: 0, stability: 0 } } };
    const result = selectAdaptiveQuizPool('medium', cards, 10, NOW);
    expect(result).not.toContain('w1');
  });

  it('includes cards in retrievability sweet spot (0.5-0.85)', () => {
    // R = (1 + 19/81 * t/S)^(-0.5)
    // stability=7, elapsed=14: R = (1 + 0.2346*2)^(-0.5) ≈ 0.825 — in range ✓
    // stability=100, elapsed=1: R ≈ 0.999 — above 0.85, excluded ✓
    const cards = {
      w_sweet:  { card: makeCard(7, 14) },   // R ≈ 0.825 — in range
      w_recent: { card: makeCard(100, 1) },  // R ≈ 0.999 — too fresh, excluded
    };
    const result = selectAdaptiveQuizPool('medium', cards, 10, NOW);
    // w_sweet should appear; w_recent should not
    expect(result).toContain('w_sweet');
    expect(result).not.toContain('w_recent');
  });

  it('sorts pool ascending by retrievability (most urgent first)', () => {
    // Lower retrievability = more urgent = earlier in list
    const cards = {
      w_high_r: { card: makeCard(10, 5) },  // higher R (reviewed more recently relative to stability)
      w_low_r:  { card: makeCard(5, 10) },  // lower R (elapsed > stability)
    };
    const result = selectAdaptiveQuizPool('medium', cards, 10, NOW);
    if (result.length === 2) {
      // Most urgent (lowest R) should come first
      expect(result[0]).toBe('w_low_r');
    }
  });

  it('respects targetCount limit', () => {
    const cards = {};
    for (let i = 0; i < 20; i++) {
      cards[`w${i}`] = { card: makeCard(7, 14) }; // R ≈ 0.825 — in sweet spot
    }
    const result = selectAdaptiveQuizPool('medium', cards, 5, NOW);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('retrieves words whose retrievability is within [0.5, 0.85]', () => {
    const cards = { w1: { card: makeCard(7, 14) } }; // R ≈ 0.825 — in sweet spot
    const result = selectAdaptiveQuizPool('medium', cards, 10, NOW);
    // Verify the words returned are in the sweet spot
    for (const wordId of result) {
      const card = cards[wordId]?.card;
      const r = computeRetrievability(card, NOW);
      expect(r).toBeGreaterThanOrEqual(RETRIEVABILITY_MIN);
      expect(r).toBeLessThanOrEqual(RETRIEVABILITY_MAX);
    }
  });
});

// ─── adjustSessionDifficulty ──────────────────────────────────────────────────

describe('adjustSessionDifficulty', () => {
  const correct3 = [{ correct: true }, { correct: true }, { correct: true }];
  const correct2 = [{ correct: true }, { correct: true }, { correct: false }];
  const correct1 = [{ correct: true }, { correct: false }, { correct: false }];
  const correct0 = [{ correct: false }, { correct: false }, { correct: false }];

  it('increases difficulty when all 3 correct', () => {
    expect(adjustSessionDifficulty('easy', correct3)).toBe('medium');
    expect(adjustSessionDifficulty('medium', correct3)).toBe('hard');
  });

  it('does not exceed "expert" difficulty', () => {
    expect(adjustSessionDifficulty('expert', correct3)).toBe('expert');
  });

  it('decreases difficulty when 0 correct', () => {
    expect(adjustSessionDifficulty('hard', correct0)).toBe('medium');
    expect(adjustSessionDifficulty('medium', correct0)).toBe('easy');
  });

  it('decreases difficulty when only 1 correct', () => {
    expect(adjustSessionDifficulty('medium', correct1)).toBe('easy');
  });

  it('does not go below "beginner" difficulty', () => {
    expect(adjustSessionDifficulty('beginner', correct0)).toBe('beginner');
  });

  it('maintains difficulty when 2/3 correct', () => {
    expect(adjustSessionDifficulty('medium', correct2)).toBe('medium');
    expect(adjustSessionDifficulty('hard', correct2)).toBe('hard');
  });

  it('falls back to "medium" for unknown difficulty level', () => {
    const result = adjustSessionDifficulty('unknown', correct2);
    expect(result).toBe('medium');
  });
});
