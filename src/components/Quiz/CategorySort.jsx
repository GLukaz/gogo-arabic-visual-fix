import { useState, useEffect } from 'react';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './CategorySort.module.css';

/**
 * CategorySort — sort 6 words into 2 categories.
 *
 * options shape (from useQuiz):
 *   options = [
 *     { value: 'cat_a', label: 'Category A', correct: true, category: 'food' },
 *     ...
 *   ]
 *
 * For this quiz type, options are the 6 word tiles to sort.
 * options[i].category = which bucket it belongs to.
 * The two categories are derived from the unique categories in options.
 */
export default function CategorySort({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  // Derive the two category names from options
  const categories = [...new Set(options.map((o) => o.category))].slice(0, 2);
  const [catA, catB] = categories;

  const [buckets, setBuckets] = useState({ [catA]: [], [catB]: [] });
  const [remaining, setRemaining] = useState(options.map((o, i) => ({ ...o, idx: i })));
  const [pendingWord, setPendingWord] = useState(null);

  // Reset on new question
  useEffect(() => {
    setBuckets({ [catA]: [], [catB]: [] });
    setRemaining(options.map((o, i) => ({ ...o, idx: i })));
    setPendingWord(null);
  }, [word?.id]);

  const handleBankClick = (item) => {
    if (feedback) return;
    setPendingWord(item);
  };

  const handleBucketClick = (cat) => {
    if (feedback || !pendingWord) return;
    setBuckets((prev) => ({ ...prev, [cat]: [...prev[cat], pendingWord] }));
    setRemaining((prev) => prev.filter((r) => r.idx !== pendingWord.idx));
    setPendingWord(null);
  };

  const handleBucketTileClick = (cat, item) => {
    if (feedback) return;
    // Return to bank
    setBuckets((prev) => ({ ...prev, [cat]: prev[cat].filter((t) => t.idx !== item.idx) }));
    setRemaining((prev) => [...prev, item]);
    if (pendingWord?.idx === item.idx) setPendingWord(null);
  };

  const handleSubmit = () => {
    if (feedback) return;
    // Encode answer as JSON so useQuiz can evaluate it
    const answer = JSON.stringify(buckets);
    onAnswer(answer);
  };

  const allPlaced = remaining.length === 0;

  return (
    <div role="group" aria-label={`Category sort: sort words into ${catA} and ${catB}`}>
      <div className={styles.instruction} id="cs-instruction" aria-live="polite">
        {pendingWord
          ? `Place "${formatArabic(pendingWord.label)}" into a category:`
          : 'Sort the words into categories:'}
      </div>

      <div className={styles.columnsRow} role="group" aria-label="Category columns">
        {[catA, catB].map((cat) => (
          <div
            key={cat}
            className={`${styles.column} ${pendingWord ? styles.columnActive : ''}`}
            onClick={() => pendingWord && handleBucketClick(cat)}
            role="group"
            aria-label={`Category: ${cat} — ${buckets[cat].length} words placed`}
          >
            <div className={styles.columnLabel}>{cat}</div>
            {buckets[cat].map((item) => {
              const isCorrect = feedback ? item.category === cat : null;
              let cls = styles.columnTile;
              if (feedback) {
                cls = isCorrect ? styles.columnTileCorrect : styles.columnTileWrong;
              }
              return (
                <button
                  key={item.idx}
                  className={cls}
                  onClick={(e) => { e.stopPropagation(); handleBucketTileClick(cat, item); }}
                  disabled={!!feedback}
                  aria-label={`${item.label} in ${cat}${feedback ? (isCorrect ? ' (correct)' : ' (incorrect)') : ' — click to remove'}`}
                >
                  {formatArabic(item.label)}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Word bank */}
      {remaining.length > 0 && (
        <div className={styles.tileBank} role="group" aria-label="Words to sort">
          {remaining.map((item) => (
            <button
              key={item.idx}
              className={`${styles.bankTile} ${pendingWord?.idx === item.idx ? styles.bankTileSelected : ''}`}
              onClick={() => handleBankClick(item)}
              disabled={!!feedback}
              aria-label={`Word: ${item.label}${pendingWord?.idx === item.idx ? ' (selected — choose a category)' : ' — click to select'}`}
            >
              {formatArabic(item.label)}
            </button>
          ))}
        </div>
      )}

      {!feedback && allPlaced && (
        <button className={styles.submitBtn} onClick={handleSubmit} aria-label="Submit category sort">
          Submit
        </button>
      )}
    </div>
  );
}
