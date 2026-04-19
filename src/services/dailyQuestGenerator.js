/**
 * dailyQuestGenerator.js — Deterministic daily quest generation
 *
 * Generates 3 daily quests based on player level + date.
 * Same player level + same date always produces the same 3 quests.
 *
 * Quest types: vocab_review, battle_win, craft_item, visit_zone, gift_npc
 * Difficulty scaling: easy (level 1-10), medium (level 11-25), hard (level 26+)
 */

// ─── Quest type constants ─────────────────────────────────────────────────────

export const DAILY_QUEST_TYPES = {
  VOCAB_REVIEW: 'vocab_review',
  BATTLE_WIN:   'battle_win',
  CRAFT_ITEM:   'craft_item',
  VISIT_ZONE:   'visit_zone',
  GIFT_NPC:     'gift_npc',
};

const ALL_QUEST_TYPES = Object.values(DAILY_QUEST_TYPES);

// ─── Difficulty configuration ─────────────────────────────────────────────────

const LEVEL_THRESHOLDS = { medium: 11, hard: 26 };

/**
 * Derive difficulty tier from player level.
 * @param {number} level
 * @returns {'easy'|'medium'|'hard'}
 */
export function getDifficultyTier(level) {
  if (level >= LEVEL_THRESHOLDS.hard) return 'hard';
  if (level >= LEVEL_THRESHOLDS.medium) return 'medium';
  return 'easy';
}

/**
 * Quest targets by type and difficulty tier.
 */
export const QUEST_TARGETS = {
  [DAILY_QUEST_TYPES.VOCAB_REVIEW]: { easy: 10, medium: 25, hard: 50 },
  [DAILY_QUEST_TYPES.BATTLE_WIN]:   { easy: 1,  medium: 3,  hard: 5  },
  [DAILY_QUEST_TYPES.CRAFT_ITEM]:   { easy: 1,  medium: 1,  hard: 2  },
  [DAILY_QUEST_TYPES.VISIT_ZONE]:   { easy: 1,  medium: 2,  hard: 3  },
  [DAILY_QUEST_TYPES.GIFT_NPC]:     { easy: 1,  medium: 1,  hard: 2  },
};

// ─── Deterministic selection ──────────────────────────────────────────────────

/**
 * Non-negative 32-bit hash from a string.
 * @param {string} str
 * @returns {number}
 */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0; // Convert to unsigned 32-bit integer
}

/**
 * Pick 3 unique quest types deterministically from the pool using an integer seed.
 * Uses successive modular selections to avoid repeats.
 *
 * @param {number} seed — unsigned integer
 * @returns {string[]} 3 quest types
 */
function pickQuestTypes(seed) {
  const pool = [...ALL_QUEST_TYPES]; // 5 entries
  const picked = [];
  let s = seed;

  while (picked.length < 3 && pool.length > 0) {
    const idx = s % pool.length;
    picked.push(pool.splice(idx, 1)[0]);
    // Evolve seed: mix the seed with the current index to avoid patterns
    s = ((s >>> 1) ^ (idx * 0x9e3779b9)) >>> 0;
  }

  return picked;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate 3 deterministic daily quests for a player on a given date.
 *
 * @param {{ level?: number }} playerState — player state (at minimum, { level })
 * @param {string} dateString — 'YYYY-MM-DD' UTC date
 * @returns {Array<{ id: string, type: string, target: number, current: number, completed: boolean }>}
 */
export function generateDailyQuests(playerState, dateString) {
  const level = (playerState?.level) ?? 1;
  const tier = getDifficultyTier(level);
  const seed = hashString(`${level}:${dateString}`);
  const types = pickQuestTypes(seed);

  return types.map((type) => ({
    id: `${dateString}-${type}`,
    type,
    target: QUEST_TARGETS[type][tier],
    current: 0,
    completed: false,
  }));
}

/**
 * Get current UTC date string 'YYYY-MM-DD'.
 * @returns {string}
 */
export function getTodayUTC() {
  return new Date().toISOString().split('T')[0];
}
