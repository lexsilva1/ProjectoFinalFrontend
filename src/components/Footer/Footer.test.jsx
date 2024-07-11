import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders logo', () => {
    const { getByAltText } = render(<Footer />);
    const logo = getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders copyright information', () => {
    const { getByText } = render(<Footer />);
    const copyrightText = getByText(/© 2024 ForgeXperimentalProjects. All rights reserved./i);
    expect(copyrightText).toBeInTheDocument();
  });

  test('renders Laboratories section', () => {
    const { getByText } = render(<Footer />);
    const laboratoriesHeading = getByText('Laboratories:');
    expect(laboratoriesHeading).toBeInTheDocument();
  });

  test('renders Legal Information section', () => {
    const { getByText } = render(<Footer />);
    const legalInfoHeading = getByText('Legal Information:');
    expect(legalInfoHeading).toBeInTheDocument();
  });

  test('renders Contact Us section', () => {
    const { getByText } = render(<Footer />);
    const contactHeading = getByText('Contact Us:');
    expect(contactHeading).toBeInTheDocument();
  });

  test('renders phone number', () => {
    const { getByText } = render(<Footer />);
    const phoneNumber = getByText('239 101 001');
    expect(phoneNumber).toBeInTheDocument();
  });

  test('renders email address', () => {
    const { getByText } = render(<Footer />);
    const emailAddress = getByText('forgexperimentalprojects@mail.com');
    expect(emailAddress).toBeInTheDocument();
  });
});
