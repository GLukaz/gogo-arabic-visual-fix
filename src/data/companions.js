/**
 * companions.js — 12 companion definitions with stats, roles, specialties, and zone assignments
 *
 * Coverage:
 * - All 6 zones (2 companions per zone)
 * - All 4 battle roles (3 of each: healer, attacker, defender, support)
 * - All 4 teaching specialties (3 of each: grammar, vocabulary, pronunciation, culture)
 * - Mix of formality levels and personalities
 */

export const COMPANION_ROLES = Object.freeze({
  healer: {
    label: 'Healer',
    labelArabic: 'معالج',
    priority: 'heal_low_hp',
  },
  attacker: {
    label: 'Attacker',
    labelArabic: 'مهاجم',
    priority: 'damage_enemies',
  },
  defender: {
    label: 'Defender',
    labelArabic: 'مدافع',
    priority: 'protect_player',
  },
  support: {
    label: 'Support',
    labelArabic: 'داعم',
    priority: 'buff_allies',
  },
});

export const TEACHING_SPECIALTIES = Object.freeze({
  grammar: {
    label: 'Grammar',
    labelArabic: 'نحو',
    focusAreas: ['verb forms', 'sentence structure', 'case endings'],
  },
  vocabulary: {
    label: 'Vocabulary',
    labelArabic: 'مفردات',
    focusAreas: ['word roots', 'synonyms', 'context usage'],
  },
  pronunciation: {
    label: 'Pronunciation',
    labelArabic: 'نطق',
    focusAreas: ['letter sounds', 'emphatic consonants', 'vowel patterns'],
  },
  culture: {
    label: 'Culture',
    labelArabic: 'ثقافة',
    focusAreas: ['history', 'traditions', 'etiquette'],
  },
});

export const GIFT_CATEGORIES = Object.freeze({
  books: {
    label: 'Books',
    labelArabic: 'كتب',
    baseGain: 10,
  },
  food: {
    label: 'Food',
    labelArabic: 'طعام',
    baseGain: 5,
  },
  crafts: {
    label: 'Crafts',
    labelArabic: 'حرف',
    baseGain: 8,
  },
  gems: {
    label: 'Gems',
    labelArabic: 'أحجار كريمة',
    baseGain: 15,
  },
  scrolls: {
    label: 'Scrolls',
    labelArabic: 'مخطوطات',
    baseGain: 12,
  },
  flowers: {
    label: 'Flowers',
    labelArabic: 'زهور',
    baseGain: 7,
  },
});

// ────────────────────────────────────────────────
// 12 Companion Definitions
// ────────────────────────────────────────────────

export const COMPANIONS = Object.freeze({
  companion_amira: {
    id: 'companion_amira',
    name: 'Amira',
    nameArabic: 'أميرة',
    title: 'The Chronicler',
    titleArabic: 'المؤرخة',
    description: 'A meticulous historian who documents everything she sees. She speaks with precision and always corrects grammar gently.',
    zone: 'sacred_library',
    battleRole: 'support',
    teachingSpecialty: 'grammar',
    preferredGifts: ['books', 'scrolls'],
    personality: {
      formality: 'formal',
      patience: 'high',
      catchphrase: 'يا سلام',
      catchphraseEnglish: 'How wonderful!',
    },
    baseStats: {
      hp: 80,
      mp: 60,
      damage: 12,
      defense: 8,
    },
    spriteKey: 'companion_amira',
    colorPalette: {
      primary: '#4A90D9',
      secondary: '#2C5F8A',
      accent: '#FFD700',
    },
    recruitCondition: {
      type: 'quest',
      value: 'library_restoration',
    },
  },

  companion_khalid: {
    id: 'companion_khalid',
    name: 'Khalid',
    nameArabic: 'خالد',
    title: 'The Desert Wanderer',
    titleArabic: 'الرَّحَّالة',
    description: 'A seasoned traveler who knows every oasis and trade route. His stories are filled with vocabulary from the road.',
    zone: 'oasis_village',
    battleRole: 'attacker',
    teachingSpecialty: 'vocabulary',
    preferredGifts: ['food', 'crafts'],
    personality: {
      formality: 'casual',
      patience: 'medium',
      catchphrase: 'الحمد لله',
      catchphraseEnglish: 'Praise be to God',
    },
    baseStats: {
      hp: 100,
      mp: 40,
      damage: 18,
      defense: 10,
    },
    spriteKey: 'companion_khalid',
    colorPalette: {
      primary: '#D4A574',
      secondary: '#8B6F47',
      accent: '#E74C3C',
    },
    recruitCondition: {
      type: 'storyFlag',
      value: 'saved_caravan',
    },
  },

  companion_zahra: {
    id: 'companion_zahra',
    name: 'Zahra',
    nameArabic: 'زهرة',
    title: 'The Flower Speaker',
    titleArabic: 'مُحَدِّثَةُ الأَزْهَار',
    description: 'A gentle healer who speaks to plants and teaches pronunciation through poetry. Her voice is soft as petals.',
    zone: 'coastal_town',
    battleRole: 'healer',
    teachingSpecialty: 'pronunciation',
    preferredGifts: ['flowers', 'scrolls'],
    personality: {
      formality: 'formal',
      patience: 'high',
      catchphrase: 'ما شاء الله',
      catchphraseEnglish: 'God has willed it',
    },
    baseStats: {
      hp: 70,
      mp: 80,
      damage: 8,
      defense: 6,
    },
    spriteKey: 'companion_zahra',
    colorPalette: {
      primary: '#F39C12',
      secondary: '#D68910',
      accent: '#2ECC71',
    },
    recruitCondition: {
      type: 'relationship',
      value: 30,
    },
  },

  companion_omar: {
    id: 'companion_omar',
    name: 'Omar',
    nameArabic: 'عمر',
    title: 'The Market Keeper',
    titleArabic: 'صاحِبُ السُّوق',
    description: 'A shrewd merchant who knows the value of words. He teaches through haggling and trade expressions.',
    zone: 'desert_market',
    battleRole: 'support',
    teachingSpecialty: 'vocabulary',
    preferredGifts: ['gems', 'crafts'],
    personality: {
      formality: 'casual',
      patience: 'low',
      catchphrase: 'طبعاً',
      catchphraseEnglish: 'Of course!',
    },
    baseStats: {
      hp: 85,
      mp: 50,
      damage: 14,
      defense: 9,
    },
    spriteKey: 'companion_omar',
    colorPalette: {
      primary: '#E67E22',
      secondary: '#CA6F1E',
      accent: '#9B59B6',
    },
    recruitCondition: {
      type: 'level',
      value: 5,
    },
  },

  companion_layla: {
    id: 'companion_layla',
    name: 'Layla',
    nameArabic: 'ليلى',
    title: 'The Night Scholar',
    titleArabic: 'عالِمَةُ اللَّيْل',
    description: 'A nocturnal researcher obsessed with ancient grammar texts. She corrects with the precision of a scribe.',
    zone: 'sacred_library',
    battleRole: 'defender',
    teachingSpecialty: 'grammar',
    preferredGifts: ['books', 'gems'],
    personality: {
      formality: 'formal',
      patience: 'medium',
      catchphrase: 'صحيح',
      catchphraseEnglish: 'Correct',
    },
    baseStats: {
      hp: 95,
      mp: 45,
      damage: 10,
      defense: 14,
    },
    spriteKey: 'companion_layla',
    colorPalette: {
      primary: '#34495E',
      secondary: '#2C3E50',
      accent: '#1ABC9C',
    },
    recruitCondition: {
      type: 'quest',
      value: 'midnight_manuscript',
    },
  },

  companion_hassan: {
    id: 'companion_hassan',
    name: 'Hassan',
    nameArabic: 'حسن',
    title: 'The Mountain Guide',
    titleArabic: 'دَليلُ الجِبال',
    description: 'A stoic protector from the highland passes. He teaches culture through tales of ancient warriors.',
    zone: 'mountain_pass',
    battleRole: 'defender',
    teachingSpecialty: 'culture',
    preferredGifts: ['food', 'scrolls'],
    personality: {
      formality: 'formal',
      patience: 'high',
      catchphrase: 'بسم الله',
      catchphraseEnglish: 'In the name of God',
    },
    baseStats: {
      hp: 110,
      mp: 35,
      damage: 12,
      defense: 16,
    },
    spriteKey: 'companion_hassan',
    colorPalette: {
      primary: '#7F8C8D',
      secondary: '#566573',
      accent: '#E74C3C',
    },
    recruitCondition: {
      type: 'storyFlag',
      value: 'cleared_avalanche',
    },
  },

  companion_fatima: {
    id: 'companion_fatima',
    name: 'Fatima',
    nameArabic: 'فاطمة',
    title: 'The Ruin Keeper',
    titleArabic: 'حارِسَةُ الأَطْلال',
    description: 'An archaeologist who uncovers forgotten histories in ancient ruins. She teaches culture through artifacts.',
    zone: 'ancient_ruins',
    battleRole: 'support',
    teachingSpecialty: 'culture',
    preferredGifts: ['scrolls', 'gems'],
    personality: {
      formality: 'casual',
      patience: 'medium',
      catchphrase: 'سُبْحان الله',
      catchphraseEnglish: 'Glory be to God',
    },
    baseStats: {
      hp: 75,
      mp: 55,
      damage: 11,
      defense: 7,
    },
    spriteKey: 'companion_fatima',
    colorPalette: {
      primary: '#9B59B6',
      secondary: '#7D3C98',
      accent: '#F1C40F',
    },
    recruitCondition: {
      type: 'quest',
      value: 'decode_hieroglyphs',
    },
  },

  companion_ali: {
    id: 'companion_ali',
    name: 'Ali',
    nameArabic: 'علي',
    title: 'The Oasis Healer',
    titleArabic: 'طَبيبُ الوَاحَة',
    description: 'A compassionate physician who mends wounds with herbs and prayer. His pronunciation is impeccable.',
    zone: 'oasis_village',
    battleRole: 'healer',
    teachingSpecialty: 'pronunciation',
    preferredGifts: ['flowers', 'books'],
    personality: {
      formality: 'formal',
      patience: 'high',
      catchphrase: 'إن شاء الله',
      catchphraseEnglish: 'God willing',
    },
    baseStats: {
      hp: 65,
      mp: 85,
      damage: 6,
      defense: 5,
    },
    spriteKey: 'companion_ali',
    colorPalette: {
      primary: '#2ECC71',
      secondary: '#27AE60',
      accent: '#F39C12',
    },
    recruitCondition: {
      type: 'storyFlag',
      value: 'healed_elder',
    },
  },

  companion_maryam: {
    id: 'companion_maryam',
    name: 'Maryam',
    nameArabic: 'مريم',
    title: 'The Coastal Warrior',
    titleArabic: 'مُحارِبَةُ الساحِل',
    description: 'A fierce protector of fishing villages. She teaches grammar through battle commands and strategy.',
    zone: 'coastal_town',
    battleRole: 'attacker',
    teachingSpecialty: 'grammar',
    preferredGifts: ['gems', 'food'],
    personality: {
      formality: 'casual',
      patience: 'low',
      catchphrase: 'يَلَّا',
      catchphraseEnglish: "Let's go!",
    },
    baseStats: {
      hp: 90,
      mp: 42,
      damage: 20,
      defense: 11,
    },
    spriteKey: 'companion_maryam',
    colorPalette: {
      primary: '#3498DB',
      secondary: '#2980B9',
      accent: '#E74C3C',
    },
    recruitCondition: {
      type: 'level',
      value: 8,
    },
  },

  companion_samir: {
    id: 'companion_samir',
    name: 'Samir',
    nameArabic: 'سمير',
    title: 'The Market Brawler',
    titleArabic: 'مُصارِعُ السُّوق',
    description: 'A hotheaded fighter who settles disputes with fists. He teaches pronunciation through rapid-fire insults.',
    zone: 'desert_market',
    battleRole: 'attacker',
    teachingSpecialty: 'pronunciation',
    preferredGifts: ['food', 'crafts'],
    personality: {
      formality: 'casual',
      patience: 'low',
      catchphrase: 'وَالله',
      catchphraseEnglish: 'By God!',
    },
    baseStats: {
      hp: 105,
      mp: 30,
      damage: 22,
      defense: 12,
    },
    spriteKey: 'companion_samir',
    colorPalette: {
      primary: '#E74C3C',
      secondary: '#C0392B',
      accent: '#F39C12',
    },
    recruitCondition: {
      type: 'relationship',
      value: 20,
    },
  },

  companion_nadia: {
    id: 'companion_nadia',
    name: 'Nadia',
    nameArabic: 'نادية',
    title: 'The Mountain Herbalist',
    titleArabic: 'عَشَّابَةُ الجِبال',
    description: 'A wise healer who gathers rare mountain herbs. She teaches culture through folk remedies and traditions.',
    zone: 'mountain_pass',
    battleRole: 'healer',
    teachingSpecialty: 'culture',
    preferredGifts: ['flowers', 'books'],
    personality: {
      formality: 'formal',
      patience: 'high',
      catchphrase: 'الله أكبر',
      catchphraseEnglish: 'God is greatest',
    },
    baseStats: {
      hp: 68,
      mp: 90,
      damage: 7,
      defense: 6,
    },
    spriteKey: 'companion_nadia',
    colorPalette: {
      primary: '#16A085',
      secondary: '#138D75',
      accent: '#E67E22',
    },
    recruitCondition: {
      type: 'quest',
      value: 'gather_rare_herbs',
    },
  },

  companion_tariq: {
    id: 'companion_tariq',
    name: 'Tariq',
    nameArabic: 'طارق',
    title: 'The Ruin Defender',
    titleArabic: 'مُدافِعُ الأَطْلال',
    description: 'A silent guardian who protects ancient sites from looters. He teaches vocabulary through inscriptions.',
    zone: 'ancient_ruins',
    battleRole: 'defender',
    teachingSpecialty: 'vocabulary',
    preferredGifts: ['scrolls', 'gems'],
    personality: {
      formality: 'formal',
      patience: 'medium',
      catchphrase: 'بالتأكيد',
      catchphraseEnglish: 'Certainly',
    },
    baseStats: {
      hp: 100,
      mp: 38,
      damage: 13,
      defense: 15,
    },
    spriteKey: 'companion_tariq',
    colorPalette: {
      primary: '#8E44AD',
      secondary: '#7D3C98',
      accent: '#F1C40F',
    },
    recruitCondition: {
      type: 'storyFlag',
      value: 'defeated_looters',
    },
  },
});

// ────────────────────────────────────────────────
// Utility Functions
// ────────────────────────────────────────────────

export function getCompanion(companionId) {
  return COMPANIONS[companionId] || null;
}

export function getCompanionsByZone(zone) {
  return Object.values(COMPANIONS).filter(companion => companion.zone === zone);
}
