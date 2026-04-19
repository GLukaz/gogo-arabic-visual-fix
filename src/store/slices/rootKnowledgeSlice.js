/**
 * rootKnowledgeSlice.js — FEAT-043
 *
 * Tracks which Arabic trilateral roots the player has been taught,
 * and the mastery score for each root based on derived word knowledge.
 *
 * Root teaching is integrated into the foundation phase:
 *   - 5 roots introduced after the first 20 core words
 *   - Additional roots unlock as the player progresses through zones
 *
 * Mastery is calculated as the average score across all derived words
 * in the root's teaching set (0-100 per word).
 */
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { ROOT_TEACHING_SET, getRootById } from '../../data/rootTeachingSet.js';

// Re-export pure helpers from data layer for convenience
export { predictWordFromRoot, getFoundationRoots } from '../../data/rootTeachingSet.js';

/** Minimum average score (0-100) across derived words to count a root as "mastered" */
export const ROOT_MASTERY_THRESHOLD = 70;

// ── Pure Helpers ──────────────────────────────────────────────────────────────

/**
 * Calculate mastery percentage (0-100) for a single root.
 * Averages the scores of all derived words that have been scored.
 * If no words have been scored yet, returns 0.
 *
 * @param {Object} state - Full Redux state (must have rootKnowledge key)
 * @param {string} rootId - Root ID (e.g. "root_ktb")
 * @returns {number} Mastery percentage 0-100
 */
export function getRootMastery(state, rootId) {
  const rootEntry = getRootById(rootId);
  if (!rootEntry) return 0;

  const wordScores = state.rootKnowledge?.wordScores?.[rootId] ?? {};
  const scores = rootEntry.derivedWords.map((w) => wordScores[w.arabic] ?? 0);

  if (scores.length === 0) return 0;
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return Math.round(avg);
}

/**
 * Returns the array of root IDs the player has been taught.
 *
 * @param {Object} state - Full Redux state
 * @returns {string[]}
 */
export function getKnownRoots(state) {
  return state.rootKnowledge?.knownRoots ?? [];
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  /**
   * Ordered list of root IDs the player has been formally introduced to.
   * Roots are appended in teaching order.
   */
  knownRoots: [],

  /**
   * Per-root, per-word mastery scores.
   * { [rootId: string]: { [arabic: string]: number (0-100) } }
   */
  wordScores: {},
};

const rootKnowledgeSlice = createSlice({
  name: 'rootKnowledge',
  initialState,
  reducers: {
    /**
     * Mark a root as formally introduced to the player.
     * Idempotent — calling twice for the same rootId has no effect.
     * Payload: rootId string (e.g. "root_ktb")
     */
    learnRoot(state, action) {
      const rootId = action.payload;
      if (!rootId) return;
      if (state.knownRoots.includes(rootId)) return;

      // Validate root exists in teaching set
      const rootEntry = ROOT_TEACHING_SET.find((r) => r.id === rootId);
      if (!rootEntry) return;

      state.knownRoots.push(rootId);

      // Initialize word score map for this root (all 0)
      if (!state.wordScores[rootId]) {
        state.wordScores[rootId] = {};
      }
    },

    /**
     * Record a mastery score for a derived word within a root.
     * Payload: { rootId: string, arabic: string, score: number }
     * Score is clamped to 0-100.
     */
    updateWordScore(state, action) {
      const { rootId, arabic, score } = action.payload;
      if (!rootId || !arabic) return;

      const clamped = Math.max(0, Math.min(100, Math.round(score)));

      if (!state.wordScores[rootId]) {
        state.wordScores[rootId] = {};
      }
      state.wordScores[rootId][arabic] = clamped;
    },

    /**
     * Reset mastery for a single root (word scores → 0, keeps root as known).
     * Payload: rootId string
     */
    resetRootScores(state, action) {
      const rootId = action.payload;
      if (state.wordScores[rootId]) {
        state.wordScores[rootId] = {};
      }
    },

    /**
     * Fully reset all root knowledge (for fresh-start / testing).
     */
    resetAllRootKnowledge(state) {
      state.knownRoots = [];
      state.wordScores = {};
    },
  },
});

export const { learnRoot, updateWordScore, resetRootScores, resetAllRootKnowledge } =
  rootKnowledgeSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Array of root IDs the player has been taught */
export const selectKnownRoots = (state) => getKnownRoots(state);

/** Mastery percentage (0-100) for a single root */
export const selectRootMastery = (state, rootId) => getRootMastery(state, rootId);

/**
 * Memoized selector: mastery summary for all known roots.
 * Returns { [rootId]: { root, coreMeaning, mastery, wordCount, scoredCount } }
 */
export const selectRootMasterySummary = createSelector(
  (state) => state.rootKnowledge?.knownRoots ?? [],
  (state) => state.rootKnowledge?.wordScores ?? {},
  (knownRoots, wordScores) => {
    const summary = {};
    for (const rootId of knownRoots) {
      const rootEntry = getRootById(rootId);
      if (!rootEntry) continue;

      const scores = rootEntry.derivedWords.map(
        (w) => (wordScores[rootId]?.[w.arabic] ?? 0),
      );
      const scoredCount = scores.filter((s) => s > 0).length;
      const avg = scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
        : 0;

      summary[rootId] = {
        root: rootEntry.root,
        coreMeaning: rootEntry.coreMeaning,
        mastery: avg,
        wordCount: rootEntry.derivedWords.length,
        scoredCount,
      };
    }
    return summary;
  },
);

/**
 * Memoized selector: overall progress across all known roots.
 * Returns { known, total, masteredCount, averageMastery }
 */
export const selectRootKnowledgeProgress = createSelector(
  (state) => state.rootKnowledge?.knownRoots ?? [],
  (state) => state.rootKnowledge?.wordScores ?? {},
  (knownRoots, wordScores) => {
    const total = ROOT_TEACHING_SET.length;
    const known = knownRoots.length;

    const masteredCount = knownRoots.filter((rootId) => {
      const rootEntry = getRootById(rootId);
      if (!rootEntry) return false;
      const scores = rootEntry.derivedWords.map(
        (w) => (wordScores[rootId]?.[w.arabic] ?? 0),
      );
      const avg = scores.length > 0
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length
        : 0;
      return avg >= ROOT_MASTERY_THRESHOLD;
    }).length;

    const averageMastery = known === 0 ? 0 : Math.round(
      knownRoots.reduce((sum, rootId) => {
        const rootEntry = getRootById(rootId);
        if (!rootEntry) return sum;
        const scores = rootEntry.derivedWords.map(
          (w) => (wordScores[rootId]?.[w.arabic] ?? 0),
        );
        const avg = scores.length > 0
          ? scores.reduce((s2, s) => s2 + s, 0) / scores.length
          : 0;
        return sum + avg;
      }, 0) / known,
    );

    return { known, total, masteredCount, averageMastery };
  },
);

export default rootKnowledgeSlice.reducer;
