import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WarningPage from './WarningPage';
import { BrowserRouter } from 'react-router-dom';

// Mock do useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // importa todas as funcionalidades originais
  useNavigate: () => jest.fn(), // sobrescreve useNavigate com uma função mock
}));

describe('WarningPage Component', () => {
  test('deve renderizar o texto de acesso negado', () => {
    render(
      <BrowserRouter>
        <WarningPage />
      </BrowserRouter>
    );

    expect(screen.getByText('403 - Acesso Negado')).toBeInTheDocument();
    expect(screen.getByText('Desculpe, você não tem permissão para acessar esta página.')).toBeInTheDocument();
  });

});