import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner from './Banner';

test('renders Banner text structure correctly', () => {
  render(<Banner isLoggedIn={false} />);
  
  const firstParagraph = screen.getByText('Empower your projects');
  expect(firstParagraph).toBeInTheDocument();

  const secondParagraph = screen.getByText('where seamless management');
  expect(secondParagraph).toBeInTheDocument();

  const thirdParagraph = screen.getByText('meets success.');
  expect(thirdParagraph).toBeInTheDocument();
});

