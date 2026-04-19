/**
 * CraftingMiniGame.jsx — Container/router for profession-specific mini-games
 *
 * Phase 31 Plan 05 - Routes to mini-game based on professionId,
 * handles completion callbacks with quality/XP/inventory dispatch.
 */

import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { calculateCraftQuality, calculateXPGain } from '../../utils/craftingLogic.js';
import { craftItem, addProfessionXP, removeResource } from '../../store/slices/craftingSlice.js';
import { addItem } from '../../store/slices/inventorySlice.js';
import { RECIPES } from '../../data/recipes.js';
import { PROFESSIONS } from '../../data/professions.js';

// Import mini-games
import CalligraphyTracing from './minigames/CalligraphyTracing.jsx';
import CookingRecipeOrder from './minigames/CookingRecipeOrder.jsx';
import SmithingRhythm from './minigames/SmithingRhythm.jsx';
import PlantIdentification from './minigames/PlantIdentification.jsx';
import PatternMatching from './minigames/PatternMatching.jsx';
import DirectionalPlacement from './minigames/DirectionalPlacement.jsx';

import styles from './CraftingMiniGame.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Map professionId to mini-game component
 */
const MINI_GAME_MAP = {
  calligrapher: CalligraphyTracing,
  cook: CookingRecipeOrder,
  blacksmith: SmithingRhythm,
  herbalist: PlantIdentification,
  weaver: PatternMatching,
  builder: DirectionalPlacement,
};

/**
 * Quality tier display colors (matches CRAFT-06 design)
 */
const QUALITY_COLORS = {
  common: '#888888',
  uncommon: '#44AA44',
  rare: '#4466CC',
  epic: '#AA44CC',
  legendary: '#FFAA00',
};

/**
 * CraftingMiniGame — Container component
 * Props: { professionId, recipeId, onComplete, onCancel }
 */
export default function CraftingMiniGame({ professionId, recipeId, onComplete, onCancel }) {
  const dispatch = useDispatch();
  const [phase, setPhase] = useState('playing'); // 'playing' | 'result'
  const [result, setResult] = useState(null); // { quality, accuracy, xpGained, itemId, itemQuantity }

  // Freeze player on mount, unfreeze on unmount
  useEffect(() => {
    EventBus.emit(EVENTS.PLAYER_FREEZE);
    return () => {
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    };
  }, []);

  // ESC key to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const professions = useSelector((state) => state.crafting.professions);
  const profession = professions[professionId];
  const professionLevel = profession ? profession.level : 0;

  const recipe = RECIPES[recipeId];
  const professionData = PROFESSIONS[professionId];

  // Get mini-game component for this profession
  const MiniGameComponent = MINI_GAME_MAP[professionId];

  /**
   * Handle mini-game completion
   */
  const handleMiniGameComplete = useCallback(
    (accuracy) => {
      if (!recipe) {
        console.error('[CraftingMiniGame] Invalid recipe:', recipeId);
        return;
      }

      // 1. Calculate quality based on accuracy
      const quality = calculateCraftQuality(accuracy);

      // 2. Calculate XP gain with accuracy multiplier
      const xpGained = calculateXPGain(recipe.xpGain, accuracy);

      // 3. Dispatch craftItem (increments craft count)
      dispatch(craftItem({ recipeId, quality }));

      // 4. Dispatch addProfessionXP
      dispatch(addProfessionXP({ professionId, xp: xpGained }));

      // 5. Remove consumed ingredients
      recipe.ingredients.forEach((ingredient) => {
        dispatch(
          removeResource({
            resourceId: ingredient.resourceId,
            quantity: ingredient.quantity,
            quality: 'common', // Ingredients are consumed from common quality
          })
        );
      });

      // 6. Add crafted item to inventory
      dispatch(
        addItem({
          itemId: recipe.result.itemId,
          quantity: recipe.result.quantity,
        })
      );

      // 7. Emit crafting events
      EventBus.emit(EVENTS.CRAFTING_ITEM_CRAFTED, {
        recipeId,
        quality,
        accuracy,
      });

      // 8. Emit SFX based on quality
      if (quality === 'legendary' || quality === 'epic') {
        EventBus.emit(EVENTS.SFX_LEVELUP);
      } else {
        EventBus.emit(EVENTS.SFX_CORRECT);
      }

      // 9. Store result and show result screen
      setResult({
        quality,
        accuracy,
        xpGained,
        itemId: recipe.result.itemId,
        itemQuantity: recipe.result.quantity,
      });
      setPhase('result');
    },
    [dispatch, professionId, recipe, recipeId]
  );

  /**
   * Handle result screen close
   */
  const handleResultClose = useCallback(() => {
    onComplete?.({
      quality: result.quality,
      accuracy: result.accuracy,
      xpGained: result.xpGained,
    });
  }, [onComplete, result]);

  if (!recipe || !professionData) {
    return (
      <div className={styles.errorContainer}>
        <p>Invalid recipe or profession</p>
        <button onClick={onCancel} className={styles.cancelButton}>
          Close
        </button>
      </div>
    );
  }

  // If mini-game not implemented yet (Plan 06)
  if (!MiniGameComponent) {
    return (
      <div className={styles.errorContainer}>
        <p>Mini-game for {professionData.nameEnglish} coming soon!</p>
        <button onClick={onCancel} className={styles.cancelButton}>
          Close
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.3 }}
    >
      {phase === 'playing' && (
        <MiniGameComponent
          recipeId={recipeId}
          professionLevel={professionLevel}
          onComplete={handleMiniGameComplete}
          onCancel={onCancel}
        />
      )}

      {phase === 'result' && result && (
        <motion.div
          className={styles.resultContainer}
          initial={reduceMotion ? { scale: 1 } : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.3 }}
        >
          <h2 className={styles.resultTitle}>Crafting Complete!</h2>

          {/* Quality badge */}
          <div
            className={styles.qualityBadge}
            style={{ borderColor: QUALITY_COLORS[result.quality] }}
          >
            <span
              className={styles.qualityText}
              style={{ color: QUALITY_COLORS[result.quality] }}
            >
              {result.quality.toUpperCase()}
            </span>
          </div>

          {/* Item crafted */}
          <div className={styles.itemCrafted}>
            <p className={styles.itemName} lang="ar" dir="rtl">
              {recipe.nameArabic}
            </p>
            <p className={styles.itemNameEn}>{recipe.nameEnglish}</p>
            <p className={styles.itemQuantity}>x{result.itemQuantity}</p>
          </div>

          {/* XP gained */}
          <div className={styles.xpGained}>
            <span className={styles.xpLabel}>XP Gained:</span>
            <span className={styles.xpValue}>+{result.xpGained}</span>
          </div>

          {/* Accuracy display */}
          <div className={styles.accuracy}>
            <span className={styles.accuracyLabel}>Accuracy:</span>
            <span className={styles.accuracyValue}>{Math.round(result.accuracy * 100)}%</span>
          </div>

          {/* Close button */}
          <button onClick={handleResultClose} className={styles.resultCloseButton}>
            Continue
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
