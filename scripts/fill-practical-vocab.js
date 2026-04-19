/**
 * Fill practical vocabulary from the 1000 most common Arabic words
 * plus handcrafted supplementary lists for gameplay and culture.
 *
 * Input:  ~/thousand-most-common-words/words/ar.json
 * Output: scripts/output/practical-vocabulary-raw.json
 *
 * Run: node scripts/fill-practical-vocab.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const INPUT_PATH = resolve(__dirname, '../../thousand-most-common-words/words/ar.json');
const OUTPUT_DIR = resolve(__dirname, 'output');
const OUTPUT_PATH = join(OUTPUT_DIR, 'practical-vocabulary-raw.json');

// ---------------------------------------------------------------------------
// Category keyword heuristics for auto-classifying common words
// ---------------------------------------------------------------------------
const CATEGORY_KEYWORDS = {
  time: [
    'time', 'year', 'day', 'month', 'week', 'hour', 'minute', 'second',
    'morning', 'evening', 'night', 'today', 'tomorrow', 'yesterday',
    'always', 'never', 'often', 'sometimes', 'now', 'then', 'soon',
    'early', 'late', 'before', 'after', 'during', 'since', 'until',
    'spring', 'summer', 'autumn', 'winter', 'date', 'century', 'era',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    'sunday', 'january', 'february',
  ],
  family: [
    'father', 'mother', 'son', 'daughter', 'brother', 'sister',
    'grandfather', 'grandmother', 'uncle', 'aunt', 'husband', 'wife',
    'child', 'baby', 'parent', 'family', 'boy', 'girl', 'man', 'woman',
    'people', 'person',
  ],
  food: [
    'bread', 'water', 'milk', 'meat', 'fish', 'rice', 'fruit', 'apple',
    'dates', 'honey', 'olives', 'coffee', 'tea', 'salt', 'sugar',
    'food', 'eat', 'drink', 'hungry', 'thirsty', 'meal',
  ],
  colors: [
    'red', 'blue', 'green', 'yellow', 'white', 'black', 'brown',
    'orange', 'pink', 'gray', 'grey', 'gold', 'silver', 'color', 'colour',
  ],
  body: [
    'head', 'eye', 'ear', 'hand', 'foot', 'heart', 'back', 'mouth',
    'nose', 'stomach', 'arm', 'leg', 'face', 'hair', 'blood', 'bone',
    'skin', 'body', 'finger', 'tooth',
  ],
  directions: [
    'north', 'south', 'east', 'west', 'right', 'left', 'front',
    'behind', 'above', 'below', 'up', 'down', 'near', 'far',
    'direction', 'here', 'there', 'where',
  ],
  animals: [
    'animal', 'horse', 'dog', 'cat', 'bird', 'fish', 'lion', 'camel',
    'sheep', 'goat', 'cow', 'elephant', 'snake', 'wolf',
  ],
  clothing: [
    'clothes', 'shirt', 'dress', 'shoe', 'hat', 'coat', 'wear',
  ],
  nature: [
    'tree', 'flower', 'mountain', 'river', 'sea', 'ocean', 'sky',
    'sun', 'moon', 'star', 'rain', 'wind', 'earth', 'land', 'fire',
    'stone', 'garden', 'desert', 'forest', 'island', 'cloud', 'snow',
    'lake', 'field', 'hill', 'valley', 'plant', 'leaf', 'wood',
  ],
  trade: [
    'money', 'price', 'buy', 'sell', 'market', 'shop', 'trade',
    'gold', 'silver', 'rich', 'poor', 'pay', 'cost', 'value', 'profit',
    'work', 'business', 'company', 'bank',
  ],
  greetings: [
    'hello', 'welcome', 'goodbye', 'thank', 'thanks', 'please',
    'sorry', 'excuse',
  ],
  numbers: [
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
    'nine', 'ten', 'hundred', 'thousand', 'million', 'first', 'second',
    'third', 'half', 'number', 'count',
  ],
  adjectives: [
    'big', 'small', 'large', 'little', 'long', 'short', 'tall', 'old',
    'new', 'young', 'good', 'bad', 'great', 'high', 'low', 'hot',
    'cold', 'fast', 'slow', 'strong', 'weak', 'hard', 'soft', 'heavy',
    'light', 'dark', 'bright', 'clean', 'dirty', 'beautiful', 'ugly',
    'happy', 'sad', 'angry', 'important', 'different', 'same', 'other',
    'many', 'few', 'much', 'more', 'less', 'most', 'best', 'worst',
    'better', 'worse', 'full', 'empty', 'open', 'closed', 'true',
    'false', 'real', 'possible', 'impossible', 'easy', 'difficult',
    'simple', 'free', 'ready', 'sure', 'safe', 'dangerous', 'deep',
    'wide', 'narrow', 'thick', 'thin', 'wet', 'dry', 'fresh',
    'alone', 'whole', 'entire', 'complete', 'final', 'main', 'major',
    'public', 'private', 'certain', 'clear', 'particular', 'recent',
    'able', 'available', 'common', 'general', 'local', 'national',
    'political', 'social', 'international', 'military', 'similar',
    'special', 'popular', 'various', 'serious', 'natural', 'significant',
  ],
  verbs: [
    'be', 'is', 'am', 'are', 'was', 'were', 'been', 'have', 'has',
    'had', 'do', 'did', 'done', 'say', 'said', 'go', 'went', 'gone',
    'get', 'got', 'make', 'made', 'know', 'knew', 'think', 'thought',
    'take', 'took', 'see', 'saw', 'come', 'came', 'want', 'look',
    'use', 'find', 'found', 'give', 'gave', 'tell', 'told', 'work',
    'call', 'called', 'try', 'ask', 'need', 'feel', 'felt', 'become',
    'leave', 'left', 'put', 'mean', 'meant', 'keep', 'kept', 'let',
    'begin', 'began', 'show', 'showed', 'hear', 'heard', 'play',
    'run', 'ran', 'move', 'live', 'believe', 'hold', 'held', 'bring',
    'happen', 'write', 'wrote', 'sit', 'sat', 'stand', 'stood',
    'lose', 'lost', 'pay', 'paid', 'meet', 'met', 'include',
    'continue', 'set', 'learn', 'change', 'lead', 'led', 'understand',
    'watch', 'follow', 'stop', 'create', 'speak', 'spoke', 'read',
    'spend', 'spent', 'grow', 'grew', 'open', 'walk', 'win', 'won',
    'teach', 'taught', 'offer', 'remember', 'consider', 'appear',
    'buy', 'bought', 'serve', 'die', 'died', 'send', 'sent', 'build',
    'built', 'stay', 'fall', 'fell', 'cut', 'reach', 'kill', 'remain',
    'suggest', 'raise', 'pass', 'sell', 'sold', 'require', 'report',
    'decide', 'pull', 'return', 'explain', 'hope', 'develop', 'carry',
    'break', 'broke', 'receive', 'agree', 'support', 'hit', 'produce',
    'eat', 'ate', 'cover', 'catch', 'caught', 'draw', 'drew', 'choose',
    'chose', 'fight', 'fought', 'fight', 'throw', 'threw',
    'enter', 'travel', 'help', 'wait', 'turn', 'start', 'close',
    'sleep', 'slept', 'drive', 'drove', 'fly', 'flew', 'drink', 'drank',
    'push', 'answer', 'pick', 'wear', 'wore', 'carry', 'love',
  ],
};

// ---------------------------------------------------------------------------
// Supplementary handcrafted vocabulary
// ---------------------------------------------------------------------------
const SUPPLEMENTARY_GREETINGS = [
  { arabic: 'السلام عليكم', english: 'peace be upon you', transliteration: 'as-salamu alaykum' },
  { arabic: 'وعليكم السلام', english: 'and upon you peace', transliteration: 'wa alaykum as-salam' },
  { arabic: 'بسم الله', english: 'in the name of God', transliteration: 'bismillah' },
  { arabic: 'الحمد لله', english: 'praise be to God', transliteration: 'alhamdulillah' },
  { arabic: 'إن شاء الله', english: 'God willing', transliteration: 'in sha Allah' },
  { arabic: 'ما شاء الله', english: 'what God has willed', transliteration: 'masha Allah' },
  { arabic: 'جزاك الله خيرا', english: 'may God reward you', transliteration: 'jazak Allahu khairan' },
  { arabic: 'أهلا وسهلا', english: 'welcome', transliteration: 'ahlan wa sahlan' },
  { arabic: 'مرحبا', english: 'hello', transliteration: 'marhaba' },
  { arabic: 'شكرا', english: 'thank you', transliteration: 'shukran' },
  { arabic: 'عفوا', english: "you're welcome / excuse me", transliteration: 'afwan' },
  { arabic: 'من فضلك', english: 'please', transliteration: 'min fadlik' },
  { arabic: 'نعم', english: 'yes', transliteration: "na'am" },
  { arabic: 'لا', english: 'no', transliteration: 'la' },
  { arabic: 'كيف حالك', english: 'how are you', transliteration: 'kayfa haluk' },
  { arabic: 'بخير', english: 'fine / well', transliteration: 'bikhayr' },
  { arabic: 'صباح الخير', english: 'good morning', transliteration: 'sabah al-khayr' },
  { arabic: 'مساء الخير', english: 'good evening', transliteration: "masa' al-khayr" },
  { arabic: 'مع السلامة', english: 'goodbye', transliteration: "ma'a as-salamah" },
  { arabic: 'إلى اللقاء', english: 'until we meet', transliteration: "ila al-liqa'" },
];

const SUPPLEMENTARY_NUMBERS = [
  { arabic: 'واحد', english: 'one', transliteration: 'wahid' },
  { arabic: 'اثنان', english: 'two', transliteration: 'ithnan' },
  { arabic: 'ثلاثة', english: 'three', transliteration: 'thalatha' },
  { arabic: 'أربعة', english: 'four', transliteration: "arba'a" },
  { arabic: 'خمسة', english: 'five', transliteration: 'khamsa' },
  { arabic: 'ستة', english: 'six', transliteration: 'sitta' },
  { arabic: 'سبعة', english: 'seven', transliteration: "sab'a" },
  { arabic: 'ثمانية', english: 'eight', transliteration: 'thamaniya' },
  { arabic: 'تسعة', english: 'nine', transliteration: "tis'a" },
  { arabic: 'عشرة', english: 'ten', transliteration: 'ashara' },
  { arabic: 'أحد عشر', english: 'eleven', transliteration: 'ahada ashar' },
  { arabic: 'اثنا عشر', english: 'twelve', transliteration: 'ithna ashar' },
  { arabic: 'ثلاثة عشر', english: 'thirteen', transliteration: 'thalathata ashar' },
  { arabic: 'أربعة عشر', english: 'fourteen', transliteration: "arba'ata ashar" },
  { arabic: 'خمسة عشر', english: 'fifteen', transliteration: 'khamsata ashar' },
  { arabic: 'ستة عشر', english: 'sixteen', transliteration: 'sittata ashar' },
  { arabic: 'سبعة عشر', english: 'seventeen', transliteration: "sab'ata ashar" },
  { arabic: 'ثمانية عشر', english: 'eighteen', transliteration: 'thamaniyata ashar' },
  { arabic: 'تسعة عشر', english: 'nineteen', transliteration: "tis'ata ashar" },
  { arabic: 'عشرون', english: 'twenty', transliteration: 'ishrun' },
];

const SUPPLEMENTARY_COLORS = [
  { arabic: 'أحمر', english: 'red', transliteration: 'ahmar' },
  { arabic: 'أزرق', english: 'blue', transliteration: 'azraq' },
  { arabic: 'أخضر', english: 'green', transliteration: 'akhdar' },
  { arabic: 'أصفر', english: 'yellow', transliteration: 'asfar' },
  { arabic: 'أبيض', english: 'white', transliteration: 'abyad' },
  { arabic: 'أسود', english: 'black', transliteration: 'aswad' },
  { arabic: 'بني', english: 'brown', transliteration: 'bunni' },
  { arabic: 'برتقالي', english: 'orange', transliteration: 'burtuqali' },
  { arabic: 'وردي', english: 'pink', transliteration: 'wardi' },
  { arabic: 'رمادي', english: 'gray', transliteration: 'ramadi' },
  { arabic: 'ذهبي', english: 'gold', transliteration: 'dhahabi' },
  { arabic: 'فضي', english: 'silver', transliteration: 'fiddi' },
];

const SUPPLEMENTARY_FAMILY = [
  { arabic: 'أب', english: 'father', transliteration: 'ab' },
  { arabic: 'أم', english: 'mother', transliteration: 'umm' },
  { arabic: 'ابن', english: 'son', transliteration: 'ibn' },
  { arabic: 'بنت', english: 'daughter', transliteration: 'bint' },
  { arabic: 'أخ', english: 'brother', transliteration: 'akh' },
  { arabic: 'أخت', english: 'sister', transliteration: 'ukht' },
  { arabic: 'جد', english: 'grandfather', transliteration: 'jadd' },
  { arabic: 'جدة', english: 'grandmother', transliteration: 'jadda' },
  { arabic: 'عم', english: 'uncle (paternal)', transliteration: "'amm" },
  { arabic: 'خال', english: 'uncle (maternal)', transliteration: 'khal' },
  { arabic: 'عمة', english: 'aunt (paternal)', transliteration: "'amma" },
  { arabic: 'خالة', english: 'aunt (maternal)', transliteration: 'khala' },
  { arabic: 'زوج', english: 'husband', transliteration: 'zawj' },
  { arabic: 'زوجة', english: 'wife', transliteration: 'zawja' },
  { arabic: 'طفل', english: 'child', transliteration: 'tifl' },
];

const SUPPLEMENTARY_FOOD = [
  { arabic: 'خبز', english: 'bread', transliteration: 'khubz' },
  { arabic: 'ماء', english: 'water', transliteration: "ma'" },
  { arabic: 'حليب', english: 'milk', transliteration: 'halib' },
  { arabic: 'لحم', english: 'meat', transliteration: 'lahm' },
  { arabic: 'سمك', english: 'fish', transliteration: 'samak' },
  { arabic: 'أرز', english: 'rice', transliteration: 'aruzz' },
  { arabic: 'فاكهة', english: 'fruit', transliteration: 'fakiha' },
  { arabic: 'تفاح', english: 'apple', transliteration: 'tuffah' },
  { arabic: 'تمر', english: 'dates', transliteration: 'tamr' },
  { arabic: 'عسل', english: 'honey', transliteration: "'asal" },
  { arabic: 'زيتون', english: 'olives', transliteration: 'zaytun' },
  { arabic: 'قهوة', english: 'coffee', transliteration: 'qahwa' },
  { arabic: 'شاي', english: 'tea', transliteration: 'shay' },
  { arabic: 'ملح', english: 'salt', transliteration: 'milh' },
  { arabic: 'سكر', english: 'sugar', transliteration: 'sukkar' },
];

const SUPPLEMENTARY_DIRECTIONS = [
  { arabic: 'شمال', english: 'north', transliteration: 'shamal' },
  { arabic: 'جنوب', english: 'south', transliteration: 'janub' },
  { arabic: 'شرق', english: 'east', transliteration: 'sharq' },
  { arabic: 'غرب', english: 'west', transliteration: 'gharb' },
  { arabic: 'يمين', english: 'right', transliteration: 'yamin' },
  { arabic: 'يسار', english: 'left', transliteration: 'yasar' },
  { arabic: 'أمام', english: 'front', transliteration: 'amam' },
  { arabic: 'خلف', english: 'behind', transliteration: 'khalf' },
  { arabic: 'فوق', english: 'above', transliteration: 'fawq' },
  { arabic: 'تحت', english: 'below', transliteration: 'taht' },
];

const SUPPLEMENTARY_BODY = [
  { arabic: 'رأس', english: 'head', transliteration: "ra's" },
  { arabic: 'عين', english: 'eye', transliteration: "'ayn" },
  { arabic: 'أذن', english: 'ear', transliteration: 'udhun' },
  { arabic: 'يد', english: 'hand', transliteration: 'yad' },
  { arabic: 'قدم', english: 'foot', transliteration: 'qadam' },
  { arabic: 'قلب', english: 'heart', transliteration: 'qalb' },
  { arabic: 'ظهر', english: 'back', transliteration: 'dhahr' },
  { arabic: 'فم', english: 'mouth', transliteration: 'fam' },
  { arabic: 'أنف', english: 'nose', transliteration: 'anf' },
  { arabic: 'بطن', english: 'stomach', transliteration: 'batn' },
  { arabic: 'ذراع', english: 'arm', transliteration: "dhira'" },
  { arabic: 'رجل', english: 'leg', transliteration: 'rijl' },
];

// Map each supplementary group to its category
const SUPPLEMENTARY_GROUPS = [
  { words: SUPPLEMENTARY_GREETINGS, category: 'greetings' },
  { words: SUPPLEMENTARY_NUMBERS, category: 'numbers' },
  { words: SUPPLEMENTARY_COLORS, category: 'colors' },
  { words: SUPPLEMENTARY_FAMILY, category: 'family' },
  { words: SUPPLEMENTARY_FOOD, category: 'food' },
  { words: SUPPLEMENTARY_DIRECTIONS, category: 'directions' },
  { words: SUPPLEMENTARY_BODY, category: 'body' },
];

// ---------------------------------------------------------------------------
// Category classifier for common words
// ---------------------------------------------------------------------------
function classifyCategory(englishWord) {
  const lower = englishWord.toLowerCase().trim();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.includes(lower)) {
      return category;
    }
  }

  return 'general';
}

// ---------------------------------------------------------------------------
// Difficulty assignment
// ---------------------------------------------------------------------------
function difficultyFromRank(rank) {
  if (rank <= 200) return 1;
  if (rank <= 500) return 2;
  return 3;
}

function difficultyForSupplementary(category) {
  // Basic greetings and numbers are easy (difficulty 1)
  if (category === 'greetings' || category === 'numbers') return 1;
  // Colors, family, food, directions, body are intermediate
  if (['colors', 'family', 'food', 'directions', 'body'].includes(category)) return 2;
  // Everything else is advanced supplementary
  return 4;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  // 1. Read and parse the 1000 common words
  console.log(`Reading common words from: ${INPUT_PATH}`);
  const rawInput = readFileSync(INPUT_PATH, 'utf-8');
  const inputData = JSON.parse(rawInput);
  const commonWords = inputData.words;
  console.log(`  Loaded ${commonWords.length} common words`);

  // Collect all supplementary Arabic forms for deduplication
  const supplementaryArabicSet = new Set();
  for (const group of SUPPLEMENTARY_GROUPS) {
    for (const w of group.words) {
      supplementaryArabicSet.add(w.arabic);
    }
  }

  const output = [];
  let idCounter = 1;

  function nextId() {
    const id = `practical_${String(idCounter).padStart(4, '0')}`;
    idCounter++;
    return id;
  }

  // 2. Process common words
  const seenArabic = new Set();

  for (const word of commonWords) {
    const arabic = word.targetWord;
    const english = word.englishWord;
    const rank = word.rank;

    // Skip if this Arabic word is also in our supplementary list (we'll add it there with richer data)
    if (supplementaryArabicSet.has(arabic)) {
      continue;
    }

    // Skip duplicates
    if (seenArabic.has(arabic)) {
      continue;
    }
    seenArabic.add(arabic);

    output.push({
      id: nextId(),
      arabic,
      english,
      transliteration: null,
      source: 'common',
      rank,
      category: classifyCategory(english),
      difficulty: difficultyFromRank(rank),
    });
  }

  console.log(`  Processed ${output.length} common words (after dedup & supplementary exclusion)`);

  // 3. Process supplementary words
  let supplementaryCount = 0;

  for (const group of SUPPLEMENTARY_GROUPS) {
    for (const word of group.words) {
      // Skip if we already added this Arabic word from the common list
      if (seenArabic.has(word.arabic)) {
        continue;
      }
      seenArabic.add(word.arabic);

      output.push({
        id: nextId(),
        arabic: word.arabic,
        english: word.english,
        transliteration: word.transliteration,
        source: 'supplementary',
        rank: null,
        category: group.category,
        difficulty: difficultyForSupplementary(group.category),
      });
      supplementaryCount++;
    }
  }

  console.log(`  Added ${supplementaryCount} supplementary words`);

  // 4. Summary statistics
  const categoryCounts = {};
  const sourceCounts = { common: 0, supplementary: 0 };
  const difficultyCounts = {};

  for (const entry of output) {
    categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    sourceCounts[entry.source]++;
    difficultyCounts[entry.difficulty] = (difficultyCounts[entry.difficulty] || 0) + 1;
  }

  console.log(`\nTotal words: ${output.length}`);
  console.log(`  Common: ${sourceCounts.common}`);
  console.log(`  Supplementary: ${sourceCounts.supplementary}`);

  console.log('\nBy category:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

  console.log('\nBy difficulty:');
  Object.keys(difficultyCounts)
    .sort()
    .forEach((d) => {
      console.log(`  Level ${d}: ${difficultyCounts[d]}`);
    });

  // 5. Write output
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`\nCreated output directory: ${OUTPUT_DIR}`);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\nWrote ${output.length} entries to: ${OUTPUT_PATH}`);
}

main();
