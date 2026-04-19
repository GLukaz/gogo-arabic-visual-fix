/**
 * DifficultyDashboard — Expandable panel showing difficulty state.
 *
 * Phase 87: Difficulty Curve Engine
 *
 * Features:
 * - Current difficulty level with colored bar
 * - Recent accuracy trend (last 20 results as CSS sparkline)
 * - Session duration
 * - Break timer
 * - New words remaining today
 * - Motivational recommendation text
 */

import { useState, memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectDifficultyLevel,
  selectSessionStats,
  selectNewWordBudget,
  selectRecentAccuracy,
  selectRecentResults,
} from '../../store/slices/difficultySlice.js';
import { DIFFICULTY_LEVELS } from '../../services/difficultyEngine.js';
import styles from './DifficultyDashboard.module.css';

/** Color mapping for difficulty levels. */
const LEVEL_COLORS = {
  beginner: '#2ecc71',
  easy: '#27ae60',
  medium: '#FFD700',
  hard: '#e67e22',
  expert: '#e74c3c',
};

/** Motivational text by difficulty + accuracy state. */
function getRecommendationText(level, accuracy) {
  if (accuracy >= 0.85) {
    return "You're in the zone! Ready for a challenge?";
  }
  if (accuracy >= 0.70) {
    return 'Great pace! Keep it up.';
  }
  if (accuracy >= 0.50) {
    return "Let's review some basics to strengthen your foundation.";
  }
  if (accuracy > 0) {
    return 'Take it slow. Practice makes perfect.';
  }
  return 'Start answering questions to see your stats!';
}

/**
 * Mini sparkline rendered with CSS.
 * Each result is a thin bar — green for correct, red for incorrect.
 */
function Sparkline({ results }) {
  if (!results || results.length === 0) return null;

  // Take last 20
  const display = results.slice(-20);

  return (
    <div className={styles.sparkline} aria-label="Recent accuracy trend">
      {display.map((r, i) => (
        <div
          key={i}
          className={`${styles.sparkBar} ${r.correct ? styles.sparkCorrect : styles.sparkIncorrect}`}
          title={r.correct ? 'Correct' : 'Incorrect'}
        />
      ))}
    </div>
  );
}

function DifficultyDashboard() {
  const [expanded, setExpanded] = useState(false);
  const level = useSelector(selectDifficultyLevel);
  const sessionStats = useSelector(selectSessionStats);
  const wordBudget = useSelector(selectNewWordBudget);
  const accuracy = useSelector(selectRecentAccuracy);
  const recentResults = useSelector(selectRecentResults);

  const levelIndex = DIFFICULTY_LEVELS.indexOf(level);
  const levelColor = LEVEL_COLORS[level] || '#FFD700';
  const progressPct = ((levelIndex + 1) / DIFFICULTY_LEVELS.length) * 100;
  const accuracyPct = Math.round(accuracy * 100);

  const recommendation = useMemo(
    () => getRecommendationText(level, accuracy),
    [level, accuracy],
  );

  return (
    <div className={styles.container}>
      {/* Collapsed header — always visible */}
      <button
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        type="button"
        aria-expanded={expanded}
        aria-controls="difficulty-dashboard-panel"
      >
        <span className={styles.levelBadge} style={{ borderColor: levelColor }}>
          <span className={styles.levelDot} style={{ backgroundColor: levelColor }} />
          <span className={styles.levelText}>{level}</span>
        </span>
        <span className={styles.expandIcon}>{expanded ? '\u25B2' : '\u25BC'}</span>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div id="difficulty-dashboard-panel" className={styles.panel}>
          {/* Difficulty bar */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Difficulty</span>
            <div className={styles.difficultyBar}>
              <div
                className={styles.difficultyFill}
                style={{ width: `${progressPct}%`, backgroundColor: levelColor }}
              />
            </div>
            <div className={styles.difficultyLabels}>
              {DIFFICULTY_LEVELS.map((l) => (
                <span
                  key={l}
                  className={`${styles.difficultyLabel} ${l === level ? styles.activeDifficultyLabel : ''}`}
                  style={l === level ? { color: levelColor } : undefined}
                >
                  {l.charAt(0).toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Accuracy sparkline */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              Accuracy: <strong>{accuracyPct}%</strong>
            </span>
            <Sparkline results={recentResults} />
          </div>

          {/* Session stats */}
          <div className={styles.statsRow}>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>{sessionStats.durationMinutes}m</span>
              <span className={styles.miniStatLabel}>Session</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>{sessionStats.questionsThisSession}</span>
              <span className={styles.miniStatLabel}>Questions</span>
            </div>
            <div className={styles.miniStat}>
              <span className={styles.miniStatValue}>{wordBudget.remaining}</span>
              <span className={styles.miniStatLabel}>New Words</span>
            </div>
          </div>

          {/* Recommendation */}
          <p className={styles.recommendation}>{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default memo(DifficultyDashboard);
