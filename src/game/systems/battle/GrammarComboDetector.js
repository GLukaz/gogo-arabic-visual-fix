/**
 * GrammarComboDetector — Validates Arabic grammar patterns for combat combos (Phase 32)
 *
 * Checks player input against grammar combo templates gated by lesson completion and CEFR level.
 * Three combo types: noun+adjective, verb conjugation chains, sentence construction.
 *
 * @see src/data/grammarCombos.js for combo definitions
 */

import {
  NOUN_ADJ_COMBOS,
  VERB_CHAIN_PATTERNS,
  SENTENCE_TEMPLATES,
} from '../../../data/grammarCombos';

// CEFR level -> minimum player level (mirrors grammarCombos.js thresholds)
const CEFR_LEVEL_REQUIREMENTS = {
  A1: 1,
  A2: 3,
  B1: 7,
  B2: 12,
  C1: 18,
  C2: 25,
};

/**
 * Strip Arabic diacritics (tashkeel) for normalized comparison.
 * Removes fatha, kasra, damma, sukun, shadda, tanween, etc.
 * @param {string} text
 * @returns {string}
 */
function stripDiacritics(text) {
  if (!text) return '';
  // Arabic diacritical marks range: U+0610-U+061A, U+064B-U+065F, U+0670
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '');
}

/**
 * Normalize Arabic text for comparison: strip diacritics and trim.
 * @param {string} text
 * @returns {string}
 */
function normalize(text) {
  if (!text) return '';
  return stripDiacritics(text).trim();
}

export class GrammarComboDetector {
  /**
   * @param {string[]} completedLessons - Array of grammar lesson IDs from grammarSlice
   */
  constructor(completedLessons) {
    this.completedLessons = completedLessons || [];
  }

  /**
   * Detect a noun+adjective combo from Arabic input.
   * Splits input into 2 tokens and matches against NOUN_ADJ_COMBOS.
   *
   * @param {string} arabicInput - Space-separated noun + adjective in Arabic
   * @returns {{ valid: boolean, damageMultiplier?: number, comboType?: string, arabicUsed?: string, matchedCombo?: Object, reason?: string }}
   */
  detectNounAdjectiveCombo(arabicInput) {
    if (!arabicInput || typeof arabicInput !== 'string') {
      return { valid: false, reason: 'Invalid input' };
    }

    const tokens = arabicInput.trim().split(/\s+/);
    if (tokens.length !== 2) {
      return { valid: false, reason: 'Expected 2 words (noun + adjective)' };
    }

    const [inputNoun, inputAdj] = tokens.map(normalize);

    // Find matching combo template
    const matched = NOUN_ADJ_COMBOS.find((combo) => {
      const comboNoun = normalize(combo.noun.arabic);
      const comboAdj = normalize(combo.adjective.arabic);
      return comboNoun === inputNoun && comboAdj === inputAdj;
    });

    if (!matched) {
      return { valid: false, reason: 'No matching noun+adjective combo found' };
    }

    // Check lesson gate
    if (!this.completedLessons.includes(matched.requiredLesson)) {
      return {
        valid: false,
        reason: `Required lesson not completed: ${matched.requiredLesson}`,
      };
    }

    return {
      valid: true,
      damageMultiplier: matched.damageMultiplier,
      comboType: matched.comboType,
      arabicUsed: arabicInput.trim().split(/\s+/).join(' '),
      matchedCombo: matched,
    };
  }

  /**
   * Detect a verb conjugation chain.
   * Validates that currentVerb belongs to a known root pattern and is consistent with previous verbs.
   *
   * @param {string} currentVerb - The verb being added to the chain
   * @param {string[]} previousVerbs - Previously chained verbs (may be empty for first in chain)
   * @returns {{ valid: boolean, damageMultiplier?: number, comboType?: string, chainLength?: number, root?: Object, reason?: string }}
   */
  detectVerbConjugationChain(currentVerb, previousVerbs = []) {
    if (!currentVerb || typeof currentVerb !== 'string') {
      return { valid: false, reason: 'Invalid verb input' };
    }

    // For verb forms, try exact match first (diacritics distinguish forms like I vs II),
    // then fall back to normalized match for user input flexibility
    let matchedPattern = null;
    let matchedFormIndex = -1;

    // Pass 1: exact match (preserves shadda, fatha etc. that distinguish forms)
    for (const pattern of VERB_CHAIN_PATTERNS) {
      const formIdx = pattern.forms.findIndex(
        (f) => f.arabic === currentVerb.trim()
      );
      if (formIdx !== -1) {
        matchedPattern = pattern;
        matchedFormIndex = formIdx;
        break;
      }
    }

    // Pass 2: normalized match (stripped diacritics) if exact didn't work
    if (!matchedPattern) {
      const normalizedCurrent = normalize(currentVerb);
      for (const pattern of VERB_CHAIN_PATTERNS) {
        const formIdx = pattern.forms.findIndex(
          (f) => normalize(f.arabic) === normalizedCurrent
        );
        if (formIdx !== -1) {
          matchedPattern = pattern;
          matchedFormIndex = formIdx;
          break;
        }
      }
    }

    if (!matchedPattern) {
      return { valid: false, reason: 'No matching verb pattern found' };
    }

    // Check lesson gate
    if (!this.completedLessons.includes(matchedPattern.requiredLesson)) {
      return {
        valid: false,
        reason: `Required lesson not completed: ${matchedPattern.requiredLesson}`,
      };
    }

    // Check chain cap
    const chainLength = previousVerbs.length + 1;
    if (previousVerbs.length >= matchedPattern.maxChainLength) {
      return {
        valid: false,
        reason: `Chain exceeds max length of ${matchedPattern.maxChainLength}`,
      };
    }

    // Validate root consistency with previous verbs
    if (previousVerbs.length > 0) {
      const previousBelongToSameRoot = previousVerbs.every((pv) => {
        const trimmed = pv.trim();
        // Exact match first, then normalized
        return matchedPattern.forms.some(
          (f) => f.arabic === trimmed || normalize(f.arabic) === normalize(trimmed)
        );
      });

      if (!previousBelongToSameRoot) {
        return { valid: false, reason: 'Root mismatch with previous verbs in chain' };
      }
    }

    const matchedForm = matchedPattern.forms[matchedFormIndex];

    return {
      valid: true,
      damageMultiplier: matchedForm.damageMultiplier,
      comboType: matchedPattern.comboType,
      chainLength,
      root: matchedPattern.root,
    };
  }

  /**
   * Detect a sentence combo (ultimate attack).
   * Matches {verb, subject, object} against SENTENCE_TEMPLATES slots.
   * Awards partial credit for 2/3 correct slots.
   *
   * @param {{ verb?: string, subject?: string, object?: string }} sentenceParts
   * @returns {{ valid: boolean, damageMultiplier?: number, comboType?: string, accuracy?: number, arabicSentence?: string, reason?: string }}
   */
  detectSentenceCombo(sentenceParts) {
    if (
      !sentenceParts ||
      typeof sentenceParts !== 'object' ||
      (!sentenceParts.verb && !sentenceParts.subject && !sentenceParts.object)
    ) {
      return { valid: false, reason: 'Invalid sentence parts' };
    }

    // Check lesson gate first — return specific message if no templates available
    const hasAvailableTemplates = SENTENCE_TEMPLATES.some((t) =>
      this.completedLessons.includes(t.requiredLesson)
    );
    if (!hasAvailableTemplates) {
      return {
        valid: false,
        reason: 'Required lesson not completed for sentence combos',
      };
    }

    const roles = ['verb', 'subject', 'object'];
    let bestMatch = null;
    let bestScore = 0;

    for (const template of SENTENCE_TEMPLATES) {
      // Skip templates for which lesson is not completed
      if (!this.completedLessons.includes(template.requiredLesson)) {
        continue;
      }

      let score = 0;
      const matchedWords = {};

      for (const role of roles) {
        const inputWord = sentenceParts[role];
        if (!inputWord) continue;

        const normalizedInput = normalize(inputWord);
        const slot = template.slots.find((s) => s.role === role);
        if (!slot) continue;

        // Check primary word
        if (normalize(slot.arabic) === normalizedInput) {
          score++;
          matchedWords[role] = inputWord;
          continue;
        }

        // Check alternatives
        const altMatch = (slot.alternatives || []).find(
          (alt) => normalize(alt.arabic) === normalizedInput
        );
        if (altMatch) {
          score++;
          matchedWords[role] = inputWord;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = { template, matchedWords, score };
      }
    }

    if (!bestMatch || bestScore === 0) {
      return { valid: false, reason: 'No matching sentence template found' };
    }

    const accuracy = bestScore / 3;
    const baseDamageMultiplier = bestMatch.template.damageMultiplier;
    // Scale multiplier by accuracy (full credit at 100%, reduced proportionally)
    const damageMultiplier = parseFloat(
      (baseDamageMultiplier * accuracy).toFixed(2)
    );

    // Build the arabic sentence from matched parts
    const arabicParts = [];
    for (const role of roles) {
      if (bestMatch.matchedWords[role]) {
        arabicParts.push(bestMatch.matchedWords[role]);
      }
    }
    const arabicSentence = arabicParts.join(' ');

    return {
      valid: true,
      damageMultiplier,
      comboType: bestMatch.template.comboType,
      accuracy,
      arabicSentence,
    };
  }

  /**
   * Get available combo types based on completed lessons and player level.
   *
   * @param {number} playerLevel
   * @returns {string[]} Array of available combo type strings
   */
  getAvailableComboTypes(playerLevel) {
    const level = playerLevel || 0;
    const types = new Set();

    // Check noun+adjective combos
    const hasNounAdj = NOUN_ADJ_COMBOS.some(
      (combo) =>
        this.completedLessons.includes(combo.requiredLesson) &&
        level >= (CEFR_LEVEL_REQUIREMENTS[combo.cefrLevel] || 1)
    );
    if (hasNounAdj) types.add('noun_adjective');

    // Check verb chain combos
    const hasVerbChain = VERB_CHAIN_PATTERNS.some(
      (combo) =>
        this.completedLessons.includes(combo.requiredLesson) &&
        level >= (CEFR_LEVEL_REQUIREMENTS[combo.cefrLevel] || 1)
    );
    if (hasVerbChain) types.add('verb_chain');

    // Check sentence combos
    const hasSentence = SENTENCE_TEMPLATES.some(
      (combo) =>
        this.completedLessons.includes(combo.requiredLesson) &&
        level >= (CEFR_LEVEL_REQUIREMENTS[combo.cefrLevel] || 1)
    );
    if (hasSentence) types.add('ultimate_sentence');

    return [...types];
  }
}
