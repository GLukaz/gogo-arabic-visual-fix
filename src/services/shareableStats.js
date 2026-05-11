/**
 * shareableStats.js — Phase 91
 *
 * Generates shareable text, stats summaries, and weekly reports
 * from player state. All functions are pure — no side effects.
 */

// ============================================================
// CEFR estimation helper (lightweight, no external deps)
// ============================================================

/**
 * Estimate CEFR level from words learned.
 * Based on Common European Framework vocabulary benchmarks.
 */
function estimateCefrFromWords(wordsLearned) {
  if (wordsLearned >= 2000) return 'B2';
  if (wordsLearned >= 1000) return 'B1';
  if (wordsLearned >= 500) return 'A2';
  if (wordsLearned >= 100) return 'A1';
  return 'Pre-A1';
}

// ============================================================
// Fun facts generator
// ============================================================

/**
 * Generate encouraging fun facts based on player stats.
 *
 * @param {{ wordsLearned: number, streak: number, level: number, xp: number, achievementsUnlocked: number }} stats
 * @returns {string[]}
 */
function generateFunFacts(stats) {
  const facts = [];

  if (stats.wordsLearned >= 500) {
    facts.push('You know more Arabic words than 80% of first-year students!');
  } else if (stats.wordsLearned >= 200) {
    facts.push('You can already understand basic Arabic conversations!');
  } else if (stats.wordsLearned >= 50) {
    facts.push('You know enough Arabic to introduce yourself and order food!');
  } else if (stats.wordsLearned >= 10) {
    facts.push('Every word you learn opens a door to 400 million Arabic speakers!');
  }

  if (stats.streak >= 30) {
    facts.push('Your streak is longer than the average Duolingo user!');
  } else if (stats.streak >= 14) {
    facts.push('Two weeks strong! Most learners quit before day 7.');
  } else if (stats.streak >= 7) {
    facts.push('A full week streak! Consistency is the key to fluency.');
  }

  if (stats.level >= 20) {
    facts.push('Level 20+! You are an Arabic learning champion.');
  } else if (stats.level >= 10) {
    facts.push('Double digits! You are committed to mastering Arabic.');
  }

  if (stats.xp >= 10000) {
    facts.push('Over 10,000 XP! That is serious dedication.');
  }

  if (stats.achievementsUnlocked >= 20) {
    facts.push('20+ achievements! You are exploring every corner of Arabic.');
  } else if (stats.achievementsUnlocked >= 10) {
    facts.push('10+ achievements unlocked! Keep collecting them all.');
  }

  // Always return at least one fact
  if (facts.length === 0) {
    facts.push('Every journey of a thousand words begins with a single \u0643\u0644\u0645\u0629!');
  }

  return facts;
}

// ============================================================
// Share text
// ============================================================

/**
 * Generate shareable text from player state.
 *
 * @param {{ name?: string, level: number, xp: number, wordsLearned: number, streak: number, cefrLevel?: string }} playerState
 * @returns {string}
 */
export function generateShareText(playerState) {
  const {
    name,
    level = 1,
    wordsLearned = 0,
    streak = 0,
    cefrLevel,
  } = playerState;

  const cefr = cefrLevel || estimateCefrFromWords(wordsLearned);
  const greeting = name ? `${name} has` : "I've";

  const lines = [
    `${greeting} learned ${wordsLearned} Arabic words in Gogo Arabic!`,
    `Level ${level} | ${streak}-day streak | CEFR ${cefr}`,
    '',
    '#GogoArabic #LearnArabic #\u062a\u0639\u0644\u0645_\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
  ];

  return lines.join('\n');
}

// ============================================================
// Stats summary
// ============================================================

/**
 * Generate a structured stats summary for display.
 *
 * @param {Object} playerState — merged player/vocab/achievement state
 * @returns {Object} structured stats with fun facts
 */
export function generateStatsSummary(playerState) {
  const {
    level = 1,
    xp = 0,
    wordsLearned = 0,
    wordsMastered = 0,
    grammarProgress = 0,
    streak = 0,
    quizzesCompleted = 0,
    readingPassages = 0,
    writingScore = 0,
    achievementsUnlocked = 0,
    totalStudyTime = 0,
    cefrLevel,
  } = playerState;

  const estimatedCefr = cefrLevel || estimateCefrFromWords(wordsLearned);

  const funFacts = generateFunFacts({
    wordsLearned,
    streak,
    level,
    xp,
    achievementsUnlocked,
  });

  return {
    level,
    xp,
    wordsLearned,
    wordsMastered,
    grammarProgress,
    streak,
    quizzesCompleted,
    readingPassages,
    writingScore,
    achievementsUnlocked,
    totalStudyTime,
    estimatedCefr,
    funFacts,
  };
}

// ============================================================
// Weekly report
// ============================================================

/**
 * Generate a weekly progress report.
 *
 * @param {Object} playerState — current player stats
 * @param {Array} weekHistory — array of daily entries: [{ date, wordsLearned, xpEarned, timeStudied }]
 * @returns {Object} weekly report summary
 */
export function generateWeeklyReport(playerState, weekHistory = []) {
  const entries = Array.isArray(weekHistory) ? weekHistory : [];

  const wordsThisWeek = entries.reduce((sum, d) => sum + (d.wordsLearned || 0), 0);
  const xpThisWeek = entries.reduce((sum, d) => sum + (d.xpEarned || 0), 0);
  const timeThisWeek = entries.reduce((sum, d) => sum + (d.timeStudied || 0), 0);
  const daysActive = entries.length;

  // Best day
  let bestDay = null;
  if (entries.length > 0) {
    const sorted = [...entries].sort((a, b) => (b.xpEarned || 0) - (a.xpEarned || 0));
    bestDay = {
      date: sorted[0].date,
      xpEarned: sorted[0].xpEarned || 0,
      wordsLearned: sorted[0].wordsLearned || 0,
    };
  }

  // Encouragement based on activity
  let encouragement;
  if (daysActive >= 7) {
    encouragement = 'Perfect week! You studied every single day. \u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u0647!';
  } else if (daysActive >= 5) {
    encouragement = 'Great consistency this week! Keep it up!';
  } else if (daysActive >= 3) {
    encouragement = 'Good effort! Try to squeeze in a few more days next week.';
  } else if (daysActive >= 1) {
    encouragement = 'Every session counts! Aim for at least 5 days next week.';
  } else {
    encouragement = 'Start your Arabic journey! Even 5 minutes a day makes a difference.';
  }

  return {
    wordsThisWeek,
    xpThisWeek,
    timeThisWeek,
    daysActive,
    bestDay,
    currentStreak: playerState.streak || 0,
    totalWordsLearned: playerState.wordsLearned || 0,
    currentLevel: playerState.level || 1,
    encouragement,
  };
}

/**
 * Format seconds into a human-readable duration string.
 *
 * @param {number} seconds
 * @returns {string}
 */
export function formatStudyTime(seconds) {
  if (!seconds || seconds <= 0) return '0m';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}
