/**
 * Zone-based lazy dialogue loading for NPCs.
 *
 * NPC metadata (npcs-meta.json, ~48 KB) loads eagerly.
 * NPC dialogueTrees (~517 KB total) load lazily per zone on zone entry.
 *
 * Usage:
 *   await loadZoneDialogue('oasis_village');
 *   const trees = getDialogueForNpc('npc_amira');
 */

const dialogueCache = new Map(); // zone → Map<npcId, dialogueTrees>
const loadingPromises = new Map(); // zone → Promise (dedup concurrent loads)

/**
 * Load dialogue data for all NPCs in a zone.
 * Returns cached data if already loaded.
 */
export async function loadZoneDialogue(zoneName) {
  if (dialogueCache.has(zoneName)) return dialogueCache.get(zoneName);

  // Dedup concurrent requests for the same zone
  if (loadingPromises.has(zoneName)) return loadingPromises.get(zoneName);

  const promise = (async () => {
    try {
      // Dynamic import — Vite splits each zone's dialogue into its own chunk
      const modules = import.meta.glob('./npc-dialogue/*.json');
      const key = `./npc-dialogue/${zoneName}.json`;
      if (!modules[key]) {
        // Zone has no dialogue file
        dialogueCache.set(zoneName, new Map());
        return dialogueCache.get(zoneName);
      }
      const module = await modules[key]();
      const data = module.default || module;
      const zoneDialogue = new Map();
      for (const npc of data) {
        zoneDialogue.set(npc.id, npc.dialogueTrees);
      }
      dialogueCache.set(zoneName, zoneDialogue);
      return zoneDialogue;
    } catch {
      // Zone has no NPC dialogue file — return empty
      dialogueCache.set(zoneName, new Map());
      return dialogueCache.get(zoneName);
    } finally {
      loadingPromises.delete(zoneName);
    }
  })();

  loadingPromises.set(zoneName, promise);
  return promise;
}

/**
 * Get dialogueTrees for a specific NPC (synchronous, from cache).
 * Returns null if zone dialogue hasn't been loaded yet.
 */
export function getDialogueForNpc(npcId) {
  for (const zoneMap of dialogueCache.values()) {
    if (zoneMap.has(npcId)) return zoneMap.get(npcId);
  }
  return null;
}

/**
 * Preload dialogue for adjacent zones (fire-and-forget).
 */
export function preloadAdjacentZones(currentZone, zoneGraph) {
  const adjacent = zoneGraph?.[currentZone] || [];
  for (const zone of adjacent) {
    loadZoneDialogue(zone);
  }
}

/**
 * Check if dialogue for a zone is already cached.
 */
export function isZoneDialogueLoaded(zoneName) {
  return dialogueCache.has(zoneName);
}
