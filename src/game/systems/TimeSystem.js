import { store } from '../../store/store';
import { tickTime, selectTimePhase } from '../../store/slices/timeSlice';
import { EVENTS } from '../../utils/eventBusTypes';
import { EventBus } from '../../utils/eventBus';

/**
 * TimeSystem
 * Handles time progression based on Phaser's update loop.
 * 1 real second = 1 game minute.
 */
export class TimeSystem {
    constructor(scene) {
        this.scene = scene;
        this.accumulator = 0;
        this.msPerGameMinute = 1000; // 1000ms real time = 1 game minute
        this.lastPhase = null;
    }

    update(time, delta) {
        const state = store.getState();
        if (state.time.isPaused) return;

        // Apply speed multiplier
        const effectiveDelta = delta * state.time.speedMultiplier;

        this.accumulator += effectiveDelta;

        if (this.accumulator >= this.msPerGameMinute) {
            const minutesToTick = Math.floor(this.accumulator / this.msPerGameMinute);
            this.accumulator -= minutesToTick * this.msPerGameMinute;

            // Update Redux
            store.dispatch(tickTime(minutesToTick));

            // Check for phase change to trigger events (e.g. night visuals)
            const currentPhase = selectTimePhase(store.getState());
            if (currentPhase !== this.lastPhase) {
                this.lastPhase = currentPhase;
                EventBus.emit(EVENTS.TIME_PHASE_CHANGED, { phase: currentPhase });
            }

            // Emit tick event for systems that need minute-level precision
            EventBus.emit(EVENTS.TIME_TICK, { minutes: minutesToTick });
        }
    }

    destroy() {
        // Cleanup if needed
    }
}
