/**
 * enemies.js — Enemy data for the turn-based battle system (v6.0 Phase 27)
 *
 * Each enemy has stats, AI pattern, element affinity, and zone association.
 * Arabic names teach vocabulary through combat encounters.
 */

const enemies = [
  // ──────────────────────────────────────────────────
  // Oasis Village (tutorial zone, easy)
  // ──────────────────────────────────────────────────
  {
    id: 'sand-scarab',
    name: 'Sand Scarab',
    nameArabic: 'جُعَل الرمال',
    element: 'earth',
    baseHP: 40,
    baseDamage: 8,
    aiPattern: 'balanced',
    xpReward: 25,
    dirhamReward: 15,
    zone: 'oasis_village',
    encounterType: 'random',
    difficulty: 'easy',
    description: 'A small beetle that burrows through desert sand.',
  },
  {
    id: 'dust-sprite',
    name: 'Dust Sprite',
    nameArabic: 'روح الغبار',
    element: 'wind',
    baseHP: 30,
    baseDamage: 6,
    aiPattern: 'aggressive',
    xpReward: 20,
    dirhamReward: 10,
    zone: 'oasis_village',
    encounterType: 'random',
    difficulty: 'easy',
    description: 'A mischievous spirit made of swirling dust.',
  },
  {
    id: 'oasis-guardian',
    name: 'Oasis Guardian',
    nameArabic: 'حارس الواحة',
    element: 'water',
    baseHP: 80,
    baseDamage: 12,
    aiPattern: 'defensive',
    xpReward: 60,
    dirhamReward: 40,
    zone: 'oasis_village',
    encounterType: 'boss',
    difficulty: 'easy',
    description: 'An ancient spirit protecting the village oasis.',
  },

  // ──────────────────────────────────────────────────
  // Ancient Library (knowledge-themed)
  // ──────────────────────────────────────────────────
  {
    id: 'ink-wraith',
    name: 'Ink Wraith',
    nameArabic: 'شبح الحِبر',
    element: 'shadow',
    baseHP: 50,
    baseDamage: 10,
    aiPattern: 'balanced',
    xpReward: 35,
    dirhamReward: 20,
    zone: 'ancient_library',
    encounterType: 'random',
    difficulty: 'medium',
    description: 'A spectral form that bleeds from old manuscripts.',
  },
  {
    id: 'scroll-golem',
    name: 'Scroll Golem',
    nameArabic: 'عملاق اللَّفائف',
    element: 'knowledge',
    baseHP: 70,
    baseDamage: 11,
    aiPattern: 'defensive',
    xpReward: 40,
    dirhamReward: 25,
    zone: 'ancient_library',
    encounterType: 'random',
    difficulty: 'medium',
    description: 'A construct animated by ancient knowledge.',
  },
  {
    id: 'keeper-of-words',
    name: 'Keeper of Words',
    nameArabic: 'حافظ الكلمات',
    element: 'knowledge',
    baseHP: 120,
    baseDamage: 15,
    aiPattern: 'adaptive',
    xpReward: 100,
    dirhamReward: 60,
    zone: 'ancient_library',
    encounterType: 'boss',
    difficulty: 'medium',
    description: 'The library\'s eternal guardian — tests your vocabulary mastery.',
  },

  // ──────────────────────────────────────────────────
  // Desert Marketplace (trade-themed)
  // ──────────────────────────────────────────────────
  {
    id: 'sand-djinn',
    name: 'Sand Djinn',
    nameArabic: 'جِنّ الرمال',
    element: 'fire',
    baseHP: 60,
    baseDamage: 13,
    aiPattern: 'aggressive',
    xpReward: 45,
    dirhamReward: 30,
    zone: 'desert_marketplace',
    encounterType: 'random',
    difficulty: 'medium',
    description: 'A fiery spirit that haunts the desert trade routes.',
  },
  {
    id: 'mirage-thief',
    name: 'Mirage Thief',
    nameArabic: 'لِصّ السراب',
    element: 'shadow',
    baseHP: 45,
    baseDamage: 14,
    aiPattern: 'aggressive',
    xpReward: 40,
    dirhamReward: 35,
    zone: 'desert_marketplace',
    encounterType: 'random',
    difficulty: 'medium',
    description: 'A cunning bandit who uses mirages to confuse.',
  },
  {
    id: 'merchant-prince',
    name: 'Merchant Prince',
    nameArabic: 'أمير التُّجّار',
    element: 'creation',
    baseHP: 140,
    baseDamage: 16,
    aiPattern: 'boss',
    xpReward: 120,
    dirhamReward: 80,
    zone: 'desert_marketplace',
    encounterType: 'boss',
    difficulty: 'hard',
    description: 'A powerful merchant who challenges your Arabic trading skills.',
  },

  // ──────────────────────────────────────────────────
  // Coastal Port (water-themed)
  // ──────────────────────────────────────────────────
  {
    id: 'sea-serpent',
    name: 'Sea Serpent',
    nameArabic: 'ثُعبان البحر',
    element: 'water',
    baseHP: 65,
    baseDamage: 12,
    aiPattern: 'balanced',
    xpReward: 45,
    dirhamReward: 25,
    zone: 'coastal_port',
    encounterType: 'random',
    difficulty: 'medium',
    description: 'A serpent from the deep that guards the harbor.',
  },
  {
    id: 'storm-caller',
    name: 'Storm Caller',
    nameArabic: 'مُستَدعي العاصفة',
    element: 'wind',
    baseHP: 55,
    baseDamage: 15,
    aiPattern: 'aggressive',
    xpReward: 50,
    dirhamReward: 30,
    zone: 'coastal_port',
    encounterType: 'random',
    difficulty: 'medium',
    description: 'A wind spirit that summons storms at sea.',
  },
  {
    id: 'tide-lord',
    name: 'Tide Lord',
    nameArabic: 'سيّد المَدّ',
    element: 'water',
    baseHP: 160,
    baseDamage: 18,
    aiPattern: 'boss',
    xpReward: 130,
    dirhamReward: 90,
    zone: 'coastal_port',
    encounterType: 'boss',
    difficulty: 'hard',
    description: 'The ancient ruler of the tides who commands the sea.',
  },

  // ──────────────────────────────────────────────────
  // Royal Palace (light/protection-themed)
  // ──────────────────────────────────────────────────
  {
    id: 'palace-sentinel',
    name: 'Palace Sentinel',
    nameArabic: 'حارس القصر',
    element: 'protection',
    baseHP: 75,
    baseDamage: 13,
    aiPattern: 'defensive',
    xpReward: 50,
    dirhamReward: 30,
    zone: 'royal_palace',
    encounterType: 'random',
    difficulty: 'hard',
    description: 'An enchanted guard that protects the palace.',
  },
  {
    id: 'shadow-vizier',
    name: 'Shadow Vizier',
    nameArabic: 'الوزير المُظلِم',
    element: 'shadow',
    baseHP: 180,
    baseDamage: 20,
    aiPattern: 'boss',
    xpReward: 150,
    dirhamReward: 100,
    zone: 'royal_palace',
    encounterType: 'boss',
    difficulty: 'hard',
    description: 'A corrupted advisor who wields shadow magic.',
  },

  // ──────────────────────────────────────────────────
  // Garden District (plant/creation-themed)
  // ──────────────────────────────────────────────────
  {
    id: 'thorn-vine',
    name: 'Thorn Vine',
    nameArabic: 'كَرمة الشَّوك',
    element: 'earth',
    baseHP: 50,
    baseDamage: 11,
    aiPattern: 'defensive',
    xpReward: 35,
    dirhamReward: 20,
    zone: 'garden_district',
    encounterType: 'random',
    difficulty: 'medium',
    description: 'A thorny vine that has grown sentient.',
  },
  {
    id: 'blossom-spirit',
    name: 'Blossom Spirit',
    nameArabic: 'روح الزَّهر',
    element: 'creation',
    baseHP: 45,
    baseDamage: 9,
    aiPattern: 'balanced',
    xpReward: 30,
    dirhamReward: 20,
    zone: 'garden_district',
    encounterType: 'random',
    difficulty: 'easy',
    description: 'A gentle spirit that tends the gardens.',
  },

  // ──────────────────────────────────────────────────
  // Mountain Pass (earth/time-themed)
  // ──────────────────────────────────────────────────
  {
    id: 'rock-elemental',
    name: 'Rock Elemental',
    nameArabic: 'عُنصُر الصَّخر',
    element: 'earth',
    baseHP: 90,
    baseDamage: 16,
    aiPattern: 'defensive',
    xpReward: 55,
    dirhamReward: 35,
    zone: 'mountain_pass',
    encounterType: 'random',
    difficulty: 'hard',
    description: 'A massive creature formed from mountain stone.',
  },
  {
    id: 'wind-hawk',
    name: 'Wind Hawk',
    nameArabic: 'صَقر الريح',
    element: 'wind',
    baseHP: 55,
    baseDamage: 17,
    aiPattern: 'aggressive',
    xpReward: 50,
    dirhamReward: 30,
    zone: 'mountain_pass',
    encounterType: 'random',
    difficulty: 'hard',
    description: 'A bird of prey that rides the mountain winds.',
  },
  {
    id: 'mountain-elder',
    name: 'Mountain Elder',
    nameArabic: 'شيخ الجبل',
    element: 'time',
    baseHP: 200,
    baseDamage: 22,
    aiPattern: 'boss',
    xpReward: 180,
    dirhamReward: 120,
    zone: 'mountain_pass',
    encounterType: 'boss',
    difficulty: 'expert',
    description: 'An ancient sage who tests the worthiest scholars.',
  },
];

/**
 * Get enemy data by ID.
 * @param {string} enemyId
 * @returns {Object|undefined}
 */
export function getEnemy(enemyId) {
  return enemies.find((e) => e.id === enemyId);
}

/**
 * Get all enemies for a zone.
 * @param {string} zone
 * @returns {Object[]}
 */
export function getEnemiesByZone(zone) {
  return enemies.filter((e) => e.zone === zone);
}

/**
 * Get random encounter enemies for a zone.
 * @param {string} zone
 * @returns {Object[]}
 */
export function getRandomEncounters(zone) {
  return enemies.filter(
    (e) => e.zone === zone && e.encounterType === 'random'
  );
}

/**
 * Get boss enemies for a zone.
 * @param {string} zone
 * @returns {Object[]}
 */
export function getBossByZone(zone) {
  return enemies.filter((e) => e.zone === zone && e.encounterType === 'boss');
}

export default enemies;
