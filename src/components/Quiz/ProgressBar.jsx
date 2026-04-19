import styles from './ProgressBar.module.css';

/**
 * ProgressBar - Quiz progress indicator using CSS Modules
 *
 * Usage:
 * <ProgressBar current={3} total={10} />
 *
 * Features:
 * - Smooth animated fill (CSS transition)
 * - Shows "Question X of Y"
 * - Compact vertical space
 * - Matches app color theme
 */
export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={styles.container} role="group" aria-label={`Quiz progress: question ${current} of ${total}`}>
      <div className={styles.label} aria-live="polite">
        Question {current} of {total}
      </div>
      <div
        className={styles.barBg}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Progress: ${Math.round(percentage)}%`}
      >
        <div className={styles.barFill} style={{ width: `${percentage}%` }}>
          <div className={styles.barFillShine} />
        </div>
      </div>
    </div>
  );
}
