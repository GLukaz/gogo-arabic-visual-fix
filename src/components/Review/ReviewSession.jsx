import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateFsrsCard, addFsrsCard } from '../../store/slices/vocabularySlice.js';
import { addXP, updateStreak } from '../../store/slices/playerSlice.js';
import { incrementReviews } from '../../store/slices/achievementSlice.js';
import { recordPronunciationResult } from '../../store/slices/analyticsSlice.js';
import PronunciationFeedback from '../Arabic/PronunciationFeedback.jsx';
import { checkPerfectQuiz } from '../../store/middleware/achievementMiddleware.js';
import { reviewCard, getDueCards, Rating, getNewCardsForSession, createNewCard } from '../../services/fsrs.js';
import { XP_REWARDS } from '../../utils/xpCalculator.js';
import { shuffle } from '../../utils/shuffle.js';
import { prepareSentenceQuiz, removeDiacritics } from '../../utils/sentenceParser.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import ArabicKeyboard from '../Keyboard/ArabicKeyboard.jsx';
import ProgressBar from '../Quiz/ProgressBar.jsx';
import SentenceBuilder from './SentenceBuilder.jsx';
import DialectVariantsPanel from './DialectVariantsPanel.jsx';
import vocabulary from '../../data/vocabularyAll.js';
import styles from './ReviewSession.module.css';

function generateChoices(correctWord) {
  const others = shuffle(
    vocabulary.filter((w) => w.id !== correctWord.id)
  ).slice(0, 3);
  return shuffle([...others, correctWord]);
}

// Select a random quiz type appropriate for the current word
function selectQuizType(word) {
  const availableTypes = ['ar-to-en', 'en-to-ar', 'en-to-type-ar'];

  // Add sentence-building if the word has example sentence data
  if (word.exampleSentence && word.exampleSentence.arabic && word.exampleSentence.english) {
    availableTypes.push('sentence-building');
    // Weight sentence-building to appear ~20% of the time
    if (Math.random() < 0.2) {
      return 'sentence-building';
    }
  }

  return availableTypes[Math.floor(Math.random() * 3)]; // Pick from first 3 types
}

export default function ReviewSession({ onBack }) {
  const dispatch = useDispatch();
  const cards = useSelector((s) => s.vocabulary.fsrsCards);
  const settings = useSelector((s) => s.settings);
  const formatArabic = useFormatArabic();

  const [sessionCards] = useState(() => {
    const dueIds = getDueCards(cards);
    // Map wordId strings back to { wordId, card } objects for scheduling
    const dueEntries = dueIds
      .map((id) => ({ wordId: id, card: cards[id]?.card }))
      .filter((entry) => entry.card)
      .sort((a, b) => new Date(a.card.due || 0) - new Date(b.card.due || 0))
      .slice(0, 20);

    // PATH-03: If fewer than 20 due cards, fill remaining slots with
    // path-affinity-ordered new words so players encounter path-relevant words first
    if (dueEntries.length < 20) {
      const remaining = 20 - dueEntries.length;
      const newWordIds = getNewCardsForSession(remaining);
      const dueWordIdSet = new Set(dueEntries.map(e => e.wordId));
      const newEntries = newWordIds
        .filter(id => !dueWordIdSet.has(id))
        .map((id) => ({
          wordId: id,
          card: null, // null card signals "new word introduction" (not yet in FSRS)
          isNew: true,
        }));
      dueEntries.push(...newEntries);
    }

    return dueEntries;
  });
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selected, setSelected] = useState(null);
  const [typingInput, setTypingInput] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [quizType, setQuizType] = useState(() => {
    const entry = sessionCards[0];
    if (!entry) return 'ar-to-en';
    const w = vocabulary.find((v) => v.id === entry.wordId);
    return w ? selectQuizType(w) : 'ar-to-en';
  });
  const [choices, setChoices] = useState(() => {
    const entry = sessionCards[0];
    if (!entry) return [];
    const w = vocabulary.find((v) => v.id === entry.wordId);
    return w ? generateChoices(w) : [];
  });
  const [sentenceQuizData, setSentenceQuizData] = useState(() => {
    const entry = sessionCards[0];
    if (!entry) return null;
    const w = vocabulary.find((v) => v.id === entry.wordId);
    return w ? prepareSentenceQuiz(w, vocabulary) : null;
  });
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const autoAdvanceTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Clear auto-advance timer on unmount to prevent dispatching after navigation
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  // Escape key handler - only on summary/empty states
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        // Only allow escape on summary or no reviews screen
        if (done || sessionCards.length === 0) {
          onBack();
        } else if (!answered) {
          // No answer given yet, allow quitting with confirmation
          if (window.confirm('Quit review session? Progress will be saved.')) {
            onBack();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [done, sessionCards.length, answered, onBack]);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.25, ease: 'easeOut' };

  /* ---------- No reviews due ---------- */
  if (sessionCards.length === 0) {
    return (
      <motion.div
        className={styles.container}
        role="main"
        aria-label="Daily review session"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={transition}
      >
        <div className={styles.header} role="banner">
          <button className={styles.quitBtn} onClick={onBack} aria-label="Go back to menu">Back</button>
          <h1 className={styles.headerTitle}>Daily Review</h1>
          <div />
        </div>
        <div className={styles.body}>
          <div className={styles.noReviewMsg} role="status" aria-live="polite">No reviews due!</div>
          <p className={styles.noReviewSub}>Learn more words and come back later.</p>
          <button className={styles.doneBtn} onClick={onBack} aria-label="Return to main menu">Back to Menu</button>
        </div>
      </motion.div>
    );
  }

  /* ---------- Summary screen ---------- */
  if (done) {
    return (
      <motion.div
        className={styles.container}
        role="main"
        aria-label="Review complete"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={transition}
      >
        <div className={styles.header} role="banner">
          <div />
          <h1 className={styles.headerTitle}>Review Complete</h1>
          <div />
        </div>
        <div className={styles.body}>
          <div className={styles.summaryScore} role="status" aria-live="polite" aria-label={`Score: ${score} out of ${total} correct`}>{score}/{total}</div>
          <p className={styles.summaryMsg}>
            {score === total ? 'Perfect review!' : 'Keep it up!'}
          </p>
          <button className={styles.doneBtn} onClick={onBack} aria-label="Return to main menu">Back to Menu</button>
        </div>
      </motion.div>
    );
  }

  const currentEntry = sessionCards[index];
  const currentWord = currentEntry
    ? vocabulary.find((w) => w.id === currentEntry.wordId)
    : null;

  if (!currentWord) {
    if (!done) { setDone(true); }
    return null;
  }

  /* ---------- Handlers ---------- */
  // Auto-rate based on correctness and response time, then advance to next question
  const autoRateAndAdvance = (correct, responseTime) => {
    // Calculate rating based on correctness and time:
    // Wrong answer → Rating 1 (Again)
    // Correct but slow (>10 seconds) → Rating 2 (Hard)
    // Correct in normal time (4-10 seconds) → Rating 3 (Good)
    // Correct and fast (<4 seconds) → Rating 4 (Easy)
    let rating;
    if (!correct) {
      rating = Rating.Again;
    } else if (responseTime > 10) {
      rating = Rating.Hard;
    } else if (responseTime >= 4) {
      rating = Rating.Good;
    } else {
      rating = Rating.Easy;
    }

    // For new word introductions (PATH-03), create FSRS card on first encounter
    const cardToReview = currentEntry.isNew && !currentEntry.card
      ? createNewCard()
      : currentEntry.card;
    if (currentEntry.isNew && !currentEntry.card) {
      dispatch(addFsrsCard({
        wordId: currentEntry.wordId,
        card: cardToReview,
        source: 'review_session_new',
      }));
    }
    const result = reviewCard(cardToReview, rating);
    dispatch(updateFsrsCard({
      wordId: currentEntry.wordId,
      card: result.card,
      log: result.log,
    }));

    // Track review for achievement progress
    dispatch(incrementReviews());

    // Auto-advance after a short delay to show feedback
    autoAdvanceTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      const nextIdx = index + 1;
      if (nextIdx >= sessionCards.length) {
        dispatch(addXP(XP_REWARDS.DAILY_REVIEW_COMPLETE));
        dispatch(updateStreak());
        // Check for perfect review session achievement
        // score/total are stale closures; compute final values from current call
        const finalScore = score + (correct ? 1 : 0);
        const finalTotal = total + 1;
        checkPerfectQuiz(finalScore, finalTotal, dispatch);
        setDone(true);
      } else {
        setIndex(nextIdx);
        setAnswered(false);
        setIsCorrect(false);
        setSelected(null);
        setTypingInput('');
        setTypingDone(false);
        const nextWord = vocabulary.find((w) => w.id === sessionCards[nextIdx].wordId);
        setQuizType(nextWord ? selectQuizType(nextWord) : 'ar-to-en');
        setChoices(nextWord ? generateChoices(nextWord) : []);
        setSentenceQuizData(nextWord ? prepareSentenceQuiz(nextWord, vocabulary) : null);
        setQuestionStartTime(Date.now());
      }
    }, 1500); // 1.5 second delay to show correct/wrong feedback
  };

  const handleAnswer = (answer) => {
    if (answered) return;
    let correct = false;
    if (quizType === 'ar-to-en') correct = answer === currentWord.english;
    else if (quizType === 'en-to-ar') correct = answer === currentWord.arabic;
    setSelected(answer);
    setIsCorrect(correct);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (correct) setScore((s) => s + 1);

    // Auto-rate based on correctness and response time
    const responseTime = (Date.now() - questionStartTime) / 1000; // seconds
    autoRateAndAdvance(correct, responseTime);
  };

  const handleTypingSubmit = () => {
    if (typingDone) return;
    const correct = removeDiacritics(typingInput) === removeDiacritics(currentWord.arabic);
    setIsCorrect(correct);
    setTypingDone(true);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (correct) setScore((s) => s + 1);

    // Auto-rate based on correctness and response time
    const responseTime = (Date.now() - questionStartTime) / 1000; // seconds
    autoRateAndAdvance(correct, responseTime);
  };

  const handleSentenceComplete = (result) => {
    if (answered) return;

    setIsCorrect(result.correct);
    setAnswered(true);
    setTotal((t) => t + 1);
    if (result.correct) setScore((s) => s + 1);

    // Calculate response time and adjust rating based on attempts
    const responseTime = (Date.now() - questionStartTime) / 1000; // seconds

    // For sentence building, adjust rating based on attempts:
    // First try correct → use normal rating
    // Multiple attempts → reduce rating by one level
    let correct = result.correct;
    if (result.attempts > 1 && result.correct) {
      // Multiple attempts: treat as slower response time to get lower rating
      autoRateAndAdvance(true, 12); // Force "Hard" rating
    } else {
      autoRateAndAdvance(correct, responseTime);
    }
  };


  /* ---------- Active review ---------- */
  return (
    <motion.div
      className={styles.container}
      role="main"
      aria-label="Daily review quiz"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={transition}
    >
      <div className={styles.header} role="banner">
        <button className={styles.quitBtn} onClick={onBack} aria-label="Quit review session">Quit</button>
        <h1 className={styles.headerTitle}>Daily Review</h1>
        <div className={styles.headerProgress} aria-label={`Question ${index + 1} of ${sessionCards.length}`}>{index + 1}/{sessionCards.length}</div>
      </div>

      <div className={styles.body}>
        <div className={styles.progressContainer}>
          <ProgressBar current={index + 1} total={sessionCards.length} />
        </div>
        <div className={styles.scoreText} role="status" aria-live="polite" aria-label={`Current score: ${score} out of ${total} correct`}>{score}/{total} correct</div>

        {/* Arabic -> English */}
        {quizType === 'ar-to-en' && (
          <>
            <div className={styles.arabicWord} lang="ar" role="heading" aria-level="2">{formatArabic(currentWord.arabic)}</div>
            {settings.showTransliteration && (
              <div className={styles.transliteration} aria-label={`Transliteration: ${currentWord.transliteration}`}>{currentWord.transliteration}</div>
            )}
            <PronunciationFeedback
              arabicWord={currentWord.arabic}
              onResult={(result) => dispatch(recordPronunciationResult({ wordId: currentWord.id, correct: result.correct, similarity: result.similarity }))}
            />
            <div className={styles.choicesGrid} role="group" aria-label="Answer choices">
              {choices.map((w, _idx) => {
                let extraClass = '';
                let ariaLabel = w.english;
                if (answered) {
                  if (w.id === currentWord.id) {
                    extraClass = styles.choiceCorrect;
                    ariaLabel = `${w.english} - Correct answer`;
                  } else if (w.english === selected && w.id !== currentWord.id) {
                    extraClass = styles.choiceWrong;
                    ariaLabel = `${w.english} - Wrong answer`;
                  }
                }
                return (
                  <button
                    key={w.id}
                    className={`${styles.choice} ${extraClass}`}
                    onClick={() => handleAnswer(w.english)}
                    disabled={answered}
                    aria-label={ariaLabel}
                    aria-pressed={selected === w.english}
                  >
                    {w.english}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* English -> Arabic */}
        {quizType === 'en-to-ar' && (
          <>
            <div className={styles.englishWord} role="heading" aria-level="2">{currentWord.english}</div>
            <div className={styles.choicesGrid} role="group" aria-label="Arabic answer choices">
              {choices.map((w) => {
                let extraClass = '';
                let ariaLabel = `${w.arabic} - ${w.english}`;
                if (answered) {
                  if (w.id === currentWord.id) {
                    extraClass = styles.choiceCorrect;
                    ariaLabel = `${w.arabic} - Correct answer`;
                  } else if (w.arabic === selected && w.id !== currentWord.id) {
                    extraClass = styles.choiceWrong;
                    ariaLabel = `${w.arabic} - Wrong answer`;
                  }
                }
                return (
                  <button
                    key={w.id}
                    className={`${styles.choice} ${styles.choiceArabic} ${extraClass}`}
                    onClick={() => handleAnswer(w.arabic)}
                    disabled={answered}
                    lang="ar"
                    aria-label={ariaLabel}
                    aria-pressed={selected === w.arabic}
                  >
                    {formatArabic(w.arabic)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* English -> Type Arabic */}
        {quizType === 'en-to-type-ar' && (
          <>
            <div className={styles.englishWord}>{currentWord.english}</div>
            <div className={`${styles.inputDisplay} ${typingDone ? (isCorrect ? styles.inputCorrect : styles.inputWrong) : ''}`}>
              {typingInput || '\u200B'}
            </div>
            {typingDone && !isCorrect && (
              <div className={styles.correctAnswer}>
                {formatArabic(currentWord.arabic)}
              </div>
            )}
            {!typingDone && (
              <ArabicKeyboard
                onKeyPress={(k) => setTypingInput(typingInput + k)}
                onBackspace={() => setTypingInput(typingInput.slice(0, -1))}
                onSubmit={handleTypingSubmit}
              />
            )}
          </>
        )}

        {/* Sentence Building */}
        {quizType === 'sentence-building' && sentenceQuizData && (
          <SentenceBuilder
            quizData={sentenceQuizData}
            onComplete={handleSentenceComplete}
            disabled={answered}
          />
        )}

        {/* Dialect variants — shown after answer is revealed */}
        {answered && currentWord && (
          <DialectVariantsPanel wordId={currentWord.id} />
        )}

      </div>
    </motion.div>
  );
}
