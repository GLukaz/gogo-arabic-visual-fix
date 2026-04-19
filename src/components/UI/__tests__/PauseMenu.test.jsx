import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import PauseMenu from '../PauseMenu.jsx';

describe('PauseMenu', () => {
  let mockOnResume;
  let mockOnMainMenu;

  beforeEach(() => {
    mockOnResume = vi.fn();
    mockOnMainMenu = vi.fn();
  });

  it('should render menu title', () => {
    renderWithProviders(<PauseMenu onResume={mockOnResume} onMainMenu={mockOnMainMenu} />);

    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('should render Resume and Main Menu buttons', () => {
    renderWithProviders(<PauseMenu onResume={mockOnResume} onMainMenu={mockOnMainMenu} />);

    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  it('should call onResume when Resume button is clicked', () => {
    renderWithProviders(<PauseMenu onResume={mockOnResume} onMainMenu={mockOnMainMenu} />);

    const resumeButton = screen.getByText('Resume');
    fireEvent.click(resumeButton);

    expect(mockOnResume).toHaveBeenCalledTimes(1);
  });

  it('should call onMainMenu when Main Menu button is clicked', () => {
    renderWithProviders(<PauseMenu onResume={mockOnResume} onMainMenu={mockOnMainMenu} />);

    const mainMenuButton = screen.getByText('Main Menu');
    fireEvent.click(mainMenuButton);

    expect(mockOnMainMenu).toHaveBeenCalledTimes(1);
  });

  it('should NOT call callbacks when buttons are not clicked', () => {
    renderWithProviders(<PauseMenu onResume={mockOnResume} onMainMenu={mockOnMainMenu} />);

    // Just render, don't interact
    expect(mockOnResume).not.toHaveBeenCalled();
    expect(mockOnMainMenu).not.toHaveBeenCalled();
  });
});
