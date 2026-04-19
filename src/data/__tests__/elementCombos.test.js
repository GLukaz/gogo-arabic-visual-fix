import { describe, it, expect } from 'vitest';
import { ELEMENT_COMBOS, checkCombo, getCombosByElement } from '../elementCombos.js';
import { ELEMENT_INFO } from '../rootMagic.js';

describe('elementCombos', () => {
  it('exports exactly 20 combos', () => {
    expect(ELEMENT_COMBOS).toHaveLength(20);
  });

  it('every combo has required fields: id, elements, name, nameArabic, damageMultiplier, rootRequirement', () => {
    ELEMENT_COMBOS.forEach((combo) => {
      expect(combo).toHaveProperty('id');
      expect(combo).toHaveProperty('elements');
      expect(combo).toHaveProperty('name');
      expect(combo).toHaveProperty('nameArabic');
      expect(combo).toHaveProperty('damageMultiplier');
      expect(combo).toHaveProperty('rootRequirement');
    });
  });

  it('every combo elements array has exactly 2 elements', () => {
    ELEMENT_COMBOS.forEach((combo) => {
      expect(combo.elements).toHaveLength(2);
    });
  });

  it('every combo element exists in ELEMENT_INFO', () => {
    ELEMENT_COMBOS.forEach((combo) => {
      combo.elements.forEach((element) => {
        expect(ELEMENT_INFO).toHaveProperty(element);
      });
    });
  });

  it('all combo IDs are unique', () => {
    const ids = ELEMENT_COMBOS.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ELEMENT_COMBOS.length);
  });

  it('checkCombo returns combo for valid element pair with sufficient levels', () => {
    const spell1 = { element: 'fire', rootId: 'ح-ر-ق' };
    const spell2 = { element: 'fire', rootId: 'غ-ض-ب' };
    const rootMastery = {
      'ح-ر-ق': { level: 3 },
      'غ-ض-ب': { level: 3 },
    };

    const combo = checkCombo(spell1, spell2, rootMastery);

    expect(combo).not.toBeNull();
    expect(combo.id).toBe('combo_inferno');
    expect(combo.elements).toEqual(['fire', 'fire']);
  });

  it('checkCombo returns null for insufficient root levels', () => {
    const spell1 = { element: 'fire', rootId: 'ح-ر-ق' };
    const spell2 = { element: 'fire', rootId: 'غ-ض-ب' };
    const rootMastery = {
      'ح-ر-ق': { level: 1 },
      'غ-ض-ب': { level: 1 },
    };

    const combo = checkCombo(spell1, spell2, rootMastery);

    expect(combo).toBeNull();
  });

  it('checkCombo returns null for element pair with no combo', () => {
    const spell1 = { element: 'fire', rootId: 'ح-ر-ق' };
    const spell2 = { element: 'knowledge', rootId: 'ك-ت-ب' };
    const rootMastery = {
      'ح-ر-ق': { level: 3 },
      'ك-ت-ب': { level: 3 },
    };

    const combo = checkCombo(spell1, spell2, rootMastery);

    expect(combo).toBeNull();
  });

  it('getCombosByElement returns combos involving the specified element', () => {
    const fireCombos = getCombosByElement('fire');

    expect(fireCombos.length).toBeGreaterThan(0);
    fireCombos.forEach((combo) => {
      expect(combo.elements).toContain('fire');
    });
  });
});
