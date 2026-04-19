import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dailyQuestMiddleware, DAILY_QUEST_BONUS_XP } from '../dailyQuestMiddleware.js';

// Mock the slice actions so we can inspect dispatches
vi.mock('../../slices/dailyQuestSlice.js', () => ({
  loadDailyQuests: vi.fn(({ date, quests }) => ({
    type: 'dailyQuest/loadDailyQuests',
    payload: { date, quests },
  })),
  progressDailyQuest: vi.fn(({ type, amount }) => ({
    type: 'dailyQuest/progressDailyQuest',
    payload: { type, amount },
  })),
  markBonusAwarded: vi.fn(() => ({ type: 'dailyQuest/markBonusAwarded' })),
  selectAllDailyQuestsComplete: vi.fn(() => false),
}));

vi.mock('../../slices/playerSlice.js', () => ({
  addXP: vi.fn((amount) => ({ type: 'player/addXP', payload: amount })),
}));

vi.mock('../../../services/dailyQuestGenerator.js', () => ({
  generateDailyQuests: vi.fn(() => [
    { id: '2026-04-08-vocab_review', type: 'vocab_review', target: 10, current: 0, completed: false },
    { id: '2026-04-08-battle_win',   type: 'battle_win',   target: 1,  current: 0, completed: false },
    { id: '2026-04-08-craft_item',   type: 'craft_item',   target: 1,  current: 0, completed: false },
  ]),
  DAILY_QUEST_TYPES: {
    VOCAB_REVIEW: 'vocab_review',
    BATTLE_WIN:   'battle_win',
    CRAFT_ITEM:   'craft_item',
    VISIT_ZONE:   'visit_zone',
    GIFT_NPC:     'gift_npc',
  },
}));

import {
  progressDailyQuest,
  markBonusAwarded,
  selectAllDailyQuestsComplete,
} from '../../slices/dailyQuestSlice.js';

describe('dailyQuestMiddleware', () => {
  let store;
  let next;
  let middleware;

  beforeEach(() => {
    vi.clearAllMocks();

    store = {
      getState: vi.fn(() => ({
        player: { level: 5 },
        dailyQuest: {
          date: '2026-04-08',
          quests: [
            { id: '2026-04-08-vocab_review', type: 'vocab_review', target: 10, current: 0, completed: false },
            { id: '2026-04-08-battle_win',   type: 'battle_win',   target: 1,  current: 0, completed: false },
            { id: '2026-04-08-craft_item',   type: 'craft_item',   target: 1,  current: 0, completed: false },
          ],
          bonusAwarded: false,
        },
      })),
      dispatch: vi.fn(),
    };
    next = vi.fn((action) => action);

    // Freeze the current UTC date to match the store state
    vi.setSystemTime(new Date('2026-04-08T12:00:00Z'));

    middleware = dailyQuestMiddleware(store)(next);
  });

  // ─── Pass-through ────────────────────────────────────────────────────────────

  it('passes all actions through to next', () => {
    const action = { type: 'player/addXP', payload: 100 };
    middleware(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('does not dispatch for unrelated actions', () => {
    middleware({ type: 'player/levelUp' });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('returns the result from next', () => {
    const action = { type: 'player/addXP', payload: 100 };
    next.mockReturnValue('result');
    const r = middleware(action);
    expect(r).toBe('result');
  });

  // ─── vocab_review ─────────────────────────────────────────────────────────────

  it('progresses vocab_review on vocabulary/updateFsrsCard', () => {
    middleware({ type: 'vocabulary/updateFsrsCard', payload: { wordId: 'w1' } });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dailyQuest/progressDailyQuest', payload: expect.objectContaining({ type: 'vocab_review' }) })
    );
  });

  // ─── battle_win ───────────────────────────────────────────────────────────────

  it('progresses battle_win on battle/endBattle with victory:true', () => {
    middleware({ type: 'battle/endBattle', payload: { victory: true } });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dailyQuest/progressDailyQuest', payload: expect.objectContaining({ type: 'battle_win' }) })
    );
  });

  it('does NOT progress battle_win on battle/endBattle with victory:false', () => {
    middleware({ type: 'battle/endBattle', payload: { victory: false } });
    expect(progressDailyQuest).not.toHaveBeenCalled();
  });

  it('does NOT progress battle_win on battle/endBattle with missing victory', () => {
    middleware({ type: 'battle/endBattle', payload: {} });
    expect(progressDailyQuest).not.toHaveBeenCalled();
  });

  // ─── craft_item ───────────────────────────────────────────────────────────────

  it('progresses craft_item on crafting/craftItem', () => {
    middleware({ type: 'crafting/craftItem', payload: { recipeId: 'ink_block' } });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dailyQuest/progressDailyQuest', payload: expect.objectContaining({ type: 'craft_item' }) })
    );
  });

  // ─── visit_zone ───────────────────────────────────────────────────────────────

  it('progresses visit_zone on quests/visitZone', () => {
    middleware({ type: 'quests/visitZone', payload: { zone: 'bazaar' } });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dailyQuest/progressDailyQuest', payload: expect.objectContaining({ type: 'visit_zone' }) })
    );
  });

  // ─── gift_npc ────────────────────────────────────────────────────────────────

  it('progresses gift_npc on npc/giveNpcGift', () => {
    middleware({ type: 'npc/giveNpcGift', payload: { npcId: 'fatima', giftId: 'dates' } });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dailyQuest/progressDailyQuest', payload: expect.objectContaining({ type: 'gift_npc' }) })
    );
  });

  // ─── Bonus reward ─────────────────────────────────────────────────────────────

  it('dispatches bonus XP and markBonusAwarded when all quests complete', () => {
    selectAllDailyQuestsComplete.mockReturnValue(true);
    middleware({ type: 'vocabulary/updateFsrsCard', payload: {} });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dailyQuest/markBonusAwarded' })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'player/addXP', payload: DAILY_QUEST_BONUS_XP })
    );
  });

  it('does NOT award bonus when bonusAwarded is already true', () => {
    store.getState.mockReturnValue({
      player: { level: 5 },
      dailyQuest: {
        date: '2026-04-08',
        quests: [],
        bonusAwarded: true,
      },
    });
    selectAllDailyQuestsComplete.mockReturnValue(true);
    middleware({ type: 'vocabulary/updateFsrsCard', payload: {} });

    expect(markBonusAwarded).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'player/addXP' })
    );
  });

  // ─── Date reset ───────────────────────────────────────────────────────────────

  it('generates new quests when date has changed', () => {
    store.getState.mockReturnValue({
      player: { level: 5 },
      dailyQuest: { date: '2026-04-07', quests: [], bonusAwarded: false },
    });

    middleware({ type: 'vocabulary/updateFsrsCard', payload: {} });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'dailyQuest/loadDailyQuests' })
    );
  });

  it('does NOT reload quests when date matches today', () => {
    middleware({ type: 'vocabulary/updateFsrsCard', payload: {} });

    const loadCalls = store.dispatch.mock.calls.filter(
      ([a]) => a.type === 'dailyQuest/loadDailyQuests'
    );
    expect(loadCalls).toHaveLength(0);
  });
});
