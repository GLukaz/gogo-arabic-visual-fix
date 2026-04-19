/**
 * sideQuestChains.js — Phase 89: Expanded NPC Dialogue & Quest Storylines
 *
 * 8 multi-part side quest chains (1 per zone, 3 quests each = 24 total).
 * Each chain tells a self-contained zone-specific story while teaching
 * vocabulary relevant to that zone's theme.
 */

export const SIDE_QUEST_CHAINS = Object.freeze([

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. OASIS VILLAGE — The Mystery of the Dry Well
  // ═══════════════════════════════════════════════════════════════════════════
  {
    chainId: 'oasis_mystery',
    zone: 'oasis-village',
    title: 'The Mystery of the Dry Well',
    titleArabic: 'لُغز البِئر الجافَّة',
    description: 'The village well has run dry for the first time in living memory. Farmer Omar suspects someone has diverted the underground spring, and he needs your help to investigate.',
    quests: [
      {
        id: 'oasis_mystery_1',
        title: 'The Dry Earth',
        titleArabic: 'الأَرض الجافَّة',
        description: 'Farmer Omar shows you the dry well and asks you to speak with the elders about the underground spring. Learn water and nature words to understand their explanations.',
        npcGiver: 'farmer-omar',
        objectives: [
          { id: 'om1_obj_1', description: 'Inspect the dry well with Farmer Omar', descriptionArabic: 'اِفحَص البِئر الجافَّة مَع المُزارِع عُمَر', type: 'explore' },
          { id: 'om1_obj_2', description: 'Learn 3 water-related vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات عَن الماء', type: 'learn' },
          { id: 'om1_obj_3', description: 'Ask Elder Tariq about the underground spring', descriptionArabic: 'اِسأَل الشَّيخ طارِق عَن النَّبع تَحتَ الأَرض', type: 'talk' },
        ],
        reward: { xp: 125, dirhams: 35 },
        prerequisites: [],
        vocabularyIntroduced: ['water_w13', 'rain_w25', 'oasis_w19'],
      },
      {
        id: 'oasis_mystery_2',
        title: 'Following the Water',
        titleArabic: 'تَتَبُّع الماء',
        description: 'Elder Tariq remembers an old irrigation channel that was sealed generations ago. Herbalist Maryam knows which plants grow near underground water — follow her clues.',
        npcGiver: 'elder-tariq',
        objectives: [
          { id: 'om2_obj_1', description: 'Find Herbalist Maryam and learn about water-loving plants', descriptionArabic: 'اِعثُر عَلى العشّابَة مَريَم وَتَعَلَّم عَن نَباتات الماء', type: 'talk' },
          { id: 'om2_obj_2', description: 'Follow the trail of green plants to the blocked channel', descriptionArabic: 'اِتبَع أَثَر النَّباتات الخَضراء لِلقَناة المَسدودَة', type: 'explore' },
          { id: 'om2_obj_3', description: 'Learn 3 plant and nature vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات عَن النَّبات وَالطَّبيعَة', type: 'learn' },
        ],
        reward: { xp: 150, dirhams: 45 },
        prerequisites: ['oasis_mystery_1'],
        vocabularyIntroduced: ['tree_w27', 'palm_tree_w20', 'color_green'],
      },
      {
        id: 'oasis_mystery_3',
        title: 'The Spring Restored',
        titleArabic: 'النَّبع المُستَعاد',
        description: 'You discover the channel was blocked by a collapsed wall. Blacksmith Daud forges the tools needed to clear it. The village celebrates as water returns.',
        npcGiver: 'farmer-omar',
        objectives: [
          { id: 'om3_obj_1', description: 'Ask Blacksmith Daud to forge a digging tool', descriptionArabic: 'اُطلُب مِن الحَدّاد داوُد صُنع أَداة حَفر', type: 'talk' },
          { id: 'om3_obj_2', description: 'Clear the blocked channel', descriptionArabic: 'أَزِل السَّدّ مِن القَناة', type: 'collect' },
          { id: 'om3_obj_3', description: 'Celebrate with the village as water returns', descriptionArabic: 'اِحتَفِل مَع القَريَة بِعَودَة الماء', type: 'talk' },
        ],
        reward: { xp: 175, dirhams: 55 },
        prerequisites: ['oasis_mystery_2'],
        vocabularyIntroduced: ['strong_1', 'help_1', 'happy_1'],
      },
    ],
    completionReward: { xp: 200, dirhams: 100, loreEntry: 'history_oasis_spring' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. ANCIENT LIBRARY — The Lost Catalogue
  // ═══════════════════════════════════════════════════════════════════════════
  {
    chainId: 'library_catalogue',
    zone: 'ancient-library',
    title: 'The Lost Catalogue',
    titleArabic: 'الفِهرِس المَفقود',
    description: 'Librarian Ibrahim discovers that pages are missing from the library\'s master catalogue — without them, hundreds of books cannot be found. Someone has been stealing knowledge.',
    quests: [
      {
        id: 'library_catalogue_1',
        title: 'Missing Pages',
        titleArabic: 'صَفَحات مَفقودَة',
        description: 'Ibrahim is distraught. Three pages of the master catalogue have vanished. Search the reading rooms and learn the numbering system to identify which sections are missing.',
        npcGiver: 'librarian-ibrahim',
        objectives: [
          { id: 'lc1_obj_1', description: 'Speak with Ibrahim about the missing pages', descriptionArabic: 'تَكَلَّم مَع إِبراهيم عَن الصَّفَحات المَفقودَة', type: 'talk' },
          { id: 'lc1_obj_2', description: 'Learn the Arabic numbering system (6-10)', descriptionArabic: 'تَعَلَّم نِظام الأَرقام العَرَبِيَّة', type: 'learn' },
          { id: 'lc1_obj_3', description: 'Search the reading rooms for clues', descriptionArabic: 'فَتِّش غُرَف القِراءَة عَن أَدِلَّة', type: 'explore' },
        ],
        reward: { xp: 130, dirhams: 40 },
        prerequisites: [],
        vocabularyIntroduced: ['num_6', 'num_7', 'num_8'],
      },
      {
        id: 'library_catalogue_2',
        title: 'The Ink Trail',
        titleArabic: 'أَثَر الحِبر',
        description: 'Scribe Amina notices unusual ink stains leading to the restricted section. Follow the trail and learn about different writing materials to identify the thief.',
        npcGiver: 'scribe-amina',
        objectives: [
          { id: 'lc2_obj_1', description: 'Follow the ink stains with Scribe Amina', descriptionArabic: 'اِتبَع بُقَع الحِبر مَع الكاتِبَة أَمينَة', type: 'explore' },
          { id: 'lc2_obj_2', description: 'Learn 3 writing and reading vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات عَن الكِتابَة وَالقِراءَة', type: 'learn' },
          { id: 'lc2_obj_3', description: 'Identify the type of ink used by the thief', descriptionArabic: 'حَدِّد نَوع الحِبر المُستَخدَم مِن اللِّص', type: 'collect' },
        ],
        reward: { xp: 155, dirhams: 50 },
        prerequisites: ['library_catalogue_1'],
        vocabularyIntroduced: ['read_1', 'write_1', 'open_1'],
      },
      {
        id: 'library_catalogue_3',
        title: 'The Catalogue Restored',
        titleArabic: 'الفِهرِس المُستَعاد',
        description: 'The trail leads to Astronomer Zain, who borrowed the pages to cross-reference star charts — not stolen, just absent-mindedly misplaced. Help restore the catalogue.',
        npcGiver: 'librarian-ibrahim',
        objectives: [
          { id: 'lc3_obj_1', description: 'Confront Astronomer Zain about the missing pages', descriptionArabic: 'واجِه الفَلَكي زَين بِشَأن الصَّفَحات', type: 'talk' },
          { id: 'lc3_obj_2', description: 'Help Ibrahim re-catalogue the returned pages', descriptionArabic: 'ساعِد إِبراهيم في إِعادَة فَهرَسَة الصَّفَحات', type: 'learn' },
          { id: 'lc3_obj_3', description: 'Learn 3 number words from the catalogue', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات أَرقام مِن الفِهرِس', type: 'learn' },
        ],
        reward: { xp: 175, dirhams: 60 },
        prerequisites: ['library_catalogue_2'],
        vocabularyIntroduced: ['num_9', 'num_10', 'num_11'],
      },
    ],
    completionReward: { xp: 200, dirhams: 100, loreEntry: 'history_library_founding' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. DESERT MARKETPLACE — The Counterfeit Coins
  // ═══════════════════════════════════════════════════════════════════════════
  {
    chainId: 'market_counterfeit',
    zone: 'desert-marketplace',
    title: 'The Counterfeit Coins',
    titleArabic: 'العُملات المُزَيَّفَة',
    description: 'Counterfeit coins are flooding the marketplace, threatening to destroy trust between traders. Trader Hassan suspects a network of forgers and needs your help to expose them.',
    quests: [
      {
        id: 'market_counterfeit_1',
        title: 'False Gold',
        titleArabic: 'ذَهَب مُزَيَّف',
        description: 'Trader Hassan shows you a counterfeit coin and teaches you the Arabic words for real and fake goods. Help him identify which stalls received fake coins.',
        npcGiver: 'trader-hassan',
        objectives: [
          { id: 'mc1_obj_1', description: 'Examine the counterfeit coin with Hassan', descriptionArabic: 'اِفحَص العُملَة المُزَيَّفَة مَع حَسَن', type: 'talk' },
          { id: 'mc1_obj_2', description: 'Learn 3 trade vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات تِجارِيَّة', type: 'learn' },
          { id: 'mc1_obj_3', description: 'Visit 3 stalls and ask about suspicious customers', descriptionArabic: 'زُر ثلاث دَكاكين وَاسأَل عَن زَبائِن مَشبوهين', type: 'explore' },
        ],
        reward: { xp: 140, dirhams: 50 },
        prerequisites: [],
        vocabularyIntroduced: ['gold_w36', 'silver_w37', 'coin_w47'],
      },
      {
        id: 'market_counterfeit_2',
        title: 'The Weaver\'s Thread',
        titleArabic: 'خَيط النسّاجَة',
        description: 'Weaver Zahra noticed a suspicious customer who paid with false coins and left a thread from an unusual fabric. Follow the thread to the forger\'s workshop.',
        npcGiver: 'weaver-zahra',
        objectives: [
          { id: 'mc2_obj_1', description: 'Speak with Weaver Zahra about the suspicious customer', descriptionArabic: 'تَكَلَّم مَع النسّاجَة زَهراء عَن الزَّبون المَشبوه', type: 'talk' },
          { id: 'mc2_obj_2', description: 'Learn 3 clothing vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات عَن الثِّياب', type: 'learn' },
          { id: 'mc2_obj_3', description: 'Follow the fabric thread to a hidden workshop', descriptionArabic: 'اِتبَع الخَيط لِوَرشَة مَخفِيَّة', type: 'explore' },
        ],
        reward: { xp: 160, dirhams: 55 },
        prerequisites: ['market_counterfeit_1'],
        vocabularyIntroduced: ['thobe_w1', 'scarf_w7', 'cloth_w42'],
      },
      {
        id: 'market_counterfeit_3',
        title: 'Justice in the Souq',
        titleArabic: 'عَدالَة في السّوق',
        description: 'The forger turns out to be a desperate father trying to feed his family. Hassan must decide between strict justice and mercy — and your Arabic helps mediate.',
        npcGiver: 'trader-hassan',
        objectives: [
          { id: 'mc3_obj_1', description: 'Confront the forger in his workshop', descriptionArabic: 'واجِه المُزَوِّر في وَرشَتِه', type: 'talk' },
          { id: 'mc3_obj_2', description: 'Translate between Hassan and the forger in Arabic', descriptionArabic: 'تَرجِم بَين حَسَن وَالمُزَوِّر بِالعَرَبِيَّة', type: 'talk' },
          { id: 'mc3_obj_3', description: 'Help find a fair resolution', descriptionArabic: 'ساعِد في إِيجاد حَلّ عادِل', type: 'talk' },
        ],
        reward: { xp: 180, dirhams: 65 },
        prerequisites: ['market_counterfeit_2'],
        vocabularyIntroduced: ['give_1', 'take_1', 'work_1'],
      },
    ],
    completionReward: { xp: 200, dirhams: 100, loreEntry: 'history_marketplace_trade_code' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. BEDOUIN CAMP — The Lost Song
  // ═══════════════════════════════════════════════════════════════════════════
  {
    chainId: 'bedouin_song',
    zone: 'bedouin-camp',
    title: 'The Lost Song',
    titleArabic: 'الأُغنِيَة المَفقودَة',
    description: 'Storyteller Noor remembers fragments of an ancient Bedouin song that was once sung to guide travelers through sandstorms. Help her reconstruct it before the melody is forgotten forever.',
    quests: [
      {
        id: 'bedouin_song_1',
        title: 'The First Verse',
        titleArabic: 'البَيت الأَوَّل',
        description: 'Noor sings the first verse of the lost song but cannot remember the rest. Elder Tariq may know the second verse — but only if you learn the traditional greeting of the Bedouin.',
        npcGiver: 'storyteller-noor',
        objectives: [
          { id: 'bs1_obj_1', description: 'Listen to Noor sing the first verse', descriptionArabic: 'اِستَمِع لِنور تُغَنّي البَيت الأَوَّل', type: 'talk' },
          { id: 'bs1_obj_2', description: 'Learn 3 adjective vocabulary words from the verse', descriptionArabic: 'تَعَلَّم ثلاث صِفات مِن البَيت', type: 'learn' },
          { id: 'bs1_obj_3', description: 'Perform the traditional Bedouin greeting to Elder Tariq', descriptionArabic: 'قَدِّم التَّحِيَّة البَدَوِيَّة التَّقليدِيَّة لِلشَّيخ طارِق', type: 'talk' },
        ],
        reward: { xp: 130, dirhams: 40 },
        prerequisites: [],
        vocabularyIntroduced: ['big_1', 'beautiful_1', 'strong_1'],
      },
      {
        id: 'bedouin_song_2',
        title: 'The Desert Chorus',
        titleArabic: 'لازِمَة الصَّحراء',
        description: 'Tariq remembers the chorus but the second verse was known only to wanderers. Seek Wanderer Ali on the desert trails to learn the missing words.',
        npcGiver: 'elder-tariq',
        objectives: [
          { id: 'bs2_obj_1', description: 'Learn the chorus from Elder Tariq', descriptionArabic: 'تَعَلَّم اللّازِمَة مِن الشَّيخ طارِق', type: 'learn' },
          { id: 'bs2_obj_2', description: 'Find Wanderer Ali on the desert trail', descriptionArabic: 'اِعثُر عَلى الرَّحّالَة عَلي في الصَّحراء', type: 'explore' },
          { id: 'bs2_obj_3', description: 'Learn 3 nature vocabulary words from the verse', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات طَبيعَة مِن البَيت', type: 'learn' },
        ],
        reward: { xp: 155, dirhams: 50 },
        prerequisites: ['bedouin_song_1'],
        vocabularyIntroduced: ['sand_w17', 'desert_w18', 'wind_w26'],
      },
      {
        id: 'bedouin_song_3',
        title: 'The Song Complete',
        titleArabic: 'الأُغنِيَة الكامِلَة',
        description: 'Ali remembers the final verse. Return to Noor and help her perform the complete song at the campfire. The Bedouin celebrate a tradition restored.',
        npcGiver: 'storyteller-noor',
        objectives: [
          { id: 'bs3_obj_1', description: 'Bring the final verse to Storyteller Noor', descriptionArabic: 'أَحضِر البَيت الأَخير لِلرّاوِيَة نور', type: 'talk' },
          { id: 'bs3_obj_2', description: 'Help Noor perform the complete song at the campfire', descriptionArabic: 'ساعِد نور في أَداء الأُغنِيَة الكامِلَة عِندَ النّار', type: 'talk' },
          { id: 'bs3_obj_3', description: 'Learn 3 emotion vocabulary words from the celebration', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات مَشاعِر مِن الاِحتِفال', type: 'learn' },
        ],
        reward: { xp: 175, dirhams: 60 },
        prerequisites: ['bedouin_song_2'],
        vocabularyIntroduced: ['happy_1', 'sad_1', 'congratulations_1'],
      },
    ],
    completionReward: { xp: 200, dirhams: 100, loreEntry: 'history_bedouin_song_tradition' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ROYAL PALACE — The Vizier's Dilemma
  // ═══════════════════════════════════════════════════════════════════════════
  {
    chainId: 'palace_dilemma',
    zone: 'royal-palace',
    title: 'The Vizier\'s Dilemma',
    titleArabic: 'مُعضِلَة الوَزير',
    description: 'Vizier Abbas faces a diplomatic crisis: two foreign ambassadors have arrived, each claiming their kingdom holds the oldest Arabic manuscript. Only the truth can prevent a war of words.',
    quests: [
      {
        id: 'palace_dilemma_1',
        title: 'The Two Ambassadors',
        titleArabic: 'السَّفيران',
        description: 'Vizier Abbas introduces you to the diplomatic crisis. Learn formal Arabic phrases to understand the ambassadors\' competing claims.',
        npcGiver: 'vizier-abbas',
        objectives: [
          { id: 'pd1_obj_1', description: 'Attend the diplomatic audience with Vizier Abbas', descriptionArabic: 'اُحضُر الجَلسَة الدِّبلوماسِيَّة مَع الوَزير عَبّاس', type: 'talk' },
          { id: 'pd1_obj_2', description: 'Learn 3 formal diplomatic phrases', descriptionArabic: 'تَعَلَّم ثلاث عِبارات دِبلوماسِيَّة رَسمِيَّة', type: 'learn' },
          { id: 'pd1_obj_3', description: 'Listen to both ambassadors\' claims', descriptionArabic: 'اِستَمِع لِمُطالَبات السَّفيرَين', type: 'talk' },
        ],
        reward: { xp: 145, dirhams: 55 },
        prerequisites: [],
        vocabularyIntroduced: ['i_understand_1', 'i_dont_understand_1', 'can_you_help_me_1'],
      },
      {
        id: 'palace_dilemma_2',
        title: 'The Princess\'s Evidence',
        titleArabic: 'أَدِلَّة الأَميرَة',
        description: 'Princess Aisha believes the palace archive holds evidence that could resolve the dispute. Help her search the royal records and learn family vocabulary to trace the manuscript\'s lineage.',
        npcGiver: 'princess-aisha',
        objectives: [
          { id: 'pd2_obj_1', description: 'Search the palace archives with Princess Aisha', descriptionArabic: 'فَتِّش سِجِلّات القَصر مَع الأَميرَة عائِشَة', type: 'explore' },
          { id: 'pd2_obj_2', description: 'Learn 3 family vocabulary words to read the genealogies', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات عائِلَة لِقِراءَة الأَنساب', type: 'learn' },
          { id: 'pd2_obj_3', description: 'Find the critical document in the archives', descriptionArabic: 'اِعثُر عَلى الوَثيقَة الحاسِمَة في السِّجِلّات', type: 'collect' },
        ],
        reward: { xp: 165, dirhams: 60 },
        prerequisites: ['palace_dilemma_1'],
        vocabularyIntroduced: ['family_daughter', 'family_grandfather', 'family_grandmother'],
      },
      {
        id: 'palace_dilemma_3',
        title: 'The Diplomatic Resolution',
        titleArabic: 'الحَلّ الدِّبلوماسي',
        description: 'The document reveals that both manuscripts are halves of the same original text. Speak at the ceremony in Arabic to declare the truth and bring peace.',
        npcGiver: 'vizier-abbas',
        objectives: [
          { id: 'pd3_obj_1', description: 'Present the evidence at the diplomatic ceremony', descriptionArabic: 'قَدِّم الدَّليل في الحَفل الدِّبلوماسي', type: 'talk' },
          { id: 'pd3_obj_2', description: 'Deliver a speech of peace in Arabic', descriptionArabic: 'أَلقِ خِطاب سَلام بِالعَرَبِيَّة', type: 'talk' },
          { id: 'pd3_obj_3', description: 'Receive the Vizier\'s seal of honor', descriptionArabic: 'اِستَلِم خَتم الشَّرَف مِن الوَزير', type: 'collect' },
        ],
        reward: { xp: 190, dirhams: 70 },
        prerequisites: ['palace_dilemma_2'],
        vocabularyIntroduced: ['im_sorry_1', 'welcome_1', 'god_willing_1'],
      },
    ],
    completionReward: { xp: 200, dirhams: 100, loreEntry: 'history_palace_diplomacy' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. MOUNTAIN PASS — The Eagle's Nest
  // ═══════════════════════════════════════════════════════════════════════════
  {
    chainId: 'mountain_eagle',
    zone: 'mountain-pass',
    title: 'The Eagle\'s Nest',
    titleArabic: 'عُشّ النِّسر',
    description: 'Guide Salim has spotted an injured eagle on a high ledge. Saving it requires climbing the most dangerous peak and learning the mountain language that Hermit Idris speaks.',
    quests: [
      {
        id: 'mountain_eagle_1',
        title: 'The Injured Eagle',
        titleArabic: 'النِّسر الجَريح',
        description: 'Guide Salim spots an injured eagle and asks for your help. Learn animal vocabulary and gather supplies for the rescue mission.',
        npcGiver: 'guide-salim',
        objectives: [
          { id: 'me1_obj_1', description: 'Spot the injured eagle with Guide Salim', descriptionArabic: 'شاهِد النِّسر الجَريح مَع الدَّليل سَليم', type: 'explore' },
          { id: 'me1_obj_2', description: 'Learn 3 animal vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات عَن الحَيَوانات', type: 'learn' },
          { id: 'me1_obj_3', description: 'Gather healing herbs from Healer Khadija', descriptionArabic: 'اِجمَع أَعشاب شِفائِيَّة مِن المُعالِجَة خَديجَة', type: 'collect' },
        ],
        reward: { xp: 135, dirhams: 40 },
        prerequisites: [],
        vocabularyIntroduced: ['eagle_1', 'bird_1', 'horse_1'],
      },
      {
        id: 'mountain_eagle_2',
        title: 'The Dangerous Climb',
        titleArabic: 'الصُّعود الخَطير',
        description: 'Mountain Hermit Idris teaches you the mountain vocabulary you need for the climb. The path is treacherous — only Arabic commands will keep you safe.',
        npcGiver: 'mountain-hermit-idris',
        objectives: [
          { id: 'me2_obj_1', description: 'Learn mountain survival vocabulary from Idris', descriptionArabic: 'تَعَلَّم كَلِمات البَقاء في الجَبَل مِن إِدريس', type: 'learn' },
          { id: 'me2_obj_2', description: 'Climb the dangerous path using Arabic commands', descriptionArabic: 'اِصعَد الطَّريق الخَطير بِاِستِخدام أَوامِر عَرَبِيَّة', type: 'explore' },
          { id: 'me2_obj_3', description: 'Learn 3 direction vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات اِتِّجاه', type: 'learn' },
        ],
        reward: { xp: 160, dirhams: 50 },
        prerequisites: ['mountain_eagle_1'],
        vocabularyIntroduced: ['above_1', 'below_1', 'near_1'],
      },
      {
        id: 'mountain_eagle_3',
        title: 'Wings of Freedom',
        titleArabic: 'أَجنِحَة الحُرِّيَّة',
        description: 'You reach the eagle and heal its wing. As it flies free, Guide Salim names it in Arabic and you witness the mountain\'s most beautiful sight.',
        npcGiver: 'guide-salim',
        objectives: [
          { id: 'me3_obj_1', description: 'Heal the eagle\'s wing with the herbs', descriptionArabic: 'عالِج جَناح النِّسر بِالأَعشاب', type: 'collect' },
          { id: 'me3_obj_2', description: 'Name the eagle in Arabic with Salim', descriptionArabic: 'سَمِّ النِّسر بِالعَرَبِيَّة مَع سَليم', type: 'talk' },
          { id: 'me3_obj_3', description: 'Learn 3 adjective words describing the eagle\'s flight', descriptionArabic: 'تَعَلَّم ثلاث صِفات تَصِف طَيَران النِّسر', type: 'learn' },
        ],
        reward: { xp: 180, dirhams: 60 },
        prerequisites: ['mountain_eagle_2'],
        vocabularyIntroduced: ['fast_1', 'far_1', 'beautiful_1'],
      },
    ],
    completionReward: { xp: 200, dirhams: 100, loreEntry: 'history_mountain_eagles' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. COASTAL PORT — The Ghost Ship
  // ═══════════════════════════════════════════════════════════════════════════
  {
    chainId: 'port_ghost_ship',
    zone: 'coastal-port',
    title: 'The Ghost Ship',
    titleArabic: 'سَفينَة الأَشباح',
    description: 'A mysterious ship drifts into the Coastal Port with no crew aboard. Dockmaster Nadia wants to impound it, but Captain Rashid recognizes the vessel — it was his daughter\'s ship.',
    quests: [
      {
        id: 'port_ghost_ship_1',
        title: 'The Empty Vessel',
        titleArabic: 'السَّفينَة الفارِغَة',
        description: 'The ghost ship drifts in at dawn. Dockmaster Nadia demands it be searched by the rules. Board the ship and learn maritime vocabulary to document what you find.',
        npcGiver: 'dockmaster-nadia',
        objectives: [
          { id: 'gs1_obj_1', description: 'Board the ghost ship with Dockmaster Nadia', descriptionArabic: 'اِركَب سَفينَة الأَشباح مَع رَئيسَة المِيناء نادِيَة', type: 'explore' },
          { id: 'gs1_obj_2', description: 'Learn 3 sea and ship vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات عَن البَحر وَالسَّفينَة', type: 'learn' },
          { id: 'gs1_obj_3', description: 'Document the ship\'s contents in Arabic', descriptionArabic: 'وَثِّق مُحتَوَيات السَّفينَة بِالعَرَبِيَّة', type: 'collect' },
        ],
        reward: { xp: 140, dirhams: 50 },
        prerequisites: [],
        vocabularyIntroduced: ['sea_w23', 'star_w16', 'moon_w15'],
      },
      {
        id: 'port_ghost_ship_2',
        title: 'The Captain\'s Tears',
        titleArabic: 'دُموع القُبطان',
        description: 'Captain Rashid recognizes the ship and breaks down. He reveals it was his daughter\'s vessel. Search for her journal and learn to read her Arabic entries.',
        npcGiver: 'captain-rashid',
        objectives: [
          { id: 'gs2_obj_1', description: 'Speak with Captain Rashid about the ship', descriptionArabic: 'تَكَلَّم مَع القُبطان رَشيد عَن السَّفينَة', type: 'talk' },
          { id: 'gs2_obj_2', description: 'Find the captain\'s daughter\'s journal', descriptionArabic: 'اِعثُر عَلى يَومِيّات اِبنَة القُبطان', type: 'collect' },
          { id: 'gs2_obj_3', description: 'Learn 3 emotion and family words to read the journal', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات مَشاعِر وَعائِلَة لِقِراءَة اليَومِيّات', type: 'learn' },
        ],
        reward: { xp: 165, dirhams: 55 },
        prerequisites: ['port_ghost_ship_1'],
        vocabularyIntroduced: ['family_father', 'family_daughter', 'sad_1'],
      },
      {
        id: 'port_ghost_ship_3',
        title: 'A Letter Home',
        titleArabic: 'رِسالَة لِلبَيت',
        description: 'The journal reveals she is alive on a distant island. Help Captain Rashid write a letter to his daughter in Arabic — the most important letter of his life.',
        npcGiver: 'captain-rashid',
        objectives: [
          { id: 'gs3_obj_1', description: 'Read the final journal entry aloud to Rashid', descriptionArabic: 'اِقرَأ آخِر تَدوينَة بِصَوت عالٍ لِرَشيد', type: 'talk' },
          { id: 'gs3_obj_2', description: 'Help Rashid write a letter in Arabic', descriptionArabic: 'ساعِد رَشيد في كِتابَة رِسالَة بِالعَرَبِيَّة', type: 'learn' },
          { id: 'gs3_obj_3', description: 'Send the letter with Fishmonger Hana\'s next trade ship', descriptionArabic: 'أَرسِل الرِّسالَة مَع سَفينَة هَنا التِّجارِيَّة', type: 'talk' },
        ],
        reward: { xp: 185, dirhams: 65 },
        prerequisites: ['port_ghost_ship_2'],
        vocabularyIntroduced: ['i_want_1', 'see_you_later_1', 'goodbye_1'],
      },
    ],
    completionReward: { xp: 200, dirhams: 100, loreEntry: 'history_coastal_port_legend' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. HIDDEN OASIS — The Seed of Knowledge
  // ═══════════════════════════════════════════════════════════════════════════
  {
    chainId: 'hidden_seed',
    zone: 'hidden-oasis',
    title: 'The Seed of Knowledge',
    titleArabic: 'بِذرَة المَعرِفَة',
    description: 'Garden Keeper Leila possesses a legendary seed that only germinates when spoken to in pure Arabic. Help her unlock its secret and grow a tree that has not been seen for a thousand years.',
    quests: [
      {
        id: 'hidden_seed_1',
        title: 'The Dormant Seed',
        titleArabic: 'البِذرَة النّائِمَة',
        description: 'Leila shows you the legendary seed and explains that it responds only to Arabic words spoken with understanding. Learn plant vocabulary and try to wake it.',
        npcGiver: 'garden-keeper-leila',
        objectives: [
          { id: 'hs1_obj_1', description: 'Examine the dormant seed with Leila', descriptionArabic: 'اِفحَص البِذرَة النّائِمَة مَع لَيلى', type: 'talk' },
          { id: 'hs1_obj_2', description: 'Learn 3 plant and garden vocabulary words', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات عَن النَّبات وَالحَديقَة', type: 'learn' },
          { id: 'hs1_obj_3', description: 'Speak the first Arabic words to the seed', descriptionArabic: 'اُنطُق أَوَّل كَلِمات عَرَبِيَّة لِلبِذرَة', type: 'talk' },
        ],
        reward: { xp: 145, dirhams: 45 },
        prerequisites: [],
        vocabularyIntroduced: ['tree_w27', 'water_w13', 'sun_w14'],
      },
      {
        id: 'hidden_seed_2',
        title: 'Words of Growth',
        titleArabic: 'كَلِمات النُّمُو',
        description: 'The seed stirred but did not sprout. Herbalist Maryam believes it needs words from different zones — gather a vocabulary offering from each region.',
        npcGiver: 'herbalist-maryam',
        objectives: [
          { id: 'hs2_obj_1', description: 'Consult Herbalist Maryam about the seed\'s needs', descriptionArabic: 'اِستَشِر العشّابَة مَريَم عَن اِحتِياجات البِذرَة', type: 'talk' },
          { id: 'hs2_obj_2', description: 'Collect a "word offering" from 4 different zones', descriptionArabic: 'اِجمَع كَلِمَة مِن أَربَع مَناطِق مُختَلِفَة', type: 'collect' },
          { id: 'hs2_obj_3', description: 'Learn 3 verbs of nurturing and growth', descriptionArabic: 'تَعَلَّم ثلاث أَفعال رِعايَة وَنُمُو', type: 'learn' },
        ],
        reward: { xp: 170, dirhams: 55 },
        prerequisites: ['hidden_seed_1'],
        vocabularyIntroduced: ['eat_1', 'drink_1', 'sleep_1'],
      },
      {
        id: 'hidden_seed_3',
        title: 'The Tree of Knowledge',
        titleArabic: 'شَجَرَة المَعرِفَة',
        description: 'With vocabulary from all zones spoken to it, the seed finally sprouts. A magnificent tree grows before your eyes. Every leaf carries an Arabic word — a living dictionary.',
        npcGiver: 'garden-keeper-leila',
        objectives: [
          { id: 'hs3_obj_1', description: 'Speak the collected words to the seed in a ceremony', descriptionArabic: 'اُنطُق الكَلِمات المَجموعَة لِلبِذرَة في حَفل', type: 'talk' },
          { id: 'hs3_obj_2', description: 'Watch the Tree of Knowledge grow', descriptionArabic: 'شاهِد شَجَرَة المَعرِفَة تَنمو', type: 'explore' },
          { id: 'hs3_obj_3', description: 'Learn 3 wisdom vocabulary words from the tree\'s leaves', descriptionArabic: 'تَعَلَّم ثلاث كَلِمات حِكمَة مِن أَوراق الشَّجَرَة', type: 'learn' },
        ],
        reward: { xp: 200, dirhams: 75 },
        prerequisites: ['hidden_seed_2'],
        vocabularyIntroduced: ['know_1', 'understand_1', 'learn_1'],
      },
    ],
    completionReward: { xp: 250, dirhams: 150, loreEntry: 'history_tree_of_knowledge' },
  },

]);

/** Total number of side quest chains */
export const SIDE_CHAIN_COUNT = SIDE_QUEST_CHAINS.length;

/** Total number of individual side quests */
export const SIDE_QUEST_COUNT = SIDE_QUEST_CHAINS.reduce(
  (sum, chain) => sum + chain.quests.length, 0
);

/** Get a chain by its chainId */
export function getSideQuestChain(chainId) {
  return SIDE_QUEST_CHAINS.find((c) => c.chainId === chainId) || null;
}

/** Get all side quests for a specific zone */
export function getSideQuestsByZone(zone) {
  return SIDE_QUEST_CHAINS.filter((c) => c.zone === zone);
}

/** Get a flat array of all individual side quests */
export function getAllSideQuests() {
  return SIDE_QUEST_CHAINS.flatMap((c) => c.quests);
}

/** Validate that all prerequisite chains are valid */
export function validateSidePrerequisites() {
  const allIds = new Set(getAllSideQuests().map((q) => q.id));
  for (const quest of getAllSideQuests()) {
    for (const prereq of quest.prerequisites) {
      if (!allIds.has(prereq)) return false;
    }
  }
  return true;
}
