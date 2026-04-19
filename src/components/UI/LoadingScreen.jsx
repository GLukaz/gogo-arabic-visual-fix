import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

/**
 * Arabic-themed loading screen with skeleton layout and animations
 * Used as Suspense fallback for lazy-loaded routes
 */
export default function LoadingScreen() {
  const [dots, setDots] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 500);

    // Simulate progress (for visual effect only)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Stop at 90%, actual loading will complete it
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* Animated Arabic Book Icon */}
      <div className={styles.book}>
        <div className={styles.bookCover} />
        <div className={`${styles.bookPage} ${styles.page1}`} />
        <div className={`${styles.bookPage} ${styles.page2}`} />
        <div className={`${styles.bookPage} ${styles.page3}`} />
      </div>

      {/* Arabic calligraphy decoration */}
      <div className={styles.decoration}>
        <div className={styles.decorLine} />
        <div className={styles.decorCircle} />
        <div className={styles.decorLine} />
      </div>

      {/* Loading Text */}
      <div className={styles.text}>
        Loading{'.'.repeat(dots)}
      </div>

      {/* Arabic Text - "Loading" (جارٍ التحميل) */}
      <div className={styles.arabicText}>جارٍ التحميل</div>

      {/* Bouncing Dots */}
      <div className={styles.dotsContainer}>
        <div className={`${styles.dot} ${styles.dot1}`} />
        <div className={`${styles.dot} ${styles.dot2}`} />
        <div className={`${styles.dot} ${styles.dot3}`} />
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
