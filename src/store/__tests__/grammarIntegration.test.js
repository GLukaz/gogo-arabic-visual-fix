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

// Grammar actions
import {
  startLesson,
  completeLesson,
  clearCurrentLesson,
  bulkUnlockLessons,
} from '../slices/grammarSlice.js';

// Grammar selectors
import {
  selectCompletedLessons,
  selectUnlockedLessons,
  selectIsLessonUnlocked,
  selectLessonScore,
  selectLessonsByCategory,
} from '../slices/grammarSlice.js';

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

function createGrammarStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

function createGrammarStoreWithMiddleware(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().concat(learningProgressMiddleware),
    preloadedState,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Grammar System — Integration Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Grammar System — Integration Tests', () => {
  // ─── Group 1: Lesson Lifecycle ───────────────────────────────────────────

  describe('Lesson Lifecycle', () => {
    let store;

    beforeEach(() => {
      store = createGrammarStore();
    });

    it('G1: startLesson sets currentLessonId', () => {
      store.dispatch(startLesson('al-definite'));
      expect(store.getState().grammar.currentLessonId).toBe('al-definite');
    });

    it('G2: completeLesson records scores and marks complete', () => {
      store.dispatch(startLesson('al-definite'));
      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 85,
        quizScore: 90,
      }));

      const state = store.getState();
      expect(selectCompletedLessons(state)).toContain('al-definite');

      const score = selectLessonScore('al-definite')(state);
      expect(score.exerciseScore).toBe(85);
      expect(score.quizScore).toBe(90);
      expect(score.attempts).toBe(1);
      expect(score.lastAttempt).toBeTruthy();
    });

    it('G3: completing lesson twice keeps best scores', () => {
      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 85,
        quizScore: 90,
      }));
      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 70,
        quizScore: 95,
      }));

      const score = selectLessonScore('al-definite')(store.getState());
      expect(score.exerciseScore).toBe(85); // kept higher
      expect(score.quizScore).toBe(95);     // updated to higher
      expect(score.attempts).toBe(2);
    });

    it('G4: clearCurrentLesson resets after navigation', () => {
      store.dispatch(startLesson('al-definite'));
      expect(store.getState().grammar.currentLessonId).toBe('al-definite');

      store.dispatch(clearCurrentLesson());
      expect(store.getState().grammar.currentLessonId).toBeNull();
    });
  });

  // ─── Group 2: Lesson Unlocking Chain ─────────────────────────────────────

  describe('Lesson Unlocking Chain', () => {
    it('G5: completing a lesson auto-unlocks the next via middleware', () => {
      const store = createGrammarStoreWithMiddleware();

      const initialUnlocked = selectUnlockedLessons(store.getState());
      expect(initialUnlocked).toContain('al-definite');

      // Complete the first lesson — middleware should unlock the next
      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 80,
        quizScore: 80,
      }));

      const updatedUnlocked = selectUnlockedLessons(store.getState());
      // Should have more than just al-definite now
      expect(updatedUnlocked.length).toBeGreaterThan(initialUnlocked.length);
    });

    it('G6: bulkUnlockLessons unlocks multiple without marking complete', () => {
      const store = createGrammarStore();

      store.dispatch(bulkUnlockLessons([
        'al-definite',
        'pronouns-personal',
        'verb-present',
      ]));

      const state = store.getState();
      const unlocked = selectUnlockedLessons(state);
      expect(unlocked).toContain('al-definite');
      expect(unlocked).toContain('pronouns-personal');
      expect(unlocked).toContain('verb-present');
      // Not completed — only unlocked
      expect(selectCompletedLessons(state)).toHaveLength(0);
    });

    it('G7: lesson not in unlockedLessons shows as not unlocked', () => {
      const store = createGrammarStore();

      // Some arbitrary lesson ID that is not in the default unlocked list
      expect(selectIsLessonUnlocked('advanced-b2-subjunctive')(store.getState())).toBe(false);
    });
  });

  // ─── Group 3: Grammar → Skill Tree XP ───────────────────────────────────

  describe('Grammar → Skill Tree XP', () => {
    it('G8: completing lesson awards 40 Grammar skill tree XP via middleware', () => {
      const store = createGrammarStoreWithMiddleware();

      const initialXP = selectSkillXP('grammar')(store.getState());

      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 80,
        quizScore: 80,
      }));

      const updatedXP = selectSkillXP('grammar')(store.getState());
      expect(updatedXP).toBe(initialXP + 40);
    });

    it('G9: multiple lesson completions accumulate XP', () => {
      const store = createGrammarStoreWithMiddleware();

      const initialXP = selectSkillXP('grammar')(store.getState());

      store.dispatch(completeLesson({ lessonId: 'al-definite', exerciseScore: 80, quizScore: 80 }));
      store.dispatch(completeLesson({ lessonId: 'pronouns-personal', exerciseScore: 80, quizScore: 80 }));
      store.dispatch(completeLesson({ lessonId: 'verb-present', exerciseScore: 80, quizScore: 80 }));

      expect(selectSkillXP('grammar')(store.getState())).toBe(initialXP + 120);
    });

    it('G10: re-completing a lesson still awards XP', () => {
      const store = createGrammarStoreWithMiddleware();

      const initialXP = selectSkillXP('grammar')(store.getState());

      store.dispatch(completeLesson({ lessonId: 'al-definite', exerciseScore: 80, quizScore: 80 }));
      store.dispatch(completeLesson({ lessonId: 'al-definite', exerciseScore: 90, quizScore: 95 }));

      // Middleware fires on every completeLesson dispatch
      expect(selectSkillXP('grammar')(store.getState())).toBe(initialXP + 80);
    });
  });

  // ─── Group 4: CEFR Gating ───────────────────────────────────────────────

  describe('CEFR Gating', () => {
    it('G11: B1 lessons locked when grammar tree has < 3 unlocked nodes', () => {
      const store = createGrammarStore({
        skillTree: {
          unlockedNodes: { grammar: ['g_01', 'g_02'], reading: [], writing: [], listening: [], speaking: [], culture: [] },
          skillXP: { grammar: 0, reading: 0, writing: 0, listening: 0, speaking: 0, culture: 0 },
        },
      });

      const categories = selectLessonsByCategory(store.getState());

      // Find any B1 lesson across all categories
      let foundB1Locked = false;
      for (const lessons of Object.values(categories)) {
        for (const lesson of lessons) {
          if (lesson.cefrLevel === 'B1') {
            expect(lesson.isCefrLocked).toBe(true);
            foundB1Locked = true;
          }
        }
      }
      expect(foundB1Locked).toBe(true);
    });

    it('G12: B1 lessons unlock when grammar tree reaches 3+ nodes', () => {
      const store = createGrammarStore({
        skillTree: {
          unlockedNodes: { grammar: ['g_01', 'g_02', 'g_03'], reading: [], writing: [], listening: [], speaking: [], culture: [] },
          skillXP: { grammar: 0, reading: 0, writing: 0, listening: 0, speaking: 0, culture: 0 },
        },
      });

      const categories = selectLessonsByCategory(store.getState());

      // Find any B1 lesson — should NOT be CEFR-locked
      let foundB1Unlocked = false;
      for (const lessons of Object.values(categories)) {
        for (const lesson of lessons) {
          if (lesson.cefrLevel === 'B1') {
            expect(lesson.isCefrLocked).toBe(false);
            foundB1Unlocked = true;
          }
        }
      }
      expect(foundB1Unlocked).toBe(true);
    });
  });
});
