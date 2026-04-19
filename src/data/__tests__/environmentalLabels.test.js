import { describe, it, expect } from 'vitest';
import { ENVIRONMENTAL_LABELS, getLabelsForZone } from '../environmentalLabels.js';

describe('environmentalLabels', () => {
  it('has at least 30 entries', () => {
    expect(ENVIRONMENTAL_LABELS.length).toBeGreaterThanOrEqual(30);
  });

  it('every label has required fields', () => {
    for (const label of ENVIRONMENTAL_LABELS) {
      expect(label).toHaveProperty('interactableId');
      expect(label).toHaveProperty('zone');
      expect(label).toHaveProperty('arabic');
      expect(label).toHaveProperty('english');
      expect(label).toHaveProperty('transliteration');
      expect(label).toHaveProperty('vocabWordId');
      expect(label).toHaveProperty('type');
    }
  });

  it('spans at least 4 unique zones', () => {
    const zones = new Set(ENVIRONMENTAL_LABELS.map((l) => l.zone));
    expect(zones.size).toBeGreaterThanOrEqual(4);
  });

  it('getLabelsForZone returns correct count for oasis_village', () => {
    const oasisLabels = getLabelsForZone('oasis_village');
    expect(oasisLabels.length).toBe(8);
  });

  it('has no duplicate interactableId values', () => {
    const ids = ENVIRONMENTAL_LABELS.map((l) => l.interactableId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getLabelsForZone returns empty for unknown zone', () => {
    expect(getLabelsForZone('nonexistent_zone')).toEqual([]);
  });
});
