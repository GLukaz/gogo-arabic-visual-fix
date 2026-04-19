/**
 * Boss data for Word Duel battles
 * Each boss represents a challenging encounter in a specific zone
 */

export const BOSSES = [
  {
    id: 'oasis_spirit',
    name: 'Oasis Spirit',
    nameArabic: 'روح الواحة',
    zone: 'oasis_village',
    sprite: '🌊',
    hp: 80,
    difficulty: 1,
    category: 'greetings', // Tutorial boss - basic vocabulary
    attackPatterns: ['ar-to-en', 'en-to-ar', 'listen'],
    rewards: { xp: 300, dirhams: 150 },
    dialogue: {
      intro: 'Welcome, traveler. Prove your knowledge of Arabic greetings to pass.',
      hit: 'Your pronunciation is improving!',
      miss: 'Not quite... listen carefully.',
      defeat: 'You have proven yourself worthy. The path is open.',
      victory: 'Return when you have studied more, young scholar.',
    },
  },
  {
    id: 'library_guardian',
    name: 'Library Guardian',
    nameArabic: 'حارس المكتبة',
    zone: 'ancient_library',
    sprite: '📚',
    hp: 100,
    difficulty: 2,
    category: 'education',
    attackPatterns: ['ar-to-en', 'en-to-ar', 'en-to-type-ar'],
    rewards: { xp: 500, dirhams: 300 },
    dialogue: {
      intro: 'You dare challenge the Guardian of Knowledge? Show me your mastery of scholarly words!',
      hit: 'A worthy scholar indeed!',
      miss: 'Your Arabic needs more practice...',
      defeat: 'I yield! Your knowledge is impressive. Take these rewards.',
      victory: 'Study harder and return, young scholar. The library holds many secrets.',
    },
  },
  {
    id: 'spice_merchant_king',
    name: 'Spice Merchant King',
    nameArabic: 'ملك تجار التوابل',
    zone: 'desert_marketplace',
    sprite: '🧺',
    hp: 120,
    difficulty: 2,
    category: 'food',
    attackPatterns: ['ar-to-en', 'en-to-ar', 'listen'],
    rewards: { xp: 550, dirhams: 400 },
    dialogue: {
      intro: 'You wish to trade in MY marketplace? Prove you know the words of commerce!',
      hit: 'Excellent! You drive a hard bargain.',
      miss: 'That price is wrong! Try again.',
      defeat: 'You are a master trader! Here, take these as payment.',
      victory: 'Come back when you know your spices from your sweets!',
    },
  },
  {
    id: 'farm_elder',
    name: 'Farm Elder',
    nameArabic: 'كبير المزارعين',
    zone: 'farmland',
    sprite: '🌾',
    hp: 100,
    difficulty: 2,
    category: 'animals',
    attackPatterns: ['ar-to-en', 'en-to-ar', 'listen'],
    rewards: { xp: 450, dirhams: 250 },
    dialogue: {
      intro: 'These lands have been in my family for generations. Know the animals and colors to earn my respect.',
      hit: 'You know the land well!',
      miss: 'Even the chickens know better than that!',
      defeat: 'You have the heart of a true farmer. May your harvests be plentiful.',
      victory: 'Go tend to your studies before returning to my fields!',
    },
  },
  {
    id: 'desert_wind_spirit',
    name: 'Desert Wind Spirit',
    nameArabic: 'روح رياح الصحراء',
    zone: 'bedouin_camp',
    sprite: '🌪️',
    hp: 140,
    difficulty: 3,
    category: 'nature',
    attackPatterns: ['ar-to-en', 'en-to-ar', 'en-to-type-ar', 'listen'],
    rewards: { xp: 700, dirhams: 500 },
    dialogue: {
      intro: 'The desert tests all who cross it. Can you weather my storm of words?',
      hit: 'Like the wind, you are swift!',
      miss: 'The sands shift, and so does your knowledge...',
      defeat: 'You have the resilience of the Bedouin. The desert welcomes you.',
      victory: 'The desert is harsh to the unprepared. Return when you are stronger.',
    },
  },
  {
    id: 'mountain_sage',
    name: 'Mountain Sage',
    nameArabic: 'حكيم الجبل',
    zone: 'mountain_village',
    sprite: '⛰️',
    hp: 150,
    difficulty: 3,
    category: 'family',
    attackPatterns: ['ar-to-en', 'en-to-ar', 'en-to-type-ar', 'listen'],
    rewards: { xp: 750, dirhams: 550 },
    dialogue: {
      intro: 'From these peaks, I have watched generations. Show me you understand family and kinship.',
      hit: 'Wisdom flows through you!',
      miss: 'Contemplate your answer more deeply...',
      defeat: 'You have earned the wisdom of the mountains. May you share it with others.',
      victory: 'Climb higher in your studies before attempting this peak again.',
    },
  },
  {
    id: 'harbor_master',
    name: 'Harbor Master',
    nameArabic: 'رئيس الميناء',
    zone: 'coastal_port',
    sprite: '⚓',
    hp: 180,
    difficulty: 4,
    category: 'directions',
    attackPatterns: ['ar-to-en', 'en-to-ar', 'en-to-type-ar', 'listen'],
    rewards: { xp: 900, dirhams: 700 },
    dialogue: {
      intro: 'Every ship that enters this port must know directions and numbers. Can you navigate my challenge?',
      hit: 'Steady as a ship in calm waters!',
      miss: 'You are off course! Recalculate!',
      defeat: 'You have the mind of a navigator! The seas are yours to explore.',
      victory: 'Study your charts before setting sail again, sailor!',
    },
  },
  {
    id: 'royal_vizier',
    name: 'Royal Vizier',
    nameArabic: 'الوزير الملكي',
    zone: 'royal_palace',
    sprite: '👑',
    hp: 200,
    difficulty: 5,
    category: null, // Mixed - uses all categories
    attackPatterns: ['ar-to-en', 'en-to-ar', 'en-to-type-ar', 'listen'],
    rewards: { xp: 1200, dirhams: 1000 },
    dialogue: {
      intro: 'I am the advisor to the Sultan himself. Only a true master of Arabic may stand before me!',
      hit: 'Impressive! Your mastery rivals the scholars of old!',
      miss: 'Unacceptable! The Sultan demands perfection!',
      defeat: 'You are truly a master of Arabic! The Sultan will hear of your excellence.',
      victory: 'You are not yet ready for the royal court. Continue your studies!',
    },
  },
];

/**
 * Get boss by ID
 * @param {string} bossId
 * @returns {Object|null}
 */
export function getBossById(bossId) {
  return BOSSES.find(b => b.id === bossId) || null;
}

/**
 * Get bosses by zone
 * @param {string} zone
 * @returns {Array}
 */
export function getBossesByZone(zone) {
  return BOSSES.filter(b => b.zone === zone);
}

/**
 * Get bosses by difficulty
 * @param {number} difficulty
 * @returns {Array}
 */
export function getBossesByDifficulty(difficulty) {
  return BOSSES.filter(b => b.difficulty === difficulty);
}

/**
 * Check if player can challenge boss (based on zone unlock)
 * @param {string} bossId
 * @param {Array} unlockedZones
 * @returns {boolean}
 */
export function canChallengeBoss(bossId, unlockedZones) {
  const boss = getBossById(bossId);
  if (!boss) return false;
  return unlockedZones.includes(boss.zone);
}
