import { useEffect, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectStreakReward, dismissStreakReward, addXP } from '../../store/slices/playerSlice.js';
import styles from './StreakRewardToast.module.css';

function StreakRewardToast() {
  const dispatch = useDispatch();
  const reward = useSelector(selectStreakReward);

  const handleDismiss = useCallback(() => {
    dispatch(dismissStreakReward());
  }, [dispatch]);

  useEffect(() => {
    if (reward) {
      // Award XP bonus
      if (reward.xp > 0) {
        dispatch(addXP(reward.xp));
      }

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [reward, dispatch, handleDismiss]);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toastVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 50, scale: 0.95 },
  };

  const toastVariantsReduced = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const transition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.4, ease: 'easeOut' };

  if (!reward) return null;

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        <motion.div
          className={styles.toast}
          onClick={handleDismiss}
          variants={reduceMotion ? toastVariantsReduced : toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          role="status"
          aria-live="polite"
        >
          <div className={styles.header}>
            <span className={styles.icon} aria-hidden="true">
              🔥
            </span>
            <div className={styles.content}>
              <div className={styles.title}>
                {reward.days}-Day Streak!
              </div>
              <div className={styles.message}>{reward.message}</div>
            </div>
          </div>

          <div className={styles.rewards}>
            {reward.xp > 0 && (
              <div className={styles.rewardItem}>
                <span className={styles.rewardLabel}>XP:</span>
                <span className={styles.rewardValue}>+{reward.xp}</span>
              </div>
            )}
            {reward.dirhams > 0 && (
              <div className={styles.rewardItem}>
                <span className={styles.rewardLabel}>Dirhams:</span>
                <span className={styles.rewardValue}>+{reward.dirhams}</span>
              </div>
            )}
            {reward.title && (
              <div className={styles.rewardItem}>
                <span className={styles.rewardLabel}>Title:</span>
                <span className={styles.rewardValue}>{reward.title}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default memo(StreakRewardToast);
