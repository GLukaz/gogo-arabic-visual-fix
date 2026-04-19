/**
 * vocabCollections.js
 * GROW-022: 10 themed vocabulary collections for focused study.
 *
 * All wordIds reference existing entries in vocabularyAll.js (vocabulary.json +
 * vocabularyExpanded.js). Total: 961 words across 10 collections.
 *
 * Collections: greetings_social, food_drink, family_body, nature_animals,
 *              numbers_time_colors, trade_commerce, travel_directions,
 *              verbs_action, golden_age_science, advanced_discourse
 */

/** Generate a consecutive ID range (for expanded vocab blocks). */
function r(prefix, start, end, pad = 3) {
  const ids = [];
  for (let i = start; i <= end; i++) {
    ids.push(`${prefix}_${String(i).padStart(pad, '0')}`);
  }
  return ids;
}

export const VOCAB_COLLECTIONS = [
  {
    id: 'greetings_social',
    name: 'Greetings & Social Phrases',
    nameArabic: 'التحيات والعبارات الاجتماعية',
    description: 'Essential greetings, farewells, and everyday social expressions used in Arabic-speaking communities.',
    cefrRange: 'A1',
    wordIds: [
      // Curated greetings (12 — 8 with duplicate Arabic text are covered by phrases below)
      'salaam', 'ahlan', 'marhaba', 'shukran', 'afwan',
      'bi_khayr', 'la', 'na_am', 'alhamdulillah', 'jazakallah', 'tayyib', 'yalla',
      // Curated phrases (29)
      'what_is_your_name_1', 'my_name_is_1', 'how_are_you_1', 'i_am_fine_1',
      'where_is_1', 'i_want_1', 'i_dont_want_1', 'i_dont_know_1',
      'please_1', 'excuse_me_1', 'im_sorry_1', 'congratulations_1', 'welcome_1',
      'good_morning_1', 'good_evening_1', 'goodbye_1', 'see_you_later_1',
      'how_much_1', 'i_understand_1', 'i_dont_understand_1', 'can_you_help_me_1',
      'where_is_the_market_1', 'i_am_learning_arabic_1', 'what_is_this_1',
      'this_is_1', 'thank_god_1', 'god_willing_1', 'what_god_has_willed_1',
      'in_the_name_of_god_1',
      // Expanded A1 greetings (exp_a1_001..030)
      ...r('exp_a1', 1, 30),
      // Expanded A1 phrases (exp_a1_486..500)
      ...r('exp_a1', 486, 500),
      // Expanded A1 pronouns — first 4 (I, you, he, she)
      ...r('exp_a1', 31, 34),
    ],
  },

  {
    id: 'food_drink',
    name: 'Food & Drink',
    nameArabic: 'الطعام والشراب',
    description: 'Vocabulary for food, beverages, meals, and the kitchen — from the souk to the table.',
    cefrRange: 'A1-A2',
    wordIds: [
      // Curated food (20)
      'water_1', 'bread_1', 'rice_1', 'meat_1', 'chicken_1', 'fish_food_1',
      'milk_1', 'tea_1', 'coffee_1', 'sugar_1', 'salt_1', 'egg_1',
      'cheese_1', 'fruit_1', 'apple_1', 'dates_1', 'olive_1', 'honey_1',
      'soup_1', 'juice_1',
      // Expanded A1 food (exp_a1_171..220, 50 words)
      ...r('exp_a1', 171, 220),
      // A2 house/home — kitchen and household items (exp_a2_0211..0230, 20 words)
      ...r('exp_a2', 211, 230, 4),
    ],
  },

  {
    id: 'family_body',
    name: 'Family & Body',
    nameArabic: 'الأسرة والجسم',
    description: 'Words for family relationships and body parts — the people closest to you and the body you inhabit.',
    cefrRange: 'A1',
    wordIds: [
      // Curated family (15)
      'family_father', 'family_mother', 'family_brother', 'family_sister',
      'family_son', 'family_daughter', 'family_grandfather', 'family_grandmother',
      'family_uncle_paternal', 'family_aunt_paternal', 'family_uncle_maternal',
      'family_aunt_maternal', 'family_husband', 'family_wife', 'family_child',
      // Curated body (12)
      'head_1', 'hand_1', 'eye_1', 'ear_1', 'mouth_1', 'nose_1',
      'foot_1', 'heart_1', 'back_1', 'stomach_1', 'finger_1', 'tooth_1',
      // Expanded A1 family (exp_a1_106..140, 35 words)
      ...r('exp_a1', 106, 140),
      // Expanded A1 body (exp_a1_141..170, 30 words)
      ...r('exp_a1', 141, 170),
    ],
  },

  {
    id: 'nature_animals',
    name: 'Nature & Animals',
    nameArabic: 'الطبيعة والحيوانات',
    description: 'The natural world in Arabic — deserts, oases, rivers, and the creatures that inhabit them.',
    cefrRange: 'A1-A2',
    wordIds: [
      // Curated nature (15)
      'water_w13', 'sun_w14', 'moon_w15', 'star_w16', 'sand_w17',
      'desert_w18', 'oasis_w19', 'palm_tree_w20', 'mountain_w21',
      'sky_w22', 'sea_w23', 'river_w24', 'rain_w25', 'wind_w26', 'tree_w27',
      // Curated animals (15)
      'cat_1', 'dog_1', 'horse_1', 'camel_1', 'bird_1', 'fish_animal_1',
      'lion_1', 'sheep_1', 'goat_1', 'cow_1', 'donkey_1', 'rabbit_1',
      'snake_1', 'eagle_1', 'ant_1',
      // Expanded A1 animals (exp_a1_221..250, 30 words)
      ...r('exp_a1', 221, 250),
      // Expanded A1 nature (exp_a1_251..285, 35 words)
      ...r('exp_a1', 251, 285),
    ],
  },

  {
    id: 'numbers_time_colors',
    name: 'Numbers, Time & Colors',
    nameArabic: 'الأرقام والوقت والألوان',
    description: 'Count, tell time, and describe color — the building blocks of everyday Arabic description.',
    cefrRange: 'A1',
    wordIds: [
      // Curated numbers (15)
      'num_1', 'num_2', 'num_3', 'num_4', 'num_5', 'num_6', 'num_7',
      'num_8', 'num_9', 'num_10', 'num_11', 'num_12', 'num_13', 'num_14', 'num_15',
      // Curated colors (12)
      'color_red', 'color_blue', 'color_green', 'color_yellow', 'color_white',
      'color_black', 'color_orange', 'color_brown', 'color_pink',
      'color_purple', 'color_grey', 'color_golden',
      // Curated time (10)
      'day_1', 'night_1', 'morning_1', 'evening_1', 'today_1',
      'tomorrow_1', 'yesterday_1', 'hour_1', 'week_1', 'month_1',
      // Expanded A1 numbers (exp_a1_061..085, 25 words)
      ...r('exp_a1', 61, 85),
      // Expanded A1 colors (exp_a1_086..105, 20 words)
      ...r('exp_a1', 86, 105),
      // Expanded A1 time — first 10 (exp_a1_286..295)
      ...r('exp_a1', 286, 295),
    ],
  },

  {
    id: 'trade_commerce',
    name: 'Trade & Commerce',
    nameArabic: 'التجارة والأعمال',
    description: 'Vocabulary for the marketplace, buying and selling, and professional business — from ancient souks to modern offices.',
    cefrRange: 'A1-A2',
    wordIds: [
      // Curated trade (20)
      'shop_w28', 'market_w29', 'money_w30', 'price_w31', 'cheap_w32',
      'expensive_w33', 'buy_w34', 'sell_w35', 'gold_w36', 'silver_w37',
      'carpet_w38', 'spice_w39', 'perfume_w40', 'soap_w41', 'cloth_w42',
      'gift_w43', 'merchant_w44', 'customer_w45', 'scale_w46', 'coin_w47',
      // Expanded A1 trade (exp_a1_461..485, 25 words)
      ...r('exp_a1', 461, 485),
      // A2 work/business (exp_a2_0551..0600, 50 words)
      ...r('exp_a2', 551, 600, 4),
    ],
  },

  {
    id: 'travel_directions',
    name: 'Travel & Directions',
    nameArabic: 'السفر والاتجاهات',
    description: 'Navigate the Arabic-speaking world — directions, transport, clothing, and travel essentials.',
    cefrRange: 'A1-A2',
    wordIds: [
      // Curated directions (10)
      'right_1', 'left_1', 'above_1', 'below_1', 'north_1',
      'south_1', 'east_1', 'west_1', 'near_1', 'far_1',
      // Curated clothing (12)
      'thobe_w1', 'shoes_w2', 'hat_w3', 'dress_w4', 'shirt_w5', 'pants_w6',
      'scarf_w7', 'ring_w8', 'belt_w9', 'socks_w10', 'glasses_w11', 'bag_w12',
      // Expanded A1 directions (exp_a1_316..335, 20 words)
      ...r('exp_a1', 316, 335),
      // Expanded A1 clothing (exp_a1_436..460, 25 words)
      ...r('exp_a1', 436, 460),
      // A2 travel (exp_a2_0321..0345, 25 words)
      ...r('exp_a2', 321, 345, 4),
    ],
  },

  {
    id: 'verbs_action',
    name: 'Verbs in Action',
    nameArabic: 'أفعال الحركة',
    description: 'Master Arabic verbs across all levels — from basic daily actions to advanced derived verb forms.',
    cefrRange: 'A1-B1',
    wordIds: [
      // Curated verbs_basic (25)
      'eat_1', 'drink_1', 'go_1', 'come_1', 'see_1', 'hear_1', 'speak_1',
      'read_1', 'write_1', 'learn_1', 'know_1', 'understand_1', 'open_1',
      'close_1', 'sit_1', 'stand_1', 'walk_1', 'run_1', 'sleep_1',
      'wake_up_1', 'play_1', 'work_1', 'help_1', 'give_1', 'take_1',
      // Expanded A1 verbs_basic (exp_a1_376..435, 60 words)
      ...r('exp_a1', 376, 435),
      // B1 verbs (exp_b1_0227..0242, 16 words)
      ...r('exp_b1', 227, 242, 4),
    ],
  },

  {
    id: 'golden_age_science',
    name: 'Golden Age & Science',
    nameArabic: 'العصر الذهبي والعلوم',
    description: "Vocabulary from the Islamic Golden Age — science, mathematics, astronomy, and the civilizations that shaped the modern world.",
    cefrRange: 'B1-B2',
    wordIds: [
      // B1 science and nature (exp_b1_0593..0652, 60 words)
      ...r('exp_b1', 593, 652, 4),
      // B1 history and civilization (exp_b1_0713..0762, 50 words)
      ...r('exp_b1', 713, 762, 4),
    ],
  },

  {
    id: 'advanced_discourse',
    name: 'Advanced Discourse',
    nameArabic: 'الخطاب المتقدم',
    description: 'Higher-level vocabulary for religion, history, education, and academic discussion in Modern Standard Arabic.',
    cefrRange: 'B1-B2',
    wordIds: [
      // B1 Islamic history (exp_b1_0101..0120, 20 words)
      ...r('exp_b1', 101, 120, 4),
      // A2 education (exp_a2_0271..0320, 50 words)
      ...r('exp_a2', 271, 320, 4),
      // B2 advanced academic (exp_b2_0475..0504, 30 words)
      ...r('exp_b2', 475, 504, 4),
    ],
  },
];

// ── Lookup map ────────────────────────────────────────────────────────────────

const _byId = new Map(VOCAB_COLLECTIONS.map((c) => [c.id, c]));

// ── CEFR levels in order for range comparison ─────────────────────────────────
const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function _cefrInRange(level, cefrRange) {
  const parts = cefrRange.split('-');
  if (parts.length === 1) return level === parts[0];
  const low = CEFR_ORDER.indexOf(parts[0]);
  const high = CEFR_ORDER.indexOf(parts[1]);
  const idx = CEFR_ORDER.indexOf(level);
  return idx >= low && idx <= high;
}

// ── Selectors ─────────────────────────────────────────────────────────────────

/**
 * Get a collection by its ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function selectCollection(id) {
  return _byId.get(id) ?? null;
}

/**
 * Get all collections whose cefrRange includes the given CEFR level.
 * @param {string} cefrLevel — e.g. 'A1', 'B1'
 * @returns {Object[]}
 */
export function selectCollectionsByLevel(cefrLevel) {
  return VOCAB_COLLECTIONS.filter((c) => _cefrInRange(cefrLevel, c.cefrRange));
}

/**
 * Return a map of { collectionId: wordCount }.
 * @returns {Object}
 */
export function selectWordCountByCollection() {
  const result = {};
  for (const col of VOCAB_COLLECTIONS) {
    result[col.id] = col.wordIds.length;
  }
  return result;
}

/**
 * Calculate completion progress for a collection.
 * @param {string} collectionId
 * @param {string[]|Set<string>} masteredWordIds — word IDs the player has mastered
 * @returns {{ completed: number, total: number, pct: number } | null}
 */
export function selectCollectionProgress(collectionId, masteredWordIds) {
  const col = _byId.get(collectionId);
  if (!col) return null;
  const mastered = masteredWordIds instanceof Set ? masteredWordIds : new Set(masteredWordIds);
  const completed = col.wordIds.filter((id) => mastered.has(id)).length;
  const total = col.wordIds.length;
  return {
    completed,
    total,
    pct: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
