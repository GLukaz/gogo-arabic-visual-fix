import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockScene } from './mocks/sceneMock.js';
import { PlayerController } from '../PlayerController.js';

// Mock Player sprite
vi.mock('../../sprites/Player.js', () => ({
  Player: class MockPlayer {
    constructor(scene, x, y) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.setCollideWorldBounds = vi.fn().mockReturnThis();
      this.update = vi.fn();
      this.freeze = vi.fn();
      this.unfreeze = vi.fn();
      this.destroy = vi.fn();
    }
  }
}));

describe('PlayerController', () => {
  let scene;
  let playerController;

  beforeEach(() => {
    scene = createMockScene({
      currentMapW: 20,
      currentMapH: 15
    });
    playerController = new PlayerController(scene);
  });

  describe('create()', () => {
    it('should create player sprite at spawn position', () => {
      const spawnX = 320;
      const spawnY = 320;
      const mockWallGroup = {};

      const player = playerController.create(spawnX, spawnY, mockWallGroup);

      expect(player).toBeDefined();
      expect(player.x).toBe(spawnX);
      expect(player.y).toBe(spawnY);
      expect(playerController.player).toBe(player);
    });

    it('should setup collision with wall group', () => {
      const mockWallGroup = { id: 'walls' };

      const player = playerController.create(320, 320, mockWallGroup);

      expect(scene.physics.add.collider).toHaveBeenCalledWith(player, mockWallGroup);
    });

    it('should configure world bounds based on map size', () => {
      scene.currentMapW = 20;
      scene.currentMapH = 15;

      const player = playerController.create(320, 320, {});

      const expectedWidth = 20 * 64; // 1280
      const expectedHeight = 15 * 64; // 960

      expect(scene.physics.world.setBounds).toHaveBeenCalledWith(0, 0, expectedWidth, expectedHeight);
      expect(player.setCollideWorldBounds).toHaveBeenCalledWith(true);
    });

    it('should return the player sprite', () => {
      const player = playerController.create(320, 320, {});

      expect(player).toBe(playerController.player);
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      playerController.create(320, 320, {});
    });

    it('should call player.update() when player exists', () => {
      playerController.update();

      expect(playerController.player.update).toHaveBeenCalled();
    });

    it('should not throw error when player is null', () => {
      playerController.player = null;

      expect(() => playerController.update()).not.toThrow();
    });
  });

  describe('freeze()', () => {
    it('should freeze player movement', () => {
      playerController.create(320, 320, {});

      playerController.freeze();

      expect(playerController.player.freeze).toHaveBeenCalled();
    });

    it('should not throw error when player is null', () => {
      playerController.player = null;

      expect(() => playerController.freeze()).not.toThrow();
    });
  });

  describe('unfreeze()', () => {
    it('should unfreeze player movement', () => {
      playerController.create(320, 320, {});

      playerController.unfreeze();

      expect(playerController.player.unfreeze).toHaveBeenCalled();
    });

    it('should not throw error when player is null', () => {
      playerController.player = null;

      expect(() => playerController.unfreeze()).not.toThrow();
    });
  });

  describe('getPlayer()', () => {
    it('should return player sprite reference', () => {
      const player = playerController.create(320, 320, {});

      expect(playerController.getPlayer()).toBe(player);
    });

    it('should return null when player not created', () => {
      expect(playerController.getPlayer()).toBeNull();
    });
  });

  describe('destroy()', () => {
    it('should destroy player sprite and set to null', () => {
      const player = playerController.create(320, 320, {});

      playerController.destroy();

      expect(player.destroy).toHaveBeenCalled();
      expect(playerController.player).toBeNull();
    });

    it('should not throw error when player already null', () => {
      playerController.player = null;

      expect(() => playerController.destroy()).not.toThrow();
    });
  });
});
