import { describe, it, expect } from 'vitest';
import { GATHERING_SPOTS, getGatheringSpotsForZone, getGatheringSpotCount } from '../gatheringSpots.js';
import { RESOURCES } from '../resources.js';
import { ZONES } from '../zones.js';

describe('gathering spots data integrity', () => {
  it('all spot IDs match their object keys', () => {
    const mismatches = [];

    for (const [key, spot] of Object.entries(GATHERING_SPOTS)) {
      if (spot.id !== key) {
        mismatches.push(`key '${key}' does not match spot.id '${spot.id}'`);
      }
    }

    expect(mismatches).toEqual([]);
  });

  it('all spots have valid resourceId from RESOURCES', () => {
    const invalidSpots = [];

    for (const [spotId, spot] of Object.entries(GATHERING_SPOTS)) {
      if (!RESOURCES[spot.resourceId]) {
        invalidSpots.push(`${spotId}: invalid resourceId '${spot.resourceId}'`);
      }
    }

    expect(invalidSpots).toEqual([]);
  });

  it('all spots have valid gatherType', () => {
    const validTypes = new Set(['herb_patch', 'ore_vein', 'water_source', 'animal_trace', 'papyrus_stand']);
    const invalidSpots = [];

    for (const [spotId, spot] of Object.entries(GATHERING_SPOTS)) {
      if (!validTypes.has(spot.gatherType)) {
        invalidSpots.push(`${spotId}: invalid gatherType '${spot.gatherType}'`);
      }
    }

    expect(invalidSpots).toEqual([]);
  });

  it('all spots have positive x and y coordinates', () => {
    const invalidSpots = [];

    for (const [spotId, spot] of Object.entries(GATHERING_SPOTS)) {
      if (spot.x < 0 || spot.y < 0) {
        invalidSpots.push(`${spotId}: invalid coordinates (${spot.x}, ${spot.y})`);
      }
    }

    expect(invalidSpots).toEqual([]);
  });

  it('all spots have valid respawnInterval (4hr or 8hr)', () => {
    const validIntervals = new Set([14400000, 28800000]); // 4 hours, 8 hours
    const invalidSpots = [];

    for (const [spotId, spot] of Object.entries(GATHERING_SPOTS)) {
      if (!validIntervals.has(spot.respawnInterval)) {
        invalidSpots.push(`${spotId}: invalid respawnInterval ${spot.respawnInterval}ms`);
      }
    }

    expect(invalidSpots).toEqual([]);
  });

  it('all spots have spriteKey', () => {
    const invalidSpots = [];

    for (const [spotId, spot] of Object.entries(GATHERING_SPOTS)) {
      if (!spot.spriteKey || spot.spriteKey.trim() === '') {
        invalidSpots.push(`${spotId}: missing or empty spriteKey`);
      }
    }

    expect(invalidSpots).toEqual([]);
  });

  it('all spots reference existing zones (excluding future zones)', () => {
    const existingZoneIds = Object.keys(ZONES);
    const futureZones = new Set(['baghdad_marketplace', 'baghdad_house_of_wisdom']); // Known future zones
    const invalidSpots = [];

    for (const [spotId, spot] of Object.entries(GATHERING_SPOTS)) {
      // Skip validation for spots in future zones
      if (futureZones.has(spot.zoneId)) {
        continue;
      }

      if (!existingZoneIds.includes(spot.zoneId)) {
        invalidSpots.push(`${spotId}: references non-existent zone '${spot.zoneId}'`);
      }
    }

    expect(invalidSpots).toEqual([]);
  });

  it('getGatheringSpotsForZone returns correct spots', () => {
    const oasisSpots = getGatheringSpotsForZone('oasis_village');
    expect(oasisSpots.length).toBeGreaterThan(0);
    expect(oasisSpots.every(s => s.zoneId === 'oasis_village')).toBe(true);
  });

  it('getGatheringSpotsForZone returns empty array for unknown zone', () => {
    const unknownSpots = getGatheringSpotsForZone('unknown_zone_xyz');
    expect(unknownSpots).toEqual([]);
  });

  it('getGatheringSpotCount returns correct total', () => {
    const count = getGatheringSpotCount();
    expect(count).toBe(Object.keys(GATHERING_SPOTS).length);
    expect(count).toBeGreaterThanOrEqual(59); // 65 spots defined (59 for existing zones, 6 for future)
  });

  it('all existing zones have 5+ gathering spots', () => {
    const existingZones = ['oasis_village', 'ancient_library', 'desert_marketplace', 'farmland', 'bedouin_camp', 'mountain_village', 'coastal_port'];
    const zonesWithTooFewSpots = [];

    for (const zoneId of existingZones) {
      const spots = getGatheringSpotsForZone(zoneId);
      if (spots.length < 5) {
        zonesWithTooFewSpots.push(`${zoneId}: only ${spots.length} spots`);
      }
    }

    expect(zonesWithTooFewSpots).toEqual([]);
  });

  it('all spot resources match their gatherType profession', () => {
    const typeToResourceType = {
      herb_patch: ['herbalist', 'alchemist', 'cook'], // cook uses herbs/spices
      ore_vein: ['blacksmith', 'jeweler', 'calligrapher'], // calligrapher uses lapis/pigments
      water_source: ['alchemist', 'herbalist', 'cook'], // cook uses oils/liquids
      animal_trace: ['weaver'],
      papyrus_stand: ['calligrapher'],
    };

    const mismatches = [];

    for (const [spotId, spot] of Object.entries(GATHERING_SPOTS)) {
      const resource = RESOURCES[spot.resourceId];
      if (!resource) continue; // Skip if resource doesn't exist yet

      const expectedProfessions = typeToResourceType[spot.gatherType] || [];
      const hasMatch = expectedProfessions.some(prof => resource.professions?.includes(prof));

      if (!hasMatch && resource.professions && resource.professions.length > 0) {
        mismatches.push(`${spotId}: gatherType '${spot.gatherType}' doesn't match resource professions [${resource.professions.join(', ')}]`);
      }
    }

    expect(mismatches).toEqual([]);
  });
});
