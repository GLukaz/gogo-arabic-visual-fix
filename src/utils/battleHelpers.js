/**
 * Battle System Helper Utilities
 * Useful functions for battle system integration and testing
 */

import { BOSSES } from '../data/bosses.js';
import { selectBattleWords } from './wordSelection.js';
import vocabulary from '../data/vocabularyAll.js';

/**
 * Get recommended boss for player level
 * Matches boss difficulty to player level
 * @param {number} playerLevel - Current player level
 * @returns {Object|null} Recommended boss or null
 */
export function getRecommendedBoss(playerLevel) {
  let targetDifficulty;
  if (playerLevel <= 5) targetDifficulty = 1;
  else if (playerLevel <= 10) targetDifficulty = 2;
  else if (playerLevel <= 15) targetDifficulty = 3;
  else if (playerLevel <= 20) targetDifficulty = 4;
  else targetDifficulty = 5;

  // Find boss closest to target difficulty
  const sortedByDifficulty = [...BOSSES].sort(
    (a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty)
  );

  return sortedByDifficulty[0] || null;
}

/**
 * Get next undefeated boss
 * Returns the easiest boss that hasn't been defeated yet
 * @param {Array<string>} defeatedBossIds - Array of defeated boss IDs
 * @returns {Object|null} Next boss or null if all defeated
 */
export function getNextUndefeatedBoss(defeatedBossIds = []) {
  const undefeated = BOSSES.filter(b => !defeatedBossIds.includes(b.id));
  if (undefeated.length === 0) return null;

  // Return easiest undefeated boss
  return undefeated.sort((a, b) => a.difficulty - b.difficulty)[0];
}

/**
 * Calculate expected battle difficulty
 * Returns a difficulty score based on boss stats and player level
 * @param {Object} boss - Boss object
 * @param {number} playerLevel - Player level
 * @returns {Object} { difficulty: number, recommendation: string }
 */
export function calculateBattleDifficulty(boss, playerLevel) {
  if (!boss) return { difficulty: 0, recommendation: 'Unknown' };

  const levelDiff = boss.difficulty - Math.floor(playerLevel / 5);
  const hpRatio = boss.hp / 100; // Normalized HP

  let difficulty = 0;
  let recommendation = '';

  // Level difference contribution
  if (levelDiff <= -2) {
    difficulty += 1;
    recommendation = 'Very Easy';
  } else if (levelDiff === -1) {
    difficulty += 2;
    recommendation = 'Easy';
  } else if (levelDiff === 0) {
    difficulty += 3;
    recommendation = 'Balanced';
  } else if (levelDiff === 1) {
    difficulty += 4;
    recommendation = 'Hard';
  } else {
    difficulty += 5;
    recommendation = 'Very Hard';
  }

  // HP contribution
  difficulty += Math.floor(hpRatio);

  return { difficulty, recommendation };
}

/**
 * Preview battle words
 * Shows what words will appear in battle (useful for testing)
 * @param {string} bossId - Boss ID
 * @param {number} count - Number of words to preview
 * @returns {Array} Array of word objects
 */
export function previewBattleWords(bossId, count = 5) {
  const boss = BOSSES.find(b => b.id === bossId);
  if (!boss) return [];

  return selectBattleWords(vocabulary, boss.category, boss.difficulty, count);
}

/**
 * Estimate battle duration
 * Returns estimated time to complete battle in seconds
 * @param {Object} boss - Boss object
 * @param {number} playerLevel - Player level
 * @returns {number} Estimated seconds
 */
export function estimateBattleDuration(boss, playerLevel) {
  if (!boss) return 0;

  // Assume 8 rounds (words) per battle
  const rounds = 8;

  // Base time per round (15 second timer)
  const baseTimePerRound = 15;

  // Adjust for player skill (higher level = faster answers)
  const skillFactor = Math.max(0.6, 1 - (playerLevel * 0.02));

  // Adjust for boss difficulty
  const difficultyFactor = 1 + (boss.difficulty * 0.1);

  return Math.ceil(rounds * baseTimePerRound * skillFactor * difficultyFactor);
}

/**
 * Get boss completion percentage
 * Returns % of bosses defeated
 * @param {Array<string>} defeatedBossIds - Array of defeated boss IDs
 * @returns {number} Percentage (0-100)
 */
export function getBossCompletionRate(defeatedBossIds = []) {
  if (BOSSES.length === 0) return 0;
  return Math.round((defeatedBossIds.length / BOSSES.length) * 100);
}

/**
 * Get total possible rewards
 * Returns sum of all XP and dirhams from all bosses
 * @returns {Object} { xp: number, dirhams: number }
 */
export function getTotalPossibleRewards() {
  return BOSSES.reduce(
    (acc, boss) => ({
      xp: acc.xp + boss.rewards.xp,
      dirhams: acc.dirhams + boss.rewards.dirhams,
    }),
    { xp: 0, dirhams: 0 }
  );
}

/**
 * Check if player is ready for boss
 * Recommends whether player should attempt battle
 * @param {Object} boss - Boss object
 * @param {number} playerLevel - Player level
 * @param {number} wordsLearned - Number of words learned
 * @returns {Object} { ready: boolean, reason: string }
 */
export function isPlayerReadyForBoss(boss, playerLevel, wordsLearned) {
  if (!boss) return { ready: false, reason: 'Invalid boss' };

  // Check level
  const recommendedLevel = boss.difficulty * 5;
  if (playerLevel < recommendedLevel - 5) {
    return {
      ready: false,
      reason: `Recommended level: ${recommendedLevel}. Come back when you're stronger!`,
    };
  }

  // Check vocabulary knowledge
  const categoryWords = vocabulary.filter(w => w.category === boss.category);
  const learnedCategoryWords = categoryWords.filter(w => wordsLearned >= categoryWords.indexOf(w));

  if (learnedCategoryWords.length < 8) {
    return {
      ready: false,
      reason: `Learn more ${boss.category} words first (need at least 8).`,
    };
  }

  // All checks passed
  if (playerLevel >= recommendedLevel + 5) {
    return { ready: true, reason: 'This battle should be easy for you!' };
  } else if (playerLevel >= recommendedLevel) {
    return { ready: true, reason: 'You are ready for this challenge!' };
  } else {
    return { ready: true, reason: 'This will be tough, but possible!' };
  }
}

/**
 * Format battle statistics for display
 * @param {Object} battleResult - Battle history entry
 * @returns {string} Formatted string
 */
export function formatBattleStats(battleResult) {
  if (!battleResult) return 'No data';

  const { bossId, victory, accuracy, timeElapsed } = battleResult;
  const boss = BOSSES.find(b => b.id === bossId);
  const minutes = Math.floor(timeElapsed / 60000);
  const seconds = Math.floor((timeElapsed % 60000) / 1000);

  return `${boss?.name || bossId}: ${victory ? 'Victory' : 'Defeat'} - ${accuracy}% accuracy in ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get achievement progress for boss battles
 * @param {Array<string>} defeatedBossIds - Defeated boss IDs
 * @returns {Array} Array of achievement objects
 */
export function getBossAchievements(defeatedBossIds = []) {
  const achievements = [];

  // First boss
  if (defeatedBossIds.length >= 1) {
    achievements.push({
      id: 'first_boss',
      name: 'First Victory',
      description: 'Defeat your first boss',
      unlocked: true,
    });
  }

  // Half of bosses
  if (defeatedBossIds.length >= BOSSES.length / 2) {
    achievements.push({
      id: 'boss_hunter',
      name: 'Boss Hunter',
      description: 'Defeat half of all bosses',
      unlocked: true,
    });
  }

  // All bosses
  if (defeatedBossIds.length >= BOSSES.length) {
    achievements.push({
      id: 'boss_master',
      name: 'Boss Master',
      description: 'Defeat all bosses',
      unlocked: true,
    });
  }

  // Specific boss tiers
  const hardBosses = defeatedBossIds.filter(id => {
    const boss = BOSSES.find(b => b.id === id);
    return boss && boss.difficulty >= 4;
  });

  if (hardBosses.length > 0) {
    achievements.push({
      id: 'elite_fighter',
      name: 'Elite Fighter',
      description: 'Defeat a difficulty 4+ boss',
      unlocked: true,
    });
  }

  return achievements;
}

/**
 * Debug: Log battle system status
 * Useful for testing and debugging (dev-only)
 * @param {Object} state - Redux state
 */
export function debugBattleSystem(state) {
  if (!import.meta.env.DEV) return;

  console.group('Battle System Debug');
  console.log('Total Bosses:', BOSSES.length);
  console.log('Defeated:', state.battle?.bossesDefeated?.length || 0);
  console.log('Completion:', getBossCompletionRate(state.battle?.bossesDefeated || []));
  console.log('Active Battle:', state.battle?.activeBattle || 'None');

  if (state.battle?.activeBattle) {
    console.log('Player HP:', state.battle.playerHP);
    console.log('Boss HP:', state.battle.bossHP, '/', state.battle.maxBossHP);
    console.log('Round:', state.battle.currentRound);
    console.log('Streak:', state.battle.streak);
  }

  console.log('Recent Battles:');
  (state.battle?.battleHistory || []).slice(0, 3).forEach((battle, i) => {
    console.log(`${i + 1}.`, formatBattleStats(battle));
  });

  console.log('Recommended Boss (Level', state.player?.level || 1, '):');
  const recommended = getRecommendedBoss(state.player?.level || 1);
  console.log(recommended?.name || 'None');
  console.groupEnd();
}
