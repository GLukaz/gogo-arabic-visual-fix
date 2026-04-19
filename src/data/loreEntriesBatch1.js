/**
 * Lore Entries Batch 1 — 150 entries across 5 categories
 * Categories: history (30), culture (30), language (30), geography (30), religion (30)
 *
 * Rarity distribution:
 *   history:   3 legendary, 5 rare, 10 uncommon, 12 common
 *   culture:   2 legendary, 4 rare, 10 uncommon, 14 common
 *   language:  2 legendary, 4 rare, 12 uncommon, 12 common
 *   geography: 1 legendary, 3 rare, 12 uncommon, 14 common
 *   religion:  2 legendary, 4 rare, 10 uncommon, 14 common
 */

export const LORE_ENTRIES_BATCH_1 = [
  // ═══════════════════════════════════════════════════════════════════
  //  HISTORY (30 entries)
  // ═══════════════════════════════════════════════════════════════════

  // ── Legendary (3) ──
  {
    id: 'history_001',
    title: 'Ibn Sina — The Prince of Physicians',
    titleArabic: 'ابن سينا — أمير الأطباء',
    category: 'history',
    content: 'Ibn Sina (Avicenna, 980–1037 CE) wrote "The Canon of Medicine," a medical encyclopedia that served as the primary textbook in European and Islamic universities for over 600 years. He classified over 760 drugs and was the first to describe many infectious diseases. His works bridged Greek philosophy and Islamic theology, earning him the title "The Prince of Physicians."',
    contentArabic: 'ابن سينا كتب "القانون في الطب" الذي أصبح المرجع الأساسي في الجامعات الأوروبية والإسلامية لأكثر من ستمائة عام. يُلقَّب بأمير الأطباء.',
    keyTerm: { arabic: 'طبيب', english: 'physician', transliteration: 'ṭabīb' },
    discoveryTrigger: 'npc_talk:scholar-yusuf',
    zone: 'ancient-library',
    rarity: 'legendary'
  },
  {
    id: 'history_002',
    title: 'Al-Khwarizmi — Father of Algebra',
    titleArabic: 'الخوارزمي — أبو الجبر',
    category: 'history',
    content: 'Muhammad ibn Musa al-Khwarizmi (c. 780–850 CE) was a Persian mathematician whose treatise "Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala" gave us the word "algebra." His name, Latinized as "Algoritmi," became the root of the word "algorithm." He also introduced Hindu-Arabic numerals to the Western world and made foundational contributions to astronomy and geography.',
    contentArabic: 'الخوارزمي عالم رياضيات فارسي قدّم كلمة "الجبر" للعالم من خلال كتابه الشهير. كما أنّ اسمه أصبح أصل كلمة "خوارزمية".',
    keyTerm: { arabic: 'الجبر', english: 'algebra', transliteration: 'al-jabr' },
    discoveryTrigger: 'quest_complete:main_quest_5',
    zone: 'ancient-library',
    rarity: 'legendary'
  },
  {
    id: 'history_003',
    title: 'The House of Wisdom',
    titleArabic: 'بيت الحكمة',
    category: 'history',
    content: 'The House of Wisdom (Bayt al-Hikma) was a major intellectual center in Baghdad during the Abbasid Caliphate, particularly under Caliph al-Ma\'mun (r. 813–833 CE). Scholars translated Greek, Persian, and Indian manuscripts into Arabic, preserving knowledge that might otherwise have been lost. It served as a library, translation bureau, and academy, attracting polymaths from across the known world.',
    contentArabic: 'بيت الحكمة كان مركزًا علميًّا كبيرًا في بغداد حيث تُرجمت مخطوطات يونانية وفارسية وهندية إلى العربية. جمع علماء من مختلف أنحاء العالم.',
    keyTerm: { arabic: 'حكمة', english: 'wisdom', transliteration: 'ḥikma' },
    discoveryTrigger: 'faction_tier:scholars:allied',
    zone: 'ancient-library',
    rarity: 'legendary'
  },

  // ── Rare (5) ──
  {
    id: 'history_004',
    title: 'Ibn Rushd — The Commentator',
    titleArabic: 'ابن رشد — الشارح',
    category: 'history',
    content: 'Ibn Rushd (Averroes, 1126–1198 CE) was an Andalusian polymath whose commentaries on Aristotle shaped European scholastic philosophy. He argued that philosophy and religion were complementary paths to truth. Thomas Aquinas frequently cited him, calling him simply "The Commentator."',
    contentArabic: 'ابن رشد فيلسوف أندلسي اشتُهر بشروحه على أعمال أرسطو وأثّر في الفلسفة الأوروبية تأثيرًا عميقًا.',
    keyTerm: { arabic: 'فلسفة', english: 'philosophy', transliteration: 'falsafa' },
    discoveryTrigger: 'npc_talk:librarian-ibrahim',
    zone: 'ancient-library',
    rarity: 'rare'
  },
  {
    id: 'history_005',
    title: 'The Battle of Badr',
    titleArabic: 'غزوة بدر',
    category: 'history',
    content: 'The Battle of Badr (624 CE) was the first major military engagement between the early Muslims of Medina and the Quraysh of Mecca. Despite being outnumbered roughly three to one, the Muslim force of about 313 men prevailed. The victory was a turning point that solidified the young Muslim community and is extensively referenced in the Quran.',
    contentArabic: 'غزوة بدر كانت أول معركة كبرى بين المسلمين وقريش، وانتصر فيها المسلمون رغم قلة عددهم.',
    keyTerm: { arabic: 'نصر', english: 'victory', transliteration: 'naṣr' },
    discoveryTrigger: 'quest_complete:side_quest_scholars_3',
    zone: null,
    rarity: 'rare'
  },
  {
    id: 'history_006',
    title: 'The Fall of Baghdad (1258)',
    titleArabic: 'سقوط بغداد',
    category: 'history',
    content: 'In 1258 CE, the Mongol army under Hulagu Khan sacked Baghdad, destroying the House of Wisdom and ending the Abbasid Caliphate. Accounts describe the Tigris running black with ink from the countless manuscripts thrown into it. The event marked the symbolic end of the Islamic Golden Age and reshaped the political landscape of the Muslim world.',
    contentArabic: 'في عام ١٢٥٨م اجتاح المغول بغداد ودمّروا بيت الحكمة، وأُلقيت آلاف المخطوطات في نهر دجلة.',
    keyTerm: { arabic: 'سقوط', english: 'fall / downfall', transliteration: 'suqūṭ' },
    discoveryTrigger: 'level_reach:15',
    zone: null,
    rarity: 'rare'
  },
  {
    id: 'history_007',
    title: 'Saladin and the Reconquest of Jerusalem',
    titleArabic: 'صلاح الدين وتحرير القدس',
    category: 'history',
    content: 'Salah ad-Din Yusuf ibn Ayyub (Saladin, 1137–1193 CE) unified Egypt and Syria and recaptured Jerusalem from the Crusaders in 1187 CE after the Battle of Hattin. He was renowned even among his enemies for his chivalry and mercy, allowing Christian pilgrims to continue visiting the holy city.',
    contentArabic: 'صلاح الدين الأيوبي وحّد مصر والشام واستعاد القدس من الصليبيين عام ١١٨٧م بعد معركة حطّين.',
    keyTerm: { arabic: 'فارس', english: 'knight / horseman', transliteration: 'fāris' },
    discoveryTrigger: 'npc_talk:elder-tariq',
    zone: 'royal-palace',
    rarity: 'rare'
  },
  {
    id: 'history_008',
    title: 'Ibn Khaldun — Father of Sociology',
    titleArabic: 'ابن خلدون — أبو علم الاجتماع',
    category: 'history',
    content: 'Ibn Khaldun (1332–1406 CE) was a North African historian whose "Muqaddimah" (Prolegomena) introduced a scientific approach to the study of history and society. He theorized about the rise and fall of civilizations through cycles of asabiyyah (social cohesion). Many consider him the founder of sociology, historiography, and economics as distinct disciplines.',
    contentArabic: 'ابن خلدون مؤرّخ من شمال أفريقيا ألّف "المقدّمة" التي تُعدّ أساس علم الاجتماع الحديث.',
    keyTerm: { arabic: 'عصبيّة', english: 'social cohesion / solidarity', transliteration: 'ʿaṣabiyya' },
    discoveryTrigger: 'faction_tier:scholars:trusted',
    zone: 'ancient-library',
    rarity: 'rare'
  },

  // ── Uncommon (10) ──
  {
    id: 'history_009',
    title: 'The Abbasid Golden Age',
    titleArabic: 'العصر الذهبي العباسي',
    category: 'history',
    content: 'The Abbasid Caliphate (750–1258 CE) presided over the Islamic Golden Age, a period of extraordinary cultural, scientific, and economic flourishing. Baghdad became the world\'s largest city, and the caliphs patronized scholars in mathematics, astronomy, medicine, and philosophy. Trade routes connected the caliphate from Spain to China.',
    contentArabic: 'الخلافة العباسية أشرفت على العصر الذهبي الإسلامي حيث ازدهرت العلوم والثقافة والتجارة.',
    keyTerm: { arabic: 'خلافة', english: 'caliphate', transliteration: 'khilāfa' },
    discoveryTrigger: 'zone_visit:ancient-library',
    zone: 'ancient-library',
    rarity: 'uncommon'
  },
  {
    id: 'history_010',
    title: 'Al-Andalus — Islamic Iberia',
    titleArabic: 'الأندلس',
    category: 'history',
    content: 'Al-Andalus refers to the parts of the Iberian Peninsula governed by Muslims from 711 to 1492 CE. Cities like Córdoba, Granada, and Seville became centers of learning where Muslims, Christians, and Jews collaborated in translating and expanding upon classical knowledge. The Alhambra in Granada remains one of the finest examples of Islamic architecture.',
    contentArabic: 'الأندلس هي المنطقة الإسلامية في شبه الجزيرة الإيبيرية التي شهدت تعايشًا بين المسلمين والمسيحيين واليهود.',
    keyTerm: { arabic: 'حضارة', english: 'civilization', transliteration: 'ḥaḍāra' },
    discoveryTrigger: 'word_learn:word_hadara',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'history_011',
    title: 'The Umayyad Dynasty',
    titleArabic: 'الدولة الأموية',
    category: 'history',
    content: 'The Umayyad Caliphate (661–750 CE) was the first hereditary dynasty in Islamic history, ruling from Damascus. It expanded the Islamic empire to its greatest territorial extent, stretching from Spain to Central Asia. The Umayyads built the Dome of the Rock in Jerusalem and the Great Mosque of Damascus, two of Islam\'s earliest architectural masterpieces.',
    contentArabic: 'الدولة الأموية حكمت من دمشق ووسّعت رقعة الإسلام من إسبانيا إلى آسيا الوسطى.',
    keyTerm: { arabic: 'دولة', english: 'state / dynasty', transliteration: 'dawla' },
    discoveryTrigger: 'npc_talk:vizier-abbas',
    zone: 'royal-palace',
    rarity: 'uncommon'
  },
  {
    id: 'history_012',
    title: 'Al-Biruni — The Master of Measurement',
    titleArabic: 'البيروني — أستاذ القياس',
    category: 'history',
    content: 'Abu Rayhan al-Biruni (973–1048 CE) calculated the Earth\'s circumference to within 16 km of the modern value using a method involving mountain heights and trigonometry. He authored over 140 works on topics from astronomy to pharmacology and was one of the first scholars to study Indian culture and religion objectively.',
    contentArabic: 'البيروني حسب محيط الأرض بدقة مذهلة باستخدام حسابات رياضية متقدّمة وألّف أكثر من مئة وأربعين كتابًا.',
    keyTerm: { arabic: 'قياس', english: 'measurement', transliteration: 'qiyās' },
    discoveryTrigger: 'quest_complete:side_quest_scholars_2',
    zone: 'ancient-library',
    rarity: 'uncommon'
  },
  {
    id: 'history_013',
    title: 'The Silk Road and the Arab Merchants',
    titleArabic: 'طريق الحرير والتجّار العرب',
    category: 'history',
    content: 'Arab merchants were key intermediaries on the Silk Road, the ancient network of trade routes connecting China to the Mediterranean. They traded silk, spices, precious metals, and ideas. Arab navigators perfected the use of the astrolabe and the lateen sail, enabling maritime trade across the Indian Ocean.',
    contentArabic: 'كان التجّار العرب وسطاء رئيسيين على طريق الحرير، يتاجرون بالحرير والتوابل والمعادن الثمينة.',
    keyTerm: { arabic: 'تاجر', english: 'merchant', transliteration: 'tājir' },
    discoveryTrigger: 'npc_talk:merchant-fatima',
    zone: 'desert-marketplace',
    rarity: 'uncommon'
  },
  {
    id: 'history_014',
    title: 'The Early Islamic Conquests',
    titleArabic: 'الفتوحات الإسلامية المبكّرة',
    category: 'history',
    content: 'In the decades after the Prophet Muhammad\'s death in 632 CE, Arab armies expanded rapidly, conquering the Sasanian Persian Empire and taking the Levant and Egypt from the Byzantine Empire. These conquests established the framework of the Arab-Islamic world and brought diverse peoples under a new cultural and linguistic umbrella.',
    contentArabic: 'بعد وفاة النبي محمد توسّعت الجيوش العربية بسرعة وفتحت بلاد فارس والشام ومصر.',
    keyTerm: { arabic: 'فتح', english: 'conquest / opening', transliteration: 'fatḥ' },
    discoveryTrigger: 'level_reach:10',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'history_015',
    title: 'The Ottoman Empire and the Arab World',
    titleArabic: 'الدولة العثمانية والعالم العربي',
    category: 'history',
    content: 'The Ottoman Empire (1299–1922 CE) ruled much of the Arab world for roughly four centuries. Ottoman sultans held the title of caliph and controlled the holy cities of Mecca and Medina. Arabic remained the language of religion and scholarship, while Ottoman Turkish was used in administration.',
    contentArabic: 'حكمت الدولة العثمانية معظم العالم العربي لنحو أربعة قرون واحتفظت بلقب الخلافة.',
    keyTerm: { arabic: 'سلطان', english: 'sultan', transliteration: 'sulṭān' },
    discoveryTrigger: 'zone_visit:royal-palace',
    zone: 'royal-palace',
    rarity: 'uncommon'
  },
  {
    id: 'history_016',
    title: 'The Nabataeans and Petra',
    titleArabic: 'الأنباط والبتراء',
    category: 'history',
    content: 'The Nabataeans were an ancient Arab people who built Petra, a city carved into rose-red cliffs in modern-day Jordan. At its height around the 1st century CE, Petra controlled trade routes for frankincense, myrrh, and spices. The Nabataeans developed sophisticated water management systems in the desert, including dams, cisterns, and aqueducts.',
    contentArabic: 'الأنباط شعب عربي قديم بنى مدينة البتراء المنحوتة في الصخر الوردي في الأردن الحالي.',
    keyTerm: { arabic: 'صخرة', english: 'rock', transliteration: 'ṣakhra' },
    discoveryTrigger: 'zone_visit:mountain-pass',
    zone: 'mountain-pass',
    rarity: 'uncommon'
  },
  {
    id: 'history_017',
    title: 'Pre-Islamic Arabia — The Age of Jahiliyyah',
    titleArabic: 'الجاهلية — عصر ما قبل الإسلام',
    category: 'history',
    content: 'The period before Islam is known as the Jahiliyyah ("Age of Ignorance"). Arabian society was tribal, with the Kaaba in Mecca serving as a pilgrimage site housing hundreds of idols. The era also produced a rich tradition of oral poetry, with the Mu\'allaqat being the most celebrated collection of pre-Islamic odes.',
    contentArabic: 'الجاهلية هي الفترة السابقة للإسلام حيث كان المجتمع العربي قبليًّا وازدهر فيه الشعر الجاهلي.',
    keyTerm: { arabic: 'قبيلة', english: 'tribe', transliteration: 'qabīla' },
    discoveryTrigger: 'npc_talk:elder-tariq',
    zone: 'bedouin-camp',
    rarity: 'uncommon'
  },
  {
    id: 'history_018',
    title: 'Islamic Coinage and Economy',
    titleArabic: 'العملات والاقتصاد الإسلامي',
    category: 'history',
    content: 'Caliph Abd al-Malik ibn Marwan introduced the first purely Islamic coinage around 696 CE, replacing Byzantine and Sasanian coins with dinars and dirhams bearing Arabic inscriptions. This monetary reform unified trade across the vast Islamic empire and established a standard that influenced global economics for centuries.',
    contentArabic: 'قدّم الخليفة عبد الملك بن مروان أول عملات إسلامية بحتة حوالي عام ٦٩٦م لتوحيد التجارة.',
    keyTerm: { arabic: 'دينار', english: 'dinar (gold coin)', transliteration: 'dīnār' },
    discoveryTrigger: 'npc_talk:merchant-fatima',
    zone: 'desert-marketplace',
    rarity: 'uncommon'
  },

  // ── Common (12) ──
  {
    id: 'history_019',
    title: 'The Hijra — Migration to Medina',
    titleArabic: 'الهجرة إلى المدينة',
    category: 'history',
    content: 'The Hijra (622 CE) was the Prophet Muhammad\'s migration from Mecca to Medina, marking the start of the Islamic calendar. In Medina, Muhammad established the first Muslim community and negotiated the Constitution of Medina, which defined the rights of various religious and tribal groups.',
    contentArabic: 'الهجرة هي انتقال النبي محمد من مكة إلى المدينة عام ٦٢٢م وتمثّل بداية التقويم الهجري.',
    keyTerm: { arabic: 'هجرة', english: 'migration', transliteration: 'hijra' },
    discoveryTrigger: 'word_learn:word_hijra',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'history_020',
    title: 'The Rightly Guided Caliphs',
    titleArabic: 'الخلفاء الراشدون',
    category: 'history',
    content: 'The four Rightly Guided Caliphs (al-Khulafa ar-Rashidun) — Abu Bakr, Umar, Uthman, and Ali — led the Muslim community after the Prophet Muhammad\'s death (632–661 CE). Under their leadership, the Quran was compiled into a single codex and the Islamic state expanded dramatically.',
    contentArabic: 'الخلفاء الراشدون هم أبو بكر وعمر وعثمان وعلي، وقادوا المسلمين بعد وفاة النبي.',
    keyTerm: { arabic: 'خليفة', english: 'caliph / successor', transliteration: 'khalīfa' },
    discoveryTrigger: 'level_reach:3',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'history_021',
    title: 'Islamic Hospitals — The Bimaristan',
    titleArabic: 'البيمارستان — المستشفى الإسلامي',
    category: 'history',
    content: 'Islamic civilization pioneered the concept of the public hospital (bimaristan). The earliest known hospital was established in Baghdad in the 8th century CE. These institutions provided free care to all, regardless of religion or wealth, and included specialized wards, pharmacies, and medical training programs.',
    contentArabic: 'البيمارستان هو المستشفى العام الذي ابتكره المسلمون وقدّم العلاج المجاني للجميع.',
    keyTerm: { arabic: 'مستشفى', english: 'hospital', transliteration: 'mustashfā' },
    discoveryTrigger: 'word_learn:word_tabib',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'history_022',
    title: 'The Great Mosque of Córdoba',
    titleArabic: 'جامع قرطبة الكبير',
    category: 'history',
    content: 'The Great Mosque of Córdoba (Mezquita) was built in 784 CE and expanded over two centuries into one of the largest mosques in the world. Its forest of double-arched columns in red and white stone remains an icon of Moorish architecture. After the Reconquista, it was converted into a Catholic cathedral.',
    contentArabic: 'جامع قرطبة الكبير بُني عام ٧٨٤م ويُعدّ تحفة معمارية من عصر الأندلس.',
    keyTerm: { arabic: 'جامع', english: 'mosque / congregational mosque', transliteration: 'jāmiʿ' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'history_023',
    title: 'Paper-Making Arrives in the Arab World',
    titleArabic: 'وصول صناعة الورق إلى العالم العربي',
    category: 'history',
    content: 'After the Battle of Talas (751 CE) between Abbasid and Tang Chinese forces, Arab craftsmen learned the art of paper-making from Chinese prisoners. Paper mills were established in Samarkand, then Baghdad, and eventually across the Islamic world, making books far cheaper and accelerating scholarship.',
    contentArabic: 'تعلّم العرب صناعة الورق من أسرى صينيين بعد معركة طلاس عام ٧٥١م.',
    keyTerm: { arabic: 'ورق', english: 'paper', transliteration: 'waraq' },
    discoveryTrigger: 'quest_complete:side_quest_scholars_1',
    zone: 'ancient-library',
    rarity: 'common'
  },
  {
    id: 'history_024',
    title: 'The Astrolabe in Islamic Astronomy',
    titleArabic: 'الأسطرلاب في علم الفلك الإسلامي',
    category: 'history',
    content: 'Muslim astronomers refined the astrolabe, an ancient instrument for measuring the positions of stars. It was used to determine the direction of Mecca (qibla) for prayer, calculate prayer times, and navigate at sea. The astrolabe represents the practical fusion of science and faith in Islamic civilization.',
    contentArabic: 'طوّر الفلكيون المسلمون الأسطرلاب واستخدموه لتحديد اتجاه القبلة وحساب أوقات الصلاة.',
    keyTerm: { arabic: 'نجم', english: 'star', transliteration: 'najm' },
    discoveryTrigger: 'word_learn:word_najm',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'history_025',
    title: 'The Treaty of Hudaybiyyah',
    titleArabic: 'صلح الحديبية',
    category: 'history',
    content: 'The Treaty of Hudaybiyyah (628 CE) was a pivotal peace agreement between Prophet Muhammad and the Quraysh of Mecca. Although initially seen as unfavorable to the Muslims, it led to a ten-year ceasefire that allowed Islam to spread peacefully and ultimately paved the way for the peaceful conquest of Mecca in 630 CE.',
    contentArabic: 'صلح الحديبية اتفاقية سلام بين النبي محمد وقريش أدّت في النهاية إلى فتح مكة سلميًّا.',
    keyTerm: { arabic: 'صلح', english: 'peace treaty', transliteration: 'ṣulḥ' },
    discoveryTrigger: 'level_reach:5',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'history_026',
    title: 'Harun al-Rashid — The Legendary Caliph',
    titleArabic: 'هارون الرشيد',
    category: 'history',
    content: 'Harun al-Rashid (r. 786–809 CE) was the fifth Abbasid caliph and presided over Baghdad at the height of its splendor. He exchanged embassies with Charlemagne and is a central figure in the "One Thousand and One Nights." His patronage of the arts and sciences helped make Baghdad the world\'s preeminent cultural capital.',
    contentArabic: 'هارون الرشيد خامس الخلفاء العباسيين حكم بغداد في أوج ازدهارها وهو شخصية محورية في ألف ليلة وليلة.',
    keyTerm: { arabic: 'خليفة', english: 'caliph', transliteration: 'khalīfa' },
    discoveryTrigger: 'zone_visit:royal-palace',
    zone: 'royal-palace',
    rarity: 'common'
  },
  {
    id: 'history_027',
    title: 'The Fatimid Caliphate and Cairo',
    titleArabic: 'الخلافة الفاطمية والقاهرة',
    category: 'history',
    content: 'The Fatimid Caliphate (909–1171 CE) was a Shia dynasty that founded the city of Cairo in 969 CE and established Al-Azhar University, one of the oldest continuously operating universities in the world. The Fatimids promoted trade, art, and architecture across North Africa and the Levant.',
    contentArabic: 'الخلافة الفاطمية أسّست مدينة القاهرة عام ٩٦٩م وأنشأت جامعة الأزهر العريقة.',
    keyTerm: { arabic: 'جامعة', english: 'university', transliteration: 'jāmiʿa' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'history_028',
    title: 'Arab Navigation and the Indian Ocean',
    titleArabic: 'الملاحة العربية والمحيط الهندي',
    category: 'history',
    content: 'Arab sailors dominated Indian Ocean trade for centuries using the monsoon winds. Ahmad ibn Majid, known as the "Lion of the Sea," wrote navigational treatises in the 15th century that guided ships from East Africa to China. Arab maritime knowledge was so advanced that Vasco da Gama reportedly relied on an Arab pilot to reach India.',
    contentArabic: 'سيطر البحّارة العرب على تجارة المحيط الهندي لقرون مستخدمين الرياح الموسمية.',
    keyTerm: { arabic: 'بحر', english: 'sea', transliteration: 'baḥr' },
    discoveryTrigger: 'zone_visit:coastal-port',
    zone: 'coastal-port',
    rarity: 'common'
  },
  {
    id: 'history_029',
    title: 'The Mamluk Sultanate',
    titleArabic: 'سلطنة المماليك',
    category: 'history',
    content: 'The Mamluks were originally slave soldiers who rose to rule Egypt and Syria (1250–1517 CE). They decisively defeated the Mongols at the Battle of Ain Jalut in 1260 CE, stopping the Mongol westward advance. The Mamluks became patrons of art and architecture, leaving a lasting legacy in Cairo\'s skyline.',
    contentArabic: 'المماليك كانوا جنودًا أصبحوا حكّامًا لمصر والشام وهزموا المغول في عين جالوت.',
    keyTerm: { arabic: 'جيش', english: 'army', transliteration: 'jaysh' },
    discoveryTrigger: 'level_reach:12',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'history_030',
    title: 'Islamic Optics — Ibn al-Haytham',
    titleArabic: 'علم البصريات — ابن الهيثم',
    category: 'history',
    content: 'Ibn al-Haytham (Alhazen, 965–1040 CE) is considered the father of modern optics. His "Book of Optics" (Kitab al-Manazir) proved that vision results from light entering the eye, not rays emitting from it. He pioneered the scientific method, insisting on experimental verification of hypotheses.',
    contentArabic: 'ابن الهيثم أبو البصريات الحديثة أثبت أن الرؤية تحدث بدخول الضوء إلى العين.',
    keyTerm: { arabic: 'ضوء', english: 'light', transliteration: 'ḍawʾ' },
    discoveryTrigger: 'word_learn:word_kitab',
    zone: 'ancient-library',
    rarity: 'common'
  },

  // ═══════════════════════════════════════════════════════════════════
  //  CULTURE (30 entries)
  // ═══════════════════════════════════════════════════════════════════

  // ── Legendary (2) ──
  {
    id: 'culture_001',
    title: 'Arabic Hospitality — Diyafa',
    titleArabic: 'الضيافة العربية',
    category: 'culture',
    content: 'Diyafa (hospitality) is one of the most sacred values in Arab culture, rooted in the harsh conditions of desert life where turning away a stranger could mean death. Tradition mandates that a guest must be sheltered and fed for three days without being asked the reason for their visit. Coffee is always served first, and refusing it can be considered rude.',
    contentArabic: 'الضيافة من أقدس القيم في الثقافة العربية، حيث يجب إكرام الضيف وإطعامه لمدة ثلاثة أيام دون سؤاله عن سبب زيارته.',
    keyTerm: { arabic: 'ضيافة', english: 'hospitality', transliteration: 'ḍiyāfa' },
    discoveryTrigger: 'zone_visit:bedouin-camp',
    zone: 'bedouin-camp',
    rarity: 'legendary'
  },
  {
    id: 'culture_002',
    title: 'Arabic Calligraphy as Sacred Art',
    titleArabic: 'الخط العربي كفنّ مقدّس',
    category: 'culture',
    content: 'Arabic calligraphy is considered the highest form of art in Islamic civilization because it is the medium through which the Quran is written. Calligraphers train for decades to master styles like Naskh, Thuluth, and Diwani. The craft elevates writing from mere communication to a form of spiritual devotion, adorning mosques, palaces, and manuscripts.',
    contentArabic: 'الخط العربي يُعدّ أرفع الفنون في الحضارة الإسلامية لأنه وسيلة كتابة القرآن الكريم.',
    keyTerm: { arabic: 'خطّ', english: 'calligraphy / handwriting', transliteration: 'khaṭṭ' },
    discoveryTrigger: 'faction_tier:artists:allied',
    zone: null,
    rarity: 'legendary'
  },

  // ── Rare (4) ──
  {
    id: 'culture_003',
    title: 'The Arabic Coffee Ceremony — Qahwa',
    titleArabic: 'مراسم القهوة العربية',
    category: 'culture',
    content: 'Arabic coffee (qahwa) is lightly roasted, spiced with cardamom, and served in small handleless cups (finjān). The host always pours for the guest, filling the cup only one-third full as a sign of respect — a full cup signals it is time to leave. The coffee pot (dallah) is a symbol of generosity recognized by UNESCO as intangible cultural heritage.',
    contentArabic: 'القهوة العربية تُحمَّص خفيفًا وتُنكَّه بالهيل وتُقدَّم في فناجين صغيرة، وملء الفنجان ثلثه فقط علامة احترام.',
    keyTerm: { arabic: 'قهوة', english: 'coffee', transliteration: 'qahwa' },
    discoveryTrigger: 'npc_talk:elder-tariq',
    zone: 'bedouin-camp',
    rarity: 'rare'
  },
  {
    id: 'culture_004',
    title: 'The Majlis — Council of Gathering',
    titleArabic: 'المجلس',
    category: 'culture',
    content: 'The majlis is a gathering space where community members sit on cushions along the walls to discuss matters of importance, resolve disputes, share poetry, and welcome guests. The tradition predates Islam and remains central to Gulf Arab culture. In many Gulf countries, rulers hold open majlis sessions where citizens can petition directly.',
    contentArabic: 'المجلس مكان اجتماع يجلس فيه أفراد المجتمع لمناقشة الأمور المهمّة وحلّ الخلافات واستقبال الضيوف.',
    keyTerm: { arabic: 'مجلس', english: 'council / sitting place', transliteration: 'majlis' },
    discoveryTrigger: 'zone_visit:oasis-village',
    zone: 'oasis-village',
    rarity: 'rare'
  },
  {
    id: 'culture_005',
    title: 'Bedouin Life and the Desert Code',
    titleArabic: 'حياة البدو وقانون الصحراء',
    category: 'culture',
    content: 'The Bedouin are traditionally nomadic Arab peoples who have traversed the deserts of the Arabian Peninsula, North Africa, and the Levant for millennia. Their code emphasizes honor (sharaf), bravery (shajā\'a), and generosity (karam). Knowledge of stars, wind patterns, and animal behavior is passed orally through generations.',
    contentArabic: 'البدو عرب رُحّل يعيشون في الصحراء ويتّبعون قيم الشرف والشجاعة والكرم.',
    keyTerm: { arabic: 'بدوي', english: 'Bedouin / nomad', transliteration: 'badawī' },
    discoveryTrigger: 'npc_talk:guide-amira',
    zone: 'bedouin-camp',
    rarity: 'rare'
  },
  {
    id: 'culture_006',
    title: 'Arabic Music — The Maqam System',
    titleArabic: 'الموسيقى العربية — نظام المقامات',
    category: 'culture',
    content: 'Arabic music is built on the maqam system, a set of melodic modes with specific scales, habitual phrases, and emotional associations. Unlike Western scales, maqamat use quarter tones that give Arabic music its distinctive sound. Key instruments include the oud (lute), qanun (zither), nay (flute), and darbuka (drum).',
    contentArabic: 'الموسيقى العربية مبنيّة على نظام المقامات الذي يستخدم أرباع النغمات لتمييز صوتها الفريد.',
    keyTerm: { arabic: 'مقام', english: 'musical mode', transliteration: 'maqām' },
    discoveryTrigger: 'faction_tier:artists:trusted',
    zone: null,
    rarity: 'rare'
  },

  // ── Uncommon (10) ──
  {
    id: 'culture_007',
    title: 'Henna Traditions',
    titleArabic: 'تقاليد الحنّاء',
    category: 'culture',
    content: 'Henna (ḥinnā\') has been used for body art across the Arab world for thousands of years. It is especially associated with weddings, where the bride\'s hands and feet are decorated in intricate patterns during a "henna night" (laylat al-henna). Different regions have distinct styles, from geometric Moroccan patterns to floral Gulf designs.',
    contentArabic: 'الحنّاء تُستخدم لتزيين الجسد منذ آلاف السنين وتُعدّ جزءًا أساسيًّا من احتفالات الأعراس.',
    keyTerm: { arabic: 'حنّاء', english: 'henna', transliteration: 'ḥinnāʾ' },
    discoveryTrigger: 'npc_talk:princess-aisha',
    zone: 'oasis-village',
    rarity: 'uncommon'
  },
  {
    id: 'culture_008',
    title: 'Traditional Arab Dress — Thobe and Abaya',
    titleArabic: 'اللباس العربي التقليدي — الثوب والعباءة',
    category: 'culture',
    content: 'The thobe (also dishdasha or kandura) is a long, loose-fitting garment worn by men across the Arab world, typically white in the Gulf to reflect the sun. Women may wear an abaya, a flowing black outer garment, often with exquisite embroidery. Regional headwear like the keffiyeh, ghutrah, and igal varies by country and tribe.',
    contentArabic: 'الثوب لباس فضفاض يرتديه الرجال في العالم العربي، بينما ترتدي النساء العباءة.',
    keyTerm: { arabic: 'ثوب', english: 'garment / thobe', transliteration: 'thawb' },
    discoveryTrigger: 'npc_talk:merchant-fatima',
    zone: 'desert-marketplace',
    rarity: 'uncommon'
  },
  {
    id: 'culture_009',
    title: 'Souq Culture — The Traditional Marketplace',
    titleArabic: 'ثقافة السوق',
    category: 'culture',
    content: 'The souq (market) is the commercial and social heart of Arab cities. Souqs are typically organized by trade — spice souq, gold souq, perfume souq, textile souq. Haggling (mufawada) is expected and considered a social art form. Famous souqs include Khan el-Khalili in Cairo, Souq Waqif in Doha, and the souqs of Marrakech.',
    contentArabic: 'السوق هو قلب المدينة العربية التجاري والاجتماعي حيث تُنظَّم البضائع حسب نوعها ويُعدّ التفاوض فنًّا.',
    keyTerm: { arabic: 'سوق', english: 'market / souq', transliteration: 'sūq' },
    discoveryTrigger: 'zone_visit:desert-marketplace',
    zone: 'desert-marketplace',
    rarity: 'uncommon'
  },
  {
    id: 'culture_010',
    title: 'Eid al-Fitr — Festival of Breaking the Fast',
    titleArabic: 'عيد الفطر',
    category: 'culture',
    content: 'Eid al-Fitr marks the end of Ramadan and is one of the two major Islamic holidays. Celebrations include a special communal prayer, giving of zakat al-fitr (charity), wearing new clothes, visiting family, and sharing sweets. Children receive gifts of money (eidiyya). The phrase "Eid Mubarak" (Blessed Eid) is the universal greeting.',
    contentArabic: 'عيد الفطر يحتفل به المسلمون بعد انتهاء صيام رمضان ويتضمّن صلاة العيد وتبادل الزيارات والحلويات.',
    keyTerm: { arabic: 'عيد', english: 'festival / holiday', transliteration: 'ʿīd' },
    discoveryTrigger: 'word_learn:word_eid',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'culture_011',
    title: 'Eid al-Adha — Festival of Sacrifice',
    titleArabic: 'عيد الأضحى',
    category: 'culture',
    content: 'Eid al-Adha commemorates the willingness of Prophet Ibrahim (Abraham) to sacrifice his son in obedience to God. It coincides with the Hajj pilgrimage and involves the ritual sacrifice of a sheep or goat, with the meat divided into thirds: one for the family, one for friends, and one for the poor.',
    contentArabic: 'عيد الأضحى يحيي ذكرى استعداد النبي إبراهيم للتضحية بابنه طاعةً لله.',
    keyTerm: { arabic: 'أضحية', english: 'sacrifice', transliteration: 'uḍḥiya' },
    discoveryTrigger: 'level_reach:8',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'culture_012',
    title: 'Arabic Wedding Traditions',
    titleArabic: 'تقاليد الزفاف العربي',
    category: 'culture',
    content: 'Arab weddings are multi-day celebrations that vary by region but share core elements: the katb al-kitab (signing the marriage contract), the henna night, the zaffe (wedding procession with music and dancing), and a grand feast. The groom\'s family traditionally offers mahr (bridal gift) to the bride.',
    contentArabic: 'الأعراس العربية احتفالات تمتدّ عدة أيام وتشمل كتب الكتاب وليلة الحنّاء والزفّة.',
    keyTerm: { arabic: 'زفاف', english: 'wedding', transliteration: 'zafāf' },
    discoveryTrigger: 'npc_talk:princess-aisha',
    zone: 'oasis-village',
    rarity: 'uncommon'
  },
  {
    id: 'culture_013',
    title: 'Arabic Greetings and Etiquette',
    titleArabic: 'التحيّات والآداب العربية',
    category: 'culture',
    content: 'Arabic greetings follow elaborate protocols of courtesy. "As-salamu alaykum" (Peace be upon you) is the universal Islamic greeting, answered with "Wa alaykum as-salam." Greetings are often followed by inquiries about health, family, and well-being. The right hand is used for greeting and eating, and shoes are removed when entering homes.',
    contentArabic: 'التحيّات العربية تتبع آدابًا دقيقة، و"السلام عليكم" هي التحية الإسلامية الأساسية.',
    keyTerm: { arabic: 'سلام', english: 'peace', transliteration: 'salām' },
    discoveryTrigger: 'word_learn:word_salam',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'culture_014',
    title: 'The Hammam — Public Bathhouse',
    titleArabic: 'الحمّام العربي',
    category: 'culture',
    content: 'The hammam (public bathhouse) has been a cornerstone of Arab social life since the Umayyad era. Inspired by Roman baths but adapted for Islamic ablution requirements, hammams feature a sequence of hot, warm, and cold rooms. They served as places for ritual purification, socializing, and even conducting business.',
    contentArabic: 'الحمّام العربي ركيزة الحياة الاجتماعية منذ العصر الأموي ويضمّ غرفًا ساخنة ودافئة وباردة.',
    keyTerm: { arabic: 'حمّام', english: 'bathhouse', transliteration: 'ḥammām' },
    discoveryTrigger: 'zone_visit:oasis-village',
    zone: 'oasis-village',
    rarity: 'uncommon'
  },
  {
    id: 'culture_015',
    title: 'Arabic Naming Conventions — Nasab and Kunya',
    titleArabic: 'أنظمة التسمية العربية — النسب والكنية',
    category: 'culture',
    content: 'Arabic names follow a rich system: the ism (given name), nasab (patronymic with "ibn" meaning "son of" or "bint" meaning "daughter of"), laqab (honorific or descriptive title), and kunya (parental title like "Abu" meaning "father of" or "Umm" meaning "mother of"). A person\'s full name can encode their entire lineage.',
    contentArabic: 'الأسماء العربية تتبع نظامًا غنيًّا يشمل الاسم والنسب واللقب والكنية.',
    keyTerm: { arabic: 'اسم', english: 'name', transliteration: 'ism' },
    discoveryTrigger: 'level_reach:2',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'culture_016',
    title: 'The Date Palm — Tree of Life',
    titleArabic: 'النخلة — شجرة الحياة',
    category: 'culture',
    content: 'The date palm (nakhla) is deeply revered in Arab culture, mentioned over twenty times in the Quran. Dates are the traditional food for breaking the Ramadan fast. The tree provides food (dates, hearts of palm), building materials (trunks, fronds), and fiber (for rope and baskets). Some date varieties like Ajwa and Medjool are prized globally.',
    contentArabic: 'النخلة شجرة مقدّسة في الثقافة العربية ذُكرت في القرآن أكثر من عشرين مرة.',
    keyTerm: { arabic: 'نخلة', english: 'date palm', transliteration: 'nakhla' },
    discoveryTrigger: 'zone_visit:hidden-oasis',
    zone: 'hidden-oasis',
    rarity: 'uncommon'
  },

  // ── Common (14) ──
  {
    id: 'culture_017',
    title: 'Arabic Tea Culture',
    titleArabic: 'ثقافة الشاي العربي',
    category: 'culture',
    content: 'While coffee dominates the Gulf, tea (shay) is the beverage of choice in the Maghreb, Egypt, and the Levant. Moroccan mint tea, poured from a height to create foam, is a symbol of hospitality. In Egypt, tea is served strong and sweet, often with a sprig of mint. Offering tea to a guest is an essential gesture of welcome.',
    contentArabic: 'الشاي هو المشروب المفضّل في المغرب العربي ومصر والشام، ويُقدَّم كرمز للضيافة.',
    keyTerm: { arabic: 'شاي', english: 'tea', transliteration: 'shāy' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'culture_018',
    title: 'The Keffiyeh — Symbol of Identity',
    titleArabic: 'الكوفية — رمز الهوية',
    category: 'culture',
    content: 'The keffiyeh is a traditional headdress worn across the Arab world. Its patterns and colors often indicate regional identity: the red-and-white shemagh is common in Jordan and the Gulf, while the black-and-white keffiyeh is associated with Palestine. It serves the practical purpose of protection from sun, sand, and cold.',
    contentArabic: 'الكوفية غطاء رأس تقليدي تختلف ألوانه وأنماطه حسب المنطقة وتدلّ على الهوية.',
    keyTerm: { arabic: 'كوفية', english: 'keffiyeh / headscarf', transliteration: 'kūfiyya' },
    discoveryTrigger: 'npc_talk:guide-amira',
    zone: 'bedouin-camp',
    rarity: 'common'
  },
  {
    id: 'culture_019',
    title: 'Arabic Dance Traditions — Dabke',
    titleArabic: 'الرقص العربي — الدبكة',
    category: 'culture',
    content: 'Dabke is a lively traditional line dance performed at weddings and celebrations across the Levant. Dancers hold hands and stomp in rhythmic patterns led by a front dancer (lawweeh) who improvises moves. Other Arabic dance forms include the Gulf\'s ardha (sword dance), the Egyptian raqs sharqi, and the Moroccan ahidous.',
    contentArabic: 'الدبكة رقصة جماعية تُؤدَّى في الأعراس والاحتفالات في بلاد الشام.',
    keyTerm: { arabic: 'رقص', english: 'dance', transliteration: 'raqṣ' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'culture_020',
    title: 'Frankincense — The Perfume of the Gods',
    titleArabic: 'اللبان — عطر الآلهة',
    category: 'culture',
    content: 'Frankincense (lubān), harvested from Boswellia trees in Oman and Yemen, was once worth its weight in gold. Ancient trade routes, including the Incense Road, carried it from southern Arabia to Egypt, Rome, and beyond. It remains central to Arab hospitality, burned in censers (mabkhara) to perfume homes and welcome guests.',
    contentArabic: 'اللبان يُحصد من أشجار في عُمان واليمن وكان يُساوي وزنه ذهبًا في العصور القديمة.',
    keyTerm: { arabic: 'بخور', english: 'incense', transliteration: 'bukhūr' },
    discoveryTrigger: 'npc_talk:merchant-fatima',
    zone: 'desert-marketplace',
    rarity: 'common'
  },
  {
    id: 'culture_021',
    title: 'Arabic Proverbs — Wisdom of the Ages',
    titleArabic: 'الأمثال العربية — حكمة الأجيال',
    category: 'culture',
    content: 'Arabic proverbs (amthāl) are a living repository of cultural wisdom. "اللي ما يعرف الصقر يشويه" (He who doesn\'t know the falcon grills it) warns against ignorance of value. "الصبر مفتاح الفرج" (Patience is the key to relief) counsels endurance. Proverbs are woven into daily conversation and passed down through generations.',
    contentArabic: 'الأمثال العربية حكمة متوارثة عبر الأجيال تُستخدم في المحادثات اليومية.',
    keyTerm: { arabic: 'مثل', english: 'proverb', transliteration: 'mathal' },
    discoveryTrigger: 'npc_talk:elder-tariq',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'culture_022',
    title: 'The Oud — King of Instruments',
    titleArabic: 'العود — ملك الآلات',
    category: 'culture',
    content: 'The oud is a pear-shaped, fretless stringed instrument considered the ancestor of the European lute. Its name comes from the Arabic word for "wood" (ʿūd). The oud is central to Arab, Turkish, and Persian musical traditions and is played by plucking with a risha (plectrum). Ziryab, a 9th-century musician, is credited with adding a fifth string.',
    contentArabic: 'العود آلة وترية كمثرية الشكل يُعدّ ملك الآلات الموسيقية العربية.',
    keyTerm: { arabic: 'عود', english: 'oud (lute)', transliteration: 'ʿūd' },
    discoveryTrigger: 'faction_tier:artists:friendly',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'culture_023',
    title: 'Arabic Perfumery — Attar and Musk',
    titleArabic: 'صناعة العطور العربية',
    category: 'culture',
    content: 'Perfumery (ʿiṭāra) is deeply embedded in Arab culture. The Prophet Muhammad is reported to have loved perfume, and wearing fragrance is considered sunnah. Traditional attars (concentrated perfume oils) are made from oud wood, rose, amber, and musk. The perfume souq is a fixture of every Arab city.',
    contentArabic: 'صناعة العطور متجذّرة في الثقافة العربية، والتطيّب يُعدّ سنّة نبوية.',
    keyTerm: { arabic: 'عطر', english: 'perfume', transliteration: 'ʿiṭr' },
    discoveryTrigger: 'zone_visit:desert-marketplace',
    zone: 'desert-marketplace',
    rarity: 'common'
  },
  {
    id: 'culture_024',
    title: 'One Thousand and One Nights',
    titleArabic: 'ألف ليلة وليلة',
    category: 'culture',
    content: 'Alf Layla wa Layla (One Thousand and One Nights) is a collection of Middle Eastern folk tales compiled over many centuries. Scheherazade tells stories to postpone her execution, weaving tales of Sinbad, Aladdin, and Ali Baba. The frame narrative explores the power of storytelling itself as a means of survival and persuasion.',
    contentArabic: 'ألف ليلة وليلة مجموعة من الحكايات الشعبية ترويها شهرزاد لتأجيل حكم الإعدام عليها.',
    keyTerm: { arabic: 'حكاية', english: 'story / tale', transliteration: 'ḥikāya' },
    discoveryTrigger: 'word_learn:word_hikaya',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'culture_025',
    title: 'The Falcon — Symbol of the Gulf',
    titleArabic: 'الصقر — رمز الخليج',
    category: 'culture',
    content: 'Falconry (ṣayd bi-l-ṣuqūr) has been practiced in the Arabian Peninsula for over 2,000 years. Originally used by Bedouins to hunt for food, it evolved into a sport of prestige. Peregrine falcons and saker falcons are the most prized species. Falcons have their own passports in some Gulf countries and appear on national emblems.',
    contentArabic: 'الصيد بالصقور يُمارَس في الجزيرة العربية منذ أكثر من ألفي عام وأصبح رياضة مرموقة.',
    keyTerm: { arabic: 'صقر', english: 'falcon', transliteration: 'ṣaqr' },
    discoveryTrigger: 'npc_talk:guide-amira',
    zone: 'bedouin-camp',
    rarity: 'common'
  },
  {
    id: 'culture_026',
    title: 'Arabic Sweets — Baklava, Kunafa, and More',
    titleArabic: 'الحلويات العربية',
    category: 'culture',
    content: 'Arabic sweets (ḥalawiyyāt) are renowned worldwide. Baklava layers phyllo dough with nuts and syrup. Kunafa wraps cheese in shredded pastry soaked in sugar syrup. Maamoul are stuffed semolina cookies made for Eid. Halwa, luqaimat, and basbousa round out a tradition where sweets mark every celebration and guest visit.',
    contentArabic: 'الحلويات العربية مشهورة عالميًّا وتشمل البقلاوة والكنافة والمعمول.',
    keyTerm: { arabic: 'حلوى', english: 'sweets / dessert', transliteration: 'ḥalwā' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'culture_027',
    title: 'Arabic Poetry — Diwan al-Arab',
    titleArabic: 'الشعر العربي — ديوان العرب',
    category: 'culture',
    content: 'Poetry is called "Diwan al-Arab" (the record of the Arabs), reflecting its central role in preserving history, law, and culture. Pre-Islamic poets like Imru\' al-Qais were superstars of their day, and the Mu\'allaqat ("Suspended Poems") were said to be hung on the Kaaba. Today, poetry contests like Millions Poet draw massive TV audiences.',
    contentArabic: 'الشعر يُسمّى "ديوان العرب" لأنه يحفظ تاريخهم وثقافتهم وقوانينهم.',
    keyTerm: { arabic: 'شعر', english: 'poetry', transliteration: 'shiʿr' },
    discoveryTrigger: 'faction_tier:artists:friendly',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'culture_028',
    title: 'Camel Culture in the Arab World',
    titleArabic: 'ثقافة الإبل في العالم العربي',
    category: 'culture',
    content: 'The camel (jamal) is inseparable from Arab identity. Known as the "ship of the desert," camels provided transport, milk, meat, leather, and wool to desert dwellers. There are over 100 Arabic words for camels in different states and ages. Today, camel racing and beauty contests are popular in the Gulf region.',
    contentArabic: 'الجمل لا ينفصل عن الهوية العربية ويُعرف بـ"سفينة الصحراء".',
    keyTerm: { arabic: 'جمل', english: 'camel', transliteration: 'jamal' },
    discoveryTrigger: 'zone_visit:bedouin-camp',
    zone: 'bedouin-camp',
    rarity: 'common'
  },
  {
    id: 'culture_029',
    title: 'The Dhow — Traditional Sailing Vessel',
    titleArabic: 'المركب الشراعي — الداو',
    category: 'culture',
    content: 'The dhow is a traditional wooden sailing vessel with lateen (triangular) sails that has plied the waters of the Arabian Sea and Indian Ocean for centuries. Dhows were built without nails, using coconut fiber stitching. They carried goods between Arabia, East Africa, India, and Southeast Asia, spreading Arab culture along maritime routes.',
    contentArabic: 'الداو مركب شراعي تقليدي أبحر في بحر العرب والمحيط الهندي لقرون.',
    keyTerm: { arabic: 'مركب', english: 'boat / vessel', transliteration: 'markab' },
    discoveryTrigger: 'zone_visit:coastal-port',
    zone: 'coastal-port',
    rarity: 'common'
  },
  {
    id: 'culture_030',
    title: 'Ramadan Lanterns — Fanous',
    titleArabic: 'فانوس رمضان',
    category: 'culture',
    content: 'The Ramadan lantern (fanous) is a cherished symbol of the holy month, especially in Egypt. Legend traces it to the Fatimid era, when Caliph al-Mu\'izz entered Cairo at night and was greeted by crowds carrying lanterns. Today, colorful fanous lanterns light up streets and homes during Ramadan, and children carry them while singing traditional songs.',
    contentArabic: 'فانوس رمضان رمز محبّب للشهر الفضيل خاصة في مصر ويعود للعصر الفاطمي.',
    keyTerm: { arabic: 'فانوس', english: 'lantern', transliteration: 'fānūs' },
    discoveryTrigger: 'word_learn:word_ramadan',
    zone: null,
    rarity: 'common'
  },

  // ═══════════════════════════════════════════════════════════════════
  //  LANGUAGE (30 entries)
  // ═══════════════════════════════════════════════════════════════════

  // ── Legendary (2) ──
  {
    id: 'language_001',
    title: 'Sibawayh — The First Arabic Grammarian',
    titleArabic: 'سيبويه — أول نحوي عربي',
    category: 'language',
    content: 'Sibawayh (c. 760–796 CE) was a Persian scholar who authored "Al-Kitab" (The Book), the first comprehensive grammar of the Arabic language. His work systematically described Arabic phonology, morphology, and syntax with a rigor unmatched for centuries. Arab grammarians to this day refer to him simply as "The Imam of Grammar," and his book remains a foundational reference.',
    contentArabic: 'سيبويه مؤلّف "الكتاب" وهو أول وصف شامل لقواعد اللغة العربية ويُلقَّب بإمام النحو.',
    keyTerm: { arabic: 'نحو', english: 'grammar', transliteration: 'naḥw' },
    discoveryTrigger: 'faction_tier:scholars:allied',
    zone: 'ancient-library',
    rarity: 'legendary'
  },
  {
    id: 'language_002',
    title: 'Arabic Numerals — A Gift to the World',
    titleArabic: 'الأرقام العربية — هدية للعالم',
    category: 'language',
    content: 'The numeral system used worldwide (0, 1, 2, 3…) is called "Arabic numerals" because it was transmitted to Europe through Arab mathematicians, though the system originated in India. Al-Khwarizmi\'s works introduced the concept of zero and positional notation to the Islamic world, and from there to Europe via Al-Andalus, revolutionizing mathematics.',
    contentArabic: 'الأرقام "العربية" المستخدمة عالميًّا انتقلت إلى أوروبا عبر العلماء العرب رغم أصلها الهندي.',
    keyTerm: { arabic: 'رقم', english: 'number / numeral', transliteration: 'raqm' },
    discoveryTrigger: 'quest_complete:main_quest_3',
    zone: null,
    rarity: 'legendary'
  },

  // ── Rare (4) ──
  {
    id: 'language_003',
    title: 'The Trilateral Root System',
    titleArabic: 'نظام الجذور الثلاثية',
    category: 'language',
    content: 'Arabic words are built from roots, typically three consonants (trilateral roots) that carry a core meaning. The root k-t-b (ك-ت-ب) relates to writing: kitāb (book), kātib (writer), maktaba (library), maktūb (written/destiny). By applying patterns of vowels and affixes, a single root can generate dozens of related words, making Arabic remarkably systematic.',
    contentArabic: 'الكلمات العربية مبنيّة على جذور ثلاثية تحمل معنى أساسيًّا وتولّد عشرات الكلمات المترابطة.',
    keyTerm: { arabic: 'جذر', english: 'root', transliteration: 'jadhr' },
    discoveryTrigger: 'word_learn:word_kitab',
    zone: null,
    rarity: 'rare'
  },
  {
    id: 'language_004',
    title: 'Arabic Loanwords in English',
    titleArabic: 'كلمات عربية دخلت الإنجليزية',
    category: 'language',
    content: 'Hundreds of English words derive from Arabic: "algebra" (al-jabr), "algorithm" (al-Khwārizmī), "alchemy" (al-kīmiyāʾ), "alcohol" (al-kuḥūl), "cotton" (quṭn), "magazine" (makhāzin), "safari" (safar), "tariff" (taʿrīfa), "zero" (ṣifr), and "coffee" (qahwa). These loanwords reflect centuries of Arab influence in science, trade, and daily life.',
    contentArabic: 'مئات الكلمات الإنجليزية مشتقّة من العربية مثل "الجبر" و"الخوارزمية" و"الكيمياء" و"القطن".',
    keyTerm: { arabic: 'كلمة', english: 'word', transliteration: 'kalima' },
    discoveryTrigger: 'level_reach:7',
    zone: null,
    rarity: 'rare'
  },
  {
    id: 'language_005',
    title: 'Thuluth — The Majestic Script',
    titleArabic: 'خطّ الثلث — الخط المهيب',
    category: 'language',
    content: 'Thuluth is one of the most elegant and complex Arabic calligraphy styles, historically used for mosque inscriptions, Quran chapter headings, and architectural ornamentation. Its name means "one third," possibly referring to the proportion of each letter that is straight versus curved. Mastery of Thuluth is considered the benchmark of a true calligrapher.',
    contentArabic: 'خطّ الثلث من أجمل أنواع الخط العربي وأصعبها ويُستخدم في زخرفة المساجد والعناوين القرآنية.',
    keyTerm: { arabic: 'ثلث', english: 'one-third / Thuluth script', transliteration: 'thuluth' },
    discoveryTrigger: 'faction_tier:artists:trusted',
    zone: null,
    rarity: 'rare'
  },
  {
    id: 'language_006',
    title: 'Arabic Script Evolution — From Nabataean to Modern',
    titleArabic: 'تطوّر الخط العربي — من النبطي إلى الحديث',
    category: 'language',
    content: 'The Arabic script evolved from the Nabataean alphabet, itself derived from Aramaic. Early Arabic inscriptions lacked dots (i\'jam) to distinguish similar letters, making reading ambiguous. Dots were added systematically during the Umayyad era by Abu al-Aswad al-Du\'ali and his students, and diacritical marks (tashkeel) followed to preserve Quranic pronunciation.',
    contentArabic: 'الخط العربي تطوّر من الأبجدية النبطية وأُضيفت النقاط في العصر الأموي لتمييز الحروف المتشابهة.',
    keyTerm: { arabic: 'حرف', english: 'letter / character', transliteration: 'ḥarf' },
    discoveryTrigger: 'npc_talk:librarian-ibrahim',
    zone: 'ancient-library',
    rarity: 'rare'
  },

  // ── Uncommon (12) ──
  {
    id: 'language_007',
    title: 'Classical Arabic vs Modern Standard Arabic',
    titleArabic: 'العربية الفصحى القديمة والحديثة',
    category: 'language',
    content: 'Classical Arabic (Fusha) is the language of the Quran and early Islamic literature, frozen in its 7th-century form. Modern Standard Arabic (MSA) is its simplified descendant, used today in media, education, and formal writing across all Arab countries. While grammar and core vocabulary overlap, MSA has absorbed modern terminology and dropped some archaic forms.',
    contentArabic: 'العربية الفصحى القديمة هي لغة القرآن، أما الفصحى الحديثة فتُستخدم في الإعلام والتعليم اليوم.',
    keyTerm: { arabic: 'فصحى', english: 'standard / classical (Arabic)', transliteration: 'fuṣḥā' },
    discoveryTrigger: 'level_reach:4',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'language_008',
    title: 'Egyptian Arabic — The Most Understood Dialect',
    titleArabic: 'العامية المصرية — أكثر اللهجات انتشارًا',
    category: 'language',
    content: 'Egyptian Arabic (Masri) is the most widely understood dialect in the Arab world, thanks to Egypt\'s prolific film, television, and music industries. It differs from MSA in pronunciation (jīm becomes gīm), vocabulary, and simplified grammar. Phrases like "izzayyak" (how are you?) and "insha\'allah" are known across the region.',
    contentArabic: 'العامية المصرية أكثر اللهجات العربية انتشارًا بفضل السينما والتلفزيون والموسيقى المصرية.',
    keyTerm: { arabic: 'لهجة', english: 'dialect', transliteration: 'lahja' },
    discoveryTrigger: 'word_learn:word_lahja',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'language_009',
    title: 'Levantine Arabic — The Dialect of the Sham',
    titleArabic: 'اللهجة الشامية',
    category: 'language',
    content: 'Levantine Arabic is spoken across Syria, Lebanon, Jordan, and Palestine. It is known for its melodic intonation and incorporation of Aramaic, Turkish, and French loanwords. The letter qāf is often pronounced as a glottal stop (hamza), and the dialect uses "shu" for "what" instead of the MSA "mādhā."',
    contentArabic: 'اللهجة الشامية تُنطق في سوريا ولبنان والأردن وفلسطين وتتميّز بنغمتها الموسيقية.',
    keyTerm: { arabic: 'شام', english: 'Levant / Greater Syria', transliteration: 'Shām' },
    discoveryTrigger: 'npc_talk:guide-amira',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'language_010',
    title: 'Gulf Arabic — Dialect of the Peninsula',
    titleArabic: 'اللهجة الخليجية',
    category: 'language',
    content: 'Gulf Arabic (Khaliji) is spoken in Kuwait, Bahrain, Qatar, the UAE, Oman, and parts of Saudi Arabia. It retains some archaic features closer to Classical Arabic, such as the pronunciation of kāf as "ch" in some words. Its vocabulary reflects maritime culture and pearl diving heritage, with loanwords from Persian, Hindi, and English.',
    contentArabic: 'اللهجة الخليجية تحتفظ ببعض السمات القريبة من العربية الفصحى وتعكس تراث البحر والغوص.',
    keyTerm: { arabic: 'خليج', english: 'gulf', transliteration: 'khalīj' },
    discoveryTrigger: 'zone_visit:coastal-port',
    zone: 'coastal-port',
    rarity: 'uncommon'
  },
  {
    id: 'language_011',
    title: 'Maghrebi Arabic — Dialects of the West',
    titleArabic: 'اللهجة المغاربية',
    category: 'language',
    content: 'Maghrebi Arabic encompasses the dialects of Morocco (Darija), Algeria, Tunisia, and Libya. These dialects are heavily influenced by Berber (Amazigh) languages and French. They are often considered the most difficult for Eastern Arabic speakers to understand, with significant vowel reduction and unique vocabulary.',
    contentArabic: 'اللهجة المغاربية تشمل لهجات المغرب والجزائر وتونس وليبيا وتتأثّر بالأمازيغية والفرنسية.',
    keyTerm: { arabic: 'مغرب', english: 'west / Maghreb', transliteration: 'maghrib' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'language_012',
    title: 'Harakat — Arabic Diacritical Marks',
    titleArabic: 'الحركات — التشكيل العربي',
    category: 'language',
    content: 'Harakat (diacritical marks or tashkeel) are small symbols placed above or below Arabic letters to indicate short vowels: fatha (a), kasra (i), damma (u), and sukun (no vowel). They also include shadda (consonant doubling) and tanwin (nunation). Most everyday Arabic is written without harakat; readers infer vowels from context.',
    contentArabic: 'الحركات علامات صغيرة توضع فوق الحروف أو تحتها لبيان الأصوات القصيرة.',
    keyTerm: { arabic: 'حركة', english: 'diacritical mark / vowel mark', transliteration: 'ḥaraka' },
    discoveryTrigger: 'word_learn:word_harf',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'language_013',
    title: 'Naskh Script — The Everyday Calligraphy',
    titleArabic: 'خطّ النسخ — خط الكتابة اليومية',
    category: 'language',
    content: 'Naskh is the most widely used Arabic calligraphy style, developed in the 10th century by Ibn Muqla. Its clear, readable letterforms made it ideal for copying (naskh means "copying") manuscripts and printing. Today, Naskh is the default script for Arabic typography, newspapers, books, and computer fonts.',
    contentArabic: 'خطّ النسخ أكثر أنواع الخط العربي استخدامًا وطُوِّر في القرن العاشر على يد ابن مقلة.',
    keyTerm: { arabic: 'نسخ', english: 'copying / Naskh script', transliteration: 'naskh' },
    discoveryTrigger: 'npc_talk:librarian-ibrahim',
    zone: 'ancient-library',
    rarity: 'uncommon'
  },
  {
    id: 'language_014',
    title: 'Kufi Script — Angular Elegance',
    titleArabic: 'الخطّ الكوفي — الأناقة الهندسية',
    category: 'language',
    content: 'Kufic script, originating from the Iraqi city of Kufa, is characterized by angular, geometric letterforms. It was the dominant script for early Quran manuscripts and architectural inscriptions from the 7th to 10th centuries. While largely replaced by Naskh for everyday use, Kufic remains popular in decorative art and modern Arabic graphic design.',
    contentArabic: 'الخط الكوفي نشأ في مدينة الكوفة العراقية ويتميّز بأشكاله الحروفية الزاوية والهندسية.',
    keyTerm: { arabic: 'كوفي', english: 'Kufic', transliteration: 'kūfī' },
    discoveryTrigger: 'quest_complete:side_quest_artisans_1',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'language_015',
    title: 'Diwani Script — The Ottoman Court Script',
    titleArabic: 'الخطّ الديواني — خط الديوان العثماني',
    category: 'language',
    content: 'Diwani script was developed during the Ottoman Empire for use in royal court documents (dīwān means "royal court"). Its ornate, flowing curves made it nearly impossible to forge. A more elaborate variant, Diwani Jali, features densely intertwined letters filled with decorative dots and is used for ceremonial purposes.',
    contentArabic: 'الخط الديواني طُوِّر في الدولة العثمانية للوثائق الرسمية ويتميّز بمنحنياته المزخرفة.',
    keyTerm: { arabic: 'ديوان', english: 'royal court / chancellery', transliteration: 'dīwān' },
    discoveryTrigger: 'zone_visit:royal-palace',
    zone: 'royal-palace',
    rarity: 'uncommon'
  },
  {
    id: 'language_016',
    title: 'Arabic Poetry Meters — The Science of Prosody',
    titleArabic: 'بحور الشعر العربي — علم العروض',
    category: 'language',
    content: 'Al-Khalil ibn Ahmad (718–786 CE) systematized Arabic poetic meters into 15 "seas" (buḥūr), later expanded to 16. Each meter has a specific rhythmic pattern of long and short syllables. This system, called \'ilm al-\'aruḍ (prosody), is one of the earliest formal analyses of poetic rhythm in any language and remains in use today.',
    contentArabic: 'الخليل بن أحمد نظّم بحور الشعر العربي في خمسة عشر بحرًا وأسّس علم العروض.',
    keyTerm: { arabic: 'بحر', english: 'poetic meter (lit. sea)', transliteration: 'baḥr' },
    discoveryTrigger: 'npc_talk:scholar-yusuf',
    zone: 'ancient-library',
    rarity: 'uncommon'
  },
  {
    id: 'language_017',
    title: 'The Ijaza — License to Transmit Knowledge',
    titleArabic: 'الإجازة — ترخيص نقل العلم',
    category: 'language',
    content: 'The ijaza is a traditional Islamic certification where a teacher authorizes a student to teach and transmit a specific text or discipline. This unbroken chain of transmission (isnad) connects students back through generations to the original author. The ijaza system influenced the modern academic degree and is still practiced in Quranic and hadith studies.',
    contentArabic: 'الإجازة شهادة تقليدية يمنحها الأستاذ للطالب لنقل علم معيّن بسلسلة اتصال متّصلة.',
    keyTerm: { arabic: 'إجازة', english: 'license / certification', transliteration: 'ijāza' },
    discoveryTrigger: 'faction_tier:scholars:trusted',
    zone: 'ancient-library',
    rarity: 'uncommon'
  },
  {
    id: 'language_018',
    title: 'Arabic\'s Influence on Other Scripts',
    titleArabic: 'تأثير العربية في الأبجديات الأخرى',
    category: 'language',
    content: 'The Arabic script is the third most widely used writing system in the world after Latin and Chinese. Beyond Arabic, it is used to write Persian (Farsi), Urdu, Pashto, Kurdish (Sorani), Malay (Jawi), and historically Turkish and Swahili. Each language adapted the script with additional letters to represent sounds not found in Arabic.',
    contentArabic: 'الخط العربي ثالث أكثر أنظمة الكتابة استخدامًا في العالم ويُكتب به الفارسية والأردية وغيرهما.',
    keyTerm: { arabic: 'أبجدية', english: 'alphabet', transliteration: 'abjadiyya' },
    discoveryTrigger: 'level_reach:9',
    zone: null,
    rarity: 'uncommon'
  },

  // ── Common (12) ──
  {
    id: 'language_019',
    title: 'The Arabic Alphabet — 28 Letters',
    titleArabic: 'الأبجدية العربية — ٢٨ حرفًا',
    category: 'language',
    content: 'The Arabic alphabet contains 28 letters, all consonants, written from right to left. Most letters change shape depending on their position in a word (initial, medial, final, or isolated). Six letters (alif, dal, dhal, ra, zay, waw) do not connect to the following letter. Short vowels are indicated by optional diacritical marks.',
    contentArabic: 'الأبجدية العربية تتكوّن من ثمانية وعشرين حرفًا تُكتب من اليمين إلى اليسار.',
    keyTerm: { arabic: 'أبجدية', english: 'alphabet', transliteration: 'abjadiyya' },
    discoveryTrigger: 'level_reach:1',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_020',
    title: 'Sun and Moon Letters',
    titleArabic: 'الحروف الشمسية والقمرية',
    category: 'language',
    content: 'Arabic letters are divided into "sun letters" (ḥurūf shamsiyya) and "moon letters" (ḥurūf qamariyya), affecting how the definite article "al-" is pronounced. Before sun letters (like t, d, n, s), the "l" assimilates: "al-shams" becomes "ash-shams." Before moon letters (like q, k, b), the "l" is pronounced: "al-qamar" stays "al-qamar."',
    contentArabic: 'الحروف الشمسية تُدغم فيها لام "ال" بينما الحروف القمرية تُلفظ فيها اللام.',
    keyTerm: { arabic: 'شمس', english: 'sun', transliteration: 'shams' },
    discoveryTrigger: 'word_learn:word_shams',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_021',
    title: 'Arabic Verb Forms — The Awzan System',
    titleArabic: 'أوزان الأفعال العربية',
    category: 'language',
    content: 'Arabic verbs follow ten standard patterns (awzān) built on the trilateral root. Form I (fa\'ala) is the base form, Form II (fa\'\'ala) often intensifies or makes causative, Form V (tafa\'\'ala) is the reflexive of Form II, and so on. Understanding these patterns unlocks predictable meaning shifts across thousands of verbs.',
    contentArabic: 'الأفعال العربية تتبع عشرة أوزان قياسية مبنيّة على الجذر الثلاثي.',
    keyTerm: { arabic: 'فعل', english: 'verb / to do', transliteration: 'fiʿl' },
    discoveryTrigger: 'word_learn:word_qalam',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_022',
    title: 'The Dual Form — Unique to Arabic',
    titleArabic: 'المثنّى — صيغة فريدة في العربية',
    category: 'language',
    content: 'Unlike most languages that distinguish only singular and plural, Arabic has a dual form (muthannā) for exactly two of something. "Kitab" is one book, "kitaban" is two books, and "kutub" is three or more books. This dual form applies to nouns, adjectives, verbs, and pronouns, adding precision to the language.',
    contentArabic: 'المثنّى صيغة في العربية تُستخدم للتعبير عن اثنين تحديدًا وتُطبَّق على الأسماء والأفعال والضمائر.',
    keyTerm: { arabic: 'مثنّى', english: 'dual form', transliteration: 'muthannā' },
    discoveryTrigger: 'level_reach:6',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_023',
    title: 'Arabic Numbers — Eastern vs Western',
    titleArabic: 'الأرقام العربية — الشرقية والغربية',
    category: 'language',
    content: 'There are two sets of "Arabic" numerals in use today. The "Western Arabic" numerals (0, 1, 2, 3…) used globally were developed in the Maghreb. The "Eastern Arabic" numerals (٠، ١، ٢، ٣…) are used in the Middle East. Both derive from the same Hindu-Arabic system but diverged visually over centuries.',
    contentArabic: 'هناك نوعان من الأرقام العربية: الغربية المستخدمة عالميًّا والشرقية المستخدمة في الشرق الأوسط.',
    keyTerm: { arabic: 'عدد', english: 'number / count', transliteration: 'ʿadad' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_024',
    title: 'Hamza — The Glottal Stop',
    titleArabic: 'الهمزة',
    category: 'language',
    content: 'The hamza (ء) represents a glottal stop in Arabic and can appear independently, on an alif (أ/إ), on a waw (ؤ), or on a ya (ئ). Its placement follows specific rules based on the surrounding vowels. Mastering hamza is one of the trickiest aspects of Arabic spelling for learners.',
    contentArabic: 'الهمزة تمثّل صوت القطع الحنجري في العربية ولها قواعد خاصة لموضعها في الكلمة.',
    keyTerm: { arabic: 'همزة', english: 'hamza / glottal stop', transliteration: 'hamza' },
    discoveryTrigger: 'word_learn:word_hamza',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_025',
    title: 'Arabic Plural Forms — Broken and Sound',
    titleArabic: 'الجموع العربية — جمع التكسير وجمع السالم',
    category: 'language',
    content: 'Arabic has two types of plurals: sound plurals that add regular suffixes (-ūn/-īn for masculine, -āt for feminine) and "broken" plurals (jam\' taksīr) that change the internal vowel pattern of the word. "Kitab" (book) becomes "kutub" (books), and "rajul" (man) becomes "rijāl" (men). There are over 30 broken plural patterns.',
    contentArabic: 'العربية لها جمع سالم يُضاف بلاحقة وجمع تكسير يُغيّر بنية الكلمة الداخلية.',
    keyTerm: { arabic: 'جمع', english: 'plural / collection', transliteration: 'jamʿ' },
    discoveryTrigger: 'level_reach:11',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_026',
    title: 'Idafa — The Possessive Construction',
    titleArabic: 'الإضافة',
    category: 'language',
    content: 'The idafa (إضافة) or "construct state" is how Arabic expresses possession without using a separate word for "of." Two nouns are placed together: "bayt al-mu\'allim" (house of the teacher / the teacher\'s house). The first noun loses its definite article and tanwin. This elegant construction is used constantly in both formal and spoken Arabic.',
    contentArabic: 'الإضافة تركيب نحوي يُعبّر عن الملكية بوضع اسمين معًا دون حاجة لكلمة "من".',
    keyTerm: { arabic: 'إضافة', english: 'possessive construction', transliteration: 'iḍāfa' },
    discoveryTrigger: 'word_learn:word_bayt',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_027',
    title: 'Arabic Calligraphy Tools',
    titleArabic: 'أدوات الخط العربي',
    category: 'language',
    content: 'Traditional Arabic calligraphy is written with a reed pen (qalam) cut at a specific angle to produce thick and thin strokes. The ink (ḥibr) is often handmade from soot, gum arabic, and water. Paper is sometimes treated with alum and starch for smoothness. Modern calligraphers also use metal nibs, markers, and digital tools.',
    contentArabic: 'يُكتب الخط العربي التقليدي بقلم القصب المقطوع بزاوية معيّنة لإنتاج خطوط سميكة ورفيعة.',
    keyTerm: { arabic: 'قلم', english: 'pen', transliteration: 'qalam' },
    discoveryTrigger: 'word_learn:word_qalam',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_028',
    title: 'I\'rab — Arabic Case Endings',
    titleArabic: 'الإعراب',
    category: 'language',
    content: 'Arabic uses case endings (i\'rab) to indicate a noun\'s grammatical function: nominative (-u), accusative (-a), and genitive (-i). While crucial in Classical Arabic and Quranic recitation, case endings are rarely pronounced in everyday speech or Modern Standard Arabic broadcasting, except in formal or literary contexts.',
    contentArabic: 'الإعراب نظام حركات يُبيّن وظيفة الاسم النحوية: الرفع والنصب والجرّ.',
    keyTerm: { arabic: 'إعراب', english: 'case endings / declension', transliteration: 'iʿrāb' },
    discoveryTrigger: 'quest_complete:side_quest_scholars_4',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_029',
    title: 'Arabic Typewriting History',
    titleArabic: 'تاريخ الآلة الكاتبة العربية',
    category: 'language',
    content: 'Adapting the typewriter for Arabic posed unique challenges: right-to-left direction, letter-joining, and multiple letter forms. The first Arabic typewriter was patented in 1899, but practical models did not appear until the 1910s. Selim Haddad, a Lebanese engineer, developed one of the first successful Arabic typewriters, which handled the script\'s contextual shaping.',
    contentArabic: 'كانت أول آلة كاتبة عربية مُسجّلة عام ١٨٩٩م، وواجهت تحديات اتجاه الكتابة وتشكيل الحروف.',
    keyTerm: { arabic: 'طباعة', english: 'printing / typing', transliteration: 'ṭibāʿa' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'language_030',
    title: 'Diglossia — Living with Two Arabics',
    titleArabic: 'الازدواجية اللغوية',
    category: 'language',
    content: 'Arabic speakers live with diglossia: they use Modern Standard Arabic (Fusha) for writing, news, and formal speech, and their regional dialect (\'ammiyya) for everyday conversation. A Moroccan, Egyptian, and Iraqi may speak mutually unintelligible dialects but can communicate through MSA. This coexistence of "high" and "low" registers is a defining feature of Arabic.',
    contentArabic: 'العرب يعيشون ازدواجية لغوية بين الفصحى المستخدمة رسميًّا والعامية المستخدمة يوميًّا.',
    keyTerm: { arabic: 'عامية', english: 'colloquial / dialect', transliteration: 'ʿāmmiyya' },
    discoveryTrigger: 'level_reach:14',
    zone: null,
    rarity: 'common'
  },

  // ═══════════════════════════════════════════════════════════════════
  //  GEOGRAPHY (30 entries)
  // ═══════════════════════════════════════════════════════════════════

  // ── Legendary (1) ──
  {
    id: 'geography_001',
    title: 'The Nile — Lifeblood of Civilization',
    titleArabic: 'النيل — شريان الحضارة',
    category: 'geography',
    content: 'The Nile is the longest river in Africa at approximately 6,650 km, flowing northward through eleven countries to the Mediterranean Sea. Ancient Egyptians called it "Iteru" (Great River), and its annual flooding deposited rich silt that made agriculture possible in an otherwise desert landscape. Cairo, the largest city in the Arab world, straddles its banks.',
    contentArabic: 'النيل أطول نهر في أفريقيا بطول نحو ٦٦٥٠ كم وفيضاناته السنوية جعلت الزراعة ممكنة في مصر.',
    keyTerm: { arabic: 'نهر', english: 'river', transliteration: 'nahr' },
    discoveryTrigger: 'quest_complete:main_quest_7',
    zone: null,
    rarity: 'legendary'
  },

  // ── Rare (3) ──
  {
    id: 'geography_002',
    title: 'Rub\' al-Khali — The Empty Quarter',
    titleArabic: 'الربع الخالي',
    category: 'geography',
    content: 'The Rub\' al-Khali (Empty Quarter) is the world\'s largest contiguous sand desert, covering 650,000 square kilometers across Saudi Arabia, Oman, the UAE, and Yemen. Its dunes reach heights of over 250 meters. Despite its name, it supports specialized wildlife including the Arabian oryx and is believed to hold vast oil and natural gas reserves.',
    contentArabic: 'الربع الخالي أكبر صحراء رملية متّصلة في العالم تمتدّ عبر أربع دول عربية.',
    keyTerm: { arabic: 'صحراء', english: 'desert', transliteration: 'ṣaḥrāʾ' },
    discoveryTrigger: 'zone_visit:hidden-oasis',
    zone: 'hidden-oasis',
    rarity: 'rare'
  },
  {
    id: 'geography_003',
    title: 'The Dead Sea — Lowest Point on Earth',
    titleArabic: 'البحر الميت — أخفض نقطة على الأرض',
    category: 'geography',
    content: 'The Dead Sea, bordering Jordan, Israel, and Palestine, lies approximately 430 meters below sea level, making it the lowest land elevation on Earth. Its water is nearly ten times saltier than the ocean, so dense that swimmers float effortlessly. The surrounding area has been a source of salt, bitumen, and minerals since antiquity.',
    contentArabic: 'البحر الميت أخفض نقطة على سطح الأرض بنحو ٤٣٠ مترًا تحت مستوى البحر ومياهه شديدة الملوحة.',
    keyTerm: { arabic: 'ملح', english: 'salt', transliteration: 'milḥ' },
    discoveryTrigger: 'npc_talk:guide-amira',
    zone: null,
    rarity: 'rare'
  },
  {
    id: 'geography_004',
    title: 'The Strait of Hormuz — Chokepoint of World Energy',
    titleArabic: 'مضيق هرمز — معبر الطاقة العالمية',
    category: 'geography',
    content: 'The Strait of Hormuz, only 39 km wide at its narrowest, connects the Persian Gulf to the Gulf of Oman and the open ocean. Roughly one-fifth of the world\'s oil supply passes through it daily, making it the most strategically important maritime chokepoint on Earth. It separates Iran from Oman and the UAE.',
    contentArabic: 'مضيق هرمز بعرض ٣٩ كم فقط يمرّ عبره نحو خُمس إمدادات النفط العالمية يوميًّا.',
    keyTerm: { arabic: 'مضيق', english: 'strait / narrows', transliteration: 'maḍīq' },
    discoveryTrigger: 'zone_visit:coastal-port',
    zone: 'coastal-port',
    rarity: 'rare'
  },

  // ── Uncommon (12) ──
  {
    id: 'geography_005',
    title: 'Damascus — The World\'s Oldest Inhabited City',
    titleArabic: 'دمشق — أقدم مدينة مأهولة في العالم',
    category: 'geography',
    content: 'Damascus, the capital of Syria, is widely regarded as one of the oldest continuously inhabited cities in the world, with evidence of settlement dating back to at least 10,000 BCE. It was a major stop on the Silk Road and has been ruled by Aramaeans, Romans, Umayyads, and Ottomans. The Umayyad Mosque (Great Mosque of Damascus) is one of Islam\'s holiest sites.',
    contentArabic: 'دمشق من أقدم المدن المأهولة في العالم بتاريخ استيطان يعود لعشرة آلاف سنة على الأقل.',
    keyTerm: { arabic: 'مدينة', english: 'city', transliteration: 'madīna' },
    discoveryTrigger: 'word_learn:word_madina',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'geography_006',
    title: 'Baghdad — The Round City',
    titleArabic: 'بغداد — المدينة المدوّرة',
    category: 'geography',
    content: 'Baghdad was founded in 762 CE by Caliph al-Mansur as a planned circular city called Madinat al-Salam (City of Peace). At its peak under the Abbasids, it was the largest city in the world with a population estimated at over one million. Situated between the Tigris and Euphrates rivers, it controlled trade routes linking East and West.',
    contentArabic: 'بغداد أسّسها الخليفة المنصور عام ٧٦٢م كمدينة مدوّرة وكانت أكبر مدينة في العالم.',
    keyTerm: { arabic: 'سلام', english: 'peace', transliteration: 'salām' },
    discoveryTrigger: 'npc_talk:scholar-yusuf',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'geography_007',
    title: 'Cairo — The City Victorious',
    titleArabic: 'القاهرة — المدينة القاهرة',
    category: 'geography',
    content: 'Cairo (al-Qāhira, meaning "The Victorious") was founded in 969 CE by the Fatimid general Jawhar al-Siqilli. It is the largest city in the Arab world and Africa, home to over 20 million people in its metropolitan area. Cairo sits near the ancient cities of Memphis and Heliopolis and is guarded by the Giza pyramids on its western edge.',
    contentArabic: 'القاهرة أكبر مدينة في العالم العربي وأفريقيا أسّسها الفاطميون عام ٩٦٩م.',
    keyTerm: { arabic: 'قاهرة', english: 'victorious / Cairo', transliteration: 'qāhira' },
    discoveryTrigger: 'level_reach:13',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'geography_008',
    title: 'Fez — The Spiritual Capital of Morocco',
    titleArabic: 'فاس — العاصمة الروحية للمغرب',
    category: 'geography',
    content: 'Fez (Fās) was founded in 789 CE and is home to Al-Qarawiyyin, recognized by UNESCO and Guinness as the world\'s oldest existing, continually operating university (founded 859 CE by Fatima al-Fihri). The medina of Fez is the world\'s largest car-free urban area, with over 9,000 narrow alleyways housing traditional artisans, tanneries, and madrasas.',
    contentArabic: 'فاس تضمّ جامعة القرويين أقدم جامعة مستمرّة في العالم أسّستها فاطمة الفهرية عام ٨٥٩م.',
    keyTerm: { arabic: 'مدرسة', english: 'school / madrasa', transliteration: 'madrasa' },
    discoveryTrigger: 'npc_talk:librarian-ibrahim',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'geography_009',
    title: 'Córdoba — Jewel of Al-Andalus',
    titleArabic: 'قرطبة — جوهرة الأندلس',
    category: 'geography',
    content: 'Córdoba in southern Spain was the capital of the Umayyad Caliphate in Al-Andalus and the most populous city in 10th-century Europe, with perhaps half a million inhabitants. It boasted paved streets, public lighting, running water, libraries, and hundreds of public baths — amenities that most European cities would not have for centuries.',
    contentArabic: 'قرطبة كانت عاصمة الخلافة الأموية في الأندلس وأكبر مدينة في أوروبا في القرن العاشر.',
    keyTerm: { arabic: 'عاصمة', english: 'capital (city)', transliteration: 'ʿāṣima' },
    discoveryTrigger: 'quest_complete:side_quest_travelers_1',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'geography_010',
    title: 'The Levant — Bilad al-Sham',
    titleArabic: 'بلاد الشام',
    category: 'geography',
    content: 'The Levant (Bilad al-Sham) encompasses modern Syria, Lebanon, Jordan, Palestine, and parts of southern Turkey and northern Iraq. It is one of the most historically significant regions on Earth — the birthplace of agriculture, the alphabet, and three major religions. Its diverse geography includes the Mediterranean coast, fertile valleys, and the Syrian Desert.',
    contentArabic: 'بلاد الشام تشمل سوريا ولبنان والأردن وفلسطين وتُعدّ من أهمّ المناطق تاريخيًّا في العالم.',
    keyTerm: { arabic: 'بلاد', english: 'lands / countries', transliteration: 'bilād' },
    discoveryTrigger: 'zone_visit:mountain-pass',
    zone: 'mountain-pass',
    rarity: 'uncommon'
  },
  {
    id: 'geography_011',
    title: 'The Maghreb — Lands of the Setting Sun',
    titleArabic: 'المغرب العربي — أرض الغروب',
    category: 'geography',
    content: 'The Maghreb ("place of sunset" or "west") comprises Morocco, Algeria, Tunisia, Libya, and Mauritania. It is bounded by the Atlas Mountains, the Sahara Desert, and the Mediterranean Sea. The region\'s Berber (Amazigh) heritage predates Arab settlement, and its culture blends Arab, Berber, and Mediterranean influences.',
    contentArabic: 'المغرب العربي يشمل المغرب والجزائر وتونس وليبيا وموريتانيا ويمزج بين الثقافة العربية والأمازيغية.',
    keyTerm: { arabic: 'غرب', english: 'west', transliteration: 'gharb' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'geography_012',
    title: 'Oasis Ecosystems — Life in the Desert',
    titleArabic: 'النظام البيئي للواحات — الحياة في الصحراء',
    category: 'geography',
    content: 'An oasis (wāḥa) is a fertile area in the desert sustained by underground water sources. Oases were critical to caravan trade routes, serving as rest stops and refueling points. Traditional oasis agriculture uses a three-tier system: date palms provide shade for fruit trees below, which shade vegetables and grains at ground level.',
    contentArabic: 'الواحة منطقة خصبة في الصحراء تُغذّيها مياه جوفية وتستخدم نظامًا زراعيًّا متعدّد الطبقات.',
    keyTerm: { arabic: 'واحة', english: 'oasis', transliteration: 'wāḥa' },
    discoveryTrigger: 'zone_visit:hidden-oasis',
    zone: 'hidden-oasis',
    rarity: 'uncommon'
  },
  {
    id: 'geography_013',
    title: 'Wadis — Dry Riverbeds of the Desert',
    titleArabic: 'الأودية — مجاري الأنهار الجافة',
    category: 'geography',
    content: 'A wadi is a valley or dry riverbed that fills with water during seasonal rains. Flash floods in wadis can be extremely dangerous, transforming a dry gulch into a raging torrent in minutes. Despite their aridity, wadis support surprisingly rich ecosystems and have been routes of travel and settlement for millennia.',
    contentArabic: 'الوادي مجرى نهري جاف يمتلئ بالمياه خلال الأمطار الموسمية وقد يسبّب فيضانات مفاجئة.',
    keyTerm: { arabic: 'وادي', english: 'valley / wadi', transliteration: 'wādī' },
    discoveryTrigger: 'zone_visit:mountain-pass',
    zone: 'mountain-pass',
    rarity: 'uncommon'
  },
  {
    id: 'geography_014',
    title: 'The Tigris and Euphrates — Cradle of Civilization',
    titleArabic: 'دجلة والفرات — مهد الحضارة',
    category: 'geography',
    content: 'The Tigris (Dijla) and Euphrates (al-Furāt) rivers define Mesopotamia ("land between the rivers"), where some of humanity\'s earliest civilizations — Sumer, Babylon, and Assyria — arose. Both rivers originate in Turkey and flow through Iraq to the Persian Gulf. Their waters sustained irrigation-based agriculture that fed the ancient world.',
    contentArabic: 'نهرا دجلة والفرات يحدّدان بلاد ما بين النهرين حيث نشأت أقدم الحضارات البشرية.',
    keyTerm: { arabic: 'نهران', english: 'two rivers', transliteration: 'nahrān' },
    discoveryTrigger: 'npc_talk:scholar-yusuf',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'geography_015',
    title: 'The Atlas Mountains',
    titleArabic: 'جبال الأطلس',
    category: 'geography',
    content: 'The Atlas Mountains stretch across Morocco, Algeria, and Tunisia for about 2,500 km. The highest peak, Toubkal (4,167 m), is in Morocco. The mountains create a natural barrier between the fertile Mediterranean coast and the Sahara Desert. Berber communities have inhabited these mountains for millennia, maintaining distinct languages and traditions.',
    contentArabic: 'جبال الأطلس تمتدّ عبر المغرب والجزائر وتونس بطول ٢٥٠٠ كم وتفصل الساحل عن الصحراء.',
    keyTerm: { arabic: 'جبل', english: 'mountain', transliteration: 'jabal' },
    discoveryTrigger: 'zone_visit:mountain-pass',
    zone: 'mountain-pass',
    rarity: 'uncommon'
  },
  {
    id: 'geography_016',
    title: 'Samarkand — Crossroads of Cultures',
    titleArabic: 'سمرقند — ملتقى الثقافات',
    category: 'geography',
    content: 'Samarkand, in modern Uzbekistan, was a key Silk Road city that flourished under Arab, Persian, and Turkic rule. After the Mongol destruction, Timur (Tamerlane) rebuilt it as his capital, adorning it with stunning tilework mosques and madrasas. Its Registan Square remains one of the most magnificent public spaces in the Islamic world.',
    contentArabic: 'سمرقند مدينة على طريق الحرير ازدهرت تحت حكم العرب والفرس والأتراك والمغول.',
    keyTerm: { arabic: 'طريق', english: 'road / path', transliteration: 'ṭarīq' },
    discoveryTrigger: 'npc_talk:captain-rashid',
    zone: null,
    rarity: 'uncommon'
  },

  // ── Common (14) ──
  {
    id: 'geography_017',
    title: 'The Sahara Desert',
    titleArabic: 'الصحراء الكبرى',
    category: 'geography',
    content: 'The Sahara is the world\'s largest hot desert, spanning over 9 million square kilometers across eleven countries. Despite its reputation as endless sand, only about 25% is sand dunes (erg); the rest is rocky plateaus (hammada), gravel plains (reg), and dry valleys. The word "Sahara" itself comes from the Arabic "ṣaḥrāʾ" meaning "desert."',
    contentArabic: 'الصحراء الكبرى أكبر صحراء حارّة في العالم وتمتدّ عبر أحد عشر بلدًا.',
    keyTerm: { arabic: 'رمل', english: 'sand', transliteration: 'raml' },
    discoveryTrigger: 'zone_visit:bedouin-camp',
    zone: 'bedouin-camp',
    rarity: 'common'
  },
  {
    id: 'geography_018',
    title: 'The Arabian Peninsula',
    titleArabic: 'شبه الجزيرة العربية',
    category: 'geography',
    content: 'The Arabian Peninsula is the world\'s largest peninsula, encompassing Saudi Arabia, Yemen, Oman, the UAE, Qatar, Bahrain, and Kuwait. It sits atop roughly one-third of the world\'s known oil reserves. The landscape ranges from the Rub\' al-Khali\'s vast sand seas to the green mountains of Yemen and Oman\'s fjord-like coastline.',
    contentArabic: 'شبه الجزيرة العربية أكبر شبه جزيرة في العالم وتضمّ نحو ثلث احتياطيات النفط العالمية.',
    keyTerm: { arabic: 'جزيرة', english: 'island / peninsula', transliteration: 'jazīra' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_019',
    title: 'The Hajj Route — Ancient Pilgrimage Paths',
    titleArabic: 'طرق الحج القديمة',
    category: 'geography',
    content: 'For centuries, pilgrims traveled to Mecca along established Hajj routes: the Egyptian route along the Red Sea coast, the Syrian route (Darb al-Hajj al-Shami) from Damascus, and the Iraqi route from Kufa. These routes featured caravanserais, wells, and forts at regular intervals. Today most pilgrims arrive by air, but the historic routes are preserved.',
    contentArabic: 'كان الحجّاج يسلكون طرقًا مُحدّدة إلى مكة من مصر والشام والعراق مزوّدة بخانات وآبار.',
    keyTerm: { arabic: 'حاجّ', english: 'pilgrim', transliteration: 'ḥājj' },
    discoveryTrigger: 'quest_complete:side_quest_travelers_2',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_020',
    title: 'Mecca — The Holiest City in Islam',
    titleArabic: 'مكة المكرّمة',
    category: 'geography',
    content: 'Mecca (Makkah al-Mukarramah) in western Saudi Arabia is the holiest city in Islam, birthplace of the Prophet Muhammad and home to the Kaaba. Non-Muslims are not permitted to enter the city. During the annual Hajj pilgrimage, over two million Muslims gather here, making it the largest annual human gathering on Earth.',
    contentArabic: 'مكة المكرّمة أقدس مدينة في الإسلام ومسقط رأس النبي محمد وموطن الكعبة.',
    keyTerm: { arabic: 'مكّة', english: 'Mecca', transliteration: 'Makka' },
    discoveryTrigger: 'word_learn:word_masjid',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_021',
    title: 'Medina — The City of the Prophet',
    titleArabic: 'المدينة المنوّرة',
    category: 'geography',
    content: 'Medina (al-Madīna al-Munawwara, "The Radiant City") is Islam\'s second holiest city. It was the destination of the Hijra and where the Prophet Muhammad is buried in the Prophet\'s Mosque (al-Masjid al-Nabawi). The city welcomed the first Muslim community and served as the capital of the early Islamic state.',
    contentArabic: 'المدينة المنوّرة ثاني أقدس مدينة في الإسلام حيث هاجر إليها النبي ودُفن فيها.',
    keyTerm: { arabic: 'مسجد', english: 'mosque', transliteration: 'masjid' },
    discoveryTrigger: 'level_reach:16',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_022',
    title: 'Jerusalem — Al-Quds',
    titleArabic: 'القدس',
    category: 'geography',
    content: 'Jerusalem (al-Quds, "The Holy") is sacred to Islam, Christianity, and Judaism. The Dome of the Rock and al-Aqsa Mosque stand on the Noble Sanctuary (al-Haram al-Sharif), from which Muslims believe the Prophet Muhammad ascended to heaven during the Night Journey (al-Isra\' wa al-Mi\'raj). It was the first qibla (direction of prayer) in Islam.',
    contentArabic: 'القدس مدينة مقدّسة عند المسلمين والمسيحيين واليهود وتضمّ المسجد الأقصى وقبّة الصخرة.',
    keyTerm: { arabic: 'قدس', english: 'holy / Jerusalem', transliteration: 'quds' },
    discoveryTrigger: 'npc_talk:elder-tariq',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_023',
    title: 'The Red Sea — Bahr al-Ahmar',
    titleArabic: 'البحر الأحمر',
    category: 'geography',
    content: 'The Red Sea (al-Bahr al-Ahmar) separates the Arabian Peninsula from northeastern Africa. It is one of the world\'s most heavily traveled waterways, connecting the Mediterranean to the Indian Ocean via the Suez Canal. Its warm, clear waters harbor over 1,200 species of fish and some of the world\'s most pristine coral reefs.',
    contentArabic: 'البحر الأحمر يفصل شبه الجزيرة العربية عن شمال شرق أفريقيا ويضمّ شعابًا مرجانية بكرية.',
    keyTerm: { arabic: 'أحمر', english: 'red', transliteration: 'aḥmar' },
    discoveryTrigger: 'zone_visit:coastal-port',
    zone: 'coastal-port',
    rarity: 'common'
  },
  {
    id: 'geography_024',
    title: 'Wadi Rum — Valley of the Moon',
    titleArabic: 'وادي رم — وادي القمر',
    category: 'geography',
    content: 'Wadi Rum in southern Jordan is a sandstone desert valley known for its dramatic rock formations, natural arches, and ancient Thamudic inscriptions. T.E. Lawrence (Lawrence of Arabia) based his operations here during the Arab Revolt, and the landscape has served as a filming location for numerous science fiction movies due to its Mars-like terrain.',
    contentArabic: 'وادي رم في جنوب الأردن صحراء ذات تكوينات صخرية مذهلة وأقواس طبيعية.',
    keyTerm: { arabic: 'قمر', english: 'moon', transliteration: 'qamar' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_025',
    title: 'The Fertile Crescent',
    titleArabic: 'الهلال الخصيب',
    category: 'geography',
    content: 'The Fertile Crescent is an arc of productive land stretching from the Nile Delta through the Levant and down the Tigris-Euphrates valley. It is where agriculture, writing, and urbanization first emerged around 10,000 BCE. The term was coined by Egyptologist James Henry Breasted in 1916 and encompasses modern-day Iraq, Syria, Lebanon, Jordan, Palestine, and parts of Turkey.',
    contentArabic: 'الهلال الخصيب قوس من الأراضي الخصبة حيث نشأت الزراعة والكتابة والمدن لأول مرة.',
    keyTerm: { arabic: 'خصيب', english: 'fertile', transliteration: 'khaṣīb' },
    discoveryTrigger: 'word_learn:word_ard',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_026',
    title: 'Oman\'s Frankincense Trail',
    titleArabic: 'طريق اللبان في عُمان',
    category: 'geography',
    content: 'The Dhofar region of Oman has been the world\'s primary source of frankincense for over 5,000 years. The ancient frankincense trade route connected Oman\'s southern coast to the Mediterranean, passing through the legendary city of Ubar (described as the "Atlantis of the Sands"). The Land of Frankincense is now a UNESCO World Heritage Site.',
    contentArabic: 'منطقة ظفار في عُمان المصدر الرئيسي للبان في العالم منذ أكثر من خمسة آلاف عام.',
    keyTerm: { arabic: 'لبان', english: 'frankincense', transliteration: 'lubān' },
    discoveryTrigger: 'npc_talk:captain-rashid',
    zone: 'coastal-port',
    rarity: 'common'
  },
  {
    id: 'geography_027',
    title: 'The Suez Canal',
    titleArabic: 'قناة السويس',
    category: 'geography',
    content: 'The Suez Canal, completed in 1869, is a 193 km artificial waterway in Egypt connecting the Mediterranean Sea to the Red Sea. It eliminated the need to sail around Africa, reducing the voyage from Europe to Asia by thousands of kilometers. Today it handles about 12% of global trade and is one of Egypt\'s top revenue sources.',
    contentArabic: 'قناة السويس ممرّ مائي اصطناعي بطول ١٩٣ كم يربط البحر المتوسط بالبحر الأحمر.',
    keyTerm: { arabic: 'قناة', english: 'canal / channel', transliteration: 'qanāh' },
    discoveryTrigger: 'level_reach:17',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_028',
    title: 'Yemen — Arabia Felix',
    titleArabic: 'اليمن — العربية السعيدة',
    category: 'geography',
    content: 'The Romans called Yemen "Arabia Felix" (Happy Arabia) because its monsoon-fed highlands supported agriculture in contrast to the arid north. Yemen is home to Socotra, an island with such unique biodiversity it is called the "Galapagos of the Indian Ocean." The ancient Sabaean kingdom (Sheba) built the Great Dam of Marib here around 750 BCE.',
    contentArabic: 'اليمن سمّاها الرومان "العربية السعيدة" لخصوبة مرتفعاتها وتضمّ جزيرة سقطرى الفريدة بيولوجيًّا.',
    keyTerm: { arabic: 'يمن', english: 'Yemen / prosperity', transliteration: 'yaman' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_029',
    title: 'The Hejaz — Western Arabia',
    titleArabic: 'الحجاز — غرب الجزيرة العربية',
    category: 'geography',
    content: 'The Hejaz (al-Ḥijāz, meaning "barrier") is the western region of Saudi Arabia containing Islam\'s two holiest cities, Mecca and Medina. The Hejaz Mountains form a natural barrier between the coastal Tihama plain and the interior Najd plateau. Historically, the Hejaz was a cosmopolitan crossroads of pilgrims, merchants, and cultures from across the Muslim world.',
    contentArabic: 'الحجاز منطقة غرب السعودية تضمّ مكة والمدينة وتُعدّ ملتقى الحجّاج والتجّار من العالم الإسلامي.',
    keyTerm: { arabic: 'حجاز', english: 'Hejaz / barrier', transliteration: 'ḥijāz' },
    discoveryTrigger: 'quest_complete:main_quest_8',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'geography_030',
    title: 'Arabian Peninsula Geology — Oil Formation',
    titleArabic: 'جيولوجيا شبه الجزيرة العربية — تكوّن النفط',
    category: 'geography',
    content: 'The Arabian Peninsula sits on one of Earth\'s largest petroleum reserves, formed over hundreds of millions of years from ancient marine organisms buried under sedimentary rock. The Ghawar field in Saudi Arabia is the world\'s largest conventional oil field. This geological wealth has transformed the region\'s economies and global geopolitics since the 20th century.',
    contentArabic: 'شبه الجزيرة العربية تحتوي على واحدة من أكبر احتياطيات النفط في العالم تكوّنت عبر ملايين السنين.',
    keyTerm: { arabic: 'نفط', english: 'oil / petroleum', transliteration: 'nafṭ' },
    discoveryTrigger: 'level_reach:18',
    zone: null,
    rarity: 'common'
  },

  // ═══════════════════════════════════════════════════════════════════
  //  RELIGION (30 entries)
  // ═══════════════════════════════════════════════════════════════════

  // ── Legendary (2) ──
  {
    id: 'religion_001',
    title: 'The Quran — The Final Revelation',
    titleArabic: 'القرآن الكريم — الوحي الأخير',
    category: 'religion',
    content: 'The Quran is the central religious text of Islam, believed by Muslims to be the literal word of God (Allah) revealed to the Prophet Muhammad over 23 years (610–632 CE) through the Angel Jibril (Gabriel). It contains 114 chapters (surahs) and over 6,200 verses (ayat). The Quran is considered inimitable in its Arabic, and its memorization (hifz) is a revered practice.',
    contentArabic: 'القرآن الكريم كلام الله المنزّل على النبي محمد عبر ثلاث وعشرين سنة ويحتوي على ١١٤ سورة.',
    keyTerm: { arabic: 'قرآن', english: 'Quran (recitation)', transliteration: 'Qurʾān' },
    discoveryTrigger: 'quest_complete:main_quest_1',
    zone: null,
    rarity: 'legendary'
  },
  {
    id: 'religion_002',
    title: 'The Kaaba — House of God',
    titleArabic: 'الكعبة المشرّفة — بيت الله',
    category: 'religion',
    content: 'The Kaaba is a cube-shaped structure at the center of the Masjid al-Haram in Mecca, considered the most sacred site in Islam. Muslims believe it was originally built by Prophet Ibrahim (Abraham) and his son Ismail. It is the qibla — the direction all Muslims face during prayer. The Black Stone (al-Hajar al-Aswad) is embedded in its eastern corner.',
    contentArabic: 'الكعبة المشرّفة بناء مكعّب في وسط المسجد الحرام بمكة يتّجه إليها المسلمون في صلاتهم.',
    keyTerm: { arabic: 'كعبة', english: 'Kaaba (cube)', transliteration: 'Kaʿba' },
    discoveryTrigger: 'level_reach:20',
    zone: null,
    rarity: 'legendary'
  },

  // ── Rare (4) ──
  {
    id: 'religion_003',
    title: 'The Five Pillars of Islam',
    titleArabic: 'أركان الإسلام الخمسة',
    category: 'religion',
    content: 'The Five Pillars (Arkan al-Islam) are the foundational acts of worship: Shahada (declaration of faith), Salah (five daily prayers), Zakat (obligatory charity of 2.5% of savings), Sawm (fasting during Ramadan), and Hajj (pilgrimage to Mecca at least once if able). Together they structure a Muslim\'s daily life, annual calendar, and lifetime obligations.',
    contentArabic: 'أركان الإسلام الخمسة هي: الشهادة والصلاة والزكاة والصوم والحج.',
    keyTerm: { arabic: 'ركن', english: 'pillar / cornerstone', transliteration: 'rukn' },
    discoveryTrigger: 'word_learn:word_islam',
    zone: null,
    rarity: 'rare'
  },
  {
    id: 'religion_004',
    title: 'Sufi Mysticism — The Inner Path',
    titleArabic: 'التصوّف — الطريق الباطني',
    category: 'religion',
    content: 'Sufism (Tasawwuf) is the mystical dimension of Islam, focused on the purification of the soul and attaining closeness to God through love, devotion, and spiritual practices. Sufi orders (tariqas) like the Qadiriyya, Naqshbandiyya, and Mevlevi (Whirling Dervishes) have spread across the Muslim world. Sufi poetry by Rumi, Hafiz, and Ibn Arabi remains universally beloved.',
    contentArabic: 'التصوّف هو البعد الروحي للإسلام يركّز على تزكية النفس والتقرّب من الله بالحب والعبادة.',
    keyTerm: { arabic: 'تصوّف', english: 'Sufism / mysticism', transliteration: 'taṣawwuf' },
    discoveryTrigger: 'faction_tier:scholars:allied',
    zone: 'hidden-oasis',
    rarity: 'rare'
  },
  {
    id: 'religion_005',
    title: 'Islamic Geometric Patterns — Infinite Beauty',
    titleArabic: 'الأنماط الهندسية الإسلامية — جمال لا نهائي',
    category: 'religion',
    content: 'Islamic geometric art uses mathematical principles to create intricate, repeating patterns that suggest the infinite nature of God. Artists construct complex designs using only a compass and straightedge, generating stars, tessellations, and interlocking forms that can extend infinitely without repeating. This art form adorns mosques, palaces, and manuscripts worldwide.',
    contentArabic: 'الفن الهندسي الإسلامي يستخدم مبادئ رياضية لإنشاء أنماط متكرّرة تشير إلى لا نهائية الله.',
    keyTerm: { arabic: 'هندسة', english: 'geometry / engineering', transliteration: 'handasa' },
    discoveryTrigger: 'faction_tier:artisans:trusted',
    zone: null,
    rarity: 'rare'
  },
  {
    id: 'religion_006',
    title: 'The Hajj Pilgrimage — Journey of a Lifetime',
    titleArabic: 'فريضة الحج — رحلة العمر',
    category: 'religion',
    content: 'The Hajj is the annual Islamic pilgrimage to Mecca, required of every able Muslim at least once in their lifetime. It takes place during the 8th to 12th of Dhul Hijjah, the last month of the Islamic calendar. Pilgrims wear simple white garments (ihram), symbolizing equality before God, and perform rites including circling the Kaaba seven times (tawaf) and walking between Safa and Marwa.',
    contentArabic: 'الحج فريضة على كل مسلم قادر مرة واحدة في العمر ويتضمّن الطواف حول الكعبة سبع مرات.',
    keyTerm: { arabic: 'حج', english: 'pilgrimage', transliteration: 'ḥajj' },
    discoveryTrigger: 'quest_complete:main_quest_10',
    zone: null,
    rarity: 'rare'
  },

  // ── Uncommon (10) ──
  {
    id: 'religion_007',
    title: 'Salah — The Five Daily Prayers',
    titleArabic: 'الصلاة — الصلوات الخمس',
    category: 'religion',
    content: 'Salah consists of five obligatory prayers performed daily at specific times: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night). Each prayer involves a series of physical postures — standing, bowing, prostrating — accompanied by Quranic recitation. Prayer times follow the sun\'s position, connecting worship to the natural world.',
    contentArabic: 'الصلوات الخمس هي: الفجر والظهر والعصر والمغرب والعشاء، وتُؤدَّى في أوقات مرتبطة بالشمس.',
    keyTerm: { arabic: 'صلاة', english: 'prayer', transliteration: 'ṣalāh' },
    discoveryTrigger: 'word_learn:word_salah',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'religion_008',
    title: 'Ramadan — The Month of Fasting',
    titleArabic: 'رمضان — شهر الصيام',
    category: 'religion',
    content: 'Ramadan is the ninth month of the Islamic calendar, during which Muslims fast from dawn to sunset, abstaining from food, drink, and other physical needs. It commemorates the first revelation of the Quran. Fasting cultivates empathy for the hungry, self-discipline, and spiritual reflection. The fast is broken daily with dates and water at iftar.',
    contentArabic: 'رمضان الشهر التاسع في التقويم الهجري يصوم فيه المسلمون من الفجر حتى المغرب.',
    keyTerm: { arabic: 'صيام', english: 'fasting', transliteration: 'ṣiyām' },
    discoveryTrigger: 'word_learn:word_ramadan',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'religion_009',
    title: 'Zakat — Obligatory Charity',
    titleArabic: 'الزكاة — الصدقة الواجبة',
    category: 'religion',
    content: 'Zakat is the third pillar of Islam, requiring Muslims to donate 2.5% of their accumulated wealth annually to those in need. The Quran specifies eight categories of recipients, including the poor, the indebted, and travelers in need. Zakat literally means "purification," reflecting the belief that giving purifies remaining wealth.',
    contentArabic: 'الزكاة ركن من أركان الإسلام يُلزم المسلم بدفع ٢.٥٪ من ثروته سنويًّا للمحتاجين.',
    keyTerm: { arabic: 'زكاة', english: 'obligatory charity', transliteration: 'zakāh' },
    discoveryTrigger: 'npc_talk:merchant-fatima',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'religion_010',
    title: 'Mosque Architecture — Form and Function',
    titleArabic: 'عمارة المسجد — الشكل والوظيفة',
    category: 'religion',
    content: 'Islamic mosque architecture features several key elements: the minaret (ma\'dhana) for the call to prayer, the mihrab (prayer niche indicating the qibla direction), the minbar (pulpit for Friday sermons), and the sahn (courtyard) with a fountain for ablution. Architectural styles vary from the Ottoman dome tradition to the Moroccan riad style.',
    contentArabic: 'عمارة المسجد تتضمّن المئذنة والمحراب والمنبر والصحن بنافورة للوضوء.',
    keyTerm: { arabic: 'مئذنة', english: 'minaret', transliteration: 'miʾdhana' },
    discoveryTrigger: 'zone_visit:oasis-village',
    zone: 'oasis-village',
    rarity: 'uncommon'
  },
  {
    id: 'religion_011',
    title: 'The Adhan — Call to Prayer',
    titleArabic: 'الأذان — النداء للصلاة',
    category: 'religion',
    content: 'The adhan is the Islamic call to prayer recited by the muezzin (mu\'adhdhin) from the mosque\'s minaret five times daily. It begins with "Allahu Akbar" (God is Greatest) and includes the shahada (declaration of faith). The first muezzin was Bilal ibn Rabah, an Ethiopian companion of the Prophet Muhammad, chosen for his beautiful voice.',
    contentArabic: 'الأذان نداء للصلاة يُرفع من المئذنة خمس مرات يوميًّا وأول مؤذّن كان بلال بن رباح.',
    keyTerm: { arabic: 'أذان', english: 'call to prayer', transliteration: 'adhān' },
    discoveryTrigger: 'zone_visit:oasis-village',
    zone: 'oasis-village',
    rarity: 'uncommon'
  },
  {
    id: 'religion_012',
    title: 'Wudu — Ritual Ablution',
    titleArabic: 'الوضوء — الطهارة للصلاة',
    category: 'religion',
    content: 'Wudu is the ritual washing performed before prayer, involving washing the hands, rinsing the mouth and nose, washing the face, washing the forearms, wiping the head, and washing the feet. It symbolizes physical and spiritual purification. If water is unavailable, tayammum (dry ablution with clean earth) is permitted.',
    contentArabic: 'الوضوء طهارة تُؤدَّى قبل الصلاة وتشمل غسل اليدين والوجه والذراعين ومسح الرأس وغسل القدمين.',
    keyTerm: { arabic: 'وضوء', english: 'ablution', transliteration: 'wuḍūʾ' },
    discoveryTrigger: 'word_learn:word_maa',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'religion_013',
    title: 'The Islamic Calendar — Hijri System',
    titleArabic: 'التقويم الهجري',
    category: 'religion',
    content: 'The Islamic (Hijri) calendar is a lunar calendar with 12 months of 29 or 30 days, making the year about 11 days shorter than the solar year. It begins from the Hijra (622 CE). The months include Muharram, Safar, Rabi al-Awwal, and culminate in Dhul Hijjah (the pilgrimage month). Ramadan, the fasting month, shifts through the seasons over a 33-year cycle.',
    contentArabic: 'التقويم الهجري تقويم قمري يبدأ من هجرة النبي محمد ويتكوّن من اثني عشر شهرًا.',
    keyTerm: { arabic: 'تقويم', english: 'calendar', transliteration: 'taqwīm' },
    discoveryTrigger: 'level_reach:5',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'religion_014',
    title: 'The Madrasa — Islamic Educational Institution',
    titleArabic: 'المدرسة — مؤسّسة التعليم الإسلامي',
    category: 'religion',
    content: 'The madrasa (school) evolved from informal study circles in mosques to sophisticated educational institutions with endowments (waqf), libraries, and dormitories. The Nizamiyya madrasas, founded in the 11th century by Nizam al-Mulk, standardized the curriculum across the Seljuk Empire. The madrasa system influenced the development of European universities.',
    contentArabic: 'المدرسة الإسلامية تطوّرت من حلقات العلم في المساجد إلى مؤسسات تعليمية متكاملة.',
    keyTerm: { arabic: 'علم', english: 'knowledge / science', transliteration: 'ʿilm' },
    discoveryTrigger: 'npc_talk:scholar-yusuf',
    zone: 'ancient-library',
    rarity: 'uncommon'
  },
  {
    id: 'religion_015',
    title: 'Islamic Art — The Prohibition of Figurative Imagery',
    titleArabic: 'الفن الإسلامي — تحريم التصوير',
    category: 'religion',
    content: 'Islamic art generally avoids depicting humans and animals in religious contexts, based on hadith prohibitions against creating "graven images." This led to the extraordinary development of calligraphy, geometric patterns, and arabesque (plant-based) designs as primary art forms. However, figurative art flourished in secular contexts, especially in Persian and Mughal miniature painting.',
    contentArabic: 'الفن الإسلامي يتجنّب تصوير البشر والحيوانات في السياق الديني ممّا أدّى لازدهار الخط والزخرفة.',
    keyTerm: { arabic: 'فنّ', english: 'art', transliteration: 'fann' },
    discoveryTrigger: 'faction_tier:artisans:friendly',
    zone: null,
    rarity: 'uncommon'
  },
  {
    id: 'religion_016',
    title: 'Prophetic Traditions — The Hadith',
    titleArabic: 'الأحاديث النبوية',
    category: 'religion',
    content: 'Hadith are records of the Prophet Muhammad\'s sayings, actions, and approvals, forming the second source of Islamic law after the Quran. Scholars like al-Bukhari and Muslim ibn al-Hajjaj meticulously verified chains of transmission (isnad) to compile authoritative collections. The science of hadith authentication (\'ilm al-hadith) is one of Islam\'s most rigorous scholarly disciplines.',
    contentArabic: 'الأحاديث النبوية سجلّ لأقوال النبي محمد وأفعاله وتُعدّ المصدر الثاني للشريعة بعد القرآن.',
    keyTerm: { arabic: 'حديث', english: 'hadith / tradition', transliteration: 'ḥadīth' },
    discoveryTrigger: 'npc_talk:vizier-abbas',
    zone: null,
    rarity: 'uncommon'
  },

  // ── Common (14) ──
  {
    id: 'religion_017',
    title: 'The Shahada — Declaration of Faith',
    titleArabic: 'الشهادة — إعلان الإيمان',
    category: 'religion',
    content: 'The Shahada is the Islamic declaration of faith: "Ashhadu an la ilaha illa Allah, wa ashhadu anna Muhammadan rasul Allah" (I testify that there is no god but God, and Muhammad is the Messenger of God). Reciting it sincerely before witnesses is the act of entering Islam. It is the first pillar of Islam and is whispered into a newborn\'s ear.',
    contentArabic: 'الشهادة هي "أشهد أن لا إله إلا الله وأشهد أن محمدًا رسول الله" وهي أول أركان الإسلام.',
    keyTerm: { arabic: 'شهادة', english: 'testimony / declaration', transliteration: 'shahāda' },
    discoveryTrigger: 'level_reach:1',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_018',
    title: 'Bismillah — In the Name of God',
    titleArabic: 'بسم الله الرحمن الرحيم',
    category: 'religion',
    content: 'The basmala ("Bismillah al-Rahman al-Rahim" — In the Name of God, the Most Gracious, the Most Merciful) opens every chapter of the Quran except one (Surah at-Tawba). Muslims recite it before eating, traveling, starting work, or beginning any significant action. It is one of the most calligraphed phrases in the Islamic world.',
    contentArabic: 'البسملة تُقال في بداية كل عمل وتفتتح كل سور القرآن عدا سورة التوبة.',
    keyTerm: { arabic: 'رحمة', english: 'mercy', transliteration: 'raḥma' },
    discoveryTrigger: 'word_learn:word_bismillah',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_019',
    title: 'The Qibla — Direction of Prayer',
    titleArabic: 'القبلة — اتجاه الصلاة',
    category: 'religion',
    content: 'The qibla is the direction Muslims face during prayer, pointing toward the Kaaba in Mecca. Early Muslims initially prayed toward Jerusalem before the qibla was changed to Mecca. Every mosque has a mihrab (niche in the wall) indicating the qibla direction. Today, smartphone apps calculate the precise qibla angle from any location on Earth.',
    contentArabic: 'القبلة هي الاتجاه الذي يتوجّه إليه المسلمون في صلاتهم نحو الكعبة في مكة.',
    keyTerm: { arabic: 'قبلة', english: 'direction of prayer', transliteration: 'qibla' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_020',
    title: 'Surah Al-Fatiha — The Opening Chapter',
    titleArabic: 'سورة الفاتحة',
    category: 'religion',
    content: 'Al-Fatiha ("The Opening") is the first chapter of the Quran, consisting of seven verses. It is recited in every unit (rak\'ah) of Islamic prayer, making it the most-recited passage in the Quran. It praises God, acknowledges human dependence on Him, and asks for guidance to "the straight path" (al-sirat al-mustaqim).',
    contentArabic: 'سورة الفاتحة أول سور القرآن وتُقرأ في كل ركعة من الصلاة وتتكوّن من سبع آيات.',
    keyTerm: { arabic: 'فاتحة', english: 'opening', transliteration: 'fātiḥa' },
    discoveryTrigger: 'quest_complete:main_quest_2',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_021',
    title: 'Insha\'Allah — God Willing',
    titleArabic: 'إن شاء الله',
    category: 'religion',
    content: 'The phrase "Insha\'Allah" (God willing) is used by Arabic speakers whenever discussing future plans or events, reflecting the Islamic belief that all outcomes are ultimately determined by God\'s will. The Quran instructs believers: "And never say of anything, \'I will do that tomorrow,\' except [when adding], \'If God wills\'" (18:23-24).',
    contentArabic: 'إن شاء الله تُقال عند الحديث عن المستقبل إيمانًا بأن كل شيء بمشيئة الله.',
    keyTerm: { arabic: 'مشيئة', english: 'will (of God)', transliteration: 'mashīʾa' },
    discoveryTrigger: 'word_learn:word_allah',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_022',
    title: 'The Minbar — The Mosque Pulpit',
    titleArabic: 'المنبر',
    category: 'religion',
    content: 'The minbar is a raised platform or staircase in a mosque from which the imam delivers the Friday sermon (khutba). The Prophet Muhammad\'s original minbar in Medina had just three steps. Over time, minbars became elaborate works of art in carved wood, stone, or marble, often featuring geometric patterns and inscriptions.',
    contentArabic: 'المنبر منصة مرتفعة في المسجد يلقي منها الإمام خطبة الجمعة.',
    keyTerm: { arabic: 'منبر', english: 'pulpit / minbar', transliteration: 'minbar' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_023',
    title: 'Dhikr — Remembrance of God',
    titleArabic: 'الذكر — ذكر الله',
    category: 'religion',
    content: 'Dhikr (remembrance) is the practice of repeatedly reciting the names and praises of God, such as "SubhanAllah" (Glory be to God), "Alhamdulillah" (Praise be to God), and "Allahu Akbar" (God is Greatest). It can be performed silently or aloud, individually or in groups. Prayer beads (misbaha or tasbih) with 33 or 99 beads are commonly used.',
    contentArabic: 'الذكر هو ترديد أسماء الله وتسبيحه مثل "سبحان الله" و"الحمد لله" و"الله أكبر".',
    keyTerm: { arabic: 'ذكر', english: 'remembrance / mention', transliteration: 'dhikr' },
    discoveryTrigger: 'npc_talk:elder-tariq',
    zone: 'hidden-oasis',
    rarity: 'common'
  },
  {
    id: 'religion_024',
    title: 'The 99 Names of God — Al-Asma\' al-Husna',
    titleArabic: 'أسماء الله الحسنى',
    category: 'religion',
    content: 'Islamic tradition holds that God (Allah) has 99 Beautiful Names (al-Asma\' al-Husna), each describing an attribute: al-Rahman (The Most Gracious), al-Rahim (The Most Merciful), al-Malik (The Sovereign), al-Quddus (The Holy), al-Salam (The Source of Peace), and so on. Memorizing all 99 names is said to guarantee entry to Paradise.',
    contentArabic: 'أسماء الله الحسنى تسعة وتسعون اسمًا يصف كلّ منها صفة من صفات الله.',
    keyTerm: { arabic: 'اسم', english: 'name', transliteration: 'ism' },
    discoveryTrigger: 'level_reach:19',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_025',
    title: 'Friday Prayer — Salat al-Jumu\'a',
    titleArabic: 'صلاة الجمعة',
    category: 'religion',
    content: 'Friday (Yawm al-Jumu\'a) is the weekly day of congregational worship in Islam. The Dhuhr (midday) prayer is replaced by a special two-rak\'ah prayer preceded by a sermon (khutba). Muslims are encouraged to bathe, wear their best clothes, and arrive early at the mosque. The Quran calls believers to "hasten to the remembrance of God" on this day.',
    contentArabic: 'صلاة الجمعة صلاة جماعية أسبوعية يُسبقها خطبة ويُستحبّ فيها التبكير والتطيّب.',
    keyTerm: { arabic: 'جمعة', english: 'Friday / congregation', transliteration: 'jumuʿa' },
    discoveryTrigger: 'collection',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_026',
    title: 'The Mihrab — Prayer Niche',
    titleArabic: 'المحراب',
    category: 'religion',
    content: 'The mihrab is a semicircular niche in the wall of a mosque that indicates the qibla (direction of Mecca). Though functionally simple, mihrabs are often the most decorated element of a mosque, adorned with intricate tilework, calligraphy, and carved muqarnas (honeycomb vaulting). The acoustic properties of the niche amplify the imam\'s voice.',
    contentArabic: 'المحراب تجويف في جدار المسجد يشير إلى اتجاه القبلة وغالبًا ما يكون مزخرفًا ببديع الفنون.',
    keyTerm: { arabic: 'محراب', english: 'prayer niche', transliteration: 'miḥrāb' },
    discoveryTrigger: 'zone_visit:oasis-village',
    zone: 'oasis-village',
    rarity: 'common'
  },
  {
    id: 'religion_027',
    title: 'Sadaqah — Voluntary Charity',
    titleArabic: 'الصدقة — التبرّع الطوعي',
    category: 'religion',
    content: 'While zakat is obligatory, sadaqah is voluntary charity that can take any form: money, food, a kind word, or even a smile. The Prophet Muhammad said, "Even meeting your brother with a cheerful face is an act of charity." Sadaqah jariyah (ongoing charity), such as building a well or funding education, continues to earn rewards even after the giver\'s death.',
    contentArabic: 'الصدقة تبرّع طوعي يشمل المال أو الطعام أو الكلمة الطيبة أو حتى الابتسامة.',
    keyTerm: { arabic: 'صدقة', english: 'charity', transliteration: 'ṣadaqa' },
    discoveryTrigger: 'npc_talk:merchant-fatima',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_028',
    title: 'Laylat al-Qadr — The Night of Power',
    titleArabic: 'ليلة القدر',
    category: 'religion',
    content: 'Laylat al-Qadr (The Night of Power) falls during the last ten nights of Ramadan, most likely the 27th night. The Quran describes it as "better than a thousand months" (97:3), as it commemorates the night the Quran was first revealed. Muslims spend the night in prayer, Quran recitation, and supplication, seeking God\'s forgiveness and blessings.',
    contentArabic: 'ليلة القدر في العشر الأواخر من رمضان وصفها القرآن بأنها "خير من ألف شهر".',
    keyTerm: { arabic: 'قدر', english: 'power / destiny', transliteration: 'qadr' },
    discoveryTrigger: 'quest_complete:side_quest_guardians_1',
    zone: null,
    rarity: 'common'
  },
  {
    id: 'religion_029',
    title: 'The Waqf — Islamic Charitable Endowment',
    titleArabic: 'الوقف الإسلامي',
    category: 'religion',
    content: 'Waqf is an Islamic endowment where property or assets are donated permanently for charitable purposes. Revenue from waqf properties funded mosques, hospitals, schools, orphanages, and water fountains for centuries. At its peak, waqf holdings constituted a significant portion of the economy in many Muslim-majority countries, functioning as a pre-modern welfare system.',
    contentArabic: 'الوقف تبرّع دائم بممتلكات لأغراض خيرية موّل المساجد والمستشفيات والمدارس لقرون.',
    keyTerm: { arabic: 'وقف', english: 'endowment', transliteration: 'waqf' },
    discoveryTrigger: 'npc_talk:vizier-abbas',
    zone: 'royal-palace',
    rarity: 'common'
  },
  {
    id: 'religion_030',
    title: 'Tawakkul — Trust in God',
    titleArabic: 'التوكّل على الله',
    category: 'religion',
    content: 'Tawakkul is the Islamic concept of placing complete trust in God while still taking practical action. The Prophet Muhammad illustrated this by saying: "Tie your camel, then put your trust in God." It represents the balance between human effort and divine will — planning and working while accepting that ultimate outcomes belong to God.',
    contentArabic: 'التوكّل هو الثقة الكاملة بالله مع الأخذ بالأسباب كما قال النبي: "اعقلها وتوكّل".',
    keyTerm: { arabic: 'توكّل', english: 'trust in God / reliance', transliteration: 'tawakkul' },
    discoveryTrigger: 'level_reach:10',
    zone: null,
    rarity: 'common'
  }
];
