import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * Endgame slice — New Game+, completionist tracking, weekly challenges
 *
 * New Game+ rules:
 *   - Resets: quest progress, narrative flags, zone exploration state
 *   - Keeps: vocabulary (FSRS cards), achievements, titles, codex entries
 *   - XP multiplier stacks 1.5x per cycle, capped at 3x (2 cycles)
 */

const initialState = {
  newGamePlusCount: 0,        // How many times NG+ has been started
  newGamePlusActive: false,   // Currently in NG+ mode
  completionPercentage: 0,    // Overall game completion (0-100)
  weeklyChallenge: null,      // Current weekly challenge object or null
  weeklyChallengeHistory: [], // Past completed challenge records
  totalPlaythroughs: 0,       // Lifetime playthroughs (increments on NG+ start)
};

const endgameSlice = createSlice({
  name: 'endgame',
  initialState,
  reducers: {
    /**
     * Start a New Game+ cycle.
     * Increments count and playthroughs, marks NG+ active.
     * Quest/narrative resets are handled externally by dispatching
     * the relevant resets on the quest and narrative slices.
     */
    startNewGamePlus(state) {
      state.newGamePlusCount += 1;
      state.totalPlaythroughs += 1;
      state.newGamePlusActive = true;
      // Reset exploration completion; vocabulary/achievements/codex are left intact
      state.completionPercentage = 0;
    },

    /**
     * Update the global completion percentage.
     * Computed externally from category breakdowns, stored here.
     */
    updateCompletionPercentage(state, action) {
      // payload: number (0–100)
      state.completionPercentage = Math.max(0, Math.min(100, action.payload));
    },

    /**
     * Set the current weekly challenge.
     * payload: challenge object from weeklyRotation.js
     */
    setWeeklyChallenge(state, action) {
      state.weeklyChallenge = action.payload;
    },

    /**
     * Mark the current weekly challenge as completed.
     * Moves it to history with a completedAt timestamp.
     */
    completeWeeklyChallenge(state) {
      if (state.weeklyChallenge) {
        state.weeklyChallengeHistory.push({
          ...state.weeklyChallenge,
          completedAt: Date.now(),
        });
        state.weeklyChallenge = null;
      }
    },

    /**
     * Deactivate NG+ mode flag (e.g. after initial setup sequence completes).
     */
    clearNewGamePlusActive(state) {
      state.newGamePlusActive = false;
    },
  },
});

export const {
  startNewGamePlus,
  updateCompletionPercentage,
  setWeeklyChallenge,
  completeWeeklyChallenge,
  clearNewGamePlusActive,
} = endgameSlice.actions;

// ========== SELECTORS ==========

export const selectEndgame = (state) => state.endgame;

export const selectNewGamePlusCount = (state) => state.endgame.newGamePlusCount;
export const selectNewGamePlusActive = (state) => state.endgame.newGamePlusActive;
export const selectCompletionPercentage = (state) => state.endgame.completionPercentage;
export const selectWeeklyChallenge = (state) => state.endgame.weeklyChallenge;
export const selectWeeklyChallengeHistory = (state) => state.endgame.weeklyChallengeHistory;
export const selectTotalPlaythroughs = (state) => state.endgame.totalPlaythroughs;

/**
 * selectNewGamePlusBonus
 * Returns the XP multiplier for the current NG+ cycle.
 * 1.5x per cycle, hard-capped at 3x (achieved at cycle 2+).
 */
export const selectNewGamePlusBonus = createSelector(
  [selectNewGamePlusCount],
  (count) => {
    if (count === 0) return 1;
    // 1.5x for first cycle, 2.25x for second, but cap at 3x
    const raw = Math.pow(1.5, count);
    return Math.min(raw, 3);
  }
);

/**
 * selectCompletedWeeklyChallengeCount
 * Convenience selector for the Year of Arabic challenge (need 10+ completed).
 */
export const selectCompletedWeeklyChallengeCount = createSelector(
  [selectWeeklyChallengeHistory],
  (history) => history.length
);

export default endgameSlice.reducer;
