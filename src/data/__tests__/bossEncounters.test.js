import { describe, it, expect } from 'vitest';
import bossEncounters, {
  BOSS_MECHANIC_TYPES,
  ATTACK_PATTERN_TYPES,
  getBossByZone,
  getBossById,
  getBossesByDifficulty,
} from '../bossEncounters.js';
import { OPPONENT_ZONES } from '../battleOpponents.js';

describe('bossEncounters data integrity', () => {
  it('contains exactly 8 boss encounters', () => {
    expect(bossEncounters).toHaveLength(8);
  });

  it('all bosses have unique IDs', () => {
    const ids = bossEncounters.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all bosses have required fields', () => {
    const requiredFields = [
      'id',
      'name',
      'nameArabic',
      'zone',
      'level',
      'baseHP',
      'baseDamage',
      'baseDefense',
      'title',
      'titleArabic',
      'lore',
      'loreArabic',
      'specialMechanic',
      'attackPattern',
      'attackFrequency',
      'dialogue',
      'rewards',
      'winCondition',
    ];

    const missing = [];
    for (const boss of bossEncounters) {
      for (const field of requiredFields) {
        if (boss[field] === undefined || boss[field] === null) {
          missing.push(`${boss.id}: missing field '${field}'`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('all bosses have non-empty nameArabic', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (!boss.nameArabic || boss.nameArabic.trim() === '') {
        invalid.push(`${boss.id}: empty nameArabic`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have non-empty titleArabic', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (!boss.titleArabic || boss.titleArabic.trim() === '') {
        invalid.push(`${boss.id}: empty titleArabic`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have non-empty loreArabic', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (!boss.loreArabic || boss.loreArabic.trim() === '') {
        invalid.push(`${boss.id}: empty loreArabic`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have positive baseHP', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (boss.baseHP <= 0) {
        invalid.push(`${boss.id}: baseHP is ${boss.baseHP}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have positive baseDamage', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (boss.baseDamage <= 0) {
        invalid.push(`${boss.id}: baseDamage is ${boss.baseDamage}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have positive baseDefense', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (boss.baseDefense <= 0) {
        invalid.push(`${boss.id}: baseDefense is ${boss.baseDefense}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have level >= 10', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (boss.level < 10) {
        invalid.push(`${boss.id}: level is ${boss.level} (bosses should be level 10+)`);
      }
    }
    expect(invalid).toEqual([]);
  });
});

describe('bossEncounters zone coverage', () => {
  it('exactly 1 boss per zone', () => {
    const zoneCounts = {};
    for (const boss of bossEncounters) {
      zoneCounts[boss.zone] = (zoneCounts[boss.zone] || 0) + 1;
    }

    const invalid = [];
    for (const [zone, count] of Object.entries(zoneCounts)) {
      if (count !== 1) {
        invalid.push(`${zone}: has ${count} bosses (expected 1)`);
      }
    }

    expect(invalid).toEqual([]);
  });

  it('all 8 zones have a boss', () => {
    const bossZones = new Set(bossEncounters.map((b) => b.zone));
    expect(bossZones.size).toBe(8);

    for (const zone of OPPONENT_ZONES) {
      expect(bossZones.has(zone)).toBe(true);
    }
  });

  it('all boss zones are valid zones from OPPONENT_ZONES', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (!OPPONENT_ZONES.includes(boss.zone)) {
        invalid.push(`${boss.id}: invalid zone '${boss.zone}'`);
      }
    }
    expect(invalid).toEqual([]);
  });
});

describe('bossEncounters special mechanics', () => {
  it('all bosses have a valid specialMechanic type', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (!boss.specialMechanic || !BOSS_MECHANIC_TYPES.includes(boss.specialMechanic.type)) {
        invalid.push(`${boss.id}: invalid specialMechanic type '${boss.specialMechanic?.type}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have specialMechanic with description and mechanic fields', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (!boss.specialMechanic.description || boss.specialMechanic.description.trim() === '') {
        invalid.push(`${boss.id}: empty specialMechanic.description`);
      }
      if (!boss.specialMechanic.mechanic || boss.specialMechanic.mechanic.trim() === '') {
        invalid.push(`${boss.id}: empty specialMechanic.mechanic`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all 8 bosses have unique mechanic types', () => {
    const mechanicTypes = bossEncounters.map((b) => b.specialMechanic.type);
    const uniqueMechanics = new Set(mechanicTypes);
    expect(uniqueMechanics.size).toBe(8);
  });
});

describe('bossEncounters dialogue', () => {
  it('all bosses have required dialogue fields', () => {
    const requiredDialogueFields = [
      'intro',
      'introArabic',
      'onPlayerHit',
      'onPlayerHitArabic',
      'onPlayerMiss',
      'onPlayerMissArabic',
      'halfHealth',
      'halfHealthArabic',
      'defeat',
      'defeatArabic',
      'victory',
      'victoryArabic',
    ];

    const missing = [];
    for (const boss of bossEncounters) {
      for (const field of requiredDialogueFields) {
        if (!boss.dialogue[field] || boss.dialogue[field].trim() === '') {
          missing.push(`${boss.id}: missing or empty dialogue.${field}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});

describe('bossEncounters attack patterns', () => {
  it('all bosses have at least 3 attack patterns', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (!Array.isArray(boss.attackPattern) || boss.attackPattern.length < 3) {
        invalid.push(`${boss.id}: has ${boss.attackPattern?.length ?? 0} attack patterns (need >= 3)`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all attack patterns reference valid types', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      for (const pattern of boss.attackPattern) {
        if (!ATTACK_PATTERN_TYPES.includes(pattern)) {
          invalid.push(`${boss.id}: invalid attack pattern '${pattern}'`);
        }
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have positive attackFrequency', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (boss.attackFrequency <= 0) {
        invalid.push(`${boss.id}: attackFrequency is ${boss.attackFrequency}`);
      }
    }
    expect(invalid).toEqual([]);
  });
});

describe('bossEncounters rewards', () => {
  it('all bosses have reward structure with required fields', () => {
    const requiredRewardFields = [
      'xp',
      'dirhams',
      'achievementId',
      'skillReward',
      'vocabularyUnlocked',
      'rareItem',
    ];

    const missing = [];
    for (const boss of bossEncounters) {
      for (const field of requiredRewardFields) {
        if (boss.rewards[field] === undefined || boss.rewards[field] === null) {
          missing.push(`${boss.id}: missing reward field '${field}'`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('all bosses have positive XP rewards', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (boss.rewards.xp <= 0) {
        invalid.push(`${boss.id}: xp reward is ${boss.rewards.xp}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have positive dirham rewards', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (boss.rewards.dirhams <= 0) {
        invalid.push(`${boss.id}: dirham reward is ${boss.rewards.dirhams}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses unlock at least 5 vocabulary words', () => {
    const invalid = [];
    for (const boss of bossEncounters) {
      if (!Array.isArray(boss.rewards.vocabularyUnlocked) || boss.rewards.vocabularyUnlocked.length < 5) {
        invalid.push(`${boss.id}: vocabularyUnlocked has ${boss.rewards.vocabularyUnlocked?.length ?? 0} words (need >= 5)`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all bosses have unique achievementIds', () => {
    const achievementIds = bossEncounters.map((b) => b.rewards.achievementId);
    const uniqueIds = new Set(achievementIds);
    expect(uniqueIds.size).toBe(achievementIds.length);
  });

  it('all bosses have unique rareItems', () => {
    const rareItems = bossEncounters.map((b) => b.rewards.rareItem);
    const uniqueItems = new Set(rareItems);
    expect(uniqueItems.size).toBe(rareItems.length);
  });
});

describe('bossEncounters difficulty scaling', () => {
  it('boss HP scales with level', () => {
    const sorted = getBossesByDifficulty();
    const lowestBoss = sorted[0];
    const highestBoss = sorted[sorted.length - 1];

    expect(highestBoss.baseHP).toBeGreaterThan(lowestBoss.baseHP);
  });

  it('boss XP rewards scale with level', () => {
    const sorted = getBossesByDifficulty();
    const lowestBoss = sorted[0];
    const highestBoss = sorted[sorted.length - 1];

    expect(highestBoss.rewards.xp).toBeGreaterThan(lowestBoss.rewards.xp);
  });

  it('bosses have higher HP than regular opponents in same zone', () => {
    // All bosses should have baseHP >= 140 (higher than regular opponents)
    const invalid = [];
    for (const boss of bossEncounters) {
      if (boss.baseHP < 140) {
        invalid.push(`${boss.id}: baseHP ${boss.baseHP} is too low for a boss`);
      }
    }
    expect(invalid).toEqual([]);
  });
});

describe('bossEncounters helper functions', () => {
  it('getBossByZone returns correct boss for ancient_library', () => {
    const boss = getBossByZone('ancient_library');
    expect(boss).toBeDefined();
    expect(boss.id).toBe('grammar_master_library');
    expect(boss.zone).toBe('ancient_library');
  });

  it('getBossByZone returns undefined for unknown zone', () => {
    const boss = getBossByZone('unknown_zone');
    expect(boss).toBeUndefined();
  });

  it('getBossById returns correct boss', () => {
    const boss = getBossById('grammar_master_library');
    expect(boss).toBeDefined();
    expect(boss.name).toBe('The Grammar Master');
  });

  it('getBossById returns undefined for unknown ID', () => {
    const boss = getBossById('nonexistent_boss');
    expect(boss).toBeUndefined();
  });

  it('getBossesByDifficulty returns bosses sorted by level ascending', () => {
    const sorted = getBossesByDifficulty();
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].level).toBeGreaterThanOrEqual(sorted[i - 1].level);
    }
  });
});
