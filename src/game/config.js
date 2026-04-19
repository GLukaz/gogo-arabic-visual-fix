import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { WorldScene } from './scenes/WorldScene.js';
import { InteriorScene } from './scenes/InteriorScene.js';
import { BattleScene } from './scenes/BattleScene.js';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const gameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, WorldScene, InteriorScene, BattleScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'phaser-container',
    // Mobile-friendly scaling
    min: {
      width: 320,
      height: 240,
    },
    max: {
      width: GAME_WIDTH * 2,
      height: GAME_HEIGHT * 2,
    },
  },
  backgroundColor: '#1A1A2E',
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  // Input configuration
  input: {
    // Listen for keyboard events on window instead of canvas.
    // This prevents movement from stopping when React overlays steal
    // DOM focus from the Phaser canvas element.
    keyboard: {
      target: window,       // listen on window so React overlays can't steal focus
    },
    touch: {
      capture: true,
    },
  },
  disableVisibilityChange: true,  // Prevent game loop halt on tab focus loss
};
