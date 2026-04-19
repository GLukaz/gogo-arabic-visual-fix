/**
 * StatsShareCard.jsx — Phase 91
 *
 * Expanded shareable stats card with player stats, CEFR badge,
 * achievement badges, fun facts, and share/copy actions.
 *
 * Uses Web Share API with clipboard fallback.
 */

import { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { generateShareText, generateStatsSummary } from '../../services/shareableStats.js';
import styles from './StatsShareCard.module.css';

/**
 * Build achievement badges from stats.
 */
function getAchievementBadges(summary) {
  const badges = [];

  if (summary.streak >= 30) {
    badges.push({ icon: '\ud83d\udd25', label: '30-Day Streak' });
  } else if (summary.streak >= 7) {
    badges.push({ icon: '\ud83d\udd25', label: `${summary.streak}-Day Streak` });
  }

  if (summary.wordsLearned >= 1000) {
    badges.push({ icon: '\ud83d\udcda', label: '1K Words' });
  } else if (summary.wordsLearned >= 500) {
    badges.push({ icon: '\ud83d\udcda', label: '500 Words' });
  } else if (summary.wordsLearned >= 100) {
    badges.push({ icon: '\ud83d\udcda', label: '100 Words' });
  }

  if (summary.level >= 20) {
    badges.push({ icon: '\u2b50', label: `Level ${summary.level}` });
  } else if (summary.level >= 10) {
    badges.push({ icon: '\u2b50', label: `Level ${summary.level}` });
  }

  if (summary.achievementsUnlocked >= 10) {
    badges.push({ icon: '\ud83c\udfc6', label: `${summary.achievementsUnlocked} Achievements` });
  }

  if (summary.wordsMastered >= 50) {
    badges.push({ icon: '\ud83d\udc8e', label: `${summary.wordsMastered} Mastered` });
  }

  return badges;
}

function StatsShareCard({ onClose }) {
  const [copied, setCopied] = useState(false);

  // Pull stats from various Redux slices
  const playerName = useSelector((state) => state.player?.name || 'Player');
  const playerLevel = useSelector((state) => state.player?.level ?? 1);
  const playerXp = useSelector((state) => state.player?.xp ?? 0);
  const playerStreak = useSelector((state) => state.player?.streak ?? 0);
  const maxStreak = useSelector((state) => state.player?.maxStreak ?? 0);
  const wordsLearned = useSelector((state) => state.player?.wordsLearned ?? 0);
  const cefrLevel = useSelector((state) => state.cefrProgress?.currentLevel ?? null);
  const achievementsUnlocked = useSelector(
    (state) => Object.keys(state.achievements?.unlockedAchievements ?? {}).length
  );
  const perfectQuizzes = useSelector((state) => state.achievements?.stats?.perfectQuizzes ?? 0);
  const totalPlayTime = useSelector((state) => state.stats?.totalPlayTime ?? 0);

  // Build summary
  const summary = useMemo(
    () =>
      generateStatsSummary({
        level: playerLevel,
        xp: playerXp,
        wordsLearned,
        wordsMastered: 0, // Vocabulary slice tracks FSRS cards, not a simple "mastered" count
        streak: Math.max(playerStreak, maxStreak),
        quizzesCompleted: perfectQuizzes,
        achievementsUnlocked,
        totalStudyTime: totalPlayTime,
        cefrLevel,
      }),
    [playerLevel, playerXp, wordsLearned, playerStreak, maxStreak, perfectQuizzes, achievementsUnlocked, totalPlayTime, cefrLevel]
  );

  const badges = useMemo(() => getAchievementBadges(summary), [summary]);

  const shareText = useMemo(
    () =>
      generateShareText({
        name: playerName,
        level: playerLevel,
        xp: playerXp,
        wordsLearned,
        streak: Math.max(playerStreak, maxStreak),
        cefrLevel: summary.estimatedCefr,
      }),
    [playerName, playerLevel, playerXp, wordsLearned, playerStreak, maxStreak, summary.estimatedCefr]
  );

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Gogo Arabic', text: shareText });
        return;
      } catch {
        // User cancelled — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [shareText]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [shareText]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Share your Arabic learning stats"
    >
      <div className={styles.panel} role="document">
        {/* Card visual */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardArabic}>{'\u0639\u0631\u0628\u064a'}</div>
            <h2 className={styles.cardTitle}>Gogo Arabic</h2>
          </div>

          {/* CEFR badge */}
          <div className={styles.cefrBadge}>
            <span className={styles.cefrLevel}>{summary.estimatedCefr}</span>
          </div>
          <div className={styles.cefrLabel}>CEFR Level</div>

          {/* Stats grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>{'\ud83d\udcda'}</span>
              <span className={styles.statValue}>{summary.wordsLearned.toLocaleString()}</span>
              <span className={styles.statLabel}>Words Learned</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>{'\u2b50'}</span>
              <span className={styles.statValue}>{summary.xp.toLocaleString()}</span>
              <span className={styles.statLabel}>Total XP</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>{'\ud83d\udd25'}</span>
              <span className={styles.statValue}>{summary.streak}</span>
              <span className={styles.statLabel}>Best Streak</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>{'\ud83c\udfc6'}</span>
              <span className={styles.statValue}>{summary.achievementsUnlocked}</span>
              <span className={styles.statLabel}>Achievements</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>{'\ud83d\udcaf'}</span>
              <span className={styles.statValue}>{summary.quizzesCompleted}</span>
              <span className={styles.statLabel}>Perfect Quizzes</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>{'\ud83c\udf93'}</span>
              <span className={styles.statValue}>Lv.{summary.level}</span>
              <span className={styles.statLabel}>Player Level</span>
            </div>
          </div>

          {/* Achievement badges */}
          {badges.length > 0 && (
            <div className={styles.badgesSection}>
              <div className={styles.badgesTitle}>Earned Badges</div>
              <div className={styles.badgesRow}>
                {badges.map((b, i) => (
                  <span key={i} className={styles.badge}>
                    <span className={styles.badgeIcon}>{b.icon}</span>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fun facts */}
          {summary.funFacts.length > 0 && (
            <div className={styles.funFacts}>
              {summary.funFacts.map((fact, i) => (
                <p key={i} className={styles.funFact}>{fact}</p>
              ))}
            </div>
          )}

          <div className={styles.cardFooter}>gogo-arabic.com</div>
        </div>

        {/* Copied toast */}
        {copied && <div className={styles.copiedToast}>Copied to clipboard!</div>}

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.shareBtn}
            onClick={handleShare}
            type="button"
            aria-label="Share your stats"
          >
            Share
          </button>
          <button
            className={styles.copyBtn}
            onClick={handleCopy}
            type="button"
            aria-label="Copy stats to clipboard"
          >
            Copy Text
          </button>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Close share card"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

StatsShareCard.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default StatsShareCard;
