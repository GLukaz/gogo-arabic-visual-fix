import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// All slice reducers
import playerReducer from '../slices/playerSlice.js';
import vocabularyReducer from '../slices/vocabularySlice.js';
import questReducer from '../slices/questSlice.js';
import npcReducer from '../slices/npcSlice.js';
import alphabetReducer from '../slices/alphabetSlice.js';
import settingsReducer from '../slices/settingsSlice.js';
import uiReducer from '../slices/uiSlice.js';
import syncReducer from '../slices/syncSlice.js';
import achievementReducer from '../slices/achievementSlice.js';
import dailyGoalsReducer from '../slices/dailyGoalsSlice.js';
import battleReducer from '../slices/battleSlice.js';
import grammarReducer from '../slices/grammarSlice.js';
import narrativeReducer from '../slices/narrativeSlice.js';
import magicReducer from '../slices/magicSlice.js';
import inventoryReducer from '../slices/inventorySlice.js';
import economyReducer from '../slices/economySlice.js';
import companionReducer from '../slices/companionSlice.js';
import arenaReducer from '../slices/arenaSlice.js';
import codexReducer from '../slices/codexSlice.js';
import craftingReducer from '../slices/craftingSlice.js';
import endgameReducer from '../slices/endgameSlice.js';
import factionReducer from '../slices/factionSlice.js';
import homeReducer from '../slices/homeSlice.js';
import journalReducer from '../slices/journalSlice.js';
import skillTreeReducer from '../slices/skillTreeSlice.js';
import statsReducer from '../slices/statsSlice.js';
import timeReducer from '../slices/timeSlice.js';
import weatherReducer from '../slices/weatherSlice.js';
import worldStateReducer from '../slices/worldStateSlice.js';
import cefrProgressReducer from '../slices/cefrProgressSlice.js';

// Battle actions
import {
  startBattle,
  dealDamage,
  dealDamageToPlayer,
  healEnemy,
  healPlayer,
  setPlayerDefending,
  setCurrentTurn,
  spendMP,
  applyStatusEffect,
  tickStatusEffects,
  recordWordUsed,
  endBattle,
  resetBattle,
  initCompanionBattle,
  spendCompanionMP,
  applyBuff,
  clearExpiredBuffs,
  initMultiTargetBattle,
  dealDamageToEnemy,
  updateComboMeter,
  resetComboMeter,
  recordArabicUsed,
} from '../slices/battleSlice.js';

// Selectors
import {
  selectAllEnemiesDefeated,
} from '../slices/battleSlice.js';

// Middleware
import { battleRewardsMiddleware } from '../middleware/battleRewardsMiddleware.js';

const rootReducer = combineReducers({
  player: playerReducer,
  vocabulary: vocabularyReducer,
  quests: questReducer,
  npc: npcReducer,
  alphabet: alphabetReducer,
  settings: settingsReducer,
  ui: uiReducer,
  sync: syncReducer,
  achievements: achievementReducer,
  dailyGoals: dailyGoalsReducer,
  battle: battleReducer,
  grammar: grammarReducer,
  narrative: narrativeReducer,
  magic: magicReducer,
  inventory: inventoryReducer,
  economy: economyReducer,
  companions: companionReducer,
  arena: arenaReducer,
  codex: codexReducer,
  crafting: craftingReducer,
  endgame: endgameReducer,
  faction: factionReducer,
  home: homeReducer,
  journal: journalReducer,
  skillTree: skillTreeReducer,
  stats: statsReducer,
  time: timeReducer,
  weather: weatherReducer,
  worldState: worldStateReducer,
  cefrProgress: cefrProgressReducer,
});

function createBattleStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

function createBattleStoreWithMiddleware(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().concat(battleRewardsMiddleware),
    preloadedState,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Battle System Integration Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Battle System — Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = createBattleStore();
  });

  // ─── Group 1: Battle Initialization ──────────────────────────────────────

  describe('Battle Initialization', () => {
    it('T1: startBattle initializes all combat state', () => {
      store.dispatch(startBattle({
        bossId: 'boss_sphinx',
        bossHP: 100,
        encounterType: 'boss',
        zone: 'desert',
      }));

      const battle = store.getState().battle;
      expect(battle.activeBattle).toBe('boss_sphinx');
      expect(battle.bossHP).toBe(100);
      expect(battle.maxBossHP).toBe(100);
      expect(battle.playerHP).toBe(100);
      expect(battle.playerMaxHP).toBe(100);
      expect(battle.playerMP).toBe(50);
      expect(battle.currentRound).toBe(0);
      expect(battle.turnCount).toBe(0);
      expect(battle.streak).toBe(0);
      expect(battle.encounterType).toBe('boss');
      expect(battle.battleZone).toBe('desert');
      expect(battle.battleStartTimestamp).toBeGreaterThan(0);
    });

    it('T2: initMultiTargetBattle creates enemy array with rows', () => {
      store.dispatch(startBattle({ bossId: 'multi', bossHP: 80 }));
      store.dispatch(initMultiTargetBattle({
        enemyParty: [
          { enemyId: 'warrior_1', hp: 50, maxHp: 50, row: 'front' },
          { enemyId: 'archer_1', hp: 30, maxHp: 30, row: 'back' },
        ],
      }));

      const battle = store.getState().battle;
      expect(battle.enemies).toHaveLength(2);
      expect(battle.enemies[0].enemyId).toBe('warrior_1');
      expect(battle.enemies[0].hp).toBe(50);
      expect(battle.enemies[0].row).toBe('front');
      expect(battle.enemies[0].defeated).toBe(false);
      expect(battle.enemies[1].enemyId).toBe('archer_1');
      expect(battle.enemies[1].row).toBe('back');
      expect(battle.enemies[1].defeated).toBe(false);
      // bossHP synced to sum
      expect(battle.bossHP).toBe(80);
    });

    it('T3: initCompanionBattle adds companion to battle', () => {
      store.dispatch(startBattle({ bossId: 'boss_1', bossHP: 100 }));
      store.dispatch(initCompanionBattle({ hp: 80, mp: 40 }));

      const battle = store.getState().battle;
      expect(battle.companionHP).toBe(80);
      expect(battle.companionMaxHP).toBe(80);
      expect(battle.companionMP).toBe(40);
      expect(battle.companionMaxMP).toBe(40);
      expect(battle.companionDefending).toBe(false);
    });
  });

  // ─── Group 2: Player Turn Flow ───────────────────────────────────────────

  describe('Player Turn Flow', () => {
    beforeEach(() => {
      store.dispatch(startBattle({ bossId: 'boss_sphinx', bossHP: 100 }));
    });

    it('T4: correct answer deals damage, updates streak and arabic tracking', () => {
      store.dispatch(setCurrentTurn('player'));
      store.dispatch(recordArabicUsed({ word: 'كتاب', accuracy: 1.0 }));
      store.dispatch(recordWordUsed('kitaab'));
      store.dispatch(dealDamage({ damage: 15, correct: true }));
      store.dispatch(updateComboMeter({ amount: 10 }));

      const battle = store.getState().battle;
      expect(battle.bossHP).toBe(85);
      expect(battle.streak).toBe(1);
      expect(battle.maxStreak).toBe(1);
      expect(battle.comboMeter).toBe(10);
      expect(battle.arabicUsedThisBattle).toHaveLength(1);
      expect(battle.arabicUsedThisBattle[0].word).toBe('كتاب');
      expect(battle.wordsUsed).toContain('kitaab');
      expect(battle.currentRound).toBe(1);
    });

    it('T5: incorrect answer damages player and resets combo', () => {
      // Build up some combo first
      store.dispatch(updateComboMeter({ amount: 30 }));
      expect(store.getState().battle.comboMeter).toBe(30);

      store.dispatch(recordArabicUsed({ word: 'بيت', accuracy: 0.2 }));
      store.dispatch(dealDamage({ damage: 8, correct: false }));
      store.dispatch(resetComboMeter());

      const battle = store.getState().battle;
      expect(battle.playerHP).toBe(92);
      expect(battle.streak).toBe(0);
      expect(battle.comboMeter).toBe(0);
    });

    it('T6: magic cast spends MP and deals damage', () => {
      store.dispatch(spendMP(15));
      store.dispatch(dealDamage({ damage: 25, correct: true }));

      const battle = store.getState().battle;
      expect(battle.playerMP).toBe(35);
      expect(battle.bossHP).toBe(75);
    });

    it('T7: defend flag reduces enemy damage via dealDamageToPlayer', () => {
      store.dispatch(setPlayerDefending(true));
      expect(store.getState().battle.isPlayerDefending).toBe(true);

      // dealDamageToPlayer applies 50% reduction when defending
      store.dispatch(dealDamageToPlayer({ damage: 20 }));
      const battle = store.getState().battle;
      expect(battle.playerHP).toBe(90); // 100 - floor(20 * 0.5) = 90
    });
  });

  // ─── Group 3: Companion Turn ─────────────────────────────────────────────

  describe('Companion Turn', () => {
    beforeEach(() => {
      store.dispatch(startBattle({ bossId: 'boss_1', bossHP: 100 }));
      store.dispatch(initCompanionBattle({ hp: 80, mp: 40 }));
    });

    it('T8: companion attack deals damage to boss', () => {
      store.dispatch(setCurrentTurn('companion'));
      store.dispatch(dealDamage({ damage: 12, correct: true }));

      expect(store.getState().battle.bossHP).toBe(88);
    });

    it('T9: companion heal restores player HP and spends companion MP', () => {
      // Reduce player HP first
      store.dispatch(dealDamageToPlayer({ damage: 40 }));
      expect(store.getState().battle.playerHP).toBe(60);

      store.dispatch(healPlayer(25));
      store.dispatch(spendCompanionMP(10));

      const battle = store.getState().battle;
      expect(battle.playerHP).toBe(85);
      expect(battle.companionMP).toBe(30);
    });
  });

  // ─── Group 4: Enemy Turn ─────────────────────────────────────────────────

  describe('Enemy Turn', () => {
    beforeEach(() => {
      store.dispatch(startBattle({ bossId: 'boss_1', bossHP: 100 }));
    });

    it('T10: enemy attack reduces player HP', () => {
      store.dispatch(setCurrentTurn('enemy'));
      store.dispatch(dealDamageToPlayer({ damage: 18 }));

      const battle = store.getState().battle;
      expect(battle.playerHP).toBe(82);
      expect(battle.currentTurn).toBe('enemy');
    });

    it('T11: enemy heal restores enemy HP up to max', () => {
      // Deal damage first
      store.dispatch(dealDamage({ damage: 40, correct: true }));
      expect(store.getState().battle.bossHP).toBe(60);

      store.dispatch(healEnemy({ amount: 15 }));
      expect(store.getState().battle.bossHP).toBe(75);

      // Cannot exceed maxBossHP
      store.dispatch(healEnemy({ amount: 50 }));
      expect(store.getState().battle.bossHP).toBe(100);
    });
  });

  // ─── Group 5: Status Effects & Buffs ─────────────────────────────────────

  describe('Status Effects & Buffs', () => {
    beforeEach(() => {
      store.dispatch(startBattle({ bossId: 'boss_1', bossHP: 100 }));
    });

    it('T12: status effects tick down and expire', () => {
      store.dispatch(applyStatusEffect({
        target: 'enemy',
        effect: { id: 'burn', remainingTurns: 2 },
      }));

      let battle = store.getState().battle;
      expect(battle.enemyEffects).toHaveLength(1);
      expect(battle.enemyEffects[0].remainingTurns).toBe(2);

      store.dispatch(tickStatusEffects());
      battle = store.getState().battle;
      expect(battle.enemyEffects).toHaveLength(1);
      expect(battle.enemyEffects[0].remainingTurns).toBe(1);

      store.dispatch(tickStatusEffects());
      battle = store.getState().battle;
      expect(battle.enemyEffects).toHaveLength(0);
    });

    it('T13: consumable buffs apply and persist until cleared', () => {
      store.dispatch(applyBuff({
        buffId: 'strength_tea',
        stat: 'damageBoost',
        value: 5,
        duration: 60000, // 60 seconds
        source: 'crafting',
      }));

      let battle = store.getState().battle;
      expect(battle.activeBuffs).toHaveLength(1);
      expect(battle.activeBuffs[0].buffId).toBe('strength_tea');
      expect(battle.activeBuffs[0].stat).toBe('damageBoost');
      expect(battle.activeBuffs[0].value).toBe(5);

      // clearExpiredBuffs does nothing when buffs are still valid
      store.dispatch(clearExpiredBuffs());
      battle = store.getState().battle;
      expect(battle.activeBuffs).toHaveLength(1);
    });
  });

  // ─── Group 6: Victory & Rewards ──────────────────────────────────────────

  describe('Victory & Rewards', () => {
    it('T14: victory dispatches endBattle and rewards flow through middleware', () => {
      const rewardStore = createBattleStoreWithMiddleware();
      rewardStore.dispatch(startBattle({
        bossId: 'boss_sphinx',
        bossHP: 100,
        encounterType: 'boss',
      }));

      const initialXP = rewardStore.getState().player.xp;
      const initialDirhams = rewardStore.getState().player.dirhams;

      // Deal enough damage to reduce boss to 0
      rewardStore.dispatch(dealDamage({ damage: 100, correct: true }));
      expect(rewardStore.getState().battle.bossHP).toBe(0);

      // End battle with victory
      rewardStore.dispatch(endBattle({
        victory: true,
        accuracy: 0.85,
        timeElapsed: 45000,
        rewards: { xp: 200, gold: 50 },
        bossId: 'boss_sphinx',
      }));

      const state = rewardStore.getState();
      // XP awarded (addXP may also trigger level-up which adds bonus dirhams)
      expect(state.player.xp).toBe(initialXP + 200);
      // Gold awarded via middleware + possible level-up bonus dirhams
      expect(state.player.dirhams).toBeGreaterThanOrEqual(initialDirhams + 50);
      // Boss recorded as defeated
      expect(state.battle.bossesDefeated).toContain('boss_sphinx');
      // Battle history recorded
      expect(state.battle.battleHistory).toHaveLength(1);
      expect(state.battle.battleHistory[0].victory).toBe(true);
    });

    it('T15: defeat gives reduced rewards, boss NOT marked defeated', () => {
      const rewardStore = createBattleStoreWithMiddleware();
      rewardStore.dispatch(startBattle({
        bossId: 'boss_hard',
        bossHP: 200,
      }));

      const initialXP = rewardStore.getState().player.xp;
      const initialDirhams = rewardStore.getState().player.dirhams;

      rewardStore.dispatch(endBattle({
        victory: false,
        accuracy: 0.4,
        timeElapsed: 30000,
        rewards: { xp: 25, gold: 0 },
      }));

      const state = rewardStore.getState();
      // No rewards on defeat (victory=false means middleware skips)
      expect(state.player.xp).toBe(initialXP);
      expect(state.player.dirhams).toBe(initialDirhams);
      // Boss NOT defeated
      expect(state.battle.bossesDefeated).not.toContain('boss_hard');
      // History still recorded
      expect(state.battle.battleHistory).toHaveLength(1);
      expect(state.battle.battleHistory[0].victory).toBe(false);
    });

    it('T16: resetBattle clears transient state but preserves history', () => {
      store.dispatch(startBattle({ bossId: 'boss_1', bossHP: 100 }));
      store.dispatch(dealDamage({ damage: 100, correct: true }));
      store.dispatch(endBattle({
        victory: true,
        accuracy: 0.9,
        timeElapsed: 20000,
        rewards: { xp: 100 },
      }));

      // After endBattle, history and bossesDefeated are preserved
      expect(store.getState().battle.bossesDefeated).toContain('boss_1');
      expect(store.getState().battle.battleHistory).toHaveLength(1);

      // resetBattle clears transient fields
      store.dispatch(resetBattle());

      const battle = store.getState().battle;
      expect(battle.activeBattle).toBeNull();
      expect(battle.playerHP).toBe(100);
      expect(battle.streak).toBe(0);
      expect(battle.comboMeter).toBe(0);
      // Persistent data preserved
      expect(battle.bossesDefeated).toContain('boss_1');
      expect(battle.battleHistory).toHaveLength(1);
    });
  });

  // ─── Group 7: Multi-Target Battle ────────────────────────────────────────

  describe('Multi-Target Battle', () => {
    it('T17: defeat individual enemies, victory when all down', () => {
      store.dispatch(startBattle({ bossId: 'multi', bossHP: 60 }));
      store.dispatch(initMultiTargetBattle({
        enemyParty: [
          { enemyId: 'warrior_1', hp: 30, maxHp: 30, row: 'front' },
          { enemyId: 'warrior_2', hp: 30, maxHp: 30, row: 'front' },
        ],
      }));

      // Defeat first enemy
      store.dispatch(dealDamageToEnemy({ enemyIndex: 0, damage: 30 }));
      let battle = store.getState().battle;
      expect(battle.enemies[0].defeated).toBe(true);
      expect(battle.enemies[0].hp).toBe(0);
      expect(battle.enemies[1].defeated).toBe(false);
      expect(selectAllEnemiesDefeated(store.getState())).toBe(false);

      // Defeat second enemy
      store.dispatch(dealDamageToEnemy({ enemyIndex: 1, damage: 30 }));
      battle = store.getState().battle;
      expect(battle.enemies[1].defeated).toBe(true);
      expect(selectAllEnemiesDefeated(store.getState())).toBe(true);
      // bossHP synced to 0
      expect(battle.bossHP).toBe(0);
    });
  });
});
