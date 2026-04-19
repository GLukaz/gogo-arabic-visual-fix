/**
 * rootMagic.js — Arabic root-based magic system (v6.0 Phase 27)
 *
 * Arabic 3-letter roots are mapped to 10 elemental affinities.
 * Casting spells requires identifying or typing words derived from these roots.
 * Spell power scales with verb form mastery (Form I -> Form X).
 */

/**
 * Root-to-element mapping.
 * Each key is a 3-letter Arabic consonantal root (separated by hyphens).
 * The value is the elemental affinity of that root.
 */
export const ROOT_ELEMENTS = {
  // Fire (نار) — heat, anger, passion
  'ح-ر-ق': 'fire',    // حرق (burn)
  'غ-ض-ب': 'fire',    // غضب (anger)
  'ح-م-س': 'fire',    // حماس (enthusiasm)
  'س-خ-ن': 'fire',    // سخن (heat)
  'ل-ه-ب': 'fire',    // لهب (flame)

  // Water (ماء) — flow, life, purity
  'س-ي-ل': 'water',   // سيل (flow)
  'ح-ي-ي': 'water',   // حياة (life)
  'ط-ه-ر': 'water',   // طهر (purify)
  'غ-س-ل': 'water',   // غسل (wash)
  'ش-ر-ب': 'water',   // شرب (drink)

  // Earth (تراب) — strength, building, stability
  'ب-ن-ي': 'earth',   // بنى (build)
  'ق-و-ي': 'earth',   // قوي (strong)
  'ث-ب-ت': 'earth',   // ثبت (stable)
  'ص-ل-ب': 'earth',   // صلب (solid)
  'ج-ب-ل': 'earth',   // جبل (mountain)

  // Wind (هواء) — speed, freedom, change
  'س-ر-ع': 'wind',    // سرع (speed)
  'ح-ر-ر': 'wind',    // حرر (free)
  'غ-ي-ر': 'wind',    // غير (change)
  'ط-ي-ر': 'wind',    // طير (fly)
  'ه-ب-ب': 'wind',    // هبب (blow)

  // Light (نور) — knowledge, truth, guidance
  'ع-ل-م': 'light',   // علم (know)
  'ص-د-ق': 'light',   // صدق (truth)
  'ه-د-ي': 'light',   // هدى (guide)
  'ن-و-ر': 'light',   // نور (light)
  'ب-ص-ر': 'light',   // بصر (sight)

  // Shadow (ظل) — hidden, secret, mystery
  'خ-ف-ي': 'shadow',  // خفي (hidden)
  'س-ر-ر': 'shadow',  // سر (secret)
  'غ-م-ض': 'shadow',  // غمض (mystery)
  'ظ-ل-م': 'shadow',  // ظلم (darkness)
  'ح-ج-ب': 'shadow',  // حجب (veil)

  // Time (زمن) — patience, history, fate
  'ص-ب-ر': 'time',    // صبر (patience)
  'ق-د-م': 'time',    // قدم (ancient)
  'ق-د-ر': 'time',    // قدر (destiny)
  'ع-م-ر': 'time',    // عمر (age)
  'ز-م-ن': 'time',    // زمن (time)

  // Knowledge (علم) — wisdom, writing, reading
  'ك-ت-ب': 'knowledge', // كتب (write)
  'ق-ر-أ': 'knowledge', // قرأ (read)
  'ف-ه-م': 'knowledge', // فهم (understand)
  'ح-ك-م': 'knowledge', // حكم (wisdom/judge)
  'د-ر-س': 'knowledge', // درس (study)

  // Creation (خلق) — making, art, design
  'خ-ل-ق': 'creation', // خلق (create)
  'ص-ن-ع': 'creation', // صنع (make)
  'ر-س-م': 'creation', // رسم (draw)
  'ن-ق-ش': 'creation', // نقش (engrave)
  'ش-ك-ل': 'creation', // شكل (form/shape)

  // Protection (حماية) — shield, guard, shelter
  'ح-م-ي': 'protection', // حمى (protect)
  'ح-ص-ن': 'protection', // حصن (fortress)
  'د-ف-ع': 'protection', // دفع (defend)
  'أ-م-ن': 'protection', // أمن (safety)
  'ح-ف-ظ': 'protection', // حفظ (preserve)
};

/**
 * Spell tiers based on Arabic verb form mastery.
 * Higher forms = more powerful spells, requiring deeper Arabic knowledge.
 */
export const SPELL_TIERS = {
  I:    { name: 'Basic',      nameArabic: 'أساسي',   powerMult: 1.0, mpCost: 5 },
  II:   { name: 'Intensive',  nameArabic: 'مُكَثَّف',  powerMult: 1.3, mpCost: 8 },
  III:  { name: 'Causative',  nameArabic: 'مُسَبِّب',  powerMult: 1.5, mpCost: 12 },
  IV:   { name: 'Transitive', nameArabic: 'مُتَعَدٍّ',  powerMult: 1.7, mpCost: 15 },
  V:    { name: 'Reflexive',  nameArabic: 'انعكاسي',  powerMult: 1.4, mpCost: 10 },
  VI:   { name: 'Mutual',     nameArabic: 'تبادلي',   powerMult: 1.6, mpCost: 14 },
  VII:  { name: 'Passive',    nameArabic: 'مجهول',    powerMult: 1.2, mpCost: 7 },
  VIII: { name: 'Derived',    nameArabic: 'مُشتَقّ',   powerMult: 1.8, mpCost: 18 },
  IX:   { name: 'Color',      nameArabic: 'لَوني',    powerMult: 1.3, mpCost: 9 },
  X:    { name: 'Seeking',    nameArabic: 'استفعال',  powerMult: 2.0, mpCost: 25 },
};

/**
 * Element effectiveness chart.
 * Each element has types it's strong against (2x) and weak against (0.5x).
 */
export const ELEMENT_CHART = {
  fire:       { weak: ['water'],      strong: ['wind', 'creation'] },
  water:      { weak: ['earth'],      strong: ['fire', 'time'] },
  earth:      { weak: ['wind'],       strong: ['water', 'shadow'] },
  wind:       { weak: ['fire'],       strong: ['earth', 'knowledge'] },
  light:      { weak: ['shadow'],     strong: ['time', 'protection'] },
  shadow:     { weak: ['light'],      strong: ['knowledge', 'creation'] },
  time:       { weak: ['creation'],   strong: ['protection', 'wind'] },
  knowledge:  { weak: ['protection'], strong: ['shadow', 'fire'] },
  creation:   { weak: ['time'],       strong: ['light', 'earth'] },
  protection: { weak: ['knowledge'],  strong: ['water', 'shadow'] },
};

/**
 * Get the element multiplier for an attack.
 * @param {string} attackElement - The attacking spell's element
 * @param {string} targetElement - The target's element affinity
 * @returns {number} 2.0 (super effective), 1.0 (neutral), or 0.5 (resisted)
 */
export function getElementMultiplier(attackElement, targetElement) {
  const chart = ELEMENT_CHART[attackElement];
  if (!chart) return 1.0;
  if (chart.strong.includes(targetElement)) return 2.0;
  if (chart.weak.includes(targetElement)) return 0.5;
  return 1.0;
}

/**
 * Get the element for a given Arabic root.
 * @param {string} root - Hyphen-separated 3-letter root (e.g. 'ك-ت-ب')
 * @returns {string|null} Element name or null if not mapped
 */
export function getRootElement(root) {
  return ROOT_ELEMENTS[root] || null;
}

/**
 * Get all roots belonging to an element.
 * @param {string} element
 * @returns {string[]} Array of root strings
 */
export function getRootsByElement(element) {
  return Object.entries(ROOT_ELEMENTS)
    .filter(([, el]) => el === element)
    .map(([root]) => root);
}

/**
 * Element display info for UI.
 */
export const ELEMENT_INFO = {
  fire:       { arabic: 'نار',   color: 0xFF4500, label: 'Fire' },
  water:      { arabic: 'ماء',   color: 0x4169E1, label: 'Water' },
  earth:      { arabic: 'تراب',  color: 0x8B4513, label: 'Earth' },
  wind:       { arabic: 'هواء',  color: 0x98FB98, label: 'Wind' },
  light:      { arabic: 'نور',   color: 0xFFD700, label: 'Light' },
  shadow:     { arabic: 'ظل',    color: 0x4B0082, label: 'Shadow' },
  time:       { arabic: 'زمن',   color: 0xC0C0C0, label: 'Time' },
  knowledge:  { arabic: 'علم',   color: 0x00CED1, label: 'Knowledge' },
  creation:   { arabic: 'خلق',   color: 0xFFFFE0, label: 'Creation' },
  protection: { arabic: 'حماية', color: 0x32CD32, label: 'Protection' },
};
