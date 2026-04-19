/**
 * FeatureUnlockToast — Phase 88
 *
 * Toast notification when a new feature unlocks.
 * Shows "New Feature Unlocked!" in English and Arabic,
 * feature name, description, and a "Try it now" button.
 * Celebratory gold animation. Auto-dismisses after 5 seconds.
 */

import { memo, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FeatureUnlockToast.module.css';

/**
 * @param {Object} props
 * @param {Object|null} props.unlock — { feature, name: { en, ar }, description } or null to hide
 * @param {Function} [props.onDismiss] — called when toast is dismissed
 * @param {Function} [props.onTryNow] — called when "Try it now" is clicked
 * @param {number} [props.autoDismissMs=5000] — auto-dismiss delay in ms
 */
function FeatureUnlockToast({ unlock, onDismiss, onTryNow, autoDismissMs = 5000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (unlock) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [unlock, autoDismissMs, onDismiss]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const handleTryNow = useCallback(() => {
    setVisible(false);
    onTryNow?.();
  }, [onTryNow]);

  const reduceMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toastVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, y: -60, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: 'spring', damping: 15, stiffness: 300 },
        },
        exit: {
          opacity: 0,
          y: -40,
          scale: 0.95,
          transition: { duration: 0.25 },
        },
      };

  return (
    <AnimatePresence>
      {visible && unlock && (
        <motion.div
          className={styles.toast}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="alert"
          aria-live="assertive"
        >
          {/* Gold shimmer effect */}
          {!reduceMotion && <div className={styles.shimmer} />}

          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.icon} aria-hidden="true">&#9734;</span>
              <div className={styles.titles}>
                <span className={styles.titleEn}>New Feature Unlocked!</span>
                <span className={styles.titleAr}>ميزة جديدة مفتوحة!</span>
              </div>
              <button
                className={styles.closeBtn}
                onClick={handleDismiss}
                aria-label="Dismiss notification"
              >
                &times;
              </button>
            </div>

            <div className={styles.featureInfo}>
              <span className={styles.featureName}>{unlock.name?.en || unlock.feature}</span>
              {unlock.name?.ar && (
                <span className={styles.featureNameAr}>{unlock.name.ar}</span>
              )}
              {unlock.description && (
                <p className={styles.featureDesc}>{unlock.description}</p>
              )}
            </div>

            {onTryNow && (
              <button
                className={styles.tryNowBtn}
                onClick={handleTryNow}
              >
                Try it now
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(FeatureUnlockToast);
