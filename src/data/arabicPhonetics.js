/**
 * Arabic Phonetics Data — Phase 95 (PHON-01)
 *
 * Complete reference data for all 28 Arabic consonants, 6 vowels,
 * 16 minimal pairs for confusable-sound exercises, and sound categories
 * grouped by articulation characteristics.
 */

// ── 28 Arabic Consonants ────────────────────────────────────────────────────

export const ARABIC_CONSONANTS = [
  // Bilabials
  {
    id: 'ba',
    letter: '\u0628',
    name: 'Ba',
    nameArabic: '\u0628\u0627\u0621',
    ipaSymbol: '/b/',
    articulationPoint: 'bilabial',
    articulationManner: 'stop',
    voicing: true,
    englishApproximation: 'b as in "bat"',
    description: 'Voiced bilabial stop formed by closing both lips',
    category: 'basic',
  },
  {
    id: 'meem',
    letter: '\u0645',
    name: 'Meem',
    nameArabic: '\u0645\u064A\u0645',
    ipaSymbol: '/m/',
    articulationPoint: 'bilabial',
    articulationManner: 'nasal',
    voicing: true,
    englishApproximation: 'm as in "mat"',
    description: 'Voiced bilabial nasal produced by closing lips and directing air through the nose',
    category: 'basic',
  },
  {
    id: 'waw',
    letter: '\u0648',
    name: 'Waw',
    nameArabic: '\u0648\u0627\u0648',
    ipaSymbol: '/w/',
    articulationPoint: 'bilabial',
    articulationManner: 'glide',
    voicing: true,
    englishApproximation: 'w as in "wet"',
    description: 'Voiced labio-velar glide with lip rounding',
    category: 'basic',
  },
  {
    id: 'fa',
    letter: '\u0641',
    name: 'Fa',
    nameArabic: '\u0641\u0627\u0621',
    ipaSymbol: '/f/',
    articulationPoint: 'bilabial',
    articulationManner: 'fricative',
    voicing: false,
    englishApproximation: 'f as in "fan"',
    description: 'Voiceless labiodental fricative produced by placing teeth on lower lip',
    category: 'basic',
  },

  // Interdentals
  {
    id: 'tha',
    letter: '\u062B',
    name: 'Tha',
    nameArabic: '\u062B\u0627\u0621',
    ipaSymbol: '/\u03B8/',
    articulationPoint: 'dental',
    articulationManner: 'fricative',
    voicing: false,
    englishApproximation: 'th as in "think"',
    description: 'Voiceless dental fricative with tongue between teeth',
    category: 'basic',
  },
  {
    id: 'dhal',
    letter: '\u0630',
    name: 'Dhal',
    nameArabic: '\u0630\u0627\u0644',
    ipaSymbol: '/\u00F0/',
    articulationPoint: 'dental',
    articulationManner: 'fricative',
    voicing: true,
    englishApproximation: 'th as in "this"',
    description: 'Voiced dental fricative with tongue between teeth',
    category: 'basic',
  },

  // Alveolars
  {
    id: 'ta',
    letter: '\u062A',
    name: 'Ta',
    nameArabic: '\u062A\u0627\u0621',
    ipaSymbol: '/t/',
    articulationPoint: 'alveolar',
    articulationManner: 'stop',
    voicing: false,
    englishApproximation: 't as in "top"',
    description: 'Voiceless alveolar stop with tongue at alveolar ridge',
    category: 'basic',
  },
  {
    id: 'dal',
    letter: '\u062F',
    name: 'Dal',
    nameArabic: '\u062F\u0627\u0644',
    ipaSymbol: '/d/',
    articulationPoint: 'alveolar',
    articulationManner: 'stop',
    voicing: true,
    englishApproximation: 'd as in "dog"',
    description: 'Voiced alveolar stop with tongue at alveolar ridge',
    category: 'basic',
  },
  {
    id: 'noon',
    letter: '\u0646',
    name: 'Noon',
    nameArabic: '\u0646\u0648\u0646',
    ipaSymbol: '/n/',
    articulationPoint: 'alveolar',
    articulationManner: 'nasal',
    voicing: true,
    englishApproximation: 'n as in "net"',
    description: 'Voiced alveolar nasal with tongue tip at alveolar ridge',
    category: 'basic',
  },
  {
    id: 'ra',
    letter: '\u0631',
    name: 'Ra',
    nameArabic: '\u0631\u0627\u0621',
    ipaSymbol: '/r/',
    articulationPoint: 'alveolar',
    articulationManner: 'liquid',
    voicing: true,
    englishApproximation: 'r as in Spanish "perro" (trilled)',
    description: 'Voiced alveolar tap or trill, produced with tongue tip flapping against alveolar ridge',
    category: 'basic',
  },
  {
    id: 'lam',
    letter: '\u0644',
    name: 'Lam',
    nameArabic: '\u0644\u0627\u0645',
    ipaSymbol: '/l/',
    articulationPoint: 'alveolar',
    articulationManner: 'liquid',
    voicing: true,
    englishApproximation: 'l as in "let"',
    description: 'Voiced alveolar lateral approximant with tongue tip at alveolar ridge',
    category: 'basic',
  },
  {
    id: 'sin',
    letter: '\u0633',
    name: 'Sin',
    nameArabic: '\u0633\u064A\u0646',
    ipaSymbol: '/s/',
    articulationPoint: 'alveolar',
    articulationManner: 'fricative',
    voicing: false,
    englishApproximation: 's as in "sun"',
    description: 'Voiceless alveolar fricative with air flowing over tongue',
    category: 'basic',
  },
  {
    id: 'zay',
    letter: '\u0632',
    name: 'Zay',
    nameArabic: '\u0632\u0627\u064A',
    ipaSymbol: '/z/',
    articulationPoint: 'alveolar',
    articulationManner: 'fricative',
    voicing: true,
    englishApproximation: 'z as in "zoo"',
    description: 'Voiced alveolar fricative, the voiced counterpart of sin',
    category: 'basic',
  },

  // Postalveolar / Palatal
  {
    id: 'sheen',
    letter: '\u0634',
    name: 'Sheen',
    nameArabic: '\u0634\u064A\u0646',
    ipaSymbol: '/\u0283/',
    articulationPoint: 'palatal',
    articulationManner: 'fricative',
    voicing: false,
    englishApproximation: 'sh as in "shoe"',
    description: 'Voiceless postalveolar fricative with tongue behind alveolar ridge',
    category: 'basic',
  },
  {
    id: 'jim',
    letter: '\u062C',
    name: 'Jim',
    nameArabic: '\u062C\u064A\u0645',
    ipaSymbol: '/d\u0292/',
    articulationPoint: 'palatal',
    articulationManner: 'affricate',
    voicing: true,
    englishApproximation: 'j as in "jump"',
    description: 'Voiced palatal affricate, starting as a stop then releasing as a fricative',
    category: 'basic',
  },
  {
    id: 'ya',
    letter: '\u064A',
    name: 'Ya',
    nameArabic: '\u064A\u0627\u0621',
    ipaSymbol: '/j/',
    articulationPoint: 'palatal',
    articulationManner: 'glide',
    voicing: true,
    englishApproximation: 'y as in "yes"',
    description: 'Voiced palatal glide with tongue raised toward hard palate',
    category: 'basic',
  },

  // Velar
  {
    id: 'kaf',
    letter: '\u0643',
    name: 'Kaf',
    nameArabic: '\u0643\u0627\u0641',
    ipaSymbol: '/k/',
    articulationPoint: 'velar',
    articulationManner: 'stop',
    voicing: false,
    englishApproximation: 'k as in "kite"',
    description: 'Voiceless velar stop with tongue back raised against soft palate',
    category: 'basic',
  },

  // Uvular
  {
    id: 'qaf',
    letter: '\u0642',
    name: 'Qaf',
    nameArabic: '\u0642\u0627\u0641',
    ipaSymbol: '/q/',
    articulationPoint: 'uvular',
    articulationManner: 'stop',
    voicing: false,
    englishApproximation: 'deeper k, produced at the uvula (no English equivalent)',
    description: 'Voiceless uvular stop produced further back than kaf, at the uvula',
    category: 'uvular',
  },
  {
    id: 'ghayn',
    letter: '\u063A',
    name: 'Ghayn',
    nameArabic: '\u063A\u064A\u0646',
    ipaSymbol: '/\u0263/',
    articulationPoint: 'uvular',
    articulationManner: 'fricative',
    voicing: true,
    englishApproximation: 'like French "r" in "Paris" (no English equivalent)',
    description: 'Voiced uvular fricative similar to a gargling sound at the back of the throat',
    category: 'uvular',
  },
  {
    id: 'kha',
    letter: '\u062E',
    name: 'Kha',
    nameArabic: '\u062E\u0627\u0621',
    ipaSymbol: '/x/',
    articulationPoint: 'uvular',
    articulationManner: 'fricative',
    voicing: false,
    englishApproximation: 'like Scottish "ch" in "loch" (no common English equivalent)',
    description: 'Voiceless uvular fricative produced with friction at the back of the throat',
    category: 'uvular',
  },

  // Pharyngeal
  {
    id: 'hah',
    letter: '\u062D',
    name: 'Hah',
    nameArabic: '\u062D\u0627\u0621',
    ipaSymbol: '/\u0127/',
    articulationPoint: 'pharyngeal',
    articulationManner: 'fricative',
    voicing: false,
    englishApproximation: 'a breathy whisper from deep in the throat (no English equivalent)',
    description: 'Voiceless pharyngeal fricative produced by constricting the throat muscles',
    category: 'pharyngeal',
  },
  {
    id: 'ayn',
    letter: '\u0639',
    name: 'Ayn',
    nameArabic: '\u0639\u064A\u0646',
    ipaSymbol: '/\u0295/',
    articulationPoint: 'pharyngeal',
    articulationManner: 'fricative',
    voicing: true,
    englishApproximation: 'a voiced squeeze in the throat (no English equivalent)',
    description: 'Voiced pharyngeal fricative produced by tightening the throat; one of the most distinctive Arabic sounds',
    category: 'pharyngeal',
  },

  // Glottal
  {
    id: 'hamza',
    letter: '\u0621',
    name: 'Hamza',
    nameArabic: '\u0647\u0645\u0632\u0629',
    ipaSymbol: '/\u0294/',
    articulationPoint: 'glottal',
    articulationManner: 'stop',
    voicing: false,
    englishApproximation: 'the catch in "uh-oh"',
    description: 'Voiceless glottal stop produced by briefly closing the vocal cords',
    category: 'glottal',
  },
  {
    id: 'ha',
    letter: '\u0647',
    name: 'Ha',
    nameArabic: '\u0647\u0627\u0621',
    ipaSymbol: '/h/',
    articulationPoint: 'glottal',
    articulationManner: 'fricative',
    voicing: false,
    englishApproximation: 'h as in "hat"',
    description: 'Voiceless glottal fricative, a light breathy h sound',
    category: 'glottal',
  },

  // Emphatic consonants (velarized / pharyngealized)
  {
    id: 'sad',
    letter: '\u0635',
    name: 'Sad',
    nameArabic: '\u0635\u0627\u062F',
    ipaSymbol: '/s\u02C0/',
    articulationPoint: 'alveolar',
    articulationManner: 'fricative',
    voicing: false,
    englishApproximation: 'emphatic s with tongue pulled back (no English equivalent)',
    description: 'Emphatic voiceless alveolar fricative; tongue tip at alveolar ridge with back of tongue raised toward velum, creating a darker sound',
    category: 'emphatic',
  },
  {
    id: 'dad',
    letter: '\u0636',
    name: 'Dad',
    nameArabic: '\u0636\u0627\u062F',
    ipaSymbol: '/d\u02C0/',
    articulationPoint: 'alveolar',
    articulationManner: 'stop',
    voicing: true,
    englishApproximation: 'emphatic d with tongue pulled back (no English equivalent)',
    description: 'Emphatic voiced alveolar stop; unique to Arabic, known as the letter of dad',
    category: 'emphatic',
  },
  {
    id: 'tah',
    letter: '\u0637',
    name: 'Tah',
    nameArabic: '\u0637\u0627\u0621',
    ipaSymbol: '/t\u02C0/',
    articulationPoint: 'alveolar',
    articulationManner: 'stop',
    voicing: false,
    englishApproximation: 'emphatic t with tongue pulled back (no English equivalent)',
    description: 'Emphatic voiceless alveolar stop; produced like ta but with tongue back raised',
    category: 'emphatic',
  },
  {
    id: 'zah',
    letter: '\u0638',
    name: 'Zah',
    nameArabic: '\u0638\u0627\u0621',
    ipaSymbol: '/\u00F0\u02C0/',
    articulationPoint: 'dental',
    articulationManner: 'fricative',
    voicing: true,
    englishApproximation: 'emphatic th as in "this" with tongue pulled back (no English equivalent)',
    description: 'Emphatic voiced dental fricative; like dhal but with velarization creating a heavier sound',
    category: 'emphatic',
  },
];

// ── 6 Arabic Vowels ─────────────────────────────────────────────────────────

export const ARABIC_VOWELS = [
  // Short vowels
  {
    id: 'fatha',
    symbol: '\u064E',
    letter: null,
    name: 'Fatha',
    nameArabic: '\u0641\u064E\u062A\u0652\u062D\u064E\u0629',
    ipaSymbol: '/a/',
    type: 'short',
    englishApproximation: 'a as in "cat"',
    description: 'Open front unrounded short vowel; a diagonal stroke above the letter',
  },
  {
    id: 'kasra',
    symbol: '\u0650',
    letter: null,
    name: 'Kasra',
    nameArabic: '\u0643\u064E\u0633\u0652\u0631\u064E\u0629',
    ipaSymbol: '/i/',
    type: 'short',
    englishApproximation: 'i as in "sit"',
    description: 'Close front unrounded short vowel; a diagonal stroke below the letter',
  },
  {
    id: 'damma',
    symbol: '\u064F',
    letter: null,
    name: 'Damma',
    nameArabic: '\u0636\u064E\u0645\u0651\u064E\u0629',
    ipaSymbol: '/u/',
    type: 'short',
    englishApproximation: 'u as in "put"',
    description: 'Close back rounded short vowel; a small waw-like mark above the letter',
  },
  // Long vowels
  {
    id: 'alif',
    symbol: '\u064E',
    letter: '\u0627',
    name: 'Alif',
    nameArabic: '\u0623\u064E\u0644\u0650\u0641',
    ipaSymbol: '/a\u02D0/',
    type: 'long',
    englishApproximation: 'aa as in "father"',
    description: 'Long open front vowel; fatha followed by alif, held for twice the duration of fatha',
  },
  {
    id: 'ya_vowel',
    symbol: '\u0650',
    letter: '\u064A',
    name: 'Ya (long vowel)',
    nameArabic: '\u064A\u0627\u0621',
    ipaSymbol: '/i\u02D0/',
    type: 'long',
    englishApproximation: 'ee as in "see"',
    description: 'Long close front vowel; kasra followed by ya, held for twice the duration of kasra',
  },
  {
    id: 'waw_vowel',
    symbol: '\u064F',
    letter: '\u0648',
    name: 'Waw (long vowel)',
    nameArabic: '\u0648\u0627\u0648',
    ipaSymbol: '/u\u02D0/',
    type: 'long',
    englishApproximation: 'oo as in "food"',
    description: 'Long close back rounded vowel; damma followed by waw, held for twice the duration of damma',
  },
];

// ── 16 Minimal Pairs ────────────────────────────────────────────────────────

export const MINIMAL_PAIRS = [
  {
    id: 'ba-fa',
    soundA: {
      id: 'ba',
      letter: '\u0628',
      name: 'Ba',
      ipaSymbol: '/b/',
      exampleWords: ['\u0628\u0627\u0628 (door)', '\u0628\u064A\u062A (house)'],
    },
    soundB: {
      id: 'fa',
      letter: '\u0641',
      name: 'Fa',
      ipaSymbol: '/f/',
      exampleWords: ['\u0641\u0627\u0631 (mouse)', '\u0641\u0645 (mouth)'],
    },
    difficulty: 1,
    explanation: 'Ba is a bilabial stop (lips close fully); Fa is a labiodental fricative (teeth touch lower lip)',
  },
  {
    id: 'jim-kha',
    soundA: {
      id: 'jim',
      letter: '\u062C',
      name: 'Jim',
      ipaSymbol: '/d\u0292/',
      exampleWords: ['\u062C\u0645\u0644 (camel)', '\u062C\u0628\u0644 (mountain)'],
    },
    soundB: {
      id: 'kha',
      letter: '\u062E',
      name: 'Kha',
      ipaSymbol: '/x/',
      exampleWords: ['\u062E\u0628\u0632 (bread)', '\u062E\u064A\u0644 (horses)'],
    },
    difficulty: 1,
    explanation: 'Jim is a voiced palatal affricate; Kha is a voiceless uvular fricative, much further back in the throat',
  },
  {
    id: 'dad-dal',
    soundA: {
      id: 'dad',
      letter: '\u0636',
      name: 'Dad',
      ipaSymbol: '/d\u02C0/',
      exampleWords: ['\u0636\u0631\u0628 (hit)', '\u0636\u064A\u0641 (guest)'],
    },
    soundB: {
      id: 'dal',
      letter: '\u062F',
      name: 'Dal',
      ipaSymbol: '/d/',
      exampleWords: ['\u062F\u0631\u0633 (lesson)', '\u062F\u064A\u0646 (religion)'],
    },
    difficulty: 3,
    explanation: 'Dad is the emphatic (velarized) form of Dal; tongue is pulled back creating a darker, heavier sound',
  },
  {
    id: 'sad-sin',
    soundA: {
      id: 'sad',
      letter: '\u0635',
      name: 'Sad',
      ipaSymbol: '/s\u02C0/',
      exampleWords: ['\u0635\u0628\u0631 (patience)', '\u0635\u0648\u0631\u0629 (picture)'],
    },
    soundB: {
      id: 'sin',
      letter: '\u0633',
      name: 'Sin',
      ipaSymbol: '/s/',
      exampleWords: ['\u0633\u0644\u0627\u0645 (peace)', '\u0633\u0645\u0643 (fish)'],
    },
    difficulty: 3,
    explanation: 'Sad is the emphatic form of Sin; the back of the tongue raises toward the velum giving a deeper resonance',
  },
  {
    id: 'tah-ta',
    soundA: {
      id: 'tah',
      letter: '\u0637',
      name: 'Tah',
      ipaSymbol: '/t\u02C0/',
      exampleWords: ['\u0637\u0627\u0644\u0628 (student)', '\u0637\u0628\u064A\u0628 (doctor)'],
    },
    soundB: {
      id: 'ta',
      letter: '\u062A',
      name: 'Ta',
      ipaSymbol: '/t/',
      exampleWords: ['\u062A\u0641\u0627\u062D (apple)', '\u062A\u0627\u062C (crown)'],
    },
    difficulty: 3,
    explanation: 'Tah is the emphatic form of Ta; produced with tongue back raised toward the velum',
  },
  {
    id: 'ayn-ghayn',
    soundA: {
      id: 'ayn',
      letter: '\u0639',
      name: 'Ayn',
      ipaSymbol: '/\u0295/',
      exampleWords: ['\u0639\u064A\u0646 (eye)', '\u0639\u0644\u0645 (knowledge)'],
    },
    soundB: {
      id: 'ghayn',
      letter: '\u063A',
      name: 'Ghayn',
      ipaSymbol: '/\u0263/',
      exampleWords: ['\u063A\u0631\u0641\u0629 (room)', '\u063A\u0627\u0628\u0629 (forest)'],
    },
    difficulty: 2,
    explanation: 'Ayn is a pharyngeal fricative (throat squeeze); Ghayn is a uvular fricative (gargling sound), produced slightly higher',
  },
  {
    id: 'qaf-kaf',
    soundA: {
      id: 'qaf',
      letter: '\u0642',
      name: 'Qaf',
      ipaSymbol: '/q/',
      exampleWords: ['\u0642\u0644\u0628 (heart)', '\u0642\u0645\u0631 (moon)'],
    },
    soundB: {
      id: 'kaf',
      letter: '\u0643',
      name: 'Kaf',
      ipaSymbol: '/k/',
      exampleWords: ['\u0643\u0644\u0628 (dog)', '\u0643\u062A\u0627\u0628 (book)'],
    },
    difficulty: 2,
    explanation: 'Qaf is a uvular stop (produced at the uvula); Kaf is a velar stop (produced at the soft palate, further forward)',
  },
  {
    id: 'hah-kha',
    soundA: {
      id: 'hah',
      letter: '\u062D',
      name: 'Hah',
      ipaSymbol: '/\u0127/',
      exampleWords: ['\u062D\u0644\u064A\u0628 (milk)', '\u062D\u0628 (love)'],
    },
    soundB: {
      id: 'kha',
      letter: '\u062E',
      name: 'Kha',
      ipaSymbol: '/x/',
      exampleWords: ['\u062E\u0628\u0632 (bread)', '\u062E\u064A\u0644 (horses)'],
    },
    difficulty: 2,
    explanation: 'Hah is a pharyngeal fricative (deeper in the throat); Kha is a uvular fricative (slightly higher, with more friction)',
  },
  {
    id: 'lam-ra',
    soundA: {
      id: 'lam',
      letter: '\u0644',
      name: 'Lam',
      ipaSymbol: '/l/',
      exampleWords: ['\u0644\u064A\u0644 (night)', '\u0644\u0628\u0646 (milk/yogurt)'],
    },
    soundB: {
      id: 'ra',
      letter: '\u0631',
      name: 'Ra',
      ipaSymbol: '/r/',
      exampleWords: ['\u0631\u064A\u062D (wind)', '\u0631\u0632 (rice)'],
    },
    difficulty: 1,
    explanation: 'Lam is a lateral approximant (air flows around the tongue sides); Ra is a tap/trill (tongue tip flaps against the ridge)',
  },
  {
    id: 'meem-noon',
    soundA: {
      id: 'meem',
      letter: '\u0645',
      name: 'Meem',
      ipaSymbol: '/m/',
      exampleWords: ['\u0645\u0627\u0621 (water)', '\u0645\u062F\u0631\u0633\u0629 (school)'],
    },
    soundB: {
      id: 'noon',
      letter: '\u0646',
      name: 'Noon',
      ipaSymbol: '/n/',
      exampleWords: ['\u0646\u0627\u0631 (fire)', '\u0646\u062C\u0645 (star)'],
    },
    difficulty: 1,
    explanation: 'Both are nasals; Meem closes the lips (bilabial), Noon uses the tongue tip at the alveolar ridge',
  },
  {
    id: 'zay-sin',
    soundA: {
      id: 'zay',
      letter: '\u0632',
      name: 'Zay',
      ipaSymbol: '/z/',
      exampleWords: ['\u0632\u064A\u062A (oil)', '\u0632\u0647\u0631\u0629 (flower)'],
    },
    soundB: {
      id: 'sin',
      letter: '\u0633',
      name: 'Sin',
      ipaSymbol: '/s/',
      exampleWords: ['\u0633\u0644\u0627\u0645 (peace)', '\u0633\u0645\u0643 (fish)'],
    },
    difficulty: 2,
    explanation: 'Both are alveolar fricatives; Zay is voiced (vocal cords vibrate), Sin is voiceless',
  },
  {
    id: 'dhal-zay',
    soundA: {
      id: 'dhal',
      letter: '\u0630',
      name: 'Dhal',
      ipaSymbol: '/\u00F0/',
      exampleWords: ['\u0630\u0647\u0628 (gold)', '\u0630\u0643\u064A (smart)'],
    },
    soundB: {
      id: 'zay',
      letter: '\u0632',
      name: 'Zay',
      ipaSymbol: '/z/',
      exampleWords: ['\u0632\u064A\u062A (oil)', '\u0632\u0647\u0631\u0629 (flower)'],
    },
    difficulty: 2,
    explanation: 'Dhal is an interdental fricative (tongue between teeth); Zay is an alveolar fricative (tongue behind teeth)',
  },
  {
    id: 'sheen-sin',
    soundA: {
      id: 'sheen',
      letter: '\u0634',
      name: 'Sheen',
      ipaSymbol: '/\u0283/',
      exampleWords: ['\u0634\u0645\u0633 (sun)', '\u0634\u062C\u0631\u0629 (tree)'],
    },
    soundB: {
      id: 'sin',
      letter: '\u0633',
      name: 'Sin',
      ipaSymbol: '/s/',
      exampleWords: ['\u0633\u0644\u0627\u0645 (peace)', '\u0633\u0645\u0643 (fish)'],
    },
    difficulty: 1,
    explanation: 'Sheen is a postalveolar fricative (tongue further back, lips rounded); Sin is an alveolar fricative (tongue forward)',
  },
  {
    id: 'dad-zah',
    soundA: {
      id: 'dad',
      letter: '\u0636',
      name: 'Dad',
      ipaSymbol: '/d\u02C0/',
      exampleWords: ['\u0636\u0631\u0628 (hit)', '\u0636\u064A\u0641 (guest)'],
    },
    soundB: {
      id: 'zah',
      letter: '\u0638',
      name: 'Zah',
      ipaSymbol: '/\u00F0\u02C0/',
      exampleWords: ['\u0638\u0644\u0627\u0645 (darkness)', '\u0638\u0647\u0631 (back/noon)'],
    },
    difficulty: 3,
    explanation: 'Both are emphatic; Dad is an alveolar stop (tongue tip strikes ridge), Zah is a dental fricative (tongue between teeth)',
  },
  {
    id: 'ha-hah',
    soundA: {
      id: 'ha',
      letter: '\u0647',
      name: 'Ha',
      ipaSymbol: '/h/',
      exampleWords: ['\u0647\u0648\u0627\u0621 (air)', '\u0647\u062F\u064A\u0629 (gift)'],
    },
    soundB: {
      id: 'hah',
      letter: '\u062D',
      name: 'Hah',
      ipaSymbol: '/\u0127/',
      exampleWords: ['\u062D\u0644\u064A\u0628 (milk)', '\u062D\u0628 (love)'],
    },
    difficulty: 3,
    explanation: 'Ha is a light glottal fricative (like English h); Hah is a pharyngeal fricative produced with constricted throat muscles',
  },
  {
    id: 'ayn-hamza',
    soundA: {
      id: 'ayn',
      letter: '\u0639',
      name: 'Ayn',
      ipaSymbol: '/\u0295/',
      exampleWords: ['\u0639\u064A\u0646 (eye)', '\u0639\u0631\u0628 (Arab)'],
    },
    soundB: {
      id: 'hamza',
      letter: '\u0621',
      name: 'Hamza',
      ipaSymbol: '/\u0294/',
      exampleWords: ['\u0623\u0628 (father)', '\u0623\u062E (brother)'],
    },
    difficulty: 2,
    explanation: 'Ayn is a voiced pharyngeal fricative (continuous throat squeeze); Hamza is a voiceless glottal stop (brief vocal cord closure)',
  },
];

// ── Sound Categories ────────────────────────────────────────────────────────

export const SOUND_CATEGORIES = [
  {
    id: 'emphatic',
    name: 'Emphatic Consonants',
    nameArabic: '\u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u0645\u0641\u062E\u0645\u0629',
    description: 'Pronounced with the back of the tongue raised toward the velum, creating a darker, heavier sound',
    letters: ['sad', 'dad', 'tah', 'zah'],
    difficulty: 'advanced',
  },
  {
    id: 'pharyngeal',
    name: 'Pharyngeal Consonants',
    nameArabic: '\u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u062D\u0644\u0642\u064A\u0629',
    description: 'Produced by constricting the pharynx (throat); among the most challenging sounds for non-native speakers',
    letters: ['ayn', 'hah'],
    difficulty: 'advanced',
  },
  {
    id: 'uvular',
    name: 'Uvular Consonants',
    nameArabic: '\u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u0644\u0647\u0648\u064A\u0629',
    description: 'Articulated at the uvula, the fleshy extension at the back of the soft palate',
    letters: ['qaf', 'ghayn', 'kha'],
    difficulty: 'intermediate',
  },
  {
    id: 'glottal',
    name: 'Glottal Consonants',
    nameArabic: '\u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u062D\u0646\u062C\u0631\u064A\u0629',
    description: 'Produced at the glottis (vocal cords); Ha is a light breath while Hamza is a brief stop',
    letters: ['hamza', 'ha'],
    difficulty: 'beginner',
  },
  {
    id: 'nasals',
    name: 'Nasal Consonants',
    nameArabic: '\u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u0623\u0646\u0641\u064A\u0629',
    description: 'Air is directed through the nose while the mouth is blocked at a specific point',
    letters: ['meem', 'noon'],
    difficulty: 'beginner',
  },
  {
    id: 'liquids',
    name: 'Liquid Consonants',
    nameArabic: '\u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u0633\u0627\u0626\u0644\u0629',
    description: 'Flowing sounds where the airstream is only partially obstructed by the tongue',
    letters: ['lam', 'ra'],
    difficulty: 'beginner',
  },
];

// ── Helper: Lookup consonant by id ──────────────────────────────────────────

/**
 * Find a consonant object by its id.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getConsonantById(id) {
  return ARABIC_CONSONANTS.find((c) => c.id === id);
}

/**
 * Get all consonants for a given articulation point.
 * @param {string} point - e.g. 'bilabial', 'alveolar', 'pharyngeal'
 * @returns {Object[]}
 */
export function getConsonantsByArticulation(point) {
  return ARABIC_CONSONANTS.filter((c) => c.articulationPoint === point);
}

/**
 * Get all minimal pairs that include a specific letter id.
 * @param {string} letterId
 * @returns {Object[]}
 */
export function getMinimalPairsForLetter(letterId) {
  return MINIMAL_PAIRS.filter(
    (pair) => pair.soundA.id === letterId || pair.soundB.id === letterId
  );
}

/** Redux-selector alias for getConsonantsByArticulation */
export function selectConsonantsByArticulation(point) {
  return getConsonantsByArticulation(point);
}

/** Redux-selector alias for getMinimalPairsForLetter */
export function selectMinimalPairsFor(letterId) {
  return getMinimalPairsForLetter(letterId);
}
