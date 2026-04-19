/**
 * playerTitles.js — 50 earnable player titles
 *
 * Each title: {
 *   id,
 *   name,
 *   nameArabic,
 *   description,
 *   unlockCondition: { type, threshold, [detail] }
 * }
 *
 * unlockCondition types:
 *   'words_learned'       — total vocabulary words mastered
 *   'quests_completed'    — total quests finished
 *   'npc_friendship'      — number of NPCs at max (100) friendship
 *   'roots_discovered'    — distinct word roots discovered
 *   'gifts_given'         — total gifts given to NPCs
 *   'zones_visited'       — distinct zones visited
 *   'journal_entries'     — journal entries collected
 *   'titles_earned'       — other titles already earned (meta)
 *   'faction_reputation'  — faction reputation threshold (detail: factionId)
 *   'calligraphy_quests'  — calligraphy-specific quests completed
 *   'battle_victories'    — battles won
 *   'crafting_items'      — items crafted
 *   'secrets_discovered'  — secrets found
 *   'landmarks_visited'   — landmarks visited
 *   'grammar_mastered'    — grammar rules mastered
 *   'days_played'         — consecutive days played
 *   'economy_spent'       — total dirhams spent
 *   'npc_first_meetings'  — distinct NPCs first met
 */

export const PLAYER_TITLES = [
  // ─────────────────────────────────────────────
  // VOCABULARY & LEARNING (10)
  // ─────────────────────────────────────────────
  {
    id: 'title_novice_scholar',
    name: 'Novice Scholar',
    nameArabic: 'طَالِب العِلْم المُبْتَدِئ',
    description: 'Learn your first 50 Arabic words.',
    unlockCondition: { type: 'words_learned', threshold: 50 },
  },
  {
    id: 'title_word_seeker',
    name: 'Word Seeker',
    nameArabic: 'بَاحِث الكَلِمَات',
    description: 'Master 150 Arabic words.',
    unlockCondition: { type: 'words_learned', threshold: 150 },
  },
  {
    id: 'title_lexicon_keeper',
    name: 'Keeper of the Lexicon',
    nameArabic: 'حَافِظ المُعْجَم',
    description: 'Master 300 Arabic words.',
    unlockCondition: { type: 'words_learned', threshold: 300 },
  },
  {
    id: 'title_master_linguist',
    name: 'Master Linguist',
    nameArabic: 'خَبِير اللُّغَة',
    description: 'Master 500 Arabic words.',
    unlockCondition: { type: 'words_learned', threshold: 500 },
  },
  {
    id: 'title_tongue_of_the_desert',
    name: 'Tongue of the Desert',
    nameArabic: 'لِسَان الصَّحْرَاء',
    description: 'Master 750 Arabic words.',
    unlockCondition: { type: 'words_learned', threshold: 750 },
  },
  {
    id: 'title_grammar_adept',
    name: 'Grammar Adept',
    nameArabic: 'مُتَمَرِّس النَّحْو',
    description: 'Master 10 grammar rules.',
    unlockCondition: { type: 'grammar_mastered', threshold: 10 },
  },
  {
    id: 'title_grammar_sage',
    name: 'Grammar Sage',
    nameArabic: 'حَكِيم النَّحْو',
    description: 'Master 25 grammar rules.',
    unlockCondition: { type: 'grammar_mastered', threshold: 25 },
  },
  {
    id: 'title_keeper_of_roots',
    name: 'Keeper of Roots',
    nameArabic: 'حَارِس الجُذُور',
    description: 'Discover 25 Arabic word roots.',
    unlockCondition: { type: 'roots_discovered', threshold: 25 },
  },
  {
    id: 'title_root_scholar',
    name: 'Root Scholar',
    nameArabic: 'عَالِم الجُذُور',
    description: 'Discover 60 Arabic word roots.',
    unlockCondition: { type: 'roots_discovered', threshold: 60 },
  },
  {
    id: 'title_living_dictionary',
    name: 'Living Dictionary',
    nameArabic: 'قَامُوس حَيّ',
    description: 'Master 1,000 Arabic words — you have become a living dictionary.',
    unlockCondition: { type: 'words_learned', threshold: 1000 },
  },

  // ─────────────────────────────────────────────
  // CALLIGRAPHY (3)
  // ─────────────────────────────────────────────
  {
    id: 'title_apprentice_scribe',
    name: 'Apprentice Scribe',
    nameArabic: 'كَاتِب مُتَدَرِّب',
    description: 'Complete 3 calligraphy quests.',
    unlockCondition: { type: 'calligraphy_quests', threshold: 3 },
  },
  {
    id: 'title_master_calligrapher',
    name: 'Master Calligrapher',
    nameArabic: 'سَيِّد الخَطّ',
    description: 'Complete all calligraphy quests — your hand is poetry itself.',
    unlockCondition: { type: 'calligraphy_quests', threshold: 10 },
  },
  {
    id: 'title_hand_of_god',
    name: 'Hand of Beauty',
    nameArabic: 'يَد الجَمَال',
    description: 'Complete 20 calligraphy quests with perfect scores.',
    unlockCondition: { type: 'calligraphy_quests', threshold: 20 },
  },

  // ─────────────────────────────────────────────
  // SOCIAL & FRIENDSHIPS (8)
  // ─────────────────────────────────────────────
  {
    id: 'title_friendly_stranger',
    name: 'Friendly Stranger',
    nameArabic: 'الغَرِيب الوَدُود',
    description: 'Meet 10 different NPCs for the first time.',
    unlockCondition: { type: 'npc_first_meetings', threshold: 10 },
  },
  {
    id: 'title_friend_of_the_oasis',
    name: 'Friend of the Oasis',
    nameArabic: 'صَدِيق الوَاحَة',
    description: 'Reach maximum friendship with 5 NPCs.',
    unlockCondition: { type: 'npc_friendship', threshold: 5 },
  },
  {
    id: 'title_beloved_of_the_market',
    name: 'Beloved of the Market',
    nameArabic: 'حَبِيب السُّوق',
    description: 'Reach maximum friendship with 10 NPCs.',
    unlockCondition: { type: 'npc_friendship', threshold: 10 },
  },
  {
    id: 'title_heart_of_the_desert',
    name: 'Heart of the Desert',
    nameArabic: 'قَلْب الصَّحْرَاء',
    description: 'Reach maximum friendship with every NPC in the game.',
    unlockCondition: { type: 'npc_friendship', threshold: 20 },
  },
  {
    id: 'title_generous_soul',
    name: 'Generous Soul',
    nameArabic: 'نَفْس كَرِيمَة',
    description: 'Give 25 gifts to NPCs.',
    unlockCondition: { type: 'gifts_given', threshold: 25 },
  },
  {
    id: 'title_master_gift_giver',
    name: 'Master of Generosity',
    nameArabic: 'سَيِّد الكَرَم',
    description: 'Give 75 gifts to NPCs.',
    unlockCondition: { type: 'gifts_given', threshold: 75 },
  },
  {
    id: 'title_gift_legend',
    name: 'Legend of Giving',
    nameArabic: 'أُسْطُورَة العَطَاء',
    description: 'Give 150 gifts to NPCs.',
    unlockCondition: { type: 'gifts_given', threshold: 150 },
  },
  {
    id: 'title_known_face',
    name: 'Known Face',
    nameArabic: 'وَجْه مَعْرُوف',
    description: 'Meet every NPC in the world.',
    unlockCondition: { type: 'npc_first_meetings', threshold: 25 },
  },

  // ─────────────────────────────────────────────
  // EXPLORATION (7)
  // ─────────────────────────────────────────────
  {
    id: 'title_oasis_wanderer',
    name: 'Oasis Wanderer',
    nameArabic: 'رَحَّالَة الوَاحَة',
    description: 'Visit 3 different zones.',
    unlockCondition: { type: 'zones_visited', threshold: 3 },
  },
  {
    id: 'title_desert_explorer',
    name: 'Desert Explorer',
    nameArabic: 'مُسْتَكْشِف الصَّحْرَاء',
    description: 'Visit 7 different zones.',
    unlockCondition: { type: 'zones_visited', threshold: 7 },
  },
  {
    id: 'title_cartographer',
    name: 'Cartographer',
    nameArabic: 'رَسَّام الخَرَائِط',
    description: 'Visit every zone in the world.',
    unlockCondition: { type: 'zones_visited', threshold: 12 },
  },
  {
    id: 'title_landmark_seeker',
    name: 'Landmark Seeker',
    nameArabic: 'بَاحِث المَعَالِم',
    description: 'Visit 10 landmarks.',
    unlockCondition: { type: 'landmarks_visited', threshold: 10 },
  },
  {
    id: 'title_pilgrim',
    name: 'Pilgrim',
    nameArabic: 'حَاجّ',
    description: 'Visit 25 landmarks across the world.',
    unlockCondition: { type: 'landmarks_visited', threshold: 25 },
  },
  {
    id: 'title_secret_hunter',
    name: 'Secret Hunter',
    nameArabic: 'صَائِد الأَسْرَار',
    description: 'Discover 10 hidden secrets.',
    unlockCondition: { type: 'secrets_discovered', threshold: 10 },
  },
  {
    id: 'title_keeper_of_secrets',
    name: 'Keeper of Secrets',
    nameArabic: 'كَاتِم الأَسْرَار',
    description: 'Discover every secret in the world.',
    unlockCondition: { type: 'secrets_discovered', threshold: 30 },
  },

  // ─────────────────────────────────────────────
  // QUESTS (5)
  // ─────────────────────────────────────────────
  {
    id: 'title_errand_runner',
    name: 'Errand Runner',
    nameArabic: 'مُنَفِّذ المَهَام',
    description: 'Complete your first 5 quests.',
    unlockCondition: { type: 'quests_completed', threshold: 5 },
  },
  {
    id: 'title_quest_taker',
    name: 'Quest Taker',
    nameArabic: 'مُتَقَبِّل المُهِمَّات',
    description: 'Complete 15 quests.',
    unlockCondition: { type: 'quests_completed', threshold: 15 },
  },
  {
    id: 'title_hero_of_the_oasis',
    name: 'Hero of the Oasis',
    nameArabic: 'بَطَل الوَاحَة',
    description: 'Complete 30 quests.',
    unlockCondition: { type: 'quests_completed', threshold: 30 },
  },
  {
    id: 'title_legend_in_the_making',
    name: 'Legend in the Making',
    nameArabic: 'أُسْطُورَة فِي طَوْر التَّكَوُّن',
    description: 'Complete 50 quests.',
    unlockCondition: { type: 'quests_completed', threshold: 50 },
  },
  {
    id: 'title_quest_master',
    name: 'Quest Master',
    nameArabic: 'سَيِّد المَهَام',
    description: 'Complete every quest available.',
    unlockCondition: { type: 'quests_completed', threshold: 100 },
  },

  // ─────────────────────────────────────────────
  // BATTLE (5)
  // ─────────────────────────────────────────────
  {
    id: 'title_desert_fighter',
    name: 'Desert Fighter',
    nameArabic: 'مُحَارِب الصَّحْرَاء',
    description: 'Win your first 10 battles.',
    unlockCondition: { type: 'battle_victories', threshold: 10 },
  },
  {
    id: 'title_word_warrior',
    name: 'Word Warrior',
    nameArabic: 'مُحَارِب الكَلِمَة',
    description: 'Win 30 battles using Arabic vocabulary.',
    unlockCondition: { type: 'battle_victories', threshold: 30 },
  },
  {
    id: 'title_champion',
    name: 'Champion of the Arena',
    nameArabic: 'بَطَل الحَلْبَة',
    description: 'Win 75 battles.',
    unlockCondition: { type: 'battle_victories', threshold: 75 },
  },
  {
    id: 'title_undefeated',
    name: 'The Undefeated',
    nameArabic: 'الذِي لَم يُهْزَم',
    description: 'Win 150 battles without fleeing.',
    unlockCondition: { type: 'battle_victories', threshold: 150 },
  },
  {
    id: 'title_battle_legend',
    name: 'Battle Legend',
    nameArabic: 'أُسْطُورَة المَعَارِك',
    description: 'Win 300 battles — your name echoes through the desert.',
    unlockCondition: { type: 'battle_victories', threshold: 300 },
  },

  // ─────────────────────────────────────────────
  // ECONOMY & CRAFTING (5)
  // ─────────────────────────────────────────────
  {
    id: 'title_marketplace_regular',
    name: 'Marketplace Regular',
    nameArabic: 'زَبُون السُّوق الدَّائِم',
    description: 'Spend 500 dirhams.',
    unlockCondition: { type: 'economy_spent', threshold: 500 },
  },
  {
    id: 'title_merchant_prince',
    name: 'Merchant Prince',
    nameArabic: 'الأَمِير التَّاجِر',
    description: 'Spend 5,000 dirhams across all markets.',
    unlockCondition: { type: 'economy_spent', threshold: 5000 },
  },
  {
    id: 'title_apprentice_artisan',
    name: 'Apprentice Artisan',
    nameArabic: 'حَرَفِيّ مُتَدَرِّب',
    description: 'Craft 10 items.',
    unlockCondition: { type: 'crafting_items', threshold: 10 },
  },
  {
    id: 'title_master_artisan',
    name: 'Master Artisan',
    nameArabic: 'حَرَفِيّ مَاهِر',
    description: 'Craft 50 items.',
    unlockCondition: { type: 'crafting_items', threshold: 50 },
  },
  {
    id: 'title_guild_master',
    name: 'Guild Master',
    nameArabic: 'رَئِيس الطَّائِفَة',
    description: 'Craft 150 items across all crafting disciplines.',
    unlockCondition: { type: 'crafting_items', threshold: 150 },
  },

  // ─────────────────────────────────────────────
  // JOURNAL & LORE (4)
  // ─────────────────────────────────────────────
  {
    id: 'title_chronicler',
    name: 'Chronicler',
    nameArabic: 'المُؤَرِّخ',
    description: 'Collect 25 journal entries.',
    unlockCondition: { type: 'journal_entries', threshold: 25 },
  },
  {
    id: 'title_lore_keeper',
    name: 'Lore Keeper',
    nameArabic: 'حَافِظ التُّرَاث',
    description: 'Collect 75 journal entries.',
    unlockCondition: { type: 'journal_entries', threshold: 75 },
  },
  {
    id: 'title_historian',
    name: 'Historian of the Desert',
    nameArabic: 'مُؤَرِّخ الصَّحْرَاء',
    description: 'Collect 150 journal entries — you have documented a world.',
    unlockCondition: { type: 'journal_entries', threshold: 150 },
  },
  {
    id: 'title_grand_annalist',
    name: 'Grand Annalist',
    nameArabic: 'المُؤَرِّخ الأَعْظَم',
    description: 'Collect 250 journal entries — the complete chronicle.',
    unlockCondition: { type: 'journal_entries', threshold: 250 },
  },

  // ─────────────────────────────────────────────
  // META (3)
  // ─────────────────────────────────────────────
  {
    id: 'title_title_collector',
    name: 'Title Collector',
    nameArabic: 'جَامِع الأَلْقَاب',
    description: 'Earn 10 different titles.',
    unlockCondition: { type: 'titles_earned', threshold: 10 },
  },
  {
    id: 'title_hall_of_fame',
    name: 'Hall of Fame',
    nameArabic: 'قَاعَة الشُّهْرَة',
    description: 'Earn 25 different titles.',
    unlockCondition: { type: 'titles_earned', threshold: 25 },
  },
  {
    id: 'title_legend',
    name: 'Legend',
    nameArabic: 'أُسْطُورَة',
    description: 'Earn 40 titles — you are spoken of in every corner of the world.',
    unlockCondition: { type: 'titles_earned', threshold: 40 },
  },
];

// Lookup map: titleId → title object
export const TITLES_BY_ID = Object.fromEntries(
  PLAYER_TITLES.map((t) => [t.id, t])
);

// Lookup by unlock type
export const TITLES_BY_TYPE = PLAYER_TITLES.reduce((acc, title) => {
  const { type } = title.unlockCondition;
  if (!acc[type]) acc[type] = [];
  acc[type].push(title);
  return acc;
}, {});

/**
 * Given current player stats, return all newly unlocked titles.
 * @param {string[]} alreadyUnlocked - array of already-unlocked title IDs
 * @param {object} stats - { wordsLearned, questsCompleted, npcFriendshipMaxCount, ... }
 * @returns {object[]} array of newly unlocked title objects
 */
export function checkNewTitles(alreadyUnlocked, stats) {
  const alreadySet = new Set(alreadyUnlocked);
  return PLAYER_TITLES.filter((title) => {
    if (alreadySet.has(title.id)) return false;
    const { type, threshold } = title.unlockCondition;
    switch (type) {
      case 'words_learned':         return (stats.wordsLearned ?? 0) >= threshold;
      case 'quests_completed':      return (stats.questsCompleted ?? 0) >= threshold;
      case 'npc_friendship':        return (stats.npcFriendshipMaxCount ?? 0) >= threshold;
      case 'roots_discovered':      return (stats.rootsDiscovered ?? 0) >= threshold;
      case 'gifts_given':           return (stats.giftsGiven ?? 0) >= threshold;
      case 'zones_visited':         return (stats.zonesVisited ?? 0) >= threshold;
      case 'journal_entries':       return (stats.journalEntries ?? 0) >= threshold;
      case 'titles_earned':         return alreadyUnlocked.length >= threshold;
      case 'calligraphy_quests':    return (stats.calligraphyQuests ?? 0) >= threshold;
      case 'battle_victories':      return (stats.battleVictories ?? 0) >= threshold;
      case 'crafting_items':        return (stats.craftingItems ?? 0) >= threshold;
      case 'secrets_discovered':    return (stats.secretsDiscovered ?? 0) >= threshold;
      case 'landmarks_visited':     return (stats.landmarksVisited ?? 0) >= threshold;
      case 'grammar_mastered':      return (stats.grammarMastered ?? 0) >= threshold;
      case 'economy_spent':         return (stats.economySpent ?? 0) >= threshold;
      case 'npc_first_meetings':    return (stats.npcFirstMeetings ?? 0) >= threshold;
      default:                      return false;
    }
  });
}

export default PLAYER_TITLES;
