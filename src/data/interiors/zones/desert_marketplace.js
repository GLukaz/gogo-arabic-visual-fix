import { buildShop, buildLargeHouse } from '../templates/common.js';

export const spice_shop_interior = {
    id: 'spice_shop_interior',
    name: 'Spice Shop',
    nameArabic: 'دُكّان البُهارات',
    zone: 'desert_marketplace',
    mapWidth: 12,
    mapHeight: 10,
    buildMap: () => buildShop(12, 10),
    spawnPoint: { x: 6, y: 8 },

    objects: [
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 10, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock1', x: 1, y: 5, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 10, y: 5, collide: true, collideW: 30, collideH: 20 },
    ],

    npcs: [
        { id: 'spice-merchant-interior', key: 'npc-spice-seller-layla', name: 'Spice Seller Layla', nameArabic: 'بائِعَة التَّوابِل لَيلى', x: 6, y: 3 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 6, y: 9, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'sign-spice-counter', type: 'sign', x: 6, y: 2, textArabic: 'بُهارات طازَجَة', textEnglish: 'Fresh Spices' },
        { id: 'barrel-spice-1', type: 'barrel', x: 3, y: 3, labelArabic: 'برميل', labelEnglish: 'Cinnamon Barrel', descriptionEnglish: 'A barrel overflowing with fragrant cinnamon sticks from distant lands.', culturalNote: 'Arab traders kept their spice sources secret to maintain monopoly pricing.', vocabWordId: 'coffee_1', vocabCategory: 'food', repeatable: true },
        { id: 'pot-spice-1', type: 'pot', x: 9, y: 3, labelArabic: 'قِدر', labelEnglish: 'Spice Pot', descriptionEnglish: 'A pot of freshly ground turmeric, its golden colour bright and vivid.', vocabWordId: 'vegetables_1', vocabCategory: 'food', repeatable: true },
        { id: 'pot-spice-2', type: 'pot', x: 4, y: 7, labelArabic: 'قِدر', labelEnglish: 'Saffron Pot', descriptionEnglish: 'A tiny pot of precious saffron threads, worth more than gold by weight.', vocabWordId: 'weight_w39', vocabCategory: 'trade', repeatable: true },
    ],
};

export const textile_shop_interior = {
    id: 'textile_shop_interior',
    name: 'Textile Shop',
    nameArabic: 'دُكّان الأَقمِشَة',
    zone: 'desert_marketplace',
    mapWidth: 12,
    mapHeight: 10,
    buildMap: () => buildShop(12, 10),
    spawnPoint: { x: 6, y: 8 },

    objects: [
        { key: 'rock1', x: 1, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'rock2', x: 10, y: 1, collide: true, collideW: 30, collideH: 20 },
        { key: 'ruin-pillar-broke', x: 1, y: 6, collide: true, collideW: 20, collideH: 20 },
        { key: 'ruin-pillar-broke', x: 10, y: 6, collide: true, collideW: 20, collideH: 20 },
    ],

    npcs: [
        { id: 'textile-merchant-interior', key: 'npc-trader-hassan', name: 'Trader Hassan', nameArabic: 'التّاجِر حَسَّان', x: 6, y: 3 },
    ],

    interactables: [
        { id: 'exit-door', type: 'door', x: 6, y: 9, isExit: true, labelArabic: 'خروج', labelEnglish: 'Exit' },
        { id: 'sign-textile-counter', type: 'sign', x: 6, y: 2, textArabic: 'أَقمِشَة فاخِرَة', textEnglish: 'Fine Textiles' },
        { id: 'crate-textile-1', type: 'crate', x: 3, y: 3, labelArabic: 'صندوق', labelEnglish: 'Silk Crate', descriptionEnglish: 'A crate of imported Chinese silk, soft to the touch and richly dyed.', vocabWordId: 'customer_w40', vocabCategory: 'trade', repeatable: true },
        { id: 'barrel-textile-1', type: 'barrel', x: 9, y: 4, labelArabic: 'برميل', labelEnglish: 'Dye Barrel', descriptionEnglish: 'A barrel of indigo dye, staining the wood a deep blue.', vocabWordId: 'sandals_w3', vocabCategory: 'clothing', repeatable: true },
        { id: 'painting-textile-1', type: 'painting', x: 3, y: 7, labelArabic: 'لوحة', labelEnglish: 'Pattern Display', descriptionEnglish: 'A sample board showing intricate weaving patterns available for order.', vocabWordId: 'quality_w41', vocabCategory: 'trade', repeatable: true },
    ],
};

export const market_warehouse_interior = {
    id: 'market_warehouse_interior',
    name: 'Warehouse',
    nameArabic: 'المَخزَن',
    zone: 'desert_marketplace',
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
        { id: 'chest-warehouse-1', type: 'chest', x: 2, y: 1, minDirhams: 20, maxDirhams: 60 },
        { id: 'chest-warehouse-2', type: 'chest', x: 11, y: 1, minDirhams: 25, maxDirhams: 70 },
        { id: 'barrel-warehouse-1', type: 'barrel', x: 4, y: 4, labelArabic: 'برميل', labelEnglish: 'Trade Barrel', descriptionEnglish: 'A heavy barrel of olive oil ready for export to the coastal port.', vocabWordId: 'trade_w42', vocabCategory: 'trade', repeatable: true },
        { id: 'crate-warehouse-1', type: 'crate', x: 9, y: 4, labelArabic: 'صندوق', labelEnglish: 'Goods Crate', descriptionEnglish: 'A crate packed with textiles and spices for the next trade caravan.', vocabWordId: 'caravan_w43', vocabCategory: 'trade', loot: { type: 'dirhams', min: 8, max: 20 }, repeatable: false, stateChange: 'inspected' },
    ],
};
