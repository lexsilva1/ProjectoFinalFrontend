import React from 'react';
import { render, screen } from '@testing-library/react';
// Import the component to test
import InfoBox4 from './InfoBox4';

describe('InfoBox4 Component', () => {
  test('renders the heading text correctly', () => {
    // Render the InfoBox4 component
    render(<InfoBox4 />);
    
    // Assertion to check if the heading text is rendered
    expect(screen.getByText('Check out our latest projects')).toBeInTheDocument();
  });
});

