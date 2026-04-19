import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './ArabicToEnglish.module.css';

export default function ArabicToEnglish({ word, choices, feedback, onAnswer }) {
  const formatArabic = useFormatArabic();
  const { renderArabic } = formatArabic;

  return (
    <div role="group" aria-label={`Arabic to English: translate ${word.transliteration || word.arabic}`}>
      <div className={styles.prompt} aria-label={`Arabic word: ${word.transliteration || word.arabic}`}>{renderArabic(word.arabic, word.id)}</div>
      {word.transliteration && (
        <div className={styles.transliteration} aria-label={`Transliteration: ${word.transliteration}`}>{word.transliteration}</div>
      )}
      <div className={styles.choices} role="group" aria-label="Answer choices">
        {choices.map((c, i) => {
          let cls = styles.choice;
          if (feedback) {
            if (c.correct) cls = styles.choiceCorrect;
            else if (c.value === feedback.selected && !c.correct) cls = styles.choiceWrong;
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !feedback && onAnswer(c.value)}
              disabled={!!feedback}
              aria-label={`Choice ${i + 1}: ${c.label}${feedback && c.correct ? ' (correct answer)' : ''}${feedback && c.value === feedback.selected && !c.correct ? ' (incorrect)' : ''}`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
