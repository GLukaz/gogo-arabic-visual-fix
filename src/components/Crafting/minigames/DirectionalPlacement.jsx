/**
 * DirectionalPlacement.jsx — Builder mini-game
 *
 * Spatial direction mini-game using Arabic directional vocabulary.
 * Player places building materials on a grid based on Arabic instructions.
 * Difficulty scales with profession level.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RESOURCES } from '../../../data/resources.js';
import { RECIPES } from '../../../data/recipes.js';
import styles from './DirectionalPlacement.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Arabic directional words
const DIRECTIONS = {
  above: { arabic: 'فوق', english: 'above', rowOffset: -1, colOffset: 0 },
  below: { arabic: 'تحت', english: 'below', rowOffset: 1, colOffset: 0 },
  right: { arabic: 'يمين', english: 'right', rowOffset: 0, colOffset: 1 },
  left: { arabic: 'يسار', english: 'left', rowOffset: 0, colOffset: -1 },
  front: { arabic: 'أمام', english: 'front', rowOffset: -1, colOffset: 0 },
  behind: { arabic: 'وراء', english: 'behind', rowOffset: 1, colOffset: 0 },
  beside: { arabic: 'بجانب', english: 'beside', rowOffset: 0, colOffset: 1 },
  middle: { arabic: 'وسط', english: 'middle', rowOffset: 0, colOffset: 0 },
};

// Building elements (pre-filled cells)
const BUILDING_ELEMENTS = {
  door: { arabic: 'باب', english: 'door', icon: '🚪' },
  window: { arabic: 'نافذة', english: 'window', icon: '🪟' },
  wall: { arabic: 'جدار', english: 'wall', icon: '🧱' },
};

/**
 * Generate blueprint with pre-filled elements
 */
function generateBlueprint() {
  const gridSize = 5;
  const blueprint = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  // Place door at center bottom
  blueprint[3][2] = { type: 'door', element: BUILDING_ELEMENTS.door };

  // Place windows
  blueprint[1][1] = { type: 'window', element: BUILDING_ELEMENTS.window };
  blueprint[1][3] = { type: 'window', element: BUILDING_ELEMENTS.window };

  // Place wall
  blueprint[4][2] = { type: 'wall', element: BUILDING_ELEMENTS.wall };

  return { blueprint, gridSize };
}

/**
 * Generate placement tasks from recipe ingredients
 */
function generateTasks(recipeId, professionLevel, recipes = RECIPES, resources = RESOURCES) {
  const recipe = recipes[recipeId];
  if (!recipe || !recipe.ingredients) return [];

  // Get building material ingredients
  const materials = recipe.ingredients
    .map((ing) => resources[ing.resourceId])
    .filter((res) => res && res.professions?.includes('builder'));

  if (materials.length === 0) {
    // Fallback to generic materials
    const fallbackMaterials = [
      { nameArabic: 'حجر', nameEnglish: 'Stone' },
      { nameArabic: 'خشب', nameEnglish: 'Wood' },
      { nameArabic: 'طوب', nameEnglish: 'Brick' },
    ];
    materials.push(...fallbackMaterials.slice(0, 3));
  }

  // Determine difficulty settings
  let showEnglish = true;
  let hasTimer = false;
  let useCompoundDirections = false;

  if (professionLevel >= 8) {
    showEnglish = false;
    hasTimer = true;
    useCompoundDirections = true;
  } else if (professionLevel >= 4) {
    showEnglish = false;
    useCompoundDirections = true;
  }

  // Generate tasks
  const tasks = [];
  const { blueprint } = generateBlueprint();

  // Find all pre-filled cells
  const prefilledCells = [];
  for (let row = 0; row < blueprint.length; row++) {
    for (let col = 0; col < blueprint[row].length; col++) {
      if (blueprint[row][col]) {
        prefilledCells.push({ row, col, element: blueprint[row][col] });
      }
    }
  }

  // Generate placement tasks
  const numTasks = Math.min(materials.length, 6);
  for (let i = 0; i < numTasks; i++) {
    const material = materials[i % materials.length];
    const reference = prefilledCells[i % prefilledCells.length];

    // Choose direction
    const directionKeys = useCompoundDirections
      ? ['above', 'below', 'right', 'left', 'beside']
      : ['above', 'below', 'right', 'left'];
    const directionKey = directionKeys[i % directionKeys.length];
    const direction = DIRECTIONS[directionKey];

    // Calculate target position
    const targetRow = reference.row + direction.rowOffset;
    const targetCol = reference.col + direction.colOffset;

    // Ensure target is within bounds and not pre-filled
    if (
      targetRow >= 0 &&
      targetRow < 5 &&
      targetCol >= 0 &&
      targetCol < 5 &&
      !blueprint[targetRow][targetCol]
    ) {
      tasks.push({
        id: i,
        materialArabic: material.nameArabic,
        materialEnglish: showEnglish ? material.nameEnglish : null,
        directionArabic: direction.arabic,
        directionEnglish: showEnglish ? direction.english : null,
        referenceArabic: reference.element.element.arabic,
        referenceEnglish: showEnglish ? reference.element.element.english : null,
        targetRow,
        targetCol,
        hasTimer,
        timeLimit: hasTimer ? 15000 : null,
      });
    }
  }

  return tasks;
}

export default function DirectionalPlacement({ recipeId, professionLevel, onComplete }) {
  const [blueprint, setBlueprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerPlacements, setPlayerPlacements] = useState([]);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Initialize blueprint and tasks
  useEffect(() => {
    if (!recipeId) return;

    const { blueprint: bp } = generateBlueprint();
    const taskList = generateTasks(recipeId, professionLevel);

    setBlueprint(bp);
    setTasks(taskList);
    setCurrentIndex(0);
    setPlayerPlacements([]);
    setScore({ correct: 0, incorrect: 0 });
    setFeedback(null);
    setIsComplete(false);

    if (taskList.length > 0 && taskList[0].hasTimer) {
      setTimeRemaining(taskList[0].timeLimit);
    }
  }, [recipeId, professionLevel]);

  const currentTask = tasks[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (!currentTask || !currentTask.hasTimer || isComplete || feedback) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          // Time's up - mark as incorrect
          handlePlacement(null, null, true);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentTask, isComplete, feedback]);

  const handlePlacement = useCallback(
    (row, col, isTimeout = false) => {
      if (!currentTask || feedback) return;

      const isCorrect = !isTimeout && row === currentTask.targetRow && col === currentTask.targetCol;

      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      }));

      setPlayerPlacements((prev) => [
        ...prev,
        {
          taskId: currentTask.id,
          row,
          col,
          isCorrect,
          targetRow: currentTask.targetRow,
          targetCol: currentTask.targetCol,
        },
      ]);

      setFeedback({
        isCorrect,
        isTimeout,
        targetRow: currentTask.targetRow,
        targetCol: currentTask.targetCol,
      });

      // Move to next task after delay
      setTimeout(() => {
        if (currentIndex < tasks.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setFeedback(null);
          if (tasks[currentIndex + 1]?.hasTimer) {
            setTimeRemaining(tasks[currentIndex + 1].timeLimit);
          }
        } else {
          // Quiz complete
          setIsComplete(true);
          const totalTasks = tasks.length;
          const accuracy = Math.max(
            0,
            (score.correct + (isCorrect ? 1 : 0) - 0.5 * (score.incorrect + (isCorrect ? 0 : 1))) /
              totalTasks
          );
          onComplete?.(accuracy);
        }
      }, 2000);
    },
    [currentTask, currentIndex, feedback, tasks, score, onComplete]
  );

  if (!blueprint || !currentTask || isComplete) {
    return null;
  }

  const progressPercent = ((currentIndex + 1) / tasks.length) * 100;
  const timerPercent = currentTask.hasTimer ? (timeRemaining / currentTask.timeLimit) * 100 : 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
        </div>
        <div className={styles.taskCount}>
          <span className={styles.arabic}>
            مهمة {currentIndex + 1} / {tasks.length}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className={styles.gameCard}
          initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? {} : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.instruction}>
            <span className={styles.instructionArabic}>
              ضع {currentTask.materialArabic} {currentTask.directionArabic} {currentTask.referenceArabic}
            </span>
            {currentTask.materialEnglish && (
              <span className={styles.instructionEnglish}>
                Place {currentTask.materialEnglish} {currentTask.directionEnglish} the{' '}
                {currentTask.referenceEnglish}
              </span>
            )}
          </div>

          {currentTask.hasTimer && (
            <div className={styles.timer}>
              <div className={styles.timerBar} style={{ width: `${timerPercent}%` }} />
              <span className={styles.timerText}>{Math.ceil(timeRemaining / 1000)}s</span>
            </div>
          )}

          <div className={styles.blueprintContainer}>
            <div className={styles.grid}>
              {blueprint.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isPrefilled = !!cell;
                  const isTarget = feedback && rowIndex === feedback.targetRow && colIndex === feedback.targetCol;
                  const placement = playerPlacements.find(
                    (p) => p.row === rowIndex && p.col === colIndex
                  );

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`${styles.cell} ${isPrefilled ? styles.cellPrefilled : styles.cellEmpty} ${isTarget ? styles.cellTarget : ''} ${placement ? (placement.isCorrect ? styles.cellCorrect : styles.cellIncorrect) : ''}`}
                      onClick={() => !isPrefilled && handlePlacement(rowIndex, colIndex)}
                      onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                      onMouseLeave={() => setHoveredCell(null)}
                      disabled={isPrefilled || !!feedback}
                    >
                      {isPrefilled ? (
                        <span className={styles.elementIcon}>{cell.element.icon}</span>
                      ) : placement ? (
                        <span className={styles.materialIcon}>📦</span>
                      ) : (
                        <span className={styles.emptyIcon}>·</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {hoveredCell && blueprint[hoveredCell.row][hoveredCell.col] && (
              <div className={styles.cellHint}>
                {blueprint[hoveredCell.row][hoveredCell.col].element.arabic}
              </div>
            )}
          </div>

          {feedback && (
            <motion.div
              className={`${styles.feedback} ${feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {feedback.isTimeout ? (
                <span>انتهى الوقت!</span>
              ) : feedback.isCorrect ? (
                <span>صحيح!</span>
              ) : (
                <span>خطأ! الموقع الصحيح مميز</span>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
