/**
 * inscriptionData.js — Content data for all 24 interactive Arabic inscriptions.
 *
 * This file holds Arabic text, word IDs, root family data, and cultural notes
 * for inscriptions placed across all 8 zones (3 per zone).
 *
 * The 8 original inscriptions (inscription-*-1) are in zones.js as inline data.
 * This file provides the 16 NEW inscriptions (inscription-*-2 and inscription-*-3).
 *
 * useInk: true marks the 5 key inscriptions (one per zone: oasis, library,
 * marketplace, camp, palace) that route through InkDialogueEngine with
 * vocabulary-gated comprehension tiers (ENVR-02).
 */

export const INSCRIPTION_DATA = {

  // ============================================================
  // ZONE 1: Oasis Village (A1)
  // ============================================================

  'inscription-oasis-2': {
    arabicText: 'السَّلامُ عَلَيكُم يا أهلَ الواحَة. هُنا تَبدَأُ رِحلَةُ المَعرِفَة.',
    englishTranslation: 'Peace be upon you, people of the oasis. Here begins the journey of knowledge.',
    wordIds: ['greetings_001', 'salaam_1', 'knowledge_1', 'journey_1'],
    rootFamily: 'س-ل-م',
    rootFamilyEnglish: 'peace/submission',
    culturalNote: 'The root س-ل-م gave Arabic its words for peace (سلام), Islam (إسلام), and safety (سلامة). The greeting "as-salamu alaykum" is one of the most universal Arabic phrases worldwide.',
    cefrLevel: 'A1',
    useInk: true,
  },

  'inscription-oasis-3': {
    arabicText: 'أهلاً وسَهلاً بِكُم في السُّوق. التِّجارَةُ أمانَةٌ وصِدق.',
    englishTranslation: 'Welcome to the market. Trade is trust and honesty.',
    wordIds: ['ahlan_1', 'market_w31', 'trade_1', 'truth_1'],
    rootFamily: 'أ-م-ن',
    rootFamilyEnglish: 'trust/safety',
    culturalNote: 'The root أ-م-ن gave Arabic أمين (trustworthy), أمانة (trust), إيمان (faith), and آمن (safe). Ethical trade was central to early Islamic civilisation.',
    cefrLevel: 'A1',
    useInk: false,
  },

  // ============================================================
  // ZONE 2: Ancient Library (A1-A2)
  // ============================================================

  'inscription-library-2': {
    arabicText: 'اِقرَأ باسمِ رَبِّكَ الَّذي خَلَق. العِلمُ نورٌ والجَهلُ ظَلام.',
    englishTranslation: 'Read in the name of your Lord who created. Knowledge is light and ignorance is darkness.',
    wordIds: ['read_1', 'know_1', 'learn_1', 'understand_1'],
    rootFamily: 'ق-ر-أ',
    rootFamilyEnglish: 'reading',
    culturalNote: 'The root ق-ر-أ gave Arabic قَرَأ (to read), قُرآن (Quran — the recitation), and قارئ (reader). The first word revealed in the Quran was "iqra" — Read!',
    cefrLevel: 'A1',
    useInk: true,
  },

  'inscription-library-3': {
    arabicText: 'مَن طَلَبَ العِلمَ طالَ سَفَرُه. وَمَن وَجَدَ العِلمَ وَجَدَ السَّعادَة.',
    englishTranslation: 'He who seeks knowledge will travel far. He who finds knowledge finds happiness.',
    wordIds: ['learn_1', 'journey_1', 'find_1', 'happiness_1'],
    rootFamily: 'طَ-ل-ب',
    rootFamilyEnglish: 'seeking/requesting',
    culturalNote: 'The root طَ-ل-ب gave Arabic طالِب (student — "one who seeks"), مَطلوب (required), and طَلَب (to request). Seeking knowledge is a religious duty in Islam.',
    cefrLevel: 'A2',
    useInk: false,
  },

  // ============================================================
  // ZONE 3: Desert Marketplace (A2)
  // ============================================================

  'inscription-marketplace-2': {
    arabicText: 'البائِعُ أمينٌ والمُشتَري حَكيم. بَيعٌ بِعَدلٍ وشِراءٌ بِحِكمَة.',
    englishTranslation: 'The seller is trustworthy and the buyer is wise. Sell with justice and buy with wisdom.',
    wordIds: ['sell_w33', 'buy_w34', 'price_w29', 'merchant_w35'],
    rootFamily: 'ب-ي-ع',
    rootFamilyEnglish: 'selling/trade',
    culturalNote: 'The root ب-ي-ع gave Arabic باع (to sell), بَيع (sale), and مَبيع (goods sold). The Quran explicitly permits trade while forbidding usury (riba), establishing ethical commerce.',
    cefrLevel: 'A2',
    useInk: true,
  },

  'inscription-marketplace-3': {
    arabicText: 'بارَكَ اللهُ في تِجارَتِكُم. المالُ وَسيلَةٌ والخَيرُ غايَة.',
    englishTranslation: "May God bless your commerce. Wealth is a means, and goodness is the goal.",
    wordIds: ['money_w30', 'merchant_w44', 'gold_w32', 'shop_w28'],
    rootFamily: 'ب-ر-ك',
    rootFamilyEnglish: 'blessing',
    culturalNote: "The root ب-ر-ك gave Arabic بَرَكَة (blessing), مُبارَك (blessed), and تَبارَكَ (blessed be). Arab merchants began all transactions with 'bismillah' — In the name of God.",
    cefrLevel: 'A2',
    useInk: false,
  },

  // ============================================================
  // ZONE 4: Farmland (A2)
  // ============================================================

  'inscription-farmland-2': {
    arabicText: 'زَرَعنا الأَرضَ بِالأَملِ وحَصَدنا بِالجَهد. الزَّرعُ رِزقٌ مِنَ السَّماء.',
    englishTranslation: 'We planted the earth with hope and harvested through effort. Agriculture is provision from heaven.',
    wordIds: ['tree_w27', 'water_w13', 'earth_1', 'sun_w19'],
    rootFamily: 'ز-ر-ع',
    rootFamilyEnglish: 'planting/growing',
    culturalNote: 'The root ز-ر-ع gave Arabic زَرَعَ (to plant), زِراعَة (agriculture), and مَزرَعَة (farm). Islamic Golden Age scholars wrote encyclopaedic works on crop science and irrigation.',
    cefrLevel: 'A2',
    useInk: false,
  },

  'inscription-farmland-3': {
    arabicText: 'اللّهُمَّ بارِك لَنا في ثِمارِنا وأرزاقِنا. الحَمدُ للهِ رَبِّ العالَمين.',
    englishTranslation: 'O God, bless our fruits and provisions. All praise be to God, Lord of the worlds.',
    wordIds: ['flower_w26', 'rain_w14', 'moon_w20', 'sun_w19'],
    rootFamily: 'ح-م-د',
    rootFamilyEnglish: 'praise/gratitude',
    culturalNote: 'The root ح-م-د gave Arabic حَمد (praise), مُحَمَّد (praised one — the Prophet), and حَمدَلَة (saying "Alhamdulillah"). Gratitude prayers before harvest are found across Arab cultures.',
    cefrLevel: 'A2',
    useInk: false,
  },

  // ============================================================
  // ZONE 5: Bedouin Camp (B1)
  // ============================================================

  'inscription-camp-2': {
    arabicText: 'سافَرنا في بَرِّ الصَّحراء ووَجَدنا الطَّريق بِالنُّجوم. السَّفَرُ يُعَلِّمُ الحِكمَة.',
    englishTranslation: 'We travelled across the desert land and found the way by the stars. Travel teaches wisdom.',
    wordIds: ['star_w16', 'moon_w15', 'desert_w18', 'camel_1'],
    rootFamily: 'س-ف-ر',
    rootFamilyEnglish: 'travel/journey',
    culturalNote: 'The root س-ف-ر gave Arabic سَفَر (journey), سَفير (ambassador), مُسافِر (traveller), and سِفر (scripture/book). Bedouin caravans connected cultures across thousands of miles.',
    cefrLevel: 'B1',
    useInk: true,
  },

  'inscription-camp-3': {
    arabicText: 'الضَّيفُ كَريمٌ في بَيتِ البَدَوي. الكَرَمُ شَرَفٌ والبُخلُ عارٌ.',
    englishTranslation: 'The guest is honoured in the Bedouin home. Generosity is honour and miserliness is shame.',
    wordIds: ['welcome_1', 'strong_1', 'old_1', 'where_is_1'],
    rootFamily: 'ك-ر-م',
    rootFamilyEnglish: 'generosity/nobility',
    culturalNote: 'The root ك-ر-م gave Arabic كَريم (generous/noble), كَرَم (generosity), and كِرامَة (dignity). Bedouin hospitality (diyafa) requires hosting guests for three days without question.',
    cefrLevel: 'B1',
    useInk: false,
  },

  // ============================================================
  // ZONE 6: Mountain Village (B1)
  // ============================================================

  'inscription-mountain-2': {
    arabicText: 'صَنَعَ أجدادُنا مِنَ الجَبَلِ حَضارَة. الصُّنعَةُ فَنٌّ والحِرفَةُ شَرَف.',
    englishTranslation: 'Our ancestors built civilisation from the mountain. Craftsmanship is art and a trade is honour.',
    wordIds: ['horse_1', 'cloak_w5', 'new_1', 'bird_1'],
    rootFamily: 'ص-ن-ع',
    rootFamilyEnglish: 'making/crafting',
    culturalNote: 'The root ص-ن-ع gave Arabic صَنَعَ (to make), صِناعَة (industry), صانِع (craftsman), and مَصنَع (factory). Arab artisans in Toledo and Cordoba were famed for their metalwork across Europe.',
    cefrLevel: 'B1',
    useInk: false,
  },

  'inscription-mountain-3': {
    arabicText: 'الحَديدُ يُشَكِّلُه النّار والإنسانُ يُشَكِّلُه الصَّبر. الحِكمَةُ مِنَ التَّجرِبَة.',
    englishTranslation: 'Fire shapes iron and patience shapes the person. Wisdom comes from experience.',
    wordIds: ['hot_1', 'cold_1', 'beautiful_1', 'new_1'],
    rootFamily: 'ص-ب-ر',
    rootFamilyEnglish: 'patience/endurance',
    culturalNote: 'The root ص-ب-ر gave Arabic صَبر (patience), صابِر (patient one), and صَبّار (very patient). Patience (sabr) is one of the most praised virtues in Arabic proverbs.',
    cefrLevel: 'B1',
    useInk: false,
  },

  // ============================================================
  // ZONE 7: Coastal Port (B1-B2)
  // ============================================================

  'inscription-port-2': {
    arabicText: 'البَحرُ يَعلَمُ أسرارَنا والمَوجُ يَحمِلُ أحلامَنا. يا بَحرُ كُن رَحيماً.',
    englishTranslation: 'The sea knows our secrets and the waves carry our dreams. O sea, be merciful.',
    wordIds: ['sea_w23', 'wind_w26', 'north_1', 'fish_animal_1'],
    rootFamily: 'ب-ح-ر',
    rootFamilyEnglish: 'sea/ocean',
    culturalNote: 'The root ب-ح-ر gave Arabic بَحر (sea), بُحيرَة (lake), and بَحّار (sailor). Arab dhow sailors navigated the Indian Ocean for centuries using stars and monsoon winds.',
    cefrLevel: 'B1',
    useInk: false,
  },

  'inscription-port-3': {
    arabicText: 'اللّهُمَّ احفَظ سُفُنَنا وبَحّارَتَنا. مِنَ البَحرِ نَعيش وإلَيهِ نَعود.',
    englishTranslation: 'O God, protect our ships and our sailors. From the sea we live and to it we return.',
    wordIds: ['fish_1', 'meat_1', 'near_1', 'east_1'],
    rootFamily: 'ح-ف-ظ',
    rootFamilyEnglish: 'protection/preservation',
    culturalNote: 'The root ح-ف-ظ gave Arabic حَفِظَ (to protect/memorise), حافِظ (protector/one who memorises), and حِفظ (preservation). Memorising sacred texts for divine protection is a core Islamic practice.',
    cefrLevel: 'B2',
    useInk: false,
  },

  // ============================================================
  // ZONE 8: Royal Palace (B2)
  // ============================================================

  'inscription-palace-2': {
    arabicText: 'الحُكمُ بِالعَدلِ مِيزانُ المَملَكَة. الحاكِمُ خادِمُ الشَّعب وليسَ سَيِّدَه.',
    englishTranslation: 'Ruling with justice is the balance of the kingdom. The ruler is the servant of the people, not their master.',
    wordIds: ['big_1', 'old_1', 'brave_1', 'tall_1'],
    rootFamily: 'ح-ك-م',
    rootFamilyEnglish: 'ruling/wisdom',
    culturalNote: "The root ح-ك-م gave Arabic حَكَمَ (to rule/judge), حُكم (ruling/wisdom), حَكيم (wise one), and حِكمَة (wisdom). The concept of 'hukm' encompasses both governance and divine decree.",
    cefrLevel: 'B2',
    useInk: true,
  },

  'inscription-palace-3': {
    arabicText: 'مَرسومٌ مَلَكي: العِلمُ لِكُلِّ مَن طَلَبَه. المَعرِفَةُ تاجٌ لا يُسرَق.',
    englishTranslation: 'Royal decree: Knowledge for all who seek it. Wisdom is a crown that cannot be stolen.',
    wordIds: ['brave_1', 'big_1', 'i_speak_arabic_1', 'color_golden'],
    rootFamily: 'ع-د-ل',
    rootFamilyEnglish: 'justice/equality',
    culturalNote: "The root ع-د-ل gave Arabic عَدَلَ (to be just), عَدل (justice), عادِل (just/fair). The 'Scales of Justice' symbol appears in Islamic jurisprudence (fiqh) representing divine balance.",
    cefrLevel: 'B2',
    useInk: false,
  },
};
