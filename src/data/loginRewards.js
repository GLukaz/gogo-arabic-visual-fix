/**
 * loginRewards.js
 * GROW-019: 30-day login reward cycle that repeats.
 *
 * Milestone days (7, 14, 21, 30) give rare items.
 * Cycle repeats after day 30.
 */

export const LOGIN_REWARDS = [
  // Day 1-6: small XP + gold
  { day: 1,  xp: 25,  dirhams: 10, item: null },
  { day: 2,  xp: 25,  dirhams: 15, item: null },
  { day: 3,  xp: 30,  dirhams: 15, item: null },
  { day: 4,  xp: 30,  dirhams: 20, item: null },
  { day: 5,  xp: 35,  dirhams: 20, item: null },
  { day: 6,  xp: 35,  dirhams: 25, item: null },
  // Day 7: weekly milestone
  { day: 7,  xp: 100, dirhams: 50, item: 'prayer_beads', isMilestone: true },
  // Day 8-13
  { day: 8,  xp: 40,  dirhams: 25, item: null },
  { day: 9,  xp: 40,  dirhams: 30, item: null },
  { day: 10, xp: 45,  dirhams: 30, item: null },
  { day: 11, xp: 45,  dirhams: 35, item: null },
  { day: 12, xp: 50,  dirhams: 35, item: null },
  { day: 13, xp: 50,  dirhams: 40, item: null },
  // Day 14: bi-weekly milestone
  { day: 14, xp: 150, dirhams: 75, item: 'silver_ring', isMilestone: true },
  // Day 15-20
  { day: 15, xp: 55,  dirhams: 40, item: null },
  { day: 16, xp: 55,  dirhams: 45, item: null },
  { day: 17, xp: 60,  dirhams: 45, item: null },
  { day: 18, xp: 60,  dirhams: 50, item: null },
  { day: 19, xp: 65,  dirhams: 50, item: null },
  { day: 20, xp: 65,  dirhams: 55, item: null },
  // Day 21: three-week milestone
  { day: 21, xp: 200, dirhams: 100, item: 'compass_of_qibla', isMilestone: true },
  // Day 22-29
  { day: 22, xp: 70,  dirhams: 55, item: null },
  { day: 23, xp: 70,  dirhams: 60, item: null },
  { day: 24, xp: 75,  dirhams: 60, item: null },
  { day: 25, xp: 75,  dirhams: 65, item: null },
  { day: 26, xp: 80,  dirhams: 65, item: null },
  { day: 27, xp: 80,  dirhams: 70, item: null },
  { day: 28, xp: 85,  dirhams: 70, item: null },
  { day: 29, xp: 85,  dirhams: 75, item: null },
  // Day 30: monthly milestone
  { day: 30, xp: 300, dirhams: 150, item: 'astrolabe', isMilestone: true },
];

const CYCLE_LENGTH = LOGIN_REWARDS.length; // 30

/**
 * getRewardForDay(loginStreak) — returns reward for the given streak day (1-indexed).
 * Cycles back after day 30.
 */
export function getRewardForDay(loginStreak) {
  if (!loginStreak || loginStreak < 1) return LOGIN_REWARDS[0];
  const idx = ((loginStreak - 1) % CYCLE_LENGTH);
  return LOGIN_REWARDS[idx];
}

/**
 * getNextMilestoneDay(loginStreak) — returns the next milestone day number relative to streak.
 * Milestones are at days 7, 14, 21, 30 (and their cycle repetitions).
 */
export function getNextMilestoneDay(loginStreak) {
  const milestones = LOGIN_REWARDS.filter((r) => r.isMilestone).map((r) => r.day);
  const positionInCycle = ((loginStreak - 1) % CYCLE_LENGTH) + 1; // 1-30
  const next = milestones.find((m) => m > positionInCycle);
  if (next) return loginStreak + (next - positionInCycle);
  // Wrap to next cycle
  return loginStreak + (CYCLE_LENGTH - positionInCycle) + milestones[0];
}
