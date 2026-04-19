import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wordsLearnedToday: 0,
  wordsLearnedAllTime: 0,
  totalAccuracy: { correct: 0, total: 0 },
  zoneTime: {},
  battlesWon: 0,
  battlesLost: 0,
  currentStreak: 0,
  longestStreak: 0,
  sessionsPlayed: 0,
  totalPlayTime: 0,
  lastSessionDate: null,
  dailyStats: [],
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    recordWordLearned(state) {
      state.wordsLearnedToday += 1;
      state.wordsLearnedAllTime += 1;
    },

    recordAnswer(state, action) {
      const { correct } = action.payload;
      state.totalAccuracy.total += 1;
      if (correct) state.totalAccuracy.correct += 1;
    },

    recordZoneTime(state, action) {
      const { zone, seconds } = action.payload;
      if (!state.zoneTime[zone]) state.zoneTime[zone] = 0;
      state.zoneTime[zone] += seconds;
    },

    recordBattle(state, action) {
      const { won } = action.payload;
      if (won) {
        state.battlesWon += 1;
      } else {
        state.battlesLost += 1;
      }
    },

    updateStreak(state, action) {
      const { correct } = action.payload;
      if (correct) {
        state.currentStreak += 1;
        if (state.currentStreak > state.longestStreak) {
          state.longestStreak = state.currentStreak;
        }
      } else {
        state.currentStreak = 0;
      }
    },

    incrementPlayTime(state, action) {
      state.totalPlayTime += action.payload || 60;
    },

    resetDaily(state) {
      // Archive today's stats
      const today = new Date().toISOString().split('T')[0];
      if (state.wordsLearnedToday > 0 || state.totalAccuracy.total > 0) {
        const accuracy = state.totalAccuracy.total > 0
          ? Math.round((state.totalAccuracy.correct / state.totalAccuracy.total) * 100)
          : 0;
        state.dailyStats.push({
          date: today,
          wordsLearned: state.wordsLearnedToday,
          accuracy,
          playTime: state.totalPlayTime,
        });
        // Keep last 7 days
        if (state.dailyStats.length > 7) state.dailyStats.shift();
      }
      state.wordsLearnedToday = 0;
    },

    startSession(state) {
      state.sessionsPlayed += 1;
      state.lastSessionDate = new Date().toISOString().split('T')[0];
    },
  },
});

export const {
  recordWordLearned,
  recordAnswer,
  recordZoneTime,
  recordBattle,
  updateStreak,
  incrementPlayTime,
  resetDaily,
  startSession,
} = statsSlice.actions;

export const selectAccuracyPercent = (state) => {
  const { correct, total } = state.stats?.totalAccuracy || { correct: 0, total: 0 };
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};

export const selectTodayStats = (state) => ({
  wordsLearned: state.stats?.wordsLearnedToday || 0,
  accuracy: selectAccuracyPercent(state),
  streak: state.stats?.currentStreak || 0,
});

export const selectZoneTime = (zone) => (state) =>
  state.stats?.zoneTime?.[zone] || 0;

export const selectStreakInfo = (state) => ({
  current: state.stats?.currentStreak || 0,
  longest: state.stats?.longestStreak || 0,
});

export default statsSlice.reducer;
