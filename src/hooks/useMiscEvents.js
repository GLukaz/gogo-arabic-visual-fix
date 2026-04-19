import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openQuiz, openDialogue } from '../store/slices/uiSlice.js';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';
import { audioManager } from '../services/audio.js';

/**
 * useMiscEvents — Quiz, SFX, VFX, navigation, and achievement event handlers
 */
export function useMiscEvents(phaserRef, playSFX, navigate) {
  const dispatch = useDispatch();
  const newAchievements = useSelector((state) => state.achievements.newAchievements);
  const prevAchievementCountRef = useRef(0);

  useEffect(() => {
    const handleOpenQuiz = (quizConfig) => {
      audioManager.pauseBGM();
      dispatch(openQuiz(quizConfig));
    };

    const handleOpenAlphabet = () => {
      navigate('/alphabet');
    };

    const handleOpenReviewSession = () => {
      navigate('/review');
    };

    const handleOpenWorldMap = () => {
      navigate('/game/map');
    };

    // SFX event handlers + VFX triggers
    const handleSfxCorrect = () => {
      playSFX('correct');
      EventBus.emit(EVENTS.VFX_SHAKE, { intensity: 'light' });
    };
    const handleSfxWrong = () => playSFX('wrong');
    const handleSfxWordlearned = () => playSFX('wordlearned');
    const handleSfxLevelup = () => {
      playSFX('levelup');
      EventBus.emit(EVENTS.VFX_SHAKE, { intensity: 'heavy' });
      EventBus.emit(EVENTS.VFX_PARTICLES_BURST, { config: { count: 30, tint: 0xe2b659 } });
      EventBus.emit(EVENTS.VFX_PARTICLES_CONTINUOUS, { config: { duration: 3000, tint: 0xe2b659 } });
    };
    const handleSfxQuest = () => playSFX('quest');
    const handleSfxClick = () => playSFX('click');

    // BGM resume when quiz closes
    const handleQuizClosed = () => audioManager.resumeBGM();

    EventBus.on(EVENTS.QUIZ_OPEN, handleOpenQuiz);
    EventBus.on(EVENTS.QUIZ_CLOSED, handleQuizClosed);
    EventBus.on(EVENTS.ALPHABET_OPEN, handleOpenAlphabet);
    EventBus.on(EVENTS.REVIEW_SESSION_OPEN, handleOpenReviewSession);
    EventBus.on(EVENTS.WORLD_MAP_OPEN, handleOpenWorldMap);
    EventBus.on(EVENTS.SFX_CORRECT, handleSfxCorrect);
    EventBus.on(EVENTS.SFX_WRONG, handleSfxWrong);
    EventBus.on(EVENTS.SFX_WORDLEARNED, handleSfxWordlearned);
    EventBus.on(EVENTS.SFX_LEVELUP, handleSfxLevelup);
    EventBus.on(EVENTS.SFX_QUEST, handleSfxQuest);
    EventBus.on(EVENTS.SFX_CLICK, handleSfxClick);

    // Shop open handler — bridges EventBus SHOP_OPEN to Redux dialogue state
    const handleShopOpen = ({ npcId }) => {
      dispatch(openDialogue({ type: 'shop', npcId }));
    };
    EventBus.on(EVENTS.SHOP_OPEN, handleShopOpen);

    return () => {
      EventBus.off(EVENTS.QUIZ_OPEN, handleOpenQuiz);
      EventBus.off(EVENTS.QUIZ_CLOSED, handleQuizClosed);
      EventBus.off(EVENTS.ALPHABET_OPEN, handleOpenAlphabet);
      EventBus.off(EVENTS.REVIEW_SESSION_OPEN, handleOpenReviewSession);
      EventBus.off(EVENTS.WORLD_MAP_OPEN, handleOpenWorldMap);
      EventBus.off(EVENTS.SFX_CORRECT, handleSfxCorrect);
      EventBus.off(EVENTS.SFX_WRONG, handleSfxWrong);
      EventBus.off(EVENTS.SFX_WORDLEARNED, handleSfxWordlearned);
      EventBus.off(EVENTS.SFX_LEVELUP, handleSfxLevelup);
      EventBus.off(EVENTS.SFX_QUEST, handleSfxQuest);
      EventBus.off(EVENTS.SFX_CLICK, handleSfxClick);
      EventBus.off(EVENTS.SHOP_OPEN, handleShopOpen);
    };
  }, [dispatch, playSFX, phaserRef, navigate]);

  // VFX on achievement unlock — fires when newAchievements array grows
  useEffect(() => {
    if (newAchievements.length > prevAchievementCountRef.current) {
      EventBus.emit(EVENTS.VFX_SHAKE, { intensity: 'medium' });
      EventBus.emit(EVENTS.VFX_PARTICLES_BURST, { config: { count: 25, tint: 0xffd700 } });
    }
    prevAchievementCountRef.current = newAchievements.length;
  }, [newAchievements]);
}
