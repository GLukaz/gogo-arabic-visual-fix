/**
 * add-lines-task2c.cjs
 * Adds ~80+ more lines to reach 1,543+ total.
 * Currently at 1473, need 70+ more.
 */
const fs = require('fs');
const path = require('path');

const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// ─── Add third return_visit tree to secondary NPCs with 2 extra lines each ───

// dockmaster-nadia: ship vocabulary
const nadia = npcs.find(n => n.id === 'dockmaster-nadia');
if (nadia) {
  nadia.dialogueTrees.push({
    id: 'topic_return_ships',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'سَفينَة — أَجمَل كَلِمَة في المِيناء. كَم سَفينَة تَرى؟',
        english: 'Safiina — the most beautiful word in the port. How many ships do you see?',
        transliteration: 'safiina — ajmal kalima fil-miinaaa. kam safiina taraa?',
        teachWord: 'water_w13'
      },
      {
        speaker: 'npc',
        arabic: 'المَركَب العَرَبي "الدّاو" أَبحَرَ مِن أَفريقيا إلى الصّين وَعادَ — ١٠٠٠ سَنَة قَبلَ كولومبوس',
        english: 'The Arab "dhow" ship sailed from Africa to China and back — 1,000 years before Columbus.',
        transliteration: 'al-markab al-arabii "ad-daaw" abhara min afriqia ilaa as-siin wa \'aada',
        culturalNote: 'The Arab dhow (داو) was the dominant vessel of the Indian Ocean trade network from the 8th-19th centuries. Arab navigator Ahmad ibn Majid (15th c.) wrote 40+ navigation treatises — and guided Vasco da Gama to India in 1498.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'العَرَب بَحّارَة عُظَماء! شُكراً',
            english: 'Arabs were great sailors! Thank you.',
            next: null
          }
        ]
      }
    ]
  });
}

// carpet-seller-jamal: weaving techniques
const jamal = npcs.find(n => n.id === 'carpet-seller-jamal');
if (jamal) {
  jamal.dialogueTrees.push({
    id: 'topic_return_weaving',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'نَسيج — فِعل النَّسج. وَمِنهُ جاءَت "magazine" بِالإنجليزِيَّة؟',
        english: 'Nasij — the act of weaving. And from this came "magazine" in English?',
        transliteration: 'nasiij — fi\'l an-nasj.'
      },
      {
        speaker: 'npc',
        arabic: 'لا! "magazine" جاءَت مِن العَرَبِيَّة "مَخزَن" — مَكان لِتَخزين الأَشياء',
        english: 'No! "Magazine" came from Arabic "makhzan" — a storage place.',
        transliteration: 'laa! "magazine" jaa\'at min al-arabiyya "makhzan" — makaan litakhziil al-ashyaa\'',
        teachWord: 'cloth_w42',
        culturalNote: '"Magazine" derives from Arabic makhzan (مَخزَن, warehouse/storage), via Italian magazzino. The same root gives us "Maghreb" (al-Maghrib, the west) and the French word "magasin" (store). The publishing use — "magazine" as a repository of articles — preserves the storage metaphor.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'المَخزَن أَصبَحَ مَجَلَّة! شُكراً جَمال',
            english: 'The warehouse became a magazine! Thank you, Jamal.',
            next: null
          }
        ]
      }
    ]
  });
}

// baker-yasmin: ramadan tradition
const yasmin = npcs.find(n => n.id === 'baker-yasmin');
if (yasmin) {
  yasmin.dialogueTrees.push({
    id: 'topic_return_traditions',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'هَل تَعرِف "رَمَضان"؟ شَهر الصِّيام وَالعَطاء',
        english: 'Do you know "Ramadan"? The month of fasting and giving.',
        transliteration: 'hal ta\'rif "ramadaan"? shahr as-siyaam wal-\'ataa\''
      },
      {
        speaker: 'npc',
        arabic: 'فِي رَمَضان نَأكُل "سُحور" قَبلَ الفَجر وَ"إِفطار" عِندَ الغُروب',
        english: 'In Ramadan we eat "suhoor" before dawn and "iftar" at sunset.',
        transliteration: 'fii ramadaan na\'kul "suhoor" qabl al-fajr wa "iftaar" \'inda al-ghuroob',
        teachWord: 'day_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَكَلِمَة "مُهمَّش" تَعني الحَرَكات فَوق الحُروف — مِنها جاءَت harakat',
        english: 'Vowel marks in Arabic are called harakat — "movements" over letters.',
        transliteration: 'harakat al-huroof — harakaat — "movements" fawq al-huroof'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'رَمَضان مُبارَك! شُكراً ياسمين',
            english: 'Ramadan Mubarak! Thank you, Yasmin.',
            next: null
          }
        ]
      }
    ]
  });
}

// stable-master-yara: desert survival
const yara = npcs.find(n => n.id === 'stable-master-yara');
if (yara) {
  yara.dialogueTrees.push({
    id: 'topic_return_desert',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الجَمَل — سَفينَة الصَّحراء — يُخزِّن الدَّهن في سَنامِه لَيسَ الماء',
        english: 'The camel — ship of the desert — stores fat in its hump, not water.',
        transliteration: 'al-jamal — safinat as-sahraa\' — yukhazzin ad-dahn fii sanamih laysa al-maa\'',
        teachWord: 'day_1'
      },
      {
        speaker: 'npc',
        arabic: 'العَرَب سَمَّوا الجَمَل "سَفينَة الصَّحراء" — وَهُوَ وَسيلَة نَقلِهِم لِأَلفَي سَنَة',
        english: 'Arabs called the camel "ship of the desert" — their transport for two thousand years.',
        transliteration: 'al-arab sammaaw al-jamal "safinat as-sahraa\'" — wa huwa wasiilat naqlihim li-alfay sana',
        culturalNote: 'The camel\'s domestication around 3000 BCE transformed the Arabian peninsula. Classical Arabic has reportedly over 1,000 words related to camels and their states — reflecting the animal\'s centrality to Bedouin survival.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الجَمَل مُعجِزَة! شُكراً يارا',
            english: 'The camel is a miracle! Thank you, Yara.',
            next: null
          }
        ]
      }
    ]
  });
}

// garden-keeper-leila: water and irrigation
const leila = npcs.find(n => n.id === 'garden-keeper-leila');
if (leila) {
  leila.dialogueTrees.push({
    id: 'topic_return_water',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الماء حَياة! "ماء" — أَقصَر الكَلِمات وَأَهَمُّها',
        english: 'Water is life! "Maa\'" — the shortest word and the most important.',
        transliteration: 'al-maa\' hayaat! "maa\'" — aqsar al-kalimaat wa ahammuha',
        teachWord: 'water_w13'
      },
      {
        speaker: 'npc',
        arabic: 'قَناة — العَرَب بَنوا قَنوات الري في الأَندَلُس — لا تَزال تَعمَل',
        english: 'Qanaat — the Arabs built irrigation canals in Andalusia — still working.',
        transliteration: 'qanaah — al-arab banaw qanawaat ar-ray fii al-andalus — laa tazaal ta\'mal',
        culturalNote: 'The Arab Agricultural Revolution (8th-13th c.) transformed Spain: the Arabs introduced sophisticated irrigation systems (qanat, نهر), new crops (citrus, cotton, rice, sugarcane), and agricultural manuals. Andalusian gardens like the Generalife in Granada preserve this legacy.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الماء يَجمَع البَشَر! شُكراً لَيلى',
            english: 'Water connects humanity! Thank you, Leila.',
            next: null
          }
        ]
      }
    ]
  });
}

// astronomer-zain: astrolabe
const zain = npcs.find(n => n.id === 'astronomer-zain');
if (zain) {
  zain.dialogueTrees.push({
    id: 'topic_return_navigation',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الإِسطِرلاب — أَداة المُنَجِّمين العَرَب لِقياس النُّجوم',
        english: 'Al-Istirllab — the astrolabe, the Arab astronomers\' tool for measuring stars.',
        transliteration: 'al-istirllab — adaatu al-munajjimiin al-arab liqiyaas an-nujoom',
        teachWord: 'star_w16',
        culturalNote: 'The astrolabe (الإِسطِرلاب, from Greek) was perfected by Arab astronomers. By the 9th century, Muslim scholars had built astrolabes with 1,000+ star positions. It solved problems of time, prayer direction (qibla), and navigation — a pocket-sized computer of the medieval world.'
      },
      {
        speaker: 'npc',
        arabic: 'بِالإِسطِرلاب يُمكِنُك مَعرِفَة وَقت الصَّلاة أَينَما كُنتَ في العالَم',
        english: 'With the astrolabe you can know prayer time wherever you are in the world.',
        transliteration: 'bil-istirllab yumkinuka ma\'rifat waqt as-salaa aynamaa kunta fil-\'aalam'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عِلم وَدين في آنٍ مَعاً! شُكراً زَين',
            english: 'Science and faith together! Thank you, Zain.',
            next: null
          }
        ]
      }
    ]
  });
}

// mountain-hermit-idris: Arabic script history
const idris = npcs.find(n => n.id === 'mountain-hermit-idris');
if (idris) {
  idris.dialogueTrees.push({
    id: 'topic_return_writing',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الكِتابَة العَرَبِيَّة تَسير مِن اليَمين إلى اليَسار — كَالشَّمس تَغرُب',
        english: 'Arabic writing goes from right to left — like the sun setting.',
        transliteration: 'al-kitaaba al-arabiyya tasiir min al-yamiin ilaa al-yasaar — kashams taghrub',
        teachWord: 'write_1'
      },
      {
        speaker: 'npc',
        arabic: 'جَذر "ك-ت-ب": كَتَبَ — يَكتُب — كِتاب — كاتِب — مَكتَبَة — مَكتَب',
        english: 'Root K-T-B: kataba (he wrote) — yaktub (he writes) — kitaab (book) — kaatib (writer) — maktaba (library) — maktab (office).',
        transliteration: 'jadhr k-t-b: kataba — yaktub — kitaab — kaatib — maktaba — maktab',
        culturalNote: 'The Arabic trilateral root K-T-B (ك-ت-ب) demonstrates the system\'s power: from three letters, the language generates dozens of related words. Learning one root unlocks a whole vocabulary family — this is why Arabic learners say "once you see the roots, the language opens up."'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الجُذور تَفتَح العالَم! شُكراً إِدريس',
            english: 'Roots open the world! Thank you, Idris.',
            next: null
          }
        ]
      }
    ]
  });
}

// Write the updated npcs.json
fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
