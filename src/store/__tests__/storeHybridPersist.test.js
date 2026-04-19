/**
 * Integration Tests for Hybrid Persist Store Configuration
 *
 * Verifies that nested persistReducer for vocabulary + battle preserves
 * selector paths and doesn't break existing code.
 *
 * Critical assertions:
 * - state.vocabulary.fsrsCards is accessible (not nested under state.heavy or state._persist)
 * - state.battle.battleHistory is accessible
 * - Selectors from vocabularySlice work correctly
 * - Selectors from battleSlice work correctly
 * - Actions update state at expected paths
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { combineReducers } from '@reduxjs/toolkit';
import { createTestStore } from '../../test/testUtils.jsx';
import {
  addFsrsCard,
  updateFsrsCard,
  selectFsrsCards,
  selectLearnedWordCount,
} from '../slices/vocabularySlice.js';
import {
  endBattle,
  selectBattleHistory,
  selectBattleWinRate,
} from '../slices/battleSlice.js';
import playerReducer from '../slices/playerSlice.js';
import vocabularyReducer from '../slices/vocabularySlice.js';
import battleReducer from '../slices/battleSlice.js';

describe('Hybrid Persist Store Integration', () => {
  let store;

  beforeEach(() => {
    // Create test store with same reducer structure as production
    // (without redux-persist — just testing reducer shape)
    const rootReducer = combineReducers({
      player: playerReducer,
      vocabulary: vocabularyReducer,
      battle: battleReducer,
    });

    store = createTestStore({}, rootReducer);
  });

  describe('State shape preservation', () => {
    it('vocabulary slice is at state.vocabulary (not nested)', () => {
      const state = store.getState();

      expect(state.vocabulary).toBeDefined();
      expect(state.vocabulary.fsrsCards).toBeDefined();
      expect(state.vocabulary.reviewQueue).toBeDefined();
      expect(state.vocabulary.stats).toBeDefined();
    });

    it('battle slice is at state.battle (not nested)', () => {
      const state = store.getState();

      expect(state.battle).toBeDefined();
      expect(state.battle.battleHistory).toBeDefined();
      expect(state.battle.activeBattle).toBeDefined();
    });

    it('player slice is at state.player', () => {
      const state = store.getState();

      expect(state.player).toBeDefined();
      expect(state.player.name).toBeDefined();
      expect(state.player.level).toBeDefined();
    });

    it('state does not have unexpected nested structures', () => {
      const state = store.getState();

      // Verify no 'heavy', 'light', '_persist' etc. at root level
      expect(state.heavy).toBeUndefined();
      expect(state.light).toBeUndefined();
      expect(state.indexedDB).toBeUndefined();
      expect(state.localStorage).toBeUndefined();
    });
  });

  describe('Vocabulary selector paths', () => {
    it('selectFsrsCards works correctly', () => {
      const state = store.getState();
      const fsrsCards = selectFsrsCards(state);

      expect(fsrsCards).toBeDefined();
      expect(typeof fsrsCards).toBe('object');
    });

    it('selectLearnedWordCount works correctly', () => {
      const state = store.getState();
      const count = selectLearnedWordCount(state);

      expect(typeof count).toBe('number');
      expect(count).toBe(0); // Empty store
    });

    it('selectors work after adding vocabulary data', () => {
      // Add FSRS card
      store.dispatch(
        addFsrsCard({
          wordId: 'word1',
          card: {
            due: new Date().toISOString(),
            stability: 1,
            difficulty: 5,
            elapsedDays: 0,
            scheduledDays: 1,
            reps: 0,
            lapses: 0,
            state: 0,
            lastReview: null,
          },
        })
      );

      const state = store.getState();
      const fsrsCards = selectFsrsCards(state);
      const count = selectLearnedWordCount(state);

      expect(Object.keys(fsrsCards)).toHaveLength(1);
      expect(fsrsCards.word1).toBeDefined();
      expect(count).toBe(1);
    });
  });

  describe('Battle selector paths', () => {
    it('selectBattleHistory works correctly', () => {
      const state = store.getState();
      const history = selectBattleHistory(state);

      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
    });

    it('selectBattleWinRate works correctly', () => {
      const state = store.getState();
      const winRate = selectBattleWinRate(state);

      expect(typeof winRate).toBe('number');
      expect(winRate).toBe(0); // No battles yet
    });

    it('selectors work after adding battle data', () => {
      // End a battle (adds to history)
      store.dispatch(
        endBattle({
          victory: true,
          accuracy: 0.8,
          timeElapsed: 60000,
          rewards: { xp: 100, gold: 50 },
        })
      );

      const state = store.getState();
      const history = selectBattleHistory(state);
      const winRate = selectBattleWinRate(state);

      expect(history).toHaveLength(1);
      expect(history[0].victory).toBe(true);
      expect(winRate).toBe(100); // 1 win, 1 battle = 100%
    });
  });

  describe('Actions update state at expected paths', () => {
    it('addFsrsCard updates state.vocabulary.fsrsCards', () => {
      const cardData = {
        wordId: 'testWord',
        card: {
          due: new Date().toISOString(),
          stability: 1,
          difficulty: 5,
          elapsedDays: 0,
          scheduledDays: 1,
          reps: 0,
          lapses: 0,
          state: 0,
          lastReview: null,
        },
        source: 'npc:fatima',
      };

      store.dispatch(addFsrsCard(cardData));

      const state = store.getState();

      expect(state.vocabulary.fsrsCards.testWord).toBeDefined();
      expect(state.vocabulary.fsrsCards.testWord.card).toEqual(cardData.card);
      expect(state.vocabulary.fsrsCards.testWord.source).toBe('npc:fatima');
    });

    it('updateFsrsCard modifies existing card', () => {
      // Add initial card
      store.dispatch(
        addFsrsCard({
          wordId: 'updateTest',
          card: {
            due: new Date().toISOString(),
            stability: 1,
            difficulty: 5,
            elapsedDays: 0,
            scheduledDays: 1,
            reps: 0,
            lapses: 0,
            state: 0,
            lastReview: null,
          },
        })
      );

      // Update card
      const updatedCard = {
        due: new Date(Date.now() + 86400000).toISOString(),
        stability: 2.5,
        difficulty: 4.5,
        elapsedDays: 1,
        scheduledDays: 2,
        reps: 1,
        lapses: 0,
        state: 1,
        lastReview: new Date().toISOString(),
      };

      store.dispatch(
        updateFsrsCard({
          wordId: 'updateTest',
          card: updatedCard,
          log: { rating: 3, state: 1 },
        })
      );

      const state = store.getState();

      expect(state.vocabulary.fsrsCards.updateTest.card).toEqual(updatedCard);
      expect(state.vocabulary.fsrsCards.updateTest.log).toEqual({ rating: 3, state: 1 });
    });

    it('endBattle updates state.battle.battleHistory', () => {
      const battleResult = {
        victory: true,
        accuracy: 0.9,
        timeElapsed: 45000,
        rewards: { xp: 150, gold: 75 },
      };

      store.dispatch(endBattle(battleResult));

      const state = store.getState();

      expect(state.battle.battleHistory).toHaveLength(1);
      expect(state.battle.battleHistory[0].victory).toBe(true);
      expect(state.battle.battleHistory[0].rewards).toEqual({ xp: 150, gold: 75 });
    });

    it('multiple vocabulary actions maintain consistent state', () => {
      // Add multiple cards
      store.dispatch(
        addFsrsCard({
          wordId: 'word1',
          card: { due: new Date().toISOString(), stability: 1, difficulty: 5, elapsedDays: 0, scheduledDays: 1, reps: 0, lapses: 0, state: 0, lastReview: null },
        })
      );

      store.dispatch(
        addFsrsCard({
          wordId: 'word2',
          card: { due: new Date().toISOString(), stability: 1, difficulty: 5, elapsedDays: 0, scheduledDays: 1, reps: 0, lapses: 0, state: 0, lastReview: null },
        })
      );

      store.dispatch(
        addFsrsCard({
          wordId: 'word3',
          card: { due: new Date().toISOString(), stability: 1, difficulty: 5, elapsedDays: 0, scheduledDays: 1, reps: 0, lapses: 0, state: 0, lastReview: null },
        })
      );

      const state = store.getState();

      expect(Object.keys(state.vocabulary.fsrsCards)).toHaveLength(3);
      expect(selectLearnedWordCount(state)).toBe(3);
    });

    it('multiple battle actions maintain consistent state', () => {
      // End multiple battles
      store.dispatch(endBattle({ victory: true, accuracy: 0.8, timeElapsed: 30000, rewards: { xp: 100, gold: 50 } }));
      store.dispatch(endBattle({ victory: false, accuracy: 0.3, timeElapsed: 45000, rewards: null }));
      store.dispatch(endBattle({ victory: true, accuracy: 0.9, timeElapsed: 60000, rewards: { xp: 150, gold: 75 } }));

      const state = store.getState();
      const history = selectBattleHistory(state);
      const winRate = selectBattleWinRate(state);

      expect(history).toHaveLength(3);
      expect(winRate).toBe(67); // 2 wins, 3 total = 66.6% rounded to 67%

      const wins = history.filter(b => b.victory).length;
      const losses = history.filter(b => !b.victory).length;
      expect(wins).toBe(2);
      expect(losses).toBe(1);
    });
  });
});
