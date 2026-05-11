/**
 * PronunciationChallenge — Word-Based Letter Identification Exercise
 * Phase 95 (PHON-03)
 *
 * TTS plays an Arabic word. The player must identify which letter the word
 * starts with from 4-6 choices. Runs for 5 rounds per session with a
 * summary at the end.
 */

import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { speakArabic, isArabicTtsAvailable } from '../../services/ttsService.js';
import { ARABIC_CONSONANTS, MINIMAL_PAIRS, SOUND_CATEGORIES } from '../../data/arabicPhonetics.js';
import { recordPracticeAttempt } from '../../store/slices/phoneticsSlice.js';
import styles from './PronunciationChallenge.module.css';

const ROUNDS_PER_SESSION = 5;
const MAX_FREE_REPLAYS = 2;

/** Pick random items from an array without replacement. */
function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Build a round: pick a pair, choose a word, generate distractors. */
function buildRound(focusCategory) {
  // Filter pairs by focus category if provided
  let candidates = MINIMAL_PAIRS;
  if (focusCategory) {
    const category = SOUND_CATEGORIES.find((c) => c.id === focusCategory);
    if (category) {
      const catLetters = new Set(category.letters);
      candidates = MINIMAL_PAIRS.filter(
        (p) => catLetters.has(p.soundA.id) || catLetters.has(p.soundB.id)
      );
    }
  }
  if (candidates.length === 0) candidates = MINIMAL_PAIRS;

  // Pick a random pair
  const pair = candidates[Math.floor(Math.random() * candidates.length)];

  // Pick which sound and which word
  const isA = Math.random() < 0.5;
  const sound = isA ? pair.soundA : pair.soundB;
  const word = sound.exampleWords[Math.floor(Math.random() * sound.exampleWords.length)];
  const wordText = word.split(' ')[0]; // Just the Arabic word
  const correctLetterId = sound.id;
  const correctLetter = sound.letter;

  // Build distractor letters: include the other sound from the pair + 2-4 random consonants
  const otherSound = isA ? pair.soundB : pair.soundA;
  const distractorIds = new Set([otherSound.id]);

  // Add random consonants as distractors
  const otherConsonants = ARABIC_CONSONANTS.filter(
    (c) => c.id !== correctLetterId && c.id !== otherSound.id
  );
  const extras = pickRandom(otherConsonants, 3);
  extras.forEach((c) => distractorIds.add(c.id));

  // Build choices: correct + distractors (4-5 total)
  const choices = [
    { id: correctLetterId, letter: correctLetter, correct: true },
    ...Array.from(distractorIds)
      .slice(0, 4)
      .map((id) => {
        const consonant = ARABIC_CONSONANTS.find((c) => c.id === id);
        return { id, letter: consonant?.letter || '?', correct: false };
      }),
  ];

  // Shuffle choices
  choices.sort(() => Math.random() - 0.5);

  return {
    word,
    wordText,
    correctLetterId,
    correctLetter,
    choices,
  };
}

export default function PronunciationChallenge({
  difficulty: _difficulty = 2,
  focusCategory,
  onComplete,
}) {
  const dispatch = useDispatch();
  const ttsAvailable = isArabicTtsAvailable();

  const [round, setRound] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState('playing'); // 'playing' | 'selection' | 'feedback' | 'summary'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [replaysUsed, setReplaysUsed] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]); // { word, correct, letterId }[]

  /** Initialize a round. */
  const initRound = useCallback(() => {
    const newRound = buildRound(focusCategory);
    setRound(newRound);
    setPhase('playing');
    setReplaysUsed(0);
    setSelectedChoice(null);
    setIsCorrect(null);
  }, [focusCategory]);

  /** Start first round. */
  useEffect(() => {
    initRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Play the word via TTS. */
  const playWord = useCallback(async () => {
    if (!round || isSpeaking) return;
    setIsSpeaking(true);
    try {
      await speakArabic(round.wordText);
    } catch {
      // TTS failed
    } finally {
      setIsSpeaking(false);
      setPhase('selection');
      setReplaysUsed((prev) => prev + 1);
    }
  }, [round, isSpeaking]);

  /** Handle selecting a letter choice. */
  const handleChoiceSelect = useCallback(
    (choice) => {
      if (phase !== 'selection' || selectedChoice !== null) return;

      const correct = choice.correct;
      setSelectedChoice(choice);
      setIsCorrect(correct);
      setPhase('feedback');

      // Calculate score: 100 (first try, no extra replays), 75 (1 replay), 50 (2+ replays)
      let attemptScore = 100;
      if (replaysUsed > MAX_FREE_REPLAYS) {
        attemptScore = 50;
      } else if (!correct) {
        attemptScore = 0;
      }
      if (correct && replaysUsed > 1) {
        attemptScore = 75;
      }
      if (!correct) attemptScore = 0;

      // Dispatch to Redux
      dispatch(
        recordPracticeAttempt({
          id: round.correctLetterId,
          score: correct ? attemptScore || 100 : 0,
          type: 'consonant',
        })
      );

      if (correct) {
        const points = replaysUsed <= 1 ? 20 : 10;
        setScore((prev) => prev + points);
      }

      setResults((prev) => [
        ...prev,
        {
          word: round.word,
          correct,
          letterId: round.correctLetterId,
        },
      ]);
    },
    [phase, selectedChoice, replaysUsed, round, dispatch]
  );

  /** Advance to next round or summary. */
  const handleNext = useCallback(() => {
    const nextIndex = roundIndex + 1;
    if (nextIndex >= ROUNDS_PER_SESSION) {
      setPhase('summary');
      onComplete?.(score);
      return;
    }
    setRoundIndex(nextIndex);
    initRound();
  }, [roundIndex, score, onComplete, initRound]);

  /** Get CSS class for a choice button. */
  const getChoiceBtnClass = (choice) => {
    if (phase !== 'feedback') return styles.choiceBtn;
    if (selectedChoice?.id === choice.id) {
      return isCorrect ? styles.choiceBtnCorrect : styles.choiceBtnWrong;
    }
    if (!isCorrect && choice.correct) {
      return styles.choiceBtnCorrect;
    }
    return styles.choiceBtn;
  };

  /** Render summary screen. */
  if (phase === 'summary') {
    const correctCount = results.filter((r) => r.correct).length;
    const accuracy = Math.round((correctCount / results.length) * 100);

    return (
      <div className={styles.summary} role="group" aria-label="Session summary">
        <div className={styles.summaryTitle}>Session Complete</div>
        <div className={styles.summaryRow}>
          Score: <span className={styles.summaryValue}>{score}</span>
        </div>
        <div className={styles.summaryRow}>
          Accuracy: <span className={styles.summaryValue}>{accuracy}%</span>
        </div>
        <div className={styles.summaryRow}>
          Correct: <span className={styles.summaryValue}>{correctCount} / {results.length}</span>
        </div>
        <button className={styles.nextBtn} onClick={() => {
          setRoundIndex(0);
          setScore(0);
          setResults([]);
          initRound();
        }}>
          Play Again
        </button>
      </div>
    );
  }

  if (!round) return null;

  return (
    <div
      className={styles.container}
      role="group"
      aria-label="Pronunciation Challenge"
    >
      {/* Instruction */}
      <div className={styles.instruction}>
        Which letter does this word start with?
      </div>

      {/* Word display (hidden during playing phase for TTS-first approach) */}
      {phase !== 'playing' && (
        <div className={styles.wordDisplay} dir="rtl">
          {round.word}
        </div>
      )}

      {/* Speaker button */}
      {ttsAvailable ? (
        <>
          <button
            className={isSpeaking ? styles.speakerBtnSpeaking : styles.speakerBtn}
            onClick={playWord}
            disabled={isSpeaking}
            aria-label={isSpeaking ? 'Speaking...' : 'Play word'}
          >
            {'\uD83D\uDD0A'}
          </button>
          {replaysUsed > MAX_FREE_REPLAYS && (
            <div className={styles.replayInfo}>Extra replays used</div>
          )}
        </>
      ) : (
        <>
          <div className={styles.fallbackWarning} role="alert">
            Audio not available
          </div>
          <div className={styles.fallbackArabic} dir="rtl">
            {round.wordText}
          </div>
          {phase === 'playing' && (
            <button className={styles.nextBtn} onClick={() => setPhase('selection')}>
              Continue
            </button>
          )}
        </>
      )}

      {/* Letter choices */}
      {(phase === 'selection' || phase === 'feedback') && (
        <div className={styles.choiceGrid}>
          {round.choices.map((choice) => (
            <button
              key={choice.id}
              className={getChoiceBtnClass(choice)}
              onClick={() => handleChoiceSelect(choice)}
              disabled={phase !== 'selection'}
              aria-label={`Letter ${choice.letter}`}
              dir="rtl"
            >
              {choice.letter}
            </button>
          ))}
        </div>
      )}

      {/* Feedback */}
      <div className={styles.feedbackArea}>
        {phase === 'feedback' && isCorrect && (
          <div className={styles.feedbackCorrect}>Correct!</div>
        )}
        {phase === 'feedback' && !isCorrect && (
          <div className={styles.feedbackWrong}>
            Not quite — it was {round.correctLetter}
          </div>
        )}
      </div>

      {/* Next button */}
      {phase === 'feedback' && (
        <button className={styles.nextBtn} onClick={handleNext}>
          {roundIndex + 1 >= ROUNDS_PER_SESSION ? 'Finish' : 'Next'}
        </button>
      )}

      {/* Progress bar */}
      <div className={styles.progressLabel}>
        Round {roundIndex + 1} / {ROUNDS_PER_SESSION}
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((roundIndex + 1) / ROUNDS_PER_SESSION) * 100}%` }}
        />
      </div>

      {/* Score */}
      <div className={styles.scoreText}>Score: {score}</div>
    </div>
  );
}
