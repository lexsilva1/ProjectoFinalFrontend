import React from 'react';
import { Button } from 'react-bootstrap'; // assumindo que você está usando react-bootstrap
import './UserCard.css'; // assumindo que você tem um arquivo CSS para estilizar o cartão

const UserCard = ({ user }) => {
  const { firstName, lastName, imageUrl } = user;

  return (
    <div className="user-card">
      <img src={imageUrl} alt={`${firstName} ${lastName}`} className="user-image" />
      <h2 className="user-name">{`${firstName} ${lastName}`}</h2>
      <div className="user-actions">
        <Button variant="primary">Send Message</Button>
        <Button variant="secondary">View Profile</Button>
      </div>
    </div>
  );
};

export default UserCard;