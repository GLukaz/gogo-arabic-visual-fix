import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './config.js';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';

export const PhaserGame = forwardRef(function PhaserGame({ onSceneReady }, ref) {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    game: gameRef.current,
    scene: gameRef.current?.scene?.getScene('WorldScene'),
  }));

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      ...gameConfig,
      parent: containerRef.current,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    // Expose for debugging (dev only)
    if (import.meta.env.DEV) {
      window.__PHASER_GAME__ = game;
    }

    // When WorldScene is ready, notify parent
    EventBus.once(EVENTS.SCENE_READY, () => {
      if (onSceneReady) onSceneReady(game.scene.getScene('WorldScene'));
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Container fills parent, Phaser scales inside
  return (
    <div
      ref={containerRef}
      id="phaser-container"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
});
