/**
 * readingSlice.js
 *
 * Redux Toolkit slice for tracking reading passage progress.
 * Phase 82 (READ-01 + READ-02)
 *
 * State shape:
 * {
 *   completedPassages: { [passageId]: { score, completedAt, wordsEncountered } },
 *   currentPassageId: null | string,
 *   readingStats: { totalRead, averageScore, passagesPerLevel: { A1, A2, B1, B2 } }
 * }
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getReadingPassageById } from '../../data/readingPassages.js';

const initialState = {
  completedPassages: {},
  currentPassageId: null,
  readingStats: {
    totalRead: 0,
    averageScore: 0,
    passagesPerLevel: { A1: 0, A2: 0, B1: 0, B2: 0 },
  },
};

/**
 * Recalculate aggregate stats from completedPassages map.
 */
function recalcStats(state) {
  const entries = Object.entries(state.completedPassages);
  const total = entries.length;
  state.readingStats.totalRead = total;

  if (total === 0) {
    state.readingStats.averageScore = 0;
    state.readingStats.passagesPerLevel = { A1: 0, A2: 0, B1: 0, B2: 0 };
    return;
  }

  let scoreSum = 0;
  const perLevel = { A1: 0, A2: 0, B1: 0, B2: 0 };

  for (const [id, data] of entries) {
    scoreSum += data.score;
    const passage = getReadingPassageById(id);
    if (passage && perLevel[passage.cefrLevel] !== undefined) {
      perLevel[passage.cefrLevel]++;
    }
  }

  state.readingStats.averageScore = Math.round((scoreSum / total) * 100) / 100;
  state.readingStats.passagesPerLevel = perLevel;
}

const readingSlice = createSlice({
  name: 'reading',
  initialState,
  reducers: {
    /**
     * Start reading a passage.
     * payload: { passageId: string }
     */
    startPassage(state, action) {
      const { passageId } = action.payload;
      state.currentPassageId = passageId;
    },

    /**
     * Complete a passage with a score and encountered words.
     * payload: { passageId: string, score: number, wordsEncountered: string[] }
     */
    completePassage(state, action) {
      const { passageId, score, wordsEncountered = [] } = action.payload;
      state.completedPassages[passageId] = {
        score,
        completedAt: Date.now(),
        wordsEncountered,
      };
      state.currentPassageId = null;
      recalcStats(state);
    },

    /**
     * Reset the current passage (e.g. user leaves without completing).
     */
    resetCurrent(state) {
      state.currentPassageId = null;
    },
  },
});

export const { startPassage, completePassage, resetCurrent } = readingSlice.actions;

// ============================================================
// Selectors
// ============================================================

/** Select the full completedPassages map */
export const selectCompletedPassages = (state) => state.reading?.completedPassages ?? {};

/** Select aggregate reading stats */
export const selectReadingStats = (state) => state.reading?.readingStats ?? initialState.readingStats;

/** Select the current passage ID */
export const selectCurrentPassage = (state) => state.reading?.currentPassageId ?? null;

/** Select score for a specific passage */
export const selectPassageScore = (passageId) =>
  createSelector(
    selectCompletedPassages,
    (completed) => completed[passageId]?.score ?? null,
  );

export default readingSlice.reducer;
