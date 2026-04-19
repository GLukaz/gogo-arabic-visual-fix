import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Detects if text contains Arabic characters
 */
function hasArabic(text) {
  if (!text) return false;
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/**
 * Detects if character is punctuation that should trigger a pause
 */
function isPunctuation(char) {
  return /[،.!?؟]/.test(char);
}

/**
 * useTypewriter hook
 * Reveals text character-by-character with configurable speed
 *
 * @param {string} text - The full text to reveal
 * @param {number} baseSpeed - Default speed in milliseconds per character (default: 30ms)
 * @returns {Object} { displayText, isComplete, skip }
 *
 * Features:
 * - Auto-detects Arabic text and slows down (40ms vs 30ms)
 * - Pauses 200ms on punctuation marks
 * - Respects prefers-reduced-motion
 * - Clean interval management with useRef
 * - Skip function to instantly reveal full text
 *
 * Usage:
 * const { displayText, isComplete, skip } = useTypewriter(line.arabic, 30);
 */
export function useTypewriter(text, baseSpeed = 30) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  /**
   * Skip to full text immediately
   */
  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    setDisplayText(text || '');
    setCurrentIndex(text?.length || 0);
    setIsComplete(true);
  }, [text]);

  // Reset when text changes
  useEffect(() => {
    // Cleanup previous intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    mountedRef.current = true;

    // If no text or reduced motion, show instantly
    if (!text || prefersReducedMotion) {
      setDisplayText(text || '');
      setCurrentIndex(text?.length || 0);
      setIsComplete(true);
      return;
    }

    // Reset state
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);

    // Determine speed based on text content
    const isArabicText = hasArabic(text);
    const speed = isArabicText ? 40 : baseSpeed;

    let index = 0;

    const typeNextChar = () => {
      if (index >= text.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsComplete(true);
        return;
      }

      const char = text[index];
      setDisplayText(text.substring(0, index + 1));
      setCurrentIndex(index + 1);
      index++;

      // If this is punctuation, pause before continuing
      if (isPunctuation(char)) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        pauseTimeoutRef.current = setTimeout(() => {
          pauseTimeoutRef.current = null;
          // Guard: don't resume if effect was cleaned up during pause
          if (!mountedRef.current) return;
          // Resume typing after pause
          intervalRef.current = setInterval(typeNextChar, speed);
        }, 200);
      }
    };

    // Start typing
    intervalRef.current = setInterval(typeNextChar, speed);

    // Cleanup on unmount or text change
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    };
  }, [text, baseSpeed, prefersReducedMotion]);

  return {
    displayText,
    isComplete,
    skip,
  };
}
