import { createSlice, createSelector } from '@reduxjs/toolkit';
import { ACHIEVEMENTS, getAchievementById } from '../../data/achievements.js';
import vocabularyData from '../../data/vocabularyAll.js';
import { getChainProgress, getAllChainProgress } from '../../services/achievementChainService.js';

const initialState = {
  unlockedAchievements: {}, // { achievementId: timestamp }
  newAchievements: [], // Queue of achievement IDs to show as toasts
  completedChains: [], // chainIds that have paid out bonus rewards
  stats: {
    totalReviews: 0,
    reviewStreakDays: 0,
    lastReviewDate: null,
    perfectQuizzes: 0,
    shopPurchases: 0,
    dirhamsSpent: 0,
    quizTypeStats: {}, // { [quizType]: { perfectStreak, totalPerfect } }
  },
};

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    unlockAchievement(state, action) {
      // payload: achievementId
      const achievementId = action.payload;
      if (!state.unlockedAchievements[achievementId]) {
        state.unlockedAchievements[achievementId] = Date.now();
        state.newAchievements.push(achievementId);
      }
    },

    dismissAchievementNotification(state, action) {
      // payload: achievementId
      const achievementId = action.payload;
      state.newAchievements = state.newAchievements.filter((id) => id !== achievementId);
    },

    clearAllNotifications(state) {
      state.newAchievements = [];
    },

    // Stats tracking for achievement triggers
    incrementReviews(state) {
      state.stats.totalReviews += 1;
      const today = new Date().toDateString();
      if (state.stats.lastReviewDate === today) return;

      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (state.stats.lastReviewDate === yesterday) {
        state.stats.reviewStreakDays += 1;
      } else {
        state.stats.reviewStreakDays = 1;
      }
      state.stats.lastReviewDate = today;
    },

    recordPerfectQuiz(state) {
      state.stats.perfectQuizzes += 1;
    },

    recordShopPurchase(state, action) {
      // payload: amount spent
      const amount = action.payload;
      state.stats.shopPurchases += 1;
      state.stats.dirhamsSpent += amount;
    },

    recordQuizTypeResult(state, action) {
      const { quizType, perfect } = action.payload;
      if (!state.stats.quizTypeStats[quizType]) {
        state.stats.quizTypeStats[quizType] = { perfectStreak: 0, totalPerfect: 0 };
      }
      if (perfect) {
        state.stats.quizTypeStats[quizType].perfectStreak += 1;
        state.stats.quizTypeStats[quizType].totalPerfect += 1;
      } else {
        state.stats.quizTypeStats[quizType].perfectStreak = 0;
      }
    },

    completeChain(state, action) {
      // payload: chainId string
      if (!state.completedChains.includes(action.payload)) {
        state.completedChains.push(action.payload);
      }
    },
  },
});

export const {
  unlockAchievement,
  dismissAchievementNotification,
  clearAllNotifications,
  incrementReviews,
  recordPerfectQuiz,
  recordShopPurchase,
  recordQuizTypeResult,
  completeChain,
} = achievementSlice.actions;

// ========== SELECTORS ==========

export const selectUnlockedAchievements = (state) => state.achievements.unlockedAchievements;
export const selectNewAchievements = (state) => state.achievements.newAchievements;
export const selectAchievementStats = (state) => state.achievements.stats;

// Get achievement progress for display (e.g., "47/50 words")
export const selectAchievementProgress = createSelector(
  [
    (state) => state.player,
    (state) => state.vocabulary,
    (state) => state.quests,
    (state) => state.alphabet,
    (state) => state.achievements,
    (state) => state.skillTree,
    (state) => state.cefrProgress,
    (state) => state.placement,
  ],
  (player, vocabulary, quests, alphabet, achievements, skillTree, cefrProgress, placement) => {
    const progress = {};

    ACHIEVEMENTS.forEach((achievement) => {
      const req = achievement.requirement;
      let current = 0;
      let target = req.threshold || 1;

      switch (req.type) {
        case 'words_learned':
          current = player.wordsLearned;
          break;
        case 'letters_learned':
          current = alphabet.completedGroups?.length || 0;
          break;
        case 'quests_completed':
          current = Object.values(quests.quests || {}).filter((q) => q.status === 'completed').length;
          break;
        case 'streak':
          current = player.streak;
          break;
        case 'level':
          current = player.level;
          break;
        case 'xp_total':
          current = player.xp;
          break;
        case 'zones_unlocked':
          current = player.unlockedZones?.length || 0;
          break;
        case 'chests_opened':
          current = player.openedChests?.length || 0;
          break;
        case 'books_read':
          current = player.readBooks?.length || 0;
          break;
        case 'reviews_completed':
          current = achievements.stats.totalReviews;
          break;
        case 'review_streak':
          current = achievements.stats.reviewStreakDays;
          break;
        case 'shop_purchases':
          current = achievements.stats.shopPurchases;
          break;
        case 'dirhams_spent':
          current = achievements.stats.dirhamsSpent;
          break;
        case 'dirhams_held':
          current = player.dirhams;
          break;
        case 'category_complete': {
          // Count words learned in this category
          const categoryWords = vocabularyData.filter((w) => w.category === req.category);
          const learnedInCategory = categoryWords.filter((w) => vocabulary.fsrsCards[w.id]).length;
          current = learnedInCategory;
          target = categoryWords.length;
          break;
        }
        case 'perfect_quiz':
          current = achievements.stats.perfectQuizzes;
          target = 1;
          break;
        case 'study_time_after':
        case 'study_time_before':
          // These are one-time triggers, not progress-based
          current = achievements.unlockedAchievements[achievement.id] ? 1 : 0;
          target = 1;
          break;
        case 'all_achievements': {
          const totalAchievements = ACHIEVEMENTS.length - 1; // Exclude completionist itself
          current = Object.keys(achievements.unlockedAchievements).length;
          target = totalAchievements;
          break;
        }
        case 'skill_tree_nodes': {
          const allNodes = Object.values(skillTree?.unlockedNodes || {}).flat();
          current = allNodes.length;
          break;
        }
        case 'skill_tree_complete': {
          current = skillTree?.unlockedNodes?.[req.treeId]?.length ?? 0;
          target = 30; // 30 nodes per tree (Phase 57-01)
          break;
        }
        case 'quiz_type_streak': {
          const qStats = achievements.stats.quizTypeStats ?? {};
          current = qStats[req.quizType]?.perfectStreak ?? 0;
          break;
        }
        case 'cefr_level_reached': {
          const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4 };
          current = LEVEL_ORDER[cefrProgress?.currentLevel] ?? 0;
          target = LEVEL_ORDER[req.level] ?? 1;
          break;
        }
        case 'placement_complete': {
          current = placement?.hasCompleted ? 1 : 0;
          target = 1;
          break;
        }
        case 'grammar_lessons': {
          // grammar slice not in selector inputs — use 0 for now; middleware handles the real check
          current = 0;
          break;
        }
        default:
          break;
      }

      progress[achievement.id] = { current, target };
    });

    return progress;
  }
);

// Check if an achievement is unlocked
export const selectIsAchievementUnlocked = (achievementId) => (state) =>
  !!state.achievements.unlockedAchievements[achievementId];

// Get unlocked achievement count
export const selectUnlockedCount = createSelector([selectUnlockedAchievements], (unlocked) => Object.keys(unlocked).length);

// Get total XP earned from achievements
export const selectTotalAchievementXP = createSelector([selectUnlockedAchievements], (unlocked) => {
  let total = 0;
  Object.keys(unlocked).forEach((id) => {
    const achievement = getAchievementById(id);
    if (achievement) total += achievement.xpReward;
  });
  return total;
});

// ── Chain selectors ──

export const selectCompletedChains = (state) => state.achievements.completedChains;

/** All chains with progress info (memoized). */
export const selectAllChainProgress = createSelector(
  [selectUnlockedAchievements],
  (unlockedAchievements) => getAllChainProgress(unlockedAchievements)
);

/** Progress for a single chain by ID (selector factory). */
export const selectChainProgress = (chainId) =>
  createSelector(
    [selectUnlockedAchievements],
    (unlockedAchievements) => getChainProgress(chainId, unlockedAchievements)
  );

export default achievementSlice.reducer;
