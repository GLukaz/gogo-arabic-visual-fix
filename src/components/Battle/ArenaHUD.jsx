/**
 * ArenaHUD.jsx — React overlay for arena wave-based combat mode (Phase 32).
 *
 * Displays wave counter, score, streak, timer, and bonus objectives.
 * All numbers rendered in Arabic-Indic numerals (٠-٩).
 * Listens to EventBus for wave lifecycle events and reads arenaSlice via useSelector.
 * Only renders when an arena session is active.
 *
 * Respects prefers-reduced-motion for animations.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './ArenaHUD.module.css';

// ──────────────────────────────────────────────────
// Arabic numeral conversion
// ──────────────────────────────────────────────────

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Convert a number to Arabic-Indic numeral string.
 * @param {number} num
 * @returns {string}
 */
function toArabicNumerals(num) {
  return String(num)
    .split('')
    .map((ch) => (ch >= '0' && ch <= '9' ? ARABIC_DIGITS[parseInt(ch, 10)] : ch))
    .join('');
}

// ──────────────────────────────────────────────────
// Bonus objective labels in Arabic
// ──────────────────────────────────────────────────

const BONUS_LABELS = {
  no_hints: 'بدون تلميحات',
  perfect_accuracy: 'دقة مثالية',
  speed_clear: 'تصفية سريعة',
};

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * ArenaHUD — Wave-based arena overlay with score, streak, and timer.
 *
 * Reads arena state from EventBus events (not Redux, since arenaSlice
 * is not yet registered in store.js — deferred to 32-11).
 */
export default function ArenaHUD() {
  const [arenaActive, setArenaActive] = useState(false);
  const [currentWave, setCurrentWave] = useState(0);
  const [maxWaves, setMaxWaves] = useState(10);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bonusObjective, setBonusObjective] = useState(null);
  const [waveTransition, setWaveTransition] = useState(false);
  const [arenaResult, setArenaResult] = useState(null);

  const timerRef = useRef(null);

  // ── Wave start handler ──
  const onWaveStart = useCallback((data) => {
    setArenaActive(true);
    setCurrentWave(data.wave);
    setMaxWaves(data.maxWaves || 10);
    setBonusObjective(data.bonusObjective || null);
    setWaveTransition(false);
    setArenaResult(null);

    // Start timer if wave has time limit
    if (data.timeLimit && data.timeLimit > 0) {
      setTimeLimit(data.timeLimit);
      setTimeRemaining(data.timeLimit);
    } else {
      setTimeLimit(0);
      setTimeRemaining(0);
    }
  }, []);

  // ── Wave complete handler ──
  const onWaveComplete = useCallback((data) => {
    setScore(data.totalScore);
    setStreak(data.streak);
    setWaveTransition(true);

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── Arena complete handler ──
  const onArenaComplete = useCallback((data) => {
    setArenaResult(data);
    setWaveTransition(false);

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── EventBus listeners ──
  useEffect(() => {
    EventBus.on(EVENTS.ARENA_WAVE_START, onWaveStart);
    EventBus.on(EVENTS.ARENA_WAVE_COMPLETE, onWaveComplete);
    EventBus.on(EVENTS.ARENA_COMPLETE, onArenaComplete);

    return () => {
      EventBus.off(EVENTS.ARENA_WAVE_START, onWaveStart);
      EventBus.off(EVENTS.ARENA_WAVE_COMPLETE, onWaveComplete);
      EventBus.off(EVENTS.ARENA_COMPLETE, onArenaComplete);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onWaveStart, onWaveComplete, onArenaComplete]);

  // ── Timer countdown ──
  useEffect(() => {
    if (timeLimit > 0 && timeRemaining > 0 && !waveTransition && !arenaResult) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1000));
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [timeLimit, timeRemaining, waveTransition, arenaResult]);

  // Don't render when inactive
  if (!arenaActive) return null;

  const timerPercent = timeLimit > 0 ? (timeRemaining / timeLimit) * 100 : 0;
  const timerSeconds = Math.ceil(timeRemaining / 1000);

  return (
    <div className={styles.arenaHud}>
      {/* Wave indicator — top center */}
      <div className={styles.waveIndicator} lang="ar">
        <span className={styles.waveLabel}>الموجة</span>{' '}
        <span className={styles.waveNumber}>
          {toArabicNumerals(currentWave)}
        </span>{' '}
        <span className={styles.waveOf}>من</span>{' '}
        <span className={styles.waveNumber}>
          {toArabicNumerals(maxWaves)}
        </span>
      </div>

      {/* Score display — top right */}
      <div className={styles.scoreDisplay}>
        <div className={styles.scoreValue} lang="ar">
          <span className={styles.scoreIcon}>&#9733;</span>{' '}
          {toArabicNumerals(score)}
        </div>

        {/* Streak — below score */}
        {streak > 0 && (
          <div className={styles.streakDisplay} lang="ar">
            <span className={styles.streakIcon}>&#128293;</span>{' '}
            <span>{'سلسلة: '}</span>
            {toArabicNumerals(streak)}
          </div>
        )}
      </div>

      {/* Timer bar — full width below wave indicator */}
      {timeLimit > 0 && (
        <div className={styles.timerBarContainer}>
          <motion.div
            className={`${styles.timerBar} ${timerPercent < 25 ? styles.timerCritical : ''}`}
            initial={false}
            animate={{ width: `${timerPercent}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5 }}
          />
          <span className={styles.timerText} lang="ar">
            {toArabicNumerals(timerSeconds)}
          </span>
        </div>
      )}

      {/* Bonus objective */}
      {bonusObjective && (
        <div className={styles.bonusObjective} lang="ar">
          {'هدف إضافي: '}
          {BONUS_LABELS[bonusObjective] || bonusObjective}
        </div>
      )}

      {/* Wave transition overlay — between waves */}
      <AnimatePresence>
        {waveTransition && !arenaResult && (
          <motion.div
            className={styles.waveTransition}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            <div className={styles.waveTransitionText} lang="ar">
              {'...الموجة التالية'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arena result overlay — on completion */}
      <AnimatePresence>
        {arenaResult && (
          <motion.div
            className={styles.arenaResult}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 20 }}
          >
            <div className={styles.resultContent}>
              {/* Victory / Defeat title */}
              <h2
                className={`${styles.resultTitle} ${arenaResult.victory ? styles.resultVictory : styles.resultDefeat}`}
                lang="ar"
              >
                {arenaResult.victory ? 'انتصار!' : 'هزيمة'}
              </h2>

              {/* Final score */}
              <div className={styles.resultRow} lang="ar">
                <span className={styles.resultLabel}>{'النتيجة'}</span>
                <span className={styles.resultValue}>
                  {toArabicNumerals(arenaResult.score)}
                </span>
              </div>

              {/* Waves completed */}
              <div className={styles.resultRow} lang="ar">
                <span className={styles.resultLabel}>{'الموجات'}</span>
                <span className={styles.resultValue}>
                  {toArabicNumerals(arenaResult.wavesCompleted)}
                </span>
              </div>

              {/* Average accuracy */}
              <div className={styles.resultRow} lang="ar">
                <span className={styles.resultLabel}>{'الدقة'}</span>
                <span className={styles.resultValue}>
                  {toArabicNumerals(Math.round((arenaResult.accuracy || 0) * 100))}%
                </span>
              </div>

              {/* Streak (victory only) */}
              {arenaResult.victory && arenaResult.streak > 0 && (
                <div className={styles.resultRow} lang="ar">
                  <span className={styles.resultLabel}>{'أفضل سلسلة'}</span>
                  <span className={styles.resultValue}>
                    {toArabicNumerals(arenaResult.streak)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
