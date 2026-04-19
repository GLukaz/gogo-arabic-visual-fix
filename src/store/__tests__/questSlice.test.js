import { describe, it, expect, beforeEach, vi } from 'vitest';
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
  incrementSentenceQuizzes,
  setActiveQuest,
  selectAllQuests,
  selectActiveQuestCount,
} from '../slices/questSlice.js';

// Mock quest data and zones
vi.mock('../../data/quests.json', () => ({
  default: [
    { id: 'quest1', autoStart: true, prerequisites: [] },
    { id: 'quest2', autoStart: false, prerequisites: ['quest1'] },
    { id: 'quest3', autoStart: false, prerequisites: ['quest1', 'quest2'] },
  ],
}));

vi.mock('../../data/zones.js', () => ({
  ZONES: {},
}));

describe('questSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = questReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        quests: {},
        activeQuestId: null,
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
      });
    });
  });

  describe('initializeQuests', () => {
    const questDefs = [
      { id: 'quest1', autoStart: true, prerequisites: [] },
      { id: 'quest2', autoStart: false, prerequisites: ['quest1'] },
    ];

    it('should initialize quests with correct status', () => {
      const state = questReducer(initialState, initializeQuests(questDefs));

      expect(state.quests['quest1']).toBeDefined();
      expect(state.quests['quest1'].status).toBe('active');
      expect(state.quests['quest2'].status).toBe('locked');
    });

    it('should set active quest to first active quest', () => {
      const state = questReducer(initialState, initializeQuests(questDefs));

      expect(state.activeQuestId).toBe('quest1');
    });

    it('should not reinitialize existing quests', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'completed', progress: 100, rewardClaimed: true },
        },
      };

      const state = questReducer(startState, initializeQuests(questDefs));

      expect(state.quests['quest1'].status).toBe('completed');
      expect(state.quests['quest1'].progress).toBe(100);
    });
  });

  describe('checkPrerequisites', () => {
    const questDefs = [
      { id: 'quest1', prerequisites: [] },
      { id: 'quest2', prerequisites: ['quest1'] },
      { id: 'quest3', prerequisites: ['quest1', 'quest2'] },
    ];

    it('should unlock quest when all prerequisites met', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'completed' },
          quest2: { status: 'locked' },
        },
      };

      const state = questReducer(startState, checkPrerequisites(questDefs));

      expect(state.quests['quest2'].status).toBe('active');
    });

    it('should not unlock quest when prerequisites not met', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'active' },
          quest2: { status: 'completed' },
          quest3: { status: 'locked' },
        },
      };

      const state = questReducer(startState, checkPrerequisites(questDefs));

      expect(state.quests['quest3'].status).toBe('locked');
    });

    it('should not affect already active or completed quests', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'completed' },
          quest2: { status: 'active' },
        },
      };

      const state = questReducer(startState, checkPrerequisites(questDefs));

      expect(state.quests['quest1'].status).toBe('completed');
      expect(state.quests['quest2'].status).toBe('active');
    });
  });

  describe('updateQuestProgress', () => {
    it('should increment quest progress', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'active', progress: 10 },
        },
      };

      const state = questReducer(
        startState,
        updateQuestProgress({ questId: 'quest1', amount: 5 })
      );

      expect(state.quests['quest1'].progress).toBe(15);
    });

    it('should only update active quests', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'completed', progress: 100 },
        },
      };

      const state = questReducer(
        startState,
        updateQuestProgress({ questId: 'quest1', amount: 10 })
      );

      expect(state.quests['quest1'].progress).toBe(100);
    });

    it('should handle quest with undefined progress', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'active' },
        },
      };

      const state = questReducer(
        startState,
        updateQuestProgress({ questId: 'quest1', amount: 5 })
      );

      expect(state.quests['quest1'].progress).toBe(5);
    });
  });

  describe('completeQuest', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-02-09T00:00:00Z'));
    });

    it('should mark quest as completed', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'active', progress: 100 },
        },
      };

      const state = questReducer(startState, completeQuest('quest1'));

      expect(state.quests['quest1'].status).toBe('completed');
      expect(state.quests['quest1'].completedAt).toBeDefined();
    });

    it('should auto-select next active quest', () => {
      const startState = {
        ...initialState,
        activeQuestId: 'quest1',
        quests: {
          quest1: { status: 'active' },
          quest2: { status: 'active' },
        },
      };

      const state = questReducer(startState, completeQuest('quest1'));

      expect(state.activeQuestId).toBe('quest2');
    });

    it('should set activeQuestId to null if no active quests remain', () => {
      const startState = {
        ...initialState,
        activeQuestId: 'quest1',
        quests: {
          quest1: { status: 'active' },
        },
      };

      const state = questReducer(startState, completeQuest('quest1'));

      expect(state.activeQuestId).toBeNull();
    });

    it('should not affect already completed quests', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'completed', completedAt: 12345 },
        },
      };

      const state = questReducer(startState, completeQuest('quest1'));

      expect(state.quests['quest1'].status).toBe('completed');
    });
  });

  describe('claimReward', () => {
    it('should mark reward as claimed', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'completed', rewardClaimed: false },
        },
      };

      const state = questReducer(startState, claimReward('quest1'));

      expect(state.quests['quest1'].rewardClaimed).toBe(true);
    });

    it('should not claim if quest not completed', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'active', rewardClaimed: false },
        },
      };

      const state = questReducer(startState, claimReward('quest1'));

      expect(state.quests['quest1'].rewardClaimed).toBe(false);
    });

    it('should handle already claimed reward', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'completed', rewardClaimed: true },
        },
      };

      const state = questReducer(startState, claimReward('quest1'));

      expect(state.quests['quest1'].rewardClaimed).toBe(true);
    });
  });

  describe('tracking actions', () => {
    it('visitNpc should add NPC to visited list', () => {
      const state = questReducer(initialState, visitNpc('npc_yusuf'));

      expect(state.npcsVisited).toContain('npc_yusuf');
    });

    it('visitNpc should not add duplicates', () => {
      let state = questReducer(initialState, visitNpc('npc_yusuf'));
      state = questReducer(state, visitNpc('npc_yusuf'));

      expect(state.npcsVisited).toEqual(['npc_yusuf']);
    });

    it('visitZone should add zone to visited list', () => {
      const state = questReducer(initialState, visitZone('medina'));

      expect(state.zonesVisited).toContain('medina');
    });

    it('visitZone should not add duplicates', () => {
      let state = questReducer(initialState, visitZone('medina'));
      state = questReducer(state, visitZone('medina'));

      expect(state.zonesVisited).toEqual(['medina']);
    });

    it('completeDialogue should add dialogue to completed list', () => {
      const state = questReducer(initialState, completeDialogue('dialogue_001'));

      expect(state.dialoguesCompleted).toContain('dialogue_001');
    });

    it('recordReviewSession should add session to list', () => {
      const session = { accuracy: 0.85, timestamp: Date.now() };
      const state = questReducer(initialState, recordReviewSession(session));

      expect(state.reviewSessionsCompleted).toHaveLength(1);
      expect(state.reviewSessionsCompleted[0]).toEqual(session);
    });

    it('recordQuizPassed should add quiz to list', () => {
      const quiz = { accuracy: 0.9, timestamp: Date.now() };
      const state = questReducer(initialState, recordQuizPassed(quiz));

      expect(state.quizzesPassed).toHaveLength(1);
      expect(state.quizzesPassed[0]).toEqual(quiz);
    });

    it('recordChestOpened should add chest to list', () => {
      const state = questReducer(initialState, recordChestOpened('chest_001'));

      expect(state.chestsOpened).toContain('chest_001');
    });

    it('recordChestOpened should not add duplicates', () => {
      let state = questReducer(initialState, recordChestOpened('chest_001'));
      state = questReducer(state, recordChestOpened('chest_001'));

      expect(state.chestsOpened).toEqual(['chest_001']);
    });

    it('masterLetter should add letter to mastered list', () => {
      const state = questReducer(initialState, masterLetter('alif'));

      expect(state.lettersMastered).toContain('alif');
    });

    it('incrementSentenceQuizzes should increment counter', () => {
      let state = questReducer(initialState, incrementSentenceQuizzes());
      state = questReducer(state, incrementSentenceQuizzes());

      expect(state.sentenceQuizzesCompleted).toBe(2);
    });
  });

  describe('incrementWordsLearnedToday', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-02-09T00:00:00Z'));
    });

    it('should increment words learned counter', () => {
      const state = questReducer(initialState, incrementWordsLearnedToday());

      expect(state.wordsLearnedToday).toBe(1);
      expect(state.lastResetDate).toBe(new Date('2026-02-09T00:00:00Z').toDateString());
    });

    it('should reset counter on new day', () => {
      const yesterday = new Date('2026-02-08T00:00:00Z').toDateString();
      const startState = {
        ...initialState,
        wordsLearnedToday: 15,
        lastResetDate: yesterday,
      };

      const state = questReducer(startState, incrementWordsLearnedToday());

      expect(state.wordsLearnedToday).toBe(1);
      expect(state.lastResetDate).toBe(new Date('2026-02-09T00:00:00Z').toDateString());
    });

    it('should not reset counter on same day', () => {
      const today = new Date('2026-02-09T00:00:00Z').toDateString();
      const startState = {
        ...initialState,
        wordsLearnedToday: 10,
        lastResetDate: today,
      };

      const state = questReducer(startState, incrementWordsLearnedToday());

      expect(state.wordsLearnedToday).toBe(11);
    });
  });

  describe('setActiveQuest', () => {
    it('should set active quest ID', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'active' },
        },
      };

      const state = questReducer(startState, setActiveQuest('quest1'));

      expect(state.activeQuestId).toBe('quest1');
    });

    it('should clear active quest when null', () => {
      const startState = {
        ...initialState,
        activeQuestId: 'quest1',
      };

      const state = questReducer(startState, setActiveQuest(null));

      expect(state.activeQuestId).toBeNull();
    });

    it('should only set active quests', () => {
      const startState = {
        ...initialState,
        quests: {
          quest1: { status: 'completed' },
        },
      };

      const state = questReducer(startState, setActiveQuest('quest1'));

      expect(state.activeQuestId).toBeNull();
    });
  });

  describe('selectors', () => {
    const mockState = {
      quests: {
        quests: {
          quest1: { status: 'active', progress: 50 },
          quest2: { status: 'active', progress: 30 },
          quest3: { status: 'completed', progress: 100 },
          quest4: { status: 'locked', progress: 0 },
        },
        activeQuestId: 'quest1',
      },
    };

    it('selectAllQuests should return all quests', () => {
      const quests = selectAllQuests(mockState);
      expect(Object.keys(quests)).toHaveLength(4);
    });

    it('selectActiveQuestCount should return count of active quests', () => {
      const count = selectActiveQuestCount(mockState);
      expect(count).toBe(2);
    });
  });
});
