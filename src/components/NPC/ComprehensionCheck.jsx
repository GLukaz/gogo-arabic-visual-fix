import { useState } from 'react';
import styles from './ComprehensionCheck.module.css';

/**
 * IMM-01: In-dialogue comprehension check.
 * Renders a multiple-choice quiz inline during NPC ink dialogue.
 * Shows correct/wrong feedback and a Continue button after answering.
 *
 * @param {{ question: string, options: string[], correctIndex: number, onComplete: (wasCorrect: boolean) => void }} props
 */
export default function ComprehensionCheck({ question, options, correctIndex, onComplete }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleOptionClick = (idx) => {
    if (answered) return;
    setSelectedIndex(idx);
    setAnswered(true);
  };

  const wasCorrect = selectedIndex === correctIndex;

  return (
    <div className={styles.container}>
      <p className={styles.question} dir="rtl" lang="ar">
        {question}
      </p>
      <div className={styles.optionsList}>
        {options.map((opt, idx) => {
          let extraClass = '';
          if (answered) {
            if (idx === correctIndex) {
              extraClass = styles.correct;
            } else if (idx === selectedIndex) {
              extraClass = styles.wrong;
            }
          }
          return (
            <button
              key={idx}
              className={`${styles.option} ${extraClass} ${answered ? styles.disabled : ''}`}
              onClick={() => handleOptionClick(idx)}
              dir="rtl"
              lang="ar"
              aria-label={opt}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <>
          <p
            className={`${styles.feedback} ${wasCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}
            dir="rtl"
            lang="ar"
          >
            {wasCorrect
              ? '\u0623\u062D\u0633\u064E\u0646\u062A!'
              : `\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u062D\u0629: ${options[correctIndex]}`}
          </p>
          <button
            className={styles.continueBtn}
            onClick={() => onComplete(wasCorrect)}
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}
