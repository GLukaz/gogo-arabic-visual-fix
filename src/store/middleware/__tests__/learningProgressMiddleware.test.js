import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { learningProgressMiddleware } from '../learningProgressMiddleware.js';
import skillTreeReducer from '../../slices/skillTreeSlice.js';
import grammarReducer, { completeLesson } from '../../slices/grammarSlice.js';
import questReducer, { completeQuest } from '../../slices/questSlice.js';
import achievementReducer, { recordPerfectQuiz, incrementReviews } from '../../slices/achievementSlice.js';
import alphabetReducer, { completeGroup } from '../../slices/alphabetSlice.js';
import poetryReducer, { endPoetryBattle } from '../../slices/poetrySlice.js';
import playerReducer from '../../slices/playerSlice.js';

function buildStore() {
  return configureStore({
    reducer: {
      skillTree: skillTreeReducer,
      grammar: grammarReducer,
      quests: questReducer,
      achievements: achievementReducer,
      alphabet: alphabetReducer,
      poetry: poetryReducer,
      player: playerReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(learningProgressMiddleware),
  });
}

describe('learningProgressMiddleware XP routing', () => {
  let store;

  beforeEach(() => {
    store = buildStore();
  });

  it('grammar/completeLesson awards 40 XP to grammar tree', () => {
    store.dispatch(completeLesson({ lessonId: 'al-definite', exerciseScore: 100, quizScore: 100 }));
    expect(store.getState().skillTree.skillXP.grammar).toBe(40);
  });

  it('quests/completeQuest awards 30 XP to culture tree', () => {
    // Dispatch the action directly — middleware fires regardless of quest state
    store.dispatch({ type: 'quests/completeQuest', payload: 'quest_oasis_welcome' });
    expect(store.getState().skillTree.skillXP.culture).toBe(30);
  });

  it('achievements/recordPerfectQuiz awards 20 XP to reading tree', () => {
    store.dispatch(recordPerfectQuiz());
    expect(store.getState().skillTree.skillXP.reading).toBe(20);
  });

  it('achievements/incrementReviews awards 10 XP to reading tree', () => {
    store.dispatch(incrementReviews());
    expect(store.getState().skillTree.skillXP.reading).toBe(10);
  });

  it('alphabet/completeGroup awards 25 XP to writing tree', () => {
    store.dispatch(completeGroup('hamza'));
    expect(store.getState().skillTree.skillXP.writing).toBe(25);
  });

  it('poetry/endPoetryBattle (won: true) awards 30 XP each to speaking and culture', () => {
    // Need activeBattle to exist for the reducer, but middleware fires regardless
    store.dispatch(endPoetryBattle({ won: true, playerScore: 3, npcScore: 1 }));
    expect(store.getState().skillTree.skillXP.speaking).toBe(30);
    expect(store.getState().skillTree.skillXP.culture).toBe(30);
  });

  it('poetry/endPoetryBattle (won: false) awards 0 XP', () => {
    store.dispatch(endPoetryBattle({ won: false, playerScore: 1, npcScore: 3 }));
    expect(store.getState().skillTree.skillXP.speaking).toBe(0);
    expect(store.getState().skillTree.skillXP.culture).toBe(0);
  });

  it('unknown action types do not award any XP', () => {
    store.dispatch({ type: 'unknown/someAction', payload: {} });
    const xp = store.getState().skillTree.skillXP;
    expect(xp.grammar).toBe(0);
    expect(xp.reading).toBe(0);
    expect(xp.writing).toBe(0);
    expect(xp.speaking).toBe(0);
    expect(xp.culture).toBe(0);
    expect(xp.listening).toBe(0);
  });

  it('multiple events accumulate XP correctly', () => {
    store.dispatch(completeLesson({ lessonId: 'al-definite', exerciseScore: 100, quizScore: 100 }));
    store.dispatch(completeLesson({ lessonId: 'personal-pronouns', exerciseScore: 90, quizScore: 95 }));
    expect(store.getState().skillTree.skillXP.grammar).toBe(80); // 2 * 40
  });

  it('recording reviews awards reading XP cumulatively', () => {
    store.dispatch(incrementReviews());
    store.dispatch(incrementReviews());
    store.dispatch(incrementReviews());
    expect(store.getState().skillTree.skillXP.reading).toBe(30); // 3 * 10
  });

  it('grammar/completeLesson dispatches unlockNextLesson to grammarSlice', () => {
    // al-definite is order 1 — next lesson by order is noun-adjective-agreement (order 2)
    store.dispatch(completeLesson({ lessonId: 'al-definite', exerciseScore: 100, quizScore: 100 }));
    expect(store.getState().grammar.unlockedLessons).toContain('noun-adjective-agreement');
  });

  it('completing last lesson does not crash unlockNextLesson', () => {
    // Dispatch completion for the highest-order lesson
    // (formal-letter is order 42 — no lesson after it)
    store.dispatch(completeLesson({ lessonId: 'formal-letter', exerciseScore: 100, quizScore: 100 }));
    // Should not throw, unlockedLessons should not have undefined added
    const unlocked = store.getState().grammar.unlockedLessons;
    expect(unlocked).not.toContain(undefined);
  });
});
