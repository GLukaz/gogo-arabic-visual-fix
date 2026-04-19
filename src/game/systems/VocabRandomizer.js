/**
 * VocabRandomizer — Shuffles word-to-zone assignments for replayability.
 * Uses seeded PRNG for reproducible shuffles. Keeps category grouping intact
 * and ensures A1/beginner words always stay in the starter zone.
 */
export class VocabRandomizer {
  constructor(seed = Date.now()) {
    this.seed = seed;
  }

  // Mulberry32 seeded PRNG
  _random() {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  // Fisher-Yates shuffle using seeded random
  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this._random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /**
   * Randomize word-to-zone assignments.
   * @param {Array} vocabulary - Full vocabulary dataset
   * @param {Array} zones - Zone ID strings
   * @returns {Object} { [zoneName]: [word, word, ...] }
   */
  randomize(vocabulary, zones) {
    // Group words by category
    const categories = {};
    for (const word of vocabulary) {
      const cat = word.category || 'general';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(word);
    }

    // Shuffle category order
    const catNames = this._shuffle(Object.keys(categories));

    // Initialize zone buckets
    const zoneAssignments = {};
    for (const z of zones) zoneAssignments[z] = [];

    const zoneList = [...zones];
    let zoneIdx = 0;

    for (const catName of catNames) {
      const words = categories[catName];
      // A1/beginner categories always go to first zone (starter zone)
      const isBeginnerCat = words.length > 0 && words.every(w => (w.cefr === 'A1' || w.cefrLevel === 'A1'));
      const targetZone = isBeginnerCat ? zoneList[0] : zoneList[zoneIdx % zoneList.length];
      zoneAssignments[targetZone].push(...words);
      if (!isBeginnerCat) zoneIdx++;
    }

    return zoneAssignments;
  }
}
