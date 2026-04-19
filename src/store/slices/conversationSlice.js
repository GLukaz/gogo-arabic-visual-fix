import { createSlice, createSelector } from '@reduxjs/toolkit';
import { conversationScenarios } from '../../data/conversationScenarios.js';

const initialState = {
  completedScenarios: {},
  // { [scenarioId]: { score: number, completedAt: number, attempts: number } }
  currentScenarioId: null,
  currentExchangeIndex: 0,
  sessionScore: 0,
  exchangeScores: [], // scores for each exchange in the current session
  stats: {
    totalCompleted: 0,
    averageScore: 0,
    scenariosPerZone: {},
  },
};

/**
 * Score a player's response against the correct answer.
 * Returns 100 (exact), 75 (1 word off), 50 (2+ off), or 25 (completely wrong).
 */
export function scoreResponse(playerWords, correctArabic) {
  const correctWords = correctArabic.replace(/\s+/g, ' ').trim().split(' ');
  const playerClean = playerWords.map((w) => w.trim()).filter(Boolean);

  if (playerClean.length === 0) return 25;

  // Exact match
  if (playerClean.join(' ') === correctWords.join(' ')) return 100;

  // Count differences
  let differences = 0;
  const maxLen = Math.max(playerClean.length, correctWords.length);

  for (let i = 0; i < maxLen; i++) {
    if (playerClean[i] !== correctWords[i]) {
      differences++;
    }
  }

  if (differences === 1) return 75;
  if (differences >= 2) return 50;

  return 25;
}

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    startScenario(state, action) {
      // payload: scenarioId
      state.currentScenarioId = action.payload;
      state.currentExchangeIndex = 0;
      state.sessionScore = 0;
      state.exchangeScores = [];
    },

    submitResponse(state, action) {
      // payload: { score }
      const { score } = action.payload;
      state.exchangeScores.push(score);
      state.sessionScore =
        Math.round(
          state.exchangeScores.reduce((a, b) => a + b, 0) /
            state.exchangeScores.length
        );
      state.currentExchangeIndex += 1;
    },

    completeScenario(state, action) {
      // payload: { scenarioId, score }
      const { scenarioId, score } = action.payload;
      const now = Date.now();

      if (!state.completedScenarios[scenarioId]) {
        state.completedScenarios[scenarioId] = {
          score: 0,
          completedAt: now,
          attempts: 0,
        };
        state.stats.totalCompleted += 1;
      }

      const record = state.completedScenarios[scenarioId];
      record.attempts += 1;
      record.completedAt = now;

      // Keep best score
      if (score > record.score) {
        record.score = score;
      }

      // Update zone stats
      const scenario = conversationScenarios.find((s) => s.id === scenarioId);
      if (scenario) {
        if (!state.stats.scenariosPerZone[scenario.zone]) {
          state.stats.scenariosPerZone[scenario.zone] = 0;
        }
        // Only count unique completions
        const zoneScenarios = conversationScenarios.filter(
          (s) => s.zone === scenario.zone
        );
        const completedInZone = zoneScenarios.filter(
          (s) => state.completedScenarios[s.id]
        ).length;
        state.stats.scenariosPerZone[scenario.zone] = completedInZone;
      }

      // Recalculate average score
      const scores = Object.values(state.completedScenarios).map(
        (r) => r.score
      );
      state.stats.averageScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;

      // Clear current
      state.currentScenarioId = null;
      state.currentExchangeIndex = 0;
      state.sessionScore = 0;
      state.exchangeScores = [];
    },

    resetCurrent(state) {
      state.currentScenarioId = null;
      state.currentExchangeIndex = 0;
      state.sessionScore = 0;
      state.exchangeScores = [];
    },
  },
});

export const { startScenario, submitResponse, completeScenario, resetCurrent } =
  conversationSlice.actions;

// ========== SELECTORS ==========

export const selectCompletedScenarios = (state) =>
  state.conversation.completedScenarios;

export const selectConversationStats = (state) => state.conversation.stats;

export const selectCurrentScenarioId = (state) =>
  state.conversation.currentScenarioId;

export const selectCurrentExchangeIndex = (state) =>
  state.conversation.currentExchangeIndex;

export const selectSessionScore = (state) => state.conversation.sessionScore;

export const selectExchangeScores = (state) =>
  state.conversation.exchangeScores;

export const selectScenarioScore = (id) => (state) => {
  const record = state.conversation.completedScenarios[id];
  return record ? record.score : null;
};

export const selectScenariosForZone = (zone) =>
  createSelector([selectCompletedScenarios], (completed) => {
    const zoneScenarios = conversationScenarios.filter(
      (s) => s.zone === zone
    );
    return zoneScenarios.map((s) => ({
      ...s,
      isCompleted: !!completed[s.id],
      bestScore: completed[s.id]?.score ?? null,
      attempts: completed[s.id]?.attempts ?? 0,
    }));
  });

export const selectTotalCompleted = (state) =>
  state.conversation.stats.totalCompleted;

export const selectAverageScore = (state) =>
  state.conversation.stats.averageScore;

export const selectIsScenarioCompleted = (id) => (state) =>
  !!state.conversation.completedScenarios[id];

export default conversationSlice.reducer;
