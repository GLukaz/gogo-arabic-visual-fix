import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * miniGameSlice — Tracks scores and stats across all mini-games
 *
 * Phase 85 — Mini-Game Expansion
 */

const initialState = {
  scores: {
    wordSearch: {},   // { [puzzleId]: { bestScore, completedAt } }
    crossword: {},    // { [puzzleId]: { bestScore, completedAt } }
    numberChallenge: {
      bestScore: 0,
      gamesPlayed: 0,
      totalCorrect: 0,
    },
    memoryMatch: {},  // { [setId]: { bestTime, completedAt } }
  },
  stats: {
    totalGamesPlayed: 0,
    favoriteGame: null,
  },
};

const miniGameSlice = createSlice({
  name: 'miniGames',
  initialState,
  reducers: {
    recordWordSearchScore(state, action) {
      // payload: { puzzleId, score }
      const { puzzleId, score } = action.payload;
      const prev = state.scores.wordSearch[puzzleId];
      if (!prev || score > prev.bestScore) {
        state.scores.wordSearch[puzzleId] = {
          bestScore: score,
          completedAt: Date.now(),
        };
      }
      state.stats.totalGamesPlayed += 1;
      _updateFavorite(state, 'wordSearch');
    },

    recordCrosswordScore(state, action) {
      // payload: { puzzleId, score }
      const { puzzleId, score } = action.payload;
      const prev = state.scores.crossword[puzzleId];
      if (!prev || score > prev.bestScore) {
        state.scores.crossword[puzzleId] = {
          bestScore: score,
          completedAt: Date.now(),
        };
      }
      state.stats.totalGamesPlayed += 1;
      _updateFavorite(state, 'crossword');
    },

    recordNumberScore(state, action) {
      // payload: { score, correct }
      const { score, correct } = action.payload;
      const nc = state.scores.numberChallenge;
      if (score > nc.bestScore) {
        nc.bestScore = score;
      }
      nc.gamesPlayed += 1;
      nc.totalCorrect += correct;
      state.stats.totalGamesPlayed += 1;
      _updateFavorite(state, 'numberChallenge');
    },

    recordMemoryScore(state, action) {
      // payload: { setId, time }
      const { setId, time } = action.payload;
      const prev = state.scores.memoryMatch[setId];
      if (!prev || time < prev.bestTime) {
        state.scores.memoryMatch[setId] = {
          bestTime: time,
          completedAt: Date.now(),
        };
      }
      state.stats.totalGamesPlayed += 1;
      _updateFavorite(state, 'memoryMatch');
    },
  },
});

/** Determine the game played most often */
function _updateFavorite(state, gameName) {
  const counts = {
    wordSearch: Object.keys(state.scores.wordSearch).length,
    crossword: Object.keys(state.scores.crossword).length,
    numberChallenge: state.scores.numberChallenge.gamesPlayed,
    memoryMatch: Object.keys(state.scores.memoryMatch).length,
  };
  // Bias towards the one just played when there's a tie
  let max = 0;
  let fav = gameName;
  for (const [name, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      fav = name;
    }
  }
  state.stats.favoriteGame = fav;
}

// ─── Selectors ─────────────────────────────────────────────────
const selectMiniGameRoot = (state) => state.miniGames;

export const selectMiniGameStats = createSelector(
  [selectMiniGameRoot],
  (mg) => ({
    totalGamesPlayed: mg.stats.totalGamesPlayed,
    favoriteGame: mg.stats.favoriteGame,
    wordSearchCompleted: Object.keys(mg.scores.wordSearch).length,
    crosswordCompleted: Object.keys(mg.scores.crossword).length,
    numberGamesPlayed: mg.scores.numberChallenge.gamesPlayed,
    memoryMatchCompleted: Object.keys(mg.scores.memoryMatch).length,
  }),
);

export const selectBestScore = createSelector(
  [selectMiniGameRoot, (_state, game) => game, (_state, _game, id) => id],
  (mg, game, id) => {
    switch (game) {
      case 'wordSearch':
        return mg.scores.wordSearch[id]?.bestScore ?? null;
      case 'crossword':
        return mg.scores.crossword[id]?.bestScore ?? null;
      case 'numberChallenge':
        return mg.scores.numberChallenge.bestScore;
      case 'memoryMatch':
        return mg.scores.memoryMatch[id]?.bestTime ?? null;
      default:
        return null;
    }
  },
);

export const {
  recordWordSearchScore,
  recordCrosswordScore,
  recordNumberScore,
  recordMemoryScore,
} = miniGameSlice.actions;

export default miniGameSlice.reducer;
