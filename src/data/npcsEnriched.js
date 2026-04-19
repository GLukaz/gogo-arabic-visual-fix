/**
 * npcsEnriched.js
 *
 * Barrel module that imports NPC metadata from npcs-meta.json (lightweight, ~48 KB),
 * applies the story-arc overlay from npcStoryArcs.js,
 * applies profession teaching data from npcProfessionTeaching.js,
 * and re-exports the enriched array as the default.
 *
 * DialogueTrees load lazily per zone via npcDialogueLoader.js.
 * At init time, mergeNpcStoryArcs sets dialogueTrees to only the story arc
 * extra trees (since base metadata has no dialogueTrees). The getter then
 * combines zone dialogue (loaded lazily) + story arc trees.
 *
 * All consumers should import from this module instead of npcs.json directly.
 */

import baseNpcs from './npcs-meta.json';
import { mergeNpcStoryArcs } from './npcStoryArcs.js';
import { mergeNpcProfessionTeaching } from './npcProfessionTeaching.js';
import { getDialogueForNpc, loadZoneDialogue } from './npcDialogueLoader.js';

// Apply story arcs first, then profession teaching
const npcsWithStoryArcs = mergeNpcStoryArcs(baseNpcs);
const enrichedMeta = mergeNpcProfessionTeaching(npcsWithStoryArcs);

// Wrap each NPC with a lazy dialogueTrees getter that merges
// zone dialogue (loaded lazily) + story arc extra trees (set at init)
const npcsData = enrichedMeta.map(npc => {
  // Story arc trees were set by mergeNpcStoryArcs as dialogueTrees
  // (since npcs-meta.json has no dialogueTrees, these are purely story arc trees)
  const storyArcTrees = npc.dialogueTrees || [];
  const wrapped = { ...npc };

  // Override dialogueTrees with a getter that combines zone + story arc dialogue
  Object.defineProperty(wrapped, 'dialogueTrees', {
    get() {
      const zoneTrees = getDialogueForNpc(npc.id) || [];
      // Merge: zone dialogue first, then story arc extra trees
      return zoneTrees.length > 0 ? [...zoneTrees, ...storyArcTrees] : storyArcTrees;
    },
    enumerable: true,
    configurable: true,
  });

  return wrapped;
});

export default npcsData;
export { loadZoneDialogue };
