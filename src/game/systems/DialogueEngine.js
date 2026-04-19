import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { store } from '../../store/store.js';
import {
  incrementNpcRelationship,
  setStoryFlag,
  setWorldObjectState,
  recordChoice,
} from '../../store/slices/narrativeSlice.js';
import {
  updateQuestProgress,
  completeQuest,
  checkPrerequisites,
} from '../../store/slices/questSlice.js';
import { showNotification } from '../../store/slices/uiSlice.js';
import { discoverRoot, recordAffinityChoice } from '../../store/slices/magicSlice.js';
import questsData from '../../data/quests.json';

/**
 * DialogueEngine
 * Manages dialogue conditions, topic filtering, effect execution, and hub-and-spoke tree traversal.
 *
 * Responsibilities:
 * - Evaluate conditions against Redux state (quests, story flags, relationships, vocabulary)
 * - Filter available dialogue topics based on conditions
 * - Execute dialogue effects (quest start/complete, relationship changes, story flags, etc.)
 * - Manage hub-and-spoke conversation flow
 */
export class DialogueEngine {
  constructor(scene) {
    this.scene = scene;
    this.currentNpcId = null;

    // Track affinity lock state to emit event only once
    const affinityState = store.getState().magic?.affinity;
    this._affinityWasLocked = !!(affinityState?.primary);
  }

  /**
   * Evaluate a condition object against current game state.
   * @param {Object} condition - Condition object from dialogue schema
   * @returns {boolean} True if condition passes (or no condition exists)
   */
  evaluateCondition(condition) {
    // No condition = always visible
    if (!condition) return true;

    const state = store.getState();

    // Check quest condition
    if (condition.quest) {
      const quest = state.quests.quests[condition.quest.id];
      if (condition.quest.status === 'not_started') {
        // Quest is not started if it doesn't exist or isn't active/completed
        const isNotStarted = !quest || (quest.status !== 'active' && quest.status !== 'completed');
        if (!isNotStarted) return false;
      } else if (condition.quest.status) {
        // Check specific status
        if (!quest || quest.status !== condition.quest.status) return false;
      }
    }

    // Check story flag condition
    if (condition.storyFlag) {
      const flagValue = state.narrative?.storyFlags?.[condition.storyFlag.key];
      if (flagValue !== condition.storyFlag.value) return false;
    }

    // Check relationship condition
    if (condition.relationship) {
      const relationshipLevel = state.narrative.npcRelationships[this.currentNpcId] ?? 0;
      if (condition.relationship.min !== undefined && relationshipLevel < condition.relationship.min) {
        return false;
      }
      if (condition.relationship.max !== undefined && relationshipLevel > condition.relationship.max) {
        return false;
      }
    }

    // Check vocabulary condition
    if (condition.vocabulary) {
      const card = state.vocabulary?.fsrsCards?.[condition.vocabulary.wordId];
      const hasLearned = !!card; // Truthy if word exists in FSRS cards
      if (!hasLearned) return false;
      // If mastered flag is set, could add additional mastery check here
      // For now, just check existence
    }

    // Check learningPath condition
    if (condition.learningPath) {
      const learningPath = state.player?.learningPath;
      if (learningPath !== condition.learningPath) return false;
    }

    // Check NOT condition (recursive negation)
    if (condition.not) {
      return !this.evaluateCondition(condition.not);
    }

    // All conditions passed
    return true;
  }

  /**
   * Get available dialogue topics for an NPC (hub-and-spoke pattern).
   * @param {Object} npc - NPC data from npcs.json
   * @returns {Array} Array of available topics with metadata
   */
  getAvailableTopics(npc) {
    this.currentNpcId = npc.id;

    // Filter dialogue trees that have a topic field (hub-and-spoke)
    const topicTrees = (npc.dialogueTrees || []).filter(tree => tree.topic);

    // Filter by condition and prepare topic metadata
    const availableTopics = topicTrees
      .filter(tree => this.evaluateCondition(tree.condition))
      .map(tree => ({
        treeId: tree.id,
        topic: tree.topic,
        label: tree.lines[0]?.english || tree.topic,
        priority: tree.priority ?? 99,
      }))
      .sort((a, b) => a.priority - b.priority); // Sort by priority (lower = first)

    return availableTopics;
  }

  /**
   * Filter dialogue choices based on their conditions.
   * @param {Array} choices - Array of choice objects
   * @returns {Array} Filtered choices that pass condition check
   */
  getFilteredChoices(choices) {
    if (!choices) return [];

    return choices.filter(choice => this.evaluateCondition(choice.condition));
  }

  /**
   * Filter dialogue lines based on their conditions (e.g. learningPath branching).
   * Lines without a condition are always included.
   * @param {Array} lines - Array of dialogue line objects
   * @returns {Array} Filtered lines that pass condition check
   */
  filterLines(lines) {
    if (!lines) return [];

    return lines.filter(line => this.evaluateCondition(line.condition));
  }

  /**
   * Execute dialogue effects (quest changes, relationship changes, etc.).
   * @param {Array} effects - Array of effect objects from dialogue schema
   * @param {string} npcId - Optional NPC ID (uses currentNpcId if not provided)
   */
  async executeEffects(effects, npcId) {
    if (!effects || effects.length === 0) return;

    if (npcId) {
      this.currentNpcId = npcId;
    }

    for (const effect of effects) {
      switch (effect.type) {
        case 'quest_start': {
          // Find quest in questsData and activate it
          const quest = questsData.find(q => q.id === effect.questId);
          if (quest) {
            store.dispatch(updateQuestProgress({ questId: effect.questId, amount: 0 }));
            EventBus.emit(EVENTS.SFX_QUEST);
          }
          break;
        }

        case 'quest_complete': {
          store.dispatch(completeQuest(effect.questId));
          store.dispatch(showNotification({
            message: 'Quest completed!',
            type: 'success',
          }));
          store.dispatch(checkPrerequisites(questsData));
          EventBus.emit(EVENTS.SFX_QUEST);
          break;
        }

        case 'relationship_change': {
          store.dispatch(incrementNpcRelationship({
            npcId: this.currentNpcId,
            amount: effect.amount,
          }));
          const newLevel = store.getState().narrative.npcRelationships[this.currentNpcId] ?? 0;
          EventBus.emit(EVENTS.DIALOGUE_RELATIONSHIP_CHANGED, {
            npcId: this.currentNpcId,
            amount: effect.amount,
            newLevel,
          });
          break;
        }

        case 'story_flag': {
          store.dispatch(setStoryFlag({
            flag: effect.flag,
            value: effect.value,
          }));
          break;
        }

        case 'teach_word': {
          // Emit event for React to handle FSRS card creation
          EventBus.emit(EVENTS.DIALOGUE_EFFECT_EXECUTED, {
            type: 'teach_word',
            wordId: effect.wordId,
          });
          break;
        }

        case 'give_item': {
          // Emit event for inventory system (Phase 25+)
          EventBus.emit(EVENTS.DIALOGUE_EFFECT_EXECUTED, {
            type: 'give_item',
            itemId: effect.itemId,
            quantity: effect.quantity || 1,
          });
          break;
        }

        case 'unlock_area': {
          store.dispatch(setStoryFlag({
            flag: 'area_unlocked_' + effect.area,
            value: true,
          }));
          break;
        }

        case 'change_npc_state': {
          const targetNpcId = effect.npcId || this.currentNpcId;
          store.dispatch(setStoryFlag({
            flag: 'npc_state_' + targetNpcId,
            value: effect.state,
          }));
          break;
        }

        case 'open_shop': {
          EventBus.emit(EVENTS.SHOP_OPEN, {
            npcId: this.currentNpcId,
          });
          break;
        }

        case 'world_state': {
          store.dispatch(setWorldObjectState({
            objectId: effect.objectId,
            objectState: effect.objectState,
          }));
          break;
        }

        case 'reward': {
          // Emit reward event for player slice to handle (XP + dirhams)
          EventBus.emit(EVENTS.DIALOGUE_EFFECT_EXECUTED, {
            type: 'reward',
            xp: effect.xp || 0,
            dirhams: effect.dirhams || 0,
          });
          break;
        }

        case 'discover_root': {
          store.dispatch(
            discoverRoot({
              rootId: effect.rootId,
              element: effect.element,
            })
          );
          EventBus.emit(EVENTS.MAGIC_ROOT_DISCOVERED, {
            rootId: effect.rootId,
            element: effect.element,
          });
          store.dispatch(
            showNotification({
              message: `Discovered the root ${effect.rootId} (${effect.element})!`,
              type: 'success',
            })
          );
          break;
        }

        case 'affinity_choice': {
          store.dispatch(
            recordAffinityChoice({
              choiceId: effect.choiceId || `choice_${this.currentNpcId}_${Date.now()}`,
              element: effect.element,
              weight: effect.weight || 1,
            })
          );

          // Check if affinity just locked
          const affinityState = store.getState().magic?.affinity;
          if (affinityState?.primary && !this._affinityWasLocked) {
            this._affinityWasLocked = true;
            EventBus.emit(EVENTS.MAGIC_AFFINITY_LOCKED, {
              primary: affinityState.primary,
              secondary: affinityState.secondary,
            });
          }

          EventBus.emit(EVENTS.MAGIC_AFFINITY_CHOICE, {
            element: effect.element,
            weight: effect.weight || 1,
          });
          break;
        }

        case 'recruit_companion': {
          // Dynamic import to avoid circular dependency
          const { recruitCompanion } = await import('../../store/slices/companionSlice.js');
          store.dispatch(recruitCompanion(effect.companionId));
          EventBus.emit(EVENTS.COMPANION_RECRUITED, {
            companionId: effect.companionId,
          });
          break;
        }

        default:
          console.warn('[DialogueEngine] Unknown effect type:', effect.type);
      }
    }

    // Summary logged in individual handlers (useDialogueEvents.js)
  }

  /**
   * Record player choice for tracking/analytics.
   * @param {string} npcId - NPC ID
   * @param {string} choiceId - Choice ID
   */
  recordPlayerChoice(npcId, choiceId) {
    store.dispatch(recordChoice({ npcId, choiceId }));
  }

  /**
   * Check if a dialogue tree should return to hub after completion.
   * @param {Object} tree - Dialogue tree object
   * @returns {boolean} True if should return to topic selection
   */
  shouldReturnToHub(tree) {
    return tree.returnToHub === true;
  }

  /**
   * Cleanup and reset current NPC context.
   */
  destroy() {
    this.currentNpcId = null;
  }
}
