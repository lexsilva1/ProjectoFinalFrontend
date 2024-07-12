import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';
import { getStatistics } from '../../services/projectServices';
import Cookies from 'js-cookie';

jest.mock('../../services/projectServices');
jest.mock('js-cookie');

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Mock the getStatistics service call
    getStatistics.mockResolvedValue({
      totalProjects: 10,
      averageMembersPerProject: 5,
      averageExecutionTime: 30,
      projectsByLab: {
        'Lab A': 5,
        'Lab B': 5,
      },
      totalPlanningProjects: { 'Lab A': 2, 'Lab B': 3 },
      totalInProgressProjects: { 'Lab A': 1, 'Lab B': 1 },
      totalReadyProjects: { 'Lab A': 1, 'Lab B': 0 },
      totalApprovedProjects: { 'Lab A': 1, 'Lab B': 1 },
      totalCancelledProjects: { 'Lab A': 0, 'Lab B': 0 },
      totalCompletedProjects: { 'Lab A': 0, 'Lab B': 0 },
    });

    // Mock the Cookies.get method
    Cookies.get.mockReturnValue('fake-auth-token');
  });

  it('renders loading state initially', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});