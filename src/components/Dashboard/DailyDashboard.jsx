import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameNavigation } from '../../hooks/useGameNavigation.js';
import { selectPlayerStats, selectStreakInfo } from '../../store/slices/playerSlice.js';
import { selectFsrsCards, selectLearnedWordCount } from '../../store/slices/vocabularySlice.js';
import { selectDailyGoals } from '../../store/slices/dailyGoalsSlice.js';
import { selectActiveQuest, selectCompletedQuests } from '../../store/slices/questSlice.js';
import { selectAlphabetProgress } from '../../store/slices/alphabetSlice.js';
import { getGoalProgress } from '../../data/dailyGoals.js';
import LeaderboardBanner from './LeaderboardBanner.jsx';
import styles from './DailyDashboard.module.css';

/**
 * DailyDashboard - Startup screen showing daily progress and suggested activities
 *
 * Features:
 * - Greeting with streak count
 * - Review count with due words
 * - Daily goals progress bars
 * - Weekly learning stats
 * - Smart activity suggestions based on player state
 *
 * @example
 * <DailyDashboard />
 */
export default function DailyDashboard() {
  const { goToGame, goToReview, goToAlphabet, goToLearningPath } = useGameNavigation();

  // Redux state
  const playerStats = useSelector(selectPlayerStats);
  const streakInfo = useSelector(selectStreakInfo);
  const fsrsCards = useSelector(selectFsrsCards);
  const dailyGoals = useSelector(selectDailyGoals);
  const activeQuest = useSelector(selectActiveQuest);
  const playerName = useSelector((state) => state.player.name);
  const alphabetProgress = useSelector(selectAlphabetProgress);
  const learnedWordCount = useSelector(selectLearnedWordCount);
  const completedQuests = useSelector(selectCompletedQuests);

  // Calculate reviews due
  const reviewsDue = useMemo(() => {
    const now = Date.now();
    return Object.values(fsrsCards).filter(({ card }) => {
      return card && card.due && new Date(card.due).getTime() <= now;
    }).length;
  }, [fsrsCards]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    let wordsThisWeek = 0;
    let totalReviews = 0;
    let correctReviews = 0;

    Object.values(fsrsCards).forEach(({ card, log }) => {
      if (!card) return;

      // Count words learned this week
      if (card.due && new Date(card.due).getTime() > oneWeekAgo) {
        wordsThisWeek++;
      }

      // Count reviews and accuracy
      if (log && log.review && new Date(log.review).getTime() > oneWeekAgo) {
        totalReviews++;
        if (log.rating && log.rating >= 3) {
          correctReviews++;
        }
      }
    });

    const accuracy = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    return {
      wordsLearned: wordsThisWeek,
      accuracy,
      totalReviews,
    };
  }, [fsrsCards]);

  // Determine suggested activity
  const suggestedActivity = useMemo(() => {
    const completedGroupCount = alphabetProgress.completed;
    if (completedGroupCount === 0) {
      return {
        title: 'Start Learning Letters',
        description: 'Begin your Arabic journey with the alphabet!',
        action: goToAlphabet,
        icon: '\u0623',
        color: 'var(--color-green)',
      };
    }

    if (reviewsDue > 0) {
      return {
        title: 'Review Words',
        description: `You have ${reviewsDue} word${reviewsDue !== 1 ? 's' : ''} ready for review`,
        action: goToReview,
        icon: '\uD83D\uDCDA',
        color: 'var(--color-fire)',
      };
    }

    if (activeQuest) {
      return {
        title: 'Continue Quest',
        description: `${activeQuest.title} is in progress`,
        action: goToGame,
        icon: '\u2694\uFE0F',
        color: 'var(--color-green)',
      };
    }

    return {
      title: 'Explore the World',
      description: 'Discover new adventures and learn Arabic',
      action: goToGame,
      icon: '\uD83D\uDDFA\uFE0F',
      color: 'var(--color-cyan)',
    };
  }, [reviewsDue, activeQuest, goToReview, goToGame, alphabetProgress, goToAlphabet]);

  // Animation settings
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.15 : 0.4, ease: 'easeOut' },
    },
  };

  const buttonProps = reduceMotion
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.content}>
        {/* Greeting Section */}
        <motion.section className={styles.greeting} variants={itemVariants}>
          <h1 className={styles.greetingTitle}>
            {getGreeting()}{playerName ? `, ${playerName}` : ''}!
          </h1>
          <div className={styles.streakContainer}>
            <div className={styles.streakBadge}>
              <span className={styles.streakIcon}>🔥</span>
              <div className={styles.streakInfo}>
                <span className={styles.streakNumber}>{streakInfo.current}</span>
                <span className={styles.streakLabel}>Day Streak</span>
              </div>
            </div>
            {streakInfo.max > streakInfo.current && (
              <p className={styles.streakMax}>Best: {streakInfo.max} days</p>
            )}
          </div>
        </motion.section>

        {/* Learning Progress Section */}
        <motion.section className={styles.learningSection} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Learning Progress</h2>
          <div className={styles.learningGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{alphabetProgress.completed * 4}/28</span>
              <span className={styles.statLabel}>Letters</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{learnedWordCount}/1220</span>
              <span className={styles.statLabel}>Words</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{Object.keys(completedQuests).length}/52</span>
              <span className={styles.statLabel}>Quests</span>
            </div>
          </div>
          <motion.button
            className={styles.learningPathBtn}
            onClick={goToLearningPath}
            {...buttonProps}
          >
            View Learning Path
          </motion.button>
        </motion.section>

        {/* Reviews Due Section */}
        <motion.section className={styles.reviewsSection} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Reviews Due</h2>
            <span className={styles.reviewCount}>{reviewsDue}</span>
          </div>
          {reviewsDue > 0 ? (
            <p className={styles.sectionText}>
              {reviewsDue} word{reviewsDue !== 1 ? 's' : ''} ready to review
            </p>
          ) : (
            <p className={styles.sectionText}>All caught up! Great work!</p>
          )}
        </motion.section>

        {/* Daily Goals Section */}
        <motion.section className={styles.goalsSection} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Daily Goals</h2>
          <div className={styles.goalsList}>
            {Object.entries(dailyGoals).map(([key, goal]) => {
              const progress = getGoalProgress(goal);
              const isComplete = goal.current >= goal.target;

              return (
                <div key={key} className={styles.goalItem}>
                  <div className={styles.goalHeader}>
                    <span className={styles.goalIcon}>{goal.icon}</span>
                    <span className={styles.goalLabel}>{goal.label}</span>
                    <span className={styles.goalProgress}>
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <div className={styles.progressBarOuter}>
                    <div
                      className={`${styles.progressBarFill} ${isComplete ? styles.progressComplete : ''}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Weekly Stats Section */}
        <motion.section className={styles.statsSection} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>This Week</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{weeklyStats.wordsLearned}</span>
              <span className={styles.statLabel}>Words Learned</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{weeklyStats.accuracy}%</span>
              <span className={styles.statLabel}>Accuracy</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{playerStats.level}</span>
              <span className={styles.statLabel}>Level</span>
            </div>
          </div>
        </motion.section>

        {/* Leaderboard Banner */}
        <motion.div variants={itemVariants}>
          <LeaderboardBanner />
        </motion.div>

        {/* Suggested Activity Section */}
        <motion.section className={styles.suggestedSection} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Suggested Activity</h2>
          <motion.button
            className={styles.suggestedCard}
            onClick={suggestedActivity.action}
            style={{ borderColor: suggestedActivity.color }}
            {...buttonProps}
          >
            <span className={styles.suggestedIcon}>{suggestedActivity.icon}</span>
            <div className={styles.suggestedContent}>
              <h3 className={styles.suggestedTitle}>{suggestedActivity.title}</h3>
              <p className={styles.suggestedDescription}>{suggestedActivity.description}</p>
            </div>
            <span className={styles.suggestedArrow}>→</span>
          </motion.button>
        </motion.section>

        {/* Continue to Game Button */}
        <motion.div className={styles.actions} variants={itemVariants}>
          <motion.button
            className={styles.continueBtn}
            onClick={goToGame}
            {...buttonProps}
          >
            Continue to Game
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
