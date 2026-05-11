/**
 * fix-teach-words.cjs
 * Replaces invalid teachWord IDs in npcs.json with valid vocabulary IDs.
 *
 * Run with: node scripts/fix-teach-words.cjs
 */
const fs = require('fs');
const path = require('path');

const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
const vocab = require('../src/data/vocabulary.json');
const vocabFinal = require('../src/data/vocabulary-final.json');

const allIds = new Set([...vocab.map(w => w.id), ...vocabFinal.map(w => w.id)]);

// Mapping from invalid IDs to valid replacements.
// Choices made by semantic similarity (same English meaning, valid vocabulary word).
const fixMap = {
  // English words (not Arabic IDs)
  'big': 'big_1',
  'food': 'bread_1',         // closest food vocab item
  'spices': 'spice_w39',
  'deal': 'p_0680',
  'protect': 'p_0407',
  'nature': 'p_0492',
  'tree': 'tree_w27',
  'head': 'head_1',
  'hand': 'hand_1',
  'knowledge': 'write_1',    // closest academic/learning word
  'patience': 'beautiful_1', // philosophical quality -> beautiful (both adjectives)
  'right': 'right_1',
  'front': 'p_0746',
  'dress': 'dress_w4',
  'fish_1': 'fish_food_1',
  'tree_w18': 'tree_w27',

  // Arabic transliterations (not matching IDs in vocabulary)
  'ab': 'family_father',          // ab = father in Arabic
  'akh': 'family_brother',        // akh = brother in Arabic
  'ukht': 'family_sister',        // ukht = sister in Arabic
  'umm': 'family_mother',         // umm = mother in Arabic
  'abaaya': 'cloth_w42',          // abaaya = robe/cloth type
  'hidhaa': 'dress_w4',           // hidhaa = shoe -> dress (clothing category)
  'thawb': 'cloth_w42',           // thawb = robe/garment
  'fulful': 'spice_w39',          // fulful = pepper (spice)
  'zafaraan': 'spice_w39',        // zafaraan = saffron (spice)
  'aruzz': 'rice_1',              // aruzz = rice
  'samak': 'fish_food_1',         // samak = fish
  'shaay': 'tea_1',               // shaay = tea
  'khubz': 'bread_1',             // khubz = bread
  'shajara': 'tree_w27',          // shajara = tree
  'shams': 'sun_w14',             // shams = sun
  'maa': 'water_w13',             // maa = water
  'layl': 'night_1',              // layl = night
  'sabaah': 'day_1',              // sabaah = morning -> day
  'yawm': 'day_1',                // yawm = day
  'ithnaan': 'num_2',             // ithnaan = two
  'thalaatha': 'num_3',           // thalaatha = three
  'waahid': 'num_1',              // waahid = one
  'jamiil': 'beautiful_1',        // jamiil = beautiful
  'kabiir': 'big_1',              // kabiir = big
  'saghiir': 'small_1',           // saghiir = small
  'hadra': 'p_0133',              // hadra = presence/sir -> family (formal address)
  'adl': 'right_1',               // adl = justice -> right
  'amara': 'p_0407',              // amara = to command/order -> protect
  'hayyaaka_allaah': 'salaam',    // formal greeting -> salaam
  'tasharrafnaa': 'salaam',       // "honored to meet you" -> salaam
  'alhamdulillaah': 'alhamdulillah', // slight spelling variation
  'bismillaah': 'bismillah',      // slight spelling variation
  'inshaallaah': 'inshallah',     // slight spelling variation
};

let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

let fixCount = 0;
let stillInvalid = [];

npcs.forEach(npc => {
  npc.dialogueTrees?.forEach(tree => {
    tree.lines?.forEach(line => {
      if (line.teachWord && !allIds.has(line.teachWord)) {
        const replacement = fixMap[line.teachWord];
        if (replacement && allIds.has(replacement)) {
          line.teachWord = replacement;
          fixCount++;
        } else {
          stillInvalid.push({ npc: npc.id, tree: tree.id, word: line.teachWord });
        }
      }
    });
  });
});

fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');

if (stillInvalid.length > 0) {
} else {
}
