/**
 * LeaderboardPanel.jsx — Phase 91
 *
 * Full-screen leaderboard panel showing category tabs, top 10 list,
 * current player rank, share button, profile switcher, and weekly report.
 *
 * All leaderboard data is read from localStorage via the service layer.
 * Redux is used only for the current player name and profile info.
 */

import { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  LEADERBOARD_CATEGORIES,
  getLeaderboard,
  getPlayerRank,
} from '../../services/multiProfileLeaderboardService.js';
import { generateShareText, generateWeeklyReport, formatStudyTime } from '../../services/shareableStats.js';
import styles from './LeaderboardPanel.module.css';

const CATEGORY_KEYS = Object.keys(LEADERBOARD_CATEGORIES);

/**
 * Format a date string for display.
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

/**
 * Get CSS class for rank badge.
 */
function getRankClass(rank) {
  if (rank === 1) return styles.rankGold;
  if (rank === 2) return styles.rankSilver;
  if (rank === 3) return styles.rankBronze;
  return '';
}

function LeaderboardPanel({ onClose, onShareStats, onOpenProfiles }) {
  const [activeCategory, setActiveCategory] = useState('xp');

  // Read player name from Redux (falls back to player.name if leaderboard slice not registered)
  const leaderboardName = useSelector((state) => state.leaderboard?.playerName);
  const playerSliceName = useSelector((state) => state.player?.name);
  const playerName = leaderboardName || playerSliceName || 'Player';

  // Player stats for weekly report
  const playerLevel = useSelector((state) => state.player?.level ?? 1);
  const playerXp = useSelector((state) => state.player?.xp ?? 0);
  const playerStreak = useSelector((state) => state.player?.streak ?? 0);
  const wordsLearned = useSelector((state) => state.player?.wordsLearned ?? 0);
  const dailyStats = useSelector((state) => state.stats?.dailyStats ?? []);

  const categoryMeta = LEADERBOARD_CATEGORIES[activeCategory];

  // Load leaderboard entries for the active category
  const entries = useMemo(() => getLeaderboard(activeCategory, 10), [activeCategory]);

  // Get current player's rank
  const playerRankInfo = useMemo(
    () => getPlayerRank(activeCategory, playerName),
    [activeCategory, playerName]
  );

  // Check if player is in the visible top 10
  const playerInTop10 = useMemo(
    () => entries.some((e) => e.playerName.toLowerCase() === playerName.toLowerCase()),
    [entries, playerName]
  );

  // Weekly report
  const weeklyReport = useMemo(
    () =>
      generateWeeklyReport(
        { level: playerLevel, xp: playerXp, streak: playerStreak, wordsLearned },
        dailyStats
      ),
    [playerLevel, playerXp, playerStreak, wordsLearned, dailyStats]
  );

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleShare = useCallback(() => {
    if (onShareStats) {
      onShareStats();
    } else {
      // Fallback: copy share text to clipboard
      const text = generateShareText({
        name: playerName,
        level: playerLevel,
        xp: playerXp,
        wordsLearned,
        streak: playerStreak,
      });

      if (navigator.share) {
        navigator.share({ title: 'Gogo Arabic', text }).catch(() => {
          navigator.clipboard.writeText(text).catch(() => {});
        });
      } else {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    }
  }, [onShareStats, playerName, playerLevel, playerXp, wordsLearned, playerStreak]);

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Leaderboard"
    >
      <div className={styles.panel} role="document">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {categoryMeta?.icon} Leaderboard
            </h2>
            <span className={styles.titleArabic}>{categoryMeta?.labelArabic}</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Close leaderboard"
          >
            &times;
          </button>
        </div>

        {/* Category tabs */}
        <div className={styles.categoryTabs} role="tablist" aria-label="Leaderboard categories">
          {CATEGORY_KEYS.map((key) => {
            const cat = LEADERBOARD_CATEGORIES[key];
            const isActive = key === activeCategory;
            return (
              <button
                key={key}
                className={`${styles.categoryTab} ${isActive ? styles.categoryTabActive : ''}`}
                onClick={() => setActiveCategory(key)}
                role="tab"
                aria-selected={isActive}
                type="button"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Leaderboard list */}
        <div className={styles.listContainer} role="list" aria-label={`${categoryMeta?.label} leaderboard`}>
          {entries.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>{categoryMeta?.icon}</span>
              <p>No entries yet. Start learning to claim the top spot!</p>
            </div>
          ) : (
            entries.map((entry) => {
              const isCurrentPlayer =
                entry.playerName.toLowerCase() === playerName.toLowerCase();

              return (
                <div
                  key={`${entry.rank}-${entry.playerName}`}
                  className={`${styles.entry} ${isCurrentPlayer ? styles.entryHighlight : ''}`}
                  role="listitem"
                >
                  <div className={`${styles.rank} ${getRankClass(entry.rank)}`}>
                    {entry.rank}
                  </div>
                  <span
                    className={`${styles.entryName} ${isCurrentPlayer ? styles.entryNameHighlight : ''}`}
                  >
                    {entry.playerName}
                  </span>
                  <span className={styles.entryScore}>
                    {entry.score.toLocaleString()}
                  </span>
                  <span className={styles.entryDate}>
                    {formatDate(entry.date)}
                  </span>
                </div>
              );
            })
          )}

          {/* Show player rank card if they're not in the top 10 */}
          {!playerInTop10 && playerRankInfo && (
            <div className={styles.playerRankCard}>
              <div className={styles.rank}>{playerRankInfo.rank}</div>
              <div>
                <span className={styles.playerRankLabel}>Your Rank</span>
                <span className={styles.playerRankValue}>
                  #{playerRankInfo.rank} of {playerRankInfo.total}
                </span>
              </div>
              <span className={styles.entryScore}>
                {playerRankInfo.score.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Weekly report section */}
        <div className={styles.weeklySection}>
          <div className={styles.weeklyTitle}>
            <span>📅</span> This Week
          </div>
          <div className={styles.weeklyGrid}>
            <div className={styles.weeklyStat}>
              <span className={styles.weeklyStatValue}>{weeklyReport.wordsThisWeek}</span>
              <span className={styles.weeklyStatLabel}>Words Learned</span>
            </div>
            <div className={styles.weeklyStat}>
              <span className={styles.weeklyStatValue}>{weeklyReport.xpThisWeek.toLocaleString()}</span>
              <span className={styles.weeklyStatLabel}>XP Earned</span>
            </div>
            <div className={styles.weeklyStat}>
              <span className={styles.weeklyStatValue}>{weeklyReport.daysActive}/7</span>
              <span className={styles.weeklyStatLabel}>Days Active</span>
            </div>
            <div className={styles.weeklyStat}>
              <span className={styles.weeklyStatValue}>{formatStudyTime(weeklyReport.timeThisWeek)}</span>
              <span className={styles.weeklyStatLabel}>Time Studied</span>
            </div>
          </div>
          <div className={styles.weeklyEncouragement}>{weeklyReport.encouragement}</div>
        </div>

        {/* Footer actions */}
        <div className={styles.footer}>
          <button
            className={styles.shareBtn}
            onClick={handleShare}
            type="button"
          >
            Share My Stats
          </button>
          {onOpenProfiles && (
            <button
              className={styles.profileBtn}
              onClick={onOpenProfiles}
              type="button"
            >
              Profiles
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

LeaderboardPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  onShareStats: PropTypes.func,
  onOpenProfiles: PropTypes.func,
};

export default LeaderboardPanel;
