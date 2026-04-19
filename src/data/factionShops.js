/**
 * factionShops.js — Faction vendor discounts and exclusive shop inventory
 *
 * Each of the 6 factions has a signature shop with 5 exclusive items, unlocked
 * progressively as the player's faction tier increases. Discounts scale with tier.
 *
 * Tier → discount mapping (same across all factions):
 *   Neutral  →  0%
 *   Friendly →  5%
 *   Trusted  → 10%
 *   Allied   → 15%
 *   Revered  → 25%
 *
 * Item availability is cumulative: Trusted players see Neutral + Friendly + Trusted items.
 */

import { FACTION_IDS, getFactionTier } from './factions.js';

// ─── Tier ordering (lowest → highest) ────────────────────────────────────────

export const TIER_ORDER = Object.freeze([
  'Neutral',
  'Friendly',
  'Trusted',
  'Allied',
  'Revered',
]);

// ─── Discount table ───────────────────────────────────────────────────────────

/** Fraction off base price per tier. Same for all factions. */
export const TIER_DISCOUNTS = Object.freeze({
  Neutral:  0,
  Friendly: 0.05,
  Trusted:  0.10,
  Allied:   0.15,
  Revered:  0.25,
});

// ─── Shop definitions ─────────────────────────────────────────────────────────

/**
 * @typedef {Object} FactionShopItem
 * @property {string} id           — unique item ID
 * @property {string} nameArabic   — Arabic item name
 * @property {string} name         — English item name
 * @property {string} type         — item type (tool | book | weapon | gear | consumable)
 * @property {number} price        — base price in gold
 * @property {string} requiredTier — minimum tier label to purchase
 * @property {string} description  — short English description
 */

/** @type {Record<string, { shopId: string, name: string, nameArabic: string, factionId: string, items: FactionShopItem[] }>} */
export const FACTION_SHOP_DATA = Object.freeze({

  // ─── SCHOLARS ────────────────────────────────────────────────────────────────
  [FACTION_IDS.SCHOLARS]: {
    shopId:     'shop_scholars',
    name:       "Scholar's Library",
    nameArabic: 'مكتبة العلماء',
    factionId:  FACTION_IDS.SCHOLARS,
    items: [
      {
        id:           'scholars_parchment_pack',
        nameArabic:   'رزمة الرق',
        name:         'Parchment Pack',
        type:         'consumable',
        price:        50,
        requiredTier: 'Neutral',
        description:  'A bundle of fine parchment for practising calligraphy and note-taking.',
      },
      {
        id:           'scholars_brass_pen',
        nameArabic:   'قلم نحاسي',
        name:         "Scholar's Brass Pen",
        type:         'tool',
        price:        120,
        requiredTier: 'Friendly',
        description:  'A precision brass pen favoured by the Scholars for manuscript copying.',
      },
      {
        id:           'scholars_grammar_tome',
        nameArabic:   'كتاب النحو',
        name:         'Grammar Tome',
        type:         'book',
        price:        250,
        requiredTier: 'Trusted',
        description:  'An authoritative reference on classical Arabic grammar, used in the great libraries.',
      },
      {
        id:           'scholars_calligraphy_set',
        nameArabic:   'طقم الخط العربي',
        name:         'Calligraphy Master Set',
        type:         'tool',
        price:        450,
        requiredTier: 'Allied',
        description:  'Reed pens, ink stones, and blotting cloths used by master calligraphers.',
      },
      {
        id:           'scholars_ancient_codex',
        nameArabic:   'مخطوطة قديمة',
        name:         'Ancient Codex',
        type:         'book',
        price:        900,
        requiredTier: 'Revered',
        description:  'A rare illuminated manuscript containing classical poetry and treatises.',
      },
    ],
  },

  // ─── MERCHANTS ───────────────────────────────────────────────────────────────
  [FACTION_IDS.MERCHANTS]: {
    shopId:     'shop_merchants',
    name:       "Merchant's Bazaar",
    nameArabic: 'بازار التجار',
    factionId:  FACTION_IDS.MERCHANTS,
    items: [
      {
        id:           'merchants_market_pouch',
        nameArabic:   'كيس السوق',
        name:         'Market Pouch',
        type:         'gear',
        price:        40,
        requiredTier: 'Neutral',
        description:  'A sturdy leather pouch for carrying coins and small trade goods.',
      },
      {
        id:           'merchants_bronze_scales',
        nameArabic:   'ميزان التاجر',
        name:         "Merchant's Bronze Scales",
        type:         'tool',
        price:        150,
        requiredTier: 'Friendly',
        description:  'Precision balance scales used by trusted merchants to weigh gold and spices.',
      },
      {
        id:           'merchants_trade_ledger',
        nameArabic:   'دفتر التجارة',
        name:         'Trade Ledger',
        type:         'book',
        price:        280,
        requiredTier: 'Trusted',
        description:  'A bound accounting book for tracking debts, credits, and trade routes.',
      },
      {
        id:           'merchants_spice_collection',
        nameArabic:   'مجموعة البهارات',
        name:         'Rare Spice Collection',
        type:         'consumable',
        price:        500,
        requiredTier: 'Allied',
        description:  'An assortment of rare spices from distant lands — valuable for trade and gifts.',
      },
      {
        id:           'merchants_golden_abacus',
        nameArabic:   'معداد ذهبي',
        name:         'Golden Abacus',
        type:         'tool',
        price:        1000,
        requiredTier: 'Revered',
        description:  'A legendary counting device in gilded ivory — symbol of merchant mastery.',
      },
    ],
  },

  // ─── ARTISANS ────────────────────────────────────────────────────────────────
  [FACTION_IDS.ARTISANS]: {
    shopId:     'shop_artisans',
    name:       "Artisan's Workshop",
    nameArabic: 'ورشة الحرفيين',
    factionId:  FACTION_IDS.ARTISANS,
    items: [
      {
        id:           'artisans_basic_tool_kit',
        nameArabic:   'عدة الأدوات الأساسية',
        name:         'Basic Tool Kit',
        type:         'tool',
        price:        60,
        requiredTier: 'Neutral',
        description:  'A starter set of chisels, awls, and mallets for the aspiring craftsperson.',
      },
      {
        id:           'artisans_apprentice_hammer',
        nameArabic:   'مطرقة الشاگرد',
        name:         "Apprentice's Hammer",
        type:         'tool',
        price:        130,
        requiredTier: 'Friendly',
        description:  'A well-balanced hammer forged under an Artisan master — doubles XP on crafting tasks.',
      },
      {
        id:           'artisans_blueprint_scroll',
        nameArabic:   'مخطط الحرفي',
        name:         "Artisan's Blueprint Scroll",
        type:         'book',
        price:        260,
        requiredTier: 'Trusted',
        description:  'Detailed schematics for advanced crafting recipes unavailable in common shops.',
      },
      {
        id:           'artisans_master_chisel_set',
        nameArabic:   'طقم إزميل الأستاذ',
        name:         "Master's Chisel Set",
        type:         'tool',
        price:        480,
        requiredTier: 'Allied',
        description:  'Seven precision chisels in an engraved case — used for the finest stonework.',
      },
      {
        id:           'artisans_forge_key',
        nameArabic:   'مفتاح الكير الأسطوري',
        name:         'Legendary Forge Key',
        type:         'gear',
        price:        950,
        requiredTier: 'Revered',
        description:  'A ceremonial key granting access to the Artisan Grand Forge and its exclusive recipes.',
      },
    ],
  },

  // ─── TRAVELERS ───────────────────────────────────────────────────────────────
  [FACTION_IDS.TRAVELERS]: {
    shopId:     'shop_travelers',
    name:       "Traveler's Outpost",
    nameArabic: 'محطة المسافرين',
    factionId:  FACTION_IDS.TRAVELERS,
    items: [
      {
        id:           'travelers_waterskin',
        nameArabic:   'قربة ماء',
        name:         'Reinforced Waterskin',
        type:         'gear',
        price:        45,
        requiredTier: 'Neutral',
        description:  'A double-layered leather waterskin that keeps water cool in desert heat.',
      },
      {
        id:           'travelers_compass',
        nameArabic:   'بوصلة النحاس',
        name:         'Brass Compass',
        type:         'tool',
        price:        140,
        requiredTier: 'Friendly',
        description:  'A reliable brass compass crafted in the tradition of Arab navigators.',
      },
      {
        id:           'travelers_detailed_map',
        nameArabic:   'خريطة مفصلة',
        name:         'Detailed Regional Map',
        type:         'book',
        price:        270,
        requiredTier: 'Trusted',
        description:  'Hand-drawn map of the eight zones with marked waypoints and hidden paths.',
      },
      {
        id:           'travelers_sextant',
        nameArabic:   'اسطرلاب المستكشف',
        name:         "Navigator's Sextant",
        type:         'tool',
        price:        490,
        requiredTier: 'Allied',
        description:  'A fine sextant for stellar navigation — unlocks night-travel zone bonuses.',
      },
      {
        id:           'travelers_star_chart_collection',
        nameArabic:   'مجموعة خرائط النجوم',
        name:         'Star Chart Collection',
        type:         'book',
        price:        980,
        requiredTier: 'Revered',
        description:  'Twelve celestial charts mapping the night sky over the Arabic-speaking world.',
      },
    ],
  },

  // ─── GUARDIANS ───────────────────────────────────────────────────────────────
  [FACTION_IDS.GUARDIANS]: {
    shopId:     'shop_guardians',
    name:       "Guardian's Armory",
    nameArabic: 'مخزن أسلحة الحراس',
    factionId:  FACTION_IDS.GUARDIANS,
    items: [
      {
        id:           'guardians_insignia',
        nameArabic:   'شارة الحارس',
        name:         "Guardian's Insignia",
        type:         'gear',
        price:        55,
        requiredTier: 'Neutral',
        description:  'A bronze badge marking the wearer as a friend of the Guardians.',
      },
      {
        id:           'guardians_sword_belt',
        nameArabic:   'حزام السيف الفولاذي',
        name:         'Steel Sword Belt',
        type:         'gear',
        price:        160,
        requiredTier: 'Friendly',
        description:  'A reinforced leather belt with steel fittings for carrying a blade safely.',
      },
      {
        id:           'guardians_chain_mail',
        nameArabic:   'درع حلق',
        name:         'Chain Mail Shirt',
        type:         'weapon',
        price:        300,
        requiredTier: 'Trusted',
        description:  'Interlocked steel rings forming a flexible defensive shirt — light but effective.',
      },
      {
        id:           'guardians_shield',
        nameArabic:   'درع الحارس',
        name:         "Guardian's Kite Shield",
        type:         'weapon',
        price:        520,
        requiredTier: 'Allied',
        description:  'A large decorated shield bearing the Guardian crest — grants extra defense in battle quizzes.',
      },
      {
        id:           'guardians_defenders_blade',
        nameArabic:   'سيف المدافع',
        name:         "Defender's Blade",
        type:         'weapon',
        price:        1100,
        requiredTier: 'Revered',
        description:  'A ceremonial sword engraved with Quranic verses — the highest honour from the Guardians.',
      },
    ],
  },

  // ─── ARTISTS ─────────────────────────────────────────────────────────────────
  [FACTION_IDS.ARTISTS]: {
    shopId:     'shop_artists',
    name:       "Artist's Atelier",
    nameArabic: 'أتيليه الفنانين',
    factionId:  FACTION_IDS.ARTISTS,
    items: [
      {
        id:           'artists_poets_inkwell',
        nameArabic:   'محبرة الشاعر',
        name:         "Poet's Inkwell",
        type:         'consumable',
        price:        35,
        requiredTier: 'Neutral',
        description:  'A small ceramic inkwell filled with deep-black ink favoured by poets.',
      },
      {
        id:           'artists_oud_pick_set',
        nameArabic:   'ريشات العود',
        name:         'Oud Pick Set',
        type:         'tool',
        price:        110,
        requiredTier: 'Friendly',
        description:  'Tortoiseshell and horn picks for playing the oud — beloved by Artists.',
      },
      {
        id:           'artists_performance_mask',
        nameArabic:   'قناع الأداء',
        name:         'Performance Mask',
        type:         'gear',
        price:        240,
        requiredTier: 'Trusted',
        description:  'A hand-painted mask worn during storytelling performances and shadow plays.',
      },
      {
        id:           'artists_poetry_scroll',
        nameArabic:   'قصيدة الأستاذ',
        name:         "Master Poet's Scroll",
        type:         'book',
        price:        470,
        requiredTier: 'Allied',
        description:  'A silk-bound scroll containing classical odes in praise of the Arabic language.',
      },
      {
        id:           'artists_golden_oud',
        nameArabic:   'عود ذهبي',
        name:         'Golden Oud',
        type:         'tool',
        price:        1200,
        requiredTier: 'Revered',
        description:  'A masterwork oud with gold-inlaid pegs — the crowning instrument of the Artists.',
      },
    ],
  },
});

// ─── Pure functions ───────────────────────────────────────────────────────────

/**
 * getFactionDiscount — returns the fractional discount for a player's current tier.
 * Discount is the same across all factions.
 *
 * @param {string} factionId  — one of FACTION_IDS values (unused in v1 — same rates for all)
 * @param {string} playerTier — tier label: 'Neutral' | 'Friendly' | 'Trusted' | 'Allied' | 'Revered'
 * @returns {number} fraction off base price (0.0 – 0.25)
 */
export function getFactionDiscount(factionId, playerTier) {
  return TIER_DISCOUNTS[playerTier] ?? 0;
}

/**
 * getShopInventory — returns cumulative items available for the player's tier.
 * Items are additive: Trusted players also see Neutral and Friendly items.
 *
 * @param {string} factionId  — one of FACTION_IDS values
 * @param {string} playerTier — tier label string
 * @returns {FactionShopItem[]} available items (empty array for unknown factionId/tier)
 */
export function getShopInventory(factionId, playerTier) {
  const shop = FACTION_SHOP_DATA[factionId];
  if (!shop) return [];

  const tierIndex = TIER_ORDER.indexOf(playerTier);
  if (tierIndex === -1) return [];

  return shop.items.filter((item) => {
    const itemTierIndex = TIER_ORDER.indexOf(item.requiredTier);
    return itemTierIndex !== -1 && itemTierIndex <= tierIndex;
  });
}

/**
 * applyFactionDiscount — computes the discounted price for an item.
 * Reads faction alignment score from playerState (Redux state shape).
 *
 * @param {number} basePrice    — undiscounted price
 * @param {string} factionId    — one of FACTION_IDS values
 * @param {Object} playerState  — Redux state (must have state.faction.alignment)
 * @returns {number} discounted price (floored to integer gold)
 */
export function applyFactionDiscount(basePrice, factionId, playerState) {
  const score    = playerState?.faction?.alignment?.[factionId] ?? 0;
  const tier     = getFactionTier(score);
  const discount = getFactionDiscount(factionId, tier.label);
  return Math.floor(basePrice * (1 - discount));
}

/**
 * selectAvailableFactionShops — returns all shops where the player has Friendly+ standing.
 * (Friendly is the first tier that unlocks exclusive inventory access.)
 *
 * @param {Object} state — Redux state (must have state.faction.alignment)
 * @returns {{ shopId: string, factionId: string, name: string, nameArabic: string, playerTier: string }[]}
 */
export function selectAvailableFactionShops(state) {
  const alignment = state?.faction?.alignment ?? {};
  const friendlyIndex = TIER_ORDER.indexOf('Friendly');

  return Object.values(FACTION_SHOP_DATA)
    .filter((shop) => {
      const score      = alignment[shop.factionId] ?? 0;
      const tier       = getFactionTier(score);
      const tierIndex  = TIER_ORDER.indexOf(tier.label);
      return tierIndex >= friendlyIndex;
    })
    .map((shop) => {
      const score = alignment[shop.factionId] ?? 0;
      const tier  = getFactionTier(score);
      return {
        shopId:     shop.shopId,
        factionId:  shop.factionId,
        name:       shop.name,
        nameArabic: shop.nameArabic,
        playerTier: tier.label,
      };
    });
}
