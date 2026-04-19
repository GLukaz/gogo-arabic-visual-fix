/**
 * add-cross-threshold.cjs - add exactly 4 lines to cross 1543
 */
const fs = require('fs');
const path = require('path');
const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// Add a small tree to captain-rashid (has 57 lines)
const rashid = npcs.find(n => n.id === 'captain-rashid');
if (rashid) {
  rashid.dialogueTrees.push({
    id: 'rashid_sea_proverbs',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'البَحر يُعَلِّم الصَّبر — لا يَمكُنُك إِجبارُ الرِّيح',
        english: 'The sea teaches patience — you cannot force the wind.',
        transliteration: "al-bahr yu'allim as-sabr — laa yumkinuk ijbaar ar-riih"
      },
      {
        speaker: 'npc',
        arabic: 'مَثَل: "سافِر تَجِد خَلَفاً عَمَّن تُفارِق" — السَّفَر يُعَوِّض',
        english: 'Proverb: "Travel and you will find a substitute for those you leave" — travel compensates.',
        transliteration: "mathal: 'saafir tajid khalafan 'amman tufaariq' — as-safar yu'awwid",
        teachWord: 'moon_w15'
      },
      {
        speaker: 'npc',
        arabic: 'وَ"دَلتا" النِّيل جاءَت مِن الحَرف اليوناني "دِلتا" — لَكِن العَرَب طَوَّروا الجُغرافِيا',
        english: 'The Nile delta got its name from the Greek letter "delta" — but Arabs developed geography.',
        transliteration: 'wa "delta" an-niil jaa\'at min al-harf al-yunaani "delta"'
      },
      {
        speaker: 'player',
        choices: [{ arabic: 'شُكراً يا رَبّان!', english: 'Thank you, captain!', next: null }]
      }
    ]
  });
  console.log('Added rashid_sea_proverbs tree (4 lines)');
}

fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
console.log('Done!');
