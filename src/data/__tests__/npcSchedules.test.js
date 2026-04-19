import { describe, it, expect } from 'vitest';
import {
  NPC_SCHEDULES,
  SCHEDULED_NPC_IDS,
  getNpcLocation,
  getNpcsAtLocation,
} from '../npcSchedules.js';

describe('NPC Schedule System', () => {
  describe('NPC_SCHEDULES data', () => {
    it('has exactly 30 NPCs scheduled', () => {
      expect(SCHEDULED_NPC_IDS).toHaveLength(30);
    });

    it('every NPC has 3-4 schedule blocks', () => {
      for (const npcId of SCHEDULED_NPC_IDS) {
        const blocks = NPC_SCHEDULES[npcId];
        expect(blocks.length, `${npcId} should have 3-4 blocks`).toBeGreaterThanOrEqual(3);
        expect(blocks.length, `${npcId} should have 3-4 blocks`).toBeLessThanOrEqual(4);
      }
    });

    it('every block has required fields', () => {
      for (const npcId of SCHEDULED_NPC_IDS) {
        for (const block of NPC_SCHEDULES[npcId]) {
          expect(block).toHaveProperty('timeStart');
          expect(block).toHaveProperty('timeEnd');
          expect(block).toHaveProperty('location');
          expect(block).toHaveProperty('activity');
          expect(typeof block.timeStart).toBe('number');
          expect(typeof block.timeEnd).toBe('number');
          expect(typeof block.location).toBe('string');
          expect(typeof block.activity).toBe('string');
        }
      }
    });

    it('all timeStart and timeEnd values are in 0-23 range', () => {
      for (const npcId of SCHEDULED_NPC_IDS) {
        for (const block of NPC_SCHEDULES[npcId]) {
          expect(block.timeStart, `${npcId} timeStart`).toBeGreaterThanOrEqual(0);
          expect(block.timeStart, `${npcId} timeStart`).toBeLessThanOrEqual(23);
          expect(block.timeEnd, `${npcId} timeEnd`).toBeGreaterThanOrEqual(0);
          expect(block.timeEnd, `${npcId} timeEnd`).toBeLessThanOrEqual(23);
        }
      }
    });

    it('schedule blocks cover the full 24-hour cycle for each NPC', () => {
      for (const npcId of SCHEDULED_NPC_IDS) {
        const covered = new Set();
        for (const block of NPC_SCHEDULES[npcId]) {
          if (block.timeStart < block.timeEnd) {
            for (let h = block.timeStart; h < block.timeEnd; h++) {
              covered.add(h);
            }
          } else {
            // Overnight block
            for (let h = block.timeStart; h < 24; h++) covered.add(h);
            for (let h = 0; h < block.timeEnd; h++) covered.add(h);
          }
        }
        expect(covered.size, `${npcId} should cover all 24 hours`).toBe(24);
      }
    });

    it('all locations reference valid zone-like IDs', () => {
      const validLocations = new Set([
        'oasis_village', 'ancient_library', 'desert_marketplace',
        'farmland', 'bedouin_camp', 'mountain_village',
        'coastal_port', 'royal_palace', 'garden_district',
      ]);
      for (const npcId of SCHEDULED_NPC_IDS) {
        for (const block of NPC_SCHEDULES[npcId]) {
          expect(validLocations.has(block.location),
            `${npcId} has invalid location: ${block.location}`).toBe(true);
        }
      }
    });
  });

  describe('getNpcLocation', () => {
    it('returns location and activity for a valid NPC at a given hour', () => {
      const result = getNpcLocation('scholar-yusuf', 10);
      expect(result).toEqual({ location: 'ancient_library', activity: 'teaching' });
    });

    it('returns correct location during overnight block', () => {
      const result = getNpcLocation('scholar-yusuf', 2);
      expect(result).toEqual({ location: 'oasis_village', activity: 'sleeping' });
    });

    it('returns correct location at exact start of a block', () => {
      // scholar-yusuf: 5-8 morning_prayer_and_study
      const result = getNpcLocation('scholar-yusuf', 5);
      expect(result).toEqual({ location: 'oasis_village', activity: 'morning_prayer_and_study' });
    });

    it('returns next block at exact end of a block (exclusive end)', () => {
      // scholar-yusuf: 5-8 ends, 8-17 starts
      const result = getNpcLocation('scholar-yusuf', 8);
      expect(result).toEqual({ location: 'ancient_library', activity: 'teaching' });
    });

    it('returns null for unknown NPC', () => {
      expect(getNpcLocation('unknown-npc', 12)).toBeNull();
    });

    it('handles hour 0 (midnight)', () => {
      const result = getNpcLocation('guard-hamza', 0);
      expect(result).toEqual({ location: 'oasis_village', activity: 'sleeping' });
    });

    it('handles hour 23', () => {
      const result = getNpcLocation('guard-hamza', 23);
      expect(result).toEqual({ location: 'oasis_village', activity: 'sleeping' });
    });

    it('normalizes hours >= 24', () => {
      // Hour 26 should be treated as hour 2
      const normalResult = getNpcLocation('scholar-yusuf', 2);
      const wrappedResult = getNpcLocation('scholar-yusuf', 26);
      expect(wrappedResult).toEqual(normalResult);
    });

    it('normalizes negative hours', () => {
      // Hour -1 should be treated as hour 23
      const normalResult = getNpcLocation('guard-hamza', 23);
      const negativeResult = getNpcLocation('guard-hamza', -1);
      expect(negativeResult).toEqual(normalResult);
    });

    it('returns a result for every NPC at every hour', () => {
      for (const npcId of SCHEDULED_NPC_IDS) {
        for (let h = 0; h < 24; h++) {
          const result = getNpcLocation(npcId, h);
          expect(result, `${npcId} at hour ${h}`).not.toBeNull();
          expect(result.location).toBeTruthy();
          expect(result.activity).toBeTruthy();
        }
      }
    });
  });

  describe('getNpcsAtLocation', () => {
    it('returns NPCs present at oasis_village in the morning', () => {
      const npcs = getNpcsAtLocation('oasis_village', 10);
      expect(npcs.length).toBeGreaterThan(0);
      const ids = npcs.map(n => n.npcId);
      // Herbalist Maryam is healing patients 10-17 at oasis_village
      expect(ids).toContain('herbalist-maryam');
    });

    it('returns NPCs with their current activity', () => {
      const npcs = getNpcsAtLocation('ancient_library', 10);
      const scholar = npcs.find(n => n.npcId === 'scholar-yusuf');
      expect(scholar).toBeDefined();
      expect(scholar.activity).toBe('teaching');
    });

    it('returns empty array for location with no NPCs at given hour', () => {
      // Bedouin camp only has wanderer-ali in the afternoon
      const npcs = getNpcsAtLocation('bedouin_camp', 8);
      expect(npcs).toEqual([]);
    });

    it('returns different NPCs at different hours for the same location', () => {
      const morningNpcs = getNpcsAtLocation('desert_marketplace', 9);
      const eveningNpcs = getNpcsAtLocation('desert_marketplace', 19);
      const morningIds = morningNpcs.map(n => n.npcId).sort();
      const eveningIds = eveningNpcs.map(n => n.npcId).sort();
      // The sets should differ (some NPCs leave/arrive)
      expect(morningIds).not.toEqual(eveningIds);
    });

    it('returns empty array for unknown location', () => {
      expect(getNpcsAtLocation('nonexistent_zone', 12)).toEqual([]);
    });

    it('each NPC appears at most once per location per hour', () => {
      const npcs = getNpcsAtLocation('oasis_village', 12);
      const ids = npcs.map(n => n.npcId);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toEqual(uniqueIds);
    });

    it('handles overnight transitions correctly', () => {
      // At hour 3 (deep night), most NPCs should be sleeping at their home locations
      const oasisNight = getNpcsAtLocation('oasis_village', 3);
      expect(oasisNight.length).toBeGreaterThan(0);
      // Check that activities are sleeping-related
      const sleepingNpcs = oasisNight.filter(n => n.activity.includes('sleep') || n.activity.includes('rest') || n.activity.includes('prayer'));
      expect(sleepingNpcs.length).toBeGreaterThan(0);
    });
  });
});
