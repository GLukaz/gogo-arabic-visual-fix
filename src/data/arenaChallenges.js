/**
 * arenaChallenges.js — Arena challenge configuration data (Phase 32)
 *
 * Defines arena modes, wave scaling, boss rush sequences, and puzzle battle configs.
 * Arena provides endgame replayable content where Arabic mastery is tested.
 */

// ──────────────────────────────────────────────────
// Arena Modes
// ──────────────────────────────────────────────────

export const ARENA_MODES = {
  survival: {
    id: 'survival',
    name: 'Survival Arena',
    nameArabic: 'ساحة البقاء',
    description: 'Survive waves of enemies with increasing Arabic difficulty',
    maxWaves: 10,
    unlockLevel: 5,
  },
  boss_rush: {
    id: 'boss_rush',
    name: 'Boss Rush',
    nameArabic: 'تحدي الرؤساء',
    description: 'Face all bosses in sequence',
    maxWaves: null, // Dynamic based on boss count
    unlockLevel: 10,
  },
  puzzle: {
    id: 'puzzle',
    name: 'Puzzle Battles',
    nameArabic: 'معارك الألغاز',
    description: 'Solve Arabic puzzles to defeat enemies',
    maxWaves: 5,
    unlockLevel: 8,
  },
};

// ──────────────────────────────────────────────────
// Wave Configuration (Survival Mode)
// ──────────────────────────────────────────────────

/**
 * Returns wave configuration for the given wave number.
 * Difficulty scales with wave progression.
 *
 * @param {number} waveNumber - Wave number (1-based)
 * @returns {{ enemyCount: number, hpMultiplier: number, arabicDifficulty: string, timeLimit: number, bonusObjective: string|null }}
 */
export function getWaveConfig(waveNumber) {
  const wave = Math.max(1, waveNumber);

  // Bonus objectives at milestone waves
  let bonusObjective = null;
  if (wave === 5) bonusObjective = 'no_hints';
  else if (wave === 8) bonusObjective = 'perfect_accuracy';
  else if (wave === 10) bonusObjective = 'speed_clear';

  return {
    enemyCount: Math.min(4, 1 + Math.floor(wave / 3)),
    hpMultiplier: 1 + wave * 0.15,
    arabicDifficulty: wave <= 3 ? 'choice' : wave <= 7 ? 'type' : 'type_hard',
    timeLimit: Math.max(60000, 120000 - wave * 5000),
    bonusObjective,
  };
}

// ──────────────────────────────────────────────────
// Boss Rush Sequence
// ──────────────────────────────────────────────────

/**
 * Boss rush sequence in story order (easiest to hardest).
 * Boss IDs reference enemies.js boss entries.
 * Interludes provide narrative breathing room between fights.
 */
export const BOSS_RUSH_SEQUENCE = [
  {
    bossId: 'oasis-guardian',
    interlude: {
      arabic: 'تبدأ رحلتك من الواحة. حارسها القديم يختبر عزيمتك الأولى.',
      english: 'Your journey begins at the oasis. Its ancient guardian tests your first resolve.',
    },
  },
  {
    bossId: 'keeper-of-words',
    interlude: {
      arabic: 'تدخل المكتبة القديمة حيث تحيا الكلمات. حافظ الكلمات ينتظرك.',
      english: 'You enter the ancient library where words come alive. The Keeper of Words awaits.',
    },
  },
  {
    bossId: 'merchant-prince',
    interlude: {
      arabic: 'السوق يضجّ بالأصوات. أمير التجار يتحداك في فنّ المساومة.',
      english: 'The marketplace roars with voices. The Merchant Prince challenges your bargaining art.',
    },
  },
  {
    bossId: 'tide-lord',
    interlude: {
      arabic: 'الأمواج تعلو وتهبط. سيّد المدّ يحكم هذا الميناء بقبضة من ماء.',
      english: 'The waves rise and fall. The Tide Lord rules this port with a fist of water.',
    },
  },
  {
    bossId: 'shadow-vizier',
    interlude: {
      arabic: 'ظلال القصر تتحرّك. الوزير المظلم يكشف عن قوّته الحقيقية.',
      english: 'The palace shadows stir. The Shadow Vizier reveals his true power.',
    },
  },
  {
    bossId: 'mountain-elder',
    interlude: {
      arabic: 'القمّة الأخيرة. شيخ الجبل يختبر كلّ ما تعلّمته في رحلتك.',
      english: 'The final summit. The Mountain Elder tests everything you have learned on your journey.',
    },
  },
];

// ──────────────────────────────────────────────────
// Puzzle Battles
// ──────────────────────────────────────────────────

export const PUZZLE_BATTLES = [
  {
    id: 'puzzle_grammar_agreement',
    name: 'Agreement Challenge',
    nameArabic: 'تحدي التوافق',
    puzzleType: 'grammar_pattern',
    description: 'Match nouns with their correctly agreeing adjectives in gender and definiteness',
    requiredKnowledge: ['noun-adjective-agreement'],
    enemyParty: ['scroll-golem'],
    victoryCondition: 'solve_3_puzzles',
  },
  {
    id: 'puzzle_verb_roots',
    name: 'Root Extraction',
    nameArabic: 'استخراج الجذور',
    puzzleType: 'root_extraction',
    description: 'Identify the three-letter root from conjugated verb forms',
    requiredKnowledge: ['basic-verb-conjugation'],
    enemyParty: ['ink-wraith'],
    victoryCondition: 'solve_3_puzzles',
  },
  {
    id: 'puzzle_definite_article',
    name: 'Sun and Moon',
    nameArabic: 'الشمس والقمر',
    puzzleType: 'grammar_pattern',
    description: 'Sort words by sun and moon letter pronunciation of the definite article',
    requiredKnowledge: ['al-definite'],
    enemyParty: ['dust-sprite'],
    victoryCondition: 'complete_pattern',
  },
  {
    id: 'puzzle_vocab_elements',
    name: 'Elemental Vocabulary',
    nameArabic: 'مفردات العناصر',
    puzzleType: 'vocabulary_match',
    description: 'Match Arabic elemental vocabulary to their English meanings under time pressure',
    requiredKnowledge: ['al-definite', 'personal-pronouns'],
    enemyParty: ['sand-djinn'],
    victoryCondition: 'solve_3_puzzles',
  },
  {
    id: 'puzzle_sentence_order',
    name: 'Word Order',
    nameArabic: 'ترتيب الكلمات',
    puzzleType: 'grammar_pattern',
    description: 'Arrange scrambled Arabic words into correct VSO sentence order',
    requiredKnowledge: ['basic-verb-conjugation', 'noun-adjective-agreement'],
    enemyParty: ['storm-caller'],
    victoryCondition: 'complete_pattern',
  },
];
