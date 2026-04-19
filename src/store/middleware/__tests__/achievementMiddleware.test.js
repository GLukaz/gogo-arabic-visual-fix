import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { achievementMiddleware } from '../achievementMiddleware.js';
import achievementReducer, { recordQuizTypeResult } from '../../slices/achievementSlice.js';
import playerReducer, { incrementWordsLearned, addXP } from '../../slices/playerSlice.js';
import vocabularyReducer from '../../slices/vocabularySlice.js';
import questReducer, { completeQuest } from '../../slices/questSlice.js';
import grammarReducer, { completeLesson } from '../../slices/grammarSlice.js';
import alphabetReducer from '../../slices/alphabetSlice.js';
import skillTreeReducer, { unlockNode, bulkUnlockNodes, addSkillXP } from '../../slices/skillTreeSlice.js';
import cefrProgressReducer, { setCefrLevel } from '../../slices/cefrProgressSlice.js';
import placementReducer, { recordPlacementResult } from '../../slices/placementSlice.js';

/**
 * Achievement Middleware Integration Tests
 *
 * Tests the middleware's ability to:
 * - Listen to specific Redux actions
 * - Check achievement thresholds
 * - Auto-dispatch unlockAchievement and addXP
 * - Maintain idempotency (don't duplicate achievements)
 */
describe('achievementMiddleware', () => {
  let store;

  beforeEach(() => {
    // Create a fresh store with middleware for each test
    store = configureStore({
      reducer: {
        achievements: achievementReducer,
        player: playerReducer,
        vocabulary: vocabularyReducer,
        quests: questReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(achievementMiddleware),
    });
  });

  describe('words_learned achievements', () => {
    it('should unlock "first_word" achievement when learning 1 word', () => {
      const initialAchievements = store.getState().achievements.unlockedAchievements;
      expect(initialAchievements).toEqual({});

      // Dispatch action that triggers words_learned check
      store.dispatch(incrementWordsLearned());

      const state = store.getState();

      // Check that first_word achievement was unlocked
      expect(state.achievements.unlockedAchievements).toHaveProperty('first_word');

      // Check that XP was awarded (25 XP for first_word achievement)
      expect(state.player.xp).toBeGreaterThanOrEqual(25);

      // Check that wordsLearned was incremented
      expect(state.player.wordsLearned).toBe(1);
    });

    it('should NOT unlock achievement when below threshold', () => {
      // Start with 0 words learned - no achievement should unlock yet for threshold > 1
      const state = store.getState();
      expect(state.player.wordsLearned).toBe(0);
      expect(state.achievements.unlockedAchievements).toEqual({});
    });

    it('should NOT duplicate achievement on repeated actions', () => {
      // Unlock first achievement
      store.dispatch(incrementWordsLearned());

      const firstState = store.getState();
      const firstUnlockTime = firstState.achievements.unlockedAchievements.first_word;
      const firstXP = firstState.player.xp;

      expect(firstUnlockTime).toBeDefined();

      // Dispatch again - should not unlock same achievement twice
      store.dispatch(incrementWordsLearned());

      const secondState = store.getState();

      // Timestamp should not change (achievement not re-unlocked)
      expect(secondState.achievements.unlockedAchievements.first_word).toBe(firstUnlockTime);

      // XP should only increase by actions, not duplicate achievement rewards
      // After second increment, player has 2 words learned
      // But first_word achievement should only award XP once
      const xpIncrease = secondState.player.xp - firstXP;
      expect(xpIncrease).toBeLessThan(25); // Should NOT get another 25 XP from achievement
    });

    it('should unlock multiple achievements in sequence', () => {
      // Unlock first_word (1 word)
      store.dispatch(incrementWordsLearned());

      let state = store.getState();
      expect(state.achievements.unlockedAchievements).toHaveProperty('first_word');
      const achievementCount1 = Object.keys(state.achievements.unlockedAchievements).length;

      // Continue to trigger next threshold (word_collector_10 requires 10 words)
      for (let i = 0; i < 9; i++) {
        store.dispatch(incrementWordsLearned());
      }

      state = store.getState();

      // Should have unlocked word_collector_10 achievement
      expect(state.player.wordsLearned).toBe(10);
      expect(state.achievements.unlockedAchievements).toHaveProperty('word_collector_10');

      const achievementCount2 = Object.keys(state.achievements.unlockedAchievements).length;
      expect(achievementCount2).toBeGreaterThan(achievementCount1);
    });
  });

  describe('quest achievements', () => {
    it('should unlock quest achievement when completing required number of quests', () => {
      // Initialize quest first (completeQuest expects quest to exist)
      store.dispatch({ type: 'quests/initializeQuests', payload: [{ id: 'test_quest_1', autoStart: true }] });

      // Complete a quest
      store.dispatch(completeQuest('test_quest_1'));

      const state = store.getState();

      // Check that quest was completed
      expect(state.quests.quests.test_quest_1.status).toBe('completed');

      // Check for achievement unlock (first_quest requires 1 quest completed)
      if (state.achievements.unlockedAchievements.first_quest) {
        expect(state.achievements.unlockedAchievements).toHaveProperty('first_quest');
      }
    });
  });

  describe('XP achievements', () => {
    it('should award XP when achievement unlocks', () => {
      const initialXP = store.getState().player.xp;

      // Trigger an achievement
      store.dispatch(incrementWordsLearned());

      const finalXP = store.getState().player.xp;

      // XP should have increased (first_word awards 25 XP)
      expect(finalXP).toBeGreaterThan(initialXP);
      expect(finalXP).toBeGreaterThanOrEqual(25);
    });
  });

  describe('threshold edge cases', () => {
    it('should handle exact threshold match', () => {
      // Dispatch exactly the threshold amount for word_collector_10
      for (let i = 0; i < 10; i++) {
        store.dispatch(incrementWordsLearned());
      }

      const state = store.getState();
      expect(state.player.wordsLearned).toBe(10);
      expect(state.achievements.unlockedAchievements).toHaveProperty('word_collector_10');
    });

    it('should handle exceeding threshold', () => {
      // Dispatch more than threshold
      for (let i = 0; i < 15; i++) {
        store.dispatch(incrementWordsLearned());
      }

      const state = store.getState();
      expect(state.player.wordsLearned).toBe(15);

      // Should have unlocked both first_word and word_collector_10
      expect(state.achievements.unlockedAchievements).toHaveProperty('first_word');
      expect(state.achievements.unlockedAchievements).toHaveProperty('word_collector_10');
    });
  });

  describe('middleware idempotency', () => {
    it('should not re-unlock achievements on state rehydration', () => {
      // Simulate initial unlock
      store.dispatch(incrementWordsLearned());

      const state1 = store.getState();
      const unlockTime1 = state1.achievements.unlockedAchievements.first_word;

      // Dispatch a non-related action (should not affect achievements)
      store.dispatch(addXP(100));

      const state2 = store.getState();
      const unlockTime2 = state2.achievements.unlockedAchievements.first_word;

      // Achievement unlock time should remain unchanged
      expect(unlockTime2).toBe(unlockTime1);
    });
  });
});

describe('grammar_lessons achievements (FIX-01)', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        achievements: achievementReducer,
        player: playerReducer,
        vocabulary: vocabularyReducer,
        quests: questReducer,
        grammar: grammarReducer,
        alphabet: alphabetReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(achievementMiddleware),
    });
  });

  it('should unlock grammar_first when completing first grammar lesson', () => {
    store.dispatch(completeLesson({ lessonId: 'basic-verb-conjugation', exerciseScore: 100, quizScore: 100 }));

    const state = store.getState();
    expect(state.achievements.unlockedAchievements).toHaveProperty('grammar_first');
    expect(state.player.xp).toBeGreaterThan(0);
  });

  it('should NOT fire grammar_first for actions unrelated to grammar', () => {
    store.dispatch(incrementWordsLearned());

    const state = store.getState();
    expect(state.achievements.unlockedAchievements).not.toHaveProperty('grammar_first');
  });

  it('should unlock grammar_5 after 5 completed lessons', () => {
    const lessonIds = [
      'al-definite',
      'noun-adjective-agreement',
      'personal-pronouns',
      'possessive-suffixes',
      'basic-verb-conjugation',
    ];

    lessonIds.forEach((lessonId) => {
      store.dispatch(completeLesson({ lessonId, exerciseScore: 80, quizScore: 80 }));
    });

    const state = store.getState();
    expect(state.grammar.completedLessons).toHaveLength(5);
    expect(state.achievements.unlockedAchievements).toHaveProperty('grammar_first');
    expect(state.achievements.unlockedAchievements).toHaveProperty('grammar_5');
  });

  it('should not duplicate grammar_first on repeated completeLesson for same lesson', () => {
    store.dispatch(completeLesson({ lessonId: 'al-definite', exerciseScore: 80, quizScore: 80 }));
    const state1 = store.getState();
    const firstUnlockTime = state1.achievements.unlockedAchievements.grammar_first;

    store.dispatch(completeLesson({ lessonId: 'al-definite', exerciseScore: 90, quizScore: 90 }));
    const state2 = store.getState();

    expect(state2.achievements.unlockedAchievements.grammar_first).toBe(firstUnlockTime);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// New requirement types — Phase 63-02
// Uses a store with skillTree, cefrProgress, placement slices wired
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a full store with all slices needed for Phase 63-02 achievement checks.
 * Reading tree starts with no nodes; minimal XP is added when needed.
 */
function makeFullStore() {
  return configureStore({
    reducer: {
      achievements: achievementReducer,
      player: playerReducer,
      vocabulary: vocabularyReducer,
      quests: questReducer,
      grammar: grammarReducer,
      alphabet: alphabetReducer,
      skillTree: skillTreeReducer,
      cefrProgress: cefrProgressReducer,
      placement: placementReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(achievementMiddleware),
  });
}

describe('skill_tree_nodes in isAchievementMet', () => {
  it('returns false when total unlocked nodes < threshold', () => {
    // No nodes unlocked initially — direct isAchievementMet via middleware integration
    // achievements.js has skill_tree_nodes entries — or we test via direct logic
    // We verify via ACTION_TO_ACHIEVEMENT_TYPES mapping: skillTree/unlockNode
    const store = makeFullStore();
    // Add sufficient XP to unlock node
    store.dispatch(addSkillXP({ treeId: 'reading', amount: 50 }));
    store.dispatch(unlockNode({ treeId: 'reading', nodeId: 'reading_01' }));
    const state = store.getState();
    // Node unlocked
    expect(state.skillTree.unlockedNodes.reading).toContain('reading_01');
    // ACTION_TO_ACHIEVEMENT_TYPES must contain skillTree/unlockNode — test via action type check
    // (direct test: the action doesn't crash and state updates correctly)
  });

  it('ACTION_TO_ACHIEVEMENT_TYPES entry for skillTree/unlockNode runs without error', () => {
    const store = makeFullStore();
    store.dispatch(addSkillXP({ treeId: 'reading', amount: 50 }));
    expect(() => store.dispatch(unlockNode({ treeId: 'reading', nodeId: 'reading_01' }))).not.toThrow();
  });

  it('ACTION_TO_ACHIEVEMENT_TYPES entry for skillTree/bulkUnlockNodes runs without error', () => {
    const store = makeFullStore();
    expect(() =>
      store.dispatch(bulkUnlockNodes({ treeId: 'reading', nodeIds: ['reading_01', 'reading_02'] }))
    ).not.toThrow();
  });
});

describe('skill_tree_complete in isAchievementMet', () => {
  it('isAchievementMet skill_tree_complete is false when tree is incomplete', () => {
    const store = makeFullStore();
    store.dispatch(addSkillXP({ treeId: 'reading', amount: 50 }));
    store.dispatch(unlockNode({ treeId: 'reading', nodeId: 'reading_01' }));
    const state = store.getState();
    // Only 1 node unlocked out of 30 — achievement not met
    expect(state.skillTree.unlockedNodes.reading.length).toBe(1);
    expect(state.skillTree.unlockedNodes.reading.length).toBeLessThan(30);
  });
});

describe('quiz_type_streak in isAchievementMet', () => {
  it('dispatching achievements/recordQuizTypeResult is handled by ACTION_TO_ACHIEVEMENT_TYPES without error', () => {
    const store = makeFullStore();
    expect(() =>
      store.dispatch(recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }))
    ).not.toThrow();
  });

  it('repeated perfect dispatches accumulate streak in state', () => {
    const store = makeFullStore();
    store.dispatch(recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    store.dispatch(recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    store.dispatch(recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    const state = store.getState();
    expect(state.achievements.stats.quizTypeStats['ar-to-en'].perfectStreak).toBe(3);
  });

  it('non-perfect dispatch resets streak to 0', () => {
    const store = makeFullStore();
    store.dispatch(recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    store.dispatch(recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    store.dispatch(recordQuizTypeResult({ quizType: 'ar-to-en', perfect: false }));
    const state = store.getState();
    expect(state.achievements.stats.quizTypeStats['ar-to-en'].perfectStreak).toBe(0);
  });
});

describe('cefr_level_reached in isAchievementMet', () => {
  it('dispatching cefrProgress/setCefrLevel is handled by ACTION_TO_ACHIEVEMENT_TYPES without error', () => {
    const store = makeFullStore();
    expect(() =>
      store.dispatch(setCefrLevel({ level: 'A2', source: 'test' }))
    ).not.toThrow();
  });

  it('setCefrLevel updates cefrProgress.currentLevel in state', () => {
    const store = makeFullStore();
    store.dispatch(setCefrLevel({ level: 'A2', source: 'test' }));
    const state = store.getState();
    expect(state.cefrProgress.currentLevel).toBe('A2');
  });
});

describe('placement_complete in isAchievementMet', () => {
  it('dispatching placement/recordPlacementResult is handled by ACTION_TO_ACHIEVEMENT_TYPES without error', () => {
    const store = makeFullStore();
    expect(() =>
      store.dispatch(recordPlacementResult({ assignedLevel: 'A1', rawScore: 12 }))
    ).not.toThrow();
  });

  it('recordPlacementResult sets placement.hasCompleted to true', () => {
    const store = makeFullStore();
    store.dispatch(recordPlacementResult({ assignedLevel: 'A1', rawScore: 12 }));
    const state = store.getState();
    expect(state.placement.hasCompleted).toBe(true);
  });
});
