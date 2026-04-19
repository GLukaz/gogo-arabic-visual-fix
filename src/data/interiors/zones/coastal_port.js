import { buildLargeHouse } from '../templates/common.js';

export const port_tavern_interior = {
    id: 'port_tavern_interior',
    name: 'Tavern',
    nameArabic: 'حانَة البَحّارَة',
    zone: 'coastal_port',
    mapWidth: 14,
    mapHeight: 10,
    buildMap: () => buildLargeHouse(14, 10),
    spawnPoint: { x: 7, y: 8 },

    objects: [
        { key: 'ruin-pillar', x: 1, y: 1, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 12, y: 1, collide: true, collideW: 20, collideH: 20 },
        { key: 'rock1', x: 6, y: 2, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 7, y: 2, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'tavern-keeper-interior', key: 'npc-captain-rashid', name: 'Captain Rashid', nameArabic: 'القُبطان رَشيد', x: 7, y: 3 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 7, y: 9, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-tavern', type: 'bookshelf', x: 3, y: 1, category: 'food' },
        { id: 'sign-tavern-menu', type: 'sign', x: 7, y: 1, textArabic: 'قائِمَة الطَّعام', textEnglish: 'Menu' },
        { id: 'barrel-tavern-1', type: 'barrel', x: 10, y: 1, labelArabic: 'برميل', labelEnglish: 'Date Wine Barrel', descriptionEnglish: 'A barrel of sweet date wine, a favourite among the port sailors.', vocabWordId: 'juice_1', vocabCategory: 'food', repeatable: true },
        { id: 'lantern-tavern-1', type: 'lantern', x: 4, y: 5, labelArabic: 'فانوس', labelEnglish: 'Tavern Lantern', descriptionEnglish: 'A flickering lantern above the tavern counter, its light warm and hazy.', vocabWordId: 'far_1', vocabCategory: 'directions', repeatable: true },
        { id: 'painting-tavern-1', type: 'painting', x: 10, y: 4, labelArabic: 'لوحة', labelEnglish: 'Sea Monster Painting', descriptionEnglish: 'A dramatic painting of a sailor battling a sea serpent, likely exaggerated.', vocabWordId: 'chicken_1', vocabCategory: 'food', repeatable: true },
    ],
};

export const port_warehouse_interior = {
    id: 'port_warehouse_interior',
    name: 'Port Warehouse',
    nameArabic: 'مَخْزَن المِيناء',
    zone: 'coastal_port',
    mapWidth: 14,
    mapHeight: 10,
    buildMap: () => buildLargeHouse(14, 10),
    spawnPoint: { x: 7, y: 8 },

    objects: [
        { key: 'rock1', x: 2, y: 2, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 11, y: 2, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock1', x: 2, y: 6, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 11, y: 6, collide: true, collideW: 30, collideH: 20 },
        { key: 'ruin-pillar', x: 6, y: 1, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 7, y: 1, collide: true, collideW: 20, collideH: 20 },
    ],

    npcs: [],

    interactables: [
        { id: 'exit-door', type: 'door', x: 7, y: 9, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'chest-port-wh-1', type: 'chest', x: 2, y: 1, minDirhams: 30, maxDirhams: 100 },
        { id: 'chest-port-wh-2', type: 'chest', x: 11, y: 1, minDirhams: 35, maxDirhams: 110 },
        { id: 'barrel-portwh-1', type: 'barrel', x: 5, y: 3, labelArabic: 'برميل', labelEnglish: 'Cargo Barrel', descriptionEnglish: 'A sealed barrel of imported goods awaiting collection by merchants.', vocabWordId: 'ship_w44', vocabCategory: 'trade', loot: { type: 'dirhams', min: 10, max: 25 }, repeatable: false, stateChange: 'inspected' },
        { id: 'crate-portwh-1', type: 'crate', x: 9, y: 5, labelArabic: 'صندوق', labelEnglish: 'Shipping Crate', descriptionEnglish: 'A large crate of ceramics packed in straw for safe transport.', vocabWordId: 'port_w45', vocabCategory: 'trade', repeatable: true },
    ],
};
