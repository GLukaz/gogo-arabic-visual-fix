import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  completeOnboarding,
  setOnboardingTargetNpc,
  setTutorialPhase,
} from '../../store/slices/playerSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './TutorialHints.module.css';

/**
 * WelcomeSplash — Brief "Welcome back" overlay that auto-fades.
 */
export function WelcomeSplash({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.splashOverlay}>
      <div className={styles.splashPanel}>
        Welcome to Gogo Arabic
      </div>
    </div>
  );
}

/**
 * TutorialHints
 *
 * Minimal in-world hint system replacing ContextualOnboarding.
 * Shows floating arrows pointing toward tutorial targets and contextual prompts.
 * Does NOT block gameplay — purely visual guidance.
 *
 * Phases:
 * - awaiting_mentor: Arrow pointing down toward Guide Amira + "Walk to the guide"
 * - met_mentor: (nothing — dialogue overlay handles this)
 * - learned_word: Arrow pointing toward Scholar Yusuf + "Talk to Scholar Yusuf"
 * - met_yusuf / complete: nothing (component unmounted by parent)
 */
export default function TutorialHints() {
  const dispatch = useDispatch();
  const tutorialPhase = useSelector((s) => s.player.tutorialPhase);
  const onboardingComplete = useSelector((s) => s.player.onboardingComplete);

  // Track player position for arrow direction
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [nearMentor, setNearMentor] = useState(false);

  // Mentor and Scholar positions in screen coords (updated from Phaser position events)
  // We use viewport center as a reference and show arrows at screen edges
  const MENTOR_WORLD = useMemo(() => ({ x: 14 * 64, y: 18 * 64 }), []);
  const SCHOLAR_WORLD = useMemo(() => ({ x: 9 * 64, y: 6 * 64 }), []);

  const handlePositionUpdate = useCallback(({ x, y }) => {
    setPlayerPos({ x, y });

    // Check proximity to mentor (2 tiles)
    const distToMentor = Math.sqrt(
      (x - MENTOR_WORLD.x) ** 2 + (y - MENTOR_WORLD.y) ** 2
    );
    setNearMentor(distToMentor < 128);
  }, [MENTOR_WORLD]);

  useEffect(() => {
    EventBus.on(EVENTS.PLAYER_POSITION_UPDATE, handlePositionUpdate);
    return () => EventBus.off(EVENTS.PLAYER_POSITION_UPDATE, handlePositionUpdate);
  }, [handlePositionUpdate]);

  const handleSkip = useCallback(() => {
    dispatch(setTutorialPhase('complete'));
    dispatch(completeOnboarding());
    dispatch(setOnboardingTargetNpc(null));
  }, [dispatch]);

  // ESC to skip
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleSkip]);

  if (onboardingComplete) return null;

  // Calculate arrow direction to target
  const getArrowStyle = (targetWorld) => {
    const dx = targetWorld.x - playerPos.x;
    const dy = targetWorld.y - playerPos.y;
    const angle = Math.atan2(dy, dx);

    // Position arrow at viewport center offset toward target
    const radius = 80;
    const cx = window.innerWidth / 2 + Math.cos(angle) * radius;
    const cy = window.innerHeight / 2 + Math.sin(angle) * radius;

    return {
      left: `${cx}px`,
      top: `${cy}px`,
      transform: `rotate(${angle + Math.PI / 2}rad)`,
    };
  };

  // Phase: awaiting_mentor — show arrow to Amira
  if (tutorialPhase === 'awaiting_mentor') {
    return (
      <div className={styles.container}>
        <button className={styles.skipBtn} onClick={handleSkip}>
          Skip Tutorial
        </button>

        {nearMentor ? (
          <div
            className={styles.prompt}
            style={{
              left: '50%',
              top: '40%',
              transform: 'translateX(-50%)',
            }}
          >
            Press SPACE to talk
          </div>
        ) : (
          <>
            <div
              className={styles.arrow}
              style={getArrowStyle(MENTOR_WORLD)}
            />
            <div
              className={styles.prompt}
              style={{
                left: '50%',
                bottom: '15%',
                transform: 'translateX(-50%)',
              }}
            >
              Walk to Guide Amira
            </div>
          </>
        )}
      </div>
    );
  }

  // Phase: learned_word — show arrow to Scholar Yusuf
  if (tutorialPhase === 'learned_word') {
    return (
      <div className={styles.container}>
        <button className={styles.skipBtn} onClick={handleSkip}>
          Skip Tutorial
        </button>

        <div
          className={styles.arrow}
          style={getArrowStyle(SCHOLAR_WORLD)}
        />
        <div
          className={styles.prompt}
          style={{
            left: '50%',
            bottom: '15%',
            transform: 'translateX(-50%)',
          }}
        >
          Talk to Scholar Yusuf
        </div>
      </div>
    );
  }

  // met_mentor phase: dialogue is handling everything, just show skip
  if (tutorialPhase === 'met_mentor') {
    return (
      <div className={styles.container}>
        <button className={styles.skipBtn} onClick={handleSkip}>
          Skip Tutorial
        </button>
      </div>
    );
  }

  return null;
}

