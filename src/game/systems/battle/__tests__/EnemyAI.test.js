/**
 * EnemyAI.test.js
 * GROW-021 — Battle AI behavior patterns expansion
 * Tests for: berserker, turtle, trickster, scholar, healer
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { EnemyAI } from '../EnemyAI.js';

const makeEnemy = (pattern, opts = {}) => ({
  nameArabic: 'عدو',
  aiPattern: pattern,
  baseDamage: 10,
  element: 'fire',
  ...opts,
});

const battleState = (bossHP = 100, maxBossHP = 100) => ({ bossHP, maxBossHP });

// ── Berserker ────────────────────────────────────────────────────────────────

describe('EnemyAI — berserker pattern', () => {
  let ai;
  beforeEach(() => {
    ai = new EnemyAI(makeEnemy('berserker'));
  });

  it('always returns type attack', () => {
    for (let i = 0; i < 20; i++) {
      expect(ai.decide(battleState()).type).toBe('attack');
    }
  });

  it('deals +20% damage (baseDamage * 1.2)', () => {
    const action = ai.decide(battleState());
    expect(action.damage).toBe(12); // floor(10 * 1.2)
  });

  it('sets defenseMultiplier to 0.8', () => {
    const action = ai.decide(battleState());
    expect(action.defenseMultiplier).toBe(0.8);
  });
});

// ── Turtle ───────────────────────────────────────────────────────────────────

describe('EnemyAI — turtle pattern', () => {
  let ai;
  beforeEach(() => {
    ai = new EnemyAI(makeEnemy('turtle'));
  });

  it('counterattacks immediately after a block', () => {
    // Force a defend by setting _turtleLastBlocked directly
    ai._turtleLastBlocked = true;
    const action = ai.decide(battleState());
    expect(action.type).toBe('counter_attack');
  });

  it('counter_attack deals 130% damage', () => {
    ai._turtleLastBlocked = true;
    const action = ai.decide(battleState());
    expect(action.damage).toBe(13); // floor(10 * 1.3)
  });

  it('resets _turtleLastBlocked to false after counterattack', () => {
    ai._turtleLastBlocked = true;
    ai.decide(battleState());
    expect(ai._turtleLastBlocked).toBe(false);
  });

  it('sets _turtleLastBlocked to true after a defend action', () => {
    // Stub Math.random to force defend path (< 0.6)
    const origRandom = Math.random;
    Math.random = () => 0.1;
    ai.decide(battleState());
    Math.random = origRandom;
    expect(ai._turtleLastBlocked).toBe(true);
  });

  it('returns attack or defend when not in counter state', () => {
    const validTypes = ['attack', 'defend', 'counter_attack'];
    for (let i = 0; i < 20; i++) {
      expect(validTypes).toContain(ai.decide(battleState()).type);
    }
  });
});

// ── Trickster ─────────────────────────────────────────────────────────────────

describe('EnemyAI — trickster pattern', () => {
  let ai;
  beforeEach(() => {
    ai = new EnemyAI(makeEnemy('trickster'));
  });

  it('applies status effect on every 3rd turn', () => {
    ai.decide(battleState()); // turn 1
    ai.decide(battleState()); // turn 2
    const turn3 = ai.decide(battleState()); // turn 3
    expect(turn3.type).toBe('status_attack');
    expect(turn3.statusEffect).toBeTruthy();
  });

  it('attacks on non-3rd turns', () => {
    const turn1 = ai.decide(battleState());
    expect(turn1.type).toBe('attack');
    const turn2 = ai.decide(battleState());
    expect(turn2.type).toBe('attack');
  });

  it('status_attack damage is 50% of baseDamage', () => {
    ai._tricksterTurnCount = 2; // next call is turn 3
    const action = ai.decide(battleState());
    expect(action.damage).toBe(5); // floor(10 * 0.5)
  });

  it('statusEffect is one of the known debuffs', () => {
    const VALID = ['poison', 'burn', 'slow', 'confuse', 'silence', 'freeze'];
    ai._tricksterTurnCount = 2;
    const action = ai.decide(battleState());
    expect(VALID).toContain(action.statusEffect);
  });

  it('increments turn counter on each decide call', () => {
    expect(ai._tricksterTurnCount).toBe(0);
    ai.decide(battleState());
    expect(ai._tricksterTurnCount).toBe(1);
    ai.decide(battleState());
    expect(ai._tricksterTurnCount).toBe(2);
  });
});

// ── Scholar ───────────────────────────────────────────────────────────────────

describe('EnemyAI — scholar pattern', () => {
  const fsrs = {
    word_greet_1: { card: { stability: 1 } }, // weak — greetings
    word_greet_2: { card: { stability: 2 } }, // weak — greetings
    word_num_1:   { card: { stability: 8 } }, // strong — numbers
    word_num_2:   { card: { stability: 9 } }, // strong — numbers
  };
  const vocabLookup = {
    word_greet_1: { category: 'greetings' },
    word_greet_2: { category: 'greetings' },
    word_num_1:   { category: 'numbers' },
    word_num_2:   { category: 'numbers' },
  };

  it('returns quiz_attack when vocabLookup is provided', () => {
    const ai = new EnemyAI(makeEnemy('scholar'), fsrs, vocabLookup);
    const action = ai.decide(battleState());
    expect(action.type).toBe('quiz_attack');
  });

  it('targets a word from the weakest category (greetings)', () => {
    const ai = new EnemyAI(makeEnemy('scholar'), fsrs, vocabLookup);
    const action = ai.decide(battleState());
    expect(action.targetCategory).toBe('greetings');
    expect(['word_greet_1', 'word_greet_2']).toContain(action.targetWord);
  });

  it('falls back to adaptive pattern when no vocabLookup', () => {
    const ai = new EnemyAI(makeEnemy('scholar'), fsrs);
    // adaptive with weak words should return quiz_attack; without them, balanced
    const action = ai.decide(battleState());
    // Just assert it returns a valid action type
    expect(action.type).toBeTruthy();
    expect(action.enemyIndex).toBe(0);
  });

  it('falls back gracefully when fsrs is empty', () => {
    const ai = new EnemyAI(makeEnemy('scholar'), {}, vocabLookup);
    const action = ai.decide(battleState());
    expect(action.type).toBeTruthy();
  });
});

// ── Healer ────────────────────────────────────────────────────────────────────

describe('EnemyAI — healer pattern', () => {
  let ai;
  beforeEach(() => {
    ai = new EnemyAI(makeEnemy('healer'));
  });

  it('heals when HP is below 40%', () => {
    const action = ai.decide(battleState(30, 100));
    expect(action.type).toBe('heal');
  });

  it('attacks when HP is at or above 40%', () => {
    const action = ai.decide(battleState(40, 100));
    expect(action.type).toBe('attack');
  });

  it('attacks when HP is above 40%', () => {
    const action = ai.decide(battleState(80, 100));
    expect(action.type).toBe('attack');
  });

  it('heal amount is 50% of baseDamage', () => {
    const action = ai.decide(battleState(10, 100));
    expect(action.healAmount).toBe(5); // floor(10 * 0.5)
  });
});
