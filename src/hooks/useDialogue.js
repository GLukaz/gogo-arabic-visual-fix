import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeDialogue, openQuiz, showNotification } from '../store/slices/uiSlice.js';
import { updateDialogueState, teachWord as npcTeachWord } from '../store/slices/npcSlice.js';
import { addFsrsCard, associateWordWithNpc } from '../store/slices/vocabularySlice.js';
import { addXP, incrementWordsLearned } from '../store/slices/playerSlice.js';
import { updateQuestProgress, completeQuest, checkPrerequisites } from '../store/slices/questSlice.js';
import { createNewCard } from '../services/fsrs.js';
import { store } from '../store/store.js';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';
import { XP_REWARDS } from '../utils/xpCalculator.js';
import { shuffle } from '../utils/shuffle.js';
import { selectWordsByDifficulty } from '../utils/wordSelection.js';
import vocabulary from '../data/vocabularyAll.js';
import questsData from '../data/quests.json';
import { getCulturalDialoguesForNPC } from '../data/culturalDialogues.js';
import { DialogueEngine } from '../game/systems/DialogueEngine.js';

/**
 * Selects the correct dialogue tree for this NPC based on the player's
 * visit history and which words have already been taught.
 *
 * Priority:
 * 1. First visit (no dialogueState entry)      -> trigger "first_meeting"
 * 2. Return visit with untaught return trees    -> next "return_visit" tree
 * 3. Fallback                                   -> trigger "default"
 */
function pickDialogueTree(npc, dialogueState) {
  const state = dialogueState?.[npc.id];
  const trees = npc.dialogueTrees;

  // 1. First visit -- no prior state at all
  if (!state) {
    const introTree = trees.find((t) => t.trigger === 'first_meeting');
    if (introTree) return introTree;
  }

  // 2. Return visit -- find the next return_visit tree whose teachWords
  //    have NOT all been taught yet.
  const taughtSet = new Set(state?.wordsTaught ?? []);
  const returnTrees = trees.filter((t) => t.trigger === 'return_visit');

  for (const rt of returnTrees) {
    // Collect every teachWord id referenced in this tree's lines
    const treeWords = rt.lines
      .filter((l) => l.teachWord)
      .map((l) => l.teachWord);

    // If any word in this tree has NOT been taught, use this tree
    const hasUntaught = treeWords.some((w) => !taughtSet.has(w));
    if (hasUntaught) return rt;
  }

  // 3. Default fallback
  const defaultTree = trees.find((t) => t.trigger === 'default');
  if (defaultTree) return defaultTree;

  // Absolute fallback -- first tree
  return trees[0];
}

function resolveVocabWord(wordId) {
  return vocabulary.find((w) => w.id === wordId) ?? null;
}

/**
 * useDialogue hook
 * Manages hub-and-spoke dialogue flow with topic selection, condition evaluation, and effects execution.
 *
 * State machine phases:
 * - greeting: Playing initial greeting/intro lines
 * - hub: Showing topic selection menu
 * - topic: Playing selected topic tree lines
 * - returning: Transitioning back to hub after topic completion
 *
 * Backward compatible: NPCs without topic fields use traditional linear flow.
 */
export function useDialogue(npc) {
  const dispatch = useDispatch();
  const cards = useSelector((s) => s.vocabulary.fsrsCards);
  const dialogueState = useSelector((s) => s.npc?.dialogueState || {});
  const quests = useSelector((s) => s.quests.quests);
  const playerLevel = useSelector((s) => s.player.level);
  const wordsLearned = useSelector((s) => s.player.wordsLearned);

  // Create DialogueEngine instance (no scene needed for condition/effect logic)
  const engineRef = useRef(null);
  if (!engineRef.current) {
    engineRef.current = new DialogueEngine(null);
  }

  // Check if this NPC supports hub-and-spoke (has topic trees)
  const isHubAndSpoke = useMemo(() => {
    if (!npc) return false;
    return npc.dialogueTrees.some(t => t.topic);
  }, [npc]);

  // Pick the correct dialogue tree based on visit history
  const initialTree = useMemo(
    () => (npc ? pickDialogueTree(npc, dialogueState) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [npc?.id], // only recalculate when a new dialogue opens
  );

  const [currentTree, setCurrentTree] = useState(initialTree);
  const [lineIndex, setLineIndex] = useState(0);
  const [showCulturalMenu, setShowCulturalMenu] = useState(false);

  // Hub-and-spoke state
  const [phase, setPhase] = useState('greeting'); // 'greeting' | 'hub' | 'topic' | 'returning'
  const [availableTopics, setAvailableTopics] = useState([]);
  const [currentTopicTreeId, setCurrentTopicTreeId] = useState(null);
  const [topicsDiscussed, setTopicsDiscussed] = useState([]); // track discussed topics this session
  const [quizReturnState, setQuizReturnState] = useState(null); // {treeId, lineIndex} for mid-quiz return

  // Reset tree + line + state when a new NPC dialogue opens
  useEffect(() => {
    if (npc) {
      const tree = pickDialogueTree(npc, dialogueState);
      setCurrentTree(tree);
      setLineIndex(0);
      setShowCulturalMenu(false);
      setPhase('greeting');
      setAvailableTopics([]);
      setCurrentTopicTreeId(null);
      setTopicsDiscussed([]);
      setQuizReturnState(null);

      // Set current NPC in engine
      if (engineRef.current) {
        engineRef.current.currentNpcId = npc.id;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [npc?.id]);

  /* ---- refresh available topics (re-evaluate conditions) ---- */
  const refreshTopics = useCallback(() => {
    if (!npc || !engineRef.current) return [];
    engineRef.current.currentNpcId = npc.id;
    const topics = engineRef.current.getAvailableTopics(npc);
    setAvailableTopics(topics);
    return topics;
  }, [npc]);

  /* ---- select a topic from the hub ---- */
  const selectTopic = useCallback((topicTreeId) => {
    const tree = npc.dialogueTrees.find(t => t.id === topicTreeId);
    if (!tree) return;
    setCurrentTree(tree);
    setLineIndex(0);
    setCurrentTopicTreeId(topicTreeId);
    setPhase('topic');
    setTopicsDiscussed(prev => [...new Set([...prev, tree.topic || topicTreeId])]);
    EventBus.emit(EVENTS.DIALOGUE_TOPIC_SELECTED, { npcId: npc.id, topicId: topicTreeId, topic: tree.topic });
  }, [npc]);

  /* ---- close handler ---- */
  const close = useCallback(() => {
    if (npc) {
      dispatch(updateDialogueState({ npcId: npc.id, lastLine: lineIndex }));
    }
    dispatch(closeDialogue());
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    EventBus.emit(EVENTS.DIALOGUE_ENDED, { npcId: npc?.id });
  }, [dispatch, npc, lineIndex]);

  /* ---- teach a vocabulary word (FSRS card + XP + quest tracking) ---- */
  const handleTeachWord = useCallback((wordId) => {
    const isNew = !cards[wordId];
    const word = resolveVocabWord(wordId);

    if (isNew && word) {
      EventBus.emit(EVENTS.SFX_WORDLEARNED);
      dispatch(addFsrsCard({ wordId, card: createNewCard(), source: 'dialogue' }));
      dispatch(associateWordWithNpc({ wordId, npcId: npc.id }));
      dispatch(incrementWordsLearned());
      dispatch(addXP(XP_REWARDS.NEW_WORD));

      // Track quest progress for word category
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
      const event = categoryToEvent[word.category];
      // Read fresh quest state from store to avoid stale closure on rapid dispatches
      const freshQuests = store.getState().quests.quests;
      if (event) {
        for (const qd of questsData) {
          if (qd.trackEvent === event && freshQuests[qd.id]?.status === 'active') {
            dispatch(updateQuestProgress({ questId: qd.id, amount: 1 }));
            const current = (freshQuests[qd.id]?.progress || 0) + 1;
            if (current >= qd.target) {
              dispatch(completeQuest(qd.id));
              dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
              dispatch(checkPrerequisites(questsData));
            }
          }
        }
      }
      // Always track "word_learned_any"
      for (const qd of questsData) {
        if (qd.trackEvent === 'word_learned_any' && freshQuests[qd.id]?.status === 'active') {
          dispatch(updateQuestProgress({ questId: qd.id, amount: 1 }));
          const current = (freshQuests[qd.id]?.progress || 0) + 1;
          if (current >= qd.target) {
            dispatch(completeQuest(qd.id));
            dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
            dispatch(checkPrerequisites(questsData));
          }
        }
      }
    }
    // Track in NPC slice regardless (idempotent)
    dispatch(npcTeachWord({ npcId: npc.id, wordId }));
  }, [cards, dispatch, npc]);

  /* ---- advance to next line ---- */
  const advance = useCallback(() => {
    const line = currentTree?.lines[lineIndex];

    // Teach the word on the current line if present
    if (line?.teachWord) {
      handleTeachWord(line.teachWord);
    }

    const nextIdx = lineIndex + 1;
    if (nextIdx < currentTree.lines.length) {
      const nextLine = currentTree.lines[nextIdx];

      // If the next line is a quiz action, open the quiz overlay
      if (nextLine.action === 'quiz') {
        // Save state for resume after quiz
        setQuizReturnState({ treeId: currentTree.id, lineIndex: nextIdx + 1 });

        let quizWords;

        // Adaptive difficulty based on words learned (VCAB-11)
        let numChoices;
        if (wordsLearned < 20) {
          numChoices = 3; // Easy: 2-3 choices
        } else if (wordsLearned <= 100) {
          numChoices = 4; // Medium: 4 choices
        } else {
          numChoices = 4; // Hard: 4 choices with same-category distractors
        }

        if (nextLine.words === 'random_learned_10') {
          const learnedIds = Object.keys(cards);
          const shuffled = shuffle(learnedIds).slice(0, 10);
          quizWords = shuffled
            .map((id) => resolveVocabWord(id))
            .filter(Boolean);
          if (quizWords.length === 0) {
            // Use adaptive word selection for new players
            quizWords = selectWordsByDifficulty(vocabulary, 5, playerLevel, wordsLearned);
          }
        } else {
          quizWords = nextLine.words
            .map((id) => resolveVocabWord(id))
            .filter(Boolean);
        }

        const quizType =
          nextLine.quizType === 'random'
            ? ['ar-to-en', 'en-to-ar', 'en-to-type-ar'][
                Math.floor(Math.random() * 3)
              ]
            : nextLine.quizType;

        dispatch(openQuiz({ words: quizWords, quizType, numChoices }));
        EventBus.emit(EVENTS.DIALOGUE_QUIZ_REQUESTED, {
          npcId: npc.id,
          quizType,
          wordCount: quizWords.length
        });
        return;
      }

      setLineIndex(nextIdx);
    } else {
      // End of tree — check if we should return to hub or close
      if (phase === 'greeting' && isHubAndSpoke) {
        // Transition from greeting to hub
        setPhase('hub');
        refreshTopics();
      } else if (phase === 'topic' && engineRef.current.shouldReturnToHub(currentTree)) {
        // Return to hub after topic
        setPhase('hub');
        setCurrentTopicTreeId(null);
        refreshTopics();
      } else {
        // Close dialogue
        close();
      }
    }
  }, [currentTree, lineIndex, handleTeachWord, cards, playerLevel, wordsLearned, dispatch, close, phase, isHubAndSpoke, refreshTopics, npc]);

  /* ---- resume after mid-dialogue quiz ---- */
  const resumeAfterQuiz = useCallback(() => {
    if (!quizReturnState) return;
    const tree = npc.dialogueTrees.find(t => t.id === quizReturnState.treeId);
    if (tree && quizReturnState.lineIndex < tree.lines.length) {
      setCurrentTree(tree);
      setLineIndex(quizReturnState.lineIndex);
    } else {
      // Quiz was at end of tree, return to hub or close
      if (phase === 'topic' && engineRef.current.shouldReturnToHub(tree)) {
        setPhase('hub');
        refreshTopics();
      } else {
        close();
      }
    }
    setQuizReturnState(null);
  }, [quizReturnState, npc, phase, refreshTopics, close]);

  /* ---- handle player choice buttons ---- */
  const handleChoice = useCallback((choice) => {
    EventBus.emit(EVENTS.SFX_CLICK);

    // Execute choice effects if present
    if (choice.effects && engineRef.current) {
      engineRef.current.executeEffects(choice.effects, npc.id);
    }

    // Record player choice
    if (choice.choiceId && engineRef.current) {
      engineRef.current.recordPlayerChoice(npc.id, choice.choiceId);
    } else if (choice.text && engineRef.current) {
      // Generate choiceId from text if not provided
      const choiceId = choice.text.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      engineRef.current.recordPlayerChoice(npc.id, choiceId);
    }

    // Handle choice actions
    if (choice.action === 'open_shop') {
      // Re-use the same dialogue config slot for shop
      dispatch(closeDialogue());
      EventBus.emit(EVENTS.SHOP_OPEN, { npcId: npc.id });
    } else if (choice.action === 'open_alphabet') {
      close();
      EventBus.emit(EVENTS.ALPHABET_OPEN);
    } else if (choice.action === 'daily_quiz') {
      const learnedIds = Object.keys(cards);
      const shuffled = shuffle(learnedIds).slice(0, 10);
      const quizWords = shuffled
        .map((id) => resolveVocabWord(id))
        .filter(Boolean);
      if (quizWords.length > 0) {
        dispatch(openQuiz({ words: quizWords, quizType: 'random' }));
      } else {
        close();
      }
    } else if (choice.action === 'cultural_dialogue') {
      // Load a cultural dialogue tree
      const culturalDialogue = choice.culturalDialogueData;
      if (culturalDialogue) {
        // Convert cultural dialogue to dialogue tree format
        const culturalTree = {
          id: culturalDialogue.id,
          trigger: 'cultural',
          lines: culturalDialogue.lines,
        };
        setCurrentTree(culturalTree);
        setLineIndex(0);
        setShowCulturalMenu(false);
      }
    } else if (choice.action === 'show_cultural_menu') {
      // Show cultural dialogue menu
      setShowCulturalMenu(true);
    } else if (choice.action === 'hide_cultural_menu') {
      // Hide cultural menu and return to dialogue
      setShowCulturalMenu(false);
    } else if (choice.action === 'return_to_hub') {
      // Return to hub from within dialogue
      setPhase('hub');
      refreshTopics();
    } else if (choice.next) {
      // Jump to a different tree by id
      const nextTree = npc.dialogueTrees.find((t) => t.id === choice.next);
      if (nextTree) {
        setCurrentTree(nextTree);
        setLineIndex(0);
      } else {
        close();
      }
    } else {
      // choice.next === null means close dialogue
      close();
    }
  }, [npc, cards, dispatch, close, refreshTopics]);

  // Compute filtered choices for current line (re-evaluated when line changes)
  const filteredChoices = useMemo(() => {
    const line = currentTree?.lines[lineIndex];
    if (!line?.choices || !engineRef.current) return line?.choices || [];
    return engineRef.current.getFilteredChoices(line.choices);
  }, [currentTree, lineIndex]);

  return {
    // Existing API
    currentTree,
    lineIndex,
    close,
    advance,
    handleChoice,
    showCulturalMenu,
    setShowCulturalMenu,

    // New hub-and-spoke API
    phase,                    // 'greeting' | 'hub' | 'topic' | 'returning'
    availableTopics,          // [{treeId, topic, label, priority}]
    selectTopic,              // (topicTreeId) => void
    topicsDiscussed,          // string[] of topic IDs discussed this session
    filteredChoices,          // choices filtered by conditions (computed from current line)
    resumeAfterQuiz,          // () => void — call when quiz overlay closes
    isHubAndSpoke,            // boolean — does this NPC support topic selection?
  };
}
