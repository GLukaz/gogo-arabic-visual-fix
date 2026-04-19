/**
 * tutorialMiddleware.js — Auto-trigger tutorial steps on first feature use.
 *
 * Listens for `onboarding/recordFeatureUse` actions. When a feature
 * corresponding to a tutorial step is used for the first time AND all
 * prerequisite steps are already complete, it dispatches
 * `completeTutorialStep` to advance the tutorial sequence.
 *
 * Tutorial sequence (in order):
 *   vocab_intro → first_quiz → first_battle → crafting_intro → quest_intro
 *
 * Each step requires the previous step to be completed before it triggers.
 * The tutorial can be skipped entirely via `skipTutorial()`.
 *
 * FEAT-031 — Guided tutorial auto-trigger system
 */

import {
  completeTutorialStep,
  TUTORIAL_SEQUENCE,
} from '../slices/onboardingSlice.js';

// Maps feature IDs (payload of recordFeatureUse) → tutorial step IDs
const FEATURE_TO_STEP = {
  vocab: 'vocab_intro',
  quiz: 'first_quiz',
  battle: 'first_battle',
  crafting: 'crafting_intro',
  quest: 'quest_intro',
};

/**
 * Redux middleware that auto-triggers tutorial steps on first feature use.
 *
 * Intercepts `onboarding/recordFeatureUse` actions. After the action is
 * processed (so featureUsage is already updated), it checks:
 *  1. Is there a tutorial step for this feature?
 *  2. Is the tutorial not skipped?
 *  3. Is this the first use of the feature (timesUsed === 1)?
 *  4. Are all prerequisite steps complete?
 *
 * If all conditions are met, dispatches completeTutorialStep(stepId).
 */
export const tutorialMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type !== 'onboarding/recordFeatureUse') return result;

  const featureId = action.payload;
  const stepId = FEATURE_TO_STEP[featureId];
  if (!stepId) return result;

  const state = store.getState();
  const onboarding = state.onboarding;
  if (!onboarding) return result;

  // Skip if tutorial already skipped or step already done
  if (onboarding.tutorialSkipped) return result;

  const steps = onboarding.tutorialSteps;
  const step = steps.find((s) => s.id === stepId);
  if (!step || step.completed) return result;

  // Only trigger on first use
  const featureUsage = onboarding.featureUsage[featureId];
  if (!featureUsage || featureUsage.timesUsed !== 1) return result;

  // Check prerequisites: all steps before this one must be completed
  const stepIndex = TUTORIAL_SEQUENCE.indexOf(stepId);
  const prerequisitesMet = steps
    .slice(0, stepIndex)
    .every((s) => s.completed);

  if (prerequisitesMet) {
    store.dispatch(completeTutorialStep(stepId));
  }

  return result;
};
