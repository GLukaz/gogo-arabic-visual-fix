import { describe, it, expect } from 'vitest';
import conversationReducer, {
  startScenario,
  submitResponse,
  completeScenario,
  resetCurrent,
  scoreResponse,
  selectCompletedScenarios,
  selectConversationStats,
  selectCurrentScenarioId,
  selectCurrentExchangeIndex,
  selectSessionScore,
  selectExchangeScores,
  selectScenarioScore,
  selectTotalCompleted,
  selectAverageScore,
  selectIsScenarioCompleted,
} from '../conversationSlice.js';

describe('conversationSlice', () => {
  const initial = conversationReducer(undefined, { type: '@@INIT' });

  describe('initial state', () => {
    it('starts with empty completed scenarios', () => {
      expect(initial.completedScenarios).toEqual({});
    });

    it('starts with null current scenario', () => {
      expect(initial.currentScenarioId).toBeNull();
    });

    it('starts with zero session score', () => {
      expect(initial.sessionScore).toBe(0);
    });

    it('starts with empty exchange scores', () => {
      expect(initial.exchangeScores).toEqual([]);
    });

    it('starts with zero stats', () => {
      expect(initial.stats.totalCompleted).toBe(0);
      expect(initial.stats.averageScore).toBe(0);
      expect(initial.stats.scenariosPerZone).toEqual({});
    });
  });

  describe('startScenario', () => {
    it('sets the current scenario ID', () => {
      const state = conversationReducer(initial, startScenario('oasis_greeting_001'));
      expect(state.currentScenarioId).toBe('oasis_greeting_001');
    });

    it('resets exchange index to 0', () => {
      let state = conversationReducer(initial, startScenario('oasis_greeting_001'));
      state = conversationReducer(state, submitResponse({ score: 100 }));
      expect(state.currentExchangeIndex).toBe(1);

      state = conversationReducer(state, startScenario('oasis_greeting_001'));
      expect(state.currentExchangeIndex).toBe(0);
    });

    it('resets session score and exchange scores', () => {
      let state = conversationReducer(initial, startScenario('oasis_greeting_001'));
      state = conversationReducer(state, submitResponse({ score: 75 }));
      expect(state.sessionScore).toBe(75);

      state = conversationReducer(state, startScenario('oasis_greeting_001'));
      expect(state.sessionScore).toBe(0);
      expect(state.exchangeScores).toEqual([]);
    });
  });

  describe('submitResponse', () => {
    it('adds score to exchange scores', () => {
      let state = conversationReducer(initial, startScenario('oasis_greeting_001'));
      state = conversationReducer(state, submitResponse({ score: 100 }));
      expect(state.exchangeScores).toEqual([100]);
    });

    it('increments exchange index', () => {
      let state = conversationReducer(initial, startScenario('oasis_greeting_001'));
      state = conversationReducer(state, submitResponse({ score: 100 }));
      expect(state.currentExchangeIndex).toBe(1);
    });

    it('calculates session score as average', () => {
      let state = conversationReducer(initial, startScenario('oasis_greeting_001'));
      state = conversationReducer(state, submitResponse({ score: 100 }));
      expect(state.sessionScore).toBe(100);
      state = conversationReducer(state, submitResponse({ score: 50 }));
      expect(state.sessionScore).toBe(75);
      state = conversationReducer(state, submitResponse({ score: 75 }));
      expect(state.sessionScore).toBe(75); // (100+50+75)/3 = 75
    });
  });

  describe('completeScenario', () => {
    it('adds scenario to completed', () => {
      const state = conversationReducer(
        initial,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 80 })
      );
      expect(state.completedScenarios['oasis_greeting_001']).toBeDefined();
      expect(state.completedScenarios['oasis_greeting_001'].score).toBe(80);
      expect(state.completedScenarios['oasis_greeting_001'].attempts).toBe(1);
    });

    it('increments total completed', () => {
      const state = conversationReducer(
        initial,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 80 })
      );
      expect(state.stats.totalCompleted).toBe(1);
    });

    it('keeps best score on retry', () => {
      let state = conversationReducer(
        initial,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 90 })
      );
      state = conversationReducer(
        state,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 60 })
      );
      expect(state.completedScenarios['oasis_greeting_001'].score).toBe(90);
      expect(state.completedScenarios['oasis_greeting_001'].attempts).toBe(2);
    });

    it('updates best score when higher', () => {
      let state = conversationReducer(
        initial,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 60 })
      );
      state = conversationReducer(
        state,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 95 })
      );
      expect(state.completedScenarios['oasis_greeting_001'].score).toBe(95);
    });

    it('does not increment totalCompleted on retry', () => {
      let state = conversationReducer(
        initial,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 80 })
      );
      state = conversationReducer(
        state,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 90 })
      );
      expect(state.stats.totalCompleted).toBe(1);
    });

    it('calculates average score across completions', () => {
      let state = conversationReducer(
        initial,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 80 })
      );
      state = conversationReducer(
        state,
        completeScenario({ scenarioId: 'oasis_intro_002', score: 100 })
      );
      expect(state.stats.averageScore).toBe(90);
    });

    it('clears current scenario after completion', () => {
      let state = conversationReducer(initial, startScenario('oasis_greeting_001'));
      state = conversationReducer(
        state,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 80 })
      );
      expect(state.currentScenarioId).toBeNull();
      expect(state.currentExchangeIndex).toBe(0);
      expect(state.sessionScore).toBe(0);
    });

    it('updates scenariosPerZone', () => {
      const state = conversationReducer(
        initial,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 80 })
      );
      expect(state.stats.scenariosPerZone['oasis-village']).toBe(1);
    });
  });

  describe('resetCurrent', () => {
    it('clears current state without affecting completed', () => {
      let state = conversationReducer(
        initial,
        completeScenario({ scenarioId: 'oasis_greeting_001', score: 80 })
      );
      state = conversationReducer(state, startScenario('oasis_intro_002'));
      state = conversationReducer(state, submitResponse({ score: 75 }));
      state = conversationReducer(state, resetCurrent());

      expect(state.currentScenarioId).toBeNull();
      expect(state.currentExchangeIndex).toBe(0);
      expect(state.sessionScore).toBe(0);
      expect(state.exchangeScores).toEqual([]);
      // Completed should remain
      expect(state.completedScenarios['oasis_greeting_001']).toBeDefined();
    });
  });
});

describe('scoreResponse', () => {
  it('returns 100 for exact match', () => {
    const score = scoreResponse(
      ['وَعَلَيْكُمُ', 'السَّلام'],
      'وَعَلَيْكُمُ السَّلام'
    );
    expect(score).toBe(100);
  });

  it('returns 75 for 1 word difference', () => {
    const score = scoreResponse(
      ['وَعَلَيْكُمُ', 'صَباح'],
      'وَعَلَيْكُمُ السَّلام'
    );
    expect(score).toBe(75);
  });

  it('returns 50 for 2+ word differences', () => {
    const score = scoreResponse(
      ['مَعَ', 'صَباح'],
      'وَعَلَيْكُمُ السَّلام'
    );
    expect(score).toBe(50);
  });

  it('returns 25 for empty input', () => {
    const score = scoreResponse([], 'وَعَلَيْكُمُ السَّلام');
    expect(score).toBe(25);
  });

  it('returns 50 for wrong length (extra words)', () => {
    const score = scoreResponse(
      ['وَعَلَيْكُمُ', 'السَّلام', 'مَعَ', 'صَباح'],
      'وَعَلَيْكُمُ السَّلام'
    );
    expect(score).toBe(50);
  });

  it('handles extra whitespace in correct answer', () => {
    const score = scoreResponse(
      ['أَنا', 'بِخَيْر'],
      '  أَنا   بِخَيْر  '
    );
    expect(score).toBe(100);
  });
});

describe('selectors', () => {
  const mockState = {
    conversation: {
      completedScenarios: {
        'oasis_greeting_001': { score: 90, completedAt: 1000, attempts: 2 },
      },
      currentScenarioId: 'oasis_intro_002',
      currentExchangeIndex: 1,
      sessionScore: 75,
      exchangeScores: [75],
      stats: {
        totalCompleted: 1,
        averageScore: 90,
        scenariosPerZone: { 'oasis-village': 1 },
      },
    },
  };

  it('selectCompletedScenarios returns completed map', () => {
    const completed = selectCompletedScenarios(mockState);
    expect(completed['oasis_greeting_001']).toBeDefined();
  });

  it('selectConversationStats returns stats', () => {
    const stats = selectConversationStats(mockState);
    expect(stats.totalCompleted).toBe(1);
    expect(stats.averageScore).toBe(90);
  });

  it('selectCurrentScenarioId returns current ID', () => {
    expect(selectCurrentScenarioId(mockState)).toBe('oasis_intro_002');
  });

  it('selectCurrentExchangeIndex returns index', () => {
    expect(selectCurrentExchangeIndex(mockState)).toBe(1);
  });

  it('selectSessionScore returns session score', () => {
    expect(selectSessionScore(mockState)).toBe(75);
  });

  it('selectExchangeScores returns scores array', () => {
    expect(selectExchangeScores(mockState)).toEqual([75]);
  });

  it('selectScenarioScore returns score for completed scenario', () => {
    expect(selectScenarioScore('oasis_greeting_001')(mockState)).toBe(90);
  });

  it('selectScenarioScore returns null for uncompleted scenario', () => {
    expect(selectScenarioScore('nonexistent')(mockState)).toBeNull();
  });

  it('selectTotalCompleted returns count', () => {
    expect(selectTotalCompleted(mockState)).toBe(1);
  });

  it('selectAverageScore returns average', () => {
    expect(selectAverageScore(mockState)).toBe(90);
  });

  it('selectIsScenarioCompleted returns true for completed', () => {
    expect(selectIsScenarioCompleted('oasis_greeting_001')(mockState)).toBe(true);
  });

  it('selectIsScenarioCompleted returns false for incomplete', () => {
    expect(selectIsScenarioCompleted('oasis_intro_002')(mockState)).toBe(false);
  });
});
