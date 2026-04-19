/**
 * goldenAgeScholars.js — Islamic Golden Age scholars dataset
 *
 * 30+ scholars with bios, contributions, era, and field-specific Arabic vocabulary.
 * Linked to codex entries for future display.
 */

export const GOLDEN_AGE_SCHOLARS = [
  // ── Mathematics & Algebra ──
  {
    id: 'al_khwarizmi',
    name: 'Al-Khwarizmi',
    nameArabic: 'الخوارزمي',
    fullName: 'Muhammad ibn Musa al-Khwarizmi',
    fullNameArabic: 'محمد بن موسى الخوارزمي',
    era: '780–850 CE',
    field: 'mathematics',
    fieldArabic: 'رياضيات',
    bio: 'The father of algebra, whose name gave us the word "algorithm." His book "Kitab al-Jabr" introduced systematic methods for solving equations and became the foundation of modern mathematics.',
    contributions: ['Algebra (al-jabr)', 'Hindu-Arabic numeral system', 'Algorithm methodology', 'Astronomical tables'],
    relatedVocab: [
      { arabic: 'جبر', transliteration: 'jabr', english: 'algebra' },
      { arabic: 'خوارزمية', transliteration: 'khawaarizmiyya', english: 'algorithm' },
      { arabic: 'رقم', transliteration: 'raqam', english: 'number' },
      { arabic: 'معادلة', transliteration: 'mu\'aadala', english: 'equation' },
    ],
    codexEntryId: 'scholar_al_khwarizmi',
  },
  {
    id: 'omar_khayyam',
    name: 'Omar Khayyam',
    nameArabic: 'عمر الخيام',
    fullName: 'Ghiyath al-Din Abu al-Fath Umar ibn Ibrahim al-Khayyam',
    fullNameArabic: 'غياث الدين أبو الفتح عمر بن إبراهيم الخيام',
    era: '1048–1131 CE',
    field: 'mathematics',
    fieldArabic: 'رياضيات',
    bio: 'A polymath renowned for his classification of cubic equations and his poetic masterpiece, the Rubaiyat. He also reformed the Persian calendar with extraordinary precision.',
    contributions: ['Cubic equation solutions', 'Calendar reform', 'Rubaiyat poetry', 'Geometric algebra'],
    relatedVocab: [
      { arabic: 'هندسة', transliteration: 'handasa', english: 'geometry' },
      { arabic: 'رباعيات', transliteration: 'rubaa\'iyyaat', english: 'quatrains' },
      { arabic: 'تقويم', transliteration: 'taqwiim', english: 'calendar' },
    ],
    codexEntryId: 'scholar_omar_khayyam',
  },

  // ── Medicine ──
  {
    id: 'ibn_sina',
    name: 'Ibn Sina (Avicenna)',
    nameArabic: 'ابن سينا',
    fullName: 'Abu Ali al-Husayn ibn Abdallah ibn Sina',
    fullNameArabic: 'أبو علي الحسين بن عبد الله بن سينا',
    era: '980–1037 CE',
    field: 'medicine',
    fieldArabic: 'طب',
    bio: 'The most influential physician and philosopher of the Islamic Golden Age. His "Canon of Medicine" was the standard medical textbook in Europe and the Islamic world for over 500 years.',
    contributions: ['Canon of Medicine', 'Mind-body connection theory', 'Clinical pharmacology', 'Classification of diseases'],
    relatedVocab: [
      { arabic: 'طب', transliteration: 'tibb', english: 'medicine' },
      { arabic: 'علاج', transliteration: '\'ilaaj', english: 'treatment' },
      { arabic: 'تشخيص', transliteration: 'tashkhiis', english: 'diagnosis' },
      { arabic: 'دواء', transliteration: 'dawaa\'', english: 'medicine/drug' },
    ],
    codexEntryId: 'scholar_ibn_sina',
  },
  {
    id: 'al_razi',
    name: 'Al-Razi (Rhazes)',
    nameArabic: 'الرازي',
    fullName: 'Abu Bakr Muhammad ibn Zakariya al-Razi',
    fullNameArabic: 'أبو بكر محمد بن زكريا الرازي',
    era: '854–925 CE',
    field: 'medicine',
    fieldArabic: 'طب',
    bio: 'A pioneering physician who distinguished between smallpox and measles for the first time. He established the concept of clinical medicine and wrote over 200 medical texts.',
    contributions: ['Smallpox vs measles distinction', 'Clinical observation method', 'Alcohol in medicine', 'Pediatric medicine'],
    relatedVocab: [
      { arabic: 'مرض', transliteration: 'marad', english: 'disease' },
      { arabic: 'كحول', transliteration: 'kuhuul', english: 'alcohol' },
      { arabic: 'مستشفى', transliteration: 'mustashfa', english: 'hospital' },
    ],
    codexEntryId: 'scholar_al_razi',
  },
  {
    id: 'ibn_al_nafis',
    name: 'Ibn al-Nafis',
    nameArabic: 'ابن النفيس',
    fullName: 'Ala al-Din Abu al-Hasan Ali ibn Abi al-Hazm al-Qurashi',
    fullNameArabic: 'علاء الدين أبو الحسن علي بن أبي الحزم القرشي',
    era: '1213–1288 CE',
    field: 'medicine',
    fieldArabic: 'طب',
    bio: 'Discovered pulmonary circulation 300 years before William Harvey. His commentary on Ibn Sina\'s Canon corrected fundamental errors about blood flow and the heart.',
    contributions: ['Pulmonary circulation discovery', 'Critique of Galen\'s anatomy', 'Ophthalmology advances'],
    relatedVocab: [
      { arabic: 'قلب', transliteration: 'qalb', english: 'heart' },
      { arabic: 'دم', transliteration: 'dam', english: 'blood' },
      { arabic: 'رئة', transliteration: 'ri\'a', english: 'lung' },
    ],
    codexEntryId: 'scholar_ibn_al_nafis',
  },

  // ── Chemistry ──
  {
    id: 'jabir_ibn_hayyan',
    name: 'Jabir ibn Hayyan',
    nameArabic: 'جابر بن حيان',
    fullName: 'Abu Musa Jabir ibn Hayyan',
    fullNameArabic: 'أبو موسى جابر بن حيان',
    era: '721–815 CE',
    field: 'chemistry',
    fieldArabic: 'كيمياء',
    bio: 'The father of chemistry (al-kimiya). He introduced the experimental method to chemistry, discovered hydrochloric and nitric acids, and invented distillation and crystallization processes.',
    contributions: ['Experimental chemistry method', 'Acid discoveries', 'Distillation process', 'Over 100 chemical instruments'],
    relatedVocab: [
      { arabic: 'كيمياء', transliteration: 'kiimiyaa\'', english: 'chemistry' },
      { arabic: 'تقطير', transliteration: 'taqtiir', english: 'distillation' },
      { arabic: 'حمض', transliteration: 'hamd', english: 'acid' },
      { arabic: 'تجربة', transliteration: 'tajriba', english: 'experiment' },
    ],
    codexEntryId: 'scholar_jabir',
  },

  // ── Physics & Optics ──
  {
    id: 'ibn_al_haytham',
    name: 'Ibn al-Haytham (Alhazen)',
    nameArabic: 'ابن الهيثم',
    fullName: 'Abu Ali al-Hasan ibn al-Hasan ibn al-Haytham',
    fullNameArabic: 'أبو علي الحسن بن الحسن بن الهيثم',
    era: '965–1040 CE',
    field: 'optics',
    fieldArabic: 'بصريات',
    bio: 'The father of modern optics who proved that light enters the eye rather than emanating from it. His "Book of Optics" influenced scientific method and inspired Kepler, Descartes, and Newton.',
    contributions: ['Camera obscura principle', 'Correct vision theory', 'Scientific method pioneer', 'Refraction studies'],
    relatedVocab: [
      { arabic: 'بصريات', transliteration: 'basariyyaat', english: 'optics' },
      { arabic: 'ضوء', transliteration: 'daw\'', english: 'light' },
      { arabic: 'عين', transliteration: '\'ayn', english: 'eye' },
      { arabic: 'عدسة', transliteration: '\'adasa', english: 'lens' },
    ],
    codexEntryId: 'scholar_ibn_al_haytham',
  },

  // ── Astronomy ──
  {
    id: 'al_biruni',
    name: 'Al-Biruni',
    nameArabic: 'البيروني',
    fullName: 'Abu Rayhan Muhammad ibn Ahmad al-Biruni',
    fullNameArabic: 'أبو ريحان محمد بن أحمد البيروني',
    era: '973–1048 CE',
    field: 'astronomy',
    fieldArabic: 'فلك',
    bio: 'A universal genius who calculated the Earth\'s circumference with remarkable accuracy using trigonometry. He also proposed that Earth rotates on its axis and documented Indian science and culture.',
    contributions: ['Earth circumference calculation', 'Comparative religion study', 'Geodesy methods', 'Indian cultural documentation'],
    relatedVocab: [
      { arabic: 'فلك', transliteration: 'falak', english: 'astronomy' },
      { arabic: 'أرض', transliteration: 'ard', english: 'earth' },
      { arabic: 'نجم', transliteration: 'najm', english: 'star' },
      { arabic: 'كوكب', transliteration: 'kawkab', english: 'planet' },
    ],
    codexEntryId: 'scholar_al_biruni',
  },
  {
    id: 'al_battani',
    name: 'Al-Battani',
    nameArabic: 'البتاني',
    fullName: 'Abu Abdullah Muhammad ibn Jabir al-Battani',
    fullNameArabic: 'أبو عبد الله محمد بن جابر البتاني',
    era: '858–929 CE',
    field: 'astronomy',
    fieldArabic: 'فلك',
    bio: 'The greatest astronomer of the medieval period. He refined Ptolemy\'s astronomical data and introduced trigonometric methods that replaced Greek chord tables.',
    contributions: ['Solar year length refinement', 'Trigonometric methods in astronomy', 'Star catalogue', 'Precession of equinoxes'],
    relatedVocab: [
      { arabic: 'شمس', transliteration: 'shams', english: 'sun' },
      { arabic: 'قمر', transliteration: 'qamar', english: 'moon' },
      { arabic: 'مثلثات', transliteration: 'muthallathaat', english: 'trigonometry' },
    ],
    codexEntryId: 'scholar_al_battani',
  },
  {
    id: 'al_sufi',
    name: 'Al-Sufi',
    nameArabic: 'الصوفي',
    fullName: 'Abd al-Rahman al-Sufi',
    fullNameArabic: 'عبد الرحمن الصوفي',
    era: '903–986 CE',
    field: 'astronomy',
    fieldArabic: 'فلك',
    bio: 'Authored "Book of Fixed Stars," the definitive star catalogue of the medieval world. He was the first to observe the Andromeda Galaxy and the Large Magellanic Cloud.',
    contributions: ['Book of Fixed Stars', 'Andromeda Galaxy observation', 'Star magnitude system', 'Asterism documentation'],
    relatedVocab: [
      { arabic: 'مجرة', transliteration: 'majarra', english: 'galaxy' },
      { arabic: 'كوكبة', transliteration: 'kawkaba', english: 'constellation' },
      { arabic: 'رصد', transliteration: 'rasad', english: 'observation' },
    ],
    codexEntryId: 'scholar_al_sufi',
  },

  // ── Geography ──
  {
    id: 'al_idrisi',
    name: 'Al-Idrisi',
    nameArabic: 'الإدريسي',
    fullName: 'Muhammad al-Idrisi',
    fullNameArabic: 'محمد الإدريسي',
    era: '1100–1165 CE',
    field: 'geography',
    fieldArabic: 'جغرافيا',
    bio: 'Created the most accurate world map of the medieval period, the Tabula Rogeriana. His geographic encyclopedia described trade routes, cultures, and climates across the known world.',
    contributions: ['Tabula Rogeriana world map', 'Geographic encyclopedia', 'Climate zone classification', 'Trade route documentation'],
    relatedVocab: [
      { arabic: 'جغرافيا', transliteration: 'jughraaFiyaa', english: 'geography' },
      { arabic: 'خريطة', transliteration: 'khariita', english: 'map' },
      { arabic: 'مناخ', transliteration: 'munaakh', english: 'climate' },
    ],
    codexEntryId: 'scholar_al_idrisi',
  },
  {
    id: 'ibn_battuta',
    name: 'Ibn Battuta',
    nameArabic: 'ابن بطوطة',
    fullName: 'Muhammad ibn Abdallah ibn Battuta',
    fullNameArabic: 'محمد بن عبد الله بن بطوطة',
    era: '1304–1369 CE',
    field: 'geography',
    fieldArabic: 'جغرافيا',
    bio: 'The greatest traveler of the pre-modern world. He journeyed over 120,000 km across 44 modern countries, documenting cultures, languages, and societies in his famous Rihla.',
    contributions: ['Rihla travel account', '120,000 km of travel', 'Cultural anthropology', 'Trade documentation'],
    relatedVocab: [
      { arabic: 'سفر', transliteration: 'safar', english: 'travel' },
      { arabic: 'رحلة', transliteration: 'rihla', english: 'journey' },
      { arabic: 'تجارة', transliteration: 'tijaara', english: 'trade' },
    ],
    codexEntryId: 'scholar_ibn_battuta',
  },

  // ── Philosophy ──
  {
    id: 'ibn_rushd',
    name: 'Ibn Rushd (Averroes)',
    nameArabic: 'ابن رشد',
    fullName: 'Abu al-Walid Muhammad ibn Ahmad ibn Rushd',
    fullNameArabic: 'أبو الوليد محمد بن أحمد بن رشد',
    era: '1126–1198 CE',
    field: 'philosophy',
    fieldArabic: 'فلسفة',
    bio: 'The greatest commentator on Aristotle. His rational philosophy bridged Islamic and Western thought, profoundly influencing Thomas Aquinas and European scholasticism.',
    contributions: ['Aristotelian commentaries', 'Harmony of religion and philosophy', 'Legal methodology', 'Medical encyclopedia'],
    relatedVocab: [
      { arabic: 'فلسفة', transliteration: 'falsafa', english: 'philosophy' },
      { arabic: 'عقل', transliteration: '\'aql', english: 'reason/intellect' },
      { arabic: 'منطق', transliteration: 'mantiq', english: 'logic' },
    ],
    codexEntryId: 'scholar_ibn_rushd',
  },
  {
    id: 'al_kindi',
    name: 'Al-Kindi',
    nameArabic: 'الكندي',
    fullName: 'Abu Yusuf Yaqub ibn Ishaq al-Kindi',
    fullNameArabic: 'أبو يوسف يعقوب بن إسحاق الكندي',
    era: '801–873 CE',
    field: 'philosophy',
    fieldArabic: 'فلسفة',
    bio: 'The "Philosopher of the Arabs" and the first major Islamic philosopher. He introduced Greek philosophy to the Arabic-speaking world and pioneered frequency analysis in cryptography.',
    contributions: ['Greek philosophy translation', 'Frequency analysis (cryptography)', 'Music theory', 'Metaphysics treatises'],
    relatedVocab: [
      { arabic: 'حكمة', transliteration: 'hikma', english: 'wisdom' },
      { arabic: 'ترجمة', transliteration: 'tarjama', english: 'translation' },
      { arabic: 'تشفير', transliteration: 'tashfiir', english: 'encryption' },
    ],
    codexEntryId: 'scholar_al_kindi',
  },
  {
    id: 'al_farabi',
    name: 'Al-Farabi',
    nameArabic: 'الفارابي',
    fullName: 'Abu Nasr Muhammad al-Farabi',
    fullNameArabic: 'أبو نصر محمد الفارابي',
    era: '872–950 CE',
    field: 'philosophy',
    fieldArabic: 'فلسفة',
    bio: 'Known as the "Second Teacher" (after Aristotle). He wrote extensively on political philosophy, logic, and music theory, and envisioned the ideal state in his "Virtuous City."',
    contributions: ['Virtuous City political theory', 'Logic and syllogism', 'Music theory treatise', 'Aristotelian commentary'],
    relatedVocab: [
      { arabic: 'مدينة', transliteration: 'madiina', english: 'city' },
      { arabic: 'فضيلة', transliteration: 'fadiila', english: 'virtue' },
      { arabic: 'موسيقى', transliteration: 'muusiiqa', english: 'music' },
    ],
    codexEntryId: 'scholar_al_farabi',
  },
  {
    id: 'ibn_khaldun',
    name: 'Ibn Khaldun',
    nameArabic: 'ابن خلدون',
    fullName: 'Abd al-Rahman ibn Muhammad ibn Khaldun',
    fullNameArabic: 'عبد الرحمن بن محمد بن خلدون',
    era: '1332–1406 CE',
    field: 'sociology',
    fieldArabic: 'علم الاجتماع',
    bio: 'The father of sociology and historiography. His "Muqaddimah" pioneered the study of social cohesion (asabiyyah), economic cycles, and the rise and fall of civilizations.',
    contributions: ['Muqaddimah', 'Asabiyyah theory', 'Cyclical history model', 'Economic theory'],
    relatedVocab: [
      { arabic: 'عصبية', transliteration: '\'asabiyya', english: 'social solidarity' },
      { arabic: 'تاريخ', transliteration: 'taariikh', english: 'history' },
      { arabic: 'حضارة', transliteration: 'hadaara', english: 'civilization' },
      { arabic: 'مجتمع', transliteration: 'mujtama\'', english: 'society' },
    ],
    codexEntryId: 'scholar_ibn_khaldun',
  },

  // ── Engineering ──
  {
    id: 'al_jazari',
    name: 'Al-Jazari',
    nameArabic: 'الجزري',
    fullName: 'Badi al-Zaman Abu al-Izz ibn Ismail al-Jazari',
    fullNameArabic: 'بديع الزمان أبو العز بن إسماعيل الجزري',
    era: '1136–1206 CE',
    field: 'engineering',
    fieldArabic: 'هندسة',
    bio: 'The father of robotics and automation. He invented elaborate programmable automata, water clocks, and mechanical devices described in his "Book of Ingenious Devices."',
    contributions: ['Programmable automata', 'Water-powered clocks', 'Crankshaft mechanism', 'Combination lock'],
    relatedVocab: [
      { arabic: 'هندسة', transliteration: 'handasa', english: 'engineering' },
      { arabic: 'ساعة', transliteration: 'saa\'a', english: 'clock' },
      { arabic: 'آلة', transliteration: 'aala', english: 'machine' },
      { arabic: 'اختراع', transliteration: 'ikhtiraa\'', english: 'invention' },
    ],
    codexEntryId: 'scholar_al_jazari',
  },
  {
    id: 'banu_musa',
    name: 'Banu Musa Brothers',
    nameArabic: 'بنو موسى',
    fullName: 'Muhammad, Ahmad, and Hasan ibn Musa ibn Shakir',
    fullNameArabic: 'محمد وأحمد وحسن بنو موسى بن شاكر',
    era: '9th century CE',
    field: 'engineering',
    fieldArabic: 'هندسة',
    bio: 'Three brothers who were among the greatest engineers of the Islamic Golden Age. Their "Book of Ingenious Devices" described over 100 mechanical devices and automata.',
    contributions: ['100+ mechanical devices', 'Automatic flute player', 'Self-trimming oil lamp', 'Measurement instruments'],
    relatedVocab: [
      { arabic: 'جهاز', transliteration: 'jihaaz', english: 'device' },
      { arabic: 'ميكانيكا', transliteration: 'miikaanikaa', english: 'mechanics' },
    ],
    codexEntryId: 'scholar_banu_musa',
  },

  // ── Literature ──
  {
    id: 'al_jahiz',
    name: 'Al-Jahiz',
    nameArabic: 'الجاحظ',
    fullName: 'Abu Uthman Amr ibn Bahr al-Jahiz',
    fullNameArabic: 'أبو عثمان عمرو بن بحر الجاحظ',
    era: '776–868 CE',
    field: 'literature',
    fieldArabic: 'أدب',
    bio: 'A prolific author of satirical and scientific prose. His "Book of Animals" is considered an early work of zoology, and his literary style influenced Arabic prose for centuries.',
    contributions: ['Book of Animals (proto-evolution)', 'Book of Misers (satire)', 'Rhetoric and eloquence theory', 'Over 200 works'],
    relatedVocab: [
      { arabic: 'أدب', transliteration: 'adab', english: 'literature' },
      { arabic: 'حيوان', transliteration: 'hayawaan', english: 'animal' },
      { arabic: 'بلاغة', transliteration: 'balaagha', english: 'rhetoric' },
    ],
    codexEntryId: 'scholar_al_jahiz',
  },

  // ── Mathematics (additional) ──
  {
    id: 'al_tusi',
    name: 'Nasir al-Din al-Tusi',
    nameArabic: 'نصير الدين الطوسي',
    fullName: 'Muhammad ibn Muhammad ibn al-Hasan al-Tusi',
    fullNameArabic: 'محمد بن محمد بن الحسن الطوسي',
    era: '1201–1274 CE',
    field: 'mathematics',
    fieldArabic: 'رياضيات',
    bio: 'Created trigonometry as an independent discipline, separating it from astronomy. He also founded the Maragha observatory and influenced Copernicus\'s heliocentric model.',
    contributions: ['Trigonometry as independent field', 'Maragha observatory', 'Tusi couple (planetary model)', 'Ethical philosophy'],
    relatedVocab: [
      { arabic: 'مثلث', transliteration: 'muthallath', english: 'triangle' },
      { arabic: 'مرصد', transliteration: 'marsad', english: 'observatory' },
      { arabic: 'زاوية', transliteration: 'zaawiya', english: 'angle' },
    ],
    codexEntryId: 'scholar_al_tusi',
  },

  // ── Botany & Agriculture ──
  {
    id: 'ibn_al_awwam',
    name: 'Ibn al-Awwam',
    nameArabic: 'ابن العوام',
    fullName: 'Abu Zakariya Yahya ibn Muhammad ibn al-Awwam',
    fullNameArabic: 'أبو زكريا يحيى بن محمد بن العوام',
    era: '12th century CE',
    field: 'agriculture',
    fieldArabic: 'زراعة',
    bio: 'Authored the most comprehensive medieval agricultural treatise, describing the cultivation of 585 plants and 50 fruit trees, plus animal husbandry techniques.',
    contributions: ['Kitab al-Filaha', '585 plant cultivation', 'Irrigation techniques', 'Soil classification'],
    relatedVocab: [
      { arabic: 'زراعة', transliteration: 'ziraa\'a', english: 'agriculture' },
      { arabic: 'نبات', transliteration: 'nabaat', english: 'plant' },
      { arabic: 'ري', transliteration: 'rayy', english: 'irrigation' },
    ],
    codexEntryId: 'scholar_ibn_al_awwam',
  },

  // ── Surgery ──
  {
    id: 'al_zahrawi',
    name: 'Al-Zahrawi (Albucasis)',
    nameArabic: 'الزهراوي',
    fullName: 'Abu al-Qasim Khalaf ibn al-Abbas al-Zahrawi',
    fullNameArabic: 'أبو القاسم خلف بن العباس الزهراوي',
    era: '936–1013 CE',
    field: 'surgery',
    fieldArabic: 'جراحة',
    bio: 'The father of modern surgery. His 30-volume "Kitab al-Tasrif" included descriptions of over 200 surgical instruments, many of which he designed himself.',
    contributions: ['200+ surgical instruments', 'Kitab al-Tasrif encyclopedia', 'Cauterization techniques', 'Surgical sutures using catgut'],
    relatedVocab: [
      { arabic: 'جراحة', transliteration: 'jiraaha', english: 'surgery' },
      { arabic: 'أداة', transliteration: 'adaah', english: 'instrument' },
      { arabic: 'خياطة', transliteration: 'khiyaata', english: 'suture/sewing' },
    ],
    codexEntryId: 'scholar_al_zahrawi',
  },

  // ── Pharmacology ──
  {
    id: 'ibn_al_baytar',
    name: 'Ibn al-Baytar',
    nameArabic: 'ابن البيطار',
    fullName: 'Diya al-Din Abu Muhammad Abdallah ibn al-Baytar',
    fullNameArabic: 'ضياء الدين أبو محمد عبد الله ابن البيطار',
    era: '1197–1248 CE',
    field: 'pharmacology',
    fieldArabic: 'صيدلة',
    bio: 'The greatest botanist and pharmacist of the medieval Islamic world. His encyclopedia catalogued over 1,400 medicinal plants and drugs from across the known world.',
    contributions: ['1,400 plant/drug catalogue', 'Pharmaceutical encyclopedia', 'Botanical field research', 'Drug interaction studies'],
    relatedVocab: [
      { arabic: 'صيدلة', transliteration: 'saydaliyya', english: 'pharmacy' },
      { arabic: 'عشب', transliteration: '\'ushb', english: 'herb' },
      { arabic: 'عقار', transliteration: '\'aqqaar', english: 'drug' },
    ],
    codexEntryId: 'scholar_ibn_al_baytar',
  },

  // ── Optics (additional) ──
  {
    id: 'kamal_al_din_al_farisi',
    name: 'Kamal al-Din al-Farisi',
    nameArabic: 'كمال الدين الفارسي',
    fullName: 'Kamal al-Din Hasan ibn Ali ibn Hasan al-Farisi',
    fullNameArabic: 'كمال الدين حسن بن علي بن حسن الفارسي',
    era: '1267–1319 CE',
    field: 'optics',
    fieldArabic: 'بصريات',
    bio: 'Building on Ibn al-Haytham\'s work, he provided the first mathematically correct explanation of the rainbow, demonstrating refraction and reflection inside water droplets.',
    contributions: ['Rainbow explanation', 'Light refraction theory', 'Color theory', 'Commentary on Book of Optics'],
    relatedVocab: [
      { arabic: 'قوس قزح', transliteration: 'qaws quzah', english: 'rainbow' },
      { arabic: 'انكسار', transliteration: 'inkisaar', english: 'refraction' },
      { arabic: 'لون', transliteration: 'lawn', english: 'color' },
    ],
    codexEntryId: 'scholar_al_farisi',
  },

  // ── Law & Theology ──
  {
    id: 'al_ghazali',
    name: 'Al-Ghazali',
    nameArabic: 'الغزالي',
    fullName: 'Abu Hamid Muhammad ibn Muhammad al-Ghazali',
    fullNameArabic: 'أبو حامد محمد بن محمد الغزالي',
    era: '1058–1111 CE',
    field: 'theology',
    fieldArabic: 'علم الكلام',
    bio: 'One of the most influential Islamic scholars ever. His "Revival of the Religious Sciences" is considered the most important work in Islamic spirituality, and his critique of philosophy shaped Islamic intellectual tradition.',
    contributions: ['Revival of Religious Sciences', 'Incoherence of the Philosophers', 'Sufi spirituality', 'Educational reform'],
    relatedVocab: [
      { arabic: 'إيمان', transliteration: 'iimaan', english: 'faith' },
      { arabic: 'تصوف', transliteration: 'tasawwuf', english: 'Sufism' },
      { arabic: 'إحياء', transliteration: 'ihyaa\'', english: 'revival' },
    ],
    codexEntryId: 'scholar_al_ghazali',
  },

  // ── Music ──
  {
    id: 'ziryab',
    name: 'Ziryab',
    nameArabic: 'زرياب',
    fullName: 'Abu al-Hasan Ali ibn Nafi',
    fullNameArabic: 'أبو الحسن علي بن نافع',
    era: '789–857 CE',
    field: 'music',
    fieldArabic: 'موسيقى',
    bio: 'A revolutionary musician who added a fifth string to the oud, established a music conservatory in Córdoba, and introduced fashion, cuisine, and hygiene standards to medieval Europe.',
    contributions: ['Fifth oud string', 'Music conservatory', 'Fashion innovations', 'Seasonal cuisine concept'],
    relatedVocab: [
      { arabic: 'عود', transliteration: '\'uud', english: 'oud (lute)' },
      { arabic: 'لحن', transliteration: 'lahn', english: 'melody' },
      { arabic: 'نغمة', transliteration: 'naghma', english: 'tune/note' },
    ],
    codexEntryId: 'scholar_ziryab',
  },

  // ── Translation ──
  {
    id: 'hunayn_ibn_ishaq',
    name: 'Hunayn ibn Ishaq',
    nameArabic: 'حنين بن إسحاق',
    fullName: 'Abu Zayd Hunayn ibn Ishaq al-Ibadi',
    fullNameArabic: 'أبو زيد حنين بن إسحاق العبادي',
    era: '808–873 CE',
    field: 'translation',
    fieldArabic: 'ترجمة',
    bio: 'The greatest translator of the Abbasid era. He led the translation movement at the House of Wisdom, rendering Greek medical and scientific texts into Arabic with extraordinary accuracy.',
    contributions: ['Greek-to-Arabic translations', 'House of Wisdom leadership', 'Translation methodology', 'Medical text preservation'],
    relatedVocab: [
      { arabic: 'ترجمة', transliteration: 'tarjama', english: 'translation' },
      { arabic: 'بيت الحكمة', transliteration: 'bayt al-hikma', english: 'House of Wisdom' },
      { arabic: 'مخطوط', transliteration: 'makhtuut', english: 'manuscript' },
    ],
    codexEntryId: 'scholar_hunayn',
  },

  // ── Mechanics & Hydrology ──
  {
    id: 'al_karaji',
    name: 'Al-Karaji',
    nameArabic: 'الكرجي',
    fullName: 'Abu Bakr Muhammad ibn al-Hasan al-Karaji',
    fullNameArabic: 'أبو بكر محمد بن الحسن الكرجي',
    era: '953–1029 CE',
    field: 'mathematics',
    fieldArabic: 'رياضيات',
    bio: 'Freed algebra from geometry, treating it as a purely arithmetic discipline. He also wrote extensively on hydraulic engineering, including methods for finding underground water sources.',
    contributions: ['Algebraic independence from geometry', 'Pascal\'s triangle (predating Pascal)', 'Hydraulic engineering', 'Underground water detection'],
    relatedVocab: [
      { arabic: 'حساب', transliteration: 'hisaab', english: 'arithmetic' },
      { arabic: 'ماء', transliteration: 'maa\'', english: 'water' },
      { arabic: 'بئر', transliteration: 'bi\'r', english: 'well' },
    ],
    codexEntryId: 'scholar_al_karaji',
  },

  // ── Jurisprudence ──
  {
    id: 'al_shafii',
    name: 'Imam al-Shafi\'i',
    nameArabic: 'الإمام الشافعي',
    fullName: 'Muhammad ibn Idris al-Shafi\'i',
    fullNameArabic: 'محمد بن إدريس الشافعي',
    era: '767–820 CE',
    field: 'jurisprudence',
    fieldArabic: 'فقه',
    bio: 'Founder of the Shafi\'i school of law and the father of Islamic jurisprudence methodology (usul al-fiqh). His systematic approach to deriving law from Quran, Hadith, consensus, and analogy shaped all subsequent legal scholarship.',
    contributions: ['Usul al-Fiqh methodology', 'Risala (legal theory treatise)', 'Shafi\'i school of law', 'Hadith authentication methods'],
    relatedVocab: [
      { arabic: 'فقه', transliteration: 'fiqh', english: 'jurisprudence' },
      { arabic: 'شريعة', transliteration: 'sharii\'a', english: 'Islamic law' },
      { arabic: 'قياس', transliteration: 'qiyaas', english: 'analogy' },
    ],
    codexEntryId: 'scholar_al_shafii',
  },
];

/**
 * Get a scholar by ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getScholarById(id) {
  return GOLDEN_AGE_SCHOLARS.find((s) => s.id === id);
}

/**
 * Get scholars by field.
 * @param {string} field
 * @returns {Object[]}
 */
export function getScholarsByField(field) {
  return GOLDEN_AGE_SCHOLARS.filter((s) => s.field === field);
}

/**
 * Get all unique fields.
 * @returns {string[]}
 */
export function getScholarFields() {
  return [...new Set(GOLDEN_AGE_SCHOLARS.map((s) => s.field))];
}

/**
 * Get all vocabulary from scholars.
 * @returns {Array}
 */
export function getAllScholarVocab() {
  return GOLDEN_AGE_SCHOLARS.flatMap((s) =>
    (s.relatedVocab || []).map((v) => ({ ...v, scholarId: s.id, field: s.field }))
  );
}
