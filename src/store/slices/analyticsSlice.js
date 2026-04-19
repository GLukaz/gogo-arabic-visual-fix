/**
 * analyticsSlice — Phase 73
 *
 * Tracks per-word accuracy, session duration, dropout points.
 * Persisted to localStorage via root persist whitelist.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  // Per-word accuracy: { wordId: { correct: number, total: number } }
  wordAccuracy: {},
  // Per-word pronunciation accuracy: { wordId: { correct: number, total: number, avgSimilarity: number } }
  pronunciationAccuracy: {},
  // Session history: [{ startedAt, endedAt, wordsReviewed, correctCount, type }]
  sessions: [],
  // Current session (in-progress, cleared when ended)
  currentSession: null,
  // Dropout points: { routePath: count } — tracks where users leave mid-session
  dropoutPoints: {},
  // Daily activity: { 'YYYY-MM-DD': { wordsReviewed, lessonsCompleted, sessionCount, timeSpentMs } }
  dailyActivity: {},
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    recordWordResult(state, action) {
      // payload: { wordId, correct: boolean }
      const { wordId, correct } = action.payload;
      if (!state.wordAccuracy[wordId]) {
        state.wordAccuracy[wordId] = { correct: 0, total: 0 };
      }
      state.wordAccuracy[wordId].total += 1;
      if (correct) state.wordAccuracy[wordId].correct += 1;
    },

    startSession(state, action) {
      // payload: { type: 'review' | 'grammar' | 'alphabet' | 'quiz' }
      state.currentSession = {
        type: action.payload.type,
        startedAt: new Date().toISOString(),
        wordsReviewed: 0,
        correctCount: 0,
      };
    },

    updateSessionProgress(state, action) {
      // payload: { wordsReviewed?: number, correctCount?: number }
      if (!state.currentSession) return;
      if (action.payload.wordsReviewed !== undefined) {
        state.currentSession.wordsReviewed = action.payload.wordsReviewed;
      }
      if (action.payload.correctCount !== undefined) {
        state.currentSession.correctCount = action.payload.correctCount;
      }
    },

    endSession(state) {
      if (!state.currentSession) return;
      const session = {
        ...state.currentSession,
        endedAt: new Date().toISOString(),
      };

      // Cap sessions history at 100 entries
      state.sessions.push(session);
      if (state.sessions.length > 100) {
        state.sessions = state.sessions.slice(-100);
      }

      // Update daily activity
      const today = new Date().toISOString().slice(0, 10);
      if (!state.dailyActivity[today]) {
        state.dailyActivity[today] = { wordsReviewed: 0, lessonsCompleted: 0, sessionCount: 0, timeSpentMs: 0 };
      }
      const daily = state.dailyActivity[today];
      daily.sessionCount += 1;
      daily.wordsReviewed += session.wordsReviewed;
      const duration = new Date(session.endedAt) - new Date(session.startedAt);
      daily.timeSpentMs += Math.max(0, duration);

      state.currentSession = null;
    },

    recordDropout(state, action) {
      // payload: { route: string }
      const { route } = action.payload;
      if (!state.dropoutPoints[route]) {
        state.dropoutPoints[route] = 0;
      }
      state.dropoutPoints[route] += 1;
    },

    recordLessonCompleted(state) {
      const today = new Date().toISOString().slice(0, 10);
      if (!state.dailyActivity[today]) {
        state.dailyActivity[today] = { wordsReviewed: 0, lessonsCompleted: 0, sessionCount: 0, timeSpentMs: 0 };
      }
      state.dailyActivity[today].lessonsCompleted += 1;
    },

    recordPronunciationResult(state, action) {
      // payload: { wordId, correct: boolean, similarity: number }
      const { wordId, correct, similarity } = action.payload;
      if (!state.pronunciationAccuracy[wordId]) {
        state.pronunciationAccuracy[wordId] = { correct: 0, total: 0, avgSimilarity: 0 };
      }
      const entry = state.pronunciationAccuracy[wordId];
      entry.total += 1;
      if (correct) entry.correct += 1;
      // Rolling average similarity
      entry.avgSimilarity = (entry.avgSimilarity * (entry.total - 1) + (similarity ?? 0)) / entry.total;
    },

    resetAnalytics() {
      return initialState;
    },
  },
});

export const {
  recordWordResult,
  recordPronunciationResult,
  startSession,
  updateSessionProgress,
  endSession,
  recordDropout,
  recordLessonCompleted,
  resetAnalytics,
} = analyticsSlice.actions;

// ========== SELECTORS ==========

export const selectWordAccuracy = (state) => state.analytics.wordAccuracy;
export const selectPronunciationAccuracy = (state) => state.analytics.pronunciationAccuracy;
export const selectSessions = (state) => state.analytics.sessions;
export const selectCurrentSession = (state) => state.analytics.currentSession;
export const selectDropoutPoints = (state) => state.analytics.dropoutPoints;
export const selectDailyActivity = (state) => state.analytics.dailyActivity;

// Top N hardest words (lowest accuracy ratio)
export const selectHardestWords = createSelector(
  [selectWordAccuracy, (_state, limit) => limit ?? 10],
  (wordAccuracy, limit) => {
    return Object.entries(wordAccuracy)
      .filter(([, stats]) => stats.total >= 2) // minimum 2 attempts
      .map(([wordId, stats]) => ({
        wordId,
        accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
        correct: stats.correct,
        total: stats.total,
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit);
  }
);

// Session trends: last N sessions with duration
export const selectSessionTrends = createSelector(
  [selectSessions, (_state, limit) => limit ?? 14],
  (sessions, limit) => {
    return sessions.slice(-limit).map((s) => ({
      type: s.type,
      date: s.startedAt?.slice(0, 10),
      wordsReviewed: s.wordsReviewed,
      correctCount: s.correctCount,
      durationMs: s.endedAt && s.startedAt
        ? new Date(s.endedAt) - new Date(s.startedAt)
        : 0,
      accuracy: s.wordsReviewed > 0 ? s.correctCount / s.wordsReviewed : 0,
    }));
  }
);

// Overall completion rate
export const selectOverallAccuracy = createSelector(
  [selectWordAccuracy],
  (wordAccuracy) => {
    let totalCorrect = 0;
    let totalAttempts = 0;
    Object.values(wordAccuracy).forEach((stats) => {
      totalCorrect += stats.correct;
      totalAttempts += stats.total;
    });
    return totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
  }
);

export default analyticsSlice.reducer;
