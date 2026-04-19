import { useState, useCallback, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import { prepareSentenceQuiz } from '../../utils/sentenceParser.js';
import { shuffle } from '../../utils/shuffle.js';
import SentenceBuilder from './SentenceBuilder.jsx';
import ProgressBar from '../Quiz/ProgressBar.jsx';
import vocabulary from '../../data/vocabularyAll.js';
import styles from './SentencePractice.module.css';

const CATEGORIES = ['all', 'adjectives', 'greetings', 'numbers', 'food', 'colors', 'family', 'directions', 'time', 'verbs'];
const DIFFICULTIES = [1, 2, 3, 4, 5];

function SentencePractice({ onBack }) {
  useSelector((s) => s.settings);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [practiceWords, setPracticeWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentQuizData, setCurrentQuizData] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const availableWords = useMemo(() => {
    return vocabulary.filter(w =>
      w.exampleSentence &&
      w.exampleSentence.arabic &&
      w.exampleSentence.english &&
      (selectedCategory === 'all' || w.category === selectedCategory) &&
      (!selectedDifficulty || w.difficulty === selectedDifficulty)
    );
  }, [selectedCategory, selectedDifficulty]);

  const startPractice = useCallback(() => {
    if (availableWords.length === 0) return;
    const words = shuffle(availableWords).slice(0, 10);
    setPracticeWords(words);
    setCurrentIndex(0);
    setScore(0);
    setTotal(0);
    setStarted(true);
    setDone(false);
    setIsAnswered(false);
    const quizData = prepareSentenceQuiz(words[0], vocabulary);
    setCurrentQuizData(quizData);
  }, [availableWords]);

  const handleComplete = useCallback((result) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setTotal(prev => prev + 1);
    if (result.correct) {
      setScore(prev => prev + 1);
    }
  }, [isAnswered]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= practiceWords.length) {
      setDone(true);
      return;
    }
    setCurrentIndex(nextIndex);
    setIsAnswered(false);
    const nextWord = practiceWords[nextIndex];
    const quizData = prepareSentenceQuiz(nextWord, vocabulary);
    setCurrentQuizData(quizData);
  }, [currentIndex, practiceWords]);

  const handleRetry = useCallback(() => {
    setStarted(false);
    setDone(false);
    setIsAnswered(false);
    setCurrentIndex(0);
    setScore(0);
    setTotal(0);
    setCurrentQuizData(null);
  }, []);

  // Setup screen
  if (!started && !done) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onBack}>Back</button>
          <div className={styles.headerTitle}>Sentence Practice</div>
          <div />
        </div>

        <div className={styles.body}>
          <div className={styles.difficultyLabel}>Filter by Category:</div>
          <div className={styles.filterRow}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? styles.filterBtnActive : styles.filterBtn}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.difficultyLabel}>Filter by Difficulty:</div>
          <div className={styles.filterRow}>
            <button
              className={selectedDifficulty === null ? styles.filterBtnActive : styles.filterBtn}
              onClick={() => setSelectedDifficulty(null)}
            >
              All
            </button>
            {DIFFICULTIES.map(diff => (
              <button
                key={diff}
                className={selectedDifficulty === diff ? styles.filterBtnActive : styles.filterBtn}
                onClick={() => setSelectedDifficulty(diff)}
              >
                Level {diff}
              </button>
            ))}
          </div>

          {availableWords.length > 0 ? (
            <>
              <div className={styles.noWordsSub}>
                {availableWords.length} sentence{availableWords.length !== 1 ? 's' : ''} available
              </div>
              <button className={styles.startBtn} onClick={startPractice}>
                Start Practice
              </button>
            </>
          ) : (
            <>
              <div className={styles.noWordsMsg}>No sentences available</div>
              <div className={styles.noWordsSub}>
                Try selecting a different category or difficulty level.
                Not all words have example sentences.
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Summary screen
  if (done) {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div />
          <div className={styles.headerTitle}>Practice Complete</div>
          <div />
        </div>

        <div className={styles.body}>
          <div className={styles.summaryContainer}>
            <div className={styles.summaryScore}>{score}/{total}</div>
            <div className={styles.summaryMsg}>
              {percentage === 100 ? 'Perfect score!' : percentage >= 80 ? 'Great work!' : 'Keep practicing!'}
            </div>
            <button className={styles.startBtn} onClick={handleRetry}>
              Practice Again
            </button>
            <div className={styles.backBtnMargin}>
              <button className={styles.backBtn} onClick={onBack}>
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Practice in progress
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>Quit</button>
        <div className={styles.headerTitle}>Sentence Practice</div>
        <div className={styles.headerProgress}>
          {currentIndex + 1}/{practiceWords.length}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.progressContainer}>
          <ProgressBar current={currentIndex + 1} total={practiceWords.length} />
        </div>

        <div className={styles.scoreText}>{score}/{total} correct</div>

        {currentQuizData && (
          <SentenceBuilder
            quizData={currentQuizData}
            onComplete={handleComplete}
            disabled={isAnswered}
          />
        )}

        {isAnswered && (
          <button className={styles.nextBtn} onClick={handleNext}>
            {currentIndex + 1 >= practiceWords.length ? 'View Results' : 'Next Sentence'}
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(SentencePractice);
