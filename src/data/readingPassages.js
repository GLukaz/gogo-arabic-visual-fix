/**
 * readingPassages.js
 *
 * 60 graded Arabic reading passages across CEFR A1-B2 (15 per level).
 * Each passage has authentic Arabic text, English translation, vocabulary
 * highlights with real wordIds, and 3-5 comprehension questions.
 *
 * Phase 82 (READ-01 + READ-02)
 *
 * Schema:
 * {
 *   id:                    string   — e.g. 'a1_001'
 *   title:                 string   — English title
 *   titleArabic:           string   — Arabic title
 *   cefrLevel:             'A1'|'A2'|'B1'|'B2'
 *   topic:                 string   — greetings, food, travel, family, etc.
 *   textArabic:            string   — The Arabic passage (3-8 sentences)
 *   textEnglish:           string   — English translation
 *   vocabularyHighlights:  Array<{ wordId, arabic, english, transliteration }>
 *   questions:             Array<{ id, type, question, questionArabic, options, correctIndex }>
 *   wordCount:             number
 * }
 */

// ============================================================
// A1 PASSAGES — 15 entries
// Simple greetings, introductions, basic daily life, numbers,
// colors, family. 3-4 sentences, 20-40 words.
// ============================================================

const A1_PASSAGES = [
  {
    id: 'a1_001',
    title: 'My Name',
    titleArabic: 'اسمي',
    cefrLevel: 'A1',
    topic: 'daily_life',
    textArabic: 'اسمي سارة. أنا من مصر. أنا طالبة. أدرس اللغة العربية.',
    textEnglish: 'My name is Sara. I am from Egypt. I am a student. I study the Arabic language.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_031', arabic: 'أنا', english: 'I', transliteration: 'anaa' },
      { wordId: 'exp_a1_162', arabic: 'طالبة', english: 'student (f)', transliteration: 'taaliba' },
      { wordId: 'exp_a1_164', arabic: 'اللغة', english: 'language', transliteration: 'al-lugha' },
    ],
    questions: [
      { id: 'a1_001_q1', type: 'multiple_choice', question: 'What is the speaker\'s name?', questionArabic: 'ما اسم المتحدثة؟', options: ['Layla', 'Sara', 'Mona', 'Fatima'], correctIndex: 1 },
      { id: 'a1_001_q2', type: 'multiple_choice', question: 'Where is she from?', questionArabic: 'من أين هي؟', options: ['Morocco', 'Lebanon', 'Egypt', 'Jordan'], correctIndex: 2 },
      { id: 'a1_001_q3', type: 'true_false', question: 'She is a teacher.', questionArabic: 'هي معلمة.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 22,
  },
  {
    id: 'a1_002',
    title: 'Good Morning',
    titleArabic: 'صباح الخير',
    cefrLevel: 'A1',
    topic: 'greetings',
    textArabic: 'صباح الخير يا أحمد. كيف حالك؟ أنا بخير، الحمد لله. شكراً لك.',
    textEnglish: 'Good morning, Ahmed. How are you? I am fine, praise be to God. Thank you.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_005', arabic: 'صباح الخير', english: 'good morning', transliteration: 'sabaah al-khayr' },
      { wordId: 'exp_a1_007', arabic: 'كيف حالك', english: 'how are you', transliteration: 'kayfa haaluka' },
      { wordId: 'exp_a1_008', arabic: 'شكراً', english: 'thank you', transliteration: 'shukran' },
      { wordId: 'exp_a1_019', arabic: 'الحمد لله', english: 'praise be to God', transliteration: 'al-hamdu lillaah' },
    ],
    questions: [
      { id: 'a1_002_q1', type: 'multiple_choice', question: 'What time of day is it?', questionArabic: 'ما الوقت من اليوم؟', options: ['Evening', 'Morning', 'Afternoon', 'Night'], correctIndex: 1 },
      { id: 'a1_002_q2', type: 'true_false', question: 'The speaker is feeling unwell.', questionArabic: 'المتحدث يشعر بالتعب.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_002_q3', type: 'multiple_choice', question: 'Who is being greeted?', questionArabic: 'من تتم تحيته؟', options: ['Sara', 'Ahmed', 'Mohamed', 'Ali'], correctIndex: 1 },
    ],
    wordCount: 24,
  },
  {
    id: 'a1_003',
    title: 'My Family',
    titleArabic: 'عائلتي',
    cefrLevel: 'A1',
    topic: 'family',
    textArabic: 'عائلتي صغيرة. أبي معلم وأمي طبيبة. عندي أخ واحد. اسمه يوسف. هو طالب.',
    textEnglish: 'My family is small. My father is a teacher and my mother is a doctor. I have one brother. His name is Yusuf. He is a student.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_091', arabic: 'أبي', english: 'my father', transliteration: 'abii' },
      { wordId: 'exp_a1_092', arabic: 'أمي', english: 'my mother', transliteration: 'ummii' },
      { wordId: 'exp_a1_094', arabic: 'أخ', english: 'brother', transliteration: 'akh' },
      { wordId: 'exp_a1_161', arabic: 'معلم', english: 'teacher', transliteration: 'muallim' },
    ],
    questions: [
      { id: 'a1_003_q1', type: 'multiple_choice', question: 'How is the family described?', questionArabic: 'كيف وصفت العائلة؟', options: ['Big', 'Small', 'Happy', 'Old'], correctIndex: 1 },
      { id: 'a1_003_q2', type: 'multiple_choice', question: 'What is the mother\'s job?', questionArabic: 'ما عمل الأم؟', options: ['Teacher', 'Engineer', 'Doctor', 'Nurse'], correctIndex: 2 },
      { id: 'a1_003_q3', type: 'true_false', question: 'The speaker has two brothers.', questionArabic: 'عند المتحدث أخوان.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_003_q4', type: 'multiple_choice', question: 'What is the brother\'s name?', questionArabic: 'ما اسم الأخ؟', options: ['Ahmed', 'Ali', 'Yusuf', 'Omar'], correctIndex: 2 },
    ],
    wordCount: 28,
  },
  {
    id: 'a1_004',
    title: 'Colors Around Me',
    titleArabic: 'الألوان حولي',
    cefrLevel: 'A1',
    topic: 'daily_life',
    textArabic: 'السماء زرقاء. الشمس صفراء. الشجرة خضراء. الوردة حمراء. أحب الألوان.',
    textEnglish: 'The sky is blue. The sun is yellow. The tree is green. The rose is red. I love colors.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_131', arabic: 'أزرق', english: 'blue', transliteration: 'azraq' },
      { wordId: 'exp_a1_133', arabic: 'أخضر', english: 'green', transliteration: 'akhdar' },
      { wordId: 'exp_a1_130', arabic: 'أحمر', english: 'red', transliteration: 'ahmar' },
      { wordId: 'exp_a1_132', arabic: 'أصفر', english: 'yellow', transliteration: 'asfar' },
    ],
    questions: [
      { id: 'a1_004_q1', type: 'multiple_choice', question: 'What color is the sky?', questionArabic: 'ما لون السماء؟', options: ['Red', 'Green', 'Blue', 'Yellow'], correctIndex: 2 },
      { id: 'a1_004_q2', type: 'true_false', question: 'The tree is yellow.', questionArabic: 'الشجرة صفراء.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_004_q3', type: 'multiple_choice', question: 'What color is the rose?', questionArabic: 'ما لون الوردة؟', options: ['Blue', 'Green', 'Yellow', 'Red'], correctIndex: 3 },
    ],
    wordCount: 22,
  },
  {
    id: 'a1_005',
    title: 'Numbers in My Day',
    titleArabic: 'الأرقام في يومي',
    cefrLevel: 'A1',
    topic: 'daily_life',
    textArabic: 'عندي كتاب واحد وقلمان. في الصف عشرون طالباً. المعلم عنده خمسة كتب.',
    textEnglish: 'I have one book and two pens. In the class there are twenty students. The teacher has five books.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_111', arabic: 'واحد', english: 'one', transliteration: 'waahid' },
      { wordId: 'exp_a1_119', arabic: 'عشرون', english: 'twenty', transliteration: 'ishruun' },
      { wordId: 'exp_a1_115', arabic: 'خمسة', english: 'five', transliteration: 'khamsa' },
      { wordId: 'exp_a1_163', arabic: 'كتاب', english: 'book', transliteration: 'kitaab' },
    ],
    questions: [
      { id: 'a1_005_q1', type: 'multiple_choice', question: 'How many pens does the speaker have?', questionArabic: 'كم قلماً عند المتحدث؟', options: ['One', 'Two', 'Three', 'Five'], correctIndex: 1 },
      { id: 'a1_005_q2', type: 'multiple_choice', question: 'How many students are in the class?', questionArabic: 'كم طالباً في الصف؟', options: ['Ten', 'Fifteen', 'Twenty', 'Thirty'], correctIndex: 2 },
      { id: 'a1_005_q3', type: 'true_false', question: 'The teacher has three books.', questionArabic: 'عند المعلم ثلاثة كتب.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 24,
  },
  {
    id: 'a1_006',
    title: 'My House',
    titleArabic: 'بيتي',
    cefrLevel: 'A1',
    topic: 'daily_life',
    textArabic: 'بيتي كبير. فيه ثلاث غرف. المطبخ صغير. الحديقة جميلة. أحب بيتي.',
    textEnglish: 'My house is big. It has three rooms. The kitchen is small. The garden is beautiful. I love my house.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_151', arabic: 'بيت', english: 'house', transliteration: 'bayt' },
      { wordId: 'exp_a1_153', arabic: 'غرفة', english: 'room', transliteration: 'ghurfa' },
      { wordId: 'exp_a1_155', arabic: 'مطبخ', english: 'kitchen', transliteration: 'matbakh' },
    ],
    questions: [
      { id: 'a1_006_q1', type: 'multiple_choice', question: 'How is the house described?', questionArabic: 'كيف وصف البيت؟', options: ['Small', 'Big', 'Old', 'New'], correctIndex: 1 },
      { id: 'a1_006_q2', type: 'true_false', question: 'The kitchen is big.', questionArabic: 'المطبخ كبير.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_006_q3', type: 'multiple_choice', question: 'How many rooms are in the house?', questionArabic: 'كم غرفة في البيت؟', options: ['Two', 'Three', 'Four', 'Five'], correctIndex: 1 },
    ],
    wordCount: 22,
  },
  {
    id: 'a1_007',
    title: 'What I Eat',
    titleArabic: 'ماذا آكل',
    cefrLevel: 'A1',
    topic: 'food',
    textArabic: 'أشرب الحليب في الصباح. آكل الخبز والجبن. أحب الفواكه كثيراً.',
    textEnglish: 'I drink milk in the morning. I eat bread and cheese. I love fruits very much.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_201', arabic: 'حليب', english: 'milk', transliteration: 'haliib' },
      { wordId: 'exp_a1_211', arabic: 'خبز', english: 'bread', transliteration: 'khubz' },
      { wordId: 'exp_a1_213', arabic: 'جبن', english: 'cheese', transliteration: 'jubn' },
      { wordId: 'exp_a1_215', arabic: 'فواكه', english: 'fruits', transliteration: 'fawakih' },
    ],
    questions: [
      { id: 'a1_007_q1', type: 'multiple_choice', question: 'What does the speaker drink in the morning?', questionArabic: 'ماذا يشرب المتحدث في الصباح؟', options: ['Tea', 'Juice', 'Milk', 'Water'], correctIndex: 2 },
      { id: 'a1_007_q2', type: 'true_false', question: 'The speaker eats rice and meat.', questionArabic: 'يأكل المتحدث الأرز واللحم.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_007_q3', type: 'multiple_choice', question: 'What does the speaker love?', questionArabic: 'ماذا يحب المتحدث؟', options: ['Vegetables', 'Sweets', 'Fruits', 'Fish'], correctIndex: 2 },
    ],
    wordCount: 20,
  },
  {
    id: 'a1_008',
    title: 'My School',
    titleArabic: 'مدرستي',
    cefrLevel: 'A1',
    topic: 'education',
    textArabic: 'مدرستي قريبة من بيتي. أذهب إلى المدرسة كل يوم. عندي أصدقاء كثيرون. أحب المدرسة.',
    textEnglish: 'My school is close to my house. I go to school every day. I have many friends. I love school.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_160', arabic: 'مدرسة', english: 'school', transliteration: 'madrasa' },
      { wordId: 'exp_a1_073', arabic: 'كل', english: 'every', transliteration: 'kull' },
      { wordId: 'exp_a1_081', arabic: 'يوم', english: 'day', transliteration: 'yawm' },
    ],
    questions: [
      { id: 'a1_008_q1', type: 'true_false', question: 'The school is far from the house.', questionArabic: 'المدرسة بعيدة عن البيت.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_008_q2', type: 'multiple_choice', question: 'How often does the speaker go to school?', questionArabic: 'كم مرة يذهب المتحدث إلى المدرسة؟', options: ['Sometimes', 'Every day', 'Once a week', 'Rarely'], correctIndex: 1 },
      { id: 'a1_008_q3', type: 'true_false', question: 'The speaker likes school.', questionArabic: 'يحب المتحدث المدرسة.', options: ['True', 'False'], correctIndex: 0 },
    ],
    wordCount: 24,
  },
  {
    id: 'a1_009',
    title: 'The Days of the Week',
    titleArabic: 'أيام الأسبوع',
    cefrLevel: 'A1',
    topic: 'daily_life',
    textArabic: 'اليوم يوم الأحد. غداً يوم الاثنين. أدرس من الأحد إلى الخميس. يوم الجمعة عطلة.',
    textEnglish: 'Today is Sunday. Tomorrow is Monday. I study from Sunday to Thursday. Friday is a holiday.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_081', arabic: 'يوم', english: 'day', transliteration: 'yawm' },
      { wordId: 'exp_a1_082', arabic: 'غداً', english: 'tomorrow', transliteration: 'ghadan' },
      { wordId: 'exp_a1_089', arabic: 'الجمعة', english: 'Friday', transliteration: 'al-jumua' },
    ],
    questions: [
      { id: 'a1_009_q1', type: 'multiple_choice', question: 'What day is it today?', questionArabic: 'ما اليوم؟', options: ['Monday', 'Sunday', 'Friday', 'Wednesday'], correctIndex: 1 },
      { id: 'a1_009_q2', type: 'true_false', question: 'The speaker studies on Friday.', questionArabic: 'يدرس المتحدث يوم الجمعة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_009_q3', type: 'multiple_choice', question: 'Which day is a holiday?', questionArabic: 'أي يوم عطلة؟', options: ['Sunday', 'Monday', 'Thursday', 'Friday'], correctIndex: 3 },
    ],
    wordCount: 24,
  },
  {
    id: 'a1_010',
    title: 'At the Park',
    titleArabic: 'في الحديقة',
    cefrLevel: 'A1',
    topic: 'nature',
    textArabic: 'أذهب إلى الحديقة مع أختي. الأشجار كبيرة وخضراء. الطيور تغني. الجو جميل اليوم.',
    textEnglish: 'I go to the park with my sister. The trees are big and green. The birds are singing. The weather is beautiful today.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_095', arabic: 'أخت', english: 'sister', transliteration: 'ukht' },
      { wordId: 'exp_a1_301', arabic: 'شجرة', english: 'tree', transliteration: 'shajara' },
      { wordId: 'exp_a1_305', arabic: 'طيور', english: 'birds', transliteration: 'tuyuur' },
    ],
    questions: [
      { id: 'a1_010_q1', type: 'multiple_choice', question: 'Who does the speaker go with?', questionArabic: 'مع من يذهب المتحدث؟', options: ['Brother', 'Friend', 'Sister', 'Father'], correctIndex: 2 },
      { id: 'a1_010_q2', type: 'true_false', question: 'The trees are small.', questionArabic: 'الأشجار صغيرة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_010_q3', type: 'multiple_choice', question: 'What are the birds doing?', questionArabic: 'ماذا تفعل الطيور؟', options: ['Flying', 'Singing', 'Eating', 'Sleeping'], correctIndex: 1 },
    ],
    wordCount: 23,
  },
  {
    id: 'a1_011',
    title: 'My Daily Routine',
    titleArabic: 'روتيني اليومي',
    cefrLevel: 'A1',
    topic: 'daily_life',
    textArabic: 'أستيقظ في الساعة السادسة. أغسل وجهي. آكل الفطور. أذهب إلى المدرسة.',
    textEnglish: 'I wake up at six o\'clock. I wash my face. I eat breakfast. I go to school.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_181', arabic: 'أستيقظ', english: 'I wake up', transliteration: 'astayqidhu' },
      { wordId: 'exp_a1_085', arabic: 'الساعة', english: 'the hour / o\'clock', transliteration: 'as-saaa' },
      { wordId: 'exp_a1_160', arabic: 'المدرسة', english: 'school', transliteration: 'al-madrasa' },
    ],
    questions: [
      { id: 'a1_011_q1', type: 'multiple_choice', question: 'What time does the speaker wake up?', questionArabic: 'متى يستيقظ المتحدث؟', options: ['Five', 'Six', 'Seven', 'Eight'], correctIndex: 1 },
      { id: 'a1_011_q2', type: 'true_false', question: 'The speaker goes to work after breakfast.', questionArabic: 'يذهب المتحدث إلى العمل بعد الفطور.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_011_q3', type: 'multiple_choice', question: 'What does the speaker wash?', questionArabic: 'ماذا يغسل المتحدث؟', options: ['Hands', 'Face', 'Hair', 'Clothes'], correctIndex: 1 },
    ],
    wordCount: 21,
  },
  {
    id: 'a1_012',
    title: 'The Weather',
    titleArabic: 'الطقس',
    cefrLevel: 'A1',
    topic: 'nature',
    textArabic: 'اليوم حار جداً. الشمس ساطعة. أريد ماءً بارداً. الصيف حار في بلدي.',
    textEnglish: 'Today is very hot. The sun is bright. I want cold water. Summer is hot in my country.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_311', arabic: 'حار', english: 'hot', transliteration: 'haar' },
      { wordId: 'exp_a1_313', arabic: 'الشمس', english: 'the sun', transliteration: 'ash-shams' },
      { wordId: 'exp_a1_203', arabic: 'ماء', english: 'water', transliteration: 'maa' },
    ],
    questions: [
      { id: 'a1_012_q1', type: 'multiple_choice', question: 'How is the weather today?', questionArabic: 'كيف الطقس اليوم؟', options: ['Cold', 'Rainy', 'Hot', 'Windy'], correctIndex: 2 },
      { id: 'a1_012_q2', type: 'true_false', question: 'The speaker wants hot tea.', questionArabic: 'يريد المتحدث شاياً ساخناً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_012_q3', type: 'multiple_choice', question: 'What season is mentioned?', questionArabic: 'أي فصل ذُكر؟', options: ['Winter', 'Spring', 'Summer', 'Autumn'], correctIndex: 2 },
    ],
    wordCount: 21,
  },
  {
    id: 'a1_013',
    title: 'My Friend',
    titleArabic: 'صديقي',
    cefrLevel: 'A1',
    topic: 'daily_life',
    textArabic: 'صديقي اسمه خالد. هو طويل. يحب كرة القدم. نلعب معاً كل يوم.',
    textEnglish: 'My friend\'s name is Khalid. He is tall. He loves football. We play together every day.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_097', arabic: 'صديق', english: 'friend', transliteration: 'sadiiq' },
      { wordId: 'exp_a1_141', arabic: 'طويل', english: 'tall', transliteration: 'tawiil' },
      { wordId: 'exp_a1_073', arabic: 'كل', english: 'every', transliteration: 'kull' },
    ],
    questions: [
      { id: 'a1_013_q1', type: 'multiple_choice', question: 'What is the friend\'s name?', questionArabic: 'ما اسم الصديق؟', options: ['Ahmed', 'Omar', 'Khalid', 'Ali'], correctIndex: 2 },
      { id: 'a1_013_q2', type: 'true_false', question: 'Khalid is short.', questionArabic: 'خالد قصير.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_013_q3', type: 'multiple_choice', question: 'What does Khalid love?', questionArabic: 'ماذا يحب خالد؟', options: ['Basketball', 'Football', 'Swimming', 'Reading'], correctIndex: 1 },
    ],
    wordCount: 20,
  },
  {
    id: 'a1_014',
    title: 'Introducing Myself',
    titleArabic: 'أقدم نفسي',
    cefrLevel: 'A1',
    topic: 'greetings',
    textArabic: 'السلام عليكم. اسمي عمر. عمري عشر سنوات. أنا من تونس. أتكلم العربية والفرنسية.',
    textEnglish: 'Peace be upon you. My name is Omar. I am ten years old. I am from Tunisia. I speak Arabic and French.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_001', arabic: 'السلام عليكم', english: 'peace be upon you', transliteration: 'as-salaamu alaykum' },
      { wordId: 'exp_a1_118', arabic: 'عشر', english: 'ten', transliteration: 'ashr' },
      { wordId: 'exp_a1_164', arabic: 'العربية', english: 'Arabic', transliteration: 'al-arabiyya' },
    ],
    questions: [
      { id: 'a1_014_q1', type: 'multiple_choice', question: 'How old is Omar?', questionArabic: 'كم عمر عمر؟', options: ['Eight', 'Nine', 'Ten', 'Twelve'], correctIndex: 2 },
      { id: 'a1_014_q2', type: 'multiple_choice', question: 'Where is Omar from?', questionArabic: 'من أين عمر؟', options: ['Egypt', 'Morocco', 'Algeria', 'Tunisia'], correctIndex: 3 },
      { id: 'a1_014_q3', type: 'true_false', question: 'Omar speaks Arabic and English.', questionArabic: 'يتكلم عمر العربية والإنجليزية.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 25,
  },
  {
    id: 'a1_015',
    title: 'My Favorite Food',
    titleArabic: 'طعامي المفضل',
    cefrLevel: 'A1',
    topic: 'food',
    textArabic: 'أحب الأرز والدجاج. أمي تطبخ جيداً. الطعام لذيذ. نأكل معاً في المساء.',
    textEnglish: 'I love rice and chicken. My mother cooks well. The food is delicious. We eat together in the evening.',
    vocabularyHighlights: [
      { wordId: 'exp_a1_209', arabic: 'الأرز', english: 'rice', transliteration: 'al-aruzz' },
      { wordId: 'exp_a1_207', arabic: 'الدجاج', english: 'chicken', transliteration: 'ad-dajaaj' },
      { wordId: 'exp_a1_092', arabic: 'أمي', english: 'my mother', transliteration: 'ummii' },
    ],
    questions: [
      { id: 'a1_015_q1', type: 'multiple_choice', question: 'What food does the speaker love?', questionArabic: 'ما الطعام الذي يحبه المتحدث؟', options: ['Fish and salad', 'Rice and chicken', 'Bread and cheese', 'Soup and bread'], correctIndex: 1 },
      { id: 'a1_015_q2', type: 'true_false', question: 'The food is not tasty.', questionArabic: 'الطعام ليس لذيذاً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a1_015_q3', type: 'multiple_choice', question: 'When do they eat together?', questionArabic: 'متى يأكلون معاً؟', options: ['Morning', 'Noon', 'Evening', 'Night'], correctIndex: 2 },
    ],
    wordCount: 22,
  },
];

// ============================================================
// A2 PASSAGES — 15 entries
// Shopping, directions, food ordering, describing people,
// simple stories. 4-5 sentences, 40-60 words.
// ============================================================

const A2_PASSAGES = [
  {
    id: 'a2_001',
    title: 'At the Market',
    titleArabic: 'في السوق',
    cefrLevel: 'A2',
    topic: 'shopping',
    textArabic: 'ذهبت إلى السوق لأشتري خضروات وفواكه. وجدت طماطم طازجة وبرتقالاً حلواً. سألت البائع عن السعر. كان السعر معقولاً فاشتريت كثيراً. حملت الأكياس ورجعت إلى البيت.',
    textEnglish: 'I went to the market to buy vegetables and fruits. I found fresh tomatoes and sweet oranges. I asked the seller about the price. The price was reasonable, so I bought a lot. I carried the bags and returned home.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_201', arabic: 'خضروات', english: 'vegetables', transliteration: 'khudarawaat' },
      { wordId: 'exp_a2_211', arabic: 'طازج', english: 'fresh', transliteration: 'taazij' },
      { wordId: 'exp_a2_301', arabic: 'البائع', english: 'the seller', transliteration: 'al-baai' },
      { wordId: 'exp_a2_305', arabic: 'السعر', english: 'the price', transliteration: 'as-sir' },
    ],
    questions: [
      { id: 'a2_001_q1', type: 'multiple_choice', question: 'Why did the speaker go to the market?', questionArabic: 'لماذا ذهب المتحدث إلى السوق؟', options: ['To buy clothes', 'To buy vegetables and fruits', 'To meet a friend', 'To buy books'], correctIndex: 1 },
      { id: 'a2_001_q2', type: 'true_false', question: 'The price was very expensive.', questionArabic: 'كان السعر غالياً جداً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_001_q3', type: 'multiple_choice', question: 'What fruit did the speaker find?', questionArabic: 'ما الفاكهة التي وجدها المتحدث؟', options: ['Apples', 'Bananas', 'Oranges', 'Grapes'], correctIndex: 2 },
      { id: 'a2_001_q4', type: 'true_false', question: 'The tomatoes were old and dry.', questionArabic: 'كانت الطماطم قديمة وجافة.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 42,
  },
  {
    id: 'a2_002',
    title: 'Asking for Directions',
    titleArabic: 'السؤال عن الاتجاهات',
    cefrLevel: 'A2',
    topic: 'travel',
    textArabic: 'أنا تائه في المدينة. سألت رجلاً عن المستشفى. قال لي: اذهب مباشرة ثم انعطف يميناً. المستشفى بعد المسجد على اليسار. شكرته ومشيت.',
    textEnglish: 'I am lost in the city. I asked a man about the hospital. He told me: go straight then turn right. The hospital is after the mosque on the left. I thanked him and walked.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_401', arabic: 'تائه', english: 'lost', transliteration: 'taaih' },
      { wordId: 'exp_a2_403', arabic: 'المستشفى', english: 'the hospital', transliteration: 'al-mustashfaa' },
      { wordId: 'exp_a2_411', arabic: 'يميناً', english: 'right', transliteration: 'yamiinan' },
      { wordId: 'exp_a2_413', arabic: 'اليسار', english: 'the left', transliteration: 'al-yasaar' },
    ],
    questions: [
      { id: 'a2_002_q1', type: 'multiple_choice', question: 'What is the speaker looking for?', questionArabic: 'عن ماذا يبحث المتحدث؟', options: ['The school', 'The hospital', 'The market', 'The hotel'], correctIndex: 1 },
      { id: 'a2_002_q2', type: 'multiple_choice', question: 'What should the speaker do first?', questionArabic: 'ماذا يجب أن يفعل المتحدث أولاً؟', options: ['Turn left', 'Turn right', 'Go straight', 'Go back'], correctIndex: 2 },
      { id: 'a2_002_q3', type: 'true_false', question: 'The hospital is before the mosque.', questionArabic: 'المستشفى قبل المسجد.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_002_q4', type: 'multiple_choice', question: 'On which side is the hospital?', questionArabic: 'على أي جانب المستشفى؟', options: ['Right', 'Left', 'Straight ahead', 'Behind'], correctIndex: 1 },
    ],
    wordCount: 40,
  },
  {
    id: 'a2_003',
    title: 'Ordering Food',
    titleArabic: 'طلب الطعام',
    cefrLevel: 'A2',
    topic: 'food',
    textArabic: 'دخلت المطعم وجلست على الطاولة. جاء النادل وأعطاني قائمة الطعام. طلبت شوربة عدس ودجاجاً مشوياً مع أرز. كان الطعام لذيذاً جداً. دفعت الحساب وتركت بقشيشاً.',
    textEnglish: 'I entered the restaurant and sat at the table. The waiter came and gave me the menu. I ordered lentil soup and grilled chicken with rice. The food was very delicious. I paid the bill and left a tip.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_101', arabic: 'المطعم', english: 'the restaurant', transliteration: 'al-matam' },
      { wordId: 'exp_a2_103', arabic: 'النادل', english: 'the waiter', transliteration: 'an-naadil' },
      { wordId: 'exp_a2_107', arabic: 'شوربة', english: 'soup', transliteration: 'shuurba' },
      { wordId: 'exp_a2_111', arabic: 'مشوي', english: 'grilled', transliteration: 'mashwii' },
    ],
    questions: [
      { id: 'a2_003_q1', type: 'multiple_choice', question: 'What did the speaker order?', questionArabic: 'ماذا طلب المتحدث؟', options: ['Pizza and salad', 'Lentil soup and grilled chicken', 'Fish and rice', 'Kebab and bread'], correctIndex: 1 },
      { id: 'a2_003_q2', type: 'true_false', question: 'The food was bad.', questionArabic: 'كان الطعام سيئاً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_003_q3', type: 'multiple_choice', question: 'Who gave the speaker the menu?', questionArabic: 'من أعطى المتحدث قائمة الطعام؟', options: ['The cook', 'The waiter', 'A friend', 'The manager'], correctIndex: 1 },
      { id: 'a2_003_q4', type: 'true_false', question: 'The speaker left a tip.', questionArabic: 'ترك المتحدث بقشيشاً.', options: ['True', 'False'], correctIndex: 0 },
    ],
    wordCount: 45,
  },
  {
    id: 'a2_004',
    title: 'My Neighbor',
    titleArabic: 'جاري',
    cefrLevel: 'A2',
    topic: 'daily_life',
    textArabic: 'جاري رجل كبير في السن. هو لطيف جداً. كل صباح يجلس في حديقته ويشرب القهوة. أحياناً نتحدث معاً عن الأخبار. يحكي لي قصصاً عن الماضي.',
    textEnglish: 'My neighbor is an elderly man. He is very kind. Every morning he sits in his garden and drinks coffee. Sometimes we talk together about the news. He tells me stories about the past.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_151', arabic: 'جار', english: 'neighbor', transliteration: 'jaar' },
      { wordId: 'exp_a2_153', arabic: 'القهوة', english: 'coffee', transliteration: 'al-qahwa' },
      { wordId: 'exp_a2_155', arabic: 'الأخبار', english: 'the news', transliteration: 'al-akhbaar' },
      { wordId: 'exp_a2_157', arabic: 'قصص', english: 'stories', transliteration: 'qisas' },
    ],
    questions: [
      { id: 'a2_004_q1', type: 'multiple_choice', question: 'How is the neighbor described?', questionArabic: 'كيف وصف الجار؟', options: ['Young and busy', 'Elderly and kind', 'Tall and strong', 'Quiet and shy'], correctIndex: 1 },
      { id: 'a2_004_q2', type: 'true_false', question: 'The neighbor drinks tea in the morning.', questionArabic: 'يشرب الجار الشاي في الصباح.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_004_q3', type: 'multiple_choice', question: 'What does the neighbor tell the speaker?', questionArabic: 'ماذا يحكي الجار للمتحدث؟', options: ['Jokes', 'Stories about the past', 'Songs', 'Recipes'], correctIndex: 1 },
    ],
    wordCount: 44,
  },
  {
    id: 'a2_005',
    title: 'The Bus Ride',
    titleArabic: 'رحلة الحافلة',
    cefrLevel: 'A2',
    topic: 'travel',
    textArabic: 'ركبت الحافلة من المحطة في الصباح الباكر. كان هناك ركاب كثيرون. جلست بجانب النافذة ونظرت إلى الشوارع. استغرقت الرحلة ساعة واحدة. وصلت إلى المدينة في الوقت المحدد.',
    textEnglish: 'I took the bus from the station early in the morning. There were many passengers. I sat by the window and looked at the streets. The trip took one hour. I arrived at the city on time.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_421', arabic: 'الحافلة', english: 'the bus', transliteration: 'al-haafila' },
      { wordId: 'exp_a2_423', arabic: 'المحطة', english: 'the station', transliteration: 'al-mahatta' },
      { wordId: 'exp_a2_425', arabic: 'ركاب', english: 'passengers', transliteration: 'rukkaab' },
      { wordId: 'exp_a2_427', arabic: 'النافذة', english: 'the window', transliteration: 'an-naafidha' },
    ],
    questions: [
      { id: 'a2_005_q1', type: 'multiple_choice', question: 'How long was the trip?', questionArabic: 'كم استغرقت الرحلة؟', options: ['30 minutes', 'One hour', 'Two hours', 'Three hours'], correctIndex: 1 },
      { id: 'a2_005_q2', type: 'true_false', question: 'The speaker sat in the aisle seat.', questionArabic: 'جلس المتحدث في مقعد الممر.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_005_q3', type: 'multiple_choice', question: 'Were there many passengers?', questionArabic: 'هل كان هناك ركاب كثيرون؟', options: ['No, the bus was empty', 'Yes, there were many', 'Only a few', 'The speaker was alone'], correctIndex: 1 },
      { id: 'a2_005_q4', type: 'true_false', question: 'The speaker arrived late.', questionArabic: 'وصل المتحدث متأخراً.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 43,
  },
  {
    id: 'a2_006',
    title: 'A Letter from My Cousin',
    titleArabic: 'رسالة من ابن عمي',
    cefrLevel: 'A2',
    topic: 'family',
    textArabic: 'وصلتني رسالة من ابن عمي في الأردن. أخبرني أنه تخرج من الجامعة. وجد عملاً جديداً في شركة كبيرة. فرحت كثيراً وأرسلت له تهنئة. أتمنى أن أزوره قريباً.',
    textEnglish: 'I received a letter from my cousin in Jordan. He told me he graduated from university. He found a new job at a big company. I was very happy and sent him congratulations. I wish to visit him soon.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_091', arabic: 'ابن عم', english: 'cousin (paternal)', transliteration: 'ibn amm' },
      { wordId: 'exp_a2_161', arabic: 'الجامعة', english: 'the university', transliteration: 'al-jaamia' },
      { wordId: 'exp_a2_163', arabic: 'شركة', english: 'company', transliteration: 'sharika' },
    ],
    questions: [
      { id: 'a2_006_q1', type: 'multiple_choice', question: 'Where does the cousin live?', questionArabic: 'أين يعيش ابن العم؟', options: ['Egypt', 'Lebanon', 'Jordan', 'Iraq'], correctIndex: 2 },
      { id: 'a2_006_q2', type: 'true_false', question: 'The cousin is still studying at university.', questionArabic: 'ابن العم ما زال يدرس في الجامعة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_006_q3', type: 'multiple_choice', question: 'What did the cousin find?', questionArabic: 'ماذا وجد ابن العم؟', options: ['A house', 'A new job', 'A wife', 'A car'], correctIndex: 1 },
      { id: 'a2_006_q4', type: 'true_false', question: 'The speaker was sad about the news.', questionArabic: 'كان المتحدث حزيناً بسبب الخبر.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 45,
  },
  {
    id: 'a2_007',
    title: 'At the Doctor',
    titleArabic: 'عند الطبيب',
    cefrLevel: 'A2',
    topic: 'health',
    textArabic: 'ذهبت إلى الطبيب لأنني أشعر بالتعب. فحصني الطبيب وقال إنني أحتاج إلى الراحة. كتب لي دواءً. نصحني أن أنام باكراً وأشرب ماءً كثيراً. شعرت بالتحسن بعد يومين.',
    textEnglish: 'I went to the doctor because I feel tired. The doctor examined me and said I need rest. He wrote me a prescription. He advised me to sleep early and drink lots of water. I felt better after two days.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_501', arabic: 'الطبيب', english: 'the doctor', transliteration: 'at-tabiib' },
      { wordId: 'exp_a2_503', arabic: 'التعب', english: 'tiredness', transliteration: 'at-taab' },
      { wordId: 'exp_a2_505', arabic: 'دواء', english: 'medicine', transliteration: 'dawaa' },
      { wordId: 'exp_a2_507', arabic: 'الراحة', english: 'rest', transliteration: 'ar-raaha' },
    ],
    questions: [
      { id: 'a2_007_q1', type: 'multiple_choice', question: 'Why did the speaker go to the doctor?', questionArabic: 'لماذا ذهب المتحدث إلى الطبيب؟', options: ['Headache', 'Feeling tired', 'Broken arm', 'Stomachache'], correctIndex: 1 },
      { id: 'a2_007_q2', type: 'true_false', question: 'The doctor said no medicine was needed.', questionArabic: 'قال الطبيب إنه لا حاجة لدواء.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_007_q3', type: 'multiple_choice', question: 'What did the doctor advise?', questionArabic: 'ماذا نصح الطبيب؟', options: ['Exercise more', 'Sleep early and drink water', 'Stop eating', 'Travel'], correctIndex: 1 },
      { id: 'a2_007_q4', type: 'true_false', question: 'The speaker felt better after a week.', questionArabic: 'شعر المتحدث بالتحسن بعد أسبوع.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 47,
  },
  {
    id: 'a2_008',
    title: 'My Hobby',
    titleArabic: 'هوايتي',
    cefrLevel: 'A2',
    topic: 'sports',
    textArabic: 'هوايتي المفضلة هي السباحة. أذهب إلى المسبح ثلاث مرات في الأسبوع. تعلمت السباحة عندما كنت صغيراً. السباحة رياضة ممتازة للجسم. أشجع أصدقائي أن يتعلموا السباحة أيضاً.',
    textEnglish: 'My favorite hobby is swimming. I go to the pool three times a week. I learned to swim when I was young. Swimming is an excellent sport for the body. I encourage my friends to learn swimming too.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_601', arabic: 'السباحة', english: 'swimming', transliteration: 'as-sibaaha' },
      { wordId: 'exp_a2_603', arabic: 'المسبح', english: 'the pool', transliteration: 'al-masbah' },
      { wordId: 'exp_a2_605', arabic: 'رياضة', english: 'sport', transliteration: 'riyaada' },
    ],
    questions: [
      { id: 'a2_008_q1', type: 'multiple_choice', question: 'What is the speaker\'s hobby?', questionArabic: 'ما هواية المتحدث؟', options: ['Running', 'Swimming', 'Football', 'Reading'], correctIndex: 1 },
      { id: 'a2_008_q2', type: 'multiple_choice', question: 'How often does the speaker swim?', questionArabic: 'كم مرة يسبح المتحدث؟', options: ['Once a week', 'Twice a week', 'Three times a week', 'Every day'], correctIndex: 2 },
      { id: 'a2_008_q3', type: 'true_false', question: 'The speaker learned swimming as an adult.', questionArabic: 'تعلم المتحدث السباحة وهو كبير.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 42,
  },
  {
    id: 'a2_009',
    title: 'Buying Clothes',
    titleArabic: 'شراء الملابس',
    cefrLevel: 'A2',
    topic: 'shopping',
    textArabic: 'ذهبت مع أختي إلى متجر الملابس. أرادت أن تشتري فستاناً جديداً. جربت فساتين كثيرة بألوان مختلفة. في النهاية اختارت فستاناً أزرق جميلاً. كان السعر مناسباً.',
    textEnglish: 'I went with my sister to the clothing store. She wanted to buy a new dress. She tried many dresses in different colors. In the end, she chose a beautiful blue dress. The price was suitable.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_311', arabic: 'متجر', english: 'store', transliteration: 'matjar' },
      { wordId: 'exp_a2_313', arabic: 'الملابس', english: 'clothes', transliteration: 'al-malaabis' },
      { wordId: 'exp_a2_315', arabic: 'فستان', english: 'dress', transliteration: 'fustaan' },
      { wordId: 'exp_a2_305', arabic: 'السعر', english: 'the price', transliteration: 'as-sir' },
    ],
    questions: [
      { id: 'a2_009_q1', type: 'multiple_choice', question: 'Who wanted to buy a dress?', questionArabic: 'من أرادت شراء فستان؟', options: ['The speaker', 'The mother', 'The sister', 'A friend'], correctIndex: 2 },
      { id: 'a2_009_q2', type: 'multiple_choice', question: 'What color dress was chosen?', questionArabic: 'ما لون الفستان المختار؟', options: ['Red', 'Green', 'Blue', 'White'], correctIndex: 2 },
      { id: 'a2_009_q3', type: 'true_false', question: 'The dress was too expensive.', questionArabic: 'كان الفستان غالياً جداً.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 43,
  },
  {
    id: 'a2_010',
    title: 'The Weekend Plan',
    titleArabic: 'خطة نهاية الأسبوع',
    cefrLevel: 'A2',
    topic: 'daily_life',
    textArabic: 'في نهاية الأسبوع سأذهب إلى الشاطئ مع عائلتي. سنسبح في البحر ونلعب على الرمل. أمي ستحضر طعاماً لذيذاً. سنقضي يوماً ممتعاً بإذن الله.',
    textEnglish: 'On the weekend, I will go to the beach with my family. We will swim in the sea and play on the sand. My mother will prepare delicious food. We will spend an enjoyable day, God willing.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_431', arabic: 'الشاطئ', english: 'the beach', transliteration: 'ash-shaati' },
      { wordId: 'exp_a2_433', arabic: 'البحر', english: 'the sea', transliteration: 'al-bahr' },
      { wordId: 'exp_a2_435', arabic: 'الرمل', english: 'the sand', transliteration: 'ar-raml' },
    ],
    questions: [
      { id: 'a2_010_q1', type: 'multiple_choice', question: 'Where will the family go?', questionArabic: 'إلى أين ستذهب العائلة؟', options: ['The park', 'The mountains', 'The beach', 'The mall'], correctIndex: 2 },
      { id: 'a2_010_q2', type: 'true_false', question: 'They will swim in a pool.', questionArabic: 'سيسبحون في المسبح.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_010_q3', type: 'multiple_choice', question: 'Who will prepare the food?', questionArabic: 'من سيحضر الطعام؟', options: ['The father', 'The mother', 'The speaker', 'A restaurant'], correctIndex: 1 },
    ],
    wordCount: 40,
  },
  {
    id: 'a2_011',
    title: 'Learning Arabic',
    titleArabic: 'تعلم العربية',
    cefrLevel: 'A2',
    topic: 'education',
    textArabic: 'أدرس اللغة العربية منذ سنة. في البداية كانت صعبة لكنني لم أستسلم. أتدرب على القراءة والكتابة كل يوم. الآن أستطيع أن أقرأ قصصاً قصيرة. هدفي أن أتكلم بطلاقة.',
    textEnglish: 'I have been studying Arabic for a year. In the beginning it was difficult but I did not give up. I practice reading and writing every day. Now I can read short stories. My goal is to speak fluently.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_161', arabic: 'اللغة العربية', english: 'Arabic language', transliteration: 'al-lugha al-arabiyya' },
      { wordId: 'exp_a2_171', arabic: 'القراءة', english: 'reading', transliteration: 'al-qiraaa' },
      { wordId: 'exp_a2_173', arabic: 'الكتابة', english: 'writing', transliteration: 'al-kitaaba' },
    ],
    questions: [
      { id: 'a2_011_q1', type: 'multiple_choice', question: 'How long has the speaker been studying?', questionArabic: 'منذ متى يدرس المتحدث؟', options: ['Six months', 'One year', 'Two years', 'Three years'], correctIndex: 1 },
      { id: 'a2_011_q2', type: 'true_false', question: 'Arabic was easy from the beginning.', questionArabic: 'كانت العربية سهلة من البداية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_011_q3', type: 'multiple_choice', question: 'What is the speaker\'s goal?', questionArabic: 'ما هدف المتحدث؟', options: ['To read novels', 'To speak fluently', 'To write poems', 'To be a teacher'], correctIndex: 1 },
      { id: 'a2_011_q4', type: 'true_false', question: 'The speaker can now read short stories.', questionArabic: 'يستطيع المتحدث الآن قراءة قصص قصيرة.', options: ['True', 'False'], correctIndex: 0 },
    ],
    wordCount: 46,
  },
  {
    id: 'a2_012',
    title: 'The New Phone',
    titleArabic: 'الهاتف الجديد',
    cefrLevel: 'A2',
    topic: 'technology',
    textArabic: 'اشتريت هاتفاً جديداً أمس. الشاشة كبيرة والكاميرا ممتازة. حملت تطبيقات كثيرة مفيدة. أستخدمه للتواصل مع أصدقائي. البطارية تدوم طوال اليوم.',
    textEnglish: 'I bought a new phone yesterday. The screen is big and the camera is excellent. I downloaded many useful apps. I use it to communicate with my friends. The battery lasts all day.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_701', arabic: 'هاتف', english: 'phone', transliteration: 'haatif' },
      { wordId: 'exp_a2_703', arabic: 'الشاشة', english: 'the screen', transliteration: 'ash-shaasha' },
      { wordId: 'exp_a2_705', arabic: 'تطبيقات', english: 'apps', transliteration: 'tatbiiqaat' },
    ],
    questions: [
      { id: 'a2_012_q1', type: 'multiple_choice', question: 'When did the speaker buy the phone?', questionArabic: 'متى اشترى المتحدث الهاتف؟', options: ['Today', 'Yesterday', 'Last week', 'Last month'], correctIndex: 1 },
      { id: 'a2_012_q2', type: 'true_false', question: 'The camera is bad.', questionArabic: 'الكاميرا سيئة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_012_q3', type: 'multiple_choice', question: 'How long does the battery last?', questionArabic: 'كم تدوم البطارية؟', options: ['A few hours', 'Half a day', 'All day', 'Two days'], correctIndex: 2 },
    ],
    wordCount: 40,
  },
  {
    id: 'a2_013',
    title: 'Ramadan',
    titleArabic: 'رمضان',
    cefrLevel: 'A2',
    topic: 'religion',
    textArabic: 'رمضان شهر مبارك عند المسلمين. يصوم المسلمون من الفجر حتى المغرب. نأكل الإفطار مع العائلة. الجميع يذهب إلى المسجد للصلاة. أحب أجواء رمضان كثيراً.',
    textEnglish: 'Ramadan is a blessed month for Muslims. Muslims fast from dawn to sunset. We eat iftar with the family. Everyone goes to the mosque for prayer. I love the atmosphere of Ramadan very much.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_801', arabic: 'رمضان', english: 'Ramadan', transliteration: 'ramadaan' },
      { wordId: 'exp_a2_803', arabic: 'يصوم', english: 'to fast', transliteration: 'yasuumu' },
      { wordId: 'exp_a2_805', arabic: 'المسجد', english: 'the mosque', transliteration: 'al-masjid' },
      { wordId: 'exp_a2_807', arabic: 'الصلاة', english: 'prayer', transliteration: 'as-salaah' },
    ],
    questions: [
      { id: 'a2_013_q1', type: 'multiple_choice', question: 'What do Muslims do during Ramadan?', questionArabic: 'ماذا يفعل المسلمون في رمضان؟', options: ['They celebrate', 'They fast', 'They travel', 'They sleep'], correctIndex: 1 },
      { id: 'a2_013_q2', type: 'true_false', question: 'Fasting is from noon to sunset.', questionArabic: 'الصيام من الظهر حتى المغرب.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_013_q3', type: 'multiple_choice', question: 'Where do people go for prayer?', questionArabic: 'أين يذهب الناس للصلاة؟', options: ['The park', 'The school', 'The mosque', 'The market'], correctIndex: 2 },
    ],
    wordCount: 42,
  },
  {
    id: 'a2_014',
    title: 'The Football Match',
    titleArabic: 'مباراة كرة القدم',
    cefrLevel: 'A2',
    topic: 'sports',
    textArabic: 'شاهدت مباراة كرة قدم مع أصدقائي أمس. كانت المباراة مثيرة جداً. سجل فريقنا هدفين. فاز فريقنا بثلاثة أهداف مقابل واحد. احتفلنا كثيراً بالفوز.',
    textEnglish: 'I watched a football match with my friends yesterday. The match was very exciting. Our team scored two goals. Our team won three goals to one. We celebrated the victory a lot.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_611', arabic: 'مباراة', english: 'match', transliteration: 'mubaaraa' },
      { wordId: 'exp_a2_613', arabic: 'فريق', english: 'team', transliteration: 'fariiq' },
      { wordId: 'exp_a2_615', arabic: 'هدف', english: 'goal', transliteration: 'hadaf' },
    ],
    questions: [
      { id: 'a2_014_q1', type: 'multiple_choice', question: 'What was the final score?', questionArabic: 'ما النتيجة النهائية؟', options: ['2-1', '3-1', '3-0', '2-0'], correctIndex: 1 },
      { id: 'a2_014_q2', type: 'true_false', question: 'The match was boring.', questionArabic: 'كانت المباراة مملة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_014_q3', type: 'multiple_choice', question: 'Who did the speaker watch with?', questionArabic: 'مع من شاهد المتحدث؟', options: ['Family', 'Friends', 'Alone', 'Colleagues'], correctIndex: 1 },
    ],
    wordCount: 41,
  },
  {
    id: 'a2_015',
    title: 'The Art Gallery',
    titleArabic: 'معرض الفن',
    cefrLevel: 'A2',
    topic: 'art',
    textArabic: 'زرت معرض فن مع صديقتي يوم السبت. رأينا لوحات جميلة من فنانين عرب. أعجبتني لوحة لمنظر طبيعي من الصحراء. اشتريت بطاقات بريدية من المعرض. كانت تجربة رائعة.',
    textEnglish: 'I visited an art gallery with my friend on Saturday. We saw beautiful paintings by Arab artists. I liked a painting of a desert landscape. I bought postcards from the gallery. It was a wonderful experience.',
    vocabularyHighlights: [
      { wordId: 'exp_a2_901', arabic: 'معرض', english: 'gallery/exhibition', transliteration: 'marid' },
      { wordId: 'exp_a2_903', arabic: 'لوحات', english: 'paintings', transliteration: 'lawhaat' },
      { wordId: 'exp_a2_905', arabic: 'فنان', english: 'artist', transliteration: 'fannaan' },
    ],
    questions: [
      { id: 'a2_015_q1', type: 'multiple_choice', question: 'When did the speaker visit the gallery?', questionArabic: 'متى زار المتحدث المعرض؟', options: ['Friday', 'Saturday', 'Sunday', 'Monday'], correctIndex: 1 },
      { id: 'a2_015_q2', type: 'true_false', question: 'The paintings were by European artists.', questionArabic: 'كانت اللوحات لفنانين أوروبيين.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'a2_015_q3', type: 'multiple_choice', question: 'What did the speaker like most?', questionArabic: 'ماذا أعجب المتحدث أكثر؟', options: ['A portrait', 'A desert landscape painting', 'A sculpture', 'A calligraphy piece'], correctIndex: 1 },
      { id: 'a2_015_q4', type: 'true_false', question: 'The speaker bought postcards.', questionArabic: 'اشترى المتحدث بطاقات بريدية.', options: ['True', 'False'], correctIndex: 0 },
    ],
    wordCount: 44,
  },
];

// ============================================================
// B1 PASSAGES — 15 entries
// Travel stories, cultural practices, historical snippets,
// news-style reports. 5-7 sentences, 60-100 words.
// ============================================================

const B1_PASSAGES = [
  {
    id: 'b1_001',
    title: 'A Trip to Marrakech',
    titleArabic: 'رحلة إلى مراكش',
    cefrLevel: 'B1',
    topic: 'travel',
    textArabic: 'سافرت إلى مراكش في المغرب الصيف الماضي. المدينة القديمة مليئة بالأسواق الملونة والروائح الزكية. تجولت في ساحة جامع الفنا ورأيت الموسيقيين ورواة القصص. زرت قصر الباهية وحدائقه الجميلة. تذوقت الطاجين المغربي والشاي بالنعناع. كانت الرحلة تجربة لا تُنسى.',
    textEnglish: 'I traveled to Marrakech in Morocco last summer. The old city is full of colorful markets and pleasant smells. I walked around Jemaa el-Fnaa square and saw musicians and storytellers. I visited the Bahia Palace and its beautiful gardens. I tasted Moroccan tagine and mint tea. The trip was an unforgettable experience.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_401', arabic: 'سافرت', english: 'I traveled', transliteration: 'saafartu' },
      { wordId: 'exp_b1_403', arabic: 'الأسواق', english: 'markets', transliteration: 'al-aswaaq' },
      { wordId: 'exp_b1_405', arabic: 'الموسيقيين', english: 'musicians', transliteration: 'al-muusiiqiyyiin' },
      { wordId: 'exp_b1_407', arabic: 'تجربة', english: 'experience', transliteration: 'tajriba' },
    ],
    questions: [
      { id: 'b1_001_q1', type: 'multiple_choice', question: 'In which country is Marrakech?', questionArabic: 'في أي بلد تقع مراكش؟', options: ['Tunisia', 'Algeria', 'Morocco', 'Egypt'], correctIndex: 2 },
      { id: 'b1_001_q2', type: 'multiple_choice', question: 'What did the speaker see in the square?', questionArabic: 'ماذا رأى المتحدث في الساحة؟', options: ['Shops and restaurants', 'Musicians and storytellers', 'Animals and plants', 'Cars and buses'], correctIndex: 1 },
      { id: 'b1_001_q3', type: 'true_false', question: 'The speaker visited a museum.', questionArabic: 'زار المتحدث متحفاً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_001_q4', type: 'multiple_choice', question: 'What food did the speaker taste?', questionArabic: 'ما الطعام الذي تذوقه المتحدث؟', options: ['Couscous', 'Tagine', 'Falafel', 'Shawarma'], correctIndex: 1 },
      { id: 'b1_001_q5', type: 'true_false', question: 'The trip was forgettable.', questionArabic: 'كانت الرحلة عادية ومنسية.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 68,
  },
  {
    id: 'b1_002',
    title: 'Arabic Coffee Culture',
    titleArabic: 'ثقافة القهوة العربية',
    cefrLevel: 'B1',
    topic: 'culture',
    textArabic: 'القهوة العربية ليست مجرد مشروب بل هي رمز للضيافة والكرم. في الخليج العربي يُقدم القهوة في الدلة التقليدية مع التمر. يُصب القهوة في فناجين صغيرة ويُعاد ملؤها حتى يهز الضيف فنجانه. تعكس هذه العادة قيم الترحيب والاحترام المتجذرة في الثقافة العربية.',
    textEnglish: 'Arabic coffee is not just a drink but a symbol of hospitality and generosity. In the Arabian Gulf, coffee is served in the traditional dallah with dates. Coffee is poured into small cups and refilled until the guest shakes their cup. This custom reflects the values of welcome and respect deeply rooted in Arab culture.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_201', arabic: 'الضيافة', english: 'hospitality', transliteration: 'ad-diyaafa' },
      { wordId: 'exp_b1_203', arabic: 'الكرم', english: 'generosity', transliteration: 'al-karam' },
      { wordId: 'exp_b1_205', arabic: 'التمر', english: 'dates (fruit)', transliteration: 'at-tamr' },
      { wordId: 'exp_b1_207', arabic: 'الثقافة', english: 'culture', transliteration: 'ath-thaqaafa' },
    ],
    questions: [
      { id: 'b1_002_q1', type: 'multiple_choice', question: 'What does Arabic coffee symbolize?', questionArabic: 'ماذا ترمز القهوة العربية؟', options: ['Wealth and power', 'Hospitality and generosity', 'Religion and faith', 'Knowledge and wisdom'], correctIndex: 1 },
      { id: 'b1_002_q2', type: 'true_false', question: 'Coffee is served in large mugs.', questionArabic: 'تُقدم القهوة في أكواب كبيرة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_002_q3', type: 'multiple_choice', question: 'When does the host stop pouring?', questionArabic: 'متى يتوقف المضيف عن الصب؟', options: ['After three cups', 'When the pot is empty', 'When the guest shakes the cup', 'After five minutes'], correctIndex: 2 },
      { id: 'b1_002_q4', type: 'multiple_choice', question: 'What is served with the coffee?', questionArabic: 'ماذا يُقدم مع القهوة؟', options: ['Cookies', 'Dates', 'Cake', 'Nuts'], correctIndex: 1 },
    ],
    wordCount: 72,
  },
  {
    id: 'b1_003',
    title: 'The Invention of the Camera',
    titleArabic: 'اختراع الكاميرا',
    cefrLevel: 'B1',
    topic: 'history',
    textArabic: 'يعتبر العالم العربي ابن الهيثم أبا البصريات. اكتشف في القرن الحادي عشر كيف تعمل العين البشرية. صمم الغرفة المظلمة التي أصبحت أساساً للكاميرا الحديثة. كتب كتابه الشهير "المناظر" الذي ترجم إلى اللاتينية وأثر في العلماء الأوروبيين. تكريماً لإسهاماته سُمي حفرة على القمر باسمه.',
    textEnglish: 'The Arab world considers Ibn al-Haytham the father of optics. He discovered in the eleventh century how the human eye works. He designed the camera obscura which became the basis for the modern camera. He wrote his famous book "Kitab al-Manazir" which was translated into Latin and influenced European scientists. In honor of his contributions, a crater on the moon was named after him.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_501', arabic: 'اختراع', english: 'invention', transliteration: 'ikhtiraa' },
      { wordId: 'exp_b1_503', arabic: 'اكتشف', english: 'he discovered', transliteration: 'iktashafa' },
      { wordId: 'exp_b1_505', arabic: 'العلماء', english: 'scientists', transliteration: 'al-ulamaa' },
      { wordId: 'exp_b1_507', arabic: 'إسهامات', english: 'contributions', transliteration: 'ishaamaat' },
    ],
    questions: [
      { id: 'b1_003_q1', type: 'multiple_choice', question: 'Who is considered the father of optics?', questionArabic: 'من يعتبر أبا البصريات؟', options: ['Al-Khwarizmi', 'Ibn Sina', 'Ibn al-Haytham', 'Al-Razi'], correctIndex: 2 },
      { id: 'b1_003_q2', type: 'true_false', question: 'Ibn al-Haytham lived in the 15th century.', questionArabic: 'عاش ابن الهيثم في القرن الخامس عشر.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_003_q3', type: 'multiple_choice', question: 'What did he design?', questionArabic: 'ماذا صمم؟', options: ['A telescope', 'The camera obscura', 'A microscope', 'Glasses'], correctIndex: 1 },
      { id: 'b1_003_q4', type: 'multiple_choice', question: 'Into which language was his book translated?', questionArabic: 'إلى أي لغة ترجم كتابه؟', options: ['Greek', 'Persian', 'Latin', 'English'], correctIndex: 2 },
    ],
    wordCount: 78,
  },
  {
    id: 'b1_004',
    title: 'Working from Home',
    titleArabic: 'العمل من المنزل',
    cefrLevel: 'B1',
    topic: 'work',
    textArabic: 'أصبح العمل عن بعد شائعاً في السنوات الأخيرة. كثير من الشركات تسمح لموظفيها بالعمل من المنزل. هذا النظام يوفر الوقت والمال المخصص للتنقل. لكنه يتطلب انضباطاً ذاتياً وتنظيماً جيداً. بعض الناس يفضلون العمل في المكتب للتواصل مع الزملاء. أعتقد أن المستقبل سيجمع بين النظامين.',
    textEnglish: 'Working remotely has become common in recent years. Many companies allow their employees to work from home. This system saves time and money allocated for commuting. However, it requires self-discipline and good organization. Some people prefer working in the office to communicate with colleagues. I believe the future will combine both systems.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_301', arabic: 'العمل عن بعد', english: 'remote work', transliteration: 'al-amal an bud' },
      { wordId: 'exp_b1_303', arabic: 'الشركات', english: 'companies', transliteration: 'ash-sharikaat' },
      { wordId: 'exp_b1_305', arabic: 'موظفين', english: 'employees', transliteration: 'muwaddhafiin' },
      { wordId: 'exp_b1_307', arabic: 'انضباط', english: 'discipline', transliteration: 'indibaat' },
    ],
    questions: [
      { id: 'b1_004_q1', type: 'multiple_choice', question: 'What has become common recently?', questionArabic: 'ما الذي أصبح شائعاً مؤخراً؟', options: ['Traveling abroad', 'Remote work', 'Learning languages', 'Starting businesses'], correctIndex: 1 },
      { id: 'b1_004_q2', type: 'true_false', question: 'Remote work requires no discipline.', questionArabic: 'العمل عن بعد لا يتطلب انضباطاً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_004_q3', type: 'multiple_choice', question: 'What does remote work save?', questionArabic: 'ماذا يوفر العمل عن بعد؟', options: ['Energy and effort', 'Time and money', 'Food and water', 'Space and resources'], correctIndex: 1 },
      { id: 'b1_004_q4', type: 'true_false', question: 'Everyone prefers working from home.', questionArabic: 'الجميع يفضلون العمل من المنزل.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 74,
  },
  {
    id: 'b1_005',
    title: 'The Dead Sea',
    titleArabic: 'البحر الميت',
    cefrLevel: 'B1',
    topic: 'nature',
    textArabic: 'البحر الميت هو أخفض نقطة على سطح الأرض. يقع بين الأردن وفلسطين. مياهه شديدة الملوحة حتى أن الإنسان يطفو فيها بسهولة. يأتي السياح من جميع أنحاء العالم للاستمتاع بطين البحر الميت العلاجي. لكن منسوب المياه ينخفض سنة بعد سنة بسبب تحويل مياه نهر الأردن. يحاول العلماء إيجاد حلول لإنقاذه.',
    textEnglish: 'The Dead Sea is the lowest point on the Earth\'s surface. It lies between Jordan and Palestine. Its waters are extremely salty so that a person floats in them easily. Tourists come from all over the world to enjoy the therapeutic Dead Sea mud. But the water level drops year after year due to the diversion of the Jordan River. Scientists are trying to find solutions to save it.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_601', arabic: 'الملوحة', english: 'salinity', transliteration: 'al-muluuha' },
      { wordId: 'exp_b1_603', arabic: 'السياح', english: 'tourists', transliteration: 'as-suyyaah' },
      { wordId: 'exp_b1_605', arabic: 'علاجي', english: 'therapeutic', transliteration: 'ilaajii' },
      { wordId: 'exp_b1_607', arabic: 'منسوب', english: 'level (water)', transliteration: 'mansuub' },
    ],
    questions: [
      { id: 'b1_005_q1', type: 'multiple_choice', question: 'What makes the Dead Sea unique geographically?', questionArabic: 'ما الذي يميز البحر الميت جغرافياً؟', options: ['The deepest sea', 'The largest lake', 'The lowest point on Earth', 'The warmest sea'], correctIndex: 2 },
      { id: 'b1_005_q2', type: 'true_false', question: 'The water level is rising each year.', questionArabic: 'منسوب المياه يرتفع كل سنة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_005_q3', type: 'multiple_choice', question: 'Why do tourists visit?', questionArabic: 'لماذا يزور السياح البحر الميت؟', options: ['For fishing', 'For diving', 'For therapeutic mud', 'For surfing'], correctIndex: 2 },
      { id: 'b1_005_q4', type: 'multiple_choice', question: 'Between which regions does the Dead Sea lie?', questionArabic: 'بين أي منطقتين يقع البحر الميت؟', options: ['Egypt and Libya', 'Jordan and Palestine', 'Saudi Arabia and Yemen', 'Syria and Lebanon'], correctIndex: 1 },
    ],
    wordCount: 82,
  },
  {
    id: 'b1_006',
    title: 'Arabic Calligraphy',
    titleArabic: 'الخط العربي',
    cefrLevel: 'B1',
    topic: 'art',
    textArabic: 'الخط العربي فن عريق يعود إلى قرون طويلة. تطور هذا الفن مع انتشار الإسلام وزخرفة المساجد والقصور. هناك أنواع كثيرة من الخط مثل النسخ والثلث والديواني. يستخدم الخطاطون أدوات خاصة مثل القلم المبروي والحبر. اليوم يُمزج فن الخط مع التصميم الحديث في الشعارات والملصقات. يعتبره كثيرون من أجمل الفنون البصرية.',
    textEnglish: 'Arabic calligraphy is an ancient art dating back many centuries. This art developed with the spread of Islam and the decoration of mosques and palaces. There are many types of calligraphy such as Naskh, Thuluth, and Diwani. Calligraphers use special tools such as the reed pen and ink. Today, calligraphy art is mixed with modern design in logos and posters. Many consider it one of the most beautiful visual arts.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_901', arabic: 'الخط العربي', english: 'Arabic calligraphy', transliteration: 'al-khatt al-arabii' },
      { wordId: 'exp_b1_903', arabic: 'الخطاطون', english: 'calligraphers', transliteration: 'al-khattaatuun' },
      { wordId: 'exp_b1_905', arabic: 'زخرفة', english: 'decoration', transliteration: 'zakhrufa' },
      { wordId: 'exp_b1_907', arabic: 'التصميم', english: 'design', transliteration: 'at-tasmiim' },
    ],
    questions: [
      { id: 'b1_006_q1', type: 'multiple_choice', question: 'Which of these is a type of Arabic calligraphy?', questionArabic: 'أي من هذه أنواع الخط العربي؟', options: ['Kufi only', 'Naskh', 'Hieroglyphic', 'Gothic'], correctIndex: 1 },
      { id: 'b1_006_q2', type: 'true_false', question: 'Arabic calligraphy developed independently of Islam.', questionArabic: 'تطور الخط العربي بمعزل عن الإسلام.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_006_q3', type: 'multiple_choice', question: 'What tool do calligraphers traditionally use?', questionArabic: 'ما الأداة التي يستخدمها الخطاطون تقليدياً؟', options: ['A brush', 'A reed pen', 'A pencil', 'A marker'], correctIndex: 1 },
      { id: 'b1_006_q4', type: 'true_false', question: 'Calligraphy is only used in old manuscripts today.', questionArabic: 'يُستخدم الخط فقط في المخطوطات القديمة اليوم.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 80,
  },
  {
    id: 'b1_007',
    title: 'Protecting the Environment',
    titleArabic: 'حماية البيئة',
    cefrLevel: 'B1',
    topic: 'nature',
    textArabic: 'حماية البيئة مسؤولية الجميع. التلوث يهدد صحة الإنسان والحيوان. يجب أن نقلل من استخدام البلاستيك ونعيد تدوير النفايات. الطاقة الشمسية والرياح بدائل نظيفة للوقود الأحفوري. تبذل الحكومات العربية جهوداً لزراعة الأشجار ومكافحة التصحر. كل فرد يستطيع أن يساهم في الحفاظ على كوكبنا.',
    textEnglish: 'Protecting the environment is everyone\'s responsibility. Pollution threatens the health of humans and animals. We must reduce plastic use and recycle waste. Solar and wind energy are clean alternatives to fossil fuels. Arab governments are making efforts to plant trees and combat desertification. Every individual can contribute to preserving our planet.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_701', arabic: 'البيئة', english: 'the environment', transliteration: 'al-biia' },
      { wordId: 'exp_b1_703', arabic: 'التلوث', english: 'pollution', transliteration: 'at-talawwuth' },
      { wordId: 'exp_b1_705', arabic: 'إعادة تدوير', english: 'recycling', transliteration: 'iaadatu tadwiir' },
      { wordId: 'exp_b1_707', arabic: 'التصحر', english: 'desertification', transliteration: 'at-tasahhur' },
    ],
    questions: [
      { id: 'b1_007_q1', type: 'multiple_choice', question: 'What threatens human and animal health?', questionArabic: 'ما الذي يهدد صحة الإنسان والحيوان؟', options: ['Technology', 'Pollution', 'Education', 'Travel'], correctIndex: 1 },
      { id: 'b1_007_q2', type: 'true_false', question: 'Only governments are responsible for the environment.', questionArabic: 'الحكومات فقط مسؤولة عن البيئة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_007_q3', type: 'multiple_choice', question: 'What clean energy alternatives are mentioned?', questionArabic: 'ما بدائل الطاقة النظيفة المذكورة؟', options: ['Nuclear and hydro', 'Solar and wind', 'Gas and oil', 'Coal and wood'], correctIndex: 1 },
      { id: 'b1_007_q4', type: 'true_false', question: 'Arab governments plant trees to combat desertification.', questionArabic: 'تزرع الحكومات العربية الأشجار لمكافحة التصحر.', options: ['True', 'False'], correctIndex: 0 },
    ],
    wordCount: 72,
  },
  {
    id: 'b1_008',
    title: 'Traditional Arab Wedding',
    titleArabic: 'العرس العربي التقليدي',
    cefrLevel: 'B1',
    topic: 'culture',
    textArabic: 'العرس العربي التقليدي احتفال كبير يستمر عدة أيام. تبدأ الاحتفالات بحفلة الحناء للعروس. في يوم الزفاف ترتدي العروس فستاناً أبيض مطرزاً. يُقام حفل كبير يحضره الأقارب والأصدقاء. يقدم الطعام التقليدي ويعزف الموسيقيون. تختلف التقاليد من بلد عربي إلى آخر لكن الفرح واحد.',
    textEnglish: 'The traditional Arab wedding is a grand celebration lasting several days. The festivities begin with the henna party for the bride. On the wedding day, the bride wears an embroidered white dress. A large party is held attended by relatives and friends. Traditional food is served and musicians play. Traditions differ from one Arab country to another but the joy is the same.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_211', arabic: 'العرس', english: 'the wedding', transliteration: 'al-urs' },
      { wordId: 'exp_b1_213', arabic: 'الحناء', english: 'henna', transliteration: 'al-hinnaa' },
      { wordId: 'exp_b1_215', arabic: 'العروس', english: 'the bride', transliteration: 'al-aruus' },
      { wordId: 'exp_b1_217', arabic: 'التقاليد', english: 'traditions', transliteration: 'at-taqaaliid' },
    ],
    questions: [
      { id: 'b1_008_q1', type: 'multiple_choice', question: 'How long does a traditional Arab wedding last?', questionArabic: 'كم يستمر العرس العربي التقليدي؟', options: ['One day', 'Several days', 'A week', 'A month'], correctIndex: 1 },
      { id: 'b1_008_q2', type: 'true_false', question: 'All Arab countries have identical wedding traditions.', questionArabic: 'جميع الدول العربية لها تقاليد زفاف متطابقة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_008_q3', type: 'multiple_choice', question: 'What starts the celebration?', questionArabic: 'بماذا تبدأ الاحتفالات؟', options: ['The dinner party', 'The henna party', 'The music', 'The gift exchange'], correctIndex: 1 },
      { id: 'b1_008_q4', type: 'true_false', question: 'The bride wears a red dress.', questionArabic: 'ترتدي العروس فستاناً أحمر.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 76,
  },
  {
    id: 'b1_009',
    title: 'Youth and Social Media',
    titleArabic: 'الشباب ووسائل التواصل الاجتماعي',
    cefrLevel: 'B1',
    topic: 'technology',
    textArabic: 'أصبحت وسائل التواصل الاجتماعي جزءاً أساسياً من حياة الشباب العربي. يستخدمونها للتواصل مع الأصدقاء ومتابعة الأخبار والتعبير عن آرائهم. بعض الشباب أنشأ مشاريع ناجحة من خلال هذه المنصات. لكن الاستخدام المفرط قد يؤثر سلباً على الصحة النفسية والعلاقات الحقيقية. من المهم تحقيق التوازن بين العالم الرقمي والحياة الواقعية.',
    textEnglish: 'Social media has become an essential part of Arab youth\'s life. They use it to connect with friends, follow news, and express their opinions. Some youth have created successful projects through these platforms. However, excessive use may negatively affect mental health and real relationships. It is important to achieve balance between the digital world and real life.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_801', arabic: 'وسائل التواصل', english: 'social media', transliteration: 'wasaail at-tawaasul' },
      { wordId: 'exp_b1_803', arabic: 'الشباب', english: 'youth', transliteration: 'ash-shabaab' },
      { wordId: 'exp_b1_805', arabic: 'المنصات', english: 'platforms', transliteration: 'al-minassaat' },
      { wordId: 'exp_b1_807', arabic: 'التوازن', english: 'balance', transliteration: 'at-tawaazun' },
    ],
    questions: [
      { id: 'b1_009_q1', type: 'multiple_choice', question: 'What have some youth created through social media?', questionArabic: 'ماذا أنشأ بعض الشباب عبر وسائل التواصل؟', options: ['Schools', 'Successful projects', 'Hospitals', 'Libraries'], correctIndex: 1 },
      { id: 'b1_009_q2', type: 'true_false', question: 'Excessive social media use has no negative effects.', questionArabic: 'الاستخدام المفرط لوسائل التواصل ليس له آثار سلبية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_009_q3', type: 'multiple_choice', question: 'What is important according to the passage?', questionArabic: 'ما المهم وفقاً للنص؟', options: ['Avoiding social media', 'Using only one platform', 'Achieving balance', 'Spending more time online'], correctIndex: 2 },
    ],
    wordCount: 75,
  },
  {
    id: 'b1_010',
    title: 'The Olive Tree',
    titleArabic: 'شجرة الزيتون',
    cefrLevel: 'B1',
    topic: 'nature',
    textArabic: 'شجرة الزيتون رمز مهم في الثقافة العربية. تنمو في بلاد الشام والمغرب العربي منذ آلاف السنين. تعطي ثماراً يُصنع منها زيت الزيتون اللذيذ والصحي. يستخدم الزيت في الطبخ والتجميل والطب التقليدي. في فلسطين ترمز شجرة الزيتون إلى الصمود والتمسك بالأرض. يعتبرها العرب شجرة مباركة.',
    textEnglish: 'The olive tree is an important symbol in Arab culture. It has grown in the Levant and North Africa for thousands of years. It produces fruits from which delicious and healthy olive oil is made. The oil is used in cooking, cosmetics, and traditional medicine. In Palestine, the olive tree symbolizes resilience and attachment to the land. Arabs consider it a blessed tree.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_611', arabic: 'الزيتون', english: 'olive', transliteration: 'az-zaytun' },
      { wordId: 'exp_b1_613', arabic: 'زيت', english: 'oil', transliteration: 'zayt' },
      { wordId: 'exp_b1_615', arabic: 'الصمود', english: 'resilience', transliteration: 'as-sumuud' },
      { wordId: 'exp_b1_617', arabic: 'مباركة', english: 'blessed', transliteration: 'mubaaraka' },
    ],
    questions: [
      { id: 'b1_010_q1', type: 'multiple_choice', question: 'Where does the olive tree grow?', questionArabic: 'أين تنمو شجرة الزيتون؟', options: ['Only in Egypt', 'In the Levant and North Africa', 'Only in the Gulf', 'Only in Iraq'], correctIndex: 1 },
      { id: 'b1_010_q2', type: 'true_false', question: 'Olive oil is only used for cooking.', questionArabic: 'يُستخدم زيت الزيتون للطبخ فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_010_q3', type: 'multiple_choice', question: 'What does the olive tree symbolize in Palestine?', questionArabic: 'ما الذي ترمز إليه شجرة الزيتون في فلسطين؟', options: ['Wealth', 'Resilience', 'Peace', 'Beauty'], correctIndex: 1 },
      { id: 'b1_010_q4', type: 'true_false', question: 'Arabs consider the olive tree blessed.', questionArabic: 'يعتبر العرب شجرة الزيتون مباركة.', options: ['True', 'False'], correctIndex: 0 },
    ],
    wordCount: 78,
  },
  {
    id: 'b1_011',
    title: 'Education in the Arab World',
    titleArabic: 'التعليم في العالم العربي',
    cefrLevel: 'B1',
    topic: 'education',
    textArabic: 'شهد التعليم في العالم العربي تطوراً كبيراً في العقود الأخيرة. ارتفعت نسبة المتعلمين وزاد عدد الجامعات. بدأت كثير من الدول بإدخال التكنولوجيا في المدارس. التعليم الإلكتروني أصبح خياراً متاحاً للكثيرين خاصة في المناطق النائية. لكن التحديات ما زالت موجودة مثل الفجوة بين المناطق الريفية والحضرية. الاستثمار في التعليم هو أفضل استثمار في المستقبل.',
    textEnglish: 'Education in the Arab world has seen great development in recent decades. Literacy rates have risen and the number of universities has increased. Many countries began introducing technology in schools. E-learning has become an available option for many, especially in remote areas. But challenges still exist such as the gap between rural and urban areas. Investing in education is the best investment in the future.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_151', arabic: 'التعليم', english: 'education', transliteration: 'at-taliim' },
      { wordId: 'exp_b1_153', arabic: 'الجامعات', english: 'universities', transliteration: 'al-jaamiaat' },
      { wordId: 'exp_b1_155', arabic: 'التكنولوجيا', english: 'technology', transliteration: 'at-tiknuluujiyaa' },
      { wordId: 'exp_b1_157', arabic: 'الاستثمار', english: 'investment', transliteration: 'al-istithmaar' },
    ],
    questions: [
      { id: 'b1_011_q1', type: 'multiple_choice', question: 'What has happened to literacy rates?', questionArabic: 'ماذا حدث لنسبة المتعلمين؟', options: ['They decreased', 'They stayed the same', 'They increased', 'They fluctuated'], correctIndex: 2 },
      { id: 'b1_011_q2', type: 'true_false', question: 'E-learning is only for city students.', questionArabic: 'التعليم الإلكتروني لطلاب المدن فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_011_q3', type: 'multiple_choice', question: 'What challenge is mentioned?', questionArabic: 'ما التحدي المذكور؟', options: ['Lack of teachers', 'Urban-rural gap', 'No funding', 'Language barriers'], correctIndex: 1 },
      { id: 'b1_011_q4', type: 'true_false', question: 'The passage considers education the best investment.', questionArabic: 'يعتبر النص التعليم أفضل استثمار.', options: ['True', 'False'], correctIndex: 0 },
    ],
    wordCount: 85,
  },
  {
    id: 'b1_012',
    title: 'Healthy Eating Habits',
    titleArabic: 'عادات الأكل الصحية',
    cefrLevel: 'B1',
    topic: 'health',
    textArabic: 'الغذاء الصحي أساس الحياة السليمة. ينصح الأطباء بتناول الخضروات والفواكه يومياً وتقليل السكريات والدهون. المطبخ العربي غني بالأطعمة الصحية مثل الحمص والفول والزيتون. شرب الماء بكميات كافية ضروري للجسم. الإفراط في الأكل السريع يسبب أمراضاً كثيرة. التوازن في الطعام يمنح الجسم الطاقة والصحة.',
    textEnglish: 'Healthy food is the foundation of a good life. Doctors recommend eating vegetables and fruits daily and reducing sugars and fats. Arab cuisine is rich in healthy foods like hummus, fava beans, and olives. Drinking enough water is essential for the body. Excess fast food causes many diseases. Balance in food gives the body energy and health.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_101', arabic: 'الغذاء', english: 'food/nutrition', transliteration: 'al-ghidhaa' },
      { wordId: 'exp_b1_103', arabic: 'السكريات', english: 'sugars', transliteration: 'as-sukariyyaat' },
      { wordId: 'exp_b1_105', arabic: 'الأمراض', english: 'diseases', transliteration: 'al-amraad' },
    ],
    questions: [
      { id: 'b1_012_q1', type: 'multiple_choice', question: 'What do doctors recommend eating daily?', questionArabic: 'ماذا ينصح الأطباء بتناوله يومياً؟', options: ['Meat and bread', 'Vegetables and fruits', 'Rice and pasta', 'Fish and eggs'], correctIndex: 1 },
      { id: 'b1_012_q2', type: 'true_false', question: 'Fast food is healthy according to the passage.', questionArabic: 'الأكل السريع صحي وفقاً للنص.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_012_q3', type: 'multiple_choice', question: 'Which healthy Arab food is mentioned?', questionArabic: 'أي طعام عربي صحي ذُكر؟', options: ['Kebab', 'Baklava', 'Hummus', 'Shawarma'], correctIndex: 2 },
    ],
    wordCount: 73,
  },
  {
    id: 'b1_013',
    title: 'The History of Damascus',
    titleArabic: 'تاريخ دمشق',
    cefrLevel: 'B1',
    topic: 'history',
    textArabic: 'دمشق من أقدم المدن المأهولة في العالم. يعود تاريخها إلى أكثر من عشرة آلاف سنة. كانت عاصمة الدولة الأموية وازدهرت في العصر الإسلامي. تشتهر بسوق الحميدية والجامع الأموي الكبير. الحرف اليدوية الدمشقية مثل النحاس والموزاييك معروفة عالمياً. رغم الصعوبات تبقى دمشق شاهدة على حضارة عريقة.',
    textEnglish: 'Damascus is one of the oldest continuously inhabited cities in the world. Its history goes back more than ten thousand years. It was the capital of the Umayyad state and flourished during the Islamic era. It is famous for the Hamidiyya Souq and the Great Umayyad Mosque. Damascene crafts like copper and mosaic are known worldwide. Despite difficulties, Damascus remains a witness to an ancient civilization.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_511', arabic: 'عاصمة', english: 'capital', transliteration: 'aasima' },
      { wordId: 'exp_b1_513', arabic: 'ازدهرت', english: 'it flourished', transliteration: 'izdaharat' },
      { wordId: 'exp_b1_515', arabic: 'الحرف اليدوية', english: 'handicrafts', transliteration: 'al-hiraf al-yadawiyya' },
      { wordId: 'exp_b1_517', arabic: 'حضارة', english: 'civilization', transliteration: 'hadaara' },
    ],
    questions: [
      { id: 'b1_013_q1', type: 'multiple_choice', question: 'How old is Damascus?', questionArabic: 'كم عمر دمشق؟', options: ['1,000 years', '5,000 years', 'More than 10,000 years', '500 years'], correctIndex: 2 },
      { id: 'b1_013_q2', type: 'true_false', question: 'Damascus was the Abbasid capital.', questionArabic: 'كانت دمشق عاصمة الدولة العباسية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_013_q3', type: 'multiple_choice', question: 'What Damascene crafts are mentioned?', questionArabic: 'ما الحرف الدمشقية المذكورة؟', options: ['Pottery and glass', 'Copper and mosaic', 'Textiles and leather', 'Wood and stone'], correctIndex: 1 },
    ],
    wordCount: 80,
  },
  {
    id: 'b1_014',
    title: 'Renewable Energy in the Gulf',
    titleArabic: 'الطاقة المتجددة في الخليج',
    cefrLevel: 'B1',
    topic: 'technology',
    textArabic: 'بدأت دول الخليج العربي بالتحول نحو الطاقة المتجددة. الإمارات أطلقت مشروع مدينة مصدر كمدينة خضراء بالكامل. المملكة العربية السعودية تخطط لبناء أكبر محطة طاقة شمسية في العالم. هذه المشاريع تهدف إلى تقليل الاعتماد على النفط. الاستثمار في الطاقة النظيفة يخلق فرص عمل جديدة ويحمي البيئة. المنطقة تتمتع بأشعة شمس وفيرة طوال السنة.',
    textEnglish: 'Gulf Arab states have begun shifting toward renewable energy. The UAE launched the Masdar City project as a fully green city. Saudi Arabia plans to build the largest solar power plant in the world. These projects aim to reduce dependence on oil. Investing in clean energy creates new jobs and protects the environment. The region enjoys abundant sunshine throughout the year.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_811', arabic: 'الطاقة المتجددة', english: 'renewable energy', transliteration: 'at-taaqa al-mutajaddida' },
      { wordId: 'exp_b1_813', arabic: 'النفط', english: 'oil/petroleum', transliteration: 'an-naft' },
      { wordId: 'exp_b1_815', arabic: 'فرص عمل', english: 'job opportunities', transliteration: 'furas amal' },
    ],
    questions: [
      { id: 'b1_014_q1', type: 'multiple_choice', question: 'What project did the UAE launch?', questionArabic: 'ما المشروع الذي أطلقته الإمارات؟', options: ['A new airport', 'Masdar City', 'A space station', 'A university'], correctIndex: 1 },
      { id: 'b1_014_q2', type: 'true_false', question: 'Saudi Arabia is building a wind farm.', questionArabic: 'تبني السعودية مزرعة رياح.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_014_q3', type: 'multiple_choice', question: 'What do these projects aim to reduce?', questionArabic: 'ماذا تهدف هذه المشاريع إلى تقليله؟', options: ['Population', 'Water use', 'Dependence on oil', 'Tourism'], correctIndex: 2 },
      { id: 'b1_014_q4', type: 'true_false', question: 'The region lacks sunshine.', questionArabic: 'تفتقر المنطقة إلى أشعة الشمس.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 82,
  },
  {
    id: 'b1_015',
    title: 'The Art of Arabic Cuisine',
    titleArabic: 'فن المطبخ العربي',
    cefrLevel: 'B1',
    topic: 'food',
    textArabic: 'يتميز المطبخ العربي بتنوعه وغناه بالنكهات. يختلف الطعام من بلد إلى آخر لكنه يشترك في استخدام التوابل العطرية. المنسف طبق أردني شهير والكسكس مغربي والمحشي مصري. تجتمع العائلة العربية حول المائدة وتشارك الطعام كعادة اجتماعية مهمة. الطبخ العربي يمزج بين النكهات الحلوة والمالحة والحامضة. تعلم الطبخ العربي أصبح شائعاً في مدارس الطبخ العالمية.',
    textEnglish: 'Arab cuisine is distinguished by its diversity and richness of flavors. Food differs from one country to another but shares the use of aromatic spices. Mansaf is a famous Jordanian dish, couscous is Moroccan, and mahshi is Egyptian. The Arab family gathers around the table and shares food as an important social custom. Arab cooking blends sweet, salty, and sour flavors. Learning Arab cooking has become popular in international culinary schools.',
    vocabularyHighlights: [
      { wordId: 'exp_b1_111', arabic: 'المطبخ', english: 'cuisine/kitchen', transliteration: 'al-matbakh' },
      { wordId: 'exp_b1_113', arabic: 'التوابل', english: 'spices', transliteration: 'at-tawaabil' },
      { wordId: 'exp_b1_115', arabic: 'النكهات', english: 'flavors', transliteration: 'an-nakahaat' },
      { wordId: 'exp_b1_117', arabic: 'المائدة', english: 'the dining table', transliteration: 'al-maaida' },
    ],
    questions: [
      { id: 'b1_015_q1', type: 'multiple_choice', question: 'Which dish is Jordanian?', questionArabic: 'أي طبق أردني؟', options: ['Couscous', 'Mahshi', 'Mansaf', 'Falafel'], correctIndex: 2 },
      { id: 'b1_015_q2', type: 'true_false', question: 'Arab food tastes the same everywhere.', questionArabic: 'طعم الطعام العربي نفسه في كل مكان.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b1_015_q3', type: 'multiple_choice', question: 'What flavors does Arab cooking blend?', questionArabic: 'ما النكهات التي يمزجها الطبخ العربي؟', options: ['Sweet and bitter', 'Sweet, salty, and sour', 'Only spicy', 'Only salty'], correctIndex: 1 },
      { id: 'b1_015_q4', type: 'true_false', question: 'Sharing food is an important social custom in Arab culture.', questionArabic: 'مشاركة الطعام عادة اجتماعية مهمة في الثقافة العربية.', options: ['True', 'False'], correctIndex: 0 },
    ],
    wordCount: 86,
  },
];

// ============================================================
// B2 PASSAGES — 15 entries
// Arabic poetry excerpts, scientific discoveries, philosophical
// discussions, literary criticism. 6-8 sentences, 80-120 words.
// ============================================================

const B2_PASSAGES = [
  {
    id: 'b2_001',
    title: 'The Poetry of Mahmoud Darwish',
    titleArabic: 'شعر محمود درويش',
    cefrLevel: 'B2',
    topic: 'art',
    textArabic: 'يُعتبر محمود درويش من أعظم شعراء العربية في العصر الحديث. وُلد في فلسطين عام ألف وتسعمئة واثنين وأربعين وعاش تجربة اللجوء منذ طفولته. تتناول قصائده موضوعات الوطن والمنفى والهوية والحب. أسلوبه يجمع بين الرمزية العميقة والبساطة المؤثرة. قصيدته الشهيرة "سجل أنا عربي" أصبحت نشيداً للمقاومة الثقافية. ترجمت أعماله إلى أكثر من عشرين لغة وحصل على جوائز أدبية عديدة. يبقى صوته حاضراً في الوجدان العربي رغم رحيله.',
    textEnglish: 'Mahmoud Darwish is considered one of the greatest Arabic poets of the modern era. He was born in Palestine in 1942 and lived the refugee experience since childhood. His poems address themes of homeland, exile, identity, and love. His style combines deep symbolism with affecting simplicity. His famous poem "Record! I Am an Arab" became an anthem of cultural resistance. His works were translated into more than twenty languages and he received numerous literary awards. His voice remains present in the Arab consciousness despite his passing.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_901', arabic: 'شعراء', english: 'poets', transliteration: 'shuaraa' },
      { wordId: 'exp_b2_903', arabic: 'اللجوء', english: 'refuge/exile', transliteration: 'al-lujuu' },
      { wordId: 'exp_b2_905', arabic: 'الرمزية', english: 'symbolism', transliteration: 'ar-ramziyya' },
      { wordId: 'exp_b2_907', arabic: 'المقاومة', english: 'resistance', transliteration: 'al-muqaawama' },
    ],
    questions: [
      { id: 'b2_001_q1', type: 'multiple_choice', question: 'When was Mahmoud Darwish born?', questionArabic: 'متى وُلد محمود درويش؟', options: ['1930', '1942', '1950', '1960'], correctIndex: 1 },
      { id: 'b2_001_q2', type: 'multiple_choice', question: 'What themes do his poems address?', questionArabic: 'ما المواضيع التي تتناولها قصائده؟', options: ['Science and technology', 'Homeland, exile, and identity', 'Business and economics', 'Sports and entertainment'], correctIndex: 1 },
      { id: 'b2_001_q3', type: 'true_false', question: 'His works were only published in Arabic.', questionArabic: 'نُشرت أعماله بالعربية فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_001_q4', type: 'multiple_choice', question: 'What characterizes his poetic style?', questionArabic: 'ما الذي يميز أسلوبه الشعري؟', options: ['Complexity only', 'Deep symbolism and affecting simplicity', 'Humor and satire', 'Scientific precision'], correctIndex: 1 },
      { id: 'b2_001_q5', type: 'true_false', question: '"Record! I Am an Arab" is about love.', questionArabic: '"سجل أنا عربي" قصيدة عن الحب.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 96,
  },
  {
    id: 'b2_002',
    title: 'Ibn Khaldun and the Philosophy of History',
    titleArabic: 'ابن خلدون وفلسفة التاريخ',
    cefrLevel: 'B2',
    topic: 'history',
    textArabic: 'يُعدّ ابن خلدون مؤسس علم الاجتماع وفلسفة التاريخ. وُلد في تونس عام ألف وثلاثمئة واثنين وثلاثين ميلادياً. في مقدمته الشهيرة حلل صعود الحضارات وسقوطها من خلال مفهوم العصبية والدورات التاريخية. رأى أن الدول تمر بمراحل الشباب والنضج ثم الشيخوخة والانحلال. سبق بأفكاره كثيراً من المفكرين الغربيين بقرون. أثرت نظرياته في ماركس وتوينبي وغيرهم. لا يزال فكره مرجعاً أساسياً في العلوم الإنسانية.',
    textEnglish: 'Ibn Khaldun is regarded as the founder of sociology and the philosophy of history. He was born in Tunis in 1332 CE. In his famous Muqaddimah, he analyzed the rise and fall of civilizations through the concept of asabiyyah and historical cycles. He believed that states pass through phases of youth, maturity, then aging and decline. He preceded many Western thinkers by centuries with his ideas. His theories influenced Marx, Toynbee, and others. His thought remains an essential reference in the humanities.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_501', arabic: 'علم الاجتماع', english: 'sociology', transliteration: 'ilm al-ijtimaa' },
      { wordId: 'exp_b2_503', arabic: 'الحضارات', english: 'civilizations', transliteration: 'al-hadaaraat' },
      { wordId: 'exp_b2_505', arabic: 'العصبية', english: 'asabiyyah (group solidarity)', transliteration: 'al-asabiyya' },
      { wordId: 'exp_b2_507', arabic: 'نظريات', english: 'theories', transliteration: 'nadhariyyaat' },
    ],
    questions: [
      { id: 'b2_002_q1', type: 'multiple_choice', question: 'What is Ibn Khaldun considered the founder of?', questionArabic: 'ماذا يُعتبر ابن خلدون مؤسساً له؟', options: ['Mathematics', 'Sociology', 'Chemistry', 'Medicine'], correctIndex: 1 },
      { id: 'b2_002_q2', type: 'multiple_choice', question: 'What concept did he use to analyze civilizations?', questionArabic: 'ما المفهوم الذي استخدمه لتحليل الحضارات؟', options: ['Democracy', 'Asabiyyah', 'Capitalism', 'Evolution'], correctIndex: 1 },
      { id: 'b2_002_q3', type: 'true_false', question: 'Ibn Khaldun was born in Egypt.', questionArabic: 'وُلد ابن خلدون في مصر.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_002_q4', type: 'true_false', question: 'His ideas came after Western thinkers.', questionArabic: 'جاءت أفكاره بعد المفكرين الغربيين.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 98,
  },
  {
    id: 'b2_003',
    title: 'The Arabic Influence on the Spanish Language',
    titleArabic: 'تأثير العربية في اللغة الإسبانية',
    cefrLevel: 'B2',
    topic: 'culture',
    textArabic: 'تركت اللغة العربية أثراً عميقاً في الإسبانية خلال ثمانية قرون من الوجود العربي في الأندلس. يُقدر عدد الكلمات الإسبانية ذات الأصل العربي بنحو أربعة آلاف كلمة. كثير من هذه الكلمات تبدأ بأداة التعريف "ال" مثل الكوول والقطن والمخدة. تأثرت أيضاً الهندسة المعمارية والموسيقى والطبخ. قصر الحمراء في غرناطة يشهد على عظمة الحضارة الأندلسية. هذا التلاقح الثقافي يثبت أن الحضارات تتقدم بالتبادل والحوار لا بالانعزال.',
    textEnglish: 'The Arabic language left a deep impact on Spanish during eight centuries of Arab presence in Andalusia. The number of Spanish words of Arabic origin is estimated at about four thousand words. Many of these words begin with the Arabic definite article "al" such as alcohol, cotton (algodón), and pillow (almohada). Architecture, music, and cooking were also influenced. The Alhambra palace in Granada bears witness to the greatness of Andalusian civilization. This cultural cross-pollination proves that civilizations advance through exchange and dialogue, not isolation.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_201', arabic: 'الأندلس', english: 'Andalusia', transliteration: 'al-andalus' },
      { wordId: 'exp_b2_203', arabic: 'أصل', english: 'origin', transliteration: 'asl' },
      { wordId: 'exp_b2_205', arabic: 'الهندسة المعمارية', english: 'architecture', transliteration: 'al-handasa al-mimaariyya' },
      { wordId: 'exp_b2_207', arabic: 'التلاقح الثقافي', english: 'cultural cross-pollination', transliteration: 'at-talaaquh ath-thaqaafii' },
    ],
    questions: [
      { id: 'b2_003_q1', type: 'multiple_choice', question: 'How many Spanish words have Arabic origin?', questionArabic: 'كم عدد الكلمات الإسبانية ذات الأصل العربي؟', options: ['About 1,000', 'About 4,000', 'About 10,000', 'About 500'], correctIndex: 1 },
      { id: 'b2_003_q2', type: 'true_false', question: 'Arabs were in Andalusia for three centuries.', questionArabic: 'تواجد العرب في الأندلس ثلاثة قرون.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_003_q3', type: 'multiple_choice', question: 'Where is the Alhambra located?', questionArabic: 'أين يقع قصر الحمراء؟', options: ['Seville', 'Cordoba', 'Granada', 'Madrid'], correctIndex: 2 },
      { id: 'b2_003_q4', type: 'multiple_choice', question: 'According to the passage, how do civilizations advance?', questionArabic: 'وفقاً للنص، كيف تتقدم الحضارات؟', options: ['Through war', 'Through isolation', 'Through exchange and dialogue', 'Through competition'], correctIndex: 2 },
    ],
    wordCount: 102,
  },
  {
    id: 'b2_004',
    title: 'Artificial Intelligence and Ethics',
    titleArabic: 'الذكاء الاصطناعي والأخلاقيات',
    cefrLevel: 'B2',
    topic: 'technology',
    textArabic: 'يثير الذكاء الاصطناعي تساؤلات أخلاقية معقدة في العالم العربي والغربي على حد سواء. هل يمكن للآلة أن تتخذ قرارات أخلاقية؟ وما مسؤولية المبرمج عن أخطاء الخوارزميات؟ تخشى بعض المجتمعات أن يحل الذكاء الاصطناعي محل العمال في كثير من المهن. لكن آخرين يرون فيه أداة لتحسين حياة الإنسان في الطب والتعليم والزراعة. الحوار بين التقنيين والفلاسفة والعلماء الدينيين ضروري لوضع إطار أخلاقي يحكم تطوير هذه التقنية واستخدامها.',
    textEnglish: 'Artificial intelligence raises complex ethical questions in both the Arab and Western worlds. Can a machine make ethical decisions? And what is the programmer\'s responsibility for algorithm errors? Some societies fear that AI will replace workers in many professions. But others see it as a tool to improve human life in medicine, education, and agriculture. Dialogue between technologists, philosophers, and religious scholars is necessary to establish an ethical framework governing the development and use of this technology.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_301', arabic: 'الذكاء الاصطناعي', english: 'artificial intelligence', transliteration: 'adh-dhakaa al-istinaaii' },
      { wordId: 'exp_b2_303', arabic: 'الأخلاقيات', english: 'ethics', transliteration: 'al-akhlaaqiyyaat' },
      { wordId: 'exp_b2_305', arabic: 'الخوارزميات', english: 'algorithms', transliteration: 'al-khawaarizmiyyaat' },
      { wordId: 'exp_b2_307', arabic: 'إطار أخلاقي', english: 'ethical framework', transliteration: 'itaar akhlaaqii' },
    ],
    questions: [
      { id: 'b2_004_q1', type: 'multiple_choice', question: 'What does AI raise according to the passage?', questionArabic: 'ماذا يثير الذكاء الاصطناعي وفقاً للنص؟', options: ['Economic questions', 'Ethical questions', 'Political questions', 'Legal questions'], correctIndex: 1 },
      { id: 'b2_004_q2', type: 'true_false', question: 'Everyone agrees AI will only benefit humanity.', questionArabic: 'الجميع متفقون أن الذكاء الاصطناعي سيفيد البشرية فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_004_q3', type: 'multiple_choice', question: 'Who should participate in the dialogue about AI ethics?', questionArabic: 'من يجب أن يشارك في الحوار حول أخلاقيات الذكاء الاصطناعي؟', options: ['Only programmers', 'Only governments', 'Technologists, philosophers, and religious scholars', 'Only users'], correctIndex: 2 },
      { id: 'b2_004_q4', type: 'multiple_choice', question: 'In which fields can AI improve human life?', questionArabic: 'في أي مجالات يمكن للذكاء الاصطناعي تحسين حياة الإنسان؟', options: ['Only medicine', 'Medicine, education, and agriculture', 'Only technology', 'Only entertainment'], correctIndex: 1 },
    ],
    wordCount: 95,
  },
  {
    id: 'b2_005',
    title: 'The Concept of Time in Arab Culture',
    titleArabic: 'مفهوم الزمن في الثقافة العربية',
    cefrLevel: 'B2',
    topic: 'culture',
    textArabic: 'يختلف مفهوم الزمن في الثقافة العربية عنه في الثقافة الغربية اختلافاً جوهرياً. في الغرب الوقت خطي ومحدود ويُقاس بالدقائق والثواني. أما في الثقافة العربية فالزمن أكثر مرونة ويرتبط بالعلاقات الإنسانية. عبارة "إن شاء الله" لا تعني التسويف بل تعكس إيماناً عميقاً بأن المستقبل بيد الله. تقدير الضيافة والمحادثة أهم من الالتزام الصارم بالمواعيد. فهم هذا الاختلاف الثقافي ضروري للتواصل الفعال بين الحضارات.',
    textEnglish: 'The concept of time in Arab culture differs fundamentally from Western culture. In the West, time is linear, limited, and measured in minutes and seconds. But in Arab culture, time is more flexible and linked to human relationships. The phrase "In sha Allah" does not mean procrastination but reflects a deep faith that the future is in God\'s hands. Valuing hospitality and conversation is more important than strict adherence to schedules. Understanding this cultural difference is essential for effective cross-cultural communication.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_401', arabic: 'مفهوم', english: 'concept', transliteration: 'mafhuum' },
      { wordId: 'exp_b2_403', arabic: 'الزمن', english: 'time', transliteration: 'az-zaman' },
      { wordId: 'exp_b2_405', arabic: 'مرونة', english: 'flexibility', transliteration: 'muruuna' },
      { wordId: 'exp_b2_407', arabic: 'التسويف', english: 'procrastination', transliteration: 'at-taswiif' },
    ],
    questions: [
      { id: 'b2_005_q1', type: 'multiple_choice', question: 'How is time viewed in Western culture?', questionArabic: 'كيف يُنظر إلى الزمن في الثقافة الغربية؟', options: ['Flexible and open', 'Linear and limited', 'Circular', 'Unimportant'], correctIndex: 1 },
      { id: 'b2_005_q2', type: 'true_false', question: '"In sha Allah" means procrastination.', questionArabic: '"إن شاء الله" تعني التسويف.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_005_q3', type: 'multiple_choice', question: 'What is more important in Arab culture than strict schedules?', questionArabic: 'ما الأهم في الثقافة العربية من الالتزام الصارم بالمواعيد؟', options: ['Efficiency', 'Hospitality and conversation', 'Speed', 'Planning'], correctIndex: 1 },
      { id: 'b2_005_q4', type: 'true_false', question: 'Understanding cultural differences is unimportant for communication.', questionArabic: 'فهم الاختلافات الثقافية غير مهم للتواصل.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 92,
  },
  {
    id: 'b2_006',
    title: 'The House of Wisdom in Baghdad',
    titleArabic: 'بيت الحكمة في بغداد',
    cefrLevel: 'B2',
    topic: 'history',
    textArabic: 'أسس الخليفة هارون الرشيد بيت الحكمة في بغداد في القرن الثامن الميلادي وبلغ أوجه في عهد المأمون. كان مركزاً علمياً عالمياً ترجمت فيه أعمال الإغريق والفرس والهنود إلى العربية. عمل فيه علماء من مختلف الأديان والثقافات جنباً إلى جنب. أسهم في تطوير الجبر والفلك والطب والفلسفة. حفظ المعرفة الإنسانية من الضياع ونقلها إلى أوروبا لاحقاً. يُعتبر نموذجاً مبكراً للتعاون العلمي الدولي الذي نسعى إليه اليوم.',
    textEnglish: 'Caliph Harun al-Rashid founded the House of Wisdom in Baghdad in the eighth century CE, and it reached its peak under al-Ma\'mun. It was a global scientific center where Greek, Persian, and Indian works were translated into Arabic. Scholars of different religions and cultures worked there side by side. It contributed to the development of algebra, astronomy, medicine, and philosophy. It preserved human knowledge from being lost and later transferred it to Europe. It is considered an early model of the international scientific cooperation we aspire to today.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_511', arabic: 'بيت الحكمة', english: 'House of Wisdom', transliteration: 'bayt al-hikma' },
      { wordId: 'exp_b2_513', arabic: 'ترجمت', english: 'were translated', transliteration: 'turjimat' },
      { wordId: 'exp_b2_515', arabic: 'الجبر', english: 'algebra', transliteration: 'al-jabr' },
      { wordId: 'exp_b2_517', arabic: 'الفلسفة', english: 'philosophy', transliteration: 'al-falsafa' },
    ],
    questions: [
      { id: 'b2_006_q1', type: 'multiple_choice', question: 'Who founded the House of Wisdom?', questionArabic: 'من أسس بيت الحكمة؟', options: ['Al-Ma\'mun', 'Harun al-Rashid', 'Saladin', 'Al-Mansur'], correctIndex: 1 },
      { id: 'b2_006_q2', type: 'true_false', question: 'Only Muslim scholars worked there.', questionArabic: 'عمل فيه علماء مسلمون فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_006_q3', type: 'multiple_choice', question: 'Which sciences were developed there?', questionArabic: 'أي العلوم تطورت هناك؟', options: ['Nuclear physics', 'Algebra, astronomy, and medicine', 'Computer science', 'Psychology'], correctIndex: 1 },
      { id: 'b2_006_q4', type: 'multiple_choice', question: 'What works were translated into Arabic?', questionArabic: 'ما الأعمال التي ترجمت إلى العربية؟', options: ['Chinese and Japanese', 'Greek, Persian, and Indian', 'Latin and Germanic', 'African and Asian'], correctIndex: 1 },
    ],
    wordCount: 100,
  },
  {
    id: 'b2_007',
    title: 'The Concept of Justice in Islamic Philosophy',
    titleArabic: 'مفهوم العدالة في الفلسفة الإسلامية',
    cefrLevel: 'B2',
    topic: 'religion',
    textArabic: 'تحتل العدالة مكانة محورية في الفكر الإسلامي. ناقش الفلاسفة المسلمون مثل الفارابي وابن رشد العلاقة بين العدل والشريعة. رأى الفارابي أن المدينة الفاضلة تقوم على العدل والحكمة. أما ابن رشد فحاول التوفيق بين الفلسفة اليونانية والشريعة الإسلامية. العدل في الإسلام يشمل العدل الاجتماعي والاقتصادي والقضائي. الزكاة مثال على آلية توزيع الثروة لتحقيق العدالة. هذا الإرث الفكري لا يزال يغذي النقاشات المعاصرة حول الحوكمة والمساواة.',
    textEnglish: 'Justice occupies a central place in Islamic thought. Muslim philosophers such as Al-Farabi and Ibn Rushd discussed the relationship between justice and Islamic law. Al-Farabi believed that the virtuous city is founded on justice and wisdom. Ibn Rushd attempted to reconcile Greek philosophy with Islamic law. Justice in Islam encompasses social, economic, and judicial justice. Zakat is an example of a wealth distribution mechanism to achieve justice. This intellectual legacy continues to nourish contemporary debates about governance and equality.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_601', arabic: 'العدالة', english: 'justice', transliteration: 'al-adaala' },
      { wordId: 'exp_b2_603', arabic: 'الشريعة', english: 'Islamic law', transliteration: 'ash-shariia' },
      { wordId: 'exp_b2_605', arabic: 'المدينة الفاضلة', english: 'the virtuous city', transliteration: 'al-madiina al-faadila' },
      { wordId: 'exp_b2_607', arabic: 'الزكاة', english: 'zakat (almsgiving)', transliteration: 'az-zakaah' },
    ],
    questions: [
      { id: 'b2_007_q1', type: 'multiple_choice', question: 'What did Al-Farabi believe the virtuous city is founded on?', questionArabic: 'على ماذا تقوم المدينة الفاضلة عند الفارابي؟', options: ['Power and wealth', 'Justice and wisdom', 'Trade and commerce', 'Military strength'], correctIndex: 1 },
      { id: 'b2_007_q2', type: 'true_false', question: 'Ibn Rushd rejected Greek philosophy entirely.', questionArabic: 'رفض ابن رشد الفلسفة اليونانية تماماً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_007_q3', type: 'multiple_choice', question: 'What is zakat an example of?', questionArabic: 'الزكاة مثال على ماذا؟', options: ['A tax on trade', 'A wealth distribution mechanism', 'A form of worship only', 'A government tax'], correctIndex: 1 },
      { id: 'b2_007_q4', type: 'multiple_choice', question: 'What types of justice does Islam encompass?', questionArabic: 'ما أنواع العدل التي يشملها الإسلام؟', options: ['Only judicial', 'Only economic', 'Social, economic, and judicial', 'Only social'], correctIndex: 2 },
    ],
    wordCount: 98,
  },
  {
    id: 'b2_008',
    title: 'Water Scarcity in the Arab World',
    titleArabic: 'ندرة المياه في العالم العربي',
    cefrLevel: 'B2',
    topic: 'nature',
    textArabic: 'يعاني العالم العربي من ندرة حادة في المياه العذبة. تقع معظم الدول العربية في مناطق جافة وشبه جافة حيث يندر هطول الأمطار. تتزايد الأزمة مع النمو السكاني والتغير المناخي واستنزاف المياه الجوفية. تلجأ بعض الدول إلى تحلية مياه البحر رغم تكلفتها المرتفعة. تعتمد دول أخرى على مشاريع الري المتطورة وإعادة استخدام المياه المعالجة. المحافظة على المياه ليست ترفاً بل ضرورة حيوية تتطلب تعاوناً إقليمياً وتغييراً في السلوك الاستهلاكي.',
    textEnglish: 'The Arab world suffers from severe freshwater scarcity. Most Arab countries are located in arid and semi-arid regions where rainfall is scarce. The crisis is increasing with population growth, climate change, and groundwater depletion. Some countries resort to seawater desalination despite its high cost. Other countries rely on advanced irrigation projects and reuse of treated water. Water conservation is not a luxury but a vital necessity requiring regional cooperation and changes in consumption behavior.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_701', arabic: 'ندرة', english: 'scarcity', transliteration: 'nudra' },
      { wordId: 'exp_b2_703', arabic: 'المياه الجوفية', english: 'groundwater', transliteration: 'al-miyaah al-jawfiyya' },
      { wordId: 'exp_b2_705', arabic: 'تحلية', english: 'desalination', transliteration: 'tahliya' },
      { wordId: 'exp_b2_707', arabic: 'التغير المناخي', english: 'climate change', transliteration: 'at-taghayur al-munaakhii' },
    ],
    questions: [
      { id: 'b2_008_q1', type: 'multiple_choice', question: 'What type of region are most Arab countries in?', questionArabic: 'في أي نوع من المناطق تقع معظم الدول العربية؟', options: ['Tropical', 'Arid and semi-arid', 'Temperate', 'Arctic'], correctIndex: 1 },
      { id: 'b2_008_q2', type: 'true_false', question: 'Seawater desalination is cheap.', questionArabic: 'تحلية مياه البحر رخيصة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_008_q3', type: 'multiple_choice', question: 'What factors increase the water crisis?', questionArabic: 'ما العوامل التي تزيد أزمة المياه؟', options: ['Only climate change', 'Population growth, climate change, and groundwater depletion', 'Only population growth', 'Only pollution'], correctIndex: 1 },
      { id: 'b2_008_q4', type: 'true_false', question: 'Water conservation is described as a luxury.', questionArabic: 'وُصفت المحافظة على المياه بأنها ترف.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 96,
  },
  {
    id: 'b2_009',
    title: 'The Arabic Novel: Naguib Mahfouz',
    titleArabic: 'الرواية العربية: نجيب محفوظ',
    cefrLevel: 'B2',
    topic: 'art',
    textArabic: 'نجيب محفوظ أول أديب عربي يحصل على جائزة نوبل للأدب عام ألف وتسعمئة وثمانية وثمانين. رصدت رواياته التحولات الاجتماعية في مصر عبر القرن العشرين. تعتبر ثلاثية القاهرة أعظم أعماله حيث صور ثلاثة أجيال من عائلة مصرية. مزج بين الواقعية والرمزية في أسلوب سردي فريد. تناول قضايا الحرية والسلطة والبحث عن المعنى. تأثر بالأدب الغربي لكنه حافظ على هويته المصرية والعربية. فتح الباب أمام الأدب العربي ليصل إلى القارئ العالمي.',
    textEnglish: 'Naguib Mahfouz was the first Arab writer to receive the Nobel Prize for Literature in 1988. His novels documented social transformations in Egypt throughout the twentieth century. The Cairo Trilogy is considered his greatest work, depicting three generations of an Egyptian family. He blended realism and symbolism in a unique narrative style. He addressed issues of freedom, authority, and the search for meaning. He was influenced by Western literature but maintained his Egyptian and Arab identity. He opened the door for Arabic literature to reach the global reader.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_911', arabic: 'جائزة نوبل', english: 'Nobel Prize', transliteration: 'jaaizat nuubil' },
      { wordId: 'exp_b2_913', arabic: 'التحولات الاجتماعية', english: 'social transformations', transliteration: 'at-tahawwulaat al-ijtimaaiyya' },
      { wordId: 'exp_b2_915', arabic: 'الواقعية', english: 'realism', transliteration: 'al-waaqiiyya' },
      { wordId: 'exp_b2_917', arabic: 'السرد', english: 'narrative', transliteration: 'as-sard' },
    ],
    questions: [
      { id: 'b2_009_q1', type: 'multiple_choice', question: 'When did Naguib Mahfouz receive the Nobel Prize?', questionArabic: 'متى حصل نجيب محفوظ على جائزة نوبل؟', options: ['1978', '1988', '1998', '1968'], correctIndex: 1 },
      { id: 'b2_009_q2', type: 'multiple_choice', question: 'What is considered his greatest work?', questionArabic: 'ما أعظم أعماله؟', options: ['Midaq Alley', 'The Cairo Trilogy', 'Children of Gebelawi', 'The Thief and the Dogs'], correctIndex: 1 },
      { id: 'b2_009_q3', type: 'true_false', question: 'Mahfouz completely rejected Western literary influence.', questionArabic: 'رفض محفوظ التأثر بالأدب الغربي تماماً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_009_q4', type: 'true_false', question: 'The Cairo Trilogy follows one generation of a family.', questionArabic: 'ثلاثية القاهرة تتبع جيلاً واحداً من عائلة.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 104,
  },
  {
    id: 'b2_010',
    title: 'Astronomy in Islamic Civilization',
    titleArabic: 'علم الفلك في الحضارة الإسلامية',
    cefrLevel: 'B2',
    topic: 'history',
    textArabic: 'ازدهر علم الفلك في الحضارة الإسلامية بين القرنين الثامن والخامس عشر الميلاديين. بنى العلماء المسلمون مراصد فلكية متقدمة في بغداد وسمرقند والقاهرة. طور الخوارزمي جداول فلكية دقيقة وصحح أخطاء بطليموس. أسماء كثير من النجوم مثل الدبران والمنكب والرجل ذات أصل عربي. استخدم المسلمون الإسطرلاب لتحديد أوقات الصلاة واتجاه القبلة. مهدت إسهاماتهم الطريق لعصر النهضة الأوروبي وثورة كوبرنيكوس الفلكية.',
    textEnglish: 'Astronomy flourished in Islamic civilization between the eighth and fifteenth centuries CE. Muslim scholars built advanced astronomical observatories in Baghdad, Samarkand, and Cairo. Al-Khwarizmi developed precise astronomical tables and corrected Ptolemy\'s errors. Many star names such as Aldebaran, Betelgeuse, and Rigel are of Arabic origin. Muslims used the astrolabe to determine prayer times and the direction of Mecca. Their contributions paved the way for the European Renaissance and the Copernican astronomical revolution.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_521', arabic: 'علم الفلك', english: 'astronomy', transliteration: 'ilm al-falak' },
      { wordId: 'exp_b2_523', arabic: 'مراصد', english: 'observatories', transliteration: 'maraasid' },
      { wordId: 'exp_b2_525', arabic: 'الإسطرلاب', english: 'astrolabe', transliteration: 'al-isturlaab' },
      { wordId: 'exp_b2_527', arabic: 'القبلة', english: 'direction of Mecca', transliteration: 'al-qibla' },
    ],
    questions: [
      { id: 'b2_010_q1', type: 'multiple_choice', question: 'Where were observatories built?', questionArabic: 'أين بُنيت المراصد؟', options: ['London, Paris, Rome', 'Baghdad, Samarkand, Cairo', 'Delhi, Beijing, Tokyo', 'Athens, Alexandria, Carthage'], correctIndex: 1 },
      { id: 'b2_010_q2', type: 'true_false', question: 'Star names like Aldebaran have Arabic origin.', questionArabic: 'أسماء نجوم مثل الدبران ذات أصل عربي.', options: ['True', 'False'], correctIndex: 0 },
      { id: 'b2_010_q3', type: 'multiple_choice', question: 'What was the astrolabe used for?', questionArabic: 'فيم استُخدم الإسطرلاب؟', options: ['Cooking', 'Navigation only', 'Prayer times and Mecca direction', 'Writing'], correctIndex: 2 },
      { id: 'b2_010_q4', type: 'multiple_choice', question: 'Whose errors did Al-Khwarizmi correct?', questionArabic: 'أخطاء من صحح الخوارزمي؟', options: ['Aristotle', 'Ptolemy', 'Plato', 'Hippocrates'], correctIndex: 1 },
    ],
    wordCount: 90,
  },
  {
    id: 'b2_011',
    title: 'The Diaspora and Identity',
    titleArabic: 'الشتات والهوية',
    cefrLevel: 'B2',
    topic: 'culture',
    textArabic: 'يعيش ملايين العرب في بلدان المهجر حيث يواجهون تحديات الحفاظ على هويتهم الثقافية. الجيل الأول يحمل ذكريات الوطن بينما ينشأ أبناؤهم بين ثقافتين. يتقن كثير من أبناء الجالية لغة البلد المضيف لكنهم يفقدون تدريجياً إتقان العربية. تلعب المراكز الثقافية والمساجد والمدارس العربية دوراً مهماً في نقل الثقافة. الأدب العربي في المهجر مثل أعمال جبران خليل جبران أثرى الثقافة العالمية. الهوية ليست ثابتة بل تتطور باستمرار في حوار بين الأصل والمكان الجديد.',
    textEnglish: 'Millions of Arabs live in diaspora countries where they face challenges in preserving their cultural identity. The first generation carries memories of the homeland while their children grow up between two cultures. Many community members master the host country\'s language but gradually lose their Arabic proficiency. Cultural centers, mosques, and Arabic schools play an important role in transmitting culture. Arabic diaspora literature, such as the works of Khalil Gibran, has enriched world culture. Identity is not fixed but continuously evolves in a dialogue between origin and the new place.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_411', arabic: 'المهجر', english: 'diaspora/emigration', transliteration: 'al-mahjar' },
      { wordId: 'exp_b2_413', arabic: 'الهوية', english: 'identity', transliteration: 'al-hawiyya' },
      { wordId: 'exp_b2_415', arabic: 'الجالية', english: 'community (diaspora)', transliteration: 'al-jaaliya' },
      { wordId: 'exp_b2_417', arabic: 'الأدب', english: 'literature', transliteration: 'al-adab' },
    ],
    questions: [
      { id: 'b2_011_q1', type: 'multiple_choice', question: 'What challenge do diaspora Arabs face?', questionArabic: 'ما التحدي الذي يواجهه عرب المهجر؟', options: ['Finding food', 'Preserving cultural identity', 'Learning to drive', 'Finding housing'], correctIndex: 1 },
      { id: 'b2_011_q2', type: 'true_false', question: 'Second-generation Arabs never lose their Arabic.', questionArabic: 'الجيل الثاني من العرب لا يفقد عربيته أبداً.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_011_q3', type: 'multiple_choice', question: 'Which diaspora writer is mentioned?', questionArabic: 'أي كاتب مهجري ذُكر؟', options: ['Naguib Mahfouz', 'Khalil Gibran', 'Mahmoud Darwish', 'Taha Hussein'], correctIndex: 1 },
      { id: 'b2_011_q4', type: 'true_false', question: 'The passage describes identity as fixed and unchanging.', questionArabic: 'يصف النص الهوية بأنها ثابتة ولا تتغير.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 102,
  },
  {
    id: 'b2_012',
    title: 'Islamic Architecture: The Mosque',
    titleArabic: 'العمارة الإسلامية: المسجد',
    cefrLevel: 'B2',
    topic: 'art',
    textArabic: 'المسجد ليس مكاناً للعبادة فحسب بل هو مركز اجتماعي وتعليمي. تطورت العمارة الإسلامية عبر القرون لتنتج روائع معمارية مثل مسجد قرطبة والأزهر والسليمانية. تتميز المساجد بعناصر معمارية فريدة كالقبة والمئذنة والمحراب والأقواس. الزخرفة الهندسية والنباتية تغطي الجدران بدلاً من التصوير البشري. تعكس هذه الجماليات مفاهيم التوحيد واللانهائية. المعماريون المسلمون حققوا إنجازات هندسية سبقت عصرهم في التهوية والإضاءة الطبيعية والأكوستيك.',
    textEnglish: 'The mosque is not merely a place of worship but a social and educational center. Islamic architecture evolved over centuries to produce architectural masterpieces such as the Cordoba Mosque, Al-Azhar, and the Suleymaniye. Mosques feature unique architectural elements like the dome, minaret, mihrab, and arches. Geometric and floral decorations cover the walls instead of human imagery. These aesthetics reflect concepts of monotheism and infinity. Muslim architects achieved engineering feats ahead of their time in ventilation, natural lighting, and acoustics.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_211', arabic: 'العمارة', english: 'architecture', transliteration: 'al-imaara' },
      { wordId: 'exp_b2_213', arabic: 'القبة', english: 'dome', transliteration: 'al-qubba' },
      { wordId: 'exp_b2_215', arabic: 'المئذنة', english: 'minaret', transliteration: 'al-midhnana' },
      { wordId: 'exp_b2_217', arabic: 'الزخرفة', english: 'ornamentation', transliteration: 'az-zakhrufa' },
    ],
    questions: [
      { id: 'b2_012_q1', type: 'multiple_choice', question: 'What architectural elements characterize mosques?', questionArabic: 'ما العناصر المعمارية التي تميز المساجد؟', options: ['Towers and bridges', 'Dome, minaret, and mihrab', 'Pillars and statues', 'Windows and balconies'], correctIndex: 1 },
      { id: 'b2_012_q2', type: 'true_false', question: 'Mosques use human imagery for decoration.', questionArabic: 'تستخدم المساجد التصوير البشري في الزخرفة.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_012_q3', type: 'multiple_choice', question: 'What does the passage say mosques are beyond worship?', questionArabic: 'ماذا يقول النص عن دور المسجد إلى جانب العبادة؟', options: ['A market', 'A social and educational center', 'A hospital', 'A government building'], correctIndex: 1 },
      { id: 'b2_012_q4', type: 'true_false', question: 'Muslim architects were behind their time in engineering.', questionArabic: 'كان المعماريون المسلمون متأخرين عن عصرهم هندسياً.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 94,
  },
  {
    id: 'b2_013',
    title: 'Women in Arab Science',
    titleArabic: 'المرأة في العلوم العربية',
    cefrLevel: 'B2',
    topic: 'education',
    textArabic: 'تزداد مشاركة المرأة العربية في المجالات العلمية بشكل ملحوظ. تشكل النساء نسبة عالية من خريجي العلوم والهندسة في دول الخليج. حصلت عالمات عربيات على اعتراف دولي في مجالات الطب والفيزياء والبيئة. تاريخياً لعبت المرأة دوراً في العلم كما في حالة مريم الإسطرلابي التي صنعت أسطرلابات معقدة في القرن العاشر. رغم التقدم لا تزال هناك عوائق اجتماعية ومؤسسية. دعم المرأة في العلوم يعني دعم مستقبل المنطقة بأكملها.',
    textEnglish: 'Arab women\'s participation in scientific fields is increasing notably. Women constitute a high percentage of science and engineering graduates in Gulf countries. Arab women scientists have received international recognition in medicine, physics, and environmental science. Historically, women played a role in science, as in the case of Mariam al-Astrulabi, who crafted complex astrolabes in the tenth century. Despite progress, social and institutional barriers remain. Supporting women in science means supporting the future of the entire region.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_151', arabic: 'المجالات العلمية', english: 'scientific fields', transliteration: 'al-majaalaat al-ilmiyya' },
      { wordId: 'exp_b2_153', arabic: 'خريجي', english: 'graduates', transliteration: 'khirriijii' },
      { wordId: 'exp_b2_155', arabic: 'عوائق', english: 'barriers', transliteration: 'awaiq' },
    ],
    questions: [
      { id: 'b2_013_q1', type: 'multiple_choice', question: 'Who was Mariam al-Astrulabi?', questionArabic: 'من كانت مريم الإسطرلابي؟', options: ['A poet', 'A queen', 'A scientist who made astrolabes', 'A teacher'], correctIndex: 2 },
      { id: 'b2_013_q2', type: 'true_false', question: 'There are no remaining barriers for women in Arab science.', questionArabic: 'لا توجد عوائق متبقية أمام المرأة في العلوم العربية.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_013_q3', type: 'multiple_choice', question: 'Where do women form a high percentage of science graduates?', questionArabic: 'أين تشكل النساء نسبة عالية من خريجي العلوم؟', options: ['North Africa', 'The Levant', 'Gulf countries', 'All Arab countries equally'], correctIndex: 2 },
      { id: 'b2_013_q4', type: 'true_false', question: 'Supporting women in science benefits only women.', questionArabic: 'دعم المرأة في العلوم يفيد المرأة فقط.', options: ['True', 'False'], correctIndex: 1 },
    ],
    wordCount: 96,
  },
  {
    id: 'b2_014',
    title: 'The Philosophy of Ibn Sina',
    titleArabic: 'فلسفة ابن سينا',
    cefrLevel: 'B2',
    topic: 'history',
    textArabic: 'ابن سينا من أبرز العقول في تاريخ الفكر الإنساني. أتقن الطب والفلسفة والمنطق والرياضيات. كتابه "القانون في الطب" ظل مرجعاً أساسياً في الجامعات الأوروبية حتى القرن السابع عشر. في الفلسفة ميّز بين الوجود والماهية وطور برهان الوجود الواجب. تجربته الفكرية المعروفة "الإنسان الطائر" استكشفت طبيعة الوعي بطريقة سبقت ديكارت بقرون. جمع بين التراث اليوناني والحكمة الإسلامية في منظومة فكرية متكاملة. يظل تأثيره حاضراً في الفلسفة والطب حتى اليوم.',
    textEnglish: 'Ibn Sina is one of the most prominent minds in the history of human thought. He mastered medicine, philosophy, logic, and mathematics. His book "The Canon of Medicine" remained an essential reference in European universities until the seventeenth century. In philosophy, he distinguished between existence and essence and developed the proof of the Necessary Existent. His famous thought experiment "The Flying Man" explored the nature of consciousness in a way that preceded Descartes by centuries. He combined the Greek tradition with Islamic wisdom in an integrated intellectual system. His influence remains present in philosophy and medicine to this day.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_531', arabic: 'الفلسفة', english: 'philosophy', transliteration: 'al-falsafa' },
      { wordId: 'exp_b2_533', arabic: 'المنطق', english: 'logic', transliteration: 'al-mantiq' },
      { wordId: 'exp_b2_535', arabic: 'الوجود', english: 'existence', transliteration: 'al-wujuud' },
      { wordId: 'exp_b2_537', arabic: 'الوعي', english: 'consciousness', transliteration: 'al-waii' },
    ],
    questions: [
      { id: 'b2_014_q1', type: 'multiple_choice', question: 'Until when was "The Canon of Medicine" used in Europe?', questionArabic: 'حتى متى ظل "القانون في الطب" مستخدماً في أوروبا؟', options: ['The 14th century', 'The 15th century', 'The 17th century', 'The 19th century'], correctIndex: 2 },
      { id: 'b2_014_q2', type: 'true_false', question: 'Ibn Sina only studied medicine.', questionArabic: 'درس ابن سينا الطب فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_014_q3', type: 'multiple_choice', question: 'What did "The Flying Man" thought experiment explore?', questionArabic: 'ماذا استكشفت تجربة "الإنسان الطائر"؟', options: ['Aviation', 'Gravity', 'Consciousness', 'Dreams'], correctIndex: 2 },
      { id: 'b2_014_q4', type: 'multiple_choice', question: 'What did Ibn Sina distinguish between in philosophy?', questionArabic: 'بين ماذا ميّز ابن سينا في الفلسفة؟', options: ['Good and evil', 'Existence and essence', 'Mind and body', 'Science and religion'], correctIndex: 1 },
    ],
    wordCount: 104,
  },
  {
    id: 'b2_015',
    title: 'The Future of the Arabic Language',
    titleArabic: 'مستقبل اللغة العربية',
    cefrLevel: 'B2',
    topic: 'education',
    textArabic: 'تواجه اللغة العربية تحديات وفرصاً في القرن الحادي والعشرين. يتزايد استخدام اللغات الأجنبية في التعليم والأعمال مما يهمش الفصحى. في المقابل أتاحت التكنولوجيا فرصاً غير مسبوقة لنشر المحتوى العربي الرقمي. اللهجات العامية تنافس الفصحى في وسائل الإعلام والتواصل اليومي. يدعو لغويون إلى تحديث المناهج لتجعل تعليم العربية أكثر جاذبية وتفاعلية. العربية لغة حية تتطور وتتكيف مع العصر دون أن تفقد جوهرها. الحفاظ عليها مسؤولية جماعية تبدأ من الأسرة وتمتد إلى المؤسسات والحكومات.',
    textEnglish: 'The Arabic language faces challenges and opportunities in the twenty-first century. The increasing use of foreign languages in education and business marginalizes Modern Standard Arabic. On the other hand, technology has provided unprecedented opportunities for spreading digital Arabic content. Colloquial dialects compete with Modern Standard Arabic in media and daily communication. Linguists call for updating curricula to make Arabic teaching more attractive and interactive. Arabic is a living language that evolves and adapts to the era without losing its essence. Preserving it is a collective responsibility that starts from the family and extends to institutions and governments.',
    vocabularyHighlights: [
      { wordId: 'exp_b2_801', arabic: 'الفصحى', english: 'Modern Standard Arabic', transliteration: 'al-fushaa' },
      { wordId: 'exp_b2_803', arabic: 'اللهجات', english: 'dialects', transliteration: 'al-lahjaat' },
      { wordId: 'exp_b2_805', arabic: 'المحتوى الرقمي', english: 'digital content', transliteration: 'al-muhtawaa ar-raqamii' },
      { wordId: 'exp_b2_807', arabic: 'المناهج', english: 'curricula', transliteration: 'al-manaahij' },
    ],
    questions: [
      { id: 'b2_015_q1', type: 'multiple_choice', question: 'What competes with Modern Standard Arabic?', questionArabic: 'ما الذي ينافس الفصحى؟', options: ['English only', 'Colloquial dialects', 'French only', 'Sign language'], correctIndex: 1 },
      { id: 'b2_015_q2', type: 'true_false', question: 'Technology has only harmed the Arabic language.', questionArabic: 'التكنولوجيا أضرت باللغة العربية فقط.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_015_q3', type: 'multiple_choice', question: 'What do linguists call for?', questionArabic: 'إلى ماذا يدعو اللغويون؟', options: ['Abandoning Arabic', 'Using only English', 'Updating teaching curricula', 'Removing dialects'], correctIndex: 2 },
      { id: 'b2_015_q4', type: 'true_false', question: 'Preserving Arabic is the government\'s responsibility alone.', questionArabic: 'الحفاظ على العربية مسؤولية الحكومة وحدها.', options: ['True', 'False'], correctIndex: 1 },
      { id: 'b2_015_q5', type: 'multiple_choice', question: 'How does the passage describe Arabic?', questionArabic: 'كيف يصف النص اللغة العربية؟', options: ['A dead language', 'A living language that evolves', 'An outdated language', 'A simple language'], correctIndex: 1 },
    ],
    wordCount: 108,
  },
];

// ============================================================
// Merge all levels into single array
// ============================================================

export const READING_PASSAGES = [
  ...A1_PASSAGES,
  ...A2_PASSAGES,
  ...B1_PASSAGES,
  ...B2_PASSAGES,
];

// ============================================================
// Helper functions
// ============================================================

/**
 * Get passages filtered by CEFR level
 * @param {'A1'|'A2'|'B1'|'B2'} level
 * @returns {Array} Filtered passages
 */
export function getPassagesByCefrLevel(level) {
  if (!level) return READING_PASSAGES;
  return READING_PASSAGES.filter(p => p.cefrLevel === level);
}

/**
 * Get a passage by ID
 * @param {string} id
 * @returns {Object|null}
 */
export function getReadingPassageById(id) {
  return READING_PASSAGES.find(p => p.id === id) || null;
}

/**
 * Get passages filtered by topic
 * @param {string} topic
 * @returns {Array}
 */
export function getPassagesByTopic(topic) {
  if (!topic) return READING_PASSAGES;
  return READING_PASSAGES.filter(p => p.topic === topic);
}

/**
 * Get all unique topics
 * @returns {string[]}
 */
export function getAllTopics() {
  return [...new Set(READING_PASSAGES.map(p => p.topic))].sort();
}

/**
 * Get passage count per CEFR level
 * @returns {{ A1: number, A2: number, B1: number, B2: number }}
 */
export function getPassageCountByLevel() {
  const counts = { A1: 0, A2: 0, B1: 0, B2: 0 };
  for (const p of READING_PASSAGES) {
    counts[p.cefrLevel]++;
  }
  return counts;
}

// Compatibility aliases for pre-existing ReadingExercise component
export const PASSAGES = READING_PASSAGES;
export function getPassagesByDifficulty(difficulty) {
  return getPassagesByCefrLevel(difficulty);
}
