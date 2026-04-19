/**
 * Test factory for player state
 */
export function createTestPlayer(overrides = {}) {
  return {
    name: 'TestPlayer',
    skinTone: 0,
    outfit: 'simple-thobe',
    headCovering: 'kufi',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    dirhams: 0,
    wordsLearned: 0,
    streak: 0,
    lastPlayedDate: null,
    maxStreak: 0,
    streakRewardsEarned: [],
    titles: [],
    currentTitle: null,
    currentZone: 'oasis_village',
    unlockedZones: ['oasis_village'],
    inventory: [],
    position: { x: 640, y: 400 },
    boosts: [],
    openedChests: [],
    readBooks: [],
    levelUpRewards: null,
    streakRewardPending: null,
    onboardingComplete: false,
    onboardingStep: 0,
    onboardingTargetNpc: null,
    ...overrides,
  };
}
