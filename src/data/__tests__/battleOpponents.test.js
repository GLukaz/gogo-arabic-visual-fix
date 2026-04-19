import { describe, it, expect } from 'vitest';
import battleOpponents, {
  OPPONENT_TYPES,
  PERSONALITY_TYPES,
  WEAKNESS_CATEGORIES,
  OPPONENT_ZONES,
  getOpponentsByZone,
  getOpponentsByType,
  getOpponentById,
} from '../battleOpponents.js';

describe('battleOpponents data integrity', () => {
  it('contains exactly 30 opponents', () => {
    expect(battleOpponents).toHaveLength(30);
  });

  it('all opponents have unique IDs', () => {
    const ids = battleOpponents.map((o) => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all opponents have required fields', () => {
    const requiredFields = [
      'id',
      'name',
      'nameArabic',
      'type',
      'zone',
      'level',
      'baseHP',
      'baseDamage',
      'baseDefense',
      'personality',
      'battleDialogue',
      'weakness',
      'weaknessDescription',
      'xpReward',
      'dirhamReward',
      'vocabularyUnlocked',
    ];

    const missing = [];
    for (const opponent of battleOpponents) {
      for (const field of requiredFields) {
        if (opponent[field] === undefined || opponent[field] === null) {
          missing.push(`${opponent.id}: missing field '${field}'`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('all opponents have valid type from OPPONENT_TYPES', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (!OPPONENT_TYPES.includes(opponent.type)) {
        invalid.push(`${opponent.id}: invalid type '${opponent.type}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have valid personality from PERSONALITY_TYPES', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (!PERSONALITY_TYPES.includes(opponent.personality)) {
        invalid.push(`${opponent.id}: invalid personality '${opponent.personality}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have valid weakness from WEAKNESS_CATEGORIES', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (!WEAKNESS_CATEGORIES.includes(opponent.weakness)) {
        invalid.push(`${opponent.id}: invalid weakness '${opponent.weakness}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have valid zone from OPPONENT_ZONES', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (!OPPONENT_ZONES.includes(opponent.zone)) {
        invalid.push(`${opponent.id}: invalid zone '${opponent.zone}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have non-empty nameArabic', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (!opponent.nameArabic || opponent.nameArabic.trim() === '') {
        invalid.push(`${opponent.id}: empty nameArabic`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have battleDialogue with required keys', () => {
    const requiredDialogueKeys = ['intro', 'onPlayerHit', 'onPlayerMiss', 'onEnemyDefeat'];
    const invalid = [];

    for (const opponent of battleOpponents) {
      for (const key of requiredDialogueKeys) {
        if (!opponent.battleDialogue[key] || opponent.battleDialogue[key].trim() === '') {
          invalid.push(`${opponent.id}: missing or empty battleDialogue.${key}`);
        }
      }
    }

    expect(invalid).toEqual([]);
  });

  it('all opponents have positive baseHP', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (opponent.baseHP <= 0) {
        invalid.push(`${opponent.id}: baseHP is ${opponent.baseHP}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have positive baseDamage', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (opponent.baseDamage <= 0) {
        invalid.push(`${opponent.id}: baseDamage is ${opponent.baseDamage}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have positive baseDefense', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (opponent.baseDefense <= 0) {
        invalid.push(`${opponent.id}: baseDefense is ${opponent.baseDefense}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have positive xpReward', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (opponent.xpReward <= 0) {
        invalid.push(`${opponent.id}: xpReward is ${opponent.xpReward}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have positive dirhamReward', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (opponent.dirhamReward <= 0) {
        invalid.push(`${opponent.id}: dirhamReward is ${opponent.dirhamReward}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have at least 2 vocabulary words unlocked', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (!Array.isArray(opponent.vocabularyUnlocked) || opponent.vocabularyUnlocked.length < 2) {
        invalid.push(`${opponent.id}: vocabularyUnlocked has ${opponent.vocabularyUnlocked?.length ?? 0} words (need >= 2)`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all opponents have level >= 1', () => {
    const invalid = [];
    for (const opponent of battleOpponents) {
      if (opponent.level < 1) {
        invalid.push(`${opponent.id}: level is ${opponent.level}`);
      }
    }
    expect(invalid).toEqual([]);
  });
});

describe('battleOpponents zone distribution', () => {
  it('each zone has 3-4 opponents', () => {
    const invalid = [];
    for (const zone of OPPONENT_ZONES) {
      const zoneOpponents = battleOpponents.filter((o) => o.zone === zone);
      if (zoneOpponents.length < 3 || zoneOpponents.length > 4) {
        invalid.push(`${zone}: has ${zoneOpponents.length} opponents (expected 3-4)`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all 8 zones are represented', () => {
    const representedZones = new Set(battleOpponents.map((o) => o.zone));
    expect(representedZones.size).toBe(8);
    for (const zone of OPPONENT_ZONES) {
      expect(representedZones.has(zone)).toBe(true);
    }
  });
});

describe('battleOpponents XP/reward balance', () => {
  it('higher level opponents give more XP', () => {
    const sorted = [...battleOpponents].sort((a, b) => a.level - b.level);
    const lowLevel = sorted.slice(0, 5);
    const highLevel = sorted.slice(-5);

    const avgLowXP = lowLevel.reduce((sum, o) => sum + o.xpReward, 0) / lowLevel.length;
    const avgHighXP = highLevel.reduce((sum, o) => sum + o.xpReward, 0) / highLevel.length;

    expect(avgHighXP).toBeGreaterThan(avgLowXP);
  });

  it('higher level opponents have more HP', () => {
    const sorted = [...battleOpponents].sort((a, b) => a.level - b.level);
    const lowLevel = sorted.slice(0, 5);
    const highLevel = sorted.slice(-5);

    const avgLowHP = lowLevel.reduce((sum, o) => sum + o.baseHP, 0) / lowLevel.length;
    const avgHighHP = highLevel.reduce((sum, o) => sum + o.baseHP, 0) / highLevel.length;

    expect(avgHighHP).toBeGreaterThan(avgLowHP);
  });
});

describe('battleOpponents helper functions', () => {
  it('getOpponentsByZone returns correct opponents for oasis_village', () => {
    const oasisOpponents = getOpponentsByZone('oasis_village');
    expect(oasisOpponents.length).toBe(3);
    for (const o of oasisOpponents) {
      expect(o.zone).toBe('oasis_village');
    }
  });

  it('getOpponentsByZone returns empty array for unknown zone', () => {
    const result = getOpponentsByZone('unknown_zone');
    expect(result).toEqual([]);
  });

  it('getOpponentsByType returns opponents of the given type', () => {
    const scholars = getOpponentsByType('rival_scholar');
    expect(scholars.length).toBeGreaterThan(0);
    for (const o of scholars) {
      expect(o.type).toBe('rival_scholar');
    }
  });

  it('getOpponentById returns correct opponent', () => {
    const opponent = getOpponentById('merchant_spice');
    expect(opponent).toBeDefined();
    expect(opponent.name).toBe('Abu Salim, Spice Merchant');
  });

  it('getOpponentById returns undefined for unknown ID', () => {
    const opponent = getOpponentById('nonexistent_id');
    expect(opponent).toBeUndefined();
  });
});
