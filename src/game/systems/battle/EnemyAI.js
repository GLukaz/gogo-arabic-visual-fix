/**
 * EnemyAI.js — Pattern-based enemy AI for turn-based combat.
 *
 * 10 AI patterns: aggressive, defensive, balanced, adaptive, boss,
 *                 berserker, turtle, trickster, scholar, healer.
 * Adaptive/Scholar AI use FSRS data to target the player's weakest vocabulary.
 * Boss AI changes behavior at HP thresholds (enrage phases).
 */

const TRICKSTER_DEBUFFS = ['poison', 'burn', 'slow', 'confuse', 'silence', 'freeze'];

export class EnemyAI {
  /**
   * @param {Object} enemyData - Enemy config from enemies.js
   * @param {Object} playerFSRS - Player's FSRS vocabulary data (wordId -> card)
   * @param {Object} [vocabLookup] - Optional Map/object of wordId → { category } for Scholar pattern
   */
  constructor(enemyData, playerFSRS, vocabLookup) {
    this.enemy = enemyData;
    this.fsrs = playerFSRS || {};
    this.pattern = enemyData.aiPattern || 'balanced';
    this._vocabLookup = vocabLookup || null;
    // Turtle: tracks whether last action was a block (to trigger counterattack)
    this._turtleLastBlocked = false;
    // Trickster: turn counter for status effect timing
    this._tricksterTurnCount = 0;
  }

  /**
   * Decide enemy action based on AI pattern and battle state.
   * @param {Object} battleState - Current battle state from Redux
   * @returns {{ type: string, damage: number, enemyIndex: number, intentText: string, element?: string, healAmount?: number, targetWord?: string, statusEffect?: string, defenseMultiplier?: number }}
   */
  decide(battleState) {
    const patterns = {
      aggressive: this._aggressivePattern,
      defensive: this._defensivePattern,
      balanced: this._balancedPattern,
      adaptive: this._adaptivePattern,
      boss: this._bossPattern,
      berserker: this._berserkerPattern,
      turtle: this._turtlePattern,
      trickster: this._tricksterPattern,
      scholar: this._scholarPattern,
      healer: this._healerPattern,
    };

    const patternFn = patterns[this.pattern] || patterns.balanced;
    return patternFn.call(this, battleState);
  }

  _aggressivePattern(_state) {
    // 80% attack, 15% special, 5% defend
    const roll = Math.random();
    if (roll < 0.8) return this._basicAttack();
    if (roll < 0.95) return this._specialAttack();
    return this._defend();
  }

  _defensivePattern(state) {
    // Heal when low, defend often
    if (state.bossHP < state.maxBossHP * 0.3) return this._heal();
    const roll = Math.random();
    if (roll < 0.4) return this._defend();
    if (roll < 0.8) return this._basicAttack();
    return this._specialAttack();
  }

  _balancedPattern(_state) {
    const roll = Math.random();
    if (roll < 0.5) return this._basicAttack();
    if (roll < 0.75) return this._specialAttack();
    if (roll < 0.9) return this._defend();
    return this._heal();
  }

  /**
   * Adaptive AI: targets the player's weakest vocabulary.
   * Uses FSRS data to select words the player struggles with.
   */
  _adaptivePattern(state) {
    const weakWords = Object.entries(this.fsrs)
      .filter(([, card]) => card.card?.stability < 5)
      .sort((a, b) => (a[1].card?.stability || 0) - (b[1].card?.stability || 0))
      .slice(0, 5);

    if (weakWords.length > 0 && Math.random() < 0.6) {
      return {
        type: 'quiz_attack',
        damage: this.enemy.baseDamage,
        enemyIndex: 0,
        targetWord: weakWords[Math.floor(Math.random() * weakWords.length)][0],
        intentText: `${this.enemy.nameArabic} targets your weak point!`,
      };
    }

    return this._balancedPattern(state);
  }

  /**
   * Boss AI: phase-based behavior changes at HP thresholds.
   * >70% HP: balanced, 30-70%: aggressive (enrage), <30%: desperate (specials + heals)
   */
  _bossPattern(state) {
    const hpRatio = state.bossHP / state.maxBossHP;

    if (hpRatio > 0.7) {
      return this._balancedPattern(state);
    } else if (hpRatio > 0.3) {
      return this._aggressivePattern(state);
    } else {
      if (Math.random() < 0.4) return this._heal();
      return this._specialAttack();
    }
  }

  /**
   * Berserker: always attacks with +20% damage; defense reduced by 20%.
   * The defenseMultiplier field signals the battle system to apply the penalty.
   */
  _berserkerPattern(_state) {
    return {
      type: 'attack',
      damage: Math.floor(this.enemy.baseDamage * 1.2),
      enemyIndex: 0,
      defenseMultiplier: 0.8,
      intentText: `${this.enemy.nameArabic} rages with unbridled fury!`,
    };
  }

  /**
   * Turtle: blocks 60% of turns; counterattacks immediately after a block.
   * Uses instance state (_turtleLastBlocked) to track previous action.
   */
  _turtlePattern(_state) {
    if (this._turtleLastBlocked) {
      this._turtleLastBlocked = false;
      return {
        type: 'counter_attack',
        damage: Math.floor(this.enemy.baseDamage * 1.3),
        enemyIndex: 0,
        intentText: `${this.enemy.nameArabic} counters from behind the shield!`,
      };
    }
    if (Math.random() < 0.6) {
      this._turtleLastBlocked = true;
      return {
        type: 'defend',
        damage: 0,
        enemyIndex: 0,
        intentText: `${this.enemy.nameArabic} raises its shield!`,
      };
    }
    this._turtleLastBlocked = false;
    return this._basicAttack();
  }

  /**
   * Trickster: applies a random status debuff every 3 turns; otherwise attacks.
   * Uses instance state (_tricksterTurnCount) to track turn rhythm.
   */
  _tricksterPattern(_state) {
    this._tricksterTurnCount += 1;
    if (this._tricksterTurnCount % 3 === 0) {
      const effect = TRICKSTER_DEBUFFS[Math.floor(Math.random() * TRICKSTER_DEBUFFS.length)];
      return {
        type: 'status_attack',
        damage: Math.floor(this.enemy.baseDamage * 0.5),
        statusEffect: effect,
        enemyIndex: 0,
        intentText: `${this.enemy.nameArabic} weaves a cunning trick!`,
      };
    }
    return this._basicAttack();
  }

  /**
   * Scholar: targets the player's weakest vocabulary category.
   * Uses FSRS stability data + optional vocabLookup to find the weakest category.
   * Falls back to adaptive pattern if no vocabulary data is available.
   */
  _scholarPattern(state) {
    if (this._vocabLookup) {
      // Group FSRS cards by category, compute average stability per category
      const categoryStability = {};
      const categoryCounts = {};
      for (const [wordId, cardData] of Object.entries(this.fsrs)) {
        const vocab = this._vocabLookup[wordId];
        if (!vocab) continue;
        const cat = vocab.category || 'general';
        const stability = cardData.card?.stability ?? 0;
        categoryStability[cat] = (categoryStability[cat] || 0) + stability;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
      const categories = Object.keys(categoryCounts);
      if (categories.length > 0) {
        // Find weakest (lowest avg stability) category
        const weakestCat = categories.reduce((weakest, cat) => {
          const avgA = categoryStability[weakest] / categoryCounts[weakest];
          const avgB = categoryStability[cat] / categoryCounts[cat];
          return avgB < avgA ? cat : weakest;
        });
        // Pick a word from that category
        const catWords = Object.entries(this.fsrs).filter(([wordId]) => {
          const v = this._vocabLookup[wordId];
          return v && (v.category || 'general') === weakestCat;
        });
        if (catWords.length > 0) {
          const [targetWord] = catWords[Math.floor(Math.random() * catWords.length)];
          return {
            type: 'quiz_attack',
            damage: this.enemy.baseDamage,
            enemyIndex: 0,
            targetWord,
            targetCategory: weakestCat,
            intentText: `${this.enemy.nameArabic} exploits your weakness in ${weakestCat}!`,
          };
        }
      }
    }
    // Fallback: adaptive pattern
    return this._adaptivePattern(state);
  }

  /**
   * Healer: self-heals when below 40% HP; otherwise performs a basic attack.
   */
  _healerPattern(state) {
    if (state.bossHP < state.maxBossHP * 0.4) {
      return this._heal();
    }
    return this._basicAttack();
  }

  _basicAttack() {
    return {
      type: 'attack',
      damage: this.enemy.baseDamage,
      enemyIndex: 0,
      intentText: `${this.enemy.nameArabic} attacks!`,
    };
  }

  _specialAttack() {
    return {
      type: 'special',
      damage: Math.floor(this.enemy.baseDamage * 1.5),
      element: this.enemy.element,
      enemyIndex: 0,
      intentText: `${this.enemy.nameArabic} uses a special attack!`,
    };
  }

  _defend() {
    return {
      type: 'defend',
      damage: 0,
      enemyIndex: 0,
      intentText: `${this.enemy.nameArabic} takes a defensive stance.`,
    };
  }

  _heal() {
    return {
      type: 'heal',
      damage: 0,
      healAmount: Math.floor(this.enemy.baseDamage * 0.5),
      enemyIndex: 0,
      intentText: `${this.enemy.nameArabic} recovers!`,
    };
  }
}
