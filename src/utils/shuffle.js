/**
 * Fisher-Yates shuffle — returns a new array with elements in random order.
 * Does NOT mutate the input array.
 *
 * @param {Array} array - The array to shuffle.
 * @returns {Array} A new shuffled copy of the input array.
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
