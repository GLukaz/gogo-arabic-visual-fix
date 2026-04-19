import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './DialectIdentify.module.css';

/**
 * DialectIdentify — Dialect identification quiz.
 *
 * Shows an Arabic phrase with transliteration and meaning.
 * Player identifies which dialect: MSA, Egyptian, Levantine, or Gulf.
 *
 * Props:
 *   word     — { dialectItem } with phrase, transliteration, english, dialect, explanation
 *   options  — [{ label, value, correct }] — 4 dialect choices
 *   feedback — null | { correct, selected, correctAnswer }
 *   onAnswer — (value) => void
 */
export default function DialectIdentify({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  // word.dialectItem holds the full dialect item data set by buildChoices
  const item = word.dialectItem || {};
  const phrase = item.phrase || word.arabic || '';
  const transliteration = item.transliteration || word.transliteration || '';
  const meaning = item.english || word.english || '';
  const explanation = item.explanation || '';

  return (
    <div role="group" aria-label={`Dialect identify: which dialect is "${transliteration || phrase}"?`}>
      <div className={styles.instruction} id="dialect-instruction">Which dialect is this phrase?</div>
      <div className={styles.promptBox} aria-label={`Phrase: ${transliteration || phrase}, meaning: ${meaning}`}>
        <div className={styles.phrase}>{formatArabic(phrase)}</div>
        <div className={styles.transliteration}>{transliteration}</div>
        <div className={styles.meaning}>{meaning}</div>
      </div>
      <div className={styles.choices} role="group" aria-label="Dialect choices" aria-describedby="dialect-instruction">
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
              aria-label={`Dialect ${i + 1}: ${c.label}${feedback && c.correct ? ' (correct answer)' : ''}${feedback && c.value === feedback.selected && !c.correct ? ' (incorrect)' : ''}`}
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
