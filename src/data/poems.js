/**
 * poems.js — 10 curated classical Arabic poems with fill-in-blank positions
 *
 * All poems are public domain (pre-1900, classical era).
 * Each poem has 3-5 fill-in-blank positions with correctWord, wordId, and cefrLevel.
 * wordId values map to the vocabulary system (vocabularyAll.js) where available,
 * or use descriptive IDs for classical vocabulary not in the modern corpus.
 *
 * Used by poetryBattle.js service for choice generation.
 *
 * POET-02: 10 curated poems requirement.
 */

/**
 * @typedef {Object} PoetryBlank
 * @property {number} position   — word index in the line (0-based)
 * @property {string} wordId     — vocabulary ID for this word
 * @property {string} correctWord — the correct Arabic word for this blank
 * @property {string} cefrLevel  — CEFR difficulty level (A1/A2/B1/B2)
 */

/**
 * @typedef {Object} PoetryLine
 * @property {string}        text     — Arabic text with _____ placeholders
 * @property {string}        fullText — Arabic text with correct words filled in
 * @property {PoetryBlank[]} blanks   — blank positions (may be empty for display-only lines)
 */

/**
 * @typedef {Object} Poem
 * @property {string}       id           — unique identifier
 * @property {string}       title        — Arabic title
 * @property {string}       titleEnglish — English title
 * @property {string}       poet         — Arabic poet name
 * @property {string}       poetEnglish  — English poet name
 * @property {string}       era          — century/period
 * @property {string}       cefrLevel    — overall difficulty (A2/B1/B2)
 * @property {PoetryLine[]} lines        — poem lines
 * @property {number}       totalBlanks  — pre-computed total blank count
 */

export const POEMS = [
  // ─────────────────────────────────────────────────────────
  // 1. Al-Mutanabbi — على قدر أهل العزم (10th century, B1)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_mutanabbi_01',
    title: 'على قدر أهل العزم',
    titleEnglish: 'According to the People of Resolve',
    poet: 'المتنبي',
    poetEnglish: 'Al-Mutanabbi',
    era: '10th century',
    cefrLevel: 'B1',
    lines: [
      {
        text: 'على قدر أهل _____ تأتي العزائم',
        fullText: 'على قدر أهل العزم تأتي العزائم',
        blanks: [
          { position: 3, wordId: 'azm_classical', correctWord: 'العزم', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'وتأتي على قدر _____ المكارم',
        fullText: 'وتأتي على قدر الكرام المكارم',
        blanks: [
          { position: 4, wordId: 'kiram_classical', correctWord: 'الكرام', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'وتعظم في عين _____ الصغار',
        fullText: 'وتعظم في عين الصغير الصغار',
        blanks: [
          { position: 4, wordId: 'saghir_classical', correctWord: 'الصغير', cefrLevel: 'A2' },
        ],
      },
      {
        text: 'وتصغر في عين _____ العظائم',
        fullText: 'وتصغر في عين العظيم العظائم',
        blanks: [
          { position: 4, wordId: 'adhim_classical', correctWord: 'العظيم', cefrLevel: 'B1' },
        ],
      },
    ],
    totalBlanks: 4,
  },

  // ─────────────────────────────────────────────────────────
  // 2. Abu Tammam — السيف أصدق إنباءً (9th century, B1)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_abu_tammam_01',
    title: 'السيف أصدق إنباءً من الكتب',
    titleEnglish: 'The Sword is More Truthful Than Books',
    poet: 'أبو تمام',
    poetEnglish: 'Abu Tammam',
    era: '9th century',
    cefrLevel: 'B1',
    lines: [
      {
        text: 'السيف أصدق إنباءً من _____',
        fullText: 'السيف أصدق إنباءً من الكتب',
        blanks: [
          { position: 5, wordId: 'kutub_classical', correctWord: 'الكتب', cefrLevel: 'A2' },
        ],
      },
      {
        text: 'في حده الحد بين الجد و_____',
        fullText: 'في حده الحد بين الجد واللعب',
        blanks: [
          { position: 6, wordId: 'laib_classical', correctWord: 'اللعب', cefrLevel: 'A2' },
        ],
      },
      {
        text: 'بيض الصفائح لا سود _____ في متونها',
        fullText: 'بيض الصفائح لا سود الصحائف في متونها',
        blanks: [
          { position: 5, wordId: 'sahayif_classical', correctWord: 'الصحائف', cefrLevel: 'B1' },
        ],
      },
    ],
    totalBlanks: 3,
  },

  // ─────────────────────────────────────────────────────────
  // 3. Imru' al-Qais — قفا نبك (6th century, B2)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_imruulqais_01',
    title: 'قفا نبك',
    titleEnglish: 'Halt, Let Us Weep',
    poet: 'امرؤ القيس',
    poetEnglish: "Imru' al-Qais",
    era: '6th century',
    cefrLevel: 'B2',
    lines: [
      {
        text: 'قفا نبك من ذكرى حبيب و_____',
        fullText: 'قفا نبك من ذكرى حبيب ومنزل',
        blanks: [
          { position: 6, wordId: 'manzil_classical', correctWord: 'ومنزل', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'بسقط اللوى بين الدخول فحَوْ_____',
        fullText: 'بسقط اللوى بين الدخول فحَوْمل',
        blanks: [
          { position: 5, wordId: 'hawmal_classical', correctWord: 'فحَوْمل', cefrLevel: 'B2' },
        ],
      },
      {
        text: 'فتوضح فالمقراة لم يعف _____',
        fullText: 'فتوضح فالمقراة لم يعف رسمها',
        blanks: [
          { position: 5, wordId: 'rasmuha_classical', correctWord: 'رسمها', cefrLevel: 'B2' },
        ],
      },
      {
        text: 'لما نسجتها من جنوب وشَ_____',
        fullText: 'لما نسجتها من جنوب وشَمأل',
        blanks: [
          { position: 5, wordId: 'shamal_wind', correctWord: 'وشَمأل', cefrLevel: 'B2' },
        ],
      },
    ],
    totalBlanks: 4,
  },

  // ─────────────────────────────────────────────────────────
  // 4. Al-Ma'arri — غير مجد في ملتي (11th century, B2)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_maarri_01',
    title: 'غير مجد في ملتي واعتقادي',
    titleEnglish: 'Useless in My Faith and Belief',
    poet: 'أبو العلاء المعري',
    poetEnglish: "Al-Ma'arri",
    era: '11th century',
    cefrLevel: 'B2',
    lines: [
      {
        text: 'غير مجد في ملتي واعتقادي نوح _____ ولا بكاء المفدِّي',
        fullText: 'غير مجد في ملتي واعتقادي نوح باكٍ ولا بكاء المفدِّي',
        blanks: [
          { position: 5, wordId: 'bak_classical', correctWord: 'باكٍ', cefrLevel: 'B2' },
        ],
      },
      {
        text: 'فالبكاء على الميت _____ يذهب بالحزن',
        fullText: 'فالبكاء على الميت مجد يذهب بالحزن',
        blanks: [
          { position: 4, wordId: 'majd_classical', correctWord: 'مجد', cefrLevel: 'B2' },
        ],
      },
      {
        text: 'وما ينفع الميت البكاء وما نفع ال_____ الحياء',
        fullText: 'وما ينفع الميت البكاء وما نفع الحياة الحياء',
        blanks: [
          { position: 7, wordId: 'hayat_classical', correctWord: 'الحياة', cefrLevel: 'A2' },
        ],
      },
    ],
    totalBlanks: 3,
  },

  // ─────────────────────────────────────────────────────────
  // 5. Ibn Zaydun — أضحى التنائي (11th century, A2)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_ibn_zaydun_01',
    title: 'أضحى التنائي بديلاً',
    titleEnglish: 'Distance Has Become a Substitute',
    poet: 'ابن زيدون',
    poetEnglish: 'Ibn Zaydun',
    era: '11th century',
    cefrLevel: 'A2',
    lines: [
      {
        text: 'أضحى التنائي بديلاً عن _____',
        fullText: 'أضحى التنائي بديلاً عن تدانينا',
        blanks: [
          { position: 4, wordId: 'tadanina_classical', correctWord: 'تدانينا', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'وناب عن طيب لقيانا _____ بنا',
        fullText: 'وناب عن طيب لقيانا تجافينا',
        blanks: [
          { position: 5, wordId: 'tajafina_classical', correctWord: 'تجافينا', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'ألا وقد حان صبح البين ضاء لنا _____ من فلقه الصادق',
        fullText: 'ألا وقد حان صبح البين ضاء لنا فانهض وداعٌ من فلقه الصادق',
        blanks: [
          { position: 7, wordId: 'subh_classical', correctWord: 'فانهض', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'إني ذكرتك بالزهراء مشتاقًا والأفق _____ والأرض ساكنة',
        fullText: 'إني ذكرتك بالزهراء مشتاقًا والأفق طلق والأرض ساكنة',
        blanks: [
          { position: 6, wordId: 'talq_classical', correctWord: 'طلق', cefrLevel: 'B1' },
        ],
      },
    ],
    totalBlanks: 4,
  },

  // ─────────────────────────────────────────────────────────
  // 6. Al-Khansa — يذكرني طلوع الشمس (7th century, A2)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_khansa_01',
    title: 'رثاء صخر',
    titleEnglish: 'Elegy for Sakhr',
    poet: 'الخنساء',
    poetEnglish: 'Al-Khansa',
    era: '7th century',
    cefrLevel: 'A2',
    lines: [
      {
        text: 'يذكرني طلوع _____ صخرًا',
        fullText: 'يذكرني طلوع الشمس صخرًا',
        blanks: [
          { position: 3, wordId: 'shams_classical', correctWord: 'الشمس', cefrLevel: 'A1' },
        ],
      },
      {
        text: 'وأذكره لكل _____ غروب',
        fullText: 'وأذكره لكل مغيب غروب',
        blanks: [
          { position: 4, wordId: 'mughayb_classical', correctWord: 'مغيب', cefrLevel: 'A2' },
        ],
      },
      {
        text: 'ولولا كثرة الباكين حولي على _____ لقتلني البكاء',
        fullText: 'ولولا كثرة الباكين حولي على إخوانهم لقتلني البكاء',
        blanks: [
          { position: 7, wordId: 'ikhwan_classical', correctWord: 'إخوانهم', cefrLevel: 'A2' },
        ],
      },
    ],
    totalBlanks: 3,
  },

  // ─────────────────────────────────────────────────────────
  // 7. Abu Nuwas — دع عنك لومي (8th century, B1)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_abu_nuwas_01',
    title: 'دع عنك لومي',
    titleEnglish: 'Leave Off Blaming Me',
    poet: 'أبو نواس',
    poetEnglish: 'Abu Nuwas',
    era: '8th century',
    cefrLevel: 'B1',
    lines: [
      {
        text: 'دع عنك لومي فإن اللوم _____ فدني بما كان فيه الموت لو فدا',
        fullText: 'دع عنك لومي فإن اللوم إغراء فدني بما كان فيه الموت لو فدا',
        blanks: [
          { position: 5, wordId: 'ighra_classical', correctWord: 'إغراء', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'هات اسقني _____ صرفًا',
        fullText: 'هات اسقني خمرًا صرفًا',
        blanks: [
          { position: 3, wordId: 'khamr_classical', correctWord: 'خمرًا', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'ولا تقل _____ يُرضي الله',
        fullText: 'ولا تقل شيئاً يُرضي الله',
        blanks: [
          { position: 3, wordId: 'shay_classical', correctWord: 'شيئاً', cefrLevel: 'A2' },
        ],
      },
      {
        text: 'رُبَّ يوم _____ بالخير',
        fullText: 'رُبَّ يوم بدأت بالخير',
        blanks: [
          { position: 3, wordId: 'bada_classical', correctWord: 'بدأت', cefrLevel: 'A2' },
        ],
      },
    ],
    totalBlanks: 4,
  },

  // ─────────────────────────────────────────────────────────
  // 8. Hassan ibn Thabit — قصيدة (7th century, A2)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_hassan_ibn_thabit_01',
    title: 'مدح النبي',
    titleEnglish: 'In Praise of the Prophet',
    poet: 'حسان بن ثابت',
    poetEnglish: 'Hassan ibn Thabit',
    era: '7th century',
    cefrLevel: 'A2',
    lines: [
      {
        text: 'وأحسن منك لم تر قط _____ وأجمل منك لم تلد النساء',
        fullText: 'وأحسن منك لم تر قط عيني وأجمل منك لم تلد النساء',
        blanks: [
          { position: 6, wordId: 'ayn_classical', correctWord: 'عيني', cefrLevel: 'A1' },
        ],
      },
      {
        text: 'خلقت مبرأً من كل _____ كأنك قد خلقت كما تشاء',
        fullText: 'خلقت مبرأً من كل عيب كأنك قد خلقت كما تشاء',
        blanks: [
          { position: 5, wordId: 'ayb_classical', correctWord: 'عيب', cefrLevel: 'A2' },
        ],
      },
      {
        text: 'أغر عليه للنبوة _____ من الله ممزوج بنور',
        fullText: 'أغر عليه للنبوة خاتم من الله ممزوج بنور',
        blanks: [
          { position: 5, wordId: 'khatam_classical', correctWord: 'خاتم', cefrLevel: 'B1' },
        ],
      },
    ],
    totalBlanks: 3,
  },

  // ─────────────────────────────────────────────────────────
  // 9. Al-Buhturi — وصف الربيع (9th century, B1)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_buhturi_01',
    title: 'وصف الربيع',
    titleEnglish: 'Description of Spring',
    poet: 'البحتري',
    poetEnglish: 'Al-Buhturi',
    era: '9th century',
    cefrLevel: 'B1',
    lines: [
      {
        text: 'أتاك الربيع الطلق يختال _____ ويسحب من برديه أذيال',
        fullText: 'أتاك الربيع الطلق يختال ضاحكًا ويسحب من برديه أذيال',
        blanks: [
          { position: 4, wordId: 'dahikan_classical', correctWord: 'ضاحكًا', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'سرت في ضمير _____ فأحيته',
        fullText: 'سرت في ضمير الأرض فأحيته',
        blanks: [
          { position: 3, wordId: 'ard_classical', correctWord: 'الأرض', cefrLevel: 'A1' },
        ],
      },
      {
        text: 'وجاء ب_____ من الزمان غريبة',
        fullText: 'وجاء بأخلاق من الزمان غريبة',
        blanks: [
          { position: 2, wordId: 'akhlaq_classical', correctWord: 'بأخلاق', cefrLevel: 'B1' },
        ],
      },
      {
        text: 'تروق وتُعجب من رأى _____ من النور',
        fullText: 'تروق وتُعجب من رأى بدائعه من النور',
        blanks: [
          { position: 5, wordId: 'bada_word', correctWord: 'بدائعه', cefrLevel: 'B1' },
        ],
      },
    ],
    totalBlanks: 4,
  },

  // ─────────────────────────────────────────────────────────
  // 10. Labid ibn Rabi'ah — معلقة (6th century, B2)
  // ─────────────────────────────────────────────────────────
  {
    id: 'poem_labid_01',
    title: 'معلقة لبيد',
    titleEnglish: "Labid's Ode",
    poet: 'لبيد بن ربيعة',
    poetEnglish: "Labid ibn Rabi'ah",
    era: '6th century',
    cefrLevel: 'B2',
    lines: [
      {
        text: 'عفت الديار محلها فمقامها ب_____ فالقوادم فالبُراق',
        fullText: 'عفت الديار محلها فمقامها بمنى فالقوادم فالبُراق',
        blanks: [
          { position: 4, wordId: 'mina_classical', correctWord: 'بمنى', cefrLevel: 'B2' },
        ],
      },
      {
        text: 'فمدافع الريان عُرِّي _____ من البلى',
        fullText: 'فمدافع الريان عُرِّي رسمها من البلى',
        blanks: [
          { position: 4, wordId: 'rasm_classical', correctWord: 'رسمها', cefrLevel: 'B2' },
        ],
      },
      {
        text: 'وجرت عليها كل _____ هوجاء مارقة',
        fullText: 'وجرت عليها كل ريح هوجاء مارقة',
        blanks: [
          { position: 4, wordId: 'ria_classical', correctWord: 'ريح', cefrLevel: 'A2' },
        ],
      },
      {
        text: 'ودق الرواعد فاستجاب _____ بها',
        fullText: 'ودق الرواعد فاستجاب لها الصدى',
        blanks: [
          { position: 5, wordId: 'sada_classical', correctWord: 'لها', cefrLevel: 'A1' },
        ],
      },
    ],
    totalBlanks: 4,
  },
];

/**
 * Get a poem by its ID.
 * @param {string} id — poem ID
 * @returns {Poem|undefined}
 */
export function getPoemById(id) {
  return POEMS.find((p) => p.id === id);
}

/**
 * Get all blanks across all lines for a given poem, as a flat array.
 * Each blank entry includes the lineIndex for UI positioning.
 * @param {Poem} poem
 * @returns {Array<PoetryBlank & { lineIndex: number }>}
 */
export function getPoemBlanks(poem) {
  const blanks = [];
  poem.lines.forEach((line, lineIndex) => {
    if (line.blanks && line.blanks.length > 0) {
      line.blanks.forEach((blank, _blankOffset) => {
        blanks.push({
          ...blank,
          lineIndex,
          blankIndex: blanks.length,
        });
      });
    }
  });
  return blanks;
}
