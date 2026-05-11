import { describe, it, expect } from 'vitest';
import { GrammarComboDetector } from '../GrammarComboDetector';

describe('GrammarComboDetector', () => {
  // ──────────────────────────────────────────────────
  // detectNounAdjectiveCombo
  // ──────────────────────────────────────────────────
  describe('detectNounAdjectiveCombo', () => {
    it('returns valid combo when input matches a noun+adj template', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const result = detector.detectNounAdjectiveCombo('درع قوي');
      expect(result.valid).toBe(true);
      expect(result.comboType).toBe('noun_adjective');
      expect(result.matchedCombo).toBeDefined();
      expect(result.matchedCombo.id).toBe('na_strong_shield');
    });

    it('returns damageMultiplier from matched template', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const result = detector.detectNounAdjectiveCombo('سيف حاد');
      expect(result.valid).toBe(true);
      expect(result.damageMultiplier).toBe(1.4);
    });

    it('returns invalid when lesson not completed', () => {
      const detector = new GrammarComboDetector([]);
      const result = detector.detectNounAdjectiveCombo('درع قوي');
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/lesson/i);
    });

    it('returns invalid when input has wrong word count', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const result = detector.detectNounAdjectiveCombo('درع');
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/word/i);
    });

    it('returns invalid when words do not match any template', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const result = detector.detectNounAdjectiveCombo('كلب كبير');
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/match/i);
    });

    it('records arabicUsed in result', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const result = detector.detectNounAdjectiveCombo('نار مشتعلة');
      expect(result.valid).toBe(true);
      expect(result.arabicUsed).toBe('نار مشتعلة');
    });

    it('handles input with extra whitespace', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const result = detector.detectNounAdjectiveCombo('  درع   قوي  ');
      expect(result.valid).toBe(true);
      expect(result.matchedCombo.id).toBe('na_strong_shield');
    });

    it('returns invalid for empty input', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const result = detector.detectNounAdjectiveCombo('');
      expect(result.valid).toBe(false);
    });

    it('returns invalid for null/undefined input', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      expect(detector.detectNounAdjectiveCombo(null).valid).toBe(false);
      expect(detector.detectNounAdjectiveCombo(undefined).valid).toBe(false);
    });
  });

  // ──────────────────────────────────────────────────
  // detectVerbConjugationChain
  // ──────────────────────────────────────────────────
  describe('detectVerbConjugationChain', () => {
    it('returns valid chain with correct root across forms', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      // Use Form I of ktb root
      const result = detector.detectVerbConjugationChain('كَتَبَ', []);
      expect(result.valid).toBe(true);
      expect(result.comboType).toBe('verb_chain');
      expect(result.root).toBeDefined();
    });

    it('escalates damage multiplier per chain link', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      // Start chain with Form I, then continue with Form II
      const result1 = detector.detectVerbConjugationChain('كَتَبَ', []);
      expect(result1.damageMultiplier).toBe(1.0);

      const result2 = detector.detectVerbConjugationChain('كَتَّبَ', ['كَتَبَ']);
      expect(result2.valid).toBe(true);
      expect(result2.damageMultiplier).toBeGreaterThan(1.0);
    });

    it('returns invalid when lesson not completed', () => {
      const detector = new GrammarComboDetector([]);
      const result = detector.detectVerbConjugationChain('كَتَبَ', []);
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/lesson/i);
    });

    it('returns invalid when root mismatch', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      // Mix roots: ktb Form I then ilm Form II
      const result = detector.detectVerbConjugationChain('عَلَّمَ', ['كَتَبَ']);
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/root/i);
    });

    it('tracks chainLength in result', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      const result = detector.detectVerbConjugationChain('كَتَّبَ', ['كَتَبَ']);
      expect(result.valid).toBe(true);
      expect(result.chainLength).toBe(2);
    });

    it('caps chain at maxChainLength', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      // Chain of 3 is max for ktb root, trying to add a 4th should fail
      const result = detector.detectVerbConjugationChain('كَتَبَ', [
        'كَتَبَ',
        'كَتَّبَ',
        'أَكْتَبَ',
      ]);
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/max|cap|limit/i);
    });

    it('returns invalid for verb not in any pattern', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      const result = detector.detectVerbConjugationChain('أكلَ', []);
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/match|found|pattern/i);
    });

    it('returns invalid for null/undefined verb', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      expect(detector.detectVerbConjugationChain(null, []).valid).toBe(false);
      expect(detector.detectVerbConjugationChain(undefined, []).valid).toBe(false);
    });
  });

  // ──────────────────────────────────────────────────
  // detectSentenceCombo
  // ──────────────────────────────────────────────────
  describe('detectSentenceCombo', () => {
    it('returns valid ultimate when all 3 slots filled correctly', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      const result = detector.detectSentenceCombo({
        verb: 'ضَرَبَ',
        subject: 'المُحارِبُ',
        object: 'العَدُوَّ',
      });
      expect(result.valid).toBe(true);
      expect(result.comboType).toBe('ultimate_sentence');
      expect(result.accuracy).toBe(1.0);
    });

    it('returns correct damage multiplier for perfect sentence', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      const result = detector.detectSentenceCombo({
        verb: 'ضَرَبَ',
        subject: 'المُحارِبُ',
        object: 'العَدُوَّ',
      });
      expect(result.valid).toBe(true);
      // st_warrior_strikes has damageMultiplier 2.5
      expect(result.damageMultiplier).toBe(2.5);
    });

    it('returns partial credit for 2 of 3 slots correct', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      const result = detector.detectSentenceCombo({
        verb: 'ضَرَبَ',
        subject: 'المُحارِبُ',
        object: 'خطأ', // wrong object
      });
      expect(result.valid).toBe(true);
      expect(result.accuracy).toBeCloseTo(2 / 3, 1);
      expect(result.damageMultiplier).toBeLessThan(2.5);
    });

    it('returns invalid when sentence lesson not completed', () => {
      const detector = new GrammarComboDetector([]);
      const result = detector.detectSentenceCombo({
        verb: 'ضَرَبَ',
        subject: 'المُحارِبُ',
        object: 'العَدُوَّ',
      });
      expect(result.valid).toBe(false);
      expect(result.reason).toMatch(/lesson/i);
    });

    it('returns invalid when no slots match', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      const result = detector.detectSentenceCombo({
        verb: 'خطأ',
        subject: 'خطأ',
        object: 'خطأ',
      });
      expect(result.valid).toBe(false);
    });

    it('accepts alternative words in slots', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      // st_warrior_strikes has alternative verb هاجَمَ (attacked)
      const result = detector.detectSentenceCombo({
        verb: 'هاجَمَ',
        subject: 'الفارِسُ',
        object: 'الوَحْشَ',
      });
      expect(result.valid).toBe(true);
      expect(result.accuracy).toBe(1.0);
    });

    it('builds arabicSentence from matched parts', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      const result = detector.detectSentenceCombo({
        verb: 'ضَرَبَ',
        subject: 'المُحارِبُ',
        object: 'العَدُوَّ',
      });
      expect(result.arabicSentence).toBeDefined();
      expect(typeof result.arabicSentence).toBe('string');
      expect(result.arabicSentence.length).toBeGreaterThan(0);
    });

    it('returns invalid for missing sentenceParts', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      expect(detector.detectSentenceCombo(null).valid).toBe(false);
      expect(detector.detectSentenceCombo({}).valid).toBe(false);
    });
  });

  // ──────────────────────────────────────────────────
  // getAvailableComboTypes
  // ──────────────────────────────────────────────────
  describe('getAvailableComboTypes', () => {
    it('returns empty when no lessons completed', () => {
      const detector = new GrammarComboDetector([]);
      const types = detector.getAvailableComboTypes(1);
      expect(types).toEqual([]);
    });

    it('returns noun_adjective when noun-adjective-agreement completed and level >= 3', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const types = detector.getAvailableComboTypes(3);
      expect(types).toContain('noun_adjective');
      expect(types).not.toContain('verb_chain');
      expect(types).not.toContain('ultimate_sentence');
    });

    it('returns all types when all lessons completed and level 7+', () => {
      const detector = new GrammarComboDetector([
        'noun-adjective-agreement',
        'basic-verb-conjugation',
      ]);
      const types = detector.getAvailableComboTypes(7);
      expect(types).toContain('noun_adjective');
      expect(types).toContain('verb_chain');
      expect(types).toContain('ultimate_sentence');
    });

    it('does not return noun_adjective at level 1 (below A2 threshold)', () => {
      const detector = new GrammarComboDetector(['noun-adjective-agreement']);
      const types = detector.getAvailableComboTypes(1);
      // NOUN_ADJ_COMBOS require A2 = level 3
      expect(types).not.toContain('noun_adjective');
    });

    it('does not return verb_chain at level 5 (below B1 threshold)', () => {
      const detector = new GrammarComboDetector(['basic-verb-conjugation']);
      const types = detector.getAvailableComboTypes(5);
      // VERB_CHAIN_PATTERNS require B1 = level 7
      expect(types).not.toContain('verb_chain');
    });
  });
});
