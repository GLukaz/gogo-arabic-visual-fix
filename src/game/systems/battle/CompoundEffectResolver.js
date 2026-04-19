/**
 * CompoundEffectResolver — Detects and resolves compound status effects (Phase 32)
 *
 * Pure static utility class with no store or scene dependency.
 * Checks active effect arrays for component pairs that form compound effects.
 *
 * @see src/data/statusEffects.js for compound effect definitions
 */

import { COMPOUND_EFFECTS, detectCompoundEffect } from '../../../data/statusEffects';

export class CompoundEffectResolver {
  /**
   * Check if any compound effect can be formed from active effects.
   * Returns the first matching compound or null.
   *
   * @param {Array<{id: string, remainingTurns: number}>} activeEffects
   * @returns {{ id: string, shouldReplace: string[], components: string[], arabic: string, effect: Object, turns: number }|null}
   */
  static checkForCompounds(activeEffects) {
    if (!activeEffects || activeEffects.length < 2) {
      return null;
    }

    return detectCompoundEffect(activeEffects);
  }

  /**
   * Resolve compound effects: replace component effects with compound effect.
   * Preserves non-component effects. Returns a new array (does not mutate input).
   *
   * @param {Array<{id: string, remainingTurns: number}>} activeEffects
   * @returns {Array<{id: string, remainingTurns: number}>}
   */
  static resolveCompounds(activeEffects) {
    if (!activeEffects || activeEffects.length === 0) {
      return [];
    }

    const compound = CompoundEffectResolver.checkForCompounds(activeEffects);

    if (!compound) {
      return activeEffects;
    }

    const replaceSet = new Set(compound.shouldReplace);

    // Filter out component effects
    const remaining = activeEffects.filter((e) => !replaceSet.has(e.id));

    // Add compound effect
    remaining.push({
      id: compound.id,
      remainingTurns: compound.turns,
      ...compound.effect,
    });

    return remaining;
  }

  /**
   * Get the Arabic name for a compound effect.
   *
   * @param {string} compoundId
   * @returns {string|null}
   */
  static getCompoundArabic(compoundId) {
    const compound = COMPOUND_EFFECTS[compoundId];
    return compound ? compound.arabic : null;
  }
}
