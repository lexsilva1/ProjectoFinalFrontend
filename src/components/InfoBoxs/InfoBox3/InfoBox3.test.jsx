import { render, screen } from '@testing-library/react';
import InfoBox3 from './InfoBox3';

describe('InfoBox3 Component', () => {
  test('renders Efficient Management, Dynamic Collaboration, and Constant Innovation headings', () => {
    // Render the InfoBox3 component
    render(<InfoBox3 />);
    
    // Assertions to check if all headings are rendered
    expect(screen.getByText('Efficient Management')).toBeInTheDocument();
    expect(screen.getByText('Dynamic Collaboration')).toBeInTheDocument();
    expect(screen.getByText('Constant Innovation')).toBeInTheDocument();
  });

  test('renders descriptions for each heading', () => {
    // Render the InfoBox3 component
    render(<InfoBox3 />);
    
    // Assertions to check if descriptions are rendered
    expect(screen.getByText('Track and manage projects from start to finish in a simplified way.')).toBeInTheDocument();
    expect(screen.getByText('Facilitate the sharing of labs and resources for continuous innovation.')).toBeInTheDocument();
    expect(screen.getByText('Explore innovative initiatives and boost creativity as a team.')).toBeInTheDocument();
  });
});
