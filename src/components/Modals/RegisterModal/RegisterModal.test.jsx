import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterModal from './RegisterModal';
import userStore from '../../../stores/userStore';


jest.mock('../../../services/userServices', () => ({
  registerUser: jest.fn(),
}));

jest.mock('../../../stores/userStore', () => {
  const showRegister = jest.fn();
  const setShowRegister = jest.fn();
  return jest.fn(() => ({
    showRegister,
    setShowRegister,
  }));
});

describe('RegisterModal', () => {
  beforeEach(() => {
    userStore.mockImplementation(() => ({
      showRegister: true,
      setShowRegister: jest.fn(),
    }));
  });

  test('renders the modal with correct title', () => {
    render(<RegisterModal />);
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
  });

});
