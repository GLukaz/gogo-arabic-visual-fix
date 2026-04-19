import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockScene } from './mocks/sceneMock.js';
import { SceneStackManager } from '../SceneStackManager.js';

describe('SceneStackManager', () => {
  let scene;
  let manager;

  beforeEach(() => {
    scene = createMockScene();
    manager = new SceneStackManager(scene);
  });

  it('pushScene pauses current scene and launches interior with returnSceneKey', () => {
    manager.pushScene('InteriorScene', { buildingId: 'shop' });

    expect(scene.scene.pause).toHaveBeenCalled();
    expect(scene.scene.launch).toHaveBeenCalledWith('InteriorScene', {
      buildingId: 'shop',
      returnSceneKey: 'TestScene',
    });
  });

  it('popScene stops interior scene and resumes parent scene', () => {
    const interiorScene = {
      scene: { key: 'InteriorScene', stop: vi.fn() },
    };
    scene.sys.scene.manager.getActiveScenes.mockReturnValue([scene, interiorScene]);

    manager.pushScene('InteriorScene');
    const result = manager.popScene();

    expect(interiorScene.scene.stop).toHaveBeenCalled();
    expect(scene.scene.resume).toHaveBeenCalled();
    expect(result).toBe('TestScene');
  });

  it('popScene on empty stack returns null without crashing', () => {
    const result = manager.popScene();

    expect(result).toBeNull();
    expect(scene.scene.resume).not.toHaveBeenCalled();
  });

  it('isInBuilding returns true after push, false after pop', () => {
    expect(manager.isInBuilding).toBe(false);

    manager.pushScene('InteriorScene');
    expect(manager.isInBuilding).toBe(true);

    scene.sys.scene.manager.getActiveScenes.mockReturnValue([scene]);
    manager.popScene();
    expect(manager.isInBuilding).toBe(false);
  });

  it('depth tracks stack size correctly', () => {
    expect(manager.depth).toBe(0);

    manager.pushScene('SceneA');
    expect(manager.depth).toBe(1);

    manager.pushScene('SceneB');
    expect(manager.depth).toBe(2);

    scene.sys.scene.manager.getActiveScenes.mockReturnValue([scene]);
    manager.popScene();
    expect(manager.depth).toBe(1);
  });

  it('destroy pops all remaining scenes', () => {
    scene.sys.scene.manager.getActiveScenes.mockReturnValue([scene]);

    manager.pushScene('SceneA');
    manager.pushScene('SceneB');
    expect(manager.depth).toBe(2);

    manager.destroy();
    expect(manager.depth).toBe(0);
    expect(scene.scene.resume).toHaveBeenCalledTimes(2);
  });

  it('multiple push/pop cycles work correctly', () => {
    const interiorA = { scene: { key: 'SceneA', stop: vi.fn() } };
    const interiorB = { scene: { key: 'SceneB', stop: vi.fn() } };

    // Push A
    manager.pushScene('SceneA');
    expect(manager.depth).toBe(1);

    // Push B (nested)
    manager.pushScene('SceneB');
    expect(manager.depth).toBe(2);

    // Pop B
    scene.sys.scene.manager.getActiveScenes.mockReturnValue([scene, interiorB]);
    manager.popScene();
    expect(manager.depth).toBe(1);
    expect(interiorB.scene.stop).toHaveBeenCalled();

    // Pop A
    scene.sys.scene.manager.getActiveScenes.mockReturnValue([scene, interiorA]);
    manager.popScene();
    expect(manager.depth).toBe(0);
    expect(interiorA.scene.stop).toHaveBeenCalled();
  });
});
