import Phaser from 'phaser';

/**
 * Shared event emitter for Phaser ↔ React communication.
 *
 * Phaser scenes emit events (e.g. 'npc-interact', 'chest-opened'),
 * React components listen and respond (e.g. show dialogue, update UI).
 *
 * React components emit events (e.g. 'quiz-complete', 'unfreeze-player'),
 * Phaser scenes listen and react (e.g. resume player movement).
 */
export const EventBus = new Phaser.Events.EventEmitter();
