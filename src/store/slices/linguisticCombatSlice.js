import { createSlice, createSelector } from '@reduxjs/toolkit';

const MAX_ABILITY_LEVEL = 5;
const MAX_EQUIPPED_SLOTS = 4;

const initialState = {
  // Discovered linguistic abilities
  unlockedAbilities: {},
  // Example:
  // 'eloquent_response': {
  //   id: 'eloquent_response',
  //   unlockedAt: 1704067200000,
  //   usageCount: 0,
  //   level: 1,
  //   upgrades: [],
  // },

  // Ability hotbar (4 slots)
  equippedAbilities: [null, null, null, null],
  // Each slot: { abilityId: 'eloquent_response', slot: 0 } or null

  // Active ability upgrades purchased
  purchasedUpgrades: {},
  // Example:
  // 'eloquent_response_crit_boost': { cost: 100, damageBoost: 0.15 },

  // Usage statistics
  statistics: {
    totalAbilitiesUsed: 0,
    mostUsedAbility: null,
    bossesDefeatedWithAbility: {},
    abilityUsageCounts: {},
  },
};

const linguisticCombatSlice = createSlice({
  name: 'linguisticCombat',
  initialState,
  reducers: {
    /**
     * Unlock a new linguistic ability.
     * payload: { abilityId: string }
     */
    unlockAbility(state, action) {
      const { abilityId } = action.payload;

      // Skip if already unlocked (idempotent)
      if (state.unlockedAbilities[abilityId]) {
        return;
      }

      state.unlockedAbilities[abilityId] = {
        id: abilityId,
        unlockedAt: Date.now(),
        usageCount: 0,
        level: 1,
        upgrades: [],
      };
    },

    /**
     * Equip an ability to a hotbar slot.
     * payload: { abilityId: string, slot: number }
     */
    equipAbility(state, action) {
      const { abilityId, slot } = action.payload;

      // Validate slot range
      if (slot < 0 || slot >= MAX_EQUIPPED_SLOTS) {
        return;
      }

      // Must be unlocked to equip
      if (!state.unlockedAbilities[abilityId]) {
        return;
      }

      // Remove ability from any existing slot first (prevent duplicates)
      for (let i = 0; i < state.equippedAbilities.length; i++) {
        if (state.equippedAbilities[i] && state.equippedAbilities[i].abilityId === abilityId) {
          state.equippedAbilities[i] = null;
        }
      }

      // Equip to specified slot
      state.equippedAbilities[slot] = { abilityId, slot };
    },

    /**
     * Unequip an ability from a hotbar slot.
     * payload: { slot: number }
     */
    unequipAbility(state, action) {
      const { slot } = action.payload;

      // Validate slot range
      if (slot < 0 || slot >= MAX_EQUIPPED_SLOTS) {
        return;
      }

      state.equippedAbilities[slot] = null;
    },

    /**
     * Record usage of an ability (track stats).
     * payload: { abilityId: string }
     */
    recordAbilityUse(state, action) {
      const { abilityId } = action.payload;

      // Must be unlocked
      if (!state.unlockedAbilities[abilityId]) {
        return;
      }

      // Increment ability-specific usage
      state.unlockedAbilities[abilityId].usageCount += 1;

      // Increment global statistics
      state.statistics.totalAbilitiesUsed += 1;

      // Track per-ability usage counts
      if (!state.statistics.abilityUsageCounts[abilityId]) {
        state.statistics.abilityUsageCounts[abilityId] = 0;
      }
      state.statistics.abilityUsageCounts[abilityId] += 1;

      // Recalculate most used ability
      let maxCount = 0;
      let maxAbility = null;
      for (const [id, count] of Object.entries(state.statistics.abilityUsageCounts)) {
        if (count > maxCount) {
          maxCount = count;
          maxAbility = id;
        }
      }
      state.statistics.mostUsedAbility = maxAbility;
    },

    /**
     * Level up an ability (max level 5).
     * payload: { abilityId: string }
     */
    levelUpAbility(state, action) {
      const { abilityId } = action.payload;

      // Must be unlocked
      if (!state.unlockedAbilities[abilityId]) {
        return;
      }

      const ability = state.unlockedAbilities[abilityId];

      // Cap at max level
      if (ability.level >= MAX_ABILITY_LEVEL) {
        return;
      }

      ability.level += 1;
    },

    /**
     * Purchase an upgrade for an ability.
     * payload: { upgradeId: string, abilityId: string, cost: number, effect: object }
     */
    purchaseAbilityUpgrade(state, action) {
      const { upgradeId, abilityId, cost, effect } = action.payload;

      // Must be unlocked
      if (!state.unlockedAbilities[abilityId]) {
        return;
      }

      // Skip if already purchased
      if (state.purchasedUpgrades[upgradeId]) {
        return;
      }

      // Record purchased upgrade
      state.purchasedUpgrades[upgradeId] = { cost, ...effect };

      // Add upgrade to ability's upgrade list
      state.unlockedAbilities[abilityId].upgrades.push(upgradeId);
    },

    /**
     * Record a boss defeat using a specific ability.
     * payload: { abilityId: string, bossId: string }
     */
    recordBossDefeatWithAbility(state, action) {
      const { abilityId, bossId } = action.payload;

      if (!state.statistics.bossesDefeatedWithAbility[abilityId]) {
        state.statistics.bossesDefeatedWithAbility[abilityId] = [];
      }

      if (!state.statistics.bossesDefeatedWithAbility[abilityId].includes(bossId)) {
        state.statistics.bossesDefeatedWithAbility[abilityId].push(bossId);
      }
    },

    /**
     * Reset all statistics (keep unlocked abilities and equipment).
     */
    resetAbilityStats(state) {
      state.statistics = {
        totalAbilitiesUsed: 0,
        mostUsedAbility: null,
        bossesDefeatedWithAbility: {},
        abilityUsageCounts: {},
      };

      // Also reset usage counts on individual abilities
      for (const abilityId of Object.keys(state.unlockedAbilities)) {
        state.unlockedAbilities[abilityId].usageCount = 0;
      }
    },
  },
});

// ──────────────────────────────────────────────────
// Selectors
// ──────────────────────────────────────────────────

/**
 * Select all unlocked abilities as an object.
 */
export const selectUnlockedAbilities = (state) =>
  state.linguisticCombat.unlockedAbilities;

/**
 * Select the equipped abilities hotbar.
 */
export const selectEquippedAbilities = (state) =>
  state.linguisticCombat.equippedAbilities;

/**
 * Select a specific ability's level.
 */
export const selectAbilityLevel = (state, abilityId) =>
  state.linguisticCombat.unlockedAbilities[abilityId]?.level ?? 0;

/**
 * Select a specific ability's usage stats.
 */
export const selectAbilityStats = (state, abilityId) =>
  state.linguisticCombat.unlockedAbilities[abilityId] ?? null;

/**
 * Select all purchased upgrades.
 */
export const selectPurchasedUpgrades = (state) =>
  state.linguisticCombat.purchasedUpgrades;

/**
 * Select global statistics.
 */
export const selectCombatStatistics = (state) =>
  state.linguisticCombat.statistics;

/**
 * Select total number of unlocked abilities.
 */
export const selectUnlockedAbilityCount = createSelector(
  [(state) => state.linguisticCombat.unlockedAbilities],
  (unlockedAbilities) => Object.keys(unlockedAbilities).length
);

/**
 * Select list of unlocked ability IDs.
 */
export const selectUnlockedAbilityIds = createSelector(
  [(state) => state.linguisticCombat.unlockedAbilities],
  (unlockedAbilities) => Object.keys(unlockedAbilities)
);

/**
 * Select equipped ability IDs only (filtering null slots).
 */
export const selectEquippedAbilityIds = createSelector(
  [(state) => state.linguisticCombat.equippedAbilities],
  (equippedAbilities) =>
    equippedAbilities
      .filter((slot) => slot !== null)
      .map((slot) => slot.abilityId)
);

export const {
  unlockAbility,
  equipAbility,
  unequipAbility,
  recordAbilityUse,
  levelUpAbility,
  purchaseAbilityUpgrade,
  recordBossDefeatWithAbility,
  resetAbilityStats,
} = linguisticCombatSlice.actions;

export default linguisticCombatSlice.reducer;
