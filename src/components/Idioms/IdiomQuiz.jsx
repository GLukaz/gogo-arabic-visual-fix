/**
 * IdiomQuiz — Multiple-choice quiz testing Arabic idiom comprehension.
 * Phase 94 (IDIOM-03): Idiom-to-meaning and meaning-to-idiom questions.
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { recordIdiomQuiz } from '../../store/slices/idiomSlice.js';
import { ARABIC_IDIOMS, getIdiomById } from '../../data/arabicIdioms.js';
import { generateQuizBatch, calculateQuizScore } from '../../utils/idiomHelpers.js';
import styles from './IdiomQuiz.module.css';

/** Feedback delay before advancing to next question (ms) */
const ADVANCE_DELAY = 1200;

export default function IdiomQuiz({
  idiomId,
  count = 5,
  difficulty = 'medium',
  onComplete,
  onBack,
}) {
  const dispatch = useDispatch();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const questionStartRef = useRef(Date.now());
  const timerRef = useRef(null);

  // Generate questions once on mount
  const questions = useMemo(() => {
    const seed = Date.now();
    if (idiomId) {
      // Quiz only this one idiom — generate variations
      const q = generateQuizBatch(ARABIC_IDIOMS, Math.min(count, 3), seed);
      // Ensure the target idiom is in the mix
      const targetQ = generateQuizBatch(
        ARABIC_IDIOMS.filter((i) => i.id === idiomId).concat(
          ARABIC_IDIOMS.filter((i) => i.id !== idiomId).slice(0, 10)
        ),
        1,
        seed + 42
      );
      return [...targetQ, ...q].slice(0, count);
    }
    // Difficulty-based CEFR filtering
    const cefrMap = {
      easy: ['A1', 'A2'],
      medium: ['A1', 'A2', 'B1'],
      hard: ['A2', 'B1', 'B2'],
    };
    return generateQuizBatch(ARABIC_IDIOMS, count, seed, cefrMap[difficulty] || null);
  }, [idiomId, count, difficulty]);

  const currentQuestion = questions[currentQuestionIdx] || null;

  // Reset timer on each new question
  useEffect(() => {
    questionStartRef.current = Date.now();
    setIsAnswered(false);
    setSelectedOption(null);
  }, [currentQuestionIdx]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAnswer = useCallback(
    (option) => {
      if (isAnswered || !currentQuestion) return;

      const timeMs = Date.now() - questionStartRef.current;
      const correct = option === currentQuestion.correctAnswer;
      const idiom = getIdiomById(currentQuestion.idiomId);

      setSelectedOption(option);
      setIsAnswered(true);

      // Record in Redux
      dispatch(
        recordIdiomQuiz({
          idiomId: currentQuestion.idiomId,
          type: currentQuestion.questionType,
          correct,
          timeMs,
          chosenAnswer: option,
        })
      );

      // Build answer record
      const answer = {
        idiomId: currentQuestion.idiomId,
        questionType: currentQuestion.questionType,
        correct,
        timeMs,
        chosenAnswer: option,
        correctAnswer: currentQuestion.correctAnswer,
        score: calculateQuizScore(correct, timeMs, idiom?.cefrLevel || 'A1'),
      };

      const updatedAnswers = [...userAnswers, answer];
      setUserAnswers(updatedAnswers);

      // Advance after delay
      timerRef.current = setTimeout(() => {
        if (currentQuestionIdx + 1 >= questions.length) {
          // Quiz complete
          setShowResult(true);

          if (onComplete) {
            const totalScore = updatedAnswers.reduce((sum, a) => sum + a.score.total, 0);
            const correctCount = updatedAnswers.filter((a) => a.correct).length;
            const totalTime = updatedAnswers.reduce((sum, a) => sum + a.timeMs, 0);

            onComplete({
              score: totalScore,
              accuracy: Math.round((correctCount / updatedAnswers.length) * 100),
              timeMs: totalTime,
              answers: updatedAnswers,
            });
          }
        } else {
          setCurrentQuestionIdx((prev) => prev + 1);
        }
      }, ADVANCE_DELAY);
    },
    [isAnswered, currentQuestion, currentQuestionIdx, questions, userAnswers, dispatch, onComplete]
  );

  const handleRetry = useCallback(() => {
    setCurrentQuestionIdx(0);
    setUserAnswers([]);
    setShowResult(false);
    setIsAnswered(false);
    setSelectedOption(null);
  }, []);

  // ── Results Screen ──
  if (showResult) {
    const correctCount = userAnswers.filter((a) => a.correct).length;
    const totalScore = userAnswers.reduce((sum, a) => sum + a.score.total, 0);
    const totalTime = userAnswers.reduce((sum, a) => sum + a.timeMs, 0);
    const avgTime = (totalTime / userAnswers.length / 1000).toFixed(1);
    const accuracy = Math.round((correctCount / userAnswers.length) * 100);

    const scoreClass =
      accuracy >= 75
        ? styles.scoreGreen
        : accuracy >= 50
          ? styles.scoreYellow
          : styles.scoreRed;

    return (
      <div className={styles.container} data-testid="quiz-results">
        <div className={styles.resultsCard}>
          <h2 className={styles.resultsTitle}>Quiz Results</h2>
          <div className={`${styles.scoreDisplay} ${scoreClass}`}>
            {correctCount}/{userAnswers.length} Correct ({accuracy}%)
          </div>
          <div className={styles.resultsMeta}>
            <div>Total Score: {totalScore} pts</div>
            <div>Average Time: {avgTime}s per question</div>
          </div>

          {/* Per-question breakdown */}
          <div className={styles.breakdown}>
            {userAnswers.map((ans, idx) => {
              const idiom = getIdiomById(ans.idiomId);
              return (
                <div
                  key={idx}
                  className={`${styles.breakdownRow} ${ans.correct ? styles.breakdownCorrect : styles.breakdownWrong}`}
                >
                  <span className={styles.breakdownIcon}>
                    {ans.correct ? '\u2713' : '\u2717'}
                  </span>
                  <span className={styles.breakdownArabic} dir="rtl">
                    {idiom?.arabic || ans.idiomId}
                  </span>
                  <span className={styles.breakdownTime}>
                    {(ans.timeMs / 1000).toFixed(1)}s
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.resultsActions}>
            <button className={styles.retryBtn} onClick={handleRetry}>
              Try Again
            </button>
            {onBack && (
              <button className={styles.backBtn} onClick={onBack}>
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── No questions ──
  if (!currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          No quiz questions available. Try adjusting your filters.
        </div>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            Back
          </button>
        )}
      </div>
    );
  }

  // ── Question Screen ──
  const isIdiomToMeaning = currentQuestion.questionType === 'idiom-to-meaning';

  return (
    <div className={styles.container}>
      <div className={styles.quizCard}>
        {/* Progress */}
        <div className={styles.quizProgress} data-testid={`question-${currentQuestionIdx + 1}-of-${questions.length}`}>
          Question {currentQuestionIdx + 1} of {questions.length}
        </div>

        {/* Question prompt */}
        <div className={styles.questionPrompt} data-testid="question-prompt">
          <div className={styles.questionLabel}>
            {isIdiomToMeaning ? 'What does this idiom mean?' : 'Which idiom matches this meaning?'}
          </div>
          <div
            className={isIdiomToMeaning ? styles.questionArabic : styles.questionMeaning}
            dir={isIdiomToMeaning ? 'rtl' : 'ltr'}
          >
            {currentQuestion.question}
          </div>
          {isIdiomToMeaning && currentQuestion.questionTransliteration && (
            <div className={styles.questionTransliteration}>
              {currentQuestion.questionTransliteration}
            </div>
          )}
        </div>

        {/* Options */}
        <div className={styles.optionsGrid}>
          {currentQuestion.options.map((option, idx) => {
            let optionClass = styles.optionBtn;

            if (isAnswered) {
              if (option === currentQuestion.correctAnswer) {
                optionClass += ` ${styles.optionCorrect}`;
              } else if (option === selectedOption) {
                optionClass += ` ${styles.optionWrong}`;
              } else {
                optionClass += ` ${styles.optionDisabled}`;
              }
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                role="button"
                aria-label={`option ${idx + 1}`}
                dir={!isIdiomToMeaning ? 'rtl' : 'ltr'}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div
            className={`${styles.feedback} ${
              selectedOption === currentQuestion.correctAnswer
                ? styles.feedbackCorrect
                : styles.feedbackWrong
            }`}
          >
            <div className={styles.feedbackTitle}>
              {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
            </div>
            <div className={styles.feedbackExplanation}>
              {currentQuestion.explanation}
            </div>
          </div>
        )}
      </div>

      {onBack && !isAnswered && (
        <button className={styles.backBtn} onClick={onBack}>
          Back
        </button>
      )}
    </div>
  );
}
