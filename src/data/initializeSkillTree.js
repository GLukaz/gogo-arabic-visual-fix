import { addSkillXP, bulkUnlockNodes } from '../store/slices/skillTreeSlice.js';
import { SKILL_TREES } from './skillTrees.js';

/**
 * initializeSkillTree — Bootstrap skill trees for existing players.
 *
 * Called once after redux-persist rehydration. Reads existing progress
 * (grammar completions, quest completions, FSRS cards, alphabet groups,
 * poetry wins) and awards proportional XP to each tree. Also bulk-unlocks
 * nodes whose XP cost is covered by the awarded XP.
 *
 * Idempotency: Checks skillTree.skillXP — if any tree already has XP > 0,
 * returns early (player has already been initialized or has earned XP normally).
 * Also checks unlockedNodes — if any tree has unlocked nodes, returns early.
 *
 * XP rates match learningProgressMiddleware:
 *   grammar completions → grammar tree   40 XP each
 *   quest completions   → culture tree   30 XP each
 *   fsrs cards learned  → reading tree    5 XP each
 *   alphabet groups     → writing tree   25 XP each
 *   poetry wins         → speaking tree  30 XP each
 *                       → culture tree   30 XP each
 *
 * @param {Object} store - Redux store instance
 */
export function initializeSkillTree(store) {
  const state = store.getState();
  const { skillTree, grammar, quests, vocabulary, alphabet, poetry } = state;

  // Guard: already initialized — any tree with XP > 0 means init already ran
  // or the player has earned XP through normal gameplay
  const hasAnyXP = Object.values(skillTree?.skillXP || {}).some((xp) => xp > 0);
  if (hasAnyXP) return;

  // Also guard if unlockedNodes has any entries (shouldn't happen without XP, but be safe)
  const hasAnyUnlocks = Object.values(skillTree?.unlockedNodes || {}).some(
    (nodes) => Array.isArray(nodes) && nodes.length > 0
  );
  if (hasAnyUnlocks) return;

  // Derive XP from existing progress signals
  const completedLessons = grammar?.completedLessons?.length ?? 0;
  const completedQuests = Object.values(quests?.quests ?? {}).filter(
    (q) => q.status === 'completed'
  ).length;
  const learnedWords = Object.keys(vocabulary?.fsrsCards ?? {}).length;
  const completedGroups = alphabet?.completedGroups?.length ?? 0;
  const poetryWins = (poetry?.completedBattles ?? []).filter((b) => b.won).length;

  // Award proportional XP (same rates as learningProgressMiddleware)
  if (completedLessons > 0) {
    store.dispatch(addSkillXP({ treeId: 'grammar', amount: completedLessons * 40 }));
  }
  if (completedQuests > 0) {
    store.dispatch(addSkillXP({ treeId: 'culture', amount: completedQuests * 30 }));
  }
  if (learnedWords > 0) {
    store.dispatch(addSkillXP({ treeId: 'reading', amount: learnedWords * 5 }));
  }
  if (completedGroups > 0) {
    store.dispatch(addSkillXP({ treeId: 'writing', amount: completedGroups * 25 }));
  }
  if (poetryWins > 0) {
    store.dispatch(addSkillXP({ treeId: 'speaking', amount: poetryWins * 30 }));
    store.dispatch(addSkillXP({ treeId: 'culture', amount: poetryWins * 30 }));
  }

  // Auto-unlock nodes whose cumulative XP cost is covered
  // Walk each tree in prerequisite order, unlocking nodes until XP runs out
  const updatedState = store.getState();
  for (const [treeId, tree] of Object.entries(SKILL_TREES)) {
    const availableXP = updatedState.skillTree.skillXP[treeId] ?? 0;
    if (availableXP <= 0) continue;

    // Sort nodes by xpCost ascending (cheapest first — maximize unlocks)
    const sortedNodes = [...tree.nodes].sort((a, b) => a.xpCost - b.xpCost);
    const toUnlock = [];
    let xpRemaining = availableXP;
    const alreadyUnlocked = new Set();

    for (const node of sortedNodes) {
      if (xpRemaining < node.xpCost) continue;
      // Check prerequisites are met (all prereqs must be in alreadyUnlocked set)
      const prereqsMet = node.prerequisites.every((pid) => alreadyUnlocked.has(pid));
      if (!prereqsMet) continue;
      toUnlock.push(node.id);
      alreadyUnlocked.add(node.id);
      xpRemaining -= node.xpCost;
    }

    if (toUnlock.length > 0) {
      store.dispatch(bulkUnlockNodes({ treeId, nodeIds: toUnlock }));
    }
  }
}
