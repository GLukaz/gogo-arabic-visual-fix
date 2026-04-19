/**
 * curriculumDashboard.js — FEAT-050
 *
 * Aggregates all curriculum progression data into a single dashboard-ready object.
 * Reads from: foundationSlice, alphabetProgressSlice, coreVocabularySlice,
 * rootKnowledgeSlice, zoneVocabIntroSlice, zoneGrammarSlice,
 * cefrProgressSlice, and vocabularySlice (FSRS cards).
 *
 * All functions are pure — no mutations, no dispatches.
 *
 * Exported API:
 *   getCurriculumDashboard(state)              → full dashboard object
 *   selectCurriculumDashboard                  → memoized Redux selector
 *   estimateTimeToNextCefr(dashboard)          → number (hours)
 *   getWeakAreas(dashboard)                    → string[] (area names, lowest-progress first)
 *   suggestNextActivity(dashboard)             → { action, reason }
 */

import { createSelector } from '@reduxjs/toolkit';

import { getCurrentFoundationStage, getStageProgress } from '../store/slices/foundationSlice.js';
import { isAlphabetComplete, AFL_SEQUENCE, MASTERY_THRESHOLD } from '../store/slices/alphabetProgressSlice.js';
import { getCoreVocabProgress } from '../store/slices/coreVocabularySlice.js';
import { getKnownRoots, getRootMastery, ROOT_MASTERY_THRESHOLD } from '../store/slices/rootKnowledgeSlice.js';
import { selectAllZoneIntroProgress } from '../store/slices/zoneVocabIntroSlice.js';
import { selectGrammarProgress } from '../store/slices/zoneGrammarSlice.js';
import { selectVocabByFrequencyTier } from './frequencyWeighting.js';
import { ROOT_TEACHING_SET } from '../data/rootTeachingSet.js';

// ─── CEFR helpers ─────────────────────────────────────────────────────────────

// Hours required to advance from each level to the next (Arabic: ILR class IV)
const HOURS_TO_NEXT_LEVEL = {
  null: 100,   // start → A1
  A1:   150,   // A1 → A2
  A2:   350,   // A2 → B1
  B1:   400,   // B1 → B2
  B2:   0,     // already at highest tracked level
};

/**
 * Derive a CEFR label from a 0-100 progress percentage within an area.
 *
 * @param {number} progressPct - 0-100
 * @returns {string|null} CEFR label or null
 */
function progressToCefr(progressPct) {
  if (progressPct >= 90) return 'B1';
  if (progressPct >= 60) return 'A2';
  if (progressPct >= 25) return 'A1';
  return null;
}

// ─── Core aggregation ─────────────────────────────────────────────────────────

/**
 * Build the full curriculum dashboard object from Redux state.
 *
 * @param {Object} state - Full Redux root state
 * @returns {{
 *   foundationPhase: { stage: string, stageProgress: number, overallProgress: number },
 *   zonesIntroduced: { byZone: Object, totalReviewed: number, totalWords: number, overallPercentage: number },
 *   vocabTiers: { tier1: number, tier2: number, tier3: number, tier4: number },
 *   grammarCoverage: { learned: number, total: number, byZone: Object },
 *   rootKnowledge: { known: number, total: number, masteredCount: number, averageMastery: number, derivedWordsUnlocked: number },
 *   cefrEstimate: { overall: string|null, perSkill: { vocabulary: string|null, grammar: string|null, alphabet: string|null, reading: string|null } }
 * }}
 */
export function getCurriculumDashboard(state) {
  // ── Foundation phase ──────────────────────────────────────────────────────
  const stage = getCurrentFoundationStage(state);
  const stageProgress = getStageProgress(state, stage);
  const STAGE_INDEX = { alphabet: 0, coreVocab: 1, rootIntro: 2, complete: 3 };
  const stageIndex = STAGE_INDEX[stage] ?? 0;
  const overallFoundationProgress = stage === 'complete'
    ? 100
    : Math.round(stageIndex * 25 + stageProgress * 0.25);

  const foundationPhase = { stage, stageProgress, overallProgress: overallFoundationProgress };

  // ── Zone intros ──────────────────────────────────────────────────────────
  const zonesIntroduced = selectAllZoneIntroProgress(state);

  // ── Vocabulary tiers ──────────────────────────────────────────────────────
  const vocabTiers = selectVocabByFrequencyTier(state);

  // ── Grammar coverage ──────────────────────────────────────────────────────
  const grammarCoverage = selectGrammarProgress(state);

  // ── Root knowledge ────────────────────────────────────────────────────────
  const knownRoots = getKnownRoots(state);
  const totalRoots = ROOT_TEACHING_SET.length;
  const masteredCount = knownRoots.filter(
    (rootId) => getRootMastery(state, rootId) >= ROOT_MASTERY_THRESHOLD,
  ).length;
  const averageMastery = knownRoots.length === 0
    ? 0
    : Math.round(
        knownRoots.reduce((sum, rootId) => sum + getRootMastery(state, rootId), 0) /
        knownRoots.length,
      );

  // Count total derived words unlocked (sum of derivedWords.length for all known roots)
  const derivedWordsUnlocked = knownRoots.reduce((sum, rootId) => {
    const rootEntry = ROOT_TEACHING_SET.find((r) => r.id === rootId);
    return sum + (rootEntry?.derivedWords?.length ?? 0);
  }, 0);

  const rootKnowledge = {
    known: knownRoots.length,
    total: totalRoots,
    masteredCount,
    averageMastery,
    derivedWordsUnlocked,
  };

  // ── CEFR estimate ─────────────────────────────────────────────────────────
  const overallCefr = state.cefrProgress?.currentLevel ?? null;

  // Per-skill estimates derived from available signals
  const totalVocabCards = Object.keys(state.vocabulary?.fsrsCards ?? {}).length;
  const alphabetProgress = isAlphabetComplete(state)
    ? 100
    : Math.round(
        (AFL_SEQUENCE.filter((id) => {
          const forms = state.alphabetProgress?.letterMastery?.[id] ?? {};
          const avg = Math.round(
            ((forms.isolated ?? 0) + (forms.initial ?? 0) + (forms.medial ?? 0) + (forms.final ?? 0)) / 4,
          );
          return avg >= MASTERY_THRESHOLD;
        }).length / AFL_SEQUENCE.length) * 100,
      );

  const coreVocabProg = getCoreVocabProgress(state);
  const grammarPct = grammarCoverage.total > 0
    ? Math.round((grammarCoverage.learned / grammarCoverage.total) * 100)
    : 0;

  // Vocabulary CEFR: map total FSRS card count to rough CEFR milestones
  //   A1 ≈ 500 words, A2 ≈ 1500, B1 ≈ 3500
  let vocabCefr = null;
  if (totalVocabCards >= 3500) vocabCefr = 'B1';
  else if (totalVocabCards >= 1500) vocabCefr = 'A2';
  else if (totalVocabCards >= 100) vocabCefr = 'A1';

  const cefrEstimate = {
    overall: overallCefr,
    perSkill: {
      vocabulary: vocabCefr,
      grammar: progressToCefr(grammarPct),
      alphabet: progressToCefr(alphabetProgress),
      reading: progressToCefr(
        Math.round((coreVocabProg.percentage + alphabetProgress) / 2),
      ),
    },
  };

  return {
    foundationPhase,
    zonesIntroduced,
    vocabTiers,
    grammarCoverage,
    rootKnowledge,
    cefrEstimate,
  };
}

// ─── Memoized selector ────────────────────────────────────────────────────────

/**
 * Memoized Redux selector for the curriculum dashboard.
 * Re-computes only when any of the tracked state slices change.
 */
export const selectCurriculumDashboard = createSelector(
  (state) => state.foundation,
  (state) => state.alphabetProgress,
  (state) => state.coreVocabulary,
  (state) => state.rootKnowledge,
  (state) => state.zoneVocabIntro,
  (state) => state.zoneGrammar,
  (state) => state.vocabulary?.fsrsCards,
  (state) => state.cefrProgress,
  // Recompute by delegating to getCurriculumDashboard with the full state.
  // We pass a reconstructed minimal state so the selector inputs drive memoization.
  (_foundation, _alpha, _coreVocab, _rootKnowledge, _zoneVocabIntro, _zoneGrammar, _fsrsCards, _cefrProgress) => {
    const minState = {
      foundation: _foundation,
      alphabetProgress: _alpha,
      coreVocabulary: _coreVocab,
      rootKnowledge: _rootKnowledge,
      zoneVocabIntro: _zoneVocabIntro,
      zoneGrammar: _zoneGrammar,
      vocabulary: { fsrsCards: _fsrsCards ?? {} },
      cefrProgress: _cefrProgress,
    };
    return getCurriculumDashboard(minState);
  },
);

// ─── Time estimation ──────────────────────────────────────────────────────────

/**
 * Estimate hours remaining until the next CEFR level.
 *
 * Uses the current overall CEFR level from the dashboard and the visible
 * progress signals to estimate how much of the current level has been
 * covered, then extrapolates remaining time.
 *
 * @param {Object} dashboard - Result of getCurriculumDashboard(state)
 * @returns {number} Estimated hours remaining (0 when already at B2 or above)
 */
export function estimateTimeToNextCefr(dashboard) {
  const level = dashboard?.cefrEstimate?.overall ?? null;
  const hoursNeeded = HOURS_TO_NEXT_LEVEL[level] ?? 100;
  if (hoursNeeded === 0) return 0;

  // Aggregate progress signals into a single 0-100 level-completion estimate.
  const foundationProg   = dashboard?.foundationPhase?.overallProgress ?? 0;
  const tiers            = dashboard?.vocabTiers ?? { tier1: 0, tier2: 0, tier3: 0, tier4: 0 };
  const totalVocab       = tiers.tier1 + tiers.tier2 + tiers.tier3 + tiers.tier4;
  const grammarCoverage  = dashboard?.grammarCoverage ?? { learned: 0, total: 0 };
  const grammarPct       = grammarCoverage.total > 0
    ? Math.round((grammarCoverage.learned / grammarCoverage.total) * 100)
    : 0;
  const zonesPct         = dashboard?.zonesIntroduced?.overallPercentage ?? 0;

  // Per-level vocabulary targets (FSRS cards)
  const vocabTargets = { null: 100, A1: 500, A2: 1500, B1: 3500, B2: 5000 };
  const vocabTarget  = vocabTargets[level] ?? 500;
  const vocabPct     = Math.min(100, Math.round((totalVocab / vocabTarget) * 100));

  // Weighted average of signals (foundation matters most early, vocab+grammar later)
  const levelProgress = Math.round(
    foundationProg * 0.25 +
    vocabPct       * 0.40 +
    grammarPct     * 0.20 +
    zonesPct       * 0.15,
  );

  const remainingFraction = Math.max(0, (100 - Math.min(100, levelProgress)) / 100);
  return Math.round(hoursNeeded * remainingFraction);
}

// ─── Weak area detection ──────────────────────────────────────────────────────

/**
 * Identify the areas where the learner is making the least progress,
 * ordered from lowest to highest.
 *
 * @param {Object} dashboard - Result of getCurriculumDashboard(state)
 * @returns {string[]} Area names ordered by progress (lowest first)
 */
export function getWeakAreas(dashboard) {
  const areas = [];

  // Foundation (0-100)
  const foundationPct = dashboard?.foundationPhase?.overallProgress ?? 0;
  areas.push({ name: 'foundation', progress: foundationPct });

  // Zone intros
  const zonePct = dashboard?.zonesIntroduced?.overallPercentage ?? 0;
  areas.push({ name: 'zoneVocabulary', progress: zonePct });

  // Grammar
  const gc = dashboard?.grammarCoverage ?? { learned: 0, total: 1 };
  const grammarPct = gc.total > 0 ? Math.round((gc.learned / gc.total) * 100) : 0;
  areas.push({ name: 'grammar', progress: grammarPct });

  // Root knowledge (known / total)
  const rk = dashboard?.rootKnowledge ?? { known: 0, total: 1 };
  const rootPct = rk.total > 0 ? Math.round((rk.known / rk.total) * 100) : 0;
  areas.push({ name: 'roots', progress: rootPct });

  // Vocabulary (tier1 is the most important — % of 500 target)
  const tiers = dashboard?.vocabTiers ?? { tier1: 0 };
  const vocabCorePct = Math.min(100, Math.round((tiers.tier1 / 500) * 100));
  areas.push({ name: 'vocabulary', progress: vocabCorePct });

  // Sort ascending by progress
  areas.sort((a, b) => a.progress - b.progress);
  return areas.map((a) => a.name);
}

// ─── Activity suggestion ──────────────────────────────────────────────────────

/**
 * Return the recommended next learning activity based on current dashboard state.
 *
 * @param {Object} dashboard - Result of getCurriculumDashboard(state)
 * @returns {{ action: string, reason: string }}
 */
export function suggestNextActivity(dashboard) {
  const foundation = dashboard?.foundationPhase ?? {};
  const rootKnowledge = dashboard?.rootKnowledge ?? { known: 0, total: 30 };
  const grammarCoverage = dashboard?.grammarCoverage ?? { learned: 0, total: 22 };
  const zonesIntroduced = dashboard?.zonesIntroduced ?? { overallPercentage: 0 };
  const tiers = dashboard?.vocabTiers ?? { tier1: 0, tier2: 0, tier3: 0, tier4: 0 };
  const totalVocab = tiers.tier1 + tiers.tier2 + tiers.tier3 + tiers.tier4;

  // 1. Foundation first — if not complete, continue there
  if (foundation.stage && foundation.stage !== 'complete') {
    const stageLabels = {
      alphabet: 'Practice Arabic letters',
      coreVocab: 'Study core vocabulary words',
      rootIntro: 'Learn trilateral roots',
    };
    return {
      action: stageLabels[foundation.stage] ?? 'Continue foundation phase',
      reason: `Foundation phase incomplete (${foundation.overallProgress ?? 0}% done) — stage: ${foundation.stage}`,
    };
  }

  // 2. Zone vocab intros — if any zone has low coverage
  const zonePct = zonesIntroduced.overallPercentage ?? 0;
  if (zonePct < 30) {
    return {
      action: 'Review zone vocabulary introductions',
      reason: `Only ${zonePct}% of zone vocabulary has been introduced`,
    };
  }

  // 3. Grammar — if below 50%
  const grammarPct = grammarCoverage.total > 0
    ? Math.round((grammarCoverage.learned / grammarCoverage.total) * 100)
    : 0;
  if (grammarPct < 50) {
    return {
      action: 'Practice grammar points',
      reason: `Grammar coverage is ${grammarPct}% — work through zone grammar exercises`,
    };
  }

  // 4. Root knowledge — if fewer than 10 roots known
  if (rootKnowledge.known < 10) {
    return {
      action: 'Study Arabic roots',
      reason: `Only ${rootKnowledge.known} of ${rootKnowledge.total} roots introduced — roots multiply vocabulary`,
    };
  }

  // 5. Vocabulary — if fewer than 200 high-frequency words in FSRS
  if (totalVocab < 200) {
    return {
      action: 'Build core vocabulary',
      reason: `${totalVocab} words in active study — aim for 200+ high-frequency words`,
    };
  }

  // 6. Balanced review
  const weakAreas = getWeakAreas(dashboard);
  const weakest = weakAreas[0];
  const areaMessages = {
    foundation:     'Complete the foundation phase exercises',
    zoneVocabulary: 'Review zone vocabulary introductions',
    grammar:        'Work through grammar exercises',
    roots:          'Study more Arabic roots',
    vocabulary:     'Add more vocabulary to active study',
  };
  return {
    action: areaMessages[weakest] ?? 'Review due vocabulary cards',
    reason: `Weakest area is "${weakest}" — focus here for balanced progress`,
  };
}
