/**
 * pricingAgent.js — Dynamic supply/demand pricing (Phase 54 ECON-01..03)
 *
 * Pure functions — no class, no Redux imports, no side effects.
 * All state lives in economySlice.supplyLevels; this module only computes.
 */

/**
 * ECON-01: Calculate final item price based on supply and faction modifier.
 *
 * Formula: price = base * (maxSupply / currentSupply) * factionModifier
 * Floor:   50% of base  (prices never drop below half of original)
 * Ceiling: 200% of base (prices never exceed double of original)
 *
 * @param {number} basePrice        - Original un-modified item price in dirhams
 * @param {{ current: number, max: number }} supply - Supply levels for this item
 * @param {number} [factionModifier=1.0] - Multiplier from getFactionModifier()
 * @returns {{ price: number, outOfStock: boolean }}
 */
export function calculateDynamicPrice(basePrice, supply, factionModifier = 1.0) {
  const safeCurrent = Math.max(1, supply.current);
  const supplyRatio = supply.max / safeCurrent;
  const raw = Math.round(basePrice * supplyRatio * factionModifier);
  const floor = Math.round(basePrice * 0.5);
  const ceiling = Math.round(basePrice * 2.0);
  return {
    price: Math.max(floor, Math.min(ceiling, raw)),
    outOfStock: supply.current === 0,
  };
}

/**
 * ECON-03: Derive faction price modifier from alignment score.
 *
 * - Allied  (score >= 75): 0.85  → 15% discount
 * - Hostile (score <= 10): 1.15  → 15% markup
 * - Neutral (11–74):       1.0   → no modifier
 *
 * @param {string|null} shopFaction      - Faction ID that owns this shop (or null)
 * @param {Object} factionAlignment      - { [factionId]: number } alignment scores
 * @returns {number}
 */
export function getFactionModifier(shopFaction, factionAlignment) {
  if (!shopFaction) return 1.0;
  const score = factionAlignment[shopFaction] ?? 50;
  if (score >= 75) return 0.85;  // Allied: 15% discount
  if (score <= 10) return 1.15;  // Hostile: 15% markup
  return 1.0;                    // Neutral: no modifier
}

/**
 * Default supply pool sizes by item rarity.
 * Used by ShopOverlay to seed initSupply on first open.
 */
export const SUPPLY_DEFAULTS = {
  common:    { max: 10 },
  uncommon:  { max: 7 },
  rare:      { max: 5 },
  epic:      { max: 3 },
  legendary: { max: 2 },
};
