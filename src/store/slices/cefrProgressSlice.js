import { createSlice } from '@reduxjs/toolkit';

const CEFR_RANK = { A1: 1, A2: 2, B1: 3, B2: 4 };

const initialState = {
  currentLevel: null,      // 'A1'|'A2'|'B1'|'B2'|null
  levelHistory: [],        // [{ level, date, source }]
  lastAssessedAt: null,    // ISO string
  lastSnapshotDate: null,  // 'YYYY-MM-DD' — write-once-per-calendar-day guard
};

const cefrProgressSlice = createSlice({
  name: 'cefrProgress',
  initialState,
  reducers: {
    setCefrLevel(state, action) {
      const { level, source } = action.payload;
      if (state.currentLevel !== level) {
        state.levelHistory.push({
          level: state.currentLevel,
          date: new Date().toISOString(),
          source: source || 'system',
        });
        state.currentLevel = level;
      }
      state.lastAssessedAt = new Date().toISOString();
    },
    initCefrLevel(state, action) {
      if (!state.currentLevel) {
        state.currentLevel = action.payload;
        state.lastAssessedAt = new Date().toISOString();
      }
    },
    resetCefrProgress() {
      return initialState;
    },
    recordCefrSnapshot(state, action) {
      const { level } = action.payload;
      const today = new Date().toISOString().split('T')[0];

      // Guard 1: already snapshotted today
      if (state.lastSnapshotDate === today) return;

      // Guard 2: never go backwards — check rank vs last history entry
      if (state.levelHistory.length > 0) {
        const lastEntry = state.levelHistory[state.levelHistory.length - 1];
        const lastRank = CEFR_RANK[lastEntry.level] ?? 0;
        const newRank = CEFR_RANK[level] ?? 0;
        if (newRank < lastRank) return;
      }

      state.levelHistory.push({
        level,
        date: new Date().toISOString(),
        source: 'session_snapshot',
      });
      state.lastSnapshotDate = today;
    },
  },
});

export const { setCefrLevel, initCefrLevel, resetCefrProgress, recordCefrSnapshot } = cefrProgressSlice.actions;
export const selectCefrLevel = (state) => state.cefrProgress.currentLevel;
export const selectCefrHistory = (state) => state.cefrProgress.levelHistory;
export const selectLastSnapshotDate = (state) => state.cefrProgress.lastSnapshotDate;
export default cefrProgressSlice.reducer;
