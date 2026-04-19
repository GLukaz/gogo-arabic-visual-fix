/**
 * recipeDiscovery.test.js
 *
 * Tests for:
 *  1-13. getDiscoverableRecipes — npcFriendship, questReward, filtering
 * 14-19. experimentWithIngredients — category matching
 * 20-24. discoverRecipe reducer — state tracking
 * 25-28. selectUndiscoveredRecipeCount — selector
 */

import { describe, it, expect } from 'vitest';
import {
  DISCOVERY_METHODS,
  RECIPE_DISCOVERY_METHODS,
  getDiscoverableRecipes,
  experimentWithIngredients,
} from '../recipeDiscovery.js';
import { RECIPES } from '../recipes.js';
import craftingReducer, {
  discoverRecipe,
  selectUndiscoveredRecipeCount,
} from '../../store/slices/craftingSlice.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makePlayerState({
  npcFriendship = {},
  quests = {},
  discoveredRecipes = [],
} = {}) {
  return {
    npc: { friendship: npcFriendship },
    quests: { quests },
    crafting: { discoveredRecipes },
  };
}

// Minimal crafting state for reducer/selector tests
const initialCraftingState = {
  professions: {},
  resources: [],
  discoveredRecipes: [],
  discoveredRecipeLog: {},
  gatheringCooldowns: {},
};

function makeReduxState(discoveredRecipes = []) {
  return { crafting: { ...initialCraftingState, discoveredRecipes } };
}

// IDs of all calligrapher-discoverable recipes
const calligrapherDiscoverableIds = Object.entries(RECIPE_DISCOVERY_METHODS)
  .filter(([recipeId]) => RECIPES[recipeId]?.professionId === 'calligrapher')
  .map(([recipeId]) => recipeId);

const cookDiscoverableIds = Object.entries(RECIPE_DISCOVERY_METHODS)
  .filter(([recipeId]) => RECIPES[recipeId]?.professionId === 'cook')
  .map(([recipeId]) => recipeId);

// ─────────────────────────────────────────────────────────────────────────────
// getDiscoverableRecipes — NPC Friendship
// ─────────────────────────────────────────────────────────────────────────────

describe('getDiscoverableRecipes — npcFriendship', () => {
  it('returns calligrapher recipe when calligraphy_master friendship >= 50', () => {
    const state = makePlayerState({ npcFriendship: { calligraphy_master: 50 } });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).toContain('calligraphy_colored_scroll');
  });

  it('does not return calligrapher recipe when friendship below threshold', () => {
    const state = makePlayerState({ npcFriendship: { calligraphy_master: 30 } });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).not.toContain('calligraphy_colored_scroll');
  });

  it('respects tiered thresholds — only returns recipes up to current friendship', () => {
    const state = makePlayerState({ npcFriendship: { calligraphy_master: 60 } });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).toContain('calligraphy_colored_scroll');   // min 50
    expect(ids).toContain('calligraphy_silver_scroll');    // min 60
    expect(ids).not.toContain('calligraphy_illuminated_page'); // min 70
    expect(ids).not.toContain('calligraphy_talisman');         // min 80
  });

  it('returns cook NPC recipes when tavern_keeper friendship >= 50', () => {
    const state = makePlayerState({ npcFriendship: { tavern_keeper: 55 } });
    const ids = getDiscoverableRecipes('cook', state).map((r) => r.recipeId);
    expect(ids).toContain('cook_rose_sherbet');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getDiscoverableRecipes — Quest Reward
// ─────────────────────────────────────────────────────────────────────────────

describe('getDiscoverableRecipes — questReward', () => {
  it('returns recipe when quest status is completed', () => {
    const state = makePlayerState({
      quests: { library_numbers: { status: 'completed', rewardClaimed: false } },
    });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).toContain('calligraphy_wisdom_book');
  });

  it('returns recipe when quest rewardClaimed is true', () => {
    const state = makePlayerState({
      quests: { library_numbers: { status: 'active', rewardClaimed: true } },
    });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).toContain('calligraphy_wisdom_book');
  });

  it('does not return recipe when quest is active and not claimed', () => {
    const state = makePlayerState({
      quests: { library_numbers: { status: 'active', rewardClaimed: false } },
    });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).not.toContain('calligraphy_wisdom_book');
  });

  it('does not return recipe when quest entry is missing', () => {
    const state = makePlayerState({ quests: {} });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).not.toContain('calligraphy_wisdom_book');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getDiscoverableRecipes — Filtering
// ─────────────────────────────────────────────────────────────────────────────

describe('getDiscoverableRecipes — filtering', () => {
  it('does not return cook recipes when querying calligrapher profession', () => {
    const state = makePlayerState({ npcFriendship: { tavern_keeper: 100 } });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids.every((id) => id.startsWith('calligraphy'))).toBe(true);
  });

  it('excludes already discovered recipes', () => {
    const state = makePlayerState({
      npcFriendship: { calligraphy_master: 100 },
      discoveredRecipes: ['calligraphy_colored_scroll'],
    });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).not.toContain('calligraphy_colored_scroll');
  });

  it('excludes experimentation recipes (require explicit experiment call)', () => {
    const state = makePlayerState({ npcFriendship: { calligraphy_master: 100 } });
    const ids = getDiscoverableRecipes('calligrapher', state).map((r) => r.recipeId);
    expect(ids).not.toContain('calligraphy_letter');
  });

  it('returns empty array when no conditions are met', () => {
    const state = makePlayerState();
    expect(getDiscoverableRecipes('calligrapher', state)).toEqual([]);
  });

  it('result objects include recipeId, recipe, and discoveryConfig', () => {
    const state = makePlayerState({ npcFriendship: { calligraphy_master: 50 } });
    const results = getDiscoverableRecipes('calligrapher', state);
    const match = results.find((r) => r.recipeId === 'calligraphy_colored_scroll');
    expect(match).toBeDefined();
    expect(match.recipe.professionId).toBe('calligrapher');
    expect(match.discoveryConfig.method).toBe(DISCOVERY_METHODS.NPC_FRIENDSHIP);
    expect(match.discoveryConfig.npcId).toBe('calligraphy_master');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// experimentWithIngredients
// ─────────────────────────────────────────────────────────────────────────────

describe('experimentWithIngredients', () => {
  it('returns calligraphy_letter for 3 special-category ingredients', () => {
    // paper(special) + ink_black(special) + wax_seal(special)
    const result = experimentWithIngredients('paper', 'ink_black', 'wax_seal');
    expect(result).not.toBeNull();
    expect(result.recipeId).toBe('calligraphy_letter');
    expect(result.recipe).toBeDefined();
  });

  it('is order-independent — any permutation of matching categories works', () => {
    const r1 = experimentWithIngredients('paper', 'ink_black', 'wax_seal');
    const r2 = experimentWithIngredients('wax_seal', 'paper', 'ink_black');
    const r3 = experimentWithIngredients('ink_black', 'wax_seal', 'paper');
    expect(r1?.recipeId).toBe('calligraphy_letter');
    expect(r2?.recipeId).toBe('calligraphy_letter');
    expect(r3?.recipeId).toBe('calligraphy_letter');
  });

  it('matches cook_saffron_rice for animal+plant+plant categories', () => {
    // rice(plant) + saffron(plant) + butter(animal)
    const result = experimentWithIngredients('rice', 'saffron', 'butter');
    expect(result).not.toBeNull();
    expect(result.recipeId).toBe('cook_saffron_rice');
  });

  it('matches same recipe using different resources of the same categories', () => {
    // flour(plant) + cumin(plant) + honey(animal) → animal+plant+plant same as saffron_rice
    const result = experimentWithIngredients('flour', 'cumin', 'honey');
    expect(result).not.toBeNull();
    expect(result.recipeId).toBe('cook_saffron_rice');
  });

  it('returns null for unrecognized category combination', () => {
    // ink_gold(mineral) + ink_silver(mineral) + honey(animal) → no recipe with mineral+mineral+animal
    const result = experimentWithIngredients('ink_gold', 'ink_silver', 'honey');
    expect(result).toBeNull();
  });

  it('returns null when all ingredient IDs are unknown', () => {
    const result = experimentWithIngredients('ghost_a', 'ghost_b', 'ghost_c');
    expect(result).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// discoverRecipe reducer
// ─────────────────────────────────────────────────────────────────────────────

describe('discoverRecipe reducer', () => {
  it('adds recipeId to discoveredRecipes', () => {
    const state = craftingReducer(
      initialCraftingState,
      discoverRecipe({ professionId: 'calligrapher', recipeId: 'calligraphy_letter', method: 'experimentation' })
    );
    expect(state.discoveredRecipes).toContain('calligraphy_letter');
  });

  it('records method and professionId in discoveredRecipeLog', () => {
    const state = craftingReducer(
      initialCraftingState,
      discoverRecipe({ professionId: 'calligrapher', recipeId: 'calligraphy_letter', method: 'experimentation' })
    );
    const log = state.discoveredRecipeLog['calligraphy_letter'];
    expect(log).toBeDefined();
    expect(log.method).toBe('experimentation');
    expect(log.professionId).toBe('calligrapher');
    expect(typeof log.discoveredAt).toBe('number');
  });

  it('is idempotent — does not duplicate entries in discoveredRecipes', () => {
    let state = craftingReducer(
      initialCraftingState,
      discoverRecipe({ professionId: 'calligrapher', recipeId: 'calligraphy_letter', method: 'experimentation' })
    );
    state = craftingReducer(
      state,
      discoverRecipe({ professionId: 'calligrapher', recipeId: 'calligraphy_letter', method: 'experimentation' })
    );
    const count = state.discoveredRecipes.filter((id) => id === 'calligraphy_letter').length;
    expect(count).toBe(1);
  });

  it('does not overwrite existing log entry on duplicate discover call', () => {
    let state = craftingReducer(
      initialCraftingState,
      discoverRecipe({ professionId: 'calligrapher', recipeId: 'calligraphy_letter', method: 'experimentation' })
    );
    const originalAt = state.discoveredRecipeLog['calligraphy_letter'].discoveredAt;
    state = craftingReducer(
      state,
      discoverRecipe({ professionId: 'calligrapher', recipeId: 'calligraphy_letter', method: 'npcFriendship' })
    );
    expect(state.discoveredRecipeLog['calligraphy_letter'].method).toBe('experimentation');
    expect(state.discoveredRecipeLog['calligraphy_letter'].discoveredAt).toBe(originalAt);
  });

  it('silently ignores unknown recipeId', () => {
    expect(() => {
      craftingReducer(
        initialCraftingState,
        discoverRecipe({ professionId: 'calligrapher', recipeId: 'nonexistent_xyz', method: 'questReward' })
      );
    }).not.toThrow();
    const state = craftingReducer(
      initialCraftingState,
      discoverRecipe({ professionId: 'calligrapher', recipeId: 'nonexistent_xyz', method: 'questReward' })
    );
    expect(state.discoveredRecipes).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectUndiscoveredRecipeCount
// ─────────────────────────────────────────────────────────────────────────────

describe('selectUndiscoveredRecipeCount', () => {
  it('returns a positive count for calligrapher when none discovered', () => {
    const count = selectUndiscoveredRecipeCount(makeReduxState([]), 'calligrapher');
    expect(count).toBe(calligrapherDiscoverableIds.length);
  });

  it('returns a positive count for cook when none discovered', () => {
    const count = selectUndiscoveredRecipeCount(makeReduxState([]), 'cook');
    expect(count).toBe(cookDiscoverableIds.length);
  });

  it('decreases by 1 when one recipe is discovered', () => {
    const before = selectUndiscoveredRecipeCount(makeReduxState([]), 'calligrapher');
    const after = selectUndiscoveredRecipeCount(
      makeReduxState(['calligraphy_colored_scroll']),
      'calligrapher'
    );
    expect(after).toBe(before - 1);
  });

  it('returns 0 when all calligrapher discoverable recipes are found', () => {
    const count = selectUndiscoveredRecipeCount(
      makeReduxState(calligrapherDiscoverableIds),
      'calligrapher'
    );
    expect(count).toBe(0);
  });

  it('does not count cook recipes toward calligrapher undiscovered total', () => {
    const withCookDiscovered = makeReduxState(cookDiscoverableIds);
    const count = selectUndiscoveredRecipeCount(withCookDiscovered, 'calligrapher');
    expect(count).toBe(calligrapherDiscoverableIds.length);
  });
});
