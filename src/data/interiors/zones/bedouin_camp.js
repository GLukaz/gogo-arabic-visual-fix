import { buildSmallHouse } from '../templates/common.js';

export const bedouin_tent_interior = {
    id: 'bedouin_tent_interior',
    name: "Elder's Tent",
    nameArabic: 'خَيْمَة الشَّيْخ',
    zone: 'bedouin_camp',
    mapWidth: 12,
    mapHeight: 10,
    buildMap: () => buildSmallHouse(12, 10),
    spawnPoint: { x: 6, y: 8 },

    objects: [
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 10, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock1', x: 1, y: 6, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 10, y: 6, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'bedouin-elder-interior', key: 'npc-elder-tariq', name: 'Elder Tariq', nameArabic: 'الشَّيخ طارِق', x: 6, y: 3 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 6, y: 9, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-tent', type: 'bookshelf', x: 5, y: 1, category: 'time' },
        { id: 'lantern-tent-1', type: 'lantern', x: 3, y: 3, labelArabic: 'فانوس', labelEnglish: 'Tent Lantern', descriptionEnglish: 'A small oil lantern casting warm light inside the tent during long desert nights.', vocabWordId: 'week_1', vocabCategory: 'time', repeatable: true },
        { id: 'pot-tent-1', type: 'pot', x: 8, y: 3, labelArabic: 'قِدر', labelEnglish: 'Coffee Dallah', descriptionEnglish: 'A traditional dallah coffee pot, its long spout polished from years of use.', culturalNote: 'The dallah coffee pot is a symbol of Arab hospitality, featured on Saudi and Emirati currency.', vocabWordId: 'year_1', vocabCategory: 'time', repeatable: true },
        { id: 'painting-tent-1', type: 'painting', x: 8, y: 1, labelArabic: 'لوحة', labelEnglish: 'Desert Tapestry', descriptionEnglish: 'A woven tapestry showing a caravan crossing dunes under a crescent moon.', vocabWordId: 'do_you_speak_arabic_1', vocabCategory: 'phrases', repeatable: true },
    ],
};
