/**
 * loreSlice — Tracks lore codex discovery and reading state.
 * Phase 79 (NAR-04): 300+ discoverable lore entries.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  /** Map of discovered entry IDs → metadata */
  discovered: {},
  /** IDs of entries that haven't been read yet (notification badge) */
  newEntries: [],
};

const loreSlice = createSlice({
  name: 'lore',
  initialState,
  reducers: {
    /**
     * Discover a lore entry.
     * @param {Object} action.payload — { id: string, trigger: string }
     */
    discoverEntry(state, action) {
      const { id, trigger } = action.payload;
      if (state.discovered[id]) return; // already discovered
      state.discovered[id] = {
        discoveredAt: Date.now(),
        read: false,
        trigger,
      };
      state.newEntries.push(id);
    },

    /**
     * Mark a single entry as read.
     * @param {string} action.payload — entry ID
     */
    markRead(state, action) {
      const id = action.payload;
      if (state.discovered[id]) {
        state.discovered[id].read = true;
      }
      state.newEntries = state.newEntries.filter((eid) => eid !== id);
    },

    /** Mark all discovered entries as read and clear new badge. */
    markAllRead(state) {
      for (const id of Object.keys(state.discovered)) {
        state.discovered[id].read = true;
      }
      state.newEntries = [];
    },
  },
});

export const { discoverEntry, markRead, markAllRead } = loreSlice.actions;

// ── Selectors ──

/** All discovered entry IDs as a Set */
export const selectDiscoveredIds = (state) => state.lore.discovered;

/** Count of total discovered entries */
export const selectTotalDiscovered = (state) =>
  Object.keys(state.lore.discovered).length;

/** Number of unread (new) entries — for badge */
export const selectNewEntryCount = (state) => state.lore.newEntries.length;

/** Array of new (unread) entry IDs */
export const selectNewEntryIds = (state) => state.lore.newEntries;

/** Check if a specific entry has been discovered */
export const selectIsDiscovered = (id) => (state) =>
  id in state.lore.discovered;

/** Get discovery metadata for an entry */
export const selectEntryMeta = (id) => (state) =>
  state.lore.discovered[id] ?? null;

export default loreSlice.reducer;
