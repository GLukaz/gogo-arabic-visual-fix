/**
 * bossEncounters.js — Zone boss encounters for Linguistic Arts Combat (Phase 96)
 *
 * 8 master linguists (1 per zone) with special battle mechanics testing
 * specific Arabic skills. ALL bosses are human scholars, merchants,
 * and community leaders — NO beasts, monsters, or supernatural creatures.
 */

// Valid special mechanic types
export const BOSS_MECHANIC_TYPES = [
  'proverb_recognition',
  'trade_negotiation',
  'conjugation_challenge',
  'poetry_duel',
  'formal_address_challenge',
  'seasonal_knowledge_quiz',
  'navigation_challenge',
  'philosophical_debate',
];

// Valid attack pattern types
export const ATTACK_PATTERN_TYPES = [
  'ar-to-en',
  'en-to-ar',
  'en-to-type-ar',
  'listen',
  'grammar_quiz',
  'idiom_quiz',
  'proverb_quiz',
  'negotiation_quiz',
  'conjugation_quiz',
  'poetry_quiz',
  'formal_quiz',
  'context_quiz',
  'navigation_quiz',
  'philosophy_quiz',
];

const bossEncounters = [
  // ──────────────────────────────────────────────────
  // 1. Oasis Village Boss
  // ──────────────────────────────────────────────────
  {
    id: 'oasis_elder_amira',
    name: 'Oasis Elder Amira',
    nameArabic: 'أميرة حكيمة الواحة',
    zone: 'oasis_village',
    level: 12,
    baseHP: 140,
    baseDamage: 14,
    baseDefense: 12,
    title: 'Keeper of Desert Wisdom',
    titleArabic: 'حارسة حكمة الصحراء',
    lore: 'The eldest voice in the oasis village, Amira has lived through droughts and floods. Her proverbs carry the weight of generations. She challenges travelers to prove their understanding of Arabic wisdom before granting passage beyond the village.',
    loreArabic: 'أكبر صوت في قرية الواحة، عاشت أميرة الجفاف والفيضانات. أمثالها تحمل ثقل الأجيال. تتحدى المسافرين لإثبات فهمهم للحكمة العربية قبل السماح لهم بالمرور.',
    specialMechanic: {
      type: 'proverb_recognition',
      description: 'During the boss battle, Amira presents Arabic proverbs. The player must identify the correct meaning or complete the proverb to gain a damage bonus.',
      mechanic: 'After each player attack, a proverb question appears. Correct answer = 1.5x damage bonus next turn. Wrong = no bonus and Amira heals 10 HP.',
    },
    attackPattern: ['ar-to-en', 'en-to-ar', 'idiom_quiz', 'proverb_quiz'],
    attackFrequency: 2,
    dialogue: {
      intro: 'Welcome, young traveler. I am Amira, keeper of our village wisdom. Before you leave this oasis, you must prove you understand our proverbs.',
      introArabic: 'أهلا بك أيها المسافر الشاب. أنا أميرة، حارسة حكمة قريتنا. قبل أن تغادر هذه الواحة، عليك أن تثبت فهمك لأمثالنا.',
      onPlayerHit: 'Well spoken! You know the wisdom of the desert.',
      onPlayerHitArabic: 'أحسنت! أنت تعرف حكمة الصحراء.',
      onPlayerMiss: 'That is not what the proverb means, child. Listen again.',
      onPlayerMissArabic: 'هذا ليس معنى المثل يا بني. استمع مرة أخرى.',
      halfHealth: 'You surprise me! Perhaps there is wisdom in you after all.',
      halfHealthArabic: 'أنت تفاجئني! ربما هناك حكمة فيك بعد كل شيء.',
      defeat: 'The desert has given us a worthy traveler. Go forth with the wisdom of the oasis.',
      defeatArabic: 'الصحراء أعطتنا مسافرا جديرا. امضِ مع حكمة الواحة.',
      victory: 'Return when the desert has taught you patience and wisdom.',
      victoryArabic: 'عد عندما تعلمك الصحراء الصبر والحكمة.',
    },
    rewards: {
      xp: 800,
      dirhams: 350,
      achievementId: 'oasis_wisdom_keeper_defeated',
      skillReward: 'proverb_mastery_unlock',
      vocabularyUnlocked: ['حكمة', 'مثل', 'واحة', 'صحراء', 'صبر'],
      rareItem: 'scroll_of_desert_proverbs',
    },
    winCondition: 'Defeat boss HP',
  },

  // ──────────────────────────────────────────────────
  // 2. Desert Marketplace Boss
  // ──────────────────────────────────────────────────
  {
    id: 'merchant_king_abdullah',
    name: 'Spice Merchant King Abdullah',
    nameArabic: 'عبدالله ملك تجار التوابل',
    zone: 'desert_marketplace',
    level: 14,
    baseHP: 160,
    baseDamage: 16,
    baseDefense: 13,
    title: 'Master of the Grand Bazaar',
    titleArabic: 'سيد البازار الكبير',
    lore: 'Abdullah has dominated the desert marketplace for thirty years. He knows the price of every spice, fabric, and gem in the known world. His trade negotiations are legendary — he has never lost a deal. To earn his respect, one must out-negotiate him in Arabic.',
    loreArabic: 'هيمن عبدالله على سوق الصحراء لثلاثين عاما. يعرف ثمن كل توبل وقماش وجوهرة في العالم. مفاوضاته التجارية أسطورية — لم يخسر صفقة قط. لكسب احترامه، يجب أن تتفوق عليه في التفاوض بالعربية.',
    specialMechanic: {
      type: 'trade_negotiation',
      description: 'Abdullah presents trade vocabulary challenges. The player must correctly name items, prices, and negotiate in Arabic to deal bonus damage.',
      mechanic: 'Every 3 turns, a negotiation mini-round begins. Player must translate trade terms correctly. Each correct answer = 10 bonus damage. Three correct = full bonus round (double damage for 2 turns).',
    },
    attackPattern: ['ar-to-en', 'en-to-ar', 'negotiation_quiz', 'en-to-type-ar'],
    attackFrequency: 2,
    dialogue: {
      intro: 'So you think you can trade in my marketplace? I am Abdullah, king of merchants! Show me your bargaining tongue!',
      introArabic: 'تظن أنك تستطيع التجارة في سوقي؟ أنا عبدالله، ملك التجار! أرني لسانك في المساومة!',
      onPlayerHit: 'A fair price! You know the value of words!',
      onPlayerHitArabic: 'سعر عادل! أنت تعرف قيمة الكلمات!',
      onPlayerMiss: 'That price is robbery! No deal!',
      onPlayerMissArabic: 'هذا السعر سرقة! لا صفقة!',
      halfHealth: 'You drive a hard bargain! Perhaps you are worthy of my finest goods.',
      halfHealthArabic: 'أنت مفاوض عنيد! ربما تستحق أفضل بضائعي.',
      defeat: 'You are the first to out-trade me in thirty years! Take these rare spices as your prize.',
      defeatArabic: 'أنت أول من يتفوق عليّ في التجارة منذ ثلاثين سنة! خذ هذه التوابل النادرة كجائزتك.',
      victory: 'Come back when you know the difference between saffron and turmeric in Arabic!',
      victoryArabic: 'عد عندما تعرف الفرق بين الزعفران والكركم بالعربية!',
    },
    rewards: {
      xp: 1000,
      dirhams: 500,
      achievementId: 'merchant_king_defeated',
      skillReward: 'trade_vocabulary_mastery',
      vocabularyUnlocked: ['تجارة', 'سوق', 'ثمن', 'بضاعة', 'صفقة'],
      rareItem: 'golden_merchant_scale',
    },
    winCondition: 'Defeat boss HP',
  },

  // ──────────────────────────────────────────────────
  // 3. Ancient Library Boss
  // ──────────────────────────────────────────────────
  {
    id: 'grammar_master_library',
    name: 'The Grammar Master',
    nameArabic: 'معلم القواعد',
    zone: 'ancient_library',
    level: 20,
    baseHP: 180,
    baseDamage: 22,
    baseDefense: 15,
    title: 'Master of Classical Grammar',
    titleArabic: 'أستاذ النحو الكلاسيكي',
    lore: 'The keeper of grammatical law, who corrects every misspoken word. He has spent fifty years cataloging the rules of Arabic grammar and will not allow a single error to pass unchallenged. His students are the finest grammarians in the land.',
    loreArabic: 'حارس قوانين النحو، الذي يصحح كل كلمة تُنطق بشكل خاطئ. قضى خمسين عاما في تصنيف قواعد النحو العربي ولن يسمح بمرور خطأ واحد دون تصحيح.',
    specialMechanic: {
      type: 'conjugation_challenge',
      description: 'During boss battle, player must correctly conjugate verbs mid-battle to maintain damage multiplier.',
      mechanic: 'After each player attack, player is asked a conjugation question. Correct = 1.5x damage bonus next turn. Wrong = defense penalty next turn.',
    },
    attackPattern: ['ar-to-en', 'en-to-ar', 'en-to-type-ar', 'grammar_quiz', 'conjugation_quiz'],
    attackFrequency: 2,
    dialogue: {
      intro: 'Welcome to my domain of grammar. I am the Master, guardian of Arabic\'s rules. Can you prove your conjugations flawless?',
      introArabic: 'أهلا بك في عالم القواعد. أنا المعلم، حارس قوانين العربية. هل يمكنك إثبات أن تصريفاتك خالية من الأخطاء؟',
      onPlayerHit: 'Impressive conjugation! But wait... can you handle the next challenge?',
      onPlayerHitArabic: 'تصريف رائع! لكن انتظر... هل يمكنك التعامل مع التحدي القادم؟',
      onPlayerMiss: 'Wrong! You have confused the grammar rules.',
      onPlayerMissArabic: 'خطأ! لقد خلطت قواعد النحو.',
      halfHealth: 'You are learning... but true mastery requires more discipline.',
      halfHealthArabic: 'أنت تتعلم... لكن الإتقان الحقيقي يتطلب المزيد من الانضباط.',
      defeat: 'At last! A student worthy of the Arabic language. Go forth and teach others.',
      defeatArabic: 'أخيرا! طالب يستحق اللغة العربية. تابع وعلّم الآخرين.',
      victory: 'Return when you have truly mastered conjugation. Practice the verb forms daily.',
      victoryArabic: 'عد عندما تتقن التصريف حقا. مارس أشكال الأفعال يوميا.',
    },
    rewards: {
      xp: 1500,
      dirhams: 600,
      achievementId: 'grammar_master_defeated',
      skillReward: 'conjugation_mastery_unlock',
      vocabularyUnlocked: ['قاعدة', 'نحو', 'صرف', 'فعل', 'اسم'],
      rareItem: 'manuscript_of_grammar',
    },
    winCondition: 'Defeat boss HP',
  },

  // ──────────────────────────────────────────────────
  // 4. Bedouin Camp Boss
  // ──────────────────────────────────────────────────
  {
    id: 'desert_wind_speaker',
    name: 'Desert Wind Speaker',
    nameArabic: 'متحدث ريح الصحراء',
    zone: 'bedouin_camp',
    level: 18,
    baseHP: 170,
    baseDamage: 20,
    baseDefense: 14,
    title: 'Poet Warrior of the Desert Tribes',
    titleArabic: 'شاعر محارب القبائل الصحراوية',
    lore: 'A legendary poet-warrior whose verses are as sharp as swords. In Bedouin tradition, poetry is the highest art. The Desert Wind Speaker challenges all who enter the camp to a poetry duel — and none have bested him in rhyme or meter.',
    loreArabic: 'شاعر محارب أسطوري أبياته حادة كالسيوف. في التقاليد البدوية، الشعر هو أعلى الفنون. يتحدى متحدث ريح الصحراء كل من يدخل المخيم في مبارزة شعرية — ولم يتفوق عليه أحد في القافية أو الوزن.',
    specialMechanic: {
      type: 'poetry_duel',
      description: 'The boss presents poetic lines and the player must choose the correct rhyming response or identify the meter.',
      mechanic: 'Every 2 turns, a poetry challenge appears. Player must complete a poetic line with the correct rhyming word. Correct = 1.5x damage. Three correct in a row = "Poetic Mastery" bonus (triple damage for 1 turn).',
    },
    attackPattern: ['ar-to-en', 'en-to-ar', 'poetry_quiz', 'listen'],
    attackFrequency: 2,
    dialogue: {
      intro: 'I am the voice of the desert wind! My poems shake the dunes! Do you dare challenge me in verse?',
      introArabic: 'أنا صوت ريح الصحراء! قصائدي تهز الكثبان! هل تجرؤ على تحديي في الشعر؟',
      onPlayerHit: 'Beautiful verse! The desert wind carries your words!',
      onPlayerHitArabic: 'بيت جميل! ريح الصحراء تحمل كلماتك!',
      onPlayerMiss: 'That does not rhyme! Even the camels wince at your poetry!',
      onPlayerMissArabic: 'هذا لا يقافي! حتى الإبل تتأذى من شعرك!',
      halfHealth: 'Your poetry grows stronger! The wind listens to you now.',
      halfHealthArabic: 'شعرك يزداد قوة! الريح تستمع إليك الآن.',
      defeat: 'A new poet has risen! The desert wind now speaks your name.',
      defeatArabic: 'شاعر جديد قام! ريح الصحراء تنطق اسمك الآن.',
      victory: 'Your verses need more soul. Sit by the campfire and listen to the elders.',
      victoryArabic: 'أبياتك تحتاج إلى مزيد من الروح. اجلس عند نار المخيم واستمع للشيوخ.',
    },
    rewards: {
      xp: 1300,
      dirhams: 550,
      achievementId: 'desert_poet_defeated',
      skillReward: 'poetry_composition_unlock',
      vocabularyUnlocked: ['شعر', 'قصيدة', 'قافية', 'وزن', 'بيت'],
      rareItem: 'quill_of_the_desert_poet',
    },
    winCondition: 'Defeat boss HP',
  },

  // ──────────────────────────────────────────────────
  // 5. Royal Palace Boss
  // ──────────────────────────────────────────────────
  {
    id: 'court_scholar_inquisitor',
    name: 'Court Scholar Inquisitor',
    nameArabic: 'محقق علماء البلاط',
    zone: 'royal_palace',
    level: 22,
    baseHP: 190,
    baseDamage: 24,
    baseDefense: 18,
    title: 'Master of Formal Arabic',
    titleArabic: 'سيد العربية الفصحى',
    lore: 'The most feared examiner in the royal court. No scholar enters the palace without passing his test of formal Arabic. He demands perfection in honorifics, formal address, and bureaucratic language. Many have tried; few have passed.',
    loreArabic: 'أكثر ممتحن مرهوب في البلاط الملكي. لا يدخل عالم القصر دون اجتياز اختباره في العربية الفصحى. يطالب بالكمال في الألقاب والخطاب الرسمي واللغة البيروقراطية.',
    specialMechanic: {
      type: 'formal_address_challenge',
      description: 'The boss tests the player on correct formal pronouns, honorifics, and courtly language.',
      mechanic: 'Every 2 turns, the boss presents a formal speech situation. Player must choose the correct formal form of address. Correct = damage boost. Wrong = boss counterattacks with double damage.',
    },
    attackPattern: ['ar-to-en', 'en-to-ar', 'formal_quiz', 'en-to-type-ar', 'grammar_quiz'],
    attackFrequency: 2,
    dialogue: {
      intro: 'You wish to address the court? I am the Inquisitor. Every word you speak must be in the most formal Arabic. Begin!',
      introArabic: 'تريد مخاطبة البلاط؟ أنا المحقق. كل كلمة تنطقها يجب أن تكون بأفصح العربية. ابدأ!',
      onPlayerHit: 'Acceptable formality. The court acknowledges your words.',
      onPlayerHitArabic: 'رسمية مقبولة. البلاط يعترف بكلماتك.',
      onPlayerMiss: 'Unacceptable! That language is not fit for the palace!',
      onPlayerMissArabic: 'غير مقبول! هذه اللغة لا تليق بالقصر!',
      halfHealth: 'You show promise. Perhaps you are worthy of the court after all.',
      halfHealthArabic: 'أنت تظهر وعدا. ربما تستحق البلاط بعد كل شيء.',
      defeat: 'Extraordinary! You have mastered formal Arabic. The palace doors are open to you.',
      defeatArabic: 'استثنائي! لقد أتقنت العربية الفصحى. أبواب القصر مفتوحة لك.',
      victory: 'Your Arabic is too informal for this court. Study the formal registers and return.',
      victoryArabic: 'عربيتك عامية جدا لهذا البلاط. ادرس السجلات الرسمية وعد.',
    },
    rewards: {
      xp: 1800,
      dirhams: 700,
      achievementId: 'court_inquisitor_defeated',
      skillReward: 'formal_arabic_mastery',
      vocabularyUnlocked: ['فصحى', 'بلاط', 'لقب', 'خطاب', 'رسمي'],
      rareItem: 'royal_seal_of_eloquence',
    },
    winCondition: 'Defeat boss HP',
  },

  // ──────────────────────────────────────────────────
  // 6. Farmland Boss
  // ──────────────────────────────────────────────────
  {
    id: 'elder_farmer_hassan',
    name: 'Elder Farmer Hassan',
    nameArabic: 'حسن كبير المزارعين',
    zone: 'farmland',
    level: 15,
    baseHP: 150,
    baseDamage: 17,
    baseDefense: 13,
    title: 'Keeper of Agricultural Wisdom',
    titleArabic: 'حارس حكمة الزراعة',
    lore: 'Hassan has worked the land since he was a boy. He knows every crop, every season, and every animal by its Arabic name. He tests travelers on the practical vocabulary of the countryside — the words that feed nations.',
    loreArabic: 'عمل حسن في الأرض منذ كان صبيا. يعرف كل محصول وكل موسم وكل حيوان باسمه العربي. يختبر المسافرين على المفردات العملية للريف — الكلمات التي تطعم الأمم.',
    specialMechanic: {
      type: 'seasonal_knowledge_quiz',
      description: 'Hassan quizzes the player on agricultural terms in seasonal context.',
      mechanic: 'Every 3 turns, Hassan describes a farming scenario. Player must identify the correct agricultural term. Correct = 1.3x damage. Wrong = Hassan gains a defense buff for 1 turn.',
    },
    attackPattern: ['ar-to-en', 'en-to-ar', 'context_quiz', 'listen'],
    attackFrequency: 2,
    dialogue: {
      intro: 'These fields have fed my family for generations. Do you know the words of the earth?',
      introArabic: 'هذه الحقول أطعمت عائلتي لأجيال. هل تعرف كلمات الأرض؟',
      onPlayerHit: 'You know the land! Your hands must have touched soil before.',
      onPlayerHitArabic: 'أنت تعرف الأرض! لا بد أن يديك لمست التراب من قبل.',
      onPlayerMiss: 'Even the chickens know this word! Go back to the city!',
      onPlayerMissArabic: 'حتى الدجاج يعرف هذه الكلمة! ارجع إلى المدينة!',
      halfHealth: 'You have the heart of a farmer! Keep going!',
      halfHealthArabic: 'عندك قلب مزارع! استمر!',
      defeat: 'You have earned the respect of the land. May your harvests be plentiful.',
      defeatArabic: 'كسبت احترام الأرض. فلتكن حصاداتك وفيرة.',
      victory: 'Come back during harvest season. The land will teach you patience.',
      victoryArabic: 'عد في موسم الحصاد. الأرض ستعلمك الصبر.',
    },
    rewards: {
      xp: 1100,
      dirhams: 450,
      achievementId: 'elder_farmer_defeated',
      skillReward: 'agricultural_vocabulary_mastery',
      vocabularyUnlocked: ['زراعة', 'حصاد', 'موسم', 'محصول', 'تراب'],
      rareItem: 'golden_sickle_of_knowledge',
    },
    winCondition: 'Defeat boss HP',
  },

  // ──────────────────────────────────────────────────
  // 7. Coastal Port Boss
  // ──────────────────────────────────────────────────
  {
    id: 'harbor_master_youssef',
    name: 'Harbor Master Youssef',
    nameArabic: 'يوسف رئيس الميناء',
    zone: 'coastal_port',
    level: 16,
    baseHP: 165,
    baseDamage: 18,
    baseDefense: 14,
    title: 'Commander of the Seven Seas',
    titleArabic: 'قائد البحار السبعة',
    lore: 'Youssef has sailed every trade route from the Mediterranean to the Indian Ocean. He commands the port with an iron will and demands that all who pass through speak the language of the sea. His navigation challenges are legendary among sailors.',
    loreArabic: 'أبحر يوسف في كل طريق تجاري من البحر المتوسط إلى المحيط الهندي. يدير الميناء بإرادة حديدية ويطالب كل من يمر أن يتكلم لغة البحر. تحدياته في الملاحة أسطورية بين البحارة.',
    specialMechanic: {
      type: 'navigation_challenge',
      description: 'Youssef tests the player on maritime and navigation vocabulary.',
      mechanic: 'Every 3 turns, Youssef presents a navigation scenario. Player must correctly name directions, nautical terms, or trade routes in Arabic. Correct = 1.4x damage. Wrong = Youssef redirects the player (skip 1 turn).',
    },
    attackPattern: ['ar-to-en', 'en-to-ar', 'navigation_quiz', 'en-to-type-ar'],
    attackFrequency: 2,
    dialogue: {
      intro: 'Welcome to my port! I am Youssef, master of these waters! Can you navigate the sea of Arabic words?',
      introArabic: 'أهلا بك في مينائي! أنا يوسف، سيد هذه المياه! هل تستطيع الإبحار في بحر الكلمات العربية؟',
      onPlayerHit: 'Full speed ahead! Your words are strong as the tide!',
      onPlayerHitArabic: 'بأقصى سرعة! كلماتك قوية كالمد!',
      onPlayerMiss: 'You are lost at sea! That is the wrong direction!',
      onPlayerMissArabic: 'أنت ضائع في البحر! هذا الاتجاه الخاطئ!',
      halfHealth: 'A true sailor emerges! The waves respect you!',
      halfHealthArabic: 'بحار حقيقي يظهر! الأمواج تحترمك!',
      defeat: 'You have earned your sea legs in Arabic! This port is yours to use.',
      defeatArabic: 'لقد اكتسبت أقدامك البحرية بالعربية! هذا الميناء لك لاستخدامه.',
      victory: 'Your Arabic is still landlocked. Come back when you can tell port from starboard.',
      victoryArabic: 'عربيتك لا تزال برية. عد عندما تستطيع التمييز بين الميمنة والميسرة.',
    },
    rewards: {
      xp: 1200,
      dirhams: 500,
      achievementId: 'harbor_master_defeated',
      skillReward: 'maritime_vocabulary_mastery',
      vocabularyUnlocked: ['ميناء', 'بحر', 'سفينة', 'ملاحة', 'موجة'],
      rareItem: 'compass_of_arabic_seas',
    },
    winCondition: 'Defeat boss HP',
  },

  // ──────────────────────────────────────────────────
  // 8. Mountain Village Boss
  // ──────────────────────────────────────────────────
  {
    id: 'philosopher_hermit_khalil',
    name: 'Philosopher Hermit Khalil',
    nameArabic: 'خليل الفيلسوف الناسك',
    zone: 'mountain_village',
    level: 19,
    baseHP: 175,
    baseDamage: 21,
    baseDefense: 16,
    title: 'Sage of the Mountain Peak',
    titleArabic: 'حكيم قمة الجبل',
    lore: 'Khalil retreated to the mountain peak decades ago, seeking truth through language. He has read every philosophical text in Arabic and can debate any topic with devastating clarity. Only those who can match his abstract reasoning earn the right to descend the other side.',
    loreArabic: 'انسحب خليل إلى قمة الجبل منذ عقود، يبحث عن الحقيقة من خلال اللغة. قرأ كل نص فلسفي بالعربية ويستطيع مناقشة أي موضوع بوضوح مدمر. فقط من يستطيع مجاراة تفكيره المجرد يكسب حق النزول من الجانب الآخر.',
    specialMechanic: {
      type: 'philosophical_debate',
      description: 'Khalil presents deep conceptual questions in Arabic. The player must choose the correct abstract term or philosophical concept.',
      mechanic: 'Every 2 turns, Khalil poses a philosophical question. Player must identify the correct abstract Arabic term. Correct = 1.4x damage and MP restore. Wrong = Khalil gains a damage buff for 1 turn.',
    },
    attackPattern: ['ar-to-en', 'en-to-ar', 'philosophy_quiz', 'grammar_quiz'],
    attackFrequency: 2,
    dialogue: {
      intro: 'You have climbed far to reach me. I am Khalil, seeker of truth. Can your words match the depth of these mountains?',
      introArabic: 'صعدت بعيدا لتصل إليّ. أنا خليل، الباحث عن الحقيقة. هل تستطيع كلماتك أن تضاهي عمق هذه الجبال؟',
      onPlayerHit: 'Profound! Your words echo the wisdom of the ages.',
      onPlayerHitArabic: 'عميق! كلماتك تردد حكمة العصور.',
      onPlayerMiss: 'Surface-level thinking. Dig deeper into the meaning.',
      onPlayerMissArabic: 'تفكير سطحي. ابحث أعمق في المعنى.',
      halfHealth: 'You think like a philosopher! Perhaps truth has found you.',
      halfHealthArabic: 'أنت تفكر كفيلسوف! ربما الحقيقة وجدتك.',
      defeat: 'At last, someone who understands! The mountain bows to your wisdom.',
      defeatArabic: 'أخيرا، شخص يفهم! الجبل ينحني لحكمتك.',
      victory: 'Your understanding is incomplete. Meditate on the mountain and return.',
      victoryArabic: 'فهمك غير مكتمل. تأمل في الجبل وعد.',
    },
    rewards: {
      xp: 1400,
      dirhams: 575,
      achievementId: 'philosopher_hermit_defeated',
      skillReward: 'philosophical_vocabulary_mastery',
      vocabularyUnlocked: ['فلسفة', 'حقيقة', 'حكمة', 'تأمل', 'عقل'],
      rareItem: 'tome_of_mountain_philosophy',
    },
    winCondition: 'Defeat boss HP',
  },
];

/**
 * Get the boss encounter for a specific zone.
 * @param {string} zone
 * @returns {Object|undefined}
 */
export function getBossByZone(zone) {
  return bossEncounters.find((b) => b.zone === zone);
}

/**
 * Get a boss encounter by ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getBossById(id) {
  return bossEncounters.find((b) => b.id === id);
}

/**
 * Get all boss encounters sorted by level (ascending).
 * @returns {Object[]}
 */
export function getBossesByDifficulty() {
  return [...bossEncounters].sort((a, b) => a.level - b.level);
}

export default bossEncounters;
