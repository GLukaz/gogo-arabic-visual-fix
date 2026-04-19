import { describe, it, expect } from 'vitest';
import onboardingReducer, {
  markIntroSeen,
  markTipSeen,
  recordFeatureUse,
  updatePhase,
  setSuggestFeature,
  selectIntroductionsSeen,
  selectTipsSeen,
  selectFeatureUsage,
  selectOnboardingPhase,
  selectSuggestFeature,
  selectUnseenIntro,
  selectApplicableTips,
  selectUnusedFeatures,
} from '../onboardingSlice.js';

/**
 * onboardingSlice unit tests
 *
 * Phase 92 — Tutorial & Onboarding Refresh
 */

const baseState = onboardingReducer(undefined, { type: '@@INIT' });

// Helper to wrap slice state in the shape selectors expect
const wrapState = (sliceState) => ({ onboarding: sliceState });

// ============================================================
// Initial state
// ============================================================

describe('onboardingSlice — initial state', () => {
  it('has empty introductionsSeen array', () => {
    expect(baseState.introductionsSeen).toEqual([]);
  });

  it('has empty tipsSeen array', () => {
    expect(baseState.tipsSeen).toEqual([]);
  });

  it('has empty featureUsage object', () => {
    expect(baseState.featureUsage).toEqual({});
  });

  it('has onboardingPhase set to "new"', () => {
    expect(baseState.onboardingPhase).toBe('new');
  });

  it('has suggestFeature set to null', () => {
    expect(baseState.suggestFeature).toBeNull();
  });
});

// ============================================================
// markIntroSeen
// ============================================================

describe('markIntroSeen', () => {
  it('adds intro ID to introductionsSeen', () => {
    const state = onboardingReducer(baseState, markIntroSeen('intro_basic_quiz'));
    expect(state.introductionsSeen).toContain('intro_basic_quiz');
  });

  it('does not duplicate if already seen', () => {
    let state = onboardingReducer(baseState, markIntroSeen('intro_basic_quiz'));
    state = onboardingReducer(state, markIntroSeen('intro_basic_quiz'));
    expect(state.introductionsSeen.filter((id) => id === 'intro_basic_quiz')).toHaveLength(1);
  });

  it('tracks multiple distinct intros', () => {
    let state = onboardingReducer(baseState, markIntroSeen('intro_basic_quiz'));
    state = onboardingReducer(state, markIntroSeen('intro_writing_practice'));
    expect(state.introductionsSeen).toHaveLength(2);
  });
});

// ============================================================
// markTipSeen
// ============================================================

describe('markTipSeen', () => {
  it('adds tip ID to tipsSeen', () => {
    const state = onboardingReducer(baseState, markTipSeen('tip_fsrs_review'));
    expect(state.tipsSeen).toContain('tip_fsrs_review');
  });

  it('does not duplicate if already seen', () => {
    let state = onboardingReducer(baseState, markTipSeen('tip_fsrs_review'));
    state = onboardingReducer(state, markTipSeen('tip_fsrs_review'));
    expect(state.tipsSeen.filter((id) => id === 'tip_fsrs_review')).toHaveLength(1);
  });
});

// ============================================================
// recordFeatureUse
// ============================================================

describe('recordFeatureUse', () => {
  it('creates feature entry on first use with timesUsed: 1', () => {
    const state = onboardingReducer(baseState, recordFeatureUse('quiz'));
    expect(state.featureUsage.quiz).toBeDefined();
    expect(state.featureUsage.quiz.timesUsed).toBe(1);
    expect(typeof state.featureUsage.quiz.firstUsed).toBe('number');
  });

  it('increments timesUsed on subsequent uses', () => {
    let state = onboardingReducer(baseState, recordFeatureUse('quiz'));
    state = onboardingReducer(state, recordFeatureUse('quiz'));
    state = onboardingReducer(state, recordFeatureUse('quiz'));
    expect(state.featureUsage.quiz.timesUsed).toBe(3);
  });

  it('does not change firstUsed on subsequent uses', () => {
    let state = onboardingReducer(baseState, recordFeatureUse('quiz'));
    const firstUsed = state.featureUsage.quiz.firstUsed;
    state = onboardingReducer(state, recordFeatureUse('quiz'));
    expect(state.featureUsage.quiz.firstUsed).toBe(firstUsed);
  });

  it('auto-advances to "learning" when 2 distinct features used', () => {
    let state = onboardingReducer(baseState, recordFeatureUse('quiz'));
    expect(state.onboardingPhase).toBe('new'); // only 1 feature
    state = onboardingReducer(state, recordFeatureUse('writing'));
    expect(state.onboardingPhase).toBe('learning');
  });

  it('auto-advances to "intermediate" when 6 distinct features used', () => {
    let state = baseState;
    const features = ['quiz', 'writing', 'reading', 'grammar', 'conversation', 'miniGames'];
    features.forEach((f) => {
      state = onboardingReducer(state, recordFeatureUse(f));
    });
    expect(state.onboardingPhase).toBe('intermediate');
  });

  it('auto-advances to "advanced" when 12 distinct features used', () => {
    let state = baseState;
    const features = [
      'quiz', 'writing', 'reading', 'grammar', 'conversation', 'miniGames',
      'dailyChallenges', 'skillTrees', 'loreCodex', 'crafting', 'arena', 'companions',
    ];
    features.forEach((f) => {
      state = onboardingReducer(state, recordFeatureUse(f));
    });
    expect(state.onboardingPhase).toBe('advanced');
  });
});

// ============================================================
// updatePhase
// ============================================================

describe('updatePhase', () => {
  it('sets phase to a valid value', () => {
    const state = onboardingReducer(baseState, updatePhase('intermediate'));
    expect(state.onboardingPhase).toBe('intermediate');
  });

  it('ignores invalid phase values', () => {
    const state = onboardingReducer(baseState, updatePhase('invalid_phase'));
    expect(state.onboardingPhase).toBe('new');
  });

  it('accepts all valid phase strings', () => {
    ['new', 'learning', 'intermediate', 'advanced'].forEach((phase) => {
      const state = onboardingReducer(baseState, updatePhase(phase));
      expect(state.onboardingPhase).toBe(phase);
    });
  });
});

// ============================================================
// setSuggestFeature
// ============================================================

describe('setSuggestFeature', () => {
  it('sets suggestFeature to a feature ID', () => {
    const state = onboardingReducer(baseState, setSuggestFeature('writingPractice'));
    expect(state.suggestFeature).toBe('writingPractice');
  });

  it('clears suggestFeature when set to null', () => {
    let state = onboardingReducer(baseState, setSuggestFeature('writingPractice'));
    state = onboardingReducer(state, setSuggestFeature(null));
    expect(state.suggestFeature).toBeNull();
  });
});

// ============================================================
// Selectors
// ============================================================

describe('basic selectors', () => {
  it('selectIntroductionsSeen returns the introductionsSeen array', () => {
    const state = wrapState(onboardingReducer(baseState, markIntroSeen('intro_basic_quiz')));
    expect(selectIntroductionsSeen(state)).toContain('intro_basic_quiz');
  });

  it('selectTipsSeen returns the tipsSeen array', () => {
    const state = wrapState(onboardingReducer(baseState, markTipSeen('tip_fsrs_review')));
    expect(selectTipsSeen(state)).toContain('tip_fsrs_review');
  });

  it('selectFeatureUsage returns the featureUsage object', () => {
    const state = wrapState(onboardingReducer(baseState, recordFeatureUse('quiz')));
    expect(selectFeatureUsage(state)).toHaveProperty('quiz');
  });

  it('selectOnboardingPhase returns the current phase', () => {
    const state = wrapState(baseState);
    expect(selectOnboardingPhase(state)).toBe('new');
  });

  it('selectSuggestFeature returns the suggested feature', () => {
    const state = wrapState(onboardingReducer(baseState, setSuggestFeature('arena')));
    expect(selectSuggestFeature(state)).toBe('arena');
  });
});

// ============================================================
// selectUnseenIntro
// ============================================================

describe('selectUnseenIntro', () => {
  it('returns the first unseen intro for a given level', () => {
    const state = wrapState(baseState);
    const intro = selectUnseenIntro(state, 1);
    expect(intro).not.toBeNull();
    expect(intro.triggerLevel).toBeLessThanOrEqual(1);
  });

  it('skips intros that have been seen', () => {
    let sliceState = onboardingReducer(baseState, markIntroSeen('intro_basic_quiz'));
    const state = wrapState(sliceState);
    const intro = selectUnseenIntro(state, 1);
    if (intro) {
      expect(intro.id).not.toBe('intro_basic_quiz');
    }
  });

  it('returns null when all eligible intros have been seen', () => {
    let sliceState = baseState;
    // Mark all level-1 intros as seen
    ['intro_basic_quiz', 'intro_alphabet', 'intro_journal'].forEach((id) => {
      sliceState = onboardingReducer(sliceState, markIntroSeen(id));
    });
    const state = wrapState(sliceState);
    const intro = selectUnseenIntro(state, 1);
    expect(intro).toBeNull();
  });

  it('returns higher-level intros when player level qualifies', () => {
    // Mark all level-1 intros as seen
    let sliceState = baseState;
    ['intro_basic_quiz', 'intro_alphabet', 'intro_journal'].forEach((id) => {
      sliceState = onboardingReducer(sliceState, markIntroSeen(id));
    });
    const state = wrapState(sliceState);
    const intro = selectUnseenIntro(state, 5);
    expect(intro).not.toBeNull();
    expect(intro.triggerLevel).toBeGreaterThan(1);
    expect(intro.triggerLevel).toBeLessThanOrEqual(5);
  });
});

// ============================================================
// selectApplicableTips
// ============================================================

describe('selectApplicableTips', () => {
  it('returns tips matching the given context', () => {
    const state = wrapState(baseState);
    const tips = selectApplicableTips(state, 'review_due');
    expect(tips.length).toBeGreaterThan(0);
    tips.forEach((tip) => {
      expect(tip.context).toBe('review_due');
    });
  });

  it('filters out showOnce tips that have been seen', () => {
    let sliceState = onboardingReducer(baseState, markTipSeen('tip_fsrs_review'));
    const state = wrapState(sliceState);
    const tips = selectApplicableTips(state, 'review_due');
    const ids = tips.map((t) => t.id);
    expect(ids).not.toContain('tip_fsrs_review');
  });

  it('returns empty array for unknown context', () => {
    const state = wrapState(baseState);
    const tips = selectApplicableTips(state, 'totally_unknown');
    expect(tips).toEqual([]);
  });
});

// ============================================================
// selectUnusedFeatures
// ============================================================

describe('selectUnusedFeatures', () => {
  it('returns all eligible features when none have been used', () => {
    const state = wrapState(baseState);
    const unused = selectUnusedFeatures(state, 5);
    expect(unused.length).toBeGreaterThan(0);
  });

  it('excludes features that have been used', () => {
    let sliceState = onboardingReducer(baseState, recordFeatureUse('quiz'));
    const state = wrapState(sliceState);
    const unused = selectUnusedFeatures(state, 5);
    expect(unused).not.toContain('quiz');
  });

  it('only includes features eligible at the given level', () => {
    const state = wrapState(baseState);
    const unusedLevel1 = selectUnusedFeatures(state, 1);
    const unusedLevel15 = selectUnusedFeatures(state, 15);
    expect(unusedLevel15.length).toBeGreaterThan(unusedLevel1.length);
  });
});
