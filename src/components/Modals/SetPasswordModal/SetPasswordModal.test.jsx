import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SetPasswordModal from './SetPasswordModal';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../services/userServices', () => ({
  confirmPasswordReset: jest.fn(),
}));

describe('SetPasswordModal', () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/reset/12345']}>
        <SetPasswordModal show={true} handleClose={handleClose} />
      </MemoryRouter>
    );
  });

  test('renders the modal with correct title', () => {
    expect(screen.getByText(/please enter your new password/i)).toBeInTheDocument();
  });


  test('renders password input fields correctly', () => {
    expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm new password/i)).toBeInTheDocument();
  });
});
