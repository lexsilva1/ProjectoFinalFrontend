import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotificationCard from './NotificationCard'; 

test('displays the correct date', () => {
  const notification = {
    projectName: 'Test Project',
    date: '2023-01-01',
    type: 'info',
    isRead: false,
    notificationId: '1',
    otherUserid: 'user123'
  };

  const { getByText } = render(
    <MemoryRouter>
      <NotificationCard notification={notification} />
    </MemoryRouter>
  );

  expect(getByText('2023-01-01')).toBeInTheDocument();

  
});


