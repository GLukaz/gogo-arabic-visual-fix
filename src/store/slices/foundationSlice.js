/**
 * foundationSlice.js — FEAT-044
 *
 * Orchestrates the foundation phase: alphabet → coreVocab → rootIntro → complete.
 * Gates the open sandbox until foundation milestones are met.
 *
 * Stage completion criteria:
 *   - alphabet   : all 28 consonants at ≥80% mastery (delegated to isAlphabetComplete)
 *   - coreVocab  : first 50 core words at ≥70% mastery each
 *   - rootIntro  : ≥5 roots introduced (knownRoots.length)
 *   - complete   : sentinel — no further requirements
 *
 * Placement bypass: if the placement test scores above A1, the foundation
 * is marked complete immediately (player has existing knowledge).
 */
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { isAlphabetComplete } from './alphabetProgressSlice.js';
import { CORE_VOCABULARY } from '../../data/coreVocabulary.js';

// ── Constants ─────────────────────────────────────────────────────────────────

/** Ordered stages of the foundation phase */
export const FOUNDATION_STAGES = ['alphabet', 'coreVocab', 'rootIntro', 'complete'];

/** Index lookup for stage ordering */
const STAGE_INDEX = Object.fromEntries(FOUNDATION_STAGES.map((s, i) => [s, i]));

/** Mastery threshold (0-100) for core vocabulary in the coreVocab stage */
export const CORE_VOCAB_STAGE_THRESHOLD = 70;

/** Number of first core words checked for coreVocab stage completion */
export const CORE_VOCAB_STAGE_WORD_COUNT = 50;

/** Number of foundation roots required to complete the rootIntro stage */
export const ROOTS_INTRO_REQUIRED = 5;

// ── Pure Helpers ──────────────────────────────────────────────────────────────

/**
 * Return the current foundation stage string.
 *
 * @param {Object} state - Full Redux state
 * @returns {'alphabet'|'coreVocab'|'rootIntro'|'complete'}
 */
export function getCurrentFoundationStage(state) {
  return state.foundation?.stage ?? 'alphabet';
}

/**
 * Return true when the foundation phase has been completed (stage === 'complete').
 *
 * @param {Object} state - Full Redux state
 * @returns {boolean}
 */
export function isFoundationComplete(state) {
  return getCurrentFoundationStage(state) === 'complete';
}

/**
 * Return the next stage in sequence, or 'complete' if already at the last stage.
 *
 * @param {'alphabet'|'coreVocab'|'rootIntro'|'complete'} stage
 * @returns {'coreVocab'|'rootIntro'|'complete'}
 */
export function getNextStage(stage) {
  const idx = STAGE_INDEX[stage] ?? 0;
  return FOUNDATION_STAGES[Math.min(idx + 1, FOUNDATION_STAGES.length - 1)];
}

/**
 * Check whether the given stage's completion criteria are satisfied.
 * Reads from alphabetProgress, coreVocabulary, and rootKnowledge slices.
 *
 * @param {Object} state - Full Redux state
 * @param {'alphabet'|'coreVocab'|'rootIntro'|'complete'} stage
 * @returns {boolean}
 */
export function isStageComplete(state, stage) {
  switch (stage) {
    case 'alphabet':
      return isAlphabetComplete(state);

    case 'coreVocab': {
      const wordMastery = state.coreVocabulary?.wordMastery ?? {};
      const first50 = CORE_VOCABULARY.slice(0, CORE_VOCAB_STAGE_WORD_COUNT);
      return first50.every(
        (word) => (wordMastery[word.id] ?? 0) >= CORE_VOCAB_STAGE_THRESHOLD,
      );
    }

    case 'rootIntro':
      return (state.rootKnowledge?.knownRoots?.length ?? 0) >= ROOTS_INTRO_REQUIRED;

    case 'complete':
      return true;

    default:
      return false;
  }
}

/**
 * Return progress percentage (0-100) within the given stage.
 *
 * @param {Object} state - Full Redux state
 * @param {'alphabet'|'coreVocab'|'rootIntro'|'complete'} stage
 * @returns {number} 0-100
 */
export function getStageProgress(state, stage) {
  switch (stage) {
    case 'alphabet': {
      // % of 28 consonants at MASTERY_THRESHOLD%+ mastery
      // Import AFL_SEQUENCE lazily to avoid circular dep (alphabetProgressSlice imports nothing from here)
      const letterMastery = state.alphabetProgress?.letterMastery ?? {};
      const AFL_SEQUENCE = [
        'hamza', 'ba',    'ta',    'tha',   'jim',   'hah',   'kha',
        'dal',   'dhal',  'ra',    'zay',   'sin',   'sheen', 'sad',
        'dad',   'tah',   'zah',   'ayn',   'ghayn', 'fa',    'qaf',
        'kaf',   'lam',   'meem',  'noon',  'ha',    'waw',   'ya',
      ];
      const THRESHOLD = 80;
      const masteredCount = AFL_SEQUENCE.filter((id) => {
        const forms = letterMastery[id] ?? {};
        const avg = Math.round(
          ((forms.isolated ?? 0) + (forms.initial ?? 0) + (forms.medial ?? 0) + (forms.final ?? 0)) / 4,
        );
        return avg >= THRESHOLD;
      }).length;
      return Math.round((masteredCount / AFL_SEQUENCE.length) * 100);
    }

    case 'coreVocab': {
      const wordMastery = state.coreVocabulary?.wordMastery ?? {};
      const first50 = CORE_VOCABULARY.slice(0, CORE_VOCAB_STAGE_WORD_COUNT);
      const masteredCount = first50.filter(
        (word) => (wordMastery[word.id] ?? 0) >= CORE_VOCAB_STAGE_THRESHOLD,
      ).length;
      return Math.round((masteredCount / CORE_VOCAB_STAGE_WORD_COUNT) * 100);
    }

    case 'rootIntro': {
      const known = state.rootKnowledge?.knownRoots?.length ?? 0;
      return Math.min(100, Math.round((known / ROOTS_INTRO_REQUIRED) * 100));
    }

    case 'complete':
      return 100;

    default:
      return 0;
  }
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  /**
   * Current foundation stage.
   * @type {'alphabet'|'coreVocab'|'rootIntro'|'complete'}
   */
  stage: 'alphabet',

  /**
   * True when the foundation was bypassed via a placement test score above A1.
   */
  bypassedViaPlacement: false,
};

const foundationSlice = createSlice({
  name: 'foundation',
  initialState,
  reducers: {
    /**
     * Advance to the next foundation stage.
     * Caller is responsible for checking isStageComplete before dispatching.
     * Idempotent when stage is already 'complete'.
     */
    advanceFoundationStage(state) {
      if (state.stage === 'complete') return;
      const idx = STAGE_INDEX[state.stage] ?? 0;
      state.stage = FOUNDATION_STAGES[Math.min(idx + 1, FOUNDATION_STAGES.length - 1)];
    },

    /**
     * Immediately mark the foundation as complete due to a placement test
     * result indicating existing knowledge (score above A1).
     */
    bypassFoundationWithPlacement(state) {
      state.stage = 'complete';
      state.bypassedViaPlacement = true;
    },

    /**
     * Reset to initial state (e.g. fresh start, testing).
     */
    resetFoundation() {
      return initialState;
    },
  },
});

export const {
  advanceFoundationStage,
  bypassFoundationWithPlacement,
  resetFoundation,
} = foundationSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Current foundation stage string */
export const selectFoundationStage = (state) => getCurrentFoundationStage(state);

/** True when foundation is complete */
export const selectIsFoundationComplete = (state) => isFoundationComplete(state);

/**
 * Memoized selector: { stage, stageProgress, overallProgress }
 *
 * overallProgress formula:
 *   4 equal segments of 25% (one per stage).
 *   Completed stages contribute full 25%; current stage contributes proportionally.
 *   stage='complete' → overallProgress = 100.
 */
export const selectFoundationProgress = createSelector(
  (state) => state.foundation?.stage ?? 'alphabet',
  (state) => state.alphabetProgress?.letterMastery ?? {},
  (state) => state.coreVocabulary?.wordMastery ?? {},
  (state) => state.rootKnowledge?.knownRoots ?? [],
  (stage, _letterMastery, _wordMastery, _knownRoots) => {
    // We need the full state for getStageProgress — use a closure trick by rebuilding
    // minimal state from the selector inputs to avoid passing full state through reselect.
    // This keeps the memoization keys tight (only re-computes when these 4 change).
    const minState = {
      foundation: { stage },
      alphabetProgress: { letterMastery: _letterMastery },
      coreVocabulary: { wordMastery: _wordMastery },
      rootKnowledge: { knownRoots: _knownRoots },
    };

    const stageProgress = getStageProgress(minState, stage);
    const stageIndex = STAGE_INDEX[stage] ?? 0;

    // Overall: each completed stage = 25%, current = stageProgress * 0.25
    const overallProgress = stage === 'complete'
      ? 100
      : Math.round(stageIndex * 25 + stageProgress * 0.25);

    return { stage, stageProgress, overallProgress };
  },
);

export default foundationSlice.reducer;
