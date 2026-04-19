import PropTypes from 'prop-types';
import styles from './SkeletonLoader.module.css';

/**
 * Reusable skeleton loader component for loading states
 * Variants: text, card, button, avatar, panel
 * Usage example:
 *   <SkeletonLoader variant="card" width="300px" height="200px" />
 */
export default function SkeletonLoader({ variant = 'text', width, height, count = 1, className = '' }) {
  const skeletonClass = `${styles.skeleton} ${styles[variant]} ${className}`;
  const style = {};

  if (width) style.width = width;
  if (height) style.height = height;

  // For multiple skeletons (e.g., list of text lines)
  if (count > 1) {
    return (
      <div className={styles.skeletonGroup}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={skeletonClass} style={style} />
        ))}
      </div>
    );
  }

  return <div className={skeletonClass} style={style} />;
}

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf(['text', 'card', 'button', 'avatar', 'panel']),
  width: PropTypes.string,
  height: PropTypes.string,
  count: PropTypes.number,
  className: PropTypes.string,
};

/**
 * Pre-composed skeleton for quiz/review session
 */
export function ReviewSkeleton() {
  return (
    <div className={styles.reviewSkeleton}>
      <div className={styles.skeletonHeader}>
        <SkeletonLoader variant="text" width="200px" height="24px" />
        <SkeletonLoader variant="button" width="100px" height="36px" />
      </div>
      <div className={styles.skeletonCard}>
        <SkeletonLoader variant="text" width="80%" height="32px" />
        <SkeletonLoader variant="text" width="60%" height="24px" />
        <div className={styles.skeletonOptions}>
          <SkeletonLoader variant="button" width="100%" height="48px" />
          <SkeletonLoader variant="button" width="100%" height="48px" />
          <SkeletonLoader variant="button" width="100%" height="48px" />
          <SkeletonLoader variant="button" width="100%" height="48px" />
        </div>
      </div>
    </div>
  );
}

/**
 * Pre-composed skeleton for shop inventory
 */
export function ShopSkeleton() {
  return (
    <div className={styles.shopSkeleton}>
      <div className={styles.skeletonHeader}>
        <SkeletonLoader variant="text" width="150px" height="24px" />
        <SkeletonLoader variant="text" width="120px" height="20px" />
      </div>
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeletonShopItem}>
            <SkeletonLoader variant="avatar" width="64px" height="64px" />
            <SkeletonLoader variant="text" width="100%" height="16px" />
            <SkeletonLoader variant="text" width="60%" height="14px" />
            <SkeletonLoader variant="button" width="100%" height="32px" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Pre-composed skeleton for achievement panel
 */
export function AchievementSkeleton() {
  return (
    <div className={styles.achievementSkeleton}>
      <div className={styles.skeletonHeader}>
        <SkeletonLoader variant="text" width="200px" height="28px" />
        <SkeletonLoader variant="text" width="150px" height="20px" />
      </div>
      <div className={styles.skeletonList}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeletonAchievement}>
            <SkeletonLoader variant="avatar" width="48px" height="48px" />
            <div className={styles.skeletonAchievementText}>
              <SkeletonLoader variant="text" width="180px" height="18px" />
              <SkeletonLoader variant="text" width="120px" height="14px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
