import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner3 from './Banner3';

describe('Banner3 Component', () => {
  test('renders the image correctly', () => {
    render(<Banner3 />);
    
    // Check if the image is present and has the correct alt attribute
    const imageElement = screen.getByAltText('projectsImage');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'projectsImage3.jpg');
  });
});
describe('Banner3 Component', () => {
    test('renders the first line of text correctly', () => {
      render(<Banner3 />);
      
    // Check if the first paragraph of text is present
      const firstParagraph = screen.getByText('Enhance your teamwork');
      expect(firstParagraph).toBeInTheDocument();
    });
  });

  describe('Banner3 Component', () => {
    test('renders the second and third lines of text correctly', () => {
      render(<Banner3 />);
      
        // Check if the second paragraph of text is present
      const secondParagraph = screen.getByText('with streamlined');
      expect(secondParagraph).toBeInTheDocument();
  
        // Check if the third paragraph of text is present
      const thirdParagraph = screen.getByText('project coordination.');
      expect(thirdParagraph).toBeInTheDocument();
    });
  });
  