/**
 * VocabTooltip.jsx
 *
 * Small popup on tap/hover showing vocabulary details for highlighted
 * words in reading passages. Shows Arabic word, transliteration,
 * English meaning, and an "Add to review" button.
 *
 * Phase 82 (READ-01 + READ-02)
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './VocabTooltip.module.css';

/**
 * VocabTooltip
 * @param {{ vocab: { wordId: string, arabic: string, english: string, transliteration: string }, children: React.ReactNode }} props
 */
export default function VocabTooltip({ vocab, children }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Check if word already exists in FSRS cards
  const fsrsCards = useSelector((state) => state.vocabulary?.fsrsCards ?? {});
  const alreadyAdded = Boolean(fsrsCards[vocab.wordId]);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleAddToReview = useCallback(() => {
    if (alreadyAdded) return;
    try {
      // Dynamically import to avoid circular dependency
      dispatch({
        type: 'vocabulary/addFsrsCard',
        payload: {
          wordId: vocab.wordId,
          arabic: vocab.arabic,
          english: vocab.english,
          transliteration: vocab.transliteration,
        },
      });
    } catch {
      // Silently fail if vocabulary slice doesn't support this action
    }
  }, [dispatch, vocab, alreadyAdded]);

  return (
    <span className={styles.tooltipWrapper} ref={wrapperRef}>
      <span
        className={styles.highlightedWord}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        aria-label={`Vocabulary: ${vocab.arabic}`}
      >
        {children}
      </span>

      {open && (
        <span className={styles.tooltip} role="tooltip">
          <div className={styles.arabicWord}>{vocab.arabic}</div>
          <div className={styles.transliteration}>{vocab.transliteration}</div>
          <div className={styles.english}>{vocab.english}</div>
          <button
            className={styles.addButton}
            onClick={handleAddToReview}
            disabled={alreadyAdded}
          >
            {alreadyAdded ? 'Already in review' : 'Add to review'}
          </button>
        </span>
      )}
    </span>
  );
}
