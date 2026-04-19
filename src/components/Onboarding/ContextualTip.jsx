import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { markTipSeen } from '../../store/slices/onboardingSlice.js';
import styles from './ContextualTip.module.css';

/**
 * ContextualTip — Small, non-blocking tooltip for contextual hints.
 *
 * Props:
 *   tip        — object from ONBOARDING_TIPS data
 *   position   — 'top' | 'bottom' | 'left' | 'right' (arrow direction)
 *   anchorRef  — optional React ref to position near an element
 *   onDismiss  — called when the tip is dismissed
 *
 * Auto-dismisses after 10 seconds. Dismissed tips are tracked in Redux
 * so they do not show again (for showOnce tips).
 *
 * Phase 92 — Tutorial & Onboarding Refresh
 */

const AUTO_DISMISS_MS = 10000;

export default function ContextualTip({ tip, position = 'bottom', anchorRef, onDismiss }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setExiting(true);
    dispatch(markTipSeen(tip.id));
    setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, 300);
  }, [dispatch, tip.id, onDismiss]);

  // Auto-dismiss timer
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [handleDismiss]);

  if (!visible || !tip) return null;

  // Calculate position styles if anchorRef is provided
  const positionStyle = {};
  if (anchorRef?.current) {
    const rect = anchorRef.current.getBoundingClientRect();
    switch (position) {
      case 'top':
        positionStyle.left = `${rect.left + rect.width / 2}px`;
        positionStyle.bottom = `${window.innerHeight - rect.top + 12}px`;
        positionStyle.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        positionStyle.left = `${rect.left + rect.width / 2}px`;
        positionStyle.top = `${rect.bottom + 12}px`;
        positionStyle.transform = 'translateX(-50%)';
        break;
      case 'left':
        positionStyle.right = `${window.innerWidth - rect.left + 12}px`;
        positionStyle.top = `${rect.top + rect.height / 2}px`;
        positionStyle.transform = 'translateY(-50%)';
        break;
      case 'right':
        positionStyle.left = `${rect.right + 12}px`;
        positionStyle.top = `${rect.top + rect.height / 2}px`;
        positionStyle.transform = 'translateY(-50%)';
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={`${styles.container} ${styles[`arrow_${position}`]} ${exiting ? styles.exiting : ''}`}
      style={anchorRef?.current ? positionStyle : undefined}
      role="tooltip"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.titleArabic}>{tip.titleArabic}</span>
          <span className={styles.title}>{tip.title}</span>
        </div>
        <p className={styles.messageArabic}>{tip.messageArabic}</p>
        <p className={styles.message}>{tip.message}</p>
      </div>
      <button
        className={styles.dismissBtn}
        onClick={handleDismiss}
        type="button"
        aria-label="Dismiss tip"
      >
        Got it
      </button>
      {/* Auto-dismiss progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} />
      </div>
    </div>
  );
}
