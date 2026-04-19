/**
 * grammarCombos.js — Grammar-based combat combo definitions (Phase 32)
 *
 * Grammar combos tie Arabic learning directly to combat power.
 * Knowing noun+adjective agreement or verb conjugation patterns unlocks stronger attacks.
 *
 * Three combo categories:
 * 1. NOUN_ADJ_COMBOS — Noun+adjective agreement (idaafa-style constructions)
 * 2. VERB_CHAIN_PATTERNS — Verb root form chains (Form I -> II -> IV escalation)
 * 3. SENTENCE_TEMPLATES — Full sentence construction (ultimate attacks)
 */

// ──────────────────────────────────────────────────
// 1. Noun + Adjective Combos (8 templates)
// ──────────────────────────────────────────────────

export const NOUN_ADJ_COMBOS = [
  {
    id: 'na_strong_shield',
    noun: { arabic: 'درع', english: 'shield' },
    adjective: { arabic: 'قوي', english: 'strong' },
    combined: { arabic: 'درع قوي', english: 'strong shield' },
    damageMultiplier: 1.3,
    requiredLesson: 'noun-adjective-agreement',
    comboType: 'noun_adjective',
    cefrLevel: 'A2',
  },
  {
    id: 'na_sharp_sword',
    noun: { arabic: 'سيف', english: 'sword' },
    adjective: { arabic: 'حاد', english: 'sharp' },
    combined: { arabic: 'سيف حاد', english: 'sharp sword' },
    damageMultiplier: 1.4,
    requiredLesson: 'noun-adjective-agreement',
    comboType: 'noun_adjective',
    cefrLevel: 'A2',
  },
  {
    id: 'na_blazing_fire',
    noun: { arabic: 'نار', english: 'fire' },
    adjective: { arabic: 'مشتعلة', english: 'blazing' },
    combined: { arabic: 'نار مشتعلة', english: 'blazing fire' },
    damageMultiplier: 1.5,
    requiredLesson: 'noun-adjective-agreement',
    comboType: 'noun_adjective',
    cefrLevel: 'A2',
  },
  {
    id: 'na_deep_water',
    noun: { arabic: 'ماء', english: 'water' },
    adjective: { arabic: 'عميق', english: 'deep' },
    combined: { arabic: 'ماء عميق', english: 'deep water' },
    damageMultiplier: 1.3,
    requiredLesson: 'noun-adjective-agreement',
    comboType: 'noun_adjective',
    cefrLevel: 'A2',
  },
  {
    id: 'na_fast_arrow',
    noun: { arabic: 'سهم', english: 'arrow' },
    adjective: { arabic: 'سريع', english: 'fast' },
    combined: { arabic: 'سهم سريع', english: 'fast arrow' },
    damageMultiplier: 1.4,
    requiredLesson: 'noun-adjective-agreement',
    comboType: 'noun_adjective',
    cefrLevel: 'A2',
  },
  {
    id: 'na_heavy_hammer',
    noun: { arabic: 'مطرقة', english: 'hammer' },
    adjective: { arabic: 'ثقيلة', english: 'heavy' },
    combined: { arabic: 'مطرقة ثقيلة', english: 'heavy hammer' },
    damageMultiplier: 1.5,
    requiredLesson: 'noun-adjective-agreement',
    comboType: 'noun_adjective',
    cefrLevel: 'A2',
  },
  {
    id: 'na_bright_light',
    noun: { arabic: 'نور', english: 'light' },
    adjective: { arabic: 'ساطع', english: 'bright' },
    combined: { arabic: 'نور ساطع', english: 'bright light' },
    damageMultiplier: 1.2,
    requiredLesson: 'noun-adjective-agreement',
    comboType: 'noun_adjective',
    cefrLevel: 'A2',
  },
  {
    id: 'na_solid_wall',
    noun: { arabic: 'جدار', english: 'wall' },
    adjective: { arabic: 'صلب', english: 'solid' },
    combined: { arabic: 'جدار صلب', english: 'solid wall' },
    damageMultiplier: 1.3,
    requiredLesson: 'noun-adjective-agreement',
    comboType: 'noun_adjective',
    cefrLevel: 'A2',
  },
];

// ──────────────────────────────────────────────────
// 2. Verb Chain Patterns (5 root patterns)
// ──────────────────────────────────────────────────

export const VERB_CHAIN_PATTERNS = [
  {
    id: 'vc_ktb',
    root: { arabic: 'ك-ت-ب', english: 'write' },
    forms: [
      { formNumber: 'I', arabic: 'كَتَبَ', english: 'wrote', damageMultiplier: 1.0 },
      { formNumber: 'II', arabic: 'كَتَّبَ', english: 'dictated', damageMultiplier: 1.2 },
      { formNumber: 'IV', arabic: 'أَكْتَبَ', english: 'had (someone) write', damageMultiplier: 1.5 },
    ],
    maxChainLength: 3,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'verb_chain',
    cefrLevel: 'B1',
  },
  {
    id: 'vc_ilm',
    root: { arabic: 'ع-ل-م', english: 'know' },
    forms: [
      { formNumber: 'I', arabic: 'عَلِمَ', english: 'knew', damageMultiplier: 1.0 },
      { formNumber: 'II', arabic: 'عَلَّمَ', english: 'taught', damageMultiplier: 1.2 },
      { formNumber: 'V', arabic: 'تَعَلَّمَ', english: 'learned', damageMultiplier: 1.5 },
    ],
    maxChainLength: 3,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'verb_chain',
    cefrLevel: 'B1',
  },
  {
    id: 'vc_fth',
    root: { arabic: 'ف-ت-ح', english: 'open' },
    forms: [
      { formNumber: 'I', arabic: 'فَتَحَ', english: 'opened', damageMultiplier: 1.0 },
      { formNumber: 'II', arabic: 'فَتَّحَ', english: 'unlocked', damageMultiplier: 1.2 },
      { formNumber: 'VIII', arabic: 'اِفْتَتَحَ', english: 'inaugurated', damageMultiplier: 1.5 },
    ],
    maxChainLength: 3,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'verb_chain',
    cefrLevel: 'B1',
  },
  {
    id: 'vc_hfz',
    root: { arabic: 'ح-ف-ظ', english: 'preserve' },
    forms: [
      { formNumber: 'I', arabic: 'حَفِظَ', english: 'memorized', damageMultiplier: 1.0 },
      { formNumber: 'II', arabic: 'حَفَّظَ', english: 'made memorize', damageMultiplier: 1.2 },
      { formNumber: 'III', arabic: 'حافَظَ', english: 'preserved', damageMultiplier: 1.5 },
    ],
    maxChainLength: 3,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'verb_chain',
    cefrLevel: 'B1',
  },
  {
    id: 'vc_jma',
    root: { arabic: 'ج-م-ع', english: 'gather' },
    forms: [
      { formNumber: 'I', arabic: 'جَمَعَ', english: 'gathered', damageMultiplier: 1.0 },
      { formNumber: 'II', arabic: 'جَمَّعَ', english: 'assembled', damageMultiplier: 1.2 },
      { formNumber: 'VIII', arabic: 'اِجْتَمَعَ', english: 'convened', damageMultiplier: 1.5 },
    ],
    maxChainLength: 3,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'verb_chain',
    cefrLevel: 'B1',
  },
];

// ──────────────────────────────────────────────────
// 3. Sentence Templates (4 ultimate attacks)
// ──────────────────────────────────────────────────

export const SENTENCE_TEMPLATES = [
  {
    id: 'st_warrior_strikes',
    template: {
      arabic: 'ضَرَبَ المُحارِبُ العَدُوَّ',
      english: 'The warrior struck the enemy',
      structure: 'VSO',
    },
    slots: [
      {
        role: 'verb',
        arabic: 'ضَرَبَ',
        english: 'struck',
        alternatives: [
          { arabic: 'هاجَمَ', english: 'attacked' },
          { arabic: 'قاتَلَ', english: 'fought' },
        ],
      },
      {
        role: 'subject',
        arabic: 'المُحارِبُ',
        english: 'the warrior',
        alternatives: [
          { arabic: 'الفارِسُ', english: 'the knight' },
          { arabic: 'البَطَلُ', english: 'the hero' },
        ],
      },
      {
        role: 'object',
        arabic: 'العَدُوَّ',
        english: 'the enemy',
        alternatives: [
          { arabic: 'الوَحْشَ', english: 'the beast' },
          { arabic: 'الشَّيطانَ', english: 'the demon' },
        ],
      },
    ],
    damageMultiplier: 2.5,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'ultimate_sentence',
    cefrLevel: 'B1',
  },
  {
    id: 'st_mage_casts',
    template: {
      arabic: 'أَطْلَقَ السّاحِرُ النّارَ',
      english: 'The mage unleashed the fire',
      structure: 'VSO',
    },
    slots: [
      {
        role: 'verb',
        arabic: 'أَطْلَقَ',
        english: 'unleashed',
        alternatives: [
          { arabic: 'أَشْعَلَ', english: 'ignited' },
          { arabic: 'أَرْسَلَ', english: 'sent' },
        ],
      },
      {
        role: 'subject',
        arabic: 'السّاحِرُ',
        english: 'the mage',
        alternatives: [
          { arabic: 'العالِمُ', english: 'the scholar' },
          { arabic: 'الحَكيمُ', english: 'the sage' },
        ],
      },
      {
        role: 'object',
        arabic: 'النّارَ',
        english: 'the fire',
        alternatives: [
          { arabic: 'البَرْقَ', english: 'the lightning' },
          { arabic: 'الرّيحَ', english: 'the wind' },
        ],
      },
    ],
    damageMultiplier: 2.8,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'ultimate_sentence',
    cefrLevel: 'B1',
  },
  {
    id: 'st_defender_protects',
    template: {
      arabic: 'حَمى الحارِسُ القَرْيَةَ',
      english: 'The guardian protected the village',
      structure: 'VSO',
    },
    slots: [
      {
        role: 'verb',
        arabic: 'حَمى',
        english: 'protected',
        alternatives: [
          { arabic: 'دافَعَ عن', english: 'defended' },
          { arabic: 'صانَ', english: 'safeguarded' },
        ],
      },
      {
        role: 'subject',
        arabic: 'الحارِسُ',
        english: 'the guardian',
        alternatives: [
          { arabic: 'الجُنْدِيُّ', english: 'the soldier' },
          { arabic: 'الحامي', english: 'the protector' },
        ],
      },
      {
        role: 'object',
        arabic: 'القَرْيَةَ',
        english: 'the village',
        alternatives: [
          { arabic: 'المَدينَةَ', english: 'the city' },
          { arabic: 'الشَّعْبَ', english: 'the people' },
        ],
      },
    ],
    damageMultiplier: 2.5,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'ultimate_sentence',
    cefrLevel: 'B1',
  },
  {
    id: 'st_healer_restores',
    template: {
      arabic: 'شَفى الطَّبيبُ الجُرْحَ',
      english: 'The healer cured the wound',
      structure: 'VSO',
    },
    slots: [
      {
        role: 'verb',
        arabic: 'شَفى',
        english: 'cured',
        alternatives: [
          { arabic: 'عالَجَ', english: 'treated' },
          { arabic: 'أَصْلَحَ', english: 'mended' },
        ],
      },
      {
        role: 'subject',
        arabic: 'الطَّبيبُ',
        english: 'the healer',
        alternatives: [
          { arabic: 'الحَكيمُ', english: 'the wise one' },
          { arabic: 'المُعالِجُ', english: 'the therapist' },
        ],
      },
      {
        role: 'object',
        arabic: 'الجُرْحَ',
        english: 'the wound',
        alternatives: [
          { arabic: 'المَريضَ', english: 'the patient' },
          { arabic: 'الأَلَمَ', english: 'the pain' },
        ],
      },
    ],
    damageMultiplier: 3.0,
    requiredLesson: 'basic-verb-conjugation',
    comboType: 'ultimate_sentence',
    cefrLevel: 'B1',
  },
];

// ──────────────────────────────────────────────────
// CEFR level gating thresholds
// ──────────────────────────────────────────────────

const CEFR_LEVEL_REQUIREMENTS = {
  A1: 1,
  A2: 3,
  B1: 7,
  B2: 12,
  C1: 18,
  C2: 25,
};

// ──────────────────────────────────────────────────
// Helper: getAvailableCombos
// ──────────────────────────────────────────────────

/**
 * Returns available combos filtered by completed grammar lessons and player level.
 *
 * @param {string[]} completedLessons - Array of grammar lesson IDs the player has completed
 * @param {number} playerLevel - Player's current level
 * @returns {{ nounAdj: Array, verbChains: Array, sentences: Array }}
 */
export function getAvailableCombos(completedLessons, playerLevel) {
  const lessons = completedLessons || [];
  const level = playerLevel || 0;

  function isAvailable(combo) {
    // Must have completed required lesson
    if (!lessons.includes(combo.requiredLesson)) return false;

    // Must meet CEFR level requirement
    const requiredLevel = CEFR_LEVEL_REQUIREMENTS[combo.cefrLevel] || 1;
    if (level < requiredLevel) return false;

    return true;
  }

  return {
    nounAdj: NOUN_ADJ_COMBOS.filter(isAvailable),
    verbChains: VERB_CHAIN_PATTERNS.filter(isAvailable),
    sentences: SENTENCE_TEMPLATES.filter(isAvailable),
  };
}
