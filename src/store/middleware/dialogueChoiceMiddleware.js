/**
 * dialogueChoiceMiddleware.js — Dialogue choice consequence applicator
 *
 * Listens for `narrative/recordDialogueChoice` and applies world state
 * consequences defined in the action payload. Each choice can carry an
 * array of typed consequences that fan out to the appropriate slices.
 *
 * Supported consequence types:
 *   factionChange    — adjusts faction alignment score
 *   relationshipChange — adjusts NPC/companion relationship (npcRelationships)
 *   questUnlock      — activates a locked quest
 *   itemGrant        — adds an item to the player's inventory
 *
 * FEAT-032 — Dialogue choice tracking and world state effects
 */

import { incrementNpcRelationship } from '../slices/narrativeSlice.js';
import { adjustAlignment } from '../slices/factionSlice.js';
import { activateQuest } from '../slices/questSlice.js';
import { addItem } from '../slices/inventorySlice.js';

/**
 * Apply a single consequence by dispatching the appropriate action.
 *
 * @param {Function} dispatch — store.dispatch
 * @param {{ type: string, [key: string]: any }} consequence
 */
function applyConsequence(dispatch, consequence) {
  switch (consequence.type) {
    case 'factionChange':
      dispatch(adjustAlignment({
        factionId: consequence.factionId,
        amount: consequence.amount,
      }));
      break;

    case 'relationshipChange':
      dispatch(incrementNpcRelationship({
        npcId: consequence.npcId,
        amount: consequence.amount,
      }));
      break;

    case 'questUnlock':
      dispatch(activateQuest(consequence.questId));
      break;

    case 'itemGrant':
      dispatch(addItem({ itemId: consequence.itemId, quantity: 1 }));
      break;

    default:
      if (import.meta.env.DEV) {
        console.warn(
          `[dialogueChoiceMiddleware] Unknown consequence type "${consequence.type}". Ignored.`
        );
      }
  }
}

/**
 * Redux middleware that fans out dialogue choice consequences to their
 * respective slices after the choice is recorded in narrativeSlice.
 */
export const dialogueChoiceMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type !== 'narrative/recordDialogueChoice') return result;

  const consequences = action.payload?.consequences;
  if (!Array.isArray(consequences) || consequences.length === 0) return result;

  for (const consequence of consequences) {
    applyConsequence(store.dispatch, consequence);
  }

  return result;
};
