import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  storyFlags: {},        // { flagKey: string|number } — story progression (max 50, DEV-warn)
  npcRelationships: {},  // { npcId: number(0-5) } — trust meter per NPC
  worldObjectStates: {}, // { objectId: 'state-string' } — mutable world state
  choiceHistory: [],     // [{ npcId, choiceId, timestamp }] — dialogue choices log
  visitedBuildings: [],  // [buildingId] — building visit tracking
};

const narrativeSlice = createSlice({
  name: 'narrative',
  initialState,
  reducers: {
    setStoryFlag(state, action) {
      // payload: { flag, value }
      const { flag, value } = action.payload;

      if (
        import.meta.env.DEV &&
        !Object.prototype.hasOwnProperty.call(state.storyFlags, flag) &&
        Object.keys(state.storyFlags).length >= 50
      ) {
        console.warn(
          '[narrativeSlice] Story flag budget: 50 flags max. Consider consolidating.'
        );
      }

      state.storyFlags[flag] = value;
    },

    setNpcRelationship(state, action) {
      // payload: { npcId, level }
      const { npcId, level } = action.payload;
      const isCompanion = npcId.startsWith('companion_');
      const maxValue = isCompanion ? 100 : 5;
      state.npcRelationships[npcId] = Math.max(0, Math.min(maxValue, level));
    },

    incrementNpcRelationship(state, action) {
      // payload: { npcId, amount } — amount defaults to 1
      const { npcId, amount = 1 } = action.payload;
      const current = state.npcRelationships[npcId] ?? 0;
      const isCompanion = npcId.startsWith('companion_');
      const maxValue = isCompanion ? 100 : 5;
      state.npcRelationships[npcId] = Math.max(0, Math.min(maxValue, current + amount));
    },

    setWorldObjectState(state, action) {
      // payload: { objectId, objectState }
      const { objectId, objectState } = action.payload;
      state.worldObjectStates[objectId] = objectState;
    },

    recordChoice(state, action) {
      // payload: { npcId, choiceId }
      const { npcId, choiceId } = action.payload;
      state.choiceHistory.push({
        npcId,
        choiceId,
        timestamp: new Date().toISOString(),
      });
    },

    recordDialogueChoice(state, action) {
      // payload: { npcId, choiceId, consequences? }
      // consequences are processed by dialogueChoiceMiddleware — not stored in state
      const { npcId, choiceId } = action.payload;
      state.choiceHistory.push({
        npcId,
        choiceId,
        timestamp: new Date().toISOString(),
      });
    },

    markBuildingVisited(state, action) {
      // payload: buildingId (string or number)
      const buildingId = action.payload;
      if (!state.visitedBuildings.includes(buildingId)) {
        state.visitedBuildings.push(buildingId);
      }
    },

    resetNarrativeProgress() {
      return { ...initialState };
    },
  },
});

export const {
  setStoryFlag,
  setNpcRelationship,
  incrementNpcRelationship,
  setWorldObjectState,
  recordChoice,
  recordDialogueChoice,
  markBuildingVisited,
  resetNarrativeProgress,
} = narrativeSlice.actions;

// ========== SELECTORS ==========

export const selectStoryFlags = (state) => state.narrative.storyFlags;
export const selectNpcRelationships = (state) => state.narrative.npcRelationships;
export const selectWorldObjectStates = (state) => state.narrative.worldObjectStates;
export const selectChoiceHistory = (state) => state.narrative.choiceHistory;
export const selectVisitedBuildings = (state) => state.narrative.visitedBuildings;

// Parameterized selector factories
export const selectStoryFlag = (flag) => (state) =>
  Object.prototype.hasOwnProperty.call(state.narrative.storyFlags, flag)
    ? state.narrative.storyFlags[flag]
    : null;

export const selectNpcRelationship = (npcId) => (state) =>
  state.narrative.npcRelationships[npcId] ?? 0;

export const selectWorldObjectState = (objectId) => (state) =>
  Object.prototype.hasOwnProperty.call(state.narrative.worldObjectStates, objectId)
    ? state.narrative.worldObjectStates[objectId]
    : null;

// Memoized selector — checks if player has made a specific choice with an NPC
export const selectHasMadeChoice = (npcId, choiceId) =>
  createSelector(
    [selectChoiceHistory],
    (choiceHistory) =>
      choiceHistory.some(
        (entry) => entry.npcId === npcId && entry.choiceId === choiceId
      )
  );

// Budget monitoring — number of story flags currently set
export const selectNarrativeFlagCount = (state) =>
  Object.keys(state.narrative.storyFlags).length;

// FEAT-032 — Dialogue choice tracking selectors

// Returns all choices made with a specific NPC (ordered by insertion)
export const selectNpcDialogueHistory = (npcId) => (state) =>
  state.narrative.choiceHistory.filter((entry) => entry.npcId === npcId);

// Returns true if player has made a specific choice with a specific NPC
export const hasChosenOption = (npcId, choiceId) => (state) =>
  state.narrative.choiceHistory.some(
    (entry) => entry.npcId === npcId && entry.choiceId === choiceId
  );

// Returns { [choiceId]: true } for every choice ever made with a specific NPC
// Used for Ink story variable binding (choice gates in dialogue scripts)
export const selectNpcDialogueFlags = (npcId) => (state) => {
  const choices = state.narrative.choiceHistory.filter((entry) => entry.npcId === npcId);
  return Object.fromEntries(choices.map((entry) => [entry.choiceId, true]));
};

export default narrativeSlice.reducer;
