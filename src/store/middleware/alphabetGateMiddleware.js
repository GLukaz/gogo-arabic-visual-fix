/**
 * Alphabet Gate Middleware — FEAT-041
 *
 * Intercepts `world/enterZone` actions and blocks them until the player
 * has demonstrated ≥80% mastery across all 4 forms of all 28 Arabic
 * consonants (as reported by isAlphabetComplete).
 *
 * Bypass: if the placement test has been completed with an assigned level
 * above A1 (i.e. A2 or B1), the player has demonstrated existing knowledge
 * and the gate is skipped.
 *
 * When blocked, the action is silently dropped (not forwarded to next).
 * The UI should read selectIsAlphabetComplete to show the appropriate prompt.
 */
import { isAlphabetComplete } from '../slices/alphabetProgressSlice.js';

export const alphabetGateMiddleware = (store) => (next) => (action) => {
  if (action.type !== 'world/enterZone') return next(action);

  const state = store.getState();

  // Bypass: placement test completed with existing knowledge (A2 or B1 = above A1)
  const placement = state.placement;
  const hasPlacementBypass =
    placement?.hasCompleted === true &&
    placement?.assignedLevel != null &&
    placement.assignedLevel !== 'A1';

  if (hasPlacementBypass) return next(action);

  // Gate: block zone entry until alphabet mastery is complete
  if (!isAlphabetComplete(state)) {
    // Silently drop the action — UI reads selectIsAlphabetComplete to show prompt
    return;
  }

  return next(action);
};
