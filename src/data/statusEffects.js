/**
 * statusEffects.js — Battle status effects with Arabic names (v6.0 Phase 27, expanded Phase 32)
 *
 * Each status effect teaches Arabic vocabulary through combat.
 * Effects integrate with the learning system — knowing the Arabic word
 * for an effect helps the player understand and counter it.
 *
 * Phase 32 additions: 8 new effects (22 total), compound effects, level gating, compound detection.
 */

export const STATUS_EFFECTS = {
  // ── Offensive (damage over time) ──
  poison: {
    arabic: '\u0633\u064F\u0645\u0651',
    transliteration: 'summ',
    english: 'Poison',
    turns: 3,
    dot: 5,
    type: 'debuff',
    description: 'Deals damage each turn.',
  },
  burn: {
    arabic: '\u062D\u064E\u0631\u0642',
    transliteration: 'harq',
    english: 'Burn',
    turns: 3,
    dot: 8,
    type: 'debuff',
    description: 'Fire burns the target each turn.',
  },
  bleed: {
    arabic: '\u0646\u064E\u0632\u064A\u0641',
    transliteration: 'naz\u012Bf',
    english: 'Bleed',
    turns: 2,
    dot: 6,
    type: 'debuff',
    description: 'Open wounds cause ongoing damage.',
  },

  // ── Defensive (healing / reduction) ──
  shield: {
    arabic: '\u062F\u0650\u0631\u0639',
    transliteration: 'dir\u02BF',
    english: 'Shield',
    turns: 3,
    dmgReduce: 0.5,
    type: 'buff',
    description: 'Reduces incoming damage by half.',
  },
  regen: {
    arabic: '\u062A\u064E\u062C\u064E\u062F\u064F\u0651\u062F',
    transliteration: 'tajaddud',
    english: 'Regeneration',
    turns: 3,
    hot: 5,
    type: 'buff',
    description: 'Restores health each turn.',
  },

  // ── Control (disable / hinder) ──
  silence: {
    arabic: '\u0635\u064E\u0645\u062A',
    transliteration: '\u1E63amt',
    english: 'Silence',
    turns: 2,
    blockMagic: true,
    type: 'debuff',
    description: 'Cannot cast spells.',
  },
  slow: {
    arabic: '\u0628\u064F\u0637\u0621',
    transliteration: 'bu\u1E6D\u02BE',
    english: 'Slow',
    turns: 2,
    speedReduce: 0.5,
    type: 'debuff',
    description: 'Reduces speed, delaying turns.',
  },
  confuse: {
    arabic: '\u062D\u064E\u064A\u0631\u0629',
    transliteration: '\u1E25ayra',
    english: 'Confusion',
    turns: 1,
    scrambleChoices: true,
    type: 'debuff',
    description: 'Answer choices are scrambled.',
  },

  // ── Stat boosts ──
  strength: {
    arabic: '\u0642\u064F\u0648\u064E\u0651\u0629',
    transliteration: 'quwwa',
    english: 'Strength',
    turns: 3,
    dmgBoost: 1.3,
    type: 'buff',
    description: 'Increases attack damage by 30%.',
  },
  speed: {
    arabic: '\u0633\u064F\u0631\u0639\u0629',
    transliteration: 'sur\u02BFa',
    english: 'Haste',
    turns: 3,
    speedBoost: 1.5,
    type: 'buff',
    description: 'Increases speed by 50%.',
  },
  wisdom: {
    arabic: '\u062D\u0650\u0643\u0645\u0629',
    transliteration: '\u1E25ikma',
    english: 'Wisdom',
    turns: 3,
    xpBoost: 1.2,
    type: 'buff',
    description: 'Earn 20% more XP from this battle.',
  },
  courage: {
    arabic: '\u0634\u064E\u062C\u0627\u0639\u0629',
    transliteration: 'shaj\u0101\u02BFa',
    english: 'Courage',
    turns: 3,
    immuneFear: true,
    type: 'buff',
    description: 'Immune to fear effects.',
  },
  blessing: {
    arabic: '\u0628\u064E\u0631\u064E\u0643\u0629',
    transliteration: 'baraka',
    english: 'Blessing',
    turns: 3,
    dropBoost: 1.3,
    type: 'buff',
    description: 'Increases reward drops by 30%.',
  },

  // ── Stat debuffs ──
  blindness: {
    arabic: '\u0639\u064E\u0645\u0649',
    transliteration: '\u02BFam\u0101',
    english: 'Blindness',
    turns: 2,
    hideLetters: true,
    type: 'debuff',
    description: 'Some Arabic letters are hidden in prompts.',
  },
  fear: {
    arabic: '\u062E\u064E\u0648\u0641',
    transliteration: 'khawf',
    english: 'Fear',
    turns: 2,
    dmgReduce: 0.7,
    type: 'debuff',
    description: 'Reduces attack power by 30%.',
  },
  weakness: {
    arabic: '\u0636\u064E\u0639\u0641',
    transliteration: '\u1E0Da\u02BFf',
    english: 'Weakness',
    turns: 2,
    dmgReduce: 0.6,
    type: 'debuff',
    description: 'Reduces attack power by 40%.',
  },

  // ── Phase 32: New buffs ──
  focus: {
    arabic: '\u062A\u064E\u0631\u0643\u064A\u0632',
    transliteration: 'tark\u012Bz',
    english: 'Focus',
    turns: 3,
    accuracyBoost: 1.2,
    type: 'buff',
    description: 'Increases accuracy by 20%.',
  },
  swiftness: {
    arabic: '\u062E\u0650\u0641\u064E\u0651\u0629',
    transliteration: 'khiffa',
    english: 'Swiftness',
    turns: 2,
    extraTurn: true,
    type: 'buff',
    description: 'Grants an extra action this turn.',
  },
  inspiration: {
    arabic: '\u0625\u0650\u0644\u0647\u0627\u0645',
    transliteration: 'ilh\u0101m',
    english: 'Inspiration',
    turns: 3,
    comboBoost: 1.5,
    type: 'buff',
    description: 'Combo meter charges 50% faster.',
  },

  // ── Phase 32: New debuffs ──
  freeze: {
    arabic: '\u062A\u064E\u062C\u0645\u064F\u0651\u062F',
    transliteration: 'tajammud',
    english: 'Freeze',
    turns: 1,
    skipTurn: true,
    type: 'debuff',
    description: 'Target skips their next turn.',
  },
  curse: {
    arabic: '\u0644\u064E\u0639\u0646\u0629',
    transliteration: 'la\u02BFna',
    english: 'Curse',
    turns: 3,
    healReduce: 0.5,
    type: 'debuff',
    description: 'Reduces healing received by 50%.',
  },
  fatigue: {
    arabic: '\u0625\u0650\u0631\u0647\u0627\u0642',
    transliteration: 'irh\u0101q',
    english: 'Fatigue',
    turns: 2,
    mpDrain: 5,
    type: 'debuff',
    description: 'Drains MP each turn.',
  },
  expose: {
    arabic: '\u0643\u064E\u0634\u0641',
    transliteration: 'kashf',
    english: 'Expose',
    turns: 2,
    dmgTakenBoost: 1.3,
    type: 'debuff',
    description: 'Target takes 30% more damage.',
  },
  confusion: {
    arabic: '\u0627\u0650\u0631\u062A\u0628\u0627\u0643',
    transliteration: 'irtib\u0101k',
    english: 'Bewilderment',
    turns: 2,
    comboBreak: true,
    type: 'debuff',
    description: 'Breaks enemy combo chain.',
  },
};

/**
 * Compound effects — triggered when two component status effects are active simultaneously.
 * Each compound has its own Arabic vocabulary for FSRS learning.
 */
export const COMPOUND_EFFECTS = {
  resilience: {
    components: ['shield', 'strength'],
    arabic: '\u0635\u064F\u0645\u0648\u062F',
    transliteration: '\u1E63um\u016Bd',
    english: 'Resilience',
    effect: { dmgBoost: 1.2, dmgReduce: 0.6 },
    turns: 2,
  },
  corrosion: {
    components: ['poison', 'burn'],
    arabic: '\u062A\u064E\u0622\u0643\u064F\u0644',
    transliteration: 'ta\u02BE\u0101kul',
    english: 'Corrosion',
    effect: { dot: 15 },
    turns: 2,
  },
  petrify: {
    components: ['freeze', 'slow'],
    arabic: '\u062A\u064E\u062D\u064E\u062C\u064F\u0651\u0631',
    transliteration: 'ta\u1E25ajjur',
    english: 'Petrification',
    effect: { skipTurn: true, dmgTakenBoost: 1.5 },
    turns: 1,
  },
  clarity: {
    components: ['wisdom', 'focus'],
    arabic: '\u0635\u064E\u0641\u0627\u0621',
    transliteration: '\u1E63af\u0101\u02BE',
    english: 'Clarity',
    effect: { xpBoost: 1.5, accuracyBoost: 1.3 },
    turns: 3,
  },
  berserk: {
    components: ['strength', 'courage'],
    arabic: '\u0647\u0650\u064A\u0627\u062C',
    transliteration: 'hiy\u0101j',
    english: 'Berserk',
    effect: { dmgBoost: 1.8, dmgReduce: 0.8 },
    turns: 2,
  },
  doom: {
    components: ['curse', 'weakness'],
    arabic: '\u0647\u064E\u0644\u0627\u0643',
    transliteration: 'hal\u0101k',
    english: 'Doom',
    effect: { dot: 10, healReduce: 0.0 },
    turns: 3,
  },
};

/**
 * Ordered list of all effect IDs for level-gating.
 * The order determines which effects unlock at which player level tier.
 * @type {string[]}
 */
const EFFECT_ORDER = Object.keys(STATUS_EFFECTS);

/**
 * Get a status effect by ID.
 * @param {string} effectId
 * @returns {Object|undefined}
 */
export function getStatusEffect(effectId) {
  return STATUS_EFFECTS[effectId];
}

/**
 * Get all buff effects.
 * @returns {[string, Object][]}
 */
export function getBuffs() {
  return Object.entries(STATUS_EFFECTS).filter(([, e]) => e.type === 'buff');
}

/**
 * Get all debuff effects.
 * @returns {[string, Object][]}
 */
export function getDebuffs() {
  return Object.entries(STATUS_EFFECTS).filter(([, e]) => e.type === 'debuff');
}

/**
 * Detect if active effects contain all components of any compound effect.
 * Returns the compound object with `shouldReplace` array of component IDs, or null.
 *
 * @param {Array<{id: string}>} activeEffects - Array of active effect objects with id property
 * @returns {{ id: string, shouldReplace: string[], ...Object }|null}
 */
export function detectCompoundEffect(activeEffects) {
  const activeIds = new Set(activeEffects.map((e) => e.id));

  for (const [compoundId, compound] of Object.entries(COMPOUND_EFFECTS)) {
    if (compound.components.every((c) => activeIds.has(c))) {
      return {
        id: compoundId,
        shouldReplace: [...compound.components],
        ...compound,
      };
    }
  }

  return null;
}

/**
 * Get status effects available at a given player level.
 * Prevents FSRS queue flooding by gating effects progressively:
 *   Level 1-5:   first 10 effects
 *   Level 6-10:  first 16 effects
 *   Level 11+:   all 22 effects
 *
 * @param {number} playerLevel
 * @returns {[string, Object][]} Array of [id, effectData] entries
 */
export function getStatusEffectsByLevel(playerLevel) {
  let count;
  if (playerLevel <= 5) {
    count = 10;
  } else if (playerLevel <= 10) {
    count = 16;
  } else {
    count = EFFECT_ORDER.length;
  }

  const allowed = EFFECT_ORDER.slice(0, count);
  return allowed.map((id) => [id, STATUS_EFFECTS[id]]);
}
