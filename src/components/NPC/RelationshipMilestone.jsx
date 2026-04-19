import { useState, useEffect, useCallback, useRef } from 'react';
import { TIER_DISPLAY } from '../../data/relationshipRewards.js';
import styles from './RelationshipMilestone.module.css';

/**
 * RelationshipMilestone — Popup shown when a friendship tier is reached.
 *
 * Props:
 *   npcName          — English NPC name
 *   npcNameArabic    — Arabic NPC name
 *   tier             — 'cautious' | 'friendly' | 'close'
 *   milestone        — { description, descriptionArabic, xp, vocabReward, title }
 *   title            — { titleArabic, titleEnglish } | null  (for close tier)
 *   onDismiss        — callback when popup is dismissed
 */
function RelationshipMilestone({ npcName, npcNameArabic, tier, milestone, title, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);
  const tierDisplay = TIER_DISPLAY[tier] || TIER_DISPLAY.cautious;

  const handleDismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    // Wait for exit animation before calling onDismiss
    setTimeout(() => {
      onDismiss?.();
    }, 400);
  }, [exiting, onDismiss]);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleDismiss]);

  return (
    <div className={styles.milestoneWrap} data-testid="relationship-milestone">
      <div
        className={`${styles.milestone} ${exiting ? styles.milestoneExiting : ''}`}
        onClick={handleDismiss}
        role="alert"
        aria-live="polite"
        data-testid="milestone-card"
      >
        {/* Heading */}
        <h3 className={styles.headingEnglish}>
          Friendship with {npcName} has grown!
        </h3>
        <p className={styles.headingArabic} dir="rtl">
          صداقتك مع {npcNameArabic} نَمَت!
        </p>

        {/* Tier badge */}
        <span
          className={styles.tierBadge}
          style={{ backgroundColor: tierDisplay.color }}
          data-testid="milestone-tier-badge"
        >
          {tierDisplay.label} — {tierDisplay.labelArabic}
        </span>

        {/* Reward description */}
        {milestone && (
          <>
            <p className={styles.rewardEnglish}>{milestone.description}</p>
            <p className={styles.rewardArabic} dir="rtl">{milestone.descriptionArabic}</p>
            {milestone.xp > 0 && (
              <p className={styles.xpReward} data-testid="xp-reward">
                +{milestone.xp} XP
              </p>
            )}
          </>
        )}

        {/* Title earned (close tier only) */}
        {title && (
          <div className={styles.titleSection} data-testid="title-section">
            <div className={styles.titleLabel}>Title Earned</div>
            <p className={styles.titleArabic} dir="rtl">{title.titleArabic}</p>
            <p className={styles.titleEnglish}>{title.titleEnglish}</p>
          </div>
        )}

        <div className={styles.dismissHint}>Click to dismiss</div>
      </div>
    </div>
  );
}

export default RelationshipMilestone;
