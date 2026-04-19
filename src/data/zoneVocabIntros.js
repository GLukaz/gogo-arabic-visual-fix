/**
 * Zone Vocabulary Introductions — FEAT-045
 *
 * Curated sets of 10-15 key Arabic words for each of the 8 world zones.
 * These words are explicitly taught BEFORE the player explores a zone for the
 * first time, giving them the vocabulary they need to understand zone-specific
 * NPCs, signs, and interactions.
 *
 * Each word entry:
 *   - arabic         {string}  Arabic text (with diacritics where appropriate)
 *   - english        {string}  English meaning
 *   - root           {string}  Trilateral root (e.g. "ك-ت-ب"), or empty string for particles
 *   - zoneContext    {string}  Why this word matters in the zone
 *   - exampleInZone  {string}  Example Arabic sentence used in the zone
 */

// ── Zone Definitions ──────────────────────────────────────────────────────────

const ZONE_VOCAB_INTROS = {
  /**
   * Zone 1: Oasis Village — basics, greetings, everyday life
   */
  oasis_village: [
    {
      id: 'ov_001',
      arabic: 'مَرْحَبًا',
      english: 'hello / welcome',
      root: 'ر-ح-ب',
      zoneContext: 'The villagers greet every visitor; learning this word opens conversations.',
      exampleInZone: 'مَرْحَبًا يا صَديق! أَهْلًا بِكَ في الوَاحَة.',
    },
    {
      id: 'ov_002',
      arabic: 'شُكْرًا',
      english: 'thank you',
      root: 'ش-ك-ر',
      zoneContext: 'Villagers offer help freely; thanking them builds friendship.',
      exampleInZone: 'شُكْرًا جَزيلًا على مُساعَدَتِك.',
    },
    {
      id: 'ov_003',
      arabic: 'مَاء',
      english: 'water',
      root: 'م-و-ه',
      zoneContext: 'The oasis is defined by its water source — the life of the village.',
      exampleInZone: 'هٰذا المَاء عَذْب وَبارِد.',
    },
    {
      id: 'ov_004',
      arabic: 'بَيْت',
      english: 'house / home',
      root: 'ب-ي-ت',
      zoneContext: 'Sand-brick homes surround the oasis; residents invite you inside.',
      exampleInZone: 'بَيْتي بَيْتُكَ — my home is your home.',
    },
    {
      id: 'ov_005',
      arabic: 'اِسْم',
      english: 'name',
      root: 'س-م-و',
      zoneContext: 'The first thing villagers ask is your name.',
      exampleInZone: 'مَا اِسْمُكَ؟ اِسْمي غوغو.',
    },
    {
      id: 'ov_006',
      arabic: 'يَوْم',
      english: 'day',
      root: 'ي-و-م',
      zoneContext: 'Villagers track the day for prayers, markets, and travel.',
      exampleInZone: 'صَبَاح الخَيْر! يَوْم جَميل اليَوم.',
    },
    {
      id: 'ov_007',
      arabic: 'طَعَام',
      english: 'food',
      root: 'ط-ع-م',
      zoneContext: 'Sharing food is central to oasis hospitality.',
      exampleInZone: 'تَفَضَّل، الطَّعَام جَاهِز.',
    },
    {
      id: 'ov_008',
      arabic: 'صَديق',
      english: 'friend',
      root: 'ص-د-ق',
      zoneContext: 'Making friends in the village unlocks quests and support.',
      exampleInZone: 'أَنْتَ صَديقي الجَديد!',
    },
    {
      id: 'ov_009',
      arabic: 'نَعَم',
      english: 'yes',
      root: '',
      zoneContext: 'Used constantly in dialogue choices throughout the zone.',
      exampleInZone: 'نَعَم، أَنا مُسافِر.',
    },
    {
      id: 'ov_010',
      arabic: 'لا',
      english: 'no',
      root: '',
      zoneContext: 'The simplest way to decline offers or answer questions.',
      exampleInZone: 'لا، شُكْرًا. لَسْتُ جَائِعًا.',
    },
    {
      id: 'ov_011',
      arabic: 'كَبير',
      english: 'big / large / great',
      root: 'ك-ب-ر',
      zoneContext: 'Describes the village elder and the oasis itself.',
      exampleInZone: 'هٰذِه الوَاحَة كَبيرة وَجَميلة.',
    },
    {
      id: 'ov_012',
      arabic: 'جَميل',
      english: 'beautiful',
      root: 'ج-م-ل',
      zoneContext: 'Villagers take pride in their oasis; complimenting it opens hearts.',
      exampleInZone: 'وَاحَة جَميلة! لَمْ أَرَ مِثلَها.',
    },
  ],

  /**
   * Zone 2: Desert Marketplace — commerce, trade, bargaining
   */
  desert_marketplace: [
    {
      id: 'dm_001',
      arabic: 'سُوق',
      english: 'market / bazaar',
      root: 'س-و-ق',
      zoneContext: 'This entire zone IS the market; every interaction involves buying or selling.',
      exampleInZone: 'السُّوق مَفْتُوح مِن الصَّبَاح حَتَّى المَساء.',
    },
    {
      id: 'dm_002',
      arabic: 'ثَمَن',
      english: 'price',
      root: 'ث-م-ن',
      zoneContext: 'Knowing this word lets you ask and negotiate prices.',
      exampleInZone: 'كَم ثَمَن هٰذا؟ — How much does this cost?',
    },
    {
      id: 'dm_003',
      arabic: 'بَيْع',
      english: 'selling / sale',
      root: 'ب-ي-ع',
      zoneContext: 'Merchants call out what they are selling throughout the market.',
      exampleInZone: 'لِلْبَيْع! تَمْر طَازَج مِن الوَاحَة.',
    },
    {
      id: 'dm_004',
      arabic: 'شِرَاء',
      english: 'buying / purchase',
      root: 'ش-ر-ي',
      zoneContext: 'Understanding this word helps you complete trade quests.',
      exampleInZone: 'أُريد شِرَاء حَبْل وَزَيْت.',
    },
    {
      id: 'dm_005',
      arabic: 'تَاجِر',
      english: 'merchant / trader',
      root: 'ت-ج-ر',
      zoneContext: 'Merchants are the main NPCs; knowing their title earns respect.',
      exampleInZone: 'هٰذا التَّاجِر مَشْهُور بِأَمَانَتِه.',
    },
    {
      id: 'dm_006',
      arabic: 'رَخيص',
      english: 'cheap / inexpensive',
      root: 'ر-خ-ص',
      zoneContext: 'Used during bargaining — a key word for getting a good deal.',
      exampleInZone: 'هٰذا غالٍ جِدًّا! أَعطِني سِعْرًا أَرْخَص.',
    },
    {
      id: 'dm_007',
      arabic: 'غالٍ',
      english: 'expensive',
      root: 'غ-ل-و',
      zoneContext: 'The counterpart to cheap — essential for any price negotiation.',
      exampleInZone: 'كَيفَ يَكونُ هٰذا غالٍ جِدًّا؟',
    },
    {
      id: 'dm_008',
      arabic: 'نُقُود',
      english: 'money / coins',
      root: 'ن-ق-د',
      zoneContext: 'Currency of the marketplace; needed to buy any item.',
      exampleInZone: 'عِنْدي نُقُود كَافِية لِهٰذا.',
    },
    {
      id: 'dm_009',
      arabic: 'بِضَاعَة',
      english: 'goods / merchandise',
      root: 'ب-ض-ع',
      zoneContext: 'Refers to the items for sale — critical for trade quests.',
      exampleInZone: 'البِضَاعَة هُنا مِن أَفضَل البِضَائِع.',
    },
    {
      id: 'dm_010',
      arabic: 'عَرْض',
      english: 'offer / display',
      root: 'ع-ر-ض',
      zoneContext: 'Merchants make offers; understanding this word keeps you in control.',
      exampleInZone: 'لَديَّ عَرْض خَاص لَكَ اليَوم.',
    },
    {
      id: 'dm_011',
      arabic: 'صَرَاف',
      english: 'money changer',
      root: 'ص-ر-ف',
      zoneContext: 'The currency exchange NPC near the market gate.',
      exampleInZone: 'اِذْهَب إلى الصَّرَّاف لِتَبْديل العُمْلَة.',
    },
    {
      id: 'dm_012',
      arabic: 'مَيزَان',
      english: 'scale / balance',
      root: 'و-ز-ن',
      zoneContext: 'Merchants weigh goods on scales; symbol of fairness in trade.',
      exampleInZone: 'الوَزْن دَقيق — ألف غرام بِالضَّبط.',
    },
  ],

  /**
   * Zone 3: Ancient Library — knowledge, study, scholarship
   */
  ancient_library: [
    {
      id: 'al_001',
      arabic: 'كِتَاب',
      english: 'book',
      root: 'ك-ت-ب',
      zoneContext: 'The library holds thousands of books; this is the zone\'s defining word.',
      exampleInZone: 'هٰذا الكِتَاب أَقدَم مِن مِئَة سَنَة.',
    },
    {
      id: 'al_002',
      arabic: 'قِرَاءَة',
      english: 'reading',
      root: 'ق-ر-أ',
      zoneContext: 'All activities in the library involve reading ancient texts.',
      exampleInZone: 'القِرَاءَة تَفتَح أَبْوَاب المَعرِفَة.',
    },
    {
      id: 'al_003',
      arabic: 'عِلْم',
      english: 'knowledge / science',
      root: 'ع-ل-م',
      zoneContext: 'The library\'s purpose is to preserve and spread knowledge.',
      exampleInZone: 'طَلَب العِلْم فَريضَة على كُلِّ مُسلِم.',
    },
    {
      id: 'al_004',
      arabic: 'دَرَسَ',
      english: 'he studied',
      root: 'د-ر-س',
      zoneContext: 'Students come here to study; many quests involve studying texts.',
      exampleInZone: 'دَرَسَ الطَّالِب طَوالَ اللَّيل.',
    },
    {
      id: 'al_005',
      arabic: 'مُعَلِّم',
      english: 'teacher',
      root: 'ع-ل-م',
      zoneContext: 'Scholars in the library serve as teachers for knowledge quests.',
      exampleInZone: 'المُعَلِّم العَظيم يَشرَح بِصَبر.',
    },
    {
      id: 'al_006',
      arabic: 'سُؤَال',
      english: 'question',
      root: 'س-أ-ل',
      zoneContext: 'Asking questions is the main interaction mechanic in this zone.',
      exampleInZone: 'عِنْدي سُؤَال مُهِمّ يا شَيخ.',
    },
    {
      id: 'al_007',
      arabic: 'جَوَاب',
      english: 'answer',
      root: 'ج-و-ب',
      zoneContext: 'Scholars give answers to questions; finding answers advances quests.',
      exampleInZone: 'الجَوَاب مَوجُود في هٰذا الكِتاب.',
    },
    {
      id: 'al_008',
      arabic: 'فَهِمَ',
      english: 'he understood',
      root: 'ف-ه-م',
      zoneContext: 'Confirming understanding is required to complete teaching moments.',
      exampleInZone: 'فَهِمتُ الدَّرس. شُكرًا يا أُستاذ.',
    },
    {
      id: 'al_009',
      arabic: 'كَلِمَة',
      english: 'word',
      root: 'ك-ل-م',
      zoneContext: 'The library teaches the power of words; this is its core theme.',
      exampleInZone: 'كَلِمَة واحِدَة تُغَيِّر المَعنَى كُلَّه.',
    },
    {
      id: 'al_010',
      arabic: 'لُغَة',
      english: 'language',
      root: 'ل-غ-و',
      zoneContext: 'Scholars debate languages of the ancient world.',
      exampleInZone: 'اللُّغَة العَرَبِيَّة لُغَة الضَّاد.',
    },
    {
      id: 'al_011',
      arabic: 'مَكتَبَة',
      english: 'library',
      root: 'ك-ت-ب',
      zoneContext: 'The name of this zone itself — know where you are.',
      exampleInZone: 'هٰذِه المَكتَبَة تَحتَوي على آلاف الكُتُب.',
    },
    {
      id: 'al_012',
      arabic: 'تَاريخ',
      english: 'history / date',
      root: 'أ-ر-خ',
      zoneContext: 'Ancient scrolls in the library record the history of the land.',
      exampleInZone: 'تَاريخ هٰذِه المَنطِقَة قَديم جِدًّا.',
    },
  ],

  /**
   * Zone 4: Farmland — food, plants, seasons, agriculture
   */
  farmland: [
    {
      id: 'fl_001',
      arabic: 'زَرَعَ',
      english: 'he planted / he farmed',
      root: 'ز-ر-ع',
      zoneContext: 'Farming is the core activity of this zone; you help plant and harvest.',
      exampleInZone: 'زَرَعَ الفَلَّاح القَمح في الرَّبيع.',
    },
    {
      id: 'fl_002',
      arabic: 'نَبَات',
      english: 'plant',
      root: 'ن-ب-ت',
      zoneContext: 'The zone is full of plants; identifying them is part of quests.',
      exampleInZone: 'هٰذا النَّبات يَنمو بِسُرعَة بَعد المَطَر.',
    },
    {
      id: 'fl_003',
      arabic: 'ثَمَرَة',
      english: 'fruit',
      root: 'ث-م-ر',
      zoneContext: 'Fruits are gathered and traded; the zone\'s main resource.',
      exampleInZone: 'الثَّمَرَة نَاضِجَة. هَيَّا نَقطِفها!',
    },
    {
      id: 'fl_004',
      arabic: 'خَضراوَات',
      english: 'vegetables',
      root: 'خ-ض-ر',
      zoneContext: 'Farmers grow vegetables that supply the marketplace.',
      exampleInZone: 'الخَضراوَات الطَّازَجَة أَغلَى في السُّوق.',
    },
    {
      id: 'fl_005',
      arabic: 'حَصَاد',
      english: 'harvest',
      root: 'ح-ص-د',
      zoneContext: 'Harvest season is the busiest time; quests are tied to it.',
      exampleInZone: 'وَقت الحَصَاد قَرِيب — نَحتاج يَد عامِلَة.',
    },
    {
      id: 'fl_006',
      arabic: 'بَذْرَة',
      english: 'seed',
      root: 'ب-ذ-ر',
      zoneContext: 'Planting seeds is the first step of farming quests.',
      exampleInZone: 'عِنْدِي بَذور طَمَاطِم وَبَطَاطِس.',
    },
    {
      id: 'fl_007',
      arabic: 'شَجَرَة',
      english: 'tree',
      root: 'ش-ج-ر',
      zoneContext: 'Fruit trees dot the farmland and provide shade and resources.',
      exampleInZone: 'تِلكَ الشَّجَرَة عُمرُها مِئَة عَام.',
    },
    {
      id: 'fl_008',
      arabic: 'مَطَر',
      english: 'rain',
      root: 'م-ط-ر',
      zoneContext: 'Rain determines crop success; farmers pray for it and fear drought.',
      exampleInZone: 'المَطَر يَنزِل! الأَرض ستَشرَب وَتَحيَا.',
    },
    {
      id: 'fl_009',
      arabic: 'أَرض',
      english: 'land / earth / ground',
      root: 'أ-ر-ض',
      zoneContext: 'The land is the farmer\'s most precious possession.',
      exampleInZone: 'هٰذِه الأَرض خَصبَة جِدًّا.',
    },
    {
      id: 'fl_010',
      arabic: 'مَوسِم',
      english: 'season',
      root: 'و-س-م',
      zoneContext: 'Seasons govern farming cycles and determine which quests are available.',
      exampleInZone: 'مَوسِم الرَّبيع أَفضَل لِزِراعَة الخُضار.',
    },
    {
      id: 'fl_011',
      arabic: 'فَلَّاح',
      english: 'farmer / peasant',
      root: 'ف-ل-ح',
      zoneContext: 'The zone\'s main NPC type; they are the culture of this zone.',
      exampleInZone: 'الفَلَّاح يَعمَل مِن الفَجر حَتَّى الغُروب.',
    },
    {
      id: 'fl_012',
      arabic: 'تَمر',
      english: 'dates (fruit)',
      root: 'ت-م-ر',
      zoneContext: 'Date palms are the iconic crop of the farmland zone.',
      exampleInZone: 'التَّمر حُلو جِدًّا في هٰذا المَوسِم.',
    },
  ],

  /**
   * Zone 5: Bedouin Camp — hospitality, desert culture, community
   */
  bedouin_camp: [
    {
      id: 'bc_001',
      arabic: 'ضَيف',
      english: 'guest',
      root: 'ض-ي-ف',
      zoneContext: 'Guests are sacred in Bedouin culture; you are always a guest here.',
      exampleInZone: 'الضَّيف كَريم، وَالكَرَم وَاجِب.',
    },
    {
      id: 'bc_002',
      arabic: 'ضِيَافَة',
      english: 'hospitality',
      root: 'ض-ي-ف',
      zoneContext: 'The entire zone revolves around Bedouin hospitality traditions.',
      exampleInZone: 'الضِّيافَة عِنْد البَدو مَعروفَة في كُلِّ مَكان.',
    },
    {
      id: 'bc_003',
      arabic: 'خَيمَة',
      english: 'tent',
      root: 'خ-ي-م',
      zoneContext: 'Bedouin live in tents; each tent is a NPC home to explore.',
      exampleInZone: 'خَيمَتنا وَسِيعَة — تَفَضَّل وَادخُل.',
    },
    {
      id: 'bc_004',
      arabic: 'قَهوَة',
      english: 'coffee',
      root: 'ق-ه-و',
      zoneContext: 'Offering coffee is the first act of Bedouin hospitality.',
      exampleInZone: 'تَفَضَّل اِشرَب قَهوَة العَرَب.',
    },
    {
      id: 'bc_005',
      arabic: 'نَار',
      english: 'fire',
      root: 'ن-و-ر',
      zoneContext: 'The camp fire is the social center; stories are told around it.',
      exampleInZone: 'النَّار دافِئَة في هٰذِه اللَّيلَة البارِدَة.',
    },
    {
      id: 'bc_006',
      arabic: 'نُجُوم',
      english: 'stars',
      root: 'ن-ج-م',
      zoneContext: 'Bedouins navigate by stars; constellations are part of zone lore.',
      exampleInZone: 'النُّجوم كَثيرَة اللَّيلَة — طَريق مَأمُون.',
    },
    {
      id: 'bc_007',
      arabic: 'رِحلَة',
      english: 'journey / trip',
      root: 'ر-ح-ل',
      zoneContext: 'Bedouins are travellers; every quest here is about a journey.',
      exampleInZone: 'رِحلَة الأَلف مِيل تَبدأ بِخُطوَة.',
    },
    {
      id: 'bc_008',
      arabic: 'كَرَم',
      english: 'generosity',
      root: 'ك-ر-م',
      zoneContext: 'Generosity is the highest Bedouin virtue.',
      exampleInZone: 'كَرَمُكَ مَشهُور يا شَيخ القَبيلَة.',
    },
    {
      id: 'bc_009',
      arabic: 'قَبيلَة',
      english: 'tribe',
      root: 'ق-ب-ل',
      zoneContext: 'Bedouin society is organised by tribes; knowing this is key to quests.',
      exampleInZone: 'قَبيلَتُنا تُرَحِّب بِكُلِّ غَريب.',
    },
    {
      id: 'bc_010',
      arabic: 'شِعر',
      english: 'poetry',
      root: 'ش-ع-ر',
      zoneContext: 'Bedouin preserve their culture through oral poetry; a key zone mechanic.',
      exampleInZone: 'الشِّعر العَرَبِيّ أَقدَم مِن الإِسلام.',
    },
    {
      id: 'bc_011',
      arabic: 'جَمَل',
      english: 'camel',
      root: 'ج-م-ل',
      zoneContext: 'Camels are the Bedouin\'s most valuable companion for desert travel.',
      exampleInZone: 'جَمَلي قَوِيّ وَيَتحَمَّل العَطَش.',
    },
    {
      id: 'bc_012',
      arabic: 'صَحراء',
      english: 'desert',
      root: 'ص-ح-ر',
      zoneContext: 'The Bedouin camp sits in the desert; the environment itself is a character.',
      exampleInZone: 'الصَّحراء جَميلَة وَخَطِرَة في آنٍ وَاحِد.',
    },
  ],

  /**
   * Zone 6: Mountain Village — nature, travel, altitude, seasons
   */
  mountain_village: [
    {
      id: 'mv_001',
      arabic: 'جَبَل',
      english: 'mountain',
      root: 'ج-ب-ل',
      zoneContext: 'The zone is named after its mountain; this is the defining landscape word.',
      exampleInZone: 'قِمَّة الجَبَل مَغطَّاة بِالثَّلج.',
    },
    {
      id: 'mv_002',
      arabic: 'طَريق',
      english: 'road / path / way',
      root: 'ط-ر-ق',
      zoneContext: 'Mountain paths are treacherous; knowing the word helps with navigation quests.',
      exampleInZone: 'الطَّريق إلى القِمَّة صَعب لٰكِنَّه يَستَحِق.',
    },
    {
      id: 'mv_003',
      arabic: 'سَفَر',
      english: 'travel',
      root: 'س-ف-ر',
      zoneContext: 'This zone is a waypoint for travellers crossing the mountains.',
      exampleInZone: 'السَّفَر في الجِبال يَحتاج اِستِعداد.',
    },
    {
      id: 'mv_004',
      arabic: 'هَواء',
      english: 'air / wind',
      root: 'ه-و-ي',
      zoneContext: 'Mountain air is fresh and strong; wind affects travel and quests.',
      exampleInZone: 'الهَواء هُنا نَقِيّ وَبارِد.',
    },
    {
      id: 'mv_005',
      arabic: 'ثَلج',
      english: 'snow / ice',
      root: 'ث-ل-ج',
      zoneContext: 'Snow caps the peaks; it is a resource and a hazard.',
      exampleInZone: 'الثَّلج يَغطِّي قِمَم الجِبال في الشِّتاء.',
    },
    {
      id: 'mv_006',
      arabic: 'صَخرَة',
      english: 'rock / boulder',
      root: 'ص-خ-ر',
      zoneContext: 'Rocks can block paths or hide secrets in mountain quests.',
      exampleInZone: 'خَلفَ الصَّخرَة الكَبيرَة كَهف صَغير.',
    },
    {
      id: 'mv_007',
      arabic: 'نَهر',
      english: 'river',
      root: 'ن-ه-ر',
      zoneContext: 'Rivers flow down from the mountains; crossing them is a quest challenge.',
      exampleInZone: 'النَّهر يَجري بِسُرعَة في مَوسِم الذَّوبَان.',
    },
    {
      id: 'mv_008',
      arabic: 'بارِد',
      english: 'cold',
      root: 'ب-ر-د',
      zoneContext: 'The mountain is cold; managing temperature affects gameplay.',
      exampleInZone: 'اِرتَدِ ثِيابًا دافِئَة — الجَوّ بارِد جِدًّا.',
    },
    {
      id: 'mv_009',
      arabic: 'مَنظَر',
      english: 'view / scenery',
      root: 'ن-ظ-ر',
      zoneContext: 'Mountain viewpoints reward players with lore and achievements.',
      exampleInZone: 'المَنظَر مِن القِمَّة رائِع لا يُوصَف.',
    },
    {
      id: 'mv_010',
      arabic: 'خَطَر',
      english: 'danger',
      root: 'خ-ط-ر',
      zoneContext: 'Mountains carry dangers; NPCs warn players about hazards.',
      exampleInZone: 'اِنتَبِه! هٰذا الطَّريق خَطِر.',
    },
    {
      id: 'mv_011',
      arabic: 'عُلو',
      english: 'height / altitude',
      root: 'ع-ل-و',
      zoneContext: 'Altitude affects stamina in the zone mechanics.',
      exampleInZone: 'العُلو الشَّديد يُتعِب حَتَّى الأَقوِياء.',
    },
    {
      id: 'mv_012',
      arabic: 'دَليل',
      english: 'guide',
      root: 'د-ل-ل',
      zoneContext: 'Mountain guides are essential NPCs who unlock safe paths.',
      exampleInZone: 'لا تَتحَرَّك بِدون دَليل في هٰذِه الجِبال.',
    },
  ],

  /**
   * Zone 7: Coastal Port — sea trade, foreign goods, navigation
   */
  coastal_port: [
    {
      id: 'cp_001',
      arabic: 'بَحر',
      english: 'sea / ocean',
      root: 'ب-ح-ر',
      zoneContext: 'The sea dominates this zone; everything revolves around it.',
      exampleInZone: 'البَحر هادِئ اليَوم — وَقت مُثالِيّ لِلإِبحار.',
    },
    {
      id: 'cp_002',
      arabic: 'سَفينَة',
      english: 'ship / boat',
      root: 'س-ف-ن',
      zoneContext: 'Ships carry traders and travellers; boarding them unlocks routes.',
      exampleInZone: 'السَّفينَة تُبحِر غَدًا عِند الفَجر.',
    },
    {
      id: 'cp_003',
      arabic: 'مِيناء',
      english: 'port / harbour',
      root: 'م-ن-و',
      zoneContext: 'The port is the hub of the zone; all quests start here.',
      exampleInZone: 'المِيناء مُكتَظّ بِالتُّجَّار والبَحَّارَة.',
    },
    {
      id: 'cp_004',
      arabic: 'تِجارَة',
      english: 'trade / commerce',
      root: 'ت-ج-ر',
      zoneContext: 'International trade is the lifeblood of the coastal port.',
      exampleInZone: 'التِّجارَة البَحرِيَّة أَربَح مِن البَرِّيَّة.',
    },
    {
      id: 'cp_005',
      arabic: 'أَجنَبِيّ',
      english: 'foreigner / foreign',
      root: 'ج-ن-ب',
      zoneContext: 'Foreign merchants bring rare goods and cultural knowledge.',
      exampleInZone: 'التَّاجِر الأَجنَبِيّ يَتكَلَّم لُغَات كَثيرَة.',
    },
    {
      id: 'cp_006',
      arabic: 'رِبح',
      english: 'profit / gain',
      root: 'ر-ب-ح',
      zoneContext: 'Maritime trade is highly profitable; profit drives NPC motivations.',
      exampleInZone: 'الرِّبح كَبير — هٰذِه صَفقَة مُمتازَة.',
    },
    {
      id: 'cp_007',
      arabic: 'مَوج',
      english: 'wave',
      root: 'م-و-ج',
      zoneContext: 'Waves affect sailing conditions and appear in navigation quests.',
      exampleInZone: 'المَوج عالٍ اليَوم — لا تُبحِر الآن.',
    },
    {
      id: 'cp_008',
      arabic: 'صَيَّاد',
      english: 'fisherman',
      root: 'ص-ي-د',
      zoneContext: 'Fishermen are a key NPC faction with their own quests and lore.',
      exampleInZone: 'الصَّيَّاد يَخرُج كُلَّ صَباح قَبل الشُّروق.',
    },
    {
      id: 'cp_009',
      arabic: 'مَرسَى',
      english: 'anchorage / berth',
      root: 'ر-س-و',
      zoneContext: 'Where ships dock; the starting point for maritime quests.',
      exampleInZone: 'السَّفينَة رَاسِيَة في المَرسَى الثَّالِث.',
    },
    {
      id: 'cp_010',
      arabic: 'رِيَاح',
      english: 'winds',
      root: 'ر-و-ح',
      zoneContext: 'Favourable winds determine when ships can sail.',
      exampleInZone: 'الرِّياح مُلائِمَة — أَطلِق الأَشرِعَة!',
    },
    {
      id: 'cp_011',
      arabic: 'بَضائِع',
      english: 'goods / cargo',
      root: 'ب-ض-ع',
      zoneContext: 'Cargo from distant lands fills the port warehouses.',
      exampleInZone: 'البَضائِع قَادِمَة مِن الهِند والصّين.',
    },
    {
      id: 'cp_012',
      arabic: 'نَجم',
      english: 'star (navigation)',
      root: 'ن-ج-م',
      zoneContext: 'Arab navigators were famous for using stars to cross seas.',
      exampleInZone: 'نَتَّجِه نَحو النَّجم القُطبِيّ شِمالًا.',
    },
  ],

  /**
   * Zone 8: Royal Palace — history, governance, ancient power
   */
  royal_palace: [
    {
      id: 'rp_001',
      arabic: 'مَلِك',
      english: 'king',
      root: 'م-ل-ك',
      zoneContext: 'The palace is the seat of kingly power; the ruler is central to zone lore.',
      exampleInZone: 'المَلِك عادِل وَحَكيم.',
    },
    {
      id: 'rp_002',
      arabic: 'قَصر',
      english: 'palace / castle',
      root: 'ق-ص-ر',
      zoneContext: 'The palace itself is the zone; knowing its name deepens immersion.',
      exampleInZone: 'القَصر بُنِيَ مِنذُ أَكثَر مِن أَلف سَنَة.',
    },
    {
      id: 'rp_003',
      arabic: 'حَضارَة',
      english: 'civilisation',
      root: 'ح-ض-ر',
      zoneContext: 'The palace preserves the memory of a great ancient civilisation.',
      exampleInZone: 'هٰذِه الحَضارَة القَديمَة أَثَّرَت في العالَم.',
    },
    {
      id: 'rp_004',
      arabic: 'حُكم',
      english: 'rule / judgement',
      root: 'ح-ك-م',
      zoneContext: 'Governance and law are central themes of palace quests.',
      exampleInZone: 'الحُكم العادِل يُبنَى على الحِكمَة.',
    },
    {
      id: 'rp_005',
      arabic: 'وَزير',
      english: 'minister / vizier',
      root: 'و-ز-ر',
      zoneContext: 'The vizier is a key NPC who controls access to the palace.',
      exampleInZone: 'الوَزير يَستَقبِل الضُّيوف نِيابَةً عن المَلِك.',
    },
    {
      id: 'rp_006',
      arabic: 'عَرش',
      english: 'throne',
      root: 'ع-ر-ش',
      zoneContext: 'The throne room is the final challenge area of the zone.',
      exampleInZone: 'العَرش مَصنُوع مِن الذَّهَب والعاج.',
    },
    {
      id: 'rp_007',
      arabic: 'جَيش',
      english: 'army',
      root: 'ج-ي-ش',
      zoneContext: 'The palace guard army controls access and triggers combat events.',
      exampleInZone: 'جَيش المَلِك حارِس القَصر.',
    },
    {
      id: 'rp_008',
      arabic: 'نَصر',
      english: 'victory',
      root: 'ن-ص-ر',
      zoneContext: 'Victory in palace challenges is celebrated in the great hall.',
      exampleInZone: 'النَّصر لِمَن يَصبِر وَيَجتَهِد.',
    },
    {
      id: 'rp_009',
      arabic: 'حَرب',
      english: 'war',
      root: 'ح-ر-ب',
      zoneContext: 'The palace holds records of ancient wars and their lessons.',
      exampleInZone: 'الحَرب الأَخيرَة دَمَّرَت نِصف المَملَكَة.',
    },
    {
      id: 'rp_010',
      arabic: 'دَولَة',
      english: 'state / nation',
      root: 'د-و-ل',
      zoneContext: 'Understanding the concept of a state unlocks political quest lines.',
      exampleInZone: 'الدَّولَة القَوِيَّة تَحمي مَواطِنيها.',
    },
    {
      id: 'rp_011',
      arabic: 'ذَهَب',
      english: 'gold',
      root: 'ذ-ه-ب',
      zoneContext: 'Gold fills the palace treasury; it is a key quest resource.',
      exampleInZone: 'خَزينَة المَلِك مَليئَة بِالذَّهَب.',
    },
    {
      id: 'rp_012',
      arabic: 'حِكمَة',
      english: 'wisdom',
      root: 'ح-ك-م',
      zoneContext: 'The palace sages test players with wisdom challenges.',
      exampleInZone: 'الحِكمَة أَثمَن مِن الذَّهَب والفِضَّة.',
    },
  ],
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * All zone IDs that have vocabulary intro data.
 * @type {string[]}
 */
export const ZONE_IDS = Object.keys(ZONE_VOCAB_INTROS);

/**
 * Total number of zones with intro data.
 * @type {number}
 */
export const ZONE_COUNT = ZONE_IDS.length;

/**
 * Returns the curated teaching words for a given zone.
 *
 * @param {string} zoneId - Zone identifier (e.g. 'oasis_village')
 * @returns {Array<{ id: string, arabic: string, english: string, root: string, zoneContext: string, exampleInZone: string }>}
 *   The teaching set for the zone, or an empty array if unknown.
 */
export function getZoneIntroWords(zoneId) {
  return ZONE_VOCAB_INTROS[zoneId] ?? [];
}

/**
 * Returns all unique word IDs across all zones.
 * Useful for validation and progress aggregation.
 *
 * @returns {string[]}
 */
export function getAllZoneIntroWordIds() {
  const ids = [];
  for (const words of Object.values(ZONE_VOCAB_INTROS)) {
    for (const word of words) {
      ids.push(word.id);
    }
  }
  return ids;
}

export default ZONE_VOCAB_INTROS;
