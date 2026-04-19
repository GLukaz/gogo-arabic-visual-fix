/**
 * BattleArabicInput.jsx — Arabic input overlay during combat.
 *
 * Appears when player selects Attack or Magic.
 * Two modes: 'choice' (multiple choice for beginners) and 'type' (free typing).
 * Timer bar counts down. Accuracy determines damage.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { audioManager } from '../../services/audio.js';
import styles from './BattleArabicInput.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Calculate accuracy of Arabic input vs target.
 * Strips diacritics for comparison, uses Levenshtein distance for partial credit.
 */
function calculateAccuracy(input, word) {
  if (!input || !word?.arabic) return 0;
  const normalize = (s) => s.replace(/[\u064B-\u065F\u0670]/g, '').trim();
  const normalizedInput = normalize(input);
  const normalizedTarget = normalize(word.arabic);

  if (normalizedInput === normalizedTarget) return 1.0;

  const maxLen = Math.max(normalizedInput.length, normalizedTarget.length);
  if (maxLen === 0) return 0;

  const distance = levenshtein(normalizedInput, normalizedTarget);
  return Math.max(0, 1 - distance / maxLen);
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

export default function BattleArabicInput({ prompt, onSubmit, mode = 'attack' }) {
  const timerDuration = mode === 'flee' ? 10000 : (prompt?.timeLimit || 15000);
  const [input, setInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const inputRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const submittedRef = useRef(false);
  const formatArabic = useFormatArabic();

  // Reset on new prompt
  useEffect(() => {
    if (!prompt) return;
    setInput('');
    setTimeRemaining(mode === 'flee' ? 10000 : (prompt.timeLimit || 15000));
    startTimeRef.current = Date.now();
    submittedRef.current = false;
    inputRef.current?.focus();
  }, [prompt]);

  const handleSubmit = useCallback(
    (value, isTimeout = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;

      const timeElapsed = Date.now() - startTimeRef.current;
      const finalValue = isTimeout ? '' : value || input;
      const accuracy = isTimeout ? 0 : calculateAccuracy(finalValue, prompt?.word);

      audioManager.playSFX(accuracy >= 0.8 ? 'correct' : 'wrong');

      EventBus.emit(EVENTS.BATTLE_ARABIC_INPUT, {
        input: finalValue,
        wordId: prompt?.word?.id,
        accuracy,
        timeElapsed,
        element: prompt?.word?.element || null,
      });

      onSubmit?.();
      setInput('');
    },
    [input, prompt, onSubmit]
  );

  // Timer countdown
  useEffect(() => {
    if (!prompt) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          clearInterval(interval);
          handleSubmit('', true);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [prompt, handleSubmit]);

  if (!prompt) return null;

  const timerBase = mode === 'flee' ? 10000 : (prompt.timeLimit || 15000);
  const timerPercent = (timeRemaining / timerBase) * 100;
  const timerColor = timerPercent > 50 ? '#44CC44' : timerPercent > 25 ? '#CCCC44' : '#CC4444';

  return (
    <motion.div
      className={styles.inputOverlay}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.15 }}
    >
      {/* Timer bar */}
      <div className={styles.timerBarTrack}>
        <div
          className={styles.timerBarFill}
          style={{
            width: `${timerPercent}%`,
            '--timer-color': timerColor,
          }}
        />
      </div>

      {/* Flee mode header */}
      {mode === 'flee' && (
        <p className={styles.fleeHeader} lang="ar">
          {'!أجب للهروب — Answer to Flee'}
        </p>
      )}

      {/* Choice mode */}
      {prompt.difficulty === 'choice' && (
        <div>
          <p className={styles.choiceArabicPrompt} lang="ar">
            {formatArabic(prompt.word?.arabic || '')}
          </p>
          <div className={styles.choiceList}>
            {(prompt.choices || []).map((choice, idx) => (
              <button
                key={idx}
                className={styles.choiceButton}
                onClick={() => handleSubmit(choice.value)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Type mode */}
      {prompt.difficulty === 'type' && (
        <div>
          <p className={styles.typePrompt}>
            {prompt.word?.english || ''}
          </p>
          <input
            ref={inputRef}
            type="text"
            className={styles.typeInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="...اكتب بالعربية"
            dir="rtl"
            autoComplete="off"
          />
          <button
            className={styles.typeSubmitBtn}
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      )}
    </motion.div>
  );
}
