/**
 * SettingsMenuExport.test.jsx
 * Phase 74 — Task 3: Export My Progress button in SettingsMenu
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import SettingsMenu from '../SettingsMenu.jsx';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}));

global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('SettingsMenu Export Button', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Export My Progress label and button', () => {
    renderWithProviders(<SettingsMenu onBack={mockOnBack} />);
    expect(screen.getByText('Export My Progress')).toBeInTheDocument();
    expect(screen.getByLabelText(/Export my learning progress/i)).toBeInTheDocument();
  });

  it('renders the Data section heading', () => {
    renderWithProviders(<SettingsMenu onBack={mockOnBack} />);
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('opens ExportProgress overlay when Export button is clicked', () => {
    renderWithProviders(<SettingsMenu onBack={mockOnBack} />);
    const exportBtn = screen.getByLabelText(/Export my learning progress/i);
    fireEvent.click(exportBtn);
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('closes ExportProgress overlay when Back is clicked', () => {
    renderWithProviders(<SettingsMenu onBack={mockOnBack} />);
    const exportBtn = screen.getByLabelText(/Export my learning progress/i);
    fireEvent.click(exportBtn);
    const backBtn = screen.getByLabelText('Back to settings menu');
    fireEvent.click(backBtn);
    expect(screen.queryByText('Export JSON')).not.toBeInTheDocument();
  });
});
