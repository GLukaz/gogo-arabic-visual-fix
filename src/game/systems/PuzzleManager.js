import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';

export class PuzzleManager {
    constructor(scene) {
        this.scene = scene;
        this.activeSequences = {}; // { puzzleId: ['A', 'B'] }
        this.solvedPuzzles = new Set();
    }

    // Register an input for a sequence puzzle
    handleInput(puzzleId, inputKey, correctSequence) {
        if (this.solvedPuzzles.has(puzzleId)) return;

        if (!this.activeSequences[puzzleId]) {
            this.activeSequences[puzzleId] = [];
        }

        const currentSequence = this.activeSequences[puzzleId];
        currentSequence.push(inputKey);

        // Check if correct so far
        const relevantPart = correctSequence.slice(0, currentSequence.length);
        if (JSON.stringify(currentSequence) !== JSON.stringify(relevantPart)) {
            // Incorrect input, reset
            this.activeSequences[puzzleId] = [];
            this.scene.events.emit('puzzle-failed', { puzzleId });
            // Optional: Play error sound
            return;
        }

        // Check if complete
        if (currentSequence.length === correctSequence.length) {
            this.completePuzzle(puzzleId);
        } else {
            // Correct step, play success sound or visual feedback
            this.scene.events.emit('puzzle-step-correct', { puzzleId, step: currentSequence.length });
        }
    }

    completePuzzle(puzzleId) {
        this.solvedPuzzles.add(puzzleId);
        this.activeSequences[puzzleId] = [];

        // Update World State
        if (this.scene.worldStateManager) {
            this.scene.worldStateManager.setFlag(`puzzle_solved_${puzzleId}`, true);
        }

        this.scene.events.emit('puzzle-solved', { puzzleId });
    }

    destroy() {
        this.activeSequences = {};
        this.solvedPuzzles.clear();
    }
}
