import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { COLORS, FONTS } from '../../styles/theme.js';
import {
  selectNextItem,
  assignCefrLevel,
  shouldEarlyExit,
  dropOneTier,
  computeRawScore,
} from '../../services/placementEngine.js';
import { PLACEMENT_ITEMS } from '../../data/placementTest.js';
import styles from './PlacementTestOverlay.module.css';

const reduceMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const transition = reduceMotion
  ? { duration: 0.1 }
  : { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

/**
 * PlacementTestOverlay
 *
 * Full-screen 3-phase placement test:
 *   intro    → Begin Test / Skip
 *   testing  → Adaptive questions one at a time (max 20, early exit at 10 consecutive correct)
 *   result   → CEFR level assignment with Start Lower escape hatch
 *
 * Props:
 *   onComplete(assignedLevel, rawScore, storedLevel) — called when player accepts result
 *   onSkip()                                         — called when player skips / quits
 */
export default function PlacementTestOverlay({ onComplete, onSkip }) {
  // ── State machine ────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('intro'); // 'intro' | 'testing' | 'result'
  const [answers, setAnswers] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [levelEstimate, setLevelEstimate] = useState('A1');
  const [answeredIds, setAnsweredIds] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState(null); // { rawLevel, assignedLevel, storedLevel }

  const feedbackTimerRef = useRef(null);

  // Focus trap (active for all phases)
  const focusTrapRef = useFocusTrap(true, phase === 'intro' ? onSkip : null);

  // Clean up feedback timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const computeResult = useCallback((finalAnswers) => {
    const rawScore = computeRawScore(finalAnswers);
    const res = assignCefrLevel(rawScore, finalAnswers.length);
    setResult(res);
    setPhase('result');
  }, []);

  const advanceToNextItem = useCallback((newAnsweredIds, newLevelEstimate, newAnswers) => {
    // Check early exit
    if (shouldEarlyExit(newAnswers)) {
      computeResult(newAnswers);
      return;
    }
    // Check question cap
    if (newAnsweredIds.length >= 20) {
      computeResult(newAnswers);
      return;
    }
    // Select next item
    const next = selectNextItem(newAnsweredIds, newLevelEstimate, newAnswers);
    if (!next) {
      computeResult(newAnswers);
      return;
    }
    setCurrentItem(next);
    setSelectedOption(null);
    setShowFeedback(false);
  }, [computeResult]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleBeginTest = useCallback(() => {
    // Pick the first item before entering testing phase
    const firstItem = selectNextItem([], 'A1', []);
    if (!firstItem) {
      // Bank empty — fall back to skip
      onSkip();
      return;
    }
    setCurrentItem(firstItem);
    setPhase('testing');
  }, [onSkip]);

  const handleOptionClick = useCallback((option) => {
    if (showFeedback || !currentItem) return;

    const correct = option === currentItem.correctAnswer;
    setSelectedOption(option);
    setShowFeedback(true);

    feedbackTimerRef.current = setTimeout(() => {
      // Build updated state
      const newAnswer = { itemId: currentItem.id, correct };
      const newAnswers = [...answers, newAnswer];
      const newAnsweredIds = [...answeredIds, currentItem.id];

      // Update level estimate (IRT: correct→up, wrong→down)
      const LEVEL_ORDER = ['Pre-A1', 'A1', 'A2', 'B1'];
      const currentIdx = LEVEL_ORDER.indexOf(levelEstimate);
      let newLevelEstimate;
      if (correct) {
        newLevelEstimate = LEVEL_ORDER[Math.min(currentIdx + 1, LEVEL_ORDER.length - 1)];
      } else {
        newLevelEstimate = LEVEL_ORDER[Math.max(currentIdx - 1, 0)];
      }

      setAnswers(newAnswers);
      setAnsweredIds(newAnsweredIds);
      setLevelEstimate(newLevelEstimate);

      advanceToNextItem(newAnsweredIds, newLevelEstimate, newAnswers);
    }, 800);
  }, [showFeedback, currentItem, answers, answeredIds, levelEstimate, advanceToNextItem]);

  const handleAcceptResult = useCallback(() => {
    if (!result) return;
    const rawScore = computeRawScore(answers);
    onComplete(result.assignedLevel, rawScore, result.storedLevel);
  }, [result, answers, onComplete]);

  const handleStartLower = useCallback(() => {
    if (!result) return;
    const rawScore = computeRawScore(answers);
    const lowerLevel = dropOneTier(result.assignedLevel);
    // storedLevel: Pre-A1 → A1
    const storedLevel = lowerLevel === 'Pre-A1' ? 'A1' : lowerLevel;
    onComplete(lowerLevel, rawScore, storedLevel);
  }, [result, answers, onComplete]);

  // ── Render helpers ───────────────────────────────────────────────────────

  const getChoiceStyle = useCallback((option) => {
    const base = {
      fontFamily: FONTS.pixel,
      fontSize: '11px',
      padding: '14px 22px',
      border: `4px solid ${COLORS.dark}`,
      background: COLORS.beige,
      color: COLORS.dark,
      cursor: showFeedback ? 'default' : 'pointer',
      textAlign: 'left',
      letterSpacing: '0.5px',
      width: '100%',
      boxShadow: `
        inset -3px -3px 0px 0px rgba(0,0,0,0.08),
        inset 3px 3px 0px 0px rgba(255,255,255,0.4)
      `,
      imageRendering: 'pixelated',
      transition: 'none',
    };

    if (showFeedback) {
      if (option === currentItem?.correctAnswer) {
        return {
          ...base,
          background: 'rgba(46,204,113,0.2)',
          borderColor: COLORS.green,
          boxShadow: `
            inset -3px -3px 0px 0px rgba(0,0,0,0.08),
            inset 3px 3px 0px 0px rgba(46,204,113,0.3)
          `,
        };
      }
      if (option === selectedOption && option !== currentItem?.correctAnswer) {
        return {
          ...base,
          background: 'rgba(240,49,49,0.15)',
          borderColor: COLORS.red,
          boxShadow: `
            inset -3px -3px 0px 0px rgba(0,0,0,0.08),
            inset 3px 3px 0px 0px rgba(240,49,49,0.2)
          `,
        };
      }
    }

    return base;
  }, [showFeedback, selectedOption, currentItem]);

  // ── Render ────────────────────────────────────────────────────────────────

  // ── Phase: intro ──
  if (phase === 'intro') {
    return (
      <motion.div
        ref={focusTrapRef}
        className={styles.overlay}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
        role="dialog"
        aria-modal="true"
        aria-label="CEFR Placement Test"
      >
        <motion.div
          className={styles.panel}
          onClick={(e) => e.stopPropagation()}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          <div
            className={styles.title}
            style={{ fontFamily: FONTS.pixel }}
          >
            CEFR Placement Test
          </div>
          <div
            className={styles.titleArabic}
            lang="ar"
            style={{ fontFamily: FONTS.arabicDisplay }}
          >
            اختبار تحديد المستوى
          </div>
          <p className={styles.explanation}>
            Answer questions to find your Arabic level. The test adapts to your
            ability — answer correctly and questions get harder.
          </p>
          <p className={styles.explanation} style={{ fontSize: '10px', opacity: 0.75 }}>
            Up to 20 questions. Ends early if you answer 10 in a row correctly.
          </p>

          <div className={styles.btnGroup}>
            <button
              className={styles.btnGold}
              onClick={handleBeginTest}
              style={{ fontFamily: FONTS.pixel }}
            >
              Begin Test
            </button>
            <button
              className={styles.btnSecondary}
              onClick={onSkip}
              style={{ fontFamily: FONTS.pixel }}
            >
              Skip — Start at Beginner
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ── Phase: testing ──
  if (phase === 'testing' && currentItem) {
    const questionNumber = answeredIds.length + 1;
    const totalAvailable = Math.min(20, PLACEMENT_ITEMS.length);

    return (
      <motion.div
        ref={focusTrapRef}
        className={styles.overlay}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
        role="dialog"
        aria-modal="true"
        aria-label={`Placement question ${questionNumber}`}
      >
        <motion.div
          className={styles.panel}
          onClick={(e) => e.stopPropagation()}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          <div className={styles.header}>
            <div className={styles.progress} style={{ fontFamily: FONTS.pixel }}>
              Question {questionNumber} / {totalAvailable}
            </div>
            <button
              className={styles.quitLink}
              onClick={onSkip}
              style={{ fontFamily: FONTS.pixel }}
              aria-label="Quit test and start at beginner level"
            >
              Quit Test
            </button>
          </div>

          {currentItem.arabic && (
            <div
              className={styles.arabicText}
              lang="ar"
              dir="rtl"
              style={{ fontFamily: FONTS.arabicDisplay, color: COLORS.gold }}
            >
              {currentItem.arabic}
            </div>
          )}

          <div
            className={styles.prompt}
            style={{ fontFamily: FONTS.pixel }}
          >
            {currentItem.prompt}
          </div>

          <div className={styles.choices} role="group" aria-label="Answer choices">
            {currentItem.options.map((option, i) => (
              <button
                key={i}
                style={getChoiceStyle(option)}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                aria-label={`Option: ${option}`}
                aria-pressed={selectedOption === option}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ── Phase: result ──
  if (phase === 'result' && result) {
    const rawScore = computeRawScore(answers);
    const totalAnswered = answers.length;
    const lowerLevel = dropOneTier(result.assignedLevel);
    const atFloor = lowerLevel === result.assignedLevel;

    return (
      <motion.div
        ref={focusTrapRef}
        className={styles.overlay}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
        role="dialog"
        aria-modal="true"
        aria-label="Placement test result"
      >
        <motion.div
          className={styles.panel}
          onClick={(e) => e.stopPropagation()}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition}
        >
          <div
            className={styles.title}
            style={{ fontFamily: FONTS.pixel }}
          >
            Your Arabic Level
          </div>

          <div
            className={styles.resultBadge}
            style={{ fontFamily: FONTS.pixel, color: COLORS.xpGold }}
            aria-label={`Assigned level: ${result.assignedLevel}`}
          >
            {result.assignedLevel}
          </div>

          <p className={styles.explanation} style={{ fontFamily: FONTS.pixel }}>
            Based on your answers, we recommend starting at{' '}
            <strong>{result.assignedLevel}</strong>. This is one level below
            your test score ({result.rawLevel}) to ensure a comfortable
            learning experience.
          </p>

          <div
            className={styles.score}
            style={{ fontFamily: FONTS.pixel }}
          >
            {rawScore} / {totalAnswered} correct
          </div>

          <div className={styles.btnGroup}>
            <button
              className={styles.btnGold}
              onClick={handleAcceptResult}
              style={{ fontFamily: FONTS.pixel }}
            >
              Start at {result.assignedLevel}
            </button>

            {!atFloor && (
              <button
                className={styles.btnSecondary}
                onClick={handleStartLower}
                style={{ fontFamily: FONTS.pixel }}
              >
                Start Lower ({lowerLevel})
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Fallback: should not reach here during normal flow
  return null;
}
