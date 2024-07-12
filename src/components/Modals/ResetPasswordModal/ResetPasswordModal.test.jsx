import React from 'react';
import { render, screen } from '@testing-library/react';
import ResetPasswordModal from './ResetPasswordModal';


jest.mock('../../../services/userServices', () => ({
  resetPassword: jest.fn(),
}));

describe('ResetPasswordModal', () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    render(<ResetPasswordModal show={true} handleClose={handleClose} />);
  });

  test('renders the modal with correct title', () => {
    expect(screen.getByText(/please insert your email/i)).toBeInTheDocument();
  });

  test('renders email input correctly', () => {
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('displays info text about email submission', () => {
    expect(screen.getByText(/by clicking submit an email will be sent/i)).toBeInTheDocument();
  });
});
