import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Users from './Users';

const mockUsers = [
  { userId: '1', name: 'Alice', skills: ['JavaScript'] },
  { userId: '2', name: 'Bob', skills: ['Python'] },
];

const currentUser = { id: '1', name: 'Alice' };

describe('Users Component', () => {
  beforeEach(() => {
    render(<Users user={currentUser} users={mockUsers} />);
  });

  it('renders the header', () => {
    expect(screen.getByText(/users/i)).toBeInTheDocument();
  });

  it('fetches users on mount', () => {
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });

  it('filters users by name', () => {
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: 'Bob' },
    });
    
    expect(screen.getByText(/bob/i)).toBeInTheDocument();
    expect(screen.queryByText(/alice/i)).not.toBeInTheDocument();
  });

  it('filters users by skill', () => {
    fireEvent.change(screen.getByPlaceholderText(/search by skill/i), {
      target: { value: 'Python' },
    });
    
    expect(screen.getByText(/bob/i)).toBeInTheDocument();
    expect(screen.queryByText(/alice/i)).not.toBeInTheDocument();
  });

  it('displays no users found when search yields no results', () => {
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: 'Charlie' },
    });
    
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('excludes current user from list', () => {
    expect(screen.queryByText(/alice/i)).not.toBeInTheDocument();
  });
});
