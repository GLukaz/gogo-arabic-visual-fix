import { useMemo, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  selectCompletionPercentage,
  selectNewGamePlusCount,
  selectNewGamePlusBonus,
  selectWeeklyChallenge,
  selectWeeklyChallengeHistory,
  startNewGamePlus,
} from '../../store/slices/endgameSlice.js';
import { selectUnlockedCount } from '../../store/slices/achievementSlice.js';
import styles from './CompletionTracker.module.css';

// ── Category icons ──────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  vocabulary: 'Aa',
  quests: '!',
  zones: 'M',
  npcs: 'N',
  achievements: '*',
  codex: 'C',
};

// ── Circular progress ring ──────────────────────────────────────────────────
const CircularRing = memo(function CircularRing({ percentage, size = 180 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      className={styles.ring}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${Math.round(percentage)}% complete`}
    >
      {/* Track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--color-gray)"
        strokeWidth={10}
      />
      {/* Progress arc */}
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--color-xp-gold)"
        strokeWidth={10}
        strokeLinecap="butt"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      {/* Percentage text */}
      <text
        x={center}
        y={center - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.ringPercent}
        fill="var(--color-xp-gold)"
      >
        {Math.round(percentage)}%
      </text>
      <text
        x={center}
        y={center + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.ringLabel}
        fill="var(--color-light)"
      >
        COMPLETE
      </text>
    </svg>
  );
});

// ── Category progress bar ───────────────────────────────────────────────────
const CategoryBar = memo(function CategoryBar({ label, icon, current, total, _percentage }) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <div className={styles.categoryRow}>
      <div className={styles.categoryIcon}>{icon}</div>
      <div className={styles.categoryInfo}>
        <div className={styles.categoryLabel}>{label}</div>
        <div className={styles.categoryBar}>
          <motion.div
            className={styles.categoryBarFill}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <div className={styles.categoryCount}>
        {current}<span className={styles.categoryTotal}>/{total}</span>
      </div>
    </div>
  );
});

// ── Weekly challenge card ───────────────────────────────────────────────────
const WeeklyChallengeCard = memo(function WeeklyChallengeCard({ challenge, completedCount }) {
  if (!challenge) {
    return (
      <div className={styles.weeklyEmpty}>
        <div className={styles.weeklyEmptyText}>No active weekly challenge.</div>
      </div>
    );
  }

  // For Week 52 "Year of Arabic" — progress is based on history count
  const current = challenge.id === 'wc_52' ? completedCount : 0;
  const progressPct = challenge.target > 0
    ? Math.min((current / challenge.target) * 100, 100)
    : 0;

  const TYPE_LABELS = {
    vocabulary: 'Vocabulary',
    quests: 'Quests',
    exploration: 'Exploration',
    combat: 'Combat',
    social: 'Social',
    grammar: 'Grammar',
  };

  return (
    <div className={styles.weeklyCard}>
      <div className={styles.weeklyHeader}>
        <div className={styles.weeklyBadge}>Week {challenge.week}</div>
        <div className={styles.weeklyType}>{TYPE_LABELS[challenge.type] || challenge.type}</div>
      </div>
      <div className={styles.weeklyName}>{challenge.name}</div>
      <div className={styles.weeklyNameArabic}>{challenge.nameArabic}</div>
      <div className={styles.weeklyDesc}>{challenge.description}</div>
      <div className={styles.weeklyProgress}>
        <div className={styles.weeklyProgressBar}>
          <motion.div
            className={styles.weeklyProgressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className={styles.weeklyProgressText}>
          {current} / {challenge.target}
        </div>
      </div>
      <div className={styles.weeklyReward}>
        <span className={styles.weeklyRewardLabel}>Reward:</span>
        <span className={styles.weeklyRewardXP}>+{challenge.reward.xp} XP</span>
        {challenge.reward.title && (
          <span className={styles.weeklyRewardTitle}>&quot;{challenge.reward.title}&quot; title</span>
        )}
        {challenge.reward.achievement && (
          <span className={styles.weeklyRewardAchiev}>+ Achievement</span>
        )}
      </div>
    </div>
  );
});

// ── Main component ──────────────────────────────────────────────────────────
function CompletionTracker({ onClose, categoryData }) {
  const dispatch = useDispatch();
  const completionPercentage = useSelector(selectCompletionPercentage);
  const ngPlusCount = useSelector(selectNewGamePlusCount);
  const ngPlusBonus = useSelector(selectNewGamePlusBonus);
  const weeklyChallenge = useSelector(selectWeeklyChallenge);
  const weeklyChallengeHistory = useSelector(selectWeeklyChallengeHistory);
  const _unlockedAchievements = useSelector(selectUnlockedCount);

  const completedChallengeCount = weeklyChallengeHistory.length;

  /**
   * categoryData prop shape (provided by parent):
   * {
   *   vocabulary:    { current: number, total: number },
   *   quests:        { current: number, total: number },
   *   zones:         { current: number, total: number },
   *   npcs:          { current: number, total: number },
   *   achievements:  { current: number, total: number },
   *   codex:         { current: number, total: number },
   * }
   *
   * Falls back to zeros if not provided.
   */
  const categories = useMemo(() => {
    const defaults = { current: 0, total: 0 };
    const d = categoryData || {};
    return [
      { key: 'vocabulary',   label: 'Vocabulary',   icon: CATEGORY_ICONS.vocabulary,   ...( d.vocabulary   || defaults) },
      { key: 'quests',       label: 'Quests',        icon: CATEGORY_ICONS.quests,       ...( d.quests       || defaults) },
      { key: 'zones',        label: 'Zones',         icon: CATEGORY_ICONS.zones,        ...( d.zones        || defaults) },
      { key: 'npcs',         label: 'NPCs',          icon: CATEGORY_ICONS.npcs,         ...( d.npcs         || defaults) },
      { key: 'achievements', label: 'Achievements',  icon: CATEGORY_ICONS.achievements, ...( d.achievements || defaults) },
      { key: 'codex',        label: 'Codex',         icon: CATEGORY_ICONS.codex,        ...( d.codex        || defaults) },
    ];
  }, [categoryData]);

  // NG+ is only available when completion is 100%
  const isMainStoryComplete = completionPercentage >= 100;

  function handleNewGamePlus() {
    if (!isMainStoryComplete) return;
    const confirmed = window.confirm(
      `Start New Game+ (Cycle ${ngPlusCount + 1})?\n\n` +
      `Quest progress and exploration will reset.\n` +
      `Vocabulary, achievements, titles, and codex are kept.\n\n` +
      `XP multiplier will be ${Math.min(Math.pow(1.5, ngPlusCount + 1), 3).toFixed(2)}x`
    );
    if (confirmed) {
      dispatch(startNewGamePlus());
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Completion Tracker">
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>Completion Tracker</div>
            {ngPlusCount > 0 && (
              <div className={styles.ngBadge}>
                NG+{ngPlusCount} &bull; {ngPlusBonus.toFixed(2)}x XP
              </div>
            )}
          </div>
          <div className={styles.headerRight}>
            <div className={styles.weeklyCountBadge}>
              {completedChallengeCount} weekly{completedChallengeCount !== 1 ? 's' : ''} done
            </div>
            {onClose && (
              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close completion tracker"
              >
                CLOSE
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Left column — ring + NG+ */}
          <div className={styles.leftCol}>
            <div className={styles.ringWrapper}>
              <CircularRing percentage={completionPercentage} size={180} />
            </div>

            {/* NG+ Button */}
            <div className={styles.ngSection}>
              <div className={styles.ngLabel}>New Game+</div>
              {ngPlusCount > 0 && (
                <div className={styles.ngInfo}>
                  Cycle {ngPlusCount} — {ngPlusBonus.toFixed(2)}x XP bonus
                </div>
              )}
              <button
                className={`${styles.ngBtn} ${!isMainStoryComplete ? styles.ngBtnDisabled : ''}`}
                onClick={handleNewGamePlus}
                disabled={!isMainStoryComplete}
                aria-disabled={!isMainStoryComplete}
                title={!isMainStoryComplete ? 'Complete the main story first' : 'Start New Game+'}
              >
                {isMainStoryComplete ? 'START NG+' : 'COMPLETE STORY FIRST'}
              </button>
              {!isMainStoryComplete && (
                <div className={styles.ngHint}>
                  Reach 100% to unlock New Game+
                </div>
              )}
            </div>

            {/* Weekly challenge summary */}
            <div className={styles.weeklySection}>
              <div className={styles.weeklySectionTitle}>Weekly Challenge</div>
              <WeeklyChallengeCard
                challenge={weeklyChallenge}
                completedCount={completedChallengeCount}
              />
            </div>
          </div>

          {/* Right column — category breakdown */}
          <div className={styles.rightCol}>
            <div className={styles.breakdownTitle}>Progress Breakdown</div>
            <div className={styles.categoryList}>
              {categories.map((cat) => (
                <CategoryBar
                  key={cat.key}
                  label={cat.label}
                  icon={cat.icon}
                  current={cat.current}
                  total={cat.total}
                />
              ))}
            </div>

            {/* Weekly challenge history */}
            {weeklyChallengeHistory.length > 0 && (
              <div className={styles.historySection}>
                <div className={styles.historyTitle}>
                  Completed Challenges ({weeklyChallengeHistory.length})
                </div>
                <div className={styles.historyList}>
                  {[...weeklyChallengeHistory].reverse().slice(0, 5).map((c) => (
                    <div key={`${c.id}_${c.completedAt}`} className={styles.historyItem}>
                      <span className={styles.historyName}>{c.name}</span>
                      <span className={styles.historyXP}>+{c.reward.xp} XP</span>
                    </div>
                  ))}
                  {weeklyChallengeHistory.length > 5 && (
                    <div className={styles.historyMore}>
                      +{weeklyChallengeHistory.length - 5} more completed
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CompletionTracker;
