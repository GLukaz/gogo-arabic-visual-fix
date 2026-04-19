import { describe, it, expect, beforeEach, vi } from 'vitest';

// Must be hoisted before AudioManager import
let mockHowlInstances = [];

vi.mock('howler', () => {
  class MockHowl {
    constructor(options) {
      this._options = options || {};
      this._volume = this._options.volume || 0;
      this._handlers = {};
      this._onceHandlers = {};
      mockHowlInstances.push(this);
    }

    play() { return Math.floor(Math.random() * 1000) + 1; }

    stop() {
      this._emit('stop');
    }

    pause() {}

    volume(v) {
      if (v !== undefined) {
        this._volume = v;
        return this;
      }
      return this._volume;
    }

    fade(from, to, duration) {
      this._lastFade = { from, to, duration };
    }

    on(event, fn) {
      if (!this._handlers[event]) this._handlers[event] = [];
      this._handlers[event].push(fn);
      return this;
    }

    // soundId parameter is accepted but ignored in mock (one sound per Howl in tests)
    once(event, fn, _soundId) {
      if (!this._onceHandlers[event]) this._onceHandlers[event] = [];
      this._onceHandlers[event].push(fn);
      return this;
    }

    _emit(event, ...args) {
      (this._handlers[event] || []).forEach(fn => fn(...args));
      const onces = [...(this._onceHandlers[event] || [])];
      this._onceHandlers[event] = [];
      onces.forEach(fn => fn(...args));
    }

    unload() {}
    playing() { return false; }
  }

  return {
    Howl: MockHowl,
    Howler: { mute: vi.fn(), volume: vi.fn(), stop: vi.fn() },
  };
});

import { AudioManager, MAX_CONCURRENT_SFX } from '../audio.js';

// Helper: get the most recently created MockHowl
function lastHowl() {
  return mockHowlInstances[mockHowlInstances.length - 1];
}

describe('AudioManager — BGM Ducking', () => {
  let am;

  beforeEach(() => {
    mockHowlInstances = [];
    am = new AudioManager();
  });

  it('duckBGM sets _isDucked and saves pre-duck volume', () => {
    // Simulate a BGM Howl at volume 0.49 (bgmVolume 0.7 * masterVolume 0.7)
    const fakeBgm = { volume: vi.fn(() => 0.49), fade: vi.fn() };
    am.bgm = fakeBgm;

    am.duckBGM(0.3, 200);

    expect(am._isDucked).toBe(true);
    expect(am._preDuckVolume).toBe(0.49);
    expect(fakeBgm.fade).toHaveBeenCalledWith(0.49, expect.any(Number), 200);
    // target = 0.3 * masterVolume (0.7) ≈ 0.21
    expect(fakeBgm.fade.mock.calls[0][1]).toBeCloseTo(0.21);
  });

  it('duckBGM is a no-op when already ducked (prevents double-duck)', () => {
    const fakeBgm = { volume: vi.fn(() => 0.49), fade: vi.fn() };
    am.bgm = fakeBgm;

    am.duckBGM(0.3);
    am.duckBGM(0.1); // second call — should be ignored

    expect(fakeBgm.fade).toHaveBeenCalledTimes(1);
  });

  it('duckBGM works when no BGM is playing (no error thrown)', () => {
    am.bgm = null;
    expect(() => am.duckBGM(0.3)).not.toThrow();
    expect(am._isDucked).toBe(true);
  });

  it('restoreBGM restores volume and clears duck state', () => {
    const fakeBgm = { volume: vi.fn(() => 0.1), fade: vi.fn() };
    am.bgm = fakeBgm;
    am._isDucked = true;
    am._preDuckVolume = 0.49;

    am.restoreBGM(200);

    expect(am._isDucked).toBe(false);
    expect(am._preDuckVolume).toBeNull();
    expect(fakeBgm.fade).toHaveBeenCalledWith(0.1, 0.49, 200);
  });

  it('restoreBGM is a no-op when not ducked', () => {
    const fakeBgm = { volume: vi.fn(() => 0.49), fade: vi.fn() };
    am.bgm = fakeBgm;

    am.restoreBGM();

    expect(fakeBgm.fade).not.toHaveBeenCalled();
  });

  it('playWord auto-ducks BGM on first pronunciation', () => {
    const fakeBgm = { volume: vi.fn(() => 0.49), fade: vi.fn() };
    am.bgm = fakeBgm;

    am.playWord('كتاب');

    expect(am._isDucked).toBe(true);
    expect(am._duckRefCount).toBe(1);
  });

  it('playWord auto-restores BGM when sound ends', () => {
    const fakeBgm = { volume: vi.fn(() => 0.49), fade: vi.fn() };
    am.bgm = fakeBgm;

    am.playWord('كتاب');
    expect(am._isDucked).toBe(true);

    // Simulate the pronunciation Howl ending
    lastHowl()._emit('end');

    expect(am._duckRefCount).toBe(0);
    expect(am._isDucked).toBe(false);
  });

  it('playLetter auto-ducks BGM and restores on end', () => {
    const fakeBgm = { volume: vi.fn(() => 0.49), fade: vi.fn() };
    am.bgm = fakeBgm;

    am.playLetter('ب');
    expect(am._isDucked).toBe(true);

    lastHowl()._emit('end');
    expect(am._isDucked).toBe(false);
  });

  it('multiple concurrent pronunciations share duck — restore only when all done', () => {
    const fakeBgm = { volume: vi.fn(() => 0.49), fade: vi.fn() };
    am.bgm = fakeBgm;

    am.playWord('كتاب');    // refCount = 1, duck
    const howl1 = lastHowl();
    am.playLetter('ب');    // refCount = 2, still ducked (no double-duck)
    const howl2 = lastHowl();

    expect(am._duckRefCount).toBe(2);
    expect(fakeBgm.fade).toHaveBeenCalledTimes(1); // only one duck call

    howl1._emit('end');    // refCount = 1, still ducked
    expect(am._isDucked).toBe(true);

    howl2._emit('end');    // refCount = 0, restore
    expect(am._isDucked).toBe(false);
  });

  it('auto-restore fires only once even if both end and stop events fire', () => {
    am._isDucked = true;
    am._duckRefCount = 1;
    am._preDuckVolume = 0.49;

    const restoreSpy = vi.spyOn(am, 'restoreBGM');
    am._autoDuck({ once: vi.fn((ev, fn) => fn()), play: vi.fn() });

    // _autoDuck increments refCount to 2, then the mocked once immediately fires
    // (simulating immediate end) — refCount drops to 1; restore not called yet
    // This is a unit test of the fired-guard
    expect(restoreSpy).not.toHaveBeenCalled(); // refCount still 1 after one decrement
  });
});

describe('AudioManager — SFX Queue', () => {
  let am;

  beforeEach(() => {
    mockHowlInstances = [];
    am = new AudioManager();
  });

  it('queueSfx plays immediately when fewer than MAX_CONCURRENT_SFX are active', () => {
    am.queueSfx('click');
    expect(am._sfxActive.length).toBe(1);
    expect(am._sfxQueue.length).toBe(0);
  });

  it('queueSfx queues when MAX_CONCURRENT_SFX are already active', () => {
    // Fill active slots without going through queueSfx so we control the Howl mocks
    for (let i = 0; i < MAX_CONCURRENT_SFX; i++) {
      am.queueSfx(`sound${i}`);
    }
    // All 3 slots active
    expect(am._sfxActive.length).toBe(MAX_CONCURRENT_SFX);

    // 4th sound should queue
    am.queueSfx('overflow');
    expect(am._sfxQueue.length).toBe(1);
    expect(am._sfxQueue[0].sfxName).toBe('overflow');
  });

  it('high-priority sounds skip to front of queue', () => {
    for (let i = 0; i < MAX_CONCURRENT_SFX; i++) {
      am.queueSfx(`sound${i}`);
    }
    am.queueSfx('normal', 0);
    am.queueSfx('urgent', 1);

    // urgent (priority > 0) goes to front
    expect(am._sfxQueue[0].sfxName).toBe('urgent');
    expect(am._sfxQueue[1].sfxName).toBe('normal');
  });

  it('queue drains when an active sound ends', () => {
    for (let i = 0; i < MAX_CONCURRENT_SFX; i++) {
      am.queueSfx(`sound${i}`);
    }
    am.queueSfx('queued');
    expect(am._sfxQueue.length).toBe(1);

    // Finish one active sound
    am._sfxActive[0]._emit('end');

    // Queue should have drained — queued sound now active
    expect(am._sfxQueue.length).toBe(0);
    expect(am._sfxActive.length).toBe(MAX_CONCURRENT_SFX);
  });

  it('clearSfxQueue empties queue and stops active sounds', () => {
    am.queueSfx('a');
    am.queueSfx('b');
    am.queueSfx('c');
    am.queueSfx('d'); // queued

    expect(am._sfxActive.length).toBe(3);
    expect(am._sfxQueue.length).toBe(1);

    am.clearSfxQueue();

    expect(am._sfxActive.length).toBe(0);
    expect(am._sfxQueue.length).toBe(0);
  });

  it('clearSfxQueue calls stop and unload on each active Howl', () => {
    am.queueSfx('a');
    am.queueSfx('b');
    const active = [...am._sfxActive];
    const stopSpies = active.map(h => vi.spyOn(h, 'stop'));
    const unloadSpies = active.map(h => vi.spyOn(h, 'unload'));

    am.clearSfxQueue();

    stopSpies.forEach(spy => expect(spy).toHaveBeenCalled());
    unloadSpies.forEach(spy => expect(spy).toHaveBeenCalled());
  });

  it('MAX_CONCURRENT_SFX limit is exactly 3', () => {
    expect(MAX_CONCURRENT_SFX).toBe(3);
  });

  it('queueSfx ignores empty name', () => {
    am.queueSfx('');
    expect(am._sfxActive.length).toBe(0);
    expect(am._sfxQueue.length).toBe(0);
  });

  it('queue fully drains when multiple slots open up', () => {
    for (let i = 0; i < MAX_CONCURRENT_SFX; i++) {
      am.queueSfx(`a${i}`);
    }
    am.queueSfx('q1');
    am.queueSfx('q2');

    // End two active sounds
    am._sfxActive[0]._emit('end');
    am._sfxActive[0]._emit('end'); // next active[0] after drain

    expect(am._sfxQueue.length).toBe(0);
    expect(am._sfxActive.length).toBe(MAX_CONCURRENT_SFX);
  });
});
