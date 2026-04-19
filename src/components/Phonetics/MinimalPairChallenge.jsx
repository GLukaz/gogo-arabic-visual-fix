/**
 * MinimalPairChallenge — Listen-and-Identify Exercise for Confusable Sounds
 * Phase 95 (PHON-03)
 *
 * TTS plays one of two similar Arabic sounds. The player must identify
 * which one they heard. Supports 3 difficulty levels with progressive
 * advancement after consecutive correct answers.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { speakArabic, isArabicTtsAvailable } from '../../services/ttsService.js';
import { MINIMAL_PAIRS } from '../../data/arabicPhonetics.js';
import { recordMinimalPairAttempt } from '../../store/slices/phoneticsSlice.js';
import styles from './MinimalPairChallenge.module.css';

/** Filter pairs by difficulty. */
function getPairsForDifficulty(diff) {
  return MINIMAL_PAIRS.filter((p) => p.difficulty <= diff);
}

/** Pick a random item from an array. */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function MinimalPairChallenge({
  pairId,
  difficulty: initialDifficulty = 1,
  onComplete,
}) {
  const dispatch = useDispatch();
  const ttsAvailable = isArabicTtsAvailable();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [currentPair, setCurrentPair] = useState(null);
  const [targetSound, setTargetSound] = useState(null); // 'A' or 'B'
  const [phase, setPhase] = useState('setup'); // 'setup' | 'playing' | 'selection' | 'feedback'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // 'A' | 'B' | null
  const [isCorrect, setIsCorrect] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  /** Available pairs for current difficulty. */
  const availablePairs = useMemo(() => {
    if (pairId) {
      const specific = MINIMAL_PAIRS.find((p) => p.id === pairId);
      return specific ? [specific] : getPairsForDifficulty(difficulty);
    }
    return getPairsForDifficulty(difficulty);
  }, [pairId, difficulty]);

  /** Start a new round with a random pair and target. */
  const startNewRound = useCallback(() => {
    const pair = randomItem(availablePairs);
    const target = Math.random() < 0.5 ? 'A' : 'B';
    setCurrentPair(pair);
    setTargetSound(target);
    setPhase('playing');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAttemptCount(0);
  }, [availablePairs]);

  /** Initialize first round on mount. */
  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Play the target sound via TTS. */
  const playTargetSound = useCallback(async () => {
    if (!currentPair || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const letter =
        targetSound === 'A' ? currentPair.soundA.letter : currentPair.soundB.letter;
      await speakArabic(letter);
    } catch {
      // TTS failed — silently ignore
    } finally {
      setIsSpeaking(false);
      setPhase('selection');
    }
  }, [currentPair, targetSound, isSpeaking]);

  /** Handle player selecting an answer. */
  const handleSelect = useCallback(
    (choice) => {
      if (phase !== 'selection' || selectedAnswer !== null) return;

      const correct = choice === targetSound;
      setSelectedAnswer(choice);
      setIsCorrect(correct);
      setAttemptCount((prev) => prev + 1);
      setPhase('feedback');

      // Dispatch to Redux
      dispatch(
        recordMinimalPairAttempt({
          pairId: currentPair.id,
          correct,
        })
      );

      if (correct) {
        const points = attemptCount === 0 ? 10 : 5;
        setScore((prev) => prev + points);
        setConsecutiveCorrect((prev) => prev + 1);
      } else {
        setConsecutiveCorrect(0);
      }

      setRoundsPlayed((prev) => prev + 1);
    },
    [phase, selectedAnswer, targetSound, attemptCount, currentPair, dispatch]
  );

  /** Retry on wrong answer (max 2 attempts). */
  const handleRetry = useCallback(() => {
    if (attemptCount < 2) {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setPhase('selection');
    }
  }, [attemptCount]);

  /** Advance to next round. */
  const handleNext = useCallback(() => {
    // Auto-advance difficulty after 3 consecutive correct
    if (consecutiveCorrect >= 3 && difficulty < 3) {
      setDifficulty((prev) => prev + 1);
      setConsecutiveCorrect(0);
    }

    // Complete after 5 rounds
    if (roundsPlayed >= 5) {
      onComplete?.(score);
      return;
    }

    startNewRound();
  }, [consecutiveCorrect, difficulty, roundsPlayed, score, onComplete, startNewRound]);

  /** Get CSS class for a letter box. */
  const getLetterBoxClass = (choice) => {
    if (phase !== 'feedback') return styles.letterBox;
    if (selectedAnswer === choice) {
      return isCorrect ? styles.letterBoxCorrect : styles.letterBoxWrong;
    }
    // Show correct answer on wrong selection
    if (!isCorrect && choice === targetSound) {
      return styles.letterBoxCorrect;
    }
    return styles.letterBox;
  };

  if (!currentPair) return null;

  return (
    <div
      className={styles.container}
      role="group"
      aria-label="Minimal Pair Challenge"
    >
      {/* Difficulty indicator */}
      <div className={styles.difficultyArea}>
        <span className={styles.difficultyLabel}>Level</span>
        {[1, 2, 3].map((lvl) => (
          <div
            key={lvl}
            className={lvl <= difficulty ? styles.difficultyDotActive : styles.difficultyDot}
            aria-label={`Difficulty ${lvl}${lvl <= difficulty ? ' (active)' : ''}`}
          />
        ))}
      </div>

      {/* Instruction */}
      <div className={styles.instruction}>
        Listen to the sound and select which one you hear
      </div>

      {/* Two letter choices */}
      <div className={styles.pairArea}>
        <div>
          <button
            className={getLetterBoxClass('A')}
            onClick={() => handleSelect('A')}
            disabled={phase !== 'selection'}
            aria-label={`${currentPair.soundA.name} (${currentPair.soundA.ipaSymbol})`}
            dir="rtl"
          >
            {currentPair.soundA.letter}
          </button>
          <div className={styles.letterLabel}>
            {currentPair.soundA.name} {currentPair.soundA.ipaSymbol}
          </div>
        </div>

        <span className={styles.vsDivider}>VS</span>

        <div>
          <button
            className={getLetterBoxClass('B')}
            onClick={() => handleSelect('B')}
            disabled={phase !== 'selection'}
            aria-label={`${currentPair.soundB.name} (${currentPair.soundB.ipaSymbol})`}
            dir="rtl"
          >
            {currentPair.soundB.letter}
          </button>
          <div className={styles.letterLabel}>
            {currentPair.soundB.name} {currentPair.soundB.ipaSymbol}
          </div>
        </div>
      </div>

      {/* Speaker button */}
      {ttsAvailable ? (
        <button
          className={isSpeaking ? styles.speakerBtnSpeaking : styles.speakerBtn}
          onClick={playTargetSound}
          disabled={isSpeaking}
          aria-label={isSpeaking ? 'Speaking...' : 'Play sound'}
        >
          {'\uD83D\uDD0A'}
        </button>
      ) : (
        <div className={styles.fallbackWarning} role="alert">
          Audio not available — the target letter is:{' '}
          {targetSound === 'A' ? currentPair.soundA.letter : currentPair.soundB.letter}
        </div>
      )}

      {/* Feedback */}
      <div className={styles.feedbackArea}>
        {phase === 'feedback' && isCorrect && (
          <div className={styles.feedbackCorrect}>
            Correct!
          </div>
        )}
        {phase === 'feedback' && !isCorrect && (
          <div className={styles.feedbackWrong}>
            {attemptCount < 2 ? 'Try again' : 'Incorrect'}
          </div>
        )}
      </div>

      {/* Explanation (shown after answer) */}
      {phase === 'feedback' && (
        <div className={styles.explanation}>{currentPair.explanation}</div>
      )}

      {/* Action buttons */}
      {phase === 'feedback' && !isCorrect && attemptCount < 2 && (
        <button className={styles.nextBtn} onClick={handleRetry}>
          Retry
        </button>
      )}

      {phase === 'feedback' && (isCorrect || attemptCount >= 2) && (
        <button className={styles.nextBtn} onClick={handleNext}>
          {roundsPlayed >= 5 ? 'Finish' : 'Next'}
        </button>
      )}

      {/* Score */}
      <div className={styles.scoreArea}>
        <span className={styles.scoreText}>Score: {score}</span>
        <span className={styles.scoreText}>
          Round: {Math.min(roundsPlayed + 1, 5)} / 5
        </span>
      </div>
    </div>
  );
}
