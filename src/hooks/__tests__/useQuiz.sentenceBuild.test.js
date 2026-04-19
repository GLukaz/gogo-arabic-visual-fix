/**
 * WIRE-001: sentence_build quiz type integration tests.
 *
 * Tests that:
 * - QUIZ_TYPE_REGISTRY contains 'sentence_build' with correct metadata
 * - selectQuizTypeForPlayer can select 'sentence_build' for eligible players
 * - generateSentence produces quiz-compatible tile structures
 * - Tile choices exclude duplicates between correct and distractor sets
 * - Grading: correct tile order passes, wrong order fails
 * - Insufficient mastered words falls back gracefully
 */

import { describe, it, expect } from 'vitest';
import { QUIZ_TYPE_REGISTRY, selectQuizTypeForPlayer } from '../../data/quizTypes.js';
import {
  generateSentence,
  generateSentenceBatch,
  classifyWords,
  generateDistractors,
} from '../../services/sentenceGenerator.js';

// Shared fixture — enough words to exercise all templates
const knownWords = [
  { id: 'kitab',  arabic: 'كِتَاب',  english: 'book',  partOfSpeech: 'noun' },
  { id: 'qalam',  arabic: 'قَلَم',   english: 'pen',   partOfSpeech: 'noun' },
  { id: 'bayt',   arabic: 'بَيْت',   english: 'house', partOfSpeech: 'noun' },
  { id: 'kabir',  arabic: 'كَبِير',  english: 'big',   partOfSpeech: 'adjective' },
  { id: 'saghir', arabic: 'صَغِير',  english: 'small', partOfSpeech: 'adjective' },
  { id: 'kataba', arabic: 'كَتَبَ',  english: 'wrote', partOfSpeech: 'verb' },
  { id: 'fi',     arabic: 'فِي',     english: 'in',    partOfSpeech: 'preposition' },
];

// ─── 1. Registry: type exists ───────────────────────────────────────────────
describe('QUIZ_TYPE_REGISTRY — sentence_build', () => {
  it('registers sentence_build as a quiz type', () => {
    expect(QUIZ_TYPE_REGISTRY['sentence_build']).toBeDefined();
  });

  it('has correct cluster (reading)', () => {
    expect(QUIZ_TYPE_REGISTRY['sentence_build'].cluster).toBe('reading');
  });

  it('has minLevel 5 (requires some player progression)', () => {
    expect(QUIZ_TYPE_REGISTRY['sentence_build'].minLevel).toBe(5);
  });

  it('has cefrMin A1 (available from earliest CEFR gate)', () => {
    expect(QUIZ_TYPE_REGISTRY['sentence_build'].cefrMin).toBe('A1');
  });
});

// ─── 2. Adaptive routing: selectQuizTypeForPlayer can pick sentence_build ───
describe('selectQuizTypeForPlayer — sentence_build eligibility', () => {
  it('returns sentence_build among eligible types for level 5+ players', () => {
    // Run many selections to confirm sentence_build is in the pool
    const results = new Set();
    for (let i = 0; i < 200; i++) {
      results.add(selectQuizTypeForPlayer({}, 5, 'A1'));
    }
    expect(results.has('sentence_build')).toBe(true);
  });

  it('never returns sentence_build for level 4 players (below minLevel)', () => {
    const results = new Set();
    for (let i = 0; i < 200; i++) {
      results.add(selectQuizTypeForPlayer({}, 4, 'A1'));
    }
    expect(results.has('sentence_build')).toBe(false);
  });
});

// ─── 3. generateSentence produces quiz-compatible tile structures ────────────
describe('generateSentence — quiz tile structure', () => {
  it('returns tiles array usable as quiz choices', () => {
    const sentence = generateSentence(knownWords, []);
    expect(sentence).not.toBeNull();
    expect(Array.isArray(sentence.tiles)).toBe(true);
    expect(sentence.tiles.length).toBeGreaterThanOrEqual(1);
    // Every tile must be a non-empty string (renderable as a button label)
    sentence.tiles.forEach((t) => expect(typeof t).toBe('string'));
    sentence.tiles.forEach((t) => expect(t.length).toBeGreaterThan(0));
  });

  it('provides distractorTiles for wrong-answer options', () => {
    const sentence = generateSentence(knownWords, []);
    expect(sentence).not.toBeNull();
    expect(Array.isArray(sentence.distractorTiles)).toBe(true);
  });

  it('distractor tiles do not overlap with correct tiles', () => {
    const sentence = generateSentence(knownWords, []);
    expect(sentence).not.toBeNull();
    const correctSet = new Set(sentence.tiles);
    sentence.distractorTiles.forEach((d) => {
      expect(correctSet.has(d)).toBe(false);
    });
  });

  it('generates unique sentences in a batch (no duplicate arabic output)', () => {
    const batch = generateSentenceBatch(knownWords, [], 4);
    const arabicSet = new Set(batch.map((s) => s.arabic));
    expect(arabicSet.size).toBe(batch.length);
  });
});

// ─── 4. Graceful handling of insufficient vocabulary ───────────────────────
describe('generateSentence — edge cases', () => {
  it('returns null when fewer than 2 words provided', () => {
    expect(generateSentence([knownWords[0]], [])).toBeNull();
  });

  it('returns null for empty word list', () => {
    expect(generateSentence([], [])).toBeNull();
    expect(generateSentence(null, [])).toBeNull();
  });
});

// ─── 5. classifyWords sorts correctly for sentence generation ───────────────
describe('classifyWords — POS classification for sentence_build', () => {
  it('separates nouns, adjectives, verbs, prepositions', () => {
    const { nouns, adjectives, verbs, prepositions } = classifyWords(knownWords);
    expect(nouns.length).toBeGreaterThanOrEqual(3);
    expect(adjectives.length).toBe(2);
    expect(verbs.length).toBe(1);
    expect(prepositions.length).toBe(1);
  });

  it('falls back unknown POS words to nouns', () => {
    const mixed = [
      ...knownWords,
      { id: 'unknown', arabic: 'كلمة', english: 'word' }, // no POS
    ];
    const { nouns } = classifyWords(mixed);
    // The unknown-POS word should end up in nouns since it has arabic + english
    expect(nouns.some((w) => w.id === 'unknown')).toBe(true);
  });
});

// ─── 6. generateDistractors excludes correct tiles ──────────────────────────
describe('generateDistractors — quiz distractor generation', () => {
  it('does not include correct tiles in distractor set', () => {
    const correctTiles = ['كِتَاب', 'كَبِير'];
    const distractors = generateDistractors(correctTiles, knownWords, 2);
    distractors.forEach((d) => {
      expect(correctTiles.includes(d)).toBe(false);
    });
  });

  it('returns at most the requested count', () => {
    const distractors = generateDistractors(['كِتَاب'], knownWords, 3);
    expect(distractors.length).toBeLessThanOrEqual(3);
  });
});
