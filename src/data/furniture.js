/**
 * Furniture Registry
 * Defines interactive objects found in interiors and their associated vocabulary categories.
 */

export const FURNITURE = {
    // Bookshelves (Vocabulary Learning)
    bookshelf: {
        type: 'bookshelf',
        labelArabic: 'مَكتَبَة',
        labelEnglish: 'Bookshelf',
        description: 'A collection of books and scrolls.',
        interactionType: 'vocabulary',
        utilityCategory: 'Knowledge',   // مَعرِفَة
        utilityValue: 3,
    },

    // Lanterns (Small discrete vocab)
    lantern: {
        type: 'lantern',
        labelArabic: 'فانوس',
        labelEnglish: 'Lantern',
        description: 'A traditional lantern providing warm light.',
        interactionType: 'vocabulary_single',
        utilityCategory: 'Comfort',     // راحَة
        utilityValue: 1,
    },

    // Pots (Cultural context / Single words)
    pot: {
        type: 'pot',
        labelArabic: 'قِدر',
        labelEnglish: 'Pot',
        description: 'A clay pot used for cooking or storage.',
        interactionType: 'vocabulary_single',
        utilityCategory: 'Hospitality', // ضِيافَة
        utilityValue: 1,
    },

    // Chests (Loot)
    chest: {
        type: 'chest',
        labelArabic: 'صندوق',
        labelEnglish: 'Chest',
        description: 'A sturdy wooden chest.',
        interactionType: 'loot',
        utilityCategory: 'Barakah',     // بَرَكَة
        utilityValue: 2,
    },

    // Barrels (Trade goods)
    barrel: {
        type: 'barrel',
        labelArabic: 'برميل',
        labelEnglish: 'Barrel',
        description: 'A barrel for storing goods.',
        interactionType: 'vocabulary_single',
    },

    // Crates (Trade goods)
    crate: {
        type: 'crate',
        labelArabic: 'صندوق خَشَبي',
        labelEnglish: 'Crate',
        description: 'A wooden crate for transport.',
        interactionType: 'loot',
    },

    // Paintings (Cultural Notes)
    painting: {
        type: 'painting',
        labelArabic: 'لوحة',
        labelEnglish: 'Painting',
        description: 'A decorative artwork.',
        interactionType: 'cultural_note',
    },

    // Home-specific decoration items
    prayer_rug: {
        type: 'prayer_rug',
        labelArabic: 'سجّادة صلاة',
        labelEnglish: 'Prayer Rug',
        description: 'A beautifully woven prayer rug.',
        interactionType: 'decoration',
        utilityCategory: 'Barakah',
        utilityValue: 5,
    },

    study_desk: {
        type: 'study_desk',
        labelArabic: 'مكتب دراسة',
        labelEnglish: 'Study Desk',
        description: 'A desk for studying Arabic texts.',
        interactionType: 'decoration',
        utilityCategory: 'Knowledge',
        utilityValue: 4,
    },

    cushion_set: {
        type: 'cushion_set',
        labelArabic: 'مجلس',
        labelEnglish: 'Cushion Set',
        description: 'Traditional floor seating for guests.',
        interactionType: 'decoration',
        utilityCategory: 'Hospitality',
        utilityValue: 4,
    },

    incense_burner: {
        type: 'incense_burner',
        labelArabic: 'مبخرة',
        labelEnglish: 'Incense Burner',
        description: 'A brass incense burner spreading calming scents.',
        interactionType: 'decoration',
        utilityCategory: 'Comfort',
        utilityValue: 3,
    },
};

export const UTILITY_CATEGORIES = {
    Comfort:     { nameArabic: 'راحَة',   nameEnglish: 'Comfort',     icon: '🛋️' },
    Knowledge:   { nameArabic: 'مَعرِفَة', nameEnglish: 'Knowledge',   icon: '📚' },
    Hospitality: { nameArabic: 'ضِيافَة',  nameEnglish: 'Hospitality', icon: '☕' },
    Barakah:     { nameArabic: 'بَرَكَة',  nameEnglish: 'Barakah',     icon: '✨' },
};

export const VOCAB_CATEGORIES = [
    'greetings',
    'numbers',
    'colors',
    'days',
    'family',
    'food',
    'animals',
    'nature',
    'directions',
    'feelings',
    'verbs',
    'adjectives',
    'places',
    'weather',
    'time',
    'clothing',
    'body',
    'home',
    'school',
    'jobs',
];
