import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { selectLastSessionSummary, markWelcomeBackShown } from '../../store/slices/dailyGoalsSlice.js';
import { getDueCards } from '../../services/fsrs.js';
import styles from './WelcomeBackOverlay.module.css';

export default function WelcomeBackOverlay({ onDismiss, onNavigate }) {
  const dispatch = useDispatch();
  const lastSession = useSelector(selectLastSessionSummary);
  const fsrsCards = useSelector((state) => state.vocabulary?.fsrsCards ?? {});
  const playerState = useSelector((state) => state.player);
  const learnedWordCount = useSelector((state) =>
    Object.keys(state.vocabulary?.fsrsCards ?? {}).length
  );

  const dueCount = useMemo(() => getDueCards(fsrsCards).length, [fsrsCards]);

  const streak = playerState?.streak ?? 0;
  const lastPlayedDate = playerState?.lastPlayedDate;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const streakMaintained = lastPlayedDate === today || lastPlayedDate === yesterday;
  const streakBroken = !streakMaintained && streak > 0;

  // Suggested activity
  let suggestedActivity = 'explore';
  let suggestedLabel = 'Explore the World';
  if (dueCount > 0) {
    suggestedActivity = 'review';
    suggestedLabel = `Review ${dueCount} due word${dueCount !== 1 ? 's' : ''}`;
  } else if (learnedWordCount < 10) {
    suggestedActivity = 'alphabet';
    suggestedLabel = 'Continue Learning Letters';
  }

  const handleDismiss = useCallback(() => {
    dispatch(markWelcomeBackShown());
    onDismiss();
  }, [dispatch, onDismiss]);

  const handleActivity = useCallback(() => {
    dispatch(markWelcomeBackShown());
    onNavigate(suggestedActivity);
  }, [dispatch, onNavigate, suggestedActivity]);

  return (
    <div className={styles.backdrop} onClick={handleDismiss}>
      <motion.div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className={styles.title}>{'\u0645\u064E\u0631\u062D\u064E\u0628\u0627\u064B \u0628\u0650\u0639\u064E\u0648\u062F\u064E\u062A\u0650\u0643!'}</h2>
        <p className={styles.subtitle}>Welcome Back!</p>

        <div className={styles.summarySection}>
          <h3 className={styles.sectionTitle}>Last Session</h3>
          <div className={styles.statRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{lastSession.wordsLearned}</span>
              <span className={styles.statLabel}>Words Learned</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{lastSession.reviewsDone}</span>
              <span className={styles.statLabel}>Reviews Done</span>
            </div>
          </div>
        </div>

        {dueCount > 0 && (
          <div className={styles.dueSection}>
            <span className={styles.dueCount}>{dueCount}</span>
            <span className={styles.dueLabel}>
              word{dueCount !== 1 ? 's' : ''} ready for review
            </span>
          </div>
        )}

        <div className={styles.streakSection}>
          {streakBroken ? (
            <p className={styles.streakBroken}>
              Your {streak}-day streak ended. Start a new one today!
            </p>
          ) : streak > 0 ? (
            <p className={styles.streakActive}>
              {streak}-day streak! Keep it going!
            </p>
          ) : (
            <p className={styles.streakNew}>Start your first streak today!</p>
          )}
        </div>

        <button className={styles.ctaButton} onClick={handleActivity}>
          {suggestedLabel}
        </button>
        <button className={styles.skipButton} onClick={handleDismiss}>
          Skip
        </button>
      </motion.div>
    </div>
  );
}
