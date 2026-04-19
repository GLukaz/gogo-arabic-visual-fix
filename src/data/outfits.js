/**
 * Outfit data for the wardrobe system
 * Each outfit represents a different body sprite that can be equipped by the player
 *
 * Properties:
 * - id: Unique identifier matching the body spritesheet filename (e.g., 'simple-thobe' → 'body-simple-thobe.png')
 * - name: English display name
 * - nameArabic: Arabic display name
 * - price: Cost in dirhams (0 = default/free)
 * - description: Short description of the outfit
 * - rarity: Rarity tier ('common', 'uncommon', 'rare', 'legendary')
 * - unlocked: Whether the outfit is unlocked by default (only for starter outfit)
 * - unlockLevel: Optional minimum level required to purchase
 * - icon: Emoji placeholder for visual representation (until sprite assets are ready)
 */

export const OUTFITS = [
  {
    id: 'simple-thobe',
    name: 'Simple Thobe',
    nameArabic: 'ثوب بسيط',
    price: 0,
    description: 'Basic white thobe, perfect for beginners',
    rarity: 'common',
    unlocked: true,
    icon: '👕',
  },
  {
    id: 'desert-warrior',
    name: 'Desert Warrior',
    nameArabic: 'محارب الصحراء',
    price: 500,
    description: 'Battle-worn desert armor for brave adventurers',
    rarity: 'rare',
    unlockLevel: 5,
    icon: '⚔️',
  },
  {
    id: 'scholar-robe',
    name: "Scholar's Robe",
    nameArabic: 'رداء العالم',
    price: 300,
    description: 'Elegant scholarly attire for the studious',
    rarity: 'uncommon',
    unlockLevel: 3,
    icon: '📚',
  },
  {
    id: 'merchant-garb',
    name: 'Merchant Garb',
    nameArabic: 'زي التاجر',
    price: 400,
    description: 'Fine trading clothes adorned with gold',
    rarity: 'uncommon',
    unlockLevel: 4,
    icon: '💰',
  },
  {
    id: 'royal-kaftan',
    name: 'Royal Kaftan',
    nameArabic: 'قفطان ملكي',
    price: 1000,
    description: 'Majestic royal attire fit for a sultan',
    rarity: 'legendary',
    unlockLevel: 10,
    icon: '👑',
  },
  {
    id: 'nomad-cloak',
    name: 'Nomad Cloak',
    nameArabic: 'عباءة البدوي',
    price: 250,
    description: 'Weathered traveling cloak of the desert nomads',
    rarity: 'common',
    unlockLevel: 2,
    icon: '🧥',
  },
  {
    id: 'mystic-robe',
    name: 'Mystic Robe',
    nameArabic: 'رداء الصوفي',
    price: 600,
    description: 'Mysterious robes worn by desert mystics',
    rarity: 'rare',
    unlockLevel: 7,
    icon: '🔮',
  },
  {
    id: 'guard-uniform',
    name: 'Palace Guard',
    nameArabic: 'زي الحارس',
    price: 450,
    description: 'Official uniform of the palace guards',
    rarity: 'uncommon',
    unlockLevel: 6,
    icon: '🛡️',
  },
];

/**
 * Get outfit by ID
 * @param {string} outfitId - Outfit identifier
 * @returns {object|null} Outfit data or null if not found
 */
export function getOutfitById(outfitId) {
  return OUTFITS.find((outfit) => outfit.id === outfitId) || null;
}

/**
 * Get all outfits unlocked for a given player level
 * @param {number} level - Player level
 * @returns {object[]} Array of outfits available at this level
 */
export function getAvailableOutfits(level) {
  return OUTFITS.filter((outfit) => !outfit.unlockLevel || level >= outfit.unlockLevel);
}

/**
 * Get rarity color
 * @param {string} rarity - Rarity tier
 * @returns {string} CSS color value
 */
export function getRarityColor(rarity) {
  const colors = {
    common: '#9e9e9e',
    uncommon: '#2ecc71',
    rare: '#3498db',
    legendary: '#f39c12',
  };
  return colors[rarity] || colors.common;
}
