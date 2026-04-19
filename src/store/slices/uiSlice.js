import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  dialogueOpen: false,
  quizOpen: false,
  menuOpen: false,
  signOpen: false,
  objectInspectOpen: false,
  inventoryOpen: false,
  recipeBookOpen: false,
  craftingMiniGameActive: false,
  quizConfig: null, // { type, words, context, timer }
  dialogueConfig: null, // { npcId, npcName }
  signData: null, // { arabic, english }
  objectInspectData: null, // { id, type, labelArabic, labelEnglish, ... }
  notification: null, // { message, type }
  craftingRecipeId: null, // Recipe ID for crafting mini-game
  craftingProfessionId: null, // Profession ID for crafting mini-game
  journalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openDialogue(state, action) {
      // payload: { npcId, npcName }
      state.dialogueOpen = true;
      state.dialogueConfig = action.payload;
    },

    closeDialogue(state) {
      state.dialogueOpen = false;
      state.dialogueConfig = null;
    },

    openQuiz(state, action) {
      // payload: { type, words, context, timer }
      state.quizOpen = true;
      state.quizConfig = action.payload;
    },

    closeQuiz(state) {
      state.quizOpen = false;
      state.quizConfig = null;
    },

    toggleMenu(state) {
      state.menuOpen = !state.menuOpen;
    },

    openSign(state, action) {
      // payload: { arabic, english }
      state.signOpen = true;
      state.signData = action.payload;
    },

    closeSign(state) {
      state.signOpen = false;
      state.signData = null;
    },

    openObjectInspect(state, action) {
      // payload: { id, type, labelArabic, labelEnglish, descriptionArabic, descriptionEnglish,
      //            culturalNote, vocabWordId, vocabCategory, loot, stateChange, repeatable,
      //            taughtWord, lootMessage }
      state.objectInspectOpen = true;
      state.objectInspectData = action.payload;
    },

    closeObjectInspect(state) {
      state.objectInspectOpen = false;
      state.objectInspectData = null;
    },

    openInventory(state) {
      state.inventoryOpen = true;
    },

    closeInventory(state) {
      state.inventoryOpen = false;
    },

    openRecipeBook(state) {
      state.recipeBookOpen = true;
    },

    closeRecipeBook(state) {
      state.recipeBookOpen = false;
    },

    startCraftingMiniGame(state, action) {
      // payload: { recipeId, professionId }
      const { recipeId, professionId } = action.payload;
      state.craftingMiniGameActive = true;
      state.craftingRecipeId = recipeId;
      state.craftingProfessionId = professionId;
    },

    endCraftingMiniGame(state) {
      state.craftingMiniGameActive = false;
      state.craftingRecipeId = null;
      state.craftingProfessionId = null;
    },

    showNotification(state, action) {
      // payload: { message, type }
      state.notification = action.payload;
    },

    clearNotification(state) {
      state.notification = null;
    },

    openJournal(state) {
      state.journalOpen = true;
    },

    closeJournal(state) {
      state.journalOpen = false;
    },

    closeAllOverlays(state) {
      state.dialogueOpen = false;
      state.quizOpen = false;
      state.menuOpen = false;
      state.signOpen = false;
      state.objectInspectOpen = false;
      state.inventoryOpen = false;
      state.recipeBookOpen = false;
      state.craftingMiniGameActive = false;
      state.quizConfig = null;
      state.dialogueConfig = null;
      state.signData = null;
      state.objectInspectData = null;
      state.craftingRecipeId = null;
      state.craftingProfessionId = null;
      state.journalOpen = false;
    },
  },
});

export const {
  openDialogue,
  closeDialogue,
  openQuiz,
  closeQuiz,
  toggleMenu,
  openSign,
  closeSign,
  openObjectInspect,
  closeObjectInspect,
  openInventory,
  closeInventory,
  openRecipeBook,
  closeRecipeBook,
  startCraftingMiniGame,
  endCraftingMiniGame,
  showNotification,
  clearNotification,
  openJournal,
  closeJournal,
  closeAllOverlays,
} = uiSlice.actions;

// --- Selectors ---
export const selectDialogueOpen = (state) => state.ui.dialogueOpen;
export const selectDialogueConfig = (state) => state.ui.dialogueConfig;
export const selectQuizOpen = (state) => state.ui.quizOpen;
export const selectQuizConfig = (state) => state.ui.quizConfig;
export const selectMenuOpen = (state) => state.ui.menuOpen;
export const selectSignOpen = (state) => state.ui.signOpen;
export const selectSignData = (state) => state.ui.signData;
export const selectObjectInspectOpen = (state) => state.ui.objectInspectOpen;
export const selectObjectInspectData = (state) => state.ui.objectInspectData;
export const selectNotification = (state) => state.ui.notification;
export const selectInventoryOpen = (state) => state.ui.inventoryOpen;
export const selectRecipeBookOpen = (state) => state.ui.recipeBookOpen;
export const selectCraftingMiniGameActive = (state) => state.ui.craftingMiniGameActive;
export const selectCraftingRecipeId = (state) => state.ui.craftingRecipeId;
export const selectCraftingProfessionId = (state) => state.ui.craftingProfessionId;
export const selectJournalOpen = (state) => state.ui.journalOpen;
export const selectAnyOverlayOpen = createSelector(
  [
    (state) => state.ui.dialogueOpen,
    (state) => state.ui.quizOpen,
    (state) => state.ui.menuOpen,
    (state) => state.ui.signOpen,
    (state) => state.ui.objectInspectOpen,
    (state) => state.ui.inventoryOpen,
    (state) => state.ui.recipeBookOpen,
    (state) => state.ui.craftingMiniGameActive,
    (state) => state.ui.journalOpen,
    (state) => !!state.battle?.activeBattle,
  ],
  (dialogueOpen, quizOpen, menuOpen, signOpen, objectInspectOpen, inventoryOpen, recipeBookOpen, craftingMiniGameActive, journalOpen, activeBattle) =>
    dialogueOpen || quizOpen || menuOpen || signOpen || objectInspectOpen || inventoryOpen || recipeBookOpen || craftingMiniGameActive || journalOpen || activeBattle
);

export default uiSlice.reducer;
