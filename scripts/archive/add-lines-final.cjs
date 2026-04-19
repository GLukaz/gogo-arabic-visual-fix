/**
 * add-lines-final.cjs - add 8+ lines to cross 1543
 */
const fs = require('fs');
const path = require('path');
const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// Add a small return_visit tree to princess-aisha (she has 57 lines, room for more)
const aisha = npcs.find(n => n.id === 'princess-aisha');
if (aisha) {
  aisha.dialogueTrees.push({
    id: 'aisha_women_scholars',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'هَل تَعرِف أَنَّ النِّساء العَرَبِيّات كُنَّ عالِمات كَبيرات؟',
        english: 'Did you know that Arab women were great scholars?',
        transliteration: "hal ta'rif anna an-nisaa' al-arabiyyaat kunna 'aalimaat kabiraat?"
      },
      {
        speaker: 'npc',
        arabic: 'خَيزُران — أُمّ هارون الرَّشيد — كانَت مِن أَقوَى النِّساء في التّاريخ',
        english: 'Khayzuran — mother of Harun al-Rashid — was one of the most powerful women in history.',
        transliteration: "khayzuraan — umm haaroon ar-rashiid — kaanat min aqwaa an-nisaa' fit-taariikh",
        teachWord: 'family_mother',
        culturalNote: 'Khayzuran (d. 789 CE), mother of Harun al-Rashid, wielded enormous political power in the Abbasid caliphate. Lubna of Cordoba (d. 984) ran the royal library of 400,000 volumes. Fatima al-Fihri (d. 880) founded al-Qarawiyyin — the world\'s oldest continuously operating university.'
      },
      {
        speaker: 'player',
        choices: [{ arabic: 'النِّساء العالِمات! مُلهِم. شُكراً', english: 'Women scholars! Inspiring. Thank you.', next: null }]
      }
    ]
  });
  console.log('Added aisha_women_scholars tree');
}

// Add one more line to wanderer-ali's default tree
const ali = npcs.find(n => n.id === 'wanderer-ali');
if (ali) {
  const defaultTree = ali.dialogueTrees.find(t => t.trigger === 'default' || t.id === 'default');
  if (defaultTree) {
    // Insert extra lines before the last line if it's a choice
    const lastLine = defaultTree.lines[defaultTree.lines.length - 1];
    if (lastLine && lastLine.choices) {
      defaultTree.lines.splice(defaultTree.lines.length - 1, 0,
        {
          speaker: 'npc',
          arabic: 'الرِّحلَة لا تَنتَهي — كُلَّما سافَرتَ وَجَدتَ أَسرار جَديدَة',
          english: 'The journey never ends — the more you travel, the more secrets you find.',
          transliteration: "ar-rihla laa tantahii — kullama saafarta wajadta asraar jadiida"
        },
        {
          speaker: 'npc',
          arabic: 'تَذَكَّر: "السَّفَر يُوسِّع العَقل" — وَاللُّغَة تُوسِّعُهُ أَكثَر',
          english: 'Remember: "Travel broadens the mind" — and language broadens it more.',
          transliteration: "tadhakkar: 'as-safar yuwassi' al-'aql' — wal-lugha tuwassi'uh akthar",
          teachWord: 'moon_w15'
        }
      );
      console.log('Added extra lines to wanderer-ali default tree');
    }
  }
}

fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
console.log('Done!');
