import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock loreEntries to avoid importing 300+ entries in tests
vi.mock('../../../data/loreEntries.js', () => {
  const entries = [
    { id: 'history_001', category: 'history', discoveryTrigger: 'zone_visit:oasis-village' },
    { id: 'culture_001', category: 'culture', discoveryTrigger: 'npc_talk:scholar-yusuf' },
    { id: 'science_001', category: 'science', discoveryTrigger: 'quest_complete:main_quest_1' },
    { id: 'language_001', category: 'language', discoveryTrigger: 'word_learn:word_kitab' },
    { id: 'trade_001', category: 'trade', discoveryTrigger: 'faction_tier:merchants:friendly' },
    { id: 'warfare_001', category: 'warfare', discoveryTrigger: 'level_reach:5' },
    { id: 'mythology_001', category: 'mythology', discoveryTrigger: 'battle_win:10' },
  ];
  return {
    LORE_ENTRIES: entries,
    getLoreEntriesByTrigger: (trigger) => entries.filter((e) => e.discoveryTrigger === trigger),
  };
});

import loreMiddleware from '../loreMiddleware.js';

describe('loreMiddleware', () => {
  let store;
  let next;
  let dispatched;

  beforeEach(() => {
    dispatched = [];
    next = vi.fn((action) => action);
    store = {
      getState: vi.fn(() => ({
        lore: { discovered: {} },
        faction: { alignment: {} },
        player: { level: 1 },
        battle: { totalVictories: 0 },
      })),
      dispatch: vi.fn((action) => dispatched.push(action)),
    };
  });

  const invoke = (action) => loreMiddleware(store)(next)(action);

  it('passes actions through to next', () => {
    const action = { type: 'some/action' };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('discovers lore on zone visit flag', () => {
    invoke({ type: 'worldState/setFlag', payload: { key: 'ZONE_OASIS_VILLAGE_DISCOVERED', value: true } });
    expect(dispatched).toEqual([
      expect.objectContaining({
        type: 'lore/discoverEntry',
        payload: { id: 'history_001', trigger: 'zone_visit:oasis-village' },
      }),
    ]);
  });

  it('discovers lore on NPC dialogue', () => {
    invoke({ type: 'npc/recordDialogue', payload: { npcId: 'scholar-yusuf' } });
    expect(dispatched).toEqual([
      expect.objectContaining({
        type: 'lore/discoverEntry',
        payload: { id: 'culture_001', trigger: 'npc_talk:scholar-yusuf' },
      }),
    ]);
  });

  it('discovers lore on quest completion', () => {
    invoke({ type: 'quests/completeQuest', payload: { questId: 'main_quest_1' } });
    expect(dispatched).toEqual([
      expect.objectContaining({
        type: 'lore/discoverEntry',
        payload: { id: 'science_001', trigger: 'quest_complete:main_quest_1' },
      }),
    ]);
  });

  it('discovers lore on word learning', () => {
    invoke({ type: 'vocabulary/addFsrsCard', payload: { wordId: 'word_kitab' } });
    expect(dispatched).toEqual([
      expect.objectContaining({
        type: 'lore/discoverEntry',
        payload: { id: 'language_001', trigger: 'word_learn:word_kitab' },
      }),
    ]);
  });

  it('discovers lore on faction tier crossing', () => {
    store.getState.mockReturnValue({
      lore: { discovered: {} },
      faction: { alignment: { merchants: 30 } },
      player: { level: 1 },
    });
    invoke({ type: 'faction/adjustAlignment', payload: { factionId: 'merchants', delta: 5 } });
    expect(dispatched).toEqual([
      expect.objectContaining({
        type: 'lore/discoverEntry',
        payload: { id: 'trade_001', trigger: 'faction_tier:merchants:friendly' },
      }),
    ]);
  });

  it('discovers lore on level up', () => {
    store.getState.mockReturnValue({
      lore: { discovered: {} },
      faction: { alignment: {} },
      player: { level: 5 },
    });
    invoke({ type: 'player/addXp', payload: 100 });
    expect(dispatched).toEqual([
      expect.objectContaining({
        type: 'lore/discoverEntry',
        payload: { id: 'warfare_001', trigger: 'level_reach:5' },
      }),
    ]);
  });

  it('discovers lore on battle win milestone', () => {
    store.getState.mockReturnValue({
      lore: { discovered: {} },
      faction: { alignment: {} },
      player: { level: 1 },
      battle: { totalVictories: 10 },
    });
    invoke({ type: 'battle/recordVictory' });
    expect(dispatched).toEqual([
      expect.objectContaining({
        type: 'lore/discoverEntry',
        payload: { id: 'mythology_001', trigger: 'battle_win:10' },
      }),
    ]);
  });

  it('does not re-discover already discovered entries', () => {
    store.getState.mockReturnValue({
      lore: { discovered: { history_001: { discoveredAt: 1000 } } },
      faction: { alignment: {} },
      player: { level: 1 },
    });
    invoke({ type: 'worldState/setFlag', payload: { key: 'ZONE_OASIS_VILLAGE_DISCOVERED', value: true } });
    expect(dispatched).toEqual([]);
  });

  it('skips persist actions', () => {
    invoke({ type: 'persist/REHYDRATE' });
    expect(dispatched).toEqual([]);
  });

  it('handles missing payload gracefully', () => {
    expect(() => invoke({ type: 'quests/completeQuest', payload: {} })).not.toThrow();
    expect(() => invoke({ type: 'faction/adjustAlignment', payload: {} })).not.toThrow();
    expect(() => invoke({ type: 'npc/recordDialogue', payload: {} })).not.toThrow();
  });
});
