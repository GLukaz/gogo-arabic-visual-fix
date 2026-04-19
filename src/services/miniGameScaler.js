/**
 * miniGameScaler.js
 * GROW-023: Scale mini-game parameters based on player CEFR level and player level.
 *
 * Difficulty is a composite of:
 *   - cefrLevel (A1=0, A2=1, B1=2, B2=3, C1=4, C2=5)
 *   - playerLevel (1-50, normalized to 0-1)
 *
 * All outputs are clamped to their stated ranges.
 */

const CEFR_SCORE = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };
const CEFR_MAX = 5;
const PLAYER_LEVEL_MAX = 50;

/**
 * Compute a 0-1 difficulty factor combining CEFR and player level.
 * @param {string} cefrLevel
 * @param {number} playerLevel
 * @returns {number} 0..1
 */
function _difficultyFactor(cefrLevel, playerLevel) {
  const cefrScore = CEFR_SCORE[cefrLevel] ?? 0;
  const cefrNorm = cefrScore / CEFR_MAX;                          // 0..1
  const levelNorm = Math.min(Math.max(playerLevel, 1), PLAYER_LEVEL_MAX) / PLAYER_LEVEL_MAX; // 0..1
  // Weight CEFR at 60%, player level at 40%
  return cefrNorm * 0.6 + levelNorm * 0.4;
}

/**
 * Clamp a value to [min, max] and round to nearest integer.
 */
function _clampInt(value, min, max) {
  return Math.round(Math.min(Math.max(value, min), max));
}

// ── Word Search ───────────────────────────────────────────────────────────────

/**
 * Get word search puzzle parameters.
 * @param {string} cefrLevel — 'A1'|'A2'|'B1'|'B2'|'C1'|'C2'
 * @param {number} playerLevel — 1-50
 * @returns {{ gridSize: number, wordCount: number, allowDiagonals: boolean, timeLimit: number }}
 */
export function getWordSearchParams(cefrLevel, playerLevel) {
  const d = _difficultyFactor(cefrLevel, playerLevel);
  const gridSize = _clampInt(8 + d * 7, 8, 15);     // 8x8 → 15x15
  const wordCount = _clampInt(5 + d * 10, 5, 15);    // 5 → 15 words
  const allowDiagonals = d >= 0.4;                    // diagonals unlock at moderate difficulty
  const timeLimit = _clampInt(300 - d * 180, 120, 300); // 300s → 120s (harder = less time)
  return { gridSize, wordCount, allowDiagonals, timeLimit };
}

// ── Crossword ─────────────────────────────────────────────────────────────────

/**
 * Get crossword puzzle parameters.
 * @param {string} cefrLevel
 * @param {number} playerLevel
 * @returns {{ clueCount: number, gridComplexity: number, showLetterHints: boolean, timeLimit: number }}
 *   gridComplexity: 1 (simple) | 2 (moderate) | 3 (complex)
 */
export function getCrosswordParams(cefrLevel, playerLevel) {
  const d = _difficultyFactor(cefrLevel, playerLevel);
  const clueCount = _clampInt(5 + d * 15, 5, 20);    // 5 → 20 clues
  const gridComplexity = _clampInt(1 + d * 2, 1, 3);  // 1 → 3
  const showLetterHints = d < 0.5;                    // hints only at lower difficulty
  const timeLimit = _clampInt(600 - d * 360, 240, 600); // 600s → 240s
  return { clueCount, gridComplexity, showLetterHints, timeLimit };
}

// ── Memory Match ──────────────────────────────────────────────────────────────

/**
 * Get memory match game parameters.
 * @param {string} cefrLevel
 * @param {number} playerLevel
 * @returns {{ pairCount: number, timeLimit: number, showPreview: boolean, previewDuration: number }}
 */
export function getMemoryMatchParams(cefrLevel, playerLevel) {
  const d = _difficultyFactor(cefrLevel, playerLevel);
  const pairCount = _clampInt(4 + d * 8, 4, 12);     // 4 → 12 pairs
  const timeLimit = _clampInt(120 - d * 60, 60, 120); // 120s → 60s (harder = less time)
  const showPreview = d < 0.6;                         // preview cards only at lower difficulty
  const previewDuration = _clampInt(3000 - d * 2000, 1000, 3000); // 3s → 1s preview
  return { pairCount, timeLimit, showPreview, previewDuration };
}

// ── Number Challenge ──────────────────────────────────────────────────────────

const OPERATIONS_BY_DIFFICULTY = [
  { min: 0.0, ops: ['addition'] },
  { min: 0.2, ops: ['addition', 'subtraction'] },
  { min: 0.5, ops: ['addition', 'subtraction', 'multiplication'] },
  { min: 0.75, ops: ['addition', 'subtraction', 'multiplication', 'division'] },
];

/**
 * Get number challenge parameters.
 * @param {string} cefrLevel
 * @param {number} playerLevel
 * @returns {{ digitCount: number, operations: string[], questionCount: number, timePerQuestion: number }}
 */
export function getNumberChallengeParams(cefrLevel, playerLevel) {
  const d = _difficultyFactor(cefrLevel, playerLevel);
  const digitCount = _clampInt(1 + d * 3, 1, 4);     // 1 → 4 digits
  const questionCount = _clampInt(5 + d * 10, 5, 15); // 5 → 15 questions
  const timePerQuestion = _clampInt(30 - d * 20, 10, 30); // 30s → 10s per question

  // Find the highest applicable operations tier
  let operations = ['addition'];
  for (const tier of OPERATIONS_BY_DIFFICULTY) {
    if (d >= tier.min) operations = tier.ops;
  }

  return { digitCount, operations, questionCount, timePerQuestion };
}
