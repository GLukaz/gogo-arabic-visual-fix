import { buildLibraryRoom, buildSmallHouse } from '../templates/common.js';

export const library_archive_interior = {
    id: 'library_archive_interior',
    name: 'Archives',
    nameArabic: 'الأَرشيف',
    zone: 'ancient_library',
    mapWidth: 16,
    mapHeight: 12,
    buildMap: () => buildLibraryRoom(16, 12),
    spawnPoint: { x: 8, y: 10 },

    objects: [
        { key: 'ruin-pillar', x: 2, y: 2, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 13, y: 2, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 2, y: 8, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 13, y: 8, collide: true, collideW: 20, collideH: 20 },
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 14, y: 1, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'librarian-interior', key: 'npc-librarian-ibrahim', name: 'Librarian Ibrahim', nameArabic: 'أَمين المَكتَبَة إبراهيم', x: 8, y: 4 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 8, y: 11, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-archive-1', type: 'bookshelf', x: 4, y: 2, category: 'numbers' },
        { id: 'bookshelf-archive-2', type: 'bookshelf', x: 11, y: 2, category: 'colors' },
        { id: 'bookshelf-archive-3', type: 'bookshelf', x: 4, y: 8, category: 'phrases' },
        { id: 'bookshelf-archive-4', type: 'bookshelf', x: 11, y: 8, category: 'greetings' },
        { id: 'lantern-archive-1', type: 'lantern', x: 7, y: 3, labelArabic: 'فانوس', labelEnglish: 'Archive Lantern', descriptionEnglish: 'A tall lantern keeping the archive dimly lit to preserve the ancient manuscripts.', vocabWordId: 'num_8', vocabCategory: 'numbers', repeatable: true },
        { id: 'crate-archive-1', type: 'crate', x: 7, y: 7, labelArabic: 'صندوق', labelEnglish: 'Manuscript Crate', descriptionEnglish: 'A crate of uncatalogued scrolls and codices from the golden age of learning.', culturalNote: 'The House of Wisdom in Baghdad translated Greek, Persian, and Indian texts into Arabic.', vocabWordId: 'num_12', vocabCategory: 'numbers', loot: { type: 'dirhams', min: 10, max: 25 }, repeatable: false, stateChange: 'inspected' },
        { id: 'painting-archive-1', type: 'painting', x: 8, y: 2, labelArabic: 'لوحة', labelEnglish: 'Illuminated Map', descriptionEnglish: 'A beautifully illuminated medieval map showing the known world.', vocabWordId: 'color_brown', vocabCategory: 'colors', repeatable: true },
    ],
};

export const library_study_interior = {
    id: 'library_study_interior',
    name: 'Study Room',
    nameArabic: 'غُرفَة الدِّراسَة',
    zone: 'ancient_library',
    mapWidth: 10,
    mapHeight: 8,
    buildMap: () => buildSmallHouse(10, 8),
    spawnPoint: { x: 5, y: 6 },

    objects: [
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 8, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'ruin-pillar-broke', x: 1, y: 5, collide: true, collideW: 20, collideH: 20 },
    ],

    npcs: [],

    interactables: [
        { id: 'exit-door', type: 'door', x: 5, y: 7, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-study-1', type: 'bookshelf', x: 3, y: 1, category: 'numbers' },
        { id: 'bookshelf-study-2', type: 'bookshelf', x: 6, y: 1, category: 'phrases' },
        { id: 'lantern-study-1', type: 'lantern', x: 5, y: 3, labelArabic: 'فانوس', labelEnglish: 'Reading Lantern', descriptionEnglish: 'A small oil lantern placed on the study desk for late-night reading.', vocabWordId: 'num_6', vocabCategory: 'numbers', repeatable: true },
        { id: 'pot-study-1', type: 'pot', x: 8, y: 4, labelArabic: 'قِدر', labelEnglish: 'Ink Pot', descriptionEnglish: 'A pot of black ink with a reed pen resting beside it.', vocabWordId: 'yes_1', vocabCategory: 'phrases', repeatable: true },
    ],
};
