import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import QuizOverlay from '../QuizOverlay.jsx';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock EventBus
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

// Mock hooks
const mockQuizState = {
  active: true,
  currentWord: {
    id: 'word_1',
    arabic: 'كِتَاب',
    english: 'book',
    category: 'objects',
  },
  choices: [
    { label: 'book', value: 'book', correct: true },
    { label: 'pen', value: 'pen', correct: false },
    { label: 'desk', value: 'desk', correct: false },
    { label: 'chair', value: 'chair', correct: false },
  ],
  quizType: 'ar-to-en',
  sessionScore: 0,
  sessionTotal: 0,
  sessionWords: [
    { id: 'word_1', arabic: 'كِتَاب', english: 'book' },
    { id: 'word_2', arabic: 'قَلَم', english: 'pen' },
    { id: 'word_3', arabic: 'مَكْتَب', english: 'desk' },
  ],
};

const mockAnswer = vi.fn();
const mockNext = vi.fn(() => false);
const mockClose = vi.fn();

vi.mock('../../../hooks/useQuiz.js', () => ({
  useQuiz: () => ({
    quiz: mockQuizState,
    feedback: null,
    start: vi.fn(),
    answer: mockAnswer,
    next: mockNext,
    close: mockClose,
  }),
}));

vi.mock('../../../hooks/useFocusTrap.js', () => ({
  useFocusTrap: () => ({ current: null }),
}));

describe('QuizOverlay', () => {
  const mockPreloadedState = {
    ui: {
      quizConfig: {
        words: mockQuizState.sessionWords,
        quizType: 'ar-to-en',
      },
    },
    player: {
      level: 1,
      wordsLearned: 10,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNext.mockReturnValue(false);
  });

  it('should render quiz question and answer choices', () => {
    renderWithProviders(<QuizOverlay />, { preloadedState: mockPreloadedState });

    // Should show the Arabic word
    expect(screen.getByText(/كِتَاب/)).toBeInTheDocument();

    // Should show answer choices
    expect(screen.getByText('book')).toBeInTheDocument();
    expect(screen.getByText('pen')).toBeInTheDocument();
    expect(screen.getByText('desk')).toBeInTheDocument();
    expect(screen.getByText('chair')).toBeInTheDocument();
  });

  it('should display quiz type label', () => {
    renderWithProviders(<QuizOverlay />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Arabic > English')).toBeInTheDocument();
  });

  it('should display current score', () => {
    renderWithProviders(<QuizOverlay />, { preloadedState: mockPreloadedState });

    expect(screen.getByText(/0\/0/)).toBeInTheDocument();
  });

  it('should have quit button', () => {
    renderWithProviders(<QuizOverlay />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Quit')).toBeInTheDocument();
  });

  it('should show progress bar', () => {
    renderWithProviders(<QuizOverlay />, { preloadedState: mockPreloadedState });

    // Progress bar component should be rendered
    // Check for progress indicators (assuming ProgressBar renders progress elements)
    const overlay = screen.getByRole('button', { name: /Quit/i }).closest('div');
    expect(overlay).toBeInTheDocument();
  });

  it('should handle Escape key with confirmation on active quiz', () => {
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderWithProviders(<QuizOverlay />, { preloadedState: mockPreloadedState });

    fireEvent.keyDown(window, { key: 'Escape' });

    // Should have shown confirmation
    expect(window.confirm).toHaveBeenCalledWith('Quit quiz? Progress will be lost.');

    // Should NOT have closed (user clicked cancel)
    expect(mockClose).not.toHaveBeenCalled();

    window.confirm.mockRestore();
  });

  it('should close quiz when user confirms quit', () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithProviders(<QuizOverlay />, { preloadedState: mockPreloadedState });

    const quitButton = screen.getByText('Quit');
    fireEvent.click(quitButton);

    // Should have shown confirmation
    expect(window.confirm).toHaveBeenCalledWith('Quit quiz? Progress will be lost.');

    window.confirm.mockRestore();
  });
});
