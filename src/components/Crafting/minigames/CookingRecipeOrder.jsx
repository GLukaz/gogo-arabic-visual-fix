/**
 * CookingRecipeOrder.jsx — Ingredient sequence ordering mini-game
 *
 * Phase 31 Plan 05 - Player must click/tap ingredients in the correct order.
 * Accuracy based on first-try correct selections.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RECIPES } from '../../../data/recipes.js';
import { RESOURCES } from '../../../data/resources.js';
import styles from './CookingRecipeOrder.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get difficulty settings based on profession level
 */
function getDifficultySettings(professionLevel) {
  if (professionLevel <= 3) {
    return {
      showEnglish: true,
      timeLimit: 0, // unlimited
      maxIngredients: 4,
    };
  }
  if (professionLevel <= 7) {
    return {
      showEnglish: false,
      timeLimit: 45000, // 45 seconds
      maxIngredients: 6,
    };
  }
  // Level 8-10
  return {
    showEnglish: false,
    timeLimit: 30000, // 30 seconds
    maxIngredients: 8,
  };
}

/**
 * CookingRecipeOrder component
 */
export default function CookingRecipeOrder({ recipeId, professionLevel, onComplete, onCancel }) {
  const [difficulty, setDifficulty] = useState(null);
  const [ingredients, setIngredients] = useState([]); // Shuffled ingredients
  const [correctOrder, setCorrectOrder] = useState([]); // Original order from recipe
  const [selectedIngredients, setSelectedIngredients] = useState([]); // Player selections
  const [incorrectAttempts, setIncorrectAttempts] = useState([]); // Track wrong attempts per ingredient
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [flashState, setFlashState] = useState(null); // { ingredientId, type: 'correct' | 'incorrect' }

  const startTimeRef = useState(Date.now())[0];

  // Initialize difficulty and ingredients
  useEffect(() => {
    const settings = getDifficultySettings(professionLevel);
    setDifficulty(settings);
    setTimeRemaining(settings.timeLimit);

    const recipe = RECIPES[recipeId];
    if (!recipe || !recipe.ingredients) {
      console.error('[CookingRecipeOrder] Invalid recipe:', recipeId);
      return;
    }

    // Get up to maxIngredients (limit by difficulty)
    const recipeIngredients = recipe.ingredients.slice(0, settings.maxIngredients);

    // Map to ingredient data
    const ingredientData = recipeIngredients.map((ing, index) => {
      const resource = RESOURCES[ing.resourceId];
      return {
        id: ing.resourceId,
        nameArabic: resource?.nameArabic || '???',
        nameEnglish: resource?.nameEnglish || 'Unknown',
        correctIndex: index,
      };
    });

    setCorrectOrder(ingredientData);
    setIngredients(shuffleArray(ingredientData));
    setIncorrectAttempts(new Array(ingredientData.length).fill(0));
  }, [professionLevel, recipeId]);

  // Timer countdown
  useEffect(() => {
    if (!difficulty || difficulty.timeLimit === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Handle ingredient selection
   */
  const handleIngredientClick = useCallback(
    (ingredient) => {
      const currentStep = selectedIngredients.length;
      const expectedIngredient = correctOrder[currentStep];

      if (ingredient.id === expectedIngredient.id) {
        // Correct!
        setSelectedIngredients((prev) => [...prev, ingredient]);
        setFlashState({ ingredientId: ingredient.id, type: 'correct' });

        // Clear flash after animation
        setTimeout(() => setFlashState(null), 400);

        // Check if completed
        if (currentStep + 1 === correctOrder.length) {
          // All correct, calculate accuracy
          setTimeout(() => {
            handleCompletion();
          }, 600);
        }
      } else {
        // Incorrect!
        setIncorrectAttempts((prev) => {
          const updated = [...prev];
          updated[currentStep] = (updated[currentStep] || 0) + 1;
          return updated;
        });
        setFlashState({ ingredientId: ingredient.id, type: 'incorrect' });

        // Clear flash after animation
        setTimeout(() => setFlashState(null), 400);
      }
    },
    [selectedIngredients, correctOrder]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Calculate accuracy and complete
   */
  const handleCompletion = useCallback(() => {
    // Accuracy = (correct_first_try_count / total_ingredients)
    const correctFirstTry = incorrectAttempts.filter((count) => count === 0).length;
    const accuracy = correctFirstTry / correctOrder.length;

    onComplete(accuracy);
  }, [incorrectAttempts, correctOrder, onComplete]);

  /**
   * Handle timeout
   */
  const handleTimeout = useCallback(() => {
    // Calculate partial accuracy based on correct selections
    const correctCount = selectedIngredients.length;
    const correctFirstTry = incorrectAttempts.slice(0, correctCount).filter((count) => count === 0)
      .length;
    const accuracy = Math.max(0, correctFirstTry / correctOrder.length);

    onComplete(accuracy);
  }, [selectedIngredients, incorrectAttempts, correctOrder, onComplete]);

  if (!difficulty || ingredients.length === 0) {
    return <div className={styles.container}>Loading...</div>;
  }

  const timerPercent = difficulty.timeLimit > 0 ? (timeRemaining / difficulty.timeLimit) * 100 : 100;
  const timerColor = timerPercent > 50 ? '#44CC44' : timerPercent > 25 ? '#CCCC44' : '#CC4444';

  return (
    <motion.div
      className={styles.container}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.3 }}
    >
      <h2 className={styles.title}>Order the Ingredients</h2>

      {/* Timer bar (if timed) */}
      {difficulty.timeLimit > 0 && (
        <div className={styles.timerBar}>
          <div
            className={styles.timerFill}
            style={{
              width: `${timerPercent}%`,
              background: timerColor,
            }}
          />
        </div>
      )}

      {/* Progress display */}
      <div className={styles.progress}>
        Step {selectedIngredients.length + 1} of {correctOrder.length}
      </div>

      {/* Recipe name */}
      <div className={styles.recipeName} lang="ar" dir="rtl">
        {RECIPES[recipeId]?.nameArabic || ''}
      </div>

      <div className={styles.gameArea}>
        {/* Ingredient cards (left side) */}
        <div className={styles.ingredientList}>
          <AnimatePresence>
            {ingredients.map((ingredient) => {
              const isSelected = selectedIngredients.some((ing) => ing.id === ingredient.id);
              const isFlashing = flashState?.ingredientId === ingredient.id;
              const flashType = flashState?.type;

              if (isSelected && !isFlashing) return null;

              return (
                <motion.button
                  key={ingredient.id}
                  className={`${styles.ingredientCard} ${
                    isFlashing
                      ? flashType === 'correct'
                        ? styles.flashCorrect
                        : styles.flashIncorrect
                      : ''
                  }`}
                  onClick={() => handleIngredientClick(ingredient)}
                  initial={reduceMotion ? {} : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={reduceMotion ? {} : { scale: 0.8, opacity: 0, x: 200 }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.3 }}
                  disabled={isFlashing}
                >
                  <p className={styles.ingredientArabic} lang="ar" dir="rtl">
                    {ingredient.nameArabic}
                  </p>
                  {difficulty.showEnglish && (
                    <p className={styles.ingredientEnglish}>{ingredient.nameEnglish}</p>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bowl/Pot area (right side) */}
        <div className={styles.bowlArea}>
          <div className={styles.bowlIcon}>🍲</div>
          <p className={styles.bowlLabel}>Cooking Pot</p>
          <div className={styles.selectedList}>
            {selectedIngredients.map((ing, idx) => (
              <motion.div
                key={`${ing.id}-${idx}`}
                className={styles.selectedIngredient}
                initial={reduceMotion ? {} : { opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
              >
                {idx + 1}. {ing.nameArabic}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel button */}
      <button onClick={onCancel} className={styles.cancelButton}>
        Cancel
      </button>
    </motion.div>
  );
}
