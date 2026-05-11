/**
 * add-final3.cjs - add exactly 3 lines to cross 1543
 */
const fs = require('fs');
const path = require('path');
const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// Add 3 lines to fishmonger-hana's buying_lesson tree
const hana = npcs.find(n => n.id === 'fishmonger-hana');
if (hana) {
  const buyingTree = hana.dialogueTrees.find(t => t.id === 'hana_buying_lesson');
  if (buyingTree) {
    // Add 3 lines before the final choice
    const lastLine = buyingTree.lines[buyingTree.lines.length - 1];
    if (lastLine && lastLine.choices) {
      buyingTree.lines.splice(buyingTree.lines.length - 1, 0,
        {
          speaker: 'npc',
          arabic: 'السّوق مَكان التَّعَلُّم الحَقيقي — هُنا اللُّغَة حَيَّة',
          english: 'The market is the real place of learning — here language is alive.',
          transliteration: "as-suuq makaan at-ta'allum al-haqiiqii — hunaa al-lugha hayya"
        },
        {
          speaker: 'npc',
          arabic: 'كُلّ كَلِمَة تَعَلَّمتَها — اِستَخدِمها في السّوق وَسَتَبقى مَعَك',
          english: 'Every word you learned — use it in the market and it will stay with you.',
          transliteration: "kull kalima ta'allamtaha — istakhdimha fis-suuq wa stabqaa ma'ak"
        },
        {
          speaker: 'npc',
          arabic: 'وَإِذا أَخطَأتَ — لا بَأس! التُّجّار يَفهَمون وَيَبتَسِمون',
          english: 'And if you make a mistake — no problem! Traders understand and smile.',
          transliteration: "wa idhaa akhtaa't — laa ba's! at-tujjaar yafhamoon wa yabtasimoon"
        }
      );
    }
  } else {
    hana.dialogueTrees.push({
      id: 'hana_market_wisdom',
      trigger: 'return_visit',
      lines: [
        {
          speaker: 'npc',
          arabic: 'السّوق مَكان التَّعَلُّم الحَقيقي — هُنا اللُّغَة حَيَّة',
          english: 'The market is the real place of learning — here language is alive.',
          transliteration: "as-suuq makaan at-ta'allum al-haqiiqii — hunaa al-lugha hayya"
        },
        {
          speaker: 'npc',
          arabic: 'كُلّ كَلِمَة تَعَلَّمتَها — اِستَخدِمها هُنا وَسَتَبقى مَعَك',
          english: 'Every word you learned — use it here and it will stay with you.',
          transliteration: "kull kalima ta'allamtaha — istakhdimha hunaa wa stabqaa ma'ak"
        },
        {
          speaker: 'npc',
          arabic: 'وَإِذا أَخطَأتَ — لا بَأس! التُّجّار يَفهَمون وَيَبتَسِمون',
          english: 'And if you make a mistake — no problem! Traders understand and smile.',
          transliteration: "wa idhaa akhtaa't — laa ba's! at-tujjaar yafhamoon wa yabtasimoon"
        },
        { speaker: 'player', choices: [{ arabic: 'شُكراً هَناء!', english: 'Thank you, Hana!', next: null }] }
      ]
    });
  }
}

fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
