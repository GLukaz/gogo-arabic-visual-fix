import { useState, useEffect, useCallback } from 'react';
import { speakArabic, stopSpeech, isArabicTtsAvailable } from '../../services/ttsService.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './ListeningComprehension.module.css';

/**
 * Listening Comprehension quiz (AUD-01) — Phase 80.
 *
 * TTS reads an Arabic word/sentence; the player selects the English meaning.
 * Falls back to displaying Arabic text when TTS is unavailable.
 *
 * @param {Object} props
 * @param {Object} props.word     - { id, arabic, english, transliteration, ... }
 * @param {Array}  props.choices  - [{ label, value, correct }]
 * @param {Function} props.onAnswer
 * @param {Object|null} props.feedback - { correct, selected, message }
 * @param {Function} props.renderArabic
 */
export default function ListeningComprehension({ word, choices, onAnswer, feedback, renderArabic: _renderArabic }) {
  const formatArabic = useFormatArabic();
  const { renderArabic } = formatArabic;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);

  /** Play the Arabic word via TTS */
  const playAudio = useCallback(async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      await speakArabic(word.arabic);
    } catch {
      // TTS failed — mark as unavailable so fallback shows
      setTtsAvailable(false);
    } finally {
      setIsSpeaking(false);
    }
  }, [word.arabic, isSpeaking]);

  /** Auto-play on mount and check TTS availability */
  useEffect(() => {
    const available = isArabicTtsAvailable();
    setTtsAvailable(available);

    if (available) {
      // Small delay so the component finishes rendering before speaking
      const timer = setTimeout(() => {
        playAudio();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.id]);

  /** Clean up speech on unmount */
  useEffect(() => {
    return () => stopSpeech();
  }, []);

  return (
    <div className={styles.container} role="group" aria-label={`Listening comprehension: ${word.transliteration || word.arabic}`}>
      <div className={styles.instruction} id="listen-comp-instruction">
        Listen and choose the correct meaning
      </div>

      {ttsAvailable ? (
        <>
          {/* Speaker button */}
          <button
            className={isSpeaking ? styles.speakerBtnSpeaking : styles.speakerBtn}
            onClick={playAudio}
            disabled={isSpeaking}
            aria-label={isSpeaking ? 'Speaking...' : 'Play Arabic audio'}
          >
            {'\uD83D\uDD0A'}
          </button>

          {/* Replay button */}
          <button
            className={styles.replayBtn}
            onClick={playAudio}
            disabled={isSpeaking}
            aria-label="Replay audio"
          >
            Replay
          </button>
        </>
      ) : (
        <>
          {/* Fallback: show Arabic text + warning */}
          <div className={styles.fallbackWarning} role="alert">
            Audio not available — read the word below
          </div>
          <div className={styles.fallbackArabic} dir="rtl" aria-label={`Arabic word: ${word.transliteration || word.arabic}`}>
            {renderArabic(word.arabic, word.id)}
          </div>
        </>
      )}

      {/* Answer choices */}
      <div className={styles.choices} role="group" aria-label="Answer choices" aria-describedby="listen-comp-instruction">
        {choices.map((c, i) => {
          let cls = styles.choice;
          if (feedback) {
            if (c.correct) cls = styles.choiceCorrect;
            else if (c.value === feedback.selected && !c.correct) cls = styles.choiceWrong;
          }
          return (
            <button
              key={c.value}
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

      {/* Feedback: show Arabic text + English after answering */}
      {feedback && (
        <div className={styles.feedbackArea}>
          <div className={feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong}>
            {feedback.correct ? 'Correct!' : 'Incorrect'}
          </div>
          <div className={styles.feedbackArabic} dir="rtl">
            {renderArabic(word.arabic, word.id)}
          </div>
          <div className={styles.feedbackEnglish}>{word.english}</div>
        </div>
      )}
    </div>
  );
}
