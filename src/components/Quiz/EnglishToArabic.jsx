import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './EnglishToArabic.module.css';

export default function EnglishToArabic({ word, choices, feedback, onAnswer }) {
  const formatArabic = useFormatArabic();
  const { renderArabic } = formatArabic;

  return (
    <div role="group" aria-label={`English to Arabic: translate "${word.english}"`}>
      <div className={styles.instruction} id="en-to-ar-instruction">Choose the Arabic translation:</div>
      <div className={styles.prompt} aria-label={`English word: ${word.english}`}>{word.english}</div>
      <div className={styles.choices} role="group" aria-label="Answer choices" aria-describedby="en-to-ar-instruction">
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
              {formatArabic(c.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
