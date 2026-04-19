/**
 * leechDetectionMiddleware.js — FSRS Leech Detection and Interval Adjustment
 *
 * After every vocabulary card review (vocabulary/updateFsrsCard), checks if the
 * updated card has become a leech (lapses >= 5). If so, applies a 50% shorter
 * interval to make it appear more frequently in review sessions.
 *
 * Uses a _leechPenalty flag on the dispatched action to prevent infinite loops:
 * the second dispatch (with the adjusted card) carries `_leechPenalty: true` in
 * its payload, which this middleware ignores. The flag is NOT stored in Redux state
 * because the reducer only destructures { wordId, card, log }.
 */

import { isLeech, applyLeechIntervalPenalty } from '../../services/leechDetection.js';

/**
 * Middleware that auto-flags leech cards and adjusts their review interval.
 *
 * Listens for: vocabulary/updateFsrsCard
 * Side effect: dispatches another updateFsrsCard with halved interval when leech detected
 */
export const leechDetectionMiddleware = (store) => (next) => (action) => {
  // Skip the penalty re-dispatch to prevent infinite loops
  if (
    action.type === 'vocabulary/updateFsrsCard' &&
    action.payload?._leechPenalty === true
  ) {
    return next(action);
  }

  const result = next(action);

  if (action.type === 'vocabulary/updateFsrsCard') {
    const wordId = action.payload?.wordId;
    if (!wordId) return result;

    // Read updated card from state
    const state = store.getState();
    const cardData = state.vocabulary?.fsrsCards?.[wordId];

    if (cardData?.card && isLeech(cardData.card)) {
      // Apply 50% shorter interval and re-dispatch with leech penalty flag
      const penalizedCard = applyLeechIntervalPenalty(cardData.card);
      store.dispatch({
        type: 'vocabulary/updateFsrsCard',
        payload: { wordId, card: penalizedCard, log: cardData.log, _leechPenalty: true },
      });
    }
  }

  return result;
};
