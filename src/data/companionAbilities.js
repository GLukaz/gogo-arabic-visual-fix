/**
 * companionAbilities.js — Ability trees for all 12 companions
 *
 * Each companion has 3 abilities unlocked at levels 5, 10, and 15.
 * Abilities are thematically tied to each companion's battle role and
 * teaching specialty.
 *
 * Level formula: level N is reached at N*100 cumulative XP (level 5 = 500 XP).
 */

// ────────────────────────────────────────────────
// Companion IDs (must match companionSlice.js)
// ────────────────────────────────────────────────

export const COMPANION_ABILITY_LEVELS = Object.freeze([5, 10, 15]);

export const MAX_COMPANION_LEVEL = 20;

// ────────────────────────────────────────────────
// Ability data: 12 companions × 3 abilities = 36 total
// ────────────────────────────────────────────────

export const COMPANION_ABILITIES = Object.freeze({
  companion_amira: [
    {
      id: 'amira_grammar_boost',
      unlocksAtLevel: 5,
      name: 'Grammar Boost',
      nameArabic: 'تعزيز النحو',
      description: 'Grammar attack damage increased by 20% while Amira is in the party.',
      effect: { type: 'grammarDamageBonus', value: 0.20 },
    },
    {
      id: 'amira_word_shield',
      unlocksAtLevel: 10,
      name: 'Word Shield',
      nameArabic: 'درع الكلمة',
      description: 'Once per battle, blocks the XP penalty from one wrong answer.',
      effect: { type: 'blockWrongAnswerPenalty', uses: 1 },
    },
    {
      id: 'amira_chronicle',
      unlocksAtLevel: 15,
      name: 'Chronicle',
      nameArabic: 'التوثيق',
      description: 'After each battle, flags missed words for priority review in the next quiz.',
      effect: { type: 'flagMissedWordsForReview', enabled: true },
    },
  ],

  companion_khalid: [
    {
      id: 'khalid_trade_terms',
      unlocksAtLevel: 5,
      name: 'Trade Terms',
      nameArabic: 'مصطلحات التجارة',
      description: 'Unlocks a vocabulary bonus round after each battle in a market zone.',
      effect: { type: 'bonusVocabRound', zone: 'desert_market' },
    },
    {
      id: 'khalid_desert_storm',
      unlocksAtLevel: 10,
      name: 'Desert Storm',
      nameArabic: 'عاصفة الصحراء',
      description: 'Khalid attacks all enemies for 50% damage when a vocabulary combo reaches 3.',
      effect: { type: 'aoeAttack', comboThreshold: 3, damageMultiplier: 0.5 },
    },
    {
      id: 'khalid_caravan_blessing',
      unlocksAtLevel: 15,
      name: 'Caravan Blessing',
      nameArabic: 'بركة القافلة',
      description: 'Gold earned from battles increased by 25%.',
      effect: { type: 'goldBonus', value: 0.25 },
    },
  ],

  companion_zahra: [
    {
      id: 'zahra_gentle_remedy',
      unlocksAtLevel: 5,
      name: 'Gentle Remedy',
      nameArabic: 'العلاج اللطيف',
      description: 'Restores 15% of player max HP after each battle.',
      effect: { type: 'postBattleHeal', percent: 0.15 },
    },
    {
      id: 'zahra_petal_ward',
      unlocksAtLevel: 10,
      name: 'Petal Ward',
      nameArabic: 'درع البتلة',
      description: 'Player is immune to poison and burn status effects.',
      effect: { type: 'statusImmunity', statuses: ['poison', 'burn'] },
    },
    {
      id: 'zahra_voice_of_flowers',
      unlocksAtLevel: 15,
      name: 'Voice of the Flowers',
      nameArabic: 'صوت الأزهار',
      description: 'Pronunciation practice awards 50% more listening XP.',
      effect: { type: 'xpBonus', skill: 'listening', value: 0.50 },
    },
  ],

  companion_omar: [
    {
      id: 'omar_haggle',
      unlocksAtLevel: 5,
      name: 'Haggle',
      nameArabic: 'المساومة',
      description: 'Reduces item purchase prices in shops by 10%.',
      effect: { type: 'shopDiscount', value: 0.10 },
    },
    {
      id: 'omar_market_insight',
      unlocksAtLevel: 10,
      name: 'Market Insight',
      nameArabic: 'بصيرة السوق',
      description: 'At the start of battle, reveals the word that deals most damage to the enemy.',
      effect: { type: 'revealWeakWord', timing: 'battleStart' },
    },
    {
      id: 'omar_trade_master',
      unlocksAtLevel: 15,
      name: 'Trade Master',
      nameArabic: 'سيد التجارة',
      description: 'Gold rewards from all battles increased by 25%.',
      effect: { type: 'goldBonus', value: 0.25 },
    },
  ],

  companion_layla: [
    {
      id: 'layla_night_study',
      unlocksAtLevel: 5,
      name: 'Night Study',
      nameArabic: 'الدراسة الليلية',
      description: 'All quiz XP rewards increased by 10%.',
      effect: { type: 'xpBonus', skill: 'all_quiz', value: 0.10 },
    },
    {
      id: 'layla_manuscript_guard',
      unlocksAtLevel: 10,
      name: 'Manuscript Guard',
      nameArabic: 'حارس المخطوطات',
      description: 'Incoming battle damage reduced by 15%.',
      effect: { type: 'damageReduction', value: 0.15 },
    },
    {
      id: 'layla_ancient_knowledge',
      unlocksAtLevel: 15,
      name: 'Ancient Knowledge',
      nameArabic: 'المعرفة القديمة',
      description: 'Grammar quizzes occasionally include bonus archaic-form questions for extra XP.',
      effect: { type: 'bonusGrammarQuestions', frequency: 0.2 },
    },
  ],

  companion_hassan: [
    {
      id: 'hassan_mountain_stance',
      unlocksAtLevel: 5,
      name: 'Mountain Stance',
      nameArabic: 'وقفة الجبل',
      description: 'Automatically blocks the first enemy attack each battle.',
      effect: { type: 'blockFirstAttack', uses: 1 },
    },
    {
      id: 'hassan_cultural_wisdom',
      unlocksAtLevel: 10,
      name: 'Cultural Wisdom',
      nameArabic: 'الحكمة الثقافية',
      description: 'Culture quiz and activity XP increased by 30%.',
      effect: { type: 'xpBonus', skill: 'culture', value: 0.30 },
    },
    {
      id: 'hassan_highland_oath',
      unlocksAtLevel: 15,
      name: 'Highland Oath',
      nameArabic: 'قسم الهضاب',
      description: 'All party members gain +20% defense while Hassan is active.',
      effect: { type: 'partyDefenseBonus', value: 0.20 },
    },
  ],

  companion_fatima: [
    {
      id: 'fatima_artifact_find',
      unlocksAtLevel: 5,
      name: 'Artifact Find',
      nameArabic: 'اكتشاف الأثر',
      description: '15% chance to discover a rare item after defeating an enemy in a ruin zone.',
      effect: { type: 'rareItemChance', zone: 'ancient_ruins', chance: 0.15 },
    },
    {
      id: 'fatima_ruin_memory',
      unlocksAtLevel: 10,
      name: 'Ruin Memory',
      nameArabic: 'ذاكرة الأطلال',
      description: 'Reveals hidden lore entries in ancient ruin zones, unlocking bonus culture XP.',
      effect: { type: 'revealLore', zone: 'ancient_ruins' },
    },
    {
      id: 'fatima_ancient_rites',
      unlocksAtLevel: 15,
      name: 'Ancient Rites',
      nameArabic: 'الطقوس القديمة',
      description: 'All XP earned in the ancient ruins zone increased by 25%.',
      effect: { type: 'zoneXpBonus', zone: 'ancient_ruins', value: 0.25 },
    },
  ],

  companion_ali: [
    {
      id: 'ali_herbal_salve',
      unlocksAtLevel: 5,
      name: 'Herbal Salve',
      nameArabic: 'الدهان العشبي',
      description: 'Once per battle, restores 20% of player max HP when HP falls below 30%.',
      effect: { type: 'emergencyHeal', threshold: 0.30, percent: 0.20, uses: 1 },
    },
    {
      id: 'ali_prayer_of_healing',
      unlocksAtLevel: 10,
      name: 'Prayer of Healing',
      nameArabic: 'دعاء الشفاء',
      description: 'After a battle loss, fully restores player HP before the retry.',
      effect: { type: 'postLossHeal', percent: 1.0 },
    },
    {
      id: 'ali_master_healer',
      unlocksAtLevel: 15,
      name: 'Master Healer',
      nameArabic: 'المعالج الماهر',
      description: 'Correct pronunciation answers trigger a small heal (5% max HP).',
      effect: { type: 'pronunciationHeal', percent: 0.05 },
    },
  ],

  companion_maryam: [
    {
      id: 'maryam_warriors_strike',
      unlocksAtLevel: 5,
      name: "Warrior's Strike",
      nameArabic: 'ضربة المحاربة',
      description: 'Critical hit chance increased by 15% on correct answers.',
      effect: { type: 'critChanceBonus', value: 0.15 },
    },
    {
      id: 'maryam_battle_grammar',
      unlocksAtLevel: 10,
      name: 'Battle Grammar',
      nameArabic: 'نحو المعركة',
      description: 'Grammar combo damage multiplier increased by 0.2.',
      effect: { type: 'grammarComboMultiplier', value: 0.2 },
    },
    {
      id: 'maryam_coastal_fury',
      unlocksAtLevel: 15,
      name: 'Coastal Fury',
      nameArabic: 'غضب الساحل',
      description: 'When player HP is above 80%, Maryam attacks twice per turn.',
      effect: { type: 'doubleAttack', hpThreshold: 0.80 },
    },
  ],

  companion_samir: [
    {
      id: 'samir_rapid_fire',
      unlocksAtLevel: 5,
      name: 'Rapid Fire',
      nameArabic: 'الضرب المتسارع',
      description: 'Attack speed bonus: answer timer extended by 3 seconds.',
      effect: { type: 'timerBonus', seconds: 3 },
    },
    {
      id: 'samir_pronunciation_punch',
      unlocksAtLevel: 10,
      name: 'Pronunciation Punch',
      nameArabic: 'لكمة النطق',
      description: 'Correct pronunciation practice attempts deal 10 bonus battle damage.',
      effect: { type: 'pronunciationBattleDamage', value: 10 },
    },
    {
      id: 'samir_brawlers_resolve',
      unlocksAtLevel: 15,
      name: "Brawler's Resolve",
      nameArabic: 'عزم المصارع',
      description: 'Once per battle, survive a lethal hit with 1 HP instead of being defeated.',
      effect: { type: 'surviveLethalHit', uses: 1 },
    },
  ],

  companion_nadia: [
    {
      id: 'nadia_mountain_herbs',
      unlocksAtLevel: 5,
      name: 'Mountain Herbs',
      nameArabic: 'أعشاب الجبال',
      description: 'All healing effects (from items and abilities) increased by 10%.',
      effect: { type: 'healingBonus', value: 0.10 },
    },
    {
      id: 'nadia_tradition_keeper',
      unlocksAtLevel: 10,
      name: 'Tradition Keeper',
      nameArabic: 'حارسة التراث',
      description: 'Culture bonus quests appear 30% more often.',
      effect: { type: 'questFrequency', category: 'culture', value: 0.30 },
    },
    {
      id: 'nadia_herbalists_blessing',
      unlocksAtLevel: 15,
      name: "Herbalist's Blessing",
      nameArabic: 'بركة العشابة',
      description: 'Removes all status effects from the player after each battle.',
      effect: { type: 'clearStatusEffects', timing: 'postBattle' },
    },
  ],

  companion_tariq: [
    {
      id: 'tariq_inscription_read',
      unlocksAtLevel: 5,
      name: 'Inscription Read',
      nameArabic: 'قراءة النقش',
      description: 'During quizzes, hints reveal one additional letter of the target word.',
      effect: { type: 'enhancedHint', extraLetters: 1 },
    },
    {
      id: 'tariq_ancient_guard',
      unlocksAtLevel: 10,
      name: 'Ancient Guard',
      nameArabic: 'الحارس القديم',
      description: 'XP lost from wrong answers reduced by 50%.',
      effect: { type: 'wrongAnswerXpPenaltyReduction', value: 0.50 },
    },
    {
      id: 'tariq_ruin_sentinel',
      unlocksAtLevel: 15,
      name: 'Ruin Sentinel',
      nameArabic: 'حارس الأطلال',
      description: 'All party defense increased by 25% when in the ancient ruins zone.',
      effect: { type: 'zoneDefenseBonus', zone: 'ancient_ruins', value: 0.25 },
    },
  ],
});

// ────────────────────────────────────────────────
// Level threshold helpers
// ────────────────────────────────────────────────

/**
 * Calculate companion level from cumulative XP.
 * Level N is reached when cumulative XP >= N * 100.
 * Minimum level 1, maximum level 20.
 *
 * @param {number} xp — cumulative XP earned
 * @returns {number} companion level (1-20)
 */
export function calculateCompanionLevel(xp) {
  if (xp <= 0) return 1;
  return Math.max(1, Math.min(MAX_COMPANION_LEVEL, Math.floor(xp / 100)));
}

/**
 * Returns all abilities unlocked at or below the given level.
 *
 * @param {string} companionId — companion identifier
 * @param {number} level — current companion level
 * @returns {Array} array of unlocked ability objects
 */
export function getCompanionAbilities(companionId, level) {
  const abilities = COMPANION_ABILITIES[companionId];
  if (!abilities) return [];
  return abilities.filter(ability => ability.unlocksAtLevel <= level);
}
