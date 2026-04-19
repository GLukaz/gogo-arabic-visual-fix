/**
 * elementCombos.js — 20 spell combo definitions
 *
 * Combos trigger when casting two spells of specific elements in sequence.
 * Each combo has damage multipliers and special effects.
 */

export const ELEMENT_COMBOS = [
  // ========== FIRE COMBOS (4) ==========
  {
    id: 'combo_inferno',
    elements: ['fire', 'fire'],
    name: 'Inferno',
    nameArabic: 'جحيم',
    damageMultiplier: 1.5,
    statusEffect: 'burn',
    statusDuration: 3,
    vfxType: 'inferno',
    rootRequirement: 2,
  },
  {
    id: 'combo_steam',
    elements: ['fire', 'water'],
    name: 'Steam Burst',
    nameArabic: 'انفجار البخار',
    damageMultiplier: 1.3,
    statusEffect: 'confused',
    statusDuration: 2,
    vfxType: 'steam',
    rootRequirement: 2,
  },
  {
    id: 'combo_magma',
    elements: ['earth', 'fire'],
    name: 'Magma Flow',
    nameArabic: 'تدفق الصهارة',
    damageMultiplier: 1.6,
    statusEffect: 'burn',
    statusDuration: 2,
    vfxType: 'magma',
    rootRequirement: 3,
  },
  {
    id: 'combo_wildfire',
    elements: ['fire', 'wind'],
    name: 'Wildfire',
    nameArabic: 'حريق هائج',
    damageMultiplier: 1.8,
    statusEffect: 'burn',
    statusDuration: 2,
    vfxType: 'wildfire',
    rootRequirement: 2,
  },

  // ========== WATER COMBOS (3) ==========
  {
    id: 'combo_tsunami',
    elements: ['water', 'water'],
    name: 'Tsunami',
    nameArabic: 'تسونامي',
    damageMultiplier: 1.5,
    statusEffect: 'slow',
    statusDuration: 2,
    vfxType: 'tsunami',
    rootRequirement: 2,
  },
  {
    id: 'combo_mudslide',
    elements: ['earth', 'water'],
    name: 'Mudslide',
    nameArabic: 'انزلاق طيني',
    damageMultiplier: 1.4,
    statusEffect: 'paralyzed',
    statusDuration: 2,
    vfxType: 'mudslide',
    rootRequirement: 2,
  },
  {
    id: 'combo_flood',
    elements: ['water', 'wind'],
    name: 'Flood',
    nameArabic: 'فيضان',
    damageMultiplier: 1.6,
    statusEffect: 'defense_down',
    statusDuration: 3,
    vfxType: 'flood',
    rootRequirement: 3,
  },

  // ========== EARTH COMBOS (2) ==========
  {
    id: 'combo_earthquake',
    elements: ['earth', 'earth'],
    name: 'Earthquake',
    nameArabic: 'زلزال',
    damageMultiplier: 1.5,
    statusEffect: 'stunned',
    statusDuration: 1,
    vfxType: 'earthquake',
    rootRequirement: 2,
  },
  {
    id: 'combo_sandstorm',
    elements: ['earth', 'wind'],
    name: 'Sandstorm',
    nameArabic: 'عاصفة رملية',
    damageMultiplier: 1.4,
    statusEffect: 'blind',
    statusDuration: 2,
    vfxType: 'sandstorm',
    rootRequirement: 2,
  },

  // ========== WIND COMBOS (1) ==========
  {
    id: 'combo_cyclone',
    elements: ['wind', 'wind'],
    name: 'Cyclone',
    nameArabic: 'إعصار',
    damageMultiplier: 1.5,
    statusEffect: 'confused',
    statusDuration: 2,
    vfxType: 'cyclone',
    rootRequirement: 2,
  },

  // ========== LIGHT COMBOS (3) ==========
  {
    id: 'combo_supernova',
    elements: ['light', 'light'],
    name: 'Supernova',
    nameArabic: 'مستعر أعظم',
    damageMultiplier: 1.6,
    statusEffect: 'blind',
    statusDuration: 2,
    vfxType: 'supernova',
    rootRequirement: 3,
  },
  {
    id: 'combo_aurora',
    elements: ['light', 'time'],
    name: 'Aurora',
    nameArabic: 'الشفق القطبي',
    damageMultiplier: 1.4,
    statusEffect: 'regen',
    statusDuration: 3,
    vfxType: 'aurora',
    rootRequirement: 2,
  },
  {
    id: 'combo_revelation',
    elements: ['knowledge', 'light'],
    name: 'Revelation',
    nameArabic: 'وحي',
    damageMultiplier: 1.7,
    statusEffect: 'reveal',
    statusDuration: 3,
    vfxType: 'revelation',
    rootRequirement: 3,
  },

  // ========== SHADOW COMBOS (2) ==========
  {
    id: 'combo_abyss',
    elements: ['shadow', 'shadow'],
    name: 'Abyss',
    nameArabic: 'هاوية',
    damageMultiplier: 1.6,
    statusEffect: 'cursed',
    statusDuration: 3,
    vfxType: 'abyss',
    rootRequirement: 3,
  },
  {
    id: 'combo_twilight',
    elements: ['light', 'shadow'],
    name: 'Twilight',
    nameArabic: 'شفق',
    damageMultiplier: 1.5,
    statusEffect: 'confused',
    statusDuration: 2,
    vfxType: 'twilight',
    rootRequirement: 2,
  },

  // ========== TIME COMBOS (2) ==========
  {
    id: 'combo_entropy',
    elements: ['time', 'time'],
    name: 'Entropy',
    nameArabic: 'الانتروبيا',
    damageMultiplier: 1.5,
    statusEffect: 'slow',
    statusDuration: 3,
    vfxType: 'entropy',
    rootRequirement: 3,
  },
  {
    id: 'combo_genesis',
    elements: ['creation', 'time'],
    name: 'Genesis',
    nameArabic: 'تكوين',
    damageMultiplier: 1.8,
    statusEffect: 'regen',
    statusDuration: 3,
    vfxType: 'genesis',
    rootRequirement: 4,
  },

  // ========== KNOWLEDGE COMBOS (1) ==========
  {
    id: 'combo_wisdom',
    elements: ['knowledge', 'knowledge'],
    name: 'Wisdom',
    nameArabic: 'حكمة',
    damageMultiplier: 1.5,
    statusEffect: 'attack_up',
    statusDuration: 3,
    vfxType: 'wisdom',
    rootRequirement: 2,
  },

  // ========== CREATION COMBOS (1) ==========
  {
    id: 'combo_forge',
    elements: ['creation', 'fire'],
    name: 'Forge',
    nameArabic: 'مطرقة',
    damageMultiplier: 1.6,
    statusEffect: 'attack_up',
    statusDuration: 2,
    vfxType: 'forge',
    rootRequirement: 3,
  },

  // ========== PROTECTION COMBOS (1) ==========
  {
    id: 'combo_bastion',
    elements: ['protection', 'protection'],
    name: 'Bastion',
    nameArabic: 'معقل',
    damageMultiplier: 1.3,
    statusEffect: 'shield',
    statusDuration: 3,
    vfxType: 'bastion',
    rootRequirement: 2,
  },
];

/**
 * Check if two spells form a combo
 * @param {object} spell1 - First spell object
 * @param {object} spell2 - Second spell object
 * @param {object} rootMastery - Root mastery object from magicSlice
 * @returns {object|null} Combo object or null if no match
 */
export function checkCombo(spell1, spell2, rootMastery) {
  if (!spell1 || !spell2) return null;

  // Sort elements alphabetically for consistent lookup
  const elements = [spell1.element, spell2.element].sort();

  // Find matching combo
  const combo = ELEMENT_COMBOS.find((c) => {
    const comboElements = [...c.elements].sort();
    return (
      comboElements.length === elements.length &&
      comboElements.every((el, idx) => el === elements[idx])
    );
  });

  if (!combo) return null;

  // Check root level requirements
  const mastery1 = rootMastery[spell1.rootId];
  const mastery2 = rootMastery[spell2.rootId];

  if (!mastery1 || !mastery2) return null;

  // Both roots must meet the level requirement
  if (mastery1.level < combo.rootRequirement || mastery2.level < combo.rootRequirement) {
    return null;
  }

  return combo;
}

/**
 * Get all combos involving a specific element
 * @param {string} element - Element name
 * @returns {object[]} Array of combo objects
 */
export function getCombosByElement(element) {
  return ELEMENT_COMBOS.filter((c) => c.elements.includes(element));
}
