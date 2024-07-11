import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner2 from './Banner2';

describe('Banner2 Component', () => {
  test('renders image and text correctly', () => {
    render(<Banner2 />);
    
    // Verifica se a imagem está presente e possui o atributo alt correto
    const imageElement = screen.getByAltText('projectsImage');
    expect(imageElement).toBeInTheDocument();

    // Verifica se o primeiro parágrafo de texto está presente
    const firstParagraph = screen.getByText('Boost your productivity');
    expect(firstParagraph).toBeInTheDocument();

    // Verifica se o segundo parágrafo de texto está presente
    const secondParagraph = screen.getByText('with smart task management.');
    expect(secondParagraph).toBeInTheDocument();
  });
});


