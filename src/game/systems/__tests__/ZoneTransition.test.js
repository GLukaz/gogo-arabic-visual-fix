import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockScene } from './mocks/sceneMock.js';
import ZoneTransition from '../ZoneTransition.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';

// Mock EventBus
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
}));

describe('ZoneTransition', () => {
  let scene;
  let zoneTransition;

  beforeEach(() => {
    scene = createMockScene();
    scene.loadZone = vi.fn(); // Mock WorldScene's loadZone method
    zoneTransition = new ZoneTransition(scene);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with transitioning flag set to false', () => {
      expect(zoneTransition.transitioning).toBe(false);
    });

    it('should store scene reference', () => {
      expect(zoneTransition.scene).toBe(scene);
    });
  });

  describe('transitionTo()', () => {
    it('should freeze player during transition', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');

      await zoneTransition.transitionTo('market', 10, 10);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.PLAYER_FREEZE);
    });

    it('should fade out camera before zone change', async () => {
      await zoneTransition.transitionTo('market', 10, 10);

      expect(scene.cameras.main.fadeOut).toHaveBeenCalledWith(500, 0, 0, 0);
    });

    it('should emit zone-change event with new zone name and spawn coords', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');

      await zoneTransition.transitionTo('market', 10, 15);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.ZONE_CHANGE, {
        zone: 'market',
        x: 10,
        y: 15
      });
    });

    it('should call scene.loadZone with correct parameters', async () => {
      await zoneTransition.transitionTo('market', 10, 15);

      expect(scene.loadZone).toHaveBeenCalledWith('market', 10, 15);
    });

    it('should fade in camera after zone loads', async () => {
      await zoneTransition.transitionTo('market', 10, 10);

      expect(scene.cameras.main.fadeIn).toHaveBeenCalledWith(500, 0, 0, 0);
    });

    it('should unfreeze player after transition completes', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');

      await zoneTransition.transitionTo('market', 10, 10);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.PLAYER_UNFREEZE);
    });

    it('should set transitioning flag during transition', async () => {
      const transitionPromise = zoneTransition.transitionTo('market', 10, 10);

      expect(zoneTransition.transitioning).toBe(true);

      await transitionPromise;

      expect(zoneTransition.transitioning).toBe(false);
    });

    it('should prevent concurrent transitions', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');

      // Start first transition
      const firstTransition = zoneTransition.transitionTo('market', 10, 10);

      // Immediately try second transition (should be blocked)
      await zoneTransition.transitionTo('oasis', 5, 5);

      // Second transition should not emit events or call loadZone
      expect(EventBus.emit).not.toHaveBeenCalledWith(EVENTS.ZONE_CHANGE, {
        zone: 'oasis',
        x: 5,
        y: 5
      });

      await firstTransition;
    });

    it('should handle zone transition sequence correctly', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');

      await zoneTransition.transitionTo('market', 10, 10);

      // Verify event emission order
      const calls = EventBus.emit.mock.calls;
      const freezeIndex = calls.findIndex(call => call[0] === EVENTS.PLAYER_FREEZE);
      const zoneChangeIndex = calls.findIndex(call => call[0] === EVENTS.ZONE_CHANGE);
      const unfreezeIndex = calls.findIndex(call => call[0] === EVENTS.PLAYER_UNFREEZE);

      expect(freezeIndex).toBeLessThan(zoneChangeIndex);
      expect(zoneChangeIndex).toBeLessThan(unfreezeIndex);
    });

    it('should use camera once listeners for fade callbacks', async () => {
      await zoneTransition.transitionTo('market', 10, 10);

      // Verify camera.once was called for both fade events
      expect(scene.cameras.main.once).toHaveBeenCalledWith('camerafadeoutcomplete', expect.any(Function));
      expect(scene.cameras.main.once).toHaveBeenCalledWith('camerafadeincomplete', expect.any(Function));
    });
  });
});
