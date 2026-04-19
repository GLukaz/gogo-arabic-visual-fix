/**
 * arenaSlice.js — Redux slice for arena challenge state (Phase 32)
 *
 * Tracks arena progress, challenge completion, scores, streaks, and leaderboards.
 * Lightweight enough for localStorage (NOT IndexedDB).
 *
 * NOTE: Do NOT add to store.js yet — Plan 32-11 handles integration.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  // Active arena session (null when not in arena)
  activeArena: null, // { mode, currentWave, score, streak, startTime, enemiesDefeated }

  // Completed challenge history by mode
  completedChallenges: {}, // { [modeId]: { bestScore, bestWave, completions, lastPlayed } }

  // Leaderboard — top 10 per mode, sorted by score desc
  leaderboard: {}, // { [modeId]: [{ score, wavesCompleted, timestamp, accuracy }] }

  // Puzzle-specific progress tracking
  puzzleProgress: {}, // { [puzzleId]: { solved, attempts } }

  // Lifetime arena stats
  totalArenaWins: 0,
  totalArenaLosses: 0,
  bestStreak: 0,
};

const MAX_LEADERBOARD_ENTRIES = 10;

const arenaSlice = createSlice({
  name: 'arena',
  initialState,
  reducers: {
    startArenaChallenge(state, action) {
      // payload: { mode }
      const { mode } = action.payload;
      state.activeArena = {
        mode,
        currentWave: 1,
        score: 0,
        streak: 0,
        startTime: Date.now(),
        enemiesDefeated: 0,
      };
    },

    completeArenaWave(state, action) {
      // payload: { score, accuracy, enemiesDefeated }
      if (!state.activeArena) return;

      const { score, accuracy, enemiesDefeated } = action.payload;

      state.activeArena.score += score;
      state.activeArena.currentWave += 1;
      state.activeArena.enemiesDefeated += enemiesDefeated || 0;

      // Track streak based on accuracy
      if (accuracy >= 0.8) {
        state.activeArena.streak += 1;
        if (state.activeArena.streak > state.bestStreak) {
          state.bestStreak = state.activeArena.streak;
        }
      } else {
        state.activeArena.streak = 0;
      }
    },

    endArenaChallenge(state, action) {
      // payload: { victory, finalScore }
      if (!state.activeArena) return;

      const { victory, finalScore } = action.payload;
      const { mode, currentWave } = state.activeArena;
      const score = finalScore !== undefined ? finalScore : state.activeArena.score;

      // Update completed challenges
      if (!state.completedChallenges[mode]) {
        state.completedChallenges[mode] = {
          bestScore: 0,
          bestWave: 0,
          completions: 0,
          lastPlayed: null,
        };
      }

      const challenge = state.completedChallenges[mode];
      challenge.lastPlayed = Date.now();

      if (victory) {
        state.totalArenaWins += 1;
        challenge.completions += 1;
      } else {
        state.totalArenaLosses += 1;
      }

      if (score > challenge.bestScore) {
        challenge.bestScore = score;
      }
      if (currentWave > challenge.bestWave) {
        challenge.bestWave = currentWave;
      }

      // Clear active arena
      state.activeArena = null;
    },

    submitArenaScore(state, action) {
      // payload: { mode, score, wavesCompleted, accuracy, timestamp }
      const { mode, score, wavesCompleted, accuracy, timestamp } = action.payload;

      if (!state.leaderboard[mode]) {
        state.leaderboard[mode] = [];
      }

      state.leaderboard[mode].push({
        score,
        wavesCompleted,
        accuracy,
        timestamp: timestamp || Date.now(),
      });

      // Sort by score descending and keep top 10
      state.leaderboard[mode].sort((a, b) => b.score - a.score);
      state.leaderboard[mode] = state.leaderboard[mode].slice(
        0,
        MAX_LEADERBOARD_ENTRIES
      );
    },

    recordPuzzleSolve(state, action) {
      // payload: { puzzleId, solved }
      const { puzzleId, solved } = action.payload;

      if (!state.puzzleProgress[puzzleId]) {
        state.puzzleProgress[puzzleId] = { solved: false, attempts: 0 };
      }

      state.puzzleProgress[puzzleId].attempts += 1;
      if (solved) {
        state.puzzleProgress[puzzleId].solved = true;
      }
    },
  },
});

// ──────────────────────────────────────────────────
// Actions
// ──────────────────────────────────────────────────

export const {
  startArenaChallenge,
  completeArenaWave,
  endArenaChallenge,
  submitArenaScore,
  recordPuzzleSolve,
} = arenaSlice.actions;

// ──────────────────────────────────────────────────
// Selectors
// ──────────────────────────────────────────────────

export const selectActiveArena = (state) => state.arena.activeArena;

export const selectArenaLeaderboard = (mode) => (state) => {
  return state.arena.leaderboard[mode] || [];
};

export const selectCompletedChallenges = (state) =>
  state.arena.completedChallenges;

export const selectPuzzleProgress = (state) => state.arena.puzzleProgress;

export const selectArenaTotalStats = createSelector(
  [(state) => state.arena],
  (arena) => ({
    totalWins: arena.totalArenaWins,
    totalLosses: arena.totalArenaLosses,
    bestStreak: arena.bestStreak,
    winRate:
      arena.totalArenaWins + arena.totalArenaLosses > 0
        ? Math.round(
            (arena.totalArenaWins /
              (arena.totalArenaWins + arena.totalArenaLosses)) *
              100
          )
        : 0,
  })
);

export default arenaSlice.reducer;
