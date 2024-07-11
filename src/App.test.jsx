import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App component routing', () => {
  test('renders Home component for "/inventory" route', () => {
    render(
      <MemoryRouter initialEntries={['/inventory']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/inventory/i)).toBeInTheDocument(); 
  });
});
