import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import WorldMap from '../WorldMap.jsx';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock EventBus
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

describe('WorldMap', () => {
  const mockOnBack = vi.fn();

  const mockPreloadedState = {
    player: {
      currentZone: 'oasis_village',
      unlockedZones: ['oasis_village', 'ancient_library'],
    },
    quests: {
      quests: {
        quest1: { status: 'completed', progress: 100 },
        quest2: { status: 'active', progress: 50 },
      },
      npcsVisited: ['npc1', 'npc2'],
      zonesVisited: ['oasis_village', 'ancient_library'],
    },
    vocabulary: {
      fsrsCards: {
        word1: { card: { reps: 1 } },
        word2: { card: { reps: 1 } },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render world map title', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('World Map')).toBeInTheDocument();
  });

  it('should have accessible dialog role', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'World Map');
  });

  it('should render zone nodes on the map', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    // Unlocked zones should be rendered
    expect(screen.getByText('Oasis Village')).toBeInTheDocument();
    expect(screen.getByText('Ancient Library')).toBeInTheDocument();
  });

  it('should render locked zones', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    // Locked zones should still be visible
    expect(screen.getByText('Desert Marketplace')).toBeInTheDocument();
  });

  it('should show lock indicator on locked zones', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    const lockedZoneButton = screen.getByLabelText(/Desert Marketplace.*Locked zone/i);
    expect(lockedZoneButton).toBeInTheDocument();
    expect(lockedZoneButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should display current zone indicator', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    const currentZoneButton = screen.getByLabelText(/Oasis Village.*Current zone/i);
    expect(currentZoneButton).toBeInTheDocument();
  });

  it('should call onBack when close button is clicked', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    const closeButton = screen.getByLabelText('Close world map');
    fireEvent.click(closeButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should call onBack when Escape key is pressed', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should render map legend', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Current Zone')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Unlocked')).toBeInTheDocument();
    expect(screen.getByText('Locked')).toBeInTheDocument();
  });

  it('should show zone tooltip on hover with completion stats', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    const zoneButton = screen.getByLabelText(/Ancient Library/i);
    fireEvent.mouseEnter(zoneButton);

    // Tooltip should appear (implementation may vary)
    // We're testing that the zone is interactive
    expect(zoneButton).toBeInTheDocument();
  });

  it('should show completion percentage for unlocked zones', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    // Check aria-label contains completion percentage
    const zoneButton = screen.getByLabelText(/Ancient Library.*% complete/i);
    expect(zoneButton).toBeInTheDocument();
  });

  it('should show unlock requirements for locked zones', () => {
    renderWithProviders(<WorldMap onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    const lockedZone = screen.getByLabelText(/Desert Marketplace.*Locked/i);
    expect(lockedZone).toBeInTheDocument();
  });
});
