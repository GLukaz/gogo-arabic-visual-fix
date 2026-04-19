/**
 * factionRewards.js — Faction tier reward definitions and gate-checking utilities
 *
 * Each faction has 5 tiers (neutral → friendly → trusted → allied → revered).
 * Higher tiers unlock progressively stronger rewards.
 *
 * Reward types:
 *   shopDiscount     — fraction off shop prices (0.05 = 5% off)
 *   exclusiveRecipes — array of recipe IDs unlocked for crafting
 *   xpMultiplier     — additional XP multiplier (1.1 = +10%)
 *   zoneAccess       — array of zone IDs the player may now enter
 */

import { FACTION_IDS, FACTION_TIERS, getFactionTier } from './factions.js';

/**
 * XP multiplier ranges: 1.1 (friendly) → 1.5 (revered)
 * Shop discount ranges: 5% (trusted) → 25% (revered)
 *
 * 30 reward sets: 6 factions × 5 tiers
 */
export const FACTION_TIER_REWARDS = Object.freeze({

  // ─── SCHOLARS ──────────────────────────────────────────────────────────────
  [FACTION_IDS.SCHOLARS]: {
    neutral: [],
    friendly: [
      { type: 'xpMultiplier', value: 1.1, description: 'Scholar Friendly: +10% XP' },
    ],
    trusted: [
      { type: 'shopDiscount',     value: 0.05,                              description: '5% Library Shop Discount' },
      { type: 'exclusiveRecipes', value: ['scholar_ink_recipe'],             description: 'Scholar Ink Recipe' },
    ],
    allied: [
      { type: 'shopDiscount',  value: 0.15,                        description: '15% Library Shop Discount' },
      { type: 'xpMultiplier',  value: 1.3,                         description: 'Scholar Allied: +30% XP' },
      { type: 'zoneAccess',    value: ['scholars_inner_library'],   description: 'Inner Library Access' },
    ],
    revered: [
      { type: 'shopDiscount',     value: 0.25,                                              description: '25% Library Shop Discount' },
      { type: 'xpMultiplier',     value: 1.5,                                               description: 'Scholar Revered: +50% XP' },
      { type: 'exclusiveRecipes', value: ['scholar_tome_recipe', 'scholar_codex_recipe'],   description: 'Master Scholar Recipes' },
      { type: 'zoneAccess',       value: ['scholars_inner_library', 'scholars_archive'],    description: 'Scholar Archive Access' },
    ],
  },

  // ─── MERCHANTS ─────────────────────────────────────────────────────────────
  [FACTION_IDS.MERCHANTS]: {
    neutral: [],
    friendly: [
      { type: 'shopDiscount', value: 0.05, description: '5% Merchant Shop Discount' },
    ],
    trusted: [
      { type: 'shopDiscount', value: 0.10,  description: '10% Merchant Shop Discount' },
      { type: 'xpMultiplier', value: 1.1,   description: 'Merchant Trusted: +10% XP' },
    ],
    allied: [
      { type: 'shopDiscount',     value: 0.20,                                description: '20% Merchant Shop Discount' },
      { type: 'exclusiveRecipes', value: ['merchant_special_blend_recipe'],   description: 'Special Blend Recipe' },
      { type: 'zoneAccess',       value: ['merchant_vault'],                  description: 'Merchant Vault Access' },
    ],
    revered: [
      { type: 'shopDiscount',     value: 0.25,                                               description: '25% Merchant Shop Discount' },
      { type: 'xpMultiplier',     value: 1.4,                                                description: 'Merchant Revered: +40% XP' },
      { type: 'exclusiveRecipes', value: ['merchant_gold_formula', 'merchant_silk_recipe'],  description: 'Master Merchant Recipes' },
      { type: 'zoneAccess',       value: ['merchant_vault', 'merchant_secret_route'],        description: 'Secret Trade Route Access' },
    ],
  },

  // ─── ARTISANS ──────────────────────────────────────────────────────────────
  [FACTION_IDS.ARTISANS]: {
    neutral: [],
    friendly: [
      { type: 'exclusiveRecipes', value: ['artisan_basic_tools_recipe'], description: 'Basic Tools Recipe' },
    ],
    trusted: [
      { type: 'shopDiscount',     value: 0.05,                                      description: '5% Workshop Discount' },
      { type: 'exclusiveRecipes', value: ['artisan_intermediate_tools_recipe'],     description: 'Intermediate Tools Recipe' },
      { type: 'xpMultiplier',     value: 1.1,                                       description: 'Artisan Trusted: +10% XP' },
    ],
    allied: [
      { type: 'shopDiscount',     value: 0.15,                              description: '15% Workshop Discount' },
      { type: 'exclusiveRecipes', value: ['artisan_master_tools_recipe'],   description: 'Master Tools Recipe' },
      { type: 'zoneAccess',       value: ['artisan_forge_room'],            description: 'Master Forge Access' },
    ],
    revered: [
      { type: 'shopDiscount',     value: 0.25,                                                          description: '25% Workshop Discount' },
      { type: 'xpMultiplier',     value: 1.5,                                                           description: 'Artisan Revered: +50% XP' },
      { type: 'exclusiveRecipes', value: ['artisan_legendary_tools_recipe', 'artisan_masterwork_recipe'], description: 'Legendary Artisan Recipes' },
      { type: 'zoneAccess',       value: ['artisan_forge_room', 'artisan_masters_hall'],                description: 'Masters Hall Access' },
    ],
  },

  // ─── TRAVELERS ─────────────────────────────────────────────────────────────
  [FACTION_IDS.TRAVELERS]: {
    neutral: [],
    friendly: [
      { type: 'zoneAccess', value: ['travelers_waypoint_alpha'], description: 'Alpha Waypoint Access' },
    ],
    trusted: [
      { type: 'xpMultiplier', value: 1.1,                         description: 'Traveler Trusted: +10% XP' },
      { type: 'zoneAccess',   value: ['travelers_waypoint_beta'], description: 'Beta Waypoint Access' },
    ],
    allied: [
      { type: 'shopDiscount', value: 0.10,                          description: '10% Caravan Shop Discount' },
      { type: 'xpMultiplier', value: 1.3,                           description: 'Traveler Allied: +30% XP' },
      { type: 'zoneAccess',   value: ['travelers_waypoint_gamma'],  description: 'Gamma Waypoint Access' },
    ],
    revered: [
      { type: 'shopDiscount',     value: 0.20,                           description: '20% Caravan Shop Discount' },
      { type: 'xpMultiplier',     value: 1.5,                            description: 'Traveler Revered: +50% XP' },
      { type: 'exclusiveRecipes', value: ['travelers_map_recipe'],       description: 'Ancient Map Recipe' },
      { type: 'zoneAccess',       value: ['travelers_secret_oasis'],     description: 'Secret Oasis Access' },
    ],
  },

  // ─── GUARDIANS ─────────────────────────────────────────────────────────────
  [FACTION_IDS.GUARDIANS]: {
    neutral: [],
    friendly: [
      { type: 'xpMultiplier', value: 1.1, description: 'Guardian Friendly: +10% XP' },
    ],
    trusted: [
      { type: 'shopDiscount', value: 0.05,                           description: '5% Armory Discount' },
      { type: 'xpMultiplier', value: 1.2,                            description: 'Guardian Trusted: +20% XP' },
      { type: 'zoneAccess',   value: ['guardians_training_grounds'], description: 'Training Grounds Access' },
    ],
    allied: [
      { type: 'shopDiscount',     value: 0.15,                         description: '15% Armory Discount' },
      { type: 'xpMultiplier',     value: 1.3,                          description: 'Guardian Allied: +30% XP' },
      { type: 'exclusiveRecipes', value: ['guardians_armor_recipe'],   description: 'Guardian Armor Recipe' },
    ],
    revered: [
      { type: 'shopDiscount',     value: 0.25,                                                              description: '25% Armory Discount' },
      { type: 'xpMultiplier',     value: 1.5,                                                              description: 'Guardian Revered: +50% XP' },
      { type: 'exclusiveRecipes', value: ['guardians_legendary_armor_recipe', 'guardians_shield_recipe'],  description: 'Legendary Guardian Recipes' },
      { type: 'zoneAccess',       value: ['guardians_training_grounds', 'guardians_war_room'],             description: 'War Room Access' },
    ],
  },

  // ─── ARTISTS ───────────────────────────────────────────────────────────────
  [FACTION_IDS.ARTISTS]: {
    neutral: [],
    friendly: [
      { type: 'xpMultiplier', value: 1.1, description: 'Artist Friendly: +10% XP' },
    ],
    trusted: [
      { type: 'shopDiscount',     value: 0.05,                          description: '5% Artisan Market Discount' },
      { type: 'exclusiveRecipes', value: ['artists_instrument_recipe'], description: 'Instrument Recipe' },
    ],
    allied: [
      { type: 'shopDiscount', value: 0.15,                            description: '15% Artisan Market Discount' },
      { type: 'xpMultiplier', value: 1.35,                            description: 'Artist Allied: +35% XP' },
      { type: 'zoneAccess',   value: ['artists_moonlit_courtyard'],   description: 'Moonlit Courtyard Access' },
    ],
    revered: [
      { type: 'shopDiscount',     value: 0.25,                                                              description: '25% Artisan Market Discount' },
      { type: 'xpMultiplier',     value: 1.5,                                                              description: 'Artist Revered: +50% XP' },
      { type: 'exclusiveRecipes', value: ['artists_masterpiece_recipe', 'artists_golden_verse_recipe'],    description: 'Master Artist Recipes' },
      { type: 'zoneAccess',       value: ['artists_moonlit_courtyard', 'artists_inner_sanctum'],           description: 'Inner Sanctum Access' },
    ],
  },
});

/**
 * Return the reward array for a specific faction at a specific tier.
 * Tier may be passed as a lowercase label string ('neutral', 'friendly', 'trusted', 'allied', 'revered')
 * or as a FACTION_TIERS object (whose .label is used, lowercased).
 *
 * Returns [] for unknown faction/tier combinations — never throws.
 *
 * @param {string} factionId
 * @param {string|Object} tier — tier label string or FACTION_TIERS entry object
 * @returns {Array<{type: string, value: *, description: string}>}
 */
export function getFactionRewards(factionId, tier) {
  const tierKey = typeof tier === 'string'
    ? tier.toLowerCase()
    : (tier?.label ?? '').toLowerCase();
  return FACTION_TIER_REWARDS[factionId]?.[tierKey] ?? [];
}

/**
 * Return ALL rewards earned up to and including the player's current tier.
 * Aggregates rewards from all tiers up to (and including) the current one.
 *
 * @param {string} factionId
 * @param {number} alignmentScore — raw alignment score (0-100)
 * @returns {Array<{type: string, value: *, description: string}>}
 */
export function getAccumulatedFactionRewards(factionId, alignmentScore) {
  const currentTier = getFactionTier(alignmentScore);
  const tierOrder = ['neutral', 'friendly', 'trusted', 'allied', 'revered'];
  const currentIndex = tierOrder.indexOf(currentTier.label.toLowerCase());

  const allRewards = [];
  for (let i = 0; i <= currentIndex; i++) {
    const rewards = getFactionRewards(factionId, tierOrder[i]);
    allRewards.push(...rewards);
  }
  return allRewards;
}

/**
 * Check whether the player meets the faction gate requirement.
 *
 * @param {string} factionId          — faction to check
 * @param {string|Object} requiredTier — minimum tier required (string label or FACTION_TIERS object)
 * @param {Object} playerState        — full Redux state (needs state.faction.alignment)
 * @returns {boolean}
 */
export function checkFactionGate(factionId, requiredTier, playerState) {
  const alignmentScore = playerState?.faction?.alignment?.[factionId] ?? 0;
  const currentTierObj = getFactionTier(alignmentScore);

  // Resolve required threshold from string or object
  let requiredThreshold;
  if (typeof requiredTier === 'string') {
    const tierKey = requiredTier.toUpperCase();
    requiredThreshold = FACTION_TIERS[tierKey]?.threshold ?? 0;
  } else if (requiredTier && typeof requiredTier.threshold === 'number') {
    requiredThreshold = requiredTier.threshold;
  } else {
    requiredThreshold = 0;
  }

  return currentTierObj.threshold >= requiredThreshold;
}
