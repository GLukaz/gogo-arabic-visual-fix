/**
 * extendedAnalyticsSlice — Phase 93
 *
 * Extended analytics state for study sessions, reports, and learning goals.
 * Persisted to localStorage via root persist whitelist.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  // Last 90 days of study sessions
  studySessions: [],
  // [{ date, duration, activity, wordsReviewed, accuracy }]

  // Generated reports
  weeklyReports: [], // last 12 weeks
  monthlyReports: [], // last 6 months

  // Configurable learning goals
  learningGoals: {
    dailyMinutes: 20,
    dailyWords: 5,
    weeklyPassages: 3,
  },

  // Goal progress by date
  goalProgress: {},
  // { 'YYYY-MM-DD': { minutes: N, words: N, passages: N } }
};

const extendedAnalyticsSlice = createSlice({
  name: 'extendedAnalytics',
  initialState,
  reducers: {
    recordStudySession(state, action) {
      // payload: { date, duration, activity, wordsReviewed, accuracy }
      const session = {
        date: action.payload.date || new Date().toISOString().slice(0, 10),
        duration: action.payload.duration || 0,
        activity: action.payload.activity || 'review',
        wordsReviewed: action.payload.wordsReviewed || 0,
        accuracy: action.payload.accuracy || 0,
      };

      state.studySessions.push(session);

      // Cap at 90 days of sessions (roughly 270 sessions at 3/day)
      if (state.studySessions.length > 270) {
        state.studySessions = state.studySessions.slice(-270);
      }

      // Update goal progress for today
      const today = session.date;
      if (!state.goalProgress[today]) {
        state.goalProgress[today] = { minutes: 0, words: 0, passages: 0 };
      }
      state.goalProgress[today].minutes += Math.round(session.duration / 60);
      state.goalProgress[today].words += session.wordsReviewed;

      // Prune goalProgress older than 90 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      for (const date of Object.keys(state.goalProgress)) {
        if (date < cutoffStr) {
          delete state.goalProgress[date];
        }
      }
    },

    generateWeeklyReport(state, action) {
      // payload: { report } — a report object from generateStudyReport
      const report = action.payload.report;
      if (!report) return;

      state.weeklyReports.push({
        ...report,
        generatedAt: new Date().toISOString(),
      });

      // Keep last 12 weeks
      if (state.weeklyReports.length > 12) {
        state.weeklyReports = state.weeklyReports.slice(-12);
      }
    },

    generateMonthlyReport(state, action) {
      // payload: { report }
      const report = action.payload.report;
      if (!report) return;

      state.monthlyReports.push({
        ...report,
        generatedAt: new Date().toISOString(),
      });

      // Keep last 6 months
      if (state.monthlyReports.length > 6) {
        state.monthlyReports = state.monthlyReports.slice(-6);
      }
    },

    setLearningGoal(state, action) {
      // payload: { key: 'dailyMinutes'|'dailyWords'|'weeklyPassages', value: number }
      const { key, value } = action.payload;
      if (key in state.learningGoals && typeof value === 'number' && value > 0) {
        state.learningGoals[key] = value;
      }
    },

    updateGoalProgress(state, action) {
      // payload: { date?, minutes?, words?, passages? }
      const today = action.payload.date || new Date().toISOString().slice(0, 10);
      if (!state.goalProgress[today]) {
        state.goalProgress[today] = { minutes: 0, words: 0, passages: 0 };
      }

      const progress = state.goalProgress[today];
      if (action.payload.minutes) progress.minutes += action.payload.minutes;
      if (action.payload.words) progress.words += action.payload.words;
      if (action.payload.passages) progress.passages += action.payload.passages;
    },

    resetExtendedAnalytics() {
      return initialState;
    },
  },
});

export const {
  recordStudySession,
  generateWeeklyReport,
  generateMonthlyReport,
  setLearningGoal,
  updateGoalProgress,
  resetExtendedAnalytics,
} = extendedAnalyticsSlice.actions;

// ========== SELECTORS ==========

export const selectStudySessions = (state) => state.extendedAnalytics?.studySessions || [];
export const selectWeeklyReports = (state) => state.extendedAnalytics?.weeklyReports || [];
export const selectMonthlyReports = (state) => state.extendedAnalytics?.monthlyReports || [];
export const selectLearningGoals = (state) => state.extendedAnalytics?.learningGoals || initialState.learningGoals;
export const selectGoalProgress = (state) => state.extendedAnalytics?.goalProgress || {};

/**
 * Select today's goal completion percentages.
 */
export const selectGoalCompletion = createSelector(
  [selectLearningGoals, selectGoalProgress],
  (goals, progress) => {
    const today = new Date().toISOString().slice(0, 10);
    const todayProgress = progress[today] || { minutes: 0, words: 0, passages: 0 };

    return {
      minutes: {
        current: todayProgress.minutes,
        target: goals.dailyMinutes,
        percent: Math.min(100, Math.round((todayProgress.minutes / goals.dailyMinutes) * 100)),
      },
      words: {
        current: todayProgress.words,
        target: goals.dailyWords,
        percent: Math.min(100, Math.round((todayProgress.words / goals.dailyWords) * 100)),
      },
      passages: {
        current: todayProgress.passages,
        target: goals.weeklyPassages,
        percent: Math.min(100, Math.round((todayProgress.passages / goals.weeklyPassages) * 100)),
      },
    };
  }
);

/**
 * Select goal completion streak (consecutive days where all daily goals were met).
 */
export const selectGoalStreak = createSelector(
  [selectLearningGoals, selectGoalProgress],
  (goals, progress) => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayProgress = progress[dateStr];

      if (!dayProgress) break;

      const minutesMet = dayProgress.minutes >= goals.dailyMinutes;
      const wordsMet = dayProgress.words >= goals.dailyWords;

      if (minutesMet && wordsMet) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  }
);

export default extendedAnalyticsSlice.reducer;
