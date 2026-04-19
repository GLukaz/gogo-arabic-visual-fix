import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startSession, endSession, updateSessionTime } from '../store/slices/dailyGoalsSlice.js';

/**
 * useSessionTracking
 * Tracks session time for daily goals
 */
export function useSessionTracking() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Start session when component mounts
    dispatch(startSession());

    // Update session time every minute
    const sessionTimer = setInterval(() => {
      dispatch(updateSessionTime());
    }, 60000); // Every 60 seconds

    // End session when component unmounts
    return () => {
      clearInterval(sessionTimer);
      dispatch(endSession());
    };
  }, [dispatch]);
}
