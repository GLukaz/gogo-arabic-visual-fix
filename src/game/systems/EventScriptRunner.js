/**
 * EventScriptRunner.js
 *
 * Sequential command executor for cutscene-like event sequences.
 *
 * Runs a JSON command array one command at a time, emitting EventBus
 * events for each command and honoring per-command delay overrides.
 *
 * Enables orchestrated multi-step sequences such as:
 *   speech → wait 1s → setFlag → speech → teleport
 *
 * Usage:
 *   const runner = new EventScriptRunner(EventBus);
 *   await runner.run([
 *     { type: 'speech', npcId: 'scholar-yusuf', dialogueKey: 'intro', delay: 0 },
 *     { type: 'setFlag', flagId: 'met_scholar', value: true, delay: 500 },
 *   ]);
 */

export class EventScriptRunner {
  /**
   * @param {Object} emitter - EventBus instance (any object with `.emit()`)
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.running = false;
  }

  /**
   * Execute an array of commands sequentially.
   * Each command is emitted as `ACTION_{type.toUpperCase()}` on the emitter.
   * Execution respects `cmd.delay` (ms) between commands (default 0).
   *
   * Calling `stop()` mid-run causes the loop to break after the current command.
   *
   * @param {Object[]} commands - Array of command descriptors
   * @returns {Promise<void>} Resolves when all commands finish or stop() is called
   */
  async run(commands) {
    if (!Array.isArray(commands) || commands.length === 0) return;

    this.running = true;
    for (const cmd of commands) {
      if (!this.running) break;
      await this._executeCommand(cmd);
    }
    this.running = false;
  }

  /**
   * Execute a single command: emit event + wait for delay.
   *
   * @param {Object} cmd - Command descriptor (must have `type` string)
   * @returns {Promise<void>}
   */
  _executeCommand(cmd) {
    return new Promise((resolve) => {
      // Emit the action event so registered consumers can handle it
      this.emitter.emit(`ACTION_${cmd.type.toUpperCase()}`, cmd);
      // Wait for specified delay (ms) or default to 0 (immediate)
      setTimeout(resolve, cmd.delay || 0);
    });
  }

  /**
   * Request stop after the current command completes.
   * The `run()` promise will resolve shortly after this is called.
   */
  stop() {
    this.running = false;
  }
}
