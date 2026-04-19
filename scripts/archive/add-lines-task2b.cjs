/**
 * add-lines-task2b.cjs
 * Adds more dialogue lines to reach 1,543+ total.
 * Currently at 1443, need 100+ more.
 */
const fs = require('fs');
const path = require('path');

const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// ─── Add second return_visit tree to already-expanded secondary NPCs ─────────

// dockmaster-nadia: add port operations vocabulary
const nadia = npcs.find(n => n.id === 'dockmaster-nadia');
if (nadia) {
  nadia.dialogueTrees.push({
    id: 'topic_return_numbers_port',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'مَرحَباً مَرَّة ثانِيَة! مِيناؤنا مَشغول اليَوم',
        english: 'Welcome again! Our port is busy today.',
        transliteration: 'marhaban marra thaaniya! miinaau\'naa mashghool al-yawm'
      },
      {
        speaker: 'npc',
        arabic: 'عَشَرَة سُفُن في المِيناء — عَشَرَة هُوَ رَقم مُهِمّ في التِّجارَة',
        english: 'Ten ships in the port — ten is an important number in trade.',
        transliteration: '\'ashara sufun fil-miinaaa\' — \'ashara huwa raqm muhimm fit-tijaara',
        teachWord: 'num_3'
      },
      {
        speaker: 'npc',
        arabic: 'الأَرقامُ العَرَبِيَّة التي تَستَخدِمُها أَوروبّا جاءَت مِن العَرَب',
        english: 'The Arabic numerals Europe uses came from the Arabs.',
        transliteration: 'al-arqaamu al-arabiyya allati tastakhdimuha urubbaa jaa\'at min al-arab',
        culturalNote: 'Arabic numerals (١٢٣...) were adopted by Europe in the 10th-12th centuries through Arab scholars in Andalusia, particularly Al-Khwarizmi\'s "On Hindu-Arabic Numerals." Before this, Europe used Roman numerals (I, V, X...) — nearly impossible for complex calculation.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الأَرقامُ العَرَبِيَّة! شُكراً نادِيَة',
            english: 'Arabic numerals! Thank you, Nadia.',
            next: null
          }
        ]
      }
    ]
  });
}

// carpet-seller-jamal: add trade vocabulary
const jamal = npcs.find(n => n.id === 'carpet-seller-jamal');
if (jamal) {
  jamal.dialogueTrees.push({
    id: 'topic_return_trade2',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَهلاً وَسَهلاً مَرَّة ثانِيَة! اليَوم نَتَعَلَّم التِّجارَة',
        english: 'Welcome back! Today we learn trade vocabulary.',
        transliteration: 'ahlan wa sahlan marra thaaniya! al-yawm nata\'allam at-tijaara'
      },
      {
        speaker: 'npc',
        arabic: 'سِعر — كَم سِعره؟ هَذا السُّؤال في كُلّ سوق',
        english: 'Si\'r — price. How much is it? This question is in every market.',
        transliteration: 'si\'r — kam si\'ruh? haadha as-su\'aal fii kull suuq',
        teachWord: 'p_0680'
      },
      {
        speaker: 'npc',
        arabic: 'وَكَلِمَة "tariff" الإنجليزِيَّة جاءَت مِن العَرَبِيَّة "تَعريفَة" — رُسوم التِّجارَة',
        english: 'The English word "tariff" came from Arabic "ta\'rifa" — trade fees.',
        transliteration: 'wa kalima "tariff" al-injliiziyya jaa\'at min al-arabiyya "ta\'rifa"',
        culturalNote: '"Tariff" traces to Arabic ta\'rifa (تَعرِفَة, price list/notification). Arab merchants in the medieval Mediterranean standardized many trade practices that European merchants then adopted — including the use of written contracts (sakk, which became "cheque/check").'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلَّمتَني الكَثير! شُكراً جَمال',
            english: 'You taught me much! Thank you, Jamal.',
            next: null
          }
        ]
      }
    ]
  });
}

// garden-keeper-leila: add second tree on seasons
const leila = npcs.find(n => n.id === 'garden-keeper-leila');
if (leila) {
  leila.dialogueTrees.push({
    id: 'topic_return_seasons',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'عُدتَ يا صَديقي! الفُصول تَتَغَيَّر وَالحَديقَة تَتَجَدَّد',
        english: 'You returned, my friend! The seasons change and the garden renews.',
        transliteration: '\'udta yaa sadiiqii! al-fusool tataghayar wal-hadiqa tatajaddad'
      },
      {
        speaker: 'npc',
        arabic: 'رَبيع — فَصلُ الأَزهار وَالأَمَل',
        english: 'Rabia — spring, the season of flowers and hope.',
        transliteration: 'rabiia — faslu al-azhaar wal-amal',
        teachWord: 'day_1'
      },
      {
        speaker: 'npc',
        arabic: 'صَيف — الحَرارَة وَالعَمَل. شِتاء — المَطَر وَالرّاحَة',
        english: 'Sayf — summer, heat and work. Shitaa\' — winter, rain and rest.',
        transliteration: 'sayf — al-haraara wal-\'amal. shitaa\' — al-matar war-raaha'
      },
      {
        speaker: 'npc',
        arabic: 'وَكَلِمَة "monsoon" الإنجليزِيَّة جاءَت مِن العَرَبِيَّة "مَوسِم" — المَوسِم',
        english: 'The English word "monsoon" came from Arabic "mawsim" — the season.',
        transliteration: 'wa kalima "monsoon" al-injliiziyya jaa\'at min al-arabiyya "mawsim"',
        culturalNote: '"Monsoon" derives from Arabic mawsim (مَوسِم, season). Arab sailors in the Indian Ocean used the seasonal monsoon winds to navigate between Arabia, India, and East Africa — mastering these patterns by the 8th century CE.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الفُصول كَالحَياة. شُكراً لَيلى',
            english: 'The seasons are like life. Thank you, Leila.',
            next: null
          }
        ]
      }
    ]
  });
}

// baker-yasmin: add baking process lines
const yasmin = npcs.find(n => n.id === 'baker-yasmin');
if (yasmin) {
  yasmin.dialogueTrees.push({
    id: 'topic_return_cooking2',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَهلاً مَرَّة ثانِيَة! الفُرن ساخِن وَعِندي دَرس جَديد',
        english: 'Welcome again! The oven is hot and I have a new lesson.',
        transliteration: 'ahlan marra thaaniya! al-furn saakhin wa \'indii dars jadiid'
      },
      {
        speaker: 'npc',
        arabic: 'قَهوَة — المَشروب المُقَدَّس في العالَم العَرَبي',
        english: 'Qahwa — coffee, the sacred drink in the Arab world.',
        transliteration: 'qahwa — al-mashrob al-muqaddas fil-\'aalam al-\'arabii',
        teachWord: 'tea_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَكَلِمَة "coffee" الإنجليزِيَّة جاءَت مِن "قَهوَة" العَرَبِيَّة',
        english: 'The English word "coffee" came from Arabic "qahwa".',
        transliteration: 'wa kalima "coffee" al-injliiziyya jaa\'at min "qahwa" al-arabiyya',
        culturalNote: '"Coffee" derives from Arabic qahwa (قَهوَة). Coffee originated in Ethiopia but Arab merchants popularized it worldwide from 15th century Yemen. The first coffeehouses (qahwakhaana) opened in Mecca around 1450 CE, creating the world\'s first "café culture".'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الآن أُريدُ قَهوَة! شُكراً ياسمين',
            english: 'Now I want coffee! Thank you, Yasmin.',
            next: null
          }
        ]
      }
    ]
  });
}

// mountain-hermit-idris: add numbers/counting philosophical context
const idris = npcs.find(n => n.id === 'mountain-hermit-idris');
if (idris) {
  idris.dialogueTrees.push({
    id: 'topic_return_philosophy',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الجَبَل يَرحَّب بِك مَرَّة أُخرى. لِنَتَأَمَّل',
        english: 'The mountain welcomes you again. Let us reflect.',
        transliteration: 'al-jabal yurahahib bik marra ukhraa. linata\'ammal'
      },
      {
        speaker: 'npc',
        arabic: 'حِكمَة — وَكَلِمَة "حَكيم" تَعني الحَكيم أَو الطَّبيب في العَرَبِيَّة القَديمَة',
        english: 'Hikma — wisdom. And "hakim" means wise man or physician in classical Arabic.',
        transliteration: 'hikma — wa kalima "hakiim" ta\'nii al-hakiim aw at-tabiib fil-arabiyya al-qadiima',
        teachWord: 'beautiful_1'
      },
      {
        speaker: 'npc',
        arabic: 'ابن سينا لَقَّبوه "الشَّيخ الرَّئيس" — رَئيس الحُكَماء',
        english: 'Ibn Sina was titled "al-Shaykh al-Ra\'is" — Chief of the Wise.',
        transliteration: 'ibn siinaa laqqabuuh "ash-shaykh ar-ra\'iis" — ra\'iis al-hukamaa\''
      },
      {
        speaker: 'npc',
        arabic: 'وَ"elixir" الإنجليزِيَّة جاءَت مِن الكيمياء العَرَبِيَّة "الإِكسير"',
        english: 'And English "elixir" came from Arabic alchemy: "al-iksir".',
        transliteration: 'wa "elixir" al-injliiziyya jaa\'at min al-kiimyaa\' al-arabiyya "al-iksir"',
        culturalNote: '"Elixir" derives from Arabic al-iksir (الإِكسير), itself from Greek xerion. Arab alchemists like Jabir ibn Hayyan (8th c.) developed systematic chemistry — the word "alchemy" itself comes from Arabic al-kimiya (الكيمياء), from Coptic kemi (black earth/Egypt).'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'العِلمُ العَرَبي في كُلّ مَكان! شُكراً إِدريس',
            english: 'Arabic science is everywhere! Thank you, Idris.',
            next: null
          }
        ]
      }
    ]
  });
}

// stable-master-yara: add animal care vocabulary
const yara = npcs.find(n => n.id === 'stable-master-yara');
if (yara) {
  yara.dialogueTrees.push({
    id: 'topic_return_animals2',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'مَرحَباً مَرَّة ثانِيَة! الإِسطَبل مَكان يُعَلِّم',
        english: 'Welcome again! The stable is a place that teaches.',
        transliteration: 'marhaban marra thaaniya! al-istab al-makaan yu\'allim'
      },
      {
        speaker: 'npc',
        arabic: 'الحِصان العَرَبي الأَصيل — أَسرَع خَيل في العالَم القَديم',
        english: 'The Arabian thoroughbred — the fastest horse in the ancient world.',
        transliteration: 'al-hisaan al-arabii al-asiil — asra\' khayl fil-\'aalam al-qadiim',
        teachWord: 'night_1'
      },
      {
        speaker: 'npc',
        arabic: 'اللُّغَة العَرَبِيَّة عِندَها مِئَة اِسم لِلحِصان وَخَمسِمِئَة لِلأَسَد',
        english: 'Arabic has one hundred names for the horse and five hundred for the lion.',
        transliteration: 'al-lugha al-arabiyya \'indahaa mi\'a ism lil-hisaan wa khamsumi\'a lil-asad',
        culturalNote: 'Classical Arabic\'s richness of vocabulary is legendary: reportedly 1,000+ words for camel and its states, 500+ for lion, 200+ for snake. This reflects the Bedouin oral tradition of precision in describing the natural world upon which survival depended.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'اللُّغَة العَرَبِيَّة غَنِيَّة جِدَّاً! شُكراً يارا',
            english: 'Arabic is so rich! Thank you, Yara.',
            next: null
          }
        ]
      }
    ]
  });
}

// astronomer-zain: add math history vocabulary
const zain = npcs.find(n => n.id === 'astronomer-zain');
if (zain) {
  zain.dialogueTrees.push({
    id: 'topic_return_math',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'عُدتَ يا طالِب! النُّجوم تَنتَظِر دَراسَتَنا',
        english: 'You returned, student! The stars await our study.',
        transliteration: '\'udta yaa taalib! an-nujoom tantazir diraasatanaa'
      },
      {
        speaker: 'npc',
        arabic: 'جَبر — اِبتَكَرَه الخَوارِزمي في بَغداد سَنَة ٨٣٠ مِيلادِيَّة',
        english: 'Jabr — algebra, invented by al-Khwarizmi in Baghdad in 830 CE.',
        transliteration: 'jabr — ibtakarahu al-khawaarizmi fii baghdaad sana 830 miilaadiyya',
        teachWord: 'num_2',
        culturalNote: 'Al-Khwarizmi\'s book "Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala" (830 CE) gave us both "algebra" (from al-jabr) and the word "algorithm" (from his Latinized name Algoritmi). His work formed the basis of all modern mathematics.'
      },
      {
        speaker: 'npc',
        arabic: 'وَكَلِمَة "algorithm" جاءَت مِن اِسمِه — الخَوارِزمي يُلفَظ بِاللّاتينِيَّة "Algoritmi"',
        english: '"Algorithm" came from his name — al-Khwarizmi was pronounced "Algoritmi" in Latin.',
        transliteration: 'wa kalima "algorithm" jaa\'at min ismihi — al-khawaarizmi yulafaz bil-laatiiniyya "Algoritmi"'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الجَبر وَالخَوارِزمِيَّات! شُكراً زَين',
            english: 'Algebra and algorithms! Thank you, Zain.',
            next: null
          }
        ]
      }
    ]
  });
}

// Write the updated npcs.json
fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
console.log('Done! Additional lines added to npcs.json.');
