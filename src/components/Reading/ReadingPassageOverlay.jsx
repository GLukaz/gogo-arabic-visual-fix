/**
 * ReadingPassageOverlay.jsx
 *
 * Full overlay for graded reading practice with four states:
 *   1. Browse  — list passages filtered by CEFR level, show scores
 *   2. Reading — Arabic text with vocabulary tooltips, translation toggle
 *   3. Questions — comprehension quiz, one question at a time
 *   4. Complete — score summary, XP earned, words encountered
 *
 * Phase 82 (READ-01 + READ-02)
 */

import { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  READING_PASSAGES,
  getPassagesByCefrLevel,
  getReadingPassageById,
} from '../../data/readingPassages.js';
import {
  startPassage,
  completePassage,
  resetCurrent,
  selectCompletedPassages,
} from '../../store/slices/readingSlice.js';
import VocabTooltip from './VocabTooltip.jsx';
import styles from './ReadingPassageOverlay.module.css';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'];
const XP_PER_CORRECT = 10;

/**
 * Build Arabic text with vocabulary highlights wrapped in VocabTooltip.
 */
function renderArabicWithHighlights(textArabic, vocabularyHighlights) {
  if (!vocabularyHighlights || vocabularyHighlights.length === 0) {
    return textArabic;
  }

  // Sort highlights by length (longest first) to avoid partial matches
  const sorted = [...vocabularyHighlights].sort(
    (a, b) => b.arabic.length - a.arabic.length,
  );

  // Build regex from all highlight words
  const escaped = sorted.map((v) =>
    v.arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');

  const parts = textArabic.split(regex);

  return parts.map((part, i) => {
    const vocab = sorted.find((v) => v.arabic === part);
    if (vocab) {
      return (
        <VocabTooltip key={`${vocab.wordId}-${i}`} vocab={vocab}>
          {part}
        </VocabTooltip>
      );
    }
    return part;
  });
}

// ============================================================
// BROWSE STATE
// ============================================================

function BrowseView({ onSelect, completedPassages }) {
  const [filterLevel, setFilterLevel] = useState(null);

  const passages = useMemo(() => {
    return filterLevel ? getPassagesByCefrLevel(filterLevel) : READING_PASSAGES;
  }, [filterLevel]);

  const getLevelClass = (level) => {
    const map = { A1: styles.levelA1, A2: styles.levelA2, B1: styles.levelB1, B2: styles.levelB2 };
    return map[level] || '';
  };

  return (
    <>
      <div className={styles.levelFilter}>
        <button
          className={`${styles.levelBtn} ${!filterLevel ? styles.levelBtnActive : ''}`}
          onClick={() => setFilterLevel(null)}
        >
          All
        </button>
        {CEFR_LEVELS.map((level) => (
          <button
            key={level}
            className={`${styles.levelBtn} ${filterLevel === level ? styles.levelBtnActive : ''}`}
            onClick={() => setFilterLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>

      <div className={styles.passageList}>
        {passages.length === 0 && (
          <div className={styles.emptyState}>No passages found.</div>
        )}
        {passages.map((passage) => {
          const completed = completedPassages[passage.id];
          return (
            <div
              key={passage.id}
              className={styles.passageCard}
              onClick={() => onSelect(passage.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelect(passage.id);
              }}
            >
              <div className={styles.passageInfo}>
                <span className={styles.passageTitle}>{passage.title}</span>
                <span className={styles.passageTitleArabic}>{passage.titleArabic}</span>
                <div className={styles.passageMeta}>
                  <span className={`${styles.levelBadge} ${getLevelClass(passage.cefrLevel)}`}>
                    {passage.cefrLevel}
                  </span>
                  <span>{passage.topic}</span>
                  <span>{passage.wordCount} words</span>
                </div>
              </div>
              <div className={styles.passageScore}>
                {completed ? (
                  <>
                    <span className={styles.scoreText}>{Math.round(completed.score * 100)}%</span>
                    <span className={styles.completedLabel}>Completed</span>
                  </>
                ) : (
                  <span className={styles.notCompletedLabel}>Not started</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ============================================================
// READING STATE
// ============================================================

function ReadingView({ passage, onContinue, currentIndex, total }) {
  const [showTranslation, setShowTranslation] = useState(false);

  const highlightedText = useMemo(
    () => renderArabicWithHighlights(passage.textArabic, passage.vocabularyHighlights),
    [passage],
  );

  return (
    <div className={styles.readingContainer}>
      <div className={styles.passageHeader}>
        <h2 className={styles.readingTitle}>{passage.title}</h2>
        <h3 className={styles.readingTitleArabic}>{passage.titleArabic}</h3>
        <div className={styles.progressIndicator}>
          Passage {currentIndex + 1} of {total}
        </div>
      </div>

      <div className={styles.passageBox}>
        <div className={styles.arabicText} dir="rtl">
          {highlightedText}
        </div>
        {showTranslation && (
          <div className={styles.translationBox}>
            <div className={styles.translationText}>{passage.textEnglish}</div>
          </div>
        )}
      </div>

      <div className={styles.controlRow}>
        <button
          className={`${styles.toggleBtn} ${showTranslation ? styles.toggleBtnActive : ''}`}
          onClick={() => setShowTranslation((prev) => !prev)}
        >
          {showTranslation ? 'Hide Translation' : 'Show Translation'}
        </button>
      </div>

      <button className={styles.continueBtn} onClick={onContinue}>
        Continue to Questions
      </button>
    </div>
  );
}

// ============================================================
// QUESTIONS STATE
// ============================================================

function QuestionsView({ passage, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(false);

  const questions = passage.questions;
  const question = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  const handleSelect = useCallback(
    (idx) => {
      if (answered) return;
      setSelectedIndex(idx);
      setAnswered(true);
      if (idx === question.correctIndex) {
        setCorrectCount((c) => c + 1);
      }
    },
    [answered, question],
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      const finalCorrect = selectedIndex === question.correctIndex
        ? correctCount
        : correctCount; // already incremented in handleSelect
      const score = finalCorrect / questions.length;
      onComplete(score, finalCorrect);
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedIndex(null);
      setAnswered(false);
    }
  }, [isLast, correctCount, questions.length, onComplete, selectedIndex, question]);

  const getOptionClass = (idx) => {
    if (!answered) return styles.optionBtn;
    if (idx === question.correctIndex) return `${styles.optionBtn} ${styles.optionCorrect}`;
    if (idx === selectedIndex && idx !== question.correctIndex) return `${styles.optionBtn} ${styles.optionWrong}`;
    return styles.optionBtn;
  };

  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionProgress}>
        Question {currentQ + 1} of {questions.length}
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionText}>{question.question}</div>
        <div className={styles.questionArabic}>{question.questionArabic}</div>

        <div className={styles.optionsList}>
          {question.options.map((option, idx) => (
            <button
              key={idx}
              className={getOptionClass(idx)}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>

        {answered && (
          <>
            <div
              className={`${styles.feedbackText} ${
                isCorrect ? styles.feedbackCorrect : styles.feedbackWrong
              }`}
            >
              {isCorrect
                ? 'Correct!'
                : `Incorrect. The correct answer is: ${question.options[question.correctIndex]}`}
            </div>
            <button className={styles.nextBtn} onClick={handleNext}>
              {isLast ? 'See Results' : 'Next Question'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPLETE STATE
// ============================================================

function CompleteView({ passage, score, correctCount, totalQuestions, onBack }) {
  const xpEarned = correctCount * XP_PER_CORRECT;
  const vocabWords = passage.vocabularyHighlights || [];

  return (
    <div className={styles.completeContainer}>
      <div className={styles.completeCard}>
        <h2 className={styles.completeTitle}>Reading Complete</h2>

        <div className={styles.scoreDisplay}>{Math.round(score * 100)}%</div>
        <div className={styles.scoreSubtext}>
          {correctCount} of {totalQuestions} correct
        </div>

        <div className={styles.xpEarned}>+{xpEarned} XP</div>

        {vocabWords.length > 0 && (
          <div className={styles.wordsSection}>
            <div className={styles.wordsSectionTitle}>
              Words Encountered ({vocabWords.length})
            </div>
            <div className={styles.wordsList}>
              {vocabWords.map((v) => (
                <span key={v.wordId} className={styles.wordChip}>
                  {v.arabic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.completeActions}>
          <button className={styles.backBtn} onClick={onBack}>
            Back to Passages
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN OVERLAY
// ============================================================

/**
 * ReadingPassageOverlay
 * @param {{ onClose: () => void }} props
 */
export default function ReadingPassageOverlay({ onClose }) {
  const dispatch = useDispatch();
  const completedPassages = useSelector(selectCompletedPassages);

  // Local state machine: 'browse' | 'reading' | 'questions' | 'complete'
  const [view, setView] = useState('browse');
  const [passageId, setPassageId] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const passage = passageId ? getReadingPassageById(passageId) : null;

  // Count total passages for progress indicator
  const currentIndex = passage
    ? READING_PASSAGES.findIndex((p) => p.id === passage.id)
    : 0;

  const handleSelectPassage = useCallback(
    (id) => {
      setPassageId(id);
      setView('reading');
      dispatch(startPassage({ passageId: id }));
    },
    [dispatch],
  );

  const handleContinueToQuestions = useCallback(() => {
    setView('questions');
  }, []);

  const handleComplete = useCallback(
    (score, correctCount) => {
      const wordsEncountered = (passage?.vocabularyHighlights || []).map((v) => v.wordId);
      dispatch(
        completePassage({
          passageId: passage.id,
          score,
          wordsEncountered,
        }),
      );
      setScoreData({ score, correctCount, totalQuestions: passage.questions.length });
      setView('complete');
    },
    [dispatch, passage],
  );

  const handleBackToBrowse = useCallback(() => {
    setView('browse');
    setPassageId(null);
    setScoreData(null);
    dispatch(resetCurrent());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(resetCurrent());
    if (onClose) onClose();
  }, [dispatch, onClose]);

  return (
    <div className={styles.overlay} data-testid="reading-overlay">
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>
          {view === 'browse' ? 'Reading Practice' : passage?.title || ''}
        </h1>
        <button className={styles.closeBtn} onClick={handleClose}>
          Close
        </button>
      </div>

      {view === 'browse' && (
        <BrowseView
          onSelect={handleSelectPassage}
          completedPassages={completedPassages}
        />
      )}

      {view === 'reading' && passage && (
        <ReadingView
          passage={passage}
          onContinue={handleContinueToQuestions}
          currentIndex={currentIndex}
          total={READING_PASSAGES.length}
        />
      )}

      {view === 'questions' && passage && (
        <QuestionsView passage={passage} onComplete={handleComplete} />
      )}

      {view === 'complete' && passage && scoreData && (
        <CompleteView
          passage={passage}
          score={scoreData.score}
          correctCount={scoreData.correctCount}
          totalQuestions={scoreData.totalQuestions}
          onBack={handleBackToBrowse}
        />
      )}
    </div>
  );
}
