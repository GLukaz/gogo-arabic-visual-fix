/**
 * rootExpansions.js — Root expansion quiz data for multi-select root word identification
 *
 * 20+ trilateral Arabic roots, each with:
 *   root        — The trilateral root (hyphen-separated)
 *   rootDisplay — Root displayed with kashaida (spaced letters)
 *   meaning     — Core meaning of the root
 *   derived     — 3-5 words genuinely derived from this root (correct answers)
 *   distractors — 2-3 words from OTHER roots (wrong answers)
 *
 * Each derived/distractor word has: { arabic, transliteration, english }
 */

export const ROOT_EXPANSIONS = [
  {
    root: 'ك-ت-ب',
    rootDisplay: 'ك ت ب',
    meaning: 'writing',
    derived: [
      { arabic: 'كتاب', transliteration: 'kitaab', english: 'book' },
      { arabic: 'كاتب', transliteration: 'kaatib', english: 'writer' },
      { arabic: 'مكتوب', transliteration: 'maktuub', english: 'written / letter' },
      { arabic: 'مكتبة', transliteration: 'maktaba', english: 'library' },
      { arabic: 'كتابة', transliteration: 'kitaaba', english: 'writing' },
    ],
    distractors: [
      { arabic: 'كلب', transliteration: 'kalb', english: 'dog' },
      { arabic: 'كبير', transliteration: 'kabiir', english: 'big' },
    ],
  },
  {
    root: 'د-ر-س',
    rootDisplay: 'د ر س',
    meaning: 'studying',
    derived: [
      { arabic: 'درس', transliteration: 'dars', english: 'lesson' },
      { arabic: 'مدرسة', transliteration: 'madrasa', english: 'school' },
      { arabic: 'مدرّس', transliteration: 'mudarris', english: 'teacher' },
      { arabic: 'دراسة', transliteration: 'diraasa', english: 'study' },
    ],
    distractors: [
      { arabic: 'درج', transliteration: 'daraj', english: 'stairs' },
      { arabic: 'دار', transliteration: 'daar', english: 'house' },
      { arabic: 'درب', transliteration: 'darb', english: 'path' },
    ],
  },
  {
    root: 'ع-ل-م',
    rootDisplay: 'ع ل م',
    meaning: 'knowledge',
    derived: [
      { arabic: 'عِلم', transliteration: '3ilm', english: 'knowledge / science' },
      { arabic: 'عالَم', transliteration: '3aalam', english: 'world' },
      { arabic: 'عالِم', transliteration: '3aalim', english: 'scholar' },
      { arabic: 'معلّم', transliteration: 'mu3allim', english: 'teacher' },
      { arabic: 'تعليم', transliteration: 'ta3liim', english: 'education' },
    ],
    distractors: [
      { arabic: 'عمل', transliteration: '3amal', english: 'work' },
      { arabic: 'علبة', transliteration: '3ulba', english: 'box' },
    ],
  },
  {
    root: 'ح-م-د',
    rootDisplay: 'ح م د',
    meaning: 'praise',
    derived: [
      { arabic: 'حمد', transliteration: '7amd', english: 'praise' },
      { arabic: 'محمّد', transliteration: 'mu7ammad', english: 'Muhammad (praised one)' },
      { arabic: 'أحمد', transliteration: 'a7mad', english: 'Ahmad (most praised)' },
      { arabic: 'محمود', transliteration: 'ma7muud', english: 'Mahmoud (praiseworthy)' },
    ],
    distractors: [
      { arabic: 'حمام', transliteration: '7amaam', english: 'bathroom / pigeon' },
      { arabic: 'حمل', transliteration: '7amal', english: 'to carry' },
      { arabic: 'حديد', transliteration: '7adiid', english: 'iron' },
    ],
  },
  {
    root: 'ق-ر-أ',
    rootDisplay: 'ق ر أ',
    meaning: 'reading',
    derived: [
      { arabic: 'قراءة', transliteration: 'qiraa\'a', english: 'reading' },
      { arabic: 'قارئ', transliteration: 'qaari\'', english: 'reader' },
      { arabic: 'قرآن', transliteration: 'qur\'aan', english: 'Quran (recitation)' },
      { arabic: 'مقروء', transliteration: 'maqruu\'', english: 'readable' },
    ],
    distractors: [
      { arabic: 'قريب', transliteration: 'qariib', english: 'close / near' },
      { arabic: 'قرية', transliteration: 'qarya', english: 'village' },
    ],
  },
  {
    root: 'س-ف-ر',
    rootDisplay: 'س ف ر',
    meaning: 'travel',
    derived: [
      { arabic: 'سفر', transliteration: 'safar', english: 'travel / journey' },
      { arabic: 'مسافر', transliteration: 'musaafir', english: 'traveler' },
      { arabic: 'سفارة', transliteration: 'sifaara', english: 'embassy' },
      { arabic: 'سفير', transliteration: 'safiir', english: 'ambassador' },
    ],
    distractors: [
      { arabic: 'سفينة', transliteration: 'safiina', english: 'ship' },
      { arabic: 'سمك', transliteration: 'samak', english: 'fish' },
      { arabic: 'سكر', transliteration: 'sukkar', english: 'sugar' },
    ],
  },
  {
    root: 'ج-م-ع',
    rootDisplay: 'ج م ع',
    meaning: 'gathering',
    derived: [
      { arabic: 'جامعة', transliteration: 'jaami3a', english: 'university' },
      { arabic: 'مجتمع', transliteration: 'mujtama3', english: 'society' },
      { arabic: 'جمعة', transliteration: 'jum3a', english: 'Friday' },
      { arabic: 'جامع', transliteration: 'jaami3', english: 'mosque / collector' },
      { arabic: 'اجتماع', transliteration: 'ijtimaa3', english: 'meeting' },
    ],
    distractors: [
      { arabic: 'جمل', transliteration: 'jamal', english: 'camel' },
      { arabic: 'جميل', transliteration: 'jamiil', english: 'beautiful' },
    ],
  },
  {
    root: 'ف-ت-ح',
    rootDisplay: 'ف ت ح',
    meaning: 'opening',
    derived: [
      { arabic: 'فتح', transliteration: 'fat7', english: 'opening / conquest' },
      { arabic: 'مفتاح', transliteration: 'miftaa7', english: 'key' },
      { arabic: 'فاتحة', transliteration: 'faati7a', english: 'opening (chapter)' },
      { arabic: 'مفتوح', transliteration: 'maftuu7', english: 'open' },
    ],
    distractors: [
      { arabic: 'فتى', transliteration: 'fata', english: 'young man' },
      { arabic: 'فجر', transliteration: 'fajr', english: 'dawn' },
    ],
  },
  {
    root: 'ش-ر-ب',
    rootDisplay: 'ش ر ب',
    meaning: 'drinking',
    derived: [
      { arabic: 'شراب', transliteration: 'sharaab', english: 'drink / beverage' },
      { arabic: 'مشروب', transliteration: 'mashruub', english: 'beverage' },
      { arabic: 'شارب', transliteration: 'shaarib', english: 'drinker / moustache' },
    ],
    distractors: [
      { arabic: 'شارع', transliteration: 'shaari3', english: 'street' },
      { arabic: 'شرق', transliteration: 'sharq', english: 'east' },
      { arabic: 'شجرة', transliteration: 'shajara', english: 'tree' },
    ],
  },
  {
    root: 'ح-ك-م',
    rootDisplay: 'ح ك م',
    meaning: 'judgment / rule',
    derived: [
      { arabic: 'حكم', transliteration: '7ukm', english: 'ruling / judgment' },
      { arabic: 'حكيم', transliteration: '7akiim', english: 'wise' },
      { arabic: 'حكومة', transliteration: '7ukuuma', english: 'government' },
      { arabic: 'محكمة', transliteration: 'ma7kama', english: 'court' },
      { arabic: 'حاكم', transliteration: '7aakim', english: 'ruler / governor' },
    ],
    distractors: [
      { arabic: 'حكاية', transliteration: '7ikaaya', english: 'story' },
      { arabic: 'حلم', transliteration: '7ulm', english: 'dream' },
    ],
  },
  {
    root: 'ن-ظ-ر',
    rootDisplay: 'ن ظ ر',
    meaning: 'seeing / looking',
    derived: [
      { arabic: 'نظر', transliteration: 'nathar', english: 'sight / look' },
      { arabic: 'نظارة', transliteration: 'naththaara', english: 'glasses' },
      { arabic: 'منظر', transliteration: 'manthar', english: 'view / scenery' },
      { arabic: 'نظرية', transliteration: 'nathariyya', english: 'theory' },
    ],
    distractors: [
      { arabic: 'نظيف', transliteration: 'nathiif', english: 'clean' },
      { arabic: 'نجم', transliteration: 'najm', english: 'star' },
    ],
  },
  {
    root: 'ص-ل-ح',
    rootDisplay: 'ص ل ح',
    meaning: 'goodness / reform',
    derived: [
      { arabic: 'صالح', transliteration: 'saali7', english: 'righteous / good' },
      { arabic: 'إصلاح', transliteration: 'islaah', english: 'reform' },
      { arabic: 'مصلحة', transliteration: 'masla7a', english: 'interest / benefit' },
      { arabic: 'صلح', transliteration: 'sul7', english: 'peace / reconciliation' },
    ],
    distractors: [
      { arabic: 'صلاة', transliteration: 'salaah', english: 'prayer' },
      { arabic: 'صحة', transliteration: 'si77a', english: 'health' },
      { arabic: 'صندوق', transliteration: 'sunduuq', english: 'box' },
    ],
  },
  {
    root: 'ع-م-ل',
    rootDisplay: 'ع م ل',
    meaning: 'work / action',
    derived: [
      { arabic: 'عمل', transliteration: '3amal', english: 'work' },
      { arabic: 'عامل', transliteration: '3aamil', english: 'worker' },
      { arabic: 'معمل', transliteration: 'ma3mal', english: 'factory / lab' },
      { arabic: 'عملية', transliteration: '3amaliyya', english: 'operation / process' },
    ],
    distractors: [
      { arabic: 'عمر', transliteration: '3umr', english: 'age / life' },
      { arabic: 'عمود', transliteration: '3amuud', english: 'column / pillar' },
    ],
  },
  {
    root: 'خ-ر-ج',
    rootDisplay: 'خ ر ج',
    meaning: 'going out / exiting',
    derived: [
      { arabic: 'خروج', transliteration: 'khuruuj', english: 'exit / going out' },
      { arabic: 'مخرج', transliteration: 'mukhraj', english: 'exit / director' },
      { arabic: 'خارج', transliteration: 'khaarij', english: 'outside' },
      { arabic: 'إخراج', transliteration: 'ikhraaj', english: 'directing / production' },
    ],
    distractors: [
      { arabic: 'خريطة', transliteration: 'khariita', english: 'map' },
      { arabic: 'خبز', transliteration: 'khubz', english: 'bread' },
      { arabic: 'خشب', transliteration: 'khashab', english: 'wood' },
    ],
  },
  {
    root: 'ل-ع-ب',
    rootDisplay: 'ل ع ب',
    meaning: 'playing',
    derived: [
      { arabic: 'لعبة', transliteration: 'lu3ba', english: 'game' },
      { arabic: 'لاعب', transliteration: 'laa3ib', english: 'player' },
      { arabic: 'ملعب', transliteration: 'mal3ab', english: 'playground / stadium' },
    ],
    distractors: [
      { arabic: 'لبن', transliteration: 'laban', english: 'milk / yoghurt' },
      { arabic: 'لحم', transliteration: 'la7m', english: 'meat' },
    ],
  },
  {
    root: 'أ-ك-ل',
    rootDisplay: 'أ ك ل',
    meaning: 'eating',
    derived: [
      { arabic: 'أكل', transliteration: 'akl', english: 'food / eating' },
      { arabic: 'مأكولات', transliteration: 'ma\'kuulaat', english: 'foods / dishes' },
      { arabic: 'آكل', transliteration: 'aakil', english: 'eater' },
    ],
    distractors: [
      { arabic: 'أمل', transliteration: 'amal', english: 'hope' },
      { arabic: 'أسد', transliteration: 'asad', english: 'lion' },
      { arabic: 'أخ', transliteration: 'akh', english: 'brother' },
    ],
  },
  {
    root: 'ك-ل-م',
    rootDisplay: 'ك ل م',
    meaning: 'speech / word',
    derived: [
      { arabic: 'كلمة', transliteration: 'kalima', english: 'word' },
      { arabic: 'كلام', transliteration: 'kalaam', english: 'speech / talk' },
      { arabic: 'متكلّم', transliteration: 'mutakallim', english: 'speaker' },
      { arabic: 'تكلّم', transliteration: 'takallam', english: 'to speak' },
    ],
    distractors: [
      { arabic: 'كمال', transliteration: 'kamaal', english: 'perfection' },
      { arabic: 'كسل', transliteration: 'kasal', english: 'laziness' },
    ],
  },
  {
    root: 'ح-س-ب',
    rootDisplay: 'ح س ب',
    meaning: 'counting / reckoning',
    derived: [
      { arabic: 'حساب', transliteration: '7isaab', english: 'account / calculation' },
      { arabic: 'حاسوب', transliteration: '7aasuub', english: 'computer' },
      { arabic: 'محاسب', transliteration: 'mu7aasib', english: 'accountant' },
    ],
    distractors: [
      { arabic: 'حصان', transliteration: '7isaan', english: 'horse' },
      { arabic: 'حسن', transliteration: '7asan', english: 'good / beautiful' },
    ],
  },
  {
    root: 'و-ص-ل',
    rootDisplay: 'و ص ل',
    meaning: 'connecting / arriving',
    derived: [
      { arabic: 'وصل', transliteration: 'wasal', english: 'to arrive' },
      { arabic: 'اتصال', transliteration: 'ittisaal', english: 'connection / call' },
      { arabic: 'مواصلات', transliteration: 'muwaasalaat', english: 'transportation' },
      { arabic: 'توصيل', transliteration: 'tawsiil', english: 'delivery' },
    ],
    distractors: [
      { arabic: 'وسط', transliteration: 'wasat', english: 'middle' },
      { arabic: 'وطن', transliteration: 'watan', english: 'homeland' },
    ],
  },
  {
    root: 'ذ-ه-ب',
    rootDisplay: 'ذ ه ب',
    meaning: 'going / gold',
    derived: [
      { arabic: 'ذهب', transliteration: 'thahab', english: 'gold / to go' },
      { arabic: 'ذهاب', transliteration: 'thahaab', english: 'going / departure' },
      { arabic: 'مذهب', transliteration: 'mathhab', english: 'doctrine / school of thought' },
    ],
    distractors: [
      { arabic: 'ذكر', transliteration: 'thikar', english: 'mention / male' },
      { arabic: 'ذكاء', transliteration: 'thakaa\'', english: 'intelligence' },
      { arabic: 'ذراع', transliteration: 'thiraa3', english: 'arm' },
    ],
  },
];
