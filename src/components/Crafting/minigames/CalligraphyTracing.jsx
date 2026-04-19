/**
 * CalligraphyTracing.jsx — Canvas-based Arabic letter tracing mini-game
 *
 * Phase 31 Plan 05 - Player draws Arabic letter on canvas,
 * accuracy calculated via pixel overlap comparison.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RECIPES } from '../../../data/recipes.js';
import styles from './CalligraphyTracing.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Get target letter from recipe (use first letter of Arabic name)
 */
function getTargetLetter(recipeId) {
  const recipe = RECIPES[recipeId];
  if (!recipe || !recipe.nameArabic) return 'ع'; // Default to 'ayn
  return recipe.nameArabic.charAt(0);
}

/**
 * Get difficulty settings based on profession level
 */
function getDifficultySettings(professionLevel) {
  if (professionLevel <= 3) {
    return {
      tolerance: 30, // pixels
      showOutline: true,
      attempts: 3,
      timeLimit: 30000, // 30 seconds
    };
  }
  if (professionLevel <= 7) {
    return {
      tolerance: 15,
      showOutline: true,
      attempts: 2,
      timeLimit: 20000, // 20 seconds
    };
  }
  // Level 8-10
  return {
    tolerance: 8,
    showOutline: false,
    attempts: 1,
    timeLimit: 15000, // 15 seconds
  };
}

/**
 * Calculate accuracy by comparing drawn pixels to target pixels
 */
function calculateDrawingAccuracy(drawnCanvas, targetCanvas, tolerance) {
  const drawnCtx = drawnCanvas.getContext('2d');
  const targetCtx = targetCanvas.getContext('2d');

  const drawnData = drawnCtx.getImageData(0, 0, drawnCanvas.width, drawnCanvas.height);
  const targetData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);

  let targetPixelCount = 0;
  let overlapPixelCount = 0;

  // Count target pixels (non-transparent pixels in target)
  for (let i = 3; i < targetData.data.length; i += 4) {
    if (targetData.data[i] > 50) {
      // Alpha > 50
      targetPixelCount++;
    }
  }

  if (targetPixelCount === 0) return 0;

  // For each target pixel, check if drawn pixel is nearby within tolerance
  for (let y = 0; y < targetCanvas.height; y++) {
    for (let x = 0; x < targetCanvas.width; x++) {
      const idx = (y * targetCanvas.width + x) * 4;
      const targetAlpha = targetData.data[idx + 3];

      if (targetAlpha > 50) {
        // Check if any drawn pixel exists within tolerance radius
        let foundMatch = false;
        for (let dy = -tolerance; dy <= tolerance && !foundMatch; dy++) {
          for (let dx = -tolerance; dx <= tolerance && !foundMatch; dx++) {
            const checkX = x + dx;
            const checkY = y + dy;
            if (checkX >= 0 && checkX < drawnCanvas.width && checkY >= 0 && checkY < drawnCanvas.height) {
              const checkIdx = (checkY * drawnCanvas.width + checkX) * 4;
              const drawnAlpha = drawnData.data[checkIdx + 3];
              if (drawnAlpha > 50) {
                foundMatch = true;
                overlapPixelCount++;
              }
            }
          }
        }
      }
    }
  }

  return overlapPixelCount / targetPixelCount;
}

/**
 * CalligraphyTracing component
 */
export default function CalligraphyTracing({ recipeId, professionLevel, onComplete, onCancel }) {
  const canvasRef = useRef(null);
  const targetCanvasRef = useRef(null); // Hidden canvas for target letter
  const [isDrawing, setIsDrawing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const [targetLetter, setTargetLetter] = useState('');

  const startTimeRef = useRef(null);
  const lastPointRef = useRef(null);

  // Initialize difficulty and target letter
  useEffect(() => {
    const settings = getDifficultySettings(professionLevel);
    setDifficulty(settings);
    setTimeRemaining(settings.timeLimit);
    setAttemptsLeft(settings.attempts);

    const letter = getTargetLetter(recipeId);
    setTargetLetter(letter);

    startTimeRef.current = Date.now();
  }, [professionLevel, recipeId]);

  // Draw target letter on hidden canvas
  useEffect(() => {
    if (!targetCanvasRef.current || !targetLetter) return;

    const canvas = targetCanvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888888';
    ctx.font = '200px Amiri';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(targetLetter, canvas.width / 2, canvas.height / 2);
  }, [targetLetter]);

  // Draw target outline on main canvas (if showOutline is true)
  useEffect(() => {
    if (!canvasRef.current || !difficulty || !targetLetter) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (difficulty.showOutline) {
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.lineWidth = 2;
      ctx.font = '200px Amiri';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(targetLetter, canvas.width / 2, canvas.height / 2);
    }
  }, [difficulty, targetLetter]);

  // Timer countdown
  useEffect(() => {
    if (!difficulty) return;

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
   * Handle drawing start
   */
  const handlePointerDown = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    lastPointRef.current = { x, y };
  }, []);

  /**
   * Handle drawing move
   */
  const handlePointerMove = useCallback(
    (e) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#44CC44';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (lastPointRef.current) {
        ctx.beginPath();
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      lastPointRef.current = { x, y };
    },
    [isDrawing]
  );

  /**
   * Handle drawing end
   */
  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  /**
   * Clear canvas
   */
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !difficulty || !targetLetter) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw outline if enabled
    if (difficulty.showOutline) {
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.lineWidth = 2;
      ctx.font = '200px Amiri';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(targetLetter, canvas.width / 2, canvas.height / 2);
    }
  }, [difficulty, targetLetter]);

  /**
   * Submit drawing
   */
  const handleSubmit = useCallback(() => {
    const canvas = canvasRef.current;
    const targetCanvas = targetCanvasRef.current;

    if (!canvas || !targetCanvas || !difficulty) return;

    const accuracy = calculateDrawingAccuracy(canvas, targetCanvas, difficulty.tolerance);

    // If accuracy is good enough or out of attempts, complete
    if (accuracy >= 0.6 || attemptsLeft <= 1) {
      onComplete(accuracy);
    } else {
      // Retry
      setAttemptsLeft((prev) => prev - 1);
      handleClear();
    }
  }, [difficulty, attemptsLeft, onComplete, handleClear]);

  /**
   * Handle timeout
   */
  const handleTimeout = useCallback(() => {
    const canvas = canvasRef.current;
    const targetCanvas = targetCanvasRef.current;

    if (!canvas || !targetCanvas || !difficulty) {
      onComplete(0);
      return;
    }

    const accuracy = calculateDrawingAccuracy(canvas, targetCanvas, difficulty.tolerance);
    onComplete(accuracy);
  }, [difficulty, onComplete]);

  if (!difficulty) {
    return <div className={styles.container}>Loading...</div>;
  }

  const timerPercent = (timeRemaining / difficulty.timeLimit) * 100;
  const timerColor = timerPercent > 50 ? '#44CC44' : timerPercent > 25 ? '#CCCC44' : '#CC4444';

  return (
    <motion.div
      className={styles.container}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.3 }}
    >
      <h2 className={styles.title}>Trace the Letter</h2>

      {/* Timer bar */}
      <div className={styles.timerBar}>
        <div
          className={styles.timerFill}
          style={{
            width: `${timerPercent}%`,
            background: timerColor,
          }}
        />
      </div>

      {/* Attempts display */}
      <div className={styles.attempts}>
        Attempts: {attemptsLeft}
      </div>

      {/* Target letter display (large) */}
      <div className={styles.targetLetter} lang="ar" dir="rtl">
        {targetLetter}
      </div>

      {/* Drawing canvas */}
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={400}
        height={400}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Hidden target canvas for comparison */}
      <canvas
        ref={targetCanvasRef}
        width={400}
        height={400}
        style={{ display: 'none' }}
      />

      {/* Controls */}
      <div className={styles.controls}>
        <button onClick={handleClear} className={styles.clearButton}>
          Clear
        </button>
        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit
        </button>
        <button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
