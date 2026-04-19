/**
 * readingPassages.test.js
 *
 * Data integrity tests for graded reading passages.
 * Validates: 60+ passages, 15 per CEFR level, required fields,
 * valid questions, word counts.
 *
 * Phase 82 (READ-01 + READ-02)
 */

import { describe, it, expect } from 'vitest';
import {
  READING_PASSAGES,
  getPassagesByCefrLevel,
  getReadingPassageById,
  getPassagesByTopic,
  getAllTopics,
  getPassageCountByLevel,
} from '../readingPassages.js';

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2'];
const VALID_QUESTION_TYPES = ['multiple_choice', 'true_false'];

describe('Reading Passages — data integrity', () => {
  it('has at least 60 passages', () => {
    expect(READING_PASSAGES.length).toBeGreaterThanOrEqual(60);
  });

  it('has exactly 15 passages per CEFR level', () => {
    const counts = getPassageCountByLevel();
    for (const level of VALID_LEVELS) {
      expect(counts[level]).toBe(15);
    }
  });

  it('every passage has all required fields', () => {
    const requiredFields = [
      'id', 'title', 'titleArabic', 'cefrLevel', 'topic',
      'textArabic', 'textEnglish', 'vocabularyHighlights',
      'questions', 'wordCount',
    ];

    for (const passage of READING_PASSAGES) {
      for (const field of requiredFields) {
        expect(passage).toHaveProperty(field);
      }
    }
  });

  it('every passage has a unique ID', () => {
    const ids = READING_PASSAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every passage has a valid CEFR level', () => {
    for (const passage of READING_PASSAGES) {
      expect(VALID_LEVELS).toContain(passage.cefrLevel);
    }
  });

  it('every passage has a non-empty topic string', () => {
    for (const passage of READING_PASSAGES) {
      expect(typeof passage.topic).toBe('string');
      expect(passage.topic.length).toBeGreaterThan(0);
    }
  });

  it('every passage has non-empty Arabic and English text', () => {
    for (const passage of READING_PASSAGES) {
      expect(passage.textArabic.length).toBeGreaterThan(0);
      expect(passage.textEnglish.length).toBeGreaterThan(0);
    }
  });

  it('every passage wordCount is a positive number', () => {
    for (const passage of READING_PASSAGES) {
      expect(typeof passage.wordCount).toBe('number');
      expect(passage.wordCount).toBeGreaterThan(0);
    }
  });

  it('every passage has at least 1 vocabulary highlight', () => {
    for (const passage of READING_PASSAGES) {
      expect(passage.vocabularyHighlights.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('every vocabulary highlight has wordId, arabic, english, and transliteration', () => {
    for (const passage of READING_PASSAGES) {
      for (const vh of passage.vocabularyHighlights) {
        expect(vh).toHaveProperty('wordId');
        expect(vh).toHaveProperty('arabic');
        expect(vh).toHaveProperty('english');
        expect(vh).toHaveProperty('transliteration');
        expect(vh.wordId.length).toBeGreaterThan(0);
        expect(vh.arabic.length).toBeGreaterThan(0);
      }
    }
  });

  it('every passage has 3-5 questions', () => {
    for (const passage of READING_PASSAGES) {
      expect(passage.questions.length).toBeGreaterThanOrEqual(3);
      expect(passage.questions.length).toBeLessThanOrEqual(5);
    }
  });

  it('every question has required fields', () => {
    for (const passage of READING_PASSAGES) {
      for (const q of passage.questions) {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('type');
        expect(q).toHaveProperty('question');
        expect(q).toHaveProperty('questionArabic');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('correctIndex');
      }
    }
  });

  it('every question has a unique ID', () => {
    const ids = READING_PASSAGES.flatMap((p) => p.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every question type is valid', () => {
    for (const passage of READING_PASSAGES) {
      for (const q of passage.questions) {
        expect(VALID_QUESTION_TYPES).toContain(q.type);
      }
    }
  });

  it('true_false questions have exactly 2 options', () => {
    for (const passage of READING_PASSAGES) {
      for (const q of passage.questions) {
        if (q.type === 'true_false') {
          expect(q.options.length).toBe(2);
        }
      }
    }
  });

  it('multiple_choice questions have at least 3 options', () => {
    for (const passage of READING_PASSAGES) {
      for (const q of passage.questions) {
        if (q.type === 'multiple_choice') {
          expect(q.options.length).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  it('correctIndex is within valid range for each question', () => {
    for (const passage of READING_PASSAGES) {
      for (const q of passage.questions) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
      }
    }
  });

  it('A1 passages have word counts between 15 and 45', () => {
    const a1 = getPassagesByCefrLevel('A1');
    for (const p of a1) {
      expect(p.wordCount).toBeGreaterThanOrEqual(15);
      expect(p.wordCount).toBeLessThanOrEqual(45);
    }
  });

  it('A2 passages have word counts between 35 and 65', () => {
    const a2 = getPassagesByCefrLevel('A2');
    for (const p of a2) {
      expect(p.wordCount).toBeGreaterThanOrEqual(35);
      expect(p.wordCount).toBeLessThanOrEqual(65);
    }
  });

  it('B1 passages have word counts between 55 and 110', () => {
    const b1 = getPassagesByCefrLevel('B1');
    for (const p of b1) {
      expect(p.wordCount).toBeGreaterThanOrEqual(55);
      expect(p.wordCount).toBeLessThanOrEqual(110);
    }
  });

  it('B2 passages have word counts between 75 and 130', () => {
    const b2 = getPassagesByCefrLevel('B2');
    for (const p of b2) {
      expect(p.wordCount).toBeGreaterThanOrEqual(75);
      expect(p.wordCount).toBeLessThanOrEqual(130);
    }
  });
});

describe('Reading Passages — helper functions', () => {
  it('getPassagesByCefrLevel returns correct count', () => {
    expect(getPassagesByCefrLevel('A1').length).toBe(15);
    expect(getPassagesByCefrLevel('A2').length).toBe(15);
    expect(getPassagesByCefrLevel('B1').length).toBe(15);
    expect(getPassagesByCefrLevel('B2').length).toBe(15);
  });

  it('getPassagesByCefrLevel returns all passages for null/undefined', () => {
    expect(getPassagesByCefrLevel(null).length).toBe(READING_PASSAGES.length);
    expect(getPassagesByCefrLevel(undefined).length).toBe(READING_PASSAGES.length);
  });

  it('getReadingPassageById finds existing passage', () => {
    const p = getReadingPassageById('a1_001');
    expect(p).not.toBeNull();
    expect(p.id).toBe('a1_001');
  });

  it('getReadingPassageById returns null for non-existent', () => {
    expect(getReadingPassageById('nonexistent')).toBeNull();
  });

  it('getPassagesByTopic returns matching passages', () => {
    const food = getPassagesByTopic('food');
    expect(food.length).toBeGreaterThan(0);
    for (const p of food) {
      expect(p.topic).toBe('food');
    }
  });

  it('getAllTopics returns unique sorted topics', () => {
    const topics = getAllTopics();
    expect(topics.length).toBeGreaterThan(0);
    // Check sorted
    const sorted = [...topics].sort();
    expect(topics).toEqual(sorted);
    // Check unique
    expect(new Set(topics).size).toBe(topics.length);
  });

  it('getPassageCountByLevel returns correct shape', () => {
    const counts = getPassageCountByLevel();
    expect(counts).toHaveProperty('A1');
    expect(counts).toHaveProperty('A2');
    expect(counts).toHaveProperty('B1');
    expect(counts).toHaveProperty('B2');
  });
});
