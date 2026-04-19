/**
 * Number Challenge Data — Arabic numeral mappings + question generators
 *
 * Phase 85 — Mini-Game Expansion
 *
 * Covers Arabic-Indic numerals (٠-٩), number words 0-100,
 * and question generators for 4 difficulty levels.
 */

/** Arabic-Indic numeral glyphs */
export const ARABIC_NUMERALS = {
  0: '٠', 1: '١', 2: '٢', 3: '٣', 4: '٤',
  5: '٥', 6: '٦', 7: '٧', 8: '٨', 9: '٩',
};

/** Convert a western number to Arabic-Indic numeral string */
export function toArabicNumerals(num) {
  return String(num)
    .split('')
    .map((d) => ARABIC_NUMERALS[d] ?? d)
    .join('');
}

/** Convert Arabic-Indic numeral string back to a western number */
export function fromArabicNumerals(str) {
  const reverseMap = {};
  for (const [western, arabic] of Object.entries(ARABIC_NUMERALS)) {
    reverseMap[arabic] = western;
  }
  const westernStr = String(str)
    .split('')
    .map((ch) => reverseMap[ch] ?? ch)
    .join('');
  return parseInt(westernStr, 10);
}

/** Arabic number words 0-100 */
export const NUMBER_WORDS = [
  { value: 0, arabic: 'صفر', english: 'zero' },
  { value: 1, arabic: 'واحد', english: 'one' },
  { value: 2, arabic: 'اثنان', english: 'two' },
  { value: 3, arabic: 'ثلاثة', english: 'three' },
  { value: 4, arabic: 'اربعة', english: 'four' },
  { value: 5, arabic: 'خمسة', english: 'five' },
  { value: 6, arabic: 'ستة', english: 'six' },
  { value: 7, arabic: 'سبعة', english: 'seven' },
  { value: 8, arabic: 'ثمانية', english: 'eight' },
  { value: 9, arabic: 'تسعة', english: 'nine' },
  { value: 10, arabic: 'عشرة', english: 'ten' },
  { value: 11, arabic: 'احد عشر', english: 'eleven' },
  { value: 12, arabic: 'اثنا عشر', english: 'twelve' },
  { value: 13, arabic: 'ثلاثة عشر', english: 'thirteen' },
  { value: 14, arabic: 'اربعة عشر', english: 'fourteen' },
  { value: 15, arabic: 'خمسة عشر', english: 'fifteen' },
  { value: 16, arabic: 'ستة عشر', english: 'sixteen' },
  { value: 17, arabic: 'سبعة عشر', english: 'seventeen' },
  { value: 18, arabic: 'ثمانية عشر', english: 'eighteen' },
  { value: 19, arabic: 'تسعة عشر', english: 'nineteen' },
  { value: 20, arabic: 'عشرون', english: 'twenty' },
  { value: 21, arabic: 'واحد وعشرون', english: 'twenty-one' },
  { value: 22, arabic: 'اثنان وعشرون', english: 'twenty-two' },
  { value: 23, arabic: 'ثلاثة وعشرون', english: 'twenty-three' },
  { value: 24, arabic: 'اربعة وعشرون', english: 'twenty-four' },
  { value: 25, arabic: 'خمسة وعشرون', english: 'twenty-five' },
  { value: 26, arabic: 'ستة وعشرون', english: 'twenty-six' },
  { value: 27, arabic: 'سبعة وعشرون', english: 'twenty-seven' },
  { value: 28, arabic: 'ثمانية وعشرون', english: 'twenty-eight' },
  { value: 29, arabic: 'تسعة وعشرون', english: 'twenty-nine' },
  { value: 30, arabic: 'ثلاثون', english: 'thirty' },
  { value: 31, arabic: 'واحد وثلاثون', english: 'thirty-one' },
  { value: 32, arabic: 'اثنان وثلاثون', english: 'thirty-two' },
  { value: 33, arabic: 'ثلاثة وثلاثون', english: 'thirty-three' },
  { value: 34, arabic: 'اربعة وثلاثون', english: 'thirty-four' },
  { value: 35, arabic: 'خمسة وثلاثون', english: 'thirty-five' },
  { value: 36, arabic: 'ستة وثلاثون', english: 'thirty-six' },
  { value: 37, arabic: 'سبعة وثلاثون', english: 'thirty-seven' },
  { value: 38, arabic: 'ثمانية وثلاثون', english: 'thirty-eight' },
  { value: 39, arabic: 'تسعة وثلاثون', english: 'thirty-nine' },
  { value: 40, arabic: 'اربعون', english: 'forty' },
  { value: 41, arabic: 'واحد واربعون', english: 'forty-one' },
  { value: 42, arabic: 'اثنان واربعون', english: 'forty-two' },
  { value: 43, arabic: 'ثلاثة واربعون', english: 'forty-three' },
  { value: 44, arabic: 'اربعة واربعون', english: 'forty-four' },
  { value: 45, arabic: 'خمسة واربعون', english: 'forty-five' },
  { value: 46, arabic: 'ستة واربعون', english: 'forty-six' },
  { value: 47, arabic: 'سبعة واربعون', english: 'forty-seven' },
  { value: 48, arabic: 'ثمانية واربعون', english: 'forty-eight' },
  { value: 49, arabic: 'تسعة واربعون', english: 'forty-nine' },
  { value: 50, arabic: 'خمسون', english: 'fifty' },
  { value: 51, arabic: 'واحد وخمسون', english: 'fifty-one' },
  { value: 52, arabic: 'اثنان وخمسون', english: 'fifty-two' },
  { value: 53, arabic: 'ثلاثة وخمسون', english: 'fifty-three' },
  { value: 54, arabic: 'اربعة وخمسون', english: 'fifty-four' },
  { value: 55, arabic: 'خمسة وخمسون', english: 'fifty-five' },
  { value: 56, arabic: 'ستة وخمسون', english: 'fifty-six' },
  { value: 57, arabic: 'سبعة وخمسون', english: 'fifty-seven' },
  { value: 58, arabic: 'ثمانية وخمسون', english: 'fifty-eight' },
  { value: 59, arabic: 'تسعة وخمسون', english: 'fifty-nine' },
  { value: 60, arabic: 'ستون', english: 'sixty' },
  { value: 61, arabic: 'واحد وستون', english: 'sixty-one' },
  { value: 62, arabic: 'اثنان وستون', english: 'sixty-two' },
  { value: 63, arabic: 'ثلاثة وستون', english: 'sixty-three' },
  { value: 64, arabic: 'اربعة وستون', english: 'sixty-four' },
  { value: 65, arabic: 'خمسة وستون', english: 'sixty-five' },
  { value: 66, arabic: 'ستة وستون', english: 'sixty-six' },
  { value: 67, arabic: 'سبعة وستون', english: 'sixty-seven' },
  { value: 68, arabic: 'ثمانية وستون', english: 'sixty-eight' },
  { value: 69, arabic: 'تسعة وستون', english: 'sixty-nine' },
  { value: 70, arabic: 'سبعون', english: 'seventy' },
  { value: 71, arabic: 'واحد وسبعون', english: 'seventy-one' },
  { value: 72, arabic: 'اثنان وسبعون', english: 'seventy-two' },
  { value: 73, arabic: 'ثلاثة وسبعون', english: 'seventy-three' },
  { value: 74, arabic: 'اربعة وسبعون', english: 'seventy-four' },
  { value: 75, arabic: 'خمسة وسبعون', english: 'seventy-five' },
  { value: 76, arabic: 'ستة وسبعون', english: 'seventy-six' },
  { value: 77, arabic: 'سبعة وسبعون', english: 'seventy-seven' },
  { value: 78, arabic: 'ثمانية وسبعون', english: 'seventy-eight' },
  { value: 79, arabic: 'تسعة وسبعون', english: 'seventy-nine' },
  { value: 80, arabic: 'ثمانون', english: 'eighty' },
  { value: 81, arabic: 'واحد وثمانون', english: 'eighty-one' },
  { value: 82, arabic: 'اثنان وثمانون', english: 'eighty-two' },
  { value: 83, arabic: 'ثلاثة وثمانون', english: 'eighty-three' },
  { value: 84, arabic: 'اربعة وثمانون', english: 'eighty-four' },
  { value: 85, arabic: 'خمسة وثمانون', english: 'eighty-five' },
  { value: 86, arabic: 'ستة وثمانون', english: 'eighty-six' },
  { value: 87, arabic: 'سبعة وثمانون', english: 'eighty-seven' },
  { value: 88, arabic: 'ثمانية وثمانون', english: 'eighty-eight' },
  { value: 89, arabic: 'تسعة وثمانون', english: 'eighty-nine' },
  { value: 90, arabic: 'تسعون', english: 'ninety' },
  { value: 91, arabic: 'واحد وتسعون', english: 'ninety-one' },
  { value: 92, arabic: 'اثنان وتسعون', english: 'ninety-two' },
  { value: 93, arabic: 'ثلاثة وتسعون', english: 'ninety-three' },
  { value: 94, arabic: 'اربعة وتسعون', english: 'ninety-four' },
  { value: 95, arabic: 'خمسة وتسعون', english: 'ninety-five' },
  { value: 96, arabic: 'ستة وتسعون', english: 'ninety-six' },
  { value: 97, arabic: 'سبعة وتسعون', english: 'ninety-seven' },
  { value: 98, arabic: 'ثمانية وتسعون', english: 'ninety-eight' },
  { value: 99, arabic: 'تسعة وتسعون', english: 'ninety-nine' },
  { value: 100, arabic: 'مئة', english: 'one hundred' },
];

/**
 * Generate a random number within a range (inclusive).
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle array (Fisher-Yates).
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Question types:
 *  'identify'     — Show Arabic numeral, pick the western number
 *  'select'       — Show a western number, pick the Arabic numeral
 *  'arithmetic'   — Simple addition or subtraction with Arabic numerals
 *  'wordMatch'    — Show Arabic word form, pick the value
 */
export const QUESTION_TYPES = ['identify', 'select', 'arithmetic', 'wordMatch'];

/**
 * Generate a single number challenge question.
 *
 * @param {number} difficulty  1-4
 *   1 — single digits (0-9), identify/select
 *   2 — two-digit numbers (10-99), identify/select
 *   3 — arithmetic with single/double digits (+ -)
 *   4 — word-form matching (0-100)
 * @returns {{ type, prompt, correctAnswer, choices }}
 */
export function generateNumberQuestion(difficulty = 1) {
  switch (difficulty) {
    case 1:
      return _generateIdentifyQuestion(0, 9);
    case 2:
      return _generateIdentifyQuestion(10, 99);
    case 3:
      return _generateArithmeticQuestion();
    case 4:
      return _generateWordMatchQuestion();
    default:
      return _generateIdentifyQuestion(0, 9);
  }
}

/** Difficulty 1-2: identify / select */
function _generateIdentifyQuestion(min, max) {
  const isIdentify = Math.random() < 0.5;
  const value = randInt(min, max);

  if (isIdentify) {
    // Show Arabic numeral -> pick western value
    const arabicNum = toArabicNumerals(value);
    const wrongChoices = _generateWrongNumbers(value, min, max, 3);
    const choices = shuffle([value, ...wrongChoices]);

    return {
      type: 'identify',
      prompt: arabicNum,
      promptLabel: 'What number is this?',
      correctAnswer: value,
      choices: choices.map((v) => ({ label: String(v), value: v })),
    };
  } else {
    // Show western number -> pick Arabic numeral
    const arabicNum = toArabicNumerals(value);
    const wrongValues = _generateWrongNumbers(value, min, max, 3);
    const wrongArabic = wrongValues.map((v) => toArabicNumerals(v));
    const allChoices = shuffle([
      { label: arabicNum, value },
      ...wrongValues.map((v, i) => ({ label: wrongArabic[i], value: v })),
    ]);

    return {
      type: 'select',
      prompt: String(value),
      promptLabel: 'Select the Arabic numeral:',
      correctAnswer: value,
      choices: allChoices,
    };
  }
}

/** Difficulty 3: arithmetic */
function _generateArithmeticQuestion() {
  const isAdd = Math.random() < 0.5;
  let a, b, answer;

  if (isAdd) {
    a = randInt(1, 50);
    b = randInt(1, 50);
    answer = a + b;
  } else {
    a = randInt(10, 99);
    b = randInt(1, a); // ensure non-negative result
    answer = a - b;
  }

  const op = isAdd ? '+' : '-';
  const prompt = `${toArabicNumerals(a)} ${op} ${toArabicNumerals(b)} = ?`;
  const wrongChoices = _generateWrongNumbers(answer, Math.max(0, answer - 10), answer + 10, 3);
  const choices = shuffle([answer, ...wrongChoices]);

  return {
    type: 'arithmetic',
    prompt,
    promptLabel: 'Solve:',
    correctAnswer: answer,
    choices: choices.map((v) => ({ label: String(v), value: v })),
  };
}

/** Difficulty 4: word form matching */
function _generateWordMatchQuestion() {
  const entry = NUMBER_WORDS[randInt(0, NUMBER_WORDS.length - 1)];
  const isArabicToValue = Math.random() < 0.5;

  if (isArabicToValue) {
    // Show Arabic word -> pick the number
    const wrongValues = _generateWrongNumbers(entry.value, 0, 100, 3);
    const choices = shuffle([entry.value, ...wrongValues]);

    return {
      type: 'wordMatch',
      prompt: entry.arabic,
      promptLabel: 'What number is this word?',
      correctAnswer: entry.value,
      choices: choices.map((v) => ({ label: String(v), value: v })),
    };
  } else {
    // Show number -> pick Arabic word
    const wrongEntries = _getRandomEntries(entry.value, 3);
    const allChoices = shuffle([
      { label: entry.arabic, value: entry.value },
      ...wrongEntries.map((e) => ({ label: e.arabic, value: e.value })),
    ]);

    return {
      type: 'wordMatch',
      prompt: String(entry.value),
      promptLabel: 'Select the Arabic word for this number:',
      correctAnswer: entry.value,
      choices: allChoices,
    };
  }
}

/** Generate N unique wrong numbers near the correct answer */
function _generateWrongNumbers(correct, min, max, count) {
  const wrongs = new Set();
  let attempts = 0;
  while (wrongs.size < count && attempts < 100) {
    const v = randInt(Math.max(0, min), max);
    if (v !== correct) wrongs.add(v);
    attempts++;
  }
  // Fallback if range is too small
  let fallback = 1;
  while (wrongs.size < count) {
    if (correct + fallback <= 999 && !wrongs.has(correct + fallback)) {
      wrongs.add(correct + fallback);
    }
    if (correct - fallback >= 0 && !wrongs.has(correct - fallback)) {
      wrongs.add(correct - fallback);
    }
    fallback++;
  }
  return Array.from(wrongs).slice(0, count);
}

/** Get N random NUMBER_WORDS entries excluding a given value */
function _getRandomEntries(excludeValue, count) {
  const pool = NUMBER_WORDS.filter((e) => e.value !== excludeValue);
  return shuffle(pool).slice(0, count);
}
