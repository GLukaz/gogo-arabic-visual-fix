/**
 * relationshipDecayMiddleware.js — Daily NPC friendship decay
 *
 * Triggers on dailyGoals/startSession.
 * Computes days since last decay and applies 1 point/day decay to all
 * tracked NPC friendships, dispatching adjustFriendship for each affected NPC.
 *
 * Guards:
 *   - Runs at most once per UTC calendar day
 *   - Skips NPCs with friendship at 0 (already at floor)
 *   - Re-entrancy guard prevents cascades
 */

import { decayRelationships } from '../../utils/npcRelationshipEngine.js';
import { adjustFriendship } from '../slices/npcSlice.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function daysBetween(fromKey, toKey) {
  const from = new Date(fromKey + 'T00:00:00Z').getTime();
  const to   = new Date(toKey   + 'T00:00:00Z').getTime();
  return Math.max(0, Math.floor((to - from) / 86400000));
}

// ── Module-level state ────────────────────────────────────────────────────────

let _lastDecayDate = null;

export function _resetDecayState(date = null) {
  _lastDecayDate = date;
}

export function _getDecayState() {
  return { lastDecayDate: _lastDecayDate };
}

// ── Re-entrancy guard ─────────────────────────────────────────────────────────

let _isProcessingDecay = false;

// ── Middleware ────────────────────────────────────────────────────────────────

export const relationshipDecayMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type !== 'dailyGoals/startSession' || _isProcessingDecay) return result;

  const todayKey = getDayKey();
  if (_lastDecayDate === todayKey) return result; // already ran today

  const daysSince = _lastDecayDate ? daysBetween(_lastDecayDate, todayKey) : 1;
  if (daysSince <= 0) {
    _lastDecayDate = todayKey;
    return result;
  }

  const friendships = store.getState().npc?.friendship ?? {};
  if (Object.keys(friendships).length === 0) {
    _lastDecayDate = todayKey;
    return result;
  }

  _isProcessingDecay = true;
  try {
    const decayed = decayRelationships(friendships, daysSince);

    for (const [npcId, newValue] of Object.entries(decayed)) {
      const oldValue = friendships[npcId] ?? 0;
      const delta    = newValue - oldValue;
      if (delta < 0 && oldValue > 0) {
        store.dispatch(adjustFriendship({ npcId, delta, reason: 'daily_decay' }));
      }
    }

    _lastDecayDate = todayKey;
  } finally {
    _isProcessingDecay = false;
  }

  return result;
};
