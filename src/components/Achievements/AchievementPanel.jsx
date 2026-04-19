import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  selectUnlockedAchievements,
  selectAchievementProgress,
  selectUnlockedCount,
  selectTotalAchievementXP,
  selectAllChainProgress,
  selectCompletedChains,
} from '../../store/slices/achievementSlice.js';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  getAchievementsByCategory,
  RARITY_COLORS,
  TIER_COLORS,
} from '../../data/achievements.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './AchievementPanel.module.css';

// Memoize achievement card to prevent re-renders
const AchievementCard = memo(function AchievementCard({ achievement, isUnlocked, unlockedDate, progress }) {
  const rarityColor = RARITY_COLORS[achievement.rarity] || '#f4fefa';
  const { current, target } = progress;
  const progressPercent = useMemo(
    () => (target > 0 ? Math.min((current / target) * 100, 100) : 0),
    [current, target]
  );

  // Dynamic inline styles for rarity-specific colors
  const cardInlineStyle = isUnlocked ? { borderColor: rarityColor } : {};
  const cardClasses = `${styles.card} ${isUnlocked ? styles.cardUnlocked : styles.cardLocked}`;

  return (
    <div className={cardClasses} style={cardInlineStyle}>
      <div className={styles.cardHeader}>
        <div className={`${styles.cardIcon} ${isUnlocked ? '' : styles.cardIconLocked}`}>
          {isUnlocked ? achievement.icon : '🔒'}
        </div>
        <div className={styles.cardContent}>
          <div className={styles.cardName} style={{ color: rarityColor }}>
            {isUnlocked ? achievement.name : '???'}
          </div>
          <div className={styles.cardInfo}>
            <span className={styles.cardRarity}>
              {achievement.rarity}
            </span>
            <span
              className={styles.tierBadge}
              style={{ color: TIER_COLORS[achievement.tier] || '#c0c0c0' }}
            >
              {achievement.tier || 'Bronze'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardDescription}>
        {isUnlocked ? achievement.description : 'Hidden achievement'}
      </div>

      {!isUnlocked && (
        <>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
          <div className={styles.progressText}>
            {current}/{target}
          </div>
        </>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.xpBadge}>+{achievement.xpReward} XP</span>
        {isUnlocked && unlockedDate && (
          <span className={styles.unlockedDate}>
            {new Date(unlockedDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
});

function AchievementPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('all');
  const unlockedAchievements = useSelector(selectUnlockedAchievements);
  const achievementProgress = useSelector(selectAchievementProgress);
  const unlockedCount = useSelector(selectUnlockedCount);
  const totalXP = useSelector(selectTotalAchievementXP);

  const allChainProgress = useSelector(selectAllChainProgress);
  const completedChains = useSelector(selectCompletedChains);

  const focusTrapRef = useFocusTrap(true, null);

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

  const tabs = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'chains', label: 'Chains' },
    { id: ACHIEVEMENT_CATEGORIES.VOCABULARY, label: 'Vocabulary' },
    { id: ACHIEVEMENT_CATEGORIES.ALPHABET, label: 'Alphabet' },
    { id: ACHIEVEMENT_CATEGORIES.QUESTS, label: 'Quests' },
    { id: ACHIEVEMENT_CATEGORIES.STREAKS, label: 'Streaks' },
    { id: ACHIEVEMENT_CATEGORIES.XP, label: 'XP' },
    { id: ACHIEVEMENT_CATEGORIES.EXPLORATION, label: 'Exploration' },
    { id: ACHIEVEMENT_CATEGORIES.REVIEW, label: 'Review' },
    { id: ACHIEVEMENT_CATEGORIES.ECONOMY, label: 'Economy' },
    { id: ACHIEVEMENT_CATEGORIES.SPECIAL, label: 'Special' },
    { id: ACHIEVEMENT_CATEGORIES.GRAMMAR, label: 'Grammar' },
    { id: ACHIEVEMENT_CATEGORIES.COMBAT, label: 'Combat' },
    { id: ACHIEVEMENT_CATEGORIES.CRAFTING, label: 'Crafting' },
    { id: ACHIEVEMENT_CATEGORIES.SOCIAL, label: 'Social' },
    { id: ACHIEVEMENT_CATEGORIES.COLLECTING, label: 'Collecting' },
    { id: ACHIEVEMENT_CATEGORIES.DAILY, label: 'Daily' },
    { id: ACHIEVEMENT_CATEGORIES.LEARNING_PATH, label: 'Learning' },
    { id: ACHIEVEMENT_CATEGORIES.ROOT_MAGIC, label: 'Root Magic' },
    { id: ACHIEVEMENT_CATEGORIES.CULTURE, label: 'Culture' },
    { id: ACHIEVEMENT_CATEGORIES.SKILL_TREE, label: 'Skill Tree' },
    { id: ACHIEVEMENT_CATEGORIES.QUIZ, label: 'Quiz' },
    { id: ACHIEVEMENT_CATEGORIES.CEFR, label: 'CEFR' },
    { id: ACHIEVEMENT_CATEGORIES.HIDDEN, label: 'Hidden' },
    { id: ACHIEVEMENT_CATEGORIES.MILESTONE, label: 'Milestone' },
  ], []);

  const filteredAchievements = useMemo(
    () => (activeTab === 'all' ? ACHIEVEMENTS : getAchievementsByCategory(activeTab)),
    [activeTab]
  );

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  const panelVariantsReduced = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const transition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.3, ease: 'easeOut' };

  return (
    <motion.div
      ref={focusTrapRef}
      className={styles.overlay}
      onClick={onClose}
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
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.title}>Achievements</div>
            <div className={styles.stats}>
              <span className={styles.stat}>
                <span className={styles.statValue}>{unlockedCount}</span> / {ACHIEVEMENTS.length} Unlocked
              </span>
              <span className={styles.stat}>
                <span className={styles.statValue}>{totalXP.toLocaleString()}</span> XP Earned
              </span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'chains' ? (
            <div className={styles.grid}>
              {allChainProgress.map((chain) => {
                const isCompleted = completedChains.includes(chain.chainId);
                return (
                  <div
                    key={chain.chainId}
                    className={`${styles.card} ${isCompleted ? styles.cardUnlocked : styles.cardLocked}`}
                    style={isCompleted ? { borderColor: '#a855f7' } : {}}
                  >
                    <div className={styles.cardHeader}>
                      <div className={`${styles.cardIcon} ${isCompleted ? '' : styles.cardIconLocked}`}>
                        {isCompleted ? chain.icon : '🔒'}
                      </div>
                      <div className={styles.cardContent}>
                        <div className={styles.cardName} style={{ color: isCompleted ? '#a855f7' : undefined }}>
                          {chain.name}
                        </div>
                        <div className={styles.cardInfo}>
                          <span className={styles.cardRarity}>{chain.rarity}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardDescription}>{chain.nameArabic}</div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${chain.percentage}%` }} />
                    </div>
                    <div className={styles.progressText}>
                      {chain.completed}/{chain.total} — {chain.percentage}%
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.xpBadge}>+{chain.xpReward} XP</span>
                      {isCompleted && <span className={styles.unlockedDate}>Complete!</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredAchievements.map((achievement) => {
                const isUnlocked = !!unlockedAchievements[achievement.id];
                const unlockedDate = unlockedAchievements[achievement.id];
                const progress = achievementProgress[achievement.id] || { current: 0, target: 1 };

                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={isUnlocked}
                    unlockedDate={unlockedDate}
                    progress={progress}
                  />
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Memoize component
export default memo(AchievementPanel);
