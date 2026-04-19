/**
 * BossRushInterlude.jsx — Story interlude overlay between boss rush fights.
 *
 * Displays Arabic narrative text (Amiri font) with English translation below.
 * Shows next boss name/info. Auto-advances after 5 seconds or on button click.
 * Framer Motion fade in/out, respects prefers-reduced-motion.
 *
 * Listens to BOSS_RUSH_INTERLUDE event from BossRushController.
 * Emits BOSS_RUSH_CONTINUE when player dismisses.
 *
 * Phase 32 — Plan 32-08
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './BossRushInterlude.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const AUTO_ADVANCE_MS = 5000;

/**
 * Map Western digits to Arabic-Indic numerals.
 */
const ARABIC_DIGITS = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];

function toArabicNumerals(num) {
  return String(num)
    .split('')
    .map((ch) => (ch >= '0' && ch <= '9' ? ARABIC_DIGITS[parseInt(ch, 10)] : ch))
    .join('');
}

export default function BossRushInterlude() {
  const [interludeData, setInterludeData] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const onInterlude = (data) => {
      setInterludeData(data);
    };

    EventBus.on(EVENTS.BOSS_RUSH_INTERLUDE, onInterlude);

    return () => {
      EventBus.off(EVENTS.BOSS_RUSH_INTERLUDE, onInterlude);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (!interludeData) return;

    timerRef.current = setTimeout(() => {
      handleContinue();
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [interludeData]);

  const handleContinue = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setInterludeData(null);
    EventBus.emit(EVENTS.BOSS_RUSH_CONTINUE);
  }, []);

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4 },
      };

  return (
    <AnimatePresence>
      {interludeData && (
        <motion.div
          className={styles.interludeOverlay}
          {...motionProps}
          key="boss-rush-interlude"
        >
          <div className={styles.storyPanel}>
            {/* Progress indicator */}
            <div className={styles.progressBar}>
              <span className={styles.progressText}>
                Boss {toArabicNumerals(interludeData.bossIndex + 1)} / {toArabicNumerals(interludeData.totalBosses)}
              </span>
            </div>

            {/* Arabic narrative text */}
            <div className={styles.arabicNarrative} lang="ar" dir="rtl">
              {interludeData.interlude.arabic}
            </div>

            {/* English translation */}
            <div className={styles.englishTranslation}>
              {interludeData.interlude.english}
            </div>

            {/* Next boss preview */}
            {interludeData.nextBossData && (
              <div className={styles.nextBossPreview}>
                <div className={styles.nextBossLabel}>Next Opponent</div>
                <div className={styles.nextBossName} lang="ar" dir="rtl">
                  {interludeData.nextBossData.nameArabic}
                </div>
                <div className={styles.nextBossNameEn}>
                  {interludeData.nextBossData.name}
                </div>
                {interludeData.nextBossData.element && (
                  <div className={styles.nextBossElement}>
                    {interludeData.nextBossData.element}
                  </div>
                )}
              </div>
            )}

            {/* Continue button */}
            <button
              className={styles.continueButton}
              onClick={handleContinue}
              type="button"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
