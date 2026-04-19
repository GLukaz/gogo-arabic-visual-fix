/**
 * Achievement Middleware
 *
 * Listens to Redux actions and checks if any achievements should be unlocked.
 * Auto-dispatches unlockAchievement and addXP when conditions are met.
 */

import { ACHIEVEMENTS } from '../../data/achievements.js';
import vocabularyData from '../../data/vocabularyAll.js';
import { unlockAchievement, recordPerfectQuiz, completeChain } from '../slices/achievementSlice.js';
import { addXP } from '../slices/playerSlice.js';
import { SKILL_TREES } from '../../data/skillTrees.js';
import { checkChainCompletions } from '../../services/achievementChainService.js';

/**
 * evaluateAchievementConditions — pure function that checks whether a single
 * achievement's requirement is satisfied by the current player state.
 *
 * Exported for testing and for use in analytics/UI without a Redux store.
 *
 * @param {Object} achievementDef - Achievement definition (from ACHIEVEMENTS)
 * @param {Object} playerState - Full Redux state snapshot
 * @returns {boolean}
 */
export function evaluateAchievementConditions(achievementDef, playerState) {
  return isAchievementMet(achievementDef, playerState);
}

// Helper to check if an achievement requirement is met
function isAchievementMet(achievement, state) {
  const req = achievement.requirement;
  const { player, vocabulary, quests, alphabet, achievements } = state;

  switch (req.type) {
    case 'words_learned':
      return player.wordsLearned >= req.threshold;

    case 'letters_learned': {
      const lettersCount = alphabet.completedGroups?.length || 0;
      return lettersCount >= req.threshold;
    }

    case 'quests_completed': {
      const completedCount = Object.values(quests.quests || {}).filter((q) => q.status === 'completed').length;
      return completedCount >= req.threshold;
    }

    case 'streak':
      return player.streak >= req.threshold;

    case 'level':
      return player.level >= req.threshold;

    case 'xp_total':
      return player.xp >= req.threshold;

    case 'zones_unlocked':
      return (player.unlockedZones?.length || 0) >= req.threshold;

    case 'chests_opened':
      return (player.openedChests?.length || 0) >= req.threshold;

    case 'books_read':
      return (player.readBooks?.length || 0) >= req.threshold;

    case 'reviews_completed':
      return achievements.stats.totalReviews >= req.threshold;

    case 'review_streak':
      return achievements.stats.reviewStreakDays >= req.threshold;

    case 'shop_purchases':
      return achievements.stats.shopPurchases >= req.threshold;

    case 'dirhams_spent':
      return achievements.stats.dirhamsSpent >= req.threshold;

    case 'dirhams_held':
      return player.dirhams >= req.threshold;

    case 'category_complete': {
      const categoryWords = vocabularyData.filter((w) => w.category === req.category);
      const learnedInCategory = categoryWords.filter((w) => vocabulary.fsrsCards[w.id]);
      return learnedInCategory.length === categoryWords.length && categoryWords.length > 0;
    }

    case 'perfect_quiz':
      return achievements.stats.perfectQuizzes >= 1;

    case 'study_time_after': {
      const hour = new Date().getHours();
      return hour >= req.hour;
    }

    case 'study_time_before': {
      const hour = new Date().getHours();
      return hour < req.hour;
    }

    case 'all_achievements': {
      const totalAchievements = ACHIEVEMENTS.length - 1; // Exclude completionist itself
      const unlockedCount = Object.keys(achievements.unlockedAchievements).length;
      return unlockedCount >= totalAchievements;
    }

    case 'grammar_lessons': {
      const completedCount = state.grammar?.completedLessons?.length || 0;
      return completedCount >= req.threshold;
    }

    case 'skill_tree_nodes': {
      const allNodes = Object.values(state.skillTree?.unlockedNodes || {}).flat();
      return allNodes.length >= req.threshold;
    }

    case 'skill_tree_complete': {
      if (!req.treeId) return false;
      const treeNodes = state.skillTree?.unlockedNodes?.[req.treeId] ?? [];
      const totalNodes = SKILL_TREES[req.treeId]?.nodes?.length ?? Infinity;
      return treeNodes.length >= totalNodes;
    }

    case 'quiz_type_streak': {
      const qStats = achievements.stats.quizTypeStats ?? {};
      const typeStats = qStats[req.quizType] ?? { perfectStreak: 0 };
      return typeStats.perfectStreak >= req.threshold;
    }

    case 'cefr_level_reached': {
      const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4 };
      const currentLevel = LEVEL_ORDER[state.cefrProgress?.currentLevel] ?? 0;
      const requiredLevel = LEVEL_ORDER[req.level] ?? 1;
      return currentLevel >= requiredLevel;
    }

    case 'placement_complete': {
      return state.placement?.hasCompleted === true;
    }

    // ── Faction triggers ──────────────────────────────────────────────────────

    case 'faction_alignment': {
      // "Join faction" → any alignment points with the specified faction
      // "Max reputation" → alignment >= 100 (req.threshold defaults to 1 for join)
      const factionId = req.faction;
      const threshold = req.threshold ?? 1;
      const alignmentScore = state.faction?.alignment?.[factionId] ?? 0;
      return alignmentScore >= threshold;
    }

    case 'npc_max_relationship': {
      // Achievement triggers when any NPC (or req.npcId specific NPC) reaches max friendship
      const maxTier = 75; // 'close' tier threshold from npcSlice
      const threshold = req.threshold ?? maxTier;
      if (req.npcId) {
        return (state.npc?.friendship?.[req.npcId] ?? 0) >= threshold;
      }
      // Any NPC at threshold
      const friendships = Object.values(state.npc?.friendship ?? {});
      return friendships.some((val) => val >= threshold);
    }

    default:
      return false;
  }
}

// Map of action types to achievement types that should be checked
const ACTION_TO_ACHIEVEMENT_TYPES = {
  'player/incrementWordsLearned': ['words_learned', 'category_complete', 'study_time_after', 'study_time_before'],
  'player/addXP': ['xp_total', 'study_time_after', 'study_time_before'],
  'player/updateStreak': ['streak'],
  'player/unlockZone': ['zones_unlocked'],
  'player/markChestOpened': ['chests_opened'],
  'player/markBookRead': ['books_read'],
  'alphabet/completeGroup': ['letters_learned'],
  'quests/completeQuest': ['quests_completed'],
  'achievements/incrementReviews': ['reviews_completed', 'review_streak'],
  'achievements/recordPerfectQuiz': ['perfect_quiz'],
  'achievements/recordShopPurchase': ['shop_purchases', 'dirhams_spent'],
  'player/spendDirhams': ['dirhams_spent'],
  'player/addDirhams': ['dirhams_held'],
  'grammar/completeLesson': ['grammar_lessons'],
  'skillTree/unlockNode':              ['skill_tree_nodes', 'skill_tree_complete'],
  'skillTree/bulkUnlockNodes':         ['skill_tree_nodes', 'skill_tree_complete'],
  'achievements/recordQuizTypeResult': ['quiz_type_streak'],
  'cefrProgress/setCefrLevel':         ['cefr_level_reached'],
  'placement/recordPlacementResult':   ['placement_complete'],
  // Faction triggers
  'faction/adjustAlignment':           ['faction_alignment', 'npc_max_relationship'],
  // Economy haggle triggers (haggles count as shop interactions)
  'economy/recordHaggle':              ['shop_purchases'],
  // NPC relationship triggers
  'npc/adjustFriendship':              ['npc_max_relationship'],
  'npc/giveNpcGift':                   ['npc_max_relationship', 'npc_gifts'],
};

// Re-entrancy guard: prevents infinite dispatch cascade when addXP triggers
// achievement checks which dispatch more addXP
let _isProcessingAchievements = false;

export const achievementMiddleware = (store) => (next) => (action) => {
  // Pass the action through first
  const result = next(action);

  // Early return for actions that don't affect achievements
  const typesToCheck = ACTION_TO_ACHIEVEMENT_TYPES[action.type];
  if (!typesToCheck) return result;

  // Prevent re-entrant dispatch cascade
  if (_isProcessingAchievements) return result;
  _isProcessingAchievements = true;

  try {
    // Get the updated state only for relevant actions
    const state = store.getState();
    const unlockedAchievements = state.achievements?.unlockedAchievements || {};

    // Find achievements that match the types to check
    const relevantAchievements = ACHIEVEMENTS.filter((achievement) =>
      typesToCheck.includes(achievement.requirement.type)
    );

    // Collect all XP rewards to batch into a single dispatch
    let totalXpReward = 0;
    const newlyUnlockedIds = [];

    // Check each relevant achievement
    relevantAchievements.forEach((achievement) => {
      // Skip if already unlocked
      if (unlockedAchievements[achievement.id]) return;

      // Check if the achievement is now met
      if (isAchievementMet(achievement, state)) {
        // Unlock the achievement
        store.dispatch(unlockAchievement(achievement.id));
        newlyUnlockedIds.push(achievement.id);

        // Accumulate XP reward instead of dispatching immediately
        totalXpReward += achievement.xpReward;
      }
    });

    // Check for chain completions triggered by newly unlocked achievements
    if (newlyUnlockedIds.length > 0) {
      const updatedState = store.getState();
      const updatedUnlocked = updatedState.achievements?.unlockedAchievements || {};
      const alreadyCompleted = new Set(updatedState.achievements?.completedChains || []);
      const newlyCompletedChains = new Set();

      newlyUnlockedIds.forEach((achievementId) => {
        checkChainCompletions(achievementId, updatedUnlocked).forEach((chain) => {
          if (!alreadyCompleted.has(chain.chainId) && !newlyCompletedChains.has(chain.chainId)) {
            newlyCompletedChains.add(chain.chainId);
            store.dispatch(completeChain(chain.chainId));
            totalXpReward += chain.xpReward;
          }
        });
      });
    }

    // Dispatch batched XP reward once (avoids re-entrant addXP cascade)
    if (totalXpReward > 0) {
      store.dispatch(addXP(totalXpReward));
    }

    // Check for completionist achievement after dispatches settle
    queueMicrotask(() => {
      const newState = store.getState();
      const completionist = ACHIEVEMENTS.find((a) => a.requirement.type === 'all_achievements');
      if (completionist && !newState.achievements.unlockedAchievements[completionist.id]) {
        if (isAchievementMet(completionist, newState)) {
          store.dispatch(unlockAchievement(completionist.id));
          store.dispatch(addXP(completionist.xpReward));
        }
      }
    });
  } finally {
    _isProcessingAchievements = false;
  }

  return result;
};

// Special helper for quiz completion (called from quiz overlay)
export function checkPerfectQuiz(correctCount, totalCount, dispatch) {
  if (correctCount === totalCount && totalCount > 0) {
    dispatch(recordPerfectQuiz());
  }
}
