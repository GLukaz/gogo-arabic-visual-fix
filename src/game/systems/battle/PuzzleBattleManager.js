/**
 * PuzzleBattleManager.js — Arabic knowledge-gated puzzle battle encounters.
 *
 * Puzzle battles are NOT brute-forceable with high stats. Damage is FIXED —
 * the only way to damage enemies is solving Arabic puzzles correctly.
 * Wrong answers cause the enemy to attack the player.
 *
 * Supports 3 puzzle types:
 * - grammar_pattern: Fill in blanks with correct Arabic grammar forms
 * - vocabulary_match: Match Arabic words to English translations
 * - root_extraction: Identify 3-letter Arabic root from conjugated forms
 *
 * Gates by grammar lesson completion (requiredKnowledge in PUZZLE_BATTLES).
 * Records puzzle completion to arenaSlice via recordPuzzleSolve.
 *
 * Phase 32 — Plan 32-08
 */

import { store } from '../../../store/store.js';
import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { PUZZLE_BATTLES } from '../../../data/arenaChallenges.js';
import { getEnemy } from '../../../data/enemies.js';
import { recordPuzzleSolve } from '../../../store/slices/arenaSlice.js';
import { dealDamageToPlayer } from '../../../store/slices/battleSlice.js';

/**
 * Strip Arabic diacritics (tashkeel) for comparison.
 * Removes: fathah, dammah, kasrah, tanween, shadda, sukun, superscript alef.
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
  return str.replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

/**
 * Fisher-Yates shuffle (same pattern as CookingRecipeOrder).
 * @param {Array} arr
 * @returns {Array} Shuffled copy
 */
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ──────────────────────────────────────────────────
// Puzzle content pools — used to generate puzzle challenges.
// Each pool maps to a requiredKnowledge lesson ID.
// ──────────────────────────────────────────────────

const GRAMMAR_PATTERN_POOL = {
  'noun-adjective-agreement': [
    { sentence: 'الكتاب ___', blank: 'adjective', expectedAnswer: 'الكبير', hint: 'the big (masculine definite)' },
    { sentence: 'المدينة ___', blank: 'adjective', expectedAnswer: 'الجميلة', hint: 'the beautiful (feminine definite)' },
    { sentence: 'ولد ___', blank: 'adjective', expectedAnswer: 'صغير', hint: 'small (masculine indefinite)' },
    { sentence: 'بنت ___', blank: 'adjective', expectedAnswer: 'صغيرة', hint: 'small (feminine indefinite)' },
    { sentence: 'البيت ___', blank: 'adjective', expectedAnswer: 'القديم', hint: 'the old (masculine definite)' },
    { sentence: 'الشجرة ___', blank: 'adjective', expectedAnswer: 'الطويلة', hint: 'the tall (feminine definite)' },
  ],
  'basic-verb-conjugation': [
    { sentence: 'أنا ___ العربية', blank: 'verb', expectedAnswer: 'أتعلم', hint: 'I learn (present tense)' },
    { sentence: 'هو ___ الكتاب', blank: 'verb', expectedAnswer: 'يقرأ', hint: 'he reads (present tense)' },
    { sentence: 'هي ___ الطعام', blank: 'verb', expectedAnswer: 'تطبخ', hint: 'she cooks (present tense)' },
    { sentence: 'نحن ___ إلى المدرسة', blank: 'verb', expectedAnswer: 'نذهب', hint: 'we go (present tense)' },
    { sentence: 'هم ___ في البيت', blank: 'verb', expectedAnswer: 'يجلسون', hint: 'they sit (present tense, masculine)' },
    { sentence: 'أنتَ ___ جيداً', blank: 'verb', expectedAnswer: 'تكتب', hint: 'you write (present tense, masculine)' },
  ],
  'al-definite': [
    { sentence: '___ شمس', blank: 'article', expectedAnswer: 'الشَّمس', hint: 'the sun (sun letter assimilation)' },
    { sentence: '___ قمر', blank: 'article', expectedAnswer: 'القَمَر', hint: 'the moon (moon letter, no assimilation)' },
    { sentence: '___ نهر', blank: 'article', expectedAnswer: 'النَّهر', hint: 'the river (sun letter)' },
    { sentence: '___ كتاب', blank: 'article', expectedAnswer: 'الكتاب', hint: 'the book (moon letter)' },
    { sentence: '___ سماء', blank: 'article', expectedAnswer: 'السَّماء', hint: 'the sky (sun letter)' },
    { sentence: '___ بحر', blank: 'article', expectedAnswer: 'البحر', hint: 'the sea (moon letter)' },
  ],
};

const VOCABULARY_MATCH_POOL = [
  { arabic: 'ماء', english: 'water' },
  { arabic: 'نار', english: 'fire' },
  { arabic: 'أرض', english: 'earth' },
  { arabic: 'هواء', english: 'air' },
  { arabic: 'شمس', english: 'sun' },
  { arabic: 'قمر', english: 'moon' },
  { arabic: 'نجم', english: 'star' },
  { arabic: 'بحر', english: 'sea' },
  { arabic: 'جبل', english: 'mountain' },
  { arabic: 'نهر', english: 'river' },
  { arabic: 'شجرة', english: 'tree' },
  { arabic: 'زهرة', english: 'flower' },
];

const ROOT_EXTRACTION_POOL = [
  { word: 'كتاب', expectedRoot: 'كتب', hint: 'book (writing)' },
  { word: 'مدرسة', expectedRoot: 'درس', hint: 'school (studying)' },
  { word: 'معلم', expectedRoot: 'علم', hint: 'teacher (knowledge)' },
  { word: 'مكتوب', expectedRoot: 'كتب', hint: 'written (writing)' },
  { word: 'جميل', expectedRoot: 'جمل', hint: 'beautiful (beauty)' },
  { word: 'فاعل', expectedRoot: 'فعل', hint: 'doer (doing)' },
  { word: 'سافر', expectedRoot: 'سفر', hint: 'traveled (travel)' },
  { word: 'مسجد', expectedRoot: 'سجد', hint: 'mosque (prostration)' },
  { word: 'حاكم', expectedRoot: 'حكم', hint: 'ruler (ruling)' },
  { word: 'منزل', expectedRoot: 'نزل', hint: 'house (descending)' },
];

export class PuzzleBattleManager {
  /**
   * @param {Phaser.Scene} scene - The battle scene instance
   * @param {Object} puzzleConfig - Puzzle configuration from PUZZLE_BATTLES
   */
  constructor(scene, puzzleConfig) {
    this.scene = scene;
    this.config = puzzleConfig;
    this.puzzlesSolved = 0;
    this.puzzlesAttempted = 0;
    this.puzzlesRequired = this._getPuzzlesRequired();
    this.currentPuzzle = null;
    this.isActive = false;
    this.enemyHP = this._getEnemyHP();
    this._usedPuzzleIndices = [];
  }

  /**
   * Determine how many puzzles are required for victory.
   * @returns {number}
   * @private
   */
  _getPuzzlesRequired() {
    if (this.config.victoryCondition === 'solve_3_puzzles') return 3;
    if (this.config.victoryCondition === 'complete_pattern') return 5;
    return 3;
  }

  /**
   * Calculate total enemy HP from the enemy party.
   * @returns {number}
   * @private
   */
  _getEnemyHP() {
    if (!this.config.enemyParty || this.config.enemyParty.length === 0) return 100;
    const totalHP = this.config.enemyParty.reduce((sum, enemyId) => {
      const enemy = getEnemy(enemyId);
      return sum + (enemy ? enemy.baseHP : 50);
    }, 0);
    return totalHP;
  }

  /**
   * Check if player has required knowledge for this puzzle.
   * @returns {boolean}
   */
  canAttempt() {
    const completedLessons = store.getState().grammar.completedLessons;
    return this.config.requiredKnowledge.every((k) =>
      completedLessons.includes(k)
    );
  }

  /**
   * Get missing knowledge prerequisites.
   * @returns {string[]} Array of lesson IDs the player has not completed
   */
  getMissingKnowledge() {
    const completedLessons = store.getState().grammar.completedLessons;
    return this.config.requiredKnowledge.filter(
      (k) => !completedLessons.includes(k)
    );
  }

  /**
   * Start the puzzle battle.
   * @returns {boolean} true if started, false if missing knowledge
   */
  start() {
    if (!this.canAttempt()) {
      return false;
    }

    this.puzzlesSolved = 0;
    this.puzzlesAttempted = 0;
    this.isActive = true;
    this._usedPuzzleIndices = [];

    this.generatePuzzle();
    return true;
  }

  /**
   * Generate the next puzzle challenge.
   * Emits PUZZLE_CHALLENGE event with challenge data for React to render.
   */
  generatePuzzle() {
    const puzzle = this._createPuzzle();
    this.currentPuzzle = puzzle;

    EventBus.emit(EVENTS.PUZZLE_CHALLENGE, {
      puzzleId: this.config.id,
      puzzleType: this.config.puzzleType,
      puzzle,
      progress: {
        solved: this.puzzlesSolved,
        required: this.puzzlesRequired,
        attempted: this.puzzlesAttempted,
      },
    });
  }

  /**
   * Create a puzzle based on the puzzle type.
   * @returns {Object} Puzzle challenge data
   * @private
   */
  _createPuzzle() {
    switch (this.config.puzzleType) {
      case 'grammar_pattern':
        return this._createGrammarPatternPuzzle();
      case 'vocabulary_match':
        return this._createVocabularyMatchPuzzle();
      case 'root_extraction':
        return this._createRootExtractionPuzzle();
      default:
        return this._createGrammarPatternPuzzle();
    }
  }

  /**
   * Create a grammar pattern puzzle (fill-in-the-blank).
   * @returns {Object}
   * @private
   */
  _createGrammarPatternPuzzle() {
    // Collect all items from relevant knowledge pools
    const items = [];
    for (const knowledge of this.config.requiredKnowledge) {
      if (GRAMMAR_PATTERN_POOL[knowledge]) {
        items.push(...GRAMMAR_PATTERN_POOL[knowledge]);
      }
    }

    if (items.length === 0) {
      // Fallback: use first pool available
      const firstKey = Object.keys(GRAMMAR_PATTERN_POOL)[0];
      items.push(...GRAMMAR_PATTERN_POOL[firstKey]);
    }

    // Pick a random item not recently used
    const available = items.filter(
      (_, i) => !this._usedPuzzleIndices.includes(i)
    );
    const pool = available.length > 0 ? available : items;
    const item = pool[Math.floor(Math.random() * pool.length)];

    this._usedPuzzleIndices.push(items.indexOf(item));

    return {
      type: 'grammar_pattern',
      sentence: item.sentence,
      blank: item.blank,
      expectedAnswer: item.expectedAnswer,
      hint: item.hint,
    };
  }

  /**
   * Create a vocabulary match puzzle (match Arabic to English).
   * @returns {Object}
   * @private
   */
  _createVocabularyMatchPuzzle() {
    // Pick 4 random pairs
    const shuffled = shuffle(VOCABULARY_MATCH_POOL);
    const pairs = shuffled.slice(0, 4);

    return {
      type: 'vocabulary_match',
      correctPairs: pairs.map((p) => ({ arabic: p.arabic, english: p.english })),
      // Shuffled Arabic and English sides for the player to match
      arabicWords: shuffle(pairs.map((p) => p.arabic)),
      englishWords: shuffle(pairs.map((p) => p.english)),
    };
  }

  /**
   * Create a root extraction puzzle (identify 3-letter root).
   * @returns {Object}
   * @private
   */
  _createRootExtractionPuzzle() {
    const available = ROOT_EXTRACTION_POOL.filter(
      (_, i) => !this._usedPuzzleIndices.includes(i)
    );
    const pool = available.length > 0 ? available : ROOT_EXTRACTION_POOL;
    const item = pool[Math.floor(Math.random() * pool.length)];

    this._usedPuzzleIndices.push(ROOT_EXTRACTION_POOL.indexOf(item));

    return {
      type: 'root_extraction',
      word: item.word,
      expectedRoot: item.expectedRoot,
      hint: item.hint,
    };
  }

  /**
   * Submit an answer to the current puzzle.
   * @param {Object} answer - Answer object (format depends on puzzle type)
   * @returns {{ correct: boolean, damage: number }} Result of the submission
   */
  submitAnswer(answer) {
    if (!this.isActive || !this.currentPuzzle) {
      return { correct: false, damage: 0 };
    }

    this.puzzlesAttempted++;
    const isCorrect = this._validateAnswer(answer);

    // Fixed damage: total enemy HP divided by puzzles required
    const puzzleDamage = Math.floor(this.enemyHP / this.puzzlesRequired);

    // Enemy attack damage on wrong answer
    const enemyDamage = this._getEnemyAttackDamage();

    if (isCorrect) {
      this.puzzlesSolved++;

      EventBus.emit(EVENTS.PUZZLE_ANSWER_RESULT, {
        correct: true,
        damage: puzzleDamage,
        solved: this.puzzlesSolved,
        required: this.puzzlesRequired,
      });

      // Check victory condition
      if (this.puzzlesSolved >= this.puzzlesRequired) {
        this._completePuzzle(true);
        return { correct: true, damage: puzzleDamage };
      }

      // Generate next puzzle
      this.generatePuzzle();
      return { correct: true, damage: puzzleDamage };
    } else {
      // Wrong answer: enemy attacks player (penalty for guessing)
      store.dispatch(dealDamageToPlayer({ damage: enemyDamage }));

      EventBus.emit(EVENTS.PUZZLE_ANSWER_RESULT, {
        correct: false,
        enemyDamage,
        solved: this.puzzlesSolved,
        required: this.puzzlesRequired,
      });

      // Check if player HP dropped to 0
      const playerHP = store.getState().battle.playerHP;
      if (playerHP <= 0) {
        this._completePuzzle(false);
        return { correct: false, damage: 0 };
      }

      // Generate next puzzle (new challenge after wrong answer)
      this.generatePuzzle();
      return { correct: false, damage: 0 };
    }
  }

  /**
   * Calculate enemy attack damage for wrong answers.
   * Scales slightly with puzzle difficulty.
   * @returns {number}
   * @private
   */
  _getEnemyAttackDamage() {
    const baseDamage = 10;
    const knowledgeMultiplier = Math.max(1, this.config.requiredKnowledge.length);
    return baseDamage * knowledgeMultiplier;
  }

  /**
   * Validate a player's answer against the current puzzle.
   * @param {Object} answer
   * @returns {boolean}
   * @private
   */
  _validateAnswer(answer) {
    if (!answer || !this.currentPuzzle) return false;

    switch (this.currentPuzzle.type) {
      case 'grammar_pattern':
        return this._validateGrammarPattern(answer);
      case 'vocabulary_match':
        return this._validateVocabularyMatch(answer);
      case 'root_extraction':
        return this._validateRootExtraction(answer);
      default:
        return false;
    }
  }

  /**
   * Validate grammar pattern answer.
   * @param {{ filledWord: string }} answer
   * @returns {boolean}
   * @private
   */
  _validateGrammarPattern(answer) {
    if (!answer.filledWord) return false;
    return (
      normalize(answer.filledWord) ===
      normalize(this.currentPuzzle.expectedAnswer)
    );
  }

  /**
   * Validate vocabulary match answer.
   * @param {{ pairs: Array<{ arabic: string, english: string }> }} answer
   * @returns {boolean}
   * @private
   */
  _validateVocabularyMatch(answer) {
    if (!answer.pairs || !Array.isArray(answer.pairs)) return false;

    const correct = this.currentPuzzle.correctPairs;
    if (answer.pairs.length !== correct.length) return false;

    return answer.pairs.every((pair) =>
      correct.some(
        (c) =>
          normalize(c.arabic) === normalize(pair.arabic) &&
          c.english === pair.english
      )
    );
  }

  /**
   * Validate root extraction answer.
   * Accepts hyphenated form (e.g. 'ك-ت-ب') or plain (e.g. 'كتب').
   * @param {{ root: string }} answer
   * @returns {boolean}
   * @private
   */
  _validateRootExtraction(answer) {
    if (!answer.root) return false;

    const cleanAnswer = normalize(answer.root.replace(/-/g, ''));
    const cleanExpected = normalize(
      this.currentPuzzle.expectedRoot.replace(/-/g, '')
    );

    return cleanAnswer === cleanExpected;
  }

  /**
   * Complete the puzzle battle (victory or defeat).
   * @param {boolean} victory
   * @private
   */
  _completePuzzle(victory) {
    this.isActive = false;

    store.dispatch(
      recordPuzzleSolve({
        puzzleId: this.config.id,
        solved: victory,
      })
    );

    EventBus.emit(EVENTS.PUZZLE_COMPLETE, {
      puzzleId: this.config.id,
      victory,
      puzzlesSolved: this.puzzlesSolved,
      puzzlesRequired: this.puzzlesRequired,
      puzzlesAttempted: this.puzzlesAttempted,
      accuracy:
        this.puzzlesAttempted > 0
          ? Math.round((this.puzzlesSolved / this.puzzlesAttempted) * 100) / 100
          : 0,
    });
  }

  /**
   * Get current puzzle state for UI rendering.
   * @returns {Object}
   */
  getState() {
    return {
      puzzleId: this.config.id,
      puzzleType: this.config.puzzleType,
      puzzleName: this.config.name,
      puzzleNameArabic: this.config.nameArabic,
      currentPuzzle: this.currentPuzzle,
      puzzlesSolved: this.puzzlesSolved,
      puzzlesRequired: this.puzzlesRequired,
      puzzlesAttempted: this.puzzlesAttempted,
      isActive: this.isActive,
      enemyHP: this.enemyHP,
    };
  }

  /**
   * Get a PuzzleBattleManager for a given puzzle ID.
   * @param {Phaser.Scene} scene
   * @param {string} puzzleId
   * @returns {PuzzleBattleManager|null}
   */
  static forPuzzle(scene, puzzleId) {
    const config = PUZZLE_BATTLES.find((p) => p.id === puzzleId);
    if (!config) return null;
    return new PuzzleBattleManager(scene, config);
  }

  /**
   * Clean up the manager.
   */
  destroy() {
    this.isActive = false;
    this.currentPuzzle = null;
  }
}
