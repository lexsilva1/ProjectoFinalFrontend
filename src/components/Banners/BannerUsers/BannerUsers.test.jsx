import React from 'react';
import { render, screen } from '@testing-library/react';
import BannerUsers from './BannerUsers';

describe('BannerUsers Component', () => {
    test('renders the image correctly', () => {
      render(<BannerUsers />);
      
      // Verifies if the image is present and has the correct alt attribute
      const imageElement = screen.getByAltText('usersImage');
      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute('src', 'usersImage.jpg');
    });
  });

describe('BannerUsers Component', () => {
  test('renders the first line of text correctly', () => {
    render(<BannerUsers />);
    
    // Verifies if the first paragraph of text is present
    const firstParagraph = screen.getByText('Empower your team');
    expect(firstParagraph).toBeInTheDocument();
  });
});
describe('BannerUsers Component', () => {
    test('renders the second and third lines of text correctly', () => {
      render(<BannerUsers />);
      
      // Verifies if the second paragraph of text is present
      const secondParagraph = screen.getByText('for seamless collaboration');
      expect(secondParagraph).toBeInTheDocument();
  
      // Verifies if the third paragraph of text is present
      const thirdParagraph = screen.getByText('and success.');
      expect(thirdParagraph).toBeInTheDocument();
    });
  });