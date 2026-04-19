/**
 * Daily Challenge Data — 4 rotating challenge types for player retention.
 * Phase 81 (DAILY-01 + DAILY-02): deterministic date-based selection.
 *
 * Challenge Types: word_of_the_day, grammar_challenge, speed_quiz, cultural_trivia
 * Streak Rewards: 3, 7, 14, 30, 60 day tiers with XP bonuses and badge items
 */

// ============================================================
// CHALLENGE TYPES
// ============================================================

export const CHALLENGE_TYPES = {
  word_of_the_day: {
    label: 'Word of the Day',
    labelArabic: 'كلمة اليوم',
    description: 'Learn a new word and complete 3 exercises with it',
    icon: '📝',
    baseXp: 50,
    streakMultiplier: true,
  },
  grammar_challenge: {
    label: 'Grammar Challenge',
    labelArabic: 'تحدي القواعد',
    description: 'Complete a grammar exercise set in under 2 minutes',
    icon: '📖',
    baseXp: 75,
    streakMultiplier: true,
  },
  speed_quiz: {
    label: 'Speed Quiz',
    labelArabic: 'اختبار السرعة',
    description: 'Answer 10 vocabulary questions as fast as possible',
    icon: '⚡',
    baseXp: 60,
    streakMultiplier: true,
  },
  cultural_trivia: {
    label: 'Cultural Trivia',
    labelArabic: 'معلومات ثقافية',
    description: 'Answer 5 questions about Arabic culture and history',
    icon: '🏺',
    baseXp: 40,
    streakMultiplier: true,
  },
};

export const CHALLENGE_TYPE_KEYS = Object.keys(CHALLENGE_TYPES);

// ============================================================
// STREAK REWARDS
// ============================================================

export const STREAK_REWARDS = [
  { days: 3, xpBonus: 50, title: 'Dedicated', titleArabic: 'مُجتهد' },
  { days: 7, xpBonus: 150, title: 'Committed', titleArabic: 'ملتزم', item: 'streak_badge_bronze' },
  { days: 14, xpBonus: 300, title: 'Persistent', titleArabic: 'مثابر', item: 'streak_badge_silver' },
  { days: 30, xpBonus: 500, title: 'Master Learner', titleArabic: 'أستاذ التعلم', item: 'streak_badge_gold' },
  { days: 60, xpBonus: 1000, title: 'Arabic Scholar', titleArabic: 'عالم عربي', item: 'streak_badge_legendary' },
];

// ============================================================
// DETERMINISTIC HASH — same date = same result for all players
// ============================================================

/**
 * Simple deterministic hash of a date string.
 * Uses a basic polynomial rolling hash (djb2 variant).
 * @param {string} str — date string e.g. '2026-03-27'
 * @returns {number} positive integer
 */
function hashDateString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get the daily challenge type for a given date. Deterministic: same date = same type.
 * @param {string} dateString — 'YYYY-MM-DD'
 * @returns {string} key from CHALLENGE_TYPES
 */
export function getDailyChallengeType(dateString) {
  const hash = hashDateString(dateString);
  const index = hash % CHALLENGE_TYPE_KEYS.length;
  return CHALLENGE_TYPE_KEYS[index];
}

/**
 * Pick a "Word of the Day" deterministically from the vocabulary array.
 * @param {string} dateString — 'YYYY-MM-DD'
 * @param {Array} vocabularyAll — full vocabulary array
 * @returns {Object|null} vocabulary entry or null if array empty
 */
export function generateWordOfTheDay(dateString, vocabularyAll) {
  if (!vocabularyAll || vocabularyAll.length === 0) return null;
  const hash = hashDateString(dateString + ':wotd');
  const index = hash % vocabularyAll.length;
  const word = vocabularyAll[index];

  // Generate 3 exercises for this word
  const exercises = generateWordExercises(word, vocabularyAll, dateString);

  return { word, exercises };
}

/**
 * Generate 3 exercises for a word: match meaning, type spelling, use in sentence (multiple choice).
 */
function generateWordExercises(word, vocabularyAll, dateString) {
  const exercises = [];
  const hash = hashDateString(dateString + ':ex');

  // Exercise 1: Match Meaning (Arabic → English multiple choice)
  const distractors1 = pickDistractors(word, vocabularyAll, 3, hash);
  const options1 = shuffle([word.english, ...distractors1.map((d) => d.english)], hash + 1);
  exercises.push({
    type: 'match_meaning',
    prompt: word.arabic,
    promptLabel: 'What does this word mean?',
    correctAnswer: word.english,
    options: options1,
  });

  // Exercise 2: Match Arabic (English → Arabic multiple choice)
  const distractors2 = pickDistractors(word, vocabularyAll, 3, hash + 100);
  const options2 = shuffle([word.arabic, ...distractors2.map((d) => d.arabic)], hash + 2);
  exercises.push({
    type: 'match_arabic',
    prompt: word.english,
    promptLabel: 'Choose the Arabic translation:',
    correctAnswer: word.arabic,
    options: options2,
  });

  // Exercise 3: Fill in context (transliteration + meaning recall)
  const distractors3 = pickDistractors(word, vocabularyAll, 3, hash + 200);
  const allWords = shuffle([word, ...distractors3], hash + 3);
  exercises.push({
    type: 'recall',
    prompt: word.transliteration
      ? `Which word is "${word.transliteration}" (${word.english})?`
      : `Which word means "${word.english}"?`,
    promptLabel: 'Choose the correct word:',
    correctAnswer: word.arabic,
    options: allWords.map((w) => w.arabic),
  });

  return exercises;
}

/**
 * Seeded pseudo-random number generator (xorshift32).
 * Avoids LCG mod-bias issues with small moduli.
 * Returns a function that produces the next pseudo-random positive integer each call.
 */
function createSeededRng(seed) {
  let s = (Math.abs(seed) ^ 0xDEADBEEF) | 0;
  if (s === 0) s = 1;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0); // ensure unsigned
  };
}

/**
 * Pick N distractor words from vocabulary (different from target).
 */
function pickDistractors(targetWord, vocabularyAll, count, seed) {
  const distractors = [];
  const used = new Set([targetWord.id]);
  const rng = createSeededRng(seed);
  let attempt = 0;

  while (distractors.length < count && attempt < 100) {
    const idx = rng() % vocabularyAll.length;
    const candidate = vocabularyAll[idx];
    if (candidate && !used.has(candidate.id) && candidate.english !== targetWord.english) {
      distractors.push(candidate);
      used.add(candidate.id);
    }
    attempt++;
  }

  return distractors;
}

/**
 * Deterministic shuffle using seed.
 */
function shuffle(arr, seed) {
  const result = [...arr];
  let s = Math.abs(seed);
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate 5 cultural trivia questions from lore entries. Deterministic per date.
 * Each question uses a lore entry's keyTerm and content to form a multiple-choice question.
 * @param {string} dateString — 'YYYY-MM-DD'
 * @param {Array} loreEntries — LORE_ENTRIES array
 * @returns {Array} 5 trivia questions
 */
export function generateCulturalTrivia(dateString, loreEntries) {
  if (!loreEntries || loreEntries.length === 0) return [];

  // Filter to entries that have keyTerms (required for question generation)
  const validEntries = loreEntries.filter((e) => e.keyTerm);
  if (validEntries.length < 4) return []; // Need at least 4 for 1 question + 3 distractors

  const targetCount = Math.min(5, validEntries.length - 3); // need 3 distractors per question
  const hash = hashDateString(dateString + ':trivia');
  const rng = createSeededRng(hash);
  const questions = [];
  const used = new Set();

  // Pick distinct lore entries
  let attempt = 0;
  while (questions.length < targetCount && attempt < 200) {
    const idx = rng() % validEntries.length;
    const entry = validEntries[idx];

    if (entry && !used.has(entry.id)) {
      used.add(entry.id);

      // Build question from lore entry
      const question = buildTriviaQuestion(entry, validEntries, hash + attempt * 31);
      if (question) questions.push(question);
    }
    attempt++;
  }

  return questions;
}

/**
 * Build a trivia question from a lore entry.
 * Question: "What does [arabic keyTerm] mean?" or "What is [title] about?"
 */
function buildTriviaQuestion(entry, allEntries, seed) {
  // Pick 3 distractor entries for wrong answers
  const distractorEntries = [];
  const used = new Set([entry.id]);
  const rng = createSeededRng(seed);
  let attempt = 0;

  while (distractorEntries.length < 3 && attempt < 100) {
    const idx = rng() % allEntries.length;
    const candidate = allEntries[idx];
    if (candidate && !used.has(candidate.id) && candidate.keyTerm) {
      distractorEntries.push(candidate);
      used.add(candidate.id);
    }
    attempt++;
  }

  if (distractorEntries.length < 3) return null;

  // Question type alternates based on seed
  const qType = seed % 2;

  if (qType === 0) {
    // "What does [keyTerm arabic] mean?"
    const correctAnswer = entry.keyTerm.english;
    const options = shuffle(
      [correctAnswer, ...distractorEntries.map((d) => d.keyTerm.english)],
      seed + 50
    );
    return {
      question: `What does "${entry.keyTerm.arabic}" (${entry.keyTerm.transliteration}) mean?`,
      loreTitle: entry.title,
      correctAnswer,
      options,
    };
  } else {
    // "Which term is associated with [title]?"
    const correctAnswer = `${entry.keyTerm.arabic} (${entry.keyTerm.english})`;
    const options = shuffle(
      [
        correctAnswer,
        ...distractorEntries.map((d) => `${d.keyTerm.arabic} (${d.keyTerm.english})`),
      ],
      seed + 70
    );
    return {
      question: `Which term is associated with "${entry.title}"?`,
      loreTitle: entry.title,
      correctAnswer,
      options,
    };
  }
}

/**
 * Get the streak reward tier for the current streak count (or null if none).
 * Returns the highest applicable tier not yet claimed.
 * @param {number} streakCount — current streak day count
 * @returns {Object|null} reward tier object or null
 */
export function getStreakReward(streakCount) {
  // Return the highest reward tier the player has reached
  let reward = null;
  for (const tier of STREAK_REWARDS) {
    if (streakCount >= tier.days) {
      reward = tier;
    }
  }
  return reward;
}

/**
 * Get the next streak reward tier the player hasn't reached yet.
 * @param {number} streakCount
 * @returns {Object|null} next tier or null if all reached
 */
export function getNextStreakReward(streakCount) {
  for (const tier of STREAK_REWARDS) {
    if (streakCount < tier.days) {
      return tier;
    }
  }
  return null;
}

/**
 * Generate grammar challenge questions from grammar lessons.
 * Picks 5 fill-in-the-blank exercises from different grammar lessons.
 * @param {string} dateString — 'YYYY-MM-DD'
 * @param {Array} grammarLessons — grammar lessons array
 * @returns {Array} 5 grammar questions
 */
export function generateGrammarChallenge(dateString, grammarLessons) {
  if (!grammarLessons || grammarLessons.length === 0) return [];

  // Filter to lessons with exercises
  const validLessons = grammarLessons.filter((l) => l.exercises && l.exercises.length > 0);
  if (validLessons.length === 0) return [];

  const targetCount = Math.min(5, validLessons.length);
  const hash = hashDateString(dateString + ':grammar');
  const rng = createSeededRng(hash);
  const questions = [];
  const usedLessons = new Set();

  let attempt = 0;
  while (questions.length < targetCount && attempt < 200) {
    const lessonIdx = rng() % validLessons.length;
    const lesson = validLessons[lessonIdx];

    if (lesson && !usedLessons.has(lesson.id)) {
      usedLessons.add(lesson.id);

      // Pick an exercise from this lesson
      const exIdx = (hash + attempt * 3) % lesson.exercises.length;
      const exercise = lesson.exercises[Math.abs(exIdx)];

      questions.push({
        lessonTitle: lesson.title,
        lessonId: lesson.id,
        type: exercise.type,
        prompt: exercise.prompt || exercise.statement || exercise.text || exercise.sentence || '',
        answer: exercise.answer || exercise.correction || '',
        options: exercise.options || [],
      });
    }
    attempt++;
  }

  return questions;
}

/**
 * Generate 10 speed quiz questions (Arabic → English vocabulary).
 * @param {string} dateString — 'YYYY-MM-DD'
 * @param {Array} vocabularyAll — full vocabulary array
 * @returns {Array} 10 quiz questions
 */
export function generateSpeedQuiz(dateString, vocabularyAll) {
  if (!vocabularyAll || vocabularyAll.length === 0) return [];

  const hash = hashDateString(dateString + ':speed');
  const rng = createSeededRng(hash);
  const questions = [];
  const usedIds = new Set();

  let attempt = 0;
  while (questions.length < 10 && attempt < 200) {
    const idx = rng() % vocabularyAll.length;
    const word = vocabularyAll[idx];

    if (word && !usedIds.has(word.id)) {
      usedIds.add(word.id);

      // Pick 3 distractors
      const distractors = pickDistractors(word, vocabularyAll, 3, hash + attempt * 17);
      const options = shuffle(
        [word.english, ...distractors.map((d) => d.english)],
        hash + attempt
      );

      questions.push({
        arabic: word.arabic,
        transliteration: word.transliteration,
        correctAnswer: word.english,
        options,
        timeLimit: 8000, // 8 seconds
      });
    }
    attempt++;
  }

  return questions;
}
