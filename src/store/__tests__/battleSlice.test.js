import { describe, it, expect, beforeEach, vi } from 'vitest';
import battleReducer, {
  startBattle,
  dealDamage,
  useHint,
  endBattle,
  resetBattle,
  selectActiveBattle,
  selectBattleStats,
  selectBossesDefeated,
  selectBattleHistory,
  selectIsBossDefeated,
  selectBattleWinRate,
} from '../slices/battleSlice.js';

describe('battleSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = battleReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        activeBattle: null,
        playerHP: 100,
        bossHP: 0,
        maxBossHP: 0,
        currentRound: 0,
        streak: 0,
        bossesDefeated: [],
        battleHistory: [],
        hintsUsed: 0,
        // v6.0 Phase 27 fields
        playerMaxHP: 100,
        playerMP: 50,
        playerMaxMP: 50,
        turnCount: 0,
        currentTurn: null,
        isPlayerDefending: false,
        playerEffects: [],
        enemyEffects: [],
        grammarCombo: 0,
        maxStreak: 0,
        wordsUsed: [],
        encounterType: null,
        battleZone: null,
        battleStartTimestamp: null,
        enemyData: null,
        // v6.0 Phase 30 companion fields
        companionHP: null,
        companionMaxHP: null,
        companionMP: null,
        companionMaxMP: null,
        companionEffects: [],
        companionDefending: false,
        // v6.1 Phase 31 crafting buffs
        activeBuffs: [],
        // v6.1 Phase 32 multi-target & combo
        enemies: [],
        comboMeter: 0,
        maxComboMeter: 100,
        grammarComboState: null,
        targetIndex: 0,
        playerRow: 'front',
        arabicUsedThisBattle: [],
      });
    });
  });

  describe('startBattle', () => {
    it('should initialize battle state', () => {
      const state = battleReducer(
        initialState,
        startBattle({ bossId: 'boss_sphinx', bossHP: 200 })
      );

      expect(state.activeBattle).toBe('boss_sphinx');
      expect(state.playerHP).toBe(100);
      expect(state.bossHP).toBe(200);
      expect(state.maxBossHP).toBe(200);
      expect(state.currentRound).toBe(0);
      expect(state.streak).toBe(0);
      expect(state.hintsUsed).toBe(0);
    });

    it('should reset battle state when starting new battle', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_old',
        playerHP: 50,
        bossHP: 30,
        currentRound: 5,
        streak: 3,
        hintsUsed: 2,
      };

      const state = battleReducer(
        startState,
        startBattle({ bossId: 'boss_new', bossHP: 150 })
      );

      expect(state.activeBattle).toBe('boss_new');
      expect(state.playerHP).toBe(100);
      expect(state.bossHP).toBe(150);
      expect(state.currentRound).toBe(0);
      expect(state.streak).toBe(0);
      expect(state.hintsUsed).toBe(0);
    });
  });

  describe('dealDamage', () => {
    it('should damage boss on correct answer', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        bossHP: 100,
        maxBossHP: 100,
        streak: 0,
      };

      const state = battleReducer(
        startState,
        dealDamage({ damage: 20, correct: true })
      );

      expect(state.bossHP).toBe(80);
      expect(state.playerHP).toBe(100);
      expect(state.streak).toBe(1);
      expect(state.currentRound).toBe(1);
    });

    it('should damage player on incorrect answer', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        playerHP: 100,
        streak: 2,
      };

      const state = battleReducer(
        startState,
        dealDamage({ damage: 15, correct: false })
      );

      expect(state.playerHP).toBe(85);
      expect(state.bossHP).toBe(0);
      expect(state.streak).toBe(0);
      expect(state.currentRound).toBe(1);
    });

    it('should not reduce HP below 0', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        bossHP: 10,
      };

      const state = battleReducer(
        startState,
        dealDamage({ damage: 50, correct: true })
      );

      expect(state.bossHP).toBe(0);
    });

    it('should build streak on consecutive correct answers', () => {
      let state = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        bossHP: 100,
        maxBossHP: 100,
      };

      state = battleReducer(state, dealDamage({ damage: 10, correct: true }));
      expect(state.streak).toBe(1);

      state = battleReducer(state, dealDamage({ damage: 10, correct: true }));
      expect(state.streak).toBe(2);

      state = battleReducer(state, dealDamage({ damage: 10, correct: true }));
      expect(state.streak).toBe(3);
    });

    it('should reset streak on incorrect answer', () => {
      let state = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        bossHP: 100,
        streak: 5,
      };

      state = battleReducer(state, dealDamage({ damage: 10, correct: false }));
      expect(state.streak).toBe(0);
    });
  });

  describe('useHint', () => {
    it('should increment hints used counter', () => {
      const state = battleReducer(initialState, useHint());

      expect(state.hintsUsed).toBe(1);
    });

    it('should accumulate hints used', () => {
      let state = battleReducer(initialState, useHint());
      state = battleReducer(state, useHint());
      state = battleReducer(state, useHint());

      expect(state.hintsUsed).toBe(3);
    });
  });

  describe('endBattle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-02-09T00:00:00Z'));
    });

    it('should add boss to defeated list on victory', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        bossesDefeated: [],
      };

      const payload = {
        victory: true,
        accuracy: 0.85,
        timeElapsed: 120,
        rewards: { xp: 100, dirhams: 50 },
      };

      const state = battleReducer(startState, endBattle(payload));

      expect(state.bossesDefeated).toContain('boss_sphinx');
      expect(state.activeBattle).toBeNull();
    });

    it('should not add boss to defeated list on loss', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        bossesDefeated: [],
      };

      const payload = {
        victory: false,
        accuracy: 0.45,
        timeElapsed: 90,
        rewards: {},
      };

      const state = battleReducer(startState, endBattle(payload));

      expect(state.bossesDefeated).not.toContain('boss_sphinx');
      expect(state.activeBattle).toBeNull();
    });

    it('should not duplicate boss in defeated list', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        bossesDefeated: ['boss_sphinx'],
      };

      const payload = {
        victory: true,
        accuracy: 0.9,
        timeElapsed: 100,
        rewards: { xp: 100 },
      };

      const state = battleReducer(startState, endBattle(payload));

      expect(state.bossesDefeated).toEqual(['boss_sphinx']);
      expect(state.bossesDefeated).toHaveLength(1);
    });

    it('should add battle to history', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
      };

      const payload = {
        victory: true,
        accuracy: 0.85,
        timeElapsed: 120,
        rewards: { xp: 100 },
      };

      const state = battleReducer(startState, endBattle(payload));

      expect(state.battleHistory).toHaveLength(1);
      expect(state.battleHistory[0]).toMatchObject({
        bossId: 'boss_sphinx',
        victory: true,
        accuracy: 0.85,
        timeElapsed: 120,
        rewards: { xp: 100 },
      });
      expect(state.battleHistory[0].timestamp).toBeDefined();
    });

    it('should keep only last 20 battles in history', () => {
      // Create state with 20 battles
      const startState = {
        ...initialState,
        activeBattle: 'boss_21',
        battleHistory: Array.from({ length: 20 }, (_, i) => ({
          bossId: `boss_${i}`,
          victory: true,
          accuracy: 0.8,
          timeElapsed: 100,
          rewards: {},
          timestamp: Date.now(),
        })),
      };

      const payload = {
        victory: true,
        accuracy: 0.9,
        timeElapsed: 110,
        rewards: {},
      };

      const state = battleReducer(startState, endBattle(payload));

      expect(state.battleHistory).toHaveLength(20);
      expect(state.battleHistory[0].bossId).toBe('boss_21');
      expect(state.battleHistory[19].bossId).toBe('boss_18');
    });

    it('should reset battle stats after ending', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        playerHP: 50,
        bossHP: 20,
        maxBossHP: 200,
        currentRound: 10,
        streak: 5,
        hintsUsed: 3,
      };

      const payload = {
        victory: true,
        accuracy: 0.8,
        timeElapsed: 150,
        rewards: {},
      };

      const state = battleReducer(startState, endBattle(payload));

      expect(state.activeBattle).toBeNull();
      expect(state.playerHP).toBe(100);
      expect(state.bossHP).toBe(0);
      expect(state.maxBossHP).toBe(0);
      expect(state.currentRound).toBe(0);
      expect(state.streak).toBe(0);
      expect(state.hintsUsed).toBe(0);
    });
  });

  describe('resetBattle', () => {
    it('should reset battle to initial state', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        playerHP: 60,
        bossHP: 80,
        maxBossHP: 200,
        currentRound: 8,
        streak: 4,
        hintsUsed: 2,
      };

      const state = battleReducer(startState, resetBattle());

      expect(state.activeBattle).toBeNull();
      expect(state.playerHP).toBe(100);
      expect(state.bossHP).toBe(0);
      expect(state.maxBossHP).toBe(0);
      expect(state.currentRound).toBe(0);
      expect(state.streak).toBe(0);
      expect(state.hintsUsed).toBe(0);
    });

    it('should not affect defeated bosses or history', () => {
      const startState = {
        ...initialState,
        activeBattle: 'boss_sphinx',
        bossesDefeated: ['boss_1', 'boss_2'],
        battleHistory: [{ bossId: 'boss_1', victory: true }],
      };

      const state = battleReducer(startState, resetBattle());

      expect(state.bossesDefeated).toEqual(['boss_1', 'boss_2']);
      expect(state.battleHistory).toHaveLength(1);
    });
  });

  describe('selectors', () => {
    const mockState = {
      battle: {
        activeBattle: 'boss_sphinx',
        playerHP: 75,
        bossHP: 120,
        maxBossHP: 200,
        currentRound: 5,
        streak: 3,
        hintsUsed: 1,
        bossesDefeated: ['boss_1', 'boss_2', 'boss_3'],
        battleHistory: [
          { bossId: 'boss_1', victory: true, accuracy: 0.9 },
          { bossId: 'boss_2', victory: false, accuracy: 0.6 },
          { bossId: 'boss_3', victory: true, accuracy: 0.85 },
          { bossId: 'boss_4', victory: true, accuracy: 0.95 },
          { bossId: 'boss_5', victory: false, accuracy: 0.5 },
        ],
      },
    };

    it('selectActiveBattle should return active battle ID', () => {
      const activeBattle = selectActiveBattle(mockState);
      expect(activeBattle).toBe('boss_sphinx');
    });

    it('selectBattleStats should return battle statistics', () => {
      const stats = selectBattleStats(mockState);
      expect(stats).toMatchObject({
        playerHP: 75,
        bossHP: 120,
        maxBossHP: 200,
        currentRound: 5,
        streak: 3,
        hintsUsed: 1,
      });
    });

    it('selectBossesDefeated should return defeated bosses array', () => {
      const defeated = selectBossesDefeated(mockState);
      expect(defeated).toEqual(['boss_1', 'boss_2', 'boss_3']);
    });

    it('selectBattleHistory should return battle history', () => {
      const history = selectBattleHistory(mockState);
      expect(history).toHaveLength(5);
      expect(history[0].bossId).toBe('boss_1');
    });

    it('selectIsBossDefeated should return true for defeated boss', () => {
      const isDefeated = selectIsBossDefeated('boss_2')(mockState);
      expect(isDefeated).toBe(true);
    });

    it('selectIsBossDefeated should return false for undefeated boss', () => {
      const isDefeated = selectIsBossDefeated('boss_undefeated')(mockState);
      expect(isDefeated).toBe(false);
    });

    it('selectBattleWinRate should calculate win percentage', () => {
      // 3 wins out of 5 battles = 60%
      const winRate = selectBattleWinRate(mockState);
      expect(winRate).toBe(60);
    });

    it('selectBattleWinRate should return 0 for empty history', () => {
      const emptyState = {
        battle: { ...mockState.battle, battleHistory: [] },
      };
      const winRate = selectBattleWinRate(emptyState);
      expect(winRate).toBe(0);
    });
  });
});
