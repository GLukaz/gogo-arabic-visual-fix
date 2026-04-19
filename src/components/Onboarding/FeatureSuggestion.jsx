import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSuggestFeature, recordFeatureUse } from '../../store/slices/onboardingSlice.js';
import { getFeatureIntroById } from '../../data/featureIntroductions.js';
import { FEATURE_INTRODUCTIONS } from '../../data/featureIntroductions.js';
import styles from './FeatureSuggestion.module.css';

/**
 * FeatureSuggestion — Gentle nudge component for unexplored features.
 *
 * Props:
 *   featureId  — feature ID string to suggest (from FEATURE_INTRODUCTIONS)
 *   onTryIt    — called when player clicks "Try it" (parent should navigate to feature)
 *   onDismiss  — called when player clicks "Later"
 *
 * Only shown between activities, never during active gameplay.
 *
 * Phase 92 — Tutorial & Onboarding Refresh
 */
export default function FeatureSuggestion({ featureId, onTryIt, onDismiss }) {
  const dispatch = useDispatch();
  const [exiting, setExiting] = useState(false);

  // Find the introduction data for this feature
  const introduction = FEATURE_INTRODUCTIONS.find((intro) => intro.feature === featureId);

  const handleTryIt = useCallback(() => {
    setExiting(true);
    dispatch(recordFeatureUse(featureId));
    dispatch(setSuggestFeature(null));
    setTimeout(() => {
      if (onTryIt) onTryIt(featureId);
    }, 300);
  }, [dispatch, featureId, onTryIt]);

  const handleLater = useCallback(() => {
    setExiting(true);
    dispatch(setSuggestFeature(null));
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  }, [dispatch, onDismiss]);

  // ESC to dismiss
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') handleLater();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleLater]);

  if (!introduction || !featureId) return null;

  return (
    <div className={`${styles.container} ${exiting ? styles.exiting : ''}`}>
      <div className={styles.iconBadge}>
        {introduction.feature.charAt(0).toUpperCase()}
      </div>

      <div className={styles.textBlock}>
        <p className={styles.promptArabic}>
          هل جربت {introduction.titleArabic.replace(/[!؟?]/g, '')}؟
        </p>
        <p className={styles.prompt}>
          Have you tried <strong>{introduction.title.replace(/[!?]/g, '')}</strong>?
        </p>
        <p className={styles.description}>{introduction.description}</p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.laterBtn}
          onClick={handleLater}
          type="button"
        >
          Later
        </button>
        <button
          className={styles.tryBtn}
          onClick={handleTryIt}
          type="button"
        >
          Try it
        </button>
      </div>
    </div>
  );
}
