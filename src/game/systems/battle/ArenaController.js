/**
 * ArenaController.js — Wave-based arena progression manager (Phase 32).
 *
 * Manages wave flow, enemy generation, difficulty scaling, scoring,
 * and memory cleanup between waves. Phaser-side class that reads
 * Redux store directly and communicates with React ArenaHUD via EventBus.
 *
 * Score formula per wave:
 *   base(100) + accuracy(0-50) + speed(0-50) + streak(20/wave) + bonus(100)
 *
 * Accuracy is rewarded MORE than speed to incentivize correct Arabic input.
 */

import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { store } from '../../../store/store.js';
import {
  startArenaChallenge,
  completeArenaWave,
  endArenaChallenge,
  submitArenaScore,
} from '../../../store/slices/arenaSlice.js';
import { getWaveConfig, ARENA_MODES } from '../../../data/arenaChallenges.js';
import enemies from '../../../data/enemies.js';

// ──────────────────────────────────────────────────
// Difficulty tier mapping — enemies.js uses string difficulty
// ──────────────────────────────────────────────────

const DIFFICULTY_TIERS = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
};

/**
 * Get numeric difficulty from enemy string difficulty.
 * @param {string} diff - 'easy', 'medium', 'hard', 'expert'
 * @returns {number} 1-4
 */
function numericDifficulty(diff) {
  return DIFFICULTY_TIERS[diff] || 2;
}

export class ArenaController {
  /**
   * @param {Phaser.Scene} scene - The BattleScene instance
   * @param {Object} arenaConfig - { mode: 'survival'|'boss_rush'|'puzzle', maxWaves?, ... }
   */
  constructor(scene, arenaConfig) {
    this.scene = scene;
    this.config = arenaConfig;
    this.currentWave = 0;
    this.score = 0;
    this.streak = 0;
    this.waveStartTime = null;
    this.totalAccuracy = 0;
    this.totalAnswers = 0;
    this.isActive = false;
  }

  /**
   * Start the arena challenge. Dispatches to Redux and begins first wave.
   */
  start() {
    this.isActive = true;
    this.currentWave = 0;
    this.score = 0;
    this.streak = 0;
    this.totalAccuracy = 0;
    this.totalAnswers = 0;

    store.dispatch(startArenaChallenge({ mode: this.config.mode }));

    this.startWave();
  }

  /**
   * Advance to the next wave. Generates enemies, emits wave start event.
   * @returns {{ enemyParty: Array, waveConfig: Object }}
   */
  startWave() {
    this.currentWave++;
    this.waveStartTime = Date.now();

    const waveConfig = getWaveConfig(this.currentWave);
    const enemyParty = this._generateWaveEnemies(waveConfig);

    // Emit wave start event (React ArenaHUD listens)
    EventBus.emit(EVENTS.ARENA_WAVE_START, {
      wave: this.currentWave,
      maxWaves: this._getMaxWaves(),
      enemies: enemyParty,
      arabicDifficulty: waveConfig.arabicDifficulty,
      timeLimit: waveConfig.timeLimit,
      bonusObjective: waveConfig.bonusObjective,
    });

    return { enemyParty, waveConfig };
  }

  /**
   * Called when a wave battle concludes.
   * Calculates score, updates streak, checks for arena completion.
   * @param {Object} battleResult - { victory, accuracy?, enemiesDefeated?, bonusCompleted? }
   */
  onWaveComplete(battleResult) {
    const waveTime = Date.now() - this.waveStartTime;
    const waveScore = this._calculateWaveScore(battleResult, waveTime);
    this.score += waveScore;

    // Track accuracy for final average
    if (battleResult.accuracy !== undefined) {
      this.totalAccuracy += battleResult.accuracy;
      this.totalAnswers++;
    }

    if (battleResult.victory) {
      this.streak++;

      // Dispatch wave completion to Redux
      store.dispatch(
        completeArenaWave({
          score: waveScore,
          accuracy: battleResult.accuracy || 0,
          enemiesDefeated: battleResult.enemiesDefeated || 1,
        })
      );

      EventBus.emit(EVENTS.ARENA_WAVE_COMPLETE, {
        wave: this.currentWave,
        score: waveScore,
        totalScore: this.score,
        streak: this.streak,
      });

      // Check arena completion
      const maxWaves = this._getMaxWaves();
      if (this.currentWave >= maxWaves) {
        this._completeArena();
      } else {
        // Clean up sprite pools between waves
        this._cleanupBetweenWaves();

        // 3-second breathing room between waves
        this.scene.time.delayedCall(3000, () => {
          if (this.isActive) {
            this.startWave();
          }
        });
      }
    } else {
      // Defeat ends the arena run
      this._failArena();
    }
  }

  // ──────────────────────────────────────────────────
  // Scoring
  // ──────────────────────────────────────────────────

  /**
   * Calculate score for a single wave.
   * Formula: base(100) + accuracy(0-50) + speed(0-50) + streak(20/wave) + bonus(100)
   *
   * @param {Object} result - { accuracy?, bonusCompleted? }
   * @param {number} waveTime - Time in ms to complete wave
   * @returns {number} wave score
   */
  _calculateWaveScore(result, waveTime) {
    const baseScore = 100;
    // Accuracy bonus: up to 50 points (accuracy is 0-1)
    const accuracyBonus = (result.accuracy || 0) * 50;
    // Speed bonus: up to 50 points, lose 1 per second, minimum 0
    const speedBonus = Math.max(0, 50 - Math.floor(waveTime / 1000));
    // Streak bonus: 20 per consecutive wave victory
    const streakBonus = this.streak * 20;
    // Bonus objective: 100 points
    const bonusObjectivePoints = result.bonusCompleted ? 100 : 0;

    return Math.floor(
      baseScore + accuracyBonus + speedBonus + streakBonus + bonusObjectivePoints
    );
  }

  // ──────────────────────────────────────────────────
  // Enemy generation
  // ──────────────────────────────────────────────────

  /**
   * Generate enemy party for a wave based on wave config.
   *
   * Difficulty tiers by wave number:
   *   waves 1-3: easy + medium
   *   waves 4-6: medium + hard
   *   waves 7-9: hard + expert
   *   wave 10:   hard + expert + boss
   *
   * @param {Object} waveConfig - From getWaveConfig()
   * @returns {Array<{ enemyId: string, hpMultiplier: number }>}
   */
  _generateWaveEnemies(waveConfig) {
    const allEnemies = enemies;

    // Determine difficulty range from wave number
    const waveTier = Math.max(1, Math.ceil(this.currentWave / 3));
    const minDiff = waveTier;
    const maxDiff = Math.min(4, waveTier + 1);

    // Filter to non-boss enemies in difficulty range
    const pool = allEnemies.filter((e) => {
      const diff = numericDifficulty(e.difficulty);
      return diff >= minDiff && diff <= maxDiff && e.encounterType !== 'boss';
    });

    // If pool is empty, use all non-boss enemies as fallback
    const effectivePool = pool.length > 0 ? pool : allEnemies.filter((e) => e.encounterType !== 'boss');

    // Randomly select enemyCount enemies (allow repeats)
    const party = [];
    for (let i = 0; i < waveConfig.enemyCount; i++) {
      const enemy = effectivePool[Math.floor(Math.random() * effectivePool.length)];
      party.push(enemy.id);
    }

    // Wave 10 special: include one boss-type enemy
    const maxWaves = this._getMaxWaves();
    if (this.currentWave >= maxWaves) {
      const bosses = allEnemies.filter((e) => e.encounterType === 'boss');
      if (bosses.length > 0) {
        party[0] = bosses[Math.floor(Math.random() * bosses.length)].id;
      }
    }

    // Apply hpMultiplier from waveConfig
    return party.map((id) => ({
      enemyId: id,
      hpMultiplier: waveConfig.hpMultiplier,
    }));
  }

  // ──────────────────────────────────────────────────
  // Cleanup between waves
  // ──────────────────────────────────────────────────

  /**
   * Clean up sprite pools between waves to prevent memory leaks.
   * Reuses the scene instance — does NOT destroy/recreate it.
   */
  _cleanupBetweenWaves() {
    // Clear enemy sprites if sprite manager supports it
    if (this.scene.sprites?.clearEnemies) {
      this.scene.sprites.clearEnemies();
    }

    // Clear floating damage numbers
    if (this.scene.damagePool?.clear) {
      this.scene.damagePool.clear();
    }

    // Clear active spell/status effects
    if (this.scene.effects?.clearActive) {
      this.scene.effects.clearActive();
    }
  }

  // ──────────────────────────────────────────────────
  // Arena completion
  // ──────────────────────────────────────────────────

  /**
   * Handle successful arena completion (all waves cleared).
   */
  _completeArena() {
    this.isActive = false;
    const avgAccuracy =
      this.totalAnswers > 0 ? this.totalAccuracy / this.totalAnswers : 0;

    store.dispatch(
      endArenaChallenge({ victory: true, finalScore: this.score })
    );
    store.dispatch(
      submitArenaScore({
        mode: this.config.mode,
        score: this.score,
        wavesCompleted: this.currentWave,
        accuracy: avgAccuracy,
        timestamp: Date.now(),
      })
    );

    EventBus.emit(EVENTS.ARENA_COMPLETE, {
      victory: true,
      score: this.score,
      wavesCompleted: this.currentWave,
      accuracy: avgAccuracy,
      streak: this.streak,
    });
  }

  /**
   * Handle arena failure (player defeated during a wave).
   */
  _failArena() {
    this.isActive = false;
    const avgAccuracy =
      this.totalAnswers > 0 ? this.totalAccuracy / this.totalAnswers : 0;

    store.dispatch(
      endArenaChallenge({ victory: false, finalScore: this.score })
    );
    store.dispatch(
      submitArenaScore({
        mode: this.config.mode,
        score: this.score,
        wavesCompleted: this.currentWave - 1,
        accuracy: avgAccuracy,
        timestamp: Date.now(),
      })
    );

    EventBus.emit(EVENTS.ARENA_COMPLETE, {
      victory: false,
      score: this.score,
      wavesCompleted: this.currentWave - 1,
      accuracy: avgAccuracy,
    });
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  /**
   * Get maximum waves for the current arena mode.
   * @returns {number}
   */
  _getMaxWaves() {
    return (
      this.config.maxWaves ||
      ARENA_MODES[this.config.mode]?.maxWaves ||
      10
    );
  }

  /**
   * Clean up and stop the arena.
   */
  destroy() {
    this.isActive = false;
    this._cleanupBetweenWaves();
  }
}
