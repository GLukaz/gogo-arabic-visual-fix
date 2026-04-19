import { createSlice, createSelector } from '@reduxjs/toolkit';
import { FACTIONS, FACTION_BY_ID, getFactionTier } from '../../data/factions.js';
import { getAccumulatedFactionRewards } from '../../data/factionRewards.js';

/**
 * factionSlice.js — 6-faction alignment system
 *
 * Alignment points accumulate per faction via player choices, quests, and NPC interactions.
 * Primary faction   = highest alignment score  → full bonuses applied
 * Secondary faction = second highest score     → bonuses applied at 50% strength
 *
 * Bonuses stack multiplicatively:
 *   effectiveVocabXpMultiplier = 1 + (primary.vocabXpMultiplier - 1) + (secondary.vocabXpMultiplier - 1) * 0.5
 */

// Build initial alignment object from FACTIONS array — stays in sync if factions.js changes
const buildInitialAlignment = () =>
  Object.fromEntries(FACTIONS.map((f) => [f.id, 0]));

const deriveLeaders = (alignment) => {
  const sorted = [...Object.entries(alignment)].sort(([, a], [, b]) => b - a);
  const primary   = sorted[0]?.[1] > 0 ? sorted[0][0] : null;
  const secondary = sorted[1]?.[1] > 0 ? sorted[1][0] : null;
  return { primary, secondary };
};

const initialAlignment = buildInitialAlignment();
const { primary: initPrimary, secondary: initSecondary } = deriveLeaders(initialAlignment);

const initialState = {
  /** Raw alignment scores — { factionId: number } */
  alignment: initialAlignment,
  /** Faction ID with the highest alignment score (null if all scores are 0) */
  primaryFaction: initPrimary,
  /** Faction ID with the second highest alignment score (null if fewer than 2 factions have points) */
  secondaryFaction: initSecondary,
};

const factionSlice = createSlice({
  name: 'faction',
  initialState,
  reducers: {
    /**
     * adjustAlignment — add or subtract alignment points for one faction.
     * Automatically recalculates primaryFaction and secondaryFaction.
     *
     * @param {Object} payload
     * @param {string} payload.factionId — one of the FACTION_IDS values
     * @param {number} payload.amount    — positive to gain alignment, negative to lose it
     */
    adjustAlignment(state, action) {
      const { factionId, amount } = action.payload;

      if (!Object.prototype.hasOwnProperty.call(state.alignment, factionId)) {
        if (import.meta.env.DEV) {
          console.warn(
            `[factionSlice] Unknown factionId "${factionId}". Ignored. ` +
            `Valid IDs: ${Object.keys(state.alignment).join(', ')}`
          );
        }
        return;
      }

      // Alignment clamped 0-100 — floor is 0 (can't go negative), ceiling is 100 (max tier)
      state.alignment[factionId] = Math.max(0, Math.min(100, state.alignment[factionId] + amount));

      // Recalculate leaders
      const { primary, secondary } = deriveLeaders(state.alignment);
      state.primaryFaction   = primary;
      state.secondaryFaction = secondary;
    },

    /**
     * resetFactionAlignment — wipe all alignment scores back to zero.
     * Useful for new-game-plus or testing.
     */
    resetFactionAlignment() {
      return { ...initialState, alignment: buildInitialAlignment() };
    },
  },
});

export const { adjustAlignment, resetFactionAlignment } = factionSlice.actions;

// ========== BASE SELECTORS ==========

export const selectAlignment        = (state) => state.faction.alignment;
export const selectPrimaryFaction   = (state) => state.faction.primaryFaction;
export const selectSecondaryFaction = (state) => state.faction.secondaryFaction;

// ========== MEMOIZED SELECTORS ==========

/**
 * selectFactionRanks — all 6 factions sorted by alignment score (highest first).
 * Returns an array of { faction, score, rank } objects.
 */
export const selectFactionRanks = createSelector(
  [selectAlignment],
  (alignment) =>
    FACTIONS
      .map((faction) => ({
        faction,
        score: alignment[faction.id] ?? 0,
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
);

/**
 * selectFactionBonuses — computes effective XP multipliers AND tier-based rewards
 * the player currently receives from their primary + secondary faction alignment.
 *
 * Formula (XP multipliers):
 *   effectiveX = 1 + (primaryBonus - 1) + (secondaryBonus - 1) * 0.5
 *
 * Returns:
 *   { vocabXpMultiplier, questXpMultiplier, primaryFaction, secondaryFaction,
 *     shopDiscount, zoneAccess, exclusiveRecipes, xpMultiplier, primaryTierRewards }
 *
 * If no faction alignment exists, multipliers default to 1.0, arrays default to [].
 */
export const selectFactionBonuses = createSelector(
  [selectPrimaryFaction, selectSecondaryFaction, selectAlignment],
  (primaryId, secondaryId, alignment) => {
    const primary   = primaryId   ? FACTION_BY_ID[primaryId]   : null;
    const secondary = secondaryId ? FACTION_BY_ID[secondaryId] : null;

    const primaryVocab   = primary   ? primary.bonuses.vocabXpMultiplier   : 1.0;
    const primaryQuest   = primary   ? primary.bonuses.questXpMultiplier   : 1.0;
    const secondaryVocab = secondary ? secondary.bonuses.vocabXpMultiplier : 1.0;
    const secondaryQuest = secondary ? secondary.bonuses.questXpMultiplier : 1.0;

    // Tier-based rewards accumulated up to the player's current tier with each faction
    const primaryTierRewards   = primaryId   ? getAccumulatedFactionRewards(primaryId,   alignment[primaryId]   ?? 0) : [];
    const secondaryTierRewards = secondaryId ? getAccumulatedFactionRewards(secondaryId, alignment[secondaryId] ?? 0) : [];

    // Aggregate best shop discount (primary takes precedence, secondary if higher)
    const primaryDiscount   = primaryTierRewards.find((r) => r.type === 'shopDiscount')?.value   ?? 0;
    const secondaryDiscount = secondaryTierRewards.find((r) => r.type === 'shopDiscount')?.value ?? 0;
    const shopDiscount      = Math.max(primaryDiscount, secondaryDiscount * 0.5);

    // Zone access: union of primary + secondary zones
    const primaryZones   = primaryTierRewards.filter((r) => r.type === 'zoneAccess').flatMap((r) => r.value);
    const secondaryZones = secondaryTierRewards.filter((r) => r.type === 'zoneAccess').flatMap((r) => r.value);
    const zoneAccess     = [...new Set([...primaryZones, ...secondaryZones])];

    // Exclusive recipes: union of primary + secondary
    const primaryRecipes   = primaryTierRewards.filter((r) => r.type === 'exclusiveRecipes').flatMap((r) => r.value);
    const secondaryRecipes = secondaryTierRewards.filter((r) => r.type === 'exclusiveRecipes').flatMap((r) => r.value);
    const exclusiveRecipes = [...new Set([...primaryRecipes, ...secondaryRecipes])];

    // XP multiplier from tier rewards (in addition to faction base bonuses)
    const primaryXpTier   = primaryTierRewards.find((r) => r.type === 'xpMultiplier')?.value   ?? 1.0;
    const secondaryXpTier = secondaryTierRewards.find((r) => r.type === 'xpMultiplier')?.value ?? 1.0;
    const xpMultiplier    = Math.round(
      (1 + (primaryXpTier - 1) + (secondaryXpTier - 1) * 0.5) * 10000
    ) / 10000;

    return {
      vocabXpMultiplier: Math.round(
        (1 + (primaryVocab - 1) + (secondaryVocab - 1) * 0.5) * 10000
      ) / 10000,
      questXpMultiplier: Math.round(
        (1 + (primaryQuest - 1) + (secondaryQuest - 1) * 0.5) * 10000
      ) / 10000,
      primaryFaction:   primary   ?? null,
      secondaryFaction: secondary ?? null,
      shopDiscount,
      zoneAccess,
      exclusiveRecipes,
      xpMultiplier,
      primaryTierRewards,
    };
  }
);

/**
 * selectFactionAlignment — parameterized selector factory.
 * Returns the raw alignment score for a single faction.
 *
 * @param {string} factionId
 * @returns {(state: Object) => number}
 */
export const selectFactionAlignment = (factionId) => (state) =>
  state.faction.alignment[factionId] ?? 0;

/**
 * selectFactionTiers — memoized selector returning the tier label for each faction.
 * Returns { [factionId]: FactionTier } for all 6 factions.
 */
export const selectFactionTiers = createSelector(
  [selectAlignment],
  (alignment) =>
    Object.fromEntries(
      Object.entries(alignment).map(([factionId, score]) => [
        factionId,
        getFactionTier(score),
      ])
    )
);

export default factionSlice.reducer;
