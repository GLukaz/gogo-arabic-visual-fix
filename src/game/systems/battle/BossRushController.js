/**
 * BossRushController.js — Boss rush mode: sequential boss fights with story interludes.
 *
 * Sequences all bosses from BOSS_RUSH_SEQUENCE (arenaChallenges.js) in story order.
 * Between fights, shows Arabic narrative interludes via BossRushInterlude React component.
 * Requires all bosses defeated in story mode to unlock (checks bossesDefeated in battleSlice).
 * Submits total score to arena leaderboard on completion.
 *
 * Phase 32 — Plan 32-08
 */

import { store } from '../../../store/store.js';
import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { BOSS_RUSH_SEQUENCE } from '../../../data/arenaChallenges.js';
import { getEnemy } from '../../../data/enemies.js';
import { startBattle } from '../../../store/slices/battleSlice.js';
import { submitArenaScore } from '../../../store/slices/arenaSlice.js';

export class BossRushController {
  /**
   * @param {Phaser.Scene} scene - The battle scene instance
   */
  constructor(scene) {
    this.scene = scene;
    this.currentBossIndex = 0;
    this.totalScore = 0;
    this.bossResults = []; // [{ bossId, victory, score, accuracy, time }]
    this.isActive = false;
    this._onContinue = null;
  }

  /**
   * Check if boss rush is unlocked.
   * Requires all bosses in BOSS_RUSH_SEQUENCE defeated in story mode.
   * @returns {boolean}
   */
  static isUnlocked() {
    const defeated = store.getState().battle.bossesDefeated;
    return BOSS_RUSH_SEQUENCE.every((entry) => defeated.includes(entry.bossId));
  }

  /**
   * Get list of bosses not yet defeated (for UI display of unlock progress).
   * @returns {string[]} Array of undefeated boss IDs
   */
  static getUndefeatedBosses() {
    const defeated = store.getState().battle.bossesDefeated;
    return BOSS_RUSH_SEQUENCE
      .filter((entry) => !defeated.includes(entry.bossId))
      .map((entry) => entry.bossId);
  }

  /**
   * Start the boss rush sequence.
   * @returns {boolean} true if started, false if not unlocked
   */
  start() {
    if (!BossRushController.isUnlocked()) {
      return false;
    }

    this.currentBossIndex = 0;
    this.totalScore = 0;
    this.bossResults = [];
    this.isActive = true;

    // Listen for interlude dismissal from React
    this._onContinue = () => this.onInterludeDismissed();
    EventBus.on(EVENTS.BOSS_RUSH_CONTINUE, this._onContinue);

    EventBus.emit(EVENTS.BOSS_RUSH_STARTED, {
      totalBosses: BOSS_RUSH_SEQUENCE.length,
    });

    this.startNextBoss();
    return true;
  }

  /**
   * Proceed to the next boss in the sequence.
   * Shows interlude between fights (except before the first boss).
   */
  startNextBoss() {
    const entry = BOSS_RUSH_SEQUENCE[this.currentBossIndex];

    if (!entry) {
      this._completeRush();
      return;
    }

    // Show interlude before every boss (the first boss gets its own intro text too)
    if (this.currentBossIndex > 0) {
      const prevEntry = BOSS_RUSH_SEQUENCE[this.currentBossIndex - 1];
      EventBus.emit(EVENTS.BOSS_RUSH_INTERLUDE, {
        interlude: prevEntry.interlude,
        nextBossId: entry.bossId,
        nextBossData: getEnemy(entry.bossId),
        bossIndex: this.currentBossIndex,
        totalBosses: BOSS_RUSH_SEQUENCE.length,
      });
      // Wait for React component to emit BOSS_RUSH_CONTINUE
    } else {
      this._launchBoss(entry);
    }
  }

  /**
   * Called when player dismisses the interlude overlay.
   */
  onInterludeDismissed() {
    if (!this.isActive) return;

    const entry = BOSS_RUSH_SEQUENCE[this.currentBossIndex];
    if (entry) {
      this._launchBoss(entry);
    }
  }

  /**
   * Launch a boss battle.
   * @param {{ bossId: string }} entry - Boss rush sequence entry
   * @private
   */
  _launchBoss(entry) {
    const enemyData = getEnemy(entry.bossId);
    if (!enemyData) {
      // Skip missing bosses gracefully
      this.bossResults.push({
        bossId: entry.bossId,
        victory: true,
        score: 0,
        accuracy: 0,
        time: 0,
      });
      this.currentBossIndex++;
      this.startNextBoss();
      return;
    }

    // Scale boss HP for rush mode (10% harder per boss in sequence)
    const hpMultiplier = 1 + this.currentBossIndex * 0.1;
    const scaledHP = Math.floor(enemyData.baseHP * hpMultiplier);

    store.dispatch(
      startBattle({
        bossId: enemyData.id,
        bossHP: scaledHP,
        encounterType: 'arena',
        zone: enemyData.zone,
        enemyData: {
          ...enemyData,
          baseHP: scaledHP,
        },
      })
    );

    EventBus.emit(EVENTS.BATTLE_STATE_CHANGED, {
      to: 'ACTION_SELECT',
      actions: ['attack', 'magic', 'defend', 'item'],
    });
  }

  /**
   * Called when a boss is defeated or player loses.
   * @param {{ victory: boolean, score?: number, accuracy?: number, timeElapsed?: number }} result
   */
  onBossDefeated(result) {
    if (!this.isActive) return;

    const currentEntry = BOSS_RUSH_SEQUENCE[this.currentBossIndex];
    const bossResult = {
      bossId: currentEntry ? currentEntry.bossId : 'unknown',
      victory: result.victory,
      score: result.score || 0,
      accuracy: result.accuracy || 0,
      time: result.timeElapsed || 0,
    };

    this.bossResults.push(bossResult);
    this.totalScore += bossResult.score;
    this.currentBossIndex++;

    EventBus.emit(EVENTS.BOSS_RUSH_BOSS_DEFEATED, {
      ...bossResult,
      bossIndex: this.currentBossIndex - 1,
      totalBosses: BOSS_RUSH_SEQUENCE.length,
    });

    if (!result.victory) {
      // Boss rush failed on this boss
      this._failRush();
      return;
    }

    // Continue to next boss
    this.startNextBoss();
  }

  /**
   * Complete the boss rush successfully (all bosses defeated).
   * @private
   */
  _completeRush() {
    this.isActive = false;
    this._cleanupListeners();

    const totalAccuracy = this._averageAccuracy();

    store.dispatch(
      submitArenaScore({
        mode: 'boss_rush',
        score: this.totalScore,
        wavesCompleted: this.bossResults.length,
        accuracy: totalAccuracy,
        timestamp: Date.now(),
      })
    );

    EventBus.emit(EVENTS.ARENA_COMPLETE, {
      mode: 'boss_rush',
      victory: true,
      totalScore: this.totalScore,
      bossResults: this.bossResults,
      accuracy: totalAccuracy,
      bossesDefeated: this.bossResults.length,
      totalBosses: BOSS_RUSH_SEQUENCE.length,
    });
  }

  /**
   * Handle boss rush failure.
   * @private
   */
  _failRush() {
    this.isActive = false;
    this._cleanupListeners();

    const totalAccuracy = this._averageAccuracy();
    const bossesCleared = this.bossResults.filter((r) => r.victory).length;

    store.dispatch(
      submitArenaScore({
        mode: 'boss_rush',
        score: this.totalScore,
        wavesCompleted: bossesCleared,
        accuracy: totalAccuracy,
        timestamp: Date.now(),
      })
    );

    EventBus.emit(EVENTS.ARENA_COMPLETE, {
      mode: 'boss_rush',
      victory: false,
      totalScore: this.totalScore,
      bossResults: this.bossResults,
      accuracy: totalAccuracy,
      bossesDefeated: bossesCleared,
      totalBosses: BOSS_RUSH_SEQUENCE.length,
      failedAt: this.bossResults.length - 1,
    });
  }

  /**
   * Calculate average accuracy across all boss results.
   * @returns {number} Average accuracy (0-1)
   * @private
   */
  _averageAccuracy() {
    if (this.bossResults.length === 0) return 0;
    const total = this.bossResults.reduce((sum, r) => sum + r.accuracy, 0);
    return Math.round((total / this.bossResults.length) * 100) / 100;
  }

  /**
   * Remove EventBus listeners.
   * @private
   */
  _cleanupListeners() {
    if (this._onContinue) {
      EventBus.off(EVENTS.BOSS_RUSH_CONTINUE, this._onContinue);
      this._onContinue = null;
    }
  }

  /**
   * Get current progress.
   * @returns {{ currentBoss: number, totalBosses: number, totalScore: number, bossResults: Array }}
   */
  getProgress() {
    return {
      currentBoss: this.currentBossIndex,
      totalBosses: BOSS_RUSH_SEQUENCE.length,
      totalScore: this.totalScore,
      bossResults: [...this.bossResults],
    };
  }

  /**
   * Clean up the controller.
   */
  destroy() {
    this.isActive = false;
    this._cleanupListeners();
  }
}
