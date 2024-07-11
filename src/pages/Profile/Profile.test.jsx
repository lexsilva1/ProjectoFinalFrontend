import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; 
import Profile from './Profile';

test('renders profile component', () => {
  const { getByText } = render(
    <Router>
      <Profile />
    </Router>
  );


  const profileTitle = getByText(/First Name:/i);
  expect(profileTitle).toBeInTheDocument();
});
