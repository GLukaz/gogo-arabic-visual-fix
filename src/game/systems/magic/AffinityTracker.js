/**
 * AffinityTracker.js — Pure utility class for affinity analysis
 *
 * Provides read-only analysis functions for elemental affinity progression.
 * The actual state mutation happens in magicSlice's recordAffinityChoice reducer.
 *
 * No Phaser dependency — just static analysis methods.
 */

export class AffinityTracker {
  /**
   * Get affinity progress summary
   * @param {Object} state - Redux state
   * @returns {Object} Progress summary
   */
  static getAffinityProgress(state) {
    const affinity = state.magic.affinity;

    // Compute element distribution
    const elementDistribution = {};
    affinity.discoveryChoices.forEach((choice) => {
      if (!elementDistribution[choice.element]) {
        elementDistribution[choice.element] = 0;
      }
      elementDistribution[choice.element] += choice.weight;
    });

    // Calculate progress
    const choiceCount = affinity.choiceCount;
    const choicesNeeded = 50;
    const percentComplete = Math.min(100, Math.floor((choiceCount / choicesNeeded) * 100));
    const isLocked = affinity.primary !== null;

    return {
      choiceCount,
      choicesNeeded,
      percentComplete,
      elementDistribution,
      isLocked,
    };
  }

  /**
   * Get top elements by weighted total
   * @param {Object} state - Redux state
   * @returns {Array} Sorted array of { element, totalWeight }
   */
  static getTopElements(state) {
    const affinity = state.magic.affinity;

    // Aggregate weights
    const histogram = {};
    affinity.discoveryChoices.forEach((choice) => {
      if (!histogram[choice.element]) {
        histogram[choice.element] = 0;
      }
      histogram[choice.element] += choice.weight;
    });

    // Sort by total weight
    const sorted = Object.entries(histogram)
      .map(([element, totalWeight]) => ({ element, totalWeight }))
      .sort((a, b) => b.totalWeight - a.totalWeight);

    return sorted;
  }

  /**
   * Predict affinity before it locks (useful for UI preview)
   * @param {Object} state - Redux state
   * @returns {Object} Prediction with confidence
   */
  static predictAffinity(state) {
    const topElements = AffinityTracker.getTopElements(state);

    if (topElements.length === 0) {
      return {
        predictedPrimary: null,
        predictedSecondary: null,
        confidence: 0,
      };
    }

    const predictedPrimary = topElements[0].element;
    const predictedSecondary = topElements.length >= 2 ? topElements[1].element : null;

    // Confidence: ratio of top element weight to total weight
    const totalWeight = topElements.reduce((sum, el) => sum + el.totalWeight, 0);
    const confidence = totalWeight > 0 ? Math.floor((topElements[0].totalWeight / totalWeight) * 100) : 0;

    return {
      predictedPrimary,
      predictedSecondary,
      confidence,
    };
  }
}
