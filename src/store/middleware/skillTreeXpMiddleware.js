/**
 * skillTreeXpMiddleware.js — Auto-XP Award for Skill Trees
 *
 * Listens for player activity actions and automatically awards Skill XP
 * to the appropriate skill tree.
 *
 * Activity → Tree mapping:
 *   Quiz completion  → reading/writing/listening/speaking/grammar/culture (by quiz type)
 *   Battle win       → grammar (language mastery through combat)
 *   Conversation     → speaking (conversation scenarios)
 *   Pronunciation    → listening (phonetic awareness)
 */

import { addSkillXP } from '../slices/skillTreeSlice.js';

// ─────────────────────────────────────────────────────────────────────────────
// XP Configuration — all amounts live here, never hardcoded in middleware logic
// ─────────────────────────────────────────────────────────────────────────────

export const SKILL_TREE_XP_CONFIG = {
  // Quiz: base XP per quiz completion
  QUIZ_BASE_XP: 10,

  // Battle: base + scaling via reward XP
  BATTLE_BASE_XP: 15,
  BATTLE_XP_PER_REWARD_XP: 0.1, // +0.1 skill XP per 1 battle reward XP
  BATTLE_MAX_XP: 50,             // cap to prevent runaway values

  // Conversation: base + score scaling
  CONVERSATION_BASE_XP: 5,
  CONVERSATION_XP_PER_SCORE_POINT: 0.2, // +0.2 per score point (score 0–100)

  // Pronunciation: flat award per practice attempt
  PRONUNCIATION_XP: 5,
};

// ─────────────────────────────────────────────────────────────────────────────
// Quiz type → skill tree mapping
// ─────────────────────────────────────────────────────────────────────────────

export const QUIZ_TREE_MAP = {
  // Reading
  'ar-to-en': 'reading',
  'ClozePassage': 'reading',
  'speed_quiz': 'reading',

  // Writing
  'en-to-ar': 'writing',
  'transliterate': 'writing',

  // Listening
  'listen': 'listening',

  // Speaking (none currently)

  // Grammar
  'root-identify': 'grammar',
  'sentence-build': 'grammar',
  'sentence_build': 'grammar',
  'GrammarFill': 'grammar',
  'WordOrder': 'grammar',
  'RootExpand': 'grammar',
  'perfect_quiz': 'grammar',

  // Culture
  'DialectIdentify': 'culture',
  'CulturalContext': 'culture',
};

// Tree awarded for battle victories
export const BATTLE_TREE = 'grammar';

// Tree awarded for conversation practice
export const CONVERSATION_TREE = 'speaking';

// Tree awarded for pronunciation drills
export const PRONUNCIATION_TREE = 'listening';

// ─────────────────────────────────────────────────────────────────────────────
// XP calculation helpers (exported for test coverage)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate XP for a battle victory.
 * Scales with battle reward XP (proxy for enemy difficulty).
 *
 * @param {number} rewardXp — XP awarded by the battle
 * @returns {number}
 */
export function calcBattleSkillXp(rewardXp) {
  const { BATTLE_BASE_XP, BATTLE_XP_PER_REWARD_XP, BATTLE_MAX_XP } = SKILL_TREE_XP_CONFIG;
  const raw = BATTLE_BASE_XP + Math.floor((rewardXp || 0) * BATTLE_XP_PER_REWARD_XP);
  return Math.min(raw, BATTLE_MAX_XP);
}

/**
 * Calculate XP for a completed conversation scenario.
 * Scales with the session score (0–100).
 *
 * @param {number} score — conversation score (0–100)
 * @returns {number}
 */
export function calcConversationSkillXp(score) {
  const { CONVERSATION_BASE_XP, CONVERSATION_XP_PER_SCORE_POINT } = SKILL_TREE_XP_CONFIG;
  return CONVERSATION_BASE_XP + Math.floor((score || 0) * CONVERSATION_XP_PER_SCORE_POINT);
}

// ─────────────────────────────────────────────────────────────────────────────
// Watched action types
// ─────────────────────────────────────────────────────────────────────────────

const WATCHED_ACTIONS = new Set([
  'achievements/recordQuizTypeResult',
  'battle/endBattle',
  'conversation/completeScenario',
  'phonetics/recordPracticeAttempt',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Redux middleware that automatically awards Skill Tree XP when players
 * complete relevant learning activities.
 *
 * Always calls next(action) first to keep store state consistent, then
 * dispatches addSkillXP as a side-effect.
 */
export const skillTreeXpMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (!WATCHED_ACTIONS.has(action.type)) return result;

  switch (action.type) {
    case 'achievements/recordQuizTypeResult': {
      const { quizType } = action.payload ?? {};
      const treeId = QUIZ_TREE_MAP[quizType];
      if (treeId) {
        store.dispatch(addSkillXP({ treeId, amount: SKILL_TREE_XP_CONFIG.QUIZ_BASE_XP }));
      }
      break;
    }

    case 'battle/endBattle': {
      const { victory, rewards } = action.payload ?? {};
      if (!victory) break;
      const rewardXp = rewards?.xp ?? 0;
      const xp = calcBattleSkillXp(rewardXp);
      store.dispatch(addSkillXP({ treeId: BATTLE_TREE, amount: xp }));
      break;
    }

    case 'conversation/completeScenario': {
      const { score } = action.payload ?? {};
      const xp = calcConversationSkillXp(score);
      store.dispatch(addSkillXP({ treeId: CONVERSATION_TREE, amount: xp }));
      break;
    }

    case 'phonetics/recordPracticeAttempt': {
      store.dispatch(
        addSkillXP({ treeId: PRONUNCIATION_TREE, amount: SKILL_TREE_XP_CONFIG.PRONUNCIATION_XP })
      );
      break;
    }

    default:
      break;
  }

  return result;
};
