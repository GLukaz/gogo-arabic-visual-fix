/**
 * Zone Grammar Points — FEAT-048
 *
 * Grammar teaching points mapped to each of the 8 world zones.
 * Each zone introduces 2-3 grammar concepts relevant to that zone's content,
 * taught just-in-time when the player needs them rather than in abstract sequence.
 *
 * Grammar concepts progress naturally across zones:
 *   Zones 1-2: sentence basics, present tense, pronouns
 *   Zones 3-4: past tense, plurals, possession
 *   Zones 5-6: future, conditionals, comparatives/negation
 *   Zones 7-8: passive, relative clauses, complex sentences
 *
 * Each grammar point:
 *   - id            {string}    Unique point ID (prefixed by zone)
 *   - zone          {string}    Zone this point belongs to
 *   - concept       {string}    Short concept name (e.g. "Definite Article ال")
 *   - explanation   {string}    Plain-English explanation (beginner-friendly)
 *   - arabicExample {string}    An Arabic example sentence demonstrating the concept
 *   - pattern       {string}    The abstract grammatical pattern (e.g. "ال + noun")
 *   - relatedVocab  {string[]}  Arabic words from the zone that use this grammar
 *   - cefrLevel     {string}    'A1' | 'A2' | 'B1' | 'B2'
 *   - order         {number}    Global ordering for natural progression (1 = first taught)
 */

// ── Grammar Points ─────────────────────────────────────────────────────────────

const ZONE_GRAMMAR_POINTS = {
  /**
   * Zone 1: Oasis Village — basics, greetings, everyday life
   * Grammar focus: definite article, nominal sentences, personal pronouns
   */
  oasis_village: [
    {
      id: 'gp_ov_001',
      zone: 'oasis_village',
      concept: 'Definite Article ال',
      explanation:
        'Arabic uses ال (al-) at the start of a word to mean "the". Unlike English, it attaches directly to the noun with no space. Some letters change the pronunciation of ال, but the spelling is always the same.',
      arabicExample: 'الوَاحَة جَميلَة — The oasis is beautiful.',
      pattern: 'ال + noun → "the [noun]"',
      relatedVocab: ['الوَاحَة', 'المَاء', 'البَيْت', 'الطَّريق'],
      cefrLevel: 'A1',
      order: 1,
    },
    {
      id: 'gp_ov_002',
      zone: 'oasis_village',
      concept: 'Nominal Sentence (Jumlah Ismiyya)',
      explanation:
        'Arabic can describe things without using a verb "to be". You simply place the subject and then a description: "The house [is] big." This is called a nominal sentence and it is extremely common.',
      arabicExample: 'البَيْت كَبير — The house is big.',
      pattern: 'subject + description (no verb needed)',
      relatedVocab: ['البَيْت', 'كَبير', 'صَغير', 'جَميل', 'قَريب'],
      cefrLevel: 'A1',
      order: 2,
    },
    {
      id: 'gp_ov_003',
      zone: 'oasis_village',
      concept: 'Personal Pronouns (أنا، أنتَ، هو، هي)',
      explanation:
        'Arabic has separate pronouns for "I", "you (masc.)", "you (fem.)", "he", "she", and more. In a nominal sentence, you can use a pronoun as the subject: "I am a student."',
      arabicExample: 'أنَا طَالِب — I am a student.',
      pattern: 'pronoun + description → "I/you/he/she [is] ..."',
      relatedVocab: ['أنَا', 'أنْتَ', 'أنْتِ', 'هُوَ', 'هِيَ'],
      cefrLevel: 'A1',
      order: 3,
    },
  ],

  /**
   * Zone 2: Ancient Library — academic, knowledge, reading
   * Grammar focus: present tense verb, masculine/feminine nouns, noun-adjective gender agreement
   */
  ancient_library: [
    {
      id: 'gp_al_001',
      zone: 'ancient_library',
      concept: 'Present Tense Verb (المضارع)',
      explanation:
        'Arabic present-tense verbs change their prefix depending on who is doing the action. "He reads" = يَقْرَأ, "She reads" = تَقْرَأ, "I read" = أَقْرَأ. The root (ق-ر-أ) stays the same; just the prefix changes.',
      arabicExample: 'الطَّالِب يَقْرَأ الكِتَاب — The student reads the book.',
      pattern: 'يـ + verb root (he) / تـ + verb root (she) / أـ + verb root (I)',
      relatedVocab: ['يَقْرَأ', 'يَكْتُب', 'يَتَعَلَّم', 'يَفْهَم', 'يَسْأَل'],
      cefrLevel: 'A1',
      order: 4,
    },
    {
      id: 'gp_al_002',
      zone: 'ancient_library',
      concept: 'Masculine and Feminine Nouns',
      explanation:
        'Arabic nouns are either masculine or feminine. Feminine nouns usually end in ة (taa marbuuta). This affects which adjectives and pronouns you use with them. When in doubt, the ة ending is a reliable guide.',
      arabicExample: 'مَكْتَبَة كَبيرَة — A big library (fem. noun + fem. adjective).',
      pattern: 'noun-ة (feminine) / noun without ة (usually masculine)',
      relatedVocab: ['مَكْتَبَة', 'كِتَابَة', 'قِصَّة', 'لُغَة', 'كَلِمَة'],
      cefrLevel: 'A1',
      order: 5,
    },
    {
      id: 'gp_al_003',
      zone: 'ancient_library',
      concept: 'Noun-Adjective Gender Agreement',
      explanation:
        'Adjectives must match the noun they describe in gender. If the noun is feminine (ends in ة), the adjective also gets a ة ending. If the noun is masculine, the adjective stays in its base form.',
      arabicExample: 'كِتَاب كَبير (masc.) — الكِتَابَة الكَبيرَة (fem.)',
      pattern: 'masc. noun + masc. adj / fem. noun + adj + ة',
      relatedVocab: ['كَبير/كَبيرَة', 'صَغير/صَغيرَة', 'جَديد/جَديدَة', 'قَديم/قَديمَة'],
      cefrLevel: 'A1',
      order: 6,
    },
  ],

  /**
   * Zone 3: Desert Marketplace — commerce, buying, selling, numbers
   * Grammar focus: past tense verb, numbers 1-10 agreement, sound masculine plural
   */
  desert_marketplace: [
    {
      id: 'gp_dm_001',
      zone: 'desert_marketplace',
      concept: 'Past Tense Verb (الماضي)',
      explanation:
        'The Arabic past tense is formed from the 3-letter root with specific vowel patterns. "He bought" = اِشْتَرَى, "She bought" = اِشْتَرَتْ. Past tense is the foundation of storytelling and transaction descriptions.',
      arabicExample: 'اِشْتَرَيْتُ التُّفَّاح — I bought the apples.',
      pattern: 'root + past-tense vowel pattern + pronoun suffix',
      relatedVocab: ['اِشْتَرَى', 'بَاعَ', 'دَفَعَ', 'أَخَذَ', 'أَعْطَى'],
      cefrLevel: 'A1',
      order: 7,
    },
    {
      id: 'gp_dm_002',
      zone: 'desert_marketplace',
      concept: 'Numbers 1-10 and Gender Agreement',
      explanation:
        'Arabic numbers 3-10 show a quirk called "chiasmus": when counting masculine nouns you use the feminine form of the number, and vice versa. Numbers 1-2 agree normally. This surprises learners but becomes natural quickly.',
      arabicExample: 'ثَلَاثَة كُتُب — three books (books = masc. → number takes fem. form)',
      pattern: 'numbers 3-10: opposite gender of the counted noun',
      relatedVocab: ['وَاحِد', 'اِثْنَان', 'ثَلَاثَة', 'أَرْبَعَة', 'خَمْسَة', 'عَشَرَة'],
      cefrLevel: 'A1',
      order: 8,
    },
    {
      id: 'gp_dm_003',
      zone: 'desert_marketplace',
      concept: 'Sound Masculine Plural (جمع المذكر السالم)',
      explanation:
        'Some nouns form their plural by adding ون (nominative) or ين (accusative/genitive) to the singular. These are called "sound" plurals because the singular word shape is preserved. Most refer to people or professions.',
      arabicExample: 'تَاجِر → تُجَّار / مُعَلِّم → مُعَلِّمون',
      pattern: 'singular + ون/ين (masculine) or ات (feminine)',
      relatedVocab: ['تَاجِر/تُجَّار', 'مُعَلِّم/مُعَلِّمون', 'طَالِب/طُلَّاب', 'بَائِع/بَائِعون'],
      cefrLevel: 'A1',
      order: 9,
    },
  ],

  /**
   * Zone 4: Farmland — food, nature, seasons, daily life
   * Grammar focus: idafa (construct state / possession), broken plurals, yes/no questions
   */
  farmland: [
    {
      id: 'gp_fl_001',
      zone: 'farmland',
      concept: 'Idafa — Possession and Genitive Construction (الإضافة)',
      explanation:
        'Arabic expresses possession by placing two nouns together without any word for "of". The first noun loses its nunation (the -n sound at the end) and the second is made definite: "the door of the house" = بَاب البَيْت (literally "door the-house").',
      arabicExample: 'بَاب المَزْرَعَة مَفْتُوح — The door of the farm is open.',
      pattern: 'noun₁ (no nunation) + ال + noun₂ → "the noun₂ of noun₁"',
      relatedVocab: ['بَاب المَزْرَعَة', 'ثِمَار الشَّجَرَة', 'مَاء الحَقْل', 'أَهْل القَرْيَة'],
      cefrLevel: 'A2',
      order: 10,
    },
    {
      id: 'gp_fl_002',
      zone: 'farmland',
      concept: 'Broken Plurals (جمع التكسير)',
      explanation:
        'Many Arabic nouns form their plural by changing the internal vowel pattern — the word "breaks" and reforms. There are about 30 common patterns. Exposure over time is more effective than memorising all patterns at once.',
      arabicExample: 'كِتَاب → كُتُب / شَجَرَة → أَشْجَار / بَيْت → بُيُوت',
      pattern: 'various internal vowel-change patterns (learn by exposure)',
      relatedVocab: ['شَجَرَة/أَشْجَار', 'ثَمَرَة/ثِمَار', 'حَقْل/حُقُول', 'زَهْرَة/زُهُور'],
      cefrLevel: 'A2',
      order: 11,
    },
    {
      id: 'gp_fl_003',
      zone: 'farmland',
      concept: 'Yes/No Questions with هَلْ',
      explanation:
        'To turn any Arabic statement into a yes/no question, simply add هَلْ at the beginning. No word order change needed. Answer with نَعَم (yes) or لَا (no). Informal speech sometimes uses أَ instead of هَلْ.',
      arabicExample: 'هَلْ هٰذِهِ الفَاكِهَة طَازَجَة؟ — Is this fruit fresh?',
      pattern: 'هَلْ + statement → yes/no question',
      relatedVocab: ['هَلْ', 'نَعَم', 'لَا', 'أَجَل', 'كَلَّا'],
      cefrLevel: 'A2',
      order: 12,
    },
  ],

  /**
   * Zone 5: Bedouin Camp — hospitality, culture, storytelling, traditions
   * Grammar focus: future tense, simple conditional, verbal sentence word order
   */
  bedouin_camp: [
    {
      id: 'gp_bc_001',
      zone: 'bedouin_camp',
      concept: 'Future Tense with سَوْف / سـ',
      explanation:
        'Arabic expresses the future by adding سَوْف or its short form سـ before a present-tense verb. The verb itself does not change. سَوْف is more formal and emphatic; سـ (attached directly to the verb) is more common in everyday speech.',
      arabicExample: 'سَوْف نَجْلِس حَوْل النَّار — We will sit around the fire.',
      pattern: 'سَوْف / سـ + present-tense verb',
      relatedVocab: ['سَيَأْتي', 'سَنَتَحَدَّث', 'سَوْف يَنَام', 'سَيُكْرِم'],
      cefrLevel: 'A2',
      order: 13,
    },
    {
      id: 'gp_bc_002',
      zone: 'bedouin_camp',
      concept: 'Simple Conditional with إِذَا',
      explanation:
        'إِذَا (itha) introduces a condition: "if X, then Y". In a real/likely condition, both clauses usually use past tense even when talking about the future. This differs from English and is worth noticing early.',
      arabicExample: 'إِذَا جِئْتَ مَعَنَا، أَكَلْنَا سَوِيًّا — If you come with us, we will eat together.',
      pattern: 'إِذَا + past-tense clause → result clause',
      relatedVocab: ['إِذَا', 'لَوْ', 'فَ', 'إِذَن', 'عِنْدَمَا'],
      cefrLevel: 'A2',
      order: 14,
    },
  ],

  /**
   * Zone 6: Mountain Village — travel, nature, journeys, comparisons
   * Grammar focus: comparative/superlative, negation with لا/لم/لن
   */
  mountain_village: [
    {
      id: 'gp_mv_001',
      zone: 'mountain_village',
      concept: 'Comparative and Superlative (أَفْعَل Pattern)',
      explanation:
        'Arabic forms comparatives and superlatives using the أَفْعَل pattern (vowel-consonant-vowel-consonant-vowel on the three root letters). "Big → bigger" = كَبير → أَكْبَر. The same form serves for both "bigger" and "biggest" depending on context.',
      arabicExample: 'الجَبَل أَعْلَى مِن التَّل — The mountain is higher than the hill.',
      pattern: 'أَفْعَل from the root → "more/most [adjective]"',
      relatedVocab: ['أَكْبَر', 'أَصْغَر', 'أَعْلَى', 'أَبْعَد', 'أَقْرَب', 'أَجْمَل'],
      cefrLevel: 'A2',
      order: 15,
    },
    {
      id: 'gp_mv_002',
      zone: 'mountain_village',
      concept: 'Negation: لَا / لَمْ / لَنْ',
      explanation:
        'Arabic uses different negation words depending on tense: لَا negates the present ("does not"), لَمْ negates the past ("did not") and triggers jussive mood, and لَنْ negates the future ("will not") and triggers subjunctive mood.',
      arabicExample: 'لَمْ نَصِل بَعْد — We have not arrived yet.',
      pattern: 'لَا + present / لَمْ + jussive (past) / لَنْ + subjunctive (future)',
      relatedVocab: ['لَا يَعْرِف', 'لَمْ يَأْت', 'لَنْ يَتْرُك', 'مَا', 'لَيْس'],
      cefrLevel: 'A2',
      order: 16,
    },
  ],

  /**
   * Zone 7: Coastal Port — trade, travel, foreign encounters, news
   * Grammar focus: passive voice, relative clauses, subordinate clauses with أن
   */
  coastal_port: [
    {
      id: 'gp_cp_001',
      zone: 'coastal_port',
      concept: 'Passive Voice (المبني للمجهول)',
      explanation:
        'Arabic passive is formed by changing the internal vowels of a verb: active يَكْتُب (he writes) → passive يُكْتَب (it is written). The doer is unknown or unimportant. Passive is common in formal Arabic and news.',
      arabicExample: 'البَضَائِع تُفَرَّغ في الميناء — The goods are unloaded at the port.',
      pattern: 'active: يَفْعَل → passive: يُفْعَل (present); فَعَل → فُعِل (past)',
      relatedVocab: ['يُرْسَل', 'يُبَاع', 'يُشْحَن', 'يُسْتَوْرَد', 'يُصَدَّر'],
      cefrLevel: 'B1',
      order: 17,
    },
    {
      id: 'gp_cp_002',
      zone: 'coastal_port',
      concept: 'Relative Clauses (الذي / التي / الذين)',
      explanation:
        'Arabic uses الذي (masc. sing.), التي (fem. sing.), and الذين (masc. plural) to introduce relative clauses, equivalent to English "who/that/which". The relative pronoun must agree in gender and number with the noun it refers to.',
      arabicExample: 'التَّاجِر الذي وَصَل أَمس قَادِم مِن الهِنْد — The merchant who arrived yesterday is from India.',
      pattern: 'noun + الذي/التي/الذين + clause describing that noun',
      relatedVocab: ['الذي', 'التي', 'الذين', 'اللَّواتي', 'مَا (for things)'],
      cefrLevel: 'B1',
      order: 18,
    },
    {
      id: 'gp_cp_003',
      zone: 'coastal_port',
      concept: 'Subordinate Clauses with أَنْ',
      explanation:
        'أَنْ (that/to) introduces subordinate clauses after verbs of wanting, knowing, or believing. The following verb goes into the subjunctive mood (usually just drops the final ن for sound verbs). This is essential for expressing wishes and intentions.',
      arabicExample: 'أُريدُ أَنْ أُسافِر — I want to travel.',
      pattern: 'verb of wanting/intending + أَنْ + subjunctive verb',
      relatedVocab: ['أُريد أَنْ', 'يَجِب أَنْ', 'يُمْكِن أَنْ', 'أَعْرِف أَنَّ', 'أَظُن أَنَّ'],
      cefrLevel: 'B1',
      order: 19,
    },
  ],

  /**
   * Zone 8: Royal Palace — formal speech, politics, history, diplomacy
   * Grammar focus: dual form, formal discourse connectors, subjunctive/jussive after modal particles
   */
  royal_palace: [
    {
      id: 'gp_rp_001',
      zone: 'royal_palace',
      concept: 'Dual Form (المثنى)',
      explanation:
        'Arabic has a special dual form for exactly two of something. Nouns add ان (nominative) or ين (other cases). Verbs and adjectives also have dual forms. The dual is used far more frequently in Arabic than in most languages.',
      arabicExample: 'وَزيرَان مُتَنَافِسَان — Two competing ministers.',
      pattern: 'noun + ان (nom.) / ين (acc./gen.) → exactly two',
      relatedVocab: ['وَزيرَان', 'سَفيرَان', 'يَوْمَان', 'مَلِكَان', 'قَرَارَان'],
      cefrLevel: 'B1',
      order: 20,
    },
    {
      id: 'gp_rp_002',
      zone: 'royal_palace',
      concept: 'Formal Discourse Connectors',
      explanation:
        'Formal Arabic uses specific connectors to link ideas: لِذٰلِك (therefore), وَمَعَ ذٰلِك (however/nevertheless), بِالإضَافَة إِلى (in addition to), عَلَى الرَّغْم مِن (despite). These appear constantly in formal speech, news, and official documents.',
      arabicExample: 'القَرَار صَعْب؛ وَمَعَ ذٰلِك، هُوَ ضَروري — The decision is difficult; nevertheless, it is necessary.',
      pattern: 'statement + connector + related statement',
      relatedVocab: ['لِذٰلِك', 'وَمَعَ ذٰلِك', 'بِالإضَافَة', 'عَلى الرَّغْم', 'بِنَاءً عَلى'],
      cefrLevel: 'B1',
      order: 21,
    },
    {
      id: 'gp_rp_003',
      zone: 'royal_palace',
      concept: 'Subjunctive and Jussive after Modal Particles',
      explanation:
        'Certain particles trigger special verb moods. لَمْ and لِـ trigger the jussive (apocopate) mood. أَنْ, كَيْ, لِكَيْ, and لَنْ trigger the subjunctive (منصوب). Sound verbs simply drop their final ن; weak verbs may change shape.',
      arabicExample: 'لِيَحْكُم الوَزيرُ بِعَدْل — Let the minister rule with justice.',
      pattern: 'لِـ + jussive → "let [subject] do..." / لَنْ + subjunctive → "will never do"',
      relatedVocab: ['لِيَحْكُم', 'لَمْ يَصِل', 'لَنْ يُسَامِح', 'كَيْ يَنْجَح', 'حَتَّى يَفْهَم'],
      cefrLevel: 'B1',
      order: 22,
    },
  ],
};

// ── Public Constants ───────────────────────────────────────────────────────────

/** All 8 zone IDs that have grammar points */
export const GRAMMAR_ZONE_IDS = Object.keys(ZONE_GRAMMAR_POINTS);

/** Total number of grammar points across all zones */
export const TOTAL_GRAMMAR_POINTS = Object.values(ZONE_GRAMMAR_POINTS).reduce(
  (sum, pts) => sum + pts.length,
  0,
);

// ── Public Functions ───────────────────────────────────────────────────────────

/**
 * Returns the grammar teaching points for a given zone, ordered by `order` field.
 *
 * @param {string} zoneId - Zone identifier (e.g. 'oasis_village')
 * @returns {Array} Array of grammar point objects, or empty array if zone unknown
 */
export function getZoneGrammar(zoneId) {
  const points = ZONE_GRAMMAR_POINTS[zoneId];
  if (!points) return [];
  return [...points].sort((a, b) => a.order - b.order);
}

/**
 * Returns a flat array of ALL grammar points across all zones, ordered globally.
 *
 * @returns {Array} All grammar points sorted by order
 */
export function getAllGrammarPoints() {
  return Object.values(ZONE_GRAMMAR_POINTS)
    .flat()
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns a grammar point by its unique ID, or undefined if not found.
 *
 * @param {string} pointId - Grammar point ID (e.g. 'gp_ov_001')
 * @returns {Object|undefined}
 */
export function getGrammarPointById(pointId) {
  return getAllGrammarPoints().find((pt) => pt.id === pointId);
}

export { ZONE_GRAMMAR_POINTS };
