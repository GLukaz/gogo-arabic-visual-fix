/**
 * Tests for Redux-Persist Storage Migrations
 *
 * Verifies migration version handling and state preservation during localStorage->IndexedDB migration.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { migrate, CURRENT_VERSION } from '../migrations.js';

describe('Storage Migrations', () => {
  let originalLocalStorage;

  beforeEach(() => {
    // Save original localStorage
    originalLocalStorage = global.localStorage;

    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
          store[key] = value.toString();
        },
        removeItem: (key) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    global.localStorage = localStorageMock;
  });

  afterEach(() => {
    // Restore original localStorage
    global.localStorage = originalLocalStorage;
    vi.clearAllTimers();
  });

  describe('Migration version', () => {
    it('CURRENT_VERSION equals 12', () => {
      expect(CURRENT_VERSION).toBe(12);
    });

    it('migrate is a function', () => {
      expect(typeof migrate).toBe('function');
    });
  });

  describe('Migration v0 -> v1', () => {
    it('receives state and returns state unchanged', async () => {
      const inputState = {
        player: { name: 'Test Player', level: 5 },
        vocabulary: {
          fsrsCards: [{ id: 'card1', word: 'test' }],
          words: [],
        },
        battle: {
          battleHistory: [{ id: 'battle1', result: 'win' }],
        },
        quests: { active: [], completed: [] },
      };

      // Migration receives deserialized state from redux-persist
      const outputState = await migrate(inputState, 1);

      // State structure unchanged (data movement happens via redux-persist, not in migration)
      expect(outputState).toEqual(inputState);
      expect(outputState.player).toEqual(inputState.player);
      expect(outputState.vocabulary).toEqual(inputState.vocabulary);
      expect(outputState.battle).toEqual(inputState.battle);
    });

    it('handles null state gracefully', async () => {
      const outputState = await migrate(null, 1);

      // redux-persist createMigrate returns undefined for null state
      expect(outputState).toBeUndefined();
    });

    it('handles undefined state gracefully', async () => {
      const outputState = await migrate(undefined, 1);

      // Should return undefined for undefined input
      expect(outputState).toBeUndefined();
    });

    it('handles empty state object', async () => {
      const inputState = {};
      const outputState = await migrate(inputState, 1);

      expect(outputState).toEqual(inputState);
    });

    it('handles state with missing vocabulary and battle slices', async () => {
      const inputState = {
        player: { name: 'Test Player' },
        quests: { active: [] },
        // vocabulary and battle missing
      };

      const outputState = await migrate(inputState, 1);

      expect(outputState).toEqual(inputState);
      expect(outputState.player).toEqual(inputState.player);
      expect(outputState.vocabulary).toBeUndefined();
      expect(outputState.battle).toBeUndefined();
    });
  });

  describe('Migration cleanup behavior', () => {
    it('schedules cleanup of old localStorage data', async () => {
      // Set up old localStorage data (pre-migration format)
      const oldData = {
        player: JSON.stringify({ name: 'Test' }),
        vocabulary: JSON.stringify({ fsrsCards: [] }),
        battle: JSON.stringify({ battleHistory: [] }),
        quests: JSON.stringify({ active: [] }),
      };

      localStorage.setItem('persist:gogo-arabic', JSON.stringify(oldData));

      const inputState = {
        player: { name: 'Test' },
        vocabulary: { fsrsCards: [] },
        battle: { battleHistory: [] },
      };

      // Run migration
      await migrate(inputState, 1);

      // Cleanup is scheduled with 5s setTimeout
      expect(vi.getTimerCount()).toBeGreaterThan(0);

      // Fast-forward timers to trigger cleanup
      vi.runAllTimers();

      // After cleanup, localStorage should have vocabulary and battle removed
      const cleanedData = localStorage.getItem('persist:gogo-arabic');

      if (cleanedData) {
        const parsed = JSON.parse(cleanedData);
        expect(parsed.vocabulary).toBeUndefined();
        expect(parsed.battle).toBeUndefined();
        expect(parsed.player).toBeDefined(); // Other slices remain
      }
    });

    it('handles cleanup errors gracefully (non-critical failure)', async () => {
      // Mock localStorage.setItem to throw error during cleanup
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const inputState = {
        player: { name: 'Test' },
        vocabulary: { fsrsCards: [] },
      };

      // Migration should not throw even if cleanup fails
      await expect(migrate(inputState, 1)).resolves.toEqual(inputState);

      // Restore setItem
      localStorage.setItem = originalSetItem;
    });

    it('handles missing localStorage data during cleanup', async () => {
      // No pre-existing localStorage data
      const inputState = {
        player: { name: 'Test' },
      };

      // Should not throw when localStorage is empty
      await expect(migrate(inputState, 1)).resolves.toEqual(inputState);

      vi.runAllTimers();

      // No errors should occur
    });

    it('handles corrupted localStorage data during cleanup', async () => {
      // Set corrupted JSON in localStorage
      localStorage.setItem('persist:gogo-arabic', 'invalid-json{{{');

      const inputState = {
        player: { name: 'Test' },
      };

      // Migration should complete successfully
      await expect(migrate(inputState, 1)).resolves.toEqual(inputState);

      // Run cleanup timer
      vi.runAllTimers();

      // Cleanup should handle JSON parse error gracefully (no throw)
    });
  });
});
