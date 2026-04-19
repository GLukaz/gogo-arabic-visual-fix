import { useState } from 'react';
import { audioManager } from '../../services/audio.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './ListenAndChoose.module.css';

export default function ListenAndChoose({ word, choices, feedback, onAnswer }) {
  const formatArabic = useFormatArabic();
  const { renderArabic } = formatArabic;
  const [played, setPlayed] = useState(false);

  const playAudio = () => {
    audioManager.playWord(word.id);
    setPlayed(true);
  };

  return (
    <div role="group" aria-label={`Listen and choose: ${word.transliteration || word.arabic}`}>
      <div className={styles.instruction} id="listen-instruction">Listen and choose the English meaning:</div>

      {/* Show the Arabic word as prompt (visible to help learners) */}
      <div className={styles.prompt} aria-label={`Arabic word: ${word.transliteration || word.arabic}`}>{renderArabic(word.arabic, word.id)}</div>

      <button className={styles.playBtn} onClick={playAudio} aria-label={played ? 'Play audio again' : 'Play audio pronunciation'}>
        {played ? 'Play Again' : 'Play Audio'}
      </button>

      <div className={styles.choices} role="group" aria-label="Answer choices" aria-describedby="listen-instruction">
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
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
