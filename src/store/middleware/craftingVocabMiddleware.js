/**
 * craftingVocabMiddleware.js — Auto-sync crafting vocabulary to FSRS
 *
 * When a recipe is unlocked, automatically add all ingredient vocabulary words
 * to the FSRS review queue if not already present. This ensures crafting-related
 * vocabulary integrates seamlessly with the spaced repetition system.
 *
 * Follows the same pattern as rootFsrsSyncMiddleware.js.
 */

import { RESOURCES } from '../../data/resources.js';
import { RECIPES } from '../../data/recipes.js';
import { addFsrsCard } from '../slices/vocabularySlice.js';

/**
 * Create a minimal FSRS-compatible card object for new words
 * @returns {Object} Default FSRS card
 */
function createDefaultCard() {
  return {
    due: new Date().toISOString(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
  };
}

export const craftingVocabMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Listen for recipe unlock action
  if (action.type === 'crafting/unlockRecipe') {
    const recipeId = action.payload?.recipeId;

    if (recipeId) {
      const recipe = RECIPES[recipeId];

      if (recipe && recipe.ingredients) {
        const state = store.getState();
        const fsrsCards = state.vocabulary?.fsrsCards || {};

        // For each ingredient, check if vocabulary word exists in FSRS
        recipe.ingredients.forEach(({ resourceId }) => {
          const resource = RESOURCES[resourceId];

          if (resource && resource.wordId) {
            const wordId = resource.wordId;

            // Only add if not already in FSRS system
            if (!fsrsCards[wordId]) {
              store.dispatch(
                addFsrsCard({
                  wordId,
                  card: createDefaultCard(),
                  source: 'crafting_recipe_unlock',
                })
              );
            }
          }
        });
      }
    }
  }

  return result;
};
