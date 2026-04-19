/**
 * Crossword Puzzles — Pre-built grids with numbered clues
 *
 * Phase 85 — Mini-Game Expansion
 *
 * Clues in English, answers in Arabic letters (one per cell).
 * 15 puzzles across easy / medium / hard / A1-A2 CEFR levels.
 *
 * Each cell has row, col, the letter that belongs there,
 * and which clue numbers (across/down) it belongs to.
 */

const CROSSWORD_PUZZLES = [
  // ─── EASY / A1 (8x8 grids) ──────────────────────────────────
  {
    id: 'cw-easy-01',
    difficulty: 'easy',
    cefrLevel: 'A1',
    title: 'Greetings',
    titleArabic: 'تحيات',
    size: { rows: 8, cols: 8 },
    cells: [
      // 1-Across: مرحبا (hello) — row 0, cols 0-4
      { row: 0, col: 0, letter: 'م', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ر', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ح', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'ب', clueAcross: 1, clueDown: null },
      { row: 0, col: 4, letter: 'ا', clueAcross: 1, clueDown: 2 },
      // 2-Down: اسم (name) — col 4, rows 0-2
      { row: 1, col: 4, letter: 'س', clueAcross: null, clueDown: 2 },
      { row: 2, col: 4, letter: 'م', clueAcross: null, clueDown: 2 },
      // 3-Across: شكرا (thank you) — row 2, cols 0-3
      { row: 2, col: 0, letter: 'ش', clueAcross: 3, clueDown: null },
      { row: 2, col: 1, letter: 'ك', clueAcross: 3, clueDown: null },
      { row: 2, col: 2, letter: 'ر', clueAcross: 3, clueDown: null },
      { row: 2, col: 3, letter: 'ا', clueAcross: 3, clueDown: null },
      // 4-Across: نعم (yes) — row 4, cols 0-2
      { row: 4, col: 0, letter: 'ن', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ع', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'م', clueAcross: 4, clueDown: null },
      // 5-Across: لا (no) — row 6, cols 0-1
      { row: 6, col: 0, letter: 'ل', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ا', clueAcross: 5, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Hello / Welcome', answer: 'marhaba', answerArabic: 'مرحبا' },
      { number: 3, clue: 'Thank you', answer: 'shukran', answerArabic: 'شكرا' },
      { number: 4, clue: 'Yes', answer: 'naam', answerArabic: 'نعم' },
      { number: 5, clue: 'No', answer: 'la', answerArabic: 'لا' },
    ],
    cluesDown: [
      { number: 2, clue: 'Name', answer: 'ism', answerArabic: 'اسم' },
    ],
  },
  {
    id: 'cw-easy-02',
    difficulty: 'easy',
    cefrLevel: 'A1',
    title: 'Animals',
    titleArabic: 'حيوانات',
    size: { rows: 8, cols: 8 },
    cells: [
      // 1-Across: قطة (cat) — row 0, cols 0-2
      { row: 0, col: 0, letter: 'ق', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ط', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ة', clueAcross: 1, clueDown: null },
      // 2-Across: كلب (dog) — row 2, cols 0-2
      { row: 2, col: 0, letter: 'ك', clueAcross: 2, clueDown: 3 },
      { row: 2, col: 1, letter: 'ل', clueAcross: 2, clueDown: null },
      { row: 2, col: 2, letter: 'ب', clueAcross: 2, clueDown: null },
      // 3-Down: كتاب (book — a red herring? No, just animals) — actually keep it animals
      // Let's use: كبش (ram) — col 0, rows 2-4
      { row: 3, col: 0, letter: 'ب', clueAcross: null, clueDown: 3 },
      { row: 4, col: 0, letter: 'ش', clueAcross: null, clueDown: 3 },
      // 4-Across: بقرة (cow) — row 4, cols 2-5
      { row: 4, col: 2, letter: 'ب', clueAcross: 4, clueDown: null },
      { row: 4, col: 3, letter: 'ق', clueAcross: 4, clueDown: null },
      { row: 4, col: 4, letter: 'ر', clueAcross: 4, clueDown: null },
      { row: 4, col: 5, letter: 'ة', clueAcross: 4, clueDown: null },
      // 5-Across: حصان (horse) — row 6, cols 0-3
      { row: 6, col: 0, letter: 'ح', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ص', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ا', clueAcross: 5, clueDown: null },
      { row: 6, col: 3, letter: 'ن', clueAcross: 5, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Cat', answer: 'qitta', answerArabic: 'قطة' },
      { number: 2, clue: 'Dog', answer: 'kalb', answerArabic: 'كلب' },
      { number: 4, clue: 'Cow', answer: 'baqara', answerArabic: 'بقرة' },
      { number: 5, clue: 'Horse', answer: 'hisan', answerArabic: 'حصان' },
    ],
    cluesDown: [
      { number: 3, clue: 'Ram (male sheep)', answer: 'kabsh', answerArabic: 'كبش' },
    ],
  },
  {
    id: 'cw-easy-03',
    difficulty: 'easy',
    cefrLevel: 'A1',
    title: 'Colors',
    titleArabic: 'الوان',
    size: { rows: 8, cols: 8 },
    cells: [
      // 1-Across: احمر (red) — row 0, cols 0-3
      { row: 0, col: 0, letter: 'ا', clueAcross: 1, clueDown: 2 },
      { row: 0, col: 1, letter: 'ح', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'م', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'ر', clueAcross: 1, clueDown: null },
      // 2-Down: ازرق (blue) — col 0, rows 0-3
      { row: 1, col: 0, letter: 'ز', clueAcross: null, clueDown: 2 },
      { row: 2, col: 0, letter: 'ر', clueAcross: null, clueDown: 2 },
      { row: 3, col: 0, letter: 'ق', clueAcross: null, clueDown: 2 },
      // 3-Across: اخضر (green) — row 4, cols 0-3
      { row: 4, col: 0, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 4, col: 1, letter: 'خ', clueAcross: 3, clueDown: null },
      { row: 4, col: 2, letter: 'ض', clueAcross: 3, clueDown: null },
      { row: 4, col: 3, letter: 'ر', clueAcross: 3, clueDown: null },
      // 4-Across: اسود (black) — row 6, cols 0-3
      { row: 6, col: 0, letter: 'ا', clueAcross: 4, clueDown: null },
      { row: 6, col: 1, letter: 'س', clueAcross: 4, clueDown: null },
      { row: 6, col: 2, letter: 'و', clueAcross: 4, clueDown: null },
      { row: 6, col: 3, letter: 'د', clueAcross: 4, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Red', answer: 'ahmar', answerArabic: 'احمر' },
      { number: 3, clue: 'Green', answer: 'akhdar', answerArabic: 'اخضر' },
      { number: 4, clue: 'Black', answer: 'aswad', answerArabic: 'اسود' },
    ],
    cluesDown: [
      { number: 2, clue: 'Blue', answer: 'azraq', answerArabic: 'ازرق' },
    ],
  },
  {
    id: 'cw-easy-04',
    difficulty: 'easy',
    cefrLevel: 'A1',
    title: 'Food & Drink',
    titleArabic: 'طعام وشراب',
    size: { rows: 8, cols: 8 },
    cells: [
      // 1-Across: خبز (bread) — row 0, cols 0-2
      { row: 0, col: 0, letter: 'خ', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ب', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ز', clueAcross: 1, clueDown: 2 },
      // 2-Down: زيت (oil) — col 2, rows 0-2
      { row: 1, col: 2, letter: 'ي', clueAcross: null, clueDown: 2 },
      { row: 2, col: 2, letter: 'ت', clueAcross: null, clueDown: 2 },
      // 3-Across: ماء (water) — row 2, cols 4-6
      { row: 2, col: 4, letter: 'م', clueAcross: 3, clueDown: null },
      { row: 2, col: 5, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 2, col: 6, letter: 'ء', clueAcross: 3, clueDown: null },
      // 4-Across: حليب (milk) — row 4, cols 0-3
      { row: 4, col: 0, letter: 'ح', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ل', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'ي', clueAcross: 4, clueDown: null },
      { row: 4, col: 3, letter: 'ب', clueAcross: 4, clueDown: null },
      // 5-Across: رز (rice) — row 6, cols 0-1
      { row: 6, col: 0, letter: 'ر', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ز', clueAcross: 5, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Bread', answer: 'khubz', answerArabic: 'خبز' },
      { number: 3, clue: 'Water', answer: 'maa', answerArabic: 'ماء' },
      { number: 4, clue: 'Milk', answer: 'haleeb', answerArabic: 'حليب' },
      { number: 5, clue: 'Rice', answer: 'ruz', answerArabic: 'رز' },
    ],
    cluesDown: [
      { number: 2, clue: 'Oil', answer: 'zayt', answerArabic: 'زيت' },
    ],
  },
  {
    id: 'cw-easy-05',
    difficulty: 'easy',
    cefrLevel: 'A1',
    title: 'Numbers',
    titleArabic: 'ارقام',
    size: { rows: 8, cols: 8 },
    cells: [
      // 1-Across: واحد (one) — row 0, cols 0-3
      { row: 0, col: 0, letter: 'و', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ا', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ح', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'د', clueAcross: 1, clueDown: 2 },
      // 2-Down: دجاج (chicken — no, stay with numbers theme)
      // Actually let's keep it simple: just across clues for numbers
      // 3-Across: اثنان (two) — row 2, cols 0-4
      { row: 2, col: 0, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 2, col: 1, letter: 'ث', clueAcross: 3, clueDown: null },
      { row: 2, col: 2, letter: 'ن', clueAcross: 3, clueDown: null },
      { row: 2, col: 3, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 2, col: 4, letter: 'ن', clueAcross: 3, clueDown: null },
      // 2-Down: دار (house) col 3 rows 0-2 — nah let's skip down clue
      // 4-Across: خمسة (five) — row 4, cols 0-3
      { row: 4, col: 0, letter: 'خ', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'م', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'س', clueAcross: 4, clueDown: null },
      { row: 4, col: 3, letter: 'ة', clueAcross: 4, clueDown: null },
      // 5-Across: عشرة (ten) — row 6, cols 0-3
      { row: 6, col: 0, letter: 'ع', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ش', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ر', clueAcross: 5, clueDown: null },
      { row: 6, col: 3, letter: 'ة', clueAcross: 5, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'One', answer: 'wahid', answerArabic: 'واحد' },
      { number: 3, clue: 'Two', answer: 'ithnan', answerArabic: 'اثنان' },
      { number: 4, clue: 'Five', answer: 'khamsa', answerArabic: 'خمسة' },
      { number: 5, clue: 'Ten', answer: 'ashara', answerArabic: 'عشرة' },
    ],
    cluesDown: [],
  },

  // ─── MEDIUM / A1-A2 ──────────────────────────────────────────
  {
    id: 'cw-med-01',
    difficulty: 'medium',
    cefrLevel: 'A2',
    title: 'Body Parts',
    titleArabic: 'اعضاء الجسم',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: راس (head) — row 0, cols 0-2
      { row: 0, col: 0, letter: 'ر', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ا', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'س', clueAcross: 1, clueDown: 2 },
      // 2-Down: ساق (leg) — col 2, rows 0-2
      { row: 1, col: 2, letter: 'ا', clueAcross: null, clueDown: 2 },
      { row: 2, col: 2, letter: 'ق', clueAcross: null, clueDown: 2 },
      // 3-Across: عين (eye) — row 2, cols 4-6
      { row: 2, col: 4, letter: 'ع', clueAcross: 3, clueDown: null },
      { row: 2, col: 5, letter: 'ي', clueAcross: 3, clueDown: null },
      { row: 2, col: 6, letter: 'ن', clueAcross: 3, clueDown: null },
      // 4-Across: يد (hand) — row 4, cols 0-1
      { row: 4, col: 0, letter: 'ي', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'د', clueAcross: 4, clueDown: null },
      // 5-Across: اذن (ear) — row 6, cols 0-2
      { row: 6, col: 0, letter: 'ا', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ذ', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ن', clueAcross: 5, clueDown: null },
      // 6-Across: قلب (heart) — row 8, cols 0-2
      { row: 8, col: 0, letter: 'ق', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'ل', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'ب', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Head', answer: 'ras', answerArabic: 'راس' },
      { number: 3, clue: 'Eye', answer: 'ayn', answerArabic: 'عين' },
      { number: 4, clue: 'Hand', answer: 'yad', answerArabic: 'يد' },
      { number: 5, clue: 'Ear', answer: 'uthun', answerArabic: 'اذن' },
      { number: 6, clue: 'Heart', answer: 'qalb', answerArabic: 'قلب' },
    ],
    cluesDown: [
      { number: 2, clue: 'Leg / shin', answer: 'saq', answerArabic: 'ساق' },
    ],
  },
  {
    id: 'cw-med-02',
    difficulty: 'medium',
    cefrLevel: 'A2',
    title: 'Around the House',
    titleArabic: 'حول البيت',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: باب (door) — row 0, cols 0-2
      { row: 0, col: 0, letter: 'ب', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ا', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ب', clueAcross: 1, clueDown: 2 },
      // 2-Down: بيت (house) — col 2, rows 0-2
      { row: 1, col: 2, letter: 'ي', clueAcross: null, clueDown: 2 },
      { row: 2, col: 2, letter: 'ت', clueAcross: null, clueDown: 2 },
      // 3-Across: كرسي (chair) — row 2, cols 4-7
      { row: 2, col: 4, letter: 'ك', clueAcross: 3, clueDown: null },
      { row: 2, col: 5, letter: 'ر', clueAcross: 3, clueDown: null },
      { row: 2, col: 6, letter: 'س', clueAcross: 3, clueDown: null },
      { row: 2, col: 7, letter: 'ي', clueAcross: 3, clueDown: null },
      // 4-Across: سرير (bed) — row 4, cols 0-3
      { row: 4, col: 0, letter: 'س', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ر', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'ي', clueAcross: 4, clueDown: null },
      { row: 4, col: 3, letter: 'ر', clueAcross: 4, clueDown: null },
      // 5-Across: مطبخ (kitchen) — row 6, cols 0-3
      { row: 6, col: 0, letter: 'م', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ط', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ب', clueAcross: 5, clueDown: null },
      { row: 6, col: 3, letter: 'خ', clueAcross: 5, clueDown: null },
      // 6-Across: حمام (bathroom) — row 8, cols 0-3
      { row: 8, col: 0, letter: 'ح', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'م', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'ا', clueAcross: 6, clueDown: null },
      { row: 8, col: 3, letter: 'م', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Door', answer: 'bab', answerArabic: 'باب' },
      { number: 3, clue: 'Chair', answer: 'kursi', answerArabic: 'كرسي' },
      { number: 4, clue: 'Bed', answer: 'sarir', answerArabic: 'سرير' },
      { number: 5, clue: 'Kitchen', answer: 'matbakh', answerArabic: 'مطبخ' },
      { number: 6, clue: 'Bathroom', answer: 'hammam', answerArabic: 'حمام' },
    ],
    cluesDown: [
      { number: 2, clue: 'House', answer: 'bayt', answerArabic: 'بيت' },
    ],
  },
  {
    id: 'cw-med-03',
    difficulty: 'medium',
    cefrLevel: 'A2',
    title: 'Weather',
    titleArabic: 'طقس',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: شمس (sun) — row 0, cols 0-2
      { row: 0, col: 0, letter: 'ش', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'م', clueAcross: 1, clueDown: 2 },
      { row: 0, col: 2, letter: 'س', clueAcross: 1, clueDown: null },
      // 2-Down: مطر (rain) — col 1, rows 0-2
      { row: 1, col: 1, letter: 'ط', clueAcross: null, clueDown: 2 },
      { row: 2, col: 1, letter: 'ر', clueAcross: null, clueDown: 2 },
      // 3-Across: رياح (wind) — row 2, cols 3-6
      { row: 2, col: 3, letter: 'ر', clueAcross: 3, clueDown: null },
      { row: 2, col: 4, letter: 'ي', clueAcross: 3, clueDown: null },
      { row: 2, col: 5, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 2, col: 6, letter: 'ح', clueAcross: 3, clueDown: null },
      // 4-Across: ثلج (snow) — row 4, cols 0-2
      { row: 4, col: 0, letter: 'ث', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ل', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'ج', clueAcross: 4, clueDown: null },
      // 5-Across: غيوم (clouds) — row 6, cols 0-3
      { row: 6, col: 0, letter: 'غ', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ي', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'و', clueAcross: 5, clueDown: null },
      { row: 6, col: 3, letter: 'م', clueAcross: 5, clueDown: null },
      // 6-Across: برد (cold) — row 8, cols 0-2
      { row: 8, col: 0, letter: 'ب', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'ر', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'د', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Sun', answer: 'shams', answerArabic: 'شمس' },
      { number: 3, clue: 'Wind', answer: 'riyah', answerArabic: 'رياح' },
      { number: 4, clue: 'Snow', answer: 'thalj', answerArabic: 'ثلج' },
      { number: 5, clue: 'Clouds', answer: 'ghuyum', answerArabic: 'غيوم' },
      { number: 6, clue: 'Cold', answer: 'bard', answerArabic: 'برد' },
    ],
    cluesDown: [
      { number: 2, clue: 'Rain', answer: 'matar', answerArabic: 'مطر' },
    ],
  },
  {
    id: 'cw-med-04',
    difficulty: 'medium',
    cefrLevel: 'A2',
    title: 'School',
    titleArabic: 'مدرسة',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: قلم (pen) — row 0, cols 0-2
      { row: 0, col: 0, letter: 'ق', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ل', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'م', clueAcross: 1, clueDown: 2 },
      // 2-Down: معلم (teacher) — col 2, rows 0-3
      { row: 1, col: 2, letter: 'ع', clueAcross: null, clueDown: 2 },
      { row: 2, col: 2, letter: 'ل', clueAcross: null, clueDown: 2 },
      { row: 3, col: 2, letter: 'م', clueAcross: null, clueDown: 2 },
      // 3-Across: كتاب (book) — row 2, cols 4-7
      { row: 2, col: 4, letter: 'ك', clueAcross: 3, clueDown: null },
      { row: 2, col: 5, letter: 'ت', clueAcross: 3, clueDown: null },
      { row: 2, col: 6, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 2, col: 7, letter: 'ب', clueAcross: 3, clueDown: null },
      // 4-Across: دفتر (notebook) — row 4, cols 0-3
      { row: 4, col: 0, letter: 'د', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ف', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'ت', clueAcross: 4, clueDown: null },
      { row: 4, col: 3, letter: 'ر', clueAcross: 4, clueDown: null },
      // 5-Across: صف (class) — row 6, cols 0-1
      { row: 6, col: 0, letter: 'ص', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ف', clueAcross: 5, clueDown: null },
      // 6-Across: طالب (student) — row 8, cols 0-3
      { row: 8, col: 0, letter: 'ط', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'ا', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'ل', clueAcross: 6, clueDown: null },
      { row: 8, col: 3, letter: 'ب', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Pen', answer: 'qalam', answerArabic: 'قلم' },
      { number: 3, clue: 'Book', answer: 'kitab', answerArabic: 'كتاب' },
      { number: 4, clue: 'Notebook', answer: 'daftar', answerArabic: 'دفتر' },
      { number: 5, clue: 'Class / Classroom', answer: 'saff', answerArabic: 'صف' },
      { number: 6, clue: 'Student', answer: 'talib', answerArabic: 'طالب' },
    ],
    cluesDown: [
      { number: 2, clue: 'Teacher', answer: 'muallim', answerArabic: 'معلم' },
    ],
  },
  {
    id: 'cw-med-05',
    difficulty: 'medium',
    cefrLevel: 'A2',
    title: 'Clothing',
    titleArabic: 'ملابس',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: قميص (shirt) — row 0, cols 0-3
      { row: 0, col: 0, letter: 'ق', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'م', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ي', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'ص', clueAcross: 1, clueDown: 2 },
      // 2-Down: صوف (wool) — col 3, rows 0-2
      { row: 1, col: 3, letter: 'و', clueAcross: null, clueDown: 2 },
      { row: 2, col: 3, letter: 'ف', clueAcross: null, clueDown: 2 },
      // 3-Across: حذاء (shoes) — row 2, cols 5-8
      { row: 2, col: 5, letter: 'ح', clueAcross: 3, clueDown: null },
      { row: 2, col: 6, letter: 'ذ', clueAcross: 3, clueDown: null },
      { row: 2, col: 7, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 2, col: 8, letter: 'ء', clueAcross: 3, clueDown: null },
      // 4-Across: قبعة (hat) — row 4, cols 0-3
      { row: 4, col: 0, letter: 'ق', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ب', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'ع', clueAcross: 4, clueDown: null },
      { row: 4, col: 3, letter: 'ة', clueAcross: 4, clueDown: null },
      // 5-Across: فستان (dress) — row 6, cols 0-4
      { row: 6, col: 0, letter: 'ف', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'س', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ت', clueAcross: 5, clueDown: null },
      { row: 6, col: 3, letter: 'ا', clueAcross: 5, clueDown: null },
      { row: 6, col: 4, letter: 'ن', clueAcross: 5, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Shirt', answer: 'qamis', answerArabic: 'قميص' },
      { number: 3, clue: 'Shoes', answer: 'hithaa', answerArabic: 'حذاء' },
      { number: 4, clue: 'Hat', answer: 'qubbaa', answerArabic: 'قبعة' },
      { number: 5, clue: 'Dress', answer: 'fustan', answerArabic: 'فستان' },
    ],
    cluesDown: [
      { number: 2, clue: 'Wool', answer: 'suf', answerArabic: 'صوف' },
    ],
  },

  // ─── HARD / A2 ────────────────────────────────────────────────
  {
    id: 'cw-hard-01',
    difficulty: 'hard',
    cefrLevel: 'A2',
    title: 'Nature',
    titleArabic: 'طبيعة',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: شجرة (tree) — row 0, cols 0-3
      { row: 0, col: 0, letter: 'ش', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ج', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ر', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'ة', clueAcross: 1, clueDown: null },
      // 2-Down: زهرة (flower) — col 5, rows 0-3
      { row: 0, col: 5, letter: 'ز', clueAcross: null, clueDown: 2 },
      { row: 1, col: 5, letter: 'ه', clueAcross: null, clueDown: 2 },
      { row: 2, col: 5, letter: 'ر', clueAcross: null, clueDown: 2 },
      { row: 3, col: 5, letter: 'ة', clueAcross: null, clueDown: 2 },
      // 3-Across: جبل (mountain) — row 2, cols 0-2
      { row: 2, col: 0, letter: 'ج', clueAcross: 3, clueDown: null },
      { row: 2, col: 1, letter: 'ب', clueAcross: 3, clueDown: null },
      { row: 2, col: 2, letter: 'ل', clueAcross: 3, clueDown: null },
      // 4-Across: نهر (river) — row 4, cols 0-2
      { row: 4, col: 0, letter: 'ن', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ه', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'ر', clueAcross: 4, clueDown: null },
      // 5-Across: بحر (sea) — row 6, cols 0-2
      { row: 6, col: 0, letter: 'ب', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ح', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ر', clueAcross: 5, clueDown: null },
      // 6-Across: صحراء (desert) — row 8, cols 0-4
      { row: 8, col: 0, letter: 'ص', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'ح', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'ر', clueAcross: 6, clueDown: null },
      { row: 8, col: 3, letter: 'ا', clueAcross: 6, clueDown: null },
      { row: 8, col: 4, letter: 'ء', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Tree', answer: 'shajara', answerArabic: 'شجرة' },
      { number: 3, clue: 'Mountain', answer: 'jabal', answerArabic: 'جبل' },
      { number: 4, clue: 'River', answer: 'nahr', answerArabic: 'نهر' },
      { number: 5, clue: 'Sea', answer: 'bahr', answerArabic: 'بحر' },
      { number: 6, clue: 'Desert', answer: 'sahraa', answerArabic: 'صحراء' },
    ],
    cluesDown: [
      { number: 2, clue: 'Flower', answer: 'zahra', answerArabic: 'زهرة' },
    ],
  },
  {
    id: 'cw-hard-02',
    difficulty: 'hard',
    cefrLevel: 'A2',
    title: 'Professions',
    titleArabic: 'مهن',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: طبيب (doctor) — row 0, cols 0-3
      { row: 0, col: 0, letter: 'ط', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ب', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ي', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'ب', clueAcross: 1, clueDown: 2 },
      // 2-Down: باب (door) — col 3, rows 0-2
      { row: 1, col: 3, letter: 'ا', clueAcross: null, clueDown: 2 },
      { row: 2, col: 3, letter: 'ب', clueAcross: null, clueDown: 2 },
      // 3-Across: معلم (teacher) — row 2, cols 5-8
      { row: 2, col: 5, letter: 'م', clueAcross: 3, clueDown: null },
      { row: 2, col: 6, letter: 'ع', clueAcross: 3, clueDown: null },
      { row: 2, col: 7, letter: 'ل', clueAcross: 3, clueDown: null },
      { row: 2, col: 8, letter: 'م', clueAcross: 3, clueDown: null },
      // 4-Across: مهندس (engineer) — row 4, cols 0-4
      { row: 4, col: 0, letter: 'م', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ه', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'ن', clueAcross: 4, clueDown: null },
      { row: 4, col: 3, letter: 'د', clueAcross: 4, clueDown: null },
      { row: 4, col: 4, letter: 'س', clueAcross: 4, clueDown: null },
      // 5-Across: محامي (lawyer) — row 6, cols 0-4
      { row: 6, col: 0, letter: 'م', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ح', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ا', clueAcross: 5, clueDown: null },
      { row: 6, col: 3, letter: 'م', clueAcross: 5, clueDown: null },
      { row: 6, col: 4, letter: 'ي', clueAcross: 5, clueDown: null },
      // 6-Across: خباز (baker) — row 8, cols 0-3
      { row: 8, col: 0, letter: 'خ', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'ب', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'ا', clueAcross: 6, clueDown: null },
      { row: 8, col: 3, letter: 'ز', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Doctor', answer: 'tabib', answerArabic: 'طبيب' },
      { number: 3, clue: 'Teacher', answer: 'muallim', answerArabic: 'معلم' },
      { number: 4, clue: 'Engineer', answer: 'muhandis', answerArabic: 'مهندس' },
      { number: 5, clue: 'Lawyer', answer: 'muhami', answerArabic: 'محامي' },
      { number: 6, clue: 'Baker', answer: 'khabbaz', answerArabic: 'خباز' },
    ],
    cluesDown: [
      { number: 2, clue: 'Door', answer: 'bab', answerArabic: 'باب' },
    ],
  },
  {
    id: 'cw-hard-03',
    difficulty: 'hard',
    cefrLevel: 'A2',
    title: 'Travel',
    titleArabic: 'سفر',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: مطار (airport) — row 0, cols 0-3
      { row: 0, col: 0, letter: 'م', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ط', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ا', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'ر', clueAcross: 1, clueDown: null },
      // 2-Down: فندق (hotel) — col 6, rows 0-3
      { row: 0, col: 6, letter: 'ف', clueAcross: null, clueDown: 2 },
      { row: 1, col: 6, letter: 'ن', clueAcross: null, clueDown: 2 },
      { row: 2, col: 6, letter: 'د', clueAcross: null, clueDown: 2 },
      { row: 3, col: 6, letter: 'ق', clueAcross: null, clueDown: 2 },
      // 3-Across: جواز (passport) — row 2, cols 0-3
      { row: 2, col: 0, letter: 'ج', clueAcross: 3, clueDown: null },
      { row: 2, col: 1, letter: 'و', clueAcross: 3, clueDown: null },
      { row: 2, col: 2, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 2, col: 3, letter: 'ز', clueAcross: 3, clueDown: null },
      // 4-Across: حقيبة (bag) — row 4, cols 0-4
      { row: 4, col: 0, letter: 'ح', clueAcross: 4, clueDown: null },
      { row: 4, col: 1, letter: 'ق', clueAcross: 4, clueDown: null },
      { row: 4, col: 2, letter: 'ي', clueAcross: 4, clueDown: null },
      { row: 4, col: 3, letter: 'ب', clueAcross: 4, clueDown: null },
      { row: 4, col: 4, letter: 'ة', clueAcross: 4, clueDown: null },
      // 5-Across: تذكرة (ticket) — row 6, cols 0-4
      { row: 6, col: 0, letter: 'ت', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ذ', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ك', clueAcross: 5, clueDown: null },
      { row: 6, col: 3, letter: 'ر', clueAcross: 5, clueDown: null },
      { row: 6, col: 4, letter: 'ة', clueAcross: 5, clueDown: null },
      // 6-Across: قطار (train) — row 8, cols 0-3
      { row: 8, col: 0, letter: 'ق', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'ط', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'ا', clueAcross: 6, clueDown: null },
      { row: 8, col: 3, letter: 'ر', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Airport', answer: 'matar', answerArabic: 'مطار' },
      { number: 3, clue: 'Passport', answer: 'jawaz', answerArabic: 'جواز' },
      { number: 4, clue: 'Bag / Suitcase', answer: 'haqiba', answerArabic: 'حقيبة' },
      { number: 5, clue: 'Ticket', answer: 'tadhkira', answerArabic: 'تذكرة' },
      { number: 6, clue: 'Train', answer: 'qitar', answerArabic: 'قطار' },
    ],
    cluesDown: [
      { number: 2, clue: 'Hotel', answer: 'funduq', answerArabic: 'فندق' },
    ],
  },
  {
    id: 'cw-hard-04',
    difficulty: 'hard',
    cefrLevel: 'A2',
    title: 'Time',
    titleArabic: 'وقت',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: ساعة (hour/clock) — row 0, cols 0-3
      { row: 0, col: 0, letter: 'س', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ا', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ع', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'ة', clueAcross: 1, clueDown: null },
      // 2-Across: دقيقة (minute) — row 2, cols 0-4
      { row: 2, col: 0, letter: 'د', clueAcross: 2, clueDown: null },
      { row: 2, col: 1, letter: 'ق', clueAcross: 2, clueDown: null },
      { row: 2, col: 2, letter: 'ي', clueAcross: 2, clueDown: null },
      { row: 2, col: 3, letter: 'ق', clueAcross: 2, clueDown: null },
      { row: 2, col: 4, letter: 'ة', clueAcross: 2, clueDown: null },
      // 3-Across: يوم (day) — row 4, cols 0-2
      { row: 4, col: 0, letter: 'ي', clueAcross: 3, clueDown: null },
      { row: 4, col: 1, letter: 'و', clueAcross: 3, clueDown: null },
      { row: 4, col: 2, letter: 'م', clueAcross: 3, clueDown: null },
      // 4-Down: شهر (month) — col 6, rows 4-6
      { row: 4, col: 6, letter: 'ش', clueAcross: null, clueDown: 4 },
      { row: 5, col: 6, letter: 'ه', clueAcross: null, clueDown: 4 },
      { row: 6, col: 6, letter: 'ر', clueAcross: null, clueDown: 4 },
      // 5-Across: سنة (year) — row 6, cols 0-2
      { row: 6, col: 0, letter: 'س', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ن', clueAcross: 5, clueDown: null },
      { row: 6, col: 2, letter: 'ة', clueAcross: 5, clueDown: null },
      // 6-Across: اسبوع (week) — row 8, cols 0-4
      { row: 8, col: 0, letter: 'ا', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'س', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'ب', clueAcross: 6, clueDown: null },
      { row: 8, col: 3, letter: 'و', clueAcross: 6, clueDown: null },
      { row: 8, col: 4, letter: 'ع', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Hour / Clock', answer: 'saaa', answerArabic: 'ساعة' },
      { number: 2, clue: 'Minute', answer: 'daqiqa', answerArabic: 'دقيقة' },
      { number: 3, clue: 'Day', answer: 'yawm', answerArabic: 'يوم' },
      { number: 5, clue: 'Year', answer: 'sana', answerArabic: 'سنة' },
      { number: 6, clue: 'Week', answer: 'usbu', answerArabic: 'اسبوع' },
    ],
    cluesDown: [
      { number: 4, clue: 'Month', answer: 'shahr', answerArabic: 'شهر' },
    ],
  },
  {
    id: 'cw-hard-05',
    difficulty: 'hard',
    cefrLevel: 'A2',
    title: 'Emotions',
    titleArabic: 'مشاعر',
    size: { rows: 10, cols: 10 },
    cells: [
      // 1-Across: سعيد (happy) — row 0, cols 0-3
      { row: 0, col: 0, letter: 'س', clueAcross: 1, clueDown: null },
      { row: 0, col: 1, letter: 'ع', clueAcross: 1, clueDown: null },
      { row: 0, col: 2, letter: 'ي', clueAcross: 1, clueDown: null },
      { row: 0, col: 3, letter: 'د', clueAcross: 1, clueDown: null },
      // 2-Across: حزين (sad) — row 2, cols 0-3
      { row: 2, col: 0, letter: 'ح', clueAcross: 2, clueDown: null },
      { row: 2, col: 1, letter: 'ز', clueAcross: 2, clueDown: null },
      { row: 2, col: 2, letter: 'ي', clueAcross: 2, clueDown: null },
      { row: 2, col: 3, letter: 'ن', clueAcross: 2, clueDown: null },
      // 3-Across: خائف (afraid) — row 4, cols 0-3
      { row: 4, col: 0, letter: 'خ', clueAcross: 3, clueDown: null },
      { row: 4, col: 1, letter: 'ا', clueAcross: 3, clueDown: null },
      { row: 4, col: 2, letter: 'ئ', clueAcross: 3, clueDown: null },
      { row: 4, col: 3, letter: 'ف', clueAcross: 3, clueDown: null },
      // 4-Down: غضب (anger) — col 6, rows 4-6
      { row: 4, col: 6, letter: 'غ', clueAcross: null, clueDown: 4 },
      { row: 5, col: 6, letter: 'ض', clueAcross: null, clueDown: 4 },
      { row: 6, col: 6, letter: 'ب', clueAcross: null, clueDown: 4 },
      // 5-Across: حب (love) — row 6, cols 0-1
      { row: 6, col: 0, letter: 'ح', clueAcross: 5, clueDown: null },
      { row: 6, col: 1, letter: 'ب', clueAcross: 5, clueDown: null },
      // 6-Across: فرح (joy) — row 8, cols 0-2
      { row: 8, col: 0, letter: 'ف', clueAcross: 6, clueDown: null },
      { row: 8, col: 1, letter: 'ر', clueAcross: 6, clueDown: null },
      { row: 8, col: 2, letter: 'ح', clueAcross: 6, clueDown: null },
    ],
    cluesAcross: [
      { number: 1, clue: 'Happy', answer: 'said', answerArabic: 'سعيد' },
      { number: 2, clue: 'Sad', answer: 'hazin', answerArabic: 'حزين' },
      { number: 3, clue: 'Afraid / Scared', answer: 'khaif', answerArabic: 'خائف' },
      { number: 5, clue: 'Love', answer: 'hubb', answerArabic: 'حب' },
      { number: 6, clue: 'Joy / Happiness', answer: 'farah', answerArabic: 'فرح' },
    ],
    cluesDown: [
      { number: 4, clue: 'Anger', answer: 'ghadab', answerArabic: 'غضب' },
    ],
  },
];

export default CROSSWORD_PUZZLES;
