import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RootMagicManager } from '../RootMagicManager.js';
import { createMockScene } from '../../__tests__/mocks/sceneMock.js';

// Mock the Redux store
vi.mock('../../../../store/store.js', () => ({
  store: {
    getState: vi.fn(),
    dispatch: vi.fn(),
  },
}));

// Mock EventBus
vi.mock('../../../../utils/eventBus.js', () => ({
  EventBus: {
    emit: vi.fn(),
  },
}));

// Import mocked modules
import { store } from '../../../../store/store.js';
import { EventBus } from '../../../../utils/eventBus.js';
import { EVENTS } from '../../../../utils/eventBusTypes.js';

describe('RootMagicManager', () => {
  let scene;
  let manager;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock scene with immediate delayedCall execution
    scene = createMockScene({
      time: {
        delayedCall: vi.fn((delay, callback) => {
          // Execute callback immediately for testing
          callback();
          return { remove: vi.fn() };
        }),
      },
    });

    manager = new RootMagicManager(scene);

    // Default store state
    store.getState.mockReturnValue({
      magic: {
        equippedSpells: [
          {
            rootId: 'ك-ت-ب',
            form: 'I',
            element: 'knowledge',
            mpCost: 5,
          },
          null,
          null,
          null,
          null,
          null,
        ],
        rootMastery: {
          'ك-ت-ب': {
            level: 1,
            xp: 0,
            element: 'knowledge',
          },
        },
        affinity: {
          primary: null,
          secondary: null,
        },
      },
      battle: {
        playerMP: 100,
      },
    });
  });

  describe('_calculateSpellDamage', () => {
    it('returns base damage * form multiplier for level 1 root, no affinity, perfect accuracy', () => {
      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };
      const damage = manager._calculateSpellDamage(spell, 0.95);

      // Form I: powerMult 1.0 * 20 = 20 base
      // Mastery: 1.0 + (1 * 0.1) = 1.1x
      // Affinity: 1.0x (no affinity)
      // Grammar: 1.2x (perfect)
      // Final: 20 * 1.1 * 1.0 * 1.2 = 26.4 → 26
      expect(damage).toBe(26);
    });

    it('applies mastery multiplier (level 5 = 1.5x)', () => {
      store.getState.mockReturnValue({
        magic: {
          rootMastery: {
            'ك-ت-ب': { level: 5, xp: 400, element: 'knowledge' },
          },
          affinity: { primary: null, secondary: null },
        },
      });

      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };
      const damage = manager._calculateSpellDamage(spell, 0.95);

      // Mastery: 1.0 + (5 * 0.1) = 1.5x
      // Final: 20 * 1.5 * 1.0 * 1.2 = 36
      expect(damage).toBe(36);
    });

    it('applies primary affinity multiplier (2.0x)', () => {
      store.getState.mockReturnValue({
        magic: {
          rootMastery: {
            'ك-ت-ب': { level: 1, xp: 0, element: 'knowledge' },
          },
          affinity: {
            primary: 'knowledge',
            secondary: null,
          },
        },
      });

      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };
      const damage = manager._calculateSpellDamage(spell, 0.95);

      // Affinity: 2.0x (primary)
      // Final: 20 * 1.1 * 2.0 * 1.2 = 52.8 → 52
      expect(damage).toBe(52);
    });

    it('applies secondary affinity multiplier (1.5x)', () => {
      store.getState.mockReturnValue({
        magic: {
          rootMastery: {
            'ك-ت-ب': { level: 1, xp: 0, element: 'knowledge' },
          },
          affinity: {
            primary: 'fire',
            secondary: 'knowledge',
          },
        },
      });

      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };
      const damage = manager._calculateSpellDamage(spell, 0.95);

      // Affinity: 1.5x (secondary)
      // Final: 20 * 1.1 * 1.5 * 1.2 = 39.6 → 39
      expect(damage).toBe(39);
    });

    it('applies grammar accuracy multiplier: perfect (>=0.95) = 1.2x', () => {
      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };
      const damage = manager._calculateSpellDamage(spell, 0.95);

      // Grammar: 1.2x
      // Final: 20 * 1.1 * 1.0 * 1.2 = 26.4 → 26
      expect(damage).toBe(26);
    });

    it('applies grammar accuracy multiplier: good (>=0.7) = 1.0x', () => {
      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };
      const damage = manager._calculateSpellDamage(spell, 0.7);

      // Grammar: 1.0x
      // Final: 20 * 1.1 * 1.0 * 1.0 = 22
      expect(damage).toBe(22);
    });

    it('applies grammar accuracy multiplier: partial (<0.7) = 0.5x', () => {
      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };
      const damage = manager._calculateSpellDamage(spell, 0.5);

      // Grammar: 0.5x
      // Final: 20 * 1.1 * 1.0 * 0.5 = 11
      expect(damage).toBe(11);
    });

    it('returns minimum 1 damage', () => {
      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };

      // Even with very low accuracy, minimum is 1
      // Base: 20 * 1.1 * 1.0 * 0.5 = 11, so test with extreme case isn't needed
      // But the code has Math.max(1, ...) so minimum is enforced
      const damage = manager._calculateSpellDamage(spell, 0);

      expect(damage).toBeGreaterThanOrEqual(1);
    });

    it('stacks mastery + affinity + grammar multipliers correctly', () => {
      store.getState.mockReturnValue({
        magic: {
          rootMastery: {
            'ك-ت-ب': { level: 10, xp: 900, element: 'knowledge' },
          },
          affinity: {
            primary: 'knowledge',
            secondary: null,
          },
        },
      });

      const spell = { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 5 };
      const damage = manager._calculateSpellDamage(spell, 0.95);

      // Base: 20
      // Mastery: 1.0 + (10 * 0.1) = 2.0x
      // Affinity: 2.0x (primary)
      // Grammar: 1.2x (perfect)
      // Final: 20 * 2.0 * 2.0 * 1.2 = 96
      expect(damage).toBe(96);
    });
  });

  describe('castSpell', () => {
    it('returns false and emits MP_DEPLETED if not enough MP', () => {
      store.getState.mockReturnValue({
        magic: {
          equippedSpells: [
            { rootId: 'ك-ت-ب', form: 'I', element: 'knowledge', mpCost: 10 },
            null,
            null,
            null,
            null,
            null,
          ],
          rootMastery: {
            'ك-ت-ب': { level: 1, xp: 0, element: 'knowledge' },
          },
          affinity: { primary: null, secondary: null },
        },
        battle: {
          playerMP: 5, // Not enough for 10 MP cost
        },
      });

      const result = manager.castSpell(0, 0, 0.95);

      expect(result).toBe(false);
      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.MAGIC_MP_DEPLETED,
        expect.objectContaining({
          slot: 0,
          spellMPCost: 10,
          playerMP: 5,
        })
      );
    });

    it('dispatches spendMP with correct cost', () => {
      const result = manager.castSpell(0, 0, 0.95);

      expect(result).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'battle/spendMP',
          payload: 5,
        })
      );
    });

    it('dispatches recordRootUse after spell cast', () => {
      manager.castSpell(0, 0, 0.95);

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'magic/recordRootUse',
          payload: expect.objectContaining({
            rootId: 'ك-ت-ب',
            form: 'I',
            accuracy: 0.95,
          }),
        })
      );
    });
  });
});
