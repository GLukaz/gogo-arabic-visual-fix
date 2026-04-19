import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './ConjugationPick.module.css';

// Common Arabic pronouns for conjugation prompts
const PRONOUNS = [
  { en: 'I (أنا)', ar: 'أنا' },
  { en: 'You m. (أنتَ)', ar: 'أنتَ' },
  { en: 'You f. (أنتِ)', ar: 'أنتِ' },
  { en: 'He (هو)', ar: 'هو' },
  { en: 'She (هي)', ar: 'هي' },
  { en: 'We (نحن)', ar: 'نحن' },
];

/**
 * ConjugationPick — given a verb root + pronoun label, pick the correct conjugated form.
 *
 * options[i]: { label: Arabic conjugated form, value: Arabic form, correct: bool, pronoun: { en, ar } }
 * The pronoun to use is embedded in options[0].pronoun (set by useQuiz buildChoices).
 */
export default function ConjugationPick({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  // Pronoun for this question — stored on the correct option or fall back to a random pick
  const pronounObj = options.find((o) => o.pronoun)?.pronoun
    || PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];

  return (
    <div role="group" aria-label={`Conjugation: ${word.english} for ${pronounObj.en}`}>
      <div className={styles.instruction} id="conj-instruction">Pick the correct conjugation:</div>
      <div className={styles.promptBox} aria-label={`Verb: ${word.transliteration || word.arabic}, meaning "${word.english}", pronoun: ${pronounObj.en}`}>
        <div className={styles.verbRoot}>{formatArabic(word.arabic)}</div>
        <div className={styles.verbMeaning}>"{word.english}"</div>
        <div className={styles.pronounRow}>
          <div className={styles.pronoun}>{pronounObj.en}</div>
          <div className={styles.pronounAr}>{formatArabic(pronounObj.ar)}</div>
        </div>
      </div>
      <div className={styles.choices} role="group" aria-label="Conjugation choices" aria-describedby="conj-instruction">
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
              aria-label={`Conjugation ${i + 1}: ${c.label}${feedback && c.correct ? ' (correct answer)' : ''}${feedback && c.value === feedback.selected && !c.correct ? ' (incorrect)' : ''}`}
            >
              {formatArabic(c.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
