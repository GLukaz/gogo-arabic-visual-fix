/**
 * BattleActionQueue — Separates battle turn calculation from visual playback.
 * Calculate all results first, then play back sequentially via next().
 * Eliminates race conditions between damage calc and animation.
 */
export class BattleActionQueue {
  constructor() {
    this._queue = [];
    this._currentIndex = 0;
  }

  /**
   * Calculate a full turn's worth of actions.
   * @param {Object} turnState - Current battle state snapshot
   * @param {Array} playerActions - Player's chosen actions
   * @param {Array} enemyActions - Enemy AI's chosen actions
   * @returns {Array} Ordered action results for playback
   */
  calculateTurn(turnState, playerActions, enemyActions) {
    const results = [];

    for (const action of playerActions) {
      results.push(this._resolveAction(action, turnState, 'player'));
    }

    for (const action of enemyActions) {
      results.push(this._resolveAction(action, turnState, 'enemy'));
    }

    this._queue = results;
    this._currentIndex = 0;
    return results;
  }

  _resolveAction(action, _state, source) {
    return {
      source,
      type: action.type,
      target: action.target,
      damage: action.damage || 0,
      healing: action.healing || 0,
      statusEffect: action.statusEffect || null,
      critical: action.critical || false,
      missed: action.missed || false,
      timestamp: Date.now(),
    };
  }

  next() {
    if (this._currentIndex >= this._queue.length) return null;
    return this._queue[this._currentIndex++];
  }

  peek() {
    if (this._currentIndex >= this._queue.length) return null;
    return this._queue[this._currentIndex];
  }

  get remaining() {
    return this._queue.length - this._currentIndex;
  }

  get isComplete() {
    return this._currentIndex >= this._queue.length;
  }

  reset() {
    this._queue = [];
    this._currentIndex = 0;
  }
}
