import { formatDigestSummary, markDigestShown } from '../../services/weeklyDigestService.js';
import styles from './WeeklyDigestModal.module.css';

export default function WeeklyDigestModal({ digest, onDismiss }) {
  const handleDismiss = () => {
    markDigestShown();
    onDismiss();
  };

  const stats = [
    digest.wordsReviewed > 0 && { label: 'Words Reviewed', value: digest.wordsReviewed },
    digest.wordsMastered > 0 && { label: 'Words Mastered', value: digest.wordsMastered },
    digest.studyMinutes > 0 && { label: 'Minutes Studied', value: digest.studyMinutes },
    digest.streakDays > 0 && { label: 'Day Streak', value: digest.streakDays },
    digest.averageAccuracy > 0 && { label: 'Accuracy', value: `${digest.averageAccuracy}%` },
  ].filter(Boolean);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Weekly learning summary">
      <div className={styles.modal}>
        <div className={styles.title}>Weekly Summary</div>
        <div className={styles.subtitle} lang="ar" aria-hidden="true">ملخص الأسبوع</div>

        {stats.length > 0 ? (
          <ul className={styles.statsList}>
            {stats.map(({ label, value }) => (
              <li key={label} className={styles.statItem}>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statValue}>{value}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noStats}>Keep studying to see your weekly stats here!</p>
        )}

        <div className={styles.summary}>{formatDigestSummary(digest)}</div>

        <button
          className={styles.dismissBtn}
          onClick={handleDismiss}
          aria-label="Dismiss weekly summary"
        >
          Keep Learning!
        </button>
      </div>
    </div>
  );
}
