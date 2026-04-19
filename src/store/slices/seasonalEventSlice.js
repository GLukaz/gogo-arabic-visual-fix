/**
 * seasonalEventSlice.js — Redux Toolkit slice for seasonal Islamic events (Phase 86)
 *
 * Tracks:
 *   - Currently active seasonal event (Ramadan / Eid al-Fitr / Eid al-Adha)
 *   - Per-event progress: words learned, quests completed, days participated
 *   - Yearly participation history
 *
 * Works alongside the hijriCalendar utility for date detection and the
 * SEASONAL_EVENTS data for event definitions.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { SEASONAL_EVENTS } from '../../data/seasonalEvents.js';

// ── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  /** Currently active event ID: 'ramadan'|'eid_fitr'|'eid_adha'|null */
  activeEvent: null,

  /** ISO date string of last calendar check (avoids redundant checks) */
  lastCheckedDate: null,

  /** Per-event progress tracking */
  eventProgress: {
    ramadan: { wordsLearned: [], questsCompleted: [], daysParticipated: 0 },
    eid_fitr: { wordsLearned: [], questsCompleted: [] },
    eid_adha: { wordsLearned: [], questsCompleted: [] },
  },

  /** Yearly participation history: { [hijriYear]: { ramadan: bool, eid_fitr: bool, eid_adha: bool } } */
  yearlyHistory: {},
};

// ── Slice ───────────────────────────────────────────────────────────────────

const seasonalEventSlice = createSlice({
  name: 'seasonalEvent',
  initialState,
  reducers: {
    /**
     * checkForEvent — Update the active event based on calendar detection.
     * Call this on app load and periodically to detect event transitions.
     *
     * @param {Object} action.payload
     * @param {string|null} action.payload.detectedEvent — event ID from getActiveIslamicEvent()
     * @param {string}      action.payload.dateISO       — ISO date string (YYYY-MM-DD)
     * @param {number}      [action.payload.hijriYear]   — Hijri year for history tracking
     */
    checkForEvent(state, action) {
      const { detectedEvent, dateISO, hijriYear } = action.payload;
      state.lastCheckedDate = dateISO;

      state.activeEvent = detectedEvent;

      // Record yearly history when an event becomes active
      if (detectedEvent && hijriYear) {
        if (!state.yearlyHistory[hijriYear]) {
          state.yearlyHistory[hijriYear] = {
            ramadan: false,
            eid_fitr: false,
            eid_adha: false,
          };
        }
        state.yearlyHistory[hijriYear][detectedEvent] = true;
      }

      // If event changed, no need to reset progress — users may re-enter
      // the same event across sessions within the same year
    },

    /**
     * learnSeasonalWord — Mark a seasonal vocabulary word as learned.
     *
     * @param {Object} action.payload
     * @param {string} action.payload.eventId — 'ramadan'|'eid_fitr'|'eid_adha'
     * @param {string} action.payload.wordId  — vocabulary word ID from SEASONAL_EVENTS
     */
    learnSeasonalWord(state, action) {
      const { eventId, wordId } = action.payload;
      const progress = state.eventProgress[eventId];
      if (!progress) return;

      if (!progress.wordsLearned.includes(wordId)) {
        progress.wordsLearned.push(wordId);
      }
    },

    /**
     * completeSeasonalQuest — Mark a seasonal quest as completed.
     *
     * @param {Object} action.payload
     * @param {string} action.payload.eventId — event the quest belongs to
     * @param {string} action.payload.questId — quest ID from SEASONAL_EVENTS
     */
    completeSeasonalQuest(state, action) {
      const { eventId, questId } = action.payload;
      const progress = state.eventProgress[eventId];
      if (!progress) return;

      if (!progress.questsCompleted.includes(questId)) {
        progress.questsCompleted.push(questId);
      }
    },

    /**
     * recordParticipation — Increment Ramadan daily participation counter.
     * Should be called once per day during Ramadan when the player is active.
     *
     * @param {Object} action.payload
     * @param {string} action.payload.eventId — typically 'ramadan'
     */
    recordParticipation(state, action) {
      const { eventId } = action.payload;
      const progress = state.eventProgress[eventId];
      if (!progress || !('daysParticipated' in progress)) return;

      progress.daysParticipated += 1;
    },

    /**
     * resetEventProgress — Reset progress for a specific event.
     * Called at the start of a new year's event.
     *
     * @param {Object} action.payload
     * @param {string} action.payload.eventId — event to reset
     */
    resetEventProgress(state, action) {
      const { eventId } = action.payload;
      if (eventId === 'ramadan') {
        state.eventProgress.ramadan = {
          wordsLearned: [],
          questsCompleted: [],
          daysParticipated: 0,
        };
      } else if (state.eventProgress[eventId]) {
        state.eventProgress[eventId] = {
          wordsLearned: [],
          questsCompleted: [],
        };
      }
    },
  },
});

export const {
  checkForEvent,
  learnSeasonalWord,
  completeSeasonalQuest,
  recordParticipation,
  resetEventProgress,
} = seasonalEventSlice.actions;

// ── Base Selectors ──────────────────────────────────────────────────────────

export const selectActiveEvent = (state) => state.seasonalEvent.activeEvent;
export const selectLastCheckedDate = (state) => state.seasonalEvent.lastCheckedDate;
export const selectEventProgress = (state) => state.seasonalEvent.eventProgress;
export const selectYearlyHistory = (state) => state.seasonalEvent.yearlyHistory;

// ── Memoized Selectors ─────────────────────────────────────────────────────

/**
 * selectActiveEventData — Full SEASONAL_EVENTS object for the active event,
 * or null if no event is active.
 */
export const selectActiveEventData = createSelector(
  [selectActiveEvent],
  (activeEvent) => {
    if (!activeEvent) return null;
    return SEASONAL_EVENTS[activeEvent] ?? null;
  }
);

/**
 * selectActiveEventXPMultiplier — XP multiplier for the active event (defaults to 1).
 */
export const selectActiveEventXPMultiplier = createSelector(
  [selectActiveEventData],
  (eventData) => eventData?.xpMultiplier ?? 1
);

/**
 * selectSeasonalVocabLearned — Array of word IDs learned for the active event.
 */
export const selectSeasonalVocabLearned = createSelector(
  [selectActiveEvent, selectEventProgress],
  (activeEvent, eventProgress) => {
    if (!activeEvent) return [];
    return eventProgress[activeEvent]?.wordsLearned ?? [];
  }
);

/**
 * selectSeasonalQuestsCompleted — Array of quest IDs completed for the active event.
 */
export const selectSeasonalQuestsCompleted = createSelector(
  [selectActiveEvent, selectEventProgress],
  (activeEvent, eventProgress) => {
    if (!activeEvent) return [];
    return eventProgress[activeEvent]?.questsCompleted ?? [];
  }
);

/**
 * selectRamadanDaysParticipated — Number of Ramadan days the player was active.
 */
export const selectRamadanDaysParticipated = (state) =>
  state.seasonalEvent.eventProgress.ramadan.daysParticipated;

/**
 * selectEventProgressForId — Get progress for a specific event.
 * @param {string} eventId
 * @returns {(state: Object) => Object}
 */
export const selectEventProgressForId = (eventId) => (state) =>
  state.seasonalEvent.eventProgress[eventId] ?? null;

export default seasonalEventSlice.reducer;
