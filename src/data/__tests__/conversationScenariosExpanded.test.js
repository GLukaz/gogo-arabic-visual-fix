/**
 * conversationScenariosExpanded.test.js
 *
 * Data integrity tests for the 24 expanded conversation scenarios.
 * Validates: 24 scenarios, 3 per zone, required fields, unique IDs,
 * word bank validity, CEFR distribution.
 *
 * Phase 90 (CONV-EXPAND)
 */

import { describe, it, expect } from 'vitest';
import {
  CONVERSATION_SCENARIOS_EXPANDED,
  ZONES,
  CEFR_LEVELS,
  getExpandedScenariosForZone,
  getExpandedScenariosForLevel,
  getExpandedScenarioById,
  getExpandedDistributionSummary,
} from '../conversationScenariosExpanded.js';
import { conversationScenarios } from '../conversationScenarios.js';

describe('Conversation Scenarios Expanded — data integrity', () => {
  it('has exactly 24 scenarios', () => {
    expect(CONVERSATION_SCENARIOS_EXPANDED).toHaveLength(24);
  });

  it('has exactly 3 scenarios per zone', () => {
    for (const zone of ZONES) {
      const zoneScenarios = getExpandedScenariosForZone(zone);
      expect(zoneScenarios.length, `Zone ${zone} should have 3 scenarios`).toBe(3);
    }
  });

  it('has correct CEFR distribution per zone: 1 A2, 1 B1, 1 B2', () => {
    const summary = getExpandedDistributionSummary();
    for (const zone of ZONES) {
      expect(summary[zone].A2, `${zone} should have 1 A2`).toBe(1);
      expect(summary[zone].B1, `${zone} should have 1 B1`).toBe(1);
      expect(summary[zone].B2, `${zone} should have 1 B2`).toBe(1);
    }
  });

  it('all IDs are unique', () => {
    const ids = CONVERSATION_SCENARIOS_EXPANDED.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no IDs overlap with the original conversation scenarios', () => {
    const originalIds = new Set(conversationScenarios.map((s) => s.id));
    for (const scenario of CONVERSATION_SCENARIOS_EXPANDED) {
      expect(originalIds.has(scenario.id), `ID ${scenario.id} duplicates original set`).toBe(false);
    }
  });

  it('all IDs start with exp_ prefix', () => {
    for (const scenario of CONVERSATION_SCENARIOS_EXPANDED) {
      expect(scenario.id.startsWith('exp_'), `ID ${scenario.id} should start with exp_`).toBe(true);
    }
  });

  it('all scenarios have required top-level fields', () => {
    for (const scenario of CONVERSATION_SCENARIOS_EXPANDED) {
      expect(scenario.id, 'Missing id').toBeTruthy();
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
      expect(Array.isArray(scenario.vocabularyUsed), `${scenario.id}: vocabularyUsed should be array`).toBe(true);
      expect(scenario.vocabularyUsed.length).toBeGreaterThan(0);
      expect(typeof scenario.xpReward).toBe('number');
      expect(scenario.xpReward).toBeGreaterThan(0);
    }
  });

  it('all scenarios have 4-6 exchanges', () => {
    for (const scenario of CONVERSATION_SCENARIOS_EXPANDED) {
      expect(
        scenario.exchanges.length,
        `${scenario.id}: should have 4-6 exchanges, has ${scenario.exchanges.length}`
      ).toBeGreaterThanOrEqual(4);
      expect(
        scenario.exchanges.length,
        `${scenario.id}: should have 4-6 exchanges, has ${scenario.exchanges.length}`
      ).toBeLessThanOrEqual(6);
    }
  });

  it('all exchanges have required fields', () => {
    for (const scenario of CONVERSATION_SCENARIOS_EXPANDED) {
      for (let i = 0; i < scenario.exchanges.length; i++) {
        const ex = scenario.exchanges[i];
        const label = `${scenario.id} exchange[${i}]`;

        // NPC line fields
        expect(ex.npcLine, `${label}: missing npcLine`).toBeDefined();
        expect(ex.npcLine.arabic, `${label}: missing npcLine.arabic`).toBeTruthy();
        expect(ex.npcLine.english, `${label}: missing npcLine.english`).toBeTruthy();
        expect(ex.npcLine.transliteration, `${label}: missing npcLine.transliteration`).toBeTruthy();

        // Player response fields
        expect(ex.playerResponse, `${label}: missing playerResponse`).toBeDefined();
        expect(ex.playerResponse.correctArabic, `${label}: missing correctArabic`).toBeTruthy();
        expect(ex.playerResponse.correctEnglish, `${label}: missing correctEnglish`).toBeTruthy();
        expect(Array.isArray(ex.playerResponse.wordBank), `${label}: wordBank should be array`).toBe(true);
        expect(ex.playerResponse.wordBank.length, `${label}: wordBank should have words`).toBeGreaterThan(0);
        expect(ex.playerResponse.grammarHint, `${label}: missing grammarHint`).toBeTruthy();
      }
    }
  });

  it('word banks contain the words needed for correct answers', () => {
    for (const scenario of CONVERSATION_SCENARIOS_EXPANDED) {
      for (let i = 0; i < scenario.exchanges.length; i++) {
        const ex = scenario.exchanges[i];
        const correctWords = ex.playerResponse.correctArabic.split(' ');
        const wordBank = ex.playerResponse.wordBank;

        for (const word of correctWords) {
          const found = wordBank.some((bankWord) => word.includes(bankWord) || bankWord.includes(word));
          expect(
            found,
            `${scenario.id} exchange[${i}]: word "${word}" not found in word bank [${wordBank.join(', ')}]`
          ).toBe(true);
        }
      }
    }
  });

  it('all zones used are valid', () => {
    for (const scenario of CONVERSATION_SCENARIOS_EXPANDED) {
      expect(ZONES, `${scenario.id}: invalid zone ${scenario.zone}`).toContain(scenario.zone);
    }
  });

  it('xpReward scales with CEFR level', () => {
    for (const scenario of CONVERSATION_SCENARIOS_EXPANDED) {
      if (scenario.cefrLevel === 'A2') {
        expect(scenario.xpReward, `${scenario.id}: A2 xp should be >= 50`).toBeGreaterThanOrEqual(50);
      }
      if (scenario.cefrLevel === 'B1') {
        expect(scenario.xpReward, `${scenario.id}: B1 xp should be >= 75`).toBeGreaterThanOrEqual(75);
      }
      if (scenario.cefrLevel === 'B2') {
        expect(scenario.xpReward, `${scenario.id}: B2 xp should be >= 100`).toBeGreaterThanOrEqual(100);
      }
    }
  });
});

describe('Conversation Scenarios Expanded — helper functions', () => {
  it('getExpandedScenariosForZone returns correct count', () => {
    for (const zone of ZONES) {
      expect(getExpandedScenariosForZone(zone)).toHaveLength(3);
    }
  });

  it('getExpandedScenariosForLevel returns scenarios', () => {
    expect(getExpandedScenariosForLevel('A2').length).toBe(8);
    expect(getExpandedScenariosForLevel('B1').length).toBe(8);
    expect(getExpandedScenariosForLevel('B2').length).toBe(8);
  });

  it('getExpandedScenarioById returns correct scenario', () => {
    const scenario = getExpandedScenarioById('exp_oasis_event_001');
    expect(scenario).not.toBeNull();
    expect(scenario.title).toBe('Planning a Community Event');
  });

  it('getExpandedScenarioById returns null for missing ID', () => {
    expect(getExpandedScenarioById('nonexistent')).toBeNull();
  });
});
