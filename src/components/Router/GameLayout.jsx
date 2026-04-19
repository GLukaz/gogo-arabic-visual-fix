import React, { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { startListening, stopListening } from '../../services/spacedListeningService.js';
import { selectSpacedListeningEnabled } from '../../store/slices/settingsSlice.js';
import vocabularyAll from '../../data/vocabularyAll.js';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { toggleMenu, selectAnyOverlayOpen, selectInventoryOpen, closeInventory, selectRecipeBookOpen, closeRecipeBook, selectCraftingMiniGameActive, selectCraftingRecipeId, selectCraftingProfessionId, startCraftingMiniGame, endCraftingMiniGame, selectJournalOpen, openJournal, closeJournal } from '../../store/slices/uiSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { audioManager } from '../../services/audio.js';
import { useAudio } from '../../hooks/useAudio.js';
import { useEventBusListeners } from '../../hooks/useEventBusListeners.js';
import { useSessionTracking } from '../../hooks/useSessionTracking.js';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts.js';
import { useTutorialTrigger } from '../../hooks/useTutorialTrigger.js';
import { WORLD_STATE_KEYS } from '../../data/worldStateKeys.js';
import { selectWelcomeBackShown } from '../../store/slices/dailyGoalsSlice.js';

// STATIC — always visible on game screen
import { PhaserGame } from '../../game/PhaserGame.jsx';
import HUD from '../HUD/HUD.jsx';
import MiniMap from '../HUD/MiniMap.jsx';
import NotificationToast from '../HUD/NotificationToast.jsx';

// LAZY — conditionally rendered overlays
const DialogueOverlay = lazy(() => import('../NPC/DialogueOverlay.jsx'));
const QuizOverlay = lazy(() => import('../Quiz/QuizOverlay.jsx'));
const QuestLog = lazy(() => import('../Quest/QuestLog.jsx'));
const SignOverlay = lazy(() => import('../World/SignOverlay.jsx'));
const ObjectInteractionOverlay = lazy(() => import('../World/ObjectInteractionOverlay.jsx'));
const TutorialHints = lazy(() => import('../Onboarding/TutorialHints.jsx'));
const WelcomeSplash = lazy(() => import('../Onboarding/TutorialHints.jsx').then(m => ({ default: m.WelcomeSplash })));
const CinematicIntro = lazy(() => import('../Onboarding/CinematicIntro.jsx'));
const PathChoice = lazy(() => import('../Onboarding/PathChoice.jsx'));
const LevelUpModal = lazy(() => import('../UI/LevelUpModal.jsx'));
const StreakRewardToast = lazy(() => import('../Goals/StreakRewardToast.jsx'));
const AchievementToast = lazy(() => import('../Achievements/AchievementToast.jsx'));
const PauseMenu = lazy(() => import('./PauseMenu.jsx'));
const BattleOverlay = lazy(() => import('../Battle/BattleOverlay.jsx'));
const MagicOverlay = lazy(() => import('../Magic/MagicOverlay.jsx'));
const SpellMenu = lazy(() => import('../Magic/SpellMenu.jsx'));
const RootDiscoveryToast = lazy(() => import('../Magic/RootDiscoveryToast.jsx'));
const InventoryUI = lazy(() => import('../Inventory/InventoryUI.jsx'));
const RecipeBook = lazy(() => import('../Crafting/RecipeBook.jsx'));
const CraftingMiniGame = lazy(() => import('../Crafting/CraftingMiniGame.jsx'));
const ShopOverlay = lazy(() => import('../Shop/ShopOverlay.jsx'));
const QuestJournal = lazy(() => import('../Quest/QuestJournal.jsx'));
const Wardrobe = lazy(() => import('../Wardrobe/Wardrobe.jsx'));
const FactionPanel = lazy(() => import('../Faction/FactionPanel.jsx'));
const PoetryBattleOverlay = lazy(() => import('../Poetry/PoetryBattleOverlay.jsx'));
const WelcomeBackOverlay = lazy(() => import('../WelcomeBack/WelcomeBackOverlay.jsx'));
const MicroReviewOverlay = lazy(() => import('../Quiz/MicroReviewOverlay.jsx'));
const EventBanner = lazy(() => import('../Events/EventBanner.jsx'));
const EventOverlay = lazy(() => import('../Events/EventOverlay.jsx'));
const GiftOverlay = lazy(() => import('../NPC/GiftOverlay.jsx'));
const RelationshipMilestone = lazy(() => import('../NPC/RelationshipMilestone.jsx'));
const LoreCodex = lazy(() => import('../Lore/LoreCodex.jsx'));
const DailyChallengeOverlay = lazy(() => import('../DailyChallenge/DailyChallengeOverlay.jsx'));
const ReadingPassageOverlay = lazy(() => import('../Reading/ReadingPassageOverlay.jsx'));
const WritingPracticeOverlay = lazy(() => import('../Writing/WritingPracticeOverlay.jsx'));
const ConversationPracticeOverlay = lazy(() => import('../Conversation/ConversationPracticeOverlay.jsx'));
const MiniGameHub = lazy(() => import('../MiniGames/MiniGameHub.jsx'));
const SeasonalEventOverlay = lazy(() => import('../Seasonal/SeasonalEventOverlay.jsx'));
const SeasonalEventBanner = lazy(() => import('../Seasonal/SeasonalEventBanner.jsx'));
const BreakSuggestion = lazy(() => import('../UI/BreakSuggestion.jsx'));
const DifficultyDashboard = lazy(() => import('../UI/DifficultyDashboard.jsx'));
const ProgressReport = lazy(() => import('../Progress/ProgressReport.jsx'));
const FeatureUnlockToast = lazy(() => import('../UI/FeatureUnlockToast.jsx'));

import styles from './GameLayout.module.css';

/**
 * Layout component for /game/* routes
 * Keeps Phaser canvas mounted across sub-route navigation
 * Handles all EventBus listeners for Phaser <-> React communication
 */
export default function GameLayout() {
  const phaserRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { playSFX } = useAudio();
  const store = useStore();
  const spacedListeningEnabled = useSelector(selectSpacedListeningEnabled);

  // Custom hooks for EventBus, session tracking, and keyboard shortcuts
  useEventBusListeners(phaserRef, playSFX, navigate);
  useSessionTracking();
  useKeyboardShortcuts();
  useTutorialTrigger();

  // Spaced listening — starts/stops based on settings toggle, stops on unmount
  useEffect(() => {
    if (spacedListeningEnabled) {
      startListening(store.getState.bind(store), vocabularyAll);
    } else {
      stopListening();
    }
    return () => { stopListening(); };
  }, [spacedListeningEnabled, store]);

  // UI state selectors — declared early so the emergency reset effect below can use them
  const dialogueOpen = useSelector((state) => state.ui.dialogueOpen);
  const dialogueConfig = useSelector((state) => state.ui.dialogueConfig);
  const quizOpen = useSelector((state) => state.ui.quizOpen);
  const menuOpen = useSelector((state) => state.ui.menuOpen);
  const signOpen = useSelector((state) => state.ui.signOpen);
  const objectInspectOpen = useSelector((state) => state.ui.objectInspectOpen);
  const inventoryOpen = useSelector(selectInventoryOpen);
  const recipeBookOpen = useSelector(selectRecipeBookOpen);
  const craftingMiniGameActive = useSelector(selectCraftingMiniGameActive);
  const craftingRecipeId = useSelector(selectCraftingRecipeId);
  const craftingProfessionId = useSelector(selectCraftingProfessionId);
  const journalOpen = useSelector(selectJournalOpen);
  const onboardingComplete = useSelector((state) => state.player.onboardingComplete ?? true);
  // PATH-07: dual-check — skip onboarding if either localStorage OR IndexedDB flag is set
  const worldOnboardingComplete = useSelector(
    (state) => state.worldState?.flags?.[WORLD_STATE_KEYS.ONBOARDING_COMPLETE] ?? false
  );
  // Resolved skip: either source confirms onboarding done
  const onboardingSkip = onboardingComplete || worldOnboardingComplete;
  const anyOverlayOpen = useSelector(selectAnyOverlayOpen);
  // Guard: PathChoice overlay should not appear if path was already chosen via ink dialogue
  const pathAlreadyChosen = useSelector(
    (state) => state.worldState?.flags?.[WORLD_STATE_KEYS.ONBOARDING_PATH_CHOSEN] ?? false
  );

  const [showWardrobe, setShowWardrobe] = React.useState(false);
  const [showPathSwitch, setShowPathSwitch] = React.useState(false);
  const [showFactionPanel, setShowFactionPanel] = React.useState(false);
  const [zoneLoading, setZoneLoading] = React.useState(false);

  // Welcome Back overlay state (Phase 69)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const welcomeBackShown = useSelector(selectWelcomeBackShown);
  const lastPlayedDate = useSelector((state) => state.player?.lastPlayedDate);

  // WIRE-02: Micro-review overlay state (zone-entry quick reviews)
  const [microReviewWordIds, setMicroReviewWordIds] = useState(null);

  // Poetry battle state — set on POETRY_BATTLE_START, cleared on POETRY_BATTLE_END
  const [poetryBattleData, setPoetryBattleData] = useState(null);

  useEffect(() => {
    const onStart = () => setZoneLoading(true);
    const onEnd = () => setZoneLoading(false);
    EventBus.on(EVENTS.ZONE_LOADING_START, onStart);
    EventBus.on(EVENTS.ZONE_LOADING_END, onEnd);
    return () => {
      EventBus.off(EVENTS.ZONE_LOADING_START, onStart);
      EventBus.off(EVENTS.ZONE_LOADING_END, onEnd);
    };
  }, []);

  // WIRE-02: Micro-review overlay — triggered on zone entry for FSRS-due words
  useEffect(() => {
    const handleMicroReview = ({ wordIds }) => {
      if (wordIds?.length >= 2) {
        setMicroReviewWordIds(wordIds);
        EventBus.emit(EVENTS.PLAYER_FREEZE);
      }
    };
    EventBus.on(EVENTS.MICRO_REVIEW_TRIGGER, handleMicroReview);
    return () => EventBus.off(EVENTS.MICRO_REVIEW_TRIGGER, handleMicroReview);
  }, []);

  const handleMicroReviewClose = useCallback(() => {
    setMicroReviewWordIds(null);
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  }, []);

  // Welcome Back overlay — show for returning players (4+ hours since last session)
  useEffect(() => {
    if (welcomeBackShown) return;
    if (!lastPlayedDate) return;
    const lastPlayed = new Date(lastPlayedDate);
    const hoursSince = (Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60);
    if (hoursSince >= 4) {
      setShowWelcomeBack(true);
      EventBus.emit(EVENTS.PLAYER_FREEZE);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWelcomeBackDismiss = useCallback(() => {
    setShowWelcomeBack(false);
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  }, []);

  const handleWelcomeBackNavigate = useCallback((activity) => {
    setShowWelcomeBack(false);
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    if (activity === 'review') {
      EventBus.emit(EVENTS.REVIEW_SESSION_OPEN);
    } else if (activity === 'alphabet') {
      EventBus.emit(EVENTS.ALPHABET_OPEN);
    }
    // 'explore' = just close, player is already in world
  }, []);

  // Poetry battle EventBus listeners
  useEffect(() => {
    const handlePoetryStart = async (data) => {
      // data: { poetId, poemId, npcAccuracy }
      // Dynamic import to keep poems + poetrySlice out of GameLayout chunk
      const [{ getPoemById, getPoemBlanks }, { startPoetryBattle }] = await Promise.all([
        import('../../data/poems.js'),
        import('../../store/slices/poetrySlice.js'),
      ]);
      const poem = getPoemById(data.poemId);
      if (!poem) {
        console.error('[GameLayout] Poem not found:', data.poemId);
        return;
      }
      const blanks = getPoemBlanks(poem);
      dispatch(startPoetryBattle({
        poemId: data.poemId,
        poetId: data.poetId,
        blanks,
      }));
      setPoetryBattleData(data);
      // Freeze player while poetry overlay is open
      EventBus.emit(EVENTS.PLAYER_FREEZE);
    };

    const handlePoetryEnd = () => {
      setPoetryBattleData(null);
      // Unfreeze player when poetry overlay closes
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    };

    EventBus.on(EVENTS.POETRY_BATTLE_START, handlePoetryStart);
    EventBus.on(EVENTS.POETRY_BATTLE_END, handlePoetryEnd);
    return () => {
      EventBus.off(EVENTS.POETRY_BATTLE_START, handlePoetryStart);
      EventBus.off(EVENTS.POETRY_BATTLE_END, handlePoetryEnd);
    };
  }, []);

  // CalligraphyScene dynamic launcher — handles CALLIGRAPHY_LAUNCH_REQUESTED event
  // and a window.__pendingCalligraphyLaunch set by MiniGamesHub before navigating to /game
  useEffect(() => {
    const handleCalligraphyLaunch = async (data) => {
      const phaserGame = phaserRef.current?.game;
      if (!phaserGame) return;
      const { CalligraphyScene } = await import('../../game/scenes/CalligraphyScene.js');
      if (!phaserGame.scene.getScene('CalligraphyScene')) {
        phaserGame.scene.add('CalligraphyScene', CalligraphyScene, false);
      }
      const worldScene = phaserGame.scene.getScene('WorldScene');
      if (worldScene?.sceneStackManager) {
        worldScene.sceneStackManager.pushScene('CalligraphyScene', {
          letterId: data?.letterId || 'alif',
          returnSceneKey: 'WorldScene',
        });
      } else {
        // Fallback: launch directly if sceneStackManager unavailable
        phaserGame.scene.start('CalligraphyScene', {
          letterId: data?.letterId || 'alif',
          returnSceneKey: 'WorldScene',
        });
      }
    };

    EventBus.on(EVENTS.CALLIGRAPHY_LAUNCH_REQUESTED, handleCalligraphyLaunch);

    // Check for pending launch set by MiniGamesHub before navigation
    if (window.__pendingCalligraphyLaunch) {
      const data = window.__pendingCalligraphyLaunch;
      delete window.__pendingCalligraphyLaunch;
      // Small delay for Phaser to initialize
      setTimeout(() => handleCalligraphyLaunch(data), 800);
    }

    return () => {
      EventBus.off(EVENTS.CALLIGRAPHY_LAUNCH_REQUESTED, handleCalligraphyLaunch);
    };
  }, []);

  // Welcome splash — show when arriving at awaiting_mentor (after cinematic + path choice)
  const tutorialPhase = useSelector((state) => state.player.tutorialPhase);
  const prevPhaseRef = useRef(tutorialPhase);
  const [showWelcome, setShowWelcome] = React.useState(false);

  // Trigger welcome splash when transitioning into awaiting_mentor
  useEffect(() => {
    if (prevPhaseRef.current !== 'awaiting_mentor' && tutorialPhase === 'awaiting_mentor' && !onboardingSkip) {
      setShowWelcome(true);
    }
    prevPhaseRef.current = tutorialPhase;
  }, [tutorialPhase, onboardingSkip]);

  // J key toggles journal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'j' || e.key === 'J') {
        if (!anyOverlayOpen || journalOpen) {
          e.preventDefault();
          dispatch(journalOpen ? closeJournal() : openJournal());
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [anyOverlayOpen, journalOpen, dispatch]);

  // Freeze player when React overlays open (recipe book, crafting, inventory)
  useEffect(() => {
    if (recipeBookOpen || craftingMiniGameActive || inventoryOpen) {
      EventBus.emit(EVENTS.PLAYER_FREEZE);
    }
  }, [recipeBookOpen, craftingMiniGameActive, inventoryOpen]);

  // Safety net: if no overlays are open, ensure player is unfrozen
  // and refocus the Phaser canvas so keyboard input resumes.
  useEffect(() => {
    if (!anyOverlayOpen && !showWardrobe) {
      // Small delay to avoid race with overlay close animations
      const timer = setTimeout(() => {
        EventBus.emit(EVENTS.PLAYER_UNFREEZE);
        // Refocus the Phaser canvas so arrow keys work again
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [anyOverlayOpen, showWardrobe]);

  return (
    <div className={styles.container}>
      {/* Phaser canvas - full screen, lowest z-index */}
      <PhaserGame ref={phaserRef} />

      {/* Zone loading indicator -- shown during zone transition asset loading */}
      {zoneLoading && <div className={styles.zoneLoading}>Loading zone...</div>}

      {/* HUD overlay bar */}
      <HUD onMenu={() => { audioManager.playSFX('click'); dispatch(toggleMenu()); }} />

      {/* MiniMap - bottom right corner */}
      {location.pathname === '/game' && <MiniMap />}

      {/* Toast notifications */}
      <NotificationToast />

      {/* Achievement toast */}
      <Suspense fallback={null}><AchievementToast /></Suspense>

      {/* Streak reward toast */}
      <Suspense fallback={null}><StreakRewardToast /></Suspense>

      {/* Level up modal */}
      <Suspense fallback={null}><LevelUpModal /></Suspense>

      {/* Learning path choice — Scholar/Traveler/Historian (settings fallback only) */}
      {tutorialPhase === 'path_choice' && !pathAlreadyChosen && (
        <Suspense fallback={null}><PathChoice /></Suspense>
      )}

      {/* PATH-05: Settings-mode path switch (triggered from Activities menu) */}
      {showPathSwitch && (
        <Suspense fallback={null}>
          <PathChoice mode="settings" onClose={() => setShowPathSwitch(false)} />
        </Suspense>
      )}

      {/* Tutorial hints (non-blocking arrows/prompts) */}
      {!onboardingSkip && tutorialPhase !== 'cinematic_intro' && tutorialPhase !== 'path_choice' && (
        <Suspense fallback={null}><TutorialHints /></Suspense>
      )}

      {/* Welcome splash — auto-fades after 3 seconds */}
      {showWelcome && (
        <Suspense fallback={null}><WelcomeSplash onDone={() => setShowWelcome(false)} /></Suspense>
      )}

      {/* Conditional overlays */}
      {dialogueOpen && dialogueConfig?.type === 'quest-log' && (
        <Suspense fallback={null}><QuestLog /></Suspense>
      )}
      {dialogueOpen && dialogueConfig?.type === 'shop' && (
        <Suspense fallback={null}><ShopOverlay /></Suspense>
      )}
      {dialogueOpen && dialogueConfig?.type !== 'quest-log' && dialogueConfig?.type !== 'shop' && (
        <Suspense fallback={null}><DialogueOverlay /></Suspense>
      )}
      {quizOpen && (
        <Suspense fallback={null}><QuizOverlay /></Suspense>
      )}
      {signOpen && (
        <Suspense fallback={null}><SignOverlay /></Suspense>
      )}
      {objectInspectOpen && (
        <Suspense fallback={null}><ObjectInteractionOverlay /></Suspense>
      )}
      {menuOpen && (
        <Suspense fallback={null}>
          <PauseMenu
            onResume={() => dispatch(toggleMenu())}
            onMainMenu={() => {
              dispatch(toggleMenu());
              navigate('/');
            }}
            onNavigate={(path) => {
              dispatch(toggleMenu());
              navigate(path);
            }}
            onOpenWardrobe={() => {
              dispatch(toggleMenu());
              setShowWardrobe(true);
            }}
            onOpenPathSwitch={() => {
              dispatch(toggleMenu());
              setShowPathSwitch(true);
            }}
            onOpenFactionPanel={() => {
              dispatch(toggleMenu());
              setShowFactionPanel(true);
            }}
          />
        </Suspense>
      )}

      {/* Quest Journal overlay (v7.0) */}
      <AnimatePresence>
        {journalOpen && (
          <Suspense fallback={null}>
            <QuestJournal onClose={() => dispatch(closeJournal())} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Battle overlay (v6.0 turn-based combat) */}
      <Suspense fallback={null}>
        <BattleOverlay />
      </Suspense>

      {/* Magic overlay (v6.0 spell hotbar) */}
      <Suspense fallback={null}>
        <MagicOverlay />
      </Suspense>

      {/* Spell menu overlay */}
      <Suspense fallback={null}>
        <SpellMenu />
      </Suspense>

      {/* Root discovery toast */}
      <Suspense fallback={null}>
        <RootDiscoveryToast />
      </Suspense>

      {/* Inventory overlay (v6.0 equipment & inventory) */}
      <AnimatePresence>
        {inventoryOpen && (
          <Suspense fallback={null}>
            <InventoryUI onClose={() => dispatch(closeInventory())} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Wardrobe overlay */}
      <AnimatePresence>
        {showWardrobe && (
          <Suspense fallback={null}>
            <Wardrobe onClose={() => setShowWardrobe(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Faction panel overlay (Phase 53) */}
      {showFactionPanel && (
        <Suspense fallback={null}>
          <FactionPanel onClose={() => setShowFactionPanel(false)} />
        </Suspense>
      )}

      {/* Poetry battle overlay (Phase 55) — untimed fill-in-the-blank */}
      {poetryBattleData && (
        <Suspense fallback={null}>
          <PoetryBattleOverlay npcAccuracy={poetryBattleData.npcAccuracy ?? 0.7} />
        </Suspense>
      )}

      {/* Welcome Back overlay (Phase 69) — shown for returning players */}
      {showWelcomeBack && (
        <Suspense fallback={null}>
          <WelcomeBackOverlay
            onDismiss={handleWelcomeBackDismiss}
            onNavigate={handleWelcomeBackNavigate}
          />
        </Suspense>
      )}

      {/* WIRE-02: Micro-review overlay — zone-entry quick vocab reviews */}
      <AnimatePresence>
        {microReviewWordIds && (
          <Suspense fallback={null}>
            <MicroReviewOverlay
              wordIds={microReviewWordIds}
              onClose={handleMicroReviewClose}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* RecipeBook overlay (v6.1 crafting) */}
      <AnimatePresence>
        {recipeBookOpen && (
          <Suspense fallback={null}>
            <RecipeBook
              onClose={() => dispatch(closeRecipeBook())}
              onSelectRecipe={(recipeId, professionId) => {
                dispatch(closeRecipeBook());
                dispatch(startCraftingMiniGame({ recipeId, professionId }));
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* CraftingMiniGame overlay (v6.1 crafting) */}
      <AnimatePresence>
        {craftingMiniGameActive && craftingRecipeId && craftingProfessionId && (
          <Suspense fallback={null}>
            <CraftingMiniGame
              professionId={craftingProfessionId}
              recipeId={craftingRecipeId}
              onComplete={() => {
                dispatch(endCraftingMiniGame());
              }}
              onCancel={() => dispatch(endCraftingMiniGame())}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Outlet for nested routes (e.g., /game/map) with AnimatePresence */}
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}
