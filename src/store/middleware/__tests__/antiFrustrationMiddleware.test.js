import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

// Mock EventBus
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));

vi.mock('../../../utils/eventBusTypes.js', () => ({
  EVENTS: { TEACHING_MOMENT_TRIGGER: 'react:teaching-moment' },
}));

const vocabularyReducer = (state = { fsrsCards: {} }, action) => {
  if (action.type === 'vocabulary/updateFsrsCard') {
    const { wordId, card } = action.payload;
    return { ...state, fsrsCards: { ...state.fsrsCards, [wordId]: { card } } };
  }
  return state;
};

describe('antiFrustrationMiddleware', () => {
  let store;
  let EventBusMock;

  beforeEach(async () => {
    const { antiFrustrationMiddleware, clearAllFailures } = await import(
      '../antiFrustrationMiddleware.js'
    );

    const { EventBus } = await import('../../../utils/eventBus.js');
    EventBusMock = EventBus;
    EventBusMock.emit.mockClear();

    clearAllFailures();

    store = configureStore({
      reducer: { vocabulary: vocabularyReducer },
      middleware: (gdm) => gdm().concat(antiFrustrationMiddleware),
    });
  });

  it('should NOT trigger teaching moment before 3 failures', async () => {
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });

    expect(EventBusMock.emit).not.toHaveBeenCalledWith(
      'react:teaching-moment',
      expect.anything()
    );
  });

  it('should trigger teaching moment after 3 consecutive failures', async () => {
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });

    expect(EventBusMock.emit).toHaveBeenCalledWith('react:teaching-moment', {
      wordId: 'kitab',
      failureCount: 3,
      reason: 'repeated_failure',
    });
  });

  it('should reset counter on correct answer', async () => {
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });
    // Correct answer
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 3 } });
    // Fail again — should NOT trigger because counter was reset
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });

    expect(EventBusMock.emit).not.toHaveBeenCalledWith(
      'react:teaching-moment',
      expect.anything()
    );
  });

  it('should track different words independently', async () => {
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'qalam', rating: 1 } });
    store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'kitab', rating: 1 } });

    // kitab should trigger (3 failures), qalam should not (only 1)
    expect(EventBusMock.emit).toHaveBeenCalledWith('react:teaching-moment', expect.objectContaining({
      wordId: 'kitab',
    }));
    expect(EventBusMock.emit).not.toHaveBeenCalledWith('react:teaching-moment', expect.objectContaining({
      wordId: 'qalam',
    }));
  });

  it('should re-trigger at every multiple of 3 failures', async () => {
    for (let i = 0; i < 6; i++) {
      store.dispatch({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'hard_word', rating: 1 } });
    }

    const teachingCalls = EventBusMock.emit.mock.calls.filter(
      (c) => c[0] === 'react:teaching-moment'
    );
    expect(teachingCalls.length).toBe(2); // At 3 and 6
  });
});
