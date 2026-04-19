import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import questReducer, {
  initializeQuests,
  checkPrerequisites,
  updateQuestProgress,
  completeQuest,
  claimReward,
  visitNpc,
  visitZone,
  completeDialogue,
  recordReviewSession,
  recordQuizPassed,
  recordChestOpened,
  incrementWordsLearnedToday,
  masterLetter,
  setActiveQuest,
} from '../../../store/slices/questSlice.js';
import vocabularyReducer from '../../../store/slices/vocabularySlice.js';
import { checkQuestVocabMet } from '../../../store/selectors/selectQuestVocabMet.js';

/**
 * Quest System Integration Tests (Phase H / Ralph Phase 71)
 *
 * Tests the full quest lifecycle:
 *   initialize → unlock via prerequisites → track objectives → complete → reward → next quest → vocab gating
 */
describe('Quest System Integration', () => {
  let store;

  const testQuests = [
    {
      id: 'quest_greet',
      title: 'First Greeting',
      prerequisites: [],
      autoStart: true,
      target: 3,
      zone: 'oasis_village',
      npcGiver: 'merchant',
      trackEvent: 'npc_visit',
    },
    {
      id: 'quest_market',
      title: 'Market Visit',
      prerequisites: ['quest_greet'],
      autoStart: false,
      target: 1,
      zone: 'desert_marketplace',
      npcGiver: 'jeweller',
      trackEvent: 'zone_visit',
    },
    {
      id: 'quest_scholar',
      title: 'Scholar Studies',
      prerequisites: ['quest_greet'],
      autoStart: false,
      target: 5,
      zone: 'ancient_library',
      npcGiver: 'librarian',
      trackEvent: 'words_learned',
    },
  ];

  beforeEach(() => {
    store = configureStore({
      reducer: {
        quests: questReducer,
        vocabulary: vocabularyReducer,
      },
    });
    store.dispatch(initializeQuests(testQuests));
  });

  describe('Quest initialization', () => {
    it('should auto-start quests with autoStart:true', () => {
      expect(store.getState().quests.quests['quest_greet'].status).toBe('active');
    });

    it('should lock quests that have prerequisites', () => {
      expect(store.getState().quests.quests['quest_market'].status).toBe('locked');
      expect(store.getState().quests.quests['quest_scholar'].status).toBe('locked');
    });

    it('should set first active quest as tracked', () => {
      expect(store.getState().quests.activeQuestId).toBe('quest_greet');
    });
  });

  describe('Quest progress and completion', () => {
    it('should track quest progress', () => {
      store.dispatch(updateQuestProgress({ questId: 'quest_greet', amount: 1 }));
      expect(store.getState().quests.quests['quest_greet'].progress).toBe(1);
    });

    it('should complete an active quest', () => {
      store.dispatch(completeQuest('quest_greet'));
      expect(store.getState().quests.quests['quest_greet'].status).toBe('completed');
    });

    it('should NOT complete a locked quest', () => {
      store.dispatch(completeQuest('quest_market'));
      expect(store.getState().quests.quests['quest_market'].status).toBe('locked');
    });

    it('should auto-select next active quest after completion', () => {
      // First unlock quest_market
      store.dispatch(completeQuest('quest_greet'));
      store.dispatch(checkPrerequisites(testQuests));

      // quest_market should now be active
      expect(store.getState().quests.quests['quest_market'].status).toBe('active');
    });
  });

  describe('Prerequisite chain', () => {
    it('should unlock quests when prerequisites are met', () => {
      store.dispatch(completeQuest('quest_greet'));
      store.dispatch(checkPrerequisites(testQuests));

      const state = store.getState().quests.quests;
      expect(state['quest_market'].status).toBe('active');
      expect(state['quest_scholar'].status).toBe('active');
    });

    it('should NOT unlock quests when prerequisites are not met', () => {
      store.dispatch(checkPrerequisites(testQuests));

      expect(store.getState().quests.quests['quest_market'].status).toBe('locked');
    });
  });

  describe('Reward claiming', () => {
    it('should claim reward for completed quest', () => {
      store.dispatch(completeQuest('quest_greet'));
      store.dispatch(claimReward('quest_greet'));

      expect(store.getState().quests.quests['quest_greet'].rewardClaimed).toBe(true);
    });

    it('should NOT claim reward for incomplete quest', () => {
      store.dispatch(claimReward('quest_greet'));
      expect(store.getState().quests.quests['quest_greet'].rewardClaimed).toBe(false);
    });
  });

  describe('Tracking actions', () => {
    it('should track NPC visits without duplicates', () => {
      store.dispatch(visitNpc('merchant_oasis'));
      store.dispatch(visitNpc('merchant_oasis'));
      store.dispatch(visitNpc('librarian_library'));

      const state = store.getState().quests;
      expect(state.npcsVisited).toEqual(['merchant_oasis', 'librarian_library']);
    });

    it('should track zone visits', () => {
      store.dispatch(visitZone('desert_marketplace'));
      expect(store.getState().quests.zonesVisited).toContain('desert_marketplace');
    });

    it('should track dialogue completions', () => {
      store.dispatch(completeDialogue('dialogue_1'));
      expect(store.getState().quests.dialoguesCompleted).toContain('dialogue_1');
    });

    it('should track review sessions', () => {
      store.dispatch(recordReviewSession({ accuracy: 0.85, timestamp: Date.now() }));
      expect(store.getState().quests.reviewSessionsCompleted).toHaveLength(1);
    });

    it('should track quizzes passed', () => {
      store.dispatch(recordQuizPassed({ accuracy: 0.9, timestamp: Date.now() }));
      expect(store.getState().quests.quizzesPassed).toHaveLength(1);
    });

    it('should track chests opened without duplicates', () => {
      store.dispatch(recordChestOpened('chest_oasis_1'));
      store.dispatch(recordChestOpened('chest_oasis_1'));
      expect(store.getState().quests.chestsOpened).toEqual(['chest_oasis_1']);
    });

    it('should track words learned today', () => {
      store.dispatch(incrementWordsLearnedToday());
      store.dispatch(incrementWordsLearnedToday());
      expect(store.getState().quests.wordsLearnedToday).toBe(2);
    });

    it('should track letters mastered', () => {
      store.dispatch(masterLetter('alif'));
      expect(store.getState().quests.lettersMastered).toContain('alif');
    });
  });

  describe('Vocabulary gating (Phase E)', () => {
    it('should gate quests when vocab is not learned', () => {
      const result = checkQuestVocabMet(
        {},
        ['ahlan', 'marhaba', 'shukran']
      );
      expect(result.met).toBe(false);
      expect(result.missing).toEqual(['ahlan', 'marhaba', 'shukran']);
    });

    it('should allow quests when all vocab is learned', () => {
      const fsrsCards = {
        ahlan: { card: {}, log: null },
        marhaba: { card: {}, log: null },
        shukran: { card: {}, log: null },
      };
      const result = checkQuestVocabMet(fsrsCards, ['ahlan', 'marhaba', 'shukran']);
      expect(result.met).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('should allow quests with no vocab requirements', () => {
      const result = checkQuestVocabMet({}, null);
      expect(result.met).toBe(true);
    });
  });

  describe('Active quest management', () => {
    it('should set active quest', () => {
      store.dispatch(setActiveQuest('quest_greet'));
      expect(store.getState().quests.activeQuestId).toBe('quest_greet');
    });

    it('should not set a locked quest as active', () => {
      store.dispatch(setActiveQuest('quest_market'));
      // quest_market is locked, so activeQuestId should remain unchanged
      expect(store.getState().quests.activeQuestId).toBe('quest_greet');
    });
  });
});
