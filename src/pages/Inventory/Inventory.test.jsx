import React from 'react';
import { render } from '@testing-library/react';
import Inventory from './Inventory';


jest.mock('js-cookie', () => ({
  get: jest.fn().mockReturnValue('mocked-auth-token'), 
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../services/resourcesServices', () => ({
  getResources: jest.fn().mockResolvedValue([]), 
}));

jest.mock('../../stores/userStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: { role: 1 }, 
  })),
}));

describe('Inventory Component', () => {
  test('renders Inventory component without crashing', async () => {
    const { getByText, getByPlaceholderText } = render(<Inventory />);

    expect(getByText('Inventory')).toBeInTheDocument(); 

    // Simula uma interação de busca
    const searchInput = getByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();

  });
});
