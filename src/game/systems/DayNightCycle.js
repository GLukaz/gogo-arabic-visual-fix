import { store } from '../../store/store';
import { selectTimePhase, TIME_PHASES } from '../../store/slices/timeSlice';
import { EventBus } from '../../utils/eventBus';
import { EVENTS } from '../../utils/eventBusTypes';

const TINTS = {
    [TIME_PHASES.DAWN]: 0xffdca8,      // Peach
    [TIME_PHASES.MORNING]: 0xffffff,   // Clear
    [TIME_PHASES.NOON]: 0xffffff,      // Bright
    [TIME_PHASES.AFTERNOON]: 0xffecd6, // Warm
    [TIME_PHASES.SUNSET]: 0xff8c69,    // Orange/Red
    [TIME_PHASES.NIGHT]: 0x333366,     // Dark Blue
};

const ALPHAS = {
    [TIME_PHASES.DAWN]: 0.3,
    [TIME_PHASES.MORNING]: 0,
    [TIME_PHASES.NOON]: 0,
    [TIME_PHASES.AFTERNOON]: 0.1,
    [TIME_PHASES.SUNSET]: 0.4,
    [TIME_PHASES.NIGHT]: 0.7, // Dark
};

/**
 * DayNightCycle
 * Manages global lighting/tinting based on time of day.
 */
export class DayNightCycle {
    constructor(scene) {
        this.scene = scene;
        this.overlay = null;
        this.currentPhase = null;
        this.unsubscribe = null;

        this.createOverlay();

        // Subscribe to Redux or EventBus?
        // TimeSystem emits EVENTS.TIME_PHASE_CHANGED. Use that to avoid polling or Redux overhead per frame.
        EventBus.on(EVENTS.TIME_PHASE_CHANGED, this.handlePhaseChange, this);

        // Initial set
        const state = store.getState();
        const phase = selectTimePhase(state);
        this.setPhase(phase, true); // Immediate
    }

    createOverlay() {
        const { width, height } = this.scene.scale;
        // Create a dark rectangle that covers the screen
        this.overlay = this.scene.add.rectangle(width / 2, height / 2, width + 200, height + 200, 0x000000);
        this.overlay.setScrollFactor(0);
        this.overlay.setDepth(9000); // Below HUD (HUD is usually DOM or very high depth)
        this.overlay.setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.overlay.setAlpha(0);
    }

    handlePhaseChange({ phase }) {
        if (phase !== this.currentPhase) {
            this.setPhase(phase);
        }
    }

    setPhase(phase, immediate = false) {
        this.currentPhase = phase;
        const targetColor = TINTS[phase] || 0xffffff;
        const targetAlpha = ALPHAS[phase] !== undefined ? ALPHAS[phase] : 0;

        if (immediate) {
            this.overlay.setFillStyle(targetColor);
            this.overlay.setAlpha(targetAlpha);
        } else {
            // Tween color is tricky with fillStyle, usually we just tween alpha for darkness.
            // But we want color too.
            // Phaser counters: we can tween a value object and update in onUpdate.

            const startColor = Phaser.Display.Color.IntegerToColor(this.overlay.fillColor);
            const endColor = Phaser.Display.Color.IntegerToColor(targetColor);

            this.scene.tweens.addCounter({
                from: 0,
                to: 100,
                duration: 3000, // 3 seconds transition
                onUpdate: (tween) => {
                    const val = tween.getValue();
                    const colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(
                        startColor,
                        endColor,
                        100,
                        val
                    );
                    const colorInt = Phaser.Display.Color.GetColor(colorObj.r, colorObj.g, colorObj.b);
                    this.overlay.setFillStyle(colorInt);
                }
            });

            this.scene.tweens.add({
                targets: this.overlay,
                alpha: targetAlpha,
                duration: 3000,
            });
        }
    }

    destroy() {
        EventBus.off(EVENTS.TIME_PHASE_CHANGED, this.handlePhaseChange, this);
        if (this.overlay) {
            this.scene.tweens.killTweensOf(this.overlay);
            this.overlay.destroy();
            this.overlay = null;
        }
    }
}
