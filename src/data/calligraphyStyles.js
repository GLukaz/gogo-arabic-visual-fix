/**
 * calligraphyStyles.js — Arabic calligraphy styles dataset
 *
 * 6 major styles: Naskh, Thuluth, Diwani, Kufi, Ruq'ah, Nastaliq
 * Each style includes history, characteristics, difficulty, and example letters.
 */

export const CALLIGRAPHY_STYLES = [
  {
    id: 'naskh',
    name: 'Naskh',
    nameArabic: 'نسخ',
    description: 'The most widely used script for printing and everyday writing. Its clear letterforms make it the standard for Qurans, newspapers, and textbooks.',
    history: 'Developed in the 10th century by Ibn Muqla, Naskh ("copying") replaced earlier scripts for Quranic transcription. It became the dominant typeface for Arabic printing in the 19th century and remains the standard today.',
    characteristics: [
      'Clear, rounded letterforms',
      'Consistent baseline with slight curves',
      'Small, proportional letters',
      'Dots and diacritics clearly placed',
      'Optimized for readability at small sizes',
    ],
    difficulty: 'beginner',
    difficultyLevel: 1,
    exampleLetters: {
      alif: { description: 'Straight vertical stroke with slight rightward lean', unicode: 'ا' },
      ba: { description: 'Horizontal boat shape with single dot below', unicode: 'ب' },
      jim: { description: 'Rounded bowl with dot inside', unicode: 'ج' },
      dal: { description: 'Small curved stroke from right to left', unicode: 'د' },
      ra: { description: 'Small hook descending below baseline', unicode: 'ر' },
      sin: { description: 'Three teeth followed by a sweeping tail', unicode: 'س' },
    },
    usedFor: ['Quran printing', 'Newspapers', 'Textbooks', 'Digital fonts', 'Government documents'],
    famousPractitioners: ['Ibn Muqla', 'Ibn al-Bawwab'],
    cefrLevel: 'A1',
  },
  {
    id: 'thuluth',
    name: 'Thuluth',
    nameArabic: 'ثلث',
    description: 'An elegant, ornamental script used for mosque decorations, book titles, and official documents. Known for its sweeping curves and tall vertical strokes.',
    history: 'Created in the 7th century and perfected by Ibn Muqla in the 10th century, Thuluth ("one-third") gets its name from the proportion of straight to curved strokes. It is considered the mother of Arabic calligraphy styles.',
    characteristics: [
      'Large, flowing letterforms',
      'Tall vertical strokes (alif, lam)',
      'Deep, sweeping curves below baseline',
      'Vowel marks used decoratively',
      'Letters often overlap and interweave',
      'One-third of each letter is straight',
    ],
    difficulty: 'advanced',
    difficultyLevel: 4,
    exampleLetters: {
      alif: { description: 'Tall, elegant vertical with pronounced head serif', unicode: 'ا' },
      ba: { description: 'Wide, sweeping baseline with dramatic curves', unicode: 'ب' },
      jim: { description: 'Large bowl with decorative flourishes', unicode: 'ج' },
      sin: { description: 'Wide teeth with elongated sweeping tail', unicode: 'س' },
      ain: { description: 'Large, open eye-shaped form', unicode: 'ع' },
      kaf: { description: 'Tall vertical with sweeping horizontal extension', unicode: 'ك' },
    },
    usedFor: ['Mosque inscriptions', 'Book titles', 'Official decrees', 'Architectural decoration', 'Quranic chapter headings'],
    famousPractitioners: ['Ibn Muqla', 'Yaqut al-Musta\'simi', 'Hamid al-Amidi'],
    cefrLevel: 'B1',
  },
  {
    id: 'diwani',
    name: 'Diwani',
    nameArabic: 'ديواني',
    description: 'A cursive, flowing script developed for Ottoman court documents. Characterized by its exaggerated curves, dense letter spacing, and decorative dots.',
    history: 'Created by Housam Roumi during the Ottoman Empire (15th-16th century), Diwani was the official script of the Ottoman court (diwan). Its complex form was intentionally difficult to forge, making it ideal for royal decrees and official correspondence.',
    characteristics: [
      'Highly cursive and flowing',
      'No word spacing — letters flow continuously',
      'Exaggerated curves and loops',
      'Dots often merge into decorative clusters',
      'Slanted baseline rising from right to left',
      'Dense, compact letterforms',
    ],
    difficulty: 'expert',
    difficultyLevel: 5,
    exampleLetters: {
      alif: { description: 'Curved vertical with dramatic lean and hook', unicode: 'ا' },
      ba: { description: 'Deeply curved with fluid connection to next letter', unicode: 'ب' },
      ha: { description: 'Elaborate looping form with flourishes', unicode: 'ه' },
      waw: { description: 'Large round head with sweeping descender', unicode: 'و' },
      ya: { description: 'Deep descending curve with return stroke', unicode: 'ي' },
      nun: { description: 'Deep bowl with dot nestled inside curve', unicode: 'ن' },
    },
    usedFor: ['Ottoman court documents', 'Royal decrees', 'Formal invitations', 'Decorative art', 'Certificates'],
    famousPractitioners: ['Housam Roumi', 'Shafiq Bey'],
    cefrLevel: 'B2',
  },
  {
    id: 'kufi',
    name: 'Kufi',
    nameArabic: 'كوفي',
    description: 'The oldest calligraphic form of Arabic script, characterized by angular, geometric letterforms. Named after the city of Kufa in Iraq.',
    history: 'Originating in the 7th century in Kufa, Iraq, Kufic was the primary script for early Quran manuscripts and architectural inscriptions. While largely replaced by Naskh for text, it remains essential for decorative and architectural purposes across the Islamic world.',
    characteristics: [
      'Angular, geometric letterforms',
      'Horizontal strokes are elongated',
      'Vertical strokes are short and thick',
      'Minimal curves — emphasis on straight lines',
      'Originally had no dots or diacritics',
      'Strong sense of horizontal rhythm',
    ],
    difficulty: 'intermediate',
    difficultyLevel: 3,
    exampleLetters: {
      alif: { description: 'Thick, straight vertical stroke with flat top', unicode: 'ا' },
      ba: { description: 'Flat horizontal with angular connections', unicode: 'ب' },
      dal: { description: 'Angular corner shape — no curves', unicode: 'د' },
      sin: { description: 'Three angular teeth with flat connections', unicode: 'س' },
      lam: { description: 'Tall, thick vertical with angular base', unicode: 'ل' },
      mim: { description: 'Square or diamond-shaped head', unicode: 'م' },
    },
    usedFor: ['Early Quran manuscripts', 'Mosque architecture', 'Coins and stamps', 'Logos and branding', 'Decorative borders'],
    famousPractitioners: ['Early Kufan scribes', 'Modern: Mouneer al-Shaarani'],
    cefrLevel: 'A2',
  },
  {
    id: 'ruqah',
    name: 'Ruq\'ah',
    nameArabic: 'رقعة',
    description: 'The everyday handwriting script of the Arab world. Simple, practical, and fast to write, it is taught as the standard handwriting in schools across the Middle East.',
    history: 'Developed during the Ottoman Empire as a simplified script for everyday use, Ruq\'ah ("small sheet") prioritizes speed and practicality over decoration. It became the standard taught handwriting in Arab schools and is the script most people use for notes, letters, and quick writing.',
    characteristics: [
      'Small, compact letterforms',
      'Minimal decorative elements',
      'Dots often simplified or omitted',
      'Slightly slanted baseline',
      'Rounded but not ornate',
      'Optimized for writing speed',
    ],
    difficulty: 'beginner',
    difficultyLevel: 2,
    exampleLetters: {
      alif: { description: 'Short, slightly leaning vertical', unicode: 'ا' },
      ba: { description: 'Simple curve with quick dot', unicode: 'ب' },
      jim: { description: 'Quick curved stroke, dot often a dash', unicode: 'ج' },
      sin: { description: 'Teeth simplified to wavy line', unicode: 'س' },
      fa: { description: 'Small head with single quick dot', unicode: 'ف' },
      qaf: { description: 'Small round head with two quick dots', unicode: 'ق' },
    },
    usedFor: ['Everyday handwriting', 'School notebooks', 'Personal letters', 'Quick notes', 'Informal documents'],
    famousPractitioners: ['Mumtaz Bey (standardized)'],
    cefrLevel: 'A1',
  },
  {
    id: 'nastaliq',
    name: 'Nastaliq',
    nameArabic: 'نستعليق',
    description: 'A graceful, hanging script primarily used for Persian, Urdu, and Pashto. Known for its dramatic descending baseline and elegant curves.',
    history: 'Developed in 14th-15th century Persia by Mir Ali Tabrizi, Nastaliq ("hanging Naskh") combines elements of Naskh and Ta\'liq scripts. While not standard for Arabic, it profoundly influenced Islamic calligraphy and remains the primary script for Persian and Urdu literature.',
    characteristics: [
      'Dramatic descending baseline from right to left',
      'Letters "hang" from an invisible diagonal line',
      'Deep, sweeping curves',
      'Thick-to-thin stroke variation',
      'Words appear to cascade downward',
      'Highly decorative and space-intensive',
    ],
    difficulty: 'advanced',
    difficultyLevel: 4,
    exampleLetters: {
      alif: { description: 'Tall, slightly curved vertical with thick head', unicode: 'ا' },
      ba: { description: 'Hanging curve descending below the line', unicode: 'ب' },
      sin: { description: 'Teeth cascade downward following the slope', unicode: 'س' },
      lam: { description: 'Tall vertical with flowing connection below', unicode: 'ل' },
      nun: { description: 'Deep hanging bowl with dot above', unicode: 'ن' },
      ya: { description: 'Dramatic descending sweep', unicode: 'ي' },
    },
    usedFor: ['Persian poetry', 'Urdu literature', 'Pashto texts', 'Decorative art', 'Book covers'],
    famousPractitioners: ['Mir Ali Tabrizi', 'Mir Emad Qazvini'],
    cefrLevel: 'B1',
  },
];

/**
 * Get a calligraphy style by ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getStyleById(id) {
  return CALLIGRAPHY_STYLES.find((s) => s.id === id);
}

/**
 * Get styles sorted by difficulty.
 * @returns {Object[]}
 */
export function getStylesByDifficulty() {
  return [...CALLIGRAPHY_STYLES].sort((a, b) => a.difficultyLevel - b.difficultyLevel);
}

/**
 * Get styles appropriate for a CEFR level.
 * @param {string} cefrLevel - 'A1' | 'A2' | 'B1' | 'B2'
 * @returns {Object[]}
 */
export function getStylesForLevel(cefrLevel) {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const maxIndex = levels.indexOf(cefrLevel);
  if (maxIndex < 0) return CALLIGRAPHY_STYLES;
  return CALLIGRAPHY_STYLES.filter((s) => levels.indexOf(s.cefrLevel) <= maxIndex);
}
