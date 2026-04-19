/**
 * Conversation Scenarios — 40 structured Arabic conversation practice scenarios
 * 5 per zone, CEFR graded (2 A1, 1 A2, 1 B1, 1 B2 per zone)
 *
 * Each scenario has 3-6 exchanges with NPC lines and player word-bank responses.
 * Word banks include the correct words plus 2-3 plausible distractors.
 */

export const ZONES = [
  'oasis-village',
  'ancient-library',
  'desert-marketplace',
  'bedouin-camp',
  'royal-palace',
  'mountain-pass',
  'coastal-port',
  'hidden-oasis',
];

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'];

export const ZONE_LABELS = {
  'oasis-village': { english: 'Oasis Village', arabic: 'واحَة القَرية' },
  'ancient-library': { english: 'Ancient Library', arabic: 'المَكتَبة القَديمة' },
  'desert-marketplace': { english: 'Desert Marketplace', arabic: 'سوق الصَّحراء' },
  'bedouin-camp': { english: 'Bedouin Camp', arabic: 'مُخَيَّم البَدو' },
  'royal-palace': { english: 'Royal Palace', arabic: 'القَصر المَلَكي' },
  'mountain-pass': { english: 'Mountain Pass', arabic: 'مَمَرّ الجَبَل' },
  'coastal-port': { english: 'Coastal Port', arabic: 'المِيناء السّاحِلي' },
  'hidden-oasis': { english: 'Hidden Oasis', arabic: 'الواحة المَخفِيَّة' },
};

export const conversationScenarios = [
  // ============================================================
  // OASIS VILLAGE (5 scenarios)
  // ============================================================

  // OV-1: Basic Greetings (A1)
  {
    id: 'oasis_greeting_001',
    zone: 'oasis-village',
    topic: 'greeting',
    cefrLevel: 'A1',
    title: 'Greeting a Scholar',
    titleArabic: 'تَحِيَّة عالِم',
    context: 'You meet Scholar Yusuf near the oasis fountain. He greets you warmly.',
    contextArabic: 'تُقابِلُ الشَّيْخَ يوسُفَ بِجانِبِ نافورَةِ الواحة. يُحَيِّيكَ بِحَرارة.',
    npcName: 'Scholar Yusuf',
    npcPortrait: 'portrait-scholar-yusuf',
    exchanges: [
      {
        npcLine: {
          arabic: 'السَّلامُ عَلَيْكُم!',
          english: 'Peace be upon you!',
          transliteration: `as-salaamu alaykum!`,
        },
        playerResponse: {
          correctArabic: 'وَعَلَيْكُمُ السَّلام',
          correctEnglish: 'And upon you peace',
          wordBank: ['وَعَلَيْكُمُ', 'السَّلام', 'مَعَ', 'صَباح', 'عَلَيْكَ'],
          grammarHint: 'The standard reply to as-salaamu alaykum is wa-alaykumu as-salaam.',
        },
      },
      {
        npcLine: {
          arabic: 'كَيْفَ حالُكَ اليَوْم؟',
          english: 'How are you today?',
          transliteration: `kayfa haaluka al-yawm?`,
        },
        playerResponse: {
          correctArabic: 'أَنا بِخَيْر شُكْرًا',
          correctEnglish: 'I am fine, thank you',
          wordBank: ['أَنا', 'بِخَيْر', 'شُكْرًا', 'سَعيد', 'هُوَ', 'لا'],
          grammarHint: 'Use أَنا (I am) + بِخَيْر (fine) + شُكْرًا (thank you).',
        },
      },
      {
        npcLine: {
          arabic: 'الحَمْدُ لِلَّه! أَهْلًا وَسَهْلًا في الواحة.',
          english: 'Praise God! Welcome to the oasis.',
          transliteration: `al-hamdu lillaah! ahlan wa-sahlan fil-waaha.`,
        },
        playerResponse: {
          correctArabic: 'شُكْرًا جَزيلًا',
          correctEnglish: 'Thank you very much',
          wordBank: ['شُكْرًا', 'جَزيلًا', 'كَثيرًا', 'أَهْلًا', 'مَعَ'],
          grammarHint: 'شُكْرًا جَزيلًا is a common way to say "thank you very much".',
        },
      },
    ],
    vocabularyUsed: ['salaam', 'shukran', 'ahlan', 'kayfa_haluk', 'bi_khayr'],
    xpReward: 50,
  },

  // OV-2: Introducing Yourself (A1)
  {
    id: 'oasis_intro_002',
    zone: 'oasis-village',
    topic: 'introduction',
    cefrLevel: 'A1',
    title: 'Introducing Yourself',
    titleArabic: 'تَقديم نَفسِكَ',
    context: 'Merchant Fatima asks about you. Introduce yourself politely.',
    contextArabic: 'تاجِرَة فاطِمة تَسْأَلُكَ عَن نَفسِكَ. قَدِّم نَفسَكَ بِأَدَب.',
    npcName: 'Merchant Fatima',
    npcPortrait: 'portrait-merchant-fatima',
    exchanges: [
      {
        npcLine: {
          arabic: 'مَرْحَبًا! ما اسْمُكَ؟',
          english: 'Hello! What is your name?',
          transliteration: `marhaban! maa ismuka?`,
        },
        playerResponse: {
          correctArabic: 'اِسْمي طالِب',
          correctEnglish: 'My name is Talib',
          wordBank: ['اِسْمي', 'طالِب', 'اِسْمُكَ', 'هُوَ', 'أَنتَ'],
          grammarHint: 'Use اِسْمي (my name) followed by the name.',
        },
      },
      {
        npcLine: {
          arabic: 'أَهْلًا يا طالِب! مِن أَيْنَ أَنتَ؟',
          english: 'Welcome Talib! Where are you from?',
          transliteration: `ahlan yaa taalib! min ayna anta?`,
        },
        playerResponse: {
          correctArabic: 'أَنا مِن بَعيد',
          correctEnglish: 'I am from far away',
          wordBank: ['أَنا', 'مِن', 'بَعيد', 'قَريب', 'هُنا', 'إلى'],
          grammarHint: 'أَنا مِن (I am from) + place or description.',
        },
      },
      {
        npcLine: {
          arabic: 'مَرْحَبًا بِكَ! هَل تَتَكَلَّمُ العَرَبِيَّة؟',
          english: 'Welcome! Do you speak Arabic?',
          transliteration: `marhaban bika! hal tatakallamu al-arabiyya?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم قَليلًا',
          correctEnglish: 'Yes, a little',
          wordBank: ['نَعَم', 'قَليلًا', 'لا', 'كَثيرًا', 'جِدًّا'],
          grammarHint: 'نَعَم (yes) + قَليلًا (a little) is humble and polite.',
        },
      },
      {
        npcLine: {
          arabic: 'مُمْتاز! سَتَتَعَلَّمُ هُنا كَثيرًا.',
          english: 'Excellent! You will learn a lot here.',
          transliteration: `mumtaaz! satata'allamu hunaa kathiiran.`,
        },
        playerResponse: {
          correctArabic: 'إنْ شاءَ الله',
          correctEnglish: 'God willing',
          wordBank: ['إنْ', 'شاءَ', 'الله', 'نَعَم', 'شُكْرًا'],
          grammarHint: 'إنْ شاءَ الله (God willing) is used to express hope for the future.',
        },
      },
    ],
    vocabularyUsed: ['marhaba', 'ahlan', 'na_am', 'la', 'ismi'],
    xpReward: 50,
  },

  // OV-3: Asking for Water (A2)
  {
    id: 'oasis_water_003',
    zone: 'oasis-village',
    topic: 'requesting',
    cefrLevel: 'A2',
    title: 'Asking for Water',
    titleArabic: 'طَلَب الماء',
    context: 'The desert sun is scorching. You approach Farmer Omar to ask for water.',
    contextArabic: 'شَمسُ الصَّحراءِ حارِقة. تَقتَرِبُ مِن المُزارِعِ عُمَر لِطَلَبِ الماء.',
    npcName: 'Farmer Omar',
    npcPortrait: 'portrait-farmer-omar',
    exchanges: [
      {
        npcLine: {
          arabic: 'مَرْحَبًا يا صَديقي! تَبْدو عَطْشانًا.',
          english: 'Hello my friend! You look thirsty.',
          transliteration: `marhaban yaa sadiiqi! tabduu atshaan.`,
        },
        playerResponse: {
          correctArabic: 'نَعَم أُريدُ ماءً مِن فَضلِكَ',
          correctEnglish: 'Yes, I want water please',
          wordBank: ['نَعَم', 'أُريدُ', 'ماءً', 'مِن', 'فَضلِكَ', 'طَعامًا', 'بِدون', 'لَكِن'],
          grammarHint: 'أُريدُ (I want) + ماءً (water, accusative) + مِن فَضلِكَ (please).',
        },
      },
      {
        npcLine: {
          arabic: 'طَبْعًا! هَل تُريدُ ماءً بارِدًا أَو عادِيًّا؟',
          english: 'Of course! Do you want cold water or regular?',
          transliteration: `tab'an! hal turiidu maa'an baaridan aw aadiyyan?`,
        },
        playerResponse: {
          correctArabic: 'أُريدُ ماءً بارِدًا',
          correctEnglish: 'I want cold water',
          wordBank: ['أُريدُ', 'ماءً', 'بارِدًا', 'عادِيًّا', 'حارًّا', 'كَثيرًا'],
          grammarHint: 'Adjectives follow the noun and match in case: ماءً بارِدًا (cold water, accusative).',
        },
      },
      {
        npcLine: {
          arabic: 'تَفَضَّل! هَذا الماءُ مِنَ البِئر.',
          english: 'Here you go! This water is from the well.',
          transliteration: `tafaddal! haadha al-maa'u min al-bi'r.`,
        },
        playerResponse: {
          correctArabic: 'شُكْرًا جَزيلًا يا عُمَر',
          correctEnglish: 'Thank you very much, Omar',
          wordBank: ['شُكْرًا', 'جَزيلًا', 'يا', 'عُمَر', 'كَثيرًا', 'سَيِّد'],
          grammarHint: 'يا (O/hey) is used before names when addressing someone directly.',
        },
      },
    ],
    vocabularyUsed: ['maa', 'na_am', 'shukran', 'min_fadlik', 'uriidu'],
    xpReward: 75,
  },

  // OV-4: Talking About Family (B1)
  {
    id: 'oasis_family_004',
    zone: 'oasis-village',
    topic: 'family',
    cefrLevel: 'B1',
    title: 'Talking About Family',
    titleArabic: 'الحَديث عَنِ العائِلة',
    context: 'Elder Tariq asks about your family while sharing tea at the village square.',
    contextArabic: 'الحَكيمُ طارِقُ يَسأَلُكَ عَن عائِلَتِكَ أَثناءَ شُربِ الشّايِ في ساحَةِ القَرية.',
    npcName: 'Elder Tariq',
    npcPortrait: 'portrait-elder-tariq',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَخْبِرني عَن عائِلَتِكَ يا بُنَيّ.',
          english: 'Tell me about your family, my child.',
          transliteration: `akhbirnii an aa'ilatika yaa bunayy.`,
        },
        playerResponse: {
          correctArabic: 'عِندي أَبٌ وَأُمٌّ وَأَخٌ واحِد',
          correctEnglish: 'I have a father, a mother, and one brother',
          wordBank: ['عِندي', 'أَبٌ', 'وَأُمٌّ', 'وَأَخٌ', 'واحِد', 'وَأُختٌ', 'ثَلاثَة', 'كَبير'],
          grammarHint: 'عِندي (I have) + family members connected by وَ (and).',
        },
      },
      {
        npcLine: {
          arabic: 'ما شاءَ الله! هَل أَخوكَ أَكبَرُ مِنكَ أَم أَصغَر؟',
          english: 'Wonderful! Is your brother older or younger than you?',
          transliteration: `maa shaa' allaah! hal akhuuka akbaru minka am asghar?`,
        },
        playerResponse: {
          correctArabic: 'أَخي أَكبَرُ مِنّي بِسَنَتَين',
          correctEnglish: 'My brother is older than me by two years',
          wordBank: ['أَخي', 'أَكبَرُ', 'مِنّي', 'بِسَنَتَين', 'أَصغَرُ', 'بِثَلاث', 'أُختي'],
          grammarHint: 'Comparative أَكبَر (bigger/older) + مِنّي (than me) + بِ + time span.',
        },
      },
      {
        npcLine: {
          arabic: 'وَهَل يَسكُنونَ بَعيدًا عَنكَ؟',
          english: 'And do they live far from you?',
          transliteration: `wa-hal yaskunuuna ba'iidan anka?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم هُم يَسكُنونَ في مَدينَة أُخرى',
          correctEnglish: 'Yes, they live in another city',
          wordBank: ['نَعَم', 'هُم', 'يَسكُنونَ', 'في', 'مَدينَة', 'أُخرى', 'قَرية', 'هُنا', 'بَيت'],
          grammarHint: 'هُم يَسكُنونَ (they live) + في (in) + مَدينَة أُخرى (another city).',
        },
      },
      {
        npcLine: {
          arabic: 'اللهُ يَحفَظُهُم. العائِلَةُ هِيَ الكَنز.',
          english: 'May God protect them. Family is the treasure.',
          transliteration: `allaahu yahfadhuhum. al-aa'ila hiya al-kanz.`,
        },
        playerResponse: {
          correctArabic: 'صَحيح العائِلَةُ أَهَمُّ شَيء',
          correctEnglish: 'True, family is the most important thing',
          wordBank: ['صَحيح', 'العائِلَةُ', 'أَهَمُّ', 'شَيء', 'كَبير', 'دائِمًا', 'أَجمَل'],
          grammarHint: 'أَهَمُّ (most important) is the superlative of مُهِمّ (important).',
        },
      },
    ],
    vocabularyUsed: ['ab', 'umm', 'akh', 'ukht', 'aa_ila', 'indi'],
    xpReward: 100,
  },

  // OV-5: Daily Routine (B2)
  {
    id: 'oasis_routine_005',
    zone: 'oasis-village',
    topic: 'daily_routine',
    cefrLevel: 'B2',
    title: 'Describing Your Daily Routine',
    titleArabic: 'وَصف رُوتينِكَ اليَوْمي',
    context: 'Storyteller Noor is curious about how you spend your days learning Arabic.',
    contextArabic: 'الرّاوِيَة نور فُضولِيَّة حَولَ كَيفِيَّةِ قَضاءِ أَيّامِكَ في تَعَلُّمِ العَرَبِيَّة.',
    npcName: 'Storyteller Noor',
    npcPortrait: 'portrait-storyteller-noor',
    exchanges: [
      {
        npcLine: {
          arabic: 'كَيفَ تَقْضي يَومَكَ في تَعَلُّمِ العَرَبِيَّة؟',
          english: 'How do you spend your day learning Arabic?',
          transliteration: `kayfa taqdi yawmaka fii ta'allum al-arabiyya?`,
        },
        playerResponse: {
          correctArabic: 'أَستَيقِظُ مُبَكِّرًا وَأَبدَأُ بِالدِّراسَة',
          correctEnglish: 'I wake up early and start studying',
          wordBank: ['أَستَيقِظُ', 'مُبَكِّرًا', 'وَأَبدَأُ', 'بِالدِّراسَة', 'مُتَأَخِّرًا', 'وَأَنامُ', 'بِاللَّعب'],
          grammarHint: 'أَستَيقِظُ (I wake up, Form X) + وَأَبدَأُ (and I begin) + بِ + verbal noun.',
        },
      },
      {
        npcLine: {
          arabic: 'ما شاءَ الله! وَماذا تَدرُسُ عادَةً؟',
          english: 'Wonderful! And what do you usually study?',
          transliteration: `maa shaa' allaah! wa-maadha tadrusu aadatan?`,
        },
        playerResponse: {
          correctArabic: 'أَدرُسُ القَواعِدَ وَأَتَمَرَّنُ عَلى المُحادَثة',
          correctEnglish: 'I study grammar and practice conversation',
          wordBank: ['أَدرُسُ', 'القَواعِدَ', 'وَأَتَمَرَّنُ', 'عَلى', 'المُحادَثة', 'الكِتابَة', 'في', 'وَأَقرَأُ'],
          grammarHint: 'أَتَمَرَّنُ (I practice, Form V) + عَلى (on/at) + verbal noun.',
        },
      },
      {
        npcLine: {
          arabic: 'هَل وَجَدْتَ صُعوبَةً في بَعضِ الدُّروس؟',
          english: 'Have you found difficulty in some lessons?',
          transliteration: `hal wajadta su'uubatan fii ba'di ad-duruus?`,
        },
        playerResponse: {
          correctArabic: 'الصَّرفُ صَعبٌ لَكِنَّ المُمارَسَةَ تُساعِدُني',
          correctEnglish: 'Morphology is difficult but practice helps me',
          wordBank: ['الصَّرفُ', 'صَعبٌ', 'لَكِنَّ', 'المُمارَسَةَ', 'تُساعِدُني', 'سَهلٌ', 'تُعَلِّمُني', 'النَّحوُ'],
          grammarHint: 'لَكِنَّ (but, inna-sister) takes an accusative noun: المُمارَسَةَ.',
        },
      },
      {
        npcLine: {
          arabic: 'المُثابَرَةُ هِيَ مِفتاحُ النَّجاح.',
          english: 'Perseverance is the key to success.',
          transliteration: `al-muthaabara hiya miftaahu an-najaah.`,
        },
        playerResponse: {
          correctArabic: 'سَأَستَمِرُّ في التَّعَلُّمِ كُلَّ يَوم',
          correctEnglish: 'I will continue learning every day',
          wordBank: ['سَأَستَمِرُّ', 'في', 'التَّعَلُّمِ', 'كُلَّ', 'يَوم', 'سَأَتوَقَّفُ', 'عَن', 'لَيلَة'],
          grammarHint: 'سَ + أَستَمِرُّ (I will continue, Form X) + في + verbal noun for ongoing action.',
        },
      },
    ],
    vocabularyUsed: ['yawm', 'dirasa', 'qawaid', 'muhadatha', 'mumaarasa'],
    xpReward: 150,
  },

  // ============================================================
  // ANCIENT LIBRARY (5 scenarios)
  // ============================================================

  // AL-1: Asking About Books (A1)
  {
    id: 'library_books_001',
    zone: 'ancient-library',
    topic: 'books',
    cefrLevel: 'A1',
    title: 'Asking About Books',
    titleArabic: 'السُّؤال عَنِ الكُتُب',
    context: 'You enter the ancient library and meet Librarian Ibrahim surrounded by scrolls.',
    contextArabic: 'تَدخُلُ المَكتَبَةَ القَديمَة وَتُقابِلُ أَمينَ المَكتَبَة إبراهيم بَينَ المَخطوطات.',
    npcName: 'Librarian Ibrahim',
    npcPortrait: 'portrait-librarian-ibrahim',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَهْلًا! هَذِهِ مَكتَبَتُنا. هَل تُحِبُّ القِراءَة؟',
          english: 'Welcome! This is our library. Do you like reading?',
          transliteration: `ahlan! haadhihi maktabatunaa. hal tuhibbu al-qiraa'a?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم أُحِبُّ القِراءَة',
          correctEnglish: 'Yes, I love reading',
          wordBank: ['نَعَم', 'أُحِبُّ', 'القِراءَة', 'لا', 'أَكرَهُ', 'الكِتابَة'],
          grammarHint: 'أُحِبُّ (I love/like) + definite verbal noun القِراءَة (reading).',
        },
      },
      {
        npcLine: {
          arabic: 'مُمْتاز! ماذا تُريدُ أَن تَقرَأَ؟',
          english: 'Excellent! What do you want to read?',
          transliteration: `mumtaaz! maadha turiidu an taqra'a?`,
        },
        playerResponse: {
          correctArabic: 'أُريدُ كِتابًا عَن اللُّغَة',
          correctEnglish: 'I want a book about the language',
          wordBank: ['أُريدُ', 'كِتابًا', 'عَن', 'اللُّغَة', 'مَجَلَّة', 'في', 'التّاريخ'],
          grammarHint: 'كِتابًا (a book, indefinite accusative) + عَن (about) + topic.',
        },
      },
      {
        npcLine: {
          arabic: 'عِندَنا كُتُبٌ كَثيرَة. تَفَضَّل!',
          english: 'We have many books. Please, go ahead!',
          transliteration: `indanaa kutubun kathiira. tafaddal!`,
        },
        playerResponse: {
          correctArabic: 'شُكْرًا يا أُستاذ',
          correctEnglish: 'Thank you, teacher',
          wordBank: ['شُكْرًا', 'يا', 'أُستاذ', 'سَيِّد', 'أَخي', 'جَزيلًا'],
          grammarHint: 'يا أُستاذ (O teacher) — a respectful way to address a scholar.',
        },
      },
    ],
    vocabularyUsed: ['kitab', 'qiraa_a', 'lugha', 'shukran', 'ustaadh'],
    xpReward: 50,
  },

  // AL-2: Discussing Knowledge (A1)
  {
    id: 'library_knowledge_002',
    zone: 'ancient-library',
    topic: 'knowledge',
    cefrLevel: 'A1',
    title: 'Discussing Knowledge',
    titleArabic: 'الحَديث عَنِ المَعرِفة',
    context: 'Scribe Amina shares her love of knowledge and asks what you know.',
    contextArabic: 'الكاتِبَة أَمينَة تُشارِكُكَ حُبَّها لِلمَعرِفَة وَتَسأَلُكَ عَمّا تَعرِفُه.',
    npcName: 'Scribe Amina',
    npcPortrait: 'portrait-scribe-amina',
    exchanges: [
      {
        npcLine: {
          arabic: 'العِلمُ نور. ماذا تَعرِفُ عَنِ العَرَبِيَّة؟',
          english: 'Knowledge is light. What do you know about Arabic?',
          transliteration: `al-ilmu nuur. maadha ta'rifu an al-arabiyya?`,
        },
        playerResponse: {
          correctArabic: 'أَعرِفُ الحُروفَ وَبَعضَ الكَلِمات',
          correctEnglish: 'I know the letters and some words',
          wordBank: ['أَعرِفُ', 'الحُروفَ', 'وَبَعضَ', 'الكَلِمات', 'كُلَّ', 'الجُمَل', 'لا'],
          grammarHint: 'أَعرِفُ (I know) + الحُروفَ (the letters, accusative) + وَبَعضَ (and some of).',
        },
      },
      {
        npcLine: {
          arabic: 'بِدايَة جَيِّدَة! هَل تُريدُ أَن تَتَعَلَّمَ المَزيد؟',
          english: 'A good start! Do you want to learn more?',
          transliteration: `bidaaya jayyida! hal turiidu an tata'allama al-maziid?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم أُريدُ أَن أَتَعَلَّمَ',
          correctEnglish: 'Yes, I want to learn',
          wordBank: ['نَعَم', 'أُريدُ', 'أَن', 'أَتَعَلَّمَ', 'لا', 'أَقرَأَ', 'أَذهَبَ'],
          grammarHint: 'أُريدُ أَن + subjunctive verb (أَتَعَلَّمَ) = I want to learn.',
        },
      },
      {
        npcLine: {
          arabic: 'رائِع! الصَّبرُ مِفتاحُ العِلم.',
          english: 'Wonderful! Patience is the key to knowledge.',
          transliteration: `raa'i'! as-sabru miftaahu al-ilm.`,
        },
        playerResponse: {
          correctArabic: 'أَنا صَبور إنْ شاءَ الله',
          correctEnglish: 'I am patient, God willing',
          wordBank: ['أَنا', 'صَبور', 'إنْ', 'شاءَ', 'الله', 'كَسول', 'مُجتَهِد'],
          grammarHint: 'أَنا + adjective (صَبور = patient). إنْ شاءَ الله expresses hope.',
        },
      },
    ],
    vocabularyUsed: ['ilm', 'huruuf', 'kalimaat', 'na_am', 'sabr'],
    xpReward: 50,
  },

  // AL-3: Requesting Help (A2)
  {
    id: 'library_help_003',
    zone: 'ancient-library',
    topic: 'requesting',
    cefrLevel: 'A2',
    title: 'Requesting Help',
    titleArabic: 'طَلَب المُساعَدَة',
    context: 'You need help finding a specific scroll in the vast library.',
    contextArabic: 'تَحتاجُ مُساعَدَة لِإيجادِ مَخطوطَة مُعَيَّنَة في المَكتَبَة الواسِعَة.',
    npcName: 'Librarian Ibrahim',
    npcPortrait: 'portrait-librarian-ibrahim',
    exchanges: [
      {
        npcLine: {
          arabic: 'هَل تَبحَثُ عَن شَيءٍ مُعَيَّن؟',
          english: 'Are you looking for something specific?',
          transliteration: `hal tabhath an shay'in mu'ayyan?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم أَبحَثُ عَن كِتابِ النَّحو',
          correctEnglish: 'Yes, I am looking for the grammar book',
          wordBank: ['نَعَم', 'أَبحَثُ', 'عَن', 'كِتابِ', 'النَّحو', 'لا', 'مَجَلَّة', 'الصَّرف'],
          grammarHint: 'أَبحَثُ عَن (I search for) + idafa: كِتابِ النَّحو (book of grammar).',
        },
      },
      {
        npcLine: {
          arabic: 'كُتُبُ النَّحوِ في الرَّفِّ الثّالِث. هَل تَحتاجُ مُساعَدَة؟',
          english: 'Grammar books are on the third shelf. Do you need help?',
          transliteration: `kutubu an-nahwi fii ar-raffi ath-thaalith. hal tahtaaju musaa'ada?`,
        },
        playerResponse: {
          correctArabic: 'هَل يُمكِنُكَ أَن تُساعِدَني',
          correctEnglish: 'Can you help me?',
          wordBank: ['هَل', 'يُمكِنُكَ', 'أَن', 'تُساعِدَني', 'تَدُلَّني', 'نَعَم', 'لا'],
          grammarHint: 'هَل يُمكِنُكَ أَن (can you) + subjunctive verb = polite request.',
        },
      },
      {
        npcLine: {
          arabic: 'بِالتَّأكيد! تَعالَ مَعي.',
          english: 'Of course! Come with me.',
          transliteration: `bit-ta'kiid! ta'aal ma'ii.`,
        },
        playerResponse: {
          correctArabic: 'شُكْرًا لَكَ على المُساعَدَة',
          correctEnglish: 'Thank you for the help',
          wordBank: ['شُكْرًا', 'لَكَ', 'على', 'المُساعَدَة', 'مَعَ', 'الكِتاب', 'جَزيلًا'],
          grammarHint: 'شُكْرًا لَكَ (thank you, to you) + على (for) + المُساعَدَة (the help).',
        },
      },
    ],
    vocabularyUsed: ['kitab', 'nahw', 'musaa_ada', 'shukran', 'abhath'],
    xpReward: 75,
  },

  // AL-4: Describing What You're Looking For (B1)
  {
    id: 'library_search_004',
    zone: 'ancient-library',
    topic: 'describing',
    cefrLevel: 'B1',
    title: 'Describing What You Seek',
    titleArabic: 'وَصف ما تَبحَثُ عَنهُ',
    context: 'You describe a rare manuscript to Astronomer Zain who might know its location.',
    contextArabic: 'تَصِفُ مَخطوطَةً نادِرَة لِلفَلَكيِّ زَيْن الَّذي قَد يَعرِفُ مَكانَها.',
    npcName: 'Astronomer Zain',
    npcPortrait: 'portrait-astronomer-zain',
    exchanges: [
      {
        npcLine: {
          arabic: 'سَمِعتُ أَنَّكَ تَبحَثُ عَن مَخطوطَة. صِفها لي.',
          english: 'I heard you are looking for a manuscript. Describe it to me.',
          transliteration: `sami'tu annaka tabhath an makhtuta. sifhaa lii.`,
        },
        playerResponse: {
          correctArabic: 'هِيَ مَخطوطَةٌ قَديمَة مَكتوبَة بِالخَطِّ الكوفي',
          correctEnglish: 'It is an old manuscript written in Kufic script',
          wordBank: ['هِيَ', 'مَخطوطَةٌ', 'قَديمَة', 'مَكتوبَة', 'بِالخَطِّ', 'الكوفي', 'جَديدَة', 'بِالحِبر', 'النَّسخي'],
          grammarHint: 'مَكتوبَة (written, feminine passive participle) + بِ (in/with) + al-khatt al-kuufi.',
        },
      },
      {
        npcLine: {
          arabic: 'مُثير! ما مَوضوعُها؟',
          english: 'Interesting! What is its subject?',
          transliteration: `muthiir! maa mawduu'uhaa?`,
        },
        playerResponse: {
          correctArabic: 'تَتَحَدَّثُ عَن عِلمِ الفَلَك عِندَ العَرَب',
          correctEnglish: 'It talks about astronomy among the Arabs',
          wordBank: ['تَتَحَدَّثُ', 'عَن', 'عِلمِ', 'الفَلَك', 'عِندَ', 'العَرَب', 'الطِّبِّ', 'في', 'اليونان'],
          grammarHint: 'تَتَحَدَّثُ (it speaks, feminine Form V) + عَن + idafa construction.',
        },
      },
      {
        npcLine: {
          arabic: 'أَعرِفُ هَذِهِ المَخطوطَة! تَحتاجُ إذنًا خاصًّا.',
          english: 'I know this manuscript! You need special permission.',
          transliteration: `a'rifu haadhihi al-makhtuta! tahtaaju idhnan khaassan.`,
        },
        playerResponse: {
          correctArabic: 'كَيفَ أَحصُلُ عَلى الإذن',
          correctEnglish: 'How do I get the permission?',
          wordBank: ['كَيفَ', 'أَحصُلُ', 'عَلى', 'الإذن', 'أَجِدُ', 'في', 'المَخطوطَة', 'أَطلُبُ'],
          grammarHint: 'كَيفَ (how) + أَحصُلُ على (I obtain) + الإذن (the permission).',
        },
      },
    ],
    vocabularyUsed: ['makhtuta', 'qadima', 'ilm', 'falak', 'idhn'],
    xpReward: 100,
  },

  // AL-5: Thanking a Scholar (B2)
  {
    id: 'library_thanks_005',
    zone: 'ancient-library',
    topic: 'gratitude',
    cefrLevel: 'B2',
    title: 'Thanking a Scholar',
    titleArabic: 'شُكر عالِم',
    context: 'After an enlightening lesson, you express deep gratitude to Scribe Amina.',
    contextArabic: 'بَعدَ دَرسٍ مُنير، تُعَبِّرُ عَن اِمتِنانٍ عَميقٍ لِلكاتِبَة أَمينَة.',
    npcName: 'Scribe Amina',
    npcPortrait: 'portrait-scribe-amina',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَرجو أَن يَكونَ الدَّرسُ مُفيدًا لَكَ.',
          english: 'I hope the lesson was useful to you.',
          transliteration: `arju an yakuuna ad-darsu mufiidan laka.`,
        },
        playerResponse: {
          correctArabic: 'كانَ الدَّرسُ مُفيدًا جِدًّا وَأَنا مُمتَنٌّ لَكِ',
          correctEnglish: 'The lesson was very useful and I am grateful to you',
          wordBank: ['كانَ', 'الدَّرسُ', 'مُفيدًا', 'جِدًّا', 'وَأَنا', 'مُمتَنٌّ', 'لَكِ', 'سَيِّئًا', 'غاضِب', 'قَليلًا'],
          grammarHint: 'كانَ + subject + predicate (accusative): الدَّرسُ مُفيدًا. مُمتَنٌّ لَكِ (grateful to you, feminine).',
        },
      },
      {
        npcLine: {
          arabic: 'يُسعِدُني ذَلِك. العِلمُ أَمانَة.',
          english: 'That makes me happy. Knowledge is a trust.',
          transliteration: `yus'idunii dhaalik. al-ilmu amaana.`,
        },
        playerResponse: {
          correctArabic: 'تَعَلَّمتُ مِنكِ أَنَّ الصَّبرَ والمُثابَرَة أَساسُ التَّعَلُّم',
          correctEnglish: 'I learned from you that patience and perseverance are the foundation of learning',
          wordBank: ['تَعَلَّمتُ', 'مِنكِ', 'أَنَّ', 'الصَّبرَ', 'والمُثابَرَة', 'أَساسُ', 'التَّعَلُّم', 'عَنكِ', 'الكَسَل', 'نِهايَة'],
          grammarHint: 'أَنَّ (that, inna-sister) takes accusative: الصَّبرَ + والمُثابَرَة, then أَساسُ (foundation, predicate nominative).',
        },
      },
      {
        npcLine: {
          arabic: 'كَلامُكَ يُدفِئُ قَلبي. وَفَّقَكَ الله.',
          english: 'Your words warm my heart. May God grant you success.',
          transliteration: `kalaamuka yudfi'u qalbii. waffaqaka allaah.`,
        },
        playerResponse: {
          correctArabic: 'جَزاكِ اللهُ خَيرًا يا أُستاذَة',
          correctEnglish: 'May God reward you with goodness, teacher',
          wordBank: ['جَزاكِ', 'اللهُ', 'خَيرًا', 'يا', 'أُستاذَة', 'شَرًّا', 'سَيِّدَة', 'شُكْرًا'],
          grammarHint: 'جَزاكِ اللهُ خَيرًا (May God reward you well) — a deeply respectful Islamic expression of gratitude.',
        },
      },
    ],
    vocabularyUsed: ['dars', 'ilm', 'sabr', 'shukran', 'jazaak_allah'],
    xpReward: 150,
  },

  // ============================================================
  // DESERT MARKETPLACE (5 scenarios)
  // ============================================================

  // DM-1: Negotiating Prices (A1)
  {
    id: 'market_price_001',
    zone: 'desert-marketplace',
    topic: 'shopping',
    cefrLevel: 'A1',
    title: 'Negotiating Prices',
    titleArabic: 'المُساوَمَة عَلى الأَسعار',
    context: 'Spice Seller Layla shows you colorful spices. Time to haggle!',
    contextArabic: 'بائِعَة التَّوابِل لَيلى تُريكَ تَوابِلَ مُلَوَّنَة. حانَ وَقتُ المُساوَمَة!',
    npcName: 'Spice Seller Layla',
    npcPortrait: 'portrait-spice-seller-layla',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَهْلًا! هَل تُريدُ تَوابِل؟',
          english: 'Welcome! Do you want spices?',
          transliteration: `ahlan! hal turiidu tawaabil?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم كَم السِّعر',
          correctEnglish: 'Yes, how much is the price?',
          wordBank: ['نَعَم', 'كَم', 'السِّعر', 'لا', 'هَذا', 'ماذا'],
          grammarHint: 'كَم (how much) + السِّعر (the price) is the basic haggling phrase.',
        },
      },
      {
        npcLine: {
          arabic: 'هَذا الزَّعفَران بِعَشَرَة دَراهِم.',
          english: 'This saffron is ten dirhams.',
          transliteration: `haadha az-za'faraan bi-asharati daraahim.`,
        },
        playerResponse: {
          correctArabic: 'هَذا غالٍ جِدًّا',
          correctEnglish: 'This is very expensive',
          wordBank: ['هَذا', 'غالٍ', 'جِدًّا', 'رَخيص', 'جَميل', 'كَثير'],
          grammarHint: 'غالٍ (expensive, diptote) — used to start negotiation.',
        },
      },
      {
        npcLine: {
          arabic: 'طَيِّب، بِسَبعَة دَراهِم لَكَ.',
          english: 'Okay, seven dirhams for you.',
          transliteration: `tayyib, bi-sab'ati daraahim laka.`,
        },
        playerResponse: {
          correctArabic: 'خَمسَة وَاتَّفَقنا',
          correctEnglish: 'Five and we have a deal',
          wordBank: ['خَمسَة', 'وَاتَّفَقنا', 'سِتَّة', 'وَشُكْرًا', 'ثَلاثَة'],
          grammarHint: 'Number + وَاتَّفَقنا (and we agreed) is a classic market phrase.',
        },
      },
    ],
    vocabularyUsed: ['si_r', 'ghaali', 'rakhiis', 'kam', 'darahim'],
    xpReward: 50,
  },

  // DM-2: Asking About Products (A1)
  {
    id: 'market_products_002',
    zone: 'desert-marketplace',
    topic: 'shopping',
    cefrLevel: 'A1',
    title: 'Asking About Products',
    titleArabic: 'السُّؤال عَنِ البَضائِع',
    context: 'Trader Hassan displays rugs and textiles. You want to know more.',
    contextArabic: 'التّاجِر حَسَن يَعرِضُ سَجّادًا وَأَقمِشَة. تُريدُ أَن تَعرِفَ المَزيد.',
    npcName: 'Trader Hassan',
    npcPortrait: 'portrait-trader-hassan',
    exchanges: [
      {
        npcLine: {
          arabic: 'تَفَضَّل! عِندي سَجّاد جَميل.',
          english: 'Come in! I have beautiful carpets.',
          transliteration: `tafaddal! indii sajjaad jamiil.`,
        },
        playerResponse: {
          correctArabic: 'ما هَذا السَّجّاد',
          correctEnglish: 'What is this carpet?',
          wordBank: ['ما', 'هَذا', 'السَّجّاد', 'كَيفَ', 'ذَلِكَ', 'القُماش'],
          grammarHint: 'ما (what) + هَذا (this) + definite noun for asking about items.',
        },
      },
      {
        npcLine: {
          arabic: 'هَذا سَجّادٌ مِن فارِس. مَصنوعٌ مِنَ الحَرير.',
          english: 'This is a carpet from Persia. Made of silk.',
          transliteration: `haadha sajjaadun min faaris. masnu'un min al-hariir.`,
        },
        playerResponse: {
          correctArabic: 'هَل عِندَكَ أَلوان أُخرى',
          correctEnglish: 'Do you have other colors?',
          wordBank: ['هَل', 'عِندَكَ', 'أَلوان', 'أُخرى', 'أَحجام', 'كَم', 'كَبير'],
          grammarHint: 'هَل عِندَكَ (do you have) + plural noun + adjective.',
        },
      },
      {
        npcLine: {
          arabic: 'طَبعًا! أَحمَر وَأَزرَق وَأَخضَر.',
          english: 'Of course! Red, blue, and green.',
          transliteration: `tab'an! ahmar wa-azraq wa-akhdar.`,
        },
        playerResponse: {
          correctArabic: 'أُريدُ الأَزرَق مِن فَضلِكَ',
          correctEnglish: 'I want the blue one please',
          wordBank: ['أُريدُ', 'الأَزرَق', 'مِن', 'فَضلِكَ', 'الأَحمَر', 'بِدون', 'شُكْرًا'],
          grammarHint: 'Colors used as nouns with ال: الأَزرَق (the blue one).',
        },
      },
    ],
    vocabularyUsed: ['sajjaad', 'lawn', 'azraq', 'ahmar', 'uriidu'],
    xpReward: 50,
  },

  // DM-3: Ordering Food (A2)
  {
    id: 'market_food_003',
    zone: 'desert-marketplace',
    topic: 'food',
    cefrLevel: 'A2',
    title: 'Ordering Food',
    titleArabic: 'طَلَب الطَّعام',
    context: 'You find a food stall in the marketplace and want to order a meal.',
    contextArabic: 'تَجِدُ كُشكًا لِلطَّعامِ في السّوق وَتُريدُ أَن تَطلُبَ وَجبَة.',
    npcName: 'Wanderer Ali',
    npcPortrait: 'portrait-wanderer-ali',
    exchanges: [
      {
        npcLine: {
          arabic: 'مَرْحَبًا! عِندَنا فَلافِل وَحُمُّص وَفول.',
          english: 'Hello! We have falafel, hummus, and fava beans.',
          transliteration: `marhaban! indanaa falaafil wa-hummus wa-fuul.`,
        },
        playerResponse: {
          correctArabic: 'أُريدُ فَلافِل وَحُمُّص مِن فَضلِكَ',
          correctEnglish: 'I want falafel and hummus please',
          wordBank: ['أُريدُ', 'فَلافِل', 'وَحُمُّص', 'مِن', 'فَضلِكَ', 'فول', 'بِدون', 'وَخُبز'],
          grammarHint: 'أُريدُ + food items connected by وَ + مِن فَضلِكَ for politeness.',
        },
      },
      {
        npcLine: {
          arabic: 'خِيار مُمتاز! هَل تُريدُ خُبزًا أَيضًا؟',
          english: 'Excellent choice! Do you want bread too?',
          transliteration: `khiyaar mumtaaz! hal turiidu khubzan aydan?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم وَكوبَ شاي أَيضًا',
          correctEnglish: 'Yes, and a cup of tea too',
          wordBank: ['نَعَم', 'وَكوبَ', 'شاي', 'أَيضًا', 'قَهوَة', 'بِدون', 'لا'],
          grammarHint: 'وَكوبَ (and a cup of, accusative) + شاي (tea) — idafa in accusative.',
        },
      },
      {
        npcLine: {
          arabic: 'تَفَضَّل! بِالعافِيَة!',
          english: 'Here you go! Bon appetit!',
          transliteration: `tafaddal! bil-aafiya!`,
        },
        playerResponse: {
          correctArabic: 'الله يُعافيكَ شُكْرًا',
          correctEnglish: 'God bless you, thank you',
          wordBank: ['الله', 'يُعافيكَ', 'شُكْرًا', 'يَحفَظُكَ', 'جَزيلًا', 'مَعَ'],
          grammarHint: 'الله يُعافيكَ is the traditional response to بِالعافِيَة.',
        },
      },
    ],
    vocabularyUsed: ['falaafil', 'hummus', 'khubz', 'shaay', 'uriidu'],
    xpReward: 75,
  },

  // DM-4: Giving Directions (B1)
  {
    id: 'market_directions_004',
    zone: 'desert-marketplace',
    topic: 'directions',
    cefrLevel: 'B1',
    title: 'Giving Directions',
    titleArabic: 'إعطاء الاِتِّجاهات',
    context: 'A lost traveler asks you how to find the spice market within the marketplace.',
    contextArabic: 'مُسافِرٌ تائِهٌ يَسأَلُكَ كَيفَ يَجِدُ سوقَ التَّوابِل.',
    npcName: 'Carpet Seller Jamal',
    npcPortrait: 'portrait-carpet-seller-jamal',
    exchanges: [
      {
        npcLine: {
          arabic: 'عَفوًا! أَينَ سوقُ التَّوابِل؟ أَنا تائِه.',
          english: 'Excuse me! Where is the spice market? I am lost.',
          transliteration: `afwan! ayna suuqu at-tawaabil? ana taa'ih.`,
        },
        playerResponse: {
          correctArabic: 'اِمشِ إلى الأَمامِ ثُمَّ اِنعَطِف يَمينًا',
          correctEnglish: 'Walk forward then turn right',
          wordBank: ['اِمشِ', 'إلى', 'الأَمامِ', 'ثُمَّ', 'اِنعَطِف', 'يَمينًا', 'يَسارًا', 'اِرجِع', 'الوَراء'],
          grammarHint: 'Imperative اِمشِ (walk!) + direction. ثُمَّ (then) connects two instructions.',
        },
      },
      {
        npcLine: {
          arabic: 'وَبَعدَ ذَلِك؟',
          english: 'And after that?',
          transliteration: `wa-ba'da dhaalik?`,
        },
        playerResponse: {
          correctArabic: 'سَتَرى بابًا كَبيرًا عَلى يَسارِكَ',
          correctEnglish: 'You will see a big door on your left',
          wordBank: ['سَتَرى', 'بابًا', 'كَبيرًا', 'عَلى', 'يَسارِكَ', 'صَغيرًا', 'يَمينِكَ', 'أَمامَكَ'],
          grammarHint: 'سَ + تَرى (you will see) + indefinite accusative noun + adjective.',
        },
      },
      {
        npcLine: {
          arabic: 'شُكْرًا جَزيلًا! جَزاكَ اللهُ خَيرًا.',
          english: 'Thank you very much! May God reward you.',
          transliteration: `shukran jaziilan! jazaaka allaahu khayran.`,
        },
        playerResponse: {
          correctArabic: 'عَفوًا بِالتَّوفيق في طَريقِكَ',
          correctEnglish: 'You are welcome, good luck on your way',
          wordBank: ['عَفوًا', 'بِالتَّوفيق', 'في', 'طَريقِكَ', 'شُكْرًا', 'مَعَ', 'رِحلَتِكَ'],
          grammarHint: 'عَفوًا (you are welcome) + بِالتَّوفيق (with success) + في طَريقِكَ (on your way).',
        },
      },
    ],
    vocabularyUsed: ['imshi', 'yamiin', 'yasaar', 'amaam', 'baab'],
    xpReward: 100,
  },

  // DM-5: Describing Quantities (B2)
  {
    id: 'market_quantities_005',
    zone: 'desert-marketplace',
    topic: 'quantities',
    cefrLevel: 'B2',
    title: 'Describing Quantities',
    titleArabic: 'وَصف الكَمِّيّات',
    context: 'You are buying supplies for a long journey and need precise quantities.',
    contextArabic: 'تَشتَري مُؤَنًا لِرِحلَةٍ طَويلَة وَتَحتاجُ كَمِّيّاتٍ دَقيقَة.',
    npcName: 'Weaver Zahra',
    npcPortrait: 'portrait-weaver-zahra',
    exchanges: [
      {
        npcLine: {
          arabic: 'ماذا تَحتاجُ لِرِحلَتِكَ؟',
          english: 'What do you need for your journey?',
          transliteration: `maadha tahtaaju li-rihlatika?`,
        },
        playerResponse: {
          correctArabic: 'أَحتاجُ ثَلاثَةَ كيلوغرامات مِنَ التَّمر',
          correctEnglish: 'I need three kilograms of dates',
          wordBank: ['أَحتاجُ', 'ثَلاثَةَ', 'كيلوغرامات', 'مِنَ', 'التَّمر', 'أَربَعَة', 'الأَرُزّ', 'في'],
          grammarHint: 'Numbers 3-10 take plural genitive: ثَلاثَةَ كيلوغرامات (three kilograms).',
        },
      },
      {
        npcLine: {
          arabic: 'عِندي تَمرٌ مِن المَدينَة. هَل تُريدُ شَيئًا آخَر؟',
          english: 'I have dates from Medina. Do you want anything else?',
          transliteration: `indii tamrun min al-madiina. hal turiidu shay'an aakhar?`,
        },
        playerResponse: {
          correctArabic: 'أَحتاجُ أَيضًا نِصفَ كيلو مِنَ القَهوَة وَرُبعَ كيلو مِنَ الهِيل',
          correctEnglish: 'I also need half a kilo of coffee and a quarter kilo of cardamom',
          wordBank: ['أَحتاجُ', 'أَيضًا', 'نِصفَ', 'كيلو', 'مِنَ', 'القَهوَة', 'وَرُبعَ', 'كيلو', 'مِنَ', 'الهِيل', 'ثُلُثَ', 'الشّاي', 'السُّكَّر'],
          grammarHint: 'Fractions: نِصفَ (half), رُبعَ (quarter) + كيلو + مِنَ (of) + item.',
        },
      },
      {
        npcLine: {
          arabic: 'مُمتاز! كُلُّ ذَلِكَ بِعِشرينَ دِرهَمًا. هَل تُوافِق؟',
          english: 'Excellent! All of that for twenty dirhams. Do you agree?',
          transliteration: `mumtaaz! kullu dhaalika bi-ishriina dirhaman. hal tuwaafiq?`,
        },
        playerResponse: {
          correctArabic: 'لَو سَمَحتِ خَمسَةَ عَشَرَ دِرهَمًا وَأَشتَري الكُلّ',
          correctEnglish: 'If you please, fifteen dirhams and I will buy everything',
          wordBank: ['لَو', 'سَمَحتِ', 'خَمسَةَ', 'عَشَرَ', 'دِرهَمًا', 'وَأَشتَري', 'الكُلّ', 'عِشرينَ', 'تَلاتَة', 'نِصف'],
          grammarHint: 'خَمسَةَ عَشَرَ (15, indeclinable) + تَمييز singular accusative: دِرهَمًا.',
        },
      },
    ],
    vocabularyUsed: ['tamr', 'qahwa', 'hiil', 'nisf', 'rub'],
    xpReward: 150,
  },

  // ============================================================
  // BEDOUIN CAMP (5 scenarios)
  // ============================================================

  // BC-1: Accepting Hospitality (A1)
  {
    id: 'bedouin_hospitality_001',
    zone: 'bedouin-camp',
    topic: 'hospitality',
    cefrLevel: 'A1',
    title: 'Accepting Hospitality',
    titleArabic: 'قَبول الضِّيافَة',
    context: 'You arrive at the Bedouin camp and are warmly welcomed with food and drink.',
    contextArabic: 'تَصِلُ إلى مُخَيَّمِ البَدو وَيُرَحَّبُ بِكَ بِالطَّعامِ والشَّراب.',
    npcName: 'Elder Tariq',
    npcPortrait: 'portrait-elder-tariq',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَهْلًا وَسَهْلًا! أَنتَ ضَيفُنا.',
          english: 'Welcome! You are our guest.',
          transliteration: `ahlan wa-sahlan! anta dayfunaa.`,
        },
        playerResponse: {
          correctArabic: 'شُكْرًا لِكَرَمِكُم',
          correctEnglish: 'Thank you for your generosity',
          wordBank: ['شُكْرًا', 'لِكَرَمِكُم', 'مَعَ', 'أَهْلًا', 'جَزيلًا', 'لِطَعامِكُم'],
          grammarHint: 'شُكْرًا لِ (thank you for) + كَرَمِكُم (your generosity, plural possessive).',
        },
      },
      {
        npcLine: {
          arabic: 'تَفَضَّل اِشرَب قَهوَة.',
          english: 'Please, drink some coffee.',
          transliteration: `tafaddal ishrab qahwa.`,
        },
        playerResponse: {
          correctArabic: 'نَعَم بِكُلِّ سُرور',
          correctEnglish: 'Yes, with all pleasure',
          wordBank: ['نَعَم', 'بِكُلِّ', 'سُرور', 'لا', 'شُكْرًا', 'بِدون'],
          grammarHint: 'بِكُلِّ سُرور (with all pleasure) — a gracious acceptance.',
        },
      },
      {
        npcLine: {
          arabic: 'هَل تُحِبُّ التَّمر مَعَ القَهوَة؟',
          english: 'Do you like dates with coffee?',
          transliteration: `hal tuhibbu at-tamr ma'a al-qahwa?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم أُحِبُّ التَّمر',
          correctEnglish: 'Yes, I like dates',
          wordBank: ['نَعَم', 'أُحِبُّ', 'التَّمر', 'لا', 'أَكرَهُ', 'القَهوَة'],
          grammarHint: 'أُحِبُّ (I love/like) + definite noun: التَّمر (dates).',
        },
      },
    ],
    vocabularyUsed: ['ahlan', 'shukran', 'qahwa', 'tamr', 'dayf'],
    xpReward: 50,
  },

  // BC-2: Talking About Weather (A1)
  {
    id: 'bedouin_weather_002',
    zone: 'bedouin-camp',
    topic: 'weather',
    cefrLevel: 'A1',
    title: 'Talking About Weather',
    titleArabic: 'الحَديث عَنِ الطَّقس',
    context: 'You discuss the desert weather with a Bedouin elder around the campfire.',
    contextArabic: 'تَتَحَدَّثُ عَنِ طَقسِ الصَّحراءِ مَعَ شَيخِ البَدوِ حَولَ النّار.',
    npcName: 'Elder Tariq',
    npcPortrait: 'portrait-elder-tariq',
    exchanges: [
      {
        npcLine: {
          arabic: 'الجَوُّ حارٌّ اليَوم!',
          english: 'The weather is hot today!',
          transliteration: `al-jawwu haarrun al-yawm!`,
        },
        playerResponse: {
          correctArabic: 'نَعَم الشَّمسُ قَوِيَّة',
          correctEnglish: 'Yes, the sun is strong',
          wordBank: ['نَعَم', 'الشَّمسُ', 'قَوِيَّة', 'لا', 'القَمَرُ', 'ضَعيفَة'],
          grammarHint: 'الشَّمسُ (the sun, feminine) + قَوِيَّة (strong, feminine adjective).',
        },
      },
      {
        npcLine: {
          arabic: 'لَكِن في اللَّيلِ الجَوُّ بارِد.',
          english: 'But at night the weather is cold.',
          transliteration: `laakin fii al-layl al-jawwu baarid.`,
        },
        playerResponse: {
          correctArabic: 'هَل اللَّيلُ بارِد جِدًّا',
          correctEnglish: 'Is the night very cold?',
          wordBank: ['هَل', 'اللَّيلُ', 'بارِد', 'جِدًّا', 'النَّهارُ', 'حارٌّ', 'قَليلًا'],
          grammarHint: 'هَل + subject + predicate for yes/no questions. جِدًّا (very) intensifies.',
        },
      },
      {
        npcLine: {
          arabic: 'أَحيانًا! لِذَلِكَ نَحتاجُ النّار.',
          english: 'Sometimes! That is why we need the fire.',
          transliteration: `ahyaanan! li-dhaalika nahtaaju an-naar.`,
        },
        playerResponse: {
          correctArabic: 'النّارُ جَميلَة وَدافِئَة',
          correctEnglish: 'The fire is beautiful and warm',
          wordBank: ['النّارُ', 'جَميلَة', 'وَدافِئَة', 'كَبيرَة', 'وَبارِدَة', 'الشَّمسُ'],
          grammarHint: 'النّارُ (fire, feminine) + two feminine adjectives connected by وَ.',
        },
      },
    ],
    vocabularyUsed: ['jaww', 'haar', 'baarid', 'shams', 'layl'],
    xpReward: 50,
  },

  // BC-3: Sharing Stories (A2)
  {
    id: 'bedouin_stories_003',
    zone: 'bedouin-camp',
    topic: 'storytelling',
    cefrLevel: 'A2',
    title: 'Sharing Stories',
    titleArabic: 'مُشارَكَة القِصَص',
    context: 'Around the campfire, you share stories with the Bedouin.',
    contextArabic: 'حَولَ النّارِ تُشارِكُ القِصَصَ مَعَ البَدو.',
    npcName: 'Storyteller Noor',
    npcPortrait: 'portrait-storyteller-noor',
    exchanges: [
      {
        npcLine: {
          arabic: 'هَل عِندَكَ قِصَّة تُريدُ أَن تُشارِكَها مَعَنا؟',
          english: 'Do you have a story you want to share with us?',
          transliteration: `hal indaka qissa turiidu an tushaarikahaa ma'anaa?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم عِندي قِصَّة عَن رِحلَتي',
          correctEnglish: 'Yes, I have a story about my journey',
          wordBank: ['نَعَم', 'عِندي', 'قِصَّة', 'عَن', 'رِحلَتي', 'لا', 'حِكايَة', 'بَيتي'],
          grammarHint: 'عِندي (I have) + قِصَّة (a story) + عَن (about) + رِحلَتي (my journey).',
        },
      },
      {
        npcLine: {
          arabic: 'تَفَضَّل! نَحنُ نَسمَعُ.',
          english: 'Go ahead! We are listening.',
          transliteration: `tafaddal! nahnu nasma'u.`,
        },
        playerResponse: {
          correctArabic: 'سافَرتُ مِن بَعيدٍ لِأَتَعَلَّمَ العَرَبِيَّة',
          correctEnglish: 'I traveled from far away to learn Arabic',
          wordBank: ['سافَرتُ', 'مِن', 'بَعيدٍ', 'لِأَتَعَلَّمَ', 'العَرَبِيَّة', 'قَريبٍ', 'لِأَدرُسَ', 'الإنجليزيَّة'],
          grammarHint: 'سافَرتُ (I traveled, past) + لِ + subjunctive: لِأَتَعَلَّمَ (in order to learn).',
        },
      },
      {
        npcLine: {
          arabic: 'ما شاءَ الله! وَماذا تَعَلَّمتَ حَتّى الآن؟',
          english: 'Wonderful! And what have you learned so far?',
          transliteration: `maa shaa'allaah! wa-maadha ta'allamta hattaa al-aan?`,
        },
        playerResponse: {
          correctArabic: 'تَعَلَّمتُ كَلِماتٍ كَثيرَة وَقابَلتُ أَصدِقاءَ جُدُدًا',
          correctEnglish: 'I learned many words and met new friends',
          wordBank: ['تَعَلَّمتُ', 'كَلِماتٍ', 'كَثيرَة', 'وَقابَلتُ', 'أَصدِقاءَ', 'جُدُدًا', 'قَليلَة', 'أَعداءً', 'قُدامى'],
          grammarHint: 'Past tense + indefinite accusative plurals: كَلِماتٍ كَثيرَة, أَصدِقاءَ جُدُدًا.',
        },
      },
    ],
    vocabularyUsed: ['qissa', 'rihla', 'saafart', 'kalimaat', 'asdiqa'],
    xpReward: 75,
  },

  // BC-4: Asking About Traditions (B1)
  {
    id: 'bedouin_traditions_004',
    zone: 'bedouin-camp',
    topic: 'traditions',
    cefrLevel: 'B1',
    title: 'Asking About Traditions',
    titleArabic: 'السُّؤال عَنِ التَّقاليد',
    context: 'You learn about Bedouin customs and traditions from an elder.',
    contextArabic: 'تَتَعَلَّمُ عَن عاداتِ البَدو وَتَقاليدِهِم مِن شَيخٍ كَبير.',
    npcName: 'Elder Tariq',
    npcPortrait: 'portrait-elder-tariq',
    exchanges: [
      {
        npcLine: {
          arabic: 'عادَاتُنا قَديمَة وَنَحنُ فَخورونَ بِها.',
          english: 'Our customs are ancient and we are proud of them.',
          transliteration: `aadaatunaa qadiima wa-nahnu fakhuuruuna bihaa.`,
        },
        playerResponse: {
          correctArabic: 'ما هِيَ أَهَمُّ عادَة عِندَكُم',
          correctEnglish: 'What is the most important custom you have?',
          wordBank: ['ما', 'هِيَ', 'أَهَمُّ', 'عادَة', 'عِندَكُم', 'أَغرَبُ', 'تَقليد', 'عِندَنا'],
          grammarHint: 'ما هِيَ (what is, feminine) + أَهَمُّ (most important, superlative) + عادَة.',
        },
      },
      {
        npcLine: {
          arabic: 'الضِّيافَة. الضَّيفُ عِندَنا مُقَدَّس.',
          english: 'Hospitality. The guest is sacred to us.',
          transliteration: `ad-diyaafa. ad-dayfu indanaa muqaddas.`,
        },
        playerResponse: {
          correctArabic: 'هَذا تَقليدٌ جَميل أُريدُ أَن أَفهَمَ أَكثَر',
          correctEnglish: 'This is a beautiful tradition, I want to understand more',
          wordBank: ['هَذا', 'تَقليدٌ', 'جَميل', 'أُريدُ', 'أَن', 'أَفهَمَ', 'أَكثَر', 'غَريب', 'أَنسى', 'أَقَلّ'],
          grammarHint: 'هَذا + indefinite noun + adjective. أُريدُ أَن + subjunctive.',
        },
      },
      {
        npcLine: {
          arabic: 'نُكرِمُ الضَّيفَ ثَلاثَةَ أَيّام بِالطَّعامِ والشَّراب.',
          english: 'We honor the guest for three days with food and drink.',
          transliteration: `nukrimu ad-dayfa thalaathata ayyaam bit-ta'aam wash-sharaab.`,
        },
        playerResponse: {
          correctArabic: 'ثَلاثَةُ أَيّام هَذا كَرَمٌ عَظيم',
          correctEnglish: 'Three days — this is great generosity',
          wordBank: ['ثَلاثَةُ', 'أَيّام', 'هَذا', 'كَرَمٌ', 'عَظيم', 'يَومان', 'بُخلٌ', 'صَغير'],
          grammarHint: 'ثَلاثَةُ أَيّام (three days) + هَذا كَرَمٌ عَظيم (this is great generosity).',
        },
      },
    ],
    vocabularyUsed: ['aadaat', 'taqaliid', 'diyaafa', 'dayf', 'karam'],
    xpReward: 100,
  },

  // BC-5: Describing the Desert (B2)
  {
    id: 'bedouin_desert_005',
    zone: 'bedouin-camp',
    topic: 'description',
    cefrLevel: 'B2',
    title: 'Describing the Desert',
    titleArabic: 'وَصف الصَّحراء',
    context: 'You reflect on the beauty and harshness of the desert with a Bedouin elder.',
    contextArabic: 'تَتَأَمَّلُ في جَمالِ الصَّحراءِ وَقَسوَتِها مَعَ شَيخِ البَدو.',
    npcName: 'Elder Tariq',
    npcPortrait: 'portrait-elder-tariq',
    exchanges: [
      {
        npcLine: {
          arabic: 'الصَّحراءُ مُعَلِّمَة. ماذا عَلَّمَتكَ؟',
          english: 'The desert is a teacher. What has she taught you?',
          transliteration: `as-sahraa'u mu'allima. maadha allamatka?`,
        },
        playerResponse: {
          correctArabic: 'عَلَّمَتني أَنَّ الصَّمتَ لُغَةٌ والرِّمالَ حِكايَة',
          correctEnglish: 'She taught me that silence is a language and the sands are a story',
          wordBank: ['عَلَّمَتني', 'أَنَّ', 'الصَّمتَ', 'لُغَةٌ', 'والرِّمالَ', 'حِكايَة', 'الصَّوتَ', 'سِرٌّ', 'والجِبالَ'],
          grammarHint: 'أَنَّ (that) governs two clauses: الصَّمتَ لُغَةٌ (silence is a language) + والرِّمالَ حِكايَة.',
        },
      },
      {
        npcLine: {
          arabic: 'كَلامٌ جَميل! الصَّحراءُ تَختَبِرُ الرِّجال.',
          english: 'Beautiful words! The desert tests men.',
          transliteration: `kalaam jamiil! as-sahraa'u takhtabiru ar-rijaal.`,
        },
        playerResponse: {
          correctArabic: 'مَن يَصبِرُ عَلى حَرِّها يَكتَشِفُ أَسرارَها',
          correctEnglish: 'Whoever endures her heat discovers her secrets',
          wordBank: ['مَن', 'يَصبِرُ', 'عَلى', 'حَرِّها', 'يَكتَشِفُ', 'أَسرارَها', 'يَهرُبُ', 'بَردِها', 'يَفقِدُ'],
          grammarHint: 'مَن (whoever, conditional) + present verb + present verb = conditional sentence.',
        },
      },
      {
        npcLine: {
          arabic: 'أَنتَ تَفهَمُ رُوحَ الصَّحراء. هَل سَتَعود؟',
          english: 'You understand the spirit of the desert. Will you return?',
          transliteration: `anta tafhamu ruuha as-sahraa'. hal sata'uud?`,
        },
        playerResponse: {
          correctArabic: 'سَأَعودُ حَتمًا فَالصَّحراءُ صارَت جُزءًا مِنّي',
          correctEnglish: 'I will definitely return, for the desert has become part of me',
          wordBank: ['سَأَعودُ', 'حَتمًا', 'فَالصَّحراءُ', 'صارَت', 'جُزءًا', 'مِنّي', 'رُبَّما', 'فَالمَدينَة', 'لَيسَت', 'عَنّي'],
          grammarHint: 'فَ (for/because) + صارَت (became, sister of kaana) + جُزءًا (part, accusative predicate).',
        },
      },
    ],
    vocabularyUsed: ['sahraa', 'samt', 'rimaal', 'sabr', 'asraar'],
    xpReward: 150,
  },

  // ============================================================
  // ROYAL PALACE (5 scenarios)
  // ============================================================

  // RP-1: Formal Greetings (A1)
  {
    id: 'palace_greeting_001',
    zone: 'royal-palace',
    topic: 'greeting',
    cefrLevel: 'A1',
    title: 'Formal Greetings',
    titleArabic: 'تَحِيّات رَسمِيَّة',
    context: 'You enter the royal palace and are greeted by Vizier Abbas.',
    contextArabic: 'تَدخُلُ القَصرَ المَلَكي وَيُحَيِّيكَ الوَزير عَبّاس.',
    npcName: 'Vizier Abbas',
    npcPortrait: 'portrait-vizier-abbas',
    exchanges: [
      {
        npcLine: {
          arabic: 'السَّلامُ عَلَيْكُم وَرَحمَةُ اللهِ وَبَرَكاتُه.',
          english: 'Peace, mercy, and blessings of God be upon you.',
          transliteration: `as-salaamu alaykum wa-rahmatu allaahi wa-barakaatuh.`,
        },
        playerResponse: {
          correctArabic: 'وَعَلَيْكُمُ السَّلامُ وَرَحمَةُ اللهِ',
          correctEnglish: 'And upon you peace and the mercy of God',
          wordBank: ['وَعَلَيْكُمُ', 'السَّلامُ', 'وَرَحمَةُ', 'اللهِ', 'مَعَ', 'صَباح', 'الخَير'],
          grammarHint: 'The full formal response mirrors the greeting — repeat back with وَ prefix.',
        },
      },
      {
        npcLine: {
          arabic: 'مَرْحَبًا بِكَ في القَصر. ما اسمُكَ؟',
          english: 'Welcome to the palace. What is your name?',
          transliteration: `marhaban bika fii al-qasr. maa ismuka?`,
        },
        playerResponse: {
          correctArabic: 'اِسمي طالِب يا سَيِّدي',
          correctEnglish: 'My name is Talib, my lord',
          wordBank: ['اِسمي', 'طالِب', 'يا', 'سَيِّدي', 'أَنا', 'أَخي', 'صَديقي'],
          grammarHint: 'يا سَيِّدي (O my lord) shows respect in a palace setting.',
        },
      },
      {
        npcLine: {
          arabic: 'أَهْلًا يا طالِب. أَتَمَنّى لَكَ إقامَةً طَيِّبَة.',
          english: 'Welcome, Talib. I wish you a pleasant stay.',
          transliteration: `ahlan yaa taalib. atamanna laka iqaamatan tayyiba.`,
        },
        playerResponse: {
          correctArabic: 'بارَكَ اللهُ فيكَ',
          correctEnglish: 'May God bless you',
          wordBank: ['بارَكَ', 'اللهُ', 'فيكَ', 'شُكْرًا', 'مَعَكَ', 'حَفِظَ'],
          grammarHint: 'بارَكَ اللهُ فيكَ (May God bless you) — formal/elevated gratitude.',
        },
      },
    ],
    vocabularyUsed: ['salaam', 'rahma', 'qasr', 'sayyid', 'baaraka'],
    xpReward: 50,
  },

  // RP-2: Requesting Audience (A1)
  {
    id: 'palace_audience_002',
    zone: 'royal-palace',
    topic: 'requesting',
    cefrLevel: 'A1',
    title: 'Requesting an Audience',
    titleArabic: 'طَلَب مُقابَلَة',
    context: 'You wish to see Princess Aisha and must ask the Vizier for permission.',
    contextArabic: 'تَرغَبُ في رُؤيَةِ الأَميرَة عائِشَة وَيَجِبُ أَن تَطلُبَ الإذنَ مِنَ الوَزير.',
    npcName: 'Vizier Abbas',
    npcPortrait: 'portrait-vizier-abbas',
    exchanges: [
      {
        npcLine: {
          arabic: 'كَيفَ أُساعِدُكَ يا طالِب؟',
          english: 'How can I help you, Talib?',
          transliteration: `kayfa usaa'iduka yaa taalib?`,
        },
        playerResponse: {
          correctArabic: 'أُريدُ مُقابَلَة الأَميرَة',
          correctEnglish: 'I want to meet the princess',
          wordBank: ['أُريدُ', 'مُقابَلَة', 'الأَميرَة', 'رُؤيَة', 'المَلِك', 'أَذهَبُ'],
          grammarHint: 'أُريدُ (I want) + مُقابَلَة (meeting, verbal noun) + الأَميرَة (the princess).',
        },
      },
      {
        npcLine: {
          arabic: 'الأَميرَة مَشغولَة الآن. هَل الأَمرُ مُهِمّ؟',
          english: 'The princess is busy now. Is the matter important?',
          transliteration: `al-amiira mashghuula al-aan. hal al-amru muhimm?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم الأَمرُ مُهِمٌّ جِدًّا',
          correctEnglish: 'Yes, the matter is very important',
          wordBank: ['نَعَم', 'الأَمرُ', 'مُهِمٌّ', 'جِدًّا', 'لا', 'بَسيط', 'قَليلًا'],
          grammarHint: 'الأَمرُ مُهِمٌّ (the matter is important) — nominal sentence with adjective.',
        },
      },
      {
        npcLine: {
          arabic: 'حَسَنًا، اِنتَظِر هُنا. سَأُبلِغُها.',
          english: 'Very well, wait here. I will inform her.',
          transliteration: `hasanan, intadhir hunaa. sa-ublighuhaa.`,
        },
        playerResponse: {
          correctArabic: 'شُكْرًا يا سَيِّدي',
          correctEnglish: 'Thank you, my lord',
          wordBank: ['شُكْرًا', 'يا', 'سَيِّدي', 'أَخي', 'جَزيلًا', 'مَعَ'],
          grammarHint: 'شُكْرًا يا سَيِّدي — respectful thanks with formal address.',
        },
      },
    ],
    vocabularyUsed: ['uriidu', 'muqaabala', 'amiira', 'muhimm', 'shukran'],
    xpReward: 50,
  },

  // RP-3: Describing Your Quest (A2)
  {
    id: 'palace_quest_003',
    zone: 'royal-palace',
    topic: 'narrative',
    cefrLevel: 'A2',
    title: 'Describing Your Quest',
    titleArabic: 'وَصف مُهِمَّتِكَ',
    context: 'Princess Aisha asks why you have come to the palace and what you seek.',
    contextArabic: 'الأَميرَة عائِشَة تَسأَلُكَ لِماذا جِئتَ إلى القَصرِ وَماذا تَبحَثُ عَنهُ.',
    npcName: 'Princess Aisha',
    npcPortrait: 'portrait-princess-aisha',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَخبَرَني الوَزيرُ أَنَّكَ تَبحَثُ عَن شَيء. ما هُوَ؟',
          english: 'The vizier told me you are looking for something. What is it?',
          transliteration: `akhbaraniy al-waziiru annaka tabhath an shay'. maa huwa?`,
        },
        playerResponse: {
          correctArabic: 'أَبحَثُ عَن مَعرِفَةِ اللُّغَة العَرَبِيَّة',
          correctEnglish: 'I am searching for knowledge of the Arabic language',
          wordBank: ['أَبحَثُ', 'عَن', 'مَعرِفَةِ', 'اللُّغَة', 'العَرَبِيَّة', 'كَنزِ', 'الذَّهَب', 'في'],
          grammarHint: 'أَبحَثُ عَن (I search for) + idafa chain: مَعرِفَةِ اللُّغَة العَرَبِيَّة.',
        },
      },
      {
        npcLine: {
          arabic: 'طَلَبٌ نَبيل! كَيفَ يُمكِنُنا مُساعَدَتُكَ؟',
          english: 'A noble request! How can we help you?',
          transliteration: `talabun nabiil! kayfa yumkinunaa musaa'adatuka?`,
        },
        playerResponse: {
          correctArabic: 'أَحتاجُ مُعَلِّمًا يُساعِدُني في الدِّراسَة',
          correctEnglish: 'I need a teacher to help me study',
          wordBank: ['أَحتاجُ', 'مُعَلِّمًا', 'يُساعِدُني', 'في', 'الدِّراسَة', 'خادِمًا', 'يَخدِمُني', 'اللَّعب'],
          grammarHint: 'أَحتاجُ + indefinite accusative: مُعَلِّمًا (a teacher) + relative clause.',
        },
      },
      {
        npcLine: {
          arabic: 'سَنُرسِلُ لَكَ أَفضَلَ مُعَلِّمينا.',
          english: 'We will send you our best teacher.',
          transliteration: `sanursilu laka afdala mu'allimiinaa.`,
        },
        playerResponse: {
          correctArabic: 'جَزاكُمُ اللهُ خَيرًا يا أَميرَة',
          correctEnglish: 'May God reward you, princess',
          wordBank: ['جَزاكُمُ', 'اللهُ', 'خَيرًا', 'يا', 'أَميرَة', 'شَرًّا', 'سَيِّدَة', 'شُكْرًا'],
          grammarHint: 'جَزاكُمُ (plural/formal, may He reward you all) — respectful to royalty.',
        },
      },
    ],
    vocabularyUsed: ['abhath', 'ma_rifa', 'lugha', 'mu_allim', 'jazaakum'],
    xpReward: 75,
  },

  // RP-4: Expressing Gratitude (B1)
  {
    id: 'palace_gratitude_004',
    zone: 'royal-palace',
    topic: 'gratitude',
    cefrLevel: 'B1',
    title: 'Expressing Gratitude',
    titleArabic: 'التَّعبير عَنِ الاِمتِنان',
    context: 'The palace has helped you greatly. You express your deep thanks to the Vizier.',
    contextArabic: 'ساعَدَكَ القَصرُ كَثيرًا. تُعَبِّرُ عَن شُكرِكَ العَميقِ لِلوَزير.',
    npcName: 'Vizier Abbas',
    npcPortrait: 'portrait-vizier-abbas',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَرجو أَنَّ إقامَتَكَ كانَت مُمتِعَة.',
          english: 'I hope your stay was enjoyable.',
          transliteration: `arju anna iqaamataka kaanat mumti'a.`,
        },
        playerResponse: {
          correctArabic: 'كانَت إقامَتي رائِعَة وَلَن أَنساها أَبَدًا',
          correctEnglish: 'My stay was wonderful and I will never forget it',
          wordBank: ['كانَت', 'إقامَتي', 'رائِعَة', 'وَلَن', 'أَنساها', 'أَبَدًا', 'سَيِّئَة', 'أَتَذَكَّرَها', 'غَدًا'],
          grammarHint: 'لَن + subjunctive (أَنساها) for negated future. أَبَدًا (ever/never) emphasizes.',
        },
      },
      {
        npcLine: {
          arabic: 'يُسعِدُنا ذَلِك. القَصرُ بَيتُكَ دائِمًا.',
          english: 'That makes us happy. The palace is always your home.',
          transliteration: `yus'idunaa dhaalik. al-qasru baytuka daa'iman.`,
        },
        playerResponse: {
          correctArabic: 'أَشكُرُكَ مِن أَعماقِ قَلبي عَلى كُلِّ شَيء',
          correctEnglish: 'I thank you from the depths of my heart for everything',
          wordBank: ['أَشكُرُكَ', 'مِن', 'أَعماقِ', 'قَلبي', 'عَلى', 'كُلِّ', 'شَيء', 'سَطحِ', 'عَقلي', 'بَعض'],
          grammarHint: 'أَشكُرُكَ مِن أَعماقِ قَلبي — idafa chain: depths of my heart.',
        },
      },
      {
        npcLine: {
          arabic: 'العَفو. الكَرَمُ مِن شِيَمِنا.',
          english: 'You are welcome. Generosity is one of our traits.',
          transliteration: `al-afuw. al-karamu min shiyaminaa.`,
        },
        playerResponse: {
          correctArabic: 'تَعَلَّمتُ مِنكُم مَعنى الكَرَم الحَقيقي',
          correctEnglish: 'I learned from you the meaning of true generosity',
          wordBank: ['تَعَلَّمتُ', 'مِنكُم', 'مَعنى', 'الكَرَم', 'الحَقيقي', 'عَنكُم', 'قيمَة', 'البُخل'],
          grammarHint: 'مَعنى (meaning of) + الكَرَم الحَقيقي (true generosity) — noun + adjective with ال.',
        },
      },
    ],
    vocabularyUsed: ['iqaama', 'shukr', 'qalb', 'karam', 'ta_allamtu'],
    xpReward: 100,
  },

  // RP-5: Farewell Formalities (B2)
  {
    id: 'palace_farewell_005',
    zone: 'royal-palace',
    topic: 'farewell',
    cefrLevel: 'B2',
    title: 'Farewell Formalities',
    titleArabic: 'رَسمِيّات الوَداع',
    context: 'You take your leave from the palace with formal, eloquent farewells.',
    contextArabic: 'تَأخُذُ إذنَكَ مِنَ القَصرِ بِوَداعٍ رَسمي وَبَليغ.',
    npcName: 'Princess Aisha',
    npcPortrait: 'portrait-princess-aisha',
    exchanges: [
      {
        npcLine: {
          arabic: 'حانَ وَقتُ الوَداع. سَنَفتَقِدُكَ يا طالِب.',
          english: 'The time for farewell has come. We will miss you, Talib.',
          transliteration: `haana waqtu al-wadaa'. sanaftaqiduka yaa taalib.`,
        },
        playerResponse: {
          correctArabic: 'وَأَنا سَأَفتَقِدُ هَذا المَكانَ وَأَهلَهُ الكِرام',
          correctEnglish: 'And I will miss this place and its generous people',
          wordBank: ['وَأَنا', 'سَأَفتَقِدُ', 'هَذا', 'المَكانَ', 'وَأَهلَهُ', 'الكِرام', 'سَأَنسى', 'ذَلِكَ', 'البِخال'],
          grammarHint: 'سَأَفتَقِدُ (I will miss, Form VIII) + أَهلَهُ الكِرام (its noble people, accusative).',
        },
      },
      {
        npcLine: {
          arabic: 'لَقَد شَرَّفتَنا بِزِيارَتِكَ. أَبوابُنا مَفتوحَةٌ لَكَ دائِمًا.',
          english: 'You have honored us with your visit. Our doors are always open to you.',
          transliteration: `laqad sharraftanaa bi-ziyaaratika. abwaabunaa maftuuhatun laka daa'iman.`,
        },
        playerResponse: {
          correctArabic: 'الشَّرَفُ لي وَأَسأَلُ اللهَ أَن يَحفَظَكُم جَميعًا',
          correctEnglish: 'The honor is mine and I ask God to protect you all',
          wordBank: ['الشَّرَفُ', 'لي', 'وَأَسأَلُ', 'اللهَ', 'أَن', 'يَحفَظَكُم', 'جَميعًا', 'لَكَ', 'يُعاقِبَكُم', 'وَحدَكُم'],
          grammarHint: 'أَسأَلُ اللهَ أَن + subjunctive: يَحفَظَكُم (that He protect you, plural).',
        },
      },
      {
        npcLine: {
          arabic: 'آمين. سِر بِسَلام وَعُد بِسَلام.',
          english: 'Amen. Go in peace and return in peace.',
          transliteration: `aamiin. sir bi-salaam wa-ud bi-salaam.`,
        },
        playerResponse: {
          correctArabic: 'في أَمانِ اللهِ إلى أَن نَلتَقي ثانِيَةً',
          correctEnglish: 'In God\'s protection until we meet again',
          wordBank: ['في', 'أَمانِ', 'اللهِ', 'إلى', 'أَن', 'نَلتَقي', 'ثانِيَةً', 'مَعَ', 'نَفتَرِقَ', 'أَخيرًا'],
          grammarHint: 'في أَمانِ اللهِ (in God\'s protection) + إلى أَن (until) + subjunctive.',
        },
      },
    ],
    vocabularyUsed: ['wadaa', 'iftaqada', 'sharaf', 'amaan', 'salaam'],
    xpReward: 150,
  },

  // ============================================================
  // MOUNTAIN PASS (5 scenarios)
  // ============================================================

  // MP-1: Asking for Directions (A1)
  {
    id: 'mountain_directions_001',
    zone: 'mountain-pass',
    topic: 'directions',
    cefrLevel: 'A1',
    title: 'Asking for Directions',
    titleArabic: 'السُّؤال عَنِ الاِتِّجاهات',
    context: 'You meet the Mountain Hermit and ask for help navigating the mountain trails.',
    contextArabic: 'تُقابِلُ ناسِكَ الجَبَل وَتَطلُبُ المُساعَدَة في التَّنَقُّلِ عَبرَ مَسارات الجَبَل.',
    npcName: 'Mountain Hermit Idris',
    npcPortrait: 'portrait-mountain-hermit-idris',
    exchanges: [
      {
        npcLine: {
          arabic: 'مَرْحَبًا يا مُسافِر! إلى أَينَ تَذهَب؟',
          english: 'Hello traveler! Where are you going?',
          transliteration: `marhaban yaa musaafir! ilaa ayna tadhhab?`,
        },
        playerResponse: {
          correctArabic: 'أَذهَبُ إلى القِمَّة',
          correctEnglish: 'I am going to the summit',
          wordBank: ['أَذهَبُ', 'إلى', 'القِمَّة', 'الوادي', 'مِن', 'البَحر'],
          grammarHint: 'أَذهَبُ (I go) + إلى (to) + destination.',
        },
      },
      {
        npcLine: {
          arabic: 'الطَّريقُ طَويل. اِتَّبِع هَذا المَسار.',
          english: 'The road is long. Follow this path.',
          transliteration: `at-tariiqu tawiil. ittabi' haadha al-masaar.`,
        },
        playerResponse: {
          correctArabic: 'شُكْرًا أَينَ الطَّريق',
          correctEnglish: 'Thank you, where is the road?',
          wordBank: ['شُكْرًا', 'أَينَ', 'الطَّريق', 'كَيفَ', 'المَسار', 'ماذا'],
          grammarHint: 'أَينَ (where) + definite noun for asking location.',
        },
      },
      {
        npcLine: {
          arabic: 'هُناكَ! بَينَ الصُّخور.',
          english: 'Over there! Between the rocks.',
          transliteration: `hunaaka! bayna as-sukhuur.`,
        },
        playerResponse: {
          correctArabic: 'فَهِمتُ شُكْرًا لَكَ',
          correctEnglish: 'I understand, thank you',
          wordBank: ['فَهِمتُ', 'شُكْرًا', 'لَكَ', 'لا', 'مَعَ', 'جَزيلًا'],
          grammarHint: 'فَهِمتُ (I understood, past tense) — confirming understanding.',
        },
      },
    ],
    vocabularyUsed: ['adhhabu', 'qimma', 'tariiq', 'shukran', 'fahimtu'],
    xpReward: 50,
  },

  // MP-2: Warning About Danger (A1)
  {
    id: 'mountain_danger_002',
    zone: 'mountain-pass',
    topic: 'safety',
    cefrLevel: 'A1',
    title: 'Warning About Danger',
    titleArabic: 'التَّحذير مِنَ الخَطَر',
    context: 'The hermit warns you about dangers on the mountain path.',
    contextArabic: 'النّاسِكُ يُحَذِّرُكَ مِن مَخاطِرِ مَسارِ الجَبَل.',
    npcName: 'Mountain Hermit Idris',
    npcPortrait: 'portrait-mountain-hermit-idris',
    exchanges: [
      {
        npcLine: {
          arabic: 'اِنتَبِه! الطَّريقُ خَطِر.',
          english: 'Be careful! The road is dangerous.',
          transliteration: `intabih! at-tariiqu khatiir.`,
        },
        playerResponse: {
          correctArabic: 'ماذا يوجَدُ هُناك',
          correctEnglish: 'What is there?',
          wordBank: ['ماذا', 'يوجَدُ', 'هُناك', 'كَيفَ', 'أَينَ', 'هُنا'],
          grammarHint: 'ماذا يوجَدُ (what exists/is there) + هُناك (there).',
        },
      },
      {
        npcLine: {
          arabic: 'صُخورٌ كَبيرَة وَرِياحٌ قَوِيَّة.',
          english: 'Large rocks and strong winds.',
          transliteration: `sukhurun kabiira wa-riyaahun qawiyya.`,
        },
        playerResponse: {
          correctArabic: 'هَل الطَّريقُ آمِن الآن',
          correctEnglish: 'Is the road safe now?',
          wordBank: ['هَل', 'الطَّريقُ', 'آمِن', 'الآن', 'خَطِر', 'غَدًا', 'المَسارُ'],
          grammarHint: 'هَل + subject + adjective + time: standard yes/no question.',
        },
      },
      {
        npcLine: {
          arabic: 'الآنَ نَعَم. لَكِن كُن حَذِرًا!',
          english: 'Now yes. But be careful!',
          transliteration: `al-aana na'am. laakin kun hadhiran!`,
        },
        playerResponse: {
          correctArabic: 'سَأَكونُ حَذِرًا شُكْرًا',
          correctEnglish: 'I will be careful, thank you',
          wordBank: ['سَأَكونُ', 'حَذِرًا', 'شُكْرًا', 'شُجاعًا', 'سَريعًا', 'لا'],
          grammarHint: 'سَأَكونُ (I will be) + accusative predicate حَذِرًا (careful).',
        },
      },
    ],
    vocabularyUsed: ['khatiir', 'aamin', 'hadhir', 'tariiq', 'sukhuur'],
    xpReward: 50,
  },

  // MP-3: Describing Terrain (A2)
  {
    id: 'mountain_terrain_003',
    zone: 'mountain-pass',
    topic: 'description',
    cefrLevel: 'A2',
    title: 'Describing Terrain',
    titleArabic: 'وَصف التَّضاريس',
    context: 'You describe what you see on the mountain to the hermit.',
    contextArabic: 'تَصِفُ ما تَراهُ عَلى الجَبَل لِلنّاسِك.',
    npcName: 'Mountain Hermit Idris',
    npcPortrait: 'portrait-mountain-hermit-idris',
    exchanges: [
      {
        npcLine: {
          arabic: 'صِف لي ما تَراهُ مِن هُنا.',
          english: 'Describe to me what you see from here.',
          transliteration: `sif lii maa taraahu min hunaa.`,
        },
        playerResponse: {
          correctArabic: 'أَرى جِبالًا عالِيَة وَوادِيًا عَميقًا',
          correctEnglish: 'I see high mountains and a deep valley',
          wordBank: ['أَرى', 'جِبالًا', 'عالِيَة', 'وَوادِيًا', 'عَميقًا', 'قَصيرَة', 'وَنَهرًا', 'ضَيِّقًا'],
          grammarHint: 'أَرى (I see) + broken plural accusative: جِبالًا + adjective.',
        },
      },
      {
        npcLine: {
          arabic: 'وَماذا عَنِ السَّماء؟',
          english: 'And what about the sky?',
          transliteration: `wa-maadha an as-samaa'?`,
        },
        playerResponse: {
          correctArabic: 'السَّماءُ صافِيَة وَالشَّمسُ مُشرِقَة',
          correctEnglish: 'The sky is clear and the sun is shining',
          wordBank: ['السَّماءُ', 'صافِيَة', 'وَالشَّمسُ', 'مُشرِقَة', 'غائِمَة', 'وَالقَمَرُ', 'مُظلِمَة'],
          grammarHint: 'Nominal sentences: السَّماءُ صافِيَة (sky is clear) + وَالشَّمسُ مُشرِقَة (sun is shining).',
        },
      },
      {
        npcLine: {
          arabic: 'يَومٌ جَميل لِلمَشي!',
          english: 'A beautiful day for walking!',
          transliteration: `yawmun jamiil lil-mashii!`,
        },
        playerResponse: {
          correctArabic: 'نَعَم الطَّبيعَةُ هُنا جَميلَة جِدًّا',
          correctEnglish: 'Yes, nature here is very beautiful',
          wordBank: ['نَعَم', 'الطَّبيعَةُ', 'هُنا', 'جَميلَة', 'جِدًّا', 'قَبيحَة', 'هُناكَ', 'قَليلًا'],
          grammarHint: 'الطَّبيعَةُ (nature, feminine) + هُنا (here) + feminine adjective.',
        },
      },
    ],
    vocabularyUsed: ['jabal', 'waadi', 'samaa', 'shams', 'tabiia'],
    xpReward: 75,
  },

  // MP-4: Offering Help (B1)
  {
    id: 'mountain_help_004',
    zone: 'mountain-pass',
    topic: 'helping',
    cefrLevel: 'B1',
    title: 'Offering Help',
    titleArabic: 'عَرض المُساعَدَة',
    context: 'You find an injured traveler and offer assistance on the mountain.',
    contextArabic: 'تَجِدُ مُسافِرًا مَجروحًا وَتَعرِضُ المُساعَدَة عَلى الجَبَل.',
    npcName: 'Guide Salim',
    npcPortrait: 'portrait-guide-salim',
    exchanges: [
      {
        npcLine: {
          arabic: 'آه! ساعِدني مِن فَضلِكَ! رِجلي تُؤلِمُني.',
          english: 'Ah! Help me please! My leg hurts.',
          transliteration: `aah! saa'idnii min fadlika! rijlii tu'limunii.`,
        },
        playerResponse: {
          correctArabic: 'لا تَخَف سَأُساعِدُكَ ماذا حَدَث',
          correctEnglish: 'Do not be afraid, I will help you. What happened?',
          wordBank: ['لا', 'تَخَف', 'سَأُساعِدُكَ', 'ماذا', 'حَدَث', 'تَقلَق', 'سَأَترُكُكَ', 'مَتى'],
          grammarHint: 'لا تَخَف (do not fear, jussive) + سَأُساعِدُكَ (I will help you).',
        },
      },
      {
        npcLine: {
          arabic: 'وَقَعتُ عَلى الصُّخور. لا أَستَطيعُ المَشي.',
          english: 'I fell on the rocks. I cannot walk.',
          transliteration: `waqa'tu ala as-sukhuur. laa astatii'u al-mashii.`,
        },
        playerResponse: {
          correctArabic: 'دَعني أُساعِدُكَ عَلى الوُقوف وَسَنَمشي مَعًا',
          correctEnglish: 'Let me help you stand up and we will walk together',
          wordBank: ['دَعني', 'أُساعِدُكَ', 'عَلى', 'الوُقوف', 'وَسَنَمشي', 'مَعًا', 'أَترُكُكَ', 'الجُلوس', 'وَحدَكَ'],
          grammarHint: 'دَعني (let me) + subjunctive أُساعِدُكَ + عَلى + verbal noun.',
        },
      },
      {
        npcLine: {
          arabic: 'جَزاكَ اللهُ خَيرًا! أَنتَ إنسانٌ طَيِّب.',
          english: 'May God reward you! You are a good person.',
          transliteration: `jazaaka allaahu khayran! anta insaanun tayyib.`,
        },
        playerResponse: {
          correctArabic: 'هَذا واجِبٌ إنسانيٌّ لا شُكرَ عَلى واجِب',
          correctEnglish: 'This is a human duty — no need to thank for a duty',
          wordBank: ['هَذا', 'واجِبٌ', 'إنسانيٌّ', 'لا', 'شُكرَ', 'عَلى', 'واجِب', 'فَضلٌ', 'حَيوانيٌّ', 'حَقَّ'],
          grammarHint: 'لا شُكرَ عَلى واجِب — a proverb meaning no thanks needed for duty.',
        },
      },
    ],
    vocabularyUsed: ['musaa_ada', 'rijl', 'mashii', 'waajib', 'tayyib'],
    xpReward: 100,
  },

  // MP-5: Travel Plans (B2)
  {
    id: 'mountain_travel_005',
    zone: 'mountain-pass',
    topic: 'planning',
    cefrLevel: 'B2',
    title: 'Travel Plans',
    titleArabic: 'خُطَط السَّفَر',
    context: 'You discuss your future travel plans and route with the mountain hermit.',
    contextArabic: 'تُناقِشُ خُطَطَ سَفَرِكَ المُستَقبَلِيَّة وَمَسارَكَ مَعَ ناسِكِ الجَبَل.',
    npcName: 'Mountain Hermit Idris',
    npcPortrait: 'portrait-mountain-hermit-idris',
    exchanges: [
      {
        npcLine: {
          arabic: 'إلى أَينَ سَتُسافِرُ بَعدَ الجَبَل؟',
          english: 'Where will you travel after the mountain?',
          transliteration: `ilaa ayna satuusaafiru ba'da al-jabal?`,
        },
        playerResponse: {
          correctArabic: 'أُخَطِّطُ لِلذَّهابِ إلى المِيناءِ ثُمَّ أُبحِرُ شَرقًا',
          correctEnglish: 'I plan to go to the port then sail east',
          wordBank: ['أُخَطِّطُ', 'لِلذَّهابِ', 'إلى', 'المِيناءِ', 'ثُمَّ', 'أُبحِرُ', 'شَرقًا', 'لِلبَقاءِ', 'أَمشي', 'غَربًا'],
          grammarHint: 'أُخَطِّطُ لِ (I plan to, Form II) + verbal noun الذَّهاب (the going).',
        },
      },
      {
        npcLine: {
          arabic: 'رِحلَة طَويلَة! هَل أَعدَدتَ كُلَّ شَيء؟',
          english: 'A long journey! Have you prepared everything?',
          transliteration: `rihla tawiila! hal a'dadta kulla shay'?`,
        },
        playerResponse: {
          correctArabic: 'جَهَّزتُ المُؤَنَ لَكِنَّني أَحتاجُ خَريطَة لِلمَسارِ الجَبَلي',
          correctEnglish: 'I prepared the supplies but I need a map of the mountain route',
          wordBank: ['جَهَّزتُ', 'المُؤَنَ', 'لَكِنَّني', 'أَحتاجُ', 'خَريطَة', 'لِلمَسارِ', 'الجَبَلي', 'بِعتُ', 'الأَسلِحَة', 'لِلطَّريقِ', 'البَحري'],
          grammarHint: 'لَكِنَّني (but I, inna + ني) — inna sister with first person attached pronoun.',
        },
      },
      {
        npcLine: {
          arabic: 'عِندي خَريطَة قَديمَة. لَكِنَّها دَقيقَة.',
          english: 'I have an old map. But it is accurate.',
          transliteration: `indii khariita qadiima. laakinnaha daqiiqa.`,
        },
        playerResponse: {
          correctArabic: 'هَذا تَمامًا ما أَحتاجُهُ أَشكُرُكَ جَزيلَ الشُّكر',
          correctEnglish: 'This is exactly what I need. I thank you greatly',
          wordBank: ['هَذا', 'تَمامًا', 'ما', 'أَحتاجُهُ', 'أَشكُرُكَ', 'جَزيلَ', 'الشُّكر', 'تَقريبًا', 'أُريدُهُ', 'قَليلَ'],
          grammarHint: 'تَمامًا ما أَحتاجُهُ (exactly what I need) + جَزيلَ الشُّكر (great thanks, idafa).',
        },
      },
    ],
    vocabularyUsed: ['safar', 'minaa', 'khariita', 'masaar', 'mu_an'],
    xpReward: 150,
  },

  // ============================================================
  // COASTAL PORT (5 scenarios)
  // ============================================================

  // CP-1: Asking About Ships (A1)
  {
    id: 'port_ships_001',
    zone: 'coastal-port',
    topic: 'transport',
    cefrLevel: 'A1',
    title: 'Asking About Ships',
    titleArabic: 'السُّؤال عَنِ السُّفُن',
    context: 'You arrive at the coastal port and ask Captain Rashid about ships.',
    contextArabic: 'تَصِلُ إلى المِيناءِ السّاحِلي وَتَسأَلُ القُبطانَ راشِد عَنِ السُّفُن.',
    npcName: 'Captain Rashid',
    npcPortrait: 'portrait-captain-rashid',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَهْلًا! هَل تُريدُ أَن تُسافِرَ بِالبَحر؟',
          english: 'Welcome! Do you want to travel by sea?',
          transliteration: `ahlan! hal turiidu an tusaafira bil-bahr?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم أُريدُ سَفينَة',
          correctEnglish: 'Yes, I want a ship',
          wordBank: ['نَعَم', 'أُريدُ', 'سَفينَة', 'لا', 'قارِب', 'طائِرَة'],
          grammarHint: 'أُريدُ + indefinite noun: سَفينَة (a ship).',
        },
      },
      {
        npcLine: {
          arabic: 'عِندي سَفينَة كَبيرَة. إلى أَينَ؟',
          english: 'I have a big ship. To where?',
          transliteration: `indii safiina kabiira. ilaa ayna?`,
        },
        playerResponse: {
          correctArabic: 'إلى الشَّرق مِن فَضلِكَ',
          correctEnglish: 'To the east, please',
          wordBank: ['إلى', 'الشَّرق', 'مِن', 'فَضلِكَ', 'الغَرب', 'بِدون', 'شُكْرًا'],
          grammarHint: 'إلى (to) + direction with ال: الشَّرق (the east).',
        },
      },
      {
        npcLine: {
          arabic: 'مُمتاز! نُسافِرُ غَدًا صَباحًا.',
          english: 'Excellent! We travel tomorrow morning.',
          transliteration: `mumtaaz! nusaafiru ghadan sabaahan.`,
        },
        playerResponse: {
          correctArabic: 'جَيِّد شُكْرًا يا قُبطان',
          correctEnglish: 'Good, thank you captain',
          wordBank: ['جَيِّد', 'شُكْرًا', 'يا', 'قُبطان', 'سَيِّئ', 'أَخي', 'صَديقي'],
          grammarHint: 'يا قُبطان (O captain) — vocative with professional title.',
        },
      },
    ],
    vocabularyUsed: ['safiina', 'bahr', 'sharq', 'ghadan', 'qubtaan'],
    xpReward: 50,
  },

  // CP-2: Describing Destinations (A1)
  {
    id: 'port_destinations_002',
    zone: 'coastal-port',
    topic: 'travel',
    cefrLevel: 'A1',
    title: 'Describing Destinations',
    titleArabic: 'وَصف الوِجهات',
    context: 'Dockmaster Nadia tells you about different ports and you share your plans.',
    contextArabic: 'مُشرِفَة الرَّصيف نادِيَة تُخبِرُكَ عَن مَوانِئ مُختَلِفَة وَتُشارِكُ خُطَطَكَ.',
    npcName: 'Dockmaster Nadia',
    npcPortrait: 'portrait-dockmaster-nadia',
    exchanges: [
      {
        npcLine: {
          arabic: 'إلى أَينَ تُريدُ أَن تَذهَب؟',
          english: 'Where do you want to go?',
          transliteration: `ilaa ayna turiidu an tadh-hab?`,
        },
        playerResponse: {
          correctArabic: 'أُريدُ أَن أَذهَبَ إلى مَدينَة جَديدَة',
          correctEnglish: 'I want to go to a new city',
          wordBank: ['أُريدُ', 'أَن', 'أَذهَبَ', 'إلى', 'مَدينَة', 'جَديدَة', 'أَبقى', 'في', 'قَديمَة'],
          grammarHint: 'أُريدُ أَن + subjunctive + إلى + destination.',
        },
      },
      {
        npcLine: {
          arabic: 'هُناكَ مُدُن كَثيرَة عَبرَ البَحر.',
          english: 'There are many cities across the sea.',
          transliteration: `hunaaka mudun kathiira abra al-bahr.`,
        },
        playerResponse: {
          correctArabic: 'أَيُّ مَدينَة قَريبَة',
          correctEnglish: 'Which city is near?',
          wordBank: ['أَيُّ', 'مَدينَة', 'قَريبَة', 'كَم', 'بَعيدَة', 'كَبيرَة'],
          grammarHint: 'أَيُّ (which) + indefinite noun + adjective for asking about options.',
        },
      },
      {
        npcLine: {
          arabic: 'مِيناءُ الشَّرق يَومان بِالسَّفينَة.',
          english: 'The eastern port is two days by ship.',
          transliteration: `miinaa'u ash-sharq yawmaan bis-safiina.`,
        },
        playerResponse: {
          correctArabic: 'مُمتاز سَأَذهَبُ إلى هُناك',
          correctEnglish: 'Excellent, I will go there',
          wordBank: ['مُمتاز', 'سَأَذهَبُ', 'إلى', 'هُناك', 'سَأَبقى', 'هُنا', 'رائِع'],
          grammarHint: 'سَأَذهَبُ (I will go, sa- future prefix) + إلى هُناك (to there).',
        },
      },
    ],
    vocabularyUsed: ['madiina', 'bahr', 'yawm', 'safiina', 'quriiba'],
    xpReward: 50,
  },

  // CP-3: Weather at Sea (A2)
  {
    id: 'port_weather_003',
    zone: 'coastal-port',
    topic: 'weather',
    cefrLevel: 'A2',
    title: 'Weather at Sea',
    titleArabic: 'الطَّقس في البَحر',
    context: 'Before setting sail, you discuss weather conditions with the captain.',
    contextArabic: 'قَبلَ الإبحارِ تُناقِشُ حالَةَ الطَّقسِ مَعَ القُبطان.',
    npcName: 'Captain Rashid',
    npcPortrait: 'portrait-captain-rashid',
    exchanges: [
      {
        npcLine: {
          arabic: 'الطَّقسُ مُهِمٌّ في البَحر. كَيفَ الجَوّ اليَوم؟',
          english: 'Weather is important at sea. How is the weather today?',
          transliteration: `at-taqsu muhimmun fil-bahr. kayfa al-jaww al-yawm?`,
        },
        playerResponse: {
          correctArabic: 'الجَوُّ جَميل لَكِن هُناكَ رِياحٌ خَفيفَة',
          correctEnglish: 'The weather is nice but there are light winds',
          wordBank: ['الجَوُّ', 'جَميل', 'لَكِن', 'هُناكَ', 'رِياحٌ', 'خَفيفَة', 'سَيِّئ', 'أَمطارٌ', 'قَوِيَّة'],
          grammarHint: 'لَكِن (but) connects two contrasting clauses. رِياحٌ خَفيفَة (light winds, indef.).',
        },
      },
      {
        npcLine: {
          arabic: 'الرِّياحُ الخَفيفَة جَيِّدَة. هَل تَرى غُيومًا؟',
          english: 'Light winds are good. Do you see clouds?',
          transliteration: `ar-riyaahu al-khafiifa jayyida. hal taraa ghuyuuman?`,
        },
        playerResponse: {
          correctArabic: 'لا السَّماءُ صافِيَة تَمامًا',
          correctEnglish: 'No, the sky is completely clear',
          wordBank: ['لا', 'السَّماءُ', 'صافِيَة', 'تَمامًا', 'نَعَم', 'غائِمَة', 'قَليلًا'],
          grammarHint: 'تَمامًا (completely) is an adverb intensifying صافِيَة.',
        },
      },
      {
        npcLine: {
          arabic: 'مُمتاز! سَنُبحِرُ بِأَمان إنْ شاءَ الله.',
          english: 'Excellent! We will sail safely, God willing.',
          transliteration: `mumtaaz! sanubhiru bi-amaan in shaa'a allaah.`,
        },
        playerResponse: {
          correctArabic: 'الحَمدُ لِلَّه على هَذا الطَّقس الجَميل',
          correctEnglish: 'Praise God for this beautiful weather',
          wordBank: ['الحَمدُ', 'لِلَّه', 'على', 'هَذا', 'الطَّقس', 'الجَميل', 'ذَلِكَ', 'البَحر', 'السَّيِّئ'],
          grammarHint: 'الحَمدُ لِلَّه على (praise God for) + هَذا (this) + noun + adjective with ال.',
        },
      },
    ],
    vocabularyUsed: ['taqsq', 'riyaah', 'samaa', 'bahr', 'amaan'],
    xpReward: 75,
  },

  // CP-4: Trading Goods (B1)
  {
    id: 'port_trading_004',
    zone: 'coastal-port',
    topic: 'trading',
    cefrLevel: 'B1',
    title: 'Trading Goods',
    titleArabic: 'تِجارَة البَضائِع',
    context: 'You trade goods at the port, negotiating with Blacksmith Daud.',
    contextArabic: 'تَتاجِرُ بِالبَضائِعِ في المِيناء وَتُفاوِضُ الحَدّادَ داوُد.',
    npcName: 'Blacksmith Daud',
    npcPortrait: 'portrait-blacksmith-daud',
    exchanges: [
      {
        npcLine: {
          arabic: 'عِندي أَدَواتٌ مِنَ الحَديد. هَل تُريدُ أَن تَتاجَر؟',
          english: 'I have tools made of iron. Do you want to trade?',
          transliteration: `indii adawaatun min al-hadiid. hal turiidu an tataajara?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم عِندي تَوابِل نادِرَة مِنَ الصَّحراء',
          correctEnglish: 'Yes, I have rare spices from the desert',
          wordBank: ['نَعَم', 'عِندي', 'تَوابِل', 'نادِرَة', 'مِنَ', 'الصَّحراء', 'أَسلِحَة', 'رَخيصَة', 'الجَبَل'],
          grammarHint: 'عِندي + broken plural + adjective: تَوابِل نادِرَة (rare spices).',
        },
      },
      {
        npcLine: {
          arabic: 'التَّوابِلُ مَطلوبَة هُنا! ماذا تُريدُ مُقابِلَها؟',
          english: 'Spices are in demand here! What do you want in exchange?',
          transliteration: `at-tawaabilu matluuba hunaa! maadha turiidu muqaabilahaa?`,
        },
        playerResponse: {
          correctArabic: 'أُريدُ سَيفًا وَدِرعًا لِرِحلَتي القادِمَة',
          correctEnglish: 'I want a sword and a shield for my next journey',
          wordBank: ['أُريدُ', 'سَيفًا', 'وَدِرعًا', 'لِرِحلَتي', 'القادِمَة', 'سِكّينًا', 'وَخَوذَة', 'الماضِيَة'],
          grammarHint: 'Accusative indefinites: سَيفًا وَدِرعًا. لِرِحلَتي القادِمَة (for my next journey).',
        },
      },
      {
        npcLine: {
          arabic: 'صَفقَة عادِلَة! خُذ هَذا السَّيف.',
          english: 'A fair deal! Take this sword.',
          transliteration: `safqa aadila! khudh haadha as-sayf.`,
        },
        playerResponse: {
          correctArabic: 'بارَكَ اللهُ في تِجارَتِكَ يا أُستاذ',
          correctEnglish: 'May God bless your trade, master',
          wordBank: ['بارَكَ', 'اللهُ', 'في', 'تِجارَتِكَ', 'يا', 'أُستاذ', 'لَعَنَ', 'حَياتِكَ', 'صَديقي'],
          grammarHint: 'بارَكَ اللهُ في (God bless in/upon) + تِجارَتِكَ (your trade, idafa).',
        },
      },
    ],
    vocabularyUsed: ['tijaara', 'sayf', 'dir', 'tawaabil', 'safqa'],
    xpReward: 100,
  },

  // CP-5: Farewell Before Voyage (B2)
  {
    id: 'port_farewell_005',
    zone: 'coastal-port',
    topic: 'farewell',
    cefrLevel: 'B2',
    title: 'Farewell Before Voyage',
    titleArabic: 'الوَداع قَبلَ الرِّحلَة',
    context: 'As the ship prepares to depart, you say farewell to Fishmonger Hana.',
    contextArabic: 'مَعَ اِستِعدادِ السَّفينَة لِلمُغادَرَة تُوَدِّعُ بائِعَةَ السَّمَك هَنا.',
    npcName: 'Fishmonger Hana',
    npcPortrait: 'portrait-fishmonger-hana',
    exchanges: [
      {
        npcLine: {
          arabic: 'إذَن سَتُغادِرُنا اليَوم. سَأَشتاقُ إلى أَحاديثِنا.',
          english: 'So you are leaving us today. I will miss our conversations.',
          transliteration: `idhan satughaadirunaa al-yawm. sa-ashtaaqu ilaa ahadiithinaa.`,
        },
        playerResponse: {
          correctArabic: 'وَأَنا كَذَلِكَ كُنتِ صَديقَة حَقيقِيَّة مُنذُ وُصولي',
          correctEnglish: 'And I likewise. You have been a true friend since my arrival',
          wordBank: ['وَأَنا', 'كَذَلِكَ', 'كُنتِ', 'صَديقَة', 'حَقيقِيَّة', 'مُنذُ', 'وُصولي', 'أَيضًا', 'عَدُوَّة', 'قَبلَ', 'رَحيلي'],
          grammarHint: 'كُنتِ (you were, feminine past) + صَديقَة حَقيقِيَّة (a true friend). مُنذُ (since) + verbal noun.',
        },
      },
      {
        npcLine: {
          arabic: 'البَحرُ يَحمِلُ مَن يَحمِلُهُ الشَّوق. لا تَنسَنا.',
          english: 'The sea carries those whom longing carries. Do not forget us.',
          transliteration: `al-bahru yahmilu man yahmiluhush-shawq. laa tansanaa.`,
        },
        playerResponse: {
          correctArabic: 'لَن أَنسى هَذا المِيناءَ وَلا أَهلَهُ الطَّيِّبين',
          correctEnglish: 'I will never forget this port nor its kind people',
          wordBank: ['لَن', 'أَنسى', 'هَذا', 'المِيناءَ', 'وَلا', 'أَهلَهُ', 'الطَّيِّبين', 'أَتَذَكَّرَ', 'ذَلِكَ', 'البَحرَ', 'السَّيِّئين'],
          grammarHint: 'لَن + subjunctive (أَنسى = forget) for emphatic future negation. وَلا (nor).',
        },
      },
      {
        npcLine: {
          arabic: 'في أَمانِ الله. عُد إلَينا سالِمًا.',
          english: 'In God\'s protection. Come back to us safely.',
          transliteration: `fii amaani llaah. ud ilaynaa saaliman.`,
        },
        playerResponse: {
          correctArabic: 'إنْ شاءَ اللهُ سَأَعودُ وَمَعي قِصَصٌ جَديدَة أُحَدِّثُكُم بِها',
          correctEnglish: 'God willing, I will return with new stories to tell you',
          wordBank: ['إنْ', 'شاءَ', 'اللهُ', 'سَأَعودُ', 'وَمَعي', 'قِصَصٌ', 'جَديدَة', 'أُحَدِّثُكُم', 'بِها', 'سَأَرحَلُ', 'هُمومٌ', 'قَديمَة', 'أُزعِجُكُم'],
          grammarHint: 'وَمَعي (and with me) + قِصَصٌ جَديدَة (new stories) + relative clause أُحَدِّثُكُم بِها (I tell you about them).',
        },
      },
    ],
    vocabularyUsed: ['wadaa', 'safiina', 'bahr', 'qisas', 'amaan'],
    xpReward: 150,
  },

  // ============================================================
  // HIDDEN OASIS (5 scenarios)
  // ============================================================

  // HO-1: Expressing Wonder (A1)
  {
    id: 'oasis_wonder_001',
    zone: 'hidden-oasis',
    topic: 'wonder',
    cefrLevel: 'A1',
    title: 'Expressing Wonder',
    titleArabic: 'التَّعبير عَنِ الدَّهشَة',
    context: 'You discover the hidden oasis and meet a wise guardian there.',
    contextArabic: 'تَكتَشِفُ الواحَةَ المَخفِيَّة وَتُقابِلُ حارِسًا حَكيمًا هُناك.',
    npcName: 'Guide Amira',
    npcPortrait: 'portrait-guide-amira',
    exchanges: [
      {
        npcLine: {
          arabic: 'مَرْحَبًا بِكَ في الواحَةِ المَخفِيَّة!',
          english: 'Welcome to the hidden oasis!',
          transliteration: `marhaban bika fil-waahati al-makhfiyya!`,
        },
        playerResponse: {
          correctArabic: 'ما شاءَ الله هَذا مَكان جَميل',
          correctEnglish: 'God willed it! This is a beautiful place',
          wordBank: ['ما', 'شاءَ', 'الله', 'هَذا', 'مَكان', 'جَميل', 'لا', 'سَيِّئ', 'قَبيح'],
          grammarHint: 'ما شاءَ الله — an exclamation of wonder and admiration.',
        },
      },
      {
        npcLine: {
          arabic: 'نَعَم! الماءُ هُنا صافٍ والأَشجارُ خَضراء.',
          english: 'Yes! The water here is clear and the trees are green.',
          transliteration: `na'am! al-maa'u hunaa saafin wal-ashjaaru khadraa'.`,
        },
        playerResponse: {
          correctArabic: 'سُبحانَ الله هَذا جَميل جِدًّا',
          correctEnglish: 'Glory to God, this is very beautiful',
          wordBank: ['سُبحانَ', 'الله', 'هَذا', 'جَميل', 'جِدًّا', 'حَسْبِيَ', 'قَبيح', 'قَليلًا'],
          grammarHint: 'سُبحانَ الله — another exclamation of awe and appreciation.',
        },
      },
      {
        npcLine: {
          arabic: 'قَليلونَ يَجِدونَ هَذا المَكان.',
          english: 'Few people find this place.',
          transliteration: `qaliiluuna yajiduwna haadha al-makaan.`,
        },
        playerResponse: {
          correctArabic: 'أَنا مَحظوظ جِدًّا',
          correctEnglish: 'I am very lucky',
          wordBank: ['أَنا', 'مَحظوظ', 'جِدًّا', 'سَعيد', 'قَليلًا', 'حَزين'],
          grammarHint: 'أَنا + adjective: مَحظوظ (lucky/fortunate).',
        },
      },
    ],
    vocabularyUsed: ['maa_shaa_allah', 'subhanallah', 'jamiil', 'makaan', 'mahzuuz'],
    xpReward: 50,
  },

  // HO-2: Asking About History (A1)
  {
    id: 'oasis_history_002',
    zone: 'hidden-oasis',
    topic: 'history',
    cefrLevel: 'A1',
    title: 'Asking About History',
    titleArabic: 'السُّؤال عَنِ التّاريخ',
    context: 'You ask the guardian about the ancient history of this hidden oasis.',
    contextArabic: 'تَسأَلُ الحارِسَ عَن تاريخِ هَذِهِ الواحَةِ المَخفِيَّة القَديم.',
    npcName: 'Guide Amira',
    npcPortrait: 'portrait-guide-amira',
    exchanges: [
      {
        npcLine: {
          arabic: 'هَذِهِ الواحَة عُمرُها أَلفُ سَنَة.',
          english: 'This oasis is a thousand years old.',
          transliteration: `haadhihi al-waaha umruhaa alfu sana.`,
        },
        playerResponse: {
          correctArabic: 'أَلفُ سَنَة هَذا قَديم جِدًّا',
          correctEnglish: 'A thousand years! This is very old',
          wordBank: ['أَلفُ', 'سَنَة', 'هَذا', 'قَديم', 'جِدًّا', 'مِئَة', 'جَديد', 'قَليلًا'],
          grammarHint: 'أَلفُ سَنَة (a thousand years) — numbers above 10 take singular genitive.',
        },
      },
      {
        npcLine: {
          arabic: 'نَعَم! القُدَماءُ بَنَوها لِلمُسافِرين.',
          english: 'Yes! The ancients built it for travelers.',
          transliteration: `na'am! al-qudamaa'u banawhaa lil-musaafiriin.`,
        },
        playerResponse: {
          correctArabic: 'مَن بَنى هَذا المَكان',
          correctEnglish: 'Who built this place?',
          wordBank: ['مَن', 'بَنى', 'هَذا', 'المَكان', 'ماذا', 'وَجَدَ', 'ذَلِكَ'],
          grammarHint: 'مَن (who) + past tense verb: بَنى (built).',
        },
      },
      {
        npcLine: {
          arabic: 'تُجّارُ الحَرير قَبلَ أَلفِ سَنَة.',
          english: 'Silk merchants a thousand years ago.',
          transliteration: `tujjaaru al-hariir qabla alfi sana.`,
        },
        playerResponse: {
          correctArabic: 'هَذا تاريخ مُذهِل',
          correctEnglish: 'This is amazing history',
          wordBank: ['هَذا', 'تاريخ', 'مُذهِل', 'ذَلِكَ', 'مَكان', 'مُمِلّ'],
          grammarHint: 'هَذا + indefinite noun + adjective: simple exclamatory statement.',
        },
      },
    ],
    vocabularyUsed: ['waaha', 'tariikh', 'qadiim', 'sana', 'banaa'],
    xpReward: 50,
  },

  // HO-3: Describing Beauty (A2)
  {
    id: 'oasis_beauty_003',
    zone: 'hidden-oasis',
    topic: 'description',
    cefrLevel: 'A2',
    title: 'Describing Beauty',
    titleArabic: 'وَصف الجَمال',
    context: 'You describe the breathtaking beauty of the hidden oasis to the guardian.',
    contextArabic: 'تَصِفُ جَمالَ الواحَةِ المَخفِيَّة الخَلّابِ لِلحارِسَة.',
    npcName: 'Guide Amira',
    npcPortrait: 'portrait-guide-amira',
    exchanges: [
      {
        npcLine: {
          arabic: 'ما أَجمَلُ شَيءٍ رَأَيتَهُ هُنا؟',
          english: 'What is the most beautiful thing you have seen here?',
          transliteration: `maa ajmalu shay'in ra'aytahu hunaa?`,
        },
        playerResponse: {
          correctArabic: 'الماءُ الصّافي وَالأَزهار المُلَوَّنَة',
          correctEnglish: 'The clear water and the colorful flowers',
          wordBank: ['الماءُ', 'الصّافي', 'وَالأَزهار', 'المُلَوَّنَة', 'العَكِر', 'وَالصُّخور', 'الرَّمادِيَّة'],
          grammarHint: 'Definite noun + definite adjective: الماءُ الصّافي (the clear water).',
        },
      },
      {
        npcLine: {
          arabic: 'وَماذا عَنِ الطُّيور؟ هَل سَمِعتَها؟',
          english: 'And what about the birds? Have you heard them?',
          transliteration: `wa-maadha ani at-tuyuur? hal sami'tahaa?`,
        },
        playerResponse: {
          correctArabic: 'نَعَم صَوتُها مِثلَ الموسيقى',
          correctEnglish: 'Yes, their sound is like music',
          wordBank: ['نَعَم', 'صَوتُها', 'مِثلَ', 'الموسيقى', 'لَونُها', 'أَقوى', 'الضَّوضاء'],
          grammarHint: 'صَوتُها (their sound, idafa with pronoun) + مِثلَ (like) + noun.',
        },
      },
      {
        npcLine: {
          arabic: 'الطَّبيعَة هُنا لَم تَتَغَيَّر مُنذُ قُرون.',
          english: 'Nature here has not changed for centuries.',
          transliteration: `at-tabii'a hunaa lam tataghayyar mundhu quruun.`,
        },
        playerResponse: {
          correctArabic: 'هَذا يَجعَلُها أَكثَرَ جَمالًا',
          correctEnglish: 'That makes it more beautiful',
          wordBank: ['هَذا', 'يَجعَلُها', 'أَكثَرَ', 'جَمالًا', 'يُفسِدُها', 'أَقَلَّ', 'قُبحًا'],
          grammarHint: 'يَجعَلُها (makes it) + tamyiiz: أَكثَرَ جَمالًا (more in beauty).',
        },
      },
    ],
    vocabularyUsed: ['maa', 'azhar', 'tuyuur', 'sawt', 'jamaal'],
    xpReward: 75,
  },

  // HO-4: Sharing Discoveries (B1)
  {
    id: 'oasis_discoveries_004',
    zone: 'hidden-oasis',
    topic: 'discovery',
    cefrLevel: 'B1',
    title: 'Sharing Discoveries',
    titleArabic: 'مُشارَكَة الاِكتِشافات',
    context: 'You share what you discovered while exploring the hidden oasis.',
    contextArabic: 'تُشارِكُ ما اِكتَشَفتَهُ أَثناءَ اِستِكشافِ الواحَةِ المَخفِيَّة.',
    npcName: 'Guide Amira',
    npcPortrait: 'portrait-guide-amira',
    exchanges: [
      {
        npcLine: {
          arabic: 'ماذا وَجَدتَ في جَولَتِكَ؟',
          english: 'What did you find on your tour?',
          transliteration: `maadha wajadta fii jawlatika?`,
        },
        playerResponse: {
          correctArabic: 'وَجَدتُ نُقوشًا قَديمَة عَلى الصُّخور',
          correctEnglish: 'I found ancient inscriptions on the rocks',
          wordBank: ['وَجَدتُ', 'نُقوشًا', 'قَديمَة', 'عَلى', 'الصُّخور', 'رُسومًا', 'جَديدَة', 'في', 'الماء'],
          grammarHint: 'وَجَدتُ (I found) + indefinite accusative plural + adjective + prepositional phrase.',
        },
      },
      {
        npcLine: {
          arabic: 'مُثير! هَل اِستَطَعتَ قِراءَتَها؟',
          english: 'Interesting! Were you able to read them?',
          transliteration: `muthiir! hal istata'ta qiraa'atahaa?`,
        },
        playerResponse: {
          correctArabic: 'قَرَأتُ بَعضَها لَكِنَّ مُعظَمَها بِلُغَة لا أَعرِفُها',
          correctEnglish: 'I read some of them but most are in a language I do not know',
          wordBank: ['قَرَأتُ', 'بَعضَها', 'لَكِنَّ', 'مُعظَمَها', 'بِلُغَة', 'لا', 'أَعرِفُها', 'كُلَّها', 'إنَّ', 'بِخَطٍّ', 'أُحِبُّها'],
          grammarHint: 'لَكِنَّ (inna-sister) + مُعظَمَها (most of them, accusative) + prepositional predicate.',
        },
      },
      {
        npcLine: {
          arabic: 'رُبَّما هِيَ آراميَّة. سَأُساعِدُكَ في تَرجَمَتِها.',
          english: 'Perhaps it is Aramaic. I will help you translate them.',
          transliteration: `rubbamaa hiya araamiyya. sa-usaa'iduka fii tarjamatihaa.`,
        },
        playerResponse: {
          correctArabic: 'سَيَكونُ ذَلِكَ رائِعًا أَشكُرُكِ مِن قَلبي',
          correctEnglish: 'That would be wonderful, I thank you from my heart',
          wordBank: ['سَيَكونُ', 'ذَلِكَ', 'رائِعًا', 'أَشكُرُكِ', 'مِن', 'قَلبي', 'هَذا', 'سَيِّئًا', 'أَلومُكِ', 'عَقلي'],
          grammarHint: 'سَيَكونُ ذَلِكَ (that will be) + رائِعًا (wonderful, accusative predicate of kaana).',
        },
      },
    ],
    vocabularyUsed: ['nuquush', 'qadiima', 'sukhuur', 'lugha', 'tarjama'],
    xpReward: 100,
  },

  // HO-5: Philosophical Reflection (B2)
  {
    id: 'oasis_philosophy_005',
    zone: 'hidden-oasis',
    topic: 'philosophy',
    cefrLevel: 'B2',
    title: 'Philosophical Reflection',
    titleArabic: 'تَأَمُّل فَلسَفي',
    context: 'By the water\'s edge, you engage in a deep philosophical conversation about life and language.',
    contextArabic: 'عَلى ضِفَّةِ الماءِ تَخوضُ مُحادَثَةً فَلسَفِيَّة عَميقَة عَنِ الحَياةِ واللُّغَة.',
    npcName: 'Guide Amira',
    npcPortrait: 'portrait-guide-amira',
    exchanges: [
      {
        npcLine: {
          arabic: 'يَقولونَ إنَّ اللُّغَة مِفتاحُ الرُّوح. ما رَأيُكَ؟',
          english: 'They say language is the key to the soul. What do you think?',
          transliteration: `yaquuluuna inna al-lugha miftaahu ar-ruuh. maa ra'yuka?`,
        },
        playerResponse: {
          correctArabic: 'أَعتَقِدُ أَنَّ كُلَّ لُغَةٍ تَفتَحُ عالَمًا جَديدًا مِنَ الفِكر',
          correctEnglish: 'I believe that every language opens a new world of thought',
          wordBank: ['أَعتَقِدُ', 'أَنَّ', 'كُلَّ', 'لُغَةٍ', 'تَفتَحُ', 'عالَمًا', 'جَديدًا', 'مِنَ', 'الفِكر', 'بَعضَ', 'تُغلِقُ', 'قَديمًا', 'الجَهل'],
          grammarHint: 'أَنَّ كُلَّ لُغَةٍ (that every language) — كُلَّ + indefinite genitive. تَفتَحُ عالَمًا (opens a world).',
        },
      },
      {
        npcLine: {
          arabic: 'جَميل! وَالعَرَبِيَّة خاصَّةً لَها عُمقٌ لا يُوصَف.',
          english: 'Beautiful! And Arabic especially has an indescribable depth.',
          transliteration: `jamiil! wal-arabiyya khaassatan lahaa umqun laa yuusaf.`,
        },
        playerResponse: {
          correctArabic: 'كُلَّما تَعَلَّمتُ أَكثَرَ أَدرَكتُ كَم هِيَ واسِعَة',
          correctEnglish: 'The more I learned, the more I realized how vast it is',
          wordBank: ['كُلَّما', 'تَعَلَّمتُ', 'أَكثَرَ', 'أَدرَكتُ', 'كَم', 'هِيَ', 'واسِعَة', 'أَقَلَّ', 'نَسيتُ', 'ضَيِّقَة'],
          grammarHint: 'كُلَّما (whenever/the more) + past + past = correlative conditional.',
        },
      },
      {
        npcLine: {
          arabic: 'هَذا هُوَ سِرُّ التَّعَلُّم. الرِّحلَةُ لا تَنتَهي.',
          english: 'That is the secret of learning. The journey never ends.',
          transliteration: `haadha huwa sirru at-ta'allum. ar-rihlatu laa tantahii.`,
        },
        playerResponse: {
          correctArabic: 'وَهَذِهِ الرِّحلَةُ هِيَ أَجمَلُ ما عِشتُهُ لِأَنَّها غَيَّرَت نَظرَتي لِلعالَم',
          correctEnglish: 'And this journey is the most beautiful thing I have experienced because it changed my view of the world',
          wordBank: ['وَهَذِهِ', 'الرِّحلَةُ', 'هِيَ', 'أَجمَلُ', 'ما', 'عِشتُهُ', 'لِأَنَّها', 'غَيَّرَت', 'نَظرَتي', 'لِلعالَم', 'وَتِلكَ', 'أَسوَأُ', 'دَمَّرَت', 'حَياتي'],
          grammarHint: 'أَجمَلُ ما عِشتُهُ (the most beautiful thing I lived/experienced). لِأَنَّها (because it) + verb.',
        },
      },
    ],
    vocabularyUsed: ['lugha', 'ruuh', 'aalam', 'fikr', 'rihla'],
    xpReward: 150,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all scenarios for a specific zone
 */
export function getScenariosForZone(zone) {
  return conversationScenarios.filter((s) => s.zone === zone);
}

/**
 * Get all scenarios for a specific CEFR level
 */
export function getScenariosForLevel(cefrLevel) {
  return conversationScenarios.filter((s) => s.cefrLevel === cefrLevel);
}

/**
 * Get a scenario by ID
 */
export function getScenarioById(id) {
  return conversationScenarios.find((s) => s.id === id) || null;
}

/**
 * Get zone + CEFR distribution summary
 */
export function getDistributionSummary() {
  const summary = {};
  for (const zone of ZONES) {
    summary[zone] = { total: 0, A1: 0, A2: 0, B1: 0, B2: 0 };
  }
  for (const s of conversationScenarios) {
    if (summary[s.zone]) {
      summary[s.zone].total++;
      summary[s.zone][s.cefrLevel]++;
    }
  }
  return summary;
}

export default conversationScenarios;
