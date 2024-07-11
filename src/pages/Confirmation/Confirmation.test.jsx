import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Confirmation from './Confirmation';
import { getLabs, confirmUser } from '../../services/userServices';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ token: 'mockToken' }), // Mock useParams hook
  useNavigate: () => jest.fn(), // Mock useNavigate hook
}));

jest.mock('../../services/userServices', () => ({
  getLabs: jest.fn(),
  confirmUser: jest.fn(),
}));

describe('Confirmation Component', () => {
  beforeEach(() => {
    getLabs.mockResolvedValue([
      { location: 'Lab A' },
      { location: 'Lab B' },
      { location: 'Lab C' },
    ]);
  });

  test('renders error messages on form submission without required fields', async () => {
    render(<Confirmation />);

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    // Expect error messages to be displayed
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/usual work place is required/i)).toBeInTheDocument();

    // Expect no API calls to be made
    expect(confirmUser).not.toHaveBeenCalled();
  });
});
