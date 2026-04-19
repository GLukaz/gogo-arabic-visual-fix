/**
 * themedVocabSets.js
 *
 * 20 curated vocabulary groups for focused study.
 * Each set has 15-20 words with fun facts for engagement.
 *
 * Phase 90 (VOCAB-SETS)
 *
 * Schema:
 * {
 *   id:            string
 *   title:         string
 *   titleArabic:   string
 *   cefrLevel:     'A1'|'A2'|'B1'|'B2'
 *   description:   string
 *   words:         Array<{ arabic, english, transliteration, funFact? }>
 * }
 */

export const THEMED_VOCAB_SETS = [
  // 1. Animals
  {
    id: 'animals_set',
    title: 'Animals of the Arab World',
    titleArabic: 'حيوانات العالم العربي',
    cefrLevel: 'A1',
    description: 'Learn names of animals found across the Arab world',
    words: [
      { arabic: 'جمل', english: 'camel', transliteration: 'jamal', funFact: 'The Arabic word for beauty (jamaal) shares the same root as camel' },
      { arabic: 'حصان', english: 'horse', transliteration: 'hisaan', funFact: 'Arabian horses are among the oldest and most prized breeds in the world' },
      { arabic: 'قطة', english: 'cat', transliteration: 'qitta', funFact: 'Cats are highly revered in Arab and Islamic culture' },
      { arabic: 'كلب', english: 'dog', transliteration: 'kalb' },
      { arabic: 'أسد', english: 'lion', transliteration: 'asad', funFact: 'Assad means "lion" and is a common family name' },
      { arabic: 'ذئب', english: 'wolf', transliteration: 'dhi\'b' },
      { arabic: 'غزال', english: 'gazelle', transliteration: 'ghazaal', funFact: 'The English word "gazelle" comes directly from Arabic' },
      { arabic: 'نسر', english: 'eagle', transliteration: 'nasr', funFact: 'The eagle appears on many Arab national emblems' },
      { arabic: 'حمامة', english: 'dove', transliteration: 'hamaama' },
      { arabic: 'سمكة', english: 'fish', transliteration: 'samaka' },
      { arabic: 'بقرة', english: 'cow', transliteration: 'baqara', funFact: 'The second and longest chapter of the Quran is named Al-Baqara (The Cow)' },
      { arabic: 'خروف', english: 'sheep', transliteration: 'kharuuf' },
      { arabic: 'دجاجة', english: 'chicken', transliteration: 'dajaaja' },
      { arabic: 'فراشة', english: 'butterfly', transliteration: 'faraasha' },
      { arabic: 'نحلة', english: 'bee', transliteration: 'nahla', funFact: 'An entire Quran chapter (An-Nahl) is named after bees' },
      { arabic: 'ثعبان', english: 'snake', transliteration: 'thu\'baan' },
      { arabic: 'صقر', english: 'falcon', transliteration: 'saqr', funFact: 'Falconry is an ancient Arab tradition and a UNESCO heritage practice' },
    ],
  },

  // 2. Food & Cooking
  {
    id: 'food_cooking_set',
    title: 'Food & Cooking',
    titleArabic: 'الطعام والطبخ',
    cefrLevel: 'A1',
    description: 'Essential food vocabulary and cooking terms',
    words: [
      { arabic: 'خبز', english: 'bread', transliteration: 'khubz', funFact: 'Bread is sacred in Arab culture — it is never thrown away' },
      { arabic: 'أرز', english: 'rice', transliteration: 'aruzz' },
      { arabic: 'لحم', english: 'meat', transliteration: 'lahm' },
      { arabic: 'دجاج', english: 'chicken (meat)', transliteration: 'dajaaj' },
      { arabic: 'سمك', english: 'fish', transliteration: 'samak' },
      { arabic: 'بيض', english: 'eggs', transliteration: 'bayd' },
      { arabic: 'زيت', english: 'oil', transliteration: 'zayt', funFact: 'Olive oil (zayt zaytun) is mentioned in the Quran as blessed' },
      { arabic: 'ملح', english: 'salt', transliteration: 'milh' },
      { arabic: 'فلفل', english: 'pepper', transliteration: 'fulful' },
      { arabic: 'ثوم', english: 'garlic', transliteration: 'thuum' },
      { arabic: 'بصل', english: 'onion', transliteration: 'basal' },
      { arabic: 'طماطم', english: 'tomato', transliteration: 'tamaatim' },
      { arabic: 'حمص', english: 'chickpeas/hummus', transliteration: 'hummus', funFact: 'Hummus literally means "chickpeas" in Arabic' },
      { arabic: 'فلافل', english: 'falafel', transliteration: 'falaafil', funFact: 'The word falafel likely comes from the Arabic root for "pepper"' },
      { arabic: 'شاي', english: 'tea', transliteration: 'shaay' },
      { arabic: 'قهوة', english: 'coffee', transliteration: 'qahwa', funFact: 'The English word "coffee" derives from the Arabic qahwa' },
      { arabic: 'تمر', english: 'dates (fruit)', transliteration: 'tamr', funFact: 'Dates are traditionally used to break the Ramadan fast' },
    ],
  },

  // 3. Family & Relationships
  {
    id: 'family_set',
    title: 'Family & Relationships',
    titleArabic: 'العائلة والعلاقات',
    cefrLevel: 'A1',
    description: 'Family members and relationship terms',
    words: [
      { arabic: 'أب', english: 'father', transliteration: 'ab' },
      { arabic: 'أم', english: 'mother', transliteration: 'umm' },
      { arabic: 'ابن', english: 'son', transliteration: 'ibn', funFact: 'Ibn is used in Arabic names to mean "son of" — like Ibn Sina (son of Sina)' },
      { arabic: 'ابنة', english: 'daughter', transliteration: 'ibna' },
      { arabic: 'أخ', english: 'brother', transliteration: 'akh' },
      { arabic: 'أخت', english: 'sister', transliteration: 'ukht' },
      { arabic: 'جد', english: 'grandfather', transliteration: 'jadd' },
      { arabic: 'جدة', english: 'grandmother', transliteration: 'jadda' },
      { arabic: 'عم', english: 'paternal uncle', transliteration: '\'amm', funFact: 'Arabic has distinct words for paternal vs maternal uncles' },
      { arabic: 'خال', english: 'maternal uncle', transliteration: 'khaal' },
      { arabic: 'عمة', english: 'paternal aunt', transliteration: '\'amma' },
      { arabic: 'خالة', english: 'maternal aunt', transliteration: 'khaala' },
      { arabic: 'زوج', english: 'husband', transliteration: 'zawj' },
      { arabic: 'زوجة', english: 'wife', transliteration: 'zawja' },
      { arabic: 'صديق', english: 'friend (m)', transliteration: 'sadiiq' },
      { arabic: 'صديقة', english: 'friend (f)', transliteration: 'sadiiqa' },
      { arabic: 'جار', english: 'neighbor', transliteration: 'jaar', funFact: 'There is a famous saying: "Ask about the neighbor before the house"' },
    ],
  },

  // 4. Body & Health
  {
    id: 'body_health_set',
    title: 'Body & Health',
    titleArabic: 'الجسم والصحة',
    cefrLevel: 'A2',
    description: 'Body parts and health-related vocabulary',
    words: [
      { arabic: 'رأس', english: 'head', transliteration: 'ra\'s', funFact: 'Ra\'s is used in geography too — Ra\'s al-Khaimah means "top of the tent"' },
      { arabic: 'عين', english: 'eye', transliteration: '\'ayn', funFact: 'This word also means "spring (of water)" and "essence"' },
      { arabic: 'أنف', english: 'nose', transliteration: 'anf' },
      { arabic: 'فم', english: 'mouth', transliteration: 'fam' },
      { arabic: 'أذن', english: 'ear', transliteration: 'udhun' },
      { arabic: 'يد', english: 'hand', transliteration: 'yad' },
      { arabic: 'قدم', english: 'foot', transliteration: 'qadam' },
      { arabic: 'قلب', english: 'heart', transliteration: 'qalb', funFact: 'In Arabic, the heart is the seat of both emotion and intellect' },
      { arabic: 'ظهر', english: 'back', transliteration: 'dhahr' },
      { arabic: 'بطن', english: 'stomach', transliteration: 'batn' },
      { arabic: 'صحة', english: 'health', transliteration: 'sihha' },
      { arabic: 'مرض', english: 'illness', transliteration: 'marad' },
      { arabic: 'دواء', english: 'medicine', transliteration: 'dawaa\'' },
      { arabic: 'طبيب', english: 'doctor', transliteration: 'tabiib' },
      { arabic: 'مستشفى', english: 'hospital', transliteration: 'mustashfaa' },
    ],
  },

  // 5. Clothing & Fashion
  {
    id: 'clothing_set',
    title: 'Clothing & Fashion',
    titleArabic: 'الملابس والأزياء',
    cefrLevel: 'A2',
    description: 'Clothing items and fashion vocabulary',
    words: [
      { arabic: 'قميص', english: 'shirt', transliteration: 'qamiis' },
      { arabic: 'بنطلون', english: 'pants', transliteration: 'bantaluun' },
      { arabic: 'فستان', english: 'dress', transliteration: 'fustaan' },
      { arabic: 'حذاء', english: 'shoes', transliteration: 'hidhaa\'' },
      { arabic: 'معطف', english: 'coat', transliteration: 'mi\'taf' },
      { arabic: 'قبعة', english: 'hat', transliteration: 'qubba\'a' },
      { arabic: 'حجاب', english: 'hijab/veil', transliteration: 'hijaab', funFact: 'Hijab comes from the root h-j-b meaning "to cover" or "barrier"' },
      { arabic: 'ثوب', english: 'thobe/garment', transliteration: 'thawb', funFact: 'The traditional long white garment worn in Gulf countries' },
      { arabic: 'كوفية', english: 'keffiyeh', transliteration: 'kuufiyya', funFact: 'Named after the city of Kufa in Iraq' },
      { arabic: 'عباءة', english: 'abaya', transliteration: '\'abaaya' },
      { arabic: 'جلباب', english: 'jilbab/robe', transliteration: 'jilbaab' },
      { arabic: 'حزام', english: 'belt', transliteration: 'hizaam' },
      { arabic: 'خاتم', english: 'ring', transliteration: 'khaatam' },
      { arabic: 'ساعة', english: 'watch', transliteration: 'saa\'a' },
      { arabic: 'نظارة', english: 'glasses', transliteration: 'nadhaara' },
    ],
  },

  // 6. Home & Furniture
  {
    id: 'home_furniture_set',
    title: 'Home & Furniture',
    titleArabic: 'البيت والأثاث',
    cefrLevel: 'A1',
    description: 'Household items and furniture vocabulary',
    words: [
      { arabic: 'بيت', english: 'house', transliteration: 'bayt' },
      { arabic: 'غرفة', english: 'room', transliteration: 'ghurfa' },
      { arabic: 'مطبخ', english: 'kitchen', transliteration: 'matbakh' },
      { arabic: 'حمام', english: 'bathroom', transliteration: 'hammaam', funFact: 'The English word "hammam" (Turkish bath) comes from this Arabic root' },
      { arabic: 'سرير', english: 'bed', transliteration: 'sariir' },
      { arabic: 'كرسي', english: 'chair', transliteration: 'kursii' },
      { arabic: 'طاولة', english: 'table', transliteration: 'taawila' },
      { arabic: 'خزانة', english: 'closet/cabinet', transliteration: 'khizaana' },
      { arabic: 'مرآة', english: 'mirror', transliteration: 'mir\'aah' },
      { arabic: 'نافذة', english: 'window', transliteration: 'naafidha' },
      { arabic: 'باب', english: 'door', transliteration: 'baab', funFact: 'Bab is used in many place names — Bab al-Mandeb, Bab al-Shams' },
      { arabic: 'سلم', english: 'stairs/ladder', transliteration: 'sullam' },
      { arabic: 'سجادة', english: 'carpet', transliteration: 'sajjaada', funFact: 'The prayer rug is also called sajjaada (from sujuud — prostration)' },
      { arabic: 'مصباح', english: 'lamp', transliteration: 'misbaah' },
      { arabic: 'تلفاز', english: 'television', transliteration: 'tilfaaz' },
    ],
  },

  // 7. Weather & Seasons
  {
    id: 'weather_seasons_set',
    title: 'Weather & Seasons',
    titleArabic: 'الطقس والفصول',
    cefrLevel: 'A1',
    description: 'Weather conditions and seasonal vocabulary',
    words: [
      { arabic: 'شمس', english: 'sun', transliteration: 'shams', funFact: 'Shams is a common name meaning "sun" and is always feminine in Arabic' },
      { arabic: 'قمر', english: 'moon', transliteration: 'qamar', funFact: 'Qamar is masculine and used as a compliment for beauty' },
      { arabic: 'مطر', english: 'rain', transliteration: 'matar' },
      { arabic: 'ثلج', english: 'snow', transliteration: 'thalj' },
      { arabic: 'رياح', english: 'wind', transliteration: 'riyaah' },
      { arabic: 'سحاب', english: 'clouds', transliteration: 'sahaab' },
      { arabic: 'حار', english: 'hot', transliteration: 'haar' },
      { arabic: 'بارد', english: 'cold', transliteration: 'baarid' },
      { arabic: 'رطب', english: 'humid', transliteration: 'ratib' },
      { arabic: 'جاف', english: 'dry', transliteration: 'jaaf' },
      { arabic: 'ربيع', english: 'spring', transliteration: 'rabii\'', funFact: 'The "Arab Spring" uses this word — suggesting renewal and hope' },
      { arabic: 'صيف', english: 'summer', transliteration: 'sayf' },
      { arabic: 'خريف', english: 'autumn', transliteration: 'khariif' },
      { arabic: 'شتاء', english: 'winter', transliteration: 'shitaa\'' },
      { arabic: 'عاصفة', english: 'storm', transliteration: '\'aasifa' },
    ],
  },

  // 8. Transportation
  {
    id: 'transportation_set',
    title: 'Transportation',
    titleArabic: 'وسائل النقل',
    cefrLevel: 'A2',
    description: 'Vehicles and transportation vocabulary',
    words: [
      { arabic: 'سيارة', english: 'car', transliteration: 'sayyaara' },
      { arabic: 'حافلة', english: 'bus', transliteration: 'haafila' },
      { arabic: 'قطار', english: 'train', transliteration: 'qitaar' },
      { arabic: 'طائرة', english: 'airplane', transliteration: 'taa\'ira' },
      { arabic: 'سفينة', english: 'ship', transliteration: 'safiina' },
      { arabic: 'دراجة', english: 'bicycle', transliteration: 'darraaja' },
      { arabic: 'مترو', english: 'metro', transliteration: 'mitru' },
      { arabic: 'سيارة أجرة', english: 'taxi', transliteration: 'sayyaarat ujra' },
      { arabic: 'مطار', english: 'airport', transliteration: 'mataar' },
      { arabic: 'ميناء', english: 'port', transliteration: 'miinaa\'' },
      { arabic: 'محطة', english: 'station', transliteration: 'mahatta' },
      { arabic: 'طريق', english: 'road', transliteration: 'tariiq', funFact: 'Tariq is a popular name meaning "one who knocks at the door" or "path"' },
      { arabic: 'جسر', english: 'bridge', transliteration: 'jisr' },
      { arabic: 'نفق', english: 'tunnel', transliteration: 'nafaq' },
      { arabic: 'إشارة مرور', english: 'traffic light', transliteration: 'ishaarat muruur' },
    ],
  },

  // 9. Sports & Games
  {
    id: 'sports_games_set',
    title: 'Sports & Games',
    titleArabic: 'الرياضة والألعاب',
    cefrLevel: 'A2',
    description: 'Sports, games, and athletic vocabulary',
    words: [
      { arabic: 'كرة القدم', english: 'football/soccer', transliteration: 'kuratu al-qadam', funFact: 'Football is by far the most popular sport in the Arab world' },
      { arabic: 'كرة السلة', english: 'basketball', transliteration: 'kuratu as-salla' },
      { arabic: 'سباحة', english: 'swimming', transliteration: 'sibaaha' },
      { arabic: 'ركض', english: 'running', transliteration: 'rakd' },
      { arabic: 'ملاكمة', english: 'boxing', transliteration: 'mulaakama' },
      { arabic: 'مصارعة', english: 'wrestling', transliteration: 'musaara\'a' },
      { arabic: 'فريق', english: 'team', transliteration: 'fariiq' },
      { arabic: 'لاعب', english: 'player', transliteration: 'laa\'ib' },
      { arabic: 'حكم', english: 'referee', transliteration: 'hakam' },
      { arabic: 'هدف', english: 'goal', transliteration: 'hadaf' },
      { arabic: 'فوز', english: 'win/victory', transliteration: 'fawz' },
      { arabic: 'خسارة', english: 'loss/defeat', transliteration: 'khasaara' },
      { arabic: 'بطولة', english: 'championship', transliteration: 'butuula' },
      { arabic: 'شطرنج', english: 'chess', transliteration: 'shatranj', funFact: 'The word "checkmate" comes from Arabic shah mat (the king is dead)' },
      { arabic: 'سباق', english: 'race', transliteration: 'sibaaq' },
    ],
  },

  // 10. Music & Arts
  {
    id: 'music_arts_set',
    title: 'Music & Arts',
    titleArabic: 'الموسيقى والفنون',
    cefrLevel: 'B1',
    description: 'Musical instruments, art forms, and creative vocabulary',
    words: [
      { arabic: 'عود', english: 'oud', transliteration: '\'uud', funFact: 'The word "lute" comes from the Arabic al-\'uud' },
      { arabic: 'ناي', english: 'ney/flute', transliteration: 'naay' },
      { arabic: 'دف', english: 'tambourine', transliteration: 'duff' },
      { arabic: 'قانون', english: 'qanun (zither)', transliteration: 'qaanuun' },
      { arabic: 'طبل', english: 'drum', transliteration: 'tabl' },
      { arabic: 'أغنية', english: 'song', transliteration: 'ughniya' },
      { arabic: 'شعر', english: 'poetry', transliteration: 'shi\'r', funFact: 'Poetry is called "the register of the Arabs" (diwaan al-arab)' },
      { arabic: 'رسم', english: 'drawing/painting', transliteration: 'rasm' },
      { arabic: 'نحت', english: 'sculpture', transliteration: 'naht' },
      { arabic: 'خط', english: 'calligraphy', transliteration: 'khatt', funFact: 'Arabic calligraphy is a recognized UNESCO intangible heritage' },
      { arabic: 'مسرح', english: 'theater', transliteration: 'masrah' },
      { arabic: 'سينما', english: 'cinema', transliteration: 'siinamaa' },
      { arabic: 'فنان', english: 'artist', transliteration: 'fannaan' },
      { arabic: 'لحن', english: 'melody', transliteration: 'lahn' },
      { arabic: 'إيقاع', english: 'rhythm', transliteration: 'iiqaa\'' },
    ],
  },

  // 11. Emotions & Feelings
  {
    id: 'emotions_set',
    title: 'Emotions & Feelings',
    titleArabic: 'المشاعر والعواطف',
    cefrLevel: 'A2',
    description: 'Express how you feel in Arabic',
    words: [
      { arabic: 'سعيد', english: 'happy', transliteration: 'sa\'iid' },
      { arabic: 'حزين', english: 'sad', transliteration: 'haziim' },
      { arabic: 'غاضب', english: 'angry', transliteration: 'ghaadib' },
      { arabic: 'خائف', english: 'afraid', transliteration: 'khaa\'if' },
      { arabic: 'متفاجئ', english: 'surprised', transliteration: 'mutafaaji\'' },
      { arabic: 'متحمس', english: 'excited', transliteration: 'mutahammis' },
      { arabic: 'قلق', english: 'worried', transliteration: 'qaliq' },
      { arabic: 'فخور', english: 'proud', transliteration: 'fakhuur' },
      { arabic: 'خجول', english: 'shy', transliteration: 'khajuul' },
      { arabic: 'ممتن', english: 'grateful', transliteration: 'mumtann', funFact: 'Gratitude (shukr) is one of the most emphasized virtues in Arabic culture' },
      { arabic: 'وحيد', english: 'lonely', transliteration: 'wahiid' },
      { arabic: 'مرتاح', english: 'comfortable/relaxed', transliteration: 'murtaah' },
      { arabic: 'متعب', english: 'tired', transliteration: 'mut\'ab' },
      { arabic: 'محبط', english: 'frustrated', transliteration: 'muhbat' },
      { arabic: 'حب', english: 'love', transliteration: 'hubb', funFact: 'Arabic has over 50 words for different types and stages of love' },
    ],
  },

  // 12. Colors & Shapes
  {
    id: 'colors_shapes_set',
    title: 'Colors & Shapes',
    titleArabic: 'الألوان والأشكال',
    cefrLevel: 'A1',
    description: 'Colors, shapes, and visual descriptions',
    words: [
      { arabic: 'أحمر', english: 'red', transliteration: 'ahmar', funFact: 'Al-Hamra (the Red One) is the origin of "Alhambra" palace name' },
      { arabic: 'أزرق', english: 'blue', transliteration: 'azraq' },
      { arabic: 'أخضر', english: 'green', transliteration: 'akhdar', funFact: 'Green is a sacred color in Islam, associated with paradise' },
      { arabic: 'أصفر', english: 'yellow', transliteration: 'asfar' },
      { arabic: 'أبيض', english: 'white', transliteration: 'abyad' },
      { arabic: 'أسود', english: 'black', transliteration: 'aswad' },
      { arabic: 'برتقالي', english: 'orange', transliteration: 'burtuqaalii', funFact: 'Comes from burtuqaal (Portugal), where oranges came to the Arab world from' },
      { arabic: 'بنفسجي', english: 'purple', transliteration: 'banafsajii' },
      { arabic: 'دائرة', english: 'circle', transliteration: 'daa\'ira' },
      { arabic: 'مربع', english: 'square', transliteration: 'murabba\'' },
      { arabic: 'مثلث', english: 'triangle', transliteration: 'muthallath' },
      { arabic: 'مستطيل', english: 'rectangle', transliteration: 'mustatiil' },
      { arabic: 'نجمة', english: 'star (shape)', transliteration: 'najma' },
      { arabic: 'خط', english: 'line', transliteration: 'khatt' },
      { arabic: 'نقطة', english: 'point/dot', transliteration: 'nuqta' },
    ],
  },

  // 13. Numbers & Math
  {
    id: 'numbers_math_set',
    title: 'Numbers & Math',
    titleArabic: 'الأرقام والرياضيات',
    cefrLevel: 'A1',
    description: 'Numbers and basic mathematical terms',
    words: [
      { arabic: 'صفر', english: 'zero', transliteration: 'sifr', funFact: 'The concept of zero came to Europe from Arabic mathematics — "cipher" comes from sifr' },
      { arabic: 'واحد', english: 'one', transliteration: 'waahid' },
      { arabic: 'اثنان', english: 'two', transliteration: 'ithnaan' },
      { arabic: 'ثلاثة', english: 'three', transliteration: 'thalaatha' },
      { arabic: 'عشرة', english: 'ten', transliteration: '\'ashara' },
      { arabic: 'مئة', english: 'hundred', transliteration: 'mi\'a' },
      { arabic: 'ألف', english: 'thousand', transliteration: 'alf', funFact: 'Alf Layla wa Layla — One Thousand and One Nights' },
      { arabic: 'جمع', english: 'addition', transliteration: 'jam\'' },
      { arabic: 'طرح', english: 'subtraction', transliteration: 'tarh' },
      { arabic: 'ضرب', english: 'multiplication', transliteration: 'darb' },
      { arabic: 'قسمة', english: 'division', transliteration: 'qisma' },
      { arabic: 'نصف', english: 'half', transliteration: 'nisf' },
      { arabic: 'ربع', english: 'quarter', transliteration: 'rub\'' },
      { arabic: 'حساب', english: 'arithmetic/calculation', transliteration: 'hisaab' },
      { arabic: 'جبر', english: 'algebra', transliteration: 'jabr', funFact: 'The word "algebra" comes from the Arabic al-jabr, from al-Khwarizmi\'s famous book' },
      { arabic: 'خوارزمية', english: 'algorithm', transliteration: 'khawarizmiyya', funFact: 'Named after al-Khwarizmi, the father of algebra' },
    ],
  },

  // 14. Time & Calendar
  {
    id: 'time_calendar_set',
    title: 'Time & Calendar',
    titleArabic: 'الوقت والتقويم',
    cefrLevel: 'A1',
    description: 'Time expressions, days, and months',
    words: [
      { arabic: 'ساعة', english: 'hour/clock', transliteration: 'saa\'a' },
      { arabic: 'دقيقة', english: 'minute', transliteration: 'daqiiqa' },
      { arabic: 'ثانية', english: 'second', transliteration: 'thaaniya' },
      { arabic: 'صباح', english: 'morning', transliteration: 'sabaah' },
      { arabic: 'ظهر', english: 'noon', transliteration: 'dhuhr' },
      { arabic: 'مساء', english: 'evening', transliteration: 'masaa\'' },
      { arabic: 'ليل', english: 'night', transliteration: 'layl' },
      { arabic: 'أمس', english: 'yesterday', transliteration: 'ams' },
      { arabic: 'اليوم', english: 'today', transliteration: 'al-yawm' },
      { arabic: 'غداً', english: 'tomorrow', transliteration: 'ghadan' },
      { arabic: 'أسبوع', english: 'week', transliteration: 'usbuu\'' },
      { arabic: 'شهر', english: 'month', transliteration: 'shahr' },
      { arabic: 'سنة', english: 'year', transliteration: 'sana' },
      { arabic: 'رمضان', english: 'Ramadan', transliteration: 'ramadaan', funFact: 'From the root r-m-d meaning "scorching heat"' },
      { arabic: 'عيد', english: 'holiday/feast', transliteration: '\'iid', funFact: 'From the root meaning "to return" — a recurring celebration' },
    ],
  },

  // 15. Nature & Environment
  {
    id: 'nature_environment_set',
    title: 'Nature & Environment',
    titleArabic: 'الطبيعة والبيئة',
    cefrLevel: 'B1',
    description: 'Natural world and environmental terms',
    words: [
      { arabic: 'صحراء', english: 'desert', transliteration: 'sahraa\'' },
      { arabic: 'بحر', english: 'sea', transliteration: 'bahr' },
      { arabic: 'نهر', english: 'river', transliteration: 'nahr' },
      { arabic: 'جبل', english: 'mountain', transliteration: 'jabal', funFact: 'Gibraltar comes from Jabal Tariq (Mountain of Tariq)' },
      { arabic: 'واحة', english: 'oasis', transliteration: 'waaha' },
      { arabic: 'غابة', english: 'forest', transliteration: 'ghaaba' },
      { arabic: 'شجرة', english: 'tree', transliteration: 'shajara' },
      { arabic: 'زهرة', english: 'flower', transliteration: 'zahra' },
      { arabic: 'تربة', english: 'soil', transliteration: 'turba' },
      { arabic: 'هواء', english: 'air', transliteration: 'hawaa\'' },
      { arabic: 'بيئة', english: 'environment', transliteration: 'bii\'a' },
      { arabic: 'تلوث', english: 'pollution', transliteration: 'talawwuth' },
      { arabic: 'طاقة شمسية', english: 'solar energy', transliteration: 'taaqa shamsiyya' },
      { arabic: 'إعادة تدوير', english: 'recycling', transliteration: 'i\'aadat tadwiir' },
      { arabic: 'تغير المناخ', english: 'climate change', transliteration: 'taghayur al-munaakh' },
    ],
  },

  // 16. Technology
  {
    id: 'technology_set',
    title: 'Technology',
    titleArabic: 'التكنولوجيا',
    cefrLevel: 'B1',
    description: 'Modern technology and digital vocabulary',
    words: [
      { arabic: 'حاسوب', english: 'computer', transliteration: 'haasuub' },
      { arabic: 'هاتف ذكي', english: 'smartphone', transliteration: 'haatif dhakii' },
      { arabic: 'إنترنت', english: 'internet', transliteration: 'intarnit' },
      { arabic: 'بريد إلكتروني', english: 'email', transliteration: 'bariid ilikturuunii' },
      { arabic: 'موقع', english: 'website', transliteration: 'mawqi\'' },
      { arabic: 'تطبيق', english: 'application/app', transliteration: 'tatbiiq' },
      { arabic: 'شبكة', english: 'network', transliteration: 'shabaka' },
      { arabic: 'برنامج', english: 'program/software', transliteration: 'barnaamij' },
      { arabic: 'بيانات', english: 'data', transliteration: 'bayaanaat' },
      { arabic: 'ذكاء اصطناعي', english: 'artificial intelligence', transliteration: 'dhakaa\' istinaaa\'ii' },
      { arabic: 'طابعة', english: 'printer', transliteration: 'taabi\'a' },
      { arabic: 'شاشة', english: 'screen', transliteration: 'shaasha' },
      { arabic: 'لوحة مفاتيح', english: 'keyboard', transliteration: 'lawhat mafaatiih' },
      { arabic: 'كلمة مرور', english: 'password', transliteration: 'kalimat muruur' },
      { arabic: 'تحميل', english: 'download', transliteration: 'tahmiil' },
    ],
  },

  // 17. Professions
  {
    id: 'professions_set',
    title: 'Professions',
    titleArabic: 'المهن',
    cefrLevel: 'A2',
    description: 'Jobs and professional titles',
    words: [
      { arabic: 'معلم', english: 'teacher (m)', transliteration: 'mu\'allim' },
      { arabic: 'طبيب', english: 'doctor', transliteration: 'tabiib' },
      { arabic: 'مهندس', english: 'engineer', transliteration: 'muhandis', funFact: 'From the root h-n-d-s related to geometry and planning' },
      { arabic: 'محامي', english: 'lawyer', transliteration: 'muhaami' },
      { arabic: 'صحفي', english: 'journalist', transliteration: 'sahafii' },
      { arabic: 'تاجر', english: 'merchant', transliteration: 'taajir' },
      { arabic: 'مزارع', english: 'farmer', transliteration: 'muzaari\'' },
      { arabic: 'طباخ', english: 'cook/chef', transliteration: 'tabbaakh' },
      { arabic: 'سائق', english: 'driver', transliteration: 'saa\'iq' },
      { arabic: 'ممرض', english: 'nurse (m)', transliteration: 'mumarrid' },
      { arabic: 'فنان', english: 'artist', transliteration: 'fannaan' },
      { arabic: 'كاتب', english: 'writer', transliteration: 'kaatib' },
      { arabic: 'مترجم', english: 'translator', transliteration: 'mutarjim' },
      { arabic: 'عالم', english: 'scientist/scholar', transliteration: '\'aalim', funFact: 'The plural ulama refers to Islamic scholars' },
      { arabic: 'رائد فضاء', english: 'astronaut', transliteration: 'raa\'id fadaa\'' },
    ],
  },

  // 18. Geography
  {
    id: 'geography_set',
    title: 'Geography',
    titleArabic: 'الجغرافيا',
    cefrLevel: 'B1',
    description: 'Geographic terms and Arab world geography',
    words: [
      { arabic: 'قارة', english: 'continent', transliteration: 'qaarra' },
      { arabic: 'دولة', english: 'country/state', transliteration: 'dawla' },
      { arabic: 'مدينة', english: 'city', transliteration: 'madiina', funFact: 'Medina literally means "city" — the city of the Prophet' },
      { arabic: 'قرية', english: 'village', transliteration: 'qarya' },
      { arabic: 'شمال', english: 'north', transliteration: 'shamaal' },
      { arabic: 'جنوب', english: 'south', transliteration: 'januub' },
      { arabic: 'شرق', english: 'east', transliteration: 'sharq', funFact: 'The Levant/Middle East is called al-Sharq al-Awsat' },
      { arabic: 'غرب', english: 'west', transliteration: 'gharb', funFact: 'The Maghreb (North Africa) means "place of sunset" — the west' },
      { arabic: 'جزيرة', english: 'island/peninsula', transliteration: 'jaziira', funFact: 'Al-Jazeera (the TV network) means "the island/peninsula"' },
      { arabic: 'خليج', english: 'gulf', transliteration: 'khaliij' },
      { arabic: 'مضيق', english: 'strait', transliteration: 'madiiq' },
      { arabic: 'حدود', english: 'borders', transliteration: 'huduud' },
      { arabic: 'عاصمة', english: 'capital', transliteration: '\'aasima' },
      { arabic: 'سكان', english: 'population', transliteration: 'sukkaan' },
      { arabic: 'خريطة', english: 'map', transliteration: 'khariita' },
    ],
  },

  // 19. Religion & Spirituality
  {
    id: 'religion_spirituality_set',
    title: 'Religion & Spirituality',
    titleArabic: 'الدين والروحانية',
    cefrLevel: 'B1',
    description: 'Religious and spiritual vocabulary',
    words: [
      { arabic: 'مسجد', english: 'mosque', transliteration: 'masjid', funFact: 'From the root s-j-d meaning "to prostrate" — a place of prostration' },
      { arabic: 'كنيسة', english: 'church', transliteration: 'kaniisa' },
      { arabic: 'صلاة', english: 'prayer', transliteration: 'salaat' },
      { arabic: 'صيام', english: 'fasting', transliteration: 'siyaam' },
      { arabic: 'حج', english: 'pilgrimage', transliteration: 'hajj' },
      { arabic: 'زكاة', english: 'alms/charity', transliteration: 'zakaat', funFact: 'Literally means "purification" — purifying wealth through giving' },
      { arabic: 'دعاء', english: 'supplication', transliteration: 'du\'aa\'' },
      { arabic: 'إيمان', english: 'faith', transliteration: 'iimaan' },
      { arabic: 'رحمة', english: 'mercy', transliteration: 'rahma', funFact: 'One of the most repeated divine attributes: ar-Rahman ar-Rahim' },
      { arabic: 'سلام', english: 'peace', transliteration: 'salaam', funFact: 'Related to Islam (submission) and Muslim — all from the root s-l-m' },
      { arabic: 'روح', english: 'soul/spirit', transliteration: 'ruuh' },
      { arabic: 'تأمل', english: 'meditation/contemplation', transliteration: 'ta\'ammul' },
      { arabic: 'حكمة', english: 'wisdom', transliteration: 'hikma' },
      { arabic: 'شكر', english: 'gratitude', transliteration: 'shukr' },
      { arabic: 'توبة', english: 'repentance', transliteration: 'tawba' },
    ],
  },

  // 20. Academic Arabic
  {
    id: 'academic_set',
    title: 'Academic Arabic',
    titleArabic: 'العربية الأكاديمية',
    cefrLevel: 'B2',
    description: 'Advanced vocabulary for academic and scholarly discourse',
    words: [
      { arabic: 'بحث', english: 'research', transliteration: 'bahth' },
      { arabic: 'دراسة', english: 'study', transliteration: 'diraasa' },
      { arabic: 'نظرية', english: 'theory', transliteration: 'nazhariyya' },
      { arabic: 'فرضية', english: 'hypothesis', transliteration: 'fardiyya' },
      { arabic: 'منهج', english: 'methodology', transliteration: 'manhaj' },
      { arabic: 'تحليل', english: 'analysis', transliteration: 'tahliil' },
      { arabic: 'نتيجة', english: 'result/conclusion', transliteration: 'natiija' },
      { arabic: 'مصدر', english: 'source', transliteration: 'masdar', funFact: 'In grammar, masdar also means "verbal noun" — a fundamental Arabic concept' },
      { arabic: 'مرجع', english: 'reference', transliteration: 'marji\'' },
      { arabic: 'مقال', english: 'article/essay', transliteration: 'maqaal' },
      { arabic: 'أطروحة', english: 'thesis/dissertation', transliteration: 'utruuha' },
      { arabic: 'مؤتمر', english: 'conference', transliteration: 'mu\'tamar' },
      { arabic: 'محاضرة', english: 'lecture', transliteration: 'muhaadara' },
      { arabic: 'اقتباس', english: 'quotation/citation', transliteration: 'iqtibaas' },
      { arabic: 'ملخص', english: 'summary/abstract', transliteration: 'mulakhkhas' },
      { arabic: 'استنتاج', english: 'deduction/inference', transliteration: 'istintaaj' },
    ],
  },
];

// ============================================================
// Helper functions
// ============================================================

export function getVocabSetById(id) {
  return THEMED_VOCAB_SETS.find(s => s.id === id) || null;
}

export function getVocabSetsByCefrLevel(level) {
  if (!level) return THEMED_VOCAB_SETS;
  return THEMED_VOCAB_SETS.filter(s => s.cefrLevel === level);
}

export function getAllVocabSetIds() {
  return THEMED_VOCAB_SETS.map(s => s.id);
}

export function getVocabSetCount() {
  return THEMED_VOCAB_SETS.length;
}
