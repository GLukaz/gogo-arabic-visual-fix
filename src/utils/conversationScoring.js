/**
 * conversationScoring.js — Conversation Practice Scoring Engine
 *
 * Scores player Arabic responses against expected answers using word-level
 * diff counting. Handles tashkeel (diacritics) gracefully by comparing
 * stripped versions.
 *
 * Scoring rubric:
 *   exact match   → 100
 *   1 word off    → 80
 *   2 words off   → 50
 *   3+ words off  → 25
 *
 * XP formula: Math.min(100, Math.round(50 + score * 0.5))
 */

import { stripDiacritics } from './arabicUtils.js';

// ─────────────────────────────────────────────────────────────────────────────
// Text normalisation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalise Arabic text for comparison:
 *   1. Strip tashkeel (diacritics)
 *   2. Collapse whitespace
 *   3. Trim
 *
 * @param {string} text
 * @returns {string}
 */
export function normaliseArabic(text) {
  if (!text || typeof text !== 'string') return '';
  return stripDiacritics(text).replace(/\s+/g, ' ').trim();
}

/**
 * Tokenise an Arabic sentence into words (split on whitespace,
 * filter empty tokens).
 *
 * @param {string} text — already normalised
 * @returns {string[]}
 */
function tokenise(text) {
  return text.split(' ').filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
// Word-level diff
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Count the number of word-level differences between two token arrays.
 * Uses a simple position-independent set difference:
 *   diffCount = max(|A \ B|, |B \ A|)
 *
 * This means extra or missing words both contribute to the diff.
 *
 * @param {string[]} aTokens
 * @param {string[]} bTokens
 * @returns {number}
 */
export function countWordDiff(aTokens, bTokens) {
  // Count how many tokens in aTokens are NOT in bTokens (ignoring duplicates)
  const bSet = new Map();
  for (const t of bTokens) {
    bSet.set(t, (bSet.get(t) ?? 0) + 1);
  }

  let missing = 0;
  for (const t of aTokens) {
    if ((bSet.get(t) ?? 0) > 0) {
      bSet.set(t, bSet.get(t) - 1);
    } else {
      missing += 1;
    }
  }

  // Also count extra tokens in b not consumed
  let extra = 0;
  for (const count of bSet.values()) {
    extra += count;
  }

  return Math.max(missing, extra);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scoring
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score a player's Arabic conversation response against the expected answer.
 *
 * @param {string} playerText   — player's typed/spoken response
 * @param {string} expectedText — correct expected answer
 * @returns {number} score 0–100
 */
export function scoreConversationResponse(playerText, expectedText) {
  if (!playerText || !expectedText) return 25;

  const normPlayer   = normaliseArabic(playerText);
  const normExpected = normaliseArabic(expectedText);

  // Exact match (after normalisation)
  if (normPlayer === normExpected) return 100;

  const playerTokens   = tokenise(normPlayer);
  const expectedTokens = tokenise(normExpected);

  const diff = countWordDiff(playerTokens, expectedTokens);

  if (diff === 0) return 100;
  if (diff === 1) return 80;
  if (diff === 2) return 50;
  return 25;
}

// ─────────────────────────────────────────────────────────────────────────────
// XP calculation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate XP earned from a conversation score.
 * Formula: min(100, floor(50 + score * 0.5))
 *
 * @param {number} score — 0–100
 * @returns {number} XP earned
 */
export function calculateConversationXP(score) {
  if (typeof score !== 'number' || isNaN(score)) return 50;
  return Math.min(100, Math.floor(50 + score * 0.5));
}

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulary extraction
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract unique vocabulary words from an expected Arabic sentence for
 * queuing into FSRS review.
 *
 * Returns the normalised (diacritic-stripped) tokens as word strings.
 * Filters out punctuation-only tokens.
 *
 * @param {string} expectedText — the expected answer sentence
 * @returns {string[]} array of unique Arabic word tokens
 */
export function extractVocabularyFromSentence(expectedText) {
  if (!expectedText || typeof expectedText !== 'string') return [];

  const normalised = normaliseArabic(expectedText);
  const tokens = tokenise(normalised);

  // Keep only tokens that contain at least one Arabic character
  const arabicPattern = /[\u0600-\u06FF]/;
  const seen = new Set();
  const result = [];

  for (const token of tokens) {
    // Strip trailing punctuation
    const clean = token.replace(/[،؟!.,;:'"()\[\]{}]/g, '').trim();
    if (clean && arabicPattern.test(clean) && !seen.has(clean)) {
      seen.add(clean);
      result.push(clean);
    }
  }

  return result;
}
