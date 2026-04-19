import { useState, useEffect, useCallback } from 'react';
import { speakArabic, stopSpeech, isArabicTtsAvailable } from '../../services/ttsService.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './Dictation.module.css';

// ── Arabic normalization helpers ─────────────────────────────────────────────

/**
 * Strip Arabic tashkeel (diacritical marks / harakat).
 * Removes Unicode range U+064B–U+065F and U+0670 (superscript alef).
 */
export function stripTashkeel(text) {
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

/**
 * Normalize alef variants to bare alef (ا).
 * أ إ آ  →  ا
 */
export function normalizeAlef(text) {
  return text.replace(/[أإآ]/g, 'ا');
}

/**
 * Full normalization pipeline for Arabic comparison:
 * strip tashkeel, normalize alef, trim whitespace.
 */
export function normalizeArabic(text) {
  return normalizeAlef(stripTashkeel(text)).trim();
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Dictation quiz (AUD-02) — Phase 80.
 *
 * TTS reads an Arabic word; the player types what they hear.
 * Grading strips tashkeel and normalizes alef before comparing.
 * After 2 failed attempts, a transliteration hint is offered.
 *
 * Falls back to showing Arabic text when TTS is unavailable.
 *
 * @param {Object} props
 * @param {Object} props.word     - { id, arabic, english, transliteration, ... }
 * @param {Array}  props.choices  - (unused — dictation uses free text input)
 * @param {Function} props.onAnswer
 * @param {Object|null} props.feedback - { correct, selected, correctAnswer, message }
 * @param {Function} props.renderArabic
 */
export default function Dictation({ word, choices: _choices, onAnswer, feedback, renderArabic: _renderArabic }) {
  const formatArabic = useFormatArabic();
  const { renderArabic } = formatArabic;

  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  /** Play the Arabic word via TTS */
  const playAudio = useCallback(async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      await speakArabic(word.arabic);
    } catch {
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

  /** Handle submit: compare normalized input against normalized expected */
  const handleSubmit = () => {
    if (feedback || !input.trim()) return;

    const normalizedInput = normalizeArabic(input);
    const normalizedExpected = normalizeArabic(word.arabic);
    const isCorrect = normalizedInput === normalizedExpected;

    if (!isCorrect) {
      setAttempts((prev) => prev + 1);
    }

    // Pass the raw input to onAnswer — the parent will generate feedback
    onAnswer(input.trim());
  };

  /** Handle Enter key in input */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Determine input styling based on feedback
  let inputClass = styles.arabicInput;
  if (feedback) {
    inputClass = feedback.correct ? styles.arabicInputCorrect : styles.arabicInputWrong;
  }

  return (
    <div className={styles.container} role="group" aria-label={`Dictation: type what you hear`}>
      <div className={styles.instruction} id="dictation-instruction">
        Type what you hear in Arabic
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
            Audio not available — type the word shown below
          </div>
          <div className={styles.fallbackArabic} dir="rtl" aria-label={`Arabic word: ${word.transliteration || word.arabic}`}>
            {renderArabic(word.arabic, word.id)}
          </div>
        </>
      )}

      {/* Arabic text input */}
      <input
        type="text"
        className={inputClass}
        dir="rtl"
        value={input}
        onChange={(e) => !feedback && setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!!feedback}
        placeholder="..."
        aria-label="Type Arabic here"
        aria-describedby="dictation-instruction"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Submit button */}
      {!feedback && (
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!input.trim()}
          aria-label="Submit answer"
        >
          Submit
        </button>
      )}

      {/* Hint button — shows after 2 failed attempts */}
      {!feedback && attempts >= 2 && !showHint && word.transliteration && (
        <button
          className={styles.hintBtn}
          onClick={() => setShowHint(true)}
          aria-label="Show hint"
        >
          Show Hint
        </button>
      )}

      {/* Hint text */}
      {showHint && word.transliteration && (
        <div className={styles.hintText} role="status" aria-label={`Hint: ${word.transliteration}`}>
          Hint: {word.transliteration}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={styles.feedbackArea}>
          <div className={feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong}>
            {feedback.correct ? 'Correct!' : 'Incorrect'}
          </div>
          {!feedback.correct && (
            <>
              <div className={styles.correctLabel}>Correct answer:</div>
              <div className={styles.correctAnswer} dir="rtl">
                {renderArabic(word.arabic, word.id)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
