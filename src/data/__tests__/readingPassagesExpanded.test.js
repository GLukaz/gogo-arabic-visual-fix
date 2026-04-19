/**
 * readingPassagesExpanded.test.js
 *
 * Data integrity tests for the 40 expanded reading passages.
 * Validates: 40 passages, 10 per CEFR level, required fields,
 * unique IDs, no duplicates with original set.
 *
 * Phase 90 (READ-EXPAND)
 */

import { describe, it, expect } from 'vitest';
import {
  READING_PASSAGES_EXPANDED,
  getExpandedPassagesByCefrLevel,
  getExpandedPassageById,
  getExpandedPassagesByTopic,
  getExpandedPassageCountByLevel,
} from '../readingPassagesExpanded.js';
import { READING_PASSAGES } from '../readingPassages.js';

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2'];
const VALID_QUESTION_TYPES = ['multiple_choice', 'true_false'];

describe('Reading Passages Expanded — data integrity', () => {
  it('has exactly 40 passages', () => {
    expect(READING_PASSAGES_EXPANDED).toHaveLength(40);
  });

  it('has exactly 10 passages per CEFR level', () => {
    const counts = getExpandedPassageCountByLevel();
    for (const level of VALID_LEVELS) {
      expect(counts[level], `Level ${level} should have 10 passages`).toBe(10);
    }
  });

  it('every passage has all required fields', () => {
    const requiredFields = [
      'id', 'title', 'titleArabic', 'cefrLevel', 'topic',
      'textArabic', 'textEnglish', 'vocabularyHighlights',
      'questions', 'wordCount',
    ];

    for (const passage of READING_PASSAGES_EXPANDED) {
      for (const field of requiredFields) {
        expect(passage, `Passage ${passage.id} missing field: ${field}`).toHaveProperty(field);
      }
    }
  });

  it('every passage has a unique ID', () => {
    const ids = READING_PASSAGES_EXPANDED.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no IDs overlap with the original reading passages', () => {
    const originalIds = new Set(READING_PASSAGES.map((p) => p.id));
    for (const passage of READING_PASSAGES_EXPANDED) {
      expect(originalIds.has(passage.id), `ID ${passage.id} duplicates original set`).toBe(false);
    }
  });

  it('all IDs start with exp_rp_ prefix', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      expect(passage.id.startsWith('exp_rp_'), `ID ${passage.id} should start with exp_rp_`).toBe(true);
    }
  });

  it('every passage has a valid CEFR level', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      expect(VALID_LEVELS).toContain(passage.cefrLevel);
    }
  });

  it('every passage has a non-empty topic string', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      expect(typeof passage.topic).toBe('string');
      expect(passage.topic.length).toBeGreaterThan(0);
    }
  });

  it('every passage has non-empty Arabic and English text', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      expect(passage.textArabic.length, `${passage.id}: empty Arabic text`).toBeGreaterThan(0);
      expect(passage.textEnglish.length, `${passage.id}: empty English text`).toBeGreaterThan(0);
    }
  });

  it('every passage wordCount is a positive number', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      expect(typeof passage.wordCount).toBe('number');
      expect(passage.wordCount, `${passage.id}: wordCount should be positive`).toBeGreaterThan(0);
    }
  });

  it('every passage has 3-8 vocabulary highlights', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      expect(passage.vocabularyHighlights.length, `${passage.id}: should have 3-8 vocab highlights`).toBeGreaterThanOrEqual(3);
      expect(passage.vocabularyHighlights.length, `${passage.id}: should have 3-8 vocab highlights`).toBeLessThanOrEqual(8);
    }
  });

  it('every vocabulary highlight has required fields', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      for (const vocab of passage.vocabularyHighlights) {
        expect(vocab).toHaveProperty('wordId');
        expect(vocab).toHaveProperty('arabic');
        expect(vocab).toHaveProperty('english');
        expect(vocab).toHaveProperty('transliteration');
        expect(vocab.wordId.length).toBeGreaterThan(0);
        expect(vocab.arabic.length).toBeGreaterThan(0);
        expect(vocab.english.length).toBeGreaterThan(0);
        expect(vocab.transliteration.length).toBeGreaterThan(0);
      }
    }
  });

  it('every passage has 3-5 questions', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      expect(passage.questions.length, `${passage.id}: should have 3-5 questions`).toBeGreaterThanOrEqual(3);
      expect(passage.questions.length, `${passage.id}: should have 3-5 questions`).toBeLessThanOrEqual(5);
    }
  });

  it('every question has required fields', () => {
    for (const passage of READING_PASSAGES_EXPANDED) {
      for (const q of passage.questions) {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('type');
        expect(q).toHaveProperty('question');
        expect(q).toHaveProperty('questionArabic');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('correctIndex');
        expect(VALID_QUESTION_TYPES, `${q.id}: invalid type ${q.type}`).toContain(q.type);
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
      }
    }
  });

  it('all question IDs are unique', () => {
    const questionIds = [];
    for (const passage of READING_PASSAGES_EXPANDED) {
      for (const q of passage.questions) {
        questionIds.push(q.id);
      }
    }
    expect(new Set(questionIds).size).toBe(questionIds.length);
  });
});

describe('Reading Passages Expanded — helper functions', () => {
  it('getExpandedPassagesByCefrLevel returns correct count', () => {
    expect(getExpandedPassagesByCefrLevel('A1')).toHaveLength(10);
    expect(getExpandedPassagesByCefrLevel('B2')).toHaveLength(10);
  });

  it('getExpandedPassagesByCefrLevel returns all when no level given', () => {
    expect(getExpandedPassagesByCefrLevel()).toHaveLength(40);
  });

  it('getExpandedPassageById returns correct passage', () => {
    const passage = getExpandedPassageById('exp_rp_a1_001');
    expect(passage).not.toBeNull();
    expect(passage.title).toBe('Animals on the Farm');
  });

  it('getExpandedPassageById returns null for missing ID', () => {
    expect(getExpandedPassageById('nonexistent')).toBeNull();
  });

  it('getExpandedPassagesByTopic returns matching passages', () => {
    const animals = getExpandedPassagesByTopic('animals');
    expect(animals.length).toBeGreaterThanOrEqual(1);
    for (const p of animals) {
      expect(p.topic).toBe('animals');
    }
  });
});
