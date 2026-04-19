import { buildSmallHouse, buildMosque } from '../templates/common.js';

export const mountain_home_interior = {
    id: 'mountain_home_interior',
    name: "Elder's Home",
    nameArabic: 'بَيْت الشَّيْخ',
    zone: 'mountain_village',
    mapWidth: 10,
    mapHeight: 8,
    buildMap: () => buildSmallHouse(10, 8),
    spawnPoint: { x: 5, y: 6 },

    objects: [
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 8, y: 1, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'mountain-elder-interior', key: 'npc-guide-salim', name: 'Guide Salim', nameArabic: 'الدَّليل سَليم', x: 5, y: 3 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 5, y: 7, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-mountain-home', type: 'bookshelf', x: 4, y: 1, category: 'adjectives' },
        { id: 'pot-mthome-1', type: 'pot', x: 7, y: 3, labelArabic: 'قِدر', labelEnglish: 'Herbal Tea Pot', descriptionEnglish: 'A pot of mountain sage tea, brewed fresh each morning.', vocabWordId: 'small_1', vocabCategory: 'adjectives', repeatable: true },
        { id: 'painting-mthome-1', type: 'painting', x: 2, y: 3, labelArabic: 'لوحة', labelEnglish: 'Mountain Vista', descriptionEnglish: 'A painting showing the view from the village looking down across misty valleys.', vocabWordId: 'fast_1', vocabCategory: 'adjectives', repeatable: true },
    ],
};

export const mountain_mosque_interior = {
    id: 'mountain_mosque_interior',
    name: 'Mosque',
    nameArabic: 'المَسْجِد',
    zone: 'mountain_village',
    mapWidth: 18,
    mapHeight: 14,
    buildMap: () => buildMosque(18, 14),
    spawnPoint: { x: 9, y: 12 },

    objects: [
        { key: 'ruin-pillar', x: 3, y: 2, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 14, y: 2, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 3, y: 7, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar', x: 14, y: 7, collide: true, collideW: 20, collideH: 20 },
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 16, y: 1, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'imam-interior', key: 'npc-imam-muhammad', name: 'Imam Muhammad', nameArabic: 'الإمام مُحَمَّد', x: 9, y: 4 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 9, y: 13, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'bookshelf-mosque-1', type: 'bookshelf', x: 5, y: 2, category: 'greetings' },
        { id: 'bookshelf-mosque-2', type: 'bookshelf', x: 12, y: 2, category: 'phrases' },
        { id: 'sign-mihrab', type: 'sign', x: 9, y: 2, textArabic: 'المِحراب', textEnglish: 'The Mihrab' },
        { id: 'lantern-mosque-1', type: 'lantern', x: 6, y: 5, labelArabic: 'فانوس', labelEnglish: 'Prayer Lantern', descriptionEnglish: 'A beautiful glass lantern hanging in the prayer hall, its light warm and inviting.', culturalNote: 'Mosque lamps are a major art form in Islamic culture, often decorated with Quranic verses.', vocabWordId: 'bismillaah', vocabCategory: 'greetings', repeatable: true },
        { id: 'lantern-mosque-2', type: 'lantern', x: 11, y: 5, labelArabic: 'فانوس', labelEnglish: 'Prayer Lantern', descriptionEnglish: 'A matching lantern illuminating the eastern side of the prayer hall.', vocabWordId: 'alhamdulillaah', vocabCategory: 'greetings', repeatable: true },
        { id: 'painting-mosque-1', type: 'painting', x: 9, y: 4, labelArabic: 'لوحة', labelEnglish: 'Geometric Panel', descriptionEnglish: 'An intricate geometric tile panel with interlocking stars and hexagons.', culturalNote: 'Islamic geometric patterns use mathematics to create infinite, repeating designs symbolising the infinite nature of God.', vocabWordId: 'thank_you_very_much_1', vocabCategory: 'phrases', repeatable: true },
    ],
};
