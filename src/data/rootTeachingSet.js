/**
 * rootTeachingSet.js — FEAT-043
 *
 * 30 common Arabic trilateral roots with derived word families.
 * Used by rootKnowledgeSlice for the foundation phase teaching engine.
 *
 * Schema:
 * {
 *   id:           string  — unique root ID (root_ktb, root_drs, …)
 *   root:         string  — hyphen-separated Arabic radicals (e.g. "ك-ت-ب")
 *   coreMeaning:  string  — core English gloss for the root concept
 *   foundationOrder: number|null — order in foundation phase (1-5); null = not a foundation root
 *   derivedWords: Array<{
 *     arabic:   string  — Arabic word with diacritics
 *     english:  string  — English meaning
 *     pattern:  string  — morphological pattern ID (see PATTERN_TEMPLATES)
 *     form:     string  — grammatical form label
 *   }>  — 4-6 words per root
 * }
 *
 * Foundation roots (foundationOrder 1-5):
 *   Introduced after the first 20 core words in the foundation phase.
 *   These are the highest-yield, most familiar roots for beginners.
 */

// ── Pattern Templates ─────────────────────────────────────────────────────────
//
// Arabic verb/noun patterns use ف (fa'), ع ('ain), ل (lam) as radical placeholders.
// predictWordFromRoot() substitutes real root radicals into these templates.

export const PATTERN_TEMPLATES = {
  fa3ala:   'فَعَلَ',     // Past tense verb, Form I (e.g. كَتَبَ)
  yaf3ulu:  'يَفْعُلُ',   // Present tense verb, Form I (e.g. يَكْتُبُ)
  yaf3ilu:  'يَفْعِلُ',   // Present tense verb, Form I variant (e.g. يَجْلِسُ)
  fa3ila:   'فَعِلَ',     // Stative past verb, Form I (e.g. فَهِمَ)
  fa3l:     'فَعْل',      // Short verbal noun, Form I (e.g. فَهْم)
  fi3al:    'فِعَال',     // Intensified noun / verbal noun (e.g. كِتَاب) — variant: fi3al
  fa3il:    'فَاعِل',     // Active participle, Form I (e.g. كَاتِب)
  maf3ul:   'مَفْعُول',   // Passive participle, Form I (e.g. مَكْتُوب)
  maf3ala:  'مَفْعَلَة',  // Place noun / instrument noun (e.g. مَدْرَسَة)
  fi3ala:   'فِعَالَة',   // Abstract noun / occupation (e.g. كِتَابَة)
  fa33ala:  'فَعَّلَ',    // Intensive/causative verb, Form II (e.g. دَرَّسَ)
  tafa33ul: 'تَفَعُّل',   // Verbal noun of Form V (e.g. تَعَلُّم)
  muf3il:   'مُفْعِل',    // Active participle, Form IV (e.g. مُسَافِر)
  fi3aal:   'فِعَال',     // Plural pattern (broken plural)
  mif3al:   'مِفْعَال',   // Instrument noun (e.g. مِفْتَاح)
};

// ── Root Teaching Set (30 roots) ──────────────────────────────────────────────

export const ROOT_TEACHING_SET = [
  // ── FOUNDATION ROOTS (1-5): Introduced in foundation phase ────────────────
  {
    id: 'root_ktb',
    root: 'ك-ت-ب',
    coreMeaning: 'writing',
    foundationOrder: 1,
    derivedWords: [
      { arabic: 'كَتَبَ',    english: 'he wrote',         pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'كِتَاب',    english: 'book',              pattern: 'fi3al',   form: 'noun' },
      { arabic: 'كَاتِب',    english: 'writer',            pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَكْتُوب',  english: 'written / letter',  pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'مَكْتَبَة', english: 'library / bookstore', pattern: 'maf3ala', form: 'place_noun' },
      { arabic: 'كِتَابَة',  english: 'writing (act)',     pattern: 'fi3ala',  form: 'masdar' },
    ],
  },
  {
    id: 'root_drs',
    root: 'د-ر-س',
    coreMeaning: 'studying / teaching',
    foundationOrder: 2,
    derivedWords: [
      { arabic: 'دَرَسَ',    english: 'he studied',        pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'دَرْس',     english: 'lesson',            pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'مَدْرَسَة', english: 'school',            pattern: 'maf3ala', form: 'place_noun' },
      { arabic: 'دِرَاسَة',  english: 'study / field of study', pattern: 'fi3ala', form: 'masdar' },
      { arabic: 'مُدَرِّس',  english: 'teacher',           pattern: 'muf3il',  form: 'noun' },
      { arabic: 'دَرَّسَ',   english: 'he taught',         pattern: 'fa33ala', form: 'verb_past' },
    ],
  },
  {
    id: 'root_3lm',
    root: 'ع-ل-م',
    coreMeaning: 'knowledge / knowing',
    foundationOrder: 3,
    derivedWords: [
      { arabic: 'عَلِمَ',    english: 'he knew',           pattern: 'fa3ila',  form: 'verb_past' },
      { arabic: 'عِلْم',     english: 'knowledge / science', pattern: 'fa3l',  form: 'masdar' },
      { arabic: 'عَالِم',    english: 'scholar / scientist', pattern: 'fa3il', form: 'active_participle' },
      { arabic: 'مَعْلُوم',  english: 'known / given',     pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'تَعَلُّم',  english: 'learning (process)', pattern: 'tafa33ul', form: 'masdar' },
      { arabic: 'تَعْلِيم',  english: 'education',         pattern: 'fa3l',    form: 'masdar_II' },
    ],
  },
  {
    id: 'root_qr2',
    root: 'ق-ر-أ',
    coreMeaning: 'reading / reciting',
    foundationOrder: 4,
    derivedWords: [
      { arabic: 'قَرَأَ',    english: 'he read / recited', pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'قِرَاءَة',  english: 'reading (act)',     pattern: 'fi3ala',  form: 'masdar' },
      { arabic: 'قَارِئ',    english: 'reader',            pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَقْرُوء',  english: 'something read',    pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'قُرْآن',    english: 'the Quran (recitation)', pattern: 'fa3l', form: 'noun' },
    ],
  },
  {
    id: 'root_klm',
    root: 'ك-ل-م',
    coreMeaning: 'speaking / word',
    foundationOrder: 5,
    derivedWords: [
      { arabic: 'كَلَّمَ',   english: 'he spoke to',       pattern: 'fa33ala', form: 'verb_past' },
      { arabic: 'كَلِمَة',   english: 'word',              pattern: 'fa3ala',  form: 'noun' },
      { arabic: 'كَلَام',    english: 'speech / talk',     pattern: 'fa3al',   form: 'masdar' },
      { arabic: 'مُتَكَلِّم', english: 'speaker',          pattern: 'muf3il',  form: 'active_participle' },
      { arabic: 'مُكَالَمَة', english: 'conversation / call', pattern: 'maf3ala', form: 'masdar' },
    ],
  },

  // ── CORE ROOTS (6-30): Additional high-yield roots ────────────────────────
  {
    id: 'root_jls',
    root: 'ج-ل-س',
    coreMeaning: 'sitting',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'جَلَسَ',   english: 'he sat',            pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'جُلُوس',   english: 'sitting (act)',      pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'جَالِس',   english: 'sitting (person)',   pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَجْلِس',  english: 'council / sitting room', pattern: 'maf3ala', form: 'place_noun' },
      { arabic: 'جَلْسَة',  english: 'session / sitting',  pattern: 'fa3l',    form: 'noun' },
    ],
  },
  {
    id: 'root_2kl',
    root: 'أ-ك-ل',
    coreMeaning: 'eating',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'أَكَلَ',   english: 'he ate',            pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'أَكْل',    english: 'eating / food',     pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'آكِل',     english: 'eater',             pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَأْكُول', english: 'edible / food item', pattern: 'maf3ul', form: 'passive_participle' },
      { arabic: 'مَأْكَل',  english: 'place to eat',      pattern: 'maf3ala', form: 'place_noun' },
    ],
  },
  {
    id: 'root_shrb',
    root: 'ش-ر-ب',
    coreMeaning: 'drinking',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'شَرِبَ',   english: 'he drank',          pattern: 'fa3ila',  form: 'verb_past' },
      { arabic: 'شَرَاب',   english: 'drink / beverage',  pattern: 'fa3al',   form: 'noun' },
      { arabic: 'شَارِب',   english: 'drinker',           pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَشْرُوب', english: 'beverage (n.)',      pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'مَشْرَب',  english: 'drinking place',    pattern: 'maf3ala', form: 'place_noun' },
    ],
  },
  {
    id: 'root_dhb',
    root: 'ذ-ه-ب',
    coreMeaning: 'going',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'ذَهَبَ',   english: 'he went',           pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'ذَهَاب',   english: 'going (act)',        pattern: 'fa3al',   form: 'masdar' },
      { arabic: 'ذَاهِب',   english: 'going (person)',     pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَذْهَب',  english: 'school of thought',  pattern: 'maf3ala', form: 'noun' },
      { arabic: 'ذَهَب',    english: 'gold',              pattern: 'fa3al',   form: 'noun' },
    ],
  },
  {
    id: 'root_3ml',
    root: 'ع-م-ل',
    coreMeaning: 'work / deed',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'عَمِلَ',   english: 'he worked',         pattern: 'fa3ila',  form: 'verb_past' },
      { arabic: 'عَمَل',    english: 'work / deed',       pattern: 'fa3al',   form: 'masdar' },
      { arabic: 'عَامِل',   english: 'worker',            pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَعْمَل',  english: 'laboratory / workshop', pattern: 'maf3ala', form: 'place_noun' },
      { arabic: 'عُمَّال',  english: 'workers (plural)',  pattern: 'fi3aal',  form: 'plural' },
    ],
  },
  {
    id: 'root_fhm',
    root: 'ف-ه-م',
    coreMeaning: 'understanding',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'فَهِمَ',   english: 'he understood',     pattern: 'fa3ila',  form: 'verb_past' },
      { arabic: 'فَهْم',    english: 'understanding',     pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'فَاهِم',   english: 'one who understands', pattern: 'fa3il', form: 'active_participle' },
      { arabic: 'مَفْهُوم', english: 'concept / understood', pattern: 'maf3ul', form: 'passive_participle' },
      { arabic: 'تَفَاهُم', english: 'mutual understanding', pattern: 'tafa33ul', form: 'masdar' },
    ],
  },
  {
    id: 'root_sm3',
    root: 'س-م-ع',
    coreMeaning: 'hearing / listening',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'سَمِعَ',   english: 'he heard',          pattern: 'fa3ila',  form: 'verb_past' },
      { arabic: 'سَمْع',    english: 'hearing',           pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'سَامِع',   english: 'listener',          pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَسْمُوع', english: 'heard / audible',   pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'مَسْمَع',  english: 'hearing range',     pattern: 'maf3ala', form: 'place_noun' },
    ],
  },
  {
    id: 'root_nzr',
    root: 'ن-ظ-ر',
    coreMeaning: 'looking / seeing',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'نَظَرَ',    english: 'he looked',         pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'نَظَر',     english: 'sight / opinion',   pattern: 'fa3al',   form: 'masdar' },
      { arabic: 'نَاظِر',    english: 'watcher',           pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَنْظَر',   english: 'view / scene',      pattern: 'maf3ala', form: 'noun' },
      { arabic: 'نَظَّارَة', english: 'eyeglasses',        pattern: 'fa33ala', form: 'noun' },
    ],
  },
  {
    id: 'root_xrj',
    root: 'خ-ر-ج',
    coreMeaning: 'going out / exiting',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'خَرَجَ',   english: 'he went out',       pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'خُرُوج',   english: 'exit / going out',  pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'خَارِج',   english: 'outside / exterior', pattern: 'fa3il',  form: 'active_participle' },
      { arabic: 'مَخْرَج',  english: 'exit / outlet',     pattern: 'maf3ala', form: 'place_noun' },
      { arabic: 'إِخْرَاج', english: 'producing / directing', pattern: 'fa3l', form: 'masdar_IV' },
    ],
  },
  {
    id: 'root_dxl',
    root: 'د-خ-ل',
    coreMeaning: 'entering',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'دَخَلَ',   english: 'he entered',        pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'دُخُول',   english: 'entry',             pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'دَاخِل',   english: 'inside / interior', pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَدْخَل',  english: 'entrance',          pattern: 'maf3ala', form: 'place_noun' },
      { arabic: 'إِدْخَال', english: 'insertion / input', pattern: 'fa3l',    form: 'masdar_IV' },
    ],
  },
  {
    id: 'root_wld',
    root: 'و-ل-د',
    coreMeaning: 'birth / child',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'وَلَدَ',   english: 'he gave birth',     pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'وَلَد',    english: 'boy / child',       pattern: 'fa3al',   form: 'noun' },
      { arabic: 'وَالِد',   english: 'father',            pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَوْلُود', english: 'newborn',           pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'مِيلَاد',  english: 'birthday / birth',  pattern: 'mif3al',  form: 'noun' },
      { arabic: 'أَوْلَاد', english: 'children',          pattern: 'fi3aal',  form: 'plural' },
    ],
  },
  {
    id: 'root_fth',
    root: 'ف-ت-ح',
    coreMeaning: 'opening / conquering',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'فَتَحَ',   english: 'he opened',         pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'فَتْح',    english: 'opening / conquest', pattern: 'fa3l',   form: 'masdar' },
      { arabic: 'فَاتِح',   english: 'opener / conqueror', pattern: 'fa3il',  form: 'active_participle' },
      { arabic: 'مَفْتُوح', english: 'open (adj.)',        pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'مِفْتَاح', english: 'key',               pattern: 'mif3al',  form: 'instrument_noun' },
      { arabic: 'فَاتِحَة', english: 'the opening (Al-Fatiha)', pattern: 'fa3ila', form: 'noun' },
    ],
  },
  {
    id: 'root_qwl',
    root: 'ق-و-ل',
    coreMeaning: 'saying / speaking',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'قَالَ',   english: 'he said',            pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'قَوْل',   english: 'saying / speech',    pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'قَائِل',  english: 'one who says',       pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَقَال',  english: 'article / essay',    pattern: 'maf3ul',  form: 'noun' },
      { arabic: 'أَقْوَال', english: 'sayings (plural)',  pattern: 'fi3aal',  form: 'plural' },
    ],
  },
  {
    id: 'root_rj3',
    root: 'ر-ج-ع',
    coreMeaning: 'returning',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'رَجَعَ',   english: 'he returned',       pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'رُجُوع',   english: 'return (act)',       pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'رَاجِع',   english: 'returning (person)', pattern: 'fa3il',  form: 'active_participle' },
      { arabic: 'مَرْجِع',  english: 'reference / source', pattern: 'maf3ala', form: 'noun' },
      { arabic: 'رَجْعَة',  english: 'a return (trip)',   pattern: 'fa3l',    form: 'noun' },
    ],
  },
  {
    id: 'root_sbr',
    root: 'ص-ب-ر',
    coreMeaning: 'patience / endurance',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'صَبَرَ',   english: 'he was patient',    pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'صَبْر',    english: 'patience',          pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'صَابِر',   english: 'patient (person)',  pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'صَبُور',   english: 'very patient',      pattern: 'fa3ul',   form: 'intensified' },
      { arabic: 'مَصْبُور', english: 'something endured', pattern: 'maf3ul',  form: 'passive_participle' },
    ],
  },
  {
    id: 'root_hbb',
    root: 'ح-ب-ب',
    coreMeaning: 'love / affection',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'أَحَبَّ',   english: 'he loved',          pattern: 'fa3ala',  form: 'verb_past_IV' },
      { arabic: 'حُبّ',      english: 'love',              pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'حَبِيب',    english: 'beloved / dear',    pattern: 'fa3il',   form: 'noun' },
      { arabic: 'مَحْبُوب',  english: 'beloved / popular', pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'تَحَابَّ',  english: 'to love each other', pattern: 'tafa33ul', form: 'verb_past_VI' },
    ],
  },
  {
    id: 'root_nwm',
    root: 'ن-و-م',
    coreMeaning: 'sleep',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'نَامَ',    english: 'he slept',           pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'نَوْم',    english: 'sleep',              pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'نَائِم',   english: 'sleeping',           pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَنَام',   english: 'sleep / dream',      pattern: 'maf3ala', form: 'noun' },
      { arabic: 'نَوَّمَ',  english: 'he put to sleep',    pattern: 'fa33ala', form: 'verb_past_II' },
    ],
  },
  {
    id: 'root_jml',
    root: 'ج-م-ل',
    coreMeaning: 'beauty',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'جَمِيل',  english: 'beautiful',           pattern: 'fa3il',   form: 'adjective' },
      { arabic: 'جَمَال',  english: 'beauty',              pattern: 'fa3al',   form: 'masdar' },
      { arabic: 'جَمَّلَ', english: 'he beautified',       pattern: 'fa33ala', form: 'verb_past_II' },
      { arabic: 'جُمْلَة', english: 'sentence / totality', pattern: 'fa3l',    form: 'noun' },
      { arabic: 'أَجْمَل', english: 'more beautiful',      pattern: 'fa3al',   form: 'comparative' },
    ],
  },
  {
    id: 'root_sfr',
    root: 'س-ف-ر',
    coreMeaning: 'travel / journey',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'سَافَرَ',  english: 'he traveled',        pattern: 'fa3ala',  form: 'verb_past_III' },
      { arabic: 'سَفَر',    english: 'travel / journey',   pattern: 'fa3al',   form: 'masdar' },
      { arabic: 'مُسَافِر', english: 'traveler',           pattern: 'muf3il',  form: 'active_participle' },
      { arabic: 'سَفِير',   english: 'ambassador',         pattern: 'fa3il',   form: 'noun' },
      { arabic: 'سِفَارَة', english: 'embassy',            pattern: 'fi3ala',  form: 'noun' },
    ],
  },
  {
    id: 'root_mlk',
    root: 'م-ل-ك',
    coreMeaning: 'ownership / kingship',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'مَلَكَ',    english: 'he owned',          pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'مَلِك',     english: 'king',              pattern: 'fa3il',   form: 'noun' },
      { arabic: 'مُلْك',     english: 'kingdom / ownership', pattern: 'fa3l',  form: 'masdar' },
      { arabic: 'مَالِك',    english: 'owner',             pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَمْلَكَة', english: 'kingdom',           pattern: 'maf3ala', form: 'noun' },
      { arabic: 'مَمْلُوك',  english: 'owned / Mamluk',    pattern: 'maf3ul',  form: 'passive_participle' },
    ],
  },
  {
    id: 'root_rhm',
    root: 'ر-ح-م',
    coreMeaning: 'mercy / compassion',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'رَحِمَ',   english: 'he had mercy on',   pattern: 'fa3ila',  form: 'verb_past' },
      { arabic: 'رَحْمَة',  english: 'mercy',             pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'رَحِيم',   english: 'merciful',          pattern: 'fa3il',   form: 'adjective' },
      { arabic: 'رَحْمَن',  english: 'most merciful',     pattern: 'fa3al',   form: 'adjective' },
      { arabic: 'مَرْحُوم', english: 'the late (may he rest in peace)', pattern: 'maf3ul', form: 'passive_participle' },
    ],
  },
  {
    id: 'root_b3th',
    root: 'ب-ع-ث',
    coreMeaning: 'sending / resurrection',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'بَعَثَ',   english: 'he sent',           pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'بَعْث',    english: 'sending / resurrection', pattern: 'fa3l', form: 'masdar' },
      { arabic: 'بَاعِث',   english: 'sender / motive',   pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَبْعُوث', english: 'sent / envoy',      pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'بَعْثَة',  english: 'mission / delegation', pattern: 'fa3l', form: 'noun' },
    ],
  },
  {
    id: 'root_slh',
    root: 'ص-ل-ح',
    coreMeaning: 'righteousness / goodness',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'صَلَحَ',   english: 'it was good / right', pattern: 'fa3ala', form: 'verb_past' },
      { arabic: 'صَلَاح',   english: 'righteousness',      pattern: 'fa3al',   form: 'masdar' },
      { arabic: 'صَالِح',   english: 'righteous / good',   pattern: 'fa3il',   form: 'adjective' },
      { arabic: 'مَصْلَحَة', english: 'common good / interest', pattern: 'maf3ala', form: 'noun' },
      { arabic: 'إِصْلَاح', english: 'reform',             pattern: 'fa3l',    form: 'masdar_IV' },
    ],
  },
  {
    id: 'root_3bd',
    root: 'ع-ب-د',
    coreMeaning: 'worship / servitude',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'عَبَدَ',   english: 'he worshipped',     pattern: 'fa3ala',  form: 'verb_past' },
      { arabic: 'عَبْد',    english: 'servant / worshipper', pattern: 'fa3l', form: 'noun' },
      { arabic: 'عِبَادَة', english: 'worship (act)',      pattern: 'fi3ala',  form: 'masdar' },
      { arabic: 'عَابِد',   english: 'worshipper',         pattern: 'fa3il',   form: 'active_participle' },
      { arabic: 'مَعْبُود', english: 'the worshipped one', pattern: 'maf3ul', form: 'passive_participle' },
    ],
  },
  {
    id: 'root_nsr',
    root: 'ن-ص-ر',
    coreMeaning: 'victory / help',
    foundationOrder: null,
    derivedWords: [
      { arabic: 'نَصَرَ',   english: 'he helped / gave victory', pattern: 'fa3ala', form: 'verb_past' },
      { arabic: 'نَصْر',    english: 'victory / help',    pattern: 'fa3l',    form: 'masdar' },
      { arabic: 'نَاصِر',   english: 'helper / supporter', pattern: 'fa3il',  form: 'active_participle' },
      { arabic: 'مَنْصُور', english: 'victorious',         pattern: 'maf3ul',  form: 'passive_participle' },
      { arabic: 'أَنْصَار', english: 'supporters / helpers', pattern: 'fi3aal', form: 'plural' },
      { arabic: 'نَصِير',   english: 'ally / champion',   pattern: 'fa3il',   form: 'noun' },
    ],
  },
];

// ── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Get a root entry by its ID.
 * @param {string} rootId - e.g. "root_ktb"
 * @returns {Object|null}
 */
export function getRootById(rootId) {
  return ROOT_TEACHING_SET.find((r) => r.id === rootId) ?? null;
}

/**
 * Get a root entry by its Arabic radical string (e.g. "ك-ت-ب").
 * @param {string} rootLetters - Hyphen-separated Arabic radicals
 * @returns {Object|null}
 */
export function getRootByLetters(rootLetters) {
  return ROOT_TEACHING_SET.find((r) => r.root === rootLetters) ?? null;
}

/**
 * Get the 5 foundation roots in teaching order.
 * These are introduced after the first 20 core words in the foundation phase.
 * @returns {Object[]}
 */
export function getFoundationRoots() {
  return ROOT_TEACHING_SET
    .filter((r) => r.foundationOrder !== null)
    .sort((a, b) => a.foundationOrder - b.foundationOrder);
}

// ── Pattern Prediction ────────────────────────────────────────────────────────

/**
 * Predict the Arabic word formed by applying a morphological pattern to a root.
 *
 * Uses simple radical substitution:
 *   ف (fa') → first radical
 *   ع ('ain) → second radical
 *   ل (lam) → third radical
 *
 * Works best for sound trilateral roots (no و/ي radicals or doubled roots).
 * Intended for teaching pattern recognition — not a full morphology engine.
 *
 * @param {string} root - Hyphen-separated radicals, e.g. "ك-ت-ب"
 * @param {string} pattern - Pattern ID from PATTERN_TEMPLATES, e.g. "fa3ala"
 * @returns {string|null} Predicted Arabic word, or null if root/pattern is invalid
 */
export function predictWordFromRoot(root, pattern) {
  if (!root || !pattern) return null;

  const radicals = root.split('-').filter((r) => r.length > 0);
  if (radicals.length !== 3) return null;

  const template = PATTERN_TEMPLATES[pattern];
  if (!template) return null;

  const [r1, r2, r3] = radicals;

  // Two-phase substitution to prevent cross-contamination when a radical
  // is the same Unicode character as a template placeholder (ف, ع, or ل).
  // Phase 1: replace template radicals with private-use placeholder codepoints
  const PLACEHOLDER_1 = '\uE001';
  const PLACEHOLDER_2 = '\uE002';
  const PLACEHOLDER_3 = '\uE003';

  let result = template
    .replace(/ف/g, PLACEHOLDER_1)
    .replace(/ع/g, PLACEHOLDER_2)
    .replace(/ل/g, PLACEHOLDER_3);

  // Phase 2: substitute real radicals
  result = result
    .replace(new RegExp(PLACEHOLDER_1, 'g'), r1)
    .replace(new RegExp(PLACEHOLDER_2, 'g'), r2)
    .replace(new RegExp(PLACEHOLDER_3, 'g'), r3);

  return result;
}
