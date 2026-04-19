import { useEffect } from 'react';
import RelationshipIndicator from './RelationshipIndicator.jsx';
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
 * TopicSelectionMenu
 * Grid of selectable topic buttons shown during the hub phase of hub-and-spoke dialogue
 */
export default function TopicSelectionMenu({
  topics,
  onSelectTopic,
  topicsDiscussed,
  npc,
  portrait,
  onClose,
  onShowHistory,
  relationshipLevel,
}) {
  // Keyboard: number keys 1-N select topic, ESC closes
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= topics.length) {
        e.preventDefault();
        onSelectTopic(topics[num - 1].treeId);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [topics, onSelectTopic, onClose]);

  return (
    <div className={styles.dialogueBox} role="dialog" aria-label={`Topics for ${npc.name}`}>
      {portrait}
      <div className={styles.content}>
        <div className={styles.npcHeader}>
          <div className={styles.speakerName} role="heading" aria-level="2">
            {npc.name}
          </div>
          {npc.personality?.mood && (
            <span className={styles.npcMood} aria-label={`Mood: ${npc.personality.mood}`}>
              {moodToEmoji(npc.personality.mood)}
            </span>
          )}
        </div>
        <RelationshipIndicator npcId={npc.id} level={relationshipLevel} />
        {npc.greeting?.english && (
          <div className={styles.englishLine}>{npc.greeting.english}</div>
        )}
        <div className={styles.topicGrid} role="group" aria-label="Available topics">
          {topics.map((t, i) => {
            const visited = topicsDiscussed.includes(t.topic || t.treeId);
            return (
              <button
                key={t.treeId}
                className={`${styles.topicBtn} ${visited ? styles.topicBtnVisited : ''}`}
                onClick={() => onSelectTopic(t.treeId)}
                aria-label={`Topic ${i + 1}: ${t.label || t.topic}${visited ? ' (discussed)' : ''}`}
              >
                <span className={styles.choiceNumber} aria-hidden="true">{i + 1}</span>
                <span className={styles.topicIcon} aria-hidden="true">
                  {topicIcons[t.topic] || '📝'}
                </span>
                <span className={styles.topicLabel}>{t.label || t.topic}</span>
                {visited && <span className={styles.topicCheck} aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
        <div className={styles.bottomRow}>
          <button
            className={styles.historyBtn}
            onClick={onShowHistory}
            aria-label="View conversation history"
          >
            History
          </button>
          <div className={styles.choiceHint} aria-live="polite">
            Press 1-{topics.length} to select
          </div>
        </div>
        <button
          className={styles.endConversationBtn}
          onClick={onClose}
          aria-label="End conversation"
        >
          End Conversation (ESC)
        </button>
      </div>
    </div>
  );
}

function moodToEmoji(mood) {
  const map = {
    cheerful: '😊',
    serious: '🤔',
    worried: '😟',
    excited: '🤩',
    angry: '😠',
    sad: '😢',
    neutral: '😐',
  };
  return map[mood] || '😐';
}
