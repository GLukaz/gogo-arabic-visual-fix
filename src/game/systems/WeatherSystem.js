import { store } from '../../store/store';
import { selectCurrentWeather, WEATHER_TYPES } from '../../store/slices/weatherSlice';

/**
 * WeatherSystem
 * Handles visual weather effects (particles, tints) in the Phaser scene.
 * Uses Phaser 3.60+ particle API (ParticleEmitterManager was removed in 3.60).
 */
export class WeatherSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentWeather = WEATHER_TYPES.CLEAR;
        this.emitters = []; // array of ParticleEmitter objects

        // Create the shared particle texture
        this.createTextures();

        // Subscribe to store updates
        this.unsubscribe = store.subscribe(() => {
            const state = store.getState();
            const newWeather = selectCurrentWeather(state);
            if (newWeather !== this.currentWeather) {
                this.setWeather(newWeather);
            }
        });

        // Initial set
        this.setWeather(selectCurrentWeather(store.getState()));
    }

    createTextures() {
        if (!this.scene.textures.exists('weather-particle')) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xffffff, 1);
            gfx.fillRect(0, 0, 4, 4);
            gfx.generateTexture('weather-particle', 4, 4);
            gfx.destroy();
        }
    }

    setWeather(type) {
        this.currentWeather = type;
        this.stopAllEffects();

        switch (type) {
            case WEATHER_TYPES.RAIN:
                this.startRain();
                break;
            case WEATHER_TYPES.SNOW:
                this.startSnow();
                break;
            case WEATHER_TYPES.SANDSTORM:
                this.startSandstorm();
                break;
            // CLEAR and others: no particles
        }
    }

    stopAllEffects() {
        // Destroy all active emitters (Phaser 3.60+ API)
        this.emitters.forEach(emitter => {
            if (emitter && emitter.destroy) {
                emitter.destroy();
            }
        });
        this.emitters = [];

        // Reset camera background
        this.scene.cameras.main.setBackgroundColor(0x1A1A2E);
    }

    startRain() {
        const { width, height } = this.scene.scale;
        // Phaser 3.60+ API: scene.add.particles(x, y, texture, config) returns a ParticleEmitter
        const emitter = this.scene.add.particles(0, -50, 'weather-particle', {
            x: { min: 0, max: width },
            lifespan: 1000,
            speedY: { min: 400, max: 600 },
            speedX: { min: -20, max: 20 },
            scale: 0.5,
            quantity: 4,
            frequency: 10,
            tint: 0xaadaff,
            alpha: 0.6,
            blendMode: 'ADD',
        });
        emitter.setDepth(9999);
        emitter.setScrollFactor(0);
        this.emitters.push(emitter);

        this.scene.cameras.main.setBackgroundColor(0x555555);
    }

    startSnow() {
        const { width, height } = this.scene.scale;
        const emitter = this.scene.add.particles(0, -50, 'weather-particle', {
            x: { min: 0, max: width },
            lifespan: 3000,
            speedY: { min: 50, max: 100 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.8, end: 0.4 },
            quantity: 2,
            frequency: 50,
            tint: 0xffffff,
            alpha: 0.8,
        });
        emitter.setDepth(9999);
        emitter.setScrollFactor(0);
        this.emitters.push(emitter);
    }

    startSandstorm() {
        const { width, height } = this.scene.scale;
        const emitter = this.scene.add.particles(width + 50, 0, 'weather-particle', {
            y: { min: 0, max: height },
            lifespan: 2000,
            speedX: { min: -600, max: -400 },
            speedY: { min: -50, max: 50 },
            scale: { start: 1, end: 0.5 },
            quantity: 5,
            frequency: 20,
            tint: 0xd2b48c,
            alpha: 0.6,
        });
        emitter.setDepth(9999);
        emitter.setScrollFactor(0);
        this.emitters.push(emitter);
    }

    update() {
        // Emitters are set to setScrollFactor(0) at creation so they stay screen-space.
    }

    destroy() {
        if (this.unsubscribe) this.unsubscribe();
        this.stopAllEffects();
    }
}
