/**
 * CEFR Progress Report Generator
 *
 * Aggregates FSRS vocabulary cards and placement test results into a structured
 * CEFR progress report.
 *
 * A word is considered "known" when its FSRS card exists (the player has reviewed it).
 * A word is considered "mastered" when stability >= 7 days (consolidation threshold).
 *
 * Overall CEFR level determination:
 *   The highest CEFR level where the player has reviewed >= MASTERY_THRESHOLD (60%)
 *   of available vocabulary at that level.
 *
 * Per-skill breakdown:
 *   Vocabulary categories are mapped to the 5 CEFR skills via CATEGORY_SKILL_MAP.
 *   Words that span multiple skills count toward each applicable skill.
 */

import { createSelector } from '@reduxjs/toolkit';
import vocabularyAll from '../data/vocabularyAll.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'];
const CEFR_RANK   = { A1: 1, A2: 2, B1: 3, B2: 4 };
const MASTERY_THRESHOLD = 0.6; // 60% reviewed = level mastered
const HOURS_PER_NEW_WORD = 5 / 60; // 5 minutes of study per new word

export const SKILLS = ['reading', 'writing', 'grammar', 'listening', 'speaking'];

/**
 * Category → CEFR skill(s) mapping.
 * A category can map to multiple skills (word counted toward each).
 */
export const CATEGORY_SKILL_MAP = {
  // Grammar
  grammar:                  ['grammar'],
  grammar_patterns:         ['grammar'],
  grammar_particles:        ['grammar'],
  advanced_grammar_forms:   ['grammar'],
  verbs_form_II_III:        ['grammar', 'writing'],
  verbs_basic:              ['grammar', 'speaking'],
  verbs_intermediate:       ['grammar', 'speaking'],
  advanced_verbs:           ['grammar', 'writing'],
  // Reading / literary
  literary_arabic:          ['reading'],
  history:                  ['reading'],
  history_civilization:     ['reading'],
  culture:                  ['reading'],
  arts_literature:          ['reading'],
  rhetoric_eloquence:       ['reading'],
  quranic_classical:        ['reading', 'grammar'],
  academic_discourse:       ['reading', 'writing'],
  religion:                 ['reading'],
  philosophy_advanced:      ['reading'],
  // Writing
  writing:                  ['writing'],
  education:                ['writing', 'reading'],
  science:                  ['writing', 'reading'],
  mathematics:              ['writing'],
  // Listening / speaking / conversational
  greetings:                ['speaking', 'listening'],
  phrases:                  ['speaking', 'listening'],
  social_life:              ['speaking', 'listening'],
  daily_life:               ['speaking', 'listening'],
  food:                     ['speaking', 'listening'],
  trade:                    ['speaking', 'listening'],
  hospitality:              ['speaking', 'listening'],
  directions:               ['speaking', 'listening'],
  health:                   ['speaking', 'listening'],
  emotions:                 ['speaking', 'listening'],
  // General / shared
  adjectives:               ['reading', 'writing', 'grammar'],
  numbers:                  ['reading', 'writing'],
  family:                   ['speaking', 'listening', 'reading'],
  body:                     ['speaking', 'listening'],
  clothing:                 ['speaking', 'listening'],
  time:                     ['reading', 'writing'],
  nature:                   ['reading', 'listening'],
  animals:                  ['reading', 'listening'],
  travel:                   ['speaking', 'listening'],
  work_business:            ['reading', 'writing'],
  technology:               ['reading', 'writing'],
  geography:                ['reading'],
  architecture:             ['reading'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Get skills for a vocabulary category (defaults to all skills for unknown categories). */
function getSkillsForCategory(category) {
  return CATEGORY_SKILL_MAP[category] ?? SKILLS;
}

/** Determine overall CEFR level from per-level mastery data. */
function deriveOverallLevel(masteryByCefr) {
  let result = null;
  for (const level of CEFR_LEVELS) {
    const { known, total } = masteryByCefr[level];
    if (total > 0 && known / total >= MASTERY_THRESHOLD) {
      result = level;
    }
  }
  return result;
}

// ── Main pure function ────────────────────────────────────────────────────────

/**
 * Generate a structured CEFR progress report.
 *
 * @param {{ [wordId: string]: { card: { stability: number } } }} vocabularyCards
 *   FSRS cards from state.vocabulary.fsrsCards
 * @param {{ assignedLevel: string|null, hasCompleted: boolean }} placementResult
 *   From state.placement
 * @returns {Object} Structured CEFR report
 */
export function generateCefrReport(vocabularyCards, placementResult) {
  const cards = vocabularyCards ?? {};

  // ── Aggregate per-CEFR-level mastery ─────────────────────────────────────

  const masteryByCefr = {};
  for (const lvl of CEFR_LEVELS) {
    masteryByCefr[lvl] = { known: 0, total: 0 };
  }

  // ── Aggregate per-skill-per-CEFR mastery ─────────────────────────────────

  const skillData = {};
  for (const skill of SKILLS) {
    skillData[skill] = {};
    for (const lvl of CEFR_LEVELS) {
      skillData[skill][lvl] = { known: 0, total: 0 };
    }
  }

  // Walk all vocabulary and accumulate stats
  for (const word of vocabularyAll) {
    const cefrLevel = word.cefrLevel;
    if (!cefrLevel || !masteryByCefr[cefrLevel]) continue;

    const hasCard = !!cards[word.id];
    const known = hasCard ? 1 : 0;

    masteryByCefr[cefrLevel].total += 1;
    masteryByCefr[cefrLevel].known += known;

    const wordSkills = getSkillsForCategory(word.category);
    for (const skill of wordSkills) {
      skillData[skill][cefrLevel].total += 1;
      skillData[skill][cefrLevel].known += known;
    }
  }

  // ── Derive overall level ──────────────────────────────────────────────────

  const overallLevel = deriveOverallLevel(masteryByCefr);

  // ── Per-skill breakdown ───────────────────────────────────────────────────

  const skills = {};
  for (const skill of SKILLS) {
    const byLevel = skillData[skill];
    // Skill level = highest CEFR level with ≥ MASTERY_THRESHOLD known in that skill
    let skillLevel = null;
    let totalKnown = 0;
    let totalWords = 0;
    for (const lvl of CEFR_LEVELS) {
      const { known, total } = byLevel[lvl];
      totalKnown += known;
      totalWords += total;
      if (total > 0 && known / total >= MASTERY_THRESHOLD) {
        skillLevel = lvl;
      }
    }
    skills[skill] = {
      level: skillLevel,
      wordsKnown: totalKnown,
      totalWords,
      percentage: totalWords > 0 ? Math.round((totalKnown / totalWords) * 100) / 100 : 0,
    };
  }

  // ── Progress since placement ──────────────────────────────────────────────

  const placementLevel = placementResult?.hasCompleted ? placementResult.assignedLevel : null;
  const overallRank    = CEFR_RANK[overallLevel] ?? 0;
  const placementRank  = CEFR_RANK[placementLevel] ?? 0;

  const avgSkillRank = Object.values(skills).reduce((sum, s) => sum + (CEFR_RANK[s.level] ?? 0), 0) / SKILLS.length;

  const laggingSkills  = SKILLS.filter((s) => (CEFR_RANK[skills[s].level] ?? 0) < avgSkillRank - 0.5);
  const advancedSkills = SKILLS.filter((s) => (CEFR_RANK[skills[s].level] ?? 0) > avgSkillRank + 0.5);

  const progressSincePlacement = {
    placementLevel,
    currentLevel: overallLevel,
    delta: placementLevel && overallLevel ? `${placementLevel}→${overallLevel}` : null,
    levelsGained: Math.max(0, overallRank - placementRank),
    laggingSkills,
    advancedSkills,
  };

  // ── Estimated hours to next level ─────────────────────────────────────────

  const nextLevelIdx = overallLevel ? CEFR_LEVELS.indexOf(overallLevel) + 1 : 0;
  const nextLevel    = CEFR_LEVELS[nextLevelIdx] ?? null;

  let estimatedHoursToNextLevel = null;
  if (nextLevel && masteryByCefr[nextLevel]) {
    const { known, total } = masteryByCefr[nextLevel];
    const wordsNeeded = Math.max(0, Math.ceil(total * MASTERY_THRESHOLD) - known);
    estimatedHoursToNextLevel = Math.round(wordsNeeded * HOURS_PER_NEW_WORD * 10) / 10;
  }

  return {
    overallLevel,
    nextLevel,
    masteryByCefr,
    skills,
    progressSincePlacement,
    estimatedHoursToNextLevel,
  };
}

// ── Memoized Redux selector ───────────────────────────────────────────────────

/**
 * selectCefrReport — memoized selector returning the full CEFR report.
 * Recalculates whenever vocabulary cards or placement result change.
 */
export const selectCefrReport = createSelector(
  [
    (state) => state.vocabulary?.fsrsCards ?? {},
    (state) => state.placement ?? {},
  ],
  (fsrsCards, placement) => generateCefrReport(fsrsCards, placement)
);
