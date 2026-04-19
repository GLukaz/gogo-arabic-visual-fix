/**
 * Interior Registry — Central aggregator for all modular interior definitions.
 */

// Import from modular zone files
import * as oasis from './zones/oasis_village.js';
import * as library from './zones/ancient_library.js';
import * as market from './zones/desert_marketplace.js';
import * as farm from './zones/farmland.js';
import * as camp from './zones/bedouin_camp.js';
import * as mountain from './zones/mountain_village.js';
import * as port from './zones/coastal_port.js';
import * as palace from './zones/royal_palace.js';
import { InteriorGenerator } from '../../game/systems/InteriorGenerator.js';

// Base handcrafted interiors
const handCraftedInteriors = {
    ...oasis,
    ...library,
    ...market,
    ...farm,
    ...camp,
    ...mountain,
    ...port,
    ...palace,
};

// Procedural Generator
const generator = new InteriorGenerator();
const proceduralInteriors = {};

// Configuration for procedural generation per zone
const ZONE_CONFIGS = [
    // Original
    { zone: 'oasis_village', theme: 'oasis', count: 5 },
    { zone: 'ancient_library', theme: 'oasis', count: 3 },
    { zone: 'desert_marketplace', theme: 'oasis', count: 3 },
    { zone: 'farmland', theme: 'oasis', count: 3 },
    { zone: 'bedouin_camp', theme: 'oasis', count: 3 },
    { zone: 'mountain_village', theme: 'mountain', count: 5 },
    { zone: 'coastal_port', theme: 'coastal', count: 5 },
    { zone: 'royal_palace', theme: 'history', count: 3 },

    // Real World (History Theme)
    { zone: 'baghdad', theme: 'history', count: 5 },
    { zone: 'cordoba', theme: 'history', count: 5 },
    { zone: 'timbuktu', theme: 'history', count: 5 },
    { zone: 'damascus', theme: 'history', count: 5 },
    { zone: 'cairo', theme: 'history', count: 5 },
    { zone: 'fez', theme: 'history', count: 5 },
    { zone: 'samarkand', theme: 'history', count: 5 },
    { zone: 'granada', theme: 'history', count: 5 },

    // Fantasy (Fantasy Theme)
    { zone: 'star_oasis', theme: 'fantasy', count: 5 },
    { zone: 'mountain_of_words', theme: 'fantasy', count: 5 },
    { zone: 'sea_of_ink', theme: 'fantasy', count: 5 },
    { zone: 'forest_of_tales', theme: 'fantasy', count: 5 },
    { zone: 'desert_of_silence', theme: 'fantasy', count: 5 },
    { zone: 'merchants_island', theme: 'fantasy', count: 5 },
    { zone: 'fortress_of_secrets', theme: 'fantasy', count: 5 },
    { zone: 'garden_of_spirits', theme: 'fantasy', count: 5 },
];

// Generate fillers
ZONE_CONFIGS.forEach(config => {
    for (let i = 1; i <= config.count; i++) {
        const id = `house_${config.zone}_${i}`;
        proceduralInteriors[id] = generator.generateInterior(id, {
            theme: config.theme,
            type: 'house',
            width: 10 + Math.floor(Math.random() * 4), // Random width 10-14
            height: 8 + Math.floor(Math.random() * 4), // Random height 8-12
            name: `${config.theme.charAt(0).toUpperCase() + config.theme.slice(1)} House ${i}`
        });
    }
});

// Aggregate into a single object
export const INTERIORS = {
    ...handCraftedInteriors,
    ...proceduralInteriors
};

// Helper to get interior by ID safely
export function getInterior(id) {
    return INTERIORS[id];
}

// Helper to get all interiors for a specific zone
export function getInteriorsByZone(zoneKey) {
    return Object.values(INTERIORS).filter(i => i.zone === zoneKey);
}
