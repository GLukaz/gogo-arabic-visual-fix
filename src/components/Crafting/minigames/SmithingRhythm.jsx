/**
 * SmithingRhythm.jsx — Rhythm-based tapping mini-game with Arabic numerals
 *
 * Phase 31 Plan 05 - Player must tap in time with rhythm beats.
 * Accuracy based on timing precision within window.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { RECIPES } from '../../../data/recipes.js';
import styles from './SmithingRhythm.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Arabic numeral conversion
 */
const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function toArabicNumeral(num) {
  return String(num)
    .split('')
    .map((digit) => ARABIC_NUMERALS[parseInt(digit, 10)])
    .join('');
}

/**
 * Get difficulty settings based on profession level
 */
function getDifficultySettings(professionLevel) {
  if (professionLevel <= 3) {
    return {
      beatInterval: 1000, // 1 beat/second
      hitWindow: 300, // ms
      showVisualIndicator: true,
    };
  }
  if (professionLevel <= 7) {
    return {
      beatInterval: 666, // 1.5 beats/second
      hitWindow: 200, // ms
      showVisualIndicator: true,
    };
  }
  // Level 8-10
  return {
    beatInterval: 500, // 2 beats/second
    hitWindow: 100, // ms
    showVisualIndicator: false,
  };
}

/**
 * Get strike count from recipe (based on recipe XP gain as proxy)
 */
function getStrikeCount(recipeId) {
  const recipe = RECIPES[recipeId];
  if (!recipe) return 5;

  // Map XP to strike count (higher XP = more strikes)
  const xp = recipe.xpGain || 10;
  if (xp < 15) return 3;
  if (xp < 25) return 5;
  if (xp < 40) return 7;
  return 10;
}

/**
 * SmithingRhythm component
 */
export default function SmithingRhythm({ recipeId, professionLevel, onComplete, onCancel }) {
  const [difficulty, setDifficulty] = useState(null);
  const [strikeCount, setStrikeCount] = useState(0);
  const [currentStrike, setCurrentStrike] = useState(0);
  const [hits, setHits] = useState(0);
  const [phase, setPhase] = useState('ready'); // 'ready' | 'playing' | 'complete'
  const [pulseActive, setPulseActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null); // 'hit' | 'miss' | null

  const nextBeatTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const lastTapTimeRef = useRef(0);

  // Initialize difficulty and strike count
  useEffect(() => {
    const settings = getDifficultySettings(professionLevel);
    setDifficulty(settings);

    const strikes = getStrikeCount(recipeId);
    setStrikeCount(strikes);
  }, [professionLevel, recipeId]);

  /**
   * Start game
   */
  const handleStart = useCallback(() => {
    if (!difficulty) return;

    setPhase('playing');
    setCurrentStrike(0);
    setHits(0);
    nextBeatTimeRef.current = Date.now() + difficulty.beatInterval;

    // Start rhythm loop
    const loop = () => {
      const now = Date.now();

      // Check if it's time for next beat
      if (now >= nextBeatTimeRef.current) {
        // Trigger pulse
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 150);

        // Move to next strike
        setCurrentStrike((prev) => {
          const next = prev + 1;
          if (next >= strikeCount) {
            // Game complete
            setPhase('complete');
            return prev;
          }
          return next;
        });

        // Schedule next beat
        nextBeatTimeRef.current = now + difficulty.beatInterval;
      }

      // Continue loop if playing
      if (phase === 'playing') {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [difficulty, strikeCount, phase]);

  /**
   * Handle tap/click
   */
  const handleTap = useCallback(() => {
    if (phase !== 'playing' || !difficulty) return;

    const now = Date.now();

    // Prevent double-taps within 100ms
    if (now - lastTapTimeRef.current < 100) return;
    lastTapTimeRef.current = now;

    // Check if tap is within hit window
    const timeToBeat = nextBeatTimeRef.current - now;
    const isHit = Math.abs(timeToBeat) <= difficulty.hitWindow;

    if (isHit) {
      setHits((prev) => prev + 1);
      setShowFeedback('hit');
      EventBus.emit(EVENTS.SFX_CLICK);
    } else {
      setShowFeedback('miss');
    }

    // Clear feedback
    setTimeout(() => setShowFeedback(null), 300);
  }, [phase, difficulty]);

  /**
   * Handle keyboard input (Space/Enter)
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'ready') {
          handleStart();
        } else if (phase === 'playing') {
          handleTap();
        } else if (phase === 'complete') {
          handleFinish();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleStart, handleTap]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Handle completion
   */
  const handleFinish = useCallback(() => {
    const accuracy = hits / strikeCount;
    onComplete(accuracy);
  }, [hits, strikeCount, onComplete]);

  /**
   * Cleanup animation frame on unmount
   */
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  /**
   * Auto-finish when game completes
   */
  useEffect(() => {
    if (phase === 'complete') {
      setTimeout(() => handleFinish(), 1000);
    }
  }, [phase, handleFinish]);

  if (!difficulty) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <motion.div
      className={styles.container}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.3 }}
    >
      <h2 className={styles.title}>Rhythm Smithing</h2>

      {/* Recipe name */}
      <div className={styles.recipeName} lang="ar" dir="rtl">
        {RECIPES[recipeId]?.nameArabic || ''}
      </div>

      {/* Progress display */}
      <div className={styles.progress}>
        Strike {Math.min(currentStrike + 1, strikeCount)} / {strikeCount}
      </div>

      {/* Ready screen */}
      {phase === 'ready' && (
        <div className={styles.readyScreen}>
          <p className={styles.instructions}>Tap the anvil in rhythm with the beats!</p>
          <p className={styles.instructions}>
            Beat interval: {difficulty.beatInterval}ms | Window: ±{difficulty.hitWindow}ms
          </p>
          <button onClick={handleStart} className={styles.startButton}>
            Start
          </button>
        </div>
      )}

      {/* Playing screen */}
      {phase === 'playing' && (
        <div className={styles.gameArea}>
          {/* Arabic numeral display */}
          <div className={styles.numeralDisplay} lang="ar">
            {toArabicNumeral(currentStrike + 1)}
          </div>

          {/* Anvil zone */}
          <div
            className={`${styles.anvilZone} ${pulseActive ? styles.pulse : ''} ${
              showFeedback === 'hit' ? styles.hit : showFeedback === 'miss' ? styles.miss : ''
            }`}
            onClick={handleTap}
            onTouchStart={(e) => {
              e.preventDefault();
              handleTap();
            }}
          >
            <div className={styles.anvilIcon}>🔨</div>
            <p className={styles.tapLabel}>TAP</p>
          </div>

          {/* Visual indicator (pulsing ring) */}
          {difficulty.showVisualIndicator && (
            <div className={styles.timingIndicator}>
              <div className={`${styles.timingRing} ${pulseActive ? styles.ringPulse : ''}`} />
            </div>
          )}

          {/* Score display */}
          <div className={styles.scoreDisplay}>
            Hits: {hits} / {currentStrike}
          </div>
        </div>
      )}

      {/* Complete screen */}
      {phase === 'complete' && (
        <div className={styles.completeScreen}>
          <p className={styles.completeText}>Complete!</p>
          <p className={styles.scoreText}>
            Hits: {hits} / {strikeCount}
          </p>
          <p className={styles.accuracyText}>{Math.round((hits / strikeCount) * 100)}%</p>
        </div>
      )}

      {/* Cancel button */}
      {phase !== 'complete' && (
        <button onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
      )}
    </motion.div>
  );
}
