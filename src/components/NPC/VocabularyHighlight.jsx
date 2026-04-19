import { useState } from 'react';
import vocabulary from '../../data/vocabularyAll.js';
import styles from './DialogueOverlay.module.css';

/**
 * VocabularyHighlight
 * Inline Arabic word highlight with hover/tap translation tooltip
 */
export default function VocabularyHighlight({ wordId, _arabicText, children }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const word = vocabulary.find((w) => w.id === wordId);
  if (!word) return children;

  return (
    <mark
      className={styles.vocabHighlight}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
      role="note"
      aria-label={`Vocabulary: ${word.english} (${word.transliteration})`}
    >
      {children}
      {showTooltip && (
        <span className={styles.vocabTooltip} aria-live="polite">
          <span className={styles.vocabTooltipEnglish}>{word.english}</span>
          {' '}
          <span className={styles.vocabTooltipTranslit}>({word.transliteration})</span>
        </span>
      )}
    </mark>
  );
}
