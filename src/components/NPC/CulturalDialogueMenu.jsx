import { getCulturalDialoguesForNPC } from '../../data/culturalDialogues.js';
import styles from './DialogueOverlay.module.css';

/**
 * CulturalDialogueMenu
 * Shows available cultural dialogues for an NPC as choice buttons
 * Allows players to learn about Arabic culture, history, and traditions
 */
export default function CulturalDialogueMenu({ npc, onCulturalSelect, onBack, portrait }) {
  const culturalDialogues = getCulturalDialoguesForNPC(npc.id);

  if (!culturalDialogues || culturalDialogues.length === 0) {
    // No cultural content for this NPC
    return (
      <div className={styles.dialogueBox}>
        {portrait}
        <div className={styles.content}>
          <div className={styles.speakerName} role="heading" aria-level="2">
            {npc.name}
          </div>
          <div className={styles.englishLine}>
            I don&apos;t have any cultural stories to share right now.
          </div>
          <div className={styles.choices}>
            <button
              className={styles.choiceBtn}
              onClick={onBack}
              aria-label="Go back"
            >
              <div>
                <span className={styles.choiceNumber} aria-hidden="true">
                  1
                </span>
                Go back
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dialogueBox}>
      {portrait}
      <div className={styles.content}>
        <div className={styles.speakerName} role="heading" aria-level="2">
          {npc.name}
        </div>
        <div className={styles.englishLine}>
          What would you like to learn about?
        </div>
        <div className={styles.choices} role="group" aria-label="Cultural dialogue topics">
          {culturalDialogues.map((dialogue, i) => (
            <button
              key={dialogue.id}
              className={styles.choiceBtn}
              onClick={() => onCulturalSelect(dialogue)}
              aria-label={`Topic ${i + 1}: ${dialogue.topic}`}
            >
              <div>
                <span className={styles.choiceNumber} aria-hidden="true">
                  {i + 1}
                </span>
                {dialogue.topic}
              </div>
            </button>
          ))}
          <button
            className={styles.choiceBtn}
            onClick={onBack}
            aria-label="Go back"
          >
            <div>
              <span className={styles.choiceNumber} aria-hidden="true">
                {culturalDialogues.length + 1}
              </span>
              Go back
            </div>
          </button>
        </div>
        <div className={styles.choiceHint} aria-live="polite">
          Press 1-{culturalDialogues.length + 1} to select
        </div>
      </div>
    </div>
  );
}
