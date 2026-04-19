/**
 * culturalTrivia.js
 * GROW-015 — Arabic cultural trivia dataset
 * 200 trivia facts (20 per category × 10 categories)
 *
 * Fields: id, fact (English), factArabic, category, cefrLevel, region, era
 * Categories: history, food, science, art, music, architecture, literature, language, geography, customs
 * Eras: ancient, classical, medieval, modern, contemporary
 */

export const CULTURAL_TRIVIA = [
  // ── HISTORY (20) ──────────────────────────────────────────────────────────
  {
    id: 'trivia_his_001',
    fact: 'The Islamic Golden Age (8th–13th centuries) brought major advances in science, mathematics, and medicine.',
    factArabic: 'ازدهر العصر الذهبي الإسلامي بين القرنين الثامن والثالث عشر وحقّق إنجازات عظيمة في العلوم والرياضيات والطب.',
    category: 'history', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_his_002',
    fact: 'Baghdad was founded in 762 CE by Caliph al-Mansur as the capital of the Abbasid Caliphate.',
    factArabic: 'أسّس الخليفة المنصور مدينة بغداد عام 762 ميلادي لتكون عاصمة الخلافة العباسية.',
    category: 'history', cefrLevel: 'B1', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_his_003',
    fact: 'The first Islamic state was established in Medina in 622 CE after the Hijra (migration) of the Prophet.',
    factArabic: 'أُسّست الدولة الإسلامية الأولى في المدينة المنورة عام 622 ميلادي بعد الهجرة النبوية.',
    category: 'history', cefrLevel: 'A2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_his_004',
    fact: 'The Umayyad Caliphate expanded Islamic civilization from Spain in the west to Central Asia in the east.',
    factArabic: 'امتدت الخلافة الأموية من إسبانيا غرباً إلى وسط آسيا شرقاً.',
    category: 'history', cefrLevel: 'A2', region: 'Levant', era: 'classical',
  },
  {
    id: 'trivia_his_005',
    fact: 'Saladin (Salah al-Din) recaptured Jerusalem in 1187 CE and is celebrated as a great Muslim leader.',
    factArabic: 'استعاد صلاح الدين الأيوبي مدينة القدس عام 1187 ميلادي وأصبح بطلاً خالداً في التاريخ الإسلامي.',
    category: 'history', cefrLevel: 'B1', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_his_006',
    fact: 'The Phoenicians of ancient Lebanon created one of the earliest alphabets around 1050 BCE.',
    factArabic: 'ابتكر الفينيقيون في لبنان القديم أحد أوائل الأبجديات حوالي عام 1050 قبل الميلاد.',
    category: 'history', cefrLevel: 'B1', region: 'Levant', era: 'ancient',
  },
  {
    id: 'trivia_his_007',
    fact: 'Queen Zenobia of Palmyra ruled an empire that included Egypt and much of the eastern Mediterranean in the 3rd century CE.',
    factArabic: 'حكمت الملكة زنوبيا تدمر إمبراطورية شملت مصر وكثيراً من شرق البحر الأبيض المتوسط في القرن الثالث الميلادي.',
    category: 'history', cefrLevel: 'B2', region: 'Levant', era: 'ancient',
  },
  {
    id: 'trivia_his_008',
    fact: 'Ancient Mesopotamia, in modern-day Iraq, was home to the world\'s first cities and writing systems.',
    factArabic: 'كانت بلاد الرافدين القديمة في العراق الحالي موطن أول المدن وأنظمة الكتابة في التاريخ.',
    category: 'history', cefrLevel: 'B1', region: 'Mesopotamia', era: 'ancient',
  },
  {
    id: 'trivia_his_009',
    fact: 'The Arab League was founded in 1945 with six member states and has grown to 22 members today.',
    factArabic: 'تأسّست جامعة الدول العربية عام 1945 بست دول أعضاء وأصبح عددها اليوم 22 دولة.',
    category: 'history', cefrLevel: 'A2', region: 'Egypt', era: 'contemporary',
  },
  {
    id: 'trivia_his_010',
    fact: 'The Suez Canal, opened in 1869, connects the Mediterranean Sea to the Red Sea through Egypt.',
    factArabic: 'افتُتحت قناة السويس عام 1869 وتربط البحر الأبيض المتوسط بالبحر الأحمر عبر مصر.',
    category: 'history', cefrLevel: 'A2', region: 'Egypt', era: 'modern',
  },
  {
    id: 'trivia_his_011',
    fact: 'The Kingdom of Saba (Sheba) was a powerful ancient civilization in Yemen, known for its wealth and trade.',
    factArabic: 'كانت مملكة سبأ حضارة قديمة قوية في اليمن اشتُهرت بثروتها وتجارتها.',
    category: 'history', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_his_012',
    fact: 'The Quran was revealed to the Prophet Muhammad (peace be upon him) over 23 years (610–632 CE).',
    factArabic: 'نزل القرآن الكريم على النبي محمد صلى الله عليه وسلم على مدى 23 عاماً من 610 إلى 632 ميلادي.',
    category: 'history', cefrLevel: 'A2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_his_013',
    fact: 'Tariq ibn Ziyad led the Muslim crossing into Iberia (Spain) in 711 CE, beginning centuries of Islamic presence.',
    factArabic: 'قاد طارق بن زياد الفتح الإسلامي للأندلس عام 711 ميلادي مطلقاً قروناً من الوجود الإسلامي في إسبانيا.',
    category: 'history', cefrLevel: 'B1', region: 'Andalusia', era: 'classical',
  },
  {
    id: 'trivia_his_014',
    fact: 'The Ottoman Empire governed most of the Arab world from the 16th century until World War I.',
    factArabic: 'حكمت الدولة العثمانية معظم العالم العربي من القرن السادس عشر حتى الحرب العالمية الأولى.',
    category: 'history', cefrLevel: 'B1', region: 'Levant', era: 'modern',
  },
  {
    id: 'trivia_his_015',
    fact: 'Morocco and Tunisia both gained independence from France in 1956, marking the end of colonial rule.',
    factArabic: 'نالت المغرب وتونس استقلالهما عن فرنسا عام 1956 إيذاناً بنهاية الحكم الاستعماري.',
    category: 'history', cefrLevel: 'A2', region: 'Maghreb', era: 'contemporary',
  },
  {
    id: 'trivia_his_016',
    fact: 'The Arab oil embargo of 1973 had a transformative impact on global energy markets.',
    factArabic: 'أثّر حظر النفط العربي عام 1973 تأثيراً جذرياً في أسواق الطاقة العالمية.',
    category: 'history', cefrLevel: 'B2', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_his_017',
    fact: 'Arab Muslim forces conquered Egypt in 641 CE under the commander Amr ibn al-As.',
    factArabic: 'فتح العرب المسلمون مصر عام 641 ميلادي بقيادة عمرو بن العاص.',
    category: 'history', cefrLevel: 'A2', region: 'Egypt', era: 'classical',
  },
  {
    id: 'trivia_his_018',
    fact: 'The Battle of Yarmouk in 636 CE was a decisive Arab victory that opened the Levant to Islamic rule.',
    factArabic: 'كانت معركة اليرموك عام 636 ميلادي انتصاراً عربياً حاسماً فتح الشام أمام الحكم الإسلامي.',
    category: 'history', cefrLevel: 'B2', region: 'Levant', era: 'classical',
  },
  {
    id: 'trivia_his_019',
    fact: 'The Abbasid Caliphate (750–1258 CE) is remembered as the golden era of Arab intellectual achievement.',
    factArabic: 'تُعدّ الخلافة العباسية من 750 إلى 1258 ميلادي الحقبة الذهبية للإنجازات الفكرية والحضارية العربية.',
    category: 'history', cefrLevel: 'B1', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_his_020',
    fact: 'Mecca and Medina in Saudi Arabia are the two holiest cities in Islam.',
    factArabic: 'مكة المكرمة والمدينة المنورة في المملكة العربية السعودية هما أقدس مدينتين في الإسلام.',
    category: 'history', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },

  // ── FOOD (20) ─────────────────────────────────────────────────────────────
  {
    id: 'trivia_fod_001',
    fact: 'Hummus is made from chickpeas, tahini, lemon, and garlic, and is eaten across the Arab world.',
    factArabic: 'يُصنع الحمص من الحمص المطبوخ والطحينة والليمون والثوم وهو شائع في أرجاء العالم العربي.',
    category: 'food', cefrLevel: 'A1', region: 'Levant', era: 'contemporary',
  },
  {
    id: 'trivia_fod_002',
    fact: 'Mansaf is Jordan\'s national dish, made with lamb cooked in a dried yogurt sauce called jameed.',
    factArabic: 'المنسف الطبق الوطني الأردني يُعدّ من لحم الضأن المطبوخ في الجميد (اللبن المجفف).',
    category: 'food', cefrLevel: 'A2', region: 'Levant', era: 'contemporary',
  },
  {
    id: 'trivia_fod_003',
    fact: 'Falafel is believed to have originated in Egypt, where it is made from fava beans and called ta\'amiya.',
    factArabic: 'يُعتقد أن الفلافل نشأت في مصر حيث تُعرف بـ"الطعمية" وتُصنع من الفول الأخضر.',
    category: 'food', cefrLevel: 'A2', region: 'Egypt', era: 'contemporary',
  },
  {
    id: 'trivia_fod_004',
    fact: 'Dates have been cultivated in the Arabian Peninsula for over 5,000 years and hold great cultural significance.',
    factArabic: 'زُرع التمر في شبه الجزيرة العربية منذ أكثر من 5000 عام وله مكانة ثقافية ودينية كبيرة.',
    category: 'food', cefrLevel: 'A1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_fod_005',
    fact: 'Shawarma, popular across the Arab world, has its roots in Ottoman cooking traditions.',
    factArabic: 'تنتشر الشاورما في أرجاء العالم العربي وترجع جذورها إلى تقاليد الطبخ العثمانية.',
    category: 'food', cefrLevel: 'A1', region: 'Levant', era: 'modern',
  },
  {
    id: 'trivia_fod_006',
    fact: 'Coffee (qahwa) was first cultivated in Yemen and became central to Arab hospitality culture.',
    factArabic: 'زُرع البن أول مرة في اليمن وأصبحت القهوة ركيزة أساسية في ثقافة الضيافة العربية.',
    category: 'food', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_fod_007',
    fact: 'Kabsa, a fragrant rice dish with meat and spices, is considered Saudi Arabia\'s national dish.',
    factArabic: 'الكبسة طبق أرز عطري مع اللحم والبهارات وتُعدّ الطبق الوطني للمملكة العربية السعودية.',
    category: 'food', cefrLevel: 'A2', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_fod_008',
    fact: 'Tagine is a slow-cooked North African stew named after the clay pot it is prepared in.',
    factArabic: 'الطاجين طبق شمال أفريقي يُطهى ببطء ويُسمى بهذا الاسم نسبةً إلى الوعاء الفخاري الذي يُحضَّر فيه.',
    category: 'food', cefrLevel: 'A2', region: 'Maghreb', era: 'contemporary',
  },
  {
    id: 'trivia_fod_009',
    fact: 'Baklava is a sweet pastry made with layers of filo pastry, chopped nuts, and honey or syrup.',
    factArabic: 'البقلاوة حلوى شهيرة تُصنع من طبقات رقيقة من العجين والمكسرات مع الشيرة أو العسل.',
    category: 'food', cefrLevel: 'A1', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_fod_010',
    fact: 'Ful medames, made from fava beans, is one of Egypt\'s oldest dishes and a traditional breakfast.',
    factArabic: 'الفول المدمس أحد أقدم الأطباق المصرية ويُصنع من الفول المطبوخ ويُؤكل تقليدياً على الإفطار.',
    category: 'food', cefrLevel: 'A1', region: 'Egypt', era: 'ancient',
  },
  {
    id: 'trivia_fod_011',
    fact: 'Za\'atar is a spice blend of dried thyme, sumac, and sesame seeds used throughout the Levant.',
    factArabic: 'الزعتر خليط من البهارات يشمل الزعتر المجفف والسماق وبذور السمسم وينتشر في بلاد الشام.',
    category: 'food', cefrLevel: 'A1', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_fod_012',
    fact: 'Couscous, a staple of North Africa, is recognized by UNESCO as Intangible Cultural Heritage.',
    factArabic: 'الكسكس طبق حبوب أساسي في شمال أفريقيا وهو معترف به من اليونسكو كتراث ثقافي غير مادي.',
    category: 'food', cefrLevel: 'A2', region: 'Maghreb', era: 'medieval',
  },
  {
    id: 'trivia_fod_013',
    fact: 'Qatayef are stuffed pancakes traditionally eaten during the holy month of Ramadan.',
    factArabic: 'القطايف فطائر محشوة تُؤكل تقليدياً خلال شهر رمضان المبارك في العالم العربي.',
    category: 'food', cefrLevel: 'A2', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_fod_014',
    fact: 'Lebanese cuisine is known globally for its use of fresh herbs, olive oil, and lemon juice.',
    factArabic: 'اشتُهر المطبخ اللبناني عالمياً باستخدامه الأعشاب الطازجة وزيت الزيتون وعصير الليمون.',
    category: 'food', cefrLevel: 'A2', region: 'Levant', era: 'contemporary',
  },
  {
    id: 'trivia_fod_015',
    fact: 'Saffron, one of the world\'s most prized spices, was historically traded along Arab spice routes.',
    factArabic: 'الزعفران من أغلى التوابل في العالم وكان يُتاجر به تاريخياً عبر طرق التوابل العربية.',
    category: 'food', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_fod_016',
    fact: 'Harees, a simple porridge of wheat and meat, is eaten during Ramadan across the Gulf states.',
    factArabic: 'الهريس طبق بسيط من القمح واللحم يُؤكل في شهر رمضان في دول الخليج العربي.',
    category: 'food', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_fod_017',
    fact: 'Musakhan is a Palestinian dish of chicken and caramelized onions flavored with sumac on flatbread.',
    factArabic: 'المسخن طبق فلسطيني من الدجاج والبصل المكرمل مع السماق على خبز الطابون.',
    category: 'food', cefrLevel: 'B1', region: 'Levant', era: 'contemporary',
  },
  {
    id: 'trivia_fod_018',
    fact: 'Arabic flatbread (khubz) is baked at very high temperatures and eaten with nearly every Arab meal.',
    factArabic: 'يُخبز الخبز العربي على درجات حرارة عالية جداً ويُقدَّم مع كل وجبة تقريباً في المطبخ العربي.',
    category: 'food', cefrLevel: 'A1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_fod_019',
    fact: 'Mint tea (atay) is a central hospitality tradition in Morocco, often poured from a great height.',
    factArabic: 'الأتاي (شاي النعناع) تقليد محوري في الضيافة المغربية ويُصبّ من ارتفاع عالٍ لإحداث الرغوة.',
    category: 'food', cefrLevel: 'A2', region: 'Maghreb', era: 'medieval',
  },
  {
    id: 'trivia_fod_020',
    fact: 'Meze is the tradition of serving many small dishes together, popular in the Levant and North Africa.',
    factArabic: 'المزة تقليد تقديم أطباق صغيرة متعددة معاً وهو شائع في بلاد الشام وشمال أفريقيا.',
    category: 'food', cefrLevel: 'A1', region: 'Levant', era: 'medieval',
  },

  // ── SCIENCE (20) ──────────────────────────────────────────────────────────
  {
    id: 'trivia_sci_001',
    fact: 'Al-Khwarizmi invented algebra in the 9th century and wrote the first book on the subject.',
    factArabic: 'اخترع الخوارزمي علم الجبر في القرن التاسع الميلادي وكتب أول كتاب في هذا الموضوع.',
    category: 'science', cefrLevel: 'B1', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_sci_002',
    fact: 'The word "algebra" comes from "al-jabr" (الجبر) in the title of Al-Khwarizmi\'s famous book.',
    factArabic: 'كلمة "algebra" في الإنجليزية مأخوذة من "الجبر" في عنوان كتاب الخوارزمي الشهير.',
    category: 'science', cefrLevel: 'A2', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_sci_003',
    fact: 'Ibn Sina (Avicenna) wrote the Canon of Medicine, used as a medical textbook in Europe for 600 years.',
    factArabic: 'كتب ابن سينا القانون في الطب الذي استُخدم كمرجع طبي في أوروبا لمدة 600 عام.',
    category: 'science', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_004',
    fact: 'The word "algorithm" is derived from the Latinization of Al-Khwarizmi\'s name (al-Khwarizmi → algorismus).',
    factArabic: 'كلمة "خوارزمية" (algorithm) مشتقة من اللاتينية التي حوّرت اسم العالم الخوارزمي.',
    category: 'science', cefrLevel: 'B1', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_sci_005',
    fact: 'Ibn al-Haytham is considered the father of modern optics, writing the "Book of Optics" around 1011 CE.',
    factArabic: 'يُعدّ ابن الهيثم أبا علم البصريات الحديثة إذ ألّف كتاب المناظر حوالي عام 1011 ميلادي.',
    category: 'science', cefrLevel: 'B1', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_sci_006',
    fact: 'Arab scholars preserved and translated Greek scientific texts during Europe\'s Middle Ages.',
    factArabic: 'حفظ العلماء العرب المؤلفات العلمية اليونانية وترجموها خلال عصور الظلام الأوروبية.',
    category: 'science', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_007',
    fact: 'Al-Zahrawi was a 10th century Arab physician known as the father of modern surgery.',
    factArabic: 'الزهراوي طبيب عربي من القرن العاشر يُعرف بأبي الجراحة الحديثة.',
    category: 'science', cefrLevel: 'B1', region: 'Andalusia', era: 'medieval',
  },
  {
    id: 'trivia_sci_008',
    fact: 'Jabir ibn Hayyan is considered the father of chemistry for his systematic experimental methods.',
    factArabic: 'يُعدّ جابر بن حيان أبا الكيمياء لتطويره المنهج التجريبي المنظم في العلوم.',
    category: 'science', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_009',
    fact: 'Al-Biruni accurately calculated the circumference of the Earth in the 11th century.',
    factArabic: 'حسب البيروني محيط الأرض بدقة مذهلة في القرن الحادي عشر الميلادي.',
    category: 'science', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_010',
    fact: 'Al-Idrisi created one of the most accurate world maps of the medieval era in 1154 CE.',
    factArabic: 'أنجز الإدريسي خريطة العالم عام 1154 ميلادي وكانت من أدق الخرائط في العصور الوسطى.',
    category: 'science', cefrLevel: 'B1', region: 'Maghreb', era: 'medieval',
  },
  {
    id: 'trivia_sci_011',
    fact: 'Arab astronomers named many stars still known by Arabic names today, like Betelgeuse and Aldebaran.',
    factArabic: 'أطلق علماء الفلك العرب أسماء على كثير من النجوم لا تزال تُعرف بأسمائها العربية كإبط الجوزاء والدبران.',
    category: 'science', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_012',
    fact: 'The astrolabe, an instrument for measuring star positions, was significantly advanced by Arab scientists.',
    factArabic: 'طوّر علماء العرب الإسطرلاب تطويراً كبيراً وهو آلة لقياس مواضع النجوم وحساب الزمن.',
    category: 'science', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_013',
    fact: 'Al-Razi was the first physician to distinguish smallpox from measles in the 9th century.',
    factArabic: 'كان الرازي أول من فرّق بين مرضَي الجدري والحصبة في القرن التاسع الميلادي.',
    category: 'science', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_014',
    fact: 'The House of Wisdom (Bayt al-Hikma) in Baghdad was a major intellectual center from the 8th to 13th centuries.',
    factArabic: 'كان بيت الحكمة في بغداد مركزاً فكرياً كبيراً من القرن الثامن إلى الثالث عشر الميلادي.',
    category: 'science', cefrLevel: 'B1', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_sci_015',
    fact: 'The Arabic numeral system, including zero, was transmitted to Europe through Arab scholars.',
    factArabic: 'انتقل نظام الأرقام العربية بما فيه مفهوم الصفر إلى أوروبا عن طريق العلماء العرب.',
    category: 'science', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_016',
    fact: 'Al-Kindi wrote the first treatise on cryptanalysis (code-breaking) in the 9th century.',
    factArabic: 'كتب الكندي أول رسالة في تحليل الشفرات في القرن التاسع الميلادي.',
    category: 'science', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_017',
    fact: 'Ibn Rushd (Averroes) wrote detailed commentaries on Aristotle that deeply influenced European philosophy.',
    factArabic: 'كتب ابن رشد تفسيرات مستفيضة لأعمال أرسطو أثّرت تأثيراً عميقاً في الفلسفة الأوروبية.',
    category: 'science', cefrLevel: 'B2', region: 'Andalusia', era: 'medieval',
  },
  {
    id: 'trivia_sci_018',
    fact: 'The first public hospitals (bimaristan) were established in Baghdad and Cairo during the Islamic Golden Age.',
    factArabic: 'أُسّست أول المستشفيات العامة في بغداد والقاهرة خلال العصر الذهبي الإسلامي.',
    category: 'science', cefrLevel: 'A2', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_sci_019',
    fact: 'Al-Masudi wrote encyclopedic works covering world history and geography in the 10th century.',
    factArabic: 'ألّف المسعودي موسوعات في تاريخ العالم وجغرافيته في القرن العاشر الميلادي.',
    category: 'science', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_sci_020',
    fact: 'Ibn Battuta from Morocco traveled over 120,000 km in the 14th century — more than any explorer of his era.',
    factArabic: 'سافر ابن بطوطة المغربي أكثر من 120,000 كيلومتر في القرن الرابع عشر، أكثر من أي مستكشف في عصره.',
    category: 'science', cefrLevel: 'B1', region: 'Maghreb', era: 'medieval',
  },

  // ── ART (20) ──────────────────────────────────────────────────────────────
  {
    id: 'trivia_art_001',
    fact: 'Islamic art is known for geometric patterns, arabesques, and calligraphy rather than human figures.',
    factArabic: 'يتميز الفن الإسلامي بأنماطه الهندسية والأرابيسك والخط العربي بدلاً من تصوير البشر.',
    category: 'art', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_art_002',
    fact: 'Arabic calligraphy is considered one of the highest art forms in Islamic civilization.',
    factArabic: 'يُعدّ الخط العربي من أرقى أشكال الفن في الحضارة الإسلامية.',
    category: 'art', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_art_003',
    fact: 'The six major Arabic calligraphy scripts are Naskh, Thuluth, Kufic, Nastaliq, Diwani, and Ruq\'a.',
    factArabic: 'أبرز أنواع الخط العربي ستة هي: النسخ والثلث والكوفي والنستعليق والديواني والرقعة.',
    category: 'art', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_art_004',
    fact: 'Kufic script is the oldest form of Arabic calligraphy, developed in the Iraqi city of Kufa.',
    factArabic: 'الخط الكوفي أقدم أنواع الخط العربي وتطوّر في مدينة الكوفة العراقية.',
    category: 'art', cefrLevel: 'A2', region: 'Mesopotamia', era: 'classical',
  },
  {
    id: 'trivia_art_005',
    fact: 'Zellige in Morocco involves hand-cut ceramic tiles arranged into intricate geometric mosaics.',
    factArabic: 'يتضمن فن الزليج المغربي قطع بلاط سيراميكي مصنوعة يدوياً ومرتبة في فسيفساء هندسية دقيقة.',
    category: 'art', cefrLevel: 'B1', region: 'Maghreb', era: 'medieval',
  },
  {
    id: 'trivia_art_006',
    fact: 'Arabesque patterns feature intricate geometric and floral designs that can extend infinitely.',
    factArabic: 'تتميز نقوش الأرابيسك بتصاميم هندسية ونباتية متشابكة يمكن امتدادها إلى ما لا نهاية.',
    category: 'art', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_art_007',
    fact: 'The Dome of the Rock in Jerusalem (691 CE) features stunning mosaics and geometric decoration.',
    factArabic: 'يتميز مسجد قبة الصخرة في القدس (691 م) بفسيفساء رائعة وزخارف هندسية جميلة.',
    category: 'art', cefrLevel: 'A2', region: 'Levant', era: 'classical',
  },
  {
    id: 'trivia_art_008',
    fact: 'Egyptian mashrabiya latticed screens filter light and provide privacy in traditional Arab homes.',
    factArabic: 'المشربية المصرية شبكة خشبية منحوتة تُرشّح الضوء وتوفر الخصوصية في المنازل العربية التقليدية.',
    category: 'art', cefrLevel: 'B1', region: 'Egypt', era: 'medieval',
  },
  {
    id: 'trivia_art_009',
    fact: 'Arab glassblowing, especially from Syria, was prized across medieval Europe.',
    factArabic: 'اشتُهر زجاج النفخ العربي خاصة السوري وتقدّره القارة الأوروبية خلال العصور الوسطى.',
    category: 'art', cefrLevel: 'B1', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_art_010',
    fact: 'Henna (mehndi) is used for decorative body art at weddings and celebrations across the Arab world.',
    factArabic: 'تُستخدم الحناء للزينة في حفلات الأعراس والاحتفالات في جميع أنحاء العالم العربي.',
    category: 'art', cefrLevel: 'A1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_art_011',
    fact: 'Illuminated Quran manuscripts are masterpieces of calligraphic and decorative Islamic art.',
    factArabic: 'مخطوطات القرآن الكريم المزخرفة من روائع فن الخط والزخرفة الإسلامية.',
    category: 'art', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_art_012',
    fact: 'Arab pottery and ceramic art reached a creative peak during the Abbasid period.',
    factArabic: 'بلغ فن الخزف العربي ذروته الإبداعية خلال العصر العباسي.',
    category: 'art', cefrLevel: 'B1', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_art_013',
    fact: 'Shadow puppetry (khayal al-zill) was a popular entertainment in medieval Cairo and Baghdad.',
    factArabic: 'خيال الظل كان فناً شعبياً للترفيه في القاهرة وبغداد خلال العصور الوسطى.',
    category: 'art', cefrLevel: 'B1', region: 'Egypt', era: 'medieval',
  },
  {
    id: 'trivia_art_014',
    fact: 'Coptic art from Egypt blends early Christian iconography with local Egyptian and Byzantine influences.',
    factArabic: 'يمزج الفن القبطي المصري بين الأيقونوغرافيا المسيحية المبكرة والتأثيرات المصرية والبيزنطية.',
    category: 'art', cefrLevel: 'B2', region: 'Egypt', era: 'classical',
  },
  {
    id: 'trivia_art_015',
    fact: 'Traditional Arab jewelry making, especially gold and silver work, has a rich history in Yemen and the Gulf.',
    factArabic: 'صناعة المجوهرات العربية التقليدية خاصة الذهب والفضة لها تاريخ ثري في اليمن والخليج.',
    category: 'art', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_art_016',
    fact: 'Modern Arab artists blend traditional Islamic patterns with contemporary visual art styles.',
    factArabic: 'يمزج الفنانون العرب المعاصرون بين الأنماط الإسلامية التقليدية والأساليب الفنية الحديثة.',
    category: 'art', cefrLevel: 'B2', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_art_017',
    fact: 'Muqarnas are three-dimensional honeycomb-like decorative vaults found in Islamic palaces and mosques.',
    factArabic: 'المقرنصات سقوف زخرفية ثلاثية الأبعاد تشبه قرص العسل توجد في القصور والمساجد الإسلامية.',
    category: 'art', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_art_018',
    fact: 'Blue and turquoise are prominent colors in Islamic art, symbolizing heaven and paradise.',
    factArabic: 'يشيع اللونان الأزرق والفيروزي في الفن الإسلامي ويرمزان إلى السماء والجنة.',
    category: 'art', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_art_019',
    fact: 'Tatreez (embroidery) is a traditional Palestinian art form with distinctive geometric patterns.',
    factArabic: 'التطريز فن تقليدي فلسطيني بأنماط هندسية مميزة يرمز إلى الهوية والموروث الثقافي.',
    category: 'art', cefrLevel: 'B1', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_art_020',
    fact: 'The Great Mosque of Cordoba (Mezquita) in Spain is a masterpiece of Umayyad decorative art.',
    factArabic: 'تُعدّ مسجد قرطبة الكبير (المسجد الكبير) في إسبانيا من أعظم روائع الفن الزخرفي الأموي.',
    category: 'art', cefrLevel: 'B1', region: 'Andalusia', era: 'medieval',
  },

  // ── MUSIC (20) ────────────────────────────────────────────────────────────
  {
    id: 'trivia_mus_001',
    fact: 'The oud is a short-necked lute and one of the most important instruments in traditional Arab music.',
    factArabic: 'العود آلة وترية ذات رقبة قصيرة وهي من أهم الآلات في الموسيقى العربية التقليدية.',
    category: 'music', cefrLevel: 'A1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_002',
    fact: 'Arabic music uses quarter tones, which fall between the notes of Western musical scales.',
    factArabic: 'تستخدم الموسيقى العربية أرباع النغمات وهي نغمات تقع بين نغمات السلالم الموسيقية الغربية.',
    category: 'music', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_003',
    fact: 'Umm Kulthum, the Egyptian singer, is considered one of the greatest Arab performers of the 20th century.',
    factArabic: 'تُعدّ أم كلثوم المغنية المصرية من أعظم المؤدين العرب في القرن العشرين.',
    category: 'music', cefrLevel: 'A2', region: 'Egypt', era: 'contemporary',
  },
  {
    id: 'trivia_mus_004',
    fact: 'The maqam is a system of musical modes and scales that gives Arab music its distinctive character.',
    factArabic: 'المقام نظام من الأنماط الموسيقية يمنح الموسيقى العربية طابعها المميز.',
    category: 'music', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_005',
    fact: 'Fairuz is a legendary Lebanese singer whose songs are beloved across the entire Arab world.',
    factArabic: 'فيروز مغنية لبنانية أسطورية وأغانيها محبوبة في أرجاء العالم العربي كله.',
    category: 'music', cefrLevel: 'A2', region: 'Levant', era: 'contemporary',
  },
  {
    id: 'trivia_mus_006',
    fact: 'The darbuka (goblet drum) is a percussion instrument central to Arab folk music and celebrations.',
    factArabic: 'الدربكة (طبل الكأس) آلة إيقاعية محورية في الموسيقى الشعبية العربية والاحتفالات.',
    category: 'music', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_007',
    fact: 'Andalusian classical music, developed by Moorish musicians in Spain, survives in North Africa today.',
    factArabic: 'الموسيقى الأندلسية الكلاسيكية التي طوّرها الموريسكيون في إسبانيا لا تزال حية في شمال أفريقيا.',
    category: 'music', cefrLevel: 'B1', region: 'Andalusia', era: 'medieval',
  },
  {
    id: 'trivia_mus_008',
    fact: 'Al-Farabi wrote one of the most comprehensive medieval books on music theory.',
    factArabic: 'كتب الفارابي أحد أشمل الكتب في نظرية الموسيقى في العصور الوسطى.',
    category: 'music', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_009',
    fact: 'Tarab is the state of emotional enchantment and ecstasy that great Arabic music can create in listeners.',
    factArabic: 'الطرب هو حالة الانتشاء العاطفي والوجد التي يمكن أن تُحدثها الموسيقى العربية الرائعة.',
    category: 'music', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_010',
    fact: 'The nay (reed flute) is associated with Sufi mysticism and produces a haunting, spiritual sound.',
    factArabic: 'الناي (مزمار القصب) مرتبط بالصوفية ويُنتج صوتاً روحانياً مؤثراً.',
    category: 'music', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_011',
    fact: 'Arab music influenced the development of Spanish flamenco through the Moorish presence in Andalusia.',
    factArabic: 'أثّرت الموسيقى العربية في تطور الفلامنكو الإسباني من خلال الوجود المورسكي في الأندلس.',
    category: 'music', cefrLevel: 'B2', region: 'Andalusia', era: 'medieval',
  },
  {
    id: 'trivia_mus_012',
    fact: 'The qanun is a plucked zither with 78 strings used in classical Arab musical ensembles.',
    factArabic: 'القانون آلة وترية ذات 78 وتراً تُستخدم في الفرق الموسيقية الكلاسيكية العربية.',
    category: 'music', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_013',
    fact: 'The rebab is a bowed string instrument and one of the oldest Arab musical instruments.',
    factArabic: 'الرباب آلة وترية تُعزف بالقوس وهي من أقدم الآلات الموسيقية العربية.',
    category: 'music', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_014',
    fact: 'Mawwal is an improvised vocal art form popular in Egyptian and Levantine music traditions.',
    factArabic: 'الموّال فن غنائي ارتجالي شائع في التقاليد الموسيقية المصرية والشامية.',
    category: 'music', cefrLevel: 'B1', region: 'Egypt', era: 'medieval',
  },
  {
    id: 'trivia_mus_015',
    fact: 'Sana\'ani music from Yemen features unique vocal techniques and a rich tradition of sung poetry.',
    factArabic: 'موسيقى الصنعاني من اليمن تتميز بأساليب صوتية فريدة وتقاليد غنية من الشعر المغنى.',
    category: 'music', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_016',
    fact: 'Arab music has strong oral traditions, with compositions passed down through generations without notation.',
    factArabic: 'للموسيقى العربية تقاليد شفهية قوية تنتقل من جيل إلى جيل دون تدوين موسيقي.',
    category: 'music', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_mus_017',
    fact: 'Modern Arabic pop music blends traditional Arab scales with contemporary instruments and global rhythms.',
    factArabic: 'تمزج الموسيقى العربية الحديثة بين السلالم الموسيقية التقليدية والآلات المعاصرة والإيقاعات العالمية.',
    category: 'music', cefrLevel: 'A2', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_mus_018',
    fact: 'Arab wedding music often features call-and-response singing, percussion, and joyful ululation.',
    factArabic: 'تتميز موسيقى الأعراس العربية بالغناء التناوبي والإيقاعات والزغاريد الفرحة.',
    category: 'music', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_mus_019',
    fact: 'The mizmar is a traditional wind instrument used in Bedouin and folk music across the Arab world.',
    factArabic: 'المزمار آلة هوائية تقليدية تُستخدم في الموسيقى البدوية والشعبية في أرجاء العالم العربي.',
    category: 'music', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_mus_020',
    fact: 'Arab music theory, developed by scholars like Al-Farabi and Ibn Sina, influenced medieval European music.',
    factArabic: 'أثّرت نظرية الموسيقى العربية التي طوّرها الفارابي وابن سينا في الموسيقى الأوروبية في القرون الوسطى.',
    category: 'music', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },

  // ── ARCHITECTURE (20) ─────────────────────────────────────────────────────
  {
    id: 'trivia_arc_001',
    fact: 'The Kaaba in Mecca is a cube-shaped structure covered in black cloth, the focal point of Muslim prayer.',
    factArabic: 'الكعبة المشرفة في مكة المكرمة بناء مكعب الشكل مغطى بالكسوة السوداء يتجه إليه المسلمون في الصلاة.',
    category: 'architecture', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_arc_002',
    fact: 'The Great Mosque of Cordoba features over 850 columns and intricate Umayyad horseshoe arches.',
    factArabic: 'يضم مسجد قرطبة الكبير أكثر من 850 عموداً وأقواساً حدوية بديعة من العهد الأموي.',
    category: 'architecture', cefrLevel: 'B1', region: 'Andalusia', era: 'medieval',
  },
  {
    id: 'trivia_arc_003',
    fact: 'A minaret is a tower attached to a mosque from which the muezzin calls Muslims to prayer.',
    factArabic: 'المئذنة برج ملحق بالمسجد ينادي منه المؤذن المسلمين للصلاة.',
    category: 'architecture', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_arc_004',
    fact: 'Petra in Jordan is an ancient Nabataean city carved directly into rose-red sandstone cliffs.',
    factArabic: 'البتراء في الأردن مدينة نبطية قديمة منحوتة في الصخور الرملية ذات اللون الوردي.',
    category: 'architecture', cefrLevel: 'A2', region: 'Levant', era: 'ancient',
  },
  {
    id: 'trivia_arc_005',
    fact: 'Traditional Arab homes are built around a central courtyard (sahn) to provide shade and air circulation.',
    factArabic: 'تُبنى المنازل العربية التقليدية حول صحن (فناء) مركزي يوفر الظل والتهوية الطبيعية.',
    category: 'architecture', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_arc_006',
    fact: 'Muqarnas are three-dimensional honeycomb-like decorative vaults found in Islamic palaces and mosques.',
    factArabic: 'المقرنصات سقوف زخرفية ثلاثية الأبعاد تشبه قرص العسل توجد في القصور والمساجد الإسلامية.',
    category: 'architecture', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_arc_007',
    fact: 'The Great Pyramid of Giza, built around 2560 BCE, was the world\'s tallest structure for 3,800 years.',
    factArabic: 'الهرم الأكبر في الجيزة الذي بُني حوالي 2560 قبل الميلاد ظل أطول بناء بشري لمدة 3800 عام.',
    category: 'architecture', cefrLevel: 'A2', region: 'Egypt', era: 'ancient',
  },
  {
    id: 'trivia_arc_008',
    fact: 'Wind towers (barjeel) were traditional natural air-conditioning systems used in Gulf Arab architecture.',
    factArabic: 'أبراج الرياح (البارجيل) كانت أنظمة تكييف هواء طبيعية تقليدية في العمارة الخليجية العربية.',
    category: 'architecture', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_arc_009',
    fact: 'Hassan II Mosque in Casablanca has the world\'s tallest minaret, standing 210 meters high.',
    factArabic: 'مسجد الحسن الثاني في الدار البيضاء له أطول مئذنة في العالم بارتفاع 210 أمتار.',
    category: 'architecture', cefrLevel: 'A2', region: 'Maghreb', era: 'contemporary',
  },
  {
    id: 'trivia_arc_010',
    fact: 'The Alhambra palace in Granada, Spain, is a masterpiece of Nasrid Arab architecture and ornamental art.',
    factArabic: 'قصر الحمراء في غرناطة بإسبانيا من روائع العمارة العربية النصرية وفنون الزخرفة.',
    category: 'architecture', cefrLevel: 'A2', region: 'Andalusia', era: 'medieval',
  },
  {
    id: 'trivia_arc_011',
    fact: 'The old city of Sanaa, Yemen, features multi-story tower houses with decorated alabaster facades.',
    factArabic: 'تتميز مدينة صنعاء القديمة في اليمن بمنازل برجية متعددة الطوابق ذات واجهات مزخرفة من الجبص.',
    category: 'architecture', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_arc_012',
    fact: 'Arab architects developed the pointed arch centuries before it appeared in European Gothic cathedrals.',
    factArabic: 'طوّر المعماريون العرب القوس المدبّب قروناً قبل ظهوره في الكاتدرائيات القوطية الأوروبية.',
    category: 'architecture', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_arc_013',
    fact: 'The Citadel of Aleppo in Syria is one of the oldest and largest castles in the world.',
    factArabic: 'قلعة حلب في سوريا من أقدم القلاع وأكبرها في العالم.',
    category: 'architecture', cefrLevel: 'A2', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_arc_014',
    fact: 'Traditional Moroccan riads feature introverted courtyards, carved plaster walls, and zellige tile floors.',
    factArabic: 'الرياض المغربية التقليدية لها أفنية داخلية وجدران جص منحوتة وأرضيات من الزليج.',
    category: 'architecture', cefrLevel: 'B1', region: 'Maghreb', era: 'medieval',
  },
  {
    id: 'trivia_arc_015',
    fact: 'The Ibn Tulun Mosque in Cairo (879 CE) is one of the oldest and largest surviving mosques in Egypt.',
    factArabic: 'مسجد ابن طولون في القاهرة (879 م) من أقدم المساجد القائمة وأكبرها في مصر.',
    category: 'architecture', cefrLevel: 'A2', region: 'Egypt', era: 'medieval',
  },
  {
    id: 'trivia_arc_016',
    fact: 'Al-Khazneh (The Treasury) at Petra is a famous facade carved into sandstone around the 1st century BCE.',
    factArabic: 'الخزنة في البتراء واجهة شهيرة منحوتة في الصخر الرملي حوالي القرن الأول قبل الميلاد.',
    category: 'architecture', cefrLevel: 'B1', region: 'Levant', era: 'ancient',
  },
  {
    id: 'trivia_arc_017',
    fact: 'The Sheikh Zayed Grand Mosque in Abu Dhabi can accommodate over 40,000 worshippers.',
    factArabic: 'يستوعب جامع الشيخ زايد الكبير في أبوظبي أكثر من 40,000 مصلٍّ في آنٍ واحد.',
    category: 'architecture', cefrLevel: 'A2', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_arc_018',
    fact: 'Mud-brick (adobe) architecture has been used in Yemen and the Maghreb for thousands of years.',
    factArabic: 'تُستخدم العمارة بالطوب الطيني (اللبن) في اليمن والمغرب منذ آلاف السنين.',
    category: 'architecture', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_arc_019',
    fact: 'The Great Mosque of Djenne in Mali is the world\'s largest mud-brick building.',
    factArabic: 'المسجد الكبير في جني بمالي أكبر مبنى من الطوب الطيني في العالم.',
    category: 'architecture', cefrLevel: 'B2', region: 'Maghreb', era: 'medieval',
  },
  {
    id: 'trivia_arc_020',
    fact: 'Islamic architecture combines domes, arches, minarets, and courtyards to create spiritual spaces.',
    factArabic: 'تجمع العمارة الإسلامية بين القباب والأقواس والمآذن والأفنية لخلق مساحات روحانية.',
    category: 'architecture', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },

  // ── LITERATURE (20) ───────────────────────────────────────────────────────
  {
    id: 'trivia_lit_001',
    fact: 'One Thousand and One Nights (Arabian Nights) is a collection of Arabic, Persian, and Indian folk tales.',
    factArabic: 'ألف ليلة وليلة مجموعة من الحكايات الشعبية العربية والفارسية والهندية جُمعت عبر القرون.',
    category: 'literature', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lit_002',
    fact: 'The Quran is considered the finest example of Arabic literary prose and the foundation of Arabic grammar.',
    factArabic: 'يُعدّ القرآن الكريم أرقى نموذج للنثر الأدبي العربي وأساس قواعد اللغة العربية.',
    category: 'literature', cefrLevel: 'B1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lit_003',
    fact: 'Al-Mutanabbi is considered one of the greatest Arabic poets, known for his proud and philosophical verses.',
    factArabic: 'يُعدّ المتنبي من أعظم شعراء العربية ويشتهر بقصائد الكبرياء والحكمة.',
    category: 'literature', cefrLevel: 'B1', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_lit_004',
    fact: 'Naguib Mahfouz was the first Arab author to win the Nobel Prize in Literature, in 1988.',
    factArabic: 'نجيب محفوظ أول أديب عربي يحصل على جائزة نوبل في الآداب عام 1988.',
    category: 'literature', cefrLevel: 'A2', region: 'Egypt', era: 'contemporary',
  },
  {
    id: 'trivia_lit_005',
    fact: 'The Mu\'allaqat are seven celebrated pre-Islamic poems said to have been displayed in the Kaaba.',
    factArabic: 'المعلقات سبع قصائد جاهلية شهيرة قيل إنها كانت تُعرض في الكعبة المشرفة.',
    category: 'literature', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_lit_006',
    fact: 'Khalil Gibran, born in Lebanon, wrote "The Prophet," which has been translated into over 100 languages.',
    factArabic: 'كتب جبران خليل جبران المولود في لبنان "النبي" الذي تُرجم إلى أكثر من 100 لغة.',
    category: 'literature', cefrLevel: 'B1', region: 'Levant', era: 'modern',
  },
  {
    id: 'trivia_lit_007',
    fact: 'Ibn Khaldun\'s "Muqaddimah" (1377) is considered the first work of sociology and historiography.',
    factArabic: 'مقدمة ابن خلدون (1377) تُعدّ أول عمل في علم الاجتماع ومنهجية كتابة التاريخ.',
    category: 'literature', cefrLevel: 'B2', region: 'Maghreb', era: 'medieval',
  },
  {
    id: 'trivia_lit_008',
    fact: 'Pre-Islamic Arabic poetry (Jahiliyya) celebrated heroism, love, tribal honor, and desert life.',
    factArabic: 'احتفى الشعر الجاهلي ما قبل الإسلام بالبطولة والحب وشرف القبيلة والحياة الصحراوية.',
    category: 'literature', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_lit_009',
    fact: 'The maqama is a genre of ornate rhymed prose narrative developed by Al-Hamadhani in the 10th century.',
    factArabic: 'المقامة جنس أدبي من النثر المسجوع المزخرف طوّره الهمذاني في القرن العاشر الميلادي.',
    category: 'literature', cefrLevel: 'B2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lit_010',
    fact: 'Layla and Majnun is a classic Arabic love story of tragic unrequited love, retold across many cultures.',
    factArabic: 'ليلى والمجنون قصة حب عربية كلاسيكية عن الحب العذري المأساوي أُعيد روايتها في ثقافات عديدة.',
    category: 'literature', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lit_011',
    fact: 'Al-Jahiz wrote over 200 books on diverse topics including zoology, theology, grammar, and rhetoric.',
    factArabic: 'ألّف الجاحظ أكثر من 200 كتاب في موضوعات متنوعة منها علم الحيوان واللاهوت والنحو والبلاغة.',
    category: 'literature', cefrLevel: 'B1', region: 'Mesopotamia', era: 'medieval',
  },
  {
    id: 'trivia_lit_012',
    fact: 'Abu Nuwas (8th–9th century) was an Abbasid court poet celebrated for his wit and sophisticated verse.',
    factArabic: 'أبو نواس شاعر عباسي من القرنين الثامن والتاسع اشتُهر بذكائه وشعره الرفيع.',
    category: 'literature', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lit_013',
    fact: 'The Palestinian poet Mahmoud Darwish (1941–2008) is considered one of the greatest Arab poets of modern times.',
    factArabic: 'الشاعر الفلسطيني محمود درويش (1941-2008) يُعدّ من أعظم الشعراء العرب في العصر الحديث.',
    category: 'literature', cefrLevel: 'B1', region: 'Levant', era: 'contemporary',
  },
  {
    id: 'trivia_lit_014',
    fact: 'The Diwan is the traditional form for publishing an Arab poet\'s complete collected works.',
    factArabic: 'الديوان الشكل التقليدي لنشر الأعمال الشعرية الكاملة للشاعر العربي.',
    category: 'literature', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lit_015',
    fact: 'Arabic proverbs (amthal) are a rich oral tradition reflecting the cultural wisdom of Arab peoples.',
    factArabic: 'الأمثال العربية تراث شفهي غني يعكس الحكمة الثقافية للشعوب العربية عبر التاريخ.',
    category: 'literature', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_lit_016',
    fact: 'The Nahda (Arab Renaissance) of the 19th–20th centuries revived Arabic literature and intellectual life.',
    factArabic: 'أيقظت النهضة العربية في القرنين التاسع عشر والعشرين الأدب والحياة الفكرية العربية.',
    category: 'literature', cefrLevel: 'B2', region: 'Levant', era: 'modern',
  },
  {
    id: 'trivia_lit_017',
    fact: 'One Thousand and One Nights includes famous stories such as Ali Baba, Sinbad, and Aladdin.',
    factArabic: 'تتضمن ألف ليلة وليلة قصصاً شهيرة كعلي بابا والسندباد وعلاء الدين.',
    category: 'literature', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lit_018',
    fact: 'Sinbad the Sailor is a fictional Arab merchant whose seven voyages took him across the Indian Ocean.',
    factArabic: 'السندباد البحري تاجر عربي خيالي أبحر في سبع رحلات حول المحيط الهندي.',
    category: 'literature', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lit_019',
    fact: 'Al-Mutanabbi\'s verse "Great ambitions come only to those of great resolve" is among the most quoted in Arabic.',
    factArabic: 'بيت المتنبي "على قدر أهل العزم تأتي العزائم" من أكثر الأبيات الشعرية العربية اقتباساً.',
    category: 'literature', cefrLevel: 'C1', region: 'Levant', era: 'medieval',
  },
  {
    id: 'trivia_lit_020',
    fact: 'The oral poet (sha\'ir) was the voice and memory of the tribe in pre-Islamic and early Islamic Arabia.',
    factArabic: 'كان الشاعر لسان القبيلة وحافظ ذاكرتها في شبه الجزيرة العربية قبل الإسلام وبعده.',
    category: 'literature', cefrLevel: 'B2', region: 'Arabia', era: 'ancient',
  },

  // ── LANGUAGE (20) ─────────────────────────────────────────────────────────
  {
    id: 'trivia_lan_001',
    fact: 'Arabic is written from right to left and does not show short vowels in everyday writing.',
    factArabic: 'تُكتب العربية من اليمين إلى اليسار ولا تظهر فيها الحركات القصيرة في الكتابة اليومية.',
    category: 'language', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_002',
    fact: 'Arabic is the fifth most spoken language in the world, with over 420 million speakers.',
    factArabic: 'العربية هي اللغة الخامسة الأكثر تحدثاً في العالم بأكثر من 420 مليون متحدث.',
    category: 'language', cefrLevel: 'A1', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_lan_003',
    fact: 'Arabic has three grammatical numbers: singular (مفرد), dual (مثنى), and plural (جمع).',
    factArabic: 'للعربية ثلاثة أعداد نحوية: المفرد والمثنى والجمع.',
    category: 'language', cefrLevel: 'A2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_004',
    fact: 'The Arabic root system allows thousands of words to be derived from three-letter (trilateral) roots.',
    factArabic: 'يتيح نظام الجذر في العربية اشتقاق آلاف الكلمات من جذور ثلاثية الحروف.',
    category: 'language', cefrLevel: 'B1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_005',
    fact: 'The Arabic word "sifr" (صفر, zero) gave English both the words "zero" and "cipher".',
    factArabic: 'الكلمة العربية "صفر" هي أصل كلمتَي "zero" و"cipher" في الإنجليزية.',
    category: 'language', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lan_006',
    fact: 'Arabic has influenced many world languages including Spanish, Persian, Urdu, Turkish, and Swahili.',
    factArabic: 'أثّرت العربية في لغات عالمية كثيرة منها الإسبانية والفارسية والأردية والتركية والسواحيلية.',
    category: 'language', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lan_007',
    fact: 'Modern Standard Arabic (MSA) is the formal written form used in media and education across the Arab world.',
    factArabic: 'الفصحى المعاصرة هي شكل الكتابة الرسمي المستخدم في الإعلام والتعليم في العالم العربي.',
    category: 'language', cefrLevel: 'A2', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_lan_008',
    fact: 'Classical Arabic, the language of the Quran, has been remarkably preserved for over 1,400 years.',
    factArabic: 'ظلت العربية الفصحى لغة القرآن محفوظة بشكل ملحوظ على مدى أكثر من 1400 عام.',
    category: 'language', cefrLevel: 'B1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_009',
    fact: 'The letter \'ayn\' (ع) represents a pharyngeal consonant unique to Arabic and other Semitic languages.',
    factArabic: 'حرف العين (ع) يمثل صوتاً حلقياً فريداً في العربية وغيرها من اللغات السامية.',
    category: 'language', cefrLevel: 'B2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_010',
    fact: 'Arabic has 28 letters, all consonants, with optional diacritical marks to indicate vowel sounds.',
    factArabic: 'للعربية 28 حرفاً تمثل جميعها أصواتاً صامتة وتُستخدم الحركات اختيارياً للدلالة على الأصوات الصائتة.',
    category: 'language', cefrLevel: 'A2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_011',
    fact: 'Arabic dialects vary widely across countries, though Modern Standard Arabic unites the Arab world in writing.',
    factArabic: 'تتباين اللهجات العربية كثيراً بين الدول غير أن الفصحى تجمع العالم العربي في الكتابة.',
    category: 'language', cefrLevel: 'A2', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_lan_012',
    fact: 'The definite article "al-" (ال) in Arabic assimilates to the following letter in 14 cases.',
    factArabic: 'تستوعب أداة التعريف "ال" في العربية الحرف الذي يليها في 14 حالة من الحروف الشمسية.',
    category: 'language', cefrLevel: 'B2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_013',
    fact: 'Arabic uses an abjad writing system where letters represent consonants and vowels are inferred from context.',
    factArabic: 'تستخدم العربية نظام الكتابة الأبجدي حيث تمثل الحروف الأصوات الصامتة ويُستنتج القارئ الحركات من السياق.',
    category: 'language', cefrLevel: 'B1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_014',
    fact: 'The Arabic word "marhaba" (مرحبا) literally means "you are in a wide, welcoming place."',
    factArabic: 'كلمة "مرحبا" العربية تعني حرفياً "أنت في مكان رحب" تعبيراً عن الترحيب الصادق.',
    category: 'language', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_015',
    fact: 'Arabic grammar distinguishes between masculine and feminine forms for second-person pronouns.',
    factArabic: 'تُميّز النحو العربي بين صيغتَي المذكر والمؤنث في ضمائر المخاطب.',
    category: 'language', cefrLevel: 'A2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_lan_016',
    fact: 'Arabic has given English words including cotton, sugar, alcohol, algebra, and admiral.',
    factArabic: 'أعطت العربية الإنجليزية كلمات كثيرة منها: قطن وسكر وكحول وجبر وأمير البحر (admiral).',
    category: 'language', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lan_017',
    fact: 'The Arabic alphabet is used, with modifications, to write Persian, Urdu, Pashto, and other languages.',
    factArabic: 'تُستخدم الأبجدية العربية مع تعديلات في كتابة الفارسية والأردية والبشتوية ولغات أخرى.',
    category: 'language', cefrLevel: 'B1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lan_018',
    fact: 'Al-Khalil ibn Ahmad al-Farahidi codified 16 poetic meters of Arabic verse in the 8th century.',
    factArabic: 'صنّف الخليل بن أحمد الفراهيدي 16 بحراً شعرياً في علم العروض العربي في القرن الثامن.',
    category: 'language', cefrLevel: 'C1', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_lan_019',
    fact: 'Arabic has an exceptionally rich vocabulary, with hundreds of words for camels and desert environments.',
    factArabic: 'للغة العربية مفردات غنية جداً تضم مئات الكلمات لأنواع الإبل والبيئات الصحراوية.',
    category: 'language', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_lan_020',
    fact: '"Inshallah" (إن شاء الله, if God wills) is one of the most universally recognized Arabic expressions.',
    factArabic: 'إن شاء الله من أكثر العبارات العربية شهرةً وانتشاراً على المستوى العالمي.',
    category: 'language', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },

  // ── GEOGRAPHY (20) ────────────────────────────────────────────────────────
  {
    id: 'trivia_geo_001',
    fact: 'The Arab world spans 22 countries from Morocco in the northwest to Oman in the southeast.',
    factArabic: 'يمتد العالم العربي عبر 22 دولة من المغرب شمال غرباً إلى عُمان جنوب شرقاً.',
    category: 'geography', cefrLevel: 'A1', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_geo_002',
    fact: 'The Nile River, flowing through Egypt and Sudan, is the world\'s longest river at 6,650 km.',
    factArabic: 'نهر النيل الذي يجري في مصر والسودان هو أطول أنهار العالم بطول 6,650 كيلومتراً.',
    category: 'geography', cefrLevel: 'A1', region: 'Egypt', era: 'ancient',
  },
  {
    id: 'trivia_geo_003',
    fact: 'The Sahara Desert, covering much of North Africa, is the world\'s largest hot desert.',
    factArabic: 'الصحراء الكبرى التي تغطي معظم شمال أفريقيا هي أكبر صحراء حارة في العالم.',
    category: 'geography', cefrLevel: 'A1', region: 'Maghreb', era: 'ancient',
  },
  {
    id: 'trivia_geo_004',
    fact: 'The Empty Quarter (Rub\' al-Khali) in Saudi Arabia is the world\'s largest continuous sand desert.',
    factArabic: 'الربع الخالي في المملكة العربية السعودية أكبر صحراء رملية متواصلة في العالم.',
    category: 'geography', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_geo_005',
    fact: 'The Dead Sea, bordering Jordan and the West Bank, is the lowest point on Earth\'s surface.',
    factArabic: 'البحر الميت على حدود الأردن والضفة الغربية هو أخفض نقطة على سطح الأرض.',
    category: 'geography', cefrLevel: 'A2', region: 'Levant', era: 'ancient',
  },
  {
    id: 'trivia_geo_006',
    fact: 'The Strait of Hormuz, between Iran and Oman, is one of the world\'s most strategically important waterways.',
    factArabic: 'مضيق هرمز بين إيران وعُمان أحد أهم الممرات المائية الاستراتيجية في العالم.',
    category: 'geography', cefrLevel: 'B1', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_geo_007',
    fact: 'The Arabian Peninsula is the world\'s largest peninsula, surrounded by the Red Sea, Arabian Sea, and Persian Gulf.',
    factArabic: 'شبه الجزيرة العربية أكبر شبه جزيرة في العالم تحيط بها البحر الأحمر وبحر العرب والخليج العربي.',
    category: 'geography', cefrLevel: 'A1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_geo_008',
    fact: 'Egypt\'s Sinai Peninsula bridges Africa and Asia, linking the Mediterranean to the Red Sea.',
    factArabic: 'تربط سيناء المصرية بين قارتَي أفريقيا وآسيا وتصل البحر الأبيض المتوسط بالبحر الأحمر.',
    category: 'geography', cefrLevel: 'A2', region: 'Egypt', era: 'ancient',
  },
  {
    id: 'trivia_geo_009',
    fact: 'Algeria is the largest country in Africa by land area, covering over 2.3 million square kilometers.',
    factArabic: 'الجزائر أكبر دول أفريقيا مساحةً إذ تبلغ أكثر من 2.3 مليون كيلومتر مربع.',
    category: 'geography', cefrLevel: 'A2', region: 'Maghreb', era: 'contemporary',
  },
  {
    id: 'trivia_geo_010',
    fact: 'The Tigris and Euphrates rivers of Iraq defined the boundaries of ancient Mesopotamian civilization.',
    factArabic: 'نهرا دجلة والفرات في العراق حدّدا حدود الحضارة المسوبوتامية القديمة.',
    category: 'geography', cefrLevel: 'A2', region: 'Mesopotamia', era: 'ancient',
  },
  {
    id: 'trivia_geo_011',
    fact: 'Morocco has two coastlines: the Atlantic Ocean to the west and the Mediterranean Sea to the north.',
    factArabic: 'للمغرب ساحلان: على المحيط الأطلسي غرباً وعلى البحر الأبيض المتوسط شمالاً.',
    category: 'geography', cefrLevel: 'A2', region: 'Maghreb', era: 'contemporary',
  },
  {
    id: 'trivia_geo_012',
    fact: 'The Atlas Mountains in Morocco, Algeria, and Tunisia are the highest range in North Africa.',
    factArabic: 'جبال الأطلس في المغرب والجزائر وتونس هي أعلى سلسلة جبلية في شمال أفريقيا.',
    category: 'geography', cefrLevel: 'A2', region: 'Maghreb', era: 'ancient',
  },
  {
    id: 'trivia_geo_013',
    fact: 'The Nile Delta in Egypt is one of the world\'s largest and most densely populated river deltas.',
    factArabic: 'دلتا النيل في مصر من أكبر دلتاوات الأنهار في العالم وأكثرها اكتظاظاً بالسكان.',
    category: 'geography', cefrLevel: 'B1', region: 'Egypt', era: 'ancient',
  },
  {
    id: 'trivia_geo_014',
    fact: 'Oman\'s Dhofar region experiences a unique summer monsoon (khareef), creating lush green landscapes.',
    factArabic: 'تشهد منطقة ظفار في عُمان موسم الخريف الصيفي الفريد الذي يُحوّلها إلى مناطق خضراء مورقة.',
    category: 'geography', cefrLevel: 'B1', region: 'Arabia', era: 'contemporary',
  },
  {
    id: 'trivia_geo_015',
    fact: 'Lebanon is a small but diverse country with mountains, coastline, and fertile Bekaa Valley.',
    factArabic: 'لبنان بلد صغير لكنه متنوع جغرافياً إذ يضم جبالاً وسواحل وسهل البقاء الخصيب.',
    category: 'geography', cefrLevel: 'A2', region: 'Levant', era: 'contemporary',
  },
  {
    id: 'trivia_geo_016',
    fact: 'Jordan has a small outlet to the Red Sea at the port of Aqaba and is otherwise landlocked.',
    factArabic: 'يمتلك الأردن منفذاً صغيراً على البحر الأحمر عند ميناء العقبة وهو محاط بالأرض من جهاته الأخرى.',
    category: 'geography', cefrLevel: 'A2', region: 'Levant', era: 'contemporary',
  },
  {
    id: 'trivia_geo_017',
    fact: 'The Suez Canal (193 km long) is one of the world\'s busiest shipping routes, opened in 1869.',
    factArabic: 'قناة السويس (193 كم) من أكثر طرق الشحن ازدحاماً في العالم افتُتحت عام 1869.',
    category: 'geography', cefrLevel: 'A2', region: 'Egypt', era: 'modern',
  },
  {
    id: 'trivia_geo_018',
    fact: 'Wadi Rum in Jordan is known for its dramatic red sandstone formations and ancient Bedouin culture.',
    factArabic: 'وادي رم في الأردن مشهور بتشكيلاته الصخرية الرملية الحمراء الدرامية وثقافته البدوية العريقة.',
    category: 'geography', cefrLevel: 'A2', region: 'Levant', era: 'ancient',
  },
  {
    id: 'trivia_geo_019',
    fact: 'The Rub\' al-Khali covers about 650,000 sq km across Saudi Arabia, UAE, Oman, and Yemen.',
    factArabic: 'يغطي الربع الخالي نحو 650,000 كيلومتر مربع عبر السعودية والإمارات وعُمان واليمن.',
    category: 'geography', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_geo_020',
    fact: 'The Euphrates River originates in Turkey, flows through Syria, and empties into southern Iraq.',
    factArabic: 'ينبع نهر الفرات من تركيا ويجري عبر سوريا ويصب في جنوب العراق.',
    category: 'geography', cefrLevel: 'A2', region: 'Mesopotamia', era: 'ancient',
  },

  // ── CUSTOMS (20) ──────────────────────────────────────────────────────────
  {
    id: 'trivia_cus_001',
    fact: 'Hospitality (diyafa) is a central value in Arab culture — guests are always honored with food and generosity.',
    factArabic: 'الضيافة (الكرم) قيمة محورية في الثقافة العربية إذ يُكرَّم الضيوف دائماً بالطعام والعطاء.',
    category: 'customs', cefrLevel: 'A1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_002',
    fact: '"As-salamu alaykum" (peace be upon you) is the universal Islamic greeting used across the Arab world.',
    factArabic: '"السلام عليكم" تحية إسلامية شاملة تُستخدم في أرجاء العالم العربي وبين المسلمين عموماً.',
    category: 'customs', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_cus_003',
    fact: 'Ramadan is the holy month of fasting from dawn to sunset observed by Muslims worldwide.',
    factArabic: 'رمضان شهر مقدس يصوم فيه المسلمون من الفجر حتى غروب الشمس.',
    category: 'customs', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_cus_004',
    fact: 'Eid al-Fitr marks the end of Ramadan and is celebrated with prayers, new clothes, and special sweets.',
    factArabic: 'عيد الفطر يُحتفل به بنهاية رمضان بالصلاة والملابس الجديدة والحلوى والتهاني.',
    category: 'customs', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_cus_005',
    fact: 'Eid al-Adha commemorates Ibrahim\'s willingness to sacrifice his son, marked with prayer and charity.',
    factArabic: 'عيد الأضحى يُحيّي ذكرى استعداد سيدنا إبراهيم للتضحية بابنه ويُحتفل به بالصلاة والأضحية والصدقة.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_cus_006',
    fact: 'Friday (Jumu\'ah) prayer is the special weekly congregational prayer for Muslims.',
    factArabic: 'صلاة الجمعة هي صلاة الجماعة الأسبوعية الخاصة للمسلمين.',
    category: 'customs', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_cus_007',
    fact: 'Majlis is both a reception room and a tradition of open community gatherings for discussion and hospitality.',
    factArabic: 'المجلس هو غرفة الاستقبال وتقليد التجمعات المفتوحة للنقاش والضيافة في المجتمعات العربية.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_cus_008',
    fact: 'The coffee ceremony (qahwa) is a vital ritual in Gulf Arab culture, served in small cups to guests.',
    factArabic: 'مراسم القهوة (الدلة) ركيزة أساسية في الثقافة الخليجية تُقدَّم للضيوف في فناجين صغيرة.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_cus_009',
    fact: 'The keffiyeh (شماغ) is a traditional headscarf worn for both practical and cultural identity reasons.',
    factArabic: 'الكوفية والشماغ غطاء رأس تقليدي يُلبس لأغراض عملية وللتعبير عن الهوية الثقافية.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'medieval',
  },
  {
    id: 'trivia_cus_010',
    fact: 'Henna (mehndi) designs are traditionally applied to brides\' hands and feet before wedding celebrations.',
    factArabic: 'الحناء (المهندي) تُرسم تقليدياً على يدي العروس وقدميها قبل حفل الزفاف.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_011',
    fact: 'Arab wedding celebrations traditionally last several days, with music, dance, and communal feasting.',
    factArabic: 'احتفالات الأعراس العربية التقليدية تستمر عدة أيام مع الموسيقى والرقص والطعام المشترك.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_012',
    fact: 'Respecting elders and using honorific titles is an important part of Arab social etiquette.',
    factArabic: 'احترام الكبار واستخدام ألقاب التبجيل جزء مهم من آداب التواصل الاجتماعي العربي.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_013',
    fact: 'Arab naming conventions include a person\'s own name, their father\'s name, and grandfather\'s name.',
    factArabic: 'تتضمن أسماء العرب تقليدياً اسم الشخص واسم أبيه واسم جده.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_014',
    fact: 'During Ramadan, the pre-dawn meal (Suhoor) and sunset fast-breaking (Iftar) are important daily rituals.',
    factArabic: 'في رمضان وجبة السحور قبل الفجر وإفطار الصائم عند المغرب من الشعائر اليومية الأساسية.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_cus_015',
    fact: 'The evil eye (ayn) belief is widespread, leading to the use of protective blue eye amulets.',
    factArabic: 'الإيمان بالعين منتشر واسعاً في الثقافة العربية مما أدى إلى استخدام التمائم الزرقاء للحماية.',
    category: 'customs', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_016',
    fact: 'Offering and politely declining food several times before accepting is part of Arab hospitality customs.',
    factArabic: 'تقديم الطعام ورفضه بأدب مرات عدة قبل قبوله جزء من أعراف الضيافة العربية الأصيلة.',
    category: 'customs', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_017',
    fact: 'The forty-day period (arba\'een) of communal mourning is observed in many Arab communities.',
    factArabic: 'يُحيي كثير من المجتمعات العربية فترة الأربعين يوماً من الحداد الجماعي بعد وفاة أحد الأقارب.',
    category: 'customs', cefrLevel: 'B1', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_018',
    fact: 'Men often greet each other with three cheek kisses, a warm custom that varies by region.',
    factArabic: 'يتبادل الرجال تحية الخدود الثلاث عند اللقاء وهي عادة دافئة تتفاوت من منطقة إلى أخرى.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'ancient',
  },
  {
    id: 'trivia_cus_019',
    fact: 'The call to prayer (adhan) is sounded five times daily from mosque minarets across the Arab world.',
    factArabic: 'يُرفع الأذان خمس مرات يومياً من مآذن المساجد في أرجاء العالم العربي.',
    category: 'customs', cefrLevel: 'A1', region: 'Arabia', era: 'classical',
  },
  {
    id: 'trivia_cus_020',
    fact: 'Communal Friday lunches after prayer bring Arab families together in a weekly tradition.',
    factArabic: 'تجمع وجبة الغداء الجماعية بعد صلاة الجمعة العائلات العربية أسبوعياً في تقليد راسخ.',
    category: 'customs', cefrLevel: 'A2', region: 'Arabia', era: 'classical',
  },
];

// ── Selectors ──────────────────────────────────────────────────────────────

/**
 * Returns all trivia entries for a given category.
 * @param {string} category
 * @returns {Array}
 */
export function selectTriviaByCategory(category) {
  return CULTURAL_TRIVIA.filter(t => t.category === category);
}

/**
 * Returns `count` randomly selected trivia entries.
 * @param {number} count
 * @returns {Array}
 */
export function selectRandomTrivia(count) {
  const shuffled = [...CULTURAL_TRIVIA].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(0, count));
}

/**
 * Returns all trivia entries for a given era.
 * @param {string} era — 'ancient' | 'classical' | 'medieval' | 'modern' | 'contemporary'
 * @returns {Array}
 */
export function selectTriviaByEra(era) {
  return CULTURAL_TRIVIA.filter(t => t.era === era);
}
