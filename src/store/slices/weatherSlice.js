import { createSlice } from '@reduxjs/toolkit';

export const WEATHER_TYPES = {
    CLEAR: 'clear',
    CLOUDY: 'cloudy',
    RAIN: 'rain',
    SANDSTORM: 'sandstorm',
    FOG: 'fog',
    SNOW: 'snow',
    HEAT: 'heat',
    WIND: 'wind',
};

const initialState = {
    currentWeather: WEATHER_TYPES.CLEAR,
    intensity: 0.5, // 0 to 1
    windDirection: { x: 1, y: 0 },
    nextWeather: null,
    timeUntilChange: 0, // in game minutes
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setWeather: (state, action) => {
            // payload: { type: WEATHER_TYPES.*, intensity: 0-1 }
            state.currentWeather = action.payload.type;
            if (action.payload.intensity !== undefined) {
                state.intensity = action.payload.intensity;
            }
        },
        setWindDirection: (state, action) => {
            state.windDirection = action.payload;
        },
        scheduleWeatherChange: (state, action) => {
            // payload: { type: WEATHER_TYPES.*, minutes: number }
            state.nextWeather = action.payload.type;
            state.timeUntilChange = action.payload.minutes;
        },
        tickWeatherTimer: (state, action) => {
            if (state.timeUntilChange > 0) {
                state.timeUntilChange -= action.payload; // payload is minutes passed
                if (state.timeUntilChange <= 0 && state.nextWeather) {
                    state.currentWeather = state.nextWeather;
                    state.nextWeather = null;
                }
            }
        },
    },
});

export const { setWeather, setWindDirection, scheduleWeatherChange, tickWeatherTimer } = weatherSlice.actions;

export const selectCurrentWeather = (state) => state.weather.currentWeather;
export const selectWeatherIntensity = (state) => state.weather.intensity;

export default weatherSlice.reducer;
