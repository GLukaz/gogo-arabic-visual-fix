/**
 * affixes.js — Arabic adjective vocabulary for equipment item bonuses (Phase 29)
 *
 * Each affix maps to a real Arabic adjective that players learn through equipment discovery.
 * Bonus multiplier: 50% if word is unlearned/learning, 100% if word is fully learned (Review state).
 */

export const AFFIXES = {
  // ────────────────────────────────────────────────
  // POSITIVE AFFIXES
  // ────────────────────────────────────────────────

  word_sharp: {
    arabic: 'حاد',
    english: 'Sharp',
    transliteration: 'ḥād',
    bonus: { damage: 0.05 },  // 5% damage boost
    type: 'positive',
  },

  word_blessed: {
    arabic: 'مبارك',
    english: 'Blessed',
    transliteration: 'mubārak',
    bonus: { mp: 10 },
    type: 'positive',
  },

  word_strong: {
    arabic: 'قوي',
    english: 'Strong',
    transliteration: 'qawī',
    bonus: { damage: 0.04, defense: 0.03 },
    type: 'positive',
  },

  word_swift: {
    arabic: 'سريع',
    english: 'Swift',
    transliteration: 'sarīʿ',
    bonus: { damage: 0.03 },
    type: 'positive',
  },

  word_wise: {
    arabic: 'حكيم',
    english: 'Wise',
    transliteration: 'ḥakīm',
    bonus: { mp: 15 },
    type: 'positive',
  },

  word_protected: {
    arabic: 'محمي',
    english: 'Protected',
    transliteration: 'maḥmī',
    bonus: { defense: 0.05 },
    type: 'positive',
  },

  word_healing: {
    arabic: 'شافي',
    english: 'Healing',
    transliteration: 'shāfī',
    bonus: { hp: 15 },
    type: 'positive',
  },

  word_burning: {
    arabic: 'محرق',
    english: 'Burning',
    transliteration: 'muḥriq',
    bonus: { damage: 0.06 },
    type: 'positive',
  },

  word_freezing: {
    arabic: 'مجمد',
    english: 'Freezing',
    transliteration: 'mujammad',
    bonus: { mp: 12 },
    type: 'positive',
  },

  word_thundering: {
    arabic: 'رعدي',
    english: 'Thundering',
    transliteration: 'raʿdī',
    bonus: { damage: 0.05, mp: 8 },
    type: 'positive',
  },

  word_noble: {
    arabic: 'نبيل',
    english: 'Noble',
    transliteration: 'nabīl',
    bonus: { hp: 10, defense: 0.02 },
    type: 'positive',
  },

  word_radiant: {
    arabic: 'مشرق',
    english: 'Radiant',
    transliteration: 'mushriq',
    bonus: { mp: 18, damage: 0.02 },
    type: 'positive',
  },

  word_ancient: {
    arabic: 'قديم',
    english: 'Ancient',
    transliteration: 'qadīm',
    bonus: { mp: 20 },
    type: 'positive',
  },

  word_sacred: {
    arabic: 'مقدس',
    english: 'Sacred',
    transliteration: 'muqaddas',
    bonus: { hp: 12, mp: 12 },
    type: 'positive',
  },

  word_brilliant: {
    arabic: 'لامع',
    english: 'Brilliant',
    transliteration: 'lāmiʿ',
    bonus: { damage: 0.04 },
    type: 'positive',
  },

  word_eternal: {
    arabic: 'أبدي',
    english: 'Eternal',
    transliteration: 'abadī',
    bonus: { hp: 20, defense: 0.03 },
    type: 'positive',
  },

  word_pure: {
    arabic: 'نقي',
    english: 'Pure',
    transliteration: 'naqī',
    bonus: { mp: 14 },
    type: 'positive',
  },

  word_mighty: {
    arabic: 'جبار',
    english: 'Mighty',
    transliteration: 'jabbār',
    bonus: { damage: 0.07 },
    type: 'positive',
  },

  // ────────────────────────────────────────────────
  // NEGATIVE AFFIXES (curses)
  // ────────────────────────────────────────────────

  word_heavy: {
    arabic: 'ثقيل',
    english: 'Heavy',
    transliteration: 'thaqīl',
    bonus: { damage: -0.02 },  // Penalty
    type: 'negative',
  },

  word_fragile: {
    arabic: 'هش',
    english: 'Fragile',
    transliteration: 'hash',
    bonus: { defense: -0.03 },
    type: 'negative',
  },

  word_cursed: {
    arabic: 'ملعون',
    english: 'Cursed',
    transliteration: 'malʿūn',
    bonus: { hp: -10 },
    type: 'negative',
  },

  word_rusty: {
    arabic: 'صدئ',
    english: 'Rusty',
    transliteration: 'ṣadiʾ',
    bonus: { damage: -0.03 },
    type: 'negative',
  },

  word_torn: {
    arabic: 'ممزق',
    english: 'Torn',
    transliteration: 'mumazzaq',
    bonus: { defense: -0.04 },
    type: 'negative',
  },

  word_broken: {
    arabic: 'مكسور',
    english: 'Broken',
    transliteration: 'maksūr',
    bonus: { damage: -0.05, defense: -0.02 },
    type: 'negative',
  },

  word_dull: {
    arabic: 'كليل',
    english: 'Dull',
    transliteration: 'kalīl',
    bonus: { damage: -0.04 },
    type: 'negative',
  },
};

/**
 * Max affixes allowed per rarity tier
 */
export const AFFIX_TIERS = {
  common: 0,
  uncommon: 1,
  rare: 1,
  epic: 2,
  legendary: 2,
};
