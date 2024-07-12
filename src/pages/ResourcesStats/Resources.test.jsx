import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResourcesStats from './ResourcesStats';
import { getResourceStatistics } from '../../services/resourcesServices';
import Cookies from 'js-cookie';

// Mock services and components
jest.mock('../../services/resourcesServices');
jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

jest.mock('../../components/Header/Header', () => () => <div>Mocked Header</div>);
jest.mock('../../components/Charts/VersatileBarChat', () => () => <div>Mocked VersatileBarChart</div>);
jest.mock('../../components/Charts/CustomPieChart', () => () => <div>Mocked CustomPieChart</div>);

describe('ResourcesStats Component', () => {
  beforeEach(() => {
    Cookies.get.mockReturnValue('mockedToken');
    getResourceStatistics.mockResolvedValue({
      resourceQuantityPerLab: {
        Coimbra: { item1: 10, item2: 20 },
        Vila_Real: { item1: 5, item2: 15 },
      },
      resourceQuantityPerProject: {
        'Forge X': { item1: 12, item2: 18 },
        'Project Y': { item1: 7, item2: 14 },
      },
      allresources: [
        { name: 'Resource1', value: 30 },
        { name: 'Resource2', value: 20 },
      ],
    });
  });

  test('renders ResourcesStats component correctly', async () => {
    render(<ResourcesStats />);

    // Await the updates to be applied
    await waitFor(() => {
      // Verify the static text
      expect(screen.getByText('Mocked Header')).toBeInTheDocument();
      expect(screen.getByText('Lab Resource Quantities')).toBeInTheDocument();
      expect(screen.getByText('Project Resource Quantities')).toBeInTheDocument();
      expect(screen.getByText('Resource Types')).toBeInTheDocument();

      // Verify the mocked components
      expect(screen.getAllByText('Mocked VersatileBarChart')).toHaveLength(2);
      expect(screen.getByText('Mocked CustomPieChart')).toBeInTheDocument();
    });
  });
});