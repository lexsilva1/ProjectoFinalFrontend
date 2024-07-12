
import React from 'react';
import { render } from '@testing-library/react';
import InfoBox from './InfoBox';

describe('InfoBox component', () => {

  it('renders description texts', () => {
    const { getByText } = render(<InfoBox />);
    expect(getByText('Your solution for managing innovative tech projects.')).toBeInTheDocument();
    expect(getByText('Collaborate, track progress, and optimize resources from start to finish.')).toBeInTheDocument();
    expect(getByText('Forge the future with us.')).toBeInTheDocument();
  });

  it('has correct styling and structure', () => {
    const { container } = render(<InfoBox />);
    
    const infoBox = container.firstChild;
    expect(infoBox).toHaveStyle('width: 60%');
    expect(infoBox).toHaveStyle('position: relative');
  });
});

