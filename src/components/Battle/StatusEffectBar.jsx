/**
 * StatusEffectBar.jsx — Displays active status effects during battle.
 *
 * Shows a horizontal RTL row of effect icons with Arabic names and remaining turns.
 * Buffs have gold borders, debuffs have red borders, compound effects have purple borders.
 * Tooltip on hover shows full effect info (Arabic, transliteration, English, description).
 * Framer Motion AnimatePresence for enter/exit animations. Respects prefers-reduced-motion.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusEffect, COMPOUND_EFFECTS } from '../../data/statusEffects.js';
import styles from './StatusEffectBar.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Set of compound effect IDs for quick lookup */
const COMPOUND_IDS = new Set(Object.keys(COMPOUND_EFFECTS));

/**
 * Determine visual category for an effect: 'compound', 'buff', or 'debuff'.
 */
function getEffectCategory(effectId, effectData) {
  if (COMPOUND_IDS.has(effectId)) return 'compound';
  return effectData?.type === 'buff' ? 'buff' : 'debuff';
}

/**
 * Look up effect data — checks STATUS_EFFECTS first, then COMPOUND_EFFECTS.
 */
function lookupEffect(effectId) {
  const statusEffect = getStatusEffect(effectId);
  if (statusEffect) return statusEffect;
  const compound = COMPOUND_EFFECTS[effectId];
  if (compound) {
    return {
      arabic: compound.arabic,
      transliteration: compound.transliteration,
      english: compound.english,
      type: 'compound',
      description: `Compound: ${compound.components.join(' + ')}`,
      turns: compound.turns,
    };
  }
  return null;
}

function EffectIcon({ effect }) {
  const [hovered, setHovered] = useState(false);
  const effectData = lookupEffect(effect.id);

  if (!effectData) return null;

  const category = getEffectCategory(effect.id, effectData);
  const iconClass = `${styles.effectIcon} ${styles[category]}`;

  // Truncate Arabic to first 2 chars for the 36x36 icon
  const shortArabic = effectData.arabic?.slice(0, 3) || '?';

  return (
    <motion.div
      className={iconClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      layout
      initial={reduceMotion ? { opacity: 1 } : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
      transition={
        reduceMotion
          ? { duration: 0.1 }
          : { type: 'spring', stiffness: 400, damping: 20 }
      }
    >
      <span className={styles.arabicLabel} lang="ar">
        {shortArabic}
      </span>
      <span className={styles.turnsRemaining}>
        {effect.remainingTurns}
      </span>

      {/* Tooltip on hover */}
      {hovered && (
        <div className={styles.tooltip}>
          <p className={styles.tooltipArabic} lang="ar">
            {effectData.arabic}
          </p>
          <p className={styles.tooltipTranslit}>
            {effectData.transliteration}
          </p>
          <p className={styles.tooltipEnglish}>
            {effectData.english}
          </p>
          <p className={styles.tooltipDesc}>
            {effectData.description}
          </p>
          <p className={styles.tooltipTurns}>
            {effect.remainingTurns} turn{effect.remainingTurns !== 1 ? 's' : ''} remaining
          </p>
        </div>
      )}
    </motion.div>
  );
}

/**
 * StatusEffectBar — Horizontal row of active status effect icons.
 *
 * @param {Object} props
 * @param {Array<{id: string, remainingTurns: number, source?: string}>} props.effects
 * @param {'player'|'enemy'} props.target - Determines positioning
 * @param {number} [props.maxVisible=5] - Max icons before overflow badge
 */
export default function StatusEffectBar({ effects, target, maxVisible = 5 }) {
  if (!effects || effects.length === 0) return null;

  const visibleEffects = effects.slice(0, maxVisible);
  const overflowCount = effects.length - maxVisible;

  return (
    <div className={`${styles.statusBar} ${styles[target] || ''}`}>
      <AnimatePresence mode="popLayout">
        {visibleEffects.map((effect) => (
          <EffectIcon key={effect.id} effect={effect} />
        ))}
      </AnimatePresence>

      {overflowCount > 0 && (
        <div className={styles.overflow}>
          +{overflowCount}
        </div>
      )}
    </div>
  );
}
