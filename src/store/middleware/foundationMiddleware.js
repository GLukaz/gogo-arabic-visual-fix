/**
 * Foundation Middleware — FEAT-044
 *
 * Enforces stage gates for the foundation phase.
 * Blocks `world/enterZone` dispatches until the foundation is either:
 *   a) in the 'complete' stage (all milestones met), or
 *   b) bypassed via a placement test score above A1.
 *
 * Placement bypass is read from state.foundation.bypassedViaPlacement
 * (set by bypassFoundationWithPlacement action when placement records
 * an assignedLevel above A1).
 *
 * The block is silent — the action is dropped without calling next().
 * The UI should read selectIsFoundationComplete to show an appropriate prompt.
 */
import { isFoundationComplete } from '../slices/foundationSlice.js';

export const foundationMiddleware = (store) => (next) => (action) => {
  if (action.type !== 'world/enterZone') return next(action);

  const state = store.getState();

  // Allow if foundation is complete or was bypassed via placement
  if (isFoundationComplete(state)) return next(action);

  // Silently drop — UI reads selectIsFoundationComplete to show prompt
  return;
};
