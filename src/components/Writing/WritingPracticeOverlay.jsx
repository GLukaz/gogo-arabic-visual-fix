/**
 * WritingPracticeOverlay.jsx
 *
 * Full overlay for Arabic writing practice — level select, canvas practice
 * with ghost templates, score checking, navigation, and session summary.
 *
 * Phase 83 — Arabic Writing Practice (WRITE-01 + WRITE-02)
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WritingCanvas from './WritingCanvas.jsx';
import {
  ARABIC_LETTERS,
  WRITING_EXERCISES,
  DIFFICULTY_LEVELS,
} from '../../data/arabicWritingData.js';
import {
  recordAttempt,
  setLevel,
  addPracticeTime,
  selectCurrentLevel,
  selectLetterScores,
  selectWordScores,
  selectPhraseScores,
  selectLevelProgress,
  selectWritingStats,
  selectAverageScore,
} from '../../store/slices/writingSlice.js';
import styles from './WritingPracticeOverlay.module.css';

// ─── Views ────────────────────────────────────────────────────────────────────

const VIEW_SELECT = 'select';
const VIEW_PRACTICE = 'practice';
const VIEW_SUMMARY = 'summary';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getItemsForLevel(level) {
  if (level === 'isolated') return ARABIC_LETTERS;
  if (level === 'connected') return WRITING_EXERCISES.connected;
  if (level === 'phrases') return WRITING_EXERCISES.phrases;
  return [];
}

function getItemDisplay(item, level) {
  if (level === 'isolated') {
    return { arabic: item.letter, english: item.name, sub: item.nameArabic };
  }
  return { arabic: item.arabic, english: item.english, sub: item.transliteration || '' };
}

function getItemId(item, level) {
  return item.id;
}

function getItemType(level) {
  if (level === 'isolated') return 'letter';
  if (level === 'connected') return 'word';
  return 'phrase';
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent!';
  if (score >= 50) return 'Good!';
  return 'Try again';
}

function getScoreClass(score) {
  if (score >= 80) return 'excellent';
  if (score >= 50) return 'good';
  return 'low';
}

// ─── Component ────────────────────────────────────────────────────────────────

function WritingPracticeOverlay({ onClose }) {
  const dispatch = useDispatch();
  const currentLevel = useSelector(selectCurrentLevel);
  const letterScores = useSelector(selectLetterScores);
  const wordScores = useSelector(selectWordScores);
  const phraseScores = useSelector(selectPhraseScores);
  const stats = useSelector(selectWritingStats);
  const avgScore = useSelector(selectAverageScore);

  const [view, setView] = useState(VIEW_SELECT);
  const [itemIndex, setItemIndex] = useState(0);
  const [lastScore, setLastScore] = useState(null);
  const [sessionScores, setSessionScores] = useState([]);
  const sessionStartRef = useRef(Date.now());
  const canvasKeyRef = useRef(0); // force canvas remount on navigation

  const items = useMemo(() => getItemsForLevel(currentLevel), [currentLevel]);
  const currentItem = items[itemIndex] || null;

  // Track practice time on unmount / view change away from practice
  useEffect(() => {
    if (view !== VIEW_PRACTICE) return;
    sessionStartRef.current = Date.now();
    return () => {
      const elapsed = Math.round((Date.now() - sessionStartRef.current) / 1000);
      if (elapsed > 0) {
        dispatch(addPracticeTime(elapsed));
      }
    };
  }, [view, dispatch]);

  // ─── Level Select ───────────────────────────────────────────────────

  const handleSelectLevel = useCallback((levelId) => {
    dispatch(setLevel(levelId));
    setItemIndex(0);
    setLastScore(null);
    setSessionScores([]);
    canvasKeyRef.current += 1;
    setView(VIEW_PRACTICE);
  }, [dispatch]);

  // ─── Navigation ─────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (itemIndex < items.length - 1) {
      setItemIndex((i) => i + 1);
      setLastScore(null);
      canvasKeyRef.current += 1;
    } else {
      // End of level — show summary
      setView(VIEW_SUMMARY);
    }
  }, [itemIndex, items.length]);

  const handlePrev = useCallback(() => {
    if (itemIndex > 0) {
      setItemIndex((i) => i - 1);
      setLastScore(null);
      canvasKeyRef.current += 1;
    }
  }, [itemIndex]);

  // ─── Score ──────────────────────────────────────────────────────────

  const handleScoreComputed = useCallback((score) => {
    setLastScore(score);
    setSessionScores((prev) => [...prev, score]);
    if (currentItem) {
      dispatch(recordAttempt({
        id: getItemId(currentItem, currentLevel),
        score,
        type: getItemType(currentLevel),
      }));
    }
  }, [currentItem, currentLevel, dispatch]);

  // ─── TTS Pronunciation ─────────────────────────────────────────────

  const handleSpeak = useCallback(() => {
    if (!currentItem) return;
    const display = getItemDisplay(currentItem, currentLevel);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(display.arabic);
      utterance.lang = 'ar';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentItem, currentLevel]);

  // ─── Template data for the current item ─────────────────────────────

  const templateStrokes = useMemo(() => {
    if (!currentItem) return [];
    if (currentLevel === 'isolated') {
      return currentItem.strokeOrder || [];
    }
    // For words/phrases, no individual stroke template — user practices freehand
    return [];
  }, [currentItem, currentLevel]);

  const templateDots = useMemo(() => {
    if (!currentItem || currentLevel !== 'isolated') return [];
    return currentItem.dots || [];
  }, [currentItem, currentLevel]);

  // ─── Get existing best score ────────────────────────────────────────

  const existingBest = useMemo(() => {
    if (!currentItem) return null;
    const id = getItemId(currentItem, currentLevel);
    const bucket =
      currentLevel === 'isolated' ? letterScores :
      currentLevel === 'connected' ? wordScores :
      phraseScores;
    return bucket[id] || null;
  }, [currentItem, currentLevel, letterScores, wordScores, phraseScores]);

  // ─── Render: Level Select ───────────────────────────────────────────

  if (view === VIEW_SELECT) {
    return (
      <div className={styles.overlay} data-testid="writing-overlay">
        <div className={styles.panel}>
          <div className={styles.header}>
            <h2 className={styles.title}>Arabic Writing Practice</h2>
            <p className={styles.titleArabic}>تمرين الكتابة العربية</p>
            {onClose && (
              <button className={styles.closeBtn} onClick={onClose} data-testid="close-btn">
                &times;
              </button>
            )}
          </div>

          <div className={styles.levelGrid}>
            {DIFFICULTY_LEVELS.map((level) => {
              const count = getItemsForLevel(level.id).length;
              return (
                <button
                  key={level.id}
                  className={styles.levelCard}
                  onClick={() => handleSelectLevel(level.id)}
                  data-testid={`level-${level.id}`}
                >
                  <span className={styles.levelLabel}>{level.label}</span>
                  <span className={styles.levelLabelAr}>{level.labelArabic}</span>
                  <span className={styles.levelCount}>{count} items</span>
                </button>
              );
            })}
          </div>

          {stats.totalAttempts > 0 && (
            <div className={styles.statsBar}>
              <span>Practiced: {stats.totalItems} items</span>
              <span>Attempts: {stats.totalAttempts}</span>
              <span>Avg Score: {avgScore}%</span>
              <span>Time: {Math.round(stats.totalPracticeTime / 60)}m</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Render: Practice ───────────────────────────────────────────────

  if (view === VIEW_PRACTICE && currentItem) {
    const display = getItemDisplay(currentItem, currentLevel);
    const progress = Math.round(((itemIndex + 1) / items.length) * 100);

    return (
      <div className={styles.overlay} data-testid="writing-overlay">
        <div className={styles.panel}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={() => setView(VIEW_SELECT)}>
              &larr; Back
            </button>
            <span className={styles.levelTag}>
              {DIFFICULTY_LEVELS.find((l) => l.id === currentLevel)?.label}
            </span>
            {onClose && (
              <button className={styles.closeBtn} onClick={onClose} data-testid="close-btn">
                &times;
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className={styles.progressBarOuter}>
            <div className={styles.progressBarInner} style={{ width: `${progress}%` }} />
            <span className={styles.progressLabel}>{itemIndex + 1} / {items.length}</span>
          </div>

          {/* Current item display */}
          <div className={styles.itemDisplay}>
            <span className={styles.arabicLarge}>{display.arabic}</span>
            <span className={styles.englishLabel}>{display.english}</span>
            {display.sub && <span className={styles.subLabel}>{display.sub}</span>}
            <button className={styles.speakBtn} onClick={handleSpeak} title="Pronounce">
              &#128266;
            </button>
          </div>

          {/* Canvas */}
          <WritingCanvas
            key={canvasKeyRef.current}
            templateStrokes={templateStrokes}
            templateDots={templateDots}
            onScoreComputed={handleScoreComputed}
            size={360}
          />

          {/* Score feedback */}
          {lastScore !== null && (
            <div className={`${styles.scoreFeedback} ${styles[getScoreClass(lastScore)]}`}>
              <span className={styles.scoreValue}>{lastScore}%</span>
              <span className={styles.scoreLabel}>{getScoreLabel(lastScore)}</span>
            </div>
          )}

          {/* Existing best */}
          {existingBest && (
            <div className={styles.bestScore}>
              Best: {existingBest.bestScore}% ({existingBest.attempts} attempts)
            </div>
          )}

          {/* Navigation */}
          <div className={styles.navRow}>
            <button
              className={styles.navBtn}
              onClick={handlePrev}
              disabled={itemIndex === 0}
            >
              &larr; Prev
            </button>
            <button
              className={styles.navBtn}
              onClick={handleNext}
            >
              {itemIndex < items.length - 1 ? 'Next \u2192' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Summary ────────────────────────────────────────────────

  if (view === VIEW_SUMMARY) {
    const sessionAvg = sessionScores.length > 0
      ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
      : 0;
    const sessionBest = sessionScores.length > 0 ? Math.max(...sessionScores) : 0;
    const elapsed = Math.round((Date.now() - sessionStartRef.current) / 1000);

    return (
      <div className={styles.overlay} data-testid="writing-overlay">
        <div className={styles.panel}>
          <div className={styles.header}>
            <h2 className={styles.title}>Session Complete</h2>
            {onClose && (
              <button className={styles.closeBtn} onClick={onClose} data-testid="close-btn">
                &times;
              </button>
            )}
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryValue}>{sessionScores.length}</span>
              <span className={styles.summaryLabel}>Items Practiced</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryValue}>{sessionAvg}%</span>
              <span className={styles.summaryLabel}>Average Score</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryValue}>{sessionBest}%</span>
              <span className={styles.summaryLabel}>Best Score</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryValue}>
                {elapsed >= 60 ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s` : `${elapsed}s`}
              </span>
              <span className={styles.summaryLabel}>Time Spent</span>
            </div>
          </div>

          <div className={styles.summaryActions}>
            <button
              className={styles.navBtn}
              onClick={() => {
                setItemIndex(0);
                setLastScore(null);
                setSessionScores([]);
                canvasKeyRef.current += 1;
                setView(VIEW_PRACTICE);
              }}
            >
              Practice Again
            </button>
            <button
              className={styles.navBtn}
              onClick={() => setView(VIEW_SELECT)}
            >
              Change Level
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default WritingPracticeOverlay;
