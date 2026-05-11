/**
 * DailyChallengeOverlay — Full overlay with 3 states: Preview, Active, Complete.
 * Phase 81 (DAILY-01 + DAILY-02): Daily challenge system for player retention.
 *
 * Challenge types:
 *   - Word of the Day: learn a word + 3 exercises
 *   - Grammar Challenge: 5 fill-in-the-blank with 2-minute timer
 *   - Speed Quiz: 10 vocab questions, 8s each, score by speed + accuracy
 *   - Cultural Trivia: 5 lore-based multiple-choice questions
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  completeChallenge,
  claimStreakReward,
  resetDaily,
  selectCurrentStreak,
  selectCompletedToday,
  selectTodaysChallengeType,
  selectTodaysResult,
  selectUnclaimedStreakRewards,
  selectNextRewardTier,
} from '../../store/slices/dailyChallengeSlice.js';
import {
  CHALLENGE_TYPES,
  getDailyChallengeType,
  generateWordOfTheDay,
  generateGrammarChallenge,
  generateSpeedQuiz,
  generateCulturalTrivia,
} from '../../data/dailyChallenges.js';
import vocabularyAll from '../../data/vocabularyAll.js';
import { LORE_ENTRIES } from '../../data/loreEntries.js';
import { grammarLessons } from '../../data/grammar.js';
import styles from './DailyChallengeOverlay.module.css';

/** Get today's date as YYYY-MM-DD */
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// ═══════════════════════════════════════════════════════════
// MAIN OVERLAY
// ═══════════════════════════════════════════════════════════

export default function DailyChallengeOverlay({ onClose }) {
  const dispatch = useDispatch();
  const currentStreak = useSelector(selectCurrentStreak);
  const completedToday = useSelector(selectCompletedToday);
  const storedChallengeType = useSelector(selectTodaysChallengeType);
  const todaysResult = useSelector(selectTodaysResult);
  const unclaimedRewards = useSelector(selectUnclaimedStreakRewards);
  const nextReward = useSelector(selectNextRewardTier);

  const [phase, setPhase] = useState(completedToday ? 'complete' : 'preview');
  const [challengeResult, setChallengeResult] = useState(null);

  const today = getTodayDate();
  const challengeTypeKey = storedChallengeType || getDailyChallengeType(today);
  const challengeType = CHALLENGE_TYPES[challengeTypeKey];

  // Reset daily if needed
  useEffect(() => {
    if (!completedToday && storedChallengeType !== challengeTypeKey) {
      dispatch(resetDaily({ date: today, challengeType: challengeTypeKey }));
    }
  }, [dispatch, completedToday, storedChallengeType, challengeTypeKey, today]);

  // ESC to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleStart = useCallback(() => {
    setPhase('active');
  }, []);

  const handleChallengeComplete = useCallback(
    (result) => {
      // Calculate XP with streak multiplier
      let xpEarned = challengeType.baseXp;
      if (challengeType.streakMultiplier && currentStreak > 0) {
        const multiplier = 1 + Math.min(currentStreak, 30) * 0.05; // +5% per streak day, max +150%
        xpEarned = Math.round(xpEarned * multiplier);
      }

      // Add accuracy bonus
      if (result.score !== undefined) {
        xpEarned = Math.round(xpEarned * (0.5 + result.score * 0.5));
      }

      const finalResult = { ...result, xpEarned };
      setChallengeResult(finalResult);

      dispatch(
        completeChallenge({
          date: today,
          type: challengeTypeKey,
          score: result.score,
          timeMs: result.timeMs,
          xpEarned,
        })
      );

      setPhase('complete');
    },
    [dispatch, today, challengeTypeKey, challengeType, currentStreak]
  );

  const handleClaimReward = useCallback(
    (days) => {
      dispatch(claimStreakReward({ days }));
    },
    [dispatch]
  );

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-label="Daily Challenge">
      <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>
              <span className={styles.titleIcon}>{challengeType?.icon}</span>
              <span className={styles.titleArabic}>التحدي اليومي</span>
              <span className={styles.titleEnglish}>Daily Challenge</span>
            </h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        {/* Body */}
        <div className={styles.body}>
          {phase === 'preview' && (
            <PreviewState
              challengeType={challengeType}
              challengeTypeKey={challengeTypeKey}
              currentStreak={currentStreak}
              nextReward={nextReward}
              completedToday={completedToday}
              onStart={handleStart}
            />
          )}

          {phase === 'active' && (
            <ActiveState
              challengeTypeKey={challengeTypeKey}
              today={today}
              onComplete={handleChallengeComplete}
            />
          )}

          {phase === 'complete' && (
            <CompleteState
              challengeType={challengeType}
              result={challengeResult || todaysResult}
              currentStreak={currentStreak}
              nextReward={nextReward}
              unclaimedRewards={unclaimedRewards}
              onClaimReward={handleClaimReward}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PREVIEW STATE
// ═══════════════════════════════════════════════════════════

function PreviewState({ challengeType, currentStreak, nextReward, completedToday, onStart }) {
  if (!challengeType) return null;

  const progressToNext = nextReward
    ? Math.min((currentStreak / nextReward.days) * 100, 100)
    : 100;

  return (
    <div className={styles.previewContainer}>
      <div className={styles.challengeIcon}>{challengeType.icon}</div>
      <h3 className={styles.challengeName}>{challengeType.label}</h3>
      <p className={styles.challengeNameArabic}>{challengeType.labelArabic}</p>
      <p className={styles.challengeDescription}>{challengeType.description}</p>

      {/* Streak badge */}
      <div className={styles.streakBadge}>
        🔥 <span className={styles.streakNumber}>{currentStreak}</span> day streak
      </div>

      {/* Next reward progress */}
      {nextReward && (
        <div className={styles.rewardPreview}>
          <span className={styles.rewardLabel}>Next reward: {nextReward.title} ({nextReward.titleArabic})</span>
          <div className={styles.rewardProgressBar}>
            <div
              className={styles.rewardProgressFill}
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <span className={styles.rewardTarget}>
            {currentStreak}/{nextReward.days} days — +{nextReward.xpBonus} XP bonus
          </span>
        </div>
      )}

      {/* XP preview */}
      <p className={styles.xpPreview}>
        Base reward: <span className={styles.xpAmount}>{challengeType.baseXp} XP</span>
        {currentStreak > 0 && (
          <> (+ {Math.min(currentStreak, 30) * 5}% streak bonus)</>
        )}
      </p>

      {completedToday ? (
        <div className={styles.completedBanner}>
          ✅ You have already completed today&apos;s challenge!
        </div>
      ) : (
        <button className={styles.startBtn} onClick={onStart}>
          Start Challenge
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ACTIVE STATE — Routes to challenge-specific mini-games
// ═══════════════════════════════════════════════════════════

function ActiveState({ challengeTypeKey, today, onComplete }) {
  switch (challengeTypeKey) {
    case 'word_of_the_day':
      return <WordOfTheDayChallenge today={today} onComplete={onComplete} />;
    case 'grammar_challenge':
      return <GrammarChallengeGame today={today} onComplete={onComplete} />;
    case 'speed_quiz':
      return <SpeedQuizGame today={today} onComplete={onComplete} />;
    case 'cultural_trivia':
      return <CulturalTriviaGame today={today} onComplete={onComplete} />;
    default:
      return <div className={styles.questionText}>Unknown challenge type</div>;
  }
}

// ═══════════════════════════════════════════════════════════
// WORD OF THE DAY — Learn word + 3 exercises
// ═══════════════════════════════════════════════════════════

function WordOfTheDayChallenge({ today, onComplete }) {
  const data = useMemo(() => generateWordOfTheDay(today, vocabularyAll), [today]);
  const [stage, setStage] = useState('learn'); // 'learn', 0, 1, 2
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const startTimeRef = useRef(Date.now());

  if (!data) return <div className={styles.questionText}>No vocabulary available</div>;

  const { word, exercises } = data;

  const handleLearnDone = () => {
    setStage(0);
  };

  const handleAnswer = (answer, exerciseIndex) => {
    const exercise = exercises[exerciseIndex];
    const isCorrect = answer === exercise.correctAnswer;

    setSelectedAnswer(answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (exerciseIndex < 2) {
        setStage(exerciseIndex + 1);
      } else {
        // Challenge complete
        const finalCorrect = correctCount + (isCorrect ? 1 : 0);
        onComplete({
          score: finalCorrect / 3,
          timeMs: Date.now() - startTimeRef.current,
          correctAnswers: finalCorrect,
          totalQuestions: 3,
        });
      }
    }, 1200);
  };

  // Learn stage — show the word
  if (stage === 'learn') {
    return (
      <div className={styles.questionContainer}>
        <div className={styles.wordCard}>
          <div className={styles.wordArabic}>{word.arabic}</div>
          {word.transliteration && (
            <div className={styles.wordTransliteration}>{word.transliteration}</div>
          )}
          <div className={styles.wordEnglish}>{word.english}</div>
        </div>
        <p className={styles.questionText}>
          Study this word, then complete 3 quick exercises.
        </p>
        {word.exampleSentence && (
          <p className={styles.transliteration}>Example: {word.exampleSentence}</p>
        )}
        <button className={styles.nextBtn} onClick={handleLearnDone}>
          Ready — Start Exercises
        </button>
      </div>
    );
  }

  // Exercise stages
  const currentExercise = exercises[stage];
  if (!currentExercise) return null;

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionProgress}>
        <span>Exercise {stage + 1} of 3</span>
        <span>{correctCount}/{stage} correct</span>
      </div>

      <p className={styles.questionText}>{currentExercise.promptLabel}</p>

      {currentExercise.type === 'match_meaning' && (
        <div className={styles.arabicDisplay}>{currentExercise.prompt}</div>
      )}
      {currentExercise.type === 'match_arabic' && (
        <div className={styles.questionText} style={{ fontSize: '1.3rem' }}>
          {currentExercise.prompt}
        </div>
      )}
      {currentExercise.type === 'recall' && (
        <p className={styles.questionText}>{currentExercise.prompt}</p>
      )}

      <div className={styles.optionsGrid}>
        {currentExercise.options.map((option, i) => {
          let btnClass = styles.optionBtn;
          if (feedback && option === currentExercise.correctAnswer) {
            btnClass += ` ${styles.optionBtnCorrect}`;
          } else if (feedback && option === selectedAnswer && feedback === 'wrong') {
            btnClass += ` ${styles.optionBtnWrong}`;
          }
          if (feedback) btnClass += ` ${styles.optionBtnDisabled}`;

          return (
            <button
              key={i}
              className={btnClass}
              disabled={!!feedback}
              onClick={() => handleAnswer(option, stage)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          className={`${styles.feedbackText} ${
            feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
          }`}
        >
          {feedback === 'correct' ? '✓ Correct!' : `✗ The answer was: ${currentExercise.correctAnswer}`}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// GRAMMAR CHALLENGE — 5 questions, 2-minute timer
// ═══════════════════════════════════════════════════════════

function GrammarChallengeGame({ today, onComplete }) {
  const questions = useMemo(() => generateGrammarChallenge(today, grammarLessons), [today]);
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Time's up — auto-complete
  useEffect(() => {
    if (timeRemaining === 0) {
      onComplete({
        score: questions.length > 0 ? correctCount / questions.length : 0,
        timeMs: 120000,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
      });
    }
  }, [timeRemaining, correctCount, questions.length, onComplete]);

  if (!questions || questions.length === 0) {
    return <div className={styles.questionText}>No grammar exercises available</div>;
  }

  const question = questions[currentQ];
  if (!question) return null;

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === question.answer;
    setSelectedAnswer(answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        clearInterval(timerRef.current);
        const finalCorrect = correctCount + (isCorrect ? 1 : 0);
        onComplete({
          score: finalCorrect / questions.length,
          timeMs: Date.now() - startTimeRef.current,
          correctAnswers: finalCorrect,
          totalQuestions: questions.length,
        });
      }
    }, 1000);
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionProgress}>
        <span>Question {currentQ + 1} of {questions.length}</span>
        <div
          className={`${styles.grammarTimer} ${timeRemaining < 30 ? styles.grammarTimerDanger : ''}`}
        >
          {formatTime(timeRemaining)}
        </div>
      </div>

      <p className={styles.transliteration}>From: {question.lessonTitle}</p>
      <p className={styles.questionText}>{question.prompt}</p>

      <div className={styles.optionsGrid}>
        {question.options.map((option, i) => {
          let btnClass = styles.optionBtn;
          if (feedback && option === question.answer) {
            btnClass += ` ${styles.optionBtnCorrect}`;
          } else if (feedback && option === selectedAnswer && feedback === 'wrong') {
            btnClass += ` ${styles.optionBtnWrong}`;
          }
          if (feedback) btnClass += ` ${styles.optionBtnDisabled}`;

          return (
            <button
              key={i}
              className={btnClass}
              disabled={!!feedback}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          className={`${styles.feedbackText} ${
            feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
          }`}
        >
          {feedback === 'correct' ? '✓ Correct!' : `✗ Answer: ${question.answer}`}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SPEED QUIZ — 10 questions, 8s each, score by speed + accuracy
// ═══════════════════════════════════════════════════════════

function SpeedQuizGame({ today, onComplete }) {
  const questions = useMemo(() => generateSpeedQuiz(today, vocabularyAll), [today]);
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(8000);
  const startTimeRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());
  const timerRef = useRef(null);

  // Per-question timer
  useEffect(() => {
    questionStartRef.current = Date.now();
    setQuestionTimeLeft(8000);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - questionStartRef.current;
      const remaining = Math.max(0, 8000 - elapsed);
      setQuestionTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        // Time's up for this question — auto-skip
        handleTimeout();
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [currentQ]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!questions || questions.length === 0) {
    return <div className={styles.questionText}>No vocabulary available</div>;
  }

  const question = questions[currentQ];
  if (!question) return null;

  const timePercent = (questionTimeLeft / 8000) * 100;

  function handleTimeout() {
    setFeedback('timeout');
    advanceQuestion(false, 0);
  }

  function handleAnswer(answer) {
    clearInterval(timerRef.current);
    const isCorrect = answer === question.correctAnswer;
    const responseTimeMs = Date.now() - questionStartRef.current;

    setSelectedAnswer(answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    // Score: correct answers get points based on speed (100 max per question)
    // Partial credit: correct but slow (>6s) gets 25 points
    let points = 0;
    if (isCorrect) {
      if (responseTimeMs < 2000) points = 100;
      else if (responseTimeMs < 4000) points = 75;
      else if (responseTimeMs < 6000) points = 50;
      else points = 25; // slow but correct
    }

    if (isCorrect) setCorrectCount((c) => c + 1);
    setTotalScore((s) => s + points);

    advanceQuestion(isCorrect, points);
  }

  function advanceQuestion(isCorrect, points) {
    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);

      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        // Calculate final
        const finalCorrect = correctCount + (isCorrect ? 1 : 0);
        const finalScore = totalScore + points;
        onComplete({
          score: finalCorrect / questions.length,
          timeMs: Date.now() - startTimeRef.current,
          correctAnswers: finalCorrect,
          totalQuestions: questions.length,
          speedScore: finalScore,
          maxSpeedScore: questions.length * 100,
        });
      }
    }, 800);
  }

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionProgress}>
        <span>
          {currentQ + 1}/{questions.length}
        </span>
        <span>{correctCount} correct</span>
      </div>

      {/* Timer bar */}
      <div className={styles.timerBar}>
        <div
          className={`${styles.timerBarFill} ${timePercent < 30 ? styles.timerBarDanger : ''}`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      <div className={styles.arabicDisplay}>{question.arabic}</div>
      {question.transliteration && (
        <div className={styles.transliteration}>{question.transliteration}</div>
      )}

      <p className={styles.questionText}>What does this word mean?</p>

      <div className={styles.optionsGrid}>
        {question.options.map((option, i) => {
          let btnClass = styles.optionBtn;
          if (feedback && option === question.correctAnswer) {
            btnClass += ` ${styles.optionBtnCorrect}`;
          } else if (feedback && option === selectedAnswer && feedback === 'wrong') {
            btnClass += ` ${styles.optionBtnWrong}`;
          }
          if (feedback) btnClass += ` ${styles.optionBtnDisabled}`;

          return (
            <button
              key={i}
              className={btnClass}
              disabled={!!feedback}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {feedback === 'timeout' && (
        <div className={`${styles.feedbackText} ${styles.feedbackWrong}`}>
          ⏰ Time&apos;s up! The answer was: {question.correctAnswer}
        </div>
      )}
      {feedback === 'correct' && (
        <div className={`${styles.feedbackText} ${styles.feedbackCorrect}`}>
          ✓ Correct!
        </div>
      )}
      {feedback === 'wrong' && (
        <div className={`${styles.feedbackText} ${styles.feedbackWrong}`}>
          ✗ The answer was: {question.correctAnswer}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CULTURAL TRIVIA — 5 lore-based questions
// ═══════════════════════════════════════════════════════════

function CulturalTriviaGame({ today, onComplete }) {
  const questions = useMemo(() => generateCulturalTrivia(today, LORE_ENTRIES), [today]);
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const startTimeRef = useRef(Date.now());

  if (!questions || questions.length === 0) {
    return <div className={styles.questionText}>No trivia questions available</div>;
  }

  const question = questions[currentQ];
  if (!question) return null;

  const handleAnswer = (answer) => {
    const isCorrect = answer === question.correctAnswer;
    setSelectedAnswer(answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        const finalCorrect = correctCount + (isCorrect ? 1 : 0);
        onComplete({
          score: finalCorrect / questions.length,
          timeMs: Date.now() - startTimeRef.current,
          correctAnswers: finalCorrect,
          totalQuestions: questions.length,
        });
      }
    }, 1200);
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionProgress}>
        <span>Question {currentQ + 1} of {questions.length}</span>
        <span>{correctCount}/{currentQ} correct</span>
      </div>

      <p className={styles.transliteration}>Lore: {question.loreTitle}</p>
      <p className={styles.questionText}>{question.question}</p>

      <div className={styles.optionsGrid}>
        {question.options.map((option, i) => {
          let btnClass = styles.optionBtn;
          if (feedback && option === question.correctAnswer) {
            btnClass += ` ${styles.optionBtnCorrect}`;
          } else if (feedback && option === selectedAnswer && feedback === 'wrong') {
            btnClass += ` ${styles.optionBtnWrong}`;
          }
          if (feedback) btnClass += ` ${styles.optionBtnDisabled}`;

          return (
            <button
              key={i}
              className={btnClass}
              disabled={!!feedback}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          className={`${styles.feedbackText} ${
            feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
          }`}
        >
          {feedback === 'correct' ? '✓ Correct!' : `✗ Answer: ${question.correctAnswer}`}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPLETE STATE
// ═══════════════════════════════════════════════════════════

function CompleteState({
  _challengeType,
  result,
  currentStreak,
  nextReward,
  unclaimedRewards,
  onClaimReward,
  onClose,
}) {
  if (!result) {
    return (
      <div className={styles.completeContainer}>
        <div className={styles.completeEmoji}>✅</div>
        <h3 className={styles.completeTitle}>Challenge Complete!</h3>
        <button className={styles.doneBtn} onClick={onClose}>
          Done
        </button>
      </div>
    );
  }

  const scorePercent = result.score !== undefined ? Math.round(result.score * 100) : 0;
  const timeSeconds = result.timeMs ? Math.round(result.timeMs / 1000) : 0;
  const xp = result.xpEarned || 0;

  const emoji = scorePercent >= 80 ? '🌟' : scorePercent >= 50 ? '👍' : '💪';

  const progressToNext = nextReward
    ? Math.min((currentStreak / nextReward.days) * 100, 100)
    : 100;

  return (
    <div className={styles.completeContainer}>
      <div className={styles.completeEmoji}>{emoji}</div>
      <h3 className={styles.completeTitle}>Challenge Complete!</h3>

      {/* Score card */}
      <div className={styles.scoreCard}>
        <div className={styles.scoreStat}>
          <span className={styles.scoreValue}>{scorePercent}%</span>
          <span className={styles.scoreLabel}>Score</span>
        </div>
        <div className={styles.scoreStat}>
          <span className={styles.scoreValue}>{timeSeconds}s</span>
          <span className={styles.scoreLabel}>Time</span>
        </div>
        <div className={styles.scoreStat}>
          <span className={styles.scoreValue}>+{xp}</span>
          <span className={styles.scoreLabel}>XP</span>
        </div>
      </div>

      {/* Streak update */}
      <div className={styles.streakUpdate}>
        <span className={styles.streakUpdateLabel}>Current Streak</span>
        <span className={styles.streakUpdateCount}>🔥 {currentStreak} days</span>
        {nextReward && (
          <>
            <div className={styles.rewardProgressBar}>
              <div
                className={styles.rewardProgressFill}
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <span className={styles.rewardTarget}>
              {currentStreak}/{nextReward.days} days to {nextReward.title} ({nextReward.titleArabic})
            </span>
          </>
        )}
      </div>

      {/* Unclaimed rewards */}
      {unclaimedRewards && unclaimedRewards.length > 0 && (
        <>
          {unclaimedRewards.map((reward) => (
            <button
              key={reward.days}
              className={styles.streakRewardEarned}
              onClick={() => onClaimReward(reward.days)}
            >
              🎁 Claim: {reward.title} ({reward.titleArabic}) — +{reward.xpBonus} XP
            </button>
          ))}
        </>
      )}

      <button className={styles.doneBtn} onClick={onClose}>
        Done
      </button>
    </div>
  );
}
