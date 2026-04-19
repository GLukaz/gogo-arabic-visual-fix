import { describe, it, expect } from 'vitest';
import difficultyReducer, {
  recordResult,
  startSession,
  endSession,
  acknowledgeBreak,
  adjustDifficulty,
  suggestBreak,
  resetDailyWordCount,
  incrementNewWords,
  selectDifficultyLevel,
  selectRecentResults,
  selectSessionStats,
  selectShouldBreak,
  selectNewWordBudget,
  selectRecentAccuracy,
  selectHistoricalSessions,
} from '../difficultySlice.js';

function getInitialState() {
  return JSON.parse(JSON.stringify(difficultyReducer(undefined, { type: '@@INIT' })));
}

/** Helper to build root state shape for selectors. */
function rootState(sliceState) {
  return { difficulty: sliceState };
}

// ============================================================
// INITIAL STATE
// ============================================================

describe('difficultySlice — initial state', () => {
  it('has correct initial values', () => {
    const state = getInitialState();
    expect(state.currentLevel).toBe('medium');
    expect(state.recentResults).toEqual([]);
    expect(state.sessionStart).toBeNull();
    expect(state.questionsThisSession).toBe(0);
    expect(state.consecutiveErrors).toBe(0);
    expect(state.breakSuggested).toBe(false);
    expect(state.historicalSessions).toEqual([]);
    expect(state.newWordsToday).toBe(0);
    expect(state.maxNewWordsToday).toBe(5);
  });
});

// ============================================================
// recordResult
// ============================================================

describe('difficultySlice — recordResult', () => {
  it('adds a result to recentResults', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, recordResult({
      correct: true,
      timeMs: 2000,
      type: 'ar-to-en',
      timestamp: 1000,
    }));
    expect(next.recentResults).toHaveLength(1);
    expect(next.recentResults[0].correct).toBe(true);
    expect(next.recentResults[0].timeMs).toBe(2000);
    expect(next.recentResults[0].type).toBe('ar-to-en');
  });

  it('increments questionsThisSession', () => {
    let state = getInitialState();
    state = difficultyReducer(state, recordResult({ correct: true, timeMs: 1000, type: 'test' }));
    expect(state.questionsThisSession).toBe(1);
    state = difficultyReducer(state, recordResult({ correct: false, timeMs: 1000, type: 'test' }));
    expect(state.questionsThisSession).toBe(2);
  });

  it('tracks consecutive errors', () => {
    let state = getInitialState();
    state = difficultyReducer(state, recordResult({ correct: false, timeMs: 1000, type: 'test' }));
    expect(state.consecutiveErrors).toBe(1);
    state = difficultyReducer(state, recordResult({ correct: false, timeMs: 1000, type: 'test' }));
    expect(state.consecutiveErrors).toBe(2);
  });

  it('resets consecutive errors on correct answer', () => {
    let state = getInitialState();
    state = difficultyReducer(state, recordResult({ correct: false, timeMs: 1000, type: 'test' }));
    state = difficultyReducer(state, recordResult({ correct: false, timeMs: 1000, type: 'test' }));
    expect(state.consecutiveErrors).toBe(2);
    state = difficultyReducer(state, recordResult({ correct: true, timeMs: 1000, type: 'test' }));
    expect(state.consecutiveErrors).toBe(0);
  });

  it('caps recentResults at 50 entries', () => {
    let state = getInitialState();
    for (let i = 0; i < 55; i++) {
      state = difficultyReducer(state, recordResult({
        correct: i % 2 === 0,
        timeMs: 1000,
        type: 'test',
        timestamp: i,
      }));
    }
    expect(state.recentResults).toHaveLength(50);
    // Oldest entries should have been shifted off
    expect(state.recentResults[0].timestamp).toBe(5);
  });

  it('defaults missing fields', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, recordResult({ correct: true }));
    expect(next.recentResults[0].timeMs).toBe(0);
    expect(next.recentResults[0].type).toBe('unknown');
    expect(next.recentResults[0].timestamp).toBeGreaterThan(0);
  });
});

// ============================================================
// startSession
// ============================================================

describe('difficultySlice — startSession', () => {
  it('sets sessionStart timestamp', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, startSession({ timestamp: 1234567890 }));
    expect(next.sessionStart).toBe(1234567890);
    expect(next.questionsThisSession).toBe(0);
    expect(next.consecutiveErrors).toBe(0);
    expect(next.breakSuggested).toBe(false);
  });

  it('defaults to Date.now() when no timestamp provided', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, startSession());
    expect(next.sessionStart).toBeGreaterThan(0);
  });

  it('resets session state', () => {
    let state = getInitialState();
    state = difficultyReducer(state, recordResult({ correct: false, timeMs: 1000, type: 'test' }));
    state = difficultyReducer(state, recordResult({ correct: false, timeMs: 1000, type: 'test' }));
    state = difficultyReducer(state, suggestBreak());
    expect(state.breakSuggested).toBe(true);
    state = difficultyReducer(state, startSession({ timestamp: 5000 }));
    expect(state.questionsThisSession).toBe(0);
    expect(state.consecutiveErrors).toBe(0);
    expect(state.breakSuggested).toBe(false);
  });
});

// ============================================================
// endSession
// ============================================================

describe('difficultySlice — endSession', () => {
  it('adds session to historicalSessions', () => {
    const startTime = 1711540000000; // Fixed timestamp
    const endTime = startTime + 600000; // 10 minutes later

    let state = getInitialState();
    state = difficultyReducer(state, startSession({ timestamp: startTime }));
    state = difficultyReducer(state, recordResult({ correct: true, timeMs: 1000, type: 'test', timestamp: startTime + 1000 }));
    state = difficultyReducer(state, recordResult({ correct: false, timeMs: 1000, type: 'test', timestamp: startTime + 2000 }));
    state = difficultyReducer(state, endSession({ timestamp: endTime }));

    expect(state.historicalSessions).toHaveLength(1);
    expect(state.historicalSessions[0].questionsAnswered).toBe(2);
    expect(state.historicalSessions[0].accuracy).toBe(0.5);
    expect(state.historicalSessions[0].duration).toBe(10); // 10 minutes
  });

  it('resets session state', () => {
    let state = getInitialState();
    state = difficultyReducer(state, startSession({ timestamp: 0 }));
    state = difficultyReducer(state, recordResult({ correct: true, timeMs: 1000, type: 'test' }));
    state = difficultyReducer(state, endSession({ timestamp: 300000 }));

    expect(state.sessionStart).toBeNull();
    expect(state.questionsThisSession).toBe(0);
    expect(state.consecutiveErrors).toBe(0);
    expect(state.breakSuggested).toBe(false);
  });

  it('does nothing without an active session', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, endSession());
    expect(next.historicalSessions).toEqual([]);
  });

  it('caps historicalSessions at 14 entries', () => {
    let state = getInitialState();
    for (let i = 0; i < 16; i++) {
      state = difficultyReducer(state, startSession({ timestamp: i * 1000000 }));
      state = difficultyReducer(state, endSession({ timestamp: i * 1000000 + 600000 }));
    }
    expect(state.historicalSessions).toHaveLength(14);
  });

  it('calculates 0 accuracy for session with no questions', () => {
    let state = getInitialState();
    state = difficultyReducer(state, startSession({ timestamp: 0 }));
    state = difficultyReducer(state, endSession({ timestamp: 60000 }));

    expect(state.historicalSessions[0].accuracy).toBe(0);
  });
});

// ============================================================
// acknowledgeBreak
// ============================================================

describe('difficultySlice — acknowledgeBreak', () => {
  it('sets breakSuggested to false', () => {
    let state = getInitialState();
    state.breakSuggested = true;
    state = difficultyReducer(state, acknowledgeBreak());
    expect(state.breakSuggested).toBe(false);
  });
});

// ============================================================
// adjustDifficulty
// ============================================================

describe('difficultySlice — adjustDifficulty', () => {
  it('updates level and maxNewWords', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, adjustDifficulty({ level: 'hard', maxNewWords: 8 }));
    expect(next.currentLevel).toBe('hard');
    expect(next.maxNewWordsToday).toBe(8);
  });

  it('ignores invalid difficulty levels', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, adjustDifficulty({ level: 'nightmare', maxNewWords: 5 }));
    expect(next.currentLevel).toBe('medium'); // unchanged
  });

  it('allows setting maxNewWords to 0', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, adjustDifficulty({ level: 'easy', maxNewWords: 0 }));
    expect(next.maxNewWordsToday).toBe(0);
  });

  it('handles partial payload (only level)', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, adjustDifficulty({ level: 'easy' }));
    expect(next.currentLevel).toBe('easy');
    expect(next.maxNewWordsToday).toBe(5); // unchanged
  });

  it('handles partial payload (only maxNewWords)', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, adjustDifficulty({ maxNewWords: 10 }));
    expect(next.currentLevel).toBe('medium'); // unchanged
    expect(next.maxNewWordsToday).toBe(10);
  });
});

// ============================================================
// suggestBreak
// ============================================================

describe('difficultySlice — suggestBreak', () => {
  it('sets breakSuggested to true', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, suggestBreak());
    expect(next.breakSuggested).toBe(true);
  });
});

// ============================================================
// resetDailyWordCount
// ============================================================

describe('difficultySlice — resetDailyWordCount', () => {
  it('resets newWordsToday to 0', () => {
    let state = getInitialState();
    state.newWordsToday = 5;
    state = difficultyReducer(state, resetDailyWordCount());
    expect(state.newWordsToday).toBe(0);
  });
});

// ============================================================
// incrementNewWords
// ============================================================

describe('difficultySlice — incrementNewWords', () => {
  it('increments by 1 by default', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, incrementNewWords());
    expect(next.newWordsToday).toBe(1);
  });

  it('increments by payload amount', () => {
    const state = getInitialState();
    const next = difficultyReducer(state, incrementNewWords(3));
    expect(next.newWordsToday).toBe(3);
  });
});

// ============================================================
// SELECTORS
// ============================================================

describe('difficultySlice — selectors', () => {
  it('selectDifficultyLevel returns currentLevel', () => {
    const state = getInitialState();
    expect(selectDifficultyLevel(rootState(state))).toBe('medium');
  });

  it('selectDifficultyLevel returns medium for missing state', () => {
    expect(selectDifficultyLevel({})).toBe('medium');
  });

  it('selectRecentResults returns results array', () => {
    let state = getInitialState();
    state = difficultyReducer(state, recordResult({ correct: true, timeMs: 1000, type: 'test' }));
    expect(selectRecentResults(rootState(state))).toHaveLength(1);
  });

  it('selectRecentResults returns empty array for missing state', () => {
    expect(selectRecentResults({})).toEqual([]);
  });

  it('selectShouldBreak returns breakSuggested', () => {
    let state = getInitialState();
    expect(selectShouldBreak(rootState(state))).toBe(false);
    state = difficultyReducer(state, suggestBreak());
    expect(selectShouldBreak(rootState(state))).toBe(true);
  });

  it('selectNewWordBudget calculates remaining words', () => {
    let state = getInitialState();
    state.newWordsToday = 3;
    state.maxNewWordsToday = 8;
    const budget = selectNewWordBudget(rootState(state));
    expect(budget.used).toBe(3);
    expect(budget.max).toBe(8);
    expect(budget.remaining).toBe(5);
  });

  it('selectNewWordBudget remaining never goes negative', () => {
    let state = getInitialState();
    state.newWordsToday = 10;
    state.maxNewWordsToday = 5;
    const budget = selectNewWordBudget(rootState(state));
    expect(budget.remaining).toBe(0);
  });

  it('selectNewWordBudget defaults for missing state', () => {
    const budget = selectNewWordBudget({});
    expect(budget).toEqual({ used: 0, max: 5, remaining: 5 });
  });

  it('selectRecentAccuracy calculates from last 20 results', () => {
    let state = getInitialState();
    // Add 10 correct, 10 incorrect
    for (let i = 0; i < 20; i++) {
      state = difficultyReducer(state, recordResult({
        correct: i < 10,
        timeMs: 1000,
        type: 'test',
        timestamp: i,
      }));
    }
    const accuracy = selectRecentAccuracy(rootState(state));
    expect(accuracy).toBe(0.5);
  });

  it('selectRecentAccuracy returns 0 for no results', () => {
    expect(selectRecentAccuracy(rootState(getInitialState()))).toBe(0);
  });

  it('selectHistoricalSessions returns array', () => {
    expect(selectHistoricalSessions(rootState(getInitialState()))).toEqual([]);
  });

  it('selectHistoricalSessions returns empty for missing state', () => {
    expect(selectHistoricalSessions({})).toEqual([]);
  });
});
