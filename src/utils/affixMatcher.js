/**
 * affixMatcher.js — Vocabulary-gated affix bonus logic (Phase 29)
 *
 * Determines affix bonus multipliers based on whether the player has learned the Arabic word.
 * - Unlearned or learning: 50% bonus (0.5 multiplier)
 * - Fully learned (Review state): 100% bonus (1.0 multiplier)
 */

/**
 * Get the affix bonus multiplier based on vocabulary learning state
 * @param {string} wordId - The affix word ID
 * @param {Object} vocabularyState - The vocabulary slice state
 * @returns {number} Multiplier: 0.5 (unlearned/learning) or 1.0 (learned)
 */
export function getAffixMultiplier(wordId, vocabularyState) {
  // Check if wordId exists in FSRS cards
  const card = vocabularyState.fsrsCards?.[wordId];

  if (!card) {
    // Word not in vocabulary yet (undiscovered)
    return 0.5;
  }

  // Check if card is in Review state (fully learned)
  if (card.state === 'Review') {
    return 1.0;
  }

  // Card exists but still in learning phase (New, Learning, Relearning)
  return 0.5;
}

/**
 * Get list of affix wordIds from an item that the player hasn't fully learned
 * @param {string} itemId - The equipment item ID
 * @param {Object} vocabularyState - The vocabulary slice state
 * @returns {Array} Array of unlearned affix wordIds
 */
export function getUnlearnedAffixes(_itemId, _vocabularyState) {
  // Note: This function requires EQUIPMENT_DATA import, which would create
  // a circular dependency if imported here. Instead, it's intended to be
  // called from components that already have access to both.
  //
  // For now, return empty array. Actual implementation will be in the component layer.
  return [];
}
