/**
 * Crafting Logic - Pure business logic functions for crafting system
 * Phase 31 Plan 02 - TDD implementation
 *
 * Functions that need RECIPES/RESOURCES accept them as parameters for testability
 */

/**
 * Calculate craft quality tier based on mini-game accuracy
 * @param {number} accuracy - Accuracy score (0-1)
 * @returns {string} Quality tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
 */
export function calculateCraftQuality(accuracy) {
  if (accuracy >= 0.95) return 'legendary';
  if (accuracy > 0.80) return 'epic';
  if (accuracy > 0.60) return 'rare';
  if (accuracy > 0.40) return 'uncommon';
  return 'common';
}

/**
 * Calculate XP gain with accuracy-based multiplier
 * @param {number} baseXP - Base XP from recipe
 * @param {number} accuracy - Accuracy score (0-1)
 * @returns {number} Final XP (integer)
 */
export function calculateXPGain(baseXP, accuracy) {
  // Perfect bonus (≥0.95): 1.5x
  if (accuracy >= 0.95) return Math.floor(baseXP * 1.5);
  // Good bonus (≥0.80): 1.2x
  if (accuracy >= 0.80) return Math.floor(baseXP * 1.2);
  // Standard (≥0.60): 1.0x
  if (accuracy >= 0.60) return Math.floor(baseXP * 1.0);
  // Poor penalty (<0.60): 0.5x
  return Math.floor(baseXP * 0.5);
}

/**
 * Check if player can use ingredient (vocabulary-gated)
 * @param {string} resourceId - Resource ID to check
 * @param {object} fsrsCards - FSRS cards object
 * @param {object} RESOURCES - Resources data object (injected for testing)
 * @returns {boolean} True if resource unlocked and word reviewed
 */
export function canUseIngredient(resourceId, fsrsCards, RESOURCES = null) {
  // Check if resource exists
  if (!RESOURCES || !RESOURCES[resourceId]) {
    return false;
  }

  const resource = RESOURCES[resourceId];
  const wordId = resource.wordId;

  // Check if word is in FSRS and has been reviewed
  if (!fsrsCards[wordId] || !fsrsCards[wordId].card || fsrsCards[wordId].card.reps === 0) {
    return false;
  }

  return true;
}

/**
 * Get displayable ingredients with vocabulary gating
 * @param {string} recipeId - Recipe ID
 * @param {object} fsrsCards - FSRS cards object
 * @param {object} RECIPES - Recipes data object (injected for testing)
 * @param {object} RESOURCES - Resources data object (injected for testing)
 * @returns {array} Array of { resourceId, quantity, canUse, displayName, hint }
 */
export function getDisplayableIngredients(recipeId, fsrsCards, RECIPES = null, RESOURCES = null) {
  if (!RECIPES || !RECIPES[recipeId]) {
    return [];
  }

  const recipe = RECIPES[recipeId];
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return [];
  }

  return recipe.ingredients.map(ingredient => {
    const canUse = canUseIngredient(ingredient.resourceId, fsrsCards, RESOURCES);
    const resource = RESOURCES ? RESOURCES[ingredient.resourceId] : null;

    return {
      resourceId: ingredient.resourceId,
      quantity: ingredient.quantity,
      canUse,
      displayName: canUse && resource ? resource.nameArabic : '???',
      hint: canUse || !resource ? null : `Learn "${resource.nameEnglish}" to unlock`,
    };
  });
}

/**
 * Check if player has required resources for recipe
 * @param {string} recipeId - Recipe ID
 * @param {array} resources - Player's resource inventory
 * @param {object} RECIPES - Recipes data object (injected for testing)
 * @returns {object} { canCraft: boolean, missing: array }
 */
export function hasRequiredResources(recipeId, resources, RECIPES = null) {
  if (!RECIPES || !RECIPES[recipeId]) {
    return { canCraft: false, missing: [] };
  }

  const recipe = RECIPES[recipeId];
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return { canCraft: true, missing: [] };
  }

  // Build a map of player resources for quick lookup
  const resourceMap = {};
  resources.forEach(r => {
    resourceMap[r.resourceId] = r.quantity;
  });

  const missing = [];
  recipe.ingredients.forEach(ingredient => {
    const have = resourceMap[ingredient.resourceId] || 0;
    const needed = ingredient.quantity;

    if (have < needed) {
      missing.push({
        resourceId: ingredient.resourceId,
        needed,
        have,
        shortfall: needed - have,
      });
    }
  });

  return {
    canCraft: missing.length === 0,
    missing,
  };
}

/**
 * Calculate profession XP progress
 * @param {number} currentXP - Current XP amount
 * @param {number} currentLevel - Current profession level
 * @returns {object} { current, required, percent }
 */
export function calculateProfessionXP(currentXP, currentLevel) {
  // Level 0 requires 50 XP to reach level 1
  // Levels 1-10 require 100 XP × level
  const required = currentLevel === 0 ? 50 : currentLevel * 100;
  const percent = Math.floor((currentXP / required) * 100);

  return {
    current: currentXP,
    required,
    percent,
  };
}

/**
 * Calculate gathering quality based on profession level
 * @param {number} professionLevel - Current profession level (0-10)
 * @param {number} roll - Random roll value (0-1), uses Math.random() if not provided
 * @returns {string} Quality tier: 'normal' | 'high' | 'pristine' | 'perfect'
 */
export function calculateGatheringQuality(professionLevel, roll) {
  const randomValue = roll !== undefined ? roll : Math.random();

  // Level 0-2: 80% normal, 20% high
  if (professionLevel <= 2) {
    if (randomValue < 0.80) return 'normal';
    return 'high';
  }

  // Level 3-5: 60% normal, 30% high, 10% pristine
  if (professionLevel <= 5) {
    if (randomValue < 0.60) return 'normal';
    if (randomValue < 0.90) return 'high';
    return 'pristine';
  }

  // Level 6-8: 40% normal, 35% high, 20% pristine, 5% perfect
  if (professionLevel <= 8) {
    if (randomValue < 0.40) return 'normal';
    if (randomValue < 0.75) return 'high';
    if (randomValue < 0.95) return 'pristine';
    return 'perfect';
  }

  // Level 9-10: 20% normal, 30% high, 30% pristine, 20% perfect
  if (randomValue < 0.20) return 'normal';
  if (randomValue < 0.50) return 'high';
  if (randomValue < 0.80) return 'pristine';
  return 'perfect';
}

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulary-mastery gating (FEAT-008)
// ─────────────────────────────────────────────────────────────────────────────

const MASTERY_THRESHOLD = 0.8; // 80% mastery required

/**
 * Map of CEFR level → base XP multiplier for crafting.
 * Higher CEFR ingredients yield more XP.
 */
export const CEFR_XP_MULTIPLIER = { A1: 1, A2: 1.5, B1: 2, B2: 3 };

/**
 * Check if a player can use a crafting ingredient based on vocabulary mastery.
 *
 * vocabMasteryMap: { [wordId]: number } where number is 0–1 (mastery score).
 * A word qualifies if its mastery >= MASTERY_THRESHOLD (0.80).
 *
 * @param {string} ingredientId — resource ID (e.g. 'paper')
 * @param {object} vocabMasteryMap — { [wordId]: mastery 0-1 }
 * @param {object} RESOURCES — resources data map (injected for testability)
 * @returns {boolean}
 */
export function canUseIngredientByMastery(ingredientId, vocabMasteryMap, RESOURCES) {
  if (!RESOURCES || !RESOURCES[ingredientId]) return false;
  const wordId = RESOURCES[ingredientId].wordId;
  if (!wordId) return false;
  return (vocabMasteryMap[wordId] ?? 0) >= MASTERY_THRESHOLD;
}

/**
 * Check whether all ingredients in a recipe meet the 80%+ mastery requirement.
 *
 * @param {string} recipeId
 * @param {object} vocabMasteryMap — { [wordId]: mastery 0-1 }
 * @param {object} RECIPES — recipes data map (injected)
 * @param {object} RESOURCES — resources data map (injected)
 * @returns {boolean}
 */
export function isRecipeCraftableByMastery(recipeId, vocabMasteryMap, RECIPES, RESOURCES) {
  if (!RECIPES || !RECIPES[recipeId]) return false;
  const recipe = RECIPES[recipeId];
  if (!recipe.ingredients || recipe.ingredients.length === 0) return true;
  return recipe.ingredients.every(({ resourceId }) =>
    canUseIngredientByMastery(resourceId, vocabMasteryMap, RESOURCES)
  );
}

/**
 * Calculate crafting XP scaled to the average CEFR level of the recipe's
 * ingredient words.
 *
 * vocabData: array of { wordId, cefrLevel } entries.
 *
 * @param {number} baseXP
 * @param {string[]} wordIds — word IDs of all ingredients
 * @param {Array<{wordId: string, cefrLevel: string}>} vocabData
 * @returns {number} scaled XP (integer)
 */
export function calculateCefrScaledXP(baseXP, wordIds, vocabData) {
  if (!wordIds || wordIds.length === 0) return baseXP;

  const cefrMap = new Map((vocabData || []).map((v) => [v.wordId, v.cefrLevel]));

  let totalMultiplier = 0;
  let found = 0;

  for (const wordId of wordIds) {
    const cefr = cefrMap.get(wordId);
    const multiplier = CEFR_XP_MULTIPLIER[cefr] ?? 1;
    totalMultiplier += multiplier;
    found += 1;
  }

  const avg = found > 0 ? totalMultiplier / found : 1;
  return Math.round(baseXP * avg);
}
