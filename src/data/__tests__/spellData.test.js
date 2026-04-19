import { describe, it, expect } from 'vitest';
import { SPELLS, getSpellByRoot, getSpellsByElement } from '../spellData.js';
import { ROOT_ELEMENTS, SPELL_TIERS } from '../rootMagic.js';

describe('spellData', () => {
  it('exports exactly 50 spells', () => {
    expect(SPELLS).toHaveLength(50);
  });

  it('every spell has required fields: id, rootId, element, form, name, nameArabic, baseDamage, mpCost', () => {
    SPELLS.forEach((spell) => {
      expect(spell).toHaveProperty('id');
      expect(spell).toHaveProperty('rootId');
      expect(spell).toHaveProperty('element');
      expect(spell).toHaveProperty('form');
      expect(spell).toHaveProperty('name');
      expect(spell).toHaveProperty('nameArabic');
      expect(spell).toHaveProperty('baseDamage');
      expect(spell).toHaveProperty('mpCost');
    });
  });

  it('every spell rootId exists in ROOT_ELEMENTS', () => {
    SPELLS.forEach((spell) => {
      expect(ROOT_ELEMENTS).toHaveProperty(spell.rootId);
    });
  });

  it('every spell element matches ROOT_ELEMENTS[rootId]', () => {
    SPELLS.forEach((spell) => {
      expect(ROOT_ELEMENTS[spell.rootId]).toBe(spell.element);
    });
  });

  it('has exactly 5 spells per element (10 elements)', () => {
    const elements = [
      'fire',
      'water',
      'earth',
      'wind',
      'light',
      'shadow',
      'time',
      'knowledge',
      'creation',
      'protection',
    ];

    elements.forEach((element) => {
      const spellsForElement = SPELLS.filter((s) => s.element === element);
      expect(spellsForElement).toHaveLength(5);
    });
  });

  it('all spell IDs are unique', () => {
    const ids = SPELLS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(SPELLS.length);
  });

  it('getSpellByRoot returns correct spell for known root', () => {
    const spell = getSpellByRoot('ك-ت-ب', 'I');

    expect(spell).not.toBeNull();
    expect(spell.rootId).toBe('ك-ت-ب');
    expect(spell.form).toBe('I');
    expect(spell.element).toBe('knowledge');
  });

  it('getSpellByRoot returns null for unknown root', () => {
    const spell = getSpellByRoot('ز-ز-ز', 'I');
    expect(spell).toBeNull();
  });

  it('getSpellsByElement returns 5 spells for each element', () => {
    const fireSpells = getSpellsByElement('fire');
    expect(fireSpells).toHaveLength(5);
    expect(fireSpells.every((s) => s.element === 'fire')).toBe(true);

    const waterSpells = getSpellsByElement('water');
    expect(waterSpells).toHaveLength(5);
    expect(waterSpells.every((s) => s.element === 'water')).toBe(true);
  });

  it('mpCost matches SPELL_TIERS for the spell form', () => {
    SPELLS.forEach((spell) => {
      const expectedCost = SPELL_TIERS[spell.form]?.mpCost;
      expect(spell.mpCost).toBe(expectedCost);
    });
  });
});
