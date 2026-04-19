/**
 * World State Slice — stores flags and counters for world progression.
 *
 * IMPORTANT: After Phase 50, use WORLD_STATE_KEYS from src/data/worldStateKeys.js
 * for all flag/counter key names. Do not use raw string literals.
 *
 * Persisted via IndexedDB (nested persistReducer in store.js).
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    flags: {}, // Key-value pairs: { met_scholar: true, unlock_library: true }
    counters: {}, // Key-value pairs: { slimes_killed: 5 }
};

const worldStateSlice = createSlice({
    name: 'worldState',
    initialState,
    reducers: {
        setFlag: (state, action) => {
            const { key, value } = action.payload;
            state.flags[key] = value;
        },
        incrementCounter: (state, action) => {
            const { key, amount = 1 } = action.payload;
            state.counters[key] = (state.counters[key] || 0) + amount;
        },
        setCounter: (state, action) => {
            const { key, value } = action.payload;
            state.counters[key] = value;
        },
        resetWorldState: (state) => {
            state.flags = {};
            state.counters = {};
        },
    },
});

export const { setFlag, incrementCounter, setCounter, resetWorldState } = worldStateSlice.actions;

export const selectFlag = (key) => (state) => state.worldState.flags[key];
export const selectCounter = (key) => (state) => state.worldState.counters[key] || 0;
export const selectAllFlags = (state) => state.worldState.flags;

export default worldStateSlice.reducer;
