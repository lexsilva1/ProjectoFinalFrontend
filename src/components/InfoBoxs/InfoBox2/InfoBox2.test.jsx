import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InfoBox2 from './InfoBox2';

describe('InfoBox2 Component', () => {

  test('initially displays the first card', () => {
    const { getByText } = render(<InfoBox2 />);
    expect(getByText(/Our Innovative Mission/i)).toBeInTheDocument();
  });
});

