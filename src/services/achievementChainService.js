/**
 * achievementChainService.js — Logic for evaluating achievement chains
 *
 * Checks which chains a player has completed, what progress they've made,
 * and what the next unlock targets are.
 */

import { ACHIEVEMENT_CHAINS, getChainById } from '../data/achievementChains.js';

/**
 * Get progress for a specific chain.
 * @param {string} chainId
 * @param {Object} unlockedAchievements - Map of achievementId → timestamp
 * @returns {Object} { chainId, name, total, completed, remaining, percentage, isComplete }
 */
export function getChainProgress(chainId, unlockedAchievements = {}) {
  const chain = getChainById(chainId);
  if (!chain) return null;

  const unlocked = new Set(Object.keys(unlockedAchievements));
  const completed = chain.prerequisiteIds.filter((id) => unlocked.has(id));
  const remaining = chain.prerequisiteIds.filter((id) => !unlocked.has(id));
  const total = chain.prerequisiteIds.length;

  return {
    chainId: chain.id,
    name: chain.name,
    nameArabic: chain.nameArabic,
    icon: chain.icon,
    xpReward: chain.xpReward,
    rarity: chain.rarity,
    total,
    completed: completed.length,
    completedIds: completed,
    remaining,
    percentage: total > 0 ? Math.round((completed.length / total) * 100) : 0,
    isComplete: remaining.length === 0,
  };
}

/**
 * Get all chains with their progress.
 * @param {Object} unlockedAchievements
 * @returns {Array}
 */
export function getAllChainProgress(unlockedAchievements = {}) {
  return ACHIEVEMENT_CHAINS.map((chain) =>
    getChainProgress(chain.id, unlockedAchievements)
  );
}

/**
 * Get chains that are fully completed.
 * @param {Object} unlockedAchievements
 * @returns {Array}
 */
export function getUnlockedChains(unlockedAchievements = {}) {
  return getAllChainProgress(unlockedAchievements).filter((p) => p.isComplete);
}

/**
 * Get chains that are in progress but not yet completed.
 * @param {Object} unlockedAchievements
 * @returns {Array} Sorted by percentage complete (highest first)
 */
export function getInProgressChains(unlockedAchievements = {}) {
  return getAllChainProgress(unlockedAchievements)
    .filter((p) => !p.isComplete && p.completed > 0)
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Get the next achievement targets to work toward for chain completions.
 * Returns the closest-to-completion chains and their missing achievements.
 * @param {Object} unlockedAchievements
 * @param {number} [limit=3]
 * @returns {Array}
 */
export function getNextChainTargets(unlockedAchievements = {}, limit = 3) {
  return getInProgressChains(unlockedAchievements)
    .slice(0, limit)
    .map((p) => ({
      chainId: p.chainId,
      name: p.name,
      nameArabic: p.nameArabic,
      percentage: p.percentage,
      remaining: p.remaining,
      xpReward: p.xpReward,
    }));
}

/**
 * Check if a newly unlocked achievement triggers any chain completions.
 * @param {string} newAchievementId - The achievement that was just unlocked
 * @param {Object} unlockedAchievements - All unlocked achievements (including the new one)
 * @returns {Array} List of newly completed chains
 */
export function checkChainCompletions(newAchievementId, unlockedAchievements = {}) {
  return ACHIEVEMENT_CHAINS.filter((chain) => {
    // Chain must include the new achievement
    if (!chain.prerequisiteIds.includes(newAchievementId)) return false;
    // All prerequisites must be met
    const unlocked = new Set(Object.keys(unlockedAchievements));
    return chain.prerequisiteIds.every((id) => unlocked.has(id));
  }).map((chain) => ({
    chainId: chain.id,
    name: chain.name,
    nameArabic: chain.nameArabic,
    icon: chain.icon,
    xpReward: chain.xpReward,
    rarity: chain.rarity,
  }));
}
