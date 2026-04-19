import { describe, it, expect } from 'vitest';
import {
  getBuyPrice,
  getSellPrice,
  getTradeProfit,
  getBestSellingZone,
  getCheapestBuyZone,
  getBestTradeRoutes,
  getZonePriceSheet,
} from '../tradeRouteService.js';

describe('tradeRouteService', () => {
  it('calculates buy price with zone multiplier', () => {
    // oasis_village food buy multiplier = 0.7, base = 10
    const price = getBuyPrice('food', 'oasis_village');
    expect(price).toBe(7);
  });

  it('calculates sell price with zone multiplier', () => {
    // oasis_village food sell multiplier = 1.4, base = 10
    const price = getSellPrice('food', 'oasis_village');
    expect(price).toBe(14);
  });

  it('returns 0 for invalid zone or category', () => {
    expect(getBuyPrice('food', 'nonexistent')).toBe(0);
    expect(getSellPrice('nonexistent', 'oasis_village')).toBe(0);
  });

  it('calculates trade profit correctly', () => {
    const trade = getTradeProfit('food', 'farmland', 'oasis_village');
    // farmland buy = 10*0.5 = 5, oasis sell = 10*1.4 = 14
    expect(trade.buyPrice).toBe(5);
    expect(trade.sellPrice).toBe(14);
    expect(trade.profit).toBe(9);
    expect(trade.profitMargin).toBe(180);
  });

  it('getBestSellingZone returns correct zone', () => {
    const best = getBestSellingZone('scrolls');
    expect(best.zone).toBe('ancient_library');
    // base 40 * 1.6 = 64
    expect(best.sellPrice).toBe(64);
  });

  it('getCheapestBuyZone returns correct zone', () => {
    const cheap = getCheapestBuyZone('scrolls');
    expect(cheap.zone).toBe('ancient_library');
    // base 40 * 0.5 = 20
    expect(cheap.buyPrice).toBe(20);
  });

  it('getBestTradeRoutes returns profitable routes sorted DESC', () => {
    const routes = getBestTradeRoutes(3);
    expect(routes.length).toBe(3);
    expect(routes[0].profit).toBeGreaterThanOrEqual(routes[1].profit);
    expect(routes[1].profit).toBeGreaterThanOrEqual(routes[2].profit);
  });

  it('getZonePriceSheet returns all categories', () => {
    const sheet = getZonePriceSheet('oasis_village');
    expect(Object.keys(sheet).length).toBe(10);
    expect(sheet.food).toHaveProperty('buy');
    expect(sheet.food).toHaveProperty('sell');
  });
});
