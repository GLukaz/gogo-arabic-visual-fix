import { useEffect, useRef } from 'react';

/**
 * Focus trap hook for modal overlays
 * Traps focus within the provided element and returns focus when unmounted
 *
 * @param {boolean} active - Whether the focus trap is active
 * @param {function} onEscape - Callback when Escape key is pressed
 */
export function useFocusTrap(active = true, onEscape = null) {
  const elementRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!active || !elementRef.current) return;

    // Store currently focused element
    previousFocusRef.current = document.activeElement;

    const trapElement = elementRef.current;

    // Focus first focusable element
    const focusableElements = trapElement.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (firstFocusable) {
      firstFocusable.focus();
    }

    const handleKeyDown = (e) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab key for focus trapping
      if (e.key === 'Tab') {
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    trapElement.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      trapElement.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously focused element
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, onEscape]);

  return elementRef;
}
