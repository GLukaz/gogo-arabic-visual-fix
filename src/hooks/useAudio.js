import { useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';
import { audioManager } from '../services/audio.js';

/**
 * React hook that wraps the audioManager singleton and keeps its
 * channel volumes in sync with the Redux settings slice.
 *
 * Settings slice fields:
 *   masterVolume         (0-100) -> master channel (scales all)
 *   ambientVolume        (0-100) -> ambient channel
 *   bgmVolume            (0-100) -> bgm channel + ambient (music layer)
 *   sfxVolume            (0-100) -> sfx channel
 *   pronunciationVolume  (0-100) -> pronunciation channel
 *   isMuted              (bool)  -> global mute via Howler
 */
export function useAudio() {
  const settings = useSelector((state) => state.settings);

  // Sync audio manager volumes whenever Redux settings change
  useEffect(() => {
    audioManager.setMasterVolume(settings.masterVolume);
    audioManager.setBgmVolume(settings.bgmVolume);
    // Ambient sounds follow bgmVolume (music layer from user's perspective)
    audioManager.setAmbientVolume(settings.bgmVolume);
    audioManager.setSfxVolume(settings.sfxVolume);
    audioManager.setPronunciationVolume(settings.pronunciationVolume);

    // Sync mute state
    if (settings.isMuted) {
      audioManager.mute();
    } else {
      audioManager.unmute();
    }
  }, [
    settings.masterVolume,
    settings.bgmVolume,
    settings.sfxVolume,
    settings.pronunciationVolume,
    settings.isMuted,
  ]);

  return {
    playSFX: useCallback((name) => audioManager.playSFX(name), []),
    playWord: useCallback((wordId) => audioManager.playWord(wordId), []),
    playLetter: useCallback((letter) => audioManager.playLetter(letter), []),
    playAmbient: useCallback((zone) => audioManager.playAmbient(zone), []),
    stopAmbient: useCallback(() => audioManager.stopAmbient(), []),
    playBGM: useCallback((trackName) => audioManager.playBGM(trackName), []),
    stopBGM: useCallback(() => audioManager.stopBGM(), []),
    pauseBGM: useCallback(() => audioManager.pauseBGM(), []),
    resumeBGM: useCallback(() => audioManager.resumeBGM(), []),
  };
}
