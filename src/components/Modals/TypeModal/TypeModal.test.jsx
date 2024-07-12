import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TypeModal from './TypeModal';

describe('TypeModal', () => {
  const onHide = jest.fn();
  const onTypeSelect = jest.fn();
  const types = ['Type 1', 'Type 2', 'Type 3'];

  beforeEach(() => {
    render(
      <TypeModal 
        show={true} 
        onHide={onHide} 
        title="Select Type" 
        types={types} 
        onTypeSelect={onTypeSelect} 
      />
    );
  });

  test('renders the modal with correct title', () => {
    expect(screen.getByText(/select type/i)).toBeInTheDocument();
  });

  test('calls onHide when the modal is closed', () => {
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onHide).toHaveBeenCalled();
  });




});

