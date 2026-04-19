/**
 * FEAT-049: Explicit teaching session service tests
 *
 * Covers:
 * - createTeachingSession returns correct 4-step structure
 * - Step 1 (see): arabic, english, transliteration
 * - Step 2 (hear): audioRef = arabic text, syllables array
 * - Step 3 (connect): root, rootMeaning, relatedWords (from ROOT_TEACHING_SET)
 * - Step 4 (practice): prompt, options (4 total), correctId
 * - Word with no root: connect step has null root and empty relatedWords
 * - generateDistractors: excludes target, excludes same root, prefers same CEFR + category
 * - generateDistractors: returns up to count items
 * - completeTeachingSession: returns { wordId, card, source }
 * - completeTeachingSession: card has FSRS fields (due, stability, etc.)
 * - syllabify: hyphen-delimited, space-delimited, single-token
 */

import { describe, it, expect } from 'vitest';
import {
  createTeachingSession,
  generateDistractors,
  completeTeachingSession,
} from '../teachingSession.js';

// ─── Mock vocabulary ───────────────────────────────────────────────────────────

/**
 * Minimal vocabulary pool for tests.
 * Covers multiple CEFR levels and categories so distractor tests are precise.
 */
const MOCK_VOCAB = [
  // Target word
  { id: 'w001', arabic: 'كِتَاب', english: 'book', transliteration: 'ki-TAAB', root: 'كتب', category: 'academic', cefrLevel: 'A1', frequency: 9000, difficulty: 1 },

  // Same CEFR + same category → best distractors
  { id: 'w002', arabic: 'قَلَم', english: 'pen', transliteration: 'qa-LAM', root: 'قلم', category: 'academic', cefrLevel: 'A1', frequency: 8000, difficulty: 1 },
  { id: 'w003', arabic: 'دَرْس', english: 'lesson', transliteration: 'DARS', root: 'درس', category: 'academic', cefrLevel: 'A1', frequency: 7500, difficulty: 1 },
  { id: 'w004', arabic: 'مَدْرَسَة', english: 'school', transliteration: 'MAD-ra-sa', root: 'درس', category: 'academic', cefrLevel: 'A1', frequency: 7000, difficulty: 1 },

  // Same root as target (كتب) — must be excluded from distractors
  { id: 'w005', arabic: 'كَتَبَ', english: 'he wrote', transliteration: 'ka-TA-ba', root: 'كتب', category: 'academic', cefrLevel: 'A1', frequency: 8500, difficulty: 1 },
  { id: 'w006', arabic: 'كَاتِب', english: 'writer', transliteration: 'KAA-tib', root: 'كتب', category: 'academic', cefrLevel: 'A1', frequency: 8000, difficulty: 1 },

  // Same CEFR, different category — fallback distractors
  { id: 'w007', arabic: 'بَيْت', english: 'house', transliteration: 'BAYT', root: 'بيت', category: 'family', cefrLevel: 'A1', frequency: 8000, difficulty: 1 },
  { id: 'w008', arabic: 'مَاء', english: 'water', transliteration: 'MAA', root: null, category: 'food', cefrLevel: 'A1', frequency: 9000, difficulty: 1 },

  // Different CEFR — lowest priority distractors
  { id: 'w009', arabic: 'مُعَلِّم', english: 'teacher', transliteration: 'mu-AL-lim', root: 'علم', category: 'academic', cefrLevel: 'A2', frequency: 5000, difficulty: 2 },
  { id: 'w010', arabic: 'طَالِب', english: 'student', transliteration: 'TAA-lib', root: 'طلب', category: 'academic', cefrLevel: 'A2', frequency: 5500, difficulty: 2 },
];

const TARGET_WORD = MOCK_VOCAB[0]; // w001, كِتَاب, root كتب, academic, A1

// Word with no root (particle)
const NO_ROOT_WORD = {
  id: 'w_nr', arabic: 'لَا', english: 'no', transliteration: 'LAA',
  root: null, rootMeaning: null, category: 'greetings', cefrLevel: 'A1', frequency: 9900, difficulty: 1,
};

// Word with pronunciationGuide instead of transliteration (coreVocabulary format)
const CORE_STYLE_WORD = {
  id: 'core_001', arabic: 'السَّلَامُ عَلَيْكُمْ', english: 'peace be upon you',
  root: 'سلم', rootMeaning: 'peace, safety, wholeness',
  pronunciationGuide: 'as-sa-LAA-mu a-LAY-kum',
  category: 'greetings', cefrLevel: 'A1', frequency: 9800, difficulty: 1,
};

// ─── createTeachingSession structure ─────────────────────────────────────────

describe('createTeachingSession — structure', () => {
  it('returns an object with wordId matching the input word id', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    expect(session.wordId).toBe(TARGET_WORD.id);
  });

  it('returns exactly 4 steps', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    expect(session.steps).toHaveLength(4);
  });

  it('step types are: see, hear, connect, practice — in order', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    expect(session.steps.map((s) => s.type)).toEqual(['see', 'hear', 'connect', 'practice']);
  });
});

// ─── Step 1: See ─────────────────────────────────────────────────────────────

describe('createTeachingSession — Step 1: See', () => {
  it('includes arabic, english, and transliteration', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    const see = session.steps[0];
    expect(see.arabic).toBe(TARGET_WORD.arabic);
    expect(see.english).toBe(TARGET_WORD.english);
    expect(see.transliteration).toBe(TARGET_WORD.transliteration);
  });

  it('falls back to pronunciationGuide when transliteration is absent', () => {
    const session = createTeachingSession(CORE_STYLE_WORD, MOCK_VOCAB);
    const see = session.steps[0];
    expect(see.transliteration).toBe(CORE_STYLE_WORD.pronunciationGuide);
  });

  it('transliteration is null when neither field is present', () => {
    const word = { id: 'bare', arabic: 'كَلِمَة', english: 'word', category: 'academic', cefrLevel: 'A1', frequency: 7000 };
    const session = createTeachingSession(word, MOCK_VOCAB);
    expect(session.steps[0].transliteration).toBeNull();
  });
});

// ─── Step 2: Hear ────────────────────────────────────────────────────────────

describe('createTeachingSession — Step 2: Hear', () => {
  it('audioRef equals the Arabic text of the word', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    const hear = session.steps[1];
    expect(hear.audioRef).toBe(TARGET_WORD.arabic);
  });

  it('syllables is an array', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    const hear = session.steps[1];
    expect(Array.isArray(hear.syllables)).toBe(true);
  });

  it('syllables splits on hyphens in transliteration', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    // TARGET_WORD.transliteration = 'ki-TAAB' → ['ki', 'TAAB']
    expect(session.steps[1].syllables).toEqual(['ki', 'TAAB']);
  });

  it('syllables splits on hyphens in pronunciationGuide', () => {
    const session = createTeachingSession(CORE_STYLE_WORD, MOCK_VOCAB);
    // 'as-sa-LAA-mu a-LAY-kum' — contains hyphens
    const syllables = session.steps[1].syllables;
    expect(syllables.length).toBeGreaterThan(1);
  });

  it('syllables is empty array when no transliteration available', () => {
    const word = { id: 'bare', arabic: 'كَلِمَة', english: 'word', category: 'academic', cefrLevel: 'A1' };
    const session = createTeachingSession(word, MOCK_VOCAB);
    expect(session.steps[1].syllables).toEqual([]);
  });
});

// ─── Step 3: Connect ─────────────────────────────────────────────────────────

describe('createTeachingSession — Step 3: Connect', () => {
  it('includes root and rootMeaning', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    const connect = session.steps[2];
    // root_ktb is in ROOT_TEACHING_SET
    expect(connect.root).toBe('كتب');
    expect(typeof connect.rootMeaning).toBe('string');
    expect(connect.rootMeaning.length).toBeGreaterThan(0);
  });

  it('relatedWords contains up to 2 words from the same root', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    const connect = session.steps[2];
    expect(connect.relatedWords.length).toBeGreaterThanOrEqual(1);
    expect(connect.relatedWords.length).toBeLessThanOrEqual(2);
    connect.relatedWords.forEach((rw) => {
      expect(rw).toHaveProperty('arabic');
      expect(rw).toHaveProperty('english');
    });
  });

  it('relatedWords do not include the target word itself', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    const connect = session.steps[2];
    const targetArabic = TARGET_WORD.arabic;
    const hasTarget = connect.relatedWords.some((rw) => rw.arabic === targetArabic);
    expect(hasTarget).toBe(false);
  });

  it('root is null for a word with no root', () => {
    const session = createTeachingSession(NO_ROOT_WORD, MOCK_VOCAB);
    expect(session.steps[2].root).toBeNull();
  });

  it('rootMeaning is null for a word with no root', () => {
    const session = createTeachingSession(NO_ROOT_WORD, MOCK_VOCAB);
    expect(session.steps[2].rootMeaning).toBeNull();
  });

  it('relatedWords is empty for a word with no root', () => {
    const session = createTeachingSession(NO_ROOT_WORD, MOCK_VOCAB);
    expect(session.steps[2].relatedWords).toEqual([]);
  });

  it('uses rootMeaning from word object when provided (overrides teaching set)', () => {
    const session = createTeachingSession(CORE_STYLE_WORD, MOCK_VOCAB);
    const connect = session.steps[2];
    expect(connect.rootMeaning).toBe(CORE_STYLE_WORD.rootMeaning);
  });
});

// ─── Step 4: Practice ────────────────────────────────────────────────────────

describe('createTeachingSession — Step 4: Practice', () => {
  it('includes a prompt string', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    const practice = session.steps[3];
    expect(typeof practice.prompt).toBe('string');
    expect(practice.prompt.length).toBeGreaterThan(0);
  });

  it('prompt references the English meaning of the word', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    expect(session.steps[3].prompt).toContain(TARGET_WORD.english);
  });

  it('options has exactly 4 entries', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    expect(session.steps[3].options).toHaveLength(4);
  });

  it('options include the correct word', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    const { options, correctId } = session.steps[3];
    const correctOption = options.find((o) => o.id === correctId);
    expect(correctOption).toBeDefined();
    expect(correctOption.arabic).toBe(TARGET_WORD.arabic);
  });

  it('correctId matches the target word id', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    expect(session.steps[3].correctId).toBe(TARGET_WORD.id);
  });

  it('each option has arabic, id, and english fields', () => {
    const session = createTeachingSession(TARGET_WORD, MOCK_VOCAB);
    session.steps[3].options.forEach((opt) => {
      expect(opt).toHaveProperty('arabic');
      expect(opt).toHaveProperty('id');
      expect(opt).toHaveProperty('english');
    });
  });
});

// ─── generateDistractors ─────────────────────────────────────────────────────

describe('generateDistractors', () => {
  it('returns the requested count of distractors (default 3)', () => {
    const distractors = generateDistractors(TARGET_WORD, MOCK_VOCAB);
    expect(distractors).toHaveLength(3);
  });

  it('returns custom count when specified', () => {
    const distractors = generateDistractors(TARGET_WORD, MOCK_VOCAB, 2);
    expect(distractors).toHaveLength(2);
  });

  it('does not include the target word itself', () => {
    const distractors = generateDistractors(TARGET_WORD, MOCK_VOCAB);
    const hasTarget = distractors.some((d) => d.id === TARGET_WORD.id);
    expect(hasTarget).toBe(false);
  });

  it('does not include words with the same root as the target', () => {
    const distractors = generateDistractors(TARGET_WORD, MOCK_VOCAB);
    const targetRoot = TARGET_WORD.root; // 'كتب'
    distractors.forEach((d) => {
      const dRoot = d.root ? d.root.replace(/-/g, '') : null;
      const tRoot = targetRoot ? targetRoot.replace(/-/g, '') : null;
      expect(dRoot).not.toBe(tRoot);
    });
  });

  it('prefers words with the same CEFR level and category', () => {
    const distractors = generateDistractors(TARGET_WORD, MOCK_VOCAB, 2);
    // w002 (قَلَم, academic, A1) and w003 (دَرْس, academic, A1) are best matches
    // w004 (مَدْرَسَة) shares root 'درس' with w003 but has no overlap with target
    // At least one distractor should come from same CEFR+category pool
    const samePool = distractors.filter(
      (d) => d.cefrLevel === TARGET_WORD.cefrLevel && d.category === TARGET_WORD.category
    );
    expect(samePool.length).toBeGreaterThan(0);
  });

  it('returns empty array when allVocab is empty', () => {
    expect(generateDistractors(TARGET_WORD, [])).toEqual([]);
  });

  it('handles target word with no root — no root-exclusion filtering', () => {
    const distractors = generateDistractors(NO_ROOT_WORD, MOCK_VOCAB, 3);
    expect(distractors.length).toBeGreaterThanOrEqual(1);
    // Should not include the target itself
    expect(distractors.some((d) => d.id === NO_ROOT_WORD.id)).toBe(false);
  });

  it('handles hyphenated root format ("ك-ت-ب") same as un-hyphenated', () => {
    const wordHyphen = { ...TARGET_WORD, root: 'ك-ت-ب' };
    const distractors = generateDistractors(wordHyphen, MOCK_VOCAB);
    // w005 (كَتَبَ, root كتب) should still be excluded
    expect(distractors.some((d) => d.id === 'w005')).toBe(false);
    expect(distractors.some((d) => d.id === 'w006')).toBe(false);
  });
});

// ─── completeTeachingSession ──────────────────────────────────────────────────

describe('completeTeachingSession', () => {
  it('returns an object with wordId, card, and source', () => {
    const result = completeTeachingSession('w001');
    expect(result).toHaveProperty('wordId', 'w001');
    expect(result).toHaveProperty('card');
    expect(result).toHaveProperty('source', 'teaching_session');
  });

  it('card has required FSRS fields (due, stability, difficulty, reps)', () => {
    const { card } = completeTeachingSession('w001');
    expect(card).toHaveProperty('due');
    expect(card).toHaveProperty('stability');
    expect(card).toHaveProperty('difficulty');
    expect(card).toHaveProperty('reps');
  });

  it('card reps is 1 after one Good review', () => {
    const { card } = completeTeachingSession('w001');
    expect(card.reps).toBe(1);
  });

  it('source is always "teaching_session"', () => {
    const result1 = completeTeachingSession('word_a');
    const result2 = completeTeachingSession('word_b');
    expect(result1.source).toBe('teaching_session');
    expect(result2.source).toBe('teaching_session');
  });
});
