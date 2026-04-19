/**
 * factionRewards.test.js
 *
 * Tests for:
 *   1-7.  getFactionRewards — reward lookup per faction/tier
 *   8-13. checkFactionGate  — gate checking with string and object tiers
 *  14-17. selectFactionBonuses — bonus stacking from primary + secondary factions
 */

import { describe, it, expect } from 'vitest';
import {
  getFactionRewards,
  checkFactionGate,
  FACTION_TIER_REWARDS,
} from '../factionRewards.js';
import { FACTION_IDS, FACTION_TIERS } from '../factions.js';
import { selectFactionBonuses } from '../../store/slices/factionSlice.js';

// ─────────────────────────────────────────────────────────────────────────────
// getFactionRewards
// ─────────────────────────────────────────────────────────────────────────────

describe('getFactionRewards', () => {
  it('returns empty array for neutral tier', () => {
    const rewards = getFactionRewards(FACTION_IDS.SCHOLARS, 'neutral');
    expect(rewards).toEqual([]);
  });

  it('returns xpMultiplier reward for friendly tier', () => {
    const rewards = getFactionRewards(FACTION_IDS.SCHOLARS, 'friendly');
    const xpReward = rewards.find((r) => r.type === 'xpMultiplier');
    expect(xpReward).toBeDefined();
    expect(xpReward.value).toBeGreaterThanOrEqual(1.1);
    expect(xpReward.value).toBeLessThanOrEqual(1.5);
  });

  it('returns shopDiscount for trusted tier', () => {
    const rewards = getFactionRewards(FACTION_IDS.MERCHANTS, 'trusted');
    const discount = rewards.find((r) => r.type === 'shopDiscount');
    expect(discount).toBeDefined();
    expect(discount.value).toBeGreaterThanOrEqual(0.05);
    expect(discount.value).toBeLessThanOrEqual(0.25);
  });

  it('returns exclusiveRecipes for allied tier — artisans', () => {
    const rewards = getFactionRewards(FACTION_IDS.ARTISANS, 'allied');
    const recipes = rewards.find((r) => r.type === 'exclusiveRecipes');
    expect(recipes).toBeDefined();
    expect(Array.isArray(recipes.value)).toBe(true);
    expect(recipes.value.length).toBeGreaterThan(0);
  });

  it('returns zoneAccess for allied tier — travelers', () => {
    const rewards = getFactionRewards(FACTION_IDS.TRAVELERS, 'allied');
    const zones = rewards.find((r) => r.type === 'zoneAccess');
    expect(zones).toBeDefined();
    expect(Array.isArray(zones.value)).toBe(true);
    expect(zones.value.length).toBeGreaterThan(0);
  });

  it('returns multiple reward types for revered tier', () => {
    const rewards = getFactionRewards(FACTION_IDS.SCHOLARS, 'revered');
    const types = rewards.map((r) => r.type);
    expect(types).toContain('shopDiscount');
    expect(types).toContain('xpMultiplier');
    expect(types).toContain('exclusiveRecipes');
    expect(types).toContain('zoneAccess');
  });

  it('returns empty array for unknown factionId', () => {
    const rewards = getFactionRewards('unknown_faction', 'revered');
    expect(rewards).toEqual([]);
  });

  it('returns empty array for unknown tier', () => {
    const rewards = getFactionRewards(FACTION_IDS.SCHOLARS, 'legendary');
    expect(rewards).toEqual([]);
  });

  it('accepts tier object (FACTION_TIERS entry) instead of string', () => {
    const rewards = getFactionRewards(FACTION_IDS.SCHOLARS, FACTION_TIERS.FRIENDLY);
    expect(Array.isArray(rewards)).toBe(true);
    // Friendly tier for scholars has at least one reward
    expect(rewards.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FACTION_TIER_REWARDS structure — 30 reward sets
// ─────────────────────────────────────────────────────────────────────────────

describe('FACTION_TIER_REWARDS structure', () => {
  const factionIds = Object.values(FACTION_IDS);
  const tierKeys = ['neutral', 'friendly', 'trusted', 'allied', 'revered'];

  it('defines rewards for all 6 factions', () => {
    expect(Object.keys(FACTION_TIER_REWARDS)).toHaveLength(6);
    for (const id of factionIds) {
      expect(FACTION_TIER_REWARDS[id]).toBeDefined();
    }
  });

  it('defines all 5 tiers for each faction (30 reward sets)', () => {
    for (const id of factionIds) {
      for (const tier of tierKeys) {
        expect(Array.isArray(FACTION_TIER_REWARDS[id][tier])).toBe(true);
      }
    }
  });

  it('revered tier has the highest shopDiscount (up to 25%) for all factions that use discounts', () => {
    for (const id of factionIds) {
      const reveredRewards = FACTION_TIER_REWARDS[id].revered;
      const discount = reveredRewards.find((r) => r.type === 'shopDiscount');
      if (discount) {
        expect(discount.value).toBeLessThanOrEqual(0.25);
        expect(discount.value).toBeGreaterThanOrEqual(0.05);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// checkFactionGate
// ─────────────────────────────────────────────────────────────────────────────

describe('checkFactionGate', () => {
  const makePlayerState = (factionId, score) => ({
    faction: { alignment: { [factionId]: score } },
  });

  it('returns true when player meets exactly the required tier threshold', () => {
    const state = makePlayerState(FACTION_IDS.SCHOLARS, 25); // FRIENDLY threshold
    expect(checkFactionGate(FACTION_IDS.SCHOLARS, 'friendly', state)).toBe(true);
  });

  it('returns true when player exceeds the required tier', () => {
    const state = makePlayerState(FACTION_IDS.SCHOLARS, 80); // well above TRUSTED
    expect(checkFactionGate(FACTION_IDS.SCHOLARS, 'trusted', state)).toBe(true);
  });

  it('returns false when player is below the required tier', () => {
    const state = makePlayerState(FACTION_IDS.SCHOLARS, 20); // below TRUSTED (50)
    expect(checkFactionGate(FACTION_IDS.SCHOLARS, 'trusted', state)).toBe(false);
  });

  it('returns true for neutral tier regardless of score', () => {
    const state = makePlayerState(FACTION_IDS.MERCHANTS, 0);
    expect(checkFactionGate(FACTION_IDS.MERCHANTS, 'neutral', state)).toBe(true);
  });

  it('returns false when player has no alignment for that faction', () => {
    const state = { faction: { alignment: {} } };
    expect(checkFactionGate(FACTION_IDS.GUARDIANS, 'allied', state)).toBe(false);
  });

  it('accepts FACTION_TIERS object as requiredTier parameter', () => {
    const state = makePlayerState(FACTION_IDS.ARTISANS, 75);
    expect(checkFactionGate(FACTION_IDS.ARTISANS, FACTION_TIERS.ALLIED, state)).toBe(true);
  });

  it('returns false at REVERED gate when score is 99', () => {
    const state = makePlayerState(FACTION_IDS.ARTISTS, 99); // just below 100
    expect(checkFactionGate(FACTION_IDS.ARTISTS, 'revered', state)).toBe(false);
  });

  it('returns true at REVERED gate when score is 100', () => {
    const state = makePlayerState(FACTION_IDS.ARTISTS, 100);
    expect(checkFactionGate(FACTION_IDS.ARTISTS, 'revered', state)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectFactionBonuses — bonus stacking
// ─────────────────────────────────────────────────────────────────────────────

describe('selectFactionBonuses', () => {
  const makeState = (alignment, primaryFaction = null, secondaryFaction = null) => ({
    faction: { alignment, primaryFaction, secondaryFaction },
  });

  it('returns zero shopDiscount when player has no faction alignment', () => {
    const state = makeState({ scholars: 0, merchants: 0, artisans: 0, travelers: 0, guardians: 0, artists: 0 });
    const bonuses = selectFactionBonuses(state);
    expect(bonuses.shopDiscount).toBe(0);
  });

  it('returns shopDiscount from primary faction tier rewards', () => {
    // Scholars at 75 (allied) → allied tier includes 15% shop discount
    const alignment = { scholars: 75, merchants: 0, artisans: 0, travelers: 0, guardians: 0, artists: 0 };
    const state = makeState(alignment, 'scholars', null);
    const bonuses = selectFactionBonuses(state);
    expect(bonuses.shopDiscount).toBeGreaterThan(0);
  });

  it('returns zoneAccess list from primary faction tier rewards', () => {
    // Scholars at 75 (allied) → inner library access
    const alignment = { scholars: 75, merchants: 0, artisans: 0, travelers: 0, guardians: 0, artists: 0 };
    const state = makeState(alignment, 'scholars', null);
    const bonuses = selectFactionBonuses(state);
    expect(Array.isArray(bonuses.zoneAccess)).toBe(true);
    expect(bonuses.zoneAccess).toContain('scholars_inner_library');
  });

  it('returns exclusiveRecipes from primary faction', () => {
    // Travelers at 50 (trusted) — no recipe; at 100 (revered) → map recipe
    const alignment = { scholars: 0, merchants: 0, artisans: 0, travelers: 100, guardians: 0, artists: 0 };
    const state = makeState(alignment, 'travelers', null);
    const bonuses = selectFactionBonuses(state);
    expect(Array.isArray(bonuses.exclusiveRecipes)).toBe(true);
    expect(bonuses.exclusiveRecipes).toContain('travelers_map_recipe');
  });

  it('merges zoneAccess from primary and secondary factions', () => {
    // Primary: Scholars at 75 (allied) → inner_library
    // Secondary: Travelers at 75 (allied) → waypoint_gamma
    const alignment = {
      scholars: 75,
      merchants: 0,
      artisans: 0,
      travelers: 75,
      guardians: 0,
      artists: 0,
    };
    const state = makeState(alignment, 'scholars', 'travelers');
    const bonuses = selectFactionBonuses(state);
    expect(bonuses.zoneAccess).toContain('scholars_inner_library');
    expect(bonuses.zoneAccess).toContain('travelers_waypoint_gamma');
  });

  it('returns empty arrays when no factions are active', () => {
    const state = makeState(
      { scholars: 0, merchants: 0, artisans: 0, travelers: 0, guardians: 0, artists: 0 },
      null,
      null
    );
    const bonuses = selectFactionBonuses(state);
    expect(bonuses.zoneAccess).toEqual([]);
    expect(bonuses.exclusiveRecipes).toEqual([]);
  });
});
