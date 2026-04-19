/**
 * multiProfileLeaderboardService.js — Phase 91
 *
 * localStorage-based multi-profile leaderboard system.
 * Multiple local profiles (up to 5) can compete on the same device.
 * All localStorage operations are isolated in this service layer.
 *
 * Storage keys:
 *   'gogo_leaderboards'  — leaderboard entries per category
 *   'gogo_profiles'      — profile list with metadata
 */

const LEADERBOARDS_KEY = 'gogo_leaderboards';
const PROFILES_KEY = 'gogo_profiles';
const MAX_PROFILES = 5;
const MAX_ENTRIES_PER_CATEGORY = 50;

/**
 * Leaderboard categories — each maps to a stat the player can compete in.
 */
export const LEADERBOARD_CATEGORIES = {
  xp: { label: 'Total XP', labelArabic: '\u0645\u062c\u0645\u0648\u0639 \u0646\u0642\u0627\u0637 \u0627\u0644\u062e\u0628\u0631\u0629', icon: '\u2b50' },
  words_learned: { label: 'Words Learned', labelArabic: '\u0643\u0644\u0645\u0627\u062a \u0645\u064f\u062a\u0639\u0644\u0651\u064e\u0645\u0629', icon: '\ud83d\udcda' },
  words_mastered: { label: 'Words Mastered', labelArabic: '\u0643\u0644\u0645\u0627\u062a \u0645\u064f\u062a\u0642\u064e\u0646\u0629', icon: '\ud83c\udfc6' },
  streak: { label: 'Longest Streak', labelArabic: '\u0623\u0637\u0648\u0644 \u0633\u0644\u0633\u0644\u0629', icon: '\ud83d\udd25' },
  quizzes_perfect: { label: 'Perfect Quizzes', labelArabic: '\u0627\u062e\u062a\u0628\u0627\u0631\u0627\u062a \u0645\u062b\u0627\u0644\u064a\u0629', icon: '\ud83d\udcaf' },
  achievements: { label: 'Achievements', labelArabic: '\u0625\u0646\u062c\u0627\u0632\u0627\u062a', icon: '\ud83c\udf96\ufe0f' },
  reading_passages: { label: 'Passages Read', labelArabic: '\u0646\u0635\u0648\u0635 \u0645\u0642\u0631\u0648\u0621\u0629', icon: '\ud83d\udcd6' },
  writing_score: { label: 'Writing Best', labelArabic: '\u0623\u0641\u0636\u0644 \u0643\u062a\u0627\u0628\u0629', icon: '\u270f\ufe0f' },
};

// ============================================================
// Internal helpers
// ============================================================

function loadJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

function loadLeaderboards() {
  return loadJSON(LEADERBOARDS_KEY) || {};
}

function saveLeaderboards(data) {
  saveJSON(LEADERBOARDS_KEY, data);
}

// ============================================================
// Score management
// ============================================================

/**
 * Save a score for a player in a specific category.
 * Only the personal best per player per category is kept.
 *
 * @param {string} category — key from LEADERBOARD_CATEGORIES
 * @param {string} playerName — profile display name
 * @param {number} score — numeric score value
 * @returns {{ rank: number, isNewBest: boolean }}
 */
export function saveScore(category, playerName, score) {
  if (!LEADERBOARD_CATEGORIES[category]) {
    return { rank: -1, isNewBest: false };
  }
  if (!playerName || typeof score !== 'number') {
    return { rank: -1, isNewBest: false };
  }

  const boards = loadLeaderboards();
  if (!boards[category]) boards[category] = [];

  const entries = boards[category];
  const existingIdx = entries.findIndex(
    (e) => e.playerName.toLowerCase() === playerName.toLowerCase()
  );

  let isNewBest = false;

  if (existingIdx >= 0) {
    // Update only if the new score is better
    if (score > entries[existingIdx].score) {
      entries[existingIdx].score = score;
      entries[existingIdx].date = new Date().toISOString();
      isNewBest = true;
    }
  } else {
    entries.push({
      playerName,
      score,
      date: new Date().toISOString(),
    });
    isNewBest = true;
  }

  // Sort descending by score
  entries.sort((a, b) => b.score - a.score);

  // Cap entries
  if (entries.length > MAX_ENTRIES_PER_CATEGORY) {
    boards[category] = entries.slice(0, MAX_ENTRIES_PER_CATEGORY);
  }

  saveLeaderboards(boards);

  // Calculate rank (1-based)
  const rank = boards[category].findIndex(
    (e) => e.playerName.toLowerCase() === playerName.toLowerCase()
  ) + 1;

  return { rank, isNewBest };
}

/**
 * Get the top entries for a leaderboard category.
 *
 * @param {string} category — key from LEADERBOARD_CATEGORIES
 * @param {number} [limit=10] — max entries to return
 * @returns {Array<{ playerName: string, score: number, date: string, rank: number }>}
 */
export function getLeaderboard(category, limit = 10) {
  const boards = loadLeaderboards();
  const entries = boards[category] || [];

  return entries.slice(0, limit).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

/**
 * Get a specific player's rank in a category.
 *
 * @param {string} category — key from LEADERBOARD_CATEGORIES
 * @param {string} playerName — profile display name
 * @returns {{ rank: number, score: number, total: number } | null}
 */
export function getPlayerRank(category, playerName) {
  const boards = loadLeaderboards();
  const entries = boards[category] || [];

  const idx = entries.findIndex(
    (e) => e.playerName.toLowerCase() === playerName.toLowerCase()
  );

  if (idx === -1) return null;

  return {
    rank: idx + 1,
    score: entries[idx].score,
    total: entries.length,
  };
}

/**
 * Get a player's personal best across all categories.
 *
 * @param {string} playerName — profile display name
 * @returns {Object<string, { score: number, rank: number, date: string }>}
 */
export function getPlayerBests(playerName) {
  const boards = loadLeaderboards();
  const bests = {};

  for (const category of Object.keys(LEADERBOARD_CATEGORIES)) {
    const entries = boards[category] || [];
    const idx = entries.findIndex(
      (e) => e.playerName.toLowerCase() === playerName.toLowerCase()
    );

    if (idx >= 0) {
      bests[category] = {
        score: entries[idx].score,
        rank: idx + 1,
        date: entries[idx].date,
      };
    }
  }

  return bests;
}

/**
 * Clear all leaderboard data.
 */
export function clearLeaderboards() {
  localStorage.removeItem(LEADERBOARDS_KEY);
}

// ============================================================
// Profile management
// ============================================================

/**
 * Load all profiles from localStorage.
 *
 * @returns {Array<{ id: string, name: string, avatar: string, createdAt: string }>}
 */
export function loadProfiles() {
  return loadJSON(PROFILES_KEY) || [];
}

/**
 * Create a new profile.
 *
 * @param {string} name — display name
 * @param {string} [avatar='\ud83e\uddd1\u200d\ud83c\udfeb'] — emoji avatar
 * @returns {{ success: boolean, profile?: Object, error?: string }}
 */
export function createProfile(name, avatar = '\ud83e\uddd1\u200d\ud83c\udfeb') {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { success: false, error: 'Name is required' };
  }

  const profiles = loadProfiles();

  if (profiles.length >= MAX_PROFILES) {
    return { success: false, error: `Maximum ${MAX_PROFILES} profiles allowed` };
  }

  const trimmedName = name.trim();
  const duplicate = profiles.find(
    (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
  );
  if (duplicate) {
    return { success: false, error: 'A profile with this name already exists' };
  }

  const profile = {
    id: `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: trimmedName,
    avatar: avatar || '\ud83e\uddd1\u200d\ud83c\udfeb',
    createdAt: new Date().toISOString(),
  };

  profiles.push(profile);
  saveJSON(PROFILES_KEY, profiles);

  return { success: true, profile };
}

/**
 * Delete a profile by ID.
 *
 * @param {string} profileId
 * @returns {boolean} whether the profile was found and deleted
 */
export function deleteProfile(profileId) {
  const profiles = loadProfiles();
  const filtered = profiles.filter((p) => p.id !== profileId);

  if (filtered.length === profiles.length) return false;

  saveJSON(PROFILES_KEY, filtered);
  return true;
}

/**
 * Get the maximum number of profiles allowed.
 * @returns {number}
 */
export function getMaxProfiles() {
  return MAX_PROFILES;
}
