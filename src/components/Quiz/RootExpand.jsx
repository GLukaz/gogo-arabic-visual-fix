import { useState, useEffect } from 'react';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './RootExpand.module.css';

/**
 * RootExpand — Multi-select root expansion quiz.
 *
 * Shows a trilateral Arabic root and 6 word options.
 * Player selects ALL words derived from that root, then submits.
 *
 * Props:
 *   word     — { rootExpansion } with root, rootDisplay, meaning, correctCount
 *   options  — [{ label, value, correct, english }] — 6 options (mix of derived + distractors)
 *   feedback — null | { correct, selected, correctAnswer }
 *   onAnswer — (JSON string of selected values) => void
 */
export default function RootExpand({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  const [selected, setSelected] = useState(new Set());

  // Reset on new word
  useEffect(() => {
    setSelected(new Set());
  }, [word?.id]);

  const rootData = word.rootExpansion || {};
  const rootDisplay = rootData.rootDisplay || word.arabic || '';
  const rootMeaning = rootData.meaning || '';
  const correctCount = rootData.correctCount || options.filter((o) => o.correct).length;

  const toggleSelection = (value) => {
    if (feedback) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (feedback || selected.size === 0) return;
    // Send as JSON array of selected values
    const selectedArray = Array.from(selected);
    onAnswer(JSON.stringify(selectedArray));
  };

  return (
    <div role="group" aria-label={`Root expansion: select words derived from root "${rootDisplay}" meaning "${rootMeaning}"`}>
      <div className={styles.instruction} id="re-instruction">Select all words derived from this root:</div>
      <div className={styles.promptBox} aria-label={`Root: ${rootDisplay}, meaning: "${rootMeaning}"`}>
        <div className={styles.rootDisplay}>{formatArabic(rootDisplay)}</div>
        <div className={styles.rootMeaning}>Root meaning: "{rootMeaning}"</div>
      </div>
      <div className={styles.hint} aria-label={`Select ${correctCount} correct words, then submit`}>
        Tap to select, then submit ({correctCount} correct words)
      </div>
      <div className={styles.choices} role="group" aria-label="Word choices" aria-describedby="re-instruction">
        {options.map((c, i) => {
          const isSelected = selected.has(c.value);
          let extraClass = '';

          if (feedback) {
            // After submission: show correct/wrong/missed
            if (c.correct && selected.has(c.value)) {
              extraClass = styles.choiceCorrect; // correctly selected
            } else if (!c.correct && selected.has(c.value)) {
              extraClass = styles.choiceWrong; // incorrectly selected
            } else if (c.correct && !selected.has(c.value)) {
              extraClass = styles.choiceMissed; // missed correct answer
            }
          } else if (isSelected) {
            extraClass = styles.choiceSelected;
          }

          return (
            <button
              key={i}
              className={`${styles.choice} ${extraClass}`}
              onClick={() => toggleSelection(c.value)}
              disabled={!!feedback}
              aria-pressed={isSelected}
              aria-label={`${c.label}${c.english ? ` (${c.english})` : ''}${isSelected ? ' — selected' : ''}${feedback && c.correct && selected.has(c.value) ? ' (correct)' : ''}${feedback && !c.correct && selected.has(c.value) ? ' (incorrect)' : ''}${feedback && c.correct && !selected.has(c.value) ? ' (missed)' : ''}`}
            >
              {formatArabic(c.label)}
              {c.english && <span className={styles.englishLabel}>{c.english}</span>}
            </button>
          );
        })}
      </div>

      {!feedback && (
        <div className={styles.submitRow}>
          <button
            className={`${styles.submitBtn} ${selected.size === 0 ? styles.submitDisabled : ''}`}
            onClick={handleSubmit}
            disabled={selected.size === 0}
            aria-label={`Submit ${selected.size} selected words`}
          >
            Submit
          </button>
          <span className={styles.selectedCount} aria-live="polite">
            {selected.size} selected
          </span>
        </div>
      )}
    </div>
  );
}
