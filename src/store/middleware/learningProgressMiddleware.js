/**
 * learningProgressMiddleware.js
 *
 * Wires learning events to skill tree XP and dispatches reward actions
 * when skill tree nodes are unlocked.
 *
 * Kept separate from achievementMiddleware to avoid switch/case bloat.
 *
 * XP routing table:
 *   grammar/completeLesson         → grammar tree   +40 XP
 *                                  → unlockNextLesson (auto-unlock next lesson in sequence)
 *   quests/completeQuest           → culture tree   +30 XP
 *   achievements/recordPerfectQuiz → reading tree   +20 XP
 *   achievements/incrementReviews  → reading tree   +10 XP
 *   alphabet/completeGroup         → writing tree   +25 XP
 *   poetry/endPoetryBattle (won)   → speaking tree  +30 XP
 *                                  → culture tree   +30 XP
 *
 * Reward dispatch (skillTree/unlockNode):
 *   unlock_spell       → discoverRoot({ rootId, element: 'earth' }) in magicSlice
 *   unlock_zone        → setFlag({ key: 'zone_access_{value}', value: true })
 *   unlock_dialogue    → setFlag({ key: 'dialogue_{value}', value: true })
 *   unlock_npc_branch  → setFlag({ key: 'npc_branch_{value}', value: true })
 *
 * Re-entrancy: addSkillXP does not trigger any of the monitored action types,
 * so no re-entrancy guard is needed.
 */

import { addSkillXP } from '../slices/skillTreeSlice.js';
import { SKILL_TREES } from '../../data/skillTrees.js';
import { discoverRoot } from '../slices/magicSlice.js';
import { setFlag } from '../slices/worldStateSlice.js';
import { unlockNextLesson } from '../slices/grammarSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';

export const learningProgressMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  switch (action.type) {
    case 'grammar/completeLesson':
      store.dispatch(addSkillXP({ treeId: 'grammar', amount: 40 }));
      store.dispatch(unlockNextLesson({ completedLessonId: action.payload.lessonId }));
      break;
    case 'quests/completeQuest':
      store.dispatch(addSkillXP({ treeId: 'culture', amount: 30 }));
      break;
    case 'achievements/recordPerfectQuiz':
      store.dispatch(addSkillXP({ treeId: 'reading', amount: 20 }));
      break;
    case 'achievements/incrementReviews':
      store.dispatch(addSkillXP({ treeId: 'reading', amount: 10 }));
      break;
    case 'alphabet/completeGroup':
      store.dispatch(addSkillXP({ treeId: 'writing', amount: 25 }));
      break;
    case 'poetry/endPoetryBattle':
      if (action.payload?.won) {
        store.dispatch(addSkillXP({ treeId: 'speaking', amount: 30 }));
        store.dispatch(addSkillXP({ treeId: 'culture', amount: 30 }));
      }
      break;
    case 'cefrProgress/setCefrLevel': {
      // Emit milestone event once per CEFR level — guarded by worldState flag
      const level = action.payload?.level;
      if (level) {
        const flags = store.getState().worldState?.flags || {};
        const milestoneKey = `cefr_milestone_${level.toLowerCase()}_shown`;
        if (!flags[milestoneKey]) {
          EventBus.emit(EVENTS.CEFR_MILESTONE_REACHED, {
            npcId: 'guide-amira-cefr',
            context: { cefr_level: level },
          });
        }
      }
      break;
    }
    case 'skillTree/unlockNode': {
      const { treeId, nodeId } = action.payload;
      const tree = SKILL_TREES[treeId];
      if (!tree) break;
      const node = tree.nodes.find((n) => n.id === nodeId);
      if (!node?.rewards) break;

      switch (node.rewards.type) {
        case 'unlock_spell':
          // value is a rootId like 'ك-ت-ب' — discover it in magicSlice
          store.dispatch(discoverRoot({ rootId: node.rewards.value, element: 'earth' }));
          break;
        case 'unlock_zone':
          // value is a zone flag key like 'ancient_quarter'
          store.dispatch(setFlag({ key: `zone_access_${node.rewards.value}`, value: true }));
          break;
        case 'unlock_dialogue':
          // value is a dialogue flag key like 'merchant_elder_negotiation'
          store.dispatch(setFlag({ key: `dialogue_${node.rewards.value}`, value: true }));
          break;
        case 'unlock_npc_branch':
          // value is a story flag key like 'scholar_archive_branch'
          store.dispatch(setFlag({ key: `npc_branch_${node.rewards.value}`, value: true }));
          break;
        default:
          break;
      }
      break;
    }
    default:
      break;
  }

  return result;
};
