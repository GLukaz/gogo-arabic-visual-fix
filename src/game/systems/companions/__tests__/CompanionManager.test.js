import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CompanionManager } from '../CompanionManager.js';
import { createMockScene } from '../../__tests__/mocks/sceneMock.js';

// Mock window.matchMedia for Phaser compatibility
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock Companion sprite
const mockCompanionInstance = {
  x: 0,
  y: 0,
  update: vi.fn(),
  destroy: vi.fn(),
  setFollowTarget: vi.fn(),
  setDepth: vi.fn(),
};

vi.mock('../../../sprites/Companion.js', () => ({
  Companion: vi.fn(() => mockCompanionInstance),
}));

// Mock CompanionContext
const mockContextInstance = {
  evaluateTriggers: vi.fn(),
  reset: vi.fn(),
};

vi.mock('../CompanionContext.js', () => ({
  CompanionContext: vi.fn(() => mockContextInstance),
}));

// Mock EventBus
vi.mock('../../../../utils/eventBus.js', () => ({
  EventBus: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));

vi.mock('../../../../utils/eventBusTypes.js', () => ({
  EVENTS: {
    COMPANION_PARTY_CHANGED: 'companion:party:changed',
    COMPANION_FOLLOW_START: 'companion:follow:start',
    COMPANION_FOLLOW_STOP: 'companion:follow:stop',
  },
}));

// Mock store
vi.mock('../../../../store/store.js', () => ({
  store: {
    getState: vi.fn(() => ({
      companions: {
        activeParty: {
          battle: null,
          exploration: null,
        },
      },
    })),
  },
}));

// Mock COMPANIONS data
vi.mock('../../../../data/companions.js', () => ({
  COMPANIONS: {
    companion_amira: {
      name: 'Amira',
      spriteKey: 'companion_amira',
      colorPalette: {
        primary: '#4A90D9',
        secondary: '#2C5F8A',
        accent: '#FFD700',
      },
    },
  },
}));

import { Companion } from '../../../sprites/Companion.js';
import { EventBus } from '../../../../utils/eventBus.js';
import { EVENTS } from '../../../../utils/eventBusTypes.js';
import { store } from '../../../../store/store.js';

describe('CompanionManager', () => {
  let scene;
  let manager;

  beforeEach(() => {
    vi.clearAllMocks();

    scene = createMockScene({
      playerController: {
        getPlayer: vi.fn(() => ({
          x: 100,
          y: 100,
          depth: 10,
        })),
      },
    });

    store.getState.mockReturnValue({
      companions: {
        activeParty: {
          battle: null,
          exploration: null,
        },
      },
    });
  });

  afterEach(() => {
    if (manager) {
      manager.destroy();
      manager = null;
    }
  });

  describe('constructor', () => {
    it('creates CompanionManager instance', () => {
      manager = new CompanionManager(scene);

      expect(manager).toBeDefined();
      expect(manager.scene).toBe(scene);
      expect(manager.activeCompanion).toBeNull();
      expect(manager.activeCompanionId).toBeNull();
    });

    it('spawns companion if exploration party slot is already set', () => {
      store.getState.mockReturnValue({
        companions: {
          activeParty: {
            battle: null,
            exploration: 'companion_amira',
          },
        },
      });

      manager = new CompanionManager(scene);

      expect(Companion).toHaveBeenCalled();
      expect(manager.activeCompanionId).toBe('companion_amira');
    });

    it('listens for party change events', () => {
      manager = new CompanionManager(scene);

      expect(EventBus.on).toHaveBeenCalledWith(
        EVENTS.COMPANION_PARTY_CHANGED,
        expect.any(Function)
      );
    });
  });

  describe('spawning', () => {
    beforeEach(() => {
      manager = new CompanionManager(scene);
    });

    it('spawns companion when exploration party slot is set', () => {
      manager._spawnCompanion('companion_amira');

      expect(Companion).toHaveBeenCalledWith(
        scene,
        40, // player.x - 60
        130, // player.y + 30
        expect.objectContaining({
          id: 'companion_amira',
          companionId: 'companion_amira',
        })
      );

      expect(manager.activeCompanionId).toBe('companion_amira');
      expect(mockCompanionInstance.setFollowTarget).toHaveBeenCalled();
      expect(mockCompanionInstance.setDepth).toHaveBeenCalledWith(9); // player.depth - 1
      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.COMPANION_FOLLOW_START,
        { companionId: 'companion_amira' }
      );
    });

    it('does not spawn if companion ID not in COMPANIONS', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      manager._spawnCompanion('companion_invalid');

      expect(Companion).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown companion: companion_invalid')
      );

      consoleSpy.mockRestore();
    });

    it('uses fallback texture if companion sprite not loaded', () => {
      scene.textures.exists.mockReturnValue(false);

      manager._spawnCompanion('companion_amira');

      expect(Companion).toHaveBeenCalledWith(
        scene,
        expect.any(Number),
        expect.any(Number),
        expect.objectContaining({
          key: 'npc-default', // Fallback
        })
      );
    });

    it('uses companion sprite key if texture exists', () => {
      scene.textures.exists.mockReturnValue(true);

      manager._spawnCompanion('companion_amira');

      expect(Companion).toHaveBeenCalledWith(
        scene,
        expect.any(Number),
        expect.any(Number),
        expect.objectContaining({
          key: 'companion_amira',
        })
      );
    });
  });

  describe('despawning', () => {
    beforeEach(() => {
      manager = new CompanionManager(scene);
      manager._spawnCompanion('companion_amira');
      vi.clearAllMocks();
    });

    it('despawns companion when exploration party slot cleared', () => {
      manager._despawnCompanion();

      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.COMPANION_FOLLOW_STOP,
        { companionId: 'companion_amira' }
      );
      expect(mockCompanionInstance.destroy).toHaveBeenCalled();
      expect(manager.activeCompanion).toBeNull();
      expect(manager.activeCompanionId).toBeNull();
    });
  });

  describe('party change handling', () => {
    beforeEach(() => {
      manager = new CompanionManager(scene);
    });

    it('handles party change event (swap companion)', () => {
      const spawnSpy = vi.spyOn(manager, '_spawnCompanion');

      // Simulate party change event
      const partyChangedHandler = EventBus.on.mock.calls.find(
        call => call[0] === EVENTS.COMPANION_PARTY_CHANGED
      )[1];

      partyChangedHandler({ slot: 'exploration', companionId: 'companion_amira' });

      expect(spawnSpy).toHaveBeenCalledWith('companion_amira');
    });

    it('ignores battle slot changes', () => {
      const spawnSpy = vi.spyOn(manager, '_spawnCompanion');

      const partyChangedHandler = EventBus.on.mock.calls.find(
        call => call[0] === EVENTS.COMPANION_PARTY_CHANGED
      )[1];

      partyChangedHandler({ slot: 'battle', companionId: 'companion_amira' });

      expect(spawnSpy).not.toHaveBeenCalled();
    });

    it('despawns when exploration slot cleared', () => {
      const despawnSpy = vi.spyOn(manager, '_despawnCompanion');

      const partyChangedHandler = EventBus.on.mock.calls.find(
        call => call[0] === EVENTS.COMPANION_PARTY_CHANGED
      )[1];

      partyChangedHandler({ slot: 'exploration', companionId: null });

      expect(despawnSpy).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      manager = new CompanionManager(scene);
    });

    it('calls companion.update and context.evaluateTriggers', () => {
      manager._spawnCompanion('companion_amira');
      vi.clearAllMocks();

      manager.update(1000, 16);

      expect(mockCompanionInstance.update).toHaveBeenCalledWith(1000, 16);
      expect(mockContextInstance.evaluateTriggers).toHaveBeenCalledWith('companion_amira', 1000);
    });

    it('does nothing if no active companion', () => {
      manager.update(1000, 16);

      expect(mockCompanionInstance.update).not.toHaveBeenCalled();
      expect(mockContextInstance.evaluateTriggers).not.toHaveBeenCalled();
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      manager = new CompanionManager(scene);
    });

    it('getActiveCompanion returns current companion', () => {
      manager._spawnCompanion('companion_amira');

      expect(manager.getActiveCompanion()).toBe(mockCompanionInstance);
    });

    it('getActiveCompanionId returns current ID', () => {
      manager._spawnCompanion('companion_amira');

      expect(manager.getActiveCompanionId()).toBe('companion_amira');
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      manager = new CompanionManager(scene);
      manager._spawnCompanion('companion_amira');
      vi.clearAllMocks();
    });

    it('cleans up EventBus listener and companion sprite', () => {
      manager.destroy();

      expect(EventBus.off).toHaveBeenCalledWith(
        EVENTS.COMPANION_PARTY_CHANGED,
        expect.any(Function)
      );
      expect(mockCompanionInstance.destroy).toHaveBeenCalled();
      expect(manager.activeCompanion).toBeNull();
      expect(manager.context).toBeNull();
    });
  });
});
