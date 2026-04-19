import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setStoryFlag,
  setNpcRelationship,
  incrementNpcRelationship,
} from '../store/slices/narrativeSlice.js';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';
import { store } from '../store/store.js';

/**
 * useNarrativeEvents — Narrative flag and relationship event handlers
 *
 * Handles:
 * - NARRATIVE_FLAG_SET: Sets story flags directly from game events
 * - NARRATIVE_RELATIONSHIP_CHANGED: Updates NPC relationship levels (absolute or incremental)
 * - DIALOGUE_TOPIC_SELECTED: Tracks which topics player has visited for progression
 *
 * Intentionally small now; will grow in Phase 20 (Dialogue System) and Phase 26 (Narrative Branching).
 */
export function useNarrativeEvents() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleFlagSet = ({ flag, value }) => {
      dispatch(setStoryFlag({ flag, value }));
    };

    const handleRelationshipChanged = ({ npcId, level, amount }) => {
      // Support both absolute level setting and incremental changes
      if (level !== undefined) {
        // Absolute level (legacy pattern)
        dispatch(setNpcRelationship({ npcId, level }));
      } else if (amount !== undefined) {
        // Incremental change (new pattern from DialogueEngine)
        dispatch(incrementNpcRelationship({ npcId, amount }));
      }
    };

    const handleTopicSelected = ({ npcId, topicId, topic }) => {
      // Track unique topic visits using composite progress flags
      const flagKey = 'topic_visited_' + topicId;

      // Read storyFlags from store directly (not stale closure)
      const currentFlags = store.getState().narrative?.storyFlags || {};

      // Only set flag if not already set (avoid redundant dispatches)
      if (!currentFlags[flagKey]) {
        dispatch(setStoryFlag({ flag: flagKey, value: true }));
      }

      if (import.meta.env.DEV) {
        console.log('[useNarrativeEvents] Topic visited:', { npcId, topicId, topic });
      }
    };

    EventBus.on(EVENTS.NARRATIVE_FLAG_SET, handleFlagSet);
    EventBus.on(EVENTS.NARRATIVE_RELATIONSHIP_CHANGED, handleRelationshipChanged);
    EventBus.on(EVENTS.DIALOGUE_TOPIC_SELECTED, handleTopicSelected);

    return () => {
      EventBus.off(EVENTS.NARRATIVE_FLAG_SET, handleFlagSet);
      EventBus.off(EVENTS.NARRATIVE_RELATIONSHIP_CHANGED, handleRelationshipChanged);
      EventBus.off(EVENTS.DIALOGUE_TOPIC_SELECTED, handleTopicSelected);
    };
  }, [dispatch]);
}
