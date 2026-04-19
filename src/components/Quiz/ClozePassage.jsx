import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './ClozePassage.module.css';

const BLANK_PLACEHOLDER = '______';

/**
 * Renders an Arabic passage with the target word replaced by a blank.
 * Passage is sourced from word.exampleSentence?.arabic with a blank placeholder.
 * Falls back gracefully when exampleSentence is absent.
 */
export default function ClozePassage({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  // The passage comes from word.exampleSentence; fall back to a simple frame
  const rawPassage = word.exampleSentence?.arabic || null;
  const englishHint = word.exampleSentence?.english || word.english;

  // Replace the Arabic word (strip diacritics for matching) with a blank marker
  let displayPassage = null;
  if (rawPassage) {
    const normalize = (s) => s.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '').trim();
    const normalizedArabic = normalize(word.arabic);
    // Try exact match first, then normalized
    const replaced = rawPassage.includes(word.arabic)
      ? rawPassage.replace(word.arabic, BLANK_PLACEHOLDER)
      : rawPassage.replace(
          new RegExp(normalizedArabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
          BLANK_PLACEHOLDER
        );
    displayPassage = replaced !== rawPassage ? replaced : null;
  }

  const renderPassage = () => {
    if (!displayPassage) {
      return (
        <span className={styles.passage}>
          <span className={styles.blank}>{BLANK_PLACEHOLDER}</span>
          {' '}
          <span className={styles.fallbackHint}>
            ({word.english})
          </span>
        </span>
      );
    }

    const parts = displayPassage.split(BLANK_PLACEHOLDER);
    return (
      <span className={styles.passage}>
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
    <div role="group" aria-label={`Cloze passage: fill in the blank for "${word.english}"`}>
      <div className={styles.instruction} id="cloze-instruction">Read the passage and fill in the blank:</div>
      <div className={styles.passageBox} aria-label="Arabic passage with blank">
        <div className={styles.passageLabel}>Passage</div>
        {renderPassage()}
      </div>
      <div className={styles.englishHint} aria-label={`Hint: ${englishHint}`}>{englishHint}</div>
      <div className={styles.choices} role="group" aria-label="Answer choices" aria-describedby="cloze-instruction">
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
