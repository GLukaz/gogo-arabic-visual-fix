/**
 * LoreEntryCard — Individual lore entry display card.
 * Phase 79 (NAR-04).
 */

import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { markRead } from '../../store/slices/loreSlice.js';
import styles from './LoreEntryCard.module.css';

const RARITY_COLORS = {
  common: '#AAAAAA',
  uncommon: '#2E8B57',
  rare: '#4A90D9',
  legendary: '#FFD700',
};

const RARITY_LABELS = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  legendary: 'Legendary',
};

function LoreEntryCard({ entry, meta, isNew }) {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    if (meta && !meta.read) {
      dispatch(markRead(entry.id));
    }
  }, [dispatch, entry.id, meta]);

  const rarityColor = RARITY_COLORS[entry.rarity] || RARITY_COLORS.common;

  return (
    <div
      className={`${styles.card} ${isNew ? styles.isNew : ''}`}
      style={{ borderColor: rarityColor }}
      onClick={handleClick}
      role="article"
      aria-label={entry.title}
    >
      <div className={styles.header}>
        <h3 className={styles.titleArabic} dir="rtl">{entry.titleArabic}</h3>
        <h4 className={styles.titleEnglish}>{entry.title}</h4>
        <span
          className={styles.rarityBadge}
          style={{ backgroundColor: rarityColor }}
        >
          {RARITY_LABELS[entry.rarity]}
        </span>
        {isNew && <span className={styles.newBadge}>NEW</span>}
      </div>

      <p className={styles.content}>{entry.content}</p>

      <p className={styles.contentArabic} dir="rtl">{entry.contentArabic}</p>

      <div className={styles.keyTerm}>
        <span className={styles.keyTermLabel}>Key Term:</span>
        <span className={styles.keyTermArabic} dir="rtl">{entry.keyTerm.arabic}</span>
        <span className={styles.keyTermTranslit}>({entry.keyTerm.transliteration})</span>
        <span className={styles.keyTermEnglish}>&mdash; {entry.keyTerm.english}</span>
      </div>

      {meta && (
        <div className={styles.discoveryInfo}>
          Discovered {new Date(meta.discoveredAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default memo(LoreEntryCard);
