/**
 * npcProfessionTeaching.js
 *
 * Defines which NPCs can teach which professions, along with intro recipes.
 * Merged into npcsEnriched.js to add professionTeaching field to relevant NPCs.
 *
 * Pattern:
 * - Each profession taught by 1-2 NPCs per zone
 * - Intro recipes: 2-3 starter recipes unlocked when profession learned
 * - Distributed across zones to encourage exploration
 */

export const NPC_PROFESSION_TEACHING = {
  'scribe-amina': {
    professionId: 'calligrapher',
    introRecipes: ['calligrapher_basic_scroll', 'calligrapher_ink_black'],
  },
  'librarian-ibrahim': {
    professionId: 'calligrapher',
    introRecipes: ['calligrapher_basic_scroll', 'calligrapher_papyrus_sheet'],
  },
  'chef-omar': {
    professionId: 'cook',
    introRecipes: ['cook_flatbread', 'cook_date_cake'],
  },
  'spice-seller-layla': {
    professionId: 'cook',
    introRecipes: ['cook_flatbread', 'cook_lentil_stew'],
  },
  'blacksmith-tariq': {
    professionId: 'blacksmith',
    introRecipes: ['blacksmith_iron_nail', 'blacksmith_copper_ring'],
  },
  'jeweler-zahra': {
    professionId: 'blacksmith',
    introRecipes: ['blacksmith_copper_ring', 'blacksmith_tin_ingot'],
  },
  'healer-khadija': {
    professionId: 'herbalist',
    introRecipes: ['herbalist_healing_salve', 'herbalist_chamomile_tea'],
  },
  'alchemist-razi': {
    professionId: 'herbalist',
    introRecipes: ['herbalist_chamomile_tea', 'herbalist_mint_potion'],
  },
  'weaver-layla': {
    professionId: 'weaver',
    introRecipes: ['weaver_linen_cloth', 'weaver_cotton_thread'],
  },
  'tailor-salim': {
    professionId: 'weaver',
    introRecipes: ['weaver_cotton_thread', 'weaver_wool_yarn'],
  },
  'builder-yusuf': {
    professionId: 'builder',
    introRecipes: ['builder_mud_brick', 'builder_stone_block'],
  },
  'architect-fatima': {
    professionId: 'builder',
    introRecipes: ['builder_stone_block', 'builder_wooden_beam'],
  },
};

/**
 * Merge profession teaching data into NPCs array
 * @param {Array} npcs - Base NPCs array from npcs.json
 * @returns {Array} NPCs with professionTeaching field added
 */
export function mergeNpcProfessionTeaching(npcs) {
  return npcs.map(npc => {
    const professionData = NPC_PROFESSION_TEACHING[npc.id];

    if (professionData) {
      return {
        ...npc,
        professionTeaching: professionData,
      };
    }

    return npc;
  });
}
