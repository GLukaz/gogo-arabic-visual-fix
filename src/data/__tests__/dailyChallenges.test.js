import { describe, it, expect } from 'vitest';
import {
  CHALLENGE_TYPES,
  CHALLENGE_TYPE_KEYS,
  STREAK_REWARDS,
  getDailyChallengeType,
  generateWordOfTheDay,
  generateCulturalTrivia,
  generateGrammarChallenge,
  generateSpeedQuiz,
  getStreakReward,
  getNextStreakReward,
} from '../dailyChallenges.js';

// ============================================================
// CHALLENGE_TYPES
// ============================================================

describe('CHALLENGE_TYPES', () => {
  it('exports exactly 4 challenge types', () => {
    expect(Object.keys(CHALLENGE_TYPES)).toHaveLength(4);
  });

  it('contains all 4 expected types', () => {
    const expected = ['word_of_the_day', 'grammar_challenge', 'speed_quiz', 'cultural_trivia'];
    expected.forEach((key) => {
      expect(CHALLENGE_TYPES).toHaveProperty(key);
    });
  });

  it('every type has required fields', () => {
    Object.entries(CHALLENGE_TYPES).forEach(([key, type]) => {
      expect(type).toHaveProperty('label');
      expect(type).toHaveProperty('labelArabic');
      expect(type).toHaveProperty('description');
      expect(type).toHaveProperty('icon');
      expect(type).toHaveProperty('baseXp');
      expect(type).toHaveProperty('streakMultiplier');
      expect(typeof type.label).toBe('string');
      expect(typeof type.labelArabic).toBe('string');
      expect(typeof type.baseXp).toBe('number');
      expect(type.baseXp).toBeGreaterThan(0);
      expect(type.streakMultiplier).toBe(true);
    });
  });

  it('CHALLENGE_TYPE_KEYS matches CHALLENGE_TYPES keys', () => {
    expect(CHALLENGE_TYPE_KEYS).toEqual(Object.keys(CHALLENGE_TYPES));
    expect(CHALLENGE_TYPE_KEYS).toHaveLength(4);
  });
});

// ============================================================
// STREAK_REWARDS
// ============================================================

describe('STREAK_REWARDS', () => {
  it('has 5 reward tiers', () => {
    expect(STREAK_REWARDS).toHaveLength(5);
  });

  it('tiers are in ascending day order', () => {
    for (let i = 1; i < STREAK_REWARDS.length; i++) {
      expect(STREAK_REWARDS[i].days).toBeGreaterThan(STREAK_REWARDS[i - 1].days);
    }
  });

  it('every tier has required fields', () => {
    STREAK_REWARDS.forEach((tier) => {
      expect(tier).toHaveProperty('days');
      expect(tier).toHaveProperty('xpBonus');
      expect(tier).toHaveProperty('title');
      expect(tier).toHaveProperty('titleArabic');
      expect(typeof tier.days).toBe('number');
      expect(typeof tier.xpBonus).toBe('number');
      expect(tier.xpBonus).toBeGreaterThan(0);
    });
  });

  it('tiers at 7+ days include an item', () => {
    STREAK_REWARDS.filter((t) => t.days >= 7).forEach((tier) => {
      expect(tier).toHaveProperty('item');
      expect(typeof tier.item).toBe('string');
    });
  });

  it('tier days match expected values', () => {
    const expected = [3, 7, 14, 30, 60];
    expect(STREAK_REWARDS.map((t) => t.days)).toEqual(expected);
  });
});

// ============================================================
// getDailyChallengeType — deterministic
// ============================================================

describe('getDailyChallengeType', () => {
  it('returns a valid challenge type key', () => {
    const result = getDailyChallengeType('2026-03-27');
    expect(CHALLENGE_TYPE_KEYS).toContain(result);
  });

  it('is deterministic — same date returns same type', () => {
    const a = getDailyChallengeType('2026-03-27');
    const b = getDailyChallengeType('2026-03-27');
    expect(a).toBe(b);
  });

  it('different dates may produce different types', () => {
    const results = new Set();
    // Test many dates to verify distribution
    for (let d = 1; d <= 30; d++) {
      const date = `2026-03-${String(d).padStart(2, '0')}`;
      results.add(getDailyChallengeType(date));
    }
    // With 30 days and 4 types, we expect at least 2 different types
    expect(results.size).toBeGreaterThanOrEqual(2);
  });

  it('returns valid type for edge-case dates', () => {
    expect(CHALLENGE_TYPE_KEYS).toContain(getDailyChallengeType('2000-01-01'));
    expect(CHALLENGE_TYPE_KEYS).toContain(getDailyChallengeType('2099-12-31'));
    expect(CHALLENGE_TYPE_KEYS).toContain(getDailyChallengeType('2026-02-28'));
  });
});

// ============================================================
// generateWordOfTheDay
// ============================================================

describe('generateWordOfTheDay', () => {
  const mockVocab = [
    { id: 'v1', arabic: 'كتاب', english: 'book', transliteration: 'kitaab', category: 'education' },
    { id: 'v2', arabic: 'بيت', english: 'house', transliteration: 'bayt', category: 'daily_life' },
    { id: 'v3', arabic: 'ماء', english: 'water', transliteration: "maa'", category: 'food' },
    { id: 'v4', arabic: 'شمس', english: 'sun', transliteration: 'shams', category: 'nature' },
    { id: 'v5', arabic: 'قمر', english: 'moon', transliteration: 'qamar', category: 'nature' },
    { id: 'v6', arabic: 'ولد', english: 'boy', transliteration: 'walad', category: 'family' },
    { id: 'v7', arabic: 'بنت', english: 'girl', transliteration: 'bint', category: 'family' },
    { id: 'v8', arabic: 'سلام', english: 'peace', transliteration: 'salaam', category: 'greetings' },
  ];

  it('returns null for empty vocabulary', () => {
    expect(generateWordOfTheDay('2026-03-27', [])).toBeNull();
    expect(generateWordOfTheDay('2026-03-27', null)).toBeNull();
  });

  it('returns a word and 3 exercises', () => {
    const result = generateWordOfTheDay('2026-03-27', mockVocab);
    expect(result).toBeTruthy();
    expect(result.word).toBeTruthy();
    expect(result.exercises).toHaveLength(3);
  });

  it('is deterministic — same date + vocab = same word', () => {
    const a = generateWordOfTheDay('2026-03-27', mockVocab);
    const b = generateWordOfTheDay('2026-03-27', mockVocab);
    expect(a.word.id).toBe(b.word.id);
  });

  it('exercises have correct structure', () => {
    const result = generateWordOfTheDay('2026-03-27', mockVocab);
    result.exercises.forEach((ex) => {
      expect(ex).toHaveProperty('type');
      expect(ex).toHaveProperty('prompt');
      expect(ex).toHaveProperty('correctAnswer');
      expect(ex).toHaveProperty('options');
      expect(ex.options.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('each exercise contains the correct answer in options', () => {
    const result = generateWordOfTheDay('2026-03-27', mockVocab);
    result.exercises.forEach((ex) => {
      expect(ex.options).toContain(ex.correctAnswer);
    });
  });

  it('exercise types cover all 3 stages', () => {
    const result = generateWordOfTheDay('2026-03-27', mockVocab);
    const types = result.exercises.map((e) => e.type);
    expect(types).toContain('match_meaning');
    expect(types).toContain('match_arabic');
    expect(types).toContain('recall');
  });
});

// ============================================================
// generateCulturalTrivia
// ============================================================

describe('generateCulturalTrivia', () => {
  const mockLore = [
    { id: 'l1', title: 'Ibn Sina', keyTerm: { arabic: 'طبيب', english: 'physician', transliteration: 'tabib' } },
    { id: 'l2', title: 'Al-Khwarizmi', keyTerm: { arabic: 'الجبر', english: 'algebra', transliteration: 'al-jabr' } },
    { id: 'l3', title: 'House of Wisdom', keyTerm: { arabic: 'حكمة', english: 'wisdom', transliteration: 'hikma' } },
    { id: 'l4', title: 'Ibn Rushd', keyTerm: { arabic: 'فلسفة', english: 'philosophy', transliteration: 'falsafa' } },
    { id: 'l5', title: 'Calligraphy', keyTerm: { arabic: 'خط', english: 'calligraphy', transliteration: 'khatt' } },
    { id: 'l6', title: 'Oud', keyTerm: { arabic: 'عود', english: 'oud', transliteration: 'oud' } },
    { id: 'l7', title: 'Arabesque', keyTerm: { arabic: 'زخرفة', english: 'arabesque', transliteration: 'zakhrafa' } },
    { id: 'l8', title: 'Dinar', keyTerm: { arabic: 'دينار', english: 'dinar', transliteration: 'dinar' } },
  ];

  it('returns empty for empty lore', () => {
    expect(generateCulturalTrivia('2026-03-27', [])).toEqual([]);
    expect(generateCulturalTrivia('2026-03-27', null)).toEqual([]);
  });

  it('generates up to 5 trivia questions (limited by mock data size)', () => {
    const result = generateCulturalTrivia('2026-03-27', mockLore);
    // 8 entries with keyTerms, need 3 distractors per question → max 5
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('is deterministic', () => {
    const a = generateCulturalTrivia('2026-03-27', mockLore);
    const b = generateCulturalTrivia('2026-03-27', mockLore);
    expect(a.length).toBe(b.length);
    expect(a.map((q) => q.question)).toEqual(b.map((q) => q.question));
  });

  it('each question has required fields', () => {
    const result = generateCulturalTrivia('2026-03-27', mockLore);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((q) => {
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('loreTitle');
      expect(q).toHaveProperty('correctAnswer');
      expect(q).toHaveProperty('options');
      expect(q.options.length).toBe(4);
    });
  });

  it('correct answer is always in options', () => {
    const result = generateCulturalTrivia('2026-03-27', mockLore);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((q) => {
      expect(q.options).toContain(q.correctAnswer);
    });
  });

  it('references real lore titles', () => {
    const result = generateCulturalTrivia('2026-03-27', mockLore);
    const loreTitles = mockLore.map((l) => l.title);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((q) => {
      expect(loreTitles).toContain(q.loreTitle);
    });
  });
});

// ============================================================
// generateGrammarChallenge
// ============================================================

describe('generateGrammarChallenge', () => {
  const mockGrammar = [
    {
      id: 'g1', title: 'Definite Article', exercises: [
        { type: 'fill-blank', prompt: '___ كتاب', answer: 'ال', options: ['ال', 'إل', 'أل', 'لا'] },
      ],
    },
    {
      id: 'g2', title: 'Noun-Adjective', exercises: [
        { type: 'translate', prompt: 'the big boy', answer: 'الولد الكبير', options: ['ولد كبير', 'الولد الكبير', 'كبير الولد', 'الكبير الولد'] },
      ],
    },
    {
      id: 'g3', title: 'Pronouns', exercises: [
        { type: 'fill-blank', prompt: '___ طالب', answer: 'أنا', options: ['أنا', 'أنت', 'هو', 'هي'] },
      ],
    },
    {
      id: 'g4', title: 'Verb Conjugation', exercises: [
        { type: 'fill-blank', prompt: 'أنا ___ العربية', answer: 'أتكلم', options: ['أتكلم', 'يتكلم', 'تتكلم', 'نتكلم'] },
      ],
    },
    {
      id: 'g5', title: 'Prepositions', exercises: [
        { type: 'fill-blank', prompt: 'الكتاب ___ الطاولة', answer: 'على', options: ['على', 'في', 'من', 'إلى'] },
      ],
    },
    {
      id: 'g6', title: 'Plural Forms', exercises: [
        { type: 'fill-blank', prompt: 'كتاب → ___', answer: 'كتب', options: ['كتب', 'كتابان', 'كاتب', 'مكتب'] },
      ],
    },
  ];

  it('returns empty for empty grammar', () => {
    expect(generateGrammarChallenge('2026-03-27', [])).toEqual([]);
    expect(generateGrammarChallenge('2026-03-27', null)).toEqual([]);
  });

  it('generates up to 5 grammar questions (limited by available lessons)', () => {
    const result = generateGrammarChallenge('2026-03-27', mockGrammar);
    // 6 mock lessons → can get up to 5 (capped at min(5, lessons))
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('is deterministic', () => {
    const a = generateGrammarChallenge('2026-03-27', mockGrammar);
    const b = generateGrammarChallenge('2026-03-27', mockGrammar);
    expect(a.map((q) => q.lessonId)).toEqual(b.map((q) => q.lessonId));
  });

  it('each question has required fields', () => {
    const result = generateGrammarChallenge('2026-03-27', mockGrammar);
    result.forEach((q) => {
      expect(q).toHaveProperty('lessonTitle');
      expect(q).toHaveProperty('lessonId');
      expect(q).toHaveProperty('type');
      expect(q).toHaveProperty('prompt');
      expect(q).toHaveProperty('answer');
      expect(q).toHaveProperty('options');
    });
  });
});

// ============================================================
// generateSpeedQuiz
// ============================================================

describe('generateSpeedQuiz', () => {
  const mockVocab = Array.from({ length: 20 }, (_, i) => ({
    id: `sv${i}`,
    arabic: `عربي${i}`,
    english: `english${i}`,
    transliteration: `trans${i}`,
    category: 'general',
  }));

  it('returns empty for empty vocabulary', () => {
    expect(generateSpeedQuiz('2026-03-27', [])).toEqual([]);
  });

  it('generates 10 speed quiz questions', () => {
    const result = generateSpeedQuiz('2026-03-27', mockVocab);
    expect(result).toHaveLength(10);
  });

  it('is deterministic', () => {
    const a = generateSpeedQuiz('2026-03-27', mockVocab);
    const b = generateSpeedQuiz('2026-03-27', mockVocab);
    expect(a.map((q) => q.arabic)).toEqual(b.map((q) => q.arabic));
  });

  it('each question has 4 options with correct answer included', () => {
    const result = generateSpeedQuiz('2026-03-27', mockVocab);
    result.forEach((q) => {
      expect(q.options).toHaveLength(4);
      expect(q.options).toContain(q.correctAnswer);
      expect(q.timeLimit).toBe(8000);
    });
  });
});

// ============================================================
// getStreakReward
// ============================================================

describe('getStreakReward', () => {
  it('returns null for streak of 0', () => {
    expect(getStreakReward(0)).toBeNull();
  });

  it('returns null for streak below first tier', () => {
    expect(getStreakReward(2)).toBeNull();
  });

  it('returns first tier at exactly 3 days', () => {
    const result = getStreakReward(3);
    expect(result).toBeTruthy();
    expect(result.days).toBe(3);
    expect(result.title).toBe('Dedicated');
  });

  it('returns highest applicable tier', () => {
    const result = getStreakReward(10);
    expect(result.days).toBe(7);
    expect(result.title).toBe('Committed');
  });

  it('returns final tier at 60+ days', () => {
    const result = getStreakReward(60);
    expect(result.days).toBe(60);
    expect(result.title).toBe('Arabic Scholar');

    const result100 = getStreakReward(100);
    expect(result100.days).toBe(60);
  });
});

// ============================================================
// getNextStreakReward
// ============================================================

describe('getNextStreakReward', () => {
  it('returns first tier for streak 0', () => {
    const result = getNextStreakReward(0);
    expect(result.days).toBe(3);
  });

  it('returns next unclaimed tier', () => {
    const result = getNextStreakReward(5);
    expect(result.days).toBe(7);
  });

  it('returns null when all tiers reached', () => {
    expect(getNextStreakReward(60)).toBeNull();
    expect(getNextStreakReward(100)).toBeNull();
  });
});
