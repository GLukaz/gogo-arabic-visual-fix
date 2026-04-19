/**
 * Root Magic Spell Discovery Engine
 *
 * Pure functions that determine when spells become available for discovery.
 *
 * A spell unlocks when ALL of the following are true:
 *   1. Root knowledge     — the root ID is in magic.discoveredRoots
 *   2. Morphological form — the grammar lesson for the spell's verb form is completed
 *   3. Elemental affinity — player has ≥ AFFINITY_THRESHOLD discovery choices for the element
 *   4. Spell chain        — for Form II+, the previous form of the same root must be unlocked
 *   5. Player level       — player.level ≥ spell.levelRequired (default 1)
 *
 * Prerequisite graph:
 *   Form I → Form II → Form III → ... → Form X (each requires the previous form unlocked)
 *   "Unlocked" means the form ID appears in magic.rootMastery[rootId].formsUnlocked
 */

import { createSelector } from '@reduxjs/toolkit';
import { SPELLS } from '../data/spellData.js';
import { SPELL_TIERS } from '../data/rootMagic.js';

// ── Constants ─────────────────────────────────────────────────────────────────

/** Minimum elemental affinity choices before a spell of that element is discoverable. */
export const AFFINITY_THRESHOLD = 1;

/**
 * Maps each verb form tier to the grammar lesson ID that teaches it.
 * A spell can only be discovered when the player has completed the relevant lesson.
 */
export const FORM_TO_GRAMMAR_LESSON = {
  I:    'basic-verb-conjugation',
  II:   'verb-forms-2-5',
  III:  'verb-forms-2-5',
  IV:   'verb-forms-2-5',
  V:    'verb-forms-2-5',
  VI:   'verb-forms-6-10',
  VII:  'verb-forms-6-10',
  VIII: 'verb-forms-6-10',
  IX:   'verb-forms-6-10',
  X:    'verb-forms-6-10',
};

/** Ordered form list (prerequisite chain). */
const FORM_ORDER = Object.keys(SPELL_TIERS); // ['I','II','III','IV','V','VI','VII','VIII','IX','X']

// ── Pure functions ─────────────────────────────────────────────────────────────

/**
 * Check whether a spell can be discovered given the current player state.
 *
 * @param {string} spellId - Spell ID from SPELLS
 * @param {Object} playerState - Redux state snapshot
 * @param {string[]}  playerState.magic.discoveredRoots
 * @param {{ [rootId]: { formsUnlocked: string[] } }} playerState.magic.rootMastery
 * @param {{ discoveryChoices: Array<{ element: string }> }} playerState.magic.affinity
 * @param {string[]}  playerState.grammar.completedLessons
 * @param {number}    playerState.player.level
 * @param {Array} [spellDefs] - Spell definitions (defaults to SPELLS)
 * @returns {boolean}
 */
export function canDiscoverSpell(spellId, playerState, spellDefs = SPELLS) {
  const spell = spellDefs.find((s) => s.id === spellId);
  if (!spell) return false;

  const magic    = playerState.magic   ?? {};
  const grammar  = playerState.grammar ?? {};
  const player   = playerState.player  ?? {};

  const discoveredRoots    = magic.discoveredRoots    ?? [];
  const rootMastery        = magic.rootMastery        ?? {};
  const discoveryChoices   = magic.affinity?.discoveryChoices ?? [];
  const completedLessons   = grammar.completedLessons ?? [];
  const playerLevel        = player.level             ?? 1;

  // 1. Root knowledge: root must be in magic.discoveredRoots
  if (!discoveredRoots.includes(spell.rootId)) return false;

  // 2. Morphological pattern mastery: required grammar lesson completed
  const requiredLesson = FORM_TO_GRAMMAR_LESSON[spell.form];
  if (requiredLesson && !completedLessons.includes(requiredLesson)) return false;

  // 3. Elemental affinity: at least AFFINITY_THRESHOLD choices for this element
  const affinityScore = discoveryChoices.filter((c) => c.element === spell.element).length;
  if (affinityScore < AFFINITY_THRESHOLD) return false;

  // 4. Spell chain prerequisite: Form N requires Form N-1 unlocked for same root
  const formIdx = FORM_ORDER.indexOf(spell.form);
  if (formIdx > 0) {
    const prevForm    = FORM_ORDER[formIdx - 1];
    const mastery     = rootMastery[spell.rootId];
    const formsUnlocked = mastery?.formsUnlocked ?? [];
    if (!formsUnlocked.includes(prevForm)) return false;
  }

  // 5. Player level requirement
  const levelRequired = spell.levelRequired ?? 1;
  if (playerLevel < levelRequired) return false;

  return true;
}

/**
 * Return all spells that can be discovered right now (not yet in discoveredRoots).
 *
 * Only returns spells whose rootId is NOT already discovered (to avoid re-discovery).
 * Use discoveredRoots to track spells that have already been unlocked.
 *
 * @param {Object} playerState - Redux state snapshot
 * @param {Array} [allSpells] - All spell definitions (defaults to SPELLS)
 * @returns {Object[]} Array of discoverable spell definitions
 */
export function getDiscoverableSpells(playerState, allSpells = SPELLS) {
  const discoveredRoots = playerState.magic?.discoveredRoots ?? [];

  // Collect root+form pairs already in magic.rootMastery.formsUnlocked to avoid re-discovering
  const rootMastery = playerState.magic?.rootMastery ?? {};
  const alreadyUnlocked = new Set();
  for (const [rootId, mastery] of Object.entries(rootMastery)) {
    for (const form of (mastery.formsUnlocked ?? [])) {
      alreadyUnlocked.add(`${rootId}|${form}`);
    }
  }

  return allSpells.filter((spell) => {
    // Skip if this form of this root is already unlocked
    if (alreadyUnlocked.has(`${spell.rootId}|${spell.form}`)) return false;
    return canDiscoverSpell(spell.id, playerState, allSpells);
  });
}

// ── Memoized Redux selector ───────────────────────────────────────────────────

/**
 * selectDiscoverableSpells — memoized selector returning discoverable spell definitions.
 * Recalculates when magic, grammar, or player state changes.
 */
export const selectDiscoverableSpells = createSelector(
  [
    (state) => state.magic    ?? {},
    (state) => state.grammar  ?? {},
    (state) => state.player   ?? {},
  ],
  (magic, grammar, player) => {
    const playerState = { magic, grammar, player };
    return getDiscoverableSpells(playerState);
  }
);
