import { createSlice } from '@reduxjs/toolkit';

/**
 * gossipSlice.js — In-memory gossip token storage (NOT persisted)
 *
 * Gossip tokens are session-ephemeral: they expire after 3 game-days
 * and are never written to IndexedDB or localStorage.
 *
 * GOSP-01: addGossipToken — store token for a specific NPC (max 2 per NPC)
 * GOSP-02: pruneExpiredTokens — remove tokens past their expiresDay
 * GOSP-04: markTokenHeard — prevent token from being repeated
 */

const initialState = {
  npcTokens: {},  // { [npcId]: Token[] } — max 2 per NPC
};

const gossipSlice = createSlice({
  name: 'gossip',
  initialState,
  reducers: {
    addGossipToken(state, action) {
      // payload: { npcId, token }
      const { npcId, token } = action.payload;
      if (!state.npcTokens[npcId]) state.npcTokens[npcId] = [];
      // Max 2 tokens per NPC — drop oldest if at cap
      if (state.npcTokens[npcId].length >= 2) {
        state.npcTokens[npcId].shift();
      }
      state.npcTokens[npcId].push(token);
    },

    markTokenHeard(state, action) {
      // payload: { npcId, tokenId }
      const { npcId, tokenId } = action.payload;
      const tokens = state.npcTokens[npcId];
      if (tokens) {
        const t = tokens.find(tk => tk.tokenId === tokenId);
        if (t) t.heard = true;
      }
    },

    pruneExpiredTokens(state, action) {
      // payload: { currentDay }
      const { currentDay } = action.payload;
      for (const npcId of Object.keys(state.npcTokens)) {
        state.npcTokens[npcId] = state.npcTokens[npcId].filter(
          t => t.expiresDay > currentDay
        );
        if (state.npcTokens[npcId].length === 0) {
          delete state.npcTokens[npcId];
        }
      }
    },
  },
});

export const { addGossipToken, markTokenHeard, pruneExpiredTokens } = gossipSlice.actions;

// Selector: get all tokens for a given NPC
export const selectNpcTokens = (npcId) => (state) => state.gossip?.npcTokens?.[npcId] || [];

export default gossipSlice.reducer;
