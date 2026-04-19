import { describe, it, expect } from 'vitest';
import {
  conversationScenarios,
  ZONES,
  CEFR_LEVELS,
  ZONE_LABELS,
  getScenariosForZone,
  getScenariosForLevel,
  getScenarioById,
  getDistributionSummary,
} from '../conversationScenarios.js';

describe('conversationScenarios data integrity', () => {
  it('has exactly 40 scenarios', () => {
    expect(conversationScenarios).toHaveLength(40);
  });

  it('has 8 zones defined', () => {
    expect(ZONES).toHaveLength(8);
  });

  it('has 4 CEFR levels defined', () => {
    expect(CEFR_LEVELS).toHaveLength(4);
    expect(CEFR_LEVELS).toEqual(['A1', 'A2', 'B1', 'B2']);
  });

  it('has zone labels for all zones', () => {
    for (const zone of ZONES) {
      expect(ZONE_LABELS[zone]).toBeDefined();
      expect(ZONE_LABELS[zone].english).toBeTruthy();
      expect(ZONE_LABELS[zone].arabic).toBeTruthy();
    }
  });

  it('has exactly 5 scenarios per zone', () => {
    for (const zone of ZONES) {
      const zoneScenarios = getScenariosForZone(zone);
      expect(zoneScenarios.length, `Zone ${zone} should have 5 scenarios`).toBe(5);
    }
  });

  it('has correct CEFR distribution per zone: 2 A1, 1 A2, 1 B1, 1 B2', () => {
    const summary = getDistributionSummary();
    for (const zone of ZONES) {
      expect(summary[zone].A1, `${zone} should have 2 A1`).toBe(2);
      expect(summary[zone].A2, `${zone} should have 1 A2`).toBe(1);
      expect(summary[zone].B1, `${zone} should have 1 B1`).toBe(1);
      expect(summary[zone].B2, `${zone} should have 1 B2`).toBe(1);
    }
  });

  it('all IDs are unique', () => {
    const ids = conversationScenarios.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all scenarios have required top-level fields', () => {
    for (const scenario of conversationScenarios) {
      expect(scenario.id, `Missing id`).toBeTruthy();
      expect(scenario.zone, `${scenario.id}: missing zone`).toBeTruthy();
      expect(scenario.topic, `${scenario.id}: missing topic`).toBeTruthy();
      expect(scenario.cefrLevel, `${scenario.id}: missing cefrLevel`).toBeTruthy();
      expect(CEFR_LEVELS).toContain(scenario.cefrLevel);
      expect(scenario.title, `${scenario.id}: missing title`).toBeTruthy();
      expect(scenario.titleArabic, `${scenario.id}: missing titleArabic`).toBeTruthy();
      expect(scenario.context, `${scenario.id}: missing context`).toBeTruthy();
      expect(scenario.contextArabic, `${scenario.id}: missing contextArabic`).toBeTruthy();
      expect(scenario.npcName, `${scenario.id}: missing npcName`).toBeTruthy();
      expect(scenario.npcPortrait, `${scenario.id}: missing npcPortrait`).toBeTruthy();
      expect(Array.isArray(scenario.exchanges), `${scenario.id}: exchanges should be array`).toBe(true);
      expect(scenario.exchanges.length, `${scenario.id}: should have 3-6 exchanges`).toBeGreaterThanOrEqual(3);
      expect(scenario.exchanges.length, `${scenario.id}: should have 3-6 exchanges`).toBeLessThanOrEqual(6);
      expect(Array.isArray(scenario.vocabularyUsed), `${scenario.id}: vocabularyUsed should be array`).toBe(true);
      expect(scenario.vocabularyUsed.length).toBeGreaterThan(0);
      expect(typeof scenario.xpReward).toBe('number');
      expect(scenario.xpReward).toBeGreaterThan(0);
    }
  });

  it('all exchanges have required fields', () => {
    for (const scenario of conversationScenarios) {
      for (let i = 0; i < scenario.exchanges.length; i++) {
        const exchange = scenario.exchanges[i];
        const label = `${scenario.id} exchange ${i}`;

        // NPC line
        expect(exchange.npcLine, `${label}: missing npcLine`).toBeDefined();
        expect(exchange.npcLine.arabic, `${label}: missing npcLine.arabic`).toBeTruthy();
        expect(exchange.npcLine.english, `${label}: missing npcLine.english`).toBeTruthy();
        expect(exchange.npcLine.transliteration, `${label}: missing npcLine.transliteration`).toBeTruthy();

        // Player response
        expect(exchange.playerResponse, `${label}: missing playerResponse`).toBeDefined();
        expect(exchange.playerResponse.correctArabic, `${label}: missing correctArabic`).toBeTruthy();
        expect(exchange.playerResponse.correctEnglish, `${label}: missing correctEnglish`).toBeTruthy();
        expect(Array.isArray(exchange.playerResponse.wordBank), `${label}: wordBank should be array`).toBe(true);
        expect(exchange.playerResponse.wordBank.length).toBeGreaterThanOrEqual(3);
        expect(exchange.playerResponse.grammarHint, `${label}: missing grammarHint`).toBeTruthy();
      }
    }
  });

  it('word bank contains all correct answer words', () => {
    for (const scenario of conversationScenarios) {
      for (let i = 0; i < scenario.exchanges.length; i++) {
        const exchange = scenario.exchanges[i];
        const label = `${scenario.id} exchange ${i}`;
        const correctWords = exchange.playerResponse.correctArabic
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ');
        const bankWords = exchange.playerResponse.wordBank;

        for (const word of correctWords) {
          expect(
            bankWords.includes(word),
            `${label}: word bank missing correct word "${word}"`
          ).toBe(true);
        }
      }
    }
  });

  it('word bank has distractor words beyond correct words', () => {
    for (const scenario of conversationScenarios) {
      for (let i = 0; i < scenario.exchanges.length; i++) {
        const exchange = scenario.exchanges[i];
        const label = `${scenario.id} exchange ${i}`;
        const correctWords = new Set(
          exchange.playerResponse.correctArabic
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
        );
        const bankWords = exchange.playerResponse.wordBank;
        const distractors = bankWords.filter((w) => !correctWords.has(w));

        expect(
          distractors.length,
          `${label}: should have at least 1 distractor word`
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('all zones are valid zone keys', () => {
    for (const scenario of conversationScenarios) {
      expect(
        ZONES.includes(scenario.zone),
        `${scenario.id}: invalid zone "${scenario.zone}"`
      ).toBe(true);
    }
  });
});

describe('helper functions', () => {
  it('getScenariosForZone returns correct scenarios', () => {
    const oasis = getScenariosForZone('oasis-village');
    expect(oasis).toHaveLength(5);
    oasis.forEach((s) => expect(s.zone).toBe('oasis-village'));
  });

  it('getScenariosForLevel returns correct scenarios', () => {
    const a1 = getScenariosForLevel('A1');
    expect(a1.length).toBe(16); // 2 per zone * 8 zones
    a1.forEach((s) => expect(s.cefrLevel).toBe('A1'));
  });

  it('getScenarioById returns correct scenario', () => {
    const scenario = getScenarioById('oasis_greeting_001');
    expect(scenario).toBeDefined();
    expect(scenario.title).toBe('Greeting a Scholar');
  });

  it('getScenarioById returns null for unknown id', () => {
    expect(getScenarioById('nonexistent')).toBeNull();
  });

  it('getDistributionSummary has data for all zones', () => {
    const summary = getDistributionSummary();
    for (const zone of ZONES) {
      expect(summary[zone]).toBeDefined();
      expect(summary[zone].total).toBe(5);
    }
  });
});
