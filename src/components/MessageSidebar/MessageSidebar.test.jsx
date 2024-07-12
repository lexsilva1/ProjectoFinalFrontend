import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageSidebar from './MessageSidebar';

describe('MessageSidebar', () => {
  const mockOnSearch = jest.fn();
  const mockOnInboxClick = jest.fn();

  beforeEach(() => {
    render(<MessageSidebar onSearch={mockOnSearch} onInboxClick={mockOnInboxClick} />);
  });

  test('renders the MessageSidebar component', () => {
    expect(screen.getByText(/Messages/i)).toBeInTheDocument();
  });

  test('renders the search input', () => {
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    expect(searchInput).toBeInTheDocument();
  });

  test('calls onSearch when typing in the search input', () => {
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  test('renders the inbox icon', () => {
    expect(screen.getByText(/Inbox/i)).toBeInTheDocument();
  });

  test('calls onInboxClick when inbox icon is clicked', () => {
    const inboxIcon = screen.getByText(/Inbox/i);
    fireEvent.click(inboxIcon);
    expect(mockOnInboxClick).toHaveBeenCalledTimes(1);
  });

  test('renders the unread icon', () => {
    expect(screen.getByText(/Unread/i)).toBeInTheDocument();
  });


  test('search input is empty initially', () => {
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    expect(searchInput.value).toBe('');
  });

  test('search input can be cleared', () => {
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput.value).toBe('');
  });

  test('search input calls onSearch with correct value', () => {
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(searchInput, { target: { value: 'Hello' } });
    expect(mockOnSearch).toHaveBeenCalledWith(expect.any(Object));
  });
});
