import { buildSmallHouse } from '../templates/common.js';

export const farmhouse_interior = {
    id: 'farmhouse_interior',
    name: "Farmer's House",
    nameArabic: 'بَيْت المُزارِع',
    zone: 'farmland',
    mapWidth: 10,
    mapHeight: 8,
    buildMap: () => buildSmallHouse(10, 8),
    spawnPoint: { x: 5, y: 6 },

    objects: [
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 8, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'green-tree-small', x: 1, y: 4, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'farmer-interior', key: 'npc-farmer-omar', name: 'Farmer Omar', nameArabic: 'المُزارِع عُمَر', x: 5, y: 3 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 5, y: 7, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-farmhouse', type: 'bookshelf', x: 4, y: 1, category: 'nature' },
        { id: 'pot-farmhouse-1', type: 'pot', x: 7, y: 3, labelArabic: 'قِدر', labelEnglish: 'Stew Pot', descriptionEnglish: 'A pot of thick farm stew simmering over the hearth. It smells of onions and lamb.', vocabWordId: 'fire_w25', vocabCategory: 'nature', repeatable: true },
        { id: 'barrel-farmhouse-1', type: 'barrel', x: 2, y: 4, labelArabic: 'برميل', labelEnglish: 'Grain Barrel', descriptionEnglish: 'A barrel of stored grain to last through the dry season.', vocabWordId: 'desert_w17', vocabCategory: 'nature', repeatable: true },
    ],
};
