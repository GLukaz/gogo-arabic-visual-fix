import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getBossById } from '../../data/bosses.js';
import styles from './BattleResult.module.css';

/**
 * BattleResult - Shows victory/defeat screen after battle
 *
 * @param {Object} props
 * @param {string} props.bossId - ID of the boss that was battled
 * @param {boolean} props.victory - Whether player won
 * @param {Function} props.onClose - Callback when user clicks continue
 */
export default function BattleResult({ bossId, victory, onClose, onReview }) {
  const boss = getBossById(bossId);
  const battleHistory = useSelector((s) => s.battle.battleHistory);

  if (!boss) return null;

  // Get the most recent battle result for this boss
  const result = battleHistory[0];
  const accuracy = result?.accuracy || 0;
  const timeElapsed = result?.timeElapsed || 0;
  const rewards = result?.rewards || { xp: 0, dirhams: 0 };

  const timeInSeconds = Math.floor(timeElapsed / 1000);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.3, ease: 'easeOut' };

  const buttonProps = reduceMotion
    ? {}
    : { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };

  return (
    <motion.div
      className={styles.overlay}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
    >
      <motion.div
        className={styles.card}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        <h1 className={`${styles.title} ${victory ? styles.victoryTitle : styles.defeatTitle}`}>
          {victory ? 'Victory!' : 'Defeated'}
        </h1>

        <div className={`${styles.bossSprite} ${victory ? styles.bossSpriteVictory : ''}`}>
          {boss.sprite}
        </div>

        <p className={styles.bossName}>{boss.name}</p>
        <p className={styles.bossNameArabic}>{boss.nameArabic}</p>

        <div className={styles.dialogue}>
          {victory ? boss.dialogue.defeat : boss.dialogue.victory}
        </div>

        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Accuracy:</span>
            <span className={styles.statValue}>{accuracy}%</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Time:</span>
            <span className={styles.statValue}>{timeInSeconds}s</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Result:</span>
            <span
              className={`${styles.statValue} ${victory ? styles.statValueVictory : styles.statValueDefeat}`}
            >
              {victory ? 'VICTORY' : 'DEFEAT'}
            </span>
          </div>
        </div>

        {victory && rewards.xp > 0 && (
          <div className={styles.rewards}>
            <p className={styles.rewardsTitle}>Rewards Earned</p>
            <div className={styles.rewardRow}>
              <div className={styles.rewardItem}>
                <span>⭐</span>
                <span>{rewards.xp} XP</span>
              </div>
              <div className={styles.rewardItem}>
                <span>💰</span>
                <span>{rewards.dirhams} Dirhams</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.buttonRow}>
          <motion.button
            className={styles.continueBtn}
            onClick={onClose}
            {...buttonProps}
          >
            Continue
          </motion.button>
          {onReview && (
            <motion.button
              className={styles.reviewBtn}
              onClick={onReview}
              {...buttonProps}
            >
              مراجعة العربية — Review Arabic
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

import PropTypes from 'prop-types';
BattleResult.propTypes = {
  bossId: PropTypes.string.isRequired,
  victory: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReview: PropTypes.func,
};
