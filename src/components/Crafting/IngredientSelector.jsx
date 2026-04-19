import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectResources } from '../../store/slices/craftingSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { RECIPES } from '../../data/recipes.js';
import { RESOURCES } from '../../data/resources.js';
import {
  getDisplayableIngredients,
  hasRequiredResources,
} from '../../utils/craftingLogic.js';
import styles from './IngredientSelector.module.css';

/**
 * IngredientSelector component
 * Shows recipe ingredients with vocabulary gating and crafting action
 *
 * Features:
 * - Ingredient list with Arabic names (or '???' if locked)
 * - Quantity needed vs owned display
 * - Lock/check icons for each ingredient
 * - "Learn word" button for locked ingredients
 * - "Craft" button (disabled if ingredients locked or insufficient)
 * - Vocabulary-gated ingredient visibility
 *
 * @param {string} recipeId - Recipe ID to display ingredients for
 * @param {function} onCraftAttempt - Callback when craft button clicked
 */
function IngredientSelector({ recipeId, onCraftAttempt }) {
  const resources = useSelector(selectResources);
  const fsrsCards = useSelector((state) => state.vocabulary.fsrsCards);

  const recipe = RECIPES[recipeId];

  // Get displayable ingredients with vocabulary gating
  const displayableIngredients = useMemo(() => {
    if (!recipe) return [];
    return getDisplayableIngredients(recipeId, fsrsCards, RECIPES, RESOURCES);
  }, [recipeId, fsrsCards, recipe]);

  // Check if player has required resources
  const { canCraft, missing } = useMemo(() => {
    if (!recipe) return { canCraft: false, missing: [] };
    return hasRequiredResources(recipeId, resources, RECIPES);
  }, [recipeId, resources, recipe]);

  // Check if any ingredient is locked (vocabulary-gated)
  const hasLockedIngredients = useMemo(() => {
    return displayableIngredients.some((ing) => !ing.canUse);
  }, [displayableIngredients]);

  // Handle learn word click
  const handleLearnWord = (ingredient) => {
    const resource = RESOURCES[ingredient.resourceId];
    if (resource && resource.wordId) {
      // Emit event to open review session (will be handled by navigation system)
      EventBus.emit(EVENTS.REVIEW_SESSION_OPEN, { wordId: resource.wordId });
    }
  };

  // Handle craft click
  const handleCraft = () => {
    if (canCraft && !hasLockedIngredients) {
      onCraftAttempt?.(recipeId);
    }
  };

  if (!recipe) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No recipe selected</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Recipe header */}
      <div className={styles.header}>
        <div className={styles.recipeNameArabic}>{recipe.nameArabic}</div>
        <div className={styles.recipeNameEnglish}>{recipe.nameEnglish}</div>
      </div>

      {/* Ingredients list */}
      <div className={styles.ingredientsList}>
        <div className={styles.ingredientsTitle}>Required Ingredients</div>
        {displayableIngredients.map((ingredient) => {
          const resource = RESOURCES[ingredient.resourceId];
          const owned = resources.find(
            (r) => r.resourceId === ingredient.resourceId
          )?.quantity || 0;
          const needed = ingredient.quantity;
          const hasEnough = owned >= needed;

          return (
            <div
              key={ingredient.resourceId}
              className={`${styles.ingredient} ${
                ingredient.canUse ? styles.ingredientUnlocked : styles.ingredientLocked
              }`}
            >
              {/* Icon */}
              <div className={styles.ingredientIcon}>
                {ingredient.canUse ? (hasEnough ? '✓' : '⚠') : '🔒'}
              </div>

              {/* Name */}
              <div className={styles.ingredientNames}>
                <div className={styles.ingredientNameArabic}>
                  {ingredient.displayName}
                </div>
                {ingredient.canUse && resource && (
                  <div className={styles.ingredientNameEnglish}>
                    {resource.nameEnglish}
                  </div>
                )}
                {!ingredient.canUse && ingredient.hint && (
                  <div className={styles.ingredientHint}>{ingredient.hint}</div>
                )}
              </div>

              {/* Quantity */}
              <div className={styles.ingredientQuantity}>
                {ingredient.canUse ? (
                  <span className={hasEnough ? styles.quantityOk : styles.quantityLow}>
                    {owned} / {needed}
                  </span>
                ) : (
                  <span className={styles.quantityLocked}>? / {needed}</span>
                )}
              </div>

              {/* Learn button for locked ingredients */}
              {!ingredient.canUse && (
                <button
                  className={styles.learnButton}
                  onClick={() => handleLearnWord(ingredient)}
                  aria-label={`Learn word to unlock ${resource?.nameEnglish || 'ingredient'}`}
                >
                  Learn
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Result preview */}
      <div className={styles.resultSection}>
        <div className={styles.resultTitle}>Result</div>
        <div className={styles.result}>
          <div className={styles.resultIcon}>📦</div>
          <div className={styles.resultNames}>
            <div className={styles.resultNameArabic}>
              {recipe.result?.itemId || 'Unknown'}
            </div>
            <div className={styles.resultQuantity}>
              ×{recipe.result?.quantity || 1}
            </div>
          </div>
          <div className={styles.resultQuality}>
            {recipe.result?.quality || 'common'}
          </div>
        </div>
      </div>

      {/* XP gain */}
      <div className={styles.xpGain}>
        <span className={styles.xpLabel}>XP Gain:</span>
        <span className={styles.xpValue}>+{recipe.xpGain}</span>
      </div>

      {/* Craft button */}
      <div className={styles.actions}>
        <button
          className={styles.craftButton}
          onClick={handleCraft}
          disabled={!canCraft || hasLockedIngredients}
          aria-label="Craft item"
        >
          {hasLockedIngredients
            ? 'Learn Ingredients First'
            : !canCraft
            ? 'Insufficient Resources'
            : 'Craft'}
        </button>

        {/* Missing resources hint */}
        {!hasLockedIngredients && missing.length > 0 && (
          <div className={styles.missingHint}>
            Missing:{' '}
            {missing.map((m) => {
              const res = RESOURCES[m.resourceId];
              return res ? `${res.nameEnglish} (${m.shortfall})` : '';
            }).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientSelector;
