import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './PictureWord.module.css';

// Category emoji icons (text-only, no images needed)
const CATEGORY_ICONS = {
  food: '🍽',
  animals: '🐾',
  body: '💪',
  colors: '🎨',
  numbers: '🔢',
  family: '👪',
  nature: '🌿',
  travel: '✈',
  time: '⏰',
  adjectives: '✨',
  verbs: '⚡',
  places: '🏛',
  clothing: '👕',
  household: '🏠',
  general: '📖',
};

/**
 * PictureWord — given a description/category hint, pick the correct Arabic word.
 * Text-only, no images. Uses category + english description as the clue.
 *
 * options[i]: { label: Arabic, value: Arabic, correct: bool, english: string }
 */
export default function PictureWord({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();
  const icon = CATEGORY_ICONS[word.category] || CATEGORY_ICONS.general;

  return (
    <div role="group" aria-label={`Picture word: match "${word.english}" (${word.category})`}>
      <div className={styles.instruction} id="pw-instruction">Which Arabic word matches?</div>
      <div className={styles.hintCard} aria-label={`Clue: ${word.english}, category: ${word.category}`}>
        <div className={styles.categoryIcon} aria-hidden="true">{icon}</div>
        <div className={styles.categoryBadge}>{word.category}</div>
        <div className={styles.description}>{word.english}</div>
        {word.transliteration && (
          <div className={styles.translitHint} aria-label={`Transliteration hint: ${word.transliteration}`}>({word.transliteration})</div>
        )}
      </div>
      <div className={styles.choices} role="group" aria-label="Answer choices" aria-describedby="pw-instruction">
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
