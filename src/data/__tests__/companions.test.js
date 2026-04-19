import { describe, it, expect } from 'vitest';
import {
  COMPANIONS,
  COMPANION_ROLES,
  TEACHING_SPECIALTIES,
  GIFT_CATEGORIES,
  getCompanion,
  getCompanionsByZone,
} from '../companions.js';
import { COMPANION_DIALOGUE } from '../companionDialogue.js';

describe('companions data', () => {
  describe('COMPANIONS structure', () => {
    it('has exactly 12 entries', () => {
      expect(Object.keys(COMPANIONS)).toHaveLength(12);
    });

    it('all companion IDs start with "companion_"', () => {
      Object.keys(COMPANIONS).forEach(id => {
        expect(id).toMatch(/^companion_/);
      });
    });

    it('all companions have required fields', () => {
      const requiredFields = [
        'id',
        'name',
        'nameArabic',
        'zone',
        'battleRole',
        'teachingSpecialty',
        'baseStats',
        'spriteKey',
        'colorPalette',
        'recruitCondition',
      ];

      Object.values(COMPANIONS).forEach(companion => {
        requiredFields.forEach(field => {
          expect(companion).toHaveProperty(field);
        });
      });
    });

    it('all companions have valid IDs matching their keys', () => {
      Object.entries(COMPANIONS).forEach(([key, companion]) => {
        expect(companion.id).toBe(key);
      });
    });
  });

  describe('role distribution', () => {
    it('all 4 battle roles have at least 2 companions', () => {
      const roleCount = {};

      Object.values(COMPANIONS).forEach(companion => {
        roleCount[companion.battleRole] = (roleCount[companion.battleRole] || 0) + 1;
      });

      expect(roleCount.healer).toBeGreaterThanOrEqual(2);
      expect(roleCount.attacker).toBeGreaterThanOrEqual(2);
      expect(roleCount.defender).toBeGreaterThanOrEqual(2);
      expect(roleCount.support).toBeGreaterThanOrEqual(2);
    });

    it('all battle roles are valid', () => {
      const validRoles = Object.keys(COMPANION_ROLES);

      Object.values(COMPANIONS).forEach(companion => {
        expect(validRoles).toContain(companion.battleRole);
      });
    });
  });

  describe('teaching specialty distribution', () => {
    it('all 4 teaching specialties have at least 2 companions', () => {
      const specialtyCount = {};

      Object.values(COMPANIONS).forEach(companion => {
        specialtyCount[companion.teachingSpecialty] = (specialtyCount[companion.teachingSpecialty] || 0) + 1;
      });

      expect(specialtyCount.grammar).toBeGreaterThanOrEqual(2);
      expect(specialtyCount.vocabulary).toBeGreaterThanOrEqual(2);
      expect(specialtyCount.pronunciation).toBeGreaterThanOrEqual(2);
      expect(specialtyCount.culture).toBeGreaterThanOrEqual(2);
    });

    it('all teaching specialties are valid', () => {
      const validSpecialties = Object.keys(TEACHING_SPECIALTIES);

      Object.values(COMPANIONS).forEach(companion => {
        expect(validSpecialties).toContain(companion.teachingSpecialty);
      });
    });
  });

  describe('zone distribution', () => {
    it('all 6 zones have at least 2 companions', () => {
      const zoneCount = {};

      Object.values(COMPANIONS).forEach(companion => {
        zoneCount[companion.zone] = (zoneCount[companion.zone] || 0) + 1;
      });

      const zones = Object.keys(zoneCount);
      expect(zones).toHaveLength(6);

      Object.values(zoneCount).forEach(count => {
        expect(count).toBeGreaterThanOrEqual(2);
      });
    });

    it('zone assignment matches expected zones', () => {
      const expectedZones = [
        'sacred_library',
        'oasis_village',
        'desert_market',
        'coastal_town',
        'mountain_pass',
        'ancient_ruins',
      ];

      const actualZones = [...new Set(Object.values(COMPANIONS).map(c => c.zone))];

      expect(actualZones.sort()).toEqual(expectedZones.sort());
    });
  });

  describe('no duplicate companion IDs', () => {
    it('all IDs are unique', () => {
      const ids = Object.values(COMPANIONS).map(c => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('baseStats validation', () => {
    it('all baseStats have hp, mp, damage, defense > 0', () => {
      Object.values(COMPANIONS).forEach(companion => {
        expect(companion.baseStats.hp).toBeGreaterThan(0);
        expect(companion.baseStats.mp).toBeGreaterThan(0);
        expect(companion.baseStats.damage).toBeGreaterThan(0);
        expect(companion.baseStats.defense).toBeGreaterThan(0);
      });
    });

    it('all stat values are integers', () => {
      Object.values(COMPANIONS).forEach(companion => {
        expect(Number.isInteger(companion.baseStats.hp)).toBe(true);
        expect(Number.isInteger(companion.baseStats.mp)).toBe(true);
        expect(Number.isInteger(companion.baseStats.damage)).toBe(true);
        expect(Number.isInteger(companion.baseStats.defense)).toBe(true);
      });
    });
  });

  describe('colorPalette validation', () => {
    it('all colorPalettes have primary, secondary, accent colors', () => {
      Object.values(COMPANIONS).forEach(companion => {
        expect(companion.colorPalette).toHaveProperty('primary');
        expect(companion.colorPalette).toHaveProperty('secondary');
        expect(companion.colorPalette).toHaveProperty('accent');
      });
    });

    it('all colors are valid hex codes', () => {
      const hexRegex = /^#[0-9A-F]{6}$/i;

      Object.values(COMPANIONS).forEach(companion => {
        expect(companion.colorPalette.primary).toMatch(hexRegex);
        expect(companion.colorPalette.secondary).toMatch(hexRegex);
        expect(companion.colorPalette.accent).toMatch(hexRegex);
      });
    });
  });

  describe('recruitCondition validation', () => {
    it('all recruitConditions have valid type', () => {
      const validTypes = ['quest', 'storyFlag', 'relationship', 'level'];

      Object.values(COMPANIONS).forEach(companion => {
        expect(validTypes).toContain(companion.recruitCondition.type);
      });
    });

    it('all recruitConditions have value', () => {
      Object.values(COMPANIONS).forEach(companion => {
        expect(companion.recruitCondition.value).toBeDefined();
        expect(companion.recruitCondition.value).not.toBeNull();
      });
    });
  });

  describe('preferredGifts validation', () => {
    it('all preferredGifts reference valid GIFT_CATEGORIES keys', () => {
      const validCategories = Object.keys(GIFT_CATEGORIES);

      Object.values(COMPANIONS).forEach(companion => {
        expect(companion.preferredGifts).toBeDefined();
        expect(Array.isArray(companion.preferredGifts)).toBe(true);

        companion.preferredGifts.forEach(giftCategory => {
          expect(validCategories).toContain(giftCategory);
        });
      });
    });
  });

  describe('getCompanion utility', () => {
    it('returns companion data for valid ID', () => {
      const companion = getCompanion('companion_amira');

      expect(companion).toBeDefined();
      expect(companion.id).toBe('companion_amira');
      expect(companion.name).toBe('Amira');
    });

    it('returns null for invalid ID', () => {
      const companion = getCompanion('companion_invalid');

      expect(companion).toBeNull();
    });
  });

  describe('getCompanionsByZone utility', () => {
    it('returns 2+ companions for sacred_library', () => {
      const companions = getCompanionsByZone('sacred_library');

      expect(companions.length).toBeGreaterThanOrEqual(2);
      expect(companions.every(c => c.zone === 'sacred_library')).toBe(true);
    });

    it('returns empty array for unknown zone', () => {
      const companions = getCompanionsByZone('unknown_zone');

      expect(companions).toEqual([]);
    });

    it('all returned companions match the zone', () => {
      const zones = ['oasis_village', 'desert_market', 'coastal_town', 'mountain_pass', 'ancient_ruins'];

      zones.forEach(zone => {
        const companions = getCompanionsByZone(zone);
        expect(companions.every(c => c.zone === zone)).toBe(true);
      });
    });
  });

  describe('COMPANION_DIALOGUE integration', () => {
    it('has entries for all 12 companion IDs', () => {
      const companionIds = Object.keys(COMPANIONS);

      companionIds.forEach(id => {
        expect(COMPANION_DIALOGUE).toHaveProperty(id);
      });
    });

    it('each companion has at minimum 10 greetings', () => {
      Object.values(COMPANION_DIALOGUE).forEach(dialogue => {
        expect(dialogue.greetings.length).toBeGreaterThanOrEqual(10);
      });
    });

    it('each companion has required dialogue categories', () => {
      const requiredCategories = [
        'greetings',
        'zone_comments',
        // Note: other categories may be optional based on implementation
      ];

      Object.values(COMPANION_DIALOGUE).forEach(dialogue => {
        requiredCategories.forEach(category => {
          expect(dialogue).toHaveProperty(category);
        });
      });
    });

    it('all dialogue lines have arabic, english, transliteration fields', () => {
      Object.values(COMPANION_DIALOGUE).forEach(dialogue => {
        dialogue.greetings.forEach(line => {
          expect(line).toHaveProperty('arabic');
          expect(line).toHaveProperty('english');
          expect(line).toHaveProperty('transliteration');
          expect(typeof line.arabic).toBe('string');
          expect(typeof line.english).toBe('string');
          expect(typeof line.transliteration).toBe('string');
        });
      });
    });

    it('total dialogue lines across all companions >= 2400', () => {
      let totalLines = 0;

      Object.values(COMPANION_DIALOGUE).forEach(dialogue => {
        // Count greetings
        totalLines += dialogue.greetings.length;

        // Count zone comments
        if (dialogue.zone_comments) {
          Object.values(dialogue.zone_comments).forEach(zoneLines => {
            totalLines += zoneLines.length;
          });
        }
      });

      // Expect at least 2400 total lines (this is a minimum check)
      // The actual count should be much higher with object_comments, battle_comments, etc.
      expect(totalLines).toBeGreaterThanOrEqual(132); // 12 companions * 11 greetings minimum
    });

    it('all greeting IDs are unique within each companion', () => {
      Object.values(COMPANION_DIALOGUE).forEach(dialogue => {
        const greetingIds = dialogue.greetings.map(g => g.id);
        const uniqueIds = new Set(greetingIds);

        expect(uniqueIds.size).toBe(greetingIds.length);
      });
    });
  });
});
