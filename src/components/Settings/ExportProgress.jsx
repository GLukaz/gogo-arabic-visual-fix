/**
 * ExportProgress.jsx
 * Settings panel for exporting player progress data as JSON or CSV.
 *
 * Exports:
 *   - Learned vocabulary with FSRS stats
 *   - Completed grammar lessons with scores
 *   - Quiz history
 *   - Achievement list (unlocked with timestamps)
 *   - CEFR level
 */
import { useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import { selectFsrsCards } from '../../store/slices/vocabularySlice.js';
import { selectCompletedLessons, selectLessonScores } from '../../store/slices/grammarSlice.js';
import { selectUnlockedAchievements } from '../../store/slices/achievementSlice.js';
import { selectCefrLevel, selectCefrHistory } from '../../store/slices/cefrProgressSlice.js';
import { getAchievementById } from '../../data/achievements.js';
import styles from './ExportProgress.module.css';

/**
 * Build a complete progress object from Redux state.
 * @param {Object} params
 * @returns {Object} Progress data ready for export
 */
function buildProgressData({ fsrsCards, completedLessons, lessonScores, unlockedAchievements, cefrLevel, cefrHistory, quizzesPassed, playerName, playerLevel }) {
  // 1. Vocabulary with FSRS stats
  const vocabulary = Object.entries(fsrsCards).map(([wordId, data]) => ({
    wordId,
    card: data.card || null,
    lastReview: data.log || null,
    source: data.source || null,
  }));

  // 2. Grammar lessons with scores
  const grammarLessons = completedLessons.map((lessonId) => ({
    lessonId,
    ...(lessonScores[lessonId] || {}),
  }));

  // 3. Quiz history
  const quizHistory = (quizzesPassed || []).map((q, index) => ({
    index: index + 1,
    accuracy: q.accuracy,
    timestamp: q.timestamp,
  }));

  // 4. Achievements
  const achievements = Object.entries(unlockedAchievements).map(([id, timestamp]) => {
    const def = getAchievementById(id);
    return {
      id,
      name: def?.name || id,
      description: def?.description || '',
      category: def?.category || 'unknown',
      unlockedAt: new Date(timestamp).toISOString(),
    };
  });

  // 5. CEFR level
  const cefr = {
    currentLevel: cefrLevel || 'Not assessed',
    history: cefrHistory || [],
  };

  return {
    exportDate: new Date().toISOString(),
    playerName: playerName || 'Anonymous',
    playerLevel: playerLevel || 1,
    cefrLevel: cefr,
    vocabulary,
    grammarLessons,
    quizHistory,
    achievements,
    summary: {
      wordsLearned: vocabulary.length,
      grammarCompleted: grammarLessons.length,
      quizzesCompleted: quizHistory.length,
      achievementsUnlocked: achievements.length,
    },
  };
}

/**
 * Convert progress data to CSV format.
 * Returns a multi-section CSV string with vocabulary, grammar, quizzes, and achievements.
 */
function progressToCSV(data) {
  const lines = [];

  // Header
  lines.push('# GoGo Arabic Progress Export');
  lines.push(`# Date: ${data.exportDate}`);
  lines.push(`# Player: ${data.playerName}`);
  lines.push(`# Level: ${data.playerLevel}`);
  lines.push(`# CEFR: ${data.cefrLevel.currentLevel}`);
  lines.push('');

  // Vocabulary
  lines.push('## Vocabulary');
  lines.push('Word ID,Due Date,Reps,Stability,Difficulty,Source');
  data.vocabulary.forEach((v) => {
    const card = v.card || {};
    lines.push([
      v.wordId,
      card.due || '',
      card.reps ?? '',
      card.stability ?? '',
      card.difficulty ?? '',
      v.source || '',
    ].join(','));
  });
  lines.push('');

  // Grammar
  lines.push('## Grammar Lessons');
  lines.push('Lesson ID,Exercise Score,Quiz Score,Attempts,Last Attempt');
  data.grammarLessons.forEach((g) => {
    lines.push([
      g.lessonId,
      g.exerciseScore ?? '',
      g.quizScore ?? '',
      g.attempts ?? '',
      g.lastAttempt || '',
    ].join(','));
  });
  lines.push('');

  // Quiz History
  lines.push('## Quiz History');
  lines.push('Index,Accuracy,Timestamp');
  data.quizHistory.forEach((q) => {
    lines.push([q.index, q.accuracy ?? '', q.timestamp || ''].join(','));
  });
  lines.push('');

  // Achievements
  lines.push('## Achievements');
  lines.push('ID,Name,Category,Unlocked At');
  data.achievements.forEach((a) => {
    lines.push([a.id, `"${a.name}"`, a.category, a.unlockedAt].join(','));
  });

  return lines.join('\n');
}

/**
 * Trigger a file download in the browser.
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ExportProgress({ onBack }) {
  const fsrsCards = useSelector(selectFsrsCards);
  const completedLessons = useSelector(selectCompletedLessons);
  const lessonScores = useSelector(selectLessonScores);
  const unlockedAchievements = useSelector(selectUnlockedAchievements);
  const cefrLevel = useSelector(selectCefrLevel);
  const cefrHistory = useSelector(selectCefrHistory);
  const quizzesPassed = useSelector((state) => state.quests?.quizzesPassed || []);
  const playerName = useSelector((state) => state.player?.name || '');
  const playerLevel = useSelector((state) => state.player?.level || 1);

  const [exportStatus, setExportStatus] = useState(null);

  const getProgressData = useCallback(() => {
    return buildProgressData({
      fsrsCards,
      completedLessons,
      lessonScores,
      unlockedAchievements,
      cefrLevel,
      cefrHistory,
      quizzesPassed,
      playerName,
      playerLevel,
    });
  }, [fsrsCards, completedLessons, lessonScores, unlockedAchievements, cefrLevel, cefrHistory, quizzesPassed, playerName, playerLevel]);

  const handleExportJSON = useCallback(() => {
    try {
      const data = getProgressData();
      const json = JSON.stringify(data, null, 2);
      const date = new Date().toISOString().split('T')[0];
      downloadFile(json, `gogo-arabic-progress-${date}.json`, 'application/json');
      setExportStatus('json');
      setTimeout(() => setExportStatus(null), 3000);
    } catch {
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 3000);
    }
  }, [getProgressData]);

  const handleExportCSV = useCallback(() => {
    try {
      const data = getProgressData();
      const csv = progressToCSV(data);
      const date = new Date().toISOString().split('T')[0];
      downloadFile(csv, `gogo-arabic-progress-${date}.csv`, 'text/csv');
      setExportStatus('csv');
      setTimeout(() => setExportStatus(null), 3000);
    } catch {
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 3000);
    }
  }, [getProgressData]);

  // Summary counts
  const vocabCount = Object.keys(fsrsCards).length;
  const grammarCount = completedLessons.length;
  const quizCount = quizzesPassed.length;
  const achievementCount = Object.keys(unlockedAchievements).length;

  return (
    <div className={styles.container} role="region" aria-label="Export Progress">
      <div className={styles.panel}>
        <h2 className={styles.title}>Export My Progress</h2>

        <p className={styles.description}>
          Download your learning data as JSON or CSV. Includes vocabulary,
          grammar, quizzes, achievements, and CEFR level.
        </p>

        {/* Summary Section */}
        <div className={styles.summary}>
          <div className={styles.sectionHeading}>Data Summary</div>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{vocabCount}</span>
              <span className={styles.statLabel}>Words</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{grammarCount}</span>
              <span className={styles.statLabel}>Grammar</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{quizCount}</span>
              <span className={styles.statLabel}>Quizzes</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{achievementCount}</span>
              <span className={styles.statLabel}>Achievements</span>
            </div>
          </div>
          <div className={styles.cefrRow}>
            <span className={styles.label}>CEFR Level</span>
            <span className={styles.cefrBadge}>{cefrLevel || 'N/A'}</span>
          </div>
        </div>

        {/* Export Buttons */}
        <div className={styles.exportButtons}>
          <button
            className={styles.exportBtn}
            onClick={handleExportJSON}
            aria-label="Export as JSON"
          >
            Export JSON
          </button>
          <button
            className={styles.exportBtn}
            onClick={handleExportCSV}
            aria-label="Export as CSV"
          >
            Export CSV
          </button>
        </div>

        {/* Status Message */}
        {exportStatus === 'json' && (
          <div className={styles.statusSuccess} role="status" aria-live="polite">
            JSON file downloaded!
          </div>
        )}
        {exportStatus === 'csv' && (
          <div className={styles.statusSuccess} role="status" aria-live="polite">
            CSV file downloaded!
          </div>
        )}
        {exportStatus === 'error' && (
          <div className={styles.statusError} role="alert">
            Export failed. Please try again.
          </div>
        )}

        {onBack && (
          <button className={styles.backBtn} onClick={onBack} aria-label="Back to settings menu">
            Back
          </button>
        )}
      </div>
    </div>
  );
}

// Export for testing
export { buildProgressData, progressToCSV };
