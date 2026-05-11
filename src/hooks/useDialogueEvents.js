import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openDialogue, showNotification } from '../store/slices/uiSlice.js';
import {
  updateQuestProgress,
  completeQuest,
  checkPrerequisites,
  visitNpc,
} from '../store/slices/questSlice.js';
import { unlockEntry } from '../store/slices/codexSlice.js';
import { addJournalEntry, JOURNAL_CATEGORIES } from '../store/slices/journalSlice.js';
import questsData from '../data/quests.json';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';
import { store } from '../store/store.js';

/**
 * useDialogueEvents — NPC interaction and dialogue lifecycle event handlers
 *
 * Handles:
 * - NPC_INTERACT: Opens dialogue and tracks exploration quest progress
 * - DIALOGUE_EFFECT_EXECUTED: Provides UI feedback for dialogue effects (teach_word, give_item)
 * - DIALOGUE_RELATIONSHIP_CHANGED: Shows trust change notifications and plays SFX
 * - DIALOGUE_ENDED: Logs conversation end for analytics (DEV mode only)
 */
export function useDialogueEvents(playSFX) {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNpcInteract = ({ npcId, npcName }) => {
      playSFX('click');
      dispatch(openDialogue({ npcId, npcName }));

      // Journal: first-ever NPC meeting (check BEFORE visitNpc so the npcId is not yet in the list)
      const npcsVisitedBefore = store.getState().quests.npcsVisited || [];
      if (!npcsVisitedBefore.includes(npcId)) {
        dispatch(addJournalEntry({
          text: `You met ${npcName || npcId.replace(/_/g, ' ')} for the first time.`,
          textArabic: '',
          category: JOURNAL_CATEGORIES.SOCIAL,
        }));
      }

      // Track NPC visit for exploration quests
      dispatch(visitNpc(npcId));

      // Read quests from store directly (not from stale closure)
      const quests = store.getState().quests.quests;

      // Check exploration quests
      for (const qd of questsData) {
        if (qd.type === 'exploration' && quests[qd.id]?.status === 'active') {
          // Count unique NPCs visited for this quest
          const state = store.getState();
          const npcsVisited = state.quests.npcsVisited || [];

          if (qd.requirements?.npcsVisited) {
            // Specific NPCs required
            const requiredNpcs = qd.requirements.npcsVisited;
            const visitedCount = requiredNpcs.filter(npc => npcsVisited.includes(npc)).length;
            dispatch(updateQuestProgress({ questId: qd.id, amount: visitedCount }));
            if (visitedCount >= qd.target) {
              dispatch(completeQuest(qd.id));
              dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
              dispatch(checkPrerequisites(questsData));
            }
          } else if (qd.requirements?.zone) {
            // NPCs in specific zone
            const currentZone = state.player.currentZone;
            if (currentZone === qd.requirements.zone) {
              dispatch(updateQuestProgress({ questId: qd.id, amount: 1 }));
              const currentProgress = quests[qd.id]?.progress || 0;
              if (currentProgress + 1 >= qd.target) {
                dispatch(completeQuest(qd.id));
                dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
                dispatch(checkPrerequisites(questsData));
              }
            }
          }
        }
      }
    };

    const handleEffectExecuted = (payload) => {
      // Provide UI feedback for specific effect types
      if (payload.type === 'teach_word') {
        // Word teaching flow is handled by useDialogue's handleTeachWord
        // This event is for logging/analytics purposes
      } else if (payload.type === 'give_item') {
        // Show item received notification (inventory system Phase 25+)
        dispatch(showNotification({
          message: `Received: ${payload.itemId}`,
          type: 'success',
        }));
      } else if (payload.type === 'reward') {
        // Reward effect feedback
      }
    };

    const handleRelationshipChanged = ({ npcId, amount, newLevel }) => {
      // Get NPC name from Redux state
      const state = store.getState();
      const npcName = state.ui.dialogueNpcName || 'NPC';

      // Show trust change notification
      const direction = amount > 0 ? '+' : '';
      dispatch(showNotification({
        message: `${direction}${amount} Trust with ${npcName}`,
        type: amount > 0 ? 'success' : 'warning',
      }));

      // Play appropriate SFX
      if (amount > 0) {
        EventBus.emit(EVENTS.SFX_QUEST);
      } else if (amount < 0) {
        EventBus.emit(EVENTS.SFX_WRONG);
      }
    };

    const handleDialogueEnded = ({ npcId }) => {
      // Conversation end logged for analytics
    };

    // Cultural note shown → unlock a codex entry
    const handleCulturalNoteShown = ({ npcId, lineKey }) => {
      const entryId = `cultural_${npcId || 'npc'}_${lineKey.replace(/\s/g, '_')}`;
      dispatch(unlockEntry(entryId));
    };

    // Register event listeners
    EventBus.on(EVENTS.NPC_INTERACT, handleNpcInteract);
    EventBus.on(EVENTS.DIALOGUE_EFFECT_EXECUTED, handleEffectExecuted);
    EventBus.on(EVENTS.DIALOGUE_RELATIONSHIP_CHANGED, handleRelationshipChanged);
    EventBus.on(EVENTS.DIALOGUE_ENDED, handleDialogueEnded);
    EventBus.on('dialogue:cultural_note_shown', handleCulturalNoteShown);

    return () => {
      // Cleanup: unregister all listeners
      EventBus.off(EVENTS.NPC_INTERACT, handleNpcInteract);
      EventBus.off(EVENTS.DIALOGUE_EFFECT_EXECUTED, handleEffectExecuted);
      EventBus.off(EVENTS.DIALOGUE_RELATIONSHIP_CHANGED, handleRelationshipChanged);
      EventBus.off(EVENTS.DIALOGUE_ENDED, handleDialogueEnded);
      EventBus.off('dialogue:cultural_note_shown', handleCulturalNoteShown);
    };
  }, [dispatch, playSFX]);
}
