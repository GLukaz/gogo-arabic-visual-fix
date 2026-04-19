import { describe, it, expect } from 'vitest';
import {
  calculateLevel,
  getXpProgress,
  getTierForLevel,
  getVocabPacingForLevel,
  isFeatureUnlocked,
  isQuizTypeUnlocked,
  getUnlockedFeatures,
  getUnlockedQuizTypes,
  getNextUnlock,
  getUpcomingUnlocks,
  getFeaturesUnlockedAtLevel,
  getSessionPlan,
  calculateXpReward,
  estimateCefrLevel,
  getCefrProgress,
  getProgressReport,
} from '../progressionService.js';

import { XP_CURVE, UNLOCK_GATES } from '../../data/progressionConfig.js';

// ============================================================
// calculateLevel
// ============================================================

describe('calculateLevel', () => {
  it('returns 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('returns 1 for negative XP', () => {
    expect(calculateLevel(-100)).toBe(1);
  });

  it('returns 1 for XP less than level 1 requirement', () => {
    expect(calculateLevel(50)).toBe(1);
  });

  it('returns 2 when XP exactly meets level 1 threshold', () => {
    const xpForLevel1 = XP_CURVE.getXpForLevel(1);
    expect(calculateLevel(xpForLevel1)).toBe(2);
  });

  it('returns correct level for cumulative XP across multiple levels', () => {
    // Exactly enough XP for levels 1+2
    const xp = XP_CURVE.getXpForLevel(1) + XP_CURVE.getXpForLevel(2);
    expect(calculateLevel(xp)).toBe(3);
  });

  it('caps at maxLevel for very large XP', () => {
    expect(calculateLevel(999999999)).toBe(XP_CURVE.maxLevel);
  });

  it('level increases monotonically as XP increases', () => {
    let prevLevel = 0;
    for (let xp = 0; xp <= 10000; xp += 50) {
      const level = calculateLevel(xp);
      expect(level).toBeGreaterThanOrEqual(prevLevel);
      prevLevel = level;
    }
  });
});

// ============================================================
// getXpProgress
// ============================================================

describe('getXpProgress', () => {
  it('returns level 1 at 0% for 0 XP', () => {
    const progress = getXpProgress(0);
    expect(progress.level).toBe(1);
    expect(progress.currentXp).toBe(0);
    expect(progress.percentage).toBe(0);
    expect(progress.totalXp).toBe(0);
  });

  it('returns correct xpToNext for level 1', () => {
    const progress = getXpProgress(0);
    expect(progress.xpToNext).toBe(XP_CURVE.getXpForLevel(1));
  });

  it('calculates percentage correctly at 50% through a level', () => {
    const xpForLevel1 = XP_CURVE.getXpForLevel(1);
    const halfXp = Math.floor(xpForLevel1 / 2);
    const progress = getXpProgress(halfXp);
    expect(progress.level).toBe(1);
    expect(progress.percentage).toBe(Math.round((halfXp / xpForLevel1) * 100));
  });

  it('returns level 2 when XP equals level 1 threshold', () => {
    const xpForLevel1 = XP_CURVE.getXpForLevel(1);
    const progress = getXpProgress(xpForLevel1);
    expect(progress.level).toBe(2);
    expect(progress.currentXp).toBe(0);
  });

  it('returns 100% at max level', () => {
    const progress = getXpProgress(999999999);
    expect(progress.level).toBe(XP_CURVE.maxLevel);
    expect(progress.percentage).toBe(100);
  });

  it('handles negative XP gracefully', () => {
    const progress = getXpProgress(-100);
    expect(progress.level).toBe(1);
    expect(progress.currentXp).toBe(0);
    expect(progress.percentage).toBe(0);
  });
});

// ============================================================
// getTierForLevel / getVocabPacingForLevel
// ============================================================

describe('getTierForLevel', () => {
  it('returns beginner for levels 1-5', () => {
    for (let level = 1; level <= 5; level++) {
      expect(getTierForLevel(level)).toBe('beginner');
    }
  });

  it('returns elementary for levels 6-10', () => {
    for (let level = 6; level <= 10; level++) {
      expect(getTierForLevel(level)).toBe('elementary');
    }
  });

  it('returns intermediate for levels 11-20', () => {
    expect(getTierForLevel(11)).toBe('intermediate');
    expect(getTierForLevel(20)).toBe('intermediate');
  });

  it('returns advanced for levels 21-35', () => {
    expect(getTierForLevel(21)).toBe('advanced');
    expect(getTierForLevel(35)).toBe('advanced');
  });

  it('returns expert for levels 36-50', () => {
    expect(getTierForLevel(36)).toBe('expert');
    expect(getTierForLevel(50)).toBe('expert');
  });

  it('returns expert for levels beyond 50', () => {
    expect(getTierForLevel(51)).toBe('expert');
    expect(getTierForLevel(100)).toBe('expert');
  });
});

describe('getVocabPacingForLevel', () => {
  it('returns correct new words per day for beginner', () => {
    const pacing = getVocabPacingForLevel(1);
    expect(pacing.tier).toBe('beginner');
    expect(pacing.newWordsPerDay).toBe(5);
  });

  it('returns correct new words per day for expert', () => {
    const pacing = getVocabPacingForLevel(50);
    expect(pacing.tier).toBe('expert');
    expect(pacing.newWordsPerDay).toBe(15);
  });

  it('includes mastery threshold and cooldown', () => {
    const pacing = getVocabPacingForLevel(10);
    expect(pacing.masteryThreshold).toBe(0.65);
    expect(pacing.newWordCooldownMinutes).toBe(3);
    expect(pacing.maxReviewsPerSession).toBe(30);
  });
});

// ============================================================
// Feature Unlocks
// ============================================================

describe('isFeatureUnlocked', () => {
  it('returns false for features above current level', () => {
    expect(isFeatureUnlocked('arena', 1)).toBe(false);
    expect(isFeatureUnlocked('crafting', 5)).toBe(false);
  });

  it('returns true for features at or below current level', () => {
    expect(isFeatureUnlocked('writingPractice', 2)).toBe(true);
    expect(isFeatureUnlocked('writingPractice', 10)).toBe(true);
  });

  it('returns false for unknown features', () => {
    expect(isFeatureUnlocked('nonexistent', 50)).toBe(false);
  });

  it('returns true at exact unlock level', () => {
    expect(isFeatureUnlocked('arena', 15)).toBe(true);
    expect(isFeatureUnlocked('dailyChallenge', 3)).toBe(true);
  });
});

describe('isQuizTypeUnlocked', () => {
  it('level 1 quiz types are unlocked from the start', () => {
    expect(isQuizTypeUnlocked('ar-to-en', 1)).toBe(true);
    expect(isQuizTypeUnlocked('en-to-ar', 1)).toBe(true);
    expect(isQuizTypeUnlocked('match', 1)).toBe(true);
  });

  it('higher-level quiz types are locked at level 1', () => {
    expect(isQuizTypeUnlocked('sentence-build', 1)).toBe(false);
    expect(isQuizTypeUnlocked('DialectIdentify', 1)).toBe(false);
  });

  it('returns false for unknown quiz type', () => {
    expect(isQuizTypeUnlocked('nonexistent', 50)).toBe(false);
  });
});

describe('getUnlockedFeatures', () => {
  it('returns empty array at level 1 (no features unlock at level 1)', () => {
    const features = getUnlockedFeatures(1);
    expect(features).toEqual([]);
  });

  it('returns writingPractice at level 2', () => {
    const features = getUnlockedFeatures(2);
    expect(features).toContain('writingPractice');
  });

  it('returns all features at level 50', () => {
    const features = getUnlockedFeatures(50);
    const allFeatures = Object.keys(UNLOCK_GATES.features);
    expect(features).toHaveLength(allFeatures.length);
    for (const feature of allFeatures) {
      expect(features).toContain(feature);
    }
  });

  it('features grow monotonically as level increases', () => {
    let prevCount = 0;
    for (let level = 1; level <= 50; level++) {
      const count = getUnlockedFeatures(level).length;
      expect(count).toBeGreaterThanOrEqual(prevCount);
      prevCount = count;
    }
  });
});

describe('getUnlockedQuizTypes', () => {
  it('returns at least 3 quiz types at level 1', () => {
    const types = getUnlockedQuizTypes(1);
    expect(types.length).toBeGreaterThanOrEqual(3);
  });

  it('returns all quiz types at level 50', () => {
    const types = getUnlockedQuizTypes(50);
    const allTypes = Object.keys(UNLOCK_GATES.quizTypes);
    expect(types).toHaveLength(allTypes.length);
  });
});

describe('getNextUnlock', () => {
  it('returns the next feature for level 1', () => {
    const next = getNextUnlock(1);
    expect(next).not.toBeNull();
    expect(next.level).toBeGreaterThan(1);
    expect(next.feature).toBeTruthy();
    expect(next.name.en).toBeTruthy();
  });

  it('returns null when all features are unlocked', () => {
    const next = getNextUnlock(50);
    expect(next).toBeNull();
  });

  it('returns the lowest-level upcoming feature', () => {
    const next = getNextUnlock(1);
    // writingPractice unlocks at level 2, which is the lowest
    expect(next.feature).toBe('writingPractice');
    expect(next.level).toBe(2);
  });
});

describe('getUpcomingUnlocks', () => {
  it('returns sorted list of upcoming unlocks', () => {
    const upcoming = getUpcomingUnlocks(1);
    expect(upcoming.length).toBeGreaterThan(0);
    for (let i = 1; i < upcoming.length; i++) {
      expect(upcoming[i].level).toBeGreaterThanOrEqual(upcoming[i - 1].level);
    }
  });

  it('returns empty array when all features unlocked', () => {
    const upcoming = getUpcomingUnlocks(50);
    expect(upcoming).toHaveLength(0);
  });
});

describe('getFeaturesUnlockedAtLevel', () => {
  it('returns features that unlock exactly at the given level', () => {
    const atLevel2 = getFeaturesUnlockedAtLevel(2);
    expect(atLevel2.length).toBeGreaterThan(0);
    expect(atLevel2.some((f) => f.feature === 'writingPractice')).toBe(true);
  });

  it('returns empty array for levels with no unlocks', () => {
    const at99 = getFeaturesUnlockedAtLevel(99);
    expect(at99).toHaveLength(0);
  });
});

// ============================================================
// Session Planning
// ============================================================

describe('getSessionPlan', () => {
  it('returns a valid session plan', () => {
    const plan = getSessionPlan({
      level: 5,
      reviewWords: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10'],
      newWords: ['n1', 'n2', 'n3'],
      recentMastery: 0.8,
      streak: 3,
    });

    expect(plan.warmup).toBeDefined();
    expect(plan.newContent).toBeDefined();
    expect(plan.review).toBeDefined();
    expect(plan.cooldown).toBeDefined();
    expect(plan.totalItems).toBeGreaterThan(0);
    expect(plan.estimatedMinutes).toBeGreaterThan(0);
    expect(plan.quizTypes).toBeDefined();
    expect(Array.isArray(plan.quizTypes)).toBe(true);
  });

  it('starts with warmup review words', () => {
    const plan = getSessionPlan({
      level: 1,
      reviewWords: ['r1', 'r2', 'r3', 'r4', 'r5'],
      newWords: ['n1', 'n2'],
      recentMastery: 0.7,
    });
    expect(plan.warmup.length).toBeGreaterThan(0);
    expect(plan.warmup.length).toBeLessThanOrEqual(3);
  });

  it('does not introduce new words when mastery is below threshold', () => {
    const plan = getSessionPlan({
      level: 5,
      reviewWords: ['r1', 'r2', 'r3', 'r4', 'r5'],
      newWords: ['n1', 'n2', 'n3'],
      recentMastery: 0.5, // below 0.65 threshold
    });
    expect(plan.newContent).toHaveLength(0);
  });

  it('introduces new words when mastery is above threshold', () => {
    const plan = getSessionPlan({
      level: 5,
      reviewWords: ['r1', 'r2', 'r3', 'r4', 'r5'],
      newWords: ['n1', 'n2', 'n3'],
      recentMastery: 0.8,
    });
    expect(plan.newContent.length).toBeGreaterThan(0);
  });

  it('handles empty review words', () => {
    const plan = getSessionPlan({
      level: 1,
      reviewWords: [],
      newWords: ['n1', 'n2'],
      recentMastery: 0.8,
    });
    expect(plan.warmup).toHaveLength(0);
    expect(plan.cooldown).toHaveLength(0);
  });

  it('handles empty new words', () => {
    const plan = getSessionPlan({
      level: 1,
      reviewWords: ['r1', 'r2', 'r3'],
      newWords: [],
      recentMastery: 0.8,
    });
    expect(plan.newContent).toHaveLength(0);
  });

  it('respects maxReviewsPerSession limit', () => {
    const manyWords = Array.from({ length: 50 }, (_, i) => `r${i}`);
    const plan = getSessionPlan({
      level: 1,
      reviewWords: manyWords,
      newWords: [],
      recentMastery: 0.8,
    });
    const totalReview = plan.warmup.length + plan.review.length + plan.cooldown.length;
    expect(totalReview).toBeLessThanOrEqual(30 + 2); // maxReviewsPerSession + potential cooldown overflow
  });

  it('uses provided unlockedQuizTypes when given', () => {
    const plan = getSessionPlan({
      level: 1,
      reviewWords: ['r1'],
      newWords: [],
      recentMastery: 0.8,
      unlockedQuizTypes: ['ar-to-en', 'match'],
    });
    expect(plan.quizTypes).toEqual(['ar-to-en', 'match']);
  });

  it('handles default/missing parameters gracefully', () => {
    const plan = getSessionPlan({});
    expect(plan.warmup).toEqual([]);
    expect(plan.newContent).toEqual([]);
    expect(plan.review).toEqual([]);
    expect(plan.cooldown).toEqual([]);
    expect(plan.totalItems).toBe(0);
  });
});

// ============================================================
// XP Reward Calculation
// ============================================================

describe('calculateXpReward', () => {
  it('returns correct XP for quiz correct answer', () => {
    expect(calculateXpReward('quiz', 'correct')).toBe(10);
  });

  it('returns correct XP for grammar lesson complete', () => {
    expect(calculateXpReward('grammar', 'lessonComplete')).toBe(40);
  });

  it('returns correct XP for main quest', () => {
    expect(calculateXpReward('quest', 'mainQuest')).toBe(100);
  });

  it('returns 0 for unknown activity', () => {
    expect(calculateXpReward('nonexistent', 'complete')).toBe(0);
  });

  it('returns 0 for unknown type within valid activity', () => {
    expect(calculateXpReward('quiz', 'nonexistent')).toBe(0);
  });

  it('applies daily challenge streak multiplier', () => {
    const base = calculateXpReward('dailyChallenge', 'complete');
    const withStreak = calculateXpReward('dailyChallenge', 'complete', { streakDays: 10 });
    // 10 days * 0.05 = 0.5 → 1.5x multiplier → 50 * 1.5 = 75
    expect(withStreak).toBe(75);
    expect(withStreak).toBeGreaterThan(base);
  });

  it('streak multiplier only applies to dailyChallenge', () => {
    const quizReward = calculateXpReward('quiz', 'correct', { streakDays: 100 });
    expect(quizReward).toBe(10); // no multiplier applied
  });
});

// ============================================================
// CEFR Estimation
// ============================================================

describe('estimateCefrLevel', () => {
  it('returns Pre-A1 for zero progress', () => {
    expect(estimateCefrLevel(0, 0)).toBe('Pre-A1');
  });

  it('returns A1 when meeting A1 gates', () => {
    expect(estimateCefrLevel(20, 500)).toBe('A1');
  });

  it('returns A2 when meeting A2 gates', () => {
    expect(estimateCefrLevel(35, 1500)).toBe('A2');
  });

  it('returns B1 when meeting B1 gates', () => {
    expect(estimateCefrLevel(45, 3000)).toBe('B1');
  });

  it('returns B2 when meeting B2 gates', () => {
    expect(estimateCefrLevel(50, 5000)).toBe('B2');
  });

  it('returns Pre-A1 if grammar is met but vocab is not', () => {
    expect(estimateCefrLevel(50, 100)).toBe('Pre-A1');
  });

  it('returns Pre-A1 if vocab is met but grammar is not', () => {
    expect(estimateCefrLevel(5, 5000)).toBe('Pre-A1');
  });

  it('requires BOTH grammar and vocab to reach a CEFR level', () => {
    // Meets A2 grammar but only A1 vocab
    expect(estimateCefrLevel(35, 500)).toBe('A1');
  });
});

describe('getCefrProgress', () => {
  it('shows progress toward A1 at Pre-A1', () => {
    const progress = getCefrProgress(10, 250);
    expect(progress.currentLevel).toBe('Pre-A1');
    expect(progress.nextLevel).toBe('A1');
    expect(progress.grammarProgress).toBe(50); // 10/20 = 50%
    expect(progress.vocabProgress).toBe(50); // 250/500 = 50%
    expect(progress.overallProgress).toBe(50);
  });

  it('returns null nextLevel at B2', () => {
    const progress = getCefrProgress(50, 5000);
    expect(progress.currentLevel).toBe('B2');
    expect(progress.nextLevel).toBeNull();
    expect(progress.overallProgress).toBe(100);
  });

  it('caps progress at 100%', () => {
    const progress = getCefrProgress(100, 1000);
    expect(progress.grammarProgress).toBe(100); // 100/20 capped at 100
  });
});

// ============================================================
// Progress Report
// ============================================================

describe('getProgressReport', () => {
  const baseState = {
    level: 5,
    xp: 500,
    wordsLearned: 100,
    wordsMastered: 40,
    grammarLessonsCompleted: 10,
    grammarLessonsTotal: 50,
    questsCompleted: 5,
    questsTotal: 60,
    streak: 7,
    maxStreak: 14,
    totalStudyTimeMinutes: 120,
    sessionsThisWeek: 4,
    newWordsToday: 3,
  };

  it('returns all expected fields', () => {
    const report = getProgressReport(baseState);

    expect(report).toHaveProperty('level');
    expect(report).toHaveProperty('currentXp');
    expect(report).toHaveProperty('xpToNext');
    expect(report).toHaveProperty('xpPercentage');
    expect(report).toHaveProperty('totalXp');
    expect(report).toHaveProperty('wordsLearned');
    expect(report).toHaveProperty('wordsMastered');
    expect(report).toHaveProperty('masteryPercentage');
    expect(report).toHaveProperty('newWordsToday');
    expect(report).toHaveProperty('newWordsBudget');
    expect(report).toHaveProperty('vocabTier');
    expect(report).toHaveProperty('grammarLessonsCompleted');
    expect(report).toHaveProperty('grammarLessonsTotal');
    expect(report).toHaveProperty('grammarPercentage');
    expect(report).toHaveProperty('questsCompleted');
    expect(report).toHaveProperty('questsTotal');
    expect(report).toHaveProperty('questPercentage');
    expect(report).toHaveProperty('streak');
    expect(report).toHaveProperty('maxStreak');
    expect(report).toHaveProperty('estimatedCefrLevel');
    expect(report).toHaveProperty('cefrProgress');
    expect(report).toHaveProperty('unlockedFeatureCount');
    expect(report).toHaveProperty('totalFeatureCount');
    expect(report).toHaveProperty('upcomingUnlocks');
  });

  it('calculates mastery percentage correctly', () => {
    const report = getProgressReport(baseState);
    expect(report.masteryPercentage).toBe(40); // 40/100 = 40%
  });

  it('calculates grammar percentage correctly', () => {
    const report = getProgressReport(baseState);
    expect(report.grammarPercentage).toBe(20); // 10/50 = 20%
  });

  it('calculates quest percentage correctly', () => {
    const report = getProgressReport(baseState);
    expect(report.questPercentage).toBe(8); // 5/60 ~ 8%
  });

  it('shows upcoming unlocks limited to 3', () => {
    const report = getProgressReport({ ...baseState, level: 1 });
    expect(report.upcomingUnlocks.length).toBeLessThanOrEqual(3);
  });

  it('handles zero wordsLearned without division by zero', () => {
    const report = getProgressReport({ ...baseState, wordsLearned: 0, wordsMastered: 0 });
    expect(report.masteryPercentage).toBe(0);
  });

  it('handles default/missing parameters gracefully', () => {
    const report = getProgressReport({});
    expect(report.level).toBe(1);
    expect(report.streak).toBe(0);
    expect(report.wordsLearned).toBe(0);
  });
});
