import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider } from 'react-router-dom';
import { store, persistor } from './store/store.js';
import { router } from './routes.jsx';
import { initializeQuests, checkPrerequisites } from './store/slices/questSlice.js';
import { updateStreak } from './store/slices/playerSlice.js';
import { checkDailyReset } from './store/slices/dailyGoalsSlice.js';
import { initializeSkillTree } from './data/initializeSkillTree.js';
import { registerSW } from './services/swRegistration.js';
import { initOfflineSync } from './store/middleware/offlineFsrsMiddleware.js';
import { useAccessibilitySync } from './hooks/useAccessibilitySync.js';
import questsData from './data/quests.json';
import ErrorBoundaryClass from './components/ErrorBoundary/RouteErrorBoundary.jsx';
import LoadingScreen from './components/UI/LoadingScreen.jsx';
import AudioUnlockOverlay from './components/UI/AudioUnlockOverlay.jsx';
import UpdatePrompt from './components/UI/UpdatePrompt.jsx';

// Initialize app state on boot
store.dispatch(initializeQuests(questsData));
store.dispatch(checkPrerequisites(questsData));
store.dispatch(updateStreak()); // Update streak and check for rewards
store.dispatch(checkDailyReset()); // Reset daily goals if needed

// Initialize skill trees for existing players after rehydration completes.
// Called once — the function is idempotent and returns early if XP already exists.
let skillTreeInitCalled = false;
persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState();
  if (bootstrapped && !skillTreeInitCalled) {
    skillTreeInitCalled = true;
    initializeSkillTree(store);
  }
});

// Register service worker (production only) with update detection
let setUpdateAvailable = null;

/** Syncs accessibility data-attributes inside the Redux Provider. */
function AccessibilityBridge() {
  useAccessibilitySync();
  return null;
}

function AppRoot() {
  const [updateReady, setUpdateReady] = useState(false);
  setUpdateAvailable = setUpdateReady;

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AccessibilityBridge />
        <ErrorBoundaryClass>
          <AudioUnlockOverlay />
          <RouterProvider router={router} />
          {updateReady && (
            <UpdatePrompt onDismiss={() => setUpdateReady(false)} />
          )}
        </ErrorBoundaryClass>
      </PersistGate>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppRoot />);

// Register SW after render — callback triggers update prompt
registerSW(() => {
  if (setUpdateAvailable) setUpdateAvailable(true);
});

// Initialize offline FSRS sync — replays queued reviews when back online
initOfflineSync(store);
