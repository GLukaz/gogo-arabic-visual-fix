import { createSlice } from '@reduxjs/toolkit';

const MINUTES_PER_DAY = 1440; // 24 * 60

/**
 * Time phases for day/night cycle
 */
export const TIME_PHASES = {
    DAWN: 'dawn',       // 05:00 - 07:00
    MORNING: 'morning', // 07:00 - 12:00
    NOON: 'noon',       // 12:00 - 15:00
    AFTERNOON: 'afternoon', // 15:00 - 18:00
    SUNSET: 'sunset',   // 18:00 - 20:00
    NIGHT: 'night',     // 20:00 - 05:00
};

const initialState = {
    totalGameMinutes: 360, // Start at 06:00 AM (Dawn)
    isPaused: false,
    speedMultiplier: 1.0,
};

const timeSlice = createSlice({
    name: 'time',
    initialState,
    reducers: {
        tickTime: (state, action) => {
            if (!state.isPaused) {
                state.totalGameMinutes += action.payload; // payload is minutes to add
            }
        },
        setPaused: (state, action) => {
            state.isPaused = action.payload;
        },
        setSpeed: (state, action) => {
            state.speedMultiplier = action.payload;
        },
        advanceTime: (state, action) => {
            state.totalGameMinutes += action.payload;
        },
    },
});

export const { tickTime, setPaused, setSpeed, advanceTime } = timeSlice.actions;

/**
 * Selectors
 */

// Total days passed
export const selectDayCount = (state) => Math.floor(state.time.totalGameMinutes / MINUTES_PER_DAY) + 1;

// Current time in 24h format { hour, minute }
export const selectGameTime = (state) => {
    const minutesToday = state.time.totalGameMinutes % MINUTES_PER_DAY;
    const hour = Math.floor(minutesToday / 60);
    const minute = Math.floor(minutesToday % 60);
    return { hour, minute };
};

// Current time phase (Dawn, Morning, etc.)
export const selectTimePhase = (state) => {
    const { hour } = selectGameTime(state);

    if (hour >= 5 && hour < 7) return TIME_PHASES.DAWN;
    if (hour >= 7 && hour < 12) return TIME_PHASES.MORNING;
    if (hour >= 12 && hour < 15) return TIME_PHASES.NOON;
    if (hour >= 15 && hour < 18) return TIME_PHASES.AFTERNOON;
    if (hour >= 18 && hour < 20) return TIME_PHASES.SUNSET;
    return TIME_PHASES.NIGHT;
};

// Value 0-1 representing cycle progress (0=midnight, 0.5=noon)
export const selectDayProgress = (state) => {
    return (state.time.totalGameMinutes % MINUTES_PER_DAY) / MINUTES_PER_DAY;
};

// Formatted time string "HH:MM"
export const selectFormattedTime = (state) => {
    const { hour, minute } = selectGameTime(state);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export default timeSlice.reducer;
