/**
 * TownKnowledge — Gentle progress measure across vocabulary domains.
 * No penalties — only counts learned words toward progress.
 * Five rating tiers with Arabic labels.
 */

const KNOWLEDGE_DOMAINS = {
  greetings: { nameArabic: 'تحيات', nameEnglish: 'Greetings', weight: 1 },
  food: { nameArabic: 'طعام', nameEnglish: 'Food', weight: 1 },
  trade: { nameArabic: 'تجارة', nameEnglish: 'Trade', weight: 1 },
  nature: { nameArabic: 'طبيعة', nameEnglish: 'Nature', weight: 1 },
  family: { nameArabic: 'عائلة', nameEnglish: 'Family', weight: 1 },
  religion: { nameArabic: 'دين', nameEnglish: 'Religion', weight: 1 },
  directions: { nameArabic: 'اتجاهات', nameEnglish: 'Directions', weight: 1 },
  numbers: { nameArabic: 'أرقام', nameEnglish: 'Numbers', weight: 1 },
  colors: { nameArabic: 'ألوان', nameEnglish: 'Colors', weight: 1 },
  time: { nameArabic: 'وقت', nameEnglish: 'Time', weight: 1 },
};

export class TownKnowledge {
  /**
   * Calculate town knowledge rating.
   * @param {Array} vocabularyData - Full vocabulary dataset
   * @param {Array|Set} learnedWordIds - IDs of words the player has learned
   * @returns {{ overall: number, domains: Object }}
   */
  static calculate(vocabularyData, learnedWordIds) {
    const learned = learnedWordIds instanceof Set ? learnedWordIds : new Set(learnedWordIds || []);
    const domains = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const [domain, config] of Object.entries(KNOWLEDGE_DOMAINS)) {
      const domainWords = vocabularyData.filter(w => w.category === domain);
      const total = domainWords.length;
      const mastered = domainWords.filter(w => learned.has(w.id)).length;
      const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;

      domains[domain] = { ...config, mastered, total, percent };
      totalWeightedScore += percent * config.weight;
      totalWeight += config.weight;
    }

    const overall = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    return { overall, domains };
  }

  static getRatingLabel(overall) {
    if (overall >= 90) return { label: 'Master', labelArabic: 'أستاذ' };
    if (overall >= 70) return { label: 'Scholar', labelArabic: 'عالم' };
    if (overall >= 50) return { label: 'Student', labelArabic: 'طالب' };
    if (overall >= 25) return { label: 'Beginner', labelArabic: 'مبتدئ' };
    return { label: 'Newcomer', labelArabic: 'وافد جديد' };
  }
}

export { KNOWLEDGE_DOMAINS };
