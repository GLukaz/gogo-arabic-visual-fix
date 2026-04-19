import { useEffect } from 'react';
import styles from './DialogueOverlay.module.css';

const topicIcons = {
  lore: '📜',
  teaching: '📖',
  gossip: '💬',
  quests: '❗',
  trade: '💰',
  personal: '💭',
};

/**
 * ConversationHistory
 * Shows a summary of topics discussed with this NPC during the current session
 */
export default function ConversationHistory({ npc, topicsDiscussed, allTopics, onBack }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack]);

  return (
    <div className={styles.historyPanel} role="dialog" aria-label="Conversation history">
      <div className={styles.speakerName} role="heading" aria-level="2">
        {npc.name} — Topics
      </div>
      <ul className={styles.historyList}>
        {allTopics.map((t) => {
          const discussed = topicsDiscussed.includes(t.topic || t.treeId);
          return (
            <li
              key={t.treeId}
              className={`${styles.historyItem} ${discussed ? styles.historyDiscussed : styles.historyLocked}`}
            >
              <span aria-hidden="true">{discussed ? '✓' : '○'}</span>
              <span aria-hidden="true">{topicIcons[t.topic] || '📝'}</span>
              <span>{t.label || t.topic}</span>
            </li>
          );
        })}
      </ul>
      <button
        className={styles.endConversationBtn}
        onClick={onBack}
        aria-label="Back to topic selection"
      >
        ← Back (B)
      </button>
    </div>
  );
}
