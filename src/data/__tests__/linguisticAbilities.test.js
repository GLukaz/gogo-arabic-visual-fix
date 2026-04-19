import { describe, it, expect } from 'vitest';
import linguisticAbilities, {
  ABILITY_CATEGORIES,
  POWERED_BY_SKILLS,
  TARGET_TYPES,
  UNLOCK_CONDITION_TYPES,
  getAbilitiesByCategory,
  getAbilitiesByPoweredBy,
  getAbilityById,
} from '../linguisticAbilities.js';

describe('linguisticAbilities data integrity', () => {
  it('contains exactly 18 abilities', () => {
    expect(linguisticAbilities).toHaveLength(18);
  });

  it('all abilities have unique IDs', () => {
    const ids = linguisticAbilities.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all abilities have required fields', () => {
    const requiredFields = [
      'id',
      'name',
      'nameArabic',
      'description',
      'descriptionArabic',
      'category',
      'targetType',
      'baseDamage',
      'mpCost',
      'accuracy',
      'critChance',
      'cooldown',
      'poweredBy',
      'scalingFormula',
      'unlockCondition',
      'linguisticTheme',
    ];

    const missing = [];
    for (const ability of linguisticAbilities) {
      for (const field of requiredFields) {
        if (ability[field] === undefined) {
          missing.push(`${ability.id}: missing field '${field}'`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it('all abilities have valid category from ABILITY_CATEGORIES', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (!ABILITY_CATEGORIES.includes(ability.category)) {
        invalid.push(`${ability.id}: invalid category '${ability.category}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have valid targetType from TARGET_TYPES', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (!TARGET_TYPES.includes(ability.targetType)) {
        invalid.push(`${ability.id}: invalid targetType '${ability.targetType}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have valid poweredBy from POWERED_BY_SKILLS', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (!POWERED_BY_SKILLS.includes(ability.poweredBy)) {
        invalid.push(`${ability.id}: invalid poweredBy '${ability.poweredBy}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have valid unlockCondition type', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (!ability.unlockCondition || !UNLOCK_CONDITION_TYPES.includes(ability.unlockCondition.type)) {
        invalid.push(`${ability.id}: invalid unlockCondition type '${ability.unlockCondition?.type}'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have unlockCondition with value and description', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (ability.unlockCondition.value === undefined) {
        invalid.push(`${ability.id}: missing unlockCondition.value`);
      }
      if (!ability.unlockCondition.description) {
        invalid.push(`${ability.id}: missing unlockCondition.description`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have non-empty nameArabic', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (!ability.nameArabic || ability.nameArabic.trim() === '') {
        invalid.push(`${ability.id}: empty nameArabic`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have non-empty descriptionArabic', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (!ability.descriptionArabic || ability.descriptionArabic.trim() === '') {
        invalid.push(`${ability.id}: empty descriptionArabic`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have accuracy between 0 and 1', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (ability.accuracy < 0 || ability.accuracy > 1) {
        invalid.push(`${ability.id}: accuracy ${ability.accuracy} out of range [0,1]`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have critChance between 0 and 1', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (ability.critChance < 0 || ability.critChance > 1) {
        invalid.push(`${ability.id}: critChance ${ability.critChance} out of range [0,1]`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have mpCost >= 0', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (ability.mpCost < 0) {
        invalid.push(`${ability.id}: mpCost is negative (${ability.mpCost})`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have baseDamage >= 0', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (ability.baseDamage < 0) {
        invalid.push(`${ability.id}: baseDamage is negative (${ability.baseDamage})`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have cooldown >= 0', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (ability.cooldown < 0) {
        invalid.push(`${ability.id}: cooldown is negative (${ability.cooldown})`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('all abilities have non-empty linguisticTheme', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      if (!ability.linguisticTheme || ability.linguisticTheme.trim() === '') {
        invalid.push(`${ability.id}: empty linguisticTheme`);
      }
    }
    expect(invalid).toEqual([]);
  });
});

describe('linguisticAbilities category distribution', () => {
  it('has 7 offensive abilities', () => {
    const offensive = linguisticAbilities.filter((a) => a.category === 'offense');
    expect(offensive).toHaveLength(7);
  });

  it('has 4 defensive abilities', () => {
    const defensive = linguisticAbilities.filter((a) => a.category === 'defense');
    expect(defensive).toHaveLength(4);
  });

  it('has 7 utility abilities', () => {
    const utility = linguisticAbilities.filter((a) => a.category === 'utility');
    expect(utility).toHaveLength(7);
  });

  it('all three categories are represented', () => {
    const categories = new Set(linguisticAbilities.map((a) => a.category));
    expect(categories.size).toBe(3);
    expect(categories.has('offense')).toBe(true);
    expect(categories.has('defense')).toBe(true);
    expect(categories.has('utility')).toBe(true);
  });
});

describe('linguisticAbilities balance', () => {
  it('offensive abilities have baseDamage > 0', () => {
    const offensive = linguisticAbilities.filter((a) => a.category === 'offense');
    const invalid = [];
    for (const ability of offensive) {
      if (ability.baseDamage <= 0) {
        invalid.push(`${ability.id}: offensive ability with baseDamage ${ability.baseDamage}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('defensive abilities have baseDamage === 0', () => {
    const defensive = linguisticAbilities.filter((a) => a.category === 'defense');
    const invalid = [];
    for (const ability of defensive) {
      if (ability.baseDamage !== 0) {
        invalid.push(`${ability.id}: defensive ability with baseDamage ${ability.baseDamage}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('utility abilities have baseDamage === 0', () => {
    const utility = linguisticAbilities.filter((a) => a.category === 'utility');
    const invalid = [];
    for (const ability of utility) {
      if (ability.baseDamage !== 0) {
        invalid.push(`${ability.id}: utility ability with baseDamage ${ability.baseDamage}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('defensive abilities target self', () => {
    const defensive = linguisticAbilities.filter((a) => a.category === 'defense');
    const invalid = [];
    for (const ability of defensive) {
      if (ability.targetType !== 'self') {
        invalid.push(`${ability.id}: defensive ability targeting '${ability.targetType}' instead of 'self'`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('offensive abilities have mpCost > 0', () => {
    const offensive = linguisticAbilities.filter((a) => a.category === 'offense');
    const invalid = [];
    for (const ability of offensive) {
      if (ability.mpCost <= 0) {
        invalid.push(`${ability.id}: offensive ability with mpCost ${ability.mpCost}`);
      }
    }
    expect(invalid).toEqual([]);
  });

  it('has exactly one starting ability', () => {
    const starting = linguisticAbilities.filter(
      (a) => a.unlockCondition.type === 'starting_ability'
    );
    expect(starting).toHaveLength(1);
    expect(starting[0].id).toBe('eloquent_response');
  });
});

describe('linguisticAbilities helper functions', () => {
  it('getAbilitiesByCategory returns correct abilities for offense', () => {
    const offensive = getAbilitiesByCategory('offense');
    expect(offensive.length).toBe(7);
    for (const a of offensive) {
      expect(a.category).toBe('offense');
    }
  });

  it('getAbilitiesByCategory returns empty array for unknown category', () => {
    const result = getAbilitiesByCategory('unknown_category');
    expect(result).toEqual([]);
  });

  it('getAbilitiesByPoweredBy returns abilities for vocabulary_mastery', () => {
    const vocabAbilities = getAbilitiesByPoweredBy('vocabulary_mastery');
    expect(vocabAbilities.length).toBeGreaterThan(0);
    for (const a of vocabAbilities) {
      expect(a.poweredBy).toBe('vocabulary_mastery');
    }
  });

  it('getAbilityById returns correct ability', () => {
    const ability = getAbilityById('eloquent_response');
    expect(ability).toBeDefined();
    expect(ability.name).toBe('Eloquent Response');
  });

  it('getAbilityById returns undefined for unknown ID', () => {
    const ability = getAbilityById('nonexistent_ability');
    expect(ability).toBeUndefined();
  });
});

describe('linguisticAbilities no magic/supernatural language', () => {
  const forbiddenTerms = ['magic', 'spell', 'witch', 'wizard', 'sorcerer', 'enchant', 'mystical', 'supernatural', 'arcane', 'conjure', 'curse'];

  it('no ability names contain forbidden supernatural terms', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      const nameLower = ability.name.toLowerCase();
      for (const term of forbiddenTerms) {
        if (nameLower.includes(term)) {
          invalid.push(`${ability.id}: name contains forbidden term '${term}'`);
        }
      }
    }
    expect(invalid).toEqual([]);
  });

  it('no ability descriptions contain forbidden supernatural terms', () => {
    const invalid = [];
    for (const ability of linguisticAbilities) {
      const descLower = ability.description.toLowerCase();
      for (const term of forbiddenTerms) {
        if (descLower.includes(term)) {
          invalid.push(`${ability.id}: description contains forbidden term '${term}'`);
        }
      }
    }
    expect(invalid).toEqual([]);
  });
});
