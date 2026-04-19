/**
 * HandwritingPractice.jsx — WIRE-009
 *
 * Logic-only practice mode for Arabic letter tracing.
 * Uses handwritingStore for persistence (no canvas — self-assessed accuracy).
 */
import { useState, useCallback } from 'react';
import {
  saveAttempt,
  getLetterStats,
  getWeakLetters,
} from '../../services/handwritingStore.js';
import alphabetData from '../../data/alphabet.json';
import styles from './HandwritingPractice.module.css';

const { letters } = alphabetData;

const ACCURACY_OPTIONS = [
  { label: 'Miss', value: 0 },
  { label: 'Poor', value: 25 },
  { label: 'OK', value: 50 },
  { label: 'Good', value: 75 },
  { label: 'Perfect', value: 100 },
];

/**
 * Derive trend from recentAttempts: 'improving', 'declining', or 'stable'.
 */
function getTrend(recentAttempts) {
  if (!recentAttempts || recentAttempts.length < 2) return 'stable';
  const last = recentAttempts[recentAttempts.length - 1].accuracy;
  const prev = recentAttempts[recentAttempts.length - 2].accuracy;
  if (last > prev + 5) return 'improving';
  if (last < prev - 5) return 'declining';
  return 'stable';
}

export default function HandwritingPractice({ onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [letterStats, setLetterStats] = useState({});
  const [lastResult, setLastResult] = useState(null);
  const [viewMode, setViewMode] = useState('practice'); // 'practice' | 'weak'

  const currentLetter = letters[currentIdx];

  const handleAccuracy = useCallback((accuracy) => {
    const stats = saveAttempt(currentLetter.id, {
      accuracy,
      strokes: [],
      direction: 'correct',
      mistakes: accuracy < 50 ? ['stroke_order'] : [],
    });
    setLetterStats((prev) => ({ ...prev, [currentLetter.id]: stats }));
    setLastResult({ accuracy, letterId: currentLetter.id });
  }, [currentLetter]);

  const goNext = useCallback(() => {
    setLastResult(null);
    setCurrentIdx((i) => (i + 1) % letters.length);
  }, []);

  const goPrev = useCallback(() => {
    setLastResult(null);
    setCurrentIdx((i) => (i - 1 + letters.length) % letters.length);
  }, []);

  const getStats = useCallback((letterId) => {
    if (letterStats[letterId]) return letterStats[letterId];
    return getLetterStats(letterId);
  }, [letterStats]);

  const stats = getStats(currentLetter.id);
  const trend = stats ? getTrend(stats.recentAttempts) : 'stable';
  const trendIcon = { improving: '↑', declining: '↓', stable: '→' }[trend];

  const weakLetters = viewMode === 'weak' ? getWeakLetters(5) : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back to alphabet">
          Back
        </button>
        <div className={styles.title}>Handwriting Practice</div>
        <button
          className={styles.modeBtn}
          onClick={() => setViewMode((m) => m === 'practice' ? 'weak' : 'practice')}
          aria-label={viewMode === 'practice' ? 'View weak letters' : 'Return to practice'}
        >
          {viewMode === 'practice' ? 'Weak Letters' : 'Practice'}
        </button>
      </div>

      {viewMode === 'weak' ? (
        <div className={styles.weakList} aria-label="Letters needing practice">
          <div className={styles.sectionTitle}>Letters Needing Practice</div>
          {weakLetters.length === 0 ? (
            <p className={styles.emptyMsg}>Practice at least 2 attempts per letter to see results.</p>
          ) : (
            weakLetters.map((s) => {
              const letter = letters.find((l) => l.id === s.letterId);
              return (
                <div key={s.letterId} className={styles.weakItem}>
                  <span className={styles.weakLetter} lang="ar">{letter?.letter}</span>
                  <span className={styles.weakName}>{letter?.name}</span>
                  <span className={styles.weakAccuracy}>{s.averageAccuracy}%</span>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className={styles.practiceArea}>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={goPrev} aria-label="Previous letter">‹</button>
            <span className={styles.progress}>{currentIdx + 1} / {letters.length}</span>
            <button className={styles.navBtn} onClick={goNext} aria-label="Next letter">›</button>
          </div>

          <div className={styles.letterCard}>
            <div className={styles.letterDisplay} lang="ar" aria-label={`Arabic letter ${currentLetter.name}`}>
              {currentLetter.forms.isolated}
            </div>
            <div className={styles.letterName}>{currentLetter.name}</div>
            <div className={styles.letterTranslit}>/{currentLetter.transliteration}/</div>
          </div>

          <div className={styles.forms}>
            {['isolated', 'initial', 'medial', 'final'].map((form) => (
              <div key={form} className={styles.formItem}>
                <span className={styles.formLabel}>{form}</span>
                <span className={styles.formChar} lang="ar">{currentLetter.forms[form]}</span>
              </div>
            ))}
          </div>

          <div className={styles.rateSection}>
            <div className={styles.rateLabel}>Rate your tracing accuracy:</div>
            <div className={styles.rateButtons} role="group" aria-label="Accuracy rating buttons">
              {ACCURACY_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  className={styles.rateBtn}
                  onClick={() => handleAccuracy(value)}
                  aria-label={`Rate accuracy as ${label} (${value}%)`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {lastResult && (
            <div className={styles.result} role="status" aria-live="polite">
              Recorded: {lastResult.accuracy}% accuracy
            </div>
          )}

          {stats && (
            <div className={styles.statsBar} aria-label={`Stats for ${currentLetter.name}`}>
              <span>Attempts: {stats.attempts}</span>
              <span>Best: {stats.bestAccuracy}%</span>
              <span>Avg: {stats.averageAccuracy ?? Math.round(stats.totalAccuracy / stats.attempts)}%</span>
              <span aria-label={`Trend: ${trend}`}>Trend: {trendIcon}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
