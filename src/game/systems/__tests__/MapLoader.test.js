import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockScene } from './mocks/sceneMock.js';
import { MapLoader } from '../MapLoader.js';

// Mock ReplaceColorPipeline to avoid Phaser dependency
vi.mock('../ReplaceColorPipeline.js', () => ({
  default: class ReplaceColorPipeline {
    constructor(game) {
      this.game = game;
    }
  },
}));

// Mock zone data constants
vi.mock('../../../data/zones.js', () => ({
  TILE: 64,
  SAND: 0,
  GRASS: 1,
  WATER: 2,
  ICE_GRASS: 3,
  STONE: 4,
  WOOD: 5,
  ZONES: {},
  ZONE_ORDER: [],
}));

describe('MapLoader', () => {
  let scene;
  let mapLoader;

  beforeEach(() => {
    scene = createMockScene();
    mapLoader = new MapLoader(scene);
  });

  describe('create()', () => {
    it('should create wall collision group', () => {
      const mockZone = {
        buildMap: vi.fn(() => [[1, 1], [1, 1]]),
        objects: [],
        exits: []
      };

      const wallGroup = mapLoader.create(mockZone, 2, 2);

      expect(scene.physics.add.staticGroup).toHaveBeenCalled();
      expect(wallGroup).toBeDefined();
    });

    it('should render ground tiles based on zone data', () => {
      const mockZone = {
        buildMap: vi.fn(() => [
          [1, 2], // GRASS, WATER
          [3, 1]  // ICE_GRASS, GRASS
        ]),
        objects: [],
        exits: []
      };

      mapLoader.create(mockZone, 2, 2);

      // Should create 4 ground sprites (one per tile) + water edge effects
      expect(scene.add.image).toHaveBeenCalled();
      expect(mapLoader.groundSprites.length).toBeGreaterThanOrEqual(4);
    });

    it('should place objects with Y-sorting', () => {
      const mockZone = {
        buildMap: vi.fn(() => [[1]]),
        objects: [
          { x: 5, y: 10, key: 'tree', collide: false },
          { x: 3, y: 5, key: 'rock', collide: false }
        ],
        exits: []
      };

      mapLoader.create(mockZone, 1, 1);

      // Objects should be sorted by Y before placement
      expect(mapLoader.objectSprites).toHaveLength(2);
    });

    it('should create collision for objects with collide flag', () => {
      const mockZone = {
        buildMap: vi.fn(() => [[1]]),
        objects: [
          { x: 5, y: 5, key: 'tree', collide: true, collideW: 40, collideH: 20 }
        ],
        exits: []
      };

      mapLoader.create(mockZone, 1, 1);

      // Wall group should have collision object created
      const wallGroup = mapLoader.wallGroup;
      expect(wallGroup.create).toHaveBeenCalled();
    });

    it('should create exit triggers with signposts', () => {
      const groundData = Array(15).fill(null).map(() => Array(15).fill(1));
      const mockZone = {
        buildMap: vi.fn(() => groundData),
        objects: [],
        exits: [
          { edge: 'north', tileRange: [5, 7], label: 'Market', labelArabic: 'السوق' }
        ]
      };

      mapLoader.create(mockZone, 15, 15);

      expect(mapLoader.exitTriggers).toHaveLength(1);
      expect(mapLoader.exitTriggers[0].edge).toBe('north');
      expect(mapLoader.exitTriggers[0].sprite).toBeDefined();
      expect(mapLoader.exitTriggers[0].label).toBeDefined(); // label is text sprite
    });

    it('should add water collision for water tiles', () => {
      const mockZone = {
        buildMap: vi.fn(() => [
          [1, 2], // GRASS, WATER
          [2, 1]  // WATER, GRASS
        ]),
        objects: [],
        exits: []
      };

      mapLoader.create(mockZone, 2, 2);

      // Wall group should have water collision created
      const wallGroup = mapLoader.wallGroup;
      // 2 water tiles + border walls
      expect(wallGroup.create).toHaveBeenCalled();
    });
  });

  describe('renderGroundTiles()', () => {
    it('should render GRASS tiles', () => {
      const groundData = [[1]]; // GRASS

      mapLoader.renderGroundTiles(groundData, 1, 1);

      expect(scene.add.image).toHaveBeenCalledWith(32, 32, 'tile-grass');
      expect(mapLoader.groundSprites).toHaveLength(1);
    });

    it('should render WATER tiles with tint', () => {
      const groundData = [[2]]; // WATER

      mapLoader.renderGroundTiles(groundData, 1, 1);

      expect(scene.add.image).toHaveBeenCalledWith(32, 32, 'tile-sand');
      // Note: actual tint application happens on the returned mock sprite
      expect(mapLoader.groundSprites).toHaveLength(1);
    });

    it('should render ICE_GRASS tiles', () => {
      const groundData = [[3]]; // ICE_GRASS

      mapLoader.renderGroundTiles(groundData, 1, 1);

      expect(scene.add.image).toHaveBeenCalledWith(32, 32, 'grass-ice');
      expect(mapLoader.groundSprites).toHaveLength(1);
    });

    it('should render default sand tiles for unknown types', () => {
      const groundData = [[0]]; // Unknown type

      mapLoader.renderGroundTiles(groundData, 1, 1);

      expect(scene.add.image).toHaveBeenCalledWith(32, 32, 'tile-sand');
      expect(mapLoader.groundSprites).toHaveLength(1);
    });
  });

  describe('addWaterEdgeEffect()', () => {
    it('should add shimmer effect to water edges adjacent to land', () => {
      const groundData = [
        [1, 2], // GRASS, WATER
        [1, 1]
      ];

      mapLoader.addWaterEdgeEffect(groundData, 2, 2);

      // Water at (1, 0) is adjacent to grass at (0, 0)
      expect(scene.add.rectangle).toHaveBeenCalled();
      expect(scene.tweens.add).toHaveBeenCalled();
    });

    it('should only add shimmer to water edges adjacent to land', () => {
      const groundData = [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2]
      ];

      mapLoader.addWaterEdgeEffect(groundData, 3, 3);

      // All water tiles with no land neighbors should not get shimmer
      // This grid has no land, so no shimmer effects should be added
      // (edge tiles are out of bounds, not land)
      expect(scene.add.rectangle).not.toHaveBeenCalled();
    });
  });

  describe('buildExitEdgeSet()', () => {
    it('should build set of edge tiles with exits', () => {
      const exits = [
        { edge: 'north', tileRange: [5, 7] },
        { edge: 'south', tileRange: [10, 12] }
      ];

      const edgeSet = mapLoader.buildExitEdgeSet(exits, 20, 15);

      expect(edgeSet.has('north:5')).toBe(true);
      expect(edgeSet.has('north:6')).toBe(true);
      expect(edgeSet.has('north:7')).toBe(true);
      expect(edgeSet.has('south:10')).toBe(true);
      expect(edgeSet.has('south:11')).toBe(true);
      expect(edgeSet.has('south:12')).toBe(true);
      expect(edgeSet.has('north:8')).toBe(false);
    });

    it('should handle empty exits array', () => {
      const edgeSet = mapLoader.buildExitEdgeSet([], 20, 15);

      expect(edgeSet.size).toBe(0);
    });
  });

  describe('addInvisibleWall()', () => {
    it('should create invisible collision wall at position', () => {
      const mockZone = {
        buildMap: vi.fn(() => [[1]]),
        objects: [],
        exits: []
      };
      mapLoader.create(mockZone, 1, 1);

      mapLoader.addInvisibleWall(100, 200, 64, 64);

      expect(mapLoader.wallGroup.create).toHaveBeenCalled();
    });
  });

  describe('getGroundSprites()', () => {
    it('should return ground sprite array', () => {
      const mockZone = {
        buildMap: vi.fn(() => [[1, 1]]),
        objects: [],
        exits: []
      };
      mapLoader.create(mockZone, 2, 1);

      const sprites = mapLoader.getGroundSprites();
      expect(Array.isArray(sprites)).toBe(true);
      expect(sprites.length).toBeGreaterThan(0);
    });
  });

  describe('getObjectSprites()', () => {
    it('should return object sprite array', () => {
      const mockZone = {
        buildMap: vi.fn(() => [[1]]),
        objects: [
          { x: 5, y: 5, key: 'tree', collide: false }
        ],
        exits: []
      };
      mapLoader.create(mockZone, 1, 1);

      const sprites = mapLoader.getObjectSprites();
      expect(Array.isArray(sprites)).toBe(true);
      expect(sprites).toHaveLength(1);
    });
  });

  describe('getExitTriggers()', () => {
    it('should return exit trigger array', () => {
      const groundData = Array(15).fill(null).map(() => Array(15).fill(1));
      const mockZone = {
        buildMap: vi.fn(() => groundData),
        objects: [],
        exits: [
          { edge: 'north', tileRange: [5, 7], label: 'Market', labelArabic: 'السوق' }
        ]
      };
      mapLoader.create(mockZone, 15, 15);

      const triggers = mapLoader.getExitTriggers();
      expect(Array.isArray(triggers)).toBe(true);
      expect(triggers).toHaveLength(1);
      expect(triggers[0].edge).toBe('north');
      expect(triggers[0].sprite).toBeDefined();
      expect(triggers[0].label).toBeDefined(); // label is the text sprite object
    });
  });

  describe('destroy()', () => {
    it('should destroy all map elements and clear arrays', () => {
      const groundData = Array(15).fill(null).map(() => Array(15).fill(1));
      const mockZone = {
        buildMap: vi.fn(() => groundData),
        objects: [
          { x: 5, y: 5, key: 'tree', collide: false }
        ],
        exits: [
          { edge: 'north', tileRange: [5, 7], label: 'Market', labelArabic: 'السوق' }
        ]
      };
      mapLoader.create(mockZone, 15, 15);

      mapLoader.destroy();

      expect(mapLoader.groundSprites).toHaveLength(0);
      expect(mapLoader.objectSprites).toHaveLength(0);
      expect(mapLoader.exitTriggers).toHaveLength(0);
      expect(mapLoader.wallGroup).toBeNull();
    });

    it('should stop all active tweens', () => {
      const mockZone = {
        buildMap: vi.fn(() => [[1, 2]]), // Has water for tweens
        objects: [],
        exits: []
      };
      mapLoader.create(mockZone, 2, 1);

      const tween = { remove: vi.fn() };
      mapLoader.activeTweens.push(tween);

      mapLoader.destroy();

      expect(tween.remove).toHaveBeenCalled();
      expect(mapLoader.activeTweens).toHaveLength(0);
    });
  });
});
