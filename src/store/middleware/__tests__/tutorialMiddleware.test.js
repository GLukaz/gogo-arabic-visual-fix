/**
 * tutorialMiddleware.test.js
 *
 * Tests for FEAT-031 — Guided tutorial auto-trigger system.
 * Covers: sequence order, gate logic, skip, first-use-only, persistence.
 */

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { tutorialMiddleware } from '../tutorialMiddleware.js';
import onboardingReducer, {
  recordFeatureUse,
  skipTutorial,
  completeTutorialStep,
  selectNextTutorialStep,
  selectTutorialComplete,
  selectTutorialSteps,
  selectTutorialSkipped,
  TUTORIAL_SEQUENCE,
} from '../../slices/onboardingSlice.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeStore(preloadedOnboarding = {}) {
  return configureStore({
    reducer: { onboarding: onboardingReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(tutorialMiddleware),
    preloadedState: preloadedOnboarding
      ? { onboarding: { ...onboardingReducer(undefined, { type: '@@INIT' }), ...preloadedOnboarding } }
      : undefined,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TUTORIAL_SEQUENCE constant
// ─────────────────────────────────────────────────────────────────────────────

describe('TUTORIAL_SEQUENCE', () => {
  it('has exactly 5 steps', () => {
    expect(TUTORIAL_SEQUENCE).toHaveLength(5);
  });

  it('contains all expected step IDs in order', () => {
    expect(TUTORIAL_SEQUENCE).toEqual([
      'vocab_intro',
      'first_quiz',
      'first_battle',
      'crafting_intro',
      'quest_intro',
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Initial tutorial state
// ─────────────────────────────────────────────────────────────────────────────

describe('initial tutorial state', () => {
  it('has 5 tutorial steps, all incomplete', () => {
    const store = makeStore();
    const steps = selectTutorialSteps(store.getState());
    expect(steps).toHaveLength(5);
    steps.forEach((s) => expect(s.completed).toBe(false));
  });

  it('tutorialSkipped starts as false', () => {
    const store = makeStore();
    expect(selectTutorialSkipped(store.getState())).toBe(false);
  });

  it('selectNextTutorialStep returns first step initially', () => {
    const store = makeStore();
    const next = selectNextTutorialStep(store.getState());
    expect(next).not.toBeNull();
    expect(next.id).toBe('vocab_intro');
  });

  it('selectTutorialComplete is false initially', () => {
    const store = makeStore();
    expect(selectTutorialComplete(store.getState())).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Sequence — middleware triggers steps in order
// ─────────────────────────────────────────────────────────────────────────────

describe('tutorial sequence via middleware', () => {
  it('completes vocab_intro when vocab feature first used', () => {
    const store = makeStore();
    store.dispatch(recordFeatureUse('vocab'));
    const steps = selectTutorialSteps(store.getState());
    expect(steps.find((s) => s.id === 'vocab_intro').completed).toBe(true);
  });

  it('does NOT complete first_quiz before vocab_intro is done', () => {
    const store = makeStore();
    store.dispatch(recordFeatureUse('quiz'));
    const steps = selectTutorialSteps(store.getState());
    expect(steps.find((s) => s.id === 'first_quiz').completed).toBe(false);
  });

  it('completes first_quiz after vocab_intro is done', () => {
    const store = makeStore();
    store.dispatch(recordFeatureUse('vocab'));
    store.dispatch(recordFeatureUse('quiz'));
    const steps = selectTutorialSteps(store.getState());
    expect(steps.find((s) => s.id === 'first_quiz').completed).toBe(true);
  });

  it('completes full sequence in order', () => {
    const store = makeStore();
    const featureOrder = ['vocab', 'quiz', 'battle', 'crafting', 'quest'];
    featureOrder.forEach((f) => store.dispatch(recordFeatureUse(f)));
    const steps = selectTutorialSteps(store.getState());
    steps.forEach((s) => expect(s.completed).toBe(true));
    expect(selectTutorialComplete(store.getState())).toBe(true);
  });

  it('selectNextTutorialStep advances as steps complete', () => {
    const store = makeStore();
    expect(selectNextTutorialStep(store.getState()).id).toBe('vocab_intro');
    store.dispatch(recordFeatureUse('vocab'));
    expect(selectNextTutorialStep(store.getState()).id).toBe('first_quiz');
    store.dispatch(recordFeatureUse('quiz'));
    expect(selectNextTutorialStep(store.getState()).id).toBe('first_battle');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Gate logic — prerequisites
// ─────────────────────────────────────────────────────────────────────────────

describe('gate logic — prerequisites', () => {
  it('does NOT complete battle step if only quiz done (needs vocab first)', () => {
    const store = makeStore();
    // Artificially skip vocab, do quiz then battle
    store.dispatch(recordFeatureUse('quiz'));   // blocked — vocab not done
    store.dispatch(recordFeatureUse('battle')); // blocked — quiz not done
    const steps = selectTutorialSteps(store.getState());
    expect(steps.find((s) => s.id === 'first_battle').completed).toBe(false);
  });

  it('does NOT complete crafting_intro without all prior steps', () => {
    const store = makeStore();
    store.dispatch(recordFeatureUse('crafting')); // blocked
    expect(selectTutorialSteps(store.getState()).find((s) => s.id === 'crafting_intro').completed).toBe(false);
  });

  it('does NOT complete quest_intro out of order', () => {
    const store = makeStore();
    store.dispatch(recordFeatureUse('quest')); // blocked
    expect(selectTutorialSteps(store.getState()).find((s) => s.id === 'quest_intro').completed).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// First-use-only guard
// ─────────────────────────────────────────────────────────────────────────────

describe('first-use-only guard', () => {
  it('does not re-trigger a step on second feature use', () => {
    const store = makeStore();
    store.dispatch(recordFeatureUse('vocab')); // first use — triggers
    store.dispatch(completeTutorialStep('vocab_intro')); // already done
    // Manually reset to test guard: use a fresh store where vocab_intro is already done
    const store2 = makeStore({
      tutorialSteps: [
        { id: 'vocab_intro', completed: true },
        { id: 'first_quiz', completed: false },
        { id: 'first_battle', completed: false },
        { id: 'crafting_intro', completed: false },
        { id: 'quest_intro', completed: false },
      ],
      featureUsage: { vocab: { firstUsed: Date.now(), timesUsed: 1 } },
    });
    store2.dispatch(recordFeatureUse('vocab')); // second use
    const steps = selectTutorialSteps(store2.getState());
    // first_quiz should NOT complete because 'quiz' was not used
    expect(steps.find((s) => s.id === 'first_quiz').completed).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// skipTutorial
// ─────────────────────────────────────────────────────────────────────────────

describe('skipTutorial', () => {
  it('marks all steps complete and sets tutorialSkipped', () => {
    const store = makeStore();
    store.dispatch(skipTutorial());
    expect(selectTutorialSkipped(store.getState())).toBe(true);
    const steps = selectTutorialSteps(store.getState());
    steps.forEach((s) => expect(s.completed).toBe(true));
  });

  it('selectTutorialComplete returns true after skip', () => {
    const store = makeStore();
    store.dispatch(skipTutorial());
    expect(selectTutorialComplete(store.getState())).toBe(true);
  });

  it('selectNextTutorialStep returns null after skip', () => {
    const store = makeStore();
    store.dispatch(skipTutorial());
    expect(selectNextTutorialStep(store.getState())).toBeNull();
  });

  it('middleware does nothing after skip', () => {
    const store = makeStore();
    store.dispatch(skipTutorial());
    store.dispatch(recordFeatureUse('vocab'));
    // Steps should remain as set by skipTutorial
    const steps = selectTutorialSteps(store.getState());
    steps.forEach((s) => expect(s.completed).toBe(true));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectTutorialComplete edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe('selectTutorialComplete', () => {
  it('returns false when only some steps are done', () => {
    const store = makeStore();
    store.dispatch(recordFeatureUse('vocab'));
    store.dispatch(recordFeatureUse('quiz'));
    expect(selectTutorialComplete(store.getState())).toBe(false);
  });

  it('returns true only when all 5 steps are complete', () => {
    const store = makeStore();
    ['vocab', 'quiz', 'battle', 'crafting', 'quest'].forEach((f) =>
      store.dispatch(recordFeatureUse(f))
    );
    expect(selectTutorialComplete(store.getState())).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Non-tutorial features are ignored
// ─────────────────────────────────────────────────────────────────────────────

describe('non-tutorial feature use', () => {
  it('does not affect tutorial steps for unrelated features', () => {
    const store = makeStore();
    store.dispatch(recordFeatureUse('arena'));
    store.dispatch(recordFeatureUse('miniGames'));
    const steps = selectTutorialSteps(store.getState());
    steps.forEach((s) => expect(s.completed).toBe(false));
  });
});
