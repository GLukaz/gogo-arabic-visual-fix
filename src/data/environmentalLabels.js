/**
 * Environmental Arabic labels for world objects.
 * IMM-03: Floating Arabic text above interactable objects teaches vocabulary passively.
 */

export const ENVIRONMENTAL_LABELS = [
  // === OASIS VILLAGE (8 objects) ===
  { interactableId: 'fountain-oasis-1', zone: 'oasis_village', arabic: 'نافورَة', english: 'Fountain', transliteration: 'nafoora', vocabWordId: 'ahlan', type: 'fountain' },
  { interactableId: 'lantern-oasis-1', zone: 'oasis_village', arabic: 'فانوس', english: 'Lantern', transliteration: 'faanoos', vocabWordId: 'marhaba', type: 'lantern' },
  { interactableId: 'lantern-oasis-2', zone: 'oasis_village', arabic: 'فانوس', english: 'Lantern', transliteration: 'faanoos', vocabWordId: 'salaam', type: 'lantern' },
  { interactableId: 'statue-oasis-1', zone: 'oasis_village', arabic: 'تِمثال', english: 'Statue', transliteration: 'timthaal', vocabWordId: 'ustadh', type: 'statue' },
  { interactableId: 'stall-oasis-1', zone: 'oasis_village', arabic: 'دُكّان', english: 'Shop', transliteration: 'dukkaan', vocabWordId: 'shop_w28', type: 'stall' },
  { interactableId: 'barrel-oasis-1', zone: 'oasis_village', arabic: 'بِرميل', english: 'Barrel', transliteration: 'barmeel', vocabWordId: 'sadeeq', type: 'barrel' },
  { interactableId: 'pot-oasis-1', zone: 'oasis_village', arabic: 'قِدر', english: 'Pot', transliteration: 'qidr', vocabWordId: 'price_w29', type: 'pot' },
  { interactableId: 'crate-oasis-1', zone: 'oasis_village', arabic: 'صُندوق', english: 'Crate', transliteration: 'sunduuq', vocabWordId: 'tayyib', type: 'crate' },

  // === ANCIENT LIBRARY (8 objects) ===
  { interactableId: 'fountain-library-1', zone: 'ancient_library', arabic: 'نافورَة', english: 'Fountain', transliteration: 'nafoora', vocabWordId: 'how_are_you_1', type: 'fountain' },
  { interactableId: 'statue-library-1', zone: 'ancient_library', arabic: 'تِمثال', english: 'Statue', transliteration: 'timthaal', vocabWordId: 'num_7', type: 'statue' },
  { interactableId: 'statue-library-2', zone: 'ancient_library', arabic: 'تِمثال', english: 'Statue', transliteration: 'timthaal', vocabWordId: 'num_10', type: 'statue' },
  { interactableId: 'painting-library-1', zone: 'ancient_library', arabic: 'لَوحَة', english: 'Painting', transliteration: 'lawha', vocabWordId: 'color_blue', type: 'painting' },
  { interactableId: 'painting-library-2', zone: 'ancient_library', arabic: 'لَوحَة', english: 'Painting', transliteration: 'lawha', vocabWordId: 'please_1', type: 'painting' },
  { interactableId: 'lantern-library-1', zone: 'ancient_library', arabic: 'فانوس', english: 'Lantern', transliteration: 'faanoos', vocabWordId: 'num_3', type: 'lantern' },
  { interactableId: 'lantern-library-2', zone: 'ancient_library', arabic: 'فانوس', english: 'Lantern', transliteration: 'faanoos', vocabWordId: 'num_5', type: 'lantern' },
  { interactableId: 'barrel-library-1', zone: 'ancient_library', arabic: 'بِرميل', english: 'Barrel', transliteration: 'barmeel', vocabWordId: 'color_black', type: 'barrel' },

  // === DESERT MARKETPLACE (8 objects) ===
  { interactableId: 'fountain-market-1', zone: 'desert_marketplace', arabic: 'نافورَة', english: 'Fountain', transliteration: 'nafoora', vocabWordId: 'market_w31', type: 'fountain' },
  { interactableId: 'stall-market-1', zone: 'desert_marketplace', arabic: 'دُكّان', english: 'Fruit Stall', transliteration: 'dukkaan', vocabWordId: 'fruit_1', type: 'stall' },
  { interactableId: 'stall-market-2', zone: 'desert_marketplace', arabic: 'دُكّان', english: 'Jewellery', transliteration: 'dukkaan', vocabWordId: 'gold_w32', type: 'stall' },
  { interactableId: 'stall-market-3', zone: 'desert_marketplace', arabic: 'دُكّان', english: 'Pottery', transliteration: 'dukkaan', vocabWordId: 'num_4', type: 'stall' },
  { interactableId: 'stall-market-4', zone: 'desert_marketplace', arabic: 'دُكّان', english: 'Cloth Stall', transliteration: 'dukkaan', vocabWordId: 'sell_w33', type: 'stall' },
  { interactableId: 'barrel-market-1', zone: 'desert_marketplace', arabic: 'بِرميل', english: 'Barrel', transliteration: 'barmeel', vocabWordId: 'salt_1', type: 'barrel' },
  { interactableId: 'barrel-market-2', zone: 'desert_marketplace', arabic: 'بِرميل', english: 'Barrel', transliteration: 'barmeel', vocabWordId: 'oil_1', type: 'barrel' },
  { interactableId: 'barrel-market-3', zone: 'desert_marketplace', arabic: 'بِرميل', english: 'Barrel', transliteration: 'barmeel', vocabWordId: 'bread_1', type: 'barrel' },

  // === FARMLAND (8 objects) ===
  { interactableId: 'pot-farm-1', zone: 'farmland', arabic: 'قِدر', english: 'Cooking Pot', transliteration: 'qidr', vocabWordId: 'flower_w26', type: 'pot' },
  { interactableId: 'pot-farm-2', zone: 'farmland', arabic: 'قِدر', english: 'Herb Pot', transliteration: 'qidr', vocabWordId: 'earth_w22', type: 'pot' },
  { interactableId: 'pot-farm-3', zone: 'farmland', arabic: 'قِدر', english: 'Seed Pot', transliteration: 'qidr', vocabWordId: 'tree_w27', type: 'pot' },
  { interactableId: 'barrel-farm-1', zone: 'farmland', arabic: 'بِرميل', english: 'Barrel', transliteration: 'barmeel', vocabWordId: 'sun_w19', type: 'barrel' },
  { interactableId: 'barrel-farm-2', zone: 'farmland', arabic: 'بِرميل', english: 'Barrel', transliteration: 'barmeel', vocabWordId: 'water_w13', type: 'barrel' },
  { interactableId: 'statue-farm-1', zone: 'farmland', arabic: 'تِمثال', english: 'Statue', transliteration: 'timthaal', vocabWordId: 'camel_1', type: 'statue' },
  { interactableId: 'fountain-farm-1', zone: 'farmland', arabic: 'نافورَة', english: 'Fountain', transliteration: 'nafoora', vocabWordId: 'river_w15', type: 'fountain' },
  { interactableId: 'lantern-farm-1', zone: 'farmland', arabic: 'فانوس', english: 'Lantern', transliteration: 'faanoos', vocabWordId: 'moon_w20', type: 'lantern' },
];

export const getLabelsForZone = (zoneId) =>
  ENVIRONMENTAL_LABELS.filter((l) => l.zone === zoneId);
