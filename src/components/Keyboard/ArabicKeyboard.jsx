import { useCallback } from 'react';
import styles from './ArabicKeyboard.module.css';

const ROWS = [
  ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر'],
  ['ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف'],
  ['ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ة', 'ء'],
];

export default function ArabicKeyboard({
  onKeyPress,
  onBackspace,
  onSubmit,
  onSpace,
  highlightedKeys = [],
  disabledKeys = [],
  showSubmit = true,
  showSpace = false,
}) {
  const handleKey = useCallback((letter) => {
    if (disabledKeys.includes(letter)) return;
    onKeyPress(letter);
  }, [onKeyPress, disabledKeys]);

  return (
    <div className={styles.container}>
      {ROWS.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {row.map((letter) => {
            const isHighlighted = highlightedKeys.includes(letter);
            const isDisabled = disabledKeys.includes(letter);
            return (
              <button
                key={letter}
                className={`${styles.key} ${isHighlighted ? styles.keyHighlighted : ''} ${isDisabled ? styles.keyDisabled : ''}`}
                onClick={() => handleKey(letter)}
                disabled={isDisabled}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}

      <div className={styles.controlRow}>
        <button className={styles.backspaceKey} onClick={onBackspace}>
          Backspace
        </button>
        {showSpace && (
          <button className={styles.spaceKey} onClick={onSpace}>
            Space
          </button>
        )}
        {showSubmit && (
          <button className={styles.submitKey} onClick={onSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
