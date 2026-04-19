import { SAND, GRASS, WATER } from '../../zones.js';

/**
 * Small house (10x8) — stone floor (SAND), carpet area (GRASS) in center.
 */
export function buildSmallHouse(W = 10, H = 8) {
    const m = [];
    for (let y = 0; y < H; y++) {
        const row = [];
        for (let x = 0; x < W; x++) {
            let tile = SAND;
            // Carpet area in center
            if (x >= 3 && x <= W - 4 && y >= 2 && y <= H - 3) tile = GRASS;
            row.push(tile);
        }
        m.push(row);
    }
    return m;
}

/**
 * Large house (14x10) — stone floor with two carpet areas.
 */
export function buildLargeHouse(W = 14, H = 10) {
    const m = [];
    for (let y = 0; y < H; y++) {
        const row = [];
        for (let x = 0; x < W; x++) {
            let tile = SAND;
            // Left carpet area
            if (x >= 2 && x <= 5 && y >= 2 && y <= H - 3) tile = GRASS;
            // Right carpet area
            if (x >= 8 && x <= 11 && y >= 2 && y <= H - 3) tile = GRASS;
            row.push(tile);
        }
        m.push(row);
    }
    return m;
}

/**
 * Shop (12x10) — counter area at top (GRASS strip at y=2).
 */
export function buildShop(W = 12, H = 10) {
    const m = [];
    for (let y = 0; y < H; y++) {
        const row = [];
        for (let x = 0; x < W; x++) {
            let tile = SAND;
            // Counter strip at top
            if (y === 2 && x >= 2 && x <= W - 3) tile = GRASS;
            // Display area behind counter
            if (y >= 3 && y <= 4 && x >= 2 && x <= W - 3) tile = GRASS;
            row.push(tile);
        }
        m.push(row);
    }
    return m;
}

/**
 * Library room (16x12) — reading area (GRASS) in center.
 */
export function buildLibraryRoom(W = 16, H = 12) {
    const m = [];
    for (let y = 0; y < H; y++) {
        const row = [];
        for (let x = 0; x < W; x++) {
            let tile = SAND;
            // Central reading area
            if (x >= 4 && x <= W - 5 && y >= 3 && y <= H - 4) tile = GRASS;
            row.push(tile);
        }
        m.push(row);
    }
    return m;
}

/**
 * Mosque (18x14) — prayer area (GRASS), ablution area (WATER corner).
 */
export function buildMosque(W = 18, H = 14) {
    const m = [];
    for (let y = 0; y < H; y++) {
        const row = [];
        for (let x = 0; x < W; x++) {
            let tile = SAND;
            // Prayer area (large central GRASS)
            if (x >= 3 && x <= W - 4 && y >= 2 && y <= H - 4) tile = GRASS;
            // Ablution area (WATER in bottom-right corner)
            if (x >= W - 5 && x <= W - 2 && y >= H - 4 && y <= H - 2) tile = WATER;
            row.push(tile);
        }
        m.push(row);
    }
    return m;
}
