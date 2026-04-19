import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './FillInBlank.module.css';

const BLANK_PLACEHOLDER = '______';

/**
 * Renders an Arabic sentence with the target word replaced by a blank.
 * Sentence is stored in options[0].sentence — provided by useQuiz buildChoices.
 */
export default function FillInBlank({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  // The sentence comes from word.exampleSentence; fall back to a simple frame
  const rawSentence = word.exampleSentence?.arabic || null;
  const englishSentence = word.exampleSentence?.english || word.english;

  // Replace the Arabic word (strip diacritics for matching) with a blank marker
  let displaySentence = null;
  if (rawSentence) {
    const normalize = (s) => s.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '').trim();
    const normalizedArabic = normalize(word.arabic);
    // Try exact match first, then normalized
    const replaced = rawSentence.includes(word.arabic)
      ? rawSentence.replace(word.arabic, BLANK_PLACEHOLDER)
      : rawSentence.replace(
          new RegExp(normalizedArabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
          BLANK_PLACEHOLDER
        );
    displaySentence = replaced !== rawSentence ? replaced : null;
  }

  const renderSentence = () => {
    if (!displaySentence) {
      return (
        <span className={styles.sentence}>
          <span className={styles.blank}>{BLANK_PLACEHOLDER}</span>
          {' '}
          <span className={styles.fallbackHint}>
            ({word.english})
          </span>
        </span>
      );
    }

    const parts = displaySentence.split(BLANK_PLACEHOLDER);
    return (
      <span className={styles.sentence}>
        {parts.map((part, i) => (
          <span key={i}>
            {formatArabic(part)}
            {i < parts.length - 1 && <span className={styles.blank}>{BLANK_PLACEHOLDER}</span>}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div role="group" aria-label={`Fill in the blank: ${word.english}`}>
      <div className={styles.instruction} id="fib-instruction">Fill in the blank:</div>
      <div className={styles.sentenceBox} aria-label="Sentence with blank">{renderSentence()}</div>
      <div className={styles.englishHint} aria-label={`Hint: ${englishSentence}`}>{englishSentence}</div>
      <div className={styles.choices} role="group" aria-label="Answer choices" aria-describedby="fib-instruction">
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
