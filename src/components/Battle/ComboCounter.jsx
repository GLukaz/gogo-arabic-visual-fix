/**
 * ComboCounter.jsx — Animated combo streak display during battle.
 *
 * Shows when streak >= 2. Tiers: normal (2), critical (3+), epic (5+), legendary (10+).
 * Spring animation on each increment. Arabic label "سلسلة" (chain/combo).
 */

import { motion, AnimatePresence } from 'framer-motion';
import styles from './ComboCounter.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TIER_CLASSES = {
  normal: 'tierNormal',
  critical: 'tierCritical',
  epic: 'tierEpic',
  legendary: 'tierLegendary',
};

const TIER_SIZE_CLASSES = {
  normal: 'comboNumberNormal',
  critical: 'comboNumberCritical',
  epic: 'comboNumberEpic',
  legendary: 'comboNumberLegendary',
};

function getTier(streak) {
  if (streak >= 10) return 'legendary';
  if (streak >= 5) return 'epic';
  if (streak >= 3) return 'critical';
  return 'normal';
}

export default function ComboCounter({ streak }) {
  if (streak < 2) return null;

  const tier = getTier(streak);
  const tierClass = TIER_CLASSES[tier];
  const sizeClass = TIER_SIZE_CLASSES[tier];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={streak}
        initial={reduceMotion ? { opacity: 1 } : { scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
        transition={
          reduceMotion
            ? { duration: 0.1 }
            : { type: 'spring', stiffness: 300, damping: 15 }
        }
        className={`${styles.comboWrapper} ${styles[tierClass]}`}
      >
        <div
          className={`${styles.comboNumber} ${styles[sizeClass]}`}
        >
          {streak}
        </div>
        <div
          className={styles.comboArabicLabel}
          lang="ar"
        >
          سلسلة
        </div>
        <div
          className={styles.comboEnglishLabel}
        >
          COMBO
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
