import { describe, it, expect } from 'vitest';
import {
  hashDateString,
  getDailyIdiomId,
  pickDistractors,
  generateIdiomQuizQuestion,
  generateQuizBatch,
  calculateQuizScore,
  getLearningProgressSummary,
  canUnlockNextIdiomCategory,
  buildQuizDifficultyCurve,
  generateDailyIdiomChallenge,
} from '../idiomHelpers.js';
import { ARABIC_IDIOMS, getIdiomById } from '../../data/arabicIdioms.js';

// ============================================================
// hashDateString
// ============================================================

describe('hashDateString', () => {
  it('returns a positive integer', () => {
    const hash = hashDateString('2026-03-27');
    expect(hash).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(hash)).toBe(true);
  });

  it('is deterministic', () => {
    const a = hashDateString('2026-03-27');
    const b = hashDateString('2026-03-27');
    expect(a).toBe(b);
  });

  it('produces different hashes for different strings', () => {
    const a = hashDateString('2026-03-27');
    const b = hashDateString('2026-03-28');
    expect(a).not.toBe(b);
  });
});

// ============================================================
// getDailyIdiomId
// ============================================================

describe('getDailyIdiomId', () => {
  it('returns a valid idiom ID', () => {
    const id = getDailyIdiomId('2026-03-27', ARABIC_IDIOMS);
    expect(id).toBeTruthy();
    expect(getIdiomById(id)).not.toBeNull();
  });

  it('is deterministic (same date = same ID)', () => {
    const a = getDailyIdiomId('2026-03-27', ARABIC_IDIOMS);
    const b = getDailyIdiomId('2026-03-27', ARABIC_IDIOMS);
    expect(a).toBe(b);
  });

  it('returns different IDs for different dates', () => {
    const a = getDailyIdiomId('2026-03-27', ARABIC_IDIOMS);
    const b = getDailyIdiomId('2026-03-28', ARABIC_IDIOMS);
    expect(a).not.toBe(b);
  });

  it('returns null for empty array', () => {
    expect(getDailyIdiomId('2026-03-27', [])).toBeNull();
    expect(getDailyIdiomId('2026-03-27', null)).toBeNull();
  });

  it('covers all idioms over a long enough period', () => {
    const seen = new Set();
    for (let i = 0; i < 365; i++) {
      const date = `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`;
      seen.add(getDailyIdiomId(date, ARABIC_IDIOMS));
    }
    // Should hit a decent chunk of the idioms over a year
    expect(seen.size).toBeGreaterThan(30);
  });
});

// ============================================================
// pickDistractors
// ============================================================

describe('pickDistractors', () => {
  it('returns the requested number of distractors', () => {
    const target = ARABIC_IDIOMS[0];
    const distractors = pickDistractors(target, ARABIC_IDIOMS, 3, 42);
    expect(distractors).toHaveLength(3);
  });

  it('does not include the target idiom', () => {
    const target = ARABIC_IDIOMS[0];
    const distractors = pickDistractors(target, ARABIC_IDIOMS, 3, 42);
    for (const d of distractors) {
      expect(d.id).not.toBe(target.id);
    }
  });

  it('is deterministic with same seed', () => {
    const target = ARABIC_IDIOMS[5];
    const a = pickDistractors(target, ARABIC_IDIOMS, 3, 123);
    const b = pickDistractors(target, ARABIC_IDIOMS, 3, 123);
    expect(a.map((x) => x.id)).toEqual(b.map((x) => x.id));
  });
});

// ============================================================
// generateIdiomQuizQuestion
// ============================================================

describe('generateIdiomQuizQuestion', () => {
  it('generates idiom-to-meaning question', () => {
    const q = generateIdiomQuizQuestion(
      ARABIC_IDIOMS[0].id,
      'idiom-to-meaning',
      ARABIC_IDIOMS,
      42
    );
    expect(q).not.toBeNull();
    expect(q.questionType).toBe('idiom-to-meaning');
    expect(q.question).toBe(ARABIC_IDIOMS[0].arabic);
    expect(q.options).toHaveLength(4);
    expect(q.options).toContain(q.correctAnswer);
  });

  it('generates meaning-to-idiom question', () => {
    const q = generateIdiomQuizQuestion(
      ARABIC_IDIOMS[0].id,
      'meaning-to-idiom',
      ARABIC_IDIOMS,
      42
    );
    expect(q).not.toBeNull();
    expect(q.questionType).toBe('meaning-to-idiom');
    expect(q.question).toBe(ARABIC_IDIOMS[0].meaning);
    expect(q.options).toHaveLength(4);
    expect(q.options).toContain(q.correctAnswer);
  });

  it('returns null for non-existent idiom ID', () => {
    const q = generateIdiomQuizQuestion('nonexistent', 'idiom-to-meaning', ARABIC_IDIOMS, 42);
    expect(q).toBeNull();
  });

  it('includes explanation', () => {
    const q = generateIdiomQuizQuestion(
      ARABIC_IDIOMS[0].id,
      'idiom-to-meaning',
      ARABIC_IDIOMS,
      42
    );
    expect(q.explanation).toBeTruthy();
  });
});

// ============================================================
// generateQuizBatch
// ============================================================

describe('generateQuizBatch', () => {
  it('generates the requested number of questions', () => {
    const batch = generateQuizBatch(ARABIC_IDIOMS, 5, 42);
    expect(batch).toHaveLength(5);
  });

  it('each question has 4 options', () => {
    const batch = generateQuizBatch(ARABIC_IDIOMS, 3, 42);
    for (const q of batch) {
      expect(q.options).toHaveLength(4);
    }
  });

  it('filters by CEFR levels', () => {
    const batch = generateQuizBatch(ARABIC_IDIOMS, 5, 42, ['A1']);
    // All questions should be about A1 idioms
    for (const q of batch) {
      const idiom = getIdiomById(q.idiomId);
      expect(idiom.cefrLevel).toBe('A1');
    }
  });

  it('is deterministic with same seed', () => {
    const a = generateQuizBatch(ARABIC_IDIOMS, 3, 999);
    const b = generateQuizBatch(ARABIC_IDIOMS, 3, 999);
    expect(a.map((q) => q.idiomId)).toEqual(b.map((q) => q.idiomId));
  });
});

// ============================================================
// calculateQuizScore
// ============================================================

describe('calculateQuizScore', () => {
  it('returns 0 for incorrect answer', () => {
    const score = calculateQuizScore(false, 2000, 'A1');
    expect(score.total).toBe(0);
    expect(score.basePoints).toBe(0);
    expect(score.timeBonus).toBe(0);
  });

  it('returns base points for correct answer', () => {
    const score = calculateQuizScore(true, 15000, 'A1');
    expect(score.basePoints).toBe(10);
    expect(score.timeBonus).toBe(0); // > 10 seconds
    expect(score.total).toBe(10);
  });

  it('includes time bonus for fast answers', () => {
    const score = calculateQuizScore(true, 1000, 'A1');
    expect(score.timeBonus).toBeGreaterThan(0);
    expect(score.total).toBeGreaterThan(score.basePoints);
  });

  it('scales with difficulty level', () => {
    const a1 = calculateQuizScore(true, 15000, 'A1');
    const b2 = calculateQuizScore(true, 15000, 'B2');
    expect(b2.basePoints).toBeGreaterThan(a1.basePoints);
  });
});

// ============================================================
// getLearningProgressSummary
// ============================================================

describe('getLearningProgressSummary', () => {
  it('returns correct total learned count', () => {
    const learned = new Set(['idiom_wisdom_001', 'idiom_wisdom_002']);
    const summary = getLearningProgressSummary(learned, ARABIC_IDIOMS);
    expect(summary.totalLearned).toBe(2);
  });

  it('breaks down by category', () => {
    const learned = new Set(['idiom_wisdom_001', 'idiom_social_001']);
    const summary = getLearningProgressSummary(learned, ARABIC_IDIOMS);
    expect(summary.byCategory.wisdom).toBe(1);
    expect(summary.byCategory.social).toBe(1);
  });

  it('breaks down by CEFR level', () => {
    const learned = new Set(['idiom_wisdom_001']); // This is A2
    const summary = getLearningProgressSummary(learned, ARABIC_IDIOMS);
    expect(summary.byCefrLevel.A2).toBe(1);
  });

  it('identifies next milestone', () => {
    const learned = new Set();
    const summary = getLearningProgressSummary(learned, ARABIC_IDIOMS);
    expect(summary.nextMilestone.name).toBe('First Steps');
    expect(summary.nextMilestone.count).toBe(10);
  });

  it('handles array input as well as Set', () => {
    const learnedArr = ['idiom_wisdom_001'];
    const summary = getLearningProgressSummary(learnedArr, ARABIC_IDIOMS);
    expect(summary.totalLearned).toBe(1);
  });
});

// ============================================================
// canUnlockNextIdiomCategory
// ============================================================

describe('canUnlockNextIdiomCategory', () => {
  it('A1 is always unlocked', () => {
    expect(canUnlockNextIdiomCategory(0, 'A1')).toBe(true);
  });

  it('A2 requires 5 learned', () => {
    expect(canUnlockNextIdiomCategory(4, 'A2')).toBe(false);
    expect(canUnlockNextIdiomCategory(5, 'A2')).toBe(true);
  });

  it('B1 requires 15 learned', () => {
    expect(canUnlockNextIdiomCategory(14, 'B1')).toBe(false);
    expect(canUnlockNextIdiomCategory(15, 'B1')).toBe(true);
  });

  it('B2 requires 30 learned', () => {
    expect(canUnlockNextIdiomCategory(29, 'B2')).toBe(false);
    expect(canUnlockNextIdiomCategory(30, 'B2')).toBe(true);
  });

  it('returns false for invalid level', () => {
    expect(canUnlockNextIdiomCategory(100, 'C1')).toBe(false);
  });
});

// ============================================================
// buildQuizDifficultyCurve
// ============================================================

describe('buildQuizDifficultyCurve', () => {
  it('returns only A1 for beginner', () => {
    const curve = buildQuizDifficultyCurve(1, 'A1');
    expect(curve.cefrTargets).toEqual(['A1']);
  });

  it('returns A1-B2 for advanced', () => {
    const curve = buildQuizDifficultyCurve(50, 'B2');
    expect(curve.cefrTargets).toEqual(['A1', 'A2', 'B1', 'B2']);
  });

  it('has correct type distribution', () => {
    const curve = buildQuizDifficultyCurve(10, 'A2');
    expect(curve.typeDistribution['idiom-to-meaning']).toBe(0.6);
    expect(curve.typeDistribution['meaning-to-idiom']).toBe(0.4);
  });
});

// ============================================================
// generateDailyIdiomChallenge
// ============================================================

describe('generateDailyIdiomChallenge', () => {
  it('returns a valid challenge bundle', () => {
    const challenge = generateDailyIdiomChallenge('2026-03-27', ARABIC_IDIOMS);
    expect(challenge.type).toBe('daily_idiom');
    expect(challenge.idiomId).toBeTruthy();
    expect(challenge.questions).toHaveLength(3);
  });

  it('is deterministic for same date', () => {
    const a = generateDailyIdiomChallenge('2026-03-27', ARABIC_IDIOMS);
    const b = generateDailyIdiomChallenge('2026-03-27', ARABIC_IDIOMS);
    expect(a.idiomId).toBe(b.idiomId);
  });
});
