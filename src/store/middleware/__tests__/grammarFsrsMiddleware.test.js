import { describe, it, expect, vi, beforeEach } from 'vitest';
import { grammarFsrsMiddleware } from '../grammarFsrsMiddleware.js';

// Mock ts-fsrs
vi.mock('ts-fsrs', () => {
  const Rating = { Again: 1, Hard: 2, Good: 3, Easy: 4 };
  return {
    Rating,
    generatorParameters: () => ({}),
    fsrs: () => ({
      repeat: (card, date) => ({
        [Rating.Again]: {
          card: { ...card, due: '2026-03-25T00:00:00Z', reps: (card.reps || 0) + 1, state: 'Learning' },
          log: { rating: Rating.Again },
        },
        [Rating.Hard]: {
          card: { ...card, due: '2026-03-26T00:00:00Z', reps: (card.reps || 0) + 1, state: 'Learning' },
          log: { rating: Rating.Hard },
        },
        [Rating.Good]: {
          card: { ...card, due: '2026-03-27T00:00:00Z', reps: (card.reps || 0) + 1, state: 'Review' },
          log: { rating: Rating.Good },
        },
        [Rating.Easy]: {
          card: { ...card, due: '2026-03-30T00:00:00Z', reps: (card.reps || 0) + 1, state: 'Review' },
          log: { rating: Rating.Easy },
        },
      }),
    }),
    createEmptyCard: () => ({
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 'New',
    }),
  };
});

describe('grammarFsrsMiddleware', () => {
  let store;
  let next;
  let dispatch;

  beforeEach(() => {
    dispatch = vi.fn();
    store = {
      getState: vi.fn(),
      dispatch,
    };
    next = vi.fn((action) => action);
  });

  it('should pass non-grammar actions through', () => {
    store.getState.mockReturnValue({ grammar: { fsrsCards: {} } });
    const action = { type: 'vocabulary/updateFsrsCard', payload: {} };
    grammarFsrsMiddleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should create FSRS card on first completeLesson', () => {
    store.getState.mockReturnValue({ grammar: { fsrsCards: {} } });
    const action = {
      type: 'grammar/completeLesson',
      payload: { lessonId: 'al-definite', exerciseScore: 80, quizScore: 75 },
    };

    grammarFsrsMiddleware(store)(next)(action);

    // Should dispatch addGrammarFsrsCard then updateGrammarFsrsCard
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0][0].type).toBe('grammar/addGrammarFsrsCard');
    expect(dispatch.mock.calls[0][0].payload.lessonId).toBe('al-definite');
    expect(dispatch.mock.calls[1][0].type).toBe('grammar/updateGrammarFsrsCard');
    expect(dispatch.mock.calls[1][0].payload.lessonId).toBe('al-definite');
  });

  it('should update existing FSRS card on subsequent completeLesson', () => {
    const existingCard = {
      due: '2026-03-24T00:00:00Z',
      stability: 1,
      difficulty: 0.3,
      reps: 1,
      lapses: 0,
      state: 'Learning',
    };
    store.getState.mockReturnValue({
      grammar: { fsrsCards: { 'al-definite': { card: existingCard, log: null } } },
    });
    const action = {
      type: 'grammar/completeLesson',
      payload: { lessonId: 'al-definite', exerciseScore: 90, quizScore: 95 },
    };

    grammarFsrsMiddleware(store)(next)(action);

    // Should only dispatch updateGrammarFsrsCard (no add)
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].type).toBe('grammar/updateGrammarFsrsCard');
  });

  it('should map high quiz score to Easy rating', () => {
    store.getState.mockReturnValue({ grammar: { fsrsCards: {} } });
    const action = {
      type: 'grammar/completeLesson',
      payload: { lessonId: 'lesson1', exerciseScore: 95, quizScore: 95 },
    };

    grammarFsrsMiddleware(store)(next)(action);

    const updateCall = dispatch.mock.calls[1][0]; // second dispatch = update
    expect(updateCall.payload.log.rating).toBe(4); // Easy
  });

  it('should map low quiz score to Again rating', () => {
    store.getState.mockReturnValue({ grammar: { fsrsCards: {} } });
    const action = {
      type: 'grammar/completeLesson',
      payload: { lessonId: 'lesson1', exerciseScore: 30, quizScore: 30 },
    };

    grammarFsrsMiddleware(store)(next)(action);

    const updateCall = dispatch.mock.calls[1][0];
    expect(updateCall.payload.log.rating).toBe(1); // Again
  });

  it('should map medium quiz score to Good rating', () => {
    store.getState.mockReturnValue({ grammar: { fsrsCards: {} } });
    const action = {
      type: 'grammar/completeLesson',
      payload: { lessonId: 'lesson1', exerciseScore: 80, quizScore: 80 },
    };

    grammarFsrsMiddleware(store)(next)(action);

    const updateCall = dispatch.mock.calls[1][0];
    expect(updateCall.payload.log.rating).toBe(3); // Good
  });
});
