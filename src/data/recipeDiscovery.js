/**
 * recipeDiscovery.js — Recipe discovery flow for crafting professions
 *
 * Recipes can be discovered through three sources:
 * - npcFriendship: NPC teaches recipe at friendship >= minFriendship (default 50)
 * - questReward:   Completing a specific quest reveals the recipe
 * - experimentation: Combining 3 ingredients of matching gatherType categories
 *
 * This module is a pure data + pure-function overlay on top of recipes.js.
 * It does NOT import from craftingSlice to avoid circular dependencies.
 */

import { RECIPES } from './recipes.js';
import { RESOURCES } from './resources.js';

// ────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────

export const DISCOVERY_METHODS = {
  NPC_FRIENDSHIP: 'npcFriendship',
  QUEST_REWARD: 'questReward',
  EXPERIMENTATION: 'experimentation',
};

export const NPC_FRIENDSHIP_THRESHOLD = 50;

// ────────────────────────────────────────────────
// RECIPE DISCOVERY METHOD DATA
// ────────────────────────────────────────────────

/**
 * RECIPE_DISCOVERY_METHODS — Maps recipeId → discovery configuration.
 *
 * This is a separate overlay from RECIPES to avoid bloating the recipe data file.
 * Only recipes listed here are "discoverable" — all others must be unlocked by
 * reaching the required profession level (the default flow).
 */
export const RECIPE_DISCOVERY_METHODS = {
  // ─── Calligrapher — NPC Friendship (calligraphy_master) ──────────
  calligraphy_colored_scroll: {
    method: DISCOVERY_METHODS.NPC_FRIENDSHIP,
    npcId: 'calligraphy_master',
    minFriendship: 50,
  },
  calligraphy_silver_scroll: {
    method: DISCOVERY_METHODS.NPC_FRIENDSHIP,
    npcId: 'calligraphy_master',
    minFriendship: 60,
  },
  calligraphy_illuminated_page: {
    method: DISCOVERY_METHODS.NPC_FRIENDSHIP,
    npcId: 'calligraphy_master',
    minFriendship: 70,
  },
  calligraphy_talisman: {
    method: DISCOVERY_METHODS.NPC_FRIENDSHIP,
    npcId: 'calligraphy_master',
    minFriendship: 80,
  },

  // ─── Calligrapher — Quest Reward ─────────────────────────────────
  calligraphy_wisdom_book: {
    method: DISCOVERY_METHODS.QUEST_REWARD,
    questId: 'library_numbers',
  },
  calligraphy_map: {
    method: DISCOVERY_METHODS.QUEST_REWARD,
    questId: 'library_colors',
  },
  calligraphy_prayer_book: {
    method: DISCOVERY_METHODS.QUEST_REWARD,
    questId: 'scribe_phrases',
  },
  calligraphy_spell_scroll: {
    method: DISCOVERY_METHODS.QUEST_REWARD,
    questId: 'master_of_letters',
  },

  // ─── Calligrapher — Experimentation ──────────────────────────────
  // calligraphy_letter ingredients: paper(special) + ink_black(special) + wax_seal(special)
  // → sorted category key: 'special,special,special'
  calligraphy_letter: {
    method: DISCOVERY_METHODS.EXPERIMENTATION,
    ingredientCategories: ['special', 'special', 'special'],
  },

  // ─── Cook — NPC Friendship (tavern_keeper) ───────────────────────
  cook_rose_sherbet: {
    method: DISCOVERY_METHODS.NPC_FRIENDSHIP,
    npcId: 'tavern_keeper',
    minFriendship: 50,
  },
  cook_pomegranate_juice: {
    method: DISCOVERY_METHODS.NPC_FRIENDSHIP,
    npcId: 'tavern_keeper',
    minFriendship: 60,
  },
  cook_mint_tea: {
    method: DISCOVERY_METHODS.NPC_FRIENDSHIP,
    npcId: 'tavern_keeper',
    minFriendship: 70,
  },
  cook_fig_jam: {
    method: DISCOVERY_METHODS.NPC_FRIENDSHIP,
    npcId: 'tavern_keeper',
    minFriendship: 80,
  },

  // ─── Cook — Quest Reward ─────────────────────────────────────────
  cook_lamb_kebab: {
    method: DISCOVERY_METHODS.QUEST_REWARD,
    questId: 'spice_knowledge',
  },
  cook_hummus: {
    method: DISCOVERY_METHODS.QUEST_REWARD,
    questId: 'market_talk',
  },
  cook_baklava: {
    method: DISCOVERY_METHODS.QUEST_REWARD,
    questId: 'trader_bargains',
  },
  cook_cardamom_coffee: {
    method: DISCOVERY_METHODS.QUEST_REWARD,
    questId: 'greetings_of_oasis',
  },

  // ─── Cook — Experimentation ──────────────────────────────────────
  // cook_saffron_rice ingredients: rice(plant) + saffron(plant) + butter(animal)
  // → sorted category key: 'animal,plant,plant'
  cook_saffron_rice: {
    method: DISCOVERY_METHODS.EXPERIMENTATION,
    ingredientCategories: ['animal', 'plant', 'plant'],
  },
};

// ────────────────────────────────────────────────
// CORE FUNCTIONS
// ────────────────────────────────────────────────

/**
 * getDiscoverableRecipes(professionId, playerState)
 *
 * Returns recipes that are currently discoverable for this profession and player.
 *
 * A recipe is included when:
 * 1. It has a RECIPE_DISCOVERY_METHODS entry
 * 2. Its professionId matches the requested profession
 * 3. The player meets the method's condition (friendship threshold / quest done)
 * 4. It has NOT already been discovered
 *
 * NOTE: Experimentation recipes are excluded from this list — they are discovered
 * explicitly via experimentWithIngredients(), not by checking playerState.
 *
 * @param {string} professionId
 * @param {object} playerState — full Redux state object
 * @returns {Array<{ recipeId: string, recipe: object, discoveryConfig: object }>}
 */
export function getDiscoverableRecipes(professionId, playerState) {
  const discoveredSet = new Set(playerState?.crafting?.discoveredRecipes ?? []);
  const npcFriendship = playerState?.npc?.friendship ?? {};
  const quests = playerState?.quests?.quests ?? {};

  const results = [];

  for (const [recipeId, config] of Object.entries(RECIPE_DISCOVERY_METHODS)) {
    const recipe = RECIPES[recipeId];
    if (!recipe) continue;
    if (recipe.professionId !== professionId) continue;
    if (discoveredSet.has(recipeId)) continue;

    const { method } = config;

    if (method === DISCOVERY_METHODS.NPC_FRIENDSHIP) {
      const currentFriendship = npcFriendship[config.npcId] ?? 0;
      if (currentFriendship >= config.minFriendship) {
        results.push({ recipeId, recipe, discoveryConfig: config });
      }
    } else if (method === DISCOVERY_METHODS.QUEST_REWARD) {
      const quest = quests[config.questId];
      if (quest?.status === 'completed' || quest?.rewardClaimed === true) {
        results.push({ recipeId, recipe, discoveryConfig: config });
      }
    }
    // Experimentation recipes are intentionally excluded here
  }

  return results;
}

/**
 * experimentWithIngredients(ingredient1, ingredient2, ingredient3)
 *
 * Attempts to reveal a recipe by combining 3 ingredient resource IDs.
 * Matching uses gatherType categories — not exact resource IDs — so any three
 * resources with the right types will match regardless of specific IDs.
 *
 * @param {string} ingredient1 — resourceId
 * @param {string} ingredient2 — resourceId
 * @param {string} ingredient3 — resourceId
 * @returns {{ recipeId: string, recipe: object } | null}
 */
export function experimentWithIngredients(ingredient1, ingredient2, ingredient3) {
  const ingredientIds = [ingredient1, ingredient2, ingredient3];

  const categories = ingredientIds.map((resourceId) => {
    const resource = RESOURCES[resourceId];
    return resource?.gatherType ?? 'unknown';
  });

  // Sort for order-independent matching
  const categoryKey = [...categories].sort().join(',');

  for (const [recipeId, config] of Object.entries(RECIPE_DISCOVERY_METHODS)) {
    if (config.method !== DISCOVERY_METHODS.EXPERIMENTATION) continue;

    const configKey = [...config.ingredientCategories].sort().join(',');
    if (configKey === categoryKey) {
      const recipe = RECIPES[recipeId];
      if (recipe) {
        return { recipeId, recipe };
      }
    }
  }

  return null;
}
