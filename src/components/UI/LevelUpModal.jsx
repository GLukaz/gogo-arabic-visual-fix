import { useCallback, useEffect, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectLevelUpReward, dismissLevelUpReward } from '../../store/slices/playerSlice.js';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './LevelUpModal.module.css';

function LevelUpModal() {
  const dispatch = useDispatch();
  const reward = useSelector(selectLevelUpReward);
  const [displayLevel, setDisplayLevel] = useState(null);

  const handleDismiss = useCallback(() => {
    dispatch(dismissLevelUpReward());
  }, [dispatch]);

  const focusTrapRef = useFocusTrap(!!reward, null);

  // Centralized overlay close with ESC key and unmount safety net
  useOverlayClose(handleDismiss);

  // Emit sfx-levelup on mount (triggers audio + Phaser particles via plan 01 wiring)
  useEffect(() => {
    if (!reward) return;
    EventBus.emit(EVENTS.SFX_LEVELUP);
  }, [reward]);

  // Level number count-up animation
  useEffect(() => {
    if (!reward) return;

    const startLevel = reward.level - 1;
    setDisplayLevel(startLevel);

    // Simple 3-frame count-up: start -> midpoint -> final
    const t1 = setTimeout(() => setDisplayLevel(startLevel), 0);
    const t2 = setTimeout(() => setDisplayLevel(reward.level), 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reward]);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 300,
      },
    },
    exit: { opacity: 0, scale: 0.9 },
  };

  const modalVariantsReduced = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const glowVariants = {
    initial: { opacity: 0.4 },
    animate: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Staggered animation helpers
  const delay = (ms) => (reduceMotion ? 0 : ms / 1000);

  const celebrationAnim = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: [0, 1.3, 1] },
        transition: { delay: delay(200), duration: 0.5, ease: 'easeOut' },
      };

  const titleAnim = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: delay(400), duration: 0.4, ease: 'easeOut' },
      };

  const levelAnim = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: delay(600), duration: 0.4, ease: 'easeOut' },
      };

  const rewardsAnim = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: delay(900), duration: 0.45, ease: 'easeOut' },
      };

  const buttonAnim = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: delay(1200), duration: 0.4 },
      };

  if (!reward) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={focusTrapRef}
        className={styles.overlay}
        onClick={handleDismiss}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3 }}
        role="dialog"
        aria-labelledby="level-up-title"
        aria-describedby="level-up-description"
      >
        <motion.div
          className={`${styles.modal} ${reduceMotion ? '' : styles.goldenBorderPulse}`}
          onClick={(e) => e.stopPropagation()}
          variants={reduceMotion ? modalVariantsReduced : modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Animated glow background */}
          {!reduceMotion && (
            <motion.div
              className={styles.glow}
              variants={glowVariants}
              initial="initial"
              animate="animate"
            />
          )}

          {/* Shimmer overlay */}
          {!reduceMotion && <div className={styles.shimmerOverlay} />}

          {/* Content */}
          <div className={styles.content}>
            {/* Phase 3: Celebration emojis (200ms delay) */}
            <motion.div {...celebrationAnim}>
              <div className={styles.celebration} aria-hidden="true">
                ✨🎉✨
              </div>
            </motion.div>

            {/* Phase 4: Title (400ms delay) */}
            <motion.div {...titleAnim}>
              <h2 id="level-up-title" className={styles.title}>
                Level Up!
              </h2>
            </motion.div>

            {/* Phase 5: Level number (600ms delay, counts up) */}
            <motion.div {...levelAnim}>
              <div className={styles.levelDisplay}>
                <span className={styles.levelLabel}>Level</span>
                <span className={`${styles.levelNumber} ${reduceMotion ? '' : styles.levelNumberPulse}`}>
                  {displayLevel !== null ? displayLevel : reward.level}
                </span>
              </div>
            </motion.div>

            {/* Phase 6: Rewards (900ms delay, slide from below) */}
            <motion.div {...rewardsAnim}>
              <div id="level-up-description" className={styles.rewards}>
                <div className={styles.rewardItem}>
                  <span className={styles.rewardIcon} aria-hidden="true">
                    💰
                  </span>
                  <span className={styles.rewardText}>
                    +{reward.dirhams} Dirhams
                  </span>
                </div>

                {reward.title && (
                  <div className={styles.rewardItem}>
                    <span className={styles.rewardIcon} aria-hidden="true">
                      🏆
                    </span>
                    <span className={styles.rewardText}>
                      Title: {reward.title}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {reward.message && (
              <motion.div {...rewardsAnim}>
                <p className={styles.message}>{reward.message}</p>
              </motion.div>
            )}

            {/* Phase 7: Continue button (1200ms delay) */}
            <motion.div {...buttonAnim}>
              <button
                className={styles.continueBtn}
                onClick={handleDismiss}
                aria-label="Continue playing"
              >
                Continue
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(LevelUpModal);
