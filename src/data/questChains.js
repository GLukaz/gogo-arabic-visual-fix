/**
 * questChains.js
 * GROW-016: Define 5 quest chains (3-5 quests each).
 *
 * Quest IDs reference entries in quests.json (already registered in questSlice).
 * chainReward is granted when ALL quests in the chain are completed.
 */

export const QUEST_CHAINS = [
  {
    chainId: 'chain_oasis_scholar',
    title: 'The Oasis Scholar',
    titleArabic: 'عالِم الواحة',
    description: 'Master the foundational vocabulary of Oasis Village and earn the respect of its elders.',
    quests: [
      'greetings_of_oasis',
      'words_of_oasis',
      'quiz_challenge',
    ],
    chainReward: { xp: 150, dirhams: 50, item: 'scholars_kufi' },
  },
  {
    chainId: 'chain_library_mastery',
    title: 'Secrets of the Sacred Library',
    titleArabic: 'أَسرار المَكتَبَة المُقَدَّسَة',
    description: 'Unlock the full knowledge of the Ancient Library by proving mastery of numbers, colors, and scribal arts.',
    quests: [
      'library_numbers',
      'library_colors',
      'scribe_phrases',
      'master_of_letters',
    ],
    chainReward: { xp: 200, dirhams: 75, item: 'ancient_inkwell' },
  },
  {
    chainId: 'chain_desert_merchant',
    title: 'The Desert Merchant',
    titleArabic: 'تاجِر الصَّحراء',
    description: 'Navigate the Desert Marketplace by learning trade vocabulary and earning the trust of its merchants.',
    quests: [
      'spice_knowledge',
      'trader_bargains',
      'guard_directions',
      'merchant_master',
    ],
    chainReward: { xp: 200, dirhams: 100, item: 'amulet_of_fortune' },
  },
  {
    chainId: 'chain_mountain_wisdom',
    title: 'Wisdom of the Mountain Pass',
    titleArabic: 'حِكمَة دَرب الجَبَل',
    description: 'Survive and thrive in the Mountain Pass by mastering clothing, healing, and philosophical vocabulary.',
    quests: [
      'mountain_clothing',
      'mountain_healing',
      'mountain_paths',
      'mountain_wisdom',
    ],
    chainReward: { xp: 250, dirhams: 80, item: 'compass_of_qibla' },
  },
  {
    chainId: 'chain_port_navigator',
    title: 'Navigator of the Coastal Port',
    titleArabic: 'مُلاَّح المِيناء السّاحِلِي',
    description: 'Command the language of the sea — master navigation, trade, and craft at the Coastal Port.',
    quests: [
      'port_navigation',
      'port_market',
      'port_smithing',
      'port_of_knowledge',
    ],
    chainReward: { xp: 300, dirhams: 120, item: 'astrolabe' },
  },
];
