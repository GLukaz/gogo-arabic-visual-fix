import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  dialogueState: {}, // { [npcId]: { lastLine: 0, wordsTaught: [] } }
  friendship: {},    // { [npcId]: number (0-100) }
  giftsGiven: {},    // { [npcId]: [giftId, ...] } — all gifts ever given to each NPC
};

const npcSlice = createSlice({
  name: 'npc',
  initialState,
  reducers: {
    updateDialogueState(state, action) {
      // payload: { npcId, lastLine }
      const { npcId, lastLine } = action.payload;
      if (!state.dialogueState[npcId]) {
        state.dialogueState[npcId] = { lastLine: 0, wordsTaught: [] };
      }
      state.dialogueState[npcId].lastLine = lastLine;
    },

    teachWord(state, action) {
      // payload: { npcId, wordId }
      const { npcId, wordId } = action.payload;
      if (!state.dialogueState[npcId]) {
        state.dialogueState[npcId] = { lastLine: 0, wordsTaught: [] };
      }
      if (!state.dialogueState[npcId].wordsTaught.includes(wordId)) {
        state.dialogueState[npcId].wordsTaught.push(wordId);
      }
    },

    resetNpcDialogue(state, action) {
      // payload: npcId
      const npcId = action.payload;
      if (state.dialogueState[npcId]) {
        state.dialogueState[npcId] = { lastLine: 0, wordsTaught: [] };
      }
    },

    adjustFriendship(state, action) {
      // payload: { npcId, delta, reason }
      const { npcId, delta } = action.payload;
      if (!state.friendship[npcId]) state.friendship[npcId] = 50; // Start neutral
      state.friendship[npcId] = Math.max(0, Math.min(100, state.friendship[npcId] + delta));
    },

    setFriendship(state, action) {
      // payload: { npcId, value }
      const { npcId, value } = action.payload;
      state.friendship[npcId] = Math.max(0, Math.min(100, value));
    },

    giveNpcGift(state, action) {
      // payload: { npcId, giftId, relationshipDelta }
      // Adjusts NPC friendship by relationshipDelta and logs the gift in giftsGiven.
      const { npcId, giftId, relationshipDelta } = action.payload;

      // Ensure friendship entry exists (default 50 = neutral)
      if (state.friendship[npcId] === undefined) {
        state.friendship[npcId] = 50;
      }

      // Clamp friendship between 0 and 100
      state.friendship[npcId] = Math.max(
        0,
        Math.min(100, state.friendship[npcId] + (relationshipDelta ?? 0))
      );

      // Log the gift
      if (!state.giftsGiven[npcId]) {
        state.giftsGiven[npcId] = [];
      }
      state.giftsGiven[npcId].push(giftId);
    },
  },
});

export const {
  updateDialogueState,
  teachWord,
  resetNpcDialogue,
  adjustFriendship,
  setFriendship,
  giveNpcGift,
} = npcSlice.actions;

// --- Selectors ---
export const selectDialogueState = (state) => state.npc?.dialogueState || {};
export const selectNpcDialogue = (npcId) => (state) => state.npc?.dialogueState?.[npcId] || null;
export const selectTalkedToNpcIds = createSelector(
  [(state) => state.npc?.dialogueState || {}],
  (dialogueState) => Object.keys(dialogueState)
);

export const selectFriendship = (npcId) => (state) => state.npc?.friendship?.[npcId] ?? 50;
export const selectFriendshipTier = (npcId) => (state) => {
  const val = state.npc?.friendship?.[npcId] ?? 50;
  if (val >= 75) return 'close';    // Unlocks special dialogue, gifts
  if (val >= 50) return 'friendly'; // Default neutral+
  if (val >= 25) return 'cautious'; // Some dialogue restricted
  return 'cold';                     // Minimal interaction
};
export const selectAllFriendships = (state) => state.npc?.friendship || {};

// Gift selectors
export const selectGiftsGiven       = (state)      => state.npc?.giftsGiven || {};
export const selectGiftsGivenToNpc  = (npcId) => (state) => state.npc?.giftsGiven?.[npcId] || [];
export const selectTotalGiftsGiven  = createSelector(
  [(state) => state.npc?.giftsGiven || {}],
  (giftsGiven) => Object.values(giftsGiven).reduce((sum, arr) => sum + arr.length, 0)
);

export default npcSlice.reducer;
