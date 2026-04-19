import { DynamicObject } from './DynamicObject.js';

export class SecretWall extends DynamicObject {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture, config);

        this.isHidden = false;
        this.initialAlpha = this.alpha;

        // Config:
        // triggerCondition: { flag: 'found_secret_switch' }
        // interactReveal: true (if true, player can interact to reveal if close)
    }

    updateState() {
        super.updateState();
        if (!this.worldStateManager) return;

        if (this.config.triggerCondition) {
            const conditionMet = this.worldStateManager.checkCondition(this.config.triggerCondition);
            if (conditionMet && !this.isHidden) {
                this.reveal();
            } else if (!conditionMet && this.isHidden) {
                this.hide();
            }
        }
    }

    reveal() {
        this.isHidden = true;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.setVisible(false);
                if (this.body) this.body.enable = false;
            }
        });
        // Play sound?
    }

    hide() {
        this.isHidden = false;
        this.setVisible(true);
        if (this.body) this.body.enable = true;
        this.scene.tweens.add({
            targets: this,
            alpha: this.initialAlpha,
            duration: 1000
        });
    }
}
