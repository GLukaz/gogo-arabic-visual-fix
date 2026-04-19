import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import battleReducer, {
  startBattle,
  dealDamage,
  dealDamageToPlayer,
  endBattle,
  spendMP,
  restoreMP,
  applyStatusEffect,
  tickStatusEffects,
  recordWordUsed,
  incrementTurn,
  setCurrentTurn,
  setPlayerDefending,
  useHint,
  initMultiTargetBattle,
  dealDamageToEnemy,
  updateComboMeter,
  resetComboMeter,
  initCompanionBattle,
  healPlayer,
  damageCompanion,
} from '../../../store/slices/battleSlice.js';

/**
 * Battle System Integration Tests (Phase H / Ralph Phase 71)
 *
 * Tests the full battle lifecycle:
 *   start → player turns → enemy turns → status effects → victory/defeat → rewards
 */
describe('Battle System Integration', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { battle: battleReducer },
    });
  });

  describe('Full battle lifecycle', () => {
    it('should start a battle with correct initial state', () => {
      store.dispatch(startBattle({
        bossId: 'sand_guardian',
        bossHP: 200,
        encounterType: 'story',
        zone: 'oasis_village',
      }));

      const state = store.getState().battle;
      expect(state.activeBattle).toBe('sand_guardian');
      expect(state.playerHP).toBe(100);
      expect(state.bossHP).toBe(200);
      expect(state.maxBossHP).toBe(200);
      expect(state.encounterType).toBe('story');
      expect(state.streak).toBe(0);
    });

    it('should handle correct answer → boss damage → streak increase', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(dealDamage({ damage: 25, correct: true }));

      const state = store.getState().battle;
      expect(state.bossHP).toBe(75);
      expect(state.streak).toBe(1);
      expect(state.currentRound).toBe(1);
    });

    it('should handle incorrect answer → player damage → streak reset', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(dealDamage({ damage: 25, correct: true }));
      store.dispatch(dealDamage({ damage: 15, correct: false }));

      const state = store.getState().battle;
      expect(state.playerHP).toBe(85);
      expect(state.streak).toBe(0);
      expect(state.maxStreak).toBe(1);
    });

    it('should track words used during battle', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(recordWordUsed('kitab'));
      store.dispatch(recordWordUsed('qalam'));
      store.dispatch(recordWordUsed('kitab')); // Duplicate

      expect(store.getState().battle.wordsUsed).toEqual(['kitab', 'qalam']);
    });

    it('should end battle with victory and record history', () => {
      store.dispatch(startBattle({ bossId: 'sand_guardian', bossHP: 50 }));
      store.dispatch(dealDamage({ damage: 50, correct: true }));

      store.dispatch(endBattle({
        victory: true,
        accuracy: 0.9,
        timeElapsed: 45000,
        rewards: { xp: 100, dirhams: 50 },
      }));

      const state = store.getState().battle;
      expect(state.activeBattle).toBeNull();
      expect(state.bossesDefeated).toContain('sand_guardian');
      expect(state.battleHistory).toHaveLength(1);
      expect(state.battleHistory[0].victory).toBe(true);
    });

    it('should end battle with defeat and NOT add to bossesDefeated', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(endBattle({
        victory: false,
        accuracy: 0.3,
        timeElapsed: 30000,
        rewards: {},
      }));

      expect(store.getState().battle.bossesDefeated).not.toContain('boss1');
    });
  });

  describe('Turn system', () => {
    it('should track turn count', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(incrementTurn());
      store.dispatch(incrementTurn());

      expect(store.getState().battle.turnCount).toBe(2);
    });

    it('should swap between player and enemy turns', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(setCurrentTurn('player'));
      expect(store.getState().battle.currentTurn).toBe('player');

      store.dispatch(setCurrentTurn('enemy'));
      expect(store.getState().battle.currentTurn).toBe('enemy');
    });

    it('should halve damage when player is defending', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(setPlayerDefending(true));
      store.dispatch(dealDamageToPlayer({ damage: 20 }));

      expect(store.getState().battle.playerHP).toBe(90); // 20 * 0.5 = 10
    });
  });

  describe('MP and magic system', () => {
    it('should spend and restore MP', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));

      store.dispatch(spendMP(30));
      expect(store.getState().battle.playerMP).toBe(20);

      store.dispatch(restoreMP(10));
      expect(store.getState().battle.playerMP).toBe(30);
    });

    it('should not go below 0 or above max MP', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));

      store.dispatch(spendMP(100));
      expect(store.getState().battle.playerMP).toBe(0);

      store.dispatch(restoreMP(200));
      expect(store.getState().battle.playerMP).toBe(50);
    });
  });

  describe('Status effects', () => {
    it('should apply and tick status effects', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));

      store.dispatch(applyStatusEffect({
        target: 'player',
        effect: { id: 'burn', remainingTurns: 3 },
      }));
      expect(store.getState().battle.playerEffects).toHaveLength(1);

      store.dispatch(tickStatusEffects());
      expect(store.getState().battle.playerEffects[0].remainingTurns).toBe(2);

      store.dispatch(tickStatusEffects());
      store.dispatch(tickStatusEffects());
      expect(store.getState().battle.playerEffects).toHaveLength(0);
    });

    it('should replace existing effect (no stacking)', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));

      store.dispatch(applyStatusEffect({
        target: 'enemy',
        effect: { id: 'slow', remainingTurns: 2 },
      }));
      store.dispatch(applyStatusEffect({
        target: 'enemy',
        effect: { id: 'slow', remainingTurns: 5 },
      }));

      expect(store.getState().battle.enemyEffects).toHaveLength(1);
      expect(store.getState().battle.enemyEffects[0].remainingTurns).toBe(5);
    });
  });

  describe('Companion battles', () => {
    it('should initialize companion with HP and MP', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(initCompanionBattle({ hp: 80, mp: 40 }));

      const state = store.getState().battle;
      expect(state.companionHP).toBe(80);
      expect(state.companionMaxHP).toBe(80);
      expect(state.companionMP).toBe(40);
    });

    it('should damage companion independently from player', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(initCompanionBattle({ hp: 80, mp: 40 }));
      store.dispatch(damageCompanion(30));

      expect(store.getState().battle.companionHP).toBe(50);
      expect(store.getState().battle.playerHP).toBe(100); // Unchanged
    });
  });

  describe('Multi-target battles', () => {
    it('should initialize enemy party', () => {
      store.dispatch(startBattle({ bossId: 'multi', bossHP: 0 }));
      store.dispatch(initMultiTargetBattle({
        enemyParty: [
          { enemyId: 'sand_scorpion', hp: 40, maxHp: 40 },
          { enemyId: 'dust_wraith', hp: 60, maxHp: 60 },
        ],
      }));

      const state = store.getState().battle;
      expect(state.enemies).toHaveLength(2);
      expect(state.bossHP).toBe(100); // Sum
    });

    it('should mark enemy as defeated when HP reaches 0', () => {
      store.dispatch(startBattle({ bossId: 'multi', bossHP: 0 }));
      store.dispatch(initMultiTargetBattle({
        enemyParty: [{ enemyId: 'e1', hp: 10, maxHp: 10 }],
      }));

      store.dispatch(dealDamageToEnemy({ enemyIndex: 0, damage: 15 }));

      expect(store.getState().battle.enemies[0].defeated).toBe(true);
      expect(store.getState().battle.enemies[0].hp).toBe(0);
    });

    it('should update combo meter', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(updateComboMeter({ amount: 25 }));
      store.dispatch(updateComboMeter({ amount: 25 }));

      expect(store.getState().battle.comboMeter).toBe(50);

      store.dispatch(resetComboMeter());
      expect(store.getState().battle.comboMeter).toBe(0);
    });
  });

  describe('Hints', () => {
    it('should track hints used', () => {
      store.dispatch(startBattle({ bossId: 'boss1', bossHP: 100 }));
      store.dispatch(useHint());
      store.dispatch(useHint());

      expect(store.getState().battle.hintsUsed).toBe(2);
    });
  });
});
