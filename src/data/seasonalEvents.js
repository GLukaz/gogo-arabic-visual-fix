/**
 * seasonalEvents.js — Seasonal event definitions for Islamic holidays (Phase 86)
 *
 * Three events:
 *   - Ramadan   — 30 days, 20 vocabulary words, 3 quests
 *   - Eid al-Fitr — 3 days, 10 vocabulary words, 1 quest
 *   - Eid al-Adha — 4 days, 10 vocabulary words, 1 quest
 *
 * All Arabic text uses proper tashkeel where pedagogically useful.
 * Content is educational and culturally respectful.
 */

export const SEASONAL_EVENTS = Object.freeze({
  ramadan: {
    id: 'ramadan',
    name: 'Ramadan',
    nameArabic: 'رمضان',
    greeting: 'رمضان مبارك',
    greetingEnglish: 'Blessed Ramadan',
    description: 'The holy month of fasting, prayer, and reflection',
    descriptionArabic: 'شهر الصيام والصلاة والتأمل المبارك',
    duration: 30,
    xpMultiplier: 1.25,
    themeColor: '#006400',
    accentColor: '#FFD700',
    icon: '\u{1F319}', // crescent moon

    specialVocabulary: [
      // ── Fasting & Worship ──
      { id: 'ramadan_sawm', arabic: 'صَوْم', english: 'fasting', transliteration: 'sawm', category: 'religion' },
      { id: 'ramadan_iftar', arabic: 'إفطار', english: 'breaking the fast', transliteration: 'iftar', category: 'food' },
      { id: 'ramadan_suhur', arabic: 'سُحور', english: 'pre-dawn meal', transliteration: 'suhur', category: 'food' },
      { id: 'ramadan_tarawih', arabic: 'تَراويح', english: 'night prayers', transliteration: 'tarawih', category: 'religion' },
      { id: 'ramadan_quran', arabic: 'قُرْآن', english: 'Quran', transliteration: 'quran', category: 'religion' },
      { id: 'ramadan_dua', arabic: 'دُعاء', english: 'supplication', transliteration: "du'a", category: 'religion' },
      { id: 'ramadan_sadaqa', arabic: 'صَدَقة', english: 'charity', transliteration: 'sadaqa', category: 'culture' },
      { id: 'ramadan_tasbih', arabic: 'تَسْبيح', english: 'glorification of God', transliteration: 'tasbih', category: 'religion' },
      { id: 'ramadan_imsak', arabic: 'إمْساك', english: 'abstinence start', transliteration: 'imsak', category: 'religion' },
      { id: 'ramadan_laylat', arabic: 'لَيْلَة القَدْر', english: 'Night of Power', transliteration: 'laylat al-qadr', category: 'religion' },

      // ── Food & Community ──
      { id: 'ramadan_tamr', arabic: 'تَمْر', english: 'dates (fruit)', transliteration: 'tamr', category: 'food' },
      { id: 'ramadan_masjid', arabic: 'مَسْجِد', english: 'mosque', transliteration: 'masjid', category: 'religion' },
      { id: 'ramadan_adhan', arabic: 'أَذان', english: 'call to prayer', transliteration: 'adhan', category: 'religion' },
      { id: 'ramadan_zakat', arabic: 'زَكاة', english: 'obligatory charity', transliteration: 'zakat', category: 'religion' },
      { id: 'ramadan_tawba', arabic: 'تَوْبة', english: 'repentance', transliteration: 'tawba', category: 'religion' },

      // ── Spiritual Concepts ──
      { id: 'ramadan_sabr', arabic: 'صَبْر', english: 'patience', transliteration: 'sabr', category: 'culture' },
      { id: 'ramadan_rahma', arabic: 'رَحْمة', english: 'mercy', transliteration: 'rahma', category: 'culture' },
      { id: 'ramadan_maghfira', arabic: 'مَغْفِرة', english: 'forgiveness', transliteration: 'maghfira', category: 'culture' },
      { id: 'ramadan_itikaf', arabic: 'اعْتِكاف', english: 'spiritual retreat', transliteration: "i'tikaf", category: 'religion' },
      { id: 'ramadan_niyya', arabic: 'نِيَّة', english: 'intention', transliteration: 'niyya', category: 'religion' },
    ],

    dailyThemes: [
      { day: 1, theme: 'Beginning of Fasting', themeArabic: 'بداية الصيام' },
      { day: 10, theme: 'Mercy', themeArabic: 'الرحمة' },
      { day: 20, theme: 'Forgiveness', themeArabic: 'المغفرة' },
      { day: 27, theme: 'Laylat al-Qadr', themeArabic: 'ليلة القدر' },
      { day: 30, theme: 'Farewell', themeArabic: 'الوداع' },
    ],

    quests: [
      {
        id: 'ramadan_quest_1',
        title: 'Learn the Words of Fasting',
        titleArabic: 'تعلّم كلمات الصيام',
        description: 'Learn 5 Ramadan vocabulary words',
        target: 5,
        trackEvent: 'ramadan_word_learned',
        reward: { xp: 100, dirhams: 50 },
      },
      {
        id: 'ramadan_quest_2',
        title: 'The Iftar Table',
        titleArabic: 'مائدة الإفطار',
        description: 'Complete the Ramadan food vocabulary set',
        target: 8,
        trackEvent: 'ramadan_word_learned',
        reward: { xp: 150, dirhams: 75 },
      },
      {
        id: 'ramadan_quest_3',
        title: 'Night of Power',
        titleArabic: 'ليلة القدر',
        description: 'Answer 10 Ramadan trivia questions correctly',
        target: 10,
        trackEvent: 'ramadan_trivia_correct',
        reward: { xp: 300, dirhams: 150 },
      },
    ],
  },

  eid_fitr: {
    id: 'eid_fitr',
    name: 'Eid al-Fitr',
    nameArabic: 'عيد الفطر',
    greeting: 'عيد مبارك',
    greetingEnglish: 'Blessed Eid',
    description: 'The Festival of Breaking the Fast — celebrating the end of Ramadan',
    descriptionArabic: 'عيد الفطر يحتفل بنهاية شهر رمضان المبارك',
    duration: 3,
    xpMultiplier: 1.5,
    themeColor: '#006400',
    accentColor: '#FFD700',
    icon: '\u{2B50}', // star

    specialVocabulary: [
      { id: 'eid_eid', arabic: 'عيد', english: 'festival/celebration', transliteration: "'id", category: 'culture' },
      { id: 'eid_mubarak', arabic: 'مُبارَك', english: 'blessed', transliteration: 'mubarak', category: 'culture' },
      { id: 'eid_salat', arabic: 'صَلاة العيد', english: 'Eid prayer', transliteration: "salat al-'id", category: 'religion' },
      { id: 'eid_zakat_fitr', arabic: 'زَكاة الفِطْر', english: 'Eid charity', transliteration: 'zakat al-fitr', category: 'religion' },
      { id: 'eid_kahk', arabic: 'كَعْك', english: 'Eid cookies', transliteration: "ka'k", category: 'food' },
      { id: 'eid_farha', arabic: 'فَرْحة', english: 'joy/happiness', transliteration: 'farha', category: 'culture' },
      { id: 'eid_ziyara', arabic: 'زِيارة', english: 'visit/visitation', transliteration: 'ziyara', category: 'culture' },
      { id: 'eid_hadiya', arabic: 'هَدِيَّة', english: 'gift/present', transliteration: 'hadiyya', category: 'culture' },
      { id: 'eid_takbir_fitr', arabic: 'تَكْبير', english: 'proclamation of greatness', transliteration: 'takbir', category: 'religion' },
      { id: 'eid_aila', arabic: 'عائِلة', english: 'family', transliteration: "'a'ila", category: 'culture' },
    ],

    quests: [
      {
        id: 'eid_fitr_quest_1',
        title: 'Eid Greetings',
        titleArabic: 'تهاني العيد',
        description: 'Learn 5 Eid celebration words',
        target: 5,
        trackEvent: 'eid_word_learned',
        reward: { xp: 150, dirhams: 100 },
      },
    ],
  },

  eid_adha: {
    id: 'eid_adha',
    name: 'Eid al-Adha',
    nameArabic: 'عيد الأضحى',
    greeting: 'عيد أضحى مبارك',
    greetingEnglish: 'Blessed Eid al-Adha',
    description: "The Festival of Sacrifice — commemorating Ibrahim's devotion",
    descriptionArabic: 'عيد الأضحى يحتفل بتضحية إبراهيم وإيمانه',
    duration: 4,
    xpMultiplier: 1.5,
    themeColor: '#006400',
    accentColor: '#FFD700',
    icon: '\u{2B50}', // star

    specialVocabulary: [
      { id: 'adha_udhiya', arabic: 'أُضْحِيَة', english: 'sacrifice', transliteration: 'udhiya', category: 'religion' },
      { id: 'adha_hajj', arabic: 'حَجّ', english: 'pilgrimage', transliteration: 'hajj', category: 'religion' },
      { id: 'adha_ibrahim', arabic: 'إبراهيم', english: 'Ibrahim/Abraham', transliteration: 'ibrahim', category: 'religion' },
      { id: 'adha_taqwa', arabic: 'تَقْوى', english: 'piety/God-consciousness', transliteration: 'taqwa', category: 'religion' },
      { id: 'adha_takbir', arabic: 'تَكْبير', english: "declaring God's greatness", transliteration: 'takbir', category: 'religion' },
      { id: 'adha_mina', arabic: 'مِنى', english: 'Mina (pilgrimage site)', transliteration: 'mina', category: 'religion' },
      { id: 'adha_arafa', arabic: 'عَرَفة', english: 'Arafat (Day of Standing)', transliteration: 'arafa', category: 'religion' },
      { id: 'adha_ihram', arabic: 'إحْرام', english: 'pilgrimage garment/state', transliteration: 'ihram', category: 'religion' },
      { id: 'adha_qurban', arabic: 'قُرْبان', english: 'offering/sacrifice', transliteration: 'qurban', category: 'religion' },
      { id: 'adha_tawaf', arabic: 'طَواف', english: 'circumambulation of Kaaba', transliteration: 'tawaf', category: 'religion' },
    ],

    quests: [
      {
        id: 'eid_adha_quest_1',
        title: 'The Pilgrimage Words',
        titleArabic: 'كلمات الحج',
        description: 'Learn 5 Hajj and sacrifice vocabulary words',
        target: 5,
        trackEvent: 'eid_word_learned',
        reward: { xp: 150, dirhams: 100 },
      },
    ],
  },
});

/**
 * Get a seasonal event definition by ID.
 * @param {string} eventId — 'ramadan'|'eid_fitr'|'eid_adha'
 * @returns {Object|null}
 */
export function getSeasonalEvent(eventId) {
  return SEASONAL_EVENTS[eventId] ?? null;
}

/**
 * Get all seasonal vocabulary for a given event.
 * @param {string} eventId
 * @returns {Array}
 */
export function getSeasonalVocabulary(eventId) {
  return SEASONAL_EVENTS[eventId]?.specialVocabulary ?? [];
}

/**
 * Get all seasonal quests for a given event.
 * @param {string} eventId
 * @returns {Array}
 */
export function getSeasonalQuests(eventId) {
  return SEASONAL_EVENTS[eventId]?.quests ?? [];
}

/**
 * Get the daily theme for a given day of Ramadan.
 * Returns the theme whose day is closest to (and not exceeding) the current day.
 * @param {number} day — 1-30
 * @returns {{ day: number, theme: string, themeArabic: string }|null}
 */
export function getRamadanDailyTheme(day) {
  if (!day || day < 1 || day > 30) return null;
  const themes = SEASONAL_EVENTS.ramadan.dailyThemes;
  let best = null;
  for (const theme of themes) {
    if (theme.day <= day) {
      best = theme;
    }
  }
  return best;
}
