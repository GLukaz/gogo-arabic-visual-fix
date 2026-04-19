/**
 * conversationScenariosExpanded.js
 *
 * 24 additional conversation scenarios (3 per zone, 8 zones).
 * CEFR distribution per zone: 1 A2, 1 B1, 1 B2.
 * Each scenario has 4-6 exchanges with word banks and grammar hints.
 *
 * Phase 90 (CONV-EXPAND)
 *
 * IDs use 'exp_' prefix to avoid collision with the original 40 scenarios.
 */

import { ZONES, CEFR_LEVELS, ZONE_LABELS } from './conversationScenarios.js';

export { ZONES, CEFR_LEVELS, ZONE_LABELS };

export const CONVERSATION_SCENARIOS_EXPANDED = [
  // ============================================================
  // OASIS VILLAGE — 3 scenarios (A2, B1, B2)
  // ============================================================

  // OV-EXP-1: Planning a Community Event (A2)
  {
    id: 'exp_oasis_event_001',
    zone: 'oasis-village',
    topic: 'community_event',
    cefrLevel: 'A2',
    title: 'Planning a Community Event',
    titleArabic: 'التَّخطيط لِحَدَثٍ مُجتَمَعي',
    context: 'Village Elder Amina is organizing a celebration for the harvest season. She asks for your help.',
    contextArabic: 'الشَّيخة أمينة تُنَظِّمُ احتِفالاً بِمَوسِمِ الحَصاد. تَطلُبُ مُساعَدَتَكَ.',
    npcName: 'Elder Amina',
    npcPortrait: 'portrait-elder-amina',
    exchanges: [
      {
        npcLine: {
          arabic: 'مَرحَبًا! نُريدُ أَن نُنَظِّمَ حَفلَةً لِلحَصاد. هَل تُساعِدُنا؟',
          english: 'Hello! We want to organize a harvest party. Will you help us?',
          transliteration: 'marhaban! nuriidu an nunazzima haflatan lil-hasaad. hal tusaa\'idunaa?',
        },
        playerResponse: {
          correctArabic: 'نَعَم بِكُلِّ سُرور',
          correctEnglish: 'Yes, with all pleasure',
          wordBank: ['نَعَم', 'بِكُلِّ', 'سُرور', 'لا', 'رُبَّما', 'غَدًا'],
          grammarHint: 'بِكُلِّ سُرور (with all pleasure) is a polite way to accept.',
        },
      },
      {
        npcLine: {
          arabic: 'مُمتاز! نَحتاجُ طَعامًا وَموسيقى. ماذا تَقتَرِح؟',
          english: 'Excellent! We need food and music. What do you suggest?',
          transliteration: 'mumtaaz! nahtaaju ta\'aaman wa-muusiiqaa. maadha taqtarih?',
        },
        playerResponse: {
          correctArabic: 'أَقتَرِحُ أَن نَطبُخَ كُسكُسًا وَنَعزِفَ العود',
          correctEnglish: 'I suggest we cook couscous and play the oud',
          wordBank: ['أَقتَرِحُ', 'أَن', 'نَطبُخَ', 'كُسكُسًا', 'وَنَعزِفَ', 'العود', 'نَشتَرِيَ', 'بيتزا'],
          grammarHint: 'أَقتَرِحُ أَن + subjunctive verb. نَطبُخَ is the subjunctive of نَطبُخ.',
        },
      },
      {
        npcLine: {
          arabic: 'فِكرَةٌ رائِعة! وَمَن سَيُزَيِّنُ السّاحة؟',
          english: 'Wonderful idea! And who will decorate the square?',
          transliteration: 'fikratun raa\'i\'a! wa-man sayuzayyinu as-saaha?',
        },
        playerResponse: {
          correctArabic: 'سَأَطلُبُ مِنَ الأَطفالِ المُساعَدَة',
          correctEnglish: 'I will ask the children to help',
          wordBank: ['سَأَطلُبُ', 'مِنَ', 'الأَطفالِ', 'المُساعَدَة', 'سَأَفعَلُ', 'وَحدي', 'الكِبار'],
          grammarHint: 'سَأَطلُبُ مِن (I will ask from) + noun. The future prefix سَ attaches to the verb.',
        },
      },
      {
        npcLine: {
          arabic: 'شُكرًا لَكَ! الحَفلَةُ سَتَكونُ يَومَ الجُمعة.',
          english: 'Thank you! The party will be on Friday.',
          transliteration: 'shukran laka! al-haflatu satakuunu yawma al-jum\'a.',
        },
        playerResponse: {
          correctArabic: 'سَأَكونُ جاهِزًا إنْ شاءَ الله',
          correctEnglish: 'I will be ready, God willing',
          wordBank: ['سَأَكونُ', 'جاهِزًا', 'إنْ', 'شاءَ', 'الله', 'مَشغولًا', 'لَن'],
          grammarHint: 'سَأَكونُ (I will be) + adjective in accusative. جاهِزًا = ready.',
        },
      },
    ],
    vocabularyUsed: ['hafla', 'hasaad', 'musaaada', 'aqtarih', 'jaahiz'],
    xpReward: 75,
  },

  // OV-EXP-2: Discussing Weather Patterns (B1)
  {
    id: 'exp_oasis_weather_002',
    zone: 'oasis-village',
    topic: 'weather_patterns',
    cefrLevel: 'B1',
    title: 'Discussing Weather Patterns',
    titleArabic: 'مُناقَشَة أَنماط الطَّقس',
    context: 'Old farmer Hassan is reading the signs of nature. He shares his weather knowledge with you.',
    contextArabic: 'المُزارِع العَجوز حَسَن يَقرَأُ عَلاماتِ الطَّبيعة. يُشارِكُكَ مَعرِفَتَهُ بِالطَّقس.',
    npcName: 'Farmer Hassan',
    npcPortrait: 'portrait-farmer-hassan',
    exchanges: [
      {
        npcLine: {
          arabic: 'اُنظُر إلى السَّماء. الغُيومُ تَأتي مِنَ الغَرب. سَيَهطِلُ المَطَرُ غَدًا.',
          english: 'Look at the sky. The clouds are coming from the west. It will rain tomorrow.',
          transliteration: 'undhur ilaa as-samaa\'. al-ghuyuumu ta\'tii min al-gharb. sayahtilu al-mataru ghadan.',
        },
        playerResponse: {
          correctArabic: 'كَيفَ تَعرِفُ ذَلِكَ يا عَمّ حَسَن؟',
          correctEnglish: 'How do you know that, Uncle Hassan?',
          wordBank: ['كَيفَ', 'تَعرِفُ', 'ذَلِكَ', 'يا', 'عَمّ', 'حَسَن', 'لِماذا', 'تَقولُ', 'أَخ'],
          grammarHint: 'يا عَمّ is a respectful way to address an older man. كَيفَ تَعرِفُ = how do you know.',
        },
      },
      {
        npcLine: {
          arabic: 'تَعَلَّمتُ مِن جَدّي. الرِّياحُ الغَربِيَّة تَحمِلُ الرُّطوبَة مِنَ البَحر.',
          english: 'I learned from my grandfather. The western winds carry moisture from the sea.',
          transliteration: 'ta\'allamtu min jaddii. ar-riyaahu al-gharbiyya tahmilu ar-rutuuba min al-bahr.',
        },
        playerResponse: {
          correctArabic: 'هَذا عِلمٌ قَديم وَمُفيد. هَل تَتَغَيَّرُ أَنماطُ الطَّقسِ هُنا؟',
          correctEnglish: 'This is ancient and useful knowledge. Do weather patterns change here?',
          wordBank: ['هَذا', 'عِلمٌ', 'قَديم', 'وَمُفيد', 'هَل', 'تَتَغَيَّرُ', 'أَنماطُ', 'الطَّقسِ', 'هُنا', 'جَديد', 'سَيِّئ'],
          grammarHint: 'هَل introduces a yes/no question. تَتَغَيَّرُ is Form V (reflexive/passive of change).',
        },
      },
      {
        npcLine: {
          arabic: 'نَعَم، لاحَظتُ أَنَّ الأَمطارَ أَصبَحَت أَقَلّ مِن قَبل. هَذا يُقلِقُني.',
          english: 'Yes, I have noticed that rains have become less than before. This worries me.',
          transliteration: 'na\'am, laahadhtu anna al-amtaara asbahat aqall min qabl. haadha yuqliqunii.',
        },
        playerResponse: {
          correctArabic: 'رُبَّما يَجِبُ أَن نَحفَظَ المَزيدَ مِنَ المِياه',
          correctEnglish: 'Perhaps we should conserve more water',
          wordBank: ['رُبَّما', 'يَجِبُ', 'أَن', 'نَحفَظَ', 'المَزيدَ', 'مِنَ', 'المِياه', 'لا', 'نَستَخدِمَ'],
          grammarHint: 'يَجِبُ أَن + subjunctive (it is necessary that). نَحفَظَ = we conserve/preserve.',
        },
      },
      {
        npcLine: {
          arabic: 'كَلامُكَ صَحيح. المِياهُ هِيَ الحَياة في الصَّحراء.',
          english: 'You are right. Water is life in the desert.',
          transliteration: 'kalaamuka sahiih. al-miyaahu hiya al-hayaatu fii as-sahraa\'.',
        },
        playerResponse: {
          correctArabic: 'سَنَعمَلُ مَعًا لِحِمايَةِ الواحَة',
          correctEnglish: 'We will work together to protect the oasis',
          wordBank: ['سَنَعمَلُ', 'مَعًا', 'لِحِمايَةِ', 'الواحَة', 'سَنَترُكُ', 'وَحدَنا', 'الصَّحراء'],
          grammarHint: 'لِحِمايَةِ (to protect) uses the لِ + verbal noun construction to express purpose.',
        },
      },
    ],
    vocabularyUsed: ['taqs', 'matar', 'riyaah', 'miyaah', 'waaha'],
    xpReward: 100,
  },

  // OV-EXP-3: Teaching a Child (B2)
  {
    id: 'exp_oasis_teaching_003',
    zone: 'oasis-village',
    topic: 'teaching_child',
    cefrLevel: 'B2',
    title: 'Teaching a Child',
    titleArabic: 'تَعليمُ طِفل',
    context: 'A young girl named Nour asks you philosophical questions about learning. You engage her in a thoughtful discussion.',
    contextArabic: 'فَتاةٌ صَغيرة اسمُها نور تَسأَلُكَ أَسئِلَةً فَلسَفِيَّة عَنِ التَّعَلُّم. تُشارِكُها في نِقاشٍ عَميق.',
    npcName: 'Little Nour',
    npcPortrait: 'portrait-little-nour',
    exchanges: [
      {
        npcLine: {
          arabic: 'لِماذا يَجِبُ أَن نَتَعَلَّم؟ أَبي يَقولُ إنَّ العِلمَ نور.',
          english: 'Why must we learn? My father says knowledge is light.',
          transliteration: 'limaadha yajibu an nata\'allam? abii yaquulu inna al-\'ilma nuur.',
        },
        playerResponse: {
          correctArabic: 'أَبوكِ عَلى حَقّ. العِلمُ يُنيرُ طَريقَنا وَيَفتَحُ لَنا آفاقًا جَديدة',
          correctEnglish: 'Your father is right. Knowledge illuminates our path and opens new horizons for us',
          wordBank: ['أَبوكِ', 'عَلى', 'حَقّ', 'العِلمُ', 'يُنيرُ', 'طَريقَنا', 'وَيَفتَحُ', 'لَنا', 'آفاقًا', 'جَديدة', 'يُغلِقُ', 'قَديمة'],
          grammarHint: 'يُنيرُ is Form IV (causative: to illuminate). آفاقًا جَديدة = new horizons (accusative).',
        },
      },
      {
        npcLine: {
          arabic: 'لَكِنَّ الدِّراسَةَ صَعبَة أَحيانًا. كَيفَ أَتَغَلَّبُ عَلى الصُّعوبات؟',
          english: 'But studying is hard sometimes. How do I overcome the difficulties?',
          transliteration: 'lakinna ad-diraasata sa\'ba ahyaanan. kayfa ataghallabu \'ala as-su\'uubaat?',
        },
        playerResponse: {
          correctArabic: 'بِالصَّبرِ وَالمُثابَرَة. كُلُّ عالِمٍ بَدَأَ طِفلًا مِثلَكِ',
          correctEnglish: 'With patience and perseverance. Every scholar started as a child like you',
          wordBank: ['بِالصَّبرِ', 'وَالمُثابَرَة', 'كُلُّ', 'عالِمٍ', 'بَدَأَ', 'طِفلًا', 'مِثلَكِ', 'بِالسُّرعَة', 'انتَهى'],
          grammarHint: 'كُلُّ عالِمٍ (every scholar) — كُلّ takes a genitive indefinite noun. بَدَأَ = started.',
        },
      },
      {
        npcLine: {
          arabic: 'هَل يُمكِنُ أَن أُصبِحَ عالِمَةً يَومًا ما؟',
          english: 'Is it possible that I become a scholar someday?',
          transliteration: 'hal yumkinu an usbiha \'aalimataan yawman maa?',
        },
        playerResponse: {
          correctArabic: 'بِالتَّأكيد. المَرأَةُ العَرَبِيَّةُ قَدَّمَت إسهاماتٍ عَظيمَة في العِلمِ عَبرَ التّاريخ',
          correctEnglish: 'Certainly. Arab women have made great contributions to science throughout history',
          wordBank: ['بِالتَّأكيد', 'المَرأَةُ', 'العَرَبِيَّةُ', 'قَدَّمَت', 'إسهاماتٍ', 'عَظيمَة', 'في', 'العِلمِ', 'عَبرَ', 'التّاريخ', 'لَم', 'تُقَدِّم'],
          grammarHint: 'قَدَّمَت is Form II past (feminine). إسهاماتٍ عَظيمَة = great contributions (accusative).',
        },
      },
      {
        npcLine: {
          arabic: 'سَأَدرُسُ كُلَّ يَوم وَلَن أَستَسلِم! شُكرًا لَكَ.',
          english: 'I will study every day and will not give up! Thank you.',
          transliteration: 'sa-adrusu kulla yawm wa-lan astaslim! shukran laka.',
        },
        playerResponse: {
          correctArabic: 'هَذِهِ هِيَ الرُّوحُ التي نَحتاجُها. تَذَكَّري أَنَّ الرِّحلَةَ أَهَمُّ مِنَ الوُصول',
          correctEnglish: 'This is the spirit we need. Remember that the journey is more important than the destination',
          wordBank: ['هَذِهِ', 'هِيَ', 'الرُّوحُ', 'التي', 'نَحتاجُها', 'تَذَكَّري', 'أَنَّ', 'الرِّحلَةَ', 'أَهَمُّ', 'مِنَ', 'الوُصول', 'أَقَلُّ'],
          grammarHint: 'أَهَمُّ مِن (more important than) is the elative/comparative form. تَذَكَّري uses feminine imperative.',
        },
      },
    ],
    vocabularyUsed: ['\'ilm', 'sabr', 'ta\'allum', 'riihla', 'ishaama'],
    xpReward: 150,
  },

  // ============================================================
  // ANCIENT LIBRARY — 3 scenarios (A2, B1, B2)
  // ============================================================

  // AL-EXP-1: Cataloguing Books (A2)
  {
    id: 'exp_library_catalogue_001',
    zone: 'ancient-library',
    topic: 'cataloguing',
    cefrLevel: 'A2',
    title: 'Cataloguing Books',
    titleArabic: 'فَهرَسَة الكُتُب',
    context: 'Librarian Zahra needs help organizing the scrolls. You assist her with sorting.',
    contextArabic: 'أمينَةُ المَكتَبة زَهراء تَحتاجُ مُساعَدَة في تَنظيمِ المَخطوطات. تُساعِدُها في التَّرتيب.',
    npcName: 'Librarian Zahra',
    npcPortrait: 'portrait-librarian-zahra',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَهلًا! عِندَنا كُتُبٌ جَديدة. هَل تُساعِدُني في تَرتيبِها؟',
          english: 'Hello! We have new books. Will you help me organize them?',
          transliteration: 'ahlan! \'indanaa kutubun jadiida. hal tusaa\'idunii fii tartiibihaa?',
        },
        playerResponse: {
          correctArabic: 'طَبعًا! كَيفَ نُرَتِّبُها؟',
          correctEnglish: 'Of course! How do we organize them?',
          wordBank: ['طَبعًا', 'كَيفَ', 'نُرَتِّبُها', 'لا', 'أُريدُ', 'مَتى'],
          grammarHint: 'نُرَتِّبُها — the pronoun suffix ها refers back to الكُتُب (books, feminine plural).',
        },
      },
      {
        npcLine: {
          arabic: 'نُرَتِّبُها حَسَبَ المَوضوع: عِلم وَتاريخ وَأَدَب وَفَلسَفة.',
          english: 'We organize them by subject: science, history, literature, and philosophy.',
          transliteration: 'nurattibuhaa hasaba al-mawduu\': \'ilm wa-taariikh wa-adab wa-falsafa.',
        },
        playerResponse: {
          correctArabic: 'هَذا الكِتابُ عَن تاريخِ الأَندَلُس. أَضَعُهُ هُنا',
          correctEnglish: 'This book is about the history of Andalusia. I will put it here',
          wordBank: ['هَذا', 'الكِتابُ', 'عَن', 'تاريخِ', 'الأَندَلُس', 'أَضَعُهُ', 'هُنا', 'عِلمِ', 'هُناك'],
          grammarHint: 'أَضَعُهُ (I put it) — the ه suffix refers back to الكِتاب (masculine singular).',
        },
      },
      {
        npcLine: {
          arabic: 'أَحسَنتَ! وَهَذِهِ المَخطوطَة قَديمَة جِدًّا. يَجِبُ التَّعامُلُ مَعَها بِحَذَر.',
          english: 'Well done! And this manuscript is very old. We must handle it carefully.',
          transliteration: 'ahsanta! wa-haadhihi al-makhtuta qadiima jiddan. yajibu at-ta\'aamulu ma\'ahaa bi-hadhar.',
        },
        playerResponse: {
          correctArabic: 'سَأَكونُ حَريصًا. كَم عُمرُ هَذِهِ المَخطوطَة؟',
          correctEnglish: 'I will be careful. How old is this manuscript?',
          wordBank: ['سَأَكونُ', 'حَريصًا', 'كَم', 'عُمرُ', 'هَذِهِ', 'المَخطوطَة', 'سَريعًا', 'ثَمَنُ'],
          grammarHint: 'كَم عُمرُ (how old is) literally means "how much is the age of."',
        },
      },
      {
        npcLine: {
          arabic: 'أَكثَرُ مِن خَمسِمِئَة سَنة! هِيَ كَنزٌ حَقيقي.',
          english: 'More than five hundred years! It is a real treasure.',
          transliteration: 'aktharu min khamsi-mi\'ati sana! hiya kanzun haqiiqii.',
        },
        playerResponse: {
          correctArabic: 'يا لَها مِن تُحفَة! يَجِبُ أَن نَحفَظَها جَيِّدًا',
          correctEnglish: 'What a masterpiece! We must preserve it well',
          wordBank: ['يا', 'لَها', 'مِن', 'تُحفَة', 'يَجِبُ', 'أَن', 'نَحفَظَها', 'جَيِّدًا', 'نَبيعَها', 'قَبيحة'],
          grammarHint: 'يا لَها مِن تُحفَة is an exclamatory expression meaning "what a masterpiece!"',
        },
      },
    ],
    vocabularyUsed: ['kutub', 'tartiib', 'makhtuta', 'kanz', 'tuhfa'],
    xpReward: 75,
  },

  // AL-EXP-2: Debating a Historical Interpretation (B1)
  {
    id: 'exp_library_debate_002',
    zone: 'ancient-library',
    topic: 'historical_debate',
    cefrLevel: 'B1',
    title: 'Debating a Historical Interpretation',
    titleArabic: 'مُناقَشَة تَفسيرٍ تاريخي',
    context: 'Scholar Idris has a different view of a historical event. You engage him in academic debate.',
    contextArabic: 'العالِم إدريس لَدَيهِ رُؤيَة مُختَلِفَة لِحَدَثٍ تاريخي. تُشارِكُهُ في نِقاشٍ أَكاديمي.',
    npcName: 'Scholar Idris',
    npcPortrait: 'portrait-scholar-idris',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَعتَقِدُ أَنَّ بَيتَ الحِكمَةِ كانَ أَهَمَّ مَركَزٍ عِلمِيّ في التّاريخ.',
          english: 'I believe the House of Wisdom was the most important scientific center in history.',
          transliteration: 'a\'taqidu anna bayt al-hikmati kaana ahamm markazi \'ilmiyyin fii at-taariikh.',
        },
        playerResponse: {
          correctArabic: 'أَتَّفِقُ مَعَكَ في ذَلِك. لَكِن هَل نَعرِفُ ما حَدَثَ لَهُ بَعدَ الغَزو المَغولي؟',
          correctEnglish: 'I agree with you on that. But do we know what happened to it after the Mongol invasion?',
          wordBank: ['أَتَّفِقُ', 'مَعَكَ', 'في', 'ذَلِك', 'لَكِن', 'هَل', 'نَعرِفُ', 'ما', 'حَدَثَ', 'لَهُ', 'بَعدَ', 'الغَزو', 'المَغولي', 'أَختَلِفُ'],
          grammarHint: 'أَتَّفِقُ مَعَكَ (I agree with you) — Form VIII verb. ما حَدَثَ لَهُ = what happened to it.',
        },
      },
      {
        npcLine: {
          arabic: 'دَمَّرَ المَغولُ مَكتَبَةَ بَغداد. لَكِنَّ العِلمَ انتَقَلَ إلى مَناطِقَ أُخرى.',
          english: 'The Mongols destroyed the Baghdad library. But knowledge transferred to other areas.',
          transliteration: 'dammara al-maghuulu maktabata baghdaad. lakinna al-\'ilma intaqala ilaa manaatiqa ukhraa.',
        },
        playerResponse: {
          correctArabic: 'نَعَم، حَمَلَ العُلَماءُ مَعارِفَهُم إلى الأَندَلُسِ وَمِصر',
          correctEnglish: 'Yes, scholars carried their knowledge to Andalusia and Egypt',
          wordBank: ['نَعَم', 'حَمَلَ', 'العُلَماءُ', 'مَعارِفَهُم', 'إلى', 'الأَندَلُسِ', 'وَمِصر', 'فَقَدَ', 'أَضاعوا'],
          grammarHint: 'حَمَلَ (he carried). مَعارِفَهُم = their knowledge (plural of مَعرِفة).',
        },
      },
      {
        npcLine: {
          arabic: 'بِالضَّبط. وَهَذا يُثبِتُ أَنَّ المَعرِفَةَ لا تَموت.',
          english: 'Exactly. And this proves that knowledge does not die.',
          transliteration: 'bid-dabt. wa-haadha yuthbitu anna al-ma\'rifata laa tamuut.',
        },
        playerResponse: {
          correctArabic: 'المَعرِفَةُ تَنتَقِلُ عَبرَ الأَجيال كَالماءِ في النَّهر',
          correctEnglish: 'Knowledge transfers across generations like water in a river',
          wordBank: ['المَعرِفَةُ', 'تَنتَقِلُ', 'عَبرَ', 'الأَجيال', 'كَالماءِ', 'في', 'النَّهر', 'تَتَوَقَّفُ', 'كَالحَجَر'],
          grammarHint: 'كَالماءِ (like water) uses the كَ prefix for comparison + definite noun in genitive.',
        },
      },
      {
        npcLine: {
          arabic: 'تَشبيهٌ جَميل! أَنتَ تُفَكِّرُ كَعالِمٍ حَقيقي.',
          english: 'Beautiful analogy! You think like a real scholar.',
          transliteration: 'tashbiihun jamiil! anta tufakkiru ka-\'aalimin haqiiqii.',
        },
        playerResponse: {
          correctArabic: 'تَعَلَّمتُ مِن هَذِهِ المَكتَبَة أَكثَرَ مِمّا تَوَقَّعت',
          correctEnglish: 'I have learned from this library more than I expected',
          wordBank: ['تَعَلَّمتُ', 'مِن', 'هَذِهِ', 'المَكتَبَة', 'أَكثَرَ', 'مِمّا', 'تَوَقَّعت', 'أَقَلَّ', 'أَرَدت'],
          grammarHint: 'أَكثَرَ مِمّا (more than what) — مِمّا = مِن + ما. تَوَقَّعت = I expected (Form V).',
        },
      },
    ],
    vocabularyUsed: ['bayt_hikma', 'ma\'rifa', 'taariikh', 'tashbiih', '\'ilm'],
    xpReward: 100,
  },

  // AL-EXP-3: Research Collaboration (B2)
  {
    id: 'exp_library_research_003',
    zone: 'ancient-library',
    topic: 'research',
    cefrLevel: 'B2',
    title: 'Research Collaboration',
    titleArabic: 'تَعاوُنٌ بَحثي',
    context: 'Professor Layla proposes a joint research project on ancient texts. You discuss methodology and findings.',
    contextArabic: 'الأُستاذة لَيلى تَقتَرِحُ مَشروعَ بَحثٍ مُشتَرَك عَنِ النُّصوصِ القَديمة. تُناقِشانِ المَنهَجِيَّة والنَّتائِج.',
    npcName: 'Professor Layla',
    npcPortrait: 'portrait-professor-layla',
    exchanges: [
      {
        npcLine: {
          arabic: 'وَجَدتُ مَخطوطَةً نادِرَة تَتَناوَلُ عِلمَ الفَلَكِ عِندَ العَرَب. هَل تُشارِكُني في تَحليلِها؟',
          english: 'I found a rare manuscript discussing Arab astronomy. Will you join me in analyzing it?',
          transliteration: 'wajadtu makhtutatan naadiratan tatanaawalu \'ilma al-falaki \'inda al-\'arab. hal tushaarikuni fii tahliilihaa?',
        },
        playerResponse: {
          correctArabic: 'بِالتَّأكيد. يُسعِدُني التَّعاوُنُ مَعَكِ. ما المَنهَجِيَّةُ التي تَقتَرِحينَها؟',
          correctEnglish: 'Certainly. I am happy to collaborate with you. What methodology do you propose?',
          wordBank: ['بِالتَّأكيد', 'يُسعِدُني', 'التَّعاوُنُ', 'مَعَكِ', 'ما', 'المَنهَجِيَّةُ', 'التي', 'تَقتَرِحينَها', 'يُحزِنُني', 'الخِلافُ'],
          grammarHint: 'يُسعِدُني (it makes me happy) — Form IV impersonal verb. تَقتَرِحينَها = you (f) propose it.',
        },
      },
      {
        npcLine: {
          arabic: 'أَقتَرِحُ مَنهَجًا مُقارَنًا نُقارِنُ فيهِ المَخطوطَةَ بِنُصوصٍ يونانِيَّة مُعاصِرَة لَها.',
          english: 'I propose a comparative method where we compare the manuscript with contemporary Greek texts.',
          transliteration: 'aqtarihu manhajan muqaaranan nuqaarinu fiihi al-makhtutata bi-nusuusin yuunaaniyyatin mu\'aasiratun lahaa.',
        },
        playerResponse: {
          correctArabic: 'فِكرَةٌ مُمتازَة. يُمكِنُنا أَيضًا الاستِعانَةُ بِالمَصادِرِ الفارِسِيَّة لِلتَّحَقُّقِ مِنَ الدِّقَّة',
          correctEnglish: 'Excellent idea. We can also consult Persian sources to verify accuracy',
          wordBank: ['فِكرَةٌ', 'مُمتازَة', 'يُمكِنُنا', 'أَيضًا', 'الاستِعانَةُ', 'بِالمَصادِرِ', 'الفارِسِيَّة', 'لِلتَّحَقُّقِ', 'مِنَ', 'الدِّقَّة', 'تَجاهُلُ', 'الصينِيَّة'],
          grammarHint: 'الاستِعانَةُ بِ (seeking help from) — Form X verbal noun. لِلتَّحَقُّقِ = to verify (Form V + لِ).',
        },
      },
      {
        npcLine: {
          arabic: 'مُوافِقَة. سَنَحتاجُ إلى تَوثيقِ كُلِّ خُطوَةٍ بِدِقَّة لِضَمانِ المِصداقِيَّة العِلمِيَّة.',
          english: 'Agreed. We will need to document every step carefully to ensure scientific credibility.',
          transliteration: 'muwaafiqatun. sanahtaaju ilaa tawthiiqi kulli khutwatin bi-diqqatin li-damaani al-misdaaqiyyati al-\'ilmiyyati.',
        },
        playerResponse: {
          correctArabic: 'سَأُعِدُّ إطارًا نَظَرِيًّا يَستَنِدُ إلى أَحدَثِ الدِّراساتِ في هَذا المَجال',
          correctEnglish: 'I will prepare a theoretical framework based on the latest studies in this field',
          wordBank: ['سَأُعِدُّ', 'إطارًا', 'نَظَرِيًّا', 'يَستَنِدُ', 'إلى', 'أَحدَثِ', 'الدِّراساتِ', 'في', 'هَذا', 'المَجال', 'سَأَنسَخُ', 'أَقدَمِ'],
          grammarHint: 'سَأُعِدُّ (I will prepare) — Form IV future. يَستَنِدُ إلى = relies on/based on (Form X).',
        },
      },
      {
        npcLine: {
          arabic: 'رائِع. لِنَبدَأ العَمَلَ فَورًا. المَعرِفَةُ لا تَنتَظِر.',
          english: 'Wonderful. Let us begin work immediately. Knowledge does not wait.',
          transliteration: 'raa\'i\'. li-nabda\' al-\'amala fawran. al-ma\'rifatu laa tantadhir.',
        },
        playerResponse: {
          correctArabic: 'أَتَّفِقُ تَمامًا. لِيَكُن هَذا البَحثُ إضافَةً حَقيقِيَّةً لِلمَعرِفَةِ الإنسانِيَّة',
          correctEnglish: 'I agree completely. Let this research be a genuine addition to human knowledge',
          wordBank: ['أَتَّفِقُ', 'تَمامًا', 'لِيَكُن', 'هَذا', 'البَحثُ', 'إضافَةً', 'حَقيقِيَّةً', 'لِلمَعرِفَةِ', 'الإنسانِيَّة', 'نُقصانًا', 'سَطحِيَّةً'],
          grammarHint: 'لِيَكُن (let it be) — jussive of كان with لِ. إضافَةً حَقيقِيَّةً = a genuine addition (accusative).',
        },
      },
    ],
    vocabularyUsed: ['bahth', 'makhtuta', 'manhajiyya', 'masaadir', 'ma\'rifa'],
    xpReward: 150,
  },

  // ============================================================
  // DESERT MARKETPLACE — 3 scenarios (A2, B1, B2)
  // ============================================================

  // DM-EXP-1: Reporting a Problem (A2)
  {
    id: 'exp_market_problem_001',
    zone: 'desert-marketplace',
    topic: 'reporting_problem',
    cefrLevel: 'A2',
    title: 'Reporting a Problem',
    titleArabic: 'الإبلاغ عَن مُشكِلَة',
    context: 'You bought a defective item and need to return it to merchant Tariq.',
    contextArabic: 'اشتَرَيتَ شَيئًا مَعيبًا وَتَحتاجُ إلى إرجاعِهِ لِلتّاجِرِ طارِق.',
    npcName: 'Merchant Tariq',
    npcPortrait: 'portrait-merchant-tariq',
    exchanges: [
      {
        npcLine: {
          arabic: 'مَرحَبًا! كَيفَ أُساعِدُكَ اليَوم؟',
          english: 'Hello! How can I help you today?',
          transliteration: 'marhaban! kayfa usaa\'iduka al-yawm?',
        },
        playerResponse: {
          correctArabic: 'اشتَرَيتُ هَذا الإبريقَ أَمسِ وَهُوَ مَكسور',
          correctEnglish: 'I bought this teapot yesterday and it is broken',
          wordBank: ['اشتَرَيتُ', 'هَذا', 'الإبريقَ', 'أَمسِ', 'وَهُوَ', 'مَكسور', 'بِعتُ', 'جَميل'],
          grammarHint: 'اشتَرَيتُ (I bought) is Form VIII past tense. مَكسور = broken (passive participle).',
        },
      },
      {
        npcLine: {
          arabic: 'آسِف جِدًّا! هَل تُريدُ إبريقًا جَديدًا أَو نُعيدُ لَكَ المال؟',
          english: 'Very sorry! Do you want a new teapot or we return your money?',
          transliteration: 'aasif jiddan! hal turiidu ibriiqan jadiidan aw nu\'iidu laka al-maal?',
        },
        playerResponse: {
          correctArabic: 'أُفَضِّلُ إبريقًا جَديدًا مِن فَضلِكَ',
          correctEnglish: 'I prefer a new teapot please',
          wordBank: ['أُفَضِّلُ', 'إبريقًا', 'جَديدًا', 'مِن', 'فَضلِكَ', 'المالَ', 'قَديمًا'],
          grammarHint: 'أُفَضِّلُ (I prefer) — Form II. The accusative إبريقًا جَديدًا follows as direct object.',
        },
      },
      {
        npcLine: {
          arabic: 'تَفَضَّل! هَذا أَفضَلُ إبريقٍ عِندي. وَأَعتَذِرُ عَنِ المُشكِلَة.',
          english: 'Here you go! This is the best teapot I have. And I apologize for the problem.',
          transliteration: 'tafaddal! haadha afdalu ibriiqin \'indii. wa-a\'tadhiru \'an al-mushkila.',
        },
        playerResponse: {
          correctArabic: 'شُكرًا لَكَ يا طارِق. أَنتَ تاجِرٌ أَمين',
          correctEnglish: 'Thank you Tariq. You are an honest merchant',
          wordBank: ['شُكرًا', 'لَكَ', 'يا', 'طارِق', 'أَنتَ', 'تاجِرٌ', 'أَمين', 'غَشّاش'],
          grammarHint: 'تاجِرٌ أَمين (an honest merchant) — two indefinite nouns form a description.',
        },
      },
      {
        npcLine: {
          arabic: 'عَفوًا! عُدّ إلَينا دائِمًا.',
          english: 'You are welcome! Come back to us always.',
          transliteration: '\'afwan! \'udd ilaynaa daa\'iman.',
        },
        playerResponse: {
          correctArabic: 'إنْ شاءَ الله. مَعَ السَّلامَة',
          correctEnglish: 'God willing. Goodbye',
          wordBank: ['إنْ', 'شاءَ', 'الله', 'مَعَ', 'السَّلامَة', 'لَن', 'أَعودَ'],
          grammarHint: 'مَعَ السَّلامَة (with safety) is the standard Arabic goodbye.',
        },
      },
    ],
    vocabularyUsed: ['ishtaraytu', 'maksuura', 'ibriiq', 'amiin', 'mushkila'],
    xpReward: 75,
  },

  // DM-EXP-2: Complex Negotiation (B1)
  {
    id: 'exp_market_negotiate_002',
    zone: 'desert-marketplace',
    topic: 'negotiation',
    cefrLevel: 'B1',
    title: 'Complex Negotiation',
    titleArabic: 'مُفاوَضَة مُعَقَّدَة',
    context: 'You are negotiating a bulk purchase of spices with an experienced trader named Salim.',
    contextArabic: 'تُفاوِضُ عَلى شِراءِ كَمِّيَّة كَبيرة مِنَ التَّوابِلِ مَعَ التّاجِرِ المُخَضرَم سَليم.',
    npcName: 'Trader Salim',
    npcPortrait: 'portrait-trader-salim',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَهلًا وَسَهلًا! عِندي أَجوَدُ التَّوابِلِ في السّوق. ماذا تُريدُ أَن تَشتَرِيَ؟',
          english: 'Welcome! I have the finest spices in the market. What do you want to buy?',
          transliteration: 'ahlan wa-sahlan! \'indii ajwadu at-tawaabili fii as-suuq. maadha turiidu an tashtariya?',
        },
        playerResponse: {
          correctArabic: 'أُريدُ عَشرَةَ كيلوغراماتٍ مِنَ الزَّعفَران وَالكُركُم. ما السِّعرُ لِلكَمِّيَّة؟',
          correctEnglish: 'I want ten kilograms of saffron and turmeric. What is the price for bulk?',
          wordBank: ['أُريدُ', 'عَشرَةَ', 'كيلوغراماتٍ', 'مِنَ', 'الزَّعفَران', 'وَالكُركُم', 'ما', 'السِّعرُ', 'لِلكَمِّيَّة', 'غرامات'],
          grammarHint: 'عَشرَةَ كيلوغراماتٍ — with numbers 3-10, the counted noun is plural genitive.',
        },
      },
      {
        npcLine: {
          arabic: 'الزَّعفرانُ غالٍ هَذا المَوسِم. الكيلو بِمِئَتَي دينار. لَكِنّي أُقَدِّمُ خَصمًا لِلكَمِّيّات.',
          english: 'Saffron is expensive this season. One kilo is two hundred dinars. But I offer a discount for bulk.',
          transliteration: 'az-za\'faraanu ghaalin haadha al-mawsim. al-kiilu bi-mi\'atay diinaar. lakinnii uqaddimu khasman lil-kammiyyaat.',
        },
        playerResponse: {
          correctArabic: 'إذا اشتَرَيتُ الكَمِّيَّةَ كامِلَة فَكَم سَيَكونُ الخَصم؟',
          correctEnglish: 'If I buy the full quantity, how much will the discount be?',
          wordBank: ['إذا', 'اشتَرَيتُ', 'الكَمِّيَّةَ', 'كامِلَة', 'فَكَم', 'سَيَكونُ', 'الخَصم', 'بِعتُ', 'نِصفَها'],
          grammarHint: 'إذا + past tense verb for conditional. فَكَم (so how much) — فَ connects the result.',
        },
      },
      {
        npcLine: {
          arabic: 'يُمكِنُني أَن أُعطِيَكَ خَصمًا عِشرينَ بِالمِئَة. وَأُضيفُ تَوصيلًا مَجّانِيًّا.',
          english: 'I can give you twenty percent off. And I add free delivery.',
          transliteration: 'yumkinunii an u\'tiyaka khasman \'ishriina bil-mi\'a. wa-udiifu tawsiilan majjaaniyyan.',
        },
        playerResponse: {
          correctArabic: 'عَرضٌ مَقبول. لَكِن أُريدُ ضَمانَ جَودَةِ البِضاعَة',
          correctEnglish: 'An acceptable offer. But I want a quality guarantee for the goods',
          wordBank: ['عَرضٌ', 'مَقبول', 'لَكِن', 'أُريدُ', 'ضَمانَ', 'جَودَةِ', 'البِضاعَة', 'مَرفوض', 'رُخصَةِ'],
          grammarHint: 'ضَمانَ جَودَةِ (guarantee of quality) — an idaafa chain: ضَمان + جَودَة + البِضاعَة.',
        },
      },
      {
        npcLine: {
          arabic: 'أُقسِمُ بِاللهِ أَنَّ بِضاعَتي مِنَ الأَفضَل. إذا لَم تُعجِبكَ أُعيدُ لَكَ المال.',
          english: 'I swear by God my goods are among the best. If you don\'t like them I return your money.',
          transliteration: 'uqsimu billaahi anna bidaa\'atii min al-afdal. idhaa lam tu\'jibka u\'iidu laka al-maal.',
        },
        playerResponse: {
          correctArabic: 'اتَّفَقنا! سَأَدفَعُ نِصفَ المَبلَغِ الآن وَالباقي عِندَ التَّسليم',
          correctEnglish: 'Deal! I will pay half the amount now and the rest upon delivery',
          wordBank: ['اتَّفَقنا', 'سَأَدفَعُ', 'نِصفَ', 'المَبلَغِ', 'الآن', 'وَالباقي', 'عِندَ', 'التَّسليم', 'كُلَّ', 'لاحِقًا'],
          grammarHint: 'اتَّفَقنا (we agreed/deal!) — Form VIII perfect. عِندَ التَّسليم = at/upon delivery.',
        },
      },
    ],
    vocabularyUsed: ['tawaabil', 'si\'r', 'khasm', 'bidaa\'a', 'tasliim'],
    xpReward: 100,
  },

  // DM-EXP-3: Recommending Products (B2)
  {
    id: 'exp_market_recommend_003',
    zone: 'desert-marketplace',
    topic: 'recommendations',
    cefrLevel: 'B2',
    title: 'Recommending Products',
    titleArabic: 'تَوصِية بِالمُنتَجات',
    context: 'A foreign merchant asks for your expert opinion on the finest Arab goods to export.',
    contextArabic: 'تاجِرٌ أَجنَبِيّ يَطلُبُ رَأيَكَ الخَبير حَولَ أَفضَلِ البِضائِعِ العَرَبِيَّةِ لِلتَّصدير.',
    npcName: 'Foreign Merchant Marco',
    npcPortrait: 'portrait-merchant-marco',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَنا تاجِرٌ مِنَ البُندُقِيَّة. أَبحَثُ عَن مُنتَجاتٍ عَرَبِيَّةٍ فَريدَة لِسوقِنا.',
          english: 'I am a merchant from Venice. I am looking for unique Arab products for our market.',
          transliteration: 'anaa taajir min al-bunduqiyya. abhath \'an muntajaatin \'arabiyyatin fariidatin li-suuqinaa.',
        },
        playerResponse: {
          correctArabic: 'أَنصَحُكَ بِالتَّوابِلِ الشَّرقِيَّة وَالحَريرِ الدِّمَشقي فَهُما الأَكثَرُ طَلَبًا',
          correctEnglish: 'I advise you with Eastern spices and Damascene silk as they are the most demanded',
          wordBank: ['أَنصَحُكَ', 'بِالتَّوابِلِ', 'الشَّرقِيَّة', 'وَالحَريرِ', 'الدِّمَشقي', 'فَهُما', 'الأَكثَرُ', 'طَلَبًا', 'أُحَذِّرُكَ', 'الأَقَلُّ'],
          grammarHint: 'أَنصَحُكَ بِ (I advise you with) — Form I + بِ preposition. فَهُما = for they both (dual).',
        },
      },
      {
        npcLine: {
          arabic: 'مُمتاز! وَماذا عَنِ البُخور وَالعُطور؟ سَمِعتُ أَنَّها ذاتُ جَودَةٍ عالِية.',
          english: 'Excellent! And what about incense and perfumes? I heard they are of high quality.',
          transliteration: 'mumtaaz! wa-maadha \'an al-bukhuur wa-al-\'utuur? sami\'tu annahaa dhaatu jawdatin \'aaliya.',
        },
        playerResponse: {
          correctArabic: 'بِالفِعل. العودُ والمِسكُ يَحظَيانِ بِتَقديرٍ استِثنائِيّ. لَكِن يَجِبُ أَن تَتَحَقَّقَ مِنَ المَصدَر',
          correctEnglish: 'Indeed. Oud and musk enjoy exceptional appreciation. But you must verify the source',
          wordBank: ['بِالفِعل', 'العودُ', 'والمِسكُ', 'يَحظَيانِ', 'بِتَقديرٍ', 'استِثنائِيّ', 'لَكِن', 'يَجِبُ', 'أَن', 'تَتَحَقَّقَ', 'مِنَ', 'المَصدَر', 'عادِيّ'],
          grammarHint: 'يَحظَيانِ (they both enjoy) — dual verb form. تَتَحَقَّقَ = you verify (Form V subjunctive).',
        },
      },
      {
        npcLine: {
          arabic: 'نَصيحَةٌ ذَهَبِيَّة. هَل هُناكَ مُنتَجات يَجِبُ تَجَنُّبُها؟',
          english: 'Golden advice. Are there products that should be avoided?',
          transliteration: 'nasiihatu dhahabiyya. hal hunaaka muntajaat yajibu tajannubuhaa?',
        },
        playerResponse: {
          correctArabic: 'اِحذَر مِنَ البِضاعَةِ المُقَلَّدَة. تَأَكَّد مِن شَهادَةِ المَنشَأ وَاختَبِر الجَودَة بِنَفسِكَ',
          correctEnglish: 'Beware of counterfeit goods. Make sure of the certificate of origin and test the quality yourself',
          wordBank: ['اِحذَر', 'مِنَ', 'البِضاعَةِ', 'المُقَلَّدَة', 'تَأَكَّد', 'مِن', 'شَهادَةِ', 'المَنشَأ', 'وَاختَبِر', 'الجَودَة', 'بِنَفسِكَ', 'اِشتَرِ', 'الأَصلِيَّة'],
          grammarHint: 'اِحذَر مِن (beware of) — imperative. المُقَلَّدَة = counterfeit (Form II passive participle).',
        },
      },
      {
        npcLine: {
          arabic: 'شُكرًا جَزيلًا عَلى هَذِهِ المَعلومات. أَنتَ خَبيرٌ حَقيقي.',
          english: 'Thank you very much for this information. You are a true expert.',
          transliteration: 'shukran jaziilan \'ala haadhihi al-ma\'luumaat. anta khabiirun haqiiqii.',
        },
        playerResponse: {
          correctArabic: 'التِّجارَةُ فَنٌّ يَتَطَلَّبُ المَعرِفَةَ والصَّبر. أَتَمَنّى لَكَ التَّوفيقَ في رِحلَتِكَ',
          correctEnglish: 'Trade is an art that requires knowledge and patience. I wish you success on your journey',
          wordBank: ['التِّجارَةُ', 'فَنٌّ', 'يَتَطَلَّبُ', 'المَعرِفَةَ', 'والصَّبر', 'أَتَمَنّى', 'لَكَ', 'التَّوفيقَ', 'في', 'رِحلَتِكَ', 'لا', 'يَحتاجُ'],
          grammarHint: 'يَتَطَلَّبُ (it requires) — Form V. أَتَمَنّى لَكَ = I wish for you (Form V).',
        },
      },
    ],
    vocabularyUsed: ['tijaara', 'muntajaat', 'jawda', 'tawaabil', 'nasiiha'],
    xpReward: 150,
  },

  // ============================================================
  // BEDOUIN CAMP — 3 scenarios (A2, B1, B2)
  // ============================================================

  // BC-EXP-1: Sharing Travel Experiences (A2)
  {
    id: 'exp_bedouin_travel_001',
    zone: 'bedouin-camp',
    topic: 'travel_sharing',
    cefrLevel: 'A2',
    title: 'Sharing Travel Experiences',
    titleArabic: 'مُشارَكَة تَجارِبِ السَّفَر',
    context: 'Around the campfire, Bedouin guide Rashid asks about your travels.',
    contextArabic: 'حَولَ نارِ المُخَيَّم، المُرشِد البَدَوي راشِد يَسأَلُكَ عَن أَسفارِكَ.',
    npcName: 'Guide Rashid',
    npcPortrait: 'portrait-guide-rashid',
    exchanges: [
      {
        npcLine: {
          arabic: 'يا ضَيفي! مِن أَينَ جِئتَ؟ وَإلى أَينَ تَذهَب؟',
          english: 'My guest! Where did you come from? And where are you going?',
          transliteration: 'yaa dayfii! min ayna ji\'ta? wa-ilaa ayna tadhhab?',
        },
        playerResponse: {
          correctArabic: 'جِئتُ مِن مَدينَةٍ بَعيدَة وَأُسافِرُ إلى الجَنوب',
          correctEnglish: 'I came from a distant city and I am traveling south',
          wordBank: ['جِئتُ', 'مِن', 'مَدينَةٍ', 'بَعيدَة', 'وَأُسافِرُ', 'إلى', 'الجَنوب', 'قَريبَة', 'الشَّمال'],
          grammarHint: 'جِئتُ مِن (I came from) — irregular past tense of جاءَ. إلى الجَنوب = to the south.',
        },
      },
      {
        npcLine: {
          arabic: 'رِحلَةٌ طَويلة! هَل مَرَرتَ بِالواحات؟',
          english: 'A long journey! Did you pass through the oases?',
          transliteration: 'rihlatun tawiila! hal mararta bil-waahaat?',
        },
        playerResponse: {
          correctArabic: 'نَعَم، زُرتُ ثَلاثَ واحاتٍ وَشَرِبتُ مِن مِياهِها العَذبَة',
          correctEnglish: 'Yes, I visited three oases and drank from their sweet water',
          wordBank: ['نَعَم', 'زُرتُ', 'ثَلاثَ', 'واحاتٍ', 'وَشَرِبتُ', 'مِن', 'مِياهِها', 'العَذبَة', 'واحَةً', 'المالِحَة'],
          grammarHint: 'ثَلاثَ واحاتٍ — feminine number with feminine counted noun. مِياهِها = her/its waters.',
        },
      },
      {
        npcLine: {
          arabic: 'الصَّحراءُ أَجمَلُ ما في الأَرض. أَنا أَعرِفُها كَما أَعرِفُ وَجهي.',
          english: 'The desert is the most beautiful thing on earth. I know it as I know my face.',
          transliteration: 'as-sahraa\'u ajmalu maa fii al-ard. anaa a\'rifuhaa kamaa a\'rifu wajhii.',
        },
        playerResponse: {
          correctArabic: 'أَنتَ مَحظوظٌ لِأَنَّكَ تَعيشُ في هَذا الجَمال',
          correctEnglish: 'You are lucky because you live in this beauty',
          wordBank: ['أَنتَ', 'مَحظوظٌ', 'لِأَنَّكَ', 'تَعيشُ', 'في', 'هَذا', 'الجَمال', 'حَزين', 'تَترُكُ'],
          grammarHint: 'لِأَنَّكَ (because you) — لِ + أَنَّ + ك suffix. مَحظوظ = lucky (passive participle).',
        },
      },
      {
        npcLine: {
          arabic: 'اِبقَ مَعَنا اللَّيلَة. سَنَشرَبُ الشّاي وَنَحكي قِصَصًا.',
          english: 'Stay with us tonight. We will drink tea and tell stories.',
          transliteration: 'ibqa ma\'anaa al-layla. sanashrabu ash-shaay wa-nahkii qisasan.',
        },
        playerResponse: {
          correctArabic: 'بِكُلِّ سُرور! أُحِبُّ الاستِماعَ إلى القِصَص',
          correctEnglish: 'With pleasure! I love listening to stories',
          wordBank: ['بِكُلِّ', 'سُرور', 'أُحِبُّ', 'الاستِماعَ', 'إلى', 'القِصَص', 'أَكرَهُ', 'الكَلام'],
          grammarHint: 'الاستِماعَ إلى (listening to) — Form X verbal noun. القِصَص = stories (broken plural of قِصَّة).',
        },
      },
    ],
    vocabularyUsed: ['safar', 'rihla', 'sahraa', 'waahaat', 'qisas'],
    xpReward: 75,
  },

  // BC-EXP-2: Traditional Cooking Discussion (B1)
  {
    id: 'exp_bedouin_cooking_002',
    zone: 'bedouin-camp',
    topic: 'traditional_cooking',
    cefrLevel: 'B1',
    title: 'Traditional Cooking Discussion',
    titleArabic: 'حَديثٌ عَنِ الطَّبخ التَّقليدي',
    context: 'Grandmother Khadija teaches you the secrets of traditional Bedouin cuisine.',
    contextArabic: 'الجَدَّة خَديجة تُعَلِّمُكَ أَسرارَ المَطبَخِ البَدَوِيّ التَّقليدي.',
    npcName: 'Grandmother Khadija',
    npcPortrait: 'portrait-grandmother-khadija',
    exchanges: [
      {
        npcLine: {
          arabic: 'تَعالَ اِجلِس. سَأُعَلِّمُكَ كَيفَ نَصنَعُ المَنسَف. هَذا طَبَقُنا الوَطَني.',
          english: 'Come, sit. I will teach you how we make mansaf. This is our national dish.',
          transliteration: 'ta\'aala ijlis. sa-u\'allimuka kayfa nasna\'u al-mansaf. haadha tabaqunaa al-watanii.',
        },
        playerResponse: {
          correctArabic: 'سَمِعتُ عَنِ المَنسَف كَثيرًا. ما المُكَوِّنات الأَساسِيَّة؟',
          correctEnglish: 'I have heard a lot about mansaf. What are the basic ingredients?',
          wordBank: ['سَمِعتُ', 'عَنِ', 'المَنسَف', 'كَثيرًا', 'ما', 'المُكَوِّنات', 'الأَساسِيَّة', 'قَرَأتُ', 'الثّانَوِيَّة'],
          grammarHint: 'ما المُكَوِّنات (what are the ingredients) — ما for questioning. مُكَوِّنات is Form II active participle plural.',
        },
      },
      {
        npcLine: {
          arabic: 'نَحتاجُ لَحمَ خَروفٍ وَجَميدًا وَأُرزًّا. الجَميدُ هُوَ السِّرّ.',
          english: 'We need lamb, jameed, and rice. Jameed is the secret.',
          transliteration: 'nahtaaju lahma kharuufin wa-jamiidan wa-uruzzan. al-jamiidu huwa as-sirr.',
        },
        playerResponse: {
          correctArabic: 'ما هُوَ الجَميد؟ لَم أَسمَع بِهِ مِن قَبل',
          correctEnglish: 'What is jameed? I have not heard of it before',
          wordBank: ['ما', 'هُوَ', 'الجَميد', 'لَم', 'أَسمَع', 'بِهِ', 'مِن', 'قَبل', 'أَرَ', 'بَعد'],
          grammarHint: 'لَم أَسمَع (I have not heard) — لَم + jussive for past negation. بِهِ = about it.',
        },
      },
      {
        npcLine: {
          arabic: 'الجَميدُ لَبَنٌ مُجَفَّفٌ نَصنَعُهُ مِن حَليبِ الغَنَم. يُعطي المَنسَفَ طَعمَهُ المُمَيَّز.',
          english: 'Jameed is dried yogurt we make from sheep\'s milk. It gives mansaf its distinctive taste.',
          transliteration: 'al-jamiidu labanun mujaffafun nasna\'uhu min haliibi al-ghanam. yu\'tii al-mansafa ta\'mahu al-mumayyaz.',
        },
        playerResponse: {
          correctArabic: 'كَم مِنَ الوَقتِ يَحتاجُ الطَّبخ؟ وَهَل هُناكَ طَريقَة خاصَّة لِلتَّقديم؟',
          correctEnglish: 'How much time does the cooking need? And is there a special way to serve?',
          wordBank: ['كَم', 'مِنَ', 'الوَقتِ', 'يَحتاجُ', 'الطَّبخ', 'وَهَل', 'هُناكَ', 'طَريقَة', 'خاصَّة', 'لِلتَّقديم', 'عامَّة'],
          grammarHint: 'كَم مِنَ الوَقتِ (how much time) — كَم is used with مِن + genitive for uncountable nouns.',
        },
      },
      {
        npcLine: {
          arabic: 'يَحتاجُ ساعَتَين. وَنُقَدِّمُهُ عَلى صينِيَّة كَبيرة وَنَأكُلُ بِأَيدينا. هَذِهِ عادَتُنا.',
          english: 'It needs two hours. And we serve it on a big tray and eat with our hands. This is our custom.',
          transliteration: 'yahtaaju saa\'atayn. wa-nuqaddimuhu \'ala siiniyyatin kabiira wa-na\'kulu bi-aydiinaa. haadhihi \'aadatunaa.',
        },
        playerResponse: {
          correctArabic: 'عاداتُكُم جَميلَة. الأَكلُ مَعًا يُقَوّي الرَّوابِطَ بَينَ النّاس',
          correctEnglish: 'Your customs are beautiful. Eating together strengthens bonds between people',
          wordBank: ['عاداتُكُم', 'جَميلَة', 'الأَكلُ', 'مَعًا', 'يُقَوّي', 'الرَّوابِطَ', 'بَينَ', 'النّاس', 'غَريبَة', 'يُضعِفُ'],
          grammarHint: 'يُقَوّي (strengthens) — Form II. الرَّوابِطَ = bonds (broken plural of رابِطَة, accusative).',
        },
      },
    ],
    vocabularyUsed: ['tabkh', 'mansaf', 'mukawwinaat', 'taqdiim', '\'aadaat'],
    xpReward: 100,
  },

  // BC-EXP-3: Stargazing Conversation (B2)
  {
    id: 'exp_bedouin_stars_003',
    zone: 'bedouin-camp',
    topic: 'stargazing',
    cefrLevel: 'B2',
    title: 'Stargazing Conversation',
    titleArabic: 'حَديثٌ تَحتَ النُّجوم',
    context: 'Under the vast desert sky, wise elder Abu Nasser shares astronomical knowledge passed down through generations.',
    contextArabic: 'تَحتَ سَماءِ الصَّحراءِ الواسِعَة، الشَّيخ أبو ناصِر يُشارِكُكَ عِلمَ الفَلَكِ المُتَوارَث عَبرَ الأَجيال.',
    npcName: 'Elder Abu Nasser',
    npcPortrait: 'portrait-elder-abu-nasser',
    exchanges: [
      {
        npcLine: {
          arabic: 'اُنظُر إلى السَّماء. العَرَبُ سَمَّوا كَثيرًا مِنَ النُّجوم. هَل تَعرِفُ الدَّبَران؟',
          english: 'Look at the sky. Arabs named many stars. Do you know Aldebaran?',
          transliteration: 'undhur ilaa as-samaa\'. al-\'arabu sammaw kathiiran min an-nujuum. hal ta\'rif ad-dabaraan?',
        },
        playerResponse: {
          correctArabic: 'نَعَم، الدَّبَرانُ مِنَ الأَسماءِ العَرَبِيَّة الباقِيَة في عِلمِ الفَلَكِ الحَديث',
          correctEnglish: 'Yes, Aldebaran is one of the Arabic names that remain in modern astronomy',
          wordBank: ['نَعَم', 'الدَّبَرانُ', 'مِنَ', 'الأَسماءِ', 'العَرَبِيَّة', 'الباقِيَة', 'في', 'عِلمِ', 'الفَلَكِ', 'الحَديث', 'المَنسِيَّة', 'القَديم'],
          grammarHint: 'الباقِيَة (remaining, f.) — active participle from بَقِيَ agreeing with الأَسماء (fem. plural).',
        },
      },
      {
        npcLine: {
          arabic: 'صَحيح. وَكَذَلِكَ فَم الحوت وَالنَّسر الطّائِر. استَخدَمَ أَجدادُنا النُّجومَ لِلمِلاحَةِ في الصَّحراء.',
          english: 'Correct. And also Fomalhaut and Altair. Our ancestors used stars for navigation in the desert.',
          transliteration: 'sahiih. wa-kadhaalika fam al-huut wa-an-nasr at-taa\'ir. istakhdama ajdaadunaa an-nujuuma lil-milaaha fii as-sahraa\'.',
        },
        playerResponse: {
          correctArabic: 'هَذا يَدُلُّ عَلى أَنَّ العَرَبَ طَوَّروا عِلمَ الفَلَكِ لِحاجاتٍ عَمَلِيَّةٍ وَلَيسَ فَقَط نَظَرِيَّة',
          correctEnglish: 'This shows that Arabs developed astronomy for practical needs and not just theoretical',
          wordBank: ['هَذا', 'يَدُلُّ', 'عَلى', 'أَنَّ', 'العَرَبَ', 'طَوَّروا', 'عِلمَ', 'الفَلَكِ', 'لِحاجاتٍ', 'عَمَلِيَّةٍ', 'وَلَيسَ', 'فَقَط', 'نَظَرِيَّة', 'أَهمَلوا'],
          grammarHint: 'يَدُلُّ عَلى (it indicates) — Form I. طَوَّروا = they developed (Form II, plural). لِحاجاتٍ = for needs.',
        },
      },
      {
        npcLine: {
          arabic: 'بِالضَّبط. وَكانَ لِلعَرَبِ أَرصادٌ فَلَكِيَّة دَقيقَة ساعَدَت عُلَماءَ أوروبّا لاحِقًا.',
          english: 'Exactly. Arabs had precise astronomical observations that later helped European scientists.',
          transliteration: 'bid-dabt. wa-kaana lil-\'arabi arsaadun falakiyyatun daqiiqatun saa\'adat \'ulamaa\' urubbaa laahiqan.',
        },
        playerResponse: {
          correctArabic: 'يُؤسِفُني أَنَّ هَذا الإسهامَ لا يُذكَرُ كَثيرًا في المَراجِعِ الغَربِيَّة',
          correctEnglish: 'It saddens me that this contribution is not mentioned much in Western references',
          wordBank: ['يُؤسِفُني', 'أَنَّ', 'هَذا', 'الإسهامَ', 'لا', 'يُذكَرُ', 'كَثيرًا', 'في', 'المَراجِعِ', 'الغَربِيَّة', 'يُسعِدُني', 'العَرَبِيَّة'],
          grammarHint: 'يُؤسِفُني (it saddens me) — Form IV. يُذكَرُ = it is mentioned (Form I passive).',
        },
      },
      {
        npcLine: {
          arabic: 'المُهِمُّ أَنَّنا نَحفَظُ هَذِهِ المَعرِفَة وَنُعَلِّمَها لِلأَجيالِ القادِمَة.',
          english: 'What matters is that we preserve this knowledge and teach it to coming generations.',
          transliteration: 'al-muhimmu annanaa nahfadhu haadhihi al-ma\'rifa wa-nu\'allimahaa lil-ajyaali al-qaadima.',
        },
        playerResponse: {
          correctArabic: 'أَعِدُكَ أَنَّني سَأَنقُلُ ما تَعَلَّمتُهُ اللَّيلَةَ وَسَأُخبِرُ العالَمَ عَن حِكمَةِ البادِيَة',
          correctEnglish: 'I promise you that I will convey what I learned tonight and tell the world about the wisdom of the desert',
          wordBank: ['أَعِدُكَ', 'أَنَّني', 'سَأَنقُلُ', 'ما', 'تَعَلَّمتُهُ', 'اللَّيلَةَ', 'وَسَأُخبِرُ', 'العالَمَ', 'عَن', 'حِكمَةِ', 'البادِيَة', 'سَأَنسى', 'جَهالَةِ'],
          grammarHint: 'أَعِدُكَ أَنَّني (I promise you that I) — ما تَعَلَّمتُهُ = what I learned (relative clause).',
        },
      },
    ],
    vocabularyUsed: ['nujuum', 'falak', 'milaaha', 'arsaad', 'ma\'rifa'],
    xpReward: 150,
  },

  // ============================================================
  // ROYAL PALACE — 3 scenarios (A2, B1, B2)
  // ============================================================

  // RP-EXP-1: Cultural Protocol (A2)
  {
    id: 'exp_palace_protocol_001',
    zone: 'royal-palace',
    topic: 'protocol',
    cefrLevel: 'A2',
    title: 'Cultural Protocol',
    titleArabic: 'البُروتوكول الثَّقافي',
    context: 'Palace steward Jamal teaches you proper etiquette before meeting the king.',
    contextArabic: 'مُدَبِّر القَصر جمال يُعَلِّمُكَ آدابَ التَّعامُلِ قَبلَ مُقابَلَةِ المَلِك.',
    npcName: 'Steward Jamal',
    npcPortrait: 'portrait-steward-jamal',
    exchanges: [
      {
        npcLine: {
          arabic: 'قَبلَ أَن تَدخُلَ القاعَة، يَجِبُ أَن تَعرِفَ بَعضَ القَواعِد.',
          english: 'Before you enter the hall, you must know some rules.',
          transliteration: 'qabla an tadkhula al-qaa\'a, yajibu an ta\'rifa ba\'da al-qawaa\'id.',
        },
        playerResponse: {
          correctArabic: 'نَعَم، أُريدُ أَن أَحتَرِمَ العادات',
          correctEnglish: 'Yes, I want to respect the customs',
          wordBank: ['نَعَم', 'أُريدُ', 'أَن', 'أَحتَرِمَ', 'العادات', 'أَتَجاهَلَ', 'لا'],
          grammarHint: 'أَن أَحتَرِمَ (to respect) — أَن + subjunctive. Form VIII verb from حَرَمَ.',
        },
      },
      {
        npcLine: {
          arabic: 'أَوَّلًا، اِنحَنِ قَليلًا عِندَ الدُّخول. ثانِيًا، لا تَتَكَلَّم حَتّى يَسأَلَكَ المَلِك.',
          english: 'First, bow slightly upon entering. Second, do not speak until the king asks you.',
          transliteration: 'awwalan, inhani qaliilan \'inda ad-dukhuul. thaaniyan, laa tatakallam hattaa yas\'alaka al-malik.',
        },
        playerResponse: {
          correctArabic: 'فَهِمتُ. هَل هُناكَ تَحِيَّة خاصَّة أَقولُها؟',
          correctEnglish: 'I understand. Is there a special greeting I should say?',
          wordBank: ['فَهِمتُ', 'هَل', 'هُناكَ', 'تَحِيَّة', 'خاصَّة', 'أَقولُها', 'عامَّة', 'أَفعَلُها'],
          grammarHint: 'أَقولُها (I say it) — the ها suffix refers to تَحِيَّة (greeting, feminine).',
        },
      },
      {
        npcLine: {
          arabic: 'قُل: "السَّلامُ عَلى مَولانا المَلِك. أَطالَ اللهُ عُمرَه."',
          english: 'Say: "Peace upon our lord the king. May God prolong his life."',
          transliteration: 'qul: "as-salaamu \'ala mawlaanaa al-malik. ataala allaahu \'umrahu."',
        },
        playerResponse: {
          correctArabic: 'سَأَتَذَكَّرُ ذَلِك. شُكرًا لَكَ يا جَمال',
          correctEnglish: 'I will remember that. Thank you, Jamal',
          wordBank: ['سَأَتَذَكَّرُ', 'ذَلِك', 'شُكرًا', 'لَكَ', 'يا', 'جَمال', 'سَأَنسى'],
          grammarHint: 'سَأَتَذَكَّرُ (I will remember) — سَ + Form V imperfect. ذَلِك = that (demonstrative).',
        },
      },
      {
        npcLine: {
          arabic: 'أَحسَنتَ! أَنتَ جاهِزٌ الآن. تَوَكَّل عَلى الله.',
          english: 'Well done! You are ready now. Put your trust in God.',
          transliteration: 'ahsanta! anta jaahizun al-aan. tawakkal \'alaa allaah.',
        },
        playerResponse: {
          correctArabic: 'بِسمِ اللهِ. أَنا مُستَعِدّ',
          correctEnglish: 'In the name of God. I am ready',
          wordBank: ['بِسمِ', 'اللهِ', 'أَنا', 'مُستَعِدّ', 'خائِف', 'لَستُ'],
          grammarHint: 'بِسمِ اللهِ (in the name of God) — said before undertaking important tasks.',
        },
      },
    ],
    vocabularyUsed: ['malik', 'tahiyya', 'qawaa\'id', 'ihtiraam', 'adaab'],
    xpReward: 75,
  },

  // RP-EXP-2: Diplomatic Meeting (B1)
  {
    id: 'exp_palace_diplomat_002',
    zone: 'royal-palace',
    topic: 'diplomacy',
    cefrLevel: 'B1',
    title: 'Diplomatic Meeting',
    titleArabic: 'لِقاءٌ دِبلوماسي',
    context: 'You represent your people in a meeting with the royal advisor to discuss a peace agreement.',
    contextArabic: 'تُمَثِّلُ شَعبَكَ في لِقاءٍ مَعَ المُستَشارِ المَلَكِيّ لِمُناقَشَةِ اتِّفاقِ سَلام.',
    npcName: 'Royal Advisor Munir',
    npcPortrait: 'portrait-advisor-munir',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَهلًا بِالسَّفير. المَلِكُ يَرغَبُ في السَّلامِ بَينَ شُعوبِنا. ما شُروطُكُم؟',
          english: 'Welcome, ambassador. The king desires peace between our peoples. What are your conditions?',
          transliteration: 'ahlan bis-safiir. al-maliku yarghab fii as-salaami bayna shu\'uubinaa. maa shuruutukum?',
        },
        playerResponse: {
          correctArabic: 'شُكرًا لِلمَلِك. نُريدُ تَبادُلًا تِجارِيًّا عادِلًا وَحُرِّيَّةَ التَّنَقُّل',
          correctEnglish: 'Thank the king. We want fair trade exchange and freedom of movement',
          wordBank: ['شُكرًا', 'لِلمَلِك', 'نُريدُ', 'تَبادُلًا', 'تِجارِيًّا', 'عادِلًا', 'وَحُرِّيَّةَ', 'التَّنَقُّل', 'سَيطَرَةً', 'ظالِمًا'],
          grammarHint: 'تَبادُلًا تِجارِيًّا عادِلًا — three words in accusative: noun + two adjectives all agreeing.',
        },
      },
      {
        npcLine: {
          arabic: 'شُروطٌ مَعقولَة. المَلِكُ يُوافِقُ عَلى التِّجارَة. لَكِنَّ التَّنَقُّلَ يَحتاجُ إلى تَنظيم.',
          english: 'Reasonable conditions. The king agrees to trade. But movement needs regulation.',
          transliteration: 'shuuruutun ma\'quula. al-maliku yuwaafiq \'ala at-tijaara. lakinna at-tanaqqula yahtaaju ilaa tandhiim.',
        },
        playerResponse: {
          correctArabic: 'نَتَّفِقُ عَلى وَضعِ قَواعِدَ مُشتَرَكَة تَحتَرِمُ حُقوقَ الطَّرَفَين',
          correctEnglish: 'We agree to set common rules that respect the rights of both parties',
          wordBank: ['نَتَّفِقُ', 'عَلى', 'وَضعِ', 'قَواعِدَ', 'مُشتَرَكَة', 'تَحتَرِمُ', 'حُقوقَ', 'الطَّرَفَين', 'نَرفُضُ', 'تُهمِلُ'],
          grammarHint: 'نَتَّفِقُ عَلى (we agree on) — Form VIII. تَحتَرِمُ acts as adjective clause for قَواعِد.',
        },
      },
      {
        npcLine: {
          arabic: 'حَسَنًا. سَنُعِدُّ وَثيقَةَ الاتِّفاق. مَتى يُمكِنُكُم التَّوقيع؟',
          english: 'Good. We will prepare the agreement document. When can you sign?',
          transliteration: 'hasanan. sanu\'iddu wathiiqata al-ittifaaq. mataa yumkinukum at-tawqii\'?',
        },
        playerResponse: {
          correctArabic: 'بَعدَ أَن نُراجِعَ الوَثيقَة مَعَ مُستَشارينا. نَحتاجُ ثَلاثَةَ أَيّام',
          correctEnglish: 'After we review the document with our advisors. We need three days',
          wordBank: ['بَعدَ', 'أَن', 'نُراجِعَ', 'الوَثيقَة', 'مَعَ', 'مُستَشارينا', 'نَحتاجُ', 'ثَلاثَةَ', 'أَيّام', 'قَبلَ', 'نَتَجاهَلَ'],
          grammarHint: 'بَعدَ أَن نُراجِعَ (after we review) — بَعدَ أَن + subjunctive for future time clause.',
        },
      },
      {
        npcLine: {
          arabic: 'مَقبول. فَلنَعمَل مَعًا لِبِناءِ مُستَقبَلٍ أَفضَل.',
          english: 'Acceptable. Let us work together to build a better future.',
          transliteration: 'maqbuul. fal-na\'mal ma\'an li-binaa\'i mustaqbalin afdal.',
        },
        playerResponse: {
          correctArabic: 'السَّلامُ هُوَ الأَساس. نَتَطَلَّعُ إلى تَعاوُنٍ مُثمِر بَينَ شُعوبِنا',
          correctEnglish: 'Peace is the foundation. We look forward to fruitful cooperation between our peoples',
          wordBank: ['السَّلامُ', 'هُوَ', 'الأَساس', 'نَتَطَلَّعُ', 'إلى', 'تَعاوُنٍ', 'مُثمِر', 'بَينَ', 'شُعوبِنا', 'الحَربُ', 'صِراعٍ'],
          grammarHint: 'نَتَطَلَّعُ إلى (we look forward to) — Form V. تَعاوُنٍ مُثمِر = fruitful cooperation (genitive).',
        },
      },
    ],
    vocabularyUsed: ['salaam', 'tijaara', 'ittifaaq', 'huquuq', 'ta\'aawun'],
    xpReward: 100,
  },

  // RP-EXP-3: Royal Announcement (B2)
  {
    id: 'exp_palace_announce_003',
    zone: 'royal-palace',
    topic: 'announcement',
    cefrLevel: 'B2',
    title: 'Royal Announcement',
    titleArabic: 'إعلانٌ مَلَكي',
    context: 'The king asks you to help draft a royal decree establishing a new academy of sciences.',
    contextArabic: 'المَلِكُ يَطلُبُ مِنكَ المُساعَدَة في صِياغَةِ مَرسومٍ مَلَكِيّ لِتَأسيسِ أَكاديمِيَّةٍ لِلعُلوم.',
    npcName: 'King Faisal',
    npcPortrait: 'portrait-king-faisal',
    exchanges: [
      {
        npcLine: {
          arabic: 'أُريدُ تَأسيسَ أَكاديمِيَّةٍ تَجمَعُ أَفضَلَ العُقولِ العَرَبِيَّة. ساعِدني في صِياغَةِ الإعلان.',
          english: 'I want to establish an academy that gathers the best Arab minds. Help me draft the announcement.',
          transliteration: 'uriidu ta\'siisa akaadiimiyyatin tajma\'u afdala al-\'uquuli al-\'arabiyya. saa\'idnii fii siyaaghati al-i\'laan.',
        },
        playerResponse: {
          correctArabic: 'يا مَولاي، يَجِبُ أَن يُبرِزَ الإعلانُ رُؤيَةَ المَملَكَةِ لِلتَّقَدُّمِ العِلمي',
          correctEnglish: 'My lord, the announcement must highlight the kingdom\'s vision for scientific progress',
          wordBank: ['يا', 'مَولاي', 'يَجِبُ', 'أَن', 'يُبرِزَ', 'الإعلانُ', 'رُؤيَةَ', 'المَملَكَةِ', 'لِلتَّقَدُّمِ', 'العِلمي', 'يُخفِيَ', 'التَّراجُعِ'],
          grammarHint: 'يُبرِزَ (to highlight) — Form IV subjunctive. رُؤيَةَ المَملَكَةِ = the vision of the kingdom (idaafa).',
        },
      },
      {
        npcLine: {
          arabic: 'أُريدُ أَن تَكونَ مَفتوحَةً لِلجَميع بِغَضِّ النَّظَرِ عَنِ الأَصلِ أَوِ الثَّروة.',
          english: 'I want it to be open to everyone regardless of origin or wealth.',
          transliteration: 'uriidu an takuuna maftuuhatan lil-jamii\' bi-ghadd an-nazhari \'an al-asli aw ath-tharwa.',
        },
        playerResponse: {
          correctArabic: 'هَذا مَبدَأٌ نَبيل يَتَّسِقُ مَعَ تَقاليدِ بَيتِ الحِكمَةِ حَيثُ كانَ العِلمُ لِلجَميع',
          correctEnglish: 'This is a noble principle consistent with the traditions of the House of Wisdom where knowledge was for all',
          wordBank: ['هَذا', 'مَبدَأٌ', 'نَبيل', 'يَتَّسِقُ', 'مَعَ', 'تَقاليدِ', 'بَيتِ', 'الحِكمَةِ', 'حَيثُ', 'كانَ', 'العِلمُ', 'لِلجَميع', 'يَتَناقَضُ', 'لِلنُّخبَة'],
          grammarHint: 'يَتَّسِقُ مَعَ (it is consistent with) — Form VIII. حَيثُ introduces a place/circumstance clause.',
        },
      },
      {
        npcLine: {
          arabic: 'أَحسَنتَ! وَماذا عَنِ التَّمويلِ وَالإدارَة؟',
          english: 'Well said! And what about funding and management?',
          transliteration: 'ahsanta! wa-maadha \'an at-tamwiili wa-al-idaara?',
        },
        playerResponse: {
          correctArabic: 'أَقتَرِحُ أَن يُموَّلَ مِن خَزينَةِ الدَّولَة وَأَن يُديرَها مَجلِسٌ مِنَ العُلَماء المُنتَخَبين',
          correctEnglish: 'I suggest it be funded from the state treasury and managed by a council of elected scholars',
          wordBank: ['أَقتَرِحُ', 'أَن', 'يُموَّلَ', 'مِن', 'خَزينَةِ', 'الدَّولَة', 'وَأَن', 'يُديرَها', 'مَجلِسٌ', 'مِنَ', 'العُلَماء', 'المُنتَخَبين', 'يُدَمَّرَ', 'المُعَيَّنين'],
          grammarHint: 'يُموَّلَ (be funded) — Form II passive subjunctive. يُديرَها = manage it (Form IV subjunctive + suffix).',
        },
      },
      {
        npcLine: {
          arabic: 'مَرسومٌ حَكيم. سَيَكونُ هَذا إرثي لِلأَجيالِ القادِمَة.',
          english: 'A wise decree. This will be my legacy for coming generations.',
          transliteration: 'marsumun hakiim. sayakuunu haadha irthii lil-ajyaali al-qaadima.',
        },
        playerResponse: {
          correctArabic: 'التّاريخُ سَيَذكُرُ هَذِهِ اللَّحظَة بِاعتِبارِها نُقطَةَ تَحَوُّلٍ في مَسيرَةِ أُمَّتِنا العِلمِيَّة',
          correctEnglish: 'History will remember this moment as a turning point in our nation\'s scientific journey',
          wordBank: ['التّاريخُ', 'سَيَذكُرُ', 'هَذِهِ', 'اللَّحظَة', 'بِاعتِبارِها', 'نُقطَةَ', 'تَحَوُّلٍ', 'في', 'مَسيرَةِ', 'أُمَّتِنا', 'العِلمِيَّة', 'سَيَنسى', 'تَراجُعٍ'],
          grammarHint: 'بِاعتِبارِها (considering it as) — Form VIII verbal noun + suffix. نُقطَةَ تَحَوُّلٍ = turning point.',
        },
      },
    ],
    vocabularyUsed: ['akaadiimiyya', 'marsuum', 'tamwiil', 'irth', 'taariikh'],
    xpReward: 150,
  },

  // ============================================================
  // MOUNTAIN PASS — 3 scenarios (A2, B1, B2)
  // ============================================================

  // MP-EXP-1: Emergency Situation (A2)
  {
    id: 'exp_mountain_emergency_001',
    zone: 'mountain-pass',
    topic: 'emergency',
    cefrLevel: 'A2',
    title: 'Emergency Situation',
    titleArabic: 'حالَة طَوارِئ',
    context: 'A traveler has fallen and needs help. Mountain guard Bilal coordinates the rescue.',
    contextArabic: 'مُسافِرٌ سَقَطَ وَيَحتاجُ مُساعَدَة. حارِسُ الجَبَلِ بِلال يُنَسِّقُ عَمَلِيَّةَ الإنقاذ.',
    npcName: 'Guard Bilal',
    npcPortrait: 'portrait-guard-bilal',
    exchanges: [
      {
        npcLine: {
          arabic: 'بِسُرعة! هُناكَ شَخصٌ مَجروح عَلى الطَّريق. هَل تَستَطيعُ المُساعَدَة؟',
          english: 'Quickly! There is an injured person on the road. Can you help?',
          transliteration: 'bi-sur\'a! hunaaka shakhsun majruuh \'ala at-tariiq. hal tastatii\'u al-musaa\'ada?',
        },
        playerResponse: {
          correctArabic: 'نَعَم! ماذا أَفعَل؟',
          correctEnglish: 'Yes! What do I do?',
          wordBank: ['نَعَم', 'ماذا', 'أَفعَل', 'لا', 'أَعرِفُ', 'مَتى'],
          grammarHint: 'ماذا أَفعَل (what do I do) — ماذا for "what" + imperfect verb.',
        },
      },
      {
        npcLine: {
          arabic: 'اِذهَب وَأَحضِر ماءً وَقُماشًا لِرِجلِه. أَنا سَأَحمِلُه.',
          english: 'Go and bring water and cloth for his leg. I will carry him.',
          transliteration: 'idhhab wa-ahdir maa\'an wa-qumashan li-rijlihi. anaa sa-ahmiluhu.',
        },
        playerResponse: {
          correctArabic: 'حاضِر! سَأَعودُ بِسُرعة',
          correctEnglish: 'Right away! I will return quickly',
          wordBank: ['حاضِر', 'سَأَعودُ', 'بِسُرعة', 'بِبُطء', 'لَن', 'أَعودَ'],
          grammarHint: 'حاضِر (ready/right away) — commonly used to show compliance. سَأَعودُ = I will return.',
        },
      },
      {
        npcLine: {
          arabic: 'أَحسَنتَ! ساعِدني أَن أَلُفَّ القُماشَ حَولَ الجُرح.',
          english: 'Well done! Help me wrap the cloth around the wound.',
          transliteration: 'ahsanta! saa\'idnii an aluffa al-qumaasha hawla al-jurh.',
        },
        playerResponse: {
          correctArabic: 'هَل يَحتاجُ إلى طَبيب؟',
          correctEnglish: 'Does he need a doctor?',
          wordBank: ['هَل', 'يَحتاجُ', 'إلى', 'طَبيب', 'يُريدُ', 'ماء'],
          grammarHint: 'هَل يَحتاجُ إلى (does he need) — simple yes/no question with هَل.',
        },
      },
      {
        npcLine: {
          arabic: 'نَعَم، سَنَأخُذُهُ إلى القَريَة. شُكرًا لَكَ. أَنقَذتَ حَياتَه.',
          english: 'Yes, we will take him to the village. Thank you. You saved his life.',
          transliteration: 'na\'am, sana\'khudhuhu ilaa al-qarya. shukran laka. anqadhta hayaatahu.',
        },
        playerResponse: {
          correctArabic: 'الحَمدُ لله. نَحنُ هُنا لِنُساعِدَ بَعضَنا',
          correctEnglish: 'Praise God. We are here to help each other',
          wordBank: ['الحَمدُ', 'لله', 'نَحنُ', 'هُنا', 'لِنُساعِدَ', 'بَعضَنا', 'وَحدَنا', 'لِنَترُكَ'],
          grammarHint: 'لِنُساعِدَ (to help) — لِ + subjunctive expresses purpose. بَعضَنا = each other.',
        },
      },
    ],
    vocabularyUsed: ['sur\'a', 'musaa\'ada', 'majruuh', 'tabiib', 'inqaadh'],
    xpReward: 75,
  },

  // MP-EXP-2: Discussing Geology (B1)
  {
    id: 'exp_mountain_geology_002',
    zone: 'mountain-pass',
    topic: 'geology',
    cefrLevel: 'B1',
    title: 'Discussing Geology',
    titleArabic: 'الحَديثُ عَنِ الجيولوجيا',
    context: 'Geologist Samira explains the formation of the mountains. You discuss the rock types and their history.',
    contextArabic: 'الجيولوجِيَّة سَميرة تَشرَحُ تَكَوُّنَ الجِبال. تُناقِشانِ أَنواعَ الصُّخورِ وَتاريخَها.',
    npcName: 'Geologist Samira',
    npcPortrait: 'portrait-geologist-samira',
    exchanges: [
      {
        npcLine: {
          arabic: 'هَذِهِ الجِبالُ تَكَوَّنَت قَبلَ ملايينِ السِّنين. اُنظُر إلى طَبَقاتِ الصُّخور.',
          english: 'These mountains formed millions of years ago. Look at the rock layers.',
          transliteration: 'haadhihi al-jibaalu takawwanat qabla malaayiini as-siniin. undhur ilaa tabaqaati as-sukhuur.',
        },
        playerResponse: {
          correctArabic: 'مُذهِل! هَل يُمكِنُكِ أَن تَشرَحي لي كَيفَ تَكَوَّنَت؟',
          correctEnglish: 'Amazing! Can you explain to me how they formed?',
          wordBank: ['مُذهِل', 'هَل', 'يُمكِنُكِ', 'أَن', 'تَشرَحي', 'لي', 'كَيفَ', 'تَكَوَّنَت', 'لِماذا', 'اختَفَت'],
          grammarHint: 'يُمكِنُكِ (you (f) can) — the كِ suffix is feminine. تَشرَحي = you (f) explain (subjunctive).',
        },
      },
      {
        npcLine: {
          arabic: 'الصُّخورُ الرُّسوبِيَّة تَراكَمَت في قاعِ البَحرِ القَديم. ثُمَّ رَفَعَتها حَرَكَةُ الصَّفائِحِ التِّكتونِيَّة.',
          english: 'Sedimentary rocks accumulated on the floor of an ancient sea. Then tectonic plate movement lifted them.',
          transliteration: 'as-sukhuuru ar-rusuubiyyatu taraakam fii qaa\'i al-bahri al-qadiim. thumma rafa\'athaa harakatu as-safaa\'ihi at-tiktuuniyya.',
        },
        playerResponse: {
          correctArabic: 'إذَن هَذِهِ المِنطَقَة كانَت تَحتَ البَحر! هَل يُمكِنُ أَن نَجِدَ أَحافير هُنا؟',
          correctEnglish: 'So this area was under the sea! Is it possible to find fossils here?',
          wordBank: ['إذَن', 'هَذِهِ', 'المِنطَقَة', 'كانَت', 'تَحتَ', 'البَحر', 'هَل', 'يُمكِنُ', 'أَن', 'نَجِدَ', 'أَحافير', 'هُنا', 'فَوقَ', 'نَفقِدَ'],
          grammarHint: 'أَحافير (fossils) — broken plural of أُحفورَة. كانَت تَحتَ = it was under (past location).',
        },
      },
      {
        npcLine: {
          arabic: 'بِالتَّأكيد! وَجَدتُ أَحافيرَ لِأَسماكٍ وَأَصدافٍ في هَذِهِ الصُّخور.',
          english: 'Certainly! I found fossils of fish and shells in these rocks.',
          transliteration: 'bit-ta\'kiid! wajadtu ahafiira li-asmakin wa-asdaafin fii haadhihi as-sukhuur.',
        },
        playerResponse: {
          correctArabic: 'الطَّبيعَةُ كِتابٌ مَفتوح لِمَن يَعرِفُ أَن يَقرَأَهُ',
          correctEnglish: 'Nature is an open book for those who know how to read it',
          wordBank: ['الطَّبيعَةُ', 'كِتابٌ', 'مَفتوح', 'لِمَن', 'يَعرِفُ', 'أَن', 'يَقرَأَهُ', 'مُغلَق', 'يَجهَلُ'],
          grammarHint: 'لِمَن يَعرِفُ (for those who know) — لِ + مَن as relative pronoun "whoever."',
        },
      },
      {
        npcLine: {
          arabic: 'كَلامٌ جَميل. تَعالَ غَدًا وَسَأُريكَ المَغارة التي فيها صُخورٌ بُركانِيَّة.',
          english: 'Beautiful words. Come tomorrow and I will show you the cave with volcanic rocks.',
          transliteration: 'kalaamun jamiil. ta\'aala ghadan wa-sa-uriika al-maghaara allatii fiihaa sukhuurun burkaaniyya.',
        },
        playerResponse: {
          correctArabic: 'سَأَكونُ هُناكَ عِندَ الفَجر. شُكرًا لَكِ يا سَميرة',
          correctEnglish: 'I will be there at dawn. Thank you, Samira',
          wordBank: ['سَأَكونُ', 'هُناكَ', 'عِندَ', 'الفَجر', 'شُكرًا', 'لَكِ', 'يا', 'سَميرة', 'الظُّهر', 'لَكَ'],
          grammarHint: 'عِندَ الفَجر (at dawn) — عِندَ can mean "at" for time. لَكِ = to you (feminine).',
        },
      },
    ],
    vocabularyUsed: ['jibal', 'sukhuur', 'ahaafir', 'tabii\'a', 'maghara'],
    xpReward: 100,
  },

  // MP-EXP-3: Planning an Expedition (B2)
  {
    id: 'exp_mountain_expedition_003',
    zone: 'mountain-pass',
    topic: 'expedition',
    cefrLevel: 'B2',
    title: 'Planning an Expedition',
    titleArabic: 'التَّخطيط لِرِحلَة استِكشافِيَّة',
    context: 'Explorer Khalil proposes a dangerous expedition across the mountain range. You discuss logistics and risks.',
    contextArabic: 'المُستَكشِف خَليل يَقتَرِحُ رِحلَةً خَطيرة عَبرَ سِلسِلَة الجِبال. تُناقِشانِ اللُّوجِستِيّات وَالمَخاطِر.',
    npcName: 'Explorer Khalil',
    npcPortrait: 'portrait-explorer-khalil',
    exchanges: [
      {
        npcLine: {
          arabic: 'أُخَطِّطُ لِعُبورِ المَمَرِّ الجَبَلِيّ المَهجور. لَم يَعبُرهُ أَحَدٌ مُنذُ عُقود. هَل تَنضَمُّ إلَيّ؟',
          english: 'I am planning to cross the abandoned mountain pass. No one has crossed it in decades. Will you join me?',
          transliteration: 'ukhattitu li-\'ubuuri al-mamarri al-jabalii al-mahjuur. lam ya\'burhu ahadun mundhu \'uquud. hal tandammu ilayy?',
        },
        playerResponse: {
          correctArabic: 'فِكرَةٌ جَريئَة. لَكِن يَجِبُ أَن نُقَيِّمَ المَخاطِرَ بِعِنايَةٍ قَبلَ اتِّخاذِ القَرار',
          correctEnglish: 'A bold idea. But we must assess the risks carefully before making the decision',
          wordBank: ['فِكرَةٌ', 'جَريئَة', 'لَكِن', 'يَجِبُ', 'أَن', 'نُقَيِّمَ', 'المَخاطِرَ', 'بِعِنايَةٍ', 'قَبلَ', 'اتِّخاذِ', 'القَرار', 'نَتَجاهَلَ', 'بَعدَ'],
          grammarHint: 'نُقَيِّمَ (we assess) — Form II subjunctive. اتِّخاذِ القَرار = making the decision (Form VIII verbal noun + idaafa).',
        },
      },
      {
        npcLine: {
          arabic: 'مَعَكَ حَقّ. نَحتاجُ مُؤَنًا لِعَشَرَةِ أَيّام وَحِبالًا وَخَرائِطَ قَديمَة لِلمَمَرّ.',
          english: 'You are right. We need provisions for ten days, ropes, and old maps of the pass.',
          transliteration: 'ma\'aka haqq. nahtaaju mu\'anan li-\'asharati ayyaam wa-hibaalan wa-kharaa\'ita qadiimatan lil-mamarr.',
        },
        playerResponse: {
          correctArabic: 'وَيَجِبُ أَن نُعلِمَ القَريَةَ بِمَسارِنا وَنَتَّفِقَ عَلى خُطَّةِ إنقاذٍ في حالَةِ الطَّوارِئ',
          correctEnglish: 'And we must inform the village of our route and agree on a rescue plan in case of emergency',
          wordBank: ['وَيَجِبُ', 'أَن', 'نُعلِمَ', 'القَريَةَ', 'بِمَسارِنا', 'وَنَتَّفِقَ', 'عَلى', 'خُطَّةِ', 'إنقاذٍ', 'في', 'حالَةِ', 'الطَّوارِئ', 'نُخفِيَ', 'هُجومٍ'],
          grammarHint: 'نُعلِمَ (we inform) — Form IV subjunctive. خُطَّةِ إنقاذٍ = rescue plan (idaafa with indefinite second term).',
        },
      },
      {
        npcLine: {
          arabic: 'تَفكيرٌ استِراتيجي. وَماذا عَنِ الطَّقس؟ قَد تَهُبُّ عَواصِفُ ثَلجِيَّة.',
          english: 'Strategic thinking. And what about the weather? Snowstorms may blow.',
          transliteration: 'tafkiirun istiraatiijii. wa-maadha \'an at-taqs? qad tahubbu \'awaasif thaljiyya.',
        },
        playerResponse: {
          correctArabic: 'سَنَرصُدُ الطَّقسَ يَومِيًّا وَنُحَدِّدُ نِقاطَ لُجوءٍ آمِنَة عَلى طولِ المَسار',
          correctEnglish: 'We will monitor the weather daily and identify safe shelter points along the route',
          wordBank: ['سَنَرصُدُ', 'الطَّقسَ', 'يَومِيًّا', 'وَنُحَدِّدُ', 'نِقاطَ', 'لُجوءٍ', 'آمِنَة', 'عَلى', 'طولِ', 'المَسار', 'سَنَتَجاهَلُ', 'خَطيرَة'],
          grammarHint: 'سَنَرصُدُ (we will monitor) — future. نِقاطَ لُجوءٍ = shelter points (idaafa, accusative).',
        },
      },
      {
        npcLine: {
          arabic: 'خُطَّةٌ مُحكَمَة. سَنَكتُبُ التّاريخ مَعًا إنْ شاءَ الله.',
          english: 'A solid plan. We will write history together, God willing.',
          transliteration: 'khuttatun muhkama. sanaktubu at-taariikha ma\'an in shaa\'a allaah.',
        },
        playerResponse: {
          correctArabic: 'مَن لا يُخاطِرُ لا يَكتَشِف. لِنَنطَلِق عِندَ أَوَّلِ ضَوءٍ بَعدَ إتمامِ التَّحضيرات',
          correctEnglish: 'He who does not take risks does not discover. Let us depart at first light after completing preparations',
          wordBank: ['مَن', 'لا', 'يُخاطِرُ', 'يَكتَشِف', 'لِنَنطَلِق', 'عِندَ', 'أَوَّلِ', 'ضَوءٍ', 'بَعدَ', 'إتمامِ', 'التَّحضيرات', 'يُحاوِلُ', 'قَبلَ'],
          grammarHint: 'مَن لا يُخاطِرُ لا يَكتَشِف (who does not risk does not discover) — مَن as conditional relative. Form III + Form VIII.',
        },
      },
    ],
    vocabularyUsed: ['istikshaf', 'makhaatir', 'khutta', 'masar', 'taqs'],
    xpReward: 150,
  },

  // ============================================================
  // COASTAL PORT — 3 scenarios (A2, B1, B2)
  // ============================================================

  // CP-EXP-1: Storm Warning (A2)
  {
    id: 'exp_port_storm_001',
    zone: 'coastal-port',
    topic: 'storm_warning',
    cefrLevel: 'A2',
    title: 'Storm Warning',
    titleArabic: 'تَحذيرٌ مِنَ العاصِفَة',
    context: 'Harbor master Youssef warns fishermen about an incoming storm.',
    contextArabic: 'مُديرُ المِيناء يوسُف يُحَذِّرُ الصَّيّادينَ مِن عاصِفَةٍ قادِمَة.',
    npcName: 'Harbor Master Youssef',
    npcPortrait: 'portrait-harbor-youssef',
    exchanges: [
      {
        npcLine: {
          arabic: 'اِنتِباه! عاصِفَةٌ قَوِيَّة قادِمَة مِنَ البَحر. يَجِبُ أَن نَستَعِدّ.',
          english: 'Attention! A strong storm is coming from the sea. We must prepare.',
          transliteration: 'intibaah! \'aasifatun qawiyyatun qaadima min al-bahr. yajibu an nasta\'idd.',
        },
        playerResponse: {
          correctArabic: 'ماذا نَفعَلُ أَوَّلًا؟',
          correctEnglish: 'What do we do first?',
          wordBank: ['ماذا', 'نَفعَلُ', 'أَوَّلًا', 'أَخيرًا', 'نَترُكُ', 'مَتى'],
          grammarHint: 'ماذا نَفعَلُ (what do we do) — ماذا + first person plural imperfect.',
        },
      },
      {
        npcLine: {
          arabic: 'اِربِط القَوارِبَ جَيِّدًا. وَأَحضِر الحِبالَ القَوِيَّة.',
          english: 'Tie the boats well. And bring the strong ropes.',
          transliteration: 'irbit al-qawaariba jayyidan. wa-ahdir al-hibaala al-qawiyya.',
        },
        playerResponse: {
          correctArabic: 'حاضِر! سَأَربِطُ كُلَّ القَوارِب',
          correctEnglish: 'Ready! I will tie all the boats',
          wordBank: ['حاضِر', 'سَأَربِطُ', 'كُلَّ', 'القَوارِب', 'سَأَترُكُ', 'بَعضَ'],
          grammarHint: 'سَأَربِطُ (I will tie) — future tense. كُلَّ + definite noun = all the boats.',
        },
      },
      {
        npcLine: {
          arabic: 'أَحسَنتَ! وَأَخبِر الصَّيّادينَ أَن يَعودوا إلى الشّاطِئ فَورًا.',
          english: 'Well done! And tell the fishermen to return to shore immediately.',
          transliteration: 'ahsanta! wa-akhbir as-sayyaadiina an ya\'uuduu ilaa ash-shaati\' fawran.',
        },
        playerResponse: {
          correctArabic: 'سَأَذهَبُ إلَيهِم الآن. لا وَقتَ لِلتَّأخير',
          correctEnglish: 'I will go to them now. No time for delay',
          wordBank: ['سَأَذهَبُ', 'إلَيهِم', 'الآن', 'لا', 'وَقتَ', 'لِلتَّأخير', 'غَدًا', 'لِلنَّوم'],
          grammarHint: 'لا وَقتَ لِ (no time for) — لا + accusative for categorical negation.',
        },
      },
      {
        npcLine: {
          arabic: 'بارَكَ اللهُ فيك! بَعدَ العاصِفَة سَنَحتَفِل بِسَلامَتِنا.',
          english: 'God bless you! After the storm we will celebrate our safety.',
          transliteration: 'baaraka allaahu fiik! ba\'da al-\'aasifa sanahttafil bi-salaamatinaa.',
        },
        playerResponse: {
          correctArabic: 'إنْ شاءَ الله. السَّلامَةُ أَوَّلًا',
          correctEnglish: 'God willing. Safety first',
          wordBank: ['إنْ', 'شاءَ', 'الله', 'السَّلامَةُ', 'أَوَّلًا', 'المالُ'],
          grammarHint: 'السَّلامَةُ أَوَّلًا (safety first) — أَوَّلًا used as adverb meaning "first/primarily."',
        },
      },
    ],
    vocabularyUsed: ['\'aasifa', 'qawarib', 'hibaal', 'sayyaadiina', 'salaama'],
    xpReward: 75,
  },

  // CP-EXP-2: Fishing Techniques (B1)
  {
    id: 'exp_port_fishing_002',
    zone: 'coastal-port',
    topic: 'fishing',
    cefrLevel: 'B1',
    title: 'Fishing Techniques',
    titleArabic: 'تِقنِيّات الصَّيد',
    context: 'Master fisherman Nabil shares traditional fishing knowledge and discusses changes in the trade.',
    contextArabic: 'الصَّيّاد المُحتَرِف نَبيل يُشارِكُكَ مَعرِفَتَهُ التَّقليدِيَّة بِالصَّيد وَيُناقِشُ التَّغيُّرات في المِهنَة.',
    npcName: 'Fisherman Nabil',
    npcPortrait: 'portrait-fisherman-nabil',
    exchanges: [
      {
        npcLine: {
          arabic: 'أَنا أَصطادُ مُنذُ ثَلاثينَ سَنَة. تَعَلَّمتُ مِن أَبي وَجَدّي. كُلُّ سَمَكَةٍ لَها طَريقَة.',
          english: 'I have been fishing for thirty years. I learned from my father and grandfather. Every fish has its technique.',
          transliteration: 'anaa astaadu mundhu thalaathiina sana. ta\'allamtu min abii wa-jaddii. kullu samakatin lahaa tariiqa.',
        },
        playerResponse: {
          correctArabic: 'ما الفَرقُ بَينَ صَيدِ السَّمَكِ الكَبير وَالصَّغير؟',
          correctEnglish: 'What is the difference between catching big and small fish?',
          wordBank: ['ما', 'الفَرقُ', 'بَينَ', 'صَيدِ', 'السَّمَكِ', 'الكَبير', 'وَالصَّغير', 'التَّشابُهُ'],
          grammarHint: 'ما الفَرقُ بَينَ (what is the difference between) — standard comparison structure.',
        },
      },
      {
        npcLine: {
          arabic: 'السَّمَكُ الكَبيرُ يَحتاجُ شَبَكَةً قَوِيَّة وَصَبرًا طَويلًا. أَمّا الصَّغير فَيُصطادُ بِالخَيط.',
          english: 'Big fish need a strong net and long patience. As for small fish, they are caught with a line.',
          transliteration: 'as-samaku al-kabiiru yahtaaju shabakatan qawiyyatan wa-sabran tawiilan. amma as-saghiiru fa-yustaadu bil-khayt.',
        },
        playerResponse: {
          correctArabic: 'هَل تَأَثَّرَ الصَّيدُ بِالتَّغَيُّراتِ البيئِيَّة في السَّنَواتِ الأَخيرة؟',
          correctEnglish: 'Has fishing been affected by environmental changes in recent years?',
          wordBank: ['هَل', 'تَأَثَّرَ', 'الصَّيدُ', 'بِالتَّغَيُّراتِ', 'البيئِيَّة', 'في', 'السَّنَواتِ', 'الأَخيرة', 'تَحَسَّنَ', 'الأولى'],
          grammarHint: 'تَأَثَّرَ (it was affected) — Form V passive-reflexive. بِالتَّغَيُّراتِ = by the changes.',
        },
      },
      {
        npcLine: {
          arabic: 'لِلأَسَف نَعَم. قَلَّت الأَسماكُ بِسَبَبِ التَّلَوُّث وَالصَّيدِ الجائِر.',
          english: 'Unfortunately yes. Fish have decreased because of pollution and overfishing.',
          transliteration: 'lil-asaf na\'am. qallat al-asmaaku bi-sababi at-talawwuthi was-saydi al-jaa\'ir.',
        },
        playerResponse: {
          correctArabic: 'يَجِبُ عَلى الحُكوماتِ أَن تَحمِيَ البيئَةَ البَحرِيَّة وَتُنَظِّمَ مَواسِمَ الصَّيد',
          correctEnglish: 'Governments must protect the marine environment and regulate fishing seasons',
          wordBank: ['يَجِبُ', 'عَلى', 'الحُكوماتِ', 'أَن', 'تَحمِيَ', 'البيئَةَ', 'البَحرِيَّة', 'وَتُنَظِّمَ', 'مَواسِمَ', 'الصَّيد', 'تُهمِلَ', 'تُلغِيَ'],
          grammarHint: 'يَجِبُ عَلى (it is obligatory upon) — عَلى + noun for who bears obligation. تَحمِيَ = protect (subjunctive).',
        },
      },
      {
        npcLine: {
          arabic: 'كَلامُكَ حَقّ. البَحرُ كَريمٌ لِمَن يَحتَرِمُه.',
          english: 'You speak the truth. The sea is generous to those who respect it.',
          transliteration: 'kalaamuka haqq. al-bahru kariimun li-man yahtarimuh.',
        },
        playerResponse: {
          correctArabic: 'وَعِلمُكَ بِالبَحرِ ثَروَة يَجِبُ أَن تُنقَلَ لِلأَجيالِ القادِمَة',
          correctEnglish: 'And your knowledge of the sea is a wealth that must be passed to coming generations',
          wordBank: ['وَعِلمُكَ', 'بِالبَحرِ', 'ثَروَة', 'يَجِبُ', 'أَن', 'تُنقَلَ', 'لِلأَجيالِ', 'القادِمَة', 'خَسارَة', 'تُنسى'],
          grammarHint: 'تُنقَلَ (be transferred) — passive subjunctive of نَقَلَ. ثَروَة = wealth/treasure.',
        },
      },
    ],
    vocabularyUsed: ['sayd', 'samak', 'shabaka', 'bahr', 'bii\'a'],
    xpReward: 100,
  },

  // CP-EXP-3: Loading Cargo (B2)
  {
    id: 'exp_port_cargo_003',
    zone: 'coastal-port',
    topic: 'cargo',
    cefrLevel: 'B2',
    title: 'Loading Cargo',
    titleArabic: 'تَحميلُ البِضائِع',
    context: 'Ship captain Ammar discusses international trade routes and the logistics of loading cargo for a major voyage.',
    contextArabic: 'قُبطانُ السَّفينة عَمّار يُناقِشُ طُرُقَ التِّجارَةِ الدَّولِيَّة وَلُوجِستِيّات تَحميلِ البِضائِعِ لِرِحلَةٍ كُبرى.',
    npcName: 'Captain Ammar',
    npcPortrait: 'portrait-captain-ammar',
    exchanges: [
      {
        npcLine: {
          arabic: 'سَفينَتُنا سَتُبحِرُ غَدًا إلى الهِند. يَجِبُ أَن نُحَمِّلَ البِضائِعَ بِتَوازُنٍ دَقيق.',
          english: 'Our ship will sail tomorrow to India. We must load the goods with precise balance.',
          transliteration: 'safiintunaa satubhiru ghadan ilaa al-hind. yajibu an nuhammila al-badaa\'i\'a bi-tawaazunin daqiiq.',
        },
        playerResponse: {
          correctArabic: 'كَيفَ نُوَزِّعُ الحُمولَةَ لِنَضمَنَ استِقرارَ السَّفينَة في البِحارِ المُضطَرِبَة؟',
          correctEnglish: 'How do we distribute the cargo to ensure the ship\'s stability in rough seas?',
          wordBank: ['كَيفَ', 'نُوَزِّعُ', 'الحُمولَةَ', 'لِنَضمَنَ', 'استِقرارَ', 'السَّفينَة', 'في', 'البِحارِ', 'المُضطَرِبَة', 'نُهمِلُ', 'الهادِئَة'],
          grammarHint: 'نُوَزِّعُ (we distribute) — Form II. لِنَضمَنَ = to ensure (لِ purpose + subjunctive).',
        },
      },
      {
        npcLine: {
          arabic: 'البِضائِعُ الثَّقيلَة تُوضَعُ في الأَسفَل وَالخَفيفَة في الأَعلى. هَذا عِلمٌ تَوارَثناهُ عَبرَ القُرون.',
          english: 'Heavy goods are placed at the bottom and light ones at the top. This is knowledge we inherited across centuries.',
          transliteration: 'al-badaa\'i\'u ath-thaqiilatu tuuda\'u fii al-asfal wal-khafiifatu fii al-a\'laa. haadha \'ilmun tawarathnahu \'abra al-quruun.',
        },
        playerResponse: {
          correctArabic: 'وَماذا عَنِ البِضائِعِ القابِلَة لِلتَّلَف كَالتَّوابِلِ والأَقمِشَة؟ كَيفَ نَحميها مِنَ الرُّطوبَة؟',
          correctEnglish: 'And what about perishable goods like spices and fabrics? How do we protect them from humidity?',
          wordBank: ['وَماذا', 'عَنِ', 'البِضائِعِ', 'القابِلَة', 'لِلتَّلَف', 'كَالتَّوابِلِ', 'والأَقمِشَة', 'كَيفَ', 'نَحميها', 'مِنَ', 'الرُّطوبَة', 'نَبيعُها'],
          grammarHint: 'القابِلَة لِلتَّلَف (perishable/susceptible to damage) — active participle + لِ. نَحميها = we protect them.',
        },
      },
      {
        npcLine: {
          arabic: 'نَستَخدِمُ صَناديقَ خَشَبِيَّة مُبَطَّنَة بِالشَّمع. وَنُبعِدُها عَن جِدارِ السَّفينَة حَيثُ يَتَجَمَّعُ المَاء.',
          english: 'We use wooden boxes lined with wax. And we keep them away from the ship\'s wall where water collects.',
          transliteration: 'nastakhdimu sanaadiiqa khashabiyyatan mubattanatan bish-sham\'. wa-nub\'iduhaa \'an jidaari as-safiinati haythu yatajamma\'u al-maa\'.',
        },
        playerResponse: {
          correctArabic: 'خِبرَةٌ عَمَلِيَّة لا تُقَدَّرُ بِثَمَن. هَل الطَّريقُ إلى الهِندِ آمِنٌ هَذا المَوسِم؟',
          correctEnglish: 'Practical experience that is priceless. Is the route to India safe this season?',
          wordBank: ['خِبرَةٌ', 'عَمَلِيَّة', 'لا', 'تُقَدَّرُ', 'بِثَمَن', 'هَل', 'الطَّريقُ', 'إلى', 'الهِندِ', 'آمِنٌ', 'هَذا', 'المَوسِم', 'نَظَرِيَّة', 'خَطِرٌ'],
          grammarHint: 'لا تُقَدَّرُ بِثَمَن (cannot be valued with a price/priceless) — Form II passive. بِثَمَن = with a price.',
        },
      },
      {
        npcLine: {
          arabic: 'الرِّياحُ مُواتِيَة إنْ شاءَ الله. سَنَصِلُ في أَربَعينَ يَومًا. البَحرُ يُكافِئُ الشُّجعان.',
          english: 'The winds are favorable, God willing. We will arrive in forty days. The sea rewards the brave.',
          transliteration: 'ar-riyaahu muwaatiya in shaa\'a allaah. sanasil fii arba\'iina yawman. al-bahru yukaafi\'u ash-shuj\'aan.',
        },
        playerResponse: {
          correctArabic: 'فَلنَتَوَكَّل عَلى اللهِ وَنَنطَلِق. فَالتِّجارَةُ البَحرِيَّة صَنَعَت حَضاراتٍ وَرَبَطَت بَينَ الشُّعوب',
          correctEnglish: 'Let us trust in God and set off. For maritime trade created civilizations and connected peoples',
          wordBank: ['فَلنَتَوَكَّل', 'عَلى', 'اللهِ', 'وَنَنطَلِق', 'فَالتِّجارَةُ', 'البَحرِيَّة', 'صَنَعَت', 'حَضاراتٍ', 'وَرَبَطَت', 'بَينَ', 'الشُّعوب', 'دَمَّرَت', 'فَرَّقَت'],
          grammarHint: 'فَلنَتَوَكَّل (let us trust) — فَ + لِ + jussive (Form V). صَنَعَت حَضاراتٍ = created civilizations.',
        },
      },
    ],
    vocabularyUsed: ['safiina', 'badaa\'i\'', 'tijaara', 'bahr', 'hadaraat'],
    xpReward: 150,
  },

  // ============================================================
  // HIDDEN OASIS — 3 scenarios (A2, B1, B2)
  // ============================================================

  // HO-EXP-1: Meditation/Reflection (A2)
  {
    id: 'exp_hidden_meditate_001',
    zone: 'hidden-oasis',
    topic: 'reflection',
    cefrLevel: 'A2',
    title: 'Meditation and Reflection',
    titleArabic: 'تَأَمُّل وَتَفَكُّر',
    context: 'Wise hermit Sulayman invites you to sit by the spring and reflect on your journey.',
    contextArabic: 'الزّاهِد الحَكيم سُلَيمان يَدعوكَ لِلجُلوسِ عِندَ النَّبع وَالتَّأَمُّل في رِحلَتِكَ.',
    npcName: 'Hermit Sulayman',
    npcPortrait: 'portrait-hermit-sulayman',
    exchanges: [
      {
        npcLine: {
          arabic: 'اِجلِس هُنا عِندَ النَّبع. اِسمَع صَوتَ الماء. ماذا تَشعُر؟',
          english: 'Sit here by the spring. Listen to the sound of water. What do you feel?',
          transliteration: 'ijlis hunaa \'inda an-nab\'. isma\' sawta al-maa\'. maadha tash\'ur?',
        },
        playerResponse: {
          correctArabic: 'أَشعُرُ بِالهُدوء وَالسَّلام',
          correctEnglish: 'I feel calm and peace',
          wordBank: ['أَشعُرُ', 'بِالهُدوء', 'وَالسَّلام', 'بِالخَوف', 'وَالغَضَب'],
          grammarHint: 'أَشعُرُ بِ (I feel) — the preposition بِ is required with شَعَرَ for emotions.',
        },
      },
      {
        npcLine: {
          arabic: 'الطَّبيعَةُ تُعَلِّمُنا الصَّبر. الماءُ لا يَستَعجِل لَكِنَّهُ يَنحَتُ الصَّخر.',
          english: 'Nature teaches us patience. Water does not rush but it carves rock.',
          transliteration: 'at-tabii\'atu tu\'alimunaa as-sabr. al-maa\'u laa yasta\'jil lakinnahu yanhatu as-sakhr.',
        },
        playerResponse: {
          correctArabic: 'هَذا دَرسٌ جَميل. أَحتاجُ المَزيدَ مِنَ الصَّبر في حَياتي',
          correctEnglish: 'This is a beautiful lesson. I need more patience in my life',
          wordBank: ['هَذا', 'دَرسٌ', 'جَميل', 'أَحتاجُ', 'المَزيدَ', 'مِنَ', 'الصَّبر', 'في', 'حَياتي', 'صَعب', 'الأَقَلَّ'],
          grammarHint: 'المَزيدَ مِن (more of) — المَزيد is the definite comparative + مِن for the compared item.',
        },
      },
      {
        npcLine: {
          arabic: 'كُلُّ رِحلَةٍ تَبدَأُ بِخُطوَةٍ واحِدَة. أَنتَ قَطَعتَ شَوطًا طَويلًا.',
          english: 'Every journey begins with one step. You have come a long way.',
          transliteration: 'kullu rihlatinn tabda\'u bi-khutwatin waahidatin. anta qata\'ta shawtan tawiilan.',
        },
        playerResponse: {
          correctArabic: 'شُكرًا لَكَ يا سُلَيمان. كَلامُكَ يُعطيني قُوَّة',
          correctEnglish: 'Thank you, Sulayman. Your words give me strength',
          wordBank: ['شُكرًا', 'لَكَ', 'يا', 'سُلَيمان', 'كَلامُكَ', 'يُعطيني', 'قُوَّة', 'ضَعفًا', 'يَأخُذُ'],
          grammarHint: 'يُعطيني (it gives me) — Form IV with ني suffix. كَلامُكَ = your speech (idaafa with suffix).',
        },
      },
      {
        npcLine: {
          arabic: 'اِذهَب بِسَلام. وَتَذَكَّر: أَجمَلُ الكُنوز هِيَ التي في القَلب.',
          english: 'Go in peace. And remember: the most beautiful treasures are those in the heart.',
          transliteration: 'idhhab bi-salaam. wa-tadhakkar: ajmalu al-kunuuzi hiya allatii fii al-qalb.',
        },
        playerResponse: {
          correctArabic: 'سَأَتَذَكَّرُ هَذا دائِمًا. مَعَ السَّلامَة',
          correctEnglish: 'I will remember this always. Goodbye',
          wordBank: ['سَأَتَذَكَّرُ', 'هَذا', 'دائِمًا', 'مَعَ', 'السَّلامَة', 'أَبَدًا', 'سَأَنسى'],
          grammarHint: 'سَأَتَذَكَّرُ (I will remember) — سَ + Form V imperfect. دائِمًا = always (adverb).',
        },
      },
    ],
    vocabularyUsed: ['huduu\'', 'salaam', 'sabr', 'tabii\'a', 'qalb'],
    xpReward: 75,
  },

  // HO-EXP-2: Discovering Ancient Text (B1)
  {
    id: 'exp_hidden_text_002',
    zone: 'hidden-oasis',
    topic: 'ancient_text',
    cefrLevel: 'B1',
    title: 'Discovering Ancient Text',
    titleArabic: 'اكتِشاف نَصٍّ قَديم',
    context: 'You find an ancient inscription on a rock near the oasis. Guardian Maryam helps you decipher it.',
    contextArabic: 'تَجِدُ نَقشًا قَديمًا عَلى صَخرَةٍ قُربَ الواحَة. الحارِسة مَريَم تُساعِدُكَ في فَكِّ رُموزِهِ.',
    npcName: 'Guardian Maryam',
    npcPortrait: 'portrait-guardian-maryam',
    exchanges: [
      {
        npcLine: {
          arabic: 'وَجَدتَ شَيئًا مُهِمًّا! هَذا النَّقشُ بِالخَطِّ النَّبَطي. عُمرُهُ أَكثَرُ مِن أَلفِ سَنَة.',
          english: 'You found something important! This inscription is in Nabataean script. It is more than a thousand years old.',
          transliteration: 'wajadta shay\'an muhimman! haadha an-naqshu bil-khatti an-nabatii. \'umruhu aktharu min alfi sana.',
        },
        playerResponse: {
          correctArabic: 'هَل تَستَطيعينَ قِراءَتَه؟ ماذا يَقولُ النَّص؟',
          correctEnglish: 'Can you read it? What does the text say?',
          wordBank: ['هَل', 'تَستَطيعينَ', 'قِراءَتَه', 'ماذا', 'يَقولُ', 'النَّص', 'كِتابَتَه', 'تُريدينَ'],
          grammarHint: 'تَستَطيعينَ (you (f) can) — feminine second person. قِراءَتَه = reading it (verbal noun + suffix).',
        },
      },
      {
        npcLine: {
          arabic: 'يَتَحَدَّثُ عَن قافِلَةٍ تِجارِيَّة مَرَّت هُنا. يَذكُرُ أَسماءَ تُجّارٍ وَبِضائِع.',
          english: 'It talks about a trade caravan that passed here. It mentions names of merchants and goods.',
          transliteration: 'yatahaddithu \'an qaafilatin tijaariyyatin marat hunaa. yadhkuru asmaa\'a tujjaarin wa-badaa\'i\'.',
        },
        playerResponse: {
          correctArabic: 'مُذهِل! هَذا يَعني أَنَّ هَذِهِ الواحَة كانَت مَحَطَّةً تِجارِيَّة مُهِمَّة',
          correctEnglish: 'Amazing! This means this oasis was an important trading station',
          wordBank: ['مُذهِل', 'هَذا', 'يَعني', 'أَنَّ', 'هَذِهِ', 'الواحَة', 'كانَت', 'مَحَطَّةً', 'تِجارِيَّة', 'مُهِمَّة', 'عَسكَرِيَّة', 'صَغيرَة'],
          grammarHint: 'كانَت مَحَطَّةً (it was a station) — feminine كانَ + accusative predicate.',
        },
      },
      {
        npcLine: {
          arabic: 'بِالضَّبط. طَريقُ البُخور مَرَّ مِن هُنا. كانَ يَربِطُ اليَمَنَ بِالشّام.',
          english: 'Exactly. The Incense Route passed through here. It connected Yemen to Syria.',
          transliteration: 'bid-dabt. tariiqu al-bukhuur marra min hunaa. kaana yarbit al-yamana bish-shaam.',
        },
        playerResponse: {
          correctArabic: 'يَجِبُ أَن نُحافِظَ عَلى هَذا النَّقش. إنَّهُ جُزءٌ مِن تاريخِنا',
          correctEnglish: 'We must preserve this inscription. It is part of our history',
          wordBank: ['يَجِبُ', 'أَن', 'نُحافِظَ', 'عَلى', 'هَذا', 'النَّقش', 'إنَّهُ', 'جُزءٌ', 'مِن', 'تاريخِنا', 'نَمحُوَ', 'لَيسَ'],
          grammarHint: 'نُحافِظَ عَلى (we preserve) — Form III subjunctive. إنَّهُ = indeed it is (emphatic).',
        },
      },
      {
        npcLine: {
          arabic: 'أَنتَ عَلى حَقّ. سَأُبلِغُ العُلَماءَ في المَدينَة. هَذا اكتِشاف تاريخي.',
          english: 'You are right. I will inform the scholars in the city. This is a historical discovery.',
          transliteration: 'anta \'ala haqq. sa-ubligh al-\'ulamaa\'a fii al-madiina. haadha iktishaaf taariikhii.',
        },
        playerResponse: {
          correctArabic: 'الماضي يَتَحَدَّثُ إلَينا عَبرَ هَذِهِ الحِجارَة. يَكفي أَن نُصغِيَ',
          correctEnglish: 'The past speaks to us through these stones. We just need to listen',
          wordBank: ['الماضي', 'يَتَحَدَّثُ', 'إلَينا', 'عَبرَ', 'هَذِهِ', 'الحِجارَة', 'يَكفي', 'أَن', 'نُصغِيَ', 'المُستَقبَل', 'نَتَجاهَلَ'],
          grammarHint: 'نُصغِيَ (we listen) — Form IV subjunctive. عَبرَ = through/across. يَكفي أَن = it suffices that.',
        },
      },
    ],
    vocabularyUsed: ['naqsh', 'qadiim', 'qaafila', 'taariikh', 'iktishaaf'],
    xpReward: 100,
  },

  // HO-EXP-3: Philosophical Discussion (B2)
  {
    id: 'exp_hidden_philosophy_003',
    zone: 'hidden-oasis',
    topic: 'philosophy',
    cefrLevel: 'B2',
    title: 'Philosophical Discussion',
    titleArabic: 'نِقاشٌ فَلسَفي',
    context: 'The ancient sage of the oasis engages you in a deep discussion about knowledge, language, and identity.',
    contextArabic: 'حَكيمُ الواحَةِ القَديم يُشرِكُكَ في نِقاشٍ عَميقٍ حَولَ المَعرِفَة وَاللُّغَة وَالهَوِيَّة.',
    npcName: 'Sage Al-Hakim',
    npcPortrait: 'portrait-sage-al-hakim',
    exchanges: [
      {
        npcLine: {
          arabic: 'يا طالِبَ العِلم، ما العَلاقَةُ بَينَ اللُّغَةِ وَالفِكر في نَظَرِك؟ هَل نُفَكِّرُ بِاللُّغَة أَم قَبلَها؟',
          english: 'O seeker of knowledge, what is the relationship between language and thought in your view? Do we think with language or before it?',
          transliteration: 'yaa taaliba al-\'ilm, maa al-\'alaaqatu bayna al-lughati wal-fikri fii nazharik? hal nufakkiru bil-lughati am qablahaa?',
        },
        playerResponse: {
          correctArabic: 'أَظُنُّ أَنَّ اللُّغَةَ تُشَكِّلُ وَعيَنا وَتُحَدِّدُ حُدودَ عالَمِنا كَما قالَ فِتغِنشتاين',
          correctEnglish: 'I think language shapes our consciousness and defines the limits of our world as Wittgenstein said',
          wordBank: ['أَظُنُّ', 'أَنَّ', 'اللُّغَةَ', 'تُشَكِّلُ', 'وَعيَنا', 'وَتُحَدِّدُ', 'حُدودَ', 'عالَمِنا', 'كَما', 'قالَ', 'فِتغِنشتاين', 'تُدَمِّرُ', 'جَهلَنا'],
          grammarHint: 'تُشَكِّلُ (shapes) — Form II. وَعيَنا = our consciousness. حُدودَ عالَمِنا = limits of our world (double idaafa).',
        },
      },
      {
        npcLine: {
          arabic: 'لَكِنَّ العَرَبَ القُدَماء رَأَوا أَنَّ اللُّغَةَ مِرآةُ الرُّوح لا سِجنُ العَقل. الشِّعرُ يَتَجاوَزُ حُدودَ المَنطِق.',
          english: 'But ancient Arabs saw language as a mirror of the soul, not a prison of the mind. Poetry transcends the limits of logic.',
          transliteration: 'lakinna al-\'araba al-qudamaa\'a ra\'aw anna al-lughata mir\'aatu ar-ruuh laa sijnu al-\'aql. ash-shi\'ru yatajaawazu huduuda al-mantiq.',
        },
        playerResponse: {
          correctArabic: 'نُقطَةٌ عَميقَة. العَرَبِيَّةُ بِثَرائِها الاشتِقاقي تَسمَحُ بِتَعَدُّدِ المَعاني في اللَّفظَةِ الواحِدَة',
          correctEnglish: 'A deep point. Arabic with its derivational richness allows multiple meanings in a single word',
          wordBank: ['نُقطَةٌ', 'عَميقَة', 'العَرَبِيَّةُ', 'بِثَرائِها', 'الاشتِقاقي', 'تَسمَحُ', 'بِتَعَدُّدِ', 'المَعاني', 'في', 'اللَّفظَةِ', 'الواحِدَة', 'بِفَقرِها', 'تَمنَعُ'],
          grammarHint: 'بِثَرائِها (with its richness) — بِ + verbal noun + possessive suffix. تَعَدُّدِ المَعاني = multiplicity of meanings.',
        },
      },
      {
        npcLine: {
          arabic: 'وَمِن هُنا نَفهَمُ لِماذا اعتَبَرَ ابنُ عَربي اللُّغَةَ وَسيلَةً لِلوُصولِ إلى الحَقيقَةِ الإلَهِيَّة.',
          english: 'And from here we understand why Ibn Arabi considered language a means of reaching divine truth.',
          transliteration: 'wa-min hunaa nafham limaadha i\'tabara ibnu \'arabii al-lughata wasiilatan lil-wusuuli ilaa al-haqiiqati al-ilaahiyya.',
        },
        playerResponse: {
          correctArabic: 'إذَن تَعَلُّمُ لُغَةٍ جَديدَة لَيسَ مُجَرَّدَ اكتِسابِ أَداةِ تَواصُل بَل هُوَ اكتِشاف لِطَريقَةِ وُجودٍ مُختَلِفَة',
          correctEnglish: 'So learning a new language is not merely acquiring a communication tool but discovering a different way of being',
          wordBank: ['إذَن', 'تَعَلُّمُ', 'لُغَةٍ', 'جَديدَة', 'لَيسَ', 'مُجَرَّدَ', 'اكتِسابِ', 'أَداةِ', 'تَواصُل', 'بَل', 'هُوَ', 'اكتِشاف', 'لِطَريقَةِ', 'وُجودٍ', 'مُختَلِفَة', 'فُقدانِ'],
          grammarHint: 'لَيسَ مُجَرَّدَ (is not merely) — لَيسَ negates nominal sentences. بَل = rather/but (stronger contrast than لَكِن).',
        },
      },
      {
        npcLine: {
          arabic: 'أَحسَنتَ! فَمَن يَتَعَلَّمُ العَرَبِيَّةَ لا يَتَعَلَّمُ لُغَةً فَحَسب بَل يَفتَحُ بابًا إلى حَضارَةٍ عَريقَة.',
          english: 'Well said! For whoever learns Arabic does not just learn a language but opens a door to an ancient civilization.',
          transliteration: 'ahsanta! fa-man yata\'allamu al-\'arabiyyata laa yata\'allamu lughatan fahasb bal yaftahu baaban ilaa hadaaratin \'ariiqa.',
        },
        playerResponse: {
          correctArabic: 'وَهَذِهِ الحَضارَةُ تَمتَدُّ جُذورُها في هَذِهِ الواحَة ذاتِها حَيثُ يَلتَقي الماءُ بِالحِكمَة وَالصَّمتُ بِالمَعنى',
          correctEnglish: 'And this civilization extends its roots in this very oasis where water meets wisdom and silence meets meaning',
          wordBank: ['وَهَذِهِ', 'الحَضارَةُ', 'تَمتَدُّ', 'جُذورُها', 'في', 'هَذِهِ', 'الواحَة', 'ذاتِها', 'حَيثُ', 'يَلتَقي', 'الماءُ', 'بِالحِكمَة', 'وَالصَّمتُ', 'بِالمَعنى', 'تَنتَهي', 'بِالجَهل'],
          grammarHint: 'تَمتَدُّ جُذورُها (its roots extend) — Form VIII. ذاتِها = itself (emphatic reflexive). يَلتَقي بِ = meets with (Form VIII).',
        },
      },
    ],
    vocabularyUsed: ['lugha', 'fikr', 'hawiyya', 'hadaara', 'ma\'naa'],
    xpReward: 150,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getExpandedScenariosForZone(zone) {
  return CONVERSATION_SCENARIOS_EXPANDED.filter((s) => s.zone === zone);
}

export function getExpandedScenariosForLevel(cefrLevel) {
  return CONVERSATION_SCENARIOS_EXPANDED.filter((s) => s.cefrLevel === cefrLevel);
}

export function getExpandedScenarioById(id) {
  return CONVERSATION_SCENARIOS_EXPANDED.find((s) => s.id === id) || null;
}

export function getExpandedDistributionSummary() {
  const summary = {};
  for (const zone of ZONES) {
    summary[zone] = { total: 0, A2: 0, B1: 0, B2: 0 };
  }
  for (const s of CONVERSATION_SCENARIOS_EXPANDED) {
    if (summary[s.zone]) {
      summary[s.zone].total++;
      if (summary[s.zone][s.cefrLevel] !== undefined) {
        summary[s.zone][s.cefrLevel]++;
      }
    }
  }
  return summary;
}

export default CONVERSATION_SCENARIOS_EXPANDED;
