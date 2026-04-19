/**
 * BattleStateMachine.test.js — Unit tests for BattleStateMachine FSM (Phase 55)
 *
 * Verifies initial state, BATTLE_STATES export, start() transition, and
 * grammarComboDetector initialization. All heavy dependencies are mocked.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock the entire store module before importing BSM ──────────────────────
// BSM does: import { store } from '../../../store/store.js'
// Return a minimal store stub with only the state shape BSM reads in constructor.
vi.mock('../../../store/store.js', () => {
  const dispatch = vi.fn();
  const getState = vi.fn(() => ({
    grammar: { completedLessons: [] },
    vocabulary: { fsrsCards: {} },
    companions: { activeParty: null },
  }));
  return {
    store: { dispatch, getState, subscribe: vi.fn() },
    persistor: null,
  };
});

// ── Mock heavy Phaser/scene-dependent managers ─────────────────────────────
vi.mock('../magic/RootMagicManager.js', () => ({
  RootMagicManager: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('../companions/CompanionBattleAI.js', () => ({
  CompanionBattleAI: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('./EnemyAI.js', () => ({
  EnemyAI: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('./CompoundEffectResolver.js', () => ({
  CompoundEffectResolver: vi.fn().mockImplementation(() => ({})),
}));

vi.mock('./MultiTargetManager.js', () => ({
  MultiTargetManager: vi.fn().mockImplementation(() => ({
    initEnemies: vi.fn(),
  })),
}));

vi.mock('./BattleDamageCalculator.js', () => ({
  calculateDamage: vi.fn(() => 10),
}));

// ── Mock enemy data ────────────────────────────────────────────────────────
vi.mock('../../../data/enemies.js', () => ({
  getEnemy: vi.fn(() => ({ baseHP: 100, name: 'Test Enemy' })),
}));

// ── Mock rootsData (used by BattleStateMachine indirectly) ─────────────────
vi.mock('../../../data/rootsData.js', () => ({
  getRootWords: vi.fn(() => []),
}));

// ── Import under test (after mocks) ────────────────────────────────────────
import { BattleStateMachine, BATTLE_STATES } from '../BattleStateMachine.js';
import { GrammarComboDetector } from '../GrammarComboDetector.js';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Minimal Phaser scene stub required by BSM constructor and start() */
function makeMockScene() {
  return {
    time: {
      // Do NOT invoke the callback — prevents auto-advancing past INTRO state
      delayedCall: vi.fn(),
      addEvent: vi.fn(),
    },
    tweens: {
      add: vi.fn(),
    },
    scene: {
      stop: vi.fn(),
    },
    cameras: {
      main: {
        fadeIn: vi.fn(),
        flash: vi.fn(),
        shake: vi.fn(),
      },
    },
    sound: {
      play: vi.fn(),
      add: vi.fn(() => ({ play: vi.fn(), stop: vi.fn() })),
    },
    add: {
      text: vi.fn(() => ({
        setOrigin: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      })),
      image: vi.fn(() => ({
        setOrigin: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      })),
    },
    exitBattle: vi.fn(),
    equipmentStats: {
      getTotalBonuses: () => ({ hp: 0, mp: 0 }),
    },
  };
}

/** Minimal battle config for a single-enemy battle */
const singleEnemyConfig = {
  enemyParty: ['test_enemy'],
  encounterType: 'random',
  zone: 'desert',
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('BattleStateMachine', () => {
  let scene;
  let bsm;

  beforeEach(() => {
    scene = makeMockScene();
    bsm = new BattleStateMachine(scene, singleEnemyConfig);
  });

  // ── BATTLE_STATES export ────────────────────────────────────────────────

  describe('BATTLE_STATES export', () => {
    it('exports BATTLE_STATES as a frozen object', () => {
      expect(typeof BATTLE_STATES).toBe('object');
      expect(BATTLE_STATES).not.toBeNull();
      expect(Object.isFrozen(BATTLE_STATES)).toBe(true);
    });

    it('BATTLE_STATES contains all required core state keys', () => {
      const requiredStates = [
        'IDLE',
        'INTRO',
        'TURN_START',
        'PLAYER_TURN',
        'ENEMY_TURN',
        'VICTORY',
        'DEFEAT',
      ];
      for (const state of requiredStates) {
        expect(BATTLE_STATES).toHaveProperty(state);
        expect(BATTLE_STATES[state]).toBe(state);
      }
    });

    it('BATTLE_STATES contains Phase 32 extended state keys', () => {
      const phase32States = [
        'GRAMMAR_COMBO',
        'TARGET_SELECT',
        'ITEM_USE',
        'FLEE_CHALLENGE',
        'COMPOUND_CHECK',
        'ARENA_WAVE_TRANSITION',
      ];
      for (const state of phase32States) {
        expect(BATTLE_STATES).toHaveProperty(state);
        expect(BATTLE_STATES[state]).toBe(state);
      }
    });
  });

  // ── Constructor / initial state ────────────────────────────────────────

  describe('constructor', () => {
    it('starts in IDLE state', () => {
      expect(bsm.state).toBe('IDLE');
    });

    it('initialises grammarComboDetector as a GrammarComboDetector instance', () => {
      expect(bsm.grammarComboDetector).toBeInstanceOf(GrammarComboDetector);
    });

    it('stores the scene reference', () => {
      expect(bsm.scene).toBe(scene);
    });

    it('stores the battleConfig reference', () => {
      expect(bsm.config).toBe(singleEnemyConfig);
    });

    it('initialises isPlayerTurn to true', () => {
      expect(bsm.isPlayerTurn).toBe(true);
    });

    it('initialises currentAction to null', () => {
      expect(bsm.currentAction).toBeNull();
    });

    it('initialises pendingInput to null', () => {
      expect(bsm.pendingInput).toBeNull();
    });
  });

  // ── start() transition ─────────────────────────────────────────────────

  describe('start()', () => {
    it('transitions state to INTRO after calling start()', () => {
      bsm.start();
      expect(bsm.state).toBe('INTRO');
    });
  });

  // ── Multi-target configuration ─────────────────────────────────────────

  describe('multi-target configuration', () => {
    it('sets isMultiTarget to false for single-enemy config', () => {
      expect(bsm.isMultiTarget).toBe(false);
    });

    it('sets isMultiTarget to true for multi-enemy config', () => {
      const multiConfig = {
        enemyParty: ['test_enemy', 'test_enemy_2'],
        encounterType: 'random',
        zone: 'desert',
      };
      const multiBsm = new BattleStateMachine(scene, multiConfig);
      expect(multiBsm.isMultiTarget).toBe(true);
    });
  });
});
