/**
 * companionRelationship.js — Relationship tier mapping and gift bonus calculation
 *
 * Maps 0-100 relationship scores to 5 named tiers with battle bonuses.
 */

import { GIFT_CATEGORIES } from '../data/companions.js';

export const RELATIONSHIP_TIERS = Object.freeze({
  stranger: {
    min: 0,
    max: 19,
    label: 'Stranger',
    labelArabic: 'غريب',
    battleBonus: 0,
  },
  acquaintance: {
    min: 20,
    max: 39,
    label: 'Acquaintance',
    labelArabic: 'معرفة',
    battleBonus: 0.05,
  },
  friend: {
    min: 40,
    max: 59,
    label: 'Friend',
    labelArabic: 'صديق',
    battleBonus: 0.10,
  },
  closeFriend: {
    min: 60,
    max: 79,
    label: 'Close Friend',
    labelArabic: 'صديق مقرب',
    battleBonus: 0.15,
  },
  bestFriend: {
    min: 80,
    max: 100,
    label: 'Best Friend',
    labelArabic: 'أعز صديق',
    battleBonus: 0.20,
  },
});

/**
 * Get relationship tier based on 0-100 relationship value.
 * @param {number} relationshipValue - 0-100
 * @returns {object} Matching tier object from RELATIONSHIP_TIERS
 */
export function getRelationshipTier(relationshipValue) {
  const tiers = Object.values(RELATIONSHIP_TIERS);
  const tier = tiers.find(t => relationshipValue >= t.min && relationshipValue <= t.max);
  return tier || RELATIONSHIP_TIERS.stranger;
}

/**
 * Calculate relationship gain from a gift.
 * @param {string} giftCategory - 'books' | 'food' | 'crafts' | 'gems' | 'scrolls' | 'flowers'
 * @param {string[]} companionPreferredGifts - Array of preferred gift categories
 * @returns {number} Relationship gain (integer)
 */
export function getGiftBonus(giftCategory, companionPreferredGifts) {
  const category = GIFT_CATEGORIES[giftCategory];
  if (!category) {
    console.warn(`[companionRelationship] Unknown gift category '${giftCategory}'`);
    return 0;
  }

  let gain = category.baseGain;

  // If gift is preferred, multiply by 1.5
  if (companionPreferredGifts.includes(giftCategory)) {
    gain *= 1.5;
  }

  return Math.floor(gain);
}

/**
 * Get battle damage/heal multiplier based on relationship.
 * @param {number} relationshipValue - 0-100
 * @returns {number} Multiplier (1.0 - 1.20)
 */
export function getRelationshipMultiplier(relationshipValue) {
  const tier = getRelationshipTier(relationshipValue);
  return 1.0 + tier.battleBonus;
}
