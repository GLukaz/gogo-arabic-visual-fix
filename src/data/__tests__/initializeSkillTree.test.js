import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { initializeSkillTree } from '../initializeSkillTree.js';
import skillTreeReducer from '../../store/slices/skillTreeSlice.js';
import grammarReducer from '../../store/slices/grammarSlice.js';
import questReducer from '../../store/slices/questSlice.js';
import alphabetReducer from '../../store/slices/alphabetSlice.js';
import vocabularyReducer from '../../store/slices/vocabularySlice.js';
import poetryReducer from '../../store/slices/poetrySlice.js';

/**
 * Build a test store with optional preloaded state slices.
 * Mirrors the relevant keys in the real rootReducer.
 */
function buildStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      skillTree: skillTreeReducer,
      grammar: grammarReducer,
      quests: questReducer,
      alphabet: alphabetReducer,
      vocabulary: vocabularyReducer,
      poetry: poetryReducer,
    },
    preloadedState,
  });
}

describe('initializeSkillTree', () => {
  it('does not dispatch when no prior progress', () => {
    // All counters zero — empty state
    const store = buildStore();
    initializeSkillTree(store);
    const xp = store.getState().skillTree.skillXP;
    expect(xp.grammar).toBe(0);
    expect(xp.reading).toBe(0);
    expect(xp.writing).toBe(0);
    expect(xp.speaking).toBe(0);
    expect(xp.culture).toBe(0);
    expect(xp.listening).toBe(0);
  });

  it('awards grammar XP proportional to completedLessons', () => {
    const store = buildStore({
      grammar: {
        completedLessons: ['al-definite', 'personal-pronouns'],
        lessonScores: {},
        currentLessonId: null,
      },
    });
    initializeSkillTree(store);
    // 2 lessons * 40 XP = 80
    expect(store.getState().skillTree.skillXP.grammar).toBe(80);
  });

  it('awards culture XP proportional to completed quests', () => {
    const store = buildStore({
      quests: {
        quests: {
          quest_001: { status: 'completed', progress: 1, rewardClaimed: false },
          quest_002: { status: 'completed', progress: 1, rewardClaimed: false },
          quest_003: { status: 'completed', progress: 1, rewardClaimed: false },
          quest_004: { status: 'active', progress: 0, rewardClaimed: false },
        },
        activeQuestId: 'quest_004',
        npcsVisited: [],
        zonesVisited: [],
        dialoguesCompleted: [],
        reviewSessionsCompleted: [],
        quizzesPassed: [],
        chestsOpened: [],
        wordsLearnedToday: 0,
        lastResetDate: null,
        lettersMastered: [],
        sentenceQuizzesCompleted: 0,
      },
    });
    initializeSkillTree(store);
    // 3 completed quests * 30 XP = 90
    expect(store.getState().skillTree.skillXP.culture).toBe(90);
  });

  it('awards reading XP proportional to learned words (fsrs cards)', () => {
    const store = buildStore({
      vocabulary: {
        fsrsCards: {
          word_001: { card: {}, log: null },
          word_002: { card: {}, log: null },
          word_003: { card: {}, log: null },
          word_004: { card: {}, log: null },
          word_005: { card: {}, log: null },
          word_006: { card: {}, log: null },
          word_007: { card: {}, log: null },
          word_008: { card: {}, log: null },
          word_009: { card: {}, log: null },
          word_010: { card: {}, log: null },
          word_011: { card: {}, log: null },
          word_012: { card: {}, log: null },
          word_013: { card: {}, log: null },
          word_014: { card: {}, log: null },
          word_015: { card: {}, log: null },
          word_016: { card: {}, log: null },
          word_017: { card: {}, log: null },
          word_018: { card: {}, log: null },
          word_019: { card: {}, log: null },
          word_020: { card: {}, log: null },
        },
        reviewQueue: [],
        stats: { totalReviews: 0, accuracy: 0, streakDays: 0 },
        npcTeacherMap: {},
      },
    });
    initializeSkillTree(store);
    // 20 fsrs cards * 5 XP = 100
    expect(store.getState().skillTree.skillXP.reading).toBe(100);
  });

  it('is idempotent — calling twice does not double XP', () => {
    const store = buildStore({
      grammar: {
        completedLessons: ['al-definite', 'personal-pronouns'],
        lessonScores: {},
        currentLessonId: null,
      },
    });
    initializeSkillTree(store);
    const xpAfterFirst = store.getState().skillTree.skillXP.grammar;
    expect(xpAfterFirst).toBe(80);

    // Second call — guard fires because grammar XP > 0
    initializeSkillTree(store);
    const xpAfterSecond = store.getState().skillTree.skillXP.grammar;
    expect(xpAfterSecond).toBe(80); // unchanged
  });

  it('does not overwrite existing skill tree progress', () => {
    const store = buildStore({
      grammar: {
        completedLessons: ['al-definite', 'personal-pronouns'],
        lessonScores: {},
        currentLessonId: null,
      },
      skillTree: {
        skillXP: { grammar: 100, reading: 0, writing: 0, speaking: 0, culture: 0, listening: 0 },
        unlockedNodes: { grammar: [], reading: [], writing: [], speaking: [], culture: [], listening: [] },
      },
    });

    initializeSkillTree(store);

    // Guard fires: grammar XP is already 100 > 0, so init returns early
    expect(store.getState().skillTree.skillXP.grammar).toBe(100);
  });

  it('auto-unlocks nodes when XP is sufficient', () => {
    // grammar_01 costs 75 XP. With 2 completed lessons (80 XP), it should auto-unlock.
    const store = buildStore({
      grammar: {
        completedLessons: ['al-definite', 'personal-pronouns'],
        lessonScores: {},
        currentLessonId: null,
      },
    });
    initializeSkillTree(store);

    const unlockedGrammar = store.getState().skillTree.unlockedNodes.grammar;
    expect(unlockedGrammar).toContain('grammar_01');
  });

  it('awards writing XP proportional to completed alphabet groups', () => {
    const store = buildStore({
      alphabet: {
        groups: [],
        completedGroups: ['hamza', 'ba', 'ta'],
        currentLesson: null,
        practicedLetters: {},
      },
    });
    initializeSkillTree(store);
    // 3 groups * 25 XP = 75
    expect(store.getState().skillTree.skillXP.writing).toBe(75);
  });

  it('awards speaking and culture XP for poetry wins', () => {
    const store = buildStore({
      poetry: {
        activeBattle: null,
        completedBattles: [
          { poemId: 'poem_01', poetId: 'poet_01', playerScore: 3, npcScore: 1, won: true, completedAt: 1000 },
          { poemId: 'poem_02', poetId: 'poet_02', playerScore: 1, npcScore: 3, won: false, completedAt: 2000 },
        ],
        unlockedPoems: [],
      },
    });
    initializeSkillTree(store);
    // 1 win * 30 XP each for speaking and culture
    expect(store.getState().skillTree.skillXP.speaking).toBe(30);
    expect(store.getState().skillTree.skillXP.culture).toBe(30);
  });
});
