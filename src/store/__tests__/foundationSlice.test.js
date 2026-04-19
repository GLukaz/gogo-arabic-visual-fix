import { describe, it, expect, vi, beforeEach } from 'vitest';
import foundationReducer, {
  advanceFoundationStage,
  bypassFoundationWithPlacement,
  resetFoundation,
  FOUNDATION_STAGES,
  CORE_VOCAB_STAGE_THRESHOLD,
  CORE_VOCAB_STAGE_WORD_COUNT,
  ROOTS_INTRO_REQUIRED,
  getCurrentFoundationStage,
  isFoundationComplete,
  getNextStage,
  isStageComplete,
  getStageProgress,
  selectFoundationStage,
  selectIsFoundationComplete,
  selectFoundationProgress,
} from '../slices/foundationSlice.js';
import { foundationMiddleware } from '../middleware/foundationMiddleware.js';
import { AFL_SEQUENCE } from '../slices/alphabetProgressSlice.js';
import { CORE_VOCABULARY } from '../../data/coreVocabulary.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitialState() {
  return foundationReducer(undefined, { type: '@@INIT' });
}

/** Build a full Redux state where all 28 consonants are at a given form score */
function buildAlphabetState(score) {
  const letterMastery = {};
  for (const id of AFL_SEQUENCE) {
    letterMastery[id] = { isolated: score, initial: score, medial: score, final: score };
  }
  return { alphabetProgress: { letterMastery } };
}

/** Build a full Redux state where first N core words are at a given score */
function buildCoreVocabState(count, score) {
  const wordMastery = {};
  for (let i = 0; i < count; i++) {
    const word = CORE_VOCABULARY[i];
    if (word) wordMastery[word.id] = score;
  }
  return { coreVocabulary: { wordMastery } };
}

/** Build a full Redux state with N known roots */
function buildRootState(count) {
  const knownRoots = [];
  for (let i = 0; i < count; i++) {
    knownRoots.push(`root_${i}`);
  }
  return { rootKnowledge: { knownRoots } };
}

/** Merge multiple partial Redux states */
function mergeState(...parts) {
  return Object.assign(
    { foundation: { stage: 'alphabet', bypassedViaPlacement: false }, alphabetProgress: { letterMastery: {} }, coreVocabulary: { wordMastery: {} }, rootKnowledge: { knownRoots: [] } },
    ...parts,
  );
}

/** Build a mock middleware store */
function makeMockStore(stateOverrides = {}) {
  const state = mergeState(stateOverrides);
  return {
    getState: () => state,
    dispatch: vi.fn(),
  };
}

// ── FOUNDATION_STAGES constant ────────────────────────────────────────────────

describe('FOUNDATION_STAGES', () => {
  it('has exactly 4 stages in order', () => {
    expect(FOUNDATION_STAGES).toEqual(['alphabet', 'coreVocab', 'rootIntro', 'complete']);
  });
});

// ── Initial state ─────────────────────────────────────────────────────────────

describe('initial state', () => {
  it('starts at alphabet stage', () => {
    const state = getInitialState();
    expect(state.stage).toBe('alphabet');
  });

  it('starts with bypassedViaPlacement = false', () => {
    const state = getInitialState();
    expect(state.bypassedViaPlacement).toBe(false);
  });
});

// ── advanceFoundationStage reducer ────────────────────────────────────────────

describe('advanceFoundationStage', () => {
  it('advances from alphabet to coreVocab', () => {
    const state = getInitialState();
    const next = foundationReducer(state, advanceFoundationStage());
    expect(next.stage).toBe('coreVocab');
  });

  it('advances from coreVocab to rootIntro', () => {
    const state = { stage: 'coreVocab', bypassedViaPlacement: false };
    const next = foundationReducer(state, advanceFoundationStage());
    expect(next.stage).toBe('rootIntro');
  });

  it('advances from rootIntro to complete', () => {
    const state = { stage: 'rootIntro', bypassedViaPlacement: false };
    const next = foundationReducer(state, advanceFoundationStage());
    expect(next.stage).toBe('complete');
  });

  it('is idempotent when already at complete', () => {
    const state = { stage: 'complete', bypassedViaPlacement: false };
    const next = foundationReducer(state, advanceFoundationStage());
    expect(next.stage).toBe('complete');
  });
});

// ── bypassFoundationWithPlacement ─────────────────────────────────────────────

describe('bypassFoundationWithPlacement', () => {
  it('sets stage to complete', () => {
    const state = getInitialState();
    const next = foundationReducer(state, bypassFoundationWithPlacement());
    expect(next.stage).toBe('complete');
  });

  it('sets bypassedViaPlacement to true', () => {
    const state = getInitialState();
    const next = foundationReducer(state, bypassFoundationWithPlacement());
    expect(next.bypassedViaPlacement).toBe(true);
  });
});

// ── resetFoundation ───────────────────────────────────────────────────────────

describe('resetFoundation', () => {
  it('resets stage back to alphabet', () => {
    let state = foundationReducer(getInitialState(), advanceFoundationStage());
    state = foundationReducer(state, resetFoundation());
    expect(state.stage).toBe('alphabet');
  });

  it('resets bypassedViaPlacement to false', () => {
    let state = foundationReducer(getInitialState(), bypassFoundationWithPlacement());
    state = foundationReducer(state, resetFoundation());
    expect(state.bypassedViaPlacement).toBe(false);
  });
});

// ── Pure helpers ──────────────────────────────────────────────────────────────

describe('getCurrentFoundationStage', () => {
  it('returns alphabet for a fresh state', () => {
    const state = mergeState();
    expect(getCurrentFoundationStage(state)).toBe('alphabet');
  });

  it('returns the current stage from state', () => {
    const state = mergeState({ foundation: { stage: 'rootIntro', bypassedViaPlacement: false } });
    expect(getCurrentFoundationStage(state)).toBe('rootIntro');
  });
});

describe('isFoundationComplete', () => {
  it('returns false when stage is alphabet', () => {
    expect(isFoundationComplete(mergeState())).toBe(false);
  });

  it('returns true when stage is complete', () => {
    const state = mergeState({ foundation: { stage: 'complete', bypassedViaPlacement: false } });
    expect(isFoundationComplete(state)).toBe(true);
  });
});

describe('getNextStage', () => {
  it('alphabet → coreVocab', () => expect(getNextStage('alphabet')).toBe('coreVocab'));
  it('coreVocab → rootIntro', () => expect(getNextStage('coreVocab')).toBe('rootIntro'));
  it('rootIntro → complete', () => expect(getNextStage('rootIntro')).toBe('complete'));
  it('complete → complete', () => expect(getNextStage('complete')).toBe('complete'));
});

// ── isStageComplete ───────────────────────────────────────────────────────────

describe('isStageComplete — alphabet', () => {
  it('returns false when no letters mastered', () => {
    expect(isStageComplete(mergeState(), 'alphabet')).toBe(false);
  });

  it('returns true when all 28 consonants at 80%+ mastery', () => {
    const state = mergeState(buildAlphabetState(80));
    expect(isStageComplete(state, 'alphabet')).toBe(true);
  });

  it('returns false when any consonant is below 80%', () => {
    const letterMastery = {};
    for (const id of AFL_SEQUENCE) {
      letterMastery[id] = { isolated: 79, initial: 79, medial: 79, final: 79 };
    }
    const state = mergeState({ alphabetProgress: { letterMastery } });
    expect(isStageComplete(state, 'alphabet')).toBe(false);
  });
});

describe('isStageComplete — coreVocab', () => {
  it('returns false when no words mastered', () => {
    expect(isStageComplete(mergeState(), 'coreVocab')).toBe(false);
  });

  it('returns true when first 50 words are at 70%+', () => {
    const state = mergeState(buildCoreVocabState(CORE_VOCAB_STAGE_WORD_COUNT, 70));
    expect(isStageComplete(state, 'coreVocab')).toBe(true);
  });

  it('returns false when only 49 words mastered', () => {
    const state = mergeState(buildCoreVocabState(CORE_VOCAB_STAGE_WORD_COUNT - 1, 70));
    expect(isStageComplete(state, 'coreVocab')).toBe(false);
  });
});

describe('isStageComplete — rootIntro', () => {
  it('returns false when fewer than 5 roots known', () => {
    const state = mergeState(buildRootState(4));
    expect(isStageComplete(state, 'rootIntro')).toBe(false);
  });

  it('returns true when 5 roots known', () => {
    const state = mergeState(buildRootState(5));
    expect(isStageComplete(state, 'rootIntro')).toBe(true);
  });

  it('returns true when more than 5 roots known', () => {
    const state = mergeState(buildRootState(10));
    expect(isStageComplete(state, 'rootIntro')).toBe(true);
  });
});

describe('isStageComplete — complete', () => {
  it('always returns true', () => {
    expect(isStageComplete(mergeState(), 'complete')).toBe(true);
  });
});

// ── getStageProgress ──────────────────────────────────────────────────────────

describe('getStageProgress — alphabet', () => {
  it('returns 0 when no letters mastered', () => {
    expect(getStageProgress(mergeState(), 'alphabet')).toBe(0);
  });

  it('returns 100 when all 28 letters mastered', () => {
    const state = mergeState(buildAlphabetState(80));
    expect(getStageProgress(state, 'alphabet')).toBe(100);
  });

  it('returns ~50 when half letters mastered', () => {
    const letterMastery = {};
    AFL_SEQUENCE.forEach((id, i) => {
      const score = i < 14 ? 80 : 0;
      letterMastery[id] = { isolated: score, initial: score, medial: score, final: score };
    });
    const state = mergeState({ alphabetProgress: { letterMastery } });
    expect(getStageProgress(state, 'alphabet')).toBe(50);
  });
});

describe('getStageProgress — coreVocab', () => {
  it('returns 0 when no words mastered', () => {
    expect(getStageProgress(mergeState(), 'coreVocab')).toBe(0);
  });

  it('returns 100 when all 50 words mastered', () => {
    const state = mergeState(buildCoreVocabState(50, 70));
    expect(getStageProgress(state, 'coreVocab')).toBe(100);
  });

  it('returns 50 when 25 of 50 words mastered', () => {
    const state = mergeState(buildCoreVocabState(25, 70));
    expect(getStageProgress(state, 'coreVocab')).toBe(50);
  });
});

describe('getStageProgress — rootIntro', () => {
  it('returns 0 when no roots known', () => {
    expect(getStageProgress(mergeState(), 'rootIntro')).toBe(0);
  });

  it('returns 100 when 5+ roots known', () => {
    const state = mergeState(buildRootState(5));
    expect(getStageProgress(state, 'rootIntro')).toBe(100);
  });

  it('returns 60 when 3 roots known', () => {
    const state = mergeState(buildRootState(3));
    expect(getStageProgress(state, 'rootIntro')).toBe(60);
  });

  it('caps at 100 for more than ROOTS_INTRO_REQUIRED', () => {
    const state = mergeState(buildRootState(10));
    expect(getStageProgress(state, 'rootIntro')).toBe(100);
  });
});

describe('getStageProgress — complete', () => {
  it('returns 100', () => {
    expect(getStageProgress(mergeState(), 'complete')).toBe(100);
  });
});

// ── selectFoundationProgress ──────────────────────────────────────────────────

describe('selectFoundationProgress', () => {
  it('returns correct structure', () => {
    const state = mergeState();
    const progress = selectFoundationProgress(state);
    expect(progress).toHaveProperty('stage');
    expect(progress).toHaveProperty('stageProgress');
    expect(progress).toHaveProperty('overallProgress');
  });

  it('returns 0 overall progress at fresh start', () => {
    const state = mergeState();
    const progress = selectFoundationProgress(state);
    expect(progress.stage).toBe('alphabet');
    expect(progress.overallProgress).toBe(0);
  });

  it('returns 100 overallProgress when complete', () => {
    const state = mergeState({ foundation: { stage: 'complete', bypassedViaPlacement: false } });
    const progress = selectFoundationProgress(state);
    expect(progress.overallProgress).toBe(100);
  });

  it('returns 25 overallProgress at start of coreVocab stage', () => {
    // Stage index 1 * 25 + stageProgress * 0.25 = 25 + 0 = 25
    const state = mergeState({ foundation: { stage: 'coreVocab', bypassedViaPlacement: false } });
    const progress = selectFoundationProgress(state);
    expect(progress.overallProgress).toBe(25);
  });

  it('returns 50 overallProgress at start of rootIntro stage', () => {
    const state = mergeState({ foundation: { stage: 'rootIntro', bypassedViaPlacement: false } });
    const progress = selectFoundationProgress(state);
    expect(progress.overallProgress).toBe(50);
  });

  it('returns 75 overallProgress at start of complete stage via partial', () => {
    // Stage 'complete' returns 100, so let's test rootIntro at 100% progress
    const state = mergeState(
      { foundation: { stage: 'rootIntro', bypassedViaPlacement: false } },
      buildRootState(5), // rootIntro stage at 100%
    );
    const progress = selectFoundationProgress(state);
    // stageIndex=2 * 25 + 100 * 0.25 = 50 + 25 = 75
    expect(progress.overallProgress).toBe(75);
  });
});

// ── foundationMiddleware ──────────────────────────────────────────────────────

describe('foundationMiddleware', () => {
  let next;
  beforeEach(() => {
    next = vi.fn();
  });

  it('allows non-zone-entry actions through', () => {
    const store = makeMockStore();
    foundationMiddleware(store)(next)({ type: 'some/action' });
    expect(next).toHaveBeenCalledOnce();
  });

  it('blocks world/enterZone when foundation is not complete', () => {
    const store = makeMockStore({ foundation: { stage: 'alphabet', bypassedViaPlacement: false } });
    foundationMiddleware(store)(next)({ type: 'world/enterZone' });
    expect(next).not.toHaveBeenCalled();
  });

  it('blocks world/enterZone at coreVocab stage', () => {
    const store = makeMockStore({ foundation: { stage: 'coreVocab', bypassedViaPlacement: false } });
    foundationMiddleware(store)(next)({ type: 'world/enterZone' });
    expect(next).not.toHaveBeenCalled();
  });

  it('blocks world/enterZone at rootIntro stage', () => {
    const store = makeMockStore({ foundation: { stage: 'rootIntro', bypassedViaPlacement: false } });
    foundationMiddleware(store)(next)({ type: 'world/enterZone' });
    expect(next).not.toHaveBeenCalled();
  });

  it('allows world/enterZone when foundation is complete', () => {
    const store = makeMockStore({ foundation: { stage: 'complete', bypassedViaPlacement: false } });
    foundationMiddleware(store)(next)({ type: 'world/enterZone' });
    expect(next).toHaveBeenCalledOnce();
  });

  it('allows world/enterZone when bypassed via placement', () => {
    const store = makeMockStore({ foundation: { stage: 'complete', bypassedViaPlacement: true } });
    foundationMiddleware(store)(next)({ type: 'world/enterZone' });
    expect(next).toHaveBeenCalledOnce();
  });
});
