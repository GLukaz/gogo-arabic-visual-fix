import { store } from '../../store/store.js';
import { setFlag, incrementCounter, setCounter, selectFlag, selectCounter } from '../../store/slices/worldStateSlice.js';

export class WorldStateManager {
    constructor(scene) {
        this.scene = scene;
        this.unsubscribe = store.subscribe(this.handleStateChange.bind(this));
        // Cache local state if needed for performance, but usually reading from store is fine
    }

    handleStateChange() {
        // React to state changes if needed immediately
        // e.g. check for quest completion based on flags
    }

    setFlag(key, value) {
        store.dispatch(setFlag({ key, value }));
        this.scene.events.emit('world-state-changed', { key, value });
    }

    getFlag(key) {
        const state = store.getState();
        return selectFlag(key)(state);
    }

    incrementCounter(key, amount = 1) {
        store.dispatch(incrementCounter({ key, amount }));
        // Check milestones here if needed
    }

    getCounter(key) {
        const state = store.getState();
        return selectCounter(key)(state);
    }

    checkCondition(condition) {
        if (!condition) return true;
        // Simple condition object: { flag: 'met_scholar', value: true }
        if (condition.flag) {
            const currentVal = this.getFlag(condition.flag);
            // Default assume define flags are false if undefined
            return (currentVal || false) === condition.value;
        }
        // Simple counter check: { counter: 'slimes_killed', min: 5 }
        if (condition.counter) {
            const currentVal = this.getCounter(condition.counter);
            return currentVal >= condition.min;
        }
        // Quest check: { quest: 'quest_id', completed: true }
        // This would require access to quest slice or helper
        return true;
    }

    destroy() {
        if (this.unsubscribe) this.unsubscribe();
    }
}
