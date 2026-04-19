import { store } from '../../store/store.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import {
  recordWordLearned,
  recordAnswer,
  recordZoneTime,
  recordBattle,
  updateStreak,
  incrementPlayTime,
  startSession,
} from '../../store/slices/statsSlice.js';

/**
 * GameplayStats — listens to game events and dispatches to statsSlice.
 * Tracks words learned, quiz accuracy, zone time, battles, streaks, and play time.
 */
export class GameplayStats {
  constructor() {
    this._playTimer = null;
    this._zoneEntryTime = null;
    this._currentZone = null;
    this._listeners = [];
  }

  start() {
    store.dispatch(startSession());

    // Track play time every 60 seconds
    this._playTimer = setInterval(() => {
      store.dispatch(incrementPlayTime(60));
    }, 60000);

    // Initialize zone tracking
    this._currentZone = store.getState().player?.currentZone || 'oasis_village';
    this._zoneEntryTime = Date.now();

    // Word learned
    this._on(EVENTS.SFX_WORDLEARNED, () => {
      store.dispatch(recordWordLearned());
    });

    // Zone change — record time in previous zone
    this._on(EVENTS.ZONE_CHANGE, ({ zone }) => {
      this._recordZoneTime();
      this._currentZone = zone;
      this._zoneEntryTime = Date.now();
    });

    // Battle end
    this._on(EVENTS.BATTLE_ENDED, ({ won }) => {
      store.dispatch(recordBattle({ won: !!won }));
    });
  }

  stop() {
    // Record final zone time
    this._recordZoneTime();

    if (this._playTimer) clearInterval(this._playTimer);
    this._playTimer = null;

    // Remove all listeners
    for (const { event, handler } of this._listeners) {
      EventBus.off(event, handler);
    }
    this._listeners = [];
  }

  _on(event, handler) {
    EventBus.on(event, handler);
    this._listeners.push({ event, handler });
  }

  _recordZoneTime() {
    if (this._currentZone && this._zoneEntryTime) {
      const seconds = Math.floor((Date.now() - this._zoneEntryTime) / 1000);
      if (seconds > 0) {
        store.dispatch(recordZoneTime({ zone: this._currentZone, seconds }));
      }
    }
  }
}
