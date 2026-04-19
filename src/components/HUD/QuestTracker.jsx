import { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveQuest, selectActiveQuestObjectiveLocation } from '../../store/slices/questSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './QuestTracker.module.css';

/**
 * Derive a human-readable objective hint from the trackEvent string.
 * e.g. "word_learned_greetings" -> "Learn greeting words"
 *      "tutorial_step" -> "Follow the tutorial"
 */
function deriveObjectiveText(trackEvent) {
  if (!trackEvent) return null;
  const map = {
    tutorial_step: 'Follow the tutorial steps',
    object_word_learned: 'Discover words in the world',
    alphabet_group_complete: 'Complete alphabet groups',
    quiz_challenge_passed: 'Pass a quiz challenge',
    npcs_visited: 'Talk to NPCs',
    zones_visited: 'Visit new zones',
    review_session_high_accuracy: 'Score high in review',
    review_session_very_high_accuracy: 'Score very high in review',
    review_session_perfect: 'Get a perfect review',
    dialogue_completed: 'Complete dialogues',
    merchant_dialogue_completed: 'Talk to merchants',
    poetry_dialogue_completed: 'Discuss poetry',
    quiz_passed_80_percent: 'Pass quizzes at 80%+',
    quiz_passed_90_percent: 'Pass quizzes at 90%+',
    sentence_quiz_completed: 'Complete sentence quizzes',
    words_learned_today: 'Learn words today',
    alphabet_letter_mastered: 'Master alphabet letters',
    chest_opened: 'Open treasure chests',
  };

  if (map[trackEvent]) return map[trackEvent];

  // word_learned_X pattern
  if (trackEvent.startsWith('word_learned_')) {
    const category = trackEvent.replace('word_learned_', '');
    if (category === 'any') return 'Learn more words';
    return `Learn ${category.replace(/_/g, ' ')} words`;
  }

  if (trackEvent.startsWith('npcs_visited_')) {
    const area = trackEvent.replace('npcs_visited_', '');
    return `Meet NPCs in ${area.replace(/_/g, ' ')}`;
  }

  return 'Complete the objective';
}

function QuestTracker() {
  const activeQuest = useSelector(selectActiveQuest);
  const objectiveLocation = useSelector(selectActiveQuestObjectiveLocation);
  const currentZone = useSelector((s) => s.player.currentZone);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

  // Listen for player position updates from Phaser
  useEffect(() => {
    const handlePositionUpdate = (pos) => {
      setPlayerPos(pos);
    };

    EventBus.on(EVENTS.PLAYER_POSITION_UPDATE, handlePositionUpdate);
    return () => {
      EventBus.off(EVENTS.PLAYER_POSITION_UPDATE, handlePositionUpdate);
    };
  }, []);

  // No active quest — show exploration prompt
  if (!activeQuest) {
    const ZONE_PROMPTS = {
      oasis_village: 'Explore the village',
      ancient_library: 'Explore the library',
      desert_marketplace: 'Browse the marketplace',
      farmland: 'Wander the farmland',
      bedouin_camp: 'Visit the camp',
      mountain_village: 'Explore the mountains',
      coastal_port: 'Walk the docks',
      royal_palace: 'Enter the palace',
    };
    const prompt = ZONE_PROMPTS[currentZone] || 'Explore the world';

    return (
      <div className={styles.tracker} role="status" aria-label="No active quest">
        <div className={styles.questInfo}>
          <div className={styles.questName}>{prompt}</div>
          <div className={styles.questObjective}>
            <span className={styles.objectiveHint}>Open Quest Log for quests</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate compass angle
  let compassAngle = null;
  if (objectiveLocation && playerPos.x !== 0 && playerPos.y !== 0) {
    const dx = objectiveLocation.x - playerPos.x;
    const dy = objectiveLocation.y - playerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only show compass if objective is more than 2 tiles away (128px)
    if (distance > 128) {
      const angleRad = Math.atan2(dy, dx);
      compassAngle = (angleRad * 180) / Math.PI;
    }
  }

  const progressPct = activeQuest.target > 0
    ? Math.min(100, (activeQuest.progress / activeQuest.target) * 100)
    : 0;

  const objectiveText = deriveObjectiveText(activeQuest.trackEvent);

  return (
    <div className={styles.tracker} role="status" aria-label={`Active quest: ${activeQuest.title}`}>
      <div className={styles.questInfo}>
        <div className={styles.questName}>{activeQuest.title}</div>
        {objectiveText && (
          <div className={styles.objectiveHint}>{objectiveText}</div>
        )}
        <div className={styles.questObjective}>
          <span className={styles.progressText}>
            {activeQuest.progress}/{activeQuest.target}
          </span>
          <span className={styles.progressPct}>
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      {compassAngle !== null && (
        <div
          className={styles.compass}
          aria-label={`Objective direction: ${Math.round(compassAngle)} degrees`}
        >
          <div
            className={styles.compassArrow}
            style={{ transform: `rotate(${compassAngle}deg)` }}
          >
            &#9658;
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(QuestTracker);
