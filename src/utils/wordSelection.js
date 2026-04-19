/**
 * Adaptive word selection based on player progression
 * Weights word selection by difficulty (1=easy, 2=medium, 3=hard) based on player level/words learned
 */
import { shuffle } from './shuffle.js';

/**
 * Get target difficulty range based on player level
 * @param {number} playerLevel - Current player level
 * @returns {Object} Target difficulty and weights { target: number, weights: Object }
 */
export function getPlayerDifficultyRange(playerLevel) {
  // Map player level to target difficulty (1-5)
  // Level 1-5: difficulty 1-2
  // Level 6-10: difficulty 2-3
  // Level 11-15: difficulty 3-4
  // Level 16+: difficulty 4-5
  let targetDifficulty;
  if (playerLevel <= 5) {
    targetDifficulty = 1;
  } else if (playerLevel <= 10) {
    targetDifficulty = 2;
  } else if (playerLevel <= 15) {
    targetDifficulty = 3;
  } else {
    targetDifficulty = 4;
  }

  // Weighted selection: 60% appropriate difficulty, 25% one level harder, 15% one level easier
  const weights = {};
  const easier = Math.max(1, targetDifficulty - 1);
  const harder = Math.min(5, targetDifficulty + 1);

  weights[targetDifficulty] = 0.60;
  weights[harder] = 0.25;
  weights[easier] = 0.15;

  return { target: targetDifficulty, weights };
}

/**
 * Get difficulty weights based on player progression
 * @param {number} playerLevel - Current player level
 * @param {number} wordsLearned - Number of words learned so far
 * @returns {Object} Weights for each difficulty level {1: weight, 2: weight, 3: weight, 4: weight, 5: weight}
 */
export function getDifficultyWeights(playerLevel, _wordsLearned) {
  const { weights } = getPlayerDifficultyRange(playerLevel);

  // Normalize weights to ensure all difficulties 1-5 have a value
  const normalized = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, ...weights };

  return normalized;
}

/**
 * Select random words weighted by difficulty based on player progression
 * @param {Array} words - Array of word objects with difficulty field
 * @param {number} count - Number of words to select
 * @param {number} playerLevel - Current player level
 * @param {number} wordsLearned - Number of words learned
 * @returns {Array} Selected words
 */
export function selectWordsByDifficulty(words, count, playerLevel, wordsLearned) {
  const weights = getDifficultyWeights(playerLevel, wordsLearned);

  // Group words by difficulty (1-5)
  const wordsByDifficulty = {
    1: words.filter(w => w.difficulty === 1),
    2: words.filter(w => w.difficulty === 2),
    3: words.filter(w => w.difficulty === 3),
    4: words.filter(w => w.difficulty === 4),
    5: words.filter(w => w.difficulty === 5),
  };

  // Calculate how many words to select from each difficulty level
  const counts = {
    1: Math.round(count * weights[1]),
    2: Math.round(count * weights[2]),
    3: Math.round(count * weights[3]),
    4: Math.round(count * weights[4]),
    5: Math.round(count * weights[5]),
  };

  // Adjust counts to ensure we get exactly 'count' words
  const total = counts[1] + counts[2] + counts[3] + counts[4] + counts[5];
  if (total < count) {
    // Add remaining to the most weighted difficulty
    const maxWeight = Math.max(...Object.values(weights));
    const maxDifficulty = Object.keys(weights).find(k => weights[k] === maxWeight);
    counts[maxDifficulty] += (count - total);
  } else if (total > count) {
    // Remove excess from the least weighted non-zero difficulty
    const nonZero = Object.entries(weights).filter(([_, w]) => w > 0);
    const minWeight = Math.min(...nonZero.map(([_, w]) => w));
    const minDifficulty = nonZero.find(([_, w]) => w === minWeight)?.[0];
    if (minDifficulty) {
      counts[minDifficulty] -= (total - count);
    }
  }

  // Select random words from each difficulty level
  const selected = [];

  for (const difficulty of [1, 2, 3, 4, 5]) {
    const pool = wordsByDifficulty[difficulty];
    const neededCount = counts[difficulty];

    if (pool.length === 0 || neededCount <= 0) continue;

    // Shuffle and take needed amount (or all if pool is smaller)
    selected.push(...shuffle(pool).slice(0, Math.min(neededCount, pool.length)));
  }

  // If we don't have enough words, fill with any remaining words
  if (selected.length < count) {
    const remaining = words.filter(w => !selected.includes(w));
    selected.push(...shuffle(remaining).slice(0, count - selected.length));
  }

  // Shuffle final selection and return
  return shuffle(selected).slice(0, count);
}

/**
 * Select words for battle based on category and difficulty
 * Used by Word Duel system to get appropriate words for boss battles
 * @param {Array} words - Array of word objects
 * @param {string} category - Word category to filter by
 * @param {number} difficulty - Target difficulty level (1-5)
 * @param {number} count - Number of words to select
 * @returns {Array} Selected words
 */
export function selectBattleWords(words, category, difficulty, count) {
  // Filter by category if specified
  let pool = category ? words.filter(w => w.category === category) : words;

  // Prioritize words at or near the target difficulty
  // 60% exact match, 25% one level harder, 15% one level easier
  const exact = pool.filter(w => w.difficulty === difficulty);
  const harder = pool.filter(w => w.difficulty === Math.min(5, difficulty + 1));
  const easier = pool.filter(w => w.difficulty === Math.max(1, difficulty - 1));

  const exactCount = Math.round(count * 0.6);
  const harderCount = Math.round(count * 0.25);
  const easierCount = count - exactCount - harderCount;

  const selected = [
    ...shuffle(exact).slice(0, exactCount),
    ...shuffle(harder).slice(0, harderCount),
    ...shuffle(easier).slice(0, easierCount),
  ];

  // If we don't have enough, fill from the entire pool
  if (selected.length < count) {
    const remaining = pool.filter(w => !selected.includes(w));
    selected.push(...shuffle(remaining).slice(0, count - selected.length));
  }

  return shuffle(selected).slice(0, count);
}
