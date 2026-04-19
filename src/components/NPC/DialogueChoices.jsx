import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './DialogueOverlay.module.css';

/**
 * DialogueChoices
 * The choice selection UI with numbered buttons (used for player responses)
 */
export default function DialogueChoices({ choices, onChoiceSelect, portrait }) {
  const formatArabic = useFormatArabic();
  return (
    <div className={styles.dialogueBox}>
      {/* Portrait */}
      {portrait}
      <div className={styles.content}>
        <div className={styles.speakerName} role="heading" aria-level="2">
          You
        </div>
        <div className={styles.choices} role="group" aria-label="Available dialogue choices">
          {choices.map((c, i) => (
            <button
              key={i}
              className={styles.choiceBtn}
              onClick={() => onChoiceSelect(c)}
              aria-label={`Choice ${i + 1}: ${c.english}${c.arabic ? ` - ${c.arabic}` : ''}`}
            >
              <div>
                <span className={styles.choiceNumber} aria-hidden="true">
                  {i + 1}
                </span>
                {c.english}
              </div>
              {c.arabic && (
                <div className={styles.choiceArabic} lang="ar" dir="rtl">
                  {formatArabic(c.arabic)}
                </div>
              )}
            </button>
          ))}
        </div>
        <div className={styles.choiceHint} aria-live="polite">
          Press 1-{choices.length} to select
        </div>
      </div>
    </div>
  );
}
