/**
 * ComboMeter.jsx — Vertical combo charge gauge with Arabic numerals.
 *
 * SEPARATE from ComboCounter.jsx (which shows streak count).
 * ComboMeter shows the combo charge gauge (0-100) that fills toward ultimate attacks.
 * Displays grammar combo type indicators (noun_adj, verb_chain, sentence).
 * At 100%, shows "!جاهز" (Ready!) with pulse animation.
 * Framer Motion spring animation on meter changes. Respects prefers-reduced-motion.
 */

import { motion } from 'framer-motion';
import styles from './ComboMeter.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Map Western digits to Arabic-Indic numerals */
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

/** Grammar combo type labels in Arabic */
const COMBO_TYPE_LABELS = {
  noun_adj: 'إضافة',
  verb_chain: 'تصريف',
  sentence: 'جملة',
};

/**
 * Get fill color tier class based on percentage.
 */
function getTierClass(percent) {
  if (percent >= 100) return styles.tierMax;
  if (percent >= 67) return styles.tierHigh;
  if (percent >= 34) return styles.tierMid;
  return styles.tierLow;
}

/**
 * ComboMeter — Vertical gauge bar showing combo charge with Arabic numerals.
 *
 * @param {Object} props
 * @param {number} props.comboMeter - Current combo charge (0-100)
 * @param {number} props.maxComboMeter - Maximum combo charge (default 100)
 * @param {Object|null} props.grammarComboState - { type, chain, multiplier } or null
 * @param {number} props.streak - Current answer streak
 */
export default function ComboMeter({ comboMeter = 0, maxComboMeter = 100, grammarComboState, streak }) {
  const percent = maxComboMeter > 0 ? Math.min(100, (comboMeter / maxComboMeter) * 100) : 0;
  const isReady = percent >= 100;
  const tierClass = getTierClass(percent);

  // Don't render if combo meter is at 0 and no combo state
  if (comboMeter === 0 && !grammarComboState && (!streak || streak < 1)) return null;

  return (
    <div className={styles.comboMeterContainer}>
      {/* Ready indicator at 100% */}
      {isReady && (
        <div className={`${styles.readyLabel} ${reduceMotion ? '' : styles.readyPulse}`}>
          <span lang="ar">{'جاهز!'}</span>
        </div>
      )}

      {/* Vertical gauge */}
      <div className={styles.gauge}>
        <motion.div
          className={`${styles.gaugeFill} ${tierClass}`}
          initial={false}
          animate={{ height: `${percent}%` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 200, damping: 20 }
          }
        />
      </div>

      {/* Arabic numeral charge display */}
      <div className={styles.chargeLabel} lang="ar">
        {toArabicNumerals(Math.round(comboMeter))}
      </div>

      {/* Grammar combo type indicator */}
      {grammarComboState && (
        <div className={styles.comboTypeIndicator}>
          <div className={styles.comboTypeLabel} lang="ar">
            {COMBO_TYPE_LABELS[grammarComboState.type] || grammarComboState.type}
          </div>
          {/* Chain count for verb chains */}
          {grammarComboState.type === 'verb_chain' && grammarComboState.chain && (
            <div className={styles.comboChainCount}>
              {grammarComboState.chain.length} chain
            </div>
          )}
          {/* Filled slots for sentence combos */}
          {grammarComboState.type === 'sentence' && grammarComboState.chain && (
            <div className={styles.comboChainCount}>
              {grammarComboState.chain.length} filled
            </div>
          )}
        </div>
      )}
    </div>
  );
}
