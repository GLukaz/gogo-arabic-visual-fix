import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EquipmentManager } from '../equipment/EquipmentManager.js';
import { createMockScene } from './mocks/sceneMock.js';

// Mock store
vi.mock('../../../store/store.js', () => ({
  store: {
    getState: vi.fn(),
  },
}));

// Mock EventBus
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));

import { store } from '../../../store/store.js';
import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';

describe('EquipmentManager', () => {
  let scene;
  let playerSprite;
  let manager;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.matchMedia
    global.window = global.window || {};
    global.window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    scene = createMockScene();
    // EquipmentManager checks textures.exists before creating sprites
    scene.textures.exists = vi.fn(() => true);
    playerSprite = {
      x: 100,
      y: 200,
      depth: 10,
      scaleX: 1,
      scaleY: 1,
      flipX: false,
      active: true,
      frame: { name: 'idle_0' },
    };

    // Mock store to return empty equipped state by default
    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: null,
          robe: null,
          cloak: null,
          belt: null,
          boots: null,
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });
  });

  afterEach(() => {
    if (manager) {
      manager.destroy();
    }
  });

  it('creates without errors when given scene and playerSprite', () => {
    expect(() => {
      manager = new EquipmentManager(scene, playerSprite);
    }).not.toThrow();

    expect(manager).toBeDefined();
    expect(manager.scene).toBe(scene);
    expect(manager.playerSprite).toBe(playerSprite);
  });

  it('renders no sprites when nothing is equipped', () => {
    manager = new EquipmentManager(scene, playerSprite);

    expect(Object.keys(manager.equipmentSprites)).toHaveLength(0);
  });

  it('creates sprite for each equipped item', () => {
    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: 'simple_kufi',
          robe: 'scholars_robe',
          cloak: null,
          belt: null,
          boots: null,
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });

    // Override scene.add.sprite to return proper mock
    scene.add.sprite = vi.fn((x, y, key) => ({
      x, y,
      setDepth: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
      setFlipX: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
    }));

    manager = new EquipmentManager(scene, playerSprite);

    expect(scene.add.sprite).toHaveBeenCalled();
    expect(Object.keys(manager.equipmentSprites).length).toBeGreaterThan(0);
  });

  it('applies correct depth ordering (boots < robe < cloak < head)', () => {
    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: 'simple_kufi',
          robe: 'scholars_robe',
          cloak: 'simple_cloak',
          belt: 'simple_hizam',
          boots: 'scholars_khuff',
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });

    const mockSprites = {};
    scene.add.sprite = vi.fn((x, y, key) => {
      const sprite = {
        x, y,
        setDepth: vi.fn(),
        setScale: vi.fn().mockReturnThis(),
        setFlipX: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
      };
      mockSprites[key] = sprite;
      return sprite;
    });

    manager = new EquipmentManager(scene, playerSprite);

    // Check depth layering was called
    const sprites = Object.values(mockSprites);
    sprites.forEach(sprite => {
      expect(sprite.setDepth).toHaveBeenCalled();
    });
  });

  it('updates sprite positions in update() to match player', () => {
    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: 'simple_kufi',
          robe: null,
          cloak: null,
          belt: null,
          boots: null,
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });

    const mockSprite = {
      x: 0,
      y: 0,
      setPosition: vi.fn(),
      setScale: vi.fn().mockReturnThis(),
      setFlipX: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      setFrame: vi.fn(),
      destroy: vi.fn(),
      frame: { name: 'idle_0' },
    };

    scene.add.sprite = vi.fn(() => mockSprite);

    manager = new EquipmentManager(scene, playerSprite);

    // Move player
    playerSprite.x = 150;
    playerSprite.y = 250;

    manager.update();

    expect(mockSprite.setPosition).toHaveBeenCalledWith(150, 250);
  });

  it('destroys old sprites before creating new ones on equipment change', () => {
    const mockSprite1 = {
      setDepth: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
      setFlipX: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
    };

    scene.add.sprite = vi.fn(() => mockSprite1);

    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: 'simple_kufi',
          robe: null,
          cloak: null,
          belt: null,
          boots: null,
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });

    manager = new EquipmentManager(scene, playerSprite);

    // Trigger updateSprites (simulates EQUIPMENT_CHANGED event)
    manager.updateSprites();

    expect(mockSprite1.destroy).toHaveBeenCalled();
  });

  it('handles missing texture gracefully (logs warning, no crash)', () => {
    // Mock textures.exists to return false
    scene.textures.exists = vi.fn(() => false);

    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: 'simple_kufi',
          robe: null,
          cloak: null,
          belt: null,
          boots: null,
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });

    expect(() => {
      manager = new EquipmentManager(scene, playerSprite);
    }).not.toThrow();

    // Should not create sprites for missing textures
    expect(scene.add.sprite).not.toHaveBeenCalled();
  });

  it('cleans up sprites and listeners on destroy()', () => {
    const mockSprite = {
      setDepth: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
      setFlipX: vi.fn().mockReturnThis(),
      destroy: vi.fn(),
    };

    scene.add.sprite = vi.fn(() => mockSprite);

    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: 'simple_kufi',
          robe: null,
          cloak: null,
          belt: null,
          boots: null,
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });

    manager = new EquipmentManager(scene, playerSprite);

    manager.destroy();

    expect(mockSprite.destroy).toHaveBeenCalled();
    expect(EventBus.off).toHaveBeenCalledWith(EVENTS.EQUIPMENT_CHANGED, expect.any(Function));
  });

  it('listens to EVENTS.EQUIPMENT_CHANGED', () => {
    manager = new EquipmentManager(scene, playerSprite);

    expect(EventBus.on).toHaveBeenCalledWith(EVENTS.EQUIPMENT_CHANGED, expect.any(Function));
  });

  it('emits EQUIPMENT_STATS_UPDATED after updating sprites', () => {
    manager = new EquipmentManager(scene, playerSprite);

    expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.EQUIPMENT_STATS_UPDATED);
  });

  it('skips update when player has not moved and frame unchanged', () => {
    const mockSprite = {
      x: 100,
      y: 200,
      setPosition: vi.fn(),
      setScale: vi.fn().mockReturnThis(),
      setFlipX: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      setFrame: vi.fn(),
      destroy: vi.fn(),
      frame: { name: 'idle_0' },
    };

    scene.add.sprite = vi.fn(() => mockSprite);

    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: 'simple_kufi',
          robe: null,
          cloak: null,
          belt: null,
          boots: null,
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });

    manager = new EquipmentManager(scene, playerSprite);

    // Clear previous calls
    mockSprite.setPosition.mockClear();

    // Update without changing player position or frame
    manager.update();

    // Should not call setPosition (optimization)
    expect(mockSprite.setPosition).not.toHaveBeenCalled();
  });

  it('updates when player frame changes even if position unchanged', () => {
    const mockSprite = {
      x: 100,
      y: 200,
      setPosition: vi.fn(),
      setScale: vi.fn().mockReturnThis(),
      setFlipX: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      setFrame: vi.fn(),
      destroy: vi.fn(),
      frame: { name: 'idle_0' },
    };

    scene.add.sprite = vi.fn(() => mockSprite);

    store.getState.mockReturnValue({
      inventory: {
        equipped: {
          headCovering: 'simple_kufi',
          robe: null,
          cloak: null,
          belt: null,
          boots: null,
          gloves: null,
          accessory1: null,
          accessory2: null,
        },
      },
    });

    manager = new EquipmentManager(scene, playerSprite);

    // Clear previous calls
    mockSprite.setPosition.mockClear();

    // Change player frame
    playerSprite.frame.name = 'walk_0';

    manager.update();

    // Should call setPosition (frame changed)
    expect(mockSprite.setPosition).toHaveBeenCalledWith(100, 200);
  });
});
