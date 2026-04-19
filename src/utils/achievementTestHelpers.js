/**
 * Achievement Testing Helpers
 *
 * Use these functions in the browser console to test achievements:
 *
 * import * as AchievementTest from './utils/achievementTestHelpers.js';
 * AchievementTest.unlockAll();
 * AchievementTest.resetAll();
 * AchievementTest.simulateProgress();
 */

import { store } from '../store/store.js';
import {
  addXP,
  incrementWordsLearned,
  updateStreak,
  markChestOpened,
  markBookRead,
  addDirhams,
  spendDirhams,
} from '../store/slices/playerSlice.js';
import { completeGroup } from '../store/slices/alphabetSlice.js';
import { completeQuest } from '../store/slices/questSlice.js';
import {
  incrementReviews,
  recordPerfectQuiz,
  recordShopPurchase,
  clearAllNotifications,
} from '../store/slices/achievementSlice.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

/**
 * Unlock all achievements instantly (for testing)
 */
export function unlockAll() {
  if (import.meta.env.DEV) {
    console.log('🏆 Unlocking all achievements...');
  }
  ACHIEVEMENTS.forEach((achievement) => {
    const req = achievement.requirement;
    switch (req.type) {
      case 'words_learned':
        if (req.threshold) {
          for (let i = 0; i < req.threshold; i++) {
            store.dispatch(incrementWordsLearned());
          }
        }
        break;
      case 'letters_learned':
        if (req.threshold) {
          for (let i = 0; i < req.threshold; i++) {
            store.dispatch(completeGroup(`group_${i}`));
          }
        }
        break;
      case 'quests_completed':
        if (req.threshold) {
          for (let i = 0; i < req.threshold; i++) {
            store.dispatch(completeQuest(`quest_${i}`));
          }
        }
        break;
      case 'xp_total':
        if (req.threshold) {
          store.dispatch(addXP(req.threshold));
        }
        break;
      case 'chests_opened':
        if (req.threshold) {
          for (let i = 0; i < req.threshold; i++) {
            store.dispatch(markChestOpened(`chest_${i}`));
          }
        }
        break;
      case 'books_read':
        if (req.threshold) {
          for (let i = 0; i < req.threshold; i++) {
            store.dispatch(markBookRead(`book_${i}`));
          }
        }
        break;
      case 'reviews_completed':
        if (req.threshold) {
          for (let i = 0; i < req.threshold; i++) {
            store.dispatch(incrementReviews());
          }
        }
        break;
      case 'perfect_quiz':
        store.dispatch(recordPerfectQuiz());
        break;
      case 'shop_purchases':
        if (req.threshold) {
          for (let i = 0; i < req.threshold; i++) {
            store.dispatch(recordShopPurchase(10));
          }
        }
        break;
      case 'dirhams_spent':
        if (req.threshold) {
          store.dispatch(addDirhams(req.threshold * 2));
          store.dispatch(spendDirhams(req.threshold));
        }
        break;
      case 'dirhams_held':
        if (req.threshold) {
          store.dispatch(addDirhams(req.threshold));
        }
        break;
      default:
        break;
    }
  });
  if (import.meta.env.DEV) {
    console.log('✅ All achievements unlocked!');
  }
}

/**
 * Reset all achievement progress (for testing)
 */
export function resetAll() {
  if (import.meta.env.DEV) {
    console.log('🔄 Resetting all achievements...');
  }
  localStorage.removeItem('persist:gogo-arabic');
  if (import.meta.env.DEV) {
    console.log('✅ Achievement data cleared. Refresh the page.');
  }
}

/**
 * Simulate realistic progress to trigger some achievements
 */
export function simulateProgress() {
  if (import.meta.env.DEV) {
    console.log('🎮 Simulating player progress...');
  }

  // Learn 10 words
  for (let i = 0; i < 10; i++) {
    store.dispatch(incrementWordsLearned());
  }

  // Earn some XP
  store.dispatch(addXP(250));

  // Open 3 chests
  for (let i = 0; i < 3; i++) {
    store.dispatch(markChestOpened(`test_chest_${i}`));
  }

  // Complete 1 quest
  store.dispatch(completeQuest('test_quest_1'));

  // Earn some dirhams
  store.dispatch(addDirhams(500));

  // Update streak
  store.dispatch(updateStreak());

  if (import.meta.env.DEV) {
    console.log('✅ Progress simulated! Check for achievement toasts.');
  }
}

/**
 * Unlock a specific achievement by ID
 */
export function unlock(achievementId) {
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!achievement) {
    if (import.meta.env.DEV) {
      console.error(`❌ Achievement not found: ${achievementId}`);
    }
    return;
  }

  if (import.meta.env.DEV) {
    console.log(`🏆 Unlocking: ${achievement.name}`);
  }
  const req = achievement.requirement;

  switch (req.type) {
    case 'words_learned':
      for (let i = 0; i < req.threshold; i++) {
        store.dispatch(incrementWordsLearned());
      }
      break;
    case 'xp_total':
      store.dispatch(addXP(req.threshold));
      break;
    case 'perfect_quiz':
      store.dispatch(recordPerfectQuiz());
      break;
    default:
      if (import.meta.env.DEV) {
        console.warn('⚠️ Manual unlock for this achievement type not implemented yet');
      }
      break;
  }

  if (import.meta.env.DEV) {
    console.log('✅ Done!');
  }
}

/**
 * Clear toast notification queue
 */
export function clearToasts() {
  store.dispatch(clearAllNotifications());
  if (import.meta.env.DEV) {
    console.log('✅ Toast queue cleared');
  }
}

/**
 * Show current achievement stats
 */
export function showStats() {
  const state = store.getState();
  const achievements = state.achievements;
  const unlocked = Object.keys(achievements.unlockedAchievements).length;
  const total = ACHIEVEMENTS.length;
  const percentage = ((unlocked / total) * 100).toFixed(1);

  if (import.meta.env.DEV) {
    console.log('📊 Achievement Stats:');
    console.log(`   Unlocked: ${unlocked}/${total} (${percentage}%)`);
    console.log(`   Total Reviews: ${achievements.stats.totalReviews}`);
    console.log(`   Review Streak: ${achievements.stats.reviewStreakDays} days`);
    console.log(`   Perfect Quizzes: ${achievements.stats.perfectQuizzes}`);
    console.log(`   Shop Purchases: ${achievements.stats.shopPurchases}`);
    console.log(`   Dirhams Spent: ${achievements.stats.dirhamsSpent}`);
  }
}

// Browser console helpers (only in development)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.AchievementTest = {
    unlockAll,
    resetAll,
    simulateProgress,
    unlock,
    clearToasts,
    showStats,
  };
  console.log('🧪 Achievement test helpers loaded. Try: window.AchievementTest.simulateProgress()');
}
