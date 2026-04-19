/**
 * npcContextDialogue.js — FEAT-037: NPC stat-aware contextual dialogue
 *
 * Contextual lines that NPCs say based on player stats. These supplement existing
 * dialogue — they are never shown as the primary conversation, only as ambient
 * awareness remarks or greeting variants.
 *
 * Condition types (evaluated in priority order):
 *   questComplete  — player has finished a specific quest          (most specific)
 *   factionTier    — player has reached a tier with a faction
 *   cefrLevel      — player's CEFR level is >= the required level
 *   vocabCount     — player has learned >= N vocabulary words      (least specific)
 *
 * Priority rule: questComplete > factionTier > cefrLevel > vocabCount > null
 * Within a type, the LAST matching line wins (lines are listed least→most specific).
 *
 * playerState shape expected by getNpcContextLine:
 *   {
 *     cefrLevel:       'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null,
 *     factions:        { [factionId]: number },   // raw alignment scores
 *     vocabCount:      number,
 *     completedQuests: string[],
 *   }
 */

import { getFactionTier } from './factions.js';

// ─── Internal constants ───────────────────────────────────────────────────────

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TIER_ORDER = ['Neutral', 'Friendly', 'Trusted', 'Allied', 'Revered'];
const PRIORITY_TYPES = ['questComplete', 'factionTier', 'cefrLevel', 'vocabCount'];

// ─── Condition matching ───────────────────────────────────────────────────────

function conditionMatches(condition, playerState) {
  switch (condition.type) {
    case 'questComplete':
      return (playerState.completedQuests ?? []).includes(condition.questId);

    case 'factionTier': {
      const score = playerState.factions?.[condition.factionId] ?? 0;
      const playerTierLabel = getFactionTier(score).label;
      const playerIdx = TIER_ORDER.indexOf(playerTierLabel);
      const minIdx = TIER_ORDER.indexOf(condition.minTier);
      return minIdx !== -1 && playerIdx >= minIdx;
    }

    case 'cefrLevel': {
      const playerLevel = playerState.cefrLevel ?? 'A1';
      const playerIdx = CEFR_ORDER.indexOf(playerLevel);
      const reqIdx = CEFR_ORDER.indexOf(condition.level);
      return reqIdx !== -1 && playerIdx >= reqIdx;
    }

    case 'vocabCount':
      return (playerState.vocabCount ?? 0) >= condition.min;

    default:
      return false;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * getNpcContextLine(npcId, playerState)
 *
 * Returns the most relevant contextual line for the given NPC based on player
 * stats, or null if no condition matches.
 *
 * @param {string} npcId
 * @param {Object} playerState  — see module jsdoc for shape
 * @returns {{ arabic: string, english: string } | null}
 */
export function getNpcContextLine(npcId, playerState) {
  if (!npcId || !playerState) return null;
  const lines = NPC_CONTEXT_DIALOGUE[npcId];
  if (!lines || lines.length === 0) return null;

  for (const type of PRIORITY_TYPES) {
    let lastMatch = null;
    for (const line of lines) {
      if (line.condition.type === type && conditionMatches(line.condition, playerState)) {
        lastMatch = line;
      }
    }
    if (lastMatch) return { arabic: lastMatch.arabic, english: lastMatch.english };
  }

  return null;
}

// ─── NPC context dialogue data ────────────────────────────────────────────────

/**
 * Each entry is an array of lines sorted from least-specific to most-specific.
 * Within a priority group the LAST matching line wins.
 * 5-10 lines per NPC.
 */
export const NPC_CONTEXT_DIALOGUE = {

  // ═══════════════════════════════════════════
  // OASIS VILLAGE
  // ═══════════════════════════════════════════

  'scholar-yusuf': [
    { condition: { type: 'vocabCount', min: 10 },  arabic: 'عَشَرَة كَلِمات! الرِّحلة بِأَلف خُطوة', english: 'Ten words! Every journey begins with a single step.' },
    { condition: { type: 'vocabCount', min: 50 },  arabic: 'خَمسون كَلِمَة — أَنتَ طالِب مُجتَهِد', english: 'Fifty words — you are a diligent student.' },
    { condition: { type: 'vocabCount', min: 100 }, arabic: 'مِئَة كَلِمَة! العِلم يَزيد بِالتَّكرار', english: 'A hundred words! Knowledge grows through repetition.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'وَصَلتَ A2. اللُّغَة تَفتَح أَبوابَها لَك', english: 'You reached A2. The language is opening its doors to you.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'مُستَوى B1! أَنتَ الآن في مَرحَلَة المُتَوَسِّط', english: 'Level B1! You are now in the intermediate stage.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Friendly' }, arabic: 'أَهلًا بِصَديق العُلَماء! يَسُرُّني رُؤيَتَك', english: 'Welcome, friend of the Scholars! It pleases me to see you.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Trusted' }, arabic: 'أَنتَ مَوثوق بَيننا. كُتُبُنا في خِدمَتِك', english: 'You are trusted among us. Our books are at your service.' },
    { condition: { type: 'questComplete', questId: 'master_of_letters' }, arabic: 'أَتمَمتَ اختِبار الأَحرُف — لَقَد أَثبَتَّ نَفسَك', english: 'You completed the letters test — you have proved yourself.' },
    { condition: { type: 'questComplete', questId: 'natures_scholar' }, arabic: 'عالِم الطَّبيعَة! تَتَعَلَّم أَكثَر مِمَّا تَتَخَيَّل', english: 'Nature\'s scholar! You are learning more than you imagine.' },
  ],

  'merchant-fatima': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة — بَدَأتَ تَعرِف البَضائِع', english: 'Twenty words — you are starting to know the goods.' },
    { condition: { type: 'vocabCount', min: 75 },  arabic: 'خَمسَة وَسَبعون كَلِمَة! سَتَصير تاجِرًا ماهِرًا', english: 'Seventy-five words! You will become a skilled trader.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'مُستَوى A2 — يُمكِنُك الآن التَّفاوُض', english: 'Level A2 — you can now negotiate.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'B1! تَكَلَّم مَعي بِالعَرَبِيَّة فَقَط مِنَ الآن', english: 'B1! Speak only Arabic with me from now on.' },
    { condition: { type: 'factionTier', factionId: 'merchants', minTier: 'Friendly' }, arabic: 'أَهلًا بِصَديق التُّجّار! لَكَ خَصم اليَوم', english: 'Welcome, friend of the Merchants! You get a discount today.' },
    { condition: { type: 'factionTier', factionId: 'merchants', minTier: 'Allied' }, arabic: 'حَليفُ التُّجّار! البَضاعَة الخاصَّة مَفتوحَة لَك', english: 'Merchant ally! The special goods are open to you.' },
    { condition: { type: 'questComplete', questId: 'market_talk' }, arabic: 'تَعَلَّمتَ الحَديث في السّوق — مُمتاز!', english: 'You learned market talk — excellent!' },
    { condition: { type: 'questComplete', questId: 'merchant_master' }, arabic: 'أَصبَحتَ سَيِّد التُّجّار! أَنا فَخورَة بِك', english: 'You became the merchant master! I am proud of you.' },
  ],

  'student-khalid': [
    { condition: { type: 'vocabCount', min: 15 },  arabic: 'خَمسَة عَشَر كَلِمَة! أَنتَ أَسرَع مِنّي', english: 'Fifteen words! You are faster than me.' },
    { condition: { type: 'vocabCount', min: 30 },  arabic: 'ثَلاثون كَلِمَة — نَحنُ مُتَقارِبان في المُستَوى', english: 'Thirty words — we are close in level.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'وَصَلتَ A2! هَيّا نَتَسابَق على B1', english: 'You reached A2! Let\'s race to B1.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Friendly' }, arabic: 'يوسُف يُحِبُّك — أَنتَ مِن فِريق العُلَماء', english: 'Yusuf likes you — you are on the scholars\' team.' },
    { condition: { type: 'questComplete', questId: 'quiz_challenge' }, arabic: 'تَحَدِّي الاختِبار مُنجَز! أَنتَ بَطَل', english: 'Quiz challenge done! You are a champion.' },
    { condition: { type: 'questComplete', questId: 'words_of_oasis' }, arabic: 'كَلِمات الواحَة! الآن تَعرِف مَكانَك', english: 'Words of the oasis! Now you know your place.' },
  ],

  'guard-hamza': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة! تَعَلَّمتَ بِسُرعَة', english: 'Twenty words! You learned quickly.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — الآن تَفهَم أَوامِر الحَراسَة', english: 'A2 — now you understand guard commands.' },
    { condition: { type: 'factionTier', factionId: 'guardians', minTier: 'Friendly' }, arabic: 'الحُرَّاس يَثِقون بِك. مَرحَبًا', english: 'The guardians trust you. Welcome.' },
    { condition: { type: 'factionTier', factionId: 'guardians', minTier: 'Trusted' }, arabic: 'أَنتَ مَوثوق عِندَنا. يُمكِنُك المُرور دائِمًا', english: 'You are trusted with us. You may always pass.' },
    { condition: { type: 'questComplete', questId: 'guard_directions' }, arabic: 'أَتقَنتَ الاتِّجاهات — الحارِس الجَيِّد يَعرِف المَكان', english: 'You mastered directions — a good guard knows the place.' },
  ],

  'farmer-omar': [
    { condition: { type: 'vocabCount', min: 15 },  arabic: 'تَعَلَّمتَ أَسماء الحَيَوانات — جَيِّد', english: 'You learned animal names — good.' },
    { condition: { type: 'vocabCount', min: 40 },  arabic: 'أَربَعون كَلِمَة! الأَرض تُكافِئ المُجتَهِد', english: 'Forty words! The land rewards the diligent.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — تَفهَم الآن حَديث الفَلّاحين', english: 'A2 — you now understand the farmers\' talk.' },
    { condition: { type: 'factionTier', factionId: 'travelers', minTier: 'Friendly' }, arabic: 'يا مُسافِر! الأَرض تَرحَب بِك', english: 'Oh traveler! The land welcomes you.' },
    { condition: { type: 'questComplete', questId: 'farm_nature' }, arabic: 'تَعَلَّمتَ طَبيعَة المَزرَعَة — شُكرًا لَك', english: 'You learned farm nature — thank you.' },
    { condition: { type: 'questComplete', questId: 'farm_animals' }, arabic: 'الحَيَوانات تَعرِفُك الآن — هَذا جَيِّد', english: 'The animals know you now — that is good.' },
  ],

  'herbalist-maryam': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة! الجِسم يَحتاج كَلِمات مِثل الغِذاء', english: 'Twenty words! The body needs words like food.' },
    { condition: { type: 'vocabCount', min: 60 },  arabic: 'سِتّون كَلِمَة — عَقلُك نَما', english: 'Sixty words — your mind has grown.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — يُمكِنُك وَصف كَيف تَشعُر الآن', english: 'A2 — you can now describe how you feel.' },
    { condition: { type: 'factionTier', factionId: 'artisans', minTier: 'Friendly' }, arabic: 'صَديق الحِرَفِيِّين! الأَعشاب في خِدمَتِك', english: 'Friend of the artisans! Herbs are at your service.' },
    { condition: { type: 'questComplete', questId: 'farm_verbs' }, arabic: 'تَعَلَّمتَ أَفعال الحَياة — هَذا أَساسِي', english: 'You learned verbs of life — this is fundamental.' },
  ],

  'elder-tariq': [
    { condition: { type: 'vocabCount', min: 30 },  arabic: 'ثَلاثون كَلِمَة — الوَقت يُثمِر', english: 'Thirty words — time bears fruit.' },
    { condition: { type: 'vocabCount', min: 80 },  arabic: 'ثَمانون كَلِمَة! الشَّيخ يَعلَم وَلَكِن الشّاب يَتَعَلَّم', english: 'Eighty words! The elder knows but the young one learns.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — الآن أَنتَ تَتَكَلَّم مِثل أَبناء الواحَة', english: 'A2 — now you speak like the children of the oasis.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'B1 — حِكمَة المُتَوَسِّط تَفوق الكَلِمات', english: 'B1 — intermediate wisdom surpasses words.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Trusted' }, arabic: 'العُلَماء يُوثِقون بِك — هَذا شَرَف كَبير', english: 'The scholars trust you — this is a great honor.' },
    { condition: { type: 'questComplete', questId: 'bedouin_time' }, arabic: 'فَهِمتَ وَقت البَدو — الزَّمان دائِر', english: 'You understood Bedouin time — time goes in circles.' },
  ],

  'imam-muhammad': [
    { condition: { type: 'vocabCount', min: 25 },  arabic: 'خَمسَة وَعِشرون كَلِمَة — المَعرِفَة نور', english: 'Twenty-five words — knowledge is light.' },
    { condition: { type: 'vocabCount', min: 100 }, arabic: 'مِئَة كَلِمَة! اقْرَأ بِاسم رَبِّك', english: 'A hundred words! Read in the name of your Lord.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'B1 — يُمكِنُك الآن قِراءَة النُّصوص البَسيطَة', english: 'B1 — you can now read simple texts.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Friendly' }, arabic: 'طالِب العِلم عَزيز عِندَنا — أَهلًا بِك', english: 'A student of knowledge is dear to us — welcome.' },
    { condition: { type: 'questComplete', questId: 'greetings_of_oasis' }, arabic: 'تَعَلَّمتَ تَحِيّات الواحَة — الكَلِمَة الطَّيِّبَة صَدَقَة', english: 'You learned the greetings of the oasis — a kind word is charity.' },
  ],

  'storyteller-noor': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة — بَدَأتَ تَحكي قِصَّتَك', english: 'Twenty words — you have started telling your story.' },
    { condition: { type: 'vocabCount', min: 50 },  arabic: 'خَمسون كَلِمَة — القِصَّة تَكبُر', english: 'Fifty words — the story grows.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — أَنتَ تَفهَم قِصَصي الآن', english: 'A2 — you understand my stories now.' },
    { condition: { type: 'factionTier', factionId: 'artists', minTier: 'Friendly' }, arabic: 'أَهلًا بِمُحِبِّ الفَنّ! القِصَص لَك', english: 'Welcome, art lover! The stories are for you.' },
    { condition: { type: 'questComplete', questId: 'words_of_oasis' }, arabic: 'تَعَلَّمتَ كَلِمات الواحَة — القِصَّة تَعيش', english: 'You learned the words of the oasis — the story lives.' },
  ],

  // ═══════════════════════════════════════════
  // ANCIENT LIBRARY
  // ═══════════════════════════════════════════

  'librarian-ibrahim': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة — المَكتَبَة تَرحَب بِك', english: 'Twenty words — the library welcomes you.' },
    { condition: { type: 'vocabCount', min: 50 },  arabic: 'خَمسون كَلِمَة — أَنتَ تُحِبّ المَعرِفَة', english: 'Fifty words — you love knowledge.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — يُمكِنُك قِراءَة العَناوين الآن', english: 'A2 — you can read the titles now.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'B1 — بَعض الكُتُب أَصبَحَت مُتاحَة لَك', english: 'B1 — some books have become accessible to you.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Friendly' }, arabic: 'صَديق العُلَماء يَدخُل المَكتَبَة مَجّانًا', english: 'A friend of the scholars enters the library for free.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Allied' }, arabic: 'حَليفُنا! القِسم السِّرِّي مَفتوح لَك', english: 'Our ally! The secret section is open to you.' },
    { condition: { type: 'questComplete', questId: 'library_numbers' }, arabic: 'الأَعداد مُتقَنَة — الرِّياضِيّات بِخَير', english: 'Numbers mastered — mathematics is well.' },
    { condition: { type: 'questComplete', questId: 'library_colors' }, arabic: 'الأَلوان بَهِجَة القَلب — أَحسَنتَ', english: 'Colors delight the heart — well done.' },
  ],

  'scribe-amina': [
    { condition: { type: 'vocabCount', min: 15 },  arabic: 'خَمسَة عَشَر كَلِمَة — الكِتابَة تَبدَأ بِكَلِمَة', english: 'Fifteen words — writing begins with one word.' },
    { condition: { type: 'vocabCount', min: 40 },  arabic: 'أَربَعون كَلِمَة — يَدُك جاهِزَة لِلقَلَم', english: 'Forty words — your hand is ready for the pen.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — يُمكِنُك كِتابَة جُمَل بَسيطَة الآن', english: 'A2 — you can write simple sentences now.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Friendly' }, arabic: 'الكاتِبَة سَعيدَة بِصَديق العُلَماء', english: 'The scribe is happy to see a friend of the scholars.' },
    { condition: { type: 'questComplete', questId: 'scribe_phrases' }, arabic: 'عِبارات الكاتِب مُتقَنَة — يَدُك أَصبَحَت قَلَمًا', english: 'Scribe phrases mastered — your hand has become a pen.' },
    { condition: { type: 'questComplete', questId: 'learn_first_letters' }, arabic: 'الحُروف الأولى! كُلُّ كِتابَة تَبدَأ هُنا', english: 'First letters! All writing begins here.' },
  ],

  'astronomer-zain': [
    { condition: { type: 'vocabCount', min: 30 },  arabic: 'ثَلاثون كَلِمَة — النُّجوم تُكَلِّمُنا بِالكَلِمات', english: 'Thirty words — the stars speak to us in words.' },
    { condition: { type: 'vocabCount', min: 70 },  arabic: 'سَبعون كَلِمَة — عَقلُك مِثل السَّماء الواسِعَة', english: 'Seventy words — your mind is like the vast sky.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'B1 — الآن تَستَطيع فَهم حِسابات النُّجوم', english: 'B1 — now you can understand star calculations.' },
    { condition: { type: 'factionTier', factionId: 'scholars', minTier: 'Trusted' }, arabic: 'مَوثوق العُلَماء يَرى ما لا يَراه غَيرُه', english: 'A trusted scholar sees what others cannot.' },
    { condition: { type: 'questComplete', questId: 'library_numbers' }, arabic: 'الأَعداد هِيَ لُغَة النُّجوم — أَحسَنتَ', english: 'Numbers are the language of stars — well done.' },
  ],

  // ═══════════════════════════════════════════
  // DESERT MARKETPLACE
  // ═══════════════════════════════════════════

  'spice-seller-layla': [
    { condition: { type: 'vocabCount', min: 15 },  arabic: 'خَمسَة عَشَر كَلِمَة — بَدَأتَ تَشُمّ رائِحَة التَّوابِل', english: 'Fifteen words — you are starting to smell the spices.' },
    { condition: { type: 'vocabCount', min: 40 },  arabic: 'أَربَعون كَلِمَة — التَّوابِل تَعرِفُك الآن', english: 'Forty words — the spices know you now.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — تَعرِف كَيف تَطلُب ما تُريد في السّوق', english: 'A2 — you know how to ask for what you want in the market.' },
    { condition: { type: 'factionTier', factionId: 'merchants', minTier: 'Friendly' }, arabic: 'صَديق التُّجّار يَأخُذ التَّوابِل بِثَمَن جَيِّد', english: 'A merchant friend gets spices at a good price.' },
    { condition: { type: 'questComplete', questId: 'spice_knowledge' }, arabic: 'عَرَفتَ أَسرار التَّوابِل — أَنتَ مِن عائِلَتِنا الآن', english: 'You learned the secrets of spices — you are family now.' },
  ],

  'trader-hassan': [
    { condition: { type: 'vocabCount', min: 25 },  arabic: 'خَمسَة وَعِشرون كَلِمَة — لُغَة التِّجارَة تَبدَأ', english: 'Twenty-five words — the language of trade begins.' },
    { condition: { type: 'vocabCount', min: 60 },  arabic: 'سِتّون كَلِمَة — أَنتَ تاجِر مُبتَدِئ الآن', english: 'Sixty words — you are a beginner trader now.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'B1 — التَّفاوُض بِالعَرَبِيَّة أَصبَح مُمكِنًا', english: 'B1 — negotiating in Arabic is now possible.' },
    { condition: { type: 'factionTier', factionId: 'merchants', minTier: 'Trusted' }, arabic: 'التّاجِر المَوثوق يَكسَب الأَفضَل — تَعال', english: 'The trusted trader gets the best — come here.' },
    { condition: { type: 'questComplete', questId: 'trader_bargains' }, arabic: 'أَتقَنتَ المُساوَمَة — التِّجارَة في دَمِك', english: 'You mastered bargaining — trade is in your blood.' },
    { condition: { type: 'questComplete', questId: 'merchant_master' }, arabic: 'سَيِّد التُّجّار! أَنا أَتَعَلَّم مِنك الآن', english: 'Merchant master! Now I learn from you.' },
  ],

  'wanderer-ali': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة — المُسافِر يَعرِف طَريقَه', english: 'Twenty words — the wanderer knows his path.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — الطَّريق الطَّويل يَبدَأ بِخُطوَة', english: 'A2 — the long road begins with a step.' },
    { condition: { type: 'factionTier', factionId: 'travelers', minTier: 'Friendly' }, arabic: 'المُسافِرون يُرَحِّبون بِك — أَنتَ واحِد مِنّا', english: 'The travelers welcome you — you are one of us.' },
    { condition: { type: 'factionTier', factionId: 'travelers', minTier: 'Allied' }, arabic: 'حَليف المُسافِرين! الطُّرُق مَفتوحَة لَك', english: 'Traveler ally! The roads are open to you.' },
    { condition: { type: 'questComplete', questId: 'discover_first_words' }, arabic: 'اكتَشَفتَ الكَلِمات الأولى — الرِّحلَة بَدَأَت', english: 'You discovered the first words — the journey has begun.' },
  ],

  'weaver-zahra': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة — المَنسوج يَتشَكَّل', english: 'Twenty words — the weave is taking shape.' },
    { condition: { type: 'vocabCount', min: 50 },  arabic: 'خَمسون كَلِمَة — كَلَّمتَ الخُيوط', english: 'Fifty words — you have spoken to the threads.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — أَلوان لُغَتِك تَزيد', english: 'A2 — the colors of your language increase.' },
    { condition: { type: 'factionTier', factionId: 'artisans', minTier: 'Friendly' }, arabic: 'الحِرَفِيُّون سُعَداء بِك — تَعال أَرى عَمَلَك', english: 'The artisans are happy with you — come, let me see your work.' },
    { condition: { type: 'factionTier', factionId: 'artisans', minTier: 'Allied' }, arabic: 'حَليف الحِرَفِيِّين! السِّرّ الخَفِيّ لَك', english: 'Artisan ally! The hidden secret is yours.' },
    { condition: { type: 'questComplete', questId: 'words_of_oasis' }, arabic: 'كَلِمات الواحَة كالخُيوط — تَرتَبِط', english: 'Words of the oasis are like threads — they connect.' },
  ],

  // ═══════════════════════════════════════════
  // COASTAL PORT
  // ═══════════════════════════════════════════

  'captain-rashid': [
    { condition: { type: 'vocabCount', min: 30 },  arabic: 'ثَلاثون كَلِمَة — تَعرِف كَيف تُوَجِّه السَّفينَة', english: 'Thirty words — you know how to steer the ship.' },
    { condition: { type: 'vocabCount', min: 70 },  arabic: 'سَبعون كَلِمَة — أَنتَ رُبّان مَاهِر', english: 'Seventy words — you are a skilled captain.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — الآن تَفهَم أَوامِر البَحر', english: 'A2 — now you understand sea commands.' },
    { condition: { type: 'factionTier', factionId: 'travelers', minTier: 'Friendly' }, arabic: 'المُسافِر يَعرِف البَحر — اِصعَد مَعَنا', english: 'The traveler knows the sea — come aboard with us.' },
    { condition: { type: 'questComplete', questId: 'guard_directions' }, arabic: 'الاتِّجاهات مُتقَنَة — الرُّبّان جاهِز', english: 'Directions mastered — the captain is ready.' },
  ],

  'healer-khadija': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة — العَقل يَتَعافى', english: 'Twenty words — the mind heals.' },
    { condition: { type: 'vocabCount', min: 55 },  arabic: 'خَمسَة وَخَمسون كَلِمَة — أَنتَ أَحسَن مِمّا كُنتَ', english: 'Fifty-five words — you are better than you were.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — يُمكِنُك الآن وَصف الأَلَم بِالعَرَبِيَّة', english: 'A2 — you can now describe pain in Arabic.' },
    { condition: { type: 'factionTier', factionId: 'artisans', minTier: 'Friendly' }, arabic: 'صَديق الحِرَفِيِّين بِصِحَّة جَيِّدَة', english: 'A friend of the artisans is in good health.' },
    { condition: { type: 'questComplete', questId: 'farm_verbs' }, arabic: 'أَفعال الحَياة تُشفي كَما العُشب', english: 'Verbs of life heal like herbs.' },
  ],

  // ═══════════════════════════════════════════
  // ROYAL PALACE
  // ═══════════════════════════════════════════

  'vizier-abbas': [
    { condition: { type: 'vocabCount', min: 40 },  arabic: 'أَربَعون كَلِمَة — لَيس بَعيدًا عَن لُغَة القَصر', english: 'Forty words — not far from the language of the palace.' },
    { condition: { type: 'vocabCount', min: 100 }, arabic: 'مِئَة كَلِمَة — الوَزير يَنظُر إِلَيك بِاهتِمام', english: 'A hundred words — the vizier looks at you with interest.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'B1 — لُغَة الوَزير تَحتاج مُستَوى أَعلى. قَريبًا', english: 'B1 — the vizier\'s language needs a higher level. Soon.' },
    { condition: { type: 'cefrLevel', level: 'B2' }, arabic: 'B2 — الآن أَنتَ لائِق لِمَجلِس الوَزير', english: 'B2 — now you are fit for the vizier\'s council.' },
    { condition: { type: 'factionTier', factionId: 'guardians', minTier: 'Friendly' }, arabic: 'الحُرَّاس أَحبّوك — القَصر أَبوابُه مَفتوحَة لَك', english: 'The guardians like you — the palace gates are open to you.' },
    { condition: { type: 'factionTier', factionId: 'guardians', minTier: 'Allied' }, arabic: 'حَليف الحُرَّاس يَنال ثِقَة الوَزير', english: 'A guardian ally gains the vizier\'s trust.' },
    { condition: { type: 'questComplete', questId: 'master_of_letters' }, arabic: 'سَيِّد الأَحرُف يُؤهَّل لِعُلوم القَصر', english: 'Master of letters is qualified for palace sciences.' },
  ],

  'princess-aisha': [
    { condition: { type: 'vocabCount', min: 30 },  arabic: 'ثَلاثون كَلِمَة — كَلِماتُك تُرضيني', english: 'Thirty words — your words please me.' },
    { condition: { type: 'vocabCount', min: 80 },  arabic: 'ثَمانون كَلِمَة — أَنتَ أَذكى مِن كَثيرين', english: 'Eighty words — you are smarter than many.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — حَديثُك أَجمَل مِن قَبل', english: 'A2 — your speech is more beautiful than before.' },
    { condition: { type: 'cefrLevel', level: 'B1' }, arabic: 'B1 — يُمكِنُك الآن تَفسير الشِّعر', english: 'B1 — you can now interpret poetry.' },
    { condition: { type: 'factionTier', factionId: 'artists', minTier: 'Friendly' }, arabic: 'مُحِبّ الفَنِّ مَحبوب في القَصر', english: 'An art lover is beloved in the palace.' },
    { condition: { type: 'questComplete', questId: 'greetings_of_oasis' }, arabic: 'تَعَلَّمتَ التَّحِيّات — الآداب تَجعَل الإِنسان', english: 'You learned the greetings — manners make the person.' },
  ],

  // ═══════════════════════════════════════════
  // GARDEN DISTRICT
  // ═══════════════════════════════════════════

  'guide-salim': [
    { condition: { type: 'vocabCount', min: 20 },  arabic: 'عِشرون كَلِمَة — أَنتَ لا تَضيع في الجَبَل', english: 'Twenty words — you won\'t get lost in the mountain.' },
    { condition: { type: 'vocabCount', min: 45 },  arabic: 'خَمسَة وَأَربَعون كَلِمَة — الطَّريق يَتَّضِح', english: 'Forty-five words — the path becomes clear.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — يُمكِنُك طَلَب المُساعَدَة الآن', english: 'A2 — you can ask for help now.' },
    { condition: { type: 'factionTier', factionId: 'travelers', minTier: 'Friendly' }, arabic: 'المُسافِر الصَّديق يَعرِف الجِبال', english: 'The friendly traveler knows the mountains.' },
    { condition: { type: 'questComplete', questId: 'discover_first_words' }, arabic: 'اكتَشَفتَ الكَلِمات الأولى — الآن اكتَشِف المَزيد', english: 'You discovered the first words — now discover more.' },
  ],

  'baker-yasmin': [
    { condition: { type: 'vocabCount', min: 15 },  arabic: 'خَمسَة عَشَر كَلِمَة — الكَلِمات مِثل العَجين', english: 'Fifteen words — words are like dough.' },
    { condition: { type: 'vocabCount', min: 35 },  arabic: 'خَمسَة وَثَلاثون كَلِمَة — العَقل يَختَمِر', english: 'Thirty-five words — the mind is rising.' },
    { condition: { type: 'cefrLevel', level: 'A2' }, arabic: 'A2 — يُمكِنُك طَلَب الخُبز بِالعَرَبِيَّة', english: 'A2 — you can order bread in Arabic.' },
    { condition: { type: 'factionTier', factionId: 'merchants', minTier: 'Friendly' }, arabic: 'صَديق التُّجّار يَأكُل الخُبز الطّازَج', english: 'A merchant friend eats fresh bread.' },
    { condition: { type: 'questComplete', questId: 'market_talk' }, arabic: 'تَكَلَّمتَ في السّوق — الخُبز يُطعِم والكَلِمات تُشبِع', english: 'You spoke in the market — bread feeds, words satisfy.' },
  ],

};
