import { store } from '../../store/store.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';

/**
 * AutoSave — triggers persist flush every 3 minutes with safety guards.
 * Skips during battle, dialogue, quiz, and zone transitions.
 */
export class AutoSave {
  constructor(intervalMs = 180000) {
    this.intervalMs = intervalMs;
    this.timer = null;
    this.saving = false;
  }

  start() {
    this.timer = setInterval(() => this._tryAutoSave(), this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  _tryAutoSave() {
    if (this.saving) return;
    if (!this._isSafeToSave()) return;

    this.saving = true;
    try {
      EventBus.emit(EVENTS.AUTOSAVE_TRIGGERED);
    } finally {
      this.saving = false;
    }
  }

  _isSafeToSave() {
    const state = store.getState();
    const ui = state.ui || {};

    if (ui.dialogueOpen) return false;
    if (ui.quizOpen) return false;
    if (state.battle?.activeBattle) return false;

    return true;
  }
}
