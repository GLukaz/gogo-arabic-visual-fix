/**
 * microReviewSlice — holds the current micro-review suggestion.
 *
 * A micro-review is triggered by the zoneEntryReviewMiddleware when a player
 * enters a zone that has FSRS-due vocabulary cards. The UI layer reads
 * microReview.suggested to render the quick-review overlay.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  /** Array of word IDs selected for the current micro-review. Empty = no active review. */
  suggested: [],
  /** Zone that triggered the review, or null. */
  zoneId: null,
};

const microReviewSlice = createSlice({
  name: 'microReview',
  initialState,
  reducers: {
    /**
     * suggest — set the current micro-review card list.
     * Payload: { zoneId: string, cards: string[] }
     */
    suggest(state, action) {
      const { zoneId, cards } = action.payload;
      state.zoneId    = zoneId;
      state.suggested = cards;
    },

    /** dismiss — clear the current micro-review. */
    dismiss(state) {
      state.zoneId    = null;
      state.suggested = [];
    },
  },
});

export const { suggest, dismiss } = microReviewSlice.actions;
export const selectMicroReview    = (state) => state.microReview;
export default microReviewSlice.reducer;
