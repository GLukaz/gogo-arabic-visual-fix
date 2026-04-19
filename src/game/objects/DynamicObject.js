import Phaser from 'phaser';

export class DynamicObject extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);
        scene.add.existing(this);

        this.id = config.id;
        this.config = config;
        this.worldStateManager = scene.worldStateManager;

        // Initial state check
        this.updateState();

        // Listen for global state changes
        if (this.worldStateManager) {
            this.scene.events.on('world-state-changed', this.handleStateChange, this);
        }
    }

    handleStateChange(change) {
        // Optimization: check if change is relevant to this object
        this.updateState();
    }

    updateState() {
        if (!this.worldStateManager) return;

        // 1. Visibility
        if (this.config.visibleCondition) {
            const isVisible = this.worldStateManager.checkCondition(this.config.visibleCondition);
            this.setVisible(isVisible);
            if (this.body) this.body.enable = isVisible;
        }

        // 2. Interactivity
        if (this.config.interactiveCondition) {
            // This might toggle a specific 'isInteractive' property used by interaction system
            this.isInteractive = this.worldStateManager.checkCondition(this.config.interactiveCondition);
        }

        // 3. Texture State (e.g. open/closed door)
        // Example config: textureState: { flag: 'door_open', map: { true: 'door-open', false: 'door-closed' } }
        if (this.config.textureState) {
            const flagVal = this.worldStateManager.getFlag(this.config.textureState.flag);
            const newTexture = this.config.textureState.map[String(flagVal)]; // keys usually strings
            if (newTexture && newTexture !== this.texture.key) {
                this.setTexture(newTexture);
            }
        }
    }

    destroy() {
        if (this.scene) {
            this.scene.events.off('world-state-changed', this.handleStateChange, this);
        }
        super.destroy();
    }
}
