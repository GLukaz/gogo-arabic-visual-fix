/**
 * npcDialogueExpansion.js — Phase 89: Expanded NPC Dialogue & Quest Storylines
 *
 * Additional dialogue trees for 24 main faction NPCs, triggered by friendship level.
 * Three tiers:
 *   - friendlyDialogues:  unlocked at friendship >= 50
 *   - closeDialogues:     unlocked at friendship >= 75
 *   - secretDialogues:    unlocked at friendship >= 90
 *
 * Each dialogue teaches a vocabulary word and reveals character depth.
 */

export const NPC_DIALOGUE_EXPANSION = Object.freeze({

  // ═══════════════════════════════════════════════════════════════════════════
  // SCHOLARS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  'scholar-yusuf': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'personal_history',
        lines: [
          { speaker: 'scholar-yusuf', arabic: 'أَنتَ طالِب مُجتَهِد. أُريدُ أَن أَحكيلَك عَن جَدّي', english: 'You are a diligent student. I want to tell you about my grandfather.', transliteration: 'anta taalib mujtahid. uriidu an ahkiilak an jaddii' },
          { speaker: 'scholar-yusuf', arabic: 'كان عالِمًا كَبيرًا. عَلَّمَني أَنَّ الكِتاب خَيرُ جَليس', english: 'He was a great scholar. He taught me that a book is the best companion.', transliteration: 'kaana aaliman kabiiran. allamanii anna al-kitaab khayru jaliis' },
          { speaker: 'player', arabic: 'ما مَعنى كَلِمَة "جَليس"؟', english: 'What does the word "jaliis" mean?', transliteration: 'maa maana kalimat "jaliis"?' },
          { speaker: 'scholar-yusuf', arabic: 'جَليس — يَعني صاحِب أَو رَفيق. الكِتاب جَليسُك الدّائِم', english: 'Jaliis — it means companion or friend. The book is your permanent companion.', transliteration: 'jaliis — yaanii saahib aw rafiiq. al-kitaab jaliisuka ad-daa\'im' },
        ],
        teachWord: 'kitab',
      },
      {
        trigger: 'friendship_50',
        topic: 'teaching_philosophy',
        lines: [
          { speaker: 'scholar-yusuf', arabic: 'هَل تَعرِف لِماذا أُعَلِّم؟', english: 'Do you know why I teach?', transliteration: 'hal taarif limaadha uallim?' },
          { speaker: 'player', arabic: 'لِماذا يا شَيخ؟', english: 'Why, teacher?', transliteration: 'limaadha ya shaykh?' },
          { speaker: 'scholar-yusuf', arabic: 'لِأَنَّ المَعرِفَة مِثل الشَّمعَة — لا تَنقُص إِذا أَعطَيتَ مِنها', english: 'Because knowledge is like a candle — it does not diminish when you share it.', transliteration: 'li-anna al-maarifa mithl ash-shamaa — laa tanqus idhaa aatayta minhaa' },
          { speaker: 'scholar-yusuf', arabic: 'مَعرِفَة — عِلم عَميق. تَعَلَّمها جَيِّدًا', english: 'Maarifa — deep knowledge. Learn it well.', transliteration: 'maarifa — ilm amiiq. taallimhaa jayyidan' },
        ],
        teachWord: 'know_1',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'lost_library',
        lines: [
          { speaker: 'scholar-yusuf', arabic: 'عِندي سِرّ لَم أُخبِر بِهِ أَحَدًا', english: 'I have a secret I have told no one.', transliteration: 'indii sirr lam ukhbir bihi ahadan' },
          { speaker: 'scholar-yusuf', arabic: 'مَكتَبَة عائِلَتي اِحتَرَقَت. خَسِرتُ كُلَّ شَيء', english: 'My family library burned down. I lost everything.', transliteration: 'maktabat aa\'ilatii ihtaraqat. khasirtu kulla shay\'' },
          { speaker: 'player', arabic: 'هَذا حَزين جِدًّا يا شَيخ', english: 'That is very sad, teacher.', transliteration: 'haadha haziinun jiddan ya shaykh' },
          { speaker: 'scholar-yusuf', arabic: 'نَعَم. بَسّ الحِكمَة باقِيَة في قَلبي. الحِكمَة لا تَحتَرِق', english: 'Yes. But the wisdom remains in my heart. Wisdom does not burn.', transliteration: 'naam. bass al-hikma baaqiya fii qalbii. al-hikma laa tahtariq' },
        ],
        teachWord: 'heart_1',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'hidden_vault',
        lines: [
          { speaker: 'scholar-yusuf', arabic: 'تَعال مَعي. سَأُريكَ شَيئًا لَم يَرَهُ أَحَد', english: 'Come with me. I will show you something no one has seen.', transliteration: 'taal maaii. sa-uriika shayan lam yarahu ahad' },
          { speaker: 'scholar-yusuf', arabic: 'تَحت المَكتَبَة — قَبو سِرّي. فيهِ مَخطوطات قَبل الإِسلام', english: 'Beneath the library — a secret vault. It holds pre-Islamic manuscripts.', transliteration: 'taht al-maktaba — qabw sirriy. fiihi makhtootaat qabl al-islaam' },
          { speaker: 'player', arabic: 'يا سَلام! هَذا كَنز!', english: 'Amazing! This is a treasure!', transliteration: 'ya salaam! haadha kanz!' },
          { speaker: 'scholar-yusuf', arabic: 'كَنز — نَعَم. الكَلِمات هِيَ الكَنز الحَقيقي', english: 'Kanz — yes. Words are the true treasure.', transliteration: 'kanz — naam. al-kalimaat hiya al-kanz al-haqiiqii' },
        ],
        teachWord: 'learn_1',
      },
    ],
  },

  'librarian-ibrahim': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'counting_stories',
        lines: [
          { speaker: 'librarian-ibrahim', arabic: 'تَعرِف — أَنا تَعَلَّمت العَدّ قَبل القِراءَة', english: 'You know — I learned to count before I learned to read.', transliteration: 'taarif — ana taallamt al-add qabl al-qiraa\'a' },
          { speaker: 'librarian-ibrahim', arabic: 'كُنت أَعُدّ الكُتُب. واحِد، اِثنان، ثلاثة... آلاف', english: 'I used to count the books. One, two, three... thousands.', transliteration: 'kuntu aaudd al-kutub. waahid, ithnaan, thalaatha... aalaf' },
          { speaker: 'player', arabic: 'كَم كِتاب في المَكتَبَة؟', english: 'How many books are in the library?', transliteration: 'kam kitaab fil-maktaba?' },
          { speaker: 'librarian-ibrahim', arabic: 'أَكثَر مِن ثلاثة آلاف. كُلّ كِتاب صَديق', english: 'More than three thousand. Every book is a friend.', transliteration: 'akthar min thalaathat aalaf. kull kitaab sadiiq' },
        ],
        teachWord: 'num_3',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'hidden_poetry',
        lines: [
          { speaker: 'librarian-ibrahim', arabic: 'عِندي سِرّ... أَنا أَكتُب شِعر بِاللَّيل', english: 'I have a secret... I write poetry at night.', transliteration: 'indii sirr... ana aktub shir bil-layl' },
          { speaker: 'player', arabic: 'حَقًّا؟ هَل يُمكِنُني أَن أَسمَع؟', english: 'Really? May I hear some?', transliteration: 'haqqan? hal yumkinunii an asma?' },
          { speaker: 'librarian-ibrahim', arabic: 'لا أَحَد سَمِعَها قَبلَك. "الكَلِمات نوافِذ — وَالقَلب بَيت"', english: 'No one has heard them before you. "Words are windows — and the heart is a home."', transliteration: 'laa ahad samiahaa qablak. "al-kalimaat nawaafidh — wal-qalb bayt"' },
        ],
        teachWord: 'write_1',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'dangerous_books',
        lines: [
          { speaker: 'librarian-ibrahim', arabic: 'في القِسم المَمنوع — كُتُب خَطيرَة', english: 'In the restricted section — there are dangerous books.', transliteration: 'fil-qism al-mamnuu — kutub khatiira' },
          { speaker: 'librarian-ibrahim', arabic: 'فيها وَصَفات كيمياء قَديمَة. مَن يَقرَأها يَتَحَمَّل المَسؤولِيَّة', english: 'They contain ancient alchemy recipes. Whoever reads them bears the responsibility.', transliteration: 'fiihaa wasafaat kiimyaa\' qadiima. man yaqra\'uhaa yatahammal al-mas\'uuliyya' },
          { speaker: 'librarian-ibrahim', arabic: 'أُعطيكَ المِفتاح. اِستَخدِمهُ بِحِكمَة', english: 'I give you the key. Use it with wisdom.', transliteration: 'utiika al-miftaah. istakhdimhu bi-hikma' },
        ],
        teachWord: 'open_1',
      },
    ],
  },

  'scribe-amina': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'mothers_art',
        lines: [
          { speaker: 'scribe-amina', arabic: 'أُمّي كانَت أَفضَل خَطّاطَة في المَملَكَة', english: 'My mother was the best calligrapher in the kingdom.', transliteration: 'ummii kaanat afdal khattaata fil-mamlaka' },
          { speaker: 'scribe-amina', arabic: 'عَلَّمَتني أَنَّ كُلّ حَرف لَهُ روح', english: 'She taught me that every letter has a soul.', transliteration: 'allamatnii anna kull harf lahu ruuh' },
          { speaker: 'player', arabic: 'هَذا جَميل جِدًّا', english: 'That is very beautiful.', transliteration: 'haadha jamiilun jiddan' },
          { speaker: 'scribe-amina', arabic: 'جَميل — نَعَم. الجَمال في التَّفاصيل', english: 'Jamiil — yes. Beauty is in the details.', transliteration: 'jamiil — naam. al-jamaal fit-tafaasiil' },
        ],
        teachWord: 'beautiful_1',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'forged_documents',
        lines: [
          { speaker: 'scribe-amina', arabic: 'غادَرت القَصر لِسَبَب خَطير', english: 'I left the palace for a serious reason.', transliteration: 'ghaadart al-qasr li-sabab khatiir' },
          { speaker: 'scribe-amina', arabic: 'وَجَدت وَثائِق مُزَوَّرَة. غَيَّروا التّاريخ!', english: 'I found forged documents. They changed history!', transliteration: 'wajadt wathaa\'iq muzawwara. ghayyaruu at-taariikh!' },
          { speaker: 'player', arabic: 'هَل عِندَكِ الوَثائِق الأَصلِيَّة؟', english: 'Do you have the original documents?', transliteration: 'hal indaki al-wathaa\'iq al-asliyya?' },
          { speaker: 'scribe-amina', arabic: 'نَعَم. مَحفوظَة في صُندوق مُقفَل. الحَقيقَة لا تَموت', english: 'Yes. Preserved in a locked chest. The truth does not die.', transliteration: 'naam. mahfuuza fii sunduuq muqfal. al-haqiiqa laa tamuut' },
        ],
        teachWord: 'close_1',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'moonlight_messages',
        lines: [
          { speaker: 'scribe-amina', arabic: 'أُمّي اِختَرَعَت طَريقَة سِرِّيَّة لِلكِتابَة', english: 'My mother invented a secret method of writing.', transliteration: 'ummii ikhtaraat tariiqa sirriyya lil-kitaaba' },
          { speaker: 'scribe-amina', arabic: 'الحِبر يَظهَر فَقَط تَحت ضَوء القَمَر', english: 'The ink appears only under moonlight.', transliteration: 'al-hibr yazhhar faqat taht daw\' al-qamar' },
          { speaker: 'scribe-amina', arabic: 'خُذ — هَذا القَلَم يَكتُب بِالحِبر السِّرّي', english: 'Take this — this pen writes with the secret ink.', transliteration: 'khudh — haadha al-qalam yaktub bil-hibr as-sirriy' },
        ],
        teachWord: 'qalam',
      },
    ],
  },

  'astronomer-zain': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'one_eyed_star',
        lines: [
          { speaker: 'astronomer-zain', arabic: 'فَقَدت عَيني في عاصِفَة رَملِيَّة وَأَنا صَغير', english: 'I lost my eye in a sandstorm when I was young.', transliteration: 'faqadtu aynii fii aasifa ramliyya wa ana saghiir' },
          { speaker: 'astronomer-zain', arabic: 'بَسّ العَين الباقِيَة أَصبَحَت أَقوى — أَرى نُجوم لا يَراها أَحَد', english: 'But the remaining eye became stronger — I see stars no one else sees.', transliteration: 'bass al-ayn al-baaqiya asbahat aqwaa — araa nujuum laa yaraahaa ahad' },
          { speaker: 'player', arabic: 'أَيّ نَجمَة هِيَ المُفَضَّلَة عِندَك؟', english: 'Which star is your favorite?', transliteration: 'ayy najma hiya al-mufaddala indak?' },
          { speaker: 'astronomer-zain', arabic: 'نَجمَة الشِّمال. هِيَ دائِمًا ثابِتَة — مِثل الحَقيقَة', english: 'The North Star. It is always steady — like truth.', transliteration: 'najmat ash-shimaal. hiya daa\'iman thaabita — mithl al-haqiiqa' },
        ],
        teachWord: 'star_w16',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'hidden_city',
        lines: [
          { speaker: 'astronomer-zain', arabic: 'خَرائِطي النَّجمِيَّة تَدُلّ عَلى شَيء مُذهِل', english: 'My star charts point to something astonishing.', transliteration: 'kharaa\'itii an-najmiyya tadull alaa shay\' mudhhil' },
          { speaker: 'astronomer-zain', arabic: 'مَدينَة مَدفونَة في الصَّحراء. النُّجوم تُشير إِلَيها', english: 'A city buried in the desert. The stars point to it.', transliteration: 'madiina madfuuna fis-sahraa\'. an-nujuum tushiir ilayhaa' },
          { speaker: 'player', arabic: 'هَل يُمكِنُنا أَن نَذهَب؟', english: 'Can we go there?', transliteration: 'hal yumkinunaa an nadhhab?' },
          { speaker: 'astronomer-zain', arabic: 'رُبَّما... لَكِن نَحتاج لِخَريطَة كامِلَة أَوَّلًا', english: 'Perhaps... but we need a complete map first.', transliteration: 'rubbamaa... laakin nahtaaj li-khariita kaamila awwalan' },
        ],
        teachWord: 'moon_w15',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'spring_star',
        lines: [
          { speaker: 'astronomer-zain', arabic: 'اِكتَشَفت نَجمَة جَديدَة! تَظهَر فَقَط في الرَّبيع', english: 'I discovered a new star! It appears only in spring.', transliteration: 'iktashaftu najma jadiida! tazhhar faqat fir-rabii' },
          { speaker: 'astronomer-zain', arabic: 'سَمَّيتُها "نور المَعرِفَة". خُذ — هَذا الأُسطُرلاب لَكَ', english: 'I named it "Light of Knowledge." Take this — this astrolabe is yours.', transliteration: 'sammaytuhaa "nuur al-maarifa". khudh — haadha al-usturlaab lak' },
        ],
        teachWord: 'sky_w22',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MERCHANTS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  'merchant-fatima': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'fathers_legacy',
        lines: [
          { speaker: 'merchant-fatima', arabic: 'أَبي مَرِض وَأَنا عُمري سِتّاشَر سَنَة', english: 'My father fell ill when I was sixteen years old.', transliteration: 'abii marid wa ana umrii sittaashar sana' },
          { speaker: 'merchant-fatima', arabic: 'أَخَذت الدُّكّان وَبَدَأت مِن الصِّفر', english: 'I took the shop and started from zero.', transliteration: 'akhadhtu ad-dukkaan wa bada\'tu min as-sifr' },
          { speaker: 'player', arabic: 'أَنتِ شُجاعَة يا فاطِمَة', english: 'You are brave, Fatima.', transliteration: 'anti shujaaaa ya faatima' },
          { speaker: 'merchant-fatima', arabic: 'شُكرًا. الشَّجاعَة — تَعني أَن تَخاف بَسّ تِكمِل', english: 'Thank you. Courage — it means to be afraid but to keep going.', transliteration: 'shukran. ash-shajaaaa — taanii an takhaaf bass tikmil' },
        ],
        teachWord: 'shukran',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'caravan_dream',
        lines: [
          { speaker: 'merchant-fatima', arabic: 'حُلمي الكَبير — أَقود قافِلَة عَبر الصَّحراء', english: 'My big dream — to lead a caravan across the desert.', transliteration: 'hulmii al-kabiir — aquud qaafila abr as-sahraa\'' },
          { speaker: 'merchant-fatima', arabic: 'بَسّ الدُّكّان يِحتاجني. والنّاس يِحتاجوني', english: 'But the shop needs me. And the people need me.', transliteration: 'bass ad-dukkaan yihtaajnii. wan-naas yihtaajuunii' },
          { speaker: 'player', arabic: 'يِمكِن نِروح سَوا يَوم', english: 'Maybe we will go together one day.', transliteration: 'yimkin niruuh sawa yawm' },
          { speaker: 'merchant-fatima', arabic: 'إِن شاء الله! صَديق مِثلَك — الطَّريق أَحلى', english: 'God willing! A friend like you — the road is sweeter.', transliteration: 'in shaa\' allaah! sadiiq mithlak — at-tariiq ahlaa' },
        ],
        teachWord: 'inshallah',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'secret_route',
        lines: [
          { speaker: 'merchant-fatima', arabic: 'عِندي خَريطَة سِرِّيَّة — طَريق تِجاري يِتجاوَز مَمَرّ الجَبَل', english: 'I have a secret map — a trade route that bypasses the Mountain Pass.', transliteration: 'indii khariita sirriyya — tariiq tijaariy yitjaawaz mamarr al-jabal' },
          { speaker: 'merchant-fatima', arabic: 'أَبي وَجَدَها قَبل ما يِمرَض. ما حَكيت لِحَدا', english: 'My father found it before he fell ill. I have told no one.', transliteration: 'abii wajadahaa qabl maa yimrad. maa hakiit li-hada' },
          { speaker: 'merchant-fatima', arabic: 'خُذها. أَنتَ تِستاهِل', english: 'Take it. You deserve it.', transliteration: 'khudhhaa. anta tistaahil' },
        ],
        teachWord: 'market_w29',
      },
    ],
  },

  'trader-hassan': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'merchant_code',
        lines: [
          { speaker: 'trader-hassan', arabic: 'في السّوق — الكَلِمَة أَغلى مِن الذَّهَب', english: 'In the marketplace — a word is worth more than gold.', transliteration: 'fis-suuq — al-kalima aghlaa min adh-dhahab' },
          { speaker: 'trader-hassan', arabic: 'إِذا كِذِبت مَرَّة — ما حَدا بِيشتِري مِنَّك', english: 'If you lie once — no one will buy from you again.', transliteration: 'idha kidhibt marra — maa hada biyishtiri minnak' },
          { speaker: 'player', arabic: 'هَذا صَحيح يا حَسَن', english: 'That is true, Hassan.', transliteration: 'haadha sahiih ya hasan' },
          { speaker: 'trader-hassan', arabic: 'صَحيح — كَلِمَة مُهِمَّة. تَعَلَّمها كويِّس', english: 'Sahiih — an important word. Learn it well.', transliteration: 'sahiih — kalima muhimma. taallimhaa kuwayyis' },
        ],
        teachWord: 'money_w30',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'betrayal_story',
        lines: [
          { speaker: 'trader-hassan', arabic: 'شَريكي القَديم سَرَقني. أَخَذ كُلّ شَيء', english: 'My old partner robbed me. He took everything.', transliteration: 'shariikii al-qadiim saraqnii. akhadh kull shay\'' },
          { speaker: 'trader-hassan', arabic: 'بَسّ تَعَلَّمت دَرس — الإِنسان أَهَمّ مِن المال', english: 'But I learned a lesson — people are more important than money.', transliteration: 'bass taallamt dars — al-insaan ahamm min al-maal' },
          { speaker: 'player', arabic: 'كَيف بَنيت كُلّ شَيء مِن جَديد؟', english: 'How did you rebuild everything?', transliteration: 'kayf banayt kull shay\' min jadiid?' },
          { speaker: 'trader-hassan', arabic: 'بِالصَّبر وَالعَمَل. الصَّبر مِفتاح الفَرَج', english: 'With patience and work. Patience is the key to relief.', transliteration: 'bis-sabr wal-amal. as-sabr miftaah al-faraj' },
        ],
        teachWord: 'work_1',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'viziers_favor',
        lines: [
          { speaker: 'trader-hassan', arabic: 'مَرَّة أَنقَذت الوَزير مِن حَريقَة في السّوق', english: 'Once I saved the Vizier from a fire in the marketplace.', transliteration: 'marra anqadht al-waziir min hariiqa fis-suuq' },
          { speaker: 'trader-hassan', arabic: 'وَعَدَني بِخِدمَة — لَم أَطلُبها بَعد', english: 'He promised me a favor — I have not asked for it yet.', transliteration: 'waadanii bi-khidma — lam atlubhaa baad' },
          { speaker: 'trader-hassan', arabic: 'رُبَّما يَوم نِحتاجها سَوا', english: 'Perhaps one day we will need it together.', transliteration: 'rubbamaa yawm nihtaajhaa sawaa' },
        ],
        teachWord: 'help_1',
      },
    ],
  },

  'spice-seller-layla': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'grandmothers_recipes',
        lines: [
          { speaker: 'spice-seller-layla', arabic: 'جَدَّتي كانَت تَعرِف كُلّ بَهار في العالَم', english: 'My grandmother knew every spice in the world.', transliteration: 'jaddatii kaanat taarif kull bahaar fil-aalam' },
          { speaker: 'spice-seller-layla', arabic: 'كانَت تِحِبّ القَهوَة مَع هال وَزَعفَران', english: 'She loved coffee with cardamom and saffron.', transliteration: 'kaanat tihibb al-qahwa maa haal wa zafaraan' },
          { speaker: 'player', arabic: 'يُمكِنُني أَن أَتَذَوَّق؟', english: 'May I taste?', transliteration: 'yumkinunii an atadhawwaq?' },
          { speaker: 'spice-seller-layla', arabic: 'طَبعًا! القَهوَة — أَحلى شَيء مَع صَديق', english: 'Of course! Coffee — the sweetest thing with a friend.', transliteration: 'taban! al-qahwa — ahlaa shay\' maa sadiiq' },
        ],
        teachWord: 'coffee_1',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'shipwreck',
        lines: [
          { speaker: 'spice-seller-layla', arabic: 'سَفينَتي غَرِقَت قُرب المِيناء', english: 'My ship sank near the port.', transliteration: 'safiinatii ghariqat qurb al-miinaa\'' },
          { speaker: 'spice-seller-layla', arabic: 'خَسِرت كُلّ البَهارات — بَسّ أَنقَذت كِتاب جَدَّتي', english: 'I lost all the spices — but I saved my grandmother\'s book.', transliteration: 'khasirt kull al-bahaaraat — bass anqadht kitaab jaddatii' },
          { speaker: 'spice-seller-layla', arabic: 'هَذا الكِتاب — حَياة كامِلَة في صَفَحات', english: 'This book — a whole life in pages.', transliteration: 'haadha al-kitaab — hayaah kaamila fii safahaat' },
        ],
        teachWord: 'water_1',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'healing_recipes',
        lines: [
          { speaker: 'spice-seller-layla', arabic: 'في كِتاب جَدَّتي وَصَفات شِفاء سِرِّيَّة', english: 'In my grandmother\'s book there are secret healing recipes.', transliteration: 'fii kitaab jaddatii wasafaat shifaa\' sirriyya' },
          { speaker: 'spice-seller-layla', arabic: 'بَهارات تِشفي أَمراض ما لَها عِلاج', english: 'Spices that cure diseases with no remedy.', transliteration: 'bahaaraat tishfii amraad maa lahaa ilaaj' },
          { speaker: 'spice-seller-layla', arabic: 'خُذ هَذِهِ الوَصفَة. اِستَخدِمها بِعِناية', english: 'Take this recipe. Use it with care.', transliteration: 'khudh haadhihi al-wasfa. istakhdimhaa bi-inaaya' },
        ],
        teachWord: 'honey_1',
      },
    ],
  },

  'carpet-seller-jamal': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'colors_of_life',
        lines: [
          { speaker: 'carpet-seller-jamal', arabic: 'كُلّ لَون في السَّجّاد لَهُ مَعنى', english: 'Every color in the carpet has a meaning.', transliteration: 'kull lawn fis-sajjaad lahu maanaa' },
          { speaker: 'carpet-seller-jamal', arabic: 'الأَحمَر — حُبّ. الأَزرَق — سَلام. الأَخضَر — أَمَل', english: 'Red — love. Blue — peace. Green — hope.', transliteration: 'al-ahmar — hubb. al-azraq — salaam. al-akhdar — amal' },
          { speaker: 'player', arabic: 'وَالأَبيَض؟', english: 'And white?', transliteration: 'wal-abyad?' },
          { speaker: 'carpet-seller-jamal', arabic: 'الأَبيَض — بِداية جَديدَة. مِثل صَفحَة فارِغَة', english: 'White — a new beginning. Like a blank page.', transliteration: 'al-abyad — bidaaya jadiida. mithl safha faarigha' },
        ],
        teachWord: 'color_red',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'hidden_art',
        lines: [
          { speaker: 'carpet-seller-jamal', arabic: 'أَبي أَجبَرَني عَلى تَرك الرَّسم', english: 'My father forced me to abandon painting.', transliteration: 'abii ajbaraniii alaa tark ar-rasm' },
          { speaker: 'carpet-seller-jamal', arabic: 'بَسّ أَنا بَعدني أَرسُم بِاللَّيل. سِرًّا', english: 'But I still paint at night. Secretly.', transliteration: 'bass ana baadnii arsum bil-layl. sirran' },
          { speaker: 'player', arabic: 'لَوحاتَك جَميلَة؟', english: 'Your paintings are beautiful?', transliteration: 'lawhaatak jamiila?' },
          { speaker: 'carpet-seller-jamal', arabic: 'تَعال بَعد نُصّ اللَّيل وَشوف بِنَفسَك', english: 'Come after midnight and see for yourself.', transliteration: 'taal baad nuss al-layl wa shuuf bi-nafsak' },
        ],
        teachWord: 'color_blue',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'djinn_blessing',
        lines: [
          { speaker: 'carpet-seller-jamal', arabic: 'مَرَّة بِعت سَجّادَة لِشَخص غَريب', english: 'Once I sold a carpet to a strange person.', transliteration: 'marra bit sajjaada li-shakhs ghariib' },
          { speaker: 'carpet-seller-jamal', arabic: 'كان جِنّي! أَعطاني بَرَكَة — كُلّ سَجّاد أَلمِسُه يُصبِح أَجمَل', english: 'He was a djinn! He gave me a blessing — every carpet I touch becomes more beautiful.', transliteration: 'kaan jinniy! aataanii baraka — kull sajjaad almisuhu yusbih ajmal' },
          { speaker: 'carpet-seller-jamal', arabic: 'هَل تُصَدِّق؟ شوف بِعينَك', english: 'Do you believe it? See for yourself.', transliteration: 'hal tusaddiq? shuuf bi-aynak' },
        ],
        teachWord: 'carpet_w38',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTISANS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  'blacksmith-daud': {
    friendlyDialogues: [
      {
        trigger: 'friendship_50',
        topic: 'iron_language',
        lines: [
          { speaker: 'blacksmith-daud', arabic: 'الحَديد لَهُ صَوت. كُلّ ضَربَة تَحكي', english: 'Iron has a voice. Every strike speaks.', transliteration: 'al-hadiid lahu sawt. kull darba tahkii' },
          { speaker: 'blacksmith-daud', arabic: 'إِسمَع — هذا صَوت الحَديد القَوي', english: 'Listen — this is the sound of strong iron.', transliteration: 'isma — haadha sawt al-hadiid al-qawiy' },
          { speaker: 'player', arabic: 'أَنا أَسمَع الفَرق!', english: 'I hear the difference!', transliteration: 'ana asma al-farq!' },
          { speaker: 'blacksmith-daud', arabic: 'قَوي — كَلِمَة مُهِمَّة. الحَديد القَوي لا يَنكَسِر', english: 'Qawiy — an important word. Strong iron does not break.', transliteration: 'qawiy — kalima muhimma. al-hadiid al-qawiy laa yankasir' },
        ],
        teachWord: 'strong_1',
      },
    ],
    closeDialogues: [
      {
        trigger: 'friendship_75',
        topic: 'wife_memorial',
        lines: [
          { speaker: 'blacksmith-daud', arabic: 'زَوجَتي ماتَت قَبل سَنَوات', english: 'My wife died years ago.', transliteration: 'zawjatii maatat qabl sanawaat' },
          { speaker: 'blacksmith-daud', arabic: 'كُلّ يَوم أَصنَع شَيء لَها. حَتّى الآن', english: 'Every day I make something for her. Even now.', transliteration: 'kull yawm asna shay lahaa. hattaa al-aan' },
          { speaker: 'player', arabic: 'الحُبّ أَقوى مِن المَوت', english: 'Love is stronger than death.', transliteration: 'al-hubb aqwaa min al-mawt' },
          { speaker: 'blacksmith-daud', arabic: 'نَعَم. أَقوى مِن الحَديد', english: 'Yes. Stronger than iron.', transliteration: 'naam. aqwaa min al-hadiid' },
        ],
        teachWord: 'gold_w36',
      },
    ],
    secretDialogues: [
      {
        trigger: 'friendship_90',
        topic: 'meteor_iron',
        lines: [
          { speaker: 'blacksmith-daud', arabic: 'الحَديد الّذي أَشتَغِل بِه — مِش عادي', english: 'The iron I work with — it is not ordinary.', transliteration: 'al-hadiid alladhii ashtaghil bih — mish aadiy' },
          { speaker: 'blacksmith-daud', arabic: 'سَقَط مِن السَّماء. نَيزَك. حَديد السَّماء', english: 'It fell from the sky. A meteorite. Sky iron.', transliteration: 'saqat min as-samaa\'. nayzak. hadiid as-samaa\'' },
          { speaker: 'blacksmith-daud', arabic: 'خُذ هَذا السَّيف. مِن حَديد السَّماء. لا يَنكَسِر أَبَدًا', english: 'Take this blade. From sky iron. It will never break.', transliteration: 'khudh haadha as-sayf. min hadiid as-samaa\'. laa yankasir abadan' },
        ],
        teachWord: 'silver_w37',
      },
    ],
  },

  'weaver-zahra': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'freedom_story', lines: [
        { speaker: 'weaver-zahra', arabic: 'هَرَبت مِن زَواج مُرَتَّب وَعُمري سَبعَتَاشَر', english: 'I ran away from an arranged marriage when I was seventeen.', transliteration: 'harabt min zawaaj murattab wa umrii sabataashar' },
        { speaker: 'weaver-zahra', arabic: 'جيت لِلسّوق بِمِنسَج وَاحِد. بَنيت كُلّ شَيء بِإيدي', english: 'I came to the market with one loom. I built everything with my own hands.', transliteration: 'jiit lis-suuq bi-minsaj waahid. banayt kull shay bi-iidiy' },
        { speaker: 'player', arabic: 'أَنتِ قَوِيَّة جِدًّا', english: 'You are very strong.', transliteration: 'anti qawiyya jiddan' },
        { speaker: 'weaver-zahra', arabic: 'الحُرِّيَّة أَحلى مِن الذَّهَب. تَذَكَّر هذا', english: 'Freedom is sweeter than gold. Remember that.', transliteration: 'al-hurriyya ahlaa min adh-dhahab. tadhakkar haadha' },
      ], teachWord: 'thobe_w1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'coded_patterns', lines: [
        { speaker: 'weaver-zahra', arabic: 'في نَقشاتي رَسائِل مَخفِيَّة', english: 'In my patterns there are hidden messages.', transliteration: 'fii naqshaatii rasaa\'il makhfiyya' },
        { speaker: 'weaver-zahra', arabic: 'البَدو كانوا يِستَخدِموها لِلتَّواصُل سِرًّا', english: 'The Bedouin used to use them to communicate secretly.', transliteration: 'al-badu kaanuu yistakhdmuuhaa lit-tawaasul sirran' },
        { speaker: 'player', arabic: 'عَلِّميني!', english: 'Teach me!', transliteration: 'allimiinii!' },
        { speaker: 'weaver-zahra', arabic: 'هَذا الخَطّ الأَحمَر يَعني "خَطَر". وَالأَزرَق يَعني "أَمان"', english: 'This red line means "danger." And the blue means "safety."', transliteration: 'haadha al-khatt al-ahmar yaanii "khatar". wal-azraq yaanii "amaan"' },
      ], teachWord: 'scarf_w7' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'hidden_spring', lines: [
        { speaker: 'weaver-zahra', arabic: 'أَقدَم سَجّاد عِندي فيه خَريطَة', english: 'My oldest tapestry contains a map.', transliteration: 'aqdam sajjaad indii fiih khariita' },
        { speaker: 'weaver-zahra', arabic: 'خَريطَة لِنَبع مَخفي في الصَّحراء. ماء نَقي', english: 'A map to a hidden spring in the desert. Pure water.', transliteration: 'khariita li-naba makhfiy fis-sahraa\'. maa\' naqiy' },
        { speaker: 'weaver-zahra', arabic: 'هَذا المَكان — مَكان مُقَدَّس لِلبَدو', english: 'This place — it is sacred to the Bedouin.', transliteration: 'haadha al-makaan — makaan muqaddas lil-badu' },
      ], teachWord: 'cloth_w42' },
    ],
  },

  'baker-yasmin': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'bread_love', lines: [
        { speaker: 'baker-yasmin', arabic: 'الخُبز مِش أَكل بَسّ — الخُبز حُبّ', english: 'Bread is not just food — bread is love.', transliteration: 'al-khubz mish akl bass — al-khubz hubb' },
        { speaker: 'baker-yasmin', arabic: 'أُمّي عَلَّمَتني إِنّ كُلّ رَغيف صَلاة', english: 'My mother taught me that every loaf is a prayer.', transliteration: 'ummii allamatnii inn kull raghiif salaah' },
        { speaker: 'player', arabic: 'خُبزِك لَذيذ جِدًّا!', english: 'Your bread is very delicious!', transliteration: 'khubzik ladhiidh jiddan!' },
        { speaker: 'baker-yasmin', arabic: 'لَذيذ — كَلِمَة حَلوَة. مِثل الخُبز', english: 'Ladhiidh — a sweet word. Like bread.', transliteration: 'ladhiidh — kalima hilwa. mithl al-khubz' },
      ], teachWord: 'bread_1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'stolen_recipe', lines: [
        { speaker: 'baker-yasmin', arabic: 'أَخي الكَبير سَرَق وَصفَة أُمّي وَباعَها', english: 'My older brother stole my mother\'s recipe and sold it.', transliteration: 'akhii al-kabiir saraq wasfat ummii wa baaahaa' },
        { speaker: 'baker-yasmin', arabic: 'الوَصفَة فيها سِرّ — خُبز يِبقى شَهر بِدون ما يِنشَف', english: 'The recipe has a secret — bread that lasts a month without drying.', transliteration: 'al-wasfa fiihaa sirr — khubz yibqaa shahr biduum maa yinshaf' },
        { speaker: 'player', arabic: 'لازِم نِرجِعها!', english: 'We must get it back!', transliteration: 'laazim nirjihaa!' },
        { speaker: 'baker-yasmin', arabic: 'إِن شاء الله. بِمُساعَدَتَك', english: 'God willing. With your help.', transliteration: 'in shaa\' allaah. bi-musaadatak' },
      ], teachWord: 'rice_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'night_feeding', lines: [
        { speaker: 'baker-yasmin', arabic: 'كُلّ لَيلَة — أَترُك خُبز عِندَ الباب لِلمُسافِر الغامِض', english: 'Every night — I leave bread at the door for the mysterious traveler.', transliteration: 'kull layla — atruk khubz ind al-baab lil-musaafir al-ghaamid' },
        { speaker: 'baker-yasmin', arabic: 'ما بَسأَلُه مين هُوَ. الجائِع لا يُسأَل', english: 'I do not ask him who he is. The hungry are not questioned.', transliteration: 'maa bas\'aluh miin huwa. al-jaa\'i laa yus\'al' },
        { speaker: 'baker-yasmin', arabic: 'الكَرَم — مِن أَجمَل الكَلِمات العَرَبِيَّة', english: 'Generosity — one of the most beautiful Arabic words.', transliteration: 'al-karam — min ajmal al-kalimaat al-arabiyya' },
      ], teachWord: 'tea_1' },
    ],
  },

  'herbalist-maryam': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'hidden_oasis_memories', lines: [
        { speaker: 'herbalist-maryam', arabic: 'أَشتاق لِلواحَة المَخفِيَّة كُلّ يَوم', english: 'I miss the Hidden Oasis every day.', transliteration: 'ashtaaq lil-waaha al-makhfiyya kull yawm' },
        { speaker: 'herbalist-maryam', arabic: 'هُناك — النَّباتات تِتكَلَّم. أَنا أَسمَعها', english: 'There — the plants speak. I hear them.', transliteration: 'hunaak — an-nabaataat titkallam. ana asmahaa' },
        { speaker: 'player', arabic: 'النَّباتات تِتكَلَّم؟', english: 'Plants speak?', transliteration: 'an-nabaataat titkallam?' },
        { speaker: 'herbalist-maryam', arabic: 'بِطَريقَتها — بِالأَلوان وَالرّائِحَة. لازِم تِتعَلَّم تِسمَع', english: 'In their own way — with colors and scent. You must learn to listen.', transliteration: 'bi-tariiqtahaa — bil-alwaan war-raa\'iha. laazim titallam tisma' },
      ], teachWord: 'eye_1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'idris_treatment', lines: [
        { speaker: 'herbalist-maryam', arabic: 'ناسِك الجَبَل إِدريس — مَريض', english: 'Mountain Hermit Idris — he is ill.', transliteration: 'naasik al-jabal idriis — mariid' },
        { speaker: 'herbalist-maryam', arabic: 'أُعالِجُه سِرًّا. هُوَ يِرفِض يِعتَرِف', english: 'I treat him secretly. He refuses to acknowledge it.', transliteration: 'uaalijuhu sirran. huwa yirfid yitarif' },
        { speaker: 'player', arabic: 'هَل بِيتحَسَّن؟', english: 'Is he getting better?', transliteration: 'hal biyithassen?' },
        { speaker: 'herbalist-maryam', arabic: 'بِبُطء. الأَعشاب تِشتِغِل — بَسّ يِحتاج وَقت', english: 'Slowly. The herbs are working — but he needs time.', transliteration: 'bi-but\'. al-ashaab tishtaghil — bass yihtaaj waqt' },
      ], teachWord: 'head_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'memory_herb', lines: [
        { speaker: 'herbalist-maryam', arabic: 'أُمّي حَكَتلي عَن نَبتَة تِرجِّع الذّاكِرَة', english: 'My mother told me about a plant that restores memory.', transliteration: 'ummii hakatlii an nabta tirji adh-dhaakira' },
        { speaker: 'herbalist-maryam', arabic: 'بِتنبُت بَسّ في الواحَة المَخفِيَّة. تَحتَ نور القَمَر', english: 'It grows only in the Hidden Oasis. Under moonlight.', transliteration: 'titnbut bass fil-waaha al-makhfiyya. taht nuur al-qamar' },
        { speaker: 'herbalist-maryam', arabic: 'إِذا رُحنا سَوا — ممكن نِلاقيها', english: 'If we go together — we might find it.', transliteration: 'idhaa ruhnaa sawaa — mumkin nilaqiihaa' },
      ], teachWord: 'hand_1' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRAVELERS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  'guide-amira': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'desert_crossing', lines: [
        { speaker: 'guide-amira', arabic: 'عَبَرت الصَّحراء الكُبرى لَحالي وَعُمري تِسعَتَاشَر', english: 'I crossed the Great Desert alone when I was nineteen.', transliteration: 'abarat as-sahraa\' al-kubraa lahaalii wa umrii tisataashar' },
        { speaker: 'guide-amira', arabic: 'كُلّ يَوم كان دَرس. الصَّحرا أَفضَل مُعَلِّم', english: 'Every day was a lesson. The desert is the best teacher.', transliteration: 'kull yawm kaan dars. as-sahraa afdal muallim' },
        { speaker: 'player', arabic: 'ما أَصعَب يَوم؟', english: 'What was the hardest day?', transliteration: 'maa asab yawm?' },
        { speaker: 'guide-amira', arabic: 'اليَوم اللّي فَكَّرت أَرجِع. بَسّ كَمَّلت. وَهذا الدَّرس', english: 'The day I thought about going back. But I continued. And that is the lesson.', transliteration: 'al-yawm allii fakkarit arji. bass kammalt. wa haadha ad-dars' },
      ], teachWord: 'yalla' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'mysterious_compass', lines: [
        { speaker: 'guide-amira', arabic: 'هَذِهِ البوصَلَة — مِش عادِيَّة', english: 'This compass — it is not ordinary.', transliteration: 'haadhihi al-buusla — mish aadiyya' },
        { speaker: 'guide-amira', arabic: 'أَعطَتني إِيّاها اِمرَأَة عَجوز في الصَّحراء. ظَهَرَت مِن العَدَم', english: 'An old woman in the desert gave it to me. She appeared from nowhere.', transliteration: 'aatatniiiiyyaahaa imra\'a ajuuz fis-sahraa\'. zaharat min al-adam' },
        { speaker: 'guide-amira', arabic: 'دائِمًا تُشير إِلى الواحَة المَخفِيَّة', english: 'It always points to the Hidden Oasis.', transliteration: 'daa\'iman tushiir ilaa al-waaha al-makhfiyya' },
      ], teachWord: 'tayyib' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'ninth_zone', lines: [
        { speaker: 'guide-amira', arabic: 'في مَنطَقَة تاسِعَة — ما حَكيت لِحَدا عَنها', english: 'There is a ninth zone — I have told no one about it.', transliteration: 'fii mantaqa taasia — maa hakiit li-hada anhaa' },
        { speaker: 'guide-amira', arabic: 'حَديقَة عائِمَة في السَّحاب. شِفتَها مَرَّة وَحدَة', english: 'A floating garden in the clouds. I saw it only once.', transliteration: 'hadiiqa aa\'ima fis-sahaab. shifthaa marra wahda' },
        { speaker: 'guide-amira', arabic: 'يَوم — نِروح سَوا وَنِلاقيها', english: 'One day — we will go together and find it.', transliteration: 'yawm — niruuh sawaa wa nilaqiihaa' },
      ], teachWord: 'marhaba' },
    ],
  },

  'wanderer-ali': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'walking_stick', lines: [
        { speaker: 'wanderer-ali', arabic: 'هَذِهِ العَصا — فيها شَقّ لِكُلّ رِحلَة', english: 'This walking stick — it has a notch for every journey.', transliteration: 'haadhihi al-asaa — fiihaa shaqq li-kull rihla' },
        { speaker: 'wanderer-ali', arabic: 'مِئات الشُّقوق. مِئات القِصَص', english: 'Hundreds of notches. Hundreds of stories.', transliteration: 'mi\'aat ash-shuquuq. mi\'aat al-qisas' },
        { speaker: 'player', arabic: 'أَيّ رِحلَة كانَت أَحلى؟', english: 'Which journey was the best?', transliteration: 'ayy rihla kaanat ahlaa?' },
        { speaker: 'wanderer-ali', arabic: 'هَذِهِ — مَعَك. لِأَنّي لَست لَحالي', english: 'This one — with you. Because I am not alone.', transliteration: 'haadhihi — maak. li-annii lastu lahaalii' },
      ], teachWord: 'go_1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'amira_past', lines: [
        { speaker: 'wanderer-ali', arabic: 'كُنت خاطِب أَميرَة مَرَّة', english: 'I was once engaged to Amira.', transliteration: 'kuntu khaatib amiira marra' },
        { speaker: 'wanderer-ali', arabic: 'بَسّ الصَّحرا كَبيرَة وَنَحنا اِثنين مَرشِدين. ما زَبَط', english: 'But the desert is vast and we are both guides. It did not work.', transliteration: 'bass as-sahraa kabiira wa nahnaa ithniin murshidiin. maa zibat' },
        { speaker: 'player', arabic: 'لِسّا بِتحِبّها؟', english: 'Do you still love her?', transliteration: 'lissaa btihibbhaa?' },
        { speaker: 'wanderer-ali', arabic: 'الطَّريق يَعرِف وَبَس', english: 'Only the road knows.', transliteration: 'at-tariiq yaarif wa bas' },
      ], teachWord: 'come_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'stick_key', lines: [
        { speaker: 'wanderer-ali', arabic: 'الشُّقوق عَلى العَصا — مِش بَسّ عَلامات', english: 'The notches on the stick — they are not just marks.', transliteration: 'ash-shuquuq alaa al-asaa — mish bass alaamaat' },
        { speaker: 'wanderer-ali', arabic: 'هِيَ رَمز. مِفتاح لِقَبو في الصَّحراء', english: 'They are a code. A key to a vault in the desert.', transliteration: 'hiya ramz. miftaah li-qabw fis-sahraa\'' },
        { speaker: 'wanderer-ali', arabic: 'أَبي خَبّاه هُناك. هَل تِجي نِفتَحُه سَوا؟', english: 'My father hid it there. Will you come open it with me?', transliteration: 'abii khabbaa hunaak. hal tijii niftahuh sawaa?' },
      ], teachWord: 'walk_1' },
    ],
  },

  'captain-rashid': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'sea_lessons', lines: [
        { speaker: 'captain-rashid', arabic: 'البَحر عَلَّمني شَيء — لا تُحارِب المَوج. اِركَبُه', english: 'The sea taught me something — do not fight the wave. Ride it.', transliteration: 'al-bahr allamaniii shay — laa tuhaarib al-mawj. irkabuh' },
        { speaker: 'captain-rashid', arabic: 'في الحَياة كَمان — لازِم تِعرِف مَتى تِقاوِم وَمَتى تِمشي', english: 'In life too — you must know when to resist and when to move.', transliteration: 'fil-hayaah kamaan — laazim taarif mataa tiqaawim wa mataa timshii' },
        { speaker: 'player', arabic: 'حِكمَة جَميلَة يا قُبطان', english: 'Beautiful wisdom, captain.', transliteration: 'hikma jamiila ya qubtaan' },
      ], teachWord: 'sea_w23' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'daughters_departure', lines: [
        { speaker: 'captain-rashid', arabic: 'بِنتي سافَرَت غَرب. غَضِبَت مِنّي وَراحَت', english: 'My daughter sailed west. She was angry with me and left.', transliteration: 'bintii saafarat gharb. ghadibit minnii wa raahat' },
        { speaker: 'captain-rashid', arabic: 'كان غَلَط مِنّي. رَفَضت زَوجَها لِأَنَّهُ أَجنَبي', english: 'It was my mistake. I rejected her husband because he was a foreigner.', transliteration: 'kaan ghalat minnii. rafadit zawjahaa li-annahu ajnabiy' },
        { speaker: 'captain-rashid', arabic: 'الآن — أَدفَع الثَّمَن كُلّ يَوم', english: 'Now — I pay the price every day.', transliteration: 'al-aan — adfa ath-thaman kull yawm' },
      ], teachWord: 'east_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'treasure_coordinates', lines: [
        { speaker: 'captain-rashid', arabic: 'أَعرِف مَكان سَفينَة غارِقَة — فيها كَنز', english: 'I know the location of a sunken ship — it holds treasure.', transliteration: 'aarif makaan safiina ghaariqa — fiihaa kanz' },
        { speaker: 'captain-rashid', arabic: 'بَسّ البَحر أَمانَة. الكَنز لازِم يِبقى تَحت المَوج', english: 'But the sea is a trust. The treasure must stay beneath the waves.', transliteration: 'bass al-bahr amaana. al-kanz laazim yibqaa taht al-mawj' },
        { speaker: 'captain-rashid', arabic: 'يَوم نِبني سَفينَة جَديدَة — نِروح بَسّ نِشوف. مِش ناخُد', english: 'One day we build a new ship — we go just to see. Not to take.', transliteration: 'yawm nibni safiina jadiida — niruuh bass nishuuf. mish naakhud' },
      ], teachWord: 'west_1' },
    ],
  },

  'guide-salim': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'eagle_whistle', lines: [
        { speaker: 'guide-salim', arabic: 'بَتِعرِف إِنّي بَحكي مَع النُّسور؟', english: 'Did you know I can speak with eagles?', transliteration: 'btaarif innii bahkii maa an-nusuur?' },
        { speaker: 'guide-salim', arabic: 'بِصَفّارَة خاصَّة. جَدّي عَلَّمني إِيّاها', english: 'With a special whistle. My grandfather taught it to me.', transliteration: 'bi-saffaara khaassa. jaddii allamaniii iyyaahaa' },
        { speaker: 'player', arabic: 'عَلِّمني!', english: 'Teach me!', transliteration: 'allimnii!' },
        { speaker: 'guide-salim', arabic: 'يَلّا — بَسّ لازِم تِكون هادي. النُّسور بِتحِبّ الهُدوء', english: 'Come on — but you must be calm. Eagles love quiet.', transliteration: 'yalla — bass laazim tikuun haadii. an-nusuur btihibb al-huduu\'' },
      ], teachWord: 'eagle_1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'parents_search', lines: [
        { speaker: 'guide-salim', arabic: 'أَهلي اِختَفوا في الجَبَل وَأَنا بِالخامِسَة', english: 'My parents disappeared on the mountain when I was five.', transliteration: 'ahlii ikhtafuu fil-jabal wa ana bil-khaamisa' },
        { speaker: 'guide-salim', arabic: 'عَمّي طارِق رَبّاني. بَسّ أَنا بَعدني أَدَوِّر عَلَيهُم', english: 'My uncle Tariq raised me. But I still search for them.', transliteration: 'ammii taariq rabbaanii. bass ana baadnii adawwir alayhum' },
        { speaker: 'player', arabic: 'إِن شاء الله تِلاقيهُم', english: 'God willing, you will find them.', transliteration: 'in shaa\' allaah tilaqiihum' },
        { speaker: 'guide-salim', arabic: 'إِن شاء الله. كُلّ يَوم أَصعَد قِمَّة جَديدَة وَأَبحَث', english: 'God willing. Every day I climb a new peak and search.', transliteration: 'in shaa\' allaah. kull yawm asad qimma jadiida wa abhath' },
      ], teachWord: 'lion_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'mothers_handwriting', lines: [
        { speaker: 'guide-salim', arabic: 'وَجَدت شَيء في مَغارَة عَلى الجَبَل', english: 'I found something in a cave on the mountain.', transliteration: 'wajadt shay fii maghaara alaa al-jabal' },
        { speaker: 'guide-salim', arabic: 'خَطّ أُمّي عَلى الحائِط. هِيَ عاشَت أَطوَل مِمّا ظَنَّينا', english: 'My mother\'s handwriting on the wall. She survived longer than we thought.', transliteration: 'khatt ummii alaal-haa\'it. hiya aashat atwal mimmaa zannaynaa' },
        { speaker: 'guide-salim', arabic: 'تَعال مَعي — ساعِدني أَقرَأ ما كَتَبَت', english: 'Come with me — help me read what she wrote.', transliteration: 'taal maaii — saaidnii aqra maa katabat' },
      ], teachWord: 'rabbit_1' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUARDIANS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  'guard-hamza': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'reluctant_guard', lines: [
        { speaker: 'guard-hamza', arabic: 'أَنا ما بَدّي أَكون حارِس. صارَت بِالصُّدفَة', english: 'I never wanted to be a guard. It happened by chance.', transliteration: 'ana maa baddii akuun haaris. saarat bis-sudfa' },
        { speaker: 'guard-hamza', arabic: 'وَقَّفت لِصّ أَوَّل يَوم. فَقالوا — إِنتَ حارِس!', english: 'I stopped a thief on my first day. So they said — you are a guard!', transliteration: 'waqqaft liss awwal yawm. fa-qaaluu — inta haaris!' },
        { speaker: 'player', arabic: 'بَسّ أَنتَ كويِّس في الشُّغل!', english: 'But you are good at the job!', transliteration: 'bass inta kuwayyis fish-shughl!' },
        { speaker: 'guard-hamza', arabic: 'الحِمايَة سَهلَة إِذا حَبّيت النّاس', english: 'Protection is easy when you love the people.', transliteration: 'al-himaaya sahla idha habbeet an-naas' },
      ], teachWord: 'where_is_1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'secret_poetry', lines: [
        { speaker: 'guard-hamza', arabic: 'بِكتِب شِعر بِاللَّيل. أَثناء الحِراسَة', english: 'I write poetry at night. During guard duty.', transliteration: 'biktib shir bil-layl. athnaa\' al-hiraasa' },
        { speaker: 'guard-hamza', arabic: 'ما حَدا بِيعرِف. بِيضحَكوا عَلَيّ إِذا عِرِفوا', english: 'No one knows. They would laugh at me if they found out.', transliteration: 'maa hada biyaarif. biyidhaku alayyy idha irfuu' },
        { speaker: 'player', arabic: 'ما في شَيء يِضحَك. الشِّعر فَنّ', english: 'There is nothing to laugh at. Poetry is art.', transliteration: 'maa fii shay yidhhak. ash-shir fann' },
        { speaker: 'guard-hamza', arabic: 'شُكرًا يا صَديقي. اِسمَع: "القَلب حارِس — وَالكَلِمَة سَيف"', english: 'Thank you, my friend. Listen: "The heart is a guard — and the word is a sword."', transliteration: 'shukran ya sadiiqii. isma: "al-qalb haaris — wal-kalima sayf"' },
      ], teachWord: 'what_is_this_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'orphan_gate', lines: [
        { speaker: 'guard-hamza', arabic: 'أَحيانًا أَخَلّي ناس يِدخُلوا بِدون إِذن', english: 'Sometimes I let people in without permission.', transliteration: 'ahyaanan akhallii naas yidkhuluu biduum idhn' },
        { speaker: 'guard-hamza', arabic: 'أَيتام وَلاجِئين. مَحتاجين مَكان آمِن', english: 'Orphans and refugees. They need a safe place.', transliteration: 'aytaam wa laaji\'iin. mahtajiin makaan aamin' },
        { speaker: 'guard-hamza', arabic: 'القانون يَقول لا. بَسّ قَلبي يَقول نَعَم', english: 'The law says no. But my heart says yes.', transliteration: 'al-qaanuun yaquul laa. bass qalbii yaquul naam' },
      ], teachWord: 'this_is_1' },
    ],
  },

  'vizier-abbas': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'commoner_origins', lines: [
        { speaker: 'vizier-abbas', arabic: 'وُلِدت في السّوق. اِبن تاجِر صَغير', english: 'I was born in the marketplace. Son of a small trader.', transliteration: 'wulidtu fis-suuq. ibn taajir saghiir' },
        { speaker: 'vizier-abbas', arabic: 'الذَّكاء فَتَح لي الأَبواب — مِش المال', english: 'Intelligence opened doors for me — not money.', transliteration: 'adh-dhakaa\' fatah lii al-abwaab — mish al-maal' },
        { speaker: 'player', arabic: 'هَذا مُلهِم جِدًّا', english: 'That is very inspiring.', transliteration: 'haadha mulhim jiddan' },
        { speaker: 'vizier-abbas', arabic: 'المَعرِفَة سِلاح. أَقوى مِن أَيّ سَيف', english: 'Knowledge is a weapon. Stronger than any sword.', transliteration: 'al-maarifa silaah. aqwaa min ayy sayf' },
      ], teachWord: 'how_are_you_1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'truth_teller', lines: [
        { speaker: 'vizier-abbas', arabic: 'نَجَوت لِأَنّي الوَحيد اللّي كان يَقول الحَقيقَة', english: 'I survived because I was the only one who told the truth.', transliteration: 'najawtu li-annii al-wahiid allii kaan yaquul al-haqiiqa' },
        { speaker: 'vizier-abbas', arabic: 'ثلاث حُكّام خَدَمتَهُم. كُلّهُم كانوا يِكرَهوا الصِّدق', english: 'Three rulers I served. All of them hated honesty.', transliteration: 'thalath hukkaam khadamtahum. kulluhum kaanuu yikrahuu as-sidq' },
        { speaker: 'vizier-abbas', arabic: 'بَسّ الصِّدق — أَقوى مِن كُلّ عَرش', english: 'But honesty — it is stronger than any throne.', transliteration: 'bass as-sidq — aqwaa min kull arsh' },
      ], teachWord: 'my_name_is_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'founding_secret', lines: [
        { speaker: 'vizier-abbas', arabic: 'عِندي سِرّ يُغَيِّر كُلّ شَيء', english: 'I have a secret that changes everything.', transliteration: 'indii sirr yughayyir kull shay\'' },
        { speaker: 'vizier-abbas', arabic: 'العائِلَة الحاكِمَة — ما وَصَلَت لِلحُكم بِالحَقّ', english: 'The ruling family — they did not come to power legitimately.', transliteration: 'al-aa\'ila al-haakima — maa wasalat lil-hukm bil-haqq' },
        { speaker: 'vizier-abbas', arabic: 'الحَقيقَة صَعبَة. بَسّ لازِم حَدا يَعرِفها', english: 'The truth is hard. But someone must know it.', transliteration: 'al-haqiiqa saba. bass laazim hada yaarifhaa' },
      ], teachWord: 'i_am_fine_1' },
    ],
  },

  'dockmaster-nadia': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'fathers_log', lines: [
        { speaker: 'dockmaster-nadia', arabic: 'أَبي كان قُبطان. ماتَ في البَحر', english: 'My father was a captain. He died at sea.', transliteration: 'abii kaan qubtaan. maat fil-bahr' },
        { speaker: 'dockmaster-nadia', arabic: 'وَرِثت المِيناء مِنُّه. أَوَّل اِمرَأة في هَذا المَنصِب', english: 'I inherited the port from him. First woman in this position.', transliteration: 'wirithtu al-miinaa\' minnu. awwal imra\'a fii haadha al-mansib' },
        { speaker: 'player', arabic: 'أَنتِ تِدبّري المِيناء كويِّس', english: 'You manage the port well.', transliteration: 'inti tidabbrii al-miinaa\' kuwayyis' },
        { speaker: 'dockmaster-nadia', arabic: 'بِنِظام. كُلّ شَيء بِنِظام. هَذا سِرّ النَّجاح', english: 'In order. Everything in order. That is the secret of success.', transliteration: 'bi-nizaam. kull shay bi-nizaam. haadha sirr an-najaah' },
      ], teachWord: 'north_1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'refugee_past', lines: [
        { speaker: 'dockmaster-nadia', arabic: 'أَنا كُنت لاجِئَة لَمّا كُنت صَغيرَة', english: 'I was a refugee when I was young.', transliteration: 'ana kuntu laaji\'a lamma kuntu saghiira' },
        { speaker: 'dockmaster-nadia', arabic: 'لِهَيك أَسمَح لِسُفُن اللّاجِئين تِرسي بِدون تَفتيش', english: 'That is why I allow refugee ships to dock without inspection.', transliteration: 'li-hayk asmah li-sufun al-laaji\'iin tirsii biduum taftiish' },
        { speaker: 'player', arabic: 'سِرَّك آمِن مَعي', english: 'Your secret is safe with me.', transliteration: 'sirrak aamin maaii' },
        { speaker: 'dockmaster-nadia', arabic: 'شُكرًا. الرَّحمَة أَهَمّ مِن القانون أَحيانًا', english: 'Thank you. Mercy is more important than law sometimes.', transliteration: 'shukran. ar-rahma ahamm min al-qaanuun ahyaanan' },
      ], teachWord: 'south_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'rashids_daughter', lines: [
        { speaker: 'dockmaster-nadia', arabic: 'بِنت القُبطان رَشيد — أَعرِف وَينها', english: 'Captain Rashid\'s daughter — I know where she is.', transliteration: 'bint al-qubtaan rashiid — aarif waynhaa' },
        { speaker: 'dockmaster-nadia', arabic: 'بِتراسَلني بِرَسائِل مَعَ الطُّيور. هِيَ بِخَير', english: 'She writes to me through carrier birds. She is well.', transliteration: 'bitraasalnii bi-rasaa\'il maa at-tuyuur. hiya bi-khayr' },
        { speaker: 'dockmaster-nadia', arabic: 'القُبطان لازِم يَعرِف. بَسّ ما عِرِفت كَيف أَحكيلُه', english: 'The captain must know. But I did not know how to tell him.', transliteration: 'al-qubtaan laazim yaarif. bass maa irift kayf ahkiiluh' },
      ], teachWord: 'run_1' },
    ],
  },

  'mountain-hermit-idris': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'palace_past', lines: [
        { speaker: 'mountain-hermit-idris', arabic: 'كُنت مُعَلِّم الأُمَراء وَالأَميرات', english: 'I was the teacher of princes and princesses.', transliteration: 'kuntu muallim al-umaraa\' wal-amiiraat' },
        { speaker: 'mountain-hermit-idris', arabic: 'القَصر — سِجن مِن ذَهَب. الجَبَل أَفضَل', english: 'The palace — a prison of gold. The mountain is better.', transliteration: 'al-qasr — sijn min dhahab. al-jabal afdal' },
        { speaker: 'player', arabic: 'لِماذا تَرَكت؟', english: 'Why did you leave?', transliteration: 'limaadha tarakt?' },
        { speaker: 'mountain-hermit-idris', arabic: 'لِأَنّي رَفَضت أَكذِب. الجَبَل لا يَطلُب مِنّي الكَذِب', english: 'Because I refused to lie. The mountain does not ask me to lie.', transliteration: 'li-annii rafadtu akdhib. al-jabal laa yatlub minnii al-kadhib' },
      ], teachWord: 'mountain_w21' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'fading_sight', lines: [
        { speaker: 'mountain-hermit-idris', arabic: 'بَصَري يِضعَف. كُلّ سَنَة أَشوف أَقَلّ', english: 'My sight is fading. Every year I see less.', transliteration: 'basarii yidaf. kull sana ashuuf aqall' },
        { speaker: 'mountain-hermit-idris', arabic: 'بَسّ سَمعي أَصبَح أَقوى. أَسمَع الجَبَل يِتنَفَّس', english: 'But my hearing has become stronger. I hear the mountain breathe.', transliteration: 'bass samaaii asbah aqwaa. asma al-jabal yitanaffas' },
        { speaker: 'player', arabic: 'الجَبَل يِتنَفَّس؟', english: 'The mountain breathes?', transliteration: 'al-jabal yitanaffas?' },
        { speaker: 'mountain-hermit-idris', arabic: 'كُلّ شَيء حَيّ. لازِم بَسّ تِسمَع', english: 'Everything is alive. You just have to listen.', transliteration: 'kull shay hayy. laazim bass tisma' },
      ], teachWord: 'river_w24' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'hidden_books', lines: [
        { speaker: 'mountain-hermit-idris', arabic: 'الحاكِم أَرادَ يَحرِق كُتُب. أَنا هَرَّبتُها', english: 'The ruler wanted to burn books. I smuggled them out.', transliteration: 'al-haakim araad yahriq kutub. ana harrabtuhaa' },
        { speaker: 'mountain-hermit-idris', arabic: 'في مَغارَة فوق — كُتُب مَلفوفَة بِجِلد مُزَيَّت', english: 'In a cave above — books wrapped in oiled leather.', transliteration: 'fii maghaara fawq — kutub malfuufa bi-jild muzayyat' },
        { speaker: 'mountain-hermit-idris', arabic: 'هَذِهِ الكُتُب — أَثمَن مِن كُلّ ذَهَب القَصر', english: 'These books — more precious than all the palace gold.', transliteration: 'haadhihi al-kutub — athman min kull dhahab al-qasr' },
      ], teachWord: 'rain_w25' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTISTS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  'storyteller-noor': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'grandmother_stories', lines: [
        { speaker: 'storyteller-noor', arabic: 'جَدَّتي كانَت كَفيفَة — بَسّ كانَت تَرى أَكثَر مِنّا', english: 'My grandmother was blind — but she saw more than us.', transliteration: 'jaddatii kaanat kafiifa — bass kaanat taraa akthar minnaa' },
        { speaker: 'storyteller-noor', arabic: 'عَلَّمَتني أَلف قِصَّة. كُلّها حَقيقِيَّة', english: 'She taught me a thousand stories. All of them true.', transliteration: 'allamatnii alf qissa. kullahaa haqiiqiyya' },
        { speaker: 'player', arabic: 'أَحكيلي قِصَّة!', english: 'Tell me a story!', transliteration: 'ahkiilii qissa!' },
        { speaker: 'storyteller-noor', arabic: 'يُحكى أَنَّ... بَطَل يَأتي مِن بَعيد. يِتَعَلَّم لُغَة قَديمَة. وَيُغَيِّر كُلّ شَيء', english: 'It is said that... a hero comes from afar. Learns an ancient language. And changes everything.', transliteration: 'yuhkaa anna... batal ya\'tii min baiid. yitaallam lugha qadiima. wa yughayyir kull shay\'' },
      ], teachWord: 'old_1' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'unfinished_epic', lines: [
        { speaker: 'storyteller-noor', arabic: 'جَدَّتي ماتَت قَبل ما تِخَلِّص المَلحَمَة', english: 'My grandmother died before she finished the epic.', transliteration: 'jaddatii maatat qabl maa tikhalliss al-malhama' },
        { speaker: 'storyteller-noor', arabic: 'أَعرِف البِداية وَالوَسَط — بَسّ النِّهاية مَفقودَة', english: 'I know the beginning and the middle — but the ending is missing.', transliteration: 'aarif al-bidaaya wal-wasat — bass an-nihaaya mafquuda' },
        { speaker: 'player', arabic: 'رُبَّما النِّهاية لِسّا ما صارَت', english: 'Perhaps the ending has not happened yet.', transliteration: 'rubbamaa an-nihaaya lissaa maa saarat' },
        { speaker: 'storyteller-noor', arabic: 'رُبَّما... أَنتَ عِندَك حِكمَة يا صَديقي', english: 'Perhaps... you have wisdom, my friend.', transliteration: 'rubbamaa... anta indak hikma ya sadiiqii' },
      ], teachWord: 'new_1' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'prophecy', lines: [
        { speaker: 'storyteller-noor', arabic: 'المَلحَمَة فيها نُبوءَة', english: 'The epic contains a prophecy.', transliteration: 'al-malhama fiihaa nubuu\'a' },
        { speaker: 'storyteller-noor', arabic: 'شَخص يَأتي مِن خارِج — يِتَعَلَّم اللُّغَة — وَيِجمَع المَناطِق كُلّها', english: 'Someone comes from outside — learns the language — and unites all the zones.', transliteration: 'shakhs ya\'tii min khaarij — yitaallam al-lugha — wa yijma al-manaatiq kullahaa' },
        { speaker: 'storyteller-noor', arabic: 'أَنتَ هُوَ. جَدَّتي تَنَبَّأَت بِقُدومَك', english: 'You are that person. My grandmother prophesied your coming.', transliteration: 'anta huwa. jaddatii tanabba\'at bi-quduumak' },
      ], teachWord: 'long_tall_1' },
    ],
  },

  'poet-rumi': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'beauty_everywhere', lines: [
        { speaker: 'poet-rumi', arabic: 'كُلّ شَيء حَولَنا — شِعر', english: 'Everything around us — is poetry.', transliteration: 'kull shay hawlanaa — shir' },
        { speaker: 'poet-rumi', arabic: 'المَطَر شِعر. الشَّمس شِعر. حَتّى الحُزن شِعر', english: 'Rain is poetry. The sun is poetry. Even sadness is poetry.', transliteration: 'al-matar shir. ash-shams shir. hattaa al-huzn shir' },
        { speaker: 'player', arabic: 'عَلِّمني أَكتُب شِعر', english: 'Teach me to write poetry.', transliteration: 'allimnii aktub shir' },
        { speaker: 'poet-rumi', arabic: 'الشِّعر لا يُكتَب. يُولَد. اِفتَح قَلبَك — وَالكَلِمات تِجي', english: 'Poetry is not written. It is born. Open your heart — and the words will come.', transliteration: 'ash-shir laa yuktab. yuulad. iftah qalbak — wal-kalimaat tijii' },
      ], teachWord: 'color_white' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'banished_poet', lines: [
        { speaker: 'poet-rumi', arabic: 'المَلِك طَرَدني لِأَنّي كَتَبت الحَقيقَة', english: 'The king banished me because I wrote the truth.', transliteration: 'al-malik taradnii li-annii katabt al-haqiiqa' },
        { speaker: 'poet-rumi', arabic: 'قَصيدَة واحِدَة — اِنتَشَرَت كَالنّار. وَأَنا هَرَبت', english: 'One poem — it spread like fire. And I fled.', transliteration: 'qasiida waahida — intasharat kan-naar. wa ana harabt' },
        { speaker: 'poet-rumi', arabic: 'الكَلِمَة أَقوى مِن السَّيف. تَذَكَّر هذا دائِمًا', english: 'The word is stronger than the sword. Remember that always.', transliteration: 'al-kalima aqwaa min as-sayf. tadhakkar haadha daa\'iman' },
      ], teachWord: 'color_black' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'love_poems', lines: [
        { speaker: 'poet-rumi', arabic: 'كُلّ صَباح أَترُك قَصيدَة عِند بَوّابَة الحَديقَة', english: 'Every morning I leave a poem at the garden gate.', transliteration: 'kull sabaah atruk qasiida ind bawwaabat al-hadiiqa' },
        { speaker: 'poet-rumi', arabic: 'لِلَيلى — حارِسَة الحَديقَة. بَسّ هِيَ ما بِتِعرِف إِنّها مِنّي', english: 'For Leila — the garden keeper. But she does not know they are from me.', transliteration: 'li-laylaa — haarisat al-hadiiqa. bass hiya maa btaarif innahaa minnii' },
        { speaker: 'poet-rumi', arabic: 'الحُبّ لُغَة. أَجمَل لُغَة في العالَم', english: 'Love is a language. The most beautiful language in the world.', transliteration: 'al-hubb lugha. ajmal lugha fil-aalam' },
      ], teachWord: 'color_green' },
    ],
  },

  'princess-aisha': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'seven_languages', lines: [
        { speaker: 'princess-aisha', arabic: 'أَتكَلَّم سَبع لُغات. بَسّ العَرَبِيَّة أَقرَب لِقَلبي', english: 'I speak seven languages. But Arabic is closest to my heart.', transliteration: 'atakallam saba lughaat. bass al-arabiyya aqrab li-qalbii' },
        { speaker: 'princess-aisha', arabic: 'كُلّ لُغَة بَيت. بَسّ العَرَبِيَّة — وَطَن', english: 'Every language is a home. But Arabic — is a homeland.', transliteration: 'kull lugha bayt. bass al-arabiyya — watan' },
        { speaker: 'player', arabic: 'لِماذا تِحِبّيها أَكثَر؟', english: 'Why do you love it most?', transliteration: 'limaadha tiihibbiihaa akthar?' },
        { speaker: 'princess-aisha', arabic: 'لِأَنّ صَوتَها مُوسيقى. كُلّ كَلِمَة أُغنِيَة', english: 'Because its sound is music. Every word is a song.', transliteration: 'li-anna sawtahaa muusiiqaa. kull kalima ughnia' },
      ], teachWord: 'family_mother' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'secret_school', lines: [
        { speaker: 'princess-aisha', arabic: 'عِندي مَدرَسَة سِرِّيَّة في القَصر', english: 'I have a secret school in the palace.', transliteration: 'indii madrasa sirriyya fil-qasr' },
        { speaker: 'princess-aisha', arabic: 'أُعَلِّم أَولاد الخَدَم القِراءَة وَالكِتابَة', english: 'I teach the servants\' children reading and writing.', transliteration: 'uallim awlaad al-khadam al-qiraa\'a wal-kitaaba' },
        { speaker: 'player', arabic: 'هَذا شَيء عَظيم!', english: 'That is a wonderful thing!', transliteration: 'haadha shay aziim!' },
        { speaker: 'princess-aisha', arabic: 'التَّعليم حَقّ — مِش اِمتِياز. هَذا إِيماني', english: 'Education is a right — not a privilege. That is my belief.', transliteration: 'at-taliim haqq — mish imtiyaaz. haadha iimaanii' },
      ], teachWord: 'family_brother' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'broken_betrothal', lines: [
        { speaker: 'princess-aisha', arabic: 'كَتَبت رِسالَة لِلأَمير الّذي خَطَبوني لَهُ', english: 'I wrote a letter to the prince they betrothed me to.', transliteration: 'katabt risaala lil-amiir alladhii khatbuunii lahu' },
        { speaker: 'princess-aisha', arabic: 'أَلغَيت الخُطبَة. بَسّ ما أَرسَلت الرِّسالَة بَعد', english: 'I canceled the engagement. But I have not sent the letter yet.', transliteration: 'alghayt al-khutba. bass maa arsalt ar-risaala baad' },
        { speaker: 'princess-aisha', arabic: 'ساعِدني أَختار مَصيري. أَنتَ صَديقي الوَحيد', english: 'Help me choose my destiny. You are my only friend.', transliteration: 'saaidnii akhtaar masiirii. anta sadiiqii al-wahiid' },
      ], teachWord: 'family_sister' },
    ],
  },

  'garden-keeper-leila': {
    friendlyDialogues: [
      { trigger: 'friendship_50', topic: 'talking_plants', lines: [
        { speaker: 'garden-keeper-leila', arabic: 'النَّباتات بِتِسمَع العَرَبِيَّة. أَنا مُتَأَكِّدَة', english: 'Plants listen to Arabic. I am sure of it.', transliteration: 'an-nabaataat btisma al-arabiyya. ana muta\'akkida' },
        { speaker: 'garden-keeper-leila', arabic: 'لَمّا بَحكيلهُم بِالعَرَبي — بِينمو أَسرَع', english: 'When I speak to them in Arabic — they grow faster.', transliteration: 'lamma bahkiilhum bil-arabiy — byinmu asra' },
        { speaker: 'player', arabic: 'جِدّي وَلّا مَزَح؟', english: 'Seriously or joking?', transliteration: 'jiddii walla mazah?' },
        { speaker: 'garden-keeper-leila', arabic: 'جِدّي! جَرِّب. قُل لِلوَردَة: أَنتِ جَميلَة. وَشوف', english: 'Seriously! Try it. Tell the flower: you are beautiful. And watch.', transliteration: 'jiddii! jarrib. qul lil-warda: inti jamiila. wa shuuf' },
      ], teachWord: 'color_yellow' },
    ],
    closeDialogues: [
      { trigger: 'friendship_75', topic: 'living_map', lines: [
        { speaker: 'garden-keeper-leila', arabic: 'زَرَعت بِذرَة مِن كُلّ مَنطَقَة في حَديقَتي', english: 'I planted a seed from every zone in my garden.', transliteration: 'zaraat bidhra min kull mantaqa fii hadiiqatii' },
        { speaker: 'garden-keeper-leila', arabic: 'الحَديقَة — خَريطَة حَيَّة لِلعالَم كُلُّه', english: 'The garden — a living map of the entire world.', transliteration: 'al-hadiiqa — khariita hayya lil-aalam kulluhu' },
        { speaker: 'player', arabic: 'أَيّ نَبتَة مِن أَيّ مَنطَقَة؟', english: 'Which plant from which zone?', transliteration: 'ayy nabta min ayy mantaqa?' },
        { speaker: 'garden-keeper-leila', arabic: 'تَعال أُوَرّيك! كُلّ نَبتَة لَها قِصَّة', english: 'Come, I will show you! Every plant has a story.', transliteration: 'taal awarriik! kull nabta lahaa qissa' },
      ], teachWord: 'color_brown' },
    ],
    secretDialogues: [
      { trigger: 'friendship_90', topic: 'knowledge_seed', lines: [
        { speaker: 'garden-keeper-leila', arabic: 'عِندي بِذرَة مِن شَجَرَة المَعرِفَة', english: 'I have a seed from the Tree of Knowledge.', transliteration: 'indii bidhra min shajarat al-maarifa' },
        { speaker: 'garden-keeper-leila', arabic: 'مِن سِنين وَهِيَ رافِضَة تِنبُت. بِتِستَنّى حَدا', english: 'For years it has refused to sprout. It is waiting for someone.', transliteration: 'min siniin wa hiya raafda tinbut. btistannaa hada' },
        { speaker: 'garden-keeper-leila', arabic: 'أَظُنّ إِنّها بِتِستَنّاك إِنتَ. جَرِّب اُنطُق اِسمَها بِالعَرَبي', english: 'I think it is waiting for you. Try speaking its name in Arabic.', transliteration: 'azunn innahaa btistannaak inta. jarrib untuq ismahaa bil-arabiy' },
      ], teachWord: 'palm_tree_w20' },
    ],
  },

});

/** All NPC IDs that have expanded dialogue */
export const DIALOGUE_EXPANDED_NPC_IDS = Object.freeze(Object.keys(NPC_DIALOGUE_EXPANSION));

/** Get all dialogue for a specific NPC */
export function getNpcDialogueExpansion(npcId) {
  return NPC_DIALOGUE_EXPANSION[npcId] || null;
}

/** Get dialogue for a specific NPC at a specific friendship level */
export function getUnlockedDialogues(npcId, friendshipLevel) {
  const expansion = NPC_DIALOGUE_EXPANSION[npcId];
  if (!expansion) return [];

  const unlocked = [];
  if (friendshipLevel >= 50 && expansion.friendlyDialogues) {
    unlocked.push(...expansion.friendlyDialogues);
  }
  if (friendshipLevel >= 75 && expansion.closeDialogues) {
    unlocked.push(...expansion.closeDialogues);
  }
  if (friendshipLevel >= 90 && expansion.secretDialogues) {
    unlocked.push(...expansion.secretDialogues);
  }
  return unlocked;
}
