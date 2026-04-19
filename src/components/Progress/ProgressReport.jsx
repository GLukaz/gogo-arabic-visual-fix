/**
 * ProgressReport — Phase 88
 *
 * Full progress dashboard showing level, vocabulary, grammar,
 * activity summary, streaks, next unlocks, and CEFR estimate.
 * Reads from Redux state and computes derived data via progressionService.
 */

import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPlayerStats, selectStreakInfo } from '../../store/slices/playerSlice.js';
import { selectLearnedWordCount, selectFsrsCards, selectWordsAtRisk } from '../../store/slices/vocabularySlice.js';
import vocabulary from '../../data/vocabularyAll.js';
import styles from './ProgressReport.module.css';
import { getProgressReport, getUnlockedQuizTypes } from '../../services/progressionService.js';

/**
 * Count mastered words (FSRS stability >= 21 days = well-learned).
 * @param {Object} fsrsCards
 * @returns {number}
 */
function countMasteredWords(fsrsCards) {
  let count = 0;
  for (const wordId in fsrsCards) {
    const card = fsrsCards[wordId]?.card;
    if (card && card.stability >= 21) count++;
  }
  return count;
}

function ProgressReport() {
  const playerStats = useSelector(selectPlayerStats);
  const streakInfo = useSelector(selectStreakInfo);
  const wordsLearned = useSelector(selectLearnedWordCount);
  const fsrsCards = useSelector(selectFsrsCards);

  const grammarLessonsCompleted = useSelector(
    (state) => state.grammar?.completedLessons?.length ?? 0
  );
  const questsCompleted = useSelector(
    (state) => {
      const quests = state.quests?.quests ?? {};
      return Object.values(quests).filter((q) => q.status === 'completed').length;
    }
  );

  const wordsAtRisk = useSelector(selectWordsAtRisk);
  const wordLookup = useMemo(() => {
    const map = {};
    for (const w of vocabulary) map[w.id] = w;
    return map;
  }, []);

  const wordsMastered = useMemo(() => countMasteredWords(fsrsCards), [fsrsCards]);

  const report = useMemo(() => {
    return getProgressReport({
      level: playerStats.level,
      xp: playerStats.xp,
      wordsLearned,
      wordsMastered,
      grammarLessonsCompleted,
      questsCompleted,
      streak: streakInfo.current,
      maxStreak: streakInfo.max,
    });
  }, [playerStats, wordsLearned, wordsMastered, grammarLessonsCompleted, questsCompleted, streakInfo]);

  const unlockedQuizTypes = useMemo(
    () => getUnlockedQuizTypes(playerStats.level),
    [playerStats.level]
  );

  return (
    <div className={styles.container} role="region" aria-label="Progress Report">
      <h2 className={styles.heading}>Progress Report</h2>
      <p className={styles.headingAr} aria-hidden="true">تقرير التقدم</p>

      {/* Level Progress */}
      <section className={styles.section} aria-label="Level progress">
        <h3 className={styles.sectionTitle}>Level {report.level}</h3>
        <div className={styles.xpBar} role="progressbar" aria-valuenow={report.xpPercentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${report.xpPercentage}% to next level`}>
          <div className={styles.xpFill} style={{ width: `${report.xpPercentage}%` }} />
        </div>
        <p className={styles.xpText}>
          {report.currentXp.toLocaleString()} / {report.xpToNext.toLocaleString()} XP
        </p>
      </section>

      {/* Vocabulary Stats */}
      <section className={styles.section} aria-label="Vocabulary statistics">
        <h3 className={styles.sectionTitle}>Vocabulary</h3>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{report.wordsLearned}</span>
            <span className={styles.statLabel}>Words Learned</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{report.wordsMastered}</span>
            <span className={styles.statLabel}>Words Mastered</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{report.masteryPercentage}%</span>
            <span className={styles.statLabel}>Mastery Rate</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{report.newWordsToday} / {report.newWordsBudget}</span>
            <span className={styles.statLabel}>New Today</span>
          </div>
        </div>
      </section>

      {/* Words at Risk */}
      {wordsAtRisk.length > 0 && (
        <section className={styles.section} aria-label="Words at risk of being forgotten">
          <h3 className={styles.sectionTitle}>Words at Risk</h3>
          <ul className={styles.atRiskList}>
            {wordsAtRisk.slice(0, 5).map(({ wordId, stability }) => {
              const word = wordLookup[wordId];
              if (!word) return null;
              return (
                <li key={wordId} className={styles.atRiskItem}>
                  <span className={styles.atRiskArabic} lang="ar">{word.arabic}</span>
                  <span className={styles.atRiskEnglish}>{word.english}</span>
                  <span className={styles.atRiskStability}>{stability.toFixed(1)}d</span>
                </li>
              );
            })}
          </ul>
          {wordsAtRisk.length > 5 && (
            <p className={styles.atRiskMore}>+{wordsAtRisk.length - 5} more words at risk</p>
          )}
        </section>
      )}

      {/* Grammar Progress */}
      <section className={styles.section} aria-label="Grammar progress">
        <h3 className={styles.sectionTitle}>Grammar</h3>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>{report.grammarLessonsCompleted} / {report.grammarLessonsTotal} lessons</span>
          <span className={styles.progressPercent}>{report.grammarPercentage}%</span>
        </div>
        <div className={styles.progressBar} role="progressbar" aria-valuenow={report.grammarPercentage} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${report.grammarPercentage}%` }} />
        </div>
      </section>

      {/* Quests */}
      <section className={styles.section} aria-label="Quest progress">
        <h3 className={styles.sectionTitle}>Quests</h3>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>{report.questsCompleted} / {report.questsTotal} completed</span>
          <span className={styles.progressPercent}>{report.questPercentage}%</span>
        </div>
        <div className={styles.progressBar} role="progressbar" aria-valuenow={report.questPercentage} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${report.questPercentage}%` }} />
        </div>
      </section>

      {/* Streak & Engagement */}
      <section className={styles.section} aria-label="Streak and engagement">
        <h3 className={styles.sectionTitle}>Engagement</h3>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValueGold}>{report.streak}</span>
            <span className={styles.statLabel}>Day Streak</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{report.maxStreak}</span>
            <span className={styles.statLabel}>Best Streak</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{unlockedQuizTypes.length}</span>
            <span className={styles.statLabel}>Quiz Types</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{report.unlockedFeatureCount} / {report.totalFeatureCount}</span>
            <span className={styles.statLabel}>Features</span>
          </div>
        </div>
      </section>

      {/* CEFR Estimate */}
      <section className={styles.section} aria-label="CEFR level estimate">
        <h3 className={styles.sectionTitle}>CEFR Level</h3>
        <div className={styles.cefrBadge}>
          <span className={styles.cefrLevel}>{report.estimatedCefrLevel}</span>
        </div>
        {report.cefrProgress.nextLevel && (
          <div className={styles.cefrProgress}>
            <p className={styles.cefrNextLabel}>Progress to {report.cefrProgress.nextLevel}</p>
            <div className={styles.cefrRow}>
              <span className={styles.cefrMetric}>Grammar</span>
              <div className={styles.progressBarSmall}>
                <div className={styles.progressFillSmall} style={{ width: `${report.cefrProgress.grammarProgress}%` }} />
              </div>
              <span className={styles.cefrPercent}>{report.cefrProgress.grammarProgress}%</span>
            </div>
            <div className={styles.cefrRow}>
              <span className={styles.cefrMetric}>Vocab</span>
              <div className={styles.progressBarSmall}>
                <div className={styles.progressFillSmall} style={{ width: `${report.cefrProgress.vocabProgress}%` }} />
              </div>
              <span className={styles.cefrPercent}>{report.cefrProgress.vocabProgress}%</span>
            </div>
          </div>
        )}
      </section>

      {/* Next Unlocks */}
      {report.upcomingUnlocks.length > 0 && (
        <section className={styles.section} aria-label="Upcoming unlocks">
          <h3 className={styles.sectionTitle}>Coming Soon</h3>
          <ul className={styles.unlockList}>
            {report.upcomingUnlocks.map((unlock) => (
              <li key={unlock.feature} className={styles.unlockItem}>
                <span className={styles.unlockLevel}>Lv. {unlock.level}</span>
                <div className={styles.unlockInfo}>
                  <span className={styles.unlockName}>{unlock.name.en}</span>
                  <span className={styles.unlockNameAr}>{unlock.name.ar}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default memo(ProgressReport);
