import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  unlockAbility,
  equipAbility,
  unequipAbility,
  recordAbilityUse,
  levelUpAbility,
  purchaseAbilityUpgrade,
  recordBossDefeatWithAbility,
  resetAbilityStats,
  selectUnlockedAbilities,
  selectEquippedAbilities,
  selectAbilityLevel,
  selectAbilityStats,
  selectPurchasedUpgrades,
  selectCombatStatistics,
  selectUnlockedAbilityCount,
  selectUnlockedAbilityIds,
  selectEquippedAbilityIds,
} from '../linguisticCombatSlice.js';

describe('linguisticCombatSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  describe('unlockAbility', () => {
    it('unlocks a new ability', () => {
      const state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      expect(state.unlockedAbilities['eloquent_response']).toBeDefined();
      expect(state.unlockedAbilities['eloquent_response'].id).toBe('eloquent_response');
      expect(state.unlockedAbilities['eloquent_response'].level).toBe(1);
      expect(state.unlockedAbilities['eloquent_response'].usageCount).toBe(0);
      expect(state.unlockedAbilities['eloquent_response'].upgrades).toEqual([]);
    });

    it('sets unlockedAt timestamp', () => {
      const before = Date.now();
      const state = reducer(initialState, unlockAbility({ abilityId: 'grammar_shield' }));
      const after = Date.now();

      expect(state.unlockedAbilities['grammar_shield'].unlockedAt).toBeGreaterThanOrEqual(before);
      expect(state.unlockedAbilities['grammar_shield'].unlockedAt).toBeLessThanOrEqual(after);
    });

    it('skips duplicate unlock (idempotent)', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      const firstUnlockTime = state.unlockedAbilities['eloquent_response'].unlockedAt;

      // Use the ability to change usageCount
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      expect(state.unlockedAbilities['eloquent_response'].usageCount).toBe(1);

      // Try to unlock again — should NOT reset
      state = reducer(state, unlockAbility({ abilityId: 'eloquent_response' }));
      expect(state.unlockedAbilities['eloquent_response'].usageCount).toBe(1);
      expect(state.unlockedAbilities['eloquent_response'].unlockedAt).toBe(firstUnlockTime);
    });

    it('unlocks multiple abilities independently', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));
      state = reducer(state, unlockAbility({ abilityId: 'proverb_strike' }));

      expect(Object.keys(state.unlockedAbilities)).toHaveLength(3);
      expect(state.unlockedAbilities['eloquent_response']).toBeDefined();
      expect(state.unlockedAbilities['grammar_shield']).toBeDefined();
      expect(state.unlockedAbilities['proverb_strike']).toBeDefined();
    });
  });

  describe('equipAbility', () => {
    it('equips an unlocked ability to a slot', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));

      expect(state.equippedAbilities[0]).toEqual({ abilityId: 'eloquent_response', slot: 0 });
    });

    it('does not equip an ability that is not unlocked', () => {
      const state = reducer(initialState, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));
      expect(state.equippedAbilities[0]).toBeNull();
    });

    it('rejects invalid slot (negative)', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: -1 }));

      expect(state.equippedAbilities.every((s) => s === null)).toBe(true);
    });

    it('rejects invalid slot (too high)', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 4 }));

      expect(state.equippedAbilities.every((s) => s === null)).toBe(true);
    });

    it('replaces existing ability in same slot', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));
      state = reducer(state, equipAbility({ abilityId: 'grammar_shield', slot: 0 }));

      expect(state.equippedAbilities[0]).toEqual({ abilityId: 'grammar_shield', slot: 0 });
    });

    it('removes ability from previous slot when equipping to new slot', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 2 }));

      expect(state.equippedAbilities[0]).toBeNull();
      expect(state.equippedAbilities[2]).toEqual({ abilityId: 'eloquent_response', slot: 2 });
    });

    it('can equip abilities to all 4 slots', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));
      state = reducer(state, unlockAbility({ abilityId: 'proverb_strike' }));
      state = reducer(state, unlockAbility({ abilityId: 'tongue_lash' }));

      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));
      state = reducer(state, equipAbility({ abilityId: 'grammar_shield', slot: 1 }));
      state = reducer(state, equipAbility({ abilityId: 'proverb_strike', slot: 2 }));
      state = reducer(state, equipAbility({ abilityId: 'tongue_lash', slot: 3 }));

      expect(state.equippedAbilities[0].abilityId).toBe('eloquent_response');
      expect(state.equippedAbilities[1].abilityId).toBe('grammar_shield');
      expect(state.equippedAbilities[2].abilityId).toBe('proverb_strike');
      expect(state.equippedAbilities[3].abilityId).toBe('tongue_lash');
    });
  });

  describe('unequipAbility', () => {
    it('removes ability from slot', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));
      state = reducer(state, unequipAbility({ slot: 0 }));

      expect(state.equippedAbilities[0]).toBeNull();
    });

    it('handles unequipping an already empty slot', () => {
      const state = reducer(initialState, unequipAbility({ slot: 0 }));
      expect(state.equippedAbilities[0]).toBeNull();
    });

    it('rejects invalid slot (negative)', () => {
      // Should not throw
      const state = reducer(initialState, unequipAbility({ slot: -1 }));
      expect(state.equippedAbilities).toEqual([null, null, null, null]);
    });

    it('rejects invalid slot (too high)', () => {
      const state = reducer(initialState, unequipAbility({ slot: 10 }));
      expect(state.equippedAbilities).toEqual([null, null, null, null]);
    });
  });

  describe('recordAbilityUse', () => {
    it('increments usageCount on the ability', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));

      expect(state.unlockedAbilities['eloquent_response'].usageCount).toBe(1);
    });

    it('increments totalAbilitiesUsed', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));

      expect(state.statistics.totalAbilitiesUsed).toBe(2);
    });

    it('tracks mostUsedAbility correctly', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));

      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'grammar_shield' }));

      expect(state.statistics.mostUsedAbility).toBe('eloquent_response');
    });

    it('updates mostUsedAbility when another surpasses', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));

      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'grammar_shield' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'grammar_shield' }));

      expect(state.statistics.mostUsedAbility).toBe('grammar_shield');
    });

    it('does not record use for unlocked ability', () => {
      const state = reducer(initialState, recordAbilityUse({ abilityId: 'nonexistent' }));
      expect(state.statistics.totalAbilitiesUsed).toBe(0);
    });

    it('tracks per-ability usage counts in statistics', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));

      expect(state.statistics.abilityUsageCounts['eloquent_response']).toBe(3);
    });
  });

  describe('levelUpAbility', () => {
    it('increments level from 1 to 2', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, levelUpAbility({ abilityId: 'eloquent_response' }));

      expect(state.unlockedAbilities['eloquent_response'].level).toBe(2);
    });

    it('caps at max level 5', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));

      // Level up to 5
      for (let i = 0; i < 10; i++) {
        state = reducer(state, levelUpAbility({ abilityId: 'eloquent_response' }));
      }

      expect(state.unlockedAbilities['eloquent_response'].level).toBe(5);
    });

    it('does not level up an ability that is not unlocked', () => {
      const state = reducer(initialState, levelUpAbility({ abilityId: 'nonexistent' }));
      expect(state.unlockedAbilities['nonexistent']).toBeUndefined();
    });

    it('levels up independently for different abilities', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));

      state = reducer(state, levelUpAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, levelUpAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, levelUpAbility({ abilityId: 'grammar_shield' }));

      expect(state.unlockedAbilities['eloquent_response'].level).toBe(3);
      expect(state.unlockedAbilities['grammar_shield'].level).toBe(2);
    });
  });

  describe('purchaseAbilityUpgrade', () => {
    it('records a purchased upgrade', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(
        state,
        purchaseAbilityUpgrade({
          upgradeId: 'eloquent_response_crit_boost',
          abilityId: 'eloquent_response',
          cost: 100,
          effect: { damageBoost: 0.15 },
        })
      );

      expect(state.purchasedUpgrades['eloquent_response_crit_boost']).toBeDefined();
      expect(state.purchasedUpgrades['eloquent_response_crit_boost'].cost).toBe(100);
      expect(state.purchasedUpgrades['eloquent_response_crit_boost'].damageBoost).toBe(0.15);
    });

    it('adds upgrade to ability upgrades list', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(
        state,
        purchaseAbilityUpgrade({
          upgradeId: 'eloquent_response_crit_boost',
          abilityId: 'eloquent_response',
          cost: 100,
          effect: { damageBoost: 0.15 },
        })
      );

      expect(state.unlockedAbilities['eloquent_response'].upgrades).toContain(
        'eloquent_response_crit_boost'
      );
    });

    it('skips duplicate upgrade purchase (idempotent)', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(
        state,
        purchaseAbilityUpgrade({
          upgradeId: 'eloquent_response_crit_boost',
          abilityId: 'eloquent_response',
          cost: 100,
          effect: { damageBoost: 0.15 },
        })
      );
      state = reducer(
        state,
        purchaseAbilityUpgrade({
          upgradeId: 'eloquent_response_crit_boost',
          abilityId: 'eloquent_response',
          cost: 100,
          effect: { damageBoost: 0.15 },
        })
      );

      expect(state.unlockedAbilities['eloquent_response'].upgrades.length).toBe(1);
    });

    it('does not purchase upgrade for unlocked ability', () => {
      const state = reducer(
        initialState,
        purchaseAbilityUpgrade({
          upgradeId: 'nonexistent_upgrade',
          abilityId: 'nonexistent',
          cost: 100,
          effect: { damageBoost: 0.15 },
        })
      );

      expect(state.purchasedUpgrades['nonexistent_upgrade']).toBeUndefined();
    });
  });

  describe('recordBossDefeatWithAbility', () => {
    it('records a boss defeat linked to an ability', () => {
      const state = reducer(
        initialState,
        recordBossDefeatWithAbility({
          abilityId: 'eloquent_response',
          bossId: 'grammar_master_library',
        })
      );

      expect(state.statistics.bossesDefeatedWithAbility['eloquent_response']).toContain(
        'grammar_master_library'
      );
    });

    it('does not duplicate boss defeat records', () => {
      let state = reducer(
        initialState,
        recordBossDefeatWithAbility({
          abilityId: 'eloquent_response',
          bossId: 'grammar_master_library',
        })
      );
      state = reducer(
        state,
        recordBossDefeatWithAbility({
          abilityId: 'eloquent_response',
          bossId: 'grammar_master_library',
        })
      );

      expect(
        state.statistics.bossesDefeatedWithAbility['eloquent_response'].filter(
          (id) => id === 'grammar_master_library'
        ).length
      ).toBe(1);
    });

    it('tracks multiple bosses per ability', () => {
      let state = reducer(
        initialState,
        recordBossDefeatWithAbility({
          abilityId: 'eloquent_response',
          bossId: 'grammar_master_library',
        })
      );
      state = reducer(
        state,
        recordBossDefeatWithAbility({
          abilityId: 'eloquent_response',
          bossId: 'oasis_elder_amira',
        })
      );

      expect(state.statistics.bossesDefeatedWithAbility['eloquent_response']).toHaveLength(2);
    });
  });

  describe('resetAbilityStats', () => {
    it('resets all statistics', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));

      expect(state.statistics.totalAbilitiesUsed).toBe(2);

      state = reducer(state, resetAbilityStats());

      expect(state.statistics.totalAbilitiesUsed).toBe(0);
      expect(state.statistics.mostUsedAbility).toBeNull();
      expect(state.statistics.bossesDefeatedWithAbility).toEqual({});
      expect(state.statistics.abilityUsageCounts).toEqual({});
    });

    it('resets individual ability usageCount', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));
      state = reducer(state, recordAbilityUse({ abilityId: 'eloquent_response' }));

      expect(state.unlockedAbilities['eloquent_response'].usageCount).toBe(2);

      state = reducer(state, resetAbilityStats());

      expect(state.unlockedAbilities['eloquent_response'].usageCount).toBe(0);
    });

    it('preserves unlocked abilities', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));
      state = reducer(state, resetAbilityStats());

      expect(state.unlockedAbilities['eloquent_response']).toBeDefined();
      expect(state.unlockedAbilities['grammar_shield']).toBeDefined();
    });

    it('preserves equipped abilities', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));
      state = reducer(state, resetAbilityStats());

      expect(state.equippedAbilities[0]).toEqual({ abilityId: 'eloquent_response', slot: 0 });
    });

    it('preserves ability levels', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, levelUpAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, levelUpAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, resetAbilityStats());

      expect(state.unlockedAbilities['eloquent_response'].level).toBe(3);
    });
  });

  describe('selectors', () => {
    const createStoreState = (linguisticCombatState) => ({
      linguisticCombat: linguisticCombatState,
    });

    it('selectUnlockedAbilities returns unlocked abilities object', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      const storeState = createStoreState(state);

      const unlocked = selectUnlockedAbilities(storeState);
      expect(unlocked['eloquent_response']).toBeDefined();
    });

    it('selectEquippedAbilities returns equipment array', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));
      const storeState = createStoreState(state);

      const equipped = selectEquippedAbilities(storeState);
      expect(equipped[0]).toEqual({ abilityId: 'eloquent_response', slot: 0 });
      expect(equipped[1]).toBeNull();
    });

    it('selectAbilityLevel returns correct level', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, levelUpAbility({ abilityId: 'eloquent_response' }));
      const storeState = createStoreState(state);

      expect(selectAbilityLevel(storeState, 'eloquent_response')).toBe(2);
    });

    it('selectAbilityLevel returns 0 for non-unlocked ability', () => {
      const storeState = createStoreState(initialState);
      expect(selectAbilityLevel(storeState, 'nonexistent')).toBe(0);
    });

    it('selectAbilityStats returns ability data or null', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      const storeState = createStoreState(state);

      expect(selectAbilityStats(storeState, 'eloquent_response')).toBeDefined();
      expect(selectAbilityStats(storeState, 'nonexistent')).toBeNull();
    });

    it('selectPurchasedUpgrades returns upgrades object', () => {
      const storeState = createStoreState(initialState);
      expect(selectPurchasedUpgrades(storeState)).toEqual({});
    });

    it('selectCombatStatistics returns statistics object', () => {
      const storeState = createStoreState(initialState);
      const stats = selectCombatStatistics(storeState);
      expect(stats.totalAbilitiesUsed).toBe(0);
      expect(stats.mostUsedAbility).toBeNull();
    });

    it('selectUnlockedAbilityCount returns correct count', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));
      const storeState = createStoreState(state);

      expect(selectUnlockedAbilityCount(storeState)).toBe(2);
    });

    it('selectUnlockedAbilityIds returns array of ability IDs', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));
      const storeState = createStoreState(state);

      const ids = selectUnlockedAbilityIds(storeState);
      expect(ids).toContain('eloquent_response');
      expect(ids).toContain('grammar_shield');
      expect(ids).toHaveLength(2);
    });

    it('selectEquippedAbilityIds returns only non-null ability IDs', () => {
      let state = reducer(initialState, unlockAbility({ abilityId: 'eloquent_response' }));
      state = reducer(state, unlockAbility({ abilityId: 'grammar_shield' }));
      state = reducer(state, equipAbility({ abilityId: 'eloquent_response', slot: 0 }));
      state = reducer(state, equipAbility({ abilityId: 'grammar_shield', slot: 2 }));
      const storeState = createStoreState(state);

      const ids = selectEquippedAbilityIds(storeState);
      expect(ids).toContain('eloquent_response');
      expect(ids).toContain('grammar_shield');
      expect(ids).toHaveLength(2);
    });

    it('selectEquippedAbilityIds returns empty array when nothing equipped', () => {
      const storeState = createStoreState(initialState);
      const ids = selectEquippedAbilityIds(storeState);
      expect(ids).toEqual([]);
    });
  });
});
