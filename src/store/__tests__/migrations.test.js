import { describe, it, expect } from 'vitest';
import { createMigrate } from 'redux-persist';
import { migrations } from '../../services/storage/migrations.js';

describe('v11 migration (FIX-02 + new slices)', () => {
  // currentVersion must be 11 so createMigrate applies migration 11 (inboundVersion 10 -> currentVersion 11)
  const migrateFn = createMigrate({ 11: migrations[11] }, { debug: false });

  it('should remap numeric completedLessons to slugs', async () => {
    const preState = {
      _persist: { version: 10, rehydrated: true },
      grammar: {
        completedLessons: [0, 1, 4],
        lessonScores: { 0: { exerciseScore: 80 }, 4: { quizScore: 90 } },
        currentLessonId: null,
      },
    };

    const result = await migrateFn(preState, 11);
    expect(result.grammar.completedLessons).toEqual([
      'al-definite', 'noun-adjective-agreement', 'basic-verb-conjugation',
    ]);
    expect(result.grammar.lessonScores).toHaveProperty('al-definite');
    expect(result.grammar.lessonScores).toHaveProperty('basic-verb-conjugation');
    expect(result.grammar.lessonScores).not.toHaveProperty('0');
    expect(result.grammar.lessonScores).not.toHaveProperty('4');
  });

  it('should remap string-digit completedLessons to slugs', async () => {
    const preState = {
      _persist: { version: 10, rehydrated: true },
      grammar: {
        completedLessons: ['0', '2', '7'],
        lessonScores: { '0': { exerciseScore: 90 } },
        currentLessonId: null,
      },
    };

    const result = await migrateFn(preState, 11);
    expect(result.grammar.completedLessons).toEqual([
      'al-definite', 'personal-pronouns', 'numbers-1-10',
    ]);
    expect(result.grammar.lessonScores).toHaveProperty('al-definite');
    expect(result.grammar.lessonScores).not.toHaveProperty('0');
  });

  it('should be a no-op when completedLessons already contains slugs', async () => {
    const preState = {
      _persist: { version: 10, rehydrated: true },
      grammar: {
        completedLessons: ['al-definite', 'basic-verb-conjugation'],
        lessonScores: { 'al-definite': { exerciseScore: 80 } },
        currentLessonId: null,
      },
    };

    const result = await migrateFn(preState, 11);
    expect(result.grammar.completedLessons).toEqual([
      'al-definite', 'basic-verb-conjugation',
    ]);
    expect(result.grammar.lessonScores).toHaveProperty('al-definite');
  });

  it('should initialize placement slice on root state', async () => {
    const preState = {
      _persist: { version: 10, rehydrated: true },
      player: { level: 1 },
    };

    const result = await migrateFn(preState, 11);
    expect(result.placement).toBeDefined();
    expect(result.placement.hasCompleted).toBe(false);
    expect(result.placement.assignedLevel).toBeNull();
    expect(result.placement.rawScore).toBeNull();
    expect(result.placement.completedAt).toBeNull();
  });

  it('should initialize cefrProgress slice on root state', async () => {
    const preState = {
      _persist: { version: 10, rehydrated: true },
      player: { level: 1 },
    };

    const result = await migrateFn(preState, 11);
    expect(result.cefrProgress).toBeDefined();
    expect(result.cefrProgress.currentLevel).toBeNull();
    expect(result.cefrProgress.levelHistory).toEqual([]);
    expect(result.cefrProgress.lastAssessedAt).toBeNull();
  });

  it('should not overwrite existing placement state (idempotent)', async () => {
    const preState = {
      _persist: { version: 10, rehydrated: true },
      placement: { hasCompleted: true, assignedLevel: 'A2', rawScore: 12, completedAt: '2026-01-01' },
    };

    const result = await migrateFn(preState, 11);
    expect(result.placement.hasCompleted).toBe(true);
    expect(result.placement.assignedLevel).toBe('A2');
  });

  it('should not overwrite existing cefrProgress state (idempotent)', async () => {
    const preState = {
      _persist: { version: 10, rehydrated: true },
      cefrProgress: { currentLevel: 'A1', levelHistory: [{ level: null, date: '2026-01-01', source: 'placement' }], lastAssessedAt: '2026-01-01' },
    };

    const result = await migrateFn(preState, 11);
    expect(result.cefrProgress.currentLevel).toBe('A1');
    expect(result.cefrProgress.levelHistory).toHaveLength(1);
  });

  it('should be safe on nested IndexedDB configs (no grammar key = no-op)', async () => {
    const nestedState = {
      _persist: { version: 10, rehydrated: true },
      fsrsCards: {},
      reviewQueue: [],
    };

    const result = await migrateFn(nestedState, 11);
    expect(result.fsrsCards).toBeDefined();
    expect(result.grammar).toBeUndefined();
    // placement and cefrProgress ARE initialized even on nested configs
    // (harmless -- they just sit unused in the IndexedDB persist namespace)
    expect(result.placement).toBeDefined();
  });

  it('should handle out-of-range numeric index gracefully', async () => {
    const preState = {
      _persist: { version: 10, rehydrated: true },
      grammar: {
        completedLessons: [999],
        lessonScores: {},
        currentLessonId: null,
      },
    };

    const result = await migrateFn(preState, 11);
    // Out-of-range index returns undefined from LESSON_SLUGS[999], falls back to original id
    expect(result.grammar.completedLessons).toEqual([999]);
  });
});
