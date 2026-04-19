import { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  selectCefrLevel,
  selectCefrHistory,
  recordCefrSnapshot,
} from '../../store/slices/cefrProgressSlice.js';
import { selectSkillXP } from '../../store/slices/skillTreeSlice.js';
import { CEFR_ORDER } from '../../data/quizTypes.js';
import { SKILL_TREES, SKILL_TREE_ORDER } from '../../data/skillTrees.js';
import SocialShareCard from './SocialShareCard.jsx';
import styles from './CefrProgressReport.module.css';

/**
 * CefrProgressReport — CEFR visual progress overlay.
 *
 * Shows:
 *  - RadarChart: XP distribution across all 6 skill trees
 *  - LineChart: CEFR level advancement over time
 *
 * Dispatches recordCefrSnapshot on mount so this session's level is persisted.
 *
 * @param {{ onClose: () => void }} props
 */
function CefrProgressReport({ onClose }) {
  const dispatch = useDispatch();
  const [shareOpen, setShareOpen] = useState(false);
  const currentLevel = useSelector(selectCefrLevel);
  const levelHistory = useSelector(selectCefrHistory);

  // Read XP for each of the 6 skill trees at the top level (Rules of Hooks)
  const readingXP = useSelector(selectSkillXP('reading'));
  const writingXP = useSelector(selectSkillXP('writing'));
  const listeningXP = useSelector(selectSkillXP('listening'));
  const speakingXP = useSelector(selectSkillXP('speaking'));
  const grammarXP = useSelector(selectSkillXP('grammar'));
  const cultureXP = useSelector(selectSkillXP('culture'));

  // Map tree IDs to their XP values
  const xpByTree = {
    reading: readingXP,
    writing: writingXP,
    listening: listeningXP,
    speaking: speakingXP,
    grammar: grammarXP,
    culture: cultureXP,
  };

  // Record session snapshot on mount (forward-only, once-per-day)
  useEffect(() => {
    if (currentLevel !== null) {
      dispatch(recordCefrSnapshot({ level: currentLevel }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // Build radar data from skill tree order
  const radarData = SKILL_TREE_ORDER.map((treeId) => ({
    skill: SKILL_TREES[treeId].nameArabic,
    xp: xpByTree[treeId] ?? 0,
    fullMark: 900,
  }));

  // Build line chart data from level history + current
  const lineData = [
    ...levelHistory.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      levelNum: CEFR_ORDER[entry.level] ?? 0,
      label: entry.level,
    })),
    {
      date: 'Now',
      levelNum: CEFR_ORDER[currentLevel] ?? 1,
      label: currentLevel,
    },
  ];

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } },
  };

  const hasPlacementDone = currentLevel !== null;

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="CEFR Progress Report"
    >
      <motion.div
        className={styles.panel}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="document"
      >
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close CEFR Progress Report"
          type="button"
        >
          ×
        </button>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>CEFR Progress Report</h2>
          {hasPlacementDone && (
            <span className={styles.levelBadge} aria-label={`Current CEFR level: ${currentLevel}`}>
              {currentLevel}
            </span>
          )}
        </div>

        {!hasPlacementDone ? (
          /* Empty state: no placement test done */
          <div className={styles.emptyState}>
            Complete the Placement Test to see your CEFR progress!
          </div>
        ) : (
          <>
            {/* Section 1: Skill Distribution RadarChart */}
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Skill Distribution</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#3a373b" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#c8c8c8', fontSize: 11 }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 900]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Skill XP"
                    dataKey="xp"
                    stroke="#e2b659"
                    fill="#e2b659"
                    fillOpacity={0.35}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid #e2b659',
                      color: '#fff',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Section 2: Level Timeline LineChart */}
            {lineData.length > 0 && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Level Timeline</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart
                    data={lineData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a373b" />
                    <XAxis dataKey="date" tick={{ fill: '#c8c8c8', fontSize: 10 }} />
                    <YAxis
                      domain={[0, 4]}
                      ticks={[1, 2, 3, 4]}
                      tickFormatter={(v) => ['', 'A1', 'A2', 'B1', 'B2'][v] || ''}
                      tick={{ fill: '#e2b659', fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v) => ['', 'A1', 'A2', 'B1', 'B2'][v] || v}
                      contentStyle={{
                        background: '#1a1a2e',
                        border: '1px solid #e2b659',
                        color: '#fff',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="levelNum"
                      stroke="#e2b659"
                      strokeWidth={2}
                      dot={{ fill: '#e2b659', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            {/* Share Progress button */}
            <div className={styles.shareRow}>
              <button
                className={styles.shareBtn}
                onClick={() => setShareOpen(true)}
                type="button"
                aria-label="Share your Arabic learning progress"
              >
                Share Progress
              </button>
            </div>
          </>
        )}
      </motion.div>

      {shareOpen && (
        <SocialShareCard onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
}

import PropTypes from 'prop-types';

CefrProgressReport.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CefrProgressReport;
