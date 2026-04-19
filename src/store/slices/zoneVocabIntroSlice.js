/**
 * Zone Vocabulary Intro Slice — FEAT-045
 *
 * Tracks which zone intro vocabulary words the player has reviewed per zone.
 * A word is "reviewed" when the player has completed its teaching moment.
 * A zone intro is "complete" when all words in that zone have been reviewed.
 */
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getZoneIntroWords, ZONE_IDS } from '../../data/zoneVocabIntros.js';

// ── Pure Helpers ──────────────────────────────────────────────────────────────

/**
 * Returns true when all intro words for a zone have been reviewed.
 *
 * @param {string} zoneId - Zone identifier (e.g. 'oasis_village')
 * @param {Object} state  - Full Redux state (must have zoneVocabIntro key)
 * @returns {boolean}
 */
export function isZoneIntroComplete(zoneId, state) {
  const words = getZoneIntroWords(zoneId);
  if (words.length === 0) return false;

  const reviewed = state.zoneVocabIntro?.reviewedByZone?.[zoneId] ?? {};
  return words.every((word) => reviewed[word.id] === true);
}

/**
 * Returns reviewed count, total, and percentage for a zone's intro progress.
 *
 * @param {string} zoneId - Zone identifier
 * @param {Object} state  - Full Redux state
 * @returns {{ reviewed: number, total: number, percentage: number }}
 */
export function getZoneIntroProgress(zoneId, state) {
  const words = getZoneIntroWords(zoneId);
  const total = words.length;
  if (total === 0) return { reviewed: 0, total: 0, percentage: 0 };

  const reviewed = state.zoneVocabIntro?.reviewedByZone?.[zoneId] ?? {};
  const reviewedCount = words.filter((word) => reviewed[word.id] === true).length;
  const percentage = Math.round((reviewedCount / total) * 100);
  return { reviewed: reviewedCount, total, percentage };
}

/**
 * Returns the next unreviewed word for a zone, or null if all reviewed.
 *
 * @param {string} zoneId - Zone identifier
 * @param {Object} state  - Full Redux state
 * @returns {{ id: string, arabic: string, english: string, root: string, zoneContext: string, exampleInZone: string } | null}
 */
export function getNextUnreviewedWord(zoneId, state) {
  const words = getZoneIntroWords(zoneId);
  const reviewed = state.zoneVocabIntro?.reviewedByZone?.[zoneId] ?? {};
  return words.find((word) => !reviewed[word.id]) ?? null;
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  /**
   * Per-zone reviewed word map.
   * { [zoneId: string]: { [wordId: string]: true } }
   * A word entry is present and true when reviewed; absent when not yet reviewed.
   */
  reviewedByZone: {},
};

const zoneVocabIntroSlice = createSlice({
  name: 'zoneVocabIntro',
  initialState,
  reducers: {
    /**
     * Mark a word as reviewed in a zone.
     * Payload: { zoneId: string, wordId: string }
     */
    markWordReviewed(state, action) {
      const { zoneId, wordId } = action.payload;
      if (!state.reviewedByZone[zoneId]) {
        state.reviewedByZone[zoneId] = {};
      }
      state.reviewedByZone[zoneId][wordId] = true;
    },

    /**
     * Reset the intro progress for a single zone back to zero.
     * Payload: zoneId string
     */
    resetZoneIntro(state, action) {
      const zoneId = action.payload;
      delete state.reviewedByZone[zoneId];
    },

    /**
     * Reset all zone intro progress (e.g. for a fresh start).
     */
    resetAllZoneIntros(state) {
      state.reviewedByZone = {};
    },
  },
});

export const { markWordReviewed, resetZoneIntro, resetAllZoneIntros } =
  zoneVocabIntroSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

/**
 * Returns true when all intro words for a zone have been reviewed.
 * @param {Object} state  - Full Redux state
 * @param {string} zoneId - Zone identifier
 * @returns {boolean}
 */
export const selectIsZoneIntroComplete = (state, zoneId) =>
  isZoneIntroComplete(zoneId, state);

/**
 * Memoized selector factory: returns { reviewed, total, percentage } for a zone.
 *
 * Usage:
 *   const selectOasisProgress = makeSelectZoneIntroProgress('oasis_village');
 *   const progress = useSelector(selectOasisProgress);
 *
 * @param {string} zoneId
 * @returns {Function} Memoized selector
 */
export function makeSelectZoneIntroProgress(zoneId) {
  return createSelector(
    (state) => state.zoneVocabIntro?.reviewedByZone?.[zoneId] ?? {},
    (reviewed) => {
      const words = getZoneIntroWords(zoneId);
      const total = words.length;
      if (total === 0) return { reviewed: 0, total: 0, percentage: 0 };
      const reviewedCount = words.filter((w) => reviewed[w.id] === true).length;
      const percentage = Math.round((reviewedCount / total) * 100);
      return { reviewed: reviewedCount, total, percentage };
    },
  );
}

/**
 * selectZoneIntroProgress — convenience selector for a zone given as second arg.
 * Returns { reviewed, total, percentage }.
 *
 * @param {Object} state  - Full Redux state
 * @param {string} zoneId - Zone identifier
 * @returns {{ reviewed: number, total: number, percentage: number }}
 */
export const selectZoneIntroProgress = (state, zoneId) =>
  getZoneIntroProgress(zoneId, state);

/**
 * Memoized selector: aggregate progress across all 8 zones.
 * Returns { byZone: { [zoneId]: { reviewed, total, percentage } }, totalReviewed, totalWords }
 */
export const selectAllZoneIntroProgress = createSelector(
  (state) => state.zoneVocabIntro?.reviewedByZone ?? {},
  (reviewedByZone) => {
    const byZone = {};
    let totalReviewed = 0;
    let totalWords = 0;

    for (const zoneId of ZONE_IDS) {
      const words = getZoneIntroWords(zoneId);
      const reviewed = reviewedByZone[zoneId] ?? {};
      const reviewedCount = words.filter((w) => reviewed[w.id] === true).length;
      const percentage = words.length === 0 ? 0 : Math.round((reviewedCount / words.length) * 100);
      byZone[zoneId] = { reviewed: reviewedCount, total: words.length, percentage };
      totalReviewed += reviewedCount;
      totalWords += words.length;
    }

    const overallPercentage = totalWords === 0 ? 0 : Math.round((totalReviewed / totalWords) * 100);
    return { byZone, totalReviewed, totalWords, overallPercentage };
  },
);

export default zoneVocabIntroSlice.reducer;
