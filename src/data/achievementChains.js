/**
 * achievementChains.js — Meta-achievement chains (20 chain definitions)
 *
 * Each chain unlocks when ALL prerequisite achievements are complete.
 * Chains reference existing achievement IDs from achievements.js.
 */

export const ACHIEVEMENT_CHAINS = [
  // ── Zone Mastery (8) ──
  {
    id: 'chain_oasis_master',
    name: 'Oasis Master',
    nameArabic: 'سيد الواحة',
    description: 'Complete all Oasis Village achievements',
    icon: '🏜️',
    prerequisiteIds: ['explorer_3', 'oasis_wisdom_keeper_defeated', 'first_quest'],
    xpReward: 2000,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_marketplace_mogul',
    name: 'Marketplace Mogul',
    nameArabic: 'قطب السوق',
    description: 'Master all Desert Marketplace achievements',
    icon: '💰',
    prerequisiteIds: ['merchant_king_defeated', 'first_purchase', 'big_spender'],
    xpReward: 2000,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_library_sage',
    name: 'Library Sage',
    nameArabic: 'حكيم المكتبة',
    description: 'Master all Ancient Library achievements',
    icon: '📚',
    prerequisiteIds: ['grammar_master_defeated', 'bookworm', 'word_collector_100'],
    xpReward: 2000,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_desert_nomad',
    name: 'Desert Nomad',
    nameArabic: 'بدوي الصحراء',
    description: 'Master all Bedouin Camp achievements',
    icon: '🐪',
    prerequisiteIds: ['desert_poet_defeated', 'streak_7'],
    xpReward: 2000,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_royal_advisor',
    name: 'Royal Advisor',
    nameArabic: 'مستشار ملكي',
    description: 'Master all Royal Palace achievements',
    icon: '👑',
    prerequisiteIds: ['court_inquisitor_defeated', 'level_25'],
    xpReward: 2500,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_harvest_king',
    name: 'Harvest King',
    nameArabic: 'ملك الحصاد',
    description: 'Master all Farmland achievements',
    icon: '🌾',
    prerequisiteIds: ['elder_farmer_defeated', 'category_food'],
    xpReward: 2000,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_sea_captain',
    name: 'Sea Captain',
    nameArabic: 'قبطان البحر',
    description: 'Master all Coastal Port achievements',
    icon: '⚓',
    prerequisiteIds: ['harbor_master_defeated', 'category_travel'],
    xpReward: 2000,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_mountain_hermit',
    name: 'Mountain Hermit',
    nameArabic: 'ناسك الجبل',
    description: 'Master all Mountain Village achievements',
    icon: '🏔️',
    prerequisiteIds: ['philosopher_hermit_defeated', 'explorer_8'],
    xpReward: 2500,
    rarity: 'epic',
    category: 'meta',
  },

  // ── Skill Mastery (6) ──
  {
    id: 'chain_linguistic_warrior',
    name: 'Linguistic Warrior',
    nameArabic: 'محارب اللغة',
    description: 'Defeat all 8 zone bosses',
    icon: '⚔️',
    prerequisiteIds: [
      'oasis_wisdom_keeper_defeated', 'merchant_king_defeated', 'grammar_master_defeated',
      'desert_poet_defeated', 'court_inquisitor_defeated', 'elder_farmer_defeated',
      'harbor_master_defeated', 'philosopher_hermit_defeated',
    ],
    xpReward: 5000,
    rarity: 'legendary',
    category: 'meta',
  },
  {
    id: 'chain_vocabulary_titan',
    name: 'Vocabulary Titan',
    nameArabic: 'عملاق المفردات',
    description: 'Complete all vocabulary milestone achievements',
    icon: '📖',
    prerequisiteIds: ['word_collector_10', 'word_collector_50', 'word_collector_100', 'word_collector_250', 'word_collector_500'],
    xpReward: 3000,
    rarity: 'legendary',
    category: 'meta',
  },
  {
    id: 'chain_streak_legend',
    name: 'Streak Legend',
    nameArabic: 'أسطورة المواظبة',
    description: 'Achieve all streak milestones',
    icon: '🔥',
    prerequisiteIds: ['streak_3', 'streak_7', 'streak_14', 'streak_30', 'streak_60', 'streak_100'],
    xpReward: 5000,
    rarity: 'legendary',
    category: 'meta',
  },
  {
    id: 'chain_xp_grandmaster',
    name: 'XP Grandmaster',
    nameArabic: 'سيد الخبرة',
    description: 'Hit every XP milestone',
    icon: '💫',
    prerequisiteIds: ['xp_100', 'xp_500', 'xp_1000', 'xp_5000', 'xp_10000'],
    xpReward: 3000,
    rarity: 'legendary',
    category: 'meta',
  },
  {
    id: 'chain_alphabet_scholar',
    name: 'Alphabet Scholar',
    nameArabic: 'عالم الأبجدية',
    description: 'Master all alphabet achievements',
    icon: '✍️',
    prerequisiteIds: ['first_letter', 'alphabet_5', 'half_alphabet', 'full_alphabet', 'alphabet_perfect'],
    xpReward: 2500,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_treasure_master',
    name: 'Treasure Master',
    nameArabic: 'سيد الكنوز',
    description: 'Complete all treasure hunting achievements',
    icon: '💎',
    prerequisiteIds: ['treasure_hunter_10', 'treasure_hunter_25', 'treasure_hunter_50'],
    xpReward: 2000,
    rarity: 'epic',
    category: 'meta',
  },

  // ── Grand Mastery (6) ──
  {
    id: 'chain_world_conqueror',
    name: 'World Conqueror',
    nameArabic: 'فاتح العالم',
    description: 'Complete all 8 zone mastery chains',
    icon: '🌍',
    prerequisiteIds: [
      'chain_oasis_master', 'chain_marketplace_mogul', 'chain_library_sage',
      'chain_desert_nomad', 'chain_royal_advisor', 'chain_harvest_king',
      'chain_sea_captain', 'chain_mountain_hermit',
    ],
    xpReward: 10000,
    rarity: 'legendary',
    category: 'grand_meta',
  },
  {
    id: 'chain_arabic_polymath',
    name: 'Arabic Polymath',
    nameArabic: 'عالم موسوعي',
    description: 'Master vocabulary, alphabet, and all streaks',
    icon: '🧠',
    prerequisiteIds: ['chain_vocabulary_titan', 'chain_alphabet_scholar', 'chain_streak_legend'],
    xpReward: 8000,
    rarity: 'legendary',
    category: 'grand_meta',
  },
  {
    id: 'chain_cultural_ambassador',
    name: 'Cultural Ambassador',
    nameArabic: 'سفير ثقافي',
    description: 'Master vocabulary categories across food, family, travel, and religion',
    icon: '🕌',
    prerequisiteIds: ['category_food', 'category_family', 'category_travel', 'category_religion'],
    xpReward: 3000,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_economy_baron',
    name: 'Economy Baron',
    nameArabic: 'بارون الاقتصاد',
    description: 'Master all economy and trade achievements',
    icon: '🏦',
    prerequisiteIds: ['first_purchase', 'big_spender', 'wealthy'],
    xpReward: 2000,
    rarity: 'epic',
    category: 'meta',
  },
  {
    id: 'chain_ultimate_scholar',
    name: 'Ultimate Scholar',
    nameArabic: 'العالم المطلق',
    description: 'The ultimate meta-achievement — complete EVERYTHING',
    icon: '🏆',
    prerequisiteIds: ['chain_world_conqueror', 'chain_arabic_polymath', 'chain_xp_grandmaster', 'chain_linguistic_warrior'],
    xpReward: 25000,
    rarity: 'legendary',
    category: 'grand_meta',
  },
];

/**
 * Get a chain by ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getChainById(id) {
  return ACHIEVEMENT_CHAINS.find((c) => c.id === id);
}

/**
 * Get all chains in a category.
 * @param {string} category
 * @returns {Object[]}
 */
export function getChainsByCategory(category) {
  return ACHIEVEMENT_CHAINS.filter((c) => c.category === category);
}
