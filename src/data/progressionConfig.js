/**
 * Progression Configuration — Phase 88
 *
 * Central source of truth for all progression parameters in Gogo Arabic.
 * Every constant here is used by progressionService.js (pure functions).
 * No Redux, no side effects — just data.
 */

// ─────────────────────────────────────────────────────────────
// XP CURVE
// Formula: xpToNextLevel = BASE_XP * (level ^ EXPONENT)
// Creates a gentle curve: early levels are fast, later levels slow down.
// ─────────────────────────────────────────────────────────────

export const XP_CURVE = {
  baseXp: 100,
  exponent: 1.35,
  maxLevel: 50,

  /**
   * XP required to go from `level` to `level + 1`.
   * @param {number} level — current level (1-based)
   * @returns {number} XP needed for next level
   */
  getXpForLevel(level) {
    if (level < 1) return 0;
    if (level > this.maxLevel) return this.getXpForLevel(this.maxLevel);
    return Math.floor(this.baseXp * Math.pow(level, this.exponent));
  },

  /**
   * Total cumulative XP to reach a given level from level 1.
   * @param {number} targetLevel — level to reach (1-based)
   * @returns {number} total XP needed
   */
  getTotalXpToLevel(targetLevel) {
    if (targetLevel <= 1) return 0;
    let total = 0;
    for (let lvl = 1; lvl < targetLevel; lvl++) {
      total += this.getXpForLevel(lvl);
    }
    return total;
  },
};

// ─────────────────────────────────────────────────────────────
// VOCABULARY PACING
// Based on research: 5-15 new items per day is optimal for retention.
// ─────────────────────────────────────────────────────────────

export const VOCAB_PACING = {
  /** New words per day by proficiency tier */
  newWordsPerDay: {
    beginner: 5,      // levels 1-5
    elementary: 8,    // levels 6-10
    intermediate: 10, // levels 11-20
    advanced: 12,     // levels 21-35
    expert: 15,       // levels 36-50
  },

  /** Level ranges for each proficiency tier */
  tierRanges: {
    beginner: [1, 5],
    elementary: [6, 10],
    intermediate: [11, 20],
    advanced: [21, 35],
    expert: [36, 50],
  },

  /** Maximum review cards per session */
  maxReviewsPerSession: 30,

  /** Minimum mastery before introducing new words (65% of recent words rated "good") */
  masteryThreshold: 0.65,

  /** Cool-down minutes between new word introductions */
  newWordCooldownMinutes: 3,
};

// ─────────────────────────────────────────────────────────────
// CONTENT UNLOCK GATES
// Controls when quiz types, features, and CEFR-gated content become available.
// ─────────────────────────────────────────────────────────────

export const UNLOCK_GATES = {
  /** Quiz type → minimum level required */
  quizTypes: {
    'ar-to-en': 1,
    'en-to-ar': 1,
    'picture-word': 1,
    'match': 1,
    'listen': 1,
    'fill-blank': 2,
    'en-to-type-ar': 3,
    'transliterate': 3,
    'listening-comprehension': 3,
    'category-sort': 4,
    'conjugation': 4,
    'GrammarFill': 4,
    'ClozePassage': 4,
    'sentence-build': 5,
    'root-identify': 5,
    'WordOrder': 5,
    'dictation': 5,
    'DialectIdentify': 8,
    'RootExpand': 8,
    'CulturalContext': 8,
  },

  /** Feature → minimum level required */
  features: {
    dailyChallenge: 3,
    readingPassages: 4,
    writingPractice: 2,
    conversationPractice: 5,
    miniGames: 3,
    loreCodex: 5,
    skillTree: 5,
    giftGiving: 8,
    poetryBattles: 10,
    crafting: 12,
    arena: 15,
  },

  /** Feature descriptions (shown in unlock toasts and progress report) */
  featureDescriptions: {
    dailyChallenge: 'Complete daily challenges to build streaks',
    readingPassages: 'Read graded Arabic passages with comprehension quizzes',
    writingPractice: 'Practice writing Arabic letters and words',
    conversationPractice: 'Engage in guided Arabic conversations',
    miniGames: 'Play fun mini-games to reinforce vocabulary',
    loreCodex: 'Explore the world lore and cultural knowledge',
    skillTree: 'Unlock specialized Arabic skills across 6 trees',
    giftGiving: 'Give gifts to NPCs to build relationships',
    poetryBattles: 'Compete in Arabic poetry battles',
    crafting: 'Craft items using Arabic vocabulary knowledge',
    arena: 'Challenge other learners in the competitive arena',
  },

  /** Feature display names (Arabic + English) */
  featureNames: {
    dailyChallenge: { en: 'Daily Challenge', ar: 'التحدي اليومي' },
    readingPassages: { en: 'Reading Passages', ar: 'نصوص القراءة' },
    writingPractice: { en: 'Writing Practice', ar: 'تدريب الكتابة' },
    conversationPractice: { en: 'Conversation Practice', ar: 'تدريب المحادثة' },
    miniGames: { en: 'Mini-Games', ar: 'ألعاب مصغرة' },
    loreCodex: { en: 'Lore Codex', ar: 'سجل المعرفة' },
    skillTree: { en: 'Skill Tree', ar: 'شجرة المهارات' },
    giftGiving: { en: 'Gift Giving', ar: 'تقديم الهدايا' },
    poetryBattles: { en: 'Poetry Battles', ar: 'معارك الشعر' },
    crafting: { en: 'Crafting', ar: 'الصناعة' },
    arena: { en: 'Arena', ar: 'الساحة' },
  },

  /** CEFR gates for content complexity */
  cefrGates: {
    A1: { grammarLessons: 20, vocabSize: 500 },
    A2: { grammarLessons: 35, vocabSize: 1500 },
    B1: { grammarLessons: 45, vocabSize: 3000 },
    B2: { grammarLessons: 50, vocabSize: 5000 },
  },
};

// ─────────────────────────────────────────────────────────────
// XP REWARDS
// Standardized XP values for all activity types.
// ─────────────────────────────────────────────────────────────

export const XP_REWARDS = {
  quiz: {
    correct: 10,
    perfectSession: 25,
    streakBonus: 5,
  },
  grammar: {
    lessonComplete: 40,
    exerciseCorrect: 5,
  },
  quest: {
    complete: 30,
    mainQuest: 100,
  },
  dailyChallenge: {
    complete: 50,
    streakMultiplierPerDay: 0.05,
  },
  reading: {
    passageComplete: 20,
    comprehensionCorrect: 10,
  },
  writing: {
    letterPractice: 5,
    wordPractice: 10,
    phrasePractice: 15,
  },
  conversation: {
    scenarioComplete: 30,
    perfectScore: 50,
  },
  miniGame: {
    complete: 15,
    highScore: 25,
  },
  battle: {
    victory: 20,
    perfectVictory: 40,
  },
  exploration: {
    newZone: 50,
    npcMet: 10,
    objectInteract: 5,
  },
  vocabulary: {
    newWord: 5,
    wordMastered: 15,
  },
};

// ─────────────────────────────────────────────────────────────
// SESSION OPTIMIZATION
// Evidence-based session structure for maximum learning retention.
// ─────────────────────────────────────────────────────────────

export const SESSION_CONFIG = {
  /** Optimal study session duration in minutes */
  optimalDurationMinutes: 20,

  /** Maximum recommended session duration */
  maxDurationMinutes: 45,

  /** Suggest a break after this many minutes */
  breakIntervalMinutes: 25,

  /** Number of easy review questions to start with (prevents frustration) */
  warmupQuestions: 3,

  /** Number of easy questions to end with (builds confidence) */
  cooldownQuestions: 2,

  /** Ratio of review content to new content (70% review, 30% new) */
  reviewToNewRatio: 0.7,
};
