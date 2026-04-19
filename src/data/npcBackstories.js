/**
 * npcBackstories.js — Phase 89: Expanded NPC Dialogue & Quest Storylines
 *
 * Deep backstories for the 24 main faction NPCs (4 per faction).
 * Each backstory enriches the NPC with motivations, secrets, relationship quotes,
 * teaching style, and favorite conversation topics.
 *
 * Faction-NPC assignments (4 per faction):
 *   scholars:  scholar-yusuf, librarian-ibrahim, scribe-amina, astronomer-zain
 *   merchants: merchant-fatima, trader-hassan, spice-seller-layla, carpet-seller-jamal
 *   artisans:  blacksmith-daud, weaver-zahra, baker-yasmin, herbalist-maryam
 *   travelers: guide-amira, wanderer-ali, captain-rashid, guide-salim
 *   guardians: guard-hamza, vizier-abbas, dockmaster-nadia, mountain-hermit-idris
 *   artists:   storyteller-noor, poet-rumi, princess-aisha, garden-keeper-leila
 */

export const NPC_BACKSTORIES = Object.freeze([

  // ═══════════════════════════════════════════════════════════════════════════
  // SCHOLARS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    npcId: 'scholar-yusuf',
    fullName: 'Sheikh Yusuf ibn Abdallah al-Nahawi',
    fullNameArabic: 'الشَّيخ يوسُف بن عبدالله النَّحوي',
    backstory:
      'Yusuf was born in a family of grammarians who traced their scholarly lineage back five centuries. ' +
      'He memorized the entire Alfiyya of Ibn Malik by age twelve and could parse any sentence in classical Arabic. ' +
      'A fire destroyed his family library when he was young, and he has spent his life reconstructing it from memory. ' +
      'He came to the Oasis Village seeking a lost manuscript that his grandfather once owned. ' +
      'His stern exterior hides a deep fear that the old knowledge will die if no one carries it forward.',
    backstoryArabic:
      'وُلِد يوسف في عائلة من النحويين. أحرقت النار مكتبة عائلته وهو صغير، فكرّس حياته لإعادة بنائها.',
    motivations: [
      'Preserve classical Arabic grammar for future generations',
      'Reconstruct his family library from memory and scattered pages',
      'Find a worthy student who will carry the knowledge forward',
    ],
    secrets: [
      'He knows the location of a hidden vault beneath the Ancient Library containing pre-Islamic manuscripts',
      'His grandfather was exiled from the Royal Palace for refusing to alter a historical text',
      'He can read three scripts that are considered extinct',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'العِلمُ لا يُعطى لِمَن لا يَستَحِقّ',
        english: 'Knowledge is not given to those who are unworthy.',
      },
      cautious: {
        arabic: 'أَراكَ تُحاوِل. هذا بِدايَة طَيِّبَة',
        english: 'I see you are trying. That is a good beginning.',
      },
      friendly: {
        arabic: 'تَعال، عِندي كِتاب خاصّ أُريدُ أَن أُريكَ إِيّاه',
        english: 'Come, I have a special book I want to show you.',
      },
      close: {
        arabic: 'أَنتَ الطّالِب الّذي اِنتَظَرتُهُ طوالَ حَياتي',
        english: 'You are the student I have waited for my entire life.',
      },
    },
    teachingStyle: 'Methodical and demanding — begins every lesson with a grammatical rule, expects precision, but rewards persistence with rare knowledge',
    favoriteTopics: ['classical Arabic grammar', 'manuscript history', 'the philosophy of language', 'calligraphic traditions'],
  },

  {
    npcId: 'librarian-ibrahim',
    fullName: 'Ibrahim ibn Musa al-Kitabi',
    fullNameArabic: 'إِبراهيم بن موسى الكِتابي',
    backstory:
      'Ibrahim grew up in the Ancient Library, raised by the previous librarian who found him as an orphan on the library steps. ' +
      'He learned to count by cataloguing books, and numbers became his first language before words. ' +
      'He has never left the library grounds in thirty years, believing the books would be stolen if he did. ' +
      'His knowledge of the collection is encyclopedic — he can find any scroll by smell alone. ' +
      'He secretly writes poetry at night but destroys it by morning, fearing it is not worthy of the great poets whose works surround him.',
    backstoryArabic:
      'نشأ إبراهيم في المكتبة يتيمًا، ربّاه أمين المكتبة السابق. لم يغادر المكتبة منذ ثلاثين سنة.',
    motivations: [
      'Protect every book in the library from damage or theft',
      'Catalogue the entire collection before he grows too old',
      'Find courage to share his own poetry with the world',
    ],
    secrets: [
      'He has memorized the contents of over three thousand books',
      'He secretly writes poetry at night and hides it in a hollow column',
      'He knows that some books in the restricted section contain dangerous alchemical formulas',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'المَكتَبَة لِلقُرّاء الجادّين فَقَط',
        english: 'The library is for serious readers only.',
      },
      cautious: {
        arabic: 'هل تُريدُ أَن تَقرَأَ أَم أَن تَلعَب؟',
        english: 'Do you want to read, or to play?',
      },
      friendly: {
        arabic: 'تَعال إِلى الطّابِق العُلوي — هُناكَ كُتُب لا يَراها أَحَد',
        english: 'Come to the upper floor — there are books nobody sees.',
      },
      close: {
        arabic: 'أَنتَ مِن أَهلِ المَكتَبَة الآن. هَذا المِفتاح لَكَ',
        english: 'You are family of the library now. This key is yours.',
      },
    },
    teachingStyle: 'Patient and systematic — teaches through numbered lists and categorization, making every lesson feel like organizing a shelf of knowledge',
    favoriteTopics: ['book preservation', 'number systems across civilizations', 'library architecture', 'the history of paper and ink'],
  },

  {
    npcId: 'scribe-amina',
    fullName: 'Amina bint Khalil al-Khattata',
    fullNameArabic: 'أَمينة بنت خليل الخطّاطة',
    backstory:
      'Amina was trained in calligraphy by her mother, who was the court scribe of a distant kingdom. ' +
      'When her mother fell ill, Amina took over her duties at age fourteen, forging diplomatic letters with a steady hand. ' +
      'She left the court after discovering corruption in the royal archives — documents had been altered to rewrite history. ' +
      'Now she teaches calligraphy in the Ancient Library, believing that beautiful writing carries truth. ' +
      'She keeps a locked chest containing the original versions of the altered documents, waiting for the right moment to reveal them.',
    backstoryArabic:
      'تعلّمت أمينة الخطّ العربي من أمّها. غادرت القصر بعد اكتشاف تزوير في السجلّات الملكية.',
    motivations: [
      'Teach calligraphy as a spiritual discipline, not merely decoration',
      'Preserve truth through authentic written records',
      'Find someone trustworthy enough to help expose the forged documents',
    ],
    secrets: [
      'She possesses original documents proving that the Royal Palace archives were tampered with',
      'Her calligraphy contains hidden messages visible only under moonlight — a technique her mother invented',
      'She once refused a marriage proposal from the Vizier and has avoided the Royal Palace ever since',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'الخَطّ الجَميل يَحتاج صَبرًا. هَل عِندَكَ صَبر؟',
        english: 'Beautiful writing requires patience. Do you have patience?',
      },
      cautious: {
        arabic: 'يَدُكَ ثابِتَة. هذا شَيء جَيِّد',
        english: 'Your hand is steady. That is a good thing.',
      },
      friendly: {
        arabic: 'خُذ هذا القَلَم — إِنَّهُ قَلَم أُمّي. اِستَخدِمهُ بِعِناية',
        english: 'Take this pen — it was my mother\'s. Use it with care.',
      },
      close: {
        arabic: 'عِندي سِرّ كَبير. أَنتَ الوَحيد الّذي أَثِقُ بِه',
        english: 'I have a great secret. You are the only one I trust.',
      },
    },
    teachingStyle: 'Artistic and meditative — each letter is a drawing, each word is a painting, each sentence is a landscape that reveals meaning through form',
    favoriteTopics: ['calligraphy styles across centuries', 'the connection between art and truth', 'color symbolism in manuscripts', 'the poetry of letters'],
  },

  {
    npcId: 'astronomer-zain',
    fullName: 'Zain al-Din ibn Haytham al-Falaki',
    fullNameArabic: 'زين الدين بن هيثم الفلكي',
    backstory:
      'Zain descends from a long line of astronomers who mapped the desert skies for Bedouin navigators. ' +
      'As a child, he lost his sight in one eye during a sandstorm, and his remaining eye became sharper than any telescope. ' +
      'He joined the Ancient Library to study the astronomical treatises of al-Biruni and al-Tusi. ' +
      'Every night he climbs to the library roof and charts the stars, believing they hold messages from God. ' +
      'He has predicted three eclipses with perfect accuracy, earning him both admiration and suspicion.',
    backstoryArabic:
      'ينحدر زين من عائلة فلكيين رسموا خرائط النجوم. فقد إحدى عينيه في عاصفة رملية فأصبحت الأخرى أقوى.',
    motivations: [
      'Complete a star atlas that maps every visible constellation with Arabic names',
      'Prove that mathematics is the language God used to write the universe',
      'Train a successor before his remaining eyesight fades',
    ],
    secrets: [
      'He has discovered a new star that appears only during the spring equinox',
      'His star charts contain navigation routes to a lost city buried in the desert',
      'He communicates with astronomers in distant lands through coded light signals from the library roof',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'النُّجوم لا تُكَلِّم مَن لا يَنظُر إِلَيها',
        english: 'The stars do not speak to those who do not look at them.',
      },
      cautious: {
        arabic: 'تَعال اللَّيلَة. سَأُريكَ نَجمَة لا يَعرِفُها أَحَد',
        english: 'Come tonight. I will show you a star that nobody knows.',
      },
      friendly: {
        arabic: 'عَيناكَ حادَّة. رُبَّما تَرى ما لا أَستَطيعُ رُؤيَتَه',
        english: 'Your eyes are sharp. Perhaps you see what I cannot.',
      },
      close: {
        arabic: 'خُذ هذا الأُسطُرلاب — كانَ لِجَدّي. الآن هُوَ لَكَ',
        english: 'Take this astrolabe — it was my grandfather\'s. Now it is yours.',
      },
    },
    teachingStyle: 'Wonder-driven — starts every lesson by pointing at the sky and asking a question, then teaches the Arabic numbers and words needed to answer it',
    favoriteTopics: ['constellation names in Arabic', 'mathematical proofs of celestial motion', 'the history of the astrolabe', 'navigation by starlight'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MERCHANTS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    npcId: 'merchant-fatima',
    fullName: 'Fatima bint Ahmad al-Tujjariya',
    fullNameArabic: 'فاطِمة بنت أحمد التُّجّارية',
    backstory:
      'Fatima inherited her father\'s trade stall at age sixteen when he fell ill during a merchant caravan journey. ' +
      'She turned a failing spice shop into the most profitable business in the Oasis Village through shrewd bargaining and genuine warmth. ' +
      'She speaks five languages from years of trading with foreign merchants and can spot a counterfeit coin at twenty paces. ' +
      'Despite her success, she sends half her earnings to her father\'s village to build a school. ' +
      'She secretly dreams of leading a caravan across the desert herself, but duty to her stall keeps her rooted.',
    backstoryArabic:
      'ورِثَت فاطمة دُكّان أبيها وهي في السادسة عشرة. حوّلته من متجر فاشل إلى أنجح تجارة في القرية.',
    motivations: [
      'Build her father\'s village school with her trading profits',
      'Prove that a woman can lead the merchant guild',
      'One day lead a great caravan across the desert',
    ],
    secrets: [
      'She can forge any merchant seal — a skill her father taught her for emergencies',
      'She has been secretly funding the Bedouin camp school for years',
      'She possesses a map to an ancient trade route that bypasses the Mountain Pass',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'أَنا مَشغولَة. إِذا ما عِندَكَ فُلوس، روح',
        english: 'I am busy. If you have no money, go.',
      },
      cautious: {
        arabic: 'أَنتَ زَبون مُنتَظِم. أُعطيكَ سِعر خاصّ',
        english: 'You are a regular customer. I will give you a special price.',
      },
      friendly: {
        arabic: 'تَعال اِشرَب شاي مَعي. الأَصدِقاء لا يَدفَعون',
        english: 'Come drink tea with me. Friends do not pay.',
      },
      close: {
        arabic: 'أَنتَ مِثل أَخي. عِندي خُطَّة كَبيرَة وَأُريدُ مُساعَدَتَك',
        english: 'You are like my brother. I have a big plan and I need your help.',
      },
    },
    teachingStyle: 'Transactional and practical — teaches vocabulary through mock haggling sessions, making every word feel like currency you can spend',
    favoriteTopics: ['trade route history', 'the art of negotiation', 'foreign merchant customs', 'the value of education'],
  },

  {
    npcId: 'trader-hassan',
    fullName: 'Hassan ibn Yusuf al-Bazari',
    fullNameArabic: 'حَسَن بن يوسف البازاري',
    backstory:
      'Hassan comes from a family of bazaar merchants who have held the same stall in the Desert Marketplace for four generations. ' +
      'He was once the wealthiest trader in the region until a dishonest partner swindled him out of his fortune. ' +
      'He rebuilt from nothing, learning to judge character as carefully as he judges merchandise. ' +
      'His booming voice and quick wit make him a marketplace legend, and newcomers seek him out for honest deals. ' +
      'He carries a small ledger containing the names of every person who ever cheated him — not for revenge, but so he never forgets the lesson.',
    backstoryArabic:
      'ينتمي حسن لعائلة تجّار أمضوا أربعة أجيال في نفس الدكّان. خسر ثروته بسبب شريك خائن ثم أعاد بناءها.',
    motivations: [
      'Restore his family name as the most trusted traders in the marketplace',
      'Teach young merchants the code of honest dealing',
      'Find and confront his former partner who disappeared with his gold',
    ],
    secrets: [
      'He secretly supplies food to families who cannot afford it, putting it on a tab they never have to pay',
      'His ledger of cheaters contains a coded entry that reveals the location of his hidden savings',
      'He once saved the Vizier\'s life during a marketplace fire and was promised a favor he has never collected',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'أَنتَ تَتَفَرَّج فَقَط؟ الوَقت مال يا صاحِبي',
        english: 'Are you just browsing? Time is money, my friend.',
      },
      cautious: {
        arabic: 'وَجهَكَ صادِق. تَعال نِتكَلَّم تِجارَة',
        english: 'Your face is honest. Come, let us talk business.',
      },
      friendly: {
        arabic: 'يا حَبيبي! تَفَضَّل، أَحسَن بَضاعَة مَحجوزَة لَكَ',
        english: 'My dear! Come in, the best goods are reserved for you.',
      },
      close: {
        arabic: 'خُذ هذا المِفتاح — مَخزَني مَخزَنَك. أَنتَ شَريكي',
        english: 'Take this key — my warehouse is your warehouse. You are my partner.',
      },
    },
    teachingStyle: 'Energetic and deal-oriented — turns every vocabulary lesson into a bargaining game where you practice words by buying and selling',
    favoriteTopics: ['marketplace folklore', 'the honor code of merchants', 'rare goods from distant lands', 'the mathematics of fair trade'],
  },

  {
    npcId: 'spice-seller-layla',
    fullName: 'Layla bint Rashid al-Bahariya',
    fullNameArabic: 'لَيلى بنت رشيد البَهارِيَّة',
    backstory:
      'Layla learned the spice trade from her grandmother, who could identify any spice by taste alone while blindfolded. ' +
      'She traveled the coastal trade routes as a young woman, collecting spices from ports across the known world. ' +
      'A storm sank her ship near the Coastal Port, and she lost her entire cargo — but swam ashore with her grandmother\'s recipe book. ' +
      'She rebuilt her business in the Desert Marketplace, where her warmth and knowledge of cooking draw crowds daily. ' +
      'She adds a pinch of secret spice to every sale — a blend her grandmother called "the taste of home."',
    backstoryArabic:
      'تعلّمت ليلى تجارة البهارات من جدّتها. فقدت كلّ شيء في عاصفة بحرية لكنها أنقذت كتاب وصفات جدّتها.',
    motivations: [
      'Keep her grandmother\'s recipes and spice knowledge alive',
      'Build a spice trade network that connects all eight zones',
      'Find the lost spice island her grandmother spoke of in bedtime stories',
    ],
    secrets: [
      'Her grandmother\'s recipe book contains medicinal formulas that can cure rare diseases',
      'She secretly supplies the Royal Palace kitchen with spices at no charge, in exchange for protection',
      'The "secret spice" she adds to every sale is actually a common herb — the real secret is her warm personality',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'تَفَضَّل شُمّ. بَسّ لا تِلمِس إِذا ما بِدَّك تِشتِري',
        english: 'Please smell. But do not touch if you do not want to buy.',
      },
      cautious: {
        arabic: 'أَنتَ تِعرِف تَطبُخ؟ خَلّيني أُعَلِّمَك شَيء',
        english: 'Do you know how to cook? Let me teach you something.',
      },
      friendly: {
        arabic: 'يا حَبيبي! تَعال كُل مَعانا. الأَكل حُبّ',
        english: 'My dear! Come eat with us. Food is love.',
      },
      close: {
        arabic: 'هذا كِتاب جَدَّتي. لا أُعطيهِ لِأَحَد — بَسّ أَنتَ مِثل عائِلتي',
        english: 'This is my grandmother\'s book. I give it to no one — but you are like my family.',
      },
    },
    teachingStyle: 'Sensory and immersive — teaches food vocabulary by describing tastes, smells, and textures, turning each word into a full experience',
    favoriteTopics: ['spice origins and trade routes', 'traditional recipes', 'the medicinal uses of herbs', 'family cooking traditions'],
  },

  {
    npcId: 'carpet-seller-jamal',
    fullName: 'Jamal ibn Mustafa al-Sajjadi',
    fullNameArabic: 'جَمال بن مصطفى السَّجّادي',
    backstory:
      'Jamal was a painter before he became a carpet seller, and he sees colors the way poets see words. ' +
      'His father forced him to abandon art for the family carpet business, and Jamal channeled his creativity into selecting the most beautiful carpets. ' +
      'He can tell a carpet\'s origin, age, and quality by running his fingers across the weave. ' +
      'Every carpet in his collection has a name and a story, and he refuses to sell to anyone who does not appreciate its beauty. ' +
      'He secretly paints at night, hiding his canvases beneath unsold carpets in the back of his stall.',
    backstoryArabic:
      'كان جمال رسّامًا قبل أن يصبح بائع سجّاد. يرى الألوان كما يرى الشعراء الكلمات.',
    motivations: [
      'Find the legendary "Carpet of a Thousand Colors" spoken of in Bedouin legends',
      'Prove to his father\'s memory that art and commerce can coexist',
      'Open a gallery where carpets are displayed as art, not merchandise',
    ],
    secrets: [
      'He paints masterpieces at night and hides them beneath unsold carpets',
      'He once sold a carpet to a stranger who turned out to be a djinn — and received a blessing in return',
      'He knows that the most expensive carpet in the Royal Palace is actually a forgery he identified years ago but never reported',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'شوف بِعينَك بَسّ. السَّجّاد مِش لِلمَس',
        english: 'Look with your eyes only. Carpets are not for touching.',
      },
      cautious: {
        arabic: 'أَنتَ تِعرِف اللَّون الأَزرَق هذا؟ لَه قِصَّة طَويلَة',
        english: 'Do you know this shade of blue? It has a long story.',
      },
      friendly: {
        arabic: 'تَعال اِقعُد عَلى هذا السَّجّاد. بَلّشني أَحكيلَك قِصَّته',
        english: 'Come sit on this carpet. Let me tell you its story.',
      },
      close: {
        arabic: 'عِندي سِرّ ما حَكيتُه لِحَدا. تَعال لَلمَحَلّ بَعد نُصّ اللَّيل',
        english: 'I have a secret I have told no one. Come to the shop after midnight.',
      },
    },
    teachingStyle: 'Visual and narrative — teaches colors by pointing at carpets and telling the story behind each hue, making vocabulary unforgettable through imagery',
    favoriteTopics: ['color theory in Islamic art', 'carpet weaving traditions', 'the geometry of patterns', 'the relationship between art and commerce'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTISANS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    npcId: 'blacksmith-daud',
    fullName: 'Daud ibn Sulaiman al-Haddad',
    fullNameArabic: 'داوُد بن سليمان الحَدّاد',
    backstory:
      'Daud\'s hands tell his story — scarred, calloused, and strong enough to bend iron. ' +
      'He was apprenticed to a master blacksmith at age eight and surpassed his teacher by fifteen. ' +
      'He forged the gates of the Coastal Port, the chandeliers of the Royal Palace, and the locks of the Ancient Library. ' +
      'He speaks little but listens deeply, and the rhythm of his hammer is a language unto itself. ' +
      'He lost his wife to an illness years ago and pours his grief into his craft, creating pieces of haunting beauty.',
    backstoryArabic:
      'تتلمذ داود على يد حدّاد ماهر وهو في الثامنة. صنع أبواب الميناء وثريّات القصر وأقفال المكتبة.',
    motivations: [
      'Create a masterwork that will outlast him by a thousand years',
      'Train an apprentice worthy of carrying on the craft',
      'Forge a memorial for his late wife from the finest steel',
    ],
    secrets: [
      'He discovered a technique for folding metal that makes blades unbreakable — he has shared it with no one',
      'He forged a secret passage key for the Royal Palace at the Vizier\'s request — and made a copy for himself',
      'The iron he works with comes from a meteorite that fell in the desert — he tells no one its origin',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'الحَديد يِتكَلَّم. أَنا لا',
        english: 'Iron speaks. I do not.',
      },
      cautious: {
        arabic: 'إِنتَ قَوي. ممكن تِشتِغِل بِالحَديد',
        english: 'You are strong. You could work with iron.',
      },
      friendly: {
        arabic: 'تَعال. خَلّيني أُعَلِّمَك كَيف تِسمَع الحَديد',
        english: 'Come. Let me teach you how to listen to iron.',
      },
      close: {
        arabic: 'صِنعِت هذا لَكَ. مِن أَفضَل حَديد عِندي. اِحتَفِظ بِه',
        english: 'I made this for you. From my finest iron. Keep it.',
      },
    },
    teachingStyle: 'Hands-on and rhythmic — teaches through the physical act of making, naming each tool and material as you use them together',
    favoriteTopics: ['metallurgy and its history', 'the philosophy of craftsmanship', 'the sounds of different metals', 'the beauty of functional objects'],
  },

  {
    npcId: 'weaver-zahra',
    fullName: 'Zahra bint Ismail al-Nassaja',
    fullNameArabic: 'زَهراء بنت إسماعيل النسّاجة',
    backstory:
      'Zahra comes from a Bedouin tribe famous for weaving the finest tent cloth in the desert. ' +
      'She ran away from an arranged marriage at seventeen and established herself in the Desert Marketplace with nothing but a loom and her skill. ' +
      'Her textiles are prized across all eight zones — the Royal Palace orders curtains from her, and Bedouin chiefs compete for her tent cloth. ' +
      'She is fiercely independent and judges people by the quality of their character, not their wealth. ' +
      'She weaves secret messages into her patterns using an old Bedouin code that only a few elders can still read.',
    backstoryArabic:
      'هربت زهراء من زواج مرتّب وأسّست عملها في السوق بمنسج واحد ومهارتها فقط.',
    motivations: [
      'Prove that a woman alone can build an empire through skill and determination',
      'Preserve the Bedouin weaving codes before the last elder who can read them dies',
      'Create a tapestry that tells the complete history of the desert people',
    ],
    secrets: [
      'Her woven patterns contain coded messages that Bedouin resistance fighters once used to communicate',
      'She knows where a hidden spring lies in the desert — information woven into her oldest tapestry',
      'She turned down an offer to be the Royal Weaver because she values her freedom above wealth',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'شوف بَسّ لا تِلمِس. الخَيط أَغلى مِنَّك',
        english: 'Look but do not touch. The thread is worth more than you.',
      },
      cautious: {
        arabic: 'إِيدَك ناعِمَة. يِمكِن تِتعَلَّم النَّسج',
        english: 'Your hands are soft. Perhaps you can learn to weave.',
      },
      friendly: {
        arabic: 'اِقعُد هون. خَلّيني أَحكيلَك عَن كُلّ خَيط',
        english: 'Sit here. Let me tell you about every thread.',
      },
      close: {
        arabic: 'في نَقشاتي رَسائِل سِرِّيَّة. هَل تُريد أَن تَتَعَلَّم قِراءَتَها؟',
        english: 'In my patterns there are secret messages. Do you want to learn to read them?',
      },
    },
    teachingStyle: 'Tactile and storytelling — names each color and fabric type as you handle them, weaving vocabulary into physical memory',
    favoriteTopics: ['textile history and trade', 'Bedouin weaving traditions', 'the symbolism of patterns', 'independence and self-reliance'],
  },

  {
    npcId: 'baker-yasmin',
    fullName: 'Yasmin bint Omar al-Khabbaza',
    fullNameArabic: 'ياسمين بنت عمر الخبّازة',
    backstory:
      'Yasmin was the youngest of eleven children and learned to bake because there was never enough bread for everyone. ' +
      'By age twelve she was feeding the entire neighborhood, and by twenty she was supplying bread to three zones. ' +
      'She believes that sharing food is the most sacred act, and she has never turned away a hungry person. ' +
      'Her bakery is the social heart of the Oasis Village — everyone gathers there at dawn for bread and gossip. ' +
      'She hides a painful truth: her oldest brother stole her mother\'s bread recipe and sold it to a merchant in a distant city.',
    backstoryArabic:
      'كانت ياسمين أصغر أحد عشر طفلاً. تعلّمت الخبز لأنّه لم يكن هناك خبز كافٍ للجميع.',
    motivations: [
      'Feed every hungry person who crosses her path',
      'Recover her mother\'s stolen recipe and bring it home',
      'Open bakeries in every zone so no one ever goes hungry',
    ],
    secrets: [
      'She adds a special herb to her bread that lifts people\'s mood — a recipe from Herbalist Maryam',
      'She has been secretly feeding the mysterious traveler who appears at night, asking no questions',
      'Her mother\'s stolen recipe contains a bread that can last a month without going stale — invaluable for desert caravans',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'الخُبز جاهِز. خُذ واحِد وَروح',
        english: 'The bread is ready. Take one and go.',
      },
      cautious: {
        arabic: 'تَعال. هذا خُبز طازَج مِن الفُرن',
        english: 'Come. This is fresh bread from the oven.',
      },
      friendly: {
        arabic: 'اِقعُد يا حَبيبي! خَلّيني أَعمَلَّك فُطور كامِل',
        english: 'Sit down, my dear! Let me make you a full breakfast.',
      },
      close: {
        arabic: 'أَنتَ مِثل وِلدي. خُذ — هذا سِرّ أُمّي في الخُبز',
        english: 'You are like my child. Take this — it is my mother\'s bread secret.',
      },
    },
    teachingStyle: 'Nurturing and recipe-based — teaches food vocabulary through cooking demonstrations, making you hungry and educated at the same time',
    favoriteTopics: ['bread traditions across cultures', 'the art of feeding a community', 'seasonal ingredients', 'food as an act of love'],
  },

  {
    npcId: 'herbalist-maryam',
    fullName: 'Maryam bint Abdullah al-Ashab',
    fullNameArabic: 'مَريم بنت عبدالله العشّابة',
    backstory:
      'Maryam grew up in the Hidden Oasis, raised by her herbalist mother among rare plants and flowing springs. ' +
      'She was sent to the Oasis Village as a young woman to serve as the community healer after the previous one retired. ' +
      'She can identify over five hundred plants by leaf shape alone and mixes remedies that doctors cannot explain. ' +
      'She misses the Hidden Oasis deeply but stays because the village needs her. ' +
      'She carries a seed pouch from her mother\'s garden, planting rare herbs wherever she goes, slowly connecting all the zones with medicinal gardens.',
    backstoryArabic:
      'نشأت مريم في الواحة المخفية مع أمّها العشّابة. أُرسِلت إلى القرية لتكون المعالجة بعد تقاعد السابقة.',
    motivations: [
      'Create a network of medicinal gardens connecting all eight zones',
      'Document every healing plant in the Arabic language before the knowledge is lost',
      'One day return to the Hidden Oasis and tend her mother\'s garden',
    ],
    secrets: [
      'She knows a herb that can restore lost memories — but it only grows in the Hidden Oasis',
      'She has been secretly treating the Mountain Hermit Idris for an illness he refuses to acknowledge',
      'Her mother told her the location of a legendary garden of immortal herbs, but she has never sought it out of respect for nature',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'كَيف حالَك؟ هذا سُؤال طِبّي، مِش مُجامَلَة',
        english: 'How are you? That is a medical question, not a pleasantry.',
      },
      cautious: {
        arabic: 'تَعال اِشرَب هذا الشّاي. فيهِ أَعشاب مُفيدَة',
        english: 'Come drink this tea. It has beneficial herbs.',
      },
      friendly: {
        arabic: 'شُمّ هذِهِ الزَّهرَة. تِفتَح العَقل وَتُقَوّي الذّاكِرَة',
        english: 'Smell this flower. It opens the mind and strengthens memory.',
      },
      close: {
        arabic: 'أُمّي عَلَّمتني سِرّ — في نَبتَة بِتِرجِّع الذّاكِرَة. بَسّ إِنتَ بِتِعرِف',
        english: 'My mother taught me a secret — there is a plant that restores memory. Only you know.',
      },
    },
    teachingStyle: 'Gentle and exploratory — teaches body parts and health vocabulary by examining plants and discussing their healing properties together',
    favoriteTopics: ['medicinal plants and their Arabic names', 'the connection between body and nature', 'traditional remedies', 'the Hidden Oasis and its treasures'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRAVELERS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    npcId: 'guide-amira',
    fullName: 'Amira bint Nasser al-Murshida',
    fullNameArabic: 'أَميرة بنت ناصر المُرشِدة',
    backstory:
      'Amira was the first woman to complete the Great Desert Crossing, a legendary journey through all eight zones that takes a full year. ' +
      'She did it alone at age nineteen, earning the title "al-Murshida" (the Guide) from the Bedouin elders who thought it impossible. ' +
      'She returned to the Oasis Village to guide newcomers, believing that everyone deserves a mentor on their first journey. ' +
      'She is patient with beginners but pushes advanced students hard, because she knows the desert does not forgive weakness. ' +
      'She carries a compass that always points to the Hidden Oasis — a gift from a mysterious figure she met during her crossing.',
    backstoryArabic:
      'أميرة أوّل امرأة أكملت عبور الصحراء الكبير. عادت لتكون مرشدة للقادمين الجدد.',
    motivations: [
      'Ensure every newcomer survives their first year and falls in love with Arabic',
      'Discover what lies beyond the Hidden Oasis — where her compass keeps pointing',
      'Write a guidebook of all eight zones in both Arabic and English',
    ],
    secrets: [
      'Her compass was given to her by a guardian spirit of the desert who appeared as an old woman',
      'She has mapped a ninth zone that she has never told anyone about — a floating garden in the clouds',
      'She was once engaged to Wanderer Ali, but they parted ways because the desert was too vast for two guides',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'اِمشي مَعي وَلا تِتأَخَّر. الصَّحرا ما بِتِستَنّى',
        english: 'Walk with me and do not fall behind. The desert does not wait.',
      },
      cautious: {
        arabic: 'أَنتَ أَقوى مِمّا تِظُنّ. بَسّ لازِم تُثبِت ذلِك',
        english: 'You are stronger than you think. But you must prove it.',
      },
      friendly: {
        arabic: 'يَلّا! خَلّيني أَوَرّيكَ مَكان ما شافُه أَحَد مِن قَبل',
        english: 'Come on! Let me show you a place no one has seen before.',
      },
      close: {
        arabic: 'خُذ هذِهِ البوصَلَة. إِذا ضِعتَ، بِتوَصِّلَك لِلبَيت',
        english: 'Take this compass. If you are lost, it will bring you home.',
      },
    },
    teachingStyle: 'Encouraging and journey-based — teaches by walking, naming everything you pass, turning exploration into a living vocabulary lesson',
    favoriteTopics: ['desert survival', 'navigation and wayfinding', 'the culture of each zone', 'the meaning of home'],
  },

  {
    npcId: 'wanderer-ali',
    fullName: 'Ali ibn Hamid al-Rahhala',
    fullNameArabic: 'عَلِيّ بن حامد الرَّحّالة',
    backstory:
      'Ali has never stayed in one place for more than a month. He was born during a sandstorm in the Desert Marketplace and has been moving ever since. ' +
      'He knows every trail, shortcut, and hidden path between the eight zones and speaks the dialects of each region fluently. ' +
      'He carries a walking stick carved with notches — one for every journey he has completed, now numbering in the hundreds. ' +
      'He is searching for a legendary oasis his father once described, a place where the water tastes like honey. ' +
      'His cheerful exterior masks a deep loneliness — he has many acquaintances in every zone but no place he can truly call home.',
    backstoryArabic:
      'وُلد علي في عاصفة رملية ولم يبقَ في مكان واحد أكثر من شهر. يعرف كلّ طريق وممرّ بين المناطق الثماني.',
    motivations: [
      'Find the legendary honey-water oasis his father described',
      'Map every hidden path between the eight zones',
      'Find a reason to stay — a home, a friend, a purpose',
    ],
    secrets: [
      'He was once engaged to Guide Amira before their paths diverged',
      'His walking stick is actually a key — the notches are a code that opens an ancient desert vault',
      'He can speak with desert animals through a technique taught by a Bedouin mystic',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'مَرحَبا! أَنا ماشي. إِذا بِدَّك تِمشي مَعي، يَلّا',
        english: 'Hello! I am walking. If you want to walk with me, let us go.',
      },
      cautious: {
        arabic: 'أَنتَ مُسافِر كَمان؟ الطَّريق أَحلى مَع صاحِب',
        english: 'Are you a traveler too? The road is sweeter with a companion.',
      },
      friendly: {
        arabic: 'يا سَلام! شوف — مِن هون تِقدَر تِشوف كُلّ المَناطِق',
        english: 'Amazing! Look — from here you can see all the zones.',
      },
      close: {
        arabic: 'أَوَّل مَرَّة حَسّيت إِنّي لَقيت بَيتي. أَنتَ بَيتي يا صَديقي',
        english: 'For the first time I feel I have found my home. You are my home, friend.',
      },
    },
    teachingStyle: 'Kinetic and spontaneous — teaches by pointing at things as you walk past them, making every journey a surprise vocabulary lesson',
    favoriteTopics: ['hidden trails and shortcuts', 'regional dialects', 'desert wildlife', 'the philosophy of wandering'],
  },

  {
    npcId: 'captain-rashid',
    fullName: 'Rashid ibn Salim al-Qubtan',
    fullNameArabic: 'رَشيد بن سليم القُبطان',
    backstory:
      'Captain Rashid commanded the fastest ship on the eastern trade routes for twenty years before retiring to the Coastal Port. ' +
      'He lost his ship in a great storm but saved every member of his crew, earning their lifelong loyalty. ' +
      'Now he trains young sailors and manages the port, but his eyes always drift to the horizon. ' +
      'He speaks with the authority of a man who has stared down hurricanes, and his navigation skills are unmatched. ' +
      'He carries a sealed bottle containing a letter to his daughter, who sailed west ten years ago and never returned.',
    backstoryArabic:
      'قاد رشيد أسرع سفينة على طرق التجارة الشرقية عشرين سنة. فقد سفينته في عاصفة لكنّه أنقذ كلّ طاقمه.',
    motivations: [
      'Find news of his daughter who sailed west and vanished',
      'Build a new ship worthy of one final voyage',
      'Pass on his navigation knowledge before the old ways are forgotten',
    ],
    secrets: [
      'He knows the coordinates of a sunken treasure ship but keeps them secret to protect the sea',
      'His daughter\'s departure was his fault — they argued about her marrying a foreigner, and she left in anger',
      'He can predict storms three days before they arrive by reading the color of the sunset',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'المِيناء مِش لِلسَّيّاح. إِذا ما بِتِعرِف تِسبَح، اِرجِع',
        english: 'The port is not for tourists. If you cannot swim, go back.',
      },
      cautious: {
        arabic: 'أَنتَ ما بِتخاف مِن المَوج. هذا كويِّس',
        english: 'You are not afraid of the waves. That is good.',
      },
      friendly: {
        arabic: 'تَعال عَلى السَّفينَة. خَلّيني أُعَلِّمَك كَيف تِقرا النُّجوم',
        english: 'Come aboard the ship. Let me teach you how to read the stars.',
      },
      close: {
        arabic: 'أَنتَ مِثل البَحر — عَميق وَأَمين. خُذ هذِهِ البوصَلَة',
        english: 'You are like the sea — deep and trustworthy. Take this compass.',
      },
    },
    teachingStyle: 'Commanding and practical — barks directions in Arabic, then explains them, making you learn through action under pressure',
    favoriteTopics: ['maritime navigation', 'star charts and celestial names', 'sea legends', 'the duty of a captain'],
  },

  {
    npcId: 'guide-salim',
    fullName: 'Salim ibn Tariq al-Dalil',
    fullNameArabic: 'سَليم بن طارق الدَّليل',
    backstory:
      'Salim is the youngest mountain guide in living memory, having scaled every peak of the Mountain Pass by age fifteen. ' +
      'He was raised by his uncle, Elder Tariq, after his parents disappeared during a mountain expedition when he was five. ' +
      'He searches every peak for signs of his parents, refusing to believe they are gone. ' +
      'His knowledge of mountain animals is encyclopedic — he can call eagles with a whistle and calm wild goats with a song. ' +
      'He seems perpetually cheerful, but those who know him well can see the sadness behind his smile.',
    backstoryArabic:
      'سليم أصغر دليل جبلي في الذاكرة. اختفى والداه في الجبل وهو في الخامسة. يبحث عنهما في كلّ قمّة.',
    motivations: [
      'Find any trace of his missing parents',
      'Map every cave and peak in the Mountain Pass',
      'Protect the mountain animals from hunters and poachers',
    ],
    secrets: [
      'He has found a cave with his mother\'s handwriting on the wall — she survived longer than anyone knows',
      'He can communicate with eagles through a whistle language taught to him by a mountain spirit',
      'He has discovered a mountain pass that leads to an unknown valley — but he is afraid to explore it alone',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'الجَبَل خَطير. لا تِمشي لَحالَك',
        english: 'The mountain is dangerous. Do not walk alone.',
      },
      cautious: {
        arabic: 'أَنتَ تِمشي كويِّس. الجَبَل بِيحِبّ اللّي بِيمشي بِهُدوء',
        english: 'You walk well. The mountain likes those who walk quietly.',
      },
      friendly: {
        arabic: 'تَعال! بِدّي أُوَرّيكَ عُشّ النِّسر. بَسّ لازِم نِكون هادّين',
        english: 'Come! I want to show you the eagle\'s nest. But we must be quiet.',
      },
      close: {
        arabic: 'وَجَدت شَيء في الجَبَل... أَثَر أُمّي. هَل تِجي مَعي أَبحَث؟',
        english: 'I found something on the mountain... my mother\'s trace. Will you come search with me?',
      },
    },
    teachingStyle: 'Adventurous and nature-based — teaches animal and adjective vocabulary by observing wildlife together, naming what you see in real time',
    favoriteTopics: ['mountain wildlife', 'survival skills', 'the music of nature', 'searching for lost things'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUARDIANS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    npcId: 'guard-hamza',
    fullName: 'Hamza ibn Khalid al-Harisi',
    fullNameArabic: 'حَمزة بن خالد الحارِسي',
    backstory:
      'Hamza was a reluctant soldier who became a guard by accident — he stopped a thief on his first day in the Oasis Village and was offered the job. ' +
      'He discovered he was good at protecting people, even though he dislikes violence. ' +
      'He enforces order with intimidation rather than force, using his deep voice and imposing frame. ' +
      'He is secretly a talented poet who writes verses on scraps of paper during night watch. ' +
      'He guards the village gate as if it were his own family\'s door, because he has no family of his own.',
    backstoryArabic:
      'أصبح حمزة حارسًا بالصدفة عندما أوقف لصًّا في يومه الأوّل. يحمي القرية كأنّها عائلته.',
    motivations: [
      'Protect the innocent without resorting to violence',
      'Find the courage to share his poetry with others',
      'Build a family of his own someday',
    ],
    secrets: [
      'He writes poetry during night watch — his verses rival those of Poet Rumi',
      'He intentionally lets certain "criminals" pass the gate — orphans and refugees who need shelter',
      'He once served as a bodyguard for the Princess and still watches over the Royal Palace from afar',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'قِف! وين رايِح؟ ما في دُخول بِدون إِذن',
        english: 'Halt! Where are you going? No entry without permission.',
      },
      cautious: {
        arabic: 'أَنا شِفتَك قَبل. وَجهَك مألوف. تَفَضَّل',
        english: 'I have seen you before. Your face is familiar. Come in.',
      },
      friendly: {
        arabic: 'يا هَلا! تَعال اِقعُد مَعي. اللَّيل طَويل وَالحِراسَة مُمِلَّة',
        english: 'Hey! Come sit with me. The night is long and guard duty is boring.',
      },
      close: {
        arabic: 'عِندي شَيء كَتَبتُه... ما حَدا قَرَأه قَبلَك. بِدَّك تِسمَع؟',
        english: 'I wrote something... no one has read it before you. Do you want to hear it?',
      },
    },
    teachingStyle: 'Call-and-response — barks phrases in Arabic and expects you to repeat them, military-drill style, but with a hidden warmth',
    favoriteTopics: ['the duty of protection', 'poetry and hidden feelings', 'the stories of travelers who pass the gate', 'justice without violence'],
  },

  {
    npcId: 'vizier-abbas',
    fullName: 'Abbas ibn Salah al-Waziri',
    fullNameArabic: 'عَبّاس بن صلاح الوَزيري',
    backstory:
      'Vizier Abbas has served three rulers and outlasted two coups, navigating court politics with a mind as sharp as a Damascus blade. ' +
      'He was born a commoner in the Desert Marketplace, but his intelligence earned him a scholarship to study law and diplomacy. ' +
      'He rose through the ranks by being the only advisor who told the truth when everyone else lied. ' +
      'He is feared for his formal manner but respected for his incorruptible sense of justice. ' +
      'He carries a heavy burden: he knows a secret about the kingdom\'s founding that could shake the very throne he serves.',
    backstoryArabic:
      'خدم عبّاس ثلاثة حكّام ونجا من انقلابين. وُلد في السوق لكنّ ذكاءه أوصله إلى القصر.',
    motivations: [
      'Maintain justice and order in the kingdom at any cost',
      'Find an heir worthy of the truth about the kingdom\'s founding',
      'Retire with honor and write a history of what he has witnessed',
    ],
    secrets: [
      'He knows the current ruling family came to power through a deception, not legitimate succession',
      'He has a network of informants in every zone who report to him through coded letters',
      'He once pardoned a criminal who turned out to be innocent — and that criminal now serves as a guard in another zone',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'القَصر لَهُ قَوانين. اِحتَرِمها أَو اُترُكهُ',
        english: 'The palace has rules. Respect them or leave.',
      },
      cautious: {
        arabic: 'أَنتَ تَفهَم البروتوكول. هذا يُثير اِهتِمامي',
        english: 'You understand protocol. That interests me.',
      },
      friendly: {
        arabic: 'اِجلِس. لَدَيّ مَسأَلَة تَحتاج عَقلاً ذَكِيّاً مِثلَك',
        english: 'Sit down. I have a matter that needs a sharp mind like yours.',
      },
      close: {
        arabic: 'أَنتَ الوَحيد الّذي أَثِقُ بِه. عِندي سِرّ يُغَيِّر كُلّ شَيء',
        english: 'You are the only one I trust. I have a secret that changes everything.',
      },
    },
    teachingStyle: 'Formal and protocol-based — teaches etiquette phrases through diplomatic scenarios, making you feel the weight and precision of formal Arabic',
    favoriteTopics: ['diplomacy and statecraft', 'the history of law', 'the art of truthful speech', 'the burden of power'],
  },

  {
    npcId: 'dockmaster-nadia',
    fullName: 'Nadia bint Karim al-Minaiya',
    fullNameArabic: 'نادِية بنت كريم المينائيّة',
    backstory:
      'Nadia inherited the dockmaster position from her father, becoming the first woman to hold the post in the Coastal Port\'s history. ' +
      'She faced resistance from the male sailors but earned their respect by outworking and outthinking every one of them. ' +
      'She runs the port with military precision, knowing that a single mistake could sink a ship or lose a cargo. ' +
      'She has memorized the tide tables and wind patterns so thoroughly that she can predict arrivals days in advance. ' +
      'Beneath her strict exterior, she mourns her father, who died at sea, and she keeps his captain\'s log locked in her office.',
    backstoryArabic:
      'ورثت نادية منصب رئيسة الميناء من أبيها. أوّل امرأة تشغل هذا المنصب في تاريخ الميناء.',
    motivations: [
      'Run the most efficient port in the region and prove her doubters wrong',
      'Complete her father\'s unfinished captain\'s log with her own entries',
      'Establish a maritime academy to train the next generation of sailors',
    ],
    secrets: [
      'Her father\'s log contains coordinates to a chain of islands no one has visited in a century',
      'She secretly allows certain refugee ships to dock without inspection — because she was a refugee child herself',
      'She has been corresponding with Captain Rashid\'s missing daughter through coded messages delivered by carrier birds',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'المِيناء مِش مَلعَب. فيه قَوانين هون',
        english: 'The port is not a playground. There are rules here.',
      },
      cautious: {
        arabic: 'بِتِعرِف تِتبَع الأَوامِر؟ ممكن يِكون عِندي شُغل لَكَ',
        english: 'Can you follow orders? I might have work for you.',
      },
      friendly: {
        arabic: 'تَعال مَعي عَالسَّطح. أَبي كان يِحِبّ يِتفَرَّج عَالبَحر مِن هون',
        english: 'Come with me to the roof. My father used to watch the sea from here.',
      },
      close: {
        arabic: 'خُذ سِجِلّ أَبي. فيه أَسرار لَم يَرَها أَحَد. أَثِق بِكَ',
        english: 'Take my father\'s log. It has secrets no one has seen. I trust you.',
      },
    },
    teachingStyle: 'Drill-sergeant efficient — teaches direction vocabulary through rapid-fire port commands, building muscle memory for navigational Arabic',
    favoriteTopics: ['port logistics and organization', 'maritime law', 'storm prediction', 'the legacy of female leaders'],
  },

  {
    npcId: 'mountain-hermit-idris',
    fullName: 'Idris ibn Nuh al-Zahid',
    fullNameArabic: 'إِدريس بن نوح الزاهِد',
    backstory:
      'Idris was once the most celebrated teacher in the Royal Palace, tutoring princes and princesses in philosophy and Arabic. ' +
      'He left court life abruptly after a philosophical disagreement with the ruler, retreating to the Mountain Pass. ' +
      'He has lived alone on the mountain for fifteen years, speaking mainly to the wind, the stones, and the occasional eagle. ' +
      'His mind is as sharp as ever, and pilgrims climb the mountain seeking his wisdom — though he turns most away. ' +
      'He is slowly going blind from an eye condition and accepts it as part of the mountain\'s teaching.',
    backstoryArabic:
      'كان إدريس أشهر معلّم في القصر الملكي. ترك الحياة الملكية وعاش وحيدًا في الجبل خمس عشرة سنة.',
    motivations: [
      'Achieve inner peace through solitude and contemplation',
      'Write a philosophical treatise on the nature of language and truth',
      'Find one student worthy of his accumulated lifetime of knowledge',
    ],
    secrets: [
      'He left the palace because he discovered the ruler was planning to burn certain books — and he smuggled them out first',
      'The books he saved are hidden in a cave on the mountain, preserved in oiled leather',
      'He is slowly losing his sight but has developed an ability to "hear" the mountain that borders on the supernatural',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'الجَبَل ما بِيحِبّ الضَّوضا. اِرجِع',
        english: 'The mountain does not like noise. Go back.',
      },
      cautious: {
        arabic: 'أَنتَ صَعِدت لَلهون. هذا يَدُلّ عَلى عَزيمَة',
        english: 'You climbed all the way here. That shows determination.',
      },
      friendly: {
        arabic: 'اِقعُد. خَلّيني أُعَلِّمَك كَيف تِسمَع الجَبَل',
        english: 'Sit. Let me teach you how to listen to the mountain.',
      },
      close: {
        arabic: 'في مَغارَة فوق — فيها كُتُب أَنقَذتُها مِن النّار. تَعال مَعي',
        english: 'There is a cave above — it holds books I saved from the fire. Come with me.',
      },
    },
    teachingStyle: 'Socratic and contemplative — asks questions in Arabic and waits patiently for you to find the answer, teaching through reflection rather than instruction',
    favoriteTopics: ['the philosophy of language', 'the wisdom of nature', 'solitude and self-knowledge', 'the difference between knowledge and wisdom'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTISTS FACTION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    npcId: 'storyteller-noor',
    fullName: 'Noor bint Zayd al-Rawiya',
    fullNameArabic: 'نور بنت زيد الرّاوِية',
    backstory:
      'Noor is the last living master of the "Rawiya" tradition — oral historians who memorize entire epics and recite them from memory. ' +
      'She learned over a thousand stories from her blind grandmother, who could recite for three days without repeating herself. ' +
      'Noor travels between zones performing in marketplaces, campfires, and palace courts, adapting each story to her audience. ' +
      'She is searching for the ending to an unfinished epic her grandmother began but died before completing. ' +
      'Every story she tells is true — she has witnessed more of the world than anyone suspects.',
    backstoryArabic:
      'نور آخر أساتذة تقليد الرواية الشفهية. حفظت أكثر من ألف قصّة من جدّتها الكفيفة.',
    motivations: [
      'Complete her grandmother\'s unfinished epic before the tradition dies',
      'Record the oral traditions in writing to preserve them forever',
      'Find a young storyteller to inherit her thousand stories',
    ],
    secrets: [
      'Her stories contain coded historical truths that powerful people have tried to suppress',
      'She knows the true identity of the Mysterious Traveler who appears at night',
      'Her grandmother\'s unfinished epic contains a prophecy about the player — the one who will unite all zones through language',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'القِصَّة مِش لِلكُلّ. لازِم تِستاهِلها',
        english: 'The story is not for everyone. You must be worthy of it.',
      },
      cautious: {
        arabic: 'بِدَّك تِسمَع قِصَّة؟ اِقعُد وَسَكِّت',
        english: 'Do you want to hear a story? Sit down and be quiet.',
      },
      friendly: {
        arabic: 'يا سَلام عَلَيك! عِندي قِصَّة خاصَّة ما حَكيتها لِحَدا',
        english: 'How wonderful you are! I have a special story I have told no one.',
      },
      close: {
        arabic: 'أَنتَ جُزء مِن القِصَّة الكُبرى. جَدَّتي تَنَبَّأَت بِقُدومَك',
        english: 'You are part of the great story. My grandmother prophesied your coming.',
      },
    },
    teachingStyle: 'Narrative and emotional — teaches adjectives and descriptive words through storytelling, making each word carry the weight of a character or scene',
    favoriteTopics: ['the art of oral storytelling', 'legendary heroes of the desert', 'the power of words to shape reality', 'the dying traditions worth saving'],
  },

  {
    npcId: 'poet-rumi',
    fullName: 'Jalal al-Din al-Rumi al-Shi\'ri',
    fullNameArabic: 'جلال الدين الرّومي الشِّعري',
    backstory:
      'Rumi is a wandering poet who settled in the Oasis Village after years of traveling through distant lands. ' +
      'He writes in three languages but believes Arabic is the closest to the language of the soul. ' +
      'He was once the court poet of a foreign kingdom but left after the king demanded he write propaganda instead of truth. ' +
      'He sees beauty in everything — even in suffering, which he considers the raw material of great poetry. ' +
      'He carries a notebook of unfinished poems, each one waiting for the right experience to complete it.',
    backstoryArabic:
      'رومي شاعر متجوّل استقرّ في القرية بعد سنوات من السفر. يكتب بثلاث لغات لكنّه يؤمن أنّ العربية أقرب للغة الروح.',
    motivations: [
      'Write the perfect poem — one that captures all of human experience in a single verse',
      'Teach others to see beauty in the ordinary world around them',
      'Complete his notebook of unfinished poems before he dies',
    ],
    secrets: [
      'He was banished from the foreign court for writing a poem exposing the king\'s cruelty — the poem spread like wildfire',
      'His poems contain mathematical patterns that encode navigation coordinates — poetry and science united',
      'He is deeply in love with the Garden Keeper Leila but expresses it only through poems he leaves at her garden gate',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'الجَمال في كُلّ مَكان. بَسّ مِش كُلّ عَين بِتشوفُه',
        english: 'Beauty is everywhere. But not every eye can see it.',
      },
      cautious: {
        arabic: 'عَيناك حَزينَة. الحُزن أَفضَل مُعَلِّم لِلشِّعر',
        english: 'Your eyes are sad. Sadness is the best teacher of poetry.',
      },
      friendly: {
        arabic: 'اِسمَع — كَتَبت بَيت شِعر عَنَّك. هَل تُريد أَن تَسمَعَه؟',
        english: 'Listen — I wrote a verse about you. Would you like to hear it?',
      },
      close: {
        arabic: 'خُذ دَفتَري. كُلّ قَصيدَة غَير مُكتَمِلَة تَنتَظِر مَن يُكمِلُها — أَنتَ',
        english: 'Take my notebook. Every unfinished poem waits for someone to complete it — you.',
      },
    },
    teachingStyle: 'Poetic and metaphorical — teaches colors and adjectives through verse, making each word feel like a brushstroke in a painting of the soul',
    favoriteTopics: ['poetry as spiritual practice', 'the beauty of Arabic sounds', 'color symbolism in poetry', 'the connection between language and love'],
  },

  {
    npcId: 'princess-aisha',
    fullName: 'Aisha bint Sultan al-Malikiya',
    fullNameArabic: 'عائِشة بنت السُّلطان المَلَكِيَّة',
    backstory:
      'Princess Aisha is the youngest daughter of the ruler, but she cares nothing for politics or protocol. ' +
      'She is a linguist at heart, fluent in seven languages, who sees the Royal Palace as a cage rather than a home. ' +
      'She secretly teaches reading to servants\' children in a hidden palace room, believing education is a right, not a privilege. ' +
      'She has been betrothed to a foreign prince she has never met, and she is searching for a way to choose her own path. ' +
      'She maintains a network of pen pals across the known world, exchanging letters in every language she speaks.',
    backstoryArabic:
      'عائشة أصغر بنات السلطان. لا تهتمّ بالسياسة وتعلّم القراءة سرًّا لأطفال الخدم في القصر.',
    motivations: [
      'Use her position to make education accessible to everyone in the kingdom',
      'Find a way to break her arranged betrothal without shaming her family',
      'Build a school of languages where all people — rich and poor — can learn together',
    ],
    secrets: [
      'She has been secretly teaching servants\' children to read and write in a hidden palace classroom',
      'She has already written a letter to her betrothed prince canceling the engagement — but has not yet sent it',
      'She discovered that Scribe Amina\'s forged documents prove her family\'s claim to the throne is built on a lie — and she does not know what to do with this knowledge',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'أَنا مَشغولَة. تَكَلَّم مَع الوَزير إِذا بِدَّك شَيء',
        english: 'I am busy. Speak with the Vizier if you need something.',
      },
      cautious: {
        arabic: 'أَنتَ مُختَلِف عَن باقي الزُوّار. بِتِحِبّ اللُّغات؟',
        english: 'You are different from the other visitors. Do you love languages?',
      },
      friendly: {
        arabic: 'تَعال مَعي — عِندي مَكان سِرّي في القَصر. لا تِحكي لِحَدا',
        english: 'Come with me — I have a secret place in the palace. Tell no one.',
      },
      close: {
        arabic: 'أَنتَ صَديقي الحَقيقي الوَحيد. ساعِدني أُغَيِّر مَصيري',
        english: 'You are my only true friend. Help me change my destiny.',
      },
    },
    teachingStyle: 'Comparative and multilingual — teaches family vocabulary by drawing parallels between Arabic and other languages, showing how families express love in every tongue',
    favoriteTopics: ['the beauty of multilingualism', 'education as a human right', 'family bonds across cultures', 'choosing your own path'],
  },

  {
    npcId: 'garden-keeper-leila',
    fullName: 'Leila bint Yaqub al-Hadiqiya',
    fullNameArabic: 'لَيلى بنت يعقوب الحَديقِيَّة',
    backstory:
      'Leila grew up in a family of botanists who believed that every plant has a name, a story, and a soul. ' +
      'She created the Garden District from a barren patch of land, transforming it into the most beautiful green space in all the zones. ' +
      'She speaks to plants in Arabic, convinced they respond to the musicality of the language. ' +
      'She is an artist who paints with living things — arranging flowers and trees the way a poet arranges words. ' +
      'She has planted a seed from every zone in her garden, creating a living map of the entire world.',
    backstoryArabic:
      'حوّلت ليلى أرضًا قاحلة إلى أجمل حديقة في المناطق كلّها. تتكلّم مع النباتات بالعربية.',
    motivations: [
      'Create a garden so beautiful that it brings people from all zones together',
      'Prove that Arabic has a special connection to the natural world',
      'Grow a plant from the legendary seed of the Tree of Knowledge',
    ],
    secrets: [
      'She has a single seed from the legendary Tree of Knowledge, but it refuses to germinate — she believes it is waiting for the right person',
      'She receives anonymous poems left at her garden gate every morning — they are from Poet Rumi, though she has not discovered this yet',
      'Her garden contains a plant that blooms only once a year, on the night of the spring equinox — its pollen reveals invisible writing on ancient manuscripts',
    ],
    relationshipQuotes: {
      cold: {
        arabic: 'الحَديقَة لِلّي بِيحِبّوا الطَّبيعَة. إِنتَ بِتحِبّ الطَّبيعَة؟',
        english: 'The garden is for those who love nature. Do you love nature?',
      },
      cautious: {
        arabic: 'اِمسِك هَالوَردَة بِرِفق. هِيَّ حَيَّة مِثلَك',
        english: 'Hold this flower gently. It is alive, like you.',
      },
      friendly: {
        arabic: 'تَعال! اِزرَع بِذرَة مَعي. كُلّ بِذرَة قِصَّة جَديدَة',
        english: 'Come! Plant a seed with me. Every seed is a new story.',
      },
      close: {
        arabic: 'عِندي بِذرَة مِن شَجَرَة المَعرِفَة. بَسّ هِيَّ بِتِستَنّاك إِنتَ',
        english: 'I have a seed from the Tree of Knowledge. But it has been waiting for you.',
      },
    },
    teachingStyle: 'Peaceful and sensory — teaches nature vocabulary by walking through the garden together, naming plants, colors, and seasons in a meditative pace',
    favoriteTopics: ['the Arabic names of plants', 'the art of gardens', 'the seasons and their meanings', 'the poetry hidden in nature'],
  },

]);

/** Convenience lookup: npcId → backstory object */
export const BACKSTORY_BY_NPC_ID = Object.freeze(
  Object.fromEntries(NPC_BACKSTORIES.map((b) => [b.npcId, b]))
);

/** All NPC IDs that have backstories */
export const BACKSTORIED_NPC_IDS = Object.freeze(NPC_BACKSTORIES.map((b) => b.npcId));

/** Faction→NPC mapping for backstoried NPCs */
export const FACTION_NPC_MAP = Object.freeze({
  scholars: ['scholar-yusuf', 'librarian-ibrahim', 'scribe-amina', 'astronomer-zain'],
  merchants: ['merchant-fatima', 'trader-hassan', 'spice-seller-layla', 'carpet-seller-jamal'],
  artisans: ['blacksmith-daud', 'weaver-zahra', 'baker-yasmin', 'herbalist-maryam'],
  travelers: ['guide-amira', 'wanderer-ali', 'captain-rashid', 'guide-salim'],
  guardians: ['guard-hamza', 'vizier-abbas', 'dockmaster-nadia', 'mountain-hermit-idris'],
  artists: ['storyteller-noor', 'poet-rumi', 'princess-aisha', 'garden-keeper-leila'],
});
