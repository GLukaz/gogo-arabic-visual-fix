/**
 * Phase 88 — Integration tests for progression service with mock Redux state.
 *
 * These tests verify that progressionService functions work correctly
 * when fed state shapes matching the actual Redux store slices.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateLevel,
  getXpProgress,
  getVocabPacingForLevel,
  isFeatureUnlocked,
  getUnlockedFeatures,
  getUnlockedQuizTypes,
  getNextUnlock,
  getSessionPlan,
  calculateXpReward,
  estimateCefrLevel,
  getProgressReport,
} from '../../../services/progressionService.js';

import { XP_CURVE } from '../../../data/progressionConfig.js';

// ============================================================
// MOCK STATE BUILDERS
// ============================================================

/** Build a mock playerSlice state */
function mockPlayerState(overrides = {}) {
  return {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0,
    maxStreak: 0,
    dirhams: 0,
    wordsLearned: 0,
    lastPlayedDate: null,
    ...overrides,
  };
}

/** Build a mock vocabularySlice state */
function mockVocabState(wordCount = 0, masteredCount = 0) {
  const fsrsCards = {};
  for (let i = 0; i < wordCount; i++) {
    fsrsCards[`word_${i}`] = {
      card: { stability: i < masteredCount ? 25 : 5 },
      log: null,
    };
  }
  return {
    fsrsCards,
    reviewQueue: Object.keys(fsrsCards).slice(0, 10),
    stats: { totalReviews: wordCount * 3, accuracy: 0.75, streakDays: 5 },
  };
}

/** Build a mock grammarSlice state */
function mockGrammarState(completedCount = 0) {
  const completedLessons = Array.from({ length: completedCount }, (_, i) => `lesson_${i}`);
  return {
    completedLessons,
    unlockedLessons: ['al-definite', ...completedLessons],
    lessonScores: {},
    currentLessonId: null,
  };
}

/** Build a mock questSlice state */
function mockQuestState(completedCount = 0, totalCount = 60) {
  const quests = {};
  for (let i = 0; i < totalCount; i++) {
    quests[`quest_${i}`] = {
      status: i < completedCount ? 'completed' : 'available',
      progress: i < completedCount ? 100 : 0,
    };
  }
  return { quests, activeQuestId: null };
}

// ============================================================
// INTEGRATION: Player Level + XP
// ============================================================

describe('Progression integration — player level', () => {
  it('fresh player state produces level 1 progress', () => {
    const player = mockPlayerState();
    const progress = getXpProgress(player.xp);
    expect(progress.level).toBe(1);
    expect(progress.currentXp).toBe(0);
    expect(progress.percentage).toBe(0);
  });

  it('mid-game player has correct level from cumulative XP', () => {
    // Give enough XP for level 5
    const totalXp = XP_CURVE.getTotalXpToLevel(5) + 50;
    const progress = getXpProgress(totalXp);
    expect(progress.level).toBe(5);
    expect(progress.currentXp).toBe(50);
  });

  it('level from calculateLevel matches getXpProgress', () => {
    for (const xp of [0, 100, 500, 1000, 5000, 20000]) {
      const levelA = calculateLevel(xp);
      const levelB = getXpProgress(xp).level;
      expect(levelA).toBe(levelB);
    }
  });
});

// ============================================================
// INTEGRATION: Vocabulary Pacing with Player Level
// ============================================================

describe('Progression integration — vocabulary pacing', () => {
  it('beginner player gets 5 new words/day', () => {
    const player = mockPlayerState({ level: 3 });
    const pacing = getVocabPacingForLevel(player.level);
    expect(pacing.newWordsPerDay).toBe(5);
    expect(pacing.tier).toBe('beginner');
  });

  it('intermediate player gets 10 new words/day', () => {
    const player = mockPlayerState({ level: 15 });
    const pacing = getVocabPacingForLevel(player.level);
    expect(pacing.newWordsPerDay).toBe(10);
    expect(pacing.tier).toBe('intermediate');
  });

  it('expert player gets 15 new words/day', () => {
    const player = mockPlayerState({ level: 45 });
    const pacing = getVocabPacingForLevel(player.level);
    expect(pacing.newWordsPerDay).toBe(15);
    expect(pacing.tier).toBe('expert');
  });
});

// ============================================================
// INTEGRATION: Feature Unlocks with Player Level
// ============================================================

describe('Progression integration — feature unlocks', () => {
  it('level 1 player has no features unlocked', () => {
    const player = mockPlayerState({ level: 1 });
    const features = getUnlockedFeatures(player.level);
    expect(features).toHaveLength(0);
  });

  it('level 5 player has multiple features', () => {
    const player = mockPlayerState({ level: 5 });
    const features = getUnlockedFeatures(player.level);
    expect(features).toContain('writingPractice');
    expect(features).toContain('dailyChallenge');
    expect(features).toContain('miniGames');
    expect(features).toContain('conversationPractice');
    expect(features).toContain('loreCodex');
    expect(features).toContain('skillTree');
  });

  it('level 5 player does not have arena or crafting', () => {
    const player = mockPlayerState({ level: 5 });
    expect(isFeatureUnlocked('arena', player.level)).toBe(false);
    expect(isFeatureUnlocked('crafting', player.level)).toBe(false);
  });

  it('level 15 player has arena unlocked', () => {
    const player = mockPlayerState({ level: 15 });
    expect(isFeatureUnlocked('arena', player.level)).toBe(true);
  });

  it('next unlock for level 5 player is giftGiving at level 8', () => {
    const player = mockPlayerState({ level: 5 });
    const next = getNextUnlock(player.level);
    expect(next.feature).toBe('giftGiving');
    expect(next.level).toBe(8);
  });
});

// ============================================================
// INTEGRATION: Quiz Type Unlocks
// ============================================================

describe('Progression integration — quiz type unlocks', () => {
  it('level 1 has basic quiz types', () => {
    const types = getUnlockedQuizTypes(1);
    expect(types).toContain('ar-to-en');
    expect(types).toContain('en-to-ar');
    expect(types).toContain('match');
    expect(types).toContain('listen');
    expect(types).toContain('picture-word');
  });

  it('level 1 does not have advanced quiz types', () => {
    const types = getUnlockedQuizTypes(1);
    expect(types).not.toContain('sentence-build');
    expect(types).not.toContain('DialectIdentify');
  });

  it('level 8 has dialect and root expansion quiz types', () => {
    const types = getUnlockedQuizTypes(8);
    expect(types).toContain('DialectIdentify');
    expect(types).toContain('RootExpand');
    expect(types).toContain('CulturalContext');
  });
});

// ============================================================
// INTEGRATION: Session Planning with Mock State
// ============================================================

describe('Progression integration — session planning', () => {
  it('generates a valid session from vocab state', () => {
    const vocab = mockVocabState(50, 20);
    const player = mockPlayerState({ level: 10 });

    const plan = getSessionPlan({
      level: player.level,
      reviewWords: vocab.reviewQueue,
      newWords: Object.keys(vocab.fsrsCards).slice(10, 20),
      recentMastery: vocab.stats.accuracy,
    });

    expect(plan.totalItems).toBeGreaterThan(0);
    expect(plan.warmup.length).toBeLessThanOrEqual(3);
    expect(plan.estimatedMinutes).toBeGreaterThan(0);
  });

  it('low mastery blocks new content introduction', () => {
    const plan = getSessionPlan({
      level: 5,
      reviewWords: ['r1', 'r2', 'r3', 'r4', 'r5'],
      newWords: ['n1', 'n2', 'n3'],
      recentMastery: 0.4, // well below 0.65 threshold
    });
    expect(plan.newContent).toHaveLength(0);
  });
});

// ============================================================
// INTEGRATION: XP Rewards
// ============================================================

describe('Progression integration — XP rewards', () => {
  it('quiz correct answer gives 10 XP', () => {
    expect(calculateXpReward('quiz', 'correct')).toBe(10);
  });

  it('daily challenge with 20-day streak gives boosted XP', () => {
    const baseXp = calculateXpReward('dailyChallenge', 'complete');
    const boosted = calculateXpReward('dailyChallenge', 'complete', { streakDays: 20 });
    // 20 * 0.05 = 1.0 → 2x multiplier → 50 * 2 = 100
    expect(boosted).toBe(100);
    expect(boosted).toBeGreaterThan(baseXp);
  });

  it('exploration rewards are smaller than quest rewards', () => {
    const npcMet = calculateXpReward('exploration', 'npcMet');
    const questComplete = calculateXpReward('quest', 'complete');
    expect(npcMet).toBeLessThan(questComplete);
  });
});

// ============================================================
// INTEGRATION: CEFR + Progress Report
// ============================================================

describe('Progression integration — CEFR estimation', () => {
  it('fresh player is Pre-A1', () => {
    const grammar = mockGrammarState(0);
    const vocab = mockVocabState(0);
    const cefrLevel = estimateCefrLevel(
      grammar.completedLessons.length,
      Object.keys(vocab.fsrsCards).length
    );
    expect(cefrLevel).toBe('Pre-A1');
  });

  it('player with 20 grammar lessons and 500 words is A1', () => {
    const cefrLevel = estimateCefrLevel(20, 500);
    expect(cefrLevel).toBe('A1');
  });
});

describe('Progression integration — progress report', () => {
  it('generates a complete report from mock state', () => {
    const player = mockPlayerState({ level: 10, xp: 3000, streak: 5, maxStreak: 10 });
    const vocab = mockVocabState(200, 80);
    const grammar = mockGrammarState(15);
    const _quests = mockQuestState(10, 60);

    const report = getProgressReport({
      level: player.level,
      xp: player.xp,
      wordsLearned: Object.keys(vocab.fsrsCards).length,
      wordsMastered: 80,
      grammarLessonsCompleted: grammar.completedLessons.length,
      grammarLessonsTotal: 50,
      questsCompleted: 10,
      questsTotal: 60,
      streak: player.streak,
      maxStreak: player.maxStreak,
    });

    expect(report.wordsLearned).toBe(200);
    expect(report.wordsMastered).toBe(80);
    expect(report.masteryPercentage).toBe(40);
    expect(report.grammarPercentage).toBe(30);
    expect(report.questPercentage).toBe(17);
    expect(report.streak).toBe(5);
    expect(report.maxStreak).toBe(10);
    expect(report.estimatedCefrLevel).toBeTruthy();
    expect(report.upcomingUnlocks.length).toBeLessThanOrEqual(3);
  });
});
