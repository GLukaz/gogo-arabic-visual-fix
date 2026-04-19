import { DynamicObject } from './DynamicObject.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';

export class RiddleGate extends DynamicObject {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture, config);

        this.riddle = config.riddle; // { question: '...', answer: ['key', 'miftah'] }
        this.isSolved = false;

        // Make interactive
        this.setInteractive();
        this.on('pointerdown', this.handleInteract, this);

        // Also listen for spacebar interaction via InteractableManager if registered there, 
        // or just handle pointerdown for now.
    }

    handleInteract() {
        if (this.isSolved) return;

        // Trigger UI
        // In a real implementation, this would emit an event caught by RiddleModal.jsx
        // For now, we simulate success or use window.prompt for debugging if allowed, 
        // or better: emit event for the HUD to handle.

        // Emit event:
        EventBus.emit(EVENTS.SHOW_DIALOGUE, {
            speakerName: this.config.speakerName || 'Guardian',
            text: this.riddle.question,
            type: 'riddle', // Special type for input
            config: {
                answers: this.riddle.answers,
                onCorrect: () => this.solve(),
                onIncorrect: () => this.fail()
            }
        });
    }

    solve() {
        this.isSolved = true;
        this.scene.events.emit('riddle-solved', { id: this.id });

        // Update World State
        if (this.worldStateManager) {
            this.worldStateManager.setFlag(`riddle_solved_${this.id}`, true);
        }

        // Visual feedback (fade out, open door texture, etc.)
        if (this.config.onSolve === 'destroy') {
            this.destroy();
        } else if (this.config.onSolve === 'texture') {
            this.setTexture(this.config.solveTexture);
        }
    }

    fail() {
        // Play error sound
    }
}
