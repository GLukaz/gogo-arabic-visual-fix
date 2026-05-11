/**
 * Split npcs.json into:
 * - npcs-meta.json  (NPC metadata without dialogue topics)
 * - npc-dialogue/{zone}.json (per-zone dialogue topics)
 *
 * Run: node scripts/split-npc-data.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../src/data');

const npcs = JSON.parse(fs.readFileSync(path.join(dataDir, 'npcs.json'), 'utf-8'));

// Meta: everything except dialogueTrees (the heavy field — 824 KB)
const meta = npcs.map(({ _dialogueTrees, ...rest }) => rest);
fs.writeFileSync(path.join(dataDir, 'npcs-meta.json'), JSON.stringify(meta, null, 2));

// Dialogue: grouped by zone (dialogueTrees is the heavy data)
const byZone = {};
for (const npc of npcs) {
  const zone = npc.zone || 'unknown';
  if (!byZone[zone]) byZone[zone] = [];
  if (npc.dialogueTrees && Object.keys(npc.dialogueTrees).length > 0) {
    byZone[zone].push({ id: npc.id, dialogueTrees: npc.dialogueTrees });
  }
}

const dialogueDir = path.join(dataDir, 'npc-dialogue');
fs.mkdirSync(dialogueDir, { recursive: true });

for (const [zone, dialogue] of Object.entries(byZone)) {
  fs.writeFileSync(path.join(dialogueDir, `${zone}.json`), JSON.stringify(dialogue, null, 2));
}

// Summary
const metaSize = Buffer.byteLength(JSON.stringify(meta));
let totalDialogue = 0;
for (const [zone, dialogue] of Object.entries(byZone)) {
  const size = Buffer.byteLength(JSON.stringify(dialogue));
  totalDialogue += size;
}
