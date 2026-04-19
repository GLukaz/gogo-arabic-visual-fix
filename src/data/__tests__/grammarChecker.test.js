/**
 * grammarChecker.test.js
 *
 * Data integrity validation for grammar.js
 * Tests that all A1-B2 grammar lessons meet GRAM-01/GRAM-02 requirements:
 * - 50 total lessons
 * - 12+ exercises per lesson (all CEFR levels)
 * - 4+ distinct exercise types per lesson (all CEFR levels)
 * - 4+ quiz questions per lesson (all CEFR levels)
 * - 20+ A1-A2 lessons, 13+ B1 lessons, 17+ B2 lessons
 * - All exercise schemas are valid
 */

import { describe, it, expect } from 'vitest';
import { grammarLessons } from '../grammar.js';

const a1a2Lessons = grammarLessons.filter(
  (l) => l.cefrLevel === 'A1' || l.cefrLevel === 'A2',
);

const allLessons = grammarLessons;

describe('grammar.js data integrity', () => {
  // ─── Structural checks ────────────────────────────────────────────────────

  it('grammarLessons is a non-empty array', () => {
    expect(Array.isArray(grammarLessons)).toBe(true);
    expect(grammarLessons.length).toBeGreaterThan(0);
  });

  it('contains exactly 50 lessons', () => {
    expect(grammarLessons).toHaveLength(50);
  });

  it('total A1-A2 lessons is at least 20', () => {
    expect(a1a2Lessons.length).toBeGreaterThanOrEqual(20);
  });

  it('has at least 13 B1 and at least 17 B2 lessons', () => {
    const b1 = grammarLessons.filter(l => l.cefrLevel === 'B1');
    const b2 = grammarLessons.filter(l => l.cefrLevel === 'B2');
    expect(b1.length).toBeGreaterThanOrEqual(13);
    expect(b2.length).toBeGreaterThanOrEqual(17);
  });

  it('no duplicate lesson IDs', () => {
    const ids = grammarLessons.map((l) => l.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all lesson order values are unique', () => {
    const orders = grammarLessons.map((l) => l.order);
    const unique = new Set(orders);
    expect(unique.size).toBe(orders.length);
  });

  // ─── Per-lesson exercise count (ALL CEFR levels) ───────────────────────────

  it('each A1-A2 lesson has at least 12 exercises', () => {
    for (const lesson of a1a2Lessons) {
      expect(lesson.exercises.length, `${lesson.id} exercises count`).toBeGreaterThanOrEqual(12);
    }
  });

  it('each A1-A2 lesson has at least 4 distinct exercise types', () => {
    for (const lesson of a1a2Lessons) {
      const types = new Set(lesson.exercises.map((e) => e.type));
      expect(types.size, `${lesson.id} distinct types`).toBeGreaterThanOrEqual(4);
    }
  });

  it('each A1-A2 lesson has at least 4 quiz questions', () => {
    for (const lesson of a1a2Lessons) {
      expect(lesson.quiz.length, `${lesson.id} quiz count`).toBeGreaterThanOrEqual(4);
    }
  });

  it('each B1-B2 lesson has at least 12 exercises', () => {
    const b1b2 = grammarLessons.filter(l => l.cefrLevel === 'B1' || l.cefrLevel === 'B2');
    for (const lesson of b1b2) {
      expect(lesson.exercises.length, `${lesson.id} exercises count`).toBeGreaterThanOrEqual(12);
    }
  });

  it('each B1-B2 lesson has at least 4 distinct exercise types', () => {
    const b1b2 = grammarLessons.filter(l => l.cefrLevel === 'B1' || l.cefrLevel === 'B2');
    for (const lesson of b1b2) {
      const types = new Set(lesson.exercises.map((e) => e.type));
      expect(types.size, `${lesson.id} distinct types`).toBeGreaterThanOrEqual(4);
    }
  });

  it('each B1-B2 lesson has at least 4 quiz questions', () => {
    const b1b2 = grammarLessons.filter(l => l.cefrLevel === 'B1' || l.cefrLevel === 'B2');
    for (const lesson of b1b2) {
      expect(lesson.quiz.length, `${lesson.id} quiz count`).toBeGreaterThanOrEqual(4);
    }
  });

  // ─── conjugation-drill schema ──────────────────────────────────────────────

  it('conjugation-drill exercises have required fields', () => {
    const drills = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'conjugation-drill');
    expect(drills.length).toBeGreaterThan(0);
    for (const drill of drills) {
      expect(typeof drill.answer, 'conjugation-drill answer').toBe('string');
      expect(Array.isArray(drill.options), 'conjugation-drill options').toBe(true);
      expect(drill.options.length, 'conjugation-drill options length').toBe(4);
      expect(['present', 'past', 'future']).toContain(drill.paradigm);
    }
  });

  // ─── sentence-transformation schema ───────────────────────────────────────

  it('sentence-transformation exercises have required fields', () => {
    const items = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'sentence-transformation');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.prompt, 'sentence-transformation prompt').toBe('string');
      expect(typeof item.answer, 'sentence-transformation answer').toBe('string');
    }
  });

  // ─── word-order schema ────────────────────────────────────────────────────

  it('word-order exercises have required fields', () => {
    const items = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'word-order');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.answer, 'word-order answer').toBe('string');
      expect(Array.isArray(item.options), 'word-order options').toBe(true);
      expect(item.options.length, 'word-order options length').toBe(4);
    }
  });

  // ─── error-identification schema ──────────────────────────────────────────

  it('error-identification exercises have required fields', () => {
    const items = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'error-identification');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.sentence, 'error-identification sentence').toBe('string');
      expect(typeof item.error, 'error-identification error').toBe('string');
      expect(typeof item.correction, 'error-identification correction').toBe('string');
      expect(Array.isArray(item.options), 'error-identification options').toBe(true);
      // answer must equal error for handleAnswerSelect compatibility
      expect(item.answer, 'error-identification answer equals error').toBe(item.error);
    }
  });

  // ─── multiple-select schema ───────────────────────────────────────────────

  it('multiple-select exercises have required fields', () => {
    const items = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'multiple-select');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.prompt, 'multiple-select prompt').toBe('string');
      expect(Array.isArray(item.correctAnswers), 'multiple-select correctAnswers').toBe(true);
      expect(Array.isArray(item.options), 'multiple-select options').toBe(true);
    }
  });

  // ─── true-false schema ────────────────────────────────────────────────────

  it('true-false exercises have required fields', () => {
    const items = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'true-false');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.statement, 'true-false statement').toBe('string');
      expect(['true', 'false']).toContain(item.answer);
    }
  });

  // ─── cloze schema ─────────────────────────────────────────────────────────

  it('cloze exercises have required fields', () => {
    const items = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'cloze');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.text, 'cloze text').toBe('string');
      expect(item.text).toContain('___');
      expect(Array.isArray(item.blanks), 'cloze blanks').toBe(true);
      for (const blank of item.blanks) {
        expect(typeof blank.answer, 'cloze blank answer').toBe('string');
        expect(Array.isArray(blank.options), 'cloze blank options').toBe(true);
      }
    }
  });

  // ─── classify schema ──────────────────────────────────────────────────────

  it('classify exercises have required fields', () => {
    const items = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'classify');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.prompt, 'classify prompt').toBe('string');
      expect(Array.isArray(item.categories), 'classify categories').toBe(true);
      expect(Array.isArray(item.items), 'classify items').toBe(true);
      for (const subItem of item.items) {
        expect(typeof subItem.text, 'classify item text').toBe('string');
        expect(typeof subItem.category, 'classify item category').toBe('string');
      }
    }
  });

  // ─── build-sentence schema ────────────────────────────────────────────────

  it('build-sentence exercises have required fields', () => {
    const items = allLessons
      .flatMap((l) => l.exercises)
      .filter((e) => e.type === 'build-sentence');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(typeof item.prompt, 'build-sentence prompt').toBe('string');
      expect(Array.isArray(item.options), 'build-sentence options').toBe(true);
      expect(item.options.length, 'build-sentence options length').toBe(4);
      expect(typeof item.answer, 'build-sentence answer').toBe('string');
    }
  });

  // ─── All 9 new exercise types appear in grammar.js ──────────────────────

  it('all 9 new exercise types appear at least once in A1-A2 lessons', () => {
    const allTypes = new Set(
      a1a2Lessons.flatMap((l) => l.exercises.map((e) => e.type)),
    );
    const requiredTypes = [
      'conjugation-drill',
      'sentence-transformation',
      'word-order',
      'error-identification',
      'multiple-select',
      'true-false',
      'cloze',
      'classify',
      'build-sentence',
    ];
    for (const t of requiredTypes) {
      expect(allTypes.has(t), `exercise type '${t}' must appear`).toBe(true);
    }
  });

  it('all 9 exercise types also appear in B1-B2 lessons', () => {
    const b1b2 = grammarLessons.filter(l => l.cefrLevel === 'B1' || l.cefrLevel === 'B2');
    const allTypes = new Set(b1b2.flatMap((l) => l.exercises.map((e) => e.type)));
    const requiredTypes = [
      'conjugation-drill',
      'sentence-transformation',
      'word-order',
      'error-identification',
      'multiple-select',
      'true-false',
      'cloze',
      'classify',
      'build-sentence',
    ];
    for (const t of requiredTypes) {
      expect(allTypes.has(t), `exercise type '${t}' must appear in B1-B2`).toBe(true);
    }
  });
});
