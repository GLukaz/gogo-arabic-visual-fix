/**
 * Zone Grammar Slice — FEAT-048
 *
 * Tracks which zone-mapped grammar points the player has "learned"
 * (i.e. completed the associated grammar exercise).
 *
 * A grammar point is considered learned once the player has successfully
 * completed the exercise attached to it. Progress is persisted to localStorage.
 */
import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  getZoneGrammar,
  getAllGrammarPoints,
  GRAMMAR_ZONE_IDS,
  TOTAL_GRAMMAR_POINTS,
} from '../../data/zoneGrammarPoints.js';

// ── Pure Helpers ──────────────────────────────────────────────────────────────

/**
 * Returns true when a specific grammar point has been learned.
 *
 * @param {string} pointId - Grammar point ID (e.g. 'gp_ov_001')
 * @param {Object} state   - Full Redux state (must have zoneGrammar key)
 * @returns {boolean}
 */
export function isGrammarPointLearned(pointId, state) {
  return state.zoneGrammar?.learnedPoints?.[pointId] === true;
}

/**
 * Returns { learned, total, percentage } for a specific zone.
 *
 * @param {string} zoneId - Zone identifier
 * @param {Object} state  - Full Redux state
 * @returns {{ learned: number, total: number, percentage: number }}
 */
export function getZoneGrammarProgress(zoneId, state) {
  const points = getZoneGrammar(zoneId);
  const total = points.length;
  if (total === 0) return { learned: 0, total: 0, percentage: 0 };

  const learnedPoints = state.zoneGrammar?.learnedPoints ?? {};
  const learned = points.filter((pt) => learnedPoints[pt.id] === true).length;
  return { learned, total, percentage: Math.round((learned / total) * 100) };
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  /**
   * Map of learned grammar point IDs.
   * { [pointId: string]: true }
   * A key is present and true when learned; absent when not yet learned.
   */
  learnedPoints: {},
};

const zoneGrammarSlice = createSlice({
  name: 'zoneGrammar',
  initialState,
  reducers: {
    /**
     * Mark a grammar point as learned.
     * Payload: pointId {string}
     */
    markGrammarPointLearned(state, action) {
      state.learnedPoints[action.payload] = true;
    },

    /**
     * Reset a single grammar point back to unlearned.
     * Payload: pointId {string}
     */
    resetGrammarPoint(state, action) {
      delete state.learnedPoints[action.payload];
    },

    /**
     * Reset all grammar progress (used in tests / new-game).
     */
    resetAllGrammarPoints(state) {
      state.learnedPoints = {};
    },
  },
});

export const { markGrammarPointLearned, resetGrammarPoint, resetAllGrammarPoints } =
  zoneGrammarSlice.actions;

// ── Redux Selectors ───────────────────────────────────────────────────────────

/**
 * selectGrammarProgress(state) → { learned, total, byZone }
 *
 * - learned  {number}  Total grammar points learned across all zones
 * - total    {number}  Total grammar points available (TOTAL_GRAMMAR_POINTS)
 * - byZone   {Object}  Per-zone progress { [zoneId]: { learned, total, percentage } }
 */
export const selectGrammarProgress = createSelector(
  (state) => state.zoneGrammar?.learnedPoints ?? {},
  (learnedPoints) => {
    const fakeState = { zoneGrammar: { learnedPoints } };

    const byZone = {};
    let totalLearned = 0;

    for (const zoneId of GRAMMAR_ZONE_IDS) {
      const progress = getZoneGrammarProgress(zoneId, fakeState);
      byZone[zoneId] = progress;
      totalLearned += progress.learned;
    }

    return {
      learned: totalLearned,
      total: TOTAL_GRAMMAR_POINTS,
      byZone,
    };
  },
);

/**
 * selectIsGrammarPointLearned(state, pointId) → boolean
 * Parameterized selector — use inline for components, or derive from
 * selectGrammarProgress for bulk checks.
 */
export function selectIsGrammarPointLearned(state, pointId) {
  return isGrammarPointLearned(pointId, state);
}

/**
 * selectLearnedGrammarPoints(state) → string[]
 * Returns all learned point IDs.
 */
export const selectLearnedGrammarPoints = createSelector(
  (state) => state.zoneGrammar?.learnedPoints ?? {},
  (learnedPoints) => Object.keys(learnedPoints).filter((id) => learnedPoints[id] === true),
);

/**
 * selectUnlearnedGrammarPoints(state) → Object[]
 * Returns full grammar point objects for all not-yet-learned points, ordered globally.
 */
export const selectUnlearnedGrammarPoints = createSelector(
  (state) => state.zoneGrammar?.learnedPoints ?? {},
  (learnedPoints) => getAllGrammarPoints().filter((pt) => !learnedPoints[pt.id]),
);

export default zoneGrammarSlice.reducer;
