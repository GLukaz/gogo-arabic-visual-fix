/**
 * dialectItems.js — Dialect identification quiz data
 * 25+ items spanning MSA, Egyptian, Levantine, and Gulf Arabic
 *
 * Each item has:
 *   phrase          — Arabic text in the dialect
 *   transliteration — Romanized pronunciation
 *   english         — Meaning in English
 *   dialect         — Correct answer: 'MSA' | 'Egyptian' | 'Levantine' | 'Gulf'
 *   explanation     — Brief note on why it belongs to that dialect
 */

export const DIALECT_OPTIONS = ['MSA', 'Egyptian', 'Levantine', 'Gulf'];

export const DIALECT_ITEMS = [
  // ── Egyptian ──
  {
    phrase: 'إيه ده',
    transliteration: 'eih da',
    english: 'What is this?',
    dialect: 'Egyptian',
    explanation: '"إيه" is the Egyptian question word for "what" and "ده" is the Egyptian demonstrative pronoun for "this".',
  },
  {
    phrase: 'عايز أروح',
    transliteration: 'aayiz aroo7',
    english: 'I want to go',
    dialect: 'Egyptian',
    explanation: '"عايز" (wanting) is the distinctly Egyptian form; MSA uses "أريد" and Levantine uses "بدّي".',
  },
  {
    phrase: 'ازيّك',
    transliteration: 'izzayyak',
    english: 'How are you?',
    dialect: 'Egyptian',
    explanation: '"ازيّك" is the iconic Egyptian greeting. Levantine says "كيفك" and Gulf says "شلونك".',
  },
  {
    phrase: 'مفيش حاجة',
    transliteration: 'mafish 7aaga',
    english: 'There is nothing / No problem',
    dialect: 'Egyptian',
    explanation: '"مفيش" (there isn\'t) and "حاجة" (thing) are distinctly Egyptian vocabulary.',
  },
  {
    phrase: 'بتعمل إيه',
    transliteration: 'bita3mel eih',
    english: 'What are you doing?',
    dialect: 'Egyptian',
    explanation: 'The "ب" present tense prefix and "إيه" for "what" mark this as Egyptian dialect.',
  },
  {
    phrase: 'أنا مش فاهم',
    transliteration: 'ana mish faahim',
    english: 'I don\'t understand',
    dialect: 'Egyptian',
    explanation: '"مش" as a negation particle is characteristic of Egyptian Arabic.',
  },
  {
    phrase: 'الدنيا حر أوي',
    transliteration: 'id-dinya 7arr awi',
    english: 'It\'s very hot',
    dialect: 'Egyptian',
    explanation: '"أوي" meaning "very" is a distinctly Egyptian intensifier. MSA uses "جداً".',
  },

  // ── Levantine ──
  {
    phrase: 'شو هاد',
    transliteration: 'shu haad',
    english: 'What is this?',
    dialect: 'Levantine',
    explanation: '"شو" is the Levantine question word for "what" (from "أيّ شيء هو"). Gulf uses "شنو".',
  },
  {
    phrase: 'بدّي أروح',
    transliteration: 'biddi aroo7',
    english: 'I want to go',
    dialect: 'Levantine',
    explanation: '"بدّي" (I want) is the signature Levantine volitional form. Egyptian uses "عايز" and Gulf uses "أبي".',
  },
  {
    phrase: 'كيفك',
    transliteration: 'kiifak',
    english: 'How are you?',
    dialect: 'Levantine',
    explanation: '"كيفك" is the standard Levantine greeting, derived from MSA "كيف حالك" but shortened.',
  },
  {
    phrase: 'ما في شي',
    transliteration: 'maa fii shi',
    english: 'There is nothing',
    dialect: 'Levantine',
    explanation: '"ما في" (there isn\'t) and "شي" (thing) are Levantine vocabulary markers.',
  },
  {
    phrase: 'هلأ مشغول',
    transliteration: 'halla2 mashghool',
    english: 'I\'m busy right now',
    dialect: 'Levantine',
    explanation: '"هلأ" meaning "now" is distinctly Levantine. Egyptian says "دلوقتي" and MSA says "الآن".',
  },
  {
    phrase: 'لوين رايح',
    transliteration: 'la-wein raaye7',
    english: 'Where are you going?',
    dialect: 'Levantine',
    explanation: '"لوين" (to where) is a Levantine contraction of "إلى أين". Egyptian says "رايح فين".',
  },
  {
    phrase: 'منيح كتير',
    transliteration: 'mnii7 ktiir',
    english: 'Very good',
    dialect: 'Levantine',
    explanation: '"منيح" (good) is Levantine. Egyptian says "كويس" and Gulf says "زين".',
  },

  // ── Gulf ──
  {
    phrase: 'شنو هذا',
    transliteration: 'shinu haatha',
    english: 'What is this?',
    dialect: 'Gulf',
    explanation: '"شنو" is the Gulf question word for "what". Egyptian uses "إيه" and Levantine uses "شو".',
  },
  {
    phrase: 'أبي أروح',
    transliteration: 'abi aroo7',
    english: 'I want to go',
    dialect: 'Gulf',
    explanation: '"أبي" (I want) is the distinctly Gulf volitional form, literally "my father wants" but meaning "I want".',
  },
  {
    phrase: 'شلونك',
    transliteration: 'shloonak',
    english: 'How are you?',
    dialect: 'Gulf',
    explanation: '"شلونك" is the Gulf greeting from "شو لونك" (what is your color/state).',
  },
  {
    phrase: 'وين تبي تروح',
    transliteration: 'wein tibi troo7',
    english: 'Where do you want to go?',
    dialect: 'Gulf',
    explanation: '"وين" (where) and "تبي" (you want) are Gulf dialect markers.',
  },
  {
    phrase: 'ما عندي سالفة',
    transliteration: 'maa 3indi saalfa',
    english: 'I have nothing to say',
    dialect: 'Gulf',
    explanation: '"سالفة" (story/matter) in this context is distinctly Gulf vocabulary.',
  },
  {
    phrase: 'إنزين خلاص',
    transliteration: 'inzein khalaas',
    english: 'Alright, that\'s enough',
    dialect: 'Gulf',
    explanation: '"إنزين" (alright/OK) is a Gulf dialect filler word not found in other dialects.',
  },
  {
    phrase: 'يالله نطلع',
    transliteration: 'yallah nitla3',
    english: 'Let\'s go out',
    dialect: 'Gulf',
    explanation: '"نطلع" (we go out) with this pronunciation and usage pattern is Gulf. Levantine would say "يلّا نروح".',
  },

  // ── MSA (Modern Standard Arabic) ──
  {
    phrase: 'ما هذا',
    transliteration: 'maa haathaa',
    english: 'What is this?',
    dialect: 'MSA',
    explanation: '"ما" as an interrogative + "هذا" with full pronunciation is standard MSA, used in formal writing and media.',
  },
  {
    phrase: 'أريد أن أذهب',
    transliteration: 'uriidu an athhab',
    english: 'I want to go',
    dialect: 'MSA',
    explanation: '"أريد" (I want) + "أن" + subjunctive "أذهب" is formal MSA grammar with case endings.',
  },
  {
    phrase: 'كيف حالك',
    transliteration: 'kayfa 7aaluk',
    english: 'How are you?',
    dialect: 'MSA',
    explanation: '"كيف حالك" is the formal MSA greeting used in writing, news, and formal speech.',
  },
  {
    phrase: 'لا يوجد شيء',
    transliteration: 'laa yuujad shay\'',
    english: 'There is nothing',
    dialect: 'MSA',
    explanation: '"لا يوجد" (there does not exist) is the formal MSA existential negation.',
  },
  {
    phrase: 'ذهبت إلى المدرسة',
    transliteration: 'thahabtu ilaa al-madrasa',
    english: 'I went to school',
    dialect: 'MSA',
    explanation: 'Past tense verb "ذهبتُ" with "-tu" ending and "إلى" preposition is formal MSA grammar.',
  },
  {
    phrase: 'هل تتحدث العربية',
    transliteration: 'hal tatahaddath al-3arabiyya',
    english: 'Do you speak Arabic?',
    dialect: 'MSA',
    explanation: '"هل" interrogative particle + Form V verb "تتحدث" is a hallmark of MSA formal register.',
  },
  {
    phrase: 'من فضلك أعطني الكتاب',
    transliteration: 'min fadlika a3tini al-kitaab',
    english: 'Please give me the book',
    dialect: 'MSA',
    explanation: '"من فضلك" (please) + imperative "أعطني" with definite article "الكتاب" is standard MSA.',
  },
  {
    phrase: 'يجب أن نتعاون',
    transliteration: 'yajibu an nata3aawan',
    english: 'We must cooperate',
    dialect: 'MSA',
    explanation: '"يجب أن" + subjunctive is MSA formal obligation structure. Dialects simplify this heavily.',
  },
];
