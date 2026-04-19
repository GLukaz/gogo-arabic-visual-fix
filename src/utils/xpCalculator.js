const XP_TABLE = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  450,   // Level 4
  700,   // Level 5
  1000,  // Level 6
  1400,  // Level 7
  1800,  // Level 8
  2300,  // Level 9
  2800,  // Level 10
  3500,  // Level 11
  4200,  // Level 12
  5000,  // Level 13
  6000,  // Level 14
  7000,  // Level 15
  8200,  // Level 16
  9500,  // Level 17
  11000, // Level 18
  12500, // Level 19
  14000, // Level 20
];

export function getXPForLevel(level) {
  if (level <= 1) return 0;
  if (level <= 20) return XP_TABLE[level - 1];
  // Level 21+: previous + 2000 per level
  return XP_TABLE[19] + (level - 20) * 2000;
}

export function getLevelFromXP(totalXP) {
  let cumulative = 0;
  for (let level = 1; level <= 100; level++) {
    cumulative += getXPForLevel(level);
    if (totalXP < cumulative) return level - 1 || 1;
  }
  return 100;
}

// XP rewards per PRD
export const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  STREAK_BONUS: 25,       // every 5 correct in a row
  PERFECT_QUIZ: 50,
  REVIEW_GOOD: 7,
  REVIEW_EASY: 10,
  REVIEW_HARD: 5,
  REVIEW_AGAIN: 2,
  NEW_WORD: 15,
  LETTER_LEARNED: 20,
  DAILY_REVIEW_COMPLETE: 50,
  QUEST_STEP: 50,
  MAIN_QUEST: 200,
  SIDE_QUEST: 100,
  FIRST_NPC_ZONE: 25,
  TREASURE_CHEST: 10,
  BOOKSHELF: 5,
  SIGN_READ: 5,
  DAILY_LOGIN: 20,
};

export const DIRHAM_REWARDS = {
  QUEST_STEP: 20,
  MAIN_QUEST: 100,
  SIDE_QUEST: 50,
  PERFECT_QUIZ: 25,
  TREASURE_CHEST_MIN: 10,
  TREASURE_CHEST_MAX: 50,
  DAILY_LOGIN: 10,
  FIRST_ZONE_VISIT: 50,
};
