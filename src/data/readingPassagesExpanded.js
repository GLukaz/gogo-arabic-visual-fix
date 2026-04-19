/**
 * readingPassagesExpanded.js
 *
 * 40 additional graded Arabic reading passages across CEFR A1-B2 (10 per level).
 * Covers topics NOT in the original 60 passages from Phase 82.
 *
 * Phase 90 (READ-EXPAND)
 *
 * Schema matches readingPassages.js:
 * {
 *   id:                    string   — e.g. 'exp_rp_a1_001'
 *   title:                 string   — English title
 *   titleArabic:           string   — Arabic title
 *   cefrLevel:             'A1'|'A2'|'B1'|'B2'
 *   topic:                 string
 *   textArabic:            string   — The Arabic passage
 *   textEnglish:           string   — English translation
 *   vocabularyHighlights:  Array<{ wordId, arabic, english, transliteration }>
 *   questions:             Array<{ id, type, question, questionArabic, options, correctIndex }>
 *   wordCount:             number
 * }
 */

// ============================================================
// A1 PASSAGES — 10 entries
// Animals, weather, school, time, hobbies, playground,
// morning routine, my room, pets, counting things
// ============================================================

const A1_EXPANDED = [
  // 1. Animals
  {
    id: 'exp_rp_a1_001',
    title: 'Animals on the Farm',
    titleArabic: 'حيوانات في المزرعة',
    cefrLevel: 'A1',
    topic: 'animals',
    textArabic: 'في المزرعة حيوانات كثيرة. هناك بقرة كبيرة وخروف صغير. الدجاجة تبيض كل يوم. الحصان سريع وجميل. أحب الحيوانات.',
    textEnglish: 'On the farm there are many animals. There is a big cow and a small sheep. The hen lays eggs every day. The horse is fast and beautiful. I love animals.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v001', arabic: 'مزرعة', english: 'farm', transliteration: 'mazra\'a' },
      { wordId: 'exp_rp_v002', arabic: 'بقرة', english: 'cow', transliteration: 'baqara' },
      { wordId: 'exp_rp_v003', arabic: 'خروف', english: 'sheep', transliteration: 'kharuuf' },
      { wordId: 'exp_rp_v004', arabic: 'دجاجة', english: 'hen', transliteration: 'dajaaja' },
      { wordId: 'exp_rp_v005', arabic: 'حصان', english: 'horse', transliteration: 'hisaan' },
    ],
    questions: [
      { id: 'exp_rp_a1_001_q1', type: 'multiple_choice', question: 'Where are the animals?', questionArabic: 'أين الحيوانات؟', options: ['In the zoo', 'On the farm', 'In the house', 'At school'], correctIndex: 1 },
      { id: 'exp_rp_a1_001_q2', type: 'true_false', question: 'The sheep is big.', questionArabic: 'الخروف كبير.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a1_001_q3', type: 'multiple_choice', question: 'What does the hen do every day?', questionArabic: 'ماذا تفعل الدجاجة كل يوم؟', options: ['Runs', 'Lays eggs', 'Sleeps', 'Eats'], correctIndex: 1 },
    ],
    wordCount: 28,
  },

  // 2. Weather
  {
    id: 'exp_rp_a1_002',
    title: 'The Weather Today',
    titleArabic: 'الطقس اليوم',
    cefrLevel: 'A1',
    topic: 'weather',
    textArabic: 'اليوم الجو بارد. السماء ملبدة بالغيوم. المطر ينزل. أحتاج إلى مظلة ومعطف. أحب المطر.',
    textEnglish: 'Today the weather is cold. The sky is cloudy. The rain is falling. I need an umbrella and a coat. I love the rain.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v006', arabic: 'بارد', english: 'cold', transliteration: 'baarid' },
      { wordId: 'exp_rp_v007', arabic: 'غيوم', english: 'clouds', transliteration: 'ghuyuum' },
      { wordId: 'exp_rp_v008', arabic: 'مطر', english: 'rain', transliteration: 'matar' },
      { wordId: 'exp_rp_v009', arabic: 'مظلة', english: 'umbrella', transliteration: 'midhalla' },
      { wordId: 'exp_rp_v010', arabic: 'معطف', english: 'coat', transliteration: 'mi\'taf' },
    ],
    questions: [
      { id: 'exp_rp_a1_002_q1', type: 'multiple_choice', question: 'How is the weather?', questionArabic: 'كيف الطقس؟', options: ['Hot', 'Cold', 'Warm', 'Windy'], correctIndex: 1 },
      { id: 'exp_rp_a1_002_q2', type: 'true_false', question: 'The sky is clear.', questionArabic: 'السماء صافية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a1_002_q3', type: 'multiple_choice', question: 'What does the speaker need?', questionArabic: 'ماذا يحتاج المتحدث؟', options: ['Sunglasses', 'An umbrella', 'A hat', 'Sandals'], correctIndex: 1 },
    ],
    wordCount: 24,
  },

  // 3. School
  {
    id: 'exp_rp_a1_003',
    title: 'In the Classroom',
    titleArabic: 'في الفصل',
    cefrLevel: 'A1',
    topic: 'school',
    textArabic: 'في الفصل ثلاثون طالباً. المعلمة تكتب على السبورة. نحن ندرس الحساب. أحب مادة العلوم أيضاً. المدرسة ممتعة.',
    textEnglish: 'In the classroom there are thirty students. The teacher writes on the board. We study math. I also love science. School is fun.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v011', arabic: 'فصل', english: 'classroom', transliteration: 'fasl' },
      { wordId: 'exp_rp_v012', arabic: 'سبورة', english: 'board', transliteration: 'sabbuura' },
      { wordId: 'exp_rp_v013', arabic: 'حساب', english: 'math', transliteration: 'hisaab' },
      { wordId: 'exp_rp_v014', arabic: 'علوم', english: 'science', transliteration: '\'uluum' },
    ],
    questions: [
      { id: 'exp_rp_a1_003_q1', type: 'multiple_choice', question: 'How many students are in the classroom?', questionArabic: 'كم طالباً في الفصل؟', options: ['Twenty', 'Thirty', 'Forty', 'Ten'], correctIndex: 1 },
      { id: 'exp_rp_a1_003_q2', type: 'true_false', question: 'The teacher writes on paper.', questionArabic: 'المعلمة تكتب على الورق.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a1_003_q3', type: 'multiple_choice', question: 'What subject does the speaker also love?', questionArabic: 'ما المادة التي يحبها المتحدث أيضاً؟', options: ['History', 'Science', 'Arabic', 'Art'], correctIndex: 1 },
    ],
    wordCount: 26,
  },

  // 4. Time
  {
    id: 'exp_rp_a1_004',
    title: 'What Time Is It?',
    titleArabic: 'كم الساعة؟',
    cefrLevel: 'A1',
    topic: 'time',
    textArabic: 'الساعة السابعة صباحاً. أستيقظ باكراً. في الساعة الثامنة أذهب إلى المدرسة. أرجع البيت في الساعة الثالثة. أنام في الساعة التاسعة مساءً.',
    textEnglish: 'It is seven in the morning. I wake up early. At eight I go to school. I come home at three. I sleep at nine in the evening.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v015', arabic: 'ساعة', english: 'hour/clock', transliteration: 'saa\'a' },
      { wordId: 'exp_rp_v016', arabic: 'صباحاً', english: 'in the morning', transliteration: 'sabaahan' },
      { wordId: 'exp_rp_v017', arabic: 'مساءً', english: 'in the evening', transliteration: 'masaa\'an' },
      { wordId: 'exp_rp_v018', arabic: 'باكراً', english: 'early', transliteration: 'baakiran' },
    ],
    questions: [
      { id: 'exp_rp_a1_004_q1', type: 'multiple_choice', question: 'What time does the speaker wake up?', questionArabic: 'متى يستيقظ المتحدث؟', options: ['Six', 'Seven', 'Eight', 'Nine'], correctIndex: 1 },
      { id: 'exp_rp_a1_004_q2', type: 'multiple_choice', question: 'What time does the speaker go to school?', questionArabic: 'متى يذهب المتحدث إلى المدرسة؟', options: ['Seven', 'Eight', 'Nine', 'Ten'], correctIndex: 1 },
      { id: 'exp_rp_a1_004_q3', type: 'true_false', question: 'The speaker sleeps at ten.', questionArabic: 'ينام المتحدث في الساعة العاشرة.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 30,
  },

  // 5. Hobbies
  {
    id: 'exp_rp_a1_005',
    title: 'My Hobbies',
    titleArabic: 'هواياتي',
    cefrLevel: 'A1',
    topic: 'hobbies',
    textArabic: 'عندي هوايات كثيرة. أحب الرسم والقراءة. ألعب كرة القدم مع أصدقائي. أحب أيضاً السباحة. الهوايات ممتعة.',
    textEnglish: 'I have many hobbies. I love drawing and reading. I play football with my friends. I also love swimming. Hobbies are fun.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v019', arabic: 'هوايات', english: 'hobbies', transliteration: 'hiwaayaat' },
      { wordId: 'exp_rp_v020', arabic: 'رسم', english: 'drawing', transliteration: 'rasm' },
      { wordId: 'exp_rp_v021', arabic: 'قراءة', english: 'reading', transliteration: 'qiraa\'a' },
      { wordId: 'exp_rp_v022', arabic: 'سباحة', english: 'swimming', transliteration: 'sibaaha' },
    ],
    questions: [
      { id: 'exp_rp_a1_005_q1', type: 'multiple_choice', question: 'What sport does the speaker play?', questionArabic: 'ما الرياضة التي يلعبها المتحدث؟', options: ['Basketball', 'Tennis', 'Football', 'Volleyball'], correctIndex: 2 },
      { id: 'exp_rp_a1_005_q2', type: 'true_false', question: 'The speaker likes drawing.', questionArabic: 'يحب المتحدث الرسم.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_a1_005_q3', type: 'multiple_choice', question: 'Who does the speaker play football with?', questionArabic: 'مع من يلعب المتحدث كرة القدم؟', options: ['Brothers', 'Parents', 'Friends', 'Teachers'], correctIndex: 2 },
    ],
    wordCount: 24,
  },

  // 6. Playground
  {
    id: 'exp_rp_a1_006',
    title: 'At the Playground',
    titleArabic: 'في الملعب',
    cefrLevel: 'A1',
    topic: 'playground',
    textArabic: 'الأطفال يلعبون في الملعب. هناك أرجوحة ومنزلق. أنا أركض مع أصدقائي. نحن سعداء. الملعب كبير وجميل.',
    textEnglish: 'The children are playing in the playground. There is a swing and a slide. I run with my friends. We are happy. The playground is big and beautiful.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v023', arabic: 'ملعب', english: 'playground', transliteration: 'mal\'ab' },
      { wordId: 'exp_rp_v024', arabic: 'أرجوحة', english: 'swing', transliteration: 'urjuuha' },
      { wordId: 'exp_rp_v025', arabic: 'منزلق', english: 'slide', transliteration: 'munzalaq' },
      { wordId: 'exp_rp_v026', arabic: 'أركض', english: 'I run', transliteration: 'arkud' },
    ],
    questions: [
      { id: 'exp_rp_a1_006_q1', type: 'multiple_choice', question: 'Where are the children?', questionArabic: 'أين الأطفال؟', options: ['At school', 'At the playground', 'At home', 'In the garden'], correctIndex: 1 },
      { id: 'exp_rp_a1_006_q2', type: 'true_false', question: 'The playground is small.', questionArabic: 'الملعب صغير.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a1_006_q3', type: 'multiple_choice', question: 'How are the children feeling?', questionArabic: 'كيف يشعر الأطفال؟', options: ['Tired', 'Sad', 'Happy', 'Hungry'], correctIndex: 2 },
    ],
    wordCount: 26,
  },

  // 7. Morning Routine
  {
    id: 'exp_rp_a1_007',
    title: 'My Morning Routine',
    titleArabic: 'روتيني الصباحي',
    cefrLevel: 'A1',
    topic: 'morning_routine',
    textArabic: 'أستيقظ في الصباح الباكر. أغسل وجهي وأنظف أسناني. ألبس ملابسي وأتناول الفطور. أشرب الحليب وآكل البيض. ثم أذهب إلى المدرسة.',
    textEnglish: 'I wake up early in the morning. I wash my face and brush my teeth. I put on my clothes and eat breakfast. I drink milk and eat eggs. Then I go to school.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v027', arabic: 'أستيقظ', english: 'I wake up', transliteration: 'astayqidh' },
      { wordId: 'exp_rp_v028', arabic: 'أسنان', english: 'teeth', transliteration: 'asnaan' },
      { wordId: 'exp_rp_v029', arabic: 'ملابس', english: 'clothes', transliteration: 'malaabis' },
      { wordId: 'exp_rp_v030', arabic: 'فطور', english: 'breakfast', transliteration: 'futuor' },
    ],
    questions: [
      { id: 'exp_rp_a1_007_q1', type: 'multiple_choice', question: 'What does the speaker wash first?', questionArabic: 'ماذا يغسل المتحدث أولاً؟', options: ['Hands', 'Face', 'Hair', 'Feet'], correctIndex: 1 },
      { id: 'exp_rp_a1_007_q2', type: 'true_false', question: 'The speaker drinks juice for breakfast.', questionArabic: 'يشرب المتحدث العصير في الفطور.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a1_007_q3', type: 'multiple_choice', question: 'Where does the speaker go after breakfast?', questionArabic: 'أين يذهب المتحدث بعد الفطور؟', options: ['To the park', 'To school', 'To the shop', 'To bed'], correctIndex: 1 },
    ],
    wordCount: 30,
  },

  // 8. My Room
  {
    id: 'exp_rp_a1_008',
    title: 'My Room',
    titleArabic: 'غرفتي',
    cefrLevel: 'A1',
    topic: 'my_room',
    textArabic: 'غرفتي صغيرة ونظيفة. فيها سرير ومكتب وكرسي. على المكتب كتبي وأقلامي. الجدار أزرق. أحب غرفتي كثيراً.',
    textEnglish: 'My room is small and clean. It has a bed, a desk, and a chair. On the desk are my books and pens. The wall is blue. I love my room very much.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v031', arabic: 'غرفة', english: 'room', transliteration: 'ghurfa' },
      { wordId: 'exp_rp_v032', arabic: 'سرير', english: 'bed', transliteration: 'sariir' },
      { wordId: 'exp_rp_v033', arabic: 'مكتب', english: 'desk', transliteration: 'maktab' },
      { wordId: 'exp_rp_v034', arabic: 'جدار', english: 'wall', transliteration: 'jidaar' },
    ],
    questions: [
      { id: 'exp_rp_a1_008_q1', type: 'multiple_choice', question: 'How is the room described?', questionArabic: 'كيف وصفت الغرفة؟', options: ['Big and messy', 'Small and clean', 'Big and clean', 'Small and dark'], correctIndex: 1 },
      { id: 'exp_rp_a1_008_q2', type: 'true_false', question: 'The wall is green.', questionArabic: 'الجدار أخضر.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a1_008_q3', type: 'multiple_choice', question: 'What is on the desk?', questionArabic: 'ماذا على المكتب؟', options: ['Toys', 'Food', 'Books and pens', 'Clothes'], correctIndex: 2 },
    ],
    wordCount: 26,
  },

  // 9. Pets
  {
    id: 'exp_rp_a1_009',
    title: 'My Pet Cat',
    titleArabic: 'قطتي',
    cefrLevel: 'A1',
    topic: 'pets',
    textArabic: 'عندي قطة اسمها لولو. هي بيضاء وصغيرة. تحب الحليب والسمك. تنام كثيراً. ألعب معها كل يوم. أحب قطتي.',
    textEnglish: 'I have a cat named Lulu. She is white and small. She loves milk and fish. She sleeps a lot. I play with her every day. I love my cat.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v035', arabic: 'قطة', english: 'cat', transliteration: 'qitta' },
      { wordId: 'exp_rp_v036', arabic: 'بيضاء', english: 'white (f)', transliteration: 'baydaa\'' },
      { wordId: 'exp_rp_v037', arabic: 'سمك', english: 'fish', transliteration: 'samak' },
      { wordId: 'exp_rp_v038', arabic: 'تنام', english: 'she sleeps', transliteration: 'tanaam' },
    ],
    questions: [
      { id: 'exp_rp_a1_009_q1', type: 'multiple_choice', question: 'What is the cat\'s name?', questionArabic: 'ما اسم القطة؟', options: ['Mimi', 'Lulu', 'Nana', 'Kiki'], correctIndex: 1 },
      { id: 'exp_rp_a1_009_q2', type: 'true_false', question: 'The cat is big and black.', questionArabic: 'القطة كبيرة وسوداء.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a1_009_q3', type: 'multiple_choice', question: 'What does the cat love to eat?', questionArabic: 'ماذا تحب القطة أن تأكل؟', options: ['Bread', 'Chicken', 'Fish', 'Rice'], correctIndex: 2 },
    ],
    wordCount: 28,
  },

  // 10. Counting Things
  {
    id: 'exp_rp_a1_010',
    title: 'Counting Things Around Me',
    titleArabic: 'أعد الأشياء حولي',
    cefrLevel: 'A1',
    topic: 'counting',
    textArabic: 'في حقيبتي ثلاثة كتب وخمسة أقلام. على الطاولة أربعة أكواب. في الصف عشرون كرسياً. عندي إصبعان عشرة في يدي.',
    textEnglish: 'In my bag there are three books and five pens. On the table there are four cups. In the class there are twenty chairs. I have ten fingers on my hands.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v039', arabic: 'حقيبة', english: 'bag', transliteration: 'haqiiba' },
      { wordId: 'exp_rp_v040', arabic: 'طاولة', english: 'table', transliteration: 'taawila' },
      { wordId: 'exp_rp_v041', arabic: 'أكواب', english: 'cups', transliteration: 'akwaab' },
      { wordId: 'exp_rp_v042', arabic: 'كرسي', english: 'chair', transliteration: 'kursii' },
    ],
    questions: [
      { id: 'exp_rp_a1_010_q1', type: 'multiple_choice', question: 'How many books are in the bag?', questionArabic: 'كم كتاباً في الحقيبة؟', options: ['Two', 'Three', 'Four', 'Five'], correctIndex: 1 },
      { id: 'exp_rp_a1_010_q2', type: 'true_false', question: 'There are six cups on the table.', questionArabic: 'على الطاولة ستة أكواب.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a1_010_q3', type: 'multiple_choice', question: 'How many chairs are in the class?', questionArabic: 'كم كرسياً في الصف؟', options: ['Ten', 'Fifteen', 'Twenty', 'Thirty'], correctIndex: 2 },
    ],
    wordCount: 26,
  },
];

// ============================================================
// A2 PASSAGES — 10 entries
// Restaurant, doctor, transportation, phone, letter writing,
// market haggling, cooking, job interview, hotel, sports day
// ============================================================

const A2_EXPANDED = [
  // 1. Restaurant Ordering
  {
    id: 'exp_rp_a2_001',
    title: 'At the Restaurant',
    titleArabic: 'في المطعم',
    cefrLevel: 'A2',
    topic: 'restaurant',
    textArabic: 'ذهبت إلى المطعم مع عائلتي. طلبت دجاجاً مشوياً مع أرز. طلب أبي سمكاً وطلبت أمي سلطة. كان الطعام لذيذاً جداً. دفعنا الحساب وشكرنا النادل.',
    textEnglish: 'I went to the restaurant with my family. I ordered grilled chicken with rice. My father ordered fish and my mother ordered salad. The food was very delicious. We paid the bill and thanked the waiter.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v043', arabic: 'مطعم', english: 'restaurant', transliteration: 'mat\'am' },
      { wordId: 'exp_rp_v044', arabic: 'مشوي', english: 'grilled', transliteration: 'mashwii' },
      { wordId: 'exp_rp_v045', arabic: 'لذيذ', english: 'delicious', transliteration: 'ladhiidh' },
      { wordId: 'exp_rp_v046', arabic: 'حساب', english: 'bill', transliteration: 'hisaab' },
      { wordId: 'exp_rp_v047', arabic: 'نادل', english: 'waiter', transliteration: 'naadil' },
    ],
    questions: [
      { id: 'exp_rp_a2_001_q1', type: 'multiple_choice', question: 'Who did the speaker go with?', questionArabic: 'مع من ذهب المتحدث؟', options: ['Friends', 'Family', 'Alone', 'Colleagues'], correctIndex: 1 },
      { id: 'exp_rp_a2_001_q2', type: 'multiple_choice', question: 'What did the speaker order?', questionArabic: 'ماذا طلب المتحدث؟', options: ['Fish', 'Salad', 'Grilled chicken with rice', 'Pizza'], correctIndex: 2 },
      { id: 'exp_rp_a2_001_q3', type: 'true_false', question: 'The food was not delicious.', questionArabic: 'الطعام لم يكن لذيذاً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a2_001_q4', type: 'multiple_choice', question: 'What did the mother order?', questionArabic: 'ماذا طلبت الأم؟', options: ['Chicken', 'Fish', 'Salad', 'Soup'], correctIndex: 2 },
    ],
    wordCount: 32,
  },

  // 2. At the Doctor
  {
    id: 'exp_rp_a2_002',
    title: 'Visiting the Doctor',
    titleArabic: 'زيارة الطبيب',
    cefrLevel: 'A2',
    topic: 'doctor',
    textArabic: 'شعرت بألم في رأسي وحرارة عالية. ذهبت إلى الطبيب. فحصني الطبيب وأعطاني دواءً. قال لي أن أشرب ماءً كثيراً وأنام جيداً. بعد يومين شعرت بتحسن.',
    textEnglish: 'I felt pain in my head and had a high temperature. I went to the doctor. The doctor examined me and gave me medicine. He told me to drink lots of water and sleep well. After two days I felt better.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v048', arabic: 'ألم', english: 'pain', transliteration: 'alam' },
      { wordId: 'exp_rp_v049', arabic: 'حرارة', english: 'temperature/fever', transliteration: 'haraara' },
      { wordId: 'exp_rp_v050', arabic: 'طبيب', english: 'doctor', transliteration: 'tabiib' },
      { wordId: 'exp_rp_v051', arabic: 'دواء', english: 'medicine', transliteration: 'dawaa\'' },
      { wordId: 'exp_rp_v052', arabic: 'تحسن', english: 'improvement', transliteration: 'tahassun' },
    ],
    questions: [
      { id: 'exp_rp_a2_002_q1', type: 'multiple_choice', question: 'What symptoms did the speaker have?', questionArabic: 'ما الأعراض التي شعر بها المتحدث؟', options: ['Stomach ache', 'Headache and fever', 'Back pain', 'Cough'], correctIndex: 1 },
      { id: 'exp_rp_a2_002_q2', type: 'true_false', question: 'The doctor gave the speaker medicine.', questionArabic: 'أعطى الطبيب المتحدث دواءً.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_a2_002_q3', type: 'multiple_choice', question: 'How long until the speaker felt better?', questionArabic: 'بعد كم يوم شعر المتحدث بتحسن؟', options: ['One day', 'Two days', 'Three days', 'A week'], correctIndex: 1 },
    ],
    wordCount: 34,
  },

  // 3. Transportation
  {
    id: 'exp_rp_a2_003',
    title: 'Getting Around the City',
    titleArabic: 'التنقل في المدينة',
    cefrLevel: 'A2',
    topic: 'transportation',
    textArabic: 'أستخدم الحافلة للذهاب إلى العمل كل يوم. أحياناً آخذ سيارة أجرة إذا تأخرت. المترو سريع لكنه مزدحم في الصباح. أحب المشي عندما يكون الطقس جميلاً.',
    textEnglish: 'I use the bus to go to work every day. Sometimes I take a taxi if I am late. The metro is fast but crowded in the morning. I like walking when the weather is nice.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v053', arabic: 'حافلة', english: 'bus', transliteration: 'haafila' },
      { wordId: 'exp_rp_v054', arabic: 'سيارة أجرة', english: 'taxi', transliteration: 'sayyaarat ujra' },
      { wordId: 'exp_rp_v055', arabic: 'مترو', english: 'metro', transliteration: 'mitru' },
      { wordId: 'exp_rp_v056', arabic: 'مزدحم', english: 'crowded', transliteration: 'muzdahim' },
    ],
    questions: [
      { id: 'exp_rp_a2_003_q1', type: 'multiple_choice', question: 'What does the speaker usually use?', questionArabic: 'ماذا يستخدم المتحدث عادةً؟', options: ['A car', 'The bus', 'The metro', 'A bicycle'], correctIndex: 1 },
      { id: 'exp_rp_a2_003_q2', type: 'true_false', question: 'The metro is slow.', questionArabic: 'المترو بطيء.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a2_003_q3', type: 'multiple_choice', question: 'When does the speaker take a taxi?', questionArabic: 'متى يأخذ المتحدث سيارة أجرة؟', options: ['Every day', 'When late', 'On weekends', 'Never'], correctIndex: 1 },
    ],
    wordCount: 32,
  },

  // 4. Phone Conversation
  {
    id: 'exp_rp_a2_004',
    title: 'A Phone Call',
    titleArabic: 'مكالمة هاتفية',
    cefrLevel: 'A2',
    topic: 'phone',
    textArabic: 'رن هاتفي وكان صديقي أحمد يتصل. سألني عن موعد الحفلة. أخبرته أنها يوم السبت في الساعة السادسة. قال إنه سيحضر ويجلب كعكة. شكرته وقلت له إلى اللقاء.',
    textEnglish: 'My phone rang and it was my friend Ahmed calling. He asked me about the time of the party. I told him it is Saturday at six o\'clock. He said he will come and bring a cake. I thanked him and said goodbye.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v057', arabic: 'هاتف', english: 'phone', transliteration: 'haatif' },
      { wordId: 'exp_rp_v058', arabic: 'يتصل', english: 'to call', transliteration: 'yattasil' },
      { wordId: 'exp_rp_v059', arabic: 'حفلة', english: 'party', transliteration: 'hafla' },
      { wordId: 'exp_rp_v060', arabic: 'كعكة', english: 'cake', transliteration: 'ka\'ka' },
    ],
    questions: [
      { id: 'exp_rp_a2_004_q1', type: 'multiple_choice', question: 'Who called the speaker?', questionArabic: 'من اتصل بالمتحدث؟', options: ['His brother', 'His friend Ahmed', 'His mother', 'His teacher'], correctIndex: 1 },
      { id: 'exp_rp_a2_004_q2', type: 'multiple_choice', question: 'When is the party?', questionArabic: 'متى الحفلة؟', options: ['Friday', 'Saturday', 'Sunday', 'Monday'], correctIndex: 1 },
      { id: 'exp_rp_a2_004_q3', type: 'true_false', question: 'Ahmed will bring flowers.', questionArabic: 'سيحضر أحمد ورداً.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 36,
  },

  // 5. Writing a Letter
  {
    id: 'exp_rp_a2_005',
    title: 'Writing a Letter',
    titleArabic: 'كتابة رسالة',
    cefrLevel: 'A2',
    topic: 'letter_writing',
    textArabic: 'كتبت رسالة إلى جدتي. أخبرتها عن مدرستي الجديدة وأصدقائي. كتبت لها أنني أحبها وأشتاق إليها. وضعت الرسالة في مغلف وذهبت إلى البريد. أتمنى أن تصل الرسالة بسرعة.',
    textEnglish: 'I wrote a letter to my grandmother. I told her about my new school and my friends. I wrote to her that I love her and miss her. I put the letter in an envelope and went to the post office. I hope the letter arrives quickly.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v061', arabic: 'رسالة', english: 'letter', transliteration: 'risaala' },
      { wordId: 'exp_rp_v062', arabic: 'جدة', english: 'grandmother', transliteration: 'jadda' },
      { wordId: 'exp_rp_v063', arabic: 'أشتاق', english: 'I miss', transliteration: 'ashtaaqu' },
      { wordId: 'exp_rp_v064', arabic: 'مغلف', english: 'envelope', transliteration: 'mughallaf' },
      { wordId: 'exp_rp_v065', arabic: 'بريد', english: 'post/mail', transliteration: 'bariid' },
    ],
    questions: [
      { id: 'exp_rp_a2_005_q1', type: 'multiple_choice', question: 'Who did the speaker write to?', questionArabic: 'إلى من كتب المتحدث؟', options: ['His friend', 'His grandmother', 'His teacher', 'His brother'], correctIndex: 1 },
      { id: 'exp_rp_a2_005_q2', type: 'true_false', question: 'The speaker told her about his old school.', questionArabic: 'أخبرها المتحدث عن مدرسته القديمة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a2_005_q3', type: 'multiple_choice', question: 'Where did the speaker go to send the letter?', questionArabic: 'أين ذهب المتحدث لإرسال الرسالة؟', options: ['The school', 'The market', 'The post office', 'The library'], correctIndex: 2 },
    ],
    wordCount: 38,
  },

  // 6. Market Haggling
  {
    id: 'exp_rp_a2_006',
    title: 'Haggling in the Market',
    titleArabic: 'المساومة في السوق',
    cefrLevel: 'A2',
    topic: 'market_haggling',
    textArabic: 'ذهبت إلى السوق القديم لشراء سجادة. سألت البائع عن السعر. قال إن السعر مئة دينار. قلت له إنه غالٍ جداً وعرضت خمسين ديناراً. اتفقنا على سبعين ديناراً في النهاية.',
    textEnglish: 'I went to the old market to buy a carpet. I asked the seller about the price. He said the price is one hundred dinars. I told him it is too expensive and offered fifty dinars. We agreed on seventy dinars in the end.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v066', arabic: 'سجادة', english: 'carpet', transliteration: 'sajjaada' },
      { wordId: 'exp_rp_v067', arabic: 'بائع', english: 'seller', transliteration: 'baa\'i\'' },
      { wordId: 'exp_rp_v068', arabic: 'سعر', english: 'price', transliteration: 'si\'r' },
      { wordId: 'exp_rp_v069', arabic: 'غالٍ', english: 'expensive', transliteration: 'ghaalin' },
      { wordId: 'exp_rp_v070', arabic: 'اتفقنا', english: 'we agreed', transliteration: 'ittafaqnaa' },
    ],
    questions: [
      { id: 'exp_rp_a2_006_q1', type: 'multiple_choice', question: 'What did the speaker want to buy?', questionArabic: 'ماذا أراد المتحدث أن يشتري؟', options: ['Clothes', 'A carpet', 'Shoes', 'Spices'], correctIndex: 1 },
      { id: 'exp_rp_a2_006_q2', type: 'multiple_choice', question: 'What was the original price?', questionArabic: 'كم كان السعر الأصلي؟', options: ['50 dinars', '70 dinars', '100 dinars', '120 dinars'], correctIndex: 2 },
      { id: 'exp_rp_a2_006_q3', type: 'true_false', question: 'They agreed on fifty dinars.', questionArabic: 'اتفقوا على خمسين ديناراً.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 38,
  },

  // 7. Cooking Recipe
  {
    id: 'exp_rp_a2_007',
    title: 'A Simple Recipe',
    titleArabic: 'وصفة بسيطة',
    cefrLevel: 'A2',
    topic: 'cooking',
    textArabic: 'أمي علمتني كيف أطبخ الحمص. أحتاج حمصاً مسلوقاً وطحينة وليموناً وثوماً. أخلط كل المكونات في الخلاط. أضيف زيت الزيتون والملح. الحمص جاهز للأكل.',
    textEnglish: 'My mother taught me how to cook hummus. I need boiled chickpeas, tahini, lemon, and garlic. I mix all the ingredients in the blender. I add olive oil and salt. The hummus is ready to eat.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v071', arabic: 'حمص', english: 'hummus/chickpeas', transliteration: 'hummus' },
      { wordId: 'exp_rp_v072', arabic: 'طحينة', english: 'tahini', transliteration: 'tahiina' },
      { wordId: 'exp_rp_v073', arabic: 'ثوم', english: 'garlic', transliteration: 'thuum' },
      { wordId: 'exp_rp_v074', arabic: 'مكونات', english: 'ingredients', transliteration: 'mukawwinaat' },
      { wordId: 'exp_rp_v075', arabic: 'زيت الزيتون', english: 'olive oil', transliteration: 'zayt az-zaytun' },
    ],
    questions: [
      { id: 'exp_rp_a2_007_q1', type: 'multiple_choice', question: 'Who taught the speaker to cook?', questionArabic: 'من علم المتحدث الطبخ؟', options: ['Father', 'Mother', 'Grandmother', 'Friend'], correctIndex: 1 },
      { id: 'exp_rp_a2_007_q2', type: 'true_false', question: 'The recipe needs butter.', questionArabic: 'الوصفة تحتاج زبدة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a2_007_q3', type: 'multiple_choice', question: 'What dish is being prepared?', questionArabic: 'ما الطبق الذي يُحضَّر؟', options: ['Falafel', 'Hummus', 'Tabbouleh', 'Fattoush'], correctIndex: 1 },
    ],
    wordCount: 34,
  },

  // 8. Job Interview
  {
    id: 'exp_rp_a2_008',
    title: 'My First Interview',
    titleArabic: 'مقابلتي الأولى',
    cefrLevel: 'A2',
    topic: 'job_interview',
    textArabic: 'ذهبت إلى مقابلة عمل في شركة كبيرة. سألني المدير عن خبرتي ومؤهلاتي. أخبرته أنني درست إدارة الأعمال وأتكلم ثلاث لغات. قال لي إن النتيجة ستأتي بعد أسبوع.',
    textEnglish: 'I went to a job interview at a big company. The manager asked me about my experience and qualifications. I told him I studied business administration and speak three languages. He told me the result will come in a week.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v076', arabic: 'مقابلة', english: 'interview', transliteration: 'muqaabala' },
      { wordId: 'exp_rp_v077', arabic: 'شركة', english: 'company', transliteration: 'sharika' },
      { wordId: 'exp_rp_v078', arabic: 'خبرة', english: 'experience', transliteration: 'khibra' },
      { wordId: 'exp_rp_v079', arabic: 'مؤهلات', english: 'qualifications', transliteration: 'mu\'ahhalaat' },
    ],
    questions: [
      { id: 'exp_rp_a2_008_q1', type: 'multiple_choice', question: 'Where was the interview?', questionArabic: 'أين كانت المقابلة؟', options: ['A school', 'A hospital', 'A big company', 'A shop'], correctIndex: 2 },
      { id: 'exp_rp_a2_008_q2', type: 'multiple_choice', question: 'How many languages does the speaker speak?', questionArabic: 'كم لغة يتكلم المتحدث؟', options: ['One', 'Two', 'Three', 'Four'], correctIndex: 2 },
      { id: 'exp_rp_a2_008_q3', type: 'true_false', question: 'The result will come in two weeks.', questionArabic: 'النتيجة ستأتي بعد أسبوعين.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 36,
  },

  // 9. Hotel Check-in
  {
    id: 'exp_rp_a2_009',
    title: 'Checking In at the Hotel',
    titleArabic: 'تسجيل الدخول في الفندق',
    cefrLevel: 'A2',
    topic: 'hotel',
    textArabic: 'وصلت إلى الفندق في المساء. ذهبت إلى الاستقبال وأعطيت جواز سفري. حجزت غرفة مطلة على البحر. الغرفة في الطابق الخامس. أخذت المفتاح وصعدت بالمصعد.',
    textEnglish: 'I arrived at the hotel in the evening. I went to reception and gave my passport. I booked a room overlooking the sea. The room is on the fifth floor. I took the key and went up by the elevator.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v080', arabic: 'فندق', english: 'hotel', transliteration: 'funduq' },
      { wordId: 'exp_rp_v081', arabic: 'جواز سفر', english: 'passport', transliteration: 'jawaaz safar' },
      { wordId: 'exp_rp_v082', arabic: 'مفتاح', english: 'key', transliteration: 'miftaah' },
      { wordId: 'exp_rp_v083', arabic: 'مصعد', english: 'elevator', transliteration: 'mis\'ad' },
      { wordId: 'exp_rp_v084', arabic: 'طابق', english: 'floor/story', transliteration: 'taabiq' },
    ],
    questions: [
      { id: 'exp_rp_a2_009_q1', type: 'multiple_choice', question: 'When did the speaker arrive?', questionArabic: 'متى وصل المتحدث؟', options: ['Morning', 'Afternoon', 'Evening', 'Night'], correctIndex: 2 },
      { id: 'exp_rp_a2_009_q2', type: 'true_false', question: 'The room overlooks the mountain.', questionArabic: 'الغرفة مطلة على الجبل.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a2_009_q3', type: 'multiple_choice', question: 'On which floor is the room?', questionArabic: 'في أي طابق الغرفة؟', options: ['Third', 'Fourth', 'Fifth', 'Sixth'], correctIndex: 2 },
    ],
    wordCount: 36,
  },

  // 10. Sports Day
  {
    id: 'exp_rp_a2_010',
    title: 'Sports Day at School',
    titleArabic: 'يوم الرياضة في المدرسة',
    cefrLevel: 'A2',
    topic: 'sports_day',
    textArabic: 'اليوم يوم الرياضة في مدرستنا. شاركت في سباق الجري وفزت بالمركز الثاني. لعب فريقنا كرة السلة وفزنا. حصلت على ميدالية فضية. كان يوماً رائعاً ومليئاً بالحماس.',
    textEnglish: 'Today is sports day at our school. I participated in the running race and won second place. Our team played basketball and we won. I got a silver medal. It was a wonderful day full of excitement.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v085', arabic: 'سباق', english: 'race', transliteration: 'sibaaq' },
      { wordId: 'exp_rp_v086', arabic: 'فاز', english: 'won', transliteration: 'faaza' },
      { wordId: 'exp_rp_v087', arabic: 'ميدالية', english: 'medal', transliteration: 'miidaaliya' },
      { wordId: 'exp_rp_v088', arabic: 'حماس', english: 'excitement', transliteration: 'hamaas' },
    ],
    questions: [
      { id: 'exp_rp_a2_010_q1', type: 'multiple_choice', question: 'What place did the speaker win in the race?', questionArabic: 'أي مركز فاز به المتحدث في السباق؟', options: ['First', 'Second', 'Third', 'Fourth'], correctIndex: 1 },
      { id: 'exp_rp_a2_010_q2', type: 'true_false', question: 'The team lost the basketball game.', questionArabic: 'خسر الفريق مباراة كرة السلة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_a2_010_q3', type: 'multiple_choice', question: 'What color medal did the speaker get?', questionArabic: 'ما لون الميدالية التي حصل عليها المتحدث؟', options: ['Gold', 'Silver', 'Bronze', 'No medal'], correctIndex: 1 },
    ],
    wordCount: 36,
  },
];

// ============================================================
// B1 PASSAGES — 10 entries
// Arabic proverbs, historical figures, environment, technology,
// music, education systems, cinema, social media, traditional
// medicine, city vs village life
// ============================================================

const B1_EXPANDED = [
  // 1. Arabic Proverbs Explained
  {
    id: 'exp_rp_b1_001',
    title: 'Wisdom in Arabic Proverbs',
    titleArabic: 'الحكمة في الأمثال العربية',
    cefrLevel: 'B1',
    topic: 'proverbs',
    textArabic: 'الأمثال العربية تحمل حكمة الأجيال. من أشهرها "اللي ما يعرف الصقر يشويه" أي من لا يعرف قيمة الشيء يهدره. ومثل آخر "الصبر مفتاح الفرج" يعلمنا أن الصبر يؤدي إلى الحلول. وهناك "العلم في الصغر كالنقش على الحجر" الذي يشجع على التعلم المبكر. هذه الأمثال تعكس قيم المجتمع العربي وتراثه العريق.',
    textEnglish: 'Arabic proverbs carry the wisdom of generations. Among the most famous is "He who doesn\'t know the falcon will grill it," meaning whoever doesn\'t know the value of something wastes it. Another proverb, "Patience is the key to relief," teaches us that patience leads to solutions. And "Learning in youth is like engraving on stone" encourages early education. These proverbs reflect the values and rich heritage of Arab society.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v089', arabic: 'أمثال', english: 'proverbs', transliteration: 'amthaal' },
      { wordId: 'exp_rp_v090', arabic: 'حكمة', english: 'wisdom', transliteration: 'hikma' },
      { wordId: 'exp_rp_v091', arabic: 'الصبر', english: 'patience', transliteration: 'as-sabr' },
      { wordId: 'exp_rp_v092', arabic: 'تراث', english: 'heritage', transliteration: 'turaath' },
      { wordId: 'exp_rp_v093', arabic: 'مجتمع', english: 'society', transliteration: 'mujtama\'' },
    ],
    questions: [
      { id: 'exp_rp_b1_001_q1', type: 'multiple_choice', question: 'What does "Patience is the key to relief" teach?', questionArabic: 'ماذا يعلمنا مثل "الصبر مفتاح الفرج"؟', options: ['Speed is important', 'Patience leads to solutions', 'Money solves problems', 'Strength is key'], correctIndex: 1 },
      { id: 'exp_rp_b1_001_q2', type: 'true_false', question: 'Arabic proverbs are only entertainment.', questionArabic: 'الأمثال العربية للتسلية فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b1_001_q3', type: 'multiple_choice', question: 'What does "Learning in youth is like engraving on stone" encourage?', questionArabic: 'ماذا يشجع مثل "العلم في الصغر كالنقش على الحجر"؟', options: ['Late learning', 'Early learning', 'Stone carving', 'Youth sports'], correctIndex: 1 },
      { id: 'exp_rp_b1_001_q4', type: 'multiple_choice', question: 'What do these proverbs reflect?', questionArabic: 'ماذا تعكس هذه الأمثال؟', options: ['Modern technology', 'Foreign culture', 'Arab values and heritage', 'Political views'], correctIndex: 2 },
    ],
    wordCount: 62,
  },

  // 2. Historical Figure Profile
  {
    id: 'exp_rp_b1_002',
    title: 'Ibn Battuta: The Great Traveler',
    titleArabic: 'ابن بطوطة: الرحالة العظيم',
    cefrLevel: 'B1',
    topic: 'historical_figures',
    textArabic: 'ابن بطوطة هو أشهر رحالة في التاريخ الإسلامي. ولد في طنجة بالمغرب عام ألف وثلاثمائة وأربعة. سافر لمدة ثلاثين عاماً وزار أكثر من أربعين دولة. كتب عن عادات الشعوب وثقافاتهم. رحلته كانت أطول من رحلة ماركو بولو. كتابه "تحفة النظار" من أهم كتب الرحلات في العالم.',
    textEnglish: 'Ibn Battuta is the most famous traveler in Islamic history. He was born in Tangier, Morocco, in 1304. He traveled for thirty years and visited more than forty countries. He wrote about the customs and cultures of peoples. His journey was longer than Marco Polo\'s. His book "A Gift to Those Who Contemplate the Wonders of Cities" is one of the most important travel books in the world.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v094', arabic: 'رحالة', english: 'traveler', transliteration: 'rahhaala' },
      { wordId: 'exp_rp_v095', arabic: 'عادات', english: 'customs', transliteration: '\'aadaat' },
      { wordId: 'exp_rp_v096', arabic: 'ثقافات', english: 'cultures', transliteration: 'thaqaafaat' },
      { wordId: 'exp_rp_v097', arabic: 'رحلة', english: 'journey', transliteration: 'rihla' },
    ],
    questions: [
      { id: 'exp_rp_b1_002_q1', type: 'multiple_choice', question: 'Where was Ibn Battuta born?', questionArabic: 'أين ولد ابن بطوطة؟', options: ['Cairo', 'Damascus', 'Tangier', 'Baghdad'], correctIndex: 2 },
      { id: 'exp_rp_b1_002_q2', type: 'multiple_choice', question: 'How long did he travel?', questionArabic: 'كم سنة سافر؟', options: ['Ten years', 'Twenty years', 'Thirty years', 'Forty years'], correctIndex: 2 },
      { id: 'exp_rp_b1_002_q3', type: 'true_false', question: 'His journey was shorter than Marco Polo\'s.', questionArabic: 'رحلته كانت أقصر من رحلة ماركو بولو.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 58,
  },

  // 3. Environmental Issues in MENA
  {
    id: 'exp_rp_b1_003',
    title: 'Water Scarcity in the Arab World',
    titleArabic: 'شح المياه في العالم العربي',
    cefrLevel: 'B1',
    topic: 'environment',
    textArabic: 'تعاني كثير من الدول العربية من مشكلة نقص المياه. يقع معظم العالم العربي في مناطق جافة وشبه جافة. تعتمد بعض الدول على تحلية مياه البحر كالسعودية والإمارات. يجب على الجميع ترشيد استهلاك المياه والحفاظ على هذا المورد الثمين. التوعية البيئية مهمة لمستقبل المنطقة.',
    textEnglish: 'Many Arab countries suffer from the problem of water scarcity. Most of the Arab world is located in arid and semi-arid regions. Some countries rely on desalinating seawater, like Saudi Arabia and the UAE. Everyone must rationalize water consumption and preserve this precious resource. Environmental awareness is important for the future of the region.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v098', arabic: 'نقص', english: 'scarcity/shortage', transliteration: 'naqs' },
      { wordId: 'exp_rp_v099', arabic: 'جافة', english: 'arid/dry', transliteration: 'jaaffa' },
      { wordId: 'exp_rp_v100', arabic: 'تحلية', english: 'desalination', transliteration: 'tahliya' },
      { wordId: 'exp_rp_v101', arabic: 'ترشيد', english: 'rationalization', transliteration: 'tarshiid' },
      { wordId: 'exp_rp_v102', arabic: 'توعية', english: 'awareness', transliteration: 'taw\'iya' },
    ],
    questions: [
      { id: 'exp_rp_b1_003_q1', type: 'multiple_choice', question: 'What problem do many Arab countries face?', questionArabic: 'ما المشكلة التي تعاني منها كثير من الدول العربية؟', options: ['Overpopulation', 'Water scarcity', 'Air pollution', 'Deforestation'], correctIndex: 1 },
      { id: 'exp_rp_b1_003_q2', type: 'true_false', question: 'Most of the Arab world is in tropical regions.', questionArabic: 'معظم العالم العربي في مناطق استوائية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b1_003_q3', type: 'multiple_choice', question: 'What method do Saudi Arabia and the UAE use?', questionArabic: 'ما الطريقة التي تستخدمها السعودية والإمارات؟', options: ['Rainwater harvesting', 'Desalination', 'River diversion', 'Cloud seeding'], correctIndex: 1 },
    ],
    wordCount: 56,
  },

  // 4. Technology in the Arab World
  {
    id: 'exp_rp_b1_004',
    title: 'Technology and Innovation',
    titleArabic: 'التكنولوجيا والابتكار',
    cefrLevel: 'B1',
    topic: 'arab_technology',
    textArabic: 'شهد العالم العربي تطوراً كبيراً في مجال التكنولوجيا. أصبحت دبي مركزاً عالمياً للابتكار والتقنية. تستثمر دول الخليج في الذكاء الاصطناعي والطاقة المتجددة. انتشرت التطبيقات العربية مثل كريم وسوق دوت كوم. الشباب العربي يقود ثورة رقمية من خلال الشركات الناشئة.',
    textEnglish: 'The Arab world has witnessed great development in technology. Dubai has become a global center for innovation and technology. Gulf countries invest in artificial intelligence and renewable energy. Arab applications like Careem and Souq.com have spread. Arab youth are leading a digital revolution through startups.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v103', arabic: 'تطور', english: 'development', transliteration: 'tatawwur' },
      { wordId: 'exp_rp_v104', arabic: 'ابتكار', english: 'innovation', transliteration: 'ibtikaar' },
      { wordId: 'exp_rp_v105', arabic: 'ذكاء اصطناعي', english: 'artificial intelligence', transliteration: 'dhakaa\' istinaaa\'ii' },
      { wordId: 'exp_rp_v106', arabic: 'شركات ناشئة', english: 'startups', transliteration: 'sharikaat naashi\'a' },
    ],
    questions: [
      { id: 'exp_rp_b1_004_q1', type: 'multiple_choice', question: 'What has Dubai become?', questionArabic: 'ماذا أصبحت دبي؟', options: ['A tourist destination', 'A global innovation center', 'An oil capital', 'A cultural hub'], correctIndex: 1 },
      { id: 'exp_rp_b1_004_q2', type: 'true_false', question: 'Gulf countries invest in artificial intelligence.', questionArabic: 'تستثمر دول الخليج في الذكاء الاصطناعي.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_b1_004_q3', type: 'multiple_choice', question: 'Who is leading the digital revolution?', questionArabic: 'من يقود الثورة الرقمية؟', options: ['Governments', 'Foreign companies', 'Arab youth', 'Universities'], correctIndex: 2 },
    ],
    wordCount: 52,
  },

  // 5. Arabic Music Traditions
  {
    id: 'exp_rp_b1_005',
    title: 'Arabic Music Heritage',
    titleArabic: 'تراث الموسيقى العربية',
    cefrLevel: 'B1',
    topic: 'arabic_music',
    textArabic: 'الموسيقى العربية لها تاريخ طويل وغني. تعتمد على نظام المقامات الذي يختلف عن السلم الموسيقي الغربي. من أشهر الآلات العود والناي والقانون. تركت أم كلثوم وفيروز أثراً عميقاً في الوجدان العربي. اليوم يمزج الفنانون الشباب بين الموسيقى التقليدية والحديثة.',
    textEnglish: 'Arabic music has a long and rich history. It relies on the maqam system, which differs from the Western musical scale. Among the most famous instruments are the oud, the ney, and the qanun. Umm Kulthum and Fairuz left a deep impact on the Arab consciousness. Today, young artists blend traditional and modern music.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v107', arabic: 'مقامات', english: 'maqamat (musical modes)', transliteration: 'maqaamaat' },
      { wordId: 'exp_rp_v108', arabic: 'عود', english: 'oud', transliteration: '\'uud' },
      { wordId: 'exp_rp_v109', arabic: 'ناي', english: 'ney (flute)', transliteration: 'naay' },
      { wordId: 'exp_rp_v110', arabic: 'وجدان', english: 'consciousness/feeling', transliteration: 'wijdaan' },
    ],
    questions: [
      { id: 'exp_rp_b1_005_q1', type: 'multiple_choice', question: 'What system does Arabic music rely on?', questionArabic: 'على أي نظام تعتمد الموسيقى العربية؟', options: ['Western scale', 'Maqam system', 'Pentatonic scale', 'Raga system'], correctIndex: 1 },
      { id: 'exp_rp_b1_005_q2', type: 'true_false', question: 'The oud is a Western instrument.', questionArabic: 'العود آلة غربية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b1_005_q3', type: 'multiple_choice', question: 'What are young artists doing today?', questionArabic: 'ماذا يفعل الفنانون الشباب اليوم؟', options: ['Rejecting tradition', 'Blending traditional and modern', 'Only playing Western', 'Stopping music'], correctIndex: 1 },
    ],
    wordCount: 56,
  },

  // 6. Education Systems
  {
    id: 'exp_rp_b1_006',
    title: 'Education in the Arab World',
    titleArabic: 'التعليم في العالم العربي',
    cefrLevel: 'B1',
    topic: 'education_systems',
    textArabic: 'يختلف نظام التعليم من دولة عربية إلى أخرى. في معظم الدول يبدأ التعليم الإلزامي في سن السادسة. تهتم دول الخليج بالتعليم الدولي والجامعات العالمية. مصر لديها أقدم جامعة في العالم وهي جامعة الأزهر. تواجه بعض الدول تحديات في جودة التعليم وتدريب المعلمين.',
    textEnglish: 'The education system differs from one Arab country to another. In most countries, compulsory education starts at age six. Gulf countries focus on international education and global universities. Egypt has the oldest university in the world, Al-Azhar University. Some countries face challenges in education quality and teacher training.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v111', arabic: 'إلزامي', english: 'compulsory', transliteration: 'ilzaamii' },
      { wordId: 'exp_rp_v112', arabic: 'جامعة', english: 'university', transliteration: 'jaami\'a' },
      { wordId: 'exp_rp_v113', arabic: 'تحديات', english: 'challenges', transliteration: 'tahaddiyaat' },
      { wordId: 'exp_rp_v114', arabic: 'جودة', english: 'quality', transliteration: 'jawda' },
    ],
    questions: [
      { id: 'exp_rp_b1_006_q1', type: 'multiple_choice', question: 'When does compulsory education start?', questionArabic: 'متى يبدأ التعليم الإلزامي؟', options: ['Age 4', 'Age 5', 'Age 6', 'Age 7'], correctIndex: 2 },
      { id: 'exp_rp_b1_006_q2', type: 'true_false', question: 'Al-Azhar is the newest university in the world.', questionArabic: 'الأزهر أحدث جامعة في العالم.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b1_006_q3', type: 'multiple_choice', question: 'What challenges do some countries face?', questionArabic: 'ما التحديات التي تواجه بعض الدول؟', options: ['Too many students', 'Education quality and teacher training', 'Lack of buildings', 'No technology'], correctIndex: 1 },
    ],
    wordCount: 54,
  },

  // 7. Arabic Cinema
  {
    id: 'exp_rp_b1_007',
    title: 'The Golden Age of Arabic Cinema',
    titleArabic: 'العصر الذهبي للسينما العربية',
    cefrLevel: 'B1',
    topic: 'arabic_cinema',
    textArabic: 'عاشت السينما المصرية عصرها الذهبي في الخمسينيات والستينيات. أنتجت مصر مئات الأفلام التي شاهدها العالم العربي كله. برز نجوم مثل عمر الشريف وفاتن حمامة. اليوم تنمو صناعة السينما في السعودية والأردن ولبنان. المهرجانات السينمائية مثل مهرجان القاهرة تجمع المواهب العربية.',
    textEnglish: 'Egyptian cinema lived its golden age in the 1950s and 1960s. Egypt produced hundreds of films watched by the entire Arab world. Stars like Omar Sharif and Faten Hamama emerged. Today, the film industry is growing in Saudi Arabia, Jordan, and Lebanon. Film festivals like the Cairo Festival bring together Arab talents.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v115', arabic: 'سينما', english: 'cinema', transliteration: 'siinamaa' },
      { wordId: 'exp_rp_v116', arabic: 'أفلام', english: 'films', transliteration: 'aflaam' },
      { wordId: 'exp_rp_v117', arabic: 'نجوم', english: 'stars', transliteration: 'nujuum' },
      { wordId: 'exp_rp_v118', arabic: 'مهرجان', english: 'festival', transliteration: 'mahrajaan' },
    ],
    questions: [
      { id: 'exp_rp_b1_007_q1', type: 'multiple_choice', question: 'When was the golden age of Egyptian cinema?', questionArabic: 'متى كان العصر الذهبي للسينما المصرية؟', options: ['1930s-40s', '1950s-60s', '1970s-80s', '1990s-2000s'], correctIndex: 1 },
      { id: 'exp_rp_b1_007_q2', type: 'true_false', question: 'Omar Sharif was a famous Egyptian star.', questionArabic: 'عمر الشريف كان نجماً مصرياً مشهوراً.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_b1_007_q3', type: 'multiple_choice', question: 'Where is the film industry growing today?', questionArabic: 'أين تنمو صناعة السينما اليوم؟', options: ['Only in Egypt', 'Saudi Arabia, Jordan, Lebanon', 'Only in the Gulf', 'Europe'], correctIndex: 1 },
    ],
    wordCount: 58,
  },

  // 8. Social Media Arabic
  {
    id: 'exp_rp_b1_008',
    title: 'Arabic on Social Media',
    titleArabic: 'العربية على وسائل التواصل',
    cefrLevel: 'B1',
    topic: 'social_media',
    textArabic: 'غيّرت وسائل التواصل الاجتماعي طريقة استخدام اللغة العربية. يستخدم كثيرون العامية بدل الفصحى في الكتابة. ظهرت كلمات جديدة مثل "هاشتاغ" و"بوست". يقلق بعض اللغويين من تأثير ذلك على اللغة الفصحى. لكن آخرين يرون أن اللغة تتطور بشكل طبيعي مع العصر.',
    textEnglish: 'Social media has changed how Arabic is used. Many people use colloquial Arabic instead of formal Arabic in writing. New words have appeared like "hashtag" and "post." Some linguists worry about the effect on formal Arabic. But others see that language evolves naturally with the times.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v119', arabic: 'وسائل التواصل', english: 'social media', transliteration: 'wasaa\'il at-tawaasul' },
      { wordId: 'exp_rp_v120', arabic: 'عامية', english: 'colloquial', transliteration: '\'aammiya' },
      { wordId: 'exp_rp_v121', arabic: 'فصحى', english: 'formal/classical Arabic', transliteration: 'fushaa' },
      { wordId: 'exp_rp_v122', arabic: 'لغويين', english: 'linguists', transliteration: 'lughawiyyiin' },
    ],
    questions: [
      { id: 'exp_rp_b1_008_q1', type: 'multiple_choice', question: 'What type of Arabic is used more on social media?', questionArabic: 'أي نوع من العربية يُستخدم أكثر على وسائل التواصل؟', options: ['Classical', 'Colloquial', 'Quranic', 'Academic'], correctIndex: 1 },
      { id: 'exp_rp_b1_008_q2', type: 'true_false', question: 'All linguists agree social media is bad for Arabic.', questionArabic: 'كل اللغويين يتفقون أن وسائل التواصل سيئة للعربية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b1_008_q3', type: 'multiple_choice', question: 'What is an example of a new word?', questionArabic: 'ما مثال على كلمة جديدة؟', options: ['كتاب', 'هاشتاغ', 'مدرسة', 'سيارة'], correctIndex: 1 },
    ],
    wordCount: 52,
  },

  // 9. Traditional Medicine
  {
    id: 'exp_rp_b1_009',
    title: 'Arab Traditional Medicine',
    titleArabic: 'الطب العربي التقليدي',
    cefrLevel: 'B1',
    topic: 'traditional_medicine',
    textArabic: 'كان العرب رواداً في مجال الطب. ابن سينا كتب "القانون في الطب" الذي درسه الأوروبيون لقرون. استخدم العرب الأعشاب والعسل والحبة السوداء في العلاج. بعض هذه العلاجات أثبت العلم الحديث فعاليتها. اليوم يعود الاهتمام بالطب البديل والأعشاب الطبية في أنحاء العالم.',
    textEnglish: 'Arabs were pioneers in the field of medicine. Ibn Sina wrote "The Canon of Medicine," which Europeans studied for centuries. Arabs used herbs, honey, and black seed in treatment. Modern science has proven the effectiveness of some of these remedies. Today, interest in alternative medicine and medicinal herbs is returning worldwide.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v123', arabic: 'رواد', english: 'pioneers', transliteration: 'ruwwaad' },
      { wordId: 'exp_rp_v124', arabic: 'أعشاب', english: 'herbs', transliteration: 'a\'shaab' },
      { wordId: 'exp_rp_v125', arabic: 'علاج', english: 'treatment', transliteration: '\'ilaaj' },
      { wordId: 'exp_rp_v126', arabic: 'فعالية', english: 'effectiveness', transliteration: 'fa\'\'aaliya' },
    ],
    questions: [
      { id: 'exp_rp_b1_009_q1', type: 'multiple_choice', question: 'Who wrote "The Canon of Medicine"?', questionArabic: 'من كتب "القانون في الطب"؟', options: ['Al-Razi', 'Ibn Sina', 'Al-Zahrawi', 'Ibn Khaldun'], correctIndex: 1 },
      { id: 'exp_rp_b1_009_q2', type: 'true_false', question: 'Arabs never used herbs for medicine.', questionArabic: 'العرب لم يستخدموا الأعشاب في الطب أبداً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b1_009_q3', type: 'multiple_choice', question: 'What is happening today regarding traditional medicine?', questionArabic: 'ماذا يحدث اليوم بشأن الطب التقليدي؟', options: ['It is forgotten', 'Interest is returning', 'It is banned', 'It replaced modern medicine'], correctIndex: 1 },
    ],
    wordCount: 56,
  },

  // 10. City vs Village Life
  {
    id: 'exp_rp_b1_010',
    title: 'City Life vs Village Life',
    titleArabic: 'حياة المدينة مقابل حياة القرية',
    cefrLevel: 'B1',
    topic: 'city_village',
    textArabic: 'يفضل بعض الناس حياة المدينة بسبب فرص العمل والتعليم والترفيه. المدن فيها مستشفيات ومراكز تسوق ومواصلات عامة. لكن القرية تتميز بالهدوء والهواء النقي والعلاقات الاجتماعية القوية. يعاني سكان المدن من الازدحام والتلوث. كثيرون يحلمون بالعودة إلى قريتهم بعد التقاعد.',
    textEnglish: 'Some people prefer city life because of job opportunities, education, and entertainment. Cities have hospitals, shopping centers, and public transportation. But villages are characterized by peace, clean air, and strong social relationships. City residents suffer from crowding and pollution. Many dream of returning to their village after retirement.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v127', arabic: 'فرص', english: 'opportunities', transliteration: 'furas' },
      { wordId: 'exp_rp_v128', arabic: 'ترفيه', english: 'entertainment', transliteration: 'tarfiih' },
      { wordId: 'exp_rp_v129', arabic: 'ازدحام', english: 'crowding', transliteration: 'izdiham' },
      { wordId: 'exp_rp_v130', arabic: 'تلوث', english: 'pollution', transliteration: 'talawwuth' },
      { wordId: 'exp_rp_v131', arabic: 'تقاعد', english: 'retirement', transliteration: 'taqaa\'ud' },
    ],
    questions: [
      { id: 'exp_rp_b1_010_q1', type: 'multiple_choice', question: 'Why do some people prefer city life?', questionArabic: 'لماذا يفضل بعض الناس حياة المدينة؟', options: ['Clean air', 'Quiet environment', 'Job opportunities', 'Strong relationships'], correctIndex: 2 },
      { id: 'exp_rp_b1_010_q2', type: 'true_false', question: 'Villages are known for pollution.', questionArabic: 'القرى معروفة بالتلوث.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b1_010_q3', type: 'multiple_choice', question: 'What do many people dream of after retirement?', questionArabic: 'بماذا يحلم كثيرون بعد التقاعد؟', options: ['Moving to a bigger city', 'Traveling abroad', 'Returning to their village', 'Starting a business'], correctIndex: 2 },
    ],
    wordCount: 58,
  },
];

// ============================================================
// B2 PASSAGES — 10 entries
// Literary criticism, philosophical debate, economics, science,
// political speech, dialectology, calligraphy, translation,
// Islamic architecture, comparative linguistics
// ============================================================

const B2_EXPANDED = [
  // 1. Literary Criticism
  {
    id: 'exp_rp_b2_001',
    title: 'Naguib Mahfouz and the Arabic Novel',
    titleArabic: 'نجيب محفوظ والرواية العربية',
    cefrLevel: 'B2',
    topic: 'literary_criticism',
    textArabic: 'يُعدّ نجيب محفوظ أبا الرواية العربية الحديثة وأول عربي يفوز بجائزة نوبل في الأدب عام ألف وتسعمائة وثمانية وثمانين. تناولت ثلاثيته الشهيرة تحولات المجتمع المصري عبر ثلاثة أجيال. تميزت كتاباته بالواقعية والعمق النفسي ونقد البنى الاجتماعية. أثارت بعض أعماله جدلاً واسعاً بسبب معالجتها لموضوعات حساسة. تأثيره يمتد إلى أجيال من الكتاب العرب الذين تبنوا أساليبه السردية.',
    textEnglish: 'Naguib Mahfouz is considered the father of the modern Arabic novel and the first Arab to win the Nobel Prize in Literature in 1988. His famous trilogy dealt with the transformations of Egyptian society across three generations. His writing was characterized by realism, psychological depth, and critique of social structures. Some of his works stirred wide controversy due to their treatment of sensitive topics. His influence extends to generations of Arab writers who adopted his narrative techniques.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v132', arabic: 'رواية', english: 'novel', transliteration: 'riwaaya' },
      { wordId: 'exp_rp_v133', arabic: 'جائزة', english: 'prize', transliteration: 'jaa\'iza' },
      { wordId: 'exp_rp_v134', arabic: 'واقعية', english: 'realism', transliteration: 'waaqi\'iyya' },
      { wordId: 'exp_rp_v135', arabic: 'جدل', english: 'controversy', transliteration: 'jadal' },
      { wordId: 'exp_rp_v136', arabic: 'سردية', english: 'narrative', transliteration: 'sardiyya' },
    ],
    questions: [
      { id: 'exp_rp_b2_001_q1', type: 'multiple_choice', question: 'When did Mahfouz win the Nobel Prize?', questionArabic: 'متى فاز محفوظ بجائزة نوبل؟', options: ['1978', '1983', '1988', '1993'], correctIndex: 2 },
      { id: 'exp_rp_b2_001_q2', type: 'multiple_choice', question: 'How many generations does the trilogy cover?', questionArabic: 'كم جيلاً تغطي الثلاثية؟', options: ['Two', 'Three', 'Four', 'Five'], correctIndex: 1 },
      { id: 'exp_rp_b2_001_q3', type: 'true_false', question: 'All of Mahfouz\'s works were uncontroversial.', questionArabic: 'كل أعمال محفوظ كانت بلا جدل.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b2_001_q4', type: 'multiple_choice', question: 'What characterized his writing style?', questionArabic: 'ما الذي ميز أسلوبه الكتابي؟', options: ['Fantasy and myth', 'Realism and psychological depth', 'Romance and comedy', 'Science fiction'], correctIndex: 1 },
    ],
    wordCount: 72,
  },

  // 2. Philosophical Debate
  {
    id: 'exp_rp_b2_002',
    title: 'Free Will in Arab Philosophy',
    titleArabic: 'الإرادة الحرة في الفلسفة العربية',
    cefrLevel: 'B2',
    topic: 'philosophy',
    textArabic: 'شكّل موضوع الإرادة الحرة محوراً أساسياً في الفلسفة الإسلامية. تبنت المعتزلة موقف حرية الإرادة البشرية ومسؤولية الإنسان عن أفعاله. في المقابل رأى الأشاعرة أن الله خالق الأفعال وأن الإنسان يكتسبها. حاول ابن رشد التوفيق بين الفلسفة والدين من خلال نظرية المستويات المعرفية. لا يزال هذا النقاش حياً في الفكر العربي المعاصر ويتقاطع مع قضايا الحداثة والتحرر.',
    textEnglish: 'The topic of free will formed a central axis in Islamic philosophy. The Mu\'tazilites adopted the position of human free will and man\'s responsibility for his actions. In contrast, the Ash\'arites believed God creates actions and humans acquire them. Ibn Rushd tried to reconcile philosophy and religion through his theory of levels of knowledge. This debate remains alive in contemporary Arab thought and intersects with issues of modernity and liberation.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v137', arabic: 'إرادة', english: 'will', transliteration: 'iraada' },
      { wordId: 'exp_rp_v138', arabic: 'مسؤولية', english: 'responsibility', transliteration: 'mas\'uuliyya' },
      { wordId: 'exp_rp_v139', arabic: 'التوفيق', english: 'reconciliation', transliteration: 'at-tawfiiq' },
      { wordId: 'exp_rp_v140', arabic: 'حداثة', english: 'modernity', transliteration: 'hadaatha' },
      { wordId: 'exp_rp_v141', arabic: 'تحرر', english: 'liberation', transliteration: 'taharrur' },
    ],
    questions: [
      { id: 'exp_rp_b2_002_q1', type: 'multiple_choice', question: 'What did the Mu\'tazilites believe?', questionArabic: 'بماذا آمنت المعتزلة؟', options: ['Humans have no free will', 'Humans have free will', 'Free will is irrelevant', 'Only prophets have free will'], correctIndex: 1 },
      { id: 'exp_rp_b2_002_q2', type: 'true_false', question: 'Ibn Rushd tried to reconcile philosophy and religion.', questionArabic: 'حاول ابن رشد التوفيق بين الفلسفة والدين.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_b2_002_q3', type: 'multiple_choice', question: 'What is the Ash\'arite position?', questionArabic: 'ما موقف الأشاعرة؟', options: ['God creates actions, humans acquire them', 'Humans are fully independent', 'There are no actions', 'Philosophy determines everything'], correctIndex: 0 },
    ],
    wordCount: 70,
  },

  // 3. Economic Analysis
  {
    id: 'exp_rp_b2_003',
    title: 'Economic Diversification in the Gulf',
    titleArabic: 'التنويع الاقتصادي في الخليج',
    cefrLevel: 'B2',
    topic: 'economics',
    textArabic: 'تسعى دول الخليج العربي إلى تنويع اقتصاداتها بعيداً عن الاعتماد على النفط. تُعدّ رؤية السعودية ألفين وثلاثين نموذجاً طموحاً يهدف إلى تطوير قطاعات السياحة والترفيه والتقنية. استثمرت الإمارات في البنية التحتية والتجارة الدولية وأصبحت دبي مركزاً لوجستياً عالمياً. يواجه هذا التحول تحديات تتعلق بتأهيل القوى العاملة الوطنية وتقليل الاعتماد على العمالة الأجنبية. يرى المحللون أن نجاح هذه الخطط يتوقف على الإصلاح المؤسسي والاستثمار في رأس المال البشري.',
    textEnglish: 'Gulf countries are seeking to diversify their economies away from dependence on oil. Saudi Vision 2030 is an ambitious model aiming to develop tourism, entertainment, and technology sectors. The UAE has invested in infrastructure and international trade, making Dubai a global logistics hub. This transformation faces challenges related to qualifying the national workforce and reducing reliance on foreign labor. Analysts see that the success of these plans depends on institutional reform and investment in human capital.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v142', arabic: 'تنويع', english: 'diversification', transliteration: 'tanwii\'' },
      { wordId: 'exp_rp_v143', arabic: 'اقتصاد', english: 'economy', transliteration: 'iqtisaad' },
      { wordId: 'exp_rp_v144', arabic: 'بنية تحتية', english: 'infrastructure', transliteration: 'binya tahtiyya' },
      { wordId: 'exp_rp_v145', arabic: 'قوى عاملة', english: 'workforce', transliteration: 'quwaa \'aamila' },
      { wordId: 'exp_rp_v146', arabic: 'إصلاح', english: 'reform', transliteration: 'islaah' },
    ],
    questions: [
      { id: 'exp_rp_b2_003_q1', type: 'multiple_choice', question: 'What is Saudi Vision 2030 aiming for?', questionArabic: 'ما هدف رؤية السعودية 2030؟', options: ['Increasing oil production', 'Diversifying the economy', 'Reducing population', 'Military expansion'], correctIndex: 1 },
      { id: 'exp_rp_b2_003_q2', type: 'true_false', question: 'Dubai has become a global logistics hub.', questionArabic: 'أصبحت دبي مركزاً لوجستياً عالمياً.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_b2_003_q3', type: 'multiple_choice', question: 'What do analysts say success depends on?', questionArabic: 'على ماذا يتوقف نجاح الخطط حسب المحللين؟', options: ['Oil prices', 'Institutional reform and human capital', 'Foreign investment only', 'Military strength'], correctIndex: 1 },
    ],
    wordCount: 78,
  },

  // 4. Scientific Paper Summary
  {
    id: 'exp_rp_b2_004',
    title: 'The Arab Contribution to Optics',
    titleArabic: 'الإسهام العربي في علم البصريات',
    cefrLevel: 'B2',
    topic: 'science',
    textArabic: 'يُعتبر الحسن بن الهيثم مؤسس علم البصريات الحديث. في كتابه "المناظر" قدّم نظرية ثورية عن الرؤية تناقض ما سبقها. أثبت أن الضوء ينعكس من الأجسام إلى العين وليس العكس كما اعتقد اليونان. استخدم المنهج التجريبي القائم على الملاحظة والتجربة قبل أن يُنسب هذا المنهج إلى علماء أوروبا. أعماله أثرت في علماء مثل كيبلر ونيوتن وأسست لفهمنا المعاصر للبصريات.',
    textEnglish: 'Al-Hasan ibn al-Haytham is considered the founder of modern optics. In his book "Book of Optics," he presented a revolutionary theory of vision that contradicted previous ones. He proved that light reflects from objects to the eye, not the other way around as the Greeks believed. He used the experimental method based on observation and experimentation before this method was attributed to European scientists. His works influenced scientists like Kepler and Newton and laid the foundation for our contemporary understanding of optics.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v147', arabic: 'بصريات', english: 'optics', transliteration: 'basariyyaat' },
      { wordId: 'exp_rp_v148', arabic: 'ثورية', english: 'revolutionary', transliteration: 'thawriyya' },
      { wordId: 'exp_rp_v149', arabic: 'ينعكس', english: 'reflects', transliteration: 'yan\'akis' },
      { wordId: 'exp_rp_v150', arabic: 'المنهج التجريبي', english: 'experimental method', transliteration: 'al-manhaj at-tajriibii' },
      { wordId: 'exp_rp_v151', arabic: 'ملاحظة', english: 'observation', transliteration: 'mulaahaza' },
    ],
    questions: [
      { id: 'exp_rp_b2_004_q1', type: 'multiple_choice', question: 'What did the Greeks believe about vision?', questionArabic: 'ماذا اعتقد اليونان عن الرؤية؟', options: ['Light goes from eye to objects', 'Light reflects from objects', 'There is no light', 'Vision is random'], correctIndex: 0 },
      { id: 'exp_rp_b2_004_q2', type: 'true_false', question: 'Ibn al-Haytham influenced Kepler and Newton.', questionArabic: 'ابن الهيثم أثر في كيبلر ونيوتن.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_b2_004_q3', type: 'multiple_choice', question: 'What method did Ibn al-Haytham use?', questionArabic: 'ما المنهج الذي استخدمه ابن الهيثم؟', options: ['Philosophical deduction', 'Experimental method', 'Mathematical modeling', 'Divine revelation'], correctIndex: 1 },
    ],
    wordCount: 80,
  },

  // 5. Political Speech Analysis
  {
    id: 'exp_rp_b2_005',
    title: 'Rhetoric in Arabic Political Discourse',
    titleArabic: 'البلاغة في الخطاب السياسي العربي',
    cefrLevel: 'B2',
    topic: 'political_rhetoric',
    textArabic: 'يتميز الخطاب السياسي العربي بتوظيف البلاغة العربية الكلاسيكية. يلجأ المتحدثون إلى الاستعارة والتشبيه والسجع لإقناع الجمهور وإثارة عواطفه. يستدعي كثير من السياسيين التراث الإسلامي والقومي لتعزيز شرعيتهم. شهد الخطاب تحولاً ملحوظاً بعد الربيع العربي حيث أصبح أكثر مباشرة وأقل رسمية. يحلل الباحثون هذا التحول كانعكاس لتغير العلاقة بين السلطة والمواطن.',
    textEnglish: 'Arabic political discourse is characterized by employing classical Arabic rhetoric. Speakers resort to metaphor, simile, and rhymed prose to persuade and stir the emotions of the audience. Many politicians invoke Islamic and national heritage to strengthen their legitimacy. The discourse witnessed a notable transformation after the Arab Spring, becoming more direct and less formal. Researchers analyze this shift as a reflection of the changing relationship between authority and citizen.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v152', arabic: 'بلاغة', english: 'rhetoric', transliteration: 'balaagha' },
      { wordId: 'exp_rp_v153', arabic: 'استعارة', english: 'metaphor', transliteration: 'isti\'aara' },
      { wordId: 'exp_rp_v154', arabic: 'شرعية', english: 'legitimacy', transliteration: 'shar\'iyya' },
      { wordId: 'exp_rp_v155', arabic: 'الربيع العربي', english: 'Arab Spring', transliteration: 'ar-rabii\' al-\'arabii' },
      { wordId: 'exp_rp_v156', arabic: 'سلطة', english: 'authority/power', transliteration: 'sulta' },
    ],
    questions: [
      { id: 'exp_rp_b2_005_q1', type: 'multiple_choice', question: 'What rhetorical devices are used?', questionArabic: 'ما الأساليب البلاغية المستخدمة؟', options: ['Only statistics', 'Metaphor, simile, rhymed prose', 'Only logic', 'Foreign quotes'], correctIndex: 1 },
      { id: 'exp_rp_b2_005_q2', type: 'true_false', question: 'After the Arab Spring, discourse became more formal.', questionArabic: 'بعد الربيع العربي أصبح الخطاب أكثر رسمية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b2_005_q3', type: 'multiple_choice', question: 'Why do politicians invoke heritage?', questionArabic: 'لماذا يستدعي السياسيون التراث؟', options: ['For entertainment', 'To strengthen legitimacy', 'To confuse people', 'For academic purposes'], correctIndex: 1 },
    ],
    wordCount: 76,
  },

  // 6. Arabic Dialectology
  {
    id: 'exp_rp_b2_006',
    title: 'Arabic Dialects: Unity in Diversity',
    titleArabic: 'اللهجات العربية: وحدة في التنوع',
    cefrLevel: 'B2',
    topic: 'dialectology',
    textArabic: 'تتوزع اللهجات العربية إلى خمس مجموعات رئيسية: المصرية والشامية والخليجية والمغاربية والعراقية. رغم اختلافها الصوتي والمعجمي تشترك في جذور نحوية واحدة. يستطيع المصري والسعودي التفاهم عادةً لكن قد يصعب على المغربي واللبناني ذلك. تلعب الفصحى دور اللغة الجامعة في الإعلام والتعليم. يدرس علماء اللسانيات الاجتماعية تأثير الهجرة ووسائل الإعلام في تقارب اللهجات.',
    textEnglish: 'Arabic dialects are distributed into five main groups: Egyptian, Levantine, Gulf, Maghrebi, and Iraqi. Despite their phonological and lexical differences, they share common grammatical roots. An Egyptian and a Saudi can usually understand each other, but a Moroccan and a Lebanese may find it difficult. Modern Standard Arabic plays the role of a unifying language in media and education. Sociolinguists study the effect of migration and media on dialect convergence.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v157', arabic: 'لهجات', english: 'dialects', transliteration: 'lahjaat' },
      { wordId: 'exp_rp_v158', arabic: 'صوتي', english: 'phonological', transliteration: 'sawtii' },
      { wordId: 'exp_rp_v159', arabic: 'معجمي', english: 'lexical', transliteration: 'mu\'jamii' },
      { wordId: 'exp_rp_v160', arabic: 'لسانيات', english: 'linguistics', transliteration: 'lisaaniyyaat' },
      { wordId: 'exp_rp_v161', arabic: 'تقارب', english: 'convergence', transliteration: 'taqaarub' },
    ],
    questions: [
      { id: 'exp_rp_b2_006_q1', type: 'multiple_choice', question: 'How many main dialect groups are there?', questionArabic: 'كم مجموعة لهجات رئيسية هناك؟', options: ['Three', 'Four', 'Five', 'Six'], correctIndex: 2 },
      { id: 'exp_rp_b2_006_q2', type: 'true_false', question: 'All Arabic speakers easily understand each other.', questionArabic: 'كل المتحدثين بالعربية يفهمون بعضهم بسهولة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b2_006_q3', type: 'multiple_choice', question: 'What role does Modern Standard Arabic play?', questionArabic: 'ما دور اللغة العربية الفصحى؟', options: ['It replaces dialects', 'It is a unifying language', 'It is only for poetry', 'It is not used anymore'], correctIndex: 1 },
    ],
    wordCount: 74,
  },

  // 7. Calligraphy History
  {
    id: 'exp_rp_b2_007',
    title: 'The Art of Arabic Calligraphy',
    titleArabic: 'فن الخط العربي',
    cefrLevel: 'B2',
    topic: 'calligraphy',
    textArabic: 'يُعدّ الخط العربي من أرقى الفنون الإسلامية وأكثرها تعبيراً عن الهوية الحضارية. تطور من الخط النبطي وتفرع إلى أنماط عدة أبرزها النسخ والثلث والديواني والكوفي. ارتبط الخط بنسخ القرآن الكريم ما أعطاه بُعداً روحياً عميقاً. أبدع الخطاطون العثمانيون في تطوير أنماط جديدة بلغت ذروة الإتقان. اليوم يُوظف الخط العربي في التصميم الحديث والفن المعاصر ليجسد حواراً بين الأصالة والمعاصرة.',
    textEnglish: 'Arabic calligraphy is considered one of the finest Islamic arts and most expressive of civilizational identity. It evolved from the Nabataean script and branched into several styles, most notably Naskh, Thuluth, Diwani, and Kufic. Calligraphy was tied to copying the Quran, giving it a deep spiritual dimension. Ottoman calligraphers excelled in developing new styles that reached the pinnacle of mastery. Today Arabic calligraphy is employed in modern design and contemporary art, embodying a dialogue between authenticity and modernity.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v162', arabic: 'خط', english: 'calligraphy/script', transliteration: 'khatt' },
      { wordId: 'exp_rp_v163', arabic: 'هوية', english: 'identity', transliteration: 'hawiyya' },
      { wordId: 'exp_rp_v164', arabic: 'حضارية', english: 'civilizational', transliteration: 'hadaariyya' },
      { wordId: 'exp_rp_v165', arabic: 'إتقان', english: 'mastery', transliteration: 'itqaan' },
      { wordId: 'exp_rp_v166', arabic: 'أصالة', english: 'authenticity', transliteration: 'asaala' },
    ],
    questions: [
      { id: 'exp_rp_b2_007_q1', type: 'multiple_choice', question: 'From which script did Arabic calligraphy evolve?', questionArabic: 'من أي خط تطور الخط العربي؟', options: ['Greek', 'Nabataean', 'Phoenician', 'Aramaic'], correctIndex: 1 },
      { id: 'exp_rp_b2_007_q2', type: 'true_false', question: 'Calligraphy had no connection to religion.', questionArabic: 'الخط العربي لم يرتبط بالدين.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b2_007_q3', type: 'multiple_choice', question: 'Who excelled in developing new calligraphy styles?', questionArabic: 'من أبدع في تطوير أنماط جديدة للخط؟', options: ['Persian artists', 'Ottoman calligraphers', 'Egyptian scribes', 'Andalusian scholars'], correctIndex: 1 },
      { id: 'exp_rp_b2_007_q4', type: 'multiple_choice', question: 'How is calligraphy used today?', questionArabic: 'كيف يُستخدم الخط العربي اليوم؟', options: ['Only in mosques', 'In modern design and contemporary art', 'It is not used', 'Only in schools'], correctIndex: 1 },
    ],
    wordCount: 78,
  },

  // 8. Translation Challenges
  {
    id: 'exp_rp_b2_008',
    title: 'The Challenges of Translating Arabic',
    titleArabic: 'تحديات ترجمة اللغة العربية',
    cefrLevel: 'B2',
    topic: 'translation',
    textArabic: 'تواجه ترجمة النصوص العربية تحديات فريدة ناجمة عن خصائص اللغة ذاتها. نظام الجذور الثلاثية يخلق شبكة من المعاني المترابطة يصعب نقلها. تحمل كلمة واحدة كـ"عين" أكثر من عشرين معنى يتحدد بالسياق. يُضاف إلى ذلك التفاوت بين المستويات اللغوية من الفصحى إلى اللهجات المحلية. يرى المنظّرون أن الترجمة ليست نقلاً للكلمات بل نقلاً للثقافة والعقلية التي أنتجت النص الأصلي.',
    textEnglish: 'Translating Arabic texts faces unique challenges stemming from the characteristics of the language itself. The trilateral root system creates a network of interconnected meanings that are difficult to transfer. A single word like "\'ayn" carries more than twenty meanings determined by context. Added to this is the variation between linguistic levels from formal Arabic to local dialects. Theorists argue that translation is not transferring words but transferring the culture and mentality that produced the original text.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v167', arabic: 'ترجمة', english: 'translation', transliteration: 'tarjama' },
      { wordId: 'exp_rp_v168', arabic: 'جذور', english: 'roots', transliteration: 'judhuur' },
      { wordId: 'exp_rp_v169', arabic: 'سياق', english: 'context', transliteration: 'siyaaq' },
      { wordId: 'exp_rp_v170', arabic: 'تفاوت', english: 'variation/disparity', transliteration: 'tafaawut' },
      { wordId: 'exp_rp_v171', arabic: 'عقلية', english: 'mentality', transliteration: '\'aqliyya' },
    ],
    questions: [
      { id: 'exp_rp_b2_008_q1', type: 'multiple_choice', question: 'What creates interconnected meanings in Arabic?', questionArabic: 'ما الذي يخلق معاني مترابطة في العربية؟', options: ['Grammar rules', 'The trilateral root system', 'Vowel marks', 'Sentence structure'], correctIndex: 1 },
      { id: 'exp_rp_b2_008_q2', type: 'true_false', question: 'The word "\'ayn" has only one meaning.', questionArabic: 'كلمة "عين" لها معنى واحد فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'exp_rp_b2_008_q3', type: 'multiple_choice', question: 'What do theorists say translation is?', questionArabic: 'ماذا يقول المنظرون عن الترجمة؟', options: ['Transferring words only', 'Transferring culture and mentality', 'Impossible', 'Only for literature'], correctIndex: 1 },
    ],
    wordCount: 76,
  },

  // 9. Islamic Architecture
  {
    id: 'exp_rp_b2_009',
    title: 'Principles of Islamic Architecture',
    titleArabic: 'مبادئ العمارة الإسلامية',
    cefrLevel: 'B2',
    topic: 'islamic_architecture',
    textArabic: 'تقوم العمارة الإسلامية على مبادئ جمالية ووظيفية متداخلة. تتجلى في الأنماط الهندسية المتكررة التي ترمز إلى لا نهائية الخلق الإلهي. يلعب الفناء الداخلي دوراً محورياً في تصميم المنازل والمساجد موفراً الخصوصية والتهوية الطبيعية. تطورت المقرنصات من عنصر إنشائي إلى تحفة فنية ثلاثية الأبعاد تزين القباب والمداخل. يكتشف المعماريون المعاصرون في هذا التراث حلولاً مستدامة للتحديات البيئية الحالية.',
    textEnglish: 'Islamic architecture is built on interconnected aesthetic and functional principles. It manifests in repeating geometric patterns that symbolize the infinity of divine creation. The inner courtyard plays a pivotal role in the design of houses and mosques, providing privacy and natural ventilation. Muqarnas evolved from a structural element into a three-dimensional artistic masterpiece adorning domes and entrances. Contemporary architects discover in this heritage sustainable solutions for current environmental challenges.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v172', arabic: 'عمارة', english: 'architecture', transliteration: '\'imaara' },
      { wordId: 'exp_rp_v173', arabic: 'هندسية', english: 'geometric', transliteration: 'handasiyya' },
      { wordId: 'exp_rp_v174', arabic: 'فناء', english: 'courtyard', transliteration: 'finaa\'' },
      { wordId: 'exp_rp_v175', arabic: 'مقرنصات', english: 'muqarnas', transliteration: 'muqarnasaat' },
      { wordId: 'exp_rp_v176', arabic: 'مستدامة', english: 'sustainable', transliteration: 'mustadaama' },
    ],
    questions: [
      { id: 'exp_rp_b2_009_q1', type: 'multiple_choice', question: 'What do geometric patterns symbolize?', questionArabic: 'إلى ماذا ترمز الأنماط الهندسية؟', options: ['Political power', 'Infinity of divine creation', 'Wealth', 'Military strength'], correctIndex: 1 },
      { id: 'exp_rp_b2_009_q2', type: 'true_false', question: 'The inner courtyard provides privacy and ventilation.', questionArabic: 'الفناء الداخلي يوفر الخصوصية والتهوية.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_b2_009_q3', type: 'multiple_choice', question: 'What do contemporary architects find in this heritage?', questionArabic: 'ماذا يكتشف المعماريون المعاصرون في هذا التراث؟', options: ['Nothing useful', 'Sustainable solutions', 'Only decoration ideas', 'Historical facts'], correctIndex: 1 },
    ],
    wordCount: 74,
  },

  // 10. Comparative Linguistics
  {
    id: 'exp_rp_b2_010',
    title: 'Arabic and Its Semitic Sisters',
    titleArabic: 'العربية وأخواتها السامية',
    cefrLevel: 'B2',
    topic: 'comparative_linguistics',
    textArabic: 'تنتمي العربية إلى عائلة اللغات السامية إلى جانب العبرية والأمهرية والآرامية. تشترك هذه اللغات في نظام الجذور الثلاثية والتصريف الداخلي وأنماط صرفية متشابهة. تُعدّ العربية أكثر اللغات السامية انتشاراً واحتفاظاً بالسمات القديمة. يُظهر التحليل المقارن أن كلمات مثل "سلام" و"شالوم" العبرية تشترك في الجذر ذاته. يساعد علم اللسانيات المقارن في فهم تطور اللغات وعلاقاتها التاريخية وكيف تفرعت من أصل مشترك.',
    textEnglish: 'Arabic belongs to the Semitic language family alongside Hebrew, Amharic, and Aramaic. These languages share the trilateral root system, internal inflection, and similar morphological patterns. Arabic is considered the most widely spoken and best preserved of ancient Semitic features. Comparative analysis shows that words like "salaam" and Hebrew "shalom" share the same root. Comparative linguistics helps in understanding language evolution, historical relationships, and how they branched from a common origin.',
    vocabularyHighlights: [
      { wordId: 'exp_rp_v177', arabic: 'سامية', english: 'Semitic', transliteration: 'saamiyya' },
      { wordId: 'exp_rp_v178', arabic: 'تصريف', english: 'inflection/conjugation', transliteration: 'tasriif' },
      { wordId: 'exp_rp_v179', arabic: 'صرفية', english: 'morphological', transliteration: 'sarfiyya' },
      { wordId: 'exp_rp_v180', arabic: 'مقارن', english: 'comparative', transliteration: 'muqaarin' },
      { wordId: 'exp_rp_v181', arabic: 'أصل مشترك', english: 'common origin', transliteration: 'asl mushtarak' },
    ],
    questions: [
      { id: 'exp_rp_b2_010_q1', type: 'multiple_choice', question: 'Which language family does Arabic belong to?', questionArabic: 'إلى أي عائلة لغوية تنتمي العربية؟', options: ['Indo-European', 'Sino-Tibetan', 'Semitic', 'Uralic'], correctIndex: 2 },
      { id: 'exp_rp_b2_010_q2', type: 'true_false', question: '"Salaam" and "shalom" share the same root.', questionArabic: '"سلام" و"شالوم" يشتركان في الجذر نفسه.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'exp_rp_b2_010_q3', type: 'multiple_choice', question: 'What is Arabic\'s status among Semitic languages?', questionArabic: 'ما مكانة العربية بين اللغات السامية؟', options: ['Least spoken', 'Most widely spoken', 'Newest', 'Most simplified'], correctIndex: 1 },
    ],
    wordCount: 80,
  },
];

// ============================================================
// Combined export
// ============================================================

export const READING_PASSAGES_EXPANDED = [
  ...A1_EXPANDED,
  ...A2_EXPANDED,
  ...B1_EXPANDED,
  ...B2_EXPANDED,
];

// ============================================================
// Helper functions
// ============================================================

export function getExpandedPassagesByCefrLevel(level) {
  if (!level) return READING_PASSAGES_EXPANDED;
  return READING_PASSAGES_EXPANDED.filter(p => p.cefrLevel === level);
}

export function getExpandedPassageById(id) {
  return READING_PASSAGES_EXPANDED.find(p => p.id === id) || null;
}

export function getExpandedPassagesByTopic(topic) {
  if (!topic) return READING_PASSAGES_EXPANDED;
  return READING_PASSAGES_EXPANDED.filter(p => p.topic === topic);
}

export function getExpandedPassageCountByLevel() {
  const counts = { A1: 0, A2: 0, B1: 0, B2: 0 };
  for (const p of READING_PASSAGES_EXPANDED) {
    counts[p.cefrLevel]++;
  }
  return counts;
}
