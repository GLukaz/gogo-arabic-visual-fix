/**
 * poetryBattle.js — Poetry battle service module
 *
 * Pure service functions for:
 *   - getPoetryChoices: generate 4 word choices (1 correct + 3 distractors) from FSRS-known words
 *   - generateNpcAnswers: simulate NPC poet answers using configurable accuracy
 *   - calculatePoetryScore: compute player and NPC scores from their answers
 *
 * POET-03: Fill-in-blank choices are sourced from FSRS-known words at appropriate CEFR difficulty.
 *
 * Anti-patterns avoided:
 *   - Does NOT extend BattleStateMachine (no HP/MP/damage in poetry battles)
 *   - getPoetryChoices always includes the correct answer (Pitfall 3 guard)
 *   - Falls back to full vocabulary corpus if known-word pool is too small
 *
 * Service layer pattern (same as fsrs.js): imports store directly for Redux state access.
 * No prop-drilling needed; safe for module-level store import.
 */

import { store } from '../store/store.js';
import vocabulary from '../data/vocabularyAll.js';
import { POEMS } from '../data/poems.js';

/**
 * Generate 4 word choices for a poetry blank: 1 correct + 3 distractors.
 *
 * Distractor selection order:
 *   1. Same CEFR level, from FSRS-known words (personalized)
 *   2. Fallback to same CEFR level from full vocabulary if known pool < 3
 *   3. Fallback to any CEFR level from vocabulary if same-CEFR pool < 3
 *
 * The correct answer is always included in the returned choices array (Pitfall 3 guard).
 *
 * @param {string} correctWordId   — vocabulary word ID for the correct answer
 * @param {string} correctWord     — the correct Arabic word string
 * @param {string} cefrLevel       — CEFR level (A1/A2/B1/B2) for distractor selection
 * @returns {Array<{wordId: string, arabic: string, isCorrect: boolean}>} — shuffled 4-choice array
 */
export function getPoetryChoices(correctWordId, correctWord, cefrLevel) {
  const state = store.getState();
  const fsrsCards = state.vocabulary?.fsrsCards || {};
  const knownWordIds = new Set(Object.keys(fsrsCards));

  // Priority 1: same CEFR, known words (personalized experience)
  const sameCefrKnown = vocabulary.filter(
    (w) =>
      w.cefrLevel === cefrLevel &&
      w.id !== correctWordId &&
      knownWordIds.has(w.id) &&
      w.arabic // must have arabic text
  );

  let distractors;
  if (sameCefrKnown.length >= 3) {
    distractors = shuffle(sameCefrKnown).slice(0, 3);
  } else {
    // Priority 2: same CEFR from full vocabulary (Pitfall 3: never run out of choices)
    const sameCefrAll = vocabulary.filter(
      (w) =>
        w.cefrLevel === cefrLevel &&
        w.id !== correctWordId &&
        w.arabic
    );

    if (sameCefrAll.length >= 3) {
      distractors = shuffle(sameCefrAll).slice(0, 3);
    } else {
      // Priority 3: any CEFR from full vocabulary (last resort for edge cases)
      const anyLevel = vocabulary.filter(
        (w) =>
          w.id !== correctWordId &&
          w.arabic
      );
      distractors = shuffle(anyLevel).slice(0, 3);
    }
  }

  // Always include correct answer — placed before shuffle so it can't be accidentally excluded
  const choices = [
    { wordId: correctWordId, arabic: correctWord, isCorrect: true },
    ...distractors.map((w) => ({ wordId: w.id, arabic: w.arabic, isCorrect: false })),
  ];

  // Shuffle the final array so correct answer is in random position
  return shuffle(choices);
}

/**
 * Generate NPC poet answers for all blanks.
 *
 * NPC accuracy is a fixed configurable value per poet (not FSRS-based),
 * keeping the system deterministic and testable.
 *
 * Recommended accuracy values:
 *   - Beginner poet: 0.5
 *   - Intermediate poet: 0.7
 *   - Advanced poet: 0.85
 *   - Master poet: 0.95
 *
 * @param {Array<{wordId: string, cefrLevel: string}>} blanks — blank positions from the poem
 * @param {number} npcAccuracy — probability 0.0-1.0 that NPC answers correctly (default 0.7)
 * @returns {Array<{blankIndex: number, isCorrect: boolean}>}
 */
export function generateNpcAnswers(blanks, npcAccuracy = 0.7) {
  return blanks.map((blank, index) => ({
    blankIndex: index,
    isCorrect: Math.random() < npcAccuracy,
  }));
}

/**
 * Calculate final scores for player and NPC from their answers.
 * Each correct answer is worth 1 point.
 *
 * @param {Array<{blankIndex: number, wordId: string, isCorrect: boolean}|undefined>} playerAnswers
 * @param {Array<{blankIndex: number, isCorrect: boolean}>} npcAnswers
 * @returns {{ playerScore: number, npcScore: number, won: boolean }}
 */
export function calculatePoetryScore(playerAnswers, npcAnswers) {
  const playerScore = playerAnswers.filter((a) => a?.isCorrect === true).length;
  const npcScore = npcAnswers.filter((a) => a?.isCorrect === true).length;
  const won = playerScore > npcScore;
  return { playerScore, npcScore, won };
}

/**
 * Get a poem's flat blanks list ready for a battle session.
 * Returns blanks in order with blankIndex assigned.
 *
 * @param {string} poemId
 * @returns {Array<{blankIndex: number, wordId: string, correctWord: string, cefrLevel: string, lineIndex: number}>}
 */
export function getBlanksForBattle(poemId) {
  const poem = POEMS.find((p) => p.id === poemId);
  if (!poem) return [];

  const blanks = [];
  poem.lines.forEach((line, lineIndex) => {
    if (line.blanks && line.blanks.length > 0) {
      line.blanks.forEach((blank) => {
        blanks.push({
          ...blank,
          lineIndex,
          blankIndex: blanks.length,
        });
      });
    }
  });
  return blanks;
}

// ──────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
