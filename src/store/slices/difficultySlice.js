/**
 * Difficulty Slice — Tracks difficulty calibration state.
 *
 * Phase 87: Difficulty Curve Engine
 *
 * State:
 *   currentLevel        — one of DIFFICULTY_LEVELS ('beginner'|'easy'|'medium'|'hard'|'expert')
 *   recentResults       — last 50 results: [{ correct, timeMs, type, timestamp }]
 *   sessionStart        — timestamp of current session start (ms)
 *   questionsThisSession — questions answered in current session
 *   consecutiveErrors   — current streak of consecutive wrong answers
 *   breakSuggested      — whether a break has been suggested (pending acknowledgement)
 *   historicalSessions  — last 14: [{ duration, questionsAnswered, accuracy, date }]
 *   newWordsToday       — new words introduced today
 *   maxNewWordsToday    — max new words allowed today (adjusted by engine)
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { DIFFICULTY_LEVELS } from '../../services/difficultyEngine.js';

const MAX_RECENT_RESULTS = 50;
const MAX_HISTORICAL_SESSIONS = 14;

const initialState = {
  currentLevel: 'medium',
  recentResults: [],
  sessionStart: null,
  questionsThisSession: 0,
  consecutiveErrors: 0,
  breakSuggested: false,
  historicalSessions: [],
  newWordsToday: 0,
  maxNewWordsToday: 5,
};

const difficultySlice = createSlice({
  name: 'difficulty',
  initialState,
  reducers: {
    /**
     * Record a quiz/challenge result.
     * payload: { correct: boolean, timeMs: number, type: string, timestamp: number }
     */
    recordResult(state, action) {
      const { correct, timeMs, type, timestamp } = action.payload;

      state.recentResults.push({
        correct: !!correct,
        timeMs: timeMs || 0,
        type: type || 'unknown',
        timestamp: timestamp || Date.now(),
      });

      // Cap at MAX_RECENT_RESULTS
      if (state.recentResults.length > MAX_RECENT_RESULTS) {
        state.recentResults.shift();
      }

      // Track questions this session
      state.questionsThisSession += 1;

      // Track consecutive errors
      if (correct) {
        state.consecutiveErrors = 0;
      } else {
        state.consecutiveErrors += 1;
      }
    },

    /**
     * Start a new study session.
     * payload: { timestamp: number } (optional, defaults to Date.now())
     */
    startSession(state, action) {
      state.sessionStart = action.payload?.timestamp || Date.now();
      state.questionsThisSession = 0;
      state.consecutiveErrors = 0;
      state.breakSuggested = false;
    },

    /**
     * End the current session, saving to historical sessions.
     * payload: { timestamp: number } (optional, defaults to Date.now())
     */
    endSession(state, action) {
      if (!state.sessionStart) return;

      const endTime = action.payload?.timestamp || Date.now();
      const durationMs = endTime - state.sessionStart;
      const duration = Math.round(durationMs / 60000); // minutes

      // Calculate session accuracy
      const sessionResults = state.recentResults.slice(-state.questionsThisSession);
      const correctCount = sessionResults.filter((r) => r.correct).length;
      const accuracy = state.questionsThisSession > 0
        ? Math.round((correctCount / state.questionsThisSession) * 1000) / 1000
        : 0;

      const today = new Date(endTime).toISOString().split('T')[0];

      state.historicalSessions.push({
        duration,
        questionsAnswered: state.questionsThisSession,
        accuracy,
        date: today,
      });

      // Cap at MAX_HISTORICAL_SESSIONS
      if (state.historicalSessions.length > MAX_HISTORICAL_SESSIONS) {
        state.historicalSessions.shift();
      }

      // Reset session state
      state.sessionStart = null;
      state.questionsThisSession = 0;
      state.consecutiveErrors = 0;
      state.breakSuggested = false;
    },

    /**
     * Acknowledge a break suggestion (dismiss it).
     */
    acknowledgeBreak(state) {
      state.breakSuggested = false;
    },

    /**
     * Adjust difficulty level from engine calculation.
     * payload: { level: string, maxNewWords: number }
     */
    adjustDifficulty(state, action) {
      const { level, maxNewWords } = action.payload;

      if (level && DIFFICULTY_LEVELS.includes(level)) {
        state.currentLevel = level;
      }

      if (typeof maxNewWords === 'number' && maxNewWords >= 0) {
        state.maxNewWordsToday = maxNewWords;
      }
    },

    /**
     * Mark a break as suggested (set by middleware).
     */
    suggestBreak(state) {
      state.breakSuggested = true;
    },

    /**
     * Reset daily word count (called at start of new day).
     */
    resetDailyWordCount(state) {
      state.newWordsToday = 0;
    },

    /**
     * Increment new words introduced today.
     * payload: number (count, default 1)
     */
    incrementNewWords(state, action) {
      state.newWordsToday += (action.payload || 1);
    },
  },
});

export const {
  recordResult,
  startSession,
  endSession,
  acknowledgeBreak,
  adjustDifficulty,
  suggestBreak,
  resetDailyWordCount,
  incrementNewWords,
} = difficultySlice.actions;

// ========== SELECTORS ==========

/** Select current difficulty level. */
export const selectDifficultyLevel = (state) => state.difficulty?.currentLevel ?? 'medium';

/** Select recent results array. */
export const selectRecentResults = (state) => state.difficulty?.recentResults ?? [];

/** Select session stats. */
export const selectSessionStats = createSelector(
  [(state) => state.difficulty],
  (difficulty) => {
    if (!difficulty) {
      return { sessionStart: null, questionsThisSession: 0, consecutiveErrors: 0, durationMinutes: 0 };
    }

    const durationMs = difficulty.sessionStart
      ? Date.now() - difficulty.sessionStart
      : 0;

    return {
      sessionStart: difficulty.sessionStart,
      questionsThisSession: difficulty.questionsThisSession,
      consecutiveErrors: difficulty.consecutiveErrors,
      durationMinutes: Math.round(durationMs / 60000),
    };
  },
);

/** Select whether a break is suggested. */
export const selectShouldBreak = (state) => state.difficulty?.breakSuggested ?? false;

/** Select new word budget (remaining new words for today). */
export const selectNewWordBudget = createSelector(
  [(state) => state.difficulty],
  (difficulty) => {
    if (!difficulty) return { used: 0, max: 5, remaining: 5 };
    const used = difficulty.newWordsToday;
    const max = difficulty.maxNewWordsToday;
    return { used, max, remaining: Math.max(0, max - used) };
  },
);

/** Select recent accuracy (last 20 results). */
export const selectRecentAccuracy = createSelector(
  [(state) => state.difficulty?.recentResults ?? []],
  (results) => {
    if (results.length === 0) return 0;
    const window = results.slice(-20);
    const correct = window.filter((r) => r.correct).length;
    return Math.round((correct / window.length) * 1000) / 1000;
  },
);

/** Select historical sessions. */
export const selectHistoricalSessions = (state) => state.difficulty?.historicalSessions ?? [];

/**
 * Alias — returns current difficulty as a 1-5 numeric level.
 * Maps: beginner→1, easy→2, medium→3, hard→4, expert→5
 */
export const selectCurrentDifficulty = createSelector(
  [selectDifficultyLevel],
  (level) => {
    const map = { beginner: 1, easy: 2, medium: 3, hard: 4, expert: 5 };
    return map[level] ?? 3;
  },
);

/** Alias — whether a break should be suggested (same as selectShouldBreak). */
export const selectShouldSuggestBreak = (state) => state.difficulty?.breakSuggested ?? false;

export default difficultySlice.reducer;
