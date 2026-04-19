import { describe, it, expect } from 'vitest';
import dailyGoalsReducer, {
  endSession,
  startSession,
  markWelcomeBackShown,
  resetWelcomeBackShown,
  checkDailyReset,
  updateDailyGoal,
  selectLastSessionSummary,
  selectWelcomeBackShown,
} from '../dailyGoalsSlice.js';

function getInitialState() {
  return JSON.parse(JSON.stringify(dailyGoalsReducer(undefined, { type: '@@INIT' })));
}

describe('dailyGoalsSlice — welcome back & session summary', () => {
  it('endSession snapshots wordsLearned and reviewsDone to lastSession fields', () => {
    let state = getInitialState();
    state.sessionStartTime = Date.now() - 60000;
    state.goals.wordsLearned.current = 5;
    state.goals.reviewsDone.current = 3;

    const next = dailyGoalsReducer(state, endSession());

    expect(next.lastSessionWordsLearned).toBe(5);
    expect(next.lastSessionReviewsDone).toBe(3);
  });

  it('endSession sets lastSessionEndTime to ISO string', () => {
    let state = getInitialState();
    state.sessionStartTime = Date.now() - 60000;

    const next = dailyGoalsReducer(state, endSession());

    expect(next.lastSessionEndTime).toBeTruthy();
    expect(new Date(next.lastSessionEndTime).toISOString()).toBe(next.lastSessionEndTime);
  });

  it('markWelcomeBackShown sets flag to true', () => {
    const state = getInitialState();
    expect(state.welcomeBackShown).toBe(false);

    const next = dailyGoalsReducer(state, markWelcomeBackShown());
    expect(next.welcomeBackShown).toBe(true);
  });

  it('resetWelcomeBackShown sets flag to false', () => {
    let state = getInitialState();
    state.welcomeBackShown = true;

    const next = dailyGoalsReducer(state, resetWelcomeBackShown());
    expect(next.welcomeBackShown).toBe(false);
  });

  it('selectLastSessionSummary returns correct shape', () => {
    let state = getInitialState();
    state.lastSessionWordsLearned = 7;
    state.lastSessionReviewsDone = 4;
    state.lastSessionEndTime = '2026-03-24T10:00:00.000Z';

    const result = selectLastSessionSummary({ dailyGoals: state });

    expect(result).toEqual({
      wordsLearned: 7,
      reviewsDone: 4,
      endTime: '2026-03-24T10:00:00.000Z',
    });
  });

  it('daily reset clears welcomeBackShown to false', () => {
    let state = getInitialState();
    state.welcomeBackShown = true;
    state.date = '2026-01-01';

    const next = dailyGoalsReducer(state, checkDailyReset());
    expect(next.welcomeBackShown).toBe(false);
  });
});
