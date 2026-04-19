/**
 * teachingSession.js — FEAT-049
 *
 * Explicit teaching session service. Builds structured 4-step teaching sequences
 * for individual Arabic words. Pure functions — no Redux dispatches, no UI rendering.
 *
 * Step types:
 *   see      — Arabic text, English meaning, transliteration
 *   hear     — audio reference (Arabic text for TTS), syllable breakdown
 *   connect  — trilateral root, root meaning, 2 related words from the same root
 *   practice — recognition question with 1 correct + 3 distractor options
 *
 * Exported API:
 *   createTeachingSession(word, allVocab?)   → session object
 *   generateDistractors(targetWord, allVocab, count?)  → word[]
 *   completeTeachingSession(wordId)          → { wordId, card, source }
 */

import { shuffle } from '../utils/shuffle.js';
import { createNewCard, reviewCard } from './fsrs.js';
import { ROOT_TEACHING_SET } from '../data/rootTeachingSet.js';
import vocabularyAll from '../data/vocabularyAll.js';

// ─── Root helpers ──────────────────────────────────────────────────────────────

/**
 * Strip hyphens from a root string so "ك-ت-ب" and "كتب" compare equal.
 * Returns null for falsy input.
 *
 * @param {string|null|undefined} root
 * @returns {string|null}
 */
function normalizeRoot(root) {
  if (!root) return null;
  return root.replace(/-/g, '').trim();
}

/**
 * Find the ROOT_TEACHING_SET entry whose root matches the word's root field.
 * Handles both hyphenated ("ك-ت-ب") and un-hyphenated ("كتب") forms.
 *
 * @param {{ root?: string|null }} word
 * @returns {Object|null}
 */
function findRootEntry(word) {
  if (!word.root) return null;
  const normalized = normalizeRoot(word.root);
  return (
    ROOT_TEACHING_SET.find(
      (entry) => normalizeRoot(entry.root) === normalized
    ) || null
  );
}

// ─── Syllabification ───────────────────────────────────────────────────────────

/**
 * Break a transliteration / pronunciation guide into syllables.
 *
 * Handles:
 *   1. Hyphen-delimited forms: "SHUK-ran" → ["SHUK", "ran"]
 *   2. Space-delimited words:  "as-sa-LAA-mu a-LAY-kum" → split as-is
 *   3. Fallback: entire string as single syllable
 *
 * @param {string} transliteration
 * @returns {string[]}
 */
function syllabify(transliteration) {
  if (!transliteration) return [];
  const trimmed = transliteration.trim();
  if (!trimmed) return [];

  // Already hyphen-separated — split on hyphens
  if (trimmed.includes('-')) {
    return trimmed.split('-').filter(Boolean);
  }

  // Space-separated words — treat each word as a syllable block
  if (trimmed.includes(' ')) {
    return trimmed.split(/\s+/).filter(Boolean);
  }

  // Single token — return as-is
  return [trimmed];
}

// ─── createTeachingSession ────────────────────────────────────────────────────

/**
 * Build a 4-step teaching session for the given word.
 *
 * Step 1 — See:      Arabic text, English meaning, transliteration
 * Step 2 — Hear:     TTS reference (Arabic text), syllable breakdown
 * Step 3 — Connect:  Root, root meaning, up to 2 related words
 * Step 4 — Practice: Recognition question, 4 shuffled options (1 correct + 3 distractors)
 *
 * @param {{ id: string, arabic: string, english: string,
 *            transliteration?: string, pronunciationGuide?: string,
 *            root?: string|null, rootMeaning?: string|null,
 *            cefrLevel?: string, category?: string }} word
 * @param {Array} [allVocab]  Vocabulary pool for distractor selection (default: vocabularyAll)
 * @returns {Object} Teaching session
 */
export function createTeachingSession(word, allVocab = vocabularyAll) {
  const rootEntry = findRootEntry(word);

  // Related words from the same root (exclude the target itself, take first 2)
  const relatedWords = rootEntry
    ? rootEntry.derivedWords
        .filter((dw) => dw.arabic !== word.arabic)
        .slice(0, 2)
        .map((dw) => ({ arabic: dw.arabic, english: dw.english }))
    : [];

  // Root meaning: prefer the word's own rootMeaning, then teaching set coreMeaning
  const rootMeaning =
    word.rootMeaning ||
    (rootEntry ? rootEntry.coreMeaning : null) ||
    null;

  // Transliteration: prefer explicit field, fall back to pronunciationGuide
  const transliteration = word.transliteration || word.pronunciationGuide || null;

  // Practice distractors — 3 wrong answers
  const distractors = generateDistractors(word, allVocab, 3);
  const correctOption = { arabic: word.arabic, id: word.id, english: word.english };
  const distractorOptions = distractors.map((d) => ({
    arabic: d.arabic,
    id: d.id,
    english: d.english,
  }));
  const options = shuffle([correctOption, ...distractorOptions]);

  return {
    wordId: word.id,
    steps: [
      // ── Step 1: See ─────────────────────────────────────────────────────────
      {
        type: 'see',
        arabic: word.arabic,
        english: word.english,
        transliteration,
      },

      // ── Step 2: Hear ────────────────────────────────────────────────────────
      {
        type: 'hear',
        audioRef: word.arabic, // Arabic text passed to TTS service by the UI
        syllables: syllabify(transliteration || ''),
      },

      // ── Step 3: Connect ─────────────────────────────────────────────────────
      {
        type: 'connect',
        root: word.root || null,
        rootMeaning,
        relatedWords,
      },

      // ── Step 4: Practice ────────────────────────────────────────────────────
      {
        type: 'practice',
        prompt: `Which of these is the Arabic word for "${word.english}"?`,
        options,         // Array<{ arabic, id, english }> — 4 items (1 correct + 3 distractors)
        correctId: word.id,
      },
    ],
  };
}

// ─── generateDistractors ──────────────────────────────────────────────────────

/**
 * Select `count` plausible wrong-answer words for a recognition question.
 *
 * Selection criteria (priority order):
 *   1. Same CEFR level + same category (best match)
 *   2. Same CEFR level (any category)
 *   3. Any word (fallback for sparse vocabularies)
 *
 * Hard exclusions:
 *   - The target word itself (by id or arabic)
 *   - Words with the same root as the target (avoids near-synonym confusion)
 *
 * @param {{ id: string, arabic: string, root?: string|null,
 *            cefrLevel?: string, category?: string }} targetWord
 * @param {Array}  allVocab  Pool of vocabulary words to select from
 * @param {number} [count=3] Number of distractors to return
 * @returns {Array} Up to `count` distractor word objects
 */
export function generateDistractors(targetWord, allVocab, count = 3) {
  if (!allVocab || allVocab.length === 0) return [];

  const targetRoot = normalizeRoot(targetWord.root);
  const targetCefr = targetWord.cefrLevel || 'A1';
  const targetCategory = targetWord.category;

  // Base exclusion filter
  const isExcluded = (word) => {
    if (word.id === targetWord.id) return true;
    if (word.arabic === targetWord.arabic) return true;
    // Exclude same-root words to prevent near-synonym distractors
    if (targetRoot && normalizeRoot(word.root) === targetRoot) return true;
    return false;
  };

  const candidates = allVocab.filter((w) => !isExcluded(w));

  // Priority 1: same CEFR + same category
  const tier1 = candidates.filter(
    (w) => w.cefrLevel === targetCefr && w.category === targetCategory
  );

  // Priority 2: same CEFR (any category, not already in tier1)
  const tier1Ids = new Set(tier1.map((w) => w.id));
  const tier2 = candidates.filter(
    (w) => w.cefrLevel === targetCefr && !tier1Ids.has(w.id)
  );

  // Priority 3: remaining candidates
  const tier2Ids = new Set(tier2.map((w) => w.id));
  const tier3 = candidates.filter(
    (w) => !tier1Ids.has(w.id) && !tier2Ids.has(w.id)
  );

  // Merge priority tiers
  const ordered = [...tier1, ...tier2, ...tier3];

  // Return first `count` items (ordered already gives best-match first)
  return ordered.slice(0, count);
}

// ─── completeTeachingSession ──────────────────────────────────────────────────

/**
 * Mark a teaching session complete by creating an FSRS card with a Good (3)
 * initial rating. Callers are responsible for dispatching vocabulary/addFsrsCard.
 *
 * @param {string} wordId
 * @returns {{ wordId: string, card: Object, source: string }}
 */
export function completeTeachingSession(wordId) {
  const emptyCard = createNewCard();
  const reviewed = reviewCard(emptyCard, 3); // 3 = Good
  return {
    wordId,
    card: reviewed.card,
    source: 'teaching_session',
  };
}
