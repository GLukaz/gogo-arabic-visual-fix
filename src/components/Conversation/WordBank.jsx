/**
 * WordBank — Reusable word bank tile interface for Arabic sentence building.
 *
 * Props:
 *   words: string[]          — shuffled Arabic word tiles (includes distractors)
 *   selectedWords: string[]  — currently selected words forming the sentence
 *   onSelectWord: (word, index) => void  — add word from bank to sentence
 *   onRemoveWord: (index) => void        — remove word from sentence
 *   disabled: boolean        — disable interaction (during feedback)
 *   showCorrect: boolean     — highlight correct answer state
 */

import styles from './WordBank.module.css';

function WordBank({
  words = [],
  selectedWords = [],
  onSelectWord,
  onRemoveWord,
  disabled = false,
  showCorrect = false,
}) {
  // Track which bank indices have been used
  const usedIndices = new Set();
  selectedWords.forEach((sw) => {
    for (let i = 0; i < words.length; i++) {
      if (!usedIndices.has(i) && words[i] === sw) {
        usedIndices.add(i);
        break;
      }
    }
  });

  const handleBankClick = (word, bankIndex) => {
    if (disabled || usedIndices.has(bankIndex)) return;
    onSelectWord?.(word, bankIndex);
  };

  const handleSentenceClick = (index) => {
    if (disabled) return;
    onRemoveWord?.(index);
  };

  return (
    <div className={styles.container}>
      {/* Sentence Builder Area (RTL) */}
      <div
        className={`${styles.sentenceArea} ${showCorrect ? styles.sentenceCorrect : ''}`}
        data-testid="sentence-area"
      >
        {selectedWords.length === 0 ? (
          <span className={styles.placeholder}>اِبْنِ الجُملَة هُنا — Build your sentence here</span>
        ) : (
          <div className={styles.sentenceWords}>
            {selectedWords.map((word, idx) => (
              <button
                key={`sentence-${idx}`}
                className={styles.sentenceTile}
                onClick={() => handleSentenceClick(idx)}
                disabled={disabled}
                data-testid={`sentence-tile-${idx}`}
                type="button"
              >
                {word}
                {!disabled && <span className={styles.removeIcon}>×</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Word Bank */}
      <div className={styles.bankArea} data-testid="word-bank">
        {words.map((word, idx) => (
          <button
            key={`bank-${idx}`}
            className={`${styles.bankTile} ${usedIndices.has(idx) ? styles.bankTileUsed : ''}`}
            onClick={() => handleBankClick(word, idx)}
            disabled={disabled || usedIndices.has(idx)}
            data-testid={`bank-tile-${idx}`}
            type="button"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}

export default WordBank;
