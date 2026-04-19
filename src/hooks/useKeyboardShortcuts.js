import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openRecipeBook, selectAnyOverlayOpen } from '../store/slices/uiSlice.js';

/**
 * useKeyboardShortcuts
 * Game keyboard shortcuts (M for map, L for alphabet, R for RecipeBook)
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dialogueOpen = useSelector((state) => state.ui.dialogueOpen);
  const quizOpen = useSelector((state) => state.ui.quizOpen);
  const menuOpen = useSelector((state) => state.ui.menuOpen);
  const signOpen = useSelector((state) => state.ui.signOpen);
  const anyOverlayOpen = useSelector(selectAnyOverlayOpen);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Don't trigger if a modal/overlay is open
      if (dialogueOpen || quizOpen || menuOpen || signOpen) return;

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        navigate('/game/map');
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        navigate('/alphabet');
      } else if ((e.key === 'r' || e.key === 'R') && !anyOverlayOpen) {
        e.preventDefault();
        dispatch(openRecipeBook());
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate, dispatch, dialogueOpen, quizOpen, menuOpen, signOpen, anyOverlayOpen]);
}
