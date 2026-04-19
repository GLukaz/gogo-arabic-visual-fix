import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CompanionBattleAI } from '../CompanionBattleAI.js';

// Mock store
vi.mock('../../../../store/store.js', () => ({
  store: {
    getState: vi.fn(() => ({
      companions: {
        companions: {
          companion_test: { relationship: 50 },
        },
      },
    })),
  },
}));

// Mock companions data
vi.mock('../../../../data/companions.js', () => ({
  COMPANIONS: {
    companion_test: {
      battleRole: 'healer',
      baseStats: {
        hp: 60,
        mp: 40,
        damage: 10,
        defense: 5,
      },
    },
    companion_attacker: {
      battleRole: 'attacker',
      baseStats: {
        hp: 100,
        mp: 40,
        damage: 18,
        defense: 10,
      },
    },
    companion_defender: {
      battleRole: 'defender',
      baseStats: {
        hp: 110,
        mp: 35,
        damage: 12,
        defense: 16,
      },
    },
    companion_support: {
      battleRole: 'support',
      baseStats: {
        hp: 80,
        mp: 60,
        damage: 12,
        defense: 8,
      },
    },
  },
}));

// Mock companionRelationship utils
vi.mock('../../../../utils/companionRelationship.js', () => ({
  getRelationshipMultiplier: vi.fn((relationship) => {
    if (relationship >= 80) return 1.2;
    if (relationship >= 60) return 1.15;
    if (relationship >= 40) return 1.1;
    if (relationship >= 20) return 1.05;
    return 1.0;
  }),
}));

import { store } from '../../../../store/store.js';

describe('CompanionBattleAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Healer behavior tree', () => {
    let ai;

    beforeEach(() => {
      ai = new CompanionBattleAI('companion_test');
    });

    it('heals player when player HP < 40% and MP >= 15', () => {
      const battleState = {
        playerHP: 30,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('heal');
      expect(action.target).toBe('player');
      expect(action.mpCost).toBe(15);
      expect(action.healAmount).toBeGreaterThan(0);
    });

    it('heals self when companion HP < 40% and MP >= 15', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 20,
        companionMaxHP: 60,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('heal');
      expect(action.target).toBe('companion');
      expect(action.mpCost).toBe(15);
    });

    it('heals player when player HP < 70% and MP >= 10', () => {
      const battleState = {
        playerHP: 60,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 12,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('heal');
      expect(action.target).toBe('player');
      expect(action.mpCost).toBe(10);
    });

    it('attacks when all HP above threshold', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('attack');
      expect(action.target).toBe('enemy');
    });

    it('attacks when MP too low to heal', () => {
      const battleState = {
        playerHP: 30,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 5,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('attack');
      expect(action.target).toBe('enemy');
    });
  });

  describe('Attacker behavior tree', () => {
    let ai;

    beforeEach(() => {
      ai = new CompanionBattleAI('companion_attacker');
    });

    it('uses skill when enemy HP > 50% and MP >= 20', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 100,
        companionMaxHP: 100,
        companionMP: 25,
        enemyHP: 60,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('skill');
      expect(action.target).toBe('enemy');
      expect(action.mpCost).toBe(20);
    });

    it('power attacks when enemy HP < 25% (finish off)', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 100,
        companionMaxHP: 100,
        companionMP: 10,
        enemyHP: 20,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('attack');
      expect(action.target).toBe('enemy');
      // Should have bonus damage (1.5x multiplier)
      expect(action.damage).toBeGreaterThan(18); // base damage 18
    });

    it('basic attacks as fallback', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 100,
        companionMaxHP: 100,
        companionMP: 5,
        enemyHP: 40,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('attack');
      expect(action.target).toBe('enemy');
    });

    it('skill has higher damage than basic attack', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 100,
        companionMaxHP: 100,
        companionMP: 25,
        enemyHP: 60,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const skillAction = ai.selectAction(battleState);

      battleState.companionMP = 5; // Force basic attack
      const basicAction = ai.selectAction(battleState);

      expect(skillAction.damage).toBeGreaterThan(basicAction.damage);
    });
  });

  describe('Defender behavior tree', () => {
    let ai;

    beforeEach(() => {
      ai = new CompanionBattleAI('companion_defender');
    });

    it('defends player when player HP < 50%', () => {
      const battleState = {
        playerHP: 40,
        playerMaxHP: 100,
        companionHP: 110,
        companionMaxHP: 110,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('defend');
      expect(action.target).toBe('player');
    });

    it('dispels enemy buff when MP >= 10', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 110,
        companionMaxHP: 110,
        companionMP: 15,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [{ id: 'strength' }],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('dispel');
      expect(action.target).toBe('enemy');
      expect(action.mpCost).toBe(10);
    });

    it('attacks as fallback', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 110,
        companionMaxHP: 110,
        companionMP: 5,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('attack');
      expect(action.target).toBe('enemy');
    });

    it('does not defend when player HP >= 50%', () => {
      const battleState = {
        playerHP: 60,
        playerMaxHP: 100,
        companionHP: 110,
        companionMaxHP: 110,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).not.toBe('defend');
    });
  });

  describe('Support behavior tree', () => {
    let ai;

    beforeEach(() => {
      ai = new CompanionBattleAI('companion_support');
    });

    it('buffs strength when no existing strength buff', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 80,
        companionMaxHP: 80,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('buff');
      expect(action.target).toBe('player');
      expect(action.effectId).toBe('strength');
      expect(action.mpCost).toBe(12);
    });

    it('buffs defense when no existing defense_up buff', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 80,
        companionMaxHP: 80,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [{ id: 'strength' }],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('buff');
      expect(action.target).toBe('player');
      expect(action.effectId).toBe('defense_up');
      expect(action.mpCost).toBe(10);
    });

    it('buffs accuracy as third priority', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 80,
        companionMaxHP: 80,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [{ id: 'strength' }, { id: 'defense_up' }],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('buff');
      expect(action.target).toBe('player');
      expect(action.effectId).toBe('accuracy_up');
      expect(action.mpCost).toBe(8);
    });

    it('attacks when MP depleted', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 80,
        companionMaxHP: 80,
        companionMP: 5,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action.action).toBe('attack');
      expect(action.target).toBe('enemy');
    });

    it('does not apply duplicate buff', () => {
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 80,
        companionMaxHP: 80,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [{ id: 'strength' }],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      // Should not apply strength again
      expect(action.effectId).not.toBe('strength');
    });
  });

  describe('General behavior', () => {
    it('relationship at 0 (stranger) gives multiplier 1.0', () => {
      store.getState.mockReturnValue({
        companions: {
          companions: {
            companion_test: { relationship: 0 },
          },
        },
      });

      const ai = new CompanionBattleAI('companion_test');
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 5,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      // Base damage 10 * 1.0 * 0.7 = 7
      expect(action.damage).toBe(7);
    });

    it('relationship at 50 (friend) gives multiplier 1.1', () => {
      store.getState.mockReturnValue({
        companions: {
          companions: {
            companion_test: { relationship: 50 },
          },
        },
      });

      const ai = new CompanionBattleAI('companion_test');
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 5,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      // Base damage 10 * 1.1 * 0.7 = 7.7 -> floor = 7
      expect(action.damage).toBe(7);
    });

    it('relationship at 90 (best friend) gives multiplier 1.2', () => {
      store.getState.mockReturnValue({
        companions: {
          companions: {
            companion_test: { relationship: 90 },
          },
        },
      });

      const ai = new CompanionBattleAI('companion_test');
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 5,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      // Base damage 10 * 1.2 * 0.7 = 8.4 -> floor = 8
      expect(action.damage).toBe(8);
    });

    it('damage values are integers (Math.floor applied)', () => {
      const ai = new CompanionBattleAI('companion_attacker');
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 100,
        companionMaxHP: 100,
        companionMP: 5,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(Number.isInteger(action.damage)).toBe(true);
    });

    it('heal amounts are integers', () => {
      const ai = new CompanionBattleAI('companion_test');
      const battleState = {
        playerHP: 30,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(Number.isInteger(action.healAmount)).toBe(true);
    });

    it('selectAction returns object with action and target fields', () => {
      const ai = new CompanionBattleAI('companion_test');
      const battleState = {
        playerHP: 100,
        playerMaxHP: 100,
        companionHP: 60,
        companionMaxHP: 60,
        companionMP: 20,
        enemyHP: 80,
        enemyMaxHP: 100,
        playerEffects: [],
        companionEffects: [],
        enemyEffects: [],
      };

      const action = ai.selectAction(battleState);

      expect(action).toHaveProperty('action');
      expect(action).toHaveProperty('target');
    });
  });
});
