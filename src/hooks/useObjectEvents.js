import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  openSign,
  openObjectInspect,
  showNotification,
} from '../store/slices/uiSlice.js';
import {
  addDirhams,
  addXP,
  incrementWordsLearned,
  markChestOpened,
  markBookRead,
} from '../store/slices/playerSlice.js';
import { addFsrsCard } from '../store/slices/vocabularySlice.js';
import { setWorldObjectState } from '../store/slices/narrativeSlice.js';
import {
  updateQuestProgress,
  completeQuest,
  checkPrerequisites,
  recordChestOpened,
} from '../store/slices/questSlice.js';
import { createNewCard } from '../services/fsrs.js';
import { XP_REWARDS } from '../utils/xpCalculator.js';
import vocabulary from '../data/vocabularyAll.js';
import questsData from '../data/quests.json';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';
import { store } from '../store/store.js';
// ENVR-02: InkDialogueEngine for vocabulary-gated inscription comprehension
import { InkDialogueEngine } from '../game/systems/InkDialogueEngine.js';

/**
 * useObjectEvents — Sign, bookshelf, chest, door, and world object event handlers
 */
export function useObjectEvents(playSFX) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Track generic quest events by trackEvent string
    const trackQuestEvent = (eventName) => {
      const quests = store.getState().quests.quests;
      for (const qd of questsData) {
        if (qd.trackEvent === eventName && quests[qd.id]?.status === 'active') {
          dispatch(updateQuestProgress({ questId: qd.id, amount: 1 }));
          const current = (quests[qd.id]?.progress || 0) + 1;
          if (current >= qd.target) {
            dispatch(completeQuest(qd.id));
          }
        }
      }
    };

    // Track word learned for quest progress
    const trackWordLearned = (category) => {
      const categoryToEvent = {
        greetings: 'word_learned_greetings',
        trade: 'word_learned_trade',
        numbers: 'word_learned_numbers',
        food: 'word_learned_food',
        family: 'word_learned_family',
        nature: 'word_learned_nature',
        animals: 'word_learned_animals',
        body: 'word_learned_body',
        verbs_basic: 'word_learned_verbs_basic',
        adjectives: 'word_learned_adjectives',
        clothing: 'word_learned_clothing',
        colors: 'word_learned_colors',
        directions: 'word_learned_directions',
        time: 'word_learned_time',
        phrases: 'word_learned_phrases',
      };
      const event = categoryToEvent[category];

      // Read quests from store directly (not stale closure)
      const quests = store.getState().quests.quests;

      // Update category-specific quest
      if (event) {
        for (const qd of questsData) {
          if (qd.trackEvent === event && quests[qd.id]?.status === 'active') {
            dispatch(updateQuestProgress({ questId: qd.id, amount: 1 }));
            const current = (quests[qd.id]?.progress || 0) + 1;
            if (current >= qd.target) {
              dispatch(completeQuest(qd.id));
              dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
              dispatch(checkPrerequisites(questsData));
            }
          }
        }
      }

      // Always update "word_learned_any" quests
      for (const qd of questsData) {
        if (qd.trackEvent === 'word_learned_any' && quests[qd.id]?.status === 'active') {
          dispatch(updateQuestProgress({ questId: qd.id, amount: 1 }));
          const current = (quests[qd.id]?.progress || 0) + 1;
          if (current >= qd.target) {
            dispatch(completeQuest(qd.id));
            dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
            dispatch(checkPrerequisites(questsData));
          }
        }
      }
    };

    const handleShowSign = ({ arabic, english }) => {
      playSFX('bookopen');
      dispatch(openSign({ arabic, english }));
    };

    const handleBookshelfInteract = ({ category, id, reread }) => {
      playSFX('bookflip');
      // Persist that this bookshelf has been read
      if (!reread) {
        dispatch(markBookRead(id));
      }
      // Read fsrsCards from store directly (not stale closure)
      const currentFsrsCards = store.getState().vocabulary.fsrsCards;
      // Find a random word from this category that the player hasn't learned
      const categoryWords = vocabulary.filter((w) => w.category === category);
      const unknownWords = categoryWords.filter((w) => !currentFsrsCards[w.id]);
      const pool = unknownWords.length > 0 ? unknownWords : categoryWords;
      const word = pool[Math.floor(Math.random() * pool.length)];

      if (word && !reread) {
        // Teach the word if it's new
        if (!currentFsrsCards[word.id]) {
          dispatch(addFsrsCard({ wordId: word.id, card: createNewCard(), source: 'bookshelf' }));
          dispatch(incrementWordsLearned());
          dispatch(addXP(XP_REWARDS.NEW_WORD));
          // Track quest progress
          trackWordLearned(word.category);
        }
        dispatch(showNotification({
          message: `${word.arabic} — ${word.english}`,
          type: 'word',
        }));
      } else if (reread) {
        dispatch(showNotification({
          message: `${word.arabic} — ${word.english}`,
          type: 'word',
        }));
      }
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    };

    const handleChestOpened = ({ amount, id }) => {
      playSFX('chest');
      playSFX('coin');
      dispatch(markChestOpened(id));
      dispatch(addDirhams(amount));
      dispatch(
        showNotification({
          message: `Found ${amount} dirhams!`,
          type: 'dirhams',
        })
      );

      // Track chest opened for treasure hunter quest
      dispatch(recordChestOpened(id));

      // Check treasure hunter quest
      const quests = store.getState().quests.quests;
      for (const qd of questsData) {
        if (qd.trackEvent === 'chest_opened' && quests[qd.id]?.status === 'active') {
          const currentState = store.getState();
          const chestsOpened = currentState.quests.chestsOpened || [];
          const chestsCount = chestsOpened.length;
          dispatch(updateQuestProgress({ questId: qd.id, amount: chestsCount }));
          if (chestsCount >= qd.target) {
            dispatch(completeQuest(qd.id));
            dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
            dispatch(checkPrerequisites(questsData));
          }
        }
      }
    };

    const handleChestEmpty = () => {
      playSFX('click');
      dispatch(showNotification({
        message: 'Already opened!',
        type: 'dirhams',
      }));
    };

    const handleDoorLocked = ({ message }) => {
      playSFX('wrong');
      dispatch(showNotification({
        message: message || 'This door is locked.',
        type: 'quest',
      }));
    };

    /**
     * Handle OBJECT_INTERACT — unified handler for all 8 new world object types + inscriptions.
     * Processes rewards (vocab, loot), persists state, then opens the overlay.
     * ENVR-02: Ink inscriptions are routed to InkDialogueEngine for vocabulary-gated comprehension.
     */
    const handleObjectInteract = async (payload) => {
      playSFX('click');

      const {
        id,
        vocabWordId,
        vocabCategory,
        loot,
        stateChange,
        useInk,
        inkFile,
      } = payload;

      // ENVR-02: Route ink inscriptions through InkDialogueEngine
      if (useInk && inkFile) {
        const engine = new InkDialogueEngine(null, null);
        await engine.loadForNpc(inkFile);

        if (engine.isInkLoaded) {
          // Persist state change (discovery flag)
          if (stateChange && id) {
            dispatch(setWorldObjectState({ objectId: id, objectState: stateChange }));
          }

          EventBus.emit(EVENTS.INK_DIALOGUE_START, {
            engine,
            npcData: {
              id: inkFile,
              name: payload.labelEnglish || 'Inscription',
              type: 'inscription',
            },
          });
          return; // Ink handler takes over; skip OBJECT_INTERACT overlay
        }
        // Fallback: ink file not found — fall through to standard overlay
      }

      // Build enriched payload for the overlay
      const overlayData = { ...payload };

      // Teach vocab word if specified
      if (vocabWordId) {
        const currentCards = store.getState().vocabulary.fsrsCards;
        const word = vocabulary.find((w) => w.id === vocabWordId);
        if (word && !currentCards[word.id]) {
          dispatch(addFsrsCard({ wordId: word.id, card: createNewCard(), source: 'object' }));
          dispatch(incrementWordsLearned());
          dispatch(addXP(XP_REWARDS.NEW_WORD));
          if (vocabCategory) {
            trackWordLearned(vocabCategory);
          }
          // Track for object_word_learned quests (Tier 3C — first words quest)
          EventBus.emit(EVENTS.SFX_WORDLEARNED);
          trackQuestEvent('object_word_learned');
          overlayData.taughtWord = { arabic: word.arabic, english: word.english };
        } else if (word) {
          // Word already known — still show it in overlay for reference
          overlayData.taughtWord = { arabic: word.arabic, english: word.english };
        }
      }

      // Give loot (dirhams) if specified
      if (loot && loot.type === 'dirhams') {
        const amount = Math.floor(Math.random() * (loot.max - loot.min + 1)) + loot.min;
        dispatch(addDirhams(amount));
        overlayData.lootMessage = `Found ${amount} dirhams!`;
      }

      // Persist state change in narrativeSlice.worldObjectStates
      if (stateChange) {
        dispatch(setWorldObjectState({ objectId: id, objectState: stateChange }));
      }

      // Open the object inspection overlay
      dispatch(openObjectInspect(overlayData));
    };

    EventBus.on(EVENTS.SIGN_SHOW, handleShowSign);
    EventBus.on(EVENTS.BOOKSHELF_INTERACT, handleBookshelfInteract);
    EventBus.on(EVENTS.CHEST_OPENED, handleChestOpened);
    EventBus.on(EVENTS.CHEST_EMPTY, handleChestEmpty);
    EventBus.on(EVENTS.DOOR_LOCKED, handleDoorLocked);
    EventBus.on(EVENTS.OBJECT_INTERACT, handleObjectInteract);

    return () => {
      EventBus.off(EVENTS.SIGN_SHOW, handleShowSign);
      EventBus.off(EVENTS.BOOKSHELF_INTERACT, handleBookshelfInteract);
      EventBus.off(EVENTS.CHEST_OPENED, handleChestOpened);
      EventBus.off(EVENTS.CHEST_EMPTY, handleChestEmpty);
      EventBus.off(EVENTS.DOOR_LOCKED, handleDoorLocked);
      EventBus.off(EVENTS.OBJECT_INTERACT, handleObjectInteract);
    };
  }, [dispatch, playSFX]);
}
