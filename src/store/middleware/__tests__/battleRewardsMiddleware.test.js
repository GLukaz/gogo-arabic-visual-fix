import { describe, it, expect, vi, beforeEach } from 'vitest';
import { battleRewardsMiddleware } from '../battleRewardsMiddleware.js';

// Mock EventBus
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: {
    emit: vi.fn(),
  },
}));

// Mock equipment data
vi.mock('../../../data/equipment.js', () => ({
  EQUIPMENT_DATA: {
    simple_kufi: {
      id: 'simple_kufi',
      affixes: [{ wordId: 'word_sharp', bonus: { damage: 0.05 } }],
    },
    scholars_robe: {
      id: 'scholars_robe',
      affixes: [
        { wordId: 'word_wise', bonus: { mp: 10 } },
        { wordId: 'word_blessed', bonus: { mp: 5 } },
      ],
    },
    no_affix_item: {
      id: 'no_affix_item',
      affixes: [],
    },
  },
}));

import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';

describe('battleRewardsMiddleware', () => {
  let store;
  let next;
  let middleware;

  beforeEach(() => {
    vi.clearAllMocks();

    store = {
      getState: vi.fn(),
      dispatch: vi.fn(),
    };
    next = vi.fn((action) => action);

    middleware = battleRewardsMiddleware(store)(next);
  });

  it('passes through non-battle actions unchanged', () => {
    const action = { type: 'player/addXP', payload: 10 };

    middleware(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('does nothing on battle defeat (victory=false)', () => {
    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: false,
        rewards: { xp: 100, gold: 50, items: [] },
      },
    };

    middleware(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('dispatches addXP on victory with xp reward', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: { xp: 100, gold: 50, items: [] },
      },
    };

    middleware(action);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'player/addXP',
        payload: 100,
      })
    );
  });

  it('dispatches earnDirhams on victory with gold reward', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: { xp: 100, gold: 50, items: [] },
      },
    };

    middleware(action);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'player/addDirhams',
        payload: 50,
      })
    );
  });

  it('dispatches addItem for each item reward', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 100,
          gold: 50,
          items: [
            { itemId: 'simple_kufi', quantity: 1 },
            { itemId: 'scholars_robe', quantity: 2 },
          ],
        },
      },
    };

    middleware(action);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/addItem',
        payload: { itemId: 'simple_kufi', quantity: 1 },
      })
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/addItem',
        payload: { itemId: 'scholars_robe', quantity: 2 },
      })
    );
  });

  it('checks inventory capacity before adding items', () => {
    // Mock inventory at 200 items (full)
    store.getState.mockReturnValue({
      inventory: {
        items: Array.from({ length: 200 }, (_, i) => ({ itemId: `item_${i}`, quantity: 1 })),
      },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 100,
          gold: 50,
          items: [{ itemId: 'simple_kufi', quantity: 1 }],
        },
      },
    };

    middleware(action);

    // Should NOT dispatch addItem
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/addItem',
      })
    );
  });

  it('emits INVENTORY_FULL when at 200 items', () => {
    store.getState.mockReturnValue({
      inventory: {
        items: Array.from({ length: 200 }, (_, i) => ({ itemId: `item_${i}`, quantity: 1 })),
      },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 0,
          gold: 0,
          items: [{ itemId: 'simple_kufi', quantity: 1 }],
        },
      },
    };

    middleware(action);

    expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.INVENTORY_FULL);
  });

  it('discovers affix words from reward items', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} }, // word_sharp not yet discovered
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 0,
          gold: 0,
          items: [{ itemId: 'simple_kufi', quantity: 1 }], // has word_sharp affix
        },
      },
    };

    middleware(action);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/unlockAffix',
        payload: 'word_sharp',
      })
    );
  });

  it('dispatches addFsrsCard for new affix words', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} }, // word_sharp not yet in FSRS
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 0,
          gold: 0,
          items: [{ itemId: 'simple_kufi', quantity: 1 }],
        },
      },
    };

    middleware(action);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'vocabulary/addFsrsCard',
        payload: expect.objectContaining({
          wordId: 'word_sharp',
          state: 0, // FSRS New state
        }),
      })
    );
  });

  it('emits AFFIX_DISCOVERED for new affix words', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 0,
          gold: 0,
          items: [{ itemId: 'simple_kufi', quantity: 1 }],
        },
      },
    };

    middleware(action);

    expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.AFFIX_DISCOVERED, {
      wordId: 'word_sharp',
      itemId: 'simple_kufi',
    });
  });

  it('does not re-discover already known affix words', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: {
        fsrsCards: {
          word_sharp: { state: 'Review' }, // Already in FSRS
        },
      },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 0,
          gold: 0,
          items: [{ itemId: 'simple_kufi', quantity: 1 }],
        },
      },
    };

    middleware(action);

    // Should NOT dispatch unlockAffix or addFsrsCard
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/unlockAffix',
      })
    );

    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'vocabulary/addFsrsCard',
      })
    );
  });

  it('handles rewards with no items gracefully', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: { xp: 100, gold: 50, items: [] },
      },
    };

    expect(() => middleware(action)).not.toThrow();
  });

  it('handles rewards with no gold gracefully', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: { xp: 100, gold: 0, items: [] },
      },
    };

    middleware(action);

    // Should NOT dispatch addDirhams for 0 gold
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'player/addDirhams',
      })
    );
  });

  it('handles empty rewards object gracefully', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {},
      },
    };

    expect(() => middleware(action)).not.toThrow();
  });

  it('processes multiple item rewards in sequence', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 0,
          gold: 0,
          items: [
            { itemId: 'simple_kufi', quantity: 1 }, // word_sharp
            { itemId: 'scholars_robe', quantity: 1 }, // word_wise, word_blessed
          ],
        },
      },
    };

    middleware(action);

    // Should add both items
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/addItem',
        payload: { itemId: 'simple_kufi', quantity: 1 },
      })
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/addItem',
        payload: { itemId: 'scholars_robe', quantity: 1 },
      })
    );

    // Should discover all three affixes
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/unlockAffix',
        payload: 'word_sharp',
      })
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/unlockAffix',
        payload: 'word_wise',
      })
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/unlockAffix',
        payload: 'word_blessed',
      })
    );
  });

  it('handles items with no affixes gracefully', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 0,
          gold: 0,
          items: [{ itemId: 'no_affix_item', quantity: 1 }],
        },
      },
    };

    expect(() => middleware(action)).not.toThrow();

    // Should NOT dispatch unlockAffix or addFsrsCard
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inventory/unlockAffix',
      })
    );
  });

  it('emits INVENTORY_ITEM_ADDED for each item', () => {
    store.getState.mockReturnValue({
      inventory: { items: [] },
      vocabulary: { fsrsCards: {} },
    });

    const action = {
      type: 'battle/endBattle',
      payload: {
        victory: true,
        rewards: {
          xp: 0,
          gold: 0,
          items: [
            { itemId: 'simple_kufi', quantity: 1 },
            { itemId: 'scholars_robe', quantity: 1 },
          ],
        },
      },
    };

    middleware(action);

    expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.INVENTORY_ITEM_ADDED, { itemId: 'simple_kufi' });
    expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.INVENTORY_ITEM_ADDED, { itemId: 'scholars_robe' });
  });
});
