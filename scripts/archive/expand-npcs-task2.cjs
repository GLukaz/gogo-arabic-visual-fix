#!/usr/bin/env node
// Task 2: Add new dialogue trees to NPCs 19-24
// blacksmith-daud, vizier-abbas, princess-aisha, poet-rumi, imam-muhammad, guide-amira

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/npcs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ============================================================
// 1. blacksmith-daud — Proud craftsman, Damascus steel
// ============================================================
const blacksmithDaud = data.find(n => n.id === 'blacksmith-daud');
blacksmithDaud.dialogueTrees.push(
  {
    id: 'daud_damascus_steel',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'اِنظُر إِلى هَذِه السَّيف! يَرى الطَّيف فِيها! هَذِهِ هِيَ فُولاذ دِمَشق الأَصيل!',
        english: 'Look at this sword! You can see your reflection in it! This is genuine Damascus steel!',
        transliteration: "Unzur ilaa haadha as-sayf! Yaraa at-tayf fiihaa! Haadhihi hiya fuulaadh Dimashq al-asiil!"
      },
      {
        speaker: 'npc',
        arabic: 'فُولاذ دِمَشق! أَسطورَة الحَدَّادِين. نَمط مَوجِيّ كَالماء. لا يُنسى!',
        english: 'Damascus steel! The legend of blacksmiths. A wavy pattern like water. Unforgettable!',
        transliteration: "Fuulaadh Dimashq! Ustuuratu al-haddaadin. Namat mawjiyy kal-maa'. Laa yunsaa!",
        culturalNote: 'Damascus steel (فُولاذ دِمَشق) had a distinctive wavy "damask" pattern caused by carbon nanotubes. Modern science only confirmed this in 2006. The technique was perfected in Damascus around 1000 CE and was LOST around 1750 CE — it has never been fully replicated.'
      },
      {
        speaker: 'npc',
        arabic: 'الوَصفَة ضَاعَت حَوالي عَام 1750. لا يَستَطيع أَحَد صُنعَها الآن تَماماً!',
        english: 'The recipe was lost around 1750. Nobody can make it exactly the same now!',
        transliteration: "Al-wasfa daa'at hawaalii 'aam 1750. Laa yastatiiu ahadun sun'ahaa al-aan tamaaман!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: الذَّهَب — الحَدَّاد يَعرِف قِيمَة المَعدَن كَمَا يَعرِفُ قِيمَة المَعرِفَة!',
        english: 'Learn: gold — a blacksmith knows the value of metal as he knows the value of knowledge!',
        transliteration: "Ta'allam: adh-dhahab — al-haddaad ya'rif qiimat al-ma'din kamaa ya'rif qiimat al-ma'rifa!",
        teachWord: 'gold_w36'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني أَسمَاء أَدوَات الحِدَادَة',
            english: 'Teach me blacksmithing tool names',
            next: 'daud_craft_lesson'
          },
          {
            arabic: 'كَيفَ صَنَعتَ هَذَا السَّيف؟',
            english: 'How did you make this sword?',
            next: 'daud_forging_process'
          }
        ]
      }
    ]
  },
  {
    id: 'daud_craft_lesson',
    lines: [
      {
        speaker: 'npc',
        arabic: 'المَهارَة! التِّجَارَة! تَعَلَّم كَلِمَات العَمَل يَا صَاحِبي!',
        english: 'Craft! Trade! Learn the words of work, my companion!',
        transliteration: "Al-mahaara! At-tijaara! Ta'allam kalimaat al-'amal yaa saahib!"
      },
      {
        speaker: 'npc',
        arabic: 'الفِضَّة! بَعدَ الذَّهَب، أَجمَل مَعدِن. وَأَنَا الحَدَّاد أَعرِف كِلَيهِمَا!',
        english: 'Silver! After gold, the most beautiful metal. And I the blacksmith know both!',
        transliteration: "Al-fidda! Ba'da adh-dhahab, ajmal ma'din. Wa ana al-haddaad a'rif kilayhima!",
        teachWord: 'silver_w37'
      },
      {
        speaker: 'npc',
        arabic: 'العَمَل! هَذِه الكَلِمَة أَعظَم كَلِمَة في لُغَة الحَدَّادِين!',
        english: 'Work! This word is the greatest word in the language of blacksmiths!',
        transliteration: "Al-'amal! Haadhihi al-kalima a'zam kalima fii lughat al-haddaadin!",
        teachWord: 'work_1'
      },
      {
        speaker: 'npc',
        arabic: 'أَعطِ — لِأَنَّ الحَدَّاد يَصنَع وَيُعطِي لِلمُجتَمَع. العَطَاء عِبَادَة!',
        english: 'Give — because the blacksmith makes and gives to the community. Giving is worship!',
        transliteration: "A'ti — li-anna al-haddaad yasna' wa yu'tii lil-mujtama'. Al-'ataa' 'ibaada!",
        teachWord: 'give_1'
      },
      {
        action: 'quiz',
        words: ['gold_w36', 'silver_w37', 'work_1', 'give_1'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'مُمتاز! الآن أَنتَ تَتَكَلَّم مِثلَ تَاجِر. عُد وَسَأُعَلِّمُكَ كَلِمَات المَعدِن الأُخرى!',
        english: 'Excellent! Now you speak like a merchant. Come back and I will teach you more metal words!',
        transliteration: "Mumtaaz! Al-aan anta tatakallam mithla taajir. 'Ud wa sa-u'allimuka kalimaat al-ma'din al-ukhraa!"
      }
    ]
  },
  {
    id: 'daud_forging_process',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَولاً: النَّار! بِدُون نَار لا حِدَادَة. الحَرَارَة تُحَوِّل الحَجَر إِلى أَدَاة!',
        english: 'First: fire! Without fire there is no blacksmithing. Heat transforms stone into tool!',
        transliteration: "Awwalan: an-naar! Bi-duun naar laa hidaada. Al-haraara tuhawwil al-hajar ilaa adaa!"
      },
      {
        speaker: 'npc',
        arabic: 'ثَانِياً: المَطرَقَة والسِّنديان. الحَدَّاد يَضرِب، ويَشكِّل، وَيُعِيد الضَّرب حَتَّى يَكتَمِل الشَّكل!',
        english: 'Second: the hammer and anvil. The blacksmith strikes, shapes, and re-strikes until the form is complete!',
        transliteration: "Thaaniyan: al-matраqa was-sindiyaan. Al-haddaad yadrib, wa yushakkil, wa yu'iid ad-darb hattaa yaktamil ash-shakl!"
      },
      {
        speaker: 'npc',
        arabic: 'ثَالِثاً: الماء البَارِد! التَّبريد السَّريع يُقَسِّي المَعدِن. هَذَا سِرُّ الفُولاذ!',
        english: 'Third: cold water! Rapid cooling hardens the metal. This is the secret of steel!',
        transliteration: "Thaalithan: al-maa' al-baarid! At-tabriid as-sarii' yuqassii al-ma'din. Haadha sirr al-fuulaadh!",
        culturalNote: 'Islamic geometric metalwork, featuring intricate arabesque patterns, influenced European decorative arts from the Crusades onward. The word "steel" itself derives from Proto-Germanic, but Arab metalworkers preserved and advanced Roman techniques during Europe\'s Dark Ages.'
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: قَوِيّ — لِأَنَّ الفُولاذ الجَيِّد قَوِيٌّ، وَكَذَلِك الإِنسَان الجَيِّد!',
        english: 'Learn: strong — because good steel is strong, and so is a good person!',
        transliteration: "Ta'allam: qawiyy — li-anna al-fuulaadh al-jayyid qawiyy, wa kadhalik al-insaan al-jayyid!",
        teachWord: 'strong_1'
      }
    ]
  },
  {
    id: 'daud_geometric_art',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'يَا صَاحِب! اِنظُر إِلى هَذَا الزَّخرَف! الهَندَسَة الإِسلَامِيَّة في المَعدِن!',
        english: 'My companion! Look at this decoration! Islamic geometry in metal!',
        transliteration: "Yaa saahib! Unzur ilaa haadha az-zakhraf! Al-handasa al-islaamiyya fil-ma'din!"
      },
      {
        speaker: 'npc',
        arabic: 'النُّجوم السِّتُّ، الأَنماط المُتَشَابِكَة — كُلُّها لا تَنتَهي وَلا تَبتَدِئ. كَمِثل الله!',
        english: 'Six-pointed stars, interlocking patterns — they never end and never begin. Like God!',
        transliteration: "An-nujuum as-sitt, al-anmaat al-mutashaabika — kulluhaa laa tantahii wa laa tabтadi'. Ka-mithli Allaah!"
      },
      {
        speaker: 'npc',
        arabic: 'العَمَل الجَيِّد يَجمَع الجَمَال والفَائِدَة. تَعَلَّم: جَميل — لِأَنَّ الأَدَاة الجَمِيلَة تُكرِّمُها!',
        english: 'Good work combines beauty and utility. Learn: beautiful — because you honor a beautiful tool!',
        transliteration: "Al-'amal al-jayyid yajma' al-jamaal wal-faa'ida. Ta'allam: jamiil — li-anna al-adaa al-jamiila tukarrimuhaa!",
        teachWord: 'beautiful_1'
      },
      {
        speaker: 'npc',
        arabic: 'اِعمَل بِإِتقَان — هَذَا هُوَ الإِحسَان. وَهَذِه وَصِيَّة النَّبي صَلَّى الله عَلَيه وَسَلَّم.',
        english: 'Work with excellence — this is ihsan. And this is the advice of the Prophet, peace be upon him.',
        transliteration: "I'mal bi-itqaan — haadha huwa al-ihsaan. Wa haadhihi wasiyyat an-Nabiyy sallaa Allaahu 'alayhi wa sallam."
      }
    ]
  }
);

console.log('blacksmith-daud trees:', data.find(n => n.id === 'blacksmith-daud').dialogueTrees.length);

// ============================================================
// 2. vizier-abbas — Shrewd political advisor, Abbasid court
// ============================================================
const vizierAbbas = data.find(n => n.id === 'vizier-abbas');
vizierAbbas.dialogueTrees.push(
  {
    id: 'abbas_abbasid_admin',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'اِجلِس! الحُكم يَحتَاج عَقلاً قَبلَ سَيف. دَعني أُعَلِّمُكَ كَيفَ تَفكِّر.',
        english: 'Sit! Governance needs a mind before a sword. Let me teach you how to think.',
        transliteration: "Ijlis! Al-hukm yahtaaju 'aqlan qabla sayf. Da'ni u'allimuka kayfa tufakkir."
      },
      {
        speaker: 'npc',
        arabic: 'الدَّولَة العَبَّاسِيَّة بَنَت أَول نِظَام بُرِيد في العَالَم — البَرِيد! أَلف مِيل مِن بَغدَاد إِلى خُرَاسَان!',
        english: 'The Abbasid state built the world\'s first postal system — the barid! A thousand miles from Baghdad to Khorasan!',
        transliteration: "Ad-dawla al-'abbaasiyya banat awwal nizaam bariid fil-'aalam — al-bariid! Alf miil min Baghdad ilaa Khurasaan!",
        culturalNote: '"Vizier" (وَزير, wazir) comes from Arabic, meaning "burden-bearer." The Abbasid postal system (البَرِيد, al-bariid) spanned 1,000+ miles, with relay stations every few miles — the world\'s most sophisticated communication network from 750-1258 CE.'
      },
      {
        speaker: 'npc',
        arabic: 'كَلِمَة "vizier" نَفسُها عَرَبِيَّة — وَزِير، حَامِل العِبء! أَنا أَحمِل عِبءَ المَملَكَة!',
        english: 'The word "vizier" itself is Arabic — wazir, burden-bearer! I carry the burden of the kingdom!',
        transliteration: "Kalima 'vizier' nafsuhaa 'arabiyya — wazeer, haamil al-'ibb! Ana ahmil 'ib' al-mamlaka!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: المَلِك — لِأَنَّ كُلَّ دَولَة تَحتَاج قَائِداً وَإِدَارَة!',
        english: 'Learn: the king — because every state needs a leader and administration!',
        transliteration: "Ta'allam: al-malik — li-anna kull dawla tahtaaju qaa'idan wa idaara!",
        teachWord: 'big_1'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني كَلِمَات السِّيَاسَة',
            english: 'Teach me political vocabulary',
            next: 'abbas_formal_vocab'
          },
          {
            arabic: 'مَا سِرُّ الحُكم الجَيِّد؟',
            english: 'What is the secret of good governance?',
            next: 'abbas_governance_wisdom'
          }
        ]
      }
    ]
  },
  {
    id: 'abbas_formal_vocab',
    lines: [
      {
        speaker: 'npc',
        arabic: 'التَّحِيَّة الرَّسمِيَّة أَولاً! في بَلاط الخَليفَة كَانَ لِكُلِّ مَقَام مَقَال.',
        english: 'The formal greeting first! In the Caliph\'s court there was a proper expression for every occasion.',
        transliteration: "At-tahiyya ar-rasmiyya awwalan! Fii balaat al-khalifa kaana li-kulli maqaam maqaal."
      },
      {
        speaker: 'npc',
        arabic: 'الصَّبَاح. "صَبَاح الخَير" — أَفضَل بِدَايَة لِيَوم السِّيَاسَة!',
        english: 'Morning. "Sabah al-khayr" — the best beginning for a day of politics!',
        transliteration: "As-sabaah. 'Sabaah al-khayr' — afdal bidaaya li-yawm as-siyaasa!",
        teachWord: 'sabah_al_khayr'
      },
      {
        speaker: 'npc',
        arabic: 'المَسَاء. "مَسَاء الخَير" — وَمَن يُتِمُّ نَهَاره بِخَير كَسَبَ الدِّبلُومَاسِيَّة!',
        english: 'Evening. "Masaa al-khayr" — and he who ends his day well has won diplomacy!',
        transliteration: "Al-masaa'. 'Masaa' al-khayr' — wa man yutimm nahaarah bi-khayr kasaba ad-diblumaasiiyya!",
        teachWord: 'masa_al_khayr'
      },
      {
        speaker: 'npc',
        arabic: 'وَالأَهَمّ: أَعرِف مَتَى تَتَكَلَّم وَمَتَى تَصمُت. السُّكوت ذَهَب في السِّيَاسَة!',
        english: 'Most importantly: know when to speak and when to be silent. Silence is gold in politics!',
        transliteration: "Wa al-ahamm: a'rif mataa tatakallam wa mataa tasмut. As-sukuut dhahab fis-siyaasa!"
      },
      {
        action: 'quiz',
        words: ['sabah_al_khayr', 'masa_al_khayr', 'salaam', 'ma_a_salama'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'مُمتاز! أَنتَ تَتَعَلَّم آدَاب البَلاط. رُبَّما يَوماً تَصبَح وَزِيراً!',
        english: 'Excellent! You are learning court manners. Perhaps one day you will become a vizier!',
        transliteration: "Mumtaaz! Anta tata'allam aadaab al-balaat. Rubbamaa yawman tasbahu waziiran!"
      }
    ]
  },
  {
    id: 'abbas_governance_wisdom',
    lines: [
      {
        speaker: 'npc',
        arabic: 'سِرُّ الحُكم الجَيِّد؟ ثَلاثَة أَشيَاء: العَدل، الاِستِشَارَة، وَالتَّواضُع!',
        english: 'The secret of good governance? Three things: justice, consultation, and humility!',
        transliteration: "Sirr al-hukm al-jayyid? Thalaatha ashyaa': al-'adl, al-istishaara, wat-tawadu'!"
      },
      {
        speaker: 'npc',
        arabic: 'الخَليفَة هَارون الرَّشيد كَانَ يَتَنَكَّر لَيلاً لِيَعرِف أَحوَال النَّاس بِنَفسِه!',
        english: 'Caliph Harun al-Rashid used to disguise himself at night to personally know the state of the people!',
        transliteration: "Al-khalifa Haaruun ar-Rashiid kaana yatanakkar laylan li-ya'rif ahwaal an-naas bi-nafsih!"
      },
      {
        speaker: 'npc',
        arabic: 'الدَّولَة العَبَّاسِيَّة جَمَعَت العُلَمَاء مِن كُلِّ الأَدِيَان والأَجنَاس. هَذَا هُوَ الحُكم الحَقِيقِيّ!',
        english: 'The Abbasid state gathered scholars from all religions and peoples. This is true governance!',
        transliteration: "Ad-dawla al-'abbaasiyya jama'at al-'ulamaa' min kulli al-adyaan wal-ajnaas. Haadha huwa al-hukm al-haqiiqi!",
        culturalNote: 'The Abbasid Caliphate (750-1258 CE) created the first truly multicultural intellectual state. The House of Wisdom (Bayt al-Hikma) employed scholars of every faith — Muslim, Christian, Jewish, Zoroastrian — to translate all human knowledge into Arabic.'
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: قَديم — لِأَنَّ الحِكمَة القَدِيمَة لا تَشيخ أَبَداً!',
        english: 'Learn: old/ancient — because ancient wisdom never grows old!',
        transliteration: "Ta'allam: qadiim — li-anna al-hikma al-qadiima laa tashiikh abadan!",
        teachWord: 'old_1'
      }
    ]
  },
  {
    id: 'abbas_court_secrets',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَقرَب إِليَّ! سَأُطلِعُكَ على سِرٍّ مِن أَسرَار البَلاط. لا تُخبِر أَحَداً!',
        english: 'Come closer! I will share with you a secret of the court. Tell no one!',
        transliteration: "Aqrab ilayya! Sa-utli'uk 'alaa sirrin min asraar al-balaat. Laa takhbar ahadan!"
      },
      {
        speaker: 'npc',
        arabic: 'الوَزِير الجَيِّد يَعرِف مَتَى يُعطِي وَمَتَى يَأخُذ. مَتَى يَتَكَلَّم وَمَتَى يَسكُت.',
        english: 'A good vizier knows when to give and when to take. When to speak and when to be silent.',
        transliteration: "Al-wazeer al-jayyid ya'rif mataa yu'tii wa mataa ya'khudh. Mataa yatakallam wa mataa yaskut."
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: أَخَذَ — هَذِه الكَلِمَة مُهِمَّة في كُلِّ مُفَاوَضَة!',
        english: 'Learn: to take — this word is important in every negotiation!',
        transliteration: "Ta'allam: akhadha — haadhihi al-kalima muhimma fii kulli mufaawada!",
        teachWord: 'take_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَالأَهَمّ: النَّوم! الوَزِير الذي لا يَنَام يَفقِد قُدرَتَه على التَّفكِير. النَّوم عَقل!',
        english: 'Most important: sleep! The vizier who does not sleep loses his ability to think. Sleep is wisdom!',
        transliteration: "Wa al-ahamm: an-nawm! Al-wazeer alladhii laa yanaam yafqid qudratahu 'alaa at-tafkiir. An-nawm 'aql!",
        teachWord: 'sleep_1'
      }
    ]
  }
);

console.log('vizier-abbas trees:', data.find(n => n.id === 'vizier-abbas').dialogueTrees.length);

// ============================================================
// 3. princess-aisha — Strong-willed noblewoman, Fatima al-Fihri
// ============================================================
const princessAisha = data.find(n => n.id === 'princess-aisha');
princessAisha.dialogueTrees.push(
  {
    id: 'aisha_fatima_fihri',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَتَعرِف فَاطِمَة الفِهرِيَّة؟ مَرَأَة مُسلِمَة أَسَّسَت أَقدَم جَامِعَة في العَالَم!',
        english: 'Do you know Fatima al-Fihri? A Muslim woman who founded the oldest university in the world!',
        transliteration: "Ata'rif Faatima al-Fihriyya? Imra'a muslima assasat aqdam jaami'a fil-'aalam!"
      },
      {
        speaker: 'npc',
        arabic: 'جَامِعَة القَرَوِيِّين في فَاس، المَغرِب — عَام 859 مِيلادِيّ. اليونِسكو تَعتَرِف بِها كَأَقدَم جَامِعَة!',
        english: 'Al-Qarawiyyin University in Fez, Morocco — 859 CE. UNESCO recognizes it as the oldest university!',
        transliteration: "Jaami'at al-Qarawiyyiin fii Faas, al-Maghrib — 'aam 859 miilaadiiyy. Al-Yuunisku ta'tarif bihaa ka-aqdam jaami'a!",
        culturalNote: 'Fatima al-Fihri founded al-Qarawiyyin University in Fez, Morocco in 859 CE — recognized by UNESCO and Guinness World Records as the world\'s oldest continuously operating educational institution. She used her entire inheritance to build it.'
      },
      {
        speaker: 'npc',
        arabic: 'وَلُبنى القُرطُبِيَّة — رِيَاضِيَّة وَشَاعِرَة وَمَكتَبِيَّة في بَلاط قُرطُبَة. امرَأَة عَظيمَة!',
        english: 'And Lubna of Cordoba — mathematician, poet, and librarian in the Cordoba court. A great woman!',
        transliteration: "Wa Lubna al-Qurtubiyya — riyaadiyya wa shaа'ira wa maktabiyya fii balaat Qurtuba. Imra'a 'aziima!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: الأُمّ — لِأَنَّ فَاطِمَة الفِهرِيَّة كَانَت أُمَّ التَّعلِيم الإِسلَامِيّ!',
        english: 'Learn: mother — because Fatima al-Fihri was the mother of Islamic education!',
        transliteration: "Ta'allam: al-umm — li-anna Faatima al-Fihriyya kaanat umm at-ta'liim al-islaamiyy!",
        teachWord: 'family_mother'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني كَلِمَات العَائِلَة',
            english: 'Teach me family words',
            next: 'aisha_family_lesson'
          },
          {
            arabic: 'مَاذَا أَنتِ تَتَعَلَّمين؟',
            english: 'What are you studying?',
            next: 'aisha_her_studies'
          }
        ]
      }
    ]
  },
  {
    id: 'aisha_family_lesson',
    lines: [
      {
        speaker: 'npc',
        arabic: 'العَائِلَة — أَهَمُّ مَؤسَّسَة في الحَضَارَة الإِسلَامِيَّة. كُلُّ شَيء يَبدَأ مِن البَيت!',
        english: 'Family — the most important institution in Islamic civilization. Everything begins from the home!',
        transliteration: "Al-'aa'ila — ahamm mu'assasa fil-hadaara al-islaamiyya. Kull shay' yabda' min al-bayt!"
      },
      {
        speaker: 'npc',
        arabic: 'الأَب! أَوَّل كَلِمَة تَعلَّمَها كُلُّ طِفل في كُلِّ لُغَة!',
        english: 'The father! The first word every child learns in every language!',
        transliteration: "Al-ab! Awwal kalima ta'allamahaa kull tifl fii kulli lugha!",
        teachWord: 'family_father'
      },
      {
        speaker: 'npc',
        arabic: 'الأَخ! الأَخوَّة في الإِسلَام تَمتَدُّ لِتَشمَل كُلَّ مُسلِم — لِتَكن أَخاً لِلجَميع!',
        english: 'The brother! Brotherhood in Islam extends to include every Muslim — be a brother to all!',
        transliteration: "Al-akh! Al-ukhuwwa fil-islaam tamtaddu li-tashmila kull muslim — liyakun akhaan lil-jamii'!",
        teachWord: 'family_brother'
      },
      {
        speaker: 'npc',
        arabic: 'الأُخت! وَالنِّسَاء في الإِسلَام كانَ لَهُنَّ حُقوق قَبلَ أُوروبَّا بِألف سَنَة!',
        english: 'The sister! And women in Islam had rights a thousand years before Europe!',
        transliteration: "Al-ukht! Wa an-nisaa' fil-islaam kaana lahunna huquuq qabla Uurubba bi-alf sana!",
        teachWord: 'family_sister'
      },
      {
        action: 'quiz',
        words: ['family_father', 'family_mother', 'family_brother', 'family_sister'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'أَحسَنتَ! تَعلَّمتَ العَائِلَة. بِدُونَ عَائِلَة لا حَضَارَة — تَذكَّر هَذا دَائِماً!',
        english: 'Well done! You learned family. Without family there is no civilization — remember this always!',
        transliteration: "Ahsanta! Ta'allamta al-'aa'ila. Bi-duun 'aa'ila laa hadaara — tadhakkar haadha daa'iman!"
      }
    ]
  },
  {
    id: 'aisha_her_studies',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَنا أَتَعَلَّم الرِّيَاضِيَّات والفَلسَفَة والشِّعر! لِمَاذَا تَتَعَجَّب؟',
        english: 'I am studying mathematics, philosophy, and poetry! Why are you surprised?',
        transliteration: "Ana ata'allam ar-riyaadiyaat wal-falsafa wash-shi'r! Li-maadha tata'ajjab?"
      },
      {
        speaker: 'npc',
        arabic: 'في زَمَن الحَضَارَة الإِسلَامِيَّة، النِّسَاء كُنَّ عَالِمَات وَشَاعِرَات وَطَبيبَات!',
        english: 'In the age of Islamic civilization, women were scholars, poets, and physicians!',
        transliteration: "Fii zaman al-hadaara al-islaamiyya, an-nisaa' kunna 'aalimaat wa shaа'iraat wa tabibaat!"
      },
      {
        speaker: 'npc',
        arabic: 'العِلم لا جِنس لَه وَلا لَون. هَذَا ما أَقوله وَمَا تُؤكِّدُه التَّارِيخ!',
        english: 'Knowledge has no gender and no color. This is what I say and what history confirms!',
        transliteration: "Al-'ilm laa jins lahu wa laa lawn. Haadha maa aquuluh wa maa tu'akkiduh at-taariikh!",
        culturalNote: 'Lubna of Cordoba (d. 984 CE) was a renowned mathematician and librarian who managed the royal library of Caliph al-Hakam II — a collection of 400,000 volumes. She was his personal secretary and one of the leading intellectuals of 10th-century Spain.'
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: جَديد — لِأَنَّ كُلَّ فِكرَة جَديدَة تَفتَح بَاباً جَديداً!',
        english: 'Learn: new — because every new idea opens a new door!',
        transliteration: "Ta'allam: jadiid — li-anna kull fikra jadiida taftah baaban jadiiidan!",
        teachWord: 'new_1'
      }
    ]
  }
);

console.log('princess-aisha trees:', data.find(n => n.id === 'princess-aisha').dialogueTrees.length);

// ============================================================
// 4. poet-rumi — Contemplative wordsmith, Arabic prosody
// ============================================================
const poetRumi = data.find(n => n.id === 'poet-rumi');
poetRumi.dialogueTrees.push(
  {
    id: 'rumi_arabic_roots',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'اِجلِس مَعِي. سَأُرِيكَ أَعجَب شَيء في اللُّغَة العَرَبِيَّة — الجُذور الثُّلَاثِيَّة!',
        english: 'Sit with me. I will show you the most wondrous thing in Arabic — the trilateral roots!',
        transliteration: "Ijlis ma'i. Sa-uriika a'jab shay' fil-lugha al-'arabiyya — al-judhuур ath-thulaathiyya!"
      },
      {
        speaker: 'npc',
        arabic: 'ك-ت-ب: ثَلاثَة حُروف فَقَط. لَكِن مِنها: كَتَبَ، كِتَاب، كَاتِب، مَكتَبَة، مَكتوب!',
        english: 'K-T-B: only three letters. But from them: wrote, book, writer, library, written!',
        transliteration: "K-T-B: thalaathat huruuf faqat. Laakin minhaa: kataba, kitaab, kaatib, maktaba, maktуub!",
        culturalNote: 'Arabic\'s trilateral root system means three consonants generate a whole family of related words. The root ك-ت-ب (K-T-B) gives: كَتَبَ (wrote), كِتَاب (book), كَاتِب (writer), مَكتَبَة (library), مَكتوب (written/fate). A skilled poet plays with all these at once.'
      },
      {
        speaker: 'npc',
        arabic: 'الشَّاعِر العَرَبي يَلعَب بِعَشَرَات الكَلِمَات مِن جَذرٍ وَاحِد في بَيتٍ وَاحِد!',
        english: 'An Arab poet plays with dozens of words from one root in a single verse!',
        transliteration: "Ash-shaa'ir al-'arabiyy yal'ab bi-'asharaat al-kalimaat min jidhr waahid fii bayt waahid!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: صَغير — لِأَنَّ الكَلِمَة الصَّغيرَة تَحمِل أَحياناً أَكبَر مَعنى!',
        english: 'Learn: small — because the small word sometimes carries the biggest meaning!',
        transliteration: "Ta'allam: sagjiir — li-anna al-kalima as-saghiira tahmilu ahyaanan akbar ma'naa!",
        teachWord: 'small_1'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني كَلِمَات الشُّعور',
            english: 'Teach me emotion words',
            next: 'rumi_emotions_lesson'
          },
          {
            arabic: 'أَخبِرني عَن القَصيدَة العَرَبِيَّة',
            english: 'Tell me about Arabic poetry forms',
            next: 'rumi_qasida_form'
          }
        ]
      }
    ]
  },
  {
    id: 'rumi_emotions_lesson',
    lines: [
      {
        speaker: 'npc',
        arabic: 'الشُّعور! أَعمَق مَا في الإِنسَان! الشَّاعِر يُعَبِّر عَمَّا لا يَستَطيع غَيرُه قَوله!',
        english: 'Feelings! The deepest part of being human! The poet expresses what others cannot say!',
        transliteration: "Ash-shu'uur! A'maq maa fil-insaan! Ash-shaa'ir yu'abbir 'ammaa laa yastatiiu ghayruhu qawluh!"
      },
      {
        speaker: 'npc',
        arabic: 'سَعيد — أَجمَل كَلِمَة في كُلِّ اللُّغَات. تَقُولها وَتَشعُر بِها في نَفس الوَقت!',
        english: 'Happy — the most beautiful word in all languages. You say it and feel it at the same time!',
        transliteration: "Sa'iid — ajmal kalima fii kulli al-lughaat. Taquuluhaa wa tash'ur bihaa fii nafs al-waqt!",
        teachWord: 'happy_1'
      },
      {
        speaker: 'npc',
        arabic: 'حَزين — ضِدُّ سَعيد. الشَّاعِر يَحتَاج كِلتَا الكَلِمَتَين لِيُعَبِّر عَن الحَيَاة!',
        english: 'Sad — the opposite of happy. The poet needs both words to express life!',
        transliteration: "Haziiin — diddu sa'iid. Ash-shaa'ir yahtaaju kiltaa al-kalimatayn liyu'abbir 'an al-hayaah!",
        teachWord: 'sad_1'
      },
      {
        speaker: 'npc',
        arabic: 'جَميل وَقَبيح! نُور وَظَلام! الشِّعر يَعيش في المَسَافَة بَينَهُما!',
        english: 'Beautiful and ugly! Light and dark! Poetry lives in the distance between them!',
        transliteration: "Jamiil wa qabiih! Nuur wa zalaam! Ash-shi'r ya'iish fil-masaafa baynahumaa!",
        teachWord: 'ugly_1'
      },
      {
        action: 'quiz',
        words: ['happy_1', 'sad_1', 'beautiful_1', 'ugly_1', 'big_1', 'small_1'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'أَحسَنتَ! أَنتَ الآن تَمتَلِك المُفرَدَات لِتُعَبِّر عَن نَفسِك. هَذا هُوَ بِداية الشِّعر!',
        english: 'Well done! You now have the vocabulary to express yourself. This is the beginning of poetry!',
        transliteration: "Ahsanta! Anta al-aan tamtalik al-mufradaat litu'abbir 'an nafsik. Haadha huwa bidaayat ash-shi'r!"
      }
    ]
  },
  {
    id: 'rumi_qasida_form',
    lines: [
      {
        speaker: 'npc',
        arabic: 'القَصِيدَة العَرَبِيَّة! الشَّكل الشِّعرِيّ الأَعظَم. وَزن وَقَافِيَة وَمَعنى في آنٍ وَاحِد!',
        english: 'The Arabic qasida! The greatest poetic form. Meter, rhyme, and meaning all at once!',
        transliteration: "Al-qasiida al-'arabiyya! Ash-shakl ash-shi'riyy al-a'zam. Wazn wa qaafiya wa ma'naa fii aanin waahid!"
      },
      {
        speaker: 'npc',
        arabic: 'عِلم العَروض — عِلم أَوزَان الشِّعر. الخَليل بن أَحمَد وَضَعَه في القَرن الثَّامِن!',
        english: 'The science of arood — the science of poetic meters. Al-Khalil ibn Ahmad established it in the 8th century!',
        transliteration: "Ilm al-'aruud — 'ilm awzaan ash-shi'r. Al-Khalil ibn Ahmad wada'ahu fil-qarn ath-thaamin!",
        culturalNote: 'Al-Khalil ibn Ahmad al-Farahidi (c.718-786 CE) systematized Arabic poetic meters (علم العروض, \'ilm al-\'aruud), identifying 16 meters still used today. He also compiled the first Arabic dictionary. This mathematical approach to poetry is unique among world literary traditions.'
      },
      {
        speaker: 'npc',
        arabic: 'الشِّعر العَرَبيّ يَخدِم ذَاكِرَتَك — إِذَا حَفِظتَ شِعراً، حَفِظتَ اللُّغَة!',
        english: 'Arabic poetry serves your memory — if you memorize poetry, you memorize the language!',
        transliteration: "Ash-shi'r al-'arabiyy yakhdim dhaakiratik — idhaa hafizta shi'ran, hafizta al-lugha!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: صَعب — لِأَنَّ الشِّعر صَعبٌ وَلَكِن جَائِزَتُه أَعظَم جَائِزَة!',
        english: 'Learn: difficult — because poetry is difficult but its reward is the greatest reward!',
        transliteration: "Ta'allam: sa'b — li-anna ash-shi'r sa'bun wa laakin jaa'izatuhu a'zam jaa'iza!",
        teachWord: 'difficult_1'
      }
    ]
  }
);

console.log('poet-rumi trees:', data.find(n => n.id === 'poet-rumi').dialogueTrees.length);

// ============================================================
// 5. imam-muhammad — Gentle spiritual guide, tajweed
// ============================================================
const imamMuhammad = data.find(n => n.id === 'imam-muhammad');
imamMuhammad.dialogueTrees.push(
  {
    id: 'imam_tajweed',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَهلاً، يَا وَلَدي. هَل تَعرِف لِمَاذَا يُسمُّون العَرَبِيَّة "لُغَة الضَّاد"؟',
        english: 'Welcome, my child. Do you know why Arabic is called "the language of the Daad"?',
        transliteration: "Ahlan, yaa waladii. Hal ta'rif li-maadha yusammun al-'arabiyya 'lughat ad-daad'?"
      },
      {
        speaker: 'npc',
        arabic: 'حَرف الضَّاد فَريد في اللُّغَة العَرَبِيَّة — لا يوجَد في أَيِّ لُغَة أُخرى بِنَفس الطَّريقَة!',
        english: 'The letter Daad is unique to Arabic — it does not exist in any other language in the same way!',
        transliteration: "Harf ad-daad fariid fil-lugha al-'arabiyya — laa yujad fii ayyi lugha ukhraa bi-nafs at-tariqa!",
        culturalNote: 'Arabic is called "Lughat ad-Daad" (لُغَة الضَّاد) — the language of the letter Daad — because this emphatic consonant is unique to Arabic. The science of tajweed (تَجويد) preserves the exact Quranic pronunciation as taught by the Prophet, creating an unbroken oral chain of 1,400 years.'
      },
      {
        speaker: 'npc',
        arabic: 'عِلم التَّجويد يَحفَظ النُّطق القُرآنِيَّ كَمَا عَلَّمَه النَّبيّ. سِلسِلَة لا تَنقَطِع!',
        english: 'The science of tajweed preserves Quranic pronunciation as the Prophet taught it. An unbroken chain!',
        transliteration: "Ilm at-tajwiid yahfaz an-nutq al-qur'aaniyy kamaa 'allamahu an-Nabiyy. Silsila laa tanqati'!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: الصَّلاة — كَلِمَة تَربِط العَبد بِرَبِّه. خَمسَ مَرَّات كُلَّ يَوم!',
        english: 'Learn: prayer — a word that connects the servant to his Lord. Five times every day!',
        transliteration: "Ta'allam: as-salaah — kalima tarbit al-'abd bi-rabbih. Khamsa marraat kull yawm!",
        teachWord: 'salaam'
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'عَلِّمني كَلِمَات دِينِيَّة',
            english: 'Teach me religious words',
            next: 'imam_spiritual_vocab'
          },
          {
            arabic: 'مَاذَا يَعني التَّجويد؟',
            english: 'What does tajweed mean?',
            next: 'imam_tajweed_explanation'
          }
        ]
      }
    ]
  },
  {
    id: 'imam_spiritual_vocab',
    lines: [
      {
        speaker: 'npc',
        arabic: 'بِسُرور، يَا وَلَدي. الكَلِمَات الدِّينِيَّة هِيَ أَساس اللُّغَة العَرَبِيَّة.',
        english: 'With pleasure, my child. Religious words are the foundation of the Arabic language.',
        transliteration: "Bi-suruur, yaa waladii. Al-kalimaat ad-diiniyya hiya asaas al-lugha al-'arabiyya."
      },
      {
        speaker: 'npc',
        arabic: 'السَّلام عَلَيكُم — أَعظَم تَحِيَّة. نَتَمَنَّى السَّلامَة لِبَعضِنا البَعض في كُلِّ لِقَاء!',
        english: 'As-salaamu alaykum — the greatest greeting. We wish safety upon each other in every meeting!',
        transliteration: "As-salaamu 'alaykum — a'zam tahiyya. Natamanna as-salaama li-ba'dinaa al-ba'd fii kulli liqaa'!",
        teachWord: 'salaam'
      },
      {
        speaker: 'npc',
        arabic: 'الشُّكر — نِصف الإِيمَان. الشَّاكِر يَرى النِّعمَة في كُلِّ شَيء!',
        english: 'Thanks — half of faith. The grateful one sees blessing in everything!',
        transliteration: "Ash-shukr — nisf al-iimaan. Ash-shaakir yaraa an-ni'ma fii kulli shay'!",
        teachWord: 'shukran'
      },
      {
        speaker: 'npc',
        arabic: 'وَالصَّبر — أَعظَم فَضِيلَة. قَال الله: "إِنَّ اللهَ مَع الصَّابِرين".',
        english: 'And patience — the greatest virtue. God said: "Indeed God is with the patient."',
        transliteration: "Was-sabr — a'zam fadiila. Qaala Allaah: 'Inna Allaaha ma'a as-saabirin'."
      },
      {
        action: 'quiz',
        words: ['salaam', 'shukran', 'afwan', 'ma_a_salama'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'أَحسَنتَ! اللُّغَة والإِيمَان يَسيران مَعاً في الإِسلَام. تَعَلَّم اللُّغَة وَاِفهَم الدِّين أَعمَق.',
        english: 'Well done! Language and faith walk together in Islam. Learn the language and understand religion more deeply.',
        transliteration: "Ahsanta! Al-lugha wal-iimaan yasiiraani ma'an fil-islaam. Ta'allam al-lugha wa ifham ad-diin a'maq."
      }
    ]
  },
  {
    id: 'imam_tajweed_explanation',
    lines: [
      {
        speaker: 'npc',
        arabic: 'التَّجويد مِن "جَوَّد" — أَي أَحسَنَ وَأَتقَنَ. هُوَ عِلم إِتقَان النُّطق القُرآنِيّ.',
        english: 'Tajweed is from "jawwada" — meaning to perfect and excel. It is the science of mastering Quranic recitation.',
        transliteration: "At-tajwiid min 'jawwada' — ay ahsana wa atqana. Huwa 'ilm itqaan an-nutq al-qur'aaniyy."
      },
      {
        speaker: 'npc',
        arabic: 'كُلُّ حَرف لَه مَخرَج مُعَيَّن — مِن الحَلق أَو اللِّسَان أَو الشَّفَتَين. العِلم الدَّقيق!',
        english: 'Every letter has a specific point of articulation — from the throat, tongue, or lips. A precise science!',
        transliteration: "Kullu harf lahu makhraj mu'ayyan — min al-halq aw al-lisaan aw ash-shafatayn. Al-'ilm ad-daqiiq!"
      },
      {
        speaker: 'npc',
        arabic: 'المُقرِئون حَفِظوا النُّطق الأَصلِيَّ لِأَربَعَة عَشَر قَرناً — تَسَلسُل شَفَهِيّ مُذهِل!',
        english: 'The Quran reciters preserved the original pronunciation for fourteen centuries — a remarkable oral chain!',
        transliteration: "Al-muqri'uun hafizuu an-nutq al-asliyy li-arba'ata 'ashar qarnan — tasalsul shafawiyy mudhil!",
        culturalNote: '"Allah" is the only word that uses every point of Arabic articulation — from the back of the throat to the lips. Quranic reciters train for years to perfect each sound. The science of tajweed has preserved Classical Arabic pronunciation unchanged since the 7th century CE.'
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: الصَّوت — لِأَنَّ الصَّوت الجَميل يَنفُذ إِلى القَلب قَبلَ المَعنى!',
        english: 'Learn: the sound/voice — because a beautiful voice reaches the heart before meaning does!',
        transliteration: "Ta'allam: as-sawt — li-anna as-sawt al-jamiil yanfudh ilaa al-qalb qabla al-ma'naa!",
        teachWord: 'hear_1'
      }
    ]
  },
  {
    id: 'imam_gentle_wisdom',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَهلاً، يَا وَلَدي. كَيفَ حَالُكَ؟ هَل تَعَلَّمتَ كَلِمَات جَديدَة اليَوم؟',
        english: 'Welcome, my child. How are you? Have you learned new words today?',
        transliteration: "Ahlan, yaa waladii. Kayfa haaluk? Hal ta'allamta kalimaat jadiida al-yawm?"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلُّم اللُّغَة العَرَبِيَّة عِبَادَة. كُلُّ كَلِمَة تَعلَّمتَها خَطوَة نَحو فَهم القُرآن.',
        english: 'Learning Arabic is an act of worship. Every word you learn is a step toward understanding the Quran.',
        transliteration: "Ta'allum al-lugha al-'arabiyya 'ibaada. Kullu kalima ta'allamtahaa khatwa nahwa fahm al-qur'aan."
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: اليَوم — لِأَنَّ كُلَّ يَوم هُوَ فُرصَة جَديدَة لِلتَّعلُّم!',
        english: 'Learn: today — because every day is a new opportunity to learn!',
        transliteration: "Ta'allam: al-yawm — li-anna kull yawm huwa fursa jadiida lit-ta'allum!",
        teachWord: 'today_1'
      },
      {
        speaker: 'npc',
        arabic: 'وَالغَد — لِأَنَّ ما لَم تَتَعلَّمه اليَوم، فَرصَتُكَ غَداً. لا تُؤَجِّل!',
        english: 'And tomorrow — because what you did not learn today, there is your chance tomorrow. Do not delay!',
        transliteration: "Wa al-ghad — li-anna maa lam tata'allamhu al-yawm, fursat اُk ghadan. Laa tu'ajjil!",
        teachWord: 'tomorrow_1'
      }
    ]
  }
);

console.log('imam-muhammad trees:', data.find(n => n.id === 'imam-muhammad').dialogueTrees.length);

// ============================================================
// 6. guide-amira — Warm mentor, ANCHOR of the game
// ============================================================
const guideAmira = data.find(n => n.id === 'guide-amira');
guideAmira.dialogueTrees.push(
  {
    id: 'amira_progress_check',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَهلاً مُجَدَّداً! كَيفَ تَسير رِحلَتُكَ؟ أَتَعلَّمتَ كَلِمَات كَثيرَة؟',
        english: 'Welcome back! How is your journey going? Have you learned many words?',
        transliteration: "Ahlan mujaddadan! Kayfa tasir rihlatuk? Ata'allamta kalimaat kathiira?"
      },
      {
        speaker: 'npc',
        arabic: 'مُمتاز! تَذكَّر: كُلُّ كَلِمَة عَرَبِيَّة تَتَعلَّمُها هِيَ مِفتَاح لِفَهم حَضَارَة عَظيمَة!',
        english: 'Excellent! Remember: every Arabic word you learn is a key to understanding a great civilization!',
        transliteration: "Mumtaaz! Tadhakkar: kullu kalima 'arabiyya tata'allamuhaa hiya miftaah li-fahm hadaara 'aziima!"
      },
      {
        speaker: 'npc',
        arabic: 'كَلِمَة "يَلَّا"! أَكثَر كَلِمَة عَرَبِيَّة تَسمَعُها حَول العَالَم — مِن "يَا الله"!',
        english: 'The word "yalla"! The most heard Arabic word around the world — from "ya Allah" (O God)!',
        transliteration: "Kalima 'yalla'! Akthar kalima 'arabiyya tasma'uhaa hawl al-'aalam — min 'yaa Allaah'!",
        culturalNote: '"Yalla" (يَلَّا) is used worldwide by Arabic speakers to mean "let\'s go / hurry up." It comes from "yaa Allah" (يَا اللّه), an exclamation to God. It is the single most widely recognized Arabic expression across all dialects and cultures.'
      },
      {
        speaker: 'npc',
        arabic: 'يَلَّا! اِذهَب وَتَكَلَّم مَع الجَميع! كُلُّ شَخص يُعَلِّمُكَ شَيئاً جَديداً!',
        english: 'Yalla! Go and talk to everyone! Every person teaches you something new!',
        transliteration: "Yalla! Idh-hab wa takallam ma'a al-jamii'! Kull shakhs yu'allimuka shay'an jadiidan!"
      },
      {
        speaker: 'player',
        choices: [
          {
            arabic: 'مَن يَجِب أَن أَزور؟',
            english: 'Who should I visit?',
            next: 'amira_npc_hints'
          },
          {
            arabic: 'شُكراً يَا أَميرَة',
            english: 'Thank you, Amira',
            next: null
          }
        ]
      }
    ]
  },
  {
    id: 'amira_npc_hints',
    lines: [
      {
        speaker: 'npc',
        arabic: 'لَم تَزُر يوسُف بَعد؟ اِذهَب إِليه! يُعَلِّمُكَ القَواعِد والنَّحو.',
        english: 'Have you not visited Yusuf yet? Go to him! He teaches grammar and syntax.',
        transliteration: "Lam tazur Yuusuf ba'd? Idh-hab ilayh! Yu'allimuka al-qawaa'id wan-nahw."
      },
      {
        speaker: 'npc',
        arabic: 'وَفَاطِمَة التَّاجِرَة تُعَلِّمُكَ كَلِمَات السُّوق. لَيلى تُعَلِّمُكَ التَّوابِل والعُطور!',
        english: 'And Merchant Fatima teaches you market words. Layla teaches you spices and perfumes!',
        transliteration: "Wa Faatima at-taajira tu'allimuka kalimaat as-suuq. Layla tu'allimuka at-tawaabil wal-'utuur!"
      },
      {
        speaker: 'npc',
        arabic: 'عَليّ الرَّحَّالَة في المُخَيَّم البَدَوي يُعَلِّمُكَ أَفعَال السَّفَر. اِذهَب إِليه!',
        english: 'Wanderer Ali at the Bedouin camp teaches you travel verbs. Go to him!',
        transliteration: "Aliyy ar-rahhaala fil-mukhayyam al-badawiyy yu'allimuka af'aal as-safar. Idh-hab ilayh!"
      },
      {
        speaker: 'npc',
        arabic: 'وَكُلَّمَا تَعَلَّمتَ كَلِمَة جَديدَة، اِرجِع إِليَّ! أَنا هُنا دَائِماً لَك.',
        english: 'And whenever you learn a new word, come back to me! I am always here for you.',
        transliteration: "Wa kullamaa ta'allamta kalima jadiida, irji' ilayya! Ana hunaa daa'iman lak."
      }
    ]
  },
  {
    id: 'amira_greetings_lesson',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'هَل تَعرِف كُلَّ التَّحِيَّات؟ هِيَ أَهَمُّ كَلِمَات العَرَبِيَّة!',
        english: 'Do you know all the greetings? They are the most important Arabic words!',
        transliteration: "Hal ta'rif kull at-tahiyyaat? Hiya ahamm kalimaat al-'arabiyya!"
      },
      {
        speaker: 'npc',
        arabic: 'مَرحَبا — قُلناها أَوَّل مَرَّة! وَيُمكِنُكَ قَولُها لِأَيِّ شَخص في أَيِّ وَقت!',
        english: 'Marhaba — we said it the first time! And you can say it to anyone at any time!',
        transliteration: "Marhaba — qulnaahaa awwal marra! Wa yumkinuka qawluhaa li-ayyi shakhs fii ayyi waqt!",
        teachWord: 'marhaba'
      },
      {
        speaker: 'npc',
        arabic: 'وَصَبَاح الخَير في الصَّبَاح. وَمَسَاء الخَير في المَسَاء. بَسيط لَكِن مُؤَثِّر!',
        english: 'And sabah al-khayr in the morning. And masaa al-khayr in the evening. Simple but impactful!',
        transliteration: "Wa sabaaH al-khayr fis-sabaah. Wa masaa' al-khayr fil-masaa'. Basiit laakin mu'aththir!",
        teachWord: 'sabah_al_khayr'
      },
      {
        speaker: 'npc',
        arabic: 'وَأَهلاً وَسَهلاً — تَعني "أَنتَ مِن أَهلِنا وَالأَرض سَهلَة لَك"! ما أَجمَلَ اللُّغَة!',
        english: 'And ahlan wa sahlan — it means "you are of our family and the ground is easy beneath you"! What a beautiful language!',
        transliteration: "Wa ahlan wa sahlan — ta'nii 'anta min ahlinaa wal-ard sahla lak'! Maa ajmal al-lugha!",
        teachWord: 'ahlan'
      },
      {
        action: 'quiz',
        words: ['marhaba', 'sabah_al_khayr', 'ahlan', 'shukran', 'ma_a_salama'],
        quizType: 'ar-to-en'
      },
      {
        speaker: 'npc',
        arabic: 'رَائِع! الآن أَنتَ تَعرِف كَيفَ تُحَيِّي أَيَّ شَخص بِالعَرَبِيَّة. يَلَّا، اِذهَب وَجَرِّب!',
        english: 'Wonderful! Now you know how to greet anyone in Arabic. Yalla, go and try!',
        transliteration: "Raa'i'! Al-aan anta ta'rif kayfa tuhayyi ayya shakhs bil-'arabiyya. Yalla, idh-hab wa jarrib!"
      }
    ]
  },
  {
    id: 'amira_encouragement',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَنتَ تَتَقَدَّم بِسُرعَة! أَنا فَخورَة بِكَ!',
        english: 'You are progressing quickly! I am proud of you!',
        transliteration: "Anta tataqaddam bi-sur'a! Ana fakhuurah bik!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلُّم اللُّغَة العَرَبِيَّة لَيسَ سَهلاً — لَكِنَّكَ لَستَ وَحدَكَ. كُلُّ نَاس هُنا يُحِبُّونَكَ.',
        english: 'Learning Arabic is not easy — but you are not alone. Everyone here loves you.',
        transliteration: "Ta'allum al-lugha al-'arabiyya laysa sahlan — laakinnak lasta wahdak. Kull naas hunaa yuhibbuunak."
      },
      {
        speaker: 'npc',
        arabic: 'كُلُّ يَوم قَليلاً — هَذا سِرُّ النَّجاح. لا تَتَعجَّل وَلا تَستَسلِم!',
        english: 'A little every day — that is the secret of success. Do not rush and do not give up!',
        transliteration: "Kull yawm qaliiilan — haadha sirr an-najaah. Laa tata'ajjal wa laa tastasлim!"
      },
      {
        speaker: 'npc',
        arabic: 'تَعَلَّم: صَعب — لِأَنَّكَ تَعرِف بالفِعل أَنَّ التَّعلُّم صَعب. لَكِن أَنتَ تَفعَلُه!',
        english: 'Learn: difficult — because you already know that learning is hard. But you are doing it!',
        transliteration: "Ta'allam: sa'b — li-annaka ta'rif bil-fi'l anna at-ta'allum sa'b. Laakin anta taf'aluh!",
        teachWord: 'difficult_1'
      }
    ]
  }
);

console.log('guide-amira trees:', data.find(n => n.id === 'guide-amira').dialogueTrees.length);

// ============================================================
// Write the file
// ============================================================
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('\nFile written successfully!');

// Final counts
const targets2 = ['blacksmith-daud', 'vizier-abbas', 'princess-aisha', 'poet-rumi', 'imam-muhammad', 'guide-amira'];
targets2.forEach(id => {
  const n = data.find(x => x.id === id);
  const trees = n.dialogueTrees.length;
  const lines = n.dialogueTrees.reduce((s, t) => s + t.lines.filter(l => l.speaker || l.arabic).length, 0);
  const tw = n.dialogueTrees.reduce((s, t) => s + t.lines.filter(l => l.teachWord).length, 0);
  const cn = n.dialogueTrees.reduce((s, t) => s + t.lines.filter(l => l.culturalNote).length, 0);
  console.log(`${id}: trees=${trees} lines=${lines} teachWords=${tw} culturalNotes=${cn}`);
});
