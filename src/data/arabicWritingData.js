/**
 * arabicWritingData.js
 *
 * Complete Arabic alphabet writing data with stroke paths (normalized 0-1 coords),
 * positional forms, and progressive word/phrase exercises.
 *
 * Phase 83 — Arabic Writing Practice (WRITE-01 + WRITE-02)
 */

// ─── All 28 Arabic Letters ────────────────────────────────────────────────────

export const ARABIC_LETTERS = [
  {
    id: 'alif',
    letter: 'ا',
    name: 'Alif',
    nameArabic: 'ألف',
    isolated: 'ا',
    initial: 'ا',
    medial: 'ـا',
    final: 'ـا',
    strokeOrder: [
      { type: 'line', points: [{ x: 0.5, y: 0.1 }, { x: 0.5, y: 0.15 }, { x: 0.5, y: 0.2 }, { x: 0.5, y: 0.3 }, { x: 0.5, y: 0.4 }, { x: 0.5, y: 0.5 }, { x: 0.5, y: 0.6 }, { x: 0.5, y: 0.7 }, { x: 0.5, y: 0.8 }, { x: 0.5, y: 0.9 }], direction: 'top-to-bottom' },
    ],
    dots: [],
    difficulty: 1,
    group: 1,
  },
  {
    id: 'ba',
    letter: 'ب',
    name: 'Ba',
    nameArabic: 'باء',
    isolated: 'ب',
    initial: 'بـ',
    medial: 'ـبـ',
    final: 'ـب',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.88, y: 0.5 }, { x: 0.82, y: 0.47 }, { x: 0.76, y: 0.44 }, { x: 0.7, y: 0.42 }, { x: 0.58, y: 0.4 }, { x: 0.46, y: 0.41 }, { x: 0.34, y: 0.46 }, { x: 0.22, y: 0.52 }, { x: 0.14, y: 0.58 }, { x: 0.12, y: 0.6 }, { x: 0.16, y: 0.63 }, { x: 0.26, y: 0.62 }, { x: 0.42, y: 0.58 }, { x: 0.62, y: 0.57 }, { x: 0.8, y: 0.58 }, { x: 0.9, y: 0.6 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.5, y: 0.72, count: 1, position: 'below' }],
    difficulty: 1,
    group: 1,
  },
  {
    id: 'ta',
    letter: 'ت',
    name: 'Ta',
    nameArabic: 'تاء',
    isolated: 'ت',
    initial: 'تـ',
    medial: 'ـتـ',
    final: 'ـت',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.88, y: 0.5 }, { x: 0.82, y: 0.47 }, { x: 0.76, y: 0.44 }, { x: 0.7, y: 0.42 }, { x: 0.58, y: 0.4 }, { x: 0.46, y: 0.41 }, { x: 0.34, y: 0.46 }, { x: 0.22, y: 0.52 }, { x: 0.14, y: 0.58 }, { x: 0.12, y: 0.6 }, { x: 0.16, y: 0.63 }, { x: 0.26, y: 0.62 }, { x: 0.42, y: 0.58 }, { x: 0.62, y: 0.57 }, { x: 0.8, y: 0.58 }, { x: 0.9, y: 0.6 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.45, y: 0.3, count: 2, position: 'above' }],
    difficulty: 1,
    group: 1,
  },
  {
    id: 'tha',
    letter: 'ث',
    name: 'Tha',
    nameArabic: 'ثاء',
    isolated: 'ث',
    initial: 'ثـ',
    medial: 'ـثـ',
    final: 'ـث',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.88, y: 0.5 }, { x: 0.82, y: 0.47 }, { x: 0.76, y: 0.44 }, { x: 0.7, y: 0.42 }, { x: 0.58, y: 0.4 }, { x: 0.46, y: 0.41 }, { x: 0.34, y: 0.46 }, { x: 0.22, y: 0.52 }, { x: 0.14, y: 0.58 }, { x: 0.12, y: 0.6 }, { x: 0.16, y: 0.63 }, { x: 0.26, y: 0.62 }, { x: 0.42, y: 0.58 }, { x: 0.62, y: 0.57 }, { x: 0.8, y: 0.58 }, { x: 0.9, y: 0.6 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.45, y: 0.26, count: 3, position: 'above' }],
    difficulty: 1,
    group: 1,
  },
  {
    id: 'jim',
    letter: 'ج',
    name: 'Jim',
    nameArabic: 'جيم',
    isolated: 'ج',
    initial: 'جـ',
    medial: 'ـجـ',
    final: 'ـج',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.85, y: 0.3 }, { x: 0.8, y: 0.28 }, { x: 0.68, y: 0.27 }, { x: 0.56, y: 0.31 }, { x: 0.44, y: 0.42 }, { x: 0.33, y: 0.52 }, { x: 0.24, y: 0.56 }, { x: 0.18, y: 0.52 }, { x: 0.18, y: 0.44 }, { x: 0.26, y: 0.42 }, { x: 0.3, y: 0.48 }, { x: 0.26, y: 0.6 }, { x: 0.18, y: 0.7 }, { x: 0.12, y: 0.84 }, { x: 0.16, y: 0.9 }, { x: 0.25, y: 0.9 }, { x: 0.35, y: 0.84 }, { x: 0.4, y: 0.8 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.48, y: 0.55, count: 1, position: 'inside' }],
    difficulty: 2,
    group: 2,
  },
  {
    id: 'hha',
    letter: 'ح',
    name: 'Ha',
    nameArabic: 'حاء',
    isolated: 'ح',
    initial: 'حـ',
    medial: 'ـحـ',
    final: 'ـح',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.85, y: 0.3 }, { x: 0.79, y: 0.28 }, { x: 0.65, y: 0.28 }, { x: 0.52, y: 0.37 }, { x: 0.43, y: 0.49 }, { x: 0.38, y: 0.55 }, { x: 0.3, y: 0.55 }, { x: 0.21, y: 0.48 }, { x: 0.19, y: 0.4 }, { x: 0.24, y: 0.36 }, { x: 0.31, y: 0.39 }, { x: 0.33, y: 0.48 }, { x: 0.27, y: 0.57 }, { x: 0.17, y: 0.62 }, { x: 0.12, y: 0.63 }], direction: 'right-to-left' },
    ],
    dots: [],
    difficulty: 2,
    group: 2,
  },
  {
    id: 'kha',
    letter: 'خ',
    name: 'Kha',
    nameArabic: 'خاء',
    isolated: 'خ',
    initial: 'خـ',
    medial: 'ـخـ',
    final: 'ـخ',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.85, y: 0.3 }, { x: 0.79, y: 0.28 }, { x: 0.65, y: 0.28 }, { x: 0.52, y: 0.37 }, { x: 0.43, y: 0.49 }, { x: 0.38, y: 0.55 }, { x: 0.3, y: 0.55 }, { x: 0.21, y: 0.48 }, { x: 0.19, y: 0.4 }, { x: 0.24, y: 0.36 }, { x: 0.31, y: 0.39 }, { x: 0.33, y: 0.48 }, { x: 0.27, y: 0.57 }, { x: 0.17, y: 0.62 }, { x: 0.12, y: 0.63 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.55, y: 0.2, count: 1, position: 'above' }],
    difficulty: 2,
    group: 2,
  },
  {
    id: 'dal',
    letter: 'د',
    name: 'Dal',
    nameArabic: 'دال',
    isolated: 'د',
    initial: 'د',
    medial: 'ـد',
    final: 'ـد',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.75, y: 0.3 }, { x: 0.7, y: 0.32 }, { x: 0.65, y: 0.36 }, { x: 0.6, y: 0.41 }, { x: 0.52, y: 0.52 }, { x: 0.44, y: 0.59 }, { x: 0.36, y: 0.59 }, { x: 0.31, y: 0.54 }, { x: 0.3, y: 0.46 }, { x: 0.33, y: 0.42 }, { x: 0.38, y: 0.46 }], direction: 'right-to-left' },
    ],
    dots: [],
    difficulty: 1,
    group: 3,
  },
  {
    id: 'dhal',
    letter: 'ذ',
    name: 'Dhal',
    nameArabic: 'ذال',
    isolated: 'ذ',
    initial: 'ذ',
    medial: 'ـذ',
    final: 'ـذ',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.75, y: 0.3 }, { x: 0.7, y: 0.32 }, { x: 0.65, y: 0.36 }, { x: 0.6, y: 0.41 }, { x: 0.52, y: 0.52 }, { x: 0.44, y: 0.59 }, { x: 0.36, y: 0.59 }, { x: 0.31, y: 0.54 }, { x: 0.3, y: 0.46 }, { x: 0.33, y: 0.42 }, { x: 0.38, y: 0.46 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.6, y: 0.25, count: 1, position: 'above' }],
    difficulty: 1,
    group: 3,
  },
  {
    id: 'ra',
    letter: 'ر',
    name: 'Ra',
    nameArabic: 'راء',
    isolated: 'ر',
    initial: 'ر',
    medial: 'ـر',
    final: 'ـر',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.6, y: 0.38 }, { x: 0.57, y: 0.4 }, { x: 0.54, y: 0.43 }, { x: 0.52, y: 0.48 }, { x: 0.5, y: 0.53 }, { x: 0.48, y: 0.58 }, { x: 0.47, y: 0.68 }, { x: 0.5, y: 0.78 }, { x: 0.57, y: 0.86 }, { x: 0.68, y: 0.89 }, { x: 0.79, y: 0.85 }], direction: 'top-to-bottom' },
    ],
    dots: [],
    difficulty: 1,
    group: 3,
  },
  {
    id: 'zay',
    letter: 'ز',
    name: 'Zay',
    nameArabic: 'زاي',
    isolated: 'ز',
    initial: 'ز',
    medial: 'ـز',
    final: 'ـز',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.6, y: 0.38 }, { x: 0.57, y: 0.4 }, { x: 0.54, y: 0.43 }, { x: 0.52, y: 0.48 }, { x: 0.5, y: 0.53 }, { x: 0.48, y: 0.58 }, { x: 0.47, y: 0.68 }, { x: 0.5, y: 0.78 }, { x: 0.57, y: 0.86 }, { x: 0.68, y: 0.89 }, { x: 0.79, y: 0.85 }], direction: 'top-to-bottom' },
    ],
    dots: [{ x: 0.55, y: 0.3, count: 1, position: 'above' }],
    difficulty: 1,
    group: 3,
  },
  {
    id: 'sin',
    letter: 'س',
    name: 'Sin',
    nameArabic: 'سين',
    isolated: 'س',
    initial: 'سـ',
    medial: 'ـسـ',
    final: 'ـس',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.9, y: 0.45 }, { x: 0.84, y: 0.44 }, { x: 0.79, y: 0.46 }, { x: 0.76, y: 0.5 }, { x: 0.76, y: 0.54 }, { x: 0.78, y: 0.56 }, { x: 0.72, y: 0.56 }, { x: 0.68, y: 0.5 }, { x: 0.65, y: 0.42 }, { x: 0.64, y: 0.46 }, { x: 0.62, y: 0.53 }, { x: 0.56, y: 0.57 }, { x: 0.5, y: 0.46 }, { x: 0.48, y: 0.47 }, { x: 0.44, y: 0.6 }, { x: 0.34, y: 0.66 }, { x: 0.22, y: 0.63 }, { x: 0.13, y: 0.56 }, { x: 0.11, y: 0.46 }, { x: 0.16, y: 0.43 }, { x: 0.24, y: 0.46 }, { x: 0.36, y: 0.51 }], direction: 'right-to-left' },
    ],
    dots: [],
    difficulty: 2,
    group: 4,
  },
  {
    id: 'shin',
    letter: 'ش',
    name: 'Shin',
    nameArabic: 'شين',
    isolated: 'ش',
    initial: 'شـ',
    medial: 'ـشـ',
    final: 'ـش',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.9, y: 0.45 }, { x: 0.84, y: 0.44 }, { x: 0.79, y: 0.46 }, { x: 0.76, y: 0.5 }, { x: 0.76, y: 0.54 }, { x: 0.78, y: 0.56 }, { x: 0.72, y: 0.56 }, { x: 0.68, y: 0.5 }, { x: 0.65, y: 0.42 }, { x: 0.64, y: 0.46 }, { x: 0.62, y: 0.53 }, { x: 0.56, y: 0.57 }, { x: 0.5, y: 0.46 }, { x: 0.48, y: 0.47 }, { x: 0.44, y: 0.6 }, { x: 0.34, y: 0.66 }, { x: 0.22, y: 0.63 }, { x: 0.13, y: 0.56 }, { x: 0.11, y: 0.46 }, { x: 0.16, y: 0.43 }, { x: 0.24, y: 0.46 }, { x: 0.36, y: 0.51 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.55, y: 0.32, count: 3, position: 'above' }],
    difficulty: 2,
    group: 4,
  },
  {
    id: 'sad',
    letter: 'ص',
    name: 'Sad',
    nameArabic: 'صاد',
    isolated: 'ص',
    initial: 'صـ',
    medial: 'ـصـ',
    final: 'ـص',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.62, y: 0.35 }, { x: 0.57, y: 0.32 }, { x: 0.47, y: 0.31 }, { x: 0.38, y: 0.39 }, { x: 0.36, y: 0.45 }, { x: 0.4, y: 0.56 }, { x: 0.49, y: 0.6 }, { x: 0.58, y: 0.56 }, { x: 0.62, y: 0.46 }, { x: 0.61, y: 0.4 }], direction: 'right-to-left' },
      { type: 'curve', points: [{ x: 0.65, y: 0.55 }, { x: 0.55, y: 0.55 }, { x: 0.45, y: 0.55 }, { x: 0.28, y: 0.55 }, { x: 0.15, y: 0.52 }, { x: 0.11, y: 0.48 }, { x: 0.14, y: 0.47 }, { x: 0.2, y: 0.5 }], direction: 'right-to-left' },
    ],
    dots: [],
    difficulty: 3,
    group: 4,
  },
  {
    id: 'dad',
    letter: 'ض',
    name: 'Dad',
    nameArabic: 'ضاد',
    isolated: 'ض',
    initial: 'ضـ',
    medial: 'ـضـ',
    final: 'ـض',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.62, y: 0.35 }, { x: 0.57, y: 0.32 }, { x: 0.47, y: 0.31 }, { x: 0.38, y: 0.39 }, { x: 0.36, y: 0.45 }, { x: 0.4, y: 0.56 }, { x: 0.49, y: 0.6 }, { x: 0.58, y: 0.56 }, { x: 0.62, y: 0.46 }, { x: 0.61, y: 0.4 }], direction: 'right-to-left' },
      { type: 'curve', points: [{ x: 0.65, y: 0.55 }, { x: 0.55, y: 0.55 }, { x: 0.45, y: 0.55 }, { x: 0.28, y: 0.55 }, { x: 0.15, y: 0.52 }, { x: 0.11, y: 0.48 }, { x: 0.14, y: 0.47 }, { x: 0.2, y: 0.5 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.5, y: 0.22, count: 1, position: 'above' }],
    difficulty: 3,
    group: 4,
  },
  {
    id: 'tta',
    letter: 'ط',
    name: 'Tta',
    nameArabic: 'طاء',
    isolated: 'ط',
    initial: 'طـ',
    medial: 'ـطـ',
    final: 'ـط',
    strokeOrder: [
      { type: 'line', points: [{ x: 0.55, y: 0.2 }, { x: 0.55, y: 0.26 }, { x: 0.55, y: 0.32 }, { x: 0.55, y: 0.38 }, { x: 0.55, y: 0.44 }, { x: 0.55, y: 0.5 }, { x: 0.55, y: 0.56 }, { x: 0.54, y: 0.62 }], direction: 'top-to-bottom' },
      { type: 'curve', points: [{ x: 0.55, y: 0.62 }, { x: 0.52, y: 0.67 }, { x: 0.45, y: 0.74 }, { x: 0.37, y: 0.74 }, { x: 0.33, y: 0.68 }, { x: 0.37, y: 0.62 }, { x: 0.43, y: 0.64 }, { x: 0.45, y: 0.71 }, { x: 0.42, y: 0.78 }, { x: 0.33, y: 0.8 }, { x: 0.25, y: 0.75 }], direction: 'right-to-left' },
    ],
    dots: [],
    difficulty: 2,
    group: 5,
  },
  {
    id: 'dhha',
    letter: 'ظ',
    name: 'Dhha',
    nameArabic: 'ظاء',
    isolated: 'ظ',
    initial: 'ظـ',
    medial: 'ـظـ',
    final: 'ـظ',
    strokeOrder: [
      { type: 'line', points: [{ x: 0.55, y: 0.2 }, { x: 0.55, y: 0.26 }, { x: 0.55, y: 0.32 }, { x: 0.55, y: 0.38 }, { x: 0.55, y: 0.44 }, { x: 0.55, y: 0.5 }, { x: 0.55, y: 0.56 }, { x: 0.54, y: 0.62 }], direction: 'top-to-bottom' },
      { type: 'curve', points: [{ x: 0.55, y: 0.62 }, { x: 0.52, y: 0.67 }, { x: 0.45, y: 0.74 }, { x: 0.37, y: 0.74 }, { x: 0.33, y: 0.68 }, { x: 0.37, y: 0.62 }, { x: 0.43, y: 0.64 }, { x: 0.45, y: 0.71 }, { x: 0.42, y: 0.78 }, { x: 0.33, y: 0.8 }, { x: 0.25, y: 0.75 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.6, y: 0.14, count: 1, position: 'above' }],
    difficulty: 2,
    group: 5,
  },
  {
    id: 'ain',
    letter: 'ع',
    name: 'Ain',
    nameArabic: 'عين',
    isolated: 'ع',
    initial: 'عـ',
    medial: 'ـعـ',
    final: 'ـع',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.72, y: 0.28 }, { x: 0.66, y: 0.25 }, { x: 0.6, y: 0.26 }, { x: 0.55, y: 0.3 }, { x: 0.52, y: 0.35 }, { x: 0.52, y: 0.41 }, { x: 0.55, y: 0.45 }, { x: 0.6, y: 0.46 }, { x: 0.65, y: 0.45 }, { x: 0.68, y: 0.42 }, { x: 0.68, y: 0.38 }, { x: 0.65, y: 0.34 }, { x: 0.55, y: 0.33 }, { x: 0.46, y: 0.42 }, { x: 0.44, y: 0.58 }, { x: 0.49, y: 0.72 }, { x: 0.55, y: 0.83 }, { x: 0.64, y: 0.87 }, { x: 0.74, y: 0.83 }, { x: 0.8, y: 0.72 }], direction: 'right-to-left' },
    ],
    dots: [],
    difficulty: 3,
    group: 5,
  },
  {
    id: 'ghain',
    letter: 'غ',
    name: 'Ghain',
    nameArabic: 'غين',
    isolated: 'غ',
    initial: 'غـ',
    medial: 'ـغـ',
    final: 'ـغ',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.72, y: 0.28 }, { x: 0.66, y: 0.25 }, { x: 0.6, y: 0.26 }, { x: 0.55, y: 0.3 }, { x: 0.52, y: 0.35 }, { x: 0.52, y: 0.41 }, { x: 0.55, y: 0.45 }, { x: 0.6, y: 0.46 }, { x: 0.65, y: 0.45 }, { x: 0.68, y: 0.42 }, { x: 0.68, y: 0.38 }, { x: 0.65, y: 0.34 }, { x: 0.55, y: 0.33 }, { x: 0.46, y: 0.42 }, { x: 0.44, y: 0.58 }, { x: 0.49, y: 0.72 }, { x: 0.55, y: 0.83 }, { x: 0.64, y: 0.87 }, { x: 0.74, y: 0.83 }, { x: 0.8, y: 0.72 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.6, y: 0.18, count: 1, position: 'above' }],
    difficulty: 3,
    group: 5,
  },
  {
    id: 'fa',
    letter: 'ف',
    name: 'Fa',
    nameArabic: 'فاء',
    isolated: 'ف',
    initial: 'فـ',
    medial: 'ـفـ',
    final: 'ـف',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.58, y: 0.4 }, { x: 0.53, y: 0.37 }, { x: 0.43, y: 0.38 }, { x: 0.4, y: 0.42 }, { x: 0.4, y: 0.47 }, { x: 0.48, y: 0.53 }, { x: 0.57, y: 0.49 }, { x: 0.59, y: 0.44 }, { x: 0.58, y: 0.4 }], direction: 'right-to-left' },
      { type: 'curve', points: [{ x: 0.6, y: 0.5 }, { x: 0.48, y: 0.5 }, { x: 0.35, y: 0.5 }, { x: 0.23, y: 0.48 }, { x: 0.14, y: 0.46 }, { x: 0.11, y: 0.47 }, { x: 0.14, y: 0.49 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.5, y: 0.3, count: 1, position: 'above' }],
    difficulty: 2,
    group: 6,
  },
  {
    id: 'qaf',
    letter: 'ق',
    name: 'Qaf',
    nameArabic: 'قاف',
    isolated: 'ق',
    initial: 'قـ',
    medial: 'ـقـ',
    final: 'ـق',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.65, y: 0.35 }, { x: 0.59, y: 0.31 }, { x: 0.45, y: 0.31 }, { x: 0.35, y: 0.41 }, { x: 0.34, y: 0.48 }, { x: 0.41, y: 0.58 }, { x: 0.53, y: 0.59 }, { x: 0.62, y: 0.52 }, { x: 0.64, y: 0.4 }], direction: 'right-to-left' },
      { type: 'curve', points: [{ x: 0.66, y: 0.58 }, { x: 0.56, y: 0.58 }, { x: 0.38, y: 0.57 }, { x: 0.23, y: 0.52 }, { x: 0.13, y: 0.44 }, { x: 0.11, y: 0.37 }, { x: 0.14, y: 0.36 }, { x: 0.2, y: 0.39 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.48, y: 0.22, count: 2, position: 'above' }],
    difficulty: 3,
    group: 6,
  },
  {
    id: 'kaf',
    letter: 'ك',
    name: 'Kaf',
    nameArabic: 'كاف',
    isolated: 'ك',
    initial: 'كـ',
    medial: 'ـكـ',
    final: 'ـك',
    strokeOrder: [
      { type: 'line', points: [{ x: 0.8, y: 0.2 }, { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.4 }, { x: 0.8, y: 0.5 }, { x: 0.8, y: 0.6 }, { x: 0.8, y: 0.7 }, { x: 0.8, y: 0.8 }], direction: 'top-to-bottom' },
      { type: 'curve', points: [{ x: 0.8, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.65, y: 0.8 }, { x: 0.55, y: 0.8 }, { x: 0.5, y: 0.8 }], direction: 'right-to-left' },
      { type: 'curve', points: [{ x: 0.8, y: 0.38 }, { x: 0.74, y: 0.36 }, { x: 0.62, y: 0.37 }, { x: 0.55, y: 0.42 }, { x: 0.52, y: 0.48 }], direction: 'right-to-left' },
    ],
    dots: [],
    difficulty: 2,
    group: 6,
  },
  {
    id: 'lam',
    letter: 'ل',
    name: 'Lam',
    nameArabic: 'لام',
    isolated: 'ل',
    initial: 'لـ',
    medial: 'ـلـ',
    final: 'ـل',
    strokeOrder: [
      { type: 'line', points: [{ x: 0.55, y: 0.1 }, { x: 0.55, y: 0.18 }, { x: 0.55, y: 0.26 }, { x: 0.55, y: 0.34 }, { x: 0.55, y: 0.42 }, { x: 0.55, y: 0.5 }], direction: 'top-to-bottom' },
      { type: 'curve', points: [{ x: 0.55, y: 0.5 }, { x: 0.53, y: 0.56 }, { x: 0.49, y: 0.64 }, { x: 0.43, y: 0.72 }, { x: 0.36, y: 0.78 }, { x: 0.28, y: 0.82 }, { x: 0.22, y: 0.83 }, { x: 0.18, y: 0.82 }], direction: 'top-to-bottom' },
    ],
    dots: [],
    difficulty: 1,
    group: 7,
  },
  {
    id: 'mim',
    letter: 'م',
    name: 'Mim',
    nameArabic: 'ميم',
    isolated: 'م',
    initial: 'مـ',
    medial: 'ـمـ',
    final: 'ـم',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.65, y: 0.35 }, { x: 0.6, y: 0.32 }, { x: 0.52, y: 0.31 }, { x: 0.45, y: 0.34 }, { x: 0.42, y: 0.4 }, { x: 0.42, y: 0.46 }, { x: 0.46, y: 0.51 }, { x: 0.52, y: 0.53 }, { x: 0.58, y: 0.52 }, { x: 0.63, y: 0.48 }, { x: 0.65, y: 0.42 }, { x: 0.65, y: 0.35 }], direction: 'right-to-left' },
      { type: 'curve', points: [{ x: 0.5, y: 0.53 }, { x: 0.48, y: 0.6 }, { x: 0.46, y: 0.68 }, { x: 0.43, y: 0.76 }, { x: 0.4, y: 0.84 }, { x: 0.38, y: 0.88 }], direction: 'top-to-bottom' },
    ],
    dots: [],
    difficulty: 2,
    group: 7,
  },
  {
    id: 'nun',
    letter: 'ن',
    name: 'Nun',
    nameArabic: 'نون',
    isolated: 'ن',
    initial: 'نـ',
    medial: 'ـنـ',
    final: 'ـن',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.85, y: 0.55 }, { x: 0.78, y: 0.5 }, { x: 0.7, y: 0.46 }, { x: 0.6, y: 0.44 }, { x: 0.5, y: 0.44 }, { x: 0.4, y: 0.46 }, { x: 0.3, y: 0.5 }, { x: 0.22, y: 0.55 }, { x: 0.16, y: 0.6 }, { x: 0.14, y: 0.63 }, { x: 0.16, y: 0.65 }, { x: 0.22, y: 0.64 }, { x: 0.34, y: 0.62 }, { x: 0.5, y: 0.6 }, { x: 0.68, y: 0.6 }, { x: 0.82, y: 0.62 }, { x: 0.88, y: 0.63 }], direction: 'right-to-left' },
    ],
    dots: [{ x: 0.5, y: 0.35, count: 1, position: 'above' }],
    difficulty: 1,
    group: 7,
  },
  {
    id: 'ha',
    letter: 'ه',
    name: 'Ha',
    nameArabic: 'هاء',
    isolated: 'ه',
    initial: 'هـ',
    medial: 'ـهـ',
    final: 'ـه',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.62, y: 0.38 }, { x: 0.56, y: 0.34 }, { x: 0.48, y: 0.33 }, { x: 0.42, y: 0.36 }, { x: 0.38, y: 0.42 }, { x: 0.38, y: 0.5 }, { x: 0.42, y: 0.56 }, { x: 0.48, y: 0.58 }, { x: 0.56, y: 0.57 }, { x: 0.62, y: 0.52 }, { x: 0.64, y: 0.45 }, { x: 0.62, y: 0.38 }], direction: 'right-to-left' },
    ],
    dots: [],
    difficulty: 2,
    group: 7,
  },
  {
    id: 'waw',
    letter: 'و',
    name: 'Waw',
    nameArabic: 'واو',
    isolated: 'و',
    initial: 'و',
    medial: 'ـو',
    final: 'ـو',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.6, y: 0.3 }, { x: 0.54, y: 0.28 }, { x: 0.47, y: 0.29 }, { x: 0.42, y: 0.34 }, { x: 0.4, y: 0.4 }, { x: 0.42, y: 0.46 }, { x: 0.47, y: 0.49 }, { x: 0.53, y: 0.48 }, { x: 0.58, y: 0.44 }, { x: 0.6, y: 0.38 }, { x: 0.6, y: 0.3 }], direction: 'right-to-left' },
      { type: 'curve', points: [{ x: 0.47, y: 0.49 }, { x: 0.45, y: 0.56 }, { x: 0.44, y: 0.64 }, { x: 0.44, y: 0.72 }, { x: 0.46, y: 0.78 }, { x: 0.5, y: 0.83 }, { x: 0.56, y: 0.86 }, { x: 0.63, y: 0.86 }, { x: 0.7, y: 0.83 }], direction: 'top-to-bottom' },
    ],
    dots: [],
    difficulty: 2,
    group: 7,
  },
  {
    id: 'ya',
    letter: 'ي',
    name: 'Ya',
    nameArabic: 'ياء',
    isolated: 'ي',
    initial: 'يـ',
    medial: 'ـيـ',
    final: 'ـي',
    strokeOrder: [
      { type: 'curve', points: [{ x: 0.82, y: 0.4 }, { x: 0.76, y: 0.36 }, { x: 0.68, y: 0.34 }, { x: 0.58, y: 0.34 }, { x: 0.48, y: 0.36 }, { x: 0.4, y: 0.4 }, { x: 0.34, y: 0.46 }, { x: 0.3, y: 0.5 }, { x: 0.28, y: 0.54 }], direction: 'right-to-left' },
      { type: 'curve', points: [{ x: 0.28, y: 0.54 }, { x: 0.26, y: 0.6 }, { x: 0.26, y: 0.66 }, { x: 0.28, y: 0.72 }, { x: 0.33, y: 0.76 }, { x: 0.4, y: 0.78 }, { x: 0.48, y: 0.78 }, { x: 0.56, y: 0.76 }, { x: 0.64, y: 0.72 }, { x: 0.7, y: 0.66 }, { x: 0.74, y: 0.6 }, { x: 0.76, y: 0.54 }], direction: 'left-to-right' },
    ],
    dots: [{ x: 0.45, y: 0.88, count: 2, position: 'below' }],
    difficulty: 2,
    group: 7,
  },
];

// ─── Word Writing Exercises — Progressive Difficulty ──────────────────────────

export const WRITING_EXERCISES = {
  letters: ARABIC_LETTERS,

  connected: [
    // A1 — Basic vocabulary (2-3 letter words)
    { id: 'word_ab', arabic: 'أب', english: 'father', transliteration: 'ab', cefrLevel: 'A1', letterBreakdown: ['أ', 'ب'] },
    { id: 'word_umm', arabic: 'أم', english: 'mother', transliteration: 'umm', cefrLevel: 'A1', letterBreakdown: ['أ', 'م'] },
    { id: 'word_ibn', arabic: 'ابن', english: 'son', transliteration: 'ibn', cefrLevel: 'A1', letterBreakdown: ['ا', 'ب', 'ن'] },
    { id: 'word_bayt', arabic: 'بيت', english: 'house', transliteration: 'bayt', cefrLevel: 'A1', letterBreakdown: ['ب', 'ي', 'ت'] },
    { id: 'word_bab', arabic: 'باب', english: 'door', transliteration: 'bab', cefrLevel: 'A1', letterBreakdown: ['ب', 'ا', 'ب'] },
    { id: 'word_kitab', arabic: 'كتاب', english: 'book', transliteration: 'kitab', cefrLevel: 'A1', letterBreakdown: ['ك', 'ت', 'ا', 'ب'] },
    { id: 'word_qalam', arabic: 'قلم', english: 'pen', transliteration: 'qalam', cefrLevel: 'A1', letterBreakdown: ['ق', 'ل', 'م'] },
    { id: 'word_walad', arabic: 'ولد', english: 'boy', transliteration: 'walad', cefrLevel: 'A1', letterBreakdown: ['و', 'ل', 'د'] },
    { id: 'word_bint', arabic: 'بنت', english: 'girl', transliteration: 'bint', cefrLevel: 'A1', letterBreakdown: ['ب', 'ن', 'ت'] },
    { id: 'word_yawm', arabic: 'يوم', english: 'day', transliteration: 'yawm', cefrLevel: 'A1', letterBreakdown: ['ي', 'و', 'م'] },
    { id: 'word_layl', arabic: 'ليل', english: 'night', transliteration: 'layl', cefrLevel: 'A1', letterBreakdown: ['ل', 'ي', 'ل'] },
    { id: 'word_maa', arabic: 'ماء', english: 'water', transliteration: 'maa', cefrLevel: 'A1', letterBreakdown: ['م', 'ا', 'ء'] },
    { id: 'word_shams', arabic: 'شمس', english: 'sun', transliteration: 'shams', cefrLevel: 'A1', letterBreakdown: ['ش', 'م', 'س'] },
    { id: 'word_qamar', arabic: 'قمر', english: 'moon', transliteration: 'qamar', cefrLevel: 'A1', letterBreakdown: ['ق', 'م', 'ر'] },
    { id: 'word_naam', arabic: 'نعم', english: 'yes', transliteration: 'naam', cefrLevel: 'A1', letterBreakdown: ['ن', 'ع', 'م'] },

    // A1-A2 — Common nouns (3-4 letter words)
    { id: 'word_rajul', arabic: 'رجل', english: 'man', transliteration: 'rajul', cefrLevel: 'A1', letterBreakdown: ['ر', 'ج', 'ل'] },
    { id: 'word_tufaha', arabic: 'تفاحة', english: 'apple', transliteration: 'tufaha', cefrLevel: 'A2', letterBreakdown: ['ت', 'ف', 'ا', 'ح', 'ة'] },
    { id: 'word_madrasa', arabic: 'مدرسة', english: 'school', transliteration: 'madrasa', cefrLevel: 'A2', letterBreakdown: ['م', 'د', 'ر', 'س', 'ة'] },
    { id: 'word_sadiq', arabic: 'صديق', english: 'friend', transliteration: 'sadiq', cefrLevel: 'A2', letterBreakdown: ['ص', 'د', 'ي', 'ق'] },
    { id: 'word_tabib', arabic: 'طبيب', english: 'doctor', transliteration: 'tabib', cefrLevel: 'A2', letterBreakdown: ['ط', 'ب', 'ي', 'ب'] },
    { id: 'word_sayyara', arabic: 'سيارة', english: 'car', transliteration: 'sayyara', cefrLevel: 'A2', letterBreakdown: ['س', 'ي', 'ا', 'ر', 'ة'] },
    { id: 'word_hayawan', arabic: 'حيوان', english: 'animal', transliteration: 'hayawan', cefrLevel: 'A2', letterBreakdown: ['ح', 'ي', 'و', 'ا', 'ن'] },
    { id: 'word_lugha', arabic: 'لغة', english: 'language', transliteration: 'lugha', cefrLevel: 'A2', letterBreakdown: ['ل', 'غ', 'ة'] },
    { id: 'word_sham', arabic: 'شام', english: 'Syria/Levant', transliteration: 'sham', cefrLevel: 'A2', letterBreakdown: ['ش', 'ا', 'م'] },
    { id: 'word_jamil', arabic: 'جميل', english: 'beautiful', transliteration: 'jamil', cefrLevel: 'A2', letterBreakdown: ['ج', 'م', 'ي', 'ل'] },
    { id: 'word_kabir', arabic: 'كبير', english: 'big', transliteration: 'kabir', cefrLevel: 'A2', letterBreakdown: ['ك', 'ب', 'ي', 'ر'] },
    { id: 'word_saghir', arabic: 'صغير', english: 'small', transliteration: 'saghir', cefrLevel: 'A2', letterBreakdown: ['ص', 'غ', 'ي', 'ر'] },
    { id: 'word_jadid', arabic: 'جديد', english: 'new', transliteration: 'jadid', cefrLevel: 'A2', letterBreakdown: ['ج', 'د', 'ي', 'د'] },
    { id: 'word_qahwa', arabic: 'قهوة', english: 'coffee', transliteration: 'qahwa', cefrLevel: 'A2', letterBreakdown: ['ق', 'ه', 'و', 'ة'] },
    { id: 'word_khubz', arabic: 'خبز', english: 'bread', transliteration: 'khubz', cefrLevel: 'A2', letterBreakdown: ['خ', 'ب', 'ز'] },

    // B1 — Longer words
    { id: 'word_mustashfa', arabic: 'مستشفى', english: 'hospital', transliteration: 'mustashfa', cefrLevel: 'B1', letterBreakdown: ['م', 'س', 'ت', 'ش', 'ف', 'ى'] },
    { id: 'word_jameaa', arabic: 'جامعة', english: 'university', transliteration: 'jameaa', cefrLevel: 'B1', letterBreakdown: ['ج', 'ا', 'م', 'ع', 'ة'] },
    { id: 'word_maktaba', arabic: 'مكتبة', english: 'library', transliteration: 'maktaba', cefrLevel: 'B1', letterBreakdown: ['م', 'ك', 'ت', 'ب', 'ة'] },
  ],

  phrases: [
    // A1 — Greetings and common phrases
    { id: 'phrase_hello', arabic: 'مرحبا', english: 'hello', transliteration: 'marhaba', cefrLevel: 'A1' },
    { id: 'phrase_salam', arabic: 'سلام', english: 'peace', transliteration: 'salam', cefrLevel: 'A1' },
    { id: 'phrase_shukran', arabic: 'شكرا', english: 'thank you', transliteration: 'shukran', cefrLevel: 'A1' },
    { id: 'phrase_afwan', arabic: 'عفوا', english: 'you\'re welcome', transliteration: 'afwan', cefrLevel: 'A1' },
    { id: 'phrase_sabah', arabic: 'صباح الخير', english: 'good morning', transliteration: 'sabah al-khayr', cefrLevel: 'A1' },
    { id: 'phrase_masaa', arabic: 'مساء الخير', english: 'good evening', transliteration: 'masaa al-khayr', cefrLevel: 'A1' },
    { id: 'phrase_maasalama', arabic: 'مع السلامة', english: 'goodbye', transliteration: 'maa as-salama', cefrLevel: 'A1' },
    { id: 'phrase_kayf', arabic: 'كيف حالك', english: 'how are you', transliteration: 'kayf halak', cefrLevel: 'A1' },
    { id: 'phrase_bismillah', arabic: 'بسم الله', english: 'in the name of God', transliteration: 'bismillah', cefrLevel: 'A1' },
    { id: 'phrase_inshallah', arabic: 'إن شاء الله', english: 'God willing', transliteration: 'inshallah', cefrLevel: 'A1' },

    // A2 — Short phrases
    { id: 'phrase_ana_min', arabic: 'أنا من', english: 'I am from', transliteration: 'ana min', cefrLevel: 'A2' },
    { id: 'phrase_ismi', arabic: 'اسمي', english: 'my name is', transliteration: 'ismi', cefrLevel: 'A2' },
    { id: 'phrase_min_fadlak', arabic: 'من فضلك', english: 'please', transliteration: 'min fadlak', cefrLevel: 'A2' },
    { id: 'phrase_la_shukran', arabic: 'لا شكرا', english: 'no thank you', transliteration: 'la shukran', cefrLevel: 'A2' },
    { id: 'phrase_ahlan', arabic: 'أهلا وسهلا', english: 'welcome', transliteration: 'ahlan wa sahlan', cefrLevel: 'A2' },
    { id: 'phrase_habibi', arabic: 'حبيبي', english: 'my dear', transliteration: 'habibi', cefrLevel: 'A2' },
    { id: 'phrase_yalla', arabic: 'يلا', english: 'let\'s go', transliteration: 'yalla', cefrLevel: 'A2' },
    { id: 'phrase_khalas', arabic: 'خلاص', english: 'enough/done', transliteration: 'khalas', cefrLevel: 'A2' },
    { id: 'phrase_mumtaz', arabic: 'ممتاز', english: 'excellent', transliteration: 'mumtaz', cefrLevel: 'A2' },
    { id: 'phrase_ana_uhibb', arabic: 'أنا أحب', english: 'I love', transliteration: 'ana uhibb', cefrLevel: 'A2' },

    // B1 — Longer phrases
    { id: 'phrase_kull_shay', arabic: 'كل شيء تمام', english: 'everything is fine', transliteration: 'kull shay tamam', cefrLevel: 'B1' },
    { id: 'phrase_ana_atallam', arabic: 'أنا أتعلم العربية', english: 'I am learning Arabic', transliteration: 'ana atallam al-arabiyya', cefrLevel: 'B1' },
  ],
};

// ─── Difficulty Levels ────────────────────────────────────────────────────────

export const DIFFICULTY_LEVELS = [
  { id: 'isolated', label: 'Isolated Letters', labelArabic: 'حروف مفردة', minScore: 0 },
  { id: 'connected', label: 'Connected Words', labelArabic: 'كلمات متصلة', minScore: 60 },
  { id: 'phrases', label: 'Short Phrases', labelArabic: 'عبارات قصيرة', minScore: 75 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Get all stroke points for a letter flattened into a single array.
 * Used by the ghost template renderer and validation grid.
 */
export function getLetterStrokePoints(letterId) {
  const letter = ARABIC_LETTERS.find((l) => l.id === letterId);
  if (!letter) return [];
  return letter.strokeOrder.flatMap((stroke) => stroke.points);
}

/**
 * Get a letter by ID.
 */
export function getLetterById(letterId) {
  return ARABIC_LETTERS.find((l) => l.id === letterId) || null;
}

/**
 * Get letters by group number.
 */
export function getLettersByGroup(group) {
  return ARABIC_LETTERS.filter((l) => l.group === group);
}

/**
 * Get letters by difficulty level (1-3).
 */
export function getLettersByDifficulty(difficulty) {
  return ARABIC_LETTERS.filter((l) => l.difficulty === difficulty);
}
