import { buildMosque } from '../templates/common.js';

export const palace_throne_interior = {
    id: 'palace_throne_interior',
    name: 'Throne Room',
    nameArabic: 'قاعَة العَرش',
    zone: 'royal_palace',
    mapWidth: 18,
    mapHeight: 14,
    buildMap: () => buildMosque(18, 14),
    spawnPoint: { x: 9, y: 12 },

    objects: [
        { key: 'ruin-pillar', x: 3, y: 2, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 14, y: 2, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 3, y: 5, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 14, y: 5, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 3, y: 8, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 14, y: 8, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-gate', x: 9, y: 1, collide: true, collideW: 120, collideH: 40 },
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 16, y: 1, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'vizier-interior', key: 'npc-vizier-abbas', name: 'Vizier Abbas', nameArabic: 'الوَزير عَبّاس', x: 9, y: 4 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 9, y: 13, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-throne-1', type: 'bookshelf', x: 5, y: 2, category: 'adjectives' },
        { id: 'bookshelf-throne-2', type: 'bookshelf', x: 12, y: 2, category: 'colors' },
        { id: 'sign-throne', type: 'sign', x: 9, y: 2, textArabic: 'عَرش المَلِك', textEnglish: "The King's Throne" },
        { id: 'chest-throne-room', type: 'chest', x: 16, y: 11, minDirhams: 80, maxDirhams: 250 },
        { id: 'lantern-throne-1', type: 'lantern', x: 6, y: 3, labelArabic: 'فانوس', labelEnglish: 'Royal Lantern', descriptionEnglish: 'A magnificent golden lantern encrusted with rubies, illuminating the throne room.', culturalNote: 'Royal courts in the Islamic golden age were renowned for their opulent lighting and decoration.', vocabWordId: 'color_orange', vocabCategory: 'colors', repeatable: true },
        { id: 'lantern-throne-2', type: 'lantern', x: 11, y: 3, labelArabic: 'فانوس', labelEnglish: 'Royal Lantern', descriptionEnglish: 'A matching golden lantern on the eastern side of the throne.', vocabWordId: 'no_1', vocabCategory: 'phrases', repeatable: true },
        { id: 'painting-throne-1', type: 'painting', x: 6, y: 6, labelArabic: 'لوحة', labelEnglish: 'Dynasty Painting', descriptionEnglish: 'A sweeping painting depicting the royal dynasty across five generations.', vocabWordId: 'rich_1', vocabCategory: 'adjectives', repeatable: true },
        { id: 'painting-throne-2', type: 'painting', x: 11, y: 6, labelArabic: 'لوحة', labelEnglish: 'Coronation Painting', descriptionEnglish: 'A grand scene of the current ruler\'s coronation, attended by scholars and poets.', vocabWordId: 'color_blue', vocabCategory: 'colors', repeatable: true },
        { id: 'statue-throne-1', type: 'statue', x: 7, y: 9, labelArabic: 'تمثال', labelEnglish: 'Eagle Statue', descriptionEnglish: 'A bronze eagle with outstretched wings, the royal emblem of the palace.', vocabWordId: 'heavy_1', vocabCategory: 'adjectives', repeatable: true },
        { id: 'pot-throne-1', type: 'pot', x: 2, y: 10, labelArabic: 'قِدر', labelEnglish: 'Oud Burner', descriptionEnglish: 'An ornate oud burner filling the throne room with the scent of agarwood.', culturalNote: 'Burning oud is a traditional greeting of honour for important guests in the Arab world.', vocabWordId: 'i_love_1', vocabCategory: 'phrases', repeatable: true },
    ],
};
