import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// All slice reducers
import playerReducer from '../slices/playerSlice.js';
import vocabularyReducer from '../slices/vocabularySlice.js';
import questReducer from '../slices/questSlice.js';
import npcReducer from '../slices/npcSlice.js';
import alphabetReducer from '../slices/alphabetSlice.js';
import settingsReducer from '../slices/settingsSlice.js';
import uiReducer from '../slices/uiSlice.js';
import syncReducer from '../slices/syncSlice.js';
import achievementReducer from '../slices/achievementSlice.js';
import dailyGoalsReducer from '../slices/dailyGoalsSlice.js';
import battleReducer from '../slices/battleSlice.js';
import grammarReducer from '../slices/grammarSlice.js';
import narrativeReducer from '../slices/narrativeSlice.js';
import magicReducer from '../slices/magicSlice.js';
import inventoryReducer from '../slices/inventorySlice.js';
import economyReducer from '../slices/economySlice.js';
import companionReducer from '../slices/companionSlice.js';
import arenaReducer from '../slices/arenaSlice.js';
import codexReducer from '../slices/codexSlice.js';
import craftingReducer from '../slices/craftingSlice.js';
import endgameReducer from '../slices/endgameSlice.js';
import factionReducer from '../slices/factionSlice.js';
import homeReducer from '../slices/homeSlice.js';
import journalReducer from '../slices/journalSlice.js';
import skillTreeReducer from '../slices/skillTreeSlice.js';
import statsReducer from '../slices/statsSlice.js';
import timeReducer from '../slices/timeSlice.js';
import weatherReducer from '../slices/weatherSlice.js';
import worldStateReducer from '../slices/worldStateSlice.js';
import cefrProgressReducer from '../slices/cefrProgressSlice.js';

// Quest actions
import {
  initializeQuests,
  checkPrerequisites,
  updateQuestProgress,
  completeQuest,
  claimReward,
  visitNpc,
  visitZone,
  completeDialogue,
  recordReviewSession,
} from '../slices/questSlice.js';

// Quest selectors
import {
  selectAllQuests,
  selectActiveQuests,
  selectCompletedQuests,
} from '../slices/questSlice.js';

// Skill tree selectors
import { selectSkillXP } from '../slices/skillTreeSlice.js';

// Middleware
import { learningProgressMiddleware } from '../middleware/learningProgressMiddleware.js';

const rootReducer = combineReducers({
  player: playerReducer,
  vocabulary: vocabularyReducer,
  quests: questReducer,
  npc: npcReducer,
  alphabet: alphabetReducer,
  settings: settingsReducer,
  ui: uiReducer,
  sync: syncReducer,
  achievements: achievementReducer,
  dailyGoals: dailyGoalsReducer,
  battle: battleReducer,
  grammar: grammarReducer,
  narrative: narrativeReducer,
  magic: magicReducer,
  inventory: inventoryReducer,
  economy: economyReducer,
  companions: companionReducer,
  arena: arenaReducer,
  codex: codexReducer,
  crafting: craftingReducer,
  endgame: endgameReducer,
  faction: factionReducer,
  home: homeReducer,
  journal: journalReducer,
  skillTree: skillTreeReducer,
  stats: statsReducer,
  time: timeReducer,
  weather: weatherReducer,
  worldState: worldStateReducer,
  cefrProgress: cefrProgressReducer,
});

// Test quest definitions — self-contained, no dependency on quests.json
const TEST_QUESTS = [
  {
    id: 'quest_greet',
    title: 'Greetings',
    autoStart: true,
    prerequisites: [],
    target: 5,
    trackEvent: 'word_learned',
    reward: { xp: 100, dirhams: 50 },
  },
  {
    id: 'quest_explore',
    title: 'Explore the Oasis',
    autoStart: true,
    prerequisites: [],
    target: 3,
    trackEvent: 'zone_visited',
    reward: { xp: 150, dirhams: 75 },
  },
  {
    id: 'quest_advanced',
    title: 'Scholar Path',
    autoStart: false,
    prerequisites: ['quest_greet'],
    target: 10,
    trackEvent: 'word_learned',
    reward: { xp: 300, dirhams: 100 },
  },
  {
    id: 'quest_final',
    title: 'Master Quest',
    autoStart: false,
    prerequisites: ['quest_greet', 'quest_explore'],
    target: 1,
    trackEvent: 'npc_visited',
    reward: { xp: 500, dirhams: 200 },
  },
];

function createQuestStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

function createQuestStoreWithMiddleware(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().concat(learningProgressMiddleware),
    preloadedState,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Quest System — Integration Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Quest System — Integration Tests', () => {
  // ─── Group 1: Quest Initialization ───────────────────────────────────────

  describe('Quest Initialization', () => {
    it('Q1: initializeQuests creates active quests from autoStart entries', () => {
      const store = createQuestStore();
      store.dispatch(initializeQuests(TEST_QUESTS));

      const quests = selectAllQuests(store.getState());
      expect(quests['quest_greet'].status).toBe('active');
      expect(quests['quest_explore'].status).toBe('active');
      expect(quests['quest_advanced'].status).toBe('locked');
      expect(quests['quest_final'].status).toBe('locked');
      expect(store.getState().quests.activeQuestId).toBe('quest_greet');
    });

    it('Q2: initializeQuests preserves previously saved quest data', () => {
      const store = createQuestStore({
        quests: {
          quests: {
            quest_greet: { status: 'completed', progress: 5, rewardClaimed: true },
          },
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
        },
      });

      store.dispatch(initializeQuests(TEST_QUESTS));

      const quests = selectAllQuests(store.getState());
      // Preserved from preloaded state
      expect(quests['quest_greet'].status).toBe('completed');
      expect(quests['quest_greet'].rewardClaimed).toBe(true);
      // New quests initialized
      expect(quests['quest_explore'].status).toBe('active');
      expect(quests['quest_advanced'].status).toBe('locked');
    });

    it('Q3: auto-selects first active quest when current is invalid', () => {
      const store = createQuestStore({
        quests: {
          quests: {
            quest_greet: { status: 'completed', progress: 5, rewardClaimed: false },
          },
          activeQuestId: 'quest_greet', // points to completed quest
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

      store.dispatch(initializeQuests(TEST_QUESTS));

      // Should auto-select first active quest (quest_explore)
      expect(store.getState().quests.activeQuestId).toBe('quest_explore');
    });
  });

  // ─── Group 2: Quest Progress Tracking ────────────────────────────────────

  describe('Quest Progress Tracking', () => {
    let store;

    beforeEach(() => {
      store = createQuestStore();
      store.dispatch(initializeQuests(TEST_QUESTS));
    });

    it('Q4: updateQuestProgress increments progress for active quests', () => {
      store.dispatch(updateQuestProgress({ questId: 'quest_greet', amount: 3 }));

      const quests = selectAllQuests(store.getState());
      expect(quests['quest_greet'].progress).toBe(3);
    });

    it('Q5: tracking actions populate tracking arrays', () => {
      store.dispatch(visitNpc('npc_yusuf'));
      store.dispatch(visitZone('desert'));
      store.dispatch(completeDialogue('merchant_talk'));
      store.dispatch(recordReviewSession({ accuracy: 85, timestamp: Date.now() }));

      const state = store.getState().quests;
      expect(state.npcsVisited).toContain('npc_yusuf');
      expect(state.zonesVisited).toContain('desert');
      expect(state.dialoguesCompleted).toContain('merchant_talk');
      expect(state.reviewSessionsCompleted).toHaveLength(1);
      expect(state.reviewSessionsCompleted[0].accuracy).toBe(85);
    });

    it('Q6: updateQuestProgress is no-op for locked quests', () => {
      store.dispatch(updateQuestProgress({ questId: 'quest_advanced', amount: 5 }));

      const quests = selectAllQuests(store.getState());
      expect(quests['quest_advanced'].progress).toBe(0);
      expect(quests['quest_advanced'].status).toBe('locked');
    });
  });

  // ─── Group 3: Quest Completion Flow ──────────────────────────────────────

  describe('Quest Completion Flow', () => {
    let store;

    beforeEach(() => {
      store = createQuestStore();
      store.dispatch(initializeQuests(TEST_QUESTS));
    });

    it('Q7: completeQuest marks quest completed and auto-selects next active', () => {
      expect(store.getState().quests.activeQuestId).toBe('quest_greet');

      store.dispatch(completeQuest('quest_greet'));

      const state = store.getState();
      const quests = selectAllQuests(state);
      expect(quests['quest_greet'].status).toBe('completed');
      expect(quests['quest_greet'].completedAt).toBeGreaterThan(0);
      // Auto-selects next active quest
      expect(state.quests.activeQuestId).toBe('quest_explore');
    });

    it('Q8: complete quest then checkPrerequisites unlocks dependent quests', () => {
      store.dispatch(completeQuest('quest_greet'));
      store.dispatch(checkPrerequisites(TEST_QUESTS));

      const quests = selectAllQuests(store.getState());
      // quest_advanced depends on quest_greet only → should be active
      expect(quests['quest_advanced'].status).toBe('active');
      // quest_final depends on both quest_greet AND quest_explore → still locked
      expect(quests['quest_final'].status).toBe('locked');
    });

    it('Q9: quest with multiple prerequisites only unlocks when ALL are met', () => {
      // Complete only quest_greet
      store.dispatch(completeQuest('quest_greet'));
      store.dispatch(checkPrerequisites(TEST_QUESTS));

      let quests = selectAllQuests(store.getState());
      expect(quests['quest_final'].status).toBe('locked');

      // Now complete quest_explore too
      store.dispatch(completeQuest('quest_explore'));
      store.dispatch(checkPrerequisites(TEST_QUESTS));

      quests = selectAllQuests(store.getState());
      expect(quests['quest_final'].status).toBe('active');
    });
  });

  // ─── Group 4: Rewards & Cross-Slice Effects ──────────────────────────────

  describe('Rewards & Cross-Slice Effects', () => {
    it('Q10: claimReward marks reward as claimed', () => {
      const store = createQuestStore();
      store.dispatch(initializeQuests(TEST_QUESTS));
      store.dispatch(completeQuest('quest_greet'));
      store.dispatch(claimReward('quest_greet'));

      const quests = selectAllQuests(store.getState());
      expect(quests['quest_greet'].rewardClaimed).toBe(true);
    });

    it('Q11: claimReward is no-op if quest not completed or already claimed', () => {
      const store = createQuestStore();
      store.dispatch(initializeQuests(TEST_QUESTS));

      // Try claiming on active quest — no change
      store.dispatch(claimReward('quest_greet'));
      let quests = selectAllQuests(store.getState());
      expect(quests['quest_greet'].rewardClaimed).toBe(false);

      // Complete and claim
      store.dispatch(completeQuest('quest_greet'));
      store.dispatch(claimReward('quest_greet'));
      quests = selectAllQuests(store.getState());
      expect(quests['quest_greet'].rewardClaimed).toBe(true);

      // Claim again — idempotent, no error
      store.dispatch(claimReward('quest_greet'));
      quests = selectAllQuests(store.getState());
      expect(quests['quest_greet'].rewardClaimed).toBe(true);
    });

    it('Q12: quest completion awards Culture skill tree XP via middleware', () => {
      const store = createQuestStoreWithMiddleware();
      store.dispatch(initializeQuests(TEST_QUESTS));

      const initialXP = selectSkillXP('culture')(store.getState());

      store.dispatch(completeQuest('quest_greet'));

      expect(selectSkillXP('culture')(store.getState())).toBe(initialXP + 30);
    });
  });
});
