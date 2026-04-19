import { useCallback, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './PronunciationFeedback.module.css';
import {
  isSpeechRecognitionSupported,
  evaluatePronunciation,
} from '../../services/pronunciationService.js';

/**
 * PronunciationFeedback — Mic button for pronunciation practice.
 *
 * States: idle → listening (pulsing mic) → processing → correct/incorrect.
 * Respects prefers-reduced-motion. Browser support check is built in.
 *
 * @param {{ arabicWord: string, onResult?: (result) => void }} props
 */
export default function PronunciationFeedback({ arabicWord, onResult }) {
  const pronunciationEnabled = useSelector(
    (state) => state.settings?.pronunciationPractice ?? false
  );
  const reduceMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const [state, setState] = useState('idle'); // idle | listening | processing | correct | incorrect
  const [recognized, setRecognized] = useState('');
  const timeoutRef = useRef(null);

  const supported = isSpeechRecognitionSupported();

  const handleMicClick = useCallback(async () => {
    if (state === 'listening') return; // Prevent double-click
    setState('listening');
    setRecognized('');

    try {
      const result = await evaluatePronunciation(arabicWord, {
        timeoutMs: 5000,
      });
      setRecognized(result.recognized);
      setState(result.correct ? 'correct' : 'incorrect');
      onResult?.(result);
    } catch {
      setState('incorrect');
      setRecognized('—');
    }

    // Auto-reset after 3 seconds
    timeoutRef.current = setTimeout(() => setState('idle'), 3000);
  }, [arabicWord, state, onResult]);

  // Don't render if not enabled or not supported
  if (!pronunciationEnabled || !supported) return null;

  const stateLabel = {
    idle: '🎤',
    listening: '🔴',
    processing: '⏳',
    correct: '✅',
    incorrect: '❌',
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.micButton} ${styles[state]} ${
          state === 'listening' && !reduceMotion ? styles.pulse : ''
        }`}
        onClick={handleMicClick}
        disabled={state === 'processing'}
        aria-label={
          state === 'idle'
            ? 'Practice pronunciation'
            : state === 'listening'
              ? 'Listening...'
              : state === 'correct'
                ? 'Correct pronunciation'
                : 'Try again'
        }
        type="button"
      >
        {stateLabel[state]}
      </button>
      {recognized && state !== 'idle' && (
        <span className={styles.recognized} dir="rtl">
          {recognized}
        </span>
      )}
    </div>
  );
}
