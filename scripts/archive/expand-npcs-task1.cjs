#!/usr/bin/env node
// Task 1: Add new dialogue trees to NPCs 13-18
// wanderer-ali, guide-salim, weaver-zahra, healer-khadija, captain-rashid, fishmonger-hana

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/npcs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ============================================================
// 1. wanderer-ali — Mysterious drifter, speaks in riddles
// ============================================================
const wandererAli = data.find(n => n.id === 'wanderer-ali');
wandererAli.dialogueTrees.push(
  {
    id: 'ali_islamic_world',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'يَا صَدِيقِي، هَلْ تَعْرِفُ أَنَّ العَالَمَ الإِسْلَامِيَّ امْتَدَّ مِنَ الأَنْدَلُسِ إِلَى إِنْدُونِيسِيَا؟',
        english: 'My friend, did you know the Islamic world stretched from Al-Andalus to Indonesia?',
        transliteration: "Yaa sadiiqi, hal ta'rifu anna al-'aalam al-islaamiyy imtadda min al-Andalus ilaa Induniisiya?"
      },
      {
        speaker: 'npc',
        arabic: 'رَأَيْتُ قُرْطُبَةَ، مَدِينَةَ النُّورِ! وَبَغْدَادَ، قُبَّةَ الإِسْلَامِ! وَسَمَرْقَنْدَ الجَمِيلَة!',
        english: 'I saw Cordoba, the City of Light! And Baghdad, the Dome of Islam! And beautiful Samarkand!',
        transliteration: "Ra'aytu Qurtuba, madiinata an-nuur! Wa Baghdad, qubba al-islaam! Wa Samarqand al-jamiila!"
      },
      {
        speaker: 'npc',
        arabic: 'الكَلِمَة التي تَحتاجُها في كُلِّ مَكان: أَيْن؟',
        english: 'The word you need everywhere: where?',
        transliteration: "Al-kalima allatii tahtaajuhaa fii kulli makaan: ayna?",
        teachWord: 'where_is_1',
        culturalNote: 'The word "safari" comes from Arabic "safar" (سَفَر), meaning journey or travel. Arab traders and explorers carried their language across three continents, from Spain to Indonesia.'
      },
      {
        speaker: 'npc',
        arabic: 'وَالكَلِمَة الثَّانِيَة: اِذهَب — لِأَنَّ الحَيَاةَ تَبدَأُ حِينَ تَذهَب!',
        english: 'And the second word: go — because life begins when you leave!',
        transliteration: "Wa al-kalima ath-thaaniya: idh-hab — li-anna al-hayaata tabda' hiina tadhhab!",
        teachWord: 'go_1'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'أَخبِرني عَن قُرطُبَة',
            english: 'Tell me about Cordoba',
            next: 'ali_cordoba_story'
          },
          {
            arabic: 'مَا أَبعَدُ مَكان ذَهَبتَ إِليه؟',
            english: 'What is the farthest place you went?',
            next: 'ali_far_east'
          }
        ]
      }
    ]
  },
  {
    id: 'ali_cordoba_story',
    lines: [
      {
        speaker: 'npc',
        arabic: 'آه، قُرطُبَة! في القَرنِ العَاشِر كانَت أَكبَر مَدينَة في أُوروبَّا — مِليون نَسَمَة!',
        english: 'Ah, Cordoba! In the 10th century it was the largest city in Europe — a million people!',
        transliteration: "Aah, Qurtuba! Fi al-qarn al-'aashir kaanat akbar madiina fii Uurubba — milyuun nasamah!"
      },
      {
        speaker: 'npc',
        arabic: 'فيها مَكتَبَة بِسَبعِمائَة وَسَبعين أَلف كِتاب! نُور العَقل في زَمان الظَّلام!',
        english: 'It had a library of 770,000 books! A light of the mind in an age of darkness!',
        transliteration: "Fiihaa maktaba bi-sab'imi'a wa sab'iina alf kitaab! Nuur al-'aql fii zamaan az-zalaam!",
        culturalNote: '"Caravan" comes from Persian via Arabic "qaafila" (قَافِلَة). Arab caravanserais — roadside inns spaced a day\'s journey apart — formed the world\'s first commercial highway network, from Morocco to China.'
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: القِرَاءَة — لِأَنَّ المَعرِفَة هِيَ الزَّادُ الحَقِيقِيُّ لِلمُسَافِر!',
        english: 'Learn: reading — because knowledge is the true provisions of a traveler!',
        transliteration: "Ta'allam: al-qiraa'a — li-anna al-ma'rifa hiya az-zaad al-haqiiqi lil-musaafir!",
        teachWord: 'read_1'
      }
    ]
  },
  {
    id: 'ali_far_east',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَبعَد مَكان؟ وَصَلتُ إِلى الهِند، وَرَأَيتُ تُجَّاراً عَرَباً في كُلِّ مِيناء!',
        english: 'Farthest place? I reached India, and saw Arab traders in every port!',
        transliteration: "Ab'ad makaan? Wasaltu ilaa al-Hind, wa ra'aytu tujjaaran 'Araban fii kulli miinaa'!"
      },
      {
        speaker: 'npc',
        arabic: 'العَرَبُ كانوا الجِسرَ بَينَ الشَّرقِ والغَرب. كَانوا يُتَرجِمون ويُجَارون ويَبنون.',
        english: 'Arabs were the bridge between East and West. They translated, traded, and built.',
        transliteration: "Al-'Arab kaanuu al-jisr bayna ash-sharq wal-gharb. Kaanuu yutarjimuun wa yujaarirun wa yabbuun."
      },
      {
        speaker: 'npc',
        arabic: 'تَذكَّر: الشَّرق — مَطلَع الشَّمس. مِن هُناكَ تَأتي الحِكمَة!',
        english: 'Remember: east — where the sun rises. From there comes wisdom!',
        transliteration: "Tadhakkar: ash-sharq — matla' ash-shams. Min hunaaka ta'ti al-hikma!",
        teachWord: 'east_1'
      }
    ]
  },
  {
    id: 'ali_riddles',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أُحِبُّ الأَلغَاز! إِليكَ لُغزٌ: مَاذَا يَحمِلُ المُسَافِر في دَاخِلِه وَلا يَسقُط مِنه؟',
        english: 'I love riddles! Here is one: What does the traveler carry inside and never drops?',
        transliteration: "Uhibbu al-alghaz! Ilayk lugz: maadha yahmilu al-musaafir fii daakhilihi wa laa yasqut minh?"
      },
      {
        speaker: 'npc',
        arabic: 'ذَاكِرَتُه! كُلُّ مَكان زَارَه، كُلُّ وَجه رَآه — يَعيش في القَلب إِلى الأَبَد!',
        english: 'His memory! Every place he visited, every face he saw — lives in the heart forever!',
        transliteration: "Dhaakiratuh! Kullu makaan zaarahu, kullu wajh ra'aahu — ya'iish fil-qalb ilaa al-abad!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: القَلب — لِأَنَّ الرَّحَّالَة يَعيش بِقَلبِه قَبلَ قَدَمَيه!',
        english: 'Learn: the heart — because the wanderer lives by his heart before his feet!',
        transliteration: "Ta'allam: al-qalb — li-anna ar-rahhaalah ya'iish bi-qalbih qabla qadamaih!",
        teachWord: 'heart_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَأَيضاً: القَدَم — لِأَنَّ الرَّحَّالَة يَعيش بِقَدَمَيه كَذَلِك!',
        english: 'And also: the foot — because the wanderer also lives by his feet!',
        transliteration: "Wa aydan: al-qadam — li-anna ar-rahhaalah ya'iish bi-qadamaih kadhalik!",
        teachWord: 'foot_1'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني حِكمَة السَّفَر',
            english: 'Teach me travel wisdom',
            next: 'ali_travel_wisdom'
          },
          {
            arabic: 'شُكراً يا عَلي',
            english: 'Thank you, Ali',
            next: null
          }
        ]
      }
    ]
  },
  {
    id: 'ali_travel_wisdom',
    lines: [
      {
        speaker: 'npc',
        arabic: 'حِكمَة السَّفَر الأولى: تَعَلَّم دَائِماً كَلِمَة شُكراً بِلُغَة أَهلِ المَكَان.',
        english: 'First travel wisdom: always learn how to say thank you in the local language.',
        transliteration: "Hikmat as-safar al-uulaa: ta'allam daa'iman kalimata shukran bi-lughat ahl al-makaan."
      },
      {
        speaker: 'npc',
        arabic: 'وَالحِكمَة الثَّانِيَة: لا تَخَف مِنَ المَجهول — فَفِيه الكَنز الحَقِيقِيّ!',
        english: 'Second wisdom: do not fear the unknown — for therein lies the true treasure!',
        transliteration: "Wa al-hikma ath-thaaniya: laa takhaf min al-majhuul — fa-fiih al-kanz al-haqiiqi!"
      },
      {
        speaker: 'npc',
        arabic: 'المَشي هُوَ الحِيَاة. تَعَلَّم: مَشى — وَامشِ دَائِماً إِلى الأَمَام!',
        english: 'Walking is life. Learn: he walked — and always walk forward!',
        transliteration: "Al-mashi huwa al-hayaah. Ta'allam: mashaa — wamshi daa'iman ilaa al-amaam!",
        teachWord: 'walk_1'
      },
      {
        speaker: 'npc',
        arabic: 'رِحلَتُكَ لا تَنتَهي يَا صَدِيقي. حَتَّى في غُرفَتِك، عَقلُكَ يُسَافِر!',
        english: 'Your journey never ends, my friend. Even in your room, your mind travels!',
        transliteration: "Rihlatuk laa tantahii yaa sadiiqi. Hattaa fii ghurfatik, 'aqluk yusaafir!"
      }
    ]
  }
);

console.log('wanderer-ali trees:', data.find(n => n.id === 'wanderer-ali').dialogueTrees.length);

// ============================================================
// 2. guide-salim — Confident desert navigator, celestial nav
// ============================================================
const guideSalim = data.find(n => n.id === 'guide-salim');
guideSalim.dialogueTrees.push(
  {
    id: 'salim_celestial_navigation',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'تَعَال، أُرِيكَ سِرَّ المُلَّاحِين العَرَب: النُّجوم هِيَ خَريطَتُنا!',
        english: 'Come, I show you the secret of Arab navigators: the stars are our map!',
        transliteration: "Ta'aal, uriika sirr al-mullaahin al-'Arab: an-nujuum hiya khaaritatunaa!"
      },
      {
        speaker: 'npc',
        arabic: 'كَلِمَة "zenith" الإِنجليزِيَّة مِن العَرَبِيَّة "سَمت" — أَي الاتِّجَاه في السَّمَاء!',
        english: 'The English "zenith" is from Arabic "samt" — meaning direction in the sky!',
        transliteration: "Kalima 'zenith' al-injliiziyya min al-'arabiyya 'samt' — ay al-ittijjah fii as-samaa'!",
        culturalNote: '"Zenith" comes from Arabic "samt" (سَمت, direction). "Nadir" comes from Arabic "nadhiir" (نَظير, opposite). Both entered European science through Arab astronomical texts of the 9th-12th centuries.'
      },
      {
        speaker: 'npc',
        arabic: 'نَجمُ الشِّمَال يَدُلُّنا على الشَّمَال دَائِماً. تَعَلَّم: الشَّمَال!',
        english: 'The North Star always points north. Learn: ash-shamaal (north)!',
        transliteration: "Najm ash-shimaal yadullunaa 'alaa ash-shamaal daa'iman. Ta'allam: ash-shamaal!",
        teachWord: 'north_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَعَكسُه: الجَنوب! مِن الشَّمَال تَعرِف كُلَّ شَيء!',
        english: 'And its opposite: south! From north you know everything!',
        transliteration: "Wa 'aksuh: al-januub! Min ash-shamaal ta'rif kull shay'!",
        teachWord: 'south_1'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني الجِهَات الأَربَع',
            english: 'Teach me all four directions',
            next: 'salim_four_directions'
          },
          {
            arabic: 'مَن كانَ أَعظَم مُلَّاح عَرَبي؟',
            english: 'Who was the greatest Arab navigator?',
            next: 'salim_ibn_majid_story'
          }
        ]
      }
    ]
  },
  {
    id: 'salim_four_directions',
    lines: [
      {
        speaker: 'npc',
        arabic: 'مُمتاز! الجِهَات الأَربَع. الشَّمَال وَالجَنوب عَرَفتَهُمَا. الآن: الشَّرق!',
        english: 'Excellent! Four directions. You know north and south. Now: east!',
        transliteration: "Mumtaaz! Al-jihaat al-arba'. Ash-shamaal wal-januub 'araftahumaa. Al-aan: ash-sharq!"
      },
      {
        speaker: 'npc',
        arabic: 'الشَّرق: مَطلَع الشَّمس. الغَرب: مَغرِبُها. بَينَهُما حَيَاتُنا كُلُّها!',
        english: 'East: sunrise. West: sunset. Between them is all of our lives!',
        transliteration: "Ash-sharq: matla' ash-shams. Al-gharb: maghribuhaa. Baynahumaa hayaatunaaa kulluhaa!",
        teachWord: 'east_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَالغَرب! مَغرِب الشَّمس، مَوطِن الأَنْدَلُس والمَغرِب العَظيم.',
        english: 'And west! Where the sun sets, homeland of Andalusia and the great Maghreb.',
        transliteration: "Wa al-gharb! Maghrib ash-shams, mawtin al-Andalus wal-Maghrib al-'aziim.",
        teachWord: 'west_1'
      },
      {
        speaker: 'npc',
        arabic: 'هَيَّا نَختَبِر! مَن يَعرِف الجِهَات لَن يَضِيع أَبَداً!',
        english: "Let's test! One who knows the directions will never be lost!",
        transliteration: "Hayya nakhtabir! Man ya'rif al-jihaat lan yadii' abadan!"
      },
      {
        action: 'quiz',
        words: ['north_1', 'south_1', 'east_1', 'west_1', 'right_1', 'left_1'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'أَحسَنتَ! الجِهَات عَلى طَرف لِسَانِك الآن. أَنتَ مُلَّاح حَقِيقِي!',
        english: 'Well done! The directions are on the tip of your tongue now. You are a true navigator!',
        transliteration: "Ahsanta! Al-jihaat 'alaa taraf lisaanik al-aan. Anta mullaahin haqiiqi!"
      }
    ]
  },
  {
    id: 'salim_ibn_majid_story',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَحمَد بن مَاجِد! شَيخُ البَحَّارَة العَرَب — كَتَبَ أَربَعين كِتَاباً في فُنون المَلَاحَة!',
        english: 'Ahmad ibn Majid! Master of Arab sailors — he wrote forty books on the arts of navigation!',
        transliteration: "Ahmad ibn Maajid! Shaykh al-bahhaara al-'Arab — kataba arba'iina kitaaban fii funuun al-malaaha!"
      },
      {
        speaker: 'npc',
        arabic: 'قِيلَ أَنَّهُ دَلَّ فَاسكو دا غَاما على طَريق الهِند عَام 1498. المَعرِفَة العَرَبِيَّة فَتَحَت البَحَار!',
        english: 'It is said he guided Vasco da Gama to India in 1498. Arab knowledge opened the seas!',
        transliteration: "Qiila annahu dalla Vaasco da Gama 'alaa tariiq al-Hind 'aam 1498. Al-ma'rifa al-'arabiyya fatahat al-bihaar!",
        culturalNote: 'Ahmad ibn Majid (c.1421-1500 CE), called "The Lion of the Sea" (Asad al-Bahr), wrote comprehensive guides to Indian Ocean navigation. His star charts and wind knowledge were unmatched in his era.'
      },
      {
        speaker: 'npc',
        arabic: 'وَتَعَلَّم: فَوق — لِأَنَّ النُّجوم دَائِماً فَوقَنا وَتَدُلُّنا على الطَّريق!',
        english: 'And learn: above — because the stars are always above us guiding our path!',
        transliteration: "Wa ta'allam: fawqa — li-anna an-nujuum daa'iman fawqanaa wa tadullunaa 'alaa at-tariiq!",
        teachWord: 'above_1'
      }
    ]
  },
  {
    id: 'salim_mountain_safety',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'يَا صَاحِبي، قَبلَ أَيِّ رِحلَة في الجَبَل، اِحفَظ هَذِهِ القَوَاعِد الثَّلاث!',
        english: 'My companion, before any mountain journey, memorize these three rules!',
        transliteration: "Yaa saahib, qabla ayyi rihla fil-jabal, ihfaz haadhihi al-qawaa'id ath-thalaath!"
      },
      {
        speaker: 'npc',
        arabic: 'القَاعِدَة الأولى: اُنظُر دَائِماً إِلى السَّمَاء. المَطَر في الجَبَل يَأتي بِلا إِنذَار!',
        english: 'Rule one: always watch the sky. Mountain rain comes without warning!',
        transliteration: "Al-qaa'ida al-uulaa: unzur daa'iman ilaa as-samaa'. Al-matar fil-jabal ya'ti bilaa indhaar!",
        teachWord: 'rain_w25'
      },
      {
        speaker: 'npc',
        arabic: 'القَاعِدَة الثَّانِيَة: اِعرِف اليَمين واليَسَار دَائِماً. التَّرَدُّد في الجَبَل خَطير!',
        english: 'Rule two: always know right and left. Hesitation in the mountains is dangerous!',
        transliteration: "Al-qaa'ida ath-thaaniya: i'rif al-yamiin wal-yasaar daa'iman. At-taraddud fil-jabal khatir!",
        teachWord: 'left_1'
      },
      {
        speaker: 'npc',
        arabic: 'القَاعِدَة الثَّالِثَة: الرِّيح تُخبِرُكَ بِكُلِّ شَيء — اِستَمِع لِلرِّيح!',
        english: 'Rule three: the wind tells you everything — listen to the wind!',
        transliteration: "Al-qaa'ida ath-thaalitha: ar-riyaah tukhbiruka bi-kulli shay' — ista'mil lir-riyaah!",
        teachWord: 'wind_w26'
      },
      {
        speaker: 'npc',
        arabic: 'اِذهَب الآن — لَكِن كُن حَذِراً! الطَّريقُ يَنتَظِرُكَ وَأَنا هُنا دَائِماً.',
        english: 'Go now — but be careful! The path awaits you and I am always here.',
        transliteration: "Idh-hab al-aan — laakin kun hadiran! At-tariiq yantaziruk wa ana hunaa daa'iman."
      }
    ]
  }
);

console.log('guide-salim trees:', data.find(n => n.id === 'guide-salim').dialogueTrees.length);

// ============================================================
// 3. weaver-zahra — Patient artisan, textile tradition
// ============================================================
const weaverZahra = data.find(n => n.id === 'weaver-zahra');
weaverZahra.dialogueTrees.push(
  {
    id: 'zahra_textile_history',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'تَعَال! أُرِيكَ شَيئاً جَمِيلاً. هَذِهِ القُماشَة جَاءَت مِن سِرِّ الحَضَارَة الإِسلَامِيَّة.',
        english: 'Come! Let me show you something beautiful. This fabric carries the secret of Islamic civilization.',
        transliteration: "Ta'aal! Uriika shay'an jamiilan. Haadhihi al-qumaasha jaa'at min sirr al-hadaara al-islaamiyya."
      },
      {
        speaker: 'npc',
        arabic: 'كَلِمَة "muslin" الإِنجليزِيَّة؟ مِن مَوصِل بِالعِراق! وَ"damask"؟ مِن دِمَشق!',
        english: 'The English word "muslin"? From Mosul, Iraq! And "damask"? From Damascus!',
        transliteration: "Kalima 'muslin' al-injliiziyya? Min Mawsil bil-'Iraq! Wa 'damask'? Min Dimashq!",
        culturalNote: '"Muslin" comes from Mosul, Iraq, where this fine cotton fabric was perfected. "Damask" comes from Damascus, Syria. "Gauze" comes from Gaza, Palestine. Three English fabric words, three Arab cities.'
      },
      {
        speaker: 'npc',
        arabic: 'وَ"gauze"؟ مِن غَزَّة! ثَلاثُ مُدُن عَرَبِيَّة في ثَلاثِ كَلِمَات إِنجليزِيَّة!',
        english: 'And "gauze"? From Gaza! Three Arab cities in three English words!',
        transliteration: "Wa 'gauze'? Min Ghazza! Thalaathu mudun 'arabiyya fii thalaathi kalimaat injliiziyya!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: الثَّوب — لِأَنَّ كُلَّ ثَوب يَحكِي قِصَّة حَضَارَة!',
        english: 'Learn: the thobe — because every garment tells the story of a civilization!',
        transliteration: "Ta'allam: ath-thawb — li-anna kull thawb yahkii qissat hadaara!",
        teachWord: 'thobe_w1'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني أَسمَاء المَلابِس',
            english: 'Teach me clothing names',
            next: 'zahra_clothing_lesson'
          },
          {
            arabic: 'مَاذَا تَنسُجين الآن؟',
            english: 'What are you weaving now?',
            next: 'zahra_current_work'
          }
        ]
      }
    ]
  },
  {
    id: 'zahra_clothing_lesson',
    lines: [
      {
        speaker: 'npc',
        arabic: 'بِكُلِّ سُرور! الحِجَاب — يَحمِي مِن الشَّمس والرِّيح ويُزَيِّن في آنٍ وَاحِد.',
        english: 'With pleasure! The hijab — it protects from sun and wind while also adorning.',
        transliteration: "Bi-kulli suruur! Al-hijaab — yahmii min ash-shams war-riyaah wa yuzayyin fii aanin waahid.",
        teachWord: 'scarf_w7'
      },
      {
        speaker: 'npc',
        arabic: 'وَالقَميص — أَبسَطُ قِطعَة في المَلبَس وَأَكثَرُها فَائِدَة!',
        english: 'And the shirt — the simplest garment and the most useful!',
        transliteration: "Wa al-qamiis — absatu qit'a fil-malbas wa aktharuhaa faa'ida!",
        teachWord: 'shirt_w5'
      },
      {
        speaker: 'npc',
        arabic: 'وَالحِذَاء! بِدُون حِذَاء لا تَستَطيع السَّفَر. الحِذَاء أَوَّل وَرِيث الإِنسَان!',
        english: 'And shoes! Without shoes you cannot travel. Shoes are humanity\'s first inheritance!',
        transliteration: "Wa al-hidhaa'! Bi-duun hidhaa' laa tastatiiu as-safar. Al-hidhaa' awwal warith al-insaan!",
        teachWord: 'shoes_w2'
      },
      {
        speaker: 'npc',
        arabic: 'لِنَختَبِر ما تَعَلَّمتَ! المَلابِس كَالكَلِمَات — لازِمَة كُلَّ يَوم.',
        english: "Let's test what you learned! Clothing is like words — needed every day.",
        transliteration: "Li-nakhtabir maa ta'allamta! Al-malaabis kal-kalimaat — laazima kull yawm."
      },
      {
        action: 'quiz',
        words: ['thobe_w1', 'scarf_w7', 'shirt_w5', 'shoes_w2', 'hat_w3'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'مُمتاز! تَعلَّمتَ مَلابِسَ خَمسَة. عُد إِليَّ وَسَأُعَلِّمُكَ المَزيد!',
        english: 'Excellent! You learned five clothing items. Come back and I will teach you more!',
        transliteration: "Mumtaaz! Ta'allamta malaabisa khamsa. 'Ud ilayya wa sa-u'allimuka al-maziid!"
      }
    ]
  },
  {
    id: 'zahra_current_work',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَنسُج سِجَّادَة لِبَيتِ تَاجِر ثَرِيٍّ. انظُر — كُلُّ خَيطٍ في مَكانِه الصَّحيح.',
        english: 'I am weaving a carpet for a wealthy merchant\'s home. See — every thread in its right place.',
        transliteration: "Ansuj sijjaada li-bayt taajir thariyy. Unzur — kullu khaytin fii makaanhi as-sahiih."
      },
      {
        speaker: 'npc',
        arabic: 'النَّسيج مِثلُ اللُّغَة — كُلُّ كَلِمَة خَيطٌ، وَالجُملَة سِجَّادَة!',
        english: 'Weaving is like language — every word is a thread, and the sentence is a carpet!',
        transliteration: "An-nasiij mithlu al-lugha — kullu kalima khaytin, wa al-jumla sijjaada!"
      },
      {
        speaker: 'npc',
        arabic: 'هَذَا اللَّون الأَحمَر؟ مِن الزَّعفَران. تَعَلَّم: الأَحمَر!',
        english: 'This red color? From saffron. Learn: red!',
        transliteration: "Haadha al-lawn al-ahmar? Min az-za'faraan. Ta'allam: al-ahmar!",
        teachWord: 'color_red'
      },
      {
        speaker: 'npc',
        arabic: 'وَالأَزرَق مِن النِّيلَة. وَالأَخضَر مِن أَعشَاب الجَبَل. الطَّبيعَة لَوحَتُنا!',
        english: 'And blue from indigo. And green from mountain herbs. Nature is our palette!',
        transliteration: "Wa al-azraq min an-niila. Wa al-akhdar min a'shaab al-jabal. At-tabii'a lawhatunaa!",
        teachWord: 'color_blue'
      }
    ]
  },
  {
    id: 'zahra_weaving_metaphors',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَتَعرِف أَنَّ النَّسيجَ يُعَلِّمُنَا عَن الحَيَاة؟ كُلُّ خَيطٍ يَمُرُّ فَوق وَتَحت.',
        english: 'Do you know that weaving teaches us about life? Every thread goes over and under.',
        transliteration: "Ata'rif anna an-nasiij yu'allimunaa 'an al-hayaah? Kullu khaytin yamurr fawqa wa tahta."
      },
      {
        speaker: 'npc',
        arabic: 'الصَّبر — هَذَا سِرُّ النَّسَّاج الجَيِّد. أَلفُ خَيطٍ في يَومٍ وَاحِد!',
        english: 'Patience — that is the good weaver\'s secret. A thousand threads in one day!',
        transliteration: "As-sabr — haadha sirr an-nassaaj al-jayyid. Alfu khaytin fii yawmin waahid!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: القُماش — لِأَنَّ الحَضَارَة الإِسلَامِيَّة بَنَت طُرُق التِّجَارَة على القُماش!',
        english: 'Learn: cloth — because Islamic civilization built trade routes on cloth!',
        transliteration: "Ta'allam: al-qumaash — li-anna al-hadaara al-islaamiyya banat turuq at-tijaara 'alaa al-qumaash!",
        teachWord: 'cloth_w42',
        culturalNote: 'The Islamic world dominated textile production and trade from 700-1400 CE. Words like "cotton" (from Arabic "qutn" قُطن), "satin" (from Zaytun/Quanzhou, China), and "taffeta" (from Persian) entered European languages through Arab trade.'
      },
      {
        speaker: 'npc',
        arabic: 'وَالحِزام — يَربِط كُلَّ شَيء مَعاً. مِثلَ الصَّداقَة تَماماً!',
        english: 'And the belt — it holds everything together. Exactly like friendship!',
        transliteration: "Wa al-hizaam — yarbut kull shay' ma'an. Mithla as-sadaaqa tamaaман!",
        teachWord: 'belt_w9'
      }
    ]
  }
);

console.log('weaver-zahra trees:', data.find(n => n.id === 'weaver-zahra').dialogueTrees.length);

// ============================================================
// 4. healer-khadija — Compassionate physician, Ibn al-Nafis
// ============================================================
const healerKhadija = data.find(n => n.id === 'healer-khadija');
healerKhadija.dialogueTrees.push(
  {
    id: 'khadija_ibn_nafis',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'جَلَس، أُرِيدُ أَن أُحَدِّثَكَ عَن عَظِيم مِن أَطِبَّاء الإِسلَام: ابن النَّفيس.',
        english: 'Sit, I want to tell you about a great Muslim physician: Ibn al-Nafis.',
        transliteration: "Jalis, uriiду an uhaddithak 'an 'aziim min atibba' al-islaam: Ibn an-Nafis."
      },
      {
        speaker: 'npc',
        arabic: 'في القَرنِ الثَّالِثَ عَشَر، اِكتَشَفَ ابن النَّفيس الدَّورَة الرِّئَوِيَّة — قَبلَ هَارفَي بِثَلاثِمِائَة سَنَة!',
        english: 'In the 13th century, Ibn al-Nafis discovered pulmonary circulation — 300 years before Harvey!',
        transliteration: "Fil-qarn ath-thaalith 'ashar, iktashafa Ibn an-Nafis ad-dawra ar-ri'awiyya — qabla Harvey bi-thalathimi'at sana!",
        culturalNote: 'Ibn al-Nafis (1213-1288 CE) discovered that blood flows through the lungs (pulmonary circulation), not through the heart septum as Galen claimed. This was rediscovered in Europe by William Harvey in 1628 — 300 years later.'
      },
      {
        speaker: 'npc',
        arabic: 'قَال: الدَّم يَمُرُّ عَبرَ الرِّئَة لا عَبرَ القَلب مُبَاشَرَةً. كَانَ مُحِقاً تَماماً!',
        english: 'He said: blood passes through the lungs, not directly through the heart. He was completely right!',
        transliteration: "Qaala: ad-dam yamurr 'abra ar-ri'a laa 'abra al-qalb mubaasharatan. Kaana muhiqqqan tamааman!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: القَلب — هُوَ مَركَز الحَيَاة. اِعتَنِ بِقَلبِك دَائِماً!',
        english: 'Learn: the heart — it is the center of life. Always take care of your heart!',
        transliteration: "Ta'allam: al-qalb — huwa markaz al-hayaah. I'tani bi-qalbik daa'iman!",
        teachWord: 'heart_1'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني أَسمَاء أَجزَاء الجِسم',
            english: 'Teach me body part names',
            next: 'khadija_body_lesson'
          },
          {
            arabic: 'مَاذَا تَعرِفين عَن الأَدوِيَة العَرَبِيَّة؟',
            english: 'What do you know about Arabic medicine?',
            next: 'khadija_arabic_medicine'
          }
        ]
      }
    ]
  },
  {
    id: 'khadija_body_lesson',
    lines: [
      {
        speaker: 'npc',
        arabic: 'بِكُلِّ سُرور! الجِسم هُوَ أَعظَم كِتَاب. لِنَبدَأ مِن الرَّأس.',
        english: 'With pleasure! The body is the greatest book. Let us begin from the head.',
        transliteration: "Bi-kulli suruur! Al-jism huwa a'zam kitaab. Li-nabda' min ar-ra's."
      },
      {
        speaker: 'npc',
        arabic: 'الرَّأس — مَقَرُّ العَقل. العَقل هُوَ أَغلى ما تَملِك!',
        english: 'The head — dwelling of the mind. The mind is the most precious thing you own!',
        transliteration: "Ar-ra's — maqarr al-'aql. Al-'aql huwa aghlaa maa tamlik!",
        teachWord: 'head_1'
      },
      {
        speaker: 'npc',
        arabic: 'العَين — بِها تَرى جَمَال العَالَم. اِحفَظها بِالنَّوم الكَافي!',
        english: 'The eye — with it you see the beauty of the world. Guard it with sufficient sleep!',
        transliteration: "Al-'ayn — bihaa taraa jamaal al-'aalam. Ihfazhaa bin-nawm al-kaafi!",
        teachWord: 'eye_1'
      },
      {
        speaker: 'npc',
        arabic: 'الأُذُن — بِها تَسمَع. وَالطَّبيب يَسمَع دَائِماً قَبلَ أَن يَتَكَلَّم!',
        english: 'The ear — with it you hear. And a physician always listens before speaking!',
        transliteration: "Al-udhun — bihaa tasma'. Wa at-tabiib yasma' daa'iman qabla an yatakallam!",
        teachWord: 'ear_1'
      },
      {
        action: 'quiz',
        words: ['head_1', 'eye_1', 'ear_1', 'hand_1', 'heart_1'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'أَحسَنتَ! الجِسم هُوَ أَمَانَة الله عِندَكَ — اِعتَنِ بِه كَمَا تَعتَني بِحَديقَتِك.',
        english: "Well done! The body is God's trust with you — tend to it as you tend your garden.",
        transliteration: "Ahsanta! Al-jism huwa amaana Allaah 'indak — i'tani bihi kamaa ta'tani bi-hadiigatik."
      }
    ]
  },
  {
    id: 'khadija_arabic_medicine',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الطِّبُّ العَرَبي! ابن سِينا كَتَبَ "القَانون في الطِّبّ" — المَرجِع الطِّبِّيّ في أُوروبَّا لِسِتِّمِائَة سَنَة!',
        english: 'Arabic medicine! Ibn Sina wrote "The Canon of Medicine" — the medical reference in Europe for 600 years!',
        transliteration: "At-tibb al-'arabi! Ibn Sina kataba 'Al-Qaanuun fit-Tibb' — al-marja' at-tibbiyy fii Uurubba li-sittimi'at sana!"
      },
      {
        speaker: 'npc',
        arabic: 'كَلِمَة "syrup" الإِنجليزِيَّة مِن العَرَبِيَّة "شَرَاب" — الدَّواء الحُلو!',
        english: 'The English word "syrup" comes from Arabic "sharaab" — the sweet medicine!',
        transliteration: "Kalima 'syrup' al-injliiziyya min al-'arabiyya 'sharaab' — ad-dawaa' al-hulw!",
        culturalNote: '"Syrup" comes from Arabic "sharaab" (شَرَاب, drink/potion). "Camphor" comes from Arabic "kafuur" (كَافور). "Alcohol" comes from Arabic "al-kuhl" (الكُحل, the kohl/essence). Arab pharmacists invented distillation and modern drug preparation.'
      },
      {
        speaker: 'npc',
        arabic: 'وَكَلِمَة "camphor" مِن "كَافور". الأَطِبَّاء العَرَب أَعطَوا العَالَم ثَمَانِيَة أَعشَار عِلم الصَّيدَلَة!',
        english: 'And "camphor" from "kafuur." Arab physicians gave the world eight-tenths of pharmacy!',
        transliteration: "Wa kalima 'camphor' min 'kaafuur'. Al-atibba' al-'Arab a'taw al-'aalam thamaaniyat a'shaarin 'ilm as-saydala!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: الفَم — بِه تَأكُل وَتَتَكَلَّم. اِحفَظه بِالسِّواك!',
        english: 'Learn: the mouth — with it you eat and speak. Guard it with siwak!',
        transliteration: "Ta'allam: al-fam — bihi ta'kul wa tatakallam. Ihfazh bis-siwaak!",
        teachWord: 'mouth_1'
      }
    ]
  }
);

console.log('healer-khadija trees:', data.find(n => n.id === 'healer-khadija').dialogueTrees.length);

// ============================================================
// 5. captain-rashid — Bold seafarer, Ahmad ibn Majid
// ============================================================
const captainRashid = data.find(n => n.id === 'captain-rashid');
captainRashid.dialogueTrees.push(
  {
    id: 'rashid_monsoon_story',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'يَا رَفِيقي! هَل تَعرِف سِرَّ البَحَّارَة العَرَب؟ الرِّيح! المَوسِم!',
        english: 'My companion! Do you know the secret of Arab sailors? The wind! The monsoon!',
        transliteration: "Yaa rafiiq! Hal ta'rif sirr al-bahhaara al-'Arab? Ar-riyaah! Al-mawsim!"
      },
      {
        speaker: 'npc',
        arabic: 'كَلِمَة "monsoon" الإِنجليزِيَّة مِن العَرَبِيَّة "مَوسِم" — أَي الوَقت المُحَدَّد لِلرِّيح!',
        english: 'The English word "monsoon" comes from Arabic "mawsim" — the fixed season of the wind!',
        transliteration: "Kalima 'monsoon' al-injliiziyya min al-'arabiyya 'mawsim' — ay al-waqt al-muhaddad lir-riyaah!",
        culturalNote: '"Monsoon" comes from Arabic "mawsim" (مَوسِم, season/time). Arab sailors were the first to systematically chart monsoon winds, enabling reliable trade routes across the Indian Ocean from East Africa to India and China from the 8th century CE.'
      },
      {
        speaker: 'npc',
        arabic: 'نَحنُ العَرَب عَرَفنَا المَوسِم قَبلَ كُلِّ أُمَّة — لِذَلِكَ أَبحَرنَا مِن أَفريقيا إِلى الصِّين!',
        english: 'We Arabs knew the monsoon before every nation — that is why we sailed from Africa to China!',
        transliteration: "Nahnu al-'Arab 'arafnaa al-mawsim qabla kulli umma — li-dhaalik abharnaaa min Afriqiyaa ilaa as-Siin!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: البَحر! لِأَنَّ البَحر هُوَ طَريق التِّجَارَة والمَعرِفَة!',
        english: 'Learn: the sea! Because the sea is the road of trade and knowledge!',
        transliteration: "Ta'allam: al-bahr! Li-anna al-bahr huwa tariiq at-tijaara wal-ma'rifa!",
        teachWord: 'sea_w23'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني مُفرَدَات البَحر',
            english: 'Teach me sea vocabulary',
            next: 'rashid_sea_lesson'
          },
          {
            arabic: 'أَخبِرني عَن أَخطَر رِحلَة',
            english: 'Tell me about your most dangerous journey',
            next: 'rashid_dangerous_voyage'
          }
        ]
      }
    ]
  },
  {
    id: 'rashid_sea_lesson',
    lines: [
      {
        speaker: 'npc',
        arabic: 'هَيَّا! كَلِمَات البَحر! أَولاً: الرِّيح — صَدِيقُ البَحَّار أَو عَدُوُّه!',
        english: 'Let us go! Sea words! First: wind — the sailor\'s friend or enemy!',
        transliteration: "Hayya! Kalimaat al-bahr! Awwalan: ar-riyaah — sadiiq al-bahhaar aw 'aduwwuh!",
        teachWord: 'wind_w26'
      },
      {
        speaker: 'npc',
        arabic: 'ثَانِياً: المَطَر — نِعمَة في الصَّحرَاء، لَكِن في البَحر؟ يَجلِب العَواصِف!',
        english: 'Second: rain — a blessing in the desert, but at sea? It brings storms!',
        transliteration: "Thaaniyan: al-matar — ni'ma fis-sahraa', laakin fil-bahr? Yajilib al-'awaasif!",
        teachWord: 'rain_w25'
      },
      {
        speaker: 'npc',
        arabic: 'ثَالِثاً: النَّجم — البَحَّار يَسير بِالنُّجوم! بِدُون نُجوم، ضَاع البَحَّار!',
        english: 'Third: star — the sailor navigates by stars! Without stars, the sailor is lost!',
        transliteration: "Thaalithan: an-najm — al-bahhaar yasiir bin-nujuum! Bi-duun nujuum, daa' al-bahhaar!",
        teachWord: 'star_w16'
      },
      {
        speaker: 'npc',
        arabic: 'لِنَختَبِر! مَن يَعرِف هَذِهِ الكَلِمَات يَستَطيع الإِبحَار في أَيِّ بَحر!',
        english: "Let's test! One who knows these words can sail any sea!",
        transliteration: "Li-nakhtabir! Man ya'rif haadhihi al-kalimaat yastatiiu al-ibhaar fii ayyi bahr!"
      },
      {
        action: 'quiz',
        words: ['sea_w23', 'wind_w26', 'rain_w25', 'star_w16'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'عَظيم! أَنتَ الآن بَحَّار بِالكَلِمَات. بَقِيَ أَن تَصبَح بَحَّاراً بِالسَّفينَة!',
        english: 'Magnificent! You are now a sailor in words. It remains for you to become a sailor on a ship!',
        transliteration: "Aziim! Anta al-aan bahhaar bil-kalimaat. Baqiya an tasbaha bahhaar bis-safiina!"
      }
    ]
  },
  {
    id: 'rashid_dangerous_voyage',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَخطَر رِحلَة؟ كانَت قُرب خَليج عَدَن. العَاصِفَة جَاءَت مِن لا مَكَان!',
        english: 'Most dangerous journey? It was near the Gulf of Aden. The storm came from nowhere!',
        transliteration: "Aktar rihla? Kaanat qurb Khaliij Adan. Al-'aasifa jaa'at min laa makaan!"
      },
      {
        speaker: 'npc',
        arabic: 'لَكِن القُبَّان كَانَ يَعرِف النُّجوم. نَظَرنَا إِلى السَّمَاء وَنَجَونَا!',
        english: 'But the captain knew the stars. We looked to the sky and survived!',
        transliteration: "Laakin al-qubban kaana ya'rif an-nujuum. Nazarnaa ilaa as-samaa' wa najaynaa!"
      },
      {
        speaker: 'npc',
        arabic: 'السَّفينَة العَرَبِيَّة "الدَّاو" أَبحَرَت مِن شَرق أَفريقيا إِلى الصِّين. بَحَّارَة عَظماء!',
        english: 'The Arab "dhow" ship sailed from East Africa to China. Great sailors!',
        transliteration: "As-safiina al-'arabiyya 'ad-daaw' abhaarat min sharq Afriqiyaa ilaa as-Siin. Bahhaara 'uzamaa'!",
        culturalNote: 'Arab dhow ships (داو) sailed monsoon routes from East Africa to India and China from the 8th century. Arab sailors used celestial navigation and seasonal monsoon winds to create reliable trade routes 700 years before European explorers.'
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: النَّجم — لِأَنَّ البَحَّار بِدون نُجوم كَالأَعمى!',
        english: 'Learn: star — because a sailor without stars is like a blind man!',
        transliteration: "Ta'allam: an-najm — li-anna al-bahhaar bi-duun nujuum kal-a'maa!",
        teachWord: 'star_w16'
      }
    ]
  }
);

console.log('captain-rashid trees:', data.find(n => n.id === 'captain-rashid').dialogueTrees.length);

// ============================================================
// 6. fishmonger-hana — Cheerful coastal vendor
// ============================================================
const fishmongerHana = data.find(n => n.id === 'fishmonger-hana');
fishmongerHana.dialogueTrees.push(
  {
    id: 'hana_gulf_traditions',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'تَعَال تَعَال! اليَوم عِندي أَجمَل السَّمَك! وَعِندي أَيضاً قِصَّة جَميلَة!',
        english: 'Come come! Today I have the most beautiful fish! And I also have a beautiful story!',
        transliteration: "Ta'aal ta'aal! Al-yawm 'indii ajmal as-samak! Wa 'indii aydan qissa jamiila!"
      },
      {
        speaker: 'npc',
        arabic: 'قَبلَ النَّفط، كَانَ الخَليج يَعيش على الغَوص! صَيد اللُّؤلُؤ!',
        english: 'Before oil, the Gulf lived on diving! Pearl fishing!',
        transliteration: "Qabla an-naft, kaana al-khaliij ya'iish 'alaa al-ghaws! Sayd al-lu'lu'!"
      },
      {
        speaker: 'npc',
        arabic: 'أَجدَادي كَانوا غَوَّاصِين! يَغوصون إِلى قَاع البَحر بِيَدَيهِم — بِدون أَي آلَة!',
        english: 'My ancestors were divers! They dove to the sea floor with their hands — without any equipment!',
        transliteration: "Ajdaadii kaanuu ghawwaasiin! Yaghuusuun ilaa qaa' al-bahr bi-yadayhim — bi-duun ayyi aala!",
        culturalNote: 'Pearl diving (الغَوص, al-ghaws) was the primary industry of the Arabian Gulf for centuries before oil. Divers could reach depths of 40 meters on a single breath, and Qatar, Bahrain, and Kuwait built entire economies on pearls sold to India and Europe.'
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: السَّمَك — أَهَمُّ كَلِمَة في السّوق الساحِلِيّ!',
        english: 'Learn: fish — the most important word in the coastal market!',
        transliteration: "Ta'allam: as-samak — ahamm kalima fis-suuq as-saahiliyy!",
        teachWord: 'fish_food_1'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني أَسمَاء الطَّعام',
            english: 'Teach me food names',
            next: 'hana_food_lesson'
          },
          {
            arabic: 'أَخبِرني المَزيد عَن صَيد اللُّؤلُؤ',
            english: 'Tell me more about pearl diving',
            next: 'hana_pearl_diving'
          }
        ]
      }
    ]
  },
  {
    id: 'hana_food_lesson',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الطَّعَام! أَعظَم الكَلِمَات! اِستَمِع! الخُبز — أَسَاس كُلِّ وَجبَة!',
        english: 'Food! The greatest words! Listen! Bread — the foundation of every meal!',
        transliteration: "At-ta'aam! A'zam al-kalimaat! Istami'! Al-khubz — asaas kulli wajba!",
        teachWord: 'bread_1'
      },
      {
        speaker: 'npc',
        arabic: 'التَّمر! غِذَاء الصَّحرَاء. العَرَب عَاشوا على التَّمر لِآلاف السِّنين!',
        english: 'Dates! Food of the desert. Arabs lived on dates for thousands of years!',
        transliteration: "At-tamr! Ghidhaa' as-sahraa'. Al-'Arab 'aashuu 'alaa at-tamr li-aalaaf as-sinin!",
        teachWord: 'dates_1'
      },
      {
        speaker: 'npc',
        arabic: 'العَسَل! دَوَاء وَغِذَاء في آنٍ وَاحِد. النَّحل يَعمَل وَنَحنُ نَستَفيد!',
        english: 'Honey! Medicine and food at the same time. Bees work and we benefit!',
        transliteration: "Al-'asal! Dawaa' wa ghidhaa' fii aanin waahid. An-nahl ya'mal wa nahnu nastafid!",
        teachWord: 'honey_1'
      },
      {
        speaker: 'npc',
        arabic: 'القَهوَة! شَرَاب العَرَب المَقدَّس! مِن اليَمَن انتَشَرَت إِلى العَالَم كُلِّه!',
        english: 'Coffee! The sacred Arab drink! From Yemen it spread to the whole world!',
        transliteration: "Al-qahwa! Sharaab al-'Arab al-muqaddas! Min al-Yaman intatarat ilaa al-'aalam kullih!",
        teachWord: 'coffee_1'
      },
      {
        action: 'quiz',
        words: ['fish_food_1', 'bread_1', 'dates_1', 'honey_1', 'coffee_1'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'مُمتاز! الآن تَعرِف مَا يَكفيكَ لِلعَيش. تَعَال كُلَّ يَوم وَسَأُعَلِّمُكَ المَزيد!',
        english: 'Excellent! Now you know enough to live on. Come every day and I will teach you more!',
        transliteration: "Mumtaaz! Al-aan ta'rif maa yakfiik lil-'aysh. Ta'aal kull yawm wa sa-u'allimuka al-maziid!"
      }
    ]
  },
  {
    id: 'hana_pearl_diving',
    lines: [
      {
        speaker: 'npc',
        arabic: 'اللُّؤلُؤ! كَانَ يُسَاوي الذَّهَب في الهِند وَأُوروبَّا. كَانَ كَنز الخَليج!',
        english: 'Pearls! They were worth gold in India and Europe. They were the treasure of the Gulf!',
        transliteration: "Al-lu'lu'! Kaana yusaawii adh-dhahab fil-Hind wa Uurubba. Kaana kanz al-khaliij!"
      },
      {
        speaker: 'npc',
        arabic: 'الغَوَّاص يَحمِل حَجَراً ثَقِيلاً لِيَنزِل سَريعاً. ثُمَّ يَلتَقِط الأَصداف بِيَدَيه!',
        english: 'The diver carries a heavy stone to descend quickly. Then he collects shells with his hands!',
        transliteration: "Al-ghawwaas yahmil hajaran thaqiilan li-yanzil sarii'an. Thumma yaltaqit al-asdaaf bi-yadaih!"
      },
      {
        speaker: 'npc',
        arabic: 'ثُمَّ جَاءَ النَّفط — وَانتَهى زَمَن الغَوص. لَكِن القِصَص بَقِيَت!',
        english: 'Then oil came — and the age of diving ended. But the stories remained!',
        transliteration: "Thumma jaa' an-naft — wa intahaa zaman al-ghaws. Laakin al-qisas baqiyat!",
        culturalNote: 'Before oil was discovered in Bahrain (1932) and Kuwait (1938), pearl diving was the backbone of Gulf economies. Bahrain alone exported 3-4 million pearls per year by the early 20th century. Japanese cultured pearls destroyed the industry in the 1920s-30s.'
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: الماء — لِأَنَّ بِدُون الماء لا بَحر وَلا حَيَاة!',
        english: 'Learn: water — because without water there is no sea and no life!',
        transliteration: "Ta'allam: al-maa' — li-anna bi-duun al-maa' laa bahr wa laa hayaah!",
        teachWord: 'water_w13'
      }
    ]
  },
  {
    id: 'hana_market_chatter',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَي، أَنتَ! تَعَال! البِضَاعَة اليَوم طَازَجَة! صِيدَت هَذَا الصَّبَاح!',
        english: 'Hey, you! Come! The goods today are fresh! Caught this morning!',
        transliteration: "Ay, anta! Ta'aal! Al-bidaa'a al-yawm taazija! Siidat haadha as-sabaah!"
      },
      {
        speaker: 'npc',
        arabic: 'هَل تَعرِف أَنَّ كَلِمَة "tuna" رُبَّما مِن العَرَبِيَّة "تُنَّ"؟ العَرَب صَادوا التُّنَّ قَديماً!',
        english: 'Did you know the word "tuna" may come from Arabic "tunn"? Arabs fished tuna in ancient times!',
        transliteration: "Hal ta'rif anna kalima 'tuna' rubbama min al-'arabiyya 'tunn'? Al-'Arab saaduu at-tunn qadiiman!",
        culturalNote: 'The word "tuna" may derive from Arabic "tunn" (تُنّ) via Medieval Latin "thunnus." Arab fishermen in the Mediterranean and Gulf developed sophisticated nets and seasonal fishing knowledge that influenced global fishing traditions.'
      },
      {
        speaker: 'npc',
        arabic: 'اِشتَرِ مِنّي! تَعَلَّم: السُّوق — أَجمَل مَكان في أَيِّ مَدينَة!',
        english: 'Buy from me! Learn: the market — the most beautiful place in any city!',
        transliteration: "Ishtari minni! Ta'allam: as-suuq — ajmal makaan fii ayyi madiina!",
        teachWord: 'market_w29'
      },
      {
        speaker: 'npc',
        arabic: 'وَالسَّمَكَة هَذِه؟ بِثَمَن زَهيد! تَعَلَّم: رَخيص — كَلِمَة مُهِمَّة في السُّوق!',
        english: 'And this fish? At a cheap price! Learn: cheap — an important word in the market!',
        transliteration: "Wa as-samaka haadhihi? Bi-thaman zahiid! Ta'allam: rakhiis — kalima muhimma fis-suuq!",
        teachWord: 'cheap_w32'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'أُرِيد أَن أَشتَري',
            english: 'I want to buy',
            next: 'hana_buying_lesson'
          },
          {
            arabic: 'شُكراً يا هَناء',
            english: 'Thank you, Hana',
            next: null
          }
        ]
      }
    ]
  },
  {
    id: 'hana_buying_lesson',
    lines: [
      {
        speaker: 'npc',
        arabic: 'مُمتاز! المُشتَري الذَّكِيّ يَعرِف الكَلِمَات! كَم يُكَلِّف؟ — تَسأَل هَكَذا!',
        english: 'Excellent! The clever buyer knows the words! How much does it cost? — you ask like this!',
        transliteration: "Mumtaaz! Al-mushtari adh-dhakii ya'rif al-kalimaat! Kam yukallif? — tas'al hakadhaa!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: السِّعر — لِأَنَّ في كُلِّ سُوق يَسأَل الجَميع عَنه!',
        english: 'Learn: the price — because in every market everyone asks about it!',
        transliteration: "Ta'allam: as-si'r — li-anna fii kulli suuq yas'al al-jamii' 'anh!",
        teachWord: 'price_w31'
      },
      {
        speaker: 'npc',
        arabic: 'وَالمَال! لا سُوق بِدون مَال! لَكِن بِدون مَعرِفَة، المَال لا يَنفَع!',
        english: 'And money! No market without money! But without knowledge, money is useless!',
        transliteration: "Wa al-maal! Laa suuq bi-duun maal! Laakin bi-duun ma'rifa, al-maal laa yanfa'!",
        teachWord: 'money_w30'
      }
    ]
  }
);

console.log('fishmonger-hana trees:', data.find(n => n.id === 'fishmonger-hana').dialogueTrees.length);

// ============================================================
// Write the file
// ============================================================
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('\nFile written successfully!');

// Final counts
const targets1 = ['wanderer-ali', 'guide-salim', 'weaver-zahra', 'healer-khadija', 'captain-rashid', 'fishmonger-hana'];
targets1.forEach(id => {
  const n = data.find(x => x.id === id);
  const trees = n.dialogueTrees.length;
  const lines = n.dialogueTrees.reduce((s, t) => s + t.lines.filter(l => l.speaker || l.arabic).length, 0);
  const tw = n.dialogueTrees.reduce((s, t) => s + t.lines.filter(l => l.teachWord).length, 0);
  const cn = n.dialogueTrees.reduce((s, t) => s + t.lines.filter(l => l.culturalNote).length, 0);
  console.log(`${id}: trees=${trees} lines=${lines} teachWords=${tw} culturalNotes=${cn}`);
});
