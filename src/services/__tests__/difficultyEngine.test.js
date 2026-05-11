import { describe, it, expect } from 'vitest';
import {
  DIFFICULTY_LEVELS,
  TARGET_SUCCESS_RATE,
  calculateDifficultyLevel,
  getDistractorDifficulty,
  calculateFatigueFactor,
  shouldSuggestBreak,
  getRecommendedSessionLength,
  getNewWordRate,
  rankQuizTypesForDifficulty,
} from '../difficultyEngine.js';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

describe('DIFFICULTY_LEVELS', () => {
  it('has 5 ordered levels', () => {
    expect(DIFFICULTY_LEVELS).toEqual(['beginner', 'easy', 'medium', 'hard', 'expert']);
  });
});

describe('TARGET_SUCCESS_RATE', () => {
  it('has min 0.70, max 0.85, optimal 0.775', () => {
    expect(TARGET_SUCCESS_RATE.min).toBe(0.70);
    expect(TARGET_SUCCESS_RATE.max).toBe(0.85);
    expect(TARGET_SUCCESS_RATE.optimal).toBe(0.775);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateDifficultyLevel
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateDifficultyLevel', () => {
  /** Helper to build N results with a given correct ratio. */
  function _buildResults(total, correctRatio) {
    const correctCount = Math.round(total * correctRatio);
    const results = [];
    // Interleave correct and incorrect for realistic EMA
    for (let i = 0; i < total; i++) {
      results.push({
        correct: i < correctCount,
        timeMs: 2000,
        type: 'ar-to-en',
      });
    }
    return results;
  }

  /** Helper: all correct results */
  function allCorrect(n) {
    return Array.from({ length: n }, () => ({ correct: true, timeMs: 2000, type: 'ar-to-en' }));
  }

  /** Helper: all incorrect results */
  function allIncorrect(n) {
    return Array.from({ length: n }, () => ({ correct: false, timeMs: 2000, type: 'ar-to-en' }));
  }

  it('returns current level with empty results', () => {
    const result = calculateDifficultyLevel([], 'medium');
    expect(result.level).toBe('medium');
    expect(result.successRate).toBe(0);
    expect(result.direction).toBe('maintain');
  });

  it('returns medium for null/undefined results', () => {
    expect(calculateDifficultyLevel(null).level).toBe('medium');
    expect(calculateDifficultyLevel(undefined).level).toBe('medium');
  });

  it('increases difficulty when success rate > 85%', () => {
    const results = allCorrect(20);
    const result = calculateDifficultyLevel(results, 'medium');
    expect(result.level).toBe('hard');
    expect(result.direction).toBe('up');
    expect(result.successRate).toBeGreaterThan(0.85);
  });

  it('decreases difficulty when success rate < 70%', () => {
    const results = allIncorrect(20);
    const result = calculateDifficultyLevel(results, 'medium');
    expect(result.level).toBe('easy');
    expect(result.direction).toBe('down');
    expect(result.successRate).toBeLessThan(0.70);
  });

  it('maintains difficulty when success rate is in the 70-85% zone', () => {
    // Alternating pattern that keeps EMA in the 70-85% zone:
    // Correct, correct, correct, incorrect repeating gives ~75% simple average,
    // but EMA recency-weights. Use a pattern where recent results are mixed enough.
    const results = [];
    for (let i = 0; i < 20; i++) {
      // 4 correct then 1 incorrect repeating — high enough for EMA to stay in zone
      results.push({ correct: i % 5 !== 4, timeMs: 2000, type: 'ar-to-en' });
    }
    const result = calculateDifficultyLevel(results, 'medium');
    expect(result.successRate).toBeGreaterThanOrEqual(0.70);
    expect(result.successRate).toBeLessThanOrEqual(0.85);
    expect(result.level).toBe('medium');
    expect(result.direction).toBe('maintain');
  });

  it('never jumps more than 1 level up', () => {
    const results = allCorrect(20);
    const result = calculateDifficultyLevel(results, 'beginner');
    expect(result.level).toBe('easy'); // beginner -> easy (not medium or higher)
  });

  it('never jumps more than 1 level down', () => {
    const results = allIncorrect(20);
    const result = calculateDifficultyLevel(results, 'expert');
    expect(result.level).toBe('hard'); // expert -> hard (not medium or lower)
  });

  it('does not go above expert', () => {
    const results = allCorrect(20);
    const result = calculateDifficultyLevel(results, 'expert');
    expect(result.level).toBe('expert');
    expect(result.direction).toBe('maintain');
  });

  it('does not go below beginner', () => {
    const results = allIncorrect(20);
    const result = calculateDifficultyLevel(results, 'beginner');
    expect(result.level).toBe('beginner');
    expect(result.direction).toBe('maintain');
  });

  it('respects custom window size', () => {
    const results = allCorrect(5);
    const result = calculateDifficultyLevel(results, 'easy', 5);
    expect(result.level).toBe('medium');
    expect(result.direction).toBe('up');
  });

  it('uses only the last windowSize results', () => {
    // First 20 all wrong, last 20 all correct
    const results = [...allIncorrect(20), ...allCorrect(20)];
    const result = calculateDifficultyLevel(results, 'medium', 20);
    // EMA over last 20 (all correct) should push up
    expect(result.successRate).toBeGreaterThan(0.85);
    expect(result.direction).toBe('up');
  });

  it('handles single result', () => {
    const result = calculateDifficultyLevel([{ correct: true, timeMs: 1000, type: 'ar-to-en' }], 'medium');
    expect(result.successRate).toBe(1);
    expect(result.direction).toBe('up');
  });

  it('defaults to medium when currentLevel is not provided', () => {
    const result = calculateDifficultyLevel([]);
    expect(result.level).toBe('medium');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getDistractorDifficulty
// ─────────────────────────────────────────────────────────────────────────────

describe('getDistractorDifficulty', () => {
  it('returns 0.15 for beginner', () => {
    expect(getDistractorDifficulty('beginner')).toBe(0.15);
  });

  it('returns 0.30 for easy', () => {
    expect(getDistractorDifficulty('easy')).toBe(0.30);
  });

  it('returns 0.50 for medium', () => {
    expect(getDistractorDifficulty('medium')).toBe(0.50);
  });

  it('returns 0.70 for hard', () => {
    expect(getDistractorDifficulty('hard')).toBe(0.70);
  });

  it('returns 0.90 for expert', () => {
    expect(getDistractorDifficulty('expert')).toBe(0.90);
  });

  it('returns 0.50 for unknown level', () => {
    expect(getDistractorDifficulty('nightmare')).toBe(0.50);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateFatigueFactor
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateFatigueFactor', () => {
  it('returns 1.0 for fresh session (0 min, 0 questions)', () => {
    const { factor, fatigued } = calculateFatigueFactor(0, 0);
    expect(factor).toBe(1);
    expect(fatigued).toBe(false);
  });

  it('returns 1.0 at exactly 20 minutes', () => {
    const { factor, fatigued } = calculateFatigueFactor(20, 0);
    expect(factor).toBe(1);
    expect(fatigued).toBe(false);
  });

  it('starts reducing after 20 minutes', () => {
    const { factor, fatigued } = calculateFatigueFactor(25, 0);
    expect(factor).toBeLessThan(1);
    expect(factor).toBeGreaterThan(0.8);
    expect(fatigued).toBe(true);
  });

  it('returns 1.0 at exactly 30 questions', () => {
    const { factor } = calculateFatigueFactor(0, 30);
    expect(factor).toBe(1);
  });

  it('starts reducing after 30 questions', () => {
    const { factor, fatigued } = calculateFatigueFactor(0, 40);
    expect(factor).toBeLessThan(1);
    expect(fatigued).toBe(true);
  });

  it('minimum factor is 0.80 (max 20% reduction)', () => {
    const { factor } = calculateFatigueFactor(100, 100);
    expect(factor).toBeGreaterThanOrEqual(0.80);
  });

  it('handles negative values gracefully', () => {
    const { factor } = calculateFatigueFactor(-5, -10);
    expect(factor).toBe(1);
  });

  it('at 40 minutes (max time fatigue), factor is 0.85', () => {
    const { factor } = calculateFatigueFactor(40, 0);
    expect(factor).toBe(0.85);
  });

  it('at 60 questions (max question fatigue), factor is 0.90', () => {
    const { factor } = calculateFatigueFactor(0, 60);
    expect(factor).toBe(0.90);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// shouldSuggestBreak
// ─────────────────────────────────────────────────────────────────────────────

describe('shouldSuggestBreak', () => {
  it('does not suggest break for fresh session', () => {
    const { suggest } = shouldSuggestBreak(0, 0, 0);
    expect(suggest).toBe(false);
  });

  it('suggests break after 30 minutes', () => {
    const { suggest, reason } = shouldSuggestBreak(31, 0, 0);
    expect(suggest).toBe(true);
    expect(reason).toBe('time');
  });

  it('does not suggest break at exactly 30 minutes', () => {
    const { suggest } = shouldSuggestBreak(30, 0, 0);
    expect(suggest).toBe(false);
  });

  it('suggests break after 50 questions', () => {
    const { suggest, reason } = shouldSuggestBreak(0, 51, 0);
    expect(suggest).toBe(true);
    expect(reason).toBe('questions');
  });

  it('does not suggest break at exactly 50 questions', () => {
    const { suggest } = shouldSuggestBreak(0, 50, 0);
    expect(suggest).toBe(false);
  });

  it('suggests break after 5 consecutive errors', () => {
    const { suggest, reason } = shouldSuggestBreak(0, 0, 5);
    expect(suggest).toBe(true);
    expect(reason).toBe('errors');
  });

  it('does not suggest break at 4 consecutive errors', () => {
    const { suggest } = shouldSuggestBreak(0, 0, 4);
    expect(suggest).toBe(false);
  });

  it('time takes priority over questions', () => {
    const { reason } = shouldSuggestBreak(31, 51, 0);
    expect(reason).toBe('time');
  });

  it('returns null reason when no break needed', () => {
    const { reason } = shouldSuggestBreak(10, 20, 2);
    expect(reason).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getRecommendedSessionLength
// ─────────────────────────────────────────────────────────────────────────────

describe('getRecommendedSessionLength', () => {
  it('returns 20 for new players (no history)', () => {
    expect(getRecommendedSessionLength([])).toBe(20);
    expect(getRecommendedSessionLength(null)).toBe(20);
    expect(getRecommendedSessionLength(undefined)).toBe(20);
  });

  it('averages last 7 sessions', () => {
    const sessions = Array.from({ length: 7 }, () => ({ duration: 30 }));
    expect(getRecommendedSessionLength(sessions)).toBe(30);
  });

  it('only uses last 7 sessions', () => {
    const sessions = [
      ...Array.from({ length: 5 }, () => ({ duration: 10 })),
      ...Array.from({ length: 7 }, () => ({ duration: 40 })),
    ];
    expect(getRecommendedSessionLength(sessions)).toBe(40);
  });

  it('clamps minimum to 10 minutes', () => {
    const sessions = [{ duration: 3 }, { duration: 5 }];
    expect(getRecommendedSessionLength(sessions)).toBe(10);
  });

  it('clamps maximum to 45 minutes', () => {
    const sessions = [{ duration: 60 }, { duration: 90 }];
    expect(getRecommendedSessionLength(sessions)).toBe(45);
  });

  it('ignores sessions with invalid durations', () => {
    const sessions = [{ duration: 25 }, { duration: null }, { duration: 35 }];
    expect(getRecommendedSessionLength(sessions)).toBe(30); // avg of 25 and 35
  });

  it('returns 20 if all durations are invalid', () => {
    const sessions = [{ duration: -1 }, { duration: 0 }, { duration: null }];
    expect(getRecommendedSessionLength(sessions)).toBe(20);
  });

  it('rounds to nearest integer', () => {
    const sessions = [{ duration: 15 }, { duration: 16 }];
    expect(getRecommendedSessionLength(sessions)).toBe(16); // 15.5 rounds to 16
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getNewWordRate
// ─────────────────────────────────────────────────────────────────────────────

describe('getNewWordRate', () => {
  it('returns high rate for mastery > 80%', () => {
    const rate = getNewWordRate(0.90, 1);
    expect(rate.min).toBe(5);
    expect(rate.max).toBe(8);
    expect(rate.recommended).toBe(6);
  });

  it('returns medium rate for mastery 60-80%', () => {
    const rate = getNewWordRate(0.70, 1);
    expect(rate.min).toBe(3);
    expect(rate.max).toBe(5);
    expect(rate.recommended).toBe(4);
  });

  it('returns low rate for mastery < 60%', () => {
    const rate = getNewWordRate(0.40, 1);
    expect(rate.min).toBe(1);
    expect(rate.max).toBe(2);
    expect(rate.recommended).toBe(1);
  });

  it('adds level bonus at level 5+', () => {
    const rate = getNewWordRate(0.90, 5);
    expect(rate.min).toBe(6); // 5 + 1 levelBonus
    expect(rate.max).toBe(9);
  });

  it('caps level bonus at 2', () => {
    const rate = getNewWordRate(0.90, 20);
    expect(rate.min).toBe(7); // 5 + 2 maxBonus
    expect(rate.max).toBe(10);
  });

  it('handles NaN mastery', () => {
    const rate = getNewWordRate(NaN, 1);
    // NaN defaults to 0.5, which is < 60% => low rate
    expect(rate.recommended).toBeGreaterThanOrEqual(1);
  });

  it('handles mastery > 1 (clamps to 1)', () => {
    const rate = getNewWordRate(1.5, 1);
    expect(rate.min).toBe(5); // Treated as > 80%
  });

  it('handles mastery < 0 (clamps to 0)', () => {
    const rate = getNewWordRate(-0.5, 1);
    expect(rate.min).toBe(1); // Low mastery
  });

  it('handles invalid level', () => {
    const rate = getNewWordRate(0.90, -1);
    expect(rate.min).toBeGreaterThanOrEqual(5);
  });

  it('exact 80% boundary falls into medium tier', () => {
    const rate = getNewWordRate(0.80, 1);
    expect(rate.min).toBe(3); // medium tier (not high)
  });

  it('above 80% (0.81) falls into high tier', () => {
    const rate = getNewWordRate(0.81, 1);
    expect(rate.min).toBe(5); // high tier
  });

  it('exact 60% boundary falls into medium tier', () => {
    const rate = getNewWordRate(0.60, 1);
    expect(rate.min).toBe(3); // medium tier (not low)
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// rankQuizTypesForDifficulty
// ─────────────────────────────────────────────────────────────────────────────

describe('rankQuizTypesForDifficulty', () => {
  it('returns beginner types first for beginner difficulty', () => {
    const ranked = rankQuizTypesForDifficulty('beginner', 10, 'B2');
    // First items should be beginner tier types
    expect(ranked[0]).toBe('ar-to-en');
    expect(ranked[1]).toBe('picture-word');
    expect(ranked[2]).toBe('match');
  });

  it('returns expert types first for expert difficulty', () => {
    const ranked = rankQuizTypesForDifficulty('expert', 10, 'B2');
    expect(ranked[0]).toBe('DialectIdentify');
    expect(ranked[1]).toBe('RootExpand');
    expect(ranked[2]).toBe('CulturalContext');
  });

  it('filters out types above player level', () => {
    const ranked = rankQuizTypesForDifficulty('medium', 1, null);
    // sentence-build requires level 5, should not be included
    expect(ranked).not.toContain('sentence-build');
    // ar-to-en requires level 1, should be included
    expect(ranked).toContain('ar-to-en');
  });

  it('filters out types above player CEFR level', () => {
    const ranked = rankQuizTypesForDifficulty('expert', 10, 'A1');
    // Expert types require B2, should be filtered
    expect(ranked).not.toContain('DialectIdentify');
    expect(ranked).not.toContain('RootExpand');
  });

  it('returns empty array for invalid difficulty level', () => {
    const ranked = rankQuizTypesForDifficulty('nightmare', 10, 'B2');
    expect(ranked).toEqual([]);
  });

  it('does not include duplicate types', () => {
    const ranked = rankQuizTypesForDifficulty('medium', 10, 'B2');
    const unique = new Set(ranked);
    expect(ranked.length).toBe(unique.size);
  });

  it('includes all eligible types', () => {
    const ranked = rankQuizTypesForDifficulty('medium', 10, 'B2');
    // Should have at least the beginner + easy + medium types
    expect(ranked.length).toBeGreaterThan(5);
  });

  it('null CEFR bypasses CEFR gate', () => {
    const ranked = rankQuizTypesForDifficulty('expert', 10, null);
    // null CEFR means no gate, so expert types should be included
    expect(ranked).toContain('DialectIdentify');
  });

  it('adjacent tiers are included after the target tier', () => {
    const ranked = rankQuizTypesForDifficulty('medium', 10, 'B2');
    const mediumIndex = ranked.indexOf('conjugation'); // medium tier
    const easyIndex = ranked.indexOf('en-to-ar'); // easy tier
    const hardIndex = ranked.indexOf('WordOrder'); // hard tier
    // Medium tier types should come before easy/hard tier types
    if (mediumIndex !== -1 && easyIndex !== -1) {
      expect(mediumIndex).toBeLessThan(easyIndex);
    }
    if (mediumIndex !== -1 && hardIndex !== -1) {
      expect(mediumIndex).toBeLessThan(hardIndex);
    }
  });
});
