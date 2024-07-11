import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from './UserCard';
import userStore from '../../../stores/userStore';
import { setAdminStatus } from '../../../services/userServices';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
}));

jest.mock('../../../stores/userStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../services/userServices', () => ({
  setAdminStatus: jest.fn(),
}));

describe('UserCard Component', () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    userPhoto: 'avatar.jpg',
    privacy: false,
    userId: '123',
    role: 'Manager',
  };

  beforeEach(() => {
    userStore.mockReturnValue({
      user: { role: 1 },
      setSelectedUserMessages: jest.fn(),
    });
  });

  test('renders UserCard component with correct user information', () => {
    render(<UserCard user={user} />);

    expect(screen.getByText(`${user.firstName} ${user.lastName}`)).toBeInTheDocument();
    expect(screen.getByAltText(`${user.firstName} ${user.lastName}`)).toBeInTheDocument();
  });

  test('does not render profile link if privacy is true', () => {
    const userWithPrivateProfile = {
      firstName: 'Jane',
      lastName: 'Doe',
      userPhoto: 'avatar.jpg',
      privacy: true,
      userId: '456',
      role: 'Employee',
    };
  
    render(<UserCard user={userWithPrivateProfile} />);
  
    expect(screen.queryByRole('link', { name: /user profile/i })).not.toBeInTheDocument();
  });

});
