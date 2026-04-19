import { useState, useEffect, useMemo } from 'react';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import { PASSAGES, getPassagesByDifficulty } from '../../data/readingPassages.js';
import styles from './ReadingExercise.module.css';

/**
 * ReadingExercise Component
 *
 * Reading comprehension exercises with Arabic passages.
 */
export default function ReadingExercise({ onBack }) {
  const formatArabic = useFormatArabic();
  const [difficulty, setDifficulty] = useState(null);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const passages = useMemo(() => {
    return difficulty ? getPassagesByDifficulty(difficulty) : PASSAGES;
  }, [difficulty]);

  const passage = passages[currentPassageIndex];
  const question = passage?.questions[currentQuestion];
  const totalQuestions = passage?.questions.length || 0;

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResults(false);
    setShowTranslation(false);
    setShowTransliteration(false);
  }, [currentPassageIndex, difficulty]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showResults && question && !selectedAnswer) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= question.options.length) {
          setSelectedAnswer(num - 1);
        }
      }
      if (e.key.toLowerCase() === 't') {
        setShowTranslation(prev => !prev);
      }
      if (e.key === 'Enter') {
        if (selectedAnswer !== null && !showResults) {
          handleSubmitAnswer();
        } else if (showResults && currentPassageIndex < passages.length - 1) {
          handleNextPassage();
        }
      }
      if (e.key === 'Escape') {
        if (showResults) {
          setShowResults(false);
          setCurrentQuestion(0);
          setAnswers([]);
        } else if (difficulty !== null) {
          setDifficulty(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedAnswer, showResults, question, currentPassageIndex, passages.length, difficulty]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const handleNextPassage = () => {
    if (currentPassageIndex < passages.length - 1) {
      setCurrentPassageIndex(currentPassageIndex + 1);
    }
  };

  const calculateScore = () => {
    if (!passage || answers.length === 0) return 0;
    const correct = answers.filter((ans, idx) => ans === passage.questions[idx].correct).length;
    return Math.round((correct / passage.questions.length) * 100);
  };

  if (!difficulty) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Reading Comprehension</h1>
          <h2 className={styles.titleArabic}>فهم القراءة</h2>
          <p className={styles.subtitle}>
            Practice reading Arabic passages and answer comprehension questions
          </p>
        </div>

        <div className={styles.difficultySelector}>
          <p className={styles.difficultyLabel}>Select Difficulty Level:</p>
          {[1, 2, 3, 4].map((level) => {
            const count = getPassagesByDifficulty(level).length;
            return (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={styles.pixelBtnGold}
              >
                Level {level} ({count} passages)
              </button>
            );
          })}
          <button
            onClick={() => setDifficulty('all')}
            className={styles.pixelBtnDark}
          >
            All Levels ({PASSAGES.length} passages)
          </button>
        </div>

        <button onClick={onBack} className={styles.pixelBtnDark}>
          Back to Mini-Games
        </button>
      </div>
    );
  }

  if (!passage) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>No passages available for this difficulty.</p>
        <button onClick={() => setDifficulty(null)} className={styles.pixelBtnGold}>
          Back
        </button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const correctCount = answers.filter((ans, idx) => ans === passage.questions[idx].correct).length;

    return (
      <div className={styles.container}>
        <div className={styles.resultsPanel}>
          <h2 className={styles.resultsTitle}>Results</h2>
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreNumber}>{score}%</div>
            <div className={styles.scoreDetails}>
              {correctCount} out of {totalQuestions} correct
            </div>
          </div>

          <div className={styles.answerReview}>
            {passage.questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correct;

              return (
                <div key={idx} className={styles.reviewItem}>
                  <div className={styles.reviewQuestion}>
                    Q{idx + 1}: {q.question}
                  </div>
                  <div className={isCorrect ? styles.correctAnswer : styles.wrongAnswer}>
                    Your answer: {q.options[userAnswer]}
                    {!isCorrect && ' \u2717'}
                    {isCorrect && ' \u2713'}
                  </div>
                  {!isCorrect && (
                    <div className={styles.correctAnswerHint}>
                      Correct: {q.options[q.correct]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.resultsActions}>
            {currentPassageIndex < passages.length - 1 && (
              <button onClick={handleNextPassage} className={styles.pixelBtnGold}>
                Next Passage
              </button>
            )}
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setAnswers([]);
                setShowResults(false);
              }}
              className={styles.pixelBtnDark}
            >
              Retry
            </button>
            <button onClick={() => setDifficulty(null)} className={styles.pixelBtnDark}>
              Back to Levels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Progress indicator */}
      <div className={styles.progressBar}>
        <div className={styles.progressText}>
          Passage {currentPassageIndex + 1} of {passages.length} |
          Question {currentQuestion + 1} of {totalQuestions}
        </div>
      </div>

      {/* Passage title */}
      <div className={styles.passageHeader}>
        <h2 className={styles.passageTitle}>{passage.title}</h2>
        <h3 className={styles.passageTitleArabic}>{formatArabic(passage.titleArabic)}</h3>
        <div className={styles.difficultyBadge}>Level {passage.difficulty}</div>
      </div>

      {/* Arabic passage */}
      <div className={styles.passageBox}>
        <p className={styles.arabicText}>{formatArabic(passage.arabic)}</p>

        {/* Toggle buttons */}
        <div className={styles.toggleButtons}>
          <button onClick={() => setShowTranslation(!showTranslation)} className={styles.pixelBtnDark}>
            {showTranslation ? 'Hide' : 'Show'} Translation (T)
          </button>
          <button onClick={() => setShowTransliteration(!showTransliteration)} className={styles.pixelBtnDark}>
            {showTransliteration ? 'Hide' : 'Show'} Transliteration
          </button>
        </div>

        {showTranslation && (
          <p className={styles.translationText}>{passage.english}</p>
        )}

        {showTransliteration && (
          <p className={styles.transliterationText}>{passage.transliteration}</p>
        )}
      </div>

      {/* Question */}
      <div className={styles.questionBox}>
        <p className={styles.questionText}>
          Question {currentQuestion + 1}: {question.question}
        </p>
        {question.questionArabic && (
          <p className={styles.questionArabic}>{question.questionArabic}</p>
        )}

        {/* Answer options */}
        <div className={styles.optionsGrid}>
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(idx)}
              className={styles.pixelBtnGold}
            >
              <span className={styles.optionNumber}>{idx + 1}.</span> {option}
            </button>
          ))}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmitAnswer}
          disabled={selectedAnswer === null}
          className={`${styles.submitBtn} ${selectedAnswer === null ? styles.submitBtnDisabled : ''}`}
        >
          Submit Answer (Enter)
        </button>
      </div>
    </div>
  );
}
