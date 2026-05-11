import { useMemo, useCallback, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  selectDailyGoals,
  selectAllGoalsCompleted,
  selectCompletedGoalsCount,
  selectTotalGoalsCount,
  selectOverallProgress,
} from '../../store/slices/dailyGoalsSlice.js';
import { selectStreakInfo } from '../../store/slices/playerSlice.js';
import { getNextStreakMilestone } from '../../data/streakRewards.js';
import { ALL_GOALS_BONUS_XP, getGoalProgress } from '../../data/dailyGoals.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './DailyGoalsPanel.module.css';

function DailyGoalsPanel({ onClose }) {
  const goals = useSelector(selectDailyGoals);
  const allCompleted = useSelector(selectAllGoalsCompleted);
  const completedCount = useSelector(selectCompletedGoalsCount);
  const totalCount = useSelector(selectTotalGoalsCount);
  const overallProgress = useSelector(selectOverallProgress);
  const streakInfo = useSelector(selectStreakInfo);

  const focusTrapRef = useFocusTrap(true, null);

  const nextMilestone = useMemo(
    () => getNextStreakMilestone(streakInfo),
    [streakInfo]
  );

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const panelVariantsReduced = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const transition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.3, ease: 'easeOut' };

  return (
    <motion.div
      ref={focusTrapRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
    >
      <motion.div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        variants={reduceMotion ? panelVariantsReduced : panelVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
        role="dialog"
        aria-labelledby="daily-goals-title"
        aria-describedby="daily-goals-description"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="daily-goals-title" className={styles.title}>
            Daily Goals
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close daily goals panel"
          >
            ✕
          </button>
        </div>

        {/* Progress Summary */}
        <div className={styles.summary}>
          <div className={styles.summaryText}>
            <span className={styles.summaryLabel}>Progress:</span>
            <span className={styles.summaryValue}>
              {completedCount}/{totalCount} Completed
            </span>
          </div>
          <div className={styles.progressBarOuter}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Goals Grid */}
        <div className={styles.goalsGrid} id="daily-goals-description">
          {Object.entries(goals).map(([key, goal]) => {
            const progress = getGoalProgress(goal);
            const isCompleted = goal.current >= goal.target;

            return (
              <div
                key={key}
                className={`${styles.goalCard} ${isCompleted ? styles.goalCardCompleted : ''}`}
              >
                <div className={styles.goalHeader}>
                  <span className={styles.goalIcon} aria-hidden="true">
                    {goal.icon}
                  </span>
                  <div className={styles.goalInfo}>
                    <div className={styles.goalLabel}>{goal.label}</div>
                    <div className={styles.goalProgress}>
                      {goal.current}/{goal.target}
                    </div>
                  </div>
                  {isCompleted && (
                    <span className={styles.checkmark} aria-label="Completed">
                      ✓
                    </span>
                  )}
                </div>

                <div className={styles.goalProgressBar}>
                  <div
                    className={styles.goalProgressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className={styles.goalReward}>+{goal.xpReward} XP</div>
              </div>
            );
          })}
        </div>

        {/* Bonus Section */}
        <div className={`${styles.bonusSection} ${allCompleted ? styles.bonusSectionActive : ''}`}>
          <div className={styles.bonusHeader}>
            {allCompleted && <span className={styles.celebrationIcon}>🎉</span>}
            <span className={styles.bonusLabel}>
              {allCompleted ? 'All Goals Complete!' : 'Complete All Goals'}
            </span>
          </div>
          <div className={styles.bonusReward}>
            Bonus: +{ALL_GOALS_BONUS_XP} XP
          </div>
        </div>

        {/* Streak Info */}
        <div className={styles.streakSection}>
          <div className={styles.streakHeader}>
            <span className={styles.streakIcon} aria-hidden="true">
              🔥
            </span>
            <span className={styles.streakText}>
              Current Streak: <strong>{streakInfo.current} days</strong>
            </span>
          </div>
          {nextMilestone && (
            <div className={styles.streakMilestone}>
              Next milestone: {nextMilestone.days} days
              <span className={styles.streakReward}>
                (+{nextMilestone.xp} XP, {nextMilestone.dirhams} D)
              </span>
            </div>
          )}
          {streakInfo.max > streakInfo.current && (
            <div className={styles.streakMax}>
              Best streak: {streakInfo.max} days
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default memo(DailyGoalsPanel);
