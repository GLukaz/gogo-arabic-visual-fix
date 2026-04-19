import { SAND, GRASS, WATER, STONE, WOOD } from '../../data/zones.js';

export class InteriorGenerator {
    constructor() {
        this.themes = {
            oasis: { floor: SAND, rug: GRASS, wall: 'ruin-pillar' },
            mountain: { floor: STONE, rug: WOOD, wall: 'ruin-pillar' }, // Assuming STONE/WOOD exist or fallback
            coastal: { floor: WOOD, rug: SAND, wall: 'ruin-pillar' },
            history: { floor: STONE, rug: GRASS, wall: 'ruin-pillar' }, // Real World placeholder
            fantasy: { floor: SAND, rug: WATER, wall: 'ruin-pillar' },   // Fantasy placeholder
        };
    }

    generateInterior(id, config) {
        const {
            theme = 'oasis',
            type = 'house',
            width = 10,
            height = 8,
            name = 'Generic House'
        } = config;

        // Resolve tiles based on theme
        // Fallback if STONE/WOOD not imported yet
        const themeTiles = this.themes[theme] || this.themes.oasis;
        const FLOOR = themeTiles.floor;
        const RUG = themeTiles.rug;

        // Generate Layout
        const buildMap = () => {
            const m = [];
            for (let y = 0; y < height; y++) {
                const row = [];
                for (let x = 0; x < width; x++) {
                    let tile = FLOOR;
                    // Simple rug logic: center area
                    if (x >= 2 && x <= width - 3 && y >= 2 && y <= height - 3) {
                        tile = RUG;
                    }
                    row.push(tile);
                }
                m.push(row);
            }
            return m;
        };

        // Generate Objects
        const objects = [];
        // Always add some "walls/columns" in corners
        objects.push({ key: themeTiles.wall, x: 1, y: 1, collide: true, collideW: 20, collideH: 20 });
        objects.push({ key: themeTiles.wall, x: width - 2, y: 1, collide: true, collideW: 20, collideH: 20 });

        // Generate Interactables
        const interactables = [];
        // Exit door always at bottom center
        const exitX = Math.floor(width / 2);
        const exitY = height - 1;
        interactables.push({
            id: 'exit-door',
            type: 'door',
            x: exitX,
            y: exitY,
            isExit: true,
            labelArabic: 'خروج',
            labelEnglish: 'Exit'
        });

        // Add random furniture based on type
        if (type === 'house') {
            interactables.push({
                id: `bookshelf-${id}`,
                type: 'bookshelf',
                x: 2,
                y: 1,
                category: 'greetings' // Randomize later
            });
        }

        return {
            id,
            name,
            nameArabic: 'منزل', // Generic
            zone: theme + '_village', // rough guess
            mapWidth: width,
            mapHeight: height,
            buildMap,
            spawnPoint: { x: exitX, y: exitY - 1 },
            objects,
            npcs: [],
            interactables
        };
    }
}
