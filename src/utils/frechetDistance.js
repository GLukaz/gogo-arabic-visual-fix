/**
 * frechetDistance.js — Pure utility module for discrete Frechet distance scoring.
 *
 * Used by CalligraphyScene to compare a player's drawn stroke path against
 * a reference stroke path stored in calligraphyPaths.json.
 *
 * Both exported functions are pure (no side effects, no imports).
 */

/**
 * Resample a path of {x, y} points to a fixed number of evenly-spaced points.
 *
 * Uses cumulative arc-length parameterization and linear interpolation so the
 * resampled path preserves shape regardless of how fast or slow the original
 * points were captured.
 *
 * @param {Array<{x: number, y: number}>} path - Input path (any length).
 * @param {number} [targetCount=64] - Desired number of output points.
 * @returns {Array<{x: number, y: number}>} Resampled path of exactly targetCount points.
 */
export function resamplePath(path, targetCount = 64) {
  if (!path || path.length === 0) return [];
  if (path.length === 1) {
    return Array.from({ length: targetCount }, () => ({ x: path[0].x, y: path[0].y }));
  }

  // Compute cumulative arc-lengths
  const lengths = [0];
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const totalLength = lengths[lengths.length - 1];

  if (totalLength === 0) {
    // All points are the same — return targetCount copies
    return Array.from({ length: targetCount }, () => ({ x: path[0].x, y: path[0].y }));
  }

  const resampled = [];
  for (let k = 0; k < targetCount; k++) {
    const target = (k / (targetCount - 1)) * totalLength;

    // Find the segment containing `target`
    let i = lengths.findIndex((l) => l >= target);

    if (i <= 0) {
      resampled.push({ x: path[0].x, y: path[0].y });
      continue;
    }
    if (i >= path.length) {
      resampled.push({ x: path[path.length - 1].x, y: path[path.length - 1].y });
      continue;
    }

    const segLen = lengths[i] - lengths[i - 1];
    const t = segLen === 0 ? 0 : (target - lengths[i - 1]) / segLen;
    resampled.push({
      x: path[i - 1].x + t * (path[i].x - path[i - 1].x),
      y: path[i - 1].y + t * (path[i].y - path[i - 1].y),
    });
  }
  return resampled;
}

/**
 * Compute the discrete Fréchet distance between two paths P and Q.
 *
 * O(m*n) dynamic programming algorithm. Both paths are arrays of {x, y}.
 * Uses a flat Float32Array for the memoization table to minimize GC pressure.
 *
 * The discrete Fréchet distance measures the minimum "leash length" needed
 * for a person (P) and a dog (Q) to walk their respective paths simultaneously —
 * it captures path shape without being confused by drawing speed.
 *
 * @param {Array<{x: number, y: number}>} P - First path.
 * @param {Array<{x: number, y: number}>} Q - Second path.
 * @returns {number} Fréchet distance (lower = more similar). Returns Infinity for empty paths.
 */
export function discreteFrechetDistance(P, Q) {
  const m = P.length;
  const n = Q.length;
  if (m === 0 || n === 0) return Infinity;

  // Flat memoization table; -1 means "not yet computed"
  const ca = new Float32Array(m * n).fill(-1);
  const idx = (i, j) => i * n + j;

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function c(i, j) {
    const cell = idx(i, j);
    if (ca[cell] >= 0) return ca[cell];

    const d = dist(P[i], Q[j]);
    let result;

    if (i === 0 && j === 0) {
      result = d;
    } else if (i === 0) {
      result = Math.max(c(0, j - 1), d);
    } else if (j === 0) {
      result = Math.max(c(i - 1, 0), d);
    } else {
      result = Math.max(Math.min(c(i - 1, j), c(i - 1, j - 1), c(i, j - 1)), d);
    }

    ca[cell] = result;
    return result;
  }

  return c(m - 1, n - 1);
}
