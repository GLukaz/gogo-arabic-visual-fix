/**
 * BreakSuggestion — Non-blocking toast that appears when a break is suggested.
 *
 * Phase 87: Difficulty Curve Engine
 *
 * Features:
 * - Gentle, non-judgmental tone (Arabic + English)
 * - Shows study stats (questions answered, accuracy, time)
 * - "Continue" and "Take a Break" buttons
 * - Dismissible but re-appears after 10 minutes if ignored
 * - Respects prefers-reduced-motion
 */

import { useCallback, useEffect, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { acknowledgeBreak } from '../../store/slices/difficultySlice.js';
import {
  selectShouldBreak,
  selectSessionStats,
  selectRecentAccuracy,
} from '../../store/slices/difficultySlice.js';
import styles from './BreakSuggestion.module.css';

/** Re-suggest interval after dismissal (10 minutes). */
const RE_SUGGEST_DELAY_MS = 10 * 60 * 1000;

function BreakSuggestion() {
  const dispatch = useDispatch();
  const shouldBreak = useSelector(selectShouldBreak);
  const sessionStats = useSelector(selectSessionStats);
  const accuracy = useSelector(selectRecentAccuracy);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show when shouldBreak becomes true (and not dismissed)
  useEffect(() => {
    if (shouldBreak && !dismissed) {
      setVisible(true);
    }
  }, [shouldBreak, dismissed]);

  // Re-suggest after 10 minutes if dismissed
  useEffect(() => {
    if (!dismissed) return;

    const timer = setTimeout(() => {
      setDismissed(false);
      // If break is still suggested, it will re-appear via the other effect
    }, RE_SUGGEST_DELAY_MS);

    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleContinue = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    dispatch(acknowledgeBreak());
  }, [dispatch]);

  const handleTakeBreak = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    dispatch(acknowledgeBreak());
    // The parent app can listen for this state change to show a break screen
  }, [dispatch]);

  if (!visible) return null;

  const accuracyPct = Math.round(accuracy * 100);
  const isAccuracyDeclining = accuracy < 0.65;

  return (
    <div className={styles.overlay} role="alertdialog" aria-label="Break suggestion">
      <div className={styles.toast}>
        {/* Arabic heading */}
        <p className={styles.arabicText} dir="rtl" lang="ar">
          حان وقت الراحة
        </p>

        {/* English heading */}
        <h2 className={styles.title}>Time for a Break</h2>

        {/* Contextual message */}
        <p className={styles.message}>
          {isAccuracyDeclining
            ? 'Your accuracy is dropping — rest helps retention.'
            : `You've been studying for ${sessionStats.durationMinutes} minutes. Great effort!`}
        </p>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{sessionStats.questionsThisSession}</span>
            <span className={styles.statLabel}>Questions</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{accuracyPct}%</span>
            <span className={styles.statLabel}>Accuracy</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{sessionStats.durationMinutes}m</span>
            <span className={styles.statLabel}>Duration</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.continueBtn}
            onClick={handleContinue}
            type="button"
          >
            Continue
          </button>
          <button
            className={styles.breakBtn}
            onClick={handleTakeBreak}
            type="button"
          >
            Take a Break
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(BreakSuggestion);
