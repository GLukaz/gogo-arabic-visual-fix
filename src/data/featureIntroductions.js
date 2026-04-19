/**
 * featureIntroductions.js — Progressive feature introduction data.
 *
 * Each entry triggers when the player reaches the specified level and
 * has not yet seen that introduction. Introductions are brief walkthroughs
 * that explain a newly-unlocked game system.
 *
 * Phase 92 — Tutorial & Onboarding Refresh
 */

export const FEATURE_INTRODUCTIONS = [
  // ── Level 1 ──
  {
    id: 'intro_basic_quiz',
    triggerLevel: 1,
    title: 'Your First Quiz',
    titleArabic: 'اختبارك الأول',
    description: 'Test your knowledge with vocabulary quizzes! Start with Arabic to English matching.',
    steps: [
      { text: 'Quizzes help you remember Arabic words', textArabic: 'الاختبارات تساعدك على تذكر الكلمات العربية' },
      { text: 'Answer correctly to earn XP', textArabic: 'أجب بشكل صحيح لتكسب نقاط خبرة' },
      { text: 'Your words are scheduled for review using spaced repetition', textArabic: 'كلماتك مجدولة للمراجعة بالتكرار المتباعد' },
    ],
    feature: 'quiz',
  },
  {
    id: 'intro_alphabet',
    triggerLevel: 1,
    title: 'The Arabic Alphabet',
    titleArabic: 'الأبجدية العربية',
    description: 'Learn the 28 Arabic letters — the foundation of reading and writing.',
    steps: [
      { text: 'Arabic is read from right to left', textArabic: 'العربية تُقرأ من اليمين إلى اليسار' },
      { text: 'Letters change shape depending on their position in a word', textArabic: 'الحروف تتغير شكلها حسب موقعها في الكلمة' },
      { text: 'Master letter groups to unlock new vocabulary', textArabic: 'أتقن مجموعات الحروف لتفتح مفردات جديدة' },
    ],
    feature: 'alphabet',
  },
  {
    id: 'intro_journal',
    triggerLevel: 1,
    title: 'Your Journal',
    titleArabic: 'دفترك',
    description: 'Track your quests, learned words, and progress in your journal.',
    steps: [
      { text: 'Open your journal to see active quests', textArabic: 'افتح دفترك لرؤية المهام النشطة' },
      { text: 'Review words you have learned so far', textArabic: 'راجع الكلمات التي تعلمتها حتى الآن' },
      { text: 'Check your stats and achievements', textArabic: 'تحقق من إحصائياتك وإنجازاتك' },
    ],
    feature: 'journal',
  },

  // ── Level 2 ──
  {
    id: 'intro_writing_practice',
    triggerLevel: 2,
    title: 'Writing Practice Unlocked!',
    titleArabic: 'تدريب الكتابة مُتاح!',
    description: 'Trace Arabic letters and words on the canvas to improve your handwriting.',
    steps: [
      { text: 'Trace letters with your finger or mouse', textArabic: 'ارسم الحروف بإصبعك أو الماوس' },
      { text: 'Follow the guide strokes for correct form', textArabic: 'اتبع خطوط الدليل للشكل الصحيح' },
      { text: 'Practice makes your handwriting beautiful', textArabic: 'الممارسة تجعل خطك جميلًا' },
    ],
    feature: 'writingPractice',
  },
  {
    id: 'intro_fill_blank',
    triggerLevel: 2,
    title: 'Fill in the Blank',
    titleArabic: 'املأ الفراغ',
    description: 'A new quiz type! Complete sentences by filling in the missing word.',
    steps: [
      { text: 'Read the sentence and find the missing word', textArabic: 'اقرأ الجملة وجد الكلمة المفقودة' },
      { text: 'This builds your grammar intuition', textArabic: 'هذا يبني حدسك اللغوي' },
    ],
    feature: 'fillBlank',
  },

  // ── Level 3 ──
  {
    id: 'intro_daily_challenges',
    triggerLevel: 3,
    title: 'Daily Challenges!',
    titleArabic: 'التحديات اليومية!',
    description: 'Complete a new challenge every day to earn bonus XP and keep your streak alive.',
    steps: [
      { text: 'A fresh challenge appears every day', textArabic: 'تحدٍّ جديد يظهر كل يوم' },
      { text: 'Maintain your streak for bonus rewards', textArabic: 'حافظ على سلسلتك لمكافآت إضافية' },
      { text: 'Challenges cover vocabulary, grammar, and culture', textArabic: 'التحديات تغطي المفردات والقواعد والثقافة' },
    ],
    feature: 'dailyChallenges',
  },
  {
    id: 'intro_mini_games',
    triggerLevel: 3,
    title: 'Mini-Games!',
    titleArabic: 'الألعاب المصغرة!',
    description: 'Take a break from studying with fun Arabic mini-games.',
    steps: [
      { text: 'Mini-games are a fun way to practise Arabic', textArabic: 'الألعاب المصغرة طريقة ممتعة لممارسة العربية' },
      { text: 'Earn XP while playing', textArabic: 'اكسب نقاط خبرة أثناء اللعب' },
      { text: 'New mini-games unlock as you progress', textArabic: 'ألعاب مصغرة جديدة تُفتح مع تقدمك' },
    ],
    feature: 'miniGames',
  },
  {
    id: 'intro_listening',
    triggerLevel: 3,
    title: 'Listening Quizzes',
    titleArabic: 'اختبارات الاستماع',
    description: 'Train your ear to recognise spoken Arabic words and phrases.',
    steps: [
      { text: 'Listen carefully to the Arabic audio', textArabic: 'استمع بعناية إلى الصوت العربي' },
      { text: 'Choose the correct meaning or spelling', textArabic: 'اختر المعنى أو الهجاء الصحيح' },
      { text: 'Listening skills are key to real conversations', textArabic: 'مهارات الاستماع أساسية للمحادثات الحقيقية' },
    ],
    feature: 'listening',
  },

  // ── Level 4 ──
  {
    id: 'intro_reading_passages',
    triggerLevel: 4,
    title: 'Reading Passages',
    titleArabic: 'نصوص القراءة',
    description: 'Read short Arabic stories and answer comprehension questions.',
    steps: [
      { text: 'Read authentic Arabic texts at your level', textArabic: 'اقرأ نصوصًا عربية أصلية بمستواك' },
      { text: 'Tap unfamiliar words to see their meaning', textArabic: 'انقر على الكلمات غير المألوفة لمعرفة معناها' },
      { text: 'Answer questions to test your understanding', textArabic: 'أجب عن الأسئلة لاختبار فهمك' },
    ],
    feature: 'readingPassages',
  },
  {
    id: 'intro_grammar',
    triggerLevel: 4,
    title: 'Grammar Lessons',
    titleArabic: 'دروس القواعد',
    description: 'Learn Arabic grammar rules with clear explanations and practice exercises.',
    steps: [
      { text: 'Grammar unlocks deeper understanding of Arabic', textArabic: 'القواعد تفتح فهمًا أعمق للعربية' },
      { text: 'Each lesson includes examples and exercises', textArabic: 'كل درس يتضمن أمثلة وتمارين' },
      { text: 'Grammar quiz types test your new knowledge', textArabic: 'أنواع اختبارات القواعد تختبر معرفتك الجديدة' },
    ],
    feature: 'grammar',
  },

  // ── Level 5 ──
  {
    id: 'intro_conversation',
    triggerLevel: 5,
    title: 'Conversation Practice',
    titleArabic: 'تدريب المحادثة',
    description: 'Practice real Arabic conversations with NPCs in different scenarios.',
    steps: [
      { text: 'Choose dialogue options to guide the conversation', textArabic: 'اختر خيارات الحوار لتوجيه المحادثة' },
      { text: 'Learn everyday phrases used by native speakers', textArabic: 'تعلم عبارات يومية يستخدمها الناطقون الأصليون' },
      { text: 'Your choices affect NPC relationships', textArabic: 'اختياراتك تؤثر على علاقات الشخصيات' },
    ],
    feature: 'conversation',
  },
  {
    id: 'intro_skill_trees',
    triggerLevel: 5,
    title: 'Skill Trees',
    titleArabic: 'أشجار المهارات',
    description: 'Invest skill points to specialise in vocabulary, grammar, reading, and more.',
    steps: [
      { text: 'Earn skill points as you level up', textArabic: 'اكسب نقاط مهارة مع ارتفاع مستواك' },
      { text: 'Choose a branch that matches your goals', textArabic: 'اختر فرعًا يتوافق مع أهدافك' },
      { text: 'Unlocked nodes grant permanent bonuses', textArabic: 'العقد المفتوحة تمنح مكافآت دائمة' },
    ],
    feature: 'skillTrees',
  },
  {
    id: 'intro_lore_codex',
    triggerLevel: 5,
    title: 'Lore Codex',
    titleArabic: 'موسوعة القصص',
    description: 'Discover the rich history and culture woven into the world of Gogo Arabic.',
    steps: [
      { text: 'Collect lore entries as you explore the world', textArabic: 'اجمع مقالات القصص أثناء استكشافك للعالم' },
      { text: 'Lore teaches real Arabic culture and history', textArabic: 'القصص تعلمك الثقافة والتاريخ العربي الحقيقي' },
      { text: 'Complete collections for bonus rewards', textArabic: 'أكمل المجموعات لمكافآت إضافية' },
    ],
    feature: 'loreCodex',
  },

  // ── Level 8 ──
  {
    id: 'intro_gift_giving',
    triggerLevel: 8,
    title: 'Gift Giving',
    titleArabic: 'تقديم الهدايا',
    description: 'Build relationships with NPCs by giving them gifts they enjoy.',
    steps: [
      { text: 'Each NPC has favourite gifts', textArabic: 'كل شخصية لها هدايا مفضلة' },
      { text: 'Stronger relationships unlock special dialogue and quests', textArabic: 'العلاقات الأقوى تفتح حوارات ومهام خاصة' },
      { text: 'Find gifts while exploring or buy them at shops', textArabic: 'جد الهدايا أثناء الاستكشاف أو اشترها من المتاجر' },
    ],
    feature: 'giftGiving',
  },
  {
    id: 'intro_advanced_quizzes',
    triggerLevel: 8,
    title: 'Advanced Quiz Types',
    titleArabic: 'أنواع اختبارات متقدمة',
    description: 'New challenging quiz formats: dialect identification, root expansion, and cultural context.',
    steps: [
      { text: 'Dialect quizzes test your knowledge of Arabic varieties', textArabic: 'اختبارات اللهجات تختبر معرفتك بتنوعات العربية' },
      { text: 'Root expansion deepens your vocabulary connections', textArabic: 'توسيع الجذور يعمّق روابطك المفرداتية' },
      { text: 'Cultural context questions sharpen real-world understanding', textArabic: 'أسئلة السياق الثقافي تشحذ فهمك للعالم الحقيقي' },
    ],
    feature: 'advancedQuizzes',
  },
  {
    id: 'intro_factions',
    triggerLevel: 8,
    title: 'Factions',
    titleArabic: 'الفصائل',
    description: 'Join one of the Arabic world factions and earn unique rewards.',
    steps: [
      { text: 'Each faction focuses on different aspects of Arabic', textArabic: 'كل فصيل يركز على جوانب مختلفة من العربية' },
      { text: 'Complete faction quests for exclusive content', textArabic: 'أكمل مهام الفصيل لمحتوى حصري' },
      { text: 'Your faction reputation grows with your contributions', textArabic: 'سمعتك في الفصيل تنمو مع مساهماتك' },
    ],
    feature: 'factions',
  },

  // ── Level 10 ──
  {
    id: 'intro_poetry_battles',
    triggerLevel: 10,
    title: 'Poetry Battles',
    titleArabic: 'معارك الشعر',
    description: 'Challenge NPCs to poetic duels using your Arabic knowledge.',
    steps: [
      { text: 'Complete verses by choosing the right words', textArabic: 'أكمل الأبيات باختيار الكلمات الصحيحة' },
      { text: 'Earn rare rewards and reputation', textArabic: 'اكسب مكافآت نادرة وسمعة' },
      { text: 'Poetry is central to Arabic literary tradition', textArabic: 'الشعر جوهر التراث الأدبي العربي' },
    ],
    feature: 'poetryBattles',
  },
  {
    id: 'intro_companions',
    triggerLevel: 10,
    title: 'Companions',
    titleArabic: 'الرفاق',
    description: 'Recruit companions who travel with you and offer study bonuses.',
    steps: [
      { text: 'Companions provide passive XP bonuses', textArabic: 'الرفاق يوفرون مكافآت خبرة سلبية' },
      { text: 'Build your bond through conversation and gifts', textArabic: 'ابنِ رابطتك من خلال المحادثة والهدايا' },
      { text: 'Each companion has unique Arabic teaching strengths', textArabic: 'كل رفيق لديه نقاط قوة تعليمية فريدة' },
    ],
    feature: 'companions',
  },

  // ── Level 12 ──
  {
    id: 'intro_crafting',
    triggerLevel: 12,
    title: 'Crafting',
    titleArabic: 'الصناعة',
    description: 'Combine resources to craft useful items, potions, and equipment.',
    steps: [
      { text: 'Gather resources from the world and shops', textArabic: 'اجمع الموارد من العالم والمتاجر' },
      { text: 'Learn recipes to craft items', textArabic: 'تعلم الوصفات لصنع الأدوات' },
      { text: 'Crafted items boost your learning abilities', textArabic: 'الأدوات المصنوعة تعزز قدراتك التعليمية' },
    ],
    feature: 'crafting',
  },

  // ── Level 15 ──
  {
    id: 'intro_arena',
    triggerLevel: 15,
    title: 'The Arena',
    titleArabic: 'الحلبة',
    description: 'Test your Arabic mastery against waves of challenging opponents.',
    steps: [
      { text: 'Face increasingly difficult Arabic challenges', textArabic: 'واجه تحديات عربية متزايدة الصعوبة' },
      { text: 'Climb the ranks for prestigious rewards', textArabic: 'ارتقِ في المراتب لمكافآت مرموقة' },
      { text: 'The Arena is the ultimate test of your knowledge', textArabic: 'الحلبة هي الاختبار النهائي لمعرفتك' },
    ],
    feature: 'arena',
  },
];

/**
 * Look up a feature introduction by its ID.
 */
export function getFeatureIntroById(id) {
  return FEATURE_INTRODUCTIONS.find((intro) => intro.id === id) || null;
}

/**
 * Get all introductions that should trigger at or before a given level.
 */
export function getIntrosForLevel(level) {
  return FEATURE_INTRODUCTIONS.filter((intro) => intro.triggerLevel <= level);
}

/**
 * Get the set of unique feature IDs covered by the data.
 */
export function getAllFeatureIds() {
  return [...new Set(FEATURE_INTRODUCTIONS.map((intro) => intro.feature))];
}
