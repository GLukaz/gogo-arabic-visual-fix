/**
 * craftingSlice.js — Crafting and profession state management for Phase 31
 *
 * Manages 6 professions with levels, XP, unlocked recipes, and gathered resources.
 * Follows patterns from magicSlice.js (XP/leveling) and inventorySlice.js (item stacking).
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RECIPES } from '../../data/recipes.js';
import { RESOURCES } from '../../data/resources.js';
import { PROFESSIONS } from '../../data/professions.js';
import { RECIPE_DISCOVERY_METHODS } from '../../data/recipeDiscovery.js';

const initialState = {
  professions: {},           // { [professionId]: { level, xp, recipesUnlocked: [], craftCount } }
  resources: [],             // [{ resourceId, quantity, quality }]
  discoveredRecipes: [],     // [recipeIds] found via exploration/NPC/experimentation
  discoveredRecipeLog: {},   // { [recipeId]: { method, professionId, discoveredAt } }
  gatheringCooldowns: {},    // { [spotId]: lastGatheredTimestamp }
};

const craftingSlice = createSlice({
  name: 'crafting',
  initialState,
  reducers: {
    learnProfession(state, action) {
      // payload: { professionId }
      const { professionId } = action.payload;

      // Validate profession exists
      if (!PROFESSIONS[professionId]) {
        console.error(`[craftingSlice] Invalid profession '${professionId}'`);
        return;
      }

      // Skip if already learned
      if (state.professions[professionId]) {
        return;
      }

      // Initialize profession at level 0
      state.professions[professionId] = {
        level: 0,
        xp: 0,
        recipesUnlocked: [],
        craftCount: 0,
      };
    },

    addProfessionXP(state, action) {
      // payload: { professionId, xp }
      const { professionId, xp } = action.payload;

      if (!state.professions[professionId]) {
        console.error(`[craftingSlice] Cannot add XP to unknown profession '${professionId}'`);
        return;
      }

      const profession = state.professions[professionId];
      const professionData = PROFESSIONS[professionId];

      // Add XP
      profession.xp += xp;

      // Auto-level if threshold reached (100 XP × level)
      const xpPerLevel = professionData.xpPerLevel || 100;
      const newLevel = Math.floor(profession.xp / xpPerLevel);

      if (newLevel > profession.level && newLevel <= professionData.maxLevel) {
        profession.level = newLevel;
      }
    },

    levelUpProfession(state, action) {
      // payload: { professionId }
      const { professionId } = action.payload;

      if (!state.professions[professionId]) {
        console.error(`[craftingSlice] Cannot level up unknown profession '${professionId}'`);
        return;
      }

      const profession = state.professions[professionId];
      const professionData = PROFESSIONS[professionId];

      // Increment level (max 10)
      if (profession.level < professionData.maxLevel) {
        profession.level += 1;

        // Reset XP overflow
        const xpPerLevel = professionData.xpPerLevel || 100;
        profession.xp = profession.xp % xpPerLevel;
      }
    },

    unlockRecipe(state, action) {
      // payload: { recipeId, professionId }
      const { recipeId, professionId } = action.payload;

      // Validate recipe exists
      const recipe = RECIPES[recipeId];
      if (!recipe) {
        console.error(`[craftingSlice] Invalid recipe '${recipeId}'`);
        return;
      }

      // Validate profession learned
      if (!state.professions[professionId]) {
        console.error(`[craftingSlice] Cannot unlock recipe for unknown profession '${professionId}'`);
        return;
      }

      const profession = state.professions[professionId];

      // Check min level requirement
      if (profession.level < recipe.minLevel) {
        console.warn(`[craftingSlice] Profession level ${profession.level} too low for recipe '${recipeId}' (requires ${recipe.minLevel})`);
        return;
      }

      // Add to profession's unlocked recipes (avoid duplicates)
      if (!profession.recipesUnlocked.includes(recipeId)) {
        profession.recipesUnlocked.push(recipeId);
      }

      // Add to global discovered recipes (avoid duplicates)
      if (!state.discoveredRecipes.includes(recipeId)) {
        state.discoveredRecipes.push(recipeId);
      }
    },

    addResource(state, action) {
      // payload: { resourceId, quantity, quality = 'common' }
      const { resourceId, quantity, quality = 'common' } = action.payload;

      // Find existing resource with same ID and quality
      const existingResource = state.resources.find(
        r => r.resourceId === resourceId && r.quality === quality
      );

      if (existingResource) {
        // Stack resources (cap at 999 per type+quality)
        existingResource.quantity = Math.min(existingResource.quantity + quantity, 999);
      } else {
        // Add new resource entry
        state.resources.push({
          resourceId,
          quantity: Math.min(quantity, 999),
          quality,
        });
      }
    },

    removeResource(state, action) {
      // payload: { resourceId, quantity, quality = 'common' }
      const { resourceId, quantity, quality = 'common' } = action.payload;

      // Find resource
      const existingResource = state.resources.find(
        r => r.resourceId === resourceId && r.quality === quality
      );

      if (!existingResource) {
        console.warn(`[craftingSlice] Cannot remove non-existent resource '${resourceId}' (${quality})`);
        return;
      }

      // Subtract quantity
      existingResource.quantity -= quantity;

      // Remove from array if quantity reaches 0
      if (existingResource.quantity <= 0) {
        state.resources = state.resources.filter(
          r => !(r.resourceId === resourceId && r.quality === quality)
        );
      }
    },

    craftItem(state, action) {
      // payload: { recipeId, quality = 'common' }
      const { recipeId } = action.payload;

      // Validate recipe exists
      const recipe = RECIPES[recipeId];
      if (!recipe) {
        console.error(`[craftingSlice] Cannot craft unknown recipe '${recipeId}'`);
        return;
      }

      // Increment craft count for profession
      const profession = state.professions[recipe.professionId];
      if (profession) {
        profession.craftCount += 1;
      }

      // Note: XP gain, ingredient removal, and result item addition handled by caller
      // This reducer just tracks the craft count for statistics
    },

    recordGatheringCooldown(state, action) {
      // payload: { spotId, timestamp }
      const { spotId, timestamp } = action.payload;

      state.gatheringCooldowns[spotId] = timestamp;
    },

    resetProfession(state, action) {
      // payload: { professionId }
      const { professionId } = action.payload;

      if (state.professions[professionId]) {
        delete state.professions[professionId];
      }
    },

    discoverRecipe(state, action) {
      // payload: { professionId, recipeId, method }
      const { professionId, recipeId, method } = action.payload;

      // Validate recipe exists
      if (!RECIPES[recipeId]) {
        console.error(`[craftingSlice] discoverRecipe: unknown recipe '${recipeId}'`);
        return;
      }

      // Add to global discovered list (idempotent)
      if (!state.discoveredRecipes.includes(recipeId)) {
        state.discoveredRecipes.push(recipeId);
      }

      // Record discovery log (tracks method and source)
      if (!state.discoveredRecipeLog[recipeId]) {
        state.discoveredRecipeLog[recipeId] = {
          method,
          professionId,
          discoveredAt: Date.now(),
        };
      }
    },
  },
});

// ────────────────────────────────────────────────
// SELECTORS
// ────────────────────────────────────────────────

/**
 * Basic selectors
 */
export const selectProfessions = (state) => state.crafting.professions;
export const selectResources = (state) => state.crafting.resources;
export const selectDiscoveredRecipes = (state) => state.crafting.discoveredRecipes;
export const selectDiscoveredRecipeLog = (state) => state.crafting.discoveredRecipeLog;
export const selectGatheringCooldowns = (state) => state.crafting.gatheringCooldowns;

/**
 * Memoized selector: Get profession by key
 */
export const selectProfessionByKey = createSelector(
  [selectProfessions, (state, professionId) => professionId],
  (professions, professionId) => professions[professionId] || null
);

/**
 * Memoized selector: Get profession level
 */
export const selectProfessionLevel = createSelector(
  [selectProfessions, (state, professionId) => professionId],
  (professions, professionId) => {
    const profession = professions[professionId];
    return profession ? profession.level : 0;
  }
);

/**
 * Memoized selector: Get resource quantity by ID and quality
 */
export const selectResourceQuantity = createSelector(
  [selectResources, (state, resourceId, quality = 'common') => ({ resourceId, quality })],
  (resources, { resourceId, quality }) => {
    const resource = resources.find(
      r => r.resourceId === resourceId && r.quality === quality
    );
    return resource ? resource.quantity : 0;
  }
);

/**
 * Memoized selector: Get all unlocked recipes for a profession
 */
export const selectRecipesForProfession = createSelector(
  [selectProfessions, (state, professionId) => professionId],
  (professions, professionId) => {
    const profession = professions[professionId];
    return profession ? profession.recipesUnlocked : [];
  }
);

/**
 * Memoized selector: Get all learned profession IDs
 */
export const selectLearnedProfessions = createSelector(
  [selectProfessions],
  (professions) => Object.keys(professions)
);

/**
 * Memoized selector: Check if gathering spot is on cooldown
 */
export const selectIsGatheringSpotOnCooldown = createSelector(
  [selectGatheringCooldowns, (state, spotId, cooldownDuration) => ({ spotId, cooldownDuration })],
  (cooldowns, { spotId, cooldownDuration }) => {
    const lastGathered = cooldowns[spotId];
    if (!lastGathered) return false;

    const now = Date.now();
    const timeSince = now - lastGathered;
    return timeSince < cooldownDuration;
  }
);

/**
 * Memoized selector: Get all resources grouped by resourceId (sum all qualities)
 */
export const selectResourcesSummed = createSelector(
  [selectResources],
  (resources) => {
    const summed = {};
    resources.forEach(r => {
      if (!summed[r.resourceId]) {
        summed[r.resourceId] = 0;
      }
      summed[r.resourceId] += r.quantity;
    });
    return summed;
  }
);

/**
 * Memoized selector: Get profession mastery reputation bonus
 * Used by npcSlice for zone reputation calculations
 * Level 1-3: +1 reputation
 * Level 4-7: +2 reputation
 * Level 8-10: +5 reputation
 */
export const selectProfessionMasteryBonus = createSelector(
  [selectProfessions, (state, professionId) => professionId],
  (professions, professionId) => {
    const profession = professions[professionId];
    if (!profession) return 0;

    const level = profession.level;
    if (level >= 8) return 5;
    if (level >= 4) return 2;
    if (level >= 1) return 1;
    return 0;
  }
);

/**
 * Memoized selector: Count undiscovered recipes for a profession
 * (only counts recipes that have a discovery method defined)
 */
export const selectUndiscoveredRecipeCount = createSelector(
  [selectDiscoveredRecipes, (state, professionId) => professionId],
  (discoveredRecipes, professionId) => {
    const discoveredSet = new Set(discoveredRecipes);
    return Object.entries(RECIPE_DISCOVERY_METHODS).filter(([recipeId]) => {
      const recipe = RECIPES[recipeId];
      return recipe?.professionId === professionId && !discoveredSet.has(recipeId);
    }).length;
  }
);

/**
 * selectCraftableRecipes — filters all discovered recipes by vocabulary mastery.
 *
 * Returns only recipes where every ingredient's word is at >= 80% mastery
 * in the player's FSRS deck.
 *
 * vocabMasteryMap is derived from state.vocabulary.fsrsCards:
 *   { [wordId]: mastery 0-1 } where mastery = min(1, card.stability / 10)
 *
 * @param {object} state — full Redux state
 * @returns {string[]} array of craftable recipe IDs
 */
export const selectCraftableRecipes = createSelector(
  [
    selectDiscoveredRecipes,
    (state) => state.vocabulary?.fsrsCards ?? {},
  ],
  (discoveredRecipes, fsrsCards) => {
    // Build a mastery map: wordId → 0-1 score
    const vocabMasteryMap = {};
    for (const [wordId, entry] of Object.entries(fsrsCards)) {
      const reps = entry?.card?.reps ?? 0;
      const stability = entry?.card?.stability ?? 0;
      // Mastery = fraction of reps completed, capped at 1
      // Simple proxy: stability >= 10 → full mastery, else stability/10
      vocabMasteryMap[wordId] = Math.min(1, stability / 10);
      // Also count as mastered if reps >= 8 (reviewed many times)
      if (reps >= 8) vocabMasteryMap[wordId] = 1;
    }

    return discoveredRecipes.filter((recipeId) => {
      const recipe = RECIPES[recipeId];
      if (!recipe || !recipe.ingredients) return false;
      return recipe.ingredients.every(({ resourceId }) => {
        const resource = RESOURCES[resourceId];
        if (!resource?.wordId) return true; // no word requirement
        return (vocabMasteryMap[resource.wordId] ?? 0) >= 0.8;
      });
    });
  }
);

// ────────────────────────────────────────────────
// EXPORTS
// ────────────────────────────────────────────────

export const {
  learnProfession,
  addProfessionXP,
  levelUpProfession,
  unlockRecipe,
  addResource,
  removeResource,
  craftItem,
  recordGatheringCooldown,
  resetProfession,
  discoverRecipe,
} = craftingSlice.actions;

export default craftingSlice.reducer;
