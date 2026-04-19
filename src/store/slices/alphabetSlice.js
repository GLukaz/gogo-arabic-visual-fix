import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  groups: [], // loaded from alphabet.json
  completedGroups: [],
  currentLesson: null, // { groupId, step: 1-5 }
  practicedLetters: {}, // { letterId: { stars: number, practicedAt: number } }
};

const alphabetSlice = createSlice({
  name: 'alphabet',
  initialState,
  reducers: {
    loadGroups(state, action) {
      // payload: array of group objects from alphabet.json
      state.groups = action.payload;
    },

    startLesson(state, action) {
      // payload: groupId
      state.currentLesson = { groupId: action.payload, step: 1 };
    },

    advanceStep(state) {
      if (state.currentLesson && state.currentLesson.step < 5) {
        state.currentLesson.step += 1;
      }
    },

    completeGroup(state, action) {
      // payload: groupId
      const groupId = action.payload;
      if (!state.completedGroups.includes(groupId)) {
        state.completedGroups.push(groupId);
      }
      // Clear current lesson if it matches
      if (state.currentLesson && state.currentLesson.groupId === groupId) {
        state.currentLesson = null;
      }
    },

    resetLesson(state) {
      state.currentLesson = null;
    },

    markLetterPracticed(state, action) {
      // payload: { letterId, stars }
      const { letterId, stars } = action.payload;
      if (stars >= 2) {
        const existing = state.practicedLetters[letterId];
        // Only update if new stars are higher or no previous entry
        if (!existing || stars > existing.stars) {
          state.practicedLetters[letterId] = { stars, practicedAt: Date.now() };
        }
      }
    },
  },
});

export const {
  loadGroups,
  startLesson,
  advanceStep,
  completeGroup,
  resetLesson,
  markLetterPracticed,
} = alphabetSlice.actions;

// --- Selectors ---
export const selectGroups = (state) => state.alphabet.groups;
export const selectCompletedGroups = (state) => state.alphabet.completedGroups;
export const selectCurrentLesson = (state) => state.alphabet.currentLesson;
export const selectIsGroupCompleted = createSelector(
  [(state) => state.alphabet.completedGroups, (_state, groupId) => groupId],
  (completedGroups, groupId) => completedGroups.includes(groupId)
);
export const selectAlphabetProgress = createSelector(
  [(state) => state.alphabet.groups, (state) => state.alphabet.completedGroups],
  (groups, completedGroups) => ({
    total: groups.length,
    completed: completedGroups.length,
    percentage: groups.length > 0 ? Math.round((completedGroups.length / groups.length) * 100) : 0,
  })
);

export const selectPracticedLetters = (state) => state.alphabet.practicedLetters;
export const selectLetterPracticed = (state, letterId) => !!state.alphabet.practicedLetters[letterId];

export default alphabetSlice.reducer;
