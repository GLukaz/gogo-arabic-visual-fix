/**
 * npcStoryArcs.js
 *
 * Story arc data overlay for NPCs.
 * Contains:
 *  - storyArc metadata for 15 key NPCs (NARR-07)
 *  - Relationship-gated dialogue trees (NARR-05)
 *  - Branch-point dialogue (NARR-03)
 *  - Guide Amira cross-zone evolution (NARR-11)
 *
 * This data is merged into the base npcs.json at import time
 * via mergeNpcStoryArcs() so we never mutate the static JSON.
 */

// ── Story Arc metadata per NPC ──
const NPC_STORY_ARC_META = {
  'scholar-yusuf': {
    storyArc: { arc: 'main_storyline', role: 'knowledge_keeper', branchPoint: 'scholars_dilemma' },
  },
  'merchant-fatima': {
    storyArc: { arc: 'main_storyline', role: 'manuscript_finder', branchPoint: 'scholars_dilemma' },
  },
  'student-khalid': {
    storyArc: { arc: 'oasis_village_arc', role: 'study_partner' },
  },
  'librarian-ibrahim': {
    storyArc: { arc: 'library_mysteries', role: 'archive_guardian' },
  },
  'scribe-amina': {
    storyArc: { arc: 'library_mysteries', role: 'calligraphy_master' },
  },
  'spice-seller-layla': {
    storyArc: { arc: 'marketplace_harmony', role: 'trade_disputant' },
  },
  'trader-hassan': {
    storyArc: { arc: 'marketplace_harmony', role: 'trade_disputant' },
  },
  'elder-tariq': {
    storyArc: {
      arc: 'main_storyline',
      role: 'desert_sage',
      branchPoint: 'desert_crossing',
    },
  },
  'storyteller-noor': {
    storyArc: { arc: 'desert_legends', role: 'lore_keeper' },
  },
  'wanderer-ali': {
    storyArc: { arc: 'main_storyline', role: 'caravan_guide', branchPoint: 'desert_crossing' },
  },
  'healer-khadija': {
    storyArc: { arc: 'mountain_wisdom_arc', role: 'trial_giver' },
  },
  'vizier-abbas': {
    storyArc: {
      arc: 'main_storyline',
      role: 'court_gatekeeper',
      branchPoint: 'palace_audience',
    },
  },
  'princess-aisha': {
    storyArc: { arc: 'royal_palace_arc', role: 'royal_ally' },
  },
  'poet-rumi': {
    storyArc: { arc: 'royal_palace_arc', role: 'wisdom_poet' },
  },
  'guide-amira': {
    storyArc: {
      arc: 'mentor_evolution',
      role: 'mentor',
      crossZone: true,
    },
  },
};

// ── Additional dialogue trees keyed by NPC id ──
// These are APPENDED to the NPC's existing dialogueTrees array.
const NPC_EXTRA_DIALOGUE_TREES = {
  // ─── Scholar Yusuf — manuscript dilemma + relationship secrets ───
  'scholar-yusuf': [
    {
      id: 'topic_personal_secrets',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'أَنتَ طالِبٌ مُجتَهِد... أُريدُ أَن أُخبِرَكَ سِرّاً',
          english: 'You are a diligent student... I want to tell you a secret.',
          transliteration: 'anta taalibun mujtahid... uriidu an ukhbiraka sirran',
        },
        {
          speaker: 'npc',
          arabic: 'مَخطوطَتي الثَّمينَة اِختَفَت — تَحمِلُ أَسرارَ اللُّغَة القَديمَة',
          english:
            'My precious manuscript disappeared — it carries secrets of the ancient language.',
          transliteration:
            'makhtootatii ath-thamiina ikhtafat — tahmilu asraar al-lugha al-qadiima',
        },
        {
          speaker: 'npc',
          arabic: 'مَن يَقرَأُها يَتَعَلَّم كَلِمات لا يَعرِفُها أَحَد',
          english: 'Whoever reads it learns words that nobody knows.',
          transliteration: "man yaqra'uhaa yata'allam kalimaat laa ya'rifuhaa ahad",
          effects: [{ type: 'story_flag', flag: 'scholar_secret_revealed', value: true }],
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'سَأُساعِدُكَ في اِستِعادَتِها',
              english: 'I will help you recover it',
              next: 'hub',
              effects: [
                { type: 'quest_start', questId: 'scholars_dilemma' },
                { type: 'relationship_change', amount: 1 },
              ],
            },
            {
              arabic: 'مُثير لِلاِهتِمام',
              english: 'Interesting',
              next: 'hub',
            },
          ],
        },
      ],
    },
    {
      id: 'topic_dilemma_scholar_path',
      topic: 'personal',
      returnToHub: true,
      priority: 5,
      condition: { storyFlag: { key: 'manuscript_returned_scholar', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'شُكراً لِإِعادَة المَخطوطَة! أَنتَ صَديقٌ حَقيقي',
          english: 'Thank you for returning the manuscript! You are a true friend.',
          transliteration: "shukran li-i'aadat al-makhtoota! anta sadiiqun haqiiqii",
        },
        {
          speaker: 'npc',
          arabic: 'حِكمَة — المَعرِفَة العَميقَة. هَذا ما يَبحَثُ عَنهُ كُلّ عالِم',
          english: 'Hikma — deep wisdom. This is what every scholar seeks.',
          transliteration: "hikma — al-ma'rifa al-'amiiqa. haadha maa yabhathu 'anhu kullu 'aalim",
          teachWord: 'hikma',
        },
        {
          speaker: 'npc',
          arabic: 'مَعرِفَة — أُختُ الحِكمَة',
          english: "Ma'rifa — knowledge, the sister of wisdom.",
          transliteration: "ma'rifa — ukhtu al-hikma",
          teachWord: 'ma_rifa',
        },
      ],
    },
    {
      id: 'topic_dilemma_merchant_path',
      topic: 'personal',
      returnToHub: true,
      priority: 5,
      condition: { storyFlag: { key: 'manuscript_kept_merchant', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'أَنا حَزينٌ أَنَّ المَخطوطَة لَم تُعَد... لَكِنَّني أَفهَم',
          english: 'I am sad the manuscript was not returned... but I understand.',
          transliteration: "ana haziinun anna al-makhtoota lam tu'ad... lakinnanii afham",
        },
        {
          speaker: 'npc',
          arabic: 'العِلمُ لا يَحتاجُ إلى وَرَق — إنَّهُ في القَلب',
          english: "Knowledge doesn't need paper — it is in the heart.",
          transliteration: "al-'ilmu laa yahtaaju ilaa waraq — innahu fil-qalb",
        },
        {
          speaker: 'npc',
          arabic: 'صَبر — كَلِمَة مُهِمَّة جِدّاً لِلعالِم',
          english: 'Sabr — a very important word for a scholar (patience).',
          transliteration: "sabr — kalima muhimma jiddan lil-'aalim",
          teachWord: 'sabr',
        },
      ],
    },
  ],

  // ─── Merchant Fatima — manuscript dispute side + market secrets ───
  'merchant-fatima': [
    {
      id: 'topic_personal_market_secrets',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'أَنتِ زَبونَة مُخلِصَة! سَأُخبِرُكِ سِرّاً',
          english: 'You are a loyal customer! I will tell you a secret.',
          transliteration: "anti zabuuna mukhlisa! sa-ukhbiruki sirran",
        },
        {
          speaker: 'npc',
          arabic: 'وَجَدتُ مَخطوطَة في السُّوق — تَبدو ثَمينَة جِدّاً',
          english: 'I found a manuscript at the market — it looks very valuable.',
          transliteration: 'wajadtu makhtoota fis-suuq — tabduu thamiina jiddan',
        },
        {
          speaker: 'npc',
          arabic: 'الشَّيخ يوسُف يَقولُ إنَّها لَهُ، لَكِنَّني وَجَدتُها',
          english: 'Scholar Yusuf says it is his, but I found it.',
          transliteration: 'ash-shaykh yuusuf yaquulu innahaa lahu, lakinnanii wajadtuhaa',
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'يَجِبُ أَن تُعيديها',
              english: 'You should return it',
              next: 'hub',
              effects: [{ type: 'relationship_change', amount: -1 }],
            },
            {
              arabic: 'مَن وَجَدَ شَيئاً فَهُوَ لَهُ',
              english: 'Finders keepers',
              next: 'hub',
              effects: [{ type: 'relationship_change', amount: 1 }],
            },
          ],
        },
      ],
    },
    {
      id: 'topic_dilemma_sided_merchant',
      topic: 'personal',
      returnToHub: true,
      priority: 5,
      condition: { storyFlag: { key: 'manuscript_kept_merchant', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'شُكراً لِدَعمِك! التِّجارَة تَحتاجُ أَصدِقاء',
          english: 'Thank you for your support! Trade needs friends.',
          transliteration: "shukran li-da'mik! at-tijaara tahtaaju asdiqaa'",
        },
        {
          speaker: 'npc',
          arabic: 'خُذ — هَذِهِ كَلِمَة مُهِمَّة: ثِقَة — تَعني الإيمان بِشَخص',
          english: 'Take — this is an important word: Thiqa — means trust in a person.',
          transliteration: "khudh — haadhihi kalima muhimma: thiqa — ta'nii al-iimaan bi-shakhs",
          teachWord: 'thiqa',
        },
      ],
    },
  ],

  // ─── Elder Tariq — desert crossing branch ───
  'elder-tariq': [
    {
      id: 'topic_personal_desert_wisdom',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'يا وَلَدي، أَنا عِشتُ في هَذِهِ الصَّحراء سِتّينَ سَنَة',
          english: 'My child, I have lived in this desert for sixty years.',
          transliteration: 'ya waladii, ana ishtu fii haadhihi as-sahraa sittiin sana',
        },
        {
          speaker: 'npc',
          arabic: 'أَعرِفُ طَريقَين إلى الجَبَل — واحِد آمِن وَواحِد خَطير',
          english: 'I know two routes to the mountain — one safe and one dangerous.',
          transliteration: "a'rifu tariiqayn ilaa al-jabal — waahid aamin wa waahid khatiir",
        },
        {
          speaker: 'npc',
          arabic: 'الطَّريقُ الخَطيرُ يَمُرُّ عَبرَ أَطلال قَديمَة فيها كِتابات سِرِّيَّة',
          english: 'The dangerous route passes through ancient ruins with secret writings.',
          transliteration:
            'at-tariiqu al-khatiiru yamurru abra atlaal qadiima fiihaa kitaabaat sirriyya',
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'أَخبِرني أَكثَر',
              english: 'Tell me more',
              next: 'hub',
              effects: [{ type: 'quest_start', questId: 'desert_crossing' }],
            },
            {
              arabic: 'شُكراً يا شَيخ',
              english: 'Thank you, elder',
              next: 'hub',
            },
          ],
        },
      ],
    },
    {
      id: 'topic_caravan_aftermath',
      topic: 'personal',
      returnToHub: true,
      priority: 5,
      condition: { storyFlag: { key: 'chose_caravan_route', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'الحَمدُ لِلَّه! وَصَلتَ بِسَلامَة. الطَّريقُ الآمِنُ هُوَ الأَفضَل',
          english: 'Thank God! You arrived safely. The safe route is the best.',
          transliteration:
            "al-hamdu lillaah! wasalta bi-salaama. at-tariiqu al-aaminu huwa al-afdal",
        },
        {
          speaker: 'npc',
          arabic: 'سَلامَة — كَلِمَة جَميلَة تَعني الأَمان',
          english: 'Salama — a beautiful word meaning safety.',
          transliteration: "salaama — kalima jamiila ta'nii al-amaan",
          teachWord: 'salaama',
        },
      ],
    },
    {
      id: 'topic_ruins_aftermath',
      topic: 'personal',
      returnToHub: true,
      priority: 5,
      condition: { storyFlag: { key: 'chose_ruins_shortcut', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'يا لَلشَّجاعَة! نَجَوتَ مِن طَريقِ الأَطلال',
          english: 'What bravery! You survived the ruins route.',
          transliteration: "ya lash-shajaa'a! najawta min tariiq al-atlaal",
        },
        {
          speaker: 'npc',
          arabic: 'شَجاعَة — تَعني القُوَّة في القَلب',
          english: "Shaja'a — means strength in the heart (courage).",
          transliteration: "shajaa'a — ta'nii al-quwwa fil-qalb",
          teachWord: 'shajaa_a',
        },
      ],
    },
  ],

  // ─── Wanderer Ali — caravan route companion ───
  'wanderer-ali': [
    {
      id: 'topic_personal_travels',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'سافَرتُ في كُلِّ مَكان... رَأَيتُ أَشياءَ عَجيبَة',
          english: 'I have traveled everywhere... I have seen wondrous things.',
          transliteration: "saafartu fii kulli makaan... ra'aytu ashyaa'a 'ajiiba",
        },
        {
          speaker: 'npc',
          arabic: 'في الصَّحراء تَعَلَّمتُ أَنَّ الصَّمتَ لُغَة',
          english: 'In the desert I learned that silence is a language.',
          transliteration: "fis-sahraa' ta'allamtu anna as-samta lugha",
        },
        {
          speaker: 'npc',
          arabic: 'رِحلَة — تَعني سَفَر طَويل',
          english: 'Rihla — means a long journey.',
          transliteration: "rihla — ta'nii safar tawiil",
          teachWord: 'rihla',
        },
      ],
    },
  ],

  // ─── Storyteller Noor — star map / desert legends ───
  'storyteller-noor': [
    {
      id: 'topic_personal_star_map',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'هَل تَعرِفُ أَنَّ النُّجومَ تَحكي قِصَصاً؟',
          english: 'Did you know that stars tell stories?',
          transliteration: "hal ta'rifu anna an-nujuuma tahkii qisasan?",
        },
        {
          speaker: 'npc',
          arabic: 'جَدّي تَرَكَ لي خَريطَة نُجوم — مَكتوبَة بِالعَرَبِيَّة القَديمَة',
          english: 'My grandfather left me a star map — written in ancient Arabic.',
          transliteration:
            'jaddii taraka lii khariitat nujuum — maktuuba bil-arabiyya al-qadiima',
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'عَلِّمني أَسماء النُّجوم',
              english: 'Teach me the names of the stars',
              next: 'hub',
              effects: [{ type: 'quest_start', questId: 'bedouin_star_map' }],
            },
            {
              arabic: 'قِصَّة جَميلَة',
              english: 'Beautiful story',
              next: 'hub',
            },
          ],
        },
      ],
    },
  ],

  // ─── Librarian Ibrahim — lost chapter arc ───
  'librarian-ibrahim': [
    {
      id: 'topic_personal_lost_chapter',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'هُناكَ فَصلٌ مَفقود مِن كِتابِ النَّحو القَديم',
          english: 'There is a missing chapter from the ancient grammar book.',
          transliteration: 'hunaaka faslun mafquud min kitaab an-nahw al-qadiim',
        },
        {
          speaker: 'npc',
          arabic: 'إذا ساعَدتَني في تَجميعِهِ، سَأُشارِكُكَ ما فيه',
          english: 'If you help me piece it together, I will share what is in it.',
          transliteration: "idhaa saa'adtanii fii tajmii'ihi, sa-ushaarikuka maa fiih",
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'بِكُلِّ سُرور',
              english: 'With pleasure',
              next: 'hub',
              effects: [{ type: 'quest_start', questId: 'library_lost_chapter' }],
            },
            {
              arabic: 'لاحِقاً',
              english: 'Later',
              next: 'hub',
            },
          ],
        },
      ],
    },
  ],

  // ─── Spice Seller Layla — marketplace rivalry ───
  'spice-seller-layla': [
    {
      id: 'topic_personal_rivalry',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'التّاجِر حَسَّان يَبيعُ تَوابِلي بِسِعرٍ أَقَلّ! هَذا ظُلم',
          english: 'Trader Hassan is selling my spices at a lower price! This is unfair.',
          transliteration: "at-taajir hassaan yabii'u tawaabilii bi-si'rin aqall! haadha zulm",
        },
        {
          speaker: 'npc',
          arabic: 'هَل تَستَطيعُ أَن تَتَوَسَّط بَينَنا؟ أَنتَ تَعرِفُ كَلِمات التِّجارَة',
          english:
            'Can you mediate between us? You know the words of trade.',
          transliteration:
            "hal tastatii'u an tatawassat baynanaa? anta ta'rifu kalimaat at-tijaara",
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'سَأُحاوِل',
              english: 'I will try',
              next: 'hub',
              effects: [{ type: 'quest_start', questId: 'marketplace_rivalry' }],
            },
            {
              arabic: 'لَيسَ شَأني',
              english: "Not my business",
              next: 'hub',
            },
          ],
        },
      ],
    },
  ],

  // ─── Trader Hassan — marketplace rivalry other side ───
  'trader-hassan': [
    {
      id: 'topic_personal_trade_dispute',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'لَيلى تَتَّهِمُني بِالغِشّ! لَكِنَّ أَسعاري عادِلَة',
          english: 'Layla accuses me of cheating! But my prices are fair.',
          transliteration: "laylaa tattahimunii bil-ghishsh! lakinna as'aarii aadila",
        },
        {
          speaker: 'npc',
          arabic: 'عَدل — كَلِمَة مُهِمَّة في التِّجارَة',
          english: "Adl — an important word in trade (justice/fairness).",
          transliteration: "adl — kalima muhimma fit-tijaara",
          teachWord: 'adl_trade',
        },
      ],
    },
  ],

  // ─── Healer Khadija — mountain trial ───
  'healer-khadija': [
    {
      id: 'topic_personal_healing_trial',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'أَنتَ تَتَعَلَّم بِسُرعَة... هَل تُريدُ أَن تَعرِفَ أَسرارَ العِلاج؟',
          english: 'You learn quickly... Do you want to know the secrets of healing?',
          transliteration:
            "anta tata'allam bisur'a... hal turiidu an ta'rifa asraar al-'ilaaj?",
        },
        {
          speaker: 'npc',
          arabic: 'يَجِبُ أَن تَجتازَ اِمتِحاني أَوَّلاً — اِمتِحان المُعالِجَة',
          english: 'You must pass my test first — the Healer\'s Trial.',
          transliteration: 'yajibu an tajtaaza imtihaanii awwalan — imtihaan al-mu\'aalija',
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'أَنا جاهِز',
              english: 'I am ready',
              next: 'hub',
              effects: [{ type: 'quest_start', questId: 'mountain_healer_trial' }],
            },
            {
              arabic: 'أَحتاجُ وَقتاً',
              english: 'I need time',
              next: 'hub',
            },
          ],
        },
      ],
    },
  ],

  // ─── Vizier Abbas — palace audience branch ───
  'vizier-abbas': [
    {
      id: 'topic_personal_audience',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'المَلِكُ يُريدُ أَن يَراك. لَكِن كَيفَ تُقَدِّمُ نَفسَك؟',
          english: 'The king wants to see you. But how will you present yourself?',
          transliteration: 'al-maliku yuriidu an yaraak. laakin kayfa tuqaddimu nafsak?',
        },
        {
          speaker: 'npc',
          arabic: 'هَل أَنتَ عالِم... أَم تاجِر؟ الإجابَة تُغَيِّرُ مَصيرَك',
          english: 'Are you a scholar... or a merchant? The answer changes your fate.',
          transliteration: 'hal anta aalim... am taajir? al-ijaaba tughayyiru masiirak',
        },
        {
          speaker: 'player',
          choices: [
            {
              arabic: 'أَنا عالِم',
              english: 'I am a scholar',
              next: 'hub',
              effects: [
                { type: 'quest_start', questId: 'palace_audience' },
                { type: 'story_flag', flag: 'palace_identity_hint', value: 'scholar' },
              ],
            },
            {
              arabic: 'أَنا تاجِر',
              english: 'I am a merchant',
              next: 'hub',
              effects: [
                { type: 'quest_start', questId: 'palace_audience' },
                { type: 'story_flag', flag: 'palace_identity_hint', value: 'merchant' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'topic_palace_scholar_path',
      topic: 'personal',
      returnToHub: true,
      priority: 5,
      condition: { storyFlag: { key: 'palace_scholar', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'المَلِكُ مَسرور بِعِلمِك. هاكَ كَلِمَة المُلوك: سُلطَة',
          english: "The king is pleased with your knowledge. Here is the word of kings: Sulta (authority).",
          transliteration: 'al-maliku masruur bi-ilmik. haaka kalimat al-muluuk: sulta',
          teachWord: 'sulta',
        },
      ],
    },
    {
      id: 'topic_palace_merchant_path',
      topic: 'personal',
      returnToHub: true,
      priority: 5,
      condition: { storyFlag: { key: 'palace_merchant', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'هَداياكَ أَعجَبَت المَلِك. هاكَ كَلِمَة: كَرَم — السَّخاء',
          english: "Your gifts impressed the king. Here is a word: Karam — generosity.",
          transliteration: "hadaayaaka a'jabat al-malik. haaka kalima: karam — as-sakhaa'",
          teachWord: 'karam',
        },
      ],
    },
  ],

  // ─── Princess Aisha — royal secrets ───
  'princess-aisha': [
    {
      id: 'topic_personal_royal_secrets',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'أَنتَ مِن القَليلينَ الذينَ أَثِقُ بِهِم في هَذا القَصر',
          english: 'You are one of the few I trust in this palace.',
          transliteration: 'anta mina al-qaliiliin alladhiina athiqu bihim fii haadha al-qasr',
        },
        {
          speaker: 'npc',
          arabic: 'عائِلَة — كَلِمَة أُحِبُّها. العائِلَة هِيَ كُلّ شَيء',
          english: "Aa'ila — a word I love. Family is everything.",
          transliteration: "aa'ila — kalima uhibbuhaa. al-aa'ila hiya kullu shay'",
          teachWord: 'aa_ila',
        },
      ],
    },
  ],

  // ─── Poet Rumi — wisdom poetry ───
  'poet-rumi': [
    {
      id: 'topic_personal_hidden_poems',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'لَدَيَّ قَصائِد لَم يَسمَعها أَحَد... أُريدُ أَن أُسمِعَكَ واحِدَة',
          english: 'I have poems nobody has heard... I want you to hear one.',
          transliteration:
            "ladayya qasaa'id lam yasma'haa ahad... uriidu an usmi'aka waahida",
        },
        {
          speaker: 'npc',
          arabic: 'جَمال — كَلِمَة الشُّعَراء. في كُلِّ شَيءٍ جَمال',
          english: "Jamal — the poet's word. There is beauty in everything.",
          transliteration: "jamal — kalimat ash-shu'araa'. fii kulli shay'in jamal",
          teachWord: 'jamal',
        },
      ],
    },
  ],

  // ─── Scribe Amina — calligraphy secrets ───
  'scribe-amina': [
    {
      id: 'topic_personal_calligraphy',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'هَل تُريدُ أَن تَرى خَطّي السِّرّي؟ خَطّ النَّسخ القَديم',
          english: 'Do you want to see my secret script? The ancient Naskh style.',
          transliteration: 'hal turiidu an taraa khattii as-sirriy? khatt an-naskh al-qadiim',
        },
        {
          speaker: 'npc',
          arabic: 'فَنّ — تَعني الإبداع والمَهارَة',
          english: "Fann — means art, creativity, and skill.",
          transliteration: "fann — ta'nii al-ibdaa' wal-mahaara",
          teachWord: 'fann',
        },
      ],
    },
  ],

  // ─── Student Khalid — study partner evolution ───
  'student-khalid': [
    {
      id: 'topic_personal_study_partner',
      topic: 'personal',
      returnToHub: true,
      priority: 4,
      condition: { relationship: { min: 3 } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'أَنتَ أَفضَلُ صَديقٍ دَرَستُ مَعَه! هَل تُريدُ أَن نَكونَ شُرَكاء دائِمين؟',
          english: 'You are the best friend I have studied with! Shall we be permanent study partners?',
          transliteration:
            "anta afdalu sadiiqi darastu ma'ahu! hal turiidu an nakuuna shurakaa' daa'imiin?",
        },
        {
          speaker: 'npc',
          arabic: 'صَداقَة — تَعني العَلاقَة بَينَ الأَصدِقاء',
          english: "Sadaqa — means friendship, the bond between friends.",
          transliteration: "sadaaqa — ta'nii al-'alaaqa bayna al-asdiqaa'",
          teachWord: 'sadaaqa',
        },
      ],
    },
  ],

  // ─── Guide Amira — mentor evolution across zones (NARR-11) ───
  'guide-amira': [
    {
      id: 'topic_mentor_library',
      topic: 'about_zones',
      returnToHub: true,
      priority: 6,
      condition: { storyFlag: { key: 'library_access_granted', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'ما شاءَ اللَّه! وَصَلتَ المَكتَبَة! أَنا فَخورَة بِك',
          english: 'Wonderful! You reached the library! I am proud of you.',
          transliteration: "maa shaa'a allaah! wasalta al-maktaba! ana fakhuura bik",
        },
        {
          speaker: 'npc',
          arabic: 'المَكتَبَة مَليئَة بِالحِكمَة. اِبحَث عَن الكُتُبِ القَديمَة',
          english: 'The library is full of wisdom. Look for the ancient books.',
          transliteration: "al-maktaba malii'a bil-hikma. ibhath 'an al-kutub al-qadiima",
        },
      ],
    },
    {
      id: 'topic_mentor_marketplace',
      topic: 'about_zones',
      returnToHub: true,
      priority: 7,
      condition: { storyFlag: { key: 'marketplace_mediation_complete', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'سَمِعتُ أَنَّكَ تَوَسَّطتَ في السُّوق! أَنتَ تَكبُر',
          english: 'I heard you mediated at the market! You are growing.',
          transliteration: 'sami\'tu annaka tawassatta fis-suuq! anta takbur',
        },
        {
          speaker: 'npc',
          arabic: 'اللُّغَة لَيسَت كَلِمات فَقَط — إنَّها جُسور بَينَ النّاس',
          english: 'Language is not just words — it is bridges between people.',
          transliteration:
            'al-lugha laysat kalimaat faqat — innahaa jusuur bayna an-naas',
        },
      ],
    },
    {
      id: 'topic_mentor_desert',
      topic: 'about_zones',
      returnToHub: true,
      priority: 8,
      condition: { storyFlag: { key: 'caravan_path', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'اِختَرتَ طَريقَ القافِلَة — اِختِيار حَكيم',
          english: 'You chose the caravan route — a wise choice.',
          transliteration: 'ikhtarta tariiq al-qaafila — ikhtiyaar hakiim',
        },
        {
          speaker: 'npc',
          arabic: 'الحِكمَة في السَّفَر هِيَ أَن تَعرِفَ مَتى تَختار الأَمان',
          english: 'The wisdom of travel is knowing when to choose safety.',
          transliteration:
            "al-hikma fis-safar hiya an ta'rif mataa takhtaar al-amaan",
        },
      ],
    },
    {
      id: 'topic_mentor_ruins',
      topic: 'about_zones',
      returnToHub: true,
      priority: 8,
      condition: { storyFlag: { key: 'ruins_path', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'اِختَرتَ طَريقَ الأَطلال — اِختِيار شُجاع!',
          english: 'You chose the ruins route — a brave choice!',
          transliteration: 'ikhtarta tariiq al-atlaal — ikhtiyaar shujaa!',
        },
        {
          speaker: 'npc',
          arabic: 'الكِتابات القَديمَة التي وَجَدتَها — لا يَستَطيعُ الكَثيرونَ قِراءَتَها',
          english: 'The ancient writings you found — few can read them.',
          transliteration:
            "al-kitaabaat al-qadiima allatii wajadtahaa — laa yastatii'u al-kathiiruuna qiraa'atahaa",
        },
      ],
    },
    {
      id: 'topic_mentor_palace',
      topic: 'about_zones',
      returnToHub: true,
      priority: 9,
      condition: { storyFlag: { key: 'palace_audience_granted', value: true } },
      lines: [
        {
          speaker: 'npc',
          arabic: 'المَلِكُ قَبِلَك! رِحلَتُكَ تَقتَرِبُ مِنَ النِّهايَة',
          english: 'The king accepted you! Your journey nears its end.',
          transliteration: 'al-maliku qabilak! rihlatuka taqtaribu mina an-nihaaya',
        },
        {
          speaker: 'npc',
          arabic: 'لَكِنَّ النِّهايَة هِيَ بِدايَة جَديدَة — دائِماً',
          english: 'But the end is always a new beginning.',
          transliteration:
            "lakinna an-nihaaya hiya bidaaya jadiida — daa'iman",
        },
        {
          speaker: 'npc',
          arabic: 'أَنا فَخورَة بِكَ يا مُسافِر. لَقَد تَعَلَّمتَ الكَثير',
          english: 'I am proud of you, traveler. You have learned so much.',
          transliteration: 'ana fakhuura bika ya musaafir. laqad ta\'allamta al-kathiir',
        },
      ],
    },
  ],
};

// ── 8-Act Main Storyline Arc Dialogue Objects (QUEST-01) ──
// Each act has a start arc and a completion arc = 16 total objects.
// These are standalone data objects consumed by DialogueEngine when
// evaluating NPC arcs — they are NOT appended to NPC_EXTRA_DIALOGUE_TREES.
const STORY_ACT_ARCS = [

  // ────────────────────────────────────────────────────────────
  // ACT 1 — Guide Amira — Oasis Village
  // ────────────────────────────────────────────────────────────
  {
    id: 'arc_act_1',
    npcId: 'guide-amira',
    condition: { quest: { id: 'words_of_oasis', status: 'completed' } },
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَيُّها الرَّحّالَة، لَقَد عَرَفتُ أَنَّكَ قادِرٌ عَلى فَهمِ ما سَأَقولُه',
        english: 'Traveler, I knew you were capable of understanding what I am about to say.',
        transliteration: "ayyuhaa ar-rahhaal, laqad 'araftu annaka qaadiran 'alaa fahm maa sa-aquuluh",
      },
      {
        speaker: 'npc',
        arabic: 'عاصِفَةٌ كَونيَّةٌ بَعثَرَت ثَمانيَ صَفَحات مِن مَخطوطَة قَديمَة عَبرَ البِلاد',
        english: 'A cosmic sandstorm scattered eight pages of an ancient manuscript across the land.',
        transliteration: 'aasifattun kawwaniyatun ba\'tharat thamaani safahaat min makhtuuta qadiima abra al-bilaad',
      },
      {
        speaker: 'npc',
        arabic: 'هَذِهِ المَخطوطَة تَحمِلُ سِرَّ اللُّغَة العَرَبيَّة الكَونيَّة — لا يَستَطيعُ جَمعَها إلّا رَحّالَةٌ عَبرَ الزَّمَن',
        english: 'This manuscript holds the secret of the cosmic Arabic language — only a time-traveler can reassemble it.',
        transliteration: "haadhihi al-makhtuuta tahmilu sirr al-lugha al-arabiyya al-kawwaniyya — laa yastatii'u jam'ahaa illaa rahhaalun 'abra az-zaman",
      },
      {
        speaker: 'npc',
        arabic: 'اِبدَأ في الأَطلال هُنا — الصَّفحَة الأُولى مَدفونَةٌ تَحتَ حَجَرِ المَعرِفَة. مَخطوطَة — كَلِمَة تَعني كِتاباً مَكتوباً بِاليَد',
        english: 'Begin in the ruins here — the first page is buried beneath the Stone of Knowledge. Makhtoota — a word meaning a handwritten book.',
        transliteration: "ibda' fii al-atlaal hunaa — as-safha al-uulaa madfiinatan tahta hajar al-ma'rifa. makhtuuta — kalima ta'nii kitaaban maktuuban bil-yad",
        teachWord: 'makhtuuta',
        effects: [
          { type: 'quest_start', questId: 'act_1_manuscript_call' },
          { type: 'story_flag', flag: 'arc_act_1_started', value: true },
        ],
      },
      // learningPath variants — one of these three shows based on player's path
      {
        speaker: 'npc',
        arabic: 'هَذِهِ المَخطوطَة كُتِبَت وَفقَ أُسلوبِ العُلَماء — كُلُّ صَفحَة تَستَلزِمُ تَحليلاً لُغَوياً دَقيقاً',
        english: 'This manuscript was written in the scholarly style — each page requires precise linguistic analysis.',
        transliteration: "haadhihi al-makhtuuta kutibbat wafqa usluub al-'ulamaa' — kullu safha tastalzimu tahliiilaan lughawiyyan daqiiqan",
        condition: { learningPath: 'scholar' },
      },
      {
        speaker: 'npc',
        arabic: 'كُلُّ صَفحَة في مَكانٍ مَرَرتَ بِه في رِحلَتِك — الطَّريق هُوَ مَعَلِّمُك',
        english: 'Each page is in a place you have passed on your journey — the road itself is your teacher.',
        transliteration: "kullu safha fii makaanikn marartu bihi fii rihllatik — at-tariiq huwa mu'allimuk",
        condition: { learningPath: 'traveler' },
      },
      {
        speaker: 'npc',
        arabic: 'هَذِهِ الصَّفَحات كُتِبَت في عَصرِ الذَّهَب الإسلامي — كُلُّ واحِدَة تَعكِسُ حَضارَةَ زَمانِها',
        english: 'These pages were written in the Islamic Golden Age — each one reflects the civilisation of its era.',
        transliteration: "haadhihi as-safahaat kutibbat fii 'asr adh-dhahab al-islaamii — kullu waahida ta'kisu hadaaratan zamaanihaa",
        condition: { learningPath: 'historian' },
      },
    ],
  },
  {
    id: 'arc_act_1_complete',
    npcId: 'guide-amira',
    condition: {
      quest: { id: 'act_1_manuscript_call', status: 'active' },
      storyFlag: { key: 'act_1_milestone_reached', value: true },
    },
    lines: [
      {
        speaker: 'npc',
        arabic: 'وَجَدتَ الصَّفحَة الأُولى! الواحَة دائِماً تَحفَظُ أَسرارَها لِمَن يَستَحِقّ',
        english: 'You found the first page! The oasis always preserves its secrets for those who deserve them.',
        transliteration: "wajadta as-safha al-uulaa! al-waaha daa'iman tahfazu asraarahaa liman yastahiqq",
      },
      {
        speaker: 'npc',
        arabic: 'بَيتُ الحِكمَة في بَغداد كانَ مِثلَ هَذِهِ الواحَة — مَكانٌ تَتَجَمَّعُ فيهِ المَعرِفَة مِن كُلِّ الأُمَم. رِحلَتُكَ أَمامَك الآن',
        english: 'The House of Wisdom in Baghdad was like this oasis — a place where knowledge gathered from all nations. Your journey lies ahead now.',
        transliteration: "bayt al-hikma fii baghdaad kaana mithl haadhihi al-waaha — makaanun tatajamma'u fiihi al-ma'rifa min kull al-umam. rihllatuk amamak al-aan",
        effects: [
          { type: 'quest_complete', questId: 'act_1_manuscript_call' },
          { type: 'story_flag', flag: 'act_1_complete', value: true },
          { type: 'relationship_change', amount: 1 },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ACT 2 — Librarian Ibrahim — Ancient Library
  // ────────────────────────────────────────────────────────────
  {
    id: 'arc_act_2',
    npcId: 'librarian-ibrahim',
    condition: { storyFlag: { key: 'act_1_complete', value: true } },
    lines: [
      {
        speaker: 'npc',
        arabic: 'آهٍ، أَنتَ الرَّحّالَة الذي أَرسَلَتهُ أَميرَة! كُنتُ أَنتَظِرُ هَذا اليَوم',
        english: 'Ah, you are the traveler Amira sent! I have been waiting for this day.',
        transliteration: "aah, anta ar-rahhaal alladhii arsalat-hu amiira! kuntu antaziru haadha al-yawm",
      },
      {
        speaker: 'npc',
        arabic: 'هَذِهِ المَكتَبَة بُنيَت عَلى نَمَطِ بَيتِ الحِكمَة — كُلُّ كِتابٍ لَه رَمزٌ بِالحُروف الأَبجَدِيَّة',
        english: 'This library was built on the model of the House of Wisdom — every book has a symbol in abjad numerals.',
        transliteration: "haadhihi al-maktaba buniiyat 'alaa namat bayt al-hikma — kullu kitaabin lahu ramzun bil-huruuf al-abjadiyya",
      },
      {
        speaker: 'npc',
        arabic: 'الصَّفحَة الثّانيَة مَحبوسَةٌ في غُرفَةِ التَّشفير. فَكُّ شِفرَتِها يَستَلزِمُ مَعرِفَة ثَلاثَة جُذور عَرَبيَّة',
        english: 'The second page is locked in the cipher room. Breaking its code requires knowledge of three Arabic roots.',
        transliteration: "as-safha ath-thaaniya mahbuusatan fii ghurfat at-tashfiir. fakku shifratihaa yastazmiu ma'rifat thalaathat juzuur arabiyya",
      },
      {
        speaker: 'npc',
        arabic: 'أَبجَد — كَلِمَة تَعني أَوَّل الحُروف، وَهِيَ أَصلُ كُلِّ تَشفير',
        english: "Abjad — a word meaning the first letters, and the root of all cipher.",
        transliteration: "abjad — kalima ta'nii awwal al-huruuf, wa hiya asl kullu tashfiir",
        teachWord: 'abjad',
        effects: [
          { type: 'quest_start', questId: 'act_2_library_cipher' },
          { type: 'story_flag', flag: 'arc_act_2_started', value: true },
        ],
      },
      // learningPath variants
      {
        speaker: 'npc',
        arabic: 'في المَكتَبَة تُدرَسُ الجُذور بِنِظامٍ — الأَبجَديَّة لَيسَت حُروفاً فَقَط بَل عِلماً كامِلاً',
        english: 'In the library, roots are studied systematically — the abjad is not merely letters but a complete science.',
        transliteration: "fil-maktaba tudras al-judhuur bi-nidaam — al-abjadiyya laysat huruufan faqat bal 'ilman kaamillan",
        condition: { learningPath: 'scholar' },
      },
      {
        speaker: 'npc',
        arabic: 'الشِّفرَة سَتَقودُكَ إلى الصَّفحَة التّالِيَة — كُلُّ لُغَز هُوَ بَوّابَة لِمَكانٍ جَديد',
        english: 'The cipher will lead you to the next page — every puzzle is a gateway to a new place.',
        transliteration: "ash-shifra sa-taquuduka ilaa as-safha at-taaliya — kullu lughz huwa bawwaabatan li-makaan jadiid",
        condition: { learningPath: 'traveler' },
      },
      {
        speaker: 'npc',
        arabic: 'هَذا التَّشفير وَرِثناهُ مِن عُلَماء بَيتِ الحِكمَة — الَّذينَ أَنقَذوا المَعرِفَة مِن الزَّوال',
        english: 'This cipher was inherited from the scholars of the House of Wisdom — those who saved knowledge from oblivion.',
        transliteration: "haadhaa at-tashfiir warithnaaahu min 'ulamaa' bayt al-hikma — alladhiina anqadhuu al-ma'rifa min az-zawaal",
        condition: { learningPath: 'historian' },
      },
    ],
  },
  {
    id: 'arc_act_2_complete',
    npcId: 'librarian-ibrahim',
    condition: {
      quest: { id: 'act_2_library_cipher', status: 'active' },
      storyFlag: { key: 'act_2_milestone_reached', value: true },
    },
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَحسَنتَ! فَكَكتَ الشِّفرَة! حَتّى أَنا لَم أَستَطِع ذَلِك وَحدي',
        english: 'Well done! You broke the cipher! Even I could not do that alone.',
        transliteration: "ahsanta! fakakta ash-shifra! hatta ana lam astati' dhaalik wahdii",
      },
      {
        speaker: 'npc',
        arabic: 'المَعرِفَة العَرَبيَّة القَديمَة لا تَموت — تَنتَظِرُ مَن يُحسِنُ قِراءَتَها. وَاصِل رِحلَتَك',
        english: 'Ancient Arabic knowledge does not die — it waits for those who can read it. Continue your journey.',
        transliteration: "al-ma'rifa al-arabiyya al-qadiima laa tamuut — tantaziru man yuhsinu qiraa'atahaa. waasil rihllatak",
        effects: [
          { type: 'quest_complete', questId: 'act_2_library_cipher' },
          { type: 'story_flag', flag: 'act_2_complete', value: true },
          { type: 'relationship_change', amount: 1 },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ACT 3 — Merchant Fatima — Desert Marketplace
  // ────────────────────────────────────────────────────────────
  {
    id: 'arc_act_3',
    npcId: 'merchant-fatima',
    condition: { storyFlag: { key: 'act_2_complete', value: true } },
    lines: [
      {
        speaker: 'npc',
        arabic: 'تَبحَثُ عَن وَرَقَة قَديمَة؟ عِندي ورَقَة لَفَّيتُ بِها تَوابِل اليَوم — لا أَعرِفُ مَا فيها',
        english: 'Looking for an old page? I have a paper I wrapped today\'s spices in — I do not know what is written on it.',
        transliteration: "tabhathu 'an waraqatan qadiima? 'indii waraqa laffahtu bihaa tawabilal-yawm — laa a'rifu maa fiihaa",
      },
      {
        speaker: 'npc',
        arabic: 'السُّوقُ الإسلامي كانَ مَكانَ تَبادُل المَعرِفَة أَيضاً — مَعَ كُلِّ صَفقَة تِجاريَّة كانَت هُناكَ صَفقَةٌ مِن الحِكمَة',
        english: 'The Islamic market was also a place of knowledge exchange — with every trade deal there was also a deal in wisdom.',
        transliteration: "as-suuq al-islamii kaana makaan tabaadull al-ma'rifa aydan — ma'a kulli safqa tijaariyya kaanant hunaaka safqatun min al-hikma",
      },
      {
        speaker: 'npc',
        arabic: 'سَأُعطيكَها إذا تَكَلَّمتَ مَعي بِعَرَبيَّة السُّوق. هَل تَعرِفُ كَيفَ تَتَفاوَض؟ تِجارَة — كَلِمَة تَعني التَّبادُل',
        english: "I will give it to you if you speak market Arabic with me. Do you know how to negotiate? Tij\u0101ra — a word meaning exchange.",
        transliteration: "sa-u'tiika iyaahaa idhaa takallamt ma'ii bi-arabiyyat as-suuq. hal ta'rifu kayfa tatafaawadd? tijaara — kalima ta'nii at-tabaadull",
        teachWord: 'tijaara',
        effects: [
          { type: 'quest_start', questId: 'act_3_market_bargain_scroll' },
          { type: 'story_flag', flag: 'arc_act_3_started', value: true },
        ],
      },
      // learningPath variants
      {
        speaker: 'npc',
        arabic: 'لُغَة السُّوق مُختَلِفَة عَن لُغَةِ الكِتاب — العالِمُ الحَقيقي يَعرِفُ كِلتَيهِما',
        english: 'The language of the market differs from the language of books — the true scholar knows both.',
        transliteration: "lughat as-suuq mukhtalifa 'an lughat al-kitaab — al-'aalim al-haqiiqii ya'rif kiltayhimaa",
        condition: { learningPath: 'scholar' },
      },
      {
        speaker: 'npc',
        arabic: 'السُّوق هُوَ لُغَة المُسافِر الأُولى — مَن يَعرِفُ أَسماء السِّلَع يَصِلُ إلى كُلِّ بَلَد',
        english: 'The market is the traveler\'s first language — one who knows the names of goods can reach every land.',
        transliteration: "as-suuq huwa lughat al-musaafir al-uulaa — man ya'rif asmaa' as-sila' yasil ilaa kulli balad",
        condition: { learningPath: 'traveler' },
      },
      {
        speaker: 'npc',
        arabic: 'السُّوق الإسلامي كانَ مَركَز الحَضارَة — هُنا تَلتَقي اللُّغات وَالثَّقافات مِن القارّات الثَّلاث',
        english: 'The Islamic market was the centre of civilisation — here languages and cultures from three continents converged.',
        transliteration: "as-suuq al-islaamii kaana markaz al-hadaara — hunaa taltaqii al-lughaat wal-thaqaafaat min al-qaarraat ath-thalath",
        condition: { learningPath: 'historian' },
      },
    ],
  },
  {
    id: 'arc_act_3_complete',
    npcId: 'merchant-fatima',
    condition: {
      quest: { id: 'act_3_market_bargain_scroll', status: 'active' },
      storyFlag: { key: 'act_3_milestone_reached', value: true },
    },
    lines: [
      {
        speaker: 'npc',
        arabic: 'ماشاء الله! أَنتَ تُجيدُ لُغَة السُّوق كَأَنَّكَ وُلِدتَ فيه. خُذ الصَّفحَة',
        english: 'Wonderful! You speak market language as if you were born in it. Take the page.',
        transliteration: "maa shaa' allaah! anta tujiidu lughat as-suuq ka-annaka ulidat fiih. khudh as-safha",
      },
      {
        speaker: 'npc',
        arabic: 'طَريقُ التُّجّار كانَ طَريقَ الكَلِمات أَيضاً — كُلُّ رِحلَة تِجاريَّة حَمَلَت لُغَةً جَديدَة مَعَها. يَلّا، وَاصِل',
        english: 'The trade route was also the route of words — every trade journey carried a new language with it. Go, continue.',
        transliteration: "tariiq at-tujjaar kaana tariiq al-kalimaat aydan — kullu rihlla tijaariyya hamalat lughatan jadiida ma'ahaa. yallaa, waasil",
        effects: [
          { type: 'quest_complete', questId: 'act_3_market_bargain_scroll' },
          { type: 'story_flag', flag: 'act_3_complete', value: true },
          { type: 'relationship_change', amount: 1 },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ACT 4 — Farmer Omar — Farmland
  // ────────────────────────────────────────────────────────────
  {
    id: 'arc_act_4',
    npcId: 'farmer-omar',
    condition: { storyFlag: { key: 'act_3_complete', value: true } },
    lines: [
      {
        speaker: 'npc',
        arabic: 'يا سَلام، زَيّاَرة في وَقتِ الحَصاد! هَل جِئتَ لِتُساعِدَني؟',
        english: 'Welcome, a visit at harvest time! Did you come to help me?',
        transliteration: "yaa salaam, ziyyaara fii waqt al-hasaad! hal ji'ta li-tusaa'idnii?",
      },
      {
        speaker: 'npc',
        arabic: 'وَجَدتُ وَرَقَةً غَريبَةً في الأَرض أَثناءَ الحَرث — مَكتوبٌ فيها كَلام لا أَفهَمُه',
        english: 'I found a strange paper in the soil while plowing — it has writing on it I cannot understand.',
        transliteration: "wajadtu waraqatan ghariibatan fil-ard athnaa al-harth — maktuubun fiihaa kalaam laa afhamuh",
      },
      {
        speaker: 'npc',
        arabic: 'الأَرضُ الزِّراعيَّة عِندَنا كانَت تُروى بِنِظامِ قَنَوات الفَلَج — مِن أَعظَمِ اِختِراعات العالَم الإسلامي',
        english: 'Our farmland was irrigated by the falaj canal system — one of the greatest inventions of the Islamic world.',
        transliteration: "al-ard az-ziraa'iyya 'indanaa kaanat tuuraa bi-nidaam qanawaat al-falaj — min a'zam ikhtiiraa'aat al-'aalam al-islaamii",
      },
      {
        speaker: 'npc',
        arabic: 'ساعِدني في الحَصاد وَسَأُعطيكَ الوَرَقَة. حَصاد — تَعني جَمعُ ثِمار العَمَل',
        english: "Help me with the harvest and I will give you the paper. Hassaad — means gathering the fruits of labor.",
        transliteration: "saa'idnii fil-hasaad wa-sa-u'tiika al-waraqa. hasaad — ta'nii jam'u thamaar al-'amal",
        teachWord: 'hasaad',
        effects: [
          { type: 'quest_start', questId: 'act_4_farmland_harvest_clue' },
          { type: 'story_flag', flag: 'arc_act_4_started', value: true },
        ],
      },
      // learningPath variants
      {
        speaker: 'npc',
        arabic: 'الزِّراعَة عِلمٌ قَبلَ أَن تَكونَ عَمَلاً — تَعَلَّم أَسماء النَّباتات وَستَفهَمُ كَيفَ أَطعَمَت الحَضارَة العالَم',
        english: 'Agriculture is a science before it is a labour — learn the names of plants and you will understand how civilisation fed the world.',
        transliteration: "az-ziraa'a 'ilmun qabla an takuuna 'amalan — ta'allam asmaa' an-nabaataat wa sa-tafham kayfa at'amat al-hadaara al-'aalam",
        condition: { learningPath: 'scholar' },
      },
      {
        speaker: 'npc',
        arabic: 'كُلُّ أَرضٍ تَزرَعُها تَتَعَلَّمُ مِنها لُغَةً — الحَقلُ يُعَلِّمُكَ ما لا يَقدِرُ عَلَيهِ الكِتاب',
        english: 'Every land you cultivate teaches you a language — the field teaches you what no book can.',
        transliteration: "kullu ardin tazra'uhaa tata'allamu minhaa lughatan — al-haql yu'allimuka maa laa yaqdiru 'alayhi al-kitaab",
        condition: { learningPath: 'traveler' },
      },
      {
        speaker: 'npc',
        arabic: 'الثَّورَة الزِّراعيَّة الإسلاميَّة أَدخَلَت المَحاصيل مِن الهِند وَفارِس إلى أُوروبّا — هَذِهِ الأَرض تَروي تِلكَ القِصَّة',
        english: 'The Islamic Agricultural Revolution brought crops from India and Persia to Europe — this land tells that story.',
        transliteration: "ath-thawra az-ziraa'iyya al-islaamiyya adkhalat al-mahaasil min al-hind wa faarisahaa ilaa uurubbaa — haadhihi al-ard tarwii tilka al-qissa",
        condition: { learningPath: 'historian' },
      },
    ],
  },
  {
    id: 'arc_act_4_complete',
    npcId: 'farmer-omar',
    condition: {
      quest: { id: 'act_4_farmland_harvest_clue', status: 'active' },
      storyFlag: { key: 'act_4_milestone_reached', value: true },
    },
    lines: [
      {
        speaker: 'npc',
        arabic: 'شُكراً لَكَ! الحَصاد اِنتَهى وَأَنا لَن أَنسى مُساعَدَتَك',
        english: 'Thank you! The harvest is done and I will never forget your help.',
        transliteration: "shukran lak! al-hasaad intahaa wa anaa lan ansaa musaa'adatak",
      },
      {
        speaker: 'npc',
        arabic: 'العِلمُ الزِّراعيُّ الإسلامي أَطعَمَ العالَم لِقُرون — كَما تُطعِمُنا هَذِهِ الصَّفَحات بِالمَعرِفَة الآن. بارَكَ اللَّه فيك',
        english: 'Islamic agricultural science fed the world for centuries — just as these pages feed us with knowledge now. God bless you.',
        transliteration: "al-'ilm az-ziraa'ii al-islaamii at'ama al-'aalim li-quruun — kamaa nut'amunaa haadhihi as-safahaat bil-ma'rifa al-aan. baaraka allaah fiik",
        effects: [
          { type: 'quest_complete', questId: 'act_4_farmland_harvest_clue' },
          { type: 'story_flag', flag: 'act_4_complete', value: true },
          { type: 'relationship_change', amount: 1 },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ACT 5 — Wanderer Ali — Bedouin Camp
  // ────────────────────────────────────────────────────────────
  {
    id: 'arc_act_5',
    npcId: 'wanderer-ali',
    condition: { storyFlag: { key: 'act_4_complete', value: true } },
    lines: [
      {
        speaker: 'npc',
        arabic: 'رَأَيتُها! في لَيلَةِ القَمَر الكامِل — وَرَقَة تَتَساقَطُ مِن السَّماء كَنَجمَة ساقِطَة',
        english: 'I saw it! On the night of the full moon — a page falling from the sky like a shooting star.',
        transliteration: "ra'aytuha! fii laylat al-qamar al-kaamil — waraqa tatasaaqatu min as-samaa' ka-najma saaqita",
      },
      {
        speaker: 'npc',
        arabic: 'البَدو نَحنُ نَقرَأُ السَّماء كَما تَقرَأُ أَنتَ الكِتاب — كُلُّ نَجمَةٍ لَها اِسمٌ عَرَبيٌّ وَحِكايَة',
        english: 'We Bedouins read the sky as you read a book — every star has an Arabic name and a story.',
        transliteration: "al-badw nahnu naqra'u as-samaa' kamaa taqra'u anta al-kitaab — kullu najmatin lahaa ismun arabiyyun wa hikaaya",
      },
      {
        speaker: 'npc',
        arabic: 'أَخفَيتُ الصَّفحَة في أُغنيَة مَلّاحَة — لا أُعطيها لِمَن لا يَعرِفُ النُّجوم. نَجم — كَلِمَة تَعني نُقطَة ضَوء في السَّماء',
        english: "I hid the page in a navigation song — I won't give it to one who does not know the stars. Najm — a word meaning a point of light in the sky.",
        transliteration: "akhfaytu as-safha fii ughniyyat mallaaha — laa u'tiihaa liman laa ya'rif an-nujuum. najm — kalima ta'nii nuqtat daw' fis-samaa'",
        teachWord: 'najm',
        effects: [
          { type: 'quest_start', questId: 'act_5_bedouin_night_vision' },
          { type: 'story_flag', flag: 'arc_act_5_started', value: true },
        ],
      },
      // learningPath variants
      {
        speaker: 'npc',
        arabic: 'النُّجوم لَها أَسماء عَرَبيَّة لا تَزال تُستَخدَمُ حَتَّى اليَوم — العالِمُ يَحفَظُها كَما يَحفَظُ المَعادِلات',
        english: 'The stars carry Arabic names still used today — the scholar memorises them as he memorises equations.',
        transliteration: "an-nujuum lahaa asmaa' arabiyya laa tazaal tustakhdamu hattaa al-yawm — al-'aalim yahfazuhaa kamaa yahfaz al-mu'aadiilaat",
        condition: { learningPath: 'scholar' },
      },
      {
        speaker: 'npc',
        arabic: 'السَّماء هِيَ خَريطَة المُسافِر — اِحفَظ ثَلاثَة نُجوم وَلَن تَضِلَّ في أَيِّ صَحراء',
        english: 'The sky is the traveler\'s map — memorise three stars and you will never be lost in any desert.',
        transliteration: "as-samaa' hiya khariitat al-musaafir — ihfaz thalaatat nujuum wa lan tadilla fii ayy sahraa'",
        condition: { learningPath: 'traveler' },
      },
      {
        speaker: 'npc',
        arabic: 'البَدو حَفِظوا الفَلَكَ قَبلَ عَلماء بَغداد بِقُرون — الصَّحراء هِيَ أَوَّلُ مَرصَد',
        english: 'The Bedouin preserved astronomy centuries before the scholars of Baghdad — the desert was the first observatory.',
        transliteration: "al-badw hafizuu al-falak qabla 'ulamaa' baghdaad bi-quruun — as-sahraa' hiya awwal marsad",
        condition: { learningPath: 'historian' },
      },
    ],
  },
  {
    id: 'arc_act_5_complete',
    npcId: 'wanderer-ali',
    condition: {
      quest: { id: 'act_5_bedouin_night_vision', status: 'active' },
      storyFlag: { key: 'act_5_milestone_reached', value: true },
    },
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَحسَنتَ! قَرَأتَ أُغنيَة المَلّاحَة كَمَلّاحٍ حَقيقي! خُذ الصَّفحَة',
        english: 'Well done! You read the navigation song like a true navigator! Take the page.',
        transliteration: "ahsanta! qara'ta ughniyyat al-mallaaha ka-mallahin haqiiqii! khudh as-safha",
      },
      {
        speaker: 'npc',
        arabic: 'الطَّريق إلى الجَبَل مَفتوح. النُّجوم ستَدُلُّكَ — إنَّها لُغَةُ المُسافِرينَ مُنذُ الأَزَل',
        english: 'The road to the mountain is open. The stars will guide you — they are the language of travelers since time immemorial.',
        transliteration: "at-tariiq ilaa al-jabal maftuuh. an-nujuum sa-tadulluka — innahaa lughat al-musaaafiriin mundhuu al-azal",
        effects: [
          { type: 'quest_complete', questId: 'act_5_bedouin_night_vision' },
          { type: 'story_flag', flag: 'act_5_complete', value: true },
          { type: 'relationship_change', amount: 1 },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ACT 6 — Healer Khadija — Mountain Village
  // ────────────────────────────────────────────────────────────
  {
    id: 'arc_act_6',
    npcId: 'healer-khadija',
    condition: { storyFlag: { key: 'act_5_complete', value: true } },
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَحمَلُ هَذِهِ الوَرَقَةَ مُنذُ عَشرِ سَنَوات. كُنتُ أَظُنُّها وَصفَة طِبيَّة لِشِفاءِ المَرَضِ الغامِض',
        english: 'I have carried this page for ten years. I thought it was a medical recipe to cure the mysterious illness.',
        transliteration: "ahmilu haadhihi al-waraqata mundhu 'ashr sanawaat. kuntu azunnu-haa wasfa tibbiyya li-shifaa' al-marad al-ghaamid",
      },
      {
        speaker: 'npc',
        arabic: 'ابنُ سينا كَتَبَ القانون في الطِّبِّ بِالعَرَبيَّة — كِتابٌ ظَلَّ مَرجِعاً طِبيَّاً لِسِتَّةِ قُرون',
        english: 'Ibn Sina wrote the Canon of Medicine in Arabic — a book that remained a medical reference for six centuries.',
        transliteration: "ibn siinaa kataba al-qanuun fit-tibb bil-arabiyya — kitaabun zalla marji'an tibbiyan li-sittat quruun",
      },
      {
        speaker: 'npc',
        arabic: 'أُعطيكَ إيَّاها إن ثَبَتَّ لي أَنَّكَ تَعرِفُ لُغَةَ الشِّفاء. شِفاء — كَلِمَة تَعني العَودَة إلى الصِّحَّة',
        english: "I will give it to you if you prove you know the language of healing. Shifaa' — a word meaning the return to health.",
        transliteration: "u'tiika iyyaahaa in thabatta lii annaka ta'rifu lughat ash-shifaa'. shifaa' — kalima ta'nii al-'awda ilaa as-sihha",
        teachWord: 'shifaa_a',
        effects: [
          { type: 'quest_start', questId: 'act_6_mountain_healer_secret' },
          { type: 'story_flag', flag: 'arc_act_6_started', value: true },
        ],
      },
      // learningPath variants
      {
        speaker: 'npc',
        arabic: 'الطِّبُّ عِلمٌ وَفَنٌّ — ابنُ سينا جَمَعَهُما في كِتابٍ واحِد لا يَزال يُقرَأ بَعدَ أَلفِ سَنَة',
        english: 'Medicine is both science and art — Ibn Sina united them in one book still read a thousand years later.',
        transliteration: "at-tibb 'ilmun wa fann — ibn siinaa jama'ahuma fii kitaabin waahid laa yazaal yuqra' ba'da alf sana",
        condition: { learningPath: 'scholar' },
      },
      {
        speaker: 'npc',
        arabic: 'كُلُّ مُسافِر يَجِبُ أَن يَعرِفَ بَعضَ الطِّبِّ — لُغَةُ الجِسم تُنقِذُكَ في كُلِّ أَرض',
        english: 'Every traveler must know some medicine — the language of the body saves you in every land.',
        transliteration: "kullu musaafir yajibu an ya'rif ba'd at-tibb — lughat al-jism tunqidhuka fii kulli ard",
        condition: { learningPath: 'traveler' },
      },
      {
        speaker: 'npc',
        arabic: 'الحَضارَة الإسلاميَّة أَنتَجَت أَعظَمَ الأَطبّاء — الرّازي وابنُ سينا وَابنُ الهَيثَم رَسَموا مَعالِمَ العِلمِ الحَديث',
        english: 'Islamic civilisation produced the greatest physicians — al-Razi, Ibn Sina, and Ibn al-Haytham shaped the foundations of modern science.',
        transliteration: "al-hadaara al-islaamiyya antajat a'zam al-attibbaa' — ar-raazii wa ibn siinaa wa ibn al-haytham rasamuu ma'aalim al-'ilm al-hadiith",
        condition: { learningPath: 'historian' },
      },
    ],
  },
  {
    id: 'arc_act_6_complete',
    npcId: 'healer-khadija',
    condition: {
      quest: { id: 'act_6_mountain_healer_secret', status: 'active' },
      storyFlag: { key: 'act_6_milestone_reached', value: true },
    },
    lines: [
      {
        speaker: 'npc',
        arabic: 'قَرَأتَ الأَبيات كَمُعالِجٍ حَقيقي. خُذ الصَّفحَة وَكُن بِخَير في رِحلَتِك',
        english: 'You read the verses like a true healer. Take the page and be well on your journey.',
        transliteration: "qara'ta al-abyaat ka-mu'aalijin haqiiqii. khudh as-safha wa kun bi-khayr fii rihlllatik",
      },
      {
        speaker: 'npc',
        arabic: 'الطِّبُّ العَرَبيُّ كانَ طِبَّ الرُّوح والجِسم مَعاً — كَما هَذِهِ الرِّحلَة تُشفي جُهلَكَ وَتَملَأُ قَلبَكَ بِالمَعرِفَة',
        english: 'Arab medicine healed both the soul and the body — just as this journey cures your ignorance and fills your heart with knowledge.',
        transliteration: "at-tibb al-arabii kaana tibb ar-ruuh wal-jism ma'an — kamaa haadhihi ar-rihlla tushfii jahlak wa tamla' qalbak bil-ma'rifa",
        effects: [
          { type: 'quest_complete', questId: 'act_6_mountain_healer_secret' },
          { type: 'story_flag', flag: 'act_6_complete', value: true },
          { type: 'relationship_change', amount: 1 },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ACT 7 — Captain Rashid — Coastal Port
  // ────────────────────────────────────────────────────────────
  {
    id: 'arc_act_7',
    npcId: 'captain-rashid',
    condition: { storyFlag: { key: 'act_6_complete', value: true } },
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَنا أَنتَظِرُكَ! سَمِعتُ أَنَّكَ تَبحَثُ عَن صَفَحات مَخطوطَة — أَنقَذتُ واحِدَةً مِن البَحر أَمسِ',
        english: 'I have been waiting for you! I heard you are searching for manuscript pages — I rescued one from the sea yesterday.',
        transliteration: "ana antaziruka! sami'tu annaka tabhathu 'an safahaat makhtuuta — anqadhtu waahidatan min al-bahr ams",
      },
      {
        speaker: 'npc',
        arabic: 'ابنُ ماجِد الملقَّب بِأَسَدِ البَحر كَتَبَ أَكثَرَ مِن أَربَعينَ كِتاباً في المَلاحَة — كُلُّها بِالعَرَبيَّة',
        english: "Ibn Majid, called the Lion of the Sea, wrote over forty books on navigation — all in Arabic.",
        transliteration: "ibn maajid al-mulaqqa bi-asad al-bahr kataba akthar min arba'iin kitaaban fil-malaaha — kulluhaa bil-arabiyya",
      },
      {
        speaker: 'npc',
        arabic: 'الصَّفحَة مَبلولَة — الكِتابَة عَرَبيَّة بَحريَّة لا أَعرِفُها. تَرجِمها لي وَهِيَ لَكَ. مَلاحَة — كَلِمَة تَعني فَنَّ قِيادَة السُّفُن',
        english: "The page is wet — the writing is nautical Arabic I do not know. Translate it for me and it is yours. Mallaaha — a word meaning the art of navigating ships.",
        transliteration: "as-safha mabluula — al-kataaba arabiyya bahriyya laa a'rifuhaa. tarjimhaa lii wa hiya lak. mallaaha — kalima ta'nii fann qiyyaadat as-sufun",
        teachWord: 'mallaaha',
        effects: [
          { type: 'quest_start', questId: 'act_7_port_navigator_compass' },
          { type: 'story_flag', flag: 'arc_act_7_started', value: true },
        ],
      },
      // learningPath variants
      {
        speaker: 'npc',
        arabic: 'الكِتابَة البَحريَّة العَرَبيَّة لَها مُصطَلَحاتٌ مُتَخَصِّصَة — العالِمُ يُميِّزُ بَينَ لُغَةِ الفَلَك وَلُغَةِ البَحر',
        english: 'Arabic nautical writing has specialised terminology — the scholar distinguishes between the language of astronomy and the language of the sea.',
        transliteration: "al-kitaaba al-bahriyya al-arabiyya lahaa mustalahaatun mutakhassisah — al-'aalim yumayyiz bayna lughat al-falak wa lughat al-bahr",
        condition: { learningPath: 'scholar' },
      },
      {
        speaker: 'npc',
        arabic: 'البَحرُ يُكَلِّمُ مَن يَعرِفُ لُغَتَه — كُلُّ عُقدَة في الحَبلِ البَحري لَها اِسمٌ عَرَبيٌّ وَقِصَّة',
        english: 'The sea speaks to those who know its language — every knot in the sailor\'s rope has an Arabic name and a story.',
        transliteration: "al-bahr yukallim man ya'rif lughataه — kullu 'uqda fil-habl al-bahriyy lahaa ismun arabiyyun wa qissa",
        condition: { learningPath: 'traveler' },
      },
      {
        speaker: 'npc',
        arabic: 'ابنُ ماجِد رَسَمَ خَريطَةَ المُحيط الهِندي قَبلَ فاسكو دي غاما — العَرَب فَتَحوا طُرُقَ البَحر لِلعالَم',
        english: 'Ibn Majid mapped the Indian Ocean before Vasco da Gama — the Arabs opened the sea routes for the world.',
        transliteration: "ibn maajid rasama khariitat al-muhhiit al-hindi qabla faasku di ghaama — al-'arab fatahhuu turuq al-bahr lil-'aalam",
        condition: { learningPath: 'historian' },
      },
    ],
  },
  {
    id: 'arc_act_7_complete',
    npcId: 'captain-rashid',
    condition: {
      quest: { id: 'act_7_port_navigator_compass', status: 'active' },
      storyFlag: { key: 'act_7_milestone_reached', value: true },
    },
    lines: [
      {
        speaker: 'npc',
        arabic: 'يا سَلام! تَرجَمتَها! إذَن القَصر المَلَكي هُوَ المَحَطَّة الأَخيرَة',
        english: 'Wonderful! You translated it! So the Royal Palace is the final destination.',
        transliteration: "yaa salaam! tarjamtahaa! idhan al-qasr al-malakii huwa al-mahatta al-akhiira",
      },
      {
        speaker: 'npc',
        arabic: 'البَحرُ العَرَبيُّ وَصَلَ الحَضارات — كَما هَذِهِ المَخطوطَة تَجمَعُ عُلومَ الأَرض كُلِّها. الرِّياحُ مَعَكَ يا صَديقي',
        english: 'The Arabian Sea connected civilizations — just as this manuscript gathers the knowledge of all the earth. The winds are with you, my friend.',
        transliteration: "al-bahr al-arabii wasala al-hadaaraat — kamaa haadhihi al-makhtuuta tajma'u 'uluum al-ard kullihaa. ar-riyaahu ma'aka yaa sadiiqii",
        effects: [
          { type: 'quest_complete', questId: 'act_7_port_navigator_compass' },
          { type: 'story_flag', flag: 'act_7_complete', value: true },
          { type: 'relationship_change', amount: 1 },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // ACT 8 — Vizier Abbas — Royal Palace
  // ────────────────────────────────────────────────────────────
  {
    id: 'arc_act_8',
    npcId: 'vizier-abbas',
    condition: { storyFlag: { key: 'act_7_complete', value: true } },
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَخيراً! الرَّحّالَةُ عَبرَ الزَّمَن وَصَلَ إلى القَصر. لَقَد كُنّا نَنتَظِرُكَ',
        english: 'At last! The time-traveling scholar has reached the palace. We have been waiting for you.',
        transliteration: "akhiiran! ar-rahhaalatu 'abra az-zaman wasala ilaa al-qasr. laqad kunnaa nantaziruk",
      },
      {
        speaker: 'npc',
        arabic: 'الشَّيخُ يوسُف في الواحَة أَرسَلَ إلَيَّ رِسالَةً — قالَ إنَّكَ تَحمِلُ سَبعَ صَفَحات وَلَكَ الثّامِنَة هُنا',
        english: 'Scholar Yusuf in the oasis sent me a message — he said you carry seven pages and the eighth one is here for you.',
        transliteration: "ash-shaykh yuusuf fil-waaha arsala ilayya risaalatan — qaala annaka tahmilu sab'a safahaat wa laka ath-thaaminata hunaa",
      },
      {
        speaker: 'npc',
        arabic: 'قَصيدَة — كَلِمَة تَعني كَلاماً مَوزوناً مِن القَلب. هَذِهِ الصَّفحَة تَكمِلُ القَصيدَة الكَونيَّة',
        english: "Qasiida — a word meaning measured speech from the heart. This page completes the cosmic poem.",
        transliteration: "qasiida — kalima ta'nii kalaaman mawzuunan min al-qalb. haadhihi as-safha tukmilu al-qasiida al-kawwaniyya",
        teachWord: 'qasiida',
        effects: [
          { type: 'quest_start', questId: 'act_8_palace_final_assembly' },
          { type: 'story_flag', flag: 'arc_act_8_started', value: true },
        ],
      },
      // learningPath variants
      {
        speaker: 'npc',
        arabic: 'القَصيدَة العَرَبيَّة الكَلاسيكيَّة تَتَّبِعُ أَوزاناً دَقيقَة وَبُحوراً شِعريَّة — إنَّها عِلمٌ قَبلَ أَن تَكونَ فَنّاً',
        english: 'The classical Arabic qasida follows precise metres and poetic rhythms — it is a science before it is an art.',
        transliteration: "al-qasiida al-arabiyya al-klasiikiyya tattabi'u awzaanan daqiiqa wa buhuuunan shi'riyya — innahaa 'ilmun qabla an takuuna fannan",
        condition: { learningPath: 'scholar' },
      },
      {
        speaker: 'npc',
        arabic: 'الشُّعَراء العَرَب كانوا مُسافِرينَ أَيضاً — القَصيدَة تُسَجِّلُ الرِّحلَة وَتَحمِلُ ذِكرى كُلِّ مَكان',
        english: 'Arab poets were also travelers — the qasida records the journey and carries the memory of every place.',
        transliteration: "ash-shu'araa' al-'arab kaanuu musaafariin aydan — al-qasiida tusajjil ar-rihlla wa tahmilu dhikraa kulli makaan",
        condition: { learningPath: 'traveler' },
      },
      {
        speaker: 'npc',
        arabic: 'الشِّعرُ العَرَبيُّ يَبدَأُ قَبلَ الإسلام بِقُرون — المُعَلَّقاتُ السَّبعُ دُوِّنَت عَلى جُدرانِ الكَعبَة وَهِيَ أَعظَمُ ما كَتَبَهُ الإنسان',
        english: 'Arabic poetry begins centuries before Islam — the Seven Odes were inscribed on the walls of the Kaaba and are among the greatest texts ever written.',
        transliteration: "ash-shi'r al-arabii yabda' qabla al-islaam bi-quruun — al-mu'allaqaat as-sab' duwwinat 'alaa judran al-ka'ba wa hiya a'zam maa katabahu al-insaan",
        condition: { learningPath: 'historian' },
      },
    ],
  },
  {
    id: 'arc_act_8_complete',
    npcId: 'vizier-abbas',
    condition: {
      quest: { id: 'act_8_palace_final_assembly', status: 'active' },
      storyFlag: { key: 'act_8_milestone_reached', value: true },
    },
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَنشَدتَ القَصيدَة! السَّماء تَسمَعُكَ يا رَحّالَة الزَّمَن',
        english: 'You recited the poem! The heavens hear you, time-traveler.',
        transliteration: "anshadta al-qasiida! as-samaa' tasma'uka yaa rahhaalaz-zaman",
      },
      {
        speaker: 'npc',
        arabic: 'المَخطوطَة اِكتَمَلَت. سِرُّها هُوَ هَذا: اللُّغَةُ العَرَبيَّة لَيسَت كَلِمات — إنَّها طَريقٌ إلى فَهمِ الكَون',
        english: 'The manuscript is complete. Its secret is this: Arabic is not words — it is a path to understanding the universe.',
        transliteration: "al-makhtuuta iktamalat. sirruhaa huwa haadha: al-lugha al-arabiyya laysat kalimaat — innahaa tariiqun ilaa fahm al-kawn",
      },
      {
        speaker: 'npc',
        arabic: 'بَيتُ الحِكمَة لَم يَحتَرِق — إنَّهُ يَعيشُ فيكَ الآن. كُلُّ كَلِمَة تَعَلَّمتَها هِيَ صَفحَة مِن المَخطوطَة الكَبيرَة',
        english: 'The House of Wisdom did not burn — it lives in you now. Every word you learned is a page of the great manuscript.',
        transliteration: "bayt al-hikma lam yahtariq — innahu ya'iiish fiika al-aan. kullu kalima ta'allamtahaa hiya safha min al-makhtuuta al-kabiira",
        effects: [
          { type: 'quest_complete', questId: 'act_8_palace_final_assembly' },
          { type: 'story_flag', flag: 'act_8_complete', value: true },
          { type: 'relationship_change', amount: 1 },
        ],
      },
    ],
  },
];

/**
 * Merges story arc metadata and extra dialogue trees into NPC data.
 * Returns a new array — does NOT mutate the input.
 *
 * @param {Array} baseNpcs — the raw npcs.json array
 * @returns {Array} — enriched NPC array
 */
export function mergeNpcStoryArcs(baseNpcs) {
  return baseNpcs.map((npc) => {
    const meta = NPC_STORY_ARC_META[npc.id];
    const extraTrees = NPC_EXTRA_DIALOGUE_TREES[npc.id];

    if (!meta && !extraTrees) return npc;

    const merged = { ...npc };

    if (meta?.storyArc && !npc.storyArc) {
      merged.storyArc = meta.storyArc;
    }

    if (extraTrees && extraTrees.length > 0) {
      merged.dialogueTrees = [...(npc.dialogueTrees || []), ...extraTrees];
    }

    return merged;
  });
}

export { NPC_STORY_ARC_META, NPC_EXTRA_DIALOGUE_TREES, STORY_ACT_ARCS };
