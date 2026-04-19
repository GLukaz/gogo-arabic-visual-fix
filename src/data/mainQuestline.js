/**
 * mainQuestline.js — Phase 89: Expanded NPC Dialogue & Quest Storylines
 *
 * A 20-quest main storyline weaving through all 8 zones across 5 chapters.
 * Each quest naturally introduces 3-5 Arabic vocabulary words through narrative.
 *
 * Chapter structure:
 *   Ch1 "The Newcomer"   — oasis-village, ancient-library (quests 1-4)
 *   Ch2 "The Marketplace" — desert-marketplace, bedouin-camp (quests 5-8)
 *   Ch3 "The Court"       — royal-palace, mountain-pass (quests 9-12)
 *   Ch4 "The Voyage"      — coastal-port, hidden-oasis (quests 13-16)
 *   Ch5 "The Scholar"     — all zones, culminating challenge (quests 17-20)
 */

export const CHAPTER_META = Object.freeze([
  { chapter: 1, title: 'The Newcomer', titleArabic: 'القادِم الجَديد', zones: ['oasis-village', 'ancient-library'] },
  { chapter: 2, title: 'The Marketplace', titleArabic: 'السّوق', zones: ['desert-marketplace', 'bedouin-camp'] },
  { chapter: 3, title: 'The Court', titleArabic: 'البَلاط', zones: ['royal-palace', 'mountain-pass'] },
  { chapter: 4, title: 'The Voyage', titleArabic: 'الرِّحلَة', zones: ['coastal-port', 'hidden-oasis'] },
  { chapter: 5, title: 'The Scholar', titleArabic: 'العالِم', zones: ['oasis-village', 'ancient-library', 'desert-marketplace', 'bedouin-camp', 'royal-palace', 'mountain-pass', 'coastal-port', 'hidden-oasis'] },
]);

export const MAIN_QUESTLINE = Object.freeze([

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 1 — THE NEWCOMER
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'main_1',
    chapter: 1,
    title: 'Arrival at the Oasis',
    titleArabic: 'الوُصول إِلى الواحَة',
    description: 'A stranger arrives at the Oasis Village gates, unable to speak the local tongue. Guide Amira takes you under her wing and teaches you the words you will need to survive.',
    zone: 'oasis-village',
    npcGiver: 'guide-amira',
    objectives: [
      { id: 'main_1_obj_1', description: 'Speak with Guide Amira at the village gate', descriptionArabic: 'تَكَلَّم مَع المُرشِدَة أَميرَة عِندَ البَوّابَة', type: 'talk' },
      { id: 'main_1_obj_2', description: 'Learn 3 greeting words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات تَحِيَّة', type: 'learn' },
      { id: 'main_1_obj_3', description: 'Greet Scholar Yusuf using Arabic', descriptionArabic: 'حَيِّ الشَّيخ يوسف بِالعَرَبِيَّة', type: 'talk' },
    ],
    dialogueIntro: {
      arabic: 'أَهلاً وَسَهلاً يا مُسافِر! أَنا أَميرَة. تَعال، خَلّيني أُعَلِّمَك كَيف تِحكي مَع أَهل القَريَة',
      english: 'Welcome, traveler! I am Amira. Come, let me teach you how to speak with the villagers.',
    },
    dialogueComplete: {
      arabic: 'مُمتاز! الآن أَنتَ تَعرِف كَيف تِحكي مَع النّاس. الشَّيخ يوسف مَبسوط مِنَّك',
      english: 'Excellent! Now you know how to speak with people. Sheikh Yusuf is pleased with you.',
    },
    reward: { xp: 100, dirhams: 30, item: null },
    prerequisites: [],
    learningObjective: 'Basic Arabic greetings and introductions',
    vocabularyIntroduced: ['salaam', 'marhaba', 'ahlan', 'shukran', 'afwan'],
  },

  {
    id: 'main_2',
    chapter: 1,
    title: 'The Scholar\'s Test',
    titleArabic: 'اِمتِحان العالِم',
    description: 'Scholar Yusuf does not accept students easily. Prove your dedication by learning the first letters of the Arabic alphabet and passing his quiz.',
    zone: 'oasis-village',
    npcGiver: 'scholar-yusuf',
    objectives: [
      { id: 'main_2_obj_1', description: 'Learn the first 5 Arabic letters', descriptionArabic: 'تَعَلَّم أَوَّل خَمسَة حُروف عَرَبِيَّة', type: 'learn' },
      { id: 'main_2_obj_2', description: 'Pass Scholar Yusuf\'s alphabet quiz', descriptionArabic: 'اِنجَح في اِمتِحان الحُروف', type: 'battle' },
      { id: 'main_2_obj_3', description: 'Report back to Guide Amira', descriptionArabic: 'اِرجِع لِلمُرشِدَة أَميرَة', type: 'talk' },
    ],
    dialogueIntro: {
      arabic: 'كَثيرون يَأتون وَقَليلون يَبقون. أَرِني أَنَّكَ جادّ — تَعَلَّم هَذِهِ الحُروف',
      english: 'Many come and few stay. Show me that you are serious — learn these letters.',
    },
    dialogueComplete: {
      arabic: 'بِسمِ الله! لَقَد نَجَحتَ. أَنتَ طالِب حَقيقي. مَرحَبًا بِكَ في طَريق العِلم',
      english: 'In God\'s name! You have passed. You are a true student. Welcome to the path of knowledge.',
    },
    reward: { xp: 150, dirhams: 40, item: 'scholars_ink_pot' },
    prerequisites: ['main_1'],
    learningObjective: 'Arabic alphabet introduction (first 5 letters)',
    vocabularyIntroduced: ['kitab', 'qalam', 'bismillah'],
  },

  {
    id: 'main_3',
    chapter: 1,
    title: 'Whispers in the Library',
    titleArabic: 'هَمَسات في المَكتَبَة',
    description: 'Scholar Yusuf sends you to the Ancient Library to find a missing page from an old manuscript. Librarian Ibrahim guards the entrance.',
    zone: 'ancient-library',
    npcGiver: 'scholar-yusuf',
    objectives: [
      { id: 'main_3_obj_1', description: 'Travel to the Ancient Library', descriptionArabic: 'سافِر إِلى المَكتَبَة القَديمَة', type: 'explore' },
      { id: 'main_3_obj_2', description: 'Speak with Librarian Ibrahim in Arabic', descriptionArabic: 'تَكَلَّم مَع أَمين المَكتَبَة إِبراهيم بِالعَرَبِيَّة', type: 'talk' },
      { id: 'main_3_obj_3', description: 'Find the missing manuscript page', descriptionArabic: 'اِعثُر عَلى الصَّفحَة المَفقودَة', type: 'collect' },
      { id: 'main_3_obj_4', description: 'Learn 3 number words from Ibrahim', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات أَرقام مِن إِبراهيم', type: 'learn' },
    ],
    dialogueIntro: {
      arabic: 'يَجِب أَن تَذهَب إِلى المَكتَبَة القَديمَة. هُناك صَفحَة مَفقودَة مِن مَخطوطَة ثَمينَة',
      english: 'You must go to the Ancient Library. There is a missing page from a precious manuscript.',
    },
    dialogueComplete: {
      arabic: 'وَجَدتَها! هَذِهِ الصَّفحَة تَحمِل أَسرارًا قَديمَة. العِلمُ نور، يا بُنَيّ',
      english: 'You found it! This page carries ancient secrets. Knowledge is light, my child.',
    },
    reward: { xp: 175, dirhams: 50, item: null },
    prerequisites: ['main_2'],
    learningObjective: 'Numbers 1-5 and library vocabulary',
    vocabularyIntroduced: ['num_1', 'num_2', 'num_3', 'num_4', 'num_5'],
  },

  {
    id: 'main_4',
    chapter: 1,
    title: 'The Scribe\'s Letter',
    titleArabic: 'رِسالَة الكاتِبَة',
    description: 'Scribe Amina has decoded a letter hidden in the manuscript page. It speaks of a rare spice that can only be found in the Desert Marketplace. Your journey must continue.',
    zone: 'ancient-library',
    npcGiver: 'scribe-amina',
    objectives: [
      { id: 'main_4_obj_1', description: 'Speak with Scribe Amina about the letter', descriptionArabic: 'تَكَلَّم مَع الكاتِبَة أَمينَة عَن الرِّسالَة', type: 'talk' },
      { id: 'main_4_obj_2', description: 'Learn 3 color words from Amina', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات أَلوان مِن أَمينَة', type: 'learn' },
      { id: 'main_4_obj_3', description: 'Copy a sentence in Arabic calligraphy', descriptionArabic: 'اِنسَخ جُملَة بِالخَطّ العَرَبي', type: 'learn' },
    ],
    dialogueIntro: {
      arabic: 'هَذِهِ الصَّفحَة تَتَكَلَّم عَن بَهار نادِر في السّوق. لازِم تِروح وَتِلاقيه',
      english: 'This page speaks of a rare spice in the marketplace. You must go and find it.',
    },
    dialogueComplete: {
      arabic: 'خَطُّكَ جَميل! الآن أَنتَ مُستَعِدّ لِلسّوق. سَفَر سَعيد يا صَديقي',
      english: 'Your handwriting is beautiful! Now you are ready for the marketplace. Safe travels, my friend.',
    },
    reward: { xp: 200, dirhams: 55, item: 'scribes_travel_pass' },
    prerequisites: ['main_3'],
    learningObjective: 'Colors and basic writing practice',
    vocabularyIntroduced: ['color_red', 'color_blue', 'color_green', 'color_white'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — THE MARKETPLACE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'main_5',
    chapter: 2,
    title: 'The Bazaar of Voices',
    titleArabic: 'سوق الأَصوات',
    description: 'The Desert Marketplace is a whirlwind of sounds, smells, and languages. Merchant Fatima offers to help you find the rare spice — but first you must learn to bargain.',
    zone: 'desert-marketplace',
    npcGiver: 'merchant-fatima',
    objectives: [
      { id: 'main_5_obj_1', description: 'Find Merchant Fatima in the marketplace', descriptionArabic: 'اِعثُر عَلى التّاجِرَة فاطِمَة في السّوق', type: 'explore' },
      { id: 'main_5_obj_2', description: 'Learn 5 market vocabulary words', descriptionArabic: 'تَعَلَّم خَمس كَلِمات عَن السّوق', type: 'learn' },
      { id: 'main_5_obj_3', description: 'Successfully haggle for an item using Arabic', descriptionArabic: 'فاوِض بِنَجاح عَلى شَيء بِالعَرَبِيَّة', type: 'battle' },
    ],
    dialogueIntro: {
      arabic: 'أَهلاً يا زَبون! بِدَّك تِشتِري البَهار النّادِر؟ أَوَّلاً لازِم تِتعَلَّم تِفاوِض',
      english: 'Welcome, customer! You want to buy the rare spice? First you must learn to haggle.',
    },
    dialogueComplete: {
      arabic: 'يا سَلام! أَنتَ تاجِر طَبيعي! خَلّيني أَوَصِّلَك لِلبَهار النّادِر',
      english: 'Amazing! You are a natural trader! Let me take you to the rare spice.',
    },
    reward: { xp: 200, dirhams: 75, item: null },
    prerequisites: ['main_4'],
    learningObjective: 'Market vocabulary and numbers for haggling',
    vocabularyIntroduced: ['shop_w28', 'market_w29', 'money_w30', 'price_w31', 'cheap_w32'],
  },

  {
    id: 'main_6',
    chapter: 2,
    title: 'The Spice Trail',
    titleArabic: 'طَريق البَهارات',
    description: 'Spice Seller Layla knows where the rare spice grows — in the hills near the Bedouin Camp. She shares the recipe, but only if you learn her grandmother\'s food words.',
    zone: 'desert-marketplace',
    npcGiver: 'spice-seller-layla',
    objectives: [
      { id: 'main_6_obj_1', description: 'Visit Spice Seller Layla\'s stall', descriptionArabic: 'زُر دُكّان بائِعَة البَهارات لَيلى', type: 'talk' },
      { id: 'main_6_obj_2', description: 'Learn 5 food vocabulary words', descriptionArabic: 'تَعَلَّم خَمس كَلِمات عَن الطَّعام', type: 'learn' },
      { id: 'main_6_obj_3', description: 'Collect 3 common spices from the marketplace', descriptionArabic: 'اِجمَع ثلاث بَهارات مِن السّوق', type: 'collect' },
    ],
    dialogueIntro: {
      arabic: 'البَهار النّادِر؟ جَدَّتي كانَت تَعرِفُه! بَسّ أَوَّل تَعال تَعَلَّم أَسماء الأَكل',
      english: 'The rare spice? My grandmother knew it! But first come learn the names of food.',
    },
    dialogueComplete: {
      arabic: 'أَحسَنت! هَذِهِ خَريطَة لِمَكان البَهار. بَسّ لازِم تِروح لِلبَدو — هُمَّ يِعرِفوا الطَّريق',
      english: 'Well done! Here is a map to the spice location. But you must go to the Bedouin — they know the way.',
    },
    reward: { xp: 225, dirhams: 60, item: 'spice_map' },
    prerequisites: ['main_5'],
    learningObjective: 'Food vocabulary and recipe-related phrases',
    vocabularyIntroduced: ['water_1', 'bread_1', 'tea_1', 'coffee_1', 'honey_1'],
  },

  {
    id: 'main_7',
    chapter: 2,
    title: 'Fire and Stars',
    titleArabic: 'نار وَنُجوم',
    description: 'The Bedouin Camp welcomes you by their fire. Elder Tariq agrees to guide you to the spice, but only after you learn the desert ways — starting with the language of time.',
    zone: 'bedouin-camp',
    npcGiver: 'elder-tariq',
    objectives: [
      { id: 'main_7_obj_1', description: 'Sit with Elder Tariq by the campfire', descriptionArabic: 'اِجلِس مَع الشَّيخ طارِق عِندَ النّار', type: 'talk' },
      { id: 'main_7_obj_2', description: 'Learn 5 time-related words', descriptionArabic: 'تَعَلَّم خَمس كَلِمات عَن الوَقت', type: 'learn' },
      { id: 'main_7_obj_3', description: 'Listen to Storyteller Noor\'s tale of the desert', descriptionArabic: 'اِستَمِع لِقِصَّة الرّاوِيَة نور عَن الصَّحراء', type: 'talk' },
    ],
    dialogueIntro: {
      arabic: 'أَهلاً يا مُسافِر. اِجلِس مَعَنا عِندَ النّار. الصَّحراء تِحكي لِلّي يِسمَع',
      english: 'Welcome, traveler. Sit with us by the fire. The desert speaks to those who listen.',
    },
    dialogueComplete: {
      arabic: 'الآن أَنتَ تَعرِف لُغَة الوَقت. غَدًا — بَعدَ صَلاة الفَجر — نِروح لِلبَهار',
      english: 'Now you know the language of time. Tomorrow — after the dawn prayer — we go to the spice.',
    },
    reward: { xp: 250, dirhams: 50, item: null },
    prerequisites: ['main_6'],
    learningObjective: 'Time vocabulary and desert cultural phrases',
    vocabularyIntroduced: ['day_1', 'night_1', 'morning_1', 'tomorrow_1', 'today_1'],
  },

  {
    id: 'main_8',
    chapter: 2,
    title: 'The Desert Crossing',
    titleArabic: 'عُبور الصَّحراء',
    description: 'With Elder Tariq\'s blessing, you venture into the desert with Wanderer Ali to find the rare spice. The journey tests your Arabic and your courage.',
    zone: 'bedouin-camp',
    npcGiver: 'wanderer-ali',
    objectives: [
      { id: 'main_8_obj_1', description: 'Follow Wanderer Ali through the desert trail', descriptionArabic: 'اِتبَع الرَّحّالَة عَلي في الصَّحراء', type: 'explore' },
      { id: 'main_8_obj_2', description: 'Learn 4 direction words', descriptionArabic: 'تَعَلَّم أَربَع كَلِمات اِتِّجاهات', type: 'learn' },
      { id: 'main_8_obj_3', description: 'Collect the rare spice from the hidden grove', descriptionArabic: 'اِجمَع البَهار النّادِر مِن البُستان المَخفي', type: 'collect' },
      { id: 'main_8_obj_4', description: 'Return to the Oasis Village with the spice', descriptionArabic: 'اِرجِع لِلقَريَة مَع البَهار', type: 'explore' },
    ],
    dialogueIntro: {
      arabic: 'يَلّا يا صاحِبي! الطَّريق طَويل بَسّ جَميل. خَلّيني أُعَلِّمَك الاِتِّجاهات',
      english: 'Let us go, my friend! The road is long but beautiful. Let me teach you directions.',
    },
    dialogueComplete: {
      arabic: 'يا سَلام! وَجَدنا البَهار! بَسّ الرِّحلَة لِسّا ما خَلَصَت. في أَسرار أَكبَر تِنتَظِرَك',
      english: 'Amazing! We found the spice! But the journey is not over yet. Greater secrets await you.',
    },
    reward: { xp: 300, dirhams: 80, item: 'rare_desert_spice' },
    prerequisites: ['main_7'],
    learningObjective: 'Direction vocabulary and desert navigation phrases',
    vocabularyIntroduced: ['north_1', 'south_1', 'east_1', 'west_1'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — THE COURT
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'main_9',
    chapter: 3,
    title: 'The Palace Gates',
    titleArabic: 'أَبواب القَصر',
    description: 'The manuscript page mentions a royal archive that holds the key to understanding its secrets. Vizier Abbas guards the entrance and demands formal Arabic.',
    zone: 'royal-palace',
    npcGiver: 'vizier-abbas',
    objectives: [
      { id: 'main_9_obj_1', description: 'Travel to the Royal Palace', descriptionArabic: 'سافِر إِلى القَصر المَلَكي', type: 'explore' },
      { id: 'main_9_obj_2', description: 'Introduce yourself to Vizier Abbas in formal Arabic', descriptionArabic: 'قَدِّم نَفسَكَ لِلوَزير عَبّاس بِالفُصحى', type: 'talk' },
      { id: 'main_9_obj_3', description: 'Learn 4 formal phrases', descriptionArabic: 'تَعَلَّم أَربَع عِبارات رَسمِيَّة', type: 'learn' },
    ],
    dialogueIntro: {
      arabic: 'مَن أَنتَ؟ القَصر لَيسَ لِلعامَّة. أَثبِت أَنَّكَ تَستَحِقّ الدُّخول',
      english: 'Who are you? The palace is not for commoners. Prove that you deserve entry.',
    },
    dialogueComplete: {
      arabic: 'أُسلوبُكَ مُحتَرَم. القَصر يُرَحِّبُ بِكَ. الأَميرَة عائِشَة تُريدُ مُقابَلَتَك',
      english: 'Your manner is respectful. The palace welcomes you. Princess Aisha wishes to meet you.',
    },
    reward: { xp: 275, dirhams: 70, item: 'palace_visitor_seal' },
    prerequisites: ['main_8'],
    learningObjective: 'Formal introductions and polite phrases',
    vocabularyIntroduced: ['what_is_your_name_1', 'my_name_is_1', 'please_1', 'excuse_me_1'],
  },

  {
    id: 'main_10',
    chapter: 3,
    title: 'The Princess\'s Request',
    titleArabic: 'طَلَب الأَميرَة',
    description: 'Princess Aisha is fascinated by your journey. She reveals that the manuscript page is part of a larger text about the founding of the kingdom. She asks you to learn family words to understand its genealogies.',
    zone: 'royal-palace',
    npcGiver: 'princess-aisha',
    objectives: [
      { id: 'main_10_obj_1', description: 'Meet Princess Aisha in the palace garden', descriptionArabic: 'قابِل الأَميرَة عائِشَة في حَديقَة القَصر', type: 'talk' },
      { id: 'main_10_obj_2', description: 'Learn 5 family vocabulary words', descriptionArabic: 'تَعَلَّم خَمس كَلِمات عَن العائِلَة', type: 'learn' },
      { id: 'main_10_obj_3', description: 'Read the genealogy passage from the manuscript', descriptionArabic: 'اِقرَأ فَقرَة الأَنساب مِن المَخطوطَة', type: 'learn' },
    ],
    dialogueIntro: {
      arabic: 'أَهلاً! سَمِعتُ عَن رِحلَتِك. هَذِهِ المَخطوطَة تَحكي عَن عائِلات قَديمَة. تَعال نَقرَأها مَعًا',
      english: 'Hello! I heard about your journey. This manuscript tells of ancient families. Come, let us read it together.',
    },
    dialogueComplete: {
      arabic: 'أَنتَ تَقرَأ بِشَكل رائِع! المَخطوطَة تَذكُر جَبَلاً — رُبَّما هُناك المَزيد',
      english: 'You read wonderfully! The manuscript mentions a mountain — perhaps there is more there.',
    },
    reward: { xp: 300, dirhams: 60, item: null },
    prerequisites: ['main_9'],
    learningObjective: 'Family vocabulary and reading genealogies',
    vocabularyIntroduced: ['family_father', 'family_mother', 'family_brother', 'family_sister', 'family_son'],
  },

  {
    id: 'main_11',
    chapter: 3,
    title: 'The Mountain\'s Wisdom',
    titleArabic: 'حِكمَة الجَبَل',
    description: 'The manuscript mentions inscriptions on the Mountain Pass. Mountain Hermit Idris may be the only person alive who can read them. But he does not welcome visitors easily.',
    zone: 'mountain-pass',
    npcGiver: 'mountain-hermit-idris',
    objectives: [
      { id: 'main_11_obj_1', description: 'Climb to Mountain Hermit Idris\'s cave', descriptionArabic: 'اِصعَد إِلى مَغارَة ناسِك الجَبَل إِدريس', type: 'explore' },
      { id: 'main_11_obj_2', description: 'Prove your knowledge by answering 3 riddles in Arabic', descriptionArabic: 'أَثبِت عِلمَك بِالإِجابَة عَلى ثلاث أَلغاز بِالعَرَبِيَّة', type: 'battle' },
      { id: 'main_11_obj_3', description: 'Learn 4 nature vocabulary words', descriptionArabic: 'تَعَلَّم أَربَع كَلِمات عَن الطَّبيعَة', type: 'learn' },
    ],
    dialogueIntro: {
      arabic: 'الجَبَل ما بِيحِبّ الضَّوضا. إِذا بِدَّك تِسمَع حِكمَتَه، أَجِب عَن أَسئِلتي',
      english: 'The mountain does not like noise. If you want to hear its wisdom, answer my questions.',
    },
    dialogueComplete: {
      arabic: 'أَنتَ تَسمَع الجَبَل. هَذا نادِر. تَعال — في النُّقوش عَلى الصُّخور أَسرار كَبيرَة',
      english: 'You listen to the mountain. That is rare. Come — the inscriptions on the rocks hold great secrets.',
    },
    reward: { xp: 325, dirhams: 65, item: null },
    prerequisites: ['main_10'],
    learningObjective: 'Nature vocabulary and philosophical expressions',
    vocabularyIntroduced: ['mountain_w21', 'river_w24', 'wind_w26', 'tree_w27'],
  },

  {
    id: 'main_12',
    chapter: 3,
    title: 'The Ancient Inscription',
    titleArabic: 'النَّقش القَديم',
    description: 'Idris deciphers the mountain inscription. It reveals that the manuscript\'s final pages were carried by ship to a distant coast. Your journey must continue to the sea.',
    zone: 'mountain-pass',
    npcGiver: 'mountain-hermit-idris',
    objectives: [
      { id: 'main_12_obj_1', description: 'Study the mountain inscription with Idris', descriptionArabic: 'اُدرُس النَّقش الجَبَلي مَع إِدريس', type: 'learn' },
      { id: 'main_12_obj_2', description: 'Learn 3 nature words from the inscription', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات طَبيعَة مِن النَّقش', type: 'learn' },
      { id: 'main_12_obj_3', description: 'Receive Idris\'s letter of introduction for the coast', descriptionArabic: 'خُذ رِسالَة تَعريف مِن إِدريس لِلسّاحِل', type: 'collect' },
    ],
    dialogueIntro: {
      arabic: 'هَذا النَّقش يَتَكَلَّم عَن بَحر وَسَفينَة. الصَّفَحات الأَخيرَة ذَهَبَت مَع المَوج',
      english: 'This inscription speaks of a sea and a ship. The final pages went with the waves.',
    },
    dialogueComplete: {
      arabic: 'خُذ رِسالَتي لِلقُبطان رَشيد. هُوَ يَعرِف البَحر كَما أَعرِف الجَبَل',
      english: 'Take my letter to Captain Rashid. He knows the sea as I know the mountain.',
    },
    reward: { xp: 325, dirhams: 70, item: 'hermits_letter' },
    prerequisites: ['main_11'],
    learningObjective: 'Nature vocabulary and reading ancient text',
    vocabularyIntroduced: ['sea_w23', 'sand_w17', 'desert_w18'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4 — THE VOYAGE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'main_13',
    chapter: 4,
    title: 'The Captain\'s Bargain',
    titleArabic: 'صَفقَة القُبطان',
    description: 'Captain Rashid reads Idris\'s letter and agrees to help — but his ship needs repairs. You must help at the docks and learn the language of the sea.',
    zone: 'coastal-port',
    npcGiver: 'captain-rashid',
    objectives: [
      { id: 'main_13_obj_1', description: 'Deliver Idris\'s letter to Captain Rashid', descriptionArabic: 'سَلِّم رِسالَة إِدريس لِلقُبطان رَشيد', type: 'talk' },
      { id: 'main_13_obj_2', description: 'Help Dockmaster Nadia organize port supplies', descriptionArabic: 'ساعِد رَئيسَة المِيناء نادِيَة في تَنظيم اللَّوازِم', type: 'collect' },
      { id: 'main_13_obj_3', description: 'Learn 4 direction and navigation words', descriptionArabic: 'تَعَلَّم أَربَع كَلِمات اِتِّجاه وَمِلاحَة', type: 'learn' },
    ],
    dialogueIntro: {
      arabic: 'رِسالَة مِن إِدريس؟ هذا الرَّجُل لا يَكتُب لِأَحَد! سَأُساعِدَك — بَسّ أَوَّل ساعِد في المِيناء',
      english: 'A letter from Idris? That man writes to no one! I will help you — but first help at the port.',
    },
    dialogueComplete: {
      arabic: 'شُغل مُمتاز! السَّفينَة جاهِزَة. غَدًا نُبحِر مَع الفَجر',
      english: 'Excellent work! The ship is ready. Tomorrow we sail at dawn.',
    },
    reward: { xp: 300, dirhams: 85, item: null },
    prerequisites: ['main_12'],
    learningObjective: 'Navigation vocabulary and port terminology',
    vocabularyIntroduced: ['right_1', 'left_1', 'above_1', 'below_1'],
  },

  {
    id: 'main_14',
    chapter: 4,
    title: 'Across the Waves',
    titleArabic: 'عَبرَ المَوج',
    description: 'The sea voyage tests everything you have learned. Captain Rashid teaches you to navigate by the stars, and you must use your Arabic to survive a sudden storm.',
    zone: 'coastal-port',
    npcGiver: 'captain-rashid',
    objectives: [
      { id: 'main_14_obj_1', description: 'Board Captain Rashid\'s ship', descriptionArabic: 'اِركَب سَفينَة القُبطان رَشيد', type: 'explore' },
      { id: 'main_14_obj_2', description: 'Learn star and sky vocabulary for navigation', descriptionArabic: 'تَعَلَّم كَلِمات النُّجوم وَالسَّماء لِلمِلاحَة', type: 'learn' },
      { id: 'main_14_obj_3', description: 'Give correct Arabic commands during the storm', descriptionArabic: 'أَعطِ أَوامِر صَحيحَة بِالعَرَبِيَّة أَثناء العاصِفَة', type: 'battle' },
    ],
    dialogueIntro: {
      arabic: 'البَحر مُعَلِّم قاسي. بَسّ إِذا تَعَلَّمت لُغَتَه — بِينجيك',
      english: 'The sea is a harsh teacher. But if you learn its language — it will save you.',
    },
    dialogueComplete: {
      arabic: 'نَجَونا! أَنتَ بَحّار حَقيقي الآن. شوف — الواحَة المَخفِيَّة عَلى الأُفُق',
      english: 'We survived! You are a true sailor now. Look — the Hidden Oasis is on the horizon.',
    },
    reward: { xp: 350, dirhams: 90, item: 'captains_star_chart' },
    prerequisites: ['main_13'],
    learningObjective: 'Sky and weather vocabulary, command phrases',
    vocabularyIntroduced: ['star_w16', 'moon_w15', 'sky_w22', 'sun_w14'],
  },

  {
    id: 'main_15',
    chapter: 4,
    title: 'The Hidden Garden',
    titleArabic: 'الحَديقَة المَخفِيَّة',
    description: 'The Hidden Oasis holds the final pages of the manuscript — and secrets about the very language you have been learning. Herbalist Maryam guards this sacred place.',
    zone: 'hidden-oasis',
    npcGiver: 'herbalist-maryam',
    objectives: [
      { id: 'main_15_obj_1', description: 'Arrive at the Hidden Oasis', descriptionArabic: 'اِوصِل لِلواحَة المَخفِيَّة', type: 'explore' },
      { id: 'main_15_obj_2', description: 'Speak with Herbalist Maryam about the manuscript', descriptionArabic: 'تَكَلَّم مَع العشّابَة مَريَم عَن المَخطوطَة', type: 'talk' },
      { id: 'main_15_obj_3', description: 'Learn 4 body and health vocabulary words', descriptionArabic: 'تَعَلَّم أَربَع كَلِمات عَن الجِسم وَالصِّحَّة', type: 'learn' },
      { id: 'main_15_obj_4', description: 'Find the final manuscript pages in the garden', descriptionArabic: 'اِعثُر عَلى الصَّفَحات الأَخيرَة في الحَديقَة', type: 'collect' },
    ],
    dialogueIntro: {
      arabic: 'أَنتَ وَصَلت لِلواحَة المَخفِيَّة! قَليلون يَصِلون هُنا. المَخطوطَة تَنتَظِرَك',
      english: 'You have reached the Hidden Oasis! Few arrive here. The manuscript awaits you.',
    },
    dialogueComplete: {
      arabic: 'وَجَدتَ الصَّفَحات! بَسّ اِنتَبِه — المَخطوطَة تِقول إِنّ القِصَّة لِسّا ما خَلَصَت',
      english: 'You found the pages! But beware — the manuscript says the story is not yet finished.',
    },
    reward: { xp: 375, dirhams: 100, item: 'final_manuscript_pages' },
    prerequisites: ['main_14'],
    learningObjective: 'Body parts, health vocabulary, and reading comprehension',
    vocabularyIntroduced: ['head_1', 'hand_1', 'eye_1', 'heart_1'],
  },

  {
    id: 'main_16',
    chapter: 4,
    title: 'The Manuscript Complete',
    titleArabic: 'المَخطوطَة الكامِلَة',
    description: 'With all pages assembled, the manuscript reveals its true message: the language itself is the treasure. You must return to all your teachers to unlock its final secret.',
    zone: 'hidden-oasis',
    npcGiver: 'herbalist-maryam',
    objectives: [
      { id: 'main_16_obj_1', description: 'Assemble all manuscript pages', descriptionArabic: 'اِجمَع كُلّ صَفَحات المَخطوطَة', type: 'collect' },
      { id: 'main_16_obj_2', description: 'Read the complete manuscript aloud in Arabic', descriptionArabic: 'اِقرَأ المَخطوطَة الكامِلَة بِصَوت عالٍ بِالعَرَبِيَّة', type: 'learn' },
      { id: 'main_16_obj_3', description: 'Learn 3 wisdom vocabulary words from the text', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات حِكمَة مِن النَّص', type: 'learn' },
    ],
    dialogueIntro: {
      arabic: 'الآن عِندَك كُلّ الصَّفَحات. اِقرَأ — المَخطوطَة لَها رِسالَة أَخيرَة',
      english: 'Now you have all the pages. Read — the manuscript has a final message.',
    },
    dialogueComplete: {
      arabic: 'المَخطوطَة تَقول: اللُّغَة هِيَ الكَنز. بَسّ الكَنز الحَقيقي في مَن تَعَلَّمتَ مِنهُم',
      english: 'The manuscript says: the language is the treasure. But the true treasure is in those you learned from.',
    },
    reward: { xp: 400, dirhams: 100, item: 'complete_manuscript' },
    prerequisites: ['main_15'],
    learningObjective: 'Reading comprehension and wisdom vocabulary',
    vocabularyIntroduced: ['know_1', 'understand_1', 'learn_1'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5 — THE SCHOLAR
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'main_17',
    chapter: 5,
    title: 'The Return',
    titleArabic: 'العَودَة',
    description: 'The manuscript instructs you to return to each zone and collect a "word of power" from each teacher. Begin by returning to Scholar Yusuf with your completed manuscript.',
    zone: 'oasis-village',
    npcGiver: 'scholar-yusuf',
    objectives: [
      { id: 'main_17_obj_1', description: 'Return to Scholar Yusuf with the completed manuscript', descriptionArabic: 'اِرجِع لِلشَّيخ يوسف مَع المَخطوطَة الكامِلَة', type: 'talk' },
      { id: 'main_17_obj_2', description: 'Pass Scholar Yusuf\'s advanced grammar challenge', descriptionArabic: 'اِنجَح في تَحَدّي النَّحو المُتَقَدِّم', type: 'battle' },
      { id: 'main_17_obj_3', description: 'Receive Yusuf\'s word of power', descriptionArabic: 'خُذ كَلِمَة القُوَّة مِن يوسف', type: 'collect' },
    ],
    dialogueIntro: {
      arabic: 'عُدتَ! وَمَعَكَ المَخطوطَة الكامِلَة! الآن أَنتَ مُستَعِدّ لِلاِمتِحان الأَخير',
      english: 'You have returned! And with the complete manuscript! Now you are ready for the final test.',
    },
    dialogueComplete: {
      arabic: 'نَجَحتَ في كُلّ شَيء. كَلِمَة القُوَّة هِيَ: حِكمَة — الحِكمَة العَميقَة',
      english: 'You passed everything. The word of power is: hikma — deep wisdom.',
    },
    reward: { xp: 400, dirhams: 80, item: 'word_of_power_hikma' },
    prerequisites: ['main_16'],
    learningObjective: 'Advanced grammar review and the concept of hikma (wisdom)',
    vocabularyIntroduced: ['read_1', 'write_1', 'speak_1'],
  },

  {
    id: 'main_18',
    chapter: 5,
    title: 'Gathering the Words',
    titleArabic: 'جَمع الكَلِمات',
    description: 'Travel to the marketplace, the palace, and the port to collect words of power from Merchant Fatima, Vizier Abbas, and Captain Rashid.',
    zone: 'desert-marketplace',
    npcGiver: 'merchant-fatima',
    objectives: [
      { id: 'main_18_obj_1', description: 'Collect Fatima\'s word of power through a trade challenge', descriptionArabic: 'اِجمَع كَلِمَة فاطِمَة مِن خِلال تَحَدّي تِجاري', type: 'battle' },
      { id: 'main_18_obj_2', description: 'Collect Abbas\'s word of power through a diplomacy test', descriptionArabic: 'اِجمَع كَلِمَة عَبّاس مِن خِلال اِمتِحان دِبلوماسي', type: 'battle' },
      { id: 'main_18_obj_3', description: 'Collect Rashid\'s word of power through a navigation challenge', descriptionArabic: 'اِجمَع كَلِمَة رَشيد مِن خِلال تَحَدّي مِلاحَة', type: 'battle' },
    ],
    dialogueIntro: {
      arabic: 'بِدَّك كَلِمَة القُوَّة؟ أَوَّل لازِم تِثبِت إِنَّك تاجِر حَقيقي',
      english: 'You want the word of power? First you must prove you are a true trader.',
    },
    dialogueComplete: {
      arabic: 'عِندَك أَربَع كَلِمات قُوَّة الآن. بَقي وَحدَة أَخيرَة — في الجَبَل',
      english: 'You have four words of power now. One final one remains — on the mountain.',
    },
    reward: { xp: 450, dirhams: 100, item: 'word_of_power_bundle' },
    prerequisites: ['main_17'],
    learningObjective: 'Comprehensive vocabulary review across trading, diplomacy, and navigation',
    vocabularyIntroduced: ['buy_w34', 'sell_w35', 'go_1', 'come_1'],
  },

  {
    id: 'main_19',
    chapter: 5,
    title: 'The Final Word',
    titleArabic: 'الكَلِمَة الأَخيرَة',
    description: 'Mountain Hermit Idris holds the fifth and final word of power. But to receive it, you must answer the hardest question in Arabic — a question with no wrong answer.',
    zone: 'mountain-pass',
    npcGiver: 'mountain-hermit-idris',
    objectives: [
      { id: 'main_19_obj_1', description: 'Climb to Idris\'s cave one final time', descriptionArabic: 'اِصعَد لِمَغارَة إِدريس لِلمَرَّة الأَخيرَة', type: 'explore' },
      { id: 'main_19_obj_2', description: 'Answer Idris\'s philosophical question in Arabic', descriptionArabic: 'أَجِب عَلى سُؤال إِدريس الفَلسَفي بِالعَرَبِيَّة', type: 'talk' },
      { id: 'main_19_obj_3', description: 'Receive the final word of power', descriptionArabic: 'خُذ كَلِمَة القُوَّة الأَخيرَة', type: 'collect' },
    ],
    dialogueIntro: {
      arabic: 'عُدتَ يا بُنَيّ. أَسمَعُ أَنَّكَ جَمَعتَ أَربَع كَلِمات. سُؤالي الأَخير: لِماذا تَتَعَلَّم؟',
      english: 'You have returned, my child. I hear you have gathered four words. My final question: why do you learn?',
    },
    dialogueComplete: {
      arabic: 'لا يوجَد جَواب خاطِئ. الكَلِمَة الأَخيرَة هِيَ: رِحلَة. لِأَنَّ التَّعَلُّم رِحلَة لا تَنتَهي',
      english: 'There is no wrong answer. The final word is: rihla (journey). Because learning is a journey that never ends.',
    },
    reward: { xp: 475, dirhams: 100, item: 'word_of_power_rihla' },
    prerequisites: ['main_18'],
    learningObjective: 'Philosophical Arabic and the concept of lifelong learning',
    vocabularyIntroduced: ['walk_1', 'see_1', 'hear_1'],
  },

  {
    id: 'main_20',
    chapter: 5,
    title: 'The Language is the Treasure',
    titleArabic: 'اللُّغَة هِيَ الكَنز',
    description: 'With all five words of power, you return to the Oasis Village for a grand ceremony. All your teachers gather to celebrate your journey — and to reveal one final surprise.',
    zone: 'oasis-village',
    npcGiver: 'guide-amira',
    objectives: [
      { id: 'main_20_obj_1', description: 'Return to the Oasis Village with all 5 words of power', descriptionArabic: 'اِرجِع لِلقَريَة مَع كُلّ كَلِمات القُوَّة الخَمس', type: 'collect' },
      { id: 'main_20_obj_2', description: 'Speak the five words of power at the ceremony', descriptionArabic: 'اُنطُق كَلِمات القُوَّة الخَمس في الحَفل', type: 'talk' },
      { id: 'main_20_obj_3', description: 'Receive the title of Scholar from Guide Amira', descriptionArabic: 'اِستَلِم لَقَب عالِم مِن المُرشِدَة أَميرَة', type: 'talk' },
    ],
    dialogueIntro: {
      arabic: 'أَنتَ وَصَلت! كُلّ مُعَلِّميك هُنا. يَلّا — قُل كَلِمات القُوَّة وَخَلّي الاِحتِفال يَبدَأ',
      english: 'You have arrived! All your teachers are here. Come — speak the words of power and let the celebration begin.',
    },
    dialogueComplete: {
      arabic: 'مَبروك يا عالِم! أَنتَ الآن جُزء مِن هَذِهِ الأَرض. اللُّغَة العَرَبِيَّة بَيتَك — وَنَحنُ عائِلَتَك',
      english: 'Congratulations, scholar! You are now part of this land. The Arabic language is your home — and we are your family.',
    },
    reward: { xp: 500, dirhams: 200, item: 'scholars_crown' },
    prerequisites: ['main_19'],
    learningObjective: 'Celebration of all learned vocabulary, the joy of language mastery',
    vocabularyIntroduced: ['congratulations_1', 'happy_1', 'beautiful_1'],
  },

]);

/** Total number of main quests */
export const MAIN_QUEST_COUNT = MAIN_QUESTLINE.length;

/** Get quests for a specific chapter */
export function getQuestsByChapter(chapter) {
  return MAIN_QUESTLINE.filter((q) => q.chapter === chapter);
}

/** Get a quest by its ID */
export function getMainQuestById(id) {
  return MAIN_QUESTLINE.find((q) => q.id === id) || null;
}

/** Get all vocabulary words introduced across the entire main questline */
export function getAllMainQuestVocabulary() {
  return MAIN_QUESTLINE.flatMap((q) => q.vocabularyIntroduced);
}

/** Validate that all prerequisite chains are valid (no circular dependencies) */
export function validatePrerequisiteChain() {
  const ids = new Set(MAIN_QUESTLINE.map((q) => q.id));
  for (const quest of MAIN_QUESTLINE) {
    for (const prereq of quest.prerequisites) {
      if (!ids.has(prereq)) return false;
    }
  }
  return true;
}
