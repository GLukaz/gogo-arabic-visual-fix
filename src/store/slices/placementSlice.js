import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hasCompleted: false,
  assignedLevel: null,    // 'A1'|'A2'|'B1'|null
  rawScore: null,         // integer
  completedAt: null,      // ISO string
};

const placementSlice = createSlice({
  name: 'placement',
  initialState,
  reducers: {
    recordPlacementResult(state, action) {
      const { assignedLevel, rawScore } = action.payload;
      state.hasCompleted = true;
      state.assignedLevel = assignedLevel;
      state.rawScore = rawScore;
      state.completedAt = new Date().toISOString();
    },
    resetPlacement() {
      return initialState;
    },
  },
});

export const { recordPlacementResult, resetPlacement } = placementSlice.actions;
export const selectPlacement = (state) => state.placement;
export const selectHasCompletedPlacement = (state) => state.placement.hasCompleted;
export default placementSlice.reducer;
