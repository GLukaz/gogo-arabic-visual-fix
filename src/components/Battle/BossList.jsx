import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BOSSES, canChallengeBoss } from '../../data/bosses.js';
import { selectBossesDefeated } from '../../store/slices/battleSlice.js';
import { selectUnlockedZones } from '../../store/slices/playerSlice.js';
import styles from './BossList.module.css';

/**
 * BossList - Display all available bosses and allow player to challenge them
 *
 * @param {Object} props
 * @param {Function} props.onClose - Callback when overlay is closed
 */
export default function BossList({ onClose }) {
  const navigate = useNavigate();
  const unlockedZones = useSelector(selectUnlockedZones);
  const bossesDefeated = useSelector(selectBossesDefeated);

  const handleChallenge = (bossId) => {
    navigate(`/battle?boss=${bossId}`);
    onClose();
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.25, ease: 'easeOut' };

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
      onClick={onClose}
    >
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Word Duels</h2>
          <motion.button
            className={styles.closeBtn}
            onClick={onClose}
            {...buttonProps}
          >
            Close
          </motion.button>
        </div>

        <div className={styles.bossList}>
          {BOSSES.map((boss) => {
            const isLocked = !canChallengeBoss(boss.id, unlockedZones);
            const isDefeated = bossesDefeated.includes(boss.id);

            return (
              <div
                key={boss.id}
                className={`${styles.bossCard} ${isLocked ? styles.bossCardLocked : ''} ${isDefeated ? styles.bossCardDefeated : ''}`}
              >
                {isDefeated && (
                  <span className={styles.defeatedBadge}>✓ Defeated</span>
                )}

                <div className={styles.bossSprite}>{boss.sprite}</div>

                <div className={styles.bossInfo}>
                  <p className={styles.bossName}>{boss.name}</p>
                  <p className={styles.bossNameArabic}>{boss.nameArabic}</p>

                  <div className={styles.bossStats}>
                    <div className={styles.bossStat}>
                      <span>❤️</span>
                      <span>{boss.hp} HP</span>
                    </div>
                    <div className={styles.bossStat}>
                      <span>⭐</span>
                      <span>Level {boss.difficulty}</span>
                    </div>
                    <div className={styles.bossStat}>
                      <span>🏆</span>
                      <span>{boss.rewards.xp} XP</span>
                    </div>
                  </div>

                  {isLocked && (
                    <p className={styles.lockedText}>
                      Unlock {boss.zone.replace(/_/g, ' ')} to challenge
                    </p>
                  )}
                </div>

                {!isLocked && (
                  <motion.button
                    className={isDefeated ? styles.challengeBtnGold : styles.challengeBtn}
                    onClick={() => handleChallenge(boss.id)}
                    {...buttonProps}
                  >
                    {isDefeated ? 'Rechallenge' : 'Challenge'}
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
