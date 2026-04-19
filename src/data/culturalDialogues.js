/**
 * Cultural Dialogues
 * Rich educational content about Arabic culture, history, and traditions
 * Integrated with NPC dialogue system and vocabulary teaching
 *
 * Each dialogue tree has:
 * - id: unique identifier
 * - topic: display name
 * - category: thematic grouping
 * - npcRole: which type of NPC would share this (for mapping)
 * - lines: dialogue with speaker, text (arabic/english/transliteration), and optional teachWord
 */

export const culturalDialogues = [
  // 1. CALLIGRAPHY HISTORY
  {
    id: 'calligraphy_history',
    topic: 'Arabic Calligraphy',
    category: 'art',
    npcRole: 'scholar',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الخَطُّ العَرَبِيُّ مِن أَعْظَمِ الفُنونِ في العالَم',
        english: 'Arabic calligraphy is one of the world\'s greatest art forms.',
        transliteration: 'al-khaṭṭ al-ʿarabī min aʿẓam al-funūn fī al-ʿālam',
      },
      {
        speaker: 'npc',
        arabic: 'هُناكَ سِتَّةُ أَنواعٍ رَئيسِيَّة: النَّسْخ والثُّلُث والنَّسْتَعْليق والدِّيوانِي والكوفِي والرُّقْعَة',
        english: 'There are six major scripts: Naskh, Thuluth, Nastaliq, Diwani, Kufi, and Ruqah.',
        transliteration: 'hunāka sittat anwāʿ raʾīsiyya: an-naskh wa-th-thuluth wa-n-nastaʿlīq wa-d-dīwānī wa-l-kūfī wa-r-ruqʿa',
      },
      {
        speaker: 'npc',
        arabic: 'النَّسْخُ هُوَ الأَكْثَرُ شُيوعًا — تَراهُ في الكُتُبِ والصُّحُف',
        english: 'Naskh is the most common — you see it in books and newspapers.',
        transliteration: 'an-naskh huwa al-akthar shuyūʿan — tarāhu fī al-kutub wa-ṣ-ṣuḥuf',
      },
      {
        speaker: 'npc',
        arabic: 'مَعْلومَةٌ مُمْتِعَة: كَلِمَةُ "calligraphy" مِنَ اليونانِيَّة، لَكِنَّ العَرَبَ يُسَمّونَها خَطّ',
        english: 'Fun fact: The word "calligraphy" comes from Greek, but Arabs call it khatt, meaning "line".',
        transliteration: 'maʿlūma mumtiʿa: kalimat "calligraphy" min al-yūnāniyya, lākinna al-ʿarab yusam­mūnah khaṭṭ',
        teachWord: 'q_0002', // book (related to calligraphy/writing)
      },
      {
        speaker: 'npc',
        arabic: 'الخَطّاطونَ العَرَبُ كانوا يَقْضونَ سَنَواتٍ لِإتْقانِ فَنِّهِم',
        english: 'Arab calligraphers would spend years perfecting their art.',
        transliteration: 'al-khaṭṭāṭūn al-ʿarab kānū yaqḍūna sanawāt li-itqān fannihim',
      },
    ],
  },

  // 2. ARABIC COFFEE CULTURE
  {
    id: 'coffee_culture',
    topic: 'Arabic Coffee Traditions',
    category: 'food_culture',
    npcRole: 'merchant',
    lines: [
      {
        speaker: 'npc',
        arabic: 'القَهْوَةُ العَرَبِيَّةُ لَيْسَتْ مُجَرَّدَ شَرابٍ — إنَّها رَمْزُ الضِّيافَة',
        english: 'Arabic coffee is not just a drink — it\'s a symbol of hospitality.',
        transliteration: 'al-qahwa al-ʿarabiyya laysat mujarrad sharāb — innaha ramz aḍ-ḍiyāfa',
      },
      {
        speaker: 'npc',
        arabic: 'نُقَدِّمُ القَهْوَةَ للضُّيوفِ في فَناجينَ صَغيرَة، ثَلاثُ مَرّاتٍ عادَةً',
        english: 'We serve coffee to guests in small cups, usually three times.',
        transliteration: 'nuqaddim al-qahwa li-ḍ-ḍuyūf fī fanājīn ṣaghīra, thalāth marrāt ʿādatan',
        teachWord: 'num_3', // three
      },
      {
        speaker: 'npc',
        arabic: 'القَهْوَةُ تُحَضَّرُ مَعَ الهِيل والزَّعْفَرانِ أَحْيانًا',
        english: 'The coffee is prepared with cardamom and sometimes saffron.',
        transliteration: 'al-qahwa tuḥaḍḍar maʿa al-hīl wa-z-zaʿfarān aḥyānan',
      },
      {
        speaker: 'npc',
        arabic: 'في التَّقاليدِ البَدَوِيَّة، إذا هَزَزْتَ الفِنْجانَ يَعْني "كِفايَة شُكْرًا"',
        english: 'In Bedouin tradition, if you shake the cup it means "enough, thank you".',
        transliteration: 'fī at-taqālīd al-badawiyya, idhā hazazt al-finjān yaʿnī "kifāya shukran"',
        teachWord: 'shukran', // thank you
      },
      {
        speaker: 'npc',
        arabic: 'الضِّيافَةُ العَرَبِيَّةُ تَقولُ: الضَّيْفُ في بَيْتِنا مَلِك',
        english: 'Arab hospitality says: A guest in our home is a king.',
        transliteration: 'aḍ-ḍiyāfa al-ʿarabiyya taqūl: aḍ-ḍayf fī baytinā malik',
        teachWord: 'q_0618', // house
      },
    ],
  },

  // 3. DESERT NAVIGATION
  {
    id: 'desert_navigation',
    topic: 'Desert Navigation by Stars',
    category: 'nature',
    npcRole: 'bedouin',
    lines: [
      {
        speaker: 'npc',
        arabic: 'البَدْوُ يَعْرِفونَ الصَّحْراءَ مِثْلَما تَعْرِفُ أَنْتَ بَيْتَك',
        english: 'The Bedouins know the desert like you know your own home.',
        transliteration: 'al-badw yaʿrifūn aṣ-ṣaḥrāʾ mithlama taʿrif ant baytak',
      },
      {
        speaker: 'npc',
        arabic: 'نَسْتَخْدِمُ النُّجومَ لِلإرْشاد — كُلُّ نَجْمٍ لَهُ اسْمٌ وَمَعْنى',
        english: 'We use the stars for guidance — each star has a name and meaning.',
        transliteration: 'nastakhdim an-nujūm li-l-irshād — kullu najm lahu ism wa-maʿnan',
        teachWord: 'star_w16', // star
      },
      {
        speaker: 'npc',
        arabic: 'النَّجْمُ القُطْبِيُّ يُشيرُ إلى الشِّمالِ دائِمًا',
        english: 'The North Star always points north.',
        transliteration: 'an-najm al-quṭbī yushīr ilā ash-shimāl dāʾiman',
      },
      {
        speaker: 'npc',
        arabic: 'في الصَّحْراء، المَاءُ أَثْمَنُ مِنَ الذَّهَب',
        english: 'In the desert, water is more precious than gold.',
        transliteration: 'fī aṣ-ṣaḥrāʾ, al-māʾ athman min adh-dhahab',
        teachWord: 'water_w13', // water
      },
      {
        speaker: 'npc',
        arabic: 'نَعْرِفُ مَكانَ المَاءِ مِن عَلاماتٍ في الأَرْضِ والنَّباتات',
        english: 'We know where water is from signs in the earth and plants.',
        transliteration: 'naʿrif makān al-māʾ min ʿalāmāt fī al-arḍ wa-n-nabātāt',
      },
    ],
  },

  // 4. ISLAMIC ARCHITECTURE
  {
    id: 'islamic_architecture',
    topic: 'Islamic Architecture',
    category: 'art',
    npcRole: 'scholar',
    lines: [
      {
        speaker: 'npc',
        arabic: 'العِمارَةُ الإسْلامِيَّةُ مَشْهورَةٌ بِالأَقْواسِ والقِبابِ والأَنْماطِ الهَنْدَسِيَّة',
        english: 'Islamic architecture is famous for arches, domes, and geometric patterns.',
        transliteration: 'al-ʿimāra al-islāmiyya mashhūra bi-l-aqwās wa-l-qibāb wa-l-anmāṭ al-handasiyya',
      },
      {
        speaker: 'npc',
        arabic: 'المَساجِدُ تَحْتَوي على مَآذِنَ عالِيَة لِلأَذانِ',
        english: 'Mosques contain tall minarets for the call to prayer.',
        transliteration: 'al-masājid taḥtawī ʿalā maʾādhin ʿāliya li-l-adhān',
      },
      {
        speaker: 'npc',
        arabic: 'القُصورُ مِثْلُ قَصْرِ الحَمْراءِ في غِرْناطَة تُظْهِرُ جَمالَ الفَنِّ الإسْلامِيّ',
        english: 'Palaces like the Alhambra in Granada show the beauty of Islamic art.',
        transliteration: 'al-quṣūr mithl qaṣr al-ḥamrāʾ fī ghirnāṭa tuẓhir jamāl al-fann al-islāmī',
      },
      {
        speaker: 'npc',
        arabic: 'القُبَّةُ تَرْمِزُ إلى السَّماء والكَوْن',
        english: 'The dome symbolizes the heavens and the universe.',
        transliteration: 'al-qubba tarmiz ilā as-samāʾ wa-l-kawn',
      },
      {
        speaker: 'npc',
        arabic: 'الزَّخارِفُ الهَنْدَسِيَّةُ تَعْكِسُ النِّظامَ والتَّوازُنَ في الخَلْق',
        english: 'Geometric decorations reflect order and balance in creation.',
        transliteration: 'az-zakhārif al-handasiyya taʿkis an-niẓām wa-t-tawāzun fī al-khalq',
      },
    ],
  },

  // 5. ARABIC NUMBERS HISTORY
  {
    id: 'arabic_numerals',
    topic: 'The Gift of Arabic Numbers',
    category: 'history',
    npcRole: 'merchant',
    lines: [
      {
        speaker: 'npc',
        arabic: 'هَل تَعْلَمُ أَنَّ الأَرْقامَ الَّتي تَسْتَخْدِمُها مِن العَرَب؟',
        english: 'Did you know the numbers you use come from the Arabs?',
        transliteration: 'hal taʿlam anna al-arqām allatī tastakhdimuha min al-ʿarab?',
      },
      {
        speaker: 'npc',
        arabic: 'في الحَقيقَة، نَحْنُ أَخَذْناها مِنَ الهِنْدِ ثُمَّ طَوَّرْناها',
        english: 'Actually, we took them from India and then developed them.',
        transliteration: 'fī al-ḥaqīqa, naḥnu akhadhnāha min al-hind thumma ṭawwarnāha',
      },
      {
        speaker: 'npc',
        arabic: 'لِذَلِكَ تُسَمّى "الأَرْقامُ الهِنْدِيَّةُ العَرَبِيَّة"',
        english: 'That\'s why they\'re called "Hindu-Arabic numerals".',
        transliteration: 'lidhālika tusammā "al-arqām al-hindiyya al-ʿarabiyya"',
        teachWord: 'q_1390', // number
      },
      {
        speaker: 'npc',
        arabic: 'العُلَماءُ المُسْلِمونَ مِثْلُ الخَوارِزْمِيِّ نَقَلوا هَذِهِ المَعْرِفَةَ إلى أوروبّا',
        english: 'Muslim scholars like Al-Khwarizmi brought this knowledge to Europe.',
        transliteration: 'al-ʿulamāʾ al-muslimūn mithl al-khawārizmī naqalū hādhih al-maʿrifa ilā ūrubbā',
      },
      {
        speaker: 'npc',
        arabic: 'الصِّفْرُ (٠) كانَ اخْتِراعًا عَظيمًا — غَيَّرَ الرِّياضِيّاتِ لِلأَبَد',
        english: 'Zero (0) was a great invention — it changed mathematics forever.',
        transliteration: 'aṣ-ṣifr kāna ikhtirāʿan ʿaẓīman — ghayyar ar-riyāḍiyyāt li-l-abad',
      },
    ],
  },

  // 6. FOOD & HOSPITALITY
  {
    id: 'food_hospitality',
    topic: 'Arab Hospitality and Food',
    category: 'food_culture',
    npcRole: 'farmer',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الضِّيافَةُ العَرَبِيَّةُ مَشْهورَةٌ في كُلِّ العالَم',
        english: 'Arab hospitality is famous throughout the world.',
        transliteration: 'aḍ-ḍiyāfa al-ʿarabiyya mashhūra fī kull al-ʿālam',
      },
      {
        speaker: 'npc',
        arabic: 'نَقولُ: "البَيْتُ بَيْتُكَ" — البَيْتُ بَيْتُك',
        english: 'We say: "al-bayt baytak" — The house is your house.',
        transliteration: 'naqūl: "al-bayt baytak" — al-bayt baytak',
        teachWord: 'q_0618', // house
      },
      {
        speaker: 'npc',
        arabic: 'الطَّعامُ العَرَبِيُّ غَنِيٌّ بِالتَّوابِلِ مِثْلِ الكُمّونِ والكُرْكُم والقِرْفَة',
        english: 'Arab food is rich in spices like cumin, turmeric, and cinnamon.',
        transliteration: 'aṭ-ṭaʿām al-ʿarabī ghanī bi-t-tawābil mithl al-kummūn wa-l-kurkum wa-l-qirfa',
        teachWord: 'p_0244', // food
      },
      {
        speaker: 'npc',
        arabic: 'الكَرَمُ أَهَمُّ شَيْءٍ في ثَقافَتِنا',
        english: 'Generosity is the most important thing in our culture.',
        transliteration: 'al-karam ahamm shayʾ fī thaqāfatinā',
      },
      {
        speaker: 'npc',
        arabic: 'حَتّى لَو كانَ عِنْدَنا قَليلٌ، نُشارِكُهُ مَعَ الضُّيوف',
        english: 'Even if we have little, we share it with guests.',
        transliteration: 'ḥattā law kāna ʿindanā qalīl, nushārikuhu maʿa aḍ-ḍuyūf',
      },
    ],
  },

  // 7. ARABIC POETRY
  {
    id: 'arabic_poetry',
    topic: 'The Art of Arabic Poetry',
    category: 'literature',
    npcRole: 'scholar',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الشِّعْرُ العَرَبِيُّ أَقْدَمُ مِن الإسْلامِ بِمِئاتِ السَّنَوات',
        english: 'Arabic poetry is hundreds of years older than Islam.',
        transliteration: 'ash-shiʿr al-ʿarabī aqdam min al-islām bi-miʾāt as-sanawāt',
      },
      {
        speaker: 'npc',
        arabic: 'كانَ العَرَبُ يَحْفَظونَ القَصائِدَ الطَّويلَةَ عَن ظَهْرِ قَلْب',
        english: 'Arabs would memorize long poems by heart.',
        transliteration: 'kāna al-ʿarab yaḥfaẓūn al-qaṣāʾid aṭ-ṭawīla ʿan ẓahr qalb',
        teachWord: 'heart_1', // heart
      },
      {
        speaker: 'npc',
        arabic: 'المُعَلَّقاتُ السَّبْعُ هِيَ أَشْهَرُ قَصائِدِ العَصْرِ الجاهِلِيّ',
        english: 'The Seven Hanging Odes are the most famous pre-Islamic poems.',
        transliteration: 'al-muʿallaqāt as-sabʿ hiya ashhar qaṣāʾid al-ʿaṣr al-jāhilī',
      },
      {
        speaker: 'npc',
        arabic: 'الشُّعَراءُ كانوا مِثْلَ المَشاهيرِ اليَوْم — مُحْتَرَمونَ ومُكَرَّمون',
        english: 'Poets were like celebrities today — respected and honored.',
        transliteration: 'ash-shuʿarāʾ kānū mithl al-mashāhīr al-yawm — muḥtaramūn wa-mukarramūn',
      },
      {
        speaker: 'npc',
        arabic: 'بَعْضُ القَصائِدِ تُغَنّى حَتّى اليَوْم',
        english: 'Some poems are still sung today.',
        transliteration: 'baʿḍ al-qaṣāʾid tughannā ḥattā al-yawm',
      },
    ],
  },

  // 8. MARITIME TRADE
  {
    id: 'maritime_trade',
    topic: 'Arab Seafaring & Trade',
    category: 'history',
    npcRole: 'merchant',
    lines: [
      {
        speaker: 'npc',
        arabic: 'التُّجّارُ العَرَبُ كانوا يُسافِرونَ إلى الصّينِ والهِنْدِ بِالسُّفُن',
        english: 'Arab merchants used to travel to China and India by ship.',
        transliteration: 'at-tujjār al-ʿarab kānū yusāfirūn ilā aṣ-ṣīn wa-l-hind bi-s-sufun',
      },
      {
        speaker: 'npc',
        arabic: 'سُفُنُ الدَّو كانَتْ مَشْهورَةً بِقُوَّتِها',
        english: 'Dhow ships were famous for their strength.',
        transliteration: 'sufun ad-daw kānat mashhūra bi-quwwatihā',
      },
      {
        speaker: 'npc',
        arabic: 'البَحْرُ الأَحْمَرُ والخَليجُ العَرَبِيُّ كانا طُرُقَ تِجارَةٍ مُهِمَّة',
        english: 'The Red Sea and Arabian Gulf were important trade routes.',
        transliteration: 'al-baḥr al-aḥmar wa-l-khalīj al-ʿarabī kānā ṭuruq tijāra muhimma',
        teachWord: 'sea_w23', // sea
      },
      {
        speaker: 'npc',
        arabic: 'نَقَلْنا التَّوابِلَ والحَريرَ والذَّهَبَ بَيْنَ القارّات',
        english: 'We transported spices, silk, and gold between continents.',
        transliteration: 'naqalnā at-tawābil wa-l-ḥarīr wa-dh-dhahab bayn al-qārrāt',
      },
      {
        speaker: 'npc',
        arabic: 'التِّجارَةُ أَغْنَتِ المُدُنَ العَرَبِيَّةَ وَنَشَرَتِ المَعْرِفَة',
        english: 'Trade enriched Arab cities and spread knowledge.',
        transliteration: 'at-tijāra aghnat al-mudun al-ʿarabiyya wa-nasharat al-maʿrifa',
        teachWord: 'p_0100', // city
      },
    ],
  },
];

/**
 * Mapping of NPC IDs to cultural dialogue IDs
 * This allows specific NPCs to have access to cultural dialogues
 */
export const npcCulturalDialogueMapping = {
  'scholar-yusuf': ['calligraphy_history', 'islamic_architecture', 'arabic_poetry'],
  'library_scholar': ['calligraphy_history', 'arabic_poetry'],
  'marketplace_merchant': ['coffee_culture', 'arabic_numerals', 'maritime_trade'],
  'bedouin_elder': ['desert_navigation'],
  'palace_guard': ['islamic_architecture'],
  'farmland_elder': ['food_hospitality'],
  'port_merchant': ['maritime_trade', 'arabic_numerals'],
};

/**
 * Get cultural dialogues for a specific NPC
 */
export function getCulturalDialoguesForNPC(npcId) {
  const dialogueIds = npcCulturalDialogueMapping[npcId] || [];
  return culturalDialogues.filter((d) => dialogueIds.includes(d.id));
}

/**
 * Get all cultural dialogues by category
 */
export function getCulturalDialoguesByCategory(category) {
  return culturalDialogues.filter((d) => d.category === category);
}

/**
 * Get a specific cultural dialogue by ID
 */
export function getCulturalDialogueById(id) {
  return culturalDialogues.find((d) => d.id === id);
}
