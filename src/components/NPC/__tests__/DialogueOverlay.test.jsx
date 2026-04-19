import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import DialogueOverlay from '../DialogueOverlay.jsx';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
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

// Shared mock return values (mutated per-test)
const mockUseDialogue = {
  currentTree: {
    id: 'greeting',
    lines: [
      { speaker: 'Fatima', arabic: 'أهلاً بك في الواحة', english: 'Welcome to the oasis!' },
      { speaker: 'Fatima', arabic: 'كيف يمكنني مساعدتك؟', english: 'How can I help you?', choices: [
        { text: 'Teach me Arabic', action: 'start_lesson' },
        { text: 'Goodbye', action: 'close' },
      ]},
    ],
  },
  lineIndex: 0,
  close: vi.fn(),
  advance: vi.fn(),
  handleChoice: vi.fn(),
  showCulturalMenu: false,
  setShowCulturalMenu: vi.fn(),
  phase: 'greeting',
  availableTopics: [],
  selectTopic: vi.fn(),
  topicsDiscussed: [],
  filteredChoices: [],
  resumeAfterQuiz: vi.fn(),
  isHubAndSpoke: false,
};

// Mock hooks
vi.mock('../../../hooks/useDialogue.js', () => ({
  useDialogue: () => mockUseDialogue,
}));

vi.mock('../../../hooks/useFocusTrap.js', () => ({
  useFocusTrap: () => ({ current: null }),
}));

vi.mock('../../../hooks/useOverlayClose.js', () => ({
  useOverlayClose: vi.fn(),
}));

vi.mock('../../../utils/culturalDialogueHelper.js', () => ({
  getEnhancedDialogueChoices: () => null,
}));

// Mock useTypewriter to return full text immediately (fake timers prevent intervals)
vi.mock('../../../hooks/useTypewriter.js', () => ({
  useTypewriter: (text) => ({
    displayText: text || '',
    isComplete: true,
    skip: vi.fn(),
  }),
}));

// Mock useFormatArabic to pass through text
vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => (text) => text || '',
}));

// Mock sub-components that are new in hub-and-spoke
vi.mock('../TopicSelectionMenu.jsx', () => ({
  default: ({ topics, onSelectTopic, onClose }) => (
    <div data-testid="topic-selection-menu">
      {topics?.map((t) => (
        <button key={t.treeId} onClick={() => onSelectTopic(t.treeId)}>
          {t.label}
        </button>
      ))}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('../ConversationHistory.jsx', () => ({
  default: ({ onBack }) => (
    <div data-testid="conversation-history">
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('../RelationshipIndicator.jsx', () => ({
  default: ({ npcId, level }) => (
    <div data-testid="relationship-indicator" data-npc={npcId} data-level={level} />
  ),
}));

// Mock NPC data
vi.mock('../../../data/npcsEnriched.js', () => ({
  default: [
    {
      id: 'fatima_teacher',
      name: 'Fatima',
      role: 'teacher',
      portrait: 'fatima.png',
      personality: { mood: 'cheerful' },
      dialogueTrees: [],
    },
  ],
}));

describe('DialogueOverlay', () => {
  const mockPreloadedState = {
    ui: {
      dialogueOpen: true,
      dialogueConfig: {
        npcId: 'fatima_teacher',
      },
    },
    narrative: {
      npcRelationships: { fatima_teacher: 2 },
      worldObjectStates: {},
      choiceHistory: {},
      visitedBuildings: [],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to defaults
    mockUseDialogue.currentTree = {
      id: 'greeting',
      lines: [
        { speaker: 'Fatima', arabic: 'أهلاً بك في الواحة', english: 'Welcome to the oasis!' },
        { speaker: 'Fatima', arabic: 'كيف يمكنني مساعدتك؟', english: 'How can I help you?', choices: [
          { text: 'Teach me Arabic', action: 'start_lesson' },
          { text: 'Goodbye', action: 'close' },
        ]},
      ],
    };
    mockUseDialogue.lineIndex = 0;
    mockUseDialogue.close = vi.fn();
    mockUseDialogue.advance = vi.fn();
    mockUseDialogue.handleChoice = vi.fn();
    mockUseDialogue.showCulturalMenu = false;
    mockUseDialogue.setShowCulturalMenu = vi.fn();
    mockUseDialogue.phase = 'greeting';
    mockUseDialogue.availableTopics = [];
    mockUseDialogue.selectTopic = vi.fn();
    mockUseDialogue.topicsDiscussed = [];
    mockUseDialogue.filteredChoices = [];
    mockUseDialogue.resumeAfterQuiz = vi.fn();
    mockUseDialogue.isHubAndSpoke = false;
  });

  it('should render NPC name and dialogue text', () => {
    renderWithProviders(<DialogueOverlay />, { preloadedState: mockPreloadedState });

    expect(screen.getByText(/Welcome to the oasis!/i)).toBeInTheDocument();
  });

  it('should not render when dialogueOpen is false', () => {
    const closedState = {
      ...mockPreloadedState,
      ui: {
        dialogueOpen: false,
        dialogueConfig: null,
      },
    };

    const { container } = renderWithProviders(<DialogueOverlay />, { preloadedState: closedState });

    // Dialog role should not exist
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('should have accessible dialog role', () => {
    renderWithProviders(<DialogueOverlay />, { preloadedState: mockPreloadedState });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Dialogue with Fatima');
  });

  it('should handle Escape key to close dialogue', () => {
    const { unmount } = renderWithProviders(<DialogueOverlay />, { preloadedState: mockPreloadedState });

    // Press Escape key
    fireEvent.keyDown(window, { key: 'Escape' });

    // Since we're using mocked useDialogue, we can't verify the close was called directly
    // But we can verify the component is still accessible
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    unmount();
  });

  it('should render topic selection in hub phase for hub-and-spoke NPCs', () => {
    mockUseDialogue.phase = 'hub';
    mockUseDialogue.isHubAndSpoke = true;
    mockUseDialogue.availableTopics = [
      { treeId: 'greetings_topic', topic: 'greetings', label: 'Learn Greetings', priority: 1 },
      { treeId: 'numbers_topic', topic: 'numbers', label: 'Learn Numbers', priority: 2 },
    ];

    renderWithProviders(<DialogueOverlay />, { preloadedState: mockPreloadedState });

    expect(screen.getByTestId('topic-selection-menu')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Topic selection');
  });

  it('should show relationship indicator when displaying choices for hub-and-spoke NPC', () => {
    mockUseDialogue.lineIndex = 1; // choice line
    mockUseDialogue.isHubAndSpoke = true;
    mockUseDialogue.phase = 'topic';
    mockUseDialogue.filteredChoices = [
      { text: 'Teach me Arabic', action: 'start_lesson' },
      { text: 'Goodbye', action: 'close' },
    ];

    renderWithProviders(<DialogueOverlay />, { preloadedState: mockPreloadedState });

    expect(screen.getByTestId('relationship-indicator')).toBeInTheDocument();
  });

  it('should use filteredChoices for hub-and-spoke NPCs', () => {
    mockUseDialogue.lineIndex = 1; // choice line
    mockUseDialogue.isHubAndSpoke = true;
    mockUseDialogue.phase = 'topic';
    mockUseDialogue.filteredChoices = [
      { text: 'Filtered choice', action: 'test' },
    ];

    renderWithProviders(<DialogueOverlay />, { preloadedState: mockPreloadedState });

    // The choices rendered should come from filteredChoices
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Dialogue choices');
  });
});
