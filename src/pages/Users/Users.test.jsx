import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Users from './Users';
import * as userServices from '../services/userServices';
import userStore from '../stores/userStore';

jest.mock('../services/userServices', () => ({
  findAllUsers: jest.fn(),
}));

jest.mock('js-cookie', () => ({
  get: jest.fn(() => 'mockToken'),
}));

describe('Users Component', () => {
  const mockUser = { id: 1, firstName: 'Test', lastName: 'User' };
  
  beforeEach(() => {
    userStore.setState({ user: mockUser });
    userServices.findAllUsers.mockResolvedValue([
      { userId: 1, firstName: 'Test', lastName: 'User', skills: [], interests: [] },
      { userId: 2, firstName: 'Jane', lastName: 'Doe', skills: [{ name: 'React' }], interests: [] },
      { userId: 3, firstName: 'John', lastName: 'Smith', skills: [], interests: [{ name: 'Node.js' }] },
    ]);
    
    render(<Users />);
  });

  test('renders the header', () => {
    expect(screen.getByText(/users/i)).toBeInTheDocument(); // Assuming "Users" is part of the Header
  });

  test('fetches users on mount', async () => {
    await waitFor(() => {
      expect(userServices.findAllUsers).toHaveBeenCalledWith('mockToken');
    });
  });

  test('displays fetched users', async () => {
    await waitFor(() => {
      expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
      expect(screen.getByText(/john smith/i)).toBeInTheDocument();
    });
  });

  test('filters users by name', async () => {
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Jane' },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
      expect(screen.queryByText(/john smith/i)).not.toBeInTheDocument();
    });
  });

  test('filters users by skill', async () => {
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'React' },
    });
    fireEvent.change(screen.getByText(/search by name/i), {
      target: { value: 'skill' },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
      expect(screen.queryByText(/john smith/i)).not.toBeInTheDocument();
    });
  });

  test('filters users by interest', async () => {
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Node.js' },
    });
    fireEvent.change(screen.getByText(/search by name/i), {
      target: { value: 'interest' },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/john smith/i)).toBeInTheDocument();
      expect(screen.queryByText(/jane doe/i)).not.toBeInTheDocument();
    });
  });

  test('excludes current user from list', async () => {
    await waitFor(() => {
      expect(screen.queryByText(/test user/i)).not.toBeInTheDocument();
    });
  });

  test('displays no users found when search yields no results', async () => {
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'NonExistentUser' },
    });
    
    await waitFor(() => {
      expect(screen.queryByText(/jane doe/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/john smith/i)).not.toBeInTheDocument();
    });
  });

  test('handles errors when fetching users', async () => {
    userServices.findAllUsers.mockRejectedValue(new Error('Error fetching users'));
    
    render(<Users />);
    
    await waitFor(() => {
      expect(screen.getByText(/error fetching users/i)).toBeInTheDocument(); // Assuming you handle errors like this
    });
  });
});
