/**
 * ArenaLeaderboard.jsx — Displays top scores for each arena mode.
 *
 * Shows top 10 entries per mode, sorted by score descending.
 * Tab navigation for mode selection. Highlights player's best score.
 * All numbers displayed in Arabic-Indic numerals. RTL direction throughout.
 *
 * NOTE: arenaSlice is not yet in store.js (deferred to 32-11).
 * Leaderboard data is passed via props (leaderboardData) instead of Redux selectors.
 * When 32-11 integrates arenaSlice, this can switch to useSelector(selectArenaLeaderboard).
 */

import { useState, useMemo } from 'react';
import styles from './ArenaLeaderboard.module.css';

/* ─── Arabic numeral conversion ─── */

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Convert a number to Arabic-Indic numeral string.
 * @param {number|string} num
 * @returns {string}
 */
function toArabicNumerals(num) {
  return String(num)
    .split('')
    .map((ch) => (ch >= '0' && ch <= '9' ? ARABIC_DIGITS[parseInt(ch, 10)] : ch))
    .join('');
}

/** Arena mode definitions with Arabic/English labels */
const ARENA_MODES = [
  { id: 'survival', arabic: 'ساحة البقاء', english: 'Survival Arena' },
  { id: 'boss_rush', arabic: 'تحدي الرؤساء', english: 'Boss Rush' },
  { id: 'puzzle', arabic: 'معارك الألغاز', english: 'Puzzle Battles' },
];

/**
 * Format a timestamp to a short date string.
 */
function formatDate(timestamp) {
  if (!timestamp) return '—';
  const d = new Date(timestamp);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  return toArabicNumerals(`${day}/${month}`);
}

/**
 * Get rank styling class for top 3 positions.
 */
function getRankClass(rank) {
  if (rank === 1) return styles.rank1;
  if (rank === 2) return styles.rank2;
  if (rank === 3) return styles.rank3;
  return '';
}

/**
 * ArenaLeaderboard — Panel displaying top scores for arena modes.
 *
 * @param {Object} props
 * @param {string} [props.mode='survival'] — Initial active mode tab
 * @param {Object} props.leaderboardData — { [modeId]: [{ score, wavesCompleted, accuracy, timestamp }] }
 * @param {number|null} [props.playerBestScore] — Player's best score for highlighting
 * @param {number|null} [props.playerRank] — Player's overall rank if outside top 10
 * @param {Function} props.onClose — Callback when user closes the leaderboard
 */
export default function ArenaLeaderboard({
  mode: initialMode = 'survival',
  leaderboardData = {},
  playerBestScore = null,
  playerRank = null,
  onClose,
}) {
  const [activeMode, setActiveMode] = useState(initialMode);

  // Get entries for the active mode, sorted by score descending
  const entries = useMemo(() => {
    const modeEntries = leaderboardData[activeMode] || [];
    return [...modeEntries].sort((a, b) => b.score - a.score).slice(0, 10);
  }, [leaderboardData, activeMode]);

  // Current mode metadata
  const currentModeInfo = ARENA_MODES.find((m) => m.id === activeMode) || ARENA_MODES[0];

  // Check if player's best score is in top 10
  const playerInTop10 = playerBestScore != null && entries.some((e) => e.score === playerBestScore);
  const showPlayerRank = playerRank != null && !playerInTop10;

  return (
    <div className={styles.leaderboard} role="dialog" aria-label="Arena Leaderboard">
      <div className={styles.leaderboardPanel}>
        {/* Close button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close leaderboard"
        >
          X
        </button>

        {/* Title */}
        <h2 className={styles.leaderboardTitle} lang="ar">
          لوحة المتصدرين
        </h2>
        <p className={styles.leaderboardSubtitle}>
          {currentModeInfo.english}
        </p>

        {/* Tab navigation */}
        <nav className={styles.tabNav} role="tablist" aria-label="Arena modes">
          {ARENA_MODES.map((modeInfo) => (
            <button
              key={modeInfo.id}
              role="tab"
              aria-selected={activeMode === modeInfo.id}
              className={`${styles.tab} ${activeMode === modeInfo.id ? styles.tabActive : ''}`}
              onClick={() => setActiveMode(modeInfo.id)}
              lang="ar"
            >
              {modeInfo.arabic}
            </button>
          ))}
        </nav>

        {/* Score table or empty state */}
        {entries.length > 0 ? (
          <table className={styles.scoreTable}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Score</th>
                <th>Waves</th>
                <th>Accuracy</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => {
                const rank = idx + 1;
                const isPlayer = playerBestScore != null && entry.score === playerBestScore;
                return (
                  <tr
                    key={`${entry.score}-${entry.timestamp}-${idx}`}
                    className={isPlayer ? styles.playerHighlight : ''}
                  >
                    <td>
                      <span className={`${styles.rankCell} ${getRankClass(rank)}`} lang="ar">
                        {toArabicNumerals(rank)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.scoreCell} lang="ar">
                        {toArabicNumerals(entry.score)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.wavesCell} lang="ar">
                        {toArabicNumerals(entry.wavesCompleted || 0)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.accuracyCell} lang="ar">
                        {toArabicNumerals(Math.round((entry.accuracy || 0) * 100))}%
                      </span>
                    </td>
                    <td>
                      <span className={styles.dateCell}>
                        {formatDate(entry.timestamp)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState} lang="ar">
            لا نتائج بعد
          </div>
        )}

        {/* Player rank banner if outside top 10 */}
        {showPlayerRank && (
          <div className={styles.playerRankBanner}>
            <p className={styles.playerRankLabel}>Your Rank</p>
            <p className={styles.playerRankValue} lang="ar">
              #{toArabicNumerals(playerRank)}
            </p>
            {playerBestScore != null && (
              <p className={styles.playerBestScore}>
                Best: {toArabicNumerals(playerBestScore)} pts
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
