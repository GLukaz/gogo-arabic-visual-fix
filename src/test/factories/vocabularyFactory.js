/**
 * Test factories for vocabulary state
 */

export function createTestWord(overrides = {}) {
  return {
    id: 'word_test',
    arabic: 'مرحبا',
    english: 'hello',
    transliteration: 'marhaba',
    category: 'greetings',
    tier: 1,
    ...overrides,
  };
}

export function createTestCard(overrides = {}) {
  return {
    wordId: 'word_test',
    due: new Date('2026-02-09').toISOString(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: 0,
    last_review: null,
    ...overrides,
  };
}
