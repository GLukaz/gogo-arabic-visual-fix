/**
 * Streak milestone reward configurations
 * Defines rewards for maintaining consecutive daily streaks
 */

export const STREAK_REWARDS = [
  {
    days: 1,
    xp: 10,
    dirhams: 0,
    title: null,
    message: 'Great start! Come back tomorrow!',
  },
  {
    days: 3,
    xp: 25,
    dirhams: 0,
    title: null,
    message: '3-day streak! Keep it up!',
  },
  {
    days: 7,
    xp: 50,
    dirhams: 100,
    title: 'Dedicated Student',
    message: 'One week strong! Amazing dedication!',
  },
  {
    days: 14,
    xp: 100,
    dirhams: 200,
    title: null,
    message: '2 weeks! Your commitment is inspiring!',
  },
  {
    days: 21,
    xp: 150,
    dirhams: 300,
    title: null,
    message: '3 weeks! Excellence is a habit!',
  },
  {
    days: 30,
    xp: 200,
    dirhams: 500,
    title: 'Monthly Learner',
    message: 'One month! You\'re unstoppable!',
  },
  {
    days: 45,
    xp: 300,
    dirhams: 750,
    title: null,
    message: 'Incredible consistency!',
  },
  {
    days: 60,
    xp: 500,
    dirhams: 1000,
    title: 'Persistent Scholar',
    message: '2 months! Your dedication is legendary!',
  },
  {
    days: 90,
    xp: 750,
    dirhams: 1500,
    title: 'Quarterly Champion',
    message: '3 months! Absolutely remarkable!',
  },
  {
    days: 100,
    xp: 1000,
    dirhams: 2000,
    title: 'Century Club',
    message: '100 days! You are a true master!',
  },
  {
    days: 180,
    xp: 2000,
    dirhams: 5000,
    title: 'Half-Year Hero',
    message: '6 months! Legendary commitment!',
  },
  {
    days: 365,
    xp: 5000,
    dirhams: 10000,
    title: 'Year-Long Legend',
    message: 'One full year! You inspire us all!',
  },
];

/**
 * Get reward for a specific streak milestone
 * @param {number} streak - Current streak count
 * @returns {Object|null} Reward configuration or null if not a milestone
 */
export function getStreakReward(streak) {
  return STREAK_REWARDS.find((reward) => reward.days === streak) || null;
}

/**
 * Get next streak milestone
 * @param {number} currentStreak - Current streak count
 * @returns {Object|null} Next milestone or null if none
 */
export function getNextStreakMilestone(currentStreak) {
  return STREAK_REWARDS.find((reward) => reward.days > currentStreak) || null;
}

/**
 * Get all achieved streak milestones
 * @param {number} maxStreak - Maximum streak achieved
 * @returns {Array} All milestone rewards earned
 */
export function getAchievedStreakRewards(maxStreak) {
  return STREAK_REWARDS.filter((reward) => reward.days <= maxStreak);
}
