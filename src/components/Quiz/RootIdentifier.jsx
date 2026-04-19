import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './RootIdentifier.module.css';

export default function RootIdentifier({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();
  const { renderArabic } = formatArabic;

  return (
    <div role="group" aria-label={`Root identifier: find the root of ${word.transliteration || word.arabic} (${word.english})`}>
      <div className={styles.instruction} id="root-instruction">Identify the trilateral root:</div>
      <div className={styles.prompt} aria-label={`Arabic word: ${word.transliteration || word.arabic}`}>{renderArabic(word.arabic, word.id)}</div>
      <div className={styles.english} aria-label={`Meaning: ${word.english}`}>{word.english}</div>
      <div className={styles.choices} role="group" aria-label="Root choices" aria-describedby="root-instruction">
        {options.map((c, i) => {
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
              aria-label={`Root choice ${i + 1}: ${c.label}${feedback && c.correct ? ' (correct answer)' : ''}${feedback && c.value === feedback.selected && !c.correct ? ' (incorrect)' : ''}`}
            >
              {formatArabic(c.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
