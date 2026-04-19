import styles from './DialogueOverlay.module.css';

/**
 * RelationshipIndicator
 * Renders a 0-5 trust meter with star icons for NPC relationship level
 */
export default function RelationshipIndicator({ _npcId, level = 0 }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        className={`${styles.trustIcon} ${i < level ? styles.trustFilled : styles.trustEmpty} ${i === level - 1 ? styles.trustPulse : ''}`}
        aria-hidden="true"
      >
        ★
      </span>
    );
  }

  return (
    <div className={styles.relationshipBar} aria-label={`Trust level: ${level} out of 5`}>
      {stars}
      <span className={styles.trustLabel}>Trust: {level}/5</span>
    </div>
  );
}
