import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockScene } from './mocks/sceneMock.js';
import { NPCManager } from '../NPCManager.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';

// Mock dependencies
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
}));

vi.mock('../../../store/store.js', () => ({
  store: {
    getState: vi.fn(() => ({
      player: {
        onboardingTargetNpc: null
      },
      quests: {
        npcMarkers: {}
      },
      time: {
        totalGameMinutes: 480,
        dayNumber: 1,
        paused: false,
      },
      narrative: {
        storyFlags: {},
      },
    })),
    dispatch: vi.fn()
  }
}));

vi.mock('../../../store/slices/questSlice.js', () => ({
  selectNpcQuestMarkers: vi.fn((state) => state.quests.npcMarkers || {})
}));

vi.mock('../../../store/slices/timeSlice.js', () => ({
  selectGameTime: vi.fn(() => ({ hour: 8, minute: 0 }))
}));

vi.mock('../ScheduleEvaluator.js', () => ({
  shouldSpawnNpc: vi.fn(() => true),
  evaluateSchedule: vi.fn(() => null),
}));

vi.mock('../ActionSetExecutor.js', () => ({
  evaluateActionSets: vi.fn(() => []),
  executeActions: vi.fn(),
}));

vi.mock('../actionContext.js', () => ({
  buildActionContext: vi.fn(() => ({})),
}));

vi.mock('../../../data/npcsEnriched.js', () => ({
  default: [],
}));

vi.mock('../../sprites/NPC.js', () => ({
  NPC: class MockNPC {
    constructor(scene, x, y, config) {
      this.x = x;
      this.y = y;
      this.npcId = config.id;
      this.npcName = config.name;
      this.setInteractionHint = vi.fn();
      this.setQuestMarker = vi.fn();
      this.setOnboardingHighlight = vi.fn();
      this.startWander = vi.fn();
      this.startPatrol = vi.fn();
      this.update = vi.fn();
      this.setFlipX = vi.fn();
      this.stopMovement = vi.fn();
    }
    destroy() {}
  }
}));

describe('NPCManager', () => {
  let scene;
  let npcManager;
  let mockDomOverlay;
  let mockPlayerSprite;

  beforeEach(() => {
    scene = createMockScene();
    npcManager = new NPCManager(scene);

    mockDomOverlay = {
      createNpcLabel: vi.fn(),
      createInteractionPrompt: vi.fn(),
      setVisible: vi.fn(),
      updatePosition: vi.fn()
    };

    mockPlayerSprite = {
      x: 320,
      y: 320
    };

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create()', () => {
    it('should spawn NPCs from config', () => {
      const npcConfigs = [
        { id: 'npc1', x: 5, y: 5, key: 'elder', name: 'Elder', nameArabic: 'الشيخ' },
        { id: 'npc2', x: 10, y: 10, key: 'merchant', name: 'Merchant', nameArabic: 'التاجر' }
      ];

      npcManager.create(npcConfigs, mockPlayerSprite, null, mockDomOverlay);

      expect(npcManager.npcs).toHaveLength(2);
      expect(npcManager.npcs[0].npcId).toBe('npc1');
      expect(npcManager.npcs[1].npcId).toBe('npc2');

      // Verify NPC positions (converted from tile coords to pixels, centered in tile)
      expect(npcManager.npcs[0].x).toBe(352); // 5 * 64 + 32
      expect(npcManager.npcs[0].y).toBe(352);

      // Verify colliders created
      expect(scene.physics.add.collider).toHaveBeenCalledTimes(2);
    });

    it('should handle empty NPC config', () => {
      npcManager.create([], mockPlayerSprite, null, mockDomOverlay);

      expect(npcManager.npcs).toHaveLength(0);
    });
  });

  describe('update()', () => {
    let interactKey;
    let setInteractCooldown;

    beforeEach(() => {
      const npcConfigs = [
        { id: 'npc1', x: 5, y: 5, key: 'elder', name: 'Elder', nameArabic: 'الشيخ' }
      ];
      npcManager.create(npcConfigs, mockPlayerSprite, null, mockDomOverlay);

      interactKey = { isDown: false };
      setInteractCooldown = vi.fn();
    });

    it('should show interaction prompt when player is in range', async () => {
      const Phaser = await import('phaser');
      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(64); // Within INTERACT_RANGE (128)

      npcManager.update(mockPlayerSprite, mockDomOverlay, interactKey, false, setInteractCooldown);

      expect(npcManager.npcs[0].setInteractionHint).toHaveBeenCalledWith(true);
    });

    it('should hide interaction prompt when player is out of range', async () => {
      const Phaser = await import('phaser');
      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(200); // Beyond INTERACT_RANGE (128)

      npcManager.update(mockPlayerSprite, mockDomOverlay, interactKey, false, setInteractCooldown);

      expect(npcManager.npcs[0].setInteractionHint).toHaveBeenCalledWith(false);
    });

    it('should call npc.update() every frame', async () => {
      const Phaser = await import('phaser');
      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(200);

      npcManager.update(mockPlayerSprite, mockDomOverlay, interactKey, false, setInteractCooldown);

      expect(npcManager.npcs[0].update).toHaveBeenCalled();
    });

    it('should emit npc-interact event when player presses SPACE in range', async () => {
      const Phaser = await import('phaser');
      const { EventBus } = await import('../../../utils/eventBus.js');

      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(64);
      vi.spyOn(Phaser.default.Input.Keyboard, 'JustDown').mockReturnValue(true);

      npcManager.update(mockPlayerSprite, mockDomOverlay, interactKey, false, setInteractCooldown);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.NPC_INTERACT, {
        npcId: 'npc1',
        npcName: 'Elder'
      });
      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.PLAYER_FREEZE);
      expect(setInteractCooldown).toHaveBeenCalledWith(true);
      expect(scene.time.delayedCall).toHaveBeenCalledWith(500, expect.any(Function));
    });

    it('should not emit interaction when on cooldown', async () => {
      const Phaser = await import('phaser');
      const { EventBus } = await import('../../../utils/eventBus.js');

      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(64);
      vi.spyOn(Phaser.default.Input.Keyboard, 'JustDown').mockReturnValue(true);

      npcManager.update(mockPlayerSprite, mockDomOverlay, interactKey, true, setInteractCooldown);

      expect(EventBus.emit).not.toHaveBeenCalledWith(EVENTS.NPC_INTERACT, expect.any(Object));
    });

    it('should apply quest markers from Redux state', async () => {
      const { selectNpcQuestMarkers } = await import('../../../store/slices/questSlice.js');

      selectNpcQuestMarkers.mockReturnValue({ npc1: 'exclamation' });

      const Phaser = await import('phaser');
      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(64);

      npcManager.update(mockPlayerSprite, mockDomOverlay, interactKey, false, setInteractCooldown);

      expect(npcManager.npcs[0].setQuestMarker).toHaveBeenCalledWith('exclamation');
    });

    it('should apply onboarding highlight when NPC is target', async () => {
      const { store } = await import('../../../store/store.js');

      store.getState.mockReturnValue({
        player: { onboardingTargetNpc: 'npc1' },
        quests: { npcMarkers: {} },
        time: { totalGameMinutes: 480, dayNumber: 1, paused: false },
        narrative: { storyFlags: {} },
      });

      const Phaser = await import('phaser');
      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(64);

      npcManager.update(mockPlayerSprite, mockDomOverlay, interactKey, false, setInteractCooldown);

      expect(npcManager.npcs[0].setOnboardingHighlight).toHaveBeenCalledWith(true);
    });
  });

  describe('getNPCs()', () => {
    it('should return all spawned NPCs', () => {
      const npcConfigs = [
        { id: 'npc1', x: 5, y: 5, key: 'elder', name: 'Elder', nameArabic: 'الشيخ' }
      ];
      npcManager.create(npcConfigs, mockPlayerSprite, null, mockDomOverlay);

      const npcs = npcManager.getNPCs();
      expect(npcs).toHaveLength(1);
      expect(npcs[0].npcId).toBe('npc1');
    });
  });

  describe('destroy()', () => {
    it('should destroy all NPCs and clear array', () => {
      const npcConfigs = [
        { id: 'npc1', x: 5, y: 5, key: 'elder', name: 'Elder', nameArabic: 'الشيخ' }
      ];
      npcManager.create(npcConfigs, mockPlayerSprite, null, mockDomOverlay);

      const npcDestroySpy = vi.spyOn(npcManager.npcs[0], 'destroy');

      npcManager.destroy();

      expect(npcDestroySpy).toHaveBeenCalled();
      expect(npcManager.npcs).toHaveLength(0);
    });
  });
});
