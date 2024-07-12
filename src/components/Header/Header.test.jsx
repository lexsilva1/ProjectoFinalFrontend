import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import userStore from '../../stores/userStore'; 


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

// Mock para o userStore
jest.mock('../../stores/userStore', () => ({
  __esModule: true,
  default: jest.fn(),
  getState: jest.fn(() => ({
    isLoggedIn: false,
    user: null,
    unreadMessages: 0,
    notifications: [],
  })),
}));

describe('Header component', () => {

  test('renderiza corretamente com usuário não logado', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Verifica se botões de registro e login estão presentes
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

});



