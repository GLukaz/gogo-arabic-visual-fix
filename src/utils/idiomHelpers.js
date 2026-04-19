/**
 * Idiom Helpers — Pure utility functions for the Arabic Idiom & Proverb System.
 * Phase 94 (IDIOM-01): Deterministic daily selection, quiz generation, scoring.
 *
 * All functions are pure (no side-effects) and fully testable.
 */

// ============================================================
// DETERMINISTIC HASHING
// ============================================================

/**
 * djb2 polynomial rolling hash — same pattern as dailyChallenges.js.
 * Produces a deterministic positive integer from any string.
 * @param {string} str
 * @returns {number}
 */
export function hashDateString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Pick a deterministic daily idiom ID.
 * Same date always yields the same idiom for all players.
 * @param {string} dateString — 'YYYY-MM-DD'
 * @param {Array} allIdioms  — the ARABIC_IDIOMS array
 * @returns {string} idiom ID
 */
export function getDailyIdiomId(dateString, allIdioms) {
  if (!allIdioms || allIdioms.length === 0) return null;
  const hash = hashDateString(dateString + ':idiom');
  const index = hash % allIdioms.length;
  return allIdioms[index].id;
}

// ============================================================
// SEEDED RANDOM — for reproducible quiz shuffles
// ============================================================

/**
 * Simple seeded pseudo-random number generator (Mulberry32).
 * @param {number} seed
 * @returns {function} — call it to get next random float in [0, 1)
 */
function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle with a seeded RNG.
 * @param {Array} arr — will be mutated
 * @param {function} rng — returns [0, 1)
 * @returns {Array} same array, shuffled
 */
function seededShuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================================
// QUIZ GENERATION
// ============================================================

/**
 * Pick N distractor idioms different from the target.
 * Prefers idioms from the same or adjacent categories for believable wrong answers.
 * @param {Object} targetIdiom
 * @param {Array}  allIdioms
 * @param {number} count — number of distractors (default 3)
 * @param {number} seed
 * @returns {Array<Object>} distractor idiom objects
 */
export function pickDistractors(targetIdiom, allIdioms, count = 3, seed = 0) {
  const rng = mulberry32(seed);
  const others = allIdioms.filter((i) => i.id !== targetIdiom.id);

  // Prioritise same-category distractors for harder questions
  const sameCategory = others.filter((i) => i.category === targetIdiom.category);
  const diffCategory = others.filter((i) => i.category !== targetIdiom.category);

  const pool = [...sameCategory, ...diffCategory];
  seededShuffle(pool, rng);

  return pool.slice(0, count);
}

/**
 * Generate a single quiz question for an idiom.
 * @param {string} idiomId
 * @param {'idiom-to-meaning'|'meaning-to-idiom'} questionType
 * @param {Array} allIdioms
 * @param {number} seed — for reproducible shuffling
 * @returns {{ idiomId, questionType, question, correctAnswer, options, explanation }}
 */
export function generateIdiomQuizQuestion(idiomId, questionType, allIdioms, seed = 0) {
  const target = allIdioms.find((i) => i.id === idiomId);
  if (!target) return null;

  const distractors = pickDistractors(target, allIdioms, 3, seed);
  const rng = mulberry32(seed + 999);

  if (questionType === 'idiom-to-meaning') {
    // Show Arabic idiom -> pick correct meaning
    const correctAnswer = target.meaning;
    const options = seededShuffle(
      [correctAnswer, ...distractors.map((d) => d.meaning)],
      rng
    );

    return {
      idiomId,
      questionType,
      question: target.arabic,
      questionTransliteration: target.transliteration,
      correctAnswer,
      options,
      explanation: `"${target.literal}" — ${target.meaning}`,
    };
  } else {
    // Show meaning -> pick correct Arabic idiom
    const correctAnswer = target.arabic;
    const options = seededShuffle(
      [correctAnswer, ...distractors.map((d) => d.arabic)],
      rng
    );

    return {
      idiomId,
      questionType,
      question: target.meaning,
      questionTransliteration: null,
      correctAnswer,
      options,
      explanation: `${target.arabic} (${target.transliteration}) — "${target.literal}"`,
    };
  }
}

/**
 * Generate a batch of quiz questions.
 * @param {Array} allIdioms
 * @param {number} count — number of questions (default 5)
 * @param {number} seed
 * @param {Array<string>} [filterCefrLevels] — optional CEFR filter
 * @returns {Array} questions
 */
export function generateQuizBatch(allIdioms, count = 5, seed = 0, filterCefrLevels = null) {
  const rng = mulberry32(seed);
  let pool = [...allIdioms];

  if (filterCefrLevels && filterCefrLevels.length > 0) {
    pool = pool.filter((i) => filterCefrLevels.includes(i.cefrLevel));
  }

  seededShuffle(pool, rng);
  const selected = pool.slice(0, count);
  const questions = [];

  for (let i = 0; i < selected.length; i++) {
    // Alternate: 60% idiom-to-meaning, 40% meaning-to-idiom
    const type = rng() < 0.6 ? 'idiom-to-meaning' : 'meaning-to-idiom';
    const q = generateIdiomQuizQuestion(selected[i].id, type, allIdioms, seed + i * 7);
    if (q) questions.push(q);
  }

  return questions;
}

// ============================================================
// SCORING
// ============================================================

/** Difficulty multipliers by CEFR level */
const DIFFICULTY_MULTIPLIER = { A1: 1.0, A2: 1.2, B1: 1.5, B2: 2.0 };

/**
 * Calculate quiz score for a single answer.
 * @param {boolean} correct
 * @param {number}  timeMs — time taken in milliseconds
 * @param {string}  cefrLevel — 'A1'|'A2'|'B1'|'B2'
 * @returns {{ basePoints, timeBonus, total }}
 */
export function calculateQuizScore(correct, timeMs, cefrLevel) {
  if (!correct) return { basePoints: 0, timeBonus: 0, total: 0 };

  const multiplier = DIFFICULTY_MULTIPLIER[cefrLevel] || 1.0;
  const basePoints = Math.round(10 * multiplier);

  // Time bonus: max 5 points, decays over 10 seconds
  const seconds = timeMs / 1000;
  const timeBonus = seconds < 10 ? Math.round((1 - seconds / 10) * 5 * multiplier) : 0;

  return {
    basePoints,
    timeBonus,
    total: basePoints + timeBonus,
  };
}

// ============================================================
// LEARNING PROGRESS
// ============================================================

/**
 * Build a summary of idiom learning progress.
 * @param {Set<string>|Array<string>} learnedIds
 * @param {Array} allIdioms
 * @returns {{ totalLearned, byCategory, byCefrLevel, nextMilestone }}
 */
export function getLearningProgressSummary(learnedIds, allIdioms) {
  const learned = learnedIds instanceof Set ? learnedIds : new Set(learnedIds);
  const totalLearned = learned.size;

  const byCategory = {};
  const byCefrLevel = { A1: 0, A2: 0, B1: 0, B2: 0 };

  for (const idiom of allIdioms) {
    if (!byCategory[idiom.category]) byCategory[idiom.category] = 0;
    if (learned.has(idiom.id)) {
      byCategory[idiom.category]++;
      byCefrLevel[idiom.cefrLevel]++;
    }
  }

  // Milestones: 10, 25, 50, 75, 100
  const milestones = [
    { name: 'First Steps', count: 10 },
    { name: 'Getting Started', count: 25 },
    { name: 'Halfway There', count: 50 },
    { name: 'Experienced', count: 75 },
    { name: 'Master', count: 100 },
  ];

  const nextMilestone = milestones.find((m) => totalLearned < m.count) || milestones[milestones.length - 1];

  return { totalLearned, byCategory, byCefrLevel, nextMilestone };
}

/**
 * Check if a player can unlock idioms at a given CEFR level.
 * A1 is always unlocked. Higher levels require learning thresholds.
 * @param {number} learnedCount — total idioms learned
 * @param {string} cefrLevel    — level to check
 * @returns {boolean}
 */
export function canUnlockNextIdiomCategory(learnedCount, cefrLevel) {
  const thresholds = { A1: 0, A2: 5, B1: 15, B2: 30 };
  const required = thresholds[cefrLevel];
  if (required === undefined) return false;
  return learnedCount >= required;
}

/**
 * Build quiz difficulty configuration based on player progress.
 * @param {number} playerLevel — overall player level
 * @param {string} maxCefrLevel — highest CEFR level unlocked
 * @returns {{ cefrTargets, typeDistribution }}
 */
export function buildQuizDifficultyCurve(playerLevel, maxCefrLevel) {
  const allLevels = ['A1', 'A2', 'B1', 'B2'];
  const maxIdx = allLevels.indexOf(maxCefrLevel);
  const cefrTargets = allLevels.slice(0, maxIdx + 1);

  return {
    cefrTargets,
    typeDistribution: { 'idiom-to-meaning': 0.6, 'meaning-to-idiom': 0.4 },
  };
}

/**
 * Generate a daily idiom challenge bundle.
 * @param {string} dateString — 'YYYY-MM-DD'
 * @param {Array} allIdioms
 * @returns {{ type, idiomId, questions }}
 */
export function generateDailyIdiomChallenge(dateString, allIdioms) {
  const idiomId = getDailyIdiomId(dateString, allIdioms);
  const seed = hashDateString(dateString + ':quiz');
  const questions = generateQuizBatch(allIdioms, 3, seed);

  return {
    type: 'daily_idiom',
    idiomId,
    questions,
  };
}
