import { createSlice, createSelector } from '@reduxjs/toolkit';
import { LORE_ENTRIES } from '../../data/loreCodex.js';

const initialState = {
  unlockedEntries: [],
  readEntries: [],
  newEntryCount: 0,
};

const codexSlice = createSlice({
  name: 'codex',
  initialState,
  reducers: {
    unlockEntry(state, action) {
      const entryId = action.payload;
      if (!state.unlockedEntries.includes(entryId)) {
        state.unlockedEntries.push(entryId);
        state.newEntryCount += 1;
      }
    },
    markRead(state, action) {
      const entryId = action.payload;
      if (!state.readEntries.includes(entryId)) {
        state.readEntries.push(entryId);
        if (state.newEntryCount > 0) state.newEntryCount -= 1;
      }
    },
    clearNewCount(state) {
      state.newEntryCount = 0;
    },
  },
});

export const { unlockEntry, markRead, clearNewCount } = codexSlice.actions;

export const selectUnlockedEntries = (state) => state.codex.unlockedEntries;
export const selectReadEntries = (state) => state.codex.readEntries;
export const selectNewEntryCount = (state) => state.codex.newEntryCount;

export const selectCodexProgress = createSelector(
  [selectUnlockedEntries],
  (unlocked) => ({
    unlocked: unlocked.length,
    total: LORE_ENTRIES.length,
    percentage: Math.round((unlocked.length / LORE_ENTRIES.length) * 100),
  })
);

export const selectIsEntryUnlocked = (entryId) => (state) =>
  state.codex.unlockedEntries.includes(entryId);

export const selectIsEntryRead = (entryId) => (state) =>
  state.codex.readEntries.includes(entryId);

export default codexSlice.reducer;
