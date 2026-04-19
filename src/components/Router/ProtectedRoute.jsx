import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Protects routes that require a character to exist
 * Redirects to character creation if no character name is set
 */
export function ProtectedRoute({ children }) {
  const playerName = useSelector((state) => state.player.name);

  if (!playerName || playerName.trim() === '') {
    return <Navigate to="/character/create" replace />;
  }

  return children;
}

/**
 * Redirects to game if character already exists
 * Used for character creation page
 */
export function CharacterCreationGuard({ children }) {
  const playerName = useSelector((state) => state.player.name);

  if (playerName && playerName.trim() !== '') {
    return <Navigate to="/game" replace />;
  }

  return children;
}
