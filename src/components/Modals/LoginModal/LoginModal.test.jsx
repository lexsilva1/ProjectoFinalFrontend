// LoginModal.test.jsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginModal from './LoginModal'; 
import userStore from '../../../stores/userStore'; 
import * as userServices from '../../../services/userServices'; 
import Cookies from 'js-cookie';

jest.mock('../../../stores/userStore'); 
jest.mock('../../../services/userServices'); 
jest.mock('js-cookie');

describe('LoginModal', () => {
  beforeEach(() => {
    // Mock the global state
    userStore.mockImplementation(callback =>
      callback({
        showLogin: true,
        setShowLogin: jest.fn(),
        notifications: [],
        setNotifications: jest.fn(),
      })
    );

    // Reset mocks before each test
    userServices.login.mockReset();
    Cookies.get.mockReset();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<LoginModal />);
    expect(getByText(/Get started by logging in to your account/i)).toBeInTheDocument();
  });

  it('handles login success', async () => {
    userServices.login.mockResolvedValue(true);
    const { getByPlaceholderText, getByText } = render(<LoginModal />);
    fireEvent.change(getByPlaceholderText(/Enter email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(getByText(/Login/i));

    await waitFor(() => expect(userServices.login).toHaveBeenCalledWith('test@example.com', 'password123'));
    // Add more assertions here to check if the modal was closed, notifications were fetched, etc.
  });

  it('handles login failure', async () => {
    userServices.login.mockResolvedValue(false);
    const { getByPlaceholderText, getByText, findByText } = render(<LoginModal />);
    fireEvent.change(getByPlaceholderText(/Enter email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(getByPlaceholderText(/Password/i), { target: { value: 'wrongPassword' } });
    fireEvent.click(getByText(/Login/i));

    const errorMessage = await findByText(/Invalid login credentials. Please try again./i);
    expect(errorMessage).toBeInTheDocument();
  });

  
});