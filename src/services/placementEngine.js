/**
 * placementEngine.js — Pure functions for CEFR placement test logic
 *
 * All functions are pure (no side effects, no Redux imports). They can be
 * tested independently of React and Redux.
 *
 * Exports:
 *   selectNextItem        — IRT binary search item selection
 *   computeRawScore       — Count correct answers
 *   assignCefrLevel       — Map score to CEFR level (conservative, B1 cap)
 *   dropOneTier           — "Start Lower" escape hatch
 *   shouldEarlyExit       — Detect 10+ consecutive correct answers
 *   deriveGrammarUnlocks  — Grammar lesson IDs for a given CEFR level
 *   deriveSkillTreeUnlocks — Skill tree node IDs per tree for a given CEFR level
 */

import { PLACEMENT_ITEMS } from '../data/placementTest.js';
import { grammarLessons } from '../data/grammar.js';
import { SKILL_TREES, SKILL_TREE_ORDER } from '../data/skillTrees.js';

/**
 * Local CEFR order that includes Pre-A1.
 *
 * Do NOT import CEFR_ORDER from quizTypes.js — that export has only
 * { A1:1, A2:2, B1:3, B2:4 } and modifying it would break existing tests.
 */
const PLACEMENT_CEFR_ORDER = { 'Pre-A1': 0, 'A1': 1, 'A2': 2, 'B1': 3 };

const PLACEMENT_LEVEL_ORDER = ['Pre-A1', 'A1', 'A2', 'B1'];

/** Maximum number of questions shown to the player. */
const TEST_CAP = 20;

// ─────────────────────────────────────────────────────────────────────────────
// selectNextItem
// ─────────────────────────────────────────────────────────────────────────────

/**
 * IRT binary-search adaptive item selection.
 *
 * Algorithm:
 *   - Start at A1 (default estimate if answers is empty).
 *   - After each answer: if correct, move estimate UP one level;
 *     if wrong, move estimate DOWN one level (clamped to Pre-A1..B1).
 *   - Select the next unanswered item whose cefrLevel matches the current
 *     estimate. If none available at that level, try adjacent levels.
 *   - Returns null when the bank is exhausted or 20+ items answered.
 *
 * @param {string[]}  answeredIds          — IDs already answered
 * @param {string}    currentLevelEstimate — Current difficulty estimate ('Pre-A1'|'A1'|'A2'|'B1')
 * @param {{ itemId: string, correct: boolean }[]} answers — Full answer history
 * @returns {Object|null} The next item to show, or null if test is complete
 */
export function selectNextItem(answeredIds, currentLevelEstimate, answers) {
  // Test cap: stop after 20 answered items
  if (answeredIds.length >= TEST_CAP) return null;

  // All items answered
  if (answeredIds.length >= PLACEMENT_ITEMS.length) return null;

  // Determine current estimate from answers history
  let levelEstimate = currentLevelEstimate || 'A1';
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    const lastIdx = PLACEMENT_CEFR_ORDER[levelEstimate] ?? 1;
    if (lastAnswer.correct) {
      // Move up one level (capped at B1)
      const nextIdx = Math.min(lastIdx + 1, PLACEMENT_LEVEL_ORDER.length - 1);
      levelEstimate = PLACEMENT_LEVEL_ORDER[nextIdx];
    } else {
      // Move down one level (floored at Pre-A1)
      const prevIdx = Math.max(lastIdx - 1, 0);
      levelEstimate = PLACEMENT_LEVEL_ORDER[prevIdx];
    }
  }

  const answeredSet = new Set(answeredIds);

  // Try to find an item at the current estimate level
  const atLevel = PLACEMENT_ITEMS.filter(
    (item) => item.cefrLevel === levelEstimate && !answeredSet.has(item.id)
  );

  if (atLevel.length > 0) {
    return atLevel[0];
  }

  // Fallback: search adjacent levels outward
  const estimateIdx = PLACEMENT_CEFR_ORDER[levelEstimate] ?? 1;

  for (let distance = 1; distance < PLACEMENT_LEVEL_ORDER.length; distance++) {
    // Try higher level first, then lower
    const higherIdx = estimateIdx + distance;
    const lowerIdx = estimateIdx - distance;

    if (higherIdx < PLACEMENT_LEVEL_ORDER.length) {
      const higherLevel = PLACEMENT_LEVEL_ORDER[higherIdx];
      const higherItems = PLACEMENT_ITEMS.filter(
        (item) => item.cefrLevel === higherLevel && !answeredSet.has(item.id)
      );
      if (higherItems.length > 0) return higherItems[0];
    }

    if (lowerIdx >= 0) {
      const lowerLevel = PLACEMENT_LEVEL_ORDER[lowerIdx];
      const lowerItems = PLACEMENT_ITEMS.filter(
        (item) => item.cefrLevel === lowerLevel && !answeredSet.has(item.id)
      );
      if (lowerItems.length > 0) return lowerItems[0];
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// computeRawScore
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Count the number of correct answers.
 *
 * @param {{ itemId: string, correct: boolean }[]} answers
 * @returns {number}
 */
export function computeRawScore(answers) {
  if (!answers || answers.length === 0) return 0;
  return answers.filter((a) => a.correct).length;
}

// ─────────────────────────────────────────────────────────────────────────────
// assignCefrLevel
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map a raw score to a CEFR level using conservative one-level-lower placement
 * with a B1 cap. Pre-A1 is mapped to 'A1' for cefrProgressSlice storage.
 *
 * Score thresholds:
 *   < 25%  → raw Pre-A1
 *   < 50%  → raw A1
 *   < 75%  → raw A2
 *   >= 75% → raw B1 (cap — never B2/C1/C2)
 *
 * Conservative placement applies one-level-lower default:
 *   assigned = max(0, rawIdx - 1)
 *
 * @param {number} rawScore   — Number of correct answers
 * @param {number} totalItems — Total questions answered
 * @returns {{ rawLevel: string, assignedLevel: string, storedLevel: string }}
 */
export function assignCefrLevel(rawScore, totalItems) {
  const pct = totalItems > 0 ? rawScore / totalItems : 0;

  let rawLevelIdx;
  if (pct < 0.25) {
    rawLevelIdx = 0; // Pre-A1
  } else if (pct < 0.5) {
    rawLevelIdx = 1; // A1
  } else if (pct < 0.75) {
    rawLevelIdx = 2; // A2
  } else {
    rawLevelIdx = 3; // B1 (cap)
  }

  const rawLevel = PLACEMENT_LEVEL_ORDER[rawLevelIdx];

  // Conservative placement: one level below raw (Pre-A1 is the floor)
  const assignedIdx = Math.max(0, rawLevelIdx - 1);
  const assignedLevel = PLACEMENT_LEVEL_ORDER[assignedIdx];

  // cefrProgressSlice only stores A1–B2; map Pre-A1 → 'A1'
  const storedLevel = assignedLevel === 'Pre-A1' ? 'A1' : assignedLevel;

  return { rawLevel, assignedLevel, storedLevel };
}

// ─────────────────────────────────────────────────────────────────────────────
// dropOneTier
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "Start Lower" escape hatch — drops the assigned level by one tier.
 *
 * B1     → A2
 * A2     → A1
 * A1     → A1  (floor — storedLevel can never be below A1)
 * Pre-A1 → Pre-A1 (absolute floor)
 *
 * A1 is treated as the effective floor because cefrProgressSlice maps
 * Pre-A1 → A1 anyway. Both A1 and Pre-A1 cannot drop further.
 *
 * @param {string} level — Current assigned level
 * @returns {string} One tier lower (or same if already at floor)
 */
export function dropOneTier(level) {
  const idx = PLACEMENT_CEFR_ORDER[level];
  // Pre-A1 (idx 0) and A1 (idx 1) are both floors
  if (idx === undefined || idx <= 1) return level;
  return PLACEMENT_LEVEL_ORDER[idx - 1];
}

// ─────────────────────────────────────────────────────────────────────────────
// shouldEarlyExit
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if the last 10 answers are all correct (early-exit threshold).
 *
 * @param {{ itemId: string, correct: boolean }[]} answers
 * @returns {boolean}
 */
export function shouldEarlyExit(answers) {
  if (!answers || answers.length < 10) return false;
  const last10 = answers.slice(-10);
  return last10.every((a) => a.correct === true);
}

// ─────────────────────────────────────────────────────────────────────────────
// deriveGrammarUnlocks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return lesson IDs to pre-unlock for a given CEFR level.
 *
 * Unlocks ALL lessons from order 1 up to the highest lesson at or below the
 * assigned CEFR level (contiguous unlock from the start — avoids gaps that
 * would break unlockNextLesson's sequential order-based chain).
 *
 * Note: grammar.js has no Pre-A1 cefrLevel lessons. If assignedLevel is
 * Pre-A1, this returns [].
 *
 * @param {string} assignedLevel — Assigned CEFR level ('Pre-A1'|'A1'|'A2'|'B1')
 * @returns {string[]} Sorted lesson IDs (by order field, ascending)
 */
export function deriveGrammarUnlocks(assignedLevel) {
  const assignedOrder = PLACEMENT_CEFR_ORDER[assignedLevel] ?? 0;

  return grammarLessons
    .filter((lesson) => {
      const lessonOrder = PLACEMENT_CEFR_ORDER[lesson.cefrLevel];
      // If the lesson's CEFR level is not in PLACEMENT_CEFR_ORDER (e.g. B2),
      // treat it as 99 (above any placement level) so it is excluded.
      if (lessonOrder === undefined) return false;
      return lessonOrder <= assignedOrder;
    })
    .sort((a, b) => a.order - b.order)
    .map((lesson) => lesson.id);
}

// ─────────────────────────────────────────────────────────────────────────────
// deriveSkillTreeUnlocks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return skill tree node IDs to pre-unlock for a given CEFR level.
 *
 * For each tree, selects nodes where node.cefrLevel <= assignedLevel,
 * sorted by xpCost ascending (mirrors the initializeSkillTree bootstrap pattern).
 *
 * Only trees with at least one eligible node are included in the result.
 *
 * @param {string} assignedLevel — Assigned CEFR level ('Pre-A1'|'A1'|'A2'|'B1')
 * @returns {{ [treeId: string]: string[] }} Map of treeId → eligible node IDs
 */
export function deriveSkillTreeUnlocks(assignedLevel) {
  const assignedOrder = PLACEMENT_CEFR_ORDER[assignedLevel] ?? 0;
  const result = {};

  for (const treeId of SKILL_TREE_ORDER) {
    const tree = SKILL_TREES[treeId];
    if (!tree || !tree.nodes) continue;

    const eligible = tree.nodes
      .filter((node) => {
        const nodeOrder = PLACEMENT_CEFR_ORDER[node.cefrLevel];
        if (nodeOrder === undefined) return false;
        return nodeOrder <= assignedOrder;
      })
      .sort((a, b) => a.xpCost - b.xpCost);

    if (eligible.length > 0) {
      result[treeId] = eligible.map((node) => node.id);
    }
  }

  return result;
}
