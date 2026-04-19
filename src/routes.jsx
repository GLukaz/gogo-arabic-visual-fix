import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useSearchParams } from 'react-router-dom';
import { RouteErrorBoundary } from './components/ErrorBoundary/RouteErrorBoundary.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import NotFoundPage from './components/ErrorBoundary/NotFoundPage.jsx';
import LoadingScreen from './components/UI/LoadingScreen.jsx';
import PageTransition from './components/UI/PageTransition.jsx';
import { ProtectedRoute, CharacterCreationGuard } from './components/Router/ProtectedRoute.jsx';
import { useGameNavigation } from './hooks/useGameNavigation.js';

// Lazy-load GameLayout so all game system code (Phaser scenes, store reducers via hooks,
// overlays) is deferred until the user navigates to /game — keeps the main menu bundle lean.
const GameLayout = lazy(() => import('./components/Router/GameLayout.jsx'));

// Eager-load MainMenu (keep in main bundle for fast initial load)
import MainMenu from './components/Menu/MainMenu.jsx';

// Lazy-load all other screens for code splitting
const CharacterCreation = lazy(() => import('./components/Character/CharacterCreation.jsx'));
const AlphabetModule = lazy(() => import('./components/Alphabet/AlphabetModule.jsx'));
const ReviewSession = lazy(() => import('./components/Review/ReviewSession.jsx'));
const SettingsMenu = lazy(() => import('./components/Menu/SettingsMenu.jsx'));
const WorldMap = lazy(() => import('./components/World/WorldMap.jsx'));
const WordDuel = lazy(() => import('./components/Battle/WordDuel.jsx'));
const GrammarModule = lazy(() => import('./components/Grammar/GrammarModule.jsx'));
const GrammarLesson = lazy(() => import('./components/Grammar/GrammarLesson.jsx'));

// Phase 5-7-9 lazy imports
const DailyDashboard = lazy(() => import('./components/Dashboard/DailyDashboard.jsx'));
const PlayerProfile = lazy(() => import('./components/Profile/PlayerProfile.jsx'));

// Learning path lazy import
const LearningPath = lazy(() => import('./components/LearningPath/LearningPath.jsx'));

// Mini-games lazy imports
const MiniGamesHub = lazy(() => import('./components/MiniGames/MiniGamesHub.jsx'));
const WordSearch = lazy(() => import('./components/MiniGames/WordSearch.jsx'));
const ReadingExercise = lazy(() => import('./components/Reading/ReadingExercise.jsx'));
const RootExplorer = lazy(() => import('./components/Roots/RootExplorer.jsx'));

// Disconnected systems — now wired in
const SkillTreeMenu = lazy(() => import('./components/Skills/SkillTreeMenu.jsx'));
const SaveLoadMenu  = lazy(() => import('./components/SaveLoad/SaveLoadMenu.jsx'));
const CompletionTracker = lazy(() => import('./components/Endgame/CompletionTracker.jsx'));
const CodexMenu     = lazy(() => import('./components/Menu/CodexMenu.jsx'));
const AnalyticsDashboard = lazy(() => import('./components/Analytics/AnalyticsDashboard.jsx'));

function DashboardRoute() {
  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <DailyDashboard />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function StatsRoute() {
  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <PlayerProfile />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

// Route handlers that use the custom hook
function MainMenuRoute() {
  const { goToGame, goToAlphabet, goToReview, goToSettings, goToCharacterCreation, goToGrammar } = useGameNavigation();

  return (
    <PageTransition>
      <MainMenu
        onStartGame={goToGame}
        onAlphabet={goToAlphabet}
        onReview={goToReview}
        onSettings={goToSettings}
        onCharacterCreation={goToCharacterCreation}
        onGrammar={goToGrammar}
      />
    </PageTransition>
  );
}

function CharacterCreationRoute() {
  const { goToGame } = useGameNavigation();

  return (
    <PageTransition>
      <CharacterCreationGuard>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <CharacterCreation onDone={goToGame} />
          </Suspense>
        </ErrorBoundary>
      </CharacterCreationGuard>
    </PageTransition>
  );
}

function AlphabetRoute() {
  const { goToMenu } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <AlphabetModule onBack={goToMenu} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function ReviewRoute() {
  const { goToMenu } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <ReviewSession onBack={goToMenu} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function SettingsRoute() {
  const { goToMenu } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <SettingsMenu onBack={goToMenu} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function WorldMapRoute() {
  const { goBack } = useGameNavigation();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        background: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <WorldMap onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function GrammarRoute() {
  const { goToMenu } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <GrammarModule onBack={goToMenu} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function GrammarLessonRoute() {
  const { goBack } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <GrammarLesson onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function WordSearchDirectRoute() {
  const { goBack } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <WordSearch onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function BattleRoute() {
  const { goBack } = useGameNavigation();
  const [searchParams] = useSearchParams();
  const bossId = searchParams.get('boss') || 'oasis_spirit';

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <WordDuel bossId={bossId} onClose={goBack} />
      </Suspense>
    </ErrorBoundary>
  );
}

// Mini-games routes
function MiniGamesHubRoute() {
  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <MiniGamesHub />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function WordSearchRoute() {
  const { goBack } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <WordSearch onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function ReadingExerciseRoute() {
  const { goBack } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <ReadingExercise onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function LearningPathRoute() {
  const { goBack } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <LearningPath onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function RootExplorerRoute() {
  const { goToMenu } = useGameNavigation();

  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <RootExplorer onBack={goToMenu} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function SkillTreeRoute() {
  const { goBack } = useGameNavigation();
  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <SkillTreeMenu onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function SaveLoadRoute() {
  const { goBack } = useGameNavigation();
  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <SaveLoadMenu onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function CompletionTrackerRoute() {
  const { goBack } = useGameNavigation();
  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <CompletionTracker onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function CodexRoute() {
  const { goBack } = useGameNavigation();
  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <CodexMenu onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

function AnalyticsRoute() {
  const { goBack } = useGameNavigation();
  return (
    <PageTransition>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <AnalyticsDashboard onBack={goBack} />
        </Suspense>
      </ErrorBoundary>
    </PageTransition>
  );
}

/**
 * Route configuration using React Router v6
 * Code splitting applied to all routes except MainMenu
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainMenuRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/character/create',
    element: <CharacterCreationRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/alphabet',
    element: <AlphabetRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/review',
    element: <ReviewRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/settings',
    element: <SettingsRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/dashboard',
    element: <DashboardRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/stats',
    element: <StatsRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/grammar',
    element: <GrammarRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/grammar/:lessonId',
    element: <GrammarLessonRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/daily',
    element: <Navigate to="/dashboard" replace />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/word-search',
    element: <WordSearchDirectRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/battle',
    element: <BattleRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/mini-games',
    element: <MiniGamesHubRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/mini-games/word-search',
    element: <WordSearchRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/mini-games/reading',
    element: <ReadingExerciseRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/learning-path',
    element: <LearningPathRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/roots',
    element: <RootExplorerRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/skill-tree',
    element: <SkillTreeRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/save-load',
    element: <SaveLoadRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/completion',
    element: <CompletionTrackerRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/codex',
    element: <CodexRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/analytics',
    element: <AnalyticsRoute />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/game',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingScreen />}>
          <GameLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'map',
        element: <WorldMapRoute />,
      },
    ],
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);
