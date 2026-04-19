/**
 * ExpandedAnalyticsDashboard — Phase 93
 *
 * Comprehensive tabbed analytics dashboard with:
 * - Overview: study calendar, goals, quick stats
 * - Vocabulary: mastery distribution, struggling words, learning velocity
 * - Skills: quiz performance radar, grammar progress, CEFR estimation
 * - Activity: study time distribution, session timeline
 * - Reports: weekly/monthly reports with export
 */

import { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { selectWordAccuracy, selectSessions, selectDailyActivity, selectOverallAccuracy } from '../../store/slices/analyticsSlice.js';
import { selectCefrLevel } from '../../store/slices/cefrProgressSlice.js';
import { selectStreakInfo } from '../../store/slices/statsSlice.js';
import { selectWeeklyReports, selectMonthlyReports, selectStudySessions } from '../../store/slices/extendedAnalyticsSlice.js';
import {
  getVocabMasteryDistribution,
  getStrugglingWords,
  getStudyTimeDistribution,
  getLearningVelocity,
  getQuizPerformanceByType,
  getGrammarMasteryByCategory,
  getLearningRecommendations,
  getTimeToNextCefr,
  generateStudyReport,
} from '../../services/learningAnalytics.js';
import StudyCalendar from './StudyCalendar.jsx';
import GoalSetting from './GoalSetting.jsx';
import styles from './ExpandedAnalyticsDashboard.module.css';
import PropTypes from 'prop-types';

const TABS = [
  { id: 'overview', label: 'Overview', labelAr: 'نظرة عامة' },
  { id: 'vocabulary', label: 'Vocabulary', labelAr: 'المفردات' },
  { id: 'skills', label: 'Skills', labelAr: 'المهارات' },
  { id: 'activity', label: 'Activity', labelAr: 'النشاط' },
  { id: 'reports', label: 'Reports', labelAr: 'التقارير' },
];

const PIE_COLORS = ['#4ade80', '#FFD700', '#4A90D9', '#f03131'];
const CHART_TOOLTIP_STYLE = { background: '#1a1a2e', border: '1px solid #FFD700', color: '#fff' };

function ExpandedAnalyticsDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // Redux state
  const wordAccuracy = useSelector(selectWordAccuracy);
  const sessions = useSelector(selectSessions);
  const dailyActivity = useSelector(selectDailyActivity);
  const overallAccuracy = useSelector(selectOverallAccuracy);
  const cefrLevel = useSelector(selectCefrLevel);
  const streakInfo = useSelector(selectStreakInfo);
  const weeklyReports = useSelector(selectWeeklyReports);
  const monthlyReports = useSelector(selectMonthlyReports);
  const studySessions = useSelector(selectStudySessions);
  const vocabularyState = useSelector((s) => s.vocabulary);
  const grammarState = useSelector((s) => s.grammar);
  const readingState = useSelector((s) => s.reading);
  const conversationState = useSelector((s) => s.conversation);

  // Computed analytics
  const masteryDist = useMemo(
    () => getVocabMasteryDistribution(vocabularyState, wordAccuracy),
    [vocabularyState, wordAccuracy]
  );

  const strugglingWords = useMemo(
    () => getStrugglingWords(wordAccuracy, 10),
    [wordAccuracy]
  );

  const studyTimeDist = useMemo(
    () => getStudyTimeDistribution(sessions),
    [sessions]
  );

  const velocity = useMemo(
    () => getLearningVelocity(dailyActivity, 30),
    [dailyActivity]
  );

  const quizPerf = useMemo(
    () => getQuizPerformanceByType(sessions),
    [sessions]
  );

  const grammarMastery = useMemo(
    () => getGrammarMasteryByCategory(grammarState),
    [grammarState]
  );

  const recommendations = useMemo(
    () => getLearningRecommendations({
      wordAccuracy,
      vocabularyCount: Object.keys(vocabularyState?.fsrsCards || {}).length,
      grammarCompleted: grammarState?.completedLessons?.length || 0,
      readingCompleted: readingState?.readingStats?.totalRead || 0,
      conversationCompleted: conversationState?.stats?.totalCompleted || 0,
      currentStreak: streakInfo.current,
      sessionsCount: sessions.length,
    }),
    [wordAccuracy, vocabularyState, grammarState, readingState, conversationState, streakInfo, sessions]
  );

  const cefrEstimate = useMemo(
    () => getTimeToNextCefr({ currentLevel: cefrLevel }, velocity),
    [cefrLevel, velocity]
  );

  const currentReport = useMemo(
    () => generateStudyReport({
      dailyActivity,
      sessions,
      wordAccuracy,
      grammarState,
      readingState,
      conversationState,
      statsState: { currentStreak: streakInfo.current },
    }, 'weekly'),
    [dailyActivity, sessions, wordAccuracy, grammarState, readingState, conversationState, streakInfo]
  );

  // Handlers
  const handleBackdropClick = useCallback(
    (e) => { if (e.target === e.currentTarget) onClose(); },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  const handleExport = useCallback((report) => {
    const text = formatReportForExport(report);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  // Quick stats
  const totalWords = Object.keys(wordAccuracy).length;
  const totalMinutes = Object.values(dailyActivity).reduce(
    (sum, d) => sum + Math.round((d.timeSpentMs || 0) / 60000), 0
  );

  // Pie chart data
  const pieData = [
    { name: 'Mastered / متقن', value: masteryDist.mastered },
    { name: 'Learning / يتعلم', value: masteryDist.learning },
    { name: 'New / جديد', value: masteryDist.new },
    { name: 'Struggling / صعب', value: masteryDist.struggling },
  ].filter((d) => d.value > 0);

  // Radar chart data
  const radarData = Object.entries(quizPerf).map(([type, data]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    accuracy: Math.round(data.accuracy * 100),
    fullMark: 100,
  }));

  // Study time bar data
  const timeBarData = Object.entries(studyTimeDist)
    .filter(([, mins]) => mins > 0)
    .map(([activity, mins]) => ({
      activity: activity.charAt(0).toUpperCase() + activity.slice(1),
      minutes: Math.round(mins * 10) / 10,
    }));

  // Velocity line data (last 14 days for readability)
  const velocityData = velocity.slice(-14).map((d) => ({
    date: d.date.slice(5), // MM-DD
    words: d.wordsLearned,
  }));

  const recTypeIcons = { review: '\uD83D\uDD04', practice: '\uD83C\uDFAF', explore: '\uD83D\uDE80' };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Expanded Analytics Dashboard"
    >
      <div className={styles.panel} role="document">
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close analytics"
          type="button"
        >
          {'\u00D7'}
        </button>

        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Learning Analytics</h2>
            <p className={styles.titleArabic}>تحليلات التعلم</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className={styles.tabBar} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.tabContent} id={`panel-${activeTab}`} role="tabpanel">
          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 'overview' && (
            <>
              {/* Quick stats */}
              <div className={styles.quickStats} data-testid="quick-stats">
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{totalWords}</span>
                  <span className={styles.statLabel}>Words / كلمات</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{sessions.length}</span>
                  <span className={styles.statLabel}>Sessions / جلسات</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{totalMinutes}m</span>
                  <span className={styles.statLabel}>Study Time / وقت</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{streakInfo.current}</span>
                  <span className={styles.statLabel}>Streak / سلسلة</span>
                </div>
              </div>

              {/* Study calendar */}
              <StudyCalendar />

              {/* Goal progress */}
              <GoalSetting readOnly />

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Recommendations
                    <span className={styles.sectionTitleArabic}>التوصيات</span>
                  </h3>
                  <div className={styles.recommendationList}>
                    {recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className={styles.recommendationCard}>
                        <span className={styles.recommendationIcon}>
                          {recTypeIcons[rec.type] || '\uD83D\uDCA1'}
                        </span>
                        <div>
                          <span className={styles.recommendationType}>{rec.type}</span>
                          <p className={styles.recommendationText}>{rec.description}</p>
                          <p className={styles.recommendationArabic}>{rec.descriptionArabic}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===== VOCABULARY TAB ===== */}
          {activeTab === 'vocabulary' && (
            <>
              {/* Mastery distribution pie */}
              {pieData.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Mastery Distribution
                    <span className={styles.sectionTitleArabic}>توزيع الإتقان</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                      <Legend
                        wrapperStyle={{ fontSize: '0.7rem', color: '#c8c8c8' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Struggling words */}
              {strugglingWords.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Struggling Words
                    <span className={styles.sectionTitleArabic}>كلمات تحتاج مراجعة</span>
                  </h3>
                  <table className={styles.wordTable}>
                    <thead>
                      <tr>
                        <th>Word</th>
                        <th>Accuracy</th>
                        <th>Attempts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strugglingWords.map((w) => (
                        <tr key={w.wordId}>
                          <td>{w.wordId}</td>
                          <td className={
                            w.accuracy < 0.5
                              ? styles.wordAccuracyLow
                              : w.accuracy < 0.7
                              ? styles.wordAccuracyMed
                              : styles.wordAccuracyHigh
                          }>
                            {Math.round(w.accuracy * 100)}%
                          </td>
                          <td>{w.attempts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Learning velocity */}
              {velocityData.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Learning Velocity
                    <span className={styles.sectionTitleArabic}>سرعة التعلم</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={velocityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a373b" />
                      <XAxis dataKey="date" stroke="#c8c8c8" fontSize={9} />
                      <YAxis stroke="#c8c8c8" fontSize={9} />
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                      <Line
                        type="monotone"
                        dataKey="words"
                        stroke="#FFD700"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#FFD700' }}
                        name="Words Reviewed"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

          {/* ===== SKILLS TAB ===== */}
          {activeTab === 'skills' && (
            <>
              {/* Quiz performance radar */}
              {radarData.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Quiz Performance
                    <span className={styles.sectionTitleArabic}>أداء الاختبارات</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#3a373b" />
                      <PolarAngleAxis dataKey="type" tick={{ fill: '#c8c8c8', fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Accuracy %"
                        dataKey="accuracy"
                        stroke="#FFD700"
                        fill="#FFD700"
                        fillOpacity={0.3}
                      />
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Grammar mastery */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Grammar Progress
                  <span className={styles.sectionTitleArabic}>تقدم القواعد</span>
                </h3>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBarLabel}>
                    <span>Completed</span>
                    <span>{grammarMastery.completed}/{grammarMastery.total}</span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${grammarMastery.total > 0 ? (grammarMastery.completed / grammarMastery.total) * 100 : 0}%`,
                        background: '#4ade80',
                      }}
                    />
                  </div>
                </div>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBarLabel}>
                    <span>Average Score</span>
                    <span>{grammarMastery.averageScore}%</span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${grammarMastery.averageScore}%`,
                        background: '#FFD700',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CEFR estimation */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  CEFR Progress
                  <span className={styles.sectionTitleArabic}>تقدم المستوى</span>
                </h3>
                <div className={styles.cefrCard}>
                  <span className={styles.cefrBadge}>
                    {cefrEstimate.currentLevel || '?'}
                  </span>
                  <div className={styles.cefrInfo}>
                    {cefrEstimate.nextLevel ? (
                      <>
                        <p className={styles.cefrNext}>
                          Next level: <strong>{cefrEstimate.nextLevel}</strong>
                        </p>
                        <p className={styles.cefrEstimate}>
                          Estimated: ~{cefrEstimate.estimatedDays} days
                        </p>
                        <span className={styles.cefrConfidence}>
                          Confidence: {cefrEstimate.confidence}
                        </span>
                      </>
                    ) : (
                      <p className={styles.cefrNext}>
                        {cefrEstimate.currentLevel
                          ? 'Highest level reached!'
                          : 'Take the placement test to see your level'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===== ACTIVITY TAB ===== */}
          {activeTab === 'activity' && (
            <>
              {/* Study time distribution */}
              {timeBarData.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Time by Activity
                    <span className={styles.sectionTitleArabic}>الوقت حسب النشاط</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={timeBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a373b" />
                      <XAxis dataKey="activity" stroke="#c8c8c8" fontSize={9} />
                      <YAxis stroke="#c8c8c8" fontSize={9} unit=" min" />
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                      <Bar dataKey="minutes" fill="#4A90D9" name="Minutes" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Session timeline */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Recent Sessions
                  <span className={styles.sectionTitleArabic}>الجلسات الأخيرة</span>
                </h3>
                {studySessions.length > 0 ? (
                  <div className={styles.timeline} data-testid="session-timeline">
                    {studySessions.slice(-20).reverse().map((s, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <span className={styles.timelineDate}>{s.date}</span>
                        <span className={styles.timelineActivity}>{s.activity}</span>
                        <span className={styles.timelineDuration}>
                          {Math.round(s.duration / 60)}m
                        </span>
                      </div>
                    ))}
                  </div>
                ) : sessions.length > 0 ? (
                  <div className={styles.timeline} data-testid="session-timeline">
                    {sessions.slice(-20).reverse().map((s, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <span className={styles.timelineDate}>{s.startedAt?.slice(0, 10)}</span>
                        <span className={styles.timelineActivity}>{s.type}</span>
                        <span className={styles.timelineDuration}>
                          {s.endedAt && s.startedAt
                            ? `${Math.round((new Date(s.endedAt) - new Date(s.startedAt)) / 60000)}m`
                            : '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyState}>No sessions recorded yet.</p>
                )}
              </div>

              {/* Overall accuracy */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Overall Accuracy
                  <span className={styles.sectionTitleArabic}>الدقة الإجمالية</span>
                </h3>
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <span className={styles.statValue} style={{ fontSize: '2rem' }}>
                    {Math.round(overallAccuracy * 100)}%
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ===== REPORTS TAB ===== */}
          {activeTab === 'reports' && (
            <>
              {/* Current week report */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  This Week
                  <span className={styles.sectionTitleArabic}>هذا الأسبوع</span>
                </h3>
                <ReportCard report={currentReport} onExport={handleExport} />
                {copied && <span className={styles.copiedMsg}>Copied to clipboard!</span>}
              </div>

              {/* Historical weekly reports */}
              {weeklyReports.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Past Weeks
                    <span className={styles.sectionTitleArabic}>الأسابيع السابقة</span>
                  </h3>
                  {weeklyReports.slice().reverse().map((report, i) => (
                    <ReportCard key={i} report={report} onExport={handleExport} />
                  ))}
                </div>
              )}

              {/* Monthly reports */}
              {monthlyReports.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    Monthly Reports
                    <span className={styles.sectionTitleArabic}>تقارير شهرية</span>
                  </h3>
                  {monthlyReports.slice().reverse().map((report, i) => (
                    <ReportCard key={i} report={report} onExport={handleExport} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Report card sub-component.
 */
function ReportCard({ report, onExport }) {
  if (!report) return null;

  return (
    <div className={styles.reportCard}>
      <div className={styles.reportHeader}>
        <span className={styles.reportPeriod}>
          {report.period === 'weekly' ? 'Weekly' : 'Monthly'} Report
        </span>
        <span className={styles.reportDate}>
          {report.startDate} to {report.endDate}
        </span>
      </div>

      <div className={styles.reportStats}>
        <div className={styles.reportStatItem}>
          <span className={styles.reportStatValue}>{report.wordsReviewed}</span>
          <span className={styles.reportStatLabel}>Words Reviewed</span>
        </div>
        <div className={styles.reportStatItem}>
          <span className={styles.reportStatValue}>{report.averageAccuracy}%</span>
          <span className={styles.reportStatLabel}>Accuracy</span>
        </div>
        <div className={styles.reportStatItem}>
          <span className={styles.reportStatValue}>{report.studyMinutes}m</span>
          <span className={styles.reportStatLabel}>Study Time</span>
        </div>
        <div className={styles.reportStatItem}>
          <span className={styles.reportStatValue}>{report.sessionsCount}</span>
          <span className={styles.reportStatLabel}>Sessions</span>
        </div>
        <div className={styles.reportStatItem}>
          <span className={styles.reportStatValue}>{report.streakDays}</span>
          <span className={styles.reportStatLabel}>Active Days</span>
        </div>
        <div className={styles.reportStatItem}>
          <span className={styles.reportStatValue}>{report.grammarLessonsCompleted}</span>
          <span className={styles.reportStatLabel}>Grammar</span>
        </div>
      </div>

      {report.highlights && report.highlights.length > 0 && (
        <ul className={styles.reportHighlights}>
          {report.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      <button
        className={styles.exportBtn}
        onClick={() => onExport(report)}
        type="button"
      >
        Copy Report
      </button>
    </div>
  );
}

ReportCard.propTypes = {
  report: PropTypes.object,
  onExport: PropTypes.func,
};

/**
 * Format a report object as clipboard-friendly text.
 */
function formatReportForExport(report) {
  const lines = [
    `=== Gogo Arabic ${report.period === 'weekly' ? 'Weekly' : 'Monthly'} Report ===`,
    `Period: ${report.startDate} to ${report.endDate}`,
    '',
    `Words Reviewed: ${report.wordsReviewed}`,
    `Words Mastered: ${report.wordsMastered}`,
    `Average Accuracy: ${report.averageAccuracy}%`,
    `Study Time: ${report.studyMinutes} minutes`,
    `Sessions: ${report.sessionsCount}`,
    `Active Days: ${report.streakDays}`,
    `Grammar Lessons: ${report.grammarLessonsCompleted}`,
    `Passages Read: ${report.passagesRead}`,
    `Conversations: ${report.conversationsHad}`,
  ];

  if (report.highlights && report.highlights.length > 0) {
    lines.push('', 'Highlights:');
    report.highlights.forEach((h) => lines.push(`  * ${h}`));
  }

  if (report.recommendations && report.recommendations.length > 0) {
    lines.push('', 'Recommendations:');
    report.recommendations.forEach((r) => lines.push(`  - ${r.description}`));
  }

  lines.push('', '--- Generated by Gogo Arabic ---');
  return lines.join('\n');
}

ExpandedAnalyticsDashboard.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ExpandedAnalyticsDashboard;
