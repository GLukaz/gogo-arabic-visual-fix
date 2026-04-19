import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';
import 'fake-indexeddb/auto';

// Ensure window.indexedDB is set for adapter (fake-indexeddb/auto sets global.indexedDB)
if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
  window.indexedDB = indexedDB;
  window.IDBKeyRange = IDBKeyRange;
  window.IDBCursor = IDBCursor;
  window.IDBDatabase = IDBDatabase;
  window.IDBIndex = IDBIndex;
  window.IDBObjectStore = IDBObjectStore;
  window.IDBRequest = IDBRequest;
  window.IDBTransaction = IDBTransaction;
}

// Mock window.matchMedia — not implemented in jsdom; required for components
// that use prefers-reduced-motion at module level (e.g. StatusEffectBar.jsx)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Mock Phaser module to prevent loading errors
vi.mock('phaser', () => ({
  default: {
    Events: {
      EventEmitter: class EventEmitter {
        constructor() {
          this.events = {};
        }
        on(event, fn) {
          if (!this.events[event]) this.events[event] = [];
          this.events[event].push(fn);
        }
        emit(event, ...args) {
          if (this.events[event]) {
            this.events[event].forEach(fn => fn(...args));
          }
        }
        removeAllListeners() {
          this.events = {};
        }
      }
    },
    Game: class Game {
      constructor() {}
      destroy() {}
    },
    Scene: class Scene {},
    AUTO: 'AUTO',
  },
}));

// Mock HTMLCanvasElement for Phaser
HTMLCanvasElement.prototype.getContext = () => ({
  fillStyle: '',
  fillRect: () => {},
  clearRect: () => {},
  getImageData: () => ({ data: [] }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {},
  arc: () => {},
  fill: () => {},
  measureText: () => ({ width: 0 }),
  transform: () => {},
  rect: () => {},
  clip: () => {},
});

// Mock Howler audio library
global.Howl = class Howl {
  constructor() {}
  play() {}
  stop() {}
  pause() {}
  volume() {}
  fade() {}
  on() {}
};

global.Howler = {
  mute: () => {},
  volume: () => {},
  stop: () => {},
};

// Mock Phaser
global.Phaser = {
  Game: class Game {
    constructor() {}
    destroy() {}
  },
  Scene: class Scene {},
  AUTO: 'AUTO',
  Events: {
    EventEmitter: class EventEmitter {
      constructor() {
        this.events = {};
      }
      on(event, fn) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(fn);
      }
      emit(event, ...args) {
        if (this.events[event]) {
          this.events[event].forEach(fn => fn(...args));
        }
      }
      removeAllListeners() {
        this.events = {};
      }
    }
  }
};

// Set up fake timers with fixed date to prevent test flakiness
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-02-09T00:00:00Z'));
});

// Clean up after each test
afterEach(async () => {
  // EventBus cleanup - dynamically import to use mocked version
  const { EventBus } = await import('../utils/eventBus.js');
  if (EventBus && EventBus.removeAllListeners) {
    EventBus.removeAllListeners();
  }

  // Clean up IndexedDB between tests
  // Delete all test databases to ensure clean state
  if (typeof indexedDB !== 'undefined') {
    // Delete adapter test database
    indexedDB.deleteDatabase('gogo-arabic-idb');
    // Delete persist test databases
    indexedDB.deleteDatabase('gogo-arabic-vocabulary');
    indexedDB.deleteDatabase('gogo-arabic-battle');
  }

  vi.clearAllMocks();
  vi.useRealTimers();
});
