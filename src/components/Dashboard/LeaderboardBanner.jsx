import { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFsrsCards } from '../../store/slices/vocabularySlice.js';
import { selectStreakInfo } from '../../store/slices/playerSlice.js';
import {
  recordWeeklySnapshot,
  calculatePercentile,
} from '../../services/leaderboardService.js';
import styles from './LeaderboardBanner.module.css';

/**
 * LeaderboardBanner — shows "You learned more than X% of players" on the Daily Dashboard.
 * Uses anonymous localStorage leaderboard data, comparing current weekly stats
 * against historical weekly snapshots.
 *
 * Before enough data is collected (< 3 past weeks), shows an encouraging message instead.
 */
export default function LeaderboardBanner() {
  const fsrsCards = useSelector(selectFsrsCards);
  const streakInfo = useSelector(selectStreakInfo);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let wordsLearned = 0;
    let quizzesCompleted = 0;

    Object.values(fsrsCards).forEach(({ card, log }) => {
      if (!card) return;
      if (card.due && new Date(card.due).getTime() > oneWeekAgo) {
        wordsLearned++;
      }
      if (log && log.review && new Date(log.review).getTime() > oneWeekAgo) {
        if (log.rating && log.rating >= 3) {
          quizzesCompleted++;
        }
      }
    });

    return {
      wordsLearned,
      quizzesCompleted,
      streak: streakInfo,
    };
  }, [fsrsCards, streakInfo]);

  // Record snapshot on mount and when stats change
  useEffect(() => {
    recordWeeklySnapshot(weeklyStats);
  }, [weeklyStats]);

  // Calculate percentile
  const percentileData = useMemo(() => {
    return calculatePercentile(weeklyStats);
  }, [weeklyStats]);

  if (!percentileData.hasEnoughData) {
    return (
      <div className={styles.banner} data-testid="leaderboard-banner">
        <span className={styles.icon}>&#x1F3C6;</span>
        <span className={styles.text}>Keep playing to unlock your weekly ranking!</span>
      </div>
    );
  }

  // Clamp percentile display for more encouraging feel
  const displayPercentile = Math.max(percentileData.percentile, 1);

  return (
    <div className={styles.banner} data-testid="leaderboard-banner">
      <span className={styles.icon}>&#x1F3C6;</span>
      <span className={styles.text}>
        You learned more than <strong className={styles.percentile}>{displayPercentile}%</strong> of players this week!
      </span>
    </div>
  );
}
