/**
 * Zone Intro Slice — FEAT-046
 *
 * Tracks the active zone intro teaching session state.
 * A zone intro is triggered on first entry (or re-entry after partial dismissal)
 * and presents zone vocabulary words one at a time before free exploration.
 *
 * Reviewed word tracking lives in zoneVocabIntroSlice. This slice owns the
 * session-level state: which zone is currently being introduced, whether it's
 * active or dismissed, and which zones have been started at least once.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getZoneIntroWords } from '../../data/zoneVocabIntros.js';
import { getNextUnreviewedWord, getZoneIntroProgress, isZoneIntroComplete } from './zoneVocabIntroSlice.js';

// ── Pure Helpers ──────────────────────────────────────────────────────────────

/**
 * Returns the next unreviewed intro word for a zone, with full teaching data.
 * Returns null when all words have been reviewed.
 *
 * @param {string} zoneId - Zone identifier
 * @param {Object} state  - Full Redux state (must have zoneVocabIntro key)
 * @returns {{ id: string, arabic: string, english: string, root: string, zoneContext: string, exampleInZone: string } | null}
 */
export function presentNextIntroWord(zoneId, state) {
  return getNextUnreviewedWord(zoneId, state);
}

/**
 * Returns true when a zone's intro has been started (player has entered the zone at least once).
 *
 * @param {string} zoneId - Zone identifier
 * @param {Object} zoneIntroState - state.zoneIntro slice
 * @returns {boolean}
 */
export function isZoneIntroStarted(zoneId, zoneIntroState) {
  return Boolean(zoneIntroState?.startedZones?.[zoneId]);
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  /**
   * Which zone is currently being introduced, or null if no intro is active.
   * @type {string|null}
   */
  activeZone: null,

  /**
   * Session status for the active zone.
   * 'idle'     — no intro in progress
   * 'active'   — player is stepping through intro words
   * 'dismissed'— player dismissed early; progress is preserved
   */
  status: 'idle',

  /**
   * Zones that have been started at least once.
   * { [zoneId: string]: true }
   * Used to decide whether to show a "resume" reminder vs. a fresh intro.
   */
  startedZones: {},
};

const zoneIntroSlice = createSlice({
  name: 'zoneIntro',
  initialState,
  reducers: {
    /**
     * Begin (or resume) a zone intro session.
     * Payload: { zoneId: string }
     */
    startIntro(state, action) {
      const { zoneId } = action.payload;
      state.activeZone = zoneId;
      state.status = 'active';
      state.startedZones[zoneId] = true;
    },

    /**
     * Player dismissed the intro early. Progress is preserved.
     * Can be resumed on next zone entry.
     */
    dismissIntro(state) {
      state.status = 'dismissed';
      // Keep activeZone so the UI can show the progress reminder
    },

    /**
     * Clear the active intro session (after completion or explicit reset).
     */
    clearIntro(state) {
      state.activeZone = null;
      state.status = 'idle';
    },

    /**
     * Reset started/dismissed state for a single zone (for testing / fresh starts).
     * Payload: zoneId string
     */
    resetZoneIntroSession(state, action) {
      const zoneId = action.payload;
      delete state.startedZones[zoneId];
      if (state.activeZone === zoneId) {
        state.activeZone = null;
        state.status = 'idle';
      }
    },

    /**
     * Reset all zone intro session state.
     */
    resetAllIntroSessions(state) {
      state.activeZone = null;
      state.status = 'idle';
      state.startedZones = {};
    },
  },
});

export const {
  startIntro,
  dismissIntro,
  clearIntro,
  resetZoneIntroSession,
  resetAllIntroSessions,
} = zoneIntroSlice.actions;

/**
 * Action creator alias used by middleware and UI to mark a word as reviewed.
 * Middleware intercepts this to also create the FSRS card.
 * Payload: { zoneId: string, wordId: string }
 */
export const completeIntroWord = (zoneId, wordId) => ({
  type: 'zoneIntro/completeWord',
  payload: { zoneId, wordId },
});

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Returns the active zone ID, or null. */
export const selectActiveIntroZone = (state) => state.zoneIntro?.activeZone ?? null;

/** Returns the current intro status: 'idle' | 'active' | 'dismissed'. */
export const selectIntroStatus = (state) => state.zoneIntro?.status ?? 'idle';

/** Returns true when an intro is actively in progress. */
export const selectIsIntroActive = (state) => state.zoneIntro?.status === 'active';

/** Returns true when the intro was dismissed (in-progress, not completed). */
export const selectIsIntroDismissed = (state) => state.zoneIntro?.status === 'dismissed';

/**
 * Returns { reviewed, total, percentage } for the currently active zone's intro.
 * Returns zeroes when no intro is active.
 */
export const selectActiveIntroProgress = createSelector(
  (state) => state.zoneIntro?.activeZone,
  (state) => state.zoneVocabIntro?.reviewedByZone,
  (activeZone, reviewedByZone) => {
    if (!activeZone) return { reviewed: 0, total: 0, percentage: 0 };
    const words = getZoneIntroWords(activeZone);
    const total = words.length;
    if (total === 0) return { reviewed: 0, total: 0, percentage: 0 };
    const reviewed = reviewedByZone?.[activeZone] ?? {};
    const reviewedCount = words.filter((w) => reviewed[w.id] === true).length;
    const percentage = Math.round((reviewedCount / total) * 100);
    return { reviewed: reviewedCount, total, percentage };
  },
);

/**
 * selectZoneIntroShouldStart — given a zoneId, returns true when:
 *   - The zone has intro words, AND
 *   - The intro is not yet complete (not all words reviewed)
 *
 * Used by middleware to decide whether to dispatch startIntro.
 *
 * @param {Object} state  - Full Redux state
 * @param {string} zoneId - Zone identifier
 * @returns {boolean}
 */
export const selectZoneIntroShouldStart = (state, zoneId) => {
  const words = getZoneIntroWords(zoneId);
  if (words.length === 0) return false;
  return !isZoneIntroComplete(zoneId, state);
};

/**
 * selectZoneIntroProgress — progress for an arbitrary zone.
 * @param {Object} state  - Full Redux state
 * @param {string} zoneId - Zone identifier
 * @returns {{ reviewed: number, total: number, percentage: number }}
 */
export const selectZoneIntroProgress = (state, zoneId) =>
  getZoneIntroProgress(zoneId, state);

export default zoneIntroSlice.reducer;
