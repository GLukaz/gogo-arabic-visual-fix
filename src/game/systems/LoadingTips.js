// ============================================================
// LOADING TIPS SYSTEM
// 50+ tips about Arabic language, history, and gameplay.
// getRandomTip() rotates through all tips before repeating.
// ============================================================

// ============================================================
// TIP DEFINITIONS
// Each tip: { text, textArabic?, category }
// category: 'language' | 'gameplay' | 'history'
// ============================================================

/** @type {Array<{text: string, textArabic?: string, category: 'language'|'gameplay'|'history'}>} */
const TIPS = [
  // ── LANGUAGE ──────────────────────────────────────────────
  {
    text: "Arabic is written right-to-left — but numbers are written left-to-right!",
    textArabic: "العربية تُكتب من اليمين إلى اليسار",
    category: 'language',
  },
  {
    text: "Arabic has a special form just for two things — the dual (المثنى). كتاب → كتابان (one book → two books).",
    textArabic: "المثنى",
    category: 'language',
  },
  {
    text: "The Arabic alphabet has 28 letters, each with up to 4 different shapes depending on position.",
    textArabic: "الحروف الهجائية",
    category: 'language',
  },
  {
    text: "The root system is Arabic's superpower: ك-ت-ب (k-t-b) gives كتب (wrote), كتاب (book), مكتبة (library), كاتب (writer).",
    textArabic: "الجذر الثلاثي",
    category: 'language',
  },
  {
    text: "Modern Standard Arabic (الفصحى) is understood across the entire Arab world — that's 400 million people.",
    textArabic: "الفصحى",
    category: 'language',
  },
  {
    text: "Arabic has no capital letters — words are distinguished by context, not case.",
    textArabic: "لا توجد حروف كبيرة في العربية",
    category: 'language',
  },
  {
    text: "The Arabic word for 'heart' is قلب (qalb). It also means 'to flip' or 'to turn upside down'.",
    textArabic: "قلب",
    category: 'language',
  },
  {
    text: "Arabic has masculine and feminine nouns. The sun (الشمس) is feminine; the moon (القمر) is masculine.",
    textArabic: "المذكر والمؤنث",
    category: 'language',
  },
  {
    text: "Arabic short vowels (harakat) are usually omitted in everyday writing — context fills the gaps.",
    textArabic: "الحركات",
    category: 'language',
  },
  {
    text: "The word 'marhaba' (مرحبا) — 'welcome' — literally means 'wide space'. A warm greeting, poetically.",
    textArabic: "مرحبا",
    category: 'language',
  },
  {
    text: "Arabic distinguishes emphatic (heavy) consonants from regular ones. ص is different from س.",
    textArabic: "المفخّم والمرقّق",
    category: 'language',
  },
  {
    text: "The dual form in Arabic: كتاب (one book) → كتابان (two books) → كتب (three or more books).",
    textArabic: "المثنى والجمع",
    category: 'language',
  },
  {
    text: "Arabic uses the definite article ال (al-) — attached directly to the noun. البيت = the house.",
    textArabic: "ال التعريف",
    category: 'language',
  },
  {
    text: "The verb usually comes before the subject in Arabic — Verb-Subject-Object is the classic order.",
    textArabic: "فعل + فاعل + مفعول به",
    category: 'language',
  },
  {
    text: "Arabic has sounds with no English equivalent: the guttural ع (ayn) and the emphatic خ (kha).",
    textArabic: "أصوات عربية فريدة",
    category: 'language',
  },
  {
    text: "بسم الله (Bismillah) — 'In the name of God' — is the most recited phrase in the Arabic language.",
    textArabic: "بسم الله الرحمن الرحيم",
    category: 'language',
  },
  {
    text: "Arabic poetry tradition goes back 1,500 years. The معلقات (Mu'allaqat) are pre-Islamic masterpieces.",
    textArabic: "المعلقات",
    category: 'language',
  },
  {
    text: "The word إنشاء الله (Inshallah) means 'if God wills it' — used to express hope and plans.",
    textArabic: "إن شاء الله",
    category: 'language',
  },
  {
    text: "Arabic script was adapted to write Persian, Urdu, Ottoman Turkish, and even Swahili.",
    textArabic: "الخط العربي في لغات أخرى",
    category: 'language',
  },
  {
    text: "The Arabic numeral system — 0 through 9 — was transmitted to Europe through Arabic scholars.",
    textArabic: "الأرقام العربية",
    category: 'language',
  },

  // ── HISTORY ───────────────────────────────────────────────
  {
    text: "The word 'algorithm' comes from the Arab mathematician Al-Khwarizmi (الخوارزمي).",
    textArabic: "الخوارزمي",
    category: 'history',
  },
  {
    text: "The word 'algebra' comes from Arabic الجبر (al-jabr), a term coined by Al-Khwarizmi.",
    textArabic: "الجبر",
    category: 'history',
  },
  {
    text: "The medieval Islamic Golden Age (8th–13th century) produced breakthroughs in medicine, optics, and astronomy.",
    textArabic: "العصر الذهبي الإسلامي",
    category: 'history',
  },
  {
    text: "Ibn Battuta (ابن بطوطة) traveled 75,000 miles across the known world — more than Marco Polo.",
    textArabic: "ابن بطوطة",
    category: 'history',
  },
  {
    text: "The word 'coffee' originates from the Arabic قهوة (qahwa), which likely came from Ethiopia.",
    textArabic: "قهوة",
    category: 'history',
  },
  {
    text: "Ibn Sina (ابن سينا), known as Avicenna, wrote the Canon of Medicine — used in European universities until the 17th century.",
    textArabic: "ابن سينا",
    category: 'history',
  },
  {
    text: "The word 'admiral' comes from Arabic أمير البحر (Amir al-Bahr) — Commander of the Sea.",
    textArabic: "أمير البحر",
    category: 'history',
  },
  {
    text: "Arabic scholars preserved and expanded on Ancient Greek philosophy during Europe's Dark Ages.",
    textArabic: "بيت الحكمة",
    category: 'history',
  },
  {
    text: "The Alhambra palace in Granada is inscribed with thousands of lines of Arabic calligraphy and poetry.",
    textArabic: "الحمراء",
    category: 'history',
  },
  {
    text: "The word 'sugar' comes from Arabic السكّر (al-sukkar), brought to Europe through Arab trade routes.",
    textArabic: "السكّر",
    category: 'history',
  },

  // ── GAMEPLAY ──────────────────────────────────────────────
  {
    text: "Press M to open the minimap and see all discovered locations.",
    category: 'gameplay',
  },
  {
    text: "Visit Scholar Yusuf in the Madrasah district to learn calligraphy and unlock special quests.",
    category: 'gameplay',
  },
  {
    text: "Correct answers in Quiz Mode earn XP — critical answers (first try, no hints) earn bonus gold.",
    category: 'gameplay',
  },
  {
    text: "Your learning path (Scholar, Traveler, or Historian) shapes which vocabulary you encounter first.",
    category: 'gameplay',
  },
  {
    text: "Faction alignment affects which NPCs trust you — and what words they teach you.",
    category: 'gameplay',
  },
  {
    text: "Open your vocabulary journal (J) to review every word you've encountered in the world.",
    category: 'gameplay',
  },
  {
    text: "Battle enemies using vocabulary power — stronger words deal more damage!",
    category: 'gameplay',
  },
  {
    text: "Day and night change NPC schedules. Visit the market at dawn for the best prices.",
    category: 'gameplay',
  },
  {
    text: "Pressing Tab opens your quest log — track active missions and learning objectives.",
    category: 'gameplay',
  },
  {
    text: "Spaced repetition is built into Gogo Arabic — words you struggle with appear more often.",
    category: 'gameplay',
  },
  {
    text: "Collecting all calligraphy scrolls in a district unlocks a hidden grammar boss encounter.",
    category: 'gameplay',
  },
  {
    text: "Your companion Gogo translates hints — but relying on them too much costs XP.",
    category: 'gameplay',
  },
  {
    text: "Fast travel between discovered towns by opening the World Map (W).",
    category: 'gameplay',
  },
  {
    text: "The Souk is the best place to practice bartering vocabulary — haggle in Arabic!",
    category: 'gameplay',
  },
  {
    text: "Unlock the Historian path by solving all 5 ancient inscription puzzles in the Desert Ruins.",
    category: 'gameplay',
  },
  {
    text: "Equipment enchanted with Arabic words grants stat bonuses matching the word's meaning.",
    category: 'gameplay',
  },
  {
    text: "Three correct answers in a row triggers a streak bonus — keep it going for max XP.",
    category: 'gameplay',
  },
  {
    text: "NPC relationships improve when you use their native dialect phrases correctly.",
    category: 'gameplay',
  },
  {
    text: "The Scholar path (القارئ) focuses on reading and grammar — ideal for literary Arabic.",
    textArabic: "القارئ",
    category: 'gameplay',
  },
  {
    text: "The Traveler path (المسافر) teaches practical conversational vocabulary first.",
    textArabic: "المسافر",
    category: 'gameplay',
  },
  {
    text: "The Historian path (المؤرخ) unlocks Classical Arabic texts and ancient lore quests.",
    textArabic: "المؤرخ",
    category: 'gameplay',
  },
];

// ============================================================
// ROTATION STATE
// Shuffle-without-repeat: keep a shuffled deck, pop from it.
// When empty, reshuffle and repeat.
// ============================================================

/** @type {Array<{text: string, textArabic?: string, category: 'language'|'gameplay'|'history'}>} */
let _deck = [];

/**
 * Fisher-Yates shuffle in place.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Refill and shuffle the deck from the master TIPS array.
 */
function refillDeck() {
  _deck = shuffleInPlace([...TIPS]);
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Returns a random tip, cycling through all tips before repeating.
 *
 * @returns {{text: string, textArabic?: string, category: 'language'|'gameplay'|'history'}}
 */
export function getRandomTip() {
  if (_deck.length === 0) refillDeck();
  return _deck.pop();
}

/**
 * Returns all tips (read-only reference — do not mutate).
 *
 * @returns {typeof TIPS}
 */
export function getAllTips() {
  return TIPS;
}

/**
 * Returns tips filtered by category.
 *
 * @param {'language'|'gameplay'|'history'} category
 * @returns {typeof TIPS}
 */
export function getTipsByCategory(category) {
  return TIPS.filter((tip) => tip.category === category);
}
