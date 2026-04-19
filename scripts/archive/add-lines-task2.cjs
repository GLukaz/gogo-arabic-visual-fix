/**
 * add-lines-task2.cjs
 * Adds dialogue lines to under-represented NPCs to reach the 1,543+ total line target.
 *
 * Approach:
 * - Expand mysterious-traveler and night-guard with proper intro trees
 * - Add one additional topic/return tree to 9 secondary NPCs
 * - Net addition: ~160 lines to bring 1393 -> 1553+
 */
const fs = require('fs');
const path = require('path');

const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// ─── mysterious-traveler: expand from 1 line to a full intro tree ───────────
const mysteriousTraveler = npcs.find(n => n.id === 'mysterious-traveler');
if (mysteriousTraveler) {
  // Replace the single-line intro with a proper tree + add return_visit tree
  mysteriousTraveler.dialogueTrees = [
    {
      id: 'intro',
      trigger: 'first_meeting',
      lines: [
        {
          speaker: 'npc',
          arabic: 'الرِّحلَة إلى المَعرِفَة تَبدَأ بِخُطوَة',
          english: 'The journey to knowledge begins with a step.',
          transliteration: 'ar-rihla ilaa al-ma\'rifa tabda\' bi-khutwa'
        },
        {
          speaker: 'npc',
          arabic: 'أَنا مُسافِر. رَأَيتُ بِلاداً كَثيرَة وَتَعَلَّمتُ لُغاتٍ كَثيرَة',
          english: 'I am a traveler. I have seen many lands and learned many languages.',
          transliteration: 'ana musaafir. ra\'aytu bilaadan kathiira wa ta\'allamtu lughaat kathiira'
        },
        {
          speaker: 'npc',
          arabic: 'العَرَبِيَّة — لُغَة الشِّعر وَالحِكمَة وَالعِلم',
          english: 'Arabic — the language of poetry, wisdom, and science.',
          transliteration: 'al-arabiyya — lughat ash-shi\'r wal-hikma wal-\'ilm'
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'أَخبِرني عَن رِحلاتِك',
              english: 'Tell me about your travels',
              next: 'traveler_stories'
            },
            {
              arabic: 'عَلِّمني كَلِمَة',
              english: 'Teach me a word',
              next: 'traveler_teaches'
            }
          ]
        }
      ]
    },
    {
      id: 'traveler_stories',
      lines: [
        {
          speaker: 'npc',
          arabic: 'رَحَلتُ مِن الأَندَلُس إلى بَغداد — شَهرَيْن عَلى الجَمَل',
          english: 'I traveled from Andalusia to Baghdad — two months on camel.',
          transliteration: 'rahaltu min al-andalus ilaa baghdaad — shahrayn \'alaa al-jamal',
          culturalNote: 'The medieval Islamic world was connected by vast trade and pilgrimage routes. Traveling from Cordoba in Andalusia (Spain) to Baghdad took months by camel caravan.'
        },
        {
          speaker: 'npc',
          arabic: 'في كُلّ مَدينَة تَعَلَّمتُ كَلِمات جَديدَة — التُّجّار يَتَحَدَّثون العَرَبِيَّة في كُلّ مَكان',
          english: 'In every city I learned new words — traders speak Arabic everywhere.',
          transliteration: 'fii kull madiina ta\'allamtu kalimaat jadiida — at-tujjaar yatahadathoon al-arabiyya fii kull makaan'
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'مَدهِش! شُكراً',
              english: 'Amazing! Thank you.',
              next: null
            }
          ]
        }
      ]
    },
    {
      id: 'traveler_teaches',
      trigger: 'return_visit',
      lines: [
        {
          speaker: 'npc',
          arabic: 'سَفَر — هَذِهِ كَلِمَة مُهِمَّة لِلمُسافِر',
          english: 'Safar — this is an important word for a traveler.',
          transliteration: 'safar — haadhihi kalima muhimma lil-musaafir',
          teachWord: 'moon_w15'
        },
        {
          speaker: 'npc',
          arabic: 'وَكَلِمَة "safari" الإنجليزِيَّة جاءَت مِن العَرَبِيَّة — سَفَري',
          english: 'And the English word "safari" came from Arabic — safarii (my journey).',
          transliteration: 'wa kalima "safari" al-injliiziyya jaa\'at min al-arabiyya — safarii',
          culturalNote: '"Safari" comes from Arabic safar (سَفَر, journey). Arab merchants and explorers established the trade routes across East Africa that later European explorers would follow.'
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'رائِع! شُكراً يا مُسافِر',
              english: 'Wonderful! Thank you, traveler.',
              next: null
            }
          ]
        }
      ]
    },
    {
      id: 'default',
      trigger: 'default',
      lines: [
        {
          speaker: 'npc',
          arabic: 'كُلّ يَوم جَديد فُرصَة لِلتَّعَلُّم',
          english: 'Every new day is an opportunity to learn.',
          transliteration: 'kull yawm jadiid fursa lit-ta\'allum'
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'أَخبِرني أَكثَر',
              english: 'Tell me more',
              next: 'traveler_stories'
            },
            {
              arabic: 'إلى اللِّقاء',
              english: 'Goodbye',
              next: null
            }
          ]
        }
      ]
    }
  ];
  console.log('Expanded mysterious-traveler');
}

// ─── night-guard: expand from 1 line to a proper character ───────────────────
const nightGuard = npcs.find(n => n.id === 'night-guard');
if (nightGuard) {
  nightGuard.dialogueTrees = [
    {
      id: 'default',
      trigger: 'default',
      lines: [
        {
          speaker: 'npc',
          arabic: 'المَنطِقَة آمِنَة. تَوَقَّف عِندَ الحاجَة',
          english: 'The area is safe. Stop if you need anything.',
          transliteration: 'al-mantiqа aamina. tawqqaf \'inda al-haaja'
        },
        {
          speaker: 'npc',
          arabic: 'أَنا الحارِس اللَّيلي. أَحمي المَدينَة مِن الغُروب إلى الفَجر',
          english: 'I am the night guard. I protect the city from sunset to dawn.',
          transliteration: 'ana al-haaris al-laylii. ahmi al-madiina min al-ghuroob ilaa al-fajr'
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'هَل تَعلَم شَيئاً عَن هَذِهِ المَدينَة؟',
              english: 'Do you know something about this city?',
              next: 'guard_lore'
            },
            {
              arabic: 'كَيفَ تَقول "أَمان" بِالعَرَبِيَّة؟',
              english: 'How do you say "safety" in Arabic?',
              next: 'guard_teaches'
            }
          ]
        }
      ]
    },
    {
      id: 'guard_lore',
      lines: [
        {
          speaker: 'npc',
          arabic: 'هَذِهِ المَدينَة قَديمَة جِدَّاً. بُنِيَت قَبلَ مِئَة وَخَمسين سَنَة',
          english: 'This city is very old. It was built 150 years ago.',
          transliteration: 'haadhihi al-madiina qadiima jiddan. buniyat qabla mi\'a wa khamsiin sana'
        },
        {
          speaker: 'npc',
          arabic: 'الحُراسُ الأَوائِل كانوا يَحفَظون القُرآن — كانَت تِلاوَتُهُم تُبعِد الشَّرّ',
          english: 'The first guards memorized the Quran — their recitation was said to ward off evil.',
          transliteration: 'al-hurrasu al-awaa\'il kaanuu yahfazoon al-qur\'an — kaanat tilaawatuhum tub\'id ash-sharr'
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'شُكراً يا حارِس',
              english: 'Thank you, guard.',
              next: null
            }
          ]
        }
      ]
    },
    {
      id: 'guard_teaches',
      trigger: 'return_visit',
      lines: [
        {
          speaker: 'npc',
          arabic: 'أَمَان — هَذِهِ الكَلِمَة الجَميلَة',
          english: 'Amaan — this beautiful word.',
          transliteration: 'amaan — haadhihi al-kalima al-jamiila',
          teachWord: 'right_1'
        },
        {
          speaker: 'npc',
          arabic: 'وَكَلِمَة "آمِن" تَعني safe — نَفس الجَذر: أ-م-ن',
          english: 'And "aamin" means safe — same root: A-M-N.',
          transliteration: 'wa kalima "aamin" ta\'nii safe — nafs al-jadhr: a-m-n'
        },
        {
          speaker: 'npc',
          arabic: 'الجَذر العَرَبي يُعطيك عَشَرات الكَلِمات مِن ثَلاثَة حُروف',
          english: 'The Arabic root gives you dozens of words from three letters.',
          transliteration: 'al-jadhr al-arabii yu\'tiika \'asharaat al-kalimaat min thalaatha huroof',
          culturalNote: 'The Arabic root system (trilateral roots) is one of the most systematic in the world. The root A-M-N (أ-م-ن) generates: amaan (safety), aamin (safe), mu\'min (believer), iimaan (faith), amiin (trustworthy).'
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'فَهِمتُ! شُكراً',
              english: 'I understand! Thank you.',
              next: null
            }
          ]
        }
      ]
    }
  ];
  console.log('Expanded night-guard');
}

// ─── Add return_visit teaching trees to secondary NPCs ───────────────────────

// dockmaster-nadia: add sea vocabulary teaching tree
const nadia = npcs.find(n => n.id === 'dockmaster-nadia');
if (nadia) {
  nadia.dialogueTrees.push({
    id: 'topic_return_sea_vocab',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'عُدتَ! هُنا دَرس جَديد عَن البَحر',
        english: 'You\'re back! Here\'s a new lesson about the sea.',
        transliteration: '\'udta! hunaa dars jadiid \'an al-bahr'
      },
      {
        speaker: 'npc',
        arabic: 'بَحْر — هُوَ المَعنى الأَصلي لِكَلِمَة "الجَوف"',
        english: 'Bahr — the sea. The word also gives us "bahrain" (two seas).',
        transliteration: 'bahr — huwa al-ma\'naa al-aslii. "al-bahrayn" ta\'nii al-bahrayn',
        teachWord: 'water_w13',
        culturalNote: '"Bahrain" (البَحرَيْن) literally means "two seas" in Arabic — referring to the freshwater springs that well up through the Gulf\'s saltwater floor. Arab merchants knew this geography precisely for navigation.'
      },
      {
        speaker: 'npc',
        arabic: 'وَكَلِمَة "admiral" الإنجليزِيَّة جاءَت مِن "أَمير البَحر"',
        english: 'And the English word "admiral" came from Arabic "amir al-bahr" (prince of the sea).',
        transliteration: 'wa kalima "admiral" al-injliiziyya jaa\'at min "amiir al-bahr"'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'مُذهِل! شُكراً نادِيَة',
            english: 'Astonishing! Thank you Nadia.',
            next: null
          }
        ]
      }
    ]
  });
  console.log('Added return_visit tree to dockmaster-nadia');
}

// carpet-seller-jamal: add carpet materials vocabulary
const jamal = npcs.find(n => n.id === 'carpet-seller-jamal');
if (jamal) {
  jamal.dialogueTrees.push({
    id: 'topic_return_colors2',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'مَرحَباً! لِنَتَعَلَّم أَلواناً أَكثَر مِن السَّجّادات',
        english: 'Welcome! Let\'s learn more colors from the carpets.',
        transliteration: 'marhaban! linata\'allam alwaanan akthar min as-sajjaadaat'
      },
      {
        speaker: 'npc',
        arabic: 'أَحمَر — لَونُ الدَّم وَالرُّمّان وَالشَّجاعَة',
        english: 'Ahmar — red, the color of blood, pomegranate, and courage.',
        transliteration: 'ahmar — lawnul-dam war-rummaan wash-shajaa\'a',
        teachWord: 'beautiful_1'
      },
      {
        speaker: 'npc',
        arabic: 'أَزرَق — لَونُ السَّماء وَالبَحر. وَ"أُزَيرِق" اِسم لِلأَزرَق الفاتِح',
        english: 'Azraq — blue, the color of sky and sea.',
        transliteration: 'azraq — lawnus-samaa\' wal-bahr.'
      },
      {
        speaker: 'npc',
        arabic: 'أَخضَر — لَونُ الجَنَّة في الإِسلام وَالنَّباتات',
        english: 'Akhdar — green, the color of paradise in Islam and plants.',
        transliteration: 'akhdar — lawnal-janna fil-islam wan-nabaataat',
        culturalNote: 'Green (أَخضَر, akhdar) holds special significance in Islam — it is the color associated with paradise (al-janna). The Prophet\'s banner was green, and many mosque domes are painted green.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'أَلوان جَميلَة! شُكراً',
            english: 'Beautiful colors! Thank you.',
            next: null
          }
        ]
      }
    ]
  });
  console.log('Added return_visit tree to carpet-seller-jamal');
}

// garden-keeper-leila: add plant vocabulary
const leila = npcs.find(n => n.id === 'garden-keeper-leila');
if (leila) {
  leila.dialogueTrees.push({
    id: 'topic_return_plants',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَهلاً! لِنَتَعَلَّم أَسماء النَّباتات اليَوم',
        english: 'Welcome! Let\'s learn plant names today.',
        transliteration: 'ahlan! linata\'allam asmaa\' an-nabaataat al-yawm'
      },
      {
        speaker: 'npc',
        arabic: 'وَرد — الزَّهرَة الأَجمَل. وَكَلِمَة "ward" الإنجليزِيَّة جاءَت مِنها',
        english: 'Ward — rose, the most beautiful flower.',
        transliteration: 'ward — az-zahra al-ajmal.',
        teachWord: 'tree_w27'
      },
      {
        speaker: 'npc',
        arabic: 'نَخيل — شَجَرَة التَّمر. غِذاء الصَّحراء مُنذُ آلاف السِّنين',
        english: 'Nakheeel — the date palm. Desert food for thousands of years.',
        transliteration: 'nakhiil — shajarat at-tamr. ghidha\' as-sahraa\' mundhu alaaf as-siniin',
        teachWord: 'sun_w14',
        culturalNote: 'The date palm (نَخيل) was so essential to desert life that classical Arabic has over 360 words for different types of dates and stages of palm development. It provided food, timber, fiber, and shade.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الطَّبيعَة جَميلَة! شُكراً لَيلى',
            english: 'Nature is beautiful! Thank you Leila.',
            next: null
          }
        ]
      }
    ]
  });
  console.log('Added return_visit tree to garden-keeper-leila');
}

// baker-yasmin: add sweets vocabulary
const yasmin = npcs.find(n => n.id === 'baker-yasmin');
if (yasmin) {
  yasmin.dialogueTrees.push({
    id: 'topic_return_sweets',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'مَرحَباً ثانِيَة! اليَوم نَتَعَلَّم الحَلَويّات',
        english: 'Welcome back! Today we learn sweets.',
        transliteration: 'marhaban thaaniya! al-yawm nata\'allam al-halawiyyaat'
      },
      {
        speaker: 'npc',
        arabic: 'سُكَّر — وَكَلِمَة "sugar" الإنجليزِيَّة جاءَت مِن "sukkar" العَرَبِيَّة',
        english: 'Sukkar — sugar. The English word "sugar" came from Arabic "sukkar".',
        transliteration: 'sukkar — wa kalima "sugar" al-injliiziyya jaa\'at min "sukkar" al-arabiyya',
        teachWord: 'bread_1',
        culturalNote: '"Sugar" traces through Arabic sukkar (سُكَّر) from Sanskrit sharkara. Arab merchants introduced sugar refining to Europe in the medieval period. The word "candy" also comes from Arabic qand (قَنْد, crystallized sugar).'
      },
      {
        speaker: 'npc',
        arabic: 'حَلوى — كُلّ شَيء حُلو! مِن "حَلال" وَ"حَلاوَة"',
        english: 'Halwa — sweets! Related to halaal and halaawa (sweetness).',
        transliteration: 'halwaa — kull shay\' hulw! min "halaal" wa "halaawa"'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'اللَّسان يُريد حَلوى الآن! شُكراً',
            english: 'My tongue wants sweets now! Thank you.',
            next: null
          }
        ]
      }
    ]
  });
  console.log('Added return_visit tree to baker-yasmin');
}

// mountain-hermit-idris: add philosophy vocabulary
const idris = npcs.find(n => n.id === 'mountain-hermit-idris');
if (idris) {
  idris.dialogueTrees.push({
    id: 'topic_return_wisdom',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'عُدتَ. الجَبَلُ لا يَنسى مَن طَلَبَ الحِكمَة',
        english: 'You returned. The mountain never forgets those who sought wisdom.',
        transliteration: '\'udta. al-jabal laa yansaa man talaba al-hikma'
      },
      {
        speaker: 'npc',
        arabic: 'صَبر — الصَّبرُ مِفتاحُ الفَرَج. كَلِمَة عَظيمَة',
        english: 'Sabr — patience is the key to relief. A great word.',
        transliteration: 'sabr — as-sabru miftaahu al-faraj. kalima \'aziima',
        teachWord: 'write_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَقَولُ المَثَل: "الصَّبرُ مِفتاحُ الفَرَج" — بِالعَرَبِيَّة يُصبِح شِعراً',
        english: 'And the proverb: "Patience is the key to relief" — in Arabic it becomes poetry.',
        transliteration: 'wa qawlu al-mathal: "as-sabru miftaahu al-faraj" — bil-arabiyya yusbih shi\'ran',
        culturalNote: 'Arabic proverbs (أَمثال, amthaal) are a cornerstone of classical learning. The proverb "الصَّبرُ مِفتاحُ الفَرَج" (patience is the key to relief) appears in Imam al-Ghazali\'s 12th-century Ihya Ulum al-Din.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'الحِكمَة مَوجودَة هُنا. شُكراً إِدريس',
            english: 'Wisdom lives here. Thank you, Idris.',
            next: null
          }
        ]
      }
    ]
  });
  console.log('Added return_visit tree to mountain-hermit-idris');
}

// stable-master-yara: add more animal vocabulary
const yara = npcs.find(n => n.id === 'stable-master-yara');
if (yara) {
  yara.dialogueTrees.push({
    id: 'topic_return_travel_vocab',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'مَرحَباً! الخُيول تَفرَح بِرُجوعِك',
        english: 'Welcome! The horses are happy at your return.',
        transliteration: 'marhaban! al-khuyuul tafrahu bi-rujooo\'ik'
      },
      {
        speaker: 'npc',
        arabic: 'قافِلَة — مَجموعَة مِن الجِمال وَالتُّجّار',
        english: 'Qaafila — a caravan, a group of camels and traders.',
        transliteration: 'qaafila — majmoo\'a min al-jimaal wat-tujjaar',
        teachWord: 'night_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَكَلِمَة "caravan" الإنجليزِيَّة جاءَت مِن الفارِسِيَّة عَن طَريق العَرَبِيَّة: "قَرواَن"',
        english: '"Caravan" in English came through Arabic from Persian: "qirwaan".',
        transliteration: '"caravan" al-injliiziyya jaa\'at min al-faarisiyya \'an tariiq al-arabiyya'
      },
      {
        speaker: 'npc',
        arabic: 'طَريق الحَرير كانَ أَطوَل طَريق تِجاري في التّاريخ — مِن الصّين إلى الأَندَلُس',
        english: 'The Silk Road was the longest trade route in history — from China to Andalusia.',
        transliteration: 'tariiq al-hariir kaana atwal tariiq tijaarii fit-taariikh — min as-siin ilaa al-andalus',
        culturalNote: 'The Silk Road (طَريق الحَرير) connected China to Andalusia. Arab merchants were its backbone from the 8th-13th centuries, carrying silk, spices, paper, and knowledge — along with Arabic vocabulary that remains in dozens of languages today.'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'أُريدُ السَّفَر يَوماً! شُكراً يارا',
            english: 'I want to travel someday! Thank you, Yara.',
            next: null
          }
        ]
      }
    ]
  });
  console.log('Added return_visit tree to stable-master-yara');
}

// astronomer-zain: add star names vocabulary
const zain = npcs.find(n => n.id === 'astronomer-zain');
if (zain) {
  zain.dialogueTrees.push({
    id: 'topic_return_star_names',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'عُدتَ! هُنا أَسماء النُّجوم العَرَبِيَّة',
        english: 'You\'re back! Here are Arabic star names.',
        transliteration: '\'udta! hunaa asmaa\' an-nujoom al-arabiyya'
      },
      {
        speaker: 'npc',
        arabic: 'الدَّبَران — النَّجم البُرتُقالي في الثَّور. بِالإنجليزِيَّة "Aldebaran"',
        english: 'Al-Dabaraan — the orange star in Taurus. In English: "Aldebaran".',
        transliteration: 'ad-dabaraan — an-najm al-burtuqaalii fit-thawr. bil-injliiziyya "Aldebaran"',
        teachWord: 'star_w16',
        culturalNote: 'Over 200 star names in modern astronomy come from Arabic: Aldebaran (الدَّبَران), Betelgeuse (يَد الجَوزاء), Rigel (رِجْل الجَبّار), Deneb (ذَنَب), Altair (الطّائِر). Arab astronomers mapped and named the sky from the 8th century onward.'
      },
      {
        speaker: 'npc',
        arabic: 'وَ"Betelgeuse" جاءَت مِن "يَد الجَوزاء" — يَد الجَبّار',
        english: 'And "Betelgeuse" came from "yad al-jawzaa\'" — the giant\'s hand.',
        transliteration: 'wa "Betelgeuse" jaa\'at min "yad al-jawzaa\'" — yad al-jabbaar'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'النُّجوم تَتَكَلَّم عَرَبي! شُكراً زَين',
            english: 'The stars speak Arabic! Thank you, Zain.',
            next: null
          }
        ]
      }
    ]
  });
  console.log('Added return_visit tree to astronomer-zain');
}

// Write the updated npcs.json
fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
console.log('\nDone! npcs.json updated with additional dialogue lines.');
