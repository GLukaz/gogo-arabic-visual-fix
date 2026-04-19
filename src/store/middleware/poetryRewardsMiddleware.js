/**
 * poetryRewardsMiddleware.js
 *
 * Listens for `poetry/endPoetryBattle` and grants rewards when the player wins.
 * Runs BEFORE next(action) so it can read activeBattle state before the reducer
 * nulls it out (endPoetryBattle sets activeBattle to null).
 *
 * Rewards on win:
 *   - 50 XP via addXP dispatch
 *   - FSRS vocabulary card via addFsrsCard for each correctly answered word
 *     (guard: only if not already in fsrsCards)
 *   - SFX_QUEST victory sound via EventBus
 *
 * Note: The PoetryBattleOverlay component also dispatches rewards directly
 * for UI display purposes. This middleware acts as a secondary guarantee
 * for cases where the overlay may be unmounted before scoring completes.
 * In practice both run — addFsrsCard and addXP are idempotent-safe here
 * because the overlay runs first and the middleware is a safety net.
 *
 * If you prefer to have rewards run ONLY in middleware (single source of truth),
 * remove the reward dispatches from PoetryBattleOverlay.jsx and rely solely
 * on this middleware. The current design keeps them in the overlay for
 * immediate UI feedback (reward list display).
 */

import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { addXP } from '../slices/playerSlice.js';
import { addFsrsCard } from '../slices/vocabularySlice.js';

/**
 * poetryRewardsMiddleware — Redux middleware for poetry battle win rewards.
 *
 * @param {Object} storeAPI — { getState, dispatch }
 * @returns {Function} next => action => result
 */
export const poetryRewardsMiddleware = (storeAPI) => (next) => (action) => {
  // Only intercept endPoetryBattle on a win
  if (action.type === 'poetry/endPoetryBattle' && action.payload?.won) {
    // Read state BEFORE next(action) — reducer will null activeBattle after this
    const preState = storeAPI.getState();
    const battle = preState.poetry?.activeBattle;
    const fsrsCards = preState.vocabulary?.fsrsCards || {};

    // Advance reducer
    const result = next(action);

    // XP reward — 50 XP for winning a poetry battle
    storeAPI.dispatch(addXP(50));

    // FSRS vocabulary rewards for correctly answered words
    if (battle?.playerAnswers) {
      battle.playerAnswers.forEach((answer) => {
        if (answer?.isCorrect && answer.wordId && !fsrsCards[answer.wordId]) {
          storeAPI.dispatch(addFsrsCard({
            wordId: answer.wordId,
            card: null,
            source: 'poetry_battle',
          }));
        }
      });
    }

    // Victory SFX
    EventBus.emit(EVENTS.SFX_QUEST);

    return result;
  }

  return next(action);
};
