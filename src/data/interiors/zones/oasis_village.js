import { buildSmallHouse, buildLargeHouse } from '../templates/common.js';

export const scholar_house_interior = {
    id: 'scholar_house_interior',
    name: "Scholar's Study",
    nameArabic: 'مَكتَبَة الشَّيخ',
    zone: 'oasis_village',
    mapWidth: 14,
    mapHeight: 10,
    buildMap: () => buildLargeHouse(14, 10),
    spawnPoint: { x: 7, y: 8 },

    objects: [
        { key: 'ruin-pillar', x: 1, y: 1, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 12, y: 1, collide: true, collideW: 20, collideH: 20 },
        { key: 'rock1', x: 3, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 10, y: 1, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'scholar-yusuf-interior', key: 'npc-scholar-yusuf', name: 'Scholar Yusuf', nameArabic: 'الشَّيْخ يوسُف', x: 7, y: 3 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 7, y: 9, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-scholar-study-1', type: 'bookshelf', x: 2, y: 1, category: 'greetings' },
        { id: 'bookshelf-scholar-study-2', type: 'bookshelf', x: 11, y: 1, category: 'phrases' },
        { id: 'lantern-scholar-1', type: 'lantern', x: 5, y: 2, labelArabic: 'فانوس', labelEnglish: 'Study Lantern', descriptionEnglish: 'A brass lantern illuminating the scholar\'s reading desk.', vocabWordId: 'shukran', vocabCategory: 'greetings', repeatable: true },
        { id: 'painting-scholar-1', type: 'painting', x: 9, y: 3, labelArabic: 'لوحة', labelEnglish: 'Calligraphy Scroll', descriptionEnglish: 'A framed scroll of beautiful Arabic calligraphy hanging on the study wall.', culturalNote: 'Arabic calligraphy is often called the art of the soul.', vocabWordId: 'afwan', vocabCategory: 'greetings', repeatable: true },
        { id: 'pot-scholar-1', type: 'pot', x: 4, y: 6, labelArabic: 'قِدر', labelEnglish: 'Ink Pot', descriptionEnglish: 'A small clay pot of dark ink used by the scholar for writing.', vocabWordId: 'naam', vocabCategory: 'greetings', repeatable: true },
    ],
};

export const merchant_house_interior = {
    id: 'merchant_house_interior',
    name: "Merchant's Home",
    nameArabic: 'بَيْت فاطِمَة',
    zone: 'oasis_village',
    mapWidth: 10,
    mapHeight: 8,
    buildMap: () => buildSmallHouse(10, 8),
    spawnPoint: { x: 5, y: 6 },

    objects: [
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 8, y: 1, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'merchant-fatima-interior', key: 'npc-merchant-fatima', name: 'Merchant Fatima', nameArabic: 'التّاجِرَة فاطِمَة', x: 5, y: 3 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 5, y: 7, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'chest-merchant-home', type: 'chest', x: 8, y: 1, minDirhams: 10, maxDirhams: 30 },
        { id: 'barrel-merchant-1', type: 'barrel', x: 3, y: 1, labelArabic: 'برميل', labelEnglish: 'Trade Barrel', descriptionEnglish: 'A barrel of goods Fatima has acquired through shrewd trading.', vocabWordId: 'coin_w47', vocabCategory: 'trade', repeatable: true },
        { id: 'pot-merchant-1', type: 'pot', x: 7, y: 4, labelArabic: 'قِدر', labelEnglish: 'Tea Pot', descriptionEnglish: 'A pot of mint tea kept warm for customers and guests.', vocabWordId: 'habibi', vocabCategory: 'greetings', repeatable: true },
    ],
};

export const oasis_guild_interior = {
    id: 'oasis_guild_interior',
    name: "Adventurer's Guild",
    nameArabic: 'نادي المُغامِرين',
    zone: 'oasis_village',
    mapWidth: 14,
    mapHeight: 10,
    buildMap: () => buildLargeHouse(14, 10),
    spawnPoint: { x: 7, y: 8 },

    objects: [
        { key: 'ruin-pillar', x: 1, y: 1, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 12, y: 1, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 1, y: 5, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 12, y: 5, collide: true, collideW: 20, collideH: 20 },
        { key: 'rock1', x: 6, y: 1, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [],

    interactables: [
        { id: 'exit-door', type: 'door', x: 7, y: 9, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-guild-quests', type: 'bookshelf', x: 3, y: 1, category: 'phrases' },
        { id: 'sign-guild-board', type: 'sign', x: 7, y: 2, textArabic: 'لَوحَة المَهام', textEnglish: 'Quest Board' },
        { id: 'lantern-guild-1', type: 'lantern', x: 4, y: 4, labelArabic: 'فانوس', labelEnglish: 'Guild Lantern', descriptionEnglish: 'A hanging lantern lighting the guild hall where adventurers gather.', vocabWordId: 'yalla', vocabCategory: 'greetings', repeatable: true },
        { id: 'crate-guild-1', type: 'crate', x: 10, y: 3, labelArabic: 'صندوق', labelEnglish: 'Supply Crate', descriptionEnglish: 'A crate of supplies donated by grateful villagers for adventurers.', vocabWordId: 'laa', vocabCategory: 'greetings', loot: { type: 'dirhams', min: 5, max: 15 }, repeatable: false, stateChange: 'inspected' },
        { id: 'painting-guild-1', type: 'painting', x: 10, y: 1, labelArabic: 'لوحة', labelEnglish: 'Map of Zones', descriptionEnglish: 'A hand-painted map showing all eight zones of the world.', vocabWordId: 'mashaallaah', vocabCategory: 'greetings', repeatable: true },
    ],
};
