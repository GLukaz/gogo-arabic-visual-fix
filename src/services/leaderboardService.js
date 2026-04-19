/**
 * leaderboardService.js
 * Anonymous localStorage leaderboard that accumulates weekly stats and computes
 * simulated percentile ranking by comparing against stored historical snapshots.
 *
 * Storage key: 'gogo-arabic-leaderboard'
 * Schema: { weeklySnapshots: [{ week, wordsLearned, quizzesCompleted, streak }], currentWeek: string }
 *
 * The percentile is "simulated" — it compares the player's current weekly stats
 * against their own historical performance snapshots (one snapshot per week).
 * A minimum of 3 snapshots generates a meaningful percentile; before that,
 * a default encouraging message is returned.
 */

const STORAGE_KEY = 'gogo-arabic-leaderboard';
const MIN_SNAPSHOTS_FOR_PERCENTILE = 3;

/**
 * Get the ISO week identifier string (e.g. "2026-W12") for a given date.
 * @param {Date} date
 * @returns {string}
 */
export function getWeekId(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number, make Sunday = 7
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Load leaderboard data from localStorage.
 * @returns {{ weeklySnapshots: Array, currentWeek: string|null }}
 */
export function loadLeaderboardData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { weeklySnapshots: [], currentWeek: null };
    const parsed = JSON.parse(raw);
    return {
      weeklySnapshots: Array.isArray(parsed.weeklySnapshots) ? parsed.weeklySnapshots : [],
      currentWeek: parsed.currentWeek || null,
    };
  } catch {
    return { weeklySnapshots: [], currentWeek: null };
  }
}

/**
 * Save leaderboard data to localStorage.
 * @param {{ weeklySnapshots: Array, currentWeek: string|null }} data
 */
export function saveLeaderboardData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/**
 * Record this week's stats snapshot. If the week has changed, archives the old
 * snapshot and starts a new one. Keeps the last 52 weeks of history.
 *
 * @param {{ wordsLearned: number, quizzesCompleted: number, streak: number }} stats
 * @returns {{ weeklySnapshots: Array, currentWeek: string }}
 */
export function recordWeeklySnapshot(stats) {
  const data = loadLeaderboardData();
  const thisWeek = getWeekId(new Date());

  if (data.currentWeek && data.currentWeek !== thisWeek) {
    // Week changed — the previous week's snapshot is already stored.
    // Nothing extra to archive; current snapshot tracks cumulative weekly stats.
  }

  // Find or create this week's snapshot
  const existingIdx = data.weeklySnapshots.findIndex((s) => s.week === thisWeek);

  const snapshot = {
    week: thisWeek,
    wordsLearned: stats.wordsLearned || 0,
    quizzesCompleted: stats.quizzesCompleted || 0,
    streak: stats.streak || 0,
  };

  if (existingIdx >= 0) {
    data.weeklySnapshots[existingIdx] = snapshot;
  } else {
    data.weeklySnapshots.push(snapshot);
  }

  // Keep only last 52 weeks
  if (data.weeklySnapshots.length > 52) {
    data.weeklySnapshots = data.weeklySnapshots.slice(-52);
  }

  data.currentWeek = thisWeek;
  saveLeaderboardData(data);
  return data;
}

/**
 * Calculate a simulated percentile by comparing the current week's stats against
 * historical weekly snapshots. The percentile is the percentage of past weeks where
 * the player performed WORSE than the current week (across a composite score).
 *
 * @param {{ wordsLearned: number, quizzesCompleted: number, streak: number }} currentStats
 * @returns {{ percentile: number|null, hasEnoughData: boolean, snapshotCount: number }}
 */
export function calculatePercentile(currentStats) {
  const data = loadLeaderboardData();
  const thisWeek = getWeekId(new Date());

  // Use past snapshots (exclude current week)
  const pastSnapshots = data.weeklySnapshots.filter((s) => s.week !== thisWeek);

  if (pastSnapshots.length < MIN_SNAPSHOTS_FOR_PERCENTILE) {
    return { percentile: null, hasEnoughData: false, snapshotCount: pastSnapshots.length };
  }

  // Composite score: wordsLearned * 3 + quizzesCompleted * 5 + streak * 2
  const compositeScore = (s) => (s.wordsLearned || 0) * 3 + (s.quizzesCompleted || 0) * 5 + (s.streak || 0) * 2;

  const currentScore = compositeScore(currentStats);
  const worseThanCurrent = pastSnapshots.filter((s) => compositeScore(s) < currentScore).length;

  const percentile = Math.round((worseThanCurrent / pastSnapshots.length) * 100);

  return { percentile, hasEnoughData: true, snapshotCount: pastSnapshots.length };
}

/**
 * Reset leaderboard data (for testing or user request).
 */
export function resetLeaderboardData() {
  localStorage.removeItem(STORAGE_KEY);
}
