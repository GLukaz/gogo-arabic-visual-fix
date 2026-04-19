import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { generateNumberQuestion } from '../../data/miniGames/numberChallengeData.js';
import { recordNumberScore } from '../../store/slices/miniGameSlice.js';
import styles from './NumberChallengeGame.module.css';

/**
 * NumberChallengeGame — Phase 85 Arabic numeral recognition + arithmetic.
 *
 * 20 questions per session with 4 difficulty levels.
 * Score = accuracy + speed bonus.
 */

const TOTAL_QUESTIONS = 20;

export default function NumberChallengeGame({ onBack }) {
  const dispatch = useDispatch();

  // Setup
  const [difficulty, setDifficulty] = useState(null);

  // Game state
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  // Timer
  useEffect(() => {
    if (!startTime || finished) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime, finished]);

  const startGame = useCallback((diff) => {
    setDifficulty(diff);
    setQuestionIndex(0);
    setCorrect(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setStartTime(Date.now());
    setElapsed(0);
    setFinished(false);
    setQuestion(generateNumberQuestion(diff));
  }, []);

  const handleAnswer = (choice) => {
    if (showResult) return;
    setSelectedAnswer(choice.value);
    setShowResult(true);

    if (choice.value === question.correctAnswer) {
      setCorrect((prev) => prev + 1);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex >= TOTAL_QUESTIONS) {
        // Game over
        const finalCorrect = choice.value === question.correctAnswer ? correct + 1 : correct;
        const timeBonus = Math.max(0, 600 - elapsed);
        const score = finalCorrect * 50 + timeBonus;
        setFinished(true);
        dispatch(recordNumberScore({ score, correct: finalCorrect }));
      } else {
        setQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuestion(generateNumberQuestion(difficulty));
      }
    }, 1200);
  };

  const resetGame = () => {
    setDifficulty(null);
    setQuestion(null);
    setFinished(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  // ─── Difficulty labels ───────────────────────────────────────
  const DIFFICULTIES = [
    { level: 1, label: 'Level 1', desc: 'Single digits (0-9)' },
    { level: 2, label: 'Level 2', desc: 'Two-digit numbers (10-99)' },
    { level: 3, label: 'Level 3', desc: 'Arithmetic (+ -)' },
    { level: 4, label: 'Level 4', desc: 'Word form matching' },
  ];

  // ─── Setup screen ────────────────────────────────────────────
  if (!difficulty) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Number Challenge</h1>
          <h2 className={styles.titleArabic}>تحدي الارقام</h2>
          <p className={styles.subtitle}>
            20 questions — identify Arabic numerals, solve arithmetic, and match number words
          </p>
        </div>

        <div className={styles.difficultyGrid}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.level}
              className={styles.difficultyCard}
              onClick={() => startGame(d.level)}
            >
              <span className={styles.diffLabel}>{d.label}</span>
              <span className={styles.diffDesc}>{d.desc}</span>
            </button>
          ))}
        </div>

        <button onClick={onBack} className={styles.backBtn}>Back</button>
      </div>
    );
  }

  // ─── Finished screen ─────────────────────────────────────────
  if (finished) {
    const timeBonus = Math.max(0, 600 - elapsed);
    const totalScore = correct * 50 + timeBonus;
    const pct = Math.round((correct / TOTAL_QUESTIONS) * 100);

    return (
      <div className={styles.container}>
        <div className={styles.resultPanel}>
          <h2 className={styles.resultTitle}>Challenge Complete!</h2>
          <div className={styles.resultStats}>
            <div className={styles.resultStat}>
              <span className={styles.resultNum}>{correct}/{TOTAL_QUESTIONS}</span>
              <span className={styles.resultLabel}>Correct ({pct}%)</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultNum}>{formatTime(elapsed)}</span>
              <span className={styles.resultLabel}>Time</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultNum}>{totalScore}</span>
              <span className={styles.resultLabel}>Score</span>
            </div>
          </div>
          <div className={styles.resultActions}>
            <button onClick={() => startGame(difficulty)} className={styles.goldBtn}>Play Again</button>
            <button onClick={resetGame} className={styles.darkBtn}>Change Level</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Question screen ─────────────────────────────────────────
  if (!question) return null;

  return (
    <div className={styles.container}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((questionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      <div className={styles.infoBar}>
        <span className={styles.infoPiece}>
          Q {questionIndex + 1}/{TOTAL_QUESTIONS}
        </span>
        <span className={styles.infoPiece}>Correct: {correct}</span>
        <span className={styles.infoPiece}>{formatTime(elapsed)}</span>
      </div>

      {/* Question */}
      <div className={styles.questionArea}>
        <p className={styles.promptLabel}>{question.promptLabel}</p>
        <div className={styles.prompt}>{question.prompt}</div>
      </div>

      {/* Choices */}
      <div className={styles.choicesGrid}>
        {question.choices.map((choice, i) => {
          let choiceClass = styles.choiceBtn;
          if (showResult) {
            if (choice.value === question.correctAnswer) {
              choiceClass += ` ${styles.choiceCorrect}`;
            } else if (choice.value === selectedAnswer) {
              choiceClass += ` ${styles.choiceWrong}`;
            }
          }

          return (
            <button
              key={i}
              className={choiceClass}
              onClick={() => handleAnswer(choice)}
              disabled={showResult}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
