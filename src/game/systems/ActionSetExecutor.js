/**
 * ActionSetExecutor.js
 *
 * Core engine for data-driven NPC behavior.
 *
 * Given an array of action sets (each with a requirements array and an
 * actions array), evaluates requirements against game state and executes
 * the first matching set's actions via EventBus emissions.
 *
 * This replaces hardcoded NPC interaction logic with pure data definitions.
 * Consumers (DialogueEngine, questSlice, inventorySlice, etc.) will be
 * wired to ACTION_* events in future phases (34-02+).
 *
 * Exports:
 *   evaluateActionSets(actionSets, context) → Object|null
 *   executeActions(actions, emitter) → void
 */

import { EVENTS } from '../../utils/eventBusTypes.js';
import { EventBus } from '../../utils/eventBus.js';

// ─────────────────────────────────────────────────────────────────────────────
// Requirement evaluation helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate a single requirement object against the current game context.
 *
 * @param {Object} req - Requirement descriptor
 * @param {Object} context - Current game state snapshot
 * @returns {boolean} Whether the requirement passes
 */
function evaluateRequirement(req, context) {
  switch (req.type) {
    case 'quest': {
      // Pass if player's quest status matches the required status
      const actualStatus = context.questStatuses?.[req.questId];
      return actualStatus === req.status;
    }

    case 'flag': {
      // Default expected value is true when req.value is omitted
      const expectedValue = req.value !== undefined ? req.value : true;
      const actualValue = context.storyFlags?.[req.flagId];
      return actualValue === expectedValue;
    }

    case 'vocab': {
      // Pass if player's mastery for this word meets or exceeds the threshold
      const actualMastery = context.vocabMastery?.[req.wordId] ?? 0;
      return actualMastery >= req.mastery;
    }

    case 'level': {
      // Pass if player level meets the minimum
      return (context.playerLevel ?? 0) >= req.min;
    }

    case 'item': {
      // Pass if the item id is present in inventory array
      return Array.isArray(context.inventory) && context.inventory.includes(req.itemId);
    }

    case 'time': {
      // Hour-range check with midnight wrap-around, matching ScheduleEvaluator logic.
      // e.g. startHour=20, endHour=6 → matches 20:00-05:59 (wraps midnight)
      const hour = context.currentHour ?? 0;
      const { startHour, endHour } = req;
      const inRange =
        startHour <= endHour
          ? hour >= startHour && hour < endHour
          : hour >= startHour || hour < endHour;
      return inRange;
    }

    case 'zone': {
      return context.currentZone === req.zone;
    }

    case 'factionRequired': {
      // req = { type: 'factionRequired', factionId: 'scholars', minScore: 25 }
      const score = context.factionScores?.[req.factionId] ?? 0;
      return score >= (req.minScore ?? 0);
    }

    case 'skill_tree_level': {
      // req = { type: 'skill_tree_level', treeId: 'grammar', minNodes: 3 }
      const unlockedCount = context.skillTreeUnlocked?.[req.treeId]?.length ?? 0;
      return unlockedCount >= (req.minNodes ?? 1);
    }

    default:
      // Unknown requirement type — fail safe (do not match)
      return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate an array of action sets against the current game state and return
 * the first matching set.
 *
 * Iteration order determines priority — earlier entries win.
 * An empty requirements array always matches (use as a default/fallback entry).
 *
 * @param {Array<{requirements: Object[], actions: Object[]}>} actionSets
 *   Ordered array of candidate action sets.
 * @param {Object} context - Current game state snapshot:
 *   @param {Object}   context.questStatuses  - Map of questId → status string
 *   @param {Object}   context.storyFlags     - Map of flagId  → any value
 *   @param {Object}   context.vocabMastery   - Map of wordId  → mastery (0-1)
 *   @param {number}   context.playerLevel    - Current player level (integer)
 *   @param {string[]} context.inventory      - Array of item id strings
 *   @param {number}   context.currentHour    - Current game hour (0-23)
 *   @param {string}   context.currentZone    - Current zone identifier
 *   @param {Object}   context.factionScores      - Map of factionId -> alignment score (0-100)
 *   @param {Object}   context.skillTreeUnlocked  - Map of treeId -> string[] of unlocked nodeIds
 * @returns {Object|null} The first matching action set, or null if none matched
 */
export function evaluateActionSets(actionSets, context) {
  if (!Array.isArray(actionSets) || actionSets.length === 0) return null;

  for (const actionSet of actionSets) {
    const requirements = actionSet.requirements ?? [];

    // Empty requirements array = unconditional match (default/fallback)
    if (requirements.length === 0) return actionSet;

    // All requirements must pass for this set to match
    const allPass = requirements.every((req) => evaluateRequirement(req, context));
    if (allPass) return actionSet;
  }

  return null; // No matching action set
}

/**
 * Execute an array of action objects by emitting the corresponding EventBus
 * events sequentially.
 *
 * Actions are executed in order. Consumers of these events
 * (DialogueEngine, questSlice, inventorySlice, etc.) are wired in future
 * phases (34-02+).
 *
 * @param {Object[]} actions - Array of action descriptors to execute
 * @param {Object} emitter   - EventBus instance (or any object with `.emit()`)
 */
export function executeActions(actions, emitter) {
  if (!Array.isArray(actions) || !emitter?.emit) return;

  for (const action of actions) {
    switch (action.type) {
      case 'speech':
        emitter.emit(EVENTS.ACTION_SPEECH, {
          npcId: action.npcId,
          dialogueKey: action.dialogueKey,
        });
        break;

      case 'startQuest':
        emitter.emit(EVENTS.ACTION_START_QUEST, {
          questId: action.questId,
        });
        break;

      case 'completeQuest':
        emitter.emit(EVENTS.ACTION_COMPLETE_QUEST, {
          questId: action.questId,
        });
        break;

      case 'giveItem':
        emitter.emit(EVENTS.ACTION_GIVE_ITEM, {
          itemId: action.itemId,
          quantity: action.quantity,
        });
        break;

      case 'teachWord':
        emitter.emit(EVENTS.ACTION_TEACH_WORD, {
          wordId: action.wordId,
        });
        break;

      case 'setFlag':
        emitter.emit(EVENTS.ACTION_SET_FLAG, {
          flagId: action.flagId,
          value: action.value,
        });
        break;

      case 'battle':
        emitter.emit(EVENTS.ACTION_BATTLE, {
          enemyId: action.enemyId,
        });
        break;

      case 'teleport':
        emitter.emit(EVENTS.ACTION_TELEPORT, {
          zone: action.zone,
          x: action.x,
          y: action.y,
        });
        break;

      case 'playSound':
        emitter.emit(EVENTS.ACTION_PLAY_SOUND, {
          soundId: action.soundId,
        });
        break;

      case 'poetry:start-battle': {
        const { poetId, poemId, npcAccuracy } = action;
        EventBus.emit(EVENTS.POETRY_BATTLE_START, {
          poetId,
          poemId,
          npcAccuracy: npcAccuracy ?? 0.7,
        });
        break;
      }

      default:
        // Unknown action type — skip silently (forward compatible)
        break;
    }
  }
}
