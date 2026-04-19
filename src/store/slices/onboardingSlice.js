/**
 * onboardingSlice.js — Redux slice for progressive onboarding state.
 *
 * Tracks which feature introductions and contextual tips the player has
 * seen, how much they have used each feature, and their overall onboarding
 * phase (new → learning → intermediate → advanced).
 *
 * Phase 92 — Tutorial & Onboarding Refresh
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { FEATURE_INTRODUCTIONS } from '../../data/featureIntroductions.js';
import { ONBOARDING_TIPS } from '../../data/onboardingTips.js';

// Phase thresholds: number of distinct features used to advance
const PHASE_THRESHOLDS = {
  learning: 2,       // used at least 2 features
  intermediate: 6,   // used at least 6 features
  advanced: 12,      // used at least 12 features
};

// Ordered tutorial step IDs — must be completed in sequence
export const TUTORIAL_SEQUENCE = [
  'vocab_intro',
  'first_quiz',
  'first_battle',
  'crafting_intro',
  'quest_intro',
];

const initialState = {
  introductionsSeen: [],   // feature intro IDs already shown
  tipsSeen: [],            // tip IDs already dismissed
  featureUsage: {},        // { [featureId]: { firstUsed: timestamp, timesUsed: number } }
  onboardingPhase: 'new',  // 'new' | 'learning' | 'intermediate' | 'advanced'
  suggestFeature: null,    // feature ID to suggest, or null
  // ── Tutorial state ──
  tutorialSteps: TUTORIAL_SEQUENCE.map((id) => ({ id, completed: false })),
  tutorialSkipped: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    markIntroSeen(state, action) {
      const introId = action.payload;
      if (!state.introductionsSeen.includes(introId)) {
        state.introductionsSeen.push(introId);
      }
    },

    markTipSeen(state, action) {
      const tipId = action.payload;
      if (!state.tipsSeen.includes(tipId)) {
        state.tipsSeen.push(tipId);
      }
    },

    recordFeatureUse(state, action) {
      const featureId = action.payload;
      if (!state.featureUsage[featureId]) {
        state.featureUsage[featureId] = {
          firstUsed: Date.now(),
          timesUsed: 0,
        };
      }
      state.featureUsage[featureId].timesUsed += 1;

      // Auto-advance onboarding phase based on total distinct features used
      const distinctFeaturesUsed = Object.keys(state.featureUsage).length;
      if (distinctFeaturesUsed >= PHASE_THRESHOLDS.advanced) {
        state.onboardingPhase = 'advanced';
      } else if (distinctFeaturesUsed >= PHASE_THRESHOLDS.intermediate) {
        state.onboardingPhase = 'intermediate';
      } else if (distinctFeaturesUsed >= PHASE_THRESHOLDS.learning) {
        state.onboardingPhase = 'learning';
      }
    },

    updatePhase(state, action) {
      const phase = action.payload;
      if (['new', 'learning', 'intermediate', 'advanced'].includes(phase)) {
        state.onboardingPhase = phase;
      }
    },

    setSuggestFeature(state, action) {
      state.suggestFeature = action.payload; // featureId or null
    },

    completeTutorialStep(state, action) {
      const stepId = action.payload;
      const step = state.tutorialSteps.find((s) => s.id === stepId);
      if (step) {
        step.completed = true;
      }
    },

    skipTutorial(state) {
      state.tutorialSkipped = true;
      state.tutorialSteps.forEach((s) => {
        s.completed = true;
      });
    },
  },
});

export const {
  markIntroSeen,
  markTipSeen,
  recordFeatureUse,
  updatePhase,
  setSuggestFeature,
  completeTutorialStep,
  skipTutorial,
} = onboardingSlice.actions;

// ========== SELECTORS ==========

export const selectIntroductionsSeen = (state) => state.onboarding.introductionsSeen;
export const selectTipsSeen = (state) => state.onboarding.tipsSeen;
export const selectFeatureUsage = (state) => state.onboarding.featureUsage;
export const selectOnboardingPhase = (state) => state.onboarding.onboardingPhase;
export const selectSuggestFeature = (state) => state.onboarding.suggestFeature;

/**
 * Get the first unseen feature introduction that the player's current level qualifies for.
 * Usage: selectUnseenIntro(state, playerLevel)
 */
export const selectUnseenIntro = createSelector(
  [selectIntroductionsSeen, (_state, level) => level],
  (seen, level) => {
    const eligible = FEATURE_INTRODUCTIONS.filter(
      (intro) => intro.triggerLevel <= level && !seen.includes(intro.id)
    );
    return eligible.length > 0 ? eligible[0] : null;
  }
);

/**
 * Get all tips that match a context and have not been seen (if showOnce).
 * Usage: selectApplicableTips(state, contextString)
 */
export const selectApplicableTips = createSelector(
  [selectTipsSeen, (_state, context) => context],
  (seen, context) => {
    return ONBOARDING_TIPS.filter((tip) => {
      if (tip.context !== context) return false;
      if (tip.showOnce && seen.includes(tip.id)) return false;
      return true;
    });
  }
);

/**
 * Get feature IDs from introductions that the player has unlocked but never used.
 */
export const selectUnusedFeatures = createSelector(
  [selectFeatureUsage, (_state, level) => level],
  (usage, level) => {
    const eligible = FEATURE_INTRODUCTIONS.filter(
      (intro) => intro.triggerLevel <= level
    );
    const eligibleFeatures = [...new Set(eligible.map((intro) => intro.feature))];
    return eligibleFeatures.filter((featureId) => !usage[featureId]);
  }
);

// ========== TUTORIAL SELECTORS ==========

export const selectTutorialSteps = (state) => state.onboarding.tutorialSteps;
export const selectTutorialSkipped = (state) => state.onboarding.tutorialSkipped;

/**
 * Returns the next incomplete tutorial step, or null if all complete / skipped.
 */
export const selectNextTutorialStep = (state) => {
  if (state.onboarding.tutorialSkipped) return null;
  return state.onboarding.tutorialSteps.find((s) => !s.completed) || null;
};

/**
 * Returns true when all tutorial steps are done or the tutorial was skipped.
 */
export const selectTutorialComplete = (state) => {
  return (
    state.onboarding.tutorialSkipped ||
    state.onboarding.tutorialSteps.every((s) => s.completed)
  );
};

export default onboardingSlice.reducer;
