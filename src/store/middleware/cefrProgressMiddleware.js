/**
 * cefrProgressMiddleware.js — Automatic CEFR level recalculation
 *
 * Listens for vocabulary card updates and recalculates the player's overall
 * CEFR level. If the derived level differs from the stored level, it dispatches
 * setCefrLevel to update the state.
 *
 * Trigger actions:
 *   vocabulary/updateFsrsCard  — after each review/new card
 *   vocabulary/addFsrsCard     — when a new word is first introduced
 *
 * Guards:
 *   - Re-entrancy guard prevents cascades
 *   - Only dispatches if the computed level is a valid CEFR level
 *   - Never downgrades level (progression is always forward)
 */

import { generateCefrReport } from '../../utils/cefrReportGenerator.js';
import { setCefrLevel } from '../slices/cefrProgressSlice.js';

const CEFR_RANK = { A1: 1, A2: 2, B1: 3, B2: 4 };

const TRIGGER_ACTIONS = new Set([
  'vocabulary/updateFsrsCard',
  'vocabulary/addFsrsCard',
]);

let _isProcessingCefr = false;

export const cefrProgressMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (!TRIGGER_ACTIONS.has(action.type) || _isProcessingCefr) return result;

  _isProcessingCefr = true;
  try {
    const state    = store.getState();
    const cards    = state.vocabulary?.fsrsCards ?? {};
    const placement = state.placement ?? {};
    const report   = generateCefrReport(cards, placement);

    if (!report.overallLevel) return result;

    const currentLevel = state.cefrProgress?.currentLevel;
    const currentRank  = CEFR_RANK[currentLevel] ?? 0;
    const derivedRank  = CEFR_RANK[report.overallLevel] ?? 0;

    // Only advance — never downgrade
    if (derivedRank > currentRank) {
      store.dispatch(setCefrLevel({ level: report.overallLevel, source: 'vocab_progress' }));
    }
  } finally {
    _isProcessingCefr = false;
  }

  return result;
};
