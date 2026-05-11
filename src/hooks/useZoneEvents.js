import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCurrentZone,
  unlockZone,
} from '../store/slices/playerSlice.js';
import {
  updateQuestProgress,
  completeQuest,
  checkPrerequisites,
  visitZone,
} from '../store/slices/questSlice.js';
import { showNotification } from '../store/slices/uiSlice.js';
import { adjustAlignment } from '../store/slices/factionSlice.js';
import { addJournalEntry, JOURNAL_CATEGORIES } from '../store/slices/journalSlice.js';
import { setWeeklyChallenge } from '../store/slices/endgameSlice.js';
import { selectFsrsCards } from '../store/slices/vocabularySlice.js';
import { getDueCards } from '../services/fsrs.js';
import { shuffle } from '../utils/shuffle.js';
import { FACTIONS } from '../data/factions.js';
import { WEEKLY_CHALLENGES } from '../data/weeklyRotation.js';
import questsData from '../data/quests.json';
import { loadZoneDialogue } from '../data/npcDialogueLoader.js';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';
import { audioManager } from '../services/audio.js';
import { store } from '../store/store.js';
import { ZONES } from '../data/zones.js';
import { ZONE_BGM_MAP, ZONE_NIGHT_BGM_MAP, ZONE_AMBIENT_LAYERS, INTERIOR_AMBIENT } from '../data/audioConfig.js';
import { selectTimePhase } from '../store/slices/timeSlice.js';

// Reverse map: npcId → factionId (built once at module load)
const NPC_FACTION_MAP = Object.fromEntries(
  FACTIONS.flatMap((f) => f.npcMembers.map((npcId) => [npcId, f.id]))
);

/**
 * useZoneEvents — Zone change, transition, unlock, and fast travel handlers
 */
export function useZoneEvents(phaserRef, playSFX) {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleZoneChange = ({ zone }) => {
      dispatch(setCurrentZone(zone));

      // Preload NPC dialogue for this zone (fire-and-forget)
      loadZoneDialogue(zone);

      // Play zone-specific BGM — use night ambient if currently night phase
      const timePhase = selectTimePhase(store.getState());
      const isNight = timePhase === 'night';
      const bgmTrack = isNight ? ZONE_NIGHT_BGM_MAP[zone] : ZONE_BGM_MAP[zone];
      if (bgmTrack) {
        audioManager.playBGM(bgmTrack);
      }

      // Start ambient sound layers for this zone
      const ambientLayers = ZONE_AMBIENT_LAYERS[zone];
      if (ambientLayers) {
        audioManager.playAmbient(ambientLayers);
      } else {
        audioManager.stopAmbient();
      }
      // Restore full ambient volume (in case we were inside a building)
      audioManager.unmuffleAmbient();

      // Journal: first zone visit (check BEFORE visitZone so the zone is not yet in the list)
      const zonesVisitedBefore = store.getState().quests.zonesVisited || [];
      if (!zonesVisitedBefore.includes(zone)) {
        const zoneLabel = zone.replace(/_/g, ' ');
        dispatch(addJournalEntry({
          text: `You entered ${zoneLabel} for the first time.`,
          textArabic: '',
          category: JOURNAL_CATEGORIES.TRAVEL,
        }));
      }

      // Track zone visit for exploration quests
      dispatch(visitZone(zone));

      // Read quests from store directly (not stale closure)
      const quests = store.getState().quests.quests;

      // WIRE-02: Zone-entry micro-review — trigger 2-3 FSRS-due word reviews
      const fsrsCards = selectFsrsCards(store.getState());
      const dueIds = getDueCards(fsrsCards);
      if (dueIds.length >= 2) {
        const now = Date.now();
        const cooldown = 5 * 60 * 1000; // 5 minutes between micro-reviews
        if (!handleZoneChange._lastMicroReview || now - handleZoneChange._lastMicroReview > cooldown) {
          handleZoneChange._lastMicroReview = now;
          const reviewIds = shuffle(dueIds).slice(0, 3);
          EventBus.emit(EVENTS.MICRO_REVIEW_TRIGGER, { wordIds: reviewIds });
        }
      }

      // Check zone exploration quests
      for (const qd of questsData) {
        if (qd.type === 'exploration' && qd.trackEvent === 'zones_visited' && quests[qd.id]?.status === 'active') {
          const currentState = store.getState();
          const zonesVisited = currentState.quests.zonesVisited || [];
          const visitedCount = zonesVisited.length;
          dispatch(updateQuestProgress({ questId: qd.id, amount: visitedCount }));
          if (visitedCount >= qd.target) {
            dispatch(completeQuest(qd.id));
            dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
            dispatch(checkPrerequisites(questsData));
            // Journal: quest completed
            dispatch(addJournalEntry({
              text: `Quest completed: "${qd.title}"`,
              textArabic: qd.titleArabic || '',
              category: JOURNAL_CATEGORIES.QUEST,
            }));
            // Faction: adjust alignment for quest giver's faction
            if (qd.npcGiver) {
              const factionId = NPC_FACTION_MAP[qd.npcGiver];
              if (factionId) {
                dispatch(adjustAlignment({ factionId, amount: 10 }));
              }
            }
          }
        }
      }
    };

    const handleCheckZoneUnlock = ({ zoneName, entryX, entryY, unlock }) => {
      // If no unlock requirement, allow transition
      if (!unlock) {
        EventBus.emit(EVENTS.ZONE_TRANSITION, { zoneName, entryX, entryY });
        return;
      }
      // Check quest completion — read quests from store directly
      const quests = store.getState().quests.quests;
      if (unlock.quest && quests[unlock.quest]?.status !== 'completed') {
        const qd = questsData.find((q) => q.id === unlock.quest);
        playSFX('wrong');
        dispatch(showNotification({
          message: `Locked! Complete: ${qd?.title || unlock.quest}`,
          type: 'quest',
        }));
        return;
      }
      // Check level
      const playerState = store.getState().player;
      if (unlock.minLevel && playerState.level < unlock.minLevel) {
        playSFX('wrong');
        dispatch(showNotification({
          message: `Locked! Need level ${unlock.minLevel}`,
          type: 'quest',
        }));
        return;
      }
      // Check words learned
      if (unlock.minWords && playerState.wordsLearned < unlock.minWords) {
        playSFX('wrong');
        dispatch(showNotification({
          message: `Locked! Need ${unlock.minWords} words learned`,
          type: 'quest',
        }));
        return;
      }
      // All checks passed — unlock the zone and transition
      dispatch(unlockZone(zoneName));
      EventBus.emit(EVENTS.ZONE_TRANSITION, { zoneName, entryX, entryY });
    };

    const handleZoneTransition = ({ zoneName, entryX, entryY }) => {
      playSFX('transition');
      // Get the WorldScene's zoneTransition system and trigger it
      const game = phaserRef.current?.game;
      if (game) {
        const worldScene = game.scene.getScene('WorldScene');
        if (worldScene?.zoneTransition) {
          worldScene.zoneTransition.transitionTo(zoneName, entryX, entryY);
        }
      }
    };

    const handleFastTravel = ({ zoneName }) => {
      // Fast travel from world map — get spawn point from zone data
      const zone = ZONES[zoneName];
      if (!zone) return;
      const entryX = zone.spawnPoint.x * 64;
      const entryY = zone.spawnPoint.y * 64;
      // Get the WorldScene's zoneTransition and trigger it
      const game = phaserRef.current?.game;
      if (game) {
        const worldScene = game.scene.getScene('WorldScene');
        if (worldScene?.zoneTransition) {
          worldScene.zoneTransition.transitionTo(zoneName, entryX, entryY);
        }
      }
    };

    const handlePhaseChanged = ({ phase }) => {
      // Get current zone from Redux state
      const currentZone = store.getState().player.currentZone;
      if (!currentZone) return;

      // Select appropriate BGM based on phase
      const isNight = phase === 'night';
      const bgmTrack = isNight
        ? ZONE_NIGHT_BGM_MAP[currentZone]
        : ZONE_BGM_MAP[currentZone];

      if (bgmTrack) {
        audioManager.playBGM(bgmTrack);
      }
    };

    // Muffle ambient when entering buildings, restore when exiting
    const handleBuildingEntered = () => {
      const muffle = INTERIOR_AMBIENT?.default?.muffle ?? 0.3;
      audioManager.muffleAmbient(muffle);
    };

    const handleBuildingExited = () => {
      audioManager.unmuffleAmbient();
    };

    EventBus.on(EVENTS.ZONE_CHANGE, handleZoneChange);
    EventBus.on(EVENTS.ZONE_CHECK_UNLOCK, handleCheckZoneUnlock);
    EventBus.on(EVENTS.ZONE_TRANSITION, handleZoneTransition);
    EventBus.on(EVENTS.FAST_TRAVEL, handleFastTravel);
    EventBus.on(EVENTS.TIME_PHASE_CHANGED, handlePhaseChanged);
    EventBus.on(EVENTS.BUILDING_ENTERED, handleBuildingEntered);
    EventBus.on(EVENTS.BUILDING_EXITED, handleBuildingExited);

    return () => {
      EventBus.off(EVENTS.ZONE_CHANGE, handleZoneChange);
      EventBus.off(EVENTS.ZONE_CHECK_UNLOCK, handleCheckZoneUnlock);
      EventBus.off(EVENTS.ZONE_TRANSITION, handleZoneTransition);
      EventBus.off(EVENTS.FAST_TRAVEL, handleFastTravel);
      EventBus.off(EVENTS.TIME_PHASE_CHANGED, handlePhaseChanged);
      EventBus.off(EVENTS.BUILDING_ENTERED, handleBuildingEntered);
      EventBus.off(EVENTS.BUILDING_EXITED, handleBuildingExited);
      audioManager.stopAmbient();
    };
  }, [dispatch, playSFX, phaserRef]);

  // Load the weekly challenge on mount — runs once when GameLayout mounts
  useEffect(() => {
    const existing = store.getState().endgame?.weeklyChallenge;
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    const clampedWeek = Math.max(1, Math.min(52, weekNum));
    const challenge = WEEKLY_CHALLENGES.find((c) => c.week === clampedWeek) || WEEKLY_CHALLENGES[0];
    if (!existing || existing.id !== challenge.id) {
      dispatch(setWeeklyChallenge(challenge));
    }
  }, [dispatch]);
}
