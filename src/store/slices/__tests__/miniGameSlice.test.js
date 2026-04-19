import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  recordWordSearchScore,
  recordCrosswordScore,
  recordNumberScore,
  recordMemoryScore,
  selectMiniGameStats,
  selectBestScore,
} from '../miniGameSlice.js';

describe('miniGameSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  // ─── Initial state ──────────────────────────────────────────
  it('has correct initial state', () => {
    expect(initialState.scores.wordSearch).toEqual({});
    expect(initialState.scores.crossword).toEqual({});
    expect(initialState.scores.numberChallenge.bestScore).toBe(0);
    expect(initialState.scores.numberChallenge.gamesPlayed).toBe(0);
    expect(initialState.scores.numberChallenge.totalCorrect).toBe(0);
    expect(initialState.scores.memoryMatch).toEqual({});
    expect(initialState.stats.totalGamesPlayed).toBe(0);
    expect(initialState.stats.favoriteGame).toBeNull();
  });

  // ─── recordWordSearchScore ──────────────────────────────────
  describe('recordWordSearchScore', () => {
    it('records a new best score for a puzzle', () => {
      const state = reducer(
        initialState,
        recordWordSearchScore({ puzzleId: 'ws-easy-01', score: 500 }),
      );
      expect(state.scores.wordSearch['ws-easy-01'].bestScore).toBe(500);
      expect(state.scores.wordSearch['ws-easy-01'].completedAt).toBeGreaterThan(0);
      expect(state.stats.totalGamesPlayed).toBe(1);
    });

    it('updates best score only if higher', () => {
      let state = reducer(
        initialState,
        recordWordSearchScore({ puzzleId: 'ws-easy-01', score: 500 }),
      );
      state = reducer(
        state,
        recordWordSearchScore({ puzzleId: 'ws-easy-01', score: 300 }),
      );
      expect(state.scores.wordSearch['ws-easy-01'].bestScore).toBe(500);
      expect(state.stats.totalGamesPlayed).toBe(2);
    });

    it('replaces best score when new score is higher', () => {
      let state = reducer(
        initialState,
        recordWordSearchScore({ puzzleId: 'ws-easy-01', score: 300 }),
      );
      state = reducer(
        state,
        recordWordSearchScore({ puzzleId: 'ws-easy-01', score: 700 }),
      );
      expect(state.scores.wordSearch['ws-easy-01'].bestScore).toBe(700);
    });
  });

  // ─── recordCrosswordScore ───────────────────────────────────
  describe('recordCrosswordScore', () => {
    it('records a new crossword score', () => {
      const state = reducer(
        initialState,
        recordCrosswordScore({ puzzleId: 'cw-easy-01', score: 1000 }),
      );
      expect(state.scores.crossword['cw-easy-01'].bestScore).toBe(1000);
      expect(state.stats.totalGamesPlayed).toBe(1);
    });

    it('does not decrease best score', () => {
      let state = reducer(
        initialState,
        recordCrosswordScore({ puzzleId: 'cw-easy-01', score: 1000 }),
      );
      state = reducer(
        state,
        recordCrosswordScore({ puzzleId: 'cw-easy-01', score: 200 }),
      );
      expect(state.scores.crossword['cw-easy-01'].bestScore).toBe(1000);
    });
  });

  // ─── recordNumberScore ──────────────────────────────────────
  describe('recordNumberScore', () => {
    it('records number challenge score and stats', () => {
      const state = reducer(
        initialState,
        recordNumberScore({ score: 800, correct: 16 }),
      );
      expect(state.scores.numberChallenge.bestScore).toBe(800);
      expect(state.scores.numberChallenge.gamesPlayed).toBe(1);
      expect(state.scores.numberChallenge.totalCorrect).toBe(16);
      expect(state.stats.totalGamesPlayed).toBe(1);
    });

    it('accumulates games played and total correct', () => {
      let state = reducer(
        initialState,
        recordNumberScore({ score: 800, correct: 16 }),
      );
      state = reducer(
        state,
        recordNumberScore({ score: 600, correct: 12 }),
      );
      expect(state.scores.numberChallenge.gamesPlayed).toBe(2);
      expect(state.scores.numberChallenge.totalCorrect).toBe(28);
      expect(state.scores.numberChallenge.bestScore).toBe(800); // keeps higher
    });

    it('updates best score when higher', () => {
      let state = reducer(
        initialState,
        recordNumberScore({ score: 400, correct: 10 }),
      );
      state = reducer(
        state,
        recordNumberScore({ score: 900, correct: 18 }),
      );
      expect(state.scores.numberChallenge.bestScore).toBe(900);
    });
  });

  // ─── recordMemoryScore ──────────────────────────────────────
  describe('recordMemoryScore', () => {
    it('records memory match time', () => {
      const state = reducer(
        initialState,
        recordMemoryScore({ setId: 'animals', time: 45 }),
      );
      expect(state.scores.memoryMatch['animals'].bestTime).toBe(45);
      expect(state.scores.memoryMatch['animals'].completedAt).toBeGreaterThan(0);
      expect(state.stats.totalGamesPlayed).toBe(1);
    });

    it('updates best time only if lower', () => {
      let state = reducer(
        initialState,
        recordMemoryScore({ setId: 'animals', time: 45 }),
      );
      state = reducer(
        state,
        recordMemoryScore({ setId: 'animals', time: 60 }),
      );
      expect(state.scores.memoryMatch['animals'].bestTime).toBe(45);
    });

    it('replaces best time when faster', () => {
      let state = reducer(
        initialState,
        recordMemoryScore({ setId: 'animals', time: 60 }),
      );
      state = reducer(
        state,
        recordMemoryScore({ setId: 'animals', time: 30 }),
      );
      expect(state.scores.memoryMatch['animals'].bestTime).toBe(30);
    });
  });

  // ─── Favorite game tracking ─────────────────────────────────
  describe('favoriteGame', () => {
    it('tracks the most-played game', () => {
      let state = reducer(
        initialState,
        recordWordSearchScore({ puzzleId: 'ws-1', score: 100 }),
      );
      state = reducer(
        state,
        recordWordSearchScore({ puzzleId: 'ws-2', score: 100 }),
      );
      state = reducer(
        state,
        recordCrosswordScore({ puzzleId: 'cw-1', score: 100 }),
      );
      // wordSearch has 2 entries vs crossword's 1
      expect(state.stats.favoriteGame).toBe('wordSearch');
    });
  });

  // ─── Selectors ──────────────────────────────────────────────
  describe('selectMiniGameStats', () => {
    it('returns aggregated stats', () => {
      let state = reducer(
        initialState,
        recordWordSearchScore({ puzzleId: 'ws-1', score: 100 }),
      );
      state = reducer(
        state,
        recordNumberScore({ score: 500, correct: 10 }),
      );
      const rootState = { miniGames: state };
      const stats = selectMiniGameStats(rootState);
      expect(stats.totalGamesPlayed).toBe(2);
      expect(stats.wordSearchCompleted).toBe(1);
      expect(stats.numberGamesPlayed).toBe(1);
    });
  });

  describe('selectBestScore', () => {
    it('returns null for unplayed game/puzzle', () => {
      const rootState = { miniGames: initialState };
      expect(selectBestScore(rootState, 'wordSearch', 'ws-1')).toBeNull();
      expect(selectBestScore(rootState, 'crossword', 'cw-1')).toBeNull();
      expect(selectBestScore(rootState, 'memoryMatch', 'animals')).toBeNull();
    });

    it('returns best score for word search', () => {
      const state = reducer(
        initialState,
        recordWordSearchScore({ puzzleId: 'ws-1', score: 450 }),
      );
      const rootState = { miniGames: state };
      expect(selectBestScore(rootState, 'wordSearch', 'ws-1')).toBe(450);
    });

    it('returns best score for number challenge (ignores id)', () => {
      const state = reducer(
        initialState,
        recordNumberScore({ score: 750, correct: 15 }),
      );
      const rootState = { miniGames: state };
      expect(selectBestScore(rootState, 'numberChallenge', null)).toBe(750);
    });

    it('returns best time for memory match', () => {
      const state = reducer(
        initialState,
        recordMemoryScore({ setId: 'food', time: 33 }),
      );
      const rootState = { miniGames: state };
      expect(selectBestScore(rootState, 'memoryMatch', 'food')).toBe(33);
    });

    it('returns null for unknown game type', () => {
      const rootState = { miniGames: initialState };
      expect(selectBestScore(rootState, 'unknownGame', 'id')).toBeNull();
    });
  });
});
