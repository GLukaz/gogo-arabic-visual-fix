/**
 * MultiTargetManager.js — Multi-enemy positioning, targeting, and row damage modifiers.
 *
 * Manages up to 4 enemies in front/back row formation.
 * Does NOT read Redux directly — receives data, updates pushed to it.
 * Sprite creation is delegated to BattleSpriteManager — this class
 * manages positions and targeting logic only.
 *
 * Row layout (enemies on left side, RTL):
 *   Front row (indices 0-1): y=55%, x=20% and x=35%
 *   Back row (indices 2-3): y=45%, x=15% and x=30% (smaller scale for depth)
 *
 * Damage modifiers:
 *   Front -> Front: 1.0 (full damage, melee range)
 *   Back -> Front:  1.0 (ranged OK)
 *   Front -> Back:  0.8 (reach penalty)
 *   Back -> Back:   0.7 (double reach penalty)
 */

export class MultiTargetManager {
  constructor(scene) {
    this.scene = scene;
    this.enemies = []; // [{ enemyId, index, row, defeated, sprite? }]
  }

  /**
   * Initialize enemies from party config.
   * @param {Array} enemyParty - [{ enemyId, row? }] or string[] of enemy IDs
   * @returns {Array} enemy position/row data for sprite placement
   */
  initEnemies(enemyParty) {
    this.enemies = enemyParty.map((entry, index) => {
      const enemyId = typeof entry === 'string' ? entry : entry.enemyId;
      const row = typeof entry === 'string'
        ? (index < 2 ? 'front' : 'back')
        : (entry.row || (index < 2 ? 'front' : 'back'));

      return {
        enemyId,
        index,
        row,
        defeated: false,
        sprite: null, // Set externally by BattleSpriteManager
      };
    });

    return this.enemies.map((enemy) => ({
      enemyId: enemy.enemyId,
      index: enemy.index,
      row: enemy.row,
      position: this.getEnemyPosition(enemy.index, enemy.row),
    }));
  }

  /**
   * Get pixel positions for enemy placement.
   * Front row: 2 positions at y=55%, x=20% and x=35%
   * Back row: 2 positions at y=45%, x=15% and x=30% (smaller scale for depth)
   * @param {number} index - Enemy index (0-3)
   * @param {string} row - 'front' or 'back'
   * @returns {{ x: number, y: number, scale: number }} pixel position and scale
   */
  getEnemyPosition(index, row) {
    const { width, height } = this.scene.cameras.main;

    // Calculate slot within row (0 or 1)
    const frontIndices = this.enemies
      .filter((e) => e.row === 'front')
      .map((e) => e.index);
    const backIndices = this.enemies
      .filter((e) => e.row === 'back')
      .map((e) => e.index);

    if (row === 'front') {
      const slot = frontIndices.indexOf(index);
      const xPositions = [0.20, 0.35];
      return {
        x: width * (xPositions[slot] ?? xPositions[0]),
        y: height * 0.55,
        scale: 2,
      };
    } else {
      const slot = backIndices.indexOf(index);
      const xPositions = [0.15, 0.30];
      return {
        x: width * (xPositions[slot] ?? xPositions[0]),
        y: height * 0.45,
        scale: 1.6, // Smaller for depth perception
      };
    }
  }

  /**
   * Calculate damage modifier based on attacker/target rows.
   * Front -> Front: 1.0 (full damage, melee range)
   * Back -> Front:  1.0 (ranged OK)
   * Front -> Back:  0.8 (reach penalty)
   * Back -> Back:   0.7 (double reach penalty)
   * @param {string} attackerRow - 'front' or 'back'
   * @param {string} targetRow - 'front' or 'back'
   * @returns {number} damage multiplier
   */
  getRowDamageModifier(attackerRow, targetRow) {
    if (targetRow === 'front') {
      return 1.0; // Front row always takes full damage
    }
    // Target is in back row
    if (attackerRow === 'front') {
      return 0.8; // Front attacking back: reach penalty
    }
    return 0.7; // Back attacking back: double reach penalty
  }

  /**
   * Get valid targets for an action type.
   * @param {string} targetType - 'single', 'front_row', 'all', 'back_row'
   * @returns {Array} indices of valid target enemies
   */
  getValidTargets(targetType) {
    switch (targetType) {
      case 'single':
        return this.enemies
          .filter((e) => !e.defeated)
          .map((e) => e.index);

      case 'front_row':
        return this.enemies
          .filter((e) => !e.defeated && e.row === 'front')
          .map((e) => e.index);

      case 'back_row':
        return this.enemies
          .filter((e) => !e.defeated && e.row === 'back')
          .map((e) => e.index);

      case 'all':
        return this.enemies
          .filter((e) => !e.defeated)
          .map((e) => e.index);

      default:
        return this.enemies
          .filter((e) => !e.defeated)
          .map((e) => e.index);
    }
  }

  /**
   * Check if all enemies are defeated.
   * @returns {boolean}
   */
  allDefeated() {
    return this.enemies.length > 0 && this.enemies.every((e) => e.defeated);
  }

  /**
   * Get front row enemies (for default targeting).
   * @returns {Array} front row enemy entries
   */
  getFrontRow() {
    return this.enemies.filter((e) => e.row === 'front' && !e.defeated);
  }

  /**
   * Get back row enemies.
   * @returns {Array} back row enemy entries
   */
  getBackRow() {
    return this.enemies.filter((e) => e.row === 'back' && !e.defeated);
  }

  /**
   * Mark an enemy as defeated and handle fade-out animation.
   * @param {number} enemyIndex - Index of the defeated enemy
   */
  handleEnemyDefeat(enemyIndex) {
    const enemy = this.enemies[enemyIndex];
    if (!enemy) return;

    enemy.defeated = true;

    // Fade out the sprite if it has one
    if (enemy.sprite && this.scene?.tweens) {
      this.scene.tweens.add({
        targets: enemy.sprite,
        alpha: 0,
        duration: 800,
        delay: 200,
        onComplete: () => {
          enemy.sprite?.setVisible(false);
        },
      });
    }
  }

  /**
   * Attach a sprite reference to an enemy (set by BattleSpriteManager).
   * @param {number} enemyIndex - Index of the enemy
   * @param {object} sprite - Phaser sprite reference
   */
  setEnemySprite(enemyIndex, sprite) {
    const enemy = this.enemies[enemyIndex];
    if (enemy) {
      enemy.sprite = sprite;
    }
  }

  /**
   * Get enemy by index.
   * @param {number} enemyIndex
   * @returns {object|null} enemy entry or null
   */
  getEnemy(enemyIndex) {
    return this.enemies[enemyIndex] || null;
  }

  /**
   * Clean up all enemy references and sprites.
   */
  destroy() {
    this.enemies = [];
    this.scene = null;
  }
}
