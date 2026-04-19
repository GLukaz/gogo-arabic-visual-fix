/**
 * RelationshipBar.jsx — Animated relationship progress bar with tier colors
 *
 * Shows 0-100 relationship progress with tier-based color gradients.
 * Displays Arabic + English tier labels.
 */

import { motion } from 'framer-motion';
import { getRelationshipTier } from '../../utils/companionRelationship.js';
import styles from './RelationshipBar.module.css';

const TIER_COLORS = {
  stranger: '#7F8C8D',       // Gray
  acquaintance: '#3498DB',   // Blue
  friend: '#2ECC71',         // Green
  closeFriend: '#9B59B6',    // Purple
  bestFriend: '#F1C40F',     // Gold
};

export default function RelationshipBar({ value, maxValue = 100, tier, showLabel = true, size = 'normal' }) {
  const tierData = tier || getRelationshipTier(value);
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const color = TIER_COLORS[Object.keys(TIER_COLORS).find(key =>
    tierData.label.toLowerCase().replace(' ', '') === key
  )] || TIER_COLORS.stranger;

  return (
    <div className={styles.wrapper}>
      {/* Progress bar container */}
      <div
        className={`${styles.barContainer} ${size === 'small' ? styles.barContainerSmall : styles.barContainerNormal}`}
        style={{ '--rel-color': color }}
      >
        {/* Filled portion */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className={styles.barFill}
        />

        {/* Value text overlay */}
        {size === 'normal' && (
          <div className={styles.valueText}>
            {Math.round(value)}/{maxValue}
          </div>
        )}
      </div>

      {/* Tier label */}
      {showLabel && (
        <div
          className={`${styles.tierLabel} ${size === 'small' ? styles.tierLabelSmall : styles.tierLabelNormal}`}
        >
          {tierData.label} / {tierData.labelArabic}
        </div>
      )}
    </div>
  );
}
