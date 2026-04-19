import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../../hooks/useQuiz.js';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { audioManager } from '../../services/audio.js';
import { selectWordsByDifficulty } from '../../utils/wordSelection.js';
import ArabicToEnglish from './ArabicToEnglish.jsx';
import EnglishToArabic from './EnglishToArabic.jsx';
import EnglishToTypeArabic from './EnglishToTypeArabic.jsx';
import ListenAndChoose from './ListenAndChoose.jsx';
import MatchPairs from './MatchPairs.jsx';
import SentenceBuilder from './SentenceBuilder.jsx';
import RootIdentifier from './RootIdentifier.jsx';
import FillInBlank from './FillInBlank.jsx';
import CategorySort from './CategorySort.jsx';
import Transliteration from './Transliteration.jsx';
import ConjugationPick from './ConjugationPick.jsx';
import GrammarFill from './GrammarFill.jsx';
import WordOrder from './WordOrder.jsx';
import ClozePassage from './ClozePassage.jsx';
import PictureWord from './PictureWord.jsx';
import DialectIdentify from './DialectIdentify.jsx';
import RootExpand from './RootExpand.jsx';
import CulturalContext from './CulturalContext.jsx';
import ProgressBar from './ProgressBar.jsx';
import vocabulary from '../../data/vocabularyAll.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './QuizOverlay.module.css';
import { QUIZ_TYPE_REGISTRY } from '../../data/quizTypes.js';
import { getStats as getQuizStats } from '../../services/quizStatAccumulator.js';

const QUIZ_TYPE_LABELS = Object.fromEntries(
  Object.entries(QUIZ_TYPE_REGISTRY).map(([key, entry]) => [key, entry.label])
);

export default function QuizOverlay() {
  const { quiz, feedback, start, answer, next, close } = useQuiz();
  const overlayData = useSelector((s) => s.ui.quizConfig);
  const playerLevel = useSelector((s) => s.player.level);
  const wordsLearned = useSelector((s) => s.player.wordsLearned);
  const [showSummary, setShowSummary] = useState(false);
  const [localFeedback, setLocalFeedback] = useState(null);

  const focusTrapRef = useFocusTrap(true, null);

  // Wrap close to emit quiz-closed event for BGM resume
  const handleClose = useCallback(() => {
    EventBus.emit(EVENTS.QUIZ_CLOSED);
    close();
  }, [close]);

  // Centralized overlay close with ESC key and unmount safety net
  const handleOverlayClose = useOverlayClose(handleClose, {
    beforeClose: () => {
      // On summary screen, always allow close
      if (showSummary) return true;
      // During active quiz, ask for confirmation
      return window.confirm('Quit quiz? Progress will be lost.');
    },
  });

  // Pause BGM when quiz opens, resume on unmount
  useEffect(() => {
    audioManager.pauseBGM();
    return () => {
      // Safety: resume BGM if component unmounts without explicit close
      audioManager.resumeBGM();
    };
  }, []);

  useEffect(() => {
    if (!quiz.active) {
      const words = overlayData?.words || getRandomWords(5, playerLevel, wordsLearned);
      const type = overlayData?.quizType || null;
      start(words, type);
      setShowSummary(false);
      setLocalFeedback(null);
    }
  }, []);

  const handleAnswer = useCallback((userAnswer) => {
    answer(userAnswer);
    setLocalFeedback({ selected: userAnswer });
    // Determine correctness to play the right SFX — direct call for lower latency
    const word = quiz.currentWord;
    if (word) {
      const normalize = (s) => s.replace(/[\u064B-\u065F\u0670]/g, '').trim();
      let isCorrect = false;
      if (quiz.quizType === 'ar-to-en' || quiz.quizType === 'listen') {
        isCorrect = userAnswer === word.english;
      } else if (quiz.quizType === 'en-to-ar') {
        isCorrect = userAnswer === word.arabic;
      } else if (quiz.quizType === 'transliterate') {
        isCorrect = userAnswer.toLowerCase().trim() === (word.transliteration || word.arabic).toLowerCase().trim();
      } else if (quiz.quizType === 'root-identify') {
        const root = word.root || word.rootLetters || word.arabic.slice(0, 3);
        isCorrect = normalize(userAnswer) === normalize(root);
      } else if (quiz.quizType === 'sentence-build') {
        const expected = (word.exampleSentence?.arabic || word.arabic).split(/\s+/).filter(Boolean).join(' ');
        isCorrect = normalize(userAnswer) === normalize(expected);
      } else if (quiz.quizType === 'category-sort') {
        // Optimistic: trust the hook answer result — SFX handled after answer() resolves
        isCorrect = true; // feedback from hook is authoritative
      } else if (quiz.quizType === 'GrammarFill') {
        isCorrect = quiz.choices.find((c) => c.correct)?.value === userAnswer;
      } else if (quiz.quizType === 'WordOrder') {
        const expected = (word.exampleSentence?.arabic || word.arabic)
          .split(/\s+/).filter(Boolean).join(' ');
        isCorrect = normalize(userAnswer) === normalize(expected);
      } else if (quiz.quizType === 'ClozePassage') {
        isCorrect = normalize(userAnswer) === normalize(word.arabic);
      } else if (quiz.quizType === 'DialectIdentify') {
        isCorrect = word.dialectItem ? userAnswer === word.dialectItem.dialect : false;
      } else if (quiz.quizType === 'RootExpand') {
        // Multi-select: compare selected set to correct set
        try {
          const selectedValues = JSON.parse(userAnswer);
          const correctValues = quiz.choices.filter((c) => c.correct).map((c) => c.value);
          const selectedSet = new Set(selectedValues);
          const correctSet = new Set(correctValues);
          isCorrect = selectedSet.size === correctSet.size &&
            [...correctSet].every((v) => selectedSet.has(v));
        } catch { isCorrect = false; }
      } else if (quiz.quizType === 'CulturalContext') {
        isCorrect = word.culturalItem ? userAnswer === word.culturalItem.correctContext : false;
      } else {
        isCorrect = normalize(userAnswer) === normalize(word.arabic);
      }
      audioManager.playSFX(isCorrect ? 'correct' : 'wrong');
    }
  }, [answer, quiz.currentWord, quiz.quizType]);

  const handleNext = useCallback(() => {
    const done = next();
    if (done) {
      setShowSummary(true);
      audioManager.playSFX('quest');
    }
    setLocalFeedback(null);
  }, [next]);

  const handleMatchComplete = useCallback((perfect) => {
    // Match pairs counts as one question — score all correct if perfect
    const matchWords = quiz.sessionWords.slice(0, 4);
    matchWords.forEach((w, i) => {
      answer(perfect ? w.english : (i === 0 ? 'wrong' : w.english));
    });
    setShowSummary(true);
    audioManager.playSFX('quest');
  }, [quiz.sessionWords, answer]);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

  const buttonProps = reduceMotion
    ? {}
    : { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };

  const handleQuit = useCallback(() => {
    if (window.confirm('Quit quiz? Progress will be lost.')) {
      handleClose();
    }
  }, [handleClose]);

  if (showSummary) {
    return (
      <motion.div
        ref={focusTrapRef}
        className={styles.overlay}
        onClick={handleOverlayClose}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        <motion.div
          className={styles.card}
          onClick={(e) => e.stopPropagation()}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          <div className={styles.summary} role="alert" aria-label="Quiz results">
            <div className={styles.summaryTitle}>Quiz Complete</div>
            <div className={styles.summaryScore} aria-label={`Score: ${quiz.sessionScore} out of ${quiz.sessionTotal}`}>
              {quiz.sessionScore}/{quiz.sessionTotal}
            </div>
            <p className={styles.summaryMsg}>
              {quiz.sessionScore === quiz.sessionTotal
                ? 'Perfect score!'
                : 'Keep practicing!'}
            </p>
            <motion.button
              className={styles.closeBtn}
              onClick={handleOverlayClose}
              aria-label="Continue — close quiz results"
              {...buttonProps}
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Match Pairs mode: show all 4 words at once
  if (quiz.active && quiz.quizType === 'match') {
    const matchWords = quiz.sessionWords.slice(0, 4);
    return (
      <motion.div
        ref={focusTrapRef}
        className={styles.overlay}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        <motion.div
          className={styles.card}
          onClick={(e) => e.stopPropagation()}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          <div className={styles.header}>
            <button className={styles.quitBtn} onClick={handleQuit} aria-label="Quit quiz">Quit</button>
            <span aria-label={`Quiz type: ${QUIZ_TYPE_LABELS['match']}`}>{QUIZ_TYPE_LABELS['match']}</span>
            <div className={styles.headerSpacer} />
          </div>
          <MatchPairs
            words={matchWords}
            onComplete={handleMatchComplete}
          />
        </motion.div>
      </motion.div>
    );
  }

  if (!quiz.active || !quiz.currentWord) {
    return (
      <motion.div
        ref={focusTrapRef}
        className={styles.overlay}
        onClick={handleOverlayClose}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        <motion.div
          className={styles.card}
          onClick={(e) => e.stopPropagation()}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          <div className={styles.emptyState} role="alert">
            <div className={styles.emptyStateTitle}>No Words to Review</div>
            <p className={styles.emptyStateMsg}>
              Explore the world and talk to NPCs to learn new words first!
            </p>
            <motion.button
              className={styles.closeBtn}
              onClick={handleOverlayClose}
              aria-label="Continue — close quiz"
              {...buttonProps}
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const combinedFeedback = feedback
    ? { ...feedback, selected: localFeedback?.selected }
    : null;

  // Calculate current question number (sessionTotal + 1 gives us the current question)
  const currentQuestion = quiz.sessionTotal + 1;
  const totalQuestions = quiz.sessionWords.length;

  return (
    <motion.div
      ref={focusTrapRef}
      className={styles.overlay}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
    >
      <motion.div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        <div className={styles.header}>
          <button className={styles.quitBtn} onClick={handleQuit} aria-label="Quit quiz">Quit</button>
          <span aria-label={`Quiz type: ${QUIZ_TYPE_LABELS[quiz.quizType] || quiz.quizType}`}>{QUIZ_TYPE_LABELS[quiz.quizType] || quiz.quizType}</span>
          <span className={styles.score} aria-label={`Score: ${quiz.sessionScore} out of ${quiz.sessionTotal}`} aria-live="polite">
            {quiz.sessionScore}/{quiz.sessionTotal}
          </span>
        </div>

        <ProgressBar current={currentQuestion} total={totalQuestions} />

        {(() => {
          const communityStats = quiz.currentWord?.id ? getQuizStats(quiz.currentWord.id, quiz.quizType) : null;
          return communityStats && !combinedFeedback ? (
            <p className={styles.communityStat}>
              {communityStats.percent}% of players got this right
            </p>
          ) : null;
        })()}

        {quiz.quizType === 'ar-to-en' && (
          <ArabicToEnglish
            word={quiz.currentWord}
            choices={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'en-to-ar' && (
          <EnglishToArabic
            word={quiz.currentWord}
            choices={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'en-to-type-ar' && (
          <EnglishToTypeArabic
            word={quiz.currentWord}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'listen' && (
          <ListenAndChoose
            word={quiz.currentWord}
            choices={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'sentence-build' && (
          <SentenceBuilder
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'root-identify' && (
          <RootIdentifier
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'fill-blank' && (
          <FillInBlank
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'category-sort' && (
          <CategorySort
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'transliterate' && (
          <Transliteration
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'conjugation' && (
          <ConjugationPick
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'GrammarFill' && (
          <GrammarFill
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'WordOrder' && (
          <WordOrder
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'ClozePassage' && (
          <ClozePassage
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'picture-word' && (
          <PictureWord
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'DialectIdentify' && (
          <DialectIdentify
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'RootExpand' && (
          <RootExpand
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        {quiz.quizType === 'CulturalContext' && (
          <CulturalContext
            word={quiz.currentWord}
            options={quiz.choices}
            feedback={combinedFeedback}
            onAnswer={handleAnswer}
          />
        )}

        <AnimatePresence mode="wait">
          {combinedFeedback && (
            <motion.div
              className={styles.feedbackRow}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className={`${styles.nextBtn} ${combinedFeedback.correct ? styles.nextBtnCorrect : styles.nextBtnWrong}`}
                onClick={handleNext}
                aria-label={combinedFeedback.correct ? 'Correct answer! Go to next question' : 'Go to next question'}
                {...buttonProps}
              >
                {combinedFeedback.correct ? 'Correct! Next' : 'Next'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function getRandomWords(count, playerLevel, wordsLearned) {
  // Use adaptive selection based on player progression
  return selectWordsByDifficulty(vocabulary, count, playerLevel, wordsLearned);
}
