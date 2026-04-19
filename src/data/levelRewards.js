/**
 * Level-up reward configurations
 * Defines special rewards for specific levels
 */

export const LEVEL_REWARDS = {
  // Default reward for every level
  default: {
    dirhams: 50,
    title: null,
    message: null,
  },

  // Special milestone rewards
  5: {
    dirhams: 100,
    title: null,
    message: 'New areas await exploration...',
  },

  10: {
    dirhams: 100,
    title: 'Apprentice Scholar',
    message: 'Your dedication to learning is admirable!',
  },

  15: {
    dirhams: 200,
    title: null,
    message: 'You\'re making excellent progress!',
  },

  20: {
    dirhams: 500,
    title: 'Desert Scholar',
    message: 'Your knowledge grows like an oasis!',
  },

  25: {
    dirhams: 750,
    title: 'Master of Words',
    message: 'Few reach such mastery!',
  },

  30: {
    dirhams: 1000,
    title: 'Linguistic Sage',
    message: 'Your command of Arabic is exceptional!',
  },

  35: {
    dirhams: 1250,
    title: null,
    message: 'The journey continues...',
  },

  40: {
    dirhams: 1500,
    title: 'Grand Scholar',
    message: 'Your wisdom shines like the desert sun!',
  },

  45: {
    dirhams: 1750,
    title: null,
    message: 'Excellence achieved!',
  },

  50: {
    dirhams: 2500,
    title: 'Legend of Learning',
    message: 'You have achieved legendary status!',
  },
};

/**
 * Get reward for a specific level
 * @param {number} level - The level reached
 * @returns {Object} Reward configuration
 */
export function getLevelReward(level) {
  if (LEVEL_REWARDS[level]) {
    return LEVEL_REWARDS[level];
  }

  // For levels above 25 without specific rewards, give increasing dirhams
  if (level > 25) {
    return {
      dirhams: 50 + Math.floor((level - 25) / 5) * 100,
      title: null,
      message: null,
    };
  }

  return LEVEL_REWARDS.default;
}
