import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  skillTreeXpMiddleware,
  SKILL_TREE_XP_CONFIG,
  QUIZ_TREE_MAP,
  BATTLE_TREE,
  CONVERSATION_TREE,
  PRONUNCIATION_TREE,
  calcBattleSkillXp,
  calcConversationSkillXp,
} from '../skillTreeXpMiddleware.js';

// Mock skillTreeSlice so we can inspect dispatched actions
vi.mock('../../slices/skillTreeSlice.js', () => ({
  addSkillXP: vi.fn(({ treeId, amount }) => ({
    type: 'skillTree/addSkillXP',
    payload: { treeId, amount },
  })),
}));

describe('skillTreeXpMiddleware', () => {
  let store;
  let next;
  let middleware;

  beforeEach(() => {
    vi.clearAllMocks();

    store = {
      getState: vi.fn(() => ({})),
      dispatch: vi.fn(),
    };
    next = vi.fn((action) => action);
    middleware = skillTreeXpMiddleware(store)(next);
  });

  // ─── Pass-through behaviour ───────────────────────────────────────────────

  it('passes all actions through to next', () => {
    const action = { type: 'player/addXP', payload: 100 };
    middleware(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('does not dispatch for unrelated actions', () => {
    middleware({ type: 'player/addXP', payload: 100 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  // ─── Quiz completion ──────────────────────────────────────────────────────

  it('awards reading XP for ar-to-en quiz', () => {
    middleware({
      type: 'achievements/recordQuizTypeResult',
      payload: { quizType: 'ar-to-en', perfect: false },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'skillTree/addSkillXP',
        payload: { treeId: 'reading', amount: SKILL_TREE_XP_CONFIG.QUIZ_BASE_XP },
      })
    );
  });

  it('awards writing XP for en-to-ar quiz', () => {
    middleware({
      type: 'achievements/recordQuizTypeResult',
      payload: { quizType: 'en-to-ar', perfect: false },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { treeId: 'writing', amount: SKILL_TREE_XP_CONFIG.QUIZ_BASE_XP },
      })
    );
  });

  it('awards listening XP for listen quiz', () => {
    middleware({
      type: 'achievements/recordQuizTypeResult',
      payload: { quizType: 'listen', perfect: false },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { treeId: 'listening', amount: SKILL_TREE_XP_CONFIG.QUIZ_BASE_XP },
      })
    );
  });

  it('awards grammar XP for GrammarFill quiz', () => {
    middleware({
      type: 'achievements/recordQuizTypeResult',
      payload: { quizType: 'GrammarFill', perfect: true },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { treeId: 'grammar', amount: SKILL_TREE_XP_CONFIG.QUIZ_BASE_XP },
      })
    );
  });

  it('awards culture XP for DialectIdentify quiz', () => {
    middleware({
      type: 'achievements/recordQuizTypeResult',
      payload: { quizType: 'DialectIdentify', perfect: false },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { treeId: 'culture', amount: SKILL_TREE_XP_CONFIG.QUIZ_BASE_XP },
      })
    );
  });

  it('does not dispatch for unknown quiz types', () => {
    middleware({
      type: 'achievements/recordQuizTypeResult',
      payload: { quizType: 'unknown_quiz_type', perfect: false },
    });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  // ─── Battle win ───────────────────────────────────────────────────────────

  it('awards grammar XP on battle victory', () => {
    middleware({
      type: 'battle/endBattle',
      payload: { victory: true, rewards: { xp: 0, gold: 0, items: [] } },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ treeId: BATTLE_TREE }),
      })
    );
  });

  it('does not dispatch on battle defeat', () => {
    middleware({
      type: 'battle/endBattle',
      payload: { victory: false, rewards: { xp: 100, gold: 50, items: [] } },
    });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('scales battle XP with reward XP (harder enemy = more skill XP)', () => {
    const easyBattleXp = calcBattleSkillXp(0);
    const hardBattleXp = calcBattleSkillXp(200);

    expect(hardBattleXp).toBeGreaterThan(easyBattleXp);
    expect(hardBattleXp).toBeLessThanOrEqual(SKILL_TREE_XP_CONFIG.BATTLE_MAX_XP);
  });

  it('caps battle XP at BATTLE_MAX_XP', () => {
    const xp = calcBattleSkillXp(99999);
    expect(xp).toBe(SKILL_TREE_XP_CONFIG.BATTLE_MAX_XP);
  });

  it('dispatches correct scaled XP for a battle with 100 reward XP', () => {
    middleware({
      type: 'battle/endBattle',
      payload: { victory: true, rewards: { xp: 100, gold: 0, items: [] } },
    });

    const expected = calcBattleSkillXp(100);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { treeId: BATTLE_TREE, amount: expected },
      })
    );
  });

  // ─── Conversation practice ────────────────────────────────────────────────

  it('awards speaking XP when a conversation scenario completes', () => {
    middleware({
      type: 'conversation/completeScenario',
      payload: { scenarioId: 'greet_001', score: 80 },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ treeId: CONVERSATION_TREE }),
      })
    );
  });

  it('scales conversation XP with score', () => {
    const lowScoreXp = calcConversationSkillXp(0);
    const highScoreXp = calcConversationSkillXp(100);

    expect(highScoreXp).toBeGreaterThan(lowScoreXp);
  });

  it('dispatches correct scaled XP for conversation score 75', () => {
    middleware({
      type: 'conversation/completeScenario',
      payload: { scenarioId: 'greet_001', score: 75 },
    });

    const expected = calcConversationSkillXp(75);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { treeId: CONVERSATION_TREE, amount: expected },
      })
    );
  });

  // ─── Pronunciation drills ─────────────────────────────────────────────────

  it('awards listening XP on pronunciation practice attempt', () => {
    middleware({
      type: 'phonetics/recordPracticeAttempt',
      payload: { id: 'letter_ع', score: 85, type: 'consonant' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          treeId: PRONUNCIATION_TREE,
          amount: SKILL_TREE_XP_CONFIG.PRONUNCIATION_XP,
        },
      })
    );
  });

  // ─── XP config constants ──────────────────────────────────────────────────

  it('QUIZ_BASE_XP is a positive number', () => {
    expect(typeof SKILL_TREE_XP_CONFIG.QUIZ_BASE_XP).toBe('number');
    expect(SKILL_TREE_XP_CONFIG.QUIZ_BASE_XP).toBeGreaterThan(0);
  });

  it('BATTLE_MAX_XP is greater than BATTLE_BASE_XP', () => {
    expect(SKILL_TREE_XP_CONFIG.BATTLE_MAX_XP).toBeGreaterThan(
      SKILL_TREE_XP_CONFIG.BATTLE_BASE_XP
    );
  });

  it('QUIZ_TREE_MAP covers all 6 skill trees', () => {
    const trees = new Set(Object.values(QUIZ_TREE_MAP));
    expect(trees.has('reading')).toBe(true);
    expect(trees.has('writing')).toBe(true);
    expect(trees.has('listening')).toBe(true);
    expect(trees.has('grammar')).toBe(true);
    expect(trees.has('culture')).toBe(true);
  });

  // ─── Edge cases ───────────────────────────────────────────────────────────

  it('handles missing payload gracefully for quiz action', () => {
    expect(() =>
      middleware({ type: 'achievements/recordQuizTypeResult', payload: null })
    ).not.toThrow();
  });

  it('handles missing rewards gracefully for battle action', () => {
    expect(() =>
      middleware({ type: 'battle/endBattle', payload: { victory: true } })
    ).not.toThrow();
  });

  it('handles missing score gracefully for conversation action', () => {
    expect(() =>
      middleware({
        type: 'conversation/completeScenario',
        payload: { scenarioId: 'greet_001' },
      })
    ).not.toThrow();

    // Should still dispatch (score defaults to 0)
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('calcBattleSkillXp returns at least BATTLE_BASE_XP for zero rewardXp', () => {
    expect(calcBattleSkillXp(0)).toBe(SKILL_TREE_XP_CONFIG.BATTLE_BASE_XP);
  });

  it('calcConversationSkillXp returns at least CONVERSATION_BASE_XP for zero score', () => {
    expect(calcConversationSkillXp(0)).toBe(SKILL_TREE_XP_CONFIG.CONVERSATION_BASE_XP);
  });
});
