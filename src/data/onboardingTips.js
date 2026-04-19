/**
 * onboardingTips.js — Context-sensitive tips shown during gameplay.
 *
 * Each tip has a `context` string that the UI layer matches against
 * the current game state. Tips with `showOnce: true` are dismissed
 * permanently after the player acknowledges them.
 *
 * Phase 92 — Tutorial & Onboarding Refresh
 */

export const ONBOARDING_TIPS = [
  // ── FSRS / Review tips ──
  {
    id: 'tip_fsrs_review',
    context: 'review_due',
    title: 'Review Time!',
    titleArabic: 'وقت المراجعة!',
    message: 'You have words ready for review. Reviewing at the right time helps you remember forever!',
    messageArabic: 'لديك كلمات جاهزة للمراجعة. المراجعة في الوقت المناسب تساعدك على التذكر للأبد!',
    showOnce: true,
  },
  {
    id: 'tip_spaced_repetition',
    context: 'first_review_complete',
    title: 'Spaced Repetition',
    titleArabic: 'التكرار المتباعد',
    message: 'Great review! Words you find easy will appear less often. Tricky ones come back sooner.',
    messageArabic: 'مراجعة رائعة! الكلمات السهلة ستظهر أقل. الكلمات الصعبة ستعود أسرع.',
    showOnce: true,
  },

  // ── First time opening features ──
  {
    id: 'tip_first_quiz_start',
    context: 'first_quiz_start',
    title: 'Quiz Tips',
    titleArabic: 'نصائح الاختبار',
    message: 'Take your time! There is no timer on standard quizzes. Accuracy matters more than speed.',
    messageArabic: 'خذ وقتك! لا يوجد مؤقت في الاختبارات العادية. الدقة أهم من السرعة.',
    showOnce: true,
  },
  {
    id: 'tip_first_shop_visit',
    context: 'first_shop_visit',
    title: 'Welcome to the Shop',
    titleArabic: 'أهلًا بك في المتجر',
    message: 'Spend your dirhams on items that boost XP, unlock recipes, or make great gifts for NPCs.',
    messageArabic: 'أنفق دراهمك على أدوات تعزز الخبرة أو تفتح وصفات أو تصنع هدايا رائعة.',
    showOnce: true,
  },
  {
    id: 'tip_first_map_open',
    context: 'first_map_open',
    title: 'Explore the World',
    titleArabic: 'استكشف العالم',
    message: 'Each zone has unique NPCs, quests, and vocabulary to discover. Visit them all!',
    messageArabic: 'كل منطقة فيها شخصيات ومهام ومفردات فريدة. زُر الجميع!',
    showOnce: true,
  },
  {
    id: 'tip_first_npc_dialogue',
    context: 'first_npc_dialogue',
    title: 'Talking to NPCs',
    titleArabic: 'التحدث مع الشخصيات',
    message: 'NPCs teach you Arabic through conversation. Some offer quests with great rewards.',
    messageArabic: 'الشخصيات تعلمك العربية من خلال المحادثة. بعضها يقدم مهام بمكافآت رائعة.',
    showOnce: true,
  },
  {
    id: 'tip_first_writing_open',
    context: 'first_writing_open',
    title: 'Writing Tips',
    titleArabic: 'نصائح الكتابة',
    message: 'Start each stroke from the right. Arabic letters connect naturally from right to left.',
    messageArabic: 'ابدأ كل حركة من اليمين. الحروف العربية تتصل طبيعيًا من اليمين إلى اليسار.',
    showOnce: true,
  },
  {
    id: 'tip_first_reading_open',
    context: 'first_reading_open',
    title: 'Reading Tips',
    titleArabic: 'نصائح القراءة',
    message: 'Do not try to understand every word. Focus on getting the overall meaning first.',
    messageArabic: 'لا تحاول فهم كل كلمة. ركز على المعنى العام أولًا.',
    showOnce: true,
  },
  {
    id: 'tip_first_grammar_open',
    context: 'first_grammar_open',
    title: 'Grammar Tips',
    titleArabic: 'نصائح القواعد',
    message: 'Arabic grammar follows beautiful patterns. Once you see them, the language clicks.',
    messageArabic: 'قواعد العربية تتبع أنماطًا جميلة. بمجرد رؤيتها، ستفهم اللغة.',
    showOnce: true,
  },
  {
    id: 'tip_first_skill_tree_open',
    context: 'first_skill_tree_open',
    title: 'Skill Tree Tips',
    titleArabic: 'نصائح أشجار المهارات',
    message: 'You do not need to unlock every node. Focus on branches that match how you want to learn.',
    messageArabic: 'لا تحتاج لفتح كل عقدة. ركز على الفروع التي تتوافق مع طريقة تعلمك.',
    showOnce: true,
  },
  {
    id: 'tip_first_codex_open',
    context: 'first_codex_open',
    title: 'Codex Tips',
    titleArabic: 'نصائح الموسوعة',
    message: 'The Lore Codex contains real Arabic cultural knowledge. Reading entries earns XP too!',
    messageArabic: 'موسوعة القصص تحتوي على معرفة ثقافية عربية حقيقية. قراءة المقالات تكسبك خبرة أيضًا!',
    showOnce: true,
  },
  {
    id: 'tip_first_crafting_open',
    context: 'first_crafting_open',
    title: 'Crafting Tips',
    titleArabic: 'نصائح الصناعة',
    message: 'Experiment with different ingredient combinations. Some recipes are hidden!',
    messageArabic: 'جرب مجموعات مكونات مختلفة. بعض الوصفات مخفية!',
    showOnce: true,
  },
  {
    id: 'tip_first_arena_open',
    context: 'first_arena_open',
    title: 'Arena Tips',
    titleArabic: 'نصائح الحلبة',
    message: 'The Arena gets harder each wave. Use items and spells to give yourself an edge.',
    messageArabic: 'الحلبة تصبح أصعب كل موجة. استخدم الأدوات والتعويذات لتمنح نفسك أفضلية.',
    showOnce: true,
  },

  // ── Study habits ──
  {
    id: 'tip_streak_about_to_break',
    context: 'streak_warning',
    title: 'Keep Your Streak!',
    titleArabic: 'حافظ على سلسلتك!',
    message: 'Your daily streak is about to break! Complete one activity to keep it alive.',
    messageArabic: 'سلسلتك اليومية على وشك الانقطاع! أكمل نشاطًا واحدًا للحفاظ عليها.',
    showOnce: false,
  },
  {
    id: 'tip_welcome_back',
    context: 'long_absence',
    title: 'Welcome Back!',
    titleArabic: 'أهلًا بعودتك!',
    message: 'It has been a while! Start with a quick review to refresh your memory.',
    messageArabic: 'مرّ وقت طويل! ابدأ بمراجعة سريعة لتنعش ذاكرتك.',
    showOnce: false,
  },
  {
    id: 'tip_study_session_long',
    context: 'long_session',
    title: 'Take a Break',
    titleArabic: 'خذ استراحة',
    message: 'You have been studying for a while. Short breaks help your brain consolidate what you learned.',
    messageArabic: 'أنت تدرس منذ فترة. الاستراحات القصيرة تساعد دماغك على تثبيت ما تعلمته.',
    showOnce: false,
  },

  // ── Learning encouragement ──
  {
    id: 'tip_milestone_10_words',
    context: 'milestone_10_words',
    title: 'First 10 Words!',
    titleArabic: 'أول 10 كلمات!',
    message: 'You know 10 Arabic words now! That is enough to form simple sentences.',
    messageArabic: 'أنت تعرف 10 كلمات عربية الآن! هذا يكفي لتكوين جمل بسيطة.',
    showOnce: true,
  },
  {
    id: 'tip_milestone_50_words',
    context: 'milestone_50_words',
    title: '50 Words Milestone!',
    titleArabic: 'إنجاز 50 كلمة!',
    message: 'With 50 words you can understand basic conversations. Keep it up!',
    messageArabic: 'مع 50 كلمة يمكنك فهم المحادثات الأساسية. واصل!',
    showOnce: true,
  },
  {
    id: 'tip_milestone_100_words',
    context: 'milestone_100_words',
    title: '100 Words!',
    titleArabic: '100 كلمة!',
    message: 'You have reached 100 words! You are building a strong Arabic vocabulary foundation.',
    messageArabic: 'وصلت إلى 100 كلمة! أنت تبني أساسًا قويًا للمفردات العربية.',
    showOnce: true,
  },
  {
    id: 'tip_struggling_word',
    context: 'struggling_word',
    title: 'Keep Trying!',
    titleArabic: 'استمر في المحاولة!',
    message: 'Some words are tricky. The spaced repetition system will show them more often until they stick.',
    messageArabic: 'بعض الكلمات صعبة. نظام التكرار المتباعد سيعرضها أكثر حتى تثبت.',
    showOnce: true,
  },
  {
    id: 'tip_perfect_quiz',
    context: 'perfect_quiz',
    title: 'Perfect Score!',
    titleArabic: 'درجة كاملة!',
    message: 'Amazing! A perfect quiz earns you bonus XP. Your Arabic is getting stronger.',
    messageArabic: 'مذهل! اختبار كامل يكسبك خبرة إضافية. عربيتك تزداد قوة.',
    showOnce: true,
  },
  {
    id: 'tip_level_up',
    context: 'level_up',
    title: 'Level Up!',
    titleArabic: 'ارتقاء المستوى!',
    message: 'Each level unlocks new features and content. Check what is new!',
    messageArabic: 'كل مستوى يفتح ميزات ومحتوى جديد. تحقق مما هو جديد!',
    showOnce: false,
  },

  // ── Feature discovery ──
  {
    id: 'tip_unused_writing',
    context: 'unused_feature_writingPractice',
    title: 'Try Writing Practice',
    titleArabic: 'جرّب تدريب الكتابة',
    message: 'You have not tried writing practice yet. Tracing letters helps them stick in memory.',
    messageArabic: 'لم تجرب تدريب الكتابة بعد. رسم الحروف يساعدها على الثبات في الذاكرة.',
    showOnce: true,
  },
  {
    id: 'tip_unused_reading',
    context: 'unused_feature_readingPassages',
    title: 'Try Reading Passages',
    titleArabic: 'جرّب نصوص القراءة',
    message: 'Reading short Arabic texts builds fluency faster than vocabulary alone.',
    messageArabic: 'قراءة نصوص عربية قصيرة تبني الطلاقة أسرع من المفردات وحدها.',
    showOnce: true,
  },
  {
    id: 'tip_unused_conversation',
    context: 'unused_feature_conversation',
    title: 'Try Conversation Practice',
    titleArabic: 'جرّب تدريب المحادثة',
    message: 'Conversations with NPCs teach you phrases used in real Arabic dialogue.',
    messageArabic: 'المحادثات مع الشخصيات تعلمك عبارات تُستخدم في الحوار العربي الحقيقي.',
    showOnce: true,
  },

  // ── Arabic language tips ──
  {
    id: 'tip_rtl_reading',
    context: 'arabic_tip_rtl',
    title: 'Right to Left',
    titleArabic: 'من اليمين إلى اليسار',
    message: 'Arabic is written and read from right to left. Numbers, however, are read left to right!',
    messageArabic: 'العربية تُكتب وتُقرأ من اليمين إلى اليسار. الأرقام، مع ذلك، تُقرأ من اليسار إلى اليمين!',
    showOnce: true,
  },
  {
    id: 'tip_connected_letters',
    context: 'arabic_tip_connections',
    title: 'Connected Letters',
    titleArabic: 'الحروف المتصلة',
    message: 'Most Arabic letters connect to the next one. Six letters never connect to the left: ا د ذ ر ز و',
    messageArabic: 'معظم الحروف العربية تتصل بالحرف التالي. ستة حروف لا تتصل يسارًا: ا د ذ ر ز و',
    showOnce: true,
  },
  {
    id: 'tip_tashkeel',
    context: 'arabic_tip_tashkeel',
    title: 'Tashkeel (Diacritics)',
    titleArabic: 'التشكيل',
    message: 'Short vowels are shown as marks above or below letters. They help with pronunciation but are often omitted in everyday Arabic.',
    messageArabic: 'الحركات القصيرة تظهر كعلامات فوق أو تحت الحروف. تساعد في النطق لكنها تُحذف غالبًا في العربية اليومية.',
    showOnce: true,
  },
  {
    id: 'tip_root_system',
    context: 'arabic_tip_roots',
    title: 'The Root System',
    titleArabic: 'نظام الجذور',
    message: 'Most Arabic words come from 3-letter roots. Knowing roots helps you guess the meaning of new words!',
    messageArabic: 'معظم الكلمات العربية تأتي من جذور ثلاثية. معرفة الجذور تساعدك على تخمين معنى كلمات جديدة!',
    showOnce: true,
  },
  {
    id: 'tip_sun_moon_letters',
    context: 'arabic_tip_sun_moon',
    title: 'Sun & Moon Letters',
    titleArabic: 'الحروف الشمسية والقمرية',
    message: 'Arabic letters are divided into sun and moon groups. Sun letters assimilate the "l" in "al-", so "al-shams" sounds like "ash-shams".',
    messageArabic: 'الحروف العربية تنقسم إلى شمسية وقمرية. الحروف الشمسية تُدغم مع لام "ال"، فـ"الشمس" تُنطق "أش شمس".',
    showOnce: true,
  },
];

/**
 * Look up a tip by its ID.
 */
export function getTipById(id) {
  return ONBOARDING_TIPS.find((tip) => tip.id === id) || null;
}

/**
 * Get all tips that match a given context.
 */
export function getTipsForContext(context) {
  return ONBOARDING_TIPS.filter((tip) => tip.context === context);
}

/**
 * Get the set of unique context strings.
 */
export function getAllTipContexts() {
  return [...new Set(ONBOARDING_TIPS.map((tip) => tip.context))];
}
