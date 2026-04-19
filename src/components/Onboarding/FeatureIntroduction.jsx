import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { markIntroSeen, recordFeatureUse } from '../../store/slices/onboardingSlice.js';
import styles from './FeatureIntroduction.module.css';

/**
 * FeatureIntroduction — Step-through overlay that introduces a new game feature.
 *
 * Props:
 *   introduction  — object from FEATURE_INTRODUCTIONS data
 *   onComplete    — called after player finishes or skips the walkthrough
 *
 * Phase 92 — Tutorial & Onboarding Refresh
 */
export default function FeatureIntroduction({ introduction, onComplete }) {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const steps = introduction?.steps || [];
  const totalSteps = steps.length;
  const isLastStep = currentStep >= totalSteps - 1;

  const handleFinish = useCallback(() => {
    setExiting(true);
    dispatch(markIntroSeen(introduction.id));
    dispatch(recordFeatureUse(introduction.feature));
    // Allow exit animation to play
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  }, [dispatch, introduction, onComplete]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLastStep, handleFinish]);

  const handleSkip = useCallback(() => {
    handleFinish();
  }, [handleFinish]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handleSkip]);

  if (!introduction) return null;

  const step = steps[currentStep];

  return (
    <div className={`${styles.overlay} ${exiting ? styles.overlayExiting : ''}`}>
      <div className={`${styles.panel} ${exiting ? styles.panelExiting : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.featureIcon}>
            {introduction.feature.charAt(0).toUpperCase()}
          </div>
          <div className={styles.titles}>
            <h2 className={styles.titleArabic}>{introduction.titleArabic}</h2>
            <h3 className={styles.title}>{introduction.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className={styles.description}>{introduction.description}</p>

        {/* Step content */}
        {step && (
          <div className={styles.stepContent} key={currentStep}>
            <p className={styles.stepTextArabic}>{step.textArabic}</p>
            <p className={styles.stepText}>{step.text}</p>
          </div>
        )}

        {/* Progress dots */}
        <div className={styles.progressDots}>
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${idx === currentStep ? styles.dotActive : ''} ${idx < currentStep ? styles.dotComplete : ''}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className={styles.actions}>
          <button
            className={styles.skipBtn}
            onClick={handleSkip}
            type="button"
          >
            Skip
          </button>
          <button
            className={styles.nextBtn}
            onClick={handleNext}
            type="button"
          >
            {isLastStep ? 'Got it!' : 'Next'}
          </button>
        </div>

        {/* Celebration particles on last step completion */}
        {exiting && isLastStep && (
          <div className={styles.celebration}>
            <span className={styles.particle}>&#9733;</span>
            <span className={styles.particle}>&#9733;</span>
            <span className={styles.particle}>&#9733;</span>
            <span className={styles.particle}>&#9733;</span>
            <span className={styles.particle}>&#9733;</span>
          </div>
        )}
      </div>
    </div>
  );
}
