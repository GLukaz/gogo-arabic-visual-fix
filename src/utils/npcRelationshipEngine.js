/**
 * NPC Relationship Engine
 *
 * Pure functions for:
 *   - Relationship decay: friendship decreases with inactivity
 *   - Gift preferences: per-NPC category multipliers affecting friendship gain
 *
 * Decay: 1 point per inactive day (minimum floor: 0).
 * For multi-day catch-up, decay compounds linearly (not exponentially).
 *
 * Gift preference multipliers:
 *   favorite  → 5.0x
 *   liked     → 2.0x
 *   neutral   → 1.0x  (default)
 *   disliked  → 0.5x
 */

// ── NPC category preference table ────────────────────────────────────────────

/**
 * Each NPC entry has exactly 2 `favorite` and 2 `disliked` gift categories.
 * Everything else is neutral (1.0x).
 *
 * Gift categories from gifts.js: food, crafts, books, clothing, tools, luxury, cultural
 */
export const NPC_GIFT_PREFERENCES = {
  'elder-tariq':       { favorite: ['food',     'cultural'],  liked: ['books'],    disliked: ['tools',    'luxury'] },
  'scholar-yusuf':     { favorite: ['books',    'cultural'],  liked: ['crafts'],   disliked: ['clothing', 'luxury'] },
  'healer-khadija':    { favorite: ['food',     'crafts'],    liked: ['cultural'], disliked: ['tools',    'clothing'] },
  'herbalist-maryam':  { favorite: ['crafts',   'food'],      liked: ['cultural'], disliked: ['luxury',   'clothing'] },
  'guide-amira':       { favorite: ['clothing', 'crafts'],    liked: ['food'],     disliked: ['books',    'cultural'] },
  'farmer-omar':       { favorite: ['food',     'tools'],     liked: ['crafts'],   disliked: ['luxury',   'books'] },
  'merchant-hassan':   { favorite: ['luxury',   'clothing'],  liked: ['crafts'],   disliked: ['food',     'cultural'] },
  'student-khalid':    { favorite: ['books',    'crafts'],    liked: ['food'],     disliked: ['luxury',   'clothing'] },
  'storyteller-noor':  { favorite: ['cultural', 'books'],     liked: ['food'],     disliked: ['tools',    'clothing'] },
  'imam-muhammad':     { favorite: ['cultural', 'food'],      liked: ['books'],    disliked: ['luxury',   'clothing'] },
  'guard-hamza':       { favorite: ['food',     'tools'],     liked: ['clothing'], disliked: ['books',    'cultural'] },
  'wanderer-ali':      { favorite: ['food',     'clothing'],  liked: ['tools'],    disliked: ['books',    'cultural'] },
};

/** Gift category multipliers by preference tier. */
const MULTIPLIERS = {
  favorite: 5.0,
  liked:    2.0,
  neutral:  1.0,
  disliked: 0.5,
};

// ── Pure functions ────────────────────────────────────────────────────────────

/**
 * Get the friendship gain multiplier for giving a specific gift category to an NPC.
 *
 * @param {string} npcId - NPC identifier
 * @param {string} giftCategoryId - Gift category (e.g. 'food', 'books', 'crafts')
 * @returns {number} Multiplier: 0.5 | 1.0 | 2.0 | 5.0
 */
export function getNpcGiftPreference(npcId, giftCategoryId) {
  const prefs = NPC_GIFT_PREFERENCES[npcId];
  if (!prefs) return MULTIPLIERS.neutral;

  if (prefs.favorite?.includes(giftCategoryId)) return MULTIPLIERS.favorite;
  if (prefs.liked?.includes(giftCategoryId))    return MULTIPLIERS.liked;
  if (prefs.disliked?.includes(giftCategoryId)) return MULTIPLIERS.disliked;
  return MULTIPLIERS.neutral;
}

/**
 * Compute decayed friendship values after `daysElapsed` inactive days.
 *
 * Decay rate: 1 point per day (linear, not compounded).
 * Floor: 0 — friendship never goes negative.
 *
 * @param {{ [npcId: string]: number }} relationships - Current friendship map
 * @param {number} daysElapsed - Number of inactive days (non-negative)
 * @returns {{ [npcId: string]: number }} Updated friendship map
 */
export function decayRelationships(relationships, daysElapsed) {
  const days   = Math.max(0, Math.floor(daysElapsed));
  const result = {};

  for (const [npcId, friendship] of Object.entries(relationships)) {
    result[npcId] = Math.max(0, friendship - days);
  }

  return result;
}
