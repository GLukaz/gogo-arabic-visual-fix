/**
 * add-lines-task2f.cjs - add 16 lines to cross 1543
 */
const fs = require('fs');
const path = require('path');
const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// poet-rumi: add a return_visit poetry tree
const rumi = npcs.find(n => n.id === 'poet-rumi');
if (rumi) {
  rumi.dialogueTrees.push({
    id: 'rumi_loanwords_poetry',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'عُدتَ! الشِّعرُ يَنتَظِرُك. لِنَتَكَلَّم عَن الأَلفاظ',
        english: "You're back! Poetry awaits you. Let's talk about words.",
        transliteration: "'udta! ash-shi'r yantaziruk. linatakallamm 'an al-alfaaz"
      },
      {
        speaker: 'npc',
        arabic: '"risk" الإنجليزِيَّة جاءَت مِن العَرَبِيَّة "رِزق" — الرَّزق الَّذي يُقَسِّمُه الله',
        english: 'The English "risk" came from Arabic "rizq" — the provision God distributes.',
        transliteration: '"risk" al-injliiziyya jaa\'at min al-arabiyya "rizq"',
        teachWord: 'beautiful_1',
        culturalNote: 'The English word "risk" traces to Arabic rizq (رِزق), meaning livelihood or God\'s provision. Arab traders in the medieval Mediterranean used it for the chance of maritime loss — European merchants adopted the term along with the trade practices.'
      },
      {
        speaker: 'npc',
        arabic: 'وَ"check" في البَنك جاءَت مِن "صَكّ" العَرَبِيَّة — وَثيقَة مالِيَّة',
        english: 'And bank "check" came from Arabic "sakk" — a financial document.',
        transliteration: 'wa "check" fil-bank jaa\'at min "sakk" al-arabiyya — wathiiqa maaliyya'
      },
      {
        speaker: 'player',
        choices: [{ arabic: 'الكَلِمات تُسافِر مِثلَنا! شُكراً', english: 'Words travel like us! Thank you.', next: null }]
      }
    ]
  });
}

// imam-muhammad: add return_visit prayer vocabulary
const imam = npcs.find(n => n.id === 'imam-muhammad');
if (imam) {
  imam.dialogueTrees.push({
    id: 'imam_arabic_unique',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'العَرَبِيَّة لُغَة الضَّاد — حَرف الضَّاد فَريد في العَرَبِيَّة وَحدَها',
        english: 'Arabic is the language of the Daad — the Daad letter is unique to Arabic alone.',
        transliteration: "al-arabiyya lughat ad-daad — harf ad-daad fariid fil-arabiyya wahdaha"
      },
      {
        speaker: 'npc',
        arabic: 'لا تَوجَد في أَيّ لُغَة أُخرى — هَذا يَجعَل العَرَبِيَّة فَريدَة',
        english: 'It exists in no other language — this makes Arabic unique.',
        transliteration: "laa tujad fii ayy lugha ukhraa — haadha yaj'al al-arabiyya fariida",
        teachWord: 'salaam'
      },
      {
        speaker: 'player',
        choices: [{ arabic: 'لُغَة الضَّاد! فَخور بِتَعَلُّمِها', english: 'Language of the Daad! Proud to learn it.', next: null }]
      }
    ]
  });
}

fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
