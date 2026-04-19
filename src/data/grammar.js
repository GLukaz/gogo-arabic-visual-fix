/**
 * Grammar Lessons Data
 * Structured lessons covering Arabic grammar fundamentals
 */

export const grammarLessons = [
  {
    id: 'al-definite',
    title: 'The Definite Article: ال',
    titleArabic: 'أداة التعريف',
    category: 'basics',
    difficulty: 1,
    order: 1,
    cefrLevel: 'A1',
    explanation: `In Arabic, the definite article "the" is expressed by adding ال (al-) to the beginning of a word. This transforms an indefinite noun into a definite one.

For example:
• كتاب (kitaab) = "a book"
• الكتاب (al-kitaab) = "the book"

There's a twist though! Arabic has "sun letters" and "moon letters." When ال comes before a sun letter, the ل (L) sound assimilates into the following letter, though the spelling stays the same.

Sun letters: ت ث د ذ ر ز س ش ص ض ط ظ ل ن
Moon letters: أ ب ج ح خ ع غ ف ق ك م و ه ي`,
    examples: [
      { arabic: 'الكتاب', english: 'the book', transliteration: 'al-kitaab', breakdown: 'ال + كتاب' },
      { arabic: 'الشمس', english: 'the sun', transliteration: 'ash-shams', breakdown: 'ال + شمس (sun letter: ش)' },
      { arabic: 'القمر', english: 'the moon', transliteration: 'al-qamar', breakdown: 'ال + قمر (moon letter: ق)' },
      { arabic: 'البيت', english: 'the house', transliteration: 'al-bayt', breakdown: 'ال + بيت' },
    ],
    rules: [
      { rule: 'Sun letters assimilate the ل sound', example: 'الشمس → ash-shams (not al-shams)' },
      { rule: 'Moon letters keep the ل sound', example: 'القمر → al-qamar' },
      { rule: 'The spelling always uses ال regardless', example: 'Both sun and moon words are written with ال' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ كتاب (the book)', answer: 'ال', options: ['ال', 'إل', 'أل', 'لا'] },
      { type: 'translate', prompt: 'the house', answer: 'البيت', options: ['بيت', 'البيت', 'بيتي', 'بيتك'] },
      { type: 'fill-blank', prompt: '___ ولد (the boy)', answer: 'ال', options: ['ال', 'في', 'من', 'إلى'] },
      { type: 'translate', prompt: 'the girl', answer: 'البنت', options: ['بنت', 'البنت', 'بنتي', 'بنات'] },
      { type: 'match', prompt: 'Match the Arabic with English', pairs: [['الولد', 'the boy'], ['البنت', 'the girl'], ['الكتاب', 'the book'], ['البيت', 'the house']] },
      { type: 'true-false', statement: 'الشمس is pronounced "al-shams" (the ل is fully pronounced)', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'القمر is a moon-letter word so ال stays as "al-"', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'إل كتاب على الطاولة', error: 'إل', correction: 'ال', answer: 'إل', options: ['إل', 'كتاب', 'على', 'No error'] },
      { type: 'classify', prompt: 'Classify as sun or moon letter', categories: ['Sun', 'Moon'], items: [{ text: 'ش', category: 'Sun' }, { text: 'ب', category: 'Moon' }, { text: 'ر', category: 'Sun' }, { text: 'ق', category: 'Moon' }] },
      { type: 'multiple-select', prompt: 'Select all sun letters:', correctAnswers: ['ت', 'ش', 'ر'], options: ['ت', 'ب', 'ش', 'ر', 'ق'], answer: 'ت,ش,ر' },
      { type: 'word-order', prompt: 'Which sentence is correct?', answer: 'الكتاب على الطاولة', options: ['الكتاب على الطاولة', 'على الكتاب الطاولة', 'الطاولة الكتاب على', 'على الطاولة الكتاب'] },
      { type: 'cloze', text: '___ شمس ساطعة و___ قمر مضيء', blanks: [{ answer: 'ال', options: ['ال', 'إل', 'أل'] }, { answer: 'ال', options: ['ال', 'في', 'من'] }] },
    ],
    quiz: [
      { question: 'Which word uses a sun letter?', options: ['القمر', 'الشمس', 'الكتاب', 'البيت'], correct: 1, explanation: 'الشمس (the sun) starts with ش, a sun letter, so it\'s pronounced "ash-shams"' },
      { question: 'How do you say "the book" in Arabic?', options: ['كتاب', 'الكتاب', 'كتابي', 'كتب'], correct: 1, explanation: 'الكتاب = "the book" (ال + كتاب)' },
      { question: 'What happens with sun letters?', options: ['The ال is removed', 'The ل sound assimilates', 'The word changes completely', 'Nothing changes'], correct: 1, explanation: 'With sun letters, the ل sound merges into the following letter, though spelling stays the same' },
      { question: 'Which is a moon letter?', options: ['ش', 'س', 'ت', 'ق'], correct: 3, explanation: 'ق is a moon letter, so القمر is pronounced "al-qamar"' },
    ],
  },

  {
    id: 'noun-adjective-agreement',
    title: 'Noun-Adjective Agreement',
    titleArabic: 'التوافق بين الاسم والصفة',
    category: 'nouns',
    difficulty: 2,
    order: 2,
    cefrLevel: 'A1',
    explanation: `In Arabic, adjectives must agree with the nouns they describe in three ways:
1. Gender (masculine/feminine)
2. Number (singular/dual/plural)
3. Definiteness (definite/indefinite)

Feminine adjectives usually end in ة (taa marbuuta). If the noun is definite (has ال), the adjective must also have ال.

The adjective comes AFTER the noun in Arabic (opposite of English).`,
    examples: [
      { arabic: 'ولد كبير', english: 'a big boy', transliteration: 'walad kabeer', breakdown: 'boy (masc.) + big (masc.)' },
      { arabic: 'بنت كبيرة', english: 'a big girl', transliteration: 'bint kabeerah', breakdown: 'girl (fem.) + big (fem.)' },
      { arabic: 'الولد الكبير', english: 'the big boy', transliteration: 'al-walad al-kabeer', breakdown: 'the boy (def.) + the big (def.)' },
      { arabic: 'البنت الكبيرة', english: 'the big girl', transliteration: 'al-bint al-kabeerah', breakdown: 'the girl (def. fem.) + the big (def. fem.)' },
    ],
    rules: [
      { rule: 'Adjective matches noun in gender', example: 'ولد كبير (masc.) vs بنت كبيرة (fem.)' },
      { rule: 'Adjective matches noun in definiteness', example: 'الولد الكبير (both definite)' },
      { rule: 'Adjective comes AFTER the noun', example: 'بيت جميل (beautiful house) not جميل بيت' },
      { rule: 'Feminine adjectives typically add ة', example: 'كبير → كبيرة' },
    ],
    exercises: [
      { type: 'translate', prompt: 'a big house', answer: 'بيت كبير', options: ['بيت كبير', 'كبير بيت', 'البيت الكبير', 'بيت كبيرة'] },
      { type: 'fill-blank', prompt: 'بنت _____ (a small girl)', answer: 'صغيرة', options: ['صغير', 'صغيرة', 'الصغيرة', 'الصغير'] },
      { type: 'translate', prompt: 'the beautiful girl', answer: 'البنت الجميلة', options: ['بنت جميلة', 'البنت الجميلة', 'الجميلة البنت', 'بنت الجميلة'] },
      { type: 'fill-blank', prompt: 'الولد _____ (the small boy)', answer: 'الصغير', options: ['صغير', 'الصغير', 'صغيرة', 'الصغيرة'] },
      { type: 'match', prompt: 'Match noun-adjective pairs', pairs: [['ولد كبير', 'a big boy'], ['بنت كبيرة', 'a big girl'], ['الولد الكبير', 'the big boy'], ['البنت الكبيرة', 'the big girl']] },
      { type: 'sentence-transformation', prompt: 'Change to feminine: الولد طويل', answer: 'البنت طويلة', hint: 'masculine → feminine (add ة)', options: ['البنت طويلة', 'البنت طويل', 'الولد طويلة', 'بنت طويلة'] },
      { type: 'sentence-transformation', prompt: 'Make definite: بيت كبير', answer: 'البيت الكبير', hint: 'add ال to both noun and adjective', options: ['البيت الكبير', 'البيت كبير', 'بيت الكبير', 'الكبير البيت'] },
      { type: 'error-identification', sentence: 'هذا بنت جميلة', error: 'هذا', correction: 'هذه', answer: 'هذا', options: ['هذا', 'بنت', 'جميلة', 'No error'] },
      { type: 'true-false', statement: 'In Arabic, the adjective comes before the noun', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'بنت كبيرة is correct (feminine noun + feminine adjective)', answer: 'true', options: ['true', 'false'] },
      { type: 'word-order', prompt: 'Which correctly describes "the tall girl"?', answer: 'البنت الطويلة', options: ['البنت الطويلة', 'الطويلة البنت', 'بنت الطويلة', 'البنت طويل'] },
      { type: 'build-sentence', prompt: 'Build: "a beautiful house"', answer: 'بيت جميل', options: ['بيت جميل', 'جميل بيت', 'البيت الجميل', 'بيت جميلة'] },
    ],
    quiz: [
      { question: 'How do you say "a beautiful house"?', options: ['بيت جميل', 'جميل بيت', 'البيت الجميل', 'بيت جميلة'], correct: 0, explanation: 'Adjective comes after noun, both indefinite, بيت is masculine' },
      { question: 'What must adjectives agree with in Arabic?', options: ['Only gender', 'Only definiteness', 'Gender, number, and definiteness', 'Nothing'], correct: 2, explanation: 'Adjectives must match the noun in gender, number, and definiteness' },
      { question: 'Where does the adjective go in Arabic?', options: ['Before the noun', 'After the noun', 'Either position', 'At the end of sentence'], correct: 1, explanation: 'In Arabic, adjectives come AFTER the noun they describe' },
      { question: 'Which is correct for "the small girl"?', options: ['بنت صغيرة', 'البنت الصغيرة', 'الصغيرة البنت', 'بنت الصغيرة'], correct: 1, explanation: 'Both noun and adjective must be definite (have ال) and feminine' },
    ],
  },

  {
    id: 'personal-pronouns',
    title: 'Personal Pronouns',
    titleArabic: 'الضمائر الشخصية',
    category: 'basics',
    difficulty: 1,
    order: 3,
    cefrLevel: 'A1',
    explanation: `Personal pronouns are the basic building blocks of Arabic sentences. Here are the most common ones:

Singular:
• أنا (ana) = I
• أنت (anta) = you (masculine)
• أنتِ (anti) = you (feminine)
• هو (huwa) = he
• هي (hiya) = she

Plural:
• نحن (nahnu) = we
• أنتم (antum) = you (plural, masculine)
• هم (hum) = they (masculine)
• هنّ (hunna) = they (feminine)

Arabic verbs change based on these pronouns, so learning them is crucial!`,
    examples: [
      { arabic: 'أنا طالب', english: 'I am a student', transliteration: 'ana taalib', breakdown: 'I + student (masc.)' },
      { arabic: 'أنتَ معلم', english: 'You are a teacher (masculine)', transliteration: 'anta muallim', breakdown: 'you (masc.) + teacher' },
      { arabic: 'هو كبير', english: 'He is big', transliteration: 'huwa kabeer', breakdown: 'he + big' },
      { arabic: 'نحن طلاب', english: 'We are students', transliteration: 'nahnu tullaab', breakdown: 'we + students' },
    ],
    rules: [
      { rule: 'Gender distinction in "you"', example: 'أنتَ (anta) for males, أنتِ (anti) for females' },
      { rule: 'Plural pronouns also have gender', example: 'هم (hum) for males, هنّ (hunna) for females' },
      { rule: 'Pronouns are often optional with verbs', example: 'The verb ending shows the pronoun' },
    ],
    exercises: [
      { type: 'translate', prompt: 'I', answer: 'أنا', options: ['أنا', 'أنت', 'هو', 'نحن'] },
      { type: 'translate', prompt: 'he', answer: 'هو', options: ['هي', 'هو', 'أنت', 'نحن'] },
      { type: 'translate', prompt: 'we', answer: 'نحن', options: ['أنا', 'أنت', 'نحن', 'هم'] },
      { type: 'fill-blank', prompt: '_____ طالب (I am a student)', answer: 'أنا', options: ['أنا', 'أنت', 'هو', 'هي'] },
      { type: 'match', prompt: 'Match the pronouns', pairs: [['أنا', 'I'], ['أنت', 'you (masc.)'], ['هو', 'he'], ['نحن', 'we']] },
      { type: 'true-false', statement: 'أنتِ (anti) is the masculine form of "you"', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'هم refers to a masculine plural "they"', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'أنا هو معلم كبير', error: 'هو', correction: '(remove هو)', answer: 'هو', options: ['أنا', 'هو', 'معلم', 'No error'] },
      { type: 'word-order', prompt: 'Which is correct for "She is a student"?', answer: 'هي طالبة', options: ['هي طالبة', 'طالبة هي', 'هو طالبة', 'أنا طالبة'] },
      { type: 'multiple-select', prompt: 'Select all plural pronouns:', correctAnswers: ['نحن', 'هم', 'أنتم'], options: ['أنا', 'نحن', 'هم', 'هو', 'أنتم'], answer: 'نحن,هم,أنتم' },
      { type: 'classify', prompt: 'Classify as singular or plural', categories: ['Singular', 'Plural'], items: [{ text: 'أنا', category: 'Singular' }, { text: 'نحن', category: 'Plural' }, { text: 'هو', category: 'Singular' }, { text: 'هم', category: 'Plural' }] },
      { type: 'build-sentence', prompt: 'Build: "We are students"', answer: 'نحن طلاب', options: ['نحن طلاب', 'طلاب نحن', 'هم طلاب', 'نحن طالب'] },
    ],
    quiz: [
      { question: 'What is "I" in Arabic?', options: ['أنت', 'أنا', 'هو', 'نحن'], correct: 1, explanation: 'أنا (ana) means "I"' },
      { question: 'How do you say "he" in Arabic?', options: ['هي', 'أنت', 'هو', 'هم'], correct: 2, explanation: 'هو (huwa) means "he"' },
      { question: 'What is the feminine form of "you"?', options: ['أنت', 'أنتِ', 'أنا', 'هي'], correct: 1, explanation: 'أنتِ (anti) is "you" for females' },
      { question: 'How do you say "we"?', options: ['أنا', 'أنتم', 'نحن', 'هم'], correct: 2, explanation: 'نحن (nahnu) means "we"' },
    ],
  },

  {
    id: 'possessive-suffixes',
    title: 'Possessive Suffixes',
    titleArabic: 'الضمائر المتصلة',
    category: 'nouns',
    difficulty: 2,
    order: 4,
    cefrLevel: 'A1',
    explanation: `In Arabic, possession is shown by adding suffixes to the end of nouns. These suffixes attach directly to the word (no separate word for "my", "your", etc.).

Common possessive suffixes:
• ـي (ee) = my
• ـك (ka) = your (masculine)
• ـكِ (ki) = your (feminine)
• ـه (hu) = his
• ـها (ha) = her
• ـنا (na) = our
• ـكم (kum) = your (plural)
• ـهم (hum) = their (masculine)

For example: كتاب (book) → كتابي (my book)`,
    examples: [
      { arabic: 'كتابي', english: 'my book', transliteration: 'kitaabee', breakdown: 'كتاب + ي' },
      { arabic: 'بيتك', english: 'your house', transliteration: 'baytuka', breakdown: 'بيت + ك' },
      { arabic: 'أمها', english: 'her mother', transliteration: 'ummuha', breakdown: 'أم + ها' },
      { arabic: 'معلمنا', english: 'our teacher', transliteration: 'muallimuna', breakdown: 'معلم + نا' },
    ],
    rules: [
      { rule: 'Suffixes attach directly to the noun', example: 'كتاب + ي = كتابي (no space)' },
      { rule: 'Gender matters for "your"', example: 'كتابك (your book, to a male) vs كتابكِ (to a female)' },
      { rule: 'Nouns with possessives are automatically definite', example: 'كتابي = "my book" (not "a my book")' },
    ],
    exercises: [
      { type: 'translate', prompt: 'my book', answer: 'كتابي', options: ['كتاب', 'كتابي', 'كتابك', 'كتابه'] },
      { type: 'fill-blank', prompt: 'بيت___ (your house, masc.)', answer: 'ك', options: ['ي', 'ك', 'ه', 'نا'] },
      { type: 'translate', prompt: 'his mother', answer: 'أمه', options: ['أم', 'أمي', 'أمه', 'أمها'] },
      { type: 'fill-blank', prompt: 'معلم___ (our teacher)', answer: 'نا', options: ['ي', 'ك', 'ه', 'نا'] },
      { type: 'match', prompt: 'Match possessive forms', pairs: [['كتابي', 'my book'], ['كتابك', 'your book'], ['كتابه', 'his book'], ['كتابنا', 'our book']] },
      { type: 'true-false', statement: 'كتابي means "a book" (indefinite)', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'ـنا suffix means "our"', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'ذهبت إلى بيت ي أمس', error: 'بيت ي', correction: 'بيتي', answer: 'بيت ي', options: ['ذهبت', 'إلى', 'بيت ي', 'No error'] },
      { type: 'classify', prompt: 'Classify by possessor', categories: ['1st person', '3rd person'], items: [{ text: 'كتابي', category: '1st person' }, { text: 'كتابه', category: '3rd person' }, { text: 'كتابنا', category: '1st person' }, { text: 'كتابها', category: '3rd person' }] },
      { type: 'word-order', prompt: 'Which is "his house"?', answer: 'بيته', options: ['بيته', 'بيتها', 'بيتي', 'بيتك'] },
      { type: 'multiple-select', prompt: 'Select all "my" forms:', correctAnswers: ['كتابي', 'بيتي'], options: ['كتابي', 'بيتك', 'بيتي', 'أمه'], answer: 'كتابي,بيتي' },
      { type: 'build-sentence', prompt: 'Build: "her house"', answer: 'بيتها', options: ['بيتها', 'بيته', 'بيتي', 'بيتك'] },
    ],
    quiz: [
      { question: 'How do you say "my house"?', options: ['بيت', 'بيتي', 'بيتك', 'بيته'], correct: 1, explanation: 'بيتي = "my house" (بيت + ي)' },
      { question: 'What suffix means "our"?', options: ['ـي', 'ـك', 'ـه', 'ـنا'], correct: 3, explanation: 'ـنا (na) means "our"' },
      { question: 'Are nouns with possessive suffixes definite or indefinite?', options: ['Definite', 'Indefinite', 'Depends on context', 'Neither'], correct: 0, explanation: 'Possessive suffixes make nouns definite (they refer to a specific item)' },
      { question: 'How do you say "her book"?', options: ['كتابي', 'كتابك', 'كتابه', 'كتابها'], correct: 3, explanation: 'كتابها = "her book" (كتاب + ها)' },
    ],
  },

  {
    id: 'basic-verb-conjugation',
    title: 'Present Tense Verbs',
    titleArabic: 'الفعل المضارع',
    category: 'verbs',
    difficulty: 3,
    order: 5,
    cefrLevel: 'A1',
    explanation: `Arabic verbs in present tense follow patterns based on the pronoun. The basic pattern has prefixes and sometimes suffixes.

The verb كَتَبَ (kataba) = "he wrote" becomes يكتب in present:

• أكتب (aktubu) = I write
• تكتب (taktubu) = you write (masc.)
• يكتب (yaktubu) = he writes
• تكتب (taktubu) = she writes
• نكتب (naktubu) = we write

Notice the prefixes: أ (I), ت (you/she), ي (he), ن (we)`,
    examples: [
      { arabic: 'أكتب', english: 'I write', transliteration: 'aktubu', breakdown: 'prefix أ + كتب' },
      { arabic: 'تكتب', english: 'you write', transliteration: 'taktubu', breakdown: 'prefix ت + كتب' },
      { arabic: 'يكتب', english: 'he writes', transliteration: 'yaktubu', breakdown: 'prefix ي + كتب' },
      { arabic: 'نكتب', english: 'we write', transliteration: 'naktubu', breakdown: 'prefix ن + كتب' },
    ],
    rules: [
      { rule: 'Prefixes change by pronoun', example: 'أ (I), ت (you/she), ي (he), ن (we)' },
      { rule: 'Some forms add suffixes too', example: 'يكتبون (they write) adds ون' },
      { rule: 'Root stays the same', example: 'كتب (k-t-b) appears in all forms' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___كتب (I write)', answer: 'أ', options: ['أ', 'ت', 'ي', 'ن'] },
      { type: 'translate', prompt: 'he writes', answer: 'يكتب', options: ['أكتب', 'تكتب', 'يكتب', 'نكتب'] },
      { type: 'fill-blank', prompt: '___كتب (we write)', answer: 'ن', options: ['أ', 'ت', 'ي', 'ن'] },
      { type: 'translate', prompt: 'you write (masc.)', answer: 'تكتب', options: ['أكتب', 'تكتب', 'يكتب', 'نكتب'] },
      { type: 'match', prompt: 'Match verb forms', pairs: [['أكتب', 'I write'], ['تكتب', 'you write'], ['يكتب', 'he writes'], ['نكتب', 'we write']] },
      { type: 'conjugation-drill', prompt: 'Conjugate كَتَبَ for أنا (present)', verb: 'كَتَبَ', root: 'ك-ت-ب', pronoun: 'أنا', paradigm: 'present', answer: 'أكتب', options: ['أكتب', 'يكتب', 'تكتب', 'نكتب'] },
      { type: 'conjugation-drill', prompt: 'Conjugate كَتَبَ for هو (present)', verb: 'كَتَبَ', root: 'ك-ت-ب', pronoun: 'هو', paradigm: 'present', answer: 'يكتب', options: ['أكتب', 'يكتب', 'تكتب', 'نكتب'] },
      { type: 'conjugation-drill', prompt: 'Conjugate ذَهَبَ for نحن (present)', verb: 'ذَهَبَ', root: 'ذ-ه-ب', pronoun: 'نحن', paradigm: 'present', answer: 'نذهب', options: ['أذهب', 'يذهب', 'تذهب', 'نذهب'] },
      { type: 'true-false', statement: 'The prefix ي is used for "I" in present tense', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'أنا يكتب الدرس كل يوم', error: 'يكتب', correction: 'أكتب', answer: 'يكتب', options: ['أنا', 'يكتب', 'الدرس', 'No error'] },
      { type: 'word-order', prompt: 'Which is correct for "We write the lesson"?', answer: 'نكتب الدرس', options: ['نكتب الدرس', 'الدرس نكتب', 'يكتب الدرس', 'كتب نحن'] },
      { type: 'build-sentence', prompt: 'Build: "He writes the book"', answer: 'يكتب الكتاب', options: ['يكتب الكتاب', 'أكتب الكتاب', 'الكتاب يكتب', 'يكتب كتاب'] },
    ],
    quiz: [
      { question: 'What prefix is used for "I" in present tense?', options: ['ت', 'أ', 'ي', 'ن'], correct: 1, explanation: 'أ is the prefix for "I" (ana)' },
      { question: 'How do you say "he writes"?', options: ['أكتب', 'تكتب', 'يكتب', 'نكتب'], correct: 2, explanation: 'يكتب (yaktubu) = "he writes"' },
      { question: 'What prefix is used for "we"?', options: ['أ', 'ت', 'ي', 'ن'], correct: 3, explanation: 'ن is the prefix for "we" (nahnu)' },
      { question: 'Which part stays the same in all conjugations?', options: ['The prefix', 'The suffix', 'The root', 'Nothing'], correct: 2, explanation: 'The root letters (كتب) remain constant across conjugations' },
    ],
  },

  {
    id: 'question-words',
    title: 'Question Words',
    titleArabic: 'أدوات الاستفهام',
    category: 'questions',
    difficulty: 2,
    order: 6,
    cefrLevel: 'A1',
    explanation: `Question words help you ask for information. Here are the most essential ones:

• ما (maa) = what?
• من (man) = who?
• أين (ayna) = where?
• كيف (kayfa) = how?
• لماذا (limaadha) = why?
• متى (mata) = when?
• كم (kam) = how many/much?

Questions can be formed by putting these at the start of a sentence.`,
    examples: [
      { arabic: 'ما اسمك؟', english: 'What is your name?', transliteration: 'maa ismuka?', breakdown: 'what + your-name?' },
      { arabic: 'من أنت؟', english: 'Who are you?', transliteration: 'man anta?', breakdown: 'who + you?' },
      { arabic: 'أين البيت؟', english: 'Where is the house?', transliteration: 'ayna al-bayt?', breakdown: 'where + the-house?' },
      { arabic: 'كيف حالك؟', english: 'How are you?', transliteration: 'kayfa haaluka?', breakdown: 'how + your-condition?' },
    ],
    rules: [
      { rule: 'Question words usually come first', example: 'ما اسمك؟ (what your-name?)' },
      { rule: 'من is for people, ما for things', example: 'من هو؟ (who is he?) vs ما هذا؟ (what is this?)' },
      { rule: 'Use كم for counting', example: 'كم كتاباً؟ (how many books?)' },
    ],
    exercises: [
      { type: 'translate', prompt: 'what?', answer: 'ما', options: ['ما', 'من', 'أين', 'كيف'] },
      { type: 'translate', prompt: 'where?', answer: 'أين', options: ['ما', 'من', 'أين', 'متى'] },
      { type: 'fill-blank', prompt: '_____ اسمك؟ (What is your name?)', answer: 'ما', options: ['ما', 'من', 'أين', 'كيف'] },
      { type: 'translate', prompt: 'who?', answer: 'من', options: ['ما', 'من', 'أين', 'كيف'] },
      { type: 'match', prompt: 'Match question words', pairs: [['ما', 'what?'], ['من', 'who?'], ['أين', 'where?'], ['كيف', 'how?']] },
      { type: 'true-false', statement: 'من is used to ask about things, not people', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'متى means "when?"', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'من هذا الكتاب؟', error: 'من', correction: 'ما', answer: 'من', options: ['من', 'هذا', 'الكتاب', 'No error'] },
      { type: 'word-order', prompt: 'Which correctly asks "Where is the school?"', answer: 'أين المدرسة؟', options: ['أين المدرسة؟', 'المدرسة أين؟', 'ما المدرسة؟', 'أين مدرسة؟'] },
      { type: 'classify', prompt: 'Classify question words by usage', categories: ['People', 'Things/Places'], items: [{ text: 'من', category: 'People' }, { text: 'ما', category: 'Things/Places' }, { text: 'أين', category: 'Things/Places' }] },
      { type: 'multiple-select', prompt: 'Select all time-related question words:', correctAnswers: ['متى', 'كم'], options: ['متى', 'أين', 'كم', 'من'], answer: 'متى,كم' },
      { type: 'build-sentence', prompt: 'Build: "How are you?"', answer: 'كيف حالك؟', options: ['كيف حالك؟', 'حالك كيف؟', 'ما حالك؟', 'كيف أنت؟'] },
    ],
    quiz: [
      { question: 'How do you say "what?" in Arabic?', options: ['من', 'ما', 'أين', 'كيف'], correct: 1, explanation: 'ما (maa) means "what?"' },
      { question: 'Which question word means "where?"', options: ['ما', 'من', 'أين', 'متى'], correct: 2, explanation: 'أين (ayna) means "where?"' },
      { question: 'How do you ask "Who are you?"', options: ['ما أنت؟', 'من أنت؟', 'أين أنت؟', 'كيف أنت؟'], correct: 1, explanation: 'من أنت؟ (man anta?) = "Who are you?"' },
      { question: 'What does كيف mean?', options: ['what', 'who', 'where', 'how'], correct: 3, explanation: 'كيف (kayfa) means "how"' },
    ],
  },

  {
    id: 'prepositions',
    title: 'Common Prepositions',
    titleArabic: 'حروف الجر',
    category: 'prepositions',
    difficulty: 2,
    order: 7,
    cefrLevel: 'A1',
    explanation: `Prepositions are small words that show relationships between things. Here are the most common ones:

• في (fee) = in, at
• على (ala) = on, upon
• من (min) = from
• إلى (ila) = to, toward
• مع (maa) = with
• عن (an) = about, from
• ب (bi) = with, by (attached to next word)
• ل (li) = to, for (attached to next word)

The prepositions ب and ل attach directly to the following word.`,
    examples: [
      { arabic: 'في البيت', english: 'in the house', transliteration: 'fee al-bayt', breakdown: 'in + the house' },
      { arabic: 'على الطاولة', english: 'on the table', transliteration: 'ala at-taawila', breakdown: 'on + the table' },
      { arabic: 'من المدرسة', english: 'from the school', transliteration: 'min al-madrasa', breakdown: 'from + the school' },
      { arabic: 'إلى المسجد', english: 'to the mosque', transliteration: 'ila al-masjid', breakdown: 'to + the mosque' },
    ],
    rules: [
      { rule: 'Prepositions come before nouns', example: 'في البيت (in the house)' },
      { rule: 'ب and ل attach to the next word', example: 'بالقلم (with the pen) - ب + القلم' },
      { rule: 'Prepositions can change ال', example: 'لـ + ال = لل (للبيت = to the house)' },
    ],
    exercises: [
      { type: 'translate', prompt: 'in', answer: 'في', options: ['في', 'على', 'من', 'إلى'] },
      { type: 'fill-blank', prompt: '_____ البيت (in the house)', answer: 'في', options: ['في', 'على', 'من', 'إلى'] },
      { type: 'translate', prompt: 'on', answer: 'على', options: ['في', 'على', 'من', 'إلى'] },
      { type: 'fill-blank', prompt: '_____ المدرسة (from the school)', answer: 'من', options: ['في', 'على', 'من', 'إلى'] },
      { type: 'match', prompt: 'Match prepositions', pairs: [['في', 'in'], ['على', 'on'], ['من', 'from'], ['إلى', 'to']] },
      { type: 'true-false', statement: 'في means "on" in Arabic', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'ب and ل attach directly to the following word', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'الكتاب على من الطاولة', error: 'من', correction: '(remove من)', answer: 'من', options: ['الكتاب', 'على', 'من', 'No error'] },
      { type: 'word-order', prompt: 'Which correctly says "The book is on the table"?', answer: 'الكتاب على الطاولة', options: ['الكتاب على الطاولة', 'على الكتاب الطاولة', 'الطاولة على الكتاب', 'الكتاب الطاولة على'] },
      { type: 'cloze', text: 'الكتاب ___ الطاولة والقلم ___ الكتاب', blanks: [{ answer: 'على', options: ['على', 'في', 'من'] }, { answer: 'في', options: ['في', 'على', 'إلى'] }] },
      { type: 'classify', prompt: 'Classify prepositions by meaning', categories: ['Location', 'Direction'], items: [{ text: 'في', category: 'Location' }, { text: 'على', category: 'Location' }, { text: 'إلى', category: 'Direction' }, { text: 'من', category: 'Direction' }] },
      { type: 'build-sentence', prompt: 'Build: "from the school"', answer: 'من المدرسة', options: ['من المدرسة', 'إلى المدرسة', 'في المدرسة', 'المدرسة من'] },
    ],
    quiz: [
      { question: 'How do you say "in the house"?', options: ['في البيت', 'على البيت', 'من البيت', 'إلى البيت'], correct: 0, explanation: 'في البيت (fee al-bayt) = "in the house"' },
      { question: 'What does على mean?', options: ['in', 'on', 'from', 'to'], correct: 1, explanation: 'على (ala) means "on" or "upon"' },
      { question: 'Which preposition means "from"?', options: ['في', 'على', 'من', 'إلى'], correct: 2, explanation: 'من (min) means "from"' },
      { question: 'How do you say "to the mosque"?', options: ['في المسجد', 'على المسجد', 'من المسجد', 'إلى المسجد'], correct: 3, explanation: 'إلى المسجد (ila al-masjid) = "to the mosque"' },
    ],
  },

  {
    id: 'colors-and-shapes',
    title: 'Colors and Shapes',
    titleArabic: 'الألوان والأشكال',
    category: 'vocabulary',
    difficulty: 1,
    order: 8,
    cefrLevel: 'A1',
    explanation: `Colors in Arabic follow the pattern أَفْعَل (masculine) and فَعْلاء (feminine).

Common colors:
• أحمر / حمراء (ahmar/hamraa) = red
• أزرق / زرقاء (azraq/zarqaa) = blue
• أخضر / خضراء (akhdar/khadraa) = green
• أصفر / صفراء (asfar/safraa) = yellow
• أبيض / بيضاء (abyad/baydaa) = white
• أسود / سوداء (aswad/sawdaa) = black

Colors agree with the noun in gender!`,
    examples: [
      { arabic: 'الكتاب أحمر', english: 'the book is red', transliteration: 'al-kitaab ahmar', breakdown: 'the book + red (masc.)' },
      { arabic: 'السيارة حمراء', english: 'the car is red', transliteration: 'as-sayyaara hamraa', breakdown: 'the car (fem.) + red (fem.)' },
      { arabic: 'البيت أبيض', english: 'the house is white', transliteration: 'al-bayt abyad', breakdown: 'the house + white' },
      { arabic: 'السماء زرقاء', english: 'the sky is blue', transliteration: 'as-samaa zarqaa', breakdown: 'the sky (fem.) + blue (fem.)' },
    ],
    rules: [
      { rule: 'Colors have masculine and feminine forms', example: 'أحمر (masc.) / حمراء (fem.)' },
      { rule: 'Color agrees with the noun it describes', example: 'قلم أحمر (red pen) / سيارة حمراء (red car)' },
      { rule: 'Colors come after the noun', example: 'الكتاب الأخضر (the green book)' },
    ],
    exercises: [
      { type: 'translate', prompt: 'red (masculine)', answer: 'أحمر', options: ['أحمر', 'حمراء', 'أزرق', 'أصفر'] },
      { type: 'translate', prompt: 'blue (feminine)', answer: 'زرقاء', options: ['أزرق', 'زرقاء', 'زرق', 'أزرقة'] },
      { type: 'fill-blank', prompt: 'السيارة ___ (the car is red, fem.)', answer: 'حمراء', options: ['أحمر', 'حمراء', 'أحمرة', 'حمر'] },
      { type: 'match', prompt: 'Match colors', pairs: [['أحمر', 'red (m)'], ['أزرق', 'blue (m)'], ['أبيض', 'white (m)'], ['أسود', 'black (m)']] },
      { type: 'true-false', statement: 'أبيض is the feminine form of "white"', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'Colors come after the noun in Arabic', answer: 'true', options: ['true', 'false'] },
      { type: 'sentence-transformation', prompt: 'Change to feminine color: القميص أخضر', answer: 'المنديل خضراء', hint: 'change adjective to feminine form', options: ['المنديل خضراء', 'القميص خضراء', 'القميص أخضر', 'المنديل أخضر'] },
      { type: 'error-identification', sentence: 'السيارة أحمر جميلة', error: 'أحمر', correction: 'حمراء', answer: 'أحمر', options: ['السيارة', 'أحمر', 'جميلة', 'No error'] },
      { type: 'classify', prompt: 'Classify as masculine or feminine color form', categories: ['Masculine', 'Feminine'], items: [{ text: 'أحمر', category: 'Masculine' }, { text: 'زرقاء', category: 'Feminine' }, { text: 'أبيض', category: 'Masculine' }, { text: 'سوداء', category: 'Feminine' }] },
      { type: 'multiple-select', prompt: 'Select all masculine color forms:', correctAnswers: ['أحمر', 'أزرق', 'أصفر'], options: ['أحمر', 'حمراء', 'أزرق', 'زرقاء', 'أصفر'], answer: 'أحمر,أزرق,أصفر' },
      { type: 'word-order', prompt: 'Which correctly says "the green book"?', answer: 'الكتاب الأخضر', options: ['الكتاب الأخضر', 'الأخضر الكتاب', 'كتاب أخضر', 'الكتاب خضراء'] },
      { type: 'build-sentence', prompt: 'Build: "the white house"', answer: 'البيت الأبيض', options: ['البيت الأبيض', 'الأبيض البيت', 'بيت أبيض', 'البيت بيضاء'] },
    ],
    quiz: [
      { question: 'How do you say "red" for a masculine noun?', options: ['حمراء', 'أحمر', 'أحمرة', 'حمر'], correct: 1, explanation: 'أحمر (ahmar) is the masculine form of "red"' },
      { question: 'Which is the feminine form of أزرق (blue)?', options: ['زرق', 'أزرقة', 'زرقاء', 'أزرقاء'], correct: 2, explanation: 'زرقاء (zarqaa) is the feminine form of "blue"' },
      { question: 'How do you say "the sky is blue" (sky = سماء, feminine)?', options: ['السماء أزرق', 'السماء زرقاء', 'السماء أزرقة', 'زرقاء السماء'], correct: 1, explanation: 'السماء زرقاء — sky is feminine, so use the feminine color form زرقاء' },
      { question: 'What color is أسود?', options: ['white', 'red', 'green', 'black'], correct: 3, explanation: 'أسود (aswad) means "black"' },
    ],
  },

  {
    id: 'numbers-1-10',
    title: 'Numbers 1-10',
    titleArabic: 'الأعداد ١-١٠',
    category: 'basics',
    difficulty: 1,
    order: 13,
    cefrLevel: 'A1',
    explanation: `Arabic numbers 1-10 are among the first words learners master. Arabic itself uses Eastern Arabic numerals (١٢٣). Numbers 1-2 agree with the noun in gender, while 3-10 take the opposite gender — a unique Arabic rule.

Numbers 1-10:
١ واحد (waahid) — ٢ اثنان (ithnaan) — ٣ ثلاثة (thalaatha)
٤ أربعة (arba'a) — ٥ خمسة (khamsa) — ٦ ستة (sitta)
٧ سبعة (sab'a) — ٨ ثمانية (thamaaniya) — ٩ تسعة (tis'a) — ١٠ عشرة ('ashara)`,
    examples: [
      { arabic: 'واحد', english: 'one (m)', transliteration: 'waahid' },
      { arabic: 'ثلاثة كتب', english: 'three books', transliteration: 'thalaathat kutub', breakdown: 'three (fem. form) + books (masc. noun)' },
      { arabic: 'خمسة طلاب', english: 'five students', transliteration: 'khamsat tullaab' },
      { arabic: 'عشرة بنات', english: 'ten girls', transliteration: 'ashrat banaat' },
    ],
    rules: [
      { rule: 'Numbers 1-2 agree in gender with the noun', example: 'ولد واحد (one boy) / بنت واحدة (one girl)' },
      { rule: 'Numbers 3-10 take OPPOSITE gender to the noun', example: 'ثلاثة أولاد (three boys — feminine form with masculine noun)' },
      { rule: 'The counted noun after 3-10 is plural genitive', example: 'خمسة كتب (five books)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ كتب (three books)', answer: 'ثلاثة', options: ['ثلاثة', 'ثلاث', 'واحد', 'اثنان'] },
      { type: 'translate', prompt: 'seven', answer: 'سبعة', options: ['سبعة', 'ستة', 'ثمانية', 'تسعة'] },
      { type: 'match', prompt: 'Match numbers', pairs: [['واحد', '1'], ['خمسة', '5'], ['عشرة', '10'], ['ثلاثة', '3']] },
      { type: 'translate', prompt: 'ten', answer: 'عشرة', options: ['تسعة', 'عشرة', 'ثمانية', 'سبعة'] },
      { type: 'fill-blank', prompt: '___ بنات (five girls)', answer: 'خمس', options: ['خمسة', 'خمس', 'خمسون', 'أربعة'] },
      { type: 'true-false', statement: 'Numbers 3-10 take the same gender as the noun they count', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'واحد is the masculine form of "one"', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'عندي ثلاث كتب', error: 'ثلاث', correction: 'ثلاثة', answer: 'ثلاث', options: ['عندي', 'ثلاث', 'كتب', 'No error'] },
      { type: 'word-order', prompt: 'Which is "two boys"?', answer: 'ولدان', options: ['ولدان', 'ولدين', 'ولد اثنان', 'اثنان ولد'] },
      { type: 'conjugation-drill', prompt: 'What is the Arabic for "four" (masc.)?', verb: 'عدد', root: 'ع-د-د', pronoun: 'م', paradigm: 'present', answer: 'أربعة', options: ['أربعة', 'أربع', 'أربعون', 'ربعة'] },
      { type: 'classify', prompt: 'Classify numbers as small or large (1-5 vs 6-10)', categories: ['1-5', '6-10'], items: [{ text: 'واحد', category: '1-5' }, { text: 'سبعة', category: '6-10' }, { text: 'ثلاثة', category: '1-5' }, { text: 'تسعة', category: '6-10' }] },
      { type: 'build-sentence', prompt: 'Build: "I have five books"', answer: 'عندي خمسة كتب', options: ['عندي خمسة كتب', 'عندي خمس كتب', 'خمسة كتب عندي', 'كتب خمسة عندي'] },
    ],
    quiz: [
      { question: 'What is the Arabic for "seven"?', options: ['ستة', 'سبعة', 'ثمانية', 'تسعة'], correct: 1, explanation: 'سبعة (sab\'a) means "seven"' },
      { question: 'Which rule applies to numbers 3-10?', options: ['Same gender as noun', 'Opposite gender to noun', 'No gender', 'Always masculine'], correct: 1, explanation: 'Numbers 3-10 take the OPPOSITE gender to the noun they count' },
      { question: 'How do you say "one girl"?', options: ['بنت واحد', 'بنت واحدة', 'واحدة بنت', 'واحد بنت'], correct: 1, explanation: 'بنت واحدة — number 1 agrees with feminine noun بنت' },
      { question: 'What does عشرة mean?', options: ['eight', 'nine', 'ten', 'hundred'], correct: 2, explanation: 'عشرة (\'ashara) means "ten"' },
    ],
  },

  {
    id: 'basic-adjectives',
    title: 'Basic Adjectives',
    titleArabic: 'الصفات الأساسية',
    category: 'nouns',
    difficulty: 1,
    order: 14,
    cefrLevel: 'A1',
    explanation: `In Arabic, adjectives follow the noun they describe and must agree in gender, number, and definiteness. If the noun is feminine, the adjective takes the taa marbuuta (ة) ending. If the noun is definite (has ال), the adjective must also be definite.

Common adjectives:
• كبير/كبيرة = big
• صغير/صغيرة = small
• جميل/جميلة = beautiful
• طويل/طويلة = tall/long
• قصير/قصيرة = short
• جديد/جديدة = new
• قديم/قديمة = old`,
    examples: [
      { arabic: 'كتاب كبير', english: 'a big book', transliteration: 'kitaab kabiir' },
      { arabic: 'الكتاب الكبير', english: 'the big book', transliteration: 'al-kitaab al-kabiir' },
      { arabic: 'مدرسة كبيرة', english: 'a big school (f)', transliteration: 'madrasa kabiira' },
      { arabic: 'بيت جميل', english: 'a beautiful house', transliteration: 'bayt jamiil' },
    ],
    rules: [
      { rule: 'Adjective follows the noun', example: 'ولد طويل (a tall boy) — not طويل ولد' },
      { rule: 'Adjective agrees in gender', example: 'بنت طويلة (a tall girl) — feminine ة added' },
      { rule: 'Adjective agrees in definiteness', example: 'الولد الطويل (the tall boy) — both have ال' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'بنت ___ (a beautiful girl)', answer: 'جميلة', options: ['جميلة', 'جميل', 'كبير', 'صغيرة'] },
      { type: 'translate', prompt: 'the small house', answer: 'البيت الصغير', options: ['البيت الصغير', 'بيت صغير', 'الصغير البيت', 'بيت الصغير'] },
      { type: 'fill-blank', prompt: 'رجل ___ (a tall man)', answer: 'طويل', options: ['طويل', 'طويلة', 'الطويل', 'قصير'] },
      { type: 'translate', prompt: 'a new book', answer: 'كتاب جديد', options: ['كتاب جديد', 'جديد كتاب', 'الكتاب الجديد', 'كتاب جديدة'] },
      { type: 'match', prompt: 'Match adjective forms', pairs: [['كبير', 'big (m)'], ['كبيرة', 'big (f)'], ['صغير', 'small (m)'], ['صغيرة', 'small (f)']] },
      { type: 'sentence-transformation', prompt: 'Change to feminine: ولد طويل', answer: 'بنت طويلة', hint: 'add ة to make adjective feminine', options: ['بنت طويلة', 'بنت طويل', 'ولد طويلة', 'بنت الطويلة'] },
      { type: 'sentence-transformation', prompt: 'Make definite: بيت قديم', answer: 'البيت القديم', hint: 'add ال to both noun and adjective', options: ['البيت القديم', 'البيت قديم', 'بيت القديم', 'القديم البيت'] },
      { type: 'true-false', statement: 'جميل and جميلة mean the same thing', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'البنت طويل جداً', error: 'طويل', correction: 'طويلة', answer: 'طويل', options: ['البنت', 'طويل', 'جداً', 'No error'] },
      { type: 'classify', prompt: 'Classify as masculine or feminine adjective', categories: ['Masculine', 'Feminine'], items: [{ text: 'كبير', category: 'Masculine' }, { text: 'كبيرة', category: 'Feminine' }, { text: 'صغير', category: 'Masculine' }, { text: 'جميلة', category: 'Feminine' }] },
      { type: 'word-order', prompt: 'Which is correct for "the old school"?', answer: 'المدرسة القديمة', options: ['المدرسة القديمة', 'القديمة المدرسة', 'مدرسة قديمة', 'المدرسة قديم'] },
      { type: 'build-sentence', prompt: 'Build: "a tall boy"', answer: 'ولد طويل', options: ['ولد طويل', 'طويل ولد', 'الولد الطويل', 'ولد طويلة'] },
    ],
    quiz: [
      { question: 'What is the feminine form of كبير?', options: ['كبيرة', 'كبيرات', 'الكبير', 'كبيرون'], correct: 0, explanation: 'كبيرة (kabiirah) is the feminine form — add ة to the masculine' },
      { question: 'How do you say "a tall girl"?', options: ['بنت طويل', 'بنت طويلة', 'البنت الطويلة', 'طويلة بنت'], correct: 1, explanation: 'بنت طويلة — adjective comes after noun and agrees in gender' },
      { question: 'What does جديد mean?', options: ['old', 'big', 'new', 'small'], correct: 2, explanation: 'جديد (jadiid) means "new"' },
      { question: 'Which is "the beautiful school"?', options: ['مدرسة جميلة', 'المدرسة الجميلة', 'الجميلة المدرسة', 'مدرسة الجميلة'], correct: 1, explanation: 'المدرسة الجميلة — both definite, both feminine' },
    ],
  },

  {
    id: 'demonstratives',
    title: 'This & That (Demonstratives)',
    titleArabic: 'أسماء الإشارة',
    category: 'basics',
    difficulty: 1,
    order: 15,
    cefrLevel: 'A1',
    explanation: `Arabic demonstrative pronouns change based on gender and number. "This" for masculine is هذا (haadha) and for feminine is هذه (haadhihi). "That" for masculine is ذلك (dhaalika) and for feminine is تلك (tilka).

• هذا = this (masculine) — used before masculine nouns
• هذه = this (feminine) — used before feminine nouns
• ذلك = that (masculine)
• تلك = that (feminine)`,
    examples: [
      { arabic: 'هذا كتاب', english: 'this is a book', transliteration: 'haadha kitaab' },
      { arabic: 'هذه مدرسة', english: 'this is a school', transliteration: 'haadhihi madrasa' },
      { arabic: 'ذلك الرجل', english: 'that man', transliteration: 'dhaalika ar-rajul' },
      { arabic: 'تلك المرأة', english: 'that woman', transliteration: 'tilka al-maraa' },
    ],
    rules: [
      { rule: 'هذا/هذه for near (this)', example: 'هذا ولد (this is a boy) / هذه بنت (this is a girl)' },
      { rule: 'ذلك/تلك for far (that)', example: 'ذلك بيت (that house) / تلك سيارة (that car)' },
      { rule: 'With definite nouns, demonstrative + ال-noun', example: 'هذا الكتاب (this book)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ بنت (this is a girl)', answer: 'هذه', options: ['هذه', 'هذا', 'ذلك', 'تلك'] },
      { type: 'translate', prompt: 'this book (masc.)', answer: 'هذا الكتاب', options: ['هذا الكتاب', 'هذه الكتاب', 'ذلك الكتاب', 'هذا كتاب'] },
      { type: 'fill-blank', prompt: '___ رجل طويل (that is a tall man)', answer: 'ذلك', options: ['هذا', 'هذه', 'ذلك', 'تلك'] },
      { type: 'match', prompt: 'Match demonstratives', pairs: [['هذا', 'this (m)'], ['هذه', 'this (f)'], ['ذلك', 'that (m)'], ['تلك', 'that (f)']] },
      { type: 'translate', prompt: 'that school (f)', answer: 'تلك المدرسة', options: ['تلك المدرسة', 'ذلك المدرسة', 'هذه المدرسة', 'تلك مدرسة'] },
      { type: 'true-false', statement: 'هذا is used before feminine nouns', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'تلك means "that" for feminine nouns', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'هذا مدرسة جميلة', error: 'هذا', correction: 'هذه', answer: 'هذا', options: ['هذا', 'مدرسة', 'جميلة', 'No error'] },
      { type: 'sentence-transformation', prompt: 'Change to "that": هذا الكتاب', answer: 'ذلك الكتاب', hint: 'هذا (this, m) → ذلك (that, m)', options: ['ذلك الكتاب', 'تلك الكتاب', 'ذلك كتاب', 'هذا الكتاب'] },
      { type: 'word-order', prompt: 'Which correctly says "this is a car"?', answer: 'هذه سيارة', options: ['هذه سيارة', 'هذا سيارة', 'سيارة هذه', 'هذه السيارة'] },
      { type: 'classify', prompt: 'Classify demonstratives by distance', categories: ['Near (this)', 'Far (that)'], items: [{ text: 'هذا', category: 'Near (this)' }, { text: 'ذلك', category: 'Far (that)' }, { text: 'هذه', category: 'Near (this)' }, { text: 'تلك', category: 'Far (that)' }] },
      { type: 'build-sentence', prompt: 'Build: "that is a beautiful girl"', answer: 'تلك بنت جميلة', options: ['تلك بنت جميلة', 'هذه بنت جميلة', 'ذلك بنت جميلة', 'تلك جميلة بنت'] },
    ],
    quiz: [
      { question: 'Which demonstrative goes with masculine nouns for "this"?', options: ['هذه', 'هذا', 'تلك', 'ذلك'], correct: 1, explanation: 'هذا (haadha) is "this" for masculine nouns' },
      { question: 'How do you say "that school" (school = مدرسة, feminine)?', options: ['ذلك المدرسة', 'تلك المدرسة', 'هذه المدرسة', 'هذا المدرسة'], correct: 1, explanation: 'تلك المدرسة — تلك is "that" for feminine nouns' },
      { question: 'What does ذلك mean?', options: ['this (f)', 'this (m)', 'that (f)', 'that (m)'], correct: 3, explanation: 'ذلك (dhaalika) means "that" for masculine nouns' },
      { question: 'Which is correct for "this is a boy"?', options: ['هذه ولد', 'هذا ولد', 'ذلك ولد', 'تلك ولد'], correct: 1, explanation: 'هذا ولد — هذا for masculine noun ولد' },
    ],
  },

  {
    id: 'possessive-pronouns',
    title: 'Possessive Pronouns',
    titleArabic: 'ضمائر الملكية',
    category: 'basics',
    difficulty: 1,
    order: 16,
    cefrLevel: 'A1',
    explanation: `In Arabic, possessive pronouns are suffixes attached directly to the noun. "My book" is كتابي (kitaabi) — the ي suffix means "my". This is one of Arabic's elegant features: ownership is shown by a simple ending change.

Key suffixes:
• ـي = my (I)
• ـك = your (you, masc.)
• ـكِ = your (you, fem.)
• ـه = his (he)
• ـها = her (she)
• ـنا = our (we)
• ـكم = your (you all)
• ـهم = their (they, masc.)`,
    examples: [
      { arabic: 'كتابي', english: 'my book', transliteration: 'kitaabi' },
      { arabic: 'كتابك', english: 'your book (m)', transliteration: 'kitaabuka' },
      { arabic: 'كتابه', english: 'his book', transliteration: 'kitaabuhu' },
      { arabic: 'كتابها', english: 'her book', transliteration: 'kitaabuhaa' },
      { arabic: 'كتابنا', english: 'our book', transliteration: 'kitaabunaa' },
    ],
    rules: [
      { rule: 'ي = my, ك = your(m), كِ = your(f)', example: 'بيتي (my house), بيتك (your house)' },
      { rule: 'ه = his, ها = her, نا = our', example: 'قلمه (his pen), قلمها (her pen)' },
      { rule: 'هم = their(m), هن = their(f)', example: 'بيتهم (their house)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'كتاب___ (my book)', answer: 'ي', options: ['ي', 'ك', 'ه', 'نا'] },
      { type: 'translate', prompt: 'her pen', answer: 'قلمها', options: ['قلمي', 'قلمك', 'قلمه', 'قلمها'] },
      { type: 'fill-blank', prompt: 'بيت___ (their house, m)', answer: 'هم', options: ['ه', 'ها', 'نا', 'هم'] },
      { type: 'match', prompt: 'Match possessive pronouns', pairs: [['كتابي', 'my book'], ['كتابك', 'your book (m)'], ['كتابه', 'his book'], ['كتابها', 'her book']] },
      { type: 'translate', prompt: 'our school', answer: 'مدرستنا', options: ['مدرستنا', 'مدرستي', 'مدرستك', 'مدرستهم'] },
      { type: 'true-false', statement: 'ـها means "his" in Arabic', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'Possessive suffixes in Arabic attach directly to the noun', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'هذا هو بيته ها', error: 'ها', correction: '(remove ها)', answer: 'ها', options: ['هذا', 'بيته', 'ها', 'No error'] },
      { type: 'sentence-transformation', prompt: 'Change to "his": كتابي', answer: 'كتابه', hint: 'change ي (my) to ه (his)', options: ['كتابه', 'كتابها', 'كتابك', 'كتابنا'] },
      { type: 'classify', prompt: 'Classify by possessor', categories: ['Singular', 'Plural'], items: [{ text: 'كتابي', category: 'Singular' }, { text: 'كتابنا', category: 'Plural' }, { text: 'كتابه', category: 'Singular' }, { text: 'كتابهم', category: 'Plural' }] },
      { type: 'word-order', prompt: 'Which is "his book"?', answer: 'كتابه', options: ['كتابه', 'كتابها', 'كتابي', 'كتابنا'] },
      { type: 'build-sentence', prompt: 'Build: "our teacher"', answer: 'معلمنا', options: ['معلمنا', 'معلمي', 'معلمه', 'معلمهم'] },
    ],
    quiz: [
      { question: 'Which suffix means "my"?', options: ['ـك', 'ـي', 'ـه', 'ـنا'], correct: 1, explanation: 'ـي (ee) is the suffix for "my"' },
      { question: 'How do you say "his house"?', options: ['بيتي', 'بيتك', 'بيته', 'بيتها'], correct: 2, explanation: 'بيته — ه suffix means "his"' },
      { question: 'What does ـها mean when attached to a noun?', options: ['my', 'his', 'her', 'our'], correct: 2, explanation: 'ـها (haa) means "her" when attached to a noun' },
      { question: 'How do you say "our school"?', options: ['مدرستي', 'مدرستك', 'مدرسته', 'مدرستنا'], correct: 3, explanation: 'مدرستنا = "our school" (مدرسة + نا)' },
    ],
  },

  {
    id: 'basic-negation',
    title: 'Basic Negation (لا / ليس)',
    titleArabic: 'النفي الأساسي',
    category: 'basics',
    difficulty: 1,
    order: 17,
    cefrLevel: 'A1',
    explanation: `Arabic has two main ways to negate: لا (laa) negates verbs and general statements, while ليس (laysa) negates nominal sentences (sentences without a verb). ليس conjugates to agree with the subject.

لا with verbs:
• لا أفهم = I don't understand
• لا يذهب = he doesn't go

ليس with nouns/adjectives:
• ليس طويلاً = he is not tall
• لست مريضاً = I am not sick`,
    examples: [
      { arabic: 'لا أفهم', english: 'I don\'t understand', transliteration: 'laa afham' },
      { arabic: 'ليس هذا كتابي', english: 'this is not my book', transliteration: 'laysa haadha kitaabi' },
      { arabic: 'لا أريد', english: 'I don\'t want', transliteration: 'laa uriid' },
      { arabic: 'ليست هنا', english: 'she is not here', transliteration: 'laysat hunaa' },
    ],
    rules: [
      { rule: 'لا + verb = don\'t/doesn\'t', example: 'لا يعرف (he doesn\'t know)' },
      { rule: 'ليس + nominal = is not', example: 'ليس كبيرًا (it is not big)' },
      { rule: 'ليس conjugates: لست، لست، ليس، ليست', example: 'لست طالبًا (I am not a student)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ أفهم (I don\'t understand)', answer: 'لا', options: ['لا', 'ليس', 'لن', 'ما'] },
      { type: 'translate', prompt: 'he is not here', answer: 'ليس هنا', options: ['ليس هنا', 'لا هنا', 'لست هنا', 'ما هنا'] },
      { type: 'fill-blank', prompt: '___ هذا الكتاب جيداً (this book is not good)', answer: 'ليس', options: ['لا', 'ليس', 'لن', 'غير'] },
      { type: 'match', prompt: 'Match negation patterns', pairs: [['لا أذهب', 'I don\'t go'], ['ليس هنا', 'he is not here'], ['لا يفهم', 'he doesn\'t understand'], ['ليست طالبة', 'she is not a student']] },
      { type: 'true-false', statement: 'لا is used to negate verbs', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'ليس never changes form', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'ليس أذهب إلى المدرسة', error: 'ليس', correction: 'لا', answer: 'ليس', options: ['ليس', 'أذهب', 'المدرسة', 'No error'] },
      { type: 'sentence-transformation', prompt: 'Negate: أنا طالب (I am a student)', answer: 'لست طالباً', hint: 'use ليس conjugated for أنا', options: ['لست طالباً', 'لا طالب', 'ليس طالب', 'لا أنا طالب'] },
      { type: 'word-order', prompt: 'Which correctly says "I don\'t write"?', answer: 'لا أكتب', options: ['لا أكتب', 'أكتب لا', 'ليس أكتب', 'لا يكتب'] },
      { type: 'classify', prompt: 'Classify negation: use لا or ليس', categories: ['لا (verbs)', 'ليس (nouns/adj)'], items: [{ text: 'لا أذهب', category: 'لا (verbs)' }, { text: 'ليس كبيرًا', category: 'ليس (nouns/adj)' }, { text: 'لا يكتب', category: 'لا (verbs)' }, { text: 'لست هنا', category: 'ليس (nouns/adj)' }] },
      { type: 'multiple-select', prompt: 'Select all verb negation examples:', correctAnswers: ['لا أذهب', 'لا يفهم'], options: ['لا أذهب', 'ليس هنا', 'لا يفهم', 'لست طالباً'], answer: 'لا أذهب,لا يفهم' },
      { type: 'build-sentence', prompt: 'Build: "she is not a teacher"', answer: 'ليست معلمة', options: ['ليست معلمة', 'لا معلمة', 'ليس معلمة', 'لست معلمة'] },
    ],
    quiz: [
      { question: 'Which particle negates verbs in Arabic?', options: ['ليس', 'لا', 'غير', 'عدم'], correct: 1, explanation: 'لا (laa) is used before verbs to negate them' },
      { question: 'How do you say "I am not a student" (nominal sentence)?', options: ['لا طالب', 'لست طالباً', 'ليس طالباً', 'ما طالباً'], correct: 1, explanation: 'لست طالباً — لست is ليس conjugated for أنا' },
      { question: 'What does ليست mean?', options: ['is not (masc.)', 'is not (fem.)', 'do not', 'will not'], correct: 1, explanation: 'ليست is the feminine form of ليس (is not)' },
      { question: 'Which is correct for "he doesn\'t know"?', options: ['ليس يعرف', 'لا يعرف', 'لست يعرف', 'ما يعرف'], correct: 1, explanation: 'لا يعرف (laa ya\'rif) = "he doesn\'t know"' },
    ],
  },

  {
    id: 'present-tense',
    title: 'Present Tense (المضارع)',
    titleArabic: 'الفعل المضارع',
    category: 'verbs',
    difficulty: 2,
    order: 18,
    cefrLevel: 'A2',
    explanation: `The Arabic present tense (المضارع) is formed by adding prefixes to the verb root. Each person has a unique prefix: أ (I), ت (you/she), ي (he), ن (we). The present tense describes ongoing or habitual actions.

Full conjugation of كَتَبَ (to write):
• أكتب = I write
• تكتب = you write (m) / she writes
• يكتب = he writes
• نكتب = we write
• يكتبون = they write (m)
• تكتبن = they write (f)`,
    examples: [
      { arabic: 'أكتب', english: 'I write', transliteration: 'aktub' },
      { arabic: 'تكتب', english: 'you write (m)', transliteration: 'taktub' },
      { arabic: 'يكتب', english: 'he writes', transliteration: 'yaktub' },
      { arabic: 'نكتب', english: 'we write', transliteration: 'naktub' },
    ],
    rules: [
      { rule: 'أ- prefix = I (أنا)', example: 'أذهب (I go)' },
      { rule: 'ي- prefix = he, ت- = you/she', example: 'يقرأ (he reads), تقرأ (you/she reads)' },
      { rule: 'ن- prefix = we (نحن)', example: 'نفهم (we understand)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'أنا ___ العربية (I study Arabic)', answer: 'أدرس', options: ['أدرس', 'يدرس', 'تدرس', 'ندرس'] },
      { type: 'translate', prompt: 'she reads', answer: 'تقرأ', options: ['أقرأ', 'تقرأ', 'يقرأ', 'نقرأ'] },
      { type: 'fill-blank', prompt: 'هو ___ في البيت (he lives in the house)', answer: 'يسكن', options: ['يسكن', 'تسكن', 'أسكن', 'نسكن'] },
      { type: 'match', prompt: 'Match conjugations of ذَهَبَ', pairs: [['أذهب', 'I go'], ['يذهب', 'he goes'], ['تذهب', 'she goes'], ['نذهب', 'we go']] },
      { type: 'conjugation-drill', prompt: 'Conjugate قَرَأَ for أنا (present)', verb: 'قَرَأَ', root: 'ق-ر-أ', pronoun: 'أنا', paradigm: 'present', answer: 'أقرأ', options: ['أقرأ', 'يقرأ', 'تقرأ', 'نقرأ'] },
      { type: 'conjugation-drill', prompt: 'Conjugate فَهِمَ for هو (present)', verb: 'فَهِمَ', root: 'ف-ه-م', pronoun: 'هو', paradigm: 'present', answer: 'يفهم', options: ['أفهم', 'يفهم', 'تفهم', 'نفهم'] },
      { type: 'conjugation-drill', prompt: 'Conjugate سَكَنَ for نحن (present)', verb: 'سَكَنَ', root: 'س-ك-ن', pronoun: 'نحن', paradigm: 'present', answer: 'نسكن', options: ['أسكن', 'يسكن', 'تسكن', 'نسكن'] },
      { type: 'true-false', statement: 'The prefix ت is used for both "you (m)" and "she" in present tense', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'نحن يدرس في المدرسة', error: 'يدرس', correction: 'ندرس', answer: 'يدرس', options: ['نحن', 'يدرس', 'المدرسة', 'No error'] },
      { type: 'sentence-transformation', prompt: 'Change subject to هو: أكتب الدرس', answer: 'يكتب الدرس', hint: 'أنا (أ) → هو (ي)', options: ['يكتب الدرس', 'تكتب الدرس', 'نكتب الدرس', 'كتب الدرس'] },
      { type: 'word-order', prompt: 'Which correctly says "We understand Arabic"?', answer: 'نفهم العربية', options: ['نفهم العربية', 'العربية نفهم', 'يفهم العربية', 'نفهم عربية'] },
      { type: 'build-sentence', prompt: 'Build: "She lives in Egypt"', answer: 'تسكن في مصر', options: ['تسكن في مصر', 'يسكن في مصر', 'أسكن في مصر', 'سكنت في مصر'] },
    ],
    quiz: [
      { question: 'What prefix marks "he" in present tense?', options: ['أ', 'ت', 'ي', 'ن'], correct: 2, explanation: 'ي is the prefix for "he" (huwa) in present tense' },
      { question: 'How do you say "we understand"?', options: ['أفهم', 'يفهم', 'تفهم', 'نفهم'], correct: 3, explanation: 'نفهم — ن prefix for نحن (we)' },
      { question: 'Which form means "she writes"?', options: ['أكتب', 'يكتب', 'تكتب', 'نكتب'], correct: 2, explanation: 'تكتب can mean "you write (m)" OR "she writes"' },
      { question: 'What does أدرس mean?', options: ['he studies', 'you study', 'I study', 'we study'], correct: 2, explanation: 'أدرس = "I study" (أ prefix = I)' },
    ],
  },

  {
    id: 'future-tense',
    title: 'Future Tense (سَوْفَ / سَ)',
    titleArabic: 'المستقبل',
    category: 'verbs',
    difficulty: 2,
    order: 19,
    cefrLevel: 'A2',
    explanation: `Arabic forms the future by adding سوف (sawfa) or the prefix سـ (sa-) before the present tense verb. Both mean "will" but سـ is more immediate while سوف is more distant or formal.

• سأذهب = I will go (soon)
• سوف أذهب = I will go (formal/distant)
• Negation: لن + subjunctive = will not`,
    examples: [
      { arabic: 'سأذهب', english: 'I will go', transliteration: 'sa-adhhab' },
      { arabic: 'سوف أدرس', english: 'I will study', transliteration: 'sawfa adrus' },
      { arabic: 'سيكتب', english: 'he will write', transliteration: 'sa-yaktub' },
      { arabic: 'لن أذهب', english: 'I will not go', transliteration: 'lan adhhab' },
    ],
    rules: [
      { rule: 'سـ + present verb = near future', example: 'سأفعل (I will do — soon)' },
      { rule: 'سوف + present verb = distant/formal future', example: 'سوف نسافر (we will travel)' },
      { rule: 'Negation: لن + present subjunctive', example: 'لن أذهب (I will not go)' },
    ],
    exercises: [
      { type: 'translate', prompt: 'I will read', answer: 'سأقرأ', options: ['سأقرأ', 'أقرأ', 'قرأت', 'سيقرأ'] },
      { type: 'fill-blank', prompt: '___ يكتب الدرس غداً (he will write the lesson tomorrow)', answer: 'سوف', options: ['سوف', 'كان', 'قد', 'لن'] },
      { type: 'translate', prompt: 'she will study', answer: 'ستدرس', options: ['ستدرس', 'تدرس', 'درست', 'سأدرس'] },
      { type: 'match', prompt: 'Match future forms of ذَهَبَ', pairs: [['سأذهب', 'I will go'], ['سيذهب', 'he will go'], ['ستذهب', 'she will go'], ['سنذهب', 'we will go']] },
      { type: 'conjugation-drill', prompt: 'Conjugate كَتَبَ for هو (future)', verb: 'كَتَبَ', root: 'ك-ت-ب', pronoun: 'هو', paradigm: 'future', answer: 'سيكتب', options: ['سأكتب', 'سيكتب', 'ستكتب', 'سنكتب'] },
      { type: 'conjugation-drill', prompt: 'Conjugate سَافَرَ for أنا (future)', verb: 'سَافَرَ', root: 'س-ف-ر', pronoun: 'أنا', paradigm: 'future', answer: 'سأسافر', options: ['سأسافر', 'سيسافر', 'ستسافر', 'سنسافر'] },
      { type: 'true-false', statement: 'سوف is more formal than سـ prefix', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'لن أذهب means "I went"', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'أنا سوف سيذهب إلى السوق', error: 'سيذهب', correction: 'أذهب', answer: 'سيذهب', options: ['أنا', 'سوف', 'سيذهب', 'No error'] },
      { type: 'sentence-transformation', prompt: 'Change to future: أنا أدرس العربية', answer: 'أنا سأدرس العربية', hint: 'add سـ before the verb', options: ['أنا سأدرس العربية', 'أنا سيدرس العربية', 'أنا سوف يدرس', 'سأدرس أنا'] },
      { type: 'word-order', prompt: 'Which correctly says "We will travel tomorrow"?', answer: 'سنسافر غداً', options: ['سنسافر غداً', 'غداً سنسافر', 'نسافر غداً سوف', 'سوف سنسافر'] },
      { type: 'build-sentence', prompt: 'Build: "He will not come"', answer: 'لن يأتي', options: ['لن يأتي', 'لا يأتي', 'لم يأتِ', 'ليس يأتي'] },
    ],
    quiz: [
      { question: 'How do you say "he will write"?', options: ['يكتب', 'كتب', 'سيكتب', 'سأكتب'], correct: 2, explanation: 'سيكتب = "he will write" (سـ prefix + يكتب)' },
      { question: 'Which particle indicates "will not" (future negation)?', options: ['لا', 'لم', 'لن', 'ليس'], correct: 2, explanation: 'لن (lan) + subjunctive = will not' },
      { question: 'What is the difference between سـ and سوف?', options: ['No difference', 'سـ is more formal', 'سوف is more formal/distant', 'سوف is only for past'], correct: 2, explanation: 'سوف is more formal and can indicate a more distant future' },
      { question: 'How do you say "I will go"?', options: ['ذهبت', 'أذهب', 'سأذهب', 'يذهب'], correct: 2, explanation: 'سأذهب = "I will go" (سـ + أذهب)' },
    ],
  },

  {
    id: 'dual-form',
    title: 'The Dual Form (المثنى)',
    titleArabic: 'المثنى',
    category: 'nouns',
    difficulty: 2,
    order: 20,
    cefrLevel: 'A2',
    explanation: `Arabic has a special form for exactly two of something — the dual. Add ان (-aan) for nominative or ين (-ayn) for accusative/genitive. This exists in no European language and is one of Arabic's distinctive features.

• كتابان = two books (nominative)
• كتابَيْن = two books (accusative/genitive)
• بيتان = two houses (nominative)
• مدرستان = two schools (nominative, feminine)`,
    examples: [
      { arabic: 'كتابان', english: 'two books (nom)', transliteration: 'kitaabaan' },
      { arabic: 'كتابين', english: 'two books (acc/gen)', transliteration: 'kitaabayn' },
      { arabic: 'ولدان', english: 'two boys', transliteration: 'waladaan' },
      { arabic: 'طالبتان', english: 'two female students', transliteration: 'taalibataan' },
    ],
    rules: [
      { rule: 'Nominative dual: noun + ان', example: 'معلمان (two teachers)' },
      { rule: 'Accusative/genitive dual: noun + ين', example: 'معلمَين (two teachers — acc/gen)' },
      { rule: 'Feminine dual: ة becomes تان/تين', example: 'طالبة → طالبتان' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'عندي ___ (I have two books)', answer: 'كتابان', options: ['كتابان', 'كتب', 'كتاب', 'كتابين'] },
      { type: 'translate', prompt: 'two boys (nominative)', answer: 'ولدان', options: ['ولد', 'ولدان', 'ولدين', 'أولاد'] },
      { type: 'fill-blank', prompt: 'قرأت ___ (I read two books — accusative)', answer: 'كتابين', options: ['كتابان', 'كتابين', 'كتب', 'كتابات'] },
      { type: 'match', prompt: 'Match dual forms', pairs: [['كتابان', 'two books (nom)'], ['كتابين', 'two books (acc)'], ['ولدان', 'two boys (nom)'], ['طالبتان', 'two students (f, nom)']] },
      { type: 'true-false', statement: 'Arabic has a special form for exactly two of something', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'ان and ين dual endings are used in the same cases', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'عندي معلمين في الصف (nominative context)', error: 'معلمين', correction: 'معلمان', answer: 'معلمين', options: ['عندي', 'معلمين', 'الصف', 'No error'] },
      { type: 'sentence-transformation', prompt: 'Change to dual: كتاب (singular)', answer: 'كتابان', hint: 'add ان for nominative dual', options: ['كتابان', 'كتابين', 'كتب', 'كتابات'] },
      { type: 'classify', prompt: 'Classify dual nouns by case', categories: ['Nominative (ان)', 'Accusative/Gen (ين)'], items: [{ text: 'كتابان', category: 'Nominative (ان)' }, { text: 'كتابين', category: 'Accusative/Gen (ين)' }, { text: 'ولدان', category: 'Nominative (ان)' }, { text: 'ولدين', category: 'Accusative/Gen (ين)' }] },
      { type: 'word-order', prompt: 'Which is the nominative dual of "school"?', answer: 'مدرستان', options: ['مدرستان', 'مدرستين', 'مدرسات', 'مدرسة'] },
      { type: 'multiple-select', prompt: 'Select all nominative dual forms:', correctAnswers: ['كتابان', 'ولدان'], options: ['كتابان', 'كتابين', 'ولدان', 'ولدين'], answer: 'كتابان,ولدان' },
      { type: 'build-sentence', prompt: 'Build: "I have two teachers"', answer: 'عندي معلمان', options: ['عندي معلمان', 'عندي معلمين', 'عندي معلم', 'معلمان عندي'] },
    ],
    quiz: [
      { question: 'What is the nominative dual of كتاب?', options: ['كتب', 'كتابان', 'كتابين', 'كتابات'], correct: 1, explanation: 'كتابان (kitaabaan) is the nominative dual — add ان' },
      { question: 'Which ending is used for accusative/genitive dual?', options: ['ان', 'ون', 'ين', 'ات'], correct: 2, explanation: 'ين (-ayn) is used for the accusative and genitive dual' },
      { question: 'How does the feminine dual form change?', options: ['ة stays the same', 'ة → تان (nom) / تين (acc)', 'ة → ان', 'ة is dropped'], correct: 1, explanation: 'Feminine ة becomes تان in nominative and تين in accusative/genitive' },
      { question: 'What does ولدان mean?', options: ['many boys', 'one boy', 'two boys (nom)', 'two boys (acc)'], correct: 2, explanation: 'ولدان (waladaan) = "two boys" in the nominative case' },
    ],
  },

  {
    id: 'sound-plural',
    title: 'Sound Plurals',
    titleArabic: 'جمع السالم',
    category: 'nouns',
    difficulty: 2,
    order: 21,
    cefrLevel: 'A2',
    explanation: `Sound plurals follow predictable patterns. Masculine sound plural adds ون (-uun) nominative or ين (-iin) accusative/genitive. Feminine sound plural changes ة to ات (-aat). These are "sound" because the root stays intact.

Masculine sound plural:
• معلم → معلمون (teachers, nom)
• معلم → معلمين (teachers, acc/gen)

Feminine sound plural:
• معلمة → معلمات (female teachers)
• سيارة → سيارات (cars)`,
    examples: [
      { arabic: 'معلمون', english: 'teachers (m, nom)', transliteration: 'mu\'allimuun' },
      { arabic: 'معلمين', english: 'teachers (m, acc/gen)', transliteration: 'mu\'allimiin' },
      { arabic: 'معلمات', english: 'teachers (f)', transliteration: 'mu\'allimaat' },
      { arabic: 'طالبات', english: 'female students', transliteration: 'taalibaat' },
    ],
    rules: [
      { rule: 'Masc sound plural: ون (nom) / ين (acc/gen)', example: 'مهندسون / مهندسين (engineers)' },
      { rule: 'Fem sound plural: ة → ات', example: 'سيارة → سيارات (cars)' },
      { rule: 'Only for rational beings (humans) in masculine', example: 'معلمون (teachers) but NOT كتابون' },
    ],
    exercises: [
      { type: 'translate', prompt: 'female engineers', answer: 'مهندسات', options: ['مهندسات', 'مهندسون', 'مهندسين', 'مهندسة'] },
      { type: 'fill-blank', prompt: 'الطلاب ___ في الفصل (the students are in the classroom — nominative)', answer: 'موجودون', options: ['موجودون', 'موجودين', 'موجودة', 'موجود'] },
      { type: 'translate', prompt: 'cars (plural of سيارة)', answer: 'سيارات', options: ['سيارات', 'سيارون', 'سيارين', 'سائرة'] },
      { type: 'match', prompt: 'Match singular and plural', pairs: [['معلم', 'معلمون'], ['طالبة', 'طالبات'], ['مهندس', 'مهندسون'], ['ممرضة', 'ممرضات']] },
      { type: 'sentence-transformation', prompt: 'Make plural: معلمة (teacher, f)', answer: 'معلمات', hint: 'change ة to ات', options: ['معلمات', 'معلمون', 'معلمين', 'معلمة'] },
      { type: 'true-false', statement: 'The masculine sound plural uses ات ending', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'كتابات is NOT a valid sound plural (كتاب is not human)', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'المعلمات جميلون في هذا الصف', error: 'جميلون', correction: 'جميلات', answer: 'جميلون', options: ['المعلمات', 'جميلون', 'هذا', 'No error'] },
      { type: 'classify', prompt: 'Classify plurals as sound masculine or sound feminine', categories: ['Masculine (ون/ين)', 'Feminine (ات)'], items: [{ text: 'معلمون', category: 'Masculine (ون/ين)' }, { text: 'معلمات', category: 'Feminine (ات)' }, { text: 'طالبون', category: 'Masculine (ون/ين)' }, { text: 'طالبات', category: 'Feminine (ات)' }] },
      { type: 'word-order', prompt: 'Which is "the female students are present"?', answer: 'الطالبات موجودات', options: ['الطالبات موجودات', 'الطالبون موجودات', 'الطالبات موجودون', 'موجودات الطالبات'] },
      { type: 'multiple-select', prompt: 'Select all sound feminine plural forms:', correctAnswers: ['معلمات', 'طالبات'], options: ['معلمات', 'معلمون', 'طالبات', 'طالبون'], answer: 'معلمات,طالبات' },
      { type: 'build-sentence', prompt: 'Build: "The engineers are here" (masc)', answer: 'المهندسون هنا', options: ['المهندسون هنا', 'المهندسات هنا', 'المهندسين هنا', 'هنا المهندسون'] },
    ],
    quiz: [
      { question: 'What ending forms the masculine sound plural (nominative)?', options: ['ات', 'ون', 'ين', 'ان'], correct: 1, explanation: 'ون (-uun) forms the nominative masculine sound plural' },
      { question: 'How do you form the feminine sound plural?', options: ['Add ون', 'Change ة to ات', 'Add ان', 'Change to أفعال pattern'], correct: 1, explanation: 'Feminine sound plural: change ة → ات (e.g. سيارة → سيارات)' },
      { question: 'What does معلمات mean?', options: ['teachers (m)', 'teacher (f, sing)', 'female teachers', 'the teacher'], correct: 2, explanation: 'معلمات = "female teachers" (sound feminine plural)' },
      { question: 'Which sentence uses the masculine sound plural correctly?', options: ['المعلمون موجودون', 'المعلمون موجودات', 'المعلمات موجودون', 'معلمون موجود'], correct: 0, explanation: 'المعلمون موجودون — both subject and predicate are masculine plural' },
    ],
  },

  {
    id: 'broken-plural',
    title: 'Broken Plurals',
    titleArabic: 'جمع التكسير',
    category: 'nouns',
    difficulty: 2,
    order: 22,
    cefrLevel: 'A2',
    explanation: `Broken plurals change the internal vowel pattern of the word — the "skeleton" of consonants stays but vowels shift. This is unique to Semitic languages. There are about 30 patterns, but a few are very common:

• فُعُول (fu'uul): بيت → بيوت, درس → دروس
• أَفْعَال (af'aal): قلم → أقلام, ولد → أولاد
• فِعَال (fi'aal): جبل → جبال, رجل → رجال
• فُعَل (fu'al): كلمة → كلم, غرفة → غرف`,
    examples: [
      { arabic: 'كتاب → كتب', english: 'book → books', transliteration: 'kitaab → kutub' },
      { arabic: 'قلم → أقلام', english: 'pen → pens', transliteration: 'qalam → aqlaam' },
      { arabic: 'رجل → رجال', english: 'man → men', transliteration: 'rajul → rijaal' },
      { arabic: 'بيت → بيوت', english: 'house → houses', transliteration: 'bayt → buyuut' },
    ],
    rules: [
      { rule: 'فُعُول pattern (most common)', example: 'بيت → بيوت, درس → دروس' },
      { rule: 'أَفْعَال pattern', example: 'قلم → أقلام, ولد → أولاد' },
      { rule: 'فِعَال pattern', example: 'جبل → جبال, رجل → رجال' },
    ],
    exercises: [
      { type: 'translate', prompt: 'books (plural of كتاب)', answer: 'كتب', options: ['كتب', 'كتابات', 'كتابون', 'كتابين'] },
      { type: 'fill-blank', prompt: 'عندي ثلاثة ___ (I have three pens)', answer: 'أقلام', options: ['أقلام', 'قلمات', 'قلمون', 'أقلامات'] },
      { type: 'translate', prompt: 'houses (plural)', answer: 'بيوت', options: ['بيوت', 'بيتات', 'بيتون', 'أبيات'] },
      { type: 'match', prompt: 'Match singular and broken plural', pairs: [['كتاب', 'كتب'], ['بيت', 'بيوت'], ['قلم', 'أقلام'], ['رجل', 'رجال']] },
      { type: 'true-false', statement: 'Broken plurals follow a completely unpredictable pattern', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'كتب is the broken plural of كتاب', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'عندي خمسة كتابات للدراسة', error: 'كتابات', correction: 'كتب', answer: 'كتابات', options: ['عندي', 'خمسة', 'كتابات', 'No error'] },
      { type: 'classify', prompt: 'Classify by broken plural pattern', categories: ['أَفْعَال', 'فُعُول'], items: [{ text: 'أقلام', category: 'أَفْعَال' }, { text: 'بيوت', category: 'فُعُول' }, { text: 'أولاد', category: 'أَفْعَال' }, { text: 'دروس', category: 'فُعُول' }] },
      { type: 'sentence-transformation', prompt: 'Make plural: درس (lesson)', answer: 'دروس', hint: 'pattern: فُعُول', options: ['دروس', 'درسات', 'درسون', 'أدراس'] },
      { type: 'word-order', prompt: 'Which is correct: "I studied many lessons"?', answer: 'درست دروساً كثيرة', options: ['درست دروساً كثيرة', 'درست درسات كثيرة', 'درست دروسات', 'كثيرة دروس درست'] },
      { type: 'multiple-select', prompt: 'Select all أَفْعَال pattern plurals:', correctAnswers: ['أقلام', 'أولاد'], options: ['أقلام', 'بيوت', 'أولاد', 'رجال'], answer: 'أقلام,أولاد' },
      { type: 'build-sentence', prompt: 'Build: "He has many pens"', answer: 'عنده أقلام كثيرة', options: ['عنده أقلام كثيرة', 'عنده قلمات كثيرة', 'كثيرة أقلام عنده', 'عنده كثير قلم'] },
    ],
    quiz: [
      { question: 'What is the broken plural of بيت (house)?', options: ['بيوت', 'بيتات', 'بيتون', 'أبيات'], correct: 0, explanation: 'بيوت (buyuut) follows the فُعُول pattern' },
      { question: 'What is the broken plural of قلم (pen)?', options: ['قلمات', 'أقلام', 'قلمون', 'قلائم'], correct: 1, explanation: 'أقلام (aqlaam) follows the أَفْعَال pattern' },
      { question: 'What is special about broken plurals?', options: ['They add ون', 'They change internal vowels', 'They add ات', 'They double the last letter'], correct: 1, explanation: 'Broken plurals change the internal vowel pattern while keeping the root consonants' },
      { question: 'What is the plural of كتاب (book)?', options: ['كتابات', 'كتابون', 'كتب', 'أكتاب'], correct: 2, explanation: 'كتب (kutub) is the broken plural of كتاب (follows فُعُل pattern)' },
    ],
  },

  {
    id: 'comparative',
    title: 'Comparative & Superlative',
    titleArabic: 'التفضيل',
    category: 'nouns',
    difficulty: 2,
    order: 23,
    cefrLevel: 'A2',
    explanation: `Arabic comparative follows the pattern أَفْعَل (af'al): كبير (big) → أكبر (bigger/biggest). The same form serves as both comparative and superlative depending on context. With من (min = than), it's comparative; with ال, it's superlative.

• أكبر من = bigger than
• الأكبر = the biggest
• أجمل من = more beautiful than
• الأجمل = the most beautiful`,
    examples: [
      { arabic: 'أكبر', english: 'bigger / biggest', transliteration: 'akbar' },
      { arabic: 'أصغر من', english: 'smaller than', transliteration: 'asghar min' },
      { arabic: 'الأجمل', english: 'the most beautiful', transliteration: 'al-ajmal' },
      { arabic: 'أطول من', english: 'taller than', transliteration: 'atwal min' },
    ],
    rules: [
      { rule: 'Pattern: أَفْعَل from root', example: 'كبير (big) → أكبر, جميل (beautiful) → أجمل' },
      { rule: 'Comparative: أفعل + من', example: 'هو أكبر من أخيه (he is bigger than his brother)' },
      { rule: 'Superlative: ال + أفعل', example: 'هي الأذكى (she is the smartest)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'هذا البيت ___ من ذلك (this house is bigger than that)', answer: 'أكبر', options: ['أكبر', 'كبير', 'الأكبر', 'كبيرة'] },
      { type: 'translate', prompt: 'smaller than', answer: 'أصغر من', options: ['أصغر من', 'صغير من', 'الأصغر', 'أصغر'] },
      { type: 'fill-blank', prompt: 'هو ___ طالب في الصف (he is the best student)', answer: 'أفضل', options: ['أفضل', 'فضل', 'جيد', 'الجيد'] },
      { type: 'match', prompt: 'Match adjective to comparative', pairs: [['كبير', 'أكبر'], ['صغير', 'أصغر'], ['جميل', 'أجمل'], ['طويل', 'أطول']] },
      { type: 'sentence-transformation', prompt: 'Make comparative: هو كبير', answer: 'هو أكبر من أخيه', hint: 'use أفعل pattern + من', options: ['هو أكبر من أخيه', 'هو الأكبر', 'هو كبير جداً', 'هو أكبر'] },
      { type: 'true-false', statement: 'أكبر can mean both "bigger" and "biggest" depending on context', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The superlative always uses من (than)', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'هي أجمل من هو بكثير', error: 'هو', correction: 'منه', answer: 'هو', options: ['هي', 'أجمل', 'هو', 'No error'] },
      { type: 'classify', prompt: 'Classify as comparative or superlative usage', categories: ['Comparative (+ من)', 'Superlative (ال +)'], items: [{ text: 'أكبر من', category: 'Comparative (+ من)' }, { text: 'الأكبر', category: 'Superlative (ال +)' }, { text: 'أجمل من', category: 'Comparative (+ من)' }, { text: 'الأجمل', category: 'Superlative (ال +)' }] },
      { type: 'word-order', prompt: 'Which correctly says "she is the most beautiful"?', answer: 'هي الأجمل', options: ['هي الأجمل', 'هي أجمل', 'الأجمل هي', 'هي أجمل من'] },
      { type: 'multiple-select', prompt: 'Select all comparative forms:', correctAnswers: ['أكبر من', 'أطول من'], options: ['أكبر من', 'الأكبر', 'أطول من', 'الأطول'], answer: 'أكبر من,أطول من' },
      { type: 'build-sentence', prompt: 'Build: "This book is better than that one"', answer: 'هذا الكتاب أفضل من ذلك', options: ['هذا الكتاب أفضل من ذلك', 'هذا الكتاب الأفضل', 'ذلك أفضل من هذا الكتاب', 'هذا الكتاب أفضل'] },
    ],
    quiz: [
      { question: 'What is the comparative of كبير (big)?', options: ['كبيرة', 'أكبر', 'كبار', 'كبير جداً'], correct: 1, explanation: 'أكبر (akbar) follows the أَفْعَل pattern' },
      { question: 'How do you say "smaller than"?', options: ['أصغر', 'أصغر من', 'الأصغر', 'صغير جداً'], correct: 1, explanation: 'أصغر من = "smaller than" (comparative + من)' },
      { question: 'How do you form the superlative?', options: ['Add من after أفعل', 'Add ال before أفعل', 'Add جداً after adjective', 'Use أكثر'], correct: 1, explanation: 'Superlative: ال + أفعل form (e.g. الأكبر = the biggest)' },
      { question: 'What is the comparative of جميل (beautiful)?', options: ['جميلة', 'أجمل', 'الأجمل', 'جميل جداً'], correct: 1, explanation: 'أجمل follows the أَفْعَل pattern (root: ج-م-ل)' },
    ],
  },

  {
    id: 'active-participle',
    title: 'Active Participle (اسم الفاعل)',
    titleArabic: 'اسم الفاعل',
    category: 'verbs',
    difficulty: 2,
    order: 24,
    cefrLevel: 'A2',
    explanation: `The active participle (اسم الفاعل) describes the doer of an action. From Form I verbs, the pattern is فاعِل (faa'il). كتب (wrote) → كاتب (writer). This is incredibly productive in Arabic — hundreds of common words are active participles.

Pattern: فاعِل (faa'il) for Form I verbs

Examples:
• كَتَبَ → كاتِب (writer)
• دَرَسَ → دارِس (studier)
• سَكَنَ → ساكِن (resident)
• عَمِلَ → عامِل (worker)`,
    examples: [
      { arabic: 'كاتب', english: 'writer / writing', transliteration: 'kaatib' },
      { arabic: 'طالب', english: 'student / seeking', transliteration: 'taalib' },
      { arabic: 'عامل', english: 'worker / working', transliteration: '\'aamil' },
      { arabic: 'سائق', english: 'driver / driving', transliteration: 'saa\'iq' },
    ],
    rules: [
      { rule: 'Form I pattern: فاعِل (faa\'il)', example: 'درس → دارس (studier), حكم → حاكم (ruler)' },
      { rule: 'Can function as noun or adjective', example: 'هو كاتب (he is a writer) / كاتب مشهور (a famous writer)' },
      { rule: 'Feminine: فاعلة', example: 'كاتبة (female writer), طالبة (female student)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'هو ___ في المدرسة (he is a teacher at the school)', answer: 'معلم', options: ['معلم', 'علم', 'تعليم', 'يعلم'] },
      { type: 'translate', prompt: 'active participle of كَتَبَ', answer: 'كاتب', options: ['كاتب', 'مكتوب', 'كتابة', 'يكتب'] },
      { type: 'fill-blank', prompt: 'هي ___ للامتحان (she is studying for the exam — act. part.)', answer: 'دارسة', options: ['دارسة', 'دارس', 'تدرس', 'مدروسة'] },
      { type: 'match', prompt: 'Match verb to active participle', pairs: [['كَتَبَ', 'كاتب'], ['دَرَسَ', 'دارس'], ['عَمِلَ', 'عامل'], ['سَكَنَ', 'ساكن']] },
      { type: 'conjugation-drill', prompt: 'Form active participle of ذَهَبَ (to go)', verb: 'ذَهَبَ', root: 'ذ-ه-ب', pronoun: 'م', paradigm: 'present', answer: 'ذاهب', options: ['ذاهب', 'مذهوب', 'ذهاب', 'ذهب'] },
      { type: 'sentence-transformation', prompt: 'Change to feminine: هو كاتب', answer: 'هي كاتبة', hint: 'add ة to فاعِل to make فاعِلة', options: ['هي كاتبة', 'هي كاتب', 'هو كاتبة', 'هي كاتبات'] },
      { type: 'true-false', statement: 'Active participles in Arabic follow the pattern فاعِل for Form I verbs', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'كاتبة is the masculine active participle', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'هي طالب في الجامعة (she is a student)', error: 'طالب', correction: 'طالبة', answer: 'طالب', options: ['هي', 'طالب', 'الجامعة', 'No error'] },
      { type: 'classify', prompt: 'Classify as active participle or regular verb form', categories: ['Active Participle', 'Verb Form'], items: [{ text: 'كاتب', category: 'Active Participle' }, { text: 'يكتب', category: 'Verb Form' }, { text: 'دارس', category: 'Active Participle' }, { text: 'درس', category: 'Verb Form' }] },
      { type: 'word-order', prompt: 'Which correctly says "a famous writer"?', answer: 'كاتب مشهور', options: ['كاتب مشهور', 'مشهور كاتب', 'الكاتب المشهور', 'يكتب مشهور'] },
      { type: 'build-sentence', prompt: 'Build: "She is a resident of this city"', answer: 'هي ساكنة في هذه المدينة', options: ['هي ساكنة في هذه المدينة', 'هي ساكن في هذه المدينة', 'هي تسكن في هذه المدينة', 'ساكنة هي في المدينة'] },
    ],
    quiz: [
      { question: 'What pattern forms the active participle (Form I)?', options: ['مَفْعول', 'فاعِل', 'فَعّال', 'أَفْعَل'], correct: 1, explanation: 'فاعِل (faa\'il) is the Form I active participle pattern' },
      { question: 'What is the active participle of كَتَبَ (to write)?', options: ['مكتوب', 'كتابة', 'كاتب', 'يكتب'], correct: 2, explanation: 'كاتب (kaatib) = "writer" — the active participle of كَتَبَ' },
      { question: 'How do you say "female student" using the active participle pattern?', options: ['طالب', 'طالبة', 'طلاب', 'مطلوبة'], correct: 1, explanation: 'طالبة (taaliba) is the feminine active participle — add ة to طالب' },
      { question: 'Which of these is an active participle?', options: ['مكتوب', 'يكتب', 'كتابة', 'كاتب'], correct: 3, explanation: 'كاتب (kaatib) follows the فاعِل pattern — it\'s an active participle meaning "writer"' },
    ],
  },

  {
    id: 'verb-forms-2-5',
    title: "Verb Forms II-V",
    titleArabic: "الأوزان II-V",
    category: 'verbs',
    difficulty: 3,
    order: 25,
    cefrLevel: 'B1',
    explanation: "Arabic verb forms (أوزان) are one of the language's most powerful features. Each form adds predictable meaning to a root. Form II (فَعَّلَ) intensifies or makes causative. Form III (فاعَلَ) implies doing with someone. Form IV (أَفْعَلَ) is causative. Form V (تَفَعَّلَ) is reflexive of II.",
    examples: [
      {arabic: "علّم (II)", english: "to teach (intensive of علم)", transliteration: "'allama"},
      {arabic: "كاتَب (III)", english: "to correspond with", transliteration: "kaataba"},
      {arabic: "أخرَج (IV)", english: "to take out / produce", transliteration: "akhraja"},
      {arabic: "تعلّم (V)", english: "to learn (reflexive of teach)", transliteration: "ta'allama"}
    ],
    rules: [
      {rule: "Form II فَعَّلَ: doubling middle letter = intensive/causative", example: "كسر (broke) → كسّر (smashed to pieces)"},
      {rule: "Form III فاعَلَ: long ا after first root = mutual action", example: "قتل (killed) → قاتل (fought with)"},
      {rule: "Form IV أَفْعَلَ: prefix أ = causative", example: "خرج (went out) → أخرج (took out)"},
      {rule: "Form V تَفَعَّلَ: prefix ت + doubled middle = reflexive of II", example: "علّم (taught) → تعلّم (learned)"}
    ],
    exercises: [
      { type: 'translate', prompt: 'to learn (Form V of علم)', answer: 'تعلّم', options: ['تعلّم', 'علّم', 'أعلم', 'عالم'] },
      { type: 'translate', prompt: 'to teach (Form II of علم)', answer: 'علّم', options: ['علّم', 'تعلّم', 'أعلم', 'معلم'] },
      { type: 'fill-blank', prompt: '_____ الأستاذ الطلابَ اللغةَ العربية (The teacher taught the students Arabic)', answer: 'علّم', options: ['علّم', 'تعلّم', 'يعلم', 'أعلم'] },
      { type: 'fill-blank', prompt: '_____ محمد مع صديقه كل أسبوع (Muhammad corresponds with his friend every week)', answer: 'كاتَب', options: ['كاتَب', 'كتب', 'يكتب', 'اكتتب'] },
      { type: 'match', prompt: 'Match form to meaning', pairs: [['علّم', 'taught (II)'], ['كاتَب', 'corresponded (III)'], ['أخرج', 'took out (IV)'], ['تعلّم', 'learned (V)']] },
      { type: 'conjugation-drill', prompt: 'Conjugate Form II علّم for أنا (past)', verb: 'علّم', root: 'ع-ل-م', pronoun: 'أنا', paradigm: 'past', answer: 'علّمتُ', options: ['علّمتُ', 'تعلّمتُ', 'أعلمتُ', 'علمتُ'] },
      { type: 'conjugation-drill', prompt: 'Conjugate Form V تعلّم for هو (past)', verb: 'تعلّم', root: 'ع-ل-م', pronoun: 'هو', paradigm: 'past', answer: 'تعلّم', options: ['تعلّم', 'علّم', 'أعلم', 'يتعلّم'] },
      { type: 'sentence-transformation', prompt: 'Make causative using Form II: خرج الولد (the boy went out)', answer: 'أخرج الأبُ الولدَ', hint: 'Form IV أَفْعَلَ makes an action causative', options: ['أخرج الأبُ الولدَ', 'خرّج الأبُ الولدَ', 'يخرج الولد', 'خرج الولد أيضًا'] },
      { type: 'true-false', statement: 'Form II (فَعَّلَ) is formed by doubling the middle root letter', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'Form III (فاعَلَ) adds prefix أ to make a verb causative', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'هو أتعلّم العربية كل يوم', error: 'أتعلّم', correction: 'يتعلّم', answer: 'أتعلّم', options: ['هو', 'أتعلّم', 'العربية', 'No error'] },
      { type: 'classify', prompt: 'Classify by verb form number', categories: ['Form II', 'Form III', 'Form IV', 'Form V'], items: [{ text: 'علّم', category: 'Form II' }, { text: 'قاتل', category: 'Form III' }, { text: 'أرسل', category: 'Form IV' }, { text: 'تعلّم', category: 'Form V' }] },
    ],
    quiz: [
      { question: 'Which verb form is formed by doubling the middle root letter?', options: ['Form I', 'Form II', 'Form III', 'Form IV'], correct: 1, explanation: 'Form II (فَعَّلَ) doubles the middle root letter, adding intensive or causative meaning' },
      { question: 'What does Form IV (أَفْعَلَ) typically express?', options: ['Reciprocal action', 'Reflexive action', 'Causative action', 'Passive action'], correct: 2, explanation: 'Form IV adds prefix أ and makes the verb causative: خرج (went out) → أخرج (took out/produced)' },
      { question: 'What is تعلّم?', options: ['Form II of علم', 'Form III of علم', 'Form IV of علم', 'Form V of علم'], correct: 3, explanation: 'تعلّم is Form V (تَفَعَّلَ) — the reflexive of Form II علّم (to teach) → تعلّم (to learn)' },
      { question: 'Form III (فاعَلَ) implies:', options: ['Doing something to yourself', 'Doing something to others intensely', 'Doing something with/to someone else mutually', 'Being unable to do something'], correct: 2, explanation: 'Form III uses a long ا after the first root letter and implies mutual or reciprocal action between parties' },
    ],
  },
  {
    id: 'verb-forms-6-10',
    title: "Verb Forms VI-X",
    titleArabic: "الأوزان VI-X",
    category: 'verbs',
    difficulty: 3,
    order: 26,
    cefrLevel: 'B1',
    explanation: "Forms VI-X complete the Arabic verb system. Form VI (تَفاعَلَ) is reciprocal. Form VII (اِنفَعَلَ) is passive/reflexive. Form VIII (اِفتَعَلَ) is reflexive. Form X (اِستَفعَلَ) means 'to seek/consider'.",
    examples: [
      {arabic: "تعاون (VI)", english: "to cooperate (mutual help)", transliteration: "ta'aawana"},
      {arabic: "انكسر (VII)", english: "to be broken", transliteration: "inkasara"},
      {arabic: "اجتمع (VIII)", english: "to gather / meet", transliteration: "ijtama'a"},
      {arabic: "استخدم (X)", english: "to use / employ", transliteration: "istakhdama"}
    ],
    rules: [
      {rule: "Form VI تَفاعَلَ: reciprocal/pretending", example: "تبادل (exchanged with each other)"},
      {rule: "Form VII اِنفَعَلَ: passive/reflexive", example: "فتح (opened) → انفتح (was opened)"},
      {rule: "Form VIII اِفتَعَلَ: reflexive", example: "جمع (gathered) → اجتمع (assembled)"},
      {rule: "Form X اِستَفعَلَ: seek/consider", example: "غفر (forgave) → استغفر (sought forgiveness)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ الطلاب في الفصل (the students gathered in the classroom)', answer: 'اجتمع', options: ['اجتمع', 'جمع', 'تجمّع', 'جامع'] },
      { type: 'translate', prompt: 'to cooperate (Form VI of عون)', answer: 'تعاون', options: ['تعاون', 'عاون', 'أعان', 'استعان'] },
      { type: 'fill-blank', prompt: '___ الباب فجأة (the door was opened suddenly — Form VII)', answer: 'انفتح', options: ['انفتح', 'فتح', 'يفتح', 'افتتح'] },
      { type: 'translate', prompt: 'to use / employ (Form X of خدم)', answer: 'استخدم', options: ['استخدم', 'خدم', 'أخدم', 'تخادم'] },
      { type: 'match', prompt: 'Match form to example', pairs: [['تعاون', 'Form VI — cooperated'], ['انكسر', 'Form VII — was broken'], ['اجتمع', 'Form VIII — gathered'], ['استخدم', 'Form X — used']] },
      { type: 'conjugation-drill', prompt: 'Conjugate Form VIII اجتمع for نحن (past)', verb: 'اجتمع', root: 'ج-م-ع', pronoun: 'نحن', paradigm: 'past', answer: 'اجتمعنا', options: ['اجتمعنا', 'يجتمعون', 'جمعنا', 'تجمّعنا'] },
      { type: 'sentence-transformation', prompt: 'Make reflexive using Form VII: كسر الولد الزجاجة', answer: 'انكسرت الزجاجة', hint: 'Form VII اِنفَعَلَ makes passive/reflexive', options: ['انكسرت الزجاجة', 'كسّر الزجاجة', 'يكسر الزجاجة', 'اكتسرت الزجاجة'] },
      { type: 'true-false', statement: 'Form X (اِستَفعَلَ) expresses seeking or considering something', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'Form VI (تَفاعَلَ) is the same as Form II', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'الفريقان تبادلا الهدايا (the two teams exchanged gifts) — is this Form VI?', error: 'لا، هذا خطأ', correction: 'نعم، تبادل هو الوزن السادس', answer: 'لا، هذا خطأ', options: ['نعم، صحيح', 'لا، هذا خطأ', 'Form VIII', 'Form IV'] },
      { type: 'classify', prompt: 'Classify by verb form', categories: ['Form VI', 'Form VII', 'Form VIII', 'Form X'], items: [{ text: 'تشاور', category: 'Form VI' }, { text: 'انقطع', category: 'Form VII' }, { text: 'اشترى', category: 'Form VIII' }, { text: 'استقبل', category: 'Form X' }] },
      { type: 'build-sentence', prompt: 'Build: "We gathered in the mosque"', answer: 'اجتمعنا في المسجد', options: ['اجتمعنا في المسجد', 'جمعنا في المسجد', 'تجمّعنا في المسجد', 'نجتمع في المسجد'] },
    ],
    quiz: [
      { question: 'What does Form VII (اِنفَعَلَ) typically express?', options: ['Causative meaning', 'Passive or reflexive meaning', 'Reciprocal meaning', 'Seeking meaning'], correct: 1, explanation: 'Form VII (اِنفَعَلَ) typically expresses passive or reflexive meaning: فتح (opened) → انفتح (was opened/opened itself)' },
      { question: 'Which form means "to seek" or "to consider"?', options: ['Form VI', 'Form VII', 'Form VIII', 'Form X'], correct: 3, explanation: 'Form X (اِستَفعَلَ) expresses seeking or considering: استخدم (to use), استغفر (to seek forgiveness)' },
      { question: 'اجتمع is an example of which form?', options: ['Form V', 'Form VI', 'Form VII', 'Form VIII'], correct: 3, explanation: 'اجتمع follows اِفتَعَلَ pattern (Form VIII) — reflexive gathering' },
      { question: 'Form VI (تَفاعَلَ) adds which element to the root?', options: ['Prefix أ', 'Doubled middle letter', 'Prefix تَ + long ا after first letter', 'Prefix اِستَ'], correct: 2, explanation: 'Form VI (تَفاعَلَ) = prefix تَ + long ا after the first root letter, indicating reciprocal action' },
    ],
  },
  {
    id: 'relative-clauses',
    title: "Relative Clauses (الذي)",
    titleArabic: "الاسم الموصول",
    category: 'nouns',
    difficulty: 3,
    order: 27,
    cefrLevel: 'B1',
    explanation: "Arabic relative pronouns agree with the noun they refer to. الذي (alladhii) for masculine singular, التي (allatii) for feminine, الذين (alladhiina) for masculine plural, اللاتي/اللواتي for feminine plural.",
    examples: [
      {arabic: "الكتاب الذي قرأته", english: "the book which I read", transliteration: "al-kitaab alladhii qara'tuhu"},
      {arabic: "المرأة التي رأيتها", english: "the woman whom I saw", transliteration: "al-mar'a allatii ra'aytuhaa"},
      {arabic: "الطلاب الذين نجحوا", english: "the students who passed", transliteration: "at-tullaab alladhiina najahuu"}
    ],
    rules: [
      {rule: "الذي = who/which (masculine singular)", example: "الرجل الذي جاء (the man who came)"},
      {rule: "التي = who/which (feminine singular)", example: "البنت التي درست (the girl who studied)"},
      {rule: "Resumptive pronoun required in object clauses", example: "الكتاب الذي قرأتُهُ (the book which I read IT)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'المعلمة ___ علّمتنا (the teacher who taught us)', answer: 'التي', options: ['التي', 'الذي', 'الذين', 'اللاتي'] },
      { type: 'fill-blank', prompt: 'الرجل ___ جاء أمس (the man who came yesterday)', answer: 'الذي', options: ['الذي', 'التي', 'الذين', 'اللواتي'] },
      { type: 'translate', prompt: 'the students who passed', answer: 'الطلاب الذين نجحوا', options: ['الطلاب الذين نجحوا', 'الطلاب الذي نجحوا', 'طلاب الذين نجحوا', 'الطلاب الذي نجح'] },
      { type: 'fill-blank', prompt: 'الكتاب ___ قرأتُهُ ممتع (the book which I read is interesting)', answer: 'الذي', options: ['الذي', 'التي', 'الذين', 'ما'] },
      { type: 'match', prompt: 'Match relative pronoun to context', pairs: [['الذي', 'masc. singular noun'], ['التي', 'fem. singular noun'], ['الذين', 'masc. plural noun'], ['اللاتي', 'fem. plural noun']] },
      { type: 'sentence-transformation', prompt: 'Combine: رأيتُ الطالبة. الطالبة درست جيدًا.', answer: 'رأيتُ الطالبةَ التي درست جيدًا', hint: 'Use التي for feminine singular', options: ['رأيتُ الطالبةَ التي درست جيدًا', 'رأيتُ الطالبةَ الذي درست جيدًا', 'رأيتُ الطالبة التي درستها جيدًا', 'رأيتُ الطالبة الذين درسوا جيدًا'] },
      { type: 'true-false', statement: 'الذي is used for both masculine and feminine singular nouns', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'A resumptive pronoun is required when the relative clause has the noun as object', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'قرأتُ الكتابَ الذي اشتريتُ من السوق', error: 'اشتريتُ', correction: 'اشتريتُه', answer: 'اشتريتُ', options: ['قرأتُ', 'الذي', 'اشتريتُ', 'No error'] },
      { type: 'classify', prompt: 'Choose the correct relative pronoun for each noun', categories: ['الذي', 'التي', 'الذين'], items: [{ text: 'الكتاب', category: 'الذي' }, { text: 'البنت', category: 'التي' }, { text: 'الأولاد', category: 'الذين' }, { text: 'المدرسة', category: 'التي' }] },
      { type: 'cloze', text: 'هذا هو الرجل ___ ساعدنا، والمرأة ___ أحضرت الطعام', blanks: [{ answer: 'الذي', options: ['الذي', 'التي', 'الذين'] }, { answer: 'التي', options: ['الذي', 'التي', 'الذين'] }] },
      { type: 'build-sentence', prompt: 'Build: "the city which I visited"', answer: 'المدينة التي زرتُها', options: ['المدينة التي زرتُها', 'المدينة الذي زرتُها', 'المدينة التي زرتُ', 'المدينة الذين زرتُها'] },
    ],
    quiz: [
      { question: 'Which relative pronoun is used for a masculine singular noun?', options: ['التي', 'الذي', 'الذين', 'اللاتي'], correct: 1, explanation: 'الذي (alladhii) is the masculine singular relative pronoun meaning "who/which"' },
      { question: 'What is the relative pronoun for feminine plural nouns?', options: ['الذين', 'الذي', 'التي', 'اللاتي'], correct: 3, explanation: 'اللاتي (allaatii) or اللواتي is used for feminine plural nouns' },
      { question: 'Why is there a resumptive pronoun in "الكتاب الذي قرأتُهُ"?', options: ['For emphasis', 'Because the relative clause object needs a pronoun back-reference', 'It is optional', 'Arabic always adds ه'], correct: 1, explanation: 'When the antecedent is the object of the relative clause verb, a resumptive pronoun (ه/ها/هم) is required to resume the reference' },
      { question: 'Choose the correct sentence: "the girls who studied"', options: ['البنات الذي درسن', 'البنات التي درسن', 'البنات اللاتي درسن', 'البنات الذين درسن'], correct: 2, explanation: 'اللاتي (or اللواتي) is the feminine plural relative pronoun: البنات اللاتي درسن' },
    ],
  },
  {
    id: 'passive-voice',
    title: "Passive Voice",
    titleArabic: "المبني للمجهول",
    category: 'verbs',
    difficulty: 3,
    order: 28,
    cefrLevel: 'B1',
    explanation: "Arabic passive voice changes internal vowels rather than adding auxiliary verbs (unlike English 'was written'). Past passive: فُعِلَ (fu'ila). Present passive: يُفعَلُ (yuf'alu). The agent is typically omitted.",
    examples: [
      {arabic: "كُتِبَ الكتاب", english: "the book was written", transliteration: "kutiba al-kitaab"},
      {arabic: "يُدرَّس العلم", english: "science is taught", transliteration: "yudarrasu al-'ilm"},
      {arabic: "فُتِحَ الباب", english: "the door was opened", transliteration: "futiha al-baab"}
    ],
    rules: [
      {rule: "Past passive: change to pattern فُعِلَ", example: "كَتَبَ (wrote) → كُتِبَ (was written)"},
      {rule: "Present passive: change to pattern يُفعَلُ", example: "يَكتُبُ (writes) → يُكتَبُ (is written)"},
      {rule: "The subject becomes نائب الفاعل (deputy subject)", example: "كُتِبَ الدرسُ (the lesson was written — الدرس is nominative)"}
    ],
    exercises: [
      { type: 'translate', prompt: 'the door was opened', answer: 'فُتِحَ الباب', options: ['فُتِحَ الباب', 'فَتَحَ الباب', 'يَفتَح الباب', 'الباب فُتِحَ'] },
      { type: 'fill-blank', prompt: '___ الدرسُ (the lesson was written)', answer: 'كُتِبَ', options: ['كُتِبَ', 'كَتَبَ', 'يُكتَب', 'مكتوب'] },
      { type: 'translate', prompt: 'science is taught (present passive)', answer: 'يُدرَّسُ العلمُ', options: ['يُدرَّسُ العلمُ', 'يُدرِّسُ العلمَ', 'دُرِّسَ العلمُ', 'العلم يُدرِّس'] },
      { type: 'sentence-transformation', prompt: 'Change to passive: أكل الطفلُ التفاحةَ', answer: 'أُكِلَتِ التفاحةُ', hint: 'Past passive: فُعِلَ pattern; subject becomes nominative', options: ['أُكِلَتِ التفاحةُ', 'تُؤكَلُ التفاحةُ', 'أكلت التفاحةُ', 'التفاحة أكلها'] },
      { type: 'sentence-transformation', prompt: 'Change to present passive: يَبنِي العمالُ البيتَ', answer: 'يُبنَى البيتُ', hint: 'Present passive: يُفعَلُ pattern', options: ['يُبنَى البيتُ', 'بُنِيَ البيتُ', 'البيت يُبنَى', 'يَبنِي البيتَ'] },
      { type: 'match', prompt: 'Match active to passive', pairs: [['كَتَبَ', 'كُتِبَ'], ['فَتَحَ', 'فُتِحَ'], ['يَكتُبُ', 'يُكتَبُ'], ['يَفتَحُ', 'يُفتَحُ']] },
      { type: 'true-false', statement: 'Arabic passive voice uses an auxiliary verb like "was/were" in English', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'In Arabic passive, the grammatical subject is called نائب الفاعل', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'كَتَبَ الرسالةُ (the letter was written)', error: 'كَتَبَ', correction: 'كُتِبَتِ', answer: 'كَتَبَ', options: ['كَتَبَ', 'الرسالةُ', 'كلاهما صواب', 'No error'] },
      { type: 'classify', prompt: 'Classify as active or passive verb form', categories: ['Active', 'Passive'], items: [{ text: 'كُتِبَ', category: 'Passive' }, { text: 'كَتَبَ', category: 'Active' }, { text: 'يُقرَأ', category: 'Passive' }, { text: 'يَقرَأ', category: 'Active' }] },
      { type: 'cloze', text: '___ الباب و___ النافذة في الصباح', blanks: [{ answer: 'فُتِحَ', options: ['فُتِحَ', 'فَتَحَ', 'يَفتَح'] }, { answer: 'فُتِحَتْ', options: ['فُتِحَتْ', 'فَتَحَتْ', 'تَفتَح'] }] },
      { type: 'build-sentence', prompt: 'Build: "The message was read"', answer: 'قُرِئَتِ الرسالةُ', options: ['قُرِئَتِ الرسالةُ', 'قَرَأَتِ الرسالةُ', 'الرسالةُ قُرِئَت', 'يُقرَأ الرسالةَ'] },
    ],
    quiz: [
      { question: 'How is the Arabic passive voice formed?', options: ['By adding a word before the verb', 'By changing internal vowels of the verb', 'By using كان + verb', 'By placing the object first'], correct: 1, explanation: 'Arabic passive is formed by changing the internal vowels: past فُعِلَ, present يُفعَلُ — no auxiliary verb needed' },
      { question: 'What is the past passive of كَتَبَ?', options: ['يُكتَبُ', 'كُتِبَ', 'مكتوب', 'اكتتب'], correct: 1, explanation: 'كُتِبَ (kutiba) is the past passive of كَتَبَ, following the فُعِلَ pattern' },
      { question: 'What is نائب الفاعل?', options: ['The verb in passive voice', 'The agent of the action', 'The grammatical subject in a passive sentence', 'The object pronoun'], correct: 2, explanation: 'نائب الفاعل (deputy subject/doer) is the noun that becomes the grammatical subject in a passive sentence' },
      { question: 'What is the present passive of يَكتُبُ?', options: ['كُتِبَ', 'مكتوب', 'يُكتَبُ', 'اكتتب'], correct: 2, explanation: 'يُكتَبُ (yuktabu) is the present passive of يَكتُبُ, following the يُفعَلُ pattern' },
    ],
  },
  {
    id: 'verbal-nouns',
    title: "Verbal Nouns (المصدر)",
    titleArabic: "المصدر",
    category: 'nouns',
    difficulty: 3,
    order: 29,
    cefrLevel: 'B1',
    explanation: "Every Arabic verb has a verbal noun (مصدر) — the abstract concept of the action. Form I has many patterns (unpredictable), but Forms II-X follow fixed patterns. Mastering verbal nouns unlocks vast vocabulary because each root generates multiple masdar forms.",
    examples: [
      {arabic: "كتابة", english: "writing (masdar of كتب)", transliteration: "kitaaba"},
      {arabic: "تعليم", english: "teaching (masdar of علّم, Form II)", transliteration: "ta'liim"},
      {arabic: "استخدام", english: "usage (masdar of استخدم, Form X)", transliteration: "istikhdaam"}
    ],
    rules: [
      {rule: "Form II masdar: تَفْعِيل", example: "علّم → تعليم (teaching)"},
      {rule: "Form III masdar: مُفاعَلة or فِعال", example: "قاتل → مقاتلة/قتال (fighting)"},
      {rule: "Form X masdar: اِستِفعال", example: "استخدم → استخدام (usage)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ اللغة العربية ممتع (studying Arabic is fun)', answer: 'دراسة', options: ['دراسة', 'درس', 'يدرس', 'مدرسة'] },
      { type: 'translate', prompt: 'masdar (verbal noun) of كَتَبَ (to write)', answer: 'كتابة', options: ['كتابة', 'كاتب', 'مكتوب', 'كتب'] },
      { type: 'fill-blank', prompt: 'التعليمُ مهمٌّ — ___ is the masdar of which form?', answer: 'Form II', options: ['Form II', 'Form III', 'Form X', 'Form I'] },
      { type: 'translate', prompt: 'usage / employment (masdar of Form X)', answer: 'استخدام', options: ['استخدام', 'استخدم', 'خدمة', 'تخادم'] },
      { type: 'match', prompt: 'Match masdar to verb', pairs: [['كتابة', 'كتب (I)'], ['تعليم', 'علّم (II)'], ['مقاتلة', 'قاتل (III)'], ['استخدام', 'استخدم (X)']] },
      { type: 'sentence-transformation', prompt: 'Replace the verb with its masdar: هو يسافر مفيد', answer: 'السفر مفيد', hint: 'Use the masdar as subject of the sentence', options: ['السفر مفيد', 'يسافر مفيد', 'مسافر مفيد', 'سافر مفيد'] },
      { type: 'true-false', statement: 'Every Arabic verb has a verbal noun (مصدر)', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The Form II masdar pattern is اِستِفعال', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'أحب تعلّم اللغات (I love learning languages — is تعلّم correct as masdar here?)', error: 'لا، يجب التعلّم', correction: 'التعلّم أو تعلُّم', answer: 'لا، يجب التعلّم', options: ['نعم، صحيح', 'لا، يجب التعلّم', 'يجب تعليم', 'يجب تعلّمة'] },
      { type: 'classify', prompt: 'Classify masdar by form', categories: ['Form II (تَفعيل)', 'Form III (مُفاعَلة)', 'Form X (اِستِفعال)'], items: [{ text: 'تدريس', category: 'Form II (تَفعيل)' }, { text: 'مكاتبة', category: 'Form III (مُفاعَلة)' }, { text: 'استقبال', category: 'Form X (اِستِفعال)' }, { text: 'تعليم', category: 'Form II (تَفعيل)' }] },
      { type: 'cloze', text: '___ مهمٌّ في الحياة، و___ اللغات يفيد كثيرًا', blanks: [{ answer: 'التعلّم', options: ['التعلّم', 'يتعلّم', 'تعلّم'] }, { answer: 'دراسة', options: ['دراسة', 'يدرس', 'مدرسة'] }] },
      { type: 'build-sentence', prompt: 'Build: "Reading is a good habit"', answer: 'القراءة عادة جيدة', options: ['القراءة عادة جيدة', 'يقرأ عادة جيدة', 'قراءة جيدة', 'القارئ عادة جيدة'] },
    ],
    quiz: [
      { question: 'What is the masdar (verbal noun) of كَتَبَ?', options: ['كاتب', 'مكتوب', 'كتابة', 'كتب'], correct: 2, explanation: 'كتابة (kitaaba) is the Form I masdar of كَتَبَ (to write), meaning "writing"' },
      { question: 'What is the Form II masdar pattern?', options: ['فِعَال', 'تَفْعِيل', 'اِستِفعال', 'مَفعَلة'], correct: 1, explanation: 'Form II masdar follows تَفْعِيل: علّم → تعليم (teaching), درّس → تدريس (instruction)' },
      { question: 'The masdar can function as:', options: ['Only a verb', 'Only a noun', 'A noun or verbal complement', 'Only an adjective'], correct: 2, explanation: 'The masdar can function as the subject, object, or verbal complement in a sentence, serving as a noun' },
      { question: 'What is the Form X masdar of استخدم?', options: ['استخدام', 'خادم', 'خدمة', 'مخدوم'], correct: 0, explanation: 'استخدام follows the اِستِفعال pattern — the Form X masdar' },
    ],
  },
  {
    id: 'object-pronouns',
    title: "Object Pronouns",
    titleArabic: "ضمائر المفعول به",
    category: 'verbs',
    difficulty: 3,
    order: 30,
    cefrLevel: 'B1',
    explanation: "Object pronouns in Arabic attach as suffixes to verbs, just as possessive pronouns attach to nouns. The same suffix forms are used: ـني (me), ـك (you masc.), ـكِ (you fem.), ـه (him/it), ـها (her), ـنا (us), ـكم (you pl.), ـهم (them).",
    examples: [
      {arabic: "رآني", english: "he saw me", transliteration: "ra'aani"},
      {arabic: "أحبّه", english: "I love him", transliteration: "uhibbuhu"},
      {arabic: "ساعدناهم", english: "we helped them", transliteration: "saa'adnaahum"},
      {arabic: "كتبتُها", english: "I wrote it (fem.)", transliteration: "katabtuha"}
    ],
    rules: [
      {rule: "Object pronoun suffixes attach to verb directly", example: "رأى + ه = رآه (he saw him)"},
      {rule: "Same suffix set as possessive pronouns", example: "ـني (me), ـه (him), ـها (her), ـنا (us)"},
      {rule: "Two objects: pronoun before noun", example: "أعطاني الكتابَ (he gave me the book)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'رأيتُ___ في السوق (I saw him in the market)', answer: 'ه', options: ['ه', 'ها', 'هم', 'ني'] },
      { type: 'translate', prompt: 'she loves them', answer: 'تحبّهم', options: ['تحبّهم', 'تحبّه', 'تحبّها', 'يحبّهم'] },
      { type: 'fill-blank', prompt: 'ساعد___ الأستاذُ (the teacher helped us)', answer: 'نا', options: ['نا', 'ني', 'كم', 'هم'] },
      { type: 'translate', prompt: 'I wrote it (masc.)', answer: 'كتبتُه', options: ['كتبتُه', 'كتبتُها', 'كتبتُهم', 'كتبتُني'] },
      { type: 'match', prompt: 'Match suffix to meaning', pairs: [['ـني', 'me'], ['ـه', 'him'], ['ـها', 'her'], ['ـنا', 'us']] },
      { type: 'sentence-transformation', prompt: 'Replace noun with pronoun: رأيتُ الولدَ', answer: 'رأيتُه', hint: 'Use ـه for masculine singular object', options: ['رأيتُه', 'رآني', 'رأيتُها', 'رأيتُهم'] },
      { type: 'true-false', statement: 'Object pronoun suffixes in Arabic are different from possessive suffixes', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'ـني means "me" as an object suffix', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'أعطيتُ هو الكتاب (I gave him the book)', error: 'هو', correction: 'ه (أعطيتُه الكتابَ)', answer: 'هو', options: ['أعطيتُ', 'هو', 'الكتاب', 'No error'] },
      { type: 'classify', prompt: 'Classify the object suffix by person', categories: ['1st person', '2nd person', '3rd person'], items: [{ text: 'رأيتُني', category: '1st person' }, { text: 'رأيتُك', category: '2nd person' }, { text: 'رأيتُه', category: '3rd person' }, { text: 'رأيتُنا', category: '1st person' }] },
      { type: 'cloze', text: 'أحبّ___ كثيرًا وأساعد___ دائمًا', blanks: [{ answer: 'ك', options: ['ك', 'ه', 'ني'] }, { answer: 'ك', options: ['ك', 'ه', 'هم'] }] },
      { type: 'build-sentence', prompt: 'Build: "She helped us"', answer: 'ساعدتنا', options: ['ساعدتنا', 'ساعدناها', 'ساعدتهم', 'ساعدتني'] },
    ],
    quiz: [
      { question: 'How do you say "I saw her" in Arabic?', options: ['رأيتُه', 'رأيتُها', 'رأتني', 'رآها'], correct: 1, explanation: 'رأيتُها = رأيتُ + ها (I saw + her)' },
      { question: 'What suffix means "me" as an object?', options: ['ـي', 'ـني', 'ـنا', 'ـك'], correct: 1, explanation: 'ـني (nii) is the object suffix for "me": ساعدني (he helped me)' },
      { question: 'Which is correct for "we helped them"?', options: ['ساعدناهم', 'ساعدهمنا', 'نساعدهم', 'ساعدنا هم'], correct: 0, explanation: 'ساعدناهم = ساعدنا (we helped) + هم (them) — suffix attaches directly to verb' },
      { question: 'Object pronoun suffixes in Arabic are:', options: ['Different from possessive suffixes', 'The same as possessive suffixes', 'Always placed before the verb', 'Only used with past tense verbs'], correct: 1, explanation: 'The same suffix forms serve as both possessive pronouns (on nouns) and object pronouns (on verbs)' },
    ],
  },
  {
    id: 'adverbs-time-place',
    title: "Adverbs of Time & Place",
    titleArabic: "ظروف الزمان والمكان",
    category: 'nouns',
    difficulty: 3,
    order: 31,
    cefrLevel: 'B1',
    explanation: "Arabic adverbs of time (ظروف الزمان) and place (ظروف المكان) modify verbs and sentences. Time: أمس (yesterday), اليوم (today), غدًا (tomorrow), الآن (now), دائمًا (always), أحيانًا (sometimes). Place: هنا (here), هناك (there), فوق (above), تحت (below), أمام (in front), خلف (behind).",
    examples: [
      {arabic: "ذهبتُ أمسِ إلى السوق", english: "I went to the market yesterday", transliteration: "dhahabtu amsi ila as-suuq"},
      {arabic: "الكتاب فوق الطاولة", english: "the book is above the table", transliteration: "al-kitaab fawqa at-taawila"},
      {arabic: "هو دائمًا مشغول", english: "he is always busy", transliteration: "huwa daa'iman mashghul"},
      {arabic: "انتظرني هنا", english: "wait for me here", transliteration: "intazhirnii huna"}
    ],
    rules: [
      {rule: "Time adverbs usually come at start or end of sentence", example: "أمسِ ذهبتُ / ذهبتُ أمسِ"},
      {rule: "Place adverbs usually follow the noun or verb they modify", example: "الكتاب فوق الطاولة"},
      {rule: "Many adverbs are originally nouns in accusative (ظرف منصوب)", example: "صباحًا (in the morning), ليلًا (at night)"}
    ],
    exercises: [
      { type: 'translate', prompt: 'yesterday', answer: 'أمس', options: ['أمس', 'اليوم', 'غدًا', 'الآن'] },
      { type: 'translate', prompt: 'above / on top of', answer: 'فوق', options: ['فوق', 'تحت', 'أمام', 'خلف'] },
      { type: 'fill-blank', prompt: 'الكتاب ___ الطاولة (the book is on the table)', answer: 'فوق', options: ['فوق', 'تحت', 'أمام', 'هنا'] },
      { type: 'fill-blank', prompt: '___ ذهبتُ إلى المدرسة (I went to school today)', answer: 'اليوم', options: ['اليوم', 'أمس', 'غدًا', 'دائمًا'] },
      { type: 'match', prompt: 'Match Arabic adverbs to English', pairs: [['أمس', 'yesterday'], ['غدًا', 'tomorrow'], ['هناك', 'there'], ['دائمًا', 'always']] },
      { type: 'sentence-transformation', prompt: 'Add "always" to: هو مشغول', answer: 'هو دائمًا مشغول', hint: 'Place frequency adverbs before the predicate', options: ['هو دائمًا مشغول', 'دائمًا هو مشغول', 'هو مشغول دائمًا فقط', 'هو مشغول لا دائمًا'] },
      { type: 'true-false', statement: 'أمام means "behind" in Arabic', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'Many Arabic adverbs are nouns in the accusative case', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'الكتاب وراء الطاولة فوق (the book is in front of the table)', error: 'وراء', correction: 'أمام', answer: 'وراء', options: ['الكتاب', 'وراء', 'الطاولة', 'No error'] },
      { type: 'classify', prompt: 'Classify as time or place adverb', categories: ['Time (ظرف زمان)', 'Place (ظرف مكان)'], items: [{ text: 'أمس', category: 'Time (ظرف زمان)' }, { text: 'هنا', category: 'Place (ظرف مكان)' }, { text: 'غدًا', category: 'Time (ظرف زمان)' }, { text: 'فوق', category: 'Place (ظرف مكان)' }] },
      { type: 'cloze', text: 'وضعتُ الكتاب ___ الطاولة ___ الصباح', blanks: [{ answer: 'فوق', options: ['فوق', 'تحت', 'أمام'] }, { answer: 'صباح', options: ['صباح', 'أمس', 'الآن'] }] },
      { type: 'build-sentence', prompt: 'Build: "He always studies in the morning"', answer: 'هو دائمًا يدرس صباحًا', options: ['هو دائمًا يدرس صباحًا', 'دائمًا هو صباحًا يدرس', 'يدرس هو دائمًا في صباح', 'هو يدرس صباح دائمًا'] },
    ],
    quiz: [
      { question: 'What does أمام mean?', options: ['Behind', 'Above', 'In front of', 'Below'], correct: 2, explanation: 'أمام (amaama) means "in front of" or "before" — a place adverb' },
      { question: 'Which is a time adverb?', options: ['فوق', 'هنا', 'خلف', 'غدًا'], correct: 3, explanation: 'غدًا (ghadan) means "tomorrow" — a time adverb (ظرف زمان)' },
      { question: 'Where do time adverbs typically appear in an Arabic sentence?', options: ['Only at the very beginning', 'Only at the very end', 'At the beginning or end of the sentence', 'Always in the middle'], correct: 2, explanation: 'Time adverbs are flexible: ذهبتُ أمسِ or أمسِ ذهبتُ are both correct' },
      { question: 'What grammatical case are many Arabic adverbs?', options: ['Nominative', 'Accusative', 'Genitive', 'They have no case'], correct: 1, explanation: 'Many Arabic adverbs are nouns in the accusative case (ظرف منصوب): صباحًا, ليلًا, كثيرًا' },
    ],
  },
  {
    id: 'conjunctions',
    title: "Conjunctions & Connectors",
    titleArabic: "أدوات الربط",
    category: 'basics',
    difficulty: 3,
    order: 32,
    cefrLevel: 'B1',
    explanation: "Arabic conjunctions connect clauses and sentences. Coordinating: و (and), أو (or), لكن/لكنّ (but), ثم (then), بل (rather/on the contrary), فـ (so/then). Subordinating: لأن (because), حتى (until/so that), إذا (if), عندما (when), بينما (while).",
    examples: [
      {arabic: "ذهبتُ إلى السوق ثم عدتُ", english: "I went to the market then returned", transliteration: "dhahabtu ila as-suuq thumma 'udtu"},
      {arabic: "هو غني لكنّه بخيل", english: "he is rich but miserly", transliteration: "huwa ghaniyyun laakinnahu bakhiil"},
      {arabic: "درستُ لأنني أحب العلم", english: "I studied because I love knowledge", transliteration: "darastu li'annanii uhibbu al-'ilm"},
      {arabic: "بل هو أذكى منك", english: "rather, he is smarter than you", transliteration: "bal huwa adhkaa minka"}
    ],
    rules: [
      {rule: "و (and) connects equal elements", example: "ذهبتُ وعدتُ (I went and returned)"},
      {rule: "لكن/لكنّ (but) shows contrast; لكنّ takes accusative subject", example: "هو ذكي لكنّه كسول"},
      {rule: "بل replaces/corrects the previous clause", example: "ليس طالبًا بل معلمٌ (not a student but rather a teacher)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'ذهبتُ إلى السوق ___ عدتُ (I went then returned)', answer: 'ثم', options: ['ثم', 'و', 'لكن', 'أو'] },
      { type: 'translate', prompt: 'but / however', answer: 'لكن', options: ['لكن', 'ثم', 'بل', 'أو'] },
      { type: 'fill-blank', prompt: 'هو غني ___ بخيل (he is rich but miserly)', answer: 'لكنّه', options: ['لكنّه', 'وهو', 'ثمّه', 'بله'] },
      { type: 'translate', prompt: 'because', answer: 'لأن', options: ['لأن', 'حتى', 'إذا', 'بينما'] },
      { type: 'match', prompt: 'Match conjunction to meaning', pairs: [['و', 'and'], ['أو', 'or'], ['لكن', 'but'], ['ثم', 'then']] },
      { type: 'sentence-transformation', prompt: 'Join using "because": درستُ. أحب العلم.', answer: 'درستُ لأنني أحب العلم', hint: 'لأن introduces a reason clause', options: ['درستُ لأنني أحب العلم', 'درستُ وأحب العلم', 'لأن أحب العلم درستُ', 'درستُ حتى أحب العلم'] },
      { type: 'true-false', statement: 'بل is used to correct or replace the previous statement', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'و and ثم both mean "and" with no difference', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'ليس طالبًا بل معلمًا (he is not a student but a teacher)', error: 'معلمًا', correction: 'معلمٌ', answer: 'معلمًا', options: ['ليس', 'بل', 'معلمًا', 'No error'] },
      { type: 'classify', prompt: 'Classify as coordinating or subordinating conjunction', categories: ['Coordinating', 'Subordinating'], items: [{ text: 'و', category: 'Coordinating' }, { text: 'لأن', category: 'Subordinating' }, { text: 'أو', category: 'Coordinating' }, { text: 'عندما', category: 'Subordinating' }] },
      { type: 'cloze', text: 'ذهبتُ إلى المكتبة ___ اشتريتُ كتابًا ___ بدأتُ القراءة', blanks: [{ answer: 'و', options: ['و', 'أو', 'لكن'] }, { answer: 'ثم', options: ['ثم', 'بل', 'أو'] }] },
      { type: 'build-sentence', prompt: 'Build: "He studied but did not pass"', answer: 'درس لكنّه لم ينجح', options: ['درس لكنّه لم ينجح', 'درس وهو لم ينجح', 'لكن درس لم ينجح', 'درس ثم لم ينجح'] },
    ],
    quiz: [
      { question: 'What does ثم mean?', options: ['And', 'But', 'Then (with a gap in time)', 'Or'], correct: 2, explanation: 'ثم (thumma) means "then" implying a sequence or gap in time — stronger than و' },
      { question: 'Which conjunction corrects or replaces the previous statement?', options: ['و', 'أو', 'بل', 'ثم'], correct: 2, explanation: 'بل (bal) means "rather" or "on the contrary" — it corrects what was said before' },
      { question: 'How do you say "because" in Arabic?', options: ['حتى', 'بينما', 'لأن', 'إذا'], correct: 2, explanation: 'لأن (li-anna) introduces a reason clause meaning "because"' },
      { question: 'What is the difference between و and ثم?', options: ['They are identical', 'ثم implies a time gap between events', 'و implies contrast', 'ثم is only used with verbs'], correct: 1, explanation: 'و connects elements simultaneously or quickly; ثم implies a sequence with a time interval between events' },
    ],
  },
  {
    id: 'exception-illa',
    title: "Exception (إلا)",
    titleArabic: "الاستثناء",
    category: 'nouns',
    difficulty: 3,
    order: 33,
    cefrLevel: 'B1',
    explanation: "The exception particle إلا (illaa) means 'except'. The excepted noun (المستثنى) takes accusative case after إلا in a positive sentence. After a negative, it matches the case of what it would have been. Other exception particles: غير (other than), سوى (other than), عدا/خلا/حاشا (except).",
    examples: [
      {arabic: "جاء الطلابُ إلا محمدًا", english: "the students came except Muhammad", transliteration: "jaa'a at-tullaab illaa Muhammadan"},
      {arabic: "ما جاء إلا محمدٌ", english: "none came except Muhammad", transliteration: "maa jaa'a illaa Muhammadun"},
      {arabic: "لا إله إلا الله", english: "there is no god except Allah", transliteration: "laa ilaaha illaa Allah"}
    ],
    rules: [
      {rule: "After positive sentence: المستثنى is accusative", example: "جاء الجميعُ إلا عليًّا (Ali is accusative)"},
      {rule: "After negative: المستثنى matches the grammatical role it would have", example: "ما جاء إلا عليٌّ (Ali is nominative — he's the subject)"},
      {rule: "غير and سوى also mean 'except/other than'", example: "ما جاء غيرُ علي"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'جاء الطلابُ إلا ___ (everyone came except Ali — accusative)', answer: 'عليًّا', options: ['عليًّا', 'عليٌّ', 'عليًّ', 'علي'] },
      { type: 'translate', prompt: 'except / only', answer: 'إلا', options: ['إلا', 'بل', 'لكن', 'حتى'] },
      { type: 'fill-blank', prompt: 'ما أكل أحدٌ ___ خالدٌ (no one ate except Khalid)', answer: 'إلا', options: ['إلا', 'غير', 'سوى', 'حتى'] },
      { type: 'translate', prompt: '"there is no god except Allah"', answer: 'لا إله إلا الله', options: ['لا إله إلا الله', 'لا إله ولا الله', 'ليس إله إلا الله', 'لا إله غير الله'] },
      { type: 'match', prompt: 'Match exception particle to meaning', pairs: [['إلا', 'except (main particle)'], ['غير', 'other than'], ['سوى', 'other than (equivalent)'], ['عدا', 'except (verb-origin)']] },
      { type: 'sentence-transformation', prompt: 'Make negative exception: جاء الجميعُ إلا عليًّا', answer: 'ما جاء إلا عليٌّ', hint: 'In negative sentences, المستثنى takes the role it would normally have', options: ['ما جاء إلا عليٌّ', 'ما جاء إلا عليًّا', 'لم يجئ إلا عليًّ', 'ما جاء غير عليًّا'] },
      { type: 'true-false', statement: 'After a positive sentence, the excepted noun (المستثنى) is in the accusative case', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'إلا and بل have the same meaning', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'جاء الجميعُ إلا عليٌّ (positive sentence)', error: 'عليٌّ', correction: 'عليًّا', answer: 'عليٌّ', options: ['جاء', 'الجميعُ', 'عليٌّ', 'No error'] },
      { type: 'classify', prompt: 'Classify: does the exception take accusative or depends on context?', categories: ['Always accusative (positive sentence)', 'Matches grammatical role (negative sentence)'], items: [{ text: 'جاء القومُ إلا زيدًا', category: 'Always accusative (positive sentence)' }, { text: 'ما جاء إلا زيدٌ', category: 'Matches grammatical role (negative sentence)' }, { text: 'أكل الجميعُ إلا أختي', category: 'Always accusative (positive sentence)' }, { text: 'لم يأكل إلا أختي', category: 'Matches grammatical role (negative sentence)' }] },
      { type: 'multiple-select', prompt: 'Select all particles that mean "except/other than":', correctAnswers: ['إلا', 'غير', 'سوى'], options: ['إلا', 'غير', 'سوى', 'بل', 'لكن'], answer: 'إلا,غير,سوى' },
      { type: 'build-sentence', prompt: 'Build: "All came except Fatima"', answer: 'جاء الجميعُ إلا فاطمةَ', options: ['جاء الجميعُ إلا فاطمةَ', 'جاء الجميعُ إلا فاطمةٌ', 'إلا فاطمةَ جاء الجميعُ', 'جاء الجميع ما إلا فاطمة'] },
    ],
    quiz: [
      { question: 'What case does المستثنى (excepted noun) take after إلا in a positive sentence?', options: ['Nominative', 'Accusative', 'Genitive', 'It depends on the verb'], correct: 1, explanation: 'In a positive sentence, the excepted noun after إلا is always in the accusative case: جاء الجميعُ إلا محمدًا' },
      { question: 'Which sentence uses إلا correctly?', options: ['جاء إلا محمدٌ', 'جاء الجميعُ إلا محمدًا', 'إلا محمدٌ جاء', 'جاء الجميعُ من إلا محمدًا'], correct: 1, explanation: 'جاء الجميعُ إلا محمدًا — positive exception, محمدًا is accusative' },
      { question: 'In "ما جاء إلا محمدٌ", why is محمدٌ nominative?', options: ['It is always nominative after إلا', 'The sentence is positive', 'After negative + إلا, the word takes the role it would have without إلا (here: subject)', 'إلا requires nominative'], correct: 2, explanation: 'After a negative sentence, the excepted noun takes whatever grammatical role it would have without إلا — here it is the subject, so nominative' },
      { question: 'What does غير mean in the exception context?', options: ['Except (particle only)', 'Other than / except', 'And', 'But'], correct: 1, explanation: 'غير (ghayr) means "other than" or "except" and can substitute for إلا in exception constructions' },
    ],
  },
  {
    id: 'emphasis-inna',
    title: "Emphasis Particles (إنّ)",
    titleArabic: "إنّ وأخواتها",
    category: 'basics',
    difficulty: 3,
    order: 34,
    cefrLevel: 'B1',
    explanation: "إنّ and its sisters (أنّ, لكنّ, كأنّ, ليت, لعلّ) are emphasis particles that put the subject (اسم إنّ) in the accusative case. إنّ = indeed/verily; أنّ = that (subordinate); لكنّ = but; كأنّ = as if; ليت = would that; لعلّ = perhaps.",
    examples: [
      {arabic: "إنّ العلمَ نورٌ", english: "Indeed, knowledge is light", transliteration: "inna al-'ilma nuurun"},
      {arabic: "أعلمُ أنّ الحقَّ واضحٌ", english: "I know that truth is clear", transliteration: "a'lamu anna al-haqqa waadhihun"},
      {arabic: "كأنّ القمرَ شمعةٌ", english: "as if the moon were a candle", transliteration: "ka'anna al-qamara sham'atun"},
      {arabic: "ليتَ الشبابَ يعود", english: "would that youth would return", transliteration: "layta ash-shabaaba ya'uud"}
    ],
    rules: [
      {rule: "إنّ وأخواتها put اسمها in accusative (منصوب)", example: "إنّ الطالبَ مجتهدٌ (الطالب is accusative)"},
      {rule: "The predicate (خبر) remains nominative", example: "إنّ المعلمَ ماهرٌ — ماهر stays nominative"},
      {rule: "أنّ follows verbs of saying/knowing", example: "علمتُ أنّ الحقَّ واضحٌ"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'إنّ ___ نورٌ (Indeed knowledge is light)', answer: 'العلمَ', options: ['العلمَ', 'العلمُ', 'العلمِ', 'علم'] },
      { type: 'translate', prompt: '"indeed / verily" (emphasis particle)', answer: 'إنّ', options: ['إنّ', 'أنّ', 'لكنّ', 'كأنّ'] },
      { type: 'fill-blank', prompt: '___ الصدقَ منجاةٌ (Indeed honesty is salvation)', answer: 'إنّ', options: ['إنّ', 'أنّ', 'ليت', 'لعلّ'] },
      { type: 'translate', prompt: '"as if" (comparison particle)', answer: 'كأنّ', options: ['كأنّ', 'إنّ', 'ليت', 'لعلّ'] },
      { type: 'match', prompt: 'Match particle to meaning', pairs: [['إنّ', 'indeed/verily'], ['ليت', 'would that (wish)'], ['لعلّ', 'perhaps/maybe'], ['كأنّ', 'as if']] },
      { type: 'sentence-transformation', prompt: 'Add إنّ for emphasis: الطالبُ مجتهدٌ', answer: 'إنّ الطالبَ مجتهدٌ', hint: 'إنّ puts its noun in accusative', options: ['إنّ الطالبَ مجتهدٌ', 'إنّ الطالبُ مجتهدٌ', 'إنّ الطالبِ مجتهدٌ', 'أنّ الطالبَ مجتهدٌ'] },
      { type: 'true-false', statement: 'إنّ puts its subject (اسمها) in the accusative case', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'ليت expresses certainty about a future event', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'إنّ المعلمُ ماهرٌ (the teacher is indeed skilled)', error: 'المعلمُ', correction: 'المعلمَ', answer: 'المعلمُ', options: ['إنّ', 'المعلمُ', 'ماهرٌ', 'No error'] },
      { type: 'classify', prompt: 'Classify إنّ sisters by function', categories: ['Emphasis (إنّ/أنّ)', 'Wish (ليت)', 'Comparison (كأنّ)', 'Hope/Possibility (لعلّ)'], items: [{ text: 'إنّ', category: 'Emphasis (إنّ/أنّ)' }, { text: 'ليت', category: 'Wish (ليت)' }, { text: 'كأنّ', category: 'Comparison (كأنّ)' }, { text: 'لعلّ', category: 'Hope/Possibility (لعلّ)' }] },
      { type: 'cloze', text: '___ العلمَ نورٌ و___ الجهلَ ظلامٌ', blanks: [{ answer: 'إنّ', options: ['إنّ', 'أنّ', 'كأنّ'] }, { answer: 'إنّ', options: ['إنّ', 'ليت', 'لعلّ'] }] },
      { type: 'build-sentence', prompt: 'Build: "Perhaps the weather is good"', answer: 'لعلّ الطقسَ جميلٌ', options: ['لعلّ الطقسَ جميلٌ', 'لعلّ الطقسُ جميلٌ', 'ليت الطقسَ جميلٌ', 'إنّ الطقسَ جميلٌ'] },
    ],
    quiz: [
      { question: 'What grammatical case does إنّ assign to its subject (اسمها)?', options: ['Nominative', 'Accusative', 'Genitive', 'No change'], correct: 1, explanation: 'إنّ and all its sisters (أنّ, لكنّ, كأنّ, ليت, لعلّ) put their subject in the accusative (منصوب) case' },
      { question: 'Which particle expresses a wish or longing?', options: ['إنّ', 'أنّ', 'ليت', 'لعلّ'], correct: 2, explanation: 'ليت (layta) expresses a wish or longing: ليتَ الشبابَ يعود (would that youth would return)' },
      { question: 'When is أنّ (not إنّ) typically used?', options: ['At the start of a sentence', 'After verbs of saying, knowing, or thinking', 'Only in Classical Arabic', 'After negation'], correct: 1, explanation: 'أنّ (anna) is used as a subordinating "that" after verbs of saying/knowing/thinking: علمتُ أنّ الأمرَ صعبٌ' },
      { question: 'What does لعلّ express?', options: ['Certainty', 'Wish', 'Comparison', 'Hope or possibility'], correct: 3, explanation: 'لعلّ (la-alla) expresses hope or possibility — similar to "perhaps" or "hopefully"' },
    ],
  },
  {
    id: 'hal-clause',
    title: "Hal Clause (الحال)",
    titleArabic: "الحال",
    category: 'nouns',
    difficulty: 3,
    order: 35,
    cefrLevel: 'B1',
    explanation: "The hal (حال) describes the state or condition of the subject or object during an action. It answers 'how?' and is always in the accusative case (منصوب), indefinite. It can be a single adjective or a complete clause introduced by و.",
    examples: [
      {arabic: "جاء الطالبُ مسرورًا", english: "the student came happy", transliteration: "jaa'a at-taalib masruuiran"},
      {arabic: "رأيتُه يبكي", english: "I saw him crying", transliteration: "ra'aytuhu yabki"},
      {arabic: "دخلتُ والبابُ مفتوحٌ", english: "I entered while the door was open", transliteration: "dakhaltu wa-l-baabu maftuuhun"}
    ],
    rules: [
      {rule: "Single-word hal: accusative (ـًا on masc.)", example: "جاء مسرورًا (came happy)"},
      {rule: "Hal clause with و: subject takes nominative", example: "دخلتُ والبابُ مفتوحٌ"},
      {rule: "Hal can also be a verb phrase", example: "رأيتُه يبكي (I saw him crying — يبكي is the hal)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'جاء الطالبُ ___ (the student came happy)', answer: 'مسرورًا', options: ['مسرورًا', 'مسرورٌ', 'مسرورِ', 'مسرور'] },
      { type: 'translate', prompt: '"She left sad" (use hal)', answer: 'غادرت حزينةً', options: ['غادرت حزينةً', 'غادرت حزينةٌ', 'غادرت وهي حزينةٌ', 'حزينة غادرت'] },
      { type: 'fill-blank', prompt: 'رأيتُ الرجلَ ___ (I saw the man running)', answer: 'يجري', options: ['يجري', 'جاريًا', 'مجري', 'راكضٌ'] },
      { type: 'sentence-transformation', prompt: 'Add a hal to: جلستُ. (I was relaxed while sitting.)', answer: 'جلستُ مرتاحًا', hint: 'hal adjective agrees with subject, accusative indefinite', options: ['جلستُ مرتاحًا', 'جلستُ مرتاحٌ', 'جلستُ ومرتاحًا', 'مرتاحًا جلستُ'] },
      { type: 'match', prompt: 'Match sentence to hal type', pairs: [['جاء مسرورًا', 'single-word hal (adj.)'], ['رأيتُه يبكي', 'hal as verb phrase'], ['دخلتُ والبابُ مفتوحٌ', 'hal clause with و'], ['كتبتُ واقفًا', 'single-word hal (adj.)']] },
      { type: 'true-false', statement: 'The hal (circumstantial) is always in the nominative case', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The hal answers the question "how?" about the state during an action', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'وصل الضيفُ متعبٌ (the guest arrived tired)', error: 'متعبٌ', correction: 'متعبًا', answer: 'متعبٌ', options: ['وصل', 'الضيفُ', 'متعبٌ', 'No error'] },
      { type: 'classify', prompt: 'Classify the hal type in each sentence', categories: ['Single-word hal', 'Hal clause with و', 'Verbal hal'], items: [{ text: 'ذهب فرحانًا', category: 'Single-word hal' }, { text: 'عاد والقمرُ يسطع', category: 'Hal clause with و' }, { text: 'وجدتُها تنتظر', category: 'Verbal hal' }, { text: 'نام مطمئنًا', category: 'Single-word hal' }] },
      { type: 'cloze', text: 'جاء الولد ___ وهو ___ في يده', blanks: [{ answer: 'مسرورًا', options: ['مسرورًا', 'مسرورٌ', 'مسرور'] }, { answer: 'كتابٌ', options: ['كتابٌ', 'كتابًا', 'كتاب'] }] },
      { type: 'multiple-select', prompt: 'Select all sentences that have a correct hal:', correctAnswers: ['جاء مسرورًا', 'ذهبت حزينةً'], options: ['جاء مسرورًا', 'جاء مسرورٌ', 'ذهبت حزينةً', 'ذهبت حزينةٌ'], answer: 'جاء مسرورًا,ذهبت حزينةً' },
      { type: 'build-sentence', prompt: 'Build: "He entered the room smiling"', answer: 'دخل الغرفة مبتسمًا', options: ['دخل الغرفة مبتسمًا', 'دخل الغرفة مبتسمٌ', 'مبتسمًا دخل الغرفة', 'دخل مبتسمٌ الغرفة'] },
    ],
    quiz: [
      { question: 'What grammatical case is the hal always in?', options: ['Nominative', 'Accusative', 'Genitive', 'It varies'], correct: 1, explanation: 'The hal (حال) is always in the accusative (منصوب) case and is typically indefinite' },
      { question: 'Which sentence has a correct hal?', options: ['جاء مسرورٌ', 'جاء مسرورًا', 'جاء المسرور', 'جاء مسرورِ'], correct: 1, explanation: 'جاء مسرورًا — the hal مسرورًا is accusative (ـًا ending) and indefinite, describing how the subject came' },
      { question: 'What question does the hal answer?', options: ['Why?', 'When?', 'How? (in what state?)', 'Who?'], correct: 2, explanation: 'The hal answers "how?" or "in what state?" — it describes the condition of the subject or object during the action' },
      { question: 'In "دخلتُ والبابُ مفتوحٌ", what type of hal is والبابُ مفتوحٌ?', options: ['Single-word hal', 'Verbal hal', 'Hal clause introduced by و', 'Not a hal'], correct: 2, explanation: 'The و here introduces a hal clause — a complete nominal sentence describing the state while the main action occurred' },
    ],
  },
  {
    id: 'tamyiz',
    title: "Specification (التمييز)",
    titleArabic: "التمييز",
    category: 'nouns',
    difficulty: 3,
    order: 36,
    cefrLevel: 'B1',
    explanation: "Tamyiz (تمييز) specifies what is being measured or compared. It's an indefinite accusative noun that removes ambiguity. Two types: تمييز الذات (after numerals/measurements) and تمييز النسبة (after comparative/superlative or transformed sentences).",
    examples: [
      {arabic: "عندي عشرون كتابًا", english: "I have twenty books", transliteration: "'indii 'ishruuna kitaaban"},
      {arabic: "هو أكبرُ منك سنًّا", english: "he is older than you in age", transliteration: "huwa akbaru minka sinnan"},
      {arabic: "اشتريتُ لترًا حليبًا", english: "I bought a liter of milk", transliteration: "ishtaraytu litran haliiban"}
    ],
    rules: [
      {rule: "Tamyiz is always indefinite and accusative (ـًا)", example: "عشرون طالبًا (20 students) — طالبًا is accusative"},
      {rule: "Numbers 11-99: tamyiz is singular accusative", example: "خمسة عشر طالبًا (15 students)"},
      {rule: "Tamyiz النسبة removes ambiguity from comparative", example: "هو أكثر منك علمًا (he has more knowledge than you)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'عندي عشرون ___ (I have twenty books)', answer: 'كتابًا', options: ['كتابًا', 'كتابٌ', 'كتب', 'كتابِ'] },
      { type: 'translate', prompt: '"he is bigger than you in size" (use tamyiz)', answer: 'هو أكبرُ منك حجمًا', options: ['هو أكبرُ منك حجمًا', 'هو أكبرُ حجمٌ منك', 'هو أكبر من حجمك', 'هو أكبرُ منك الحجم'] },
      { type: 'fill-blank', prompt: 'اشتريتُ كيلوغرامًا ___ (I bought a kilogram of sugar)', answer: 'سكرًا', options: ['سكرًا', 'سكرٌ', 'من السكر', 'سكر'] },
      { type: 'sentence-transformation', prompt: 'Add tamyiz: هو أذكى منك (in terms of mind)', answer: 'هو أذكى منك عقلًا', hint: 'Add tamyiz accusative to specify the dimension', options: ['هو أذكى منك عقلًا', 'هو أذكى منك العقل', 'هو أذكى عقلًا منك', 'هو أذكى منك عقلٌ'] },
      { type: 'match', prompt: 'Match sentence to tamyiz type', pairs: [['عشرون طالبًا', 'تمييز الذات (after numeral)'], ['أكثر منك علمًا', 'تمييز النسبة (after comparative)'], ['لترًا حليبًا', 'تمييز الذات (after measure)'], ['امتلأ قلبُه فرحًا', 'تمييز النسبة (transformed)']] },
      { type: 'true-false', statement: 'Tamyiz is always in the accusative case', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'Tamyiz after numbers 11-99 is plural', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'عندي خمسة عشر طلابٌ (I have 15 students)', error: 'طلابٌ', correction: 'طالبًا', answer: 'طلابٌ', options: ['عندي', 'خمسة عشر', 'طلابٌ', 'No error'] },
      { type: 'classify', prompt: 'Classify tamyiz type', categories: ['تمييز الذات (after numerals/measures)', 'تمييز النسبة (after comparatives)'], items: [{ text: 'ثلاثون كتابًا', category: 'تمييز الذات (after numerals/measures)' }, { text: 'أكبر منك سنًّا', category: 'تمييز النسبة (after comparatives)' }, { text: 'مترًا قماشًا', category: 'تمييز الذات (after numerals/measures)' }, { text: 'امتلأ وجهُه بهجةً', category: 'تمييز النسبة (after comparatives)' }] },
      { type: 'cloze', text: 'عندي خمسة وعشرون ___ وأنا أكثر منك ___', blanks: [{ answer: 'كتابًا', options: ['كتابًا', 'كتابٌ', 'كتب'] }, { answer: 'معرفةً', options: ['معرفةً', 'معرفةٌ', 'المعرفة'] }] },
      { type: 'build-sentence', prompt: 'Build: "I have thirty books"', answer: 'عندي ثلاثون كتابًا', options: ['عندي ثلاثون كتابًا', 'عندي ثلاثون كتابٌ', 'عندي ثلاثون كتب', 'ثلاثون كتابًا عندي'] },
      { type: 'multiple-select', prompt: 'Select sentences with correct tamyiz:', correctAnswers: ['عندي عشرون كتابًا', 'هو أكثر منك علمًا'], options: ['عندي عشرون كتابًا', 'عندي عشرون كتابٌ', 'هو أكثر منك علمًا', 'هو أكثر منك علمٌ'], answer: 'عندي عشرون كتابًا,هو أكثر منك علمًا' },
    ],
    quiz: [
      { question: 'What case is tamyiz always in?', options: ['Nominative', 'Genitive', 'Accusative', 'Construct state'], correct: 2, explanation: 'Tamyiz is always in the accusative (منصوب) case and is indefinite' },
      { question: 'After numbers 11-99, the tamyiz is:', options: ['Plural', 'Dual', 'Singular accusative', 'Singular nominative'], correct: 2, explanation: 'After numbers 11-99, tamyiz is always singular and accusative: خمسة عشر طالبًا (15 students)' },
      { question: 'What does تمييز النسبة do?', options: ['Specifies measurement quantities', 'Removes ambiguity from comparative/superlative sentences', 'Replaces the direct object', 'Describes the subject\'s state'], correct: 1, explanation: 'تمييز النسبة removes ambiguity from comparative sentences: هو أكثر منك علمًا (علمًا specifies the dimension)' },
      { question: 'Which sentence uses tamyiz correctly?', options: ['عندي عشرون الكتب', 'عندي عشرون كتاب', 'عندي عشرون كتابًا', 'عندي عشرون كتابٌ'], correct: 2, explanation: 'عندي عشرون كتابًا — tamyiz كتابًا is indefinite and accusative, singular after 20' },
    ],
  },
  {
    id: 'indirect-object',
    title: "Indirect Object",
    titleArabic: "المفعول به الثاني",
    category: 'verbs',
    difficulty: 3,
    order: 37,
    cefrLevel: 'B1',
    explanation: "Some Arabic verbs take two objects (مفعولان به). These are verbs of giving, showing, teaching, calling, and making (أعطى، أرى، علّم، سمّى، جعل، ظنّ). Both objects are in the accusative case. The first object is usually a person, the second is a thing or predicate.",
    examples: [
      {arabic: "أعطيتُ الطالبَ الكتابَ", english: "I gave the student the book", transliteration: "'a'taytu at-taaliba al-kitaaba"},
      {arabic: "علّمتُه العربيةَ", english: "I taught him Arabic", transliteration: "'allamtuhu al-'arabiyyata"},
      {arabic: "ظننتُك طالبًا", english: "I thought you were a student", transliteration: "zanantu-ka taaliban"}
    ],
    rules: [
      {rule: "Both objects are accusative", example: "أعطى الأبُ الولدَ هديةً (father gave the boy a gift — both accusative)"},
      {rule: "Verbs of 'making/considering' (جعل, ظنّ, رأى, علم) take two accusative objects where 2nd is predicate", example: "جعل الحارسُ البابَ مفتوحًا (made the door open)"},
      {rule: "Pronoun as first object attaches to verb", example: "أعطيتُه الكتابَ (I gave him the book)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'أعطيتُ الطالبَ ___ (I gave the student the book)', answer: 'الكتابَ', options: ['الكتابَ', 'الكتابُ', 'الكتابِ', 'الكتاب'] },
      { type: 'translate', prompt: 'I gave him a gift', answer: 'أعطيتُه هديةً', options: ['أعطيتُه هديةً', 'أعطيتُه هديةٌ', 'أعطيتُ له هدية', 'هديةً أعطيتُه'] },
      { type: 'fill-blank', prompt: 'علّمتُ ___ العربيةَ (I taught the children Arabic)', answer: 'الأطفالَ', options: ['الأطفالَ', 'الأطفالُ', 'الأطفالِ', 'أطفال'] },
      { type: 'sentence-transformation', prompt: 'Replace first object with pronoun: أعطى الأبُ الولدَ الكتابَ', answer: 'أعطاه الأبُ الكتابَ', hint: 'Attach object pronoun to verb for first object', options: ['أعطاه الأبُ الكتابَ', 'أعطاه الأبُ الكتابُ', 'أعطى الأبُ الكتابَ هو', 'له أعطى الأبُ الكتابَ'] },
      { type: 'match', prompt: 'Match verb to example with two objects', pairs: [['أعطى', 'أعطيتُ الولدَ هديةً'], ['علّم', 'علّمتُه الدرسَ'], ['جعل', 'جعلتُ البابَ مفتوحًا'], ['ظنّ', 'ظننتُك أمينًا']] },
      { type: 'true-false', statement: 'Both objects of a double-object verb are in the accusative case', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The indirect object in Arabic always follows the preposition لـ', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'أعطيتُ الطالبَ الكتابُ (I gave the student the book)', error: 'الكتابُ', correction: 'الكتابَ', answer: 'الكتابُ', options: ['أعطيتُ', 'الطالبَ', 'الكتابُ', 'No error'] },
      { type: 'classify', prompt: 'Identify first vs second object', categories: ['First object (person)', 'Second object (thing/predicate)'], items: [{ text: 'الطالبَ in أعطيتُ الطالبَ كتابًا', category: 'First object (person)' }, { text: 'كتابًا in أعطيتُ الطالبَ كتابًا', category: 'Second object (thing/predicate)' }, { text: 'الولدَ in علّمتُ الولدَ الحسابَ', category: 'First object (person)' }, { text: 'الحسابَ in علّمتُ الولدَ الحسابَ', category: 'Second object (thing/predicate)' }] },
      { type: 'cloze', text: 'أعطى المعلمُ ___ ___ ممتازةً', blanks: [{ answer: 'الطالبَ', options: ['الطالبَ', 'الطالبُ', 'الطالب'] }, { answer: 'درجةً', options: ['درجةً', 'درجةٌ', 'الدرجة'] }] },
      { type: 'multiple-select', prompt: 'Select verbs that take two objects:', correctAnswers: ['أعطى', 'علّم', 'ظنّ'], options: ['أعطى', 'علّم', 'ذهب', 'ظنّ', 'نام'], answer: 'أعطى,علّم,ظنّ' },
      { type: 'build-sentence', prompt: 'Build: "The teacher gave the student a reward"', answer: 'أعطى المعلمُ الطالبَ جائزةً', options: ['أعطى المعلمُ الطالبَ جائزةً', 'أعطى المعلمُ جائزةً الطالبَ', 'الطالبَ أعطى المعلمُ جائزةً', 'أعطى المعلمُ الطالبُ جائزةً'] },
    ],
    quiz: [
      { question: 'What case are both objects of a double-object verb in?', options: ['Both nominative', 'Both accusative', 'First accusative, second genitive', 'First genitive, second accusative'], correct: 1, explanation: 'Both objects of double-object verbs (أعطى, علّم, جعل, ظنّ) are in the accusative (منصوب) case' },
      { question: 'Which verb takes two objects?', options: ['ذهب', 'نام', 'أعطى', 'جلس'], correct: 2, explanation: 'أعطى (to give) takes two objects: أعطيتُ الولدَ الكتابَ (I gave the boy the book)' },
      { question: 'How do you say "I taught him Arabic"?', options: ['علّمتُ له العربية', 'علّمتُه العربيةَ', 'علّمتُه في العربية', 'عليه العربيةَ'], correct: 1, explanation: 'علّمتُه العربيةَ — ه is the first object (him, accusative suffix), العربيةَ is the second object (accusative)' },
      { question: 'In "جعل الحارسُ البابَ مفتوحًا", what is مفتوحًا?', options: ['The subject', 'An adverb', 'The second object (predicate)', 'A hal'], correct: 2, explanation: 'مفتوحًا is the second object of جعل — a predicate-type second object that describes the state of the first object البابَ' },
    ],
  },
  {
    id: 'complex-conditionals',
    title: "Complex Conditionals (لو)",
    titleArabic: "الشرط المعقد",
    category: 'verbs',
    difficulty: 4,
    order: 38,
    cefrLevel: 'B2',
    explanation: "لو (law) introduces unreal/impossible conditions (contrary to fact). Unlike إذا (real conditions), لو expresses what would happen IF something were true. The response clause typically uses لـ + past tense verb. Pattern: لو + past verb, لـ + past verb.",
    examples: [
      {arabic: "لو درستُ لنجحتُ", english: "if I had studied, I would have passed", transliteration: "law darastu la-najaḥtu"},
      {arabic: "لو كنتُ طائرًا لطرتُ", english: "if I were a bird, I would fly", transliteration: "law kuntu taa'iran la-tirtu"},
      {arabic: "لولا المطرُ لجفّ النهر", english: "were it not for the rain, the river would dry up", transliteration: "lawlaa al-mataru la-jaffa an-nahr"}
    ],
    rules: [
      {rule: "لو + past tense verb = unreal condition", example: "لو جاء (if he had come / if he were to come)"},
      {rule: "Response with لـ + past", example: "لو درستَ لنجحتَ (if you had studied, you would have passed)"},
      {rule: "لولا + noun = 'were it not for X'", example: "لولا المطرُ لجفّ النهر"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'لو درستَ ___ (if you had studied, you would have passed)', answer: 'لنجحتَ', options: ['لنجحتَ', 'ستنجح', 'نجحتَ', 'لتنجح'] },
      { type: 'translate', prompt: '"if I were a bird, I would fly"', answer: 'لو كنتُ طائرًا لطرتُ', options: ['لو كنتُ طائرًا لطرتُ', 'إذا كنتُ طائرًا سأطير', 'لو كنتُ طائرًا سأطير', 'كنتُ طائرًا لو طرتُ'] },
      { type: 'fill-blank', prompt: 'لولا ___ لجفّ النهر (were it not for the rain, the river would dry up)', answer: 'المطرُ', options: ['المطرُ', 'المطرَ', 'المطرِ', 'مطر'] },
      { type: 'sentence-transformation', prompt: 'Change to unreal condition: إذا درستَ ستنجح', answer: 'لو درستَ لنجحتَ', hint: 'لو = unreal/counterfactual; response uses لـ + past', options: ['لو درستَ لنجحتَ', 'لو درستَ ستنجح', 'لو تدرسُ لتنجح', 'درستَ لو نجحتَ'] },
      { type: 'match', prompt: 'Match condition type to particle', pairs: [['لو', 'unreal/counterfactual condition'], ['إذا', 'real/possible future condition'], ['لولا', 'were it not for...'], ['لمّا', 'when (past narrative)']] },
      { type: 'true-false', statement: 'لو is used for real, likely future conditions', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'لولا means "were it not for..."', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'لو جئتَ لأراكَ (if you had come, I would have seen you)', error: 'لأراكَ', correction: 'لرأيتُك', answer: 'لأراكَ', options: ['لو', 'جئتَ', 'لأراكَ', 'No error'] },
      { type: 'classify', prompt: 'Classify as real or unreal condition', categories: ['Real condition (إذا)', 'Unreal condition (لو)'], items: [{ text: 'لو كنتُ غنيًّا لتصدّقتُ', category: 'Unreal condition (لو)' }, { text: 'إذا جاء سأساعده', category: 'Real condition (إذا)' }, { text: 'لو درستَ لنجحتَ', category: 'Unreal condition (لو)' }, { text: 'إذا أكلتَ ستشبع', category: 'Real condition (إذا)' }] },
      { type: 'cloze', text: '___ كنتُ طبيبًا ___ ساعدتُ المرضى كثيرًا', blanks: [{ answer: 'لو', options: ['لو', 'إذا', 'عندما'] }, { answer: 'لـ', options: ['لـ', 'سـ', 'و'] }] },
      { type: 'build-sentence', prompt: 'Build: "If he had come, I would have been happy"', answer: 'لو جاء لسُررتُ', options: ['لو جاء لسُررتُ', 'لو جاء سأفرح', 'إذا جاء لسُررتُ', 'لو يجيء لسُررتُ'] },
      { type: 'multiple-select', prompt: 'Select correct unreal condition sentences:', correctAnswers: ['لو درستَ لنجحتَ', 'لو كنتُ غنيًّا لتصدّقتُ'], options: ['لو درستَ لنجحتَ', 'لو درستَ ستنجح', 'لو كنتُ غنيًّا لتصدّقتُ', 'إذا كنتُ غنيًّا لتصدّقتُ'], answer: 'لو درستَ لنجحتَ,لو كنتُ غنيًّا لتصدّقتُ' },
    ],
    quiz: [
      { question: 'What type of condition does لو introduce?', options: ['Real future condition', 'Past completed action', 'Unreal or counterfactual condition', 'Immediate condition'], correct: 2, explanation: 'لو (law) introduces unreal or counterfactual conditions — things contrary to fact: لو كنتُ طائرًا لطرتُ' },
      { question: 'What does the response clause of a لو sentence typically use?', options: ['سـ + present', 'لـ + past', 'Present tense alone', 'Future verb'], correct: 1, explanation: 'The response clause uses لـ (prefixed to the verb) + past tense: لو درستَ لنجحتَ' },
      { question: 'What does لولا mean?', options: ['If only', 'Were it not for', 'Although', 'Whenever'], correct: 1, explanation: 'لولا (lawlaa) means "were it not for" followed by a nominative noun: لولا المطرُ لجفّ النهر' },
      { question: 'Which is a correct لو sentence?', options: ['لو جاء سيساعد', 'لو جاء لساعد', 'لو يجيء لساعد', 'إذا جاء لساعد'], correct: 1, explanation: 'لو جاء لساعد — correct pattern: لو + past verb, لـ + past verb for unreal condition' },
    ],
  },
  {
    id: 'oath-expressions',
    title: "Oath Expressions",
    titleArabic: "أسلوب القسم",
    category: 'basics',
    difficulty: 4,
    order: 39,
    cefrLevel: 'B2',
    explanation: "Arabic oath expressions use prepositions و (wa-), ب (bi-), or ت (ta-) followed by the sworn-upon noun in the genitive. The oath response (جواب القسم) uses لـ + قد + past or لـ + present for affirmative. The three particles differ: و is most common, ب can follow any oath noun, ت is restricted to الله only.",
    examples: [
      {arabic: "واللهِ لقد نجحتُ", english: "By God, I indeed passed", transliteration: "wallaahi la-qad najaḥtu"},
      {arabic: "بالله لأفعلنَّ الصواب", english: "By God, I shall certainly do what is right", transliteration: "billaahi la'af'alanna as-sawaab"},
      {arabic: "تاللهِ لقد سبقوا", english: "By God, they truly preceded", transliteration: "tallaahi la-qad sabaquu"}
    ],
    rules: [
      {rule: "Three particles: و, ب, ت — all followed by genitive", example: "والله / بالله / تالله"},
      {rule: "Affirmative oath response: لـ + قد + past or لـ + present emphatic", example: "واللهِ لقد جاء / واللهِ لَيَجيئنَّ"},
      {rule: "Negative oath response: ما + past or لا + present", example: "واللهِ ما فعلتُ ذلك"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___اللهِ لقد نجحتُ (By God, I passed)', answer: 'و', options: ['و', 'ب', 'ت', 'في'] },
      { type: 'translate', prompt: '"By God" (most common oath)', answer: 'واللهِ', options: ['واللهِ', 'باللهِ', 'تاللهِ', 'للهِ'] },
      { type: 'fill-blank', prompt: 'واللهِ ___ نجحتُ (affirmative oath response)', answer: 'لقد', options: ['لقد', 'قد', 'لم', 'ما'] },
      { type: 'sentence-transformation', prompt: 'Form an oath: I swear by God that I studied', answer: 'واللهِ لقد درستُ', hint: 'Use و + genitive + affirmative response', options: ['واللهِ لقد درستُ', 'والله قد درستُ', 'أحلف بالله درستُ', 'والله لو درستُ'] },
      { type: 'match', prompt: 'Match oath particle to restriction', pairs: [['و', 'most common, any noun'], ['ب', 'any oath noun, genitive'], ['ت', 'only used with الله'], ['لـ', 'response particle (not oath)']] },
      { type: 'true-false', statement: 'تالله can be used with any sworn-upon noun', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'In an affirmative oath response, لـ + قد + past tense is correct', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'تالنبيِّ لقد جاء (swearing by the Prophet using ت)', error: 'تالنبيِّ', correction: 'والنبيِّ أو بالنبيِّ', answer: 'تالنبيِّ', options: ['تالنبيِّ', 'لقد', 'جاء', 'No error'] },
      { type: 'classify', prompt: 'Classify oath responses as affirmative or negative', categories: ['Affirmative response', 'Negative response'], items: [{ text: 'لقد فعلتُ', category: 'Affirmative response' }, { text: 'ما فعلتُ', category: 'Negative response' }, { text: 'لأفعلنَّ', category: 'Affirmative response' }, { text: 'لا أفعل', category: 'Negative response' }] },
      { type: 'multiple-select', prompt: 'Select correct oath expressions:', correctAnswers: ['واللهِ', 'باللهِ', 'تاللهِ'], options: ['واللهِ', 'باللهِ', 'تاللهِ', 'منَ اللهِ', 'فياللهِ'], answer: 'واللهِ,باللهِ,تاللهِ' },
      { type: 'cloze', text: '___ اللهِ ___ قد صدقتُ في كل ما قلتُه', blanks: [{ answer: 'و', options: ['و', 'ت', 'في'] }, { answer: 'لـ', options: ['لـ', 'ما', 'لم'] }] },
      { type: 'build-sentence', prompt: 'Build: "By God, I did not do that"', answer: 'واللهِ ما فعلتُ ذلك', options: ['واللهِ ما فعلتُ ذلك', 'واللهِ لم أفعلُ ذلك', 'واللهِ لقد ما فعلتُ', 'باللهِ ما فعلَ ذلك'] },
    ],
    quiz: [
      { question: 'Which oath particle is restricted to الله only?', options: ['و', 'ب', 'ت', 'لـ'], correct: 2, explanation: 'تـ (ta-) is the oath particle restricted exclusively to الله: تاللهِ — it cannot be used with other nouns' },
      { question: 'What form does the noun take after an oath particle?', options: ['Nominative', 'Accusative', 'Genitive', 'No change'], correct: 2, explanation: 'The sworn-upon noun takes the genitive (مجرور) case after the oath particles و, ب, ت' },
      { question: 'What is the affirmative oath response pattern?', options: ['ما + past', 'لا + present', 'لـ + قد + past', 'إنّ + past'], correct: 2, explanation: 'Affirmative oath response uses لـ + قد + past: واللهِ لقد جاء (By God, he indeed came)' },
      { question: 'How do you say "By God" using the most common particle?', options: ['تاللهِ', 'باللهِ', 'واللهِ', 'فياللهِ'], correct: 2, explanation: 'واللهِ (wallaahi) using the و particle is the most common oath expression in Arabic' },
    ],
  },
  {
    id: 'exclamation',
    title: "Exclamation (أسلوب التعجب)",
    titleArabic: "أسلوب التعجب",
    category: 'verbs',
    difficulty: 4,
    order: 40,
    cefrLevel: 'B2',
    explanation: "Arabic exclamation (التعجب) has two main patterns. Pattern 1: ما أَفْعَلَهُ — 'How X he/it is!' (ما + Form IV verb + accusative noun). Pattern 2: أَفْعِل بِهِ — 'How excellent he is!' (Form IV imperative + بـ + genitive). Both are frozen/formulaic — they don't conjugate.",
    examples: [
      {arabic: "ما أجملَ السماءَ!", english: "How beautiful the sky is!", transliteration: "maa ajmala as-samaa'a"},
      {arabic: "ما أذكى هذا الطفلَ!", english: "How smart this child is!", transliteration: "maa adhkaa haadhaa at-tifla"},
      {arabic: "أجمِلْ بالسماءِ!", english: "How beautiful the sky is! (pattern 2)", transliteration: "ajmil bi-s-samaa'i"},
      {arabic: "أكرِمْ بعليٍّ!", english: "How noble Ali is!", transliteration: "akrim bi-'aliyyin"}
    ],
    rules: [
      {rule: "Pattern 1: ما + أَفعَلَ + object (accusative)", example: "ما أجملَ الربيعَ! (How beautiful spring is!)"},
      {rule: "Pattern 2: أَفعِل + بـ + noun (genitive)", example: "أجمِلْ بالربيعِ! (same meaning)"},
      {rule: "The root must meet conditions: Form I, 3 root letters, not a color/defect verb", example: "ما أعظمَ العلمَ! (How great knowledge is!)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'ما ___ السماءَ! (How beautiful the sky is! — Pattern 1)', answer: 'أجملَ', options: ['أجملَ', 'جميلَ', 'أجملُ', 'جملَ'] },
      { type: 'translate', prompt: '"How smart this child is!" (Pattern 1)', answer: 'ما أذكى هذا الطفلَ!', options: ['ما أذكى هذا الطفلَ!', 'كم ذكاء هذا الطفل!', 'ما أذكى هذا الطفلُ!', 'أذكِ بالطفل!'] },
      { type: 'fill-blank', prompt: 'أجمِلْ ___ الربيعِ! (Pattern 2)', answer: 'بـ', options: ['بـ', 'في', 'عن', 'مع'] },
      { type: 'sentence-transformation', prompt: 'Convert to Pattern 2: ما أكرمَ عليًّا!', answer: 'أكرِمْ بعليٍّ!', hint: 'Pattern 2: أَفعِل + بـ + genitive', options: ['أكرِمْ بعليٍّ!', 'أكرِمْ عليًّا!', 'أكرَمْ بعليٍّ!', 'كرِمْ بعليٍّ!'] },
      { type: 'match', prompt: 'Match exclamation to translation', pairs: [['ما أعظمَ الإسلامَ!', 'How great Islam is!'], ['ما أحسنَ الأدبَ!', 'How good manners are!'], ['أعظِمْ بالعلمِ!', 'How great knowledge is! (P2)'], ['ما أطولَ الليلَ!', 'How long the night is!']] },
      { type: 'true-false', statement: 'Both exclamation patterns use the same root verb', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'In Pattern 1, the noun after أَفعَلَ is in the nominative', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'ما أجملَ السماءُ! (How beautiful the sky is!)', error: 'السماءُ', correction: 'السماءَ', answer: 'السماءُ', options: ['ما', 'أجملَ', 'السماءُ', 'No error'] },
      { type: 'classify', prompt: 'Classify as Pattern 1 or Pattern 2', categories: ['Pattern 1 (ما أَفعَلَ)', 'Pattern 2 (أَفعِل بـ)'], items: [{ text: 'ما أعذبَ الصوتَ!', category: 'Pattern 1 (ما أَفعَلَ)' }, { text: 'أعذِبْ بالصوتِ!', category: 'Pattern 2 (أَفعِل بـ)' }, { text: 'ما أسرعَ البرقَ!', category: 'Pattern 1 (ما أَفعَلَ)' }, { text: 'أسرِعْ بالبرقِ!', category: 'Pattern 2 (أَفعِل بـ)' }] },
      { type: 'multiple-select', prompt: 'Select correct exclamation sentences:', correctAnswers: ['ما أجملَ الوردَ!', 'أجمِلْ بالوردِ!'], options: ['ما أجملَ الوردَ!', 'ما أجملُ الوردَ!', 'أجمِلْ بالوردِ!', 'أجمَلْ بالوردِ!'], answer: 'ما أجملَ الوردَ!,أجمِلْ بالوردِ!' },
      { type: 'cloze', text: '___ أعظمَ ___ ! وما أكرمَ قلبَهُ!', blanks: [{ answer: 'ما', options: ['ما', 'كم', 'أي'] }, { answer: 'العلمَ', options: ['العلمَ', 'العلمُ', 'العلمِ'] }] },
      { type: 'build-sentence', prompt: 'Build Pattern 1: "How long the night is!"', answer: 'ما أطولَ الليلَ!', options: ['ما أطولَ الليلَ!', 'ما أطولُ الليلَ!', 'ما أطولَ الليلُ!', 'أطوِلْ الليلَ!'] },
    ],
    quiz: [
      { question: 'What is the structure of Pattern 1 exclamation?', options: ['كم + adjective', 'ما + أَفعَلَ + accusative noun', 'أَفعِل + بـ + nominative', 'إنّ + adjective'], correct: 1, explanation: 'Pattern 1: ما + أَفعَلَ (Form IV) + accusative noun: ما أجملَ السماءَ! (How beautiful the sky is!)' },
      { question: 'In Pattern 2 exclamation, what case follows بـ?', options: ['Nominative', 'Accusative', 'Genitive', 'Accusative or Genitive'], correct: 2, explanation: 'Pattern 2: أَفعِل + بـ + genitive: أجمِلْ بالسماءِ! (بـ governs genitive)' },
      { question: 'Which sentence uses Pattern 1 correctly?', options: ['ما أجملُ الربيعَ!', 'ما أجملَ الربيعُ!', 'ما أجملَ الربيعَ!', 'أجملَ ما الربيعَ!'], correct: 2, explanation: 'ما أجملَ الربيعَ! — أجملَ is past tense (not أجملُ), and الربيعَ is accusative' },
      { question: 'What condition must the verb root meet for التعجب?', options: ['Must be Form V', 'Must be Form I, trilateral, not color/defect verb', 'Must be transitive only', 'Must have a doubled middle letter'], correct: 1, explanation: 'The root for التعجب must be Form I, have exactly 3 root letters, and not be a color/physical defect verb' },
    ],
  },
  {
    id: 'wonder-verb',
    title: "Verb of Wonder (فعل التعجب)",
    titleArabic: "فعل التعجب",
    category: 'verbs',
    difficulty: 4,
    order: 41,
    cefrLevel: 'B2',
    explanation: "The verb of wonder (فعل التعجب) is a frozen verb form used only in the two exclamation patterns. It is derived from the trilateral root via Form IV. In Pattern 1 (ما أَفعَلَهُ), أَفعَلَ functions as the predicate. In Pattern 2 (أَفعِل بِهِ), it takes the form of a command. These verbs do not change for gender, number, or tense.",
    examples: [
      {arabic: "ما أعظمَ الصبرَ!", english: "How great patience is!", transliteration: "maa a'dhama as-sabra"},
      {arabic: "أعظِمْ بالصبرِ!", english: "How great patience is! (P2)", transliteration: "a'dhim bis-sabri"},
      {arabic: "ما أحسنَ الخُلقَ!", english: "How good character is!", transliteration: "maa ahsana al-khuluqa"}
    ],
    rules: [
      {rule: "فعل التعجب is frozen — never conjugates", example: "ما أجملَ (not أجملتْ or أجملوا)"},
      {rule: "Pattern 1 predicate: ما + أَفعَلَ is a complete sentence", example: "ما (subject, relative pronoun) + أجملَ السماءَ (verb + object)"},
      {rule: "Pattern 2: imperative-like أَفعِل is an intransitive verb; بـ makes its 'subject' appear as مجرور", example: "أكرِمْ بعليٍّ — عليّ is the logical subject"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'ما ___ الصبرَ! (How great patience is!)', answer: 'أعظمَ', options: ['أعظمَ', 'عظيمَ', 'عظّمَ', 'أعظمُ'] },
      { type: 'translate', prompt: 'How good character is! (Pattern 1)', answer: 'ما أحسنَ الخُلقَ!', options: ['ما أحسنَ الخُلقَ!', 'ما أحسنَ الخُلقُ!', 'ما حسنَ الخُلقَ!', 'كم أحسنَ الخُلقَ!'] },
      { type: 'fill-blank', prompt: 'أكرِمْ ___ عليٍّ! (Pattern 2: How noble Ali is!)', answer: 'بـ', options: ['بـ', 'لـ', 'في', 'على'] },
      { type: 'sentence-transformation', prompt: 'Build Pattern 1 exclamation from root: ك-ر-م (noble)', answer: 'ما أكرمَ الرجلَ!', hint: 'Form IV pattern أَفعَلَ from the root', options: ['ما أكرمَ الرجلَ!', 'ما كرمَ الرجلَ!', 'ما أكرمُ الرجلَ!', 'ما أكرمَ الرجلُ!'] },
      { type: 'match', prompt: 'Match root to wonder verb', pairs: [['ج-م-ل', 'أجملَ'], ['ع-ظ-م', 'أعظمَ'], ['ح-س-ن', 'أحسنَ'], ['ك-ب-ر', 'أكبرَ']] },
      { type: 'true-false', statement: 'فعل التعجب conjugates for gender like regular verbs', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'In Pattern 2, the noun after بـ is the logical subject of wonder', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'ما أجملتْ الوردةَ! (exclamation)', error: 'أجملتْ', correction: 'أجملَ', answer: 'أجملتْ', options: ['ما', 'أجملتْ', 'الوردةَ', 'No error'] },
      { type: 'classify', prompt: 'Identify the wonder verb form', categories: ['Pattern 1 wonder verb', 'Pattern 2 wonder verb'], items: [{ text: 'ما أطولَ الليلَ!', category: 'Pattern 1 wonder verb' }, { text: 'أطوِلْ بالليلِ!', category: 'Pattern 2 wonder verb' }, { text: 'ما أشدَّ البردَ!', category: 'Pattern 1 wonder verb' }, { text: 'أشدِدْ بالبردِ!', category: 'Pattern 2 wonder verb' }] },
      { type: 'cloze', text: 'ما ___ العلمَ و___ به!', blanks: [{ answer: 'أنفعَ', options: ['أنفعَ', 'نفعَ', 'أنفعُ'] }, { answer: 'أنفِعْ', options: ['أنفِعْ', 'نفِعْ', 'أنفَعْ'] }] },
      { type: 'multiple-select', prompt: 'Select sentences where فعل التعجب is used correctly:', correctAnswers: ['ما أجملَ الوردَ!', 'أجمِلْ بالوردِ!'], options: ['ما أجملَ الوردَ!', 'ما أجملتْ الوردةَ!', 'أجمِلْ بالوردِ!', 'أجمِلْ الوردَ!'], answer: 'ما أجملَ الوردَ!,أجمِلْ بالوردِ!' },
      { type: 'build-sentence', prompt: 'Build Pattern 2: "How great knowledge is!"', answer: 'أعظِمْ بالعلمِ!', options: ['أعظِمْ بالعلمِ!', 'أعظِمْ العلمَ!', 'أعظَمْ بالعلمِ!', 'عظِّمْ بالعلمِ!'] },
    ],
    quiz: [
      { question: 'Does فعل التعجب conjugate for different subjects?', options: ['Yes, like all Arabic verbs', 'No, it is frozen in one form', 'Only for gender', 'Only for number'], correct: 1, explanation: 'فعل التعجب is frozen — it never changes form for gender, number, or tense' },
      { question: 'In Pattern 2 "أكرِمْ بعليٍّ", what grammatical role does عليٍّ play?', options: ['Direct object', 'Logical subject (in genitive via بـ)', 'Indirect object', 'Hal'], correct: 1, explanation: 'عليٍّ is the logical subject of wonder — it is what we are exclaiming about, appearing in genitive because of بـ' },
      { question: 'How is فعل التعجب derived from a root?', options: ['Form II pattern', 'Form IV pattern (أَفعَلَ)', 'Form X pattern', 'Form VII pattern'], correct: 1, explanation: 'فعل التعجب is derived via Form IV pattern (أَفعَلَ): ج-م-ل → أجملَ, ع-ظ-م → أعظمَ' },
      { question: 'Which root can form a wonder verb?', options: ['أ-ح-م-ر (color)', 'ك-ر-م (noble)', 'Not quadrilateral', 'ع-م-ي (defect)'], correct: 1, explanation: 'ك-ر-م (noble) is a valid trilateral root for wonder verb → أكرمَ. Color/defect roots cannot form التعجب directly' },
    ],
  },
  {
    id: 'praise-blame',
    title: "Verbs of Praise & Blame",
    titleArabic: "نعم وبئس",
    category: 'verbs',
    difficulty: 4,
    order: 42,
    cefrLevel: 'B2',
    explanation: "نِعمَ (ni'ma = how excellent!) and بِئسَ (bi'sa = how terrible!) are special frozen verbs used to express praise and blame. They are followed by a definite noun (فاعل) and then an indefinite noun or pronoun (المخصوص بالمدح أو الذم) that specifies what is praised/blamed.",
    examples: [
      {arabic: "نِعمَ الرجلُ عليٌّ", english: "What an excellent man Ali is!", transliteration: "ni'ma ar-rajulu 'Aliyyun"},
      {arabic: "بِئسَ الخُلقُ الكذبُ", english: "What a terrible trait lying is!", transliteration: "bi'sa al-khuluqu al-kadhibu"},
      {arabic: "نِعمَ العملُ الصدقةُ", english: "What an excellent deed charity is!", transliteration: "ni'ma al-'amalu as-sadaqatu"}
    ],
    rules: [
      {rule: "Pattern: نِعمَ/بِئسَ + definite noun (فاعل) + المخصوص", example: "نِعمَ الطالبُ محمدٌ (فاعل = الطالبُ, المخصوص = محمدٌ)"},
      {rule: "فاعل نعم/بئس must be definite (with ال)", example: "نِعمَ الرجلُ (not نِعمَ رجلٌ)"},
      {rule: "نِعمَ and بِئسَ are frozen — never conjugated", example: "نِعمَ (not نِعمَتْ or نِعمُوا)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ الرجلُ عليٌّ! (What an excellent man Ali is!)', answer: 'نِعمَ', options: ['نِعمَ', 'بِئسَ', 'ما أعظمَ', 'حبّذا'] },
      { type: 'translate', prompt: '"What a terrible trait lying is!"', answer: 'بِئسَ الخُلقُ الكذبُ', options: ['بِئسَ الخُلقُ الكذبُ', 'نِعمَ الخُلقُ الكذبُ', 'بِئسَ خُلقٌ الكذبُ', 'بئسَ الكذبُ الخُلق'] },
      { type: 'fill-blank', prompt: 'نِعمَ ___ الصدقةُ! (What an excellent deed charity is!)', answer: 'العملُ', options: ['العملُ', 'عملٌ', 'العملَ', 'العملِ'] },
      { type: 'sentence-transformation', prompt: 'Express blame for cowardice: بِئسَ + الصفةُ + الجبنُ', answer: 'بِئسَ الصفةُ الجبنُ', hint: 'Follow pattern: بِئسَ + definite noun + المخصوص', options: ['بِئسَ الصفةُ الجبنُ', 'بِئسَ صفةٌ الجبنُ', 'بِئسَ الجبنُ الصفةُ', 'بِئسَ الصفةَ الجبنُ'] },
      { type: 'match', prompt: 'Match expression to meaning', pairs: [['نِعمَ الرجلُ', 'Praise: what an excellent man'], ['بِئسَ الخُلقُ', 'Blame: what a terrible trait'], ['حبّذا الصدق', 'How wonderful honesty is'], ['لا حبّذا الكذب', 'How undesirable lying is']] },
      { type: 'true-false', statement: 'The فاعل of نِعمَ must be indefinite', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'نِعمَ and بِئسَ never conjugate for gender or number', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'نِعمَ رجلٌ محمدٌ! (What an excellent man Muhammad is!)', error: 'رجلٌ', correction: 'الرجلُ', answer: 'رجلٌ', options: ['نِعمَ', 'رجلٌ', 'محمدٌ', 'No error'] },
      { type: 'classify', prompt: 'Classify as praise or blame expression', categories: ['Praise (نِعمَ)', 'Blame (بِئسَ)'], items: [{ text: 'نِعمَ الصديقُ الوفيُّ', category: 'Praise (نِعمَ)' }, { text: 'بِئسَ العملُ الغشُّ', category: 'Blame (بِئسَ)' }, { text: 'نِعمَ الخُلقُ الصبرُ', category: 'Praise (نِعمَ)' }, { text: 'بِئسَ الصفةُ البُخلُ', category: 'Blame (بِئسَ)' }] },
      { type: 'multiple-select', prompt: 'Select correct نِعمَ/بِئسَ sentences:', correctAnswers: ['نِعمَ الرجلُ محمدٌ', 'بِئسَ العملُ الكذبُ'], options: ['نِعمَ الرجلُ محمدٌ', 'نِعمَ رجلٌ محمدٌ', 'بِئسَ العملُ الكذبُ', 'بِئسَتْ الصفةُ الكذبُ'], answer: 'نِعمَ الرجلُ محمدٌ,بِئسَ العملُ الكذبُ' },
      { type: 'cloze', text: '___ الخُلقُ الصدقُ و___ الخُلقُ الكذبُ', blanks: [{ answer: 'نِعمَ', options: ['نِعمَ', 'بِئسَ', 'ما'] }, { answer: 'بِئسَ', options: ['بِئسَ', 'نِعمَ', 'ليس'] }] },
      { type: 'build-sentence', prompt: 'Build: "What an excellent student Fatima is!"', answer: 'نِعمَ الطالبةُ فاطمةُ', options: ['نِعمَ الطالبةُ فاطمةُ', 'نِعمَ طالبةٌ فاطمةُ', 'نِعمتْ الطالبةُ فاطمةُ', 'فاطمةُ نِعمَ الطالبةُ'] },
    ],
    quiz: [
      { question: 'What does نِعمَ express?', options: ['Blame or criticism', 'Praise or excellence', 'Surprise', 'Negation'], correct: 1, explanation: 'نِعمَ (ni\'ma) expresses praise — "how excellent!" or "what a wonderful X!"' },
      { question: 'What must the فاعل of نِعمَ be?', options: ['Indefinite', 'Definite (with ال)', 'In the genitive', 'In the accusative'], correct: 1, explanation: 'The فاعل of نِعمَ must be definite (with ال): نِعمَ الرجلُ (not نِعمَ رجلٌ)' },
      { question: 'Do نِعمَ and بِئسَ conjugate?', options: ['Yes, for gender', 'Yes, for number', 'Yes, for both gender and number', 'No, they are frozen'], correct: 3, explanation: 'نِعمَ and بِئسَ are frozen verbs — they never change form for gender, number, or tense' },
      { question: 'In "نِعمَ الرجلُ عليٌّ", what is عليٌّ?', options: ['فاعل', 'مفعول به', 'المخصوص بالمدح', 'حال'], correct: 2, explanation: 'عليٌّ is المخصوص بالمدح — the specific person/thing being praised, which comes after the definite فاعل' },
    ],
  },
  {
    id: 'absolute-object',
    title: "Absolute Object (المفعول المطلق)",
    titleArabic: "المفعول المطلق",
    category: 'verbs',
    difficulty: 4,
    order: 43,
    cefrLevel: 'B2',
    explanation: "The مفعول مطلق (absolute object / cognate accusative) is a verbal noun from the same root as the verb, placed after it in the accusative case. It serves two functions: (1) emphasis — ضربتُه ضربًا (I truly hit him), or (2) describing manner — ضربتُه ضربًا شديدًا (I hit him a severe hitting / I hit him severely).",
    examples: [
      {arabic: "ضربتُه ضربًا شديدًا", english: "I hit him severely", transliteration: "darabtuh darban shadidan"},
      {arabic: "فرحتُ فرحًا عظيمًا", english: "I rejoiced greatly", transliteration: "fariḥtu farahan 'azhiman"},
      {arabic: "يحبّ الوطنَ حبًّا عميقًا", english: "he loves his homeland deeply", transliteration: "yuhibbu al-watana hubban 'amiiqan"}
    ],
    rules: [
      {rule: "مفعول مطلق is always accusative and indefinite", example: "ضربًا, فرحًا, حبًّا"},
      {rule: "It must be from the same root as the verb", example: "ضرب → ضربًا, فرح → فرحًا"},
      {rule: "Adjective can follow to describe manner", example: "درسَ دراسةً مُكثَّفةً (he studied intensively)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'فرحتُ ___ عظيمًا (I rejoiced greatly)', answer: 'فرحًا', options: ['فرحًا', 'فرحٌ', 'فرحِ', 'الفرح'] },
      { type: 'translate', prompt: '"he loves his homeland deeply"', answer: 'يحبّ الوطنَ حبًّا عميقًا', options: ['يحبّ الوطنَ حبًّا عميقًا', 'يحبّ الوطنَ حبٌّ عميق', 'يحبّ الوطنَ بعمق', 'يحبّ الوطنَ حبٍّ عميق'] },
      { type: 'fill-blank', prompt: 'درستُ ___ مكثّفة (I studied intensively)', answer: 'دراسةً', options: ['دراسةً', 'دراسةٌ', 'الدراسة', 'درسًا'] },
      { type: 'sentence-transformation', prompt: 'Add مفعول مطلق for emphasis: ضربتُه', answer: 'ضربتُه ضربًا', hint: 'Use masdar of the same root in accusative', options: ['ضربتُه ضربًا', 'ضربتُه مضروبًا', 'ضربتُه ضاربًا', 'ضربتُه بضرب'] },
      { type: 'match', prompt: 'Match verb to its مفعول مطلق', pairs: [['ضرب', 'ضربًا'], ['فرح', 'فرحًا'], ['حبّ', 'حبًّا'], ['درس', 'دراسةً']] },
      { type: 'true-false', statement: 'The مفعول مطلق can be from a different root than the verb', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The مفعول مطلق is always in the accusative case', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'فرحتُ فرحًا كبيرٌ (I rejoiced greatly)', error: 'كبيرٌ', correction: 'كبيرًا', answer: 'كبيرٌ', options: ['فرحتُ', 'فرحًا', 'كبيرٌ', 'No error'] },
      { type: 'classify', prompt: 'Classify مفعول مطلق function', categories: ['For emphasis only', 'Describing manner/type'], items: [{ text: 'ضربتُه ضربًا', category: 'For emphasis only' }, { text: 'فرحتُ فرحًا عظيمًا', category: 'Describing manner/type' }, { text: 'قال قولًا', category: 'For emphasis only' }, { text: 'درس دراسةً منتظمة', category: 'Describing manner/type' }] },
      { type: 'cloze', text: 'يحبّ العلمَ ___ عميقًا ويدرسُ ___', blanks: [{ answer: 'حبًّا', options: ['حبًّا', 'حبٌّ', 'الحب'] }, { answer: 'دراسةً', options: ['دراسةً', 'دراسةٌ', 'درسًا'] }] },
      { type: 'multiple-select', prompt: 'Select correct مفعول مطلق sentences:', correctAnswers: ['فرحتُ فرحًا عظيمًا', 'ضربتُه ضربًا شديدًا'], options: ['فرحتُ فرحًا عظيمًا', 'فرحتُ فرحٌ عظيم', 'ضربتُه ضربًا شديدًا', 'ضربتُه ضربٌ شديد'], answer: 'فرحتُ فرحًا عظيمًا,ضربتُه ضربًا شديدًا' },
      { type: 'build-sentence', prompt: 'Build: "He rejoiced greatly"', answer: 'فرحَ فرحًا عظيمًا', options: ['فرحَ فرحًا عظيمًا', 'فرحَ فرحٌ عظيم', 'فرحَ فرحًا عظيمٌ', 'فرحَ بفرح عظيم'] },
    ],
    quiz: [
      { question: 'What is the grammatical case of مفعول مطلق?', options: ['Nominative', 'Genitive', 'Accusative', 'It varies'], correct: 2, explanation: 'مفعول مطلق is always in the accusative (منصوب) case: ضربًا, فرحًا, دراسةً' },
      { question: 'What root must the مفعول مطلق come from?', options: ['Any root', 'The same root as the verb', 'A related but different root', 'Form X roots only'], correct: 1, explanation: 'The مفعول مطلق must be a masdar (verbal noun) from the same root as the main verb: ضرب → ضربًا, فرح → فرحًا' },
      { question: 'What are the two functions of مفعول مطلق?', options: ['Direction and location', 'Emphasis and manner description', 'Time and condition', 'Subject and object'], correct: 1, explanation: 'مفعول مطلق serves two functions: (1) emphasis — confirming the action happened, (2) describing the manner/type of the action' },
      { question: 'Which sentence contains a correct مفعول مطلق?', options: ['ضربتُه بشدة', 'ضربتُه ضربًا شديدًا', 'ضربتُه ضربٌ شديد', 'ضربتُه الضرب'], correct: 1, explanation: 'ضربتُه ضربًا شديدًا — ضربًا is accusative indefinite masdar from the same root, with an adjective شديدًا describing the manner' },
    ],
  },
  {
    id: 'mafuul-liajlih',
    title: "Adverb of Cause (المفعول لأجله)",
    titleArabic: "المفعول لأجله",
    category: 'verbs',
    difficulty: 4,
    order: 44,
    cefrLevel: 'B2',
    explanation: "The مفعول لأجله (also called مفعول له) explains WHY an action was done — the motivation or purpose. It is a masdar (verbal noun) in the accusative case, sharing the same subject and time as the main verb. It answers the question 'Why did you do X?'",
    examples: [
      {arabic: "جئتُ رغبةً في العلم", english: "I came desiring knowledge (for the sake of knowledge)", transliteration: "ji'tu raghbatan fi al-'ilm"},
      {arabic: "قمتُ إجلالًا للمعلم", english: "I stood up out of respect for the teacher", transliteration: "qumtu ijlaalin lil-mu'allim"},
      {arabic: "أكرمتُه تقديرًا لجهوده", english: "I honoured him in appreciation of his efforts", transliteration: "akramtuhu taqdiiran li-juhhudihi"}
    ],
    rules: [
      {rule: "Must be a masdar, same subject and time as verb", example: "جئتُ رغبةً — 'I' came and 'I' was desiring (same subject)"},
      {rule: "Always accusative and indefinite", example: "رغبةً, إجلالًا, تقديرًا"},
      {rule: "If conditions not met, use لـ + masdar instead", example: "جئتُ لأسمعَ الدرسَ (I came to hear the lesson — different action type)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'قمتُ ___ للمعلم (I stood out of respect for the teacher)', answer: 'إجلالًا', options: ['إجلالًا', 'إجلالٌ', 'إجلال', 'إجلالِ'] },
      { type: 'translate', prompt: '"I came desiring knowledge"', answer: 'جئتُ رغبةً في العلم', options: ['جئتُ رغبةً في العلم', 'جئتُ رغبةٌ في العلم', 'جئتُ لأرغب في العلم', 'جئتُ من رغبة العلم'] },
      { type: 'fill-blank', prompt: 'أكرمتُه ___ لجهوده (I honoured him in appreciation of his efforts)', answer: 'تقديرًا', options: ['تقديرًا', 'تقديرٌ', 'التقدير', 'بتقدير'] },
      { type: 'sentence-transformation', prompt: 'Add مفعول لأجله: بكيتُ (out of sadness)', answer: 'بكيتُ حزنًا', hint: 'Use masdar of حزن in accusative', options: ['بكيتُ حزنًا', 'بكيتُ لأنني حزين', 'بكيتُ حزنٌ', 'بكيتُ من الحزن'] },
      { type: 'match', prompt: 'Match sentence to its مفعول لأجله', pairs: [['جئتُ رغبةً في العلم', 'رغبةً'], ['قمتُ إجلالًا له', 'إجلالًا'], ['سافرتُ طلبًا للرزق', 'طلبًا'], ['دافعتُ غيرةً على الوطن', 'غيرةً']] },
      { type: 'true-false', statement: 'مفعول لأجله must be a masdar', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The مفعول لأجله can have a different subject from the main verb', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'جئتُ رغبةٌ في العلم (I came desiring knowledge)', error: 'رغبةٌ', correction: 'رغبةً', answer: 'رغبةٌ', options: ['جئتُ', 'رغبةٌ', 'العلم', 'No error'] },
      { type: 'classify', prompt: 'Classify as valid مفعول لأجله or must use preposition', categories: ['Valid مفعول لأجله', 'Must use preposition (لـ)'], items: [{ text: 'قمتُ إجلالًا للمعلم (same subject)', category: 'Valid مفعول لأجله' }, { text: 'جئتُ لكي يساعدني (different subject)', category: 'Must use preposition (لـ)' }, { text: 'درستُ حبًّا للعلم (same subject)', category: 'Valid مفعول لأجله' }, { text: 'ذهبتُ لأن المدير طلب (different trigger)', category: 'Must use preposition (لـ)' }] },
      { type: 'cloze', text: 'سافرتُ ___ للرزق وعدتُ ___ لأهلي', blanks: [{ answer: 'طلبًا', options: ['طلبًا', 'طلبٌ', 'للطلب'] }, { answer: 'شوقًا', options: ['شوقًا', 'شوقٌ', 'بشوق'] }] },
      { type: 'build-sentence', prompt: 'Build: "He worked hard out of love for his family"', answer: 'عمل جاهدًا حبًّا لأسرته', options: ['عمل جاهدًا حبًّا لأسرته', 'عمل جاهدًا لأنه يحبّ أسرته', 'عمل جاهدًا حبٌّ لأسرته', 'عمل حبًّا جاهدًا لأسرته'] },
      { type: 'multiple-select', prompt: 'Select valid مفعول لأجله (same subject as main verb):', correctAnswers: ['جئتُ رغبةً في العلم', 'قمتُ إجلالًا للأستاذ'], options: ['جئتُ رغبةً في العلم', 'جئتُ لكي يساعدني صديقي', 'قمتُ إجلالًا للأستاذ', 'ذهبتُ لأن أمي أمرت'], answer: 'جئتُ رغبةً في العلم,قمتُ إجلالًا للأستاذ' },
    ],
    quiz: [
      { question: 'What does مفعول لأجله express?', options: ['Location of the action', 'Manner of the action', 'Reason or motivation for the action', 'Time of the action'], correct: 2, explanation: 'مفعول لأجله answers "why" — it expresses the reason, motivation, or purpose behind the main verb' },
      { question: 'What grammatical case is مفعول لأجله?', options: ['Nominative', 'Genitive', 'Accusative', 'Depends on position'], correct: 2, explanation: 'مفعول لأجله is always accusative (منصوب) and indefinite: رغبةً, إجلالًا, تقديرًا' },
      { question: 'What is the key condition for a word to be مفعول لأجله?', options: ['It must be an adjective', 'It must share the same subject and time as the main verb', 'It must come after لـ', 'It must be in the genitive'], correct: 1, explanation: 'مفعول لأجله must: (1) be a masdar, (2) share the same subject as the main verb, (3) occur at the same time as the main verb' },
      { question: 'When is لـ + masdar used instead of مفعول لأجله?', options: ['Always preferred', 'When the subject is different or conditions not met', 'When the masdar is definite', 'When the verb is intransitive'], correct: 1, explanation: 'If the masdar cannot be مفعول لأجله (different subject, different time), use the preposition لـ instead: جئتُ لأسمعَ الدرسَ' },
    ],
  },
  {
    id: 'mafuul-maah',
    title: "Accompanying Object (المفعول معه)",
    titleArabic: "المفعول معه",
    category: 'nouns',
    difficulty: 4,
    order: 45,
    cefrLevel: 'B2',
    explanation: "The مفعول معه is a noun that comes after a واو المعية (و of accompaniment) meaning 'along with' or 'alongside'. It is accusative and indicates what the action was done alongside, NOT a shared participant. Example: سرتُ والنهرَ (I walked alongside the river — the river walked with nothing).",
    examples: [
      {arabic: "سرتُ والنهرَ", english: "I walked along the river", transliteration: "sirtu wan-nahara"},
      {arabic: "استيقظتُ وطلوعَ الفجر", english: "I woke up at the break of dawn", transliteration: "istayqazhtu wa-tuluu'a al-fajr"},
      {arabic: "جاء القائدُ والجيشَ", english: "the commander came with (alongside) the army", transliteration: "jaa'a al-qaa'idu wal-jaysha"}
    ],
    rules: [
      {rule: "و here is واو المعية — its noun is accusative (not nominative like عطف)", example: "جاء محمدٌ وعليًّا — علي is accompanyee, not joint subject"},
      {rule: "Cannot use pronoun as مفعول معه", example: "سرتُ وهو (wrong) — use معه instead"},
      {rule: "Distinction from عطف (coordination): عطف shares the action, معية is alongside only", example: "جاء محمدٌ وعليٌّ (both came) vs جاء محمدٌ وعليًّا (Muhammad came, Ali accompanied)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'سرتُ ___ (I walked alongside the river)', answer: 'والنهرَ', options: ['والنهرَ', 'والنهرُ', 'مع النهر', 'بالنهر'] },
      { type: 'translate', prompt: '"I woke up at the break of dawn" (using مفعول معه)', answer: 'استيقظتُ وطلوعَ الفجر', options: ['استيقظتُ وطلوعَ الفجر', 'استيقظتُ وطلوعُ الفجر', 'استيقظتُ مع طلوع الفجر', 'استيقظتُ بطلوع الفجر'] },
      { type: 'fill-blank', prompt: 'جاء الرئيسُ _____ (the president came alongside his delegates)', answer: 'والوفدَ', options: ['والوفدَ', 'والوفدُ', 'مع الوفد', 'بالوفد'] },
      { type: 'sentence-transformation', prompt: 'Rewrite as مفعول معه: سرتُ مع الشاطئ', answer: 'سرتُ والشاطئَ', hint: 'Replace مع + noun with و + accusative noun', options: ['سرتُ والشاطئَ', 'سرتُ والشاطئُ', 'سرتُ وشاطئًا', 'سرتُ بشاطئٍ'] },
      { type: 'match', prompt: 'Identify مفعول معه in each sentence', pairs: [['سرتُ والنهرَ', 'النهرَ'], ['جاء الأميرُ والحرسَ', 'الحرسَ'], ['ذهبتُ وطلوعَ الشمس', 'طلوعَ الشمس'], ['قدِمَ الحاجُّ والركبَ', 'الركبَ']] },
      { type: 'true-false', statement: 'In مفعول معه, the noun after و is in the accusative case', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'A pronoun can serve as مفعول معه', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'سرتُ والنهرُ (I walked along the river)', error: 'النهرُ', correction: 'النهرَ', answer: 'النهرُ', options: ['سرتُ', 'و', 'النهرُ', 'No error'] },
      { type: 'classify', prompt: 'Classify as مفعول معه (accompaniment) or عطف (coordination)', categories: ['مفعول معه (accompaniment)', 'عطف (both share action)'], items: [{ text: 'جاء محمدٌ وعليًّا (Ali just came alongside)', category: 'مفعول معه (accompaniment)' }, { text: 'جاء محمدٌ وعليٌّ (both came)', category: 'عطف (both share action)' }, { text: 'سرتُ والشاطئَ', category: 'مفعول معه (accompaniment)' }, { text: 'أكل محمدٌ وفاطمةُ', category: 'عطف (both share action)' }] },
      { type: 'cloze', text: 'وصلتُ ___ وصديقتي وغادرنا ___ غروبِ الشمس', blanks: [{ answer: 'أنا', options: ['أنا', 'معي', 'لي'] }, { answer: 'و', options: ['و', 'مع', 'قبل'] }] },
      { type: 'build-sentence', prompt: 'Build: "He arrived alongside the delegation"', answer: 'وصل الوزيرُ والوفدَ', options: ['وصل الوزيرُ والوفدَ', 'وصل الوزيرُ والوفدُ', 'وصل الوزيرُ مع الوفد', 'وصل الوزيرُ بالوفد'] },
      { type: 'multiple-select', prompt: 'Select sentences with correct مفعول معه:', correctAnswers: ['سرتُ والشاطئَ', 'جاء الملكُ والحرسَ'], options: ['سرتُ والشاطئَ', 'سرتُ والشاطئُ', 'جاء الملكُ والحرسَ', 'جاء الملكُ والحرسُ'], answer: 'سرتُ والشاطئَ,جاء الملكُ والحرسَ' },
    ],
    quiz: [
      { question: 'What case does مفعول معه take?', options: ['Nominative', 'Genitive', 'Accusative', 'The same as the main subject'], correct: 2, explanation: 'مفعول معه is always in the accusative (منصوب) case: سرتُ والنهرَ (النهرَ is accusative)' },
      { question: 'What is the difference between مفعول معه and عطف?', options: ['They are identical', 'عطف is accusative; مفعول معه is nominative', 'مفعول معه accompanies only; عطف shares the action', 'مفعول معه requires a preposition'], correct: 2, explanation: 'In عطف, both subjects perform the action (جاء محمدٌ وعليٌّ — both came). In مفعول معه, only the main subject acts and the other accompanies (جاء محمدٌ وعليًّا — Muhammad came, Ali was just alongside)' },
      { question: 'Can a pronoun be مفعول معه?', options: ['Yes, always', 'Yes, attached to و', 'No — use معه/معها instead', 'Only هو and هي'], correct: 2, explanation: 'Pronouns cannot serve as مفعول معه — use the independent form معه/معها/معهم instead' },
      { question: 'In "سرتُ والنهرَ", what does والنهرَ indicate?', options: ['The river also walked', 'I walked with the river flowing alongside', 'I walked toward the river', 'I crossed the river'], correct: 1, explanation: 'سرتُ والنهرَ means "I walked with the river alongside me / along the river" — the river accompanies the walking but does not walk itself' },
    ],
  },
  {
    id: 'literary-particles',
    title: "Literary Particles",
    titleArabic: "الأدوات الأدبية",
    category: 'basics',
    difficulty: 4,
    order: 46,
    cefrLevel: 'B2',
    explanation: "Classical and literary Arabic uses special particles that modify meaning precisely. Key particles: إذ (since/at that moment — past), إذا الفجائية (suddenly — narrative present), قد (perfective with past = 'already', with present = possibility/certainty), لقد (strong affirmation = 'indeed'), رُبَّ (few/many — rhetorical), ما (negative/relative), أمّا (as for).",
    examples: [
      {arabic: "وإذ قال ربّك للملائكة", english: "and when your Lord said to the angels", transliteration: "wa-idh qaala rabbuka lil-malaa'ikati"},
      {arabic: "لقد خلقنا الإنسان في أحسن تقويم", english: "We have indeed created man in the best form", transliteration: "la-qad khalaqna al-insaana fi ahsani taqwiim"},
      {arabic: "رُبَّ كلمةٍ أشدّ من السيف", english: "many a word is sharper than a sword", transliteration: "rubba kalimatin ashaddu min as-sayf"}
    ],
    rules: [
      {rule: "إذ = past time reference 'when/since'; takes a past-tense clause", example: "إذ كنتُ شابًّا (when I was young)"},
      {rule: "قد + past = 'already/certainly'; قد + present = 'perhaps/may'", example: "قد جاء (he has already come) / قد يجيء (he may come)"},
      {rule: "رُبَّ is followed by indefinite genitive singular; means 'many a'", example: "رُبَّ صديقٍ أضرّ من عدو (many a friend harms more than an enemy)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ قال ربّك للملائكة... (and when your Lord said)', answer: 'إذ', options: ['إذ', 'إذا', 'لمّا', 'حين'] },
      { type: 'translate', prompt: '"He has already come" (using قد)', answer: 'قد جاء', options: ['قد جاء', 'لقد جاء', 'قد يجيء', 'إذ جاء'] },
      { type: 'fill-blank', prompt: 'لقد ___ الإنسانَ في أحسن تقويم (We created man in the best form)', answer: 'خلقنا', options: ['خلقنا', 'سنخلق', 'خُلق', 'يخلق'] },
      { type: 'translate', prompt: '"As for the student, he passed"', answer: 'أمّا الطالبُ فقد نجح', options: ['أمّا الطالبُ فقد نجح', 'الطالبُ قد نجح', 'إذ الطالبُ نجح', 'أمّا الطالبَ فنجح'] },
      { type: 'match', prompt: 'Match particle to function', pairs: [['إذ', 'past time reference (when)'], ['قد', 'perfective/possibility marker'], ['لقد', 'strong affirmation (indeed)'], ['رُبَّ', 'rhetorical quantifier (many a)']] },
      { type: 'true-false', statement: 'قد + present tense means "he has already done it"', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'لقد is used for strong affirmation with past actions', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'رُبَّ صديقٌ أضرّ من عدو (many a friend harms more)', error: 'صديقٌ', correction: 'صديقٍ', answer: 'صديقٌ', options: ['رُبَّ', 'صديقٌ', 'أضرّ', 'No error'] },
      { type: 'classify', prompt: 'Classify by particle function', categories: ['Time reference', 'Affirmation/emphasis', 'Rhetorical'], items: [{ text: 'إذ كنتُ صغيرًا', category: 'Time reference' }, { text: 'لقد نجحتُ', category: 'Affirmation/emphasis' }, { text: 'رُبَّ كلمةٍ', category: 'Rhetorical' }, { text: 'قد جاء الفرج', category: 'Affirmation/emphasis' }] },
      { type: 'cloze', text: '___ كنّا في الجاهلية ___ هدانا الله', blanks: [{ answer: 'إذ', options: ['إذ', 'إذا', 'حين'] }, { answer: 'فـ', options: ['فـ', 'ثم', 'و'] }] },
      { type: 'multiple-select', prompt: 'Select particles used for emphasis/affirmation:', correctAnswers: ['لقد', 'قد'], options: ['لقد', 'قد', 'إذ', 'رُبَّ', 'أمّا'], answer: 'لقد,قد' },
      { type: 'build-sentence', prompt: 'Build: "As for the teacher, he indeed succeeded"', answer: 'أمّا المعلمُ فلقد نجح', options: ['أمّا المعلمُ فلقد نجح', 'أمّا المعلمَ فلقد نجح', 'المعلمُ لقد نجح أمّا', 'أمّا المعلمُ لقد نجح'] },
    ],
    quiz: [
      { question: 'What does قد + past tense express?', options: ['Possibility', 'Something already completed / certainly done', 'Future hope', 'Negation'], correct: 1, explanation: 'قد + past tense = "already" or "certainly": قد جاء = "he has indeed/already come"' },
      { question: 'What follows رُبَّ in classical Arabic?', options: ['Definite noun nominative', 'Definite noun accusative', 'Indefinite noun genitive', 'Any noun'], correct: 2, explanation: 'رُبَّ is followed by an indefinite noun in the genitive: رُبَّ صديقٍ أضرّ من عدو' },
      { question: 'What is the difference between إذ and إذا?', options: ['They are identical', 'إذ = past reference; إذا = future/hypothetical condition or narrative surprise', 'إذ = condition; إذا = time', 'إذا = past only'], correct: 1, explanation: 'إذ refers to a past moment ("when/since at that time"), while إذا can introduce conditions (future) or narrative surprise (الفجائية)' },
      { question: 'أمّا requires what after the topic?', options: ['A verb directly', 'فـ (fa-) before the predicate', 'إنّ before the predicate', 'No special connector'], correct: 1, explanation: 'أمّا requires فـ (fa-) before the predicate: أمّا الطالبُ فقد نجح (as for the student, he has passed)' },
    ],
  },
  {
    id: 'formal-letter',
    title: "Formal Letter Writing",
    titleArabic: "كتابة الرسائل الرسمية",
    category: 'basics',
    difficulty: 4,
    order: 47,
    cefrLevel: 'B2',
    explanation: "Arabic formal letters (الرسائل الرسمية) follow prescribed conventions. Structure: (1) Heading with date/place, (2) بسم الله الرحمن الرحيم (optional), (3) Address formula (إلى / حضرة السيد...), (4) Greeting (السلام عليكم ورحمة الله), (5) أمّا بعد (transition), (6) Body, (7) Closing formula, (8) Signature.",
    examples: [
      {arabic: "حضرة المدير الموقّر", english: "To the esteemed director", transliteration: "hadhra al-mudiir al-muwaqqar"},
      {arabic: "أمّا بعد، يسعدني أن أتقدّم بطلبي", english: "Now then, I am pleased to submit my request", transliteration: "ammaa ba'du, yas'udunii an ataqqadama bi-talabii"},
      {arabic: "وتفضّلوا بقبول فائق الاحترام", english: "Please accept my highest regards", transliteration: "wa-tafaddal-uu bi-qabul faa'iq al-ihtiraam"}
    ],
    rules: [
      {rule: "Address formula uses حضرة + title + الموقّر/المحترم", example: "حضرة السيد رئيس الجامعة المحترم"},
      {rule: "أمّا بعد transitions from greeting to content", example: "السلام عليكم. أمّا بعد، فأودّ أن..."},
      {rule: "Closing formula uses تفضّل/تفضّلوا + بقبول + respect phrase", example: "تفضّلوا بقبول فائق التقدير والاحترام"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'حضرة ___ الموقّر (To the esteemed director)', answer: 'المدير', options: ['المدير', 'المدرسة', 'الكتاب', 'الطالب'] },
      { type: 'translate', prompt: '"Now then / Furthermore" (letter transition)', answer: 'أمّا بعد', options: ['أمّا بعد', 'ثم بعد', 'فيما بعد', 'بعد ذلك'] },
      { type: 'fill-blank', prompt: 'تفضّلوا بقبول ___ الاحترام (Please accept my highest regards)', answer: 'فائق', options: ['فائق', 'كثير', 'بعض', 'قليل'] },
      { type: 'word-order', prompt: 'Which is the correct letter opening sequence?', answer: 'السلام عليكم، أمّا بعد فأودّ...', options: ['السلام عليكم، أمّا بعد فأودّ...', 'أمّا بعد، السلام عليكم فأودّ...', 'فأودّ، السلام عليكم، أمّا بعد...', 'أودّ، أمّا بعد، السلام عليكم...'] },
      { type: 'match', prompt: 'Match letter section to Arabic phrase', pairs: [['Greeting', 'السلام عليكم ورحمة الله'], ['Transition', 'أمّا بعد'], ['Address', 'حضرة المدير المحترم'], ['Closing', 'تفضّلوا بقبول فائق الاحترام']] },
      { type: 'true-false', statement: 'أمّا بعد is placed before the greeting in an Arabic formal letter', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The address formula uses حضرة + title + الموقّر/المحترم', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'أمّا بعد، السلام عليكم ورحمة الله (letter opening)', error: 'أمّا بعد comes before greeting', correction: 'Greeting must come first', answer: 'أمّا بعد comes before greeting', options: ['حضرة المدير', 'أمّا بعد comes before greeting', 'الاحترام', 'No error'] },
      { type: 'classify', prompt: 'Classify each phrase by letter section', categories: ['Opening/greeting', 'Body transition', 'Closing'], items: [{ text: 'السلام عليكم ورحمة الله وبركاته', category: 'Opening/greeting' }, { text: 'أمّا بعد فأودّ أن أبلغكم', category: 'Body transition' }, { text: 'تفضّلوا بقبول فائق الاحترام', category: 'Closing' }, { text: 'حضرة الأستاذ الكريم', category: 'Opening/greeting' }] },
      { type: 'multiple-select', prompt: 'Select correct formal letter phrases:', correctAnswers: ['حضرة المدير المحترم', 'أمّا بعد', 'تفضّلوا بقبول فائق الاحترام'], options: ['حضرة المدير المحترم', 'يا صاحبي', 'أمّا بعد', 'تفضّلوا بقبول فائق الاحترام', 'ثم بعدها'], answer: 'حضرة المدير المحترم,أمّا بعد,تفضّلوا بقبول فائق الاحترام' },
      { type: 'cloze', text: 'حضرة ___ المحترم، السلام عليكم. ___ فأودّ أن أتقدّم بطلبي.', blanks: [{ answer: 'المدير', options: ['المدير', 'الطالب', 'الصديق'] }, { answer: 'أمّا بعد', options: ['أمّا بعد', 'ثم بعد', 'و بعد'] }] },
      { type: 'build-sentence', prompt: 'Build: "Please accept my highest respect and appreciation"', answer: 'تفضّلوا بقبول فائق التقدير والاحترام', options: ['تفضّلوا بقبول فائق التقدير والاحترام', 'تفضّلوا قبول فائق التقدير', 'تفضّل بقبول التقدير والاحترام', 'قبلوا فائق التقدير والاحترام'] },
    ],
    quiz: [
      { question: 'Where does أمّا بعد appear in an Arabic formal letter?', options: ['At the very start before everything', 'After the greeting, before the body', 'At the end after the signature', 'In the address line'], correct: 1, explanation: 'أمّا بعد comes after the greeting (السلام عليكم) and transitions into the body of the letter' },
      { question: 'What is the correct address formula for an Arabic formal letter?', options: ['عزيزي المدير', 'حضرة المدير المحترم', 'إلى المدير رجاءً', 'للمدير فحسب'], correct: 1, explanation: 'حضرة + title + المحترم/الموقّر is the standard formal address formula in Arabic letters' },
      { question: 'How do you close a formal Arabic letter?', options: ['مع السلامة', 'وداعًا', 'تفضّلوا بقبول فائق الاحترام', 'في أمان الله'], correct: 2, explanation: 'تفضّلوا بقبول فائق الاحترام (or التقدير والاحترام) is the standard formal closing formula' },
      { question: 'Which phrase correctly begins a formal letter body?', options: ['أمّا بعد فأودّ أن...', 'بعد السلام...', 'قصدي أن...', 'أريد أن أقول...'], correct: 0, explanation: 'أمّا بعد فأودّ أن... (Now then, I wish to...) — أمّا بعد is the standard transition phrase introducing the letter body' },
    ],
  },

  {
    id: 'idafa-complex',
    title: "Complex إضافة Chains",
    titleArabic: "الإضافة المركّبة",
    category: 'nouns',
    difficulty: 4,
    order: 48,
    cefrLevel: 'B2',
    explanation: "إضافة (construct state / genitive chain) links nouns together to show possession or relationship. In a simple إضافة, the first noun (مضاف) loses its nunation and article, and the second (مضاف إليه) is in the genitive. Complex chains extend this to three or more nouns, or add adjectives. Adjectives qualify the مضاف and must agree in definiteness.",
    examples: [
      {arabic: "كتابُ الطالبِ الجديدُ", english: "the student's new book", transliteration: "kitaabu at-taalibi al-jadiidu"},
      {arabic: "بابُ غرفةِ المديرِ", english: "the door of the director's room", transliteration: "baabu ghurfati al-mudiiri"},
      {arabic: "مدرسةُ تعليمِ اللغةِ العربيةِ", english: "the school of Arabic language teaching", transliteration: "madrasatu ta'liimi al-lughati al-'arabiyyati"}
    ],
    rules: [
      {rule: "مضاف loses ال and nunation", example: "كتاب + الطالب = كتابُ الطالبِ (not الكتاب or كتابٌ)"},
      {rule: "Adjective of مضاف comes after entire chain, definite", example: "كتابُ الطالبِ الجديدُ (الجديد is definite, qualifies كتاب)"},
      {rule: "Three-noun chains: each مضاف takes genitive as مضاف إليه", example: "بابُ غرفةِ البيتِ"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ الطالبِ على الطاولة (The student\'s book is on the table)', answer: 'كتابُ', options: ['كتابُ', 'الكتابُ', 'كتابٌ', 'كتابِ'] },
      { type: 'translate', prompt: '"the door of the director\'s room"', answer: 'بابُ غرفةِ المديرِ', options: ['بابُ غرفةِ المديرِ', 'الباب غرفة المدير', 'بابٌ غرفةٌ المديرِ', 'باب المدير غرفة'] },
      { type: 'fill-blank', prompt: 'كتابُ الطالبِ ___ (the student\'s new book — add adjective)', answer: 'الجديدُ', options: ['الجديدُ', 'جديدٌ', 'الجديدِ', 'جديدًا'] },
      { type: 'sentence-transformation', prompt: 'Form an إضافة chain: بيت + أخ + الطالب', answer: 'بيتُ أخِ الطالبِ', hint: 'Each مضاف loses nunation; final noun in genitive', options: ['بيتُ أخِ الطالبِ', 'البيتُ أخُ الطالبِ', 'بيتٌ أخٌ الطالبِ', 'بيتُ الأخِ الطالبُ'] },
      { type: 'match', prompt: 'Match إضافة to translation', pairs: [['قلمُ المعلمِ', 'the teacher\'s pen'], ['بابُ الغرفةِ', 'the door of the room'], ['كتابُ النحوِ', 'the grammar book'], ['مدرسةُ اللغةِ', 'the language school']] },
      { type: 'true-false', statement: 'In إضافة, the مضاف keeps its ال prefix', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The مضاف إليه is always in the genitive case', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'كتابُ الطالبِ جديدٌ (the student\'s book is new — standalone predicate)', error: 'No error — this is correct', correction: 'كتابُ الطالبِ جديدٌ is fine as a nominal sentence', answer: 'No error — this is correct', options: ['كتابُ', 'الطالبِ', 'جديدٌ', 'No error — this is correct'] },
      { type: 'classify', prompt: 'Classify as مضاف or مضاف إليه', categories: ['مضاف (first, no nunation)', 'مضاف إليه (genitive)'], items: [{ text: 'كتابُ in كتابُ الطالبِ', category: 'مضاف (first, no nunation)' }, { text: 'الطالبِ in كتابُ الطالبِ', category: 'مضاف إليه (genitive)' }, { text: 'بابُ in بابُ الغرفةِ', category: 'مضاف (first, no nunation)' }, { text: 'الغرفةِ in بابُ الغرفةِ', category: 'مضاف إليه (genitive)' }] },
      { type: 'cloze', text: 'قرأتُ ___ الأستاذِ الكبيرَ ووجدتُ ___ الفصلِ ممتازًا', blanks: [{ answer: 'كتابَ', options: ['كتابَ', 'الكتابَ', 'كتابٌ'] }, { answer: 'منهجَ', options: ['منهجَ', 'المنهجَ', 'منهجٌ'] }] },
      { type: 'multiple-select', prompt: 'Select correct إضافة constructions:', correctAnswers: ['كتابُ الطالبِ', 'بابُ الغرفةِ الكبيرُ'], options: ['كتابُ الطالبِ', 'الكتابُ الطالبِ', 'بابُ الغرفةِ الكبيرُ', 'بابٌ الغرفةِ الكبير'], answer: 'كتابُ الطالبِ,بابُ الغرفةِ الكبيرُ' },
      { type: 'build-sentence', prompt: 'Build: "the manager\'s office key" (3-noun chain)', answer: 'مفتاحُ مكتبِ المديرِ', options: ['مفتاحُ مكتبِ المديرِ', 'المفتاحُ مكتبُ المديرِ', 'مفتاحٌ مكتبٌ المديرِ', 'مفتاحُ المكتبِ المديرُ'] },
    ],
    quiz: [
      { question: 'In an إضافة construction, what does the مضاف lose?', options: ['Its last vowel', 'Its ال and nunation (tanwin)', 'Its gender', 'Its case ending'], correct: 1, explanation: 'The مضاف loses both its ال prefix and its nunation (ـٌ/ـٍ/ـًا endings): كتابٌ → كتابُ الطالبِ' },
      { question: 'What case is the مضاف إليه in?', options: ['Nominative', 'Accusative', 'Genitive', 'Depends on position'], correct: 2, explanation: 'The مضاف إليه is always in the genitive (مجرور) case' },
      { question: 'Where does an adjective modifying the مضاف appear?', options: ['Immediately after the مضاف', 'Between the مضاف and مضاف إليه', 'After the entire إضافة chain', 'Before the مضاف'], correct: 2, explanation: 'The adjective comes after the entire chain: كتابُ الطالبِ الجديدُ (الجديد comes last, is definite like its noun)' },
      { question: 'Which is a correct إضافة chain?', options: ['الكتابُ الطالبِ', 'كتابٌ الطالبِ', 'كتابُ الطالبِ', 'كتابُ طالبٌ'], correct: 2, explanation: 'كتابُ الطالبِ — مضاف has no ال and no nunation, مضاف إليه is genitive' },
    ],
  },

  {
    id: 'jussive-mood',
    title: "Jussive Mood (المجزوم)",
    titleArabic: "المجزوم",
    category: 'verbs',
    difficulty: 4,
    order: 49,
    cefrLevel: 'B2',
    explanation: "The jussive (المجزوم) is the third mood of the Arabic imperfect verb (alongside indicative المرفوع and subjunctive المنصوب). It is triggered by specific particles: لم (negation of past), لمّا (negation of recent past), لـ (command), and لا (prohibition). Its sign is sukuun on the last root letter (or deletion of ن for some forms).",
    examples: [
      {arabic: "لم يذهبْ إلى المدرسة", english: "he did not go to school", transliteration: "lam yadhhab ila al-madrasa"},
      {arabic: "لا تكذبْ!", english: "do not lie!", transliteration: "laa takdhib"},
      {arabic: "لِيذهبْ محمدٌ!", english: "let Muhammad go!", transliteration: "li-yadhhab Muhammadun"}
    ],
    rules: [
      {rule: "Jussive sign: sukuun on last root letter", example: "يذهبُ (indicative) → يذهبْ (jussive)"},
      {rule: "Five verb forms: delete the ن", example: "يذهبون → يذهبوا (jussive)"},
      {rule: "لم + jussive = negation of past", example: "لم يكتبْ (he did not write)"},
      {rule: "لا + jussive = prohibition", example: "لا تكذبْ (don't lie!)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'لم ___ إلى المدرسة (he did not go to school)', answer: 'يذهبْ', options: ['يذهبْ', 'يذهبُ', 'يذهبَ', 'ذهب'] },
      { type: 'translate', prompt: '"do not lie!" (using prohibition)', answer: 'لا تكذبْ', options: ['لا تكذبْ', 'لا تكذبُ', 'لم تكذبْ', 'لا كذبتَ'] },
      { type: 'fill-blank', prompt: 'لمّا ___ بعد (he has not come yet)', answer: 'يأتِ', options: ['يأتِ', 'يأتي', 'يأتيَ', 'أتى'] },
      { type: 'sentence-transformation', prompt: 'Negate with لم: ذهب إلى السوق', answer: 'لم يذهبْ إلى السوق', hint: 'لم + jussive negates past action', options: ['لم يذهبْ إلى السوق', 'لم يذهبُ إلى السوق', 'ما ذهب إلى السوق', 'لم ذهب إلى السوق'] },
      { type: 'match', prompt: 'Match particle to use', pairs: [['لم', 'past negation + jussive'], ['لمّا', 'negation of recent past (not yet)'], ['لا (prohibition)', 'command not to do'], ['لِـ', 'third-person command']] },
      { type: 'conjugation-drill', prompt: 'Give jussive of يكتب (for لم)', verb: 'يكتب', root: 'ك-ت-ب', pronoun: 'هو', paradigm: 'present', answer: 'يكتبْ', options: ['يكتبْ', 'يكتبُ', 'يكتبَ', 'كتبَ'] },
      { type: 'true-false', statement: 'لم + past tense verb is used for negating past actions', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The jussive sign on a regular verb is sukuun (ْ) on the last root letter', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'لم يذهبُ إلى المدرسة (he did not go)', error: 'يذهبُ', correction: 'يذهبْ', answer: 'يذهبُ', options: ['لم', 'يذهبُ', 'المدرسة', 'No error'] },
      { type: 'classify', prompt: 'Classify jussive usage', categories: ['Negation (لم/لمّا)', 'Prohibition (لا)', 'Command (لِـ)'], items: [{ text: 'لم يأكلْ', category: 'Negation (لم/لمّا)' }, { text: 'لا تأكلْ', category: 'Prohibition (لا)' }, { text: 'لِيأكلْ', category: 'Command (لِـ)' }, { text: 'لمّا يصلْ', category: 'Negation (لم/لمّا)' }] },
      { type: 'cloze', text: 'لم ___ الواجبَ ولمّا ___ بعد', blanks: [{ answer: 'يكتبْ', options: ['يكتبْ', 'يكتبُ', 'يكتبَ'] }, { answer: 'ينتهِ', options: ['ينتهِ', 'ينتهي', 'انتهى'] }] },
      { type: 'build-sentence', prompt: 'Build: "Do not forget your homework!"', answer: 'لا تنسَ واجبك!', options: ['لا تنسَ واجبك!', 'لا تنسى واجبك!', 'لم تنسَ واجبك', 'لا نسيتَ واجبك'] },
    ],
    quiz: [
      { question: 'What is the sign (marker) of the jussive mood on a regular verb?', options: ['Fatha (ـَ)', 'Kasra (ـِ)', 'Sukuun (ْ)', 'Damma (ـُ)'], correct: 2, explanation: 'The jussive (مجزوم) is marked by sukuun (ْ) on the last root letter: يذهبُ → يذهبْ' },
      { question: 'لم + jussive negates:', options: ['A future action', 'A past action (he did not do)', 'A habitual present action', 'A wish'], correct: 1, explanation: 'لم + jussive negates a past action: لم يكتبْ = "he did not write"' },
      { question: 'How do you say "do not go!" (prohibition)?', options: ['لم تذهبْ', 'لا تذهبُ', 'لا تذهبْ', 'لِتذهبْ'], correct: 2, explanation: 'Prohibition: لا + jussive → لا تذهبْ (do not go!) — لا here is نهي (prohibition)' },
      { question: 'In five-form verbs (like يذهبون), what is the jussive sign?', options: ['Sukuun on ن', 'Deletion of ن', 'Fatha on و', 'Kasra on ي'], correct: 1, explanation: 'For the five forms (أفعال الخمسة), the jussive is formed by deleting the final ن: يذهبون → يذهبوا' },
    ],
  },

  {
    id: 'subjunctive-mood',
    title: "Subjunctive Mood (المنصوب)",
    titleArabic: "المنصوب",
    category: 'verbs',
    difficulty: 4,
    order: 50,
    cefrLevel: 'B2',
    explanation: "The subjunctive (المنصوب) is the mood of the Arabic imperfect verb used after certain particles expressing purpose, hope, negation, or conditionality. Main particles: أن (that/to), لن (will not), كي (in order to), حتى (so that/until), لـ (for, purpose). The sign is fatha (ـَ) on the last root letter.",
    examples: [
      {arabic: "أريد أن أذهبَ", english: "I want to go", transliteration: "'ariidu an adhhaba"},
      {arabic: "لن يفوزَ الكسولُ", english: "the lazy one will never win", transliteration: "lan yafuuza al-kasuulu"},
      {arabic: "جئتُ كي أتعلّمَ", english: "I came in order to learn", transliteration: "ji'tu kay ata'allama"}
    ],
    rules: [
      {rule: "Subjunctive sign: fatha (ـَ) on last root letter", example: "يذهبُ (indicative) → يذهبَ (subjunctive after أن)"},
      {rule: "Five verb forms: delete ن", example: "يذهبون → يذهبوا (same as jussive visually — context tells them apart)"},
      {rule: "أن + subjunctive = infinitive-like purpose/wish", example: "أريد أن أقرأَ (I want to read)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'أريد أن ___ الكتابَ (I want to read the book)', answer: 'أقرأَ', options: ['أقرأَ', 'أقرأُ', 'قرأتُ', 'أقرأْ'] },
      { type: 'translate', prompt: '"The lazy one will never succeed" (using لن)', answer: 'لن ينجحَ الكسولُ', options: ['لن ينجحَ الكسولُ', 'لن ينجحُ الكسولُ', 'لم ينجحْ الكسولُ', 'لا ينجحُ الكسول'] },
      { type: 'fill-blank', prompt: 'جئتُ كي ___ العربية (I came to learn Arabic)', answer: 'أتعلّمَ', options: ['أتعلّمَ', 'أتعلّمُ', 'أتعلّمْ', 'تعلّمتُ'] },
      { type: 'sentence-transformation', prompt: 'Combine with أن: يريد + يسافر', answer: 'يريد أن يسافرَ', hint: 'أن + subjunctive (fatha on last root letter)', options: ['يريد أن يسافرَ', 'يريد أن يسافرُ', 'يريد أن يسافرْ', 'يريد يسافرَ'] },
      { type: 'match', prompt: 'Match particle to subjunctive context', pairs: [['أن', 'complementizer (to/that)'], ['لن', 'future negation'], ['كي', 'purpose (in order to)'], ['حتى', 'purpose/until']] },
      { type: 'conjugation-drill', prompt: 'Give subjunctive of يذهب (after أن)', verb: 'يذهب', root: 'ذ-ه-ب', pronoun: 'هو', paradigm: 'present', answer: 'يذهبَ', options: ['يذهبَ', 'يذهبُ', 'يذهبْ', 'ذهبَ'] },
      { type: 'true-false', statement: 'لن + subjunctive negates a future action', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'The subjunctive is marked by kasra on the last root letter', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'لن يفوزُ الكسولُ (the lazy one will not succeed)', error: 'يفوزُ', correction: 'يفوزَ', answer: 'يفوزُ', options: ['لن', 'يفوزُ', 'الكسولُ', 'No error'] },
      { type: 'classify', prompt: 'Classify the mood triggered by each particle', categories: ['Subjunctive (فتحة)', 'Jussive (سكون)'], items: [{ text: 'أن يذهبَ', category: 'Subjunctive (فتحة)' }, { text: 'لم يذهبْ', category: 'Jussive (سكون)' }, { text: 'لن يذهبَ', category: 'Subjunctive (فتحة)' }, { text: 'لا تذهبْ', category: 'Jussive (سكون)' }] },
      { type: 'cloze', text: 'أتمنّى أن ___ الدراسةَ وأن ___ بامتياز', blanks: [{ answer: 'أكملَ', options: ['أكملَ', 'أكملُ', 'أكملْ'] }, { answer: 'أنجحَ', options: ['أنجحَ', 'أنجحُ', 'أنجحْ'] }] },
      { type: 'build-sentence', prompt: 'Build: "He came in order to study"', answer: 'جاء كي يدرسَ', options: ['جاء كي يدرسَ', 'جاء كي يدرسُ', 'جاء لكي يدرسْ', 'جاء أن يدرسَ'] },
    ],
    quiz: [
      { question: 'What is the sign of the subjunctive mood?', options: ['Sukuun', 'Damma', 'Fatha', 'Kasra'], correct: 2, explanation: 'The subjunctive (المنصوب) is marked by fatha (ـَ) on the last root letter: يذهبُ → يذهبَ' },
      { question: 'لن + subjunctive expresses:', options: ['Past negation', 'Future negation', 'Prohibition', 'Condition'], correct: 1, explanation: 'لن + subjunctive negates a future action: لن يذهبَ = "he will never go"' },
      { question: 'Which is the correct form after أريد أن?', options: ['أذهبُ', 'أذهبْ', 'أذهبَ', 'ذهبتُ'], correct: 2, explanation: 'After أن, the verb takes the subjunctive: أذهبَ (fatha on the last root letter)' },
      { question: 'كي + subjunctive expresses:', options: ['Past negation', 'Prohibition', 'Purpose (in order to)', 'Condition'], correct: 2, explanation: 'كي + subjunctive expresses purpose: جئتُ كي أتعلّمَ (I came in order to learn)' },
    ],
  },

  {
    id: 'vocative-case',
    title: "Vocative (أسلوب النداء)",
    titleArabic: "أسلوب النداء",
    category: 'nouns',
    difficulty: 4,
    order: 51,
    cefrLevel: 'B2',
    explanation: "Vocative (النداء) is used to call or address someone. The main particles are: يا (most common), أيُّها (for groups with ال), أيَّتها (for feminine groups). The addressed noun (المنادى) takes different cases depending on type: single proper noun = nominative without nunation; indefinite/adjectival = accusative.",
    examples: [
      {arabic: "يا محمدُ تعال!", english: "O Muhammad, come!", transliteration: "yaa Muhammadu ta'aal"},
      {arabic: "يا طالبًا في الفصل", english: "O student in the class", transliteration: "yaa taaliban fi al-fasl"},
      {arabic: "يا أيُّها الناسُ", english: "O people!", transliteration: "yaa ayyuhaa an-naasu"}
    ],
    rules: [
      {rule: "يا + definite proper name: nominative without nunation", example: "يا محمدُ (not محمدًا)"},
      {rule: "يا + indefinite common noun: accusative", example: "يا رجلًا (O man)"},
      {rule: "يا أيُّها + definite noun: noun stays nominative", example: "يا أيُّها الطلابُ (O students!)"}
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'يا ___! تعال! (O Muhammad! Come! — proper noun)', answer: 'محمدُ', options: ['محمدُ', 'محمدًا', 'محمدٌ', 'محمدِ'] },
      { type: 'translate', prompt: '"O people!" (using يا أيُّها)', answer: 'يا أيُّها الناسُ', options: ['يا أيُّها الناسُ', 'يا الناسُ', 'يا أيُّها الناسَ', 'يا ناسُ'] },
      { type: 'fill-blank', prompt: 'يا ___ اسمعوا! (O students! Listen!)', answer: 'أيُّها الطلابُ', options: ['أيُّها الطلابُ', 'الطلابُ', 'طلابًا', 'أيُّها الطلابَ'] },
      { type: 'sentence-transformation', prompt: 'Make vocative: أنتِ معلمةٌ كريمةٌ → address her', answer: 'يا معلمةُ', hint: 'Definite proper/title noun: nominative without nunation', options: ['يا معلمةُ', 'يا معلمةً', 'يا أيَّتها معلمةٌ', 'يا المعلمةُ'] },
      { type: 'match', prompt: 'Match vocative construction to type', pairs: [['يا محمدُ', 'Proper noun — nominative'], ['يا رجلًا في الطريق', 'Indefinite described — accusative'], ['يا أيُّها الناسُ', 'Group with يا أيُّها'], ['يا أيَّتها البناتُ', 'Feminine group']] },
      { type: 'true-false', statement: 'يا + proper noun puts the noun in the accusative', answer: 'false', options: ['true', 'false'] },
      { type: 'true-false', statement: 'يا أيُّها is used before nouns with ال', answer: 'true', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'يا محمدًا تعال! (O Muhammad, come!)', error: 'محمدًا', correction: 'محمدُ', answer: 'محمدًا', options: ['يا', 'محمدًا', 'تعال', 'No error'] },
      { type: 'classify', prompt: 'Classify منادى type', categories: ['Proper noun (nominative)', 'Indefinite (accusative)', 'With يا أيُّها'], items: [{ text: 'يا عليُّ', category: 'Proper noun (nominative)' }, { text: 'يا طالبًا', category: 'Indefinite (accusative)' }, { text: 'يا أيُّها الكرامُ', category: 'With يا أيُّها' }, { text: 'يا فاطمةُ', category: 'Proper noun (nominative)' }] },
      { type: 'cloze', text: 'يا ___ استمعوا، يا ___ الناسِ اتّقوا الله', blanks: [{ answer: 'أيُّها الطلابُ', options: ['أيُّها الطلابُ', 'طلابُ', 'طلابًا'] }, { answer: 'أيُّها', options: ['أيُّها', 'كلَّ', 'يا'] }] },
      { type: 'multiple-select', prompt: 'Select correct vocative sentences:', correctAnswers: ['يا محمدُ تعال', 'يا أيُّها الناسُ استمعوا'], options: ['يا محمدُ تعال', 'يا محمدًا تعال', 'يا أيُّها الناسُ استمعوا', 'يا أيُّها الناسَ استمعوا'], answer: 'يا محمدُ تعال,يا أيُّها الناسُ استمعوا' },
      { type: 'build-sentence', prompt: 'Build: "O honorable teacher (f.), listen!" (group address)', answer: 'يا أيَّتها المعلمةُ الكريمةُ استمعي', options: ['يا أيَّتها المعلمةُ الكريمةُ استمعي', 'يا معلمةً كريمةً استمعي', 'يا أيُّها المعلمةُ الكريمةُ استمعي', 'يا المعلمةَ الكريمةَ استمعي'] },
    ],
    quiz: [
      { question: 'What case does يا + proper name put the noun in?', options: ['Accusative', 'Genitive', 'Nominative without nunation', 'Nominative with nunation'], correct: 2, explanation: 'يا + a single proper name: the noun is nominative (مرفوع) but without nunation: يا محمدُ (not محمدٌ)' },
      { question: 'How do you call out to a group using يا and ال?', options: ['يا + noun directly', 'يا أيُّها + definite noun', 'يا + noun in accusative', 'يا + noun in genitive'], correct: 1, explanation: 'For groups: يا أيُّها + definite noun: يا أيُّها الناسُ / يا أيُّها الطلابُ' },
      { question: 'What case does an indefinite منادى take?', options: ['Nominative', 'Genitive', 'Accusative', 'Construct state'], correct: 2, explanation: 'An indefinite منادى takes the accusative: يا رجلًا مررتُ به (O man whom I passed)' },
      { question: 'Which is correct for calling a group of women?', options: ['يا أيُّها النساءُ', 'يا أيَّتها النساءُ', 'يا النساءُ', 'يا نساءً'], correct: 1, explanation: 'يا أيَّتها is the feminine form of يا أيُّها: يا أيَّتها النساءُ (O women!)' },
    ],
  },

  {
    id: 'specification-tamyiz-2',
    title: 'Number Specification (تمييز العدد)',
    titleArabic: 'تمييز العدد',
    category: 'nouns',
    difficulty: 5,
    order: 52,
    cefrLevel: 'B2',
    explanation: `تمييز العدد (number specification) is the noun that clarifies the entity being counted. Arabic number-noun agreement has complex rules:
• 1-2: noun agrees in gender
• 3-10: noun takes plural, gender flips (number is opposite gender to noun)
• 11-12: noun agrees in gender, both parts inflected
• 13-19: first part flips, second part agrees
• 20-99: noun is singular accusative (تمييز)
• 100/1000: noun is singular genitive`,
    examples: [
      { arabic: 'ثلاثةُ كتبٍ', english: 'three books (مؤنث number, مذكر noun)', transliteration: 'thalaathat kutub' },
      { arabic: 'عشرونَ طالبًا', english: 'twenty students (singular accusative)', transliteration: 'ishruuna taaliban' },
      { arabic: 'مئةُ درهمٍ', english: 'one hundred dirhams (singular genitive)', transliteration: 'mi\'at dirham' },
    ],
    rules: [
      { rule: '3-10: number gender flips, noun is plural genitive', example: 'ثلاثةُ رجالٍ (three men) — number is feminine, noun masculine plural' },
      { rule: '20-99 (tens): noun is singular accusative تمييز', example: 'عشرونَ طالبًا (twenty students)' },
      { rule: '100/1000: noun is singular genitive', example: 'مئةُ كتابٍ (one hundred books)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'ثلاثةُ ___ (three books — مذكر plural genitive)', answer: 'كتبٍ', options: ['كتبٍ', 'كتبٌ', 'كتابًا', 'كتابٌ'] },
      { type: 'translate', prompt: 'twenty students (masculine)', answer: 'عشرونَ طالبًا', options: ['عشرونَ طالبًا', 'عشرونَ طلابٍ', 'عشرةُ طلابٍ', 'عشرونَ طالبٌ'] },
      { type: 'fill-blank', prompt: '___ طالبةً (twenty female students)', answer: 'عشرونَ', options: ['عشرونَ', 'عشرةُ', 'عشرٌ', 'عشرًا'] },
      { type: 'sentence-transformation', prompt: 'Change to "100 books": ثلاثةُ كتبٍ', answer: 'مئةُ كتابٍ', hint: '100: singular genitive', options: ['مئةُ كتابٍ', 'مئةُ كتبٍ', 'مئةً كتابًا', 'مئةُ الكتابِ'] },
      { type: 'match', prompt: 'Match number range to تمييز rule', pairs: [['3-10', 'Plural genitive, gender flips'], ['20-90', 'Singular accusative'], ['100/1000', 'Singular genitive'], ['11-12', 'Singular, gender agrees']] },
      { type: 'conjugation-drill', prompt: 'Give the تمييز form for: ثمانيةٌ + كتابٌ', verb: 'كتاب', root: 'ك-ت-ب', pronoun: 'plural', paradigm: 'past', answer: 'ثمانيةُ كتبٍ', options: ['ثمانيةُ كتبٍ', 'ثمانيُ كتابٍ', 'ثمانيةُ كتابًا', 'ثمانٍ كتابٌ'] },
      { type: 'true-false', statement: 'The number 5 takes a masculine form when counting feminine nouns', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'عشرونَ طالبًا is incorrect; it should be عشرونَ طلابٍ', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'عندي خمسةُ كتابٍ على الرف', error: 'كتابٍ', correction: 'كتبٍ', answer: 'كتابٍ', options: ['عندي', 'خمسةُ', 'كتابٍ', 'No error'] },
      { type: 'classify', prompt: 'Classify the تمييز rule used', categories: ['Plural genitive (3-10)', 'Singular accusative (20-99)', 'Singular genitive (100+)'], items: [{ text: 'أربعةُ أولادٍ', category: 'Plural genitive (3-10)' }, { text: 'خمسونَ طالبًا', category: 'Singular accusative (20-99)' }, { text: 'مئةُ درهمٍ', category: 'Singular genitive (100+)' }, { text: 'سبعةُ أيامٍ', category: 'Plural genitive (3-10)' }] },
      { type: 'multiple-select', prompt: 'Select the grammatically correct phrases:', correctAnswers: ['ثلاثةُ كتبٍ', 'عشرونَ طالبًا', 'مئةُ درهمٍ'], options: ['ثلاثةُ كتبٍ', 'ثلاثةُ كتابٍ', 'عشرونَ طالبًا', 'عشرونَ طلابٍ', 'مئةُ درهمٍ'], answer: 'ثلاثةُ كتبٍ,عشرونَ طالبًا,مئةُ درهمٍ' },
      { type: 'cloze', text: 'اشتريتُ ___ أقلامٍ و___ كتابًا من المكتبة', blanks: [{ answer: 'سبعةَ', options: ['سبعةَ', 'سبعٌ', 'سبعًا'] }, { answer: 'عشرين', options: ['عشرين', 'عشرةَ', 'عشرٌ'] }] },
      { type: 'build-sentence', prompt: 'Build: "There are fifteen female students in the class"', answer: 'في الفصل خمسَ عشرةَ طالبةً', options: ['في الفصل خمسَ عشرةَ طالبةً', 'في الفصل خمسةَ عشرَ طالبةً', 'في الفصل خمسَ عشرةَ طالبةٌ', 'في الفصل خمسةَ عشرةَ طالبةٍ'] },
    ],
    quiz: [
      { question: 'What form does the counted noun take with numbers 3-10?', options: ['Singular accusative', 'Plural genitive', 'Singular genitive', 'Dual nominative'], correct: 1, explanation: 'Numbers 3-10 require the counted noun in the plural genitive: ثلاثةُ كتبٍ (three books)' },
      { question: 'What form does the تمييز take with numbers 20-99?', options: ['Plural genitive', 'Dual nominative', 'Singular accusative', 'Singular genitive'], correct: 2, explanation: 'Numbers 20-99 (tens and compounds) require singular accusative تمييز: عشرونَ طالبًا' },
      { question: 'ثلاثةُ كتبٍ: why is the number feminine?', options: ['It is masculine', 'Gender flips for 3-10 (كتاب is masculine, so number is feminine)', 'كتاب is feminine', 'Numbers 3-10 are always feminine'], correct: 1, explanation: 'For numbers 3-10, the number takes the opposite gender of the noun. كتاب is masculine, so ثلاثة is feminine.' },
      { question: 'مئةُ كتابٍ: what case is كتابٍ?', options: ['Accusative', 'Nominative', 'Genitive', 'Construct'], correct: 2, explanation: 'After مئة and ألف, the noun is singular genitive: مئةُ كتابٍ, ألفُ درهمٍ' },
    ],
  },

  {
    id: 'circumstantial-hal-2',
    title: 'Sentential Circumstantial (الحال الجملة)',
    titleArabic: 'الحال الجملة',
    category: 'nouns',
    difficulty: 5,
    order: 53,
    cefrLevel: 'B2',
    explanation: `الحال (circumstantial clause) describes the state of the subject or object when the main action occurs — it answers "how?" or "in what condition?". الحال الجملة uses a full clause (verbal or nominal) instead of a single word (الحال المفرد).

Types:
• الحال الجملة الفعلية (verbal): جاء الطفلُ يبكي (The child came crying)
• الحال الجملة الاسمية (nominal): جلستُ والشمسُ تغرب (I sat while the sun was setting)
• Nominal الحال needs a واو الحال (circumstantial waw) to link it to the main clause.`,
    examples: [
      { arabic: 'جاء وهو يضحك', english: 'He came while laughing', transliteration: 'jaa\'a wa-huwa yadhak' },
      { arabic: 'غادرتُ البيتَ والمطرُ ينهمر', english: 'I left the house while the rain was pouring', transliteration: 'ghaadartu al-bayta wal-mataru yanhamiru' },
      { arabic: 'وجدتُه نائمًا', english: 'I found him sleeping (single-word حال)', transliteration: 'wajadtuhu naa\'iman' },
    ],
    rules: [
      { rule: 'الحال الجملة الفعلية: verbal clause directly follows ذو الحال without واو', example: 'جاء يركض (He came running)' },
      { rule: 'الحال الجملة الاسمية: requires واو الحال before the clause', example: 'جاء والكتابُ في يده (He came while the book was in his hand)' },
      { rule: 'The nominal حال clause needs a ضمير رابط (connecting pronoun) referring back to ذو الحال', example: 'جاء وهو فرحٌ — هو refers back to the subject' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'جاء ___ يضحك (He came laughing — verbal حال, no واو)', answer: 'وهو', options: ['وهو', 'ثم', 'لأن', 'حين'] },
      { type: 'translate', prompt: '"She left while singing"', answer: 'غادرتْ وهي تغنّي', options: ['غادرتْ وهي تغنّي', 'غادرتْ تغنّي', 'غادرتْ مع الغناء', 'غادرتْ بالغناء'] },
      { type: 'fill-blank', prompt: 'دخلَ المكتبةَ ___ الكتبُ في يديه (He entered while books were in his hands)', answer: 'و', options: ['و', 'في', 'ثم', 'أن'] },
      { type: 'sentence-transformation', prompt: 'Combine using حال clause: خرج الطفلُ + كان يبكي', answer: 'خرج الطفلُ وهو يبكي', hint: 'Nominal clause: use واو + pronoun', options: ['خرج الطفلُ وهو يبكي', 'خرج الطفلُ يبكي', 'خرج الطفلُ بكاءً', 'خرج الطفلُ لأنه يبكي'] },
      { type: 'match', prompt: 'Match حال type to example', pairs: [['الحال الجملة الفعلية', 'جاء يركض'], ['الحال الجملة الاسمية', 'جاء والكتابُ في يده'], ['الحال المفرد', 'جاء مسرعًا'], ['واو الحال', 'و before nominal clause']] },
      { type: 'true-false', statement: 'الحال الجملة الاسمية requires واو الحال before it', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'الحال الجملة الفعلية also requires واو الحال before it', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'جاء الطالبُ و يركض في الممر', error: 'و يركض', correction: 'يركض', answer: 'و يركض', options: ['جاء', 'الطالبُ', 'و يركض', 'No error'] },
      { type: 'classify', prompt: 'Classify each الحال type', categories: ['الحال المفرد', 'الحال الجملة الفعلية', 'الحال الجملة الاسمية'], items: [{ text: 'جاء يركض', category: 'الحال الجملة الفعلية' }, { text: 'جاء مسرعًا', category: 'الحال المفرد' }, { text: 'جاء والكتابُ في يده', category: 'الحال الجملة الاسمية' }, { text: 'وقف واثقًا', category: 'الحال المفرد' }] },
      { type: 'multiple-select', prompt: 'Select sentences with الحال الجملة الاسمية:', correctAnswers: ['جاء والريحُ تهبّ', 'سافرتُ والشمسُ تشرق'], options: ['جاء يركض', 'جاء والريحُ تهبّ', 'وصل مبتسمًا', 'سافرتُ والشمسُ تشرق'], answer: 'جاء والريحُ تهبّ,سافرتُ والشمسُ تشرق' },
      { type: 'cloze', text: 'وجدتُ الأستاذَ ___ يكتبُ على السبورة ___ الطلابُ يستمعون', blanks: [{ answer: 'وهو', options: ['وهو', 'وهي', 'يكون'] }, { answer: 'و', options: ['و', 'ثم', 'لما'] }] },
      { type: 'build-sentence', prompt: 'Build: "I studied while the music was playing (م: الموسيقى)"', answer: 'درستُ والموسيقى تعزف', options: ['درستُ والموسيقى تعزف', 'درستُ الموسيقى تعزف', 'درستُ وهو تعزف الموسيقى', 'درستُ بالموسيقى'] },
    ],
    quiz: [
      { question: 'What connects الحال الجملة الاسمية to the main clause?', options: ['أن', 'واو الحال', 'ما', 'لو'], correct: 1, explanation: 'Nominal circumstantial clauses require واو الحال (circumstantial waw) to connect them: جاء والكتابُ في يده' },
      { question: 'الحال الجملة الفعلية (verbal circumstantial clause) requires:', options: ['واو الحال before it', 'A connecting pronoun', 'Direct placement after ذو الحال without واو', 'Accusative marker'], correct: 2, explanation: 'Verbal حال clauses follow directly without واو: جاء يركض (He came running)' },
      { question: 'What function does هو in "جاء وهو يضحك" serve?', options: ['Subject of the main clause', 'Connecting pronoun (ضمير رابط) referring to جاء', 'Object of the clause', 'Question word'], correct: 1, explanation: 'هو is a ضمير رابط (connecting pronoun) — it refers back to the subject of the main clause, linking the circumstances to the same person.' },
      { question: 'Which sentence uses الحال correctly?', options: ['جاء و يركض', 'جاء يركض (verbal)', 'جاء والريحُ (no pronoun/verb)', 'جاء لأنه يركض'], correct: 1, explanation: 'Verbal الحال: جاء يركض — no واو needed. The verbal clause follows directly.' },
    ],
  },

  {
    id: 'style-variety',
    title: 'Rhetorical Styles (الأساليب البلاغية)',
    titleArabic: 'الأساليب البلاغية',
    category: 'vocabulary',
    difficulty: 5,
    order: 54,
    cefrLevel: 'B2',
    explanation: `الأساليب البلاغية are rhetorical constructions that add emphasis, contrast, or stylistic effect to Arabic sentences. Key styles at B2 level:

• أسلوب القصر (Restriction): إنّما، لا...إلا — limits a quality to one entity
  إنّما النجاحُ بالعمل (Success is only through work)
• أسلوب التوكيد (Emphasis): إنّ/أنّ + subject + predicate; repetition; لام التوكيد
  إنّ العلمَ نورٌ (Indeed, knowledge is light)
• أسلوب الشرط (Conditional): إن/إذا/لو — covered in complex-conditionals; here focus on لولا
  لولا الصبرُ لضعفَ الإنسانُ (Were it not for patience, man would weaken)
• أسلوب النفي (Negation emphasis): ما...إلا
  ما نجحَ إلا المجتهدُ (None succeeded but the diligent)`,
    examples: [
      { arabic: 'إنّما الصبرُ عند الصدمةِ الأولى', english: 'Patience is only at the first shock', transliteration: 'innamaa as-sabru inda as-sadmati al-uulaa' },
      { arabic: 'ما نجحَ إلا المجتهدُ', english: 'None succeeded but the diligent one', transliteration: 'maa najaha illaa al-mujtahidu' },
      { arabic: 'لولا العلمُ لجهلَ الناسُ', english: 'Were it not for knowledge, people would be ignorant', transliteration: 'lawlaa al-ilmu la-jahila an-naasu' },
    ],
    rules: [
      { rule: 'إنّما restricts the predicate to the stated subject (قصر)', example: 'إنّما العلمُ نورٌ (Knowledge — and only it — is light)' },
      { rule: 'ما...إلا: negative + إلا creates restriction', example: 'ما سافرَ إلا أحمدُ (None traveled but Ahmad)' },
      { rule: 'لولا (but for/were it not for): hypothetical condition; requires رفع after it', example: 'لولا المطرُ لجفّ الزرعُ (Were it not for rain, crops would dry)' },
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ النجاحُ بالجدّ والاجتهاد (Success is only through hard work)', answer: 'إنّما', options: ['إنّما', 'لأنّ', 'لكنّ', 'وإن'] },
      { type: 'translate', prompt: '"None succeeded but the diligent"', answer: 'ما نجحَ إلا المجتهدُ', options: ['ما نجحَ إلا المجتهدُ', 'لم ينجح المجتهدُ', 'إنّما نجحَ المجتهدُ', 'نجحَ المجتهدُ فقط'] },
      { type: 'fill-blank', prompt: 'لولا ___ لضاعَ الوقتُ (Were it not for organization, time would be lost)', answer: 'التنظيمُ', options: ['التنظيمُ', 'التنظيمَ', 'التنظيمِ', 'التنظيمًا'] },
      { type: 'sentence-transformation', prompt: 'Rewrite with قصر using إنّما: العلمُ يرفعُ الإنسانَ', answer: 'إنّما العلمُ يرفعُ الإنسانَ', hint: 'إنّما = restricts the quality to that subject', options: ['إنّما العلمُ يرفعُ الإنسانَ', 'لأنّ العلمَ يرفعُ الإنسانَ', 'ما العلمُ إلا رفيعٌ', 'العلمُ إنّما يرفعُ'] },
      { type: 'match', prompt: 'Match rhetorical style to particle', pairs: [['أسلوب القصر', 'إنّما / ما...إلا'], ['أسلوب التوكيد', 'إنّ + جملة اسمية'], ['أسلوب لولا', 'Hypothetical — were it not for'], ['أسلوب النفي والإثبات', 'ما...إلا (negation + exception)']] },
      { type: 'true-false', statement: 'إنّما is used to restrict a quality exclusively to the stated element', answer: 'true', options: ['true', 'false'] },
      { type: 'true-false', statement: 'لولا is followed by a noun in the accusative case', answer: 'false', options: ['true', 'false'] },
      { type: 'error-identification', sentence: 'لولا الصبرَ لفشلَ الكثيرُ', error: 'الصبرَ', correction: 'الصبرُ', answer: 'الصبرَ', options: ['لولا', 'الصبرَ', 'لفشلَ', 'No error'] },
      { type: 'classify', prompt: 'Classify each as the rhetorical style used', categories: ['قصر (إنّما)', 'قصر (ما...إلا)', 'لولا', 'توكيد (إنّ)'], items: [{ text: 'إنّما الحياةُ كفاح', category: 'قصر (إنّما)' }, { text: 'ما سافرَ إلا عليٌّ', category: 'قصر (ما...إلا)' }, { text: 'لولا الأملُ لضعفَ الإنسانُ', category: 'لولا' }, { text: 'إنّ العلمَ شرفٌ', category: 'توكيد (إنّ)' }] },
      { type: 'multiple-select', prompt: 'Select sentences using أسلوب القصر:', correctAnswers: ['إنّما النجاحُ بالعمل', 'ما فازَ إلا الصادقُ'], options: ['إنّما النجاحُ بالعمل', 'لولا العلمُ لجهلَ الناسُ', 'ما فازَ إلا الصادقُ', 'إنّ الصادقَ محبوبٌ'], answer: 'إنّما النجاحُ بالعمل,ما فازَ إلا الصادقُ' },
      { type: 'cloze', text: '___ الأمانةُ أساسُ كلِّ خيرٍ، وما يبقى ___ الصالحُ من الأعمال', blanks: [{ answer: 'إنّما', options: ['إنّما', 'لأنّ', 'وإن'] }, { answer: 'إلا', options: ['إلا', 'لكن', 'حتى'] }] },
      { type: 'build-sentence', prompt: 'Build: "Were it not for patience, the learner would fail"', answer: 'لولا الصبرُ لفشلَ المتعلّمُ', options: ['لولا الصبرُ لفشلَ المتعلّمُ', 'لولا الصبرَ لفشلَ المتعلّمُ', 'لو الصبرُ لم يفشل المتعلّمُ', 'إنّما الصبرُ يمنعُ الفشلَ'] },
    ],
    quiz: [
      { question: 'إنّما العلمُ نورٌ uses which rhetorical style?', options: ['أسلوب الشرط', 'أسلوب القصر (إنّما)', 'أسلوب التعجب', 'أسلوب النداء'], correct: 1, explanation: 'إنّما restricts the quality (نور = light) exclusively to العلم (knowledge) — this is أسلوب القصر.' },
      { question: 'What case does the noun after لولا take?', options: ['Accusative', 'Genitive', 'Nominative (مرفوع)', 'Construct state'], correct: 2, explanation: 'The noun after لولا is its grammatical subject and takes the nominative: لولا الصبرُ (not الصبرَ).' },
      { question: 'ما نجحَ إلا المجتهدُ: what style is this?', options: ['أسلوب التوكيد', 'أسلوب القصر بـ ما...إلا', 'أسلوب التعجب', 'أسلوب الشرط'], correct: 1, explanation: 'ما...إلا is the negation-restriction pattern (قصر): it restricts success to the diligent one only.' },
      { question: 'Which particle introduces hypothetical "were it not for"?', options: ['إن', 'لو', 'لولا', 'إذا'], correct: 2, explanation: 'لولا means "were it not for" — a hypothetical particle requiring the nominative case on the following noun.' },
    ],
  },
];

export const grammarCategories = [
  { id: 'basics', name: 'Basics', nameArabic: 'الأساسيات' },
  { id: 'nouns', name: 'Nouns', nameArabic: 'الأسماء' },
  { id: 'verbs', name: 'Verbs', nameArabic: 'الأفعال' },
  { id: 'questions', name: 'Questions', nameArabic: 'الأسئلة' },
  { id: 'prepositions', name: 'Prepositions', nameArabic: 'حروف الجر' },
  { id: 'vocabulary', name: 'Vocabulary', nameArabic: 'المفردات' },
];

export default grammarLessons;
