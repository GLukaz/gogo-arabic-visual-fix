import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * poetrySlice.js — Poetry battle state management
 *
 * Poetry battles are a separate game mode from BattleScene/BattleStateMachine.
 * They are score-comparison (fill-in-the-blank) with no HP/MP/damage.
 *
 * POET-01: startPoetryBattle — initialize a battle session with poem + blanks
 * POET-01: submitPlayerAnswer — record player's choice for a blank
 * POET-01: setNpcAnswers — set the NPC poet's simulated answers
 * POET-01: endPoetryBattle — finalize scores, persist result, clear active battle
 * POET-02: unlockPoem — mark a poem as accessible via NPC interaction
 *
 * Persistence:
 *   - completedBattles and unlockedPoems → IndexedDB (nested persistReducer in store.js)
 *   - activeBattle → session-only (blacklisted from persist, same pattern as gossip tokens)
 */

const initialState = {
  activeBattle: null,
  // activeBattle shape when active:
  // {
  //   poemId: string,
  //   poetId: string,
  //   blanks: [{ blankIndex: number, wordId: string, cefrLevel: string }],
  //   playerAnswers: [], // [{ blankIndex, wordId, isCorrect }]
  //   npcAnswers: [],    // [{ blankIndex, isCorrect }]
  //   currentBlankIndex: 0,
  //   status: 'in_progress' | 'scoring' | 'complete',
  //   choices: [],  // current blank's 4 word choices [{ wordId, arabic, isCorrect }]
  // }
  completedBattles: [],
  // [{ poemId, poetId, playerScore, npcScore, won, completedAt }]
  unlockedPoems: [],
  // [poemId, ...]
};

const poetrySlice = createSlice({
  name: 'poetry',
  initialState,
  reducers: {
    startPoetryBattle(state, action) {
      const { poemId, poetId, blanks } = action.payload;
      state.activeBattle = {
        poemId,
        poetId,
        blanks,
        playerAnswers: [],
        npcAnswers: [],
        currentBlankIndex: 0,
        status: 'in_progress',
        choices: [],
      };
    },

    setChoices(state, action) {
      if (state.activeBattle) {
        state.activeBattle.choices = action.payload; // [{ wordId, arabic, isCorrect }]
      }
    },

    submitPlayerAnswer(state, action) {
      const { blankIndex, wordId, isCorrect } = action.payload;
      if (state.activeBattle) {
        state.activeBattle.playerAnswers[blankIndex] = { wordId, isCorrect };
      }
    },

    advanceBlank(state) {
      if (!state.activeBattle) return;
      if (state.activeBattle.currentBlankIndex < state.activeBattle.blanks.length - 1) {
        state.activeBattle.currentBlankIndex += 1;
        state.activeBattle.choices = [];
      } else {
        state.activeBattle.status = 'scoring';
      }
    },

    setNpcAnswers(state, action) {
      if (state.activeBattle) {
        state.activeBattle.npcAnswers = action.payload;
      }
    },

    endPoetryBattle(state, action) {
      const { won, playerScore, npcScore } = action.payload;
      if (state.activeBattle) {
        state.completedBattles.push({
          poemId: state.activeBattle.poemId,
          poetId: state.activeBattle.poetId,
          playerScore,
          npcScore,
          won,
          completedAt: Date.now(),
        });
        state.activeBattle = null;
      }
    },

    unlockPoem(state, action) {
      const poemId = action.payload;
      if (!state.unlockedPoems.includes(poemId)) {
        state.unlockedPoems.push(poemId);
      }
    },
  },
});

export const {
  startPoetryBattle,
  setChoices,
  submitPlayerAnswer,
  advanceBlank,
  setNpcAnswers,
  endPoetryBattle,
  unlockPoem,
} = poetrySlice.actions;

// ========== SELECTORS ==========

export const selectActiveBattle = (state) => state.poetry.activeBattle;
export const selectCompletedBattles = (state) => state.poetry.completedBattles;
export const selectUnlockedPoems = (state) => state.poetry.unlockedPoems;
export const selectPoetryBattleActive = (state) => state.poetry.activeBattle !== null;

/**
 * selectPoetryWins — total number of poetry battles won by the player.
 */
export const selectPoetryWins = createSelector(
  [selectCompletedBattles],
  (battles) => battles.filter((b) => b.won).length
);

/**
 * selectIsPoemUnlocked — parameterized selector.
 * Returns true if the given poemId is in the unlockedPoems list.
 */
export const selectIsPoemUnlocked = (poemId) => (state) =>
  state.poetry.unlockedPoems.includes(poemId);

export default poetrySlice.reducer;
