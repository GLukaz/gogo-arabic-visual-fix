import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom navigation hook that wraps react-router's useNavigate
 * Provides semantic navigation methods for the game
 */
export function useGameNavigation() {
  const navigate = useNavigate();

  const goToMenu = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const goToCharacterCreation = useCallback(() => {
    navigate('/character/create');
  }, [navigate]);

  const goToGame = useCallback(() => {
    navigate('/game');
  }, [navigate]);

  const goToAlphabet = useCallback(() => {
    navigate('/alphabet');
  }, [navigate]);

  const goToReview = useCallback(() => {
    navigate('/review');
  }, [navigate]);

  const goToSettings = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  const goToWorldMap = useCallback(() => {
    navigate('/game/map');
  }, [navigate]);

  const goToStats = useCallback(() => {
    navigate('/stats');
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const goToGrammar = useCallback(() => {
    navigate('/grammar');
  }, [navigate]);

  const goToBattle = useCallback((bossId) => {
    navigate(`/battle?boss=${bossId}`);
  }, [navigate]);

  const goToMiniGames = useCallback(() => {
    navigate('/mini-games');
  }, [navigate]);

  const goToWordSearch = useCallback(() => {
    navigate('/mini-games/word-search');
  }, [navigate]);

  const goToReading = useCallback(() => {
    navigate('/mini-games/reading');
  }, [navigate]);

  const goToRoots = useCallback(() => {
    navigate('/roots');
  }, [navigate]);

  const goToLearningPath = useCallback(() => {
    navigate('/learning-path');
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Generic navigate function for custom paths
  const goTo = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return {
    navigate,
    goToMenu,
    goToCharacterCreation,
    goToGame,
    goToAlphabet,
    goToReview,
    goToSettings,
    goToWorldMap,
    goToStats,
    goToDashboard,
    goToGrammar,
    goToBattle,
    goToMiniGames,
    goToWordSearch,
    goToReading,
    goToRoots,
    goToLearningPath,
    goBack,
    goTo,
  };
}
