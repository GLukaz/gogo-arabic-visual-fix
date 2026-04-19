import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '../../data/achievements.js';
import { selectUnlockedAchievements } from '../../store/slices/achievementSlice.js';
import { selectFsrsCards } from '../../store/slices/vocabularySlice.js';
import { useGameNavigation } from '../../hooks/useGameNavigation.js';
import styles from './PlayerProfile.module.css';

/**
 * PlayerProfile - Full-page player profile with stats, streak, and achievements
 *
 * Requirements:
 * - PROF-01: Shows total words learned, accuracy rate, time played
 * - PROF-02: Displays achievement showcase with pinned achievements
 * - PROF-03: Shows learning streak history and best streak record
 * - PROF-04: Accessible from game HUD or pause menu
 *
 * Usage:
 * <PlayerProfile />
 */
function PlayerProfile() {
  const { goBack } = useGameNavigation();

  // Redux state
  const player = useSelector((state) => state.player);
  const fsrsCards = useSelector(selectFsrsCards);
  const unlockedAchievements = useSelector(selectUnlockedAchievements);
  const dailyGoals = useSelector((state) => state.dailyGoals);

  // Calculate accuracy rate from FSRS cards
  const accuracyRate = useMemo(() => {
    const cardsList = Object.values(fsrsCards);
    if (cardsList.length === 0) return 0;

    let totalReviews = 0;
    let successfulReviews = 0;

    cardsList.forEach(({ card }) => {
      if (card && card.reps > 0) {
        totalReviews += card.reps;
        // Consider a card successful if it has low lapse ratio
        // Success = reps - lapses (assuming lapses tracks failures)
        const successes = card.reps - (card.lapses || 0);
        successfulReviews += Math.max(0, successes);
      }
    });

    if (totalReviews === 0) return 0;
    return Math.round((successfulReviews / totalReviews) * 100);
  }, [fsrsCards]);

  // Format time played
  const timePlayedFormatted = useMemo(() => {
    const totalMinutes = dailyGoals.totalSessionMinutes || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  }, [dailyGoals.totalSessionMinutes]);

  // Streak history (last 7 days)
  const streakHistory = useMemo(() => {
    const today = new Date();
    const history = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Check if player was active on this date
      // For simplicity, show streak if it covers this day
      const lastPlayedDate = player.lastPlayedDate;
      const lastPlayed = lastPlayedDate ? new Date(lastPlayedDate) : null;
      const daysDiff = lastPlayed ? Math.floor((today - lastPlayed) / 86400000) : 999;

      // Active if within current streak range
      const isActive = i <= daysDiff && i <= player.streak;

      history.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isActive,
      });
    }

    return history;
  }, [player.streak, player.lastPlayedDate]);

  // Get unlocked achievement details
  const unlockedAchievementsList = useMemo(() => {
    const achievementIds = Object.keys(unlockedAchievements);
    return ACHIEVEMENTS.filter((ach) => achievementIds.includes(ach.id))
      .sort((a, b) => unlockedAchievements[b.id] - unlockedAchievements[a.id]); // Sort by unlock time
  }, [unlockedAchievements]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.content}>
        {/* Header */}
        <motion.header className={styles.header} variants={itemVariants}>
          <div className={styles.playerInfo}>
            <div className={styles.avatar}>
              {/* Avatar placeholder - can be replaced with actual player sprite */}
              <div className={styles.avatarIcon}>👤</div>
            </div>
            <div className={styles.playerDetails}>
              <h1 className={styles.playerName}>{player.name || 'Player'}</h1>
              {player.currentTitle && (
                <div className={styles.playerTitle}>{player.currentTitle}</div>
              )}
              <div className={styles.levelInfo}>
                Level {player.level}
              </div>
            </div>
          </div>
          <button
            className={styles.backButton}
            onClick={goBack}
            aria-label="Go back"
          >
            ✕
          </button>
        </motion.header>

        {/* Stats Grid */}
        <motion.section className={styles.statsSection} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div className={styles.statValue}>{player.wordsLearned}</div>
              <div className={styles.statLabel}>Words Learned</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statValue}>{accuracyRate}%</div>
              <div className={styles.statLabel}>Accuracy</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏱️</div>
              <div className={styles.statValue}>{timePlayedFormatted}</div>
              <div className={styles.statLabel}>Time Played</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🗺️</div>
              <div className={styles.statValue}>{player.currentZone.replace(/_/g, ' ')}</div>
              <div className={styles.statLabel}>Current Zone</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statValue}>{player.dirhams}</div>
              <div className={styles.statLabel}>Dirhams</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statValue}>{player.xp}</div>
              <div className={styles.statLabel}>Total XP</div>
            </div>
          </div>
        </motion.section>

        {/* Streak Section */}
        <motion.section className={styles.streakSection} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Learning Streak</h2>
          <div className={styles.streakContainer}>
            <div className={styles.streakStats}>
              <div className={styles.streakCurrent}>
                <div className={styles.streakIcon}>🔥</div>
                <div className={styles.streakNumber}>{player.streak}</div>
                <div className={styles.streakLabel}>Day Streak</div>
              </div>
              <div className={styles.streakBest}>
                <div className={styles.streakIcon}>🏆</div>
                <div className={styles.streakNumber}>{player.maxStreak}</div>
                <div className={styles.streakLabel}>Best Streak</div>
              </div>
            </div>

            {/* 7-day streak calendar */}
            <div className={styles.streakCalendar}>
              {streakHistory.map((day, _index) => (
                <div
                  key={day.date}
                  className={`${styles.streakDay} ${day.isActive ? styles.streakDayActive : ''}`}
                  title={day.date}
                >
                  <div className={styles.streakDayLabel}>{day.day}</div>
                  <div className={styles.streakDayBox}>
                    {day.isActive && <span className={styles.streakDayCheck}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Achievement Showcase */}
        <motion.section className={styles.achievementsSection} variants={itemVariants}>
          <div className={styles.achievementsHeader}>
            <h2 className={styles.sectionTitle}>Achievements</h2>
            <div className={styles.achievementCount}>
              {unlockedAchievementsList.length} / {ACHIEVEMENTS.length}
            </div>
          </div>

          {unlockedAchievementsList.length > 0 ? (
            <div className={styles.achievementGrid}>
              {unlockedAchievementsList.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`${styles.achievementCard} ${styles[`rarity-${achievement.rarity}`]}`}
                  title={achievement.description}
                >
                  <div className={styles.achievementIcon}>{achievement.icon}</div>
                  <div className={styles.achievementInfo}>
                    <div className={styles.achievementName}>{achievement.name}</div>
                    <div className={styles.achievementDesc}>{achievement.description}</div>
                    <div className={styles.achievementReward}>+{achievement.xpReward} XP</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noAchievements}>
              <p>No achievements unlocked yet. Keep learning!</p>
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
}

export default PlayerProfile;
