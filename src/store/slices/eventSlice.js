/**
 * eventSlice.js — Redux Toolkit slice for faction event state (Phase 77)
 *
 * Tracks which events are currently active, player attendance history,
 * and which vocab-boost categories are in effect.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { FACTION_EVENTS } from '../../data/factionEvents.js';
import { FACTION_BY_ID } from '../../data/factions.js';

const initialState = {
  /** IDs of currently active faction events */
  activeEvents: [],

  /** Timestamp (game minutes) of the last scheduler check */
  lastChecked: null,

  /** Attendance records — { [eventId]: { timesAttended: number, lastAttended: number } } */
  eventHistory: {},

  /** Vocab categories currently receiving an event boost */
  vocabBoostActive: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    /**
     * updateActiveEvents — replace the current list of active event IDs and
     * refresh the vocab-boost categories accordingly.
     *
     * @param {Object} action.payload
     * @param {string[]} action.payload.activeEventIds — IDs currently active
     * @param {string[]} action.payload.vocabBoosts    — boosted category strings
     * @param {number}   action.payload.checkedAt      — game-minutes timestamp
     */
    updateActiveEvents(state, action) {
      const { activeEventIds, vocabBoosts, checkedAt } = action.payload;
      state.activeEvents = activeEventIds;
      state.vocabBoostActive = vocabBoosts;
      state.lastChecked = checkedAt;
    },

    /**
     * recordEventAttendance — mark that the player participated in an event.
     *
     * @param {Object} action.payload
     * @param {string} action.payload.eventId   — event the player attended
     * @param {number} action.payload.timestamp  — game-minutes when attendance was recorded
     */
    recordEventAttendance(state, action) {
      const { eventId, timestamp } = action.payload;
      if (!state.eventHistory[eventId]) {
        state.eventHistory[eventId] = { timesAttended: 0, lastAttended: null };
      }
      state.eventHistory[eventId].timesAttended += 1;
      state.eventHistory[eventId].lastAttended = timestamp;
    },

    /**
     * clearExpiredEvents — reset activeEvents and vocabBoostActive to empty.
     * Called when no events are active (e.g. time advanced past all windows).
     */
    clearExpiredEvents(state) {
      state.activeEvents = [];
      state.vocabBoostActive = [];
    },
  },
});

export const { updateActiveEvents, recordEventAttendance, clearExpiredEvents } =
  eventSlice.actions;

// ── Base Selectors ──────────────────────────────────────────────────────────

export const selectActiveEventIds   = (state) => state.event.activeEvents;
export const selectVocabBoosts      = (state) => state.event.vocabBoostActive;
export const selectEventHistory     = (state) => state.event.eventHistory;
export const selectLastChecked      = (state) => state.event.lastChecked;

// ── Memoized Selectors ─────────────────────────────────────────────────────

/**
 * selectActiveEvents — full event objects for all currently active events,
 * enriched with faction metadata (icon, colour, name).
 */
export const selectActiveEvents = createSelector(
  [selectActiveEventIds],
  (activeIds) =>
    activeIds
      .map((id) => {
        const event = FACTION_EVENTS.find((e) => e.id === id);
        if (!event) return null;
        const faction = FACTION_BY_ID[event.factionId];
        return { ...event, factionIcon: faction?.icon, factionName: faction?.name };
      })
      .filter(Boolean)
);

/**
 * selectEventAttendance — parameterised selector factory.
 * Returns { timesAttended, lastAttended } for one event, or defaults.
 *
 * @param {string} eventId
 * @returns {(state: Object) => { timesAttended: number, lastAttended: number | null }}
 */
export const selectEventAttendance = (eventId) => (state) =>
  state.event.eventHistory[eventId] ?? { timesAttended: 0, lastAttended: null };

export default eventSlice.reducer;
