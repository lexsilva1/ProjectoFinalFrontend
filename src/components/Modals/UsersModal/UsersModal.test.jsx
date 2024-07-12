import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UsersModal from './UsersModal';

describe('UsersModal', () => {
  const handleClose = jest.fn();
  const onAddUser = jest.fn();
  const inputs = { teamMembers: [] };
  const setInputs = jest.fn();
  const users = [
    { userId: 1, firstName: 'John', lastName: 'Doe', userPhoto: null },
    { userId: 2, firstName: 'Jane', lastName: 'Doe', userPhoto: null },
    { userId: 3, firstName: 'Alice', lastName: 'Smith', userPhoto: null },
  ];

  beforeEach(() => {
    render(
      <UsersModal
        show={true}
        handleClose={handleClose}
        inputs={inputs}
        setInputs={setInputs}
        users={users}
        onAddUser={onAddUser}
      />
    );
  });

  test('renders the modal with correct title', () => {
    expect(screen.getByText(/users/i)).toBeInTheDocument();
  });

  test('renders search input', () => {
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  test('filters users based on search input', () => {
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Jane' },
    });
    expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
  });


  test('displays user avatar or default image', () => {
    expect(screen.getByAltText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByAltText(/jane doe/i)).toBeInTheDocument();
  });

  test('renders the correct number of users initially', () => {
    const userElements = screen.getAllByText(/add/i);
    expect(userElements).toHaveLength(users.length);
  });




});
