/**
 * AnalyticsDashboard — Phase 73
 *
 * Lazy-loaded analytics view showing:
 * - Hardest words (lowest accuracy)
 * - Session trends (line chart)
 * - Daily activity (bar chart)
 * - Overall completion rate
 *
 * Uses recharts (already installed).
 */

import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  selectHardestWords,
  selectSessionTrends,
  selectOverallAccuracy,
  selectDailyActivity,
} from '../../store/slices/analyticsSlice.js';
import {
  selectQuranicCoverage,
  selectQuranicCoverageByCategory,
} from '../../store/slices/vocabularySlice.js';
import PropTypes from 'prop-types';

function AnalyticsDashboard({ onBack }) {
  const hardestWords = useSelector((s) => selectHardestWords(s, 8));
  const sessionTrends = useSelector((s) => selectSessionTrends(s, 14));
  const overallAccuracy = useSelector(selectOverallAccuracy);
  const dailyActivity = useSelector(selectDailyActivity);
  const quranicCoverage = useSelector(selectQuranicCoverage);
  const quranicByCategory = useSelector(selectQuranicCoverageByCategory);

  const dailyData = useMemo(() => {
    return Object.entries(dailyActivity)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, data]) => ({
        date: date.slice(5), // MM-DD
        words: data.wordsReviewed,
        lessons: data.lessonsCompleted,
        minutes: Math.round(data.timeSpentMs / 60000),
      }));
  }, [dailyActivity]);

  const accuracyTrendData = useMemo(() => {
    return sessionTrends.map((s, i) => ({
      session: i + 1,
      accuracy: Math.round(s.accuracy * 100),
      words: s.wordsReviewed,
    }));
  }, [sessionTrends]);

  const handleBack = useCallback(() => {
    if (onBack) onBack();
  }, [onBack]);

  const hasData = hardestWords.length > 0 || sessionTrends.length > 0 || dailyData.length > 0;

  return (
    <div style={styles.overlay}>
      <motion.div
        style={styles.panel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Analytics</h2>
          <button style={styles.closeBtn} onClick={handleBack} aria-label="Close analytics">
            ✕
          </button>
        </div>

        {!hasData ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No analytics data yet.</p>
            <p style={styles.emptySubtext}>Complete some reviews or grammar lessons to see your stats!</p>
          </div>
        ) : (
          <div style={styles.content}>
            {/* Overall accuracy */}
            <div style={styles.statRow}>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Overall Accuracy</span>
                <span style={styles.statValue}>{Math.round(overallAccuracy * 100)}%</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Sessions</span>
                <span style={styles.statValue}>{sessionTrends.length}</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Words Tracked</span>
                <span style={styles.statValue}>{hardestWords.length > 0 ? '8+' : '0'}</span>
              </div>
            </div>

            {/* Hardest Words */}
            {hardestWords.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Hardest Words</h3>
                <div style={styles.wordList}>
                  {hardestWords.map((w) => (
                    <div key={w.wordId} style={styles.wordRow}>
                      <span style={styles.wordId}>{w.wordId}</span>
                      <div style={styles.accuracyBar}>
                        <div
                          style={{
                            ...styles.accuracyFill,
                            width: `${Math.round(w.accuracy * 100)}%`,
                            background: w.accuracy < 0.5 ? '#f03131' : w.accuracy < 0.7 ? '#f8a060' : '#2ecc71',
                          }}
                        />
                      </div>
                      <span style={styles.accuracyText}>
                        {Math.round(w.accuracy * 100)}% ({w.correct}/{w.total})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Accuracy Trend */}
            {accuracyTrendData.length > 1 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Session Accuracy Trend</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={accuracyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a373b" />
                    <XAxis dataKey="session" stroke="#c8c8c8" fontSize={9} />
                    <YAxis domain={[0, 100]} stroke="#c8c8c8" fontSize={9} unit="%" />
                    <Tooltip
                      contentStyle={{ background: '#2b292c', border: '1px solid #3a373b', fontFamily: "'Press Start 2P', cursive", fontSize: 8 }}
                      labelStyle={{ color: '#e2b659' }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#e2b659" strokeWidth={2} dot={{ r: 3, fill: '#e2b659' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Daily Activity */}
            {dailyData.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Daily Activity</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a373b" />
                    <XAxis dataKey="date" stroke="#c8c8c8" fontSize={8} />
                    <YAxis stroke="#c8c8c8" fontSize={9} />
                    <Tooltip
                      contentStyle={{ background: '#2b292c', border: '1px solid #3a373b', fontFamily: "'Press Start 2P', cursive", fontSize: 8 }}
                      labelStyle={{ color: '#e2b659' }}
                    />
                    <Bar dataKey="words" fill="#66d7ee" name="Words" />
                    <Bar dataKey="lessons" fill="#2ecc71" name="Lessons" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Quranic Coverage */}
            {quranicCoverage.total > 0 && (
              <div style={styles.section} aria-label="Quranic vocabulary coverage">
                <h3 style={styles.sectionTitle}>Quranic Coverage</h3>
                <div style={styles.quranicSummary}>
                  <span style={styles.quranicPct}>{quranicCoverage.percentage}%</span>
                  <span style={styles.quranicDetail}>
                    {quranicCoverage.mastered} / {quranicCoverage.total} words mastered
                  </span>
                  <span style={styles.quranicSeen}>({quranicCoverage.seen} seen)</span>
                </div>
                {quranicByCategory.length > 0 && (
                  <div style={styles.wordList}>
                    {quranicByCategory.slice(0, 5).map((cat) => (
                      <div key={cat.category} style={styles.wordRow}>
                        <span style={styles.wordId}>{cat.category}</span>
                        <div style={styles.accuracyBar}>
                          <div
                            style={{
                              ...styles.accuracyFill,
                              width: `${cat.percentage}%`,
                              background: cat.percentage < 30 ? '#f03131' : cat.percentage < 60 ? '#f8a060' : '#2ecc71',
                            }}
                          />
                        </div>
                        <span style={styles.accuracyText}>
                          {cat.percentage}% ({cat.mastered}/{cat.total})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  panel: {
    background: '#1e1e2e',
    border: '3px solid #3a373b',
    width: '90%',
    maxWidth: 700,
    maxHeight: '85vh',
    overflow: 'auto',
    padding: 20,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottom: '2px solid #3a373b',
    paddingBottom: 10,
  },
  title: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 16,
    color: '#e2b659',
    margin: 0,
  },
  closeBtn: {
    background: 'transparent',
    border: '1px solid #3a373b',
    color: '#c8c8c8',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 12,
    cursor: 'pointer',
    padding: '4px 8px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  statRow: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  statCard: {
    background: '#2b292c',
    border: '2px solid #3a373b',
    padding: '10px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statLabel: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 7,
    color: '#c8c8c8',
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 18,
    color: '#e2b659',
    fontWeight: 'bold',
  },
  section: {
    background: '#2b292c',
    border: '2px solid #3a373b',
    padding: 12,
  },
  sectionTitle: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 10,
    color: '#f4fefa',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
  },
  wordList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  wordRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  wordId: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 8,
    color: '#f4fefa',
    width: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  accuracyBar: {
    flex: 1,
    height: 8,
    background: '#1e1e2e',
    border: '1px solid #3a373b',
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    transition: 'width 0.3s',
  },
  accuracyText: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 7,
    color: '#c8c8c8',
    width: 80,
    textAlign: 'right',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 12,
    color: '#c8c8c8',
    marginBottom: 10,
  },
  emptySubtext: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 8,
    color: '#666',
    lineHeight: 1.8,
  },
  quranicSummary: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },
  quranicPct: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 22,
    color: '#e2b659',
    fontWeight: 'bold',
  },
  quranicDetail: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 7,
    color: '#f4fefa',
  },
  quranicSeen: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 7,
    color: '#666',
  },
};

AnalyticsDashboard.propTypes = {
  onBack: PropTypes.func,
};

export default AnalyticsDashboard;
