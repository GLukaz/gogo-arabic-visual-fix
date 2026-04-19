import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './CulturalContext.module.css';

/**
 * CulturalContext — Cultural expression matching quiz.
 *
 * Shows an Arabic expression/proverb and asks the player to match it
 * to the correct cultural situation from 4 options.
 *
 * Props:
 *   word     — { culturalItem } with expression, transliteration, explanation
 *   options  — [{ label, value, correct }] — 4 situation descriptions
 *   feedback — null | { correct, selected, correctAnswer }
 *   onAnswer — (value) => void
 */
export default function CulturalContext({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  const item = word.culturalItem || {};
  const expression = item.expression || word.arabic || '';
  const transliteration = item.transliteration || word.transliteration || '';
  const explanation = item.explanation || '';

  return (
    <div role="group" aria-label={`Cultural context: when is "${transliteration || expression}" used?`}>
      <div className={styles.instruction} id="cc-instruction">When is this expression used?</div>
      <div className={styles.promptBox} aria-label={`Expression: ${transliteration || expression}`}>
        <div className={styles.expression}>{formatArabic(expression)}</div>
        <div className={styles.transliteration}>{transliteration}</div>
      </div>
      <div className={styles.contextLabel}>Match the expression to its cultural context:</div>
      <div className={styles.choices} role="group" aria-label="Context choices" aria-describedby="cc-instruction">
        {options.map((c, i) => {
          let extraClass = '';
          if (feedback) {
            if (c.correct) extraClass = styles.choiceCorrect;
            else if (c.value === feedback.selected && !c.correct) extraClass = styles.choiceWrong;
          }
          return (
            <button
              key={i}
              className={`${styles.choice} ${extraClass}`}
              onClick={() => !feedback && onAnswer(c.value)}
              disabled={!!feedback}
              aria-label={`Context ${i + 1}: ${c.label}${feedback && c.correct ? ' (correct answer)' : ''}${feedback && c.value === feedback.selected && !c.correct ? ' (incorrect)' : ''}`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      {feedback && feedback.correct && explanation && (
        <div className={styles.explanation} role="alert">{explanation}</div>
      )}
      {feedback && !feedback.correct && explanation && (
        <div className={styles.explanationWrong} role="alert">
          {explanation}
        </div>
      )}
    </div>
  );
}
