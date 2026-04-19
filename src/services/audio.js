import { Howl, Howler } from 'howler';

// Maximum number of SFX sounds that may play concurrently.
export const MAX_CONCURRENT_SFX = 3;

/**
 * Simple LRU cache implementation for managing Howl instances.
 * Automatically unloads oldest entries when cache exceeds max size.
 */
class LRUCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map(); // key -> { howl, lastUsed }
  }

  get(key) {
    const entry = this.cache.get(key);
    if (entry) {
      entry.lastUsed = Date.now();
      return entry.howl;
    }
    return null;
  }

  set(key, howl) {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      let oldestKey = null;
      let oldestTime = Infinity;

      for (const [k, v] of this.cache.entries()) {
        if (v.lastUsed < oldestTime) {
          oldestTime = v.lastUsed;
          oldestKey = k;
        }
      }

      if (oldestKey) {
        const oldEntry = this.cache.get(oldestKey);
        oldEntry.howl.unload();
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { howl, lastUsed: Date.now() });
  }

  clear() {
    for (const [, entry] of this.cache.entries()) {
      entry.howl.unload();
    }
    this.cache.clear();
  }
}

/**
 * AudioManager singleton
 * Five independent volume channels: master, ambient, bgm, sfx, pronunciation
 * Master volume scales all other channels.
 * Effective volume = channelVolume * masterVolume
 *
 * Bus-based architecture:
 *   busVolumes tracks per-bus volume multipliers (bgm, sfx, ambient, voice).
 *   setBusVolume() adjusts bus multiplier and updates active sounds on that bus.
 *
 * BGM Ducking:
 *   duckBGM() smoothly reduces BGM volume during voice playback.
 *   restoreBGM() restores to pre-duck level.
 *   playWord/playLetter auto-duck and auto-restore via _duckRefCount.
 *
 * SFX Queue:
 *   Max MAX_CONCURRENT_SFX sounds play at once; extras queue FIFO.
 *   High-priority sounds (priority > 0) jump to front of queue.
 *   clearSfxQueue() stops all active and queued SFX.
 */
export class AudioManager {
  constructor() {
    /** @type {Howl|null} Currently playing ambient Howl */
    this.ambient = null;
    /** @type {string|null} Current ambient zone name for dedup */
    this.ambientZone = null;

    /** @type {Howl|null} Currently playing BGM Howl */
    this.bgm = null;
    /** @type {string|null} Current BGM track name for dedup */
    this.bgmTrack = null;
    /** @type {boolean} Whether BGM was paused (for resume) */
    this.bgmWasPaused = false;

    // Master volume (0-1 internal range) — scales all channels
    this.masterVolume = 0.7;

    // Channel volumes (0-1 internal range)
    this.ambientVolume = 0.7;
    this.bgmVolume = 0.7;
    this.sfxVolume = 0.8;
    this.pronunciationVolume = 1.0;

    // Mute state
    this.isMuted = false;

    /** @type {Object<string, Howl>} Cached SFX Howl objects keyed by name */
    this.sfxCache = {};

    /** @type {LRUCache} LRU cache for word pronunciations (prevents memory leak) */
    this.wordCache = new LRUCache(50);

    /** @type {LRUCache} LRU cache for letter pronunciations */
    this.letterCache = new LRUCache(28);

    // -------------------------------------------------------------------------
    // Bus-based audio architecture
    // -------------------------------------------------------------------------

    /**
     * Per-bus volume multipliers (independent of channel volumes above).
     * busVolumes act as a secondary multiplier: effectiveVol = channelVol * busVol * masterVol
     */
    this.busVolumes = {
      bgm: 0.5,
      sfx: 1.0,
      ambient: 0.5,
      voice: 1.0,
    };

    /**
     * Active ambient layer Howl instances (from playAmbient(layers)).
     * Stored alongside their base layer volume for muffling calculations.
     * @type {Array<{ howl: Howl, baseVolume: number }>}
     */
    this.ambientSounds = [];

    /**
     * Current muffle factor for ambient bus (0-1). 1.0 = full volume, 0.3 = 30% (inside building).
     * @type {number}
     */
    this.ambientMuffle = 1.0;

    // -------------------------------------------------------------------------
    // BGM Ducking
    // -------------------------------------------------------------------------

    /** Whether BGM is currently ducked (prevents double-duck). */
    this._isDucked = false;

    /** BGM volume snapshot taken just before ducking, for restore. */
    this._preDuckVolume = null;

    /**
     * Number of pronunciation sounds currently in-flight.
     * BGM is ducked while > 0 and restored when it drops back to 0.
     */
    this._duckRefCount = 0;

    // -------------------------------------------------------------------------
    // SFX Queue
    // -------------------------------------------------------------------------

    /** Howl instances currently playing through the queue system. @type {Howl[]} */
    this._sfxActive = [];

    /** Pending SFX waiting to play. @type {Array<{sfxName: string, priority: number}>} */
    this._sfxQueue = [];
  }

  // ---------------------------------------------------------------------------
  // Master Volume & Mute
  // ---------------------------------------------------------------------------

  /**
   * Set master volume. Scales all channel outputs.
   * @param {number} vol - Volume from 0 to 100
   */
  setMasterVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol / 100));
    // Update all currently playing Howl volumes
    if (this.ambient) {
      this.ambient.volume(this.ambientVolume * this.masterVolume);
    }
    if (this.bgm) {
      this.bgm.volume(this.bgmVolume * this.masterVolume);
    }
  }

  /**
   * Mute all audio globally via Howler.
   */
  mute() {
    this.isMuted = true;
    Howler.mute(true);
  }

  /**
   * Unmute all audio globally via Howler.
   */
  unmute() {
    this.isMuted = false;
    Howler.mute(false);
  }

  /**
   * Toggle mute state.
   */
  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  // ---------------------------------------------------------------------------
  // Bus Volume Control
  // ---------------------------------------------------------------------------

  /**
   * Set the volume for a named audio bus.
   * Updates all active sounds on that bus immediately.
   * @param {'bgm'|'sfx'|'ambient'|'voice'} bus - Bus name
   * @param {number} volume - Volume from 0 to 1
   */
  setBusVolume(bus, volume) {
    if (!(bus in this.busVolumes)) return;
    this.busVolumes[bus] = Math.max(0, Math.min(1, volume));

    // Immediately apply new bus volume to active sounds on that bus
    if (bus === 'bgm' && this.bgm) {
      this.bgm.volume(this.bgmVolume * this.busVolumes.bgm * this.masterVolume);
    }
    if (bus === 'ambient') {
      this.ambientSounds.forEach(({ howl, baseVolume }) => {
        howl.volume(baseVolume * this.busVolumes.ambient * this.ambientMuffle * this.masterVolume);
      });
      // Also update legacy single-ambient if playing
      if (this.ambient) {
        this.ambient.volume(this.ambientVolume * this.busVolumes.ambient * this.masterVolume);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Volume setters (accept 0-100, convert to 0-1 internally)
  // ---------------------------------------------------------------------------

  /**
   * Set ambient channel volume.
   * @param {number} vol - Volume from 0 to 100
   */
  setAmbientVolume(vol) {
    this.ambientVolume = Math.max(0, Math.min(1, vol / 100));
    if (this.ambient) {
      this.ambient.volume(this.ambientVolume * this.masterVolume);
    }
  }

  /**
   * Set BGM channel volume.
   * @param {number} vol - Volume from 0 to 100
   */
  setBgmVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol / 100));
    if (this.bgm) {
      this.bgm.volume(this.bgmVolume * this.masterVolume);
    }
  }

  /**
   * Set SFX channel volume.
   * @param {number} vol - Volume from 0 to 100
   */
  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol / 100));
  }

  /**
   * Set pronunciation channel volume.
   * @param {number} vol - Volume from 0 to 100
   */
  setPronunciationVolume(vol) {
    this.pronunciationVolume = Math.max(0, Math.min(1, vol / 100));
  }

  // ---------------------------------------------------------------------------
  // BGM (Background Music)
  // ---------------------------------------------------------------------------

  /**
   * Play background music with crossfade.
   * Current BGM fades out over 800ms, new one fades in over 800ms.
   * Maps track name to: /assets/audio/bgm/bgm-{trackName}.mp3
   * If already playing the same track, does nothing.
   * @param {string} trackName - e.g. "oasis", "library", "menu"
   */
  playBGM(trackName) {
    if (!trackName) return;

    // Already playing this track -- skip
    if (this.bgmTrack === trackName && this.bgm && this.bgm.playing()) {
      return;
    }

    this.bgmWasPaused = false;
    const src = `/assets/audio/bgm/bgm-${trackName}.mp3`;

    // Fade out current BGM if one is playing
    if (this.bgm) {
      const old = this.bgm;
      old.fade(old.volume(), 0, 800);
      old.once('fade', () => {
        old.stop();
        old.unload();
      });
    }

    const targetVolume = this.bgmVolume * this.masterVolume;

    // Create and fade in new BGM
    const newBgm = new Howl({
      src: [src],
      loop: true,
      volume: 0,
      onloaderror: () => {
        // File doesn't exist for this track -- silently skip
        this.bgm = null;
        this.bgmTrack = null;
      },
    });

    this.bgm = newBgm;
    this.bgmTrack = trackName;

    newBgm.once('load', () => {
      newBgm.play();
      newBgm.fade(0, targetVolume, 800);
    });
  }

  /**
   * Stop the currently playing BGM with fadeout.
   */
  stopBGM() {
    if (this.bgm) {
      const old = this.bgm;
      old.fade(old.volume(), 0, 800);
      old.once('fade', () => {
        old.stop();
        old.unload();
      });
      this.bgm = null;
      this.bgmTrack = null;
      this.bgmWasPaused = false;
    }
  }

  /**
   * Pause BGM with a short fadeout (for quiz overlay, etc.).
   */
  pauseBGM() {
    if (this.bgm && this.bgm.playing()) {
      const bgmRef = this.bgm;
      bgmRef.fade(bgmRef.volume(), 0, 300);
      bgmRef.once('fade', () => {
        bgmRef.pause();
      });
      this.bgmWasPaused = true;
    }
  }

  /**
   * Resume BGM after pause with a short fadein.
   */
  resumeBGM() {
    if (this.bgmWasPaused && this.bgm) {
      const targetVolume = this.bgmVolume * this.masterVolume;
      this.bgm.play();
      this.bgm.fade(0, targetVolume, 300);
      this.bgmWasPaused = false;
    }
  }

  // ---------------------------------------------------------------------------
  // Ambient — Layered ambient sound system
  // ---------------------------------------------------------------------------

  /**
   * Play ambient sound layers for a zone.
   * Accepts an array of layer objects: [{ track: string, volume: number }, ...]
   * Each layer creates a separate looping Howl for independent volume control.
   * Stops any currently playing ambient layers before starting new ones.
   * Files at: /assets/audio/ambient/ambient-{track}.mp3
   * Missing files are silently skipped via onloaderror.
   * @param {Array<{ track: string, volume: number }>} layers - Zone ambient layers
   */
  playAmbient(layers) {
    if (!layers || layers.length === 0) {
      this.stopAmbient();
      return;
    }

    // Stop current ambient layers before starting new ones
    this._stopAmbientSounds();

    // Reset muffle factor for new zone
    this.ambientMuffle = 1.0;

    layers.forEach((layer) => {
      const src = `/assets/audio/ambient/${layer.track}.mp3`;
      const targetVolume = layer.volume * this.busVolumes.ambient * this.ambientMuffle * this.masterVolume;

      const howl = new Howl({
        src: [src],
        loop: true,
        volume: 0,
        onloaderror: () => {
          // File doesn't exist for this layer -- silently skip
          this.ambientSounds = this.ambientSounds.filter(entry => entry.howl !== howl);
        },
      });

      this.ambientSounds.push({ howl, baseVolume: layer.volume });

      howl.once('load', () => {
        // Only play if still in our active list (wasn't skipped by error)
        if (this.ambientSounds.some(entry => entry.howl === howl)) {
          howl.play();
          howl.fade(0, targetVolume, 500);
        }
      });
    });
  }

  /**
   * Stop all currently playing ambient sounds with a fade-out.
   */
  stopAmbient() {
    this._stopAmbientSounds();
    // Also stop legacy single ambient if playing
    if (this.ambient) {
      const old = this.ambient;
      old.fade(old.volume(), 0, 500);
      old.once('fade', () => {
        old.stop();
        old.unload();
      });
      this.ambient = null;
      this.ambientZone = null;
    }
  }

  /**
   * Reduce ambient layer volumes by a muffle factor.
   * Used when entering building interiors to simulate muffled outdoor sounds.
   * @param {number} factor - Target volume fraction (e.g. 0.3 = 30% of normal volume)
   */
  muffleAmbient(factor) {
    this.ambientMuffle = Math.max(0, Math.min(1, factor));
    this.ambientSounds.forEach(({ howl, baseVolume }) => {
      const targetVol = baseVolume * this.busVolumes.ambient * this.ambientMuffle * this.masterVolume;
      howl.fade(howl.volume(), targetVol, 400);
    });
  }

  /**
   * Restore ambient layer volumes to their normal (un-muffled) levels.
   * Used when exiting building interiors.
   */
  unmuffleAmbient() {
    this.ambientMuffle = 1.0;
    this.ambientSounds.forEach(({ howl, baseVolume }) => {
      const targetVol = baseVolume * this.busVolumes.ambient * this.masterVolume;
      howl.fade(howl.volume(), targetVol, 400);
    });
  }

  /**
   * Internal helper: fade out and unload all active ambient layer Howls.
   * @private
   */
  _stopAmbientSounds() {
    const toStop = [...this.ambientSounds];
    this.ambientSounds = [];
    toStop.forEach(({ howl }) => {
      howl.fade(howl.volume(), 0, 500);
      howl.once('fade', () => {
        howl.stop();
        howl.unload();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // SFX
  // ---------------------------------------------------------------------------

  /**
   * Play a one-shot sound effect.
   * Files at: /assets/audio/sfx/sfx-{name}.ogg
   * Cached for reuse after first load.
   *
   * Supported names:
   *   click, correct, wrong, levelup, quest, coin,
   *   wordlearned, chest, transition, streak, bookopen,
   *   bookflip, footstep
   *
   * @param {string} name - SFX identifier
   */
  playSFX(name) {
    if (!name) return;

    const effectiveVolume = this.sfxVolume * this.masterVolume;

    if (!this.sfxCache[name]) {
      this.sfxCache[name] = new Howl({
        src: [`/assets/audio/sfx/sfx-${name}.ogg`],
        volume: effectiveVolume,
        onloaderror: () => {
          // Missing SFX file -- remove from cache so it can retry later
          delete this.sfxCache[name];
        },
      });
    }

    const howl = this.sfxCache[name];
    howl.volume(effectiveVolume);
    howl.play();
  }

  // ---------------------------------------------------------------------------
  // Pronunciation
  // ---------------------------------------------------------------------------

  /**
   * Play Arabic word pronunciation.
   * Files at: /assets/audio/words/{wordId}.mp3
   * Uses LRU cache to prevent memory leaks from creating unlimited Howl instances.
   * @param {string} wordId - Word identifier matching the vocabulary data
   */
  playWord(wordId) {
    if (!wordId) return;

    const effectiveVolume = this.pronunciationVolume * this.masterVolume;

    // Check cache first
    let howl = this.wordCache.get(wordId);

    if (!howl) {
      // Create new Howl and add to cache
      howl = new Howl({
        src: [`/assets/audio/words/${wordId}.mp3`],
        volume: effectiveVolume,
        onloaderror: () => {
          console.warn(`[AudioManager] Missing word audio: ${wordId}`);
        },
      });
      this.wordCache.set(wordId, howl);
    } else {
      // Update volume in case it changed
      howl.volume(effectiveVolume);
    }

    const soundId = howl.play();
    this._autoDuck(howl, soundId);
  }

  /**
   * Play Arabic letter pronunciation.
   * Files at: /assets/audio/letters/{letter}.mp3
   * Uses LRU cache to prevent memory leaks.
   * Auto-ducks BGM while the letter audio plays.
   * @param {string} letter - Arabic letter character or transliterated name
   */
  playLetter(letter) {
    if (!letter) return;

    const effectiveVolume = this.pronunciationVolume * this.masterVolume;

    // Check cache first
    let howl = this.letterCache.get(letter);

    if (!howl) {
      // Create new Howl and add to cache
      howl = new Howl({
        src: [`/assets/audio/letters/${letter}.mp3`],
        volume: effectiveVolume,
        onloaderror: () => {
          console.warn(`[AudioManager] Missing letter audio: ${letter}`);
        },
      });
      this.letterCache.set(letter, howl);
    } else {
      // Update volume in case it changed
      howl.volume(effectiveVolume);
    }

    const soundId = howl.play();
    this._autoDuck(howl, soundId);
  }

  // ---------------------------------------------------------------------------
  // BGM Ducking
  // ---------------------------------------------------------------------------

  /**
   * Smoothly reduce BGM volume during voice/pronunciation playback.
   * No-ops if BGM is already ducked (prevents double-duck).
   * @param {number} targetVolume - Target volume fraction 0-1 (default 0.3 = 30%)
   * @param {number} fadeDuration - Fade duration in ms (default 300)
   */
  duckBGM(targetVolume = 0.3, fadeDuration = 300) {
    if (this._isDucked) return;
    this._isDucked = true;
    this._preDuckVolume = this.bgm ? this.bgm.volume() : this.bgmVolume * this.masterVolume;
    if (this.bgm) {
      this.bgm.fade(this.bgm.volume(), Math.max(0, Math.min(1, targetVolume)) * this.masterVolume, fadeDuration);
    }
  }

  /**
   * Restore BGM to its pre-duck volume.
   * No-ops if BGM is not currently ducked.
   * @param {number} fadeDuration - Fade duration in ms (default 300)
   */
  restoreBGM(fadeDuration = 300) {
    if (!this._isDucked) return;
    this._isDucked = false;
    if (this.bgm && this._preDuckVolume !== null) {
      this.bgm.fade(this.bgm.volume(), this._preDuckVolume, fadeDuration);
    }
    this._preDuckVolume = null;
  }

  /**
   * Auto-duck BGM when a pronunciation sound starts; restore when it finishes.
   * Uses a reference count so concurrent pronunciations don't double-duck or
   * restore early.
   * @param {Howl} howl - The Howl instance that was just played
   * @param {number|undefined} soundId - Howler sound ID returned by play()
   * @private
   */
  _autoDuck(howl, soundId) {
    this._duckRefCount++;
    if (this._duckRefCount === 1) {
      this.duckBGM(0.3);
    }
    let fired = false;
    const onDone = () => {
      if (fired) return;
      fired = true;
      this._duckRefCount = Math.max(0, this._duckRefCount - 1);
      if (this._duckRefCount === 0) {
        this.restoreBGM();
      }
    };
    if (soundId !== undefined) {
      howl.once('end', onDone, soundId);
      howl.once('stop', onDone, soundId);
    } else {
      howl.once('end', onDone);
      howl.once('stop', onDone);
    }
  }

  // ---------------------------------------------------------------------------
  // SFX Queue
  // ---------------------------------------------------------------------------

  /**
   * Queue a sound effect. Plays immediately if fewer than MAX_CONCURRENT_SFX
   * are active; otherwise waits in a FIFO queue. High-priority sounds (priority > 0)
   * are inserted at the front of the queue.
   * @param {string} sfxName - SFX identifier (same as playSFX)
   * @param {number} priority - 0 = normal (FIFO), >0 = high (skip to front)
   */
  queueSfx(sfxName, priority = 0) {
    if (!sfxName) return;
    if (this._sfxActive.length < MAX_CONCURRENT_SFX) {
      this._playSfxQueued(sfxName);
    } else if (priority > 0) {
      this._sfxQueue.unshift({ sfxName, priority });
    } else {
      this._sfxQueue.push({ sfxName, priority });
    }
  }

  /**
   * Stop all queued and currently playing SFX that were started via queueSfx.
   */
  clearSfxQueue() {
    this._sfxQueue = [];
    const toStop = [...this._sfxActive];
    this._sfxActive = [];
    toStop.forEach(howl => {
      howl.stop();
      howl.unload();
    });
  }

  /**
   * Internal: create a Howl for an SFX, add it to the active set, and play it.
   * Drains the queue when the sound finishes.
   * @param {string} sfxName
   * @private
   */
  _playSfxQueued(sfxName) {
    const effectiveVolume = this.sfxVolume * this.masterVolume;
    const howl = new Howl({
      src: [`/assets/audio/sfx/sfx-${sfxName}.ogg`],
      volume: effectiveVolume,
      onloaderror: () => {
        this._sfxActive = this._sfxActive.filter(h => h !== howl);
        this._drainSfxQueue();
      },
    });
    this._sfxActive.push(howl);
    const onDone = () => {
      this._sfxActive = this._sfxActive.filter(h => h !== howl);
      this._drainSfxQueue();
    };
    howl.once('end', onDone);
    howl.once('stop', onDone);
    howl.play();
  }

  /**
   * Promote queued SFX to active as slots become available.
   * @private
   */
  _drainSfxQueue() {
    while (this._sfxQueue.length > 0 && this._sfxActive.length < MAX_CONCURRENT_SFX) {
      const { sfxName } = this._sfxQueue.shift();
      this._playSfxQueued(sfxName);
    }
  }

  /**
   * Clean up all cached audio resources.
   * Call this when the app is being unmounted or reset.
   */
  cleanup() {
    // Clean up ambient
    if (this.ambient) {
      this.ambient.unload();
      this.ambient = null;
      this.ambientZone = null;
    }

    // Clean up BGM
    if (this.bgm) {
      this.bgm.unload();
      this.bgm = null;
      this.bgmTrack = null;
      this.bgmWasPaused = false;
    }

    // Clean up SFX cache
    Object.values(this.sfxCache).forEach(howl => howl.unload());
    this.sfxCache = {};

    // Clean up LRU caches
    this.wordCache.clear();
    this.letterCache.clear();

    // Clean up SFX queue
    this.clearSfxQueue();
    this._isDucked = false;
    this._preDuckVolume = null;
    this._duckRefCount = 0;
  }
}

export const audioManager = new AudioManager();
