/**
 * FactionPanel.jsx — Displays all 6 faction reputation scores with tier progress bars (Phase 53)
 *
 * Shows each faction's:
 * - Icon + name (English + Arabic)
 * - 0-100 score with animated bar
 * - Tier label (Neutral/Friendly/Trusted/Allied/Revered in English + Arabic)
 *
 * Follows RelationshipBar.jsx pattern for animated bars.
 */

import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectFactionRanks } from '../../store/slices/factionSlice.js';
import { getFactionTier } from '../../data/factions.js';
import styles from './FactionPanel.module.css';

const TIER_COLORS = {
  Neutral:  '#7F8C8D',  // Gray
  Friendly: '#3498DB',  // Blue
  Trusted:  '#2ECC71',  // Green
  Allied:   '#9B59B6',  // Purple
  Revered:  '#F1C40F',  // Gold
};

function FactionBar({ faction, score }) {
  const tier = getFactionTier(score);
  const color = TIER_COLORS[tier.label] || TIER_COLORS.Neutral;
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div className={styles.factionBar} style={{ borderColor: `${color}33` }}>
      {/* Faction icon */}
      <span className={styles.factionIcon}>
        {faction.icon}
      </span>

      {/* Name + bar + tier */}
      <div className={styles.factionContent}>
        {/* Faction name */}
        <div className={styles.factionNameRow}>
          <span className={styles.factionName}>
            {faction.name}
          </span>
          <span className={styles.factionNameArabic}>
            {faction.nameArabic}
          </span>
        </div>

        {/* Progress bar */}
        <div className={styles.progressTrack} style={{ borderColor: `${color}55` }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className={styles.progressFill}
            style={{ background: `linear-gradient(90deg, ${color}dd, ${color})` }}
          />
          {/* Score text overlay */}
          <div className={styles.scoreOverlay}>
            {Math.round(score)}/100
          </div>
        </div>

        {/* Tier label */}
        <div className={styles.tierLabel} style={{ color }}>
          {tier.label} / {tier.labelArabic}
        </div>
      </div>
    </div>
  );
}

export default function FactionPanel({ onClose }) {
  const factionRanks = useSelector(selectFactionRanks);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={styles.panel}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            Faction Standing
          </h2>
          {onClose && (
            <button onClick={onClose} className={styles.closeBtn}>
              X
            </button>
          )}
        </div>

        {/* Faction list */}
        <div className={styles.factionList}>
          {factionRanks.map(({ faction, score }) => (
            <FactionBar key={faction.id} faction={faction} score={score} />
          ))}
        </div>

        {/* Tier legend */}
        <div className={styles.tierLegend}>
          {Object.entries(TIER_COLORS).map(([label, color]) => (
            <span key={label} className={styles.tierLegendItem} style={{ color }}>
              {label}
            </span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
