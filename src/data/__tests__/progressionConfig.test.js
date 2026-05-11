import { describe, it, expect } from 'vitest';
import {
  XP_CURVE,
  VOCAB_PACING,
  UNLOCK_GATES,
  XP_REWARDS,
  SESSION_CONFIG,
} from '../progressionConfig.js';

// ============================================================
// XP CURVE
// ============================================================

describe('XP_CURVE', () => {
  it('has valid base constants', () => {
    expect(XP_CURVE.baseXp).toBe(100);
    expect(XP_CURVE.exponent).toBe(1.35);
    expect(XP_CURVE.maxLevel).toBe(50);
  });

  it('getXpForLevel returns positive integers for all levels', () => {
    for (let level = 1; level <= XP_CURVE.maxLevel; level++) {
      const xp = XP_CURVE.getXpForLevel(level);
      expect(xp).toBeGreaterThan(0);
      expect(Number.isInteger(xp)).toBe(true);
    }
  });

  it('XP curve is monotonically increasing (never gets easier to level up)', () => {
    let previous = 0;
    for (let level = 1; level <= XP_CURVE.maxLevel; level++) {
      const current = XP_CURVE.getXpForLevel(level);
      expect(current).toBeGreaterThanOrEqual(previous);
      previous = current;
    }
  });

  it('getXpForLevel returns 0 for level < 1', () => {
    expect(XP_CURVE.getXpForLevel(0)).toBe(0);
    expect(XP_CURVE.getXpForLevel(-5)).toBe(0);
  });

  it('getXpForLevel caps at maxLevel for levels above max', () => {
    const atMax = XP_CURVE.getXpForLevel(XP_CURVE.maxLevel);
    const beyondMax = XP_CURVE.getXpForLevel(XP_CURVE.maxLevel + 10);
    expect(beyondMax).toBe(atMax);
  });

  it('getTotalXpToLevel returns 0 for level 1', () => {
    expect(XP_CURVE.getTotalXpToLevel(1)).toBe(0);
  });

  it('getTotalXpToLevel is cumulative sum of per-level XP', () => {
    let expected = 0;
    for (let level = 1; level <= 10; level++) {
      expect(XP_CURVE.getTotalXpToLevel(level)).toBe(expected);
      expected += XP_CURVE.getXpForLevel(level);
    }
  });

  it('getTotalXpToLevel is monotonically increasing', () => {
    let previous = 0;
    for (let level = 1; level <= XP_CURVE.maxLevel; level++) {
      const total = XP_CURVE.getTotalXpToLevel(level);
      expect(total).toBeGreaterThanOrEqual(previous);
      previous = total;
    }
  });

  it('level 1 requires a reasonable amount of XP (100)', () => {
    expect(XP_CURVE.getXpForLevel(1)).toBe(100);
  });
});

// ============================================================
// VOCAB PACING
// ============================================================

describe('VOCAB_PACING', () => {
  it('has 5 proficiency tiers', () => {
    const tiers = Object.keys(VOCAB_PACING.newWordsPerDay);
    expect(tiers).toHaveLength(5);
    expect(tiers).toEqual(['beginner', 'elementary', 'intermediate', 'advanced', 'expert']);
  });

  it('new words per day are between 5 and 15 (research-based range)', () => {
    for (const [, count] of Object.entries(VOCAB_PACING.newWordsPerDay)) {
      expect(count).toBeGreaterThanOrEqual(5);
      expect(count).toBeLessThanOrEqual(15);
    }
  });

  it('new words per day increases with proficiency tier', () => {
    const tiers = ['beginner', 'elementary', 'intermediate', 'advanced', 'expert'];
    for (let i = 1; i < tiers.length; i++) {
      expect(VOCAB_PACING.newWordsPerDay[tiers[i]])
        .toBeGreaterThanOrEqual(VOCAB_PACING.newWordsPerDay[tiers[i - 1]]);
    }
  });

  it('tier ranges cover all levels 1-50 without gaps', () => {
    const covered = new Set();
    for (const [, [min, max]] of Object.entries(VOCAB_PACING.tierRanges)) {
      for (let level = min; level <= max; level++) {
        covered.add(level);
      }
    }
    for (let level = 1; level <= 50; level++) {
      expect(covered.has(level)).toBe(true);
    }
  });

  it('tier ranges do not overlap', () => {
    const ranges = Object.values(VOCAB_PACING.tierRanges);
    for (let i = 0; i < ranges.length; i++) {
      for (let j = i + 1; j < ranges.length; j++) {
        const [aMin, aMax] = ranges[i];
        const [bMin, bMax] = ranges[j];
        const overlaps = aMin <= bMax && bMin <= aMax;
        expect(overlaps).toBe(false);
      }
    }
  });

  it('mastery threshold is between 0 and 1', () => {
    expect(VOCAB_PACING.masteryThreshold).toBeGreaterThan(0);
    expect(VOCAB_PACING.masteryThreshold).toBeLessThanOrEqual(1);
  });

  it('maxReviewsPerSession is a reasonable number', () => {
    expect(VOCAB_PACING.maxReviewsPerSession).toBeGreaterThanOrEqual(10);
    expect(VOCAB_PACING.maxReviewsPerSession).toBeLessThanOrEqual(50);
  });
});

// ============================================================
// UNLOCK GATES
// ============================================================

describe('UNLOCK_GATES', () => {
  it('all quiz types have level >= 1', () => {
    for (const [_type, level] of Object.entries(UNLOCK_GATES.quizTypes)) {
      expect(level).toBeGreaterThanOrEqual(1);
    }
  });

  it('all features have level >= 1', () => {
    for (const [_feature, level] of Object.entries(UNLOCK_GATES.features)) {
      expect(level).toBeGreaterThanOrEqual(1);
    }
  });

  it('every feature has a description', () => {
    for (const feature of Object.keys(UNLOCK_GATES.features)) {
      expect(UNLOCK_GATES.featureDescriptions[feature]).toBeDefined();
      expect(typeof UNLOCK_GATES.featureDescriptions[feature]).toBe('string');
      expect(UNLOCK_GATES.featureDescriptions[feature].length).toBeGreaterThan(0);
    }
  });

  it('every feature has English and Arabic names', () => {
    for (const feature of Object.keys(UNLOCK_GATES.features)) {
      expect(UNLOCK_GATES.featureNames[feature]).toBeDefined();
      expect(UNLOCK_GATES.featureNames[feature].en).toBeTruthy();
      expect(UNLOCK_GATES.featureNames[feature].ar).toBeTruthy();
    }
  });

  it('CEFR gates are in ascending order of difficulty', () => {
    const levels = ['A1', 'A2', 'B1', 'B2'];
    for (let i = 1; i < levels.length; i++) {
      const prev = UNLOCK_GATES.cefrGates[levels[i - 1]];
      const curr = UNLOCK_GATES.cefrGates[levels[i]];
      expect(curr.grammarLessons).toBeGreaterThanOrEqual(prev.grammarLessons);
      expect(curr.vocabSize).toBeGreaterThanOrEqual(prev.vocabSize);
    }
  });

  it('CEFR gates have all 4 levels', () => {
    expect(Object.keys(UNLOCK_GATES.cefrGates)).toEqual(['A1', 'A2', 'B1', 'B2']);
  });

  it('some basic quiz types are available at level 1', () => {
    const level1Types = Object.entries(UNLOCK_GATES.quizTypes)
      .filter(([, level]) => level === 1)
      .map(([type]) => type);
    expect(level1Types.length).toBeGreaterThanOrEqual(3);
  });
});

// ============================================================
// XP REWARDS
// ============================================================

describe('XP_REWARDS', () => {
  it('all reward values are positive numbers', () => {
    function checkPositive(obj, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof value === 'object') {
          checkPositive(value, fullPath);
        } else {
          expect(value).toBeGreaterThan(0);
        }
      }
    }
    checkPositive(XP_REWARDS);
  });

  it('has all expected activity categories', () => {
    const expected = [
      'quiz', 'grammar', 'quest', 'dailyChallenge', 'reading',
      'writing', 'conversation', 'miniGame', 'battle', 'exploration', 'vocabulary',
    ];
    for (const cat of expected) {
      expect(XP_REWARDS[cat]).toBeDefined();
    }
  });

  it('main quest rewards more than side quest', () => {
    expect(XP_REWARDS.quest.mainQuest).toBeGreaterThan(XP_REWARDS.quest.complete);
  });

  it('perfect victory rewards more than regular victory', () => {
    expect(XP_REWARDS.battle.perfectVictory).toBeGreaterThan(XP_REWARDS.battle.victory);
  });
});

// ============================================================
// SESSION CONFIG
// ============================================================

describe('SESSION_CONFIG', () => {
  it('optimal duration is less than max duration', () => {
    expect(SESSION_CONFIG.optimalDurationMinutes).toBeLessThan(SESSION_CONFIG.maxDurationMinutes);
  });

  it('review-to-new ratio is between 0.5 and 0.9', () => {
    expect(SESSION_CONFIG.reviewToNewRatio).toBeGreaterThanOrEqual(0.5);
    expect(SESSION_CONFIG.reviewToNewRatio).toBeLessThanOrEqual(0.9);
  });

  it('warmup and cooldown questions are small numbers', () => {
    expect(SESSION_CONFIG.warmupQuestions).toBeGreaterThanOrEqual(1);
    expect(SESSION_CONFIG.warmupQuestions).toBeLessThanOrEqual(10);
    expect(SESSION_CONFIG.cooldownQuestions).toBeGreaterThanOrEqual(1);
    expect(SESSION_CONFIG.cooldownQuestions).toBeLessThanOrEqual(10);
  });

  it('break interval is between optimal and max duration', () => {
    expect(SESSION_CONFIG.breakIntervalMinutes).toBeGreaterThanOrEqual(SESSION_CONFIG.optimalDurationMinutes);
    expect(SESSION_CONFIG.breakIntervalMinutes).toBeLessThanOrEqual(SESSION_CONFIG.maxDurationMinutes);
  });
});
