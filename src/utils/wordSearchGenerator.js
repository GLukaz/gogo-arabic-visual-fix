/**
 * Word Search Grid Generator
 *
 * Generates NxN grids for Arabic word search puzzles.
 * Supports RTL horizontal and vertical word placement.
 */

// Common Arabic letters for filling empty cells
const ARABIC_LETTERS = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن',
  'ه', 'و', 'ي'
];

/**
 * Normalize Arabic word (remove diacritics)
 * @param {string} word - Arabic word
 * @returns {string} Normalized word
 */
function normalizeArabic(word) {
  return word
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove diacritics
    .replace(/\s/g, '') // Remove spaces
    .trim();
}

/**
 * Get random Arabic letter
 * @returns {string} Random letter
 */
function getRandomLetter() {
  return ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
}

/**
 * Check if word can fit horizontally (RTL) at position
 * @param {Array<Array<string>>} grid - Current grid
 * @param {string} word - Word to place
 * @param {number} row - Row index
 * @param {number} col - Column index (starting position, word goes left)
 * @returns {boolean} True if word fits
 */
function canFitHorizontal(grid, word, row, col) {
  const letters = word.split('');

  // Check if word extends beyond left boundary (RTL)
  if (col - letters.length + 1 < 0) return false;

  // Check each position
  for (let i = 0; i < letters.length; i++) {
    const c = col - i; // RTL: move left
    const cell = grid[row][c];
    // Cell must be empty or match the letter
    if (cell !== '' && cell !== letters[i]) return false;
  }

  return true;
}

/**
 * Check if word can fit vertically at position
 * @param {Array<Array<string>>} grid - Current grid
 * @param {string} word - Word to place
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} True if word fits
 */
function canFitVertical(grid, word, row, col) {
  const letters = word.split('');
  const size = grid.length;

  // Check if word extends beyond bottom boundary
  if (row + letters.length > size) return false;

  // Check each position
  for (let i = 0; i < letters.length; i++) {
    const r = row + i;
    const cell = grid[r][col];
    // Cell must be empty or match the letter
    if (cell !== '' && cell !== letters[i]) return false;
  }

  return true;
}

/**
 * Place word horizontally (RTL) in grid
 * @param {Array<Array<string>>} grid - Grid to modify
 * @param {string} word - Word to place
 * @param {number} row - Row index
 * @param {number} col - Starting column (rightmost position)
 */
function placeHorizontal(grid, word, row, col) {
  const letters = word.split('');
  for (let i = 0; i < letters.length; i++) {
    grid[row][col - i] = letters[i];
  }
}

/**
 * Place word vertically in grid
 * @param {Array<Array<string>>} grid - Grid to modify
 * @param {string} word - Word to place
 * @param {number} row - Starting row
 * @param {number} col - Column index
 */
function placeVertical(grid, word, row, col) {
  const letters = word.split('');
  for (let i = 0; i < letters.length; i++) {
    grid[row + i][col] = letters[i];
  }
}

/**
 * Try to place a word in the grid
 * @param {Array<Array<string>>} grid - Current grid
 * @param {string} word - Word to place
 * @param {number} maxAttempts - Maximum placement attempts
 * @returns {Object|null} Placement info or null if failed
 */
function tryPlaceWord(grid, word, maxAttempts = 100) {
  const size = grid.length;
  const letters = word.split('');

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Random direction: 0 = horizontal (RTL), 1 = vertical
    const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

    if (direction === 'horizontal') {
      const row = Math.floor(Math.random() * size);
      // For RTL, start from right side (ensure word fits)
      const col = letters.length - 1 + Math.floor(Math.random() * (size - letters.length + 1));

      if (canFitHorizontal(grid, word, row, col)) {
        placeHorizontal(grid, word, row, col);
        return {
          word,
          direction: 'horizontal',
          startRow: row,
          startCol: col,
          endRow: row,
          endCol: col - letters.length + 1,
        };
      }
    } else {
      const row = Math.floor(Math.random() * (size - letters.length + 1));
      const col = Math.floor(Math.random() * size);

      if (canFitVertical(grid, word, row, col)) {
        placeVertical(grid, word, row, col);
        return {
          word,
          direction: 'vertical',
          startRow: row,
          startCol: col,
          endRow: row + letters.length - 1,
          endCol: col,
        };
      }
    }
  }

  return null; // Failed to place word
}

/**
 * Generate a word search puzzle
 * @param {Array<string>} words - Array of Arabic words to hide
 * @param {number} size - Grid size (NxN)
 * @returns {Object} { grid: string[][], wordPositions: Array, success: boolean }
 */
export function generateWordSearch(words, size = 10) {
  // Initialize empty grid
  const grid = Array(size).fill(null).map(() => Array(size).fill(''));

  // Normalize and filter words
  const normalizedWords = words
    .map(normalizeArabic)
    .filter(w => w.length > 1 && w.length <= size);

  // Track successfully placed words
  const wordPositions = [];

  // Try to place each word
  for (const word of normalizedWords) {
    const placement = tryPlaceWord(grid, word);
    if (placement) {
      wordPositions.push(placement);
    }
  }

  // Fill remaining empty cells with random letters
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = getRandomLetter();
      }
    }
  }

  return {
    grid,
    wordPositions,
    success: wordPositions.length === normalizedWords.length,
    placedCount: wordPositions.length,
    totalCount: normalizedWords.length,
  };
}

/**
 * Check if a selection matches any word position
 * @param {Object} selection - { startRow, startCol, endRow, endCol }
 * @param {Array} wordPositions - Array of word positions
 * @returns {Object|null} Matched word position or null
 */
export function checkSelection(selection, wordPositions) {
  const { startRow, startCol, endRow, endCol } = selection;

  for (const position of wordPositions) {
    // Check both forward and backward matches
    const forwardMatch = (
      position.startRow === startRow &&
      position.startCol === startCol &&
      position.endRow === endRow &&
      position.endCol === endCol
    );

    const backwardMatch = (
      position.startRow === endRow &&
      position.startCol === endCol &&
      position.endRow === startRow &&
      position.endCol === startCol
    );

    if (forwardMatch || backwardMatch) {
      return position;
    }
  }

  return null;
}

/**
 * Get cells in a selection
 * @param {Object} selection - { startRow, startCol, endRow, endCol }
 * @returns {Array} Array of { row, col } cells
 */
export function getSelectionCells(selection) {
  const { startRow, startCol, endRow, endCol } = selection;
  const cells = [];

  // Horizontal selection
  if (startRow === endRow) {
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    for (let col = minCol; col <= maxCol; col++) {
      cells.push({ row: startRow, col });
    }
  }
  // Vertical selection
  else if (startCol === endCol) {
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    for (let row = minRow; row <= maxRow; row++) {
      cells.push({ row, col: startCol });
    }
  }

  return cells;
}
