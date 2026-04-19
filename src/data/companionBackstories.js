/**
 * companionBackstories.js
 * GROW-014: Detailed backstories, personality traits, gift preferences,
 * and dialogue triggers for all 12 companions.
 *
 * Gift item IDs match src/data/shops.js inventory.
 * Dialogue triggers return { arabic, english } text objects.
 */

export const COMPANION_BACKSTORIES = [
  {
    id: 'companion_amira',
    name: 'Amira',
    nameArabic: 'أميرة',
    personality: ['curious', 'gentle', 'poetic', 'nostalgic'],
    backstory: [
      'Amira grew up in the city of Fes, where her grandmother taught her to recite poetry by the light of an oil lamp. The rhythms of classical Arabic verse became her first language — she could recite lines from al-Mutanabbi before she could read them on a page.',
      'Her family ran a small bookbinding workshop on a narrow lane of the medina. She spent her childhood stitching leather spines and listening to scholars debate grammar in the courtyard below. She absorbed the texture of language the way others absorb sunlight.',
      'After her grandmother passed, Amira set out to trace the old pilgrimage routes, carrying a small journal filled with pressed flowers and half-finished poems. She believes that every road holds a lesson if you walk it slowly enough.',
      'She joined the player\'s journey after overhearing them struggling to conjugate a past-tense verb at a caravanserai. She offered a correction so gently that the player did not notice they had been corrected at all.',
    ],
    giftPreferences: {
      loved: ['ancient_inkwell', 'calligraphers_gloves', 'scholars_robe'],
      liked: ['prayer_beads', 'silver_ring', 'compass_of_qibla'],
      disliked: ['warriors_helmet', 'warriors_gauntlets', 'amulet_of_fortune'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'كل يوم تتعلم، تصبح أكثر حكمة.', english: 'Every day you learn, you grow wiser.' },
      onBattleWin: { arabic: 'الصبر مفتاح الفرج.', english: 'Patience is the key to relief.' },
      onQuestComplete: { arabic: 'أنجزت ما بدأته — هذا أصعب الأشياء.', english: 'You finished what you started — that is the hardest thing.' },
      onLowHealth: { arabic: 'توقف — خذ نفساً. الجرح يحتاج وقتاً.', english: 'Stop — breathe. A wound needs time.' },
    },
  },
  {
    id: 'companion_khalid',
    name: 'Khalid',
    nameArabic: 'خالد',
    personality: ['brave', 'direct', 'loyal', 'proud'],
    backstory: [
      'Khalid was raised in a warrior family from the hills beyond the desert market. His father trained him with a wooden sword before he could write his own name, teaching him that honor and discipline are the same word spoken in different tones.',
      'He served three years as a guard at the gates of a merchant city before a corrupt captain forced him to choose between his conscience and his post. He chose his conscience, lost the post, and has never regretted it.',
      'Khalid has a complicated relationship with authority. He respects earned rank but has no patience for inherited power. He will protect the weak without being asked and will challenge the strong without hesitation.',
      'He joined the journey after the player helped clear his name from a false accusation. He does not speak of gratitude easily, but he has not left the player\'s side since.',
    ],
    giftPreferences: {
      loved: ['warriors_jubbah', 'warriors_mintaqa', 'warriors_boots'],
      liked: ['travelers_thobe', 'merchants_bisht', 'desert_bisht'],
      disliked: ['calligraphers_gloves', 'ancient_inkwell', 'emerald_pendant'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'القوة تأتي من الداخل، لا من السلاح.', english: 'Strength comes from within, not from a weapon.' },
      onBattleWin: { arabic: 'هذا ما تدربنا عليه. لا أكثر.', english: 'This is what we trained for. Nothing more.' },
      onQuestComplete: { arabic: 'أنهيت المهمة. الشرف محفوظ.', english: 'Mission complete. Honor is preserved.' },
      onLowHealth: { arabic: 'لن أتركك تقاتل وحدك. تعال — قف خلفي.', english: 'I won\'t let you fight alone. Come — stand behind me.' },
    },
  },
  {
    id: 'companion_zahra',
    name: 'Zahra',
    nameArabic: 'زهرة',
    personality: ['wise', 'observant', 'reserved', 'principled'],
    backstory: [
      'Zahra studied medicine and philosophy at a madrasa in Cordoba during a time when knowledge flowed freely between scholars of different faiths. She learned Greek logic, Arabic astronomy, and Persian pharmacy in the same week.',
      'She left the city when the political climate shifted and the free exchange of ideas became dangerous. She carried her notes in coded Arabic script and walked east, exchanging her expertise for shelter at each stop along the way.',
      'Her reserve is often mistaken for coldness. In truth, she simply prefers to speak after thinking, which in many company feels like silence. She has no patience for flattery and immediate trust in anyone who asks a genuine question.',
      'She met the player when they sought her knowledge of herbal remedies. She gave the information freely, then asked a grammar question of her own. The conversation has not quite ended.',
    ],
    giftPreferences: {
      loved: ['compass_of_qibla', 'scholars_robe', 'scholars_belt'],
      liked: ['ancient_inkwell', 'prayer_beads', 'silver_ring'],
      disliked: ['amulet_of_fortune', 'warriors_gauntlets', 'merchants_turban'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'العلم نور — والنور يتوسع كلما أشعلت شمعة.', english: 'Knowledge is light — and light expands every time you light a candle.' },
      onBattleWin: { arabic: 'النصر الحقيقي هو تجنب القتال من البداية.', english: 'True victory is avoiding the fight to begin with.' },
      onQuestComplete: { arabic: 'المهمة منتهية. الآن: ما الذي تعلمته؟', english: 'Task done. Now: what did you learn from it?' },
      onLowHealth: { arabic: 'الجسم يتحدث — استمع إليه.', english: 'The body speaks — listen to it.' },
    },
  },
  {
    id: 'companion_omar',
    name: 'Omar',
    nameArabic: 'عمر',
    personality: ['practical', 'humorous', 'resourceful', 'warm'],
    backstory: [
      'Omar grew up in a spice market in Cairo, the fourth of seven siblings. He learned to count before he learned to read, and learned to bargain before he learned to count. His childhood was loud, crowded, and rich with the smell of cumin and cardamom.',
      'He spent his early adult years as a traveling merchant, taking caravan routes through the Levant and into Anatolia. He picked up words in a dozen languages — enough to buy and sell, enough to make people laugh, and enough to get out of trouble.',
      'Omar is not a scholar and does not pretend to be one. He knows people, routes, and prices. He knows that a warm meal and a genuine compliment will open doors that armies cannot breach.',
      'He found the player lost at a crossroads and offered to share his directions in exchange for company on the road. That was several weeks ago, and neither has mentioned a parting.',
    ],
    giftPreferences: {
      loved: ['merchants_bisht', 'merchants_sash', 'amulet_of_fortune'],
      liked: ['simple_kufi', 'travelers_thobe', 'simple_sandals'],
      disliked: ['scholars_robe', 'warriors_helmet', 'emerald_pendant'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'مبروك! عرفت أنك ستتقدم — شاهدت ذلك في عينيك.', english: 'Congratulations! I knew you\'d progress — I saw it in your eyes.' },
      onBattleWin: { arabic: 'هل قلت لك أنني كنت على حق؟ قلت ذلك.', english: 'Did I tell you I was right? I told you.' },
      onQuestComplete: { arabic: 'ممتاز! الآن، هل نحتفل؟', english: 'Excellent! Now, shall we celebrate?' },
      onLowHealth: { arabic: 'يا صاحبي — هذا ليس وقت البطولة. تراجع.', english: 'My friend — this is not the time for heroics. Fall back.' },
    },
  },
  {
    id: 'companion_layla',
    name: 'Layla',
    nameArabic: 'ليلى',
    personality: ['fierce', 'independent', 'caring', 'stubborn'],
    backstory: [
      'Layla was born during a desert storm, a fact her mother considered significant and her father considered coincidental. She has been arguing the point — and every other point — since she could form sentences.',
      'She trained as a falconer in the Nejd region, spending long months alone in the open desert with her birds. The solitude made her comfortable with silence and uncomfortable with meaningless noise. She does not fill pauses with empty words.',
      'Her stubbornness is legendary. She once tracked a lost falcon for eleven days across three territories before finding it perched on a nomad\'s tent pole, entirely comfortable with its new situation. She took it back anyway.',
      'She joined the player\'s group because their route passed through territory she wanted to survey. She has extended her survey indefinitely.',
    ],
    giftPreferences: {
      loved: ['desert_bisht', 'simple_hizam', 'merchants_shoes'],
      liked: ['travelers_thobe', 'simple_gloves', 'warriors_boots'],
      disliked: ['royal_kaftan', 'emerald_pendant', 'burda_of_blessing'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'تقدمت. الصحراء ستختبرك أكثر — كن مستعداً.', english: 'You\'ve advanced. The desert will test you more — be ready.' },
      onBattleWin: { arabic: 'كنت أعرف أنك ستنتصر. ما شككت.', english: 'I knew you\'d win. Never doubted it.' },
      onQuestComplete: { arabic: 'جيد. الخطوة التالية؟', english: 'Good. What\'s the next step?' },
      onLowHealth: { arabic: 'لا تكن بطلاً غبياً. الانسحاب شجاعة أحياناً.', english: 'Don\'t be a foolish hero. Retreat is courage sometimes.' },
    },
  },
  {
    id: 'companion_hassan',
    name: 'Hassan',
    nameArabic: 'حسن',
    personality: ['scholarly', 'meticulous', 'patient', 'occasionally pedantic'],
    backstory: [
      'Hassan memorized the Quran at the age of ten and the Alfiyya of Ibn Malik at fourteen. He considers both achievements less impressive than his ability to explain the difference between ظَنَّ and حَسِبَ to a student in a way they actually understand.',
      'He taught Arabic grammar at a madrasa in Damascus for twelve years before the school closed. He took his accumulated notes, his worn copy of Sibawayhi\'s Kitab, and his conviction that language precision is an act of respect, and went wandering.',
      'He cannot pass a grammatical error without mentally correcting it, though he has learned — slowly and with great effort — to keep the correction internal when the context does not call for it. He does not always succeed.',
      'He and the player bonded over the dual form. He found someone willing to practice irregular plurals voluntarily and has not been able to leave.',
    ],
    giftPreferences: {
      loved: ['scholars_kufi', 'scholars_robe', 'ancient_inkwell'],
      liked: ['calligraphers_gloves', 'prayer_beads', 'compass_of_qibla'],
      disliked: ['amulet_of_fortune', 'warriors_jubbah', 'merchants_abaya'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'المداومة على التعلم — هذا هو سر التقدم.', english: 'Consistency in learning — that is the secret of progress.' },
      onBattleWin: { arabic: 'التحليل قبل العمل. هكذا ننتصر.', english: 'Analysis before action. That is how we win.' },
      onQuestComplete: { arabic: 'ممتاز. لاحظت أنك استخدمت الصيغة الصحيحة في آخر محادثة.', english: 'Excellent. I noticed you used the correct form in that last conversation.' },
      onLowHealth: { arabic: 'الحكمة: تجنب الخطر أولاً، ثم اشرح لماذا كان خطأ.', english: 'Wisdom: avoid the danger first, then explain why it was a mistake.' },
    },
  },
  {
    id: 'companion_fatima',
    name: 'Fatima',
    nameArabic: 'فاطمة',
    personality: ['compassionate', 'spiritual', 'determined', 'empathetic'],
    backstory: [
      'Fatima was raised in a small Sufi community on the edge of a desert town. Her earliest memories are of dhikr circles and candlelit gatherings where elders told stories that folded into one another like the pages of an old book.',
      'She trained as a healer and midwife, learning which plants grew near which water sources and how to speak to people in pain without making them feel more afraid. She has held the hands of strangers in their worst moments and counts it among her greatest privileges.',
      'She carries a quiet certainty that all journeys have a purpose, even when the destination is unclear. She is not reckless, but she is also not easily deterred. She has walked into difficult situations precisely because she believed something good could come of it.',
      'She joined the player\'s journey after receiving what she calls "a clear sign." She will not describe what the sign was, but her certainty has not wavered.',
    ],
    giftPreferences: {
      loved: ['prayer_beads', 'burda_of_blessing', 'silver_ring'],
      liked: ['simple_taqiyah', 'scholars_khuff', 'compass_of_qibla'],
      disliked: ['warriors_gauntlets', 'warriors_mintaqa', 'amulet_of_fortune'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'الرحلة الطويلة تبدأ بخطوة. أنت تمضي قدماً.', english: 'A long journey begins with one step. You keep moving forward.' },
      onBattleWin: { arabic: 'الحمد لله. خرجنا سالمين.', english: 'Praise be to God. We came out safely.' },
      onQuestComplete: { arabic: 'كل خير تفعله يترك أثراً لا تراه.', english: 'Every good deed you do leaves a trace you cannot see.' },
      onLowHealth: { arabic: 'لا تستهن بجسدك — هو أمانة، اعتنِ به.', english: 'Do not neglect your body — it is a trust, care for it.' },
    },
  },
  {
    id: 'companion_ali',
    name: 'Ali',
    nameArabic: 'علي',
    personality: ['creative', 'impulsive', 'generous', 'restless'],
    backstory: [
      'Ali grew up in a port city where ships from three continents docked each week. He grew up hearing Arabic, Persian, Swahili, and the creole languages that form wherever trade creates community. Language was not a wall for him but a door, and he opened every one he found.',
      'He became a musician and storyteller, composing maqam pieces and collecting folk tales from sailors and travelers. He has a near-perfect memory for songs and an imperfect memory for everything else, including debts and appointments.',
      'He is generous to the point of occasional recklessness, having once given away his only tent to a family during a rainstorm. He slept in the rain cheerfully and considered it a fair trade.',
      'He met the player at a storytelling gathering and realized mid-performance that they were genuinely listening. He ended the story early just to continue the conversation.',
    ],
    giftPreferences: {
      loved: ['royal_kaftan', 'emerald_pendant', 'royal_ghutra'],
      liked: ['merchants_turban', 'simple_kufi', 'prayer_beads'],
      disliked: ['warriors_helmet', 'scholars_belt', 'simple_hizam'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'رائع! يجب أن نحتفل — أعرف أغنية مناسبة.', english: 'Wonderful! We must celebrate — I know a fitting song.' },
      onBattleWin: { arabic: 'سأجعل هذه المعركة قصيدة. وعد.', english: 'I\'ll make this battle into a poem. Promise.' },
      onQuestComplete: { arabic: 'قصة جيدة تستحق أن تُروى. وهذه واحدة منها.', english: 'A good story deserves to be told. This is one of them.' },
      onLowHealth: { arabic: 'حتى القصص الجيدة تحتاج إلى استراحة. توقف الآن.', english: 'Even good stories need a pause. Stop now.' },
    },
  },
  {
    id: 'companion_maryam',
    name: 'Maryam',
    nameArabic: 'مريم',
    personality: ['perceptive', 'diplomatic', 'ambitious', 'guarded'],
    backstory: [
      'Maryam was raised in a diplomatic household where conversations had layers and no one said exactly what they meant. She learned early to read the room, to notice what was not being said, and to choose her words as carefully as her father chose which guests to seat together.',
      'She studied political philosophy and rhetoric at a royal library, convinced that language and governance were inseparable. She wrote a treatise on the Arabic roots of legal terminology that circulated quietly among scholars for years before anyone knew who wrote it.',
      'She guards her inner life carefully but extends genuine warmth to those who earn it. She does not make promises lightly and does not break them at all.',
      'She joined the journey for reasons she has not fully explained. She has mentioned needing to reach a particular city, but the route she has taken suggests that destination is not her only purpose.',
    ],
    giftPreferences: {
      loved: ['astrolabe', 'emerald_pendant', 'scholars_cloak'],
      liked: ['silver_ring', 'compass_of_qibla', 'merchants_abaya'],
      disliked: ['simple_sandals', 'warriors_boots', 'simple_gloves'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'كل مستوى جديد يفتح أبواباً لم تكن موجودة من قبل.', english: 'Each new level opens doors that didn\'t exist before.' },
      onBattleWin: { arabic: 'المعركة انتهت. الآن نفكر في ما تلاها.', english: 'The battle is over. Now we think about what follows it.' },
      onQuestComplete: { arabic: 'أنجزت. لاحظ كيف غيّر ذلك النظرة إليك.', english: 'Done. Notice how that changed how others see you.' },
      onLowHealth: { arabic: 'تراجع — الخسارة الآن تعني الفرصة لاحقاً.', english: 'Fall back — losing now means opportunity later.' },
    },
  },
  {
    id: 'companion_samir',
    name: 'Samir',
    nameArabic: 'سمير',
    personality: ['cheerful', 'perceptive', 'loyal', 'resilient'],
    backstory: [
      'Samir was orphaned young and raised by a series of extended family members across three cities. He learned adaptability the way others learn walking — as something necessary and, eventually, as natural as breathing.',
      'He became a cartographer\'s assistant, then a cartographer, then something between a cartographer and a scout. He has mapped territories that were considered unmappable and found paths through terrain that had none. He trusts his instincts and his feet in equal measure.',
      'His cheerfulness is not naivety. He has seen difficult things and chosen to face forward anyway. He believes that despair is a luxury and optimism is a discipline, and he practices it daily.',
      'He offered to guide the player through a particularly confusing stretch of terrain and stayed because the company was better than the alternatives.',
    ],
    giftPreferences: {
      loved: ['compass_of_qibla', 'travelers_thobe', 'merchants_shoes'],
      liked: ['simple_sandals', 'desert_bisht', 'simple_hizam'],
      disliked: ['royal_ghutra', 'royal_kaftan', 'burda_of_blessing'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'ممتاز! الطريق يصبح أوضح كلما تقدمت.', english: 'Excellent! The road becomes clearer the further you go.' },
      onBattleWin: { arabic: 'عرفت أننا سننتصر — قرأت الأرض بشكل صحيح.', english: 'I knew we\'d win — I read the terrain correctly.' },
      onQuestComplete: { arabic: 'وضعنا علامة على الخريطة. نتقدم.', english: 'We\'ve marked it on the map. We move on.' },
      onLowHealth: { arabic: 'أعرف طريقاً آخر — اتبعني، سريعاً.', english: 'I know another route — follow me, quickly.' },
    },
  },
  {
    id: 'companion_nadia',
    name: 'Nadia',
    nameArabic: 'نادية',
    personality: ['inventive', 'perfectionist', 'direct', 'passionate'],
    backstory: [
      'Nadia grew up in a glassblower\'s workshop in Aleppo, watching her father transform raw sand into vessels of impossible delicacy. She learned that the same material can become something beautiful or something sharp depending entirely on how it is handled.',
      'She trained as an engineer and architect, specializing in the hydraulic systems that brought water to desert cities. She has a habit of looking at structures — bridges, aqueducts, walls, people — and immediately calculating their weaknesses and their capacity to bear weight.',
      'Her directness occasionally startles people who expect politeness to mean indirectness. She means no unkindness; she simply does not see why a shorter sentence would not serve as well as a longer one.',
      'She joined the journey after overhearing the player mention a ruined aqueduct that she had been wanting to inspect for three years. Her interest in the aqueduct has since expanded to include everything else.',
    ],
    giftPreferences: {
      loved: ['astrolabe', 'ancient_inkwell', 'calligraphers_gloves'],
      liked: ['compass_of_qibla', 'silver_ring', 'scholars_belt'],
      disliked: ['prayer_beads', 'simple_taqiyah', 'merchants_sash'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'البنية الجيدة تتحمل الوزن الأكبر. أنت تتطور بشكل صحيح.', english: 'A good structure bears the most weight. You\'re developing correctly.' },
      onBattleWin: { arabic: 'الهجوم كان متوقعاً. التحضير هو الفرق.', english: 'The attack was predictable. Preparation is the difference.' },
      onQuestComplete: { arabic: 'أنجزنا. لاحظت ثلاثة أشياء يمكن تحسينها في المرة القادمة.', english: 'Done. I noticed three things we could improve next time.' },
      onLowHealth: { arabic: 'الهيكل يتصدع — تراجع قبل أن ينهار.', english: 'The structure is cracking — retreat before it collapses.' },
    },
  },
  {
    id: 'companion_tariq',
    name: 'Tariq',
    nameArabic: 'طارق',
    personality: ['stoic', 'honorable', 'protective', 'contemplative'],
    backstory: [
      'Tariq comes from a long line of desert guides who led hajj caravans through the most difficult stretches of the Arabian interior. His grandfather\'s grandfather knew routes that no map recorded. Tariq learned them not from paper but from walking them each season since he was old enough to keep pace.',
      'He lost his brother to a sandstorm on a route they both knew well. Since then he has carried a profound respect for the unpredictability of the desert and a quieter, more personal respect for the people who trust him with their lives on it.',
      'He speaks little and observes much. He has a way of entering a room and immediately knowing where the exits are, who is watching the door, and which corner would survive if the roof came down. This is not paranoia but practice.',
      'He agreed to accompany the player after a brief conversation that covered, in succession, weather patterns, the proper way to read sand dunes, and Arabic verb roots. He found the range unusual and the person worth knowing.',
    ],
    giftPreferences: {
      loved: ['desert_bisht', 'warriors_farwa', 'simple_hizam'],
      liked: ['warriors_boots', 'travelers_thobe', 'simple_cloak'],
      disliked: ['royal_ghutra', 'emerald_pendant', 'royal_kaftan'],
    },
    dialogueTriggers: {
      onLevelUp: { arabic: 'الطريق الطويل يُغيّر السالك. أنت تتغير بشكل جيد.', english: 'The long road changes the traveler. You are changing well.' },
      onBattleWin: { arabic: 'الصحراء علّمتني: البقاء نصر كافٍ.', english: 'The desert taught me: survival is victory enough.' },
      onQuestComplete: { arabic: 'المهمة أُنجزت. نرتاح، ثم نكمل.', english: 'Mission accomplished. We rest, then continue.' },
      onLowHealth: { arabic: 'هذا ليس وقت الكبرياء. اسحب — اسحب الآن.', english: 'This is not the time for pride. Withdraw — withdraw now.' },
    },
  },
];

// Build O(1) lookup map at module level
const _backstoryById = new Map(COMPANION_BACKSTORIES.map((c) => [c.id, c]));

/**
 * selectCompanionBackstory(id) — returns full backstory entry for a companion, or null.
 * Plain function; takes companion ID directly.
 */
export function selectCompanionBackstory(id) {
  return _backstoryById.get(id) ?? null;
}

/**
 * selectGiftReaction(companionId, itemId) — returns reaction tier for a gift.
 * @returns {'loved' | 'liked' | 'disliked' | 'neutral'}
 */
export function selectGiftReaction(companionId, itemId) {
  const backstory = _backstoryById.get(companionId);
  if (!backstory || !itemId) return 'neutral';
  const { giftPreferences } = backstory;
  if (giftPreferences.loved.includes(itemId)) return 'loved';
  if (giftPreferences.liked.includes(itemId)) return 'liked';
  if (giftPreferences.disliked.includes(itemId)) return 'disliked';
  return 'neutral';
}
